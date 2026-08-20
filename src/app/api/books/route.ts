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
        { subject: { contains: query } },
        { donorName: { contains: query } },
      ];
    }

    const books = await prisma.bookListing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(books);
  } catch (error: any) {
    return internalServerErrorResponse('/api/books GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, subject, category, priceType, price, imageBase64, location } = body;

    if (!name || !title) {
      return badRequestResponse('Your Name and Book Title are required.');
    }

    let imageUrl: string | null = null;
    if (imageBase64) {
      imageUrl = await uploadImage(imageBase64);
    }

    const book = await prisma.bookListing.create({
      data: {
        title,
        category: category || '10th/12th School',
        subject: subject || null,
        priceType: priceType || 'Free / Gift',
        price: parseFloat((price || 0).toString()),
        donorName: name,
        phone: body.phone || '7769947217',
        location: location || 'Boisar',
        condition: body.condition || 'Good Condition',
        image: imageUrl,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/books POST', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequestResponse('Book ID is required');

    await prisma.bookListing.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return internalServerErrorResponse('/api/books DELETE', error);
  }
}
