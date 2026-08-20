import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jobSchema } from '@/lib/validations';
import { badRequestResponse, internalServerErrorResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('query');
    const businessId = searchParams.get('businessId');
    const status = searchParams.get('status');
    const includeApplications = searchParams.get('includeApplications') === 'true';

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (businessId) {
      where.businessId = parseInt(businessId);
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { location: { contains: query } },
        { business: { name: { contains: query } } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        business: {
          select: {
            name: true,
            image: true,
            location: true,
            phone: true,
            whatsapp: true,
            verified: true
          }
        },
        applications: includeApplications ? {
          orderBy: { createdAt: 'desc' }
        } : false,
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(jobs || []);
  } catch (error: any) {
    return internalServerErrorResponse('/api/jobs GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = jobSchema.safeParse(body);
    if (!validationResult.success) {
      return badRequestResponse(
        validationResult.error.issues[0].message,
        validationResult.error.flatten()
      );
    }

    const { businessId, title, jobType, description, salary, location } = body;

    const job = await prisma.job.create({
      data: {
        businessId: parseInt(businessId),
        title,
        type: jobType || 'Full Time',
        description: description || '',
        salary: salary || 'Best in Industry',
        location: location || 'Boisar',
        status: 'Open'
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/jobs POST', error);
  }
}
