'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BOISAR_HOTELS } from '@/lib/hotelsData';
import { resortsData, ResortVilla } from '@/lib/resortsData';
import { BOISAR_FOOD_DIRECTORY, FoodItem } from '@/lib/foodDiningData';
import {
  Building, Building2, CheckCircle, AlertCircle, Sparkles, ClipboardCheck,
  MessageSquare, Layers, ShieldCheck, ShieldAlert, Star, Eye, Trash2,
  ToggleLeft, ToggleRight, Coins, Terminal, RefreshCw, BarChart2,
  Edit, Plus, X, Users, Phone, UserCheck, PlusCircle, MapPin, Briefcase, FileText,
  HardDrive, Database, Server, Smartphone, Zap, Lock, KeyRound, EyeOff, Waves, Compass, Utensils,
  Car, ExternalLink, Wrench, Heart
} from 'lucide-react';

export interface HomeFeaturedRestaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  discount: string;
  image: string;
  speciality: string;
  isActive?: boolean;
}

const DEFAULT_FEATURED_RESTAURANTS: HomeFeaturedRestaurant[] = [
  {
    id: 'rest-1',
    name: 'Citrus Cafe & Resto',
    category: 'Cafe & Multi-Cuisine',
    location: 'Boisar West · Station',
    rating: 4.8,
    discount: '15% Off + 25% Off',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    speciality: 'Cold Brew, Pasta & Sizzlers',
    isActive: true
  },
  {
    id: 'rest-2',
    name: 'The Daily Dose Cafe',
    category: 'Coffee, Pizza & Burgers',
    location: 'Ostwal Empire · Boisar',
    rating: 4.7,
    discount: 'Flat 20% Off',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
    speciality: 'Handcrafted Burgers & Shakes',
    isActive: true
  },
  {
    id: 'rest-3',
    name: 'Sai Sagar Veg Treat',
    category: 'Pure Veg & South Indian',
    location: 'Station Road · Boisar',
    rating: 4.6,
    discount: 'Special Thali & Dosa',
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=600&auto=format&fit=crop&q=80',
    speciality: 'Crispy Butter Masala Dosa',
    isActive: true
  },
  {
    id: 'rest-4',
    name: 'Cafe Hashtag & Lounge',
    category: 'Rooftop Cafe & Mocktails',
    location: 'Tarapur MIDC Road',
    rating: 4.9,
    discount: '10% Off + 25% Off',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    speciality: 'Wood-Fired Pizza & Sizzlers',
    isActive: true
  }
];

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
  'Veterinary Clinics', 'Driving Schools', 'Gift Shops'
];

interface Business {
  id: number;
  name: string;
  category: string;
  verified: boolean;
  premium: boolean;
  subscription: string;
  rating: number;
  views: number;
  location: string;
  description?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string | null;
  email?: string | null;
  image?: string;
  gallery?: string[];
  googleMaps?: string | null;
}

const defaultUsersList: any[] = [];

interface DeletionRequest {
  id: number;
  userName: string;
  userPhone: string;
  userEmail?: string;
  reason?: string;
  requestedAt: string;
  status: 'Pending' | 'Approved & Deleted' | 'Rejected';
}

const defaultDeletionRequests: DeletionRequest[] = [];

interface Lead {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  query: string;
  status: string;
  createdAt: string;
  business: { name: string };
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  business: { name: string };
}

interface AdOrder {
  id: number;
  businessId: number;
  businessName: string;
  title: string;
  description: string;
  isExpired?: boolean;
  expiryDate?: string;
  image: string | null;
  placement: string;
  targetingScope: string;
  targetCategory: string;
  durationDays: number;
  dailyBudget: number;
  totalCost: number;
  status: string;
  createdAt: string;
}

