'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Sparkles, Bell, ShieldCheck, Star } from 'lucide-react';

export default function AppDownloadBanner() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
      {/* Sleek Compact Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 text-white shadow-md p-3.5 sm:p-5 border border-white/20">
        
        {/* Ambient Subtle Glow */}
        <div className="absolute top-0 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-center sm:text-left">
          {/* Left: Clean, concise branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black/25 backdrop-blur-xs border border-white/25 flex items-center justify-center text-xl shrink-0 shadow-xs">
              📱
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-tight">
                माझं बोईसर Mobile App
              </h3>
              <p className="text-[11.5px] sm:text-xs text-white/90 font-medium mt-0.5">
                Local directory, verified stays &amp; daily updates on your phone.
              </p>
            </div>
          </div>

          {/* Right: Clean minimal Store tags with a single subtle badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-black/30 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 text-xs font-bold">
              <span>🤖</span>
              <span>Google Play</span>
            </div>
            <div className="bg-black/30 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 text-xs font-bold">
              <span>🍎</span>
              <span>App Store</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-1 rounded-lg shadow-xs shrink-0">
              Soon
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
