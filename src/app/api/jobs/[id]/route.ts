import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true,
            phone: true,
            whatsapp: true,
            verified: true,
            email: true,
            address: true
          }
        },
        applications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    await prisma.job.delete({
      where: { id: jobId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);
    const body = await request.json();

    const job = await prisma.job.update({
      where: { id: jobId },
      data: body
    });

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
