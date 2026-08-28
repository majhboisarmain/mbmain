import { Suspense } from 'react';
import HomeClient from '../HomeClient';

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold text-slate-500">Loading Boisar Real Estate...</div>}>
      <HomeClient initialSpecialCategory="properties" />
    </Suspense>
  );
}
