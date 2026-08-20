import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. Minimum 32-character JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'm4jH_b01s4R_s3cUr3_jwt_t0k3n_k3y_9820123456789_xYz_m4jH';
const BCRYPT_COST_FACTOR = 12;

// In-memory account lockout tracker (IP / User ID based)
interface LockoutEntry {
  failedAttempts: number;
  lockedUntil: number | null;
}

const lockoutTracker = new Map<string, LockoutEntry>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Hashes a raw password using bcrypt with a minimum cost factor of 12
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST_FACTOR);
}

/**
 * Verifies a raw password against a bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT payload with a 30-minute expiration
 */
export function signJwtToken(payload: object, expiresInMinutes = 30): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${expiresInMinutes}m`,
  });
}

/**
 * Verifies and decodes a JWT token
 */
export function verifyJwtToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null;
  }
}

/**
 * Checks if an account / IP is currently locked out due to repeated failed attempts
 */
export function isAccountLocked(identifier: string): { locked: boolean; remainingMinutes?: number } {
  const entry = lockoutTracker.get(identifier);
  if (!entry || !entry.lockedUntil) {
    return { locked: false };
  }

  const now = Date.now();
  if (now > entry.lockedUntil) {
    // Lockout expired -> reset
    lockoutTracker.delete(identifier);
    return { locked: false };
  }

  const remainingMinutes = Math.ceil((entry.lockedUntil - now) / 60000);
  return { locked: true, remainingMinutes };
}

/**
 * Records a failed authentication attempt and locks the account if 5 failed attempts occur
 */
export function recordFailedAttempt(identifier: string): { locked: boolean; remainingAttempts: number } {
  const now = Date.now();
  const entry = lockoutTracker.get(identifier) || { failedAttempts: 0, lockedUntil: null };

  entry.failedAttempts += 1;

  if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    lockoutTracker.set(identifier, entry);
    return { locked: true, remainingAttempts: 0 };
  }

  lockoutTracker.set(identifier, entry);
  return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - entry.failedAttempts };
}

/**
 * Resets failed attempts after a successful login
 */
export function resetFailedAttempts(identifier: string): void {
  lockoutTracker.delete(identifier);
}

/**
 * Cookie configuration helper for httpOnly refresh tokens
 */
export const HTTP_ONLY_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};
