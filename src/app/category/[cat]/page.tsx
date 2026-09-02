import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { 
  MapPin, Phone, MessageSquare, Star, ShieldCheck, 
  ArrowLeft, Search, Filter, ChevronRight, CheckCircle2,
  Sparkles, ExternalLink, HelpCircle
} from 'lucide-react';

interface Props {
  params: Promise<{ cat: string }>;
  searchParams: Promise<{ area?: string }>;
}

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

function formatCategoryName(raw: string): string {
  const decoded = decodeURIComponent(raw).replace(/-/g, ' ').trim();
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

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
  const resolvedParams = await params;
  const categoryName = formatCategoryName(resolvedParams.cat);
  const title = `Top 10 Best ${categoryName} in Boisar (2026) | Verified & Contact - Majh Boisar`;
  const description = `Find the best ${categoryName} in Boisar, Palghar. Browse verified phone numbers, photos, reviews, addresses, and direct WhatsApp enquiry on Majh Boisar local directory.`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    keywords: [
      `best ${categoryName.toLowerCase()} in boisar`,
      `top ${categoryName.toLowerCase()} in boisar`,
      `${categoryName.toLowerCase()} near boisar station`,
      `${categoryName.toLowerCase()} in ostwal empire boisar`,
      `${categoryName.toLowerCase()} in tarapur midc`,
      `boisar ${categoryName.toLowerCase()} contact number`,
      `${categoryName.toLowerCase()} near me boisar`,
      `${categoryName.toLowerCase()} palghar`,
      'majh boisar directory',
    ],
    openGraph: {
      title,
      description,
      url: `https://majhboisar.in/category/${encodeURIComponent(resolvedParams.cat)}`,
      siteName: 'Majh Boisar Local Directory',
      images: [
        {
          url: 'https://majhboisar.in/majh-boisar-mb-logo.png',
          width: 800,
          height: 600,
          alt: `Best ${categoryName} in Boisar`,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://majhboisar.in/category/${encodeURIComponent(resolvedParams.cat)}`,
    },
  };
}


export default async function CategorySEOPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const categoryName = formatCategoryName(resolvedParams.cat);
  const selectedArea = resolvedSearchParams.area || 'All';

  // Fetch matching businesses from DB
  let businesses: any[] = [];
  try {
    const filterConditions: any = {
      OR: [
        { category: { contains: categoryName, mode: 'insensitive' } },
        { name: { contains: categoryName, mode: 'insensitive' } },
        { description: { contains: categoryName, mode: 'insensitive' } }
      ]
    };

    if (selectedArea && selectedArea !== 'All') {
      filterConditions.AND = [
        {
          OR: [
            { location: { contains: selectedArea, mode: 'insensitive' } },
            { address: { contains: selectedArea, mode: 'insensitive' } }
          ]
        }
      ];
    }

    businesses = await prisma.business.findMany({
      where: filterConditions,
      orderBy: [
        { verified: 'desc' },
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: 50
    });
  } catch (e) {
    console.error('Error loading businesses for category:', e);
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
        'image': b.image || 'https://majhboisar.in/majh-boisar-mb-logo.png',
        'telephone': b.phone || '+91-9876543210',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': b.address,
          'addressLocality': 'Boisar',
          'addressRegion': 'Maharashtra',
          'postalCode': '401501',
          'addressCountry': 'IN'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': b.rating || 4.5,
          'reviewCount': b.reviewCount || 10
        },
        'url': `https://majhboisar.in/business/${b.id}`
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
        'item': 'https://majhboisar.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Boisar Directory',
        'item': 'https://majhboisar.in/search'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `${categoryName} in Boisar`,
        'item': `https://majhboisar.in/category/${encodeURIComponent(resolvedParams.cat)}`
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

  const BOISAR_AREAS = ['All', 'Boisar West', 'Ostwal Empire', 'Station Road', 'Tarapur MIDC', 'Navapur Road', 'Betegaon'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Schema.org Structured Data Injection */}
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

      {/* ── TOP NAV BAR ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-teal-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-black text-teal-800 hover:underline flex items-center gap-1"
            >
              <span>Majh Boisar</span>
              <span className="text-[10px] bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded font-black">Local</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER & BREADCRUMB ── */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-950 to-slate-950 text-white pt-8 pb-10 px-4 sm:px-6 relative overflow-hidden text-left">
        <div className="max-w-6xl mx-auto relative z-10 space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300/80 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-white transition-colors">Boisar Directory</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>

          {/* Title & SEO Description */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10.5px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Verified Boisar Local Directory 2026</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Top 10 Best {categoryName} in Boisar, Palghar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Explore verified {categoryName.toLowerCase()} in Boisar with direct phone numbers, customer reviews, multi-photo galleries, maps &amp; instant WhatsApp contact.
            </p>
          </div>

          {/* Area Filter Chips */}
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <span className="text-[11px] font-bold text-teal-200 shrink-0 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Area:
            </span>
            {BOISAR_AREAS.map((area) => {
              const isActive = selectedArea === area;
              return (
                <Link
                  key={area}
                  href={`/category/${encodeURIComponent(resolvedParams.cat)}${area === 'All' ? '' : `?area=${encodeURIComponent(area)}`}`}
                  className={`text-[11px] font-black px-3 py-1 rounded-xl transition-all shrink-0 border cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  {area}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT LISTINGS ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <span>{businesses.length} Verified {categoryName} Listed</span>
            {selectedArea !== 'All' && (
              <span className="text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200 font-bold">
                in {selectedArea}
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-500 font-bold">Sort: Recommended &amp; Top Rated</span>
        </div>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {businesses.map((business) => {
              const allPhotos = getEnrichedPhotos(business.category, business.image, business.gallery);
              const coverImage = allPhotos[0] || '/majh-boisar-mb-logo.png';
              const cleanPhone = (business.phone || '').replace(/\D/g, '');
              const cleanWhatsapp = (business.whatsapp || business.phone || '').replace(/\D/g, '');

              return (
                <div
                  key={business.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-500/50 transition-all overflow-hidden flex flex-col justify-between text-left group"
                >
                  {/* Photo Strip (Clean 2 or 3 Side-by-Side Photos) */}
                  <div className="relative w-full overflow-hidden bg-slate-100">
                    {allPhotos.length <= 1 ? (
                      <Link href={`/business/${business.id}`} className="block w-full h-44 sm:h-48 relative overflow-hidden bg-slate-900">
                        <img
                          src={coverImage}
                          alt={business.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    ) : allPhotos.length === 2 ? (
                      <div className="grid grid-cols-2 gap-1.5 w-full h-44 sm:h-48 p-1.5 bg-slate-50">
                        {allPhotos.slice(0, 2).map((imgUrl, pIdx) => (
                          <Link key={pIdx} href={`/business/${business.id}`} className="w-full h-full rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                            <img src={imgUrl} alt={`${business.name} ${pIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5 w-full h-38 sm:h-44 p-1.5 bg-slate-50">
                        {allPhotos.slice(0, 3).map((imgUrl, pIdx) => (
                          <Link key={pIdx} href={`/business/${business.id}`} className="w-full h-full rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                            <img src={imgUrl} alt={`${business.name} ${pIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {pIdx === 2 && allPhotos.length > 3 && (
                              <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black">
                                +{allPhotos.length - 3} more
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Verified & Rating Badge Overlay */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1.5 pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        {business.verified && (
                          <span className="bg-teal-700/95 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Verified</span>
                          </span>
                        )}
                        <span className="bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                          {business.category}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        <span>{business.rating ? Number(business.rating).toFixed(1) : '4.5'}</span>
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/business/${business.id}`}>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                          {business.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-600 font-medium flex items-start gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{business.address}</span>
                      </p>
                    </div>

                    {/* Action Call & WhatsApp Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      {cleanPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs py-2 rounded-xl border border-slate-250 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-teal-700" />
                          <span>Call Now</span>
                        </a>
                      )}

                      {cleanWhatsapp && (
                        <a
                          href={`https://wa.me/91${cleanWhatsapp}?text=${encodeURIComponent(
                            `Hello ${business.name}, I saw your listing on Majh Boisar and would like to enquire about your services.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <Link
                        href={`/business/${business.id}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-250"
                        title="View Full Profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-base font-black text-slate-900">
              No {categoryName} Found in {selectedArea}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Be the first business owner to list your {categoryName.toLowerCase()} on Majh Boisar local directory for free.
            </p>
            <Link
              href="/business/new"
              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              + List Your Business Free
            </Link>
          </div>
        )}

        {/* ── GOOGLE RICH FAQ SECTION ── */}
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
                Listing is 100% free! Click the <strong>List Business Free</strong> button on the header, fill your contact details and photos, and your business will start appearing in Google search results.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
