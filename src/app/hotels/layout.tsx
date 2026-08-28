import type { Metadata } from 'next';
import React from 'react';
import { BOISAR_HOTELS } from '@/lib/hotelsData';

export const metadata: Metadata = {
  title: 'Hotels in Boisar from ₹349 — Book at Lowest Price | Hourly & Night Stays — Majh Boisar',
  description: '🔥 Book verified Hotels in Boisar at the cheapest price starting ₹349! Flexible 3h, 6h hourly slots & overnight stay. 100% Couple Friendly, Local ID Accepted & Pay at Hotel Desk. Book your room in 30 seconds on Majh Boisar.',
  keywords: [
    'hotels in boisar',
    'book hotels in boisar cheapest price',
    'cheap hotels in boisar',
    'best hotel in boisar',
    'hourly hotels boisar from 349',
    'couple friendly hotels in boisar',
    'hotel room booking in boisar',
    'hotels near boisar railway station',
    'hotels near tarapur midc boisar',
    'luxury hotels boisar',
    'rooms in boisar for unmarried couples',
    'freesia hotel boisar',
    'sarovar residency boisar',
    'blugent residency boisar',
    'boisar lodge lowest price',
    'day stay hotel boisar'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/hotels',
  },
  openGraph: {
    title: 'Hotels in Boisar from ₹349 — Book Now at Lowest Price | Majh Boisar',
    description: '🔥 Book verified Hotels in Boisar at the cheapest price starting ₹349! Flexible 3h, 6h slots & night stays. 100% Couple Friendly, Local ID Accepted & Pay at Desk.',
    url: 'https://majhboisar.in/hotels',
    siteName: 'Majh Boisar Hotels',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Book Hotels in Boisar at Lowest Price - Majh Boisar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotels in Boisar from ₹349 — Book at Cheapest Price on Majh Boisar',
    description: 'Book verified hotels in Boisar with hourly slots from ₹349. 100% Couple friendly, local ID accepted & pay at hotel desk.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80'],
  },
};

// Rich Structured Data (JSON-LD) for Google Search Engine Knowledge Graph & FAQ Rich Snippets
const hotelsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Best Hotels in Boisar',
  'description': 'Verified hourly and overnight stay hotels in Boisar, Palghar, Maharashtra.',
  'itemListElement': BOISAR_HOTELS.map((hotel, idx) => ({
    '@type': 'ListItem',
    'position': idx + 1,
    'item': {
      '@type': 'Hotel',
      'name': hotel.name,
      'description': hotel.description,
      'image': hotel.gallery?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'telephone': `+91${hotel.phone}`,
      'priceRange': `₹${hotel.hourlyRate3h} - ₹${hotel.nightRate}`,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': hotel.address,
        'addressLocality': 'Boisar',
        'addressRegion': 'Maharashtra',
        'postalCode': '401501',
        'addressCountry': 'IN',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '19.8000',
        'longitude': '72.7500',
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': hotel.rating,
        'reviewCount': hotel.reviewsCount,
        'bestRating': '5',
        'worstRating': '1',
      },
      'amenityFeature': hotel.amenities?.map(a => ({
        '@type': 'LocationFeatureSpecification',
        'name': a.name,
        'value': true,
      })),
    },
  })),
};

const hotelFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Which are the best hotels in Boisar for couple and family stays?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Top rated hotels in Boisar include Freesia by Express Inn (Ostwal Empire), Hotel Sarovar Residency (near Tarapur MIDC), Blugent Residency (Navapur Road), and Hotel Boisar Residency (opposite Boisar Railway Station). All are verified, couple-friendly and accept local government IDs.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Can I book hourly hotels in Boisar for 3 hours, 6 hours or 12 hours?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes! Majh Boisar allows 24/7 flexible hourly room bookings for 3 hours (starting at ₹349), 6 hours, 12 hours, and overnight stays with instant digital passes and zero commission.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Are unmarried couples and local IDs allowed in Boisar hotels?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, verified hotels listed on Majh Boisar welcome 18+ adult couples with valid original government photo IDs (Aadhaar Card, Driving License, Voter ID or Passport) with complete safety and privacy.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Which hotels are near Boisar Railway Station and Tarapur MIDC?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Hotel Boisar Residency is located directly opposite Boisar Railway Station platform 1. For Tarapur MIDC business visits, Hotel Sarovar Residency (Salwad Gate 2) and Freesia by Express Inn (Ostwal Empire) are within 5-10 minutes distance.'
      }
    }
  ]
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelFaqJsonLd) }}
      />
      {children}
    </>
  );
}
