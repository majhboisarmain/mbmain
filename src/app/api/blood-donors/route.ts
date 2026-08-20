import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const location = searchParams.get('location');

    const where: any = {};
    if (bloodGroup && bloodGroup !== 'All') {
      where.bloodGroup = bloodGroup;
    }
    if (location && location !== 'All') {
      where.location = { contains: location };
    }

    const donors = await prisma.bloodDonor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(donors || []);
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bloodGroup, location, phone } = body;

    if (!name || !bloodGroup || !phone) {
      return badRequestResponse('Full Name, Blood Group, and Mobile Number are required.');
    }

    const donor = await prisma.bloodDonor.create({
      data: {
        name,
        bloodGroup,
        location: location || 'Boisar West',
        phone,
        lastDonated: body.lastDonated || 'Ready to donate',
        verified: true,
      },
    });

    return NextResponse.json(donor, { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors POST', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    if (!id && !phone) {
      return badRequestResponse('Donor ID or Phone number is required.');
    }

    if (id) {
      await prisma.bloodDonor.delete({
        where: { id: parseInt(id) }
      });
    } else if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, '');
      await prisma.bloodDonor.deleteMany({
        where: { phone: cleanPhone }
      });
    }

    return NextResponse.json({ success: true, message: 'Blood donor profile removed successfully' });
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors DELETE', error);
  }
}
