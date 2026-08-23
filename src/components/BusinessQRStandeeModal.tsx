'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Printer, Download, Share2, Copy, Check, Sparkles, 
  QrCode, Star, ShieldCheck, MapPin, Phone, MessageSquare, 
  Store, Utensils, Building2, Waves, Stethoscope, Car, 
  Palette, Eye, ExternalLink, ArrowRight
} from 'lucide-react';

export interface StandeeBusinessData {
  id: string | number;
  name: string;
  category?: string;
  location?: string;
  phone?: string;
  whatsapp?: string;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  tagline?: string;
  customUrl?: string;
  customOffer?: string;
  tableNumber?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  business: StandeeBusinessData;
}

type StandeeTheme = 'gold' | 'emerald' | 'purple' | 'teal' | 'slate';

const THEME_CONFIGS: Record<StandeeTheme, {
  name: string;
  badgeBg: string;
  badgeText: string;
  headerGrad: string;
  borderCol: string;
  accentText: string;
  accentBg: string;
  tagBg: string;
  btnBg: string;
  btnHover: string;
  qrBorder: string;
}> = {
  gold: {
    name: 'Royal Gold',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-slate-950',
    headerGrad: 'from-amber-500 via-amber-600 to-amber-700',
    borderCol: 'border-amber-400',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-50',
    tagBg: 'bg-amber-100 text-amber-900 border-amber-300',
    btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    btnHover: 'hover:bg-amber-400',
    qrBorder: 'border-amber-400/60'
  },
  emerald: {
    name: 'Brand Emerald',
    badgeBg: 'bg-emerald-600',
    badgeText: 'text-white',
    headerGrad: 'from-emerald-700 via-teal-800 to-slate-900',
    borderCol: 'border-emerald-500',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    tagBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    btnHover: 'hover:bg-emerald-500',
    qrBorder: 'border-emerald-500/60'
  },
  purple: {
    name: 'Luxury Purple',
    badgeBg: 'bg-purple-600',
    badgeText: 'text-white',
    headerGrad: 'from-purple-900 via-indigo-900 to-slate-950',
    borderCol: 'border-purple-500',
    accentText: 'text-purple-700',
    accentBg: 'bg-purple-50',
    tagBg: 'bg-purple-100 text-purple-900 border-purple-300',
    btnBg: 'bg-purple-700 hover:bg-purple-600 text-white',
    btnHover: 'hover:bg-purple-600',
    qrBorder: 'border-purple-500/60'
  },
  teal: {
    name: 'Ocean Resort',
    badgeBg: 'bg-teal-600',
    badgeText: 'text-white',
    headerGrad: 'from-teal-800 via-cyan-900 to-slate-950',
    borderCol: 'border-teal-400',
    accentText: 'text-teal-700',
    accentBg: 'bg-teal-50',
    tagBg: 'bg-teal-100 text-teal-900 border-teal-300',
    btnBg: 'bg-teal-600 hover:bg-teal-500 text-white',
    btnHover: 'hover:bg-teal-500',
    qrBorder: 'border-teal-400/60'
  },
  slate: {
    name: 'Midnight Pro',
    badgeBg: 'bg-slate-900',
    badgeText: 'text-white',
    headerGrad: 'from-slate-900 via-slate-800 to-slate-950',
    borderCol: 'border-slate-700',
    accentText: 'text-slate-800',
    accentBg: 'bg-slate-100',
    tagBg: 'bg-slate-200 text-slate-900 border-slate-300',
    btnBg: 'bg-slate-900 hover:bg-slate-800 text-white',
    btnHover: 'hover:bg-slate-800',
    qrBorder: 'border-slate-800/60'
  }
};

