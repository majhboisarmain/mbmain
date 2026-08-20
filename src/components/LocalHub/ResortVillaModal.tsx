'use client';

import React, { useState } from 'react';
import { 
  X, MapPin, Phone, MessageCircle, Star, Users, Calendar, 
  CheckCircle2, Sparkles, Waves, Compass, Filter, Share2, 
  ChevronLeft, ChevronRight, Info, ShieldCheck, Heart
} from 'lucide-react';
import { resortsData, ResortVilla } from '@/lib/resortsData';
import { useApp } from '@/context/AppContext';

interface ResortVillaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResortVillaModal({ isOpen, onClose }: ResortVillaModalProps) {
  const { showToast, isLoggedIn, setLoginModalOpen } = useApp();

  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedResort, setSelectedResort] = useState<ResortVilla | null>(null);

  // Booking Form State inside Detail View
  const [stayType, setStayType] = useState<'night' | 'day'>('night');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [checkInDate, setCheckInDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen) return null;

  const filteredResorts = resortsData.filter(item => {
    const matchArea = selectedArea === 'All' || item.area.includes(selectedArea);
    const matchType = selectedType === 'All' || item.type === selectedType;
    return matchArea && matchType;
  });

  const handleOpenDetail = (resort: ResortVilla) => {
    setSelectedResort(resort);
    setActivePhotoIdx(0);
    setBookingSuccess(false);
  };

  const handleShare = (resort: ResortVilla) => {
    if (navigator.share) {
      navigator.share({
        title: `${resort.name} - Majh Boisar Resorts`,
        text: `Check out ${resort.name} in ${resort.location}. Private pool, beach access & weekend packages available!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/resorts#${resort.slug}`);
      showToast('🔗 Link copied to clipboard!', 'success');
    }
  };

  const handleWhatsAppBooking = (resort: ResortVilla) => {
    const text = encodeURIComponent(
      `Hello! I want to book *${resort.name}* (${resort.location}) via MajhBoisar.\n\n` +
      `📅 *Stay Plan:* ${stayType === 'night' ? 'Overnight Stay' : 'Full-Day Picnic'}\n` +
      `🗓️ *Date:* ${checkInDate}\n` +
      `👥 *Guests:* ${guestCount} People\n` +
      (guestName ? `👤 *Name:* ${guestName}\n` : '') +
      `Please share availability, discount offers and payment details.`
    );
    window.open(`https://wa.me/${resort.whatsapp}?text=${text}`, '_blank');
  };

  const handleConfirmBookingPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhone || guestPhone.replace(/\D/g, '').length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setBookingSuccess(true);
    showToast(`🎉 Reservation Inquiry Sent for ${selectedResort?.name}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] text-left">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-950 text-white p-4 sm:p-6 shrink-0 relative flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 text-slate-950" /> Luxury Weekend Stays
              </span>
              <span className="bg-white/15 backdrop-blur-xs text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                Boisar · Kelwa · Dahanu · Manor
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-white">
              <span>🌴 Resorts &amp; Private Pool Villas</span>
            </h2>
            <p className="text-xs text-teal-200/90 font-medium">
              Book Beachfront Resorts, Private Farmhouses &amp; Family Pool Stays with Direct Owner Pricing
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        {!selectedResort ? (
          /* ============================================================== */
          /* VIEW 1: RESORT LISTINGS & FILTER DISCOVERY                      */
          /* ============================================================== */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-3">
              {/* Type Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-teal-700" /> Type:
                </span>
                {[
                  { id: 'All', label: 'All Properties' },
                  { id: 'Private Pool Villa', label: '🏊 Pool Villas' },
                  { id: 'Beach Resort', label: '🏖️ Beach Resorts' },
                  { id: 'Luxury Farmhouse', label: '🌴 Farmhouses' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      selectedType === type.id
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Location Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-200/60 pt-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Location:
                </span>
                {[
                  'All',
                  'Kelwa Beach',
                  'Boisar',
                  'Dahanu',
                  'Manor / Palghar'
                ].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setSelectedArea(loc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedArea === loc
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-200/70 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
              <span>Showing {filteredResorts.length} Verified Resorts &amp; Villas</span>
              <span className="text-teal-700 font-extrabold flex items-center gap-1">
                ✓ 100% Direct Owner Connect · ₹0 Commission
              </span>
            </div>

            {/* Resort Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredResorts.map(resort => (
                <div
                  key={resort.id}
                  onClick={() => handleOpenDetail(resort)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
                >
                  {/* Photo Container with Overlay Badges */}
                  <div className="relative aspect-[16/9.5] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={resort.gallery[0]}
                      alt={resort.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
                      {resort.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md uppercase tracking-wider">
                          {resort.badge}
                        </span>
                      )}
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-lg uppercase">
                        {resort.type}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>{resort.rating}</span>
                        <span className="text-emerald-100 text-[9.5px]">({resort.reviewsCount})</span>
                      </span>
                    </div>

                    {/* Distance Pill Bottom Left */}
                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="bg-slate-950/80 backdrop-blur-xs text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Compass className="w-3 h-3 text-cyan-400" />
                        <span>{resort.distanceFromBoisar}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Info Section */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                        {resort.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{resort.location}</span>
                      </p>
                      <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                        {resort.tagline}
                      </p>
                    </div>

                    {/* Amenities Preview */}
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      {resort.amenities.slice(0, 4).map((amenity, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-1.5 truncate">
                          <span>{amenity.icon}</span>
                          <span className="truncate">{amenity.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing & CTA Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Starts From</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black text-slate-950">₹{resort.pricePerNight.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">/ night</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppBooking(resort);
                          }}
                          className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="WhatsApp Booking"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(resort)}
                          className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
                        >
                          <span>View &amp; Book</span>
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        ) : (
          /* ============================================================== */
          /* VIEW 2: RESORT & VILLA FULL DETAIL & INSTANT BOOKING VIEW      */
          /* ============================================================== */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Back Navigation Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedResort(null)}
                className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to All Resorts
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(selectedResort)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>

            {/* Photo Gallery Viewer */}
            <div className="space-y-2">
              <div className="relative aspect-[16/9] w-full max-h-[360px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-200">
                <img
                  src={selectedResort.gallery[activePhotoIdx] || selectedResort.gallery[0]}
                  alt={selectedResort.name}
                  className="w-full h-full object-cover"
                />

                {/* Badges on detail photo */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
                  {selectedResort.badge && (
                    <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-xl shadow-md">
                      {selectedResort.badge}
                    </span>
                  )}
                  <span className="bg-slate-900/85 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-xl">
                    {selectedResort.type}
                  </span>
                </div>

                {/* Left/Right Carousel Controls */}
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx(prev => (prev === 0 ? selectedResort.gallery.length - 1 : prev - 1))}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx(prev => (prev === selectedResort.gallery.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnails Row */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {selectedResort.gallery.map((thumb, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 bg-slate-100 ${
                      activePhotoIdx === idx ? 'border-teal-600 ring-2 ring-teal-600/30' : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Details & Booking Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left 7 Columns: Information, Amenities & Highlights */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Header Title Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{selectedResort.rating}</span>
                      <span className="text-emerald-100">({selectedResort.reviewsCount} reviews)</span>
                    </span>
                    <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{selectedResort.distanceFromBoisar}</span>
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {selectedResort.name}
                  </h1>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedResort.address}</span>
                  </p>

                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-teal-700" />
                      <span>{selectedResort.capacity}</span>
                    </span>
                    <span>•</span>
                    <span>🛏️ {selectedResort.bedrooms} Bedrooms</span>
                    <span>•</span>
                    <span>🚿 {selectedResort.bathrooms} Bathrooms</span>
                  </div>
                </div>

                {/* About Description */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-teal-700">
                    <Info className="w-4 h-4" /> About This Stay
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedResort.description}
                  </p>
                </div>

                {/* All Amenities */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Amenities &amp; Features ({selectedResort.amenities.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {selectedResort.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                        <span className="text-base">{amenity.icon}</span>
                        <span className="truncate">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-2.5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-emerald-700">
                    ✨ Property Highlights
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedResort.highlights.map((high, idx) => (
                      <li key={idx} className="text-xs text-slate-700 font-bold flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{high}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meal & Dining Options */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl space-y-1.5">
                  <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    🍽️ Food &amp; Dining
                  </h3>
                  <p className="text-xs text-amber-900 font-medium leading-relaxed">
                    {selectedResort.mealOptions}
                  </p>
                </div>

                {/* House Rules */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700" /> House Rules &amp; Policies
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <strong>Check-in:</strong> {selectedResort.checkInTime} | <strong>Check-out:</strong> {selectedResort.checkOutTime}
                    </div>
                    {selectedResort.houseRules.map((rule, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-1.5">
                        <span className="text-teal-700 font-black">✓</span> {rule}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right 5 Columns: Direct Booking & Fast Pass Inquiry Box */}
              <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-4">
                
                <div className="bg-white rounded-3xl border-2 border-teal-600/30 p-5 shadow-xl space-y-4">
                  
                  {/* Pricing Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Direct Stay Rate</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-950">
                          ₹{stayType === 'night' ? selectedResort.pricePerNight.toLocaleString('en-IN') : (selectedResort.dayPicnicPrice ? (selectedResort.dayPicnicPrice * guestCount).toLocaleString('en-IN') : selectedResort.pricePerNight.toLocaleString('en-IN'))}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {stayType === 'night' ? '/ night' : `for ${guestCount} guests (day package)`}
                        </span>
                      </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-1 rounded-lg">
                      0% Commission
                    </span>
                  </div>

                  {/* Plan Switcher (Overnight vs Day Picnic) */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setStayType('night')}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        stayType === 'night' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🌙 Overnight Stay
                    </button>

                    <button
                      type="button"
                      onClick={() => setStayType('day')}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        stayType === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ☀️ Day Picnic (Buffet)
                    </button>
                  </div>

                  {/* Form Inputs */}
                  <form onSubmit={handleConfirmBookingPass} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Check-in Date*
                      </label>
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Total Guests ({guestCount} People)*
                      </label>
                      <div className="flex items-center gap-2">
                        {[2, 4, 8, 12, 20].map(count => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setGuestCount(count)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                              guestCount === count ? 'bg-teal-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {count}+
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Your Mobile Number*
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none focus:border-teal-600 focus:bg-white placeholder:text-slate-400"
                      />
                    </div>

                    {bookingSuccess ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                        <div className="text-xs font-black text-emerald-900 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inquiry Confirmed!
                        </div>
                        <p className="text-[11px] text-emerald-800 font-medium">
                          The manager has received your inquiry. Connect on WhatsApp below for fast confirmation.
                        </p>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-98"
                      >
                        Request Reservation Pass
                      </button>
                    )}
                  </form>

                  {/* Direct Contact CTAs */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppBooking(selectedResort)}
                      className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant WhatsApp Booking</span>
                    </button>

                    <a
                      href={`tel:${selectedResort.phone}`}
                      className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center gap-2 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-700" />
                      <span>Call Property Manager (+91 {selectedResort.phone})</span>
                    </a>
                  </div>

                  <p className="text-[10px] text-center text-slate-400 font-semibold">
                    🔒 Guaranteed Best Direct Rates · No Booking Convenience Fees
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
