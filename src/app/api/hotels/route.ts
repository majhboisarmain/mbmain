import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Helper to ensure Hotel table exists
async function ensureHotelTableExists() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Hotel" (
        "id" SERIAL PRIMARY KEY,
        "slug" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "tagline" TEXT,
        "category" TEXT DEFAULT 'Budget',
        "badge" TEXT,
        "offerBadge" TEXT,
        "suitabilityTag" TEXT,
        "location" TEXT DEFAULT 'Boisar',
        "address" TEXT NOT NULL,
        "landmark" TEXT,
        "phone" TEXT NOT NULL,
        "whatsapp" TEXT NOT NULL,
        "rating" DOUBLE PRECISION DEFAULT 4.5,
        "reviewsCount" INTEGER DEFAULT 0,
        "hourlyRate3h" DOUBLE PRECISION DEFAULT 499,
        "hourlyRate6h" DOUBLE PRECISION DEFAULT 799,
        "hourlyRate12h" DOUBLE PRECISION DEFAULT 1199,
        "nightRate" DOUBLE PRECISION DEFAULT 1499,
        "is3hAvailable" BOOLEAN DEFAULT true,
        "is6hAvailable" BOOLEAN DEFAULT true,
        "is12hAvailable" BOOLEAN DEFAULT true,
        "isNightAvailable" BOOLEAN DEFAULT true,
        "isCoupleFriendly" BOOLEAN DEFAULT true,
        "acceptsLocalId" BOOLEAN DEFAULT true,
        "nearStation" BOOLEAN DEFAULT false,
        "nearMidc" BOOLEAN DEFAULT false,
        "isComingSoon" BOOLEAN DEFAULT false,
        "gallery" TEXT,
        "amenities" TEXT,
        "description" TEXT,
        "rules" TEXT,
        "rooms" TEXT,
        "status" TEXT DEFAULT 'Active',
        "createdBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (e) {
    console.error('[Hotels DB ensureTable Error]:', e);
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureHotelTableExists();
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const all = searchParams.get('all') === 'true';

    let query = 'SELECT * FROM "Hotel"';
    const params: any[] = [];

    if (!all) {
      if (phone) {
        const clean10 = phone.replace(/\D/g, '').slice(-10);
        query += ' WHERE "createdBy" LIKE $1 OR "phone" LIKE $1 OR "whatsapp" LIKE $1';
        params.push(`%${clean10}%`);
      } else {
        query += ' WHERE "status" = $1';
        params.push('Active');
      }
    }

    query += ' ORDER BY "createdAt" DESC';

    const result = await pool.query(query, params);
    const hotels = result.rows.map(row => {
      let gallery: string[] = [];
      let amenities: any[] = [];
      let rooms: any[] = [];
      let rules: string[] = [];

      try { gallery = JSON.parse(row.gallery || '[]'); } catch { if (row.gallery) gallery = [row.gallery]; }
      try { amenities = JSON.parse(row.amenities || '[]'); } catch {}
      try { rooms = JSON.parse(row.rooms || '[]'); } catch {}
      try { rules = JSON.parse(row.rules || '[]'); } catch {}

      return {
        ...row,
        id: String(row.id),
        gallery,
        amenities,
        rooms,
        rules
      };
    });

    return NextResponse.json({ success: true, hotels });
  } catch (error: any) {
    console.error('[API GET /api/hotels Error]:', error);
    return NextResponse.json({ success: false, hotels: [], error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureHotelTableExists();
    const body = await request.json().catch(() => ({}));
    const {
      name,
      tagline,
      category = 'Budget',
      location = 'Boisar',
      address,
      landmark,
      phone,
      whatsapp,
      hourlyRate3h = 499,
      hourlyRate6h = 799,
      hourlyRate12h = 1199,
      nightRate = 1499,
      is3hAvailable = true,
      is6hAvailable = true,
      is12hAvailable = true,
      isNightAvailable = true,
      isCoupleFriendly = true,
      acceptsLocalId = true,
      nearStation = false,
      nearMidc = false,
      gallery = [],
      amenities = [],
      description,
      rules = [],
      rooms = [],
      createdBy
    } = body;

    if (!name || !address || !phone) {
      return NextResponse.json({ error: 'Hotel name, address, and phone number are required.' }, { status: 400 });
    }

    const cleanName = name.trim();
    const baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Admin check for instant approval
    const adminToken = request.cookies.get('majh_admin_token')?.value;
    const isAdmin = adminToken ? verifyJwtToken<{ role?: string }>(adminToken)?.role === 'Admin' : false;
    const status = isAdmin ? 'Active' : 'Pending';

    const insertQuery = `
      INSERT INTO "Hotel" (
        "slug", "name", "tagline", "category", "location", "address", "landmark",
        "phone", "whatsapp", "hourlyRate3h", "hourlyRate6h", "hourlyRate12h", "nightRate",
        "is3hAvailable", "is6hAvailable", "is12hAvailable", "isNightAvailable", "isCoupleFriendly",
        "acceptsLocalId", "nearStation", "nearMidc", "gallery", "amenities", "description",
        "rules", "rooms", "status", "createdBy"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27, $28
      ) RETURNING *;
    `;

    const values = [
      slug,
      cleanName,
      tagline || '',
      category,
      location,
      address,
      landmark || '',
      phone,
      whatsapp || phone,
      Number(hourlyRate3h) || 499,
      Number(hourlyRate6h) || 799,
      Number(hourlyRate12h) || 1199,
      Number(nightRate) || 1499,
      Boolean(is3hAvailable),
      Boolean(is6hAvailable),
      Boolean(is12hAvailable),
      Boolean(isNightAvailable),
      Boolean(isCoupleFriendly),
      Boolean(acceptsLocalId),
      Boolean(nearStation),
      Boolean(nearMidc),
      JSON.stringify(Array.isArray(gallery) ? gallery : []),
      JSON.stringify(Array.isArray(amenities) ? amenities : []),
      description || '',
      JSON.stringify(Array.isArray(rules) ? rules : []),
      JSON.stringify(Array.isArray(rooms) ? rooms : []),
      status,
      createdBy || phone
    ];

    const result = await pool.query(insertQuery, values);
    const createdHotel = result.rows[0];

    return NextResponse.json({
      success: true,
      message: isAdmin ? 'Hotel listed and approved!' : 'Hotel submitted successfully! Awaiting Admin verification.',
      hotel: createdHotel
    });
  } catch (error: any) {
    console.error('[API POST /api/hotels Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create hotel' }, { status: 500 });
  }
}
