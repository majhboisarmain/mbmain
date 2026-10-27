import React from 'react';

export default function BusinessLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans animate-pulse">
      {/* 1. Breadcrumbs Skeleton */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-slate-200 rounded"></div>
            <div className="h-3 w-3 bg-slate-200 rounded-full"></div>
            <div className="h-3 w-16 bg-slate-200 rounded"></div>
            <div className="h-3 w-3 bg-slate-200 rounded-full"></div>
            <div className="h-3 w-28 bg-slate-200 rounded"></div>
          </div>
          <div className="h-5 w-24 bg-slate-100 rounded-full hidden sm:block"></div>
        </div>
      </div>

      {/* 2. Storefront Hero Card Skeleton */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Top Gallery Shimmer */}
          <div className="w-full h-48 sm:h-72 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer relative">
            <div className="absolute top-3 left-3 w-20 h-7 bg-white/80 rounded-full backdrop-blur-xs"></div>
            <div className="absolute top-3 right-3 w-24 h-7 bg-white/80 rounded-full backdrop-blur-xs"></div>
          </div>

          {/* Storefront Info */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-24 bg-teal-100 rounded-md"></div>
                  <div className="h-5 w-20 bg-emerald-100 rounded-md"></div>
                </div>
                <div className="h-7 sm:h-9 w-3/4 max-w-md bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-1/2 max-w-sm bg-slate-200 rounded"></div>
              </div>

              {/* Action Buttons Shimmer */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="h-10 w-24 sm:w-28 bg-emerald-200 rounded-xl"></div>
                <div className="h-10 w-24 sm:w-28 bg-teal-200 rounded-xl"></div>
                <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              <div className="h-12 bg-slate-100 rounded-xl"></div>
              <div className="h-12 bg-slate-100 rounded-xl"></div>
              <div className="h-12 bg-slate-100 rounded-xl"></div>
              <div className="h-12 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* 3. Subtabs Shimmer */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
          <div className="h-9 w-24 bg-teal-600/20 rounded-xl shrink-0"></div>
          <div className="h-9 w-20 bg-slate-200 rounded-xl shrink-0"></div>
          <div className="h-9 w-20 bg-slate-200 rounded-xl shrink-0"></div>
          <div className="h-9 w-20 bg-slate-200 rounded-xl shrink-0"></div>
        </div>

        {/* 4. Details Grid Shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-full bg-slate-100 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
              <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="h-5 w-36 bg-slate-200 rounded"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-20 bg-slate-100 rounded-xl"></div>
                <div className="h-20 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="h-5 w-28 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
