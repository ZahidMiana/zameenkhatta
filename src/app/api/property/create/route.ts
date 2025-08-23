import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { handleFileUpload } from '@/lib/upload';
import { propertyCreateSchema } from '@/lib/validation';
import prisma from '@/lib/prisma';
import { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  requireAuth, 
  validateRequest 
} from '@/lib/error-handler';

// POST - Create property with image upload
export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  requireAuth(session);

  if (!session?.user?.id) {
    return errorResponse('Invalid session', 401);
  }

  try {
    const formData = await request.formData();
    
    // Extract form fields
    const propertyData: any = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      location: formData.get('location') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      bedrooms: parseInt(formData.get('bedrooms') as string),
      bathrooms: parseInt(formData.get('bathrooms') as string),
      sqft: parseInt(formData.get('sqft') as string),
      type: formData.get('type') as string,
      purpose: formData.get('purpose') as string || 'SALE',
    };

    // Handle coordinates if provided
    const lat = formData.get('lat');
    const lng = formData.get('lng');
    if (lat && lng) {
      propertyData.coordinates = {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
      };
    }

    // Validate property data
    const validatedData = validateRequest(propertyCreateSchema.omit({ image: true, images: true }))(propertyData);

    // Handle main image upload
    const mainImage = formData.get('image') as File;
    if (!mainImage || mainImage.size === 0) {
      return errorResponse('Main image is required', 400);
    }

    const { FileUploadHandler } = await import('@/lib/upload');
    const handler = new FileUploadHandler();
    const mainImageResult = await handler.uploadFile(mainImage, 'properties');

    if (!mainImageResult.success) {
      return errorResponse(mainImageResult.error || 'Failed to upload main image', 400);
    }

    // Handle additional images
    const additionalImages = Array.from(formData.getAll('images')) as File[];
    const additionalImageResults = [];
    
    for (const file of additionalImages) {
      if (file && file.size > 0) {
        const result = await handler.uploadFile(file, 'properties');
        if (result.success) {
          additionalImageResults.push(result.filePath);
        }
      }
    }

    // Create property in database
    const property = await prisma.property.create({
      data: {
        ...validatedData,
        image: mainImageResult.filePath!,
        images: additionalImageResults.join(','),
        userId: session.user.id,
        approved: session.user.role === 'ADMIN',
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
  } catch (error) {
    console.error('Property creation error:', error);
    return errorResponse('Failed to create property', 500);
  }
});
