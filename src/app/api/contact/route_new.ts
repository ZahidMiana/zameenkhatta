import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import emailService from "@/lib/email";
import { contactSchema } from "@/lib/validation";
import { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  validateRequest,
  checkRateLimit 
} from "@/lib/error-handler";

export const POST = asyncHandler(async (request: NextRequest) => {
  // Rate limiting by IP
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  checkRateLimit(`contact_${clientIP}`, 5, 300000); // 5 requests per 5 minutes

  const body = await request.json();
  const validatedData = validateRequest(contactSchema)(body);

  // Create contact entry
  const contact = await prisma.contact.create({
    data: {
      ...validatedData,
      status: "NEW",
    },
  });

  // Send notification email to admin
  try {
    await emailService.sendContactNotificationEmail(validatedData);
    console.log('Contact notification sent to admin');
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    // Don't fail contact submission if email fails
  }

  console.log("Contact form submitted:", {
    id: contact.id,
    fullName: contact.fullName,
    email: contact.email,
    subject: contact.subject,
  });

  return successResponse(
    { id: contact.id },
    "Thank you for your message! We'll get back to you soon.",
    201
  );
});

// GET - Admin only: Fetch contacts with pagination and filters
export const GET = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  // Build where clause
  const where: any = {};
  
  if (status && ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Execute query
  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.contact.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return successResponse({
    contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
});

// PATCH - Admin only: Update contact status
export const PATCH = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get('id');
  
  if (!contactId) {
    return errorResponse('Contact ID is required', 400);
  }

  const body = await request.json();
  const { status } = body;

  if (!status || !['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
    return errorResponse('Invalid status', 400);
  }

  const contact = await prisma.contact.update({
    where: { id: contactId },
    data: { status },
  });

  return successResponse(contact, 'Contact status updated successfully');
});
