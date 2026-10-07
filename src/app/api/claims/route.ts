import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, businessName, claimantName, claimantPhone, claimantEmail, message, proofDocument } = body;

    if (!businessId || !claimantName || !claimantPhone) {
      return NextResponse.json(
        { error: 'Business ID, your name, and mobile number are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = claimantPhone.toString().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const claim = await prisma.businessClaim.create({
      data: {
        businessId: parseInt(businessId),
        businessName: businessName || 'Business',
        claimantName: claimantName.trim(),
        claimantPhone: cleanPhone.slice(-10),
        claimantEmail: claimantEmail?.trim() || null,
        message: message?.trim() || null,
        proofDocument: proofDocument || null,
        status: 'Pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Claim request submitted successfully! Our Boisar verification team will call you within 24 hours to verify ownership.',
      claimId: claim.id,
    });
  } catch (err: any) {
    console.error('Error submitting business claim:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to submit claim request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const claims = await prisma.businessClaim.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(claims);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Claim ID and status required' }, { status: 400 });
    }
    const updated = await prisma.businessClaim.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    return NextResponse.json({ success: true, claim: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Claim ID required' }, { status: 400 });
    }
    await prisma.businessClaim.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
