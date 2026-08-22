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

export const BOISAR_REGIONS = [
  'Boisar East',
  'Boisar West',
  'Betegaon',
  'Tembhode',
  'Tarapur',
  'Tarapur MIDC',
  'Saravali',
  'Salwad',
  'Pasthal',
  'Kumbhavali',
  'Pam',
  'Khaira',
  'Katkar',
  'Nandgaon',
  'Murbe',
  'Kolwade'
];

interface ServiceCategory {
  id: string;
  name: string;
  query: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  iconType: 'ac' | 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaning' | 'pest' | 'movers' | 'more' | 'maid' | 'driver' | 'cook' | 'babysitter' | 'deepclean' | 'elderly' | 'ro' | 'appliance' | 'cctv' | 'solar' | 'mason' | 'mechanic';
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
  role: string;
  timing: string;
  experience: string;
  expectedSalary: string;
  location: string;
  phone: string;
  allowCalls?: boolean; // Show direct call button or WhatsApp only
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
  allowCalls?: boolean;
  rating: number;
  reviewsCount?: number;
  verified?: boolean;
  image: string;
}

// 9 Most-Used Core Categories (Prioritized by frequency of use)
const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'maid', name: 'House Maid', query: 'House Maid', iconBg: 'bg-pink-50', iconColor: 'text-pink-600', borderColor: 'border-pink-200', iconType: 'maid' },
  { id: 'electrician', name: 'Electricians', query: 'Electrician', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200', iconType: 'electrician' },
  { id: 'plumber', name: 'Plumbers', query: 'Plumber', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200', iconType: 'plumber' },
  { id: 'ac', name: 'AC Service', query: 'AC Repair', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200', iconType: 'ac' },
  { id: 'cook', name: 'Cook / Chef', query: 'Cook', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200', iconType: 'cook' },
  { id: 'driver', name: 'Car Driver', query: 'Car Driver', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', borderColor: 'border-indigo-200', iconType: 'driver' },
  { id: 'carpenter', name: 'Carpenters', query: 'Carpenter', iconBg: 'bg-amber-100/70', iconColor: 'text-amber-800', borderColor: 'border-amber-300', iconType: 'carpenter' },
  { id: 'painter', name: 'Painters', query: 'Painter', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', borderColor: 'border-indigo-200', iconType: 'painter' },
  { id: 'more', name: 'More Services', query: 'Home Services', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200', iconType: 'more' },
];

// Extended Categories for "More Services" (Clean & non-duplicate)
const EXTENDED_CATEGORIES: ServiceCategory[] = [
  { id: 'babysitter', name: 'Babysitter', query: 'Babysitter', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200', iconType: 'babysitter' },
  { id: 'deepclean', name: 'Deep Clean', query: 'Deep Clean', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', borderColor: 'border-teal-200', iconType: 'deepclean' },
  { id: 'pest', name: 'Pest Control', query: 'Pest Control', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', borderColor: 'border-sky-200', iconType: 'pest' },
  { id: 'movers', name: 'Packers & Movers', query: 'Packers & Movers', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', borderColor: 'border-orange-200', iconType: 'movers' },
  { id: 'elderly', name: 'Elderly Care', query: 'Elderly Care', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', borderColor: 'border-rose-200', iconType: 'elderly' },
  { id: 'ro', name: 'RO Purifier', query: 'RO Purifier', iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', borderColor: 'border-cyan-200', iconType: 'ro' },
  { id: 'appliance', name: 'Washing Machine & Fridge', query: 'Appliance Repair', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', borderColor: 'border-rose-200', iconType: 'appliance' },
  { id: 'cctv', name: 'CCTV & Security', query: 'CCTV', iconBg: 'bg-slate-100', iconColor: 'text-slate-700', borderColor: 'border-slate-300', iconType: 'cctv' },
  { id: 'solar', name: 'Solar Panels', query: 'Solar', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-700', borderColor: 'border-yellow-200', iconType: 'solar' },
  { id: 'mason', name: 'Tile & Masonry', query: 'Tile Mason', iconBg: 'bg-stone-50', iconColor: 'text-stone-700', borderColor: 'border-stone-200', iconType: 'mason' },
  { id: 'mechanic', name: 'Auto Mechanic', query: 'Automobile Repair', iconBg: 'bg-red-50', iconColor: 'text-red-600', borderColor: 'border-red-200', iconType: 'mechanic' },
];

export const ROLE_PRESETS: Record<string, {
  timingLabel: string;
  timingPlaceholder: string;
  timingDefault: string;
  rateLabel: string;
  ratePlaceholder: string;
  rateDefault: string;
  locationDefault: string;
  expPlaceholder: string;
  expDefault: string;
}> = {
  'House Maid': {
    timingLabel: 'Availability / Work Timings *',
    timingPlaceholder: 'e.g. Morning & Evening (Part-Time) / Full-Time',
    timingDefault: 'Morning & Evening (Part-Time)',
    rateLabel: 'Expected Monthly Salary / Charge *',
    ratePlaceholder: 'e.g. ₹2,500/mo (Bartan + Jhadu + Pocha)',
    rateDefault: '₹2,500/mo (Bartan + Jhadu + Pocha)',
    locationDefault: 'Ostwal Empire',
    expPlaceholder: 'e.g. 5+ Yrs in Boisar Homes',
    expDefault: '5+ Yrs Experience'
  },
  'Electricians': {
    timingLabel: 'Availability / Working Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 9 PM / 24x7 Emergency',
    timingDefault: 'Daily 9 AM - 9 PM (On-Call)',
    rateLabel: 'Visiting / Inspection Fee *',
    ratePlaceholder: 'e.g. ₹199 Visiting Fee + Work Cost',
    rateDefault: '₹199 Visiting / Inspection Fee',
    locationDefault: 'Boisar Station & MIDC',
    expPlaceholder: 'e.g. 6+ Yrs (Residential & Industrial)',
    expDefault: '6+ Yrs Experience'
  },
  'Plumbers': {
    timingLabel: 'Availability / Service Hours *',
    timingPlaceholder: 'e.g. Daily 8 AM - 8 PM / Emergency Call',
    timingDefault: 'Daily 8 AM - 8 PM (Emergency Available)',
    rateLabel: 'Visiting / Inspection Fee *',
    ratePlaceholder: 'e.g. ₹199 Inspection / Leakage Fix from ₹250',
    rateDefault: '₹199 Visiting Fee',
    locationDefault: 'Boisar West & Ostwal',
    expPlaceholder: 'e.g. 5+ Yrs (Bath, Motor & Pipe Fittings)',
    expDefault: '5+ Yrs Experience'
  },
  'AC Service': {
    timingLabel: 'Availability / Service Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 8 PM',
    timingDefault: 'Daily 9 AM - 8 PM',
    rateLabel: 'Starting Service / Repair Charge *',
    ratePlaceholder: 'e.g. ₹499 AC Jet Wash / ₹1,499 Gas Refill',
    rateDefault: 'Starting ₹499 (AC Jet Wash Service)',
    locationDefault: 'Boisar & Palghar Area',
    expPlaceholder: 'e.g. 7+ Yrs (Split, Window & Inverter AC)',
    expDefault: '7+ Yrs Experience'
  },
  'Cook / Chef': {
    timingLabel: 'Cooking Timings *',
    timingPlaceholder: 'e.g. Morning 7-10 AM & Eve 6-9 PM',
    timingDefault: 'Morning 7-10 AM & Evening 6-9 PM',
    rateLabel: 'Monthly Cooking Salary / Charge *',
    ratePlaceholder: 'e.g. ₹3,500/mo (Lunch & Dinner Veg/Non-Veg)',
    rateDefault: '₹3,500/mo (Lunch & Dinner)',
    locationDefault: 'Boisar West & Ostwal Empire',
    expPlaceholder: 'e.g. 6+ Yrs (North & South Indian, Gujarati)',
    expDefault: '6+ Yrs in Boisar Homes'
  },
  'Car Driver': {
    timingLabel: 'Duty Timings / Availability *',
    timingPlaceholder: 'e.g. Full-Time (8 AM - 8 PM) / Mumbai Trips',
    timingDefault: 'Full-Time (8 AM - 8 PM) / Daily Trips',
    rateLabel: 'Monthly Salary / Daily Trip Charge *',
    ratePlaceholder: 'e.g. ₹14,000/mo or ₹800/day outstation',
    rateDefault: '₹14,000/mo (Local & Mumbai Trips)',
    locationDefault: 'Katkar Pada / Station',
    expPlaceholder: 'e.g. 8+ Yrs (Manual & Automatic Cars)',
    expDefault: '8+ Yrs Driving Experience'
  },
  'Carpenters': {
    timingLabel: 'Working Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 8 PM',
    timingDefault: 'Daily 9 AM - 8 PM',
    rateLabel: 'Visiting / Daily Rate *',
    ratePlaceholder: 'e.g. ₹250 Inspection / Daily ₹800',
    rateDefault: '₹250 Visiting Fee / Daily ₹800',
    locationDefault: 'Boisar West & MIDC',
    expPlaceholder: 'e.g. 8+ Yrs (Modular Furniture & Doors)',
    expDefault: '8+ Yrs Experience'
  },
  'Painters': {
    timingLabel: 'Working Hours *',
    timingPlaceholder: 'e.g. Daily 8 AM - 7 PM',
    timingDefault: 'Daily 8 AM - 7 PM',
    rateLabel: 'Painting Rate / 1BHK Package *',
    ratePlaceholder: 'e.g. ₹9/sq.ft or 1BHK Full Paint ₹6,999',
    rateDefault: '1BHK Full Paint from ₹6,999 / ₹9 sq.ft',
    locationDefault: 'Boisar & Surroundings',
    expPlaceholder: 'e.g. 10+ Yrs (Interior & Exterior Paint)',
    expDefault: '10+ Yrs Experience'
  },
  'Babysitter': {
    timingLabel: 'Day Care / Babysitting Timings *',
    timingPlaceholder: 'e.g. 9 AM - 6 PM (Day Care) / Part-Time',
    timingDefault: 'Day Care (9 AM - 6 PM) / Part-Time',
    rateLabel: 'Monthly Babysitting Charge *',
    ratePlaceholder: 'e.g. ₹4,000/mo (Child Care & Food)',
    rateDefault: '₹4,000/mo (Child Care)',
    locationDefault: 'Ostwal Empire / Boisar West',
    expPlaceholder: 'e.g. 4+ Yrs in Boisar Families',
    expDefault: '4+ Yrs Experience'
  },
  'Deep Clean': {
    timingLabel: 'Booking Availability *',
    timingPlaceholder: 'e.g. Daily 8 AM - 8 PM (Slot Booking)',
    timingDefault: 'Daily On-Demand (Slot Booking)',
    rateLabel: 'Deep Cleaning Package Rate *',
    ratePlaceholder: 'e.g. Starting ₹1,499 (1BHK Deep Clean)',
    rateDefault: 'Starting ₹1,499 (1BHK Deep Clean)',
    locationDefault: 'All Boisar Areas',
    expPlaceholder: 'e.g. 5+ Yrs (Machine & Chemical Clean)',
    expDefault: '5+ Yrs Experience'
  },
  'Pest Control': {
    timingLabel: 'Service Availability *',
    timingPlaceholder: 'e.g. Daily 9 AM - 8 PM',
    timingDefault: 'Daily 9 AM - 8 PM',
    rateLabel: 'Pest Control Starting Rate *',
    ratePlaceholder: 'e.g. Starting ₹799 (Cockroach & Termite 1BHK)',
    rateDefault: 'Starting ₹799 (Odorless Herbal)',
    locationDefault: 'Boisar & Tarapur MIDC',
    expPlaceholder: 'e.g. 6+ Yrs (Certified Safe Chemicals)',
    expDefault: '6+ Yrs Experience'
  },
  'Packers & Movers': {
    timingLabel: 'Shifting Availability *',
    timingPlaceholder: 'e.g. 24x7 All India & Local Shifting',
    timingDefault: '24x7 Available (Local & Outstation)',
    rateLabel: 'Shifting Starting Rate *',
    ratePlaceholder: 'e.g. Starting ₹1,499 (1BHK Local Shifting)',
    rateDefault: 'Starting ₹1,499 (1BHK Shifting + Loading)',
    locationDefault: 'Boisar West & Station',
    expPlaceholder: 'e.g. 8+ Yrs (Safe Packing & Transport)',
    expDefault: '8+ Yrs Experience'
  },
  'Elderly Care': {
    timingLabel: 'Duty Shift / Hours *',
    timingPlaceholder: 'e.g. 12 Hr Shift / 24x7 Patient Care',
    timingDefault: '12 Hr Shift / 24x7 Full-Time',
    rateLabel: 'Monthly Care Charges *',
    ratePlaceholder: 'e.g. ₹12,000/mo (Medicines & Assistance)',
    rateDefault: '₹12,000/mo (Patient & Elder Care)',
    locationDefault: 'Ostwal Empire & Boisar West',
    expPlaceholder: 'e.g. 5+ Yrs (Nursing & Bedridden Care)',
    expDefault: '5+ Yrs Experience'
  },
  'RO Purifier': {
    timingLabel: 'Service Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 8 PM',
    timingDefault: 'Daily 9 AM - 8 PM',
    rateLabel: 'RO Service / Filter Kit Rate *',
    ratePlaceholder: 'e.g. ₹299 Service / Complete Filter Kit ₹1,200',
    rateDefault: '₹299 RO Service / ₹199 Visit',
    locationDefault: 'Boisar West & Pasthal',
    expPlaceholder: 'e.g. 6+ Yrs (Kent, Aquaguard, Pureit)',
    expDefault: '6+ Yrs Experience'
  },
  'Washing Machine & Fridge': {
    timingLabel: 'Repair Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 8 PM',
    timingDefault: 'Daily 9 AM - 8 PM',
    rateLabel: 'Inspection & Visiting Fee *',
    ratePlaceholder: 'e.g. ₹199 Inspection + Parts Warranty',
    rateDefault: '₹199 Inspection Fee',
    locationDefault: 'All Boisar Areas',
    expPlaceholder: 'e.g. 7+ Yrs (LG, Samsung, Whirlpool, IFB)',
    expDefault: '7+ Yrs Experience'
  },
  'CCTV & Security': {
    timingLabel: 'Installation / Service Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 8 PM',
    timingDefault: 'Daily 9 AM - 8 PM',
    rateLabel: 'Installation / Camera Starting Rate *',
    ratePlaceholder: 'e.g. ₹350/camera installation / 4-Cam Setup ₹9,999',
    rateDefault: 'Starting ₹350 / Camera Install',
    locationDefault: 'Tarapur MIDC & Boisar West',
    expPlaceholder: 'e.g. 5+ Yrs (CP Plus, Hikvision, WiFi Cams)',
    expDefault: '5+ Yrs Experience'
  },
  'Solar Panels': {
    timingLabel: 'Consultation & Service Hours *',
    timingPlaceholder: 'e.g. Daily 9 AM - 7 PM',
    timingDefault: 'Daily 9 AM - 7 PM',
    rateLabel: 'Survey / Service Starting Rate *',
    ratePlaceholder: 'e.g. Free On-Site Survey / Inverter Repair ₹299',
    rateDefault: 'Free Site Survey / Inverter Repair ₹299',
    locationDefault: 'Boisar & Industrial Area',
    expPlaceholder: 'e.g. 6+ Yrs (Rooftop & Industrial Solar)',
    expDefault: '6+ Yrs Experience'
  },
  'Tile & Masonry': {
    timingLabel: 'Working Hours *',
    timingPlaceholder: 'e.g. Daily 8 AM - 7 PM',
    timingDefault: 'Daily 8 AM - 7 PM',
    rateLabel: 'Tile Fitting / Daily Mason Rate *',
    ratePlaceholder: 'e.g. ₹18/sq.ft Tile Fitting or ₹800/day Mason',
    rateDefault: '₹18/sq.ft Tile Work / Daily ₹800',
    locationDefault: 'Boisar & Navapur',
    expPlaceholder: 'e.g. 10+ Yrs (Plaster, Tile & Civil Work)',
    expDefault: '10+ Yrs Experience'
  },
  'Auto Mechanic': {
    timingLabel: 'Garage Hours / Breakdown Support *',
    timingPlaceholder: 'e.g. Daily 8 AM - 9 PM / Emergency Breakdown',
    timingDefault: 'Daily 8 AM - 9 PM (Breakdown Support)',
    rateLabel: 'Inspection / Service Starting Charge *',
    ratePlaceholder: 'e.g. Starting ₹199 Breakdown / ₹350 Bike Service',
    rateDefault: 'Starting ₹199 Breakdown / Inspection',
    locationDefault: 'Katkar Pada / Station / MIDC',
    expPlaceholder: 'e.g. 8+ Yrs (2-Wheeler & 4-Wheeler Repair)',
    expDefault: '8+ Yrs Experience'
  }
};

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

// Pre-populated Domestic Helpers in Boisar (Empty for pure live user registrations)
const INITIAL_DOMESTIC_HELPERS: DomesticHelper[] = [];

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  const { isLoggedIn, setLoginModalOpen, showToast, loggedInUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');
  const [showExtendedCategories, setShowExtendedCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHelperModal, setShowHelperModal] = useState(false);

  // Domestic Helper Filter State
  const [helperFilter, setHelperFilter] = useState<string>('All Helpers');
  const [domesticHelpers, setDomesticHelpers] = useState<DomesticHelper[]>([]);

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
  const [helperRole, setHelperRole] = useState<string>('House Maid');
  const [helperTiming, setHelperTiming] = useState('Morning & Evening (Part-Time)');
  const [helperExp, setHelperExp] = useState('4+ Yrs Experience');
  const [helperSalary, setHelperSalary] = useState('₹2,500/mo (Bartan+Jhadu+Pocha)');
  const [helperLocation, setHelperLocation] = useState('Ostwal Empire');
  const [helperPhone, setHelperPhone] = useState('');
  const [helperAllowCalls, setHelperAllowCalls] = useState(true);
  const [helperImage, setHelperImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill phone if logged in
  useEffect(() => {
    if ((showHelperModal || showAddForm) && loggedInUser) {
      if (!helperName) setHelperName(loggedInUser.name || '');
      if (!helperPhone) setHelperPhone(loggedInUser.phone || '');
      if (!formName) setFormName(loggedInUser.name || '');
      if (!formPhone) setFormPhone(loggedInUser.phone || '');
    }
  }, [showHelperModal, showAddForm, loggedInUser]);

  const handleOpenHelperModal = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      showToast('Please login with your mobile number to register as a Service Provider / Helper.', 'info', 4000);
      return;
    }
    setShowHelperModal(true);
  };

  const handleOpenProviderModal = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      showToast('Please login with your mobile number to list your service.', 'info', 4000);
      return;
    }
    setShowAddForm(true);
  };

  // Load custom providers and helpers from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      try {
        const saved = localStorage.getItem('majh_boisar_tech_list');
        const parsed = saved ? JSON.parse(saved) : [];
        setProviders(Array.isArray(parsed) ? parsed : []);

        const savedHelpers = localStorage.getItem('majh_boisar_domestic_helpers');
        if (savedHelpers) {
          const parsedH = JSON.parse(savedHelpers);
          if (Array.isArray(parsedH)) {
            setDomesticHelpers(parsedH);
          }
        }
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
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
      case 'driver':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        );
      case 'cook':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
            <line x1="6" x2="18" y1="17" y2="17" />
          </svg>
        );
      case 'babysitter':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 10h.01" />
            <path d="M15 10h.01" />
            <path d="M10 14c.5.5 1.2.8 2 .8s1.5-.3 2-.8" />
          </svg>
        );
      case 'deepclean':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 4-3 3 6 6 3-3z" />
            <path d="m3 21 8.5-8.5" />
            <path d="M14.5 9.5 8 16" />
            <path d="m18 11 2 2" />
            <path d="m11 4 2 2" />
          </svg>
        );
      case 'elderly':
        return (
          <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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

    const defaultImg = helperRole.includes('Maid') ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Driver') ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Cook') ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Babysitter') ? 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Electrician') ? 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Plumber') ? 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('AC') ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Painter') ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Carpenter') ? 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&auto=format&fit=crop&q=80'
      : helperRole.includes('Movers') ? 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=500&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';

    const finalImage = helperImage.trim() || defaultImg;

    const newHelper: DomesticHelper = {
      id: `helper-${Date.now()}`,
      name: helperName.trim(),
      role: helperRole,
      timing: helperTiming.trim() || 'Available On-Demand',
      experience: helperExp.trim() || '3+ Yrs in Boisar',
      expectedSalary: helperSalary.trim() || 'Starting ₹250 / Call for Rates',
      location: helperLocation.trim() || 'Boisar West',
      phone: helperPhone.trim(),
      allowCalls: helperAllowCalls,
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      image: finalImage
    };

    const newProvider: ServiceProvider = {
      id: `tech-custom-${Date.now()}`,
      name: helperName.trim(),
      category: helperRole,
      experience: helperExp.trim() || '3+ Yrs in Boisar',
      phone: helperPhone.trim(),
      location: helperLocation.trim() || 'Boisar West',
      visitingFee: helperSalary.trim() || '₹199 Inspection / Visit Fee',
      allowCalls: helperAllowCalls,
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      image: finalImage
    };

    const updatedHelpers = [newHelper, ...domesticHelpers];
    setDomesticHelpers(updatedHelpers);

    const updatedProviders = [newProvider, ...providers];
    setProviders(updatedProviders);

    if (typeof window !== 'undefined') {
      const customOnlyH = updatedHelpers.filter(h => h.id.startsWith('helper-'));
      localStorage.setItem('majh_boisar_domestic_helpers', JSON.stringify(customOnlyH));
      localStorage.setItem('majh_boisar_tech_list', JSON.stringify(updatedProviders));
    }

    // Automatically navigate to active category
    setSelectedCategory(helperRole);
    setHelperFilter(helperRole);

    setSuccessMsg('🎉 Profile Registered Successfully!');
    showToast(`🎉 ${helperRole} Profile Registered Live on Majh Boisar!`, 'success');

    setTimeout(() => {
      setSuccessMsg('');
      setShowHelperModal(false);
      setHelperName('');
      setHelperPhone('');
      setHelperImage('');
    }, 1500);
  };

const isMatchingRole = (roleStr: string, catStr: string) => {
  if (!roleStr || !catStr) return false;
  const r = roleStr.toLowerCase().trim();
  const c = catStr.toLowerCase().trim();
  if (r === c) return true;
  if (c.includes('maid') && r.includes('maid')) return true;
  if (c.includes('driver') && r.includes('driver')) return true;
  if (c.includes('cook') && r.includes('cook')) return true;
  if (c.includes('babysitter') && r.includes('babysitter')) return true;
  if (c.includes('deep clean') && r.includes('deep clean')) return true;
  if (c.includes('electric') && r.includes('electric')) return true;
  if (c.includes('plumb') && r.includes('plumb')) return true;
  if (c.includes('ac') && r.includes('ac')) return true;
  if (c.includes('carpenter') && r.includes('carpenter')) return true;
  if (c.includes('painter') && r.includes('painter')) return true;
  if (c.includes('pest') && r.includes('pest')) return true;
  if ((c.includes('mover') || c.includes('tempo') || c.includes('pack')) && (r.includes('mover') || r.includes('tempo') || r.includes('pack'))) return true;
  if (c.includes('elder') && r.includes('elder')) return true;
  if (c.includes('ro') && r.includes('ro')) return true;
  if ((c.includes('washing') || c.includes('fridge') || c.includes('appliance')) && (r.includes('washing') || r.includes('fridge') || r.includes('appliance'))) return true;
  if (c.includes('cctv') && r.includes('cctv')) return true;
  if (c.includes('solar') && r.includes('solar')) return true;
  if ((c.includes('mason') || c.includes('tile')) && (r.includes('mason') || r.includes('tile'))) return true;
  if (c.includes('mechanic') && r.includes('mechanic')) return true;
  return r.includes(c) || c.includes(r);
};

  // Filtered Domestic Helpers
  const filteredDomesticHelpers = useMemo(() => {
    return domesticHelpers.filter(h => {
      // If user selected a specific category, STRICTLY match that category
      if (selectedCategory !== 'All') {
        if (!isMatchingRole(h.role, selectedCategory)) {
          return false;
        }
      } else if (helperFilter !== 'All Helpers') {
        if (!isMatchingRole(h.role, helperFilter)) {
          return false;
        }
      }

      const matchArea = selectedArea === 'All' || h.location?.toLowerCase().includes(selectedArea.toLowerCase());

      const matchSearch = !searchQuery.trim() ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchArea && matchSearch;
    });
  }, [domesticHelpers, helperFilter, selectedCategory, selectedArea, searchQuery]);

  // Filtered providers
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      if (selectedCategory !== 'All') {
        if (!isMatchingRole(p.category, selectedCategory)) {
          return false;
        }
      }

      const matchArea = selectedArea === 'All' || p.location?.toLowerCase().includes(selectedArea.toLowerCase());

      const matchSearch = !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchArea && matchSearch;
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

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold shrink-0">
            <span className="hidden sm:inline">100% Free Direct Connect</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 space-y-4">
        
        {/* 2. Search & Location Bar (Compact Single Line) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-2xs space-y-2.5">
          {/* Unified Compact Bar */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 focus-within:bg-white focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search maids, drivers, electricians, plumbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-medium min-w-0"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 p-0.5 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 mx-1 shrink-0"></div>

            {/* Location Selector (Comprehensive Boisar Regions) */}
            <div className="flex items-center gap-1 shrink-0 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-slate-800 outline-none cursor-pointer pr-1 max-w-[125px] sm:max-w-none truncate"
              >
                <option value="All">📍 All Boisar Region</option>
                {BOISAR_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CATEGORIES: Horizontal Side Scroll on Mobile, Grid on Desktop */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Top Service Categories {showExtendedCategories ? '(All)' : ''}
              </span>
              <div className="flex items-center gap-2">
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setHelperFilter('All Helpers');
                    }}
                    className="text-[10.5px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
                <span className="text-[10px] text-slate-400 font-bold sm:hidden">👉 Swipe</span>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-5 md:grid-cols-9 sm:gap-2.5 sm:overflow-visible sm:pb-0">
              {(showExtendedCategories ? [...SERVICE_CATEGORIES.filter(c => c.id !== 'more'), ...EXTENDED_CATEGORIES] : SERVICE_CATEGORIES).map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'more') {
                        setShowExtendedCategories(!showExtendedCategories);
                      } else {
                        const nextCat = isSelected ? 'All' : cat.name;
                        setSelectedCategory(nextCat);
                        if (['House Maid', 'Car Driver', 'Cook / Chef', 'Babysitter', 'Deep Clean', 'Elderly Care'].includes(nextCat)) {
                          setHelperFilter(nextCat);
                        } else {
                          setHelperFilter('All Helpers');
                        }
                      }
                    }}
                    className={`min-w-[82px] sm:min-w-0 shrink-0 snap-start rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer group active:scale-95 ${
                      isSelected 
                        ? 'bg-teal-50 border-teal-600 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-2xs'
                    }`}
                  >
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl ${cat.iconBg} border ${cat.borderColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      {renderCategoryIcon(cat.iconType, cat.iconColor)}
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-black leading-tight line-clamp-1 ${
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

        {/* ── 4. SPECIFIC RESULTS VIEW (Only shown when user selects a specific category or searches) ── */}
        {selectedCategory !== 'All' ? (
          <div className="space-y-4">
            {/* If domestic helper or matching profile is found for selectedCategory */}
            {filteredDomesticHelpers.length > 0 && (
              <div className="bg-white rounded-3xl border border-pink-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 text-pink-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Available {selectedCategory} Profiles in Boisar
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Verified profiles with background check, timings and direct contact.
                    </p>
                  </div>
                </div>

                {/* Filtered Helpers Cards */}
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
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{helper.name}</h4>
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

                      {/* Contact Actions: Call & WA or WhatsApp Only */}
                      <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                        {helper.allowCalls === false ? (
                          <a
                            href={`https://wa.me/91${helper.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${helper.name}, I found your profile on Majh Boisar. I need a ${helper.role} in Boisar.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-black text-[11px] py-1.5 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp for Booking</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-2">
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
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Local Technicians / Providers (Only shown if providers exist) */}
            {filteredProviders.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {selectedCategory} Technicians &amp; Experts
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">1-Tap direct phone call &amp; WhatsApp with verified professionals</p>
                </div>

                {/* Directory Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredProviders.map((tech) => (
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
                  ))}
                </div>
              </div>
            )}

            {/* Fallback Empty State if category has no profiles yet */}
            {filteredDomesticHelpers.length === 0 && filteredProviders.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-800">
                  No Verified {selectedCategory} Profiles Listed Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first to list your {selectedCategory} profile on Majh Boisar and get direct customer calls with zero commission.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                  <button
                    onClick={() => {
                      setHelperRole(selectedCategory);
                      const preset = ROLE_PRESETS[selectedCategory];
                      if (preset) {
                        setHelperTiming(preset.timingDefault);
                        setHelperSalary(preset.rateDefault);
                        setHelperLocation(preset.locationDefault);
                        setHelperExp(preset.expDefault);
                      }
                      setShowHelperModal(true);
                    }}
                    className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Register as {selectedCategory}</span>
                  </button>
                  <button
                    onClick={() => router.push(`/search?category=${encodeURIComponent(selectedCategory)}`)}
                    className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search Directory</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── 5. DEFAULT LANDING VIEW: POPULAR SERVICES (When no specific category clicked) ── */
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                  Popular Services
                </h2>
                <p className="text-[10.5px] text-slate-500 font-medium truncate">
                  Top-rated local services &amp; upfront rates
                </p>
              </div>
              <span className="text-[10px] sm:text-xs font-black text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                ★ 4.6+ Rating
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {POPULAR_SERVICES.map((service) => (
                <div
                  key={service.id}
                  onClick={() => {
                    if (service.category.includes('Maid')) {
                      setSelectedCategory('House Maid');
                      setHelperFilter('House Maid');
                    } else if (service.category.includes('AC')) {
                      setSelectedCategory('AC Service');
                    } else if (service.category.includes('Plumber')) {
                      setSelectedCategory('Plumbers');
                    } else {
                      setSelectedCategory(service.category);
                    }
                  }}
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
                    <span>View Providers &amp; Rates</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Bottom Banner (Slim & Compact) */}
        <div 
          style={{ background: 'linear-gradient(135deg, #092c24 0%, #0d3d32 50%, #061c17 100%)', color: '#ffffff' }}
          className="rounded-2xl p-3.5 sm:p-4 border border-teal-500/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
        >
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
              Are you a Maid, Cook, Driver or Technician in Boisar?
            </h3>
            <p className="text-[10.5px] text-teal-200">
              List your profile on Majh Boisar and get direct customer calls with zero commission.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenHelperModal}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950" />
            <span>Register Profile</span>
          </button>
        </div>

      </div>

      {/* ── ADD HELPER / MAID PROFILE MODAL (Compact 2-Column Grid) ── */}
      {showHelperModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-3.5 sm:p-5 shadow-2xl relative border border-slate-200 max-h-[88vh] flex flex-col text-left overflow-hidden">
            
            <button
              onClick={() => setShowHelperModal(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-pink-700">
                <HeartHandshake className="w-4 h-4" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">Add Profile / Service in Boisar</h3>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Register as maid, cook, driver, technician, painter, electrician or helper</p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2 text-xs font-black animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleAddHelperSubmit} className="space-y-2 overflow-y-auto pr-1">
                {/* Profile Photo Upload Compact */}
                <div className="bg-pink-50/50 p-2 rounded-xl border border-pink-100 flex items-center gap-2.5">
                  {helperImage ? (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-pink-300 shrink-0">
                      <img src={helperImage} alt="Profile Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setHelperImage('')}
                        className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-black text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-pink-100 border border-pink-200 text-pink-600 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-1 bg-white hover:bg-pink-100 text-pink-700 font-bold text-[10.5px] px-2.5 py-1 rounded-lg cursor-pointer border border-pink-200 transition-colors shadow-2xs">
                      <Camera className="w-3 h-3" />
                      <span>{helperImage ? 'Change Photo' : 'Upload Profile Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const { compressImage } = await import('@/lib/imageCompressor');
                            const compressed = await compressImage(file, 800, 800, 0.85);
                            setHelperImage(compressed);
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setHelperImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[9px] text-slate-400 mt-0.5">Upload photo from gallery (Optional)</p>
                  </div>
                </div>

                {/* 2-Column Inputs Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={helperName}
                      onChange={e => setHelperName(e.target.value)}
                      placeholder="e.g. Sunita Kamble"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Contact Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={helperPhone}
                      onChange={e => setHelperPhone(e.target.value)}
                      placeholder="e.g. 7769947217"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Job Role / Category *</label>
                    <select
                      value={helperRole}
                      onChange={e => {
                        const newRole = e.target.value;
                        setHelperRole(newRole);
                        const preset = ROLE_PRESETS[newRole];
                        if (preset) {
                          setHelperTiming(preset.timingDefault);
                          setHelperSalary(preset.rateDefault);
                          setHelperLocation(preset.locationDefault);
                          setHelperExp(preset.expDefault);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600 cursor-pointer truncate"
                    >
                      <option value="House Maid">🧹 House Maid (कामवाली बाई)</option>
                      <option value="Electricians">⚡ Electricians (इलेक्ट्रीशियन)</option>
                      <option value="Plumbers">🚰 Plumbers (प्लंबर)</option>
                      <option value="AC Service">❄️ AC Service &amp; Repair (एसी)</option>
                      <option value="Cook / Chef">👨‍🍳 Cook / Chef (कुक)</option>
                      <option value="Car Driver">🚗 Car Driver (ड्राइवर)</option>
                      <option value="Carpenters">🪚 Carpenters (कारपेंटर)</option>
                      <option value="Painters">🎨 Painters (पेंटर)</option>
                      <option value="Babysitter">👶 Babysitter (बेबीसिटर)</option>
                      <option value="Deep Clean">✨ Deep Clean (सफाई)</option>
                      <option value="Pest Control">🦟 Pest Control</option>
                      <option value="Packers &amp; Movers">📦 Packers &amp; Movers</option>
                      <option value="Elderly Care">👵 Elderly Care</option>
                      <option value="RO Purifier">💧 RO Water Filter</option>
                      <option value="Washing Machine &amp; Fridge">🧊 Appliance Repair</option>
                      <option value="CCTV &amp; Security">📹 CCTV &amp; Security</option>
                      <option value="Solar Panels">☀️ Solar &amp; Inverter</option>
                      <option value="Tile &amp; Masonry">🧱 Masonry Work</option>
                      <option value="Auto Mechanic">🔧 Auto Mechanic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5 truncate">
                      {(ROLE_PRESETS[helperRole] || ROLE_PRESETS['House Maid']).timingLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={helperTiming}
                      onChange={e => setHelperTiming(e.target.value)}
                      placeholder={(ROLE_PRESETS[helperRole] || ROLE_PRESETS['House Maid']).timingPlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5 truncate">
                      {(ROLE_PRESETS[helperRole] || ROLE_PRESETS['House Maid']).rateLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={helperSalary}
                      onChange={e => setHelperSalary(e.target.value)}
                      placeholder={(ROLE_PRESETS[helperRole] || ROLE_PRESETS['House Maid']).ratePlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Boisar Region *</label>
                    <select
                      value={helperLocation}
                      onChange={e => setHelperLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600 cursor-pointer"
                    >
                      {BOISAR_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Experience</label>
                  <input
                    type="text"
                    value={helperExp}
                    onChange={e => setHelperExp(e.target.value)}
                    placeholder={(ROLE_PRESETS[helperRole] || ROLE_PRESETS['House Maid']).expPlaceholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-pink-600"
                  />
                </div>

                {/* Allow Direct Calls Privacy Choice */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-slate-800 block">Show Direct Call Button?</span>
                    <span className="text-[8.5px] text-slate-500 block">Or allow WhatsApp only for privacy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setHelperAllowCalls(true)}
                      className={`px-2 py-1 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                        helperAllowCalls ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Call &amp; WA
                    </button>
                    <button
                      type="button"
                      onClick={() => setHelperAllowCalls(false)}
                      className={`px-2 py-1 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                        !helperAllowCalls ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      WhatsApp Only
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all cursor-pointer mt-1"
                >
                  Submit &amp; Register Profile
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
