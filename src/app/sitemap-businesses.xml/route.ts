import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 3600; // 1 hour

export async function GET() {
  const baseUrl = 'https://majhboisar.in';
  const now = new Date().toISOString();

  let businesses: any[] = [];
  try {
    businesses = await prisma.business.findMany({
      where: {
        verified: true,
        isIndexable: true,
      },
      select: {
        id: true,
        slug: true,
        createdAt: true,
      },
      orderBy: { id: 'asc' },
    });
  } catch (err) {
    console.error('Error fetching businesses for sitemap-businesses.xml:', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${businesses
  .map((b) => {
    const slug = b.slug || b.id;
    const lastMod = b.createdAt ? new Date(b.createdAt).toISOString() : now;
    return `  <url>
    <loc>${baseUrl}/business/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
