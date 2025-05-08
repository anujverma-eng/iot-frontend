// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tokenManager } from "../utils/tokenManager";
import { AuthClient } from "../lib/auth/cognitoClient";
import { UserRole } from "../types/User";

type Status = 'idle' | 'loading' | 'auth' | 'guest' | 'error';

interface AuthState {
  status:Status
  user: { email: string, role: UserRole } | null;
  pendingEmail: string | null;
  error: string | null;
}
const initial: AuthState = { status: "idle", user: null, pendingEmail: null, error: null };

/* ---------- Thunks ---------- */
export const login = createAsyncThunk("auth/login", async (form: { email: string; password: string }) => {
  return AuthClient.signIn(form.email, form.password);
});

export const register = createAsyncThunk("auth/register", async (form: { email: string; password: string }) => {
  await AuthClient.signUp(form.email, form.password);
  return form.email; // stash for confirm page
});

export const confirmRegister = createAsyncThunk("auth/confirmRegister", async (p: { email: string; code: string }) => {
  await AuthClient.confirmSignUp(p.email, p.code);
});

export const forgotPw = createAsyncThunk("auth/forgotPw", async (email: string) => {
  await AuthClient.forgotPassword(email);
  return email;
});

export const resetPw = createAsyncThunk("auth/resetPw", async (p: { email: string; code: string; newPw: string }) => {
  await AuthClient.confirmForgot(p.email, p.code, p.newPw);
});

export const logout = createAsyncThunk("auth/logout", async () => {
  tokenManager.clear();
  window.location.assign("/login");
});


/* helper: pull role claim out of a JWT payload */
const extractRole = (jwt: string): UserRole => {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return (payload['custom:role'] ?? UserRole.OWNER) as UserRole;
  } catch { return UserRole.OWNER; }
};

/* ---------- Slice ---------- */
const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    /* ── login flow ─────────────────────────────────────────────── */
    builder.addCase(login.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    builder.addCase(login.fulfilled, (s, a) => {
      s.status = "auth";
      s.user = {
        email: a.payload.id ?? a.meta.arg.email,
        role: extractRole(a.payload.id),
      };
      tokenManager.save({
        accessToken: a.payload.access,
        refreshToken: a.payload.refresh,
        expiresAt: a.payload.exp,
      });
    });
    builder.addCase(login.rejected, (s, a) => {
      s.status = "error";
      s.error = a.error?.message ?? "Login failed";
    });

    /* ── register (keep as you had) ─────────────────────────────── */
    builder.addCase(register.fulfilled, (s, a) => {
      s.pendingEmail = a.payload;
    });

    /* ── start‑up session probe ─────────────────────────────────── */
    builder.addCase(initSession.pending, (s) => {
      s.status = "loading";
    });
    builder.addCase(initSession.fulfilled, (s, a) => {
      s.status = "auth";
      s.user   = {
        email: a.payload.email,
        role : extractRole(a.payload.id),
      };
    });
    builder.addCase(initSession.rejected, (s, action) => {
      /* Nothing in storage or session is invalid → treat as logged‑out */
      s.status = "guest"; // user is NOT authenticated
      s.error = action.error.message ?? null;
    });
  },
});
export default slice.reducer;

export const initSession = createAsyncThunk("auth/initSession", async () => {
  const sess = await AuthClient.validateSession();
  if (!sess) throw new Error("NO_SESSION");

  tokenManager.save({
    accessToken: sess.access,
    refreshToken: sess.refresh,
    expiresAt: sess.exp,
  });

  return { email: sess.email, id: sess.id }; 
});
