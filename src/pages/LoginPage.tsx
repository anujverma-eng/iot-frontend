// src/pages/LoginPage.tsx
import { useState } from "react";
import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { login } from "../store/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status); 
  const [form, set] = useState({ email: "", password: "" });
  const error = useAppSelector((s) => s.auth.error);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-brand-600">Signing you in…</p>
      </div>
    );
  }
  
  return (
    <AuthCard title="Sign In">
      <Input label="Email" type="email" value={form.email} onChange={(e) => set({ ...form, email: e.target.value })} />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => set({ ...form, password: e.target.value })}
      />

      <button className="btn-primary w-full mt-4" onClick={() => dispatch(login(form))}>
        Sign In
      </button>

      <div className="text-sm mt-4 flex justify-between">
        <a href="/forgot-password" className="link">
          Forgot password?
        </a>
        <a href="/register" className="link">
          Create account
        </a>
      </div>

      {error && <p className="mt-2 text-sm text-danger-default text-center">{error}</p>}
    </AuthCard>
  );
}
