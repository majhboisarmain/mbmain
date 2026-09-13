import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('majh_admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = verifyJwtToken<{ role?: string; phone?: string; name?: string }>(adminToken);

    if (!payload || payload.role !== 'Admin') {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        name: payload.name || 'Super Admin',
        phone: payload.phone || process.env.ADMIN_PHONE || '9307294733',
        role: 'Admin',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
