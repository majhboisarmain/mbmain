import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24 hours

const CANONICAL_CATEGORY_SLUGS = [
  'protein-supplements',
  'protein-shop',
  'gyms',
  'restaurants',
  'cafes-bakeries',
  'doctors',
  'dentists',
  'hospitals',
  'pathology',
  'opticians',
  'salons',
  'clothing-fashion',
  'jewellery-ornaments',
  'real-estate-properties',
  'hotels',
  'resorts-villas',
  'mobile-shops-repair',
  'electronics-home-appliances',
  'hardware-building-material',
  'electricians-wiring',
  'plumbers-sanitation',
  'water-purifier',
  'schools-colleges',
  'coaching-tuitions',
  'automobile-garages-repair',
  'car-bike-rentals',
  'travel-agencies-tours',
  'ca-tax-consultants',
  'photographers-videographers',
  'digital-marketing',
  'business-loan',
  'home-loan',
  'personal-loan',
  'loan-consultants',
  'health-insurance',
  'vehicle-insurance',
  'digital-printing',
  'pet-shops-vet-clinics',
  'packers-movers',
  'event-organisers-decor',
  'catering-tiffin-services',
  'yoga-martial-arts',
  'dance-music-classes',
  'pest-control-services',
  'ac-service-cooling',
  'interior-designers-decor',
  'steel-aluminium-fabrication',
  'lawyers-legal-advisors',
  'dairy-milk-products',
  'grocery-supermarkets',
];

const BOISAR_CATEGORY_SLUGS = [
  'restaurants',
  'doctors',
  'hospitals',
  'gyms',
  'salons',
  'mobile-shops',
  'opticians',
  'water-purifier',
  'loan-consultants',
  'schools',
  'hardware',
  'electricians',
  'plumbers'
];

export async function GET() {
  const baseUrl = 'https://majhboisar.in';
  const now = new Date().toISOString();

  const categoryUrls = CANONICAL_CATEGORY_SLUGS.map((slug) => `  <url>
    <loc>${baseUrl}/category/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>`);

  const boisarCategoryUrls = BOISAR_CATEGORY_SLUGS.map((slug) => `  <url>
    <loc>${baseUrl}/boisar/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.88</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...categoryUrls, ...boisarCategoryUrls].join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  });
}
