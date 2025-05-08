// src/routes/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppDispatch";

export default function PrivateRoute() {
  const status = useAppSelector(s => s.auth.status);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-brand-600">Loading…</p>
      </div>
    );
  }

  if (status !== 'auth') return <Navigate to="/login" replace />;
  return <Outlet />;
}
