import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { 
  MapPin, Phone, MessageSquare, Star, ShieldCheck, 
  CheckCircle, Mail, HelpCircle, Truck, ShoppingBag 
} from 'lucide-react';

interface Props {
  params: Promise<{ category: string }>;
}

import { formatCategoryTitle, buildCategoryPrismaFilter } from '@/lib/categories';

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
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=700&auto=format&fit=crop&q=80',
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

  const catLower = (category || '').toLowerCase();
  const matchedKey = Object.keys(CATEGORY_STOCK_GALLERY).find(k => catLower.includes(k)) || 'default';
  const stock = CATEGORY_STOCK_GALLERY[matchedKey] || CATEGORY_STOCK_GALLERY['default'];

  if (all.length === 0 || (all.length === 1 && (all[0] === '/majh-boisar-mb-logo.png' || all[0].includes('mb-logo')))) {
    return stock;
  }

  if (all.length === 1) {
    return [all[0], stock[1], stock[2]].filter(Boolean);
  }
  if (all.length === 2) {
    return [all[0], all[1], stock[2]].filter(Boolean);
  }

  return all;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryTitle = formatCategoryTitle(category);

  const title = `Best ${categoryTitle} in Boisar — Phone, Address & Ratings`;
  const description = `Find verified ${categoryTitle.toLowerCase()} in Boisar, Palghar. Direct phone numbers, shop addresses, WhatsApp enquiry, and authentic customer details on Majh Boisar.`;
  const canonicalUrl = `https://majhboisar.in/boisar/${category.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Majh Boisar Directory',
      type: 'website',
      images: [
        {
          url: 'https://majhboisar.in/majh-boisar-mb-logo.png',
          width: 800,
          height: 600,
          alt: `${categoryTitle} in Boisar`,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    keywords: [
      `${categoryTitle.toLowerCase()} in boisar`,
      `best ${categoryTitle.toLowerCase()} in boisar`,
      `${categoryTitle.toLowerCase()} contact number`,
      'boisar directory',
      'majh boisar',
    ],
  };
}

export default async function BoisarCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryTitle = formatCategoryTitle(category);

  // Fetch verified businesses matching this category in Boisar using comprehensive synonyms
  const businesses = await prisma.business.findMany({
    where: buildCategoryPrismaFilter(category),
    orderBy: [
      { rating: 'desc' },
      { views: 'desc' },
      { id: 'asc' }
    ],
    take: 50
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://majhboisar.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Boisar Directory',
        'item': 'https://majhboisar.in/location/boisar'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': categoryTitle,
        'item': `https://majhboisar.in/boisar/${category.toLowerCase()}`
      }
    ]
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': businesses.slice(0, 10).map((b, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': b.name,
      'url': `https://majhboisar.in/business/${b.slug || b.id}`
    }))
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Main Body - EXACT Search Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">

        {/* Metadata & Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Palghar &gt; Boisar &gt; {categoryTitle}
            </p>
            <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-tight truncate leading-snug">
              {categoryTitle} in Boisar
            </h1>
          </div>
          <div className="shrink-0">
            <span className="text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap">
              {businesses.length} {businesses.length === 1 ? 'Listing' : 'Listings'}
            </span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-200/60 pb-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth">
          <div className="px-2.5 py-1 rounded-md border text-[10px] font-bold flex items-center gap-1 shrink-0 bg-emerald-50 border-emerald-300 text-emerald-800">
            <MapPin className="w-3 h-3 text-emerald-700" />
            <span>Near Me (1 km)</span>
          </div>

          <div className="relative shrink-0">
            <span className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-2xs">
              Sort by ▾
            </span>
          </div>

          <div className="px-2 py-1 rounded-md border text-[10px] font-bold flex items-center gap-1 shrink-0 bg-white border-slate-200 text-slate-600">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span>4.5+ Rated</span>
          </div>

          <div className="px-2 py-1 rounded-md border text-[10px] font-bold flex items-center gap-1 shrink-0 bg-white border-slate-200 text-slate-600">
            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>MB Verified</span>
          </div>

          <div className="px-2 py-1 rounded-md border bg-white border-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1 shrink-0">
            <span>% Deals</span>
          </div>
        </div>

        {/* Main Grid Layout (8 cols for listings, 4 cols for sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Businesses Listings (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {businesses.length > 0 ? (
              businesses.map((business) => {
                const allPhotos = getEnrichedPhotos(business.category, business.image, (business as any).gallery);
                const coverImage = allPhotos[0] || '/majh-boisar-mb-logo.png';
                const displayAddress = business.address.toLowerCase().includes((business.location || '').toLowerCase())
                  ? business.address
                  : `${business.address}${business.location ? `, ${business.location}` : ''}`;
                const hasHomeDelivery = Boolean(business.subscription && business.subscription !== 'Free' && (business as any).hasHomeDelivery !== false);
                const cleanPhone = (business.phone || '').replace(/\D/g, '');
                const cleanWa = (business.whatsapp || business.phone || '').replace(/\D/g, '');
                const bizHref = `/business/${business.slug || business.id}`;

                return (
                  <div
                    key={business.id}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-teal-500/40 transition-all duration-200 relative group flex flex-col text-left"
                  >
                    {/* Top Section: Clean Photo Grid (3 Side-by-Side Photos) */}
                    <div className="relative w-full overflow-hidden rounded-t-2xl bg-slate-100">
                      {allPhotos.length <= 1 ? (
                        <Link 
                          href={bizHref}
                          className="w-full h-44 sm:h-52 relative overflow-hidden group/photo bg-slate-900 flex items-center justify-center block"
                        >
                          <img
                            src={coverImage}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none"
                          />
                          <img
                            src={coverImage}
                            alt={business.name}
                            className="relative z-10 w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      ) : allPhotos.length === 2 ? (
                        <div className="grid grid-cols-2 gap-1.5 w-full h-44 sm:h-50 p-1.5 bg-slate-50">
                          {allPhotos.slice(0, 2).map((imgUrl, pIdx) => (
                            <Link
                              key={pIdx}
                              href={bizHref}
                              className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-900 group/photo flex items-center justify-center block"
                            >
                              <img
                                src={imgUrl}
                                alt={`${business.name} photo ${pIdx + 1}`}
                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5 w-full h-38 sm:h-44 p-1.5 bg-slate-50">
                          {allPhotos.slice(0, 3).map((imgUrl, pIdx) => (
                            <Link
                              key={pIdx}
                              href={bizHref}
                              className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-900 group/photo flex items-center justify-center block"
                            >
                              <img
                                src={imgUrl}
                                alt={`${business.name} photo ${pIdx + 1}`}
                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                              />
                              {/* Visits badge on 3rd photo */}
                              {pIdx === 2 && business.views != null && business.views > 0 && (
                                <div className="absolute bottom-1.5 right-1.5 bg-slate-950/85 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center gap-1 pointer-events-none backdrop-blur-xs">
                                  <span>👁️ {business.views.toLocaleString()} visits</span>
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Top Badges Overlay */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
                        <div className="flex flex-wrap items-center gap-1.5">
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
                        <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug hover:text-teal-700 transition-colors line-clamp-2">
                          <Link href={bizHref}>
                            {business.name}
                          </Link>
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
                    No {categoryTitle} Found in Boisar
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

      </div>
    </div>
  );
}
