import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { location: { contains: query } },
        { sellerName: { contains: query } },
      ];
    }

    const items = await prisma.marketplaceItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error: any) {
    return internalServerErrorResponse('/api/marketplace GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, customCategory, price, condition, location, sellerName, phone, imageBase64 } = body;

    if (!title || !phone || price === undefined) {
      return badRequestResponse('Title, Price, and Contact Phone are required.');
    }

    let imageUrl: string | null = null;
    if (imageBase64) {
      imageUrl = await uploadImage(imageBase64);
    }

    const finalCategory = category === 'Other' && customCategory ? customCategory : (category || 'Vehicles');

    const item = await prisma.marketplaceItem.create({
      data: {
        title,
        category: finalCategory,
        price: parseFloat(price.toString()) || 0,
        condition: condition || 'Good',
        location: location || 'Boisar',
        sellerName: sellerName || 'Local Seller',
        phone,
        image: imageUrl,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/marketplace POST', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequestResponse('Item ID is required');

    await prisma.marketplaceItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return internalServerErrorResponse('/api/marketplace DELETE', error);
  }
}
