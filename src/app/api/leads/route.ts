import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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
    const body = await request.json();
    const { businessId, customerName, customerPhone, customerEmail, query } = body;

    if (!businessId || !customerName || !customerPhone || !query) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        businessId: parseInt(businessId),
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        query,
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
