import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    let sql = `SELECT * FROM "VehicleRental" WHERE 1=1`;
    const params: any[] = [];

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

    sql += ` ORDER BY "createdAt" DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows);
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
    } = body;

    if (!name || !phone) {
      return badRequestResponse('Driver / Agency Name and Contact Phone are required.');
    }

    let imageUrl: string | null = image || null;
    if (imageBase64) {
      imageUrl = await uploadImage(imageBase64);
    }

    const featuresString = Array.isArray(features) ? JSON.stringify(features) : (features || null);

    const insertSql = `
      INSERT INTO "VehicleRental" 
      ("name", "category", "vehicleModel", "capacity", "ratePerKm", "location", "phone", "timing", "rating", "reviewsCount", "verified", "image", "features", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      RETURNING *;
    `;

    const values = [
      name.trim(),
      category || 'Car & Cab',
      vehicleModel?.trim() || 'Standard Commercial Model',
      capacity?.trim() || '4+1 Passengers',
      ratePerKm?.trim() || 'Affordable Local Rate',
      location?.trim() || 'Boisar West',
      phone.trim(),
      timing?.trim() || 'Daily 24x7',
      5.0,
      1,
      true,
      imageUrl,
      featuresString,
    ];

    const result = await pool.query(insertSql, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/vehicles POST', error);
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
