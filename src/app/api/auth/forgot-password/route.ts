import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import emailService from "@/lib/email";
import { asyncHandler, successResponse, errorResponse } from "@/lib/error-handler";
import crypto from "crypto";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return errorResponse('Email is required', 400);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if email exists or not for security
    return successResponse(
      null,
      'If the email exists, you will receive a password reset link'
    );
  }

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save OTP to database
  await prisma.passwordReset.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });

  // Send email with OTP
  try {
    await emailService.sendPasswordResetEmail(email, otp);
    console.log('Password reset OTP sent to:', email);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    // Don't reveal email sending failure for security
  }

  return successResponse(
    null,
    'If the email exists, you will receive a password reset code'
  );
});