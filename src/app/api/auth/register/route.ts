export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import emailService from "@/lib/email";
import { userRegistrationSchema } from "@/lib/validation";
import { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  validateRequest 
} from "@/lib/error-handler";
import * as bcrypt from "bcrypt";

export const POST = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { name, email, password } = validateRequest(userRegistrationSchema)(body);

  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return errorResponse("Email already in use", 409);
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { 
      name, 
      email, 
      password: hashedPassword 
    },
  });

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(email, name || 'User');
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't fail registration if email fails
  }

  return successResponse(
    { 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      } 
    },
    'Registration successful! Welcome to ZameenKhatta.',
    201
  );
});
