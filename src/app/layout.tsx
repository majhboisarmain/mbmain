import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

import NetworkStatusListener from "@/components/NetworkStatusListener";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Majh Boisar — Boisar's #1 City Directory & Local Search Engine",
  description: "Official Boisar city directory & local search engine. Find 800+ verified Doctors, Shops, Real Estate Properties, Tempo Helplines, Tarapur MIDC Jobs, Blood Donors & Services in Boisar, Palghar.",
  keywords: [
    "majh boisar", "majha boisar", "maza boisar", "majhboisar", "majhaboisar", "माझं बोईसर", "माझा बोईसर", "बोईसर", "boisar portal", "boisar city directory", "boisar info",
    "resorts in boisar", "resorts near boisar", "kelwa beach resort", "kelve beach resort", "dahanu resort", "private pool villa boisar", "palghar resorts", "day picnic resorts near boisar", "weekend resorts near mumbai", "farmhouse on rent in boisar", "waterpark resort near boisar",
    "boisar hotel", "hotels in boisar", "best hotel in boisar", "couple friendly hotel in boisar", "hourly hotels in boisar", "rooms in boisar", "hotel near boisar railway station", "hotel in tarapur midc", "freesia hotel boisar", "sarovar residency boisar", "budget hotel boisar",
    "properties in boisar", "flats in boisar", "1 bhk in boisar", "1 bhk flat in boisar", "2 bhk in boisar", "2 bhk flat in boisar", "flats for sale in boisar", "flat for rent in boisar", "house for sale in boisar", "plots in boisar", "real estate agent in boisar", "boisar real estate", "ostwal empire flats",
    "boisar local directory", "shops in boisar", "doctors in boisar", "hospitals in boisar",
    "ca in boisar", "gst consultant in boisar", "itr filing boisar", "trademark registration boisar",
    "shop act licence boisar", "gumasta license boisar", "fssai food license boisar", "business consultancy boisar",
    "tarapur midc jobs", "boisar midc job fair", "jobs in boisar", "urgent vacancy in tarapur", "chemical company jobs in tarapur", "tempo service near me", "tempo services in boisar",
    "chota hathi tempo boisar", "tempo helpline boisar", "car rental in boisar", "travels near me in boisar",
    "bus timetable boisar", "used items in boisar", "second hand bike boisar", "used furniture boisar",
    "used mobile buy sell boisar", "student book exchange boisar", "old books in boisar", "10th 12th guides boisar",
    "home technician near me", "ac repair in boisar", "electrician near me in boisar", "plumber near me in boisar",
    "coaching classes in boisar", "restaurants in boisar", "beauty parlour in boisar", "gym near me in boisar",
    "sports turf near me", "game zone in boisar", "boisar blood donors", "blood bank in boisar", "boisar helpline", "tarapur midc directory"
  ],
  authors: [{ name: "Majh Boisar" }],
  creator: "Majh Boisar",
  publisher: "Majh Boisar",
  metadataBase: new URL("https://majhboisar.in"),
  icons: {
    icon: [
      { url: "/majh-boisar-mb-logo.png", type: "image/png" },
      { url: "/majh-boisar-mb-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/majh-boisar-mb-logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/majh-boisar-mb-logo.png",
    apple: [
      { url: "/majh-boisar-mb-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Majh Boisar (माझं बोईसर) — #1 Local City Directory & Search Engine",
    description: "Official Majh Boisar (Majha Boisar) local search engine. Find 800+ verified shops, resorts, hotels, doctors, Tarapur MIDC jobs, properties & blood donors in Boisar, Palghar.",
    url: "https://majhboisar.in",
    siteName: "Majh Boisar (माझं बोईसर)",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "Majh Boisar Local City Directory & Business Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Majh Boisar (माझं बोईसर) — Boisar's #1 City Portal",
    description: "Search 800+ verified local shops, resorts, hotels, doctors, tempo helplines, flats & MIDC jobs in Boisar.",
    images: ["/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Boisar, Palghar, Maharashtra",
    "geo.position": "19.8000;72.7500",
    "ICBM": "19.8000, 72.7500"
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Majh Boisar",
  "alternateName": [
    "Majh Boisar", 
    "Majha Boisar", 
    "Maza Boisar", 
    "MajhBoisar", 
    "माझं बोईसर", 
    "माझा बोईसर", 
    "बोईसर", 
    "Majh Boisar Directory", 
    "Boisar City Search",
    "Boisar Portal"
  ],
  "url": "https://majhboisar.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://majhboisar.in/search?query={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "description": "Official Majh Boisar (Majha Boisar / माझं बोईसर) city directory and local search engine. Find resorts, hotels, tempo services, Tarapur MIDC jobs, properties, blood donors, and 800+ businesses in Boisar & Palghar."
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Majh Boisar",
  "url": "https://majhboisar.in",
  "logo": "https://majhboisar.in/majh-boisar-mb-logo.png",
  "sameAs": [
    "https://instagram.com/majhboisar",
    "https://facebook.com/majhboisar"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Boisar",
    "addressRegion": "Maharashtra",
    "postalCode": "401501",
    "addressCountry": "IN"
  }
};

const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "Hotels & Hourly Day-Stay in Boisar",
      "url": "https://majhboisar.in/hotels"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "Resorts & Pool Villas in Boisar & Kelwa Beach",
      "url": "https://majhboisar.in/resorts"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Find Real Estate & Properties in Boisar",
      "url": "https://majhboisar.in/properties"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "Find Jobs in Boisar & Tarapur MIDC",
      "url": "https://majhboisar.in/jobs"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Emergency Blood Donors in Boisar",
      "url": "https://majhboisar.in/blood-donation"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 6,
      "name": "Advertise & Promote Business in Boisar",
      "url": "https://majhboisar.in/advertise"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 7,
      "name": "Local Business Directory Search",
      "url": "https://majhboisar.in/search"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 8,
      "name": "Partner & Business Dashboard",
      "url": "https://majhboisar.in/dashboard"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full dark`}>
      <body className="min-h-full bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,hi,mr',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            }
          `}
        </Script>
        <Script
          id="google-translate-script"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <LanguageProvider>
          <AppProvider>
            <NetworkStatusListener />
            <div className="w-full min-h-screen flex flex-col relative">
              <Preloader />
              <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200 w-full shrink-0" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <footer className="border-t border-slate-200 bg-white py-5 text-slate-600 text-xs shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                  {/* Slim Footer Links Row */}
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] font-medium text-slate-600">
                    <a href="/" className="hover:text-teal-600 transition-colors">Home</a>
                    <span className="text-slate-300">•</span>
                    <a href="/jobs" className="hover:text-teal-600 transition-colors">Jobs</a>
                    <span className="text-slate-300">•</span>
                    <a href="/blood-donation" className="hover:text-teal-600 transition-colors">Blood Donors</a>
                    <span className="text-slate-300">•</span>
                    <a href="/advertise" className="hover:text-teal-600 transition-colors">Advertise</a>
                    <span className="text-slate-300">•</span>
                    <a href="mailto:support@majhboisar.in" className="hover:text-teal-600 transition-colors">Help &amp; Support</a>
                    <span className="text-slate-300">•</span>
                    <a href="/privacy" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
                    <span className="text-slate-300">•</span>
                    <a href="/terms" className="hover:text-teal-600 transition-colors">Terms</a>
                  </div>

                  {/* Copyright & Small BuildLabs Credit */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                    <p>© 2026 Majh Boisar. All rights reserved.</p>
                    <p>
                      Developed by <a href="https://buildlabs.in" target="_blank" rel="noopener noreferrer" className="text-slate-500 font-semibold hover:text-teal-600 transition-colors">buildlabs.in</a>
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
