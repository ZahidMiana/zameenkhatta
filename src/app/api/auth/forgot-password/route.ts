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

  // Clean up any existing OTPs for this email first
  await prisma.passwordReset.deleteMany({
    where: { 
      email,
      OR: [
        { used: true },
        { expiresAt: { lt: new Date() } }
      ]
    }
  });

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
    console.log('Password reset OTP sent successfully to:', email);
    
    return successResponse(
      null,
      'Password reset OTP has been sent to your email. Please check your inbox and spam folder.'
    );
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    
    // Delete the OTP since email failed
    await prisma.passwordReset.deleteMany({
      where: { email, otp }
    });
    
    return errorResponse(
      'Failed to send email. Please try again later or contact support.',
      500
    );
  }
});