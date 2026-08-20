import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Majh Boisar — Admin Portal',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
