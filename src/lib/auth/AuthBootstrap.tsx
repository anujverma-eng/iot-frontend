// src/lib/auth/AuthBootstrap.tsx
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { initSession } from "../../store/authSlice";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initSession());
  }, [dispatch]);
  return null;
}
