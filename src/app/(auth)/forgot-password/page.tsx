// app/(auth)/agent/forgot-password/page.tsx
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 border rounded-2xl p-4">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight ">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to receive a password reset OTP
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
