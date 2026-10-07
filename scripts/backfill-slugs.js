const pg = require('pg');
require('dotenv').config();

function generateSlug(name) {
  if (!name) return 'business-boisar';
  let clean = name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!clean.includes('boisar')) {
    clean = `${clean}-boisar`;
  }
  return clean;
}

async function backfillSlugs() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase. Checking existing businesses for slugs...');

    const res = await client.query('SELECT id, name, location, slug FROM "Business" ORDER BY id ASC;');
    console.log(`Found ${res.rows.length} total businesses.`);

    const usedSlugs = new Set();
    // collect existing non-null slugs
    res.rows.forEach(b => {
      if (b.slug) usedSlugs.add(b.slug);
    });

    for (const b of res.rows) {
      if (!b.slug) {
        let baseSlug = generateSlug(b.name);
        let candidateSlug = baseSlug;
        let counter = 2;

        while (usedSlugs.has(candidateSlug)) {
          candidateSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        usedSlugs.add(candidateSlug);
        await client.query('UPDATE "Business" SET slug = $1 WHERE id = $2;', [candidateSlug, b.id]);
        console.log(`Updated ID ${b.id} (${b.name}) => Slug: "${candidateSlug}"`);
      } else {
        console.log(`ID ${b.id} already has slug: "${b.slug}"`);
      }
    }

    console.log('All businesses successfully have SEO slugs assigned!');
  } catch (err) {
    console.error('Backfill error:', err);
  } finally {
    await client.end();
  }
}

backfillSlugs();
