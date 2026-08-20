import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const reports = await prisma.listingReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(reports);
  } catch (error: any) {
    return internalServerErrorResponse('/api/reports GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, listingType, reason, reportedBy } = body;

    if (!listingId || !reason) {
      return badRequestResponse('Listing ID and Report Reason are required.');
    }

    const report = await prisma.listingReport.create({
      data: {
        listingId: listingId.toString(),
        listingType: listingType || 'business',
        reason,
        reportedBy: reportedBy || null,
        status: 'Pending',
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/reports POST', error);
  }
}
