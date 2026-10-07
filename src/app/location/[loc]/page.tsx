import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { 
  MapPin, Phone, MessageSquare, Star, ShieldCheck, 
  ChevronRight, ExternalLink, Building2, Store, Truck, 
  ShoppingBag, Mail, Sparkles 
} from 'lucide-react';
import { getCategorySlug } from '@/lib/categories';

interface Props {
  params: Promise<{ loc: string }>;
}

const KNOWN_LOCATIONS: Record<string, { title: string; areaKeywords: string[]; desc: string }> = {
  'boisar': {
    title: 'Boisar',
    areaKeywords: ['boisar', 'tarapur', 'navapur', 'ostwal', 'chitralaya'],
    desc: 'Explore verified shops, doctors, restaurants, schools, gyms and services across Boisar, Maharashtra.'
  },
  'boisar-west': {
    title: 'Boisar West',
    areaKeywords: ['boisar west', 'west'],
    desc: 'Browse verified businesses, shops, and professional services located in Boisar West, Maharashtra.'
  },
  'boisar-east': {
    title: 'Boisar East',
    areaKeywords: ['boisar east', 'east', 'chillar'],
    desc: 'Find trusted local businesses, healthcare providers, and retail stores in Boisar East.'
  },
  'tarapur': {
    title: 'Tarapur MIDC',
    areaKeywords: ['tarapur', 'midc', 'salwad'],
    desc: 'Discover industrial suppliers, fabrication units, logistics, and local services in Tarapur MIDC, Boisar.'
  },
  'palghar': {
    title: 'Palghar & Surrounding Area',
    areaKeywords: ['palghar', 'dahanu', 'boisar'],
    desc: 'Find verified businesses and services connecting Boisar, Palghar and nearby industrial corridors.'
  },
  'ostwal-empire': {
    title: 'Ostwal Empire Boisar',
    areaKeywords: ['ostwal', 'ostwal empire'],
    desc: 'Local directory of businesses, clinics, salons, and food joints in Ostwal Empire, Boisar.'
  },
  'chitralaya': {
    title: 'Chitralaya Boisar',
    areaKeywords: ['chitralaya', 'rooprajat'],
    desc: 'Verified shops, medical clinics, and daily services located in Chitralaya and Rooprajat Nagar, Boisar.'
  }
};

const POPULAR_CATEGORIES = [
  { name: 'Gyms & Fitness', slug: 'gyms-and-fitness-centers', icon: '💪' },
  { name: 'Restaurants & Dining', slug: 'restaurants-and-dining', icon: '🍽️' },
  { name: 'Doctors & Clinics', slug: 'doctors-and-specialists', icon: '🩺' },
  { name: 'Hospitals', slug: 'hospitals-and-emergency', icon: '🏥' },
  { name: 'Mobile Shops & Repair', slug: 'mobile-shops-and-repair', icon: '📱' },
  { name: 'Eye Opticians', slug: 'eye-care-and-opticians', icon: '👓' },
  { name: 'Schools & Education', slug: 'schools-and-colleges', icon: '🎓' },
  { name: 'CA & Tax Consultants', slug: 'ca-and-tax-consultants', icon: '💼' },
  { name: 'Beauty Salons', slug: 'salon-and-beauty-parlour', icon: '💇' },
  { name: 'Water Purifier & RO', slug: 'home-services-and-repairs', icon: '💧' },
  { name: 'Protein & Supplements', slug: 'protein-and-supplements', icon: '🏋️' },
  { name: 'Pharmacy & Medical', slug: 'medical-stores-and-pharmacy', icon: '💊' },
];

const FALLBACK_SHOWCASE_PHOTOS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80'
];

function parseGalleryImages(imageStr?: string | null): string[] {
  if (!imageStr) return [];
  if (imageStr.includes('||gallery_sep||')) {
    return imageStr.split('||gallery_sep||').map(s => s.trim()).filter(Boolean);
  }
  if (imageStr.startsWith('[') && imageStr.endsWith(']')) {
    try {
      const parsed = JSON.parse(imageStr);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
  }
  return [imageStr.trim()];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { loc } = await params;
  const locLower = loc.toLowerCase().trim();
  const locationInfo = KNOWN_LOCATIONS[locLower] || {
    title: loc.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    desc: `Browse top verified local businesses, shops, and services in ${loc.replace(/-/g, ' ')}, Boisar.`
  };

  const title = `Top Businesses & Services in ${locationInfo.title}`;
  const description = locationInfo.desc;
  const canonicalUrl = `https://majhboisar.in/location/${locLower}`;

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
          alt: `Businesses in ${locationInfo.title}`,
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
      `businesses in ${locationInfo.title.toLowerCase()}`,
      `shops in ${locationInfo.title.toLowerCase()}`,
      `services in ${locationInfo.title.toLowerCase()}`,
      'boisar directory',
      'majh boisar',
    ],
  };
}

