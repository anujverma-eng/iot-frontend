import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";

/* ForgotPasswordPage.tsx */
export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset password">
      <Input label="Email" type="email" />
      <button className="btn-primary w-full mt-4">Send code</button>
    </AuthCard>
  );
}