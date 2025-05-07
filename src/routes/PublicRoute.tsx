import { Outlet } from 'react-router-dom';
export default function PublicRoute() {
  return <Outlet />;            // could add “already logged in → /”
}
