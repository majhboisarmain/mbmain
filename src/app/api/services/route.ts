import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const where: any = {};
    if (businessId) where.businessId = parseInt(businessId);
    const services = await prisma.service.findMany({ where });
    return NextResponse.json(services || []);
  } catch (error: any) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, name, price, duration, description } = body;

    if (!businessId || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bId = parseInt(businessId);
    if (isNaN(bId)) {
      return NextResponse.json({ error: 'Invalid business ID' }, { status: 400 });
    }

    // Enforce subscription plan quota
    const biz = await prisma.business.findUnique({
      where: { id: bId },
      select: {
        subscription: true,
        premium: true,
        _count: { select: { services: true } }
      }
    });

    if (biz) {
      const sub = biz.subscription || 'Free';
      const isPaidActive = Boolean(biz.premium && sub !== 'Free');
      const maxLimit = isPaidActive ? (sub === 'Starter' || sub === 'Basic' ? 25 : 9999) : 5;
      if (biz._count.services >= maxLimit) {
        return NextResponse.json({
          error: `Services limit reached! Your current ${sub} plan allows up to ${maxLimit} services. Upgrade or renew your subscription to add more services.`
        }, { status: 400 });
      }
    }

    const service = await prisma.service.create({
      data: {
        businessId: bId,
        name,
        price: price ? parseFloat(price) : null,
        duration: duration || null,
        description: description || null
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
