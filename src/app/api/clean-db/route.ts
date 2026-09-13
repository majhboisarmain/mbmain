import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Strict production block: Never allow automatic wipes in production
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DANGEROUS_CLEAN_DB !== 'true') {
    return NextResponse.json(
      { error: 'Forbidden: Database clean is disabled in production environments.' },
      { status: 403 }
    );
  }

  // 2. Strict Server-Side Key Verification (NO hardcoded fallback)
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const masterSecret = process.env.ADMIN_SECRET_KEY;

  const adminToken = request.cookies.get('majh_admin_token')?.value;
  const isTokenValid = adminToken ? verifyJwtToken<{ role?: string }>(adminToken)?.role === 'Admin' : false;

  const isSecretValid = Boolean(masterSecret && secret && secret === masterSecret);

  if (!isSecretValid && !isTokenValid) {
    return NextResponse.json({ error: 'Unauthorized: Valid Admin authentication or secret key required.' }, { status: 401 });
  }

  const logs: string[] = [];

  try {
    try { await prisma.jobApplication.deleteMany({}); logs.push('JobApplications deleted'); } catch (e: any) { logs.push(`JobApplications: ${e.message}`); }
    try { await prisma.job.deleteMany({}); logs.push('Jobs deleted'); } catch (e: any) { logs.push(`Jobs: ${e.message}`); }
    try { await prisma.lead.deleteMany({}); logs.push('Leads deleted'); } catch (e: any) { logs.push(`Leads: ${e.message}`); }
    try { await prisma.review.deleteMany({}); logs.push('Reviews deleted'); } catch (e: any) { logs.push(`Reviews: ${e.message}`); }
    try { await prisma.service.deleteMany({}); logs.push('Services deleted'); } catch (e: any) { logs.push(`Services: ${e.message}`); }
    try { await prisma.product.deleteMany({}); logs.push('Products deleted'); } catch (e: any) { logs.push(`Products: ${e.message}`); }
    try { await prisma.fAQ.deleteMany({}); logs.push('FAQs deleted'); } catch (e: any) { logs.push(`FAQs: ${e.message}`); }
    try { await prisma.adOrder.deleteMany({}); logs.push('AdOrders deleted'); } catch (e: any) { logs.push(`AdOrders: ${e.message}`); }
    try { await prisma.business.deleteMany({}); logs.push('Businesses deleted'); } catch (e: any) { logs.push(`Businesses: ${e.message}`); }

    return NextResponse.json({
      success: true,
      message: 'Database wipe completed for production deployment.',
      logs
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, logs }, { status: 500 });
  }
}
