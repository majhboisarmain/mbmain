'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Sparkles, Bell, ShieldCheck, Star } from 'lucide-react';

export default function AppDownloadBanner() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-8">
      {/* Compact Main Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#d9381e] via-[#e64a19] to-[#f4511e] text-white shadow-xl p-4 sm:p-6 lg:p-8 border border-white/20">
        
        {/* Ambient Lighting */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-black/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-8">
          
          {/* ── LEFT SECTION: BRANDING & HEADLINE ── */}
          <div className="flex-1 w-full flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>🚀 MOBILE APPLICATION COMING SOON</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-sm">
                माझं बोईसर App <span className="text-amber-300">Launching Soon</span>
              </h2>
              <p className="text-xs sm:text-[13px] text-white/90 font-medium max-w-md leading-relaxed">
                We are building the ultimate super app for Boisar with 1-tap local search, direct MIDC job updates, table ordering &amp; 0% commission.
              </p>
            </div>

            {/* Coming Soon Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 w-full sm:w-auto">
              <div className="bg-slate-950/80 text-white px-3.5 py-2 rounded-xl border border-white/20 shadow-md flex items-center gap-2 text-xs font-black">
                <span className="text-base">🤖</span>
                <span>Android (Play Store) • Coming Soon</span>
              </div>
              <div className="bg-white/15 text-white px-3.5 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-xs font-bold">
                <span className="text-base">🍎</span>
                <span>iOS (App Store) • In Progress</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT SECTION: PREVIEW BADGE ── */}
          <div className="hidden sm:flex flex-row md:flex-col items-center shrink-0">
            
            <div className="bg-gradient-to-b from-[#b72c15] to-[#7f1d0d] rounded-2xl p-4 sm:p-5 border border-white/30 shadow-xl text-center space-y-2.5 w-48">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-400/50 shadow-md mx-auto flex items-center justify-center text-xl">
                📱
              </div>

              <div>
                <p className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                  OFFICIAL APP
                </p>
                <p className="text-[13px] font-black text-white leading-tight">
                  Majh Boisar
                </p>
              </div>

              <span className="inline-block bg-amber-400 text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Coming Soon
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
