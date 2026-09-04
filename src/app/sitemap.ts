import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { BOISAR_HOTELS } from '@/lib/hotelsData';
import { resortsData, ResortVilla } from '@/lib/resortsData';

export const revalidate = 3600; // Revalidate every hour

// Top curated high-intent Boisar categories that rank for local searches
const TOP_BOISAR_CATEGORIES = [
  'Gyms & Fitness Centers',
  'Gyms',
  'Restaurants & Dining',
  'Doctors & Specialists',
  'Hospitals',
  'Salon & Beauty Parlour',
  'Medical Stores & Pharmacy',
  'Real Estate & Properties',
  'Mobile Shops & Repair',
  'Electricians & Wiring',
  'Plumbers & Sanitation',
  'Automobile Garages & Repair',
  'Jewellery & Ornaments',
  'Clothing & Fashion',
  'Coaching Classes',
  'Diagnostic Labs',
  'Protein & Supplements',
  'Hardware Stores',
  'Furniture & Home Decor',
  'Car & Tempo Rental',
  'Event Planners & Banquet',
  'Water Purifier Dealers',
  'AC Service & Cooling',
  'Pest Control Services',
  'House Cleaning',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://majhboisar.in';
  const now = new Date();

  // 1. Core High-Value Pages (Priority 1.0 - 0.9)
  const coreRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`,                   lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/services`,          lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/food`,              lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/hotels`,            lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/resorts`,           lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/properties`,        lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/hire-vehicle`,      lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/jobs`,              lastModified: now, changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/blood-donation`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/home-services`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${baseUrl}/creators`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${baseUrl}/advertise`,         lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/privacy`,           lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`,             lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 2. Real Verified Businesses (Priority 0.95 - each verified business is an authentic entity)
  let businessRoutes: MetadataRoute.Sitemap = [];
  try {
    const businesses = await prisma.business.findMany({
      select: { id: true, createdAt: true },
      orderBy: { id: 'asc' },
    });

    businessRoutes = businesses.map((b) => ({
      url: `${baseUrl}/business/${b.id}`,
      lastModified: b.createdAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.95,
    }));
  } catch (err) {
    console.error('Failed to fetch businesses for sitemap:', err);
  }

  // 3. Top High-Intent Category Landing Pages (Priority 0.9)
  const categoryRoutes: MetadataRoute.Sitemap = TOP_BOISAR_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 4. Hotel Individual Pages
  const hotelRoutes: MetadataRoute.Sitemap = BOISAR_HOTELS.map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.slug || hotel.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }));

  // 5. Resort Individual Pages
  const resortRoutes: MetadataRoute.Sitemap = (resortsData || []).map((resort: ResortVilla) => ({
    url: `${baseUrl}/resorts#${resort.slug || resort.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.88,
  }));

  // 6. Active Job Listings (Limit to top active jobs)
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    jobRoutes = jobs.map((j) => ({
      url: `${baseUrl}/jobs/${j.id}`,
      lastModified: j.createdAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.82,
    }));
  } catch (err) {
    console.error('Failed to fetch jobs for sitemap:', err);
  }

  return [
    ...coreRoutes,
    ...businessRoutes,
    ...categoryRoutes,
    ...hotelRoutes,
    ...resortRoutes,
    ...jobRoutes,
  ];
}
