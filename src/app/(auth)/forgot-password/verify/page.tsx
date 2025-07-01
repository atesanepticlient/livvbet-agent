// app/(auth)/agent/forgot-password/verify/page.tsx
"use client";
import { ResetPasswordForm } from "../ResetPasswordForm";
import { notFound, useSearchParams } from "next/navigation";

export default function VerifyOTPPage() {
  const email = useSearchParams().get("email");

  if (!email) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 border rounded-2xl p-7">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight ">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the OTP sent to {email} and your new password
          </p>
        </div>
        <ResetPasswordForm email={decodeURIComponent(email)} />
      </div>
    </div>
  );
}
