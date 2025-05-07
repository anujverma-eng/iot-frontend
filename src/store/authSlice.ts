import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createVerifier, toChallenge } from '../lib/pkce';
import api from '../lib/api';
import { tokenManager } from '../utils/tokenManager';

interface AuthState {
  status: 'idle'|'loading'|'auth'|'error';
  user: { email: string } | null;
}
const initial: AuthState = { status:'idle', user:null };

/* ---------- Thunks ---------- */
export const startLogin = createAsyncThunk(
  'auth/startLogin',
  async () => {
    const verifier  = createVerifier();
    const challenge = await toChallenge(verifier);
    sessionStorage.setItem('pkce.v', verifier);   // temp cache

    const params = new URLSearchParams({
      client_id : import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
      response_type: 'code',
      scope: 'openid email profile',
      redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });
    window.location.assign(
      `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize?${params}`,
    );
  },
);

export const handleCallback = createAsyncThunk(
  'auth/handleCallback',
  async (authCode: string) => {
    const verifier = sessionStorage.getItem('pkce.v')!;
    const body = new URLSearchParams({
      grant_type   : 'authorization_code',
      client_id    : import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
      redirect_uri : import.meta.env.VITE_COGNITO_REDIRECT_URI,
      code         : authCode,
      code_verifier: verifier,
    });
    const url = `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`;
    const res = await api.post(url, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, refresh_token, expires_in, id_token } = res.data;
    tokenManager.save({
      accessToken : access_token,
      refreshToken: refresh_token,
      expiresAt   : Math.floor(Date.now()/1000)+expires_in,
    });

    /* decode id_token for basic user info */
    const [, payload] = id_token.split('.');
    const user = JSON.parse(atob(payload));
    return { email: user.email } as AuthState['user'];
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  tokenManager.clear();
  window.location.assign('/login');
});

/* ---------- Slice ---------- */
const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(handleCallback.pending,  (s)=>{s.status='loading';});
    b.addCase(handleCallback.fulfilled,(s,a)=>{s.status='auth';s.user=a.payload;});
    b.addCase(handleCallback.rejected, (s)=>{s.status='error';});
  },
});
export default slice.reducer;
