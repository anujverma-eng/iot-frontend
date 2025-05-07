// src/lib/tokenManager.ts
const ACCESS = 'iot.accessToken';
const REFRESH = 'iot.refreshToken';
const EXPIRES = 'iot.expiresAt';  // epoch seconds

export type Tokens = { accessToken: string; refreshToken: string; expiresAt: number };

export const tokenManager = {
  load(): Tokens | null {
    const at  = localStorage.getItem(ACCESS);
    const rt  = localStorage.getItem(REFRESH);
    const exp = localStorage.getItem(EXPIRES);
    if (!at || !rt || !exp) return null;
    return { accessToken: at, refreshToken: rt, expiresAt: Number(exp) };
  },
  save(t: Tokens) {
    localStorage.setItem(ACCESS , t.accessToken);
    localStorage.setItem(REFRESH, t.refreshToken);
    localStorage.setItem(EXPIRES, String(t.expiresAt));
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(EXPIRES);
  },
  /** true if token will expire within the next minute */
  needsRefresh(): boolean {
    const exp = Number(localStorage.getItem(EXPIRES) || 0);
    return Date.now() / 1000 > exp - 60;
  },
};
