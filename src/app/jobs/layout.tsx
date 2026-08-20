import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobs in Boisar - Find Local Openings, Vacancies & Work in Boisar',
  description: 'Apply to verified jobs, part-time work, helper openings, office boy vacancies, and helper jobs in Boisar, Tarapur MIDC, and Palghar on Majh Boisar. No agents, direct hiring.',
  keywords: 'jobs in boisar, job boisar, vacancy in boisar, jobs in tarapur midc, hiring in boisar, driver jobs boisar, helper jobs boisar, cook jobs boisar, part time jobs in boisar, jobs in boisar for female, jobs in boisar midc',
  openGraph: {
    title: 'Local Jobs & Vacancies in Boisar | Majh Boisar',
    description: 'Find direct hiring jobs and part-time work vacancies in Boisar, Tarapur MIDC, and Palghar.',
    url: 'https://majhboisar.in/jobs',
    type: 'website',
  },
  alternates: {
    canonical: 'https://majhboisar.in/jobs',
  }
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
