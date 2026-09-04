'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  BedDouble, 
  Clock, 
  Calendar,
  X,
  ArrowRight,
  Share2,
  Bookmark,
  Eye,
  Activity,
  HeartHandshake,
  Info,
  Check,
  Send,
  Lock,
  Ticket,
  Navigation,
  Compass,
  Tag,
  Utensils,
  Coffee,
  Map,
  Camera,
  Train,
  Wind,
  Wifi,
  Bath,
  Car,
  Tv,
  Zap,
  CheckSquare,
  QrCode
} from 'lucide-react';
import { BOISAR_HOTELS, HotelItem, getHotelBySlugOrId, recordHotelClick, calculateStayWindow } from '@/lib/hotelsData';
import { useApp } from '@/context/AppContext';
import HotelTimePicker from '@/components/HotelTimePicker';
import MyHotelPassesModal from '@/components/MyHotelPassesModal';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { loggedInUser, isLoggedIn, setLoginModalOpen } = useApp();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const id = params?.id as string;
  const [hotel, setHotel] = useState<HotelItem | null>(null);

  // Gallery Active Index & Touch Swipe
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryModalIdx, setGalleryModalIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Lock background body scroll when gallery modal is open
  useEffect(() => {
    if (isGalleryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isGalleryModalOpen]);

  // All photos combined (gallery + room photos)
  const allPhotos = useMemo(() => {
    if (!hotel) return [];
    const list = [...hotel.gallery];
    if (hotel.rooms) {
      hotel.rooms.forEach(r => {
        if (r.image && !list.includes(r.image)) {
          list.push(r.image);
        }
      });
    }
    return list;
  }, [hotel]);

  // Auto-populate guest contact details when user is logged in
  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.name) setGuestName(loggedInUser.name);
      if (loggedInUser.phone) setGuestPhone(loggedInUser.phone);
    }
  }, [loggedInUser]);

  // Keyboard navigation for gallery modal
  useEffect(() => {
    if (!isGalleryModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryModalOpen(false);
      if (e.key === 'ArrowRight') setGalleryModalIdx(prev => (prev + 1) % allPhotos.length);
      if (e.key === 'ArrowLeft') setGalleryModalIdx(prev => (prev - 1 + allPhotos.length) % allPhotos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryModalOpen, allPhotos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !hotel) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45) {
      // Swiped Left -> Next Photo
      setActivePhotoIdx((prev) => (prev + 1) % hotel.gallery.length);
    } else if (distance < -45) {
      // Swiped Right -> Previous Photo
      setActivePhotoIdx((prev) => (prev - 1 + hotel.gallery.length) % hotel.gallery.length);
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Booking Form States
  const [stayMode, setStayMode] = useState<'hourly' | 'night'>('hourly');
  const [hourlySlot, setHourlySlot] = useState<'3h' | '6h' | '12h'>('3h');
  const [checkInTime, setCheckInTime] = useState('11:00 AM');
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedRoomId, setSelectedRoomId] = useState('r1');
  const [roomTypePreference, setRoomTypePreference] = useState<'ac' | 'non_ac'>('ac');
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestsCount, setGuestsCount] = useState(2);

  // Guest Details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card (Local / Outstation Accepted)');
  const [specialRequest, setSpecialRequest] = useState('');

  // Confirmation & Digital Pass
  const [bookingSuccessPass, setBookingSuccessPass] = useState<any>(null);
  const [isMyPassesModalOpen, setIsMyPassesModalOpen] = useState(false);
  const [userPassCount, setUserPassCount] = useState(0);

  // Real-time Click & View stats
  const [analyticsData, setAnalyticsData] = useState<{ views: number; clicks: number; whatsapp: number; call: number; book: number } | null>(null);

  // Reviews list
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Live Room Availability from Hotelier Desk
  const [roomAvailability, setRoomAvailability] = useState<{ ac: boolean; non_ac: boolean }>({ ac: true, non_ac: true });

  // Coupon System (e.g. BOISAR100, WELCOME50, MAJHBOISAR)
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showCouponBox, setShowCouponBox] = useState(false);

  // Function to refresh user's passes count
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

  useEffect(() => {
    if (!id) return;
    const found = getHotelBySlugOrId(id);
    if (found) {
      setHotel(found);

      // Load Room Availability for this Hotel
      try {
        const savedAvail = localStorage.getItem(`majh_boisar_hotel_availability_${found.id}`);
        if (savedAvail) {
          const parsed = JSON.parse(savedAvail);
          setRoomAvailability(parsed);
          if (!parsed.ac && parsed.non_ac) {
            setRoomTypePreference('non_ac');
          }
        }
      } catch (e) {}

      try {
        const saved = JSON.parse(localStorage.getItem(`majh_boisar_hotel_reviews_${found.id}`) || '[]');
        setReviewsList([...saved, ...(found.reviews || [])]);
      } catch (e) {
        setReviewsList(found.reviews || []);
      }
      recordHotelClick(found.id, 'view');
      
      // Load Analytics
      try {
        const stored = JSON.parse(localStorage.getItem('majh_boisar_hotel_analytics') || '{}');
        const hotelStats = stored[found.id] || { 
          views: found.viewsCount || 342, 
          clicks: found.clicksCount || 89, 
          whatsapp: 42, 
          call: 28, 
          book: found.bookingsCount || 19 
        };
        setAnalyticsData(hotelStats);
      } catch (e) {}
    }

    if (loggedInUser) {
      setGuestName(loggedInUser.name || '');
      setGuestPhone(loggedInUser.phone || '');
    }
  }, [id, loggedInUser]);

  // Price Calculation with AC / Non-AC
  const totalTariff = useMemo(() => {
    if (!hotel) return 0;
    const isAc = roomTypePreference === 'ac';
    const rate3h = isAc ? hotel.hourlyRate3h : Math.max(399, hotel.hourlyRate3h - 200);
    const rate6h = isAc ? hotel.hourlyRate6h : Math.max(599, hotel.hourlyRate6h - 300);
    const rate12h = isAc ? hotel.hourlyRate12h : Math.max(899, hotel.hourlyRate12h - 400);
    const nightRate = isAc ? hotel.nightRate : Math.max(999, hotel.nightRate - 500);

    if (stayMode === 'hourly') {
      const base = hourlySlot === '3h' ? rate3h : hourlySlot === '6h' ? rate6h : rate12h;
      return base * roomsCount;
    } else {
      try {
        const d1 = new Date(checkInDate);
        const d2 = new Date(checkOutDate);
        const diffTime = Math.max(d2.getTime() - d1.getTime(), 86400000);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return nightRate * diffDays * roomsCount;
      } catch (e) {
        return nightRate * roomsCount;
      }
    }
  }, [hotel, roomTypePreference, stayMode, hourlySlot, checkInDate, checkOutDate, roomsCount]);

  // Handle Coupon Apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'BOISAR100') {
      const discount = Math.min(100, Math.floor(totalTariff * 0.4));
      setAppliedCoupon({ code, discount, label: '₹100 City Pass Discount' });
      setCouponInput('');
    } else if (code === 'WELCOME50' || code === 'FIRSTSTAY') {
      setAppliedCoupon({ code, discount: 50, label: '₹50 Welcome Guest Discount' });
      setCouponInput('');
    } else if (code === 'MAJHBOISAR') {
      const discount = Math.round(totalTariff * 0.1);
      setAppliedCoupon({ code, discount, label: '10% Platform Special Discount' });
      setCouponInput('');
    } else {
      setCouponError('Invalid code. Try "BOISAR100", "WELCOME50" or "MAJHBOISAR"');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const finalPayableTariff = useMemo(() => {
    if (!appliedCoupon) return totalTariff;
    return Math.max(1, totalTariff - appliedCoupon.discount);
  }, [totalTariff, appliedCoupon]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Building2 className="w-12 h-12 text-slate-300 animate-bounce mb-3" />
        <h2 className="text-lg font-black text-slate-800">Finding Hotel Details...</h2>
        <p className="text-xs text-slate-500 mt-1">If page doesn't load, please return to hotel listings.</p>
        <Link href="/hotels" className="mt-4 text-xs font-black text-white bg-purple-900 px-4 py-2 rounded-xl">
          ← Back to All Hotels
        </Link>
      </div>
    );
  }

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      alert('🔒 Please sign in first with your mobile number to confirm your booking and generate your digital pass.');
      return;
    }
    if (!guestName.trim() || !guestPhone.trim()) {
      alert('Please provide your full name and 10-digit mobile number.');
      return;
    }

    const calculatedWindow = calculateStayWindow(checkInTime, hourlySlot).fullWindowStr;
    const ref = `MB-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const passObj = {
      id: ref,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelPhone: hotel.phone,
      hotelAddress: hotel.address,
      stayType: stayMode === 'hourly' ? `Hourly (${hourlySlot})` : 'Night Stay',
      timeSlot: stayMode === 'hourly' ? calculatedWindow : 'Overnight Check-in',
      date: checkInDate,
      checkOutDate: stayMode === 'night' ? checkOutDate : null,
      roomCategory: roomTypePreference === 'ac' ? '❄️ AC Room' : '🌀 Non-AC Room',
      assignedRoom: 'Allotted at Front Desk',
      roomsCount,
      guestsCount,
      guestName,
      guestPhone,
      idProofType,
      specialRequest,
      totalAmount: finalPayableTariff,
      originalAmount: totalTariff,
      couponCode: appliedCoupon?.code || null,
      discountAmount: appliedCoupon?.discount || 0,
      createdAt: new Date().toLocaleString()
    };

    recordHotelClick(hotel.id, 'book');

    try {
      // 1. Save Hotel Booking Pass
      const existing = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify([passObj, ...existing]));

      // 2. Create Instant Enquiry / Lead in Dashboard Leads Inbox
      const roomLabel = roomTypePreference === 'ac' ? 'Deluxe AC Room' : 'Standard Non-AC Room';
      const newLead = {
        id: `lead_htl_${Date.now()}`,
        businessId: Number(hotel.id.replace(/\D/g, '')) || 0,
        hotelId: hotel.id,
        customerName: guestName,
        customerPhone: guestPhone,
        customerEmail: '',
        query: `🏨 New Room Booking: ${roomLabel} (${stayMode === 'hourly' ? `Hourly ${hourlySlot} [${calculatedWindow}]` : 'Night Stay'}) on ${checkInDate}. Tariff: ₹${finalPayableTariff} (Pay at Reception). Pass Ref: ${ref}`,
        status: 'New Hotel Booking',
        createdAt: new Date().toISOString(),
        notes: `Pass Ref: ${ref} · Stay: ${stayMode === 'hourly' ? `${hourlySlot}` : 'Night Stay'} · Guests: ${guestsCount} · Rooms: ${roomsCount}`
      };

      const existingLeads = JSON.parse(localStorage.getItem('majh_boisar_leads') || '[]');
      localStorage.setItem('majh_boisar_leads', JSON.stringify([newLead, ...existingLeads]));

      // 3. Create Real-Time Push Notification for Hotelier
      const newNotif = {
        id: `notif_${Date.now()}`,
        title: '🔔 New Hotel Room Booking Received!',
        message: `${guestName} (${guestPhone}) booked ${roomLabel} for ₹${finalPayableTariff}. Time: ${stayMode === 'hourly' ? `${hourlySlot} (${calculatedWindow})` : 'Night Stay'}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        link: '/dashboard?tab=hotel_bookings'
      };

      const existingNotifs = JSON.parse(localStorage.getItem('majh_boisar_notifications') || '[]');
      localStorage.setItem('majh_boisar_notifications', JSON.stringify([newNotif, ...existingNotifs]));

      // Dispatch global events for instant dashboard & notification bell sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('boisar_new_hotel_booking', { detail: passObj }));
      }
    } catch (e) {}

    setBookingSuccessPass(passObj);
  };

  // WhatsApp Instant Booking
  const openWhatsApp = () => {
    recordHotelClick(hotel.id, 'whatsapp');
    const calculatedWindow = calculateStayWindow(checkInTime, hourlySlot).fullWindowStr;
    const msg = encodeURIComponent(
      `Hello ${hotel.name},\nI am booking a room on Majh Boisar.\n\n🏨 Hotel: ${hotel.name}\n📍 Location: ${hotel.location}\n⏰ Stay: ${stayMode === 'hourly' ? `Hourly (${hourlySlot}) - ${calculatedWindow}` : 'Night Stay'}\n📅 Date: ${checkInDate}\n👤 Guest: ${guestName || 'Customer'}\n💰 Amount: ₹${totalTariff}\n\nPlease confirm room booking.`
    );
    window.open(`https://wa.me/${hotel.whatsapp}?text=${msg}`, '_blank');
  };

  // Share Hotel Link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Hotel booking link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 text-left">
      
      {/* Top Header & Breadcrumbs (Non-sticky to prevent navbar collision) */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs truncate">
            <Link href="/" className="text-slate-500 hover:text-purple-900 font-bold transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/hotels" className="text-slate-500 hover:text-purple-900 font-bold transition-colors">Hotels in Boisar</Link>
            <span className="text-slate-300">/</span>
            <span className="text-purple-900 font-black truncate">{hotel.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLoggedIn && userPassCount > 0 && (
              <button
                type="button"
                onClick={() => setIsMyPassesModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Ticket className="w-3.5 h-3.5 text-slate-950" />
                <span>My Passes ({userPassCount})</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-extrabold cursor-pointer"
              title="Share Hotel Link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <Link
              href="/hotels"
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-black transition-colors"
            >
              ← Back to Hotels
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        


        {/* Top Section: Photo Gallery Grid + Hotel Info & Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Photo Gallery & Hotel Information */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Multi-Photo Showcase Box (Mosaic with Touch Swipe & Click to Open Full Gallery) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-3.5 shadow-2xs">
              
              <div className="flex flex-col sm:flex-row gap-2.5 h-[240px] sm:h-[290px] w-full">
                
                {/* Left: Main Photo (Touch Swipeable & In-place Click to Open Modal) */}
                <div 
                  onClick={() => {
                    setGalleryModalIdx(activePhotoIdx);
                    setIsGalleryModalOpen(true);
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="flex-1 h-full rounded-2xl overflow-hidden bg-slate-950 cursor-pointer group shadow-inner relative select-none touch-pan-y"
                  title="Click to view all full size photos"
                >
                  <img 
                    src={allPhotos[activePhotoIdx] || hotel.gallery[0]} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none" 
                  />

                  {/* Nav Arrows */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((activePhotoIdx - 1 + hotel.gallery.length) % hotel.gallery.length);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all z-20"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((activePhotoIdx + 1) % hotel.gallery.length);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer transition-all z-20"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Photo Counter & Full View CTA */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryModalIdx(activePhotoIdx);
                      setIsGalleryModalOpen(true);
                    }}
                    className="absolute bottom-2.5 right-2.5 bg-slate-950/85 hover:bg-purple-900 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/20 z-10 flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>{activePhotoIdx + 1}/{allPhotos.length}</span>
                    <span className="text-amber-300 font-extrabold ml-0.5">· View All</span>
                  </div>
                </div>

                {/* Right: 2 Stacked Side Photos */}
                <div style={{ width: '230px', minWidth: '230px' }} className="hidden sm:flex flex-col gap-2 h-full shrink-0">
                  {/* Side Photo 1 */}
                  <div 
                    onClick={() => {
                      setGalleryModalIdx(1 % allPhotos.length);
                      setIsGalleryModalOpen(true);
                    }}
                    className={`flex-1 rounded-2xl overflow-hidden relative cursor-pointer border-2 transition-all bg-slate-900 ${
                      activePhotoIdx === (1 % hotel.gallery.length) ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-slate-200 hover:opacity-90'
                    }`}
                    title="Click to view photo"
                  >
                    <img 
                      src={allPhotos[1] || hotel.gallery[0]} 
                      alt="Room View 2" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  {/* Side Photo 2 with +Count */}
                  <div 
                    onClick={() => {
                      setGalleryModalIdx(2 % allPhotos.length);
                      setIsGalleryModalOpen(true);
                    }}
                    className={`flex-1 rounded-2xl overflow-hidden relative cursor-pointer border-2 transition-all bg-slate-900 group ${
                      activePhotoIdx === (2 % hotel.gallery.length) ? 'border-purple-600 ring-2 ring-purple-600/30' : 'border-slate-200'
                    }`}
                    title="Click to open all photos"
                  >
                    <img 
                      src={allPhotos[2] || hotel.gallery[0]} 
                      alt="Room View 3" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-slate-950/65 group-hover:bg-slate-950/45 backdrop-blur-[1px] transition-colors flex flex-col items-center justify-center text-white cursor-pointer">
                      <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">
                        +{Math.max(1, allPhotos.length - 2)}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        View All Photos
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Section 1: Hotel Title & Core Details (Perfect Mobile & Desktop Grid Alignment) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3.5 sm:p-5 shadow-2xs space-y-3.5 text-left">
              
              {/* Top Meta Bar: 100% Aligned on Mobile */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
                    {hotel.badge?.replace(/[♦★⭐⚡]/g, '').trim() || 'FEATURED'}
                  </span>
                  <span className="bg-emerald-600 text-white text-[11px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{hotel.rating}</span>
                    <span className="text-emerald-100 font-medium text-[10px]">({hotel.reviewsCount})</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address} Boisar`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold border border-slate-200"
                    title="Open in Google Maps"
                  >
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Map</span>
                  </a>

                  <a
                    href={`tel:${hotel.phone}`}
                    onClick={() => recordHotelClick(hotel.id, 'call')}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 transition-colors flex items-center gap-1 text-xs font-black border border-purple-200 shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-900" />
                    <span>Call Hotel</span>
                  </a>
                </div>
              </div>

              {/* Title & Address */}
              <div className="space-y-1">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                  {hotel.name}
                </h1>
                {hotel.tagline && (
                  <p className="text-xs text-purple-900 font-bold">{hotel.tagline}</p>
                )}
                <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5 pt-0.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{hotel.address}</span>
                </p>
              </div>

              {/* Station & MIDC Proximity: Balanced 2-Column Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span className="truncate">{(hotel as any).stationDistance || (hotel.nearStation ? '3 mins to Boisar Station' : '8 mins to Station')}</span>
                </div>
                <div className="bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  <span className="truncate">{(hotel as any).midcDistance || (hotel.nearMidc ? '5 mins to Tarapur MIDC' : '5 mins to MIDC')}</span>
                </div>
              </div>

              {/* 3 Core Value Highlights: Balanced 3-Column Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100 text-[11px] sm:text-xs font-bold text-center">
                <div className="bg-purple-50 text-purple-950 px-1.5 py-1.5 rounded-xl border border-purple-100 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3 text-purple-700 shrink-0" />
                  <span className="truncate">Couples 18+</span>
                </div>
                <div className="bg-emerald-50 text-emerald-950 px-1.5 py-1.5 rounded-xl border border-emerald-100 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span className="truncate">100% Safe</span>
                </div>
                <div className="bg-amber-50 text-amber-950 px-1.5 py-1.5 rounded-xl border border-amber-100 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700 shrink-0" />
                  <span className="truncate">24/7 Check-in</span>
                </div>
              </div>

              {/* What is in the room: Clean Lucide Icons Row like Card */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  What is in the room:
                </span>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
                  <span className="flex items-center gap-1.5 font-bold" title="Free Fast Wi-Fi">
                    <Wifi className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">Wi-Fi</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold" title="AC Rooms">
                    <Wind className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">AC</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold" title="Free Parking">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">Parking</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold" title="TV">
                    <Tv className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">TV</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold" title="Hot Water Shower">
                    <Bath className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">Hot Water</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold" title="Clean Bedding">
                    <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-700">Clean Linens</span>
                  </span>
                </div>
              </div>

            </div>



            {/* Section 3: Simple House Rules (Balanced & Clean) */}
            <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-3.5 sm:p-4 shadow-2xs space-y-2.5 text-left">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                <h3 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Simple House Rules</span>
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  Easy 2-Min Check-in
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span>18+ Valid Govt ID Required (Aadhaar/DL)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span>Couples &amp; Local Boisar IDs Warmly Welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span>24/7 Flexible Hourly &amp; Night Check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span>Fresh Sanitized Linens &amp; Free Wi-Fi</span>
                </div>
              </div>
            </div>

            {/* Section 4: Guest Reviews (Simple, Clean & Understandable) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Guest Reviews
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Verified ratings from guests who stayed at this hotel
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-black border border-emerald-200">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{hotel.rating} / 5</span>
                </div>
              </div>

              {/* Genuine Verified Reviews List */}
              <div className="space-y-2.5">
                {reviewsList
                  .filter((r) => r && r.userName && r.userName.length > 2 && r.comment && r.comment.length > 8 && !/^(.)\1+$/.test(r.comment))
                  .slice(0, 4)
                  .map((rev) => (
                    <div key={rev.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">
                            {rev.userName}
                          </span>
                          {rev.userCity && (
                            <span className="text-[11px] text-slate-500 font-medium">
                              ({rev.userCity})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-amber-500 text-[10px] shrink-0">
                          {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
              </div>

              {/* Write Review Section */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">Rate Your Experience:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        type="button"
                        key={starVal}
                        onClick={() => setNewReviewRating(starVal)}
                        className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                        title={`${starVal} Star`}
                      >
                        <Star className={`w-4 h-4 ${starVal <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-1">
                      {newReviewRating}/5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600"
                  />
                  <input
                    type="text"
                    placeholder="City (e.g. Boisar / Mumbai)"
                    value={newReviewCity}
                    onChange={(e) => setNewReviewCity(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Describe your stay experience..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const cleanAuthor = newReviewAuthor.trim();
                      const cleanComment = newReviewComment.trim();

                      if (!cleanAuthor || !cleanComment) {
                        alert('Please enter your name and review details.');
                        return;
                      }

                      const newRev = {
                        id: `rev-${Date.now()}`,
                        userName: cleanAuthor,
                        userCity: newReviewCity.trim() || 'Boisar',
                        rating: newReviewRating,
                        date: 'Just now',
                        title: 'Hotel Review',
                        comment: cleanComment,
                        stayType: stayMode === 'hourly' ? `Hourly (${hourlySlot})` : 'Night Stay'
                      };

                      const updated = [newRev, ...reviewsList];
                      setReviewsList(updated);

                      try {
                        const currentSaved = JSON.parse(localStorage.getItem(`majh_boisar_hotel_reviews_${hotel.id}`) || '[]');
                        localStorage.setItem(`majh_boisar_hotel_reviews_${hotel.id}`, JSON.stringify([newRev, ...currentSaved]));
                      } catch (err) {
                        console.error(err);
                      }

                      setNewReviewAuthor('');
                      setNewReviewCity('');
                      setNewReviewComment('');
                      alert('Thank you! Your review has been submitted.');
                    }}
                    className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Interactive Booking Widget (Sticky on Desktop) */}
          <div className="lg:col-span-4 sticky top-16 space-y-3">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-lg space-y-3.5 text-left">
              
              {/* Header Box Highlighted with Colored Background */}
              <div 
                style={{ background: 'linear-gradient(135deg, #180630 0%, #2b0c50 50%, #120424 100%)' }}
                className="text-white p-3.5 rounded-2xl border border-purple-800/80 shadow-md flex items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-base font-black text-white">Book Hotel Room</h3>
                  <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pay at hotel on arrival</span>
                  </span>
                </div>
                <div className="text-right bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
                  <span className="text-[9px] text-purple-200 block font-semibold uppercase tracking-wider">Total Tariff</span>
                  <span className="text-xl font-black text-amber-300">₹{finalPayableTariff}</span>
                </div>
              </div>

              {!bookingSuccessPass ? (
                <form onSubmit={handleBookingSubmit} className="space-y-3">
                  
                  {/* Unified Stay Duration Selector (1-Tap Selection) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Select Stay Duration:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { 
                          id: '3h', 
                          title: '3 Hours', 
                          desc: 'Short Day Stay',
                          price: roomTypePreference === 'ac' ? hotel.hourlyRate3h : Math.max(399, hotel.hourlyRate3h - 200),
                          active: stayMode === 'hourly' && hourlySlot === '3h',
                          onClick: () => { setStayMode('hourly'); setHourlySlot('3h'); }
                        },
                        { 
                          id: '6h', 
                          title: '6 Hours', 
                          desc: 'Half Day Stay',
                          price: roomTypePreference === 'ac' ? hotel.hourlyRate6h : Math.max(599, hotel.hourlyRate6h - 300),
                          active: stayMode === 'hourly' && hourlySlot === '6h',
                          onClick: () => { setStayMode('hourly'); setHourlySlot('6h'); }
                        },
                        { 
                          id: '12h', 
                          title: '12 Hours', 
                          desc: 'Full Day Stay',
                          price: roomTypePreference === 'ac' ? hotel.hourlyRate12h : Math.max(899, hotel.hourlyRate12h - 400),
                          active: stayMode === 'hourly' && hourlySlot === '12h',
                          onClick: () => { setStayMode('hourly'); setHourlySlot('12h'); }
                        },
                        { 
                          id: 'night', 
                          title: 'Overnight', 
                          desc: 'Night Stay',
                          price: roomTypePreference === 'ac' ? hotel.nightRate : Math.max(999, hotel.nightRate - 500),
                          active: stayMode === 'night',
                          onClick: () => setStayMode('night')
                        }
                      ].map(slot => (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={slot.onClick}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            slot.active
                              ? 'bg-purple-900 text-white font-black border-purple-950 shadow-xs ring-2 ring-purple-600/30'
                              : 'bg-slate-50 text-slate-700 font-bold border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">{slot.title}</span>
                            <span className={`text-xs font-black ${slot.active ? 'text-amber-300' : 'text-purple-900'}`}>
                              ₹{slot.price}
                            </span>
                          </div>
                          <span className="text-[9.5px] opacity-75 block mt-0.5">{slot.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time in 1 Simple Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Check-in Date</label>
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600"
                      />
                    </div>
                    <div>
                      {stayMode === 'hourly' ? (
                        <HotelTimePicker
                          checkInTime={checkInTime}
                          onChange={setCheckInTime}
                          durationSlot={hourlySlot}
                          label="Check-in Time"
                        />
                      ) : (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Check-out Date</label>
                          <input
                            type="date"
                            required
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Room Type (AC vs Non-AC) Toggle */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Room Option</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRoomTypePreference('ac')}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                          roomTypePreference === 'ac'
                            ? 'bg-purple-900 text-white font-black border-purple-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        AC Deluxe Room
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoomTypePreference('non_ac')}
                        className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                          roomTypePreference === 'non_ac'
                            ? 'bg-purple-900 text-white font-black border-purple-900'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Non-AC Room
                      </button>
                    </div>
                  </div>

                  {/* Coupon Link (Discreet) */}
                  <div className="pt-0.5">
                    {!appliedCoupon ? (
                      <div>
                        {!showCouponBox ? (
                          <button
                            type="button"
                            onClick={() => setShowCouponBox(true)}
                            className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            <span>Have a coupon code? (Use: BOISAR100)</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              placeholder="Code (e.g. BOISAR100)"
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 uppercase flex-1 focus:outline-none focus:bg-white focus:border-purple-600 font-mono"
                            />
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              className="bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs px-3 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        {couponError && <p className="text-[10px] text-rose-600 font-bold mt-0.5">{couponError}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg text-[11px]">
                        <span className="font-bold text-emerald-800">Coupon {appliedCoupon.code} applied (-₹{appliedCoupon.discount})</span>
                        <button type="button" onClick={handleRemoveCoupon} className="text-rose-600 font-bold cursor-pointer">Remove</button>
                      </div>
                    )}
                  </div>

                  {/* Mandatory Login Wall or Guest Form */}
                  {!isLoggedIn ? (
                    <div className="bg-purple-50/70 border border-purple-200/90 rounded-2xl p-3.5 text-center space-y-2">
                      <p className="text-xs text-slate-700 font-bold leading-snug">
                        Sign in to confirm booking &amp; get instant room pass
                      </p>
                      <button
                        type="button"
                        onClick={() => setLoginModalOpen(true)}
                        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-98"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign In with Mobile</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Guest Name & Phone */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            placeholder="10-digit mobile"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-purple-600 font-mono"
                          />
                        </div>
                      </div>

                      {/* Primary Confirm Booking Button */}
                      <button
                        type="submit"
                        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        <span>Confirm Booking (Pay at Hotel)</span>
                      </button>
                    </>
                  )}

                  {/* Secondary Quick Action: WhatsApp & Phone */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Book on WhatsApp</span>
                    </button>
                    <a
                      href={`tel:${hotel.phone}`}
                      onClick={() => recordHotelClick(hotel.id, 'call')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all border border-slate-200 shrink-0"
                      title="Call Reception"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </form>
              ) : (
                /* Confirmed Digital Pass Display */
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      BOOKING GENERATED
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">Digital Room Pass</h3>
                  </div>

                  <div 
                    style={{ background: 'linear-gradient(145deg, #140526 0%, #250a48 50%, #10031f 100%)', color: '#ffffff' }}
                    className="rounded-2xl p-4 text-left space-y-2.5 border border-purple-700/60 shadow-xl text-white"
                  >
                    <div className="flex justify-between items-center border-b border-purple-800/80 pb-2.5">
                      <div>
                        <span className="text-[9px] text-amber-300 font-extrabold uppercase tracking-widest block">BOOKING REFERENCE</span>
                        <strong className="text-sm font-mono text-white font-black">{bookingSuccessPass.id}</strong>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ✓ Confirmed
                      </span>
                    </div>

                    <div className="text-xs space-y-2 pt-1 font-medium">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-purple-200/90 font-semibold shrink-0">🏨 Hotel:</span>
                        <span className="text-white font-black text-right">{bookingSuccessPass.hotelName}</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-purple-200/90 font-semibold shrink-0">⏰ Stay Slot:</span>
                        <span className="text-amber-300 font-black text-right">{bookingSuccessPass.timeSlot}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-purple-200/90 font-semibold shrink-0">📅 Date:</span>
                        <span className="text-white font-bold">{bookingSuccessPass.date}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-purple-200/90 font-semibold shrink-0">👤 Guest:</span>
                        <span className="text-white font-bold">{bookingSuccessPass.guestName} ({bookingSuccessPass.guestPhone})</span>
                      </div>
                      <div className="flex justify-between items-center gap-2 pt-2 border-t border-purple-800/60">
                        <span className="text-emerald-300 font-bold text-xs">💰 Pay at Desk:</span>
                        <span className="text-lg font-black text-amber-300">₹{bookingSuccessPass.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(
                      `Hello ${hotel.name},\nI have confirmed booking on Majh Boisar.\n\n📋 Ref: ${bookingSuccessPass.id}\n👤 Guest: ${bookingSuccessPass.guestName}\n📱 Phone: ${bookingSuccessPass.guestPhone}\n⏰ Stay: ${bookingSuccessPass.stayType} - ${bookingSuccessPass.timeSlot}\n💰 Amount: ₹${bookingSuccessPass.totalAmount}\n\nPlease confirm availability and check-in.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Pass to Hotel WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsMyPassesModalOpen(true)}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      🎫 View All My Passes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingSuccessPass(null);
                        refreshUserPasses();
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      + Book Another Slot
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Guest's All Hotel Booking Passes Modal */}
      <MyHotelPassesModal
        isOpen={isMyPassesModalOpen}
        onClose={() => {
          setIsMyPassesModalOpen(false);
          refreshUserPasses();
        }}
      />

      {/* ========================================================
          FULL PHOTO GALLERY MODAL / LIGHTBOX (100% SOLID DARK BACKDROP & ULTRA VISIBLE CLOSE)
      ======================================================== */}
      {mounted && isGalleryModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000000',
            zIndex: 9999999
          }}
          className="flex flex-col justify-between select-none text-white overflow-hidden animate-in fade-in duration-150"
          onClick={() => setIsGalleryModalOpen(false)}
        >
          {/* Top Bar (Solid Dark Header, Never Covered by Anything) */}
          <div 
            style={{ backgroundColor: '#111115' }}
            className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-white/20 shrink-0 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 pr-4">
              <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate max-w-[200px] sm:max-w-md">
                {hotel.name}
              </h3>
              <p className="text-xs text-amber-400 font-black mt-0.5">
                Photo {galleryModalIdx + 1} of {allPhotos.length}
              </p>
            </div>

            {/* High-Contrast Unmissable Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsGalleryModalOpen(false);
              }}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-2xl cursor-pointer border-2 border-white/60 shrink-0"
              title="Close Gallery (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>CLOSE</span>
            </button>
          </div>

          {/* Center Main Photo (Solid Pure Black Canvas) */}
          <div 
            className="flex-1 w-full h-[calc(100vh-160px)] min-h-0 relative flex items-center justify-center p-3 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryModalIdx(prev => (prev - 1 + allPhotos.length) % allPhotos.length);
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center cursor-pointer transition-all z-40 shadow-2xl border-2 border-white/40 active:scale-90"
                title="Previous Photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            <div className="w-full h-full flex items-center justify-center p-2">
              <img
                src={allPhotos[galleryModalIdx]}
                alt={`${hotel.name} Photo ${galleryModalIdx + 1}`}
                className="max-w-[94vw] max-h-[66vh] sm:max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              />
            </div>

            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryModalIdx(prev => (prev + 1) % allPhotos.length);
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center cursor-pointer transition-all z-40 shadow-2xl border-2 border-white/40 active:scale-90"
                title="Next Photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip (Solid Dark Footer) */}
          <div 
            style={{ backgroundColor: '#111115' }}
            className="h-20 sm:h-24 px-4 py-2 border-t border-white/20 shrink-0 flex items-center justify-center overflow-x-auto scrollbar-none z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 max-w-full">
              {allPhotos.map((photoUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryModalIdx(idx);
                  }}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    galleryModalIdx === idx 
                      ? 'border-amber-400 scale-110 ring-2 ring-amber-400 shadow-2xl opacity-100' 
                      : 'border-white/20 opacity-40 hover:opacity-100 hover:border-white/60'
                  }`}
                >
                  <img src={photoUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
