import { useState } from 'react';
import AuthCard from '../components/ui/AuthCard';
import Input from '../components/ui/Input';
export default function LoginPage() {
  const [form, set] = useState({ email: '', password: '' });
  return (
    <AuthCard title="Sign In">
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => set({ ...form, email: e.target.value })}
      />
      <Input
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => set({ ...form, password: e.target.value })}
      />

      <button className="btn-primary w-full mt-4">Sign In</button>

      <div className="text-sm mt-4 flex justify-between">
        <a href="/forgot-password" className="link">Forgot password?</a>
        <a href="/register" className="link">Create account</a>
      </div>
    </AuthCard>
  );
}