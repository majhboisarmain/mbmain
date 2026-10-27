'use client';

import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

interface ExitAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

export default function ExitAppModal({ isOpen, onClose, onConfirmExit }: ExitAppModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 sm:p-6 text-center transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-[#008080] to-emerald-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon Badge */}
        <div className="w-16 h-16 mx-auto mt-1 mb-3.5 rounded-2xl bg-gradient-to-b from-teal-50 to-emerald-50/60 border border-teal-200/70 flex items-center justify-center shadow-xs">
          <img 
            src="/majh-boisar-mb-logo.png" 
            alt="Majh Boisar" 
            className="w-10 h-10 object-contain drop-shadow-xs" 
          />
        </div>

        {/* Heading & Subtitle */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1 tracking-tight">
          Exit Majh Boisar?
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-6 px-1">
          Are you sure you want to exit the application? You can keep browsing verified Boisar businesses and deals.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-[#008080] hover:bg-teal-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Stay on App
          </button>
          <button
            type="button"
            onClick={onConfirmExit}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 active:scale-98 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
