'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const path = window.location.pathname;
      // Do not count internal admin visits
      if (path.startsWith('/adminmb') || path.startsWith('/api')) return;

      const isRecorded = sessionStorage.getItem('mb_session_visit_recorded');
      if (!isRecorded) {
        sessionStorage.setItem('mb_session_visit_recorded', 'true');
        fetch('/api/visitors', { method: 'POST' }).catch(() => {});
      }
    } catch {
      // Safely ignore storage restriction errors
    }
  }, []);

  return null;
}
