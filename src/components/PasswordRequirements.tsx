import React from "react";
import { Check, X } from "lucide-react";
import { PasswordRequirement } from "@/hooks/use-password-validation";

interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
  strength: number;
  strengthLabel: string;
  strengthColor: string;
  show: boolean;
}

export default function PasswordRequirements({
  requirements,
  strength,
  strengthLabel,
  strengthColor,
  show,
}: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Password Strength:</span>
          <span className={`text-sm font-medium ${strengthColor}`}>{strengthLabel}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              strength >= 5
                ? "bg-green-600"
                : strength >= 4
                ? "bg-green-500"
                : strength >= 3
                ? "bg-yellow-500"
                : strength >= 2
                ? "bg-orange-500"
                : "bg-red-500"
            }`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center space-x-2">
            {requirement.met ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm ${
                requirement.met ? "text-green-700" : "text-gray-600"
              }`}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
