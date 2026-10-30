import { Metadata } from 'next';
import Link from 'next/link';
import { LRUCache } from 'lru-cache';
import { prisma } from '@/lib/db';
import { 
  MapPin, Phone, MessageSquare, Star, ShieldCheck, 
  CheckCircle, Mail, HelpCircle, Truck, ShoppingBag, Sparkles,
  ChevronDown, Percent
} from 'lucide-react';
import { formatCategoryTitle, buildCategoryPrismaFilter } from '@/lib/categories';
import BackButton from '@/components/BackButton';

// In-memory cache for category listings (60s TTL)
const categoryListingsCache = new LRUCache<string, any[]>({
  max: 100,
  ttl: 1000 * 60, // 60 seconds
});


interface Props {
  params: Promise<{ cat: string }>;
  searchParams: Promise<{ area?: string }>;
}

export const revalidate = 60;

const CATEGORY_STOCK_GALLERY: Record<string, string[]> = {
  gym: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=700&auto=format&fit=crop&q=80',
  ],
  salon: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=700&auto=format&fit=crop&q=80',
  ],
  cloth: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=700&auto=format&fit=crop&q=80',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=700&auto=format&fit=crop&q=80',
  ],
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700&auto=format&fit=crop&q=80',
  ],
  food: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700&auto=format&fit=crop&q=80',
  ],
  doctor: [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?w=700&auto=format&fit=crop&q=80',
  ],
  hospital: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=700&auto=format&fit=crop&q=80',
  ],
  school: [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=700&auto=format&fit=crop&q=80',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&auto=format&fit=crop&q=80',
  ],
  furniture: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&auto=format&fit=crop&q=80',
  ],
  automobile: [
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&auto=format&fit=crop&q=80',
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&auto=format&fit=crop&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80',
  ]
};

