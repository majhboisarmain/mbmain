import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Your Business — Free Listing | Majh Boisar',
  description: 'List your shop, service or company for free on Majh Boisar. Reach 50,000+ local customers across Boisar & Tarapur MIDC.',
  alternates: {
    canonical: 'https://www.majhboisar.in/register-business',
  },
  openGraph: {
    title: 'Register Your Business — Free Listing | Majh Boisar',
    description: 'List your shop, service or company for free on Majh Boisar. Reach 50,000+ local customers across Boisar & Tarapur MIDC.',
    url: 'https://www.majhboisar.in/register-business',
    siteName: 'Majh Boisar',
    type: 'website',
  },
};

export default function RegisterBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
