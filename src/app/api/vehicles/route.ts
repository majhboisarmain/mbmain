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

    let sql = `SELECT * FROM "VehicleRental" WHERE 1=1`;
    const params: any[] = [];

    // Public visitors only see admin-approved verified listings
    if (showAll !== 'true') {
      sql += ` AND "verified" = true`;
    }

    if (category && category !== 'All') {
      params.push(category);
      sql += ` AND LOWER("category") = LOWER($${params.length})`;
    }

    if (query) {
      params.push(`%${query}%`);
      const idx = params.length;
      sql += ` AND (
        "name" ILIKE $${idx} OR 
        "vehicleModel" ILIKE $${idx} OR 
        "location" ILIKE $${idx} OR 
        "phone" ILIKE $${idx}
      )`;
    }

    sql += ` ORDER BY "featured" DESC, "createdAt" DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/vehicles GET', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      vehicleModel,
      capacity,
      ratePerKm,
      location,
      phone,
      timing,
      imageBase64,
      image,
      features,
      verified,
    } = body;

    if (!name || !phone) {
      return badRequestResponse('Driver / Agency Name and Contact Phone are required.');
    }

    const cleanPhone = phone.trim();
    const cleanCategory = category || 'Car & Cab';
    const cleanName = name.trim();
    const cleanModel = vehicleModel?.trim() || 'Standard Commercial Model';
    const cleanCapacity = capacity?.trim() || '4+1 Passengers';
    const cleanRate = ratePerKm?.trim() || 'Affordable Local Rate';
    const cleanLocation = location?.trim() || 'Boisar West';
    const cleanTiming = timing?.trim() || 'Daily 24x7';
    // User registrations require Admin approval before going live
    const isVerified = verified !== undefined ? Boolean(verified) : false;

    // Handle Image Upload if Base64
    let imageUrl: string | null = image || null;
    const rawImage = imageBase64 || (typeof image === 'string' && image.startsWith('data:image/') ? image : null);
    if (rawImage) {
      try {
        imageUrl = await uploadImage(rawImage);
      } catch (uploadErr) {
        console.warn('Image upload to Cloudinary failed, falling back to placeholder:', uploadErr);
      }
    }

    const featuresString = Array.isArray(features) ? JSON.stringify(features) : (features || null);

    // Duplicate Prevention & Upsert:
    // If vehicle with same phone and category already exists, update it instead of creating duplicates
    const existingCheck = await pool.query(
      `SELECT * FROM "VehicleRental" 
       WHERE "phone" = $1 AND LOWER("category") = LOWER($2) 
       ORDER BY "id" DESC LIMIT 1`,
      [cleanPhone, cleanCategory]
    );

    if (existingCheck.rows.length > 0) {
      const existingId = existingCheck.rows[0].id;
      // Preserve existing verified status unless explicitly passed
      const targetVerified = verified !== undefined ? Boolean(verified) : existingCheck.rows[0].verified;
      const updateSql = `
        UPDATE "VehicleRental"
        SET "name" = $1, 
            "vehicleModel" = $2, 
            "capacity" = $3, 
            "ratePerKm" = $4, 
            "location" = $5, 
            "timing" = $6, 
            "image" = COALESCE($7, "image"), 
            "features" = $8, 
            "verified" = $9
        WHERE "id" = $10
        RETURNING *;
      `;
      const updateResult = await pool.query(updateSql, [
        cleanName,
        cleanModel,
        cleanCapacity,
        cleanRate,
        cleanLocation,
        cleanTiming,
        imageUrl,
        featuresString,
        targetVerified,
        existingId
      ]);

      return NextResponse.json(updateResult.rows[0], { 
        status: 200,
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const insertSql = `
      INSERT INTO "VehicleRental" 
      ("name", "category", "vehicleModel", "capacity", "ratePerKm", "location", "phone", "timing", "rating", "reviewsCount", "verified", "image", "features", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *;
    `;

    const values = [
      cleanName,
      cleanCategory,
      cleanModel,
      cleanCapacity,
      cleanRate,
      cleanLocation,
      cleanPhone,
      cleanTiming,
      5.0,
      1,
      isVerified,
      imageUrl,
      featuresString,
    ];

    const result = await pool.query(insertSql, values);
    return NextResponse.json(result.rows[0], { 
      status: 201,
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/vehicles POST', error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, verified, featured } = body;
    if (!id) return badRequestResponse('Vehicle ID is required');

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
    const sql = `UPDATE "VehicleRental" SET ${updateFields.join(', ')} WHERE "id" = $${params.length} RETURNING *;`;
    const result = await pool.query(sql, params);

    if (result.rows.length === 0) {
      return badRequestResponse('Vehicle not found');
    }
    return NextResponse.json(result.rows[0], {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error: any) {
    return internalServerErrorResponse('/api/vehicles PUT', error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return badRequestResponse('Vehicle ID is required');

    await pool.query(`DELETE FROM "VehicleRental" WHERE "id" = $1`, [parseInt(id)]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return internalServerErrorResponse('/api/vehicles DELETE', error);
  }
}
