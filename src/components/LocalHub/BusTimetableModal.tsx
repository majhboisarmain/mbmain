'use client';

import React, { useState, useEffect } from 'react';
import { BOISAR_BUS_SCHEDULE } from '@/lib/localData';
import { Bus, X, Clock, MapPin, Search } from 'lucide-react';

interface BusTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BusTimetableModal({ isOpen, onClose }: BusTimetableModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Long Distance' | 'Local & Rural' | 'Express / AC'>('All');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBuses = BOISAR_BUS_SCHEDULE.filter(bus => {
    const matchesCategory = categoryFilter === 'All' || bus.category === categoryFilter;
    const matchesSearch = bus.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0 pr-8 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Official Boisar ST Bus Stand Depot Timetable
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Complete departure schedule for 44 MSRTC bus destinations from Boisar ST Stand
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destination (Palghar, Pune, Dahanu, Kolhapur...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Local & Rural', 'Long Distance', 'Express / AC'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                  categoryFilter === cat
                    ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bus List Grid (1 Column on Mobile, 2 on Tablet, 3 on Desktop) */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredBuses.map(bus => (
              <div
                key={bus.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="bg-teal-50 text-teal-800 border border-teal-200/80 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {bus.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {bus.busType}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{bus.destination}</span>
                  </h4>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mt-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">
                      Departure Timings:
                    </span>
                    <p className="text-xs font-black text-teal-800 leading-relaxed">
                      ⏰ {bus.departures}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-center justify-between">
                  <span>Depot: Boisar ST Stand</span>
                  <span className="text-emerald-600 font-black">✓ MSRTC Schedule</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

