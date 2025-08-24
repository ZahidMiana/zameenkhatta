import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { asyncHandler, successResponse, errorResponse, validateRequest } from "@/lib/error-handler";
import { z } from "zod";
import * as bcrypt from "bcrypt";

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address (e.g., user@example.com)'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter') 
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Password must contain at least one special character'),
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { email, otp, newPassword } = validateRequest(resetPasswordSchema)(body);

  // Find valid password reset request
  const resetRequest = await prisma.passwordReset.findFirst({
    where: {
      email,
      otp,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!resetRequest) {
    return errorResponse('Invalid or expired OTP', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return errorResponse('User not found', 404);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update user password and mark OTP as used in a transaction
  await prisma.$transaction(async (tx) => {
    // Update user password
    await tx.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        // Update timestamp to ensure session refresh
        updatedAt: new Date()
      },
    });
    
    // Mark all password reset requests for this email as used
    await tx.passwordReset.updateMany({
      where: { email },
      data: { used: true },
    });
  });

  // Log successful password reset
  console.log(`Password reset successful for user: ${email}`);

  return successResponse(
    { resetComplete: true },
    'Password reset successfully. You can now login with your new password.'
  );
});
