import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Clock, Calendar, Ticket, Compass, Navigation,
  CheckCircle, ArrowLeft, Share2, Sparkles, Phone, Hotel, ExternalLink
} from 'lucide-react';
import { BOISAR_ICONIC_PLACES, getIconicPlaceBySlug } from '@/lib/placesData';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BOISAR_ICONIC_PLACES.map((place) => ({
    slug: place.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = getIconicPlaceBySlug(slug);

  if (!place) {
    return {
      title: 'Place Not Found | Majh Boisar',
      description: 'The requested scenic spot or destination could not be found.',
    };
  }

  const canonicalUrl = `https://www.majhboisar.in/places/${place.slug}`;

  return {
    title: place.seoTitle,
    description: place.seoDescription,
    keywords: [
      place.name,
      place.shortName,
      `${place.shortName} Boisar`,
      `${place.name} timings`,
      `${place.name} photos`,
      'Places to visit in Boisar',
      'Boisar tourist spots',
      'Palghar tourism',
      'Majh Boisar travel guide'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: place.seoTitle,
      description: place.seoDescription,
      url: canonicalUrl,
      siteName: 'Majh Boisar',
      images: [
        {
          url: `https://www.majhboisar.in${place.image}`,
          width: 1200,
          height: 630,
          alt: place.name,
        },
      ],
      locale: 'en_IN',
      type: 'article',
    },
  };
}

export default async function PlaceDetailPage({ params }: Props) {
  const { slug } = await params;
  const place = getIconicPlaceBySlug(slug);

  if (!place) {
    notFound();
  }

  const otherPlaces = BOISAR_ICONIC_PLACES.filter((p) => p.slug !== place.slug).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.description,
    image: `https://www.majhboisar.in${place.image}`,
    url: `https://www.majhboisar.in/places/${place.slug}`,
    telephone: '+919307294733',
    isAccessibleForFree: place.entryFee.toLowerCase().includes('free'),
    publicAccess: true,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.location,
      addressLocality: 'Boisar',
      addressRegion: 'Maharashtra',
      postalCode: '401501',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.8000',
      longitude: '72.7500',
    },
    openingHours: place.timings,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '128',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
        {/* Top Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Link href="/" className="hover:text-teal-700">Home</Link>
              <span>/</span>
              <Link href="/places" className="hover:text-teal-700 truncate">Places</Link>
              <span>/</span>
              <span className="text-slate-900 font-bold truncate">{place.shortName}</span>
            </div>
            <Link
              href="/places"
              className="text-teal-700 hover:underline shrink-0 flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Spots</span>
            </Link>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] shadow-lg border border-slate-200 bg-slate-900">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-white/95 backdrop-blur-xs text-teal-900 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                {place.category}
              </span>
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {place.tag}
              </span>
            </div>

            {/* Title & Location in Hero */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white text-left">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{place.distance} • {place.travelTime}</span>
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-md">
                {place.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{place.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>About this Destination</span>
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line space-y-3">
                {place.longDescription}
              </div>
            </div>

            {/* Key Highlights */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900">Key Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Reach Guide */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-600" />
                <span>How to Reach from Boisar Railway Station</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {place.howToReach}
              </p>
            </div>
          </div>

          {/* Sidebar / Quick Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
                Visitor Quick Guide
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-400 text-[10px] uppercase">Visiting Hours</span>
                    <span className="font-bold text-slate-800">{place.timings}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-400 text-[10px] uppercase">Entry Fee</span>
                    <span className="font-bold text-slate-800">{place.entryFee}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-400 text-[10px] uppercase">Best Time to Visit</span>
                    <span className="font-bold text-slate-800">{place.bestTimeToVisit}</span>
                  </div>
                </div>
              </div>

              {/* Google Maps Direction Button */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#064e3b] hover:bg-[#043d2e] text-white text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer text-center"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
              </a>

              {/* Nearby Services Link */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Explore Nearby</p>
                <div className="flex flex-col gap-1.5 text-xs font-bold text-teal-700">
                  <Link href="/hotels" className="hover:underline flex items-center justify-between">
                    <span>🏨 Nearby Hotels in Boisar</span>
                    <span>→</span>
                  </Link>
                  <Link href="/food" className="hover:underline flex items-center justify-between">
                    <span>🍽️ Popular Restaurants &amp; Cafes</span>
                    <span>→</span>
                  </Link>
                  <Link href="/hire-vehicle" className="hover:underline flex items-center justify-between">
                    <span>🚗 Hire Car / Taxi from Boisar</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Spots to Visit */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">More Places to Visit in Boisar</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Explore other scenic weekend spots nearby</p>
            </div>
            <Link href="/places" className="text-xs font-black text-teal-700 hover:underline">
              View All ({BOISAR_ICONIC_PLACES.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherPlaces.map((op) => (
              <Link
                key={op.id}
                href={`/places/${op.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={op.image}
                    alt={op.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <span className="text-[9.5px] font-bold text-teal-700 block">{op.category}</span>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mt-0.5">
                    {op.shortName}
                  </h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{op.distance}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
