import { NextRequest, NextResponse } from 'next/server';
import { prisma, pool } from '@/lib/db';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export const dynamic = 'force-dynamic';

function parseTypeFromReport(listingType: string): 'vehicle' | 'job' | 'blood_donor' | 'business' | 'hotel' | 'account' {
  const lower = (listingType || '').toLowerCase();
  if (lower.includes('vehicle') || lower.includes('travel')) return 'vehicle';
  if (lower.includes('job')) return 'job';
  if (lower.includes('donor') || lower.includes('blood')) return 'blood_donor';
  if (lower.includes('hotel')) return 'hotel';
  if (lower.includes('business')) return 'business';
  return 'account';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userPhone = searchParams.get('phone');
    const itemId = searchParams.get('itemId');

    const where: any = {
      listingType: {
        contains: 'deletion',
        mode: 'insensitive',
      },
    };

    if (userPhone) {
      where.reportedBy = {
        contains: userPhone.replace(/\D/g, '').slice(-10),
      };
    }

    if (itemId) {
      where.listingId = String(itemId);
    }

    const reports = await prisma.listingReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const formatted = reports.map((r) => {
      const type = parseTypeFromReport(r.listingType);
      let itemName = '';
      let userName = '';

      if (r.reason && r.reason.includes('::')) {
        const parts = r.reason.split('::');
        itemName = parts[0]?.trim() || '';
        userName = parts[1]?.trim() || '';
      } else {
        itemName = r.reason || `Listing #${r.listingId}`;
      }

      return {
        id: r.id,
        type,
        itemId: r.listingId,
        itemName,
        businessName: itemName,
        userName: userName || r.reportedBy || 'User',
        userPhone: r.reportedBy || '',
        reason: r.reason,
        requestedAt: r.createdAt.toISOString(),
        status: r.status === 'Resolved' ? 'Approved & Deleted' : r.status,
      };
    });

    return NextResponse.json(formatted, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/deletion-requests GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, itemId, itemName, userName, userPhone, reason } = body;

    if (!type || !itemId) {
      return badRequestResponse('Type and Item ID are required.');
    }

    const cleanType = String(type).toLowerCase();
    const cleanId = String(itemId).trim();
    const cleanPhone = (userPhone || '').toString().replace(/\D/g, '').slice(-10);
    const listingType = cleanType.endsWith('_deletion') ? cleanType : `${cleanType}_deletion`;
    const compositeReason = `${(itemName || `Item #${cleanId}`).trim()} :: ${(userName || 'User').trim()}${reason ? ` (${reason})` : ''}`;

    // Check if a pending deletion request already exists for this item
    const existing = await prisma.listingReport.findFirst({
      where: {
        listingId: cleanId,
        listingType,
        status: 'Pending',
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          id: existing.id,
          message: 'Deletion request already pending for this listing.',
          status: 'Pending',
          alreadyPending: true,
        },
        { status: 200 }
      );
    }

    const created = await prisma.listingReport.create({
      data: {
        listingId: cleanId,
        listingType,
        reason: compositeReason,
        reportedBy: cleanPhone || null,
        status: 'Pending',
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        type: parseTypeFromReport(created.listingType),
        itemId: created.listingId,
        itemName: itemName || `Listing #${cleanId}`,
        status: 'Pending',
        requestedAt: created.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return internalServerErrorResponse('/api/deletion-requests POST', error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return badRequestResponse('Request ID and action are required.');
    }

    const report = await prisma.listingReport.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!report) {
      return badRequestResponse('Deletion request not found.');
    }

    const targetType = parseTypeFromReport(report.listingType);
    const targetId = report.listingId;

    if (action === 'approve') {
      // Execute the actual deletion based on type
      if (targetType === 'vehicle') {
        const vId = parseInt(targetId, 10);
        if (!isNaN(vId)) {
          await pool.query('DELETE FROM "VehicleRental" WHERE "id" = $1', [vId]).catch(console.error);
        }
      } else if (targetType === 'job') {
        const jId = parseInt(targetId, 10);
        if (!isNaN(jId)) {
          await prisma.job.delete({ where: { id: jId } }).catch(console.error);
        }
      } else if (targetType === 'blood_donor') {
        const dId = parseInt(targetId, 10);
        if (!isNaN(dId)) {
          try {
            await prisma.bloodDonor.delete({ where: { id: dId } });
          } catch (e) {
            await pool.query('DELETE FROM "BloodDonor" WHERE "id" = $1', [dId]).catch(console.error);
          }
        }
      } else if (targetType === 'business') {
        const bId = parseInt(targetId, 10);
        if (!isNaN(bId)) {
          await prisma.business.delete({ where: { id: bId } }).catch(console.error);
        }
      }

      const updated = await prisma.listingReport.update({
        where: { id: report.id },
        data: { status: 'Approved & Deleted' },
      });

      return NextResponse.json({
        success: true,
        id: updated.id,
        status: 'Approved & Deleted',
      });
    } else if (action === 'reject') {
      const updated = await prisma.listingReport.update({
        where: { id: report.id },
        data: { status: 'Rejected' },
      });

      return NextResponse.json({
        success: true,
        id: updated.id,
        status: 'Rejected',
      });
    }

    return badRequestResponse('Invalid action. Use "approve" or "reject".');
  } catch (error: any) {
    return internalServerErrorResponse('/api/deletion-requests PATCH', error);
  }
}
