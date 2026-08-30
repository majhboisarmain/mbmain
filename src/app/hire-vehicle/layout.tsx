import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Travels in Boisar — Tour & Travels, Cabs, Tempo, Car Rental, Taxi & Bus Service | Majh Boisar',
  description: 'Top Travels in Boisar & Tarapur MIDC. Book verified Tour & Travels, local & outstation AC cabs, taxi booking, tempo transport (Chota Hathi, Pickup), self-drive cars, and tourist buses with direct driver contacts & 0% commission.',
  keywords: [
    'travels in boisar',
    'travel agency in boisar',
    'tour and travels in boisar',
    'best travels in boisar',
    'travels near me boisar',
    'cab in boisar',
    'taxi in boisar',
    'taxi service in boisar',
    'car rental in boisar',
    'tempo in boisar',
    'chota hathi in boisar',
    'tempo service near me',
    'boisar to mumbai cab',
    'boisar to surat cab',
    'self drive car in boisar',
    'tempo for shifting in boisar',
    'tarapur midc transport service',
    'majh boisar vehicle hire',
    'majh boisar travels'
  ],
  openGraph: {
    title: 'Travels in Boisar — Tour & Travels, Cabs & Transport | Majh Boisar',
    description: 'Top Travels in Boisar & Tarapur MIDC. Find verified Tour & Travels, local & outstation cabs, and tempo transport with direct contact numbers.',
    url: 'https://majhboisar.in/hire-vehicle',
    siteName: 'Majh Boisar Travels & Vehicle Rentals',
    locale: 'en_IN',
    type: 'website'
  },
  alternates: {
    canonical: 'https://majhboisar.in/hire-vehicle',
  }
};

const vehicleJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['AutoRental', 'TravelAgency'],
  'name': 'Majh Boisar Travels & Vehicle Rentals',
  'description': 'Direct local tour and travels, transport and vehicle rental directory for Boisar & Tarapur MIDC including cabs, taxis, commercial tempos, and rental vehicles.',
  'url': 'https://majhboisar.in/hire-vehicle',
  'areaServed': {
    '@type': 'AdministrativeArea',
    'name': 'Boisar, Tarapur MIDC, Palghar, Maharashtra',
  },
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Boisar',
    'addressRegion': 'Maharashtra',
    'postalCode': '401501',
    'addressCountry': 'IN',
  }
};

export default function HireVehicleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      {children}
    </>
  );
}
