import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top Content Creators & Influencers in Boisar (2026) — Hire Local Creators | Majh Boisar',
  description: 'Find and hire verified content creators, Instagram influencers, videographers, and reel makers in Boisar, Tarapur MIDC & Palghar. Check portfolio, rates, follower stats, and contact directly.',
  keywords: [
    'content creator boisar',
    'creators in boisar',
    'instagram influencers boisar',
    'reels creator boisar',
    'video creators boisar',
    'social media marketing boisar',
    'influencer marketing boisar',
    'food bloggers boisar',
    'fashion creators boisar',
    'event anchor boisar',
    'tarapur creators',
    'majh boisar creators',
  ],
  alternates: {
    canonical: 'https://www.majhboisar.in/creators',
  },
  openGraph: {
    title: 'Top Content Creators & Influencers in Boisar (2026) | Majh Boisar',
    description: 'Find and hire verified content creators, Instagram influencers, and reel makers in Boisar.',
    url: 'https://www.majhboisar.in/creators',
    siteName: 'Majh Boisar',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.majhboisar.in/majh-boisar-mb-logo.png',
        width: 800,
        height: 600,
        alt: 'Content Creators in Boisar',
      },
    ],
  },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
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
        name: 'Content Creators in Boisar',
        item: 'https://www.majhboisar.in/creators',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
