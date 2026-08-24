'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Search, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  ArrowUpDown, 
  BedDouble, 
  Clock, 
  Plus, 
  Calendar,
  X,
  ArrowRight,
  Filter,
  Eye,
  Info,
  Camera,
  Upload,
  Ticket,
  Wifi,
  Wind,
  Car,
  Tv,
  Zap,
  Train
} from 'lucide-react';
import { BOISAR_HOTELS, HotelItem, getAllHotels, recordHotelClick, calculateStayWindow } from '@/lib/hotelsData';
import { useApp } from '@/context/AppContext';
import HotelTimePicker from '@/components/HotelTimePicker';
import MyHotelPassesModal from '@/components/MyHotelPassesModal';
import StaycationTabSwitcher from '@/components/StaycationTabSwitcher';

export default function HotelsPage() {
  const router = useRouter();
  const { loggedInUser, isLoggedIn, setLoginModalOpen, showToast } = useApp();

  const [hotels, setHotels] = useState<HotelItem[]>(BOISAR_HOTELS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Hourly' | 'Couple' | 'Luxury' | 'Budget' | 'Station' | 'MIDC'>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'station' | 'midc'>('recommended');
  
  // User's own booking passes
  const [isMyPassesModalOpen, setIsMyPassesModalOpen] = useState(false);
  const [userPassCount, setUserPassCount] = useState(0);

  const refreshUserPasses = () => {
    if (!isLoggedIn || !loggedInUser?.phone) {
      setUserPassCount(0);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      const hiddenIds = JSON.parse(localStorage.getItem('majh_boisar_user_hidden_passes') || '[]');
      const userPhoneClean = (loggedInUser.phone || '').replace(/\D/g, '');
      const myPasses = stored.filter((p: any) => {
        const guestPhoneClean = (p.guestPhone || '').replace(/\D/g, '');
        return guestPhoneClean === userPhoneClean && !hiddenIds.includes(p.id);
      });
      setUserPassCount(myPasses.length);
    } catch (e) {
      setUserPassCount(0);
    }
  };

  useEffect(() => {
    refreshUserPasses();
  }, [isLoggedIn, loggedInUser]);

  // Active slide index for each hotel card carousel
  const [cardPhotoIndex, setCardPhotoIndex] = useState<Record<string, number>>({});

  // Quick Booking Drawer / Modal
  const [quickBookHotel, setQuickBookHotel] = useState<HotelItem | null>(null);
  const [selectedSlotDuration, setSelectedSlotDuration] = useState<'3h' | '6h' | '12h' | 'day' | 'night'>('3h');
  const [checkInTime, setCheckInTime] = useState('11:00 AM');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [idProof, setIdProof] = useState('Aadhaar Card (Local / Outstation Accepted)');
  const [confirmedPass, setConfirmedPass] = useState<any>(null);

  // Add Hotel Modal State (Multi-room, Photo Gallery Upload, Amenities)
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);

  // Prevent background page from scrolling when modal is open
  useEffect(() => {
    const isAnyModalOpen = Boolean(isAddHotelOpen || quickBookHotel || confirmedPass || isMyPassesModalOpen);
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isAddHotelOpen, quickBookHotel, confirmedPass, isMyPassesModalOpen]);
  const [partnerPlan, setPartnerPlan] = useState<'starter_149' | 'pro_499'>('pro_499');
  const [newHotelForm, setNewHotelForm] = useState({
    name: '',
    tagline: 'Luxury Comfort Stay & Flexible Hourly Day-Rest in Boisar',
    category: 'Executive',
    location: '',
    address: '',
    phone: '',
    whatsapp: '',
    stationDistance: '3 mins to Boisar Station',
    midcDistance: '5 mins to Tarapur MIDC',
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: false,
    description: 'Verified hotel in Boisar offering clean air-conditioned rooms, swift check-ins, complete privacy, and flexible hourly stays.',
    amenitiesList: ['AC Deluxe', 'Free Fast Wi-Fi', 'Hot Shower & Geyser', 'Free Parking', 'TV Screen', 'Clean Bedding', '24/7 Power Backup', 'Room Service'],
    rulesList: [
      'Original Valid Photo ID (Aadhaar/Driving License/Passport) required at check-in.',
      'Couples 18+ Welcome with complete privacy.',
      'Pay on arrival at Reception Desk (No advance required).',
      'Flexible 24/7 check-in slots available.'
    ]
  });

  const PRESET_HOTEL_PHOTOS = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80'
  ];

  const [uploadedGalleryPhotos, setUploadedGalleryPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80'
  ]);

  // AC & Non-AC Room Tariffs for new hotel
  const [offersHourly, setOffersHourly] = useState(true);
  const [newHotelAc3h, setNewHotelAc3h] = useState('699');
  const [newHotelAc6h, setNewHotelAc6h] = useState('1099');
  const [newHotelAc12h, setNewHotelAc12h] = useState('1599');
  const [newHotelAcDay, setNewHotelAcDay] = useState('1499');
  const [newHotelAcNight, setNewHotelAcNight] = useState('1899');

  const [newHotelNonAc3h, setNewHotelNonAc3h] = useState('499');
  const [newHotelNonAc6h, setNewHotelNonAc6h] = useState('799');
  const [newHotelNonAc12h, setNewHotelNonAc12h] = useState('1199');
  const [newHotelNonAcDay, setNewHotelNonAcDay] = useState('999');
  const [newHotelNonAcNight, setNewHotelNonAcNight] = useState('1399');

  const [hotelRoomsToAdd, setHotelRoomsToAdd] = useState<any[]>([
    {
      id: 'r_1',
      name: 'Deluxe AC Room',
      type: 'Deluxe AC',
      bedType: '1 Queen Bed',
      maxGuests: 2,
      hourly3h: '699',
      hourly6h: '1099',
      hourly12h: '1599',
      nightRate: '1899',
      image: PRESET_HOTEL_PHOTOS[0]
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedGalleryPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveUploadedPhoto = (idx: number) => {
    setUploadedGalleryPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddAnotherRoom = () => {
    const newIdx = hotelRoomsToAdd.length + 1;
    setHotelRoomsToAdd(prev => [
      ...prev,
      {
        id: `r_${Date.now()}`,
        name: newIdx === 2 ? 'Super Deluxe AC' : newIdx === 3 ? 'Executive Suite Room' : `Premium Room #${newIdx}`,
        type: newIdx === 2 ? 'Super Deluxe AC' : newIdx === 3 ? 'Suite Room' : 'Deluxe AC',
        bedType: newIdx === 2 ? '1 King Bed + Extra Mattress' : newIdx === 3 ? '1 King Bed + Lounge Sofa' : '1 Queen Bed',
        maxGuests: newIdx >= 2 ? 3 : 2,
        hourly3h: '999',
        hourly6h: '1499',
        hourly12h: '1999',
        nightRate: '2499',
        image: PRESET_HOTEL_PHOTOS[newIdx % PRESET_HOTEL_PHOTOS.length]
      }
    ]);
  };

  const handleRemoveRoom = (id: string) => {
    if (hotelRoomsToAdd.length <= 1) {
      alert('At least one room category is required.');
      return;
    }
    setHotelRoomsToAdd(prev => prev.filter(r => r.id !== id));
  };

  useEffect(() => {
    setHotels(getAllHotels());
    if (loggedInUser) {
      setGuestName(loggedInUser.name || '');
      setGuestPhone(loggedInUser.phone || '');
    }
  }, [loggedInUser]);

  // Handle Photo Navigation on specific hotel card
  const handleNextPhoto = (e: React.MouseEvent, hotelId: string, total: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCardPhotoIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % total
    }));
  };

  const handlePrevPhoto = (e: React.MouseEvent, hotelId: string, total: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCardPhotoIndex(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + total) % total
    }));
  };

  const handleSelectThumbnail = (e: React.MouseEvent, hotelId: string, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setCardPhotoIndex(prev => ({
      ...prev,
      [hotelId]: idx
    }));
  };

  // Filter & Sort computation
  const filteredAndSortedHotels = useMemo(() => {
    let result = hotels.filter(h => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        h.name.toLowerCase().includes(q) || 
        h.location.toLowerCase().includes(q) || 
        h.address.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q);

      let matchesTab = true;
      if (activeTab === 'Hourly') matchesTab = h.is3hAvailable || h.is6hAvailable;
      else if (activeTab === 'Couple') matchesTab = h.isCoupleFriendly;
      else if (activeTab === 'Luxury') matchesTab = h.category === 'Luxury' || h.category === 'Executive';
      else if (activeTab === 'Budget') matchesTab = h.hourlyRate3h <= 450 || h.nightRate <= 1200;
      else if (activeTab === 'Station') matchesTab = h.nearStation;
      else if (activeTab === 'MIDC') matchesTab = h.nearMidc;

      return matchesSearch && matchesTab;
    });

    if (sortBy === 'recommended') {
      result.sort((a, b) => {
        const aPinned = (a as any).isPinnedTop ? 1 : 0;
        const bPinned = (b as any).isPinnedTop ? 1 : 0;
        return bPinned - aPinned;
      });
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => a.hourlyRate3h - b.hourlyRate3h);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.hourlyRate3h - a.hourlyRate3h);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'station') {
      result.sort((a, b) => (b.nearStation ? 1 : 0) - (a.nearStation ? 1 : 0));
    } else if (sortBy === 'midc') {
      result.sort((a, b) => (b.nearMidc ? 1 : 0) - (a.nearMidc ? 1 : 0));
    }

    return result;
  }, [hotels, searchQuery, activeTab, sortBy]);

  // Handle Quick Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickBookHotel) return;
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please enter your full name and 10-digit mobile number.');
      return;
    }

    const price = selectedSlotDuration === '3h' ? quickBookHotel.hourlyRate3h
      : selectedSlotDuration === '6h' ? quickBookHotel.hourlyRate6h
      : selectedSlotDuration === '12h' ? quickBookHotel.hourlyRate12h
      : selectedSlotDuration === 'day' ? (quickBookHotel.dayRate || quickBookHotel.hourlyRate12h || quickBookHotel.nightRate)
      : quickBookHotel.nightRate;

    const calculatedWindow = selectedSlotDuration === 'night' 
      ? 'Overnight Check-in (Night Stay)' 
      : selectedSlotDuration === 'day'
      ? 'Full Day Stay'
      : calculateStayWindow(checkInTime, selectedSlotDuration as any).fullWindowStr;

    const ref = `MB-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: ref,
      hotelId: quickBookHotel.id,
      hotelName: quickBookHotel.name,
      hotelPhone: quickBookHotel.phone,
      hotelAddress: quickBookHotel.address,
      guestName,
      guestPhone,
      idProof,
      stayType: selectedSlotDuration === 'night' ? 'Night Stay' : `Hourly (${selectedSlotDuration})`,
      timeSlot: calculatedWindow,
      date: bookingDate,
      totalAmount: price,
      createdAt: new Date().toLocaleString()
    };

    recordHotelClick(quickBookHotel.id, 'book');

    try {
      const existing = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify([newBooking, ...existing]));

      // Create Instant Enquiry / Lead in Dashboard
      const newLead = {
        id: `lead_htl_${Date.now()}`,
        businessId: Number(quickBookHotel.id.replace(/\D/g, '')) || 1,
        hotelId: quickBookHotel.id,
        customerName: guestName,
        customerPhone: guestPhone,
        customerEmail: '',
        query: `🏨 Hotel Room Booking: Deluxe Room (${newBooking.stayType} [${calculatedWindow}]) on ${bookingDate}. Tariff: ₹${price} (Pay at Reception). Pass Ref: ${ref}`,
        status: 'New Hotel Booking',
        createdAt: new Date().toISOString(),
        notes: `Pass Ref: ${ref} · Stay: ${newBooking.stayType} · Hotel: ${quickBookHotel.name}`
      };

      const existingLeads = JSON.parse(localStorage.getItem('majh_boisar_leads') || '[]');
      localStorage.setItem('majh_boisar_leads', JSON.stringify([newLead, ...existingLeads]));

      // Create Push Notification
      const newNotif = {
        id: `notif_${Date.now()}`,
        title: '🔔 New Hotel Room Booking Received!',
        message: `${guestName} (${guestPhone}) booked a room at ${quickBookHotel.name} for ₹${price}. Time: ${newBooking.stayType} (${calculatedWindow}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        link: '/dashboard?tab=hotel_bookings'
      };

      const existingNotifs = JSON.parse(localStorage.getItem('majh_boisar_notifications') || '[]');
      localStorage.setItem('majh_boisar_notifications', JSON.stringify([newNotif, ...existingNotifs]));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('boisar_new_hotel_booking', { detail: newBooking }));
      }
    } catch (err) {
      console.error(err);
    }

    setConfirmedPass(newBooking);
  };

  // WhatsApp Booking Link
  const triggerWhatsApp = (hotel: HotelItem, durationStr: string, price: number) => {
    recordHotelClick(hotel.id, 'whatsapp');
    const text = encodeURIComponent(
      `Hello ${hotel.name},\nI want to book a room through Majh Boisar Hotel portal.\n\n🏨 Hotel: ${hotel.name}\n📍 Location: ${hotel.location}\n⏰ Slot: ${durationStr} (₹${price})\n👤 Guest Name: ${guestName || 'Customer'}\n\nPlease confirm room availability.`
    );
    window.open(`https://wa.me/${hotel.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* Top Breadcrumb & Actions Header Bar */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link href="/" className="text-slate-500 hover:text-purple-900 font-bold transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-purple-900 font-black truncate">Hourly &amp; Daily Hotels in Boisar</span>
            <span className="hidden sm:inline-block text-[9.5px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Instant Check-in
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLoggedIn && userPassCount > 0 && (
              <button
                type="button"
                onClick={() => setIsMyPassesModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Ticket className="w-3.5 h-3.5 text-slate-950" />
                <span>My Passes ({userPassCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Staycation Top Category Switcher: Hotels / Resorts / Villas */}
      <StaycationTabSwitcher activeTab="hotels" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-2 sm:mt-3">
        
        {/* Ultra-Clean & Compact Search, Filter & Sort Control Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1.5 mb-2 text-left">
          
          {/* Row 1: Search & Sort in a single compact row */}
          <div className="flex items-center gap-1.5">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hotel name, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-6 py-1 text-[11px] font-semibold text-slate-800 outline-none focus:border-purple-600 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 shadow-2xs shrink-0">
              <ArrowUpDown className="w-3 h-3 text-purple-700 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-bold text-slate-800 outline-none cursor-pointer pr-0.5"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="station">Near Station</option>
                <option value="midc">Near MIDC</option>
              </select>
            </div>

          </div>

          {/* Filter Pills (Ultra-compact horizontal scroll) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none border-t border-slate-100 pt-1">
            {[
              { id: 'All', label: 'All' },
              { id: 'Hourly', label: 'Hourly' },
              { id: 'Couple', label: 'Couple Friendly' },
              { id: 'Luxury', label: 'Luxury' },
              { id: 'Budget', label: 'Under ₹500' },
              { id: 'Station', label: 'Near Station' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-900 text-white font-black shadow-2xs'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-950 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between gap-2 mb-2 px-0.5 text-left">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 whitespace-nowrap">
            {filteredAndSortedHotels.length} Hourly Hotels in Boisar
          </h2>
          <span className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap">
            Flexible Short Stays · ₹0 Convenience Fee
          </span>
        </div>

        {/* Hotel Cards List (Clean, Spacious, Easy to Understand) */}
        <div className="space-y-4">
          {filteredAndSortedHotels.map(hotel => {
            const currentImgIdx = cardPhotoIndex[hotel.id] || 0;
            const activePhoto = hotel.gallery[currentImgIdx] || hotel.gallery[0];
            const thumbnails = hotel.gallery.slice(0, 4);

            return (
              <div 
                key={hotel.id}
                onClick={() => {
                  recordHotelClick(hotel.id, 'click');
                  router.push(`/hotels/${hotel.slug}`);
                }}
                className={`bg-white rounded-3xl border transition-all p-3.5 sm:p-4 text-left group cursor-pointer ${
                  (hotel as any).isPinnedTop 
                    ? 'border-amber-400 ring-2 ring-amber-400/25 shadow-md hover:shadow-lg' 
                    : 'border-slate-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 lg:gap-5 items-stretch">
                  
                  {/* Left: Main Image (310px) + 4 Vertical Thumbnails (60px) = 380px Total */}
                  <div 
                    style={{ minWidth: '340px', maxWidth: '380px', height: '210px' }} 
                    className="hidden sm:flex gap-2 shrink-0"
                  >
                    {/* Main Image with Carousel Controls & Top Badges Overlay */}
                    <div className="relative flex-1 h-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0">
                      <img 
                        src={activePhoto} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />

                      {/* Top Badges & Rating Overlay on Image */}
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 flex-wrap pointer-events-none">
                        {(hotel as any).isPinnedTop && (
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                            👑 TOP RECOMMENDED
                          </span>
                        )}
                        {hotel.badge && (
                          <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-md">
                            {hotel.badge.replace(/[♦★⭐⚡]/g, '').trim()}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 z-20 pointer-events-none">
                        <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-white text-white" />
                          <span>{hotel.rating}</span>
                          <span className="text-emerald-100 font-medium text-[9.5px]">({hotel.reviewsCount})</span>
                        </span>
                      </div>

                      {/* Left / Right Nav Arrows */}
                      <button
                        type="button"
                        onClick={(e) => handlePrevPhoto(e, hotel.id, hotel.gallery.length)}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                        title="Previous Photo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleNextPhoto(e, hotel.id, hotel.gallery.length)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                        title="Next Photo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Column of 4 Vertical Thumbnail Photos */}
                    <div style={{ width: '56px', minWidth: '56px' }} className="flex flex-col gap-1.5 shrink-0 h-full">
                      {thumbnails.map((thumb, tIdx) => (
                        <div
                          key={tIdx}
                          onClick={(e) => handleSelectThumbnail(e, hotel.id, tIdx)}
                          className={`flex-1 rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-slate-100 relative ${
                            currentImgIdx === tIdx ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-slate-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Mobile Photo Banner with Thumbnails, Controls & Overlays */}
                  <div className="sm:hidden space-y-1.5 w-full">
                    <div className="relative w-full h-[190px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shrink-0">
                      <img src={activePhoto} alt={hotel.name} className="w-full h-full object-cover" />

                      {/* Top Badges & Rating Overlay on Image */}
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 flex-wrap pointer-events-none">
                        {(hotel as any).isPinnedTop && (
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                            👑 TOP RECOMMENDED
                          </span>
                        )}
                        {hotel.badge && (
                          <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider shadow-md">
                            {hotel.badge.replace(/[♦★⭐⚡]/g, '').trim()}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 z-20 pointer-events-none">
                        <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-white text-white" />
                          <span>{hotel.rating}</span>
                          <span className="text-emerald-100 font-medium text-[9.5px]">({hotel.reviewsCount})</span>
                        </span>
                      </div>

                      {/* Nav Arrows */}
                      <button
                        type="button"
                        onClick={(e) => handlePrevPhoto(e, hotel.id, hotel.gallery.length)}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                        title="Previous Photo"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleNextPhoto(e, hotel.id, hotel.gallery.length)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                        title="Next Photo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mobile 4 Thumbnail Photos Strip */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {thumbnails.map((thumb, tIdx) => (
                        <div
                          key={tIdx}
                          onClick={(e) => handleSelectThumbnail(e, hotel.id, tIdx)}
                          className={`h-11 rounded-lg overflow-hidden cursor-pointer border-2 transition-all bg-slate-100 relative ${
                            currentImgIdx === tIdx ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-slate-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Hotel Details & 3 Hourly Slot Pricing Buttons */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2 py-0.5">
                    
                    {/* Header Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-900 transition-colors leading-tight">
                          {hotel.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap text-[11px] font-bold text-slate-500">
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{hotel.location}</span>
                        </span>
                        <span>•</span>
                        <span className="text-purple-900 font-extrabold flex items-center gap-1">
                          <Train className="w-3.5 h-3.5 text-purple-700" />
                          <span>{hotel.nearStation ? '3 mins to Station' : '8 mins to Station'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-slate-700 pt-0.5">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-700" /> Couple Friendly
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Accepts Local ID
                        </span>
                      </div>

                      {/* Amenity Icons Row */}
                      <div className="flex items-center gap-3.5 pt-1 text-slate-500 text-xs">
                        <span className="flex items-center gap-1" title="Free Wi-Fi">
                          <Wifi className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px] font-medium text-slate-600">Wi-Fi</span>
                        </span>
                        <span className="flex items-center gap-1" title="AC Rooms">
                          <Wind className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px] font-medium text-slate-600">AC</span>
                        </span>
                        <span className="flex items-center gap-1" title="Parking">
                          <Car className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px] font-medium text-slate-600">Parking</span>
                        </span>
                        <span className="flex items-center gap-1" title="TV">
                          <Tv className="w-3.5 h-3.5 text-slate-500" />
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">+12 more</span>
                      </div>
                    </div>

                    {/* Bottom Row: Pricing Structure (Hourly or Day & Night) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 sm:gap-2.5">
                      {hotel.offersHourly === false || (hotel.hourlyRate3h === 0 && !hotel.is3hAvailable) ? (
                        <>
                          {/* ☀️ Day Stay */}
                          <div className="flex-1 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 rounded-2xl py-2 px-3 text-center transition-all cursor-pointer">
                            <span className="text-sm sm:text-base font-black text-emerald-950 block">
                              ₹{hotel.dayRate || hotel.hourlyRate12h || hotel.nightRate}
                            </span>
                            <span className="text-[9.5px] font-bold text-emerald-700 block uppercase tracking-wider">
                              ☀️ Day Stay
                            </span>
                          </div>

                          {/* 🌙 Night Stay */}
                          <div className="flex-1 bg-purple-50/70 hover:bg-purple-100/70 border border-purple-200 rounded-2xl py-2 px-3 text-center transition-all cursor-pointer">
                            <span className="text-sm sm:text-base font-black text-purple-950 block">
                              ₹{hotel.nightRate}
                            </span>
                            <span className="text-[9.5px] font-bold text-purple-800 block uppercase tracking-wider">
                              🌙 Night Stay
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* 3 Hrs */}
                          <div className="flex-1 bg-slate-50 hover:bg-purple-50 border border-slate-250 hover:border-purple-400 rounded-2xl py-2 px-2.5 text-center transition-all cursor-pointer">
                            <span className="text-sm sm:text-base font-black text-slate-900 block">
                              ₹{hotel.hourlyRate3h}
                            </span>
                            <span className="text-[9.5px] font-bold text-slate-500 block uppercase tracking-wider">
                              3 Hrs
                            </span>
                          </div>

                          {/* 6 Hrs */}
                          <div className="flex-1 bg-slate-50 hover:bg-purple-50 border border-slate-250 hover:border-purple-400 rounded-2xl py-2 px-2.5 text-center transition-all cursor-pointer">
                            {hotel.is6hAvailable ? (
                              <>
                                <span className="text-sm sm:text-base font-black text-slate-900 block">
                                  ₹{hotel.hourlyRate6h}
                                </span>
                                <span className="text-[9.5px] font-bold text-slate-500 block uppercase tracking-wider">
                                  6 Hrs
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 block py-1.5">Unavailable</span>
                            )}
                          </div>

                          {/* 12 Hrs */}
                          <div className="flex-1 bg-slate-50 hover:bg-purple-50 border border-slate-250 hover:border-purple-400 rounded-2xl py-2 px-2.5 text-center transition-all cursor-pointer">
                            {hotel.is12hAvailable ? (
                              <>
                                <span className="text-sm sm:text-base font-black text-slate-900 block">
                                  ₹{hotel.hourlyRate12h}
                                </span>
                                <span className="text-[9.5px] font-bold text-slate-500 block uppercase tracking-wider">
                                  12 Hrs
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-slate-400 block py-1.5">Unavailable</span>
                            )}
                          </div>
                        </>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 pl-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerWhatsApp(hotel, '3 Hours Stay', hotel.hourlyRate3h);
                          }}
                          className="p-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                          title="WhatsApp Hotel"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <a
                          href={`tel:${hotel.phone}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            recordHotelClick(hotel.id, 'call');
                          }}
                          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200"
                          title="Call Reception"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State when 0 hotels match */}
        {filteredAndSortedHotels.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 mt-6">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-black text-slate-800">No hotels matching your criteria</h3>
            <p className="text-xs text-slate-500">Try changing your search query or switching to All Hotels.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('All'); setSortBy('recommended'); }}
              className="mt-2 text-xs font-black text-purple-900 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Banner: Add Your Hotel (Slim & Compact) */}
        <div 
          style={{ background: 'linear-gradient(135deg, #180630 0%, #2b0c50 50%, #120424 100%)', color: '#ffffff' }}
          className="rounded-2xl p-3.5 sm:p-4 mt-6 border border-amber-400/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
        >
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-black text-white">
              Are you a Hotel or Lodge Owner in Boisar?
            </h3>
            <p className="text-[10.5px] text-purple-200">
              List your rooms on Majh Boisar and get instant hourly day-stay &amp; night bookings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn) {
                showToast("Please Sign In or Register first to list your hotel and access your dashboard.", "info", 4000);
                setLoginModalOpen(true);
                return;
              }
              setIsAddHotelOpen(true);
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950" />
            <span>Add Your Hotel</span>
          </button>
        </div>


      </div>

      {/* ========================================================
          QUICK BOOKING MODAL
      ======================================================== */}
      {quickBookHotel && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border border-slate-200 p-5 sm:p-6 text-left max-h-[90vh] overflow-y-auto overscroll-contain">
            
            <button 
              onClick={() => { setQuickBookHotel(null); setConfirmedPass(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!confirmedPass ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                
                {/* Hotel Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3 pr-8">
                  <img 
                    src={quickBookHotel.gallery[0]} 
                    alt={quickBookHotel.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                      {quickBookHotel.badge}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 truncate mt-0.5">
                      {quickBookHotel.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold truncate">📍 {quickBookHotel.location}</p>
                  </div>
                </div>

                {/* Duration Picker */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Select Stay Duration *
                  </label>
                  {quickBookHotel.offersHourly === false || (quickBookHotel.hourlyRate3h === 0 && !quickBookHotel.is3hAvailable) ? (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'day', label: '☀️ Day Stay (Full Day)', price: quickBookHotel.dayRate || quickBookHotel.hourlyRate12h || quickBookHotel.nightRate },
                        { id: 'night', label: '🌙 Night Stay (Overnight)', price: quickBookHotel.nightRate }
                      ].map(slot => (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlotDuration(slot.id as any)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedSlotDuration === slot.id || (slot.id === 'night' && selectedSlotDuration !== 'day')
                              ? 'bg-purple-900 text-white font-black border-purple-950 shadow-xs'
                              : 'bg-slate-50 text-slate-700 font-bold border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs block font-black">{slot.label}</span>
                          <span className={`text-[11px] block mt-0.5 ${(selectedSlotDuration === slot.id || (slot.id === 'night' && selectedSlotDuration !== 'day')) ? 'text-amber-300' : 'text-purple-900 font-black'}`}>
                            ₹{slot.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: '3h', label: '3 Hrs', price: quickBookHotel.hourlyRate3h },
                        { id: '6h', label: '6 Hrs', price: quickBookHotel.hourlyRate6h },
                        { id: '12h', label: '12 Hrs', price: quickBookHotel.hourlyRate12h },
                        { id: 'night', label: 'Night', price: quickBookHotel.nightRate }
                      ].map(slot => (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlotDuration(slot.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedSlotDuration === slot.id
                              ? 'bg-purple-900 text-white font-black border-purple-950 shadow-xs'
                              : 'bg-slate-50 text-slate-700 font-bold border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs block font-black">{slot.label}</span>
                          <span className={`text-[10px] block mt-0.5 ${selectedSlotDuration === slot.id ? 'text-amber-300' : 'text-purple-900'}`}>
                            ₹{slot.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Date of Stay *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  {selectedSlotDuration !== 'night' ? (
                    <div>
                      <HotelTimePicker
                        checkInTime={checkInTime}
                        onChange={setCheckInTime}
                        durationSlot={selectedSlotDuration as any}
                        label="What Time ?"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Overnight Check-in</label>
                      <div className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800">
                        Check-in 12:00 PM · Next Day 11:00 AM
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Details */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit phone"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Govt ID Proof to Carry *</label>
                    <select
                      value={idProof}
                      onChange={(e) => setIdProof(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Aadhaar Card (Local / Outstation Accepted)">Aadhaar Card (Local / Outstation Accepted)</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID Card">Voter ID Card</option>
                    </select>
                  </div>
                </div>

                {/* Price Bar & Buttons */}
                <div className="bg-gradient-to-r from-purple-950 to-indigo-950 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-[10px] text-amber-300 font-black uppercase tracking-widest block">Total Payable at Desk</span>
                    <span className="text-xl font-black text-white">
                      ₹{selectedSlotDuration === '3h' ? quickBookHotel.hourlyRate3h
                        : selectedSlotDuration === '6h' ? quickBookHotel.hourlyRate6h
                        : selectedSlotDuration === '12h' ? quickBookHotel.hourlyRate12h
                        : selectedSlotDuration === 'day' ? (quickBookHotel.dayRate || quickBookHotel.hourlyRate12h || quickBookHotel.nightRate)
                        : quickBookHotel.nightRate}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider active:scale-95"
                  >
                    Confirm Booking
                  </button>
                </div>

              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Booking Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Show this pass at reception upon arrival.</p>
                </div>

                <div 
                  style={{ background: 'linear-gradient(145deg, #140526 0%, #250a48 50%, #10031f 100%)', color: '#ffffff' }}
                  className="rounded-2xl p-4 text-left space-y-2.5 border border-purple-700/60 shadow-xl text-white"
                >
                  <div className="flex justify-between items-center border-b border-purple-800/80 pb-2.5">
                    <div>
                      <span className="text-[9px] text-amber-300 font-extrabold uppercase tracking-widest block">BOOKING REFERENCE</span>
                      <strong className="text-sm font-mono text-white font-black">{confirmedPass.id}</strong>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Confirmed
                    </span>
                  </div>

                  <div className="text-xs space-y-2 pt-1 font-medium">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-purple-200/90 font-semibold shrink-0">🏨 Hotel:</span>
                      <span className="text-white font-black text-right">{confirmedPass.hotelName}</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-purple-200/90 font-semibold shrink-0">⏰ Stay Slot:</span>
                      <span className="text-amber-300 font-black text-right">{confirmedPass.timeSlot || confirmedPass.stayType}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-purple-200/90 font-semibold shrink-0">📅 Date:</span>
                      <span className="text-white font-bold">{confirmedPass.date}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-purple-200/90 font-semibold shrink-0">👤 Guest:</span>
                      <span className="text-white font-bold">{confirmedPass.guestName} ({confirmedPass.guestPhone})</span>
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-2 border-t border-purple-800/60">
                      <span className="text-emerald-300 font-bold text-xs">💰 Pay at Desk:</span>
                      <span className="text-lg font-black text-amber-300">₹{confirmedPass.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${quickBookHotel.whatsapp}?text=${encodeURIComponent(
                    `Hello ${quickBookHotel.name},\nI have confirmed booking on Majh Boisar.\n\n📋 Ref: ${confirmedPass.id}\n👤 Guest: ${confirmedPass.guestName}\n📱 Phone: ${confirmedPass.guestPhone}\n⏰ Stay: ${confirmedPass.stayType}\n💰 Amount: ₹${confirmedPass.totalAmount}\n\nPlease keep room ready.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Pass to Hotel WhatsApp</span>
                </a>

                <button
                  onClick={() => { setQuickBookHotel(null); setConfirmedPass(null); }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Done &amp; Close
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================
          ADD HOTEL MODAL (FOR LOCAL HOTELIERS - MULTI-ROOM & GALLERY)
      ======================================================== */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative border border-purple-200/80 p-5 sm:p-6 text-left max-h-[92vh] overflow-y-auto space-y-4 overscroll-contain">
            
            <button 
              onClick={() => setIsAddHotelOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 pr-8">
              <Building2 className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">List Your Hotel on Majh Boisar</h3>
                <p className="text-[11px] text-slate-500 font-bold">Add rooms, hourly tariffs, gallery photos &amp; reach thousands of Boisar visitors</p>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newHotelForm.name || !newHotelForm.phone) {
                  alert('Please enter Hotel Name and Reception Phone Number.');
                  return;
                }

                const gallery = uploadedGalleryPhotos.length > 0 
                  ? uploadedGalleryPhotos 
                  : [PRESET_HOTEL_PHOTOS[0], PRESET_HOTEL_PHOTOS[1]];

                const lowest3h = offersHourly ? Math.min(Number(newHotelNonAc3h) || 499, Number(newHotelAc3h) || 699) : 0;
                const lowest6h = offersHourly ? Math.min(Number(newHotelNonAc6h) || 799, Number(newHotelAc6h) || 1099) : 0;
                const lowest12h = offersHourly ? Math.min(Number(newHotelNonAc12h) || 1199, Number(newHotelAc12h) || 1599) : 0;
                const lowestDay = Math.min(Number(newHotelNonAcDay) || 999, Number(newHotelAcDay) || 1499);
                const lowestNight = Math.min(Number(newHotelNonAcNight) || 1399, Number(newHotelAcNight) || 1899);

                const newHotelItem: HotelItem = {
                  id: `hotel-${Date.now()}`,
                  slug: newHotelForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  name: newHotelForm.name,
                  tagline: newHotelForm.tagline || (offersHourly ? 'Verified Couple & Hourly Day-Stay Hotel in Boisar' : 'Verified Day & Night Comfort Stay Hotel in Boisar'),
                  category: newHotelForm.category as any,
                  badge: `♦ ${newHotelForm.category.toUpperCase()}`,
                  offerBadge: 'Special Offer on Majh Boisar',
                  suitabilityTag: '💼 Business & Couple Friendly Stay',
                  location: newHotelForm.location || 'Boisar, Palghar',
                  address: newHotelForm.address || newHotelForm.location || 'Boisar West, Palghar',
                  landmark: newHotelForm.location,
                  phone: newHotelForm.phone,
                  whatsapp: newHotelForm.whatsapp || newHotelForm.phone,
                  rating: 4.6,
                  reviewsCount: 1,
                  hourlyRate3h: lowest3h,
                  hourlyRate6h: lowest6h,
                  hourlyRate12h: lowest12h,
                  dayRate: lowestDay,
                  nightRate: lowestNight,
                  offersHourly: offersHourly,
                  is3hAvailable: offersHourly,
                  is6hAvailable: offersHourly,
                  is12hAvailable: offersHourly,
                  isDayAvailable: true,
                  isNightAvailable: true,
                  isCoupleFriendly: newHotelForm.isCoupleFriendly,
                  acceptsLocalId: newHotelForm.acceptsLocalId,
                  nearStation: newHotelForm.nearStation || newHotelForm.location.toLowerCase().includes('station'),
                  nearMidc: newHotelForm.nearMidc || newHotelForm.location.toLowerCase().includes('midc') || newHotelForm.location.toLowerCase().includes('salwad'),
                  stationDistance: newHotelForm.stationDistance || '3 mins to Boisar Station',
                  midcDistance: newHotelForm.midcDistance || '5 mins to Tarapur MIDC',
                  gallery: gallery,
                  amenities: newHotelForm.amenitiesList.map(a => {
                    if (a.includes('AC')) return { name: a, icon: '❄️' };
                    if (a.includes('Wi-Fi')) return { name: a, icon: '📶' };
                    if (a.includes('Shower') || a.includes('Water')) return { name: a, icon: '🚿' };
                    if (a.includes('Parking')) return { name: a, icon: '🅿️' };
                    if (a.includes('TV')) return { name: a, icon: '📺' };
                    if (a.includes('Power') || a.includes('Backup')) return { name: a, icon: '⚡' };
                    if (a.includes('Service')) return { name: a, icon: '🛎️' };
                    return { name: a, icon: '✨' };
                  }),
                  description: newHotelForm.description || 'Verified local hotel listed on Majh Boisar directory offering air-conditioned rooms, swift check-ins, complete privacy, and comfortable stays.',
                  rules: newHotelForm.rulesList,
                  rooms: [
                    {
                      id: 'r_ac',
                      name: 'Deluxe AC Room',
                      type: 'Deluxe AC',
                      bedType: '1 King Bed',
                      maxGuests: 2,
                      size: '240 sq.ft',
                      hourly3h: offersHourly ? (Number(newHotelAc3h) || 699) : 0,
                      hourly6h: offersHourly ? (Number(newHotelAc6h) || 1099) : 0,
                      hourly12h: offersHourly ? (Number(newHotelAc12h) || 1599) : 0,
                      dayRate: Number(newHotelAcDay) || 1499,
                      nightRate: Number(newHotelAcNight) || 1899,
                      image: gallery[0] || PRESET_HOTEL_PHOTOS[0],
                      amenities: ['AC', 'King Bed', 'Free WiFi', 'Hot Shower', 'Clean Bedding']
                    },
                    {
                      id: 'r_non_ac',
                      name: 'Standard Non-AC Room',
                      type: 'Standard Non-AC',
                      bedType: '1 Queen Bed',
                      maxGuests: 2,
                      size: '220 sq.ft',
                      hourly3h: offersHourly ? (Number(newHotelNonAc3h) || 499) : 0,
                      hourly6h: offersHourly ? (Number(newHotelNonAc6h) || 799) : 0,
                      hourly12h: offersHourly ? (Number(newHotelNonAc12h) || 1199) : 0,
                      dayRate: Number(newHotelNonAcDay) || 999,
                      nightRate: Number(newHotelNonAcNight) || 1399,
                      image: gallery[1] || gallery[0] || PRESET_HOTEL_PHOTOS[1],
                      amenities: ['Fan Ventilated', 'Queen Bed', 'Free WiFi', 'Clean Bedding']
                    }
                  ],
                  reviews: [],
                  viewsCount: 1,
                  clicksCount: 0,
                  bookingsCount: 0,
                  status: 'Pending',
                  verified: false,
                  partnerPlan: partnerPlan === 'pro_499' ? 'Pro Featured (₹499/mo)' : 'Starter Partner (₹149/mo)',
                  submittedAt: new Date().toISOString()
                } as any;

                try {
                  const saved = JSON.parse(localStorage.getItem('majh_boisar_custom_hotels_v2') || '[]');
                  localStorage.setItem('majh_boisar_custom_hotels_v2', JSON.stringify([newHotelItem, ...saved]));

                  const savedUser = JSON.parse(localStorage.getItem('majh_boisar_user_hotels') || '[]');
                  localStorage.setItem('majh_boisar_user_hotels', JSON.stringify([newHotelItem, ...savedUser]));

                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new CustomEvent('boisar_hotel_created', { detail: newHotelItem }));
                  }
                } catch (e) {}

                alert(`🎉 Hotel Application Submitted!\n\n"${newHotelItem.name}" has been submitted for Admin Verification.\n\nOur team will verify reception phone (+91 ${newHotelItem.phone}) and activate your hotel listing on the Majh Boisar Directory with 0% commission.`);
                setIsAddHotelOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* SECTION 1: HOTEL BASICS */}
              <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider block">
                  1. Hotel Basic &amp; Contact Information
                </span>

                <div>
                  <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hotel Grand Boisar / Sea View Resort"
                    value={newHotelForm.name}
                    onChange={(e) => setNewHotelForm({ ...newHotelForm, name: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Category</label>
                    <select
                      value={newHotelForm.category}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, category: e.target.value })}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Executive">Executive / 3-Star</option>
                      <option value="Luxury">Luxury Resort</option>
                      <option value="Boutique">Boutique Residency</option>
                      <option value="Budget">Budget Lodge</option>
                      <option value="Residency">Station Residency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Area in Boisar *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ostwal Empire / Salwad / Station Road"
                      value={newHotelForm.location}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, location: e.target.value })}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Full Address &amp; Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Reliance Trends, Ostwal Empire Main Avenue, Boisar West"
                    value={newHotelForm.address}
                    onChange={(e) => setNewHotelForm({ ...newHotelForm, address: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Reception Phone Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={newHotelForm.phone}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">WhatsApp Booking Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="WhatsApp number"
                      value={newHotelForm.whatsapp}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, whatsapp: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: TAGLINE & TRAVEL DISTANCES */}
              <div className="space-y-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider block">
                  2. Tagline, Distance &amp; About
                </span>

                <div>
                  <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Catchy Tagline / Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Luxury 3-Star Comfort Stay & Flexible Hourly Day-Rest"
                    value={newHotelForm.tagline}
                    onChange={(e) => setNewHotelForm({ ...newHotelForm, tagline: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Distance to Boisar Railway Station</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 mins to Boisar Station / 8 mins"
                      value={newHotelForm.stationDistance}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, stationDistance: e.target.value })}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Distance to Tarapur MIDC</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 mins to Tarapur MIDC / 10 mins"
                      value={newHotelForm.midcDistance}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, midcDistance: e.target.value })}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-600 mb-1 uppercase">Hotel Description / About</label>
                  <textarea
                    rows={2}
                    placeholder="Describe your hotel rooms, cleanliness, hospitality, and comfort..."
                    value={newHotelForm.description}
                    onChange={(e) => setNewHotelForm({ ...newHotelForm, description: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              {/* SECTION 3: PHOTO GALLERY (REAL PHOTO UPLOAD DROPZONE) */}
              <div className="space-y-3 bg-purple-50/40 p-4 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider block">
                    3. Hotel Photo Gallery ({uploadedGalleryPhotos.length} Photos)
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">JPG, PNG supported</span>
                </div>

                {/* Upload Dropzone Box */}
                <label className="border-2 border-dashed border-purple-300 hover:border-purple-600 bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center group">
                  <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-900 text-purple-900 group-hover:text-white flex items-center justify-center transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-purple-950 block">+ Click to Choose &amp; Upload Hotel Photos</span>
                    <span className="text-[10px] text-slate-500 font-medium">Select photos of rooms, building exterior, reception desk</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded Photos Grid Preview */}
                {uploadedGalleryPhotos.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Uploaded Photos Preview:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {uploadedGalleryPhotos.map((photoUrl, idx) => (
                        <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-purple-300 group shadow-2xs">
                          <img src={photoUrl} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedPhoto(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black flex items-center justify-center cursor-pointer shadow-sm transition-transform active:scale-95"
                            title="Remove photo"
                          >
                            ✕
                          </button>
                          <span className="absolute bottom-1 left-1 bg-slate-950/70 text-white text-[8.5px] font-bold px-1.5 py-0.2 rounded">
                            Photo {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: AC & NON-AC ROOM TARIFFS */}
              <div className="space-y-3 bg-purple-50/40 p-4 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-purple-950 uppercase tracking-wider block">
                      4. Configure AC &amp; Non-AC Room Tariffs
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Set pricing for your rooms. (Room numbers are allotted at your front desk upon arrival)
                    </p>
                  </div>
                </div>

                {/* ⏱️ Hourly Booking Question Toggle */}
                <div className="bg-white border border-purple-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                      <span>⏱️</span> Do you offer Hourly Booking (3h / 6h / 12h)?
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {offersHourly 
                        ? 'Hourly booking is ON. Guests can book 3h, 6h, 12h, Full Day or Overnight stays.' 
                        : 'Hourly booking is OFF. Only Day Stay & Night Stay rates will be offered to guests.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOffersHourly(!offersHourly)}
                    className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs shrink-0 ${
                      offersHourly
                        ? 'bg-purple-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {offersHourly ? '✓ YES (Hourly Stays)' : 'NO (Day & Night Only)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* ❄️ AC Room Tariff Box */}
                  <div className="bg-white border-2 border-purple-300/80 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-purple-100 pb-1.5">
                      <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                        <span>❄️</span> AC Room Tariff
                      </span>
                      <span className="text-[9px] bg-purple-900 text-white px-2 py-0.5 rounded-full font-black uppercase">
                        Air Conditioned
                      </span>
                    </div>

                    {offersHourly ? (
                      <div className="grid grid-cols-5 gap-1">
                        <div>
                          <label className="block text-[8px] font-black text-purple-900 text-center uppercase">3h (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAc3h}
                            onChange={(e) => setNewHotelAc3h(e.target.value)}
                            className="w-full bg-purple-50/70 border border-purple-200 rounded-lg px-1 py-1 text-xs font-black text-purple-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-purple-900 text-center uppercase">6h (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAc6h}
                            onChange={(e) => setNewHotelAc6h(e.target.value)}
                            className="w-full bg-purple-50/70 border border-purple-200 rounded-lg px-1 py-1 text-xs font-black text-purple-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-purple-900 text-center uppercase">12h (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAc12h}
                            onChange={(e) => setNewHotelAc12h(e.target.value)}
                            className="w-full bg-purple-50/70 border border-purple-200 rounded-lg px-1 py-1 text-xs font-black text-purple-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-emerald-800 text-center uppercase">Day (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAcDay}
                            onChange={(e) => setNewHotelAcDay(e.target.value)}
                            className="w-full bg-emerald-50/80 border border-emerald-300 rounded-lg px-1 py-1 text-xs font-black text-emerald-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-amber-800 text-center uppercase">Night (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAcNight}
                            onChange={(e) => setNewHotelAcNight(e.target.value)}
                            className="w-full bg-amber-50/80 border border-amber-300 rounded-lg px-1 py-1 text-xs font-black text-amber-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-black text-emerald-800 text-center uppercase">☀️ Day Stay Rate (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAcDay}
                            onChange={(e) => setNewHotelAcDay(e.target.value)}
                            placeholder="e.g. 1499"
                            className="w-full bg-emerald-50/80 border border-emerald-300 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-amber-800 text-center uppercase">🌙 Night Stay Rate (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelAcNight}
                            onChange={(e) => setNewHotelAcNight(e.target.value)}
                            placeholder="e.g. 1899"
                            className="w-full bg-amber-50/80 border border-amber-300 rounded-lg px-2 py-1.5 text-xs font-black text-amber-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 🌀 Non-AC Room Tariff Box */}
                  <div className="bg-white border-2 border-slate-300/80 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>🌀</span> Non-AC Room Tariff
                      </span>
                      <span className="text-[9px] bg-slate-700 text-white px-2 py-0.5 rounded-full font-black uppercase">
                        Budget / Fan
                      </span>
                    </div>

                    {offersHourly ? (
                      <div className="grid grid-cols-5 gap-1">
                        <div>
                          <label className="block text-[8px] font-black text-slate-600 text-center uppercase">3h (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAc3h}
                            onChange={(e) => setNewHotelNonAc3h(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 text-xs font-black text-slate-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-600 text-center uppercase">6h (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAc6h}
                            onChange={(e) => setNewHotelNonAc6h(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 text-xs font-black text-slate-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-600 text-center uppercase">12h (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAc12h}
                            onChange={(e) => setNewHotelNonAc12h(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 text-xs font-black text-slate-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-emerald-800 text-center uppercase">Day (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAcDay}
                            onChange={(e) => setNewHotelNonAcDay(e.target.value)}
                            className="w-full bg-emerald-50/80 border border-emerald-300 rounded-lg px-1 py-1 text-xs font-black text-emerald-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-amber-800 text-center uppercase">Night (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAcNight}
                            onChange={(e) => setNewHotelNonAcNight(e.target.value)}
                            className="w-full bg-amber-50/80 border border-amber-300 rounded-lg px-1 py-1 text-xs font-black text-amber-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-black text-emerald-800 text-center uppercase">☀️ Day Stay Rate (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAcDay}
                            onChange={(e) => setNewHotelNonAcDay(e.target.value)}
                            placeholder="e.g. 999"
                            className="w-full bg-emerald-50/80 border border-emerald-300 rounded-lg px-2 py-1.5 text-xs font-black text-emerald-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-amber-800 text-center uppercase">🌙 Night Stay Rate (₹)</label>
                          <input
                            type="number"
                            required
                            value={newHotelNonAcNight}
                            onChange={(e) => setNewHotelNonAcNight(e.target.value)}
                            placeholder="e.g. 1399"
                            className="w-full bg-amber-50/80 border border-amber-300 rounded-lg px-2 py-1.5 text-xs font-black text-amber-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: ROOM AMENITIES SELECTION */}
              <div className="space-y-2.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider block">
                  5. Select Room Amenities
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'AC Deluxe', icon: '❄️' },
                    { label: 'Free Fast Wi-Fi', icon: '📶' },
                    { label: 'Hot Shower & Geyser', icon: '🚿' },
                    { label: 'Free Parking', icon: '🅿️' },
                    { label: 'TV Screen', icon: '📺' },
                    { label: 'Clean Bedding', icon: '🛏️' },
                    { label: '24/7 Power Backup', icon: '⚡' },
                    { label: 'Room Service', icon: '🛎️' }
                  ].map((amenity) => {
                    const isSelected = newHotelForm.amenitiesList.includes(amenity.label);
                    return (
                      <label 
                        key={amenity.label}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-purple-900 text-white border-purple-950 shadow-2xs' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setNewHotelForm({
                                ...newHotelForm,
                                amenitiesList: newHotelForm.amenitiesList.filter(a => a !== amenity.label)
                              });
                            } else {
                              setNewHotelForm({
                                ...newHotelForm,
                                amenitiesList: [...newHotelForm.amenitiesList, amenity.label]
                              });
                            }
                          }}
                          className="hidden"
                        />
                        <span>{amenity.icon}</span>
                        <span className="truncate">{amenity.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6: SAFETY & POLICIES CHECKBOXES */}
              <div className="space-y-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider block">
                  6. Safety, Rules &amp; Check-in Policies
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-1.5 bg-white border border-slate-200 p-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHotelForm.isCoupleFriendly}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, isCoupleFriendly: e.target.checked })}
                      className="accent-purple-900"
                    />
                    <span className="text-[10px] font-bold text-slate-800">Couples 18+ Welcome</span>
                  </label>

                  <label className="flex items-center gap-1.5 bg-white border border-slate-200 p-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHotelForm.acceptsLocalId}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, acceptsLocalId: e.target.checked })}
                      className="accent-purple-900"
                    />
                    <span className="text-[10px] font-bold text-slate-800">Accepts Local ID</span>
                  </label>

                  <label className="flex items-center gap-1.5 bg-white border border-slate-200 p-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHotelForm.nearStation}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, nearStation: e.target.checked })}
                      className="accent-purple-900"
                    />
                    <span className="text-[10px] font-bold text-slate-800">Near Boisar Station</span>
                  </label>

                  <label className="flex items-center gap-1.5 bg-white border border-slate-200 p-2 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHotelForm.nearMidc}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, nearMidc: e.target.checked })}
                      className="accent-purple-900"
                    />
                    <span className="text-[10px] font-bold text-slate-800">Near Tarapur MIDC</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddHotelOpen(false)}
                  className="flex-1 bg-white border border-slate-250 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-900 hover:bg-purple-950 text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Publish Hotel &amp; Rooms Listing
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Guest's All Hotel Booking Passes Modal */}
      <MyHotelPassesModal
        isOpen={isMyPassesModalOpen}
        onClose={() => {
          setIsMyPassesModalOpen(false);
          refreshUserPasses();
        }}
      />

    </div>
  );
}
