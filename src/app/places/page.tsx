import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Navigation, Compass, Clock, Sparkles, ChevronRight, ArrowLeft, Eye } from 'lucide-react';
import { BOISAR_ICONIC_PLACES } from '@/lib/placesData';

export const metadata: Metadata = {
  title: 'Top Places to Visit in Boisar & Around — Beaches, Forts, Lakes & Temples | Majh Boisar',
  description: 'Explore the best tourist spots, beaches, historic sea forts, lakes, waterfalls, and scenic places in and around Boisar, Palghar. Complete local travel guide with timings, photos & directions.',
  keywords: [
    'Places to visit in Boisar',
    'Boisar tourist spots',
    'Best spots in Boisar',
    'Chinchani Beach Boisar',
    'Shirgaon Fort Boisar',
    'Tarapur Fort Boisar',
    'Boisar picnic spots',
    'Kambalgaon Lake Boisar',
    'BAPS Mandir Boisar Garden',
    'Kaldurg Fort Trek',
    'Devkhop Lake Boisar',
    'Palghar Boisar tourism',
    'Majh Boisar places'
  ],
  alternates: {
    canonical: 'https://www.majhboisar.in/places',
  },
  openGraph: {
    title: 'Top Places to Visit in Boisar & Around — Beaches, Forts, Lakes & Temples',
    description: 'Explore the best tourist spots, beaches, historic sea forts, lakes, waterfalls, and scenic places in and around Boisar, Palghar.',
    url: 'https://www.majhboisar.in/places',
    siteName: 'Majh Boisar',
    images: [
      {
        url: 'https://www.majhboisar.in/places/chinchani-beach.jpg',
        width: 1200,
        height: 630,
        alt: 'Iconic Places in Boisar',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function PlacesIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Places to Visit in Boisar & Around',
    description: 'A curated travel guide of scenic beaches, historic sea forts, waterfalls, lakes, and temples in and around Boisar, Palghar.',
    itemListElement: BOISAR_ICONIC_PLACES.map((place, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'TouristAttraction',
        name: place.name,
        description: place.description,
        image: `https://www.majhboisar.in${place.image}`,
        url: `https://www.majhboisar.in/places/${place.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Boisar',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
        {/* Breadcrumb & Navigation */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-teal-700 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-bold">Places to Visit in Boisar</span>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {BOISAR_ICONIC_PLACES.length} Local Destinations
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="bg-gradient-to-b from-white via-teal-50/20 to-slate-50 border-b border-slate-200/80 py-10 sm:py-14 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 text-xs font-black tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Boisar &amp; Palghar Tourism Guide</span>
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Iconic Places You Need to See in &amp; Around <span className="text-teal-700">Boisar</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              Discover serene Arabian Sea beaches, centuries-old Maratha forts, scenic freshwater lakes, peaceful temples, and Sahyadri trekking summits.
            </p>
          </div>
        </section>

        {/* Places Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOISAR_ICONIC_PLACES.map((place) => (
              <article
                key={place.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                  {/* Category & Tag badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white/95 backdrop-blur-xs text-teal-900 text-[10.5px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      {place.category}
                    </span>
                    <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {place.tag}
                    </span>
                  </div>

                  {/* Distance Indicator */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white drop-shadow-md">
                    <span className="text-xs font-black flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{place.distance}</span>
                    </span>
                    <span className="text-[11px] font-medium text-white/90">
                      {place.travelTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                      {place.name}
                    </h2>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                      {place.description}
                    </p>
                  </div>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {place.highlights.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href={`/places/${place.slug}`}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 text-center cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Travel Guide</span>
                    </Link>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 p-2.5 rounded-xl transition-colors cursor-pointer"
                      title="Open in Google Maps"
                    >
                      <Navigation className="w-4 h-4 text-teal-700" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SEO Information & Google Search Context Block */}
        <section className="max-w-5xl mx-auto px-4 mt-16">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Why Boisar is a Top Weekend Getaway in North Konkan
            </h2>
            <p>
              Located just 100 km from Mumbai and well connected by Western Railway local and express trains, <strong>Boisar</strong> and its surrounding taluka offer a rich blend of coastal beauty, historical heritage, and lush green Sahyadri nature.
            </p>
            <p>
              From the black sands and vibrant evening snacks of <strong>Chinchani Beach</strong> and the ancient maritime ramparts of <strong>Shirgaon and Tarapur Forts</strong>, to refreshing freshwater retreats like <strong>Kambalgaon Lake</strong> and monsoon trekking peaks like <strong>Kaldurg and Asava Fort</strong>, Boisar is a prime destination for day trips, family picnics, and weekend camping.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
