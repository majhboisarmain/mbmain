'use client';

import React, { useState, useEffect } from 'react';
import { SPORTS_TURFS, GAME_ZONES, INITIAL_TURF_BOOKINGS, SportsTurf, GameZone, TurfBookingRecord } from '@/lib/localData';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Trophy, Gamepad2, X, Phone, MessageSquare, MapPin, Clock, Calendar, CheckCircle2, ArrowLeft, User, Shield, Lock, Check, Plus, ImageIcon } from 'lucide-react';

interface SportsTurfModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'turf' | 'game';
}

interface BookingTarget {
  name: string;
  category: string;
  phone: string;
  location: string;
  hourlyRate: string;
}

export default function SportsTurfModal({ isOpen, onClose, defaultTab = 'game' }: SportsTurfModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen, hasRegisteredBusiness } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<'turf' | 'game'>(defaultTab);
  const [mode, setMode] = useState<'user' | 'owner'>('user');

  React.useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  const [allBookings, setAllBookings] = useState<TurfBookingRecord[]>(INITIAL_TURF_BOOKINGS);
  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingTarget | null>(null);
  const [selectedStation, setSelectedStation] = useState('Screen 1');
  const [slotPrices, setSlotPrices] = useState<Record<string, string>>({});
  const [slotControls, setSlotControls] = useState<Record<string, string>>({});

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('06:00 PM - 07:00 PM (Evening Prime)');
  const [duration, setDuration] = useState('1 Hour');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [refCode, setRefCode] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    venueName: '',
    category: 'VR & Arcade Gaming',
    hourlyRate: '',
    location: '',
    timing: '',
    features: '',
    imageName: '',
    imageBase64: ''
  });
  const [dynamicTurfs, setDynamicTurfs] = useState<SportsTurf[]>([]);
  const [dynamicGames, setDynamicGames] = useState<GameZone[]>([]);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    try {
      const pRaw = localStorage.getItem('majh_boisar_turf_slot_prices');
      if (pRaw) setSlotPrices(JSON.parse(pRaw));
      const cRaw = localStorage.getItem('majh_boisar_turf_slot_controls');
      if (cRaw) setSlotControls(JSON.parse(cRaw));
      const bRaw = localStorage.getItem('majh_boisar_turf_bookings');
      if (bRaw) {
        const parsed = JSON.parse(bRaw);
        if (Array.isArray(parsed) && parsed.length > 0) setAllBookings(parsed);
      }
    } catch(e){}

    let customTurfs: SportsTurf[] = [];
    let customGames: GameZone[] = [];

    // 1. Read user-added special offers/rates from localStorage
    try {
      const savedOffers = localStorage.getItem('majh_boisar_user_special_offers');
      if (savedOffers) {
        const parsed = JSON.parse(savedOffers);
        if (Array.isArray(parsed)) {
          parsed.forEach((off, idx) => {
            const cat = (off.category || '').toLowerCase();
            const title = (off.title || off.shopName || '').toLowerCase();
            const isGameCat = cat.includes('vr') || cat.includes('game') || cat.includes('snooker') || cat.includes('arcade') || title.includes('game') || title.includes('ps5');

            if (isGameCat) {
              customGames.push({
                id: `custom-game-${off.id || idx}`,
                name: off.shopName || off.title || 'Local Game Zone',
                category: off.category || 'VR & PS5 Gaming',
                hourlyRate: off.discount || off.hourlyRate || '₹200/hr',
                location: off.location || 'Boisar West',
                phone: off.phone || '8208712398',
                timing: off.timing || '10:00 AM - 10:00 PM',
                features: off.title || 'High-end gaming rigs & VR simulators.',
                image: off.image || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80'
              });
            } else {
              customTurfs.push({
                id: `custom-turf-${off.id || idx}`,
                name: off.shopName || off.title || 'Local Sports Turf',
                sport: off.category || 'Box Cricket & Football',
                hourlyRate: off.discount || off.hourlyRate || '₹800/hr',
                location: off.location || 'Boisar West',
                phone: off.phone || '8208712398',
                timing: off.timing || '06:00 AM - 11:00 PM',
                features: off.title || 'Night floodlights & premium artificial turf.',
                image: off.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80'
              });
            }
          });
        }
      }
    } catch (e) {}

    // 2. Fetch registered businesses from API
    fetch('/api/businesses?showAll=true')
      .then(res => res.json())
      .then(data => {
        const bizList = Array.isArray(data) ? data : data.businesses || [];
        const turfBiz = bizList.filter((b: any) => {
          const cat = (b.category || '').toLowerCase();
          const name = (b.name || '').toLowerCase();
          return cat.includes('turf') || cat.includes('game') || cat.includes('sports') || name.includes('turf') || name.includes('game zone');
        });

        turfBiz.forEach((b: any) => {
          const cat = (b.category || '').toLowerCase();
          const name = (b.name || '').toLowerCase();
          const isGame = cat.includes('game') || cat.includes('vr') || cat.includes('snooker') || name.includes('game zone') || name.includes('ps5');

          if (isGame) {
            if (!customGames.some(g => g.name === b.name)) {
              customGames.push({
                id: `biz-game-${b.id}`,
                name: b.name,
                category: b.category || 'VR & Game Zone',
                hourlyRate: '₹200/hr',
                location: b.location || 'Boisar West',
                phone: b.phone || '7769947217',
                timing: b.workingHours || '10:00 AM - 10:00 PM',
                features: b.description || 'Verified local game zone venue in Boisar.',
                image: b.image || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80'
              });
            }
          } else {
            if (!customTurfs.some(t => t.name === b.name)) {
              customTurfs.push({
                id: `biz-turf-${b.id}`,
                name: b.name,
                sport: b.category || 'Box Cricket & Football',
                hourlyRate: '₹800/hr',
                location: b.location || 'Boisar West',
                phone: b.phone || '7769947217',
                timing: b.workingHours || '06:00 AM - 11:00 PM',
                features: b.description || 'Verified local sports turf venue in Boisar.',
                image: b.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80'
              });
            }
          }
        });

        setDynamicTurfs(customTurfs);
        setDynamicGames(customGames);
      })
      .catch(() => {
        setDynamicTurfs(customTurfs);
        setDynamicGames(customGames);
      });
  }, [isOpen]);

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

  const allTurfsList = [...SPORTS_TURFS, ...dynamicTurfs];
  const allGamesList = [...GAME_ZONES, ...dynamicGames];

  if (!isOpen) return null;

  const userLoggedInPhone = loggedInUser?.phone?.replace(/\D/g, '') || '';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, imageBase64: ev.target?.result as string, imageName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleSubmitTurf = () => {
    if (!form.venueName || !form.location) return;
    const msg = `Hello, I want to list my Turf/Game Zone on Majh Boisar:%0AVenue: ${form.venueName}%0ACategory: ${form.category}%0ALocation: ${form.location}%0APhone: ${userLoggedInPhone}%0AHourly Rate: ${form.hourlyRate}%0ATiming: ${form.timing}%0AFeatures: ${form.features}${form.imageName ? `%0APhoto: ${form.imageName}` : ''}`;
    window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddForm(false);
      setForm({ venueName: '', category: 'Box Cricket & Football', hourlyRate: '', location: '', timing: '', features: '', imageName: '', imageBase64: '' });
    }, 3000);
  };

  const handleRegister = () => {
    onClose();
    if (!isLoggedIn) { setLoginModalOpen(true); return; }
    if (hasRegisteredBusiness) {
      router.push('/dashboard?tab=catalog');
    } else {
      router.push('/dashboard');
    }
  };

  const isSlotClosed = (slot: string, station: string) => {
    const cleanSlot = slot.split(' (')[0];
    const key = `${station}_${cleanSlot}`;
    return slotControls[key] === 'Closed' || slotControls[cleanSlot] === 'Closed';
  };

  const getSlotPrice = (slot: string, station: string, defaultRate: string) => {
    const cleanSlot = slot.split(' (')[0];
    const key = `${station}_${cleanSlot}`;
    return slotPrices[key] || slotPrices[cleanSlot] || defaultRate;
  };

  const isSlotBooked = (venueName: string, date: string, slot: string, station: string) => {
    const cleanSlot = slot.split(' (')[0].trim();
    return allBookings.some(b => {
      if (b.status === 'Cancelled') return false;
      if (b.venueName && b.venueName !== venueName) return false;

      const bSlot = (b.timeSlot || '').split(' (')[0].trim();
      const slotMatches = bSlot === cleanSlot || cleanSlot.includes(bSlot) || bSlot.includes(cleanSlot);
      if (!slotMatches) return false;

      if (b.station) {
        const bStat = b.station.toLowerCase();
        const curStat = station.toLowerCase();
        return bStat.includes(curStat) || curStat.includes(bStat);
      }
      return false;
    });
  };

  const handleStartBooking = (item: BookingTarget) => {
    setSelectedBookingItem(item);
    setIsConfirmed(false);
    const cat = (item.category || '').toLowerCase();
    const isGame = cat.includes('game') || cat.includes('vr') || cat.includes('ps5') || cat.includes('snooker') || tab === 'game';
    setSelectedStation(isGame ? 'Screen 1' : 'Main Court A');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingItem) return;

    const randomRef = 'MB-SLOT-' + Math.floor(1000 + Math.random() * 9000);
    setRefCode(randomRef);

    const cleanSlot = timeSlot.split(' (')[0];
    const finalPrice = getSlotPrice(cleanSlot, selectedStation, selectedBookingItem.hourlyRate);

    const newRecord: TurfBookingRecord = {
      id: 'tb-' + Date.now(),
      refCode: randomRef,
      venueName: selectedBookingItem.name,
      category: selectedBookingItem.category,
      station: selectedStation,
      userName: userName || 'Local Player',
      userPhone: userPhone || 'N/A',
      bookingDate: bookingDate,
      timeSlot: cleanSlot,
      duration: duration,
      estRate: finalPrice,
      status: 'Confirmed',
      createdAt: 'Just now'
    };

    setAllBookings(prev => {
      const updated = [newRecord, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_turf_bookings', JSON.stringify(updated));
      }
      return updated;
    });
    setIsConfirmed(true);

    const waText = `Hello *${selectedBookingItem.name}*, I want to reserve a slot via Majh Boisar!

📌 *Booking Details:*
• *Booking Ref:* ${randomRef}
• *Venue:* ${selectedBookingItem.name}
• *Station / Screen:* ${selectedStation}
• *Sport / Game:* ${selectedBookingItem.category}
• *Name:* ${userName || 'Local Player'}
• *Phone:* ${userPhone || 'N/A'}
• *Date:* ${bookingDate}
• *Time Slot:* ${cleanSlot}
• *Duration:* ${duration}
• *Rate:* ${finalPrice}

Please confirm slot availability. Thank you!`;

    const waUrl = `https://wa.me/91${selectedBookingItem.phone}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  const handleToggleAttendance = (bookingId: string) => {
    setAllBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const nextStatus = b.status === 'Confirmed' ? 'Attended / Visited' : 'Confirmed';
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const handleResetModal = () => {
    setSelectedBookingItem(null);
    setIsConfirmed(false);
  };

  const handleCloseAll = () => {
    handleResetModal();
    onClose();
  };

  const AVAILABLE_TIME_SLOTS = [
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM'
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col text-left">
        
        {/* Close Button */}
        <button
          onClick={handleCloseAll}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2.5 mb-3 shrink-0 pr-8 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Trophy className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Sports Turfs &amp; Gaming
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Live turf slot status &amp; instant booking
              </p>
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0 ml-auto"
          >
            <span>List Venue</span>
          </button>
        </div>

        {/* PLAYER / VENUE VIEW */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* BOOKING FORM */}
            {selectedBookingItem && !isConfirmed && (
              <div className="flex-1 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedBookingItem(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Venues</span>
                </button>

                <div className="bg-purple-50/60 border border-purple-200/90 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="bg-purple-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                      {selectedBookingItem.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-1">
                      {selectedBookingItem.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {selectedBookingItem.location} • {selectedBookingItem.hourlyRate}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" /> Enter Booking Information
                  </h4>

                  {/* Select Console Screen / Court Station */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1">
                      {(selectedBookingItem.category || '').toLowerCase().includes('game') || (selectedBookingItem.category || '').toLowerCase().includes('vr') || (selectedBookingItem.name || '').toLowerCase().includes('game') || (selectedBookingItem.name || '').toLowerCase().includes('ps5') || tab === 'game'
                        ? 'Select Gaming Station / Screen *'
                        : 'Select Turf Court *'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(selectedBookingItem.category || '').toLowerCase().includes('game') || (selectedBookingItem.category || '').toLowerCase().includes('vr') || (selectedBookingItem.name || '').toLowerCase().includes('game') || (selectedBookingItem.name || '').toLowerCase().includes('ps5') || tab === 'game' ? (
                        (['Screen 1', 'Screen 2', 'Screen 3'] as const).map(scr => (
                          <button
                            key={scr}
                            type="button"
                            onClick={() => setSelectedStation(scr)}
                            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                              selectedStation === scr
                                ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Gamepad2 className="w-3.5 h-3.5" />
                            <span>🎮 {scr}</span>
                          </button>
                        ))
                      ) : (
                        (['Main Court A', 'Court B'] as const).map(court => (
                          <button
                            key={court}
                            type="button"
                            onClick={() => setSelectedStation(court)}
                            className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                              selectedStation === court
                                ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Trophy className="w-3.5 h-3.5" />
                            <span>🏟️ {court}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">WhatsApp Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9820012345"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">Select Booking Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-purple-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">Select Duration *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['1 Hour', '2 Hours', '3 Hours'].map(d => (
                          <button
                            type="button"
                            key={d}
                            onClick={() => setDuration(d)}
                            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                              duration === d
                                ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                        <span>Live Slot Status ({selectedStation} • {bookingDate}) *</span>
                      </label>
                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 🟢 Open
                        </span>
                        <span className="flex items-center gap-1 text-rose-700">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span> 🔴 Booked
                        </span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span> 🔒 Blocked
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AVAILABLE_TIME_SLOTS.map(slot => {
                        const cleanSlot = slot.split(' (')[0];
                        const isClosed = isSlotClosed(slot, selectedStation);
                        const booked = isSlotBooked(selectedBookingItem.name, bookingDate, cleanSlot, selectedStation);
                        const isSelected = timeSlot === slot || timeSlot === cleanSlot;
                        const price = getSlotPrice(cleanSlot, selectedStation, selectedBookingItem.hourlyRate);

                        const isUnavailable = booked || isClosed;

                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isUnavailable}
                            onClick={() => !isUnavailable && setTimeSlot(slot)}
                            className={`p-2.5 rounded-xl text-left text-[11px] font-black transition-all border flex flex-col justify-between ${
                              isClosed
                                ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-65'
                                : booked
                                ? 'bg-rose-50/80 border-rose-200 text-rose-400 cursor-not-allowed opacity-75'
                                : isSelected
                                ? 'bg-purple-700 text-white border-purple-700 shadow-2xs cursor-pointer'
                                : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] opacity-90 font-black">
                                {isClosed ? '🔒 CLOSED' : booked ? '🔴 BOOKED' : isSelected ? '✓ SELECTED' : '🟢 OPEN'}
                              </span>
                              <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-900'
                              }`}>
                                {price}
                              </span>
                            </div>
                            <span className="block leading-snug">
                              <Clock className="w-3 h-3 inline mr-1 opacity-80" />
                              {slot}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingItem(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Confirm &amp; Request Slot on WhatsApp</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CONFIRMATION SCREEN */}
            {selectedBookingItem && isConfirmed && (
              <div className="flex-1 overflow-y-auto pr-1 text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Booking Ref: {refCode}
                </span>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                  Slot Reserved &amp; Locked!
                </h3>
                <p className="text-xs text-slate-500 font-bold max-w-md mx-auto mt-1">
                  Your slot for <span className="text-purple-700 font-black">{selectedBookingItem.name}</span> is now reserved &amp; marked as <strong className="text-rose-600">🔴 BOOKED</strong> in the live system.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto my-5 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-200/80 pb-2">
                    <span>Player Name:</span>
                    <span className="font-black text-slate-900">{userName || 'Local Player'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-200/80 pb-2">
                    <span>Booking Date:</span>
                    <span className="font-black text-slate-900">{bookingDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b border-slate-200/80 pb-2">
                    <span>Time Slot:</span>
                    <span className="font-black text-purple-700">{timeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Status:</span>
                    <span className="font-black text-emerald-600">🟢 Saved in System</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleResetModal}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Book Another Slot
                  </button>

                  <button
                    onClick={handleCloseAll}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}

            {/* VENUES LIST (1 Column on Mobile, 2 on Tablet, 3 on Desktop) */}
            {!selectedBookingItem && (
              <>
                <div className="flex items-center gap-2 mb-3 bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setTab('turf')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      tab === 'turf' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Sports Turfs ({allTurfsList.length})</span>
                  </button>

                  <button
                    onClick={() => setTab('game')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      tab === 'game' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Game Zones &amp; PS5 ({allGamesList.length})</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {tab === 'turf' ? (
                      allTurfsList.map(turf => (
                        <div
                          key={turf.id}
                          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
                        >
                          <div className="w-full h-44 sm:h-48 bg-slate-950 relative overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={turf.image}
                              alt={turf.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="bg-purple-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                                {turf.sport}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="bg-slate-950/80 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                {turf.hourlyRate}
                              </span>
                            </div>
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1 line-clamp-1">
                                {turf.name}
                              </h4>

                              <p className="text-[10px] text-slate-500 font-medium leading-normal line-clamp-2 mb-2">
                                {turf.features}
                              </p>

                              <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                                <span className="flex items-center gap-1 truncate">
                                  <Clock className="w-3 h-3 text-purple-600 shrink-0" /> {turf.timing}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {turf.location}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                              <a
                                href={`tel:${turf.phone}`}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </a>

                              <button
                                onClick={() => handleStartBooking({
                                  name: turf.name,
                                  category: turf.sport,
                                  phone: turf.phone,
                                  location: turf.location,
                                  hourlyRate: turf.hourlyRate
                                })}
                                className="flex-1 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Book Slot</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      allGamesList.map(game => (
                        <div
                          key={game.id}
                          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
                        >
                          <div className="w-full h-44 sm:h-48 bg-slate-950 relative overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={game.image}
                              alt={game.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                                🎮 {game.category}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                {game.hourlyRate}
                              </span>
                            </div>
                          </div>

                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1 line-clamp-1">
                                {game.name}
                              </h4>

                              <p className="text-[10px] text-slate-500 font-medium leading-normal line-clamp-2 mb-2">
                                {game.features}
                              </p>

                              <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                                <span className="flex items-center gap-1 truncate">
                                  <Clock className="w-3 h-3 text-purple-600 shrink-0" /> {game.timing}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {game.location}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                              <a
                                href={`tel:${game.phone}`}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Call</span>
                              </a>

                              <button
                                onClick={() => handleStartBooking({
                                  name: game.name,
                                  category: game.category,
                                  phone: game.phone,
                                  location: game.location,
                                  hourlyRate: game.hourlyRate
                                })}
                                className="flex-1 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Book Slot</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {((tab === 'turf' && allTurfsList.length === 0) || (tab === 'game' && allGamesList.length === 0)) && (
                      <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                        <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h4 className="text-sm font-black text-slate-700">No {tab === 'turf' ? 'Sports Turfs' : 'Game Zones'} Registered Yet</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Local turf owners & game zone hubs in Boisar will list here soon.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

