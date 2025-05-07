import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';

export default function PrivateRoute() {
  const status = useAppSelector((s) => s.auth.status);
  if (status !== 'auth') return <Navigate to="/login" replace />;
  return <Outlet />;
}
