import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRateLimiter, generalRateLimiter, uploadRateLimiter, aiRateLimiter } from '@/lib/rateLimit';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. CORS Whitelist handling
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
  const origin = request.headers.get('origin');

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight CORS OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  // 2. Production Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.delete('X-Powered-By');

  // 3. API Rate Limiting (only for /api/* routes)
  if (pathname.startsWith('/api')) {
    let rateCheck;
    const isDev = process.env.NODE_ENV === 'development';

    if (pathname.startsWith('/api/auth') || pathname.includes('login') || pathname.includes('otp')) {
      // Auth limit: 500 in dev, 15 in prod / 15 minutes
      const limit = isDev ? 500 : 15;
      rateCheck = authRateLimiter.check(limit, `auth_${ip}`, 15 * 60 * 1000);
    } else if (pathname.startsWith('/api/upload')) {
      // Upload limit: 200 in dev, 10 in prod / 1 minute
      const limit = isDev ? 200 : 10;
      rateCheck = uploadRateLimiter.check(limit, `upload_${ip}`, 60 * 1000);
    } else if (pathname.startsWith('/api/ai')) {
      // AI limit: 200 in dev, 20 in prod / 1 minute
      const limit = isDev ? 200 : 20;
      rateCheck = aiRateLimiter.check(limit, `ai_${ip}`, 60 * 1000);
    } else {
      // General API limit: 1000 in dev, 120 in prod / 1 minute
      const limit = isDev ? 1000 : 120;
      rateCheck = generalRateLimiter.check(limit, `general_${ip}`, 60 * 1000);
    }

    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', rateCheck.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateCheck.remaining.toString());

    if (!rateCheck.success) {
      const errorResponse = NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Please try again after ${rateCheck.retryAfter} seconds.`,
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
      errorResponse.headers.set('Retry-After', rateCheck.retryAfter.toString());
      errorResponse.headers.set('X-RateLimit-Limit', rateCheck.limit.toString());
      errorResponse.headers.set('X-RateLimit-Remaining', '0');
      return errorResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
