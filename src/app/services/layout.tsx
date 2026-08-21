import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Home Services & Repairs in Boisar — Electricians, Plumbers, AC Repair & Cleaning | Majh Boisar',
  description: 'Book verified Home Services in Boisar, Palghar. 1-Tap direct call with top-rated local AC technicians, electricians, plumbers, carpenters, painters, pest control, deep cleaning & packers movers.',
  keywords: [
    'home services boisar',
    'ac repair boisar',
    'electrician in boisar',
    'plumber in boisar',
    'carpenter in boisar',
    'painter in boisar',
    'cleaning services boisar',
    'pest control boisar',
    'packers and movers boisar',
    'technicians in boisar',
    'ro repair boisar',
    'washing machine repair boisar',
    'appliance repair boisar',
    'tarapur midc home services'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/services',
  },
  openGraph: {
    title: 'Home Services & Repairs in Boisar — Electricians, Plumbers & AC Technicians',
    description: 'Find & call verified home service providers and technicians in Boisar with upfront rates and 1-tap direct WhatsApp/Phone booking.',
    url: 'https://majhboisar.in/services',
    siteName: 'Majh Boisar Home Services',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
