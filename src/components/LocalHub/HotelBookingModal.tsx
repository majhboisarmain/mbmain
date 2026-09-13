'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { calculateStayWindow, getAllHotels, normalizeHotelAmenity } from '@/lib/hotelsData';
import HotelTimePicker from '@/components/HotelTimePicker';
import { 
  Building2, 
  X, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Plus, 
  Users, 
  BedDouble, 
  Wifi, 
  Coffee, 
  Tv, 
  Car, 
  HeartHandshake, 
  Info,
  ArrowRight,
  Send,
  SlidersHorizontal,
  ChevronRight,
  Check
} from 'lucide-react';

export interface HotelListing {
  id: string;
  name: string;
  category: 'Luxury' | 'Executive' | 'Budget' | 'Boutique' | 'Residency';
  hourlyRate3h: number;
  hourlyRate6h: number;
  hourlyRate12h: number;
  nightRate: number;
  rating: number;
  reviewsCount: number;
  location: string;
  address: string;
  phone: string;
  whatsapp: string;
  image: string;
  amenities: string[];
  isCoupleFriendly: boolean;
  isHourlyFriendly: boolean;
  nearStation: boolean;
  nearMidc: boolean;
  description: string;
}

// All demo hotels removed — real hotels loaded dynamically
export const INITIAL_HOTELS: HotelListing[] = [];


interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHotelId?: string;
}

