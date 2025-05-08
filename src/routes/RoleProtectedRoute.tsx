import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import type { JSX } from 'react';
import type { UserRole } from '../types/User';

interface User {
  email: string;
  role: UserRole;
}

interface Props {
  roles: UserRole[];
  children: JSX.Element;
}

export const RoleProtectedRoute = ({ roles, children }: Props) => {
  const { user, status } = useAppSelector((s) => s.auth) as { user: User | null; status: string };
  const loc = useLocation();

  if (status !== 'auth') return <Navigate to="/login" replace />;
  if (!user || !roles.includes(user.role as UserRole))
    return <Navigate to="/unauthorized" state={{ from: loc }} replace />;

  return children;
};
