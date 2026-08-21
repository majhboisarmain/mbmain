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
  ChevronDown, HeartHandshake, User, Car, UtensilsCrossed,
  Baby, Sparkle
} from 'lucide-react';

interface ServiceCategory {
  id: string;
  name: string;
  query: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  iconType: 'ac' | 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaning' | 'pest' | 'movers' | 'more' | 'maid' | 'ro' | 'appliance' | 'cctv' | 'solar' | 'mason' | 'mechanic';
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

interface DomesticHelper {
  id: string;
  name: string;
  role: 'House Maid' | 'Car Driver' | 'Cook / Chef' | 'Babysitter' | 'Deep Clean' | 'Electrician' | 'Plumber' | 'Elderly Care';
  timing: string;
  experience: string;
  expectedSalary: string;
  location: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
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

// Expanded Categories for "More Services"
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

// Pre-populated Domestic Helpers in Boisar
const INITIAL_DOMESTIC_HELPERS: DomesticHelper[] = [
  {
    id: 'maid-1',
    name: 'Sunita Kamble',
    role: 'House Maid',
    timing: 'Morning & Evening (Part-Time)',
    experience: '5+ Yrs in Boisar',
    expectedSalary: '₹2,200/mo (Bartan + Jhadu + Pocha)',
    location: 'Ostwal Empire / Boisar West',
    phone: '7769947217',
    rating: 4.8,
    reviewsCount: 28,
    verified: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'driver-1',
    name: 'Rajesh Patil',
    role: 'Car Driver',
    timing: 'Full-Time (8 AM - 7 PM)',
    experience: '8+ Yrs (Manual & Automatic)',
    expectedSalary: '₹14,000/mo (Local & Mumbai Trips)',
    location: 'Katkar Pada / Station',
    phone: '7769947217',
    rating: 4.9,
    reviewsCount: 34,
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'cook-1',
    name: 'Shanti Devi',
    role: 'Cook / Chef',
    timing: 'Morning 7-10 AM & Eve 6-9 PM',
    experience: '6+ Yrs Home Cooking',
    expectedSalary: '₹3,500/mo (Pure Veg & Non-Veg)',
    location: 'Boisar West & Ostwal',
    phone: '7769947217',
    rating: 4.8,
    reviewsCount: 22,
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'baby-1',
    name: 'Rekha Ahire',
    role: 'Babysitter',
    timing: 'Part-Time / Day Care (9 AM - 4 PM)',
    experience: '4+ Yrs Child Care',
    expectedSalary: '₹4,500/mo (Infant Feeding & Play)',
    location: 'Tarapur MIDC & Pasthal',
    phone: '7769947217',
    rating: 4.9,
    reviewsCount: 19,
    verified: true,
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'clean-1',
    name: 'Deepak Sharma',
    role: 'Deep Clean',
    timing: 'On-Demand / Weekend Visits',
    experience: '5+ Yrs Machine Cleaning',
    expectedSalary: '₹499/visit (Bathroom & Kitchen)',
    location: 'All Boisar Areas',
    phone: '7769947217',
    rating: 4.7,
    reviewsCount: 41,
    verified: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'elec-1',
    name: 'Manoj Sharma',
    role: 'Electrician',
    timing: '24/7 On-Call Emergency Service',
    experience: '7+ Yrs Industrial & Home Wiring',
    expectedSalary: '₹199 Inspection / Visit Fee',
    location: 'Station Road & MIDC',
    phone: '7769947217',
    rating: 4.8,
    reviewsCount: 52,
    verified: true,
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'plumb-1',
    name: 'Suresh Yadav',
    role: 'Plumber',
    timing: 'Daily 8 AM - 9 PM',
    experience: '6+ Yrs Pipe & Motor Repair',
    expectedSalary: '₹199 Inspection / Visit Fee',
    location: 'Pasthal & Boisar West',
    phone: '7769947217',
    rating: 4.7,
    reviewsCount: 39,
    verified: true,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'elder-1',
    name: 'Kamla Bai',
    role: 'Elderly Care',
    timing: 'Day & Night Attendant (12h / 24h)',
    experience: '6+ Yrs Patient Assistance',
    expectedSalary: '₹8,500/mo (Medicine & Companionship)',
    location: 'Navapur Road & Ostwal',
    phone: '7769947217',
    rating: 4.9,
    reviewsCount: 16,
    verified: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
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
  const [showHelperModal, setShowHelperModal] = useState(false);

  // Domestic Helper Filter State
  const [helperFilter, setHelperFilter] = useState<string>('All Helpers');
  const [domesticHelpers, setDomesticHelpers] = useState<DomesticHelper[]>(INITIAL_DOMESTIC_HELPERS);

  // Provider states
  const [providers, setProviders] = useState<ServiceProvider[]>([]);

  // Add Provider Form
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('AC Service');
  const [formExperience, setFormExperience] = useState('5+ Yrs Experience');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('Boisar West');
  const [formVisitingFee, setFormVisitingFee] = useState('₹199 Inspection Fee');
  const [formImage, setFormImage] = useState('');

  // Add Helper Form
  const [helperName, setHelperName] = useState('');
  const [helperRole, setHelperRole] = useState<'House Maid' | 'Car Driver' | 'Cook / Chef' | 'Babysitter' | 'Deep Clean' | 'Electrician' | 'Plumber' | 'Elderly Care'>('House Maid');
  const [helperTiming, setHelperTiming] = useState('Morning & Evening (Part-Time)');
  const [helperExp, setHelperExp] = useState('4+ Yrs Experience');
  const [helperSalary, setHelperSalary] = useState('₹2,500/mo (Bartan+Jhadu+Pocha)');
  const [helperLocation, setHelperLocation] = useState('Ostwal Empire');
  const [helperPhone, setHelperPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load custom providers and helpers from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_tech_list');
        const parsed = saved ? JSON.parse(saved) : [];
        setProviders(Array.isArray(parsed) ? parsed : []);

        const savedHelpers = localStorage.getItem('majh_boisar_domestic_helpers');
        if (savedHelpers) {
          const parsedH = JSON.parse(savedHelpers);
          if (Array.isArray(parsedH) && parsedH.length > 0) {
            setDomesticHelpers([...parsedH, ...INITIAL_DOMESTIC_HELPERS]);
          }
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  // Lock background scroll when modals are open
  useEffect(() => {
    if (showAddForm || showHelperModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAddForm, showHelperModal]);

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
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="2" />
            <rect width="7" height="7" x="14" y="3" rx="2" />
            <rect width="7" height="7" x="14" y="14" rx="2" />
            <rect width="7" height="7" x="3" y="14" rx="2" />
          </svg>
        );
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

  const handleAddHelperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helperName.trim() || !helperPhone.trim()) {
      showToast("Please enter Name and Contact Number!", "error");
      return;
    }

    const newHelper: DomesticHelper = {
      id: `helper-${Date.now()}`,
      name: helperName.trim(),
      role: helperRole,
      timing: helperTiming,
      experience: helperExp,
      expectedSalary: helperSalary,
      location: helperLocation.trim() || 'Boisar West',
      phone: helperPhone.trim(),
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      image: helperRole === 'House Maid' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
        : helperRole === 'Car Driver' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
        : helperRole === 'Cook / Chef' ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80'
    };

    const updatedHelpers = [newHelper, ...domesticHelpers];
    setDomesticHelpers(updatedHelpers);

    if (typeof window !== 'undefined') {
      const customOnly = updatedHelpers.filter(h => h.id.startsWith('helper-'));
      localStorage.setItem('majh_boisar_domestic_helpers', JSON.stringify(customOnly));
    }

    setSuccessMsg('🎉 Domestic Helper Profile Added Successfully!');
    showToast('🎉 Helper Profile Registered Live on Majh Boisar!', 'success');

    setTimeout(() => {
      setSuccessMsg('');
      setShowHelperModal(false);
      setHelperName('');
      setHelperPhone('');
    }, 1500);
  };

  // Filtered Domestic Helpers
  const filteredDomesticHelpers = useMemo(() => {
    return domesticHelpers.filter(h => {
      const matchRole = helperFilter === 'All Helpers' || h.role.toLowerCase() === helperFilter.toLowerCase() ||
        (helperFilter === 'House Maid' && h.role === 'House Maid') ||
        (helperFilter === 'Car Driver' && h.role === 'Car Driver') ||
        (helperFilter === 'Cook / Chef' && h.role === 'Cook / Chef') ||
        (helperFilter === 'Babysitter' && h.role === 'Babysitter') ||
        (helperFilter === 'Deep Clean' && h.role === 'Deep Clean') ||
        (helperFilter === 'Electrician' && h.role === 'Electrician') ||
        (helperFilter === 'Plumber' && h.role === 'Plumber') ||
        (helperFilter === 'Elderly Care' && h.role === 'Elderly Care');

      const matchSearch = !searchQuery.trim() ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchRole && matchSearch;
    });
  }, [domesticHelpers, helperFilter, searchQuery]);

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
            <span className="text-teal-900 font-black truncate">Home Services &amp; Domestic Helpers in Boisar</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  showToast("Please Sign In or Register first to list your profile.", "info", 4000);
                  setLoginModalOpen(true);
                  return;
                }
                setShowHelperModal(true);
              }}
              className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>+ Add Helper Profile</span>
            </button>

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
              <span>List Service</span>
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
                ⚡ 1-TAP DIRECT CONNECT
              </span>
              <span className="text-[11px] text-teal-300 font-semibold">
                Boisar West · Tarapur MIDC · Ostwal Empire · Katkar Pada
              </span>
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-black text-white leading-snug">
              Verified Maids, Drivers, Cooks, Electricians, Plumbers &amp; Technicians in Boisar
            </h1>
          </div>

