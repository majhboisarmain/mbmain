import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: {
    absolute: "Majh Boisar — Boisar's #1 City Directory, Hotels & Local Search",
  },
  description:
    "Boisar's #1 All-in-One City Portal — Yahan sab milega! 1000+ verified shops, hotels, flats on rent/sale, home services, doctors, Tarapur MIDC jobs & cabs in Boisar.",
  keywords: 'jobs in boisar, job boisar, gym in boisar, doctor in boisar, hospital boisar, ashirwad clinic boisar, plumber boisar, electrician boisar, grocery shop boisar, coaching classes boisar, salon boisar, hotel boisar, real estate boisar, tarapur midc services, local business boisar, boisar directory, majh boisar, palghar local search, part time jobs in boisar, hiring in boisar, local vacancies boisar',
  authors: [{ name: 'MajhBoisar Team' }],
  openGraph: {
    title: "Majh Boisar — Boisar's #1 All-in-One City Portal & Local Search",
    description: "Boisar's #1 All-in-One City Portal — Yahan sab milega! Find 1000+ verified shops, hotels, flats on rent/sale, doctors, Tarapur MIDC jobs & home services in Boisar.",
    url: 'https://majhboisar.in',
    siteName: 'MajhBoisar',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Majh Boisar — Boisar ka All-in-One City Portal',
    description: 'Boisar me sab kuch milega — 1000+ verified shops, hotels, flats, doctors, MIDC jobs & home services.',
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
