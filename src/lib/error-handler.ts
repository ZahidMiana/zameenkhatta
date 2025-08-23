import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            success: false,
            error: 'A record with this information already exists',
            details: error.meta,
          },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          {
            success: false,
            error: 'Record not found',
          },
          { status: 404 }
        );
      case 'P2003':
        return NextResponse.json(
          {
            success: false,
            error: 'Foreign key constraint failed',
          },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Database operation failed',
            code: error.code,
          },
          { status: 500 }
        );
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid data provided',
      },
      { status: 400 }
    );
  }

  // Custom application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.status }
    );
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function asyncHandler<T extends any[]>(
  fn: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Success response helper
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

// Error response helper
export function errorResponse(
  error: string,
  status: number = 500,
  code?: string,
  details?: any
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status }
  );
}

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw error;
      }
      throw new AppError('Validation failed', 400);
    }
  };
}

// Authentication check helper
export function requireAuth(session: any, requiredRole?: string): void {
  if (!session?.user) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  if (requiredRole && session.user.role !== requiredRole) {
    throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
  }
}

// Rate limiting helper (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): void {
  const now = Date.now();
  const userRequests = requestCounts.get(identifier);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return;
  }

  if (userRequests.count >= maxRequests) {
    throw new AppError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
  }

  userRequests.count++;
}

export default {
  handleApiError,
  asyncHandler,
  successResponse,
  errorResponse,
  validateRequest,
  requireAuth,
  checkRateLimit,
  AppError,
};
