import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Your Business — Partner Portal | Majh Boisar',
  description: 'Register and manage your local business, shop, or services on Majh Boisar. Reach 50,000+ local customers across Boisar & Tarapur MIDC.',
  alternates: {
    canonical: 'https://www.majhboisar.in/dashboard',
  },
  openGraph: {
    title: 'Register Your Business — Partner Portal | Majh Boisar',
    description: 'Register and manage your local business, shop, or services on Majh Boisar. Reach 50,000+ local customers across Boisar & Tarapur MIDC.',
    url: 'https://www.majhboisar.in/dashboard',
    siteName: 'Majh Boisar',
    type: 'website',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