          <a
            href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar,%20I%20need%20a%20verified%20maid%20or%20technician%20in%20Boisar."
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
                placeholder="Search services or helpers (e.g. house maid, car driver, AC service, cook)..."
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

        {/* ── 4. DEDICATED SECTION: DOMESTIC HELPERS & MAIDS IN BOISAR ── */}
        <div className="bg-white rounded-3xl border border-pink-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center shrink-0 shadow-2xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  Domestic Helpers &amp; Maids in Boisar
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified maids, drivers, cooks, babysitters &amp; cleaners.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isLoggedIn) {
                  showToast("Please Sign In or Register first to add a helper profile.", "info", 4000);
                  setLoginModalOpen(true);
                  return;
                }
                setShowHelperModal(true);
              }}
              className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Profile</span>
            </button>
          </div>

          {/* Helper Filter Pills (Matching User Request) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'All Helpers', label: 'All Helpers' },
              { id: 'House Maid', label: '🧹 House Maid' },
              { id: 'Car Driver', label: '🚗 Car Driver' },
              { id: 'Cook / Chef', label: '👨‍🍳 Cook / Chef' },
              { id: 'Babysitter', label: '👶 Babysitter' },
              { id: 'Deep Clean', label: '✨ Deep Clean' },
              { id: 'Electrician', label: '⚡ Electrician' },
              { id: 'Plumber', label: '🚰 Plumber' },
              { id: 'Elderly Care', label: '👵 Elderly Care' }
            ].map((pill) => {
              const active = helperFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setHelperFilter(pill.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer whitespace-nowrap border ${
                    active 
                      ? 'bg-pink-600 text-white border-pink-600 shadow-2xs' 
                      : 'bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-900 border-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Domestic Helpers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {filteredDomesticHelpers.map((helper) => (
              <div
                key={helper.id}
                className="bg-white border border-slate-200 hover:border-pink-300 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={helper.image}
                      alt={helper.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">{helper.name}</h3>
                        <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-black px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          ✓ Verified
                        </span>
                      </div>
                      <span className="inline-block bg-pink-50 text-pink-700 text-[9.5px] font-black px-2 py-0.5 rounded-md mt-0.5">
                        {helper.role}
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 truncate">
                        🕒 {helper.timing}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-[10.5px] text-slate-600 font-bold flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{helper.location} • {helper.experience}</span>
                    </p>
                    <p className="text-[11px] font-black text-pink-700 leading-snug">
                      💰 {helper.expectedSalary}
                    </p>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex items-center gap-2 pt-2.5 mt-2.5 border-t border-slate-100">
                  <a
                    href={`tel:${helper.phone}`}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-[11px] py-1.5 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/91${helper.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${helper.name}, I need a ${helper.role} in Boisar. Please share your availability & charges.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-[11px] py-1.5 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. POPULAR SERVICES SECTION (Matching Reference Screenshot) */}
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

        {/* 6. VERIFIED PROVIDERS / TECHNICIANS DIRECTORY */}
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

        {/* 7. Bottom Banner */}
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
                Are you a Maid, Cook, Driver or Technician in Boisar?
              </h3>
              <p className="text-xs text-teal-200 font-medium mt-0.5">
                List your profile on Majh Boisar and get direct customer calls with zero commission.
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
              setShowHelperModal(true);
            }}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 uppercase tracking-wider active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Register Profile</span>
          </button>
        </div>

      </div>

      {/* ── ADD HELPER / MAID PROFILE MODAL ── */}
      {showHelperModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col text-left overflow-hidden">
            
            <button
              onClick={() => setShowHelperModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2 text-pink-700">
                <HeartHandshake className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-wider">Add Domestic Helper / Maid Profile</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Register maids, drivers, cooks, babysitters or helpers in Boisar</p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2 text-xs font-black animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleAddHelperSubmit} className="space-y-3 overflow-y-auto pr-1">
                <div>
                  <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={helperName}
                    onChange={e => setHelperName(e.target.value)}
                    placeholder="e.g. Sunita Kamble / Rajesh Patil"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Job Role *</label>
                    <select
                      value={helperRole}
                      onChange={e => setHelperRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600 cursor-pointer"
                    >
                      <option value="House Maid">House Maid (कामवाली बाई)</option>
                      <option value="Car Driver">Car Driver (कार ड्राइवर)</option>
                      <option value="Cook / Chef">Cook / Chef (रसोइया)</option>
                      <option value="Babysitter">Babysitter (बेबीसिटर / नानी)</option>
                      <option value="Deep Clean">Deep Clean (क्लीनर)</option>
                      <option value="Electrician">Electrician (इलेक्ट्रीशियन)</option>
                      <option value="Plumber">Plumber (प्लंबर)</option>
                      <option value="Elderly Care">Elderly Care (बुजुर्ग देखभाल)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Contact Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={helperPhone}
                      onChange={e => setHelperPhone(e.target.value)}
                      placeholder="e.g. 7769947217"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Availability / Timings *</label>
                    <input
                      type="text"
                      required
                      value={helperTiming}
                      onChange={e => setHelperTiming(e.target.value)}
                      placeholder="e.g. Morning & Evening (Part-Time) / Full-Time"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Expected Salary / Charge *</label>
                    <input
                      type="text"
                      required
                      value={helperSalary}
                      onChange={e => setHelperSalary(e.target.value)}
                      placeholder="e.g. ₹2,500/mo (Bartan+Jhadu+Pocha)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Area / Location in Boisar *</label>
                    <input
                      type="text"
                      required
                      value={helperLocation}
                      onChange={e => setHelperLocation(e.target.value)}
                      placeholder="e.g. Ostwal Empire, Boisar West, MIDC"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Experience</label>
                    <input
                      type="text"
                      value={helperExp}
                      onChange={e => setHelperExp(e.target.value)}
                      placeholder="e.g. 5+ Yrs in Boisar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                >
                  Submit &amp; Register Helper Profile
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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
