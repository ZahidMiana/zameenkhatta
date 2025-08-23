import { useState } from "react";

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

export function usePasswordValidation(password: string) {
  const requirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters long",
      test: (pwd: string) => pwd.length >= 8,
      met: password.length >= 8,
    },
    {
      label: "Contains at least one lowercase letter",
      test: (pwd: string) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password),
    },
    {
      label: "Contains at least one uppercase letter",
      test: (pwd: string) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password),
    },
    {
      label: "Contains at least one number",
      test: (pwd: string) => /\d/.test(pwd),
      met: /\d/.test(password),
    },
    {
      label: "Contains at least one special character (!@#$%^&*)",
      test: (pwd: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  const isValid = requirements.every((req) => req.met);
  const strength = requirements.filter((req) => req.met).length;
  
  let strengthLabel = "Very Weak";
  let strengthColor = "text-red-600";
  
  if (strength >= 5) {
    strengthLabel = "Very Strong";
    strengthColor = "text-green-600";
  } else if (strength >= 4) {
    strengthLabel = "Strong";
    strengthColor = "text-green-500";
  } else if (strength >= 3) {
    strengthLabel = "Medium";
    strengthColor = "text-yellow-500";
  } else if (strength >= 2) {
    strengthLabel = "Weak";
    strengthColor = "text-orange-500";
  }

  return {
    requirements,
    isValid,
    strength,
    strengthLabel,
    strengthColor,
  };
}

export default usePasswordValidation;
