import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Properties in Boisar — Flats, 1/2/3 BHK Apartments, Plots & Shops For Sale & Rent | Majh Boisar Real Estate',
  description: 'Explore 150+ verified properties for sale and rent in Boisar, Palghar. Buy 1 BHK, 2 BHK, 3 BHK flats, builder projects, row houses, commercial shops & industrial plots in Ostwal Empire, Tata Housing, Boisar West & Tarapur MIDC with 0% brokerage direct owner contacts.',
  keywords: [
    'properties in boisar',
    'property in boisar',
    'property in boisar palghar',
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
    'builders in boisar',
    'ostwal empire boisar flats',
    'tata housing boisar',
    'sai villa boisar',
    'navapur road flats boisar',
    'tarapur midc industrial plots',
    'flats in boisar west',
    'cheap flats in boisar',
    'ready to move flats in boisar',
    'new building projects in boisar',
    'rera registered projects boisar'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/properties',
  },
  openGraph: {
    title: 'Properties in Boisar — Flats, Apartments & Plots For Sale / Rent',
    description: 'Explore verified flats, builder projects, row houses, plots, and commercial spaces in Boisar. Contact genuine owners and trusted builders directly with 0% commission.',
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
    description: 'Find 1/2/3 BHK flats & commercial plots in Boisar directly from owners and verified builders.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'],
  },
};

const propertiesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  'name': 'Majh Boisar Real Estate & Property Portal',
  'description': 'Direct owner & verified builder real estate portal for Boisar, Palghar. Buy, sell, and rent 1 BHK, 2 BHK flats, luxury villas, commercial shops, and Tarapur MIDC industrial plots.',
  'url': 'https://majhboisar.in/properties',
  'image': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  'telephone': '+918007412345',
  'priceRange': '₹12 Lakh - ₹2.5 Crore',
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.9',
    'bestRating': '5',
    'worstRating': '1',
    'ratingCount': '482',
    'reviewCount': '395'
  },
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

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://majhboisar.in/'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Boisar Real Estate',
      'item': 'https://majhboisar.in/properties'
    }
  ]
};

const propertiesFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How to buy or rent 1 BHK & 2 BHK flats in Boisar without brokerage?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Majh Boisar Real Estate connects buyers and tenants directly with genuine flat owners and RERA registered builders in Boisar. You can filter by 1 BHK, 2 BHK, 3 BHK, budget, and top localities (Ostwal Empire, Boisar West, Navapur Road, Betegaon, Tata Housing) and connect instantly via direct phone call or WhatsApp without paying middleman brokerage.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What is the starting price for 1 BHK, 2 BHK flats and commercial shops in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'In Boisar, 1 BHK flats for sale start from ₹14 Lakhs to ₹22 Lakhs, while 2 BHK flats range from ₹25 Lakhs to ₹45 Lakhs. Commercial shops start from ₹18 Lakhs, and rental flats start at ₹4,000/month depending on society amenities and distance from Boisar Railway Station.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Which are the most popular residential societies in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Top residential societies and townships in Boisar include Ostwal Empire (Boisar West), Tata Housing Shubh Griha, Mahindra Happinest, Sai Villa, and townships along Navapur Road and Tarapur MIDC.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How can builders and property dealers advertise projects on Majh Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Builders and property agents can post verified property listings, hero carousel banners, and project brochure download links with 0% commission to reach over 10,000+ local monthly homebuyers in Boisar.'
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertiesFaqJsonLd) }}
      />
      {children}
    </>
  );
}

