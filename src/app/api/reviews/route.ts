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

    const reviews = await prisma.review.findMany({
      where,
      include: {
        business: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, userName, rating, comment } = body;

    if (!businessId || !userName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 405 });
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    // 1. Create the review
    const review = await prisma.review.create({
      data: {
        businessId: parseInt(businessId),
        userName,
        rating: ratingVal,
        comment
      }
    });

    // 2. Fetch all reviews for this business to recalculate ratings
    const allReviews = await prisma.review.findMany({
      where: { businessId: parseInt(businessId) }
    });

    const reviewCount = allReviews.length;
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = parseFloat((totalRating / reviewCount).toFixed(1));

    // 3. Update the business stats
    await prisma.business.update({
      where: { id: parseInt(businessId) },
      data: {
        rating: avgRating,
        reviewCount: reviewCount
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    }

    const reviewId = parseInt(id);
    
    // 1. Fetch the review first to get businessId
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const businessId = review.businessId;

    // 2. Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // 3. Recalculate rating stats for business
    const allReviews = await prisma.review.findMany({
      where: { businessId }
    });

    const reviewCount = allReviews.length;
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = reviewCount > 0 ? parseFloat((totalRating / reviewCount).toFixed(1)) : 0;

    await prisma.business.update({
      where: { id: businessId },
      data: {
        rating: avgRating,
        reviewCount: reviewCount
      }
    });

    return NextResponse.json({ message: 'Review deleted and ratings updated successfully' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

