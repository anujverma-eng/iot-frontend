import AuthCard from "../components/ui/AuthCard";

/* RegisterPage.tsx */
export default function RegisterPage() {
  return (
    <AuthCard title="Create Account">
      {/* first name, last name, email, password (2×) */}
      <button className="btn-primary w-full mt-4">Register</button>
      <p className="text-sm mt-4 text-center">
        Already have an account? <a href="/login" className="link">Sign in</a>
      </p>
    </AuthCard>
  );
}
