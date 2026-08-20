'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Check, Globe, MessageSquare, Car, Zap } from 'lucide-react';

export default function AdvertisePage() {
  const [activeTab, setActiveTab] = useState<'website' | 'autorickshaw'>('website');

  const websitePackages = [
    {
      id: 'cat_ad',
      name: 'Category Page Banner',
      duration: '7 Days',
      price: '₹199',
      tag: 'Basic',
      desc: 'Shows on top of your category page (Doctors, Hotels, Shops, etc.)',
      points: [
        'Top placement in your category',
        'Direct Call & WhatsApp button',
        'Ad starts in 24 hours'
      ]
    },
    {
      id: 'home_spotlight',
      name: 'Homepage Banner',
      duration: '7 Days',
      price: '₹349',
      tag: 'Popular',
      desc: 'Shows on the main home page seen by all Boisar visitors.',
      points: [
        'Main Home Page view',
        'Photo + Shop Name + Offer',
        'Gold Verified Shop badge'
      ]
    },
    {
      id: 'vip_blast',
      name: 'Full Month VIP (All Spots)',
      duration: '30 Days',
      price: '₹2,499',
      tag: 'Best Value',
      desc: 'Shows your shop everywhere on the website for 1 full month.',
      points: [
        'Shows on Home + All Categories',
        'Full 30 Days display',
        'Free banner design by our team'
      ]
    }
  ];

  const defaultAutoPackages = [
    {
      id: 'auto_5',
      name: '5 Auto Posters',
      duration: '30 Days (1 Month)',
      price: '₹1,499',
      tag: 'Starter',
      desc: '5 Auto Rickshaws with your poster roaming daily in Boisar & MIDC.',
      points: [
        '5 Autos with back-hood poster',
        'Free vinyl poster printing & fitting',
        'Photo proof on WhatsApp on Day 1'
      ]
    },
    {
      id: 'auto_15',
      name: '15 Auto Posters',
      duration: '30 Days (1 Month)',
      price: '₹3,999',
      tag: 'Popular',
      desc: '15 Auto Rickshaws roaming Station, Market & MIDC daily.',
      points: [
        '15 Autos across Boisar & Palghar',
        'Free ad design & printing',
        'High daily road visibility'
      ]
    },
    {
      id: 'auto_30',
      name: '30 Auto City Pack',
      duration: '30 Days (1 Month)',
      price: '₹7,499',
      tag: 'Big Impact',
      desc: '30 Auto Rickshaws covering all stands in Boisar and Tarapur.',
      points: [
        '30 Autos for full 30 days',
        'Complete city brand coverage',
        'Free website banner worth ₹999'
      ]
    }
  ];

  const [autoPackages, setAutoPackages] = useState(defaultAutoPackages);

  useEffect(() => {
    const loadDynamicPackages = () => {
      if (typeof window === 'undefined') return;
      try {
        const saved = localStorage.getItem('majh_boisar_auto_poster_packages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formatted = parsed.map((p: any) => ({
              id: p.id || p.name,
              name: p.name,
              duration: p.duration,
              price: p.price,
              tag: p.tag,
              desc: p.desc || `${p.name} roaming in Boisar & MIDC daily.`,
              points: p.features || p.points || []
            }));
            setAutoPackages(formatted);
          }
        }
      } catch (e) {}
    };

    loadDynamicPackages();
    window.addEventListener('storage', loadDynamicPackages);
    window.addEventListener('majh_boisar_auto_posters_updated', loadDynamicPackages);
    return () => {
      window.removeEventListener('storage', loadDynamicPackages);
      window.removeEventListener('majh_boisar_auto_posters_updated', loadDynamicPackages);
    };
  }, []);

  const currentList = activeTab === 'website' ? websitePackages : autoPackages;

  const openWhatsApp = (pkgName: string, price: string, duration: string) => {
    const msg = encodeURIComponent(
      `Hello Majh Boisar! 👋\nI want to book the ad plan:\n\nPlan: ${pkgName}\nPrice: ${price} (${duration})\n\nPlease tell me how to start.`
    );
    window.open(`https://wa.me/917769947217?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16 text-left">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="truncate">
              <h1 className="text-sm font-black text-slate-900 truncate">Advertise in Boisar</h1>
              <p className="text-[10px] text-slate-500 font-semibold truncate">Get more customers for your business</p>
            </div>
          </div>

          <a
            href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar!%20I%20want%20to%20advertise%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 mt-3 space-y-3.5">
        
        {/* Simple Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-200 p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('website')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'website'
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Ads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('autorickshaw')}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'autorickshaw'
                ? 'bg-purple-900 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            <span>🛺 Auto Posters</span>
          </button>
        </div>

        {/* Auto Rickshaw Note */}
        {activeTab === 'autorickshaw' && (
          <div className="bg-amber-100 border border-amber-300 text-amber-950 p-2.5 rounded-xl text-xs font-bold text-center">
            Poster printing + Fitting on Autos + 30 Days daily city roaming included.
          </div>
        )}

        {/* 3 Grid Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          {currentList.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border-2 p-4 shadow-2xs flex flex-col justify-between ${
                pkg.tag === 'Popular'
                  ? 'border-purple-600 ring-2 ring-purple-600/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-2.5">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                    pkg.tag === 'Popular' ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-white'
                  }`}>
                    {pkg.tag}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{pkg.duration}</span>
                </div>

                {/* Title & Price */}
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {pkg.name}
                  </h3>
                  <div className="text-2xl font-black text-purple-950 mt-1">
                    {pkg.price}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {pkg.desc}
                </p>

                {/* 3 Simple Points */}
                <div className="space-y-1.5 pt-1">
                  {pkg.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                      </div>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Book Button */}
              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => openWhatsApp(pkg.name, pkg.price, pkg.duration)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white font-black text-xs py-2.5 px-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
                  <span>Book on WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Simple Bottom Help Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <div>
            <h4 className="text-xs font-black text-slate-900">Need help or a custom ad?</h4>
            <p className="text-[11px] text-slate-500 font-medium">Call our Boisar team directly.</p>
          </div>
          <a
            href="tel:7769947217"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call: 7769947217</span>
          </a>
        </div>

      </div>
    </div>
  );
}
