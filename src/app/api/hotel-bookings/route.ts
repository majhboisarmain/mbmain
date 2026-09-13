import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function ensureBookingsTableExists() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "HotelBooking" (
        "id" TEXT PRIMARY KEY,
        "hotelId" INTEGER,
        "hotelSlug" TEXT,
        "hotelName" TEXT NOT NULL,
        "hotelPhone" TEXT,
        "hotelAddress" TEXT,
        "guestName" TEXT NOT NULL,
        "guestPhone" TEXT NOT NULL,
        "roomCategory" TEXT DEFAULT 'Standard AC',
        "stayType" TEXT DEFAULT 'hourly',
        "timeSlot" TEXT,
        "checkInDate" TEXT,
        "checkOutDate" TEXT,
        "totalAmount" DOUBLE PRECISION DEFAULT 0,
        "status" TEXT DEFAULT 'Confirmed',
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (e) {
    console.error('[HotelBooking DB ensureTable Error]:', e);
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureBookingsTableExists();
    const { searchParams } = new URL(request.url);
    const guestPhone = searchParams.get('phone');
    const hotelId = searchParams.get('hotelId');
    const hotelSlug = searchParams.get('hotelSlug');
    const all = searchParams.get('all') === 'true';

    let query = 'SELECT * FROM "HotelBooking"';
    const params: any[] = [];

    if (!all) {
      if (guestPhone) {
        const clean10 = guestPhone.replace(/\D/g, '').slice(-10);
        query += ' WHERE "guestPhone" LIKE $1';
        params.push(`%${clean10}%`);
      } else if (hotelId) {
        query += ' WHERE "hotelId" = $1';
        params.push(Number(hotelId));
      } else if (hotelSlug) {
        query += ' WHERE "hotelSlug" = $1';
        params.push(hotelSlug);
      }
    }

    query += ' ORDER BY "createdAt" DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, bookings: result.rows });
  } catch (error: any) {
    console.error('[API GET /api/hotel-bookings Error]:', error);
    return NextResponse.json({ success: false, bookings: [], error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureBookingsTableExists();
    const body = await request.json().catch(() => ({}));
    const {
      hotelId,
      hotelSlug,
      hotelName,
      hotelPhone,
      hotelAddress,
      guestName,
      guestPhone,
      roomCategory = 'Standard AC',
      stayType = 'hourly',
      timeSlot,
      checkInDate,
      checkOutDate,
      totalAmount = 0,
      notes
    } = body;

    if (!guestName || !guestPhone || !hotelName) {
      return NextResponse.json({ error: 'Guest name, phone, and hotel details are required.' }, { status: 400 });
    }

    const randomRef = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `MB-BK-${randomRef}`;

    const insertQuery = `
      INSERT INTO "HotelBooking" (
        "id", "hotelId", "hotelSlug", "hotelName", "hotelPhone", "hotelAddress",
        "guestName", "guestPhone", "roomCategory", "stayType", "timeSlot",
        "checkInDate", "checkOutDate", "totalAmount", "status", "notes"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16
      ) RETURNING *;
    `;

    const values = [
      bookingId,
      hotelId ? Number(hotelId) : null,
      hotelSlug || null,
      hotelName,
      hotelPhone || '',
      hotelAddress || '',
      guestName.trim(),
      guestPhone.trim(),
      roomCategory,
      stayType,
      timeSlot || '',
      checkInDate || '',
      checkOutDate || '',
      Number(totalAmount) || 0,
      'Confirmed',
      notes || ''
    ];

    const result = await pool.query(insertQuery, values);
    const createdBooking = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed!',
      booking: createdBooking
    });
  } catch (error: any) {
    console.error('[API POST /api/hotel-bookings Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
