import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CATEGORY_CATALOG } from '@/lib/categoryMapping';
import CategoryClient, { SerializedBusiness } from './CategoryClient';

interface CategoryPageProps {
  params: Promise<{ cat: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Format Slug or Category String nicely (e.g. "top-gyms-in-boisar" -> "Gyms")
function normalizeCategoryName(raw: string): string {
  const decoded = decodeURIComponent(raw).trim();
  
  // Clean up prefix/suffix like "top-", "best-", "-in-boisar"
  let cleaned = decoded
    .replace(/^top[\s-_]+/i, '')
    .replace(/^best[\s-_]+/i, '')
    .replace(/[\s-_]+in[\s-_]+boisar$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  // Check against CATEGORY_CATALOG exact match (case insensitive)
  const catalogMatch = CATEGORY_CATALOG.find(
    c => c.category.toLowerCase() === cleaned.toLowerCase() || c.slug.toLowerCase() === cleaned.toLowerCase()
  );
  if (catalogMatch) return catalogMatch.category;

  // Title Case capitalisation fallback
  return cleaned
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Helper to generate dynamic FAQs for Google Rich Snippets
function generateCategoryFaqs(categoryName: string) {
  return [
    {
      question: `Which are the best ${categoryName} in Boisar?`,
      answer: `The top-rated ${categoryName} in Boisar are listed on Majh Boisar based on real customer ratings, verified addresses, and quick response times. You can filter by Boisar West, Ostwal Empire, Station Road, and Tarapur MIDC.`
    },
    {
      question: `How can I contact ${categoryName} in Boisar on WhatsApp?`,
      answer: `Majh Boisar provides direct 1-click WhatsApp buttons for all verified ${categoryName} in Boisar. Click the WhatsApp button on any listing to directly inquire about rates, services, and appointment bookings.`
    },
    {
      question: `Are there ${categoryName} near Boisar Railway Station and Tarapur MIDC?`,
      answer: `Yes, multiple verified ${categoryName} operate across Boisar West, near Boisar Station, Navapur Road, Ostwal Empire, and Tarapur MIDC. Use our area filter to see providers nearest to your location.`
    },
    {
      question: `How can I list my ${categoryName} business on Majh Boisar?`,
      answer: `Local business owners can list their ${categoryName} on Majh Boisar for free by clicking '+ List Business'. Verified listings receive customer leads directly from Google search.`
    }
  ];
}

// Dynamic SEO Metadata for Google Search
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = normalizeCategoryName(resolvedParams.cat);
  const canonicalUrl = `https://majhboisar.in/category/${encodeURIComponent(resolvedParams.cat)}`;

  const title = `Top 10 Best ${categoryName} in Boisar (2026) - Verified Listings | Majh Boisar`;
  const description = `Looking for the best ${categoryName} in Boisar, Palghar? Find top-rated verified providers with phone numbers, addresses, reviews, photos & instant WhatsApp enquiry on Majh Boisar.`;

  return {
    title,
    description,
    keywords: [
      `best ${categoryName} in boisar`,
      `top ${categoryName} boisar west`,
      `${categoryName} in palghar`,
      `${categoryName} near me boisar`,
      `${categoryName} near boisar station`,
      `list of ${categoryName} in tarapur midc`,
      `justdial boisar ${categoryName}`,
      `majh boisar ${categoryName}`
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Majh Boisar Local Directory',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://majhboisar.in/majh-boisar-mb-logo.png',
          width: 1200,
          height: 630,
          alt: `Best ${categoryName} in Boisar - Majh Boisar Directory`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://majhboisar.in/majh-boisar-mb-logo.png'],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const rawCat = resolvedParams.cat;
  if (!rawCat) notFound();

  const categoryName = normalizeCategoryName(rawCat);
  const categorySlug = rawCat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Fetch businesses from database matching category
  let businesses: SerializedBusiness[] = [];
  try {
    const dbBusinesses = await prisma.business.findMany({
      where: {
        OR: [
          { category: { equals: categoryName, mode: 'insensitive' } },
          { category: { contains: categoryName, mode: 'insensitive' } },
          { description: { contains: categoryName, mode: 'insensitive' } },
          { name: { contains: categoryName, mode: 'insensitive' } }
        ]
      },
      include: {
        products: {
          select: { id: true, name: true, price: true },
          take: 3
        }
      },
      orderBy: [
        { verified: 'desc' },
        { rating: 'desc' },
        { views: 'desc' }
      ],
      take: 50
    });

    businesses = dbBusinesses.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category,
      description: b.description,
      address: b.address,
      phone: b.phone,
      whatsapp: b.whatsapp || b.phone,
      image: b.image || 'https://images.unsplash.com/photo-1581093804475-577d72e38aa0?w=600',
      rating: b.rating || 4.5,
      reviewCount: b.reviewCount || 12,
      verified: b.verified,
      premium: b.premium,
      subscription: b.subscription,
      workingHours: b.workingHours,
      location: b.location,
      hasHomeDelivery: b.hasHomeDelivery,
      products: b.products
    }));
  } catch (err) {
    console.error('Error fetching businesses for category page:', err);
  }

  // Fallback Popular Related Categories for internal SEO interlinking
  const relatedCategories = [
    { name: 'Gyms & Fitness', slug: 'gyms', icon: '🏋️' },
    { name: 'Beauty Parlours & Salons', slug: 'salons', icon: '💇' },
    { name: 'Restaurants & Dining', slug: 'restaurants', icon: '🍽️' },
    { name: 'Hotels & Stays', slug: 'hotels', icon: '🏨' },
    { name: 'Doctors & Clinics', slug: 'doctors', icon: '🩺' },
    { name: 'Hospitals', slug: 'hospitals', icon: '🏥' },
    { name: 'Car & Bike Repair', slug: 'car-repair', icon: '🚗' },
    { name: 'Clothing & Boutiques', slug: 'clothing', icon: '👗' },
    { name: 'Home Electricians', slug: 'electricians', icon: '⚡' },
    { name: 'Plumbers', slug: 'plumbers', icon: '🔧' },
    { name: 'Real Estate Agents', slug: 'real-estate', icon: '🏢' },
    { name: 'Coaching & Classes', slug: 'coaching', icon: '📚' }
  ].filter(c => c.name.toLowerCase() !== categoryName.toLowerCase()).slice(0, 7);

  const faqs = generateCategoryFaqs(categoryName);

  // Google Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. BreadcrumbList Schema
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://majhboisar.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Boisar Directory',
            item: 'https://majhboisar.in/services',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${categoryName} in Boisar`,
            item: `https://majhboisar.in/category/${encodeURIComponent(rawCat)}`,
          },
        ],
      },
      // 2. ItemList Schema of Local Businesses
      {
        '@type': 'ItemList',
        name: `Top Best ${categoryName} in Boisar, Palghar`,
        description: `Verified list of ${categoryName} in Boisar, Palghar with contact numbers and addresses.`,
        numberOfItems: businesses.length,
        itemListElement: businesses.slice(0, 15).map((b, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'LocalBusiness',
            name: b.name,
            image: b.image,
            telephone: b.phone,
            address: {
              '@type': 'PostalAddress',
              streetAddress: b.address,
              addressLocality: b.location || 'Boisar',
              addressRegion: 'Maharashtra',
              postalCode: '401501',
              addressCountry: 'IN',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: b.rating > 0 ? b.rating : 4.5,
              reviewCount: b.reviewCount > 0 ? b.reviewCount : 8,
            },
            priceRange: '₹₹',
            url: `https://majhboisar.in/business/${b.id}`,
          },
        })),
      },
      // 3. FAQPage Schema for Google Snippets
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Inject Google Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CategoryClient
        categoryName={categoryName}
        categorySlug={categorySlug}
        initialBusinesses={businesses}
        relatedCategories={relatedCategories}
        faqs={faqs}
      />
    </>
  );
}
