import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const orders = await prisma.adOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const now = new Date();
    const ordersWithExpiry = orders.map((order: any) => {
      const expiryDate = new Date(order.createdAt.getTime() + (order.durationDays * 24 * 60 * 60 * 1000));
      return {
        ...order,
        expiryDate: expiryDate.toISOString(),
        isExpired: now > expiryDate
      };
    });

    return NextResponse.json(ordersWithExpiry);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      businessId,
      businessName,
      title,
      description,
      image,
      placement,
      targetingScope,
      targetCategory,
      durationDays,
      dailyBudget,
      totalCost,
      showTextOverlay,
      targetUrl,
      ctaText
    } = body;

    if (!businessName) {
      return NextResponse.json({ error: 'Missing businessName' }, { status: 400 });
    }

    const uploadedImage = await uploadImage(image);

    const order = await prisma.adOrder.create({
      data: {
        businessId: Number(businessId) || 1,
        businessName,
        title,
        description,
        image: uploadedImage,
        placement: placement || 'sponsored',
        targetingScope: targetingScope || 'both',
        targetCategory: targetCategory || 'All',
        durationDays: Number(durationDays) || 7,
        dailyBudget: Number(dailyBudget) || 100.0,
        totalCost: Number(totalCost) || 700.0,
        status: body.status || 'Pending',
        showTextOverlay: showTextOverlay !== undefined ? Boolean(showTextOverlay) : true,
        targetUrl: targetUrl || null
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
