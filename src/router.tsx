import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PublicRoute from "./routes/PublicRoute";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import { RoleProtectedRoute } from "./routes/RoleProtectedRoute";
import { UserRole } from "./types/User";
import Unauthorized from "./pages/Unauthorized";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- public (logged‑out) ---------- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* ---------- private (logged‑in) ---------- */}
        <Route element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="/logout" element={<Logout />} />

          {/* role‑guarded admin area */}
          <Route element={<RoleProtectedRoute roles={[UserRole.ADMIN]} />}>
            {/* <Route path="/admin" element={<Admin />} /> */}
          </Route>

          {/* 403 page — user is logged‑in but not allowed */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        {/* ---------- fall‑through ---------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
