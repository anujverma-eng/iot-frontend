import { useDispatch } from 'react-redux';
import { startLogin } from '../store/authSlice';
import type { AppDispatch } from '../store';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-surface-50">
      <h1 className="text-3xl font-semibold mb-6 text-brand-600">IoT Cloud Platform</h1>
      <button
        className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-800 text-white shadow-card2"
        onClick={()=>dispatch(startLogin())}
      >
        Sign In
      </button>
    </div>
  );
}
