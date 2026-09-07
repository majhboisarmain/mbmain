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
    const showAll = searchParams.get('showAll') === 'true';
    const includeApplications = searchParams.get('includeApplications') === 'true';

    const where: any = {};

    if (status && status !== 'All') {
      where.status = status;
    } else if (!showAll) {
      // By default, only show approved 'Open' jobs to the public
      where.status = 'Open';
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

    const { businessId, title, jobType, type, description, salary, location, status } = body;
    const finalJobType = jobType || type || 'Full Time';
    const contactPhone = (body.phone || body.contactPhone || '').toString().trim();
    const companyName = (body.company || body.businessName || '').toString().trim();

    let finalBusinessId: number | null = businessId ? parseInt(businessId.toString()) : null;

    if (!finalBusinessId) {
      // Try to find matching business by phone or name
      const cleanPhone = contactPhone.replace(/\D/g, '').slice(-10);
      let existingBiz = null;
      if (cleanPhone) {
        existingBiz = await prisma.business.findFirst({
          where: {
            OR: [
              { phone: { contains: cleanPhone } },
              { whatsapp: { contains: cleanPhone } }
            ]
          }
        });
      }
      if (!existingBiz && companyName) {
        existingBiz = await prisma.business.findFirst({
          where: {
            name: { equals: companyName, mode: 'insensitive' }
          }
        });
      }

      if (existingBiz) {
        finalBusinessId = existingBiz.id;
      } else {
        const newBiz = await prisma.business.create({
          data: {
            name: companyName || 'Boisar Employer',
            category: 'Jobs & Placement',
            description: `${companyName || 'Employer'} - Hiring for ${title} in Boisar.`,
            address: location || 'Boisar, Palghar',
            phone: contactPhone || '9022388123',
            whatsapp: contactPhone || '9022388123',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
            location: location || 'Boisar',
            verified: false
          }
        });
        finalBusinessId = newBiz.id;
      }
    }

    const job = await prisma.job.create({
      data: {
        businessId: finalBusinessId,
        title,
        type: finalJobType,
        description: description || '',
        salary: salary || 'Best in Industry',
        location: location || 'Boisar',
        status: status || 'Pending'
      },
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
        }
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/jobs POST', error);
  }
}
