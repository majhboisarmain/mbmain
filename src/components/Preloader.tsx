'use client';

import React, { useState, useEffect } from 'react';

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Only show quick micro-preloader on initial mount without blocking the user
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 150);

    const timer2 = setTimeout(() => {
      setShow(false);
    }, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Logo — uses the local MB icon logo */}
        <img
          src="/majh-boisar-mb-logo.png"
          alt="Majh Boisar Logo"
          className="w-24 h-24 object-contain"
        />

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
