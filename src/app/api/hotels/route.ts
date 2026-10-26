import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyJwtToken } from '@/lib/auth';
import { BOISAR_HOTELS } from '@/lib/hotelsData';
import { uploadGallery, uploadImage } from '@/lib/cloudinary';

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
        "dayRate" DOUBLE PRECISION DEFAULT 999,
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
        "isPayAtHotelAvailable" BOOLEAN DEFAULT true,
        "gallery" TEXT,
        "amenities" TEXT,
        "description" TEXT,
        "rules" TEXT,
        "rooms" TEXT,
        "status" TEXT DEFAULT 'Active',
        "createdBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE "Hotel" ADD COLUMN IF NOT EXISTS "isPayAtHotelAvailable" BOOLEAN DEFAULT true;
    `);

    // Auto-seed BOISAR_HOTELS into PostgreSQL if database table is empty
    const countRes = await pool.query('SELECT COUNT(*) FROM "Hotel"');
    if (parseInt(countRes.rows[0].count, 10) === 0 && Array.isArray(BOISAR_HOTELS)) {
      for (const h of BOISAR_HOTELS) {
        await pool.query(`
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
          ) ON CONFLICT ("slug") DO NOTHING
        `, [
          h.slug || h.id,
          h.name,
          h.tagline || '',
          h.category || 'Budget',
          h.location || 'Boisar',
          h.address || 'Boisar West',
          h.landmark || '',
          h.phone || '917769947217',
          h.whatsapp || h.phone || '917769947217',
          h.hourlyRate3h || 499,
          h.hourlyRate6h || 799,
          h.hourlyRate12h || 1199,
          h.nightRate || 1499,
          Boolean(h.is3hAvailable),
          Boolean(h.is6hAvailable),
          Boolean(h.is12hAvailable),
          Boolean(h.isNightAvailable),
          Boolean(h.isCoupleFriendly),
          Boolean(h.acceptsLocalId),
          Boolean(h.nearStation),
          Boolean(h.nearMidc),
          JSON.stringify(h.gallery || []),
          JSON.stringify(h.amenities || []),
          h.description || '',
          JSON.stringify(h.rules || []),
          JSON.stringify((h as any).rooms || []),
          'Active',
          'system_seed'
        ]);
      }
    }
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

    return NextResponse.json(
      { success: true, hotels },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=60',
        },
      }
    );
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
      dayRate = 999,
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

    // Instant Live Status for all newly listed hotels on central database
    const status = 'Active';

    let finalGallery: string[] = [];
    try {
      finalGallery = await uploadGallery(Array.isArray(gallery) ? gallery : []);
    } catch (e) {
      finalGallery = Array.isArray(gallery) ? gallery : [];
    }

    const insertQuery = `
      INSERT INTO "Hotel" (
        "slug", "name", "tagline", "category", "location", "address", "landmark",
        "phone", "whatsapp", "hourlyRate3h", "hourlyRate6h", "hourlyRate12h", "dayRate", "nightRate",
        "is3hAvailable", "is6hAvailable", "is12hAvailable", "isNightAvailable", "isCoupleFriendly",
        "acceptsLocalId", "nearStation", "nearMidc", "gallery", "amenities", "description",
        "rules", "rooms", "status", "createdBy"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25,
        $26, $27, $28, $29
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
      Number(dayRate) || 999,
      Number(nightRate) || 1499,
      Boolean(is3hAvailable),
      Boolean(is6hAvailable),
      Boolean(is12hAvailable),
      Boolean(isNightAvailable),
      Boolean(isCoupleFriendly),
      Boolean(acceptsLocalId),
      Boolean(nearStation),
      Boolean(nearMidc),
      JSON.stringify(finalGallery),
      JSON.stringify(Array.isArray(amenities) ? amenities : []),
      description || '',
      JSON.stringify(Array.isArray(rules) ? rules : []),
      JSON.stringify(Array.isArray(rooms) ? rooms : []),
      status,
      createdBy || phone
    ];

    const result = await pool.query(insertQuery, values);
    const row = result.rows[0];
    const createdHotel = {
      ...row,
      id: String(row.id),
      gallery: finalGallery,
      amenities: Array.isArray(amenities) ? amenities : [],
      rooms: Array.isArray(rooms) ? rooms : [],
      rules: Array.isArray(rules) ? rules : []
    };

    return NextResponse.json({
      success: true,
      message: 'Hotel listed and LIVE on Majh Boisar!',
      hotel: createdHotel
    });
  } catch (error: any) {
    console.error('[API POST /api/hotels Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create hotel' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureHotelTableExists();
    const body = await request.json().catch(() => ({}));
    const {
      id,
      slug,
      name,
      tagline,
      category,
      location,
      address,
      landmark,
      phone,
      whatsapp,
      description,
      gallery,
      amenities,
      rules,
      rooms,
      hourlyRate3h,
      hourlyRate6h,
      hourlyRate12h,
      dayRate,
      nightRate,
      isCoupleFriendly,
      acceptsLocalId,
      nearStation,
      nearMidc,
      isPayAtHotelAvailable,
      offersHourly,
      createdBy,
      status
    } = body;

    if (!id && !slug && !name) {
      return NextResponse.json({ error: 'Hotel id, slug, or name required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name !== undefined) {
      updates.push(`"name" = $${idx++}`);
      values.push(name.trim());
    }
    if (tagline !== undefined) {
      updates.push(`"tagline" = $${idx++}`);
      values.push(tagline);
    }
    if (category !== undefined) {
      updates.push(`"category" = $${idx++}`);
      values.push(category);
    }
    if (location !== undefined) {
      updates.push(`"location" = $${idx++}`);
      values.push(location);
    }
    if (address !== undefined) {
      updates.push(`"address" = $${idx++}`);
      values.push(address);
    }
    if (landmark !== undefined) {
      updates.push(`"landmark" = $${idx++}`);
      values.push(landmark);
    }
    if (description !== undefined) {
      updates.push(`"description" = $${idx++}`);
      values.push(description);
    }

    // Photo gallery update with Cloudinary upload
    let uploadedGallery: string[] | undefined = undefined;
    if (gallery !== undefined && Array.isArray(gallery)) {
      try {
        uploadedGallery = await uploadGallery(gallery);
      } catch (err) {
        console.warn('Cloudinary upload gallery error:', err);
        uploadedGallery = gallery;
      }
      updates.push(`"gallery" = $${idx++}`);
      values.push(JSON.stringify(uploadedGallery));
    }

    // Rooms update with individual photo uploads if base64
    if (rooms !== undefined && Array.isArray(rooms)) {
      let processedRooms = rooms;
      try {
        processedRooms = await Promise.all(rooms.map(async (r: any) => {
          if (r.image && r.image.startsWith('data:image/')) {
            try {
              const up = await uploadImage(r.image);
              if (up) return { ...r, image: up };
            } catch (e) {}
          }
          return r;
        }));
      } catch (e) {}
      updates.push(`"rooms" = $${idx++}`);
      values.push(JSON.stringify(processedRooms));
    }

    if (amenities !== undefined && Array.isArray(amenities)) {
      updates.push(`"amenities" = $${idx++}`);
      values.push(JSON.stringify(amenities));
    }
    if (rules !== undefined && Array.isArray(rules)) {
      updates.push(`"rules" = $${idx++}`);
      values.push(JSON.stringify(rules));
    }
    if (hourlyRate3h !== undefined) {
      updates.push(`"hourlyRate3h" = $${idx++}`);
      values.push(Number(hourlyRate3h) || 499);
    }
    if (hourlyRate6h !== undefined) {
      updates.push(`"hourlyRate6h" = $${idx++}`);
      values.push(Number(hourlyRate6h) || 799);
    }
    if (hourlyRate12h !== undefined) {
      updates.push(`"hourlyRate12h" = $${idx++}`);
      values.push(Number(hourlyRate12h) || 1199);
    }
    if (dayRate !== undefined) {
      updates.push(`"dayRate" = $${idx++}`);
      values.push(Number(dayRate) || 999);
    }
    if (nightRate !== undefined) {
      updates.push(`"nightRate" = $${idx++}`);
      values.push(Number(nightRate) || 1499);
    }
    if (isCoupleFriendly !== undefined) {
      updates.push(`"isCoupleFriendly" = $${idx++}`);
      values.push(Boolean(isCoupleFriendly));
    }
    if (acceptsLocalId !== undefined) {
      updates.push(`"acceptsLocalId" = $${idx++}`);
      values.push(Boolean(acceptsLocalId));
    }
    if (nearStation !== undefined) {
      updates.push(`"nearStation" = $${idx++}`);
      values.push(Boolean(nearStation));
    }
    if (nearMidc !== undefined) {
      updates.push(`"nearMidc" = $${idx++}`);
      values.push(Boolean(nearMidc));
    }
    if (typeof isPayAtHotelAvailable === 'boolean') {
      updates.push(`"isPayAtHotelAvailable" = $${idx++}`);
      values.push(isPayAtHotelAvailable);
    }
    if (typeof offersHourly === 'boolean') {
      updates.push(`"is3hAvailable" = $${idx++}`);
      values.push(offersHourly);
      updates.push(`"is6hAvailable" = $${idx++}`);
      values.push(offersHourly);
      updates.push(`"is12hAvailable" = $${idx++}`);
      values.push(offersHourly);
    }
    if (createdBy !== undefined) {
      const cleanOwner = createdBy ? String(createdBy).replace(/\D/g, '').slice(-10) : null;
      updates.push(`"createdBy" = $${idx++}`);
      values.push(cleanOwner);
    }
    if (phone !== undefined) {
      updates.push(`"phone" = $${idx++}`);
      values.push(phone);
    }
    if (whatsapp !== undefined) {
      updates.push(`"whatsapp" = $${idx++}`);
      values.push(whatsapp);
    }
    if (status !== undefined) {
      updates.push(`"status" = $${idx++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true, message: 'No updates provided' });
    }

    let query = `UPDATE "Hotel" SET ${updates.join(', ')} WHERE `;
    const numericId = typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id)) ? Number(id) : null;
    if (numericId) {
      query += `"id" = $${idx}`;
      values.push(numericId);
    } else if (slug) {
      query += `"slug" = $${idx}`;
      values.push(slug);
    } else {
      query += `LOWER("name") = LOWER($${idx})`;
      values.push(name);
    }
    query += ' RETURNING *;';

    let result = await pool.query(query, values);

    // If no row updated, hotel might be from static catalog not yet inserted, so upsert it now!
    if (result.rows.length === 0) {
      const staticHotel = BOISAR_HOTELS.find(h => 
        (slug && h.slug === slug) || 
        (id && (h.id === String(id) || h.slug === String(id))) || 
        (name && h.name.toLowerCase() === String(name).toLowerCase())
      ) || ({} as any);

      const insertName = (name || staticHotel.name || slug || 'Hotel').trim();
      const insertSlug = slug || staticHotel.slug || insertName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const cleanOwner = createdBy ? String(createdBy).replace(/\D/g, '').slice(-10) : null;

      const upsertQuery = `
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
        )
        ON CONFLICT ("slug") DO UPDATE SET
          "name" = EXCLUDED."name",
          "tagline" = EXCLUDED."tagline",
          "category" = EXCLUDED."category",
          "location" = EXCLUDED."location",
          "address" = EXCLUDED."address",
          "landmark" = EXCLUDED."landmark",
          "phone" = EXCLUDED."phone",
          "whatsapp" = EXCLUDED."whatsapp",
          "gallery" = EXCLUDED."gallery",
          "description" = EXCLUDED."description",
          "rooms" = EXCLUDED."rooms",
          "rules" = EXCLUDED."rules",
          "amenities" = EXCLUDED."amenities",
          "isCoupleFriendly" = EXCLUDED."isCoupleFriendly",
          "acceptsLocalId" = EXCLUDED."acceptsLocalId"
        RETURNING *;
      `;

      const upsertValues = [
        insertSlug,
        insertName,
        tagline || staticHotel.tagline || '',
        category || staticHotel.category || 'Executive / 3-Star',
        location || staticHotel.location || 'Boisar',
        address || staticHotel.address || 'Boisar West',
        landmark || staticHotel.landmark || '',
        phone || staticHotel.phone || '9307294733',
        whatsapp || staticHotel.whatsapp || phone || '9307294733',
        Number(hourlyRate3h || staticHotel.hourlyRate3h) || 499,
        Number(hourlyRate6h || staticHotel.hourlyRate6h) || 799,
        Number(hourlyRate12h || staticHotel.hourlyRate12h) || 1199,
        Number(nightRate || staticHotel.nightRate) || 1499,
        offersHourly !== undefined ? Boolean(offersHourly) : true,
        offersHourly !== undefined ? Boolean(offersHourly) : true,
        offersHourly !== undefined ? Boolean(offersHourly) : true,
        true,
        isCoupleFriendly !== undefined ? Boolean(isCoupleFriendly) : true,
        acceptsLocalId !== undefined ? Boolean(acceptsLocalId) : true,
        nearStation !== undefined ? Boolean(nearStation) : false,
        nearMidc !== undefined ? Boolean(nearMidc) : false,
        JSON.stringify(uploadedGallery || gallery || staticHotel.gallery || []),
        JSON.stringify(amenities || staticHotel.amenities || []),
        description || staticHotel.description || '',
        JSON.stringify(rules || staticHotel.rules || []),
        JSON.stringify(rooms || staticHotel.rooms || []),
        'Active',
        cleanOwner || phone || null
      ];

      result = await pool.query(upsertQuery, upsertValues);
    }

    const row = result.rows[0];
    let returnGallery: string[] = [];
    let returnAmenities: any[] = [];
    let returnRooms: any[] = [];
    let returnRules: string[] = [];
    try { returnGallery = JSON.parse(row.gallery || '[]'); } catch { if (row.gallery) returnGallery = [row.gallery]; }
    try { returnAmenities = JSON.parse(row.amenities || '[]'); } catch {}
    try { returnRooms = JSON.parse(row.rooms || '[]'); } catch {}
    try { returnRules = JSON.parse(row.rules || '[]'); } catch {}

    const updatedHotel = {
      ...row,
      id: String(row.id),
      gallery: returnGallery,
      amenities: returnAmenities,
      rooms: returnRooms,
      rules: returnRules
    };

    return NextResponse.json({ success: true, hotel: updatedHotel });
  } catch (error: any) {
    console.error('[API PATCH /api/hotels Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update hotel' }, { status: 500 });
  }
}
