'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  User,
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
  QrCode,
  Heart,
  Plus,
  ChevronDown
} from 'lucide-react';
import { BOISAR_HOTELS, HotelItem, HotelRoom, getHotelBySlugOrId, recordHotelClick, calculateStayWindow, normalizeHotelAmenity, deduplicateRules } from '@/lib/hotelsData';
import { useApp } from '@/context/AppContext';
import HotelTimePicker from '@/components/HotelTimePicker';
import MyHotelPassesModal from '@/components/MyHotelPassesModal';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loggedInUser, isLoggedIn, setLoginModalOpen, showToast } = useApp();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const id = params?.id as string;
  const [hotel, setHotel] = useState<HotelItem | null>(() => {
    if (!id) return null;
    return getHotelBySlugOrId(id) || null;
  });

  // Active section tab ('overview' | 'rooms' | 'location' | 'reviews' | 'facilities' | 'policies')
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'location' | 'reviews' | 'facilities' | 'policies'>('overview');

  // Sub-tabs for the About section (as per 2nd reference image)
  const [aboutSubTab, setAboutSubTab] = useState<'Overview' | 'Food & Dining' | 'Rooms' | 'Facilities & Activities' | 'Location & Nearby Areas'>('Overview');
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  // Save / Bookmark state
  const [isSaved, setIsSaved] = useState(false);

  // Gallery Active Index & Touch Swipe
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryModalIdx, setGalleryModalIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Reserve Room Modal State ("hum hotel m sirf reserved krnge same has resort")
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('Value Queen Room');
  const [selectedRoomRate, setSelectedRoomRate] = useState<number>(0);

  // Filter for room selection (Breakfast Included - Exact Reference 3)
  const [filterBreakfastOnly, setFilterBreakfastOnly] = useState(false);

  // Room Details Preview Modal
  const [viewingRoom, setViewingRoom] = useState<any | null>(null);
  const [viewingRoomPhotoIdx, setViewingRoomPhotoIdx] = useState(0);

  // Lock background body scroll when modals are open
  useEffect(() => {
    if (isGalleryModalOpen || isReserveModalOpen || viewingRoom) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isGalleryModalOpen, isReserveModalOpen, viewingRoom]);

  // Load saved bookmark state
  useEffect(() => {
    if (!id) return;
    try {
      const savedList = JSON.parse(localStorage.getItem('majh_boisar_saved_hotels') || '[]');
      if (Array.isArray(savedList)) {
        setIsSaved(savedList.includes(id));
      }
    } catch (e) {}
  }, [id]);

  const handleToggleSave = () => {
    if (!hotel) return;
    try {
      const savedList: string[] = JSON.parse(localStorage.getItem('majh_boisar_saved_hotels') || '[]');
      let updated: string[];
      if (savedList.includes(hotel.id) || (hotel.slug && savedList.includes(hotel.slug))) {
        updated = savedList.filter(item => item !== hotel.id && item !== hotel.slug);
        setIsSaved(false);
        showToast('Removed from Saved Hotels', 'info');
      } else {
        updated = [...savedList, hotel.id];
        setIsSaved(true);
        showToast('❤️ Saved to your Favorites!', 'success');
      }
      localStorage.setItem('majh_boisar_saved_hotels', JSON.stringify(updated));
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  // Combine all photos (gallery + room photos)
  const allPhotos = useMemo(() => {
    if (!hotel) return [];
    const list = [...hotel.gallery];
    if (hotel.rooms) {
      hotel.rooms.forEach(r => {
        if (r.image && !list.includes(r.image)) {
          list.push(r.image);
        }
        if ((r as any).gallery && Array.isArray((r as any).gallery)) {
          (r as any).gallery.forEach((g: string) => {
            if (g && !list.includes(g)) list.push(g);
          });
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
      setActivePhotoIdx((prev) => (prev + 1) % hotel.gallery.length);
    } else if (distance < -45) {
      setActivePhotoIdx((prev) => (prev - 1 + hotel.gallery.length) % hotel.gallery.length);
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Booking Form States
  const [stayMode, setStayMode] = useState<'night' | 'day' | 'hourly'>('night');
  const [hourlySlot, setHourlySlot] = useState<'3h' | '6h' | '12h'>('3h');
  const [checkInTime, setCheckInTime] = useState('11:00 AM');
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
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

  // Reviews list
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const refreshUserPasses = () => {
    try {
      const allPasses = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      if (Array.isArray(allPasses)) {
        const userPasses = allPasses.filter(
          (p: any) => p && (
            (loggedInUser?.phone && p.guestPhone === loggedInUser.phone) ||
            p.hotelId === id
          )
        );
        setUserPassCount(userPasses.length);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshUserPasses();
  }, [id, loggedInUser]);

  // Load hotel details
  useEffect(() => {
    if (!id) return;
    const refreshHotel = () => {
      const found = getHotelBySlugOrId(id);
      if (found) {
        // Load custom rules & tag if saved in localStorage
        try {
          const directSavedRules = localStorage.getItem(`majh_boisar_hotel_rules_${found.id}`) ||
                                   localStorage.getItem(`majh_boisar_hotel_rules_${found.slug}`);
          if (directSavedRules) {
            const parsed = JSON.parse(directSavedRules);
            if (Array.isArray(parsed) && parsed.length > 0) {
              found.rules = deduplicateRules(parsed);
            }
          } else if (found.rules && found.rules.length > 0) {
            found.rules = deduplicateRules(found.rules);
          }
          const directSavedTag = localStorage.getItem(`majh_boisar_hotel_rules_tag_${found.id}`) ||
                                 localStorage.getItem(`majh_boisar_hotel_rules_tag_${found.slug}`);
          if (directSavedTag) {
            (found as any).houseRulesTag = directSavedTag;
          }
        } catch (e) {}

        setHotel(found);
        setSelectedRoomRate(found.nightRate);

        const stayQuery = searchParams?.get('stay');
        if (stayQuery === 'day') {
          if (found.offersHourly !== false) {
            setStayMode('hourly');
            setHourlySlot('12h');
          } else {
            setStayMode('day');
          }
        } else if (stayQuery === 'night') {
          setStayMode('night');
        } else if (stayQuery === 'hourly') {
          setStayMode('hourly');
          setHourlySlot('3h');
        }

        try {
          const saved = JSON.parse(localStorage.getItem(`majh_boisar_hotel_reviews_${found.id}`) || '[]');
          setReviewsList([...saved, ...(found.reviews || [])]);
        } catch (e) {
          setReviewsList(found.reviews || []);
        }
        recordHotelClick(found.id, 'view');
      }
    };

    refreshHotel();

    // Fetch live hotel from API database to ensure real-time photos & details across all devices
    fetch('/api/hotels')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.hotels)) {
          const cleanKey = id.toLowerCase().trim();
          const liveMatch = data.hotels.find((h: any) => 
            (h.id && String(h.id).toLowerCase().trim() === cleanKey) ||
            (h.slug && h.slug.toLowerCase().trim() === cleanKey) ||
            (h.name && h.name.toLowerCase().trim() === cleanKey) ||
            (h.name && h.name.toLowerCase().replace(/\s+/g, '-') === cleanKey)
          );
          if (liveMatch) {
            setHotel(prev => ({
              ...(prev || {}),
              ...liveMatch,
              gallery: (Array.isArray(liveMatch.gallery) && liveMatch.gallery.length > 0) ? liveMatch.gallery : (prev?.gallery || []),
              rooms: (Array.isArray(liveMatch.rooms) && liveMatch.rooms.length > 0) ? liveMatch.rooms : (prev?.rooms || []),
              rules: (Array.isArray(liveMatch.rules) && liveMatch.rules.length > 0) ? liveMatch.rules : (prev?.rules || [])
            } as any));
          }
        }
      })
      .catch(err => console.error('Error fetching live hotel details:', err));

    if (loggedInUser) {
      setGuestName(loggedInUser.name || '');
      setGuestPhone(loggedInUser.phone || '');
    }

    const handleCustomUpdate = () => {
      refreshHotel();
    };

    window.addEventListener('storage', refreshHotel);
    window.addEventListener('majh_boisar_hotel_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', refreshHotel);
      window.removeEventListener('majh_boisar_hotel_updated', handleCustomUpdate);
    };
  }, [id, loggedInUser]);

  // Derived available room types
  const displayRooms = useMemo(() => {
    if (!hotel) return [];
    if (hotel.rooms && hotel.rooms.length > 0) {
      return hotel.rooms.map(r => ({
        ...r,
        size: r.size || '9 sq. mt.',
        view: (r as any).view || 'City view',
        bedType: r.bedType || '1 queen bed',
        maxGuests: r.maxGuests || 2,
        amenities: r.amenities && r.amenities.length > 0 
          ? r.amenities 
          : ['Extra toilet', 'Attached bathroom', 'Toiletries', 'Towels', 'Walk-in shower', 'Free Wi-Fi', 'Satellite channels']
      }));
    }
    // Fallback standard room catalog for hotel
    return [
      {
        id: 'r1',
        name: 'Value Queen Room',
        type: 'Queen Bed · AC Room',
        bedType: '1 queen bed',
        maxGuests: 2,
        size: '9 sq. mt.',
        view: 'City view',
        hourly3h: hotel.hourlyRate3h,
        hourly6h: hotel.hourlyRate6h,
        hourly12h: hotel.hourlyRate12h,
        nightRate: hotel.nightRate,
        image: hotel.gallery[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        amenities: ['Extra toilet', 'Attached bathroom', 'Toiletries', 'Towels', 'Walk-in shower', 'Free Wi-Fi', 'Satellite channels']
      },
      {
        id: 'r2',
        name: 'Deluxe AC Room',
        type: 'King Bed · Deluxe AC',
        bedType: '1 king bed',
        maxGuests: 3,
        size: '14 sq. mt.',
        view: 'Garden view',
        hourly3h: Math.round(hotel.hourlyRate3h * 1.2),
        hourly6h: Math.round(hotel.hourlyRate6h * 1.2),
        hourly12h: Math.round(hotel.hourlyRate12h * 1.2),
        nightRate: Math.round(hotel.nightRate * 1.25),
        image: hotel.gallery[1] || hotel.gallery[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80',
        amenities: ['Extra toilet', 'Attached bathroom', 'Toiletries', 'Towels', 'Walk-in shower', 'Free Wi-Fi', 'Satellite channels']
      },
      {
        id: 'r3',
        name: 'Executive Suite',
        type: 'Suite · Living Area',
        bedType: '1 king bed + sofa',
        maxGuests: 4,
        size: '22 sq. mt.',
        view: 'City & Station view',
        hourly3h: Math.round(hotel.hourlyRate3h * 1.5),
        hourly6h: Math.round(hotel.hourlyRate6h * 1.5),
        hourly12h: Math.round(hotel.hourlyRate12h * 1.5),
        nightRate: Math.round(hotel.nightRate * 1.6),
        image: hotel.gallery[2] || hotel.gallery[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        amenities: ['Extra toilet', 'Attached bathroom', 'Toiletries', 'Towels', 'Walk-in shower', 'Free Wi-Fi', 'Satellite channels', 'Tea/Coffee Maker']
      }
    ];
  }, [hotel]);

  // Primary recommended deal room
  const recommendedRoom = useMemo(() => {
    return displayRooms[0] || {
      name: 'Value Queen Room',
      nightRate: hotel?.nightRate || 1499,
      image: hotel?.gallery[0] || ''
    };
  }, [displayRooms, hotel]);

  // Smooth scroll handler for tabs
  const handleTabClick = (sectionId: 'overview' | 'rooms' | 'location' | 'reviews' | 'facilities' | 'policies') => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -85;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Price Calculation
  const totalTariff = useMemo(() => {
    if (!hotel) return 0;
    const baseNight = selectedRoomRate || hotel.nightRate;
    const baseDay = (hotel as any).dayRate || hotel.hourlyRate12h || Math.round(baseNight * 0.75);
    const rate3h = hotel.hourlyRate3h || Math.round(baseNight * 0.45);
    const rate6h = hotel.hourlyRate6h || Math.round(baseNight * 0.65);
    const rate12h = hotel.hourlyRate12h || Math.round(baseNight * 0.85);

    if (stayMode === 'hourly') {
      const base = hourlySlot === '3h' ? rate3h : hourlySlot === '6h' ? rate6h : rate12h;
      return base * roomsCount;
    } else if (stayMode === 'day') {
      return baseDay * roomsCount;
    } else {
      try {
        const d1 = new Date(checkInDate);
        const d2 = new Date(checkOutDate);
        const diffTime = Math.max(d2.getTime() - d1.getTime(), 86400000);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return baseNight * diffDays * roomsCount;
      } catch (e) {
        return baseNight * roomsCount;
      }
    }
  }, [hotel, selectedRoomRate, stayMode, hourlySlot, checkInDate, checkOutDate, roomsCount]);

  // Open reservation modal for a specific room
  const handleOpenReserveModal = (roomName?: string, roomRate?: number) => {
    if (roomName) setSelectedRoomName(roomName);
    if (roomRate) setSelectedRoomRate(roomRate);
    setIsReserveModalOpen(true);
  };

  // Handle Booking Submit (Reservation Only — "hum hotel m sirf reserved krnge same has resort")
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    const cleanPhone = guestPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (!hotel) return;

    const calculatedWindow = calculateStayWindow(checkInTime, hourlySlot).fullWindowStr;
    const ref = `MB-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const passObj = {
      id: ref,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelPhone: hotel.phone,
      hotelAddress: hotel.address,
      stayType: stayMode === 'hourly' ? `Hourly (${hourlySlot})` : stayMode === 'day' ? 'Day Stay' : 'Night Stay',
      timeSlot: stayMode === 'hourly' ? calculatedWindow : stayMode === 'day' ? ((hotel as any).dayStayTimingWindow || '09:00 AM – 07:00 PM') : `Overnight (${(hotel as any).nightStayCheckIn || '12:00 PM'} to ${(hotel as any).nightStayCheckOut || '11:00 AM'})`,
      date: checkInDate,
      checkOutDate: stayMode === 'night' ? checkOutDate : checkInDate,
      roomCategory: selectedRoomName,
      assignedRoom: 'Allotted at Front Desk',
      roomsCount,
      guestsCount,
      guestName,
      guestPhone: cleanPhone,
      idProofType,
      specialRequest,
      paymentMode: 'Pay at Hotel (Book with ₹0)',
      paymentStatus: 'Pending (Pay at Check-in)',
      status: 'Reserved (Pay at Hotel)',
      totalAmount: totalTariff,
      originalAmount: Math.round(totalTariff * 1.25),
      createdAt: new Date().toLocaleString()
    };

    recordHotelClick(hotel.id, 'book');

    try {
      // 1. Save Hotel Booking Pass locally
      const existing = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify([passObj, ...existing]));

      // 2. Save to central PostgreSQL DB
      fetch('/api/hotel-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: parseInt(hotel.id.replace(/\D/g, '')) || null,
          hotelSlug: hotel.slug || hotel.id,
          hotelName: hotel.name,
          hotelPhone: hotel.phone,
          hotelAddress: hotel.address,
          guestName,
          guestPhone: cleanPhone,
          roomCategory: passObj.roomCategory,
          stayType: passObj.stayType,
          timeSlot: calculatedWindow,
          checkInDate,
          totalAmount: totalTariff,
          paymentMode: 'Pay at Hotel',
          paymentStatus: 'Pending',
          status: 'Reserved (Pay at Hotel)',
          notes: `Pass Ref: ${ref} · Pay upon arrival (₹0 Advance) · ID: ${idProofType}`
        })
      }).catch(e => console.error('[Hotel [id] DB Booking Error]:', e));

      // 3. Create Instant Enquiry / Lead in Dashboard Leads Inbox
      const newLead = {
        id: `lead_htl_${Date.now()}`,
        businessId: Number(hotel.id.replace(/\D/g, '')) || 0,
        hotelId: hotel.id,
        customerName: guestName,
        customerPhone: cleanPhone,
        customerEmail: '',
        query: `🏨 Room Reservation: ${selectedRoomName} (${stayMode === 'hourly' ? `Hourly ${hourlySlot}` : 'Night Stay'}) on ${checkInDate}. Tariff: ₹${totalTariff} (Pay on Arrival). Pass Ref: ${ref}`,
        status: 'New Hotel Reservation',
        createdAt: new Date().toISOString(),
        notes: `Pass Ref: ${ref} · Stay: ${stayMode === 'hourly' ? `${hourlySlot}` : 'Night Stay'} · Guests: ${guestsCount} · Rooms: ${roomsCount}`
      };

      const existingLeads = JSON.parse(localStorage.getItem('majh_boisar_leads') || '[]');
      localStorage.setItem('majh_boisar_leads', JSON.stringify([newLead, ...existingLeads]));

      // 4. Create Real-Time Push Notification for Hotelier
      const newNotif = {
        id: `notif_${Date.now()}`,
        title: '🔔 New Hotel Room Reservation Received!',
        message: `${guestName} (${cleanPhone}) reserved ${selectedRoomName} for ₹${totalTariff} (Pay at hotel). Check-in: ${checkInDate}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        link: '/dashboard?tab=hotel_bookings'
      };

      const existingNotifs = JSON.parse(localStorage.getItem('majh_boisar_notifications') || '[]');
      localStorage.setItem('majh_boisar_notifications', JSON.stringify([newNotif, ...existingNotifs]));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('boisar_new_hotel_booking', { detail: passObj }));
      }
    } catch (e) {}

    setBookingSuccessPass(passObj);
    refreshUserPasses();
    // Pass modal displays directly in view without conflicting top banner toast
  };

  // WhatsApp Instant Booking message
  const openWhatsApp = () => {
    if (!hotel) return;
    recordHotelClick(hotel.id, 'whatsapp');
    const calculatedWindow = calculateStayWindow(checkInTime, hourlySlot).fullWindowStr;
    const msg = encodeURIComponent(
      `Hello ${hotel.name},\nI would like to reserve a room on Majh Boisar.\n\n🏨 Hotel: ${hotel.name}\n📍 Location: ${hotel.location}\n🛏️ Room: ${selectedRoomName}\n⏰ Stay: ${stayMode === 'hourly' ? `Hourly (${hourlySlot}) - ${calculatedWindow}` : 'Night Stay'}\n📅 Check-in Date: ${checkInDate}\n👤 Guest: ${guestName || 'Customer'} (${guestPhone || 'Phone'})\n💰 Tariff: ₹${totalTariff} (Book with ₹0 / Pay at Hotel)\n\nPlease confirm room reservation.`
    );
    window.open(`https://wa.me/${hotel.whatsapp}?text=${msg}`, '_blank');
  };

  // Share Hotel Link
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${hotel?.name} - Majh Boisar`,
        text: `Reserve rooms at ${hotel?.name} with ₹0 advance!`,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Hotel reservation link copied!', 'success');
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <Building2 className="w-12 h-12 text-slate-300 animate-bounce mb-3" />
        <h2 className="text-lg font-black text-slate-800">Finding Hotel Details...</h2>
        <p className="text-xs text-slate-500 mt-1">If page doesn't load, please return to hotel listings.</p>
        <Link href="/hotels" className="mt-4 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors">
          ← Back to All Hotels
        </Link>
      </div>
    );
  }

  // Render Star Icons
  const starCount = Math.max(3, Math.min(5, Math.round(hotel.rating || 4)));

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-slate-800 font-sans pb-28 sm:pb-20 text-left">
      
      {/* 1. TOP STICKY TAB NAVIGATION (MakeMyTrip / Agoda style reference) */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            <nav className="flex items-center gap-6 sm:gap-8 whitespace-nowrap text-xs sm:text-sm font-bold text-slate-600">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'rooms', label: 'Rooms' },
                { id: 'location', label: 'Location' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'facilities', label: 'Facilities' },
                { id: 'policies', label: 'Policies' },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as any)}
                  className={`py-3.5 transition-all cursor-pointer relative font-bold ${
                    activeTab === tab.id
                      ? 'text-blue-600 font-extrabold'
                      : 'hover:text-slate-900 text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Actions (My Passes & Back Link & Owner Dashboard) */}
            <div className="flex items-center gap-2 shrink-0 py-2">
              <Link
                href={`/dashboard?hotelId=${hotel.slug || hotel.id}`}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
              >
                <span>⚙️ Owner Dashboard</span>
              </Link>
              {userPassCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsMyPassesModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Ticket className="w-3.5 h-3.5 text-slate-950" />
                  <span>My Passes ({userPassCount})</span>
                </button>
              )}
              <Link
                href="/hotels"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                ← All Hotels
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5">

        {/* 2. HOTEL TITLE & META HEADER (Reference Matching) */}
        <div id="overview" className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Title, Stars, & Best Price Guarantee */}
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {hotel.name}
              </h1>

              {/* Star Rating Icons (Orange) */}
              <div className="flex items-center text-amber-500 gap-0.5">
                {[...Array(starCount)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Best Price Guarantee Badge (Dark Green Reference) */}
              <span className="inline-flex items-center gap-1 bg-[#055b2e] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                <span>₹</span>
                <span>Best Price Guarantee</span>
              </span>

              {hotel.badge && (
                <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {hotel.badge.replace(/[♦★⭐⚡]/g, '').trim()}
                </span>
              )}
            </div>

            {/* Right Side: Save & Share Buttons (Reference Matching) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleSave}
                className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                title={isSaved ? 'Saved in favorites' : 'Save Hotel'}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Share Hotel Link"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Location row with View on map link (Reference Matching) */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium pt-0.5">
            <span className="p-1 rounded-lg bg-amber-50 text-amber-600">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            </span>
            <span className="text-slate-700 font-semibold">{hotel.address}</span>
            <span className="text-slate-300">·</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address} Boisar`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>View on map</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* 3. PHOTO SHOWCASE + RECOMMENDED DEAL CARD (Exact Visual Architecture from Reference Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Photos Area (8 Cols on Desktop): Large Left Photo + 2 Stacked Center Photos */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row gap-2.5 h-[280px] sm:h-[340px] md:h-[360px]">
            
            {/* Left Box: Large Main Photo */}
            <div 
              onClick={() => {
                setGalleryModalIdx(activePhotoIdx);
                setIsGalleryModalOpen(true);
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex-1 h-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group relative shadow-inner select-none"
              title="Click to view full photo gallery"
            >
              <img 
                src={allPhotos[activePhotoIdx] || hotel.gallery[0]} 
                alt={hotel.name} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
              />

              {/* Prev / Next Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((activePhotoIdx - 1 + allPhotos.length) % allPhotos.length);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer transition-all z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx((activePhotoIdx + 1) % allPhotos.length);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer transition-all z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Photo Count badge on mobile */}
              <div className="sm:hidden absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                {activePhotoIdx + 1} / {allPhotos.length} Photos
              </div>
            </div>

            {/* Center Box: Two Stacked Photos (Visible on sm & up) with "See All Property & Guest Photos >" */}
            {allPhotos.length > 1 && (
              <div className="hidden sm:flex flex-col gap-2.5 w-[210px] md:w-[240px] shrink-0 h-full">
                
                {/* Top Stacked Photo */}
                <div 
                  onClick={() => {
                    setGalleryModalIdx(1 % allPhotos.length);
                    setIsGalleryModalOpen(true);
                  }}
                  className="flex-1 rounded-2xl overflow-hidden bg-slate-900 relative cursor-pointer group shadow-inner"
                >
                  <img 
                    src={allPhotos[1] || allPhotos[0]} 
                    alt="Property Exterior" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Bottom Stacked Photo with "See All Property & Guest Photos >" Button */}
                <div 
                  onClick={() => {
                    setGalleryModalIdx(2 % allPhotos.length);
                    setIsGalleryModalOpen(true);
                  }}
                  className="flex-1 rounded-2xl overflow-hidden bg-slate-900 relative cursor-pointer group shadow-inner"
                >
                  <img 
                    src={allPhotos[2] || allPhotos[0]} 
                    alt="Property Interior" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark Pill Overlay (Exact Reference Matching) */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-colors">
                    <span>See All Property &amp; Guest Photos</span>
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Box (4 Cols on Desktop): THE RECOMMENDED DEAL CARD (Exact Reference Matching) */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm h-full flex flex-col justify-between space-y-3.5">
              
              <div className="space-y-3">
                {/* Header: Room Thumbnail + "Recommended Deal" + Room Name */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img 
                      src={recommendedRoom.image || hotel.gallery[0]} 
                      alt={recommendedRoom.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <span className="inline-block bg-blue-50 text-blue-600 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Recommended Deal
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {recommendedRoom.name}
                    </h3>
                  </div>
                </div>

                {/* Bullet Perks (Exact Reference Checkmarks) */}
                <div className="space-y-1.5 text-xs text-slate-700 font-medium pt-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <span className="w-4 h-4 rounded-full border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600">✓</span>
                    <span>Free Cancellation before check-in</span>
                    <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-700">✓</span>
                    <span>Free High-Speed WiFi</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-700">✓</span>
                    <span className="font-bold text-slate-900">Book with ₹0</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Pay on Arrival</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      ₹{recommendedRoom.nightRate?.toLocaleString('en-IN') || hotel.nightRate}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ₹{Math.round((recommendedRoom.nightRate || hotel.nightRate) * 1.25).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
                    + ₹0 extra fees · per night for 1 room
                  </span>
                </div>

                {/* Buttons (Website Matched Clean Design) */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReserveModal(recommendedRoom.name, recommendedRoom.nightRate || hotel.nightRate)}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition-all shadow-xs hover:shadow cursor-pointer text-center"
                  >
                    Reserve 1 Room
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabClick('rooms')}
                    className="w-full bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
                  >
                    View All Rooms
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4. HIGHLIGHT FEATURE CARDS ROW (Simple & Easy, Website Blue Theme) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: Centrally Located */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">Centrally Located</h4>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {(hotel as any).stationDistance || '2 mins to Boisar Station'}
              </p>
            </div>
          </div>

          {/* Card 2: Clean Rooms */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">Clean &amp; Sanitized</h4>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Fresh linens &amp; clean rooms
              </p>
            </div>
          </div>

          {/* Card 3: Excellent Service */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">24/7 Support</h4>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Attentive &amp; polite staff
              </p>
            </div>
          </div>

          {/* Card 4: Safe & Couple Friendly */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">Couple Friendly</h4>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                100% Safe · Local IDs Welcome
              </p>
            </div>
          </div>
        </div>

        {/* 5. SECTION: ABOUT (#about) */}
        <div id="about" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              About
            </h3>
            <span className="text-[11px] font-bold text-slate-500">Property Overview</span>
          </div>

          {/* Sub-tab Pills (Exact Reference Matching) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            {[
              'Overview',
              'Food & Dining',
              'Rooms',
              'Facilities & Activities',
              'Location & Nearby Areas'
            ].map((pill) => (
              <button
                type="button"
                key={pill}
                onClick={() => setAboutSubTab(pill as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  aboutSubTab === pill
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 font-black'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-transparent'
                }`}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Bullets corresponding to active sub-tab */}
          <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed pt-1">
            {aboutSubTab === 'Overview' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>This property occupies a central Boisar setting with convenient access to Boisar Railway Station and Tarapur MIDC.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>The hotel features well-appointed AC and non-AC rooms equipped with 24/7 power backup, clean linens, and modern attached washrooms.</span>
                </p>
                {isAboutExpanded && (
                  <p className="flex items-start gap-2 animate-in fade-in duration-200">
                    <span className="text-slate-400 font-black">•</span>
                    <span>{hotel.description || 'Offers flexible hourly stays, day rest packages, and standard overnight stays with zero advance payment and pay-at-hotel convenience.'}</span>
                  </p>
                )}
              </>
            )}

            {aboutSubTab === 'Food & Dining' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Room service and in-house dining options serving freshly prepared North Indian, Chinese, and regional Maharashtrian dishes.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Morning hot tea, coffee, and breakfast can be ordered directly to your room upon check-in.</span>
                </p>
              </>
            )}

            {aboutSubTab === 'Rooms' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Spacious Deluxe Queen &amp; King bedrooms with hygienic sanitised mattresses and crisp bedding.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>24-hour running hot &amp; cold water geyser, complimentary toiletries, and flat-screen LED TV with entertainment channels.</span>
                </p>
              </>
            )}

            {aboutSubTab === 'Facilities & Activities' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>High-speed complimentary Wi-Fi, 24/7 front desk check-in, daily housekeeping, and power generator backup.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Secure vehicle parking and 24/7 CCTV surveillance throughout common areas.</span>
                </p>
              </>
            )}

            {aboutSubTab === 'Location & Nearby Areas' && (
              <>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>Only 2 to 5 minutes from Boisar Railway Station and the central auto stand.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-slate-400 font-black">•</span>
                  <span>5 minutes drive to Tarapur MIDC, and 25 to 30 minutes from Kelwa Beach and Shirgaon Fort.</span>
                </p>
              </>
            )}

            {/* View More link */}
            <button
              type="button"
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline pt-1 flex items-center gap-1 cursor-pointer"
            >
              <span>{isAboutExpanded ? 'View Less' : 'View More'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isAboutExpanded ? '-rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* 6. MAIN BODY SECTIONS WITH ANCHOR IDS */}

        {/* SECTION: SELECT YOUR ROOM (#rooms) - Exact 3rd Reference Image */}
        <div id="rooms" className="space-y-3.5 pt-2">
          
          {/* Header Title & Filter Pill */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Select your room
              </h2>

              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                🔒 Guaranteed Best Tariff · Pay on Arrival
              </span>
            </div>

            {/* Filter Pills: Only show Breakfast Included if hotel offers breakfast */}
            {Boolean(
              (hotel as any).hasBreakfast ||
              (hotel.amenities && hotel.amenities.some(a => (typeof a === 'string' ? a : a.name || '').toLowerCase().includes('breakfast')))
            ) && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterBreakfastOnly(!filterBreakfastOnly)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    filterBreakfastOnly
                      ? 'bg-blue-50 text-blue-700 border-blue-300 font-black ring-1 ring-blue-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Breakfast Included
                </button>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            
            {/* Table Header Bar (Exact Reference 3) */}
            <div className="bg-slate-100/90 border-b border-slate-200 py-2.5 px-4 hidden lg:grid lg:grid-cols-12 text-xs font-black text-slate-700">
              <div className="lg:col-span-5 flex items-center gap-1">
                <span>{displayRooms.length} Room Type</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <div className="lg:col-span-4">
                <span>Options</span>
              </div>
              <div className="lg:col-span-3 text-right">
                <span>Price</span>
              </div>
            </div>

            {/* Table Rows for each Room Type */}
            <div className="divide-y divide-slate-200">
              {displayRooms.map((room, idx) => {
                const baseNightRate = room.nightRate || hotel.nightRate;
                const baseOriginal = Math.round(baseNightRate * 1.25);
                const breakfastNightRate = Math.round(baseNightRate * 1.1 + 522);
                const breakfastOriginal = Math.round(breakfastNightRate * 1.22);
                const roomOffersBreakfast = Boolean(
                  (room as any).hasBreakfast ||
                  (room.amenities && room.amenities.some((a: string) => (typeof a === 'string' ? a : '').toLowerCase().includes('breakfast'))) ||
                  ((room.name || '').toLowerCase().includes('breakfast'))
                );

                return (
                  <div key={room.id || idx} className="grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* Left Column (lg:col-span-5): Photo, Title, Specs & Checklist */}
                    <div className="lg:col-span-5 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-3">
                      
                      {/* Photo with Count Overlay & Click to Preview */}
                      {(() => {
                        const roomPhotos = Array.from(new Set([
                          room.image,
                          ...(Array.isArray((room as any).gallery) ? (room as any).gallery : [])
                        ].filter(Boolean)));
                        return (
                          <div 
                            onClick={() => {
                              setViewingRoom(room);
                              setViewingRoomPhotoIdx(0);
                            }}
                            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 group cursor-pointer"
                            title="Click to view room photos"
                          >
                            <img 
                              src={room.image || hotel.gallery[0]} 
                              alt={room.name} 
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                            {/* Photo Count badge */}
                            <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                              <Camera className="w-3 h-3 text-white" />
                              <span>{roomPhotos.length > 1 ? `${roomPhotos.length} Photos` : 'Photo'}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Room Title */}
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                          {room.name}
                        </h3>
                        
                        {/* Specs Row with Icons (Exact Reference 3) */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-semibold pt-0.5">
                          <span>📐 {room.size || '9 sq. mt.'}</span>
                          <span>🛏️ {room.bedType || '1 queen bed'}</span>
                          <span>🏙️ {(room as any).view || 'City view'}</span>
                          <span>👥 Sleeps {room.maxGuests || 2}</span>
                        </div>
                      </div>

                      {/* Checklist in 2 Columns (Exact Reference 3) */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-600 font-medium pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Extra toilet</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Shared bathroom</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Toiletries</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Towels</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Walk-in shower</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Free Wi-Fi</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <span className="text-slate-800 font-black">✓</span>
                          <span>Satellite channels</span>
                        </div>
                      </div>

                      {/* View Details Link */}
                      <button
                        type="button"
                        onClick={() => setViewingRoom(room)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline pt-1 block cursor-pointer"
                      >
                        View Details
                      </button>

                    </div>

                    {/* Right Column (lg:col-span-7): Clean Single Option (or 2 if owner offers breakfast) */}
                    <div className="lg:col-span-7 divide-y divide-slate-100 flex flex-col justify-center">
                      
                      {/* Option 1: Standard Room Reservation */}
                      {(!filterBreakfastOnly || !roomOffersBreakfast) && (
                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          
                          {/* Left / Middle (7 Cols): Perks */}
                          <div className="sm:col-span-7 space-y-1.5 text-left">
                            <h4 className="text-sm font-black text-slate-900">
                              Room With Free Cancellation
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                              <span className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center text-[9px] text-emerald-600">✓</span>
                              <span>Free Cancellation before check-in</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium pt-0.5">
                              <span>✓ Free WiFi</span>
                              <span>✓ Sanitized Clean Linens</span>
                            </div>
                          </div>

                          {/* Right Col (5 Cols): Badges, Price & Reserve Button */}
                          <div className="sm:col-span-5 text-left sm:text-right space-y-2">
                            <div className="flex items-center sm:justify-end gap-1.5">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                Book with ₹0
                              </span>
                            </div>

                            <div>
                              <div className="flex items-baseline gap-1.5 sm:justify-end">
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{baseOriginal.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                  ₹{baseNightRate.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium block">
                                + ₹0 extra fees · per night for 1 room
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenReserveModal(room.name, baseNightRate)}
                              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs hover:shadow cursor-pointer"
                            >
                              Reserve 1 Room
                            </button>
                          </div>

                        </div>
                      )}

                      {/* Option 2: ONLY if Hotel Owner Provides Breakfast */}
                      {roomOffersBreakfast && (
                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-amber-50/20">
                          
                          {/* Left / Middle (7 Cols): Perks */}
                          <div className="sm:col-span-7 space-y-1.5 text-left">
                            <h4 className="text-sm font-black text-slate-900">
                              Room With Free Cancellation, Breakfast
                            </h4>

                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                              <span className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center text-[9px] text-emerald-600">✓</span>
                              <span>Free Cancellation before check-in</span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium pt-0.5">
                              <span className="font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-1.5 py-0.5 rounded text-[11px]">
                                🍳 Breakfast Included
                              </span>
                              <span>✓ Free WiFi</span>
                            </div>
                          </div>

                          {/* Right Col (5 Cols): Badges, Price & Reserve Button */}
                          <div className="sm:col-span-5 text-left sm:text-right space-y-2">
                            <div className="flex items-center sm:justify-end gap-1.5">
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                Book with ₹0
                              </span>
                            </div>

                            <div>
                              <div className="flex items-baseline gap-1.5 sm:justify-end">
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{breakfastOriginal.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xl sm:text-2xl font-black text-slate-900">
                                  ₹{breakfastNightRate.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium block">
                                + ₹0 extra fees · per night for 1 room
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenReserveModal(`${room.name} (Breakfast Included)`, breakfastNightRate)}
                              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs hover:shadow cursor-pointer"
                            >
                              Reserve 1 Room
                            </button>
                          </div>

                        </div>
                      )}

                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================
            SECTION: LOCATION & PROXIMITY (#location) - SINGLE INSTANCE
        ======================================================== */}
        <div id="location" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>Location &amp; Proximity</span>
            </h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address} Boisar`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Left 7 Columns: Distance Cards & Description */}
            <div className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Railway Station</span>
                  <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{(hotel as any).stationDistance || (hotel.nearStation ? '2 mins walk to Boisar Station' : '8 mins to Station')}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Industrial Zone</span>
                  <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{(hotel as any).midcDistance || (hotel.nearMidc ? '5 mins drive to Tarapur MIDC' : '5 mins to MIDC')}</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Landmark</span>
                  <span className="text-xs font-black text-slate-900 mt-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{hotel.landmark || 'Near Boisar Railway Station & Auto Stand'}</span>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {hotel.description || `${hotel.name} is a highly accessible hotel located on Navapur Road right near Boisar Railway Station, Boisar West. It offers clean, sanitized AC and Non-AC rooms with flexible 3-hour, 6-hour, 12-hour day-stay slots and comfortable overnight stays. 100% couple-friendly, accepting valid local IDs, making it ideal for transit passengers, couples, and Tarapur MIDC visitors.`}
              </p>

              <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{hotel.address}</span>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Map Card (Exact Reference Image 2) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs group">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address} Boisar`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative h-40 w-full bg-slate-100 overflow-hidden cursor-pointer"
              >
                {/* Simulated Street Map Vector Background */}
                <div className="absolute inset-0 bg-[#f4f3f0] opacity-90">
                  <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,20 Q120,40 240,10 T400,60" fill="none" stroke="#e0ded6" strokeWidth="18" />
                    <path d="M50,150 Q180,90 350,130" fill="none" stroke="#ffffff" strokeWidth="14" />
                    <path d="M120,0 L120,160" fill="none" stroke="#fff4cc" strokeWidth="12" />
                    <path d="M260,0 L260,160" fill="none" stroke="#ffffff" strokeWidth="10" />
                    <path d="M0,90 L400,90" fill="none" stroke="#ffe0b2" strokeWidth="10" />
                  </svg>
                </div>

                {/* Street Label Placeholders */}
                <div className="absolute top-3 left-4 text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-white/70 px-1.5 py-0.5 rounded">
                  BOISAR STATION RD
                </div>
                <div className="absolute bottom-3 left-4 text-[9px] font-semibold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded">
                  TARAPUR MIDC ROAD
                </div>

                {/* Prominent Red Pin Marker in the Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative animate-bounce">
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-4 h-4 fill-white text-rose-600" />
                    </div>
                    <div className="w-3 h-1.5 bg-black/30 rounded-full mx-auto blur-[1px] mt-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-sans">
                  Map data ©2026
                </div>
              </a>

              <div className="p-2.5 text-center bg-white border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.address} Boisar`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center justify-center gap-1"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION: REVIEWS (#reviews) - SINGLE INSTANCE
        ======================================================== */}
        <div id="reviews" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {hotel.rating >= 4.5 ? '8.5' : '8.2'}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Excellent · {hotel.reviewsCount || 184} Ratings
                </h4>
                <span className="text-xs text-slate-500 font-medium">
                  77% rated positive in last 3 months
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-black border border-emerald-200 self-start sm:self-auto">
              <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>4.4 / 5</span>
              <span className="text-emerald-600/70 text-[10px]">({hotel.reviewsCount || 184} Reviews)</span>
            </div>
          </div>

          {/* "Guests are saying" Quote Card (Exact Reference 2) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-1.5">
            <span className="text-xs font-black text-slate-800 block">Guests are saying</span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
              &ldquo;{reviewsList[0]?.comment || 'Very neat and clean rooms. Location is right near the Boisar station, staff is very polite and helpful. Fast check-in.'}&rdquo;
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
              <span>🇮🇳</span>
              <span>{reviewsList[0]?.userName || 'Hemant Patil'}</span>
              <span>·</span>
              <span>Verified Guest</span>
              <span>·</span>
              <span>India</span>
              <span>·</span>
              <span>Oct 2026</span>
            </div>
          </div>

          {/* Verified Guest Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reviewsList
              .filter((r) => r && r.userName && r.userName.length > 1 && r.comment && r.comment.length > 5)
              .slice(0, 4)
              .map((rev) => (
                <div key={rev.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">{rev.userName}</span>
                      {rev.userCity && (
                        <span className="text-[11px] text-slate-500">({rev.userCity})</span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-500 text-[10px]">
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

          {/* Add Review Box */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-black text-slate-800 block">Rate Your Experience:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Your Name *"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
              />
              <input
                type="text"
                placeholder="City (e.g. Boisar / Mumbai)"
                value={newReviewCity}
                onChange={(e) => setNewReviewCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
              />
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    type="button"
                    key={starVal}
                    onClick={() => setNewReviewRating(starVal)}
                    className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`w-3.5 h-3.5 ${starVal <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-1">{newReviewRating}/5</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share your stay experience..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => {
                  const cleanAuthor = newReviewAuthor.trim();
                  const cleanComment = newReviewComment.trim();
                  if (!cleanAuthor || !cleanComment) {
                    showToast('Please enter your name and review details', 'error');
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
                    stayType: 'Night Stay'
                  };
                  setReviewsList([newRev, ...reviewsList]);
                  try {
                    const currentSaved = JSON.parse(localStorage.getItem(`majh_boisar_hotel_reviews_${hotel.id}`) || '[]');
                    localStorage.setItem(`majh_boisar_hotel_reviews_${hotel.id}`, JSON.stringify([newRev, ...currentSaved]));
                  } catch (e) {}
                  setNewReviewAuthor('');
                  setNewReviewCity('');
                  setNewReviewComment('');
                  showToast('Thank you! Your review has been submitted.', 'success');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION: FACILITIES & AMENITIES (#facilities) - SINGLE INSTANCE
        ======================================================== */}
        {/* ========================================================
            SECTION: FACILITIES & AMENITIES (#facilities) - SINGLE UNIFIED INSTANCE
        ======================================================== */}
        <div id="facilities" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Popular Facilities &amp; Amenities</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-500">24/7 Available</span>
          </div>

          {/* Single Unified Icon Grid (Exact Same Consistent Style, No Duplicates) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 text-center">
            {(() => {
              const rawList = hotel.amenities && hotel.amenities.length > 0
                ? hotel.amenities
                : [
                    'Free Wi-Fi',
                    'Air Conditioning',
                    'Car Parking',
                    'LED TV',
                    '24/7 Hot Water',
                    'Clean Linens',
                    'Power Backup',
                    '24/7 Front Desk',
                    '24*7 Security',
                    'Elevator Access'
                  ];

              const definitions: { [key: string]: { name: string; icon: React.ReactNode } } = {
                wifi: { name: 'Free Wi-Fi', icon: <Wifi className="w-5 h-5 text-blue-600" /> },
                ac: { name: 'Air Conditioning', icon: <Wind className="w-5 h-5 text-blue-600" /> },
                parking: { name: 'Car & Bike Parking', icon: <Car className="w-5 h-5 text-blue-600" /> },
                tv: { name: 'LED Television', icon: <Tv className="w-5 h-5 text-blue-600" /> },
                water: { name: '24/7 Hot Water', icon: <Bath className="w-5 h-5 text-blue-600" /> },
                linens: { name: 'Clean Sanitised Linens', icon: <Sparkles className="w-5 h-5 text-blue-600" /> },
                power: { name: 'Power Backup', icon: <Zap className="w-5 h-5 text-blue-600" /> },
                desk: { name: '24/7 Front Desk', icon: <Clock className="w-5 h-5 text-blue-600" /> },
                security: { name: '24*7 Security & CCTV', icon: <ShieldCheck className="w-5 h-5 text-blue-600" /> },
                lift: { name: 'Elevator Access', icon: <Building2 className="w-5 h-5 text-blue-600" /> },
                breakfast: { name: 'Buffet Breakfast', icon: <Utensils className="w-5 h-5 text-blue-600" /> },
                service: { name: 'Room Service', icon: <Coffee className="w-5 h-5 text-blue-600" /> }
              };

              const seen = new Set<string>();
              const list: { name: string; icon: React.ReactNode }[] = [];

              rawList.forEach((am: any) => {
                const rawName = typeof am === 'string' ? am : (am.name || '');
                const lower = rawName.toLowerCase();

                let key = '';
                if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) key = 'wifi';
                else if (lower === 'ac' || lower.includes('air') || lower.includes('condition')) key = 'ac';
                else if (lower.includes('park')) key = 'parking';
                else if (lower.includes('tv') || lower.includes('television')) key = 'tv';
                else if (lower.includes('water') || lower.includes('bath') || lower.includes('geyser') || lower.includes('shower')) key = 'water';
                else if (lower.includes('linen') || lower.includes('housekeep') || lower.includes('sanitiz') || lower.includes('towel')) key = 'linens';
                else if (lower.includes('power') || lower.includes('generator') || lower.includes('backup') || lower.includes('inverter')) key = 'power';
                else if (lower.includes('desk') || lower.includes('reception')) key = 'desk';
                else if (lower.includes('security') || lower.includes('cctv') || lower.includes('safe') || lower.includes('guard')) key = 'security';
                else if (lower.includes('lift') || lower.includes('elevator')) key = 'lift';
                else if (lower.includes('breakfast') || lower.includes('dining') || lower.includes('food') || lower.includes('restaurant')) key = 'breakfast';
                else if (lower.includes('service')) key = 'service';

                if (key && !seen.has(key) && definitions[key]) {
                  seen.add(key);
                  list.push(definitions[key]);
                } else if (!key && rawName.trim()) {
                  const cleanName = rawName.trim();
                  if (!seen.has(cleanName)) {
                    seen.add(cleanName);
                    list.push({ name: cleanName, icon: <Sparkles className="w-5 h-5 text-blue-600" /> });
                  }
                }
              });

              // Ensure standard essentials are present
              ['wifi', 'ac', 'parking', 'tv', 'water', 'linens', 'power', 'desk', 'security'].forEach(k => {
                if (!seen.has(k) && definitions[k]) {
                  seen.add(k);
                  list.push(definitions[k]);
                }
              });

              return list.map((am, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-blue-100 transition-all">
                    {am.icon}
                  </div>
                  <span className="text-[11.5px] font-bold text-slate-700 leading-tight">
                    {am.name}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* SECTION: POLICIES & HOUSE RULES (#policies) */}
        <div id="policies" className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Policies &amp; House Rules</span>
            </h2>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Easy 2-Min Check-in
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 font-medium">
            {deduplicateRules(hotel.rules && hotel.rules.length > 0 ? hotel.rules : [
              '18+ Valid Govt ID Required (Aadhaar / Driving License / DigiLocker)',
              'Couples & Local Boisar IDs Warmly Welcome',
              '24/7 Flexible Check-in & Standard Morning Check-out',
              'Book with ₹0 — Pay at hotel upon room inspection',
              'Visitors allowed in Reception Lobby only'
            ]).map((rule, rIdx) => (
              <div key={rIdx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <span className="text-emerald-600 font-black text-sm">✓</span>
                <span className="text-slate-800 font-medium leading-relaxed">{rule.replace(/^✓\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. MOBILE FLOATING BOTTOM BAR (Fast 1-Tap Reservation for smartphone users) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Room Tariff</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-slate-900">
              ₹{recommendedRoom.nightRate || hotel.nightRate}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
              Book with ₹0
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenReserveModal(recommendedRoom.name, recommendedRoom.nightRate || hotel.nightRate)}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs cursor-pointer transition-all"
        >
          Reserve Room
        </button>
      </div>

      {/* ========================================================
          6. RESERVE ROOM MODAL ("hum hotel m sirf reserved krnge same has resort")
      ======================================================== */}
      {/* RESERVE ROOM MODAL (Simple, Compact & Mobile-Optimized) */}
      {mounted && isReserveModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[600] flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => {
            if (!bookingSuccessPass) setIsReserveModalOpen(false);
          }}
        >
          <div 
            className="bg-white w-full max-w-[420px] rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Clean website style */}
            <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[9.5px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full inline-block">
                  ✓ {bookingSuccessPass ? 'Reservation Confirmed' : '₹0 Free Reservation'}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5">
                  {bookingSuccessPass ? 'Digital Hotel Room Pass' : `Reserve at ${hotel.name}`}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsReserveModalOpen(false);
                  setBookingSuccessPass(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 text-left">
              
              {!bookingSuccessPass ? (
                <form onSubmit={handleBookingSubmit} className="space-y-2.5">
                  
                  {/* Compact Selected Room Strip */}
                  <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                    <div className="truncate">
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Selected Room</span>
                      <strong className="text-slate-900 font-black truncate block text-xs sm:text-sm">{selectedRoomName}</strong>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9.5px] text-slate-400 font-bold block">Pay on Arrival</span>
                      <strong className="text-xs sm:text-sm font-black text-blue-700">₹{totalTariff}</strong>
                    </div>
                  </div>

                  {/* Plan Switcher: Sleek Segmented Switcher */}
                  <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 text-xs font-bold gap-1">
                    <button
                      type="button"
                      onClick={() => setStayMode('night')}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        stayMode === 'night'
                          ? 'bg-white text-slate-900 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🌙 Night Stay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStayMode('day')}
                      className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer ${
                        stayMode === 'day'
                          ? 'bg-white text-slate-900 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>☀️ Day Stay (9am–7pm)</span>
                    </button>
                  </div>

                  {/* Dates Selection (Compact Grid) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Check-in Date *</label>
                      <input
                        type="date"
                        required
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      {stayMode === 'night' ? (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Check-out Date *</label>
                          <input
                            type="date"
                            required
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Check-out Time</label>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 truncate">
                            By 07:00 PM
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guest Contact Details (Compact Grid) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Guest Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
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
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-blue-600 focus:bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Rooms & Guests Count (Compact Grid) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Rooms Count</label>
                      <select
                        value={roomsCount}
                        onChange={(e) => setRoomsCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value={1}>1 Room</option>
                        <option value={2}>2 Rooms</option>
                        <option value={3}>3 Rooms</option>
                        <option value={4}>4 Rooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Guests Count</label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                        <option value={6}>6 Guests</option>
                      </select>
                    </div>
                  </div>

                  {/* Sleek ₹0 Micro Reassurance Banner */}
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-2.5 py-1.5 rounded-xl text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Book with ₹0 · Pay at reception on check-in</span>
                  </div>

                  {/* Action Buttons: Sleek & Compact */}
                  <div className="space-y-1.5 pt-0.5">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Confirm Reservation (Book with ₹0)</span>
                    </button>

                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Reserve via Hotel WhatsApp Directly</span>
                    </button>
                  </div>

                </form>
              ) : (
                /* Confirmed Digital Pass Display (Clean Website Matching Theme) */
                <div className="space-y-3 text-center">
                  
                  {/* Top Success Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Room Reserved Successfully
                    </h3>
                    <p className="text-[11.5px] text-slate-500 font-medium mt-0.5">
                      Your room is held at {bookingSuccessPass.hotelName}. Pay directly upon check-in.
                    </p>
                  </div>

                  {/* Pass Ticket Design (Clean white card matching Majh Boisar) */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-left text-xs divide-y divide-slate-100">
                    
                    {/* Ticket Header */}
                    <div className="bg-slate-50 px-3.5 py-2.5 flex items-center justify-between">
                      <div>
                        <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-widest block">PASS REFERENCE ID</span>
                        <strong className="text-xs sm:text-sm font-mono text-slate-900 font-black">{bookingSuccessPass.id}</strong>
                      </div>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        ✓ Pay at Hotel
                      </span>
                    </div>

                    {/* Ticket Details */}
                    <div className="p-3.5 space-y-2 text-[11.5px] font-medium">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
                          <Building2 className="w-3.5 h-3.5 text-blue-600" /> Hotel:
                        </span>
                        <span className="text-slate-900 font-bold text-right truncate">{bookingSuccessPass.hotelName}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
                          <BedDouble className="w-3.5 h-3.5 text-blue-600" /> Room:
                        </span>
                        <span className="text-blue-700 font-black text-right truncate">{bookingSuccessPass.roomCategory}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" /> Check-in:
                        </span>
                        <span className="text-slate-800 font-bold">{bookingSuccessPass.date}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-blue-600" /> Stay:
                        </span>
                        <span className="text-slate-800 font-bold">{bookingSuccessPass.stayType || 'Night Stay'}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-slate-500 font-semibold flex items-center gap-1.5 shrink-0">
                          <User className="w-3.5 h-3.5 text-blue-600" /> Guest:
                        </span>
                        <span className="text-slate-800 font-bold truncate">{bookingSuccessPass.guestName} ({bookingSuccessPass.guestPhone})</span>
                      </div>
                    </div>

                    {/* Payable Strip */}
                    <div className="bg-blue-50/70 border-t border-blue-100/70 px-3.5 py-2.5 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-blue-950 font-bold text-xs block">
                          Pay at Reception on Arrival:
                        </span>
                        <span className="text-[9.5px] text-blue-700 font-medium block">
                          Booked with ₹0 Advance
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-black text-slate-900 block">₹{bookingSuccessPass.totalAmount}</span>
                      </div>
                    </div>

                    {/* Micro Instructions */}
                    <div className="px-3.5 py-2 bg-slate-50/80 text-[10.5px] text-slate-600 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Show this pass &amp; Govt ID at reception to collect room key.</span>
                    </div>

                  </div>

                  {/* Send Pass to WhatsApp CTA */}
                  <a
                    href={`https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(
                      `Hello ${hotel.name},\nI have reserved a room on Majh Boisar.\n\n📋 Pass Ref: ${bookingSuccessPass.id}\n🛏️ Room: ${bookingSuccessPass.roomCategory}\n👤 Guest: ${bookingSuccessPass.guestName} (${bookingSuccessPass.guestPhone})\n📅 Date: ${bookingSuccessPass.date}\n⏰ Stay: ${bookingSuccessPass.stayType}\n💰 Amount to Pay on Arrival: ₹${bookingSuccessPass.totalAmount}\n\nPlease confirm room check-in.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Pass to Hotel WhatsApp</span>
                  </a>

                  {/* Secondary Buttons */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReserveModalOpen(false);
                        setIsMyPassesModalOpen(true);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="w-3.5 h-3.5 text-slate-500" />
                      <span>View My Passes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingSuccessPass(null);
                        setIsReserveModalOpen(false);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}


      {/* ========================================================
          ROOM DETAILS PREVIEW MODAL ("View Details" on room card)
      ======================================================== */}
      {mounted && viewingRoom && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setViewingRoom(null)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <h3 className="text-base font-black text-white leading-tight">
                {viewingRoom.name}
              </h3>
              <button
                type="button"
                onClick={() => setViewingRoom(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-left">
              {(() => {
                const roomPhotos = Array.from(new Set([
                  viewingRoom.image,
                  ...(Array.isArray(viewingRoom.gallery) ? viewingRoom.gallery : [])
                ].filter(Boolean)));
                const currentImg = roomPhotos[viewingRoomPhotoIdx] || viewingRoom.image || hotel.gallery[0];
                return (
                  <div className="space-y-2">
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 relative">
                      <img src={currentImg} alt={viewingRoom.name} className="w-full h-full object-cover" />
                      {roomPhotos.length > 1 && (
                        <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                          {viewingRoomPhotoIdx + 1} / {roomPhotos.length}
                        </div>
                      )}
                    </div>
                    {roomPhotos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5">
                        {roomPhotos.map((photo: string, pIdx: number) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setViewingRoomPhotoIdx(pIdx)}
                            className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              viewingRoomPhotoIdx === pIdx ? 'border-blue-600 scale-95 shadow-md ring-2 ring-blue-600/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-700 font-bold border-b border-slate-100 pb-3">
                <span>📐 Size: {viewingRoom.size || '9 sq. mt.'}</span>
                <span>🛏️ Bed: {viewingRoom.bedType || '1 queen bed'}</span>
                <span>🏙️ View: {viewingRoom.view || 'City view'}</span>
                <span>👥 Sleeps: {viewingRoom.maxGuests || 2} Guests</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Room Amenities &amp; Features</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  {(viewingRoom.amenities || ['Extra toilet', 'Attached bathroom', 'Toiletries', 'Towels', 'Walk-in shower', 'Free Wi-Fi', 'Satellite channels']).map((am: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-emerald-600 font-black">✓</span>
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                <strong>✓ Free Cancellation before check-in</strong> · Book with ₹0 Advance
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price per night</span>
                  <span className="text-xl font-black text-slate-900">₹{viewingRoom.nightRate?.toLocaleString('en-IN') || hotel.nightRate}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setViewingRoom(null);
                    handleOpenReserveModal(viewingRoom.name, viewingRoom.nightRate || hotel.nightRate);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Reserve This Room
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Guest's All Hotel Booking Passes Modal */}
      <MyHotelPassesModal
        isOpen={isMyPassesModalOpen}
        onClose={() => {
          setIsMyPassesModalOpen(false);
          refreshUserPasses();
        }}
      />

      {/* ========================================================
          7. FULL PHOTO GALLERY MODAL / LIGHTBOX
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
          {/* Top Bar */}
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

          {/* Center Main Photo Canvas */}
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
                title="Previous Photo"
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
                title="Next Photo"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
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
