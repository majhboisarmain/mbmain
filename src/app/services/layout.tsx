import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'RO Purifier Repair & Home Services in Boisar — Electricians, Plumbers & AC Technicians | Majh Boisar',
  description: 'Book verified RO Purifier repair, water filter service, AC repair, electricians, plumbers & domestic helpers in Boisar, Palghar. 1-Tap direct WhatsApp & phone call with upfront rates.',
  keywords: [
    'ro repair in boisar',
    'ro purifier service boisar',
    'water purifier repair boisar',
    'water filter service boisar',
    'kent ro repair boisar',
    'aquaguard repair boisar',
    'home services boisar',
    'ac repair boisar',
    'electrician in boisar',
    'plumber in boisar',
    'carpenter in boisar',
    'cleaning services boisar',
    'pest control boisar',
    'technicians in boisar',
    'tarapur midc home services',
    'justdial boisar home services'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/services',
  },
  openGraph: {
    title: 'RO Purifier Repair & Home Services in Boisar — Majh Boisar',
    description: 'Find & call verified RO water purifier technicians and home service providers in Boisar with upfront rates and 1-tap direct WhatsApp/Phone booking.',
    url: 'https://majhboisar.in/services',
    siteName: 'Majh Boisar Home Services',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RO Purifier Repair & Home Services in Boisar — Majh Boisar',
    description: 'Find & call verified RO water purifier technicians and home service providers in Boisar with upfront rates.',
  },
};

// Rich Structured Data (JSON-LD) for Google SERP Knowledge Graph & Featured Snippets
const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'Majh Boisar Home Services & RO Water Purifier Repair',
  'description': '1-Tap verified booking for RO water purifier repair, filter replacement, AC repair, electricians, plumbers, carpenters, and domestic helpers in Boisar & Tarapur MIDC.',
  'url': 'https://majhboisar.in/services',
  'telephone': '+917769947217',
  'priceRange': '₹199 - ₹2,500',
  'areaServed': [
    { '@type': 'City', 'name': 'Boisar' },
    { '@type': 'AdministrativeArea', 'name': 'Tarapur MIDC' },
    { '@type': 'AdministrativeArea', 'name': 'Ostwal Empire' },
    { '@type': 'AdministrativeArea', 'name': 'Betegaon' },
    { '@type': 'AdministrativeArea', 'name': 'Pasthal' },
    { '@type': 'AdministrativeArea', 'name': 'Palghar' }
  ],
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Boisar West & East',
    'addressLocality': 'Boisar',
    'addressRegion': 'Maharashtra',
    'postalCode': '401501',
    'addressCountry': 'IN'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': '19.8000',
    'longitude': '72.7500'
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.8',
    'reviewCount': '438',
    'bestRating': '5',
    'worstRating': '1'
  }
};

const breadcrumbsJsonLd = {
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
      'name': 'Home Services & RO Repair in Boisar',
      'item': 'https://majhboisar.in/services'
    }
  ]
};

const servicesFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How to book RO Purifier repair & water filter service in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'You can book verified RO technicians on Majh Boisar with 1-tap direct call or WhatsApp. Services include Kent, Aquaguard, Pureit & Livpure filter cartridge change, membrane service, TDS adjustment, and motor repair starting at ₹199 visiting fee.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What are the visiting charges for electricians, plumbers and AC technicians in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Visiting and inspection charges start from ₹199 for electricians and plumbers in Boisar. AC service jet wash starts from ₹299. All providers give transparent upfront rates before beginning any work.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Can I hire verified house maids, cooks, and drivers in Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, Majh Boisar lists background-checked domestic helpers including house maids (cleaning, sweeping, mopping, utensil washing), home cooks (roti-sabji, full meals), and car drivers with duty timings and direct contact numbers.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Are emergency repair services available in Tarapur MIDC and Boisar West?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Yes, on-call electricians, plumbers, and breakdown mechanics are available 24/7 for residential societies (Ostwal Empire, Navapur Road) and Tarapur MIDC industrial units.'
      }
    }
  ]
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqJsonLd) }}
      />
      {children}
    </>
  );
}
