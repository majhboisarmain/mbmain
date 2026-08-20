'use client';

import React from 'react';
import Link from 'next/link';

interface StaycationTabSwitcherProps {
  activeTab: 'hotels' | 'resorts' | 'villas';
}

export default function StaycationTabSwitcher({ activeTab }: StaycationTabSwitcherProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-1.5 px-3 shadow-2xs">
      <div className="max-w-sm mx-auto flex items-center justify-center gap-2 sm:gap-4">
        
        {/* Tab 1: Hotels */}
        <Link
          href="/hotels"
          className={`flex flex-col items-center justify-center py-1 px-4 sm:px-5 rounded-xl transition-all cursor-pointer group ${
            activeTab === 'hotels'
              ? 'bg-teal-50 border border-teal-600/50 shadow-2xs'
              : 'hover:bg-slate-50 border border-transparent'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg
              className={`w-5 h-5 ${activeTab === 'hotels' ? 'text-teal-600 stroke-teal-600' : 'text-slate-400 stroke-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
              <path d="M10 6h4" />
              <path d="M10 10h4" />
              <path d="M10 14h4" />
              <path d="M10 18h4" />
            </svg>
          </div>
          <span
            className={`text-[11px] font-bold mt-0.5 ${
              activeTab === 'hotels' ? 'text-teal-800 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
            }`}
          >
            Hotels
          </span>
        </Link>

        {/* Tab 2: Resorts */}
        <Link
          href="/resorts"
          className={`flex flex-col items-center justify-center py-1 px-4 sm:px-5 rounded-xl transition-all cursor-pointer group ${
            activeTab === 'resorts'
              ? 'bg-teal-50 border border-teal-600/50 shadow-2xs'
              : 'hover:bg-slate-50 border border-transparent'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg
              className={`w-5 h-5 ${activeTab === 'resorts' ? 'text-teal-600 stroke-teal-600' : 'text-slate-400 stroke-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 8c0-2.2-1.8-4-4-4S5 5.8 5 8c0 .7.2 1.4.5 2" />
              <path d="M9 4v16" />
              <path d="M9 8c2.5-1 4.5-.5 5.5 1" />
              <path d="M9 12c3-1.5 5.5-.5 6.5 1.5" />
              <path d="M5 8c-2.5-1-4.5-.5-5.5 1" />
              <path d="M2 20c3-1 7-1 10 0 3-1 7-1 10 0" />
              <path d="M18 11c0-1.7-1.3-3-3-3s-3 1.3-3 3" />
              <path d="M15 8v12" />
            </svg>
          </div>
          <span
            className={`text-[11px] font-bold mt-0.5 ${
              activeTab === 'resorts' ? 'text-teal-800 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
            }`}
          >
            Resorts
          </span>
        </Link>

        {/* Tab 3: Villas */}
        <Link
          href="/resorts?type=villa"
          className={`flex flex-col items-center justify-center py-1 px-4 sm:px-5 rounded-xl transition-all cursor-pointer group ${
            activeTab === 'villas'
              ? 'bg-teal-50 border border-teal-600/50 shadow-2xs'
              : 'hover:bg-slate-50 border border-transparent'
          }`}
        >
          <div className="w-7 h-7 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg
              className={`w-5 h-5 ${activeTab === 'villas' ? 'text-teal-600 stroke-teal-600' : 'text-slate-400 stroke-slate-400'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              <path d="M9 22V12h6v10" />
              <path d="M18 7v-3h-2" />
            </svg>
          </div>
          <span
            className={`text-[11px] font-bold mt-0.5 ${
              activeTab === 'villas' ? 'text-teal-800 font-extrabold' : 'text-slate-600 group-hover:text-slate-900'
            }`}
          >
            Villas
          </span>
        </Link>

      </div>
    </div>
  );
}