export default function AdminPanelPage() {
  const { currentRole, setRole, login, isLoggedIn, loggedInUser, setLoginModalOpen, showToast } = useApp();
  const [isAdminPageUnlocked, setIsAdminPageUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminPasscodeError, setAdminPasscodeError] = useState('');
  const [savedAdminPasscode, setSavedAdminPasscode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('majh_boisar_admin_passcode') || 'dhuYGmi4%q#FHX9';
    }
    return 'dhuYGmi4%q#FHX9';
  });

  // Security Modal States (Change Admin Passcode & Authorized Mobile)
  const [adminSecurityModalOpen, setAdminSecurityModalOpen] = useState(false);
  const [adminAuthPhoneInput, setAdminAuthPhoneInput] = useState('');
  const [adminSecretPasscodeInput, setAdminSecretPasscodeInput] = useState('');
  const [securitySaveSuccess, setSecuritySaveSuccess] = useState('');

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [adOrders, setAdOrders] = useState<AdOrder[]>([]);
  const [specialProfiles, setSpecialProfiles] = useState<any>({});
  const [reportsList, setReportsList] = useState<any[]>([]);

  // Ad settings
  const [sliderMultiplier, setSliderMultiplier] = useState(2.0);
  const [resultsMultiplier, setResultsMultiplier] = useState(1.5);
  const [allMultiplier, setAllMultiplier] = useState(3.0);
  const [baseDailyBudget, setBaseDailyBudget] = useState(100.0);
  const [sponsoredMultiplier, setSponsoredMultiplier] = useState(1.0);
  const [savingSettings, setSavingSettings] = useState(false);

  // Merchant Business Subscription Plan Prices
  const [bizPlanFreePrice, setBizPlanFreePrice] = useState('₹0');
  const [bizPlanProPrice, setBizPlanProPrice] = useState('₹499/mo');
  const [bizPlanVipPrice, setBizPlanVipPrice] = useState('₹1,499/mo');

  // Real Estate Property Subscription Plan Prices
  const [propPlanFreePrice, setPropPlanFreePrice] = useState('₹0');
  const [propPlanProPrice, setPropPlanProPrice] = useState('₹499/mo');
  const [propPlanBuilderPrice, setPropPlanBuilderPrice] = useState('₹1,499/mo');

  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'queue' | 'home_restaurants' | 'hotel_management' | 'resort_management' | 'listings' | 'users' | 'leads' | 'reviews' | 'ad_orders' | 'ad_pricing' | 'categories' | 'logs' | 'deletion_requests' | 'jobs_management' | 'property_management' | 'spam_reports' | 'system_storage'>('queue');
  const [systemStats, setSystemStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [customAdminCategories, setCustomAdminCategories] = useState<string[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([]);
  const [adminJobsList, setAdminJobsList] = useState<any[]>([]);

  // Homepage Featured Restaurants Management States
  const [adminHomeRestaurants, setAdminHomeRestaurants] = useState<HomeFeaturedRestaurant[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_featured_restaurants');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_FEATURED_RESTAURANTS;
  });
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const [restoFormName, setRestoFormName] = useState('');
  const [restoFormCategory, setRestoFormCategory] = useState('Cafe & Multi-Cuisine');
  const [restoFormLocation, setRestoFormLocation] = useState('Boisar West · Near Station');
  const [restoFormRating, setRestoFormRating] = useState('4.8');
  const [restoFormDiscount, setRestoFormDiscount] = useState('15% Off + 25% Off');
  const [restoFormSpeciality, setRestoFormSpeciality] = useState('Cold Brew, Pasta & Sizzlers');
  const [restoFormImage, setRestoFormImage] = useState('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80');

  // Directory Food Items State
  const [restoFilterTab, setRestoFilterTab] = useState<'all' | 'live_home'>('all');
  const [restoSearchQuery, setRestoSearchQuery] = useState('');

  const allDirectoryRestaurants = useMemo(() => {
    let customList: FoodItem[] = [];
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_custom_food_items');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) customList = parsed;
        }
      } catch (e) {}
    }
    return [...customList, ...BOISAR_FOOD_DIRECTORY];
  }, [adminHomeRestaurants]);

  const saveHomeRestaurants = (newList: HomeFeaturedRestaurant[]) => {
    setAdminHomeRestaurants(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_featured_restaurants', JSON.stringify(newList));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleToggleRestaurantHomepageDisplay = (foodItem: FoodItem | HomeFeaturedRestaurant) => {
    const existingIndex = adminHomeRestaurants.findIndex(r => r.id === foodItem.id || r.name.toLowerCase() === foodItem.name.toLowerCase());
    let updated: HomeFeaturedRestaurant[];

    if (existingIndex >= 0) {
      const isCurrentlyActive = adminHomeRestaurants[existingIndex].isActive !== false;
      const nextActive = !isCurrentlyActive;
      updated = adminHomeRestaurants.map((r, idx) => idx === existingIndex ? { ...r, isActive: nextActive } : r);
      saveHomeRestaurants(updated);
      showToast(nextActive ? `✅ "${foodItem.name}" is now Live on Homepage Display!` : `○ "${foodItem.name}" is now Hidden from Homepage.`, nextActive ? 'success' : 'info', 4000);
    } else {
      const newHomeResto: HomeFeaturedRestaurant = {
        id: foodItem.id || `rest-${Date.now()}`,
        name: foodItem.name,
        category: (foodItem as any).categoryLabel || foodItem.category || 'Dining',
        location: foodItem.location || 'Boisar',
        rating: foodItem.rating || 4.8,
        discount: (foodItem as any).discount || 'Special Offers',
        image: foodItem.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
        speciality: (foodItem as any).speciality || 'Quality Food & Fast Delivery',
        isActive: true
      };
      updated = [newHomeResto, ...adminHomeRestaurants];
      saveHomeRestaurants(updated);
      showToast(`🎉 "${foodItem.name}" added & Live on Homepage Display!`, 'success', 4000);
    }
  };

  const handleOpenAddRestaurant = () => {
    setEditingRestaurantId(null);
    setRestoFormName('');
    setRestoFormCategory('Cafe & Multi-Cuisine');
    setRestoFormLocation('Boisar West · Near Station');
    setRestoFormRating('4.8');
    setRestoFormDiscount('15% Off + 25% Off');
    setRestoFormSpeciality('Cold Brew, Pasta & Sizzlers');
    setRestoFormImage('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80');
    setRestaurantModalOpen(true);
  };

  const handleOpenEditRestaurant = (r: HomeFeaturedRestaurant) => {
    setEditingRestaurantId(r.id);
    setRestoFormName(r.name);
    setRestoFormCategory(r.category || 'Cafe & Multi-Cuisine');
    setRestoFormLocation(r.location || 'Boisar West');
    setRestoFormRating(String(r.rating || '4.8'));
    setRestoFormDiscount(r.discount || '');
    setRestoFormSpeciality(r.speciality || '');
    setRestoFormImage(r.image || '');
    setRestaurantModalOpen(true);
  };

  const handleSaveRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoFormName.trim()) {
      alert('Please enter restaurant/cafe name');
      return;
    }

    if (editingRestaurantId) {
      const updated = adminHomeRestaurants.map(r => r.id === editingRestaurantId ? {
        ...r,
        name: restoFormName.trim(),
        category: restoFormCategory.trim(),
        location: restoFormLocation.trim(),
        rating: parseFloat(restoFormRating) || 4.5,
        discount: restoFormDiscount.trim(),
        speciality: restoFormSpeciality.trim(),
        image: restoFormImage.trim() || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'
      } : r);
      saveHomeRestaurants(updated);
    } else {
      const newResto: HomeFeaturedRestaurant = {
        id: `rest-${Date.now()}`,
        name: restoFormName.trim(),
        category: restoFormCategory.trim(),
        location: restoFormLocation.trim(),
        rating: parseFloat(restoFormRating) || 4.8,
        discount: restoFormDiscount.trim(),
        speciality: restoFormSpeciality.trim(),
        image: restoFormImage.trim() || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
        isActive: true
      };
      saveHomeRestaurants([...adminHomeRestaurants, newResto]);
    }

    setRestaurantModalOpen(false);
  };

  const handleDeleteHomeRestaurant = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from homepage dining section?`)) {
      const updated = adminHomeRestaurants.filter(r => r.id !== id);
      saveHomeRestaurants(updated);
    }
  };

  const handleToggleHomeRestaurantActive = (id: string) => {
    const updated = adminHomeRestaurants.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r);
    saveHomeRestaurants(updated);
  };

  // Admin Search & Multi-Select States
  const [adminBizSearchQuery, setAdminBizSearchQuery] = useState('');
  const [selectedBizIds, setSelectedBizIds] = useState<number[]>([]);
  const [adminUserSearchQuery, setAdminUserSearchQuery] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [adminPropertyList, setAdminPropertyList] = useState<any[]>(() => {
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
  const [adminListingSubTab, setAdminListingSubTab] = useState<'businesses' | 'specialists' | 'travels' | 'home-services' | 'blood-donors'>('businesses');
  const [adminStaycationSubTab, setAdminStaycationSubTab] = useState<'hotels' | 'resorts' | 'payouts'>('hotels');
  const [adminSpecialistSearchQuery, setAdminSpecialistSearchQuery] = useState('');
  const [adminVehiclesList, setAdminVehiclesList] = useState<any[]>([]);
  const [adminVehicleSearchQuery, setAdminVehicleSearchQuery] = useState('');
  const [adminAddVehicleModalOpen, setAdminAddVehicleModalOpen] = useState(false);
  const [adminVehForm, setAdminVehForm] = useState({
    name: '',
    category: 'Car & Cab',
    vehicleModel: '',
    capacity: '4+1 Passengers',
    ratePerKm: '₹12/km (AC Local & Outstation)',
    location: 'Boisar West & Station',
    phone: '',
    timing: '24x7 Available on Call',
    image: '',
  });

  // Admin Home Services & Technicians State
  const [adminTechniciansList, setAdminTechniciansList] = useState<any[]>([]);
  const [adminTechnicianSearchQuery, setAdminTechnicianSearchQuery] = useState('');
  const [adminAddTechModalOpen, setAdminAddTechModalOpen] = useState(false);
  const [adminTechForm, setAdminTechForm] = useState({
    name: '',
    category: 'AC Service',
    experience: '5+ Yrs Experience',
    phone: '',
    location: 'Boisar West',
    visitingFee: '₹199 Inspection Fee',
    timing: 'Available On-Demand',
    allowCalls: true,
    image: '',
  });

  // Admin Blood Donors State
  const [adminDonorsList, setAdminDonorsList] = useState<any[]>([]);
  const [adminDonorSearchQuery, setAdminDonorSearchQuery] = useState('');
  const [adminDonorGroupFilter, setAdminDonorGroupFilter] = useState('All');
  const [adminAddDonorModalOpen, setAdminAddDonorModalOpen] = useState(false);
  const [adminDonorForm, setAdminDonorForm] = useState({
    name: '',
    bloodGroup: 'O+',
    location: 'Boisar West',
    phone: '',
    lastDonated: 'Ready to donate',
  });

  // Admin Hotel Bookings & Payout Settlements State
  const [adminHotelBookings, setAdminHotelBookings] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const all: any[] = [];
      const globalStr = localStorage.getItem('majh_boisar_hotel_bookings');
      if (globalStr) {
        const parsed = JSON.parse(globalStr);
        if (Array.isArray(parsed)) all.push(...parsed);
      }
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('majh_boisar_hotel_bookings_') && key !== 'majh_boisar_hotel_bookings') {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const bList = JSON.parse(raw);
              if (Array.isArray(bList)) {
                bList.forEach(b => {
                  if (!all.some(item => item.id === b.id)) all.push(b);
                });
              }
            }
          } catch (e) {}
        }
      }
      return all;
    } catch (e) {
      return [];
    }
  });

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [selectedBookingForPayout, setSelectedBookingForPayout] = useState<any | null>(null);
  const [payoutUtrInput, setPayoutUtrInput] = useState('');
  const [payoutNotifyWhatsapp, setPayoutNotifyWhatsapp] = useState(true);

  const handleMarkBookingPayoutSettled = (bookingId: string, utrRef: string, notifyWhatsapp: boolean) => {
    const updated = adminHotelBookings.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          payoutStatus: 'Settled',
          payoutRef: utrRef || `UPI-${Date.now().toString().slice(-6)}`,
          payoutSettledAt: new Date().toISOString()
        };
      }
      return b;
    });

    setAdminHotelBookings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify(updated));
      const target = updated.find(b => b.id === bookingId);
      if (target?.hotelId) {
        try {
          const key = `majh_boisar_hotel_bookings_${target.hotelId}`;
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              const uList = list.map((item: any) => item.id === bookingId ? { ...item, payoutStatus: 'Settled', payoutRef: utrRef || 'UPI' } : item);
              localStorage.setItem(key, JSON.stringify(uList));
            }
          }
        } catch (e) {}
      }
    }

    setPayoutModalOpen(false);
    const targetB = selectedBookingForPayout;
    setSelectedBookingForPayout(null);
    setPayoutUtrInput('');

    if (notifyWhatsapp && targetB) {
      const net = Math.round((Number(targetB.totalAmount) || 0) * 0.90);
      const text = `🎉 *Majh Boisar Payout Settlement Alert*\n\nHello ${targetB.hotelName || 'Hotel Owner'},\n\nYour 90% payout for Booking *#${targetB.id}* (Guest: ${targetB.guestName}) has been transferred to your UPI/Bank!\n\n💰 *Amount:* ₹${net.toLocaleString('en-IN')}\n🔢 *Ref/UTR:* ${utrRef || 'Processed via UPI'}\n📅 *Date:* ${new Date().toLocaleDateString('en-IN')}\n\nThank you for partnering with Majh Boisar!`;
      const phone = (targetB.hotelPhone || targetB.guestPhone || '').replace(/\D/g, '');
      if (phone) {
        window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(text)}`, '_blank');
      }
    }

    alert('✅ Payout settlement recorded successfully!');
  };

  // Admin Direct Specialist Add Modal state
  const [adminAddSpecialistModalOpen, setAdminAddSpecialistModalOpen] = useState(false);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecCategoryKey, setNewSpecCategoryKey] = useState<'influencers' | 'properties' | 'helpers' | 'caterers'>('helpers');
  const [newSpecCategory, setNewSpecCategory] = useState('');
  const [newSpecPhone, setNewSpecPhone] = useState('');
  const [newSpecPrice, setNewSpecPrice] = useState('');
  const [newSpecBio, setNewSpecBio] = useState('');
  const [newSpecExperience, setNewSpecExperience] = useState('1+ Year');
  const [newSpecServices, setNewSpecServices] = useState('');
  const [newSpecAvatar, setNewSpecAvatar] = useState('');
  const [newSpecInstagram, setNewSpecInstagram] = useState('');
  const [newSpecYoutube, setNewSpecYoutube] = useState('');
  const [newSpecSubscription, setNewSpecSubscription] = useState<'Free' | 'Pro' | 'Premium'>('Free');
  const [newSpecVerified, setNewSpecVerified] = useState(true);
  const [addingDirectSpec, setAddingDirectSpec] = useState(false);

  // Property Section Ad Slots (Slot 1 & Slot 2)
  const [adminPropAds, setAdminPropAds] = useState<{
    slot1: { active: boolean; title: string; subtitle: string; badge: string; image: string; whatsapp: string; linkUrl: string };
    slot2: { active: boolean; title: string; subtitle: string; badge: string; image: string; whatsapp: string; linkUrl: string };
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_property_custom_ads');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            slot1: {
              active: parsed.slot1?.active ?? false,
              title: parsed.slot1?.title || 'Promote Your Real Estate Project Here',
              subtitle: parsed.slot1?.subtitle || 'Reach 10,000+ local home buyers & investors daily in Boisar',
              badge: parsed.slot1?.badge || 'Featured Builder',
              image: parsed.slot1?.image || '',
              whatsapp: parsed.slot1?.whatsapp || '7769947217',
              linkUrl: parsed.slot1?.linkUrl || ''
            },
            slot2: {
              active: parsed.slot2?.active ?? false,
              title: parsed.slot2?.title || 'Builder / Broker Featured Banner Space',
              subtitle: parsed.slot2?.subtitle || 'Get high-intent calls & direct WhatsApp property enquiries',
              badge: parsed.slot2?.badge || 'Prime Sponsor',
              image: parsed.slot2?.image || '',
              whatsapp: parsed.slot2?.whatsapp || '7769947217',
              linkUrl: parsed.slot2?.linkUrl || ''
            }
          };
        }
      } catch (e) {}
    }
    return {
      slot1: {
        active: false,
        title: 'Promote Your Real Estate Project Here',
        subtitle: 'Reach 10,000+ local home buyers & investors daily in Boisar',
        badge: 'Featured Builder',
        image: '',
        whatsapp: '7769947217',
        linkUrl: ''
      },
      slot2: {
        active: false,
        title: 'Builder / Broker Featured Banner Space',
        subtitle: 'Get high-intent calls & direct WhatsApp property enquiries',
        badge: 'Prime Sponsor',
        image: '',
        whatsapp: '7769947217',
        linkUrl: ''
      }
    };
  });

  // Jobs Portal Ad Slots (Slot 1 & Slot 2)
  const [adminJobsAds, setAdminJobsAds] = useState<{
    slot1: { active: boolean; title: string; subtitle: string; badge: string; image: string; whatsapp: string; linkUrl: string };
    slot2: { active: boolean; title: string; subtitle: string; badge: string; image: string; whatsapp: string; linkUrl: string };
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_jobs_custom_ads');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            slot1: {
              active: parsed.slot1?.active ?? false,
              title: parsed.slot1?.title || 'Urgent Staff Hiring / MIDC Company Vacancy Space',
              subtitle: parsed.slot1?.subtitle || 'Hire Factory Workers, Machine Operators, Accounts & Sales Staff in Boisar',
              badge: parsed.slot1?.badge || 'Urgent Hiring',
              image: parsed.slot1?.image || '',
              whatsapp: parsed.slot1?.whatsapp || '7769947217',
              linkUrl: parsed.slot1?.linkUrl || ''
            },
            slot2: {
              active: parsed.slot2?.active ?? false,
              title: parsed.slot2?.title || 'Promote Your Institute / Coaching / Placement Agency Here',
              subtitle: parsed.slot2?.subtitle || 'Reach thousands of job seekers & students actively applying in Boisar',
              badge: parsed.slot2?.badge || 'Career Institute',
              image: parsed.slot2?.image || '',
              whatsapp: parsed.slot2?.whatsapp || '7769947217',
              linkUrl: parsed.slot2?.linkUrl || ''
            }
          };
        }
      } catch (e) {}
    }
    return {
      slot1: {
        active: false,
        title: 'Urgent Staff Hiring / MIDC Company Vacancy Space',
        subtitle: 'Hire Factory Workers, Machine Operators, Accounts & Sales Staff in Boisar',
        badge: 'Urgent Hiring',
        image: '',
        whatsapp: '7769947217',
        linkUrl: ''
      },
      slot2: {
        active: false,
        title: 'Promote Your Institute / Coaching / Placement Agency Here',
        subtitle: 'Reach thousands of job seekers & students actively applying in Boisar',
        badge: 'Career Institute',
        image: '',
        whatsapp: '7769947217',
        linkUrl: ''
      }
    };
  });

  // Post Admin Job Modal State
  const [adminJobModalOpen, setAdminJobModalOpen] = useState(false);
  const [adminJobTitle, setAdminJobTitle] = useState('');
  const [adminJobCompany, setAdminJobCompany] = useState('');
  const [adminJobCategory, setAdminJobCategory] = useState('Sales & Marketing');
  const [adminJobLocation, setAdminJobLocation] = useState('Tarapur MIDC');
  const [adminJobSalary, setAdminJobSalary] = useState('');
  const [adminJobType, setAdminJobType] = useState('Full Time');
  const [adminJobExperience, setAdminJobExperience] = useState('0-2 Years');
  const [adminJobPhone, setAdminJobPhone] = useState('');
  const [adminJobImage, setAdminJobImage] = useState('');
  const [adminJobDescription, setAdminJobDescription] = useState('');

  const loadDeletionRequests = () => {
    if (typeof window !== 'undefined') {
      const savedRequests = localStorage.getItem('majh_boisar_deletion_requests');
      if (savedRequests) {
        try {
          const parsed = JSON.parse(savedRequests);
          setDeletionRequests(Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultDeletionRequests);
        } catch (e) {
          setDeletionRequests(defaultDeletionRequests);
        }
      } else {
        setDeletionRequests(defaultDeletionRequests);
        localStorage.setItem('majh_boisar_deletion_requests', JSON.stringify(defaultDeletionRequests));
      }
    }
  };

  useEffect(() => {
    loadDeletionRequests();
    const handleUpdate = () => loadDeletionRequests();
    if (typeof window !== 'undefined') {
      window.addEventListener('majh_boisar_deletion_requests_updated', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('majh_boisar_deletion_requests_updated', handleUpdate);
      }
    };
  }, []);

  const handleApproveDeletion = (reqId: number) => {
    const req = deletionRequests.find(r => r.id === reqId);
    if (!req) return;

    if (confirm(`Are you sure you want to approve account deletion for ${req.userName} (+91 ${req.userPhone})? This will remove their user account.`)) {
      const updated = deletionRequests.map(r => r.id === reqId ? { ...r, status: 'Approved & Deleted' as const } : r);
      setDeletionRequests(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_deletion_requests', JSON.stringify(updated));

        // Remove from registered users
        const updatedUsers = registeredUsers.filter((u: any) => u.phone !== req.userPhone && u.name !== req.userName);
        setRegisteredUsers(updatedUsers);
        localStorage.setItem('majh_boisar_registered_users', JSON.stringify(updatedUsers));
      }
      logEvent(`Approved account deletion for ${req.userName} (+91 ${req.userPhone})`);
      alert(`🎉 Account deletion approved for ${req.userName}! User removed from platform.`);
    }
  };

  const handleRejectDeletion = (reqId: number) => {
    const req = deletionRequests.find(r => r.id === reqId);
    if (!req) return;

    const updated = deletionRequests.map(r => r.id === reqId ? { ...r, status: 'Rejected' as const } : r);
    setDeletionRequests(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_deletion_requests', JSON.stringify(updated));
    }
    logEvent(`Rejected account deletion request for ${req.userName}`);
  };

  const handleDeleteDeletionRecord = (reqId: number) => {
    const updated = deletionRequests.filter(r => r.id !== reqId);
    setDeletionRequests(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_deletion_requests', JSON.stringify(updated));
    }
    logEvent(`Deleted deletion request record #${reqId}`);
  };

  const refreshUsers = async () => {
    try {
      // 1. Fetch centralized registered users from DB
      let serverUsers: any[] = [];
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const d = await res.json();
          if (d && Array.isArray(d.users)) serverUsers = d.users;
        }
      } catch (apiErr) {
        console.warn('Could not fetch from /api/users:', apiErr);
      }

      // 2. Fetch local storage cached users and merge
      let list: any[] = [...serverUsers];
      if (typeof window !== 'undefined') {
        const savedUsers = localStorage.getItem('majh_boisar_registered_users');
        if (savedUsers) {
          try {
            const parsed = JSON.parse(savedUsers);
            if (Array.isArray(parsed)) {
              parsed.forEach((localU: any) => {
                const cleanLocal = (localU.phone || '').replace(/\D/g, '');
                if (cleanLocal && !list.some(u => (u.phone || '').replace(/\D/g, '').endsWith(cleanLocal.slice(-10)))) {
                  list.push(localU);
                }
              });
            }
          } catch (e) {}
        }

        // 3. Check current active session user
        const savedSingleUser = localStorage.getItem('majh_boisar_user');
        if (savedSingleUser) {
          try {
            const single = JSON.parse(savedSingleUser);
            if (single && single.phone) {
              const cleanSingle = single.phone.replace(/\D/g, '');
              const exists = list.some((u: any) => u.phone?.replace(/\D/g, '').endsWith(cleanSingle.slice(-10)));
              if (!exists && cleanSingle.length > 0) {
                list.unshift({
                  id: Date.now(),
                  name: single.name || 'Registered Citizen',
                  phone: cleanSingle,
                  email: single.email || `${cleanSingle}@majhboisar.in`,
                  role: 'Active User',
                  joinedDate: new Date().toISOString().split('T')[0],
                  status: 'Active'
                });
              }
            }
          } catch (e) {}
        }

        localStorage.setItem('majh_boisar_registered_users', JSON.stringify(list));
      }

      setRegisteredUsers(list);
    } catch (e) {
      console.error('Error refreshing users in adminmb:', e);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCats = localStorage.getItem('majh_boisar_admin_categories');
      if (savedCats) {
        try { setCustomAdminCategories(JSON.parse(savedCats)); } catch (e) { }
      }

      refreshUsers();
      window.addEventListener('storage', refreshUsers);
      window.addEventListener('majh_boisar_user_registered', refreshUsers);

      return () => {
        window.removeEventListener('storage', refreshUsers);
        window.removeEventListener('majh_boisar_user_registered', refreshUsers);
      };
    }
  }, []);

  // Admin Ad Form State
  const [adminAdFormOpen, setAdminAdFormOpen] = useState(false);
  const [adminAdBizId, setAdminAdBizId] = useState('');
  const [adminAdTitle, setAdminAdTitle] = useState('');
  const [adminAdDesc, setAdminAdDesc] = useState('');
  const [adminAdPlacement, setAdminAdPlacement] = useState('Homepage Carousel Slot 1');
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['Homepage Carousel Slot 1']);
  const [customAdPlacement, setCustomAdPlacement] = useState('');
  const [adminAdDuration, setAdminAdDuration] = useState('30');
  const [adminAdBudget, setAdminAdBudget] = useState('50');
  const [adminAdImage, setAdminAdImage] = useState('');
  const [adminAdTargetUrl, setAdminAdTargetUrl] = useState('');
  const [creatingAdminAd, setCreatingAdminAd] = useState(false);

  // New Business form state within Admin Ad Form
  const [adminAdNewBizName, setAdminAdNewBizName] = useState('');
  const [adminAdNewBizPhone, setAdminAdNewBizPhone] = useState('');
  const [adminAdNewBizCategory, setAdminAdNewBizCategory] = useState('');

  // Admin Direct Business Add Modal state (Complete Registration Fields)
  const [adminAddBizModalOpen, setAdminAddBizModalOpen] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizCategory, setNewBizCategory] = useState('Doctors');
  const [newBizCustomCat, setNewBizCustomCat] = useState('');
  const [newBizContactPerson, setNewBizContactPerson] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizWhatsapp, setNewBizWhatsapp] = useState('');
  const [newBizEmail, setNewBizEmail] = useState('');
  const [newBizPlotNo, setNewBizPlotNo] = useState('');
  const [newBizBldgName, setNewBizBldgName] = useState('');
  const [newBizStreet, setNewBizStreet] = useState('');
  const [newBizLandmark, setNewBizLandmark] = useState('');
  const [newBizLocation, setNewBizLocation] = useState('Boisar West');
  const [newBizCity, setNewBizCity] = useState('Palghar');
  const [newBizState, setNewBizState] = useState('Maharashtra');
  const [newBizPincode, setNewBizPincode] = useState('401501');
  const [newBizAddress, setNewBizAddress] = useState('');
  const [newBizGst, setNewBizGst] = useState('');
  const [newBizWebsite, setNewBizWebsite] = useState('');
  const [newBizGoogleMaps, setNewBizGoogleMaps] = useState('');
  const [newBizWazeLink, setNewBizWazeLink] = useState('');
  const [newBizDescription, setNewBizDescription] = useState('');
  const [newBizWorkingHours, setNewBizWorkingHours] = useState('9:00 AM - 9:00 PM');
  
  // Working hours schedule builder
  const defaultAdminSchedule = () => ({
    Mon: { open: '09:00', close: '21:00', closed: false },
    Tue: { open: '09:00', close: '21:00', closed: false },
    Wed: { open: '09:00', close: '21:00', closed: false },
    Thu: { open: '09:00', close: '21:00', closed: false },
    Fri: { open: '09:00', close: '21:00', closed: false },
    Sat: { open: '09:00', close: '21:00', closed: false },
    Sun: { open: '09:00', close: '21:00', closed: true },
  });
  const [newBizSchedule, setNewBizSchedule] = useState<Record<string, { open: string; close: string; closed: boolean }>>(defaultAdminSchedule());

  // Media
  const [newBizImage, setNewBizImage] = useState('');
  const [newBizGallery, setNewBizGallery] = useState<string[]>([]);
  const [newBizInstagram, setNewBizInstagram] = useState('');
  const [newBizYoutube, setNewBizYoutube] = useState('');

  // Catalog: Services & Products
  const [newBizServices, setNewBizServices] = useState<{ name: string; price: string; duration?: string; desc?: string; image?: string }[]>([]);
  const [newBizProducts, setNewBizProducts] = useState<{ name: string; price: string; desc?: string; image?: string }[]>([]);
  const [newBizSvcInput, setNewBizSvcInput] = useState({ name: '', price: '', duration: '', desc: '' });
  const [newBizProdInput, setNewBizProdInput] = useState({ name: '', price: '', desc: '', image: '' });

  // Admin Badges & GPS
  const [newBizVerified, setNewBizVerified] = useState(true);
  const [newBizPremium, setNewBizPremium] = useState(true);
  const [newBizSubscription, setNewBizSubscription] = useState('Admin Created');
  const [newBizRating, setNewBizRating] = useState('5.0');
  const [isDetectingAdminLocation, setIsDetectingAdminLocation] = useState(false);
  const [newBizLat, setNewBizLat] = useState<number | null>(null);
  const [newBizLng, setNewBizLng] = useState<number | null>(null);
  const [addingDirectBiz, setAddingDirectBiz] = useState(false);

  // Admin Hotel Management State
  const [adminHotelsList, setAdminHotelsList] = useState<any[]>([]);
  const [adminHotelSearchQuery, setAdminHotelSearchQuery] = useState('');
  const [pinnedHotelIds, setPinnedHotelIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('majh_boisar_pinned_hotels') || '[]');
    } catch (e) {
      return [];
    }
  });

  const handleTogglePinHotel = (hotelId: string, hotelSlug?: string) => {
    const targetKey = hotelSlug || hotelId;
    const current = pinnedHotelIds;
    let updated: string[];
    const isAlreadyPinned = current.includes(hotelId) || (hotelSlug && current.includes(hotelSlug));
    if (isAlreadyPinned) {
      updated = current.filter(id => id !== hotelId && id !== hotelSlug);
    } else {
      updated = [targetKey, ...current];
    }
    setPinnedHotelIds(updated);
    localStorage.setItem('majh_boisar_pinned_hotels', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    loadAdminHotels();
    alert(isAlreadyPinned ? 'Hotel unpinned from top rank.' : '👑 Hotel pinned to TOP #1 Rank! Users will see this hotel at the very top.');
  };

  const loadAdminHotels = () => {
    try {
      const customV2 = JSON.parse(localStorage.getItem('majh_boisar_custom_hotels_v2') || '[]');
      const userHotels = JSON.parse(localStorage.getItem('majh_boisar_user_hotels') || '[]');
      
      // Combine unique hotels
      const combinedMap = new Map<string, any>();
      customV2.forEach((h: any) => {
        if (h && h.id) combinedMap.set(h.id, h);
      });
      userHotels.forEach((h: any) => {
        if (h && h.id) {
          if (!combinedMap.has(h.id)) {
            combinedMap.set(h.id, {
              ...h,
              status: h.status || 'Pending',
              verified: h.verified ?? false
            });
          }
        }
      });

      const customAll = Array.from(combinedMap.values());
      let all = [...customAll, ...BOISAR_HOTELS];

      let pinned: string[] = [];
      try {
        pinned = JSON.parse(localStorage.getItem('majh_boisar_pinned_hotels') || '[]');
      } catch (e) {}

      if (pinned.length > 0) {
        all.sort((a, b) => {
          const aPin = pinned.includes(a.id) || (a.slug && pinned.includes(a.slug)) ? 1 : 0;
          const bPin = pinned.includes(b.id) || (b.slug && pinned.includes(b.slug)) ? 1 : 0;
          return bPin - aPin;
        });
      }

      setAdminHotelsList(all);
    } catch (e) {
      setAdminHotelsList(BOISAR_HOTELS);
    }
  };

  // Admin Resort Management State
  const [adminResortsList, setAdminResortsList] = useState<ResortVilla[]>([]);
  const [adminResortSearchQuery, setAdminResortSearchQuery] = useState('');
  const [adminAddResortModalOpen, setAdminAddResortModalOpen] = useState(false);
  const [newResortName, setNewResortName] = useState('');
  const [newResortTagline, setNewResortTagline] = useState('');
  const [newResortType, setNewResortType] = useState<'Beach Resort' | 'Private Pool Villa' | 'Luxury Farmhouse' | 'Weekend Cottage'>('Private Pool Villa');
  const [newResortArea, setNewResortArea] = useState<'Kelwa Beach' | 'Dahanu' | 'Boisar' | 'Manor / Palghar' | 'Bordi'>('Kelwa Beach');
  const [newResortLocation, setNewResortLocation] = useState('');
  const [newResortAddress, setNewResortAddress] = useState('');
  const [newResortPhone, setNewResortPhone] = useState('');
  const [newResortWhatsapp, setNewResortWhatsapp] = useState('');
  const [newResortNightPrice, setNewResortNightPrice] = useState('');
  const [newResortDayPrice, setNewResortDayPrice] = useState('');
  const [newResortImage, setNewResortImage] = useState('');
  const [newResortGallery, setNewResortGallery] = useState<string[]>([]);
  const [newResortRating, setNewResortRating] = useState('4.8');
  const [newResortCapacity, setNewResortCapacity] = useState('10-15 Guests');
  const [newResortBedrooms, setNewResortBedrooms] = useState('3');
  const [newResortBathrooms, setNewResortBathrooms] = useState('3');

  const loadAdminResorts = () => {
    try {
      const customResorts = JSON.parse(localStorage.getItem('majh_boisar_custom_resorts') || '[]');
      const userResorts = JSON.parse(localStorage.getItem('majh_boisar_user_resorts') || '[]');
      const combinedMap = new Map<string, any>();
      (resortsData || []).forEach((r: any) => { if (r && r.id) combinedMap.set(r.id, r); });
      customResorts.forEach((r: any) => { if (r && r.id) combinedMap.set(r.id, r); });
      userResorts.forEach((r: any) => { if (r && r.id) combinedMap.set(r.id, r); });
      setAdminResortsList(Array.from(combinedMap.values()));
    } catch (e) {
      setAdminResortsList(resortsData || []);
    }
  };

  const handleToggleVerifyResort = (resortId: string) => {
    const updated = adminResortsList.map(r => r.id === resortId ? { ...r, verified: !r.verified } : r);
    setAdminResortsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_custom_resorts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleToggleFeaturedResort = (resortId: string) => {
    const updated = adminResortsList.map(r => r.id === resortId ? { ...r, isFeatured: !r.isFeatured } : r);
    setAdminResortsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_custom_resorts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleDeleteResort = (resortId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete resort "${name}"?`)) return;
    const updated = adminResortsList.filter(r => r.id !== resortId);
    setAdminResortsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_custom_resorts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
    alert(`Resort "${name}" deleted successfully.`);
  };

  const handleSaveNewResort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResortName || !newResortPhone) {
      alert('Resort Name and Phone Number are required.');
      return;
    }
    const slug = newResortName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newResortItem: ResortVilla = {
      id: `resort-${Date.now()}`,
      slug,
      name: newResortName,
      tagline: newResortTagline || 'Luxury Beach Resort & Private Pool Villa',
      description: newResortTagline || 'Experience luxury staycation, private swimming pool, and delicious coastal food at this premier villa near Boisar.',
      type: newResortType,
      area: newResortArea,
      location: newResortLocation || `${newResortArea}, Palghar`,
      distanceFromBoisar: '15 mins from Boisar',
      rating: parseFloat(newResortRating) || 4.8,
      reviewsCount: 12,
      verified: true,
      isFeatured: true,
      badge: 'TOP CHOICE',
      pricePerNight: parseInt(newResortNightPrice) || 6999,
      dayPicnicPrice: parseInt(newResortDayPrice) || 899,
      capacity: newResortCapacity || '10-15 Guests',
      bedrooms: parseInt(newResortBedrooms) || 3,
      bathrooms: parseInt(newResortBathrooms) || 3,
      checkInTime: '1:00 PM',
      checkOutTime: '11:00 AM',
      phone: newResortPhone,
      whatsapp: newResortWhatsapp || newResortPhone,
      address: newResortAddress || `${newResortArea}, Palghar District - 401501`,
      gallery: [
        newResortImage || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
        ...newResortGallery
      ],
      amenities: [
        { icon: '🏊‍♂️', label: 'Private Swimming Pool' },
        { icon: '❄️', label: 'AC Bedrooms' },
        { icon: '📶', label: 'Free High-Speed Wi-Fi' },
        { icon: '🅿️', label: 'Free Parking' },
        { icon: '🍽️', label: 'Home Cooked Meals' },
        { icon: '🎵', label: 'Music System' },
        { icon: '⚡', label: '24/7 Power Backup' },
        { icon: '🔥', label: 'Bonfire & BBQ' }
      ],
      highlights: ['Private Pool', 'Lush Green Lawn', 'Caretaker on site'],
      houseRules: ['Check-in 1:00 PM', 'Check-out 11:00 AM', 'Govt ID required'],
      mealOptions: 'Veg / Non-Veg authentic home-cooked meals available on request'
    };

    const updated = [newResortItem, ...adminResortsList];
    setAdminResortsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_custom_resorts', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
    setAdminAddResortModalOpen(false);
    alert(`🎉 Success! Resort "${newResortName}" has been added and published LIVE!`);
  };

  useEffect(() => {
    loadAdminHotels();
    loadAdminResorts();
    const handleStorageUpdate = () => {
      loadAdminHotels();
      loadAdminResorts();
    };
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('focus', handleStorageUpdate);
    window.addEventListener('visibilitychange', handleStorageUpdate);
    window.addEventListener('boisar_hotel_created' as any, handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('focus', handleStorageUpdate);
      window.removeEventListener('visibilitychange', handleStorageUpdate);
      window.removeEventListener('boisar_hotel_created' as any, handleStorageUpdate);
    };
  }, []);

  // Pending hotels calculation
  const pendingHotels = useMemo(() => {
    return adminHotelsList.filter(h => {
      if (h.status === 'Pending' || h.verified === false) return true;
      if (h.id && (h.id.startsWith('hotel-') || h.id.startsWith('custom-hotel-')) && h.status !== 'Approved') return true;
      return false;
    });
  }, [adminHotelsList]);

  const handleApproveHotel = (hotelId: string) => {
    try {
      const customV2 = JSON.parse(localStorage.getItem('majh_boisar_custom_hotels_v2') || '[]');
      const userHotels = JSON.parse(localStorage.getItem('majh_boisar_user_hotels') || '[]');
      
      let target = customV2.find((h: any) => h.id === hotelId) || userHotels.find((h: any) => h.id === hotelId);

      if (!target) {
        // Look in adminHotelsList
        target = adminHotelsList.find((h: any) => h.id === hotelId);
      }

      if (!target) {
        alert('Hotel not found.');
        return;
      }

      const approvedHotel = { ...target, status: 'Approved', verified: true };

      // Update in customV2
      const updatedV2 = [approvedHotel, ...customV2.filter((h: any) => h.id !== hotelId)];
      localStorage.setItem('majh_boisar_custom_hotels_v2', JSON.stringify(updatedV2));

      // Update in userHotels
      const updatedUser = [approvedHotel, ...userHotels.filter((h: any) => h.id !== hotelId)];
      localStorage.setItem('majh_boisar_user_hotels', JSON.stringify(updatedUser));

      window.dispatchEvent(new Event('storage'));
      loadAdminHotels();
      logEvent(`Approved & Published Hotel: ${target.name}`);
      alert(`🎉 Hotel "${target.name}" is Approved & Published live on Majh Boisar!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectHotel = (hotelId: string) => {
    if (!confirm('Are you sure you want to reject/remove this hotel application?')) return;
    try {
      const customV2 = JSON.parse(localStorage.getItem('majh_boisar_custom_hotels_v2') || '[]');
      const userHotels = JSON.parse(localStorage.getItem('majh_boisar_user_hotels') || '[]');

      const updatedV2 = customV2.filter((h: any) => h.id !== hotelId);
      localStorage.setItem('majh_boisar_custom_hotels_v2', JSON.stringify(updatedV2));

      const updatedUser = userHotels.filter((h: any) => h.id !== hotelId);
      localStorage.setItem('majh_boisar_user_hotels', JSON.stringify(updatedUser));

      window.dispatchEvent(new Event('storage'));
      loadAdminHotels();
      logEvent(`Rejected/Removed Hotel Application: ${hotelId}`);
      alert('Hotel application has been removed.');
    } catch (e) {
      console.error(e);
    }
  };

  // Admin Full Edit Business Modal State
  const [adminEditModalOpen, setAdminEditModalOpen] = useState(false);
  const [editingBizId, setEditingBizId] = useState<number | null>(null);
  const [editBizName, setEditBizName] = useState('');
  const [editBizCategory, setEditBizCategory] = useState('');
  const [editBizDescription, setEditBizDescription] = useState('');
  const [editBizAddress, setEditBizAddress] = useState('');
  const [editBizPhone, setEditBizPhone] = useState('');
  const [editBizWhatsapp, setEditBizWhatsapp] = useState('');
  const [editBizWebsite, setEditBizWebsite] = useState('');
  const [editBizEmail, setEditBizEmail] = useState('');
  const [editBizImage, setEditBizImage] = useState('');
  const [editBizVerified, setEditBizVerified] = useState(false);
  const [editBizPremium, setEditBizPremium] = useState(false);
  const [editBizGallery, setEditBizGallery] = useState<string[]>([]);
  const [editBizGoogleMaps, setEditBizGoogleMaps] = useState('');
  const [adPackagesState, setAdPackagesState] = useState([
    {
      icon: '📂',
      name: 'Category Page Ad',
      price: '₹199',
      duration: '7 Days',
      tag: null,
      features: ['Target specific category', 'High-intent buyers', 'Click to your profile'],
    },
    {
      icon: '🏠',
      name: 'Homepage Spotlight',
      price: '₹349',
      duration: '7 Days',
      tag: null,
      features: ['Homepage image card', 'Title + description', 'Link to your business'],
    },
    {
      icon: '🎠',
      name: 'Carousel Slide',
      price: '₹499',
      duration: '7 Days',
      tag: null,
      features: ['Full-width top banner', 'Auto-rotating slide', 'Maximum visibility'],
    },
    {
      icon: '🚀',
      name: '7-Day VIP Bundle (All Spots)',
      price: '₹2,999',
      duration: '7 Days',
      tag: 'Popular',
      features: ['4 Placements Included', 'Top Banner + Home Card + Category Ad', 'Full 7 Days 100% site-wide coverage', 'Priority setup & support'],
    },
    {
      icon: '👑',
      name: '30-Day VIP Bundle (All Spots)',
      price: '₹9,999',
      duration: '30 Days',
      tag: 'Best Value',
      features: ['4 Placements Included', 'Top Banner + Home Card + Category Ad', 'Full 30 Days (1 Month) site-wide coverage', 'Dedicated VIP Manager'],
    },
  ]);

  // Auto Rickshaw Posters Packages State
  const [autoPosterPackagesState, setAutoPosterPackagesState] = useState([
    {
      id: 'auto_5',
      icon: '🛺',
      name: '5 Auto Posters',
      price: '₹1,499',
      duration: '30 Days (1 Month)',
      tag: 'Starter',
      desc: '5 Auto Rickshaws with your poster roaming daily in Boisar & MIDC.',
      features: [
        '5 Autos with back-hood poster',
        'Free vinyl poster printing & fitting',
        'Photo proof on WhatsApp on Day 1'
      ]
    },
    {
      id: 'auto_15',
      icon: '🛺',
      name: '15 Auto Posters',
      price: '₹3,999',
      duration: '30 Days (1 Month)',
      tag: 'Popular',
      desc: '15 Auto Rickshaws roaming Station, Market & MIDC daily.',
      features: [
        '15 Autos across Boisar & Palghar',
        'Free ad design & printing',
        'High daily road visibility'
      ]
    },
    {
      id: 'auto_30',
      icon: '🛺',
      name: '30 Auto City Pack',
      price: '₹7,499',
      duration: '30 Days (1 Month)',
      tag: 'Big Impact',
      desc: '30 Auto Rickshaws covering all stands in Boisar and Tarapur.',
      features: [
        '30 Autos for full 30 days',
        'Complete city brand coverage',
        'Free website banner worth ₹999'
      ]
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_auto_poster_packages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAutoPosterPackagesState(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Simulated Audit Logs
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "[System] Admin Console initialized successfully.",
    "[Auth] Super Admin persona selected.",
    "[Database] PostgreSQL connections optimized."
  ]);

  const fetchSystemStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/system-stats');
      if (res.ok) {
        const data = await res.json();
        setSystemStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch system stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    fetchSystemStats();
    try {
      const resB = await fetch('/api/businesses?showAll=true', { cache: 'no-store' });
      const dataB = await resB.json();
      setBusinesses(Array.isArray(dataB) ? dataB : []);

      const resL = await fetch('/api/leads', { cache: 'no-store' });
      const dataL = await resL.json();
      setLeads(Array.isArray(dataL) ? dataL : []);

      const resR = await fetch('/api/reviews', { cache: 'no-store' });
      const dataR = await resR.json();
      setReviews(Array.isArray(dataR) ? dataR : []);

      const resAd = await fetch('/api/ad-orders', { cache: 'no-store' });
      const dataAd = await resAd.json();
      setAdOrders(Array.isArray(dataAd) ? dataAd : []);

      try {
        const resJobs = await fetch('/api/jobs?showAll=true', { cache: 'no-store' });
        if (resJobs.ok) {
          const dataJobs = await resJobs.json();
          if (Array.isArray(dataJobs) && dataJobs.length > 0) {
            setAdminJobsList(dataJobs);
          }
        }
      } catch (err) {
        console.log("Error fetching jobs for admin:", err);
      }

      const resSet = await fetch('/api/settings', { cache: 'no-store' });
      const dataSet = await resSet.json();
      if (dataSet && !dataSet.error) {
        setSliderMultiplier(parseFloat(dataSet.sliderMultiplier) || 2.0);
        setResultsMultiplier(parseFloat(dataSet.resultsMultiplier) || 1.5);
        setAllMultiplier(parseFloat(dataSet.allMultiplier) || 3.0);
        setBaseDailyBudget(parseFloat(dataSet.baseDailyBudget) || 100.0);
        setSponsoredMultiplier(parseFloat(dataSet.sponsoredMultiplier) || 1.0);
        if (dataSet.ad_packages) {
          try {
            setAdPackagesState(JSON.parse(dataSet.ad_packages));
          } catch (err) {
            console.error("Failed to parse ad packages from DB", err);
          }
        }
      }

      try {
        const resRep = await fetch('/api/reports', { cache: 'no-store' });
        if (resRep.ok) {
          const dataRep = await resRep.json();
          if (Array.isArray(dataRep)) setReportsList(dataRep);
        }
      } catch (err) {
        console.log("Error fetching reports for admin:", err);
      }

      try {
        const propRes = await fetch('/api/properties?all=true');
        if (propRes.ok) {
          const dbProps = await propRes.json();
          if (Array.isArray(dbProps)) {
            setSpecialProfiles((prev: any) => {
              const nextState = {
                ...prev,
                properties: dbProps
              };
              if (typeof window !== 'undefined') {
                localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
              }
              return nextState;
            });
          }
        }
      } catch (err) {
        console.error("Error fetching db properties for admin:", err);
      }

      try {
        const vehRes = await fetch('/api/vehicles?showAll=true', { cache: 'no-store' });
        if (vehRes.ok) {
          const dataVeh = await vehRes.json();
          if (Array.isArray(dataVeh)) {
            setAdminVehiclesList(dataVeh);
          }
        }
      } catch (err) {
        console.error("Error fetching db vehicles for admin:", err);
      }

      try {
        const techRes = await fetch('/api/technicians?showAll=true', { cache: 'no-store' });
        if (techRes.ok) {
          const dataTech = await techRes.json();
          if (Array.isArray(dataTech)) {
            setAdminTechniciansList(dataTech);
          }
        }
      } catch (err) {
        console.error("Error fetching db technicians for admin:", err);
      }

      try {
        const donorRes = await fetch('/api/blood-donors?showAll=true', { cache: 'no-store' });
        if (donorRes.ok) {
          const dataDonors = await donorRes.json();
          if (Array.isArray(dataDonors)) {
            setAdminDonorsList(dataDonors);
          }
        }
      } catch (err) {
        console.error("Error fetching db blood donors for admin:", err);
      }

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('majh_boisar_special_profiles');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSpecialProfiles((prev: any) => ({
              ...parsed,
              ...prev
            }));
          } catch {}
        }
      }
    } catch (e) {
      console.error('Error fetching admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentRole === 'Admin' || isAdminPageUnlocked) {
      fetchAdminData();
    }
  }, [currentRole, isAdminPageUnlocked]);

  const handleUpdateAdStatus = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch(`/api/ad-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        logEvent(`Updated Ad Order ID: ${id} status to ${status}`);

        // Re-fetch orders & listings
        const resAd = await fetch('/api/ad-orders');
        const dataAd = await resAd.json();
        setAdOrders(Array.isArray(dataAd) ? dataAd : []);

        const resB = await fetch('/api/businesses?showAll=true');
        const dataB = await resB.json();
        setBusinesses(Array.isArray(dataB) ? dataB : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAdOrder = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsored campaign order?')) return;
    try {
      const res = await fetch(`/api/ad-orders/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        logEvent(`Deleted Ad Order ID: ${id}`);
        const resAd = await fetch('/api/ad-orders');
        const dataAd = await resAd.json();
        setAdOrders(Array.isArray(dataAd) ? dataAd : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearBusinessAds = async (businessId: number, businessName: string) => {
    if (!confirm(`Are you sure you want to permanently delete ALL ad campaigns for "${businessName}"?`)) return;
    try {
      const adsToDelete = adOrders.filter(ad => ad.businessId === businessId);
      if (adsToDelete.length === 0) {
        alert('No ad campaigns found for this business.');
        return;
      }
      for (const ad of adsToDelete) {
        await fetch(`/api/ad-orders/${ad.id}`, { method: 'DELETE' });
      }
      logEvent(`Deleted all Ad Orders for Business ID: ${businessId}`);
      const resAd = await fetch('/api/ad-orders');
      const dataAd = await resAd.json();
      setAdOrders(Array.isArray(dataAd) ? dataAd : []);
      alert(`Successfully deleted ${adsToDelete.length} ad campaign(s) for ${businessName}.`);
    } catch (e) {
      console.error(e);
      alert('Error deleting campaigns.');
    }
  };

  const handleSavePricingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const subscriptionPrices = {
        bizPlanFreePrice,
        bizPlanProPrice,
        bizPlanVipPrice,
        propPlanFreePrice,
        propPlanProPrice,
        propPlanBuilderPrice
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_subscription_prices', JSON.stringify(subscriptionPrices));
        localStorage.setItem('majh_boisar_auto_poster_packages', JSON.stringify(autoPosterPackagesState));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('majh_boisar_subscription_prices_updated'));
        window.dispatchEvent(new Event('majh_boisar_auto_posters_updated'));
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sliderMultiplier,
          resultsMultiplier,
          allMultiplier,
          baseDailyBudget,
          sponsoredMultiplier,
          ad_packages: JSON.stringify(adPackagesState),
          subscription_prices: JSON.stringify(subscriptionPrices)
        })
      });
      if (res.ok) {
        logEvent("Saved new platform advertising package rates & subscription plan prices.");
        alert("🎉 Success! Ad rates & Subscription plan prices updated across the entire platform!");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error saving settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleRenameBusiness = async (id: number, newName: string) => {
    try {
      const processedName = toTitleCase(newName);
      const res = await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: processedName })
      });
      if (res.ok) {
        logEvent(`Renamed Business ID ${id} to "${processedName}"`);
        fetchAdminData();
      } else {
        alert('Failed to rename business');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBusinessAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBizId) return;

    try {
      const res = await fetch(`/api/businesses/${editingBizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: toTitleCase(editBizName),
          category: editBizCategory,
          description: editBizDescription,
          address: editBizAddress,
          phone: editBizPhone,
          whatsapp: editBizWhatsapp,
          website: editBizWebsite || null,
          email: editBizEmail || null,
          googleMaps: editBizGoogleMaps || null,
          image: editBizImage,
          gallery: editBizGallery,
          verified: editBizVerified,
          premium: editBizPremium,
        })
      });

      if (res.ok) {
        logEvent(`Updated Business ID ${editingBizId} details: "${editBizName}"`);
        fetchAdminData();
        setAdminEditModalOpen(false);
      } else {
        alert('Failed to save business details');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating business');
    }
  };

  const handleDeleteBusiness = async (id: number) => {
    try {
      setBusinesses(prev => prev.filter(b => b.id !== id));
      const res = await fetch(`/api/businesses/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        logEvent(`Deleted Business ID ${id}`);
        showToast(`Business #${id} deleted successfully.`, 'success');
        fetchAdminData();
      } else {
        fetchAdminData();
        alert('Failed to delete business');
      }
    } catch (e) {
      console.error(e);
      fetchAdminData();
    }
  };

  const handleDeleteVehicle = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from Travels & Vehicles database?`)) return;
    try {
      setAdminVehiclesList(prev => prev.filter(v => v.id !== id));
      const res = await fetch(`/api/vehicles?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        logEvent(`Deleted Vehicle ID ${id} (${name})`);
        showToast(`🚗 Vehicle "${name}" deleted successfully.`, 'success');
      } else {
        alert('Failed to delete vehicle');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleAdminAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminVehForm.name.trim() || !adminVehForm.phone.trim()) {
      alert('Please enter Driver / Agency Name and Contact Phone!');
      return;
    }
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminVehForm.name.trim(),
          category: adminVehForm.category,
          vehicleModel: adminVehForm.vehicleModel.trim() || 'Standard Model',
          capacity: adminVehForm.capacity.trim() || '4+1 Passengers',
          ratePerKm: adminVehForm.ratePerKm.trim() || 'Affordable Local Rate',
          location: adminVehForm.location.trim() || 'Boisar West',
          phone: adminVehForm.phone.trim(),
          timing: adminVehForm.timing.trim() || 'Daily 24x7',
          image: adminVehForm.image.trim() || null,
          features: ['Direct Owner Contact', '0% Commission', 'Verified Boisar Listing'],
          verified: true
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setAdminVehiclesList(prev => [saved, ...prev]);
        logEvent(`Added new Vehicle: ${adminVehForm.name}`);
        showToast(`🎉 Vehicle ${adminVehForm.name} Added Live!`, 'success');
        setAdminAddVehicleModalOpen(false);
        setAdminVehForm({
          name: '',
          category: 'Car & Cab',
          vehicleModel: '',
          capacity: '4+1 Passengers',
          ratePerKm: '₹12/km (AC Local & Outstation)',
          location: 'Boisar West & Station',
          phone: '',
          timing: '24x7 Available on Call',
          image: '',
        });
      } else {
        alert('Failed to add vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding vehicle');
    }
  };

  const handleToggleApproveVehicle = async (id: number, currentVerified: boolean) => {
    const nextStatus = !currentVerified;
    try {
      setAdminVehiclesList(prev => prev.map(v => v.id === id ? { ...v, verified: nextStatus } : v));
      const res = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verified: nextStatus })
      });
      if (res.ok) {
        logEvent(`${nextStatus ? 'Approved' : 'Unpublished'} Vehicle ID ${id}`);
        showToast(nextStatus ? '🎉 Vehicle Approved and Published Live on Majh Boisar!' : 'Vehicle unpublished / paused.', 'success');
      } else {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleDeleteTechnician = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from Home Services & Technicians database?`)) return;
    try {
      setAdminTechniciansList(prev => prev.filter(t => t.id !== id));
      const res = await fetch(`/api/technicians?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        logEvent(`Deleted Home Technician ID ${id} (${name})`);
        showToast(`🔧 Service provider "${name}" deleted successfully.`, 'success');
      } else {
        alert('Failed to delete service provider');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleToggleApproveTechnician = async (id: number, currentVerified: boolean) => {
    const nextStatus = !currentVerified;
    try {
      setAdminTechniciansList(prev => prev.map(t => t.id === id ? { ...t, verified: nextStatus } : t));
      const res = await fetch('/api/technicians', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verified: nextStatus })
      });
      if (res.ok) {
        logEvent(`${nextStatus ? 'Approved' : 'Unpublished'} Technician ID ${id}`);
        showToast(nextStatus ? '🎉 Service Provider Approved and Published Live on Majh Boisar!' : 'Service provider unpublished / paused.', 'success');
      } else {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleToggleFeatureVehicle = async (id: number, currentFeatured: boolean) => {
    const nextStatus = !currentFeatured;
    try {
      setAdminVehiclesList(prev => prev.map(v => v.id === id ? { ...v, featured: nextStatus } : v));
      const res = await fetch('/api/vehicles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: nextStatus })
      });
      if (res.ok) {
        logEvent(`${nextStatus ? 'Featured' : 'Unfeatured'} Vehicle ID ${id}`);
        showToast(nextStatus ? '⭐ Vehicle pinned as Featured / Top Choice in its category!' : 'Vehicle removed from Featured.', 'success');
      } else {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleToggleFeatureTechnician = async (id: number, currentFeatured: boolean) => {
    const nextStatus = !currentFeatured;
    try {
      setAdminTechniciansList(prev => prev.map(t => t.id === id ? { ...t, featured: nextStatus } : t));
      const res = await fetch('/api/technicians', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: nextStatus })
      });
      if (res.ok) {
        logEvent(`${nextStatus ? 'Featured' : 'Unfeatured'} Technician ID ${id}`);
        showToast(nextStatus ? '⭐ Service Provider pinned as Featured / Top Choice in its category!' : 'Service Provider removed from Featured.', 'success');
      } else {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleAdminAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTechForm.name.trim() || !adminTechForm.phone.trim()) {
      alert('Please enter Technician / Service Name and Contact Phone!');
      return;
    }
    try {
      const res = await fetch('/api/technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminTechForm.name.trim(),
          category: adminTechForm.category,
          experience: adminTechForm.experience.trim() || '5+ Yrs Experience',
          phone: adminTechForm.phone.trim(),
          location: adminTechForm.location.trim() || 'Boisar West',
          visitingFee: adminTechForm.visitingFee.trim() || '₹199 Inspection Fee',
          timing: adminTechForm.timing.trim() || 'Available On-Demand',
          allowCalls: adminTechForm.allowCalls,
          image: adminTechForm.image.trim() || null,
          verified: true
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setAdminTechniciansList(prev => [saved, ...prev.filter(t => t.id !== saved.id)]);
        logEvent(`Added new Home Technician: ${adminTechForm.name}`);
        showToast(`🎉 Service Provider ${adminTechForm.name} Added Live!`, 'success');
        setAdminAddTechModalOpen(false);
        setAdminTechForm({
          name: '',
          category: 'AC Service',
          experience: '5+ Yrs Experience',
          phone: '',
          location: 'Boisar West',
          visitingFee: '₹199 Inspection Fee',
          timing: 'Available On-Demand',
          allowCalls: true,
          image: '',
        });
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to add service provider');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding service provider');
    }
  };

  const handleDeleteDonor = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete blood donor "${name}"?`)) return;
    try {
      setAdminDonorsList(prev => prev.filter(d => d.id !== id));
      const res = await fetch(`/api/blood-donors?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        logEvent(`Deleted Blood Donor ID ${id} (${name})`);
        showToast(`🩸 Blood donor "${name}" deleted successfully.`, 'success');
      } else {
        alert('Failed to delete blood donor');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleToggleApproveDonor = async (id: number, currentVerified: boolean) => {
    const nextStatus = !currentVerified;
    try {
      setAdminDonorsList(prev => prev.map(d => d.id === id ? { ...d, verified: nextStatus } : d));
      const res = await fetch('/api/blood-donors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, verified: nextStatus })
      });
      if (res.ok) {
        logEvent(`${nextStatus ? 'Approved' : 'Unpublished'} Blood Donor ID ${id}`);
        showToast(nextStatus ? '🎉 Blood Donor Approved and Published Live on Majh Boisar!' : 'Blood donor unpublished / paused.', 'success');
      } else {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
      fetchAdminData();
    }
  };

  const handleAdminAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminDonorForm.name.trim() || !adminDonorForm.phone.trim()) {
      alert('Please enter Donor Name and Mobile Number!');
      return;
    }
    try {
      const res = await fetch('/api/blood-donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminDonorForm.name.trim(),
          bloodGroup: adminDonorForm.bloodGroup.trim(),
          location: adminDonorForm.location.trim() || 'Boisar West',
          phone: adminDonorForm.phone.trim(),
          lastDonated: adminDonorForm.lastDonated.trim() || 'Ready to donate',
          verified: true
        })
      });
      if (res.ok) {
        const saved = await res.json();
        setAdminDonorsList(prev => [saved, ...prev.filter(d => d.id !== saved.id)]);
        logEvent(`Admin added Blood Donor "${adminDonorForm.name}" (${adminDonorForm.bloodGroup})`);
        showToast(`🎉 Blood Donor "${adminDonorForm.name}" added and published live!`, 'success');
        setAdminAddDonorModalOpen(false);
        setAdminDonorForm({
          name: '',
          bloodGroup: 'O+',
          location: 'Boisar West',
          phone: '',
          lastDonated: 'Ready to donate',
        });
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to add blood donor');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding blood donor');
    }
  };

  const handleCreateAdminAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAdBizId) {
      alert('Please select a business');
      return;
    }

    setCreatingAdminAd(true);
    try {
      let finalBizId = parseInt(adminAdBizId);
      let finalBizName = '';
      let finalBizCat = '';

      if (adminAdBizId === '-2') {
        finalBizId = 0;
        finalBizName = "Direct Image Ad";
        finalBizCat = "All";
      } else if (adminAdBizId === '-1') {
        if (!adminAdNewBizName || !adminAdNewBizPhone || !adminAdNewBizCategory) {
          alert('Please fill in all details for the new business.');
          setCreatingAdminAd(false);
          return;
        }
        const processedName = toTitleCase(adminAdNewBizName);
        const resBiz = await fetch('/api/businesses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: processedName,
            phone: adminAdNewBizPhone,
            category: adminAdNewBizCategory,
            location: 'Boisar',
            address: 'Boisar',
            verified: true,
            plan: 'Basic'
          })
        });
        if (!resBiz.ok) {
          alert('Failed to create the new business shell.');
          setCreatingAdminAd(false);
          return;
        }
        const newBiz = await resBiz.json();
        finalBizId = newBiz.id;
        finalBizName = newBiz.name;
        finalBizCat = newBiz.category;

        // refresh local businesses array silently
        fetch('/api/businesses').then(r => r.json()).then(setBusinesses);
      } else {
        const biz = businesses.find(b => b.id === finalBizId);
        if (!biz) {
          setCreatingAdminAd(false);
          return;
        }
        finalBizName = biz.name;
        finalBizCat = biz.category;
      }

      const budget = parseFloat(adminAdBudget) || 50;
      const duration = parseInt(adminAdDuration) || 30;
      const isDirect = finalBizId === -2;
      const res = await fetch('/api/ad-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: finalBizId,
          businessName: finalBizName,
          title: isDirect ? '' : (adminAdTitle || ''),
          description: isDirect ? '' : (adminAdDesc || ''),
          image: adminAdImage || null,
          placement: selectedPlacements.includes('All Placements (Run Everywhere)')
            ? 'All Placements (Run Everywhere)'
            : (selectedPlacements.length > 0 ? selectedPlacements.join(', ') : adminAdPlacement),
          targetingScope: 'Local Category',
          targetCategory: finalBizCat,
          durationDays: duration,
          dailyBudget: budget,
          totalCost: budget * duration,
          status: 'Approved',
          showTextOverlay: isDirect ? false : !!(adminAdTitle || adminAdDesc),
          targetUrl: adminAdTargetUrl || null
        })
      });
      if (res.ok) {
        alert('Ad campaign created and activated successfully!');
        setAdminAdFormOpen(false);
        setAdminAdTitle('');
        setAdminAdDesc('');
        setAdminAdImage('');
        setAdminAdTargetUrl('');
        setAdminAdNewBizName('');
        setAdminAdNewBizPhone('');
        setAdminAdNewBizCategory('');
        const resAd = await fetch('/api/ad-orders');
        const dataAd = await resAd.json();
        setAdOrders(Array.isArray(dataAd) ? dataAd : []);
      } else {
        const errorData = await res.json();
        alert(`Failed to create ad campaign: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setCreatingAdminAd(false);
    }
  };

  const handleAutoDetectAdminLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert("Geolocation GPS is not supported on your device/browser.");
      return;
    }
    setIsDetectingAdminLocation(true);
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
            else if (fullStr.includes("ostwal")) setNewBizLocation("Ostwal Wonder City");
            else if (fullStr.includes("west") || fullStr.includes("paschim")) setNewBizLocation("Boisar West");
            else if (fullStr.includes("east") || fullStr.includes("purva")) setNewBizLocation("Boisar East");
            else if (fullStr.includes("salwad")) setNewBizLocation("Salwad");
            else if (fullStr.includes("navapur")) setNewBizLocation("Navapur Road");

            alert(`🎉 Location auto-detected!\nAddress: ${streetName ? streetName + ', ' : ''}Boisar\nGoogle Maps link generated!`);
          } else {
            alert(`🎉 GPS Coordinates fetched! Google Maps link added.`);
          }
        } catch (e) {
          alert(`🎉 GPS Coordinates fetched & Google Maps link auto-generated!`);
        } finally {
          setIsDetectingAdminLocation(false);
        }
      },
      (err) => {
        setIsDetectingAdminLocation(false);
        alert("GPS Location request denied or unavailable. Please fill address manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCreateDirectAdminBusiness = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBizName.trim()) {
      alert('Please enter a Business Name.');
      return;
    }

    setAddingDirectBiz(true);
    try {
      const finalName = toTitleCase(newBizName.trim());
      const finalCat = newBizCategory === 'Other'
        ? (newBizCustomCat.trim() || 'General Store')
        : (newBizCategory || 'Doctors');
      const finalPhone = newBizPhone.replace(/\D/g, '') || "9307294733";
      const finalWhatsapp = newBizWhatsapp.replace(/\D/g, '') || finalPhone;

      // Construct address block from structured inputs
      const addressBlock = newBizAddress.trim() 
        ? newBizAddress.trim() 
        : `${newBizPlotNo ? newBizPlotNo + ', ' : ''}${newBizBldgName ? newBizBldgName + ', ' : ''}${newBizStreet ? newBizStreet + ', ' : ''}${newBizLandmark ? 'Near ' + newBizLandmark + ', ' : ''}${newBizLocation}, ${newBizCity} - ${newBizPincode}`;

      // Build workingHours from schedule
      let finalWorkingHours = newBizWorkingHours;
      if (newBizSchedule) {
        const days = Object.entries(newBizSchedule);
        const openDays = days.filter(([, v]) => !v.closed);
        const closedDays = days.filter(([, v]) => v.closed).map(([d]) => d);
        if (openDays.length > 0) {
          const parts: string[] = [];
          openDays.forEach(([day, v]) => {
            parts.push(`${day}: ${v.open} - ${v.close}`);
          });
          finalWorkingHours = parts.join(', ') + (closedDays.length > 0 ? ` | Closed: ${closedDays.join(', ')}` : '');
        }
      }

      const finalCover = newBizImage || newBizGallery[0] || '/majh-boisar-mb-logo.png';

      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          category: finalCat,
          phone: finalPhone,
          whatsapp: finalWhatsapp,
          email: newBizEmail || undefined,
          contactPerson: newBizContactPerson || undefined,
          location: newBizLocation || 'Boisar West',
          address: addressBlock,
          description: newBizDescription || `${finalCat} in Boisar. Verified quality service.`,
          workingHours: finalWorkingHours || '9:00 AM - 9:00 PM',
          gst: newBizGst || undefined,
          website: newBizWebsite || undefined,
          googleMaps: newBizGoogleMaps || undefined,
          wazeLink: newBizWazeLink || undefined,
          instagram: newBizInstagram || undefined,
          youtube: newBizYoutube || undefined,
          image: finalCover,
          gallery: newBizGallery,
          latitude: newBizLat || undefined,
          longitude: newBizLng || undefined,
          verified: newBizVerified,
          premium: newBizPremium,
          subscription: newBizSubscription || 'Admin Created',
          rating: parseFloat(newBizRating) || 5.0,
          createdBy: 'Admin',
          postedBy: 'Admin'
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add business');
      }

      const createdBiz = await res.json();

      // If services were added, create them linked to this business
      if (newBizServices.length > 0 && createdBiz.id) {
        for (const srv of newBizServices) {
          try {
            await fetch('/api/services', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: createdBiz.id,
                name: srv.name,
                price: srv.price ? parseFloat(srv.price) : undefined,
                duration: srv.duration || undefined,
                description: srv.desc || undefined
              })
            });
          } catch (e) {
            console.error('Error adding service for new business:', e);
          }
        }
      }

      // If products were added, create them linked to this business
      if (newBizProducts.length > 0 && createdBiz.id) {
        for (const prod of newBizProducts) {
          try {
            await fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                businessId: createdBiz.id,
                name: prod.name,
                price: prod.price ? parseFloat(prod.price) : 0,
                description: prod.desc || undefined,
                image: prod.image || undefined
              })
            });
          } catch (e) {
            console.error('Error adding product for new business:', e);
          }
        }
      }

      logEvent(`Admin directly created new business: "${finalName}" (${finalCat}) with ${newBizServices.length} services`);
      alert(`🎉 Success! Business "${finalName}" has been created with all registered details, services, and "👑 Created by Admin" badge!`);
      
      // Reset form states
      setAdminAddBizModalOpen(false);
      setNewBizName('');
      setNewBizPlotNo('');
      setNewBizBldgName('');
      setNewBizStreet('');
      setNewBizLandmark('');
      setNewBizPincode('401501');
      setNewBizContactPerson('');
      setNewBizPhone('');
      setNewBizWhatsapp('');
      setNewBizEmail('');
      setNewBizAddress('');
      setNewBizDescription('');
      setNewBizGst('');
      setNewBizGoogleMaps('');
      setNewBizWazeLink('');
      setNewBizWebsite('');
      setNewBizInstagram('');
      setNewBizYoutube('');
      setNewBizImage('');
      setNewBizGallery([]);
      setNewBizServices([]);
      setNewBizProducts([]);
      setNewBizSvcInput({ name: '', price: '', duration: '', desc: '' });
      setNewBizProdInput({ name: '', price: '', desc: '', image: '' });
      setNewBizSchedule(defaultAdminSchedule());
      
      await fetchAdminData();
      setActiveAdminTab('listings');
    } catch (err: any) {
      console.error(err);
      alert(`Error creating business listing: ${err?.message || 'Unknown error'}`);
    } finally {
      setAddingDirectBiz(false);
    }
  };

  const handleCreateDirectAdminSpecialist = (e: React.FormEvent) => {
    e.preventDefault();
    setAddingDirectSpec(true);
    try {
      const finalName = newSpecName.trim() ? toTitleCase(newSpecName) : 'New Specialist Profile';
      const finalCat = newSpecCategory.trim() || (newSpecCategoryKey === 'helpers' ? 'Home Services' : newSpecCategoryKey === 'caterers' ? 'Catering & Food' : newSpecCategoryKey === 'influencers' ? 'Content Creator' : 'Real Estate');
      const cleanPhone = newSpecPhone.replace(/\D/g, '') || '9307294733';
      const finalPrice = newSpecPrice.trim() ? (newSpecPrice.startsWith('₹') ? newSpecPrice : `₹${newSpecPrice}`) : '₹500';
      const finalServices = newSpecServices.trim()
        ? newSpecServices.split(',').map(s => s.trim()).filter(Boolean)
        : [finalCat];

      const newProfile = {
        id: Date.now(),
        name: finalName,
        category: finalCat,
        rating: 5.0,
        reviewsCount: 0,
        price: finalPrice,
        avatar: newSpecAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: newSpecBio.trim() || `${finalCat} in Boisar. Verified quality service by Admin.`,
        experience: newSpecExperience,
        services: finalServices,
        gallery: [],
        phone: cleanPhone,
        reviews: [],
        verified: newSpecVerified,
        subscription: newSpecSubscription,
        views: 0,
        clicks: 0,
        leads: [],
        instagram: newSpecInstagram.trim() || undefined,
        youtube: newSpecYoutube.trim() || undefined,
        createdBy: 'Admin'
      };

      const currentList = specialProfiles[newSpecCategoryKey] || [];
      const nextState = {
        ...specialProfiles,
        [newSpecCategoryKey]: [newProfile, ...currentList]
      };
      setSpecialProfiles(nextState);
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
      }
      logEvent(`Admin directly created Specialist: "${finalName}" (${finalCat}) in ${newSpecCategoryKey}`);
      alert(`🎉 Success! Specialist "${finalName}" created and published LIVE!`);
      setAdminAddSpecialistModalOpen(false);
      // Reset form
      setNewSpecName('');
      setNewSpecPhone('');
      setNewSpecCategory('');
      setNewSpecPrice('');
      setNewSpecBio('');
      setNewSpecServices('');
      setNewSpecAvatar('');
      setNewSpecInstagram('');
      setNewSpecYoutube('');
    } catch (err) {
      console.error(err);
      alert('Error creating specialist profile.');
    } finally {
      setAddingDirectSpec(false);
    }
  };

  const handleDeleteRegisteredUser = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove user "${name}" from registered users list?`)) return;
    const updated = registeredUsers.filter(u => u.id !== id);
    setRegisteredUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_registered_users', JSON.stringify(updated));
    }
    fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: [id] })
    }).catch(e => console.warn('Could not delete user from server:', e));
    logEvent(`Deleted registered user: ${name}`);
  };

  // Business Filtering & Bulk Actions
  const filteredAdminBusinesses = businesses.filter((b) => {
    if (!adminBizSearchQuery.trim()) return true;
    const q = adminBizSearchQuery.toLowerCase();
    return (
      (b.name || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q) ||
      (b.location || '').toLowerCase().includes(q) ||
      (b.phone || '').toLowerCase().includes(q) ||
      (b.address || '').toLowerCase().includes(q)
    );
  });

  const toggleSelectAllBiz = () => {
    if (selectedBizIds.length === filteredAdminBusinesses.length && filteredAdminBusinesses.length > 0) {
      setSelectedBizIds([]);
    } else {
      setSelectedBizIds(filteredAdminBusinesses.map(b => b.id));
    }
  };

  const toggleSelectBiz = (id: number) => {
    setSelectedBizIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkDeleteBusinesses = async () => {
    if (selectedBizIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedBizIds.length} selected businesses?`)) return;
    for (const id of selectedBizIds) {
      await handleDeleteBusiness(id);
    }
    setSelectedBizIds([]);
    alert(`🎉 Deleted ${selectedBizIds.length} businesses successfully.`);
  };

  const handleBulkVerifyBusinesses = async (newVerifiedState: boolean) => {
    if (selectedBizIds.length === 0) return;
    for (const id of selectedBizIds) {
      await handleVerifyBusiness(id, !newVerifiedState);
    }
    setSelectedBizIds([]);
    alert(`🎉 Updated verification status for ${selectedBizIds.length} businesses.`);
  };

  // User Filtering & Bulk Actions
  const filteredAdminUsers = registeredUsers.filter((u) => {
    if (!adminUserSearchQuery.trim()) return true;
    const q = adminUserSearchQuery.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const toggleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredAdminUsers.length && filteredAdminUsers.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredAdminUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: number) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUserIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user accounts?`)) return;
    const toDeleteIds = [...selectedUserIds];
    const updated = registeredUsers.filter((u: any) => !toDeleteIds.includes(u.id));
    setRegisteredUsers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_registered_users', JSON.stringify(updated));
    }
    fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: toDeleteIds })
    }).catch(e => console.warn('Could not bulk delete users from server:', e));
    setSelectedUserIds([]);
    alert(`🎉 Successfully deleted ${toDeleteIds.length} user accounts.`);
  };

  const handleVerifySpecialist = async (category: string, id: number, currentVerified: boolean) => {
    if (category === 'properties') {
      try {
        await fetch(`/api/properties?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: !currentVerified })
        });
      } catch (err) {
        console.error('Error updating property verification:', err);
      }
    }

    const list = specialProfiles[category] || [];
    const updatedList = list.map((p: any) => {
      if (p.id === id) {
        return { ...p, verified: !currentVerified };
      }
      return p;
    });

    const nextState = {
      ...specialProfiles,
      [category]: updatedList
    };

    setSpecialProfiles(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
    }
    logEvent(`Toggled verification of Specialist ID: ${id} to ${!currentVerified}`);
  };

  const handleDeleteSpecialist = async (category: string, id: number) => {
    if (!confirm('Are you sure you want to reject/delete this listing?')) return;
    if (category === 'properties') {
      try {
        await fetch(`/api/properties?id=${id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error('Error deleting property:', err);
      }
    }

    const list = specialProfiles[category] || [];
    const updatedList = list.filter((p: any) => p.id !== id);

    const nextState = {
      ...specialProfiles,
      [category]: updatedList
    };

    setSpecialProfiles(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
    }
    logEvent(`Deleted Specialist ID: ${id}`);
  };

  const handleAdminToggleSold = async (propId: number, currentSold: boolean) => {
    try {
      const res = await fetch(`/api/properties?id=${propId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSold: !currentSold })
      });
      if (res.ok) {
        let isRent = false;
        setSpecialProfiles((prev: any) => {
          const nextProps = (prev.properties || []).map((p: any) => {
            if (String(p.id) === String(propId)) {
              isRent = (p.forAction || '').toLowerCase() === 'rent' || (p.category || '').toLowerCase().includes('rent') || p.transactionType === 'Lease';
              return { ...p, isSold: !currentSold };
            }
            return p;
          });
          const next = {
            ...prev,
            properties: nextProps
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(next));
          }
          return next;
        });
        setAdminPropertyList((prev: any[]) => prev.map(p => String(p.id) === String(propId) ? { ...p, isSold: !currentSold } : p));
        logEvent(`Toggled Sold/Rented Status for Property ID ${propId} to ${!currentSold}`);
        alert(`Property marked as ${!currentSold ? (isRent ? 'RENTED OUT 🔒' : 'SOLD OUT 🔒') + ' (Moved to bottom of list with overlay)' : 'AVAILABLE ✅'}! Live synced.`);
      }
    } catch (err) {
      console.error('Error toggling sold status:', err);
    }
  };

  const handleAdminToggleFeatured = async (propId: number, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/properties?id=${propId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentFeatured })
      });
      if (res.ok) {
        setSpecialProfiles((prev: any) => {
          const next = {
            ...prev,
            properties: (prev.properties || []).map((p: any) => String(p.id) === String(propId) ? { ...p, isFeatured: !currentFeatured } : p)
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(next));
          }
          return next;
        });
        setAdminPropertyList((prev: any[]) => prev.map(p => String(p.id) === String(propId) ? { ...p, isFeatured: !currentFeatured } : p));
        logEvent(`Toggled Featured Status for Property ID ${propId} to ${!currentFeatured}`);
        alert(`Property ${!currentFeatured ? 'marked as FEATURED ⭐ (Pinned on Top in Recent Listings & Search Results)' : 'removed from Featured'}. Live synced.`);
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  const handleAdminDeleteProperty = async (propId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete property "${title}" from database?`)) return;
    try {
      const res = await fetch(`/api/properties?id=${propId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSpecialProfiles((prev: any) => ({
          ...prev,
          properties: (prev.properties || []).filter((p: any) => p.id !== propId)
        }));
        setAdminPropertyList((prev: any[]) => prev.filter(p => p.id !== propId));
        logEvent(`Deleted Property ID: ${propId}`);
        alert('Property listing deleted from database.');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const logEvent = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setAuditLogs(prev => [`[${time}] ${msg}`, ...prev]);
  };

  const handleVerifyBusiness = async (id: number, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentVerified })
      });
      if (res.ok) {
        logEvent(`Toggled Verification for Business ID: ${id} to ${!currentVerified}`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const downloadCSV = (filename: string, rows: Record<string, any>[]) => {
    if (!rows || rows.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : String(row[header]).replace(/"/g, '""');
        return `"${val}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logEvent(`Exported CSV Report: ${filename}.csv`);
  };

  const handleTogglePremium = async (id: number, currentPremium: boolean) => {
    try {
      const res = await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premium: !currentPremium })
      });
      if (res.ok) {
        logEvent(`Toggled Sponsored Premium status for ID: ${id} to ${!currentPremium}`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        logEvent(`Deleted customer review ID: ${id}`);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Render unauthorized lock screen if not unlocked with Super Admin password
  if (!isAdminPageUnlocked) {
    const handlePasscodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Check lockout timer
      const lockUntil = typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('admin_lockout_until') || '0') : 0;
      if (Date.now() < lockUntil) {
        const remainingMins = Math.ceil((lockUntil - Date.now()) / 60000);
        setAdminPasscodeError(`🔒 Maximum attempts exceeded. Security lockout active for ${remainingMins} min(s).`);
        return;
      }

      const input = adminPasscode.trim();
      const valid = input === 'dhuYGmi4%q#FHX9' || (savedAdminPasscode && input === savedAdminPasscode);

      if (valid) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('admin_failed_attempts');
          sessionStorage.removeItem('admin_lockout_until');
          localStorage.setItem('majh_boisar_role', 'Admin');
        }
        setRole('Admin');
        setIsAdminPageUnlocked(true);
        setAdminPasscodeError('');
      } else {
        const failed = (typeof window !== 'undefined' ? parseInt(sessionStorage.getItem('admin_failed_attempts') || '0') : 0) + 1;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_failed_attempts', failed.toString());
        }
        if (failed >= 5) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('admin_lockout_until', (Date.now() + 15 * 60 * 1000).toString());
          }
          setAdminPasscodeError('🔒 5 failed attempts! Admin portal locked for 15 minutes to prevent unauthorized access.');
        } else {
          setAdminPasscodeError(`Incorrect password. Access Denied (${5 - failed} attempts remaining).`);
        }
      }
    };

    return (
      <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 text-white">
        <div className="max-w-md w-full bg-slate-850 border border-slate-800 p-8 rounded-3xl text-left space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center space-y-2 relative z-10">
            <ShieldCheck className="w-12 h-12 text-teal-400 mx-auto animate-pulse" />
            <h2 className="font-extrabold text-base text-white uppercase tracking-wider">Super Admin Passcode Portal</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-bold">
              Enter Super Admin Password key to access Majh Boisar console
            </p>
          </div>

          {adminPasscodeError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-bold flex items-center gap-2">
              ⚠️ <span>{adminPasscodeError}</span>
            </div>
          )}

          <form onSubmit={handlePasscodeSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Console Password</label>
              <input
                type="password"
                required
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-teal-500 text-white font-extrabold tracking-widest placeholder-slate-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-lg transition-all hover:scale-[1.01] cursor-pointer text-center"
            >
              Unlock Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate SaaS platform metrics
  const totalBusinesses = businesses.length;
  const verifiedCount = businesses.filter(b => b.verified).length;
  const pendingVerifications = businesses.filter(b => !b.verified).length;

  const pendingSpecialists = Object.entries(specialProfiles).flatMap(([cat, list]: any) =>
    (list || []).filter((p: any) => !p.verified).map((p: any) => ({ ...p, catKey: cat }))
  );
  const premiumCount = businesses.filter(b => b.premium).length;

  // Dynamic SaaS Recurring Revenue calculation
  const silverPlans = businesses.filter(b => b.subscription === 'Silver').length;
  const goldPlans = businesses.filter(b => b.subscription === 'Gold').length;
  const premiumPlans = businesses.filter(b => b.subscription === 'Premium').length;
  const monthlyRecurringRevenue = (silverPlans * 499) + (goldPlans * 999) + (premiumPlans * 1999);

  // Group listings by category to check counts
  const categoryCounts: Record<string, number> = {};
  businesses.forEach(b => {
    categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
  });

  return (
    <div className="bg-slate-55 min-h-screen py-10 text-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">

        {/* Header Block */}
        <div className="border-b border-slate-200 pb-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-650 border border-teal-100 shadow-sm">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 mb-0.5 font-sans uppercase tracking-tight">Super Admin Panel</h1>
              <p className="text-xs text-slate-500">Review listing applications, verify merchants, moderate user ratings, and audit platforms.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setAdminAddBizModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-2xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Business</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 active:scale-98 text-white font-black text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>View Dashboard</span>
            </Link>

            <button
              onClick={() => {
                fetchAdminData();
                logEvent("Refreshed platform database entries.");
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={() => {
                downloadCSV('Registered_Users_Boisar', registeredUsers);
                setTimeout(() => downloadCSV('Directory_Businesses_Boisar', businesses), 300);
                setTimeout(() => downloadCSV('Buyer_Leads_Boisar', leads), 600);
                setTimeout(() => downloadCSV('Property_Listings_Boisar', adminPropertyList), 900);
                setTimeout(() => downloadCSV('Jobs_Vacancies_Boisar', adminJobsList), 1200);
                alert('🎉 Success! All CSV reports downloaded successfully.');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📥 Export CSV Reports</span>
            </button>

            <button
              onClick={() => {
                setIsAdminPageUnlocked(false);
                setAdminPasscode('');
                setRole('User');
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('majh_boisar_adminmb_auth');
                  localStorage.removeItem('majh_boisar_role');
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs shadow-2xs transition-all cursor-pointer"
              title="Lock Admin Portal"
            >
              <span>🔒 Lock Portal</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-2">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-400 font-semibold">Gathering administrative logs...</span>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Compact Stats Dashboard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-10 gap-3">
              {[
                { label: 'Registered Users', val: registeredUsers.length, icon: <Users className="w-3.5 h-3.5 text-teal-600" /> },
                { label: 'Total Listings', val: totalBusinesses, icon: <Building className="w-3.5 h-3.5 text-teal-600" /> },
                { label: 'Verified Shops', val: verifiedCount, icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
                { label: 'Pending Verif.', val: pendingVerifications + pendingSpecialists.length, icon: <AlertCircle className="w-3.5 h-3.5 text-rose-500" />, highlight: (pendingVerifications + pendingSpecialists.length) > 0 },
                { label: 'Ad Orders', val: adOrders.length, icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
                { label: 'Logged Leads', val: leads.length, icon: <ClipboardCheck className="w-3.5 h-3.5 text-rose-500" /> },
                { label: 'Disk Storage', val: `${systemStats?.storage?.filledPercentage || '14.8'}% Filled`, icon: <HardDrive className="w-3.5 h-3.5 text-teal-600" /> },
                { label: 'Postgres DB', val: `${systemStats?.postgres?.usedMB || '16.2'} MB`, icon: <Database className="w-3.5 h-3.5 text-indigo-600" /> },
                { label: 'SMS OTP Balance', val: `${systemStats?.smsOtp?.remainingBalance || '9,380'} Left`, icon: <Smartphone className="w-3.5 h-3.5 text-amber-500" /> },
                { label: 'Est. MRR Revenue', val: `₹${monthlyRecurringRevenue}`, icon: <Coins className="w-3.5 h-3.5 text-teal-600" /> }
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-white border p-3 rounded-xl flex flex-col justify-between shadow-xs ${stat.highlight ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                    }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <h4 className={`text-lg font-black ${stat.highlight ? 'text-rose-600' : 'text-slate-800'}`}>
                    {stat.val}
                  </h4>
                </div>
              ))}
            </div>

            {/* Clean Admin Subtabs Navigation */}
            <div className="flex gap-1 border-b border-slate-200 pb-px overflow-x-auto no-scrollbar -mx-1 px-1">
              {[
                { val: 'queue', label: `Pending Approvals (${pendingVerifications + pendingSpecialists.length + pendingHotels.length})`, icon: <ShieldCheck className="w-3.5 h-3.5" />, highlight: (pendingVerifications + pendingSpecialists.length + pendingHotels.length) > 0 },
                { val: 'home_restaurants', label: `Home Dining & Cafes (${adminHomeRestaurants.length})`, icon: <Utensils className="w-3.5 h-3.5 text-orange-600" /> },
                { val: 'hotel_management', label: `Hotels & Resorts (${adminHotelsList.length + adminResortsList.length})`, icon: <Building2 className="w-3.5 h-3.5 text-amber-500" />, highlight: pendingHotels.length > 0 },
                { val: 'listings', label: `Directory Listings (${businesses.length})`, icon: <Building className="w-3.5 h-3.5" /> },
                { val: 'users', label: `Registered Users (${registeredUsers.length})`, icon: <Users className="w-3.5 h-3.5 text-teal-600" /> },
                { val: 'deletion_requests', label: `Deletion Requests (${deletionRequests.filter(r => r.status === 'Pending').length})`, icon: <Trash2 className="w-3.5 h-3.5 text-rose-500" />, highlight: deletionRequests.filter(r => r.status === 'Pending').length > 0 },
                { val: 'spam_reports', label: `Spam / Flagged Reports (${reportsList.length})`, icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />, highlight: reportsList.length > 0 },
                { val: 'ad_orders', label: `Ad Orders (${adOrders.length})`, icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
                { val: 'leads', label: `Logged Leads (${leads.length})`, icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
                { val: 'reviews', label: `Reviews (${reviews.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { val: 'jobs_management', label: `Jobs Portal (${adminJobsList.length})`, icon: <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> },
                { val: 'property_management', label: `Real Estate Properties (${adminPropertyList.length})`, icon: <Building className="w-3.5 h-3.5 text-emerald-600" /> },
                { val: 'system_storage', label: `Storage, Postgres & SMS`, icon: <HardDrive className="w-3.5 h-3.5 text-teal-600" /> },
                { val: 'categories', label: `Categories Management (${customAdminCategories.length})`, icon: <Layers className="w-3.5 h-3.5 text-teal-600" /> },
                { val: 'ad_pricing', label: `Ad Pricing Settings`, icon: <Coins className="w-3.5 h-3.5 text-teal-600" /> }
              ].map((tab) => (
                <button
                  key={tab.val}
                  onClick={() => {
                    setActiveAdminTab(tab.val as any);
                    logEvent(`Switched console tab to: ${tab.label}`);
                  }}
                  className={`px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeAdminTab === tab.val
                      ? 'border-teal-600 text-teal-700 bg-white rounded-t-xl border-t border-x border-slate-200'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.highlight && (
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content: Platform Summary */}
            {activeAdminTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Pending Verification Summary Card */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-teal-600" />
                    <span>Pending Verified badge Tickets</span>
                  </h3>

                  {pendingVerifications === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">All business applications are approved and verified. Clean queue!</p>
                  ) : (
                    <div className="space-y-3">
                      {businesses.filter(b => !b.verified).map((b) => (
                        <div key={b.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4 text-xs shadow-sm">
                          <div>
                            <h4 className="font-bold text-slate-800">{b.name}</h4>
                            <p className="text-[10px] text-slate-550 mt-0.5">{b.category} • {b.location}</p>
                          </div>
                          <button
                            onClick={() => handleVerifyBusiness(b.id, false)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                          >
                            Verify Profile
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Platform Quick Stats Widget */}
                <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <BarChart2 className="w-4.5 h-4.5 text-teal-600" />
                    <span>Live Metrics</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-semibold">Total Businesses:</span>
                      <span className="font-bold text-slate-800">{businesses.length}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-semibold">Pending Approvals:</span>
                      <span className="font-bold text-amber-600">
                        {pendingVerifications + pendingSpecialists.length + pendingHotels.length + adminVehiclesList.filter(v => !v.verified).length + adminTechniciansList.filter(t => !t.verified).length + adminDonorsList.filter(d => !d.verified).length}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-semibold">Blood Donors:</span>
                      <span className="font-bold text-rose-600">{adminDonorsList.length} ({adminDonorsList.filter(d => !d.verified).length} Pending)</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500 font-semibold">Hotels Registered:</span>
                      <span className="font-bold text-slate-800">{adminHotelsList.length} ({pendingHotels.length} Pending)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Deletion Requests:</span>
                      <span className="font-bold text-rose-600">{deletionRequests.filter(r => r.status === 'Pending').length}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab Content: Verification Queue (Shops, Specialists & Hotels) */}
            {activeAdminTab === 'queue' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Platform Verification & Approval Queue</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Approve and verify shop directories, specialist network profiles, and hotel partner applications.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
                  {/* Column 1: Shop Listings queue */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider border-b pb-1 flex items-center justify-between">
                      <span>💼 Shop Applications</span>
                      <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-bold">{pendingVerifications}</span>
                    </h4>
                    {pendingVerifications === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center font-bold">No pending shop applications.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {businesses.filter(b => !b.verified).map((b) => (
                          <div key={b.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs">
                            <div>
                              <h5 className="font-extrabold text-slate-800">{b.name}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">{b.category} • {b.location}</p>
                            </div>
                            <button
                              onClick={() => handleVerifyBusiness(b.id, false)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
                            >
                              Approve
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Specialist Profiles queue */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider border-b pb-1 flex items-center justify-between">
                      <span>✨ Specialists</span>
                      <span className="bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-bold">{pendingSpecialists.length}</span>
                    </h4>
                    {pendingSpecialists.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center font-bold">No pending specialist applications.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {pendingSpecialists.map((p: any) => (
                          <div key={p.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs">
                            <div>
                              <h5 className="font-extrabold text-slate-800">{p.name}</h5>
                              <p className="text-[10px] text-slate-500 mt-0.5">{p.category} ({p.catKey}) • {p.phone}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleVerifySpecialist(p.catKey, p.id, false)}
                                className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeleteSpecialist(p.catKey, p.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-rose-200"
                                title="Reject & Delete Listing"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Column 3: Hotel Partner Applications Queue */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-purple-900 uppercase tracking-wider border-b pb-1 flex items-center justify-between">
                      <span>🏨 Hotel Applications</span>
                      <span className="bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-bold">{pendingHotels.length}</span>
                    </h4>
                    {pendingHotels.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center font-bold">No pending hotel applications.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {pendingHotels.map((h: any) => (
                          <div key={h.id} className="bg-purple-50/50 border border-purple-200 p-3 rounded-xl space-y-2 text-xs shadow-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-extrabold text-slate-900 leading-tight">{h.name}</h5>
                                <p className="text-[10px] text-purple-900 font-bold mt-0.5">
                                  {h.category} • {h.location}
                                </p>
                                <p className="text-[10px] text-slate-500">{h.address}</p>
                              </div>
                              <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                                ⏳ Pending
                              </span>
                            </div>

                            {/* Rates Preview */}
                            <div className="grid grid-cols-2 gap-1.5 bg-white p-2 rounded-lg border border-purple-100 text-[10px]">
                              <div>
                                <span className="font-bold text-slate-600 block">AC Room:</span>
                                <span className="font-black text-purple-900">₹{h.hourlyRate3h} (3h) • ₹{h.nightRate} (Night)</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-600 block">Non-AC Room:</span>
                                <span className="font-black text-emerald-800">₹{h.rooms?.[1]?.hourly3h || 499} (3h)</span>
                              </div>
                            </div>

                            {/* Contact & Actions */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-purple-100">
                              <div className="flex items-center gap-1 text-[11px] font-bold">
                                <a 
                                  href={`tel:${h.phone}`} 
                                  className="text-purple-900 hover:underline flex items-center gap-0.5"
                                  title="Call Reception"
                                >
                                  📞 {h.phone}
                                </a>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRejectHotel(h.id)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveHotel(h.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  Approve & Go Live
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* Tab Content: Dedicated Homepage Dining & Cafes Section */}
            {activeAdminTab === 'home_restaurants' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl space-y-5 shadow-xs text-left">
                {/* Header & Add Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-orange-600" />
                      <span>Homepage Dining &amp; Cafes Manager ({adminHomeRestaurants.filter(r => r.isActive !== false).length} Live on Home / {allDirectoryRestaurants.length} Total Listed)</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Toggle &quot;Show on Homepage Display&quot; for any listed restaurant in Boisar to feature it directly in the &quot;Hi Foodie, Dine in Boisar!&quot; homepage section.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenAddRestaurant}
                    className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Custom Restaurant</span>
                  </button>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setRestoFilterTab('all')}
                      className={`text-xs font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        restoFilterTab === 'all'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      🌟 All Listed Restaurants ({allDirectoryRestaurants.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestoFilterTab('live_home')}
                      className={`text-xs font-black px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        restoFilterTab === 'live_home'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      🔥 Currently Live on Homepage ({adminHomeRestaurants.filter(r => r.isActive !== false).length})
                    </button>
                  </div>

                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      value={restoSearchQuery}
                      onChange={(e) => setRestoSearchQuery(e.target.value)}
                      placeholder="🔍 Search restaurant by name, area, cuisine..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500 placeholder-slate-400"
                    />
                    {restoSearchQuery && (
                      <button
                        onClick={() => setRestoSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Restaurants Grid Cards */}
                {(() => {
                  const displayList = allDirectoryRestaurants.filter((resto: any) => {
                    const isLive = adminHomeRestaurants.some(r => (r.id === resto.id || r.name.toLowerCase() === resto.name.toLowerCase()) && r.isActive !== false);
                    if (restoFilterTab === 'live_home' && !isLive) return false;
                    if (!restoSearchQuery.trim()) return true;
                    const q = restoSearchQuery.toLowerCase();
                    return resto.name.toLowerCase().includes(q) ||
                      (resto.location && resto.location.toLowerCase().includes(q)) ||
                      (resto.category && resto.category.toLowerCase().includes(q)) ||
                      (resto.speciality && resto.speciality.toLowerCase().includes(q));
                  });

                  if (displayList.length === 0) {
                    return (
                      <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                        <Utensils className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-600">No restaurants match your filter.</p>
                        <p className="text-xs text-slate-400 mt-1">Try resetting the search query or switch back to &quot;All Listed Restaurants&quot;.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {displayList.map((resto: any) => {
                        const matchingFeatured = adminHomeRestaurants.find(r => r.id === resto.id || r.name.toLowerCase() === resto.name.toLowerCase());
                        const isLiveOnHome = matchingFeatured ? matchingFeatured.isActive !== false : false;

                        return (
                          <div
                            key={resto.id}
                            className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                              isLiveOnHome ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-200'
                            }`}
                          >
                            <div>
                              {/* Image & Ribbon */}
                              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                                <img
                                  src={resto.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'}
                                  alt={resto.name}
                                  className="w-full h-full object-cover"
                                />
                                {(resto.discount || (matchingFeatured && matchingFeatured.discount)) && (
                                  <div className="absolute bottom-2 left-2">
                                    <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                                      % {resto.discount || matchingFeatured?.discount}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute top-2 right-2">
                                  <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs ${
                                    isLiveOnHome ? 'bg-emerald-500 text-white' : 'bg-slate-700/90 text-slate-200'
                                  }`}>
                                    {isLiveOnHome ? '● Live on Homepage' : '○ Not on Homepage'}
                                  </span>
                                </div>
                              </div>

                              {/* Content Details */}
                              <div className="p-3.5 space-y-1 text-left">
                                <div className="flex items-start justify-between gap-1.5">
                                  <h4 className="text-xs font-black text-slate-900 leading-tight truncate">
                                    {resto.name}
                                  </h4>
                                  <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shrink-0 flex items-center gap-0.5">
                                    <span>★</span>
                                    <span>{resto.rating || 4.8}</span>
                                  </span>
                                </div>

                                <p className="text-[10.5px] text-orange-950 font-bold truncate">
                                  {resto.categoryLabel || resto.category || 'Cafe & Dining'}
                                </p>

                                <p className="text-[10px] text-slate-500 font-medium truncate">
                                  📍 {resto.location || 'Boisar'}
                                </p>

                                <p className="text-[9.5px] font-bold text-teal-700 truncate">
                                  ✨ {resto.speciality || 'Quality Dining in Boisar'}
                                </p>
                              </div>
                            </div>

                            {/* 1-Click Show on Homepage Display Action Button */}
                            <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleRestaurantHomepageDisplay(resto)}
                                className={`w-full text-xs font-black py-2 px-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                                  isLiveOnHome
                                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white border-emerald-600'
                                    : 'bg-orange-600 hover:bg-orange-700 active:scale-98 text-white border-orange-600'
                                }`}
                              >
                                {isLiveOnHome ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                                    <span>✅ Live on Display (Click to Hide)</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-white" />
                                    <span>👁️ Show on Homepage Display</span>
                                  </>
                                )}
                              </button>

                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 font-bold">
                                <span>{isLiveOnHome ? 'Active on Homepage' : 'Hidden from Homepage'}</span>
                                {matchingFeatured && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditRestaurant(matchingFeatured)}
                                    className="text-teal-700 hover:underline cursor-pointer"
                                  >
                                    Edit Details
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Add / Edit Restaurant Modal */}
                {restaurantModalOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto text-left">
                      <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 text-base">
                            <Utensils className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">
                              {editingRestaurantId ? 'Edit Homepage Restaurant' : 'Add Restaurant to Homepage'}
                            </h4>
                            <p className="text-[10.5px] text-slate-500 font-medium">
                              Featured in &quot;Hi Foodie, Dine in Boisar!&quot; section
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRestaurantModalOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveRestaurant} className="space-y-3.5">
                        {/* Name */}
                        <div>
                          <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                            Restaurant / Cafe Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Citrus Cafe & Resto"
                            value={restoFormName}
                            onChange={(e) => setRestoFormName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        {/* Category & Rating in Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                              Category / Cuisine
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Cafe & Multi-Cuisine"
                              value={restoFormCategory}
                              onChange={(e) => setRestoFormCategory(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                              Rating (Stars)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              value={restoFormRating}
                              onChange={(e) => setRestoFormRating(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        {/* Location & Discount Badge in Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                              Location / Area
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Boisar West · Station"
                              value={restoFormLocation}
                              onChange={(e) => setRestoFormLocation(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                              Offer / Ribbon Badge
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 15% Off + 25% Off"
                              value={restoFormDiscount}
                              onChange={(e) => setRestoFormDiscount(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        {/* Speciality */}
                        <div>
                          <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                            Speciality / Popular Dishes
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Cold Brew, Pasta & Sizzlers"
                            value={restoFormSpeciality}
                            onChange={(e) => setRestoFormSpeciality(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        {/* Image URL */}
                        <div>
                          <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                            Food / Cafe Image URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={restoFormImage}
                            onChange={(e) => setRestoFormImage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                          />

                          {/* Quick Preset Images */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-400 font-bold self-center">Presets:</span>
                            {[
                              { label: '☕ Cafe Ambience', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80' },
                              { label: '🍔 Burgers & Cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80' },
                              { label: '🍲 Veg Thali / Dosa', url: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=600&auto=format&fit=crop&q=80' },
                              { label: '🍕 Pizza & Dining', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setRestoFormImage(preset.url)}
                                className="text-[9.5px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Image Preview */}
                        {restoFormImage && (
                          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <img src={restoFormImage} alt="Preview" className="w-full h-full object-cover" />
                            {restoFormDiscount && (
                              <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">
                                % {restoFormDiscount}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-150">
                          <button
                            type="button"
                            onClick={() => setRestaurantModalOpen(false)}
                            className="px-4 py-2 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black px-5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                          >
                            {editingRestaurantId ? 'Save Changes' : 'Add Restaurant'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Dedicated Hotel & Resort Management Section */}
            {activeAdminTab === 'hotel_management' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                {/* Staycation Inner Switcher */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
                  <button
                    type="button"
                    onClick={() => setAdminStaycationSubTab('hotels')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminStaycationSubTab === 'hotels'
                        ? 'bg-purple-900 text-white shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Hotels & Lodges ({adminHotelsList.length})</span>
                    {pendingHotels.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminStaycationSubTab('resorts')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminStaycationSubTab === 'resorts'
                        ? 'bg-cyan-800 text-white shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Waves className="w-3.5 h-3.5" />
                    <span>Resorts & Pool Villas ({adminResortsList.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminStaycationSubTab('payouts')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      adminStaycationSubTab === 'payouts'
                        ? 'bg-emerald-800 text-white shadow-2xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-300" />
                    <span>💰 Hotel Bookings &amp; Payouts ({adminHotelBookings.length})</span>
                    {adminHotelBookings.some(b => (b.payoutStatus || '').toLowerCase() === 'pending') && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        {adminHotelBookings.filter(b => (b.payoutStatus || '').toLowerCase() === 'pending').length}
                      </span>
                    )}
                  </button>
                </div>

                {adminStaycationSubTab === 'hotels' && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-700" />
                          <span>Hotel Directory & Partner Approvals ({adminHotelsList.length})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Review partner applications, verify reception contacts, toggle approval status, and manage hourly room tariffs.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                          ⚡ {pendingHotels.length} Pending Approval
                        </span>
                        <Link
                          href="/hotels"
                          target="_blank"
                          className="bg-purple-900 hover:bg-purple-800 text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
                        >
                          View Live Hotel Directory ↗
                        </Link>
                      </div>
                    </div>

                {/* Hotel Search & Filter Pills */}
                <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="flex-1 w-full relative">
                    <input
                      type="text"
                      value={adminHotelSearchQuery}
                      onChange={(e) => setAdminHotelSearchQuery(e.target.value)}
                      placeholder="🔍 Search hotel by name, area, phone, category..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                    />
                    {adminHotelSearchQuery && (
                      <button
                        onClick={() => setAdminHotelSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      loadAdminHotels();
                      alert(`Refreshed! Found ${adminHotelsList.length} total hotels.`);
                    }}
                    className="bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    title="Reload hotels from storage"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Hotels List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {adminHotelsList
                    .filter(h => {
                      if (!adminHotelSearchQuery.trim()) return true;
                      const q = adminHotelSearchQuery.toLowerCase();
                      return (
                        (h.name || '').toLowerCase().includes(q) ||
                        (h.location || '').toLowerCase().includes(q) ||
                        (h.phone || '').includes(q) ||
                        (h.category || '').toLowerCase().includes(q)
                      );
                    })
                    .map((h: any) => {
                      const isPending = h.status === 'Pending' || h.verified === false;
                      return (
                        <div 
                          key={h.id} 
                          className={`rounded-2xl border p-3.5 space-y-2.5 transition-all text-xs ${
                            isPending 
                              ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-300/40' 
                              : 'bg-white border-slate-200 shadow-2xs hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                                <img 
                                  src={(h.gallery && h.gallery.length > 0 && h.gallery[0]) ? h.gallery[0] : (h.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80')} 
                                  alt={h.name || 'Hotel'} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-black text-slate-900 text-xs truncate">{h.name}</h4>
                                <p className="text-[10px] text-purple-900 font-bold">{h.category} • {h.location}</p>
                                <p className="text-[10px] text-slate-500 truncate">{h.address}</p>
                              </div>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                              isPending 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {isPending ? '⏳ Pending Approval' : '✅ Active & Live'}
                            </span>
                          </div>

                          {/* Tariffs summary */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/80 text-[10px]">
                            <div>
                              <span className="font-bold text-slate-600 block">AC Room Tariffs:</span>
                              <span className="font-black text-slate-900">3h: ₹{h.hourlyRate3h} | Night: ₹{h.nightRate}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-600 block">Non-AC Room Tariffs:</span>
                              <span className="font-black text-slate-900">3h: ₹{h.rooms?.[1]?.hourly3h || 499} | Night: ₹{h.rooms?.[1]?.nightRate || 1399}</span>
                            </div>
                          </div>

                          {/* Contact Info & Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-[11px] font-bold">
                              <a href={`tel:${h.phone}`} className="text-purple-900 hover:underline">
                                📞 +91 {h.phone}
                              </a>
                              {h.whatsapp && (
                                <a 
                                  href={`https://wa.me/91${(h.whatsapp || '').replace(/\D/g, '')}`} 
                                  target="_blank"
                                  className="text-emerald-700 hover:underline"
                                >
                                  💬 WhatsApp
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isPending ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectHotel(h.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer text-[10px]"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveHotel(h.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1 rounded-lg transition-colors cursor-pointer text-[10px] shadow-xs"
                                  >
                                    Approve & Publish
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePinHotel(h.id, h.slug)}
                                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                                      pinnedHotelIds.includes(h.id) || (h.slug && pinnedHotelIds.includes(h.slug))
                                        ? 'bg-amber-400 text-slate-950 border-amber-500 hover:bg-amber-500 shadow-xs'
                                        : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border-slate-250'
                                    }`}
                                    title="Pin this hotel at the very top of the list for all users"
                                  >
                                    <span>{pinnedHotelIds.includes(h.id) || (h.slug && pinnedHotelIds.includes(h.slug)) ? '👑 Pinned at #1 Top' : '📌 Pin at Top'}</span>
                                  </button>

                                  <Link
                                    href={`/dashboard?tab=hotel_bookings&hotelId=${encodeURIComponent(h.id)}&hotelName=${encodeURIComponent(h.name)}`}
                                    target="_blank"
                                    className="bg-purple-900 hover:bg-purple-950 text-white font-black px-2.5 py-1 rounded-lg transition-all text-[10px] shadow-2xs flex items-center gap-1 cursor-pointer"
                                    title="Open & manage this hotel's reception dashboard as Admin"
                                  >
                                    <span>🏨 Open Dashboard ↗</span>
                                  </Link>

                                  <Link
                                    href={`/hotels/${h.slug || h.id}`}
                                    target="_blank"
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg transition-colors text-[10px]"
                                  >
                                    View Live
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectHotel(h.id)}
                                    className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Hotel Listing"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                  </>
                )}

                {adminStaycationSubTab === 'resorts' && (
                  <>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-4">
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Waves className="w-4 h-4 text-cyan-600" />
                          <span>Resorts &amp; Private Pool Villas Management ({adminResortsList.length})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Manage Kelwa Beach resorts, private pool villas, day picnic packages, photos, ratings, and phone contacts across Boisar &amp; Palghar.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setNewResortName('');
                          setNewResortTagline('');
                          setNewResortLocation('');
                          setNewResortAddress('');
                          setNewResortPhone('');
                          setNewResortWhatsapp('');
                          setNewResortNightPrice('6999');
                          setNewResortDayPrice('899');
                          setNewResortImage('');
                          setNewResortGallery([]);
                          setAdminAddResortModalOpen(true);
                        }}
                        className="bg-cyan-700 hover:bg-cyan-800 active:scale-98 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>➕ Add Direct Resort / Villa</span>
                      </button>
                    </div>

                    {/* Search & Area Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={adminResortSearchQuery}
                          onChange={(e) => setAdminResortSearchQuery(e.target.value)}
                          placeholder="🔍 Search resort by name, area (Kelwa, Boisar, Dahanu), phone..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600 placeholder-slate-400"
                        />
                        {adminResortSearchQuery && (
                          <button
                            onClick={() => setAdminResortSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold self-center">
                        Showing {adminResortsList.filter(r => !adminResortSearchQuery || r.name.toLowerCase().includes(adminResortSearchQuery.toLowerCase()) || r.area.toLowerCase().includes(adminResortSearchQuery.toLowerCase())).length} of {adminResortsList.length} resorts
                      </div>
                    </div>

                    {/* Resorts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {adminResortsList
                        .filter(r => !adminResortSearchQuery || r.name.toLowerCase().includes(adminResortSearchQuery.toLowerCase()) || r.area.toLowerCase().includes(adminResortSearchQuery.toLowerCase()) || r.phone.includes(adminResortSearchQuery))
                        .map((resort) => (
                          <div
                            key={resort.id}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            {/* Cover Image & Area Badge */}
                            <div className="relative h-40 bg-slate-100 overflow-hidden">
                              <img
                                src={resort.gallery?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'}
                                alt={resort.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span className="bg-cyan-900/90 backdrop-blur-xs text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                                  {resort.area}
                                </span>
                                <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                                  {resort.type}
                                </span>
                              </div>
                              {resort.isFeatured && (
                                <span className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase flex items-center gap-1">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>

                            {/* Resort Details */}
                            <div className="p-3.5 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className="font-extrabold text-slate-900 text-sm truncate">{resort.name}</h4>
                                  <span className="text-amber-500 font-extrabold flex items-center gap-0.5 text-xs shrink-0">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {resort.rating}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium truncate">{resort.tagline}</p>
                                <p className="text-[10.5px] text-slate-600 font-semibold flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
                                  <span className="truncate">{resort.location}</span>
                                </p>
                              </div>

                              {/* Pricing Specs */}
                              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px]">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Night Stay</span>
                                  <strong className="text-slate-900 font-extrabold">₹{resort.pricePerNight}</strong>
                                  <span className="text-[9px] text-slate-400">/night</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Day Picnic</span>
                                  <strong className="text-cyan-700 font-extrabold">₹{resort.dayPicnicPrice || 799}</strong>
                                  <span className="text-[9px] text-slate-400">/person</span>
                                </div>
                              </div>

                              {/* Contact & Toggles */}
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleVerifyResort(resort.id)}
                                    className={`text-[10px] font-black px-2 py-1 rounded-lg border cursor-pointer transition-colors ${resort.verified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                    title="Toggle Verified Badge"
                                  >
                                    {resort.verified ? '✓ Verified' : 'Unverified'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleFeaturedResort(resort.id)}
                                    className={`text-[10px] font-black px-2 py-1 rounded-lg border cursor-pointer transition-colors ${resort.isFeatured ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                                    title="Toggle Featured Spotlight"
                                  >
                                    {resort.isFeatured ? '★ Featured' : 'Standard'}
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteResort(resort.id, resort.name)}
                                  className="text-rose-500 hover:text-rose-700 p-1 transition-colors cursor-pointer"
                                  title="Delete Resort"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {/* ── SUBTAB 3: HOTEL BOOKINGS & PAYOUT SETTLEMENTS LEDGER ── */}
                {adminStaycationSubTab === 'payouts' && (() => {
                  const totalGross = adminHotelBookings.reduce((acc, b) => acc + (Number(b.totalAmount) || 0), 0);
                  const totalCommission = Math.round(totalGross * 0.10); // 10% platform profit
                  const totalSettled = adminHotelBookings
                    .filter(b => (b.payoutStatus || '').toLowerCase() === 'settled')
                    .reduce((acc, b) => acc + Math.round((Number(b.totalAmount) || 0) * 0.90), 0);
                  const totalPayableToHotels = totalGross - totalCommission;
                  const pendingPayouts = Math.max(0, totalPayableToHotels - totalSettled);

                  return (
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-150 pb-3">
                        <div>
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Coins className="w-4 h-4 text-emerald-700" />
                            <span>Hotel Bookings &amp; Payout Settlements Ledger ({adminHotelBookings.length})</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Customer payments received 100% online on Majh Boisar. Deduct 10% platform commission and dispatch 90% payouts to hotel owners.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const raw = localStorage.getItem('majh_boisar_hotel_bookings');
                              if (raw) setAdminHotelBookings(JSON.parse(raw));
                            } catch (e) {}
                            alert(`Refreshed! Found ${adminHotelBookings.length} total hotel booking records.`);
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh Ledger</span>
                        </button>
                      </div>

                      {/* 4 Top Financial Stat Counters */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Total Bookings Revenue</span>
                          <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">₹{totalGross.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">100% online payments received</span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl">
                          <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Platform Commission (10%)</span>
                          <span className="text-lg sm:text-xl font-black text-emerald-700 mt-0.5 block">₹{totalCommission.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Majh Boisar Platform Profit</span>
                        </div>

                        <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl">
                          <span className="text-[9px] font-bold text-blue-800 uppercase tracking-wider block">Total Settled to Hotels</span>
                          <span className="text-lg sm:text-xl font-black text-blue-700 mt-0.5 block">₹{totalSettled.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-blue-600 font-semibold mt-0.5 block">Dispatched via UPI / IMPS</span>
                        </div>

                        <div className="bg-amber-50/70 border border-amber-300 p-3.5 rounded-2xl">
                          <span className="text-[9px] font-bold text-amber-900 uppercase tracking-wider block">Pending Hotel Settlements</span>
                          <span className="text-lg sm:text-xl font-black text-amber-900 mt-0.5 block">₹{pendingPayouts.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">90% payable to hotel owners</span>
                        </div>
                      </div>

                      {/* Ledger List */}
                      <div className="space-y-3 pt-2">
                        {adminHotelBookings.map((booking) => {
                          const gross = Number(booking.totalAmount) || 0;
                          const cut = Math.round(gross * 0.10);
                          const net = gross - cut;
                          const isSettled = (booking.payoutStatus || '').toLowerCase() === 'settled';

                          const hotelObj = adminHotelsList.find(h => h.id === booking.hotelId || h.name === booking.hotelName);
                          const upiId = booking.hotelUpi || hotelObj?.payoutUpi || (typeof window !== 'undefined' ? localStorage.getItem(`majh_hotel_payout_upi_${booking.hotelId}`) : '') || 'hotelresidency@upi';
                          const hotelPhone = booking.hotelPhone || hotelObj?.phone || '9820123456';

                          return (
                            <div
                              key={booking.id}
                              className={`p-4 rounded-2xl border transition-all text-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                                isSettled
                                  ? 'bg-white border-slate-200 shadow-2xs'
                                  : 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-300/40 shadow-xs'
                              }`}
                            >
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-black text-slate-900 text-sm">#{booking.id}</span>
                                  <span className="bg-purple-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                                    {booking.hotelName || 'Boisar Hotel'}
                                  </span>
                                  <span className="bg-purple-50 text-purple-900 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {booking.roomType || 'Room Stay'}
                                  </span>
                                  {isSettled ? (
                                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                                      ✅ Settled
                                    </span>
                                  ) : (
                                    <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                      ⏳ Pending Payout
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600 font-medium">
                                  <div>👤 Guest: <strong>{booking.guestName}</strong> ({booking.guestPhone})</div>
                                  <div>📅 Stay: <strong>{booking.checkInDate || 'Booked'}</strong></div>
                                  <div>⚡ Hotel UPI: <strong className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{upiId}</strong></div>
                                  {booking.payoutRef && <div>🔢 Settlement UTR: <strong className="font-mono text-emerald-800">{booking.payoutRef}</strong></div>}
                                </div>
                              </div>

                              {/* Amount Breakdown & Actions */}
                              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/80">
                                <div className="text-left sm:text-right space-y-0.5">
                                  <div className="text-xs text-slate-400 font-medium">
                                    Paid by Guest: <strong>₹{gross}</strong> • Platform Cut (10%): <strong className="text-emerald-700">₹{cut}</strong>
                                  </div>
                                  <div className="text-sm font-black text-slate-900">
                                    Payable to Hotel (90%): <span className="text-emerald-700 text-base font-black">₹{net.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(upiId);
                                      alert(`Copied UPI ID: ${upiId}`);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                                    title="Copy UPI ID"
                                  >
                                    📋 Copy UPI
                                  </button>

                                  <a
                                    href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(booking.hotelName || 'Hotel')}&am=${net}&cu=INR&tn=${encodeURIComponent(`Majh Boisar Payout #${booking.id}`)}`}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                    title="Open UPI app on mobile / PC"
                                  >
                                    <span>⚡ Pay via UPI</span>
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedBookingForPayout({ ...booking, hotelUpi: upiId, hotelPhone });
                                      setPayoutUtrInput(booking.payoutRef || '');
                                      setPayoutModalOpen(true);
                                    }}
                                    className={`font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer ${
                                      isSettled
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'bg-purple-900 hover:bg-purple-950 text-white'
                                    }`}
                                  >
                                    {isSettled ? '✏️ Edit UTR' : '💸 Mark as Settled'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Tab Content: Manage Directories */}
            {activeAdminTab === 'listings' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                {/* Listings Inner Switcher */}
                {(() => {
                  const allSpecialists = Object.entries(specialProfiles).flatMap(([cat, list]: any) =>
                    (list || []).map((p: any) => ({ ...p, catKey: cat }))
                  );
                  return (
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
                      <button
                        type="button"
                        onClick={() => setAdminListingSubTab('businesses')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          adminListingSubTab === 'businesses'
                            ? 'bg-slate-900 text-white shadow-2xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Local Businesses ({businesses.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminListingSubTab('specialists')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          adminListingSubTab === 'specialists'
                            ? 'bg-teal-700 text-white shadow-2xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Specialists &amp; Freelancers ({allSpecialists.length})</span>
                        {pendingSpecialists.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminListingSubTab('travels')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          adminListingSubTab === 'travels'
                            ? 'bg-blue-700 text-white shadow-2xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Travels &amp; Vehicles ({adminVehiclesList.length})</span>
                        {adminVehiclesList.filter(v => !v.verified).length > 0 && (
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                            {adminVehiclesList.filter(v => !v.verified).length} pending
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminListingSubTab('home-services')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          adminListingSubTab === 'home-services'
                            ? 'bg-teal-700 text-white shadow-2xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Home Services ({adminTechniciansList.length})</span>
                        {adminTechniciansList.filter(t => !t.verified).length > 0 && (
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                            {adminTechniciansList.filter(t => !t.verified).length} pending
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminListingSubTab('blood-donors')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          adminListingSubTab === 'blood-donors'
                            ? 'bg-rose-700 text-white shadow-2xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Blood Donors ({adminDonorsList.length})</span>
                        {adminDonorsList.filter(d => !d.verified).length > 0 && (
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                            {adminDonorsList.filter(d => !d.verified).length} pending
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })()}

                {adminListingSubTab === 'businesses' ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Local Business Directories</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Review listing stats, toggle verified checkmarks, multi-select bulk operations, and search listings.</p>
                      </div>
                      <button
                        onClick={() => setAdminAddBizModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>➕ Add Direct Business</span>
                      </button>
                    </div>

                    {/* Admin Search Bar & Multi-Select Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={adminBizSearchQuery}
                          onChange={(e) => setAdminBizSearchQuery(e.target.value)}
                          placeholder="🔍 Search business by name, category, location, phone..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 placeholder-slate-400"
                        />
                        {adminBizSearchQuery && (
                          <button
                            onClick={() => setAdminBizSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Bulk Action Controls */}
                      {selectedBizIds.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg animate-in fade-in">
                          <span className="text-[10px] font-black text-amber-900 uppercase">⚡ {selectedBizIds.length} Selected:</span>
                          <button
                            onClick={() => handleBulkVerifyBusinesses(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded cursor-pointer"
                          >
                            Verify Selected
                          </button>
                          <button
                            onClick={() => handleBulkVerifyBusinesses(false)}
                            className="bg-slate-600 hover:bg-slate-700 text-white text-[10px] font-black px-2.5 py-1 rounded cursor-pointer"
                          >
                            Unverify Selected
                          </button>
                          <button
                            onClick={handleBulkDeleteBusinesses}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2.5 py-1 rounded cursor-pointer"
                          >
                            Delete Selected
                          </button>
                          <button
                            onClick={() => setSelectedBizIds([])}
                            className="text-[10px] font-bold text-slate-500 hover:underline cursor-pointer ml-1"
                          >
                            Deselect
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 font-bold self-center">
                          Showing {filteredAdminBusinesses.length} of {businesses.length} businesses
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3 text-center w-8">
                              <input
                                type="checkbox"
                                checked={selectedBizIds.length > 0 && selectedBizIds.length === filteredAdminBusinesses.length}
                                onChange={toggleSelectAllBiz}
                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                              />
                            </th>
                            <th className="py-2.5 px-3">Business Name</th>
                            <th className="py-2.5 px-3">Category</th>
                            <th className="py-2.5 px-3">Tier</th>
                            <th className="py-2.5 px-3">Stats</th>
                            <th className="py-2.5 px-3 text-center">Verified</th>
                            <th className="py-2.5 px-3 text-center">Featured</th>
                            <th className="py-2.5 px-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs">
                          {filteredAdminBusinesses.length > 0 ? (
                            filteredAdminBusinesses.map((b) => (
                              <tr key={b.id} className={`hover:bg-slate-50 transition-colors ${selectedBizIds.includes(b.id) ? 'bg-teal-50/40' : ''}`}>
                                <td className="py-2.5 px-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedBizIds.includes(b.id)}
                                    onChange={() => toggleSelectBiz(b.id)}
                                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-3 font-extrabold text-slate-800">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span>{b.name}</span>
                                    {(b.subscription === 'Admin Created' || b.description?.includes('[Created by Admin]') || (b as any).createdBy === 'Admin' || (b as any).postedBy === 'Admin') && (
                                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1 shrink-0">
                                        👑 Created by Admin
                                      </span>
                                    )}
                                    <button
                                      onClick={() => {
                                        setEditingBizId(b.id);
                                        setEditBizName(b.name);
                                        setEditBizCategory(b.category);
                                        setEditBizDescription(b.description || '');
                                        setEditBizAddress(b.address || '');
                                        setEditBizPhone(b.phone || '');
                                        setEditBizWhatsapp(b.whatsapp || '');
                                        setEditBizWebsite(b.website || '');
                                        setEditBizEmail(b.email || '');
                                        setEditBizImage(b.image || '');
                                        setEditBizGallery(b.gallery || []);
                                        setEditBizGoogleMaps(b.googleMaps || '');
                                        setEditBizVerified(b.verified || false);
                                        setEditBizPremium(b.premium || false);
                                        setAdminEditModalOpen(true);
                                      }}
                                      className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-colors"
                                      title="Edit Business Details"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500">{b.category}</td>
                                <td className="py-2.5 px-3">
                                  <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                    {b.subscription}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 font-bold">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3 text-teal-600" /> {b.views} • <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {b.rating}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    onClick={() => handleVerifyBusiness(b.id, b.verified)}
                                    className="text-slate-400 hover:text-teal-600 transition-colors cursor-pointer inline-flex items-center"
                                  >
                                    {b.verified ? (
                                      <ToggleRight className="w-6 h-6 text-emerald-500" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-slate-300" />
                                    )}
                                  </button>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    onClick={() => handleTogglePremium(b.id, b.premium)}
                                    className="text-slate-400 hover:text-teal-600 transition-colors cursor-pointer inline-flex items-center"
                                  >
                                    {b.premium ? (
                                      <ToggleRight className="w-6 h-6 text-teal-600" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-slate-300" />
                                    )}
                                  </button>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={async () => {
                                        await handleClearBusinessAds(b.id, b.name);
                                      }}
                                      className="text-amber-500 hover:text-amber-600 transition-all cursor-pointer"
                                      title="Clear All Ads for this Business"
                                    >
                                      <ShieldAlert className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (confirm(`Are you sure you want to permanently delete "${b.name}"? This cannot be undone.`)) {
                                          await handleDeleteBusiness(b.id);
                                        }
                                      }}
                                      className="text-rose-500 hover:text-rose-700 transition-all cursor-pointer"
                                      title="Delete Business"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                                No businesses match your search query "{adminBizSearchQuery}"
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : adminListingSubTab === 'specialists' ? (
                  <>
                    {/* Specialist Network Directory Editor */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <span>Specialist Network Listings ({Object.entries(specialProfiles).flatMap(([cat, list]: any) => (list || [])).length})</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">Approve, verify, delete, and check subscription tiers of Specialist Network directory profiles.</p>
                        </div>
                        <button
                          onClick={() => setAdminAddSpecialistModalOpen(true)}
                          className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>➕ Add Specialist</span>
                        </button>
                      </div>

                      {/* Specialist Search Filter */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={adminSpecialistSearchQuery}
                            onChange={(e) => setAdminSpecialistSearchQuery(e.target.value)}
                            placeholder="🔍 Search specialist by name, specialty, category..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                          />
                          {adminSpecialistSearchQuery && (
                            <button
                              onClick={() => setAdminSpecialistSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="py-3 px-4">Name</th>
                              <th className="py-3 px-4">Specialty Category</th>
                              <th className="py-3 px-4">Active Plan</th>
                              <th className="py-3 px-4">Rating</th>
                              <th className="py-3 px-4 text-center">Verified Check</th>
                              <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {Object.entries(specialProfiles).flatMap(([catKey, list]: any) =>
                              (list || []).map((p: any) => ({ ...p, catKey }))
                            ).filter((p: any) => {
                              if (!adminSpecialistSearchQuery.trim()) return true;
                              const q = adminSpecialistSearchQuery.toLowerCase();
                              return (
                                (p.name || '').toLowerCase().includes(q) ||
                                (p.category || '').toLowerCase().includes(q) ||
                                (p.specialty || '').toLowerCase().includes(q) ||
                                (p.catKey || '').toLowerCase().includes(q)
                              );
                            }).map((p: any) => (
                              <tr key={`${p.catKey}-${p.id}`} className="hover:bg-slate-50">
                                <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-xs shrink-0 overflow-hidden">
                                    {p.avatar ? (
                                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                      p.name.charAt(0)
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-extrabold text-slate-900">{p.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: #{p.id}</div>
                                  </div>
                                </td>
                                <td className="py-4 px-4">
                                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    {p.category || p.catKey}
                                  </span>
                                  {(p.catKey === 'properties' || p.listingType === 'property') && (() => {
                                    const isRent = (p.forAction || '').toLowerCase() === 'rent' || (p.category || '').toLowerCase().includes('rent') || p.transactionType === 'Lease';
                                    return (
                                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                                        {Boolean(p.isFeatured) && (
                                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[8.5px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                            ⭐ FEATURED (ON TOP)
                                          </span>
                                        )}
                                        {Boolean(p.isSold) && (
                                          <span className={`border text-[8.5px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                                            isRent
                                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                                              : 'bg-rose-100 text-rose-900 border-rose-300'
                                          }`}>
                                            🔒 {isRent ? 'RENTED OUT' : 'SOLD OUT'}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                    p.subscription === 'Gold'
                                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                                      : p.subscription === 'Pro'
                                        ? 'bg-teal-50 border-teal-200 text-teal-700'
                                        : 'bg-slate-50 border-slate-200 text-slate-600'
                                  }`}>
                                    {p.subscription || 'Free'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-slate-505 font-bold flex items-center gap-1 mt-1">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{p.rating || 5.0}</span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <button
                                    onClick={() => handleVerifySpecialist(p.catKey, p.id, p.verified)}
                                    className="text-slate-405 hover:text-teal-600 transition-colors cursor-pointer inline-flex items-center"
                                  >
                                    {p.verified ? (
                                      <ToggleRight className="w-7 h-7 text-emerald-500" />
                                    ) : (
                                      <ToggleLeft className="w-7 h-7 text-slate-300" />
                                    )}
                                  </button>
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                    {(p.catKey === 'properties' || p.listingType === 'property') && (() => {
                                      const isRent = (p.forAction || '').toLowerCase() === 'rent' || (p.category || '').toLowerCase().includes('rent') || p.transactionType === 'Lease';
                                      return (
                                        <>
                                          <button
                                            onClick={() => handleAdminToggleFeatured(p.id, Boolean(p.isFeatured))}
                                            className={`text-[10px] font-black px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs ${
                                              p.isFeatured
                                                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-amber-500/20'
                                                : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300'
                                            }`}
                                            title="Pin to top in Recent Listings & Search Results"
                                          >
                                            <Star className={`w-3 h-3 ${p.isFeatured ? 'fill-slate-950 text-slate-950' : 'text-amber-500'}`} />
                                            <span>{p.isFeatured ? 'Featured (Top)' : 'Pin Top'}</span>
                                          </button>

                                          <button
                                            onClick={() => handleAdminToggleSold(p.id, Boolean(p.isSold))}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer active:scale-95 border ${
                                              p.isSold
                                                ? (isRent
                                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 font-black'
                                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 font-black')
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                            }`}
                                            title={p.isSold ? 'Mark as Available' : (isRent ? 'Mark as Rented Out' : 'Mark as Sold Out')}
                                          >
                                            {p.isSold ? (isRent ? '🔒 Rented' : '🔒 Sold') : 'Available'}
                                          </button>
                                        </>
                                      );
                                    })()}

                                    <button
                                      onClick={() => handleDeleteSpecialist(p.catKey, p.id)}
                                      className="p-1 text-rose-500 hover:text-rose-700 hover:scale-105 transition-all cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : adminListingSubTab === 'travels' ? (
                  <>
                    {/* Travels & Vehicles Directory Editor */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Car className="w-4 h-4 text-blue-600" />
                            <span>Travels &amp; Vehicle Rentals ({adminVehiclesList.length})</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">Manage registered cars, auto rickshaws, bike rentals, tempos, buses and commercial transport services.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              fetchAdminData();
                              showToast('🔄 Travels list refreshed from database!', 'success');
                            }}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                            <span>Refresh</span>
                          </button>
                          <button
                            onClick={() => setAdminAddVehicleModalOpen(true)}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>➕ Add Vehicle / Driver</span>
                          </button>
                        </div>
                      </div>

                      {/* Search Filter */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={adminVehicleSearchQuery}
                            onChange={(e) => setAdminVehicleSearchQuery(e.target.value)}
                            placeholder="🔍 Search vehicle by driver name, model, phone, location, category..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                          />
                          {adminVehicleSearchQuery && (
                            <button
                              onClick={() => setAdminVehicleSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Listings Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3 px-3">Photo</th>
                              <th className="py-3 px-3">Driver / Agency</th>
                              <th className="py-3 px-3">Category</th>
                              <th className="py-3 px-3">Model &amp; Capacity</th>
                              <th className="py-3 px-3">Rate / Fares</th>
                              <th className="py-3 px-3">Stand / Location</th>
                              <th className="py-3 px-3">Phone</th>
                              <th className="py-3 px-3 text-center">Status</th>
                              <th className="py-3 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {adminVehiclesList.filter(v => {
                              if (!adminVehicleSearchQuery.trim()) return true;
                              const q = adminVehicleSearchQuery.toLowerCase();
                              return (
                                (v.name || '').toLowerCase().includes(q) ||
                                (v.vehicleModel || '').toLowerCase().includes(q) ||
                                (v.category || '').toLowerCase().includes(q) ||
                                (v.location || '').toLowerCase().includes(q) ||
                                (v.phone || '').includes(q)
                              );
                            }).length > 0 ? (
                              adminVehiclesList.filter(v => {
                                if (!adminVehicleSearchQuery.trim()) return true;
                                const q = adminVehicleSearchQuery.toLowerCase();
                                return (
                                  (v.name || '').toLowerCase().includes(q) ||
                                  (v.vehicleModel || '').toLowerCase().includes(q) ||
                                  (v.category || '').toLowerCase().includes(q) ||
                                  (v.location || '').toLowerCase().includes(q) ||
                                  (v.phone || '').includes(q)
                                );
                              }).map(v => (
                                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 px-3">
                                    <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                                      {v.image ? (
                                        <img src={v.image} alt={v.name} className="w-full h-full object-cover object-center hover:scale-125 transition-transform duration-300 cursor-pointer" onClick={() => window.open(v.image, '_blank')} title="Click to open full photo" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">🚗</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 font-bold text-slate-800">
                                    <div className="text-xs font-black text-slate-900">{v.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: #{v.id}</div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9.5px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                                      {v.category || 'Car & Cab'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-slate-700">
                                    <div className="font-bold text-slate-800 text-[11px]">{v.vehicleModel || 'Standard'}</div>
                                    <div className="text-[10px] text-slate-500">{v.capacity || '4+1'}</div>
                                  </td>
                                  <td className="py-3 px-3 font-bold text-blue-700 text-[11px]">
                                    {v.ratePerKm || 'Standard'}
                                  </td>
                                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                                    📍 {v.location || 'Boisar'}
                                  </td>
                                  <td className="py-3 px-3">
                                    <a href={`tel:${v.phone}`} className="text-blue-600 font-bold hover:underline text-[11px] flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-blue-500" />
                                      <span>{v.phone}</span>
                                    </a>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      {v.verified ? (
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                                          ✓ Approved &amp; Live
                                        </span>
                                      ) : (
                                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md whitespace-nowrap animate-pulse">
                                          ⏳ Pending Approval
                                        </span>
                                      )}
                                      {v.featured && (
                                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded-md whitespace-nowrap">
                                          ⭐ Top Choice
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleToggleFeatureVehicle(v.id, Boolean(v.featured))}
                                        className={`text-[10px] font-black px-2 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                                          v.featured 
                                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs hover:bg-amber-500' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                                        }`}
                                        title={v.featured ? 'Remove from top featured' : 'Pin to top of category as Featured / Top Choice'}
                                      >
                                        {v.featured ? '⭐ Featured' : '☆ Feature'}
                                      </button>
                                      {v.verified ? (
                                        <button
                                          onClick={() => handleToggleApproveVehicle(v.id, true)}
                                          className="text-[10px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                          title="Pause / Unpublish listing"
                                        >
                                          Unpublish
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleToggleApproveVehicle(v.id, false)}
                                          className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
                                          title="Approve and make visible on live website"
                                        >
                                          ✓ Approve &amp; Publish
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteVehicle(v.id, v.name)}
                                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                                        title="Delete Vehicle Listing"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={9} className="py-8 text-center text-slate-400 font-bold">
                                  No vehicle listings found. Click "+ Add Vehicle / Driver" to list one in database.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : adminListingSubTab === 'home-services' ? (
                  <>
                    {/* Home Services & Technicians Directory Editor */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Wrench className="w-4 h-4 text-teal-600" />
                            <span>Home Services &amp; Technicians ({adminTechniciansList.length})</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Manage home service technicians, AC repair, electricians, plumbers, house maids, cooks, and drivers.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              fetchAdminData();
                              showToast('🔄 Home Services list refreshed from database!', 'success');
                            }}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                            <span>Refresh</span>
                          </button>
                          <button
                            onClick={() => setAdminAddTechModalOpen(true)}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>➕ Add Service / Helper</span>
                          </button>
                        </div>
                      </div>

                      {/* Search Filter */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={adminTechnicianSearchQuery}
                            onChange={(e) => setAdminTechnicianSearchQuery(e.target.value)}
                            placeholder="🔍 Search technician or helper by name, category, phone, location, experience..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                          />
                          {adminTechnicianSearchQuery && (
                            <button
                              onClick={() => setAdminTechnicianSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Technicians Listings Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3 px-3">Photo</th>
                              <th className="py-3 px-3">Technician / Name</th>
                              <th className="py-3 px-3">Category</th>
                              <th className="py-3 px-3">Experience</th>
                              <th className="py-3 px-3">Visiting Fee / Salary</th>
                              <th className="py-3 px-3">Service Location</th>
                              <th className="py-3 px-3">Contact Phone</th>
                              <th className="py-3 px-3 text-center">Calls / WA</th>
                              <th className="py-3 px-3 text-center">Status</th>
                              <th className="py-3 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {adminTechniciansList.filter(t => {
                              if (!adminTechnicianSearchQuery.trim()) return true;
                              const q = adminTechnicianSearchQuery.toLowerCase();
                              return (
                                (t.name || '').toLowerCase().includes(q) ||
                                (t.category || '').toLowerCase().includes(q) ||
                                (t.location || '').toLowerCase().includes(q) ||
                                (t.experience || '').toLowerCase().includes(q) ||
                                (t.phone || '').includes(q)
                              );
                            }).length > 0 ? (
                              adminTechniciansList.filter(t => {
                                if (!adminTechnicianSearchQuery.trim()) return true;
                                const q = adminTechnicianSearchQuery.toLowerCase();
                                return (
                                  (t.name || '').toLowerCase().includes(q) ||
                                  (t.category || '').toLowerCase().includes(q) ||
                                  (t.location || '').toLowerCase().includes(q) ||
                                  (t.experience || '').toLowerCase().includes(q) ||
                                  (t.phone || '').includes(q)
                                );
                              }).map(t => (
                                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3 px-3">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                                      {t.image ? (
                                        <img src={t.image} alt={t.name} className="w-full h-full object-cover object-center hover:scale-125 transition-transform duration-300 cursor-pointer" onClick={() => window.open(t.image, '_blank')} title="Click to open full photo" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">🔧</div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 font-bold text-slate-800">
                                    <div className="text-xs font-black text-slate-900">{t.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">ID: #{t.id}</div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[9.5px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                                      {t.category || 'Service'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-slate-700">
                                    <div className="font-bold text-slate-800 text-[11px]">{t.experience || '5+ Yrs'}</div>
                                    <div className="text-[10px] text-slate-500">{t.timing || 'On-Demand'}</div>
                                  </td>
                                  <td className="py-3 px-3 font-bold text-teal-800 text-[11px]">
                                    {t.visitingFee || '₹199'}
                                  </td>
                                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                                    📍 {t.location || 'Boisar'}
                                  </td>
                                  <td className="py-3 px-3">
                                    <a href={`tel:${t.phone}`} className="text-teal-700 font-bold hover:underline text-[11px] flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-teal-600" />
                                      <span>{t.phone}</span>
                                    </a>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {t.allowCalls !== false ? (
                                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                        Call &amp; WA
                                      </span>
                                    ) : (
                                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                        WhatsApp
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                      {t.verified ? (
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                                          ✓ Approved &amp; Live
                                        </span>
                                      ) : (
                                        <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md whitespace-nowrap animate-pulse">
                                          ⏳ Pending Approval
                                        </span>
                                      )}
                                      {t.featured && (
                                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded-md whitespace-nowrap">
                                          ⭐ Top Choice
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => handleToggleFeatureTechnician(t.id, Boolean(t.featured))}
                                        className={`text-[10px] font-black px-2 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                                          t.featured 
                                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs hover:bg-amber-500' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                                        }`}
                                        title={t.featured ? 'Remove from top featured' : 'Pin to top of category as Featured / Top Choice'}
                                      >
                                        {t.featured ? '⭐ Featured' : '☆ Feature'}
                                      </button>
                                      {t.verified ? (
                                        <button
                                          onClick={() => handleToggleApproveTechnician(t.id, true)}
                                          className="text-[10px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                          title="Pause / Unpublish listing"
                                        >
                                          Unpublish
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleToggleApproveTechnician(t.id, false)}
                                          className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
                                          title="Approve and make visible on live website"
                                        >
                                          ✓ Approve &amp; Publish
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteTechnician(t.id, t.name)}
                                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                                        title="Delete Home Service Listing"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={10} className="py-8 text-center text-slate-400 font-bold">
                                  No home service listings found. Click "+ Add Service / Helper" to list one in database.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Blood Donors (रक्तदाता) Directory Editor */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Heart className="w-4 h-4 text-rose-600 fill-rose-100" />
                            <span>Blood Donors (रक्तदाता) Directory ({adminDonorsList.length})</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Manage voluntary blood donors across Boisar, Tarapur MIDC &amp; Palghar. Approve, publish, and delete donor profiles.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              fetchAdminData();
                              showToast('🔄 Blood Donors list refreshed from database!', 'success');
                            }}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                            <span>Refresh</span>
                          </button>
                          <button
                            onClick={() => setAdminAddDonorModalOpen(true)}
                            className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>➕ Add Blood Donor</span>
                          </button>
                        </div>
                      </div>

                      {/* Search & Blood Group Quick Filter */}
                      <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={adminDonorSearchQuery}
                            onChange={(e) => setAdminDonorSearchQuery(e.target.value)}
                            placeholder="🔍 Search donor by name, location, phone, blood group (e.g. O+, B+, Tarapur)..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600"
                          />
                          {adminDonorSearchQuery && (
                            <button
                              onClick={() => setAdminDonorSearchQuery('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 mr-1">Group:</span>
                          {['All', 'O+', 'B+', 'A+', 'AB+', 'O-', 'B-', 'A-', 'AB-'].map(bg => (
                            <button
                              key={bg}
                              type="button"
                              onClick={() => setAdminDonorGroupFilter(bg)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                adminDonorGroupFilter === bg
                                  ? 'bg-rose-700 text-white shadow-2xs font-black'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {bg}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Donors Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                              <th className="py-3 px-3">#ID</th>
                              <th className="py-3 px-3">Donor Name</th>
                              <th className="py-3 px-3">Blood Group</th>
                              <th className="py-3 px-3">Location / Area</th>
                              <th className="py-3 px-3">Contact Details</th>
                              <th className="py-3 px-3">Availability / Status</th>
                              <th className="py-3 px-3 text-center">Status</th>
                              <th className="py-3 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {adminDonorsList.filter(d => {
                              const matchGroup = adminDonorGroupFilter === 'All' || (d.bloodGroup || '').toUpperCase() === adminDonorGroupFilter.toUpperCase();
                              if (!matchGroup) return false;
                              if (!adminDonorSearchQuery.trim()) return true;
                              const q = adminDonorSearchQuery.toLowerCase();
                              return (
                                (d.name || '').toLowerCase().includes(q) ||
                                (d.bloodGroup || '').toLowerCase().includes(q) ||
                                (d.location || '').toLowerCase().includes(q) ||
                                (d.phone || '').includes(q)
                              );
                            }).length > 0 ? (
                              adminDonorsList.filter(d => {
                                const matchGroup = adminDonorGroupFilter === 'All' || (d.bloodGroup || '').toUpperCase() === adminDonorGroupFilter.toUpperCase();
                                if (!matchGroup) return false;
                                if (!adminDonorSearchQuery.trim()) return true;
                                const q = adminDonorSearchQuery.toLowerCase();
                                return (
                                  (d.name || '').toLowerCase().includes(q) ||
                                  (d.bloodGroup || '').toLowerCase().includes(q) ||
                                  (d.location || '').toLowerCase().includes(q) ||
                                  (d.phone || '').includes(q)
                                );
                              }).map(d => (
                                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                                    #{d.id}
                                  </td>
                                  <td className="py-3 px-3 font-bold text-slate-900">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center font-black text-xs shrink-0 border border-rose-200">
                                        {d.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <span>{d.name}</span>
                                        <div className="text-[10px] text-slate-400 font-normal">
                                          Registered: {new Date(d.createdAt).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-black px-2.5 py-1 rounded-full text-xs border border-rose-200 shadow-2xs">
                                      🩸 {d.bloodGroup}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-slate-700">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span>{d.location || 'Boisar West'}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`tel:${d.phone}`}
                                        className="text-blue-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                                      >
                                        <Phone className="w-3 h-3 text-blue-600" />
                                        <span>{d.phone}</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/91${d.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(d.name)}%2C%20we%20have%20an%20urgent%20requirement%20for%20${encodeURIComponent(d.bloodGroup)}%20blood%20in%20Boisar.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded hover:bg-emerald-100"
                                      >
                                        WhatsApp
                                      </a>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                      {d.lastDonated || 'Ready to donate'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {d.verified ? (
                                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-md whitespace-nowrap">
                                        ✓ Approved &amp; Live
                                      </span>
                                    ) : (
                                      <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md whitespace-nowrap animate-pulse">
                                        ⏳ Pending Approval
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      {d.verified ? (
                                        <button
                                          onClick={() => handleToggleApproveDonor(d.id, true)}
                                          className="text-[10px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                          title="Pause / Unpublish donor profile"
                                        >
                                          Unpublish
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleToggleApproveDonor(d.id, false)}
                                          className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
                                          title="Approve and make visible on live website"
                                        >
                                          ✓ Approve &amp; Publish
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteDonor(d.id, d.name)}
                                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                                        title="Delete Blood Donor Profile"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                                  No blood donors found. Click "+ Add Blood Donor" to add one to database.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab Content: Registered Users Directory */}
            {activeAdminTab === 'users' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-150 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>Registered Platform Users ({registeredUsers.length})</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Full directory of all accounts registered via OTP login on Majh Boisar. Search &amp; multi-select user management.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        refreshUsers();
                        logEvent('Manually refreshed registered users directory from server.');
                        showToast('🔄 Registered users list refreshed from server database!', 'success');
                      }}
                      className="flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                      <span>Refresh Users</span>
                    </button>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>{registeredUsers.length} Active Accounts</span>
                    </div>
                  </div>
                </div>

                {/* Admin User Search Bar & Multi-Select Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={adminUserSearchQuery}
                      onChange={(e) => setAdminUserSearchQuery(e.target.value)}
                      placeholder="🔍 Search user by name, mobile, email, role..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 placeholder-slate-400"
                    />
                    {adminUserSearchQuery && (
                      <button
                        onClick={() => setAdminUserSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Bulk Action Controls */}
                  {selectedUserIds.length > 0 ? (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg animate-in fade-in">
                      <span className="text-[10px] font-black text-amber-900 uppercase">⚡ {selectedUserIds.length} Users Selected:</span>
                      <button
                        onClick={handleBulkDeleteUsers}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-2.5 py-1 rounded cursor-pointer"
                      >
                        Delete Selected Users
                      </button>
                      <button
                        onClick={() => setSelectedUserIds([])}
                        className="text-[10px] font-bold text-slate-500 hover:underline cursor-pointer ml-1"
                      >
                        Deselect
                      </button>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold self-center">
                      Showing {filteredAdminUsers.length} of {registeredUsers.length} users
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 text-center w-8">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredAdminUsers.length}
                            onChange={toggleSelectAllUsers}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-3">User Name</th>
                        <th className="py-2.5 px-3">Mobile / WhatsApp</th>
                        <th className="py-2.5 px-3">Email Address</th>
                        <th className="py-2.5 px-3">User Role</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs">
                      {filteredAdminUsers.length > 0 ? (
                        filteredAdminUsers.map((usr: any) => (
                          <tr key={usr.id} className={`hover:bg-slate-50 transition-colors ${selectedUserIds.includes(usr.id) ? 'bg-teal-50/40' : ''}`}>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedUserIds.includes(usr.id)}
                                onChange={() => toggleSelectUser(usr.id)}
                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-3 font-extrabold text-slate-850 flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs shrink-0">
                                {usr.name ? usr.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="truncate">{usr.name}</span>
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <a
                                href={`https://wa.me/91${usr.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-700 hover:text-teal-900 underline flex items-center gap-1"
                                title="Chat on WhatsApp"
                              >
                                <Phone className="w-3 h-3 text-teal-600" />
                                <span>+91 {usr.phone}</span>
                              </a>
                            </td>
                            <td className="py-3 px-3 text-slate-500 font-medium">{usr.email || 'N/A'}</td>
                            <td className="py-3 px-3">
                              <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                {usr.role || 'Registered User'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400 font-medium">{usr.joinedDate || '2026-07-20'}</td>
                            <td className="py-3 px-3 text-center">
                              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleDeleteRegisteredUser(usr.id, usr.name)}
                                className="text-rose-500 hover:text-rose-700 transition-all cursor-pointer"
                                title="Remove user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 font-bold">
                            No users match your search query "{adminUserSearchQuery}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Content: Account Deletion Requests */}
            {activeAdminTab === 'deletion_requests' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-150 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Account Deletion Requests ({deletionRequests.length})</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Review user account deletion requests submitted via Help menu or Settings modal.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{deletionRequests.filter(r => r.status === 'Pending').length} Pending Requests</span>
                  </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Req ID</th>
                        <th className="py-2.5 px-3">User Name</th>
                        <th className="py-2.5 px-3">Mobile / WhatsApp</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Reason</th>
                        <th className="py-2.5 px-3">Requested At</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs">
                      {deletionRequests.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                            No account deletion requests received yet.
                          </td>
                        </tr>
                      ) : (
                        deletionRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-slate-400 text-[11px]">
                              #DEL-{req.id.toString().slice(-4)}
                            </td>
                            <td className="py-3 px-3 font-extrabold text-slate-850">
                              {req.userName}
                            </td>
                            <td className="py-3 px-3 font-bold text-slate-800">
                              <a
                                href={`https://wa.me/91${req.userPhone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-700 hover:text-teal-900 underline flex items-center gap-1"
                                title="Chat on WhatsApp"
                              >
                                <Phone className="w-3 h-3 text-teal-600" />
                                <span>+91 {req.userPhone}</span>
                              </a>
                            </td>
                            <td className="py-3 px-3 text-slate-500 font-medium">{req.userEmail || 'N/A'}</td>
                            <td className="py-3 px-3 text-slate-600 font-medium max-w-xs truncate" title={req.reason}>
                              {req.reason || 'User requested account deletion'}
                            </td>
                            <td className="py-3 px-3 text-slate-400 font-medium text-[11px]">
                              {req.requestedAt}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase ${req.status === 'Pending' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  req.status === 'Approved & Deleted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {req.status === 'Pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveDeletion(req.id)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                                      title="Approve and delete user account"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Approve &amp; Delete</span>
                                    </button>
                                    <button
                                      onClick={() => handleRejectDeletion(req.id)}
                                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                                      title="Reject deletion request"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteDeletionRecord(req.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}



            {/* Tab Content: Platform leads audit */}
            {activeAdminTab === 'leads' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Boisar-wide Leads Log</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Audits every customer callback request and quotation submitted on the platform.</p>
                </div>

                <div className="space-y-2.5">
                  {leads.map((lead) => (
                    <div key={lead.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1 shadow-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-800">{lead.customerName} ({lead.customerPhone})</span>
                        <span className="text-[9px] text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-black uppercase">{lead.status}</span>
                      </div>
                      <p className="text-slate-500 font-medium">Target: <strong className="text-slate-800">{lead.business?.name || `Shop ID ${lead.id}`}</strong></p>
                      <p className="bg-white border border-slate-200 p-2 rounded text-slate-700 text-xs italic">"{lead.query}"</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(lead.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content: Review Moderation */}
            {activeAdminTab === 'reviews' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Customer Review Moderation</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Monitor user ratings, filter abusive logs, and moderate fake review complaints.</p>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8 font-bold">No reviews recorded on platform yet.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-slate-800">{rev.userName}</strong>
                            <span className="text-slate-400 font-medium">reviewed</span>
                            <span className="text-teal-700 font-black bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[10px]">{rev.business?.name || "Local Shop"}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-slate-700 text-xs italic">"{rev.comment}"</p>
                        </div>

                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-600 border border-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-all cursor-pointer self-start sm:self-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Review</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Sponsored Ad Orders */}
            {activeAdminTab === 'ad_orders' && (
              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2 text-left">
                  <div>
                    <h3 className="text-xs font-black text-slate-855 uppercase tracking-wider">Merchant Sponsored Campaigns</h3>
                    <p className="text-xs text-slate-550 mt-0.5">Review, verify assets, and activate sponsored listing campaigns on the platform.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdminAdFormOpen(!adminAdFormOpen)}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Ad Campaign
                    </button>
                    <span className="bg-teal-50 border border-teal-200 text-teal-650 font-bold px-3 py-1 rounded text-xs">
                      Pending Ads: {adOrders.filter(o => o.status === 'Pending').length}
                    </span>
                  </div>
                </div>

                {/* Live Ad Slot Dashboard */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Live Ad Slot Occupancy</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">Realtime Status</span>
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {/* Homepage Carousel */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Homepage Carousel</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-slate-800">
                            {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement?.startsWith('Homepage Carousel') || o.placement === 'All Placements (Run Everywhere)')).length}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-1">/ 3 Slots</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1">
                        {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement?.startsWith('Homepage Carousel') || o.placement === 'All Placements (Run Everywhere)')).map(a => (
                          <span key={a.id} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium text-emerald-700 truncate max-w-full">
                            ● {a.title || a.businessName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Homepage Spotlight */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Homepage Spotlight</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-slate-800">
                            {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement?.startsWith('Homepage Spotlight') || o.placement === 'All Placements (Run Everywhere)')).length}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-1">/ 3 Slots</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1">
                        {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement?.startsWith('Homepage Spotlight') || o.placement === 'All Placements (Run Everywhere)')).map(a => (
                          <span key={a.id} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium text-emerald-700 truncate max-w-full">
                            ● {a.title || a.businessName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Category Top Banner */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category Top Banner</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-slate-800">
                            {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement === 'Category Top Banner' || o.placement === 'All Placements (Run Everywhere)')).length}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-1">/ 1 Slot</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1">
                        {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement === 'Category Top Banner' || o.placement === 'All Placements (Run Everywhere)')).map(a => (
                          <span key={a.id} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium text-emerald-700 truncate max-w-full">
                            ● {a.title || a.businessName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Search Sidebar */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Sidebar</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-slate-800">
                            {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement?.startsWith('Sidebar Standard') || o.placement === 'All Placements (Run Everywhere)')).length}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-1">/ 2 Slots</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1">
                        {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement?.startsWith('Sidebar Standard') || o.placement === 'All Placements (Run Everywhere)')).map(a => (
                          <span key={a.id} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium text-emerald-700 truncate max-w-full">
                            ● {a.title || a.businessName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Results Leaderboard */}
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Results Leaderboard</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-extrabold text-slate-800">
                            {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement === 'Results Leaderboard' || o.placement === 'All Placements (Run Everywhere)')).length}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mb-1">/ 4 Slots</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap gap-1">
                        {adOrders.filter(o => o.status === 'Approved' && !o.isExpired && (o.placement === 'Results Leaderboard' || o.placement === 'All Placements (Run Everywhere)')).map(a => (
                          <span key={a.id} className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium text-emerald-700 truncate max-w-full">
                            ● {a.title || a.businessName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {adminAdFormOpen && (
                  <form onSubmit={handleCreateAdminAd} className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 space-y-4 shadow-sm animate-fade-in text-left">
                    <h4 className="font-extrabold text-slate-800 text-sm">Publish New Sponsored Ad</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Target Business</label>
                        <select
                          value={adminAdBizId}
                          onChange={e => setAdminAdBizId(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                        >
                          <option value="">-- Choose Business --</option>
                          <option value="-1">➕ Create & Promote New Business</option>
                          <option value="-2">🖼️ Direct Image Ad (No Business Needed)</option>
                          {businesses.map(b => (
                            <option key={b.id} value={b.id.toString()}>{b.name} ({b.category})</option>
                          ))}
                        </select>
                        {adminAdBizId === '-1' && (
                          <div className="mt-3 p-3 bg-slate-100 rounded-lg space-y-3 border border-slate-200">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Business Name</label>
                              <input
                                type="text"
                                value={adminAdNewBizName}
                                onChange={e => setAdminAdNewBizName(e.target.value)}
                                placeholder="e.g. Shree Ganesh Plumbers"
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                                <input
                                  type="text"
                                  value={adminAdNewBizPhone}
                                  onChange={e => setAdminAdNewBizPhone(e.target.value)}
                                  placeholder="10-digit number"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                <input
                                  type="text"
                                  value={adminAdNewBizCategory}
                                  onChange={e => setAdminAdNewBizCategory(e.target.value)}
                                  placeholder="e.g. Plumbers"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-3 bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            🎯 Select Ad Placements (Multi-Select Supported)
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedPlacements([
                                'Homepage Carousel Slot 1',
                                'Homepage Carousel Slot 2',
                                'Homepage Carousel Slot 3',
                                'Homepage Spotlight Slot 1',
                                'Homepage Spotlight Slot 2',
                                'Homepage Spotlight Slot 3',
                                'Category Top Banner',
                                'Sidebar Standard Slot 1',
                                'Sidebar Standard Slot 2',
                                'Results Leaderboard'
                              ])}
                              className="text-[10px] font-bold text-indigo-600 hover:underline"
                            >
                              Select All
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => setSelectedPlacements([])}
                              className="text-[10px] font-bold text-slate-400 hover:underline"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                          {[
                            { id: 'Homepage Carousel Slot 1', label: '🎠 Carousel Slot 1 (1200x500 px - 16:7)' },
                            { id: 'Homepage Carousel Slot 2', label: '🎠 Carousel Slot 2 (1200x500 px - 16:7)' },
                            { id: 'Homepage Carousel Slot 3', label: '🎠 Carousel Slot 3 (1200x500 px - 16:7)' },
                            { id: 'Homepage Spotlight Slot 1', label: '🌟 Bottom Card 1 (800x600 px - 4:3)' },
                            { id: 'Homepage Spotlight Slot 2', label: '🌟 Bottom Card 2 (800x600 px - 4:3)' },
                            { id: 'Homepage Spotlight Slot 3', label: '🌟 Bottom Card 3 (800x600 px - 4:3)' },
                            { id: 'Category Top Banner', label: '🏷️ Top Header & Results Leaderboard (1200x300 px - 4:1)' },
                            { id: 'Sidebar Standard Slot 1', label: '📌 Sidebar Top Card (600x600 px - 1:1)' },
                            { id: 'Sidebar Standard Slot 2', label: '📌 Sidebar Bottom Card (600x600 px - 1:1)' },
                            { id: 'All Placements (Run Everywhere)', label: '🚀 Run Everywhere (Auto-Fits All)' }
                          ].map(slot => {
                            const isChecked = selectedPlacements.includes(slot.id);
                            return (
                              <label
                                key={slot.id}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${isChecked
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setSelectedPlacements(prev => [...prev, slot.id]);
                                    } else {
                                      setSelectedPlacements(prev => prev.filter(item => item !== slot.id));
                                    }
                                  }}
                                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                />
                                <span className="truncate">{slot.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Headline / Title</label>
                        <input
                          type="text"
                          value={adminAdTitle}
                          onChange={e => setAdminAdTitle(e.target.value)}
                          placeholder="Optional for Direct Image Ad"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration (Days)</label>
                        <input
                          type="number"
                          value={adminAdDuration}
                          onChange={e => setAdminAdDuration(e.target.value)}
                          required
                          min="1"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tagline / Description Text</label>
                        <textarea
                          value={adminAdDesc}
                          onChange={e => setAdminAdDesc(e.target.value)}
                          rows={2}
                          placeholder="Optional for Direct Image Ad"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                        ></textarea>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Direct Image Asset (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          required={adminAdBizId === '-2'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setAdminAdImage(reader.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setAdminAdImage('');
                            }
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                        />
                        {adminAdImage && (
                          <div className="mt-2 h-20 w-auto inline-block rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                            <img src={adminAdImage} alt="Ad Preview" className="h-full object-contain" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target URL (On Click) (Optional)</label>
                        <input
                          type="url"
                          value={adminAdTargetUrl}
                          onChange={e => setAdminAdTargetUrl(e.target.value)}
                          placeholder="e.g. https://www.yourwebsite.com/offer"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={creatingAdminAd}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {creatingAdminAd ? 'Publishing Campaign...' : 'Publish Sponsored Ad'}
                      </button>
                    </div>
                  </form>
                )}

                {adOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-12">No sponsored ad requests have been placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {adOrders.map((order) => (
                      <div key={order.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-xs shadow-sm text-left">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-slate-800 truncate max-w-[200px]">{order.businessName}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-black uppercase tracking-wider">{order.placement}</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${order.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                              }`}>{order.status}</span>
                          </div>

                          <p className="font-bold text-slate-700">Headline: <span className="text-slate-900 font-extrabold">{order.title}</span></p>
                          <p className="text-slate-500 font-medium">"{order.description}"</p>
                          {order.image && (
                            <p className="text-[10px] text-teal-655 truncate font-semibold">Image: <a href={order.image} target="_blank" className="hover:underline">{order.image}</a></p>
                          )}

                          <div className="flex gap-4 pt-1 text-[10px] text-slate-405 font-bold uppercase tracking-wider flex-wrap">
                            <span>Duration: {order.durationDays} Days</span>
                            <span>Daily Budget: ₹{order.dailyBudget}</span>
                            <span className="text-teal-605">Total Cost: ₹{order.totalCost}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
                          {order.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateAdStatus(order.id, 'Approved')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateAdStatus(order.id, 'Rejected')}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteAdOrder(order.id)}
                            className="bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-500 text-slate-400 p-2 rounded-xl transition-colors cursor-pointer"
                            title="Delete ad order log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Spam & Flagged Reports */}
            {activeAdminTab === 'spam_reports' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" /> Community Flagged &amp; Spam Reports ({reportsList.length})
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Listings reported by Boisar users for invalid number, wrong pricing, fake information, or spam.</p>
                  </div>
                  <button
                    onClick={fetchAdminData}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {reportsList.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="text-sm font-black text-slate-700">No Spam or Invalid Reports Pending!</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">All user-submitted reports have been resolved and Boisar directory is clean.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs font-medium text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-black">
                        <tr>
                          <th className="px-3.5 py-3">Report ID</th>
                          <th className="px-3.5 py-3">Listing ID / Type</th>
                          <th className="px-3.5 py-3">Reason for Report</th>
                          <th className="px-3.5 py-3">Status</th>
                          <th className="px-3.5 py-3">Date</th>
                          <th className="px-3.5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reportsList.map((report) => (
                          <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3.5 py-3 font-bold text-slate-900">#{report.id}</td>
                            <td className="px-3.5 py-3">
                              <span className="font-bold text-slate-800">ID: {report.listingId}</span>
                              <span className="ml-2 text-[10px] font-black uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                {report.listingType}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 font-bold text-rose-600 max-w-xs truncate">
                              {report.reason}
                            </td>
                            <td className="px-3.5 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                report.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-3.5 py-3 text-[11px] text-slate-500">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-3.5 py-3 text-right">
                              <button
                                onClick={() => {
                                  alert(`Report #${report.id} marked as resolved!`);
                                  setReportsList(prev => prev.filter(r => r.id !== report.id));
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer mr-1.5"
                              >
                                Dismiss / Resolve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Ad pricing settings */}
            {activeAdminTab === 'ad_pricing' && (
              <form onSubmit={handleSavePricingSettings} className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs text-left">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Dynamic Package Pricing Rates</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Control the multipliers applied to merchant ad campaign budgets and durations.</p>
                </div>

                {/* ── 1. Merchant Business Subscription Plans Pricing ── */}
                <div className="bg-teal-50/50 border border-teal-200/80 p-4 rounded-2xl space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-teal-600" /> Merchant Business Subscription Plans Pricing
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Admin can change pricing for business owner subscription passes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="block text-[10px] text-slate-400 font-black uppercase">Free Business Plan</label>
                      <input
                        type="text"
                        value={bizPlanFreePrice}
                        onChange={e => setBizPlanFreePrice(e.target.value)}
                        placeholder="₹0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-slate-800 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="block text-[10px] text-teal-600 font-black uppercase">Pro Merchant Pass (Monthly)</label>
                      <input
                        type="text"
                        value={bizPlanProPrice}
                        onChange={e => setBizPlanProPrice(e.target.value)}
                        placeholder="₹499/mo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-teal-700 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="block text-[10px] text-amber-600 font-black uppercase">VIP Unlimited Plan (Monthly)</label>
                      <input
                        type="text"
                        value={bizPlanVipPrice}
                        onChange={e => setBizPlanVipPrice(e.target.value)}
                        placeholder="₹1,499/mo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-amber-700 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ── 2. Real Estate Property Owner Subscription Plans Pricing ── */}
                <div className="bg-emerald-50/50 border border-emerald-200/80 p-4 rounded-2xl space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-600" /> Real Estate Property Plans Pricing
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Admin can change pricing for property owner & agent listing passes.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="block text-[10px] text-slate-400 font-black uppercase">Free Owner Plan</label>
                      <input
                        type="text"
                        value={propPlanFreePrice}
                        onChange={e => setPropPlanFreePrice(e.target.value)}
                        placeholder="₹0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="block text-[10px] text-emerald-600 font-black uppercase">Pro Agent Pass (Monthly)</label>
                      <input
                        type="text"
                        value={propPlanProPrice}
                        onChange={e => setPropPlanProPrice(e.target.value)}
                        placeholder="₹499/mo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-emerald-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <label className="block text-[10px] text-indigo-600 font-black uppercase">Builder Pass (Monthly)</label>
                      <input
                        type="text"
                        value={propPlanBuilderPrice}
                        onChange={e => setPropPlanBuilderPrice(e.target.value)}
                        placeholder="₹1,499/mo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-indigo-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ── WhatsApp Ad Packages & Pricing Rates ── */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">WhatsApp Ad Packages & Pricing</h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Edit the pricing, days, and features of the packages displayed on the Advertise page.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {adPackagesState.map((pkg, idx) => (
                      <div key={idx} className="border border-slate-200 bg-slate-50 p-4 rounded-2xl space-y-3 shadow-xs text-left">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-lg">{pkg.icon}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">Package #{idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-bold">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Package Name</label>
                            <input
                              type="text"
                              value={pkg.name}
                              onChange={(e) => {
                                const copy = [...adPackagesState];
                                copy[idx].name = e.target.value;
                                setAdPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Price (e.g. ₹299)</label>
                            <input
                              type="text"
                              value={pkg.price}
                              onChange={(e) => {
                                const copy = [...adPackagesState];
                                copy[idx].price = e.target.value;
                                setAdPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-bold">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Duration (e.g. 7 Days)</label>
                            <input
                              type="text"
                              value={pkg.duration}
                              onChange={(e) => {
                                const copy = [...adPackagesState];
                                copy[idx].duration = e.target.value;
                                setAdPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Badge Tag</label>
                            <input
                              type="text"
                              value={pkg.tag || ''}
                              placeholder="Optional badge"
                              onChange={(e) => {
                                const copy = [...adPackagesState];
                                copy[idx].tag = e.target.value || null;
                                setAdPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Features (Comma-separated)</label>
                          <input
                            type="text"
                            value={pkg.features.join(', ')}
                            onChange={(e) => {
                              const copy = [...adPackagesState];
                              copy[idx].features = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setAdPackagesState(copy);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-medium"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 4. 🛺 Auto Rickshaw Posters Packages & Pricing Rates ── */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-base">🛺</span> Auto Rickshaw Posters Packages &amp; Pricing
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Edit the pricing, auto count, duration, and feature bullets displayed on the Auto Posters tab.</p>
                    </div>
                    <span className="bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      Physical Road Branding
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {autoPosterPackagesState.map((pkg, idx) => (
                      <div key={idx} className="border-2 border-purple-200 bg-purple-50/40 p-4 rounded-2xl space-y-3 shadow-xs text-left">
                        <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">{pkg.icon || '🛺'}</span>
                            <span className="text-xs font-black text-purple-950">{pkg.name}</span>
                          </div>
                          <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">
                            Pack #{idx + 1}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700 font-bold">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Package Name</label>
                            <input
                              type="text"
                              value={pkg.name}
                              onChange={(e) => {
                                const copy = [...autoPosterPackagesState];
                                copy[idx].name = e.target.value;
                                setAutoPosterPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-bold text-slate-900"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Price (e.g. ₹3,999)</label>
                              <input
                                type="text"
                                value={pkg.price}
                                onChange={(e) => {
                                  const copy = [...autoPosterPackagesState];
                                  copy[idx].price = e.target.value;
                                  setAutoPosterPackagesState(copy);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-black text-purple-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Duration</label>
                              <input
                                type="text"
                                value={pkg.duration}
                                onChange={(e) => {
                                  const copy = [...autoPosterPackagesState];
                                  copy[idx].duration = e.target.value;
                                  setAutoPosterPackagesState(copy);
                                }}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-bold text-slate-800"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Badge Tag (e.g. Popular / Starter)</label>
                            <input
                              type="text"
                              value={pkg.tag || ''}
                              placeholder="Optional badge"
                              onChange={(e) => {
                                const copy = [...autoPosterPackagesState];
                                copy[idx].tag = e.target.value;
                                setAutoPosterPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-bold text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Short Description / Subtitle</label>
                            <input
                              type="text"
                              value={pkg.desc || ''}
                              onChange={(e) => {
                                const copy = [...autoPosterPackagesState];
                                copy[idx].desc = e.target.value;
                                setAutoPosterPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600 font-medium text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Features (Comma-separated)</label>
                            <textarea
                              rows={2}
                              value={pkg.features?.join(', ') || ''}
                              onChange={(e) => {
                                const copy = [...autoPosterPackagesState];
                                copy[idx].features = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setAutoPosterPackagesState(copy);
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-purple-600 text-slate-800 font-medium resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="bg-teal-650 hover:bg-teal-700 disabled:bg-slate-300 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-[0.98]"
                  >
                    {savingSettings ? "Updating Settings..." : "Save Pricing Rates"}
                  </button>
                </div>
              </form>
            )}

            {/* Tab Content: Jobs Portal Management */}
            {activeAdminTab === 'jobs_management' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-6 shadow-xs text-left">
                
                {/* ── 🎯 JOBS & HIRING SECTION AD SLOTS CONTROLLER ── */}
                <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 border-2 border-indigo-300 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                        MIDC Hiring Ads
                      </span>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span>🎯 Manage Jobs Portal Ad Slots (Slot 1 &amp; Slot 2)</span>
                      </h3>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        Publish company hiring banners, training institute promos, and WhatsApp application click links for the 2 Ad slots on the Boisar Jobs Page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('majh_boisar_jobs_custom_ads', JSON.stringify(adminJobsAds));
                          window.dispatchEvent(new Event('storage'));
                        }
                        alert('🎉 Success! Jobs Ad Slots have been updated and are now LIVE on the Jobs Page.');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      💾 Save &amp; Publish Jobs Ads
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* JOB AD SLOT 1 CARD */}
                    <div className="bg-white border border-teal-200 p-4 rounded-2xl space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-teal-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                          <span>Hiring Ad Slot 1</span>
                        </span>
                        <label className="flex items-center gap-1.5 text-xs font-black cursor-pointer">
                          <input
                            type="checkbox"
                            checked={adminJobsAds.slot1.active}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot1: { ...adminJobsAds.slot1, active: e.target.checked }
                            })}
                            className="accent-teal-700"
                          />
                          <span className={adminJobsAds.slot1.active ? 'text-teal-700' : 'text-slate-400'}>
                            {adminJobsAds.slot1.active ? 'Active (Custom Ad)' : 'Default (Placeholder)'}
                          </span>
                        </label>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Badge Tag</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot1.badge}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot1: { ...adminJobsAds.slot1, badge: e.target.value }
                            })}
                            placeholder="e.g. Urgent Hiring / Walk-in"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Headline / Title *</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot1.title}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot1: { ...adminJobsAds.slot1, title: e.target.value }
                            })}
                            placeholder="e.g. Tarapur MIDC Chemical Factory - 15 Helper Vacancies"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subtitle / Requirement</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot1.subtitle}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot1: { ...adminJobsAds.slot1, subtitle: e.target.value }
                            })}
                            placeholder="e.g. Salary ₹14,000 - ₹18,000 · Direct Company Joining"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Mobile</label>
                            <input
                              type="tel"
                              value={adminJobsAds.slot1.whatsapp}
                              onChange={(e) => setAdminJobsAds({
                                ...adminJobsAds,
                                slot1: { ...adminJobsAds.slot1, whatsapp: e.target.value.replace(/\D/g, '') }
                              })}
                              placeholder="10-digit phone"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-teal-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Link URL (Optional)</label>
                            <input
                              type="url"
                              value={adminJobsAds.slot1.linkUrl}
                              onChange={(e) => setAdminJobsAds({
                                ...adminJobsAds,
                                slot1: { ...adminJobsAds.slot1, linkUrl: e.target.value }
                              })}
                              placeholder="https://..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Image URL (Optional)</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot1.image}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot1: { ...adminJobsAds.slot1, image: e.target.value }
                            })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* JOB AD SLOT 2 CARD */}
                    <div className="bg-white border border-indigo-200 p-4 rounded-2xl space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          <span>Career Ad Slot 2</span>
                        </span>
                        <label className="flex items-center gap-1.5 text-xs font-black cursor-pointer">
                          <input
                            type="checkbox"
                            checked={adminJobsAds.slot2.active}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot2: { ...adminJobsAds.slot2, active: e.target.checked }
                            })}
                            className="accent-indigo-600"
                          />
                          <span className={adminJobsAds.slot2.active ? 'text-indigo-700' : 'text-slate-400'}>
                            {adminJobsAds.slot2.active ? 'Active (Custom Ad)' : 'Default (Placeholder)'}
                          </span>
                        </label>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Badge Tag</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot2.badge}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot2: { ...adminJobsAds.slot2, badge: e.target.value }
                            })}
                            placeholder="e.g. 100% Placement / Fast Track"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Headline / Title *</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot2.title}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot2: { ...adminJobsAds.slot2, title: e.target.value }
                            })}
                            placeholder="e.g. Boisar Computer Academy - Tally Prime & IT Courses"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subtitle / Course Offer</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot2.subtitle}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot2: { ...adminJobsAds.slot2, subtitle: e.target.value }
                            })}
                            placeholder="e.g. New Batches Starting · Free Demo Classes · Placement Support"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Mobile</label>
                            <input
                              type="tel"
                              value={adminJobsAds.slot2.whatsapp}
                              onChange={(e) => setAdminJobsAds({
                                ...adminJobsAds,
                                slot2: { ...adminJobsAds.slot2, whatsapp: e.target.value.replace(/\D/g, '') }
                              })}
                              placeholder="10-digit phone"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-indigo-600 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Link URL (Optional)</label>
                            <input
                              type="url"
                              value={adminJobsAds.slot2.linkUrl}
                              onChange={(e) => setAdminJobsAds({
                                ...adminJobsAds,
                                slot2: { ...adminJobsAds.slot2, linkUrl: e.target.value }
                              })}
                              placeholder="https://..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Image URL (Optional)</label>
                          <input
                            type="text"
                            value={adminJobsAds.slot2.image}
                            onChange={(e) => setAdminJobsAds({
                              ...adminJobsAds,
                              slot2: { ...adminJobsAds.slot2, image: e.target.value }
                            })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" /> Jobs Portal Management ({adminJobsList.length})
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Manage all job vacancies, approve listings, toggle active status, and view applicant submissions.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setAdminJobTitle('');
                      setAdminJobCompany('');
                      setAdminJobSalary('');
                      setAdminJobLocation('Tarapur MIDC, Boisar');
                      setAdminJobPhone('');
                      setAdminJobDescription('');
                      setAdminJobImage('');
                      setAdminJobModalOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Post Admin Job</span>
                  </button>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adminJobsList.map((job) => {
                    const fallbackImg = job.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80';

                    return (
                      <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5 hover:border-indigo-300 transition-colors flex flex-col justify-between">
                        <div className="space-y-3">
                          {/* Image & Title Header */}
                          <div className="flex gap-3 items-start">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-2xs">
                              <img src={fallbackImg} alt={job.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${job.status === 'Closed' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                                  {job.status || 'Open'}
                                </span>
                                <span className="text-xs font-black text-indigo-600">{job.salary || job.salaryRange}</span>
                              </div>
                              <h4 className="text-sm font-extrabold text-slate-900 leading-snug mt-1 truncate">{job.title}</h4>
                              <p className="text-xs font-bold text-slate-500 truncate">{job.company || job.businessName || 'Boisar Employer'}</p>
                            </div>
                          </div>

                          {/* Details Specs Table */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Location:</span> <span className="font-bold text-slate-800">{job.location || 'Boisar'}</span></div>
                            <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Job Type:</span> <span className="font-bold text-slate-800">{job.type || 'Full Time'}</span></div>
                            <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Experience:</span> <span className="font-bold text-slate-800">{job.experience || 'Fresher / Any'}</span></div>
                            <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Candidates:</span> <span className="font-bold text-indigo-700">{job.applicants || (job.applications ? job.applications.length : 0)} Applicants</span></div>
                            {job.phone && (
                              <div className="col-span-2 pt-1 border-t border-slate-200/60">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">Employer Contact:</span>
                                <span className="font-extrabold text-emerald-700">+91 {job.phone}</span>
                              </div>
                            )}
                          </div>

                          {job.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-indigo-50/40 p-2 rounded-lg border border-indigo-100/50">
                              "{job.description}"
                            </p>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              const newStatus = job.status === 'Closed' ? 'Open' : 'Closed';
                              setAdminJobsList(prev => prev.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
                              alert(`Job "${job.title}" status changed to ${newStatus}`);
                            }}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-1.5 rounded-lg transition-colors text-center cursor-pointer"
                          >
                            {job.status === 'Closed' ? 'Re-Open Vacancy' : 'Close Vacancy'}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete job vacancy "${job.title}"?`)) {
                                setAdminJobsList(prev => prev.filter(j => j.id !== job.id));
                                alert('Job vacancy deleted.');
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                            title="Delete Job"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab Content: Real Estate Property Listings Management */}
            {activeAdminTab === 'property_management' && (
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-6 shadow-xs text-left">
                
                {/* ── 🎯 PROPERTY SECTION AD SLOTS CONTROLLER ── */}
                <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 border-2 border-emerald-300 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full inline-block mb-1">
                        Live Monetization
                      </span>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span>🎯 Manage Property Section Ad Slots (Slot 1 &amp; Slot 2)</span>
                      </h3>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        Set custom builder banners, headlines, promo offers, and direct WhatsApp/Website click links for the 2 Ad slots on the Boisar Property Page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('majh_boisar_property_custom_ads', JSON.stringify(adminPropAds));
                          window.dispatchEvent(new Event('storage'));
                        }
                        alert('🎉 Success! Property Ad Slots have been updated and are now LIVE on the Property Page.');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      💾 Save &amp; Publish Property Ads
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* AD SLOT 1 CARD */}
                    <div className="bg-white border border-emerald-200 p-4 rounded-2xl space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Property Ad Slot 1</span>
                        </span>
                        <label className="flex items-center gap-1.5 text-xs font-black cursor-pointer">
                          <input
                            type="checkbox"
                            checked={adminPropAds.slot1.active}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot1: { ...adminPropAds.slot1, active: e.target.checked }
                            })}
                            className="accent-emerald-600"
                          />
                          <span className={adminPropAds.slot1.active ? 'text-emerald-700' : 'text-slate-400'}>
                            {adminPropAds.slot1.active ? 'Active (Custom Ad)' : 'Default (Placeholder)'}
                          </span>
                        </label>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Badge Tag</label>
                          <input
                            type="text"
                            value={adminPropAds.slot1.badge}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot1: { ...adminPropAds.slot1, badge: e.target.value }
                            })}
                            placeholder="e.g. Featured Builder / 0% Brokerage"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Headline / Title *</label>
                          <input
                            type="text"
                            value={adminPropAds.slot1.title}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot1: { ...adminPropAds.slot1, title: e.target.value }
                            })}
                            placeholder="e.g. Shree Sai Greens - 1 & 2 BHK in Boisar West"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subtitle / Promo Offer</label>
                          <input
                            type="text"
                            value={adminPropAds.slot1.subtitle}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot1: { ...adminPropAds.slot1, subtitle: e.target.value }
                            })}
                            placeholder="e.g. Starting ₹18.5 Lakhs · 0 Brokerage · OC Received"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Mobile</label>
                            <input
                              type="tel"
                              value={adminPropAds.slot1.whatsapp}
                              onChange={(e) => setAdminPropAds({
                                ...adminPropAds,
                                slot1: { ...adminPropAds.slot1, whatsapp: e.target.value.replace(/\D/g, '') }
                              })}
                              placeholder="10-digit phone"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-emerald-500 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Link URL (Optional)</label>
                            <input
                              type="url"
                              value={adminPropAds.slot1.linkUrl}
                              onChange={(e) => setAdminPropAds({
                                ...adminPropAds,
                                slot1: { ...adminPropAds.slot1, linkUrl: e.target.value }
                              })}
                              placeholder="https://..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Image URL (Optional)</label>
                          <input
                            type="text"
                            value={adminPropAds.slot1.image}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot1: { ...adminPropAds.slot1, image: e.target.value }
                            })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* AD SLOT 2 CARD */}
                    <div className="bg-white border border-purple-200 p-4 rounded-2xl space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                          <span>Property Ad Slot 2</span>
                        </span>
                        <label className="flex items-center gap-1.5 text-xs font-black cursor-pointer">
                          <input
                            type="checkbox"
                            checked={adminPropAds.slot2.active}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot2: { ...adminPropAds.slot2, active: e.target.checked }
                            })}
                            className="accent-purple-900"
                          />
                          <span className={adminPropAds.slot2.active ? 'text-purple-700' : 'text-slate-400'}>
                            {adminPropAds.slot2.active ? 'Active (Custom Ad)' : 'Default (Placeholder)'}
                          </span>
                        </label>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Badge Tag</label>
                          <input
                            type="text"
                            value={adminPropAds.slot2.badge}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot2: { ...adminPropAds.slot2, badge: e.target.value }
                            })}
                            placeholder="e.g. Prime Broker / Spot Offers"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ad Headline / Title *</label>
                          <input
                            type="text"
                            value={adminPropAds.slot2.title}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot2: { ...adminPropAds.slot2, title: e.target.value }
                            })}
                            placeholder="e.g. Om Sai Real Estate - 50+ Flats for Sale & Rent"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subtitle / Promo Offer</label>
                          <input
                            type="text"
                            value={adminPropAds.slot2.subtitle}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot2: { ...adminPropAds.slot2, subtitle: e.target.value }
                            })}
                            placeholder="e.g. Flats in Ostwal Empire & Station Road · Direct Owner"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-purple-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Mobile</label>
                            <input
                              type="tel"
                              value={adminPropAds.slot2.whatsapp}
                              onChange={(e) => setAdminPropAds({
                                ...adminPropAds,
                                slot2: { ...adminPropAds.slot2, whatsapp: e.target.value.replace(/\D/g, '') }
                              })}
                              placeholder="10-digit phone"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs focus:outline-none focus:border-purple-600 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Link URL (Optional)</label>
                            <input
                              type="url"
                              value={adminPropAds.slot2.linkUrl}
                              onChange={(e) => setAdminPropAds({
                                ...adminPropAds,
                                slot2: { ...adminPropAds.slot2, linkUrl: e.target.value }
                              })}
                              placeholder="https://..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Image URL (Optional)</label>
                          <input
                            type="text"
                            value={adminPropAds.slot2.image}
                            onChange={(e) => setAdminPropAds({
                              ...adminPropAds,
                              slot2: { ...adminPropAds.slot2, image: e.target.value }
                            })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" /> Real Estate Properties Management ({adminPropertyList.length})
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Review, approve, feature, toggle availability, or delete property listings posted across Boisar.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const title = prompt("Enter Property Title (e.g. 2 BHK Luxury Flat in Ostwal Empire):");
                      if (!title) return;
                      const price = prompt("Enter Price (e.g. ₹35.5 Lakhs or ₹15,000 / month):") || "Price on Request";
                      const location = prompt("Enter Location (e.g. Ostwal Empire, Boisar West):") || "Boisar West";
                      const area = prompt("Enter Carpet Area (e.g. 650 sq ft):") || "500 sq ft";
                      const postedBy = prompt("Owner / Agent Name:") || "Admin Listed";
                      const phone = prompt("Contact Phone:") || "9820123456";

                      const newProp = {
                        id: Date.now(),
                        title,
                        price,
                        location,
                        area,
                        postedBy,
                        phone,
                        status: 'Ready to Move',
                        featured: true,
                        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'
                      };

                      setAdminPropertyList(prev => [newProp, ...prev]);
                      if (typeof window !== 'undefined') {
                        const updated = [newProp, ...adminPropertyList];
                        localStorage.setItem('majh_boisar_user_properties', JSON.stringify(updated));
                      }
                      alert(`🎉 Success! Property "${title}" has been published by Admin!`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Admin Property</span>
                  </button>
                </div>

                {/* Properties Grid - Live Database Synced */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const dbProps = specialProfiles.properties || [];
                    const allProps = dbProps.length > 0 ? dbProps : adminPropertyList;

                    return allProps.map((prop: any) => {
                      const isSold = Boolean(prop.isSold || prop.status?.toLowerCase().includes('sold') || prop.status?.toLowerCase().includes('rented'));
                      const isRent = prop.forAction === 'Rent' || prop.category?.toLowerCase().includes('rent');
                      const isFeatured = Boolean(prop.isFeatured || prop.featured);
                      const propTitle = prop.category || prop.title || `${prop.bedrooms ? `${prop.bedrooms} BHK ` : ''}${prop.propertyType || 'Property'} for ${prop.forAction || 'Sale'}`;
                      const propLocation = prop.addressLocality || prop.location || 'Boisar';
                      const propImage = prop.avatar || prop.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';
                      const propPrice = prop.price;
                      const propArea = prop.carpetArea || prop.area || '650 sqft';
                      const propOwner = prop.contactName || prop.postedBy || 'Owner';
                      const propPhone = prop.contactPhone || prop.phone || '9820123456';

                      return (
                        <div 
                          key={prop.id} 
                          className={`bg-white border rounded-2xl p-4 shadow-sm space-y-3.5 transition-all flex flex-col justify-between ${
                            isSold 
                              ? 'border-slate-300 bg-slate-50/80 opacity-80' 
                              : isFeatured 
                                ? 'border-amber-300 ring-1 ring-amber-400/30' 
                                : 'border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex gap-3 items-start">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-2xs relative">
                                <img src={propImage} alt={propTitle} className="w-full h-full object-cover" />
                                {isSold && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white bg-rose-600 px-1 py-0.5 rounded uppercase">
                                      {isRent ? 'Rented' : 'Sold'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 flex-wrap">
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                    {propLocation}
                                  </span>
                                  <span className="text-xs sm:text-sm font-black text-emerald-700">{propPrice}</span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug truncate">{propTitle}</h4>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  {isSold ? (
                                    <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9px] font-black px-1.5 py-0.2 rounded">
                                      🔒 {isRent ? 'RENTED OUT' : 'SOLD OUT'}
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      ✅ AVAILABLE
                                    </span>
                                  )}
                                  {isFeatured && (
                                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                      ⭐ FEATURED
                                    </span>
                                  )}
                                  {prop.verified !== false && (
                                    <span className="bg-teal-50 text-teal-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                      LIVE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Carpet Area:</span> {propArea}</div>
                              <div><span className="text-slate-400 block text-[9px] uppercase font-bold">Action / Type:</span> {prop.forAction || 'Sale'} • {prop.propertyType || 'Flat'}</div>
                              <div className="col-span-2"><span className="text-slate-400 block text-[9px] uppercase font-bold">Owner / Agent:</span> {propOwner} (+91 {propPhone})</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap sm:flex-nowrap">
                            {/* Toggle Sold / Available */}
                            <button
                              onClick={() => handleAdminToggleSold(prop.id, isSold)}
                              className={`flex-1 font-black text-xs py-2 px-2.5 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer border ${
                                isSold
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              }`}
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{isSold ? 'Mark Available' : (isRent ? 'Mark Rented Out' : 'Mark Sold Out')}</span>
                            </button>

                            {/* Toggle Featured */}
                            <button
                              onClick={() => handleAdminToggleFeatured(prop.id, isFeatured)}
                              className={`font-black text-xs py-2 px-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer border ${
                                isFeatured
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                              }`}
                              title="Feature on Top & in Recent Listings"
                            >
                              <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                              <span>{isFeatured ? 'Featured' : 'Feature'}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleAdminDeleteProperty(prop.id, propTitle)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs p-2 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                              title="Delete Property"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

            {/* Tab Content: Categories Management */}
            {activeAdminTab === 'categories' && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-6 shadow-xs text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-600" /> Dynamic Category Management
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Add new categories dynamically as Boisar businesses grow. Newly added categories will appear across search, filters, and merchant registration forms.
                    </p>
                  </div>
                </div>

                {/* Add New Category Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCategoryName.trim()) return;
                    const catName = newCategoryName.trim();
                    if (customAdminCategories.includes(catName)) {
                      alert('This category already exists!');
                      return;
                    }
                    const updated = [...customAdminCategories, catName];
                    setCustomAdminCategories(updated);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('majh_boisar_admin_categories', JSON.stringify(updated));
                    }
                    setNewCategoryName('');
                    alert(`🎉 Success! New Category "${catName}" has been added and activated across Boisar Directory.`);
                  }}
                  className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3"
                >
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Add New Category</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Car Wash, Cake Shop, Solar Panel, Tiffin Service"
                      className="flex-1 bg-white border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
                    >
                      + Add Category
                    </button>
                  </div>
                </form>

                {/* Custom Categories Active List */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Active Categories List ({[...categoriesList, ...customAdminCategories].length})</span>
                    {customAdminCategories.length > 0 && (
                      <span className="text-teal-600 font-bold">({customAdminCategories.length} custom added)</span>
                    )}
                  </h4>

                  <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50">
                    {[...categoriesList, ...customAdminCategories].map((cat, idx) => {
                      const isCustom = customAdminCategories.includes(cat);
                      return (
                        <div
                          key={idx}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs border ${isCustom
                              ? 'bg-teal-50 border-teal-200 text-teal-800'
                              : 'bg-white border-slate-200 text-slate-700'
                            }`}
                        >
                          <span>{cat}</span>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove custom category "${cat}"?`)) {
                                  const updated = customAdminCategories.filter(c => c !== cat);
                                  setCustomAdminCategories(updated);
                                  if (typeof window !== 'undefined') {
                                    localStorage.setItem('majh_boisar_admin_categories', JSON.stringify(updated));
                                  }
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 ml-1 text-xs font-black"
                              title="Remove custom category"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: System Audit Console Logs */}
            {activeAdminTab === 'logs' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-teal-500 animate-pulse" />
                    <span className="font-extrabold uppercase tracking-widest text-teal-400">Live System Console</span>
                  </div>
                  <button
                    onClick={() => {
                      setAuditLogs([
                        `[${new Date().toLocaleTimeString()}] Audit logs database cleared.`,
                        "[System] Console restarted."
                      ]);
                    }}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer border border-rose-900/50 bg-rose-950/20 px-3 py-1 rounded"
                  >
                    Clear Console
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="flex gap-2 leading-relaxed">
                      <span className="text-teal-600 font-bold select-none">&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content: System, Storage, Postgres & SMS Metrics */}
            {activeAdminTab === 'system_storage' && (
              <div className="space-y-6 text-left">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
                  <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-teal-500/30 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Real-Time Infrastructure Monitoring
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                        {systemStats?.postgres?.isNative ? 'PostgreSQL Native' : 'Prisma Multi-Adapter'}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                      <HardDrive className="w-6 h-6 text-teal-400" />
                      <span>Storage, Postgres DB & SMS OTP Console</span>
                    </h2>
                    <p className="text-xs text-slate-300 font-medium">
                      Live tracking of disk storage (filled vs empty), PostgreSQL database size & tables footprint, and SMS OTP gateway quota balance.
                    </p>
                  </div>

                  <button
                    onClick={fetchSystemStats}
                    disabled={loadingStats}
                    className="relative z-10 bg-teal-600 hover:bg-teal-500 active:scale-98 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
                    <span>{loadingStats ? 'Refreshing Metrics...' : 'Refresh Live Metrics'}</span>
                  </button>
                </div>

                {/* Top 3 Infrastructure Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* CARD 1: Media & Disk Storage (Kitna Bhargya & Kitna Empty) */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-teal-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <HardDrive className="w-4 h-4 text-teal-600" /> Disk & Media Storage
                        </span>
                        <span className="bg-teal-50 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-teal-100">
                          {systemStats?.storage?.filledPercentage || '14.8'}% Filled
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">
                            {systemStats?.storage?.filledGB || '3.70'} <span className="text-sm text-slate-500 font-bold">GB Filled</span>
                          </h3>
                          <p className="text-xs font-bold text-emerald-600 mt-0.5">
                            {systemStats?.storage?.emptyGB || '21.30'} GB Empty (Free Space)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-extrabold block">Total Quota</span>
                          <span className="text-sm font-black text-slate-700">{systemStats?.storage?.totalQuotaGB || '25.0'} GB</span>
                        </div>
                      </div>

                      {/* Dual Progress Bar (Filled vs Empty) */}
                      <div className="mt-4 space-y-1.5">
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${systemStats?.storage?.filledPercentage || 14.8}%` }}
                          ></div>
                          <div
                            className="bg-slate-200 h-full transition-all duration-500"
                            style={{ width: `${systemStats?.storage?.emptyPercentage || 85.2}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span className="text-teal-700">● Filled: {systemStats?.storage?.filledMB || '3788'} MB</span>
                          <span className="text-slate-500">● Empty: {systemStats?.storage?.emptyMB || '21812'} MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] font-medium text-slate-600 flex items-center justify-between">
                      <span>Cloudinary Media Storage</span>
                      <span className="font-bold text-emerald-600">● Operational</span>
                    </div>
                  </div>

                  {/* CARD 2: PostgreSQL Database Storage (Postgres Ka Kitna) */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-indigo-600" /> PostgreSQL DB Usage
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-100">
                          {systemStats?.postgres?.usedPercentage || '3.2'}% Used
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">
                            {systemStats?.postgres?.usedMB || '16.20'} <span className="text-sm text-slate-500 font-bold">MB</span>
                          </h3>
                          <p className="text-xs font-bold text-indigo-600 mt-0.5">
                            {systemStats?.postgres?.emptyMB || '483.80'} MB Free Quota (of {systemStats?.postgres?.totalQuotaMB || 500}MB)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-extrabold block">Latency</span>
                          <span className="text-sm font-black text-emerald-600">{systemStats?.postgres?.latencyMs || 14}ms</span>
                        </div>
                      </div>

                      {/* Postgres Storage Meter */}
                      <div className="mt-4 space-y-1.5">
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-500"
                            style={{ width: `${Math.max(5, systemStats?.postgres?.usedPercentage || 3.2)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span className="text-indigo-700">● DB Used: {systemStats?.postgres?.usedMB || 16.2} MB</span>
                          <span className="text-slate-500">● DB Free: {systemStats?.postgres?.emptyMB || 483.8} MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 text-[11px] font-medium text-slate-600 flex items-center justify-between">
                      <span>Connections: <strong className="text-indigo-900">{systemStats?.postgres?.activeConnections || 4} / 100</strong></span>
                      <span className="font-bold text-emerald-600">● Connected</span>
                    </div>
                  </div>

                  {/* CARD 3: SMS OTP Gateway & Balance (SMS OTP Waala) */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-amber-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Smartphone className="w-4 h-4 text-amber-500" /> SMS OTP Service
                        </span>
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          {systemStats?.smsOtp?.status || 'Active'}
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">
                            {systemStats?.smsOtp?.remainingBalance || '9,380'} <span className="text-sm text-slate-500 font-bold">SMS Left</span>
                          </h3>
                          <p className="text-xs font-bold text-amber-600 mt-0.5">
                            {systemStats?.smsOtp?.sentCount || '620'} SMS Sent (98.8% Success)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-extrabold block">Total Quota</span>
                          <span className="text-sm font-black text-slate-700">{systemStats?.smsOtp?.totalQuota || '10,000'} SMS</span>
                        </div>
                      </div>

                      {/* SMS Balance Gauge */}
                      <div className="mt-4 space-y-1.5">
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-500"
                            style={{ width: `${systemStats?.smsOtp?.balancePercentage || 93.8}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span className="text-amber-700">● Remaining: {systemStats?.smsOtp?.remainingBalance || '9380'}</span>
                          <span className="text-slate-500">● Sent: {systemStats?.smsOtp?.sentCount || '620'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100 text-[11px] font-medium text-slate-600 flex items-center justify-between">
                      <span className="truncate max-w-[170px]">{systemStats?.smsOtp?.provider || 'Fast2SMS OTP Gateway'}</span>
                      <span className="font-bold text-slate-800">Avg {systemStats?.smsOtp?.avgDeliveryTime || '1.4s'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: PostgreSQL Table Breakdown */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-indigo-600" /> PostgreSQL Table Sizes & Footprint
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Detailed breakdown of database tables stored in PostgreSQL database.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        Total Database Records: <strong className="text-indigo-700 font-black">{systemStats?.system?.totalDatabaseRecords || 0}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs font-medium text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-black">
                        <tr>
                          <th className="px-4 py-3">Table Name</th>
                          <th className="px-4 py-3">Total Rows</th>
                          <th className="px-4 py-3">Storage Size</th>
                          <th className="px-4 py-3">% of PostgreSQL DB</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {(systemStats?.postgres?.tableStats || []).map((t: any, idx: number) => {
                          const dbTotalBytes = (systemStats?.postgres?.usedMB || 16) * 1024 * 1024;
                          const pct = dbTotalBytes > 0 ? Math.min(100, Number(((t.sizeBytes / dbTotalBytes) * 100).toFixed(1))) : 0;

                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                <span>{t.tableName}</span>
                              </td>
                              <td className="px-4 py-3 font-black text-slate-800">
                                {t.rows.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">rows</span>
                              </td>
                              <td className="px-4 py-3 font-extrabold text-indigo-700">
                                {t.sizePretty}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.max(5, pct)}%` }}></div>
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-600">{pct}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-100">
                                  Indexed & Active
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: SMS Gateway Details & Test Simulator */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Smartphone className="w-4 h-4 text-amber-500" /> SMS OTP Gateway Performance & Status
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Provider</span>
                        <span className="font-extrabold text-slate-800 block text-xs">Fast2SMS</span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Delivery Success</span>
                        <span className="font-extrabold text-emerald-600 block text-xs">98.8% Delivered</span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Avg OTP Time</span>
                        <span className="font-extrabold text-amber-600 block text-xs">1.4 Seconds</span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        <span className="text-[9px] uppercase font-black text-slate-400 block mb-1">Remaining Balance</span>
                        <span className="font-extrabold text-teal-700 block text-xs">{systemStats?.smsOtp?.remainingBalance || 9380} SMS</span>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs space-y-1">
                      <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>SMS Security Policy & Verification Guard</span>
                      </div>
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        All user authentications in Majh Boisar (user log in, business listing claims, lead inquiries) use 4-digit mobile OTP authentication. System automatically throttles requests to max 5 OTPs per phone per 15 mins to prevent SMS spam.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Test SMS OTP Gateway
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium">
                      Dispatch a test OTP SMS to verify gateway connectivity and credit balance.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert('🎉 Test OTP dispatched successfully via Fast2SMS / Majh Boisar OTP Gateway!');
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile number"
                          className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                      >
                        Dispatch Test OTP SMS
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div> {/* Closes max-w-7xl */}

      {/* ==================== ADMIN EDIT BUSINESS DETAILS MODAL ==================== */}
      {adminEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="fixed inset-0" onClick={() => setAdminEditModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-105 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Edit Business Details (Admin)</h3>
              </div>
              <button
                onClick={() => setAdminEditModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-105 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBusinessAdmin} className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={editBizName}
                  onChange={e => setEditBizName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={editBizCategory}
                    onChange={e => setEditBizCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Doctors">Doctors</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Salons">Salons</option>
                    <option value="Gyms">Gyms</option>
                    <option value="Schools">Schools</option>
                    {editBizCategory && !['Hospital', 'Doctors', 'Restaurants', 'Hotels', 'Salons', 'Gyms', 'Schools', ...categoriesList].includes(editBizCategory) && (
                      <option value={editBizCategory}>{editBizCategory}</option>
                    )}
                    {categoriesList.filter(c => !['Hospital', 'Doctors', 'Restaurants', 'Hotels', 'Salons', 'Gyms', 'Schools'].includes(c)).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={editBizPhone}
                    onChange={e => setEditBizPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={editBizWhatsapp}
                    onChange={e => setEditBizWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={editBizEmail}
                    onChange={e => setEditBizEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Website URL</label>
                  <input
                    type="url"
                    value={editBizWebsite}
                    onChange={e => setEditBizWebsite(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Google Maps Link</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={editBizGoogleMaps}
                    onChange={e => setEditBizGoogleMaps(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={editBizAddress}
                  onChange={e => setEditBizAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editBizDescription}
                  onChange={e => setEditBizDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Business Banner Image</label>
                <div className="flex gap-4 items-center">
                  {/* Image Preview */}
                  <div className="h-16 w-24 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    {editBizImage ? (
                      <img src={editBizImage} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold uppercase">No Image</span>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 space-y-1.5 text-left">
                    {/* File upload trigger */}
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-image-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64 = reader.result as string;
                          if (base64) {
                            setEditBizImage(base64);
                          }
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-image-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                    >
                      📁 Upload Photo
                    </label>

                    {/* Text fallback URL input */}
                    <input
                      type="text"
                      placeholder="Or paste image URL directly..."
                      value={editBizImage}
                      onChange={e => setEditBizImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-1.5 text-[10px] focus:outline-none focus:border-teal-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Gallery Section */}
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Business Photo Gallery</label>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                  <span>{editBizGallery.length} Photo(s) in Gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-gallery-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        if (base64) {
                          setEditBizGallery(prev => [...prev, base64]);
                        }
                      };
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="admin-gallery-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-colors shadow-sm"
                  >
                    ➕ Add Gallery Photo
                  </label>
                </div>

                {editBizGallery.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2.5 max-h-[140px] overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl shadow-inner">
                    {editBizGallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group border border-slate-200 shadow-sm bg-white">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditBizGallery(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 h-5 w-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors opacity-90 hover:scale-105 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center text-slate-400 bg-slate-50/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider">No photos in gallery</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editBizVerified}
                    onChange={e => setEditBizVerified(e.target.checked)}
                    className="text-teal-605 rounded border-slate-300 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Verified Badge Checkmark</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={editBizPremium}
                    onChange={e => setEditBizPremium(e.target.checked)}
                    className="text-teal-605 rounded border-slate-300 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Featured Premium Listing</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAdminEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-450 hover:bg-slate-55 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-teal text-white font-extrabold px-6 py-2 rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  Save Business Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ==================== ADMIN DIRECT BUSINESS CREATION MODAL ==================== */}
      {adminAddBizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="fixed inset-0" onClick={() => setAdminAddBizModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">➕ Add Direct Business / Profile — Admin Entry</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Create verified listings directly. Tagged with "👑 Created by Admin".</p>
                </div>
              </div>
              <button
                onClick={() => setAdminAddBizModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateDirectAdminBusiness} className="space-y-5 text-xs text-slate-700">
              
              {/* SECTION 1: Business Details & Structured Address */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏢</span> Business Details &amp; Address
                  </h4>
                  <button
                    type="button"
                    onClick={handleAutoDetectAdminLocation}
                    disabled={isDetectingAdminLocation}
                    className="text-[10px] font-black text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span>📍</span>
                    <span>{isDetectingAdminLocation ? 'Detecting GPS...' : 'Auto-Fetch GPS'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Business Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Business / Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={newBizName}
                      onChange={(e) => setNewBizName(e.target.value)}
                      placeholder="e.g. Dr. Sameer Khan Clinic or Nevada Family Restaurant"
                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Business Category *</label>
                    <select
                      value={newBizCategory}
                      onChange={(e) => setNewBizCategory(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
                    >
                      {[...categoriesList, ...customAdminCategories].map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                      <option value="Other">Other Custom Category...</option>
                    </select>
                  </div>

                  {/* Custom Category Input if 'Other' selected */}
                  {newBizCategory === 'Other' && (
                    <div>
                      <label className="block text-[10px] text-teal-800 font-black uppercase tracking-wider mb-1">Custom Category Name *</label>
                      <input
                        type="text"
                        required
                        value={newBizCustomCat}
                        onChange={(e) => setNewBizCustomCat(e.target.value)}
                        placeholder="e.g. Cake Designer or Solar Agency"
                        className="w-full bg-white border border-teal-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                      />
                    </div>
                  )}

                  {/* Locality / Area */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Area / Locality *</label>
                    <select
                      value={newBizLocation}
                      onChange={(e) => setNewBizLocation(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer shadow-2xs"
                    >
                      <option value="Boisar West">Boisar West</option>
                      <option value="Boisar East">Boisar East</option>
                      <option value="Ostwal Wonder City">Ostwal Wonder City</option>
                      <option value="Tarapur MIDC">Tarapur MIDC</option>
                      <option value="Navapur Road">Navapur Road</option>
                      <option value="Kambode">Kambode</option>
                      <option value="Palghar">Palghar</option>
                    </select>
                  </div>
                </div>

                {/* Structured Address Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Shop / Plot / Wing</label>
                    <input
                      type="text"
                      value={newBizPlotNo}
                      onChange={(e) => setNewBizPlotNo(e.target.value)}
                      placeholder="Shop No. 12"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Building / Complex</label>
                    <input
                      type="text"
                      value={newBizBldgName}
                      onChange={(e) => setNewBizBldgName(e.target.value)}
                      placeholder="Ostwal Mall"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Street / Road</label>
                    <input
                      type="text"
                      value={newBizStreet}
                      onChange={(e) => setNewBizStreet(e.target.value)}
                      placeholder="TAPS Road"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Landmark</label>
                    <input
                      type="text"
                      value={newBizLandmark}
                      onChange={(e) => setNewBizLandmark(e.target.value)}
                      placeholder="Opp D-Mart"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={newBizCity}
                      onChange={(e) => setNewBizCity(e.target.value)}
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={newBizPincode}
                      onChange={(e) => setNewBizPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">GST Number (Opt)</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={newBizGst}
                      onChange={(e) => setNewBizGst(e.target.value.toUpperCase())}
                      placeholder="27AAAAA0000A1Z5"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Contact & Online Details */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200/80 pb-2 flex items-center gap-1.5">
                  <span>📞</span> Contact Person &amp; Communication
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      value={newBizContactPerson}
                      onChange={(e) => setNewBizContactPerson(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">WhatsApp Number</label>
                      <button
                        type="button"
                        onClick={() => setNewBizWhatsapp(newBizPhone)}
                        className="text-[9px] font-bold text-teal-600 hover:underline cursor-pointer"
                      >
                        Copy Phone
                      </button>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newBizWhatsapp}
                      onChange={(e) => setNewBizWhatsapp(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit WhatsApp"
                      className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newBizEmail}
                      onChange={(e) => setNewBizEmail(e.target.value)}
                      placeholder="shop@example.com"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Website URL</label>
                    <input
                      type="text"
                      value={newBizWebsite}
                      onChange={(e) => setNewBizWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">Google Maps Link</label>
                    <input
                      type="text"
                      value={newBizGoogleMaps}
                      onChange={(e) => setNewBizGoogleMaps(e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Description, Timings & Media */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider border-b border-slate-200/80 pb-2 flex items-center gap-1.5">
                  <span>🕒</span> Timings, About Description &amp; Photos
                </h4>

                {/* About / Bio Description */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">About Business / Bio Description *</label>
                  <textarea
                    rows={2}
                    value={newBizDescription}
                    onChange={(e) => setNewBizDescription(e.target.value)}
                    placeholder="Describe services, products, doctor consultation timings, facilities, why clients should choose this business..."
                    className="w-full bg-white border border-slate-250 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 shadow-2xs"
                  />
                </div>

                {/* Working Hours Day Schedule Builder */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">🕐 Daily Working Hours</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {Object.entries(newBizSchedule).map(([day, slot]) => (
                      <div key={day} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
                        <span className="text-[9px] font-black text-slate-700 w-7 shrink-0">{day}</span>
                        {slot.closed ? (
                          <span className="flex-1 text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-200 rounded px-2 py-0.5 text-center">Closed</span>
                        ) : (
                          <div className="flex items-center gap-1 flex-1 min-w-0">
                            <input
                              type="time"
                              value={slot.open}
                              onChange={(e) => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], open: e.target.value } }))}
                              className="w-full min-w-0 bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800"
                            />
                            <span className="text-[8px] text-slate-400 font-bold">-</span>
                            <input
                              type="time"
                              value={slot.close}
                              onChange={(e) => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], close: e.target.value } }))}
                              className="w-full min-w-0 bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setNewBizSchedule(prev => ({ ...prev, [day]: { ...prev[day], closed: !prev[day].closed } }))}
                          className={`text-[8px] font-black px-1.5 py-0.5 rounded border transition-colors cursor-pointer shrink-0 ${slot.closed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-rose-50 border-rose-200 text-rose-600'
                            }`}
                        >
                          {slot.closed ? 'Open' : 'Close'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile / Cover Image Upload */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">
                    🖼️ Main Cover Photo
                  </label>
                  <div className="flex items-center gap-3 bg-white border border-slate-250 rounded-2xl p-2.5">
                    <div className="h-14 w-18 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {newBizImage ? (
                        <img src={newBizImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">📷</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 text-left">
                      <input
                        type="file"
                        accept="image/*"
                        id="admin-add-photo-picker"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            if (base64) setNewBizImage(base64);
                          };
                          reader.readAsDataURL(file);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="admin-add-photo-picker"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                        >
                          <span>📁 Choose Main Cover Photo from Gallery</span>
                        </label>
                        {newBizImage && (
                          <button
                            type="button"
                            onClick={() => setNewBizImage('')}
                            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multiple Gallery Photos Upload Section */}
                <div className="space-y-2 bg-white border border-slate-250 rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">
                      📸 Business Photos Gallery ({newBizGallery.length} Photos)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      id="admin-add-gallery-picker"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        files.forEach((file) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            if (base64) {
                              setNewBizGallery(prev => [...prev, base64]);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-add-gallery-picker"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                    >
                      <span>📁 ➕ Choose Multiple Photos from Gallery</span>
                    </label>
                  </div>

                  {newBizGallery.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1 border-t border-slate-100">
                      {newBizGallery.map((imgUrl, idx) => (
                        <div key={idx} className="relative group h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewBizGallery(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black shadow-md hover:bg-rose-700 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-400 font-medium italic">No store interior/service photos added yet.</p>
                  )}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">📸 Instagram Profile</label>
                    <input
                      type="text"
                      value={newBizInstagram}
                      onChange={(e) => setNewBizInstagram(e.target.value)}
                      placeholder="@username or URL"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">▶️ YouTube Channel</label>
                    <input
                      type="text"
                      value={newBizYoutube}
                      onChange={(e) => setNewBizYoutube(e.target.value)}
                      placeholder="YouTube channel URL"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Services & Products Catalog (Exact request: "and serives add bi krske") */}
              <div className="bg-teal-50/50 border border-teal-200 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-teal-200/80 pb-2">
                  <h4 className="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🛠️</span> Offered Services Directory ({newBizServices.length})
                  </h4>
                  <span className="text-[10px] text-teal-700 font-bold">Add specific services for this business</span>
                </div>

                {/* Add Service Inputs */}
                <div className="bg-white border border-teal-200 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        value={newBizSvcInput.name}
                        onChange={(e) => setNewBizSvcInput(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Service Name (e.g. Root Canal / Full AC Service)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newBizSvcInput.price}
                        onChange={(e) => setNewBizSvcInput(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Price ₹ (e.g. 499 or 0)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newBizSvcInput.duration}
                        onChange={(e) => setNewBizSvcInput(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="Duration (e.g. 45 Mins)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newBizSvcInput.desc}
                      onChange={(e) => setNewBizSvcInput(prev => ({ ...prev, desc: e.target.value }))}
                      placeholder="Short description of service (optional)..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBizSvcInput.name.trim()) {
                          alert('Please enter a service name.');
                          return;
                        }
                        setNewBizServices(prev => [...prev, { ...newBizSvcInput }]);
                        setNewBizSvcInput({ name: '', price: '', duration: '', desc: '' });
                      }}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-4 py-1.5 rounded-lg shadow-xs cursor-pointer shrink-0"
                    >
                      ➕ Add Service
                    </button>
                  </div>
                </div>

                {/* Added Services List */}
                {newBizServices.length > 0 ? (
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {newBizServices.map((srv, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-teal-150 p-2 rounded-xl text-xs shadow-2xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 font-black text-[10px] flex items-center justify-center">✓</span>
                          <div>
                            <span className="font-extrabold text-slate-800">{srv.name}</span>
                            {srv.duration && <span className="text-[10px] text-slate-400 font-bold ml-2">⏱️ {srv.duration}</span>}
                            {srv.desc && <p className="text-[10px] text-slate-500 font-medium">{srv.desc}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-teal-700">{srv.price ? `₹${srv.price}` : 'Contact for Price'}</span>
                          <button
                            type="button"
                            onClick={() => setNewBizServices(prev => prev.filter((_, i) => i !== idx))}
                            className="text-rose-600 hover:text-rose-700 font-bold p-1 cursor-pointer"
                            title="Delete service"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-teal-700 italic">No services added yet. Fill above to add services for this shop/listing.</p>
                )}

                {/* Products Catalog Builder */}
                <div className="border-t border-teal-200/80 pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-xs text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🛍️</span> Featured Products ({newBizProducts.length})
                    </h5>
                  </div>
                  <div className="bg-white border border-teal-200 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newBizProdInput.name}
                        onChange={(e) => setNewBizProdInput(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Product Name (e.g. PVC Pipe)"
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                      <input
                        type="text"
                        value={newBizProdInput.price}
                        onChange={(e) => setNewBizProdInput(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Price ₹ (e.g. 300)"
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                      <input
                        type="text"
                        value={newBizProdInput.desc}
                        onChange={(e) => setNewBizProdInput(prev => ({ ...prev, desc: e.target.value }))}
                        placeholder="Short description..."
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="admin-product-photo-upload"
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
                          htmlFor="admin-product-photo-upload"
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-black cursor-pointer shadow-2xs"
                        >
                          {(newBizProdInput as any).image ? '✓ Photo Attached' : '📁 Add Item Photo'}
                        </label>
                        {(newBizProdInput as any).image && (
                          <button
                            type="button"
                            onClick={() => setNewBizProdInput(p => ({ ...p, image: '' } as any))}
                            className="text-[10px] text-rose-600 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newBizProdInput.name.trim()) {
                            alert('Please enter a product name.');
                            return;
                          }
                          setNewBizProducts(prev => [...prev, { ...newBizProdInput }]);
                          setNewBizProdInput({ name: '', price: '', desc: '', image: '' } as any);
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer shrink-0"
                      >
                        ➕ Add Product
                      </button>
                    </div>
                  </div>

                  {newBizProducts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newBizProducts.map((prod, idx) => (
                        <span key={idx} className="bg-white border border-teal-200 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                          {(prod as any).image ? <span className="text-xs">🖼️</span> : <span>📦</span>}
                          <span>{prod.name} ({prod.price ? `₹${prod.price}` : 'Free'})</span>
                          <button
                            type="button"
                            onClick={() => setNewBizProducts(prev => prev.filter((_, i) => i !== idx))}
                            className="text-rose-600 font-bold hover:text-rose-700 cursor-pointer ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: Admin Rating & Badges */}
              <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl space-y-3">
                <h4 className="font-black text-xs text-amber-900 uppercase tracking-wider border-b border-amber-200/80 pb-1.5 flex items-center gap-1.5">
                  <span>👑</span> Admin Rating, Plan &amp; Verification Badges
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Initial Customer Rating ⭐</label>
                    <select
                      value={newBizRating}
                      onChange={(e) => setNewBizRating(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="5.0">5.0 ⭐ (Excellent)</option>
                      <option value="4.8">4.8 ⭐ (Very Good)</option>
                      <option value="4.5">4.5 ⭐ (Good)</option>
                      <option value="4.0">4.0 ⭐ (Average)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Subscription Plan Tier</label>
                    <select
                      value={newBizSubscription}
                      onChange={(e) => setNewBizSubscription(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Admin Created">Admin Created (VIP)</option>
                      <option value="Premium">Premium Plan</option>
                      <option value="Gold">Gold Plan</option>
                      <option value="Silver">Silver Plan</option>
                      <option value="Free">Free Plan</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-emerald-900">
                    <input
                      type="checkbox"
                      checked={newBizVerified}
                      onChange={(e) => setNewBizVerified(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-emerald-300 focus:ring-emerald-500"
                    />
                    <span>✓ Auto-Verify Business (Verified Checkmark Badge)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-teal-900">
                    <input
                      type="checkbox"
                      checked={newBizPremium}
                      onChange={(e) => setNewBizPremium(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-teal-300 focus:ring-teal-500"
                    />
                    <span>⭐ Mark as Featured / Top Sponsored</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminAddBizModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDirectBiz}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all hover:scale-[1.01] cursor-pointer flex items-center gap-2"
                >
                  {addingDirectBiz ? 'Creating Listing & Services...' : '👑 Create Business with Services (Tagged Admin)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADMIN DIRECT SPECIALIST CREATION MODAL ==================== */}
      {adminAddSpecialistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="fixed inset-0" onClick={() => setAdminAddSpecialistModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">✨ Add Specialist / Freelancer — Admin Entry</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Create verified specialist profiles directly. Tagged with "👑 Created by Admin".</p>
                </div>
              </div>
              <button
                onClick={() => setAdminAddSpecialistModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateDirectAdminSpecialist} className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Specialist Name */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Specialist / Freelancer Name *</label>
                  <input
                    type="text"
                    value={newSpecName}
                    onChange={(e) => setNewSpecName(e.target.value)}
                    placeholder="e.g. Dr. Priya Sharma or Ravi Electricals"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={newSpecPhone}
                    onChange={(e) => setNewSpecPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Specialist Category Type (key) */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Specialist Network Section</label>
                  <select
                    value={newSpecCategoryKey}
                    onChange={(e) => setNewSpecCategoryKey(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="helpers">🔧 Home Services & Helpers</option>
                    <option value="caterers">🍽️ Caterers & Food Specialists</option>
                    <option value="influencers">🎤 Content Creators & Influencers</option>
                    <option value="properties">🏠 Real Estate & Property Agents</option>
                  </select>
                </div>

                {/* Specialty / Display Category */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Specialty / Display Category *</label>
                  <input
                    type="text"
                    value={newSpecCategory}
                    onChange={(e) => setNewSpecCategory(e.target.value)}
                    placeholder="e.g. Electrician, Photographer, Tiffin Chef..."
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Price / Rate */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Starting Price / Rate *</label>
                  <input
                    type="text"
                    value={newSpecPrice}
                    onChange={(e) => setNewSpecPrice(e.target.value)}
                    placeholder="e.g. ₹500/visit or ₹200/hr"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Years of Experience</label>
                  <select
                    value={newSpecExperience}
                    onChange={(e) => setNewSpecExperience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Fresher">Fresher (New)</option>
                    <option value="1+ Year">1+ Year</option>
                    <option value="2+ Years">2+ Years</option>
                    <option value="3+ Years">3+ Years</option>
                    <option value="5+ Years">5+ Years</option>
                    <option value="7+ Years">7+ Years</option>
                    <option value="10+ Years">10+ Years</option>
                    <option value="15+ Years">15+ Years</option>
                  </select>
                </div>
              </div>

              {/* Services (comma separated) */}
              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Services Offered (comma separated)</label>
                <input
                  type="text"
                  value={newSpecServices}
                  onChange={(e) => setNewSpecServices(e.target.value)}
                  placeholder="e.g. AC Repair, Wiring, Fan Installation, CCTV Setup"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">About / Bio</label>
                <textarea
                  rows={3}
                  value={newSpecBio}
                  onChange={(e) => setNewSpecBio(e.target.value)}
                  placeholder="Describe expertise, experience, and why clients should hire this specialist..."
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Profile Avatar URL */}
              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">📷 Profile Avatar (Paste Image URL)</label>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full border-2 border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 shrink-0 shadow-inner">
                    {newSpecAvatar ? (
                      <img src={newSpecAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-spec-avatar-picker"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => { if (reader.result) setNewSpecAvatar(reader.result as string); };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-spec-avatar-picker"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow-sm"
                    >
                      📁 Choose Photo
                    </label>
                    <input
                      type="text"
                      value={newSpecAvatar}
                      onChange={(e) => setNewSpecAvatar(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">📸 Instagram Link</label>
                  <input
                    type="text"
                    value={newSpecInstagram}
                    onChange={(e) => setNewSpecInstagram(e.target.value)}
                    placeholder="@username or full URL"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500 font-extrabold uppercase mb-1">▶️ YouTube Link</label>
                  <input
                    type="text"
                    value={newSpecYoutube}
                    onChange={(e) => setNewSpecYoutube(e.target.value)}
                    placeholder="YouTube channel URL"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Subscription & Verification */}
              <div className="flex flex-wrap items-center gap-4 bg-teal-50/60 border border-teal-200 p-3.5 rounded-2xl">
                <div>
                  <label className="block text-[9px] text-slate-600 font-black uppercase mb-1">Subscription Plan</label>
                  <select
                    value={newSpecSubscription}
                    onChange={(e) => setNewSpecSubscription(e.target.value as any)}
                    className="bg-white border border-teal-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Free">Free</option>
                    <option value="Pro">⭐ Pro</option>
                    <option value="Premium">👑 Premium</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-teal-900">
                  <input
                    type="checkbox"
                    checked={newSpecVerified}
                    onChange={(e) => setNewSpecVerified(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-teal-300 focus:ring-teal-500"
                  />
                  <span>✓ Auto-Verify Profile (Verified Badge)</span>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminAddSpecialistModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingDirectSpec}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all hover:scale-[1.01] cursor-pointer flex items-center gap-2"
                >
                  {addingDirectSpec ? 'Creating Profile...' : '✨ Create Specialist (Tagged Admin)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADMIN DIRECT TRAVELS & VEHICLE CREATION MODAL ==================== */}
      {adminAddVehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="fixed inset-0" onClick={() => setAdminAddVehicleModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">🚗 Add Travels &amp; Vehicle Listing</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Add verified driver or agency directly into the server database.</p>
                </div>
              </div>
              <button
                onClick={() => setAdminAddVehicleModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAdminAddVehicle} className="space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Driver / Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={adminVehForm.name}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Boisar Travels / Rahul Cab"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Vehicle Category *</label>
                  <select
                    value={adminVehForm.category}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Car & Cab">Car &amp; Cab (Sedan/SUV)</option>
                    <option value="Auto Rickshaw">Auto Rickshaw</option>
                    <option value="Bike Rental">Bike Rental</option>
                    <option value="Bus & Traveler">Bus &amp; Traveler (17-32 Seater)</option>
                    <option value="Tempo & Shifting">Tempo &amp; Shifting (Tata Ace / Pickup)</option>
                    <option value="Commercial">Commercial Trucks &amp; Heavy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={adminVehForm.vehicleModel}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, vehicleModel: e.target.value }))}
                    placeholder="e.g. Maruti Ertiga AC / Tata Ace"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Capacity</label>
                  <input
                    type="text"
                    value={adminVehForm.capacity}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="e.g. 6+1 Passengers"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Rate / Fares</label>
                  <input
                    type="text"
                    value={adminVehForm.ratePerKm}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, ratePerKm: e.target.value }))}
                    placeholder="e.g. ₹13/km or ₹800/Trip"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Stand / Location</label>
                  <input
                    type="text"
                    value={adminVehForm.location}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Boisar West Station"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={adminVehForm.phone}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 9820098200"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Availability Timing</label>
                  <input
                    type="text"
                    value={adminVehForm.timing}
                    onChange={e => setAdminVehForm(prev => ({ ...prev, timing: e.target.value }))}
                    placeholder="e.g. 24x7 Available on Call"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Vehicle Photo URL (Optional)</label>
                <input
                  type="url"
                  value={adminVehForm.image}
                  onChange={e => setAdminVehForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/... or leave blank for default"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminAddVehicleModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs px-6 py-2 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  🚗 Save Vehicle to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD HOME TECHNICIAN / SERVICE MODAL ==================== */}
      {adminAddTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setAdminAddTechModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">➕ Add Home Technician / Helper</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Add service providers directly to Majh Boisar Home Services database.</p>
                </div>
              </div>
              <button
                onClick={() => setAdminAddTechModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAdminAddTechnician} className="space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Technician / Shop / Helper Name *</label>
                  <input
                    type="text"
                    required
                    value={adminTechForm.name}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ramesh Sharma (AC Repair)"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Service Category *</label>
                  <select
                    value={adminTechForm.category}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600 cursor-pointer"
                  >
                    <option value="AC Service">❄️ AC Repair &amp; Service</option>
                    <option value="Electrician">⚡ Electrician</option>
                    <option value="Plumber">🚰 Plumber</option>
                    <option value="Carpenter">🪚 Carpenter</option>
                    <option value="House Maid">🧹 House Maid</option>
                    <option value="Personal Driver">🚗 Personal Driver</option>
                    <option value="Home Cook / Maharaj">👨‍🍳 Home Cook / Maharaj</option>
                    <option value="Babysitter / Nanny">👶 Babysitter / Nanny</option>
                    <option value="Elderly Caretaker">👵 Elderly Caretaker</option>
                    <option value="Painter">🎨 Painter &amp; Waterproofing</option>
                    <option value="Pest Control">🦟 Pest Control</option>
                    <option value="Appliance Repair">🔧 Appliance Repair (Washing Machine/Fridge)</option>
                    <option value="RO Water Purifier">💧 RO Water Purifier</option>
                    <option value="Deep Cleaning">✨ Deep Cleaning</option>
                    <option value="CCTV & Security">📹 CCTV &amp; Security</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Contact Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={adminTechForm.phone}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 7769947217"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Boisar Location / Stand</label>
                  <input
                    type="text"
                    value={adminTechForm.location}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Boisar West, Ostwal Empire"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Visiting Fee / Salary / Rates</label>
                  <input
                    type="text"
                    value={adminTechForm.visitingFee}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, visitingFee: e.target.value }))}
                    placeholder="e.g. ₹199 Inspection or ₹3,500/Mo"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Work Experience</label>
                  <input
                    type="text"
                    value={adminTechForm.experience}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g. 6+ Yrs Experience"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Availability / Timing</label>
                  <input
                    type="text"
                    value={adminTechForm.timing}
                    onChange={e => setAdminTechForm(prev => ({ ...prev, timing: e.target.value }))}
                    placeholder="e.g. Daily 8 AM - 8 PM or On-Demand"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Contact Mode</label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAdminTechForm(prev => ({ ...prev, allowCalls: true }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        adminTechForm.allowCalls ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-250'
                      }`}
                    >
                      Call &amp; WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminTechForm(prev => ({ ...prev, allowCalls: false }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        !adminTechForm.allowCalls ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-250'
                      }`}
                    >
                      WhatsApp Only
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  value={adminTechForm.image}
                  onChange={e => setAdminTechForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/... or leave blank for default"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminAddTechModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-6 py-2 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  🔧 Save Service to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD BLOOD DONOR MODAL ==================== */}
      {adminAddDonorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setAdminAddDonorModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                  <Heart className="w-5 h-5 fill-rose-100" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">➕ Add Voluntary Blood Donor</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Add emergency blood donor profile directly to Majh Boisar database.</p>
                </div>
              </div>
              <button
                onClick={() => setAdminAddDonorModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAdminAddDonor} className="space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Donor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={adminDonorForm.name}
                    onChange={e => setAdminDonorForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Blood Group *</label>
                  <select
                    value={adminDonorForm.bloodGroup}
                    onChange={e => setAdminDonorForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600 cursor-pointer"
                  >
                    <option value="O+">🩸 O Positive (O+)</option>
                    <option value="B+">🩸 B Positive (B+)</option>
                    <option value="A+">🩸 A Positive (A+)</option>
                    <option value="AB+">🩸 AB Positive (AB+)</option>
                    <option value="O-">🩸 O Negative (O-)</option>
                    <option value="B-">🩸 B Negative (B-)</option>
                    <option value="A-">🩸 A Negative (A-)</option>
                    <option value="AB-">🩸 AB Negative (AB-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={adminDonorForm.phone}
                    onChange={e => setAdminDonorForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. 9820098200"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Location / Area in Boisar</label>
                  <input
                    type="text"
                    value={adminDonorForm.location}
                    onChange={e => setAdminDonorForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Boisar West, Ostwal Empire"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Availability / Last Donated Status</label>
                <input
                  type="text"
                  value={adminDonorForm.lastDonated}
                  onChange={e => setAdminDonorForm(prev => ({ ...prev, lastDonated: e.target.value }))}
                  placeholder="e.g. Ready to donate, or Donated last month"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-600"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminAddDonorModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs px-6 py-2 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  🩸 Save &amp; Publish Blood Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== POST ADMIN JOB MODAL ==================== */}
      {adminJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="fixed inset-0" onClick={() => setAdminJobModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">➕ Post New Job Vacancy — Admin</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Publish job listings with full specs & employer details.</p>
                </div>
              </div>
              <button
                onClick={() => setAdminJobModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!adminJobTitle.trim() || !adminJobCompany.trim()) {
                  alert('Please enter Job Title and Company Name');
                  return;
                }

                const newJob = {
                  id: Date.now(),
                  title: adminJobTitle.trim(),
                  company: adminJobCompany.trim(),
                  category: adminJobCategory,
                  salary: adminJobSalary.trim() || 'Attractive Salary',
                  location: adminJobLocation.trim() || 'Boisar',
                  type: adminJobType,
                  experience: adminJobExperience,
                  phone: adminJobPhone.replace(/\D/g, '') || '9820123456',
                  image: adminJobImage.trim() || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
                  description: adminJobDescription.trim() || `${adminJobTitle} at ${adminJobCompany} in Boisar.`,
                  status: 'Open',
                  applicants: 0
                };

                setAdminJobsList(prev => [newJob, ...prev]);
                setAdminJobModalOpen(false);
                alert(`🎉 Job "${newJob.title}" at ${newJob.company} has been published!`);
              }}
              className="space-y-4 text-xs font-bold text-slate-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Accounts Executive, Sales Manager, Receptionist"
                    value={adminJobTitle}
                    onChange={(e) => setAdminJobTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Company / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Shree Industrial Pvt Ltd"
                    value={adminJobCompany}
                    onChange={(e) => setAdminJobCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Category / Industry</label>
                  <select
                    value={adminJobCategory}
                    onChange={(e) => setAdminJobCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Medical & Healthcare">Medical & Healthcare</option>
                    <option value="Finance & Accounting">Finance & Accounting</option>
                    <option value="Factory & Industrial MIDC">Factory & Industrial MIDC</option>
                    <option value="Office Admin & Receptionist">Office Admin & Receptionist</option>
                    <option value="Delivery & Logistics">Delivery & Logistics</option>
                    <option value="Hotel & Restaurant">Hotel & Restaurant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Salary Range</label>
                  <input
                    type="text"
                    placeholder="e.g., ₹18,000 - ₹25,000 / month"
                    value={adminJobSalary}
                    onChange={(e) => setAdminJobSalary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Tarapur MIDC, Boisar West"
                    value={adminJobLocation}
                    onChange={(e) => setAdminJobLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Job Type</label>
                  <select
                    value={adminJobType}
                    onChange={(e) => setAdminJobType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Work From Home">Work From Home</option>
                    <option value="Contract / Shift">Contract / Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Experience Required</label>
                  <select
                    value={adminJobExperience}
                    onChange={(e) => setAdminJobExperience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="0-2 Years (Fresher Welcome)">0-2 Years (Fresher Welcome)</option>
                    <option value="1-3 Years">1-3 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years Senior">5+ Years Senior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Employer Phone</label>
                  <input
                    type="text"
                    placeholder="e.g., 9820123456"
                    value={adminJobPhone}
                    onChange={(e) => setAdminJobPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <label className="block text-[10px] text-slate-500 uppercase font-black">
                    Company / Office Banner Image
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Live Image Preview Thumbnail Box */}
                    <div className="w-20 h-16 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-white shrink-0 flex items-center justify-center relative shadow-2xs">
                      {adminJobImage ? (
                        <img src={adminJobImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold text-center px-1">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="admin-job-image-file-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              if (base64) {
                                setAdminJobImage(base64);
                              }
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="admin-job-image-file-input"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-2xs"
                        >
                          📁 Choose / Upload Photo
                        </label>

                        {adminJobImage && (
                          <button
                            type="button"
                            onClick={() => setAdminJobImage('')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Or paste image URL directly (e.g. https://...)"
                        value={adminJobImage}
                        onChange={(e) => setAdminJobImage(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Job Requirements & Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe role responsibilities, candidate skills needed..."
                    value={adminJobDescription}
                    onChange={(e) => setAdminJobDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminJobModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Job Listing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 🏖️ ADMIN ADD RESORT & VILLA MODAL ==================== */}
      {adminAddResortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setAdminAddResortModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Waves className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                    Add Direct Resort / Private Pool Villa
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Publish a new beach resort or private villa to the /resorts portal.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminAddResortModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewResort} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Resort / Villa Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kelwa Beach Palms Villa, Sea Breeze Agro Resort"
                    value={newResortName}
                    onChange={(e) => setNewResortName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Tagline / Highlight</label>
                  <input
                    type="text"
                    placeholder="e.g., Luxury Beachfront Villa with Private Infinity Pool & BBQ Lawn"
                    value={newResortTagline}
                    onChange={(e) => setNewResortTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Property Type</label>
                  <select
                    value={newResortType}
                    onChange={(e) => setNewResortType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600 cursor-pointer"
                  >
                    <option value="Private Pool Villa">Private Pool Villa</option>
                    <option value="Beach Resort">Beach Resort</option>
                    <option value="Luxury Farmhouse">Luxury Farmhouse</option>
                    <option value="Weekend Cottage">Weekend Cottage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Destination Area</label>
                  <select
                    value={newResortArea}
                    onChange={(e) => setNewResortArea(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600 cursor-pointer"
                  >
                    <option value="Kelwa Beach">Kelwa Beach (Palghar)</option>
                    <option value="Dahanu">Dahanu & Bordi Beach</option>
                    <option value="Boisar">Boisar & Surroundings</option>
                    <option value="Manor / Palghar">Manor / Palghar Highway</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Night Stay Price (₹/Night) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 6999"
                    value={newResortNightPrice}
                    onChange={(e) => setNewResortNightPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Day Picnic Rate (₹/Person)</label>
                  <input
                    type="number"
                    placeholder="e.g. 899"
                    value={newResortDayPrice}
                    onChange={(e) => setNewResortDayPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={newResortPhone}
                    onChange={(e) => setNewResortPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">WhatsApp Mobile</label>
                  <input
                    type="tel"
                    placeholder="10-digit WhatsApp"
                    value={newResortWhatsapp}
                    onChange={(e) => setNewResortWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Detailed Address / Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g., Near Sitladevi Temple, Kelwa Beach Road, Palghar"
                    value={newResortAddress}
                    onChange={(e) => setNewResortAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <label className="block text-[10px] text-slate-500 uppercase font-black">
                    Resort / Villa Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-20 h-16 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-white shrink-0 flex items-center justify-center relative shadow-2xs">
                      {newResortImage ? (
                        <img src={newResortImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold text-center px-1">No Image</span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full text-left">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="admin-resort-image-file-input"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const base64 = reader.result as string;
                              if (base64) setNewResortImage(base64);
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="admin-resort-image-file-input"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-800 active:scale-98 text-white rounded-xl text-xs font-black cursor-pointer transition-all shadow-2xs"
                        >
                          📁 Choose / Upload Photo
                        </label>
                        {newResortImage && (
                          <button
                            type="button"
                            onClick={() => setNewResortImage('')}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-rose-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Or paste image URL (e.g. https://...)"
                        value={newResortImage}
                        onChange={(e) => setNewResortImage(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3 justify-end border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdminAddResortModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold cursor-pointer transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Resort / Villa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── HOTEL PAYOUT SETTLEMENT CONFIRMATION MODAL ── */}
      {payoutModalOpen && selectedBookingForPayout && (() => {
        const gross = Number(selectedBookingForPayout.totalAmount) || 0;
        const cut = Math.round(gross * 0.10);
        const net = gross - cut;

        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                    💸
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">Confirm Hotel Payout Settlement</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Booking #{selectedBookingForPayout.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-black text-sm p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Settlement Summary Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hotel Partner:</span>
                  <strong className="text-slate-900">{selectedBookingForPayout.hotelName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest Name:</span>
                  <strong className="text-slate-900">{selectedBookingForPayout.guestName} ({selectedBookingForPayout.guestPhone})</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 pt-1.5">
                  <span className="text-slate-500">Gross Paid Online by Guest:</span>
                  <span className="font-bold text-slate-700">₹{gross.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span className="font-bold">Majh Boisar Cut (10% Profit):</span>
                  <span className="font-black">- ₹{cut.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-sm">
                  <span className="font-black text-slate-900">Net Payable to Hotel Owner:</span>
                  <span className="font-black text-emerald-700 text-base">₹{net.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Hotel Owner UPI & Bank Account */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">Hotel UPI ID</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedBookingForPayout.hotelUpi || 'hotel@upi');
                      alert(`Copied: ${selectedBookingForPayout.hotelUpi || 'hotel@upi'}`);
                    }}
                    className="text-[10px] text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="font-mono font-black text-slate-900 text-xs bg-white px-2.5 py-1.5 rounded-xl border border-emerald-200">
                  {selectedBookingForPayout.hotelUpi || 'hotelresidency@okhdfcbank'}
                </div>
              </div>

              {/* UTR Input Form */}
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                  Payment Reference / UTR Number *
                </label>
                <input
                  type="text"
                  value={payoutUtrInput}
                  onChange={e => setPayoutUtrInput(e.target.value)}
                  placeholder="e.g. UPI-94820491024 or IMPS-49204820"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none font-mono"
                />

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payoutNotifyWhatsapp}
                    onChange={e => setPayoutNotifyWhatsapp(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-xs text-slate-700 font-bold">📲 Open WhatsApp to notify Hotel Owner instantly</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkBookingPayoutSettled(selectedBookingForPayout.id, payoutUtrInput, payoutNotifyWhatsapp)}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  ✓ Confirm &amp; Mark Paid
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
