import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16 animate-pulse">
      {/* Top Banner Shimmer */}
      <div className="w-full h-24 sm:h-32 bg-gradient-to-r from-teal-800 to-emerald-900 relative flex items-center justify-center opacity-90">
        <div className="h-6 sm:h-8 w-48 bg-white/20 rounded-xl backdrop-blur-xs"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
        {/* Header Shimmer */}
        <div className="flex items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <div className="h-8 w-16 bg-slate-200 rounded-full"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-32 bg-slate-200 rounded"></div>
              <div className="h-5 w-44 bg-slate-300 rounded"></div>
            </div>
          </div>
          <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
        </div>

        {/* Filters Row Shimmer */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="h-8 w-20 bg-slate-200 rounded-lg shrink-0"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-lg shrink-0"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-lg shrink-0"></div>
          <div className="h-8 w-20 bg-slate-200 rounded-lg shrink-0"></div>
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Listing Cards Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                {/* 3 Photos Grid Shimmer */}
                <div className="grid grid-cols-3 gap-1.5 w-full h-38 sm:h-44 p-1.5 bg-slate-50">
                  <div className="h-full bg-slate-200 rounded-xl"></div>
                  <div className="h-full bg-slate-200 rounded-xl"></div>
                  <div className="h-full bg-slate-200 rounded-xl"></div>
                </div>

                {/* Card Info */}
                <div className="p-3.5 space-y-2.5">
                  <div className="h-5 w-2/3 bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-3.5 w-4/5 bg-slate-100 rounded"></div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="h-8 w-24 bg-teal-100 rounded-xl"></div>
                    <div className="h-8 w-24 bg-emerald-100 rounded-xl"></div>
                    <div className="h-8 w-28 bg-slate-100 rounded-xl ml-auto"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 hidden lg:block space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
