import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { handleFileUpload } from '@/lib/upload';
import { asyncHandler, successResponse, errorResponse, requireAuth } from '@/lib/error-handler';

export const POST = asyncHandler(async (request: NextRequest) => {
  // Get session for authentication
  const session = await getServerSession(authOptions);
  requireAuth(session);

  // Get upload category from query params
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';

  // Validate category
  const allowedCategories = ['properties', 'users', 'blog', 'testimonials', 'general'];
  if (!allowedCategories.includes(category)) {
    return errorResponse('Invalid upload category', 400);
  }

  // Handle file upload
  const result = await handleFileUpload(request, category);

  if (!result.success) {
    return errorResponse(result.error || 'Upload failed', 400);
  }

  return successResponse(result.data, 'File uploaded successfully', 201);
});

// Handle multiple file uploads
export const PUT = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  requireAuth(session);

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';

  const allowedCategories = ['properties', 'users', 'blog', 'testimonials', 'general'];
  if (!allowedCategories.includes(category)) {
    return errorResponse('Invalid upload category', 400);
  }

  try {
    const formData = await request.formData();
    const files = Array.from(formData.getAll('files')) as File[];

    if (files.length === 0) {
      return errorResponse('No files provided', 400);
    }

    if (files.length > 10) {
      return errorResponse('Too many files. Maximum 10 files allowed', 400);
    }

    const { FileUploadHandler } = await import('@/lib/upload');
    const handler = new FileUploadHandler();
    const results = await handler.uploadMultipleFiles(files, category);

    const successfulUploads = results.filter(r => r.success);
    const failedUploads = results.filter(r => !r.success);

    return successResponse({
      successful: successfulUploads.map(r => ({
        fileName: r.fileName,
        filePath: r.filePath,
      })),
      failed: failedUploads.map(r => ({
        error: r.error,
      })),
      summary: {
        total: files.length,
        successful: successfulUploads.length,
        failed: failedUploads.length,
      },
    }, `Uploaded ${successfulUploads.length} of ${files.length} files`);
  } catch (error) {
    console.error('Multiple upload error:', error);
    return errorResponse('Failed to upload files', 500);
  }
});
