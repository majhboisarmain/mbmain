import { NextResponse } from 'next/server';

export interface AuthenticatedUser {
  id?: string;
  phone: string;
  name?: string;
  role?: string;
}

/**
 * Checks if the authenticated user owns a given resource (by phone or user ID match)
 */
export function isResourceOwner(user: AuthenticatedUser | null, resourceOwnerPhoneOrId: string | undefined | null): boolean {
  if (!user || !user.phone || !resourceOwnerPhoneOrId) {
    return false;
  }

  // Admin role can access any resource
  if (user.role === 'Admin') {
    return true;
  }

  const userPhoneDigits = user.phone.replace(/\D/g, '');
  const ownerDigits = resourceOwnerPhoneOrId.replace(/\D/g, '');

  if (userPhoneDigits && ownerDigits && (userPhoneDigits.endsWith(ownerDigits) || ownerDigits.endsWith(userPhoneDigits))) {
    return true;
  }

  if (user.id && user.id === resourceOwnerPhoneOrId) {
    return true;
  }

  return false;
}

/**
 * Standardized HTTP 400 Bad Request response for Zod validation failures
 */
export function badRequestResponse(message: string, errors?: any) {
  console.warn(`[Security Audit] HTTP 400 Bad Request: ${message}`, errors || '');
  return NextResponse.json(
    {
      error: 'Bad Request',
      message,
      details: errors || null,
    },
    { status: 400 }
  );
}

/**
 * Standardized HTTP 401 Unauthorized response
 */
export function unauthorizedResponse(message = 'Authentication required') {
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message,
    },
    { status: 401 }
  );
}

/**
 * Standardized HTTP 403 Forbidden response for ownership / permission failures
 */
export function forbiddenResponse(message = 'Access forbidden. You do not own this resource or lack permission.') {
  console.warn(`[Security Audit] HTTP 403 Forbidden: ${message}`);
  return NextResponse.json(
    {
      error: 'Forbidden',
      message,
    },
    { status: 403 }
  );
}

/**
 * Standardized HTTP 500 Internal Server Error response (sanitized error message to prevent leaks)
 */
export function internalServerErrorResponse(route: string, error: any) {
  const timestamp = new Date().toISOString();
  console.error(`[Security Log ${timestamp}] Server Error on ${route}:`, error);

  return NextResponse.json(
    {
      error: 'Internal Server Error',
      message: 'Something went wrong on our server. Please try again later.',
    },
    { status: 500 }
  );
}
