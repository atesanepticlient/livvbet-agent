// components/password-strength.tsx
"use client";

import { useEffect, useState } from "react";

type PasswordStrength = "weak" | "medium" | "strong" | "";

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const [strength, setStrength] = useState<PasswordStrength>("");

  useEffect(() => {
    if (!password) {
      setStrength("");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    const strengthPoints = [
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (strengthPoints <= 2) {
      setStrength("weak");
    } else if (strengthPoints <= 4) {
      setStrength("medium");
    } else {
      setStrength("strong");
    }
  }, [password]);

  if (!strength) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div
          className={`h-1 w-full rounded-full ${
            strength === "weak"
              ? "bg-red-500"
              : strength === "medium"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />
        <span className="text-xs text-muted-foreground capitalize">
          {strength}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {strength === "weak" && "Password is too weak"}
        {strength === "medium" && "Password could be stronger"}
        {strength === "strong" && "Strong password!"}
      </p>
    </div>
  );
}
