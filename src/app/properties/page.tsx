import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeClient from '../HomeClient';

export const metadata: Metadata = {
  title: 'Flats & Properties for Sale & Rent in Boisar | Majh Boisar Real Estate',
  description: 'Find 1 BHK, 2 BHK, 3 BHK flats for sale & rent, independent houses, commercial shops, plots and builder projects in Boisar, Tarapur MIDC, and Palghar. Direct owner & broker contacts.',
  keywords: [
    'properties in boisar',
    'flats in boisar',
    'flats for rent in boisar',
    'flats for sale in boisar',
    '1 bhk in boisar',
    '1 bhk flat in boisar',
    '2 bhk in boisar',
    '2 bhk flat in boisar',
    'ostwal empire flats',
    'boisar real estate',
    'shops for rent in boisar',
    'plot in boisar',
    'builders in boisar',
    'real estate agent in boisar'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/properties'
  },
  openGraph: {
    title: 'Flats & Properties for Sale & Rent in Boisar | Majh Boisar Real Estate',
    description: 'Find 1 BHK, 2 BHK, 3 BHK flats for sale & rent, independent houses, and commercial properties in Boisar.',
    url: 'https://majhboisar.in/properties',
    siteName: 'Majh Boisar',
    locale: 'en_IN',
    type: 'website'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Properties in Boisar - Majh Boisar',
  url: 'https://majhboisar.in/properties',
  description: 'Verified residential flats, apartments, and commercial properties for sale and rent in Boisar and Tarapur MIDC.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Boisar',
    addressRegion: 'Maharashtra',
    postalCode: '401501',
    addressCountry: 'IN'
  }
};

export default function PropertiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading Boisar Real Estate...</div>}>
        <HomeClient initialSpecialCategory="properties" />
      </Suspense>
    </>
  );
}
