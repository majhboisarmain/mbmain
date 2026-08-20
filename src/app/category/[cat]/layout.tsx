import { Metadata } from 'next';

interface Props {
  params: Promise<{ cat: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat: rawCat } = await params;
  const category = decodeURIComponent(rawCat || '');

  if (!category) {
    return {
      title: 'Categories & Services in Boisar | Majh Boisar',
      description: 'Explore 800+ business categories in Boisar, Tarapur MIDC and surrounding local areas.',
    };
  }

  const title = `Top 10 Best ${category} in Boisar & Tarapur MIDC | Verified Listings - Majh Boisar`;
  const description = `Looking for ${category} in Boisar? Find verified contact numbers, office addresses, user ratings, services offered & direct WhatsApp connect for top ${category} in Boisar & Tarapur MIDC.`;
  const canonicalUrl = `https://majhboisar.in/category/${encodeURIComponent(category)}`;

  return {
    title,
    description,
    keywords: [
      `${category.toLowerCase()} in boisar`,
      `best ${category.toLowerCase()} in boisar`,
      `top ${category.toLowerCase()} near me`,
      `${category.toLowerCase()} contact number boisar`,
      `${category.toLowerCase()} tarapur midc`,
      `boisar ${category.toLowerCase()} list`,
      'majh boisar directory',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Majh Boisar',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: '/hero-bg.png',
          width: 1200,
          height: 630,
          alt: `Best ${category} in Boisar - Majh Boisar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/hero-bg.png'],
    },
  };
}

export default async function CategoryLayout({ children, params }: Props) {
  const { cat: rawCat } = await params;
  const category = decodeURIComponent(rawCat || '');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
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
        name: 'Categories',
        item: 'https://majhboisar.in/search',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category || 'Category',
        item: `https://majhboisar.in/category/${encodeURIComponent(category)}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${category} in Boisar`,
    description: `Find top verified ${category} in Boisar, Tarapur MIDC, and Palghar area with phone numbers and addresses.`,
    url: `https://majhboisar.in/category/${encodeURIComponent(category)}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Majh Boisar',
      url: 'https://majhboisar.in',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
