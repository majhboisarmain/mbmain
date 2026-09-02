import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

import NetworkStatusListener from "@/components/NetworkStatusListener";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollToTopOnNav from "@/components/ScrollToTopOnNav";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0f766e",
};

export const metadata: Metadata = {
  title: "Majh Boisar (Majha Boisar / माझं बोईसर) — Boisar's #1 City Directory & Search Engine",
  description: "Official Majh Boisar (Majha Boisar / Maza Boisar / माझं बोईसर) local search engine & city directory. Find 800+ verified Doctors, Shops, Real Estate Properties, Tempo Helplines, Tarapur MIDC Jobs, Blood Donors & Services in Boisar, Palghar.",
  keywords: [
    "majh boisar", "majha boisar", "maza boisar", "majhe boisar", "maze boisar", "majhboisar", "majhaboisar", "mazaboisar", "boisar majh", "boisar maza", "boisar majha", "boisar city",
    "माझं बोईसर", "माझा बोईसर", "माझे बोईसर", "बोईसर माझं", "बोईसर", "boisar portal", "boisar city directory", "boisar info", "boisar local search",
    "gym near me", "gym in boisar", "best gym in boisar", "fitness center boisar", "protein shop in boisar", "protein and supplements boisar",
    "resorts in boisar", "resorts near boisar", "kelwa beach resort", "kelve beach resort", "dahanu resort", "private pool villa boisar", "palghar resorts", "day picnic resorts near boisar", "weekend resorts near mumbai", "farmhouse on rent in boisar", "waterpark resort near boisar",
    "boisar hotel", "hotels in boisar", "best hotel in boisar", "couple friendly hotel in boisar", "hourly hotels in boisar", "rooms in boisar", "hotel near boisar railway station", "hotel in tarapur midc", "budget hotel boisar", "lodge in boisar",
    "properties in boisar", "flats in boisar", "1 bhk in boisar", "1 bhk flat in boisar", "2 bhk in boisar", "2 bhk flat in boisar", "flats for sale in boisar", "flat for rent in boisar", "plots in boisar", "real estate agent in boisar", "boisar real estate", "ostwal empire flats",
    "boisar local directory", "shops in boisar", "doctors in boisar", "hospitals in boisar", "clinics in boisar", "pathology lab boisar", "medical store boisar",
    "tarapur midc jobs", "boisar midc job fair", "jobs in boisar", "urgent vacancy in tarapur", "chemical company jobs in tarapur", "tempo service near me", "tempo services in boisar",
    "chota hathi tempo boisar", "tempo helpline boisar", "car rental in boisar", "travels near me in boisar", "cab booking boisar", "auto rickshaw boisar",
    "restaurants in boisar", "food delivery boisar", "best cafe in boisar", "pure veg food boisar", "dhaba in boisar",
    "blood donation in boisar", "boisar blood donors", "emergency blood boisar", "blood bank in boisar", "boisar helpline", "tarapur midc directory"
  ],
  authors: [{ name: "Majh Boisar" }],
  creator: "Majh Boisar",
  publisher: "Majh Boisar",
  metadataBase: new URL("https://majhboisar.in"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Majh Boisar (माझं बोईसर / Majha Boisar) — #1 City Directory & Search Engine",
    description: "Official Majh Boisar (Majha Boisar / Maza Boisar) local search engine. Find 800+ verified shops, gyms, resorts, hotels, doctors, Tarapur MIDC jobs, properties & blood donors in Boisar, Palghar.",
    url: "https://majhboisar.in",
    siteName: "Majh Boisar (माझं बोईसर / Majha Boisar)",
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
    title: "Majh Boisar (माझं बोईसर / Majha Boisar) — Boisar's #1 City Portal",
    description: "Search 800+ verified local shops, gyms, resorts, hotels, doctors, tempo helplines, flats & MIDC jobs in Boisar.",
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
    "Majhe Boisar",
    "Maze Boisar",
    "MajhBoisar", 
    "MajhaBoisar",
    "MazaBoisar",
    "माझं बोईसर", 
    "माझा बोईसर", 
    "माझे बोईसर",
    "बोईसर माझं",
    "बोईसर", 
    "Boisar Majh",
    "Boisar Maza",
    "Boisar Majha",
    "Boisar City Directory", 
    "Boisar Local Search",
    "Boisar Portal"
  ],
  "url": "https://majhboisar.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://majhboisar.in/search?query={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "description": "Official Majh Boisar (Majha Boisar / Maza Boisar / माझं बोईसर) city directory and local search engine. Find gyms, resorts, hotels, tempo services, Tarapur MIDC jobs, properties, blood donors, and 800+ businesses in Boisar & Palghar."
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

const localBusinessDirectoryJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Majh Boisar — Boisar Local Search Engine & City Directory",
  "image": "https://majhboisar.in/majh-boisar-mb-logo.png",
  "@id": "https://majhboisar.in",
  "url": "https://majhboisar.in",
  "telephone": "+919022388123",
  "priceRange": "₹ - ₹₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Boisar West & East, Tarapur MIDC",
    "addressLocality": "Boisar",
    "addressRegion": "Maharashtra",
    "postalCode": "401501",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.8037,
    "longitude": 72.7554
  },
  "areaServed": [
    { "@type": "City", "name": "Boisar" },
    { "@type": "AdministrativeArea", "name": "Tarapur MIDC" },
    { "@type": "AdministrativeArea", "name": "Palghar" },
    { "@type": "AdministrativeArea", "name": "Kelwa Beach" },
    { "@type": "AdministrativeArea", "name": "Dahanu" },
    { "@type": "AdministrativeArea", "name": "Ostwal Empire" },
    { "@type": "AdministrativeArea", "name": "Boisar Station" }
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "4850",
    "bestRating": "5",
    "worstRating": "1"
  },
  "founder": {
    "@type": "Person",
    "name": "Ganesh Bhadane"
  }
};

const localFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is the founder of Majh Boisar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Majh Boisar (माझं बोईसर) was founded by Ganesh Bhadane with the vision of building a unified, hyperlocal super-app and digital ecosystem for the citizens, businesses, and workforce of Boisar and Tarapur MIDC."
      }
    },
    {
      "@type": "Question",
      "name": "What is Majh Boisar (माझं बोईसर)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Majh Boisar (majhboisar.in) is Boisar's #1 official local search engine and verified business directory founded by Ganesh Bhadane. It connects Boisar residents with 800+ verified doctors, hospitals, hotels, resorts, housemaids, electricians, plumbers, real estate flats, and daily Tarapur MIDC jobs."
      }
    },
    {
      "@type": "Question",
      "name": "How to book hourly hotels and night stays in Boisar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can browse verified hotels near Boisar Railway Station and Tarapur MIDC directly on Majh Boisar Hotels portal (majhboisar.in/hotels) with transparent 3-hour, 6-hour, and overnight rates with instant hotel WhatsApp confirmation."
      }
    },
    {
      "@type": "Question",
      "name": "How to hire verified house maids and home cooks in Boisar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit Majh Boisar Home Services (majhboisar.in/services) to find background-verified house maids, cooks, babysitters, and cleaning helpers across Boisar West, Boisar East, and Ostwal Empire."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I find direct jobs in Tarapur MIDC & Boisar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Majh Boisar Jobs portal (majhboisar.in/jobs) updates direct hiring vacancies daily for chemical plants, engineering companies, pharma units, office admin, sales, and delivery jobs in Tarapur MIDC and Boisar."
      }
    },
    {
      "@type": "Question",
      "name": "How to list my shop or business on Majh Boisar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Shop owners and service professionals can list their business for free on Majh Boisar by visiting majhboisar.in and clicking 'List My Business' to reach over 50,000+ local Boisar customers."
      }
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
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" as="image" href="/majh-boisar-mb-logo.png" />
        <link rel="preload" as="image" href="/imagess/ChatGPT Image Aug 15, 2026, 08_23_55 PM.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/imagess/ChatGPT Image Jul 20, 2026, 03_14_16 PM.png" fetchPriority="high" />
        <link rel="preload" as="image" href="/imagess/ChatGPT Image Jul 20, 2026, 03_41_37 PM.png" fetchPriority="high" />
      </head>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessDirectoryJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localFaqJsonLd) }}
        />
        {/* Google Analytics GA4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QH96MHWKDX"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QH96MHWKDX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
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
            <Suspense fallback={null}>
              <ScrollToTopOnNav />
            </Suspense>
            <ServiceWorkerRegister />
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
                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-slate-600">
                    <a href="/" className="hover:text-teal-600 transition-colors">Home</a>
                    <span className="text-slate-300">•</span>
                    <a href="/jobs" className="hover:text-teal-600 transition-colors">Jobs</a>
                    <span className="text-slate-300">•</span>
                    <a href="/blood-donation" className="hover:text-teal-600 transition-colors">Blood Donors</a>
                    <span className="text-slate-300">•</span>
                    <a href="/advertise" className="hover:text-teal-600 transition-colors">Advertise</a>
                    <span className="text-slate-300">•</span>
                    <a 
                      href="https://instagram.com/majhboisar" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-200/80 text-pink-600 hover:text-pink-700 font-bold transition-all hover:scale-105 shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Follow @majhboisar</span>
                    </a>
                    <span className="text-slate-300">•</span>
                    <a href="mailto:majhboisar@gmail.com" className="hover:text-teal-600 transition-colors">Help &amp; Support</a>
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
