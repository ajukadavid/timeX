import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp signInUrl="/login" forceRedirectUrl="/dashboardStaff" />
    </div>
  );
}
