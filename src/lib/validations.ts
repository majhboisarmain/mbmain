import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// 1. Phone number validation (flexible, digits will be cleaned)
export const phoneSchema = z.string().min(1, 'Phone number is required');

// 2. Business listing schema
export const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(200, 'Business name is too long'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional().nullable(),
  address: z.string().max(2000, 'Address cannot exceed 2000 characters').optional().nullable(),
  location: z.string().max(200, 'Location cannot exceed 200 characters').optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  youtube: z.string().optional().nullable(),
  googleMaps: z.string().optional().nullable(),
  wazeLink: z.string().optional().nullable(),
  workingHours: z.string().optional().nullable(),
  latitude: z.union([z.number(), z.string()]).optional().nullable(),
  longitude: z.union([z.number(), z.string()]).optional().nullable(),
  image: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
  subscription: z.string().optional().nullable(),
  verified: z.boolean().optional(),
  premium: z.boolean().optional(),
  rating: z.union([z.number(), z.string()]).optional().nullable(),
  hasHomeDelivery: z.boolean().optional(),
  createdBy: z.string().optional().nullable(),
  postedBy: z.string().optional().nullable()
}).passthrough();

// 3. Job posting schema
export const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').max(100, 'Job title cannot exceed 100 characters'),
  businessId: z.string().min(1, 'Business ID is required'),
  category: z.string().optional(),
  location: z.string().max(100).optional(),
  jobType: z.enum(['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship']).optional(),
  salary: z.string().max(50).optional(),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  requirements: z.string().max(1000).optional(),
  contactPhone: phoneSchema.optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
});

// 4. Property posting schema
export const propertySchema = z.object({
  category: z.string().min(3, 'Property title is required'),
  forAction: z.enum(['Sale', 'Rent', 'Lease']),
  price: z.string().min(1, 'Price is required'),
  location: z.string().min(2, 'Location is required'),
  carpetArea: z.string().optional(),
  bedrooms: z.number().int().nonnegative().optional(),
  contactName: z.string().min(2).max(100),
  contactPhone: phoneSchema,
  postedBy: z.enum(['Owner', 'Agent', 'Builder']).optional(),
});

// 5. Secure File Upload Validator (Server-side MIME & Size check)
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateFileUpload(file: { name: string; type: string; size: number }): { valid: boolean; error?: string; safeFilename?: string } {
  const isImage = ALLOWED_IMAGE_MIME_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_MIME_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Invalid file type '${file.type}'. Allowed types: JPG, PNG, WEBP, GIF, MP4, WEBM.`,
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image file size exceeds limit of 5MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video file size exceeds limit of 25MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
    };
  }

  // Generate safe UUID filename (never use client-supplied original filename)
  const ext = file.name.split('.').pop()?.toLowerCase() || (isImage ? 'png' : 'mp4');
  const safeFilename = `${uuidv4()}.${ext}`;

  return {
    valid: true,
    safeFilename,
  };
}

// 6. LLM Prompt Sanitizer & Token Budget Protection
export function sanitizeLlmPrompt(prompt: string, maxTokens = 500): { safePrompt: string; isValid: boolean; error?: string } {
  if (!prompt || typeof prompt !== 'string') {
    return { safePrompt: '', isValid: false, error: 'Prompt must be a non-empty string.' };
  }

  // Strip potential prompt injection vectors
  let sanitized = prompt
    .replace(/ignore previous instructions/gi, '')
    .replace(/system prompt/gi, '')
    .replace(/you are now an admin/gi, '')
    .trim();

  // Enforce max token / character budget (approx 4 chars per token)
  const maxCharLimit = maxTokens * 4;
  if (sanitized.length > maxCharLimit) {
    sanitized = sanitized.substring(0, maxCharLimit);
  }

  return {
    safePrompt: sanitized,
    isValid: true,
  };
}