export default function HotelBookingModal({ isOpen, onClose, initialHotelId }: HotelBookingModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen, hasRegisteredBusiness } = useApp();
  const router = useRouter();

  // Active view: 'browse' | 'book' | 'list_hotel' | 'success'
  const [view, setView] = useState<'browse' | 'book' | 'list_hotel' | 'success'>('browse');
  
  // Filters
  const [activeFilter, setActiveFilter] = useState<'All' | 'Hourly' | 'Couple' | 'Luxury' | 'Budget' | 'Station' | 'MIDC'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected hotel for booking
  const [selectedHotel, setSelectedHotel] = useState<HotelListing | null>(null);

  // Booking Form States
  const [stayType, setStayType] = useState<'hourly' | 'night'>('hourly');
  const [hourlyDuration, setHourlyDuration] = useState<'3h' | '6h' | '12h'>('3h');
  const [checkInTime, setCheckInTime] = useState('11:00 AM');
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [roomCategory, setRoomCategory] = useState('Deluxe AC Room');
  
  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [specialRequest, setSpecialRequest] = useState('');
  const [confirmedBookingRef, setConfirmedBookingRef] = useState('');

  // Hoteliers: Add Hotel Form
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCategory, setNewHotelCategory] = useState<'Luxury' | 'Executive' | 'Budget' | 'Boutique' | 'Residency'>('Executive');
  const [newHotelLocation, setNewHotelLocation] = useState('');
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelPhone, setNewHotelPhone] = useState('');
  const [newHotelWhatsapp, setNewHotelWhatsapp] = useState('');
  const [newHotelHourly3h, setNewHotelHourly3h] = useState('499');
  const [newHotelHourly6h, setNewHotelHourly6h] = useState('799');
  const [newHotelNightRate, setNewHotelNightRate] = useState('1499');
  const [newHotelAmenities, setNewHotelAmenities] = useState<string[]>(['AC Deluxe', 'Free Wi-Fi', 'Couple Friendly']);
  const [newHotelImage, setNewHotelImage] = useState('');
  const [newHotelDesc, setNewHotelDesc] = useState('');

  // Load all live hotels from hotelsData & custom hotels
  const loadMergedHotels = (): HotelListing[] => {
    try {
      const allLive = getAllHotels();
      const mappedLive: HotelListing[] = allLive.map(h => ({
        id: h.id || h.slug,
        name: h.name,
        category: (h.category as any) || 'Executive',
        hourlyRate3h: h.hourlyRate3h || 499,
        hourlyRate6h: h.hourlyRate6h || 799,
        hourlyRate12h: h.hourlyRate12h || 1199,
        nightRate: h.nightRate || 1499,
        rating: h.rating || 4.5,
        reviewsCount: h.reviewsCount || 50,
        location: h.location || 'Boisar',
        address: h.address || `${h.location}, Boisar`,
        phone: h.phone,
        whatsapp: h.whatsapp || h.phone,
        image: (h.gallery && h.gallery.length > 0) ? h.gallery[0] : (h as any).image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        amenities: (h.amenities || []).map((a: any) => typeof a === 'string' ? a : a.name),
        isCoupleFriendly: h.isCoupleFriendly ?? true,
        isHourlyFriendly: h.offersHourly !== false,
        nearStation: Boolean(h.nearStation),
        nearMidc: Boolean(h.nearMidc),
        description: h.description || h.tagline || ''
      }));

      const liveNames = new Set(mappedLive.map(h => h.name.toLowerCase().trim()));
      const extraInitials = INITIAL_HOTELS.filter(h => !liveNames.has(h.name.toLowerCase().trim()));
      return [...mappedLive, ...extraInitials];
    } catch (e) {
      return INITIAL_HOTELS;
    }
  };

  // User listed custom hotels synced with live data
  const [hotelList, setHotelList] = useState<HotelListing[]>(() => {
    if (typeof window !== 'undefined') {
      return loadMergedHotels();
    }
    return INITIAL_HOTELS;
  });

  // Sync user info and live hotels on open
  useEffect(() => {
    const refreshModalHotels = () => {
      const updated = loadMergedHotels();
      setHotelList(updated);
      return updated;
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (loggedInUser) {
        setGuestName(prev => prev || loggedInUser.name || '');
        setGuestPhone(prev => prev || loggedInUser.phone || '');
      }

      const currentList = refreshModalHotels();

      if (initialHotelId) {
        const cleanTargetId = initialHotelId.toLowerCase().trim();
        const target = currentList.find(h => 
          h.id.toLowerCase().trim() === cleanTargetId || 
          h.name.toLowerCase().trim() === cleanTargetId ||
          h.name.toLowerCase().replace(/\s+/g, '-') === cleanTargetId
        );
        if (target) {
          setSelectedHotel(target);
          setView('book');
        }
      }
    } else {
      document.body.style.overflow = '';
      setView('browse');
      setSelectedHotel(null);
    }

    const handleCustomUpdate = () => {
      refreshModalHotels();
    };

    window.addEventListener('storage', refreshModalHotels);
    window.addEventListener('majh_boisar_hotel_updated', handleCustomUpdate);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('storage', refreshModalHotels);
      window.removeEventListener('majh_boisar_hotel_updated', handleCustomUpdate);
    };
  }, [isOpen, initialHotelId, loggedInUser]);

  // Filtered Hotels
  const filteredHotels = useMemo(() => {
    return hotelList.filter(h => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        h.name.toLowerCase().includes(q) || 
        h.location.toLowerCase().includes(q) || 
        h.address.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q);

      // Filter Pill
      let matchesFilter = true;
      if (activeFilter === 'Hourly') matchesFilter = h.isHourlyFriendly;
      else if (activeFilter === 'Couple') matchesFilter = h.isCoupleFriendly;
      else if (activeFilter === 'Luxury') matchesFilter = h.category === 'Luxury' || h.category === 'Executive';
      else if (activeFilter === 'Budget') matchesFilter = h.hourlyRate3h <= 400 || h.nightRate <= 1200;
      else if (activeFilter === 'Station') matchesFilter = h.nearStation;
      else if (activeFilter === 'MIDC') matchesFilter = h.nearMidc;

      return matchesSearch && matchesFilter;
    });
  }, [hotelList, searchQuery, activeFilter]);

  // Price Calculation
  const calculatedPrice = useMemo(() => {
    if (!selectedHotel) return 0;
    if (stayType === 'hourly') {
      if (hourlyDuration === '3h') return selectedHotel.hourlyRate3h * roomCount;
      if (hourlyDuration === '6h') return selectedHotel.hourlyRate6h * roomCount;
      return selectedHotel.hourlyRate12h * roomCount;
    } else {
      // Nightly calculation
      try {
        const d1 = new Date(checkInDate);
        const d2 = new Date(checkOutDate);
        const diffTime = Math.max(d2.getTime() - d1.getTime(), 86400000);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return selectedHotel.nightRate * diffDays * roomCount;
      } catch (e) {
        return selectedHotel.nightRate * roomCount;
      }
    }
  }, [selectedHotel, stayType, hourlyDuration, checkInDate, checkOutDate, roomCount]);

  if (!isOpen) return null;

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel) return;
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please enter your full name and 10-digit mobile number.');
      return;
    }

    const calculatedWindow = calculateStayWindow(checkInTime, hourlyDuration).fullWindowStr;
    const ref = `MB-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: ref,
      hotelId: selectedHotel.id,
      hotelName: selectedHotel.name,
      hotelPhone: selectedHotel.phone,
      hotelLocation: selectedHotel.location,
      guestName,
      guestPhone,
      idProofType,
      stayType,
      hourlyDuration: stayType === 'hourly' ? hourlyDuration : null,
      timeSlot: stayType === 'hourly' ? calculatedWindow : null,
      checkInDate,
      checkOutDate: stayType === 'night' ? checkOutDate : null,
      guestCount,
      roomCount,
      roomCategory,
      totalAmount: calculatedPrice,
      specialRequest,
      status: 'Confirmed & Sent to Hotel',
      createdAt: new Date().toLocaleString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify([newBooking, ...existing]));

      // Save to central PostgreSQL Database
      fetch('/api/hotel-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: (selectedHotel as any)?.id ? parseInt(String((selectedHotel as any).id).replace(/\D/g, '')) || null : null,
          hotelSlug: (selectedHotel as any)?.slug || selectedHotel.id,
          hotelName: selectedHotel.name,
          hotelPhone: selectedHotel.phone,
          hotelAddress: selectedHotel.address,
          guestName,
          guestPhone,
          roomCategory,
          stayType,
          timeSlot: stayType === 'hourly' ? `${hourlyDuration} (Check-in ${checkInTime})` : 'Night Stay',
          checkInDate,
          checkOutDate,
          totalAmount: calculatedPrice,
          notes: specialRequest
        })
      }).catch(e => console.error('[Hotel Booking DB Save Error]:', e));
    } catch (err) {
      console.error(err);
    }

    setConfirmedBookingRef(ref);
    setView('success');
  };

  // WhatsApp Message for Direct Booking
  const openWhatsAppBooking = (hotel: HotelListing) => {
    const targetPhone = hotel.whatsapp || hotel.phone || '917769947217';
    const text = encodeURIComponent(
      `Hello ${hotel.name},\nI want to book a room through Majh Boisar Hotel Booking portal.\n\n🏨 Hotel: ${hotel.name}\n📍 Location: ${hotel.location}\n⏰ Stay Type: Hourly 3-Hour / Day Stay or Night Stay\n📅 Date: Today / Upcoming\n👤 Guest Name: ${guestName || 'Customer'}\n\nPlease share current available room types and confirm instant check-in.`
    );
    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
  };

  // Handle Add New Hotel Submission
  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim() || !newHotelPhone.trim()) {
      alert('Please fill in Hotel Name and Contact Phone.');
      return;
    }

    const newHotel: any = {
      id: `custom-hotel-${Date.now()}`,
      name: newHotelName.trim(),
      category: newHotelCategory,
      hourlyRate3h: parseInt(newHotelHourly3h, 10) || 499,
      hourlyRate6h: parseInt(newHotelHourly6h, 10) || 799,
      hourlyRate12h: (parseInt(newHotelHourly6h, 10) || 799) + 400,
      nightRate: parseInt(newHotelNightRate, 10) || 1499,
      rating: 4.5,
      reviewsCount: 1,
      location: newHotelLocation || 'Boisar',
      address: newHotelAddress || 'Boisar, Palghar',
      phone: newHotelPhone,
      whatsapp: newHotelWhatsapp || newHotelPhone,
      image: newHotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      amenities: newHotelAmenities.length > 0 ? newHotelAmenities : ['AC Deluxe', 'Free Wi-Fi', 'Couple Friendly'],
      isCoupleFriendly: true,
      isHourlyFriendly: true,
      nearStation: newHotelLocation.toLowerCase().includes('station'),
      nearMidc: newHotelLocation.toLowerCase().includes('midc') || newHotelLocation.toLowerCase().includes('salwad'),
      description: newHotelDesc || 'Listed on Majh Boisar Hotel Directory. Verified rooms with flexible hourly & night stay rates.',
      status: 'Pending',
      verified: false,
      submittedAt: new Date().toISOString()
    };

    const updated = [newHotel, ...hotelList];
    setHotelList(updated);
    try {
      // Save to local storage for instant fallback
      const savedV2 = JSON.parse(localStorage.getItem('majh_boisar_custom_hotels_v2') || '[]');
      localStorage.setItem('majh_boisar_custom_hotels_v2', JSON.stringify([newHotel, ...savedV2]));

      const saved = JSON.parse(localStorage.getItem('majh_boisar_user_hotels') || '[]');
      localStorage.setItem('majh_boisar_user_hotels', JSON.stringify([newHotel, ...saved]));

      // Save to central PostgreSQL DB
      fetch('/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newHotel.name,
          category: newHotel.category,
          location: newHotel.location,
          address: newHotel.address,
          phone: newHotel.phone,
          whatsapp: newHotel.whatsapp,
          hourlyRate3h: newHotel.hourlyRate3h,
          hourlyRate6h: newHotel.hourlyRate6h,
          hourlyRate12h: newHotel.hourlyRate12h,
          nightRate: newHotel.nightRate,
          amenities: newHotel.amenities,
          gallery: newHotel.image ? [newHotel.image] : [],
          description: newHotel.description,
          createdBy: loggedInUser?.phone || newHotel.phone
        })
      }).catch(e => console.error('[Hotel DB Save Error]:', e));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
    } catch (err) {
      console.error(err);
    }

    alert(`🎉 Hotel Application Submitted!\n\n"${newHotel.name}" has been sent to Admin for Verification & Approval.\nOnce verified, it will be published live with full online & desk booking.`);
    setView('browse');
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl relative border border-purple-900/20 max-h-[92vh] flex flex-col text-left overflow-hidden overscroll-contain">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all cursor-pointer z-30 shadow-md backdrop-blur-sm"
          title="Close Hotel Booking"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Banner (Purple Luxury Gold Vibe matching User Banner) */}
        <div className="relative bg-gradient-to-r from-[#1c0836] via-[#2d0f59] to-[#120424] text-white p-4 sm:p-5 shrink-0 border-b border-amber-500/30 overflow-hidden">
          {/* Subtle Glow & Watermark */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#1c0836] rounded-[14px] flex items-center justify-center text-amber-400">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                    👑 COMFORT STAY &amp; HOURLY BOOKING
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                  Boisar Hotel &amp; Day Stay Booking
                </h2>
                <p className="text-xs text-purple-200/90 font-medium">
                  ⚡ 3h/6h Hourly Short Stays · 🌙 Nightly Rooms · 💑 Couple Friendly · Instant WhatsApp Pass
                </p>
              </div>
            </div>

            {/* List Your Hotel Button */}
            <div className="flex items-center gap-2 shrink-0">
              {view === 'browse' ? (
                <button
                  onClick={() => setView('list_hotel')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Your Hotel</span>
                </button>
              ) : (
                <button
                  onClick={() => { setView('browse'); setSelectedHotel(null); }}
                  className="bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  ← Back to Hotels
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            VIEW 1: BROWSE HOTELS LIST
        ======================================================== */}
        {view === 'browse' && (
          <div className="flex-1 overflow-y-auto flex flex-col p-3.5 sm:p-5 space-y-4 bg-slate-50">
            
            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'All', label: '🏨 All Hotels' },
                  { id: 'Hourly', label: '⚡ Hourly Friendly (3h/6h)' },
                  { id: 'Couple', label: '💑 Couple Friendly' },
                  { id: 'Luxury', label: '🌟 Luxury & 3-Star' },
                  { id: 'Budget', label: '💰 Budget Under ₹999' },
                  { id: 'Station', label: '🚉 Near Station' },
                  { id: 'MIDC', label: '🏭 Tarapur MIDC' },
                ].map(pill => (
                  <button
                    key={pill.id}
                    onClick={() => setActiveFilter(pill.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === pill.id
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-sm border border-purple-950'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-56 shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search hotel or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-600 transition-all"
                />
              </div>
            </div>

            {/* Hourly Booking Highlight Promo Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-amber-500/15 border border-amber-400/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⏰</span>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    Need a room for just a few hours in Boisar?
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Pay only for the hours you stay — starting at <strong className="text-purple-900 font-black">₹349 for 3 Hours</strong> with 100% discretion and safe sanitized rooms.
                  </p>
                </div>
              </div>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-2xs">
                ⚡ Instant Check-in
              </span>
            </div>

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHotels.map(hotel => (
                <div 
                  key={hotel.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 flex flex-col group text-left"
                >
                  {/* Card Image Banner with Badges */}
                  <div className="relative w-full h-44 bg-slate-900 overflow-hidden shrink-0">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                      <span className="bg-[#1c0836]/90 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                        ★ {hotel.rating} ({hotel.reviewsCount})
                      </span>
                      {hotel.isCoupleFriendly && (
                        <span className="bg-rose-600/90 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          💑 Couple Friendly
                        </span>
                      )}
                    </div>

                    {/* Hourly Pricing Floating Tag */}
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md text-white px-2.5 py-1 rounded-xl border border-white/20 shadow-md text-right z-10">
                      <span className="text-[9px] text-amber-300 font-bold block uppercase tracking-wider">Hourly From</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-white">₹{hotel.hourlyRate3h}</span>
                        <span className="text-[10px] text-slate-300 font-medium">/ 3 hrs</span>
                      </div>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-white px-2 py-0.5 rounded-lg border border-white/15 text-[10px] font-black z-10">
                      🌙 Night: ₹{hotel.nightRate}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-purple-900 transition-colors leading-snug">
                          {hotel.name}
                        </h3>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-200 shrink-0 uppercase">
                          {hotel.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{hotel.location}</span>
                      </p>

                      <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {hotel.amenities.slice(0, 4).map((am, i) => (
                          <span key={i} className="text-[9px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            ✓ {am}
                          </span>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <span className="text-[9px] font-bold text-slate-400 self-center">
                            +{hotel.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setView('book');
                        }}
                        className="flex-1 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>Book Stay / Rates</span>
                      </button>

                      <button
                        onClick={() => openWhatsAppBooking(hotel)}
                        className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all cursor-pointer shrink-0 shadow-2xs"
                        title="Chat & Book on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <a
                        href={`tel:${hotel.phone}`}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer shrink-0 border border-slate-200"
                        title="Call Reception"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                <p className="text-sm font-black text-slate-800">No hotels found matching your filter</p>
                <p className="text-xs text-slate-500">Try changing search query or switching to 'All Hotels'</p>
                <button
                  onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                  className="mt-2 text-xs font-black text-purple-900 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            VIEW 2: INTERACTIVE BOOKING / RESERVATION FORM
        ======================================================== */}
        {view === 'book' && selectedHotel && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            <form onSubmit={handleBookingSubmit} className="max-w-2xl mx-auto space-y-4 text-left">
              
              {/* Hotel Summary Header */}
              <div className="bg-white border border-purple-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={selectedHotel.image} 
                    alt={selectedHotel.name} 
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                      {selectedHotel.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5">
                      {selectedHotel.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold truncate">📍 {selectedHotel.location}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-black text-slate-400 block uppercase">Phone</span>
                  <a href={`tel:${selectedHotel.phone}`} className="text-xs font-black text-purple-900 hover:underline">
                    {selectedHotel.phone}
                  </a>
                </div>
              </div>

              {/* Stay Type Toggle (Hourly Short Stay vs Overnight Night Stay) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  1. Choose Stay Type *
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setStayType('hourly')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      stayType === 'hourly'
                        ? 'border-purple-900 bg-purple-50/70 ring-2 ring-purple-900/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">⚡ Hourly Day Stay</span>
                      <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">Short Use</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">3h / 6h / 12h flexible slots for transit, work, or privacy</p>
                    <span className="text-xs font-black text-purple-900 mt-2">From ₹{selectedHotel.hourlyRate3h} (3 hrs)</span>
                  </div>

                  <div
                    onClick={() => setStayType('night')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      stayType === 'night'
                        ? 'border-purple-900 bg-purple-50/70 ring-2 ring-purple-900/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-900">🌙 Night / Full Day Stay</span>
                      <span className="text-[9px] font-black bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Overnight</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">Full 24-hour overnight stay with morning check-out</p>
                    <span className="text-xs font-black text-purple-900 mt-2">₹{selectedHotel.nightRate} / night</span>
                  </div>
                </div>

                {/* If Hourly Selected: Choose Duration & Slot */}
                {stayType === 'hourly' && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1.5 uppercase">Select Hourly Duration:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: '3h', label: '3 Hours Stay', price: selectedHotel.hourlyRate3h },
                          { id: '6h', label: '6 Hours Stay', price: selectedHotel.hourlyRate6h },
                          { id: '12h', label: '12 Hours (Full Day)', price: selectedHotel.hourlyRate12h }
                        ].map(d => (
                          <button
                            type="button"
                            key={d.id}
                            onClick={() => setHourlyDuration(d.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              hourlyDuration === d.id
                                ? 'bg-purple-900 text-white font-black border-purple-950 shadow-sm'
                                : 'bg-slate-50 text-slate-700 font-bold border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span className="text-xs block">{d.label}</span>
                            <span className={`text-[10px] block mt-0.5 ${hourlyDuration === d.id ? 'text-amber-300 font-black' : 'text-purple-900 font-extrabold'}`}>
                              ₹{d.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Date of Stay</label>
                        <input
                          type="date"
                          required
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                        />
                      </div>
                      <div>
                        <HotelTimePicker
                          checkInTime={checkInTime}
                          onChange={setCheckInTime}
                          durationSlot={hourlyDuration}
                          label="What Time ?"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* If Night Selected: Check-in / Check-out Dates */}
                {stayType === 'night' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Check-in Date</label>
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Check-out Date</label>
                      <input
                        type="date"
                        required
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* Guests & Room Count */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Room Type</label>
                    <select
                      value={roomCategory}
                      onChange={(e) => setRoomCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Deluxe AC Room">Deluxe AC Room</option>
                      <option value="Executive Suite">Executive Suite</option>
                      <option value="Standard Non-AC">Standard Non-AC</option>
                      <option value="Couple Special AC">Couple Special AC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Guests</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults (Couple/Pair)</option>
                      <option value={3}>3 Adults (Family)</option>
                      <option value={4}>4 Adults (Group)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Rooms</label>
                    <select
                      value={roomCount}
                      onChange={(e) => setRoomCount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value={1}>1 Room</option>
                      <option value={2}>2 Rooms</option>
                      <option value={3}>3 Rooms</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Guest Details Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  2. Primary Guest Details *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Govt ID Proof to Carry *</label>
                    <select
                      value={idProofType}
                      onChange={(e) => setIdProofType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Aadhaar Card (Local / Outstation Accepted)">Aadhaar Card (Local / Outstation Accepted)</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID Card">Voter ID Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Special Requests (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Quiet floor, early check-in"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Privacy Protected · 18+ Couples with valid Govt ID welcomed by hotel management.</span>
                </div>
              </div>

              {/* Price Breakdown & Instant Checkout */}
              <div className="bg-gradient-to-r from-purple-950 via-[#1c0836] to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] text-amber-300 font-black uppercase tracking-widest block">Summary</span>
                    <span className="text-xs text-purple-200 font-bold">
                      {stayType === 'hourly' ? `Hourly Day Stay (${hourlyDuration})` : 'Nightly Stay'} · {roomCount} Room(s)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">₹{calculatedPrice}</span>
                    <span className="block text-[9px] text-slate-300 font-bold">Pay Directly at Hotel Desk</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Confirm Booking &amp; Generate Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openWhatsAppBooking(selectedHotel)}
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Book on WhatsApp</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================
            VIEW 3: BOOKING SUCCESSFUL PASS
        ======================================================== */}
        {view === 'success' && selectedHotel && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col items-center justify-center text-center">
            <div className="bg-white border-2 border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
              
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  BOOKING CONFIRMED &amp; SENT
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Your Room Booking is Ready!
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Show this digital pass or booking reference at the hotel reception upon arrival.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl p-4 text-left space-y-2 border border-amber-400/40 shadow-inner">
                <div className="flex justify-between items-center border-b border-white/15 pb-2">
                  <div>
                    <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">Booking Reference ID</span>
                    <strong className="text-sm font-mono text-white font-black tracking-widest">{confirmedBookingRef}</strong>
                  </div>
                  <span className="bg-emerald-500 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase">
                    Active
                  </span>
                </div>

                <div className="text-xs space-y-1 pt-1">
                  <p><strong className="text-slate-300">Hotel:</strong> {selectedHotel.name}</p>
                  <p><strong className="text-slate-300">Address:</strong> {selectedHotel.address}</p>
                  <p><strong className="text-slate-300">Stay Type:</strong> {stayType === 'hourly' ? `Hourly (${hourlyDuration})` : 'Night Stay'}</p>
                  {stayType === 'hourly' && <p><strong className="text-slate-300">Slot:</strong> {checkInTime} ({hourlyDuration})</p>}
                  <p><strong className="text-slate-300">Guest:</strong> {guestName} ({guestPhone})</p>
                  <p><strong className="text-slate-300">Total Payable at Desk:</strong> <span className="text-amber-400 font-black">₹{calculatedPrice}</span></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/${selectedHotel.whatsapp || selectedHotel.phone}?text=${encodeURIComponent(
                    `Hello ${selectedHotel.name},\nI have booked a stay on Majh Boisar!\n\n📋 Ref ID: ${confirmedBookingRef}\n👤 Guest Name: ${guestName}\n📱 Phone: ${guestPhone}\n🏨 Stay Type: ${stayType === 'hourly' ? `Hourly (${hourlyDuration}) - ${checkInTime}` : 'Night Stay'}\n💰 Amount: ₹${calculatedPrice}\n\nPlease keep the room ready.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Confirmation to Hotel on WhatsApp</span>
                </a>

                <div className="flex gap-2">
                  <a
                    href={`tel:${selectedHotel.phone}`}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs py-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-900" />
                    <span>Call Reception</span>
                  </a>

                  <button
                    onClick={() => { setView('browse'); setSelectedHotel(null); }}
                    className="flex-1 bg-purple-900 hover:bg-purple-800 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Done &amp; Browse More
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 4: LIST YOUR HOTEL (FOR HOTELIERS)
        ======================================================== */}
        {view === 'list_hotel' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
            <form onSubmit={handleAddHotelSubmit} className="max-w-2xl mx-auto space-y-4 text-left">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Hotel &amp; Lodge Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Hotel / Lodge Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hotel Green Park"
                      value={newHotelName}
                      onChange={(e) => setNewHotelName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Category / Star Rating</label>
                    <select
                      value={newHotelCategory}
                      onChange={(e) => setNewHotelCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Executive">Executive / 3-Star</option>
                      <option value="Luxury">Luxury Resort &amp; Hotel</option>
                      <option value="Boutique">Boutique Residency</option>
                      <option value="Budget">Budget Lodge / Guest House</option>
                      <option value="Residency">Station Residency</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Area / Landmark in Boisar *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Navapur Road, Boisar (W)"
                      value={newHotelLocation}
                      onChange={(e) => setNewHotelLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Full Address</label>
                    <input
                      type="text"
                      placeholder="Plot / Street / Opp. Landmark"
                      value={newHotelAddress}
                      onChange={(e) => setNewHotelAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Reception Phone Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={newHotelPhone}
                      onChange={(e) => setNewHotelPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">WhatsApp Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="WhatsApp number for leads"
                      value={newHotelWhatsapp}
                      onChange={(e) => setNewHotelWhatsapp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Clock className="w-4 h-4 text-purple-900" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Tariff &amp; Hourly Pricing Structure
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">3h Hourly Rate (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="499"
                      value={newHotelHourly3h}
                      onChange={(e) => setNewHotelHourly3h(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">6h Hourly Rate (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="799"
                      value={newHotelHourly6h}
                      onChange={(e) => setNewHotelHourly6h(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Night Rate (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="1499"
                      value={newHotelNightRate}
                      onChange={(e) => setNewHotelNightRate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Hotel Image URL (or upload)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newHotelImage}
                    onChange={(e) => setNewHotelImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">About Hotel / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Highlight AC rooms, cleanliness, parking, food service..."
                    value={newHotelDesc}
                    onChange={(e) => setNewHotelDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600 resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setView('browse')}
                  className="flex-1 bg-white border border-slate-250 hover:bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Hotel on Majh Boisar</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
