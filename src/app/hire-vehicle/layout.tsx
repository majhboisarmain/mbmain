import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Vehicle Rentals in Boisar — Cabs, Tempo, Chota Hathi, Self-Drive Cars & Auto Rickshaw | Majh Boisar',
  description: 'Book verified tempo transport (Chota Hathi, Pickup), outstation & local AC cabs, self-drive cars, and tourist buses in Boisar, Tarapur MIDC & Palghar. Direct driver contacts with zero commission.',
  keywords: [
    'tempo in boisar',
    'chota hathi in boisar',
    'tempo service near me',
    'car rental in boisar',
    'cab in boisar',
    'taxi in boisar',
    'boisar to mumbai cab',
    'boisar to surat cab',
    'self drive car in boisar',
    'tempo for shifting in boisar',
    'tarapur midc transport service',
    'majh boisar vehicle hire'
  ],
  openGraph: {
    title: 'Vehicle Rentals & Tempo Transport in Boisar | Majh Boisar',
    description: 'Find direct tempo services, local & outstation cabs, and auto helplines in Boisar with verified contact numbers.',
    url: 'https://majhboisar.in/hire-vehicle',
    siteName: 'Majh Boisar Vehicle Rentals',
    locale: 'en_IN',
    type: 'website'
  },
  alternates: {
    canonical: 'https://majhboisar.in/hire-vehicle',
  }
};

const vehicleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRental',
  'name': 'Majh Boisar Vehicle Rentals & Transport Services',
  'description': 'Direct local transport and vehicle rental directory for Boisar & Tarapur MIDC including commercial tempos, cabs, and rental vehicles.',
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
