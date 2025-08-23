"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success("Password reset instructions sent to your email");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSubmitted ? "Check Your Email" : "Forgot Password?"}
          </h2>
          <p className="mt-2 text-gray-600">
            {isSubmitted 
              ? "We've sent password reset instructions to your email address."
              : "Enter your email address and we'll send you instructions to reset your password."
            }
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Sent Successfully!</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    We've sent password reset instructions to <strong>{email}</strong>.
                    Please check your email and follow the instructions to reset your password.
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail("");
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      try again
                    </button>
                  </p>
                </div>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
                      Reset Password with OTP
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">
                      Return to Login
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/">
                      Go to Homepage
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
