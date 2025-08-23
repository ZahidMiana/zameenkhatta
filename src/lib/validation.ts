import { z } from 'zod';

// User Validation Schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Please enter a valid email address (e.g., user@example.com)'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter') 
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(/^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address (e.g., user@example.com)'),
  password: z.string().min(1, 'Password is required'),
});

// Property Validation Schemas
export const propertyCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  price: z.number().min(0, 'Price must be positive').max(999999999.99, 'Price too high'),
  location: z.string().min(5, 'Location must be at least 5 characters').max(500, 'Location too long'),
  city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City name too long'),
  state: z.string().min(2, 'State must be at least 2 characters').max(100, 'State name too long'),
  bedrooms: z.number().int().min(0, 'Bedrooms must be 0 or more').max(50, 'Too many bedrooms'),
  bathrooms: z.number().int().min(0, 'Bathrooms must be 0 or more').max(50, 'Too many bathrooms'),
  sqft: z.number().int().min(1, 'Square feet must be at least 1').max(1000000, 'Square feet too large'),
  type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'plot', 'commercial', 'office']),
  purpose: z.enum(['SALE', 'RENT']).default('SALE'),
  image: z.string().min(1, 'Main image is required'),
  images: z.array(z.string()).optional().default([]),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

// Contact Validation Schema
export const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[\+]?[0-9\-\(\)\s]+$/, 'Invalid phone format').optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
});

// Newsletter Validation Schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Blog Post Validation Schema
export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500, 'Excerpt too long'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  author: z.string().min(2, 'Author name must be at least 2 characters').max(100, 'Author name too long'),
  category: z.string().min(2, 'Category must be at least 2 characters').max(50, 'Category too long'),
  image: z.string().url('Invalid image URL'),
  readTime: z.string().regex(/^\d+\s*(min|mins|minute|minutes)$/, 'Invalid read time format'),
  published: z.boolean().default(false),
  publishDate: z.string().datetime().or(z.date()),
});

// Testimonial Validation Schema
export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role too long'),
  content: z.string().min(10, 'Content must be at least 10 characters').max(1000, 'Content too long'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  image: z.string().url('Invalid image URL'),
});

// File Upload Validation
export const fileUploadSchema = z.object({
  file: z.any().refine((file) => {
    if (!file) return false;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    return (
      allowedTypes.includes(file.type) &&
      file.size <= maxSize
    );
  }, 'Invalid file. Must be JPEG, PNG, or WebP under 5MB'),
});

// API Response Types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
  message?: string;
};

// Error Handler Function
export function handleValidationError(error: z.ZodError): ApiResponse {
  return {
    success: false,
    error: 'Validation failed',
    errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
  };
}

// Success Response Helper
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

// Error Response Helper
export function errorResponse(error: string, status?: number): ApiResponse {
  return {
    success: false,
    error,
  };
}
