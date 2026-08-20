'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  X, MapPin, Phone, MessageCircle, Star, Users, Calendar, 
  CheckCircle2, Sparkles, Compass, Filter, Share2, 
  ChevronLeft, ChevronRight, Info, ShieldCheck, ArrowLeft,
  Search, ArrowUpDown, Bed, Bath, Utensils, Waves, Check,
  Clock, Shield, Heart, Navigation, Award, Coffee, Flame, Wifi,
  Plus, SlidersHorizontal, Ticket, Upload, Camera, Trash2,
  CheckSquare, Square
} from 'lucide-react';
import { resortsData, ResortVilla } from '@/lib/resortsData';
import { useApp } from '@/context/AppContext';
import StaycationTabSwitcher from '@/components/StaycationTabSwitcher';

function ResortsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const { showToast } = useApp();

  // All listings state (init with resortsData, allow dynamic additions)
  const [allResorts, setAllResorts] = useState<ResortVilla[]>(resortsData);
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>(
    typeParam === 'villa' || typeParam === 'villas' ? 'Private Pool Villa' : 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [selectedResort, setSelectedResort] = useState<ResortVilla | null>(null);

  // List Your Resort Modal State
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newResortForm, setNewResortForm] = useState({
    name: '',
    tagline: '',
    type: 'Private Pool Villa' as 'Beach Resort' | 'Private Pool Villa',
    area: 'Kelwa Beach' as 'Kelwa Beach' | 'Boisar' | 'Dahanu' | 'Manor / Palghar',
    location: '',
    address: '',
    pricePerNight: '',
    dayPicnicPrice: '',
    capacity: 'Up to 20 Guests',
    bedrooms: '3',
    bathrooms: '3',
    phone: '',
    whatsapp: '',
    description: '',
    mealOptions: 'Tasty local fish, chicken, mutton, and pure veg home food.',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    amenities: [
      'Big Swimming Pool',
      'Clean AC Rooms',
      'Free Wi-Fi',
      'Free Car Parking',
      'Food & Kitchen'
    ],
    highlights: [
      'Clean swimming pool open 24/7',
      'Tasty home-cooked food available',
      'Big green lawn for games and night bonfire',
      'Great for family trips and group parties'
    ],
    houseRules: [
      'Valid photo ID required for all guests',
      'No loud music in open lawn after 10:00 PM',
      'Pets allowed on request'
    ]
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Lock background body scroll when modal is open + Reset scroll to top
  useEffect(() => {
    if (isListModalOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const formEl = document.getElementById('resortListingForm');
        if (formEl) formEl.scrollTop = 0;
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isListModalOpen]);

  useEffect(() => {
    if (typeParam === 'villa' || typeParam === 'villas') {
      setSelectedType('Private Pool Villa');
    } else if (typeParam === 'resort' || typeParam === 'resorts') {
      setSelectedType('Beach Resort');
    }
  }, [typeParam]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast('📷 Photo added successfully!', 'success');
  };

  const handleRemovePhoto = (idx: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  // Toggle Amenity Check
  const availableAmenitiesList = [
    { icon: '🏊', label: 'Big Swimming Pool' },
    { icon: '❄️', label: 'Clean AC Rooms' },
    { icon: '📶', label: 'Free Wi-Fi' },
    { icon: '🚗', label: 'Free Car Parking' },
    { icon: '🍲', label: 'Food on Chulha / Kitchen' },
    { icon: '🎵', label: 'Rain Dance & DJ Music' },
    { icon: '🔥', label: 'Night Campfire & Bonfire' },
    { icon: '🍖', label: 'BBQ Grill & Sitting Area' },
    { icon: '🏖️', label: 'Direct Walk to Beach' },
    { icon: '🐕', label: '100% Pet Friendly' },
    { icon: '📽️', label: 'Movie Projector & Sound' },
    { icon: '⚡', label: '24/7 Power Backup' }
  ];

  const toggleAmenity = (label: string) => {
    setNewResortForm(prev => {
      const exists = prev.amenities.includes(label);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== label)
          : [...prev.amenities, label]
      };
    });
  };

  // Submit Listing Form
  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newResortForm.name.trim()) {
      showToast('Please enter Resort / Villa Name', 'error');
      return;
    }
    if (!newResortForm.phone || newResortForm.phone.replace(/\D/g, '').length !== 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    const priceNum = parseInt(newResortForm.pricePerNight) || 5000;
    const dayPriceNum = parseInt(newResortForm.dayPicnicPrice) || 650;
    const cleanPhone = newResortForm.phone.replace(/\D/g, '');
    const cleanWhatsapp = (newResortForm.whatsapp || newResortForm.phone).replace(/\D/g, '');

    const newProperty: ResortVilla = {
      id: `custom-res-${Date.now()}`,
      slug: newResortForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newResortForm.name,
      tagline: newResortForm.tagline || `${newResortForm.type} in ${newResortForm.area} with private pool & lawn`,
      type: newResortForm.type,
      location: newResortForm.location || newResortForm.area,
      area: newResortForm.area,
      distanceFromBoisar: 'Near Boisar / Palghar',
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      badge: '👑 NEW LISTING',
      pricePerNight: priceNum,
      dayPicnicPrice: dayPriceNum,
      capacity: newResortForm.capacity,
      bedrooms: parseInt(newResortForm.bedrooms) || 3,
      bathrooms: parseInt(newResortForm.bathrooms) || 3,
      phone: cleanPhone,
      whatsapp: cleanWhatsapp.startsWith('91') ? cleanWhatsapp : `91${cleanWhatsapp}`,
      address: newResortForm.address || `${newResortForm.area}, Palghar`,
      gallery: uploadedPhotos.length > 0 ? uploadedPhotos : [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: newResortForm.amenities.map(a => {
        const found = availableAmenitiesList.find(item => item.label === a);
        return { icon: found ? found.icon : '✨', label: a };
      }),
      highlights: newResortForm.highlights,
      houseRules: newResortForm.houseRules,
      mealOptions: newResortForm.mealOptions,
      checkInTime: newResortForm.checkInTime,
      checkOutTime: newResortForm.checkOutTime,
      description: newResortForm.description || `${newResortForm.name} is a verified ${newResortForm.type} in ${newResortForm.area}. Features swimming pool, clean AC rooms, green garden, and tasty food for your weekend holiday.`
    };

    setIsListModalOpen(false);
    showToast('⏳ Property submitted for Admin Approval! We will review and publish it soon.', 'success');

    // Generate formatted WhatsApp submission to Admin for verification and approval
    const waText = encodeURIComponent(
      `👑 *NEW RESORT / VILLA LISTING (APPROVAL REQUEST)*\n\n` +
      `🏨 *Property Name:* ${newResortForm.name}\n` +
      `🏷️ *Type:* ${newResortForm.type}\n` +
      `📍 *Location:* ${newResortForm.location || newResortForm.area}\n` +
      `💰 *Price / Night:* ₹${priceNum}\n` +
      `☀️ *Day Picnic Rate:* ₹${dayPriceNum}/person\n` +
      `👥 *Capacity:* ${newResortForm.capacity}\n` +
      `🛏️ *Bedrooms:* ${newResortForm.bedrooms} BHK (${newResortForm.bathrooms} Baths)\n` +
      `📞 *Phone / WhatsApp:* +91 ${cleanPhone}\n\n` +
      `✨ *Amenities:* ${newResortForm.amenities.join(', ')}\n\n` +
      `📸 *Photos:* Attaching ${uploadedPhotos.length} Photos in this chat.\n\n` +
      `Please review and approve this listing on Majh Boisar!`
    );

    window.open(`https://wa.me/917769947217?text=${waText}`, '_blank');
  };

  // Booking Form State inside Detail View
  const [stayType, setStayType] = useState<'night' | 'day'>('night');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [checkInDate, setCheckInDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const filteredResorts = allResorts.filter(item => {
    const matchArea = selectedArea === 'All' || item.area.includes(selectedArea);
    const matchType = selectedType === 'All' || item.type === selectedType;
    const matchSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchArea && matchType && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price_high') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const poolVillasCount = allResorts.filter(r => r.type === 'Private Pool Villa').length;
  const beachResortsCount = allResorts.filter(r => r.type === 'Beach Resort').length;

  const handleOpenDetail = (resort: ResortVilla) => {
    setSelectedResort(resort);
    setActivePhotoIdx(0);
    setBookingSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (resort: ResortVilla) => {
    if (navigator.share) {
      navigator.share({
        title: `${resort.name} - Majh Boisar Resorts`,
        text: `Check out ${resort.name} in ${resort.location}. Private pool & weekend stay packages!`,
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
      `📅 *Plan:* ${stayType === 'night' ? 'Night Stay' : 'Day Picnic (Buffet)'}\n` +
      `🗓️ *Check-in Date:* ${checkInDate}\n` +
      `👥 *Guests:* ${guestCount} People\n\n` +
      `Please share availability, discount offers & direct booking pass.`
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
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      
      {/* 1. Top Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-3 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2 text-xs truncate min-w-0">
            <Link href="/" className="text-slate-500 hover:text-teal-900 font-bold transition-colors shrink-0">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            {selectedResort ? (
              <>
                <button 
                  onClick={() => setSelectedResort(null)} 
                  className="text-slate-500 hover:text-teal-900 font-bold transition-colors cursor-pointer shrink-0"
                >
                  Resorts &amp; Villas
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-teal-900 font-black truncate">{selectedResort.name}</span>
              </>
            ) : (
              <span className="text-teal-900 font-black truncate">Resorts &amp; Pool Villas in Boisar</span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedResort && (
              <>
                <button
                  type="button"
                  onClick={() => handleShare(selectedResort)}
                  className="p-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-extrabold cursor-pointer"
                  title="Share Resort Link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedResort(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-black transition-colors cursor-pointer"
                >
                  ← Back to Resorts
                </button>
              </>
            )}
            {!selectedResort && (
              <span className="hidden sm:inline-block text-[9.5px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                0% Commission
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Staycation Top Category Switcher: Hotels / Resorts / Villas */}
      {!selectedResort && (
        <StaycationTabSwitcher activeTab={selectedType === 'Private Pool Villa' ? 'villas' : 'resorts'} />
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3">
        
        {!selectedResort ? (
          /* ============================================================== */
          /* 1. LISTINGS VIEW                                               */
          /* ============================================================== */
          <div className="space-y-4">
            
            {/* 2. Sleek & Compact Top Promo Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white rounded-2xl p-3 sm:p-4 border border-teal-500/30 shadow-sm text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    🏖️ WEEKEND DEALS
                  </span>
                  <span className="text-[11px] text-teal-300 font-semibold">
                    Kelwa Beach · Dahanu · Boisar
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-black text-white leading-snug">
                  Certified Beach Touch Resorts &amp; Private Pool Villas
                </h2>
              </div>

              <a
                href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar,%20I%20want%20to%20inquire%20about%20weekend%20resort%20and%20villa%20deals."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer self-start sm:self-auto"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>

            {/* 3. Ultra-Clean & Compact Search & Filter Control Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-2xs space-y-1.5 text-left">
              
              {/* Row 1: Search, Area & Sort in a single compact row */}
              <div className="flex items-center gap-1.5">
                
                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search resort, pool villa, area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-6 py-1 text-[11px] font-semibold text-slate-800 outline-none focus:border-teal-600 focus:bg-white transition-all placeholder:text-slate-400"
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

                {/* Area Dropdown */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 shadow-2xs shrink-0">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="bg-transparent text-[11px] font-bold text-slate-800 outline-none cursor-pointer pr-0.5"
                  >
                    <option value="All">All Locations</option>
                    <option value="Kelwa Beach">Kelwa Beach</option>
                    <option value="Boisar">Boisar</option>
                    <option value="Dahanu">Dahanu</option>
                    <option value="Manor / Palghar">Manor / Palghar</option>
                  </select>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 shadow-2xs shrink-0">
                  <ArrowUpDown className="w-3 h-3 text-teal-700 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-[11px] font-bold text-slate-800 outline-none cursor-pointer pr-0.5"
                  >
                    <option value="recommended">Featured</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

              </div>

              {/* Row 2: Filter Pills (Ultra-compact horizontal scroll) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none border-t border-slate-100 pt-1">
                {[
                  { id: 'All', label: 'All Stays' },
                  { id: 'Private Pool Villa', label: '🏊 Pool Villas' },
                  { id: 'Beach Resort', label: '🏖️ Beach Resorts' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedType === tab.id
                        ? 'bg-teal-700 text-white font-black shadow-2xs'
                        : 'bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-950 border border-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                {(selectedType !== 'All' || selectedArea !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedType('All');
                      setSelectedArea('All');
                      setSearchQuery('');
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-rose-600 underline px-1.5 shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1 text-left">
              <span>{filteredResorts.length} Properties Available</span>
              <span className="text-teal-700 font-black">
                ✓ WhatsApp / Call Caretaker Directly
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredResorts.map(resort => (
                <div
                  key={resort.id}
                  onClick={() => handleOpenDetail(resort)}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group text-left"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={resort.gallery[0]}
                      alt={resort.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
                      {resort.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                          {resort.badge}
                        </span>
                      )}
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                        {resort.type}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="bg-emerald-600 text-white text-[10.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>{resort.rating}</span>
                        <span className="text-emerald-100 text-[9px]">({resort.reviewsCount})</span>
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 z-10">
                      <span className="bg-slate-950/80 backdrop-blur-xs text-slate-200 text-[9.5px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Compass className="w-3 h-3 text-cyan-400" />
                        <span>{resort.distanceFromBoisar}</span>
                      </span>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <h2 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-1">
                        {resort.name}
                      </h2>
                      <p className="text-[11.5px] text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{resort.location}</span>
                      </p>
                      <p className="text-xs text-slate-600 font-normal line-clamp-1 mt-1 leading-normal">
                        {resort.tagline}
                      </p>
                    </div>

                    {/* Amenities Preview: Clean & Spacious Chips */}
                    <div className="flex items-center gap-1.5 pt-0.5 text-slate-600 text-xs overflow-hidden">
                      {resort.amenities.slice(0, 3).map((amenity, aIdx) => (
                        <span key={aIdx} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded-md shrink-0">
                          <span>{amenity.icon}</span>
                          <span className="truncate max-w-[90px]">{amenity.label.split('&')[0]}</span>
                        </span>
                      ))}
                      {resort.amenities.length > 3 && (
                        <span className="text-[10.5px] font-black text-teal-700 shrink-0">
                          +{resort.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Pricing & Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[9.5px] text-slate-400 font-bold block uppercase tracking-wider">Stay &amp; Day Rates</span>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-slate-950">
                            ₹{resort.pricePerNight.toLocaleString('en-IN')}<span className="text-[10px] text-slate-500 font-bold">/night</span>
                          </span>
                          {resort.dayPicnicPrice && (
                            <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-200">
                              ☀️ Day: ₹{resort.dayPicnicPrice}/person
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppBooking(resort);
                          }}
                          className="w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(resort)}
                          className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black transition-all shadow-2xs cursor-pointer active:scale-95"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* 4. Luxury Bottom Banner: Add Your Resort */}
            <div 
              style={{ background: 'linear-gradient(135deg, #180630 0%, #2b0c50 50%, #120424 100%)', color: '#ffffff' }}
              className="rounded-3xl p-5 sm:p-6 mt-8 border border-amber-400/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center text-xl shrink-0">
                  <Waves className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    Are you a Resort or Pool Villa Owner in Boisar / Kelwa?
                  </h3>
                  <p className="text-xs text-purple-200 font-medium mt-0.5">
                    List your property on Majh Boisar and get instant day-picnic &amp; night bookings.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase tracking-wider active:scale-95 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>Add Your Resort</span>
              </button>
            </div>

          </div>
        ) : (
          /* ============================================================== */
          /* 2. ✨ LUXURY & ULTRA-ATTRACTIVE DETAIL VIEW                    */
          /* ============================================================== */
          <div className="space-y-4 text-left">
            
            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column (7 Cols) - Luxury Visual Experience */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 🌟 1. Luxury Photo Gallery Carousel */}
                <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm space-y-2.5">
                  <div className="relative aspect-[16/9] max-h-[290px] w-full rounded-2xl overflow-hidden bg-slate-950 group">
                    <img
                      src={selectedResort.gallery[activePhotoIdx] || selectedResort.gallery[0]}
                      alt={selectedResort.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
                      {selectedResort.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow-md uppercase tracking-wider">
                          {selectedResort.badge}
                        </span>
                      )}
                      <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                        {selectedResort.type}
                      </span>
                    </div>

                    {/* Photo Counter Pill */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        📷 {activePhotoIdx + 1} / {selectedResort.gallery.length}
                      </span>
                    </div>

                    {/* Left/Right Buttons */}
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx(prev => (prev === 0 ? selectedResort.gallery.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx(prev => (prev === selectedResort.gallery.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Glowing Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {selectedResort.gallery.map((thumb, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`w-20 h-13 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0 bg-slate-100 ${
                          activePhotoIdx === idx ? 'border-teal-600 ring-2 ring-teal-600/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🌟 2. Property Title & Verified Stats */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        <span>{selectedResort.rating}</span>
                        <span className="text-emerald-100 text-[10px]">({selectedResort.reviewsCount} reviews)</span>
                      </span>
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                        <Compass className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{selectedResort.distanceFromBoisar}</span>
                      </span>
                    </div>

                    <span className="bg-teal-50 text-teal-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Verified Stay
                    </span>
                  </div>

                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {selectedResort.name}
                    </h1>
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{selectedResort.address}</span>
                    </p>
                  </div>

                  {/* 4 Luxury Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Capacity</span>
                      <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-teal-700" /> {selectedResort.capacity}
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bedrooms</span>
                      <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-teal-700" /> {selectedResort.bedrooms} AC Rooms
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bathrooms</span>
                      <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-teal-700" /> {selectedResort.bathrooms} Attached
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pool Type</span>
                      <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                        <Waves className="w-3.5 h-3.5 text-cyan-600" /> Private / Big
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-1">
                    {selectedResort.description}
                  </p>
                </div>

                {/* 🌟 3. Highlights Cards */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      ✨ What Makes This Place Special
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedResort.highlights.map((high, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 font-black" />
                        </div>
                        <span className="text-xs text-slate-800 font-bold leading-snug">{high}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🌟 4. Amenities Badges */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Things Included In Your Stay ({selectedResort.amenities.length})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {selectedResort.amenities.map((amenity, idx) => (
                      <div 
                        key={idx} 
                        className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-all gap-1.5"
                      >
                        <span className="text-2xl">{amenity.icon}</span>
                        <span className="text-[11px] font-black text-slate-800 leading-tight">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 🌟 5. Food & Dining Experience Card */}
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/70 p-4 sm:p-5 rounded-3xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-amber-700" /> Food &amp; Meals
                    </h3>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                      Fresh &amp; Hot
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                    {selectedResort.mealOptions}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="bg-white/90 border border-amber-300 text-amber-900 text-[10.5px] font-bold px-2.5 py-1 rounded-xl">
                      🦀 Agri-Koli Seafood
                    </span>
                    <span className="bg-white/90 border border-amber-300 text-amber-900 text-[10.5px] font-bold px-2.5 py-1 rounded-xl">
                      🍗 Chicken &amp; Mutton Sukka
                    </span>
                    <span className="bg-white/90 border border-amber-300 text-amber-900 text-[10.5px] font-bold px-2.5 py-1 rounded-xl">
                      🥗 Pure Veg Thali
                    </span>
                    <span className="bg-white/90 border border-amber-300 text-amber-900 text-[10.5px] font-bold px-2.5 py-1 rounded-xl">
                      ☕ Evening High-Tea
                    </span>
                  </div>
                </div>

                {/* 🌟 6. House Rules & Timings */}
                <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm space-y-2.5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-700" /> House Rules &amp; Timings
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pb-1">
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Check-in</span>
                      <span>🕒 {selectedResort.checkInTime}</span>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase">Check-out</span>
                      <span>🕙 {selectedResort.checkOutTime}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {selectedResort.houseRules.map((rule, idx) => (
                      <div key={idx} className="text-xs text-slate-600 font-medium flex items-center gap-2">
                        <span className="text-teal-700 font-black">✓</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (5 Cols) - Sticky Luxury Booking Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-18 space-y-3.5">
                
                <div className="bg-white rounded-3xl border-2 border-teal-600/30 p-5 shadow-xl space-y-4">
                  
                  {/* Pricing Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Booking Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-950">
                          ₹{stayType === 'night' ? selectedResort.pricePerNight.toLocaleString('en-IN') : (selectedResort.dayPicnicPrice ? (selectedResort.dayPicnicPrice * guestCount).toLocaleString('en-IN') : selectedResort.pricePerNight.toLocaleString('en-IN'))}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">
                          {stayType === 'night' ? '/ night' : `for ${guestCount} people (Day Picnic Buffet)`}
                        </span>
                      </div>
                    </div>

                    <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-xl shadow-xs">
                      0% Commission
                    </span>
                  </div>

                  {/* Plan Switcher */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setStayType('night')}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        stayType === 'night' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🌙 Night Stay
                    </button>

                    <button
                      type="button"
                      onClick={() => setStayType('day')}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        stayType === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      ☀️ Day Picnic (Buffet)
                    </button>
                  </div>

                  {/* Quick Input Fields */}
                  <form onSubmit={handleConfirmBookingPass} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Select Date*
                      </label>
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Total Guests ({guestCount} People)*
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[2, 4, 8, 12, 20].map(count => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setGuestCount(count)}
                            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                              guestCount === count ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-900 outline-none focus:border-teal-600 focus:bg-white placeholder:text-slate-400"
                      />
                    </div>

                    {bookingSuccess ? (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                        <div className="text-xs font-black text-emerald-900 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Request Sent Successfully!
                        </div>
                        <p className="text-xs text-emerald-800 font-medium">
                          You can also chat on WhatsApp below for fast reply.
                        </p>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-98"
                      >
                        Send Booking Request
                      </button>
                    )}
                  </form>

                  {/* Direct Contact CTAs */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppBooking(selectedResort)}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </button>

                    <a
                      href={`tel:${selectedResort.phone}`}
                      className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center justify-center gap-2 transition-all"
                    >
                      <Phone className="w-4 h-4 text-teal-700" />
                      <span>Call Manager (+91 {selectedResort.phone})</span>
                    </a>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center space-y-0.5">
                    <p className="text-[10px] text-slate-600 font-bold flex items-center justify-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Best Price Guarantee
                    </p>
                    <p className="text-[9.5px] text-slate-400 font-medium">
                      No extra middleman fees · Direct booking with manager
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* 5. 👑 COMPLETE "LIST YOUR RESORT / VILLA" INTERACTIVE MODAL     */}
      {/* ============================================================== */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs p-2 sm:p-4 flex min-h-full items-start justify-center">
          
          {/* Backdrop Click to Close */}
          <div 
            className="fixed inset-0 cursor-pointer" 
            onClick={() => setIsListModalOpen(false)} 
          />

          {/* Modal Container: Safe min-h / max-h without negative top clipping */}
          <div className="relative bg-white rounded-3xl max-w-2xl w-full my-4 flex flex-col shadow-2xl border border-slate-300 overflow-hidden text-left z-10 max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* 🌟 Slim & Sleek Fixed Header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-teal-900/60 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>👑 List Your Resort / Villa</span>
                </span>
                <span className="bg-amber-400 text-slate-950 text-[9.5px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  0% Commission
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 🌟 Scrollable Form Body */}
            <form id="resortListingForm" onSubmit={handleSubmitListing} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs bg-slate-100/70">
              
              {/* 1. Basic Information */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <span>🏨 1. Basic Property Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Resort / Villa Name*
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sea Breeze Resort / Palms Villa"
                      value={newResortForm.name}
                      onChange={(e) => setNewResortForm({ ...newResortForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Property Category*
                    </label>
                    <select
                      value={newResortForm.type}
                      onChange={(e) => setNewResortForm({ ...newResortForm, type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Private Pool Villa">🏊 Private Pool Villa</option>
                      <option value="Beach Resort">🏖️ Beach Resort</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                    Short Tagline / Catchy Summary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4BHK Luxury Pool Villa with private lawn, chulha food & BBQ"
                    value={newResortForm.tagline}
                    onChange={(e) => setNewResortForm({ ...newResortForm, tagline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Area / Location*
                    </label>
                    <select
                      value={newResortForm.area}
                      onChange={(e) => setNewResortForm({ ...newResortForm, area: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Kelwa Beach">Kelwa Beach</option>
                      <option value="Boisar">Boisar</option>
                      <option value="Dahanu">Dahanu</option>
                      <option value="Manor / Palghar">Manor / Palghar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Sitladevi Temple / MIDC"
                      value={newResortForm.location}
                      onChange={(e) => setNewResortForm({ ...newResortForm, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                    Full Address*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Survey 88, Main Beach Road, Kelwa - 401401"
                    value={newResortForm.address}
                    onChange={(e) => setNewResortForm({ ...newResortForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                    About Property (Description)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe your resort/villa, atmosphere, garden, and why guests will love it..."
                    value={newResortForm.description}
                    onChange={(e) => setNewResortForm({ ...newResortForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* 2. Pricing & Room Specs */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <span>💰 2. Stay Pricing &amp; Capacity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      🌙 Night Stay Price (₹ / night)*
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5500"
                      value={newResortForm.pricePerNight}
                      onChange={(e) => setNewResortForm({ ...newResortForm, pricePerNight: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      ☀️ Day Picnic Rate (₹ / person with food)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 750"
                      value={newResortForm.dayPicnicPrice}
                      onChange={(e) => setNewResortForm({ ...newResortForm, dayPicnicPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="3 BHK"
                      value={newResortForm.bedrooms}
                      onChange={(e) => setNewResortForm({ ...newResortForm, bedrooms: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 text-center outline-none focus:border-teal-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="3 Baths"
                      value={newResortForm.bathrooms}
                      onChange={(e) => setNewResortForm({ ...newResortForm, bathrooms: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 text-center outline-none focus:border-teal-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Max Guests
                    </label>
                    <input
                      type="text"
                      placeholder="Up to 25"
                      value={newResortForm.capacity}
                      onChange={(e) => setNewResortForm({ ...newResortForm, capacity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 text-center outline-none focus:border-teal-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Photos Upload & Gallery */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📷 3. Property Photos ({uploadedPhotos.length})</span>
                  </h3>

                  <label className="px-3.5 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-black cursor-pointer transition-all flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5 text-amber-300" />
                    <span>Upload Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadedPhotos.length === 0 ? (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl bg-slate-50 hover:bg-teal-50/40 cursor-pointer transition-all gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                      <Camera className="w-6 h-6 text-slate-500 group-hover:text-teal-700 transition-colors" />
                    </div>
                    <span className="text-xs font-black text-slate-800">Click to upload photos from your device</span>
                    <span className="text-[10.5px] text-slate-500 font-medium">Select swimming pool, bedrooms, garden &amp; dining photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                      {uploadedPhotos.map((photo, pIdx) => (
                        <div key={pIdx} className="relative w-24 h-18 rounded-xl overflow-hidden border-2 border-slate-300 shrink-0 group shadow-2xs">
                          <img src={photo} alt="resort preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(pIdx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black opacity-90 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                            title="Remove Photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      ✓ {uploadedPhotos.length} photo(s) selected. You can also send more photos directly on WhatsApp!
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Amenities Selection - 100% Bulletproof Dark Text & Green Checkbox */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    🏊 4. Select Amenities Included
                  </h3>
                  <span className="text-[10.5px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {newResortForm.amenities.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {availableAmenitiesList.map((amenity, aIdx) => {
                    const isSelected = newResortForm.amenities.includes(amenity.label);
                    return (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => toggleAmenity(amenity.label)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer border-2 ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                          isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 border border-slate-300 text-transparent'
                        }`}>
                          ✓
                        </div>
                        <span className="text-base shrink-0">{amenity.icon}</span>
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-teal-950 font-black' : 'text-slate-800'}`}>
                          {amenity.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Food, Meals & Policies */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  🍲 5. Food, Meals &amp; Stay Timings
                </h3>

                <div>
                  <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                    Food &amp; Dining Facilities
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unlimited Agri-Koli Seafood, Veg Thali, Chicken sukka, Self-cooking kitchen, Cook available"
                    value={newResortForm.mealOptions}
                    onChange={(e) => setNewResortForm({ ...newResortForm, mealOptions: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Check-in Time
                    </label>
                    <input
                      type="text"
                      value={newResortForm.checkInTime}
                      onChange={(e) => setNewResortForm({ ...newResortForm, checkInTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-800 uppercase mb-1">
                      Check-out Time
                    </label>
                    <input
                      type="text"
                      value={newResortForm.checkOutTime}
                      onChange={(e) => setNewResortForm({ ...newResortForm, checkOutTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Owner / Manager Contact Details */}
              <div className="space-y-3 bg-teal-50 border border-teal-300 p-4 rounded-2xl shadow-2xs">
                <h3 className="text-xs font-black text-teal-950 uppercase tracking-wider border-b border-teal-200 pb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>📞 6. Owner / Caretaker Direct Contact Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-teal-950 uppercase mb-1">
                      Calling Phone Number*
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit calling number"
                      value={newResortForm.phone}
                      onChange={(e) => setNewResortForm({ ...newResortForm, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-teal-400 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-teal-600 placeholder:text-slate-400 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-teal-950 uppercase mb-1">
                      WhatsApp Booking Number*
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit WhatsApp number"
                      value={newResortForm.whatsapp}
                      onChange={(e) => setNewResortForm({ ...newResortForm, whatsapp: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-white border border-teal-400 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none focus:ring-2 focus:ring-teal-600 placeholder:text-slate-400 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

            </form>

            {/* 🌟 Slim & Compact Sticky Bottom Action Bar */}
            <div className="px-4 py-2.5 bg-white border-t border-slate-200 shadow-md flex items-center justify-end gap-2.5 shrink-0 z-20">
              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="resortListingForm"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Submit for Approval</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ResortsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-bold">Loading Resorts...</div>}>
      <ResortsPageContent />
    </React.Suspense>
  );
}
