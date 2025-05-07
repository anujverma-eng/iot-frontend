import axios, { AxiosError } from 'axios';
import { tokenManager } from './tokenManager';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15_000,
});

/* ---------- request: attach JWT ---------- */
api.interceptors.request.use((config) => {
  const tokens = tokenManager.load();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

/* ---------- response: 401 handler ---------- */
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    if (err.response?.status !== 401) throw err;

    /* avoid parallel refreshes */
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccess = await refreshPromise;
    // retry original call with new token
    const cfg = err.config!;
    cfg.headers = new axios.AxiosHeaders(cfg.headers);
    cfg.headers.set('Authorization', `Bearer ${newAccess}`);
    return api(cfg);
  },
);

export default api;

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
