import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Emergency Blood Donors & Blood Banks in Boisar | Majh Boisar',
  description: 'Find voluntary blood donors and 24/7 blood bank helpline contacts in Boisar, Tarapur MIDC & Palghar. Search blood groups A+, B+, AB+, O+, A-, B-, AB-, O-. Register as a donor today.',
  keywords: [
    'blood donation boisar',
    'blood donors in boisar',
    'blood bank in boisar',
    'emergency blood in palghar',
    'o positive blood boisar',
    'b positive blood boisar',
    'tarapur midc blood donation'
  ],
  alternates: {
    canonical: 'https://majhboisar.in/blood-donation',
  },
  openGraph: {
    title: 'Emergency Blood Donors in Boisar — Majh Boisar',
    description: 'Find verified voluntary blood donors across Boisar & Palghar.',
    url: 'https://majhboisar.in/blood-donation',
    siteName: 'Majh Boisar Blood Bank',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function BloodDonationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
