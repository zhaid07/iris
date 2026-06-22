import CustomSignInForm from "@/components/auth/CustomSignInForm";
import AuthShell from "@/components/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell
      headline="Sign in to Iris"
      subtitle="One calm place for assignments, email, and your calendar."
    >
      <CustomSignInForm />
    </AuthShell>
  );
}
