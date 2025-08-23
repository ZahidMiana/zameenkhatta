import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UploadResult {
  success: boolean;
  fileName?: string;
  filePath?: string;
  error?: string;
}

export class FileUploadHandler {
  private uploadDir: string;
  private maxFileSize: number;
  private allowedTypes: string[];

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './public/uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
    this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  }

  async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }

    // Create subdirectories for organization
    const subDirs = ['properties', 'users', 'blog', 'testimonials'];
    for (const subDir of subDirs) {
      const dirPath = path.join(this.uploadDir, subDir);
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }
    }
  }

  generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${random}${ext}`;
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${this.allowedTypes.join(', ')}`
      };
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`
      };
    }

    return { valid: true };
  }

  async uploadFile(file: File, category: string = 'general'): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Ensure upload directory exists
      await this.ensureUploadDir();

      // Generate unique filename
      const fileName = this.generateFileName(file.name);
      const categoryDir = path.join(this.uploadDir, category);
      const filePath = path.join(categoryDir, fileName);

      // Ensure category directory exists
      if (!existsSync(categoryDir)) {
        await mkdir(categoryDir, { recursive: true });
      }

      // Convert file to buffer and save
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      // Return web-accessible path
      const webPath = `/uploads/${category}/${fileName}`;

      return {
        success: true,
        fileName,
        filePath: webPath
      };
    } catch (error) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: 'Failed to upload file'
      };
    }
  }

  async uploadMultipleFiles(files: File[], category: string = 'general'): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    
    for (const file of files) {
      const result = await this.uploadFile(file, category);
      results.push(result);
    }

    return results;
  }

  async parseFormData(request: NextRequest): Promise<{ fields: Record<string, string>; files: Record<string, File[]> }> {
    const formData = await request.formData();
    const fields: Record<string, string> = {};
    const files: Record<string, File[]> = {};

    // Convert FormData to array to avoid iteration issues
    const entries = Array.from(formData.entries());
    
    for (const [key, value] of entries) {
      if (value instanceof File) {
        if (!files[key]) {
          files[key] = [];
        }
        files[key].push(value);
      } else {
        fields[key] = value as string;
      }
    }

    return { fields, files };
  }
}

// Utility functions for API routes
export async function handleFileUpload(
  request: NextRequest,
  category: string = 'general'
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const handler = new FileUploadHandler();
    const { fields, files } = await handler.parseFormData(request);

    if (!files.file || files.file.length === 0) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    const file = files.file[0];
    const result = await handler.uploadFile(file, category);

    if (!result.success) {
      return {
        success: false,
        error: result.error
      };
    }

    return {
      success: true,
      data: {
        fileName: result.fileName,
        filePath: result.filePath,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    };
  } catch (error) {
    console.error('Handle file upload error:', error);
    return {
      success: false,
      error: 'Failed to process file upload'
    };
  }
}

export default FileUploadHandler;
