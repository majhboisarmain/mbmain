'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getAllHotels } from '@/lib/hotelsData';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import {
  Building, Eye, Phone, MessageSquare, ClipboardCheck, Sparkles,
  ArrowUpRight, Plus, Trash2, Check, X, ShieldAlert, Award, Star,
  TrendingUp, Activity, Layers, Coins, Globe, Clock, Mail, MapPin,
  FileText, ArrowRight, ArrowLeft, Briefcase, Trophy, Gamepad2, Edit, Search, Lock, Unlock, QrCode,
  Utensils, Bell, Receipt, Printer, Volume2, VolumeX, Coffee
} from 'lucide-react';
import BusinessQRStandeeModal from '@/components/BusinessQRStandeeModal';
import { compressImage } from '@/lib/imageCompressor';
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
}

interface Service {
  id: number;
  name: string;
  price: number | null;
  duration: string | null;
}

interface Lead {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  query: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  website: string | null;
  email: string | null;
  workingHours: string;
  image: string;
  location: string;
  views: number;
  phoneClicks: number;
  whatsappClicks: number;
  directionClicks: number;
  websiteClicks: number;
  subscription: string;
  premium: boolean;
  verified: boolean;
  rating: number;
  reviewCount: number;
  products: Product[];
  services: Service[];
  reviews: Review[];
  leads: Lead[];
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
}

