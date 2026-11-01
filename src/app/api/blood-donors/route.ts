import { NextRequest, NextResponse } from 'next/server';
import { prisma, pool } from '@/lib/db';
import { internalServerErrorResponse, badRequestResponse, unauthorizedResponse } from '@/lib/authGuard';
import { isAdminRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function normalizeDonor(d: any) {
  if (!d) return null;
  return {
    id: Number(d.id),
    name: String(d.name || '').trim(),
    bloodGroup: String(d.bloodGroup || d.bloodgroup || '').trim().toUpperCase(),
    location: String(d.location || 'Boisar (West)').trim(),
    phone: String(d.phone || '').replace(/\D/g, ''),
    lastDonated: String(d.lastDonated || d.lastdonated || 'Ready to donate').trim(),
    verified: Boolean(d.verified),
    createdAt: d.createdAt || d.createdat || new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const location = searchParams.get('location');
    const query = searchParams.get('query');
    const showAll = searchParams.get('showAll') === 'true';

    let rawDonors: any[] = [];

    try {
      // 1. Primary: Prisma query
      const where: any = {};
      if (!showAll) {
        where.verified = true;
      }
      if (bloodGroup && bloodGroup !== 'All') {
        where.bloodGroup = { equals: bloodGroup.trim(), mode: 'insensitive' };
      }
      if (location && location !== 'All') {
        where.location = { contains: location.trim(), mode: 'insensitive' };
      }
      if (query && query.trim()) {
        const q = query.trim();
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { bloodGroup: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
        ];
      }

      rawDonors = await prisma.bloodDonor.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
    } catch (prismaErr) {
      console.warn('Prisma bloodDonor.findMany failed, falling back to raw pool query:', prismaErr);
      // 2. Fallback: Raw SQL query
      let sql = `SELECT * FROM "BloodDonor" WHERE 1=1`;
      const params: any[] = [];

      if (!showAll) {
        sql += ` AND "verified" = true`;
      }
      if (bloodGroup && bloodGroup !== 'All') {
        params.push(bloodGroup.trim());
        sql += ` AND UPPER("bloodGroup") = UPPER($${params.length})`;
      }
      if (location && location !== 'All') {
        params.push(`%${location.trim()}%`);
        sql += ` AND "location" ILIKE $${params.length}`;
      }
      if (query && query.trim()) {
        params.push(`%${query.trim()}%`);
        const idx = params.length;
        sql += ` AND (
          "name" ILIKE $${idx} OR 
          "bloodGroup" ILIKE $${idx} OR 
          "location" ILIKE $${idx} OR 
          "phone" ILIKE $${idx}
        )`;
      }
      sql += ` ORDER BY "createdAt" DESC`;

      const result = await pool.query(sql, params);
      rawDonors = result.rows || [];
    }

    const normalized = rawDonors.map(normalizeDonor).filter(Boolean);

    return NextResponse.json(normalized, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, bloodGroup, location, phone, lastDonated, verified } = body;

    if (!name || !bloodGroup || !phone) {
      return badRequestResponse('Full Name, Blood Group, and Mobile Number are required.');
    }

    const cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return badRequestResponse('Please provide a valid 10-digit mobile number.');
    }

    const cleanGroup = bloodGroup.toString().trim().toUpperCase();
    const cleanLocation = location?.trim() || 'Boisar (West)';
    const cleanLastDonated = lastDonated?.trim() || 'Ready to donate';
    const isVerified = typeof verified === 'boolean' ? verified : false;

    let createdDonor: any = null;

    try {
      createdDonor = await prisma.bloodDonor.create({
        data: {
          name: name.trim(),
          bloodGroup: cleanGroup,
          location: cleanLocation,
          phone: cleanPhone,
          lastDonated: cleanLastDonated,
          verified: isVerified,
        }
      });
    } catch (prismaErr) {
      console.warn('Prisma bloodDonor.create failed, falling back to raw pool query:', prismaErr);
      const result = await pool.query(
        `INSERT INTO "BloodDonor" 
          ("name", "bloodGroup", "location", "phone", "lastDonated", "verified", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
        [
          name.trim(),
          cleanGroup,
          cleanLocation,
          cleanPhone,
          cleanLastDonated,
          isVerified,
        ]
      );
      createdDonor = result.rows[0];
    }

    return NextResponse.json(normalizeDonor(createdDonor), {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors POST', error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, verified } = body;

    if (!id || verified === undefined) {
      return badRequestResponse('Donor ID and verified status are required.');
    }

    const donorId = parseInt(String(id), 10);
    const verifiedBool = Boolean(verified);
    let updatedDonor: any = null;

    try {
      updatedDonor = await prisma.bloodDonor.update({
        where: { id: donorId },
        data: { verified: verifiedBool }
      });
    } catch (prismaErr) {
      console.warn('Prisma bloodDonor.update failed, falling back to raw pool query:', prismaErr);
      const result = await pool.query(
        `UPDATE "BloodDonor" 
         SET "verified" = $1 
         WHERE "id" = $2 
         RETURNING *`,
        [verifiedBool, donorId]
      );
      if (result.rowCount === 0) {
        return badRequestResponse('Blood donor not found with provided ID.');
      }
      updatedDonor = result.rows[0];
    }

    return NextResponse.json(normalizeDonor(updatedDonor), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors PUT', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return unauthorizedResponse('Super Admin permission required to delete blood donor profiles');
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    if (!id && !phone) {
      return badRequestResponse('Donor ID or Phone number is required.');
    }

    if (id) {
      const donorId = parseInt(String(id), 10);
      try {
        await prisma.bloodDonor.delete({ where: { id: donorId } });
      } catch (prismaErr) {
        await pool.query(`DELETE FROM "BloodDonor" WHERE "id" = $1`, [donorId]);
      }
    } else if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, '');
      try {
        await prisma.bloodDonor.deleteMany({ where: { phone: cleanPhone } });
      } catch (prismaErr) {
        await pool.query(`DELETE FROM "BloodDonor" WHERE "phone" = $1`, [cleanPhone]);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Blood donor profile removed successfully' },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return internalServerErrorResponse('/api/blood-donors DELETE', error);
  }
}
