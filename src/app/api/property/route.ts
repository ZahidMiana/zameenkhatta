import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { propertyCreateSchema } from '@/lib/validation';
import { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  requireAuth, 
  validateRequest,
  checkRateLimit 
} from '@/lib/error-handler';

// GET - Fetch properties with filters and pagination
export const GET = asyncHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
  const skip = (page - 1) * limit;
  
  const city = searchParams.get('city');
  const type = searchParams.get('type');
  const purpose = searchParams.get('purpose');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const bedrooms = searchParams.get('bedrooms');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured') === 'true';
  const approved = searchParams.get('approved') !== 'false'; // Default to true

  // Build where clause
  const where: any = { approved };

  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (type) where.type = type;
  if (purpose) where.purpose = purpose;
  if (featured) where.featured = true;
  if (bedrooms) where.bedrooms = parseInt(bedrooms);

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Execute query with pagination
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return successResponse({
    properties,
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

// POST - Create new property
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  requireAuth(session);

  if (!session?.user?.id) {
    return errorResponse('Invalid session', 401);
  }

  // Rate limiting
  checkRateLimit(`property_create_${session.user.id}`, 10, 60000); // 10 requests per minute

  const body = await request.json();
  const validatedData = validateRequest(propertyCreateSchema)(body);

  // Create property
  const { images, ...restData } = validatedData;
  const property = await prisma.property.create({
    data: {
      ...restData,
      images: images?.join(',') || '', // Convert array to comma-separated string for current schema
      userId: session.user.id,
      approved: session.user.role === 'ADMIN', // Auto-approve for admins
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return successResponse(
    property,
    session.user.role === 'ADMIN' 
      ? 'Property created and approved successfully'
      : 'Property created successfully and pending approval',
    201
  );
});

// PATCH - Update property
export const PATCH = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  requireAuth(session);

  if (!session?.user?.id) {
    return errorResponse('Invalid session', 401);
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('id');

  if (!propertyId) {
    return errorResponse('Property ID is required', 400);
  }

  const body = await request.json();
  const validatedData = validateRequest(propertyCreateSchema.partial())(body);

  // Check if property exists and user has permission
  const existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!existingProperty) {
    return errorResponse('Property not found', 404);
  }

  if (existingProperty.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return errorResponse('Insufficient permissions', 403);
  }

  // Update property
  const { images, ...restData } = validatedData;
  const updatedData: any = { 
    ...restData,
    ...(images && { images: images.join(',') }) // Convert array to string if provided
  };
  
  // If non-admin user updates, reset approval status
  if (session.user.role !== 'ADMIN' && existingProperty.userId === session.user.id) {
    updatedData.approved = false;
  }

  const property = await prisma.property.update({
    where: { id: propertyId },
    data: updatedData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return successResponse(property, 'Property updated successfully');
});

// DELETE - Delete property
export const DELETE = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  requireAuth(session);

  if (!session?.user?.id) {
    return errorResponse('Invalid session', 401);
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('id');

  if (!propertyId) {
    return errorResponse('Property ID is required', 400);
  }

  // Check if property exists and user has permission
  const existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!existingProperty) {
    return errorResponse('Property not found', 404);
  }

  if (existingProperty.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return errorResponse('Insufficient permissions', 403);
  }

  // Delete property (this will cascade delete favorites)
  await prisma.property.delete({
    where: { id: propertyId },
  });

  return successResponse(null, 'Property deleted successfully');
});
