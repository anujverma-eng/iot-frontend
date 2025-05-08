// src/lib/tokenManager.ts
const ACCESS = 'iot.accessToken';
const REFRESH = 'iot.refreshToken';
const EXPIRES = 'iot.expiresAt';  // epoch seconds

const store = sessionStorage;   // 🚨 switch from localStorage

export type Tokens = { accessToken: string; refreshToken: string; expiresAt: number };

export const tokenManager = {
  load(): Tokens | null {
    const at  = store.getItem(ACCESS);
    const rt  = store.getItem(REFRESH);
    const exp = store.getItem(EXPIRES);
    if (!at || !rt || !exp) return null;
    return { accessToken: at, refreshToken: rt, expiresAt: Number(exp) };
  },
  save(t: Tokens) {
    store.setItem(ACCESS , t.accessToken);
    store.setItem(REFRESH, t.refreshToken);
    store.setItem(EXPIRES, String(t.expiresAt));
  },
  clear() {
    store.removeItem(ACCESS);
    store.removeItem(REFRESH);
    store.removeItem(EXPIRES);
  },
  /** true if token will expire within the next minute */
  needsRefresh(): boolean {
    const exp = Number(store.getItem(EXPIRES) || 0);
    return Date.now() / 1000 > exp - 60;
  },
  /* optional: hit Cognito global‑logout end‑point */
  cognitoLogout() {
    const p = new URLSearchParams({
      client_id : import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
      logout_uri: import.meta.env.VITE_COGNITO_LOGOUT_URI,
    });
    window.location.href =
      `${import.meta.env.VITE_COGNITO_DOMAIN}/logout?${p}`;
  },
};
