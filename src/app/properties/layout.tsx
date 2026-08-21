import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Properties in Boisar — Flats, 1/2/3 BHK Apartments, Plots & Shops For Sale & Rent | Majh Boisar',
  description: 'Find 100+ verified properties for sale and rent in Boisar, Palghar. 1 BHK, 2 BHK, 3 BHK flats, row houses, commercial shops & industrial/residential plots in Boisar West, Tarapur MIDC, Ostwal Empire & Navapur Road.',
  keywords: [
    'properties in boisar',
    'property in boisar',
    'boisar real estate',
    'flats in boisar',
    'flats for sale in boisar',
    'flat for rent in boisar',
    '1 bhk in boisar',
    '1 bhk flat in boisar',
    '2 bhk in boisar',
    '2 bhk flat in boisar',
    '3 bhk flat in boisar',
    'house for sale in boisar',
    'row house in boisar',
    'plots in boisar',
    'land for sale in boisar',
    'shops for rent in boisar',
    'commercial shop in boisar',
    'real estate agent in boisar',
    'property broker in boisar',
    'ostwal empire boisar flats',
    'tata housing boisar',
    'sai villa boisar',
    'navapur road flats boisar',
    'tarapur midc industrial plots'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/properties',
  },
  openGraph: {
    title: 'Properties in Boisar — Flats, Apartments & Plots For Sale / Rent',
    description: 'Explore verified flats, row houses, plots, and commercial spaces in Boisar. Contact genuine owners and trusted brokers directly.',
    url: 'https://majhboisar.in/properties',
    siteName: 'Majh Boisar Real Estate',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Properties in Boisar - Majh Boisar Real Estate Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties in Boisar — Flats & Plots For Sale/Rent',
    description: 'Find 1/2/3 BHK flats & commercial plots in Boisar directly from owners and verified agents.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'],
  },
};

const propertiesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  'name': 'Majh Boisar Real Estate Portal',
  'description': 'Direct owner & broker real estate portal for Boisar, Palghar. Buy, sell, and rent 1 BHK, 2 BHK flats, plots, and commercial properties.',
  'url': 'https://majhboisar.in/properties',
  'areaServed': {
    '@type': 'AdministrativeArea',
    'name': 'Boisar, Palghar, Maharashtra',
  },
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Boisar',
    'addressRegion': 'Maharashtra',
    'postalCode': '401501',
    'addressCountry': 'IN',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': '19.8000',
    'longitude': '72.7500',
  }
};

const propertiesFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How to buy or rent flats in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Majh Boisar Real Estate portal connects you directly with genuine flat owners and verified local brokers in Boisar. You can filter by 1 BHK, 2 BHK, 3 BHK, budget, and location (Ostwal Empire, Boisar West, Navapur Road, Salwad) with direct phone calls & WhatsApp connect.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What is the starting price for 1 BHK and 2 BHK flats in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'In Boisar, 1 BHK flats for sale start from ₹14 Lakhs to ₹22 Lakhs, while 2 BHK flats range from ₹25 Lakhs to ₹45 Lakhs depending on prime societies like Ostwal Empire, Tata Housing, and proximity to Boisar Railway Station.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Can I post a free property listing to sell or rent my home in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes! Property owners, landlords, and registered brokers can list flats, shops, row houses, and industrial plots for free on Majh Boisar.'
      }
    }
  ]
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertiesJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertiesFaqJsonLd) }}
      />
      {children}
    </>
  );
}