export default async function LocationPage({ params }: Props) {
  const { loc } = await params;
  const locLower = loc.toLowerCase().trim();
  const locationInfo = KNOWN_LOCATIONS[locLower] || {
    title: loc.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    areaKeywords: [loc.replace(/-/g, ' ')],
    desc: `Verified local businesses and services in ${loc.replace(/-/g, ' ')}, Boisar.`
  };

  // Find matching businesses from Supabase
  const orConditions = locationInfo.areaKeywords.map(k => ({
    OR: [
      { location: { contains: k, mode: 'insensitive' as const } },
      { address: { contains: k, mode: 'insensitive' as const } },
      { locality: { contains: k, mode: 'insensitive' as const } }
    ]
  }));

  const businesses = await prisma.business.findMany({
    where: {
      OR: orConditions.flatMap(c => c.OR),
      verified: true
    },
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
        'name': 'Locations',
        'item': 'https://majhboisar.in/location/boisar'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': locationInfo.title,
        'item': `https://majhboisar.in/location/${locLower}`
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Clean Compact Breadcrumb strip */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2 text-left">
        <div className="max-w-7xl mx-auto flex items-center text-xs text-slate-500 font-medium">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 flex-wrap">
            <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/location/boisar" className="hover:text-teal-700 transition-colors">Locations</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">{locationInfo.title}</span>
          </nav>
        </div>
      </div>

      {/* Compact & Clean Styled Header */}
      <header className="bg-white border-b border-slate-200/90 py-4 px-4 sm:px-6 text-left shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-2.5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
              <MapPin className="w-3 h-3 text-teal-700" />
              <span>Locality Directory · Boisar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Businesses & Services in {locationInfo.title}
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-2xl leading-relaxed">
              {locationInfo.desc} Direct phone numbers, addresses, and WhatsApp enquiry.
            </p>
          </div>

          {/* Compact Category Scroll Chips */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
              {POPULAR_CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 text-[11px] font-bold px-3 py-1 rounded-full transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main 12-Column Justdial Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 3-Image Business Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-teal-700" />
                <span>Verified Listings in {locationInfo.title} ({businesses.length})</span>
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Boisar, Palghar
              </span>
            </div>

            {businesses.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-2xs space-y-3">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No businesses listed in this locality yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Do you own a store, clinic or service in {locationInfo.title}?
                </p>
                <div className="pt-2">
                  <Link
                    href="/register-business"
                    className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    List Your Business Free
                  </Link>
                </div>
              </div>
            ) : (
              businesses.map((biz) => {
                const activeSlug = biz.slug || biz.id.toString();
                const bizHref = `/business/${activeSlug}`;
                const rawGallery = parseGalleryImages(biz.image);
                const coverImage = rawGallery[0] || '/majh-boisar-mb-logo.png';
                
                // Ensure all cards display 3 distinct showcase images
                const allPhotos = rawGallery.length >= 3 ? rawGallery : [
                  coverImage,
                  rawGallery[1] || FALLBACK_SHOWCASE_PHOTOS[0],
                  rawGallery[2] || FALLBACK_SHOWCASE_PHOTOS[1]
                ];

                const cleanPhone = (biz.phone || '').replace(/\D/g, '');
                const cleanWa = (biz.whatsapp || biz.phone || '').replace(/\D/g, '');
                const waLink = `https://wa.me/91${cleanWa}?text=${encodeURIComponent(`Hello ${biz.name}, I saw your listing on Majh Boisar directory.`)}`;
                const hasHomeDelivery = Boolean(biz.hasHomeDelivery);
                const displayAddress = biz.address || `${biz.location || 'Boisar'}, Palghar - 401501`;

                return (
                  <div
                    key={biz.id}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-teal-500/50"
                  >
                    <div>
                      {/* Top 3-Photo Grid */}
                      <div className="relative">
                        <div className="grid grid-cols-3 gap-1.5 w-full h-36 sm:h-44 p-1.5 bg-slate-50 border-b border-slate-100">
                          {allPhotos.slice(0, 3).map((imgUrl, pIdx) => (
                            <Link
                              key={pIdx}
                              href={bizHref}
                              className="w-full h-full rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs relative bg-slate-900 group/photo flex items-center justify-center block"
                            >
                              <img
                                src={imgUrl}
                                alt={`${biz.name} photo ${pIdx + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                              />
                              {/* Visits badge on 3rd photo */}
                              {pIdx === 2 && biz.views != null && biz.views > 0 && (
                                <div className="absolute bottom-1.5 right-1.5 bg-slate-950/85 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md border border-white/20 flex items-center gap-1 pointer-events-none backdrop-blur-xs">
                                  <span>👁️ {biz.views.toLocaleString()} visits</span>
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>

                        {/* Top Badges Overlay */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {hasHomeDelivery && (
                              <span className="bg-emerald-600 text-white text-[9.5px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1 backdrop-blur-xs">
                                <Truck className="w-3 h-3 text-white" />
                                <span>Home Delivery</span>
                              </span>
                            )}
                            {biz.verified && (
                              <span className="bg-teal-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Business Information Details */}
                      <div className="p-3.5 space-y-2">
                        <div>
                          <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug hover:text-teal-700 transition-colors line-clamp-2">
                            <Link href={bizHref}>
                              {biz.name}
                            </Link>
                          </h3>
                        </div>

                        {/* Category & Review Ratings Row */}
                        <div className="flex items-center gap-2 flex-wrap pt-0.5">
                          <span className="bg-teal-50 border border-teal-200/80 text-teal-800 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shrink-0">
                            {biz.category}
                          </span>
                          <span className="text-[10.5px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                            <span className="text-slate-800 font-black">{biz.rating ? Number(biz.rating).toFixed(1) : '5.0'}</span>
                            <span className="text-slate-400">({biz.reviewCount || 0} Ratings)</span>
                          </span>
                        </div>

                        {/* Location Address Block */}
                        <p className="text-[11px] sm:text-xs text-slate-600 font-medium flex items-start gap-1.5 line-clamp-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{displayAddress}</span>
                        </p>
                      </div>
                    </div>

                    {/* Justdial Action Buttons: Green Call, White/Green WhatsApp, Blue Enquiry */}
                    <div className="p-3 pt-2 border-t border-slate-100 grid grid-cols-3 gap-2">
                      {/* Call button */}
                      <a
                        href={cleanPhone ? `tel:${cleanPhone}` : '#'}
                        className="bg-[#09843c] hover:bg-[#076b30] text-white font-black text-[11px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white shrink-0" />
                        <span className="truncate">Call</span>
                      </a>

                      {/* WhatsApp button */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-[#09843c] text-[#09843c] font-black text-[11px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all hover:bg-emerald-50 cursor-pointer shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#09843c] shrink-0" />
                        <span className="truncate">WhatsApp</span>
                      </a>

                      {/* Order / Enquiry button */}
                      <Link
                        href={bizHref}
                        className={`${hasHomeDelivery ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0076db] hover:bg-[#0062b8]'} text-white font-black text-[11px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer`}
                      >
                        {hasHomeDelivery ? (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-white shrink-0" />
                            <span className="truncate">Order Online</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                            <span className="truncate">Enquiry</span>
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Local Ads & Nearby Locality Directory (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Ad Card 1 */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400/60 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="bg-indigo-50 text-indigo-700 text-[9px] font-black px-2 py-0.5 rounded uppercase border border-indigo-100">
                    Majh Boisar
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200 shrink-0">
                    AD
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  Get 5x More Local Customers in {locationInfo.title}!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Promote your shop, clinic, or service with top spotlight placement.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <Link
                  href="/advertise"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs py-2 rounded-xl shadow-2xs transition-all cursor-pointer text-center uppercase tracking-wider block"
                >
                  Advertise Now ➔
                </Link>
              </div>
            </div>

            {/* Other Boisar Localities Nav Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs text-left space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>Other Localities in Boisar</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                {Object.entries(KNOWN_LOCATIONS)
                  .filter(([key]) => key !== locLower)
                  .map(([key, info]) => (
                    <Link
                      key={key}
                      href={`/location/${key}`}
                      className="bg-slate-50 hover:bg-teal-50 border border-slate-200/80 hover:border-teal-200 p-2.5 rounded-xl text-slate-700 hover:text-teal-900 transition-colors flex items-center justify-between shadow-2xs block"
                    >
                      <span className="font-bold">{info.title}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
              </div>
            </div>

            {/* Ad Card 2 */}
            <div className="w-full bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400/60 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left group">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="bg-teal-50 text-teal-700 text-[9px] font-black px-2 py-0.5 rounded uppercase border border-teal-100">
                    Majh Boisar
                  </span>
                  <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-slate-200 shrink-0">
                    AD
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  Grow Your Business Locally
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Reach 10,000+ local citizens searching on Majh Boisar daily.
                </p>
              </div>
              <div className="mt-4 pt-2">
                <Link
                  href="/advertise"
                  className="w-full bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs py-2 rounded-xl shadow-2xs transition-all cursor-pointer text-center uppercase tracking-wider block"
                >
                  Get Featured ➔
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
