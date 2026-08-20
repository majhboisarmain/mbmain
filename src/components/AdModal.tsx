'use client';

import React, { useState } from 'react';
import { Sparkles, X, Phone, Globe, Car } from 'lucide-react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightedPackageName?: string | null;
}

export default function AdModal({ isOpen, onClose, highlightedPackageName }: AdModalProps) {
  const [tab, setTab] = useState<'website' | 'autorickshaw'>('website');

  if (!isOpen) return null;

  const websitePackages = [
    { name: "Category Page Banner", duration: "7 Days", price: "₹199", isPopular: false, icon: "📂", desc: "Top position on specific category pages" },
    { name: "Homepage Spotlight Card", duration: "7 Days", price: "₹349", isPopular: true, icon: "🏠", desc: "Featured front business card on home page" },
    { name: "Full VIP City Blast", duration: "30 Days", price: "₹2,499", isPopular: false, icon: "👑", desc: "All 4 ad placements site-wide for full month" },
  ];

  const defaultAutoPackages = [
    { name: "5 Auto Hood Posters", duration: "30 Days", price: "₹1,499", isPopular: false, icon: "🛺", desc: "5 Autos with rear hood vinyl poster roaming daily" },
    { name: "15 Auto Fleet (High Visibility)", duration: "30 Days", price: "₹3,999", isPopular: true, icon: "🛺", desc: "15 Autos covering Station, MIDC & Market routes" },
    { name: "30 Auto City Dominance", duration: "30 Days", price: "₹7,499", isPopular: false, icon: "🛺", desc: "Maximum branding across all Boisar-Tarapur stands" },
  ];

  const [autoRickshawPackages, setAutoRickshawPackages] = useState(defaultAutoPackages);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_auto_poster_packages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAutoRickshawPackages(parsed.map((p: any) => ({
              name: p.name,
              duration: p.duration,
              price: p.price,
              isPopular: p.tag?.toLowerCase().includes('popular') || false,
              icon: p.icon || '🛺',
              desc: p.desc || 'Auto rear hood vinyl poster roaming daily'
            })));
          }
        }
      } catch (e) {}
    }
  }, [isOpen]);

  const currentPackages = tab === 'website' ? websitePackages : autoRickshawPackages;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 text-left">
      <div className="fixed inset-0" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl border border-slate-100 z-10 flex flex-col max-h-[90vh] sm:max-h-[92vh] animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-800 sm:rounded-t-3xl rounded-t-3xl p-4 text-white relative overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
            Local Advertising
          </span>
          <h3 className="text-base font-black leading-tight pr-8">Advertise on Majh Boisar</h3>
          <p className="text-purple-200 text-[10.5px] font-medium mt-0.5">
            Reach 5 Lakh+ local customers in Boisar &amp; Tarapur MIDC.
          </p>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          
          {/* Tabs */}
          <div className="bg-slate-100 p-0.5 rounded-xl grid grid-cols-2 gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTab('website')}
              className={`py-1.5 px-2 rounded-lg font-black transition-all cursor-pointer text-center ${
                tab === 'website' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-500'
              }`}
            >
              🌐 Website Ads
            </button>
            <button
              type="button"
              onClick={() => setTab('autorickshaw')}
              className={`py-1.5 px-2 rounded-lg font-black transition-all cursor-pointer text-center ${
                tab === 'autorickshaw' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-500'
              }`}
            >
              🛺 Auto Posters
            </button>
          </div>

          {/* Pricing List */}
          <div className="space-y-2">
            {currentPackages.map((pkg, i) => (
              <div
                key={i}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                  pkg.isPopular ? 'bg-purple-50/60 border-purple-300 shadow-2xs' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm shrink-0">
                  {pkg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-[11px] font-black text-slate-900 leading-tight">
                      {pkg.name}
                    </h4>
                    {pkg.isPopular && (
                      <span className="bg-purple-900 text-white text-[7px] font-black px-1.5 py-0.2 rounded uppercase">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                    {pkg.desc} · {pkg.duration}
                  </p>
                </div>
                <div className="text-xs font-black text-purple-950 shrink-0">
                  {pkg.price}
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA Button */}
          <div className="pt-1">
            <a
              href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar!%20I%20want%20to%20book%20an%20advertising%20slot."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <span>Chat on WhatsApp to Book Slot</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
