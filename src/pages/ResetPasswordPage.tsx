import AuthCard from "../components/ui/AuthCard";
import Input from "../components/ui/Input";

/* ResetPasswordPage.tsx (step 2 of forgot‑flow) */
export default function ResetPasswordPage() {
  return (
    <AuthCard title="Choose new password">
      <Input label="Confirmation code" />
      <Input label="New password" type="password" />
      <button className="btn-primary w-full mt-4">Confirm</button>
    </AuthCard>
  );
}
