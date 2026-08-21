import type { Metadata } from 'next';
import React from 'react';
import { resortsData, ResortVilla } from '@/lib/resortsData';

export const metadata: Metadata = {
  title: 'Resorts & Pool Villas in Boisar, Kelwa Beach & Palghar | Majh Boisar',
  description: 'Book verified Weekend Picnic Resorts, Private Pool Villas, and Kelwa Beach Farmhouses in Boisar, Palghar & Dahanu. Day picnic packages, couple friendly stays with private pool and DJ sound.',
  keywords: [
    'resorts in boisar',
    'kelwa beach resort',
    'resorts near boisar',
    'private pool villa boisar',
    'palghar resorts',
    'day picnic resorts near boisar',
    'weekend resorts near mumbai',
    'farmhouse on rent in boisar',
    'waterpark resort near boisar',
    'kelve beach farmhouse',
    'resorts in dahanu'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/resorts',
  },
  openGraph: {
    title: 'Resorts & Pool Villas in Boisar & Kelwa Beach — Majh Boisar',
    description: 'Find verified day-picnic resorts, private pool villas & beachside farmhouses in Boisar, Kelwa Beach & Palghar.',
    url: 'https://majhboisar.in/resorts',
    siteName: 'Majh Boisar Resorts',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Resorts in Boisar & Kelwa Beach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resorts & Pool Villas in Boisar & Kelwa Beach',
    description: 'Top rated day picnic resorts and private pool villas in Boisar & Kelwa Beach.',
    images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80'],
  },
};

const resortsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Best Resorts & Pool Villas in Boisar & Kelwa Beach',
  'description': 'Verified resorts, private pool villas and day picnic spots in Boisar & Palghar.',
  'itemListElement': (resortsData || []).map((resort: ResortVilla, idx: number) => ({
    '@type': 'ListItem',
    'position': idx + 1,
    'item': {
      '@type': 'Resort',
      'name': resort.name,
      'description': resort.description,
      'image': resort.gallery?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      'telephone': `+91${resort.phone}`,
      'priceRange': `₹${resort.dayPicnicPrice || 500} - ₹${resort.nightStayPrice || 2500}`,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': resort.location || 'Boisar / Kelwa Beach',
        'addressRegion': 'Maharashtra',
        'postalCode': '401501',
        'addressCountry': 'IN',
      },
    },
  })),
};

export default function ResortsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resortsJsonLd) }}
      />
      {children}
    </>
  );
}
