import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Best Restaurants & Cafes in Boisar — Dining, Food Delivery & Pure Veg | Majh Boisar",
  description: "Explore top 100+ verified cafes, family dining restaurants, pure veg thalis, fast food, Agri-Koli seafood, and rooftop party lounges in Boisar & Tarapur MIDC. Get direct digital menu, deals & WhatsApp table reservations with 0% commission.",
  keywords: [
    "restaurants in boisar",
    "best cafe in boisar",
    "food in boisar",
    "pure veg restaurant boisar",
    "seafood in boisar",
    "thali in boisar",
    "rooftop cafe boisar",
    "daily dose cafe boisar",
    "citrus cafe boisar",
    "dining in boisar",
    "fast food boisar",
    "biryani in boisar",
    "pizza in boisar",
    "food delivery boisar",
    "dhaba in boisar"
  ],
  openGraph: {
    title: "Hi Foodie, Dine in Boisar! Top Restaurants, Cafes & Thalis | Majh Boisar",
    description: "Discover top cafes, family restaurants, pure veg thalis & party lounges in Boisar with menus & 1-tap WhatsApp booking.",
    url: "https://majhboisar.in/food",
    siteName: "Majh Boisar (माझं बोईसर)",
    type: "website"
  },
  alternates: {
    canonical: "https://majhboisar.in/food"
  }
};

const foodJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  'name': 'Dining & Food Delivery Directory Boisar — Majh Boisar',
  'description': 'Comprehensive food & dining guide for Boisar with menus, table reservations, home delivery and pure veg options.',
  'url': 'https://majhboisar.in/food',
  'areaServed': {
    '@type': 'AdministrativeArea',
    'name': 'Boisar & Tarapur MIDC, Maharashtra',
  },
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Boisar',
    'addressRegion': 'Maharashtra',
    'postalCode': '401501',
    'addressCountry': 'IN',
  }
};

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(foodJsonLd) }}
      />
      {children}
    </>
  );
}
