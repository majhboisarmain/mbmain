'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Car, Search, MapPin, Phone, MessageSquare, Plus, X, 
  CheckCircle, Camera, ShieldCheck, Clock, Users, ArrowRight,
  ChevronRight, Sparkles, Navigation, Fuel, Trash2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import BackButton from '@/components/BackButton';

export interface VehicleListing {
  id: string;
  name: string;
  category: 'Car & Cab' | 'Auto Rickshaw' | 'Bike Rental' | 'Bus & Traveler' | 'Tempo & Shifting' | 'Commercial';
  vehicleModel: string;
  capacity: string;
  ratePerKm: string;
  location: string;
  phone: string;
  timing: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  featured?: boolean;
  image: string;
  features?: string[];
}

const VEHICLE_CATEGORIES = [
  { id: 'all', name: 'All Vehicles', icon: '🚗', bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-900' },
  { id: 'car', name: 'Car & Cab', icon: '🚕', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { id: 'bus', name: 'Bus & Traveler', icon: '🚌', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { id: 'tempo', name: 'Tempo & Shifting', icon: '🚚', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { id: 'auto', name: 'Auto Rickshaw', icon: '🛺', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'bike', name: 'Bike Rental', icon: '🏍️', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  { id: 'commercial', name: 'Commercial', icon: '🚜', bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' },
];

const INITIAL_VEHICLES: VehicleListing[] = [];

const VEHICLE_PRESETS: Record<string, {
  modelPlaceholder: string;
  modelDefault: string;
  ratePlaceholder: string;
  rateDefault: string;
  capacityDefault: string;
  locationDefault: string;
  timingDefault: string;
}> = {
  'Car & Cab': {
    modelPlaceholder: 'e.g. Maruti Swift Dzire (AC) / Ertiga',
    modelDefault: 'Maruti Swift Dzire (AC)',
    ratePlaceholder: 'e.g. ₹12/km (Local & Outstation)',
    rateDefault: '₹12/km (AC Local & Outstation)',
    capacityDefault: '4+1 Passengers',
    locationDefault: 'Boisar West & Station',
    timingDefault: '24x7 Available on Call'
  },
  'Auto Rickshaw': {
    modelPlaceholder: 'e.g. Bajaj Compact CNG Auto',
    modelDefault: 'Bajaj Compact Auto (CNG)',
    ratePlaceholder: 'e.g. ₹18/km or Fixed Rates',
    rateDefault: 'Fixed & Metered Rates',
    capacityDefault: '3+1 Passengers',
    locationDefault: 'Boisar Railway Station',
    timingDefault: 'Daily 6 AM - 11 PM'
  },
  'Bike Rental': {
    modelPlaceholder: 'e.g. Honda Activa 6G / Pulsar 150',
    modelDefault: 'Honda Activa 6G (Self Drive)',
    ratePlaceholder: 'e.g. ₹399/Day (24-Hour Rental)',
    rateDefault: '₹399/Day (Self Drive)',
    capacityDefault: '2 Persons',
    locationDefault: 'Near Boisar Railway Station',
    timingDefault: 'Daily 7 AM - 9 PM'
  },
  'Bus & Traveler': {
    modelPlaceholder: 'e.g. Force Urbania 17-Seater / 45-Seater Bus',
    modelDefault: 'Force Traveler 17-Seater AC',
    ratePlaceholder: 'e.g. ₹22/km (AC Luxury Traveler)',
    rateDefault: '₹22/km (AC Luxury Traveler)',
    capacityDefault: '17 Passengers',
    locationDefault: 'Boisar & Palghar',
    timingDefault: 'Advance Booking Available'
  },
  'Tempo & Shifting': {
    modelPlaceholder: 'e.g. Tata Ace (Chota Hathi) / Bolero Pickup',
    modelDefault: 'Tata Ace Gold (Chota Hathi)',
    ratePlaceholder: 'e.g. Starting ₹499 (Room Shifting)',
    rateDefault: 'Starting ₹499 (Local Shifting)',
    capacityDefault: '750 kg Cargo',
    locationDefault: 'Boisar West & MIDC',
    timingDefault: 'Daily 24x7'
  },
  'Commercial': {
    modelPlaceholder: 'e.g. Mahindra Tractor / JCB / Water Tanker',
    modelDefault: 'Mahindra Tractor with Trolley',
    ratePlaceholder: 'e.g. ₹800/Trip Construction Materials',
    rateDefault: '₹800/Trip or ₹1,200/Hour',
    capacityDefault: 'Heavy Commercial',
    locationDefault: 'Boisar & MIDC Area',
    timingDefault: 'Daily 7 AM - 7 PM'
  }
};

const POPULAR_FARES = [
  { route: 'Boisar Station ➔ Mumbai Airport (BOM)', mode: 'AC Sedan / Ertiga', fare: '₹2,200 - ₹2,800', type: 'Cab' },
  { route: 'Boisar Station ➔ Tarapur MIDC Gate 1-3', mode: 'Auto Rickshaw', fare: '₹50 - ₹90 (Share/Private)', type: 'Auto' },
  { route: 'Boisar ➔ Kelwa Beach / Resort', mode: 'AC Cab / Auto', fare: '₹600 - ₹1,100', type: 'Cab' },
  { route: 'Boisar ➔ Dahanu Beach / Bordi', mode: 'Cab / Cruiser', fare: '₹1,200 - ₹1,800', type: 'Cab' },
  { route: 'Local 1BHK Household Shifting', mode: 'Tata Ace (Chota Hathi)', fare: '₹1,200 - ₹1,800', type: 'Tempo' },
];

function HireVehicleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams?.get('category');
  const { showToast, isLoggedIn, setLoginModalOpen, loggedInUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All Vehicles');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vehicles, setVehicles] = useState<VehicleListing[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Car & Cab' | 'Auto Rickshaw' | 'Bike Rental' | 'Bus & Traveler' | 'Tempo & Shifting' | 'Commercial'>('Car & Cab');
  const [formModel, setFormModel] = useState('Maruti Swift Dzire (AC Sedan)');
  const [formCapacity, setFormCapacity] = useState('4+1 Passengers');
  const [formRate, setFormRate] = useState('₹12/km (AC Local & Outstation)');
  const [formLocation, setFormLocation] = useState('Boisar West & Station');
  const [formPhone, setFormPhone] = useState('');
  const [formTiming, setFormTiming] = useState('24x7 Available on Call');
  const [formImage, setFormImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState<{ src: string; title: string; category?: string } | null>(null);

  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);
  const [requestingDeleteId, setRequestingDeleteId] = useState<string | null>(null);

  const userPhoneClean = useMemo(() => {
    const p = loggedInUser?.phone || (typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_user_phone') : '');
    return (p || '').replace(/\D/g, '').slice(-10);
  }, [loggedInUser]);

  // Fetch vehicles from database (with userPhone so user sees their own vehicle even if pending approval)
  const fetchDbVehicles = async () => {
    try {
      const uDigits = (loggedInUser?.phone || (typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_user_phone') : '') || '').replace(/\D/g, '').slice(-10);
      const url = uDigits ? `/api/vehicles?userPhone=${uDigits}` : '/api/vehicles';
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((d: any) => ({
            ...d,
            id: String(d.id),
            features: typeof d.features === 'string' && d.features.startsWith('[')
              ? JSON.parse(d.features)
              : (d.features || ['Direct Owner Contact', 'Verified Boisar Listing'])
          }));
          setVehicles(formatted);
          return;
        }
      }
    } catch (e) {
      console.warn('Error fetching db vehicles:', e);
    }
  };

  const fetchPendingDeletions = async () => {
    if (!userPhoneClean) return;
    try {
      const res = await fetch(`/api/deletion-requests?phone=${userPhoneClean}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const pIds = data
            .filter((d: any) => d.status === 'Pending' && d.type === 'vehicle')
            .map((d: any) => String(d.itemId));
          setPendingDeletions(pIds);
        }
      }
    } catch (e) {}
  };

  // Scroll to top on mount and load registered vehicles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      fetchDbVehicles();
      fetchPendingDeletions();
    }
  }, [userPhoneClean]);

  const handleRequestVehicleDeletion = async (v: VehicleListing) => {
    if (!confirm(`Are you sure you want to remove your listing "${v.vehicleModel}" (${v.name}) from Majh Boisar Travels?\n\nThis will send a deletion request to the Super Admin for verification and permanent removal.`)) {
      return;
    }

    setRequestingDeleteId(v.id);
    try {
      const res = await fetch('/api/deletion-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vehicle',
          itemId: v.id,
          itemName: `${v.vehicleModel} (${v.name})`,
          userName: loggedInUser?.name || v.name,
          userPhone: v.phone,
          reason: 'Driver / Owner requested vehicle listing removal'
        })
      });

      if (res.ok) {
        setPendingDeletions(prev => [...prev, String(v.id)]);
        showToast('✅ Deletion request sent! Admin will review and approve the removal shortly.', 'info', 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.alreadyPending) {
          setPendingDeletions(prev => [...prev, String(v.id)]);
          showToast('⚠️ Deletion request is already pending admin approval.', 'info', 4000);
        } else {
          showToast('Failed to submit deletion request. Please try again.', 'error');
        }
      }
    } catch (e) {
      showToast('Network error submitting deletion request.', 'error');
    } finally {
      setRequestingDeleteId(null);
    }
  };

  // Autofill form phone if logged in
  useEffect(() => {
    if (showAddModal && loggedInUser) {
      if (!formName) setFormName(loggedInUser.name || '');
      if (!formPhone) setFormPhone(loggedInUser.phone || '');
    }
  }, [showAddModal, loggedInUser]);

  const handleOpenAddModal = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      showToast('Please login with your mobile number to register your vehicle.', 'info', 4000);
      return;
    }
    if (selectedCategory && selectedCategory !== 'All Vehicles') {
      const cat = selectedCategory as any;
      if (VEHICLE_PRESETS[cat]) {
        setFormCategory(cat);
        const preset = VEHICLE_PRESETS[cat];
        setFormModel(preset.modelDefault);
        setFormRate(preset.rateDefault);
        setFormCapacity(preset.capacityDefault);
        setFormLocation(preset.locationDefault);
        setFormTiming(preset.timingDefault);
      }
    }
    setShowAddModal(true);
  };

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAddModal]);

  useEffect(() => {
    if (catParam) {
      const cleanParam = catParam.toLowerCase().trim();
      const matched = VEHICLE_CATEGORIES.find(c => 
        c.id.toLowerCase() === cleanParam || 
        c.name.toLowerCase().includes(cleanParam) ||
        cleanParam.includes(c.id.toLowerCase())
      );
      if (matched) {
        setSelectedCategory(matched.name);
      }
    }
  }, [catParam]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formName.trim() || !formPhone.trim()) {
      showToast('Please enter Driver / Agency Name and Contact Phone!', 'error');
      return;
    }

    const defaultImages: Record<string, string> = {
      'Car & Cab': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
      'Auto Rickshaw': 'https://images.unsplash.com/photo-1596707324311-64d8dbda2f9c?w=600&auto=format&fit=crop&q=80',
      'Bike Rental': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80',
      'Bus & Traveler': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      'Tempo & Shifting': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
      'Commercial': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80',
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory,
          vehicleModel: formModel.trim() || 'Standard Commercial Model',
          capacity: formCapacity.trim() || 'Standard',
          ratePerKm: formRate.trim() || 'Affordable Local Rate',
          location: formLocation.trim() || 'Boisar West',
          phone: formPhone.trim(),
          timing: formTiming.trim() || 'Daily 24x7',
          image: formImage || defaultImages[formCategory] || defaultImages['Car & Cab'],
          features: ['Direct Owner Contact', '0% Commission', 'Verified Boisar Listing']
        })
      });

      if (res.ok) {
        const savedVehicle = await res.json();
        const formattedVehicle: VehicleListing = {
          ...savedVehicle,
          id: String(savedVehicle.id),
          features: ['Direct Owner Contact', '0% Commission', 'Verified Boisar Listing']
        };
        // Deduplicate using String(id) to ensure no duplicate cards appear
        if (savedVehicle.verified) {
          setVehicles(prev => [formattedVehicle, ...prev.filter(v => String(v.id) !== String(formattedVehicle.id))]);
          setSelectedCategory(formCategory);
          setSuccessMsg('🎉 Vehicle / Driver Listed Successfully!');
          showToast(`🎉 ${formName} Listed Live on Majh Boisar Travels!`, 'success');
        } else {
          setSuccessMsg('🎉 Registration submitted! Admin will verify and activate your vehicle shortly.');
          showToast(`🎉 ${formName} submitted for verification! It will go live once approved by Admin.`, 'success', 5000);
        }

        setTimeout(() => {
          setSuccessMsg('');
          setShowAddModal(false);
          setFormName('');
          setFormPhone('');
          setFormImage('');
          fetchDbVehicles();
        }, 1500);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || 'Failed to list vehicle', 'error');
      }
    } catch (err) {
      showToast('Error saving listing to server. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const myVehicles = useMemo(() => {
    if (!userPhoneClean) return [];
    return vehicles.filter(v => (v.phone || '').replace(/\D/g, '').slice(-10) === userPhoneClean);
  }, [vehicles, userPhoneClean]);

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        const matchCat = selectedCategory === 'All Vehicles' || v.category === selectedCategory;
        const matchArea = selectedArea === 'All' || v.location.toLowerCase().includes(selectedArea.toLowerCase());
        const matchQuery = !searchQuery.trim() ||
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchCat && matchArea && matchQuery;
      })
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [vehicles, selectedCategory, selectedArea, searchQuery]);

  const otherVehicles = useMemo(() => {
    if (!userPhoneClean) return filteredVehicles;
    return filteredVehicles.filter(v => (v.phone || '').replace(/\D/g, '').slice(-10) !== userPhoneClean);
  }, [filteredVehicles, userPhoneClean]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 text-left">
      
      {/* 1. Breadcrumbs Header */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-3 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 text-left">
          <div className="flex items-center gap-2 sm:gap-3 text-xs truncate min-w-0">
            <BackButton variant="pill" label="Back" fallbackUrl="/" />
            <Link href="/" className="text-slate-500 hover:text-teal-900 font-bold transition-colors shrink-0">
              Home
            </Link>
            <span className="text-slate-300 shrink-0">/</span>
            <span className="text-slate-900 font-black truncate">Hire a Vehicle in Boisar</span>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[11px] sm:text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.6]" />
            <span>Add Your Vehicle</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 space-y-4">
        
        {/* 2. Top Interactive Category Selection Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 shadow-2xs space-y-1.5 text-left">
          
          {/* VEHICLE CATEGORIES: Horizontal Scroll on Mobile, Grid on Desktop */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Select Vehicle Type
              </span>
              <span className="text-[10px] text-slate-400 font-bold sm:hidden">👉 Swipe</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-7 sm:gap-2.5 sm:overflow-visible sm:pb-0">
              {VEHICLE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`min-w-[90px] sm:min-w-0 shrink-0 snap-start rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer group active:scale-95 ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-600 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${cat.bg} border ${cat.border} flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform`}>
                      <span>{cat.icon}</span>
                    </div>
                    <span className={`text-[10.5px] sm:text-[11px] font-black leading-tight line-clamp-1 ${
                      isSelected ? 'text-blue-900 font-black' : 'text-slate-800 group-hover:text-blue-700'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Vehicle & Driver Listings Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-5 shadow-2xs space-y-3 text-left">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                {selectedCategory === 'All Vehicles' ? 'Available Vehicles & Drivers in Boisar' : `Available ${selectedCategory} in Boisar`}
              </h2>
            </div>
          </div>

          {/* ── PINNED USER'S OWN LISTED VEHICLES ── */}
          {myVehicles.length > 0 && (
            <div className="mb-4 space-y-2.5 pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Your Listed Vehicle (Aapki Listing)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Visible to you at the top
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {myVehicles.map((v) => {
                  const isPendingDeletion = pendingDeletions.includes(String(v.id));

                  return (
                    <div
                      key={`my-${v.id}`}
                      className="bg-linear-to-b from-teal-50/70 to-white rounded-2xl overflow-hidden border-2 border-teal-500 shadow-sm flex flex-col justify-between text-left relative"
                    >
                      <div>
                        {/* Top Badge Ribbon */}
                        <div className="bg-teal-700 text-white px-3 py-1 text-[10px] font-black flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            ⭐ Aapki Listed Vehicle
                          </span>
                          {isPendingDeletion ? (
                            <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Deletion Pending Approval
                            </span>
                          ) : v.verified ? (
                            <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5" /> Live &amp; Verified
                            </span>
                          ) : (
                            <span className="bg-amber-400 text-slate-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> Pending Verification
                            </span>
                          )}
                        </div>

                        {/* Vehicle Photo Container (100% Full Vehicle Visible + Clean Ratio) */}
                        <div 
                          onClick={() => setPreviewModalImg({ src: v.image, title: `${v.name} · ${v.vehicleModel}`, category: v.category })}
                          className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer group/img flex items-center justify-center"
                        >
                          <img
                            src={v.image}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-45 scale-110 pointer-events-none"
                          />
                          <img
                            src={v.image}
                            alt={v.name}
                            className="relative z-1 max-w-full max-h-full w-auto h-auto object-contain group-hover/img:scale-[1.03] transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <span className="bg-slate-900/90 text-white text-[9.5px] font-black px-2.5 py-1 rounded-lg">
                              {v.category}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5 z-10">
                            <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                              {v.ratePerKm}
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 z-10 opacity-90 sm:opacity-0 group-hover/img:opacity-100 transition-opacity">
                            <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/20 shadow-xs">
                              🔍 Full Photo
                            </span>
                          </div>
                        </div>

                        {/* Info Block */}
                        <div className="p-3.5 space-y-2">
                          <div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug">{v.vehicleModel}</h3>
                            <p className="text-xs font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                              <span>{v.name}</span>
                              <span>•</span>
                              <span className="text-teal-700 font-extrabold">{v.capacity}</span>
                            </p>
                          </div>

                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> Location:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{v.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> Timing:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[150px]">{v.timing}</span>
                            </div>
                          </div>

                          {isPendingDeletion && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-[11px] text-rose-800 space-y-0.5">
                              <p className="font-black flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Deletion Request Under Review</span>
                              </p>
                              <p className="text-[10px] text-rose-700 leading-tight">
                                Admin will verify and remove this listing. Once accepted, it will be deleted permanently.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Footer: Delete / Remove Request */}
                      <div className="p-3 pt-0">
                        {isPendingDeletion ? (
                          <div className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-center text-xs font-black flex items-center justify-center gap-1.5 border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Removal Pending Admin Approval</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={requestingDeleteId === v.id}
                            onClick={() => handleRequestVehicleDeletion(v)}
                            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-98 font-black text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>{requestingDeleteId === v.id ? 'Submitting Request...' : 'Remove / Delete Vehicle'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {otherVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {otherVehicles.map((v) => (
                <div
                  key={v.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group text-left ${
                    v.featured ? 'border-2 border-amber-400 ring-1 ring-amber-300/60 shadow-md' : 'border border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div>
                    {/* Vehicle Photo Container (100% Full Vehicle Visible + Clean Ratio) */}
                    <div 
                      onClick={() => setPreviewModalImg({ src: v.image, title: `${v.name} · ${v.vehicleModel}`, category: v.category })}
                      className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden shrink-0 cursor-pointer group/img flex items-center justify-center"
                    >
                      <img
                        src={v.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-45 scale-110 pointer-events-none"
                      />
                      <img
                        src={v.image}
                        alt={v.name}
                        className="relative z-1 max-w-full max-h-full w-auto h-auto object-contain group-hover/img:scale-[1.03] transition-transform duration-500"
                      />
                      {v.featured && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 text-[9.5px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 border border-amber-300">
                            ⭐ Top Choice
                          </span>
                        </div>
                      )}
                      <div className={`absolute ${v.featured ? 'top-10' : 'top-2.5'} left-2.5 z-10`}>
                        <span className="bg-slate-900/90 backdrop-blur-md text-white text-[9.5px] font-black px-2.5 py-1 rounded-lg shadow-xs border border-white/10">
                          {v.category}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                          {v.ratePerKm}
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 z-10 opacity-90 sm:opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <span className="bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/20 shadow-xs">
                          🔍 Full Photo
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{v.name}</h3>
                            <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-black px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                              ✓ Verified
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-blue-700 mt-0.5 truncate">
                            🚘 {v.vehicleModel}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>Capacity:</span>
                          </span>
                          <span className="font-bold text-slate-800">{v.capacity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>Stand / Location:</span>
                          </span>
                          <span className="font-bold text-slate-800 truncate max-w-[150px]">{v.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            <span>Availability:</span>
                          </span>
                          <span className="font-bold text-slate-800 truncate max-w-[150px]">{v.timing}</span>
                        </div>
                      </div>

                      {v.features && v.features.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-1">
                          {v.features.map((feat, fidx) => (
                            <span key={fidx} className="bg-slate-100 text-slate-700 text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1-Tap Call & WhatsApp Action Footer */}
                  <div className="p-3 pt-0 flex items-center gap-2">
                    <a
                      href={`tel:${v.phone}`}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-xs py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver</span>
                    </a>
                    <a
                      href={`https://wa.me/91${v.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${v.name}, I found your ${v.vehicleModel} on Majh Boisar. I want to inquire about vehicle booking & rates.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-xs py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : myVehicles.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-2.5 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                <Car className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">No Vehicles Listed in this Category</h4>
              </div>
            </div>
          ) : null}
        </div>

        {/* 5. Bottom Registration Banner (Slim & Compact) */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs text-left">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-white">
              Own a Car, Auto, Bike, Bus or Tempo in Boisar?
            </h3>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            + Register Vehicle
          </button>
        </div>

      </div>

      {/* ── DRIVER / VEHICLE REGISTRATION MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-3.5 sm:p-5 shadow-2xl relative border border-slate-200 max-h-[88vh] flex flex-col text-left overflow-hidden">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2 mb-2.5 pr-8">
              <div className="flex items-center gap-1.5 text-blue-700">
                <Car className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider">List Vehicle / Driver in Boisar</h3>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Register your car, auto, bike, tempo or bus for customer bookings</p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 flex items-center gap-2 text-xs font-black animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-2 overflow-y-auto pr-1">
                
                {/* Photo Upload - Compact */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  {formImage ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-blue-300 shrink-0">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="absolute top-0 right-0 bg-black/80 text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-700 font-bold text-[11px] px-2.5 py-1 rounded-lg cursor-pointer border border-blue-200 transition-colors shadow-2xs">
                      <Camera className="w-3 h-3" />
                      <span>{formImage ? 'Change Photo' : 'Upload Vehicle Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const { compressImage } = await import('@/lib/imageCompressor');
                            const compressed = await compressImage(file, 800, 800, 0.85);
                            setFormImage(compressed);
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setFormImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Driver / Agency Name */}
                <div>
                  <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Driver or Agency Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Sai Krupa Travels / Ramesh Patil Auto"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                {/* Vehicle Category & Phone in 2 cols */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Category *</label>
                    <select
                      value={formCategory}
                      onChange={e => {
                        const newCat = e.target.value as any;
                        setFormCategory(newCat);
                        const preset = VEHICLE_PRESETS[newCat];
                        if (preset) {
                          setFormModel(preset.modelDefault);
                          setFormRate(preset.rateDefault);
                          setFormCapacity(preset.capacityDefault);
                          setFormLocation(preset.locationDefault);
                          setFormTiming(preset.timingDefault);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600 cursor-pointer truncate"
                    >
                      <option value="Car & Cab">🚗 Car &amp; Cab</option>
                      <option value="Auto Rickshaw">🛺 Auto Rickshaw</option>
                      <option value="Bike Rental">🏍️ Bike Rental</option>
                      <option value="Bus & Traveler">🚌 Bus &amp; Traveler</option>
                      <option value="Tempo & Shifting">🚚 Tempo &amp; Shifting</option>
                      <option value="Commercial">🚜 Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      placeholder="e.g. 7769947217"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Model & Capacity in 2 cols */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Model *</label>
                    <input
                      type="text"
                      required
                      value={formModel}
                      onChange={e => setFormModel(e.target.value)}
                      placeholder="e.g. Swift Dzire / Ertiga"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Capacity *</label>
                    <input
                      type="text"
                      required
                      value={formCapacity}
                      onChange={e => setFormCapacity(e.target.value)}
                      placeholder="e.g. 4+1 / 750 kg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Rate & Stand Location in 2 cols */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Rate / Fare *</label>
                    <input
                      type="text"
                      required
                      value={formRate}
                      onChange={e => setFormRate(e.target.value)}
                      placeholder="e.g. ₹12/km"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Stand / Location *</label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                      placeholder="e.g. Boisar West / MIDC"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Availability / Operating Hours Timing */}
                <div>
                  <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">
                    Availability / Timing *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTiming}
                    onChange={e => setFormTiming(e.target.value)}
                    placeholder="e.g. Daily 6 AM - 11 PM or 24x7 Available on Call"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-black text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-1 ${
                    isSubmitting
                      ? 'bg-blue-400 text-white cursor-not-allowed opacity-80'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                      <span>Listing Vehicle, Please Wait...</span>
                    </>
                  ) : (
                    <span>Submit &amp; List Vehicle</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Full Photo Modal / Lightbox */}
      {previewModalImg && (
        <div 
          onClick={() => setPreviewModalImg(null)}
          className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-white/10 text-white">
              <div>
                <h4 className="text-xs sm:text-sm font-black">{previewModalImg.title}</h4>
                {previewModalImg.category && (
                  <span className="text-[10px] text-blue-400 font-bold">{previewModalImg.category}</span>
                )}
              </div>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative flex-1 flex items-center justify-center p-2 bg-black overflow-auto">
              <img
                src={previewModalImg.src}
                alt={previewModalImg.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="px-4 py-2 bg-slate-950 text-center text-[11px] text-slate-400 font-medium">
              100% Full Uncropped Photo View
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function HireVehiclePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HireVehicleContent />
    </Suspense>
  );
}
