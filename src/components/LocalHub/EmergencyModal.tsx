'use client';

import React, { useState, useEffect } from 'react';
import { EMERGENCY_CONTACTS } from '@/lib/localData';
import { ShieldAlert, X, Phone, MapPin, Search } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [filter, setFilter] = useState<string>('all');

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

  const filteredContacts = EMERGENCY_CONTACTS.filter(contact => {
    return filter === 'all' || contact.category === filter;
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
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Boisar 24/7 Emergency Helplines
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Direct emergency contact numbers for Boisar Police, MIDC Fire Station, Trauma Ambulance &amp; Power grid
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 shrink-0">
          {[
            { id: 'all', label: 'All Helplines' },
            { id: 'police', label: '👮‍♂️ Police' },
            { id: 'fire', label: '🚒 Fire Brigade' },
            { id: 'hospital', label: '🚑 Hospital Ambulance' },
            { id: 'electricity', label: '⚡ Electricity' },
            { id: 'disaster', label: '⚠️ MIDC Disaster Cell' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                filter === item.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Contacts Grid (1 Column on Mobile, 2 on Tablet, 3 on Desktop) */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredContacts.map(item => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </span>
                    <span className="bg-rose-100 text-rose-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      24/7 HELPLINE
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1">
                    {item.title}
                  </h4>

                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mb-3 truncate">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {item.location}
                  </span>
                </div>

                <a
                  href={`tel:${item.phone}`}
                  className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 animate-pulse" />
                  <span>Call {item.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

