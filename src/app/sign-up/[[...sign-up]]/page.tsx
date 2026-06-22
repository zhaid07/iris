import CustomSignUpForm from "@/components/auth/CustomSignUpForm";
import AuthShell from "@/components/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell
      headline="Get early access"
      subtitle="Connect your tools once. Iris handles the rest — starting tomorrow morning."
    >
      <CustomSignUpForm />
    </AuthShell>
  );
}
