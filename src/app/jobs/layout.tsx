import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Jobs in Boisar & Tarapur MIDC — 500+ Direct Vacancies & Walk-In Interviews | Majh Boisar',
  description: 'Find direct hiring jobs in Boisar & Tarapur MIDC. Daily updated vacancies for Chemical Plants, Pharma, Engineering, ITI, Diploma, Helper, Driver, Accounts, Sales, and Office Staff. 0% Consultancy fees, contact HR directly on WhatsApp & Call.',
  keywords: [
    'jobs in boisar',
    'tarapur midc jobs',
    'tarapur midc vacancy',
    'jobs in tarapur',
    'chemical company jobs in tarapur',
    'pharma jobs in boisar',
    'urgent vacancy in tarapur midc',
    'iti jobs in boisar',
    'engineering jobs in tarapur',
    'operator jobs in boisar',
    'helper jobs in boisar',
    'fitter jobs tarapur',
    'accountant jobs in boisar',
    'sales marketing jobs boisar',
    'security guard vacancy boisar',
    'driver jobs in boisar',
    'female jobs in boisar',
    'part time jobs in boisar',
    'fresher jobs in tarapur midc',
    'walk in interview in tarapur',
    'boisar job portal',
    'majh boisar jobs'
  ],
  openGraph: {
    title: 'Jobs in Boisar & Tarapur MIDC — Direct Company Hiring | Majh Boisar',
    description: 'Find direct hiring jobs and part-time work vacancies in Boisar, Tarapur MIDC, and Palghar with direct HR contact.',
    url: 'https://majhboisar.in/jobs',
    siteName: 'Majh Boisar Job Portal',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Jobs in Boisar & Tarapur MIDC Vacancies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs in Boisar & Tarapur MIDC — Direct Hiring Vacancies',
    description: 'Explore daily verified job openings in Tarapur MIDC & Boisar across Chemical, Pharma, ITI, Helper & Office roles.',
    images: ['https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop&q=80'],
  },
  alternates: {
    canonical: 'https://majhboisar.in/jobs',
  }
};

const jobsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'Jobs in Boisar & Tarapur MIDC — Majh Boisar Direct Employment Portal',
  'description': 'Hyperlocal job portal for Tarapur MIDC & Boisar industrial area connecting job seekers with direct chemical plants, pharma factories, and local business employers with zero agent commission.',
  'url': 'https://majhboisar.in/jobs',
  'areaServed': {
    '@type': 'AdministrativeArea',
    'name': 'Boisar & Tarapur MIDC, Palghar, Maharashtra',
  },
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Boisar',
    'addressRegion': 'Maharashtra',
    'postalCode': '401501',
    'addressCountry': 'IN',
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': '19.8037',
    'longitude': '72.7554',
  }
};

const jobsFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'How can I find direct jobs in Tarapur MIDC and Boisar without paying consultancy fees?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Majh Boisar Jobs Portal (majhboisar.in/jobs) offers 100% free direct hiring listings from verified factory HRs and business owners in Tarapur MIDC. You can apply directly via Call and WhatsApp with 0% middleman fees.'
      }
    },
    {
      '@type': 'Question',
      'name': 'What types of jobs are available in Tarapur MIDC?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Tarapur MIDC is one of Asia\'s largest chemical & industrial belts with abundant openings in Chemical Operator, QC/QA Chemist, Pharma Production, ITI Fitter & Electrician, Store Incharge, Plant Helpers, CNC Operators, Account Executives, and Logistics Drivers.'
      }
    },
    {
      '@type': 'Question',
      'name': 'How do local companies and shop owners post jobs on Majh Boisar?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Employers can post urgent vacancies directly through the Majh Boisar Partner Dashboard (majhboisar.in/dashboard) to receive instant local applications from qualified Boisar candidates.'
      }
    }
  ]
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsFaqJsonLd) }}
      />
      {children}
    </>
  );
}
