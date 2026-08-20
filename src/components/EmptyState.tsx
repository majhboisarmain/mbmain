'use client';

import React from 'react';
import { SearchX, RotateCcw, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export default function EmptyState({
  icon = <SearchX className="w-12 h-12 text-teal-600" />,
  title = "Koi Search Result Nahi Mila",
  description = "Aapke dhoondhe gaye keywords ya filters ke liye koi listing nahi mili. Kripya doosre keywords try karein ya filters clear karein.",
  actionText,
  onAction,
  actionHref,
  secondaryActionText,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-5 animate-in zoom-in-95 duration-200 my-6">
      <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto shadow-inner">
        {icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">{description}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {actionHref ? (
          <Link
            href={actionHref}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <span>{actionText || 'Browse Categories'}</span>
          </Link>
        ) : actionText && onAction ? (
          <button
            onClick={onAction}
            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        ) : null}

        {secondaryActionText && onSecondaryAction ? (
          <button
            onClick={onSecondaryAction}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {secondaryActionText}
          </button>
        ) : null}
      </div>
    </div>
  );
}