function DashboardContent() {
  const { currentRole, isLoggedIn, setLoginModalOpen, setRole, loggedInUser, showToast, hasRegisteredBusiness, setHasRegisteredBusiness } = useApp();
  const searchParams = useSearchParams();
  const modeParam = searchParams?.get('mode');
  const tabParam = searchParams?.get('tab');
  const hotelIdParam = searchParams?.get('hotelId');
  const hotelNameParam = searchParams?.get('hotelName');
  const bizIdParam = searchParams?.get('bizId') || searchParams?.get('id') || searchParams?.get('businessId');

  const isAdminAuth = Boolean(
    currentRole === 'Admin' ||
    loggedInUser?.email === 'admin@majhboisar.in' ||
    loggedInUser?.email === 'majhboisar@gmail.com' ||
    loggedInUser?.phone === '9999999999' ||
    loggedInUser?.phone === '9307294733' ||
    (loggedInUser?.phone || '').replace(/\D/g, '').endsWith('9307294733') ||
    (loggedInUser?.name || '').toLowerCase().includes('admin') ||
    (typeof window !== 'undefined' && (
      sessionStorage.getItem('majh_boisar_adminmb_auth') === 'unlocked' ||
      localStorage.getItem('majh_boisar_role') === 'Admin' ||
      localStorage.getItem('majh_boisar_admin_logged_in') === 'true'
    ))
  );

  const [businessesList, setBusinessesList] = useState<{ id: number; name: string; category?: string }[]>([]);
  const [selectedId, setSelectedId] = useState<number>(bizIdParam ? Number(bizIdParam) : 1);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStandeeModalOpen, setIsStandeeModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'hotel_bookings' | 'turf_bookings' | 'kitchen_orders' | 'leads' | 'catalog' | 'reviews' | 'settings' | 'subscription' | 'jobs' | 'property_leads'>(
    (tabParam as any) || (hotelIdParam || hotelNameParam ? 'hotel_bookings' : 'analytics')
  );

  // Directly open & manage hotel dashboard when hotelId or hotelName is passed (e.g. from Admin Panel)
  useEffect(() => {
    if (hotelIdParam || hotelNameParam) {
      const isAdmin = currentRole === 'Admin' || 
        loggedInUser?.email === 'admin@majhboisar.in' || 
        loggedInUser?.phone === '9999999999' || 
        (loggedInUser?.name || '').toLowerCase().includes('admin');

      const userPhone = (loggedInUser?.phone || '').replace(/\D/g, '');

      try {
        const allH = getAllHotels();
        const match = allH.find(h => 
          (hotelIdParam && h.id === hotelIdParam) || 
          (hotelIdParam && h.slug === hotelIdParam) ||
          (hotelNameParam && h.name.toLowerCase() === hotelNameParam.toLowerCase())
        );
        if (match) {
          const hotelPhone = (match.phone || '').replace(/\D/g, '');
          const hotelWhatsapp = (match.whatsapp || '').replace(/\D/g, '');
          const isOwner = userPhone && (userPhone === hotelPhone || userPhone === hotelWhatsapp);

          // Security check: ONLY Admin or the verified Hotel Owner can access this hotel
          if (!isAdmin && !isOwner) {
            showToast('🔒 Access Restricted: Only Admin and the Hotel Owner can manage this hotel.', 'error');
            return;
          }

          setBusiness({
            id: 99000,
            name: match.name,
            category: 'Hotels',
            description: match.tagline || 'Verified Hotel Partner in Boisar',
            address: match.address || `${match.location}, Boisar`,
            phone: match.phone,
            whatsapp: match.whatsapp || match.phone,
            website: null,
            email: null,
            workingHours: '24 Hours Open',
            image: (match.gallery && match.gallery.length > 0 && match.gallery[0]) ? match.gallery[0] : ((match as any).image || '/majh-boisar-mb-logo.png'),
            location: match.location || 'Boisar',
            views: 650,
            phoneClicks: 120,
            whatsappClicks: 85,
            directionClicks: 45,
            websiteClicks: 18,
            subscription: 'Admin Verified',
            premium: true,
            verified: true,
            rating: match.rating || 4.8,
            reviewCount: match.reviewsCount || 15,
            products: [],
            services: [],
            reviews: (match.reviews || []).map((r, i) => ({ id: i + 1, userName: r.userName, rating: r.rating, comment: r.comment, createdAt: r.date })),
            leads: []
          });
          setActiveSubTab('hotel_bookings');
          setLoading(false);
        }
      } catch (err) {}
    }
  }, [hotelIdParam, hotelNameParam, currentRole, loggedInUser]);

  useEffect(() => {
    if (tabParam && ['analytics', 'hotel_bookings', 'turf_bookings', 'kitchen_orders', 'leads', 'catalog', 'reviews', 'settings', 'subscription', 'jobs', 'property_leads'].includes(tabParam)) {
      setActiveSubTab(tabParam as any);
    }
  }, [tabParam]);

  useEffect(() => {
    if (business) {
      const bizCatLower = (business?.category || '').toLowerCase();
      const bizNameLower = (business?.name || '').toLowerCase();
      const isHospital = bizCatLower.includes('hospital') || bizCatLower.includes('clinic') || bizCatLower.includes('doctor') || bizCatLower.includes('medical') || bizNameLower.includes('hospital') || bizNameLower.includes('clinic');
      const isHotel = !isHospital && (
        bizCatLower === 'hotel' ||
        bizCatLower === 'hotels' ||
        bizCatLower === 'resort' ||
        bizCatLower === 'resorts' ||
        bizCatLower.includes('hotel') ||
        bizCatLower.includes('resort') ||
        bizCatLower.includes('guest house') ||
        bizCatLower.includes('lodge') ||
        bizCatLower.includes('villa') ||
        bizCatLower.includes('homestay') ||
        bizNameLower.includes('hotel') ||
        bizNameLower.includes('resort')
      );
      if (activeSubTab === 'hotel_bookings' && !isHotel) {
        setActiveSubTab('analytics');
      } else if (isHotel && (hotelIdParam || hotelNameParam || tabParam === 'hotel_bookings')) {
        setActiveSubTab('hotel_bookings');
      }
    }
  }, [business?.id, business?.category, hotelIdParam, hotelNameParam, tabParam]);

  // Specialist & Property dashboard states
  const [specialProfile, setSpecialProfile] = useState<any>(null);
  const [dashboardMode, setDashboardMode] = useState<'shop' | 'specialist' | 'property'>(modeParam === 'property' ? 'property' : 'shop');
  // Property Editing States
  const defaultUserProps: any[] = [];

  const userPhoneDigits = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '';

  const [rawPropertyList, setRawPropertyList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_user_properties');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const dummyIds = [1, 2, 3, 101, 102, 201, 202, 203, 204, 205];
            const clean = parsed.filter((p: any) => !dummyIds.includes(p.id));
            localStorage.setItem('majh_boisar_user_properties', JSON.stringify(clean));
            return clean;
          }
        } catch (e) { }
      }
    }
    return [];
  });

  const setUserPropertyList = (newList: any[]) => {
    setRawPropertyList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user_properties', JSON.stringify(newList));
    }
  };

  const userPropertyList = React.useMemo(() => {
    if (!userPhoneDigits) return [];
    return rawPropertyList.filter((p: any) => {
      const pPhone = (p.phone || p.contactPhone || p.postedByPhone || p.userPhone || p.userId || '').toString().replace(/\D/g, '');
      if (!pPhone) return false;
      return pPhone.endsWith(userPhoneDigits) || userPhoneDigits.endsWith(pPhone);
    });
  }, [rawPropertyList, userPhoneDigits]);

  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [editPropTitle, setEditPropTitle] = useState('');
  const [editPropLocation, setEditPropLocation] = useState('');
  const [editPropPrice, setEditPropPrice] = useState('');
  const [editPropArea, setEditPropArea] = useState('');
  const [editPropStatus, setEditPropStatus] = useState('');
  const [editPropContactName, setEditPropContactName] = useState('');
  const [editPropContactPhone, setEditPropContactPhone] = useState('');
  const [editPropImage, setEditPropImage] = useState('');
  const [propertySubTab, setPropertySubTab] = useState<'listings' | 'leads' | 'subscription'>('listings');

  const handleOpenEditProperty = (prop: any) => {
    setEditingProperty(prop);
    setEditPropTitle(prop.title || '');
    setEditPropLocation(prop.location || 'Boisar West');
    setEditPropPrice(prop.price || '');
    setEditPropArea(prop.area || '');
    setEditPropStatus(prop.status || 'Ready to Move');
    setEditPropContactName(prop.postedBy || '');
    setEditPropContactPhone(prop.phone || '');
    setEditPropImage(prop.image || '');
  };

  const handleSaveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const updatedList = userPropertyList.map((p) => {
      if (p.id === editingProperty.id) {
        return {
          ...p,
          title: editPropTitle,
          location: editPropLocation,
          price: editPropPrice,
          area: editPropArea,
          status: editPropStatus,
          postedBy: editPropContactName,
          phone: editPropContactPhone,
          image: editPropImage
        };
      }
      return p;
    });

    setUserPropertyList(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user_properties', JSON.stringify(updatedList));
    }
    setEditingProperty(null);
    alert('Success! Your property listing has been updated.');
  };

  // Specialist Checkout states
  const [specialistCheckoutOpen, setSpecialistCheckoutOpen] = useState(false);
  const [specialistCheckoutPlan, setSpecialistCheckoutPlan] = useState<'Pro' | 'Premium' | null>(null);
  const [specialistCouponApplied, setSpecialistCouponApplied] = useState(false);
  const [specialistCouponInput, setSpecialistCouponInput] = useState('');
  const [specialistCouponSuccess, setSpecialistCouponSuccess] = useState('');
  const [specialistCouponError, setSpecialistCouponError] = useState('');
  const [specialistPaymentMode, setSpecialistPaymentMode] = useState<'upi' | 'card' | 'net'>('upi');
  const [specialistUpiRef, setSpecialistUpiRef] = useState('');

  // Jobs states
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch(`/api/jobs?businessId=${selectedId}&includeApplications=true`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'jobs' && selectedId && dashboardMode === 'shop') {
      fetchJobs();
    }
  }, [activeSubTab, selectedId, dashboardMode]);

  const handleUpdateJobStatus = async (jobId: number, status: string) => {
    if (!confirm(`Are you sure you want to mark this job as ${status}?`)) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) { console.error(e); }
  };

  const updateSpecialistSubscriptionLocal = (plan: string) => {
    if (!specialProfile) return;
    const saved = localStorage.getItem('majh_boisar_special_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      const category = specialProfile.catKey;
      const list = parsed[category] || [];
      const updatedList = list.map((p: any) => {
        if (p.phone === specialProfile.phone) {
          return { ...p, subscription: plan };
        }
        return p;
      });
      const nextState = {
        ...parsed,
        [category]: updatedList
      };
      localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
      setSpecialProfile({ ...specialProfile, subscription: plan });
    }
  };

  const updateSpecialistProfileLocal = (updatedData: any) => {
    if (!specialProfile) return;
    const saved = localStorage.getItem('majh_boisar_special_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      const category = specialProfile.catKey;
      const list = parsed[category] || [];
      const updatedList = list.map((p: any) => {
        if (p.phone === specialProfile.phone) {
          return { ...p, ...updatedData };
        }
        return p;
      });
      const nextState = {
        ...parsed,
        [category]: updatedList
      };
      localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
      setSpecialProfile({ ...specialProfile, ...updatedData });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const modeParam = searchParams.get('mode');

      if (modeParam === 'property') {
        setDashboardMode('property');
        return;
      } else if (modeParam === 'shop') {
        setDashboardMode('shop');
        return;
      }
    }

    if (typeof window !== 'undefined' && loggedInUser) {
      const saved = localStorage.getItem('majh_boisar_special_profiles');
      let foundProfile: any = null;
      let foundCatKey: string = '';
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          for (const [cat, list] of Object.entries(parsed)) {
            if (cat === 'properties' || cat === 'realestate') continue;
            const match = (list as any[]).find((p: any) => p.phone === loggedInUser.phone);
            if (match) {
              foundProfile = match;
              foundCatKey = cat;
              break;
            }
          }
        } catch (e) { }
      }

      if (foundProfile) {
        setSpecialProfile({ ...foundProfile, catKey: foundCatKey });
        setDashboardMode('specialist');
        return;
      } else {
        setSpecialProfile(null);
      }

      const hasShop = businessesList.length > 0;
      const hasProp = userPropertyList.length > 0;

      if (hasShop && !hasProp) {
        setDashboardMode('shop');
      } else if (hasProp && !hasShop) {
        setDashboardMode('property');
      } else if (hasShop) {
        setDashboardMode('shop');
      } else {
        setDashboardMode('shop');
      }
    }
  }, [loggedInUser, businessesList, userPropertyList]);

  // Form states for adding items
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  const [srvName, setSrvName] = useState('');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvDuration, setSrvDuration] = useState('');
  const [addingService, setAddingService] = useState(false);

  // Special Offers & Category Rates Manager state
  const [specialOffersList, setSpecialOffersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_user_special_offers');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return [];
  });
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerValidTill, setOfferValidTill] = useState('');
  const [offerCategory, setOfferCategory] = useState('Shop Offer');

  const handleAddSpecialOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim()) return;
    const newOffer = {
      id: 'off-' + Date.now(),
      title: offerTitle,
      discount: offerDiscount || 'Special Deal',
      code: offerCode || 'N/A',
      validTill: offerValidTill || 'Limited Time',
      category: offerCategory,
      createdAt: new Date().toLocaleDateString('en-IN')
    };
    const updated = [newOffer, ...specialOffersList];
    setSpecialOffersList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user_special_offers', JSON.stringify(updated));
    }
    setOfferTitle('');
    setOfferDiscount('');
    setOfferCode('');
    setOfferValidTill('');
    alert('✅ Success! Special Offer / Service Rate added to your Business Catalog.');
  };

  const handleDeleteSpecialOffer = (id: string) => {
    const updated = specialOffersList.filter(o => o.id !== id);
    setSpecialOffersList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user_special_offers', JSON.stringify(updated));
    }
  };

  // ⚽ Turf Bookings Management System State
  const [turfBookingsList, setTurfBookingsList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_turf_bookings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { }
      }
    }
    return [
      {
        id: 'tb-1',
        refCode: 'TURF-9482',
        venueName: 'Boisar Champions Box Cricket Turf',
        category: 'Box Cricket',
        userName: 'Sanket Patil',
        userPhone: '9823456789',
        bookingDate: 'Today',
        timeSlot: '06:00 PM - 07:00 PM',
        duration: '1 Hour',
        estRate: '₹800',
        status: 'Confirmed',
        createdAt: '2 hours ago'
      },
      {
        id: 'tb-2',
        refCode: 'TURF-3819',
        venueName: 'Tarapur Arena Football & Turf',
        category: 'Football',
        userName: 'Rahul Sharma',
        userPhone: '9123456780',
        bookingDate: 'Tomorrow',
        timeSlot: '08:00 PM - 09:00 PM',
        duration: '1 Hour',
        estRate: '₹900',
        status: 'Attended / Visited',
        createdAt: 'Yesterday'
      }
    ];
  });

  // ⚽ Custom Slot Pricing State (Slot -> Price)
  const [slotPrices, setSlotPrices] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_turf_slot_prices');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return {
      '08:00 AM - 09:00 AM': '₹150',
      '09:00 AM - 10:00 AM': '₹150',
      '10:00 AM - 11:00 AM': '₹150',
      '11:00 AM - 12:00 PM': '₹200',
      '02:00 PM - 03:00 PM': '₹200',
      '04:00 PM - 05:00 PM': '₹200',
      '06:00 PM - 07:00 PM': '₹250',
      '07:00 PM - 08:00 PM': '₹250',
      '08:00 PM - 09:00 PM': '₹300',
      '09:00 PM - 10:00 PM': '₹300',
    };
  });

  // Slot Override Controls (Slot -> 'Available' | 'Closed')
  const [slotControls, setSlotControls] = useState<Record<string, 'Available' | 'Closed'>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_turf_slot_controls');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return {};
  });

  // Screen / Station Selection State for Multi-Screen Game Management
  const [selectedScreen, setSelectedScreen] = useState<'Screen 1' | 'Screen 2' | 'Screen 3'>('Screen 1');

  const [manualPlayerName, setManualPlayerName] = useState('');
  const [manualPlayerPhone, setManualPlayerPhone] = useState('');
  const [manualCategory, setManualCategory] = useState('VR & Arcade Gaming');
  const [manualDate, setManualDate] = useState('Today');
  const [manualSlot, setManualSlot] = useState('06:00 PM - 07:00 PM');
  const [manualStation, setManualStation] = useState('Screen 1 (PS5 OLED #1)');
  const [manualDuration, setManualDuration] = useState('1 Hour');
  const [manualRate, setManualRate] = useState('₹250');

  // ── HOTEL BOOKINGS DESK STATE ──
  const [hotelBookingsList, setHotelBookingsList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_hotel_bookings');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  const [hotelBookingFilter, setHotelBookingFilter] = useState<'All' | 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled'>('All');
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  
  // Manual Walk-in Hotel Booking Form States
  const [manualHotelGuestName, setManualHotelGuestName] = useState('');
  const [manualHotelGuestPhone, setManualHotelGuestPhone] = useState('');
  const [manualHotelName, setManualHotelName] = useState('');
  const [manualHotelStayType, setManualHotelStayType] = useState<'hourly' | 'night'>('hourly');
  const [manualHotelDuration, setManualHotelDuration] = useState('3h');
  const [manualHotelTimeSlot, setManualHotelTimeSlot] = useState('12:00 PM - 03:00 PM (3 Hours)');
  const [manualHotelDate, setManualHotelDate] = useState('Today');
  const [manualHotelRoomCategory, setManualHotelRoomCategory] = useState('Deluxe AC Room');
  const [manualHotelRoomNo, setManualHotelRoomNo] = useState('101');
  const [manualHotelAmount, setManualHotelAmount] = useState('699');

  // Reload bookings from localStorage
  useEffect(() => {
    const loadHotelBookings = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('majh_boisar_hotel_bookings');
        if (saved) {
          try {
            setHotelBookingsList(JSON.parse(saved));
          } catch (e) {}
        }
      }
    };
    loadHotelBookings();
    window.addEventListener('storage', loadHotelBookings);
    window.addEventListener('focus', loadHotelBookings);
    return () => {
      window.removeEventListener('storage', loadHotelBookings);
      window.removeEventListener('focus', loadHotelBookings);
    };
  }, []);

  // Room Live Availability
  const [hotelAvailability, setHotelAvailability] = useState<{ ac: boolean; non_ac: boolean }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_hotel_availability_freesia');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { ac: true, non_ac: true };
  });

  const handleToggleRoomAvailability = (type: 'ac' | 'non_ac') => {
    const updated = { ...hotelAvailability, [type]: !hotelAvailability[type] };
    setHotelAvailability(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_availability_freesia', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleExportHotelRegisterCSV = () => {
    if (hotelBookingsList.length === 0) {
      alert('No booking records to export yet.');
      return;
    }
    const headers = ['Pass ID', 'Hotel Name', 'Guest Name', 'WhatsApp Phone', 'Stay Mode', 'Time Window', 'Check-In Date', 'Assigned Room', 'Total (INR)', 'Coupon Code', 'Discount (INR)', 'Status', 'Recorded At'];
    const rows = hotelBookingsList.map(b => [
      b.id || '',
      `"${(b.hotelName || '').replace(/"/g, '""')}"`,
      `"${(b.guestName || '').replace(/"/g, '""')}"`,
      b.guestPhone || '',
      b.stayType || '',
      `"${(b.timeSlot || '').replace(/"/g, '""')}"`,
      b.date || '',
      `"${(b.assignedRoom || 'Unassigned').replace(/"/g, '""')}"`,
      b.totalAmount || 0,
      b.couponCode || 'None',
      b.discountAmount || 0,
      b.status || 'Confirmed',
      `"${(b.createdAt || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MajhBoisar_Hotel_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateHotelBookingStatus = (bookingId: string, newStatus: string, roomNo?: string) => {
    const updated = hotelBookingsList.map(b => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          status: newStatus,
          ...(roomNo !== undefined ? { assignedRoom: roomNo } : {})
        };
      }
      return b;
    });
    setHotelBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify(updated));
    }
  };

  const handleDeleteHotelBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to remove this booking from records?')) return;
    const updated = hotelBookingsList.filter(b => b.id !== bookingId);
    setHotelBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify(updated));
    }
  };

  const handleAddManualHotelBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualHotelGuestName.trim() || !manualHotelGuestPhone.trim()) {
      alert('Please enter guest name and phone number.');
      return;
    }

    const ref = `MB-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: ref,
      hotelId: business?.id?.toString() || 'h1',
      hotelName: manualHotelName || business?.name || 'Freesia by Express Inn',
      hotelPhone: business?.phone || '917769947217',
      hotelLocation: business?.location || 'Boisar West',
      guestName: manualHotelGuestName,
      guestPhone: manualHotelGuestPhone,
      idProofType: 'Aadhaar Card (Verified at Desk)',
      stayType: manualHotelStayType,
      hourlyDuration: manualHotelStayType === 'hourly' ? manualHotelDuration : null,
      timeSlot: manualHotelTimeSlot,
      checkInDate: manualHotelDate,
      guestCount: 2,
      roomCount: 1,
      roomCategory: manualHotelRoomCategory,
      assignedRoom: manualHotelRoomNo,
      totalAmount: manualHotelAmount,
      status: 'Confirmed & Assigned Room',
      createdAt: 'Just now (Walk-in Entry)'
    };

    const updated = [newBooking, ...hotelBookingsList];
    setHotelBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify(updated));
    }
    setManualHotelGuestName('');
    setManualHotelGuestPhone('');
    alert(`✅ Walk-in Room Booking saved successfully! Pass Ref: ${ref}`);
  };

  // ── HOTEL ROOM INVENTORY & TARIFF MANAGEMENT STATE ──
  const defaultHotelRooms = [
    {
      id: 'r1',
      name: 'Deluxe King Room',
      type: 'Deluxe AC',
      bedType: '1 King Bed',
      maxGuests: 2,
      size: '220 sq.ft',
      hourly3h: 699,
      hourly6h: 1099,
      hourly12h: 1599,
      nightRate: 1899,
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      amenities: ['AC', 'Free Wi-Fi', 'Hot Shower', 'TV', 'Clean Bedding']
    },
    {
      id: 'r2',
      name: 'Executive Suite',
      type: 'Suite Room',
      bedType: '1 King Bed + Lounge Sofa',
      maxGuests: 3,
      size: '350 sq.ft',
      hourly3h: 999,
      hourly6h: 1499,
      hourly12h: 1999,
      nightRate: 2499,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      amenities: ['AC', 'Free Wi-Fi', 'Hot Shower', 'TV', 'Sofa', 'Mini Fridge']
    }
  ];

  const [hotelRoomsList, setHotelRoomsList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_hotel_rooms_freesia-by-express-inn') ||
                    localStorage.getItem('majh_boisar_hotel_rooms_h1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return defaultHotelRooms;
  });

  // New Room Form States
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('Deluxe AC');
  const [newRoomBed, setNewRoomBed] = useState('1 King Bed');
  const [newRoomGuests, setNewRoomGuests] = useState(2);
  const [newRoom3h, setNewRoom3h] = useState('799');
  const [newRoom6h, setNewRoom6h] = useState('1199');
  const [newRoom12h, setNewRoom12h] = useState('1699');
  const [newRoomNight, setNewRoomNight] = useState('1999');
  const [newRoomImage, setNewRoomImage] = useState('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80');

  const handleUpdateFullRoom = (roomId: string, name: string, type: string, bedType: string, maxGuests: number, h3: number, h6: number, h12: number, night: number) => {
    const updated = hotelRoomsList.map(r => {
      if (r.id === roomId) {
        return { 
          ...r, 
          name: name || r.name,
          type: type || r.type,
          bedType: bedType || r.bedType,
          maxGuests: maxGuests || r.maxGuests,
          hourly3h: h3, 
          hourly6h: h6, 
          hourly12h: h12, 
          nightRate: night 
        };
      }
      return r;
    });
    setHotelRoomsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_rooms_freesia-by-express-inn', JSON.stringify(updated));
      localStorage.setItem('majh_boisar_hotel_rooms_h1', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
    alert(`✅ Room "${name || 'Details'}" & pricing updated successfully! Live rates updated on hotel page.`);
  };

  const handleAddNewHotelRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      alert('Please enter room name.');
      return;
    }
    const newRoom = {
      id: `r_${Date.now()}`,
      name: newRoomName.trim(),
      type: newRoomType,
      bedType: newRoomBed,
      maxGuests: Number(newRoomGuests) || 2,
      size: '250 sq.ft',
      hourly3h: Number(newRoom3h) || 699,
      hourly6h: Number(newRoom6h) || 1099,
      hourly12h: Number(newRoom12h) || 1599,
      nightRate: Number(newRoomNight) || 1899,
      image: newRoomImage || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      amenities: ['AC', 'Free Wi-Fi', 'Hot Shower', 'Clean Bedding', 'TV']
    };
    const updated = [...hotelRoomsList, newRoom];
    setHotelRoomsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_rooms_freesia-by-express-inn', JSON.stringify(updated));
      localStorage.setItem('majh_boisar_hotel_rooms_h1', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
    setNewRoomName('');
    alert(`🎉 New Room "${newRoom.name}" added to hotel inventory successfully!`);
  };

  const handleDeleteHotelRoom = (roomId: string) => {
    if (hotelRoomsList.length <= 1) {
      alert('At least one room category is required.');
      return;
    }
    if (!confirm('Are you sure you want to remove this room category?')) return;
    const updated = hotelRoomsList.filter(r => r.id !== roomId);
    setHotelRoomsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_rooms_freesia-by-express-inn', JSON.stringify(updated));
      localStorage.setItem('majh_boisar_hotel_rooms_h1', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  // ── LIVE KITCHEN ORDER & TABLE KDS STATE FOR RESTAURANTS / CAFES ──
  const [kitchenAudioEnabled, setKitchenAudioEnabled] = useState(true);
  const [kitchenOrdersFilter, setKitchenOrdersFilter] = useState<'all' | 'dinein' | 'delivery' | 'new' | 'cooking' | 'ready' | 'history'>('all');
  const [newManualOrderTable, setNewManualOrderTable] = useState('1');
  const [newManualOrderDiner, setNewManualOrderDiner] = useState('');
  const [newManualOrderItems, setNewManualOrderItems] = useState('');
  const [newManualOrderAmount, setNewManualOrderAmount] = useState('');
  const [newManualOrderNotes, setNewManualOrderNotes] = useState('');
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);

  const defaultKitchenOrders: any[] = [
    {
      id: 'ORD-301',
      tableNumber: '3',
      customerName: 'Rahul Sharma',
      customerPhone: '9823456789',
      time: 'Just now',
      timestamp: Date.now() - 120000,
      items: [
        { name: 'Peri-Peri Paneer Sizzler', count: 1, price: 280, isVeg: true, done: true },
        { name: 'Hazelnut Cold Coffee', count: 2, price: 140, isVeg: true, done: false },
        { name: 'Alfredo White Sauce Pasta', count: 1, price: 220, isVeg: true, done: false }
      ],
      totalAmount: 780,
      status: 'cooking',
      notes: 'Less spicy, please serve coffee first!'
    },
    {
      id: 'ORD-302',
      tableNumber: '1',
      customerName: 'Priya & Friends',
      customerPhone: '9022388123',
      time: '3m ago',
      timestamp: Date.now() - 180000,
      items: [
        { name: 'Mysore Masala Dosa', count: 2, price: 110, isVeg: true, done: false },
        { name: 'Filter Coffee', count: 2, price: 40, isVeg: true, done: false }
      ],
      totalAmount: 300,
      status: 'new',
      notes: 'Extra coconut chutney'
    },
    {
      id: 'ORD-303',
      tableNumber: '5',
      customerName: 'Aman Verma',
      customerPhone: '9307294733',
      time: '12m ago',
      timestamp: Date.now() - 720000,
      items: [
        { name: 'Monster Cheese Volcano Burger', count: 1, price: 180, isVeg: true, done: true },
        { name: 'Peri Peri Loaded Fries', count: 1, price: 120, isVeg: true, done: true },
        { name: 'Oreo Nutella Freakshake', count: 1, price: 160, isVeg: true, done: true }
      ],
      totalAmount: 460,
      status: 'ready',
      notes: 'Extra tissue papers & ketchup'
    },
    {
      id: 'ORD-300',
      tableNumber: '2',
      customerName: 'Vikas Gupta',
      customerPhone: '9876543210',
      time: '35m ago',
      timestamp: Date.now() - 2100000,
      items: [
        { name: 'Special Gujarati Unlimited Thali', count: 2, price: 180, isVeg: true, done: true },
        { name: 'Sweet Lassi', count: 2, price: 60, isVeg: true, done: true }
      ],
      totalAmount: 480,
      status: 'completed',
      notes: 'Paid via GPay QR at Table'
    }
  ];

  const [kitchenOrdersList, setKitchenOrdersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`majh_boisar_kitchen_orders_${selectedId}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return defaultKitchenOrders;
  });

  // Live Kitchen Orders Listener & Notification Sound Alert
  useEffect(() => {
    const handleNewFoodOrder = (event?: any) => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`majh_boisar_kitchen_orders_${selectedId}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setKitchenOrdersList(parsed);
          } catch (e) {}
        }
        playKitchenChime();
        if (event?.detail) {
          const ord = event.detail;
          const typeLabel = ord.orderType === 'delivery' ? '🛵 Home Delivery' : `🪑 ${ord.tableNumber ? `Table #${ord.tableNumber}` : 'Table'}`;
          showToast(`🔔 New Food Order Received! ${typeLabel} • ${ord.customerName || 'Customer'} (₹${ord.totalAmount})`, 'success', 6000);
        }
      }
    };

    window.addEventListener('majh_boisar_new_food_order', handleNewFoodOrder);
    window.addEventListener('storage', handleNewFoodOrder);
    return () => {
      window.removeEventListener('majh_boisar_new_food_order', handleNewFoodOrder);
      window.removeEventListener('storage', handleNewFoodOrder);
    };
  }, [selectedId]);

  const saveKitchenOrders = (orders: any[]) => {
    setKitchenOrdersList(orders);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`majh_boisar_kitchen_orders_${selectedId}`, JSON.stringify(orders));
    }
  };

  const playKitchenChime = () => {
    if (!kitchenAudioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'new' | 'cooking' | 'ready' | 'completed') => {
    const updated = kitchenOrdersList.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    saveKitchenOrders(updated);
    if (newStatus === 'cooking') showToast('👨‍🍳 Order sent to Chef — In Kitchen!', 'info');
    else if (newStatus === 'ready') showToast('🍽️ Food is Ready to Serve to Table!', 'success');
    else if (newStatus === 'completed') showToast('🧾 Table Bill Closed & Cleared!', 'success');
  };

  const handleToggleDishDone = (orderId: string, dishIdx: number) => {
    const updated = kitchenOrdersList.map(o => {
      if (o.id === orderId) {
        const newItems = o.items.map((it: any, i: number) => i === dishIdx ? { ...it, done: !it.done } : it);
        return { ...o, items: newItems };
      }
      return o;
    });
    saveKitchenOrders(updated);
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManualOrderTable.trim() || !newManualOrderItems.trim()) {
      alert('Please fill Table number and ordered items.');
      return;
    }

    const parsedItems: any[] = [];
    newManualOrderItems.split(/[,\n]+/).forEach(itemStr => {
      const trimmed = itemStr.trim();
      if (!trimmed) return;
      const parts = trimmed.split(/[-–:]/);
      const name = parts[0]?.trim() || trimmed;
      const price = parts[1]?.trim() ? parseInt(parts[1].replace(/\D/g, ''), 10) || 120 : 120;
      parsedItems.push({ name, count: 1, price, isVeg: true, done: false });
    });

    const calcTotal = parsedItems.reduce((sum, it) => sum + it.price * it.count, 0);

    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      tableNumber: newManualOrderTable.trim(),
      customerName: newManualOrderDiner.trim() || 'Walk-in Diner',
      customerPhone: '',
      time: 'Just now',
      timestamp: Date.now(),
      items: parsedItems,
      totalAmount: parseInt(newManualOrderAmount, 10) || calcTotal || 350,
      status: 'new',
      notes: newManualOrderNotes.trim()
    };

    const updated = [newOrder, ...kitchenOrdersList];
    saveKitchenOrders(updated);
    playKitchenChime();
    setIsManualOrderModalOpen(false);
    setNewManualOrderTable('1');
    setNewManualOrderDiner('');
    setNewManualOrderItems('');
    setNewManualOrderAmount('');
    setNewManualOrderNotes('');
    showToast(`🔔 New Order added for Table #${newOrder.tableNumber}!`, 'success');
  };

  // ── FULL HOTEL PROFILE & PHOTO GALLERY STATE FOR DASHBOARD ──
  const [hotelProfileName, setHotelProfileName] = useState('Freesia by Express Inn');
  const [hotelProfileCategory, setHotelProfileCategory] = useState('Luxury Resort');
  const [hotelProfileArea, setHotelProfileArea] = useState('Ostwal Empire, Boisar West');
  const [hotelProfileAddress, setHotelProfileAddress] = useState('Survey No. 42, Ostwal Empire Main Avenue, Near Reliance Trends, Boisar West');
  const [hotelProfilePhone, setHotelProfilePhone] = useState('7769947217');
  const [hotelProfileWhatsapp, setHotelProfileWhatsapp] = useState('7769947217');
  const [hotelProfileCoupleFriendly, setHotelProfileCoupleFriendly] = useState(true);
  const [hotelProfileLocalId, setHotelProfileLocalId] = useState(true);
  const [hotelProfileNearStation, setHotelProfileNearStation] = useState(true);
  const [hotelProfileNearMidc, setHotelProfileNearMidc] = useState(false);

  // AC Room Rates
  const [acRate3h, setAcRate3h] = useState('699');
  const [acRate6h, setAcRate6h] = useState('1099');
  const [acRate12h, setAcRate12h] = useState('1599');
  const [acRateNight, setAcRateNight] = useState('1899');

  // Non-AC Room Rates
  const [nonAcRate3h, setNonAcRate3h] = useState('499');
  const [nonAcRate6h, setNonAcRate6h] = useState('799');
  const [nonAcRate12h, setNonAcRate12h] = useState('1199');
  const [nonAcRateNight, setNonAcRateNight] = useState('1399');
  
  const [hotelDashboardGallery, setHotelDashboardGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80'
  ]);

  const handleHotelDashboardFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setHotelDashboardGallery(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveDashboardGalleryPhoto = (idx: number) => {
    setHotelDashboardGallery(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveFullHotelListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelProfileName.trim() || !hotelProfilePhone.trim()) {
      alert('Please enter Hotel Name and Reception Phone number.');
      return;
    }

    const simplifiedRooms = [
      {
        id: 'r_ac',
        name: 'AC Room',
        type: 'AC Room',
        bedType: '1 King / Double Bed',
        maxGuests: 2,
        size: '220 sq.ft',
        hourly3h: Number(acRate3h) || 699,
        hourly6h: Number(acRate6h) || 1099,
        hourly12h: Number(acRate12h) || 1599,
        nightRate: Number(acRateNight) || 1899,
        image: hotelDashboardGallery[0] || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
        amenities: ['AC', 'Free Wi-Fi', 'Hot Shower', 'TV', 'Clean Bedding']
      },
      {
        id: 'r_non_ac',
        name: 'Non-AC Room',
        type: 'Non-AC Room',
        bedType: '1 Double Bed',
        maxGuests: 2,
        size: '200 sq.ft',
        hourly3h: Number(nonAcRate3h) || 499,
        hourly6h: Number(nonAcRate6h) || 799,
        hourly12h: Number(nonAcRate12h) || 1199,
        nightRate: Number(nonAcRateNight) || 1399,
        image: hotelDashboardGallery[1] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        amenities: ['Ceiling Fan', 'Free Wi-Fi', 'Hot Shower', 'Clean Towels']
      }
    ];

    setHotelRoomsList(simplifiedRooms);

    const updatedHotelObj: any = {
      id: 'h1',
      slug: 'freesia-by-express-inn',
      name: hotelProfileName,
      tagline: 'Verified Couple & Day-Stay Hotel in Boisar',
      category: hotelProfileCategory,
      badge: `♦ ${hotelProfileCategory.toUpperCase()}`,
      location: hotelProfileArea,
      address: hotelProfileAddress,
      phone: hotelProfilePhone,
      whatsapp: hotelProfileWhatsapp,
      isCoupleFriendly: hotelProfileCoupleFriendly,
      acceptsLocalId: hotelProfileLocalId,
      nearStation: hotelProfileNearStation,
      nearMidc: hotelProfileNearMidc,
      gallery: hotelDashboardGallery,
      rooms: simplifiedRooms,
      hourlyRate3h: Number(acRate3h) || 699,
      hourlyRate6h: Number(acRate6h) || 1099,
      hourlyRate12h: Number(acRate12h) || 1599,
      nightRate: Number(acRateNight) || 1899
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_rooms_freesia-by-express-inn', JSON.stringify(simplifiedRooms));
      localStorage.setItem('majh_boisar_hotel_rooms_h1', JSON.stringify(simplifiedRooms));
      
      const customHotels = JSON.parse(localStorage.getItem('majh_boisar_custom_hotels_v2') || '[]');
      const filtered = customHotels.filter((h: any) => h.id !== 'h1' && h.slug !== 'freesia-by-express-inn');
      localStorage.setItem('majh_boisar_custom_hotels_v2', JSON.stringify([updatedHotelObj, ...filtered]));

      window.dispatchEvent(new Event('storage'));
    }

    alert('🎉 Hotel profile, gallery photos, and AC / Non-AC room rates updated successfully!\nLive changes are now published on the hotel page.');
  };

  // Hotel Owner Bank & UPI Payout State
  const [hotelPayoutUpi, setHotelPayoutUpi] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`majh_hotel_payout_upi_${business?.id || 'default'}`) || '';
  });
  const [hotelPayoutHolder, setHotelPayoutHolder] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`majh_hotel_payout_holder_${business?.id || 'default'}`) || '';
  });
  const [hotelPayoutBank, setHotelPayoutBank] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`majh_hotel_payout_bank_${business?.id || 'default'}`) || '';
  });
  const [hotelPayoutAccNo, setHotelPayoutAccNo] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`majh_hotel_payout_acc_${business?.id || 'default'}`) || '';
  });
  const [hotelPayoutIfsc, setHotelPayoutIfsc] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`majh_hotel_payout_ifsc_${business?.id || 'default'}`) || '';
  });

  const handleSaveHotelPayoutDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const bId = business?.id || 'default';
      localStorage.setItem(`majh_hotel_payout_upi_${bId}`, hotelPayoutUpi);
      localStorage.setItem(`majh_hotel_payout_holder_${bId}`, hotelPayoutHolder);
      localStorage.setItem(`majh_hotel_payout_bank_${bId}`, hotelPayoutBank);
      localStorage.setItem(`majh_hotel_payout_acc_${bId}`, hotelPayoutAccNo);
      localStorage.setItem(`majh_hotel_payout_ifsc_${bId}`, hotelPayoutIfsc);
      
      try {
        const savedHotels = JSON.parse(localStorage.getItem('majh_boisar_admin_hotels') || '[]');
        const updated = savedHotels.map((h: any) => {
          if (h.id === bId || h.slug === (business as any)?.slug || h.name === business?.name) {
            return {
              ...h,
              payoutUpi: hotelPayoutUpi,
              payoutHolder: hotelPayoutHolder,
              payoutBank: hotelPayoutBank,
              payoutAccNo: hotelPayoutAccNo,
              payoutIfsc: hotelPayoutIfsc
            };
          }
          return h;
        });
        localStorage.setItem('majh_boisar_admin_hotels', JSON.stringify(updated));
      } catch (err) {}
    }
    showToast('🏦 Bank & UPI payout details saved! Admin will use these for your payouts.', 'success');
  };

  // Hotel Desk Navigation View & Walk-In state
  const [hotelDeskView, setHotelDeskView] = useState<'register' | 'tariffs' | 'profile' | 'payouts'>('register');
  const [showWalkInForm, setShowWalkInForm] = useState(false);

  // Booking Filters & Editing State
  const [turfBookingFilter, setTurfBookingFilter] = useState<'All' | 'Confirmed' | 'Attended' | 'Cancelled'>('All');
  const [turfSearchQuery, setTurfSearchQuery] = useState('');

  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [editBookingName, setEditBookingName] = useState('');
  const [editBookingPhone, setEditBookingPhone] = useState('');
  const [editBookingSlot, setEditBookingSlot] = useState('');
  const [editBookingStation, setEditBookingStation] = useState('');
  const [editBookingRate, setEditBookingRate] = useState('');
  const [editBookingStatus, setEditBookingStatus] = useState('Confirmed');

  const handleUpdateSlotPrice = (slot: string, newPrice: string) => {
    const key = `${selectedScreen}_${slot}`;
    const updated = { ...slotPrices, [key]: newPrice, [slot]: newPrice };
    setSlotPrices(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_turf_slot_prices', JSON.stringify(updated));
    }
  };

  const handleToggleSlotControl = (slot: string) => {
    const key = `${selectedScreen}_${slot}`;
    const current = slotControls[key] || 'Available';
    const next: 'Available' | 'Closed' = current === 'Available' ? 'Closed' : 'Available';
    const updated: Record<string, 'Available' | 'Closed'> = { ...slotControls, [key]: next };
    setSlotControls(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_turf_slot_controls', JSON.stringify(updated));
    }
  };

  const handleAddManualTurfBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPlayerName.trim()) return;
    const newRecord = {
      id: 'tb-' + Date.now(),
      refCode: 'TURF-' + Math.floor(1000 + Math.random() * 9000),
      venueName: business?.name || 'My Turf Venue',
      category: manualCategory,
      station: manualStation,
      userName: manualPlayerName,
      userPhone: manualPlayerPhone || 'Offline Walk-in',
      bookingDate: manualDate || 'Today',
      timeSlot: manualSlot,
      duration: manualDuration,
      estRate: manualRate || '₹250',
      status: 'Confirmed',
      createdAt: 'Just now'
    };
    const updated = [newRecord, ...turfBookingsList];
    setTurfBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_turf_bookings', JSON.stringify(updated));
    }
    setManualPlayerName('');
    setManualPlayerPhone('');
    alert('✅ Manual Booking Added & Saved Successfully!');
  };

  const handleToggleTurfAttendance = (id: string) => {
    const updated = turfBookingsList.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Confirmed' ? 'Attended / Visited' : 'Confirmed';
        return { ...b, status: nextStatus };
      }
      return b;
    });
    setTurfBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_turf_bookings', JSON.stringify(updated));
    }
  };

  const handleCancelTurfBooking = (id: string) => {
    const updated = turfBookingsList.map(b => {
      if (b.id === id) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    });
    setTurfBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_turf_bookings', JSON.stringify(updated));
    }
    showToast('Booking cancelled & slot released 🚫', 'info');
  };

  const handleDeleteTurfBooking = (id: string) => {
    if (confirm('Delete this booking record permanently?')) {
      const updated = turfBookingsList.filter(b => b.id !== id);
      setTurfBookingsList(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_turf_bookings', JSON.stringify(updated));
      }
    }
  };

  const handleOpenEditBookingModal = (booking: any) => {
    setEditingBooking(booking);
    setEditBookingName(booking.userName || '');
    setEditBookingPhone(booking.userPhone || '');
    setEditBookingSlot(booking.timeSlot || '');
    setEditBookingStation(booking.station || 'PS5 Console #1');
    setEditBookingRate(booking.estRate || '₹250');
    setEditBookingStatus(booking.status || 'Confirmed');
  };

  const handleSaveBookingEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    const updated = turfBookingsList.map(b => {
      if (b.id === editingBooking.id) {
        return {
          ...b,
          userName: editBookingName,
          userPhone: editBookingPhone,
          timeSlot: editBookingSlot,
          station: editBookingStation,
          estRate: editBookingRate,
          status: editBookingStatus
        };
      }
      return b;
    });
    setTurfBookingsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_turf_bookings', JSON.stringify(updated));
    }
    setEditingBooking(null);
    showToast('Booking record updated! ✏️', 'success');
  };

  // Edit lead note state
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);
  const [leadNoteText, setLeadNoteText] = useState('');

  // Review responder replies state (mock reply log)
  const [reviewReplies, setReviewReplies] = useState<Record<number, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Edit Profile settings form states
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editGoogleMaps, setEditGoogleMaps] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editYoutube, setEditYoutube] = useState('');
  const [editWorkingHours, setEditWorkingHours] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editGalleryPhotos, setEditGalleryPhotos] = useState<string[]>([]);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updateProfileError, setUpdateProfileError] = useState('');
  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(false);

  // Edit schedule state for settings tab
  const defaultEditSchedule = () => ({
    Mon: { open: '09:00', close: '21:00', closed: false },
    Tue: { open: '09:00', close: '21:00', closed: false },
    Wed: { open: '09:00', close: '21:00', closed: false },
    Thu: { open: '09:00', close: '21:00', closed: false },
    Fri: { open: '09:00', close: '21:00', closed: false },
    Sat: { open: '09:00', close: '21:00', closed: false },
    Sun: { open: '09:00', close: '21:00', closed: true },
  });
  const [editSchedule, setEditSchedule] = useState<Record<string, { open: string; close: string; closed: boolean }>>(defaultEditSchedule());

  // Subscription, coupon, and expiration states
  const [couponInput, setCouponInput] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState('');
  const [couponErrorMsg, setCouponErrorMsg] = useState('');
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  // Checkout modal states
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'Basic' | 'Pro' | 'OwnerPass' | 'ProAgent' | 'BuilderPass' | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'card' | 'net'>('upi');
  const [upiRefId, setUpiRefId] = useState('');

  // Plan-based limits
  const planLimits = {
    Free: { catalog: 5, photos: 1 },
    Basic: { catalog: 10, photos: 3 },
    Pro: { catalog: 20, photos: 5 },
  } as const;
  type PlanKey = keyof typeof planLimits;
  const currentPlan = (business?.subscription ?? 'Free') as PlanKey;
  const catalogLimit = planLimits[currentPlan]?.catalog ?? 5;
  const canRespondToReviews = currentPlan === 'Pro';
  const canAccessLeadInbox = currentPlan === 'Basic' || currentPlan === 'Pro';

  // Upgrade nudge banner component (inline)
  const UpgradeNudge = ({ feature, requiredPlan }: { feature: string; requiredPlan: string }) => (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
      <span className="text-2xl shrink-0">🔒</span>
      <div className="flex-1">
        <p className="text-xs font-black text-amber-800">{feature} — {requiredPlan} Plan Required</p>
        <p className="text-[10px] text-amber-600 font-semibold mt-1 leading-relaxed">
          This feature is not available on your current <strong>{currentPlan}</strong> plan.
          Upgrade to unlock it.
        </p>
        <button
          onClick={() => setActiveSubTab('subscription')}
          className="mt-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl cursor-pointer hover:shadow-md transition-all"
        >
          View Plans & Upgrade →
        </button>
      </div>
    </div>
  );

  // Add New Business Multi-Step Wizard states
  const [newBizModalOpen, setNewBizModalOpen] = useState(false);

  // Specialist settings states
  const [activeSpecialistSubTab, setActiveSpecialistSubTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [specEditName, setSpecEditName] = useState('');
  const [specEditBio, setSpecEditBio] = useState('');
  const [specEditExperience, setSpecEditExperience] = useState('');
  const [specEditPhone, setSpecEditPhone] = useState('');
  const [specEditInstagram, setSpecEditInstagram] = useState('');
  const [specEditFacebook, setSpecEditFacebook] = useState('');
  const [specEditYoutube, setSpecEditYoutube] = useState('');
  const [specEditAvatar, setSpecEditAvatar] = useState('');
  const [specEditCategory, setSpecEditCategory] = useState('');
  const [specEditPrice, setSpecEditPrice] = useState('');
  const [specEditServices, setSpecEditServices] = useState(''); // comma separated
  const [specEditGallery, setSpecEditGallery] = useState<string[]>([]); // base64 or url images
  const [savingSpecialist, setSavingSpecialist] = useState(false);

  // Global scroll lock for modals
  useEffect(() => {
    if (specialistCheckoutOpen || checkoutModalOpen || newBizModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [specialistCheckoutOpen, checkoutModalOpen, newBizModalOpen]);
  const [wizardStep, setWizardStep] = useState(1);

  // Step 1: Business Details
  const [newBizName, setNewBizName] = useState('');
  const [newBizPincode, setNewBizPincode] = useState('401501');
  const [newBizPlotNo, setNewBizPlotNo] = useState('');
  const [newBizBldgName, setNewBizBldgName] = useState('');
  const [newBizStreet, setNewBizStreet] = useState('');
  const [newBizLandmark, setNewBizLandmark] = useState('');
  const [newBizLocation, setNewBizLocation] = useState('Boisar West');
  const [newBizCity, setNewBizCity] = useState('Palghar');
  const [newBizState, setNewBizState] = useState('Maharashtra');

  // Step 2: Contact Details
  const [newBizContactPerson, setNewBizContactPerson] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizWhatsapp, setNewBizWhatsapp] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');

  // Step 3: Timings, Category, cover
  const [newBizCategory, setNewBizCategory] = useState('Doctors');
  const [newBizCustomCategory, setNewBizCustomCategory] = useState('');
  const [newBizWebsite, setNewBizWebsite] = useState('');
  const [newBizGoogleMaps, setNewBizGoogleMaps] = useState('');
  const [newBizWazeLink, setNewBizWazeLink] = useState('');
  const [newBizGst, setNewBizGst] = useState('');
  const [newBizWorkingHours, setNewBizWorkingHours] = useState('9:00 AM - 9:00 PM');
  const [newBizImage, setNewBizImage] = useState('');
  const [newBizDescription, setNewBizDescription] = useState('');

  // Gallery photos state
  const [newBizGalleryInput, setNewBizGalleryInput] = useState('');
  const [newBizGalleryPhotos, setNewBizGalleryPhotos] = useState<string[]>([]);

  // Step 4: Products & Services
  const [newBizProducts, setNewBizProducts] = useState<{name: string; price: string; desc?: string; image?: string}[]>([]);
  const [newBizServices, setNewBizServices] = useState<{name: string; price: string; duration?: string; desc?: string; image?: string}[]>([]);
  const [newBizProdInput, setNewBizProdInput] = useState({name: '', price: '', desc: '', image: ''});
  const [newBizSvcInput, setNewBizSvcInput] = useState({name: '', price: '', duration: '', desc: ''});

  // Auto-Detect GPS Location state & handler
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [newBizLat, setNewBizLat] = useState<number | null>(null);
  const [newBizLng, setNewBizLng] = useState<number | null>(null);

  // Image Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState('');
  const [cropperTarget, setCropperTarget] = useState<'newBiz' | 'editBiz'>('newBiz');
  const [cropZoom, setCropZoom] = useState(1);
  const [cropRotate, setCropRotate] = useState(0);
  const [cropAspect, setCropAspect] = useState<'16:9' | '4:3' | '1:1'>('16:9');

  const openCropperFor = (base64: string, target: 'newBiz' | 'editBiz') => {
    setCropperSrc(base64);
    setCropperTarget(target);
    setCropZoom(1);
    setCropRotate(0);
    setCropAspect('16:9');
    setCropperOpen(true);
  };

  const handleApplyCrop = () => {
    if (!cropperSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = cropperSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const targetW = 800;
      const targetH = cropAspect === '16:9' ? 450 : cropAspect === '4:3' ? 600 : 800;
      canvas.width = targetW;
      canvas.height = targetH;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      ctx.save();
      ctx.translate(targetW / 2, targetH / 2);
      ctx.rotate((cropRotate * Math.PI) / 180);
      ctx.scale(cropZoom, cropZoom);

      const aspectImg = img.width / img.height;
      let drawW = targetW;
      let drawH = targetW / aspectImg;
      if (drawH < targetH) {
        drawH = targetH;
        drawW = targetH * aspectImg;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.92);
      if (cropperTarget === 'newBiz') {
        setNewBizImage(croppedBase64);
        showToast('Cover photo cropped & updated! ✂️', 'success');
      } else {
        setEditImage(croppedBase64);
        showToast('Cover photo cropped & updated! ✂️', 'success');
      }
      setCropperOpen(false);
    };
  };

  const handleAutoDetectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert("Geolocation GPS is not supported on your device/browser.");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setNewBizLat(latitude);
        setNewBizLng(longitude);
        const gmapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setNewBizGoogleMaps(gmapsUrl);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const streetName = addr.road || addr.suburb || addr.neighbourhood || addr.village || addr.residential || "";
            const postcode = addr.postcode || "401501";

            if (streetName) setNewBizStreet(streetName);
            if (postcode && postcode.length === 6) setNewBizPincode(postcode);

            const fullStr = JSON.stringify(data).toLowerCase();
            if (fullStr.includes("tarapur")) setNewBizLocation("Tarapur MIDC");
            else if (fullStr.includes("ostwal")) setNewBizLocation("Ostwal Empire");
            else if (fullStr.includes("west") || fullStr.includes("paschim")) setNewBizLocation("Boisar West");
            else if (fullStr.includes("east") || fullStr.includes("purva")) setNewBizLocation("Boisar East");
            else if (fullStr.includes("salwad")) setNewBizLocation("Salwad");
            else if (fullStr.includes("navapur")) setNewBizLocation("Navapur Beach");

            alert(`🎉 Location auto-detected!\nAddress: ${streetName ? streetName + ', ' : ''}Boisar\nGoogle Maps link generated!`);
          } else {
            alert(`🎉 GPS Coordinates fetched! Google Maps link added.`);
          }
        } catch (e) {
          alert(`🎉 GPS Coordinates fetched & Google Maps link auto-generated!`);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        alert("GPS Location request denied or unavailable. Please fill address manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Working hours schedule state (day → { open, close, closed })
  const defaultSchedule = () => ({
    Mon: { open: '09:00', close: '21:00', closed: false },
    Tue: { open: '09:00', close: '21:00', closed: false },
    Wed: { open: '09:00', close: '21:00', closed: false },
    Thu: { open: '09:00', close: '21:00', closed: false },
    Fri: { open: '09:00', close: '21:00', closed: false },
    Sat: { open: '09:00', close: '21:00', closed: false },
    Sun: { open: '09:00', close: '21:00', closed: true },
  });
  const [newBizSchedule, setNewBizSchedule] = useState<Record<string, { open: string; close: string; closed: boolean }>>(defaultSchedule());

  const formatScheduleToString = (schedule: typeof newBizSchedule) => {
    const days = Object.entries(schedule);
    const openDays = days.filter(([, v]) => !v.closed);
    const closedDays = days.filter(([, v]) => v.closed).map(([d]) => d);
    if (openDays.length === 0) return 'Closed';
    // Group consecutive days with same timing
    let parts: string[] = [];
    openDays.forEach(([day, v]) => {
      const timeStr = `${v.open.replace(':', '.')} - ${v.close.replace(':', '.')}`;
      parts.push(`${day}: ${timeStr}`);
    });
    const base = parts.join(', ');
    return closedDays.length > 0 ? `${base} | Closed: ${closedDays.join(', ')}` : base;
  };

  const [creatingBiz, setCreatingBiz] = useState(false);
  const [createBizError, setCreateBizError] = useState('');

  const categoriesList = [
    'Wholesalers & Bulk Distributors', 'Retailers & Local Shops', 'Snacks & Farsan Shops', 'Doctors', 'CA, GST & Business Consultancy', 'Plumbers', 'Electricians', 'Coaching Classes', 'Grocery Shops',
    'Mobile Repair', 'Hardware & Paints', 'PG/Hostels', 'Hospitals', 'Dentists',
    'Contractors', 'Real Estate', 'Packers & Movers', 'Courier Service', 'Beauty Spa',
    'Hotels', 'Loans', 'Event Organisers', 'Pet Shops', 'Restaurants', 'Gym', 'Turfs & Game Zone',
    'Bike Service', 'AC Service', 'Wedding Planning', 'Diagnostic Labs', 'Medical Stores',
    'Auto Spares', 'Car Rentals', 'Dry Cleaners', 'Tailors', 'Jewelry Shops',
    'Sweet Marts', 'Cyber Cafe & Xerox', 'Feed & Seed', 'Solar Energy', 'Battery Dealers',
    'Water Purifier', 'Gas Agency', 'Tent Decorators', 'Photo Studios', 'Stationers & Books',
    'Opticians', 'Furniture Dealers', 'Garment Showrooms', 'Electronic Goods',
    'Footwear Stores', 'Supermarkets', 'Steel Fabricators', 'Borewell Drillers',
    'Veterinary Clinics', 'Driving Schools', 'Gift Shops', 'Other'
  ];

  const locationsList = ['Boisar West', 'Boisar East', 'Tarapur MIDC', 'Ostwal Empire'];

  // Load review replies from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedReplies = localStorage.getItem(`majh_boisar_replies_${selectedId}`);
      if (savedReplies) {
        setReviewReplies(JSON.parse(savedReplies));
      } else {
        setReviewReplies({});
      }
    }
  }, [selectedId]);

  // Bind settings form fields when business is loaded
  useEffect(() => {
    if (business) {
      setEditName(business.name);
      setEditCategory(business.category);
      setEditDescription(business.description);
      setEditAddress(business.address);
      setEditLocation(business.location);
      setEditPhone(business.phone);
      setEditWhatsapp(business.whatsapp);
      setEditEmail(business.email || '');
      setEditWebsite(business.website || '');
      setEditGoogleMaps((business as any).googleMaps || '');
      setEditInstagram(business.instagram || '');
      setEditFacebook(business.facebook || '');
      setEditYoutube(business.youtube || '');
      setEditWorkingHours(business.workingHours);
      setEditImage(business.image || '');
      setEditGalleryPhotos((business as any).gallery || []);
      setUpdateProfileSuccess(false);
      setUpdateProfileError('');
      // Reset edit schedule to defaults when switching business
      setEditSchedule(defaultEditSchedule());
    }
  }, [business]);

  const handlePostReply = (reviewId: number) => {
    if (!replyText.trim()) return;
    const updated = { ...reviewReplies, [reviewId]: replyText };
    setReviewReplies(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`majh_boisar_replies_${selectedId}`, JSON.stringify(updated));
    }
    setReplyText('');
    setActiveReplyId(null);
    alert('Response published. This reply will now render on your listing page review wall!');
  };

  // Cover image defaults to empty unless uploaded by user
  useEffect(() => {
    // Keep user's chosen image, do not auto-fill default images
  }, [newBizCategory]);

  // Fetch list of businesses to select from
  const fetchBusinessesList = async () => {
    if (!isLoggedIn && !isAdminAuth) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/businesses?showAll=true');
      const data = await res.json();
      if (!Array.isArray(data)) {
        setLoading(false);
        return;
      }

      const isAdmin = isAdminAuth;

      if (isAdmin) {
        const hotelItems = getAllHotels().map((h, i) => ({
          id: 99000 + i,
          name: `🏨 ${h.name}`,
          category: 'Hotels',
          hotelRefId: h.id,
          hotelSlug: h.slug
        }));

        const combined = [
          ...hotelItems,
          ...data.map((b: any) => ({ id: b.id, name: b.name, category: b.category }))
        ];

        setBusinessesList(combined);

        if (bizIdParam) {
          const targetId = Number(bizIdParam);
          const matchBiz = combined.find((b: any) => b.id === targetId);
          if (matchBiz) {
            setSelectedId(matchBiz.id);
            return;
          }
        }

        if (hotelIdParam || hotelNameParam) {
          const matchHotel = combined.find((b: any) => 
            (b.hotelRefId && (b.hotelRefId === hotelIdParam || b.hotelSlug === hotelIdParam)) ||
            (hotelNameParam && b.name.toLowerCase().includes(hotelNameParam.toLowerCase()))
          );
          if (matchHotel) {
            setSelectedId(matchHotel.id);
            return;
          }
        }

        if (combined.length > 0) {
          const targetId = (selectedId && combined.some((b: any) => b.id === selectedId)) ? selectedId : combined[0].id;
          setSelectedId(targetId);
        }
      } else {
        const userPhoneDigits = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '';
        let savedIds: number[] = [];
        if (typeof window !== 'undefined' && userPhoneDigits) {
          try {
            const key = `majh_boisar_my_biz_ids_${userPhoneDigits}`;
            const raw = localStorage.getItem(key);
            if (raw) savedIds = JSON.parse(raw);
          } catch (e) { }
        }

        const myBizList = data.filter((b: any) => {
          if (savedIds.includes(b.id)) return true;
          if (!userPhoneDigits) return false;
          const bizPhoneDigits = b.phone ? b.phone.replace(/\D/g, '') : '';
          const bizWhatsappDigits = b.whatsapp ? b.whatsapp.replace(/\D/g, '') : '';
          const bizCreatedByDigits = b.createdBy ? b.createdBy.replace(/\D/g, '') : '';
          return (
            (bizPhoneDigits && bizPhoneDigits === userPhoneDigits) ||
            (bizWhatsappDigits && bizWhatsappDigits === userPhoneDigits) ||
            (bizCreatedByDigits && bizCreatedByDigits === userPhoneDigits) ||
            (b.createdBy && b.createdBy.replace(/\D/g, '') === userPhoneDigits)
          );
        });

        if (myBizList.length > 0) {
          setBusinessesList(myBizList.map((b: any) => ({ id: b.id, name: b.name, category: b.category })));
          setHasRegisteredBusiness(true);
          if (currentRole === 'User') {
            setRole('BusinessOwner');
          }

          if (bizIdParam) {
            const targetId = Number(bizIdParam);
            const foundParamBiz = myBizList.find((b: any) => b.id === targetId);
            if (foundParamBiz) {
              setSelectedId(foundParamBiz.id);
            } else {
              showToast('🔒 Access Restricted: You can only view and manage your own registered business listings.', 'error');
              setSelectedId(myBizList[0].id);
            }
          } else {
            const latestId = savedIds.length > 0 ? savedIds[savedIds.length - 1] : myBizList[myBizList.length - 1].id;
            const isValidCurrent = selectedId && myBizList.some((b: any) => b.id === selectedId);
            const targetId = isValidCurrent ? selectedId : (myBizList.some((b: any) => b.id === latestId) ? latestId : myBizList[0].id);
            setSelectedId(targetId);
          }
        } else {
          if (bizIdParam) {
            showToast('🔒 Access Restricted: Only the verified owner or Super Admin can access this business dashboard.', 'error');
          }
          setBusinessesList([]);
          setSelectedId(0);
          setBusiness(null);
          setHasRegisteredBusiness(false);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessData = async () => {
    if (!selectedId || selectedId === 0) {
      setBusiness(null);
      setLoading(false);
      return;
    }

    // Security Gate: If not admin, ensure selectedId belongs to the user's authorized businesses
    if (!isAdminAuth && businessesList.length > 0 && !businessesList.some(b => b.id === selectedId)) {
      setBusiness(null);
      setLoading(false);
      showToast('🔒 Access Denied: You do not have permission to view or edit this business dashboard.', 'error');
      return;
    }

    // Direct Hotel profile loader (for Admin hotel switcher or direct link from admin panel)
    if (selectedId >= 99000 || (hotelIdParam && String(selectedId).startsWith('99')) || businessesList.find(b => b.id === selectedId)?.category === 'Hotels') {
      const allHotels = getAllHotels();
      const currentBizItem = businessesList.find(b => b.id === selectedId);
      const match = allHotels.find((h, i) => 
        (99000 + i === selectedId) ||
        (hotelIdParam && (h.id === hotelIdParam || h.slug === hotelIdParam)) ||
        (hotelNameParam && h.name.toLowerCase() === hotelNameParam.toLowerCase()) ||
        (currentBizItem && currentBizItem.name.replace('🏨 ', '').trim() === h.name.trim())
      ) || allHotels[0];

      if (match) {
        setBusiness({
          id: selectedId,
          name: match.name,
          category: 'Hotels',
          description: match.tagline || 'Verified Hotel Partner in Boisar',
          address: match.address || `${match.location}, Boisar`,
          phone: match.phone,
          whatsapp: match.whatsapp || match.phone,
          website: null,
          email: null,
          workingHours: '24 Hours Open',
          image: (match.gallery && match.gallery.length > 0 && match.gallery[0]) ? match.gallery[0] : ((match as any).image || '/majh-boisar-mb-logo.png'),
          location: match.location || 'Boisar',
          views: 650,
          phoneClicks: 120,
          whatsappClicks: 85,
          directionClicks: 45,
          websiteClicks: 18,
          subscription: 'Admin Verified',
          premium: true,
          verified: true,
          rating: match.rating || 4.8,
          reviewCount: match.reviewsCount || 15,
          products: [],
          services: [],
          reviews: (match.reviews || []).map((r, i) => ({ id: i + 1, userName: r.userName, rating: r.rating, comment: r.comment, createdAt: r.date })),
          leads: []
        });

        // Set hotel desk states
        setHotelProfileName(match.name);
        setHotelProfilePhone(match.phone);
        setHotelProfileWhatsapp(match.whatsapp || match.phone);
        setHotelProfileAddress(match.address || `${match.location}, Boisar`);
        setHotelProfileArea(match.location || 'Boisar West');
        setHotelProfileCategory(match.category || 'Executive Hotel');
        if (match.gallery && match.gallery.length > 0) {
          setHotelDashboardGallery(match.gallery);
        }
        if (match.rooms && match.rooms.length > 0) {
          setAcRate3h(String(match.rooms[0].hourly3h || 699));
          setAcRate6h(String(match.rooms[0].hourly6h || 1099));
          setAcRate12h(String(match.rooms[0].hourly12h || 1599));
          setAcRateNight(String(match.rooms[0].nightRate || 1899));
        }

        setActiveSubTab('hotel_bookings');
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/businesses/${selectedId}`);
      if (!res.ok) {
        if (isAdminAuth) {
          const allH = getAllHotels();
          if (allH.length > 0) {
            setSelectedId(99000);
            return;
          }
        }
        setBusiness(null);
        setLoading(false);
        return;
      }
      const data = await res.json();

      // Expiry & Notification logic
      if (typeof window !== 'undefined') {
        const storedExpiry = localStorage.getItem(`majh_boisar_expiry_${selectedId}`);
        if (data.subscription !== 'Free') {
          let expiryDate: Date;
          if (!storedExpiry) {
            // Mock expiration to 25 days from now if not exists
            const date = new Date();
            date.setDate(date.getDate() + 25);
            localStorage.setItem(`majh_boisar_expiry_${selectedId}`, date.toISOString());
            expiryDate = date;
          } else {
            expiryDate = new Date(storedExpiry);
          }

          setSubscriptionExpiresAt(expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));

          const now = new Date();
          if (now > expiryDate) {
            // EXPIRED: downgrade in database to Free plan and clear expiry
            alert(`⚠️ PLAN EXPIRED!\nYour subscription for "${data.name}" has expired.\nTrusted Badge removed and premium features disabled.`);
            localStorage.removeItem(`majh_boisar_expiry_${selectedId}`);
            setSubscriptionExpiresAt(null);
            setDaysRemaining(null);

            await fetch(`/api/businesses/${selectedId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscription: 'Free', premium: false })
            });

            // Re-fetch clean Free profile data
            const freshRes = await fetch(`/api/businesses/${selectedId}`);
            const freshData = await freshRes.json();
            setBusiness(freshData);
            return;
          } else {
            // Calculate remaining days
            const diffTime = expiryDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays);
          }
        } else {
          setSubscriptionExpiresAt(null);
          setDaysRemaining(null);
          if (storedExpiry) {
            localStorage.removeItem(`majh_boisar_expiry_${selectedId}`);
          }
        }
      }

      setBusiness(data);
    } catch (e) {
      console.error('Error fetching dashboard business data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn || isAdminAuth) {
      fetchBusinessesList();
    }
  }, [isLoggedIn, currentRole, isAdminAuth, bizIdParam]);

  useEffect(() => {
    if ((isLoggedIn || isAdminAuth) && selectedId) {
      fetchBusinessData();
    }
  }, [selectedId, isLoggedIn, isAdminAuth]);

  // Edit profile settings details submission
  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editDescription.trim() || !editAddress.trim() || !editPhone.trim() || !editWhatsapp.trim()) {
      setUpdateProfileError('Please fill in all required shop fields.');
      return;
    }

    setUpdatingProfile(true);
    setUpdateProfileError('');
    setUpdateProfileSuccess(false);
    try {
      // Build workingHours string from schedule
      const days = Object.entries(editSchedule);
      const openDays = days.filter(([, v]) => !v.closed);
      const closedDays = days.filter(([, v]) => v.closed).map(([d]) => d);
      const scheduleParts = openDays.map(([day, v]) => `${day}: ${v.open} - ${v.close}`);
      const finalHours = scheduleParts.length > 0
        ? scheduleParts.join(', ') + (closedDays.length > 0 ? ` | Closed: ${closedDays.join(', ')}` : '')
        : editWorkingHours;

      const res = await fetch(`/api/businesses/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: toTitleCase(editName),
          category: editCategory,
          description: editDescription,
          address: editAddress,
          location: editLocation,
          phone: editPhone,
          whatsapp: editWhatsapp,
          email: editEmail || null,
          website: editWebsite || null,
          googleMaps: editGoogleMaps || null,
          instagram: editInstagram || null,
          facebook: editFacebook || null,
          youtube: editYoutube || null,
          workingHours: finalHours,
          image: editImage,
          gallery: editGalleryPhotos
        })
      });

      if (!res.ok) throw new Error('Failed to save profile changes.');

      setUpdateProfileSuccess(true);
      await fetchBusinessData();
      alert('Success! Your business profile has been updated.');
    } catch (err: any) {
      setUpdateProfileError(err.message || 'Error occurred while saving settings.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Lead status updates
  const handleUpdateLeadStatus = async (leadId: number, status: 'Won' | 'Lost' | 'Pending' | 'Completed') => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchBusinessData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveLeadNote = async (leadId: number) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: leadNoteText })
      });
      if (res.ok) {
        setEditingLeadId(null);
        fetchBusinessData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add items catalog
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice.trim()) return;

    setAddingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedId,
          name: prodName,
          price: parseFloat(prodPrice),
          description: prodDesc || undefined
        })
      });
      if (res.ok) {
        setProdName('');
        setProdPrice('');
        setProdDesc('');
        fetchBusinessData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) return;

    setAddingService(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedId,
          name: srvName,
          price: srvPrice ? parseFloat(srvPrice) : undefined,
          duration: srvDuration || undefined
        })
      });
      if (res.ok) {
        setSrvName('');
        setSrvPrice('');
        setSrvDuration('');
        fetchBusinessData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteProduct = async (prodId: number) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      const res = await fetch(`/api/products?id=${prodId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchBusinessData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteService = async (srvId: number) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    try {
      const res = await fetch(`/api/services?id=${srvId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchBusinessData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpgradeSubscription = async (tier: 'Free' | 'Basic' | 'Pro') => {
    try {
      const isPro = tier === 'Pro';
      const isBasic = tier === 'Basic';
      const isPremium = isBasic || isPro;

      const res = await fetch(`/api/businesses/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: tier,
          premium: isPremium,
          verified: true
        })
      });
      if (res.ok) {
        if (tier !== 'Free') {
          // Set expiry 30 days from now
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          localStorage.setItem(`majh_boisar_expiry_${selectedId}`, expiryDate.toISOString());
          setSubscriptionExpiresAt(expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
          setDaysRemaining(30);
        } else {
          localStorage.removeItem(`majh_boisar_expiry_${selectedId}`);
          setSubscriptionExpiresAt(null);
          setDaysRemaining(null);
        }
        alert(`🎉 Subscription Activated! Updated your plan to: ${tier} Plan (${tier === 'Pro' ? 'Pro Trusted Badge + 10 Photos + 20 Catalog Items + Review Replies' : tier === 'Basic' ? 'Basic Plan + 5 Photos + 10 Catalog Items' : 'Free Plan'})`);
        fetchBusinessData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Wizard Step Validators
  const validateStep1 = () => {
    if (!newBizName.trim()) {
      setCreateBizError('Please enter the Business Name.');
      return false;
    }
    if (newBizCategory === 'Other' && !newBizCustomCategory.trim()) {
      setCreateBizError('Please specify your custom category name (e.g. Cake Shop, Xerox, Electrician).');
      return false;
    }
    if (!newBizPlotNo.trim() && !newBizBldgName.trim() && !newBizStreet.trim()) {
      setCreateBizError('Please provide address details (Plot No / Building / Street).');
      return false;
    }
    setCreateBizError('');
    return true;
  };

  const validateStep2 = () => {
    if (!newBizContactPerson.trim()) {
      setCreateBizError('Please enter a Contact Person.');
      return false;
    }
    if (newBizPhone.trim().length !== 10 || isNaN(Number(newBizPhone))) {
      setCreateBizError('Please enter a valid 10-digit Phone Number.');
      return false;
    }
    if (newBizWhatsapp.trim().length !== 10 || isNaN(Number(newBizWhatsapp))) {
      setCreateBizError('Please enter a valid 10-digit WhatsApp Number.');
      return false;
    }
    setCreateBizError('');
    return true;
  };

  // Final submit handler for business creation
  const handleCreateBusinessFinal = async () => {
    if (newBizCategory === 'Other' && !newBizCustomCategory.trim()) {
      setCreateBizError('Please specify your custom category name.');
      return;
    }

    if (!newBizDescription.trim()) {
      setCreateBizError('Please enter a description about your listing.');
      return;
    }

    // Construct address block from structured inputs
    const addressBlock = `${newBizPlotNo ? newBizPlotNo + ', ' : ''}${newBizBldgName ? newBizBldgName + ', ' : ''}${newBizStreet ? newBizStreet + ', ' : ''}${newBizLandmark ? 'Near ' + newBizLandmark + ', ' : ''}${newBizLocation}, ${newBizCity} - ${newBizPincode}`;

    // Build workingHours from schedule
    const finalWorkingHours = formatScheduleToString(newBizSchedule) || newBizWorkingHours;

    // Use cover image first; fallback to first gallery photo if no dedicated cover set
    const finalImage = newBizImage || newBizGalleryPhotos[0] || '';

    setCreatingBiz(true);
    setCreateBizError('');
    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: toTitleCase(newBizName),
          category: newBizCategory === 'Other' ? toTitleCase(newBizCustomCategory.trim()) : newBizCategory,
          description: newBizDescription,
          address: addressBlock,
          location: newBizLocation,
          phone: newBizPhone,
          whatsapp: newBizWhatsapp,
          email: newBizEmail || undefined,
          website: newBizWebsite || undefined,
          wazeLink: newBizWazeLink || undefined,
          gst: newBizGst || undefined,
          workingHours: finalWorkingHours,
          image: finalImage,
          latitude: newBizLat || undefined,
          longitude: newBizLng || undefined,
          // Save the login phone of the user so we can reliably find their businesses later
          ownerPhone: loggedInUser?.phone || undefined
        })
      });

      if (!res.ok) {
        let errMessage = 'Failed to create business listing. Please try again.';
        try {
          const errObj = await res.json();
          errMessage = errObj.error || errMessage;
        } catch {
          try {
            const text = await res.text();
            if (text.includes('Request Entity') || text.includes('Too Large') || res.status === 413) {
              errMessage = 'Uploaded photos are too large. Please select smaller photos or remove extra images.';
            } else if (text) {
              errMessage = text;
            }
          } catch {
            // fallback
          }
        }
        throw new Error(errMessage);
      }

      const createdObj = await res.json();

      // Save any added services
      if (newBizServices.length > 0) {
        for (const s of newBizServices) {
          try {
            await fetch('/api/services', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: createdObj.id,
                name: s.name,
                price: s.price ? parseFloat(s.price) : undefined,
                duration: s.duration || undefined,
                description: s.desc || undefined
              })
            });
          } catch (e) {
            console.error('Failed to create service:', e);
          }
        }
      }

      // Save any added products
      if (newBizProducts.length > 0) {
        for (const p of newBizProducts) {
          try {
            await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: createdObj.id,
                name: p.name,
                price: p.price ? parseFloat(p.price) : 0,
                description: p.desc || undefined,
                image: (p as any).image || undefined
              })
            });
          } catch (e) {
            console.error('Failed to create product:', e);
          }
        }
      }

      showToast(`🎉 Success! "${createdObj.name}" has been registered with catalog & added to Boisar Directory!`, 'success', 5000);

      // Save ID to localStorage for instant lookup across browser reloads
      if (typeof window !== 'undefined') {
        try {
          const userP = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '';
          const key = userP ? `majh_boisar_my_biz_ids_${userP}` : 'majh_boisar_my_biz_ids';
          const raw = localStorage.getItem(key);
          const existing = raw ? JSON.parse(raw) : [];
          if (!existing.includes(createdObj.id)) {
            localStorage.setItem(key, JSON.stringify([...existing, createdObj.id]));
          }
        } catch (e) { }
      }

      // Mark user as having a registered business & select it immediately
      setSelectedId(createdObj.id);
      setBusiness(createdObj);
      setHasRegisteredBusiness(true);
      setRole('BusinessOwner');
      fetchBusinessesList();

      // Reset Modal Form states & close
      setNewBizName('');
      setNewBizPlotNo('');
      setNewBizBldgName('');
      setNewBizStreet('');
      setNewBizLandmark('');
      setNewBizContactPerson('');
      setNewBizPhone('');
      setNewBizWhatsapp('');
      setNewBizEmail('');
      setNewBizWebsite('');
      setNewBizWazeLink('');
      setNewBizGst('');
      setNewBizWorkingHours('9:00 AM - 9:00 PM');
      setNewBizDescription('');
      setNewBizCustomCategory('');
      setNewBizGalleryPhotos([]);
      setNewBizGalleryInput('');
      setNewBizProducts([]);
      setNewBizServices([]);
      setNewBizProdInput({name: '', price: '', desc: '', image: ''});
      setNewBizSvcInput({name: '', price: '', duration: '', desc: ''});
      setNewBizSchedule(defaultSchedule());
      setWizardStep(1);
      setNewBizModalOpen(false);

      // Fetch the user's businesses and switch to their new listing
      await fetchBusinessesList();
      setSelectedId(createdObj.id);

      // Auto-open Official Printable QR Standee for the business owner!
      setIsStandeeModalOpen(true);
    } catch (err: any) {
      setCreateBizError(err.message || 'Error occurred while creating business listing.');
    } finally {
      setCreatingBiz(false);
    }
  };

  // 1. Render unauthorized view if not logged in and not admin
  if (!isLoggedIn && !isAdminAuth) {
    return (
      <div className="flex-1 bg-[#f8fafc] flex flex-col items-center justify-center py-20 px-4 text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 text-left">
          <div className="h-12 w-12 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-xl mx-auto shadow-inner text-teal-650">
            🔒
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-extrabold text-sm text-slate-805 uppercase tracking-wider">Merchant Dashboard Login</h2>
            <p className="text-xs text-slate-550 leading-relaxed font-sans font-medium">
              To add your business listings, verify your metrics, or manage leads, please sign in to your merchant account first.
            </p>
          </div>
          <button
            onClick={() => setLoginModalOpen(true)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all cursor-pointer text-center"
          >
            Sign In / Register Now
          </button>
        </div>
      </div>
    );
  }

  // 2. If logged in but has NO registered business, show the inline Business Registration Wizard
  //    This is triggered when user clicks "Register Your Business" in the navbar.
  if (isLoggedIn && !hasRegisteredBusiness && currentRole !== 'Admin' && !isAdminAuth && !specialProfile) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 text-slate-800">
        <div className="max-w-xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-wider flex items-center justify-center gap-2">
              <Building className="w-5 h-5 text-teal-600 animate-pulse" />
              <span>Register Boisar Business</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold font-sans">Register your business listing free today to access your dashboard metrics</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">

            {/* Step Progress Meter */}
            <div className="bg-slate-55 border border-slate-200 p-3.5 rounded-xl select-none">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-405 uppercase tracking-wide mb-2">
                <span>
                  {wizardStep === 1 && "Step 1 of 4: Business Details"}
                  {wizardStep === 2 && "Step 2 of 4: Contact Info"}
                  {wizardStep === 3 && "Step 3 of 4: Photos & Timings"}
                  {wizardStep === 4 && "Step 4 of 4: Products & Services"}
                </span>
                <span className="text-teal-650">{Math.round((wizardStep / 4) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-teal-605 rounded-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Error Message */}
            {createBizError && (
              <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-650 flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>{createBizError}</span>
              </div>
            )}

            {/* Form Steps */}
            {/* STEP 1: Business Details */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">Enter Business Details</h4>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={isDetectingLocation}
                    className="bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>{isDetectingLocation ? 'Locating Shop...' : newBizLat ? '📍 Shop Location Pinned ✓' : '📍 Detect Exact Shop GPS'}</span>
                  </button>
                </div>


                <div>
                  <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    placeholder="e.g. Nevada Family Restaurant"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newBizPincode}
                      onChange={(e) => setNewBizPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="401501"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Area Location *</label>
                    <select
                      value={newBizLocation}
                      onChange={(e) => setNewBizLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 cursor-pointer font-bold"
                    >
                      {locationsList.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Shop / Plot No / Wing *</label>
                    <input
                      type="text"
                      required
                      value={newBizPlotNo}
                      onChange={(e) => setNewBizPlotNo(e.target.value)}
                      placeholder="e.g. Shop No. 12"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Building / Colony Name</label>
                    <input
                      type="text"
                      value={newBizBldgName}
                      onChange={(e) => setNewBizBldgName(e.target.value)}
                      placeholder="e.g. Ostwal Empire Mall"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Street / Road Name *</label>
                    <input
                      type="text"
                      required
                      value={newBizStreet}
                      onChange={(e) => setNewBizStreet(e.target.value)}
                      placeholder="e.g. TAPS Road"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Landmark</label>
                    <input
                      type="text"
                      value={newBizLandmark}
                      onChange={(e) => setNewBizLandmark(e.target.value)}
                      placeholder="e.g. Opposite D-Mart"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">
                    GST Number
                    <span className="text-[9px] font-semibold text-slate-400 normal-case tracking-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={newBizGst}
                    onChange={(e) => setNewBizGst(e.target.value.toUpperCase())}
                    placeholder="e.g. 27AABCU9603R1ZM"
                    maxLength={15}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold tracking-wide"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Contact Details */}
            {wizardStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Enter Contact Details</h4>

                <div>
                  <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    value={newBizContactPerson}
                    onChange={(e) => setNewBizContactPerson(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Mobile Number *</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-xs text-slate-405 font-semibold pr-2 border-r border-slate-200">+91</div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={newBizPhone}
                        onChange={(e) => setNewBizPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit number"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-14 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 text-xs text-slate-450 font-semibold pr-2 border-r border-slate-205">+91</div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={newBizWhatsapp}
                        onChange={(e) => setNewBizWhatsapp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Same or other number"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-14 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewBizWhatsapp(newBizPhone)}
                      className="text-[10px] font-black text-teal-600 mt-1.5 hover:underline block"
                    >
                      Copy Phone Number
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={newBizEmail}
                    onChange={(e) => setNewBizEmail(e.target.value)}
                    placeholder="e.g. business@gmail.com"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-medium"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Timing, Category, Photos */}
            {wizardStep === 3 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Category, Timings &amp; Photos</h4>

                {/* Category + Description */}
                <div>
                  <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Listing Category *</label>
                  <select
                    value={newBizCategory}
                    onChange={(e) => setNewBizCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 cursor-pointer font-bold"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {newBizCategory === 'Other' && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Specify Custom Category Name *</label>
                    <input
                      type="text"
                      required
                      value={newBizCustomCategory}
                      onChange={(e) => setNewBizCustomCategory(e.target.value)}
                      placeholder="e.g. Laundry, Cafe, etc."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">About Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={newBizDescription}
                    onChange={(e) => setNewBizDescription(e.target.value)}
                    placeholder="e.g. Best local beauty parlour offering cuts, bridal makeup, and organic spa treatments..."
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                  />
                </div>

                {/* Website, Google Maps & Waze */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Website URL (Optional)</label>
                    <input
                      type="text"
                      value={newBizWebsite}
                      onChange={(e) => setNewBizWebsite(e.target.value)}
                      placeholder="e.g. https://mybusiness.in"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider">Google Maps Link</label>
                        <button
                          type="button"
                          onClick={handleAutoDetectLocation}
                          className="text-[9px] font-black text-teal-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          📍 Auto-Fetch
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newBizGoogleMaps}
                        onChange={(e) => setNewBizGoogleMaps(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Waze Link (Optional)</label>
                      <input
                        type="text"
                        value={newBizWazeLink}
                        onChange={(e) => setNewBizWazeLink(e.target.value)}
                        placeholder="https://waze.com/ul/..."
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* ── WORKING HOURS BUILDER ── */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-2">
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-2">🕐 Working Hours (per day)</label>
                  {Object.entries(newBizSchedule).map(([day, slot]) => (
                    <div key={day} className="flex items-center gap-1.5 w-full min-w-0">
                      <span className="text-[10px] font-black text-slate-600 w-7 shrink-0">{day}</span>
                      {slot.closed ? (
                        <span className="flex-1 text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1.5">Closed</span>
                      ) : (
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <input
                            type="time"
                            value={slot.open}
                            onChange={(e) => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
                            className="w-full min-w-0 bg-white border border-slate-200 rounded-lg px-1 sm:px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          <span className="text-[9px] text-slate-400 font-bold shrink-0">to</span>
                          <input
                            type="time"
                            value={slot.close}
                            onChange={(e) => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
                            className="w-full min-w-0 bg-white border border-slate-200 rounded-lg px-1 sm:px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], closed: !prev[day].closed } }))}
                        className={`text-[9px] font-black px-2 py-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ml-auto ${slot.closed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                          }`}
                      >
                        {slot.closed ? 'Open' : 'Close'}
                      </button>
                    </div>
                  ))}
                  <p className="text-[9px] text-slate-400 font-semibold pt-1">Preview: {formatScheduleToString(newBizSchedule).slice(0, 80)}{formatScheduleToString(newBizSchedule).length > 80 ? '...' : ''}</p>
                </div>

                {/* ── 1. MAIN COVER PHOTO ── */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">🖼️ Cover Image / Shop Photo (Optional)</label>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Primary shop/cover photo for listing. If you don't upload a photo, no default image will be added.</p>
                    </div>
                    {newBizImage && (
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                        ✓ Cover Set
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    id="wizard-cover-upload"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const compressed = await compressImage(file, 1200, 1200, 0.8);
                        if (compressed) {
                          setNewBizImage(compressed);
                          openCropperFor(compressed, 'newBiz');
                        }
                      } catch {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          if (base64) {
                            setNewBizImage(base64);
                            openCropperFor(base64, 'newBiz');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  {newBizImage ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-teal-500 bg-slate-100 aspect-video group">
                      <img loading="lazy" decoding="async" src={newBizImage} alt="Main Cover" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-teal-700 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                        MAIN COVER
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openCropperFor(newBizImage, 'newBiz')}
                          className="bg-slate-900 hover:bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer shadow-md flex items-center gap-1"
                        >
                          <span>✂️ Crop / Adjust</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewBizImage('')}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2 py-1 rounded-lg cursor-pointer shadow-md"
                        >
                          Remove Cover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="wizard-cover-upload"
                      className="flex border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-4 flex-col items-center justify-center cursor-pointer bg-teal-50/30 hover:bg-teal-50/80 transition-all text-center"
                    >
                      <span className="text-xl mb-1">🖼️</span>
                      <span className="text-[10px] font-black text-teal-800 uppercase">Upload Main Cover Photo</span>
                      <span className="text-[9px] text-teal-600 font-semibold mt-0.5">Click to choose image file from device</span>
                    </label>
                  )}
                </div>

                {/* ── 2. GALLERY PHOTOS ── */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">📸 Additional Gallery Photos</label>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Add store interior, products or menu photos.</p>
                    </div>
                    <span className="bg-teal-50 border border-teal-200 text-teal-705 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {newBizGalleryPhotos.length} Uploaded
                    </span>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="wizard-gallery-upload"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length === 0) return;
                      const compressedList: string[] = [];
                      for (const file of files) {
                        try {
                          const c = await compressImage(file, 1000, 1000, 0.75);
                          if (c) compressedList.push(c);
                        } catch {
                          // fallback
                        }
                      }
                      if (compressedList.length > 0) {
                        setNewBizGalleryPhotos(prev => {
                          const combined = [...prev];
                          compressedList.forEach(img => {
                            if (!combined.includes(img)) combined.push(img);
                          });
                          return combined;
                        });
                        showToast(`Added ${compressedList.length} gallery photos! 📸`, "success");
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  <label
                    htmlFor="wizard-gallery-upload"
                    className="flex border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-3.5 flex-col items-center justify-center cursor-pointer bg-teal-50/20 hover:bg-teal-50/60 transition-colors text-center shadow-2xs"
                  >
                    <span className="text-xl mb-1">📸</span>
                    <span className="text-xs font-black text-teal-800 uppercase">📁 Choose Photos from Phone / Device Gallery (Select Multiple)</span>
                    <span className="text-[10px] text-teal-600 font-medium mt-0.5">Click to pick multiple store, menu, or clinic photos</span>
                  </label>

                  {/* Photo thumbnails */}
                  {newBizGalleryPhotos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {newBizGalleryPhotos.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                          <img loading="lazy" decoding="async" src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = newBizGalleryPhotos.filter((_, i) => i !== idx);
                              setNewBizGalleryPhotos(updated);
                            }}
                            className="absolute top-1 right-1 h-5 w-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center cursor-pointer text-xs font-bold shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center bg-white">
                      <p className="text-[10px] text-slate-400 font-bold">No gallery photos added yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}


                {/* STEP 4: Products & Services */}
                {wizardStep === 4 && (
                  <div className="space-y-5 py-2">
                    <div className="text-center space-y-1">
                      <span className="text-2xl">🛍️</span>
                      <h4 className="text-sm font-black text-slate-800">Add Products & Services <span className="text-slate-400 font-bold text-xs">(Optional)</span></h4>
                      <p className="text-[11px] text-slate-500">Add items you sell or services you offer. These will show up on your listing page.</p>
                    </div>

                    {/* Products */}
                    <div className="space-y-3 bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider">📦 Products ({newBizProducts.length})</h5>
                      </div>

                      {/* Add product row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Product name *"
                          value={newBizProdInput.name}
                          onChange={e => setNewBizProdInput(p => ({...p, name: e.target.value}))}
                          className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Price (e.g. ₹199)"
                          value={newBizProdInput.price}
                          onChange={e => setNewBizProdInput(p => ({...p, price: e.target.value}))}
                          className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Short description (optional)"
                          value={newBizProdInput.desc}
                          onChange={e => setNewBizProdInput(p => ({...p, desc: e.target.value}))}
                          className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newBizProdInput.name.trim()) return;
                          setNewBizProducts(prev => [...prev, {...newBizProdInput}]);
                          setNewBizProdInput({name: '', price: '', desc: '', image: ''});
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer transition-colors"
                      >
                        ➕ Add Product
                      </button>

                      {newBizProducts.length > 0 && (
                        <div className="space-y-1.5 mt-2">
                          {newBizProducts.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white border border-amber-100 rounded-xl px-3 py-2 text-xs">
                              <div>
                                <span className="font-extrabold text-slate-800">{p.name}</span>
                                {p.price && <span className="ml-2 text-amber-700 font-bold">{p.price.startsWith('₹') ? p.price : `₹${p.price}`}</span>}
                                {p.desc && <span className="ml-2 text-slate-400">{p.desc}</span>}
                              </div>
                              <button type="button" onClick={() => setNewBizProducts(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700 font-black text-sm cursor-pointer">×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    <div className="space-y-3 bg-teal-50/60 border border-teal-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-teal-900 uppercase tracking-wider">⚙️ Services ({newBizServices.length})</h5>
                      </div>

                      {/* Add service row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Service name *"
                          value={newBizSvcInput.name}
                          onChange={e => setNewBizSvcInput(s => ({...s, name: e.target.value}))}
                          className="bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Price / Rate (e.g. ₹500)"
                          value={newBizSvcInput.price}
                          onChange={e => setNewBizSvcInput(s => ({...s, price: e.target.value}))}
                          className="bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Short description (optional)"
                          value={newBizSvcInput.desc}
                          onChange={e => setNewBizSvcInput(s => ({...s, desc: e.target.value}))}
                          className="bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!newBizSvcInput.name.trim()) return;
                          setNewBizServices(prev => [...prev, {...newBizSvcInput}]);
                          setNewBizSvcInput({name: '', price: '', duration: '', desc: ''});
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer transition-colors"
                      >
                        ➕ Add Service
                      </button>

                      {newBizServices.length > 0 && (
                        <div className="space-y-1.5 mt-2">
                          {newBizServices.map((s, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white border border-teal-100 rounded-xl px-3 py-2 text-xs">
                              <div>
                                <span className="font-extrabold text-slate-800">{s.name}</span>
                                {s.price && <span className="ml-2 text-teal-700 font-bold">{s.price.startsWith('₹') ? s.price : `₹${s.price}`}</span>}
                                {s.desc && <span className="ml-2 text-slate-400">{s.desc}</span>}
                              </div>
                              <button type="button" onClick={() => setNewBizServices(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700 font-black text-sm cursor-pointer">×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-center text-[10px] text-slate-400 font-bold">You can also add/edit products & services anytime from your Business Dashboard after publishing.</p>
                  </div>
                )}

                {/* Stepper Navigation Footer */}
                <div className="border-t border-slate-105 pt-4 mt-6 flex items-center justify-between">
                  <div>
                    {wizardStep > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCreateBizError('');
                          setWizardStep(prev => prev - 1);
                        }}
                        className="px-4 py-2.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1 text-xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {wizardStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (wizardStep === 1 && validateStep1()) setWizardStep(2);
                          else if (wizardStep === 2 && validateStep2()) setWizardStep(3);
                          else if (wizardStep === 3) setWizardStep(4);
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1 hover:scale-[1.01] text-xs font-sans"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCreateBusinessFinal}
                        disabled={creatingBiz}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-2.5 rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1 text-xs"
                      >
                        {creatingBiz ? 'Publishing...' : '🚀 Publish Business Profile'}
                      </button>
                    )}
                  </div>
                </div>

          </div>

        </div>
      </div>
    );
  }

  // Pre-configured mock data for analytics graphs
  const viewsChartData = [
    { name: 'Mon', views: Math.floor((business?.views || 100) * 0.1), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.1) },
    { name: 'Tue', views: Math.floor((business?.views || 100) * 0.13), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.12) },
    { name: 'Wed', views: Math.floor((business?.views || 100) * 0.15), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.14) },
    { name: 'Thu', views: Math.floor((business?.views || 100) * 0.14), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.13) },
    { name: 'Fri', views: Math.floor((business?.views || 100) * 0.18), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.2) },
    { name: 'Sat', views: Math.floor((business?.views || 100) * 0.22), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.25) },
    { name: 'Sun', views: Math.floor((business?.views || 100) * 0.08), clicks: Math.floor(((business?.phoneClicks || 10) + (business?.whatsappClicks || 10)) * 0.06) },
  ];

  const wonLeads = (business?.leads || []).filter(l => l.status === 'Won').length || 0;
  const pendingLeads = (business?.leads || []).filter(l => l.status === 'Pending').length || 0;
  const lostLeads = (business?.leads || []).filter(l => l.status === 'Lost').length || 0;
  const completedLeads = (business?.leads || []).filter(l => l.status === 'Completed').length || 0;

  const leadFunnelData = [
    { name: 'Total leads', value: (business?.leads || []).length || 0 },
    { name: 'Pending', value: pendingLeads },
    { name: 'Won', value: wonLeads + completedLeads },
    { name: 'Lost', value: lostLeads }
  ];

  // Ratings star count distribution calculation
  const star5 = (business?.reviews || []).filter(r => r.rating === 5).length || 0;
  const star4 = (business?.reviews || []).filter(r => r.rating === 4).length || 0;
  const star3 = (business?.reviews || []).filter(r => r.rating === 3).length || 0;
  const star2 = (business?.reviews || []).filter(r => r.rating === 2).length || 0;
  const star1 = (business?.reviews || []).filter(r => r.rating === 1).length || 0;
  const totalReviewsCount = (business?.reviews || []).length || 1;

  // If user has a business registered, show full dashboard; if not, the wizard above handles it.
  // showOnboarding is removed — we no longer show a second registration card.
  // If for any reason businessesList is empty but user has registered, show loading.
  const showBusinessLoading = (hasRegisteredBusiness || currentRole === 'Admin' || currentRole === 'BusinessOwner') && dashboardMode === 'shop' && businessesList.length === 0 && loading;

  if (!isLoggedIn || !loggedInUser?.phone) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-2xl mb-2">
          🔒
        </div>
        <h2 className="text-xl font-black">Authentication Required</h2>
        <p className="text-xs text-slate-300 max-w-sm font-medium leading-relaxed">
          Access to Dashboard is strictly protected. Please log in with your verified mobile number to view &amp; manage your property listings or business dashboard.
        </p>
        <button
          onClick={() => {
            window.location.href = '/?login=true';
          }}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer"
        >
          Login with Mobile OTP →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-55 min-h-screen py-10 text-slate-800">
      {/* Fallback scroll lock when modal is open */}
      {(newBizModalOpen || checkoutModalOpen || specialistCheckoutOpen) && (
        <style>{`body { overflow: hidden !important; }`}</style>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBusinessLoading ? (
          /* Loading State — fetching businesses from API */
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold">Loading your business dashboard...</p>
          </div>
        ) : (
          <>
            {/* Compact Header Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3 shadow-2xs mb-3 space-y-2 text-left">
              {/* Row 1: Dashboard Switcher + Add Business */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black text-xs shrink-0">
                    <Building className="w-3.5 h-3.5 text-teal-650" />
                  </div>
                  <span className="text-xs font-black text-slate-900 shrink-0">Dashboard</span>

                  {/* Portal Switcher Segmented Control */}
                  <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-1 border border-slate-200">
                    <button
                      onClick={() => setDashboardMode('shop')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        dashboardMode === 'shop' ? 'bg-slate-900 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🛍️ Business
                    </button>
                    <button
                      onClick={() => setDashboardMode('property')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        dashboardMode === 'property' ? 'bg-slate-900 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🏢 Property
                    </button>
                  </div>
                </div>

                {/* Right: Active Business Select & Register Button */}
                {dashboardMode === 'shop' && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-[11px] font-bold text-slate-400">Active:</span>
                    <select
                      value={selectedId || (businessesList.length > 0 ? businessesList[0].id : '')}
                      onChange={(e) => {
                        const nextId = parseInt(e.target.value);
                        setSelectedId(nextId);
                      }}
                      className="bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold px-2 py-1 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs max-w-[150px] sm:max-w-[200px] truncate"
                    >
                      {businessesList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        if (businessesList.length >= 1 && currentRole !== 'Admin') {
                          const hasPaidPlan = business?.subscription && business.subscription !== 'Free';
                          if (!hasPaidPlan) {
                            if (confirm('🔒 MULTI-OUTLET UPGRADE REQUIRED\n\nA single mobile number gets 1 Free business listing.\nTo add a 2nd business or outlet, please upgrade to our Basic Plan (₹99/month).\n\nWould you like to view plans & upgrade now?')) {
                              setCheckoutPlan('Basic');
                              setCheckoutModalOpen(true);
                            }
                            return;
                          }
                        }
                        setWizardStep(1);
                        setCreateBizError('');
                        setNewBizModalOpen(true);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1 transition-all shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {dashboardMode === 'property' ? (
              /* REAL ESTATE PROPERTY DASHBOARD */
              <div className="space-y-6 animate-fade-in text-left">
                {/* Clean & Simple Property Dashboard Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 text-left pb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Property Dashboard
                      </h1>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Manage your listings, update prices, and view buyer leads.
                    </p>
                  </div>

                  <Link
                    href="/?postProperty=true"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Property Free</span>
                  </Link>
                </div>

                {/* Subtabs Bar (Clean & Professional) */}
                <div className="flex gap-1 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar -mx-1 px-1">
                  {[
                    { val: 'listings', label: 'My Listings', icon: <Building className="w-3.5 h-3.5" /> },
                    { val: 'leads', label: 'Buyer Enquiries', icon: <Mail className="w-3.5 h-3.5" /> },
                    { val: 'subscription', label: 'Subscription Plans', icon: <Coins className="w-3.5 h-3.5" /> }
                  ].map((tab) => (
                    <button
                      key={tab.val}
                      onClick={() => setPropertySubTab(tab.val as any)}
                      className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${propertySubTab === tab.val
                          ? 'border-slate-900 text-slate-900 bg-slate-100 rounded-t-xl font-black'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* TAB 1: LISTINGS & PROPERTY SETTINGS */}
                {propertySubTab === 'listings' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-800">My Property Listings ({userPropertyList.length})</h3>
                        <p className="text-[11px] text-slate-500 font-medium">Click "Edit" to update price, title, location or photos.</p>
                      </div>
                      <span className="bg-teal-50 border border-teal-200 text-teal-700 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shrink-0">
                        Active Listings
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {userPropertyList.map((prop) => (
                        <div key={prop.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 hover:border-teal-300 transition-colors">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded">
                                {prop.location}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug">{prop.title}</h4>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-teal-700 shrink-0">{prop.price}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                            <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Carpet Area:</span> {prop.area}</div>
                            <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Status:</span> {prop.status}</div>
                            <div className="col-span-2"><span className="text-slate-400 block text-[9px] uppercase font-bold">Contact Info:</span> {prop.postedBy} (+91 {prop.phone})</div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                            <button
                              onClick={() => handleOpenEditProperty(prop)}
                              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Building className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                const newStatus = prop.status === 'Ready to Move' ? 'Rented Out / Sold' : 'Ready to Move';
                                const updated = userPropertyList.map(p => p.id === prop.id ? { ...p, status: newStatus } : p);
                                setUserPropertyList(updated);
                                if (typeof window !== 'undefined') localStorage.setItem('majh_boisar_user_properties', JSON.stringify(updated));
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {prop.status === 'Ready to Move' ? 'Mark Sold' : 'Mark Available'}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${prop.title}"?`)) {
                                  const updated = userPropertyList.filter(p => p.id !== prop.id);
                                  setUserPropertyList(updated);
                                  if (typeof window !== 'undefined') localStorage.setItem('majh_boisar_user_properties', JSON.stringify(updated));
                                }
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 border border-rose-200 cursor-pointer ml-auto"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: LEADS & ENQUIRIES */}
                {propertySubTab === 'leads' && (
                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-2xs space-y-4">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-800">Received Property Buyer Leads</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Contact buyers directly who clicked "Send Enquiry" on your listings.</p>
                    </div>

                    <div className="space-y-3">
                      {(() => {
                        const rawEnquiries = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_property_enquiries') || '[]' : '[]');
                        const myPropIds = new Set(userPropertyList.map((p: any) => p.id));
                        const list = rawEnquiries.filter((enq: any) => {
                          if (!userPhoneDigits && myPropIds.size === 0) return false;
                          if (myPropIds.has(enq.propertyId)) return true;
                          if (userPhoneDigits && enq.ownerPhone) {
                            const enqOwnerDigits = enq.ownerPhone.replace(/\D/g, '');
                            if (enqOwnerDigits && (enqOwnerDigits.endsWith(userPhoneDigits) || userPhoneDigits.endsWith(enqOwnerDigits))) return true;
                          }
                          return false;
                        });

                        if (list.length === 0) {
                          return (
                            <div className="py-10 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-slate-200">
                              <Mail className="w-7 h-7 text-slate-300 mb-1.5" />
                              <p className="text-xs sm:text-sm font-bold text-slate-700">No Property Leads Yet</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Inquiries submitted by buyers will appear here automatically.</p>
                            </div>
                          );
                        }

                        return list.map((enq: any) => {
                          const cleanPhone = (enq.senderPhone || '9820123456').replace(/\D/g, '') || '9820123456';
                          const cleanName = (enq.senderName && enq.senderName !== 'ff' && enq.senderName.trim().length > 1) ? enq.senderName : 'Interested Buyer';

                          return (
                            <div key={enq.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-teal-300 transition-colors">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                                <div>
                                  <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                    {enq.propertyName || 'Property Inquiry'}
                                  </span>
                                  <p className="text-xs font-black text-teal-700 mt-0.5">{enq.propertyPrice}</p>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{enq.createdAt}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-medium">
                                <div>
                                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Buyer Name</span>
                                  <span className="font-extrabold text-slate-800">{cleanName}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Buyer Phone</span>
                                  <span className="font-extrabold text-teal-700">+91 {cleanPhone}</span>
                                </div>
                                <div className="sm:col-span-2 bg-white border border-slate-200 rounded-lg p-2.5">
                                  <span className="text-slate-400 block text-[9px] uppercase font-bold mb-0.5">Message</span>
                                  <p className="text-slate-700 leading-relaxed text-xs">{enq.message}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-200">
                                <button
                                  onClick={() => window.location.href = `tel:+91${cleanPhone}`}
                                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Phone className="w-3.5 h-3.5" /> Call Buyer
                                </button>
                                <button
                                  onClick={() => {
                                    const msg = encodeURIComponent(`Hi ${cleanName}, regarding your inquiry for ${enq.propertyName || 'property'} on Majh Boisar...`);
                                    window.open(`https://wa.me/91${cleanPhone}?text=${msg}`, '_blank');
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Message
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* TAB 3: SUBSCRIPTION MANAGER */}
                {propertySubTab === 'subscription' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                      <h3 className="text-sm font-black text-slate-800">Real Estate Boost & Agent Subscription</h3>
                      <p className="text-xs text-slate-500 font-medium">Upgrade to get 5x more buyer leads and featured listing rank.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {(() => {
                        const activePropPlan = typeof window !== 'undefined' ? (localStorage.getItem(`majh_boisar_property_plan_${loggedInUser?.phone}`) || 'Free') : 'Free';
                        const adminPrices = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('majh_boisar_subscription_prices') || '{}') : '{}');

                        const plansList = [
                          { id: 'Free', title: 'Free Owner Plan', price: adminPrices.propPlanFreePrice || '₹0', features: ['1 Free Active Listing', 'Standard Search Rank', 'Basic Buyer Contact Form'], limit: 1 },
                          { id: 'Owner', title: 'Verified Owner Pass', price: adminPrices.propPlanOwnerPrice || '₹199/mo', features: ['3 Direct Owner Listings', 'Verified Owner Badge', 'Direct WhatsApp & Phone Leads', 'Priority Buyer Contact'], limit: 3 },
                          { id: 'Pro', title: 'Pro Agent Pass', price: adminPrices.propPlanProPrice || '₹499/mo', features: ['5 Active Listings', 'Verified Agent Badge', '5x Direct WhatsApp Leads', 'Featured Banner'], limit: 5 },
                          { id: 'Builder', title: 'Builder Pass', price: adminPrices.propPlanBuilderPrice || '₹1,499/mo', features: ['10 Active Listings / Projects', 'Dedicated Account Manager', 'Super Admin Priority Placement', 'Social Media Promo'], limit: 10 }
                        ];

                        return plansList.map((plan) => {
                          const isCurrent = activePropPlan === plan.id;
                          return (
                            <div key={plan.id} className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between ${isCurrent ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200'}`}>
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-sm font-black text-slate-800">{plan.title}</h4>
                                  {isCurrent && <span className="bg-teal-100 text-teal-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">Active</span>}
                                </div>
                                <p className="text-xl font-black text-teal-700 mb-4">{plan.price}</p>
                                <ul className="space-y-2 text-xs font-medium text-slate-600 mb-6">
                                  {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-1.5 text-slate-700">
                                      <span className="text-teal-600 font-black">✓</span> <span>{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <button
                                onClick={() => {
                                  if (isCurrent) return;
                                  if (plan.id === 'Free') {
                                    localStorage.setItem(`majh_boisar_property_plan_${loggedInUser?.phone}`, 'Free');
                                    alert('Switched to Free Owner Plan.');
                                    window.location.reload();
                                  } else {
                                    const targetPlan = plan.id === 'Owner' ? 'OwnerPass' : plan.id === 'Pro' ? 'ProAgent' : 'BuilderPass';
                                    setCheckoutPlan(targetPlan);
                                    setCheckoutModalOpen(true);
                                  }
                                }}
                                className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${isCurrent
                                    ? 'bg-slate-100 text-slate-500 cursor-default'
                                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
                                  }`}
                              >
                                {isCurrent ? 'Current Active Plan' : `Upgrade to ${plan.title}`}
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-2">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-slate-400 font-semibold">Loading business dashboard...</span>
              </div>
            ) : !business ? (
              <div className="max-w-xl mx-auto py-12 text-center text-slate-800 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 text-3xl flex items-center justify-center mx-auto">
                    🏪
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">No Business Selected</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 max-w-md mx-auto">
                      Choose an active business from the dropdown above, or register a new business / access hotel room bookings.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setNewBizModalOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Register New Business</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (currentRole !== 'Admin' && !business.verified) ? (
              // Verification Under Process Screen
              <div className="max-w-xl mx-auto py-8 text-center text-slate-800 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl text-left relative overflow-hidden">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500"></div>

                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0 text-amber-600 animate-pulse">
                      ⏳
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-wider">Verification Under Process</h2>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 font-sans">Our moderation team is reviewing your shop details</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3 font-sans">
                    <p className="text-xs font-semibold text-slate-650 leading-relaxed">
                      Nevada! Your listing <strong>{business.name}</strong> has been registered successfully.
                    </p>
                    <p className="text-[11px] font-medium text-slate-550 leading-relaxed">
                      Our quality checking team manual verification usually takes <strong>2 to 4 hours</strong>. We verify details like phone numbers and address accuracy to keep the directory spam-free.
                    </p>
                    <p className="text-[11px] font-medium text-slate-550 leading-relaxed">
                      As soon as admin approves the profile, your listing will go live to customers and this full dashboard metrics page (reviews, catalog, leads inbox) will activate.
                    </p>
                  </div>

                  {/* Submitted Details Review */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Submitted Listing Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Business Name</span>
                        <span className="font-extrabold text-slate-700">{business.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Category</span>
                        <span className="font-extrabold text-slate-700">{business.category}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Contact Phone</span>
                        <span className="font-extrabold text-slate-700">{business.phone}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Listing Area</span>
                        <span className="font-extrabold text-slate-700">{business.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-3">
                    <a
                      href="/"
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3 rounded-xl uppercase tracking-wider text-center cursor-pointer transition-colors border border-slate-200/50 flex items-center justify-center"
                    >
                      Go Back Home
                    </a>
                    <a
                      href={`https://wa.me/918208712398?text=Hello%20Majh%20Boisar%20Support!%20My%20business%20"${encodeURIComponent(business.name)}"%20is%20pending%20approval.%20Please%20verify%20it%20fast.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      📞 Contact Support (Verify Fast)
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">

                {/* Expiry Warning Notification Banner */}
                {daysRemaining !== null && daysRemaining <= 5 && (
                  <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-2xl p-4.5 shadow-md flex items-center justify-between flex-wrap gap-4 animate-bounce">
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider">Plan Expiry Alert!</p>
                        <p className="text-[10.5px] font-bold opacity-90">
                          Your subscription for <strong className="underline">{business.name}</strong> will expire in{' '}
                          <strong className="text-yellow-250 font-black">{daysRemaining} days</strong> (on {subscriptionExpiresAt}).
                          Renew now to keep your Trusted badge & customer leads.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('subscription')}
                      className="bg-white text-rose-600 hover:bg-rose-50 text-[10px] font-black px-4.5 py-2.5 rounded-xl cursor-pointer shadow transition-all hover:scale-105"
                    >
                      Renew Subscription Now
                    </button>
                  </div>
                )}


                {/* Admin Hotel Session Notice Banner */}
                {(hotelIdParam || business.category === 'Hotels' || (business.category && business.category.toLowerCase().includes('hotel'))) && (
                  <div className="bg-purple-900 text-white px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-purple-800">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🏨</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">Hotel Front Desk &amp; Reception Dashboard</span>
                          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">Live Session</span>
                        </div>
                        <span className="text-[10.5px] text-purple-200 font-medium mt-0.5 block">
                          Managing room rates, live inventory, guest check-ins &amp; payouts for <strong>{business.name}</strong>
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/adminmb"
                      className="bg-white/15 hover:bg-white/25 text-white border border-white/30 text-[10px] font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0"
                    >
                      <span>← Back to Admin Panel</span>
                    </Link>
                  </div>
                )}

                {/* Compact Business Status Bar */}
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-black text-xs shrink-0">
                      {business.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-black text-slate-900 truncate">{business.name}</span>
                        {business.verified && <Check className="w-3.5 h-3.5 text-white bg-emerald-500 rounded-full p-0.5 shrink-0" />}
                        {business.subscription !== 'Free' && (
                          <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-1.5 py-0.2 rounded border border-amber-300 shrink-0">
                            ✅ Trusted
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider block leading-none">
                        {business.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsStandeeModalOpen(true)}
                      className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-[10.5px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                      title="Download Official Printable QR Standee for Your Counter"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-700" />
                      <span className="hidden sm:inline">Official</span>
                      <span>QR Standee</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-[10px] text-slate-400 font-bold">Plan:</span>
                      <strong className="text-rose-600 font-black text-[11px] uppercase">{business.subscription}</strong>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-slate-700 text-[11px] font-bold">{business.rating} ({business.reviewCount})</strong>
                    </div>
                  </div>
                </div>

                {/* Dashboard Subtabs Navigation (Mobile Optimized Horizontal Scroll) */}
                {(() => {
                  const bizCatLower = (business?.category || '').toLowerCase();
                  const bizNameLower = (business?.name || '').toLowerCase();
                  const isHospital = bizCatLower.includes('hospital') || bizCatLower.includes('clinic') || bizCatLower.includes('doctor') || bizCatLower.includes('medical') || bizNameLower.includes('hospital') || bizNameLower.includes('clinic');
                  const isTurfBusiness = !isHospital && (bizCatLower.includes('turf') || bizCatLower.includes('sports turf') || bizNameLower.includes('turf'));
                  const isHotelBusiness = !isHospital && (
                    bizCatLower === 'hotel' ||
                    bizCatLower === 'hotels' ||
                    bizCatLower === 'resort' ||
                    bizCatLower === 'resorts' ||
                    bizCatLower.includes('hotel') ||
                    bizCatLower.includes('resort') ||
                    bizCatLower.includes('guest house') ||
                    bizCatLower.includes('lodge') ||
                    bizCatLower.includes('villa') ||
                    bizCatLower.includes('homestay') ||
                    bizNameLower.includes('hotel') ||
                    bizNameLower.includes('resort')
                  );

                  const isFoodBusiness = !isHospital && (
                    bizCatLower.includes('restaurant') ||
                    bizCatLower.includes('cafe') ||
                    bizCatLower.includes('food') ||
                    bizCatLower.includes('dining') ||
                    bizCatLower.includes('dhaba') ||
                    bizCatLower.includes('pizza') ||
                    bizCatLower.includes('bakery') ||
                    bizCatLower.includes('seafood') ||
                    bizCatLower.includes('hotel / food') ||
                    bizNameLower.includes('cafe') ||
                    bizNameLower.includes('restaurant') ||
                    bizNameLower.includes('food') ||
                    bizNameLower.includes('dhaba')
                  );

                  const tabsList = [
                    { val: 'analytics', label: 'Analytics', icon: <Activity className="w-3.5 h-3.5" /> },
                    ...(isFoodBusiness ? [{ val: 'kitchen_orders', label: `🍽️ Kitchen KDS (${kitchenOrdersList.filter(o => o.status !== 'completed').length})`, icon: <Utensils className="w-3.5 h-3.5 text-orange-600" /> }] : []),
                    ...(isHotelBusiness ? [{ val: 'hotel_bookings', label: `🏨 Hotel Bookings (${hotelBookingsList.length})`, icon: <Building className="w-3.5 h-3.5" /> }] : []),
                    ...(isTurfBusiness ? [{ val: 'turf_bookings', label: `⚽ Turf Bookings (${turfBookingsList.length})`, icon: <Trophy className="w-3.5 h-3.5" /> }] : []),
                    { val: 'leads', label: `Leads (${(business.leads || []).length})`, icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
                    { val: 'catalog', label: 'Catalog', icon: <Layers className="w-3.5 h-3.5" /> },
                    { val: 'reviews', label: `Reviews (${(business.reviews || []).length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
                    { val: 'settings', label: 'Settings', icon: <Building className="w-3.5 h-3.5" /> },
                    { val: 'jobs', label: 'Jobs', icon: <Briefcase className="w-3.5 h-3.5" /> },
                    { val: 'subscription', label: 'Subscription', icon: <Coins className="w-3.5 h-3.5" /> }
                  ];

                  return (
                    <div className="flex gap-1 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar -mx-1 px-1">
                      {tabsList.map((tab) => (
                        <button
                          key={tab.val}
                          onClick={() => setActiveSubTab(tab.val as any)}
                          className={`px-3 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeSubTab === tab.val
                              ? 'border-purple-600 text-purple-800 font-black bg-purple-50/50 rounded-t-xl border-t border-x border-purple-200'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                          {tab.icon}
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {/* ── SUBTAB CONTENT: 🍽️ LIVE KITCHEN KDS & TABLE ORDERS DASHBOARD ── */}
                {activeSubTab === 'kitchen_orders' && (
                  <div className="space-y-5 text-left animate-fade-in">
                    
                    {/* Header Controls */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-2">
                              <span>🍽️ Live Kitchen Display System (KDS)</span>
                            </h2>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Real-time table orders from Tabletop QR Standees, Chef KOT tickets &amp; Bill settlements
                          </p>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                          {/* Audio Bell Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              setKitchenAudioEnabled(!kitchenAudioEnabled);
                              if (!kitchenAudioEnabled) playKitchenChime();
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                              kitchenAudioEnabled 
                                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}
                            title="Toggle sound chime on new orders"
                          >
                            {kitchenAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                            <span>Sound: {kitchenAudioEnabled ? 'ON' : 'OFF'}</span>
                          </button>

                          {/* Print Table QR Standees */}
                          <button
                            type="button"
                            onClick={() => setIsStandeeModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Print Table QRs</span>
                          </button>

                          {/* Add Manual Order */}
                          <button
                            type="button"
                            onClick={() => setIsManualOrderModalOpen(true)}
                            className="bg-slate-900 hover:bg-black text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                            <span>+ New Table Order</span>
                          </button>
                        </div>
                      </div>

                      {/* 4 Summary Metric Counters */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                        <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl">
                          <span className="text-[9.5px] font-black text-amber-900 uppercase tracking-wider block">Active Dine-In</span>
                          <span className="text-xl font-black text-amber-950 mt-0.5 block">
                            🪑 {kitchenOrdersList.filter(o => o.status !== 'completed' && o.orderType !== 'delivery').length} Tables
                          </span>
                        </div>

                        <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl">
                          <span className="text-[9.5px] font-black text-emerald-900 uppercase tracking-wider block">Home Delivery</span>
                          <span className="text-xl font-black text-emerald-950 mt-0.5 block">
                            🛵 {kitchenOrdersList.filter(o => o.status !== 'completed' && o.orderType === 'delivery').length} Orders
                          </span>
                        </div>

                        <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-2xl">
                          <span className="text-[9.5px] font-black text-blue-900 uppercase tracking-wider block">Cooking / In Kitchen</span>
                          <span className="text-xl font-black text-blue-950 mt-0.5 block">
                            👨‍🍳 {kitchenOrdersList.filter(o => o.status === 'cooking').length} Orders
                          </span>
                        </div>

                        <div className="bg-purple-50/80 border border-purple-200 p-3 rounded-2xl">
                          <span className="text-[9.5px] font-black text-purple-800 uppercase tracking-wider block">Today&apos;s Food Revenue</span>
                          <span className="text-xl font-black text-purple-950 mt-0.5 block">
                            ₹{kitchenOrdersList.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Filter Switcher Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { id: 'all', label: 'All Active Orders', count: kitchenOrdersList.filter(o => o.status !== 'completed').length },
                        { id: 'dinein', label: '🪑 Dine-In', count: kitchenOrdersList.filter(o => o.status !== 'completed' && o.orderType !== 'delivery').length },
                        { id: 'delivery', label: '🛵 Home Delivery', count: kitchenOrdersList.filter(o => o.status !== 'completed' && o.orderType === 'delivery').length },
                        { id: 'new', label: '🟡 New / Unattended', count: kitchenOrdersList.filter(o => o.status === 'new').length },
                        { id: 'cooking', label: '👨‍🍳 Cooking in Kitchen', count: kitchenOrdersList.filter(o => o.status === 'cooking').length },
                        { id: 'ready', label: '🟢 Ready to Dispatch', count: kitchenOrdersList.filter(o => o.status === 'ready').length },
                        { id: 'history', label: '🧾 Recent Completed Orders', count: kitchenOrdersList.filter(o => o.status === 'completed').length },
                      ].map((tab) => {
                        const isSelected = kitchenOrdersFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setKitchenOrdersFilter(tab.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                              isSelected
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-102'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* ── KITCHEN DISPLAY ORDER CARDS (ACTIVE ORDERS) ── */}
                    {kitchenOrdersFilter !== 'history' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {kitchenOrdersList
                          .filter(order => {
                            if (order.status === 'completed') return false;
                            if (kitchenOrdersFilter === 'dinein') return order.orderType !== 'delivery';
                            if (kitchenOrdersFilter === 'delivery') return order.orderType === 'delivery';
                            if (kitchenOrdersFilter === 'new') return order.status === 'new';
                            if (kitchenOrdersFilter === 'cooking') return order.status === 'cooking';
                            if (kitchenOrdersFilter === 'ready') return order.status === 'ready';
                            return true;
                          })
                          .map((order) => {
                            const isNew = order.status === 'new';
                            const isCooking = order.status === 'cooking';
                            const isReady = order.status === 'ready';
                            const isDelivery = order.orderType === 'delivery';

                            return (
                              <div
                                key={order.id}
                                className={`bg-white rounded-3xl border-2 overflow-hidden shadow-md flex flex-col justify-between transition-all ${
                                  isNew 
                                    ? 'border-amber-400 ring-2 ring-amber-400/20' 
                                    : isCooking 
                                    ? 'border-blue-400' 
                                    : 'border-emerald-500'
                                }`}
                              >
                                <div>
                                  {/* Card Header with Table # / Delivery & Status Badge */}
                                  <div className={`p-3.5 flex items-center justify-between text-white ${
                                    isDelivery
                                      ? 'bg-gradient-to-r from-emerald-700 to-teal-800'
                                      : isNew 
                                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600' 
                                      : isCooking 
                                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700' 
                                      : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-black text-xs px-2.5 py-1 rounded-xl shadow-xs ${
                                        isDelivery ? 'bg-amber-300 text-slate-950' : 'bg-white text-slate-950'
                                      }`}>
                                        {isDelivery ? '🛵 HOME DELIVERY' : `🪑 TABLE #${order.tableNumber || '1'}`}
                                      </span>
                                      <span className="text-[11px] font-bold opacity-90 truncate max-w-[120px]">
                                        {order.customerName || 'Customer'}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[10px] font-black bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-lg text-white">
                                        {order.time}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Delivery Address & Contact Row */}
                                  {isDelivery && order.deliveryAddress && (
                                    <div className="bg-emerald-50 border-b border-emerald-200 px-3.5 py-2 space-y-1 text-xs">
                                      <div className="flex items-start gap-1.5 text-emerald-950">
                                        <span className="shrink-0 mt-0.5">📍</span>
                                        <span className="font-bold leading-tight">{order.deliveryAddress}</span>
                                      </div>
                                      {order.customerPhone && (
                                        <div className="flex items-center justify-between pt-1">
                                          <span className="font-mono text-[11px] text-emerald-800 font-bold">
                                            📞 +91 {order.customerPhone}
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <a
                                              href={`tel:${order.customerPhone}`}
                                              className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-emerald-800"
                                            >
                                              Call
                                            </a>
                                            <a
                                              href={`https://wa.me/91${order.customerPhone}?text=${encodeURIComponent(`Hi ${order.customerName}, your food order from ${business?.name || 'Restaurant'} is being prepared!`)}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-[#20bd5a]"
                                            >
                                              WhatsApp
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Special Chef Note / Instructions */}
                                  {order.notes && (
                                    <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-1.5 flex items-center gap-1.5 text-[11px] font-extrabold text-amber-950">
                                      <span>📝</span>
                                      <span className="truncate">Note: {order.notes}</span>
                                    </div>
                                  )}

                                  {/* Dish Checklist for Cook / Kitchen */}
                                  <div className="p-3.5 space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                      Items to Prepare ({order.items.length})
                                    </span>

                                    <div className="space-y-1.5">
                                      {order.items.map((it: any, idx: number) => (
                                        <div
                                          key={idx}
                                          onClick={() => handleToggleDishDone(order.id, idx)}
                                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all cursor-pointer ${
                                            it.done 
                                              ? 'bg-slate-100/80 border-slate-200 text-slate-400 line-through opacity-70' 
                                              : 'bg-slate-50 border-slate-200/90 text-slate-900 font-bold hover:bg-slate-100'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] shrink-0 font-black ${
                                              it.done ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-400 bg-white'
                                            }`}>
                                              {it.done && '✓'}
                                            </span>
                                            <span className="truncate">{it.name}</span>
                                          </div>
                                          <span className="font-black text-slate-950 shrink-0 bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
                                            x {it.count}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Total Bill Preview */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                      <span className="text-slate-500 font-bold">Total Bill:</span>
                                      <span className="font-black text-slate-950 text-sm">₹{order.totalAmount}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Action Transition Controls */}
                                <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1.5">
                                  {isNew && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateOrderStatus(order.id, 'cooking')}
                                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                      <span>👨‍🍳 Start Cooking (Send to Chef)</span>
                                    </button>
                                  )}

                                  {isCooking && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                      <span>🍽️ Food Ready / Serve Table</span>
                                    </button>
                                  )}

                                  {isReady && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                                    >
                                      <Receipt className="w-3.5 h-3.5" />
                                      <span>🧾 Bill Paid &amp; Clear Table</span>
                                    </button>
                                  )}

                                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const printContent = `
                                          <html>
                                          <head><title>KOT Ticket - Table ${order.tableNumber}</title>
                                          <style>
                                            body { font-family: monospace; padding: 20px; text-align: center; }
                                            .header { font-size: 16px; font-weight: bold; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 12px; }
                                            .item { display: flex; justify-content: space-between; font-size: 14px; margin: 6px 0; }
                                            .footer { border-top: 2px dashed #000; margin-top: 12px; padding-top: 8px; font-weight: bold; }
                                          </style>
                                          </head>
                                          <body>
                                            <div class="header">
                                              <h2>${business?.name || 'Restaurant'}</h2>
                                              <h3>TABLE #${order.tableNumber}</h3>
                                              <p>Time: ${order.time} | Order: ${order.id}</p>
                                            </div>
                                            <div style="text-align:left;">
                                              ${order.items.map((it: any) => `<div class="item"><span>${it.name} x ${it.count}</span><span>₹${it.price * it.count}</span></div>`).join('')}
                                            </div>
                                            <div class="footer">
                                              <p>TOTAL BILL: ₹${order.totalAmount}</p>
                                              ${order.notes ? `<p>Note: ${order.notes}</p>` : ''}
                                            </div>
                                          </body>
                                          </html>
                                        `;
                                        const win = window.open('', '', 'width=400,height=600');
                                        if (win) {
                                          win.document.write(printContent);
                                          win.document.close();
                                          win.print();
                                        }
                                      }}
                                      className="bg-white hover:bg-slate-100 text-slate-700 font-black text-[10.5px] py-1.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <Printer className="w-3 h-3 text-slate-500" />
                                      <span>Print KOT</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const phone = order.customerPhone || business?.whatsapp || '9307294733';
                                        const text = `Hi ${order.customerName || 'Diner'},\nYour order at Table #${order.tableNumber} (${business?.name}) is currently *${order.status === 'new' ? 'received' : order.status === 'cooking' ? 'being prepared in the kitchen' : 'ready and served'}*.\n\nTotal Bill: ₹${order.totalAmount}\nThank you!`;
                                        window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
                                      }}
                                      className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-black text-[10.5px] py-1.5 rounded-lg border border-[#25D366]/30 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                    >
                                      <MessageSquare className="w-3 h-3 text-[#25D366]" />
                                      <span>WhatsApp</span>
                                    </button>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* ── RECENT COMPLETED ORDERS & TABLE BILL HISTORY ── */}
                    {kitchenOrdersFilter === 'history' && (
                      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="font-black text-sm text-slate-900">Recent Completed Table Bills</h3>
                            <p className="text-[11px] text-slate-500 font-medium">History of today's settled dine-in QR orders</p>
                          </div>
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-3 py-1 rounded-xl">
                            {kitchenOrdersList.filter(o => o.status === 'completed').length} Settled Tables
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {kitchenOrdersList.filter(o => o.status === 'completed').length === 0 ? (
                            <div className="py-8 text-center space-y-1">
                              <span className="text-2xl block">🍽️</span>
                              <p className="text-xs font-black text-slate-700">No completed orders yet today.</p>
                              <p className="text-[11px] text-slate-400">When you clear tables, their settled bills will archive here.</p>
                            </div>
                          ) : (
                            kitchenOrdersList.filter(o => o.status === 'completed').map((order) => (
                              <div key={order.id} className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                                      🪑 TABLE #{order.tableNumber}
                                    </span>
                                    <strong className="text-slate-900 font-black">{order.customerName || 'Diner'}</strong>
                                    <span className="text-[10px] text-slate-400 font-bold">• {order.time}</span>
                                    <span className="bg-emerald-100 text-emerald-800 text-[9.5px] font-black px-2 py-0.2 rounded-full">
                                      ✓ Paid &amp; Settled
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 font-medium">
                                    {order.items.map((it: any) => `${it.name} (x${it.count})`).join(', ')}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="font-black text-sm text-slate-950">₹{order.totalAmount}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const printContent = `
                                        <html>
                                        <head><title>Receipt - Table ${order.tableNumber}</title>
                                        <style>
                                          body { font-family: monospace; padding: 20px; text-align: center; }
                                          .header { font-size: 16px; font-weight: bold; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 12px; }
                                          .item { display: flex; justify-content: space-between; font-size: 14px; margin: 6px 0; }
                                          .footer { border-top: 2px dashed #000; margin-top: 12px; padding-top: 8px; font-weight: bold; }
                                        </style>
                                        </head>
                                        <body>
                                          <div class="header">
                                            <h2>${business?.name || 'Restaurant'}</h2>
                                            <h3>FINAL BILL RECEIPT</h3>
                                            <p>TABLE #${order.tableNumber} | Order: ${order.id}</p>
                                            <p>Status: PAID VIA UPI / CASH</p>
                                          </div>
                                          <div style="text-align:left;">
                                            ${order.items.map((it: any) => `<div class="item"><span>${it.name} x ${it.count}</span><span>₹${it.price * it.count}</span></div>`).join('')}
                                          </div>
                                          <div class="footer">
                                            <p>TOTAL PAID: ₹${order.totalAmount}</p>
                                            <p>Thank you for dining with us!</p>
                                          </div>
                                        </body>
                                        </html>
                                      `;
                                      const win = window.open('', '', 'width=400,height=600');
                                      if (win) {
                                        win.document.write(printContent);
                                        win.document.close();
                                        win.print();
                                      }
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10.5px] px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Printer className="w-3 h-3" />
                                    <span>Print Receipt</span>
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── MODAL: MANUAL TABLE ORDER ENTRY ── */}
                    {isManualOrderModalOpen && (
                      <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 text-left">
                        <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🛎️</span>
                              <div>
                                <h3 className="text-sm font-black text-slate-900">Create Table Order</h3>
                                <p className="text-[10px] text-slate-500 font-bold">Punch in walk-in or counter order to kitchen</p>
                              </div>
                            </div>
                            <button onClick={() => setIsManualOrderModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <form onSubmit={handleCreateManualOrder} className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Table Number *</label>
                                <input
                                  type="text"
                                  required
                                  value={newManualOrderTable}
                                  onChange={e => setNewManualOrderTable(e.target.value)}
                                  placeholder="e.g. 1, 2, Cabin 3"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none focus:border-orange-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Diner Name</label>
                                <input
                                  type="text"
                                  value={newManualOrderDiner}
                                  onChange={e => setNewManualOrderDiner(e.target.value)}
                                  placeholder="e.g. Rohan"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Ordered Dishes * (Comma separated)</label>
                              <textarea
                                required
                                rows={2}
                                value={newManualOrderItems}
                                onChange={e => setNewManualOrderItems(e.target.value)}
                                placeholder="e.g. Masala Dosa - 110, Filter Coffee - 40"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Total Bill (₹)</label>
                                <input
                                  type="number"
                                  value={newManualOrderAmount}
                                  onChange={e => setNewManualOrderAmount(e.target.value)}
                                  placeholder="Auto or enter"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Chef Note</label>
                                <input
                                  type="text"
                                  value={newManualOrderNotes}
                                  onChange={e => setNewManualOrderNotes(e.target.value)}
                                  placeholder="e.g. Less spicy"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                                />
                              </div>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => setIsManualOrderModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-black shadow-md cursor-pointer transition-all active:scale-95"
                              >
                                Send Order to Kitchen 🚀
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* ── SUBTAB CONTENT: 🏨 HOTEL ROOM & DESK BOOKING MANAGEMENT ── */}
                {activeSubTab === 'hotel_bookings' && (() => {
                  const bizCatLower = (business?.category || '').toLowerCase();
                  const bizNameLower = (business?.name || '').toLowerCase();
                  const isHospital = bizCatLower.includes('hospital') || bizCatLower.includes('clinic') || bizCatLower.includes('doctor') || bizCatLower.includes('medical') || bizNameLower.includes('hospital') || bizNameLower.includes('clinic');
                  return !isHospital && (
                    bizCatLower === 'hotel' ||
                    bizCatLower === 'hotels' ||
                    bizCatLower === 'resort' ||
                    bizCatLower === 'resorts' ||
                    bizCatLower.includes('hotel') ||
                    bizCatLower.includes('resort') ||
                    bizCatLower.includes('guest house') ||
                    bizCatLower.includes('lodge') ||
                    bizCatLower.includes('villa') ||
                    bizCatLower.includes('homestay') ||
                    bizNameLower.includes('hotel') ||
                    bizNameLower.includes('resort')
                  );
                })() && (
                  <div className="space-y-4 text-left animate-fade-in">
                    
                    {/* Clean Header Bar with Switcher Navigation */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                            Hotel Bookings
                          </h2>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Manage guest check-ins, room rates &amp; hotel details
                          </p>
                        </div>

                        {/* Total Count Badge */}
                        <div className="shrink-0">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-3 py-1 rounded-xl">
                            {hotelBookingsList.length} Bookings
                          </span>
                        </div>
                      </div>

                      {/* 4 Clean Tabs */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setHotelDeskView('register')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            hotelDeskView === 'register'
                              ? 'bg-white text-slate-950 shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>Bookings</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${hotelDeskView === 'register' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {hotelBookingsList.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHotelDeskView('tariffs')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            hotelDeskView === 'tariffs'
                              ? 'bg-white text-slate-950 shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>Room Rates</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHotelDeskView('profile')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            hotelDeskView === 'profile'
                              ? 'bg-white text-slate-950 shadow-xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>Hotel Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHotelDeskView('payouts')}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            hotelDeskView === 'payouts'
                              ? 'bg-emerald-700 text-white shadow-xs font-black'
                              : 'text-slate-700 hover:text-slate-900 bg-white/60'
                          }`}
                        >
                          <span>💰 Payouts</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-900 font-extrabold px-1 rounded">
                            90%
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════
                        VIEW 1: RECEPTION DESK REGISTER (LIVE BOOKINGS & WALK-IN)
                       ══════════════════════════════════════════════════════ */}
                    {hotelDeskView === 'register' && (
                      <div className="space-y-4">
                        {/* 4 Quick Stat Counters */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
                            <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">{hotelBookingsList.length}</span>
                          </div>

                          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Confirmed / New</span>
                            <span className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5 block">
                              {hotelBookingsList.filter(b => (b.status || '').includes('Confirmed')).length}
                            </span>
                          </div>

                          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
                            <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider block">Checked In</span>
                            <span className="text-lg sm:text-xl font-black text-purple-900 mt-0.5 block">
                              {hotelBookingsList.filter(b => (b.status || '').includes('Checked-In') || (b.status || '').includes('Assigned')).length}
                            </span>
                          </div>

                          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
                            <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Total Revenue</span>
                            <span className="text-lg sm:text-xl font-black text-amber-600 mt-0.5 block">
                              ₹{hotelBookingsList.reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0)}
                            </span>
                          </div>
                        </div>

                        {/* Live Room Inventory & Availability Control */}
                        <div className="bg-white border border-purple-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">🚪</span>
                              <div>
                                <h5 className="font-black text-xs text-slate-900 leading-tight">Live Room Inventory Control</h5>
                                <p className="text-[10px] text-slate-500 font-medium">Turn AC or Non-AC rooms ON or OFF in real time for online guests</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                              Front Desk Live
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-purple-50">
                            {/* AC Room Toggle */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
                              <div className="flex items-center gap-2">
                                <span className="text-base">❄️</span>
                                <div>
                                  <span className="text-xs font-bold text-slate-900 block">Deluxe AC Rooms</span>
                                  <span className={`text-[10px] font-black ${hotelAvailability.ac ? 'text-emerald-700' : 'text-rose-600'}`}>
                                    {hotelAvailability.ac ? '🟢 Open for Online Booking' : '🔴 Marked SOLD OUT'}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleRoomAvailability('ac')}
                                className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer ${
                                  hotelAvailability.ac
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                {hotelAvailability.ac ? 'Mark Sold Out' : 'Open Booking'}
                              </button>
                            </div>

                            {/* Non-AC Room Toggle */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
                              <div className="flex items-center gap-2">
                                <span className="text-base">🌀</span>
                                <div>
                                  <span className="text-xs font-bold text-slate-900 block">Standard Non-AC Rooms</span>
                                  <span className={`text-[10px] font-black ${hotelAvailability.non_ac ? 'text-emerald-700' : 'text-rose-600'}`}>
                                    {hotelAvailability.non_ac ? '🟢 Open for Online Booking' : '🔴 Marked SOLD OUT'}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleRoomAvailability('non_ac')}
                                className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer ${
                                  hotelAvailability.non_ac
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                {hotelAvailability.non_ac ? 'Mark Sold Out' : 'Open Booking'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Walk-in Entry Expandable Button & Form */}
                        <div className="bg-white border border-purple-200/90 rounded-2xl shadow-xs overflow-hidden">
                          <div 
                            onClick={() => setShowWalkInForm(!showWalkInForm)}
                            className="p-3.5 sm:p-4 bg-purple-50/50 flex items-center justify-between cursor-pointer hover:bg-purple-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-purple-900 text-white flex items-center justify-center text-sm font-black">
                                +
                              </div>
                              <div>
                                <h5 className="font-black text-xs sm:text-sm text-purple-950">Add Walk-In Guest</h5>
                                <p className="text-[10px] text-slate-500 font-medium">Record a walk-in guest check-in at front desk</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="text-xs font-black text-purple-900 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                            >
                              {showWalkInForm ? '▲ Close' : '+ Add Guest'}
                            </button>
                          </div>

                          {showWalkInForm && (
                            <form onSubmit={handleAddManualHotelBooking} className="p-4 sm:p-5 border-t border-purple-100 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Guest Full Name *</label>
                                  <input
                                    type="text"
                                    required
                                    value={manualHotelGuestName}
                                    onChange={e => setManualHotelGuestName(e.target.value)}
                                    placeholder="e.g. Amit Sharma"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-600"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Guest Mobile Number *</label>
                                  <input
                                    type="text"
                                    required
                                    value={manualHotelGuestPhone}
                                    onChange={e => setManualHotelGuestPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="e.g. 9820123456"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-600 font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Room Preference</label>
                                  <select
                                    value={manualHotelRoomCategory}
                                    onChange={e => setManualHotelRoomCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                                  >
                                    <option value="❄️ AC Room">❄️ AC Room</option>
                                    <option value="🌀 Non-AC Room">🌀 Non-AC Room</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Stay Duration</label>
                                  <select
                                    value={manualHotelTimeSlot}
                                    onChange={e => setManualHotelTimeSlot(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                                  >
                                    <option value="12:00 PM - 03:00 PM (3 Hours)">3 Hours Stay</option>
                                    <option value="12:00 PM - 06:00 PM (6 Hours)">6 Hours Stay</option>
                                    <option value="12:00 PM - 12:00 AM (12 Hours)">12 Hours Stay</option>
                                    <option value="Night Stay (Overnight)">🌙 Full Night Stay</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Assign Room No. *</label>
                                  <input
                                    type="text"
                                    required
                                    value={manualHotelRoomNo}
                                    onChange={e => setManualHotelRoomNo(e.target.value)}
                                    placeholder="e.g. Room 101"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-purple-900 outline-none focus:border-purple-600"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[9px] text-purple-900 font-black uppercase tracking-wider mb-1">Amount Collected (₹) *</label>
                                  <input
                                    type="text"
                                    required
                                    value={manualHotelAmount}
                                    onChange={e => setManualHotelAmount(e.target.value)}
                                    placeholder="e.g. 699"
                                    className="w-full bg-purple-50 border border-purple-300 rounded-xl px-3 py-2 text-xs font-black text-purple-900 outline-none focus:border-purple-600"
                                  />
                                </div>

                                <div className="sm:col-span-2 flex items-end">
                                  <button
                                    type="submit"
                                    className="w-full bg-purple-900 hover:bg-purple-950 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer"
                                  >
                                    + Save &amp; Check-In Walk-In Guest
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="bg-white border border-slate-200 p-3 rounded-2xl space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3 shadow-2xs">
                          {/* Filter Pills */}
                          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                            {[
                              { id: 'All', label: 'All', count: hotelBookingsList.length },
                              { id: 'Confirmed', label: 'Confirmed', count: hotelBookingsList.filter(b => (b.status || '').includes('Confirmed')).length },
                              { id: 'Checked-In', label: 'Checked-In', count: hotelBookingsList.filter(b => (b.status || '').includes('Checked-In') || (b.status || '').includes('Assigned')).length },
                              { id: 'Completed', label: 'Completed', count: hotelBookingsList.filter(b => (b.status || '').includes('Completed')).length },
                              { id: 'Cancelled', label: 'Cancelled', count: hotelBookingsList.filter(b => (b.status || '').includes('Cancelled')).length }
                            ].map(filter => (
                              <button
                                key={filter.id}
                                type="button"
                                onClick={() => setHotelBookingFilter(filter.id as any)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                                  hotelBookingFilter === filter.id
                                    ? 'bg-purple-900 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <span>{filter.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${hotelBookingFilter === filter.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                  {filter.count}
                                </span>
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {/* Search Input */}
                            <div className="w-full sm:w-56">
                              <input
                                type="text"
                                value={hotelSearchQuery}
                                onChange={e => setHotelSearchQuery(e.target.value)}
                                placeholder="Search by name, phone, Ref ID..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-600"
                              />
                            </div>

                            {/* Export Register CSV */}
                            <button
                              type="button"
                              onClick={handleExportHotelRegisterCSV}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Download Full Desk Register as Excel / CSV"
                            >
                              <span>📥</span>
                              <span className="hidden sm:inline">Export Excel</span>
                            </button>

                            {/* Print Desk Register */}
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Print Reception Register Sheet"
                            >
                              <span>🖨️</span>
                              <span className="hidden sm:inline">Print</span>
                            </button>
                          </div>
                        </div>

                        {/* Booking Passes Grid */}
                        {(() => {
                          const filtered = hotelBookingsList.filter(b => {
                            const matchesFilter = hotelBookingFilter === 'All' || (b.status || '').includes(hotelBookingFilter);
                            const q = hotelSearchQuery.toLowerCase();
                            const matchesSearch = !q || 
                              (b.guestName || '').toLowerCase().includes(q) ||
                              (b.guestPhone || '').includes(q) ||
                              (b.id || '').toLowerCase().includes(q) ||
                              (b.hotelName || '').toLowerCase().includes(q);

                            return matchesFilter && matchesSearch;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-6 space-y-2">
                                <Building className="w-10 h-10 text-slate-300 mx-auto" />
                                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">No Bookings Found in this filter</h4>
                                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                                  When guests book online or you add walk-in entries, their stay passes will appear right here.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                              {filtered.map(booking => {
                                const cleanPhone = (booking.guestPhone || '').replace(/\D/g, '');
                                const isCheckedIn = (booking.status || '').includes('Checked-In') || (booking.status || '').includes('Active');
                                const isCancelled = (booking.status || '').includes('Cancelled');
                                const isCompleted = (booking.status || '').includes('Completed');

                                return (
                                  <div 
                                    key={booking.id} 
                                    className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-2.5"
                                  >
                                    {/* Top Row: Ref ID + Date + Status */}
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
                                          #{booking.id}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                          {booking.checkInDate || booking.date || 'Today'}
                                        </span>
                                      </div>

                                      <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full ${
                                        isCheckedIn
                                          ? 'bg-purple-100 text-purple-900'
                                          : isCancelled
                                          ? 'bg-rose-100 text-rose-800'
                                          : isCompleted
                                          ? 'bg-slate-100 text-slate-700'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {booking.status || 'Confirmed'}
                                      </span>
                                    </div>

                                    {/* Guest Details & Stay info */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold block">Guest</span>
                                        <span className="font-bold text-slate-900 block truncate">{booking.guestName}</span>
                                        <span className="text-[11px] text-slate-500 font-medium font-mono">+91 {booking.guestPhone}</span>
                                      </div>

                                      <div>
                                        <span className="text-[10px] text-slate-400 font-bold block">Stay &amp; Room</span>
                                        <span className="font-bold text-slate-800 block truncate">{booking.timeSlot || booking.stayType || '3 Hours Stay'}</span>
                                        <span className="text-[10px] text-emerald-700 font-bold">{booking.roomCategory || 'AC Room'}</span>
                                      </div>
                                    </div>

                                    {/* Room Assignment & Total */}
                                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500">Room:</span>
                                        <input
                                          type="text"
                                          defaultValue={booking.assignedRoom || 'Room 101'}
                                          onBlur={(e) => handleUpdateHotelBookingStatus(booking.id, booking.status || 'Confirmed', e.target.value)}
                                          placeholder="101"
                                          className="w-20 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold text-slate-900 text-center outline-none"
                                        />
                                      </div>

                                      <div className="text-right">
                                        <span className="text-[9px] text-slate-400 block font-medium">Pay on Arrival</span>
                                        <span className="text-sm font-black text-slate-900">₹{booking.totalAmount}</span>
                                      </div>
                                    </div>

                                    {/* Compact Action Buttons */}
                                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                                      <a
                                        href={`tel:+91${cleanPhone}`}
                                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                                      >
                                        <Phone className="w-3 h-3" />
                                        <span>Call</span>
                                      </a>

                                      <a
                                        href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(booking.guestName)},%20Regarding%20your%20stay%20pass%20%23${booking.id}%20at%20${encodeURIComponent(booking.hotelName || 'our hotel')},%20your%20room%20is%20ready.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[10px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                                      >
                                        <MessageSquare className="w-3 h-3 fill-white" />
                                        <span>WhatsApp</span>
                                      </a>

                                      {!isCheckedIn && !isCompleted && !isCancelled && (
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateHotelBookingStatus(booking.id, 'Checked-In (Active Stay)')}
                                          className="bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-[10px] py-1.5 px-2 rounded-lg border border-purple-200 transition-colors ml-auto cursor-pointer"
                                        >
                                          Check-In
                                        </button>
                                      )}

                                      {isCheckedIn && (
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateHotelBookingStatus(booking.id, 'Completed / Checked-Out')}
                                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-[10px] py-1.5 px-2 rounded-lg border border-emerald-200 transition-colors ml-auto cursor-pointer"
                                        >
                                          Check-Out
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteHotelBooking(booking.id)}
                                        className="text-slate-400 hover:text-rose-600 text-[10px] font-medium p-1 cursor-pointer"
                                        title="Delete Pass"
                                      >
                                        ✕
                                      </button>
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        VIEW 2: 💰 ROOM TARIFFS & PRICING (AC & NON-AC)
                       ══════════════════════════════════════════════════════ */}
                    {hotelDeskView === 'tariffs' && (
                      <div className="bg-white border border-purple-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                        <div>
                          <h4 className="font-black text-sm sm:text-base text-purple-950 flex items-center gap-2">
                            <span>💰</span> Configure AC &amp; Non-AC Room Tariffs
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Set hourly (3h, 6h, 12h) and night stay rates for your hotel. Customers pick AC or Non-AC online, and room numbers are allotted at your desk.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* ❄️ AC Room Tariff Box */}
                          <div className="bg-purple-50/50 border-2 border-purple-300/80 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">❄️</span>
                                <div>
                                  <h5 className="font-black text-sm text-purple-950">AC Room Tariff</h5>
                                  <span className="text-[10px] text-purple-800 font-bold">Air Conditioned Rooms</span>
                                </div>
                              </div>
                              <span className="text-[9px] bg-purple-900 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                                Popular
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              <div>
                                <label className="block text-[9px] text-purple-900 font-black uppercase text-center mb-1">3-Hour Rate</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={acRate3h}
                                    onChange={e => setAcRate3h(e.target.value)}
                                    className="w-full bg-white border border-purple-200 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-purple-950 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-purple-900 font-black uppercase text-center mb-1">6-Hour Rate</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={acRate6h}
                                    onChange={e => setAcRate6h(e.target.value)}
                                    className="w-full bg-white border border-purple-200 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-purple-950 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-purple-900 font-black uppercase text-center mb-1">12-Hour Rate</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={acRate12h}
                                    onChange={e => setAcRate12h(e.target.value)}
                                    className="w-full bg-white border border-purple-200 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-purple-950 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-amber-800 font-black uppercase text-center mb-1">Night Stay</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-amber-500">₹</span>
                                  <input
                                    type="number"
                                    value={acRateNight}
                                    onChange={e => setAcRateNight(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-amber-800 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 🌀 Non-AC Room Tariff Box */}
                          <div className="bg-slate-50/80 border-2 border-slate-300/80 rounded-2xl p-4.5 space-y-3.5 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">🌀</span>
                                <div>
                                  <h5 className="font-black text-sm text-slate-900">Non-AC Room Tariff</h5>
                                  <span className="text-[10px] text-slate-500 font-bold">Standard Fan Ventilated Rooms</span>
                                </div>
                              </div>
                              <span className="text-[9px] bg-slate-700 text-white px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                                Budget
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              <div>
                                <label className="block text-[9px] text-slate-600 font-black uppercase text-center mb-1">3-Hour Rate</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={nonAcRate3h}
                                    onChange={e => setNonAcRate3h(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-slate-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-600 font-black uppercase text-center mb-1">6-Hour Rate</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={nonAcRate6h}
                                    onChange={e => setNonAcRate6h(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-slate-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-600 font-black uppercase text-center mb-1">12-Hour Rate</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-slate-400">₹</span>
                                  <input
                                    type="number"
                                    value={nonAcRate12h}
                                    onChange={e => setNonAcRate12h(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-slate-900 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-amber-800 font-black uppercase text-center mb-1">Night Stay</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-2 text-xs font-black text-amber-500">₹</span>
                                  <input
                                    type="number"
                                    value={nonAcRateNight}
                                    onChange={e => setNonAcRateNight(e.target.value)}
                                    className="w-full bg-white border border-amber-300 rounded-xl pl-6 pr-2 py-2 text-xs font-black text-amber-800 text-center outline-none focus:border-purple-600 shadow-2xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Save Tariffs Button */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={handleSaveFullHotelListing}
                            className="w-full sm:w-auto bg-purple-900 hover:bg-purple-950 text-white font-black text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                          >
                            <span>✓ Save &amp; Publish Room Tariffs</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        VIEW 3: 🏨 HOTEL PROFILE & PHOTOS
                       ══════════════════════════════════════════════════════ */}
                    {hotelDeskView === 'profile' && (
                      <form onSubmit={handleSaveFullHotelListing} className="bg-white border border-purple-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                        <div>
                          <h4 className="font-black text-sm sm:text-base text-purple-950 flex items-center gap-2">
                            <span>🏨</span> Hotel Basic Info, Gallery &amp; Policies
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Update your hotel listing details, photo gallery, and couple-friendly / safety tags.
                          </p>
                        </div>

                        {/* 1. Basic Info */}
                        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                          <h5 className="text-xs font-black text-purple-950 uppercase tracking-wider">1. Basic Information</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div className="sm:col-span-2 lg:col-span-1">
                              <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Hotel Name *</label>
                              <input
                                type="text"
                                required
                                value={hotelProfileName}
                                onChange={e => setHotelProfileName(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Category</label>
                              <select
                                value={hotelProfileCategory}
                                onChange={e => setHotelProfileCategory(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-600 cursor-pointer"
                              >
                                <option value="Luxury Resort">Luxury Resort</option>
                                <option value="Executive / 3-Star">Executive / 3-Star</option>
                                <option value="Boutique Residency">Boutique Residency</option>
                                <option value="Budget Lodge">Budget Lodge</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Area in Boisar *</label>
                              <input
                                type="text"
                                required
                                value={hotelProfileArea}
                                onChange={e => setHotelProfileArea(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-600"
                              />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                              <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Full Address &amp; Landmark</label>
                              <input
                                type="text"
                                value={hotelProfileAddress}
                                onChange={e => setHotelProfileAddress(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-600"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">Reception Phone Number *</label>
                              <input
                                type="tel"
                                required
                                value={hotelProfilePhone}
                                onChange={e => setHotelProfilePhone(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-600 font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] text-slate-600 font-black uppercase tracking-wider mb-1">WhatsApp Booking Number</label>
                              <input
                                type="tel"
                                value={hotelProfileWhatsapp}
                                onChange={e => setHotelProfileWhatsapp(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-600 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Photo Gallery */}
                        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                              2. Hotel Photo Gallery ({hotelDashboardGallery.length} Photos)
                            </h5>
                            <span className="text-[10px] text-slate-400 font-semibold">JPG, PNG supported</span>
                          </div>

                          <label className="border-2 border-dashed border-purple-300 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-50/80 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleHotelDashboardFileUpload}
                              className="hidden"
                            />
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center text-lg">
                              📤
                            </div>
                            <div>
                              <p className="text-xs font-black text-purple-950">+ Click to Choose &amp; Upload Hotel Photos</p>
                              <p className="text-[10px] text-slate-500 font-medium">Select photos of rooms, building, and reception</p>
                            </div>
                          </label>

                          {hotelDashboardGallery.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
                              {hotelDashboardGallery.map((photoUrl, idx) => (
                                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-4/3 border border-purple-200 shadow-2xs">
                                  <img
                                    src={photoUrl}
                                    alt={`Hotel photo ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDashboardGalleryPhoto(idx)}
                                    className="absolute top-1 right-1 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black transition-colors cursor-pointer"
                                    title="Delete Photo"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 3. Safety & Location Tags */}
                        <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                          <h5 className="text-xs font-black text-purple-950 uppercase tracking-wider">3. Safety &amp; Location Tags</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <label className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-purple-400 transition-colors">
                              <input
                                type="checkbox"
                                checked={hotelProfileCoupleFriendly}
                                onChange={e => setHotelProfileCoupleFriendly(e.target.checked)}
                                className="w-4 h-4 text-purple-900 rounded cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-800">👥 Couples Welcome (18+)</span>
                            </label>

                            <label className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-purple-400 transition-colors">
                              <input
                                type="checkbox"
                                checked={hotelProfileLocalId}
                                onChange={e => setHotelProfileLocalId(e.target.checked)}
                                className="w-4 h-4 text-purple-900 rounded cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-800">🪪 Accepts Local ID</span>
                            </label>

                            <label className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-purple-400 transition-colors">
                              <input
                                type="checkbox"
                                checked={hotelProfileNearStation}
                                onChange={e => setHotelProfileNearStation(e.target.checked)}
                                className="w-4 h-4 text-purple-900 rounded cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-800">🚆 Near Boisar Station</span>
                            </label>

                            <label className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-purple-400 transition-colors">
                              <input
                                type="checkbox"
                                checked={hotelProfileNearMidc}
                                onChange={e => setHotelProfileNearMidc(e.target.checked)}
                                className="w-4 h-4 text-purple-900 rounded cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-800">🏭 Near Tarapur MIDC</span>
                            </label>
                          </div>
                        </div>

                        {/* Save Profile Button */}
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            className="w-full sm:w-auto bg-purple-900 hover:bg-purple-950 text-white font-black text-xs px-8 py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                          >
                            <span>✓ Save &amp; Publish Hotel Profile</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* ══════════════════════════════════════════════════════
                        VIEW 4: SETTLEMENTS & PAYOUTS (90% TO HOTEL OWNER)
                       ══════════════════════════════════════════════════════ */}
                    {hotelDeskView === 'payouts' && (() => {
                      const totalGross = hotelBookingsList.reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0);
                      const platformCut = Math.round(totalGross * 0.10); // 10% platform fee
                      const netPayable = totalGross - platformCut; // 90% to hotel
                      const totalSettled = hotelBookingsList
                        .filter(b => (b.payoutStatus || '').toLowerCase() === 'settled')
                        .reduce((acc, b) => acc + Math.round((Number(b.totalAmount) || 0) * 0.90), 0);
                      const pendingPayout = Math.max(0, netPayable - totalSettled);

                      return (
                        <div className="space-y-4">
                          {/* 4 Financial Stat Counters */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-2xs">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Gross Bookings</span>
                              <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">₹{totalGross.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">Paid by online guests</span>
                            </div>

                            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-2xs">
                              <span className="text-[9px] font-bold text-teal-700 uppercase tracking-wider block">Platform Fee (10%)</span>
                              <span className="text-lg sm:text-xl font-black text-teal-700 mt-0.5 block">₹{platformCut.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-teal-600 font-semibold mt-0.5 block">Majh Boisar commission</span>
                            </div>

                            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-2xs">
                              <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Settled to Bank</span>
                              <span className="text-lg sm:text-xl font-black text-emerald-600 mt-0.5 block">₹{totalSettled.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Dispatched via UPI/NEFT</span>
                            </div>

                            <div className="bg-white border border-amber-200 bg-amber-50/40 p-3.5 rounded-2xl shadow-2xs">
                              <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">Pending Payout</span>
                              <span className="text-lg sm:text-xl font-black text-amber-900 mt-0.5 block">₹{pendingPayout.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">Queued for transfer</span>
                            </div>
                          </div>

                          {/* Bank & UPI Details Card */}
                          <div className="bg-white border border-emerald-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-lg">
                                  🏦
                                </div>
                                <div>
                                  <h4 className="font-black text-sm text-slate-900">Your Bank &amp; UPI Payout Settings</h4>
                                  <p className="text-[11px] text-slate-500 font-medium">Majh Boisar Admin will send your 90% hotel booking settlements to this account</p>
                                </div>
                              </div>
                              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full">
                                {hotelPayoutUpi || hotelPayoutAccNo ? '🟢 Payout Details Configured' : '⚠️ Action Required'}
                              </span>
                            </div>

                            <form onSubmit={handleSaveHotelPayoutDetails} className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                                    ⚡ UPI ID (GPay / PhonePe / Paytm) *
                                  </label>
                                  <input
                                    type="text"
                                    value={hotelPayoutUpi}
                                    onChange={e => setHotelPayoutUpi(e.target.value)}
                                    placeholder="e.g. hotelshanti@okhdfcbank"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                                    👤 Account Holder Name
                                  </label>
                                  <input
                                    type="text"
                                    value={hotelPayoutHolder}
                                    onChange={e => setHotelPayoutHolder(e.target.value)}
                                    placeholder="e.g. Shanti Hospitality LLP"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                                    🏛️ Bank Name
                                  </label>
                                  <input
                                    type="text"
                                    value={hotelPayoutBank}
                                    onChange={e => setHotelPayoutBank(e.target.value)}
                                    placeholder="e.g. HDFC Bank, Boisar Branch"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                                    🔢 Bank Account Number
                                  </label>
                                  <input
                                    type="text"
                                    value={hotelPayoutAccNo}
                                    onChange={e => setHotelPayoutAccNo(e.target.value)}
                                    placeholder="e.g. 50200012345678"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none font-mono"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                                    🏢 IFSC Code
                                  </label>
                                  <input
                                    type="text"
                                    value={hotelPayoutIfsc}
                                    onChange={e => setHotelPayoutIfsc(e.target.value.toUpperCase())}
                                    placeholder="e.g. HDFC0001234"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none font-mono uppercase"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                                <span className="text-[11px] text-slate-500 font-medium">
                                  💡 Settlements are processed directly by Majh Boisar Admin to your saved UPI / Bank Account.
                                </span>
                                <button
                                  type="submit"
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-98 shrink-0"
                                >
                                  💾 Save Payout Account
                                </button>
                              </div>
                            </form>
                          </div>

                          {/* Settlement Ledger Table */}
                          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <h4 className="font-black text-sm text-slate-900">Hotel Bookings Payout Ledger</h4>
                                <p className="text-[11px] text-slate-500 font-medium">Live breakdown of guest bookings, platform fee, and payout settlement status</p>
                              </div>
                              <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-1 rounded-xl">
                                {hotelBookingsList.length} Total Records
                              </span>
                            </div>

                            {hotelBookingsList.length === 0 ? (
                              <div className="py-8 text-center space-y-1">
                                <span className="text-2xl block">🏨</span>
                                <p className="text-xs font-black text-slate-700">No hotel booking payouts recorded yet.</p>
                                <p className="text-[11px] text-slate-400">When online guests book rooms, their payout settlements will show here.</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-slate-100">
                                {hotelBookingsList.map((booking) => {
                                  const total = Number(booking.totalAmount) || 0;
                                  const cut = Math.round(total * 0.10);
                                  const net = total - cut;
                                  const isSettled = (booking.payoutStatus || '').toLowerCase() === 'settled';

                                  return (
                                    <div key={booking.id} className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-black text-slate-900 text-sm">#{booking.id}</span>
                                          <span className="bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-black px-2 py-0.5 rounded-md">
                                            {booking.roomType || 'Room'}
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                                          <span>Guest: <strong>{booking.guestName}</strong> ({booking.guestPhone})</span>
                                          <span>•</span>
                                          <span>Stay: <strong>{booking.checkInDate || booking.slot || 'Booked'}</strong></span>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                                        <div className="text-left sm:text-right space-y-0.5">
                                          <div className="text-xs font-black text-slate-900">
                                            ₹{net.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-bold">(Net Payout)</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 font-medium">
                                            Paid: ₹{total} • Majh Boisar Cut (10%): ₹{cut}
                                          </div>
                                        </div>

                                        <div>
                                          {isSettled ? (
                                            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-xl">
                                              <span>✅ Settled</span>
                                              {booking.payoutRef && <span className="text-[9px] text-emerald-600 font-bold font-mono">({booking.payoutRef})</span>}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-xl">
                                              <span>⏳ Pending Admin Settlement</span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                )}

                {/* Subtab Content: Analytics Insights */}
                {activeSubTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Plan badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700">
                        📊 Analytics — Available on all plans
                      </span>
                      {currentPlan === 'Free' && (
                        <span className="text-[9px] text-slate-400 font-semibold">Upgrade to Pro for Weekly Charts</span>
                      )}
                    </div>

                    {/* Stats Counters Grid (Mobile-friendly 2x2 grid) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                      {[
                        { label: 'Profile Views', val: business.views, icon: <Eye className="w-4 h-4 text-teal-600" /> },
                        { label: 'Phone Clicks', val: business.phoneClicks, icon: <Phone className="w-4 h-4 text-emerald-600" /> },
                        { label: 'WhatsApp Clicks', val: business.whatsappClicks, icon: <MessageSquare className="w-4 h-4 text-teal-500" /> },
                        { label: 'Verified Leads', val: business.leads.length, icon: <ClipboardCheck className="w-4 h-4 text-rose-500" /> }
                      ].map((stat, i) => (
                        <div key={i} className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs flex items-center justify-between">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">{stat.label}</p>
                            <h4 className="text-base sm:text-lg font-black text-slate-800 mt-0.5">{stat.val}</h4>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                            {stat.icon}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Analytical Charts — Pro only */}
                    {currentPlan === 'Pro' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Views Chart */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                            <span>Traffic Breakdown (Views & Clicks)</span>
                          </h3>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={viewsChartData}>
                                <defs>
                                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="views" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Page Views" />
                                <Area type="monotone" dataKey="clicks" stroke="#f43f5e" strokeWidth={2} fill="transparent" name="CTAs Clicks" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Ratings Distribution progress breakdown */}
                        <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                          <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                              <span>Ratings Distribution</span>
                            </h3>
                            <p className="text-[10px] text-slate-405 mb-4">Breakdown of customer star ratings score.</p>

                            <div className="space-y-2.5 text-xs text-slate-700">
                              {[
                                { star: '5 Star', count: star5 },
                                { star: '4 Star', count: star4 },
                                { star: '3 Star', count: star3 },
                                { star: '2 Star', count: star2 },
                                { star: '1 Star', count: star1 }
                              ].map((row, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="w-12 font-bold whitespace-nowrap">{row.star}</span>
                                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-amber-450 rounded-full"
                                      style={{ width: `${(row.count / totalReviewsCount) * 100}%` }}
                                    />
                                  </div>
                                  <span className="w-5 text-right font-black">{row.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-105 pt-3.5 mt-3 text-[10px] text-slate-405 leading-relaxed">
                            Total customer reviews logged:{' '}
                            <strong className="text-slate-800 font-extrabold text-xs">{business.reviews.length} ratings</strong>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                        <span className="text-2xl shrink-0">📊</span>
                        <div>
                          <p className="text-xs font-black text-amber-800">Full Analytics Charts — Pro Plan (₹149/mo)</p>
                          <p className="text-[10px] text-amber-605 font-semibold mt-1 leading-relaxed">
                            Your <strong>{currentPlan}</strong> plan includes basic view/click counts above.
                            Upgrade to <strong>Pro</strong> to unlock Traffic Charts, Ratings breakdown, and Weekly performance reports.
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveSubTab('subscription')}
                            className="mt-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-xl cursor-pointer hover:shadow-md transition-all"
                          >
                            Upgrade to Pro →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Subtab Content: Turf & Game Zone Booking Management System */}
                {activeSubTab === 'turf_bookings' && (
                  <div className="space-y-5 text-left">
                    {/* Notice & Counter Banner */}
                    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-purple-800/40">
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                          <Gamepad2 className="w-5 h-5 text-purple-400" />
                          <span>Turf &amp; Game Slot Booking Management System</span>
                        </h4>
                        <p className="text-xs text-purple-200 font-medium mt-1">
                          Manage walk-in bookings, custom slot surge pricing (₹150 - ₹300), lock/unlock slots, and edit customer details.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-purple-600/80 text-white text-xs font-black px-3 py-1.5 rounded-xl text-center border border-purple-400/30">
                          Total Records: {turfBookingsList.length}
                        </span>
                      </div>
                    </div>

                    {/* ── SECTION 1: ➕ RECORD OFFLINE / WALK-IN BOOKING ── */}
                    <form onSubmit={handleAddManualTurfBooking} className="bg-white border border-purple-200 p-4 sm:p-5 rounded-2xl space-y-4 text-xs shadow-sm">
                      <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
                        <p className="font-black text-xs text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-purple-600" /> 1. Add Booking Manually (Walk-in Customer)
                        </p>
                        <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                          Custom Amount Allowed 💰
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Customer / Player Name *</label>
                          <input
                            type="text"
                            required
                            value={manualPlayerName}
                            onChange={e => setManualPlayerName(e.target.value)}
                            placeholder="e.g. Rahul Patil"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Mobile Number *</label>
                          <input
                            type="text"
                            value={manualPlayerPhone}
                            onChange={e => setManualPlayerPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 9823456789 (10-digits)"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Category</label>
                          <select
                            value={manualCategory}
                            onChange={e => setManualCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option value="VR & Arcade Gaming">VR &amp; Arcade Gaming</option>
                            <option value="Snooker">Snooker &amp; Pool</option>
                            <option value="Box Cricket">Box Cricket Turf</option>
                            <option value="Football">Football Turf</option>
                            <option value="Badminton">Badminton Court</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">PS5 Station / Screen</label>
                          <select
                            value={manualStation}
                            onChange={e => setManualStation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option value="Screen 1 (PS5 Console #1)">Screen 1 (PS5 Console #1)</option>
                            <option value="Screen 2 (PS5 Console #2)">Screen 2 (PS5 Console #2)</option>
                            <option value="Screen 3 (VR Sim #3)">Screen 3 (VR Sim #3)</option>
                            <option value="Main Turf Court A">Main Turf Court A</option>
                            <option value="Turf Court B">Turf Court B</option>
                            <option value="Badminton Court #1">Badminton Court #1</option>
                            <option value="Snooker Table #1">Snooker Table #1</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Booking Date</label>
                          <input
                            type="text"
                            value={manualDate}
                            onChange={e => setManualDate(e.target.value)}
                            placeholder="e.g. Today / 27th July"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Time Slot</label>
                          <select
                            value={manualSlot}
                            onChange={e => {
                              const slot = e.target.value;
                              setManualSlot(slot);
                              const screenKey = `${selectedScreen}_${slot}`;
                              if (slotPrices[screenKey] || slotPrices[slot]) {
                                setManualRate(slotPrices[screenKey] || slotPrices[slot]);
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                          >
                            {['08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM', '09:00 PM - 10:00 PM'].map(slot => {
                              const screenKey = `${selectedScreen}_${slot}`;
                              const price = slotPrices[screenKey] || slotPrices[slot] || '₹200';
                              return (
                                <option key={slot} value={slot}>
                                  {slot} ({price})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Duration</label>
                          <select
                            value={manualDuration}
                            onChange={e => setManualDuration(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                          >
                            <option value="1 Hour">1 Hour</option>
                            <option value="2 Hours">2 Hours</option>
                            <option value="3 Hours">3 Hours</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] text-purple-900 font-black uppercase tracking-wider mb-1">Final Amount (Custom Price) *</label>
                          <input
                            type="text"
                            required
                            value={manualRate}
                            onChange={e => setManualRate(e.target.value)}
                            placeholder="e.g. ₹250 (Editable)"
                            className="w-full bg-purple-50/70 border border-purple-300 rounded-xl px-3 py-2 text-xs font-black text-purple-900 outline-none focus:border-purple-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold">
                          💡 Owner can enter any custom discounted price manually at booking time.
                        </p>
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Record &amp; Save Booking</span>
                        </button>
                      </div>
                    </form>

                    {/* ── SECTION 2: 🏷️ HOURLY SLOT PRICING & CONTROL MANAGER (MULTI-SCREEN) ── */}
                    <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div>
                          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-purple-600" /> 2. Slot Control &amp; Surge Pricing Manager
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                            Manage custom prices &amp; block/unblock slots independently for each screen console.
                          </p>
                        </div>

                        {/* 🎮 3-Screen Selection Tabs */}
                        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 shrink-0">
                          {(['Screen 1', 'Screen 2', 'Screen 3'] as const).map(scr => (
                            <button
                              key={scr}
                              type="button"
                              onClick={() => {
                                setSelectedScreen(scr);
                                setManualStation(`${scr} (PS5 OLED)`);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${selectedScreen === scr
                                  ? 'bg-purple-700 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                              <span>🎮 {scr}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                        {['08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM', '09:00 PM - 10:00 PM'].map((slot) => {
                          const screenKey = `${selectedScreen}_${slot}`;
                          const isClosed = slotControls[screenKey] === 'Closed';
                          const isBooked = turfBookingsList.some(b => b.timeSlot === slot && (b.station || '').includes(selectedScreen) && b.status !== 'Cancelled');
                          const currentPrice = slotPrices[screenKey] || slotPrices[slot] || '₹200';

                          return (
                            <div
                              key={slot}
                              className={`p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between space-y-2 ${isClosed
                                  ? 'bg-slate-100 border-slate-300 opacity-80'
                                  : isBooked
                                    ? 'bg-rose-50/60 border-rose-200'
                                    : 'bg-purple-50/40 border-purple-200 hover:border-purple-400'
                                }`}
                            >
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-black">
                                  <span className="text-slate-700 truncate">{slot.split(' ')[0]} {slot.split(' ')[1]}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-black ${isClosed
                                      ? 'bg-slate-800 text-white'
                                      : isBooked
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-emerald-600 text-white'
                                    }`}>
                                    {isClosed ? '🔒 Closed' : isBooked ? '🔴 Booked' : '🟢 Open'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{slot}</p>
                                <span className="text-[8.5px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                  {selectedScreen}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newP = prompt(`Set custom slot rate for ${slot}:`, currentPrice);
                                    if (newP && newP.trim()) {
                                      handleUpdateSlotPrice(slot, newP.trim());
                                    }
                                  }}
                                  className="text-[11px] font-black text-purple-900 bg-white hover:bg-purple-100 border border-purple-200 px-2 py-1 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                                  title="Click to edit slot rate"
                                >
                                  <span>{currentPrice}</span>
                                  <Edit className="w-3 h-3 text-purple-600" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleSlotControl(slot)}
                                  className={`p-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${isClosed
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                    }`}
                                  title={isClosed ? 'Unblock Slot' : 'Block Slot'}
                                >
                                  {isClosed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── SECTION 3: 📋 BOOKED SLOTS & PLAYER RECORDS MANAGER ── */}
                    <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">3. Player Reservations &amp; Booking Management</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Filter, search, edit details, or cancel player slot reservations.</p>
                        </div>

                        {/* Filter Tabs & Search */}
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                            <input
                              type="text"
                              value={turfSearchQuery}
                              onChange={e => setTurfSearchQuery(e.target.value)}
                              placeholder="Search player / phone..."
                              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-purple-400 w-44"
                            />
                          </div>

                          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                            {(['All', 'Confirmed', 'Attended', 'Cancelled'] as const).map(flt => (
                              <button
                                key={flt}
                                type="button"
                                onClick={() => setTurfBookingFilter(flt)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${turfBookingFilter === flt ? 'bg-purple-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                  }`}
                              >
                                {flt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bookings List Cards */}
                      <div className="space-y-3">
                        {(() => {
                          const filtered = turfBookingsList.filter(b => {
                            const q = turfSearchQuery.toLowerCase();
                            const matchesSearch = !q || (b.userName || '').toLowerCase().includes(q) || (b.userPhone || '').includes(q) || (b.refCode || '').toLowerCase().includes(q) || (b.station || '').toLowerCase().includes(q);
                            if (!matchesSearch) return false;

                            if (turfBookingFilter === 'Confirmed') return b.status === 'Confirmed';
                            if (turfBookingFilter === 'Attended') return b.status === 'Attended / Visited';
                            if (turfBookingFilter === 'Cancelled') return b.status === 'Cancelled';
                            return true;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500">
                                <p className="text-xs font-bold">No slot bookings match current filter.</p>
                              </div>
                            );
                          }

                          return filtered.map(b => (
                            <div
                              key={b.id}
                              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:border-purple-300 transition-all shadow-2xs"
                            >
                              <div className="space-y-1.5 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded">
                                    {b.refCode}
                                  </span>
                                  {b.station && (
                                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                                      🎮 {b.station}
                                    </span>
                                  )}
                                  <span className="bg-purple-100 text-purple-900 text-[9px] font-black px-2 py-0.5 rounded">
                                    {b.category}
                                  </span>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded ${b.status === 'Attended / Visited'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.status === 'Cancelled'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-900'
                                    }`}>
                                    {b.status === 'Attended / Visited' ? '✓ ATTENDED / VISITED' : b.status === 'Cancelled' ? '🚫 CANCELLED' : '⏳ CONFIRMED UPCOMING'}
                                  </span>
                                </div>

                                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                                  {b.venueName}
                                </h4>

                                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-bold">
                                  <span>👤 Player: <strong className="text-slate-900">{b.userName}</strong> ({b.userPhone})</span>
                                  <span>📅 Date: <strong className="text-slate-800">{b.bookingDate}</strong></span>
                                  <span>⏰ Slot: <strong className="text-purple-700">{b.timeSlot}</strong> ({b.duration || '1 Hr'})</span>
                                  <span>💰 Final Rate: <strong className="text-emerald-700 font-black">{b.estRate}</strong></span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                                {b.status !== 'Cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleTurfAttendance(b.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center gap-1 ${b.status === 'Attended / Visited'
                                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                        : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                      }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{b.status === 'Attended / Visited' ? 'Attended' : 'Mark Visited'}</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditBookingModal(b)}
                                  className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                  title="Edit Booking Details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                {b.status !== 'Cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() => handleCancelTurfBooking(b.id)}
                                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                                    title="Cancel Reservation"
                                  >
                                    <span>Cancel</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteTurfBooking(b.id)}
                                  className="p-1.5 rounded-xl bg-white text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtab Content: Lead Pipeline */}
                {activeSubTab === 'leads' && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
                    {!canAccessLeadInbox ? (
                      <UpgradeNudge feature="Lead Pipeline Inbox" requiredPlan="Basic (₹99/mo) or Pro (₹149/mo)" />
                    ) : (
                      <>


                        {/* Leads Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2 text-left">
                          <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Customer Inquiries &amp; Leads</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage customer quotations, callbacks and requests.</p>
                          </div>

                          <button
                            onClick={() => {
                              alert(`Compiling spreadsheet...\n\nSuccessfully generated: ${business.name}-leads-report.csv`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-700" />
                            <span>Export CSV</span>
                          </button>
                        </div>

                        {/* Hotel Bookings Quick Link if hotel */}
                        {hotelBookingsList.length > 0 && (
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-left">
                            <div className="flex items-center gap-2">
                              <span className="text-base">🏨</span>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">
                                  {hotelBookingsList.length} Hotel Bookings Received
                                </h4>
                                <p className="text-[10px] text-slate-500 font-medium">Manage check-ins, room assignment &amp; tariffs.</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveSubTab('hotel_bookings')}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
                            >
                              Open Register →
                            </button>
                          </div>
                        )}

                        {business.leads.length === 0 && hotelBookingsList.length === 0 ? (
                          <div className="text-center py-10 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                            <ClipboardCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs text-slate-600 font-bold">No verified enquiries received yet.</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Enquiries from WhatsApp &amp; your business listing will appear here.</p>
                          </div>
                        ) : (
                          <div className="space-y-2.5 text-left">
                            {/* Render Clean Hotel Booking Summary cards if needed */}
                            {hotelBookingsList.map((hBooking) => (
                              <div key={hBooking.id} className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-slate-900 text-xs">{hBooking.guestName}</h4>
                                    <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-purple-50 text-purple-900 border border-purple-200 font-mono">
                                      #{hBooking.id}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">{hBooking.createdAt ? hBooking.createdAt.split(',')[0] : 'Today'}</span>
                                  </div>

                                  <div className="flex items-center gap-2 text-slate-600 text-[11px] flex-wrap">
                                    <span className="font-mono text-slate-800 font-bold">+91 {hBooking.guestPhone}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{hBooking.roomCategory || 'AC Room'} ({hBooking.timeSlot || '3h'})</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-emerald-700 font-bold">₹{hBooking.totalAmount} (Pay on Arrival)</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <a
                                    href={`tel:${hBooking.guestPhone}`}
                                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1 text-[10px]"
                                  >
                                    <Phone className="w-3 h-3" /> Call
                                  </a>
                                  <a
                                    href={`https://wa.me/91${hBooking.guestPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${hBooking.guestName}, this is regarding your booking #${hBooking.id} at ${hBooking.hotelName}.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1 text-[10px]"
                                  >
                                    <MessageSquare className="w-3 h-3 fill-white" /> WhatsApp
                                  </a>
                                </div>
                              </div>
                            ))}
                            {business.leads.map((lead) => (
                              <div key={lead.id} className="py-4.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-sm text-slate-850">{lead.customerName}</h4>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${lead.status === 'Won'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : lead.status === 'Lost'
                                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                                      }`}>
                                      {lead.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                  </div>

                                  <div className="space-y-1">
                                    <p className="text-slate-600"><strong className="font-semibold text-slate-700">Phone:</strong> {lead.customerPhone} {lead.customerEmail && `• Email: ${lead.customerEmail}`}</p>
                                    <p className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-555 leading-relaxed font-light">
                                      <strong className="font-semibold text-slate-600 block mb-0.5 text-[10px] uppercase">Enquiry Query:</strong>
                                      "{lead.query}"
                                    </p>
                                  </div>

                                  {/* Private Note Section */}
                                  <div className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-lg max-w-xl">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                      <span className="text-[9px] text-amber-800 font-extrabold uppercase tracking-wide">Private Merchant Notes</span>
                                      {editingLeadId === lead.id ? (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => handleSaveLeadNote(lead.id)}
                                            className="text-[10px] text-emerald-650 hover:underline font-bold"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => setEditingLeadId(null)}
                                            className="text-[10px] text-slate-500 hover:underline font-bold"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setEditingLeadId(lead.id);
                                            setLeadNoteText(lead.notes || '');
                                          }}
                                          className="text-[10px] text-teal-655 hover:underline font-bold"
                                        >
                                          Edit Notes
                                        </button>
                                      )}
                                    </div>

                                    {editingLeadId === lead.id ? (
                                      <input
                                        type="text"
                                        value={leadNoteText}
                                        onChange={(e) => setLeadNoteText(e.target.value)}
                                        placeholder="Log customer callback status or pricing notes..."
                                        className="w-full bg-white border border-slate-250 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                                      />
                                    ) : (
                                      <p className="text-[11px] text-slate-600 italic">
                                        {lead.notes ? `"${lead.notes}"` : 'No custom notes logged. Tap edit to store quotation status.'}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Pipeline Status Actions */}
                                <div className="flex items-center gap-1.5 shrink-0 self-start md:self-auto">
                                  <button
                                    onClick={() => handleUpdateLeadStatus(lead.id, 'Won')}
                                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-250 rounded-lg font-bold transition-all cursor-pointer"
                                  >
                                    Mark Won
                                  </button>
                                  <button
                                    onClick={() => handleUpdateLeadStatus(lead.id, 'Lost')}
                                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded-lg font-bold transition-all cursor-pointer"
                                  >
                                    Mark Lost
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Subtab Content: Catalog Manager */}
                {activeSubTab === 'catalog' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Products */}
                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <span>Product Inventory Catalog</span>
                          <span className="text-[10px] bg-slate-50 px-2 py-0.5 border border-slate-200 rounded text-teal-655 font-bold">{business.products.length} listed</span>
                        </h3>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                          Plan limit: {business.products.length}/{catalogLimit} products
                        </span>
                      </div>

                      {/* Add Product Form — gated by catalog limit */}
                      {business.products.length >= catalogLimit ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                          <span className="text-lg shrink-0">🔒</span>
                          <div>
                            <p className="text-xs font-black text-amber-800">Product limit reached ({catalogLimit} max on {currentPlan} plan)</p>
                            <p className="text-[10px] text-amber-600 mt-0.5">
                              {currentPlan === 'Free' ? 'Upgrade to Basic (₹99) for 10 products.' :
                                currentPlan === 'Basic' ? 'Upgrade to Pro (₹149) for 20 products.' : ''}
                            </p>
                            {currentPlan !== 'Pro' && (
                              <button onClick={() => setActiveSubTab('subscription')} className="mt-2 text-[10px] font-black text-teal-600 hover:underline cursor-pointer">View Plans →</button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleAddProduct} className="bg-slate-50 border border-slate-205 p-4 rounded-xl space-y-3.5 text-xs shadow-inner">
                          <p className="font-extrabold text-[10px] text-slate-550 uppercase tracking-wider">Add New Product</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Product Name</label>
                              <input
                                type="text"
                                required
                                value={prodName}
                                onChange={(e) => setProdName(e.target.value)}
                                placeholder="e.g. Copper Pipe"
                                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Price (INR)</label>
                              <input
                                type="number"
                                required
                                value={prodPrice}
                                onChange={(e) => setProdPrice(e.target.value)}
                                placeholder="e.g. 1500"
                                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Description (Optional)</label>
                            <input
                              type="text"
                              value={prodDesc}
                              onChange={(e) => setProdDesc(e.target.value)}
                              placeholder="e.g. Durable 1/2 inch copper coil tubing"
                              className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={addingProduct}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4 text-rose-455 animate-pulse" />
                            <span>{addingProduct ? 'Adding...' : 'Insert Product'}</span>
                          </button>
                        </form>
                      )}

                      {/* Products list */}
                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {business.products.length === 0 ? (
                          <p className="text-xs text-slate-455 py-4 text-center">No products listed.</p>
                        ) : (
                          business.products.map((prod) => (
                            <div key={prod.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs shadow-sm">
                              <div>
                                <h4 className="font-bold text-slate-800">{prod.name}</h4>
                                {prod.description && <p className="text-[10px] text-slate-500 leading-relaxed truncate max-w-sm mt-0.5">{prod.description}</p>}
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-extrabold text-teal-605">₹{prod.price}</span>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 rounded bg-white text-slate-455 hover:text-rose-500 transition-colors border border-slate-200 cursor-pointer shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <span>Services Catalog</span>
                          <span className="text-[10px] bg-slate-50 px-2 py-0.5 border border-slate-200 rounded text-teal-650 font-bold">{business.services.length} active</span>
                        </h3>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                          Plan limit: {business.services.length}/{catalogLimit} services
                        </span>
                      </div>

                      {/* Add Service Form — gated by catalog limit */}
                      {business.services.length >= catalogLimit ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                          <span className="text-lg shrink-0">🔒</span>
                          <div>
                            <p className="text-xs font-black text-amber-800">Service limit reached ({catalogLimit} max on {currentPlan} plan)</p>
                            <p className="text-[10px] text-amber-600 mt-0.5">
                              {currentPlan === 'Free' ? 'Upgrade to Basic (₹99) for 10 services.' :
                                currentPlan === 'Basic' ? 'Upgrade to Pro (₹149) for 20 services.' : ''}
                            </p>
                            {currentPlan !== 'Pro' && (
                              <button onClick={() => setActiveSubTab('subscription')} className="mt-2 text-[10px] font-black text-teal-600 hover:underline cursor-pointer">View Plans →</button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleAddService} className="bg-slate-50 border border-slate-205 p-4 rounded-xl space-y-3.5 text-xs shadow-inner">
                          <p className="font-extrabold text-[10px] text-slate-555 uppercase tracking-wider">Add New Service</p>
                          <div>
                            <label className="block text-[9px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Service Name</label>
                            <input
                              type="text"
                              required
                              value={srvName}
                              onChange={(e) => setSrvName(e.target.value)}
                              placeholder="e.g. General leakage consulting"
                              className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Consultation Price (Optional)</label>
                              <input
                                type="number"
                                value={srvPrice}
                                onChange={(e) => setSrvPrice(e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Est. Duration (e.g. '1 hour')</label>
                              <input
                                type="text"
                                value={srvDuration}
                                onChange={(e) => setSrvDuration(e.target.value)}
                                placeholder="e.g. 45 mins"
                                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={addingService}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4 text-rose-455 animate-pulse" />
                            <span>{addingService ? 'Adding...' : 'Insert Service'}</span>
                          </button>
                        </form>
                      )}

                      {/* Services List */}
                      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        {business.services.length === 0 ? (
                          <p className="text-xs text-slate-455 py-4 text-center">No services listed.</p>
                        ) : (
                          business.services.map((srv) => (
                            <div key={srv.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-4 text-xs shadow-sm">
                              <div>
                                <h4 className="font-bold text-slate-800">{srv.name}</h4>
                                {srv.duration && <p className="text-[10px] text-slate-550 mt-0.5">Est. Duration: {srv.duration}</p>}
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-bold text-slate-600">{srv.price ? `₹${srv.price}` : 'Free/Ask'}</span>
                                <button
                                  onClick={() => handleDeleteService(srv.id)}
                                  className="p-1.5 rounded bg-white text-slate-455 hover:text-rose-500 transition-colors border border-slate-200 cursor-pointer shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* 🏷️ Category-Specific Offers, Vehicle Hire & Turf Rates Manager */}
                    {(() => {
                      const bizCatLower = (business?.category || '').toLowerCase();
                      const isTurfBusiness = bizCatLower.includes('turf') || bizCatLower.includes('sport') || bizCatLower.includes('game') || bizCatLower.includes('gaming');
                      const isTravelBusiness = bizCatLower.includes('travel') || bizCatLower.includes('transport') || bizCatLower.includes('vehicle') || bizCatLower.includes('car') || bizCatLower.includes('tempo') || bizCatLower.includes('auto') || bizCatLower.includes('bus');

                      const defaultCatType = isTurfBusiness ? 'Turf / Game Zone' : isTravelBusiness ? 'Vehicle Hire' : 'Shop Offer';

                      return (
                        <div className={`lg:col-span-2 border p-5 rounded-2xl shadow-sm space-y-4 text-left ${isTurfBusiness ? 'bg-purple-50/70 border-purple-200' :
                            isTravelBusiness ? 'bg-blue-50/70 border-blue-200' :
                              'bg-amber-50/70 border-amber-200'
                          }`}>
                          <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-3 border-slate-200/60">
                            <div>
                              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <span>
                                  {isTurfBusiness ? '⚽ Turf & Game Slot Rate Manager' :
                                    isTravelBusiness ? '🚗 Vehicle Hire Rate Manager' :
                                      '🏷️ Shop Offers & Discount Deals Manager'}
                                </span>
                                <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded font-bold">{specialOffersList.length} active</span>
                              </h3>
                              <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                                {isTurfBusiness ? 'Publish slot timings, hourly rates, and features for Boisar Sports Turf Hub.' :
                                  isTravelBusiness ? 'Publish vehicle models, per-km rates, and min charges for Boisar Travels Hub.' :
                                    'Publish discount vouchers, coupon codes, and deal offers for Boisar Shop Offers Hub.'}
                              </p>
                            </div>
                          </div>

                          {/* Add Offer Form */}
                          <form onSubmit={handleAddSpecialOffer} className="bg-white/95 border border-slate-200 p-4 rounded-xl space-y-3 text-xs shadow-xs">
                            <p className="font-black text-[10px] text-slate-900 uppercase tracking-wider">
                              {isTurfBusiness ? '➕ Add New Turf Slot / Game Rate' :
                                isTravelBusiness ? '➕ Add Vehicle Hire Rate' :
                                  '➕ Create New Shop Discount Offer'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Listing Category</label>
                                <select
                                  value={offerCategory || defaultCatType}
                                  onChange={e => setOfferCategory(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                                >
                                  {isTurfBusiness ? (
                                    <option value="Turf / Game Zone">⚽ Turf / Game Zone Slot Rate</option>
                                  ) : isTravelBusiness ? (
                                    <option value="Vehicle Hire">🚗 Vehicle Hire / Per KM Rate</option>
                                  ) : (
                                    <option value="Shop Offer">🏷️ Shop Offer / Discount Deal</option>
                                  )}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                                  {isTurfBusiness ? 'Slot Name / Turf Name*' : isTravelBusiness ? 'Vehicle Model / Name*' : 'Offer Title*'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={offerTitle}
                                  onChange={e => setOfferTitle(e.target.value)}
                                  placeholder={isTurfBusiness ? 'e.g. Night Cricket Floodlight Slot' : isTravelBusiness ? 'e.g. Swift Dzire AC Sedan' : 'e.g. Flat 20% OFF on All Items'}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                                  {isTurfBusiness ? 'Hourly Rate*' : isTravelBusiness ? 'Per KM Rate / Min Charge*' : 'Discount Info*'}
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={offerDiscount}
                                  onChange={e => setOfferDiscount(e.target.value)}
                                  placeholder={isTurfBusiness ? 'e.g. ₹800 / Hour' : isTravelBusiness ? 'e.g. ₹12/km (Min ₹300)' : 'e.g. 20% OFF'}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Coupon / Ref Code</label>
                                <input
                                  type="text"
                                  value={offerCode}
                                  onChange={e => setOfferCode(e.target.value)}
                                  placeholder="e.g. BOISAR20 (Optional)"
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                                  {isTurfBusiness ? 'Slot Timing' : isTravelBusiness ? 'Location / Availability' : 'Valid Until'}
                                </label>
                                <input
                                  type="text"
                                  value={offerValidTill}
                                  onChange={e => setOfferValidTill(e.target.value)}
                                  placeholder={isTurfBusiness ? 'e.g. 6:00 PM - 10:00 PM' : isTravelBusiness ? 'e.g. Boisar Station West' : 'e.g. Valid till 31st Dec'}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                                />
                              </div>

                              <div className="flex items-end">
                                <button
                                  type="submit"
                                  className={`w-full text-white font-black text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all ${isTurfBusiness ? 'bg-purple-600 hover:bg-purple-700' :
                                      isTravelBusiness ? 'bg-blue-600 hover:bg-blue-700' :
                                        'bg-amber-500 hover:bg-amber-600 text-slate-950'
                                    }`}
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>{isTurfBusiness ? 'Publish Turf Slot' : isTravelBusiness ? 'Publish Vehicle Rate' : 'Publish Offer'}</span>
                                </button>
                              </div>
                            </div>
                          </form>

                          {/* Offers / Rates List */}
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {specialOffersList.length === 0 ? (
                              <p className="text-xs text-slate-500 py-3 text-center font-bold">
                                {isTurfBusiness ? 'No turf slots published yet. Use the form above to add one!' :
                                  isTravelBusiness ? 'No vehicle rates published yet. Use the form above to add one!' :
                                    'No shop discount deals published yet. Use the form above to add one!'}
                              </p>
                            ) : (
                              specialOffersList.map((off) => (
                                <div key={off.id} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs">
                                  <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded">{off.category}</span>
                                      <span className="text-[9px] text-slate-400 font-bold">{off.createdAt}</span>
                                    </div>
                                    <h4 className="font-black text-slate-900">{off.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">Rate/Discount: {off.discount} · Details: {off.validTill} {off.code !== 'N/A' && `· Code: ${off.code}`}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSpecialOffer(off.id)}
                                    className="p-1.5 rounded bg-white text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  </div>
                )}

                {/* Subtab Content: Property Enquiries */}
                {activeSubTab === 'property_leads' && (
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4 text-left">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Mail className="w-4 h-4 text-teal-650" />
                        <span>Real Estate Property Leads & Inquiries</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Direct inquiries submitted by buyers looking to purchase or rent properties.</p>
                    </div>

                    <div className="space-y-3">
                      {(() => {
                        const rawEnquiries = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_property_enquiries') || '[]' : '[]');
                        const myPropIds = new Set(userPropertyList.map((p: any) => p.id));
                        const list = rawEnquiries.filter((enq: any) => {
                          if (currentRole === 'Admin') return true;
                          if (myPropIds.has(enq.propertyId)) return true;
                          if (userPhoneDigits && enq.ownerPhone) {
                            const enqOwnerDigits = enq.ownerPhone.replace(/\D/g, '');
                            if (enqOwnerDigits && (enqOwnerDigits.endsWith(userPhoneDigits) || userPhoneDigits.endsWith(enqOwnerDigits))) return true;
                          }
                          return false;
                        });

                        if (list.length === 0) {
                          return (
                            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl border border-slate-200">
                              <Mail className="w-8 h-8 text-slate-300 mb-2" />
                              <p className="text-sm font-bold text-slate-700">No Property Enquiries Received Yet</p>
                              <p className="text-xs text-slate-400 mt-1">When buyers click "Send Enquiry" on listed properties, inquiries will appear here.</p>
                            </div>
                          );
                        }

                        return list.map((enq: any) => (
                          <div key={enq.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-teal-300 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-2.5 mb-2.5">
                              <div>
                                <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                  {enq.propertyName}
                                </span>
                                <p className="text-xs font-black text-teal-700 mt-1">{enq.propertyPrice}</p>
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold">{enq.createdAt}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">Buyer Name</span>
                                <span className="font-extrabold text-slate-800">{enq.senderName}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">Buyer Contact Phone</span>
                                <span className="font-extrabold text-teal-700">+91 {enq.senderPhone}</span>
                              </div>
                              <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-3">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold mb-1">Inquiry Message</span>
                                <p className="text-slate-700 leading-relaxed text-xs">{enq.message}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-200">
                              <button
                                onClick={() => alert(`Calling ${enq.senderName} at +91 ${enq.senderPhone}...`)}
                                className="bg-teal-650 hover:bg-teal-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                              >
                                <Phone className="w-3.5 h-3.5" /> Call Buyer
                              </button>
                              <button
                                onClick={() => {
                                  const msg = encodeURIComponent(`Hi ${enq.senderName}, regarding your inquiry for ${enq.propertyName}...`);
                                  window.open(`https://wa.me/91${enq.senderPhone}?text=${msg}`, '_blank');
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Message
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Subtab Content: Reviews Responder */}
                {activeSubTab === 'reviews' && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
                    <div>
                      <h3 className="text-xs font-black text-slate-855 uppercase tracking-wider">Customer Reviews</h3>
                      <p className="text-xs text-slate-500 mt-0.5">View all customer feedback. <strong className="text-teal-700">Reply</strong> requires Pro plan.</p>
                    </div>

                    {!canRespondToReviews && (
                      <UpgradeNudge feature="Respond to Customer Reviews" requiredPlan="Pro (₹149/mo)" />
                    )}

                    {business.reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-10 h-10 text-slate-350 mx-auto mb-3" />
                        <p className="text-xs text-slate-455">No customer reviews posted yet for this listing.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {business.reviews.map((rev) => (
                          <div key={rev.id} className="bg-slate-50 border border-slate-200 p-4.5 rounded-xl text-xs space-y-3.5 shadow-sm">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <strong className="text-slate-800 text-sm">{rev.userName}</strong>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-405' : 'text-slate-202'
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>

                            <p className="text-slate-655 font-light leading-relaxed italic">"{rev.comment}"</p>

                            {/* Reply Field — Pro only */}
                            {canRespondToReviews && (
                              <div className="border-t border-slate-105 pt-3.5 space-y-2">

                                {reviewReplies[rev.id] ? (
                                  <div className="bg-teal-50/50 border-l-2 border-teal-500 p-3 rounded-r-xl">
                                    <p className="font-extrabold text-teal-700 text-[10px] uppercase tracking-wide">Your Published Response</p>
                                    <p className="text-slate-705 mt-1">"{reviewReplies[rev.id]}"</p>
                                    <button
                                      onClick={() => {
                                        setActiveReplyId(rev.id);
                                        setReplyText(reviewReplies[rev.id]);
                                      }}
                                      className="text-[10px] font-bold text-teal-655 hover:underline mt-2 cursor-pointer"
                                    >
                                      Edit Response
                                    </button>
                                  </div>
                                ) : activeReplyId === rev.id ? (
                                  <div className="space-y-2">
                                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Write response</label>
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Thank the customer, clarify queries, or log business updates..."
                                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                                      rows={2}
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handlePostReply(rev.id)}
                                        className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-705 text-white font-bold rounded-lg cursor-pointer text-[10px]"
                                      >
                                        Submit Reply
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveReplyId(null);
                                          setReplyText('');
                                        }}
                                        className="px-3.5 py-1.5 border border-slate-250 bg-white text-slate-500 rounded-lg cursor-pointer text-[10px]"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveReplyId(rev.id);
                                      setReplyText('');
                                    }}
                                    className="text-xs font-bold text-teal-605 hover:underline cursor-pointer"
                                  >
                                    + Respond to customer review
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Subtab Content: Profile Settings Editor */}
                {activeSubTab === 'settings' && (
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-4">
                    <div>
                      <h3 className="text-xs font-black text-slate-855 uppercase tracking-wider">Edit Business Profile Details</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Update listing name, category, cover images, contact details, and locations visible to customers.</p>
                    </div>

                    {updateProfileSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Business Profile updated successfully!</span>
                      </div>
                    )}

                    {updateProfileError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-650 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <span>{updateProfileError}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 text-xs text-slate-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Business Name *</label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Category *</label>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
                          >
                            {categoriesList.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Description *</label>
                        <textarea
                          required
                          rows={3}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Address *</label>
                          <input
                            type="text"
                            required
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Location Area *</label>
                          <select
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 cursor-pointer"
                          >
                            {locationsList.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Phone Number *</label>
                          <input
                            type="text"
                            required
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                          <input
                            type="text"
                            required
                            value={editWhatsapp}
                            onChange={(e) => setEditWhatsapp(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Website URL</label>
                          <input
                            type="text"
                            value={editWebsite}
                            onChange={(e) => setEditWebsite(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Google Maps Link</label>
                          <input
                            type="text"
                            value={editGoogleMaps}
                            onChange={(e) => setEditGoogleMaps(e.target.value)}
                            placeholder="https://maps.google.com/..."
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Instagram URL</label>
                          <input
                            type="url"
                            value={editInstagram}
                            onChange={(e) => setEditInstagram(e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Facebook URL</label>
                          <input
                            type="url"
                            value={editFacebook}
                            onChange={(e) => setEditFacebook(e.target.value)}
                            placeholder="https://facebook.com/..."
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">YouTube URL</label>
                          <input
                            type="url"
                            value={editYoutube}
                            onChange={(e) => setEditYoutube(e.target.value)}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>

                      {/* Working Hours Day Builder */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-4 space-y-2 overflow-hidden">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <label className="text-[10px] sm:text-xs text-slate-600 font-black uppercase tracking-wider">🕐 Working Hours (per day)</label>
                          <button
                            type="button"
                            onClick={() => setEditSchedule(defaultEditSchedule())}
                            className="text-[8px] sm:text-[9px] text-slate-400 hover:text-teal-600 font-bold cursor-pointer shrink-0 ml-1"
                          >
                            Reset default
                          </button>
                        </div>

                        <div className="overflow-x-auto no-scrollbar space-y-1.5 -mx-1 px-1">
                          {Object.entries(editSchedule).map(([day, slot]) => (
                            <div key={day} className="flex items-center gap-1 sm:gap-2 min-w-[280px]">
                              <span className="text-[9px] sm:text-[10px] font-black text-slate-600 w-7 sm:w-8 shrink-0">{day}</span>
                              {slot.closed ? (
                                <span className="flex-1 text-[9px] sm:text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1 sm:py-1.5">Closed</span>
                              ) : (
                                <div className="flex items-center gap-1 flex-1 min-w-0">
                                  <input
                                    type="time"
                                    value={slot.open}
                                    onChange={(e) => setEditSchedule(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
                                    className="w-full min-w-0 bg-white border border-slate-200 rounded-lg px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                                  />
                                  <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold shrink-0">to</span>
                                  <input
                                    type="time"
                                    value={slot.close}
                                    onChange={(e) => setEditSchedule(prev => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
                                    className="w-full min-w-0 bg-white border border-slate-200 rounded-lg px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                                  />
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => setEditSchedule(prev => ({ ...prev, [day]: { ...prev[day], closed: !prev[day].closed } }))}
                                className={`text-[8px] sm:text-[9px] font-black px-2 py-1 sm:py-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${slot.closed
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                  }`}
                              >
                                {slot.closed ? 'Open' : 'Close'}
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[8px] sm:text-[9px] text-slate-400 font-semibold pt-1 leading-relaxed">
                          Current saved: <span className="text-slate-600">{editWorkingHours || 'Not set'}</span>
                        </p>
                      </div>

                      {/* Cover Image Uploader */}
                      <div className="space-y-2 text-left">
                        <label className="block text-[10px] text-slate-455 font-bold uppercase tracking-wider mb-1.5">Cover Image</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                          {editImage && (
                            <div className="h-16 w-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <img loading="lazy" decoding="async" src={editImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 w-full">
                            <input
                              type="file"
                              accept="image/*"
                              id="edit-profile-cover-upload"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const base64 = reader.result as string;
                                  if (base64) setEditImage(base64);
                                };
                                reader.readAsDataURL(file);
                                e.target.value = '';
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="edit-profile-cover-upload"
                              className="inline-block bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-sm text-slate-700"
                            >
                              📁 Choose Cover File
                            </label>
                            <p className="text-[9px] text-slate-400 font-semibold mt-1">Accepts local PNG/JPG images.</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Photos Uploader & Viewer */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-left">
                        <div className="flex justify-between items-center">
                          <div>
                            <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">📷 Gallery Photos</label>
                            <p className="text-[9px] text-slate-405 font-semibold mt-0.5">Showcase your shop inside profile view. Limit based on plan.</p>
                          </div>
                          <span className="bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-black px-2 py-0.5 rounded-full">
                            {editGalleryPhotos.length} / {planLimits[currentPlan]?.photos ?? 3} Uploaded
                          </span>
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          id="edit-profile-gallery-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const photosLimit = planLimits[currentPlan]?.photos ?? 3;
                            if (editGalleryPhotos.length >= photosLimit) {
                              alert(`Gallery photo limit reached! Your ${currentPlan} Plan only allows up to ${photosLimit} photos. Please upgrade to Pro for more space.`);
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              if (base64 && !editGalleryPhotos.includes(base64)) {
                                setEditGalleryPhotos(prev => [...prev, base64]);
                              }
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="edit-profile-gallery-upload"
                          className="flex border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-3 flex-col items-center justify-center cursor-pointer bg-white transition-colors text-center"
                        >
                          <span className="text-[10px] font-black text-slate-600 uppercase">📁 Add Photo to Gallery</span>
                        </label>

                        {editGalleryPhotos.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 pt-2">
                            {editGalleryPhotos.map((url, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                                <img loading="lazy" decoding="async" src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditGalleryPhotos(prev => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute top-1 right-1 h-5 w-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="btn-teal text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50"
                      >
                        {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Subtab Content: Subscription Manager */}
                {activeSubTab === 'subscription' && (
                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm space-y-4">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Choose Your Plan</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Simple pricing. No hidden charges. Upgrade anytime.</p>
                      </div>
                      <div className="bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl text-center">
                        <span className="text-[9px] text-teal-600 uppercase tracking-widest font-bold block">Current Plan</span>
                        <strong className="text-teal-700 font-extrabold uppercase text-xs">{business.subscription}</strong>
                      </div>
                    </div>

                    {/* KYC / Verified info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                      <span className="text-xl shrink-0">🪪</span>
                      <div>
                        <p className="text-xs font-black text-blue-800">✔️ Verified Badge — Sabko milega (Free bhi!)</p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5 leading-relaxed">
                          Verified badge <strong>kisi bhi plan</strong> mein milega — bas <strong>Profile Settings → KYC</strong> mein apna <strong>PAN Card</strong> upload karo. Hamari team 24–48 hrs mein review karegi.
                        </p>
                      </div>
                    </div>

                    {/* Plan comparison table style */}
                    {(() => {
                      const bizCatLower = (business?.category || '').toLowerCase();
                      const bizNameLower = (business?.name || '').toLowerCase();
                      const isHospital = bizCatLower.includes('hospital') || bizCatLower.includes('clinic') || bizCatLower.includes('doctor') || bizCatLower.includes('medical') || bizNameLower.includes('hospital') || bizNameLower.includes('clinic');
                      const isHotel = !isHospital && (
                        bizCatLower === 'hotel' ||
                        bizCatLower === 'hotels' ||
                        bizCatLower === 'resort' ||
                        bizCatLower === 'resorts' ||
                        bizCatLower.includes('hotel') ||
                        bizCatLower.includes('resort') ||
                        bizCatLower.includes('guest house') ||
                        bizCatLower.includes('lodge') ||
                        bizCatLower.includes('villa') ||
                        bizCatLower.includes('homestay') ||
                        bizNameLower.includes('hotel') ||
                        bizNameLower.includes('resort')
                      );

                      const hotelPlans = [
                        {
                          tier: 'Free',
                          price: '₹0',
                          sub: 'Always free',
                          highlight: false,
                          badge: null,
                          perks: [
                            { icon: '🏨', text: '3 Room & Property Photos' },
                            { icon: '🗺️', text: 'Listed in Boisar Hotels & Resorts' },
                            { icon: '📞', text: 'Direct Call & WhatsApp phone leads' },
                            { icon: '📊', text: 'Basic Views & Analytics' },
                            { icon: '🕐', text: 'Check-in / Check-out timing display' },
                            { icon: '🪪', text: 'Verified Hotel badge (via KYC)' },
                          ],
                          locked: [
                            'Direct Room Booking Engine',
                            'Hourly Stay / Couple Friendly badge',
                            '#1 Top Ranking in Hotels Search'
                          ]
                        },
                        {
                          tier: 'Starter',
                          price: '₹299',
                          sub: 'per month',
                          highlight: false,
                          badge: '✔️ Verified Hotel Partner',
                          perks: [
                            { icon: '📸', text: '15 HD Room, Pool & Amenities Photos' },
                            { icon: '🛎️', text: 'Direct Room Booking Engine (0% Commission)' },
                            { icon: '📱', text: 'Instant WhatsApp Booking Alerts' },
                            { icon: '💑', text: 'Hourly Stay / Couple Friendly Tag' },
                            { icon: '🗺️', text: 'Priority Ranking in Hotels & Resorts Search' },
                            { icon: '🍽️', text: 'Custom Room Tariffs & Restaurant Menu' },
                            { icon: '🪪', text: 'Verified Hotel Partner Badge' },
                          ],
                          locked: [
                            '#1 Top Gold Placement',
                            'Homepage Featured Spotlight Banner'
                          ]
                        },
                        {
                          tier: 'Pro',
                          price: '₹999',
                          sub: 'per month',
                          highlight: true,
                          badge: '⭐ Gold VIP Resort Badge',
                          perks: [
                            { icon: '👑', text: '⭐ #1 Top Priority Featured Ranking on Hotels Page' },
                            { icon: '🏨', text: 'Unlimited HD Gallery, Room Types & Tariffs' },
                            { icon: '🕐', text: 'Custom Hourly Slot & Day-Pass Booking Manager' },
                            { icon: '💬', text: 'Unlimited Direct WhatsApp & Instant Bookings' },
                            { icon: '🏠', text: 'Homepage Featured Spotlight Card (5 Lakh+ Views)' },
                            { icon: '⭐', text: 'Respond to Guest Reviews & Rating Badges' },
                            { icon: '⚡', text: '0% Commission & VIP Dedicated Account Manager' },
                            { icon: '🎉', text: 'Free Weekend / Pool Party Promotion Banner' },
                          ],
                          locked: []
                        }
                      ];

                      const merchantPlans = [
                        {
                          tier: 'Free',
                          price: '₹0',
                          sub: 'Always free',
                          highlight: false,
                          badge: null,
                          perks: [
                            { icon: '📸', text: '3 Gallery Photos' },
                            { icon: '📊', text: 'Analytics (Views, Clicks)' },
                            { icon: '🛒', text: '5 Catalog items (Products/Services)' },
                            { icon: '📞', text: 'Phone & WhatsApp leads' },
                            { icon: '🗺️', text: 'Listed in category search' },
                            { icon: '🕐', text: 'Working hours display' },
                            { icon: '🪪', text: 'Verified badge (via KYC)' },
                          ],
                          locked: [
                            'Trusted Badge',
                            'Review responses',
                          ]
                        },
                        {
                          tier: 'Starter',
                          price: '₹149',
                          sub: 'per month',
                          highlight: false,
                          badge: '✔️ Verified Partner',
                          perks: [
                            { icon: '📸', text: '10 Gallery & Room Photos' },
                            { icon: '📊', text: 'Live Analytics (Views, Leads, Calls)' },
                            { icon: '🛒', text: '15 Catalog / Room Tariffs' },
                            { icon: '📞', text: 'Direct WhatsApp & Phone Leads' },
                            { icon: '🗺️', text: 'Priority Search & Category Placement' },
                            { icon: '🕐', text: 'Working Hours / Slot Booking' },
                            { icon: '🪪', text: 'Verified Partner Badge' },
                            { icon: '📬', text: 'Lead inbox & instant alerts' },
                          ],
                          locked: [
                            '#1 Top Gold Placement',
                            'Homepage Featured Spotlight',
                          ]
                        },
                        {
                          tier: 'Pro',
                          price: '₹499',
                          sub: 'per month',
                          highlight: true,
                          badge: '⭐ Gold Featured Badge',
                          perks: [
                            { icon: '👑', text: '#1 Top Priority Featured Ranking' },
                            { icon: '⭐', text: 'Gold "Featured Partner" Badge' },
                            { icon: '📸', text: 'Unlimited Gallery Photos & Tariffs' },
                            { icon: '📊', text: 'Full Analytics + Weekly Export' },
                            { icon: '📞', text: 'Unlimited WhatsApp Booking Leads' },
                            { icon: '🗺️', text: 'Priority on Homepage & Search Engine' },
                            { icon: '🕐', text: 'Custom Hourly Slot Control Panel' },
                            { icon: '💬', text: 'Respond to customer reviews' },
                            { icon: '⚡', text: '0% Commission & VIP Dedicated Support' },
                          ],
                          locked: []
                        }
                      ];

                      const plansList = isHotel ? hotelPlans : merchantPlans;

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          {plansList.map((plan) => {
                            const isActive = business.subscription === plan.tier || (plan.tier === 'Free' && business.subscription === 'Free');
                            return (
                              <div
                                key={plan.tier}
                                className={`rounded-2xl border-2 p-5 flex flex-col transition-all relative ${plan.highlight
                                    ? 'border-teal-400 bg-teal-50/30 shadow-lg'
                                    : isActive
                                      ? 'border-teal-400 bg-white shadow-md'
                                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                                  }`}
                              >
                                {plan.highlight && (
                                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                                    ⭐ Most Popular
                                  </div>
                                )}

                                {/* Plan name pill */}
                                <div className={`inline-block self-start text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3 text-white ${
                                  plan.tier === 'Free' ? 'bg-slate-600' :
                                  plan.tier === 'Starter' ? 'bg-teal-600 shadow-xs' :
                                  'bg-amber-600 shadow-xs'
                                }`}>
                                  {isHotel ? (plan.tier === 'Pro' ? 'VIP Resort & Hotel' : plan.tier === 'Starter' ? 'Hotel Partner' : 'Free Hotel') : `${plan.tier} Plan`}
                                </div>

                                {/* Price */}
                                <div className="mb-1">
                                  <span className="text-2xl font-black text-slate-800">{plan.price}</span>
                                  <span className="text-[10px] text-slate-400 font-semibold ml-1">{plan.sub}</span>
                                </div>

                                {/* Badge label */}
                                {plan.badge ? (
                                  <div className="text-[10px] font-black text-amber-600 mb-3">{plan.badge}</div>
                                ) : (
                                  <div className="text-[10px] font-semibold text-slate-400 mb-3">No Trusted badge</div>
                                )}

                                {/* Included perks */}
                                <ul className="space-y-1.5 mb-4 flex-1">
                                  {plan.perks.map((p, k) => (
                                    <li key={k} className="text-[10px] text-slate-700 flex items-start gap-1.5 font-semibold">
                                      <span className="shrink-0">{p.icon}</span>
                                      <span>{p.text}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* Locked features */}
                                {plan.locked.length > 0 && (
                                  <ul className="space-y-1 mb-4 border-t border-slate-100 pt-3">
                                    {plan.locked.map((l, k) => (
                                      <li key={k} className="text-[10px] text-slate-350 flex items-center gap-1.5 line-through">
                                        <X className="w-3 h-3 text-slate-300 shrink-0" />
                                        <span>{l}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {/* CTA button */}
                                {plan.tier === 'Free' ? (
                                  <div className="w-full py-2.5 rounded-xl text-xs font-black text-center bg-slate-100 text-slate-500 border border-slate-200">
                                    {isActive ? '✓ Current Plan' : 'Default Plan'}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setCheckoutPlan(plan.tier as any);
                                      setCouponApplied(false);
                                      setCouponInput('');
                                      setCouponSuccessMsg('');
                                      setCouponErrorMsg('');
                                      setCheckoutModalOpen(true);
                                    }}
                                    disabled={isActive}
                                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 text-white ${
                                      isActive
                                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                                        : plan.tier === 'Starter'
                                          ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20'
                                          : 'bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 shadow-emerald-500/20'
                                    }`}
                                  >
                                    {isActive ? '✓ Current Plan' : `Upgrade to ${plan.tier} — ${plan.price}/mo`}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}


                  </div>
                )}

                {/* Subtab Content: Careers & Jobs */}
                {activeSubTab === 'jobs' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-teal-600" /> Jobs Management
                      </h3>
                      <Link href="/jobs/onboarding" className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                        Post New Job
                      </Link>
                    </div>

                    {loadingJobs ? (
                      <div className="text-center py-10 text-xs text-slate-500 font-bold">Loading jobs...</div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl">
                        <p className="text-slate-500 font-semibold mb-2">You haven't posted any jobs yet.</p>
                        <Link href="/jobs/onboarding" className="text-teal-600 font-bold hover:underline">Create your first job posting</Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map(job => (
                          <div key={job.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div>
                                <h4 className="font-black text-slate-800">{job.title}</h4>
                                <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 font-semibold mt-1">
                                  <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                                  <span>Type: {job.type}</span>
                                  <span className={`uppercase ${job.status === 'Open' ? 'text-emerald-600' : 'text-rose-600'}`}>Status: {job.status}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {job.status === 'Open' ? (
                                  <button
                                    onClick={() => handleUpdateJobStatus(job.id, 'Closed')}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                  >
                                    Stop Accepting Applications
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateJobStatus(job.id, 'Open')}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                  >
                                    Re-open Job
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="p-4">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Applicants ({job.applications?.length || 0})</h5>
                              {job.applications?.length === 0 ? (
                                <p className="text-xs text-slate-500 italic">No applications received yet.</p>
                              ) : (
                                <div className="space-y-3">
                                  {job.applications?.map((app: any) => (
                                    <div key={app.id} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:border-slate-300 transition-colors gap-2">
                                      <div>
                                        <p className="font-bold text-xs text-slate-800">{app.applicantName}</p>
                                        <div className="text-[10px] text-slate-500 space-x-2 mt-0.5">
                                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                          {app.resumeUrl && <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Resume</a>}
                                        </div>
                                        {app.coverLetter && <p className="text-[10px] text-slate-600 mt-1 italic border-l-2 border-slate-200 pl-2">"{app.coverLetter}"</p>}
                                      </div>
                                      <a href={`tel:${app.applicantPhone}`} className="bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold text-[10px] px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-all cursor-pointer">
                                        <Phone className="w-3 h-3" /> Call
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ==================== CHECKOUT / SUBSCRIPTION PAYMENT MODAL ==================== */}
      {checkoutModalOpen && checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4">
          <div
            className="fixed inset-0"
            onClick={() => setCheckoutModalOpen(false)}
          />

          <div className="relative w-[95%] sm:w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-3.5 sm:p-5 z-10 flex flex-col max-h-[75dvh] sm:max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-teal-655" />
                <h3 className="font-extrabold text-[11px] sm:text-xs text-slate-900 uppercase tracking-wider">Secure Checkout</h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Plan summary card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 mb-2.5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black uppercase text-teal-700 bg-teal-50 border border-teal-150 px-2 py-0.5 rounded-full">
                    {checkoutPlan === 'OwnerPass' ? 'Verified Owner Pass' : checkoutPlan === 'ProAgent' ? 'Pro Agent Pass' : checkoutPlan === 'BuilderPass' ? 'Builder Pass' : `${checkoutPlan} Plan`}
                  </span>
                  <p className="text-[11px] sm:text-xs font-black text-slate-800 mt-1">
                    {checkoutPlan === 'OwnerPass'
                      ? '3 Direct Owner Listings + Verified Owner Badge + Direct Leads'
                      : checkoutPlan === 'ProAgent'
                        ? '5 Active Listings + Verified Agent Badge + 5x WhatsApp Leads'
                        : checkoutPlan === 'BuilderPass'
                          ? '10 Active Listings / Projects + Rank #1 Priority'
                          : 'Boisar Local Business Promotion'}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-base sm:text-lg font-black text-slate-800">
                    {checkoutPlan === 'Basic' ? '₹99' : checkoutPlan === 'Pro' ? '₹149' : checkoutPlan === 'OwnerPass' ? '₹199' : checkoutPlan === 'ProAgent' ? '₹499' : '₹1,499'}
                  </span>
                  <span className="text-[9px] text-slate-405 font-semibold block">/ month</span>
                </div>
              </div>
            </div>

            {/* Promo Code section inside Checkout */}
            <div className="bg-teal-50/40 border border-teal-100 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 mb-2.5 space-y-1.5">
              <label className="block text-[9px] sm:text-[10px] text-teal-800 font-bold uppercase tracking-wider">🏷️ Apply Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. MAJHBOISAR99"
                  className="flex-1 bg-white border border-teal-200 rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCouponErrorMsg('');
                    setCouponSuccessMsg('');
                    const code = couponInput.trim().toUpperCase();

                    if (code === 'MAJHBOISAR99MB' || code === 'MAJHBOISAR99') {
                      if (checkoutPlan === 'Basic') {
                        setCouponApplied(true);
                        setCouponSuccessMsg('🎉 Cash Coupon Applied! ₹99 Basic Plan activated.');
                      } else {
                        setCouponErrorMsg('This coupon code is valid for ₹99 Basic Shop Plan.');
                      }
                    } else if (code === 'MAJHBOISAR149MB' || code === 'MAJHBOISAR149') {
                      if (checkoutPlan === 'Pro') {
                        setCouponApplied(true);
                        setCouponSuccessMsg('🎉 Cash Coupon Applied! ₹149 Pro Shop Plan activated.');
                      } else {
                        setCouponErrorMsg('This coupon code is valid for ₹149 Pro Shop Plan.');
                      }
                    } else if (code === 'MAJHBOISAR499MB' || code === 'MAJHBOISAR499') {
                      if (checkoutPlan === 'ProAgent' || checkoutPlan === 'Pro') {
                        setCouponApplied(true);
                        setCouponSuccessMsg('🎉 Cash Coupon Applied! ₹499 Pro Agent Pass activated.');
                      } else {
                        setCouponErrorMsg('This coupon code is valid for ₹499 Pro Agent Pass.');
                      }
                    } else if (code === 'MAJHBOISAR1499' || code === 'MAJHBOISAR1499MB') {
                      if (checkoutPlan === 'BuilderPass' || checkoutPlan === 'Pro') {
                        setCouponApplied(true);
                        setCouponSuccessMsg('🎉 Cash Coupon Applied! ₹1,499 Builder / VIP Pass activated.');
                      } else {
                        setCouponErrorMsg('This coupon code is valid for ₹1,499 Builder / VIP Pass.');
                      }
                    } else {
                      setCouponErrorMsg('Invalid coupon code.');
                    }
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-[11px] px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm border border-teal-800 shrink-0"
                >
                  Apply
                </button>
              </div>
              {couponSuccessMsg && <p className="text-[9px] font-bold text-emerald-600">{couponSuccessMsg}</p>}
              {couponErrorMsg && <p className="text-[9px] font-bold text-rose-600">{couponErrorMsg}</p>}
            </div>

            {/* Bill Details */}
            <div className="space-y-1 text-[11px] text-slate-600 mb-2.5 border-b border-slate-100 pb-2 font-semibold">
              <div className="flex justify-between font-bold">
                <span>Plan Charge</span>
                <span>{checkoutPlan === 'Basic' ? '₹99.00' : checkoutPlan === 'Pro' ? '₹149.00' : checkoutPlan === 'OwnerPass' ? '₹199.00' : checkoutPlan === 'ProAgent' ? '₹499.00' : '₹1,499.00'}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-650 font-black">
                  <span>Promo Code Discount (1st Month Free)</span>
                  <span>-{checkoutPlan === 'Basic' ? '₹99.00' : '₹149.00'}</span>
                </div>
              )}
              <hr className="border-slate-100" />
              <div className="flex justify-between text-slate-850 text-xs sm:text-sm font-black">
                <span>Total Amount Due</span>
                <span>
                  {couponApplied ? '₹0.00' : checkoutPlan === 'Basic' ? '₹99.00' : checkoutPlan === 'Pro' ? '₹149.00' : checkoutPlan === 'OwnerPass' ? '₹199.00' : checkoutPlan === 'ProAgent' ? '₹499.00' : '₹1,499.00'}
                </span>
              </div>
            </div>

            {/* Payment Details (Disabled if ₹0 balance due) */}
            {couponApplied ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 mb-2.5 text-xs font-bold leading-relaxed flex items-center gap-2">
                <span className="text-base">🎁</span>
                <div>
                  <p className="font-extrabold uppercase text-[9px]">Free Trial Active!</p>
                  <p className="text-[9px] text-emerald-700 font-medium">Coupon has cleared the balance. You can activate the plan immediately for free.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] text-slate-800 font-black uppercase tracking-wider">Payment Method</label>
                  <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">⚡ Instant UPI / QR</span>
                </div>

                <div className="bg-amber-50/50 border border-amber-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white border border-amber-300 rounded-xl p-0.5 shadow-xs shrink-0 flex flex-col items-center justify-center">
                      <img loading="lazy" decoding="async" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=majhboisar@upi&pn=Majh%20Boisar&am=${checkoutPlan === 'Basic' ? 99 : checkoutPlan === 'Pro' ? 149 : checkoutPlan === 'OwnerPass' ? 199 : checkoutPlan === 'ProAgent' ? 499 : 1499}&cu=INR`)}`} alt="UPI QR Code" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left space-y-0.5 text-[9px] font-bold text-amber-900 flex-1 min-w-0">
                      <p className="font-black text-amber-950 leading-tight text-[11px]">Scan &amp; Pay via GPay / PhonePe / Paytm</p>
                      <p className="text-[9px] text-amber-800 font-medium truncate">Send to: <strong className="text-slate-900 font-mono bg-white px-1 py-0.5 rounded border border-amber-300">majhboisar@upi</strong></p>
                      <p className="text-[8px] text-amber-700 font-medium">Enter 12-digit UTR/Ref number below after payment.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] text-amber-900 font-black uppercase tracking-wider mb-0.5">UPI Ref ID / UTR Number (12 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      value={upiRefId}
                      onChange={e => setUpiRefId(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 308912345678"
                      className="w-full bg-white border border-amber-300 rounded-lg sm:rounded-xl px-2.5 py-1.5 text-[11px] focus:outline-none focus:border-amber-500 font-mono tracking-widest text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Checkout Action Buttons */}
            <a
              href={`https://wa.me/917769947217?text=${encodeURIComponent(`Hello Admin! I want to subscribe to the ${checkoutPlan} Plan on Majh Boisar. Please activate for me.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mb-2"
            >
              <span>💬 Subscribe via WhatsApp Admin</span>
            </a>

            <div className="flex gap-2 mt-auto">
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="flex-1 py-2 sm:py-2.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs cursor-pointer text-center"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={async () => {
                  setCheckoutModalOpen(false);
                  if (checkoutPlan === 'OwnerPass' || checkoutPlan === 'ProAgent' || checkoutPlan === 'BuilderPass') {
                    const savedPlanId = checkoutPlan === 'OwnerPass' ? 'Owner' : checkoutPlan === 'ProAgent' ? 'Pro' : 'Builder';
                    if (typeof window !== 'undefined') {
                      localStorage.setItem(`majh_boisar_property_plan_${loggedInUser?.phone}`, savedPlanId);
                    }
                    const planName = checkoutPlan === 'OwnerPass' ? 'Verified Owner Pass (₹199/mo)' : checkoutPlan === 'ProAgent' ? 'Pro Agent Pass (₹499/mo)' : 'Builder Pass (₹1,499/mo)';
                    alert(`🎉 Congratulations! Your ${planName} has been activated successfully!`);
                    window.location.reload();
                  } else if (checkoutPlan) {
                    await handleUpgradeSubscription(checkoutPlan);
                    if (couponApplied) {
                      alert('🎉 Welcome! Your 1-Month Free Trial has been activated successfully!');
                    } else {
                      alert('💳 Subscription successfully activated! Payment simulation complete.');
                    }
                  }
                }}
                className="flex-1 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer text-center"
              >
                {couponApplied ? 'Activate Free Trial' : 'Pay & Activate'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== MULTI-STEP ADD NEW BUSINESS WIZARD OVERLAY ==================== */}
      {newBizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div
            className="fixed inset-0"
            onClick={() => setNewBizModalOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">

            {/* Header with Title and Close Trigger */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Register Boisar Business</h3>
              </div>
              <button
                onClick={() => setNewBizModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-105 text-slate-405 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Circular Progress Widget */}
            <div className="shrink-0 mb-6 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="stroke-slate-250"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    className="stroke-teal-600 transition-all duration-500 ease-out"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - wizardStep / 4)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-800">
                  {Math.round((wizardStep / 4) * 100)}%
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  {wizardStep === 1 && "Step 1 of 4"}
                  {wizardStep === 2 && "Step 2 of 4"}
                  {wizardStep === 3 && "Step 3 of 4"}
                  {wizardStep === 4 && "Step 4 of 4"}
                </span>
                <h4 className="text-xs font-black text-slate-800 mt-1 leading-tight truncate">
                  {wizardStep === 1 && "Business Details & Address"}
                  {wizardStep === 2 && "Contact & Social Details"}
                  {wizardStep === 3 && "Timings, Cover & Category"}
                  {wizardStep === 4 && "Products & Services Catalog (Optional)"}
                </h4>
              </div>
            </div>

            {/* Error Message */}
            {createBizError && (
              <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-650 flex items-center gap-2 shrink-0 mb-4 animate-shake">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>{createBizError}</span>
              </div>
            )}

            {/* Form scroll container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-700">

              {/* STEP 1: Business Details */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Enter Business Details</h4>

                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Business Name *</label>
                    <input
                      type="text"
                      required
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      placeholder="e.g. Nevada Family Restaurant"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Business Category *</label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 cursor-pointer font-bold"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newBizCategory === 'Other' && (
                    <div className="animate-fade-in bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 space-y-1">
                      <label className="block text-[10px] text-teal-900 font-black uppercase tracking-wider mb-1">Specify Custom Category Name *</label>
                      <input
                        type="text"
                        required
                        value={newBizCustomCategory}
                        onChange={(e) => setNewBizCustomCategory(e.target.value)}
                        placeholder="e.g. Electrician, Cake Shop, Xerox & DTP, Car Wash"
                        className="w-full bg-white border border-teal-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-600 text-slate-800 font-bold"
                      />
                      <p className="text-[10px] text-teal-700 font-medium">Your business will be registered and shown under this category!</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newBizPincode}
                        onChange={(e) => setNewBizPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="401501"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Area Location *</label>
                      <select
                        value={newBizLocation}
                        onChange={(e) => setNewBizLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 cursor-pointer"
                      >
                        {locationsList.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Shop / Plot No / Wing *</label>
                      <input
                        type="text"
                        required
                        value={newBizPlotNo}
                        onChange={(e) => setNewBizPlotNo(e.target.value)}
                        placeholder="e.g. Shop No. 12"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Building / Colony Name</label>
                      <input
                        type="text"
                        value={newBizBldgName}
                        onChange={(e) => setNewBizBldgName(e.target.value)}
                        placeholder="e.g. Ostwal Empire Mall"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Street / Road Name *</label>
                      <input
                        type="text"
                        required
                        value={newBizStreet}
                        onChange={(e) => setNewBizStreet(e.target.value)}
                        placeholder="e.g. TAPS Road"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Landmark</label>
                      <input
                        type="text"
                        value={newBizLandmark}
                        onChange={(e) => setNewBizLandmark(e.target.value)}
                        placeholder="e.g. Opposite D-Mart"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">City</label>
                      <input
                        type="text"
                        disabled
                        value={newBizCity}
                        className="w-full bg-slate-100 border border-slate-200 text-slate-405 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">State</label>
                      <input
                        type="text"
                        disabled
                        value={newBizState}
                        className="w-full bg-slate-100 border border-slate-200 text-slate-405 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* GST Number (Optional) */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">
                      GST Number
                      <span className="text-[9px] font-semibold text-slate-400 normal-case tracking-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={newBizGst}
                      onChange={(e) => setNewBizGst(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AABCU9603R1ZM"
                      maxLength={15}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold tracking-wide"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Contact Details */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Enter Contact Details</h4>

                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={newBizContactPerson}
                      onChange={(e) => setNewBizContactPerson(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Mobile Number *</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-xs text-slate-405 font-semibold pr-2 border-r border-slate-200">+91</div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={newBizPhone}
                          onChange={(e) => setNewBizPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit number"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-14 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 text-xs text-slate-450 font-semibold pr-2 border-r border-slate-205">+91</div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={newBizWhatsapp}
                          onChange={(e) => setNewBizWhatsapp(e.target.value.replace(/\D/g, ''))}
                          placeholder="Same or other number"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-14 pr-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewBizWhatsapp(newBizPhone)}
                        className="text-[10px] font-bold text-teal-605 mt-1 hover:underline block"
                      >
                        Copy Phone Number
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={newBizEmail}
                      onChange={(e) => setNewBizEmail(e.target.value)}
                      placeholder="e.g. nevada.salons@gmail.com"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Category, Timings, Photos */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <h4 className="font-extrabold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Category, Timings &amp; Photos</h4>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Listing Category *</label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 cursor-pointer font-bold"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {newBizCategory === 'Other' && (
                    <div className="animate-fade-in bg-teal-50/70 p-3.5 rounded-xl border border-teal-200 space-y-1">
                      <label className="block text-[10px] text-teal-900 font-black uppercase tracking-wider mb-1">Custom Category Name *</label>
                      <input
                        type="text"
                        required
                        value={newBizCustomCategory}
                        onChange={(e) => setNewBizCustomCategory(e.target.value)}
                        placeholder="e.g. Electrician, Cake Shop, Xerox & DTP"
                        className="w-full bg-white border border-teal-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-600 text-slate-800 font-bold"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">About Description *</label>
                    <textarea
                      required
                      rows={2}
                      value={newBizDescription}
                      onChange={(e) => setNewBizDescription(e.target.value)}
                      placeholder="e.g. Best local beauty parlour offering cuts, bridal makeup, and organic spa treatments..."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Website, Google Maps & Waze */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Website URL (Optional)</label>
                      <input
                        type="text"
                        value={newBizWebsite}
                        onChange={(e) => setNewBizWebsite(e.target.value)}
                        placeholder="e.g. https://mybusiness.in"
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider">Google Maps Link</label>
                          <button
                            type="button"
                            onClick={handleAutoDetectLocation}
                            className="text-[9px] font-black text-teal-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            📍 Auto-Fetch
                          </button>
                        </div>
                        <input
                          type="text"
                          value={newBizGoogleMaps}
                          onChange={(e) => setNewBizGoogleMaps(e.target.value)}
                          placeholder="https://maps.google.com/..."
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-405 font-bold uppercase tracking-wider mb-1.5">Waze Link (Optional)</label>
                        <input
                          type="text"
                          value={newBizWazeLink}
                          onChange={(e) => setNewBizWazeLink(e.target.value)}
                          placeholder="https://waze.com/ul/..."
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Working Hours Day Builder */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-4 space-y-2 overflow-hidden">
                    <label className="block text-[10px] sm:text-xs text-slate-600 font-black uppercase tracking-wider mb-1 sm:mb-2">🕐 Working Hours (per day)</label>
                    <div className="overflow-x-auto no-scrollbar space-y-1.5 -mx-1 px-1">
                      {Object.entries(newBizSchedule).map(([day, slot]) => (
                        <div key={day} className="flex items-center gap-1 sm:gap-2 min-w-[280px]">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-600 w-7 sm:w-8 shrink-0">{day}</span>
                          {slot.closed ? (
                            <span className="flex-1 text-[9px] sm:text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1 sm:py-1.5">Closed</span>
                          ) : (
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              <input
                                type="time"
                                value={slot.open}
                                onChange={(e) => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
                                className="w-full min-w-0 bg-white border border-slate-200 rounded-lg px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                              />
                              <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold shrink-0">to</span>
                              <input
                                type="time"
                                value={slot.close}
                                onChange={(e) => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
                                className="w-full min-w-0 bg-white border border-slate-200 rounded-lg px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], closed: !prev[day].closed } }))}
                            className={`text-[8px] sm:text-[9px] font-black px-2 py-1 sm:py-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${slot.closed
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                              }`}
                          >
                            {slot.closed ? 'Open' : 'Close'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cover Photo Upload */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">🖼️ Main Cover Photo *</label>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Primary banner photo displayed at top of listing card.</p>
                      </div>
                      {newBizImage && (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">✓ Cover Set</span>
                      )}
                    </div>
                    <input type="file" accept="image/*" id="modal-cover-upload" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const compressed = await compressImage(file, 1200, 1200, 0.8);
                        if (compressed) {
                          setNewBizImage(compressed);
                          openCropperFor(compressed, 'newBiz');
                        }
                      } catch {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          if (base64) {
                            setNewBizImage(base64);
                            openCropperFor(base64, 'newBiz');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      e.target.value = '';
                    }} className="hidden" />
                    {newBizImage ? (
                      <div className="relative rounded-xl overflow-hidden border-2 border-teal-500 bg-slate-100 aspect-video group">
                        <img loading="lazy" decoding="async" src={newBizImage} alt="Main Cover" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-teal-700 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">MAIN COVER</div>
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openCropperFor(newBizImage, 'newBiz')}
                            className="bg-slate-900 hover:bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer shadow-md flex items-center gap-1"
                          >
                            <span>✂️ Crop / Adjust</span>
                          </button>
                          <button type="button" onClick={() => setNewBizImage('')} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2 py-1 rounded-lg cursor-pointer shadow-md">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="modal-cover-upload" className="flex border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-4 flex-col items-center justify-center cursor-pointer bg-teal-50/30 hover:bg-teal-50/80 transition-all text-center">
                        <span className="text-xl mb-1">🖼️</span>
                        <span className="text-[10px] font-black text-teal-800 uppercase">Upload Main Cover Photo</span>
                        <span className="text-[9px] text-teal-600 font-semibold mt-0.5">Click to choose image &amp; crop to perfect size</span>
                      </label>
                    )}
                  </div>

                  {/* Gallery Photos */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">📸 Additional Gallery Photos</label>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Add store interior, products or menu photos.</p>
                      </div>
                      <span className="bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-black px-2 py-0.5 rounded-full">{newBizGalleryPhotos.length} Uploaded</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      id="modal-gallery-upload"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        const compressedList: string[] = [];
                        for (const file of files) {
                          try {
                            const c = await compressImage(file, 1000, 1000, 0.75);
                            if (c) compressedList.push(c);
                          } catch {
                            // fallback
                          }
                        }
                        if (compressedList.length > 0) {
                          setNewBizGalleryPhotos(prev => {
                            const combined = [...prev];
                            compressedList.forEach(img => {
                              if (!combined.includes(img)) combined.push(img);
                            });
                            return combined;
                          });
                          showToast(`Added ${compressedList.length} gallery photos! 📸`, 'success');
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="modal-gallery-upload"
                      className="flex border-2 border-dashed border-teal-300 hover:border-teal-600 rounded-xl p-3.5 flex-col items-center justify-center cursor-pointer bg-teal-50/20 hover:bg-teal-50/60 transition-colors text-center shadow-2xs"
                    >
                      <span className="text-xl mb-1">📸</span>
                      <span className="text-xs font-black text-teal-800 uppercase">📁 Choose Photos from Phone / Device Gallery (Select Multiple)</span>
                      <span className="text-[10px] text-teal-600 font-medium mt-0.5">Click to pick multiple store, interior, or product photos</span>
                    </label>
                    {newBizGalleryPhotos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {newBizGalleryPhotos.map((url, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                            <img loading="lazy" decoding="async" src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setNewBizGalleryPhotos(newBizGalleryPhotos.filter((_, i) => i !== idx))} className="absolute top-1 right-1 h-5 w-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center cursor-pointer text-xs font-bold shadow-md">×</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-xl p-3 text-center bg-white">
                        <p className="text-[10px] text-slate-400 font-bold">No gallery photos added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Products & Services Catalog (Interactive Prompt) */}
              {wizardStep === 4 && (
                <div className="space-y-5 py-2">
                  <div className="text-center space-y-1 bg-teal-50/70 border border-teal-200 rounded-2xl p-4">
                    <span className="text-2xl">🛍️</span>
                    <h4 className="text-sm font-black text-slate-800">Add Products &amp; Services <span className="text-teal-600 font-bold text-xs">(Optional)</span></h4>
                    <p className="text-[11px] text-slate-600">
                      Do you want to add items you sell or services you offer? They will be shown in your <strong>Products &amp; Services</strong> tab.
                    </p>
                  </div>

                  {/* 1. Products Section */}
                  <div className="space-y-3 bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <span>📦</span>
                        <span>Products Catalog ({newBizProducts.length})</span>
                      </h5>
                    </div>

                    {/* Add product inputs */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Product name (e.g. PVC Pipe 10ft) *"
                          value={newBizProdInput.name}
                          onChange={e => setNewBizProdInput(p => ({...p, name: e.target.value}))}
                          className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Price ₹ (e.g. 300)"
                          value={newBizProdInput.price}
                          onChange={e => setNewBizProdInput(p => ({...p, price: e.target.value}))}
                          className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Short description (optional)"
                          value={newBizProdInput.desc}
                          onChange={e => setNewBizProdInput(p => ({...p, desc: e.target.value}))}
                          className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Product Item Photo Picker */}
                      <div className="flex items-center gap-2 bg-white border border-amber-150 p-2 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                          {(newBizProdInput as any).image ? (
                            <img src={(newBizProdInput as any).image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm">📷</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          id="product-photo-upload-step4"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              if (base64) setNewBizProdInput(p => ({ ...p, image: base64 } as any));
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                        />
                        <label
                          htmlFor="product-photo-upload-step4"
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-black cursor-pointer shadow-2xs transition-colors"
                        >
                          {(newBizProdInput as any).image ? '✓ Item Photo Attached (Change)' : '📁 Add Item Photo (e.g. Pipe photo)'}
                        </label>
                        {(newBizProdInput as any).image && (
                          <button
                            type="button"
                            onClick={() => setNewBizProdInput(p => ({ ...p, image: '' } as any))}
                            className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newBizProdInput.name.trim()) return;
                        setNewBizProducts(prev => [...prev, {...newBizProdInput}]);
                        setNewBizProdInput({name: '', price: '', desc: ''} as any);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
                    >
                      ➕ Add Product
                    </button>

                    {newBizProducts.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        {newBizProducts.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-amber-150 rounded-xl p-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 overflow-hidden flex items-center justify-center shrink-0">
                                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span>📦</span>}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-800">{p.name}</span>
                                {p.price && <span className="ml-2 text-amber-700 font-bold">{p.price.startsWith('₹') ? p.price : `₹${p.price}`}</span>}
                                {p.desc && <span className="ml-2 text-slate-400">({p.desc})</span>}
                              </div>
                            </div>
                            <button type="button" onClick={() => setNewBizProducts(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700 font-black text-sm cursor-pointer p-1">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Services Section */}
                  <div className="space-y-3 bg-teal-50/60 border border-teal-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-teal-900 uppercase tracking-wider flex items-center gap-1">
                        <span>⚙️</span>
                        <span>Offered Services ({newBizServices.length})</span>
                      </h5>
                    </div>

                    {/* Add service inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Service name *"
                        value={newBizSvcInput.name}
                        onChange={e => setNewBizSvcInput(s => ({...s, name: e.target.value}))}
                        className="bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Price / Rate ₹ (e.g. 500)"
                        value={newBizSvcInput.price}
                        onChange={e => setNewBizSvcInput(s => ({...s, price: e.target.value}))}
                        className="bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration / Details (e.g. 45 Mins)"
                        value={newBizSvcInput.desc}
                        onChange={e => setNewBizSvcInput(s => ({...s, desc: e.target.value}))}
                        className="bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBizSvcInput.name.trim()) return;
                        setNewBizServices(prev => [...prev, {...newBizSvcInput}]);
                        setNewBizSvcInput({name: '', price: '', duration: '', desc: ''});
                      }}
                      className="bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-black px-4 py-2 rounded-xl cursor-pointer transition-all shadow-xs"
                    >
                      ➕ Add Service
                    </button>

                    {newBizServices.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        {newBizServices.map((s, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white border border-teal-150 rounded-xl px-3 py-2 text-xs">
                            <div>
                              <span className="font-extrabold text-slate-800">{s.name}</span>
                              {s.price && <span className="ml-2 text-teal-700 font-bold">{s.price.startsWith('₹') ? s.price : `₹${s.price}`}</span>}
                              {s.desc && <span className="ml-2 text-slate-400">({s.desc})</span>}
                            </div>
                            <button type="button" onClick={() => setNewBizServices(prev => prev.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700 font-black text-sm cursor-pointer p-1">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-center text-[10.5px] text-slate-400 font-medium">
                    Tip: You can also add or edit products &amp; services anytime later from your Merchant Dashboard.
                  </p>
                </div>
              )}

            </div>

            {/* Prev/Next Wizard Navigation Controls */}
            <div className="border-t border-slate-105 pt-4 mt-6 flex items-center justify-between shrink-0">
              <div>
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCreateBizError('');
                      setWizardStep(prev => prev - 1);
                    }}
                    className="px-4 py-2.5 border border-slate-250 bg-slate-55 hover:bg-slate-105 hover:text-slate-800 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNewBizModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-450 hover:bg-slate-55 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                {wizardStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && validateStep1()) setWizardStep(2);
                      else if (wizardStep === 2 && validateStep2()) setWizardStep(3);
                      else if (wizardStep === 3) setWizardStep(4);
                    }}
                    className="btn-teal text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1 hover:scale-[1.01]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCreateBusinessFinal}
                    disabled={creatingBiz}
                    className="btn-teal text-white font-black px-6 py-2.5 rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    {creatingBiz ? 'Publishing...' : 'Publish Business Profile'}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Property Details Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setEditingProperty(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-650 flex items-center justify-center font-black border border-teal-200">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 leading-tight">Edit Property Details</h3>
                <p className="text-xs text-slate-400 font-bold">Update title, pricing, location, area size & contact info</p>
              </div>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={editPropTitle}
                  onChange={(e) => setEditPropTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    value={editPropPrice}
                    onChange={(e) => setEditPropPrice(e.target.value)}
                    placeholder="e.g. ₹35.5 Lakhs"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Carpet Area *</label>
                  <input
                    type="text"
                    required
                    value={editPropArea}
                    onChange={(e) => setEditPropArea(e.target.value)}
                    placeholder="e.g. 720 sq.ft"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Area Location *</label>
                  <select
                    value={editPropLocation}
                    onChange={(e) => setEditPropLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Boisar West">Boisar West</option>
                    <option value="Boisar East">Boisar East</option>
                    <option value="Ostwal Empire">Ostwal Empire</option>
                    <option value="Tarapur MIDC">Tarapur MIDC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Construction Status *</label>
                  <select
                    value={editPropStatus}
                    onChange={(e) => setEditPropStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Rented Out / Sold">Rented Out / Sold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    value={editPropContactName}
                    onChange={(e) => setEditPropContactName(e.target.value)}
                    placeholder="Owner / Agent Name"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={editPropContactPhone}
                    onChange={(e) => setEditPropContactPhone(e.target.value)}
                    placeholder="10-digit Mobile Number"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-650 hover:bg-teal-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  Save Property Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✂️ IMAGE CROPPER & ADJUSTMENT MODAL */}
      {cropperOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>✂️ Crop &amp; Adjust Shop Cover Photo</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Zoom, rotate, and select banner frame size before saving.</p>
              </div>
              <button
                type="button"
                onClick={() => setCropperOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Preview Container */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center min-h-[220px] max-h-[300px] border border-slate-800 p-2 shadow-inner">
              <div
                className={`w-full transition-all duration-150 overflow-hidden rounded-xl relative flex items-center justify-center bg-black/40 border-2 border-dashed border-amber-400/80 shadow-lg ${cropAspect === '16:9' ? 'aspect-video' : cropAspect === '4:3' ? 'aspect-4/3 max-w-[320px]' : 'aspect-square max-w-[240px]'
                  }`}
              >
                <img
                  src={cropperSrc}
                  alt="Crop Preview"
                  className="w-full h-full object-cover transition-transform duration-100"
                  style={{
                    transform: `scale(${cropZoom}) rotate(${cropRotate}deg)`
                  }}
                />
                <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                  CROP FRAME ({cropAspect})
                </div>
              </div>
            </div>

            {/* Cropper Controls Grid */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs">
              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Banner Frame Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['16:9', '4:3', '1:1'] as const).map(asp => (
                    <button
                      type="button"
                      key={asp}
                      onClick={() => setCropAspect(asp)}
                      className={`py-1.5 rounded-xl font-black text-[11px] border transition-all cursor-pointer ${cropAspect === asp ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {asp === '16:9' ? '📐 Banner (16:9)' : asp === '4:3' ? '🖼️ Standard (4:3)' : '⏹️ Square (1:1)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoom & Rotate Sliders */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">🔍 Zoom ({cropZoom.toFixed(1)}x)</label>
                    <button type="button" onClick={() => setCropZoom(1)} className="text-[9px] text-teal-600 font-bold hover:underline">Reset</button>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={cropZoom}
                    onChange={e => setCropZoom(parseFloat(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">🔄 Rotation ({cropRotate}°)</label>
                    <button type="button" onClick={() => setCropRotate((prev) => (prev + 90) % 360)} className="text-[9px] text-teal-600 font-bold hover:underline">+90°</button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="270"
                    step="90"
                    value={cropRotate}
                    onChange={e => setCropRotate(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCropperOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Use As-Is
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <span>✂️ Crop &amp; Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT BOOKING MODAL */}
      {editingBooking && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>✏️ Edit Slot Booking Record</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Ref: {editingBooking.refCode}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBooking(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBookingEdits} className="space-y-3 text-xs">
              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Customer / Player Name *</label>
                <input
                  type="text"
                  required
                  value={editBookingName}
                  onChange={e => setEditBookingName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Mobile Phone *</label>
                <input
                  type="text"
                  required
                  value={editBookingPhone}
                  onChange={e => setEditBookingPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">PS5 Station / Court</label>
                  <input
                    type="text"
                    value={editBookingStation}
                    onChange={e => setEditBookingStation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-purple-900 uppercase tracking-wider mb-1">Final Amount (INR) *</label>
                  <input
                    type="text"
                    required
                    value={editBookingRate}
                    onChange={e => setEditBookingRate(e.target.value)}
                    className="w-full bg-purple-50 border border-purple-300 rounded-xl px-3 py-2 text-xs font-black text-purple-900 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Time Slot</label>
                <input
                  type="text"
                  value={editBookingSlot}
                  onChange={e => setEditBookingSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Booking Status</label>
                <select
                  value={editBookingStatus}
                  onChange={e => setEditBookingStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="Confirmed">⏳ Confirmed / Upcoming</option>
                  <option value="Attended / Visited">✓ Attended / Visited</option>
                  <option value="Cancelled">🚫 Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable QR Standee Modal for Dashboard */}
      {business && (
        <BusinessQRStandeeModal
          isOpen={isStandeeModalOpen}
          onClose={() => setIsStandeeModalOpen(false)}
          business={business}
        />
      )}

    </div>
  );
}

export default function BusinessDashboardPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-500">Loading dashboard...</div>}>
      <DashboardContent />
    </React.Suspense>
  );
}
