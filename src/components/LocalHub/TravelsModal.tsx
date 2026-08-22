'use client';

import React, { useState, useEffect } from 'react';
import { TEMPO_DRIVERS } from '@/lib/localData';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Car, X, Phone, Search } from 'lucide-react';

interface TravelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HIRE_VEHICLES: any[] = [];

type HireFilter = 'All' | 'Car' | 'Auto' | 'Tempo' | 'Bus';

const categoryColors: Record<HireFilter, string> = {
  All: 'bg-slate-700 text-white border-slate-700',
  Car: 'bg-blue-600 text-white border-blue-600',
  Auto: 'bg-emerald-600 text-white border-emerald-600',
  Tempo: 'bg-amber-500 text-slate-950 border-amber-500',
  Bus: 'bg-rose-600 text-white border-rose-600',
};

export default function TravelsModal({ isOpen, onClose }: TravelsModalProps) {
  const { isLoggedIn, setLoginModalOpen, hasRegisteredBusiness } = useApp();
  const router = useRouter();
  const [hireFilter, setHireFilter] = useState<HireFilter>('All');
  const [search, setSearch] = useState('');
  const [vehiclesList, setVehiclesList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_travels_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_travels_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setVehiclesList(parsed);
        }
      } catch (e) {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      onClose();
      router.push('/hire-vehicle');
    }
  }, [isOpen, onClose, router]);

  if (!isOpen) return null;

  const handleRegister = () => {
    onClose();
    if (!isLoggedIn) { setLoginModalOpen(true); return; }
    if (hasRegisteredBusiness) {
      router.push('/dashboard?tab=catalog');
    } else {
      router.push('/dashboard');
    }
  };

  const filteredHire = vehiclesList.filter((v: any) => {
    const matchesCat = hireFilter === 'All' || v.category === hireFilter;
    const matchesSearch = (v.name || '').toLowerCase().includes(search.toLowerCase()) || (v.location || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col text-left">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0 pr-10 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">Hire a Vehicle — Boisar</h3>
              <p className="text-xs text-slate-500 font-bold truncate">Car · Auto · Tempo · Bus — per km rate &amp; contact</p>
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <span>+ List Yours</span>
          </button>
        </div>

        {/* Filter + Search */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 shrink-0">
          {(['All', 'Car', 'Auto', 'Tempo', 'Bus'] as HireFilter[]).map(cat => (
            <button key={cat} onClick={() => setHireFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer whitespace-nowrap ${hireFilter === cat ? categoryColors[cat] : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
              {cat === 'All' ? '🚗 All' : cat === 'Car' ? '🚕 Car' : cat === 'Auto' ? '🛺 Auto' : cat === 'Tempo' ? '🚛 Tempo' : '🚌 Bus'}
            </button>
          ))}
          <div className="relative ml-auto shrink-0 w-36">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-2 py-1.5 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all" />
          </div>
        </div>

        {/* Vehicle Cards */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredHire.map(v => (
              <div key={v.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col group">
                {/* Image (Taller ratio so vehicle images do not cut off) */}
                <div className="relative w-full h-44 sm:h-48 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider
                      ${v.category === 'Car' ? 'bg-blue-600 text-white' :
                        v.category === 'Auto' ? 'bg-emerald-600 text-white' :
                        v.category === 'Tempo' ? 'bg-amber-400 text-slate-950' :
                        'bg-rose-600 text-white'}`}>{v.icon} {v.category}</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-slate-950/80 backdrop-blur text-white text-xs font-black px-2 py-0.5 rounded-full">{v.ratePerKm}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 mb-0.5">{v.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mb-1">📍 {v.location}</p>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-blue-700 font-black">{v.ratePerKm}</span>
                      <span className="text-slate-400">{v.minCharge}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-bold bg-slate-50 rounded-lg px-2 py-1.5 border border-slate-100 leading-relaxed">{v.details}</p>
                  </div>
                  <a href={`tel:${v.phone}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1">
                    <Phone className="w-4 h-4" /><span>Book Now · {v.phone}</span>
                  </a>
                </div>
              </div>
            ))}

            {filteredHire.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-black text-slate-700">No Vehicles Listed for Hire Yet</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Car rentals, auto drivers, and travel agencies in Boisar can click "+ List Yours" to add their vehicles.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
