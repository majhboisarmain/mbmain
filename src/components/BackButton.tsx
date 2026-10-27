'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
  className?: string;
  variant?: 'navbar' | 'pill' | 'minimal' | 'icon';
  showText?: boolean;
}

export default function BackButton({
  label = 'Back',
  fallbackUrl = '/',
  className = '',
  variant = 'pill',
  showText = false
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;

    const startHref = window.location.href;
    const hasHistory = window.history && window.history.length > 1;

    // Check if user came from within the same origin / domain
    const hasSameOriginReferrer =
      typeof document !== 'undefined' &&
      document.referrer &&
      (document.referrer.startsWith(window.location.origin) || document.referrer.includes(window.location.host));

    if (hasHistory && hasSameOriginReferrer) {
      // User navigated from another page within this site
      try {
        router.back();
      } catch {
        window.history.back();
      }

      // Safety fallback: If router.back() didn't change the page within 150ms, force fallbackUrl
      setTimeout(() => {
        if (window.location.href === startHref) {
          try {
            router.push(fallbackUrl);
          } catch {
            window.location.href = fallbackUrl;
          }
        }
      }, 150);
    } else if (hasHistory) {
      // User has browser history, attempt back first
      try {
        router.back();
      } catch {
        window.history.back();
      }

      // Safety fallback: If user opened directly, refreshed, or back() does nothing, go to fallbackUrl
      setTimeout(() => {
        if (window.location.href === startHref) {
          try {
            router.push(fallbackUrl);
          } catch {
            window.location.href = fallbackUrl;
          }
        }
      }, 150);
    } else {
      // No history stack available, immediately navigate to fallbackUrl
      try {
        router.push(fallbackUrl);
      } catch {
        window.location.href = fallbackUrl;
      }
    }
  };

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        onClick={handleBack}
        aria-label={label || 'Go Back'}
        title={label || 'Go Back'}
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100/90 hover:bg-teal-50 hover:border-teal-300 active:scale-95 text-slate-700 hover:text-teal-700 transition-all flex items-center justify-center shrink-0 border border-slate-200/90 shadow-2xs group cursor-pointer ${className}`}
      >
        <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 group-hover:text-teal-700 group-hover:-translate-x-0.5 transition-transform" />
        {showText && (
          <span className="hidden min-[480px]:inline text-xs font-bold text-slate-700 ml-1 group-hover:text-teal-700">
            {label}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleBack}
        aria-label={label || 'Go Back'}
        title={label || 'Go Back'}
        className={`w-8 h-8 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 hover:text-teal-700 border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer ${className}`}
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        type="button"
        onClick={handleBack}
        aria-label={label || 'Go Back'}
        title={label || 'Go Back'}
        className={`inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer group active:scale-95 ${className}`}
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        {showText && <span>{label}</span>}
      </button>
    );
  }

  // Default 'pill' / header icon button: symbol-only sleek button
  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label || 'Go Back'}
      title={label || 'Go Back'}
      className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-white hover:bg-slate-50 active:scale-90 text-slate-700 hover:text-teal-700 border border-slate-200/90 shadow-2xs transition-all flex items-center justify-center shrink-0 cursor-pointer select-none touch-manipulation group ${showText ? 'px-2.5 py-1 w-auto inline-flex gap-1.5' : ''} ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:text-teal-700 group-hover:-translate-x-0.5 transition-transform" />
      {showText && <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700">{label}</span>}
    </button>
  );
}