function getEnrichedPhotos(category: string, image?: string, gallery?: string[]): string[] {
  const rawImage = image || '';
  const imageParts = rawImage.split('||gallery_sep||').filter(Boolean);
  const coverImage = imageParts[0];
  const galleryPhotos = Array.isArray(gallery) && gallery.length > 0
    ? gallery.filter(Boolean)
    : imageParts.slice(1);
  let all = Array.from(new Set([coverImage, ...galleryPhotos])).filter(Boolean) as string[];

  if (all.length === 0 || (all.length === 1 && (all[0] === '/majh-boisar-mb-logo.png' || all[0].includes('mb-logo')))) {
    return ['/majh-boisar-mb-logo.png'];
  }

  // Strictly return ONLY real photos uploaded by the business (Zero fake demo/stock photos)
  return all;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const rawCat = resolvedParams.cat;
  const categoryName = formatCategoryTitle(rawCat);
  const slugKeyword = rawCat.replace(/-/g, ' ');

  const currentYear = new Date().getFullYear();
  // Front-load high CTR keywords ("Top Best ... in Boisar (2026)") for #1 Google ranking
  const title = `Top Best ${categoryName} in Boisar (${currentYear}) — Verified Contact & Reviews | Majh Boisar`;
  const description = `Find top verified ${categoryName.toLowerCase()} and ${slugKeyword} in Boisar, Palghar (${currentYear}). Direct phone numbers, shop addresses, customer ratings, and instant WhatsApp enquiry on Majh Boisar directory.`;
  const cleanSlug = rawCat.toLowerCase().trim();
  const canonicalUrl = `https://www.majhboisar.in/category/${cleanSlug}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    keywords: [
      `${slugKeyword} in boisar`,
      `${slugKeyword} boisar`,
      `best ${slugKeyword} in boisar`,
      `top ${slugKeyword} in boisar`,
      `${categoryName.toLowerCase()} in boisar`,
      `best ${categoryName.toLowerCase()} in boisar`,
      `top ${categoryName.toLowerCase()} in boisar`,
      `${slugKeyword} near me boisar`,
      `${categoryName.toLowerCase()} near boisar station`,
      `${categoryName.toLowerCase()} in ostwal empire boisar`,
      `${categoryName.toLowerCase()} in tarapur midc`,
      `boisar ${slugKeyword} contact number`,
      `${categoryName.toLowerCase()} palghar`,
      'majh boisar directory',
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Majh Boisar Local Directory',
      images: [
        {
          url: 'https://www.majhboisar.in/majh-boisar-mb-logo.png',
          width: 800,
          height: 600,
          alt: `Best ${categoryName} in Boisar`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategorySEOPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categoryName = formatCategoryTitle(resolvedParams.cat);
  const searchKeyword = resolvedParams.cat.replace(/-/g, ' ');
  const selectedArea = resolvedSearchParams.area || 'All';

  // Fetch matching businesses with in-memory caching
  const cacheKey = `${resolvedParams.cat.toLowerCase()}_${selectedArea.toLowerCase()}`;
  let businesses: any[] = categoryListingsCache.get(cacheKey) || [];

  if (businesses.length === 0) {
    try {
      const filterConditions = buildCategoryPrismaFilter(resolvedParams.cat, selectedArea);

      businesses = await prisma.business.findMany({
        where: filterConditions,
        orderBy: [
          { premium: 'desc' },
          { verified: 'desc' },
          { rating: 'desc' },
          { views: 'desc' }
        ],
        take: 50
      });

      // Ensure businesses with premium or active subscription are strictly ranked on top
      const isFeatured = (b: any) => Boolean(b.premium || (b.subscription && b.subscription !== 'Free'));
      businesses.sort((a, b) => {
        const featA = isFeatured(a);
        const featB = isFeatured(b);
        if (featA && !featB) return -1;
        if (!featA && featB) return 1;
        return (b.rating || 0) - (a.rating || 0) || (b.views || 0) - (a.views || 0);
      });

      categoryListingsCache.set(cacheKey, businesses);
    } catch (e) {
      console.error('Error loading businesses for category:', e);
    }
  }


  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': businesses.slice(0, 10).map((b, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'LocalBusiness',
        'name': b.name,
        'image': b.image || 'https://www.majhboisar.in/majh-boisar-mb-logo.png',
        'telephone': b.phone || '+91-9876543210',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': b.address,
          'addressLocality': 'Boisar',
          'addressRegion': 'Maharashtra',
          'postalCode': '401501',
          'addressCountry': 'IN'
        },
        ...(b.rating && b.rating > 0 ? {
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': b.rating.toString(),
            'reviewCount': (b.reviewCount && b.reviewCount > 0 ? b.reviewCount : 1).toString()
          }
        } : {}),
        'url': `https://www.majhboisar.in/business/${b.slug || b.id}`
      }
    }))
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://www.majhboisar.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Boisar Directory',
        'item': 'https://www.majhboisar.in/search'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${categoryName} in Boisar`,
        'item': `https://www.majhboisar.in/category/${encodeURIComponent(resolvedParams.cat)}`
      }
    ]
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `How to find the best verified ${categoryName.toLowerCase()} in Boisar?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `You can browse the curated list of verified ${categoryName.toLowerCase()} on Majh Boisar directory with direct phone numbers, customer reviews, photo galleries, and instant WhatsApp chat.`
        }
      },
      {
        '@type': 'Question',
        'name': `Which are the top rated ${categoryName.toLowerCase()} in Boisar West and Station area?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Top rated options in Boisar include verified local service providers located around Ostwal Empire, Station Road, and Navapur Road listed with authentic 4.5+ star customer ratings on Majh Boisar.`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Main Body - EXACT Search Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">

        {/* Metadata & Header with Back Button */}
        <div className="flex items-center justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <BackButton variant="pill" label="Back" fallbackUrl="/" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                Palghar &gt; Boisar &gt; {categoryName}
              </p>
              <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-tight truncate leading-snug">
                {categoryName} in Boisar
              </h1>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap">
              {businesses.length} {businesses.length === 1 ? 'Listing' : 'Listings'}
            </span>
          </div>
        </div>

        {/* Filters Row - Clean, uniform h-8 height, no awkward sizing */}
        <div className="flex items-center gap-2 mb-2.5 border-b border-slate-200/60 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth">
          <div className="h-8 px-3 rounded-lg border border-slate-200/90 bg-white text-slate-700 text-[11px] font-bold shadow-2xs inline-flex items-center gap-1 shrink-0">
            <span>Sort by</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="h-8 px-3 rounded-lg border border-slate-200/90 bg-white text-slate-700 text-[11px] font-bold shadow-2xs inline-flex items-center gap-1.5 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span>4.5+ Rated</span>
          </div>

          <div className="h-8 px-3 rounded-lg border border-slate-200/90 bg-white text-slate-700 text-[11px] font-bold shadow-2xs inline-flex items-center gap-1.5 shrink-0">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>MB Verified</span>
          </div>

          <div className="h-8 px-3 rounded-lg border border-slate-200/90 bg-white text-slate-700 text-[11px] font-bold shadow-2xs inline-flex items-center gap-1.5 shrink-0">
            <Percent className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>% Deals</span>
          </div>
        </div>

        {/* Main Grid Layout (8 cols for listings, 4 cols for sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Businesses Listings (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {businesses.length > 0 ? (
              businesses.map((business) => {
                const allPhotos = getEnrichedPhotos(business.category, business.image, business.gallery);
                const coverImage = allPhotos[0] || '/majh-boisar-mb-logo.png';
                const displayAddress = business.address.toLowerCase().includes((business.location || '').toLowerCase())
                  ? business.address
                  : `${business.address}${business.location ? `, ${business.location}` : ''}`;
                const hasHomeDelivery = Boolean(business.subscription && business.subscription !== 'Free' && business.hasHomeDelivery !== false);
                const isFeaturedBiz = Boolean(business.premium || (business.subscription && business.subscription !== 'Free'));
                const cleanPhone = (business.phone || '').replace(/\D/g, '');
                const cleanWa = (business.whatsapp || business.phone || '').replace(/\D/g, '');
                const bizHref = `/business/${business.slug || business.id}`;

                return (
                  <div
                    key={business.id}
                    className={`bg-white border rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 relative group flex flex-col text-left ${
                      isFeaturedBiz
                        ? 'border-amber-300 ring-1 ring-amber-400/30 shadow-amber-500/5'
                        : 'border-slate-200/90 hover:border-teal-500/40'
                    }`}
                  >
                    {/* Entire upper + middle area is a single Link so clicking anywhere on the box opens the business */}
                    <Link
                      href={bizHref}
                      prefetch={true}
                      className="block flex-1 flex flex-col cursor-pointer text-left focus:outline-none no-underline group/card"
                    >
                      {/* Top Section: Clean Photo Grid (3 Side-by-Side Photos) */}
                      <div className="relative w-full overflow-hidden rounded-t-2xl bg-slate-100">
                        {allPhotos.length <= 1 ? (
                          <div className="w-full h-44 sm:h-52 relative overflow-hidden bg-slate-900 flex items-center justify-center block">
                            <img
                              src={coverImage}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none"
                            />
                            <img
                              src={coverImage}
                              alt={business.name}
                              loading="lazy"
                              decoding="async"
                              className="relative z-10 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                            />
                            {business.views != null && business.views > 0 && (
                              <div className="absolute bottom-2 right-2 bg-slate-950/85 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center gap-1 pointer-events-none backdrop-blur-xs z-20">
                                <span>👁️ {business.views.toLocaleString()} visits</span>
                              </div>
                            )}
                          </div>
                        ) : allPhotos.length === 2 ? (
                          <div className="grid grid-cols-2 gap-1.5 w-full h-44 sm:h-50 p-1.5 bg-slate-50">
                            {allPhotos.slice(0, 2).map((imgUrl, pIdx) => (
                              <div
                                key={pIdx}
                                className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-900 flex items-center justify-center block"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`${business.name} photo ${pIdx + 1}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                />
                                {pIdx === 1 && business.views != null && business.views > 0 && (
                                  <div className="absolute bottom-1.5 right-1.5 bg-slate-950/85 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center gap-1 pointer-events-none backdrop-blur-xs">
                                    <span>👁️ {business.views.toLocaleString()} visits</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5 w-full h-38 sm:h-44 p-1.5 bg-slate-50">
                            {allPhotos.slice(0, 3).map((imgUrl, pIdx) => (
                              <div
                                key={pIdx}
                                className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-900 flex items-center justify-center block"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`${business.name} photo ${pIdx + 1}`}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                />
                                {/* Visits badge on 3rd photo */}
                                {pIdx === 2 && business.views != null && business.views > 0 && (
                                  <div className="absolute bottom-1.5 right-1.5 bg-slate-950/85 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center gap-1 pointer-events-none backdrop-blur-xs">
                                    <span>👁️ {business.views.toLocaleString()} visits</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Top Badges Overlay */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {isFeaturedBiz && (
                              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] sm:text-[9.5px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 backdrop-blur-xs tracking-wider uppercase border border-amber-300/60">
                                <Sparkles className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                                <span>Featured</span>
                              </span>
                            )}
                            {hasHomeDelivery && (
                              <span className="bg-emerald-600 text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1 backdrop-blur-xs">
                                <Truck className="w-3 h-3 text-white" />
                                <span>Home Delivery</span>
                              </span>
                            )}
                            {business.verified && (
                              <span className="bg-teal-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle Section: Business Information Details */}
                      <div className="p-3.5 space-y-2 flex-1">
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug group-hover/card:text-teal-700 transition-colors line-clamp-2">
                            {business.name}
                          </h3>
                        </div>

                        {/* Category & Review Ratings Row */}
                        <div className="flex items-center gap-2 flex-wrap pt-0.5">
                          <span className="bg-teal-50 border border-teal-200/80 text-teal-800 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">
                            {business.category}
                          </span>
                          <span className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                            <span className="text-slate-800 font-black">{business.rating ? Number(business.rating).toFixed(1) : '5.0'}</span>
                            <span className="text-slate-400">({business.reviewCount || 0} Ratings)</span>
                          </span>
                        </div>

                        {/* Location Address Block */}
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium flex items-start gap-1.5 line-clamp-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{displayAddress}</span>
                        </p>
                      </div>
                    </Link>

                    {/* Bottom Section: Action Buttons Full-Width Strip */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2.5 pt-0 border-t border-slate-100 w-full mt-auto">
                      {/* Phone button */}
                      <a
                        href={cleanPhone ? `tel:${cleanPhone}` : '#'}
                        className="bg-[#09843c] hover:bg-[#07682f] text-white font-black text-[10px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-white shrink-0" />
                        <span className="truncate">{cleanPhone || 'Call'}</span>
                      </a>

                      {/* WhatsApp button */}
                      <a
                        href={cleanWa ? `https://wa.me/91${cleanWa}?text=${encodeURIComponent(`Hi ${business.name}, I found your business on Majh Boisar. I would like to inquire about your services.`)}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-[#09843c] text-[#09843c] font-black text-[10px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all hover:bg-emerald-50 cursor-pointer shadow-2xs"
                      >
                        <MessageSquare className="w-3 h-3 text-[#09843c] shrink-0" />
                        <span className="truncate">WhatsApp</span>
                      </a>

                      {/* Order / Enquiry button */}
                      <Link
                        href={bizHref}
                        className={`${hasHomeDelivery ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0076db] hover:bg-[#0062b8]'} text-white font-black text-[10px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer`}
                      >
                        {hasHomeDelivery ? (
                          <>
                            <ShoppingBag className="w-3 h-3 text-white shrink-0" />
                            <span className="truncate">Order Online</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-white shrink-0" />
                            <span className="truncate">Enquiry</span>
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-2xs space-y-3">
                <div className="h-12 w-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 text-xl">
                  🏪
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    No {categoryName} Found in Boisar
                  </h3>
                </div>
                <div className="pt-1">
                  <Link
                    href="/register-business"
                    className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-2xs"
                  >
                    + List Your Business Free
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Advertisement Stack (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Ad Card 1 */}
            <div className="w-full aspect-[300/250] bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400/60 p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="bg-indigo-50 text-indigo-700 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded uppercase border border-indigo-100">
                    Majh Boisar
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200 shrink-0">
                    AD
                  </span>
                </div>
                <h4 className="text-[12px] sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                  Get 5x More Local Customers!
                </h4>
              </div>
              <div className="mt-auto pt-2">
                <Link
                  href="/advertise"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-[9px] sm:text-xs py-2 rounded-xl shadow-2xs transition-all cursor-pointer text-center uppercase tracking-wider block"
                >
                  Advertise Now ➔
                </Link>
              </div>
            </div>

            {/* Ad Card 2 */}
            <div className="w-full aspect-[300/250] bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400/60 p-3 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="bg-teal-50 text-teal-700 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded uppercase border border-teal-100">
                    Majh Boisar
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200 shrink-0">
                    AD
                  </span>
                </div>
                <h4 className="text-[12px] sm:text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-2">
                  Grow Your Business Locally
                </h4>
              </div>
              <div className="mt-auto pt-2">
                <Link
                  href="/advertise"
                  className="w-full bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-[9px] sm:text-xs py-2 rounded-xl shadow-2xs transition-all cursor-pointer text-center uppercase tracking-wider block"
                >
                  Get Featured ➔
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <section className="mt-12 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-2xs text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              Frequently Asked Questions: {categoryName} in Boisar
            </h2>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            <div className="pt-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                1. How can I contact the top verified {categoryName.toLowerCase()} in Boisar?
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                You can directly connect with verified local business owners in Boisar by clicking the <strong>Call Now</strong> or <strong>WhatsApp</strong> buttons listed on each profile on Majh Boisar.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                2. Are businesses in Boisar West and Ostwal Empire covered?
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Yes! Majh Boisar covers all key residential and commercial areas including Boisar West, Ostwal Empire, Station Road, Tarapur MIDC, Navapur Road, and Betegaon.
              </p>
            </div>

            <div className="pt-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                3. How do I list my own {categoryName.toLowerCase()} business on Majh Boisar?
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Listing is 100% free! Click the <strong>Register Your Business</strong> button on the header, fill your contact details and photos, and your business will start appearing in Google search results.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
