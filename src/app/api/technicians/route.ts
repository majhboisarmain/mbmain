import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const showAll = searchParams.get('showAll');

    let sql = `SELECT * FROM "HomeTechnician" WHERE 1=1`;
    const params: any[] = [];

    // Public visitors only see admin-approved verified listings
    if (showAll !== 'true') {
      sql += ` AND "verified" = true`;
    }

    if (category && category !== 'All') {
      params.push(`%${category}%`);
      sql += ` AND "category" ILIKE $${params.length}`;
    }

    if (query) {
      params.push(`%${query}%`);
      const idx = params.length;
      sql += ` AND (
        "name" ILIKE $${idx} OR 
        "category" ILIKE $${idx} OR 
        "location" ILIKE $${idx} OR 
        "phone" ILIKE $${idx}
      )`;
    }

    sql += ` ORDER BY "featured" DESC, "createdAt" DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/technicians GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      experience,
      phone,
      location,
      visitingFee,
      timing,
      allowCalls,
      imageBase64,
      image,
      verified,
    } = body;

    if (!name || !phone) {
      return badRequestResponse('Technician / Service Name and Contact Phone are required.');
    }

    let imageUrl: string | null = image || null;
    const base64Data = imageBase64 || (image && image.startsWith('data:image') ? image : null);
    if (base64Data) {
      try {
        imageUrl = await uploadImage(base64Data);
      } catch (uploadErr) {
        console.warn('Cloudinary upload warning:', uploadErr);
        // If upload fails, keep whatever was passed if not huge, or null
        imageUrl = imageUrl && !imageUrl.startsWith('data:image') ? imageUrl : null;
      }
    }

    const cleanPhone = phone.trim();
    const cleanCategory = category || 'AC Service';
    const cleanName = name.trim();
    const cleanExperience = experience?.trim() || '5+ Yrs Experience';
    const cleanLocation = location?.trim() || 'Boisar West';
    const cleanVisitingFee = visitingFee?.trim() || '₹199 Inspection Fee';
    const cleanTiming = timing?.trim() || 'Available On-Demand';
    const cleanAllowCalls = allowCalls !== false;
    // User registrations require Admin approval before going live
    const isVerified = verified !== undefined ? Boolean(verified) : false;

    // Check if technician with same phone and category already exists
    const existingCheck = await pool.query(
      `SELECT * FROM "HomeTechnician" 
       WHERE "phone" = $1 AND LOWER("category") = LOWER($2) 
       ORDER BY "id" DESC LIMIT 1`,
      [cleanPhone, cleanCategory]
    );

    if (existingCheck.rows.length > 0) {
      const existingId = existingCheck.rows[0].id;
      const targetVerified = verified !== undefined ? Boolean(verified) : existingCheck.rows[0].verified;
      const updateSql = `
        UPDATE "HomeTechnician"
        SET "name" = $1,
            "experience" = $2,
            "location" = $3,
            "visitingFee" = $4,
            "timing" = $5,
            "allowCalls" = $6,
            "image" = COALESCE($7, "image"),
            "verified" = $8
        WHERE "id" = $9
        RETURNING *;
      `;
      const updateResult = await pool.query(updateSql, [
        cleanName,
        cleanExperience,
        cleanLocation,
        cleanVisitingFee,
        cleanTiming,
        cleanAllowCalls,
        imageUrl,
        targetVerified,
        existingId
      ]);
      return NextResponse.json(updateResult.rows[0], { 
        status: 200,
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const insertSql = `
      INSERT INTO "HomeTechnician"
      ("name", "category", "experience", "phone", "location", "visitingFee", "timing", "allowCalls", "rating", "reviewsCount", "verified", "image", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      RETURNING *;
    `;

    const values = [
      cleanName,
      cleanCategory,
      cleanExperience,
      cleanPhone,
      cleanLocation,
      cleanVisitingFee,
      cleanTiming,
      cleanAllowCalls,
      5.0,
      1,
      isVerified,
      imageUrl,
    ];

    const result = await pool.query(insertSql, values);
    return NextResponse.json(result.rows[0], { 
      status: 201,
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/technicians POST', error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, verified, featured } = body;
    if (!id) return badRequestResponse('Technician ID is required');

    const updateFields: string[] = [];
    const params: any[] = [];

    if (verified !== undefined) {
      params.push(Boolean(verified));
      updateFields.push(`"verified" = $${params.length}`);
    }
    if (featured !== undefined) {
      params.push(Boolean(featured));
      updateFields.push(`"featured" = $${params.length}`);
    }

    if (updateFields.length === 0) {
      return badRequestResponse('No fields to update');
    }

    params.push(parseInt(id));
    const sql = `UPDATE "HomeTechnician" SET ${updateFields.join(', ')} WHERE "id" = $${params.length} RETURNING *;`;
    const result = await pool.query(sql, params);

    if (result.rows.length === 0) {
      return badRequestResponse('Technician not found');
    }
    return NextResponse.json(result.rows[0], {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/technicians PUT', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequestResponse('Technician ID is required');

    await pool.query(`DELETE FROM "HomeTechnician" WHERE "id" = $1`, [parseInt(id)]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return internalServerErrorResponse('/api/technicians DELETE', error);
  }
}

