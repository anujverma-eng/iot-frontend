import { useSearchParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { handleCallback } from '../store/authSlice';

export default function Callback() {
  const [search] = useSearchParams();
  const code = search.get('code');
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((s:RootState)=>s.auth.status);

  useEffect(()=>{
    if (code) dispatch(handleCallback(code));
  }, [code, dispatch]);

  if (status==='auth') return <Navigate to="/" replace />;
  if (status==='error') return <p>Auth failed 🤕</p>;
  return <p>Signing you in…</p>;
}
