import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import BusinessDetailsClient from './BusinessDetailsClient';
import { ChevronRight, MapPin, Phone, MessageSquare, Clock, ShieldCheck, Tag, CheckCircle } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

const SCHEMA_TYPE_MAP: Record<string, string> = {
  'Gyms & Fitness Centers': 'ExerciseGym',
  'Gyms': 'ExerciseGym',
  'Fitness': 'ExerciseGym',
  'Restaurants & Dining': 'Restaurant',
  'Restaurants': 'Restaurant',
  'Food': 'Restaurant',
  'Cafes': 'CafeOrCoffeeShop',
  'Doctors & Specialists': 'Physician',
  'Doctors': 'Physician',
  'Hospitals': 'Hospital',
  'Hospital': 'Hospital',
  'Eye Opticians': 'Optician',
  'Dentist': 'Dentist',
  'Salon & Beauty Parlour': 'HairSalon',
  'Salons': 'HairSalon',
  'Beauty': 'BeautySalon',
  'Medical Stores & Pharmacy': 'Pharmacy',
  'Real Estate & Properties': 'RealEstateAgent',
  'Mobile Shops & Repair': 'ElectronicsStore',
  'Electronics': 'ElectronicsStore',
  'Digital Printing': 'LocalBusiness',
  'Water Purifier': 'HomeAndConstructionBusiness',
  'Electricians & Wiring': 'Electrician',
  'Plumbers & Sanitation': 'Plumber',
  'Automobile Garages & Repair': 'AutoRepair',
  'Jewellery & Ornaments': 'JewelryStore',
  'Clothing & Fashion': 'ClothingStore',
  'Schools': 'EducationalOrganization',
  'Loan Consultants': 'FinancialService',
  'Loans': 'FinancialService',
  'Hotels': 'Hotel',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const numId = parseInt(slug);

  const business = await prisma.business.findFirst({
    where: !isNaN(numId) ? { id: numId } : { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      description: true,
      location: true,
      locality: true,
      address: true,
      image: true,
      phone: true,
      isIndexable: true,
      seoTitle: true,
      seoDescription: true,
    }
  });

  if (!business) {
    return {
      title: 'Business Not Found | Majh Boisar',
      description: 'The requested business listing could not be found on Majh Boisar directory.',
      robots: { index: false, follow: false },
    };
  }

  const activeSlug = business.slug || business.id.toString();
  const locationLabel = business.locality || business.location || 'Boisar';
  
  // SEO Title Template: {Business Name} in {Location}, Boisar — Phone, Address & Reviews
  const pageTitle = business.seoTitle || `${business.name} in ${locationLabel}, Boisar — Phone, Address & Reviews`;
  
  // SEO Meta Description Template
  const pageDesc = business.seoDescription || 
    `Find ${business.name} in ${locationLabel}, Boisar (${business.category}). Contact phone: ${business.phone || 'Available'}, address, verified opening hours, services and authentic customer details on Majh Boisar directory.`;

  const coverImage = business.image?.split('||gallery_sep||')[0];
  const imageUrl = coverImage?.startsWith('http')
    ? coverImage
    : 'https://majhboisar.in/majh-boisar-mb-logo.png';

  const canonicalUrl = `https://majhboisar.in/business/${activeSlug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: business.isIndexable !== false,
      follow: true,
      googleBot: {
        index: business.isIndexable !== false,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Majh Boisar Local Directory',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${business.name} in Boisar`,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [imageUrl],
    },
    keywords: [
      business.name,
      `${business.name} Boisar`,
      `${business.name} contact number`,
      `${business.name} phone number`,
      `${business.name} address`,
      `${business.category} in Boisar`,
      `${business.category} near Boisar`,
      `${business.category} in ${locationLabel}`,
      'Boisar local business directory',
      'Majh Boisar',
    ],
  };
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params;
  const numId = parseInt(slug);

  // 1. Backward-Compatibility 301 Permanent Redirect for legacy numeric IDs
  if (!isNaN(numId)) {
    const legacyBiz = await prisma.business.findUnique({
      where: { id: numId },
      select: { slug: true }
    });
    if (legacyBiz?.slug) {
      permanentRedirect(`/business/${legacyBiz.slug}`);
    }
  }

  // 2. Fetch full business record with relations
  const business = await prisma.business.findFirst({
    where: { slug },
    include: {
      reviews: { orderBy: { createdAt: 'desc' } },
      services: true,
      products: true,
      faqs: true,
      leads: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!business) {
    notFound();
  }

  // Related businesses in the same category
  const relatedBusinesses = await prisma.business.findMany({
    where: {
      category: business.category,
      id: { not: business.id },
      verified: true,
    },
    take: 4,
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      location: true,
      address: true,
      phone: true,
      rating: true,
      image: true
    }
  });

  // Prepare images
  const rawParts = (business.image || '').split('||gallery_sep||').filter(Boolean);
  const coverImage = rawParts[0] || '/majh-boisar-mb-logo.png';
  const fullCoverUrl = coverImage.startsWith('http') ? coverImage : `https://majhboisar.in${coverImage}`;

  // Structured Data (JSON-LD)
  const schemaType = SCHEMA_TYPE_MAP[business.category] || 'LocalBusiness';
  const hasGeo = business.latitude != null && business.longitude != null;
  const genuineReviews = business.reviews || [];
  const hasReviews = genuineReviews.length > 0;
  const avgRating = hasReviews
    ? Math.round((genuineReviews.reduce((acc, r) => acc + r.rating, 0) / genuineReviews.length) * 10) / 10
    : 0;

  const localBusinessSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `https://majhboisar.in/business/${business.slug}`,
    'name': business.name,
    'url': `https://majhboisar.in/business/${business.slug}`,
    'telephone': business.phone || undefined,
    'description': business.description || `${business.name} — verified ${business.category} in Boisar, Maharashtra.`,
    'image': fullCoverUrl,
    'priceRange': '₹₹',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': business.address || 'Boisar',
      'addressLocality': business.locality || business.location || 'Boisar',
      'addressRegion': business.state || 'Maharashtra',
      'postalCode': business.pincode || '401501',
      'addressCountry': 'IN'
    }
  };

  if (hasGeo) {
    localBusinessSchema.geo = {
      '@type': 'GeoCoordinates',
      'latitude': business.latitude,
      'longitude': business.longitude
    };
  }

  // Google Compliance: aggregateRating only if genuine customer reviews exist
  if (hasReviews && avgRating > 0) {
    localBusinessSchema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': avgRating.toString(),
      'reviewCount': genuineReviews.length.toString(),
      'bestRating': '5',
      'worstRating': '1'
    };
  }

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
        'name': business.category,
        'item': `https://majhboisar.in/category/${encodeURIComponent(business.category.toLowerCase())}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': business.name,
        'item': `https://majhboisar.in/business/${business.slug}`
      }
    ]
  };

  // Prepare Client Props
  const clientBusiness: any = {
    ...business,
    image: coverImage,
    gallery: rawParts.slice(1),
    rating: hasReviews ? avgRating : business.rating,
    reviewCount: genuineReviews.length > 0 ? genuineReviews.length : business.reviewCount,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. Structured Data for Google Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 2. SSR Semantic Clean Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 flex-wrap">
            <Link href="/" className="hover:text-teal-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/location/boisar" className="hover:text-teal-700 transition-colors">Boisar</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link 
              href={`/category/${encodeURIComponent(business.category.toLowerCase())}`} 
              className="hover:text-teal-700 transition-colors"
            >
              {business.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px]">{business.name}</span>
          </nav>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-teal-700" />
            Verified Listing
          </span>
        </div>
      </div>

      {/* 3. SSR Crawlable Business Summary (Search Engines) */}
      <section className="sr-only" aria-label="Business Crawlable Information">
        <h1>{business.name} — {business.category} in Boisar</h1>
        <p>{business.description}</p>
        <div>
          <span>Category: {business.category}</span>
          <span>Address: {business.address}, {business.locality || business.location || 'Boisar'}, Palghar, Maharashtra {business.pincode || '401501'}</span>
          <span>Phone: {business.phone}</span>
          <span>WhatsApp: {business.whatsapp}</span>
          <span>Working Hours: {business.workingHours}</span>
        </div>
        {business.services && business.services.length > 0 && (
          <div>
            <h2>Services offered by {business.name} in Boisar:</h2>
            <ul>
              {business.services.map((s, idx) => (
                <li key={idx}>{s.name} {s.price ? `- ₹${s.price}` : ''}</li>
              ))}
            </ul>
          </div>
        )}
        {business.products && business.products.length > 0 && (
          <div>
            <h2>Products available at {business.name}:</h2>
            <ul>
              {business.products.map((p, idx) => (
                <li key={idx}>{p.name} - ₹{p.price}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 4. Full Rich Interactive Client Application */}
      <BusinessDetailsClient initialBusiness={clientBusiness} businessSlug={business.slug || slug} />

      {/* Trust & Verification Action Strip */}
      <section className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Are you the owner or manager of <strong>{business.name}</strong>?</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={`/claim-business?id=${business.id}&name=${encodeURIComponent(business.name)}`}
              className="flex-1 sm:flex-none bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold px-3 py-1.5 rounded-xl transition-all text-center"
            >
              Claim this Business
            </Link>
            <Link
              href="/contact"
              className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-xl transition-all text-center"
            >
              Report Incorrect Info
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Crawlable Related Businesses Section in Boisar */}
      {relatedBusinesses.length > 0 && (
        <aside className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-200 my-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Similar {business.category} in Boisar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified local shops & services in Boisar, Maharashtra
              </p>
            </div>
            <Link
              href={`/category/${encodeURIComponent(business.category.toLowerCase())}`}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedBusinesses.map((item) => {
              const relSlug = item.slug || item.id.toString();
              const relCover = (item.image || '').split('||gallery_sep||')[0] || '/majh-boisar-mb-logo.png';
              return (
                <Link
                  key={item.id}
                  href={`/business/${relSlug}`}
                  className="group bg-white hover:border-teal-500/50 border border-slate-200 rounded-2xl p-3.5 transition-all duration-200 block shadow-2xs hover:shadow-sm"
                >
                  <div className="w-full h-32 rounded-xl bg-slate-100 overflow-hidden relative mb-3">
                    <img
                      src={relCover}
                      alt={`${item.name} in Boisar`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {item.location || 'Boisar'}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-teal-700 font-bold text-[11px]">{item.category}</span>
                    <span className="text-slate-600 text-[11px] font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                      View
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      )}
    </div>
  );
}
