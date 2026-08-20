'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, ShieldCheck, Star, ArrowLeft } from 'lucide-react';

export default function DownloadAppPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaGuide, setShowPwaGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Automatically show native browser install prompt when landing on this page
      try {
        (e as any).prompt();
      } catch (err) {}
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          alert('🎉 Majh Boisar App successfully added to your Home Screen!');
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowPwaGuide(true);
      }
    } else {
      setShowPwaGuide(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 text-slate-800 font-sans relative">
      <div className="max-w-md w-full space-y-6 animate-fade-in text-center py-8">

        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Boisar Home</span>
          </Link>
        </div>

        {/* Main PWA Install Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle Glow Background Accent */}
          <div className="absolute -top-20 -left-20 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* App Logo & Details */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 border-2 border-teal-500/30 p-2.5 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/majh-boisar-mb-logo.png"
                alt="Majh Boisar Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <span className="bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-teal-200 inline-block mb-1">
                Official Web App (PWA)
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Install Majh Boisar App
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Boisar's #1 City Directory &amp; Local Search Engine right on your phone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Safe &amp; Virus-Free
              </span>
              <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.9 ★ Rating
              </span>
            </div>
          </div>

          {/* Single Primary Action Button: PWA Install */}
          <div className="pt-2">
            <button
              onClick={handleInstallPwa}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-98 text-white font-black text-sm py-4 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Smartphone className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>📲 Install App (Add to Home Screen)</span>
            </button>
          </div>

        </div>

      </div>

      {/* PWA Step Guide Modal */}
      {showPwaGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xs w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto border border-teal-200">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Add App to Home Screen</h3>
              <p className="text-xs text-slate-500 mt-1">In your mobile browser:</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 text-left text-xs text-slate-700 border border-slate-200">
              <p className="flex items-center gap-2">
                <span className="bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">1</span>
                <span>Tap browser menu (<strong>3 dots ⋮</strong>)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">2</span>
                <span>Select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong></span>
              </p>
            </div>

            <button
              onClick={() => setShowPwaGuide(false)}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
