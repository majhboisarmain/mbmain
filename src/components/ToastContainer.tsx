'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        const bgStyle = isSuccess
          ? 'bg-white border-emerald-200 text-slate-900 shadow-lg shadow-emerald-500/5'
          : isError
          ? 'bg-white border-rose-200 text-slate-900 shadow-lg shadow-rose-500/5'
          : isWarning
          ? 'bg-white border-amber-200 text-slate-900 shadow-lg shadow-amber-500/5'
          : 'bg-white border-sky-200 text-slate-900 shadow-lg shadow-sky-500/5';

        const iconColor = isSuccess
          ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
          : isError
          ? 'text-rose-600 bg-rose-50 border border-rose-200'
          : isWarning
          ? 'text-amber-600 bg-amber-50 border border-amber-200'
          : 'text-sky-600 bg-sky-50 border border-sky-200';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 fade-in ${bgStyle}`}
          >
            <div className={`shrink-0 p-1 rounded-xl ${iconColor}`}>
              {isSuccess && <CheckCircle2 className="w-4 h-4" />}
              {isError && <AlertCircle className="w-4 h-4" />}
              {isWarning && <AlertTriangle className="w-4 h-4" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-bold leading-tight tracking-tight text-slate-800">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
