import { MetadataRoute } from 'next';
import { CATEGORY_CATALOG } from '@/lib/categoryMapping';
import { prisma } from '@/lib/db';

import { BOISAR_HOTELS } from '@/lib/hotelsData';
import { resortsData, ResortVilla } from '@/lib/resortsData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://majhboisar.in';

  // Core static pages
  const routes = [
    { route: '', priority: 1.0, changeFrequency: 'daily' as const },
    { route: '/services', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/food', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/hotels', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/resorts', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/hire-vehicle', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/properties', priority: 0.95, changeFrequency: 'daily' as const },
    { route: '/search', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/jobs', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/blood-donation', priority: 0.9, changeFrequency: 'daily' as const },
    { route: '/creators', priority: 0.85, changeFrequency: 'weekly' as const },
    { route: '/advertise', priority: 0.8, changeFrequency: 'monthly' as const },
    { route: '/terms', priority: 0.6, changeFrequency: 'monthly' as const },
    { route: '/privacy', priority: 0.6, changeFrequency: 'monthly' as const },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // Hotel individual pages
  const hotelRoutes = BOISAR_HOTELS.map((hotel) => ({
    url: `${baseUrl}/hotels/${hotel.slug || hotel.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Resort individual routes
  const resortRoutes = (resortsData || []).map((resort: ResortVilla) => ({
    url: `${baseUrl}/resorts#${resort.slug || resort.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // Index EVERY SINGLE ONE of the 800+ categories in CATEGORY_CATALOG!
  const allCategories = Array.from(new Set(CATEGORY_CATALOG.map((c) => c.category)));
  const categoryRoutes = allCategories.map((cat) => ({
    url: `${baseUrl}/category/${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const searchCategoryRoutes = allCategories.map((cat) => ({
    url: `${baseUrl}/search?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch all registered businesses from Database for dynamic indexing
  let businessRoutes: MetadataRoute.Sitemap = [];
  try {
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    businessRoutes = businesses.map((b) => ({
      url: `${baseUrl}/business/${b.id}`,
      lastModified: b.createdAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.error('Failed to fetch businesses for sitemap:', err);
  }

  // Fetch all active job listings from Database
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        createdAt: true,
      },
    });

    jobRoutes = jobs.map((j) => ({
      url: `${baseUrl}/jobs/${j.id}`,
      lastModified: j.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));
  } catch (err) {
    console.error('Failed to fetch jobs for sitemap:', err);
  }

  return [...routes, ...hotelRoutes, ...resortRoutes, ...categoryRoutes, ...searchCategoryRoutes, ...businessRoutes, ...jobRoutes];
}

