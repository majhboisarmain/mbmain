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
    where: { id }
  });

  if (!business) {
    return { title: 'Business Not Found | Majh Boisar' };
  }

  const title = `${business.name} - ${business.category} in ${business.location || 'Boisar'} | Majh Boisar`;
  const description = business.description 
    ? `${business.description.substring(0, 150)}... Contact ${business.name} today!`
    : `Find trusted ${business.category} services in ${business.location || 'Boisar'}. Visit ${business.name} on Majh Boisar.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://majhboisar.in/business/${id}`,
      siteName: 'Majh Boisar',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
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
    schemaData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": business.name,
      "image": "https://majhboisar.in/majh-boisar-mb-logo.png", // Default fallback if no custom image
      "@id": `https://majhboisar.in/business/${id}`,
      "url": `https://majhboisar.in/business/${id}`,
      "telephone": business.phone || "",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": business.address || "",
        "addressLocality": business.location || "Boisar",
        "addressRegion": "Maharashtra",
        "postalCode": "401501",
        "addressCountry": "IN"
      },
      "aggregateRating": business.rating && business.rating > 0 ? {
        "@type": "AggregateRating",
        "ratingValue": business.rating.toString(),
        "reviewCount": "10" // Default/placeholder review count for SEO
      } : undefined,
      "priceRange": "₹₹"
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