export default function BusinessQRStandeeModal({ isOpen, onClose, business }: Props) {
  const [selectedTheme, setSelectedTheme] = useState<StandeeTheme>('emerald');
  const [customHeadline, setCustomHeadline] = useState('');
  const [customOffer, setCustomOffer] = useState('');
  const [tableNumber, setTableNumber] = useState<string>(business.tableNumber || '');
  const [copied, setCopied] = useState(false);
  const standeeRef = useRef<HTMLDivElement>(null);

  // Determine category presets
  const cat = (business.category || '').toLowerCase();
  const isFood = cat.includes('restaurant') || cat.includes('cafe') || cat.includes('food') || cat.includes('hotel / food');
  const isHotel = cat.includes('hotel') || cat.includes('lodge') || cat.includes('stay') || cat.includes('room');
  const isResort = cat.includes('resort') || cat.includes('villa') || cat.includes('pool');
  const isMedical = cat.includes('doctor') || cat.includes('clinic') || cat.includes('hospital') || cat.includes('pharmacy') || cat.includes('lab');
  const isTravel = cat.includes('travel') || cat.includes('cab') || cat.includes('auto') || cat.includes('car') || cat.includes('tempo');

  // Automatic smart presets
  useEffect(() => {
    if (isFood) {
      setSelectedTheme('gold');
      if (tableNumber) {
        setCustomHeadline(`SCAN TO DINE-IN AT TABLE ${tableNumber.replace(/\D/g, '') || tableNumber}`);
        setCustomOffer('🍽️ Add dishes & send order direct to kitchen on WhatsApp!');
      } else {
        setCustomHeadline('SCAN TO VIEW DIGITAL MENU & OFFERS');
        setCustomOffer('🍽️ Fresh food, fast dining & takeaway on order!');
      }
    } else if (isHotel) {
      setSelectedTheme('purple');
      setCustomHeadline('SCAN FOR HOURLY ROOM TARIFFS & CHECK-IN');
      setCustomOffer('🏨 3h / 6h / 12h & Night Stays • Local ID Accepted');
    } else if (isResort) {
      setSelectedTheme('teal');
      setCustomHeadline('SCAN FOR SWIMMING POOL VILLA PACKAGES');
      setCustomOffer('🏊 Day-Picnic & Weekend Family Bookings');
    } else if (isMedical) {
      setSelectedTheme('emerald');
      setCustomHeadline('SCAN FOR OPD TIMINGS & APPOINTMENT');
      setCustomOffer('🩺 1-Tap Doctor Contact & Clinic Schedule');
    } else if (isTravel) {
      setSelectedTheme('slate');
      setCustomHeadline('SCAN TO SAVE DRIVER NUMBER & BOOK CABS');
      setCustomOffer('🚕 Mumbai Airport Drop & 24x7 Local Travel');
    } else {
      setSelectedTheme('emerald');
      setCustomHeadline('SCAN TO RATE & REVIEW ON MAJH BOISAR');
      setCustomOffer('⭐ Share your review, rating & feedback on Majh Boisar!');
    }
  }, [business.category, isFood, isHotel, isResort, isMedical, isTravel, tableNumber]);

  if (!isOpen) return null;

  const baseTargetUrl = business.customUrl || (typeof window !== 'undefined' 
    ? `${window.location.origin}/business/${business.id}`
    : `https://majhboisar.in/business/${business.id}`);

  const targetUrl = tableNumber.trim()
    ? `${baseTargetUrl}${baseTargetUrl.includes('?') ? '&' : '?'}table=${encodeURIComponent(tableNumber.trim())}`
    : baseTargetUrl;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(targetUrl)}&margin=10&format=png&color=0b192c`;

  const theme = THEME_CONFIGS[selectedTheme];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Check out *${business.name}* on Majh Boisar (माझं बोईसर) - Boisar's Verified City Directory!\n\nView Profile & Catalog: ${targetUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 text-left overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Left Side: Interactive Standee Live Preview */}
        <div className="flex-1 bg-slate-100/80 p-4 sm:p-6 flex flex-col items-center justify-center overflow-y-auto border-b md:border-b-0 md:border-r border-slate-200">
          
          <div className="w-full flex items-center justify-between mb-3 text-xs font-black text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-teal-700" />
              <span>Official Table-Top Standee Preview</span>
            </span>
            <span className="text-[10.5px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold">
              Ready to Print (A4 / Standee)
            </span>
          </div>

          {/* ── STANDEE CANVAS CONTAINER (Print Target) ── */}
          <div 
            id="printable-standee"
            ref={standeeRef}
            className="w-full max-w-[360px] bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 relative transition-all duration-300 flex flex-col text-slate-900"
            style={{ minHeight: '520px' }}
          >
            
            {/* Top Brand Banner */}
            <div className={`bg-gradient-to-r ${theme.headerGrad} text-white p-4 text-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/15 rounded-full blur-lg pointer-events-none" />
              
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-white/30 text-white shadow-2xs mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>MAJH BOISAR VERIFIED PARTNER</span>
              </div>

              {/* Table Number Badge for Dine-In Table Standees */}
              {tableNumber.trim() && (
                <div className="my-1">
                  <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
                    <span>🪑</span>
                    <span>TABLE NO. {tableNumber.replace(/\D/g, '') || tableNumber}</span>
                  </span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight uppercase line-clamp-2 drop-shadow-xs">
                {business.name}
              </h2>

              <p className="text-[11px] text-white/90 font-bold flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3 h-3 shrink-0 text-amber-300" />
                <span className="truncate">{business.location || 'Boisar West & Tarapur MIDC'}</span>
                <span>•</span>
                <span className="flex items-center text-amber-300 font-black">
                  ★ {business.rating || '4.9'}
                </span>
              </p>
            </div>

            {/* Standee Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col items-center justify-between text-center space-y-3.5 bg-white">
              
              {/* Dynamic Action Headline */}
              <div className="space-y-1">
                <span className={`inline-block px-3 py-1 rounded-xl text-[10.5px] sm:text-xs font-black uppercase tracking-wider ${theme.tagBg} border shadow-2xs`}>
                  {customHeadline || 'SCAN TO CONNECT & VIEW CATALOG'}
                </span>
                <p className="text-[11px] font-extrabold text-slate-700">
                  {customOffer || 'Scan with any Phone Camera, Google Lens or WhatsApp'}
                </p>
              </div>

              {/* High-Resolution QR Code with Center Badge */}
              <div className={`relative p-3 bg-white rounded-3xl border-2 ${theme.qrBorder} shadow-lg flex items-center justify-center group`}>
                <img 
                  src={qrImageUrl} 
                  alt="Business QR Code" 
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-xl"
                />
                
                {/* Center Majh Boisar Seal */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-slate-950 border-2 border-white shadow-xl flex items-center justify-center flex-col text-white">
                  <span className="text-[10px] font-black leading-none text-amber-400">MB</span>
                  <span className="text-[6.5px] font-black uppercase tracking-tighter text-white">BOISAR</span>
                </div>
              </div>

              {/* 3 Value Highlights for Customer */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 space-y-1 text-left text-[10.5px]">
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] shrink-0 font-black">✓</span>
                  <span className="truncate">View Verified Catalog, Tariffs &amp; Menu</span>
                </div>
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] shrink-0 font-black">✓</span>
                  <span className="truncate">1-Tap Direct WhatsApp Chat &amp; Call</span>
                </div>
                <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] shrink-0 font-black">✓</span>
                  <span className="truncate">Rate &amp; Review Shop on Majh Boisar</span>
                </div>
              </div>

              {/* Footer Bar on Standee */}
              <div className="w-full pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-black">
                <span className="flex items-center gap-1 text-slate-800">
                  <Phone className="w-3 h-3 text-teal-700" />
                  <span>{business.phone || business.whatsapp || '9307294733'}</span>
                </span>
                <span className="text-teal-900 uppercase tracking-wider">
                  majhboisar.in
                </span>
              </div>

            </div>

            {/* Standee Base Simulator */}
            <div className="h-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 w-full" />

          </div>

          {/* Standee Acrylic Stand Visual Base */}
          <div className="w-64 h-3 bg-slate-300/80 rounded-b-xl shadow-md border-t border-slate-400/40 mt-0.5" />

        </div>

        {/* Right Side: Customizer & Action Controls */}
        <div className="w-full md:w-[380px] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          
          <div className="space-y-4">
            
            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  Official QR Standee
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Customized for {business.name}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Table Number Selector (For Restaurants, Cafes & Dine-In) */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <span>🪑</span>
                  <span>Table Number (Dine-In QR)</span>
                </label>
                {tableNumber && (
                  <span className="text-[9.5px] font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                    Table {tableNumber.replace(/\D/g, '') || tableNumber}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTableNumber(num)}
                    className={`text-[10.5px] font-black px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                      tableNumber === num
                        ? 'bg-slate-950 text-amber-300 border-slate-950 shadow-xs scale-102'
                        : 'bg-white text-slate-700 border-amber-200/80 hover:bg-amber-100'
                    }`}
                  >
                    {num ? `Table ${num}` : 'Counter / All'}
                  </button>
                ))}
              </div>

              <div className="pt-1 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Custom Table / Cabin (e.g. Garden 3)"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                />
                {tableNumber && (
                  <button
                    type="button"
                    onClick={() => setTableNumber('')}
                    className="text-[10px] font-black text-slate-500 hover:text-slate-800 px-2 py-1 bg-white border border-slate-200 rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-teal-700" />
                <span>Choose Standee Theme</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(Object.keys(THEME_CONFIGS) as StandeeTheme[]).map((tKey) => {
                  const cfg = THEME_CONFIGS[tKey];
                  const isSelected = selectedTheme === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => setSelectedTheme(tKey)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected 
                          ? 'border-slate-950 bg-slate-50 ring-2 ring-slate-950/20 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${cfg.badgeBg} shadow-2xs`} />
                      <span className="text-[9.5px] font-black text-slate-800 truncate leading-tight">
                        {cfg.name.split(' ')[1] || cfg.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Headline Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700">
                Call-To-Action Headline
              </label>
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                placeholder="e.g. SCAN FOR DIGITAL MENU & OFFERS"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
              />
            </div>

            {/* Custom Highlight Message */}
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-700">
                Offer / Highlight Line
              </label>
              <input
                type="text"
                value={customOffer}
                onChange={(e) => setCustomOffer(e.target.value)}
                placeholder="e.g. 10% OFF for Majh Boisar visitors!"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
              />
            </div>

            {/* Target Direct URL */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1 text-xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                QR Target Direct Link
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={targetUrl}
                  className="flex-1 bg-transparent text-[11px] font-bold text-slate-700 outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg cursor-pointer transition-colors shrink-0"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            
            {/* Print Standee Button */}
            <button
              onClick={handlePrint}
              className={`w-full ${theme.btnBg} font-black text-xs py-3 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Standee (A4 / Tabletop)</span>
            </button>

            {/* Quick Share Grid */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={qrImageUrl}
                download={`${business.name.replace(/\s+/g, '_')}_QR_Standee.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl text-center border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>

              <button
                onClick={handleShareWhatsApp}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2 rounded-xl text-center shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium">
              💡 Tip: Print on Glossy Photo Paper &amp; put in an Acrylic Table Standee for your counter.
            </p>

          </div>

        </div>

      </div>

      {/* Embedded Print CSS for Clean A4 / Standee Printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-standee, #printable-standee * {
            visibility: visible !important;
          }
          #printable-standee {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            margin: auto !important;
            width: 100% !important;
            max-width: 480px !important;
            border: 3px solid #0f172a !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

    </div>
  );
}
