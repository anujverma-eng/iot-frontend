import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Callback from './pages/AuthCallback';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<Callback />} />
      {/* <Route path="/*" element={<Dashboard />} /> */}
    </Routes>
  </BrowserRouter>
);
