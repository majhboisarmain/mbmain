import { formatCategoryTitle, getCategorySlug } from '@/lib/categories';

interface Props {
  params: Promise<{ cat: string }>;
  children: React.ReactNode;
}

export default async function CategoryLayout({ children, params }: Props) {
  const { cat: rawCat } = await params;
  const category = formatCategoryTitle(rawCat || '');
  const slug = getCategorySlug(rawCat || '') || (rawCat || '').toLowerCase();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.majhboisar.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://www.majhboisar.in/search',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category || 'Category',
        item: `https://www.majhboisar.in/category/${slug}`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Best ${category} in Boisar`,
    description: `Find top verified ${category} in Boisar, Tarapur MIDC, and Palghar area with phone numbers and addresses.`,
    url: `https://www.majhboisar.in/category/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Majh Boisar',
      url: 'https://www.majhboisar.in',
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
