'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Wrench, MapPin, Phone, MessageSquare, Plus, CheckCircle, 
  Star, Camera, Search, ArrowLeft, ChevronRight, Sparkles, 
  Droplets, Zap, Hammer, Paintbrush, ShieldAlert, Truck, 
  LayoutGrid, Tv, ShieldCheck, Clock, ExternalLink, X,
  CheckCircle2, ArrowUpDown, Filter, Building2, UserCheck,
  ChevronDown
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  query: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  iconType: 'ac' | 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaning' | 'pest' | 'movers' | 'more' | 'ro' | 'appliance' | 'cctv' | 'solar' | 'mason' | 'mechanic';
}

interface PopularService {
  id: string;
  title: string;
  category: string;
  startingPrice: string;
  rating: number;
  reviews: number;
  image: string;
  desc: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  experience: string;
  phone: string;
  location: string;
  visitingFee: string;
  rating: number;
  reviewsCount?: number;
  verified?: boolean;
  image: string;
}

// 9 Core Categories matching the reference screenshot
const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'ac', name: 'AC Service', query: 'AC Repair', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200', iconType: 'ac' },
  { id: 'plumber', name: 'Plumbers', query: 'Plumber', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200', iconType: 'plumber' },
  { id: 'electrician', name: 'Electricians', query: 'Electrician', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200', iconType: 'electrician' },
  { id: 'carpenter', name: 'Carpenters', query: 'Carpenter', iconBg: 'bg-amber-100/70', iconColor: 'text-amber-800', borderColor: 'border-amber-300', iconType: 'carpenter' },
  { id: 'painter', name: 'Painters', query: 'Painter', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', borderColor: 'border-indigo-200', iconType: 'painter' },
  { id: 'cleaning', name: 'Cleaning', query: 'Deep Cleaning', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', borderColor: 'border-teal-200', iconType: 'cleaning' },
  { id: 'pest', name: 'Pest Control', query: 'Pest Control', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', borderColor: 'border-sky-200', iconType: 'pest' },
  { id: 'movers', name: 'Packers & Movers', query: 'Packers & Movers', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', borderColor: 'border-orange-200', iconType: 'movers' },
  { id: 'more', name: 'More Services', query: 'Home Services', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200', iconType: 'more' },
];

// Expanded Categories for "More Services" including House Maid & Cook
const EXTENDED_CATEGORIES: ServiceCategory[] = [
  { id: 'maid', name: 'House Maid & Cook', query: 'House Maid', iconBg: 'bg-pink-50', iconColor: 'text-pink-600', borderColor: 'border-pink-200', iconType: 'maid' },
  { id: 'ro', name: 'RO & Water Purifier', query: 'RO Purifier', iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', borderColor: 'border-cyan-200', iconType: 'ro' },
  { id: 'appliance', name: 'Washing Machine & Fridge', query: 'Appliance Repair', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', borderColor: 'border-rose-200', iconType: 'appliance' },
  { id: 'cctv', name: 'CCTV & Security', query: 'CCTV', iconBg: 'bg-slate-100', iconColor: 'text-slate-700', borderColor: 'border-slate-300', iconType: 'cctv' },
  { id: 'solar', name: 'Solar Panels & Inverters', query: 'Solar', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-700', borderColor: 'border-yellow-200', iconType: 'solar' },
  { id: 'mason', name: 'Tile & Masonry Work', query: 'Tile Mason', iconBg: 'bg-stone-50', iconColor: 'text-stone-700', borderColor: 'border-stone-200', iconType: 'mason' },
  { id: 'mechanic', name: 'Car & Bike Mechanic', query: 'Automobile Repair', iconBg: 'bg-red-50', iconColor: 'text-red-600', borderColor: 'border-red-200', iconType: 'mechanic' },
];

// Popular Services matching the reference screenshot
const POPULAR_SERVICES: PopularService[] = [
  {
    id: 'pop-1',
    title: 'AC Repair & Service',
    category: 'AC Service',
    startingPrice: 'Starting ₹299',
    rating: 4.6,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
    desc: 'Gas refill, deep cleaning, cooling coil repair & split/window AC installation.'
  },
  {
    id: 'pop-maid',
    title: 'House Maid & Cook (कामवाली बाई / रसोइया)',
    category: 'House Maid & Cook',
    startingPrice: 'Starting ₹1,499/mo',
    rating: 4.8,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80',
    desc: 'Daily sweeping, mopping, utensil washing (bartan), roti-sabji cooking, baby care & full-time/part-time maid in Boisar.'
  },
  {
    id: 'pop-2',
    title: 'Plumbing Works',
    category: 'Plumbers',
    startingPrice: 'Starting ₹199',
    rating: 4.5,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=80',
    desc: 'Pipe leak fix, bathroom tap & shower fitting, water tank & motor installation.'
  },
  {
    id: 'pop-3',
    title: 'Electrical Repairs',
    category: 'Electricians',
    startingPrice: 'Starting ₹199',
    rating: 4.6,
    reviews: 51,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80',
    desc: 'Fan/light fitting, MCB tripping fix, wiring, inverter & switchboard setup.'
  },
  {
    id: 'pop-4',
    title: 'Carpentry & Furniture Repair',
    category: 'Carpenters',
    startingPrice: 'Starting ₹249',
    rating: 4.7,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=80',
    desc: 'Door lock repair, bed/wardrobe assembling, wooden modular kitchen & polish.'
  },
  {
    id: 'pop-5',
    title: 'Painting & Waterproofing',
    category: 'Painters',
    startingPrice: 'Starting ₹499',
    rating: 4.7,
    reviews: 34,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80',
    desc: 'Interior/exterior wall painting, ceiling dampness & terrace waterproofing.'
  },
  {
    id: 'pop-6',
    title: 'Home Deep Cleaning & Sofa',
    category: 'Cleaning',
    startingPrice: 'Starting ₹399',
    rating: 4.8,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80',
    desc: 'Full house deep cleaning, bathroom sanitization, sofa & kitchen degreasing.'
  },
  {
    id: 'pop-7',
    title: 'Pest Control Treatment',
    category: 'Pest Control',
    startingPrice: 'Starting ₹599',
    rating: 4.8,
    reviews: 23,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
    desc: 'Cockroach gel treatment, termite protection & bed bug herbal spray.'
  },
  {
    id: 'pop-8',
    title: 'Packers & Movers (Local & Outstation)',
    category: 'Packers & Movers',
    startingPrice: 'Starting ₹1,499',
    rating: 4.9,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500&auto=format&fit=crop&q=80',
    desc: 'Household shifting, vehicle transport & safe luggage packing in Boisar & Mumbai.'
  }
];

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  const { isLoggedIn, setLoginModalOpen, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');
  const [showExtendedCategories, setShowExtendedCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);

  // Add Provider Form
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('AC Service');
  const [formExperience, setFormExperience] = useState('5+ Yrs Experience');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('Boisar West');
  const [formVisitingFee, setFormVisitingFee] = useState('₹199 Inspection Fee');
  const [formImage, setFormImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load custom providers from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_tech_list');
        const parsed = saved ? JSON.parse(saved) : [];
        setProviders(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setProviders([]);
      }
    }
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Lock background scroll when modal open
  useEffect(() => {
    if (showAddForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAddForm]);

  // Render SVG Symbol by Category Type
  const renderCategoryIcon = (type: ServiceCategory['iconType'], colorClass: string) => {
    switch (type) {
      case 'ac':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="12" x="2" y="4" rx="2.5" />
            <path d="M6 16v2" />
            <path d="M18 16v2" />
            <path d="M6 10h12" />
            <path d="M17 7h1" />
          </svg>
        );
      case 'plumber':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m14 7 3-3 3 3-3 3" />
            <path d="M2 14h12a4 4 0 0 1 4 4v2" />
            <path d="M6 18v2" />
            <path d="M6 14a4 4 0 0 1-4-4V7a3 3 0 0 1 3-3h5" />
            <path d="M12 4v4" />
          </svg>
        );
      case 'electrician':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        );
      case 'carpenter':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 6h7v4h-7z" />
            <path d="M3 13v8" />
            <path d="M21 13v8" />
            <path d="M2 13h20" />
            <path d="M7 6v7" />
            <path d="M17 6v7" />
          </svg>
        );
      case 'painter':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 11-8-8-8.5 8.5a2.12 2.12 0 0 0 3 3L11 9" />
            <path d="m5 15 4.5 4.5c1 1 2.5 1 3.5 0L19 13" />
            <path d="M17 19v3" />
          </svg>
        );
      case 'cleaning':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 4-3 3 6 6 3-3z" />
            <path d="m3 21 8.5-8.5" />
            <path d="M14.5 9.5 8 16" />
            <path d="m18 11 2 2" />
            <path d="m11 4 2 2" />
          </svg>
        );
      case 'pest':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5Z" />
            <path d="M12 10v12" />
            <path d="M19 13H5" />
            <path d="M20 19H4" />
            <path d="M19 7l3-2" />
            <path d="M5 7L2 5" />
          </svg>
        );
      case 'movers':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.8 9.2A1 1 0 0 0 18 9h-4v9h1" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
          </svg>
        );
      case 'more':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="2" />
            <rect width="7" height="7" x="14" y="3" rx="2" />
            <rect width="7" height="7" x="14" y="14" rx="2" />
            <rect width="7" height="7" x="3" y="14" rx="2" />
          </svg>
        );
      case 'maid':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            <path d="m16 11 2 2 4-4" />
          </svg>
        );
      case 'ro':
        return <Droplets className={`w-6 h-6 ${colorClass}`} />;
      case 'appliance':
        return <Tv className={`w-6 h-6 ${colorClass}`} />;
      case 'cctv':
        return <ShieldCheck className={`w-6 h-6 ${colorClass}`} />;
      case 'solar':
        return <Zap className={`w-6 h-6 ${colorClass}`} />;
      case 'mason':
        return <Building2 className={`w-6 h-6 ${colorClass}`} />;
      case 'mechanic':
        return <Wrench className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <Wrench className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast("Please enter Technician / Shop Name and Contact Phone!", "error");
      return;
    }

    const newProvider: ServiceProvider = {
      id: `tech-custom-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      experience: formExperience,
      phone: formPhone.trim(),
      location: formLocation.trim() || 'Boisar West',
      visitingFee: formVisitingFee.trim() || '₹199 Inspection',
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
    };

    const updated = [newProvider, ...providers];
    setProviders(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_tech_list', JSON.stringify(updated));
    }

    setSuccessMsg('🎉 Service Provider Registered Successfully!');
    showToast('🎉 Service Provider Registered Successfully on Majh Boisar!', 'success');

    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
      setFormName('');
      setFormPhone('');
      setFormImage('');
    }, 1500);
  };

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchCat = selectedCategory === 'All' ||
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(p.category?.toLowerCase() || '');
      
      const matchArea = selectedArea === 'All' || p.location?.toLowerCase().includes(selectedArea.toLowerCase());

      const matchSearch = !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchArea && matchSearch;
    });
  }, [providers, selectedCategory, selectedArea, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 text-left">
      
      {/* 1. Top Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-3 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2 text-xs truncate min-w-0">
            <Link href="/" className="text-slate-500 hover:text-teal-900 font-bold transition-colors shrink-0">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-teal-900 font-black truncate">Home Services &amp; Repairs in Boisar</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  showToast("Please Sign In or Register first to list your service.", "info", 4000);
                  setLoginModalOpen(true);
                  return;
                }
                setShowAddForm(true);
              }}
              className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Your Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 space-y-4">
        
        {/* 2. Top Promo Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-teal-500/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                ⚡ 1-TAP LOCAL CALL
              </span>
              <span className="text-[11px] text-teal-300 font-semibold">
                Boisar West · Tarapur MIDC · Ostwal · Katkar Pada
              </span>
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-black text-white leading-snug">
              Verified Electricians, Plumbers, AC Technicians &amp; Home Repairs in Boisar
            </h1>
          </div>

          <a
            href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar,%20I%20need%20home%20repair%20service%20in%20Boisar."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Emergency Help on WhatsApp</span>
          </a>
        </div>

        {/* 3. Search & Location Bar (Matching Screenshot UI) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. AC service, plumber, electrician, pest control)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-10 pr-9 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 shrink-0 w-full sm:w-auto">
              <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="font-extrabold text-slate-900">Boisar</span>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1 ml-1"
              >
                <option value="All">All Locations</option>
                <option value="Boisar West">Boisar West</option>
                <option value="Ostwal Empire">Ostwal Empire</option>
                <option value="Tarapur MIDC">Tarapur MIDC</option>
                <option value="Katkar Pada">Katkar Pada / Station</option>
                <option value="Pasthal">Pasthal</option>
                <option value="Navapur">Navapur Road</option>
              </select>
            </div>
          </div>

          {/* 3x3 CATEGORIES GRID (Exact UI from user screenshot) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Top Service Categories</span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="text-[10.5px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-2.5">
              {(showExtendedCategories ? [...SERVICE_CATEGORIES.filter(c => c.id !== 'more'), ...EXTENDED_CATEGORIES] : SERVICE_CATEGORIES).map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'more') {
                        setShowExtendedCategories(!showExtendedCategories);
                      } else {
                        setSelectedCategory(isSelected ? 'All' : cat.name);
                      }
                    }}
                    className={`rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer group active:scale-95 ${
                      isSelected 
                        ? 'bg-teal-50 border-teal-600 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-2xs'
                    }`}
                  >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${cat.iconBg} border ${cat.borderColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      {renderCategoryIcon(cat.iconType, cat.iconColor)}
                    </div>
                    <span className={`text-[10.5px] sm:text-[11px] font-black leading-tight line-clamp-1 ${
                      isSelected ? 'text-teal-900' : 'text-slate-800 group-hover:text-teal-700'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. POPULAR SERVICES SECTION (Matching Reference Screenshot) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Popular Services in Boisar
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Standard upfront starting rates &amp; top-rated technicians</p>
            </div>
            <span className="text-xs font-extrabold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
              ★ 4.6+ Average Rating
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {POPULAR_SERVICES.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedCategory(service.category)}
                className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between cursor-pointer group text-left"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-1">
                      {service.title}
                    </h3>
                    <p className="text-[11px] font-extrabold text-teal-700 mt-0.5">
                      {service.startingPrice}
                    </p>
                    <span className="text-[10px] font-black text-amber-500 flex items-center gap-0.5 mt-0.5">
                      ★ {service.rating} ({service.reviews})
                    </span>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-extrabold text-slate-500 group-hover:text-teal-800">
                  <span>View Technicians</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. VERIFIED PROVIDERS / TECHNICIANS DIRECTORY */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                {selectedCategory === 'All' ? 'Verified Local Technicians & Service Providers' : `${selectedCategory} in Boisar`}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">1-Tap direct phone call &amp; WhatsApp with verified local professionals</p>
            </div>

            <button
              onClick={() => router.push(`/search?category=${encodeURIComponent(selectedCategory === 'All' ? 'Home Services' : selectedCategory)}`)}
              className="text-xs font-black text-slate-700 hover:text-teal-800 bg-slate-100 hover:bg-teal-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>Search Full Directory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((tech) => (
                <div
                  key={tech.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs hover:shadow-md hover:border-teal-400 transition-all flex flex-col justify-between group text-left"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={tech.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'}
                      alt={tech.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{tech.name}</h4>
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          Verified
                        </span>
                      </div>
                      <span className="inline-block bg-slate-100 text-slate-700 text-[9.5px] font-black px-2 py-0.5 rounded mt-1">
                        {tech.category}
                      </span>
                      <p className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1 mt-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{tech.location} • {tech.experience}</span>
                      </p>
                      <p className="text-[11px] text-teal-700 font-black mt-1">
                        {tech.visitingFee}
                      </p>
                    </div>
                  </div>

                  {/* 1-Tap Actions */}
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                    <a
                      href={`tel:${tech.phone}`}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Direct</span>
                    </a>
                    <a
                      href={`https://wa.me/91${tech.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${tech.name}, I need ${tech.category} in Boisar. Please share your availability & rates.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              /* Fallback default service desk cards */
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2">
                <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-black text-slate-800">
                  {selectedCategory === 'All' ? 'Direct Helpline Active' : `Need ${selectedCategory} in Boisar?`}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Search across 800+ verified businesses or list your technician profile to receive daily customer calls.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                  <button
                    onClick={() => router.push(`/search?category=${encodeURIComponent(selectedCategory === 'All' ? 'Home Services' : selectedCategory)}`)}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Verified Directory</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        showToast("Please login first to list your service.", "info", 4000);
                        setLoginModalOpen(true);
                        return;
                      }
                      setShowAddForm(true);
                    }}
                    className="bg-white border border-teal-300 hover:bg-teal-50 text-teal-800 font-black text-xs px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer"
                  >
                    + Register as Service Provider
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. Luxury Bottom Banner for Service Providers */}
        <div 
          style={{ background: 'linear-gradient(135deg, #092c24 0%, #0d3d32 50%, #061c17 100%)', color: '#ffffff' }}
          className="rounded-3xl p-5 sm:p-6 border border-teal-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-400/20 text-teal-300 border border-teal-400/30 flex items-center justify-center text-xl shrink-0">
              <Wrench className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Are you an Electrician, Plumber, Painter or AC Technician in Boisar?
              </h3>
              <p className="text-xs text-teal-200 font-medium mt-0.5">
                List your business on Majh Boisar and get direct daily repair &amp; maintenance calls from local residents.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isLoggedIn) {
                showToast("Please Sign In or Register first to list your service and access your dashboard.", "info", 4000);
                setLoginModalOpen(true);
                return;
              }
              setShowAddForm(true);
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase tracking-wider active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Register Your Service</span>
          </button>
        </div>

      </div>

      {/* ── LIST SERVICE / TECHNICIAN REGISTRATION POPUP MODAL ── */}
      {showAddForm && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col text-left overflow-hidden">
            
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2 text-teal-800">
                <Wrench className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-black uppercase tracking-wider">Register as Home Technician in Boisar</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Fill details to get listed in Boisar Home Services directory</p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2 text-xs font-black animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-3 overflow-y-auto pr-1">
                <div>
                  <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Technician / Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma (AC Repair & Installation)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Service Category *</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600 cursor-pointer"
                    >
                      {SERVICE_CATEGORIES.filter(c => c.id !== 'more').map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      {EXTENDED_CATEGORIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      placeholder="e.g. 7769947217"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Service Area in Boisar *</label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                      placeholder="e.g. Boisar West, Ostwal Empire, MIDC"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Visiting / Inspection Fee</label>
                    <input
                      type="text"
                      value={formVisitingFee}
                      onChange={e => setFormVisitingFee(e.target.value)}
                      placeholder="e.g. ₹199 Inspection / Call for Quote"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Work Experience</label>
                  <input
                    type="text"
                    value={formExperience}
                    onChange={e => setFormExperience(e.target.value)}
                    placeholder="e.g. 8+ Yrs Experience"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                >
                  Submit &amp; Register Service
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function ServicesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">Loading Services...</div>}>
      <ServicesPageContent />
    </React.Suspense>
  );
}
