'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CategoryRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const rawCat = decodeURIComponent((params?.cat as string) || '');

  useEffect(() => {
    if (rawCat) {
      router.replace(`/search?category=${encodeURIComponent(rawCat)}`);
    } else {
      router.replace('/search');
    }
  }, [rawCat, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading {rawCat || 'listings'}...</p>
      </div>
    </div>
  );
}

