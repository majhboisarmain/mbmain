import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Local Businesses, Services & Shops in Boisar | Majh Boisar',
  description: 'Search verified gyms, doctors, plumbers, CA, lawyers, restaurants, shops and 800+ categories in Boisar & Tarapur MIDC. Direct contact details & reviews.',
  keywords: [
    'boisar business search',
    'find businesses in boisar',
    'boisar local directory search',
    'tarapur midc local shops',
    'services near me boisar',
  ],
  alternates: {
    canonical: 'https://majhboisar.in/search',
  },
  openGraph: {
    title: 'Search Businesses & Services in Boisar | Majh Boisar',
    description: 'Find top verified local businesses, phone numbers & location maps in Boisar.',
    url: 'https://majhboisar.in/search',
    siteName: 'Majh Boisar',
    type: 'website',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
