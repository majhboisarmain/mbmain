import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24 hours

const CANONICAL_CATEGORY_SLUGS = [
  'gyms',
  'salons',
  'ac-service-cooling',
  'ac-repair',
  'restaurants',
  'cafes-bakeries',
  'doctors',
  'dentists',
  'hospitals',
  'pathology',
  'opticians',
  'eye-opticians',
  'water-purifier',
  'schools',
  'schools-colleges',
  'coaching-tuitions',
  'electricians-wiring',
  'plumbers-sanitation',
  'hardware-building-material',
  'mobile-shops-repair',
  'electronics-home-appliances',
  'real-estate-properties',
  'hotels',
  'resorts-villas',
  'car-bike-rentals',
  'automobile-garages-repair',
  'digital-printing',
  'digital-marketing',
  'photographers-videographers',
  'ca-tax-consultants',
  'loans',
  'loan-consultants',
  'home-loan',
  'business-loan',
  'personal-loan',
  'health-insurance',
  'vehicle-insurance',
  'jewellery-ornaments',
  'footwear',
  'clothing-fashion',
  'grocery-supermarkets',
  'interior-designers-decor',
  'steel-aluminium-fabrication',
  'pest-control-services',
  'pet-shops-vet-clinics',
  'packers-movers',
  'event-organisers-decor',
  'catering-tiffin-services',
  'yoga-martial-arts',
  'dance-music-classes',
  'lawyers-legal-advisors',
  'dairy-milk-products',
  'protein',
  'protein-supplements',
  'protein-shop',
];

export async function GET() {
  const baseUrl = 'https://www.majhboisar.in';
  const now = new Date().toISOString();

  const categoryUrls = CANONICAL_CATEGORY_SLUGS.map((slug) => `  <url>
    <loc>${baseUrl}/category/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  });
}
