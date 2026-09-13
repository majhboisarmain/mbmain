import { NextRequest, NextResponse } from 'next/server';
import {
  signJwtToken,
  isAccountLocked,
  recordFailedAttempt,
  resetFailedAttempts,
  HTTP_ONLY_COOKIE_OPTIONS,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const lockIdentifier = `admin_lockout_${ip}`;

    // 1. Check if IP is currently locked out
    const lockStatus = isAccountLocked(lockIdentifier);
    if (lockStatus.locked) {
      return NextResponse.json(
        {
          success: false,
          error: `Account locked due to multiple failed attempts. Please try again after ${lockStatus.remainingMinutes || 15} minutes.`,
          locked: true,
          remainingMinutes: lockStatus.remainingMinutes || 15,
        },
        { status: 429 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // 2. Strict server-side password verification — NO fallback passwords
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword) {
      console.error('[Admin Login] ADMIN_PASSWORD environment variable is not set!');
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Contact administrator.' },
        { status: 500 }
      );
    }

    // 3. Constant-time-ish strict equality check (no weak passwords, no phone bypass)
    const isPasswordValid = password.trim() === expectedPassword.trim();

    if (!isPasswordValid) {
      const attemptResult = recordFailedAttempt(lockIdentifier);
      return NextResponse.json(
        {
          success: false,
          error: attemptResult.locked
            ? 'Maximum attempts exceeded. Admin access locked for 15 minutes.'
            : `Incorrect Admin password. (${attemptResult.remainingAttempts} attempts remaining).`,
          locked: attemptResult.locked,
          remainingAttempts: attemptResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Reset failed attempts on success
    resetFailedAttempts(lockIdentifier);

    // 5. Generate secure JWT token (valid for 12 hours)
    const token = signJwtToken(
      {
        role: 'Admin',
        name: 'Super Admin',
        authTime: Date.now(),
      },
      720 // 12 hours
    );

    // 6. Set secure HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      user: {
        name: 'Super Admin',
        role: 'Admin',
      },
    });

    response.cookies.set('majh_admin_token', token, {
      ...HTTP_ONLY_COOKIE_OPTIONS,
      maxAge: 12 * 60 * 60, // 12 hours
    });

    return response;
  } catch (error: any) {
    console.error('[Admin Login Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
