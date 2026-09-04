import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('bloodGroup');
    const location = searchParams.get('location');
    const query = searchParams.get('query');
    const showAll = searchParams.get('showAll');

    let sql = `SELECT * FROM "BloodDonor" WHERE 1=1`;
    const params: any[] = [];

    // Public visitors only see admin-approved verified donors
    if (showAll !== 'true') {
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
    return NextResponse.json(result.rows || [], {
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

    // Default to false for public registration (requires Admin verification), or use passed verified boolean for admin
    const isVerified = typeof verified === 'boolean' ? verified : false;

    const result = await pool.query(
      `INSERT INTO "BloodDonor" 
        ("name", "bloodGroup", "location", "phone", "lastDonated", "verified", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        name.trim(),
        bloodGroup.trim().toUpperCase(),
        location?.trim() || 'Boisar West',
        cleanPhone,
        lastDonated?.trim() || 'Ready to donate',
        isVerified,
      ]
    );

    return NextResponse.json(result.rows[0], {
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

    const result = await pool.query(
      `UPDATE "BloodDonor" 
       SET "verified" = $1 
       WHERE "id" = $2 
       RETURNING *`,
      [Boolean(verified), parseInt(id)]
    );

    if (result.rowCount === 0) {
      return badRequestResponse('Blood donor not found with provided ID.');
    }

    return NextResponse.json(result.rows[0], {
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    if (!id && !phone) {
      return badRequestResponse('Donor ID or Phone number is required.');
    }

    if (id) {
      await pool.query(`DELETE FROM "BloodDonor" WHERE "id" = $1`, [parseInt(id)]);
    } else if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, '');
      await pool.query(`DELETE FROM "BloodDonor" WHERE "phone" = $1`, [cleanPhone]);
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
