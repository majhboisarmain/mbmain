import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { specialProfiles } from '@/lib/mockProfiles';
import BusinessDetailClient from './BusinessDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getBusinessData(idStr: string) {
  const businessId = parseInt(idStr);
  if (isNaN(businessId)) return null;

  try {
    const biz = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        reviews: { orderBy: { createdAt: 'desc' } },
        products: true,
        services: true,
        faqs: true,
      }
    });

    if (biz) return biz;
  } catch (e) {
    console.error('Error fetching business for SEO SSR:', e);
  }

  // Fallback to specialProfiles
  try {
    for (const cat in specialProfiles) {
      const match = (specialProfiles[cat] || []).find((p: any) => p.id === businessId);
      if (match) {
        return {
          id: match.id,
          name: match.name,
          category: match.category,
          description: match.bio || match.description || `Verified ${match.category} in Boisar, Palghar.`,
          address: match.address || 'Boisar, Maharashtra',
          phone: match.phone || '9820098200',
          whatsapp: match.phone || '9820098200',
          verified: match.verified ?? true,
          premium: true,
          subscription: match.subscription || 'Premium',
          rating: match.rating || 4.8,
          reviewCount: match.reviewsCount || 12,
          image: match.avatar || match.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
          gallery: match.gallery || [],
          location: match.location || 'Boisar West',
          workingHours: '9:00 AM - 8:00 PM',
          views: match.views || 140,
          phoneClicks: 0,
          whatsappClicks: 0,
          directionClicks: 0,
          websiteClicks: 0,
          website: null,
          email: null,
          instagram: null,
          facebook: null,
          youtube: null,
          googleMaps: null,
          services: (match.services || []).map((s: any, idx: number) => typeof s === 'string' ? { id: idx, name: s, price: null, duration: null, description: null } : s),
          products: [],
          faqs: [],
          reviews: (match.reviews || []).map((r: any, idx: number) => ({
            id: idx,
            userName: r.user || r.userName || 'Customer',
            rating: r.rating || 5,
            comment: r.comment || 'Good service in Boisar',
            helpfulCount: 0,
            createdAt: new Date().toISOString()
          }))
        };
      }
    }
  } catch (err) {}

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusinessData(id);

  if (!business) {
    return {
      title: 'Business Profile Not Found | Majh Boisar',
      description: 'The requested business listing was not found on Majh Boisar city directory.',
      robots: { index: false, follow: false }
    };
  }

  const cleanDescription = (business.description || '')
    .replace(/\[Created by Admin\]\s*/gi, '')
    .trim()
    .slice(0, 160) || `Contact ${business.name} in ${business.location || 'Boisar'}, Palghar for ${business.category} services, prices & address.`;

  const pageTitle = `${business.name} Boisar - Phone Number, Address & Reviews | Majh Boisar`;
  const pageUrl = `https://majhboisar.in/business/${business.id}`;
  let imageUrl = business.image || 'https://majhboisar.in/majh-boisar-mb-logo.png';
  if (imageUrl.startsWith('/')) {
    imageUrl = `https://majhboisar.in${imageUrl}`;
  }

  return {
    title: pageTitle,
    description: `Phone: ${business.phone} · ${business.name} located at ${business.address}, ${business.location || 'Boisar'}. ⭐ ${business.rating || 4.5} Star (${business.reviewCount || 5}+ reviews). ${cleanDescription}`,
    keywords: [
      `${business.name}`,
      `${business.name} boisar`,
      `${business.name} phone number`,
      `${business.name} contact`,
      `${business.name} address`,
      `${business.name} reviews`,
      `${business.category} in boisar`,
      `best ${business.category} in boisar`,
      `${business.location} boisar`
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: cleanDescription,
      url: pageUrl,
      siteName: 'Majh Boisar (माझं बोईसर)',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${business.name} - Verified on Majh Boisar`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: cleanDescription,
      images: [imageUrl],
    }
  };
}

export default async function BusinessPage({ params }: Props) {
  const { id } = await params;
  const business = await getBusinessData(id);

  // Schema.org JSON-LD
  let localBusinessSchema: any = null;
  let breadcrumbSchema: any = null;

  if (business) {
    const pageUrl = `https://majhboisar.in/business/${business.id}`;
    const imageUrl = business.image || 'https://majhboisar.in/majh-boisar-mb-logo.png';

    localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': pageUrl,
      'name': business.name,
      'image': imageUrl,
      'telephone': business.phone,
      'priceRange': '₹₹',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': business.address,
        'addressLocality': 'Boisar',
        'addressRegion': 'Maharashtra',
        'postalCode': '401501',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 19.8037,
        'longitude': 72.7554
      },
      'url': pageUrl,
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': String(business.rating || 4.8),
        'bestRating': '5',
        'worstRating': '1',
        'reviewCount': String(Math.max(1, business.reviewCount || (business.reviews ? business.reviews.length : 5)))
      }
    };

    breadcrumbSchema = {
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
          'name': business.category || 'Services',
          'item': `https://majhboisar.in/category/${encodeURIComponent((business.category || '').toLowerCase().replace(/\s+/g, '-'))}`
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': business.name,
          'item': pageUrl
        }
      ]
    };
  }

  return (
    <>
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <BusinessDetailClient initialBusiness={business ? JSON.parse(JSON.stringify(business)) : null} />
    </>
  );
}
