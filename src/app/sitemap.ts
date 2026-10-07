import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { BOISAR_HOTELS } from '@/lib/hotelsData';
import { resortsData, ResortVilla } from '@/lib/resortsData';

export const revalidate = 3600; // Revalidate every hour

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

const BOISAR_LOCALITY_SLUGS = [
  'boisar',
  'boisar-west',
  'boisar-east',
  'tarapur',
  'palghar',
  'ostwal-empire',
  'chitralaya'
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://majhboisar.in';
  const now = new Date();

  // 1. Core High-Value Pages & Trust Pages
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`,                   lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/about`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/claim-business`,    lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/properties`,        lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/hotels`,            lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/register-business`, lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/hire-vehicle`,      lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/services`,          lastModified: now, changeFrequency: 'daily',   priority: 0.92 },
    { url: `${baseUrl}/jobs`,              lastModified: now, changeFrequency: 'daily',   priority: 0.92 },
    { url: `${baseUrl}/food`,              lastModified: now, changeFrequency: 'daily',   priority: 0.92 },
    { url: `${baseUrl}/resorts`,           lastModified: now, changeFrequency: 'daily',   priority: 0.92 },
    { url: `${baseUrl}/blood-donation`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/home-services`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${baseUrl}/creators`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/advertise`,         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // 2. Real Verified Businesses with Clean Slugs
  let businessRoutes: MetadataRoute.Sitemap = [];
  try {
    const businesses = await prisma.business.findMany({
      where: {
        verified: true,
        isIndexable: true,
      },
      select: { id: true, slug: true, createdAt: true },
      orderBy: { id: 'asc' },
    });

    businessRoutes = businesses.map((b) => ({
      url: `${baseUrl}/business/${b.slug || b.id}`,
      lastModified: b.createdAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    }));
  } catch (err) {
    console.error('Failed to fetch businesses for sitemap:', err);
  }
  
  // 3. Category Landing Pages
  const categoryRoutes: MetadataRoute.Sitemap = CANONICAL_CATEGORY_SLUGS.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 4. Locality Pages (/location/{loc})
  const locationRoutes: MetadataRoute.Sitemap = BOISAR_LOCALITY_SLUGS.map((loc) => ({
    url: `${baseUrl}/location/${loc}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }));

  // 5. Boisar Category Pages (/boisar/{cat})
  const boisarCategoryRoutes: MetadataRoute.Sitemap = BOISAR_CATEGORY_SLUGS.map((cat) => ({
    url: `${baseUrl}/boisar/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }));

  // 6. Hotel Individual Pages
  const hotelRoutes: MetadataRoute.Sitemap = BOISAR_HOTELS.map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.slug || hotel.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // 7. Resort Individual Pages
  const resortRoutes: MetadataRoute.Sitemap = (resortsData || []).map((resort: ResortVilla) => ({
    url: `${baseUrl}/resorts#${resort.slug || resort.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    ...coreRoutes,
    ...businessRoutes,
    ...locationRoutes,
    ...boisarCategoryRoutes,
    ...categoryRoutes,
    ...hotelRoutes,
    ...resortRoutes,
  ];
}
