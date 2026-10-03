import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

import NetworkStatusListener from "@/components/NetworkStatusListener";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollToTopOnNav from "@/components/ScrollToTopOnNav";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorTracker from "@/components/VisitorTracker";

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
  title: {
    default: "Majh Boisar — Boisar's #1 City Directory, Hotels & Local Search",
    template: "%s | Majh Boisar",
  },
  description: "Boisar's #1 All-in-One City Portal — Yahan sab milega! 1000+ verified shops, hotels, flats on rent/sale, home services, doctors, Tarapur MIDC jobs & cabs in Boisar.",
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
    "blood donation in boisar", "boisar blood donors", "emergency blood boisar", "blood bank in boisar", "boisar helpline", "tarapur midc directory",
    "ro repair boisar", "ro repair in boisar", "water purifier repair boisar", "home services boisar", "ac repair in boisar", "electrician in boisar", "plumber in boisar", "house maid in boisar",
    "justdial boisar", "justdial alternative boisar", "housing boisar", "agoda boisar", "oyo hotels in boisar"
  ],
  authors: [
    { name: "Ganesh Bhadane", url: "https://majhboisar.in" },
    { name: "Majh Boisar" }
  ],
  creator: "Ganesh Bhadane (B.Tech Computer Engineer)",
  publisher: "Ganesh Bhadane — Founder & Lead Engineer, Majh Boisar",
  metadataBase: new URL("https://majhboisar.in"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
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
    description: "Boisar's #1 All-in-One City Portal (माझं बोईसर) — Yahan sab milega! 1000+ verified local shops, budget & hourly hotels, flats on rent/sale, home services, doctors, Tarapur MIDC jobs, resorts & transport in Boisar.",
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
    description: "Boisar me sab kuch milega — 1000+ verified shops, hotels, flats, doctors, MIDC jobs & home services on Majh Boisar.",
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
  "description": "Boisar's #1 All-in-One City Portal & Local Search Engine (माझं बोईसर). Boisar me sab kuch milega — 1000+ verified shops, hotels, flats on rent/sale, home services, doctors, Tarapur MIDC jobs, cabs & blood donors in Boisar, Palghar."
};

const ganeshBhadanePersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ganesh Bhadane",
  "jobTitle": "Founder & Lead Software Engineer",
  "description": "Ganesh Bhadane is a B.Tech Computer Engineer and the Founder of Majh Boisar (माझं बोईसर) — Boisar's #1 verified hyperlocal digital search engine and city ecosystem.",
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Bachelor of Technology in Computer Engineering (B.Tech Computer Science)"
  },
  "knowsAbout": [
    "Computer Engineering",
    "Software Development",
    "Hyperlocal Search Engines",
    "Digital Ecosystems",
    "Next.js & Web Development",
    "Local Commerce & City Tech"
  ],
  "url": "https://majhboisar.in",
  "sameAs": [
    "https://instagram.com/majhboisar"
  ]
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Majh Boisar",
  "alternateName": ["Majha Boisar", "Maza Boisar", "माझं बोईसर"],
  "url": "https://majhboisar.in",
  "logo": "https://majhboisar.in/majh-boisar-mb-logo.png",
  "founder": {
    "@type": "Person",
    "name": "Ganesh Bhadane",
    "jobTitle": "Founder & Lead Software Engineer",
    "description": "B.Tech Computer Engineer and creator of Majh Boisar hyperlocal super-app."
  },
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
      "name": "Properties in Boisar — Flats, Plots & 1/2 BHK",
      "url": "https://majhboisar.in/properties"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "Hotels & Hourly Day-Stay in Boisar",
      "url": "https://majhboisar.in/hotels"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Register Your Business — Free Listing on Majh Boisar",
      "url": "https://majhboisar.in/register-business"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "Travels in Boisar — Tour & Travels, Cabs & Transport",
      "url": "https://majhboisar.in/hire-vehicle"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Home Services & Repairs in Boisar",
      "url": "https://majhboisar.in/services"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 6,
      "name": "Find Jobs in Boisar & Tarapur MIDC",
      "url": "https://majhboisar.in/jobs"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 7,
      "name": "Resorts & Pool Villas in Boisar & Kelwa Beach",
      "url": "https://majhboisar.in/resorts"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 8,
      "name": "Emergency Blood Donors in Boisar",
      "url": "https://majhboisar.in/blood-donation"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 9,
      "name": "Advertise & Promote Business in Boisar",
      "url": "https://majhboisar.in/advertise"
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
    "name": "Ganesh Bhadane",
    "jobTitle": "Founder & Lead Software Engineer",
    "description": "Ganesh Bhadane is a B.Tech Computer Engineer and the Founder & Architect of Majh Boisar."
  }
};

const localFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who is the owner and founder of Majh Boisar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Majh Boisar (माझं बोईसर) was founded and developed by Ganesh Bhadane, a professional B.Tech Computer Engineer. He built Majh Boisar as a modern, high-speed hyperlocal city directory and digital super-app connecting residents, businesses, hotels, real estate, and industries across Boisar and Tarapur MIDC."
      }
    },
    {
      "@type": "Question",
      "name": "What is Majh Boisar (माझं बोईसर)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Majh Boisar (majhboisar.in) is Boisar's #1 All-in-One local city portal and search engine. Yahan Boisar me sab kuch milega — 1000+ verified shops, budget & hourly hotels, flats for sale/rent, home services, doctors, Tarapur MIDC jobs, cabs, tempo & emergency blood donors."
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K2LRR286');`,
          }}
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" as="image" href="/majh-boisar-mb-logo.png" />
        <link rel="preload" as="image" href="/imagess/ChatGPT Image Aug 15, 2026, 08_23_55 PM.png" fetchPriority="high" />
      </head>
      <body className="min-h-full bg-white text-slate-800 font-sans antialiased flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2LRR286"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ganeshBhadanePersonJsonLd) }}
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
        {/* Google Analytics GA4 with Next.js App Router Page Tracking */}
        <GoogleAnalytics />
        <Script id="google-translate-init" strategy="lazyOnload">
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
          strategy="lazyOnload"
        />
        <LanguageProvider>
          <AppProvider>
            <Suspense fallback={null}>
              <ScrollToTopOnNav />
            </Suspense>
            <ServiceWorkerRegister />
            <NetworkStatusListener />
            <VisitorTracker />
            <div className="w-full min-h-screen flex flex-col relative">
              <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200 w-full shrink-0" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              {/* Crimson Red Modern Footer (Digital Vasai style with Majh Boisar Branding) */}
              <footer className="bg-[#9b111e] text-white shrink-0 rounded-t-[32px] sm:rounded-t-[44px] overflow-hidden shadow-2xl mt-2 sm:mt-4">
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8">
                  {/* Big White Majh Boisar Logo in Center */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <a href="/" className="inline-block group">
                      <img 
                        src="/majh-boisar-full-logo.png" 
                        alt="Majh Boisar" 
                        className="h-16 sm:h-24 md:h-28 lg:h-32 w-auto brightness-0 invert drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105" 
                      />
                    </a>
                  </div>

                  {/* Thin White Divider Line */}
                  <div className="border-t border-white/20 w-full my-7 sm:my-10" />

                  {/* Bottom Row: Social Icons (Left) + Links (Center) + Innovation Tag (Right) */}
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 text-center lg:text-left">
                    {/* Left: Social Icons (Only Official Majh Boisar Accounts) */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {/* Instagram */}
                      <a 
                        href="https://instagram.com/majhboisar" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Instagram" 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
                      >
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>

                      {/* Facebook */}
                      <a 
                        href="https://facebook.com/majhboisar" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Facebook" 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
                      >
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>

                      {/* X (Twitter) */}
                      <a 
                        href="https://x.com/majhboisar" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="X (Twitter)" 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
                      >
                        <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      </a>

                      {/* YouTube */}
                      <a 
                        href="https://youtube.com/@majhboisar" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="YouTube" 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
                      >
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      </a>

                      {/* WhatsApp */}
                      <a 
                        href="https://wa.me/917769947217" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="WhatsApp" 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
                      >
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    </div>

                    {/* Middle: Clean Navigation Links */}
                    <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-white/90">
                      <a href="/about" className="hover:text-white hover:underline transition-all">About</a>
                      <a href="/search" className="hover:text-white hover:underline transition-all">Directory</a>
                      <a href="/services" className="hover:text-white hover:underline transition-all">Services</a>
                      <a href="/properties" className="hover:text-white hover:underline transition-all">Properties</a>
                      <a href="/jobs" className="hover:text-white hover:underline transition-all">Jobs</a>
                      <a href="/privacy" className="hover:text-white hover:underline transition-all">Privacy</a>
                      <a href="/terms" className="hover:text-white hover:underline transition-all">Terms</a>
                    </nav>

                    {/* Right: Made in India & Tagline */}
                    <div className="text-center lg:text-right text-[11px] sm:text-xs">
                      <p className="font-extrabold text-white tracking-wide">
                        Born from Innovation in India • <a href="https://buildlabs.in" target="_blank" rel="noopener noreferrer" className="text-white hover:text-amber-300 underline underline-offset-2 transition-colors font-black">buildlabs.in</a>
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5 font-medium">
                        © 2026 Majh Boisar. All rights? Yep, they&apos;re ours.
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </AppProvider>
        </LanguageProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" id="razorpay-checkout-global" />
      </body>
    </html>
  );
}
