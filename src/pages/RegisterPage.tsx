import { useState } from "react";
import AuthCard from "../components/ui/AuthCard";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { register } from "../store/authSlice";

/* RegisterPage.tsx */
export default function RegisterPage() {
  const [form] = useState({ email: "", pw: "" });
  const dispatch = useAppDispatch();

  return (
    <AuthCard title="Create Account">
      {/* first name, last name, email, password (2×) */}
      <button
        className="btn-primary w-full mt-4"
        onClick={() => dispatch(register({ email: form.email, password: form.pw }))}
      >
        Register
      </button>
      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <a href="/login" className="link">
          Sign in
        </a>
      </p>
    </AuthCard>
  );
}
