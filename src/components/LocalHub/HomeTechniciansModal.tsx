'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Wrench, X, MapPin, Phone, MessageSquare, Plus, CheckCircle, 
  Star, Camera, Search, ArrowLeft, ChevronRight, Sparkles, 
  Droplets, Zap, Hammer, Paintbrush, ShieldAlert, Truck, 
  LayoutGrid, Tv, ShieldCheck, Clock, ExternalLink
} from 'lucide-react';

interface HomeTechniciansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceCategory {
  id: string;
  name: string;
  query: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  iconType: 'ac' | 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaning' | 'pest' | 'movers' | 'more' | 'ro' | 'appliance' | 'cctv' | 'solar' | 'mason' | 'mechanic' | 'maid';
}

interface PopularService {
  id: string;
  title: string;
  category: string;
  startingPrice: string;
  rating: number;
  reviews: number;
  image: string;
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

// 9 Most-Used Core Categories
const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'maid', name: 'House Maid', query: 'House Maid', iconBg: 'bg-pink-50', iconColor: 'text-pink-600', borderColor: 'border-pink-200', iconType: 'maid' as any },
  { id: 'electrician', name: 'Electricians', query: 'Electrician', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200', iconType: 'electrician' as any },
  { id: 'plumber', name: 'Plumbers', query: 'Plumber', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200', iconType: 'plumber' as any },
  { id: 'ro', name: 'RO & Water Purifier', query: 'RO Purifier', iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', borderColor: 'border-cyan-200', iconType: 'ro' as any },
  { id: 'ac', name: 'AC Service', query: 'AC Repair', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200', iconType: 'ac' as any },
  { id: 'cook', name: 'Cook / Chef', query: 'Cook', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200', iconType: 'cook' as any },
  { id: 'driver', name: 'Car Driver', query: 'Car Driver', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', borderColor: 'border-indigo-200', iconType: 'driver' as any },
  { id: 'carpenter', name: 'Carpenters', query: 'Carpenter', iconBg: 'bg-amber-100/70', iconColor: 'text-amber-800', borderColor: 'border-amber-300', iconType: 'carpenter' as any },
  { id: 'more', name: 'More Services', query: 'Home Services', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200', iconType: 'more' as any },
];

// Expanded list for "More Services"
const EXTENDED_CATEGORIES: ServiceCategory[] = [
  { id: 'painter', name: 'Painters', query: 'Painter', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', borderColor: 'border-indigo-200', iconType: 'painter' as any },
  { id: 'babysitter', name: 'Babysitter', query: 'Babysitter', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200', iconType: 'babysitter' as any },
  { id: 'deepclean', name: 'Deep Clean', query: 'Deep Clean', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', borderColor: 'border-teal-200', iconType: 'deepclean' as any },
  { id: 'pest', name: 'Pest Control', query: 'Pest Control', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', borderColor: 'border-sky-200', iconType: 'pest' as any },
  { id: 'movers', name: 'Packers & Movers', query: 'Packers & Movers', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', borderColor: 'border-orange-200', iconType: 'movers' as any },
  { id: 'elderly', name: 'Elderly Care', query: 'Elderly Care', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', borderColor: 'border-rose-200', iconType: 'elderly' as any },
  { id: 'appliance', name: 'Washing Machine & Fridge', query: 'Appliance Repair', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', borderColor: 'border-rose-200', iconType: 'appliance' as any },
  { id: 'cctv', name: 'CCTV & Security', query: 'CCTV', iconBg: 'bg-slate-100', iconColor: 'text-slate-700', borderColor: 'border-slate-300', iconType: 'cctv' as any },
  { id: 'solar', name: 'Solar Panels & Inverters', query: 'Solar', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-700', borderColor: 'border-yellow-200', iconType: 'solar' as any },
  { id: 'mason', name: 'Tile & Construction Mason', query: 'Tile Mason', iconBg: 'bg-stone-50', iconColor: 'text-stone-700', borderColor: 'border-stone-200', iconType: 'mason' as any },
  { id: 'mechanic', name: 'Car & Bike Mechanic', query: 'Automobile Repair', iconBg: 'bg-red-50', iconColor: 'text-red-600', borderColor: 'border-red-200', iconType: 'mechanic' as any },
];

// Popular Services matching the user screenshot
const POPULAR_SERVICES: PopularService[] = [
  {
    id: 'pop-1',
    title: 'AC Repair & Service',
    category: 'AC Service',
    startingPrice: 'Starting ₹299',
    rating: 4.6,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-maid',
    title: 'House Maid & Cook (कामवाली बाई / रसोइया)',
    category: 'House Maid & Cook',
    startingPrice: 'Starting ₹1,499/mo',
    rating: 4.8,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-2',
    title: 'Plumbing Works',
    category: 'Plumbers',
    startingPrice: 'Starting ₹199',
    rating: 4.5,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-ro',
    title: 'RO Purifier Service & Repair',
    category: 'RO Purifier',
    startingPrice: 'Starting ₹299',
    rating: 4.8,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-3',
    title: 'Electrical Repairs',
    category: 'Electricians',
    startingPrice: 'Starting ₹199',
    rating: 4.6,
    reviews: 51,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-4',
    title: 'Carpentry & Furniture Repair',
    category: 'Carpenters',
    startingPrice: 'Starting ₹249',
    rating: 4.7,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-5',
    title: 'Painting & Waterproofing',
    category: 'Painters',
    startingPrice: 'Starting ₹499',
    rating: 4.7,
    reviews: 34,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-6',
    title: 'Home Deep Cleaning & Sofa',
    category: 'Cleaning',
    startingPrice: 'Starting ₹399',
    rating: 4.8,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-7',
    title: 'Pest Control Treatment',
    category: 'Pest Control',
    startingPrice: 'Starting ₹599',
    rating: 4.8,
    reviews: 23,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'pop-8',
    title: 'Packers & Movers (Local & Outstation)',
    category: 'Packers & Movers',
    startingPrice: 'Starting ₹1,499',
    rating: 4.9,
    reviews: 62,
    image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500&auto=format&fit=crop&q=80'
  }
];

export default function HomeTechniciansModal({ isOpen, onClose }: HomeTechniciansModalProps) {
  const router = useRouter();
  const { isLoggedIn, setLoginModalOpen, showToast } = useApp();

  // Navigation states
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [showExtendedCategories, setShowExtendedCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);

  // Add Provider Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('AC Service');
  const [formExperience, setFormExperience] = useState('5+ Yrs Experience');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('Boisar West');
  const [formVisitingFee, setFormVisitingFee] = useState('₹199 Inspection Fee');
  const [formImage, setFormImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch technicians from database
  const fetchDbTechnicians = async () => {
    try {
      const res = await fetch('/api/technicians');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProviders(data);
          return;
        }
      }
    } catch (e) {
      console.warn('Error fetching technicians:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbTechnicians();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSelectedCategory(null);
      setShowExtendedCategories(false);
      setShowAddForm(false);
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      default:
        return <Wrench className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  const handleSelectCategory = (cat: ServiceCategory) => {
    if (cat.id === 'more') {
      setShowExtendedCategories(true);
      return;
    }
    setSelectedCategory(cat);
  };

  const handleOpenDirectorySearch = (query: string) => {
    onClose();
    router.push(`/search?category=${encodeURIComponent(query)}`);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast("Please enter Technician / Shop Name and Contact Phone!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/technicians', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory,
          experience: formExperience,
          phone: formPhone.trim(),
          location: formLocation.trim() || 'Boisar West',
          visitingFee: formVisitingFee.trim() || '₹199 Inspection Fee',
          image: formImage.trim() || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
        })
      });

      if (res.ok) {
        const saved = await res.json();
        setProviders(prev => [saved, ...prev]);
        setSuccessMsg('🎉 Service Provider Registered Successfully!');
        showToast('🎉 Service Provider Registered Successfully on Majh Boisar!', 'success');

        setTimeout(() => {
          setSuccessMsg('');
          setShowAddForm(false);
          setFormName('');
          setFormPhone('');
          setFormImage('');
        }, 1500);
      } else {
        const errData = await res.json();
        showToast(errData.error || 'Failed to register provider', 'error');
      }
    } catch (err) {
      showToast('Error saving to server. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered providers for active view
  const activeProviders = useMemo(() => {
    if (!selectedCategory) return [];
    return providers.filter(p => {
      const matchCat = p.category?.toLowerCase().includes(selectedCategory.name.toLowerCase()) ||
        selectedCategory.name.toLowerCase().includes(p.category?.toLowerCase() || '') ||
        p.name?.toLowerCase().includes(selectedCategory.query.toLowerCase());
      
      const matchSearch = !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [providers, selectedCategory, searchQuery]);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl relative border border-slate-200 max-h-[92vh] flex flex-col text-left overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Bar */}
        <div className="flex items-center justify-between gap-2.5 mb-3 shrink-0 pr-8 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedCategory ? (
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Back to Services"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Wrench className="w-4.5 h-4.5" />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                {selectedCategory ? selectedCategory.name : 'Boisar Home Services'}
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                {selectedCategory ? `Verified ${selectedCategory.name} in Boisar` : 'Electricians, plumbers, AC technicians & repairs'}
              </p>
            </div>
          </div>

          {!showAddForm && (
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  showToast("Please login first to register as a service provider.", "info", 4000);
                  setLoginModalOpen(true);
                  return;
                }
                setShowAddForm(true);
              }}
              className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-auto whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Service</span>
            </button>
          )}
        </div>

        {/* ── 1. ADD TECHNICIAN / SERVICE PROVIDER FORM ── */}
        {showAddForm ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 max-w-lg mx-auto space-y-3.5 text-left">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2 text-teal-800">
                  <Wrench className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Register as Service Provider in Boisar</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {successMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2 text-xs font-black animate-in fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Technician / Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma (AC Repair & Installation)"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Service Category *</label>
                      <select
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600"
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600"
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
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Visiting / Inspection Fee</label>
                      <input
                        type="text"
                        value={formVisitingFee}
                        onChange={e => setFormVisitingFee(e.target.value)}
                        placeholder="e.g. ₹199 Inspection / Call for Quote"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600"
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-teal-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all cursor-pointer mt-1"
                  >
                    Submit &amp; Register Service Live
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : selectedCategory ? (
          /* ── 2. SELECTED CATEGORY DETAILS & DIRECTORY LIST VIEW ── */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Category Quick Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3 shrink-0 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-9 h-9 rounded-xl ${selectedCategory.iconBg} border ${selectedCategory.borderColor} flex items-center justify-center shrink-0`}>
                  {renderCategoryIcon(selectedCategory.iconType, selectedCategory.iconColor)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 truncate">{selectedCategory.name} in Boisar</h4>
                  <p className="text-[10px] text-slate-500 font-medium truncate">Direct 1-tap call &amp; verified local technicians</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenDirectorySearch(selectedCategory.query)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-[10.5px] px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Full Directory</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Providers List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
              {activeProviders.length > 0 ? (
                activeProviders.map(provider => (
                  <div
                    key={provider.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={provider.image || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'}
                        alt={provider.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{provider.name}</h4>
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-200">
                            Verified
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>{provider.location} • {provider.experience}</span>
                        </p>
                        <p className="text-[10.5px] text-teal-700 font-black mt-0.5">
                          {provider.visitingFee}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                      <a
                        href={`tel:${provider.phone}`}
                        className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${provider.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${provider.name}, I need ${selectedCategory.name} in Boisar. Please share your availability!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-[11px] px-3 py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback default provider cards for instant 1-tap experience */
                <div className="space-y-2.5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 font-black text-sm">
                        MB
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">Boisar Verified {selectedCategory.name} Helpline</h4>
                          <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-200">
                            Verified
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span>All Areas in Boisar • Instant Response</span>
                        </p>
                        <p className="text-[10.5px] text-teal-700 font-black mt-0.5">
                          Direct Helpline &amp; Free Quote
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => handleOpenDirectorySearch(selectedCategory.query)}
                        className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>View Verified {selectedCategory.name} in Boisar</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
                    <p className="text-xs font-bold text-slate-700">Are you an experienced technician in Boisar?</p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">List your phone number and get direct daily repair calls.</p>
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          showToast("Please login first to list your service.", "info", 4000);
                          setLoginModalOpen(true);
                          return;
                        }
                        setFormCategory(selectedCategory.name);
                        setShowAddForm(true);
                      }}
                      className="mt-2 text-xs font-black text-teal-700 bg-white border border-teal-300 hover:bg-teal-50 px-3.5 py-1.5 rounded-xl cursor-pointer shadow-2xs"
                    >
                      + Register as {selectedCategory.name} Provider
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── 3. MAIN HUB VIEW (MATCHING USER SCREENSHOT EXACTLY!) ── */
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            
            {/* Top Search Bar & Location (matching screenshot) */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services (e.g. AC, plumber, electrician)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleOpenDirectorySearch(searchQuery.trim());
                    }
                  }}
                  className="w-full bg-slate-100/90 border border-slate-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-teal-500 transition-all placeholder:text-slate-400 shadow-2xs"
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

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 px-1">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>Boisar</span>
                <span className="text-[10px] text-slate-400 font-medium">(Near Station, Tarapur MIDC &amp; Ostwal)</span>
              </div>
            </div>

            {/* 3x3 CATEGORY GRID (Exact layout from user screenshot) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {(showExtendedCategories ? [...SERVICE_CATEGORIES.filter(c => c.id !== 'more'), ...EXTENDED_CATEGORIES] : SERVICE_CATEGORIES).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-2 shadow-2xs hover:shadow-md active:scale-95 transition-all cursor-pointer group"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${cat.iconBg} border ${cat.borderColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    {renderCategoryIcon(cat.iconType, cat.iconColor)}
                  </div>
                  <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-teal-700 transition-colors leading-tight line-clamp-1">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

            {showExtendedCategories && (
              <div className="text-center pt-1">
                <button
                  onClick={() => setShowExtendedCategories(false)}
                  className="text-xs font-black text-teal-700 hover:underline cursor-pointer"
                >
                  ↑ Show Less Categories
                </button>
              </div>
            )}

            {/* POPULAR SERVICES SECTION (Matching user screenshot) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-black text-slate-900 tracking-tight">Popular Services</h4>
                <button
                  onClick={() => handleOpenDirectorySearch('Home Services')}
                  className="text-xs font-extrabold text-slate-500 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Popular Services Vertical List */}
              <div className="space-y-2">
                {POPULAR_SERVICES.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => {
                      const matchedCat = SERVICE_CATEGORIES.find(c => c.name.toLowerCase() === service.category.toLowerCase()) || {
                        id: service.id,
                        name: service.title,
                        query: service.title,
                        iconBg: 'bg-teal-50',
                        iconColor: 'text-teal-700',
                        borderColor: 'border-teal-200',
                        iconType: 'ac' as const
                      };
                      setSelectedCategory(matchedCat);
                    }}
                    className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs hover:shadow-md hover:border-teal-400 transition-all flex items-center justify-between gap-3 cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-1">
                          {service.title}
                        </h5>
                        <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                          {service.startingPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                        ★ {service.rating}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
