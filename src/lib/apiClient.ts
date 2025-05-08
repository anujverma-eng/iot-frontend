// src/lib/apiClient.ts
import axios, { AxiosError, type AxiosInstance } from "axios";
import { tokenManager } from "../utils/tokenManager";
import { AuthClient } from "./auth/cognitoClient";
import { v4 as uuid } from "uuid";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

/* ---------- instance ---------- */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

/* ---------- request: add JWT & trace‑id ---------- */
apiClient.interceptors.request.use((cfg) => {
  const t = tokenManager.load();
  if (t?.accessToken) cfg.headers.Authorization = `Bearer ${t.accessToken}`;
  cfg.headers["X-Request-ID"] = uuid(); // 👈 helpful in logs
  return cfg;
});

/* ---------- response: 401 queue & refresh ---------- */
let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config!;
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    /* mark so we don’t loop */
    original._retry = true;

    /* already refreshing → push request into queue */
    if (isRefreshing) {
      return new Promise((res) =>
        queue.push((token) => {
          original.headers!.Authorization = `Bearer ${token}`;
          res(apiClient(original));
        })
      );
    }

    /* start a refresh cycle */
    isRefreshing = true;
    try {
      const token = await refreshAccessToken(); // 👈 fixed helper (below)

      /* update default header so new calls use fresh token */
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;

      /* flush queued calls */
      queue.forEach((fn) => fn(token));
      queue = [];

      /* retry the original request */
      original.headers!.Authorization = `Bearer ${token}`;
      return apiClient(original);
    } catch (refreshErr) {
      /* refresh failed → sign‑out hard */
      tokenManager.clear();
      window.location.assign("/login");
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;

/* -----------------------------------------------------------------------
   helper – silent refresh via amazon‑cognito‑identity‑js
   -------------------------------------------------------------------- */
async function refreshAccessToken(): Promise<string> {
  const tokens = tokenManager.load();
  if (!tokens) throw new Error("No refresh token in storage");

  // ask Cognito for a fresh access JWT
  const newAccess = await AuthClient.refresh(tokens.refreshToken);

  /* Cognito does NOT rotate the refresh token by default.
     We therefore keep the existing refreshToken in storage. */
  const updated = {
    accessToken: newAccess,
    refreshToken: tokens.refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 h from now
  };
  tokenManager.save(updated);
  return updated.accessToken;
}
