'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBusinessPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500">Redirecting to Business Registration...</p>
      </div>
    </div>
  );
}

