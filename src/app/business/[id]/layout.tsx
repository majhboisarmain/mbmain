import { Metadata } from 'next';
import { prisma } from '@/lib/db';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  
  if (isNaN(id)) {
    return { title: 'Business Not Found | Majh Boisar' };
  }

  const business = await prisma.business.findUnique({
    where: { id },
    select: { id: true, name: true, category: true, description: true, location: true, address: true, image: true, rating: true, phone: true }
  });

  if (!business) {
    return { title: 'Business Not Found | Majh Boisar' };
  }

  const locationLabel = business.location || business.address?.split(',').slice(-2).join(',').trim() || 'Boisar';
  const title = `${business.name} — ${business.category} in ${locationLabel} | Majh Boisar`;
  const description = business.description
    ? `${business.description.substring(0, 155)}. Call or WhatsApp ${business.name} on Majh Boisar.`
    : `Top ${business.category} in Boisar — ${business.name}. Verified phone number, address, reviews & WhatsApp on Majh Boisar.`;

  const imageUrl = business.image?.startsWith('http')
    ? business.image
    : business.image
      ? `https://majhboisar.in${business.image}`
      : 'https://majhboisar.in/majh-boisar-mb-logo.png';

  return {
    title,
    description,
    alternates: {
      canonical: `https://majhboisar.in/business/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://majhboisar.in/business/${id}`,
      siteName: 'Majh Boisar',
      images: [{ url: imageUrl, width: 800, height: 600, alt: business.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    keywords: [
      business.name,
      business.category,
      `${business.category} in Boisar`,
      `${business.name} Boisar`,
      locationLabel,
      'Boisar local directory',
      'Majh Boisar',
    ],
  };
}

export default async function BusinessLayout({ children, params }: Props) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  let business = null;

  if (!isNaN(id)) {
    business = await prisma.business.findUnique({
      where: { id }
    });
  }

  // Generate Structured Data (JSON-LD) for LocalBusiness SEO
  let schemaData = null;
  if (business) {
    const imageUrl = business.image?.startsWith('http')
      ? business.image
      : business.image
        ? `https://majhboisar.in${business.image}`
        : 'https://majhboisar.in/majh-boisar-mb-logo.png';

    // Map category to schema.org @type
    const categoryTypeMap: Record<string, string> = {
      'Gyms & Fitness Centers': 'ExerciseGym',
      'Restaurants & Dining': 'Restaurant',
      'Doctors & Specialists': 'Physician',
      'Salon & Beauty Parlour': 'HairSalon',
      'Medical Stores & Pharmacy': 'Pharmacy',
      'Real Estate & Properties': 'RealEstateAgent',
      'Mobile Shops & Repair': 'ElectronicsStore',
      'Electricians & Wiring': 'Electrician',
      'Plumbers & Sanitation': 'Plumber',
      'Automobile Garages & Repair': 'AutoRepair',
      'Jewellery & Ornaments': 'JewelryStore',
      'Clothing & Fashion': 'ClothingStore',
    };
    const schemaType = categoryTypeMap[business.category] || 'LocalBusiness';

    schemaData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "name": business.name,
      "image": imageUrl,
      "@id": `https://majhboisar.in/business/${id}`,
      "url": `https://majhboisar.in/business/${id}`,
      "telephone": business.phone || "",
      "description": business.description || `${business.name} — ${business.category} in Boisar, Maharashtra`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address || "",
        "addressLocality": "Boisar",
        "addressRegion": "Maharashtra",
        "postalCode": "401501",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.8066",
        "longitude": "72.7466"
      },
      "aggregateRating": business.rating && business.rating > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": business.rating.toString(),
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": (business.reviewCount || 10).toString()
      } : undefined,
      "priceRange": "₹₹",
      "servesCuisine": business.category === 'Restaurants & Dining' ? 'Indian' : undefined,
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, UPI, Card",
      "areaServed": {
        "@type": "City",
        "name": "Boisar"
      }
    };
  }

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {children}
    </>
  );
}
