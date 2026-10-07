const pg = require('pg');
require('dotenv').config();

async function runMigration() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected! Applying safe non-destructive column additions...');

    const alterQueries = [
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "slug" TEXT;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "locality" TEXT;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "pincode" TEXT DEFAULT '401501';`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "state" TEXT DEFAULT 'Maharashtra';`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "claimed" BOOLEAN DEFAULT false;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "claimedBy" TEXT;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;`,
      `ALTER TABLE "Business" ADD COLUMN IF NOT EXISTS "isIndexable" BOOLEAN DEFAULT true;`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "Business_slug_key" ON "Business"("slug");`,
      `CREATE INDEX IF NOT EXISTS "Business_slug_idx" ON "Business"("slug");`,
      `CREATE INDEX IF NOT EXISTS "Business_category_idx" ON "Business"("category");`,
      `CREATE INDEX IF NOT EXISTS "Business_location_idx" ON "Business"("location");`,
      `CREATE TABLE IF NOT EXISTS "BusinessClaim" (
        "id" SERIAL PRIMARY KEY,
        "businessId" INTEGER NOT NULL,
        "businessName" TEXT NOT NULL,
        "claimantName" TEXT NOT NULL,
        "claimantPhone" TEXT NOT NULL,
        "claimantEmail" TEXT,
        "proofDocument" TEXT,
        "message" TEXT,
        "status" TEXT NOT NULL DEFAULT 'Pending',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`
    ];

    for (const q of alterQueries) {
      await client.query(q);
      console.log('Executed:', q.substring(0, 50) + '...');
    }

    console.log('Migration completed successfully in Supabase!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await client.end();
  }
}

runMigration();
