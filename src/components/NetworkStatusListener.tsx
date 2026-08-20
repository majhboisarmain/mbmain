'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertTriangle } from 'lucide-react';

export default function NetworkStatusListener() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetworkStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);

      if (!offline) {
        setShowOnlineToast(true);
        const timer = setTimeout(() => setShowOnlineToast(false), 3000);
        return () => clearTimeout(timer);
      }
    };

    const checkSlowConnection = () => {
      const nav = navigator as any;
      if (nav.connection) {
        const type = nav.connection.effectiveType;
        if (type === '2g' || type === 'slow-2g') {
          setIsSlow(true);
        } else {
          setIsSlow(false);
        }
      }
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    checkSlowConnection();

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-rose-600 text-white text-xs font-black py-2 px-4 flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-200">
        <WifiOff className="w-4 h-4 animate-bounce" />
        <span>You are offline. Please check your internet connection.</span>
      </div>
    );
  }

  if (showOnlineToast) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-emerald-600 text-white text-xs font-black py-2 px-4 flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top fade-out duration-300">
        <Wifi className="w-4 h-4" />
        <span>Internet connection restored!</span>
      </div>
    );
  }

  if (isSlow) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-slate-950 text-[11px] font-black py-1.5 px-4 flex items-center justify-center gap-2 shadow-md">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Slow network connection detected. Loading may take longer than usual.</span>
      </div>
    );
  }

  return null;
}
