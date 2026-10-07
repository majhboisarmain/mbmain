import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24 hours

const LOCATIONS = [
  'boisar',
  'boisar-west',
  'boisar-east',
  'tarapur',
  'palghar',
  'ostwal-empire',
  'chitralaya'
];

export async function GET() {
  const baseUrl = 'https://majhboisar.in';
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${LOCATIONS
  .map(
    (loc) => `  <url>
    <loc>${baseUrl}/location/${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.88</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  });
}
