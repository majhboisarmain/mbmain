import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Majh Boisar — Boisar's #1 City Directory & Local Search Engine",
  description:
    'Majh Boisar is the #1 local business directory for Boisar, Tarapur MIDC, and Palghar. Find verified doctors, hospitals, plumbers, electricians, salons, real estate agents, coaching classes, restaurants and more.',
  keywords: 'jobs in boisar, job boisar, gym in boisar, doctor in boisar, hospital boisar, ashirwad clinic boisar, plumber boisar, electrician boisar, grocery shop boisar, coaching classes boisar, salon boisar, hotel boisar, real estate boisar, tarapur midc services, local business boisar, boisar directory, majh boisar, palghar local search, part time jobs in boisar, hiring in boisar, local vacancies boisar',
  authors: [{ name: 'MajhBoisar Team' }],
  openGraph: {
    title: "Majh Boisar — Boisar's #1 City Directory & Local Search Engine",
    description: 'Find verified local shops, doctors, hospitals, service providers, and direct-hiring jobs in Boisar, Tarapur MIDC & Palghar.',
    url: 'https://majhboisar.in',
    siteName: 'MajhBoisar',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Majh Boisar - Local Business Directory & Jobs Portal',
    description: 'Find verified doctors, plumbers, jobs & more in Boisar & Tarapur MIDC.',
  },
  alternates: {
    canonical: 'https://majhboisar.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading Majh Boisar...</div>}>
      <HomeClient />
    </Suspense>
  );
}
