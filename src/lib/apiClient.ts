import axios, { AxiosError } from 'axios';
import { tokenManager } from '../utils/tokenManager';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15_000,
});

/* ---------- request: attach JWT ---------- */
apiClient.interceptors.request.use((config) => {
  const tokens = tokenManager.load();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

/* ---------- response: 401 handler ---------- */
let isRefreshing = false;
let queue: Array<(tok: string) => void> = [];

const runQueue = (token?: string) => {
  queue.forEach(cb => cb(token ?? ''));
  queue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status !== 401) return Promise.reject(err);

    const orig = err.config!;
    if (orig._retry) return Promise.reject(err);
    orig._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((tok) => {
          orig.headers = new axios.AxiosHeaders(orig.headers);
          orig.headers.set('Authorization', `Bearer ${tok}`);
          resolve(apiClient(orig));
        });
      });
    }

    isRefreshing = true;
    try {
      const newTok = await refreshAccessToken();
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newTok}`;
      runQueue(newTok);
      return apiClient(orig);
    } catch (e) {
      runQueue();
      tokenManager.clear();
      window.location.href = '/login';
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;

/* ---------- helper: refresh with Cognito ---------- */
async function refreshAccessToken(): Promise<string> {
  const tokens = tokenManager.load();
  if (!tokens) {
    tokenManager.clear();
    window.location.assign('/login');
    throw new Error('No refresh token');
  }

  const form = new URLSearchParams({
    grant_type   : 'refresh_token',
    client_id    : import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
    refresh_token: tokens.refreshToken,
  });

  const url = `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`;
  const res = await axios.post(url, form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  /* Cognito returns new access + id tokens (optionally refresh) */
  const { access_token, refresh_token, expires_in } = res.data;
  const updated = {
    accessToken : access_token,
    refreshToken: refresh_token || tokens.refreshToken,
    expiresAt   : Math.floor(Date.now() / 1000) + expires_in,
  };
  tokenManager.save(updated);
  return updated.accessToken;
}
