import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { asyncHandler, successResponse, errorResponse, validateRequest } from "@/lib/error-handler";
import { z } from "zod";
import bcrypt from "bcrypt";

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
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

  // Update user password and mark OTP as used
  await Promise.all([
    prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    }),
    prisma.passwordReset.update({
      where: { id: resetRequest.id },
      data: { used: true },
    }),
  ]);

  return successResponse(
    null,
    'Password reset successfully. You can now login with your new password.'
  );
});
