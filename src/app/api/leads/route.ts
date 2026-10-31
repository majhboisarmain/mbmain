import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// In-memory rate limiter to prevent spam bot submissions
const leadRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_LEADS_PER_WINDOW = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  try {
    // Only Admin can fetch the full list of platform leads
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required to access customer leads.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    const where: any = {};
    if (businessId) {
      where.businessId = parseInt(businessId);
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        business: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit lead submissions per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const entry = leadRateLimitMap.get(ip);

    if (entry) {
      if (now < entry.resetAt) {
        if (entry.count >= MAX_LEADS_PER_WINDOW) {
          return NextResponse.json(
            { error: 'Too many inquiries submitted from your network. Please wait a few minutes.' },
            { status: 429 }
          );
        }
        entry.count += 1;
      } else {
        leadRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
      }
    } else {
      leadRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    }

    const body = await request.json();
    const { businessId, customerName, customerPhone, customerEmail, query } = body;

    if (!businessId || !customerName || !customerPhone || !query) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanPhone = customerPhone.toString().replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json({ error: 'Valid 10-digit customer mobile number is required' }, { status: 400 });
    }

    // Sanitize text inputs
    const sanitizedName = String(customerName).replace(/<[^>]*>?/gm, '').trim().slice(0, 80);
    const sanitizedQuery = String(query).replace(/<[^>]*>?/gm, '').trim().slice(0, 1000);

    const lead = await prisma.lead.create({
      data: {
        businessId: parseInt(businessId),
        customerName: sanitizedName,
        customerPhone: cleanPhone,
        customerEmail: customerEmail ? String(customerEmail).trim().slice(0, 100) : null,
        query: sanitizedQuery,
        status: 'Pending'
      },
      include: {
        business: true
      }
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
