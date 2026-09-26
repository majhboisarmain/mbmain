import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const where: any = {};
    if (businessId) where.businessId = parseInt(businessId);
    const products = await prisma.product.findMany({ where });
    return NextResponse.json(products || []);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, name, price, description, image } = body;

    if (!businessId || !name || price === undefined) {
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
        _count: { select: { products: true } }
      }
    });

    if (biz) {
      const sub = biz.subscription || 'Free';
      const isPaidActive = Boolean(biz.premium && sub !== 'Free');
      const maxLimit = isPaidActive ? (sub === 'Starter' || sub === 'Basic' ? 25 : 9999) : 5;
      if (biz._count.products >= maxLimit) {
        return NextResponse.json({
          error: `Product catalog limit reached! Your current ${sub} plan allows up to ${maxLimit} products. Upgrade or renew your subscription to add more items.`
        }, { status: 400 });
      }
    }

    const uploadedImage = image ? await uploadImage(image) : null;

    const product = await prisma.product.create({
      data: {
        businessId: bId,
        name,
        price: parseFloat(price),
        description: description || null,
        image: uploadedImage
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
