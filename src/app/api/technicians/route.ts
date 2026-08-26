import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { uploadImage } from '@/lib/cloudinary';
import { internalServerErrorResponse, badRequestResponse } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');

    let sql = `SELECT * FROM "HomeTechnician" WHERE 1=1`;
    const params: any[] = [];

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

    sql += ` ORDER BY "createdAt" DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json(result.rows);
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
      imageBase64,
      image,
    } = body;

    if (!name || !phone) {
      return badRequestResponse('Technician / Service Name and Contact Phone are required.');
    }

    let imageUrl: string | null = image || null;
    if (imageBase64) {
      imageUrl = await uploadImage(imageBase64);
    }

    const insertSql = `
      INSERT INTO "HomeTechnician"
      ("name", "category", "experience", "phone", "location", "visitingFee", "rating", "reviewsCount", "verified", "image", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *;
    `;

    const values = [
      name.trim(),
      category || 'AC Service',
      experience?.trim() || '5+ Yrs Experience',
      phone.trim(),
      location?.trim() || 'Boisar West',
      visitingFee?.trim() || '₹199 Inspection Fee',
      5.0,
      1,
      true,
      imageUrl,
    ];

    const result = await pool.query(insertSql, values);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    return internalServerErrorResponse('/api/technicians POST', error);
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
