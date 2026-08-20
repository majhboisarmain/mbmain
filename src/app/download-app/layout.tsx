import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Download Majh Boisar Mobile App (Android APK)",
  description: "Download official Majh Boisar Android App (.apk) or install PWA to access 800+ Boisar shops, doctors, Tarapur MIDC jobs & real estate properties 3x faster.",
};

export default function DownloadAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
