'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { 
  Search, MapPin, Sparkles, Phone, ArrowRight, MessageSquare, 
  PlusCircle, Plus, CheckCircle, Star, Sparkle, X, Send, Eye, ShieldCheck,
  Building, GraduationCap, Scissors, Stethoscope, Utensils, Wrench,
  ChevronRight, Mic, Heart, Key, HardHat, HeartPulse,
  PawPrint, Landmark, Activity, Coins, Truck, Mail, LayoutGrid, ChevronLeft,
  Smartphone, Store, Sprout, Camera, ShoppingBag, Zap, FileText, Droplet, Tv,
  ChevronDown, Users, User, Briefcase, Home, Tag, AlertTriangle, Lock, Car, CreditCard,
  Share2, Calendar, Bath, Bed, Compass, Maximize2, Armchair, Layers
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import AdModal from '@/components/AdModal';
import PostPropertyModal, { BOISAR_PROPERTY_AREAS } from '@/components/PostPropertyModal';
import HomeLoanModal from '@/components/HomeLoanModal';
import LocalMarketplaceModal from '@/components/LocalHub/LocalMarketplaceModal';
import LocalOffersModal from '@/components/LocalHub/LocalOffersModal';
import TempoHelplineModal from '@/components/LocalHub/TempoHelplineModal';
import SportsTurfModal from '@/components/LocalHub/SportsTurfModal';
import HomeTechniciansModal from '@/components/LocalHub/HomeTechniciansModal';
import TravelsModal from '@/components/LocalHub/TravelsModal';
import BusTimetableModal from '@/components/LocalHub/BusTimetableModal';
import BookExchangeModal from '@/components/LocalHub/BookExchangeModal';
import CommunityEventsModal from '@/components/LocalHub/CommunityEventsModal';
import HotelBookingModal from '@/components/LocalHub/HotelBookingModal';
import ResortVillaModal from '@/components/LocalHub/ResortVillaModal';
import ReportModal from '@/components/ReportModal';
import { CATEGORY_CATALOG, getCategorySearchSuggestions } from '@/lib/categoryMapping';

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/** Format price with Indian comma style: ₹3433 → ₹3,433, ₹1500000 → ₹15,00,000 */
const formatPrice = (price: string | number | undefined): string => {
  if (!price) return 'Price on Request';
  const p = String(price).trim();
  if (!p) return 'Price on Request';
  // Extract numeric part
  const match = p.match(/(₹?\s*)(\d+)(.*)/);
  if (!match) return p;
  const prefix = match[1] || '₹';
  const num = match[2];
  const suffix = match[3] || '';
  // Indian number formatting: last 3 digits, then groups of 2
  const formatted = Number(num).toLocaleString('en-IN');
  return `${prefix.includes('₹') ? prefix : '₹' + prefix}${formatted}${suffix}`;
};

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  premium: boolean;
  subscription: string;
  rating: number;
  reviewCount: number;
  image: string;
  workingHours: string;
  location: string;
  views: number;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  recommendations?: Business[];
}

interface AdCampaign {
  id: number;
  title: string;
  description: string;
  image: string;
  businessId: number;
  showTextOverlay?: boolean;
  targetUrl?: string;
}

const rawCategories = [
  "Protein & Supplements", "Gyms & Fitness Centers", "Pathology & Diagnostic Labs", "Salon & Beauty Parlour", "Clothing & Fashion",
  "Photographers & Videographers", "Dance & Music Classes", "Travel Agencies & Tours", "Medical Stores & Pharmacy", "CA & Tax Consultants",
  "Doctors & Specialists", "Baby & Mother Care", "Eye Care & Opticians", "Restaurants & Dining", "Cafes & Bakeries", "Street Food & Snacks",
  "Grocery & Supermarkets", "Dairy & Milk Products", "Meat & Poultry", "Fruits & Vegetables", "Real Estate & Properties",
  "Hotels & Lodging", "Resorts & Villas", "PG & Hostels", "Home Services & Repairs", "Electricians & Wiring",
  "Plumbers & Sanitation", "Carpenters & Furniture", "Painters & Waterproofing", "AC Service & Cooling", "Pest Control Services",
  "Beauty Parlours & Salons", "Spa & Wellness", "Yoga & Martial Arts", "Schools & Colleges", "Coaching & Tuitions",
  "Jewellery & Ornaments", "Footwear & Shoes", "Electronics & Home Appliances", "Mobile Shops & Repair", "Computer & Laptop Services",
  "Hardware & Building Material", "Interior Designers & Decor", "Steel & Aluminium Fabrication", "Automobile Garages & Repair", "Car & Bike Rentals",
  "Packers & Movers", "Event Organisers & Decor", "Catering & Tiffin Services", "Digital Marketing & IT", "Hospitals & Emergency"
];

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

export const DEFAULT_FEATURED_RESTAURANTS: HomeFeaturedRestaurant[] = [
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

import { specialProfiles } from '@/lib/mockProfiles';

export interface PortalSearchPill {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  targetUrl: string;
  actionType: 'url' | 'modal';
  keywords: string[];
}

export const QUICK_PORTAL_PILLS: PortalSearchPill[] = [
  {
    id: 'housemaid',
    title: 'House Maid, Cook & Babysitters',
    subtitle: 'Verified Home Maids, Cooking Bai & Cleaning Helpers',
    icon: '🧹',
    badge: 'Home Services',
    targetUrl: '/services?filter=Maid',
    actionType: 'url',
    keywords: ['maid', 'housemaid', 'cook', 'cooking', 'kamwali', 'bai', 'cleaner', 'cleaning', 'babysitter', 'jhadu', 'bartan', 'home service', 'helper']
  },
  {
    id: 'driver',
    title: 'Driver on Demand & Cab Hire',
    subtitle: 'Local Boisar, Palghar & Outstation Car Drivers',
    icon: '🚗',
    badge: 'Travels Portal',
    targetUrl: '/hire-vehicle',
    actionType: 'url',
    keywords: ['driver', 'chauffeur', 'car driver', 'tempo driver', 'cab', 'taxi', 'travels', 'ride']
  },
  {
    id: 'travels',
    title: 'Travels (Bus, Cab & Tempo Hire)',
    subtitle: 'Daily Bus Timetables, Car & Tempo Rentals',
    icon: '🚌',
    badge: 'City Travels',
    targetUrl: '/hire-vehicle',
    actionType: 'url',
    keywords: ['travel', 'travels', 'bus', 'tempo', 'cab', 'taxi', 'transport', 'vehicle', 'car rental', 'van', 'auto', 'hire vehicle']
  },
  {
    id: 'electrician',
    title: 'Electricians & Home Wiring',
    subtitle: 'Wiring, Switchboard, Light & Fan Repair at Home',
    icon: '⚡',
    badge: 'Home Services',
    targetUrl: '/services?filter=Electrician',
    actionType: 'url',
    keywords: ['electrician', 'bijli', 'wiring', 'switchboard', 'light repair', 'fan repair', 'inverter', 'short circuit']
  },
  {
    id: 'plumber',
    title: 'Plumbers & Leakage Repair',
    subtitle: 'Tap, Pipe Fitting, Bathroom & Water Tank Cleaning',
    icon: '🔧',
    badge: 'Home Services',
    targetUrl: '/services?filter=Plumber',
    actionType: 'url',
    keywords: ['plumber', 'nal', 'pipe', 'leakage', 'bathroom repair', 'tap', 'water tank', 'geyser repair']
  },
  {
    id: 'ac_service',
    title: 'AC Repair & Servicing',
    subtitle: 'AC Wet Cleaning, Gas Refill & Installation',
    icon: '❄️',
    badge: 'Home Services',
    targetUrl: '/services?filter=AC%20Service',
    actionType: 'url',
    keywords: ['ac', 'air conditioner', 'ac repair', 'ac service', 'cooling', 'gas filling', 'ac cleaning']
  },
  {
    id: 'hotel',
    title: 'Hotel Booking in Boisar',
    subtitle: 'Hourly & Nightly Stays near Station & MIDC',
    icon: '🏨',
    badge: 'Stay Portal',
    targetUrl: '/hotels',
    actionType: 'url',
    keywords: ['hotel', 'room', 'stay', 'lodge', 'hourly stay', 'night stay', 'couple friendly', 'hotel booking', 'rooms']
  },
  {
    id: 'resort',
    title: 'Resort & Villa Booking',
    subtitle: 'Weekend Getaways, Pool Villas & Farmhouse Stays',
    icon: '🏖️',
    badge: 'Staycation',
    targetUrl: '/resorts',
    actionType: 'url',
    keywords: ['resort', 'villa', 'pool', 'staycation', 'bungalow', 'farmhouse', 'weekend stay', 'resort booking']
  },
  {
    id: 'jobs',
    title: 'Jobs & Vacancies in Boisar',
    subtitle: 'MIDC Factory, Office, Retail & Sales Vacancies',
    icon: '💼',
    badge: 'Careers',
    targetUrl: '/jobs',
    actionType: 'url',
    keywords: ['job', 'jobs', 'vacancy', 'vacancies', 'naukri', 'work', 'hiring', 'career', 'recruitment', 'factory job', 'office job', 'delivery']
  },
  {
    id: 'creators',
    title: 'Hire an Influencer / Creator',
    subtitle: 'Boisar Instagrammers, Bloggers & Reel Creators',
    icon: '📸',
    badge: 'Influencers',
    targetUrl: '/creators',
    actionType: 'url',
    keywords: ['influencer', 'creator', 'instagram', 'reels', 'blogger', 'model', 'promotion', 'collab', 'creators']
  },
  {
    id: 'marketplace',
    title: 'Used Items Marketplace (Buy & Sell)',
    subtitle: 'Second Hand Mobiles, Bikes, Furniture & Electronics',
    icon: '🛒',
    badge: 'Marketplace',
    targetUrl: 'modal:marketplace',
    actionType: 'modal',
    keywords: ['used', 'second hand', 'purana', 'sell', 'buy', 'olx', 'resell', 'used phone', 'used bike', 'used furniture', 'marketplace']
  },
  {
    id: 'blood_donors',
    title: 'Voluntary Blood Donors & Blood Banks',
    subtitle: 'O+, A+, B+, AB+, O- Voluntary Donors in Boisar',
    icon: '🩸',
    badge: 'Blood Donors',
    targetUrl: '/blood-donation',
    actionType: 'url',
    keywords: ['blood', 'blood donor', 'blood donation', 'raktadan', 'blood bank', 'o+', 'b+', 'a+', 'ab+', 'o-', 'b-', 'blood group', 'donor']
  },
  {
    id: 'emergency_helpline',
    title: '24/7 Emergency Helplines',
    subtitle: 'Police, Fire, Ambulance, Hospitals & ICU',
    icon: '🚨',
    badge: 'Emergency',
    targetUrl: 'modal:emergency',
    actionType: 'modal',
    keywords: ['emergency', 'ambulance', 'hospital emergency', 'police', 'fire', 'icu', 'helpline', 'police station']
  }
];

const subServicesMap: Record<string, string[]> = {
  "Doctors": ["General Physician", "Pediatrician", "Gynaecologist", "Cardiologist", "Orthopedic", "Dermatologist", "ENT Specialist"],
  "Hospitals": ["Emergency 24x7", "ICU", "Maternity", "OPD", "Surgical Ward", "Pediatrics Unit"],
  "Clinics": ["Family Practice", "Dental Clinic", "Ayurvedic Clinic", "Homeopathy Clinic", "Polyclinic"],
  "Dentists": ["Teeth Cleaning", "Root Canal Treatment", "Dental Implants", "Braces & Aligners", "Teeth Whitening"],
  "Diagnostic Labs": ["Blood Test", "X-Ray", "MRI Scan", "CT Scan", "Sonography", "Urine Test"],
  "Medical Stores": ["Prescription Meds", "OTC Medicines", "Baby Care", "Surgical Items", "Cosmetics & Wellness"],
  "Plumbers": ["Leak Repair", "Drain Cleaning", "Tap & Shower Repair", "Pipe Fitting", "Water Tank Cleaning", "Geyser Installation"],
  "Electricians": ["Wiring & Cabling", "Switchboard Install", "Fan & Light Repair", "Inverter Setup", "Short Circuit Fix"],
  "Carpenters": ["Furniture Repair", "Door & Window Install", "Modular Kitchen Woodwork", "Sofa Repair", "Lock Installation"],
  "Painters": ["Wall Painting", "Texture Painting", "Waterproofing", "Exterior Painting", "Wood Polish"],
  "House Cleaning": ["Deep Home Cleaning", "Bathroom Cleaning", "Kitchen Cleaning", "Sofa & Carpet Dry Clean", "Water Tank Clean"],
  "Pest Control": ["Bed Bugs Control", "Termite Treatment", "Cockroach Control", "Mosquito Control", "Rodent Control"],
  "AC Service": ["AC Wet Service", "Gas Charging", "AC Installation", "AC Compressor Repair", "Leakage Repair"],
  "RO Service": ["RO Filter Change", "RO Installation", "Water Purifier Repair", "TDS Adjustment", "Annual Maintenance Contract"],
  "CCTV Installation": ["CCTV Camera Setup", "DVR Configuration", "IP Camera Setup", "Security Systems Service", "Bio-metric Systems"],
  "Interior Designers": ["Residential Interior", "Office Interior", "Modular Kitchen Design", "3D Elevation Layout", "False Ceiling Design"],
  "Architects": ["House Plan Layout", "Structural Design", "Building Permission Drawings", "Landscape Design", "Liasoning Services"],
  "Steel Fabricators": ["SS Railing & Grills", "Metal Gates", "Steel Sheds", "Window Safety Grills", "Laser Cutting Works"],
  "Restaurants": ["North Indian", "South Indian", "Chinese", "Mughlai", "Fast Food", "Biryani & Kababs", "Tandoori Items"],
  "Cafes": ["Cold Coffee", "Espresso & Cappuccino", "Burgers & Sandwiches", "Pizza & Pasta", "Shakes & Mocktails", "Desserts"],
  "Bakery": ["Cakes & Pastries", "Breads & Pav", "Cookies & Biscuits", "Cream Rolls", "Puffs & Samosas"],
  "Tiffin Services": ["Home Cooked Veg Tiffin", "Non-Veg Tiffin", "Monthly Mess", "Office Lunch Box", "Healthy Diet Meals"],
  "Catering Services": ["Wedding Catering", "Birthday Catering", "Corporate Events Catering", "Buffet System", "Live Counters"],
  "Banquet Halls": ["Marriage Reception", "Engagement Party", "Birthday Party", "Corporate Meetings", "Air Conditioned Halls"],
  "Hotels": ["AC Rooms", "Non-AC Rooms", "Suite Rooms", "24 Hours Room Service", "Conference Hall", "In-house Restaurant"],
  "Travel Agencies": ["Flight Ticket Booking", "Railway Reservation", "Domestic Tour Packages", "International Tours", "Passport & Visa Services"],
  "Car Rentals": ["Self-Drive Cars", "Chauffeur Driven Cars", "Outstation Taxi", "Airport Pickup & Drop", "Wedding Cars"],
  "Packers & Movers": ["Household Shifting", "Office Relocation", "Car Transport", "Local Loading & Unloading", "Storage & Warehousing"],
  "Courier Services": ["Express Delivery", "International Courier", "Document Shipping", "E-commerce Logistics", "Cargo Services"],
  "Driving Schools": ["Four Wheeler Training", "Two Wheeler Training", "License Assistance", "RTO Documentation", "Refresher Courses"],
  "Car Garage": ["Engine Tuning", "Dent & Paint repair", "Suspension Repair", "Clutch & Brake Overhaul", "Car Washing"],
  "Bike Garage": ["General Bike Service", "Engine Work", "Chain Sprocket Change", "Clutch Plate Replacement", "Bike Washing"],
  "Mobile Repair": ["Screen Replacement", "Battery Change", "Charging Port Fix", "Motherboard Repair", "Software Flashing"],
  "Laptop Repair": ["OS Installation", "Keyboard Replacement", "Screen Repair", "RAM & SSD Upgrade", "Motherboard Repair"],
  "Computer Repair": ["Desktop PC Assembling", "Virus Removal", "SMPS Replacement", "Data Recovery", "Printer Setup"],
  "Electronics Shops": ["Smart TVs", "Refrigerators", "Washing Machines", "Air Conditioners", "Microwaves", "Home Theatres"],
  "Appliance Repair": ["Washing Machine Repair", "Refrigerator Repair", "Microwave Service", "Water Heater Repair", "Mixer Grinder Fix"],
  "Jewellery Shops": ["Gold Ornaments", "Silver Jewellery", "Diamond Ring/Necklace", "Platinum Bands", "Gold/Silver Coins"],
  "Sports Shops": ["Cricket Bats & Balls", "Badminton Rackets", "Fitness Equipment", "Sports Shoes & Clothing", "Indoor Games Board"],
  "Book Stores": ["School & College Textbooks", "Competitive Exam Guides", "Novels & Fiction", "Children Books", "General Knowledge"],
  "Garment Showrooms": ["Mens Suits & Shirts", "Sarees & Lehengas", "Kurtis & Salwar Suits", "Kids Wear", "Western Wear", "Denims & Jeans"],
  "Mens Wear": ["Casual Shirts & Tshirts", "Formal Trousers", "Jeans & Chinos", "Ethnic Kurta Pyjamas", "Activewear"],
  "Ladies Wear": ["Designer Sarees", "Salwar Suits", "Fancy Kurtas", "Western Tops & Jeans", "Lingerie & Nightwear"],
  "Kids Wear": ["Frocks & Party Dresses", "Boy Suits & Tshirts", "Infant Clothes", "School Uniforms", "Baby Accessories"],
  "Footwear Stores": ["Sports Shoes", "Formal Leather Shoes", "Casual Sneakers", "Slippers & Sandals", "Ladies Heels & Flats"],
  "Furniture Dealers": ["Wooden Beds", "Sofa Sets", "Dining Tables", "Wardrobes & Almirahs", "Office Chairs & Desks"],
  "Modular Kitchen": ["L-Shape Kitchen", "U-Shape Kitchen", "Straight Layout Kitchen", "Trolleys & Baskets", "Chimney & Hobs"],
  "CA": ["Income Tax Filing", "GST Return Audit", "Company Incorporation", "Accounting & Bookkeeping", "TDS Filing"],
  "GST Consultant": ["GST Registration", "Monthly GST Return", "GST Audit & Appeal", "E-way Bill Generation"],
  "Lawyers": ["Civil Cases", "Criminal Cases", "Family & Divorce Court", "Property Disputes", "Agreement & Notary Works"],
  "Real Estate Agents": ["Flat for Sale", "Flat on Rent", "Commercial Shops for Sale", "Industrial Land/Plots", "1 BHK / 2 BHK Booking"],
  "PG": ["Boys PG", "Girls PG", "Single Occupancy Room", "Double Sharing Room", "PG with Food"],
  "Hostels": ["Student Hostel", "Working Mens Hostel", "Working Ladies Hostel", "AC Hostels", "Wifi Enabled Hostels"],
  "Schools": ["State Board School", "CBSE Board School", "ICSE School", "Primary & Nursery School", "High School"],
  "Colleges": ["Science College", "Commerce College", "Arts College", "Engineering College", "Diploma College"],
  "Coaching Classes": ["Class 8th to 10th Tuitions", "Class 11th & 12th Sci/Com", "JEE / NEET Coaching", "MPSC/UPSC Prep", "English Speaking"],
  "Tuition Classes": ["Home Tuitions", "Primary School Coaching", "Secondary School Coaching", "Personal Tutor"],
  "Beauty Parlours": ["Facial & Bleach", "Hair Cut & Styling", "Waxing & Threading", "Manicure & Pedicure", "Bridal Makeup Package"],
  "Hair Salons": ["Mens Haircut", "Hair Spa & Treatment", "Shaving & Styling", "Hair Coloring", "Face Massage"],
  "Spa": ["Body Massage", "Aromatherapy", "Foot Reflexology", "Thai Massage", "Ayurvedic Spa"],
  "Mehendi Artists": ["Bridal Mehendi", "Arabic Mehendi", "Traditional Rajasthani Mehendi", "Baby Shower Mehendi"],
  "Photographers": ["Wedding Photography", "Pre-Wedding Shoot", "Maternity Shoot", "Baby Photography", "Product Photography"],
  "Videographers": ["Wedding Cinematic Video", "Event Video Recording", "Teaser & Reels Shoot", "Drone Videography"],
  "Dry Cleaners": ["Saree Dry Cleaning", "Suit/Blazer Dry Cleaning", "Blanket Dry Cleaning", "Curtain Cleaning", "Steam Ironing"],
  "Water Purifier Dealers": ["RO Purifier Sale", "UV Water Purifiers", "Water Purifier Service", "Filters & Spares replacement"],
  "Digital Marketing": ["SEO Optimization", "Social Media Marketing", "Google & Facebook Ads", "Website & App Development", "Branding & Logo Design", "Lead Generation"],
  "Fabrication": ["Steel Fabrication", "Aluminium Window & Grill", "Metal Sheds & Roofs", "SS Railing Work", "Structural Metal Work", "Laser Cutting Works"],
  "Washing": ["Car & Bike Wash", "Washing Machine Repair", "Laundry & Clothes Washing", "Dry Cleaning & Press", "Sofa & Carpet Wash"],
  "Jewellery": ["Gold Ornaments", "Silver Jewellery", "Diamond Ring & Necklace", "Platinum Jewelry", "Custom Hallmark Gold", "Jewellery Repair & Polish"]
};

function getCategoryIcon(name: string) {
  const lowercase = name.toLowerCase();
  
  if (lowercase.includes('influencer') || lowercase.includes('creator') || lowercase.includes('blogger')) {
    return <Users className="w-5 h-5 text-indigo-600" />;
  }
  if (lowercase.includes('doctor') || lowercase.includes('dentist') || lowercase.includes('physio') || lowercase.includes('skin clinic') || lowercase.includes('eye hospital')) {
    return <Stethoscope className="w-5 h-5 text-teal-600" />;
  }
  if (lowercase.includes('hospital') || lowercase.includes('clinic') || lowercase.includes('medical') || lowercase.includes('lab') || lowercase.includes('diagnostic')) {
    return <HeartPulse className="w-5 h-5 text-rose-600" />;
  }
  if (lowercase.includes('plumber') || lowercase.includes('carpenter') || lowercase.includes('repair') || lowercase.includes('garage') || lowercase.includes('spare') || lowercase.includes('service') || lowercase.includes('locksmith')) {
    return <Wrench className="w-5 h-5 text-sky-600" />;
  }
  if (lowercase.includes('electrician') || lowercase.includes('electrical') || lowercase.includes('battery') || lowercase.includes('solar') || lowercase.includes('generator')) {
    return <Zap className="w-5 h-5 text-amber-500" />;
  }
  if (lowercase.includes('restaurant') || lowercase.includes('cafe') || lowercase.includes('food') || lowercase.includes('pizza') || lowercase.includes('burger') || lowercase.includes('sweet') || lowercase.includes('tiffin') || lowercase.includes('catering') || lowercase.includes('bakery') || lowercase.includes('cake') || lowercase.includes('ice cream') || lowercase.includes('tea') || lowercase.includes('juice') || lowercase.includes('kitchen')) {
    return <Utensils className="w-5 h-5 text-red-500" />;
  }
  if (lowercase.includes('school') || lowercase.includes('college') || lowercase.includes('coaching') || lowercase.includes('tuition') || lowercase.includes('class') || lowercase.includes('institute') || lowercase.includes('academy') || lowercase.includes('library')) {
    return <GraduationCap className="w-5 h-5 text-indigo-600" />;
  }
  if (lowercase.includes('beauty') || lowercase.includes('parlour') || lowercase.includes('salon') || lowercase.includes('spa') || lowercase.includes('massage') || lowercase.includes('makeup') || lowercase.includes('mehendi') || lowercase.includes('tattoo')) {
    return <Scissors className="w-5 h-5 text-pink-600" />;
  }
  if (lowercase.includes('hotel') || lowercase.includes('resort') || lowercase.includes('pg') || lowercase.includes('hostel') || lowercase.includes('building') || lowercase.includes('builder') || lowercase.includes('developer') || lowercase.includes('interior') || lowercase.includes('architect')) {
    return <Building className="w-5 h-5 text-teal-700" />;
  }
  if (lowercase.includes('real estate') || lowercase.includes('property') || lowercase.includes('bank') || lowercase.includes('atm') || lowercase.includes('loan') || lowercase.includes('tax') || lowercase.includes('gst') || lowercase.includes('ca') || lowercase.includes('insurance') || lowercase.includes('lawyer')) {
    return <Landmark className="w-5 h-5 text-cyan-600" />;
  }
  if (lowercase.includes('travel') || lowercase.includes('rental') || lowercase.includes('taxi') || lowercase.includes('packers') || lowercase.includes('courier') || lowercase.includes('truck') || lowercase.includes('garage') || lowercase.includes('petrol') || lowercase.includes('ev charge')) {
    return <Truck className="w-5 h-5 text-orange-600" />;
  }
  if (lowercase.includes('grocery') || lowercase.includes('shop') || lowercase.includes('store') || lowercase.includes('supermarket') || lowercase.includes('dairy') || lowercase.includes('chakki') || lowercase.includes('mill') || lowercase.includes('dealer')) {
    return <Store className="w-5 h-5 text-emerald-600" />;
  }
  if (lowercase.includes('mobile') || lowercase.includes('laptop') || lowercase.includes('computer') || lowercase.includes('printer') || lowercase.includes('electronic') || lowercase.includes('appliance') || lowercase.includes('tv') || lowercase.includes('cctv')) {
    return <Smartphone className="w-5 h-5 text-rose-500" />;
  }
  if (lowercase.includes('pet') || lowercase.includes('aquarium') || lowercase.includes('veterinary')) {
    return <PawPrint className="w-5 h-5 text-green-600" />;
  }
  if (lowercase.includes('jewel') || lowercase.includes('gift') || lowercase.includes('toy') || lowercase.includes('sports') || lowercase.includes('book') || lowercase.includes('stationery') || lowercase.includes('flower') || lowercase.includes('wear') || lowercase.includes('garment') || lowercase.includes('footwear') || lowercase.includes('cosmetic') || lowercase.includes('perfume') || lowercase.includes('furniture') || lowercase.includes('mattress') || lowercase.includes('bag')) {
    return <ShoppingBag className="w-5 h-5 text-pink-500" />;
  }
  if (lowercase.includes('sprout') || lowercase.includes('seed') || lowercase.includes('fertilizer') || lowercase.includes('pesticide') || lowercase.includes('tractor') || lowercase.includes('feed')) {
    return <Sprout className="w-5 h-5 text-emerald-700" />;
  }
  if (lowercase.includes('print') || lowercase.includes('design') || lowercase.includes('marketing') || lowercase.includes('seo') || lowercase.includes('cyber') || lowercase.includes('xerox') || lowercase.includes('photocopy')) {
    return <FileText className="w-5 h-5 text-slate-700" />;
  }
  return <LayoutGrid className="w-5 h-5 text-teal-600" />;
}

function getCategoryBgClass(name: string) {
  const lowercase = name.toLowerCase();
  if (lowercase.includes('influencer') || lowercase.includes('creator') || lowercase.includes('blogger')) {
    return 'bg-indigo-100/70 border-indigo-200/60 text-indigo-700';
  }
  if (lowercase.includes('doctor') || lowercase.includes('dentist') || lowercase.includes('physio') || lowercase.includes('skin') || lowercase.includes('eye')) {
    return 'bg-teal-100/70 border-teal-200/60 text-teal-700';
  }
  if (lowercase.includes('hospital') || lowercase.includes('clinic') || lowercase.includes('medical') || lowercase.includes('lab') || lowercase.includes('diagnostic')) {
    return 'bg-rose-100/70 border-rose-200/60 text-rose-700';
  }
  if (lowercase.includes('plumber') || lowercase.includes('carpenter') || lowercase.includes('repair') || lowercase.includes('garage') || lowercase.includes('spare') || lowercase.includes('service')) {
    return 'bg-sky-100/70 border-sky-200/60 text-sky-700';
  }
  if (lowercase.includes('electrician') || lowercase.includes('electrical') || lowercase.includes('battery') || lowercase.includes('solar') || lowercase.includes('generator')) {
    return 'bg-amber-100/70 border-amber-200/60 text-amber-700';
  }
  if (lowercase.includes('restaurant') || lowercase.includes('cafe') || lowercase.includes('food') || lowercase.includes('pizza') || lowercase.includes('burger') || lowercase.includes('sweet') || lowercase.includes('tiffin') || lowercase.includes('catering') || lowercase.includes('bakery') || lowercase.includes('cake') || lowercase.includes('ice cream') || lowercase.includes('tea') || lowercase.includes('juice') || lowercase.includes('kitchen')) {
    return 'bg-orange-100/70 border-orange-200/60 text-orange-700';
  }
  if (lowercase.includes('school') || lowercase.includes('college') || lowercase.includes('coaching') || lowercase.includes('tuition') || lowercase.includes('class') || lowercase.includes('institute') || lowercase.includes('academy') || lowercase.includes('library')) {
    return 'bg-purple-100/70 border-purple-200/60 text-purple-700';
  }
  if (lowercase.includes('beauty') || lowercase.includes('parlour') || lowercase.includes('salon') || lowercase.includes('spa') || lowercase.includes('massage') || lowercase.includes('makeup') || lowercase.includes('mehendi') || lowercase.includes('tattoo')) {
    return 'bg-pink-100/70 border-pink-200/60 text-pink-700';
  }
  if (lowercase.includes('real estate') || lowercase.includes('property') || lowercase.includes('bank') || lowercase.includes('atm') || lowercase.includes('loan') || lowercase.includes('ca') || lowercase.includes('gst') || lowercase.includes('lawyer')) {
    return 'bg-cyan-100/70 border-cyan-200/60 text-cyan-700';
  }
  if (lowercase.includes('travel') || lowercase.includes('transport') || lowercase.includes('rental') || lowercase.includes('taxi') || lowercase.includes('truck') || lowercase.includes('courier')) {
    return 'bg-amber-100/70 border-amber-200/60 text-amber-700';
  }
  if (lowercase.includes('grocery') || lowercase.includes('shop') || lowercase.includes('store') || lowercase.includes('supermarket') || lowercase.includes('dairy')) {
    return 'bg-emerald-100/70 border-emerald-200/60 text-emerald-700';
  }
  if (lowercase.includes('jewel') || lowercase.includes('garment') || lowercase.includes('wear') || lowercase.includes('cloth') || lowercase.includes('shopping')) {
    return 'bg-fuchsia-100/70 border-fuchsia-200/60 text-fuchsia-700';
  }
  return 'bg-slate-100/80 border-slate-200/60 text-slate-700';
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "Protein & Supplements": "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=360&q=80",
  "Gyms & Fitness Centers": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=260&q=80",
  "Pathology & Diagnostic Labs": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=260&q=80",
  "Salon & Beauty Parlour": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=260&q=80",
  "Medical Stores & Pharmacy": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=260&q=80",
  "Doctors & Specialists": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=260&q=80",
  "Hospitals & Emergency": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=260&q=80",
  "Baby & Mother Care": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=260&q=80",
  "Eye Care & Opticians": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=260&q=80",
  "Restaurants & Dining": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=260&q=80",
  "Cafes & Bakeries": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=260&q=80",
  "Street Food & Snacks": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=260&q=80",
  "Dentists & Dental Clinics": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=260&q=80",
  "Grocery & Supermarkets": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=260&q=80",
  "Dairy & Milk Products": "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=260&q=80",
  "Meat & Poultry": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=260&q=80",
  "Fruits & Vegetables": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=260&q=80",
  "Real Estate & Properties": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=260&q=80",
  "Hotels & Lodging": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=260&q=80",
  "Resorts & Villas": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=260&q=80",
  "PG & Hostels": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=260&q=80",
  "Home Services & Repairs": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=260&q=80",
  "Electricians & Wiring": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=260&q=80",
  "Plumbers & Sanitation": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=260&q=80",
  "Carpenters & Furniture": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=260&q=80",
  "Painters & Waterproofing": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=260&q=80",
  "AC Service & Cooling": "https://images.unsplash.com/photo-1614633833026-06204c66e2c3?auto=format&fit=crop&w=260&q=80",
  "Pest Control Services": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=260&q=80",
  "Beauty Parlours & Salons": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=260&q=80",
  "Spa & Wellness": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=260&q=80",
  "Gyms & Fitness": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=260&q=80",
  "Yoga & Martial Arts": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=260&q=80",
  "Schools & Colleges": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=260&q=80",
  "Dance & Music Classes": "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=360&q=80",
  "Dance Classes & Music": "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=360&q=80",
  "Dance Classes": "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=360&q=80",
  "Music & Dance Classes": "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=360&q=80",
  "Jewellery & Ornaments": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=260&q=80",
  "Clothing & Fashion": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=260&q=80",
  "Footwear & Shoes": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=260&q=80",
  "Electronics & Home Appliances": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=260&q=80",
  "Mobile Shops & Repair": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=260&q=80",
  "Computer & Laptop Services": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=260&q=80",
  "Hardware & Building Material": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=260&q=80",
  "Interior Designers & Decor": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=260&q=80",
  "Steel & Aluminium Fabrication": "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=260&q=80",
  "Automobile Garages & Repair": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=260&q=80",
  "Car & Bike Rentals": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=260&q=80",
  "Travel Agencies & Tours": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=260&q=80",
  "Packers & Movers": "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=260&q=80",
  "Event Organisers & Decor": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=260&q=80",
  "Photographers & Videographers": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=260&q=80",
  "Catering & Tiffin Services": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=260&q=80",
  "Digital Marketing & IT": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=260&q=80",
  "CA & Tax Consultants": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=260&q=80",
  "Lawyers & Legal Advisors": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=260&q=80",
  "Pet Shops & Vet Clinics": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=260&q=80"
};

function getCategoryImage(name: string): string {
  if (CATEGORY_IMAGE_MAP[name]) {
    return CATEGORY_IMAGE_MAP[name];
  }
  const lowercase = name.toLowerCase();
  for (const [catName, imgUrl] of Object.entries(CATEGORY_IMAGE_MAP)) {
    const words = catName.toLowerCase().split(/[ &]+/);
    if (words.some(w => w.length > 3 && lowercase.includes(w))) {
      return imgUrl;
    }
  }
  return "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=260&q=80";
}

const BOISAR_ICONIC_PLACES = [
  {
    id: 'chinchani-beach',
    name: 'Chinchani, Boisar',
    category: 'Beach & Sunset',
    distance: '15 mins from Boisar',
    travelTime: '12 km • ~20 mins',
    image: '/places/chinchani-beach.jpg',
    description: 'Serene black-sand coastline famous for mesmerizing Arabian Sea sunsets, local street food & family beach outings.',
    highlights: ['Breathtaking Sunsets', 'Beach Snacks & Coconut Water', 'Horse Cart & ATV Rides', 'Peaceful Shoreline'],
    mapQuery: 'Chinchani Beach Boisar Maharashtra',
  },
  {
    id: 'kelve-beach',
    name: 'Kelve Beach, Palghar',
    category: 'Sea Coast & Fort',
    distance: '25 mins from Boisar',
    travelTime: '22 km • ~35 mins',
    image: '/places/kelve-beach.jpg',
    description: 'One of the longest beaches in Palghar district with fragrant Suru pine tree forests and an ancient Portuguese water fort.',
    highlights: ['Historic Kelve Fort', 'Dense Casuarina (Suru) Grove', 'Water Sports & Camel Rides', 'Beachside Resorts'],
    mapQuery: 'Kelve Beach Palghar Maharashtra',
  },
  {
    id: 'shirgaon-fort',
    name: 'Shirgaon Fort, Boisar',
    category: 'Historic Sea Fort',
    distance: '18 mins from Boisar',
    travelTime: '14 km • ~25 mins',
    image: '/places/shirgaon-fort.jpg',
    description: 'Well-preserved 16th-century Maratha stone fortress perched beside palm-fringed coast with commanding panoramic ocean views.',
    highlights: ['Chhatrapati Shivaji Maharaj Era Fort', 'Ocean View Bastions', 'Quiet Coastal Beach', 'Photography Hotspot'],
    mapQuery: 'Shirgaon Fort Palghar Maharashtra',
  },
  {
    id: 'tarapur-fort',
    name: 'Tarapur Fort & Light',
    category: 'Lighthouse & History',
    distance: '12 mins from Boisar',
    travelTime: '10 km • ~15 mins',
    image: '/places/tarapur-fort.jpg',
    description: 'Ancient 13th-century coastal fortress near Tarapur harbour and the historic lighthouse guiding maritime vessels.',
    highlights: ['13th-Century Heritage Ramparts', 'Coastal Lighthouse Views', 'Fishing Village Culture', 'Fresh Sea Breeze'],
    mapQuery: 'Tarapur Fort Boisar Maharashtra',
  },
  {
    id: 'dahanu-beach',
    name: 'Dahanu Coast, Dahanu',
    category: 'Chikoo & Beach',
    distance: '30 mins from Boisar',
    travelTime: '28 km • ~40 mins',
    image: '/places/dahanu-beach.jpg',
    description: 'Sprawling clean beach lined with world-famous lush Chikoo (sapodilla) orchards, Parsi heritage villas, and tranquil shores.',
    highlights: ['Chikoo Orchards', 'Bordi Coastal Drive', 'Parsi Heritage Cuisine', 'Tranquil Clean Water'],
    mapQuery: 'Dahanu Beach Maharashtra',
  },
  {
    id: 'asava-fort',
    name: 'Asava Fort Trek, Manor',
    category: 'Nature & Trekking',
    distance: '25 mins from Boisar',
    travelTime: '20 km • ~30 mins',
    image: '/places/asava-fort.jpg',
    description: 'Scenic hill fort trek offering breathtaking 360-degree vistas of the green Sahyadri ranges and Surya River valley.',
    highlights: ['Beginner Friendly Trek', 'Ancient Water Cisterns', 'Lush Green Vistas', 'Monsoon Cloud Walks'],
    mapQuery: 'Asava Fort Palghar Maharashtra',
  },
  {
    id: 'vandri-lake',
    name: 'Vandri Lake, Palghar',
    category: 'Lake & Camping',
    distance: '35 mins from Boisar',
    travelTime: '30 km • ~45 mins',
    image: '/places/vandri-lake.jpg',
    description: 'Serene freshwater reservoir nested amidst green hills, popular for weekend camping, stargazing, and nature picnics.',
    highlights: ['Lakeside Camping', 'Misty Morning Views', 'Peaceful Picnic Spots', 'Birdwatching'],
    mapQuery: 'Vandri Lake Palghar Maharashtra',
  },
  {
    id: 'mahalaxmi-temple',
    name: 'Mahalaxmi Temple, Dahanu',
    category: 'Pilgrimage Shrine',
    distance: '40 mins from Boisar',
    travelTime: '35 km • ~50 mins',
    image: '/places/mahalaxmi-temple.jpg',
    description: 'Sacred ancient shrine of Goddess Mahalaxmi situated along the highway, visited by thousands of pilgrims every week.',
    highlights: ['Ancient Sacred Shrine', 'Hilltop Temple Setting', 'Temple Prasad & Bazaar', 'Spiritual Atmosphere'],
    mapQuery: 'Mahalaxmi Temple Charoti Dahanu Maharashtra',
  }
];

export default function HomeClient({ initialSpecialCategory }: { initialSpecialCategory?: 'influencers' | 'properties' | 'helpers' | 'caterers' | null } = {}) {
  const { userName, currentRole, isLoggedIn, loggedInUser, loginModalOpen, setLoginModalOpen, adModalOpen, setAdModalOpen, showToast } = useApp();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [fullImagePreview, setFullImagePreview] = useState<string | null>(null);
  const [enquiryModalProperty, setEnquiryModalProperty] = useState<any>(null);
  const [enquirySenderName, setEnquirySenderName] = useState('');
  const [enquirySenderPhone, setEnquirySenderPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('Hi, I am interested in this property. Please share details.');
  const [viewEnquiriesModalOpen, setViewEnquiriesModalOpen] = useState(false);
  const [neighbourhoodTab, setNeighbourhoodTab] = useState<'transit' | 'essentials' | 'utility'>('transit');

  // Buyer Direct Call Pass states
  const [buyerCallCredits, setBuyerCallCredits] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_buyer_credits');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // User phone key for isolated quota tracking
  const userPhoneKey = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : 'guest';

  // Get unlocked property list for current user
  const getUserUnlockedProps = (): string[] => {
    if (typeof window === 'undefined' || !isLoggedIn) return [];
    try {
      const saved = localStorage.getItem(`majh_boisar_unlocked_props_${userPhoneKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [userUnlockedPropsState, setUserUnlockedPropsState] = useState<string[]>([]);
  const [activeHomeTab, setActiveHomeTab] = useState<'foryou' | 'loans' | 'insurance' | 'events' | 'store'>('foryou');

  const digitalMarketingRef = useRef<HTMLDivElement>(null);
  const scrollDigitalLeft = () => {
    digitalMarketingRef.current?.scrollBy({ left: -(digitalMarketingRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };
  const scrollDigitalRight = () => {
    digitalMarketingRef.current?.scrollBy({ left: (digitalMarketingRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };

  const loansRef = useRef<HTMLDivElement>(null);
  const scrollLoansLeft = () => {
    loansRef.current?.scrollBy({ left: -(loansRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };
  const scrollLoansRight = () => {
    loansRef.current?.scrollBy({ left: (loansRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };

  const insuranceRef = useRef<HTMLDivElement>(null);
  const scrollInsuranceLeft = () => {
    insuranceRef.current?.scrollBy({ left: -(insuranceRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };
  const scrollInsuranceRight = () => {
    insuranceRef.current?.scrollBy({ left: (insuranceRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };

  const storeRef = useRef<HTMLDivElement>(null);
  const scrollStoreLeft = () => {
    storeRef.current?.scrollBy({ left: -(storeRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };
  const scrollStoreRight = () => {
    storeRef.current?.scrollBy({ left: (storeRef.current?.offsetWidth || 340), behavior: 'smooth' });
  };

  const iconicScrollRef = useRef<HTMLDivElement>(null);
  const scrollIconicLeft = () => {
    iconicScrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' });
  };
  const scrollIconicRight = () => {
    iconicScrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' });
  };
  const [selectedIconicPlace, setSelectedIconicPlace] = useState<typeof BOISAR_ICONIC_PLACES[0] | null>(null);
  const [selectedUtilityService, setSelectedUtilityService] = useState<string | null>(null);

  useEffect(() => {
    setUserUnlockedPropsState(getUserUnlockedProps());
  }, [isLoggedIn, userPhoneKey]);

  // Check if owner has VIP Builder & Developer Plan (₹4,999)
  const isVipBuilder = (profile: any) => {
    if (!profile) return false;
    if (profile.isVipBuilder || profile.isBuilderVIP || profile.planId === 'BuilderVIP_4999') return true;
    const ownerPhone = (profile.contactPhone || profile.phone || '').replace(/\D/g, '');
    if (!ownerPhone) return false;

    if (typeof window !== 'undefined') {
      try {
        const rawSubs = localStorage.getItem('majh_boisar_property_subscriptions');
        if (rawSubs) {
          const subs = JSON.parse(rawSubs);
          if (Array.isArray(subs)) {
            const found = subs.find((s: any) => (s.phone || '').replace(/\D/g, '') === ownerPhone && s.planId === 'BuilderVIP_4999');
            if (found) {
              const days = found.expiryDate ? Math.ceil((new Date(found.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
              if (days > 0) return true;
            }
          }
        }
        const legacyPlan = localStorage.getItem(`majh_boisar_property_plan_${ownerPhone}`);
        if (legacyPlan === 'BuilderVIP_4999') return true;
      } catch (e) {}
    }
    return false;
  };

  // Check assigned or plan VIP Badge: 'VIP Broker' | 'VIP Owner' | 'VIP Developer' | null
  const getPropertyVipBadge = (profile: any): 'VIP Broker' | 'VIP Owner' | 'VIP Developer' | null => {
    if (!profile) return null;
    // 1. Explicit assigned badge on profile or in local lookup
    if (profile.vipBadge) return profile.vipBadge as any;
    if (typeof window !== 'undefined') {
      try {
        const badgesLookup = JSON.parse(localStorage.getItem('majh_boisar_property_vip_badges') || '{}');
        if (badgesLookup[String(profile.id)]) return badgesLookup[String(profile.id)];
      } catch (e) {}
    }
    // 2. Fallback to subscriber plan
    if (isVipBuilder(profile)) return 'VIP Developer';
    return null;
  };

  // Check if this property has direct free owner calls enabled via owner's active paid subscription plan or VIP badge
  const hasDirectOwnerCall = (profile: any) => {
    if (!profile) return false;
    // 1. Explicit property flag or verification or assigned VIP badge
    if (profile.hasDirectCall || getPropertyVipBadge(profile)) return true;
    
    // 2. Check property owner's phone against active subscriptions
    const ownerPhone = (profile.contactPhone || profile.phone || '').replace(/\D/g, '');
    if (!ownerPhone) return false;

    if (typeof window !== 'undefined') {
      try {
        const rawSubs = localStorage.getItem('majh_boisar_property_subscriptions');
        if (rawSubs) {
          const subs = JSON.parse(rawSubs);
          if (Array.isArray(subs)) {
            const found = subs.find((s: any) => (s.phone || '').replace(/\D/g, '') === ownerPhone);
            if (found) {
              const days = found.expiryDate ? Math.ceil((new Date(found.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
              if (days > 0) return true;
            }
          }
        }
        // Fallback: check legacy direct plan key
        const legacyPlan = localStorage.getItem(`majh_boisar_property_plan_${ownerPhone}`);
        if (legacyPlan && legacyPlan !== 'Free') return true;
      } catch (e) {}
    }
    return false;
  };

  // Is this property unlocked for this user?
  const isPropertyContactUnlocked = (propId: string | number, profile?: any) => {
    if (profile && hasDirectOwnerCall(profile)) return true;
    if (!isLoggedIn) return false;
    return userUnlockedPropsState.includes(String(propId));
  };

  // Masked phone display helper
  const formatPropertyPhoneDisplay = (rawPhone: string, propId: string | number, profile?: any) => {
    if (profile && hasDirectOwnerCall(profile)) {
      return `📞 +91 ${rawPhone || '9820123456'} (Direct Call Free)`;
    }
    if (!isLoggedIn) {
      const digits = rawPhone.replace(/\D/g, '');
      return `🔒 +91 98•••• ••${digits ? digits.slice(-2) : '21'} (Login to View)`;
    }
    if (isPropertyContactUnlocked(propId, profile)) {
      return `+91 ${rawPhone || '9820123456'}`;
    }
    // If not unlocked yet:
    const unlockedCount = userUnlockedPropsState.length;
    const digits = rawPhone.replace(/\D/g, '');
    if (unlockedCount < 2) {
      return `🔒 +91 98•••• ••${digits ? digits.slice(-2) : '21'} (${2 - unlockedCount} Free Left)`;
    }
    if (buyerCallCredits > 0) {
      return `🔒 +91 98•••• ••${digits ? digits.slice(-2) : '21'} (${buyerCallCredits} Credit Left)`;
    }
    return `🔒 +91 98•••• ••${digits ? digits.slice(-2) : '21'} (Upgrade to Call)`;
  };

  const [buyerPassModalOpen, setBuyerPassModalOpen] = useState(false);
  const [buyerPassOption, setBuyerPassOption] = useState<'1_call' | '5_calls' | 'unlimited'>('5_calls');
  const [buyerCheckoutModalOpen, setBuyerCheckoutModalOpen] = useState(false);
  const [targetCallProperty, setTargetCallProperty] = useState<any>(null);
  const [buyerUpiRef, setBuyerUpiRef] = useState('');

  const handlePropertyContactCall = (profile: any, isWhatsapp = false) => {
    if (!profile) return;

    if (profile.isSold || profile.status?.toLowerCase().includes('sold') || profile.status?.toLowerCase().includes('rented')) {
      if (showToast) {
        showToast('🔒 This property is already sold/rented out. Contact details are not accessible.', 'info', 4000);
      }
      return;
    }

    const phoneNum = (profile.contactPhone || profile.phone || '9820123456').replace(/\D/g, '');
    const ownerName = profile.contactName || profile.postedBy || 'Owner';

    // 0. SPECIAL BENEFIT: If owner has active paid plan (₹1,499 / ₹2,999 / ₹4,999) -> DIRECT CALL WITHOUT CONSUMING FREE CALLS QUOTA!
    if (hasDirectOwnerCall(profile)) {
      if (showToast) {
        showToast('⚡ Direct Call to Owner! This property has an active verified pass. Zero quota deducted from your account.', 'success', 4000);
      }
      if (isWhatsapp) {
        const msg = encodeURIComponent(`Hi ${ownerName}, I saw your property listing on Majh Boisar (${profile.category || 'property'}). Is it available for inspection?`);
        window.open(`https://wa.me/91${phoneNum}?text=${msg}`, '_blank');
      } else {
        window.location.href = `tel:+91${phoneNum}`;
      }
      return;
    }

    if (!isLoggedIn) {
      if (showToast) {
        showToast('🔒 Please login to view owner contact details & access 2 Free Calls.', 'info');
      } else {
        alert('🔒 Please login with your mobile number to view owner contact details and access your 2 Free Calls.');
      }
      setLoginModalOpen(true);
      return;
    }

    const propIdStr = String(profile.id);
    const unlockedList = getUserUnlockedProps();

    // 1. Already unlocked previously for this user
    if (unlockedList.includes(propIdStr)) {
      if (isWhatsapp) {
        const msg = encodeURIComponent(`Hi ${ownerName}, I saw your property listing on Majh Boisar (${profile.category}). Is it available?`);
        window.open(`https://wa.me/91${phoneNum}?text=${msg}`, '_blank');
      } else {
        window.location.href = `tel:+91${phoneNum}`;
      }
      return;
    }

    // 2. Has free quota available (under 2 free calls)
    if (unlockedList.length < 2) {
      const updated = [...unlockedList, propIdStr];
      try {
        localStorage.setItem(`majh_boisar_unlocked_props_${userPhoneKey}`, JSON.stringify(updated));
      } catch (e) {}
      setUserUnlockedPropsState(updated);

      const freeCallsRemaining = 2 - updated.length;
      if (showToast) {
        showToast(`🎉 Contact Unlocked! Used ${updated.length}/2 Free Calls. (${freeCallsRemaining} Free Left)`, 'success');
      } else {
        alert(`🎉 Contact Unlocked!\n\nYou have used ${updated.length} of 2 Free Calls. (${freeCallsRemaining} Free Call Remaining)`);
      }

      if (isWhatsapp) {
        const msg = encodeURIComponent(`Hi ${ownerName}, I saw your property listing on Majh Boisar (${profile.category}). Is it available?`);
        window.open(`https://wa.me/91${phoneNum}?text=${msg}`, '_blank');
      } else {
        window.location.href = `tel:+91${phoneNum}`;
      }
      return;
    }

    // 3. Has paid buyer credits
    if (buyerCallCredits > 0) {
      const newCredits = buyerCallCredits - 1;
      setBuyerCallCredits(newCredits);
      try {
        localStorage.setItem('majh_boisar_buyer_credits', newCredits.toString());
      } catch (e) {}

      const updated = [...unlockedList, propIdStr];
      try {
        localStorage.setItem(`majh_boisar_unlocked_props_${userPhoneKey}`, JSON.stringify(updated));
      } catch (e) {}
      setUserUnlockedPropsState(updated);

      if (showToast) {
        showToast(`🎉 Contact Unlocked with 1 Credit! (${newCredits} Credits remaining)`, 'success');
      }

      const phoneNum = (profile.contactPhone || profile.phone || '9820123456').replace(/\D/g, '');
      const ownerName = profile.contactName || profile.postedBy || 'Owner';
      if (isWhatsapp) {
        const msg = encodeURIComponent(`Hi ${ownerName}, I saw your property listing on Majh Boisar (${profile.category}). Is it available?`);
        window.open(`https://wa.me/91${phoneNum}?text=${msg}`, '_blank');
      } else {
        window.location.href = `tel:+91${phoneNum}`;
      }
      return;
    }

    // 4. Free quota exhausted (2/2 calls used and 0 credits) -> Open Buyer Pass Paywall Modal!
    setTargetCallProperty({ ...profile, isWhatsapp });
    setBuyerPassModalOpen(true);
  };

  const getCategoryBadgeClass = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('hospital')) return 'bg-sky-100 text-sky-700';
    if (cat.includes('doctor') || cat.includes('clinic')) return 'bg-rose-100 text-rose-700';
    if (cat.includes('restaurant') || cat.includes('cafe')) return 'bg-amber-100 text-amber-700';
    if (cat.includes('hotel') || cat.includes('residency') || cat.includes('hospitality')) return 'bg-violet-100 text-violet-700';
    if (cat.includes('salon') || cat.includes('beauty')) return 'bg-pink-100 text-pink-700';
    if (cat.includes('gym') || cat.includes('fitness')) return 'bg-emerald-100 text-emerald-700';
    if (cat.includes('school') || cat.includes('education')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-slate-100 text-slate-700';
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch('/api/businesses?showAll=true', { next: { revalidate: 30 } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const sorted = [...data]
              .filter((b: any) => b.verified)
              .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
            setBusinesses(sorted);

            // Extract custom categories that are verified
            const customCats: string[] = [];
            data.forEach((b: any) => {
              if (b.verified && b.category && !rawCategories.includes(b.category) && !customCats.includes(b.category)) {
                customCats.push(b.category);
              }
            });
            setDynamicCategories(customCats);
          }
        }
      } catch (err) {
        console.error('Error fetching businesses for homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const resultsRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterRating, setFilterRating] = useState(false);
  const [activeSpecialCategory, setActiveSpecialCategory] = useState<'influencers' | 'properties' | 'helpers' | 'caterers' | null>(initialSpecialCategory || null);
  const [propertyMode, setPropertyMode] = useState<'buy' | 'sell' | 'rent' | null>(null);
  const [activePropertyTab, setActivePropertyTab] = useState<'buy' | 'rent' | 'commercial'>('buy');
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [postPropertyModalOpen, setPostPropertyModalOpen] = useState(false);
  const [homeLoanModalOpen, setHomeLoanModalOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [bhkDropdownOpen, setBhkDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Types');
  const [bhkFilter, setBhkFilter] = useState('All BHK');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
  const [propertyAreaFilter, setPropertyAreaFilter] = useState('All Areas');
  const [propertySortBy, setPropertySortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'newest'>('relevance');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [helperFilterRole, setHelperFilterRole] = useState<string>('All');
  
  // Specialist dashboard states
  const [specialistTab, setSpecialistTab] = useState<'overview' | 'dashboard'>('overview');
  const [specialistCheckoutOpen, setSpecialistCheckoutOpen] = useState(false);
  const [specialistCheckoutPlan, setSpecialistCheckoutPlan] = useState<'Pro' | 'Premium' | null>(null);
  const [specialistCouponInput, setSpecialistCouponInput] = useState('');
  const [specialistCouponApplied, setSpecialistCouponApplied] = useState(false);
  const [specialistCouponSuccess, setSpecialistCouponSuccess] = useState('');
  const [specialistCouponError, setSpecialistCouponError] = useState('');
  const [specialistPaymentMode, setSpecialistPaymentMode] = useState<'upi' | 'card' | 'net'>('upi');
  const [specialistUpiRef, setSpecialistUpiRef] = useState('');
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [showStickyPromo, setShowStickyPromo] = useState(true);
  // Portrait card modals
  const [portraitMarketplaceOpen, setPortraitMarketplaceOpen] = useState(false);
  const [portraitOffersOpen, setPortraitOffersOpen] = useState(false);
  const [portraitTempoOpen, setPortraitTempoOpen] = useState(false);
  const [portraitTurfOpen, setPortraitTurfOpen] = useState(false);
  const [portraitTechOpen, setPortraitTechOpen] = useState(false);
  const [portraitTravelsOpen, setPortraitTravelsOpen] = useState(false);
  const [portraitHotelOpen, setPortraitHotelOpen] = useState(false);
  const [portraitResortOpen, setPortraitResortOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string | number; type: string; name: string } | null>(null);

  // Property Custom Ads (Controlled by Admin Panel)
  const [propertyCustomAds, setPropertyCustomAds] = useState<{
    slot1?: { active: boolean; title: string; subtitle: string; badge: string; image: string; whatsapp: string; linkUrl: string };
    slot2?: { active: boolean; title: string; subtitle: string; badge: string; image: string; whatsapp: string; linkUrl: string };
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_property_custom_ads');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('majh_boisar_property_custom_ads');
        if (saved) setPropertyCustomAds(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Reset scroll to top whenever opening a property detail, profile, or changing special category
  useEffect(() => {
    if (portalContentRef.current) {
      portalContentRef.current.scrollTop = 0;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [selectedProfile, activeSpecialCategory, propertyMode]);

  const closePortal = () => {
    if (pathname === '/properties' || pathname?.startsWith('/properties')) {
      router.push('/');
    }
    setActiveSpecialCategory(null);
    setSelectedProfile(null);
    setPropertyMode(null);
  };

  const [portraitTurfTab, setPortraitTurfTab] = useState<'turf' | 'game'>('game');
  const [portraitBusOpen, setPortraitBusOpen] = useState(false);
  const [portraitBookOpen, setPortraitBookOpen] = useState(false);
  const [portraitEventsOpen, setPortraitEventsOpen] = useState(false);

  // Listen for custom post property event from navbar/menu
  useEffect(() => {
    const handleOpenPostProperty = () => {
      setActiveSpecialCategory('properties');
      setPostPropertyModalOpen(true);
    };
    window.addEventListener('majh_boisar_open_post_property', handleOpenPostProperty);
    return () => {
      window.removeEventListener('majh_boisar_open_post_property', handleOpenPostProperty);
    };
  }, []);

  // Auto-open specific portal modal if URL contains search parameters or query keywords or on /properties route
  useEffect(() => {
    if (initialSpecialCategory) {
      setActiveSpecialCategory(initialSpecialCategory);
      if (searchParams?.get('postProperty') === 'true') {
        setPostPropertyModalOpen(true);
      }
      return;
    }
    if (pathname === '/properties' || pathname?.startsWith('/properties')) {
      setActiveSpecialCategory('properties');
      if (searchParams?.get('postProperty') === 'true') {
        setPostPropertyModalOpen(true);
      }
      return;
    }

    if (!searchParams) return;
    if (searchParams.get('postProperty') === 'true' || searchParams.get('portal') === 'properties') {
      setActiveSpecialCategory('properties');
      if (searchParams.get('postProperty') === 'true') {
        setPostPropertyModalOpen(true);
      }
    }

    const q = (searchParams.get('query') || searchParams.get('q') || '').toLowerCase();
    const cat = (searchParams.get('category') || '').toLowerCase();
    const modal = (searchParams.get('modal') || searchParams.get('open') || '').toLowerCase();

    if (modal === 'properties' || cat === 'properties' || cat.includes('real estate') || cat.includes('property')) {
      setActiveSpecialCategory('properties');
      return;
    }

    // Direct brand match for Ganesh Travels / Cab / Travels
    if (q.includes('ganesh') || q.includes('travel') || q.includes('cab') || q.includes('auto') || q.includes('taxi')) {
      router.push('/hire-vehicle');
      return;
    }

    if (q.includes('hotel') || q.includes('room') || q.includes('lodge') || q.includes('stay') || cat.includes('hotel') || modal.includes('hotel')) {
      router.push('/hotels');
      return;
    }

    if (q.includes('blood') || cat.includes('blood') || modal.includes('blood')) {
      router.push('/blood-donation');
      return;
    }

    if (q.includes('bus') || q.includes('depot') || cat.includes('bus') || modal.includes('bus')) {
      setPortraitBusOpen(true);
      return;
    }

    if (q.includes('event') || q.includes('wedding') || q.includes('marriage') || cat.includes('event') || modal.includes('event')) {
      setPortraitEventsOpen(true);
      return;
    }

    if (q.includes('used') || q.includes('second hand') || q.includes('olx') || q.includes('marketplace') || cat.includes('used') || modal.includes('marketplace')) {
      setPortraitMarketplaceOpen(true);
      return;
    }

    if (q.includes('tech') || q.includes('plumber') || q.includes('electrician') || q.includes('carpenter') || q.includes('ac service') || cat.includes('technician') || modal.includes('tech')) {
      setPortraitTechOpen(true);
      return;
    }

    if (q.includes('tempo') || q.includes('packers') || q.includes('movers') || q.includes('chota hathi') || cat.includes('tempo') || modal.includes('tempo')) {
      setPortraitTempoOpen(true);
      return;
    }

    if (q.includes('offer') || q.includes('discount') || q.includes('deal') || cat.includes('offer') || modal.includes('offer')) {
      setPortraitOffersOpen(true);
      return;
    }

    if (q.includes('book') || q.includes('stationery') || cat.includes('book') || modal.includes('book')) {
      setPortraitBookOpen(true);
      return;
    }

    const isGameQuery = q.includes('game') || q.includes('ps5') || q.includes('vr') || q.includes('arcade') || q.includes('snooker') || cat.includes('game') || modal.includes('game');
    const isTurfQuery = q.includes('turf') || q.includes('cricket') || q.includes('football') || cat.includes('turf') || modal.includes('turf');

    if (isGameQuery) {
      setPortraitTurfTab('game');
      setPortraitTurfOpen(true);
    } else if (isTurfQuery) {
      setPortraitTurfTab('turf');
      setPortraitTurfOpen(true);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (selectedProfile || activeSpecialCategory) {
      window.history.pushState({ modalOpen: true }, '');

      const handlePopState = () => {
        if (selectedProfile) {
          setSelectedProfile(null);
        } else if (activeSpecialCategory) {
          setActiveSpecialCategory(null);
          setPropertyMode(null);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [selectedProfile, activeSpecialCategory]);

  const [ads, setAds] = useState<AdCampaign[]>([
    {
      id: 1,
      title: "Get 5x More Customers!",
      description: "List your business on Majh Boisar today and reach 50,000+ local buyers instantly.",
      image: "", // Empty to trigger gradient background
      businessId: 0
    },
    {
      id: 2,
      title: "Local Services Directory",
      description: "Are you a plumber, electrician, or mechanic? Get featured here and grow fast.",
      image: "", // Empty to trigger gradient background
      businessId: 0
    }
  ]);

  // Launch Ad Campaign form states
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adSelectedBusinessId, setAdSelectedBusinessId] = useState<number>(1);
  const [adDisplayPreference, setAdDisplayPreference] = useState<'personal' | 'different' | 'both'>('both');
  const [adTargetCategory, setAdTargetCategory] = useState('All');
  
  // Unlisted / New Business states for homepage sponsored ad booking
  const [adNewBusinessName, setAdNewBusinessName] = useState('');
  const [adNewBusinessCategory, setAdNewBusinessCategory] = useState('Restaurants');
  const [adNewBusinessPhone, setAdNewBusinessPhone] = useState('');

  // Special profiles local state
  const [profilesState, setProfilesState] = useState<typeof specialProfiles>(() => {
    let rawProfiles = specialProfiles;
    const mapped: any = {};
    for (const [cat, list] of Object.entries(rawProfiles)) {
      mapped[cat] = list.map(item => ({
        ...item,
        verified: item.hasOwnProperty('verified') ? (item as any).verified : true,
        subscription: (item as any).subscription || 'Free',
        views: (item as any).views || 142 + Math.floor(Math.random() * 50),
        clicks: (item as any).clicks || 37 + Math.floor(Math.random() * 15),
        leads: (item as any).leads || [
          { id: 1, name: 'Vikram Singh', phone: '+91 90223 88123', date: 'Today', query: `I need a specialist for my upcoming local commercial project in Boisar West.` },
          { id: 2, name: 'Anita Patil', phone: '+91 98334 11098', date: 'Yesterday', query: `Are you available this Sunday for grand event consultation? Please call.` }
        ]
      }));
    }

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_special_profiles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const dummyIds: any[] = [1, 2, 3, 101, 102, 103, 104, 201, 202, 203, 204, 205, 301, 302, 401, 402, 'inf-1', 'hlp-1', 'hlp-2', 'hlp-3', 'hlp-4', 'hlp-5', 'hlp-6', 'cat-1', 'cat-2'];
          
          const cleanState = {
            influencers: (parsed.influencers || []).filter((p: any) => !dummyIds.includes(p.id)),
            properties: (parsed.properties || []).filter((p: any) => !dummyIds.includes(p.id) && p.name !== 'ee' && p.contactName !== 'ee' && p.name !== 'Owner: ee' && p.title !== 'Owner: ee'),
            helpers: (parsed.helpers || []).filter((p: any) => !dummyIds.includes(p.id)),
            caterers: (parsed.caterers || []).filter((p: any) => !dummyIds.includes(p.id)),
          };

          localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(cleanState));
          return cleanState;
        } catch (e) {
          const emptyState = { influencers: [], properties: [], helpers: [], caterers: [] };
          localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(emptyState));
          return emptyState;
        }
      } else {
        const emptyState = { influencers: [], properties: [], helpers: [], caterers: [] };
        localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(emptyState));
        return emptyState;
      }
    }
    return { influencers: [], properties: [], helpers: [], caterers: [] };
  });

  // Fetch live properties from Prisma database on mount
  useEffect(() => {
    const fetchPropertiesFromDb = async () => {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const dbProperties = await res.json();
          if (Array.isArray(dbProperties)) {
            const verifiedProps = dbProperties.filter((p: any) => p.verified !== false);
            setProfilesState(prev => {
              const nextState = {
                ...prev,
                properties: verifiedProps
              };
              if (typeof window !== 'undefined') {
                localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextState));
              }
              return nextState;
            });
          }
        }
      } catch (err) {
        console.error('Error fetching live properties in HomeClient:', err);
      }
    };
    fetchPropertiesFromDb();
  }, []);

  // Auto-select property if id parameter is provided in URL (?id=123)
  useEffect(() => {
    if (activeSpecialCategory === 'properties') {
      const propId = searchParams?.get('id');
      if (propId && profilesState.properties && profilesState.properties.length > 0) {
        const found = profilesState.properties.find((p: any) => String(p.id) === String(propId));
        if (found) {
          setSelectedProfile(found);
        }
      }
    }
  }, [activeSpecialCategory, searchParams, profilesState.properties]);

  const handleShareProperty = async () => {
    if (!selectedProfile) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://majhboisar.in';
    const shareUrl = `${origin}/properties?id=${selectedProfile.id}`;
    const propTitle = selectedProfile.category || selectedProfile.name || selectedProfile.title || 'Property in Boisar';
    const propPrice = formatPrice(selectedProfile.price);
    const propLocation = selectedProfile.location || selectedProfile.addressLocality || 'Boisar';
    const shareText = `Check out this property on Majh Boisar: ${propTitle} (${propPrice}) at ${propLocation}. View details:`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${propTitle} | Majh Boisar Real Estate`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      showToast('Property link copied to clipboard!', 'success');
    } catch (e) {
      showToast('Could not copy link to clipboard', 'error');
    }
  };

  const [shortlistedPropIds, setShortlistedPropIds] = useState<number[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem('majh_boisar_shortlisted_properties');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleShortlistProperty = (propId: number) => {
    setShortlistedPropIds((prev) => {
      const isLiked = prev.includes(propId);
      const updated = isLiked ? prev.filter((id) => id !== propId) : [...prev, propId];
      try {
        localStorage.setItem('majh_boisar_shortlisted_properties', JSON.stringify(updated));
      } catch (e) {}
      showToast(isLiked ? 'Removed from shortlisted properties' : 'Added to shortlisted properties! ❤️', 'success');
      return updated;
    });
  };

  const calculateEstimatedEmi = (priceStr: string | number | undefined) => {
    if (!priceStr) return 8450;
    const num = parseInt(String(priceStr).replace(/[^\d]/g, ''), 10);
    if (!num || isNaN(num) || num <= 0) return 8450;
    const p = num * 0.8;
    const r = 8.5 / 12 / 100;
    const n = 240;
    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    return emi > 0 ? emi : 8450;
  };

  const formatPriceInLacs = (price: string | number | undefined): string => {
    if (!price) return 'Price on Request';
    const rawNum = parseInt(String(price).replace(/[^\d]/g, ''), 10);
    if (!rawNum || isNaN(rawNum)) return String(price);
    if (rawNum >= 10000000) {
      const cr = (rawNum / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹ ${cr} Cr`;
    }
    if (rawNum >= 100000) {
      const lacs = (rawNum / 100000).toFixed(2).replace(/\.00$/, '');
      return `₹ ${lacs} Lacs`;
    }
    return `₹ ${rawNum.toLocaleString('en-IN')}`;
  };

  // Helper function to update specialist plan subscription
  const updateSpecialistSubscription = (tier: 'Free' | 'Pro' | 'Premium') => {
    if (!selectedProfile || !activeSpecialCategory) return;
    
    const list = (profilesState as any)[activeSpecialCategory] || [];
    const updatedList = list.map((p: any) => {
      if (p.id === selectedProfile.id) {
        const updatedProfile = { 
          ...p, 
          subscription: tier,
          views: tier === 'Free' ? 142 : p.views || 142 + Math.floor(Math.random() * 50),
          clicks: tier === 'Free' ? 37 : p.clicks || 37 + Math.floor(Math.random() * 15)
        };
        setSelectedProfile(updatedProfile);
        return updatedProfile;
      }
      return p;
    });

    const nextProfilesState = {
      ...profilesState,
      [activeSpecialCategory]: updatedList
    };

    setProfilesState(nextProfilesState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(nextProfilesState));
    }
  };

  const [addProfileModalOpen, setAddProfileModalOpen] = useState(false);
  const [profileModalCategory, setProfileModalCategory] = useState<'influencers' | 'properties' | 'helpers' | 'caterers' | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileCategory, setNewProfileCategory] = useState('');
  const [newProfilePrice, setNewProfilePrice] = useState('');
  const [newProfileBio, setNewProfileBio] = useState('');
  const [newProfileExperience, setNewProfileExperience] = useState('1+ Year');
  const [newProfileServices, setNewProfileServices] = useState('');
  const [newProfilePhone, setNewProfilePhone] = useState('');
  const [newProfileAvatar, setNewProfileAvatar] = useState('');
  const [newProfilePhotos, setNewProfilePhotos] = useState<string[]>([]);
  const [newProfilePhotoInput, setNewProfilePhotoInput] = useState('');
  
  // NEW STATES
  const [newProfileVideos, setNewProfileVideos] = useState<string[]>([]);
  const [newProfileVideoInput, setNewProfileVideoInput] = useState('');
  const [newProfileListingType, setNewProfileListingType] = useState<'agent' | 'property'>('agent');
  
  // MULTI-SELECT WORK TYPE & DYNAMIC SERVICES WITH CUSTOM RATES
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [dynamicServices, setDynamicServices] = useState<{ name: string; price: string }[]>([
    { name: '', price: '' }
  ]);

  // SOCIAL MEDIA HANDLES
  const [newProfileInstagram, setNewProfileInstagram] = useState('');
  const [newProfileYoutube, setNewProfileYoutube] = useState('');

  const [profileFormError, setProfileFormError] = useState('');

  // INSTANT LIVE SEARCH AUTOCOMPLETE STATE & COMPUTATIONS
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 1. Matching Portal Pills (e.g. Housemaid, Driver, Travels, AC Service, Hotel, Resort, Jobs, Turf, etc.)
  const matchingPortals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return QUICK_PORTAL_PILLS.filter(pill => {
      if (pill.title.toLowerCase().includes(q)) return true;
      if (q.length > 1 && pill.subtitle.toLowerCase().includes(q)) return true;
      return pill.keywords.some(k => q.length === 1 ? k.toLowerCase().startsWith(q) : (k.toLowerCase().includes(q) || q.includes(k.toLowerCase())));
    }).slice(0, 3);
  }, [searchQuery]);

  const matchingCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const suggestions = getCategorySearchSuggestions(searchQuery, 4);
    return suggestions.map(s => s.title);
  }, [searchQuery]);

  const matchingBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const rawTokens = q.split(/\s+/).filter(t => t.length > 0);
    const filteredTokens = rawTokens.filter(t => !['in', 'near', 'me', 'boisar', 'tarapur', 'palghar', 'best', 'top', 'service', 'services'].includes(t));
    const searchTokens = filteredTokens.length > 0 ? filteredTokens : rawTokens;

    return businesses.filter(b => {
      const nameLower = (b.name || '').toLowerCase();
      const catLower = (b.category || '').toLowerCase();
      const descLower = (b.description || '').toLowerCase();
      const addrLower = (b.address || '').toLowerCase();

      return searchTokens.some(st => 
        nameLower.includes(st) || 
        catLower.includes(st) || 
        descLower.includes(st) || 
        addrLower.includes(st)
      );
    }).slice(0, 5);
  }, [searchQuery, businesses]);

  const matchingSpecialists = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const rawTokens = q.split(/\s+/).filter(t => t.length > 0);
    const filteredTokens = rawTokens.filter(t => !['in', 'near', 'me', 'boisar', 'tarapur', 'palghar', 'best', 'top', 'service', 'services'].includes(t));
    const searchTokens = filteredTokens.length > 0 ? filteredTokens : rawTokens;

    const allSpecs = [
      ...(profilesState.helpers || []),
      ...(profilesState.influencers || []),
      ...(profilesState.caterers || []),
      ...(profilesState.properties || [])
    ];
    return allSpecs.filter((s: any) => {
      const nameLower = (s.name || '').toLowerCase();
      const catLower = (s.category || '').toLowerCase();
      const bioLower = (s.bio || '').toLowerCase();

      return searchTokens.some(st => 
        nameLower.includes(st) || 
        catLower.includes(st) || 
        bioLower.includes(st)
      );
    }).slice(0, 4);
  }, [searchQuery, profilesState]);

  // Page Load State
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Sync loggedInUser values to form when modal opens
  useEffect(() => {
    if (addProfileModalOpen && loggedInUser) {
      setNewProfileName(prev => prev || loggedInUser.name);
      setNewProfilePhone(prev => prev || loggedInUser.phone);
    }
  }, [addProfileModalOpen, loggedInUser]);

  // Lock body scroll when overlay modals are open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeSpecialCategory || loginModalOpen || addProfileModalOpen || specialistCheckoutOpen || adModalOpen) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [activeSpecialCategory, loginModalOpen, addProfileModalOpen, specialistCheckoutOpen, adModalOpen]);

  const handleAddProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFormError('');

    const finalCategory = selectedWorkTypes.length > 0 ? selectedWorkTypes.join(' • ') : newProfileCategory;
    if (!newProfileName.trim() || !finalCategory.trim() || !newProfilePrice.trim() || !newProfilePhone.trim()) {
      setProfileFormError('Please fill in all required fields marked with *');
      return;
    }

    const targetCategory = profileModalCategory || activeSpecialCategory || 'helpers';

    const newId = Date.now();
    const finalAvatar = newProfileAvatar.trim();

    // Process dynamic services with individual price rates
    const validDynamicServices = dynamicServices
      .filter(s => s.name.trim().length > 0)
      .map(s => s.price.trim() ? `${s.name.trim()} (${s.price.trim().startsWith('₹') ? '' : '₹'}${s.price.trim()})` : s.name.trim());

    const finalServices = validDynamicServices.length > 0 
      ? validDynamicServices 
      : (newProfileServices ? newProfileServices.split(',').map(s => s.trim()).filter(Boolean) : [finalCategory]);

    const finalGallery = newProfilePhotos;
    const cleanPhone = newProfilePhone.replace(/\D/g, '');

    const newProfile = {
      id: newId,
      name: toTitleCase(newProfileName),
      category: finalCategory,
      rating: 5.0,
      reviewsCount: 0,
      price: newProfilePrice.startsWith('₹') ? newProfilePrice : `₹${newProfilePrice}`,
      avatar: finalAvatar,
      bio: newProfileBio || `${finalCategory} in Boisar. Reliable quality service.`,
      experience: newProfileExperience,
      services: finalServices,
      gallery: finalGallery,
      phone: cleanPhone,
      reviews: [],
      verified: targetCategory === 'helpers' ? false : true,
      subscription: 'Free',
      views: 12,
      clicks: 3,
      leads: [],
      listingType: targetCategory === 'properties' ? newProfileListingType : undefined,
      videos: newProfileVideos.length > 0 ? newProfileVideos : undefined,
      instagram: newProfileInstagram.trim() || undefined,
      youtube: newProfileYoutube.trim() || undefined
    };

    const currentCategoryList = profilesState[targetCategory] || [];
    const filteredList = currentCategoryList.filter((p: any) => p.phone?.replace(/\D/g, '') !== cleanPhone);

    const updated = {
      ...profilesState,
      [targetCategory]: [newProfile, ...filteredList]
    };

    setProfilesState(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(updated));
    }

    if (targetCategory === 'helpers') {
      alert('🔒 Your Maid / Domestic Helper profile has been submitted for safety verification! As soon as Admin approves, it will be visible to clients.');
    } else {
      alert('🎉 Profile published successfully! Your listing is now live immediately.');
    }

    // Reset form fields
    setNewProfileName('');
    setNewProfileCategory('');
    setSelectedWorkTypes([]);
    setDynamicServices([{ name: '', price: '' }]);
    setNewProfileInstagram('');
    setNewProfileYoutube('');
    setNewProfilePrice('');
    setNewProfileBio('');
    setNewProfileExperience('1+ Year');
    setNewProfileServices('');
    setNewProfilePhone('');
    setNewProfileAvatar('');
    setNewProfilePhotos([]);
    setNewProfilePhotoInput('');
    setNewProfileVideos([]);
    setNewProfileVideoInput('');
    setProfileFormError('');
    setAddProfileModalOpen(false);

    // Switch view to active category so user sees their new profile live immediately
    setActiveSpecialCategory(targetCategory);

    alert(`🎉 Profile Listed Successfully!\n\nYour ${newProfileCategory} profile for "${toTitleCase(newProfileName)}" is now live in the ${targetCategory.toUpperCase()} directory on Majh Boisar!`);
  };


  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePlaying, setIsSlidePlaying] = useState(true);
  const [slides, setSlides] = useState<any[]>([
    {
      label: "Comfort Stay · Hourly & Nightly",
      title: "Hotel Booking in Boisar",
      cta: "Book Hotel / Hourly Stay",
      category: "Hotels",
      action: "hotel_booking",
      targetUrl: "/hotels",
      image: "/imagess/ChatGPT Image Aug 15, 2026, 08_23_55 PM.png",
      showTextOverlay: false
    },
    {
      label: "Verified Experts · Quick Visit",
      title: "Home Services & Domestic Helpers",
      cta: "Book Services & Helpers",
      category: "Home Services",
      action: "home_services",
      targetUrl: "/services",
      image: "/imagess/ChatGPT Image Aug 22, 2026, 04_12_53 PM.png",
      showTextOverlay: false,
      scaleClass: "scale-[1.05] lg:scale-[1.10]"
    },
    {
      label: "24x7 Emergency & Care",
      title: "Hospitals & ICU in Boisar",
      cta: "View Hospitals & Clinics",
      category: "Hospitals",
      action: "hospitals",
      targetUrl: "/search?category=Hospitals",
      image: "/imagess/hosptials cousrel new.png",
      showTextOverlay: false
    }
  ]);

  // Carousel Touch Swipe & Autoplay Handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 35;
  const [slideTimerKey, setSlideTimerKey] = useState<number>(0);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setSlideTimerKey((k) => k + 1);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setSlideTimerKey((k) => k + 1);
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentSlide(idx);
    setSlideTimerKey((k) => k + 1);
  };

  const onCarouselTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setIsSlidePlaying(false);
  };

  const onCarouselTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onCarouselTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) {
      setIsSlidePlaying(true);
      return;
    }
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
    setTimeout(() => setIsSlidePlaying(true), 2500);
  };


  // Fetch dynamic ads from backend & localStorage
  useEffect(() => {
    const fetchDynamicAds = async () => {
      try {
        let activeAds: any[] = [];
        try {
          const res = await fetch('/api/ad-orders', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              activeAds = data.filter((ad: any) => (ad.status === 'Approved' || ad.status === 'Pending' || ad.status === 'Active') && !ad.isExpired);
            }
          }
        } catch (err) {
          console.log("Error fetching API ad-orders", err);
        }

        const localAds = JSON.parse(localStorage.getItem('majh_boisar_ads') || '[]');
        const customAds = JSON.parse(localStorage.getItem('majh_boisar_custom_ads') || '[]');
        const allAds = [...activeAds, ...localAds, ...customAds];

        // 1. Carousel Slides
        const carouselAds = allAds.filter((ad: any) => 
          ad.placement === 'Homepage Carousel Slot 1' || 
          ad.placement === 'Homepage Carousel Slot 2' || 
          ad.placement === 'Homepage Carousel Slot 3' || 
          ad.placement === 'Carousel Slide' ||
          ad.placement === 'All Placements (Run Everywhere)' ||
          ad.placement === 'Run Everywhere (Auto-Fits All)' ||
          ad.placement?.includes('VIP Bundle') ||
          ad.placement?.includes('Bundle') ||
          ad.image
        );

        if (carouselAds.length > 0) {
          setSlides(prev => {
            const nextSlides = [...prev];
            const mapAd = (ad: any) => ({
              label: ad.businessName || ad.title || "PROMOTED BANNER",
              title: ad.title || ad.businessName || "Special Promotion",
              cta: "View Offers",
              category: ad.targetCategory || 'All',
              image: ad.image || ad.imageUrl || "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=1200&q=80",
              targetUrl: ad.targetUrl || ad.url || '#',
              showTextOverlay: !!ad.image ? false : (ad.showTextOverlay !== false)
            });

            carouselAds.forEach((ad: any, index: number) => {
              if (index < nextSlides.length) {
                nextSlides[index] = mapAd(ad);
              } else {
                nextSlides.push(mapAd(ad));
              }
            });
            return nextSlides;
          });
        }

        // 2. Homepage Spotlight Cards
        const spotlightAds = allAds.filter((ad: any) => 
          ad.placement === 'Homepage Spotlight Slot 1' || 
          ad.placement === 'Homepage Spotlight Slot 2' || 
          ad.placement === 'Homepage Spotlight Slot 3' || 
          ad.placement === 'Homepage Spotlight' ||
          ad.placement === 'Bottom Card 1 (800x600 px - 4:3)' ||
          ad.placement === 'Bottom Card 2 (800x600 px - 4:3)' ||
          ad.placement === 'Bottom Card 3 (800x600 px - 4:3)' ||
          ad.placement === 'All Placements (Run Everywhere)' ||
          ad.placement === 'Run Everywhere (Auto-Fits All)' ||
          ad.placement?.includes('VIP Bundle') ||
          ad.placement?.includes('Bundle')
        );

        const mapSpotAd = (ad: any) => ({
          id: ad._id || ad.id || Date.now(),
          title: ad.title || ad.businessName,
          description: ad.description || ad.subtitle || 'Promoted Business in Boisar',
          image: ad.image || ad.imageUrl || "",
          businessId: ad.businessId || 0,
          targetUrl: ad.targetUrl || '#',
          showTextOverlay: !!ad.image ? false : (ad.showTextOverlay !== false)
        });

        if (spotlightAds.length > 0) {
          setAds(prevAds => {
            const result = [...prevAds];
            spotlightAds.forEach((ad: any, idx: number) => {
              if (idx < result.length) {
                result[idx] = mapSpotAd(ad);
              }
            });
            return result;
          });
        }
      } catch (err) {
        console.error("Error loading dynamic ads:", err);
      }
    };
    fetchDynamicAds();
  }, []);

  // AI Assistant Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'ai', 
      text: "Hello! I am your Boisar local AI finder. Tell me what service or shop you are looking for, and I will recommend the best verified spots in town! (e.g. 'I need an urgent plumber for leakage' or 'suggest a family restaurant')"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Check URL params for Advertise trigger
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('advertise') === 'true') {
        setAdModalOpen(true);
        // Clear param to prevent loop
        window.history.replaceState({}, '', '/');
      }
    }
  }, []);

  const handleLaunchAdCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adDescription.trim()) return;

    if (adSelectedBusinessId === -1) {
      if (!adNewBusinessName.trim() || !adNewBusinessPhone.trim()) {
        alert("Please fill in your Business Name and Contact Phone!");
        return;
      }
    }

    const bNames: Record<number, string> = {
      1: "Hotel Boisar Residency",
      2: "Ashirwad Diagnostic Center",
      3: "Tarapur Plumbing Services"
    };

    let finalDesc = adDescription;
    let finalBizName = bNames[adSelectedBusinessId];
    if (adSelectedBusinessId === -1) {
      finalBizName = adNewBusinessName;
      finalDesc = `[New Category: ${adNewBusinessCategory} | Phone: ${adNewBusinessPhone}] ${adDescription}`;
    }

    try {
      const res = await fetch('/api/ad-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: adSelectedBusinessId,
          businessName: finalBizName || "New Merchant Partner",
          title: adTitle,
          description: finalDesc,
          image: adImage || null,
          placement: 'sponsored',
          targetingScope: adDisplayPreference,
          targetCategory: adTargetCategory,
          durationDays: 7,
          dailyBudget: 100.0,
          totalCost: 700.0
        })
      });

      if (!res.ok) throw new Error("Failed to post ad order");
      const savedAd = await res.json();

      const newAd: AdCampaign = {
        id: savedAd.id || Date.now(),
        title: adTitle,
        description: finalDesc,
        image: adImage || "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=300&q=80",
        businessId: adSelectedBusinessId
      };

      setAds([newAd, ...ads]);
      setAdTitle('');
      setAdDescription('');
      setAdImage('');
      setAdNewBusinessName('');
      setAdNewBusinessPhone('');
      setAdModalOpen(false);

      let prefMsg = "";
      if (adDisplayPreference === 'personal') prefMsg = "Personal Category Only";
      else if (adDisplayPreference === 'different') prefMsg = `Custom Category: ${adTargetCategory}`;
      else prefMsg = `Both (Personal & Custom Category: ${adTargetCategory})`;

      // Give Order Receipt ID Alert
      alert(`Your Sponsored Ad Order has been submitted successfully!\nAd Campaign Order ID: MB-AD-1000${savedAd.id}\nScope: ${prefMsg}\n\n⚠️ PLEASE TAKE A SCREENSHOT OF THIS MESSAGE. You will need Order ID "MB-AD-1000${savedAd.id}" to track campaign processing status!`);
    } catch (err: any) {
      console.error(err);
      alert("Error booking campaign. Please contact admin directly to place manual orders.");
    }

    setAdDisplayPreference('both');
    setAdTargetCategory('All');
  };

  const categories = [...rawCategories, ...dynamicCategories].map(name => ({
    name,
    icon: getCategoryIcon(name),
    bgClass: getCategoryBgClass(name),
    image: getCategoryImage(name)
  }));

  // Sub-category Promo Blocks (Expanded with rich local daily utility services)
  const promoSections = [
    {
      title: "Wedding & Events",
      accentColor: "rose",
      tagline: "Celebrate & Plan",
      items: [
        { label: "Banquet Halls", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80", query: "Banquet Hall" },
        { label: "Photographers", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80", query: "Photographers" },
        { label: "Caterers & Decor", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80", query: "Caterers" },
        { label: "Bridal & Suit Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80", query: "Bridal" }
      ]
    },
    {
      title: "Beauty & Wellness",
      accentColor: "pink",
      tagline: "Relax & Heal",
      items: [
        { label: "Beauty Parlours", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80", query: "Beauty" },
        { label: "Salons & Spa", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80", query: "Salons" },
        { label: "Gyms & Fitness", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80", query: "Gyms" },
        { label: "Doctors & Clinics", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80", query: "Doctors" }
      ]
    },
    {
      title: "Daily Needs",
      accentColor: "amber",
      tagline: "Essential Utilities",
      items: [
        { label: "Grocery Stores", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80", query: "Grocery" },
        { label: "Maid & House Help", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80", query: "House Cleaning" },
        { label: "Tiffin & Catering", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80", query: "Caterers" },
        { label: "Pest Control", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80", query: "Pest Control" }
      ]
    },
    {
      title: "Repairs & Services",
      accentColor: "teal",
      tagline: "Fix & Maintain",
      items: [
        { label: "AC Service", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80", query: "AC Service" },
        { label: "Plumbers & Leakage", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=300&q=80", query: "Plumbers" },
        { label: "Electricians & Wiring", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80", query: "Electricians" },
        { label: "Carpenters & Painters", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=300&q=80", query: "Carpenters" }
      ]
    }
  ];



  const fetchBusinesses = () => {
    let url = `/search?`;
    if (selectedCategory && selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (selectedLocation && selectedLocation !== 'All') url += `location=${encodeURIComponent(selectedLocation)}&`;
    if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
    router.push(url);
  };



  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingRef.current) {
      const scrollAmount = 240;
      trendingRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    const prompt = chatInput;
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/businesses?query=' + encodeURIComponent(prompt));
      const data = await res.json();
      
      const aiMsg: Message = {
        sender: 'ai',
        text: data.length > 0 
          ? `I found ${data.length} listing(s) matching your request. Here are the top verified recommendations:` 
          : "I couldn't find any listings matching those exact descriptions in Boisar. Try searching for general keywords like 'dentist', 'AC repair', or 'plumber'.",
        recommendations: data.slice(0, 3)
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I had trouble parsing directory recommendations. Try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const incrementClick = async (id: number, field: 'phoneClicks' | 'whatsappClicks') => {
    try {
      const target = businesses.find(b => b.id === id);
      if (!target) return;
      await fetch(`/api/businesses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: (target as any)[field] + 1 })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filter lists dynamically based on category selection (Top 8 curated business categories by default)
  const displayedCategories = isCategoriesExpanded ? categories : categories.slice(0, 8);

  return (
    <div className="min-h-screen pb-2 sm:pb-3 text-slate-800 font-sans bg-white">
      
      {/* 1. Hero Search Panel */}
      <div 
        className="relative border-b border-slate-150 pt-2.5 pb-3 sm:pt-4 sm:pb-5 overflow-visible bg-cover bg-no-repeat bg-center z-40"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Large watermark MB Logo centered in the background - clear and prominent */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <img loading="lazy" decoding="async" 
            src="/majh-boisar-mb-logo.png" 
            alt="Watermark MB" 
            className="h-24 sm:h-36 md:h-44 w-auto object-contain opacity-[0.25] select-none" 
          />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-40 overflow-visible">

          {/* Search Inputs Bar — Clean Single NoBroker Rounded Input Style */}
          <div className="max-w-xl mx-auto relative z-50">
            <div className="bg-white border border-slate-200/90 shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:shadow-md hover:border-slate-350 focus-within:border-slate-700 focus-within:ring-4 focus-within:ring-slate-900/5 rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2.5 transition-all">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 stroke-[2.2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') {
                    setIsSearchFocused(false);
                    fetchBusinesses(); 
                  }
                }}
                placeholder="Search Plumbing, Electrical, Cleaning..."
                className="bg-transparent border-0 text-xs sm:text-sm focus:outline-none w-full text-slate-800 placeholder:text-slate-400 font-bold"
              />
              {loading && searchQuery && (
                <div className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Instant Search Suggestions Dropdown */}
            {searchQuery.trim().length > 0 && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.18)] border border-slate-200/90 z-[100] overflow-hidden text-left animate-in fade-in zoom-in-95 duration-100 max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                
                {/* 1. Direct Matching City Portals & Services */}
                {matchingPortals.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Quick Services
                    </div>
                    <div className="py-0.5">
                      {matchingPortals.map((portal) => (
                        <div
                          key={portal.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            if (portal.actionType === 'modal') {
                              if (portal.id === 'turf') setPortraitTurfOpen(true);
                              else if (portal.id === 'offers') setPortraitOffersOpen(true);
                              else if (portal.id === 'marketplace') setPortraitMarketplaceOpen(true);
                              else if (portal.id === 'blood_emergency') router.push('/search?category=Hospitals');
                            } else {
                              router.push(portal.targetUrl);
                            }
                          }}
                          className="px-3.5 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0 leading-none">{portal.icon}</span>
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-teal-700 truncate">{portal.title}</span>
                            <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">{portal.badge}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Matching Categories Section */}
                {matchingCategories.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Categories
                    </div>
                    <div className="py-0.5">
                      {matchingCategories.map((cat, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                            router.push(`/search?category=${encodeURIComponent(cat)}`);
                          }}
                          className="px-3.5 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-700 flex items-center justify-center shrink-0 transition-colors">
                              <Search className="w-3 h-3" />
                            </div>
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-teal-700 truncate">{cat}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium group-hover:text-teal-600 transition-colors">Category</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Matching Business Listings */}
                {matchingBusinesses.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Verified Places
                    </div>
                    <div className="py-0.5">
                      {matchingBusinesses.map((biz) => (
                        <Link
                          key={biz.id}
                          href={`/business/${biz.id}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="px-3.5 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={biz.image || "/majh-boisar-mb-logo.png"} 
                              alt={biz.name}
                              className="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0" 
                            />
                            <div className="min-w-0 flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-800 group-hover:text-teal-700 truncate">{biz.name}</span>
                              <span className="text-[10px] text-slate-400 truncate">· {biz.category}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Special Profiles (Maids, Influencers, Caterers, Properties) */}
                {matchingSpecialists.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Specialists &amp; Profiles
                    </div>
                    <div className="py-0.5">
                      {matchingSpecialists.map((spec) => {
                        const isSpecSold = Boolean(spec.isSold || spec.status?.toLowerCase().includes('sold') || spec.status?.toLowerCase().includes('rented'));
                        return (
                          <div
                            key={spec.id}
                            onClick={() => {
                              if (isSpecSold) {
                                showToast('🔒 This property is sold / rented out and closed.', 'info');
                                return;
                              }
                              setIsSearchFocused(false);
                              setSelectedProfile(spec);
                            }}
                            className={`px-3.5 py-2 flex items-center justify-between transition-colors group ${
                              isSpecSold ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-violet-200/60">
                                {spec.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-800 group-hover:text-violet-700 truncate">{spec.name}</span>
                                <span className="text-[10px] text-slate-400 truncate">· {spec.category}</span>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-400 group-hover:text-violet-600 transition-colors shrink-0 ml-2">
                              {isSpecSold ? 'Closed' : 'View →'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Results Fallback */}
                {matchingPortals.length === 0 && matchingCategories.length === 0 && matchingBusinesses.length === 0 && matchingSpecialists.length === 0 && (
                  <div className="py-6 px-4 text-center">
                    <p className="text-xs font-medium text-slate-600">No quick suggestions for "{searchQuery}"</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Press Enter or Search to browse all Boisar results</p>
                  </div>
                )}

                {/* Footer Link: View All Search Results */}
                <div 
                  onClick={() => {
                    setIsSearchFocused(false);
                    fetchBusinesses();
                  }}
                  className="bg-slate-50/90 hover:bg-teal-50 px-3.5 py-2.5 text-center text-xs font-semibold text-teal-700 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Search all results for <strong>"{searchQuery}"</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Quick Services & Hubs — NoBroker 8 Cards Grid Style */}
      <div className="w-full bg-gradient-to-b from-[#f0f7f7] via-[#f5f9f9] to-[#fafbfb] border-b border-slate-200/70 py-3 sm:py-4.5">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3.5 items-stretch">

          {/* 1. Properties */}
          <Link
            href="/properties"
            onClick={() => { setActiveSpecialCategory('properties'); setSelectedProfile(null); }}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[26px] sm:min-h-[28px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-center leading-tight truncate">
                Properties
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/properties.webp"
                alt="Properties"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </Link>

          {/* 2. Find a Job */}
          <Link
            href="/jobs"
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-indigo-700 transition-colors text-center leading-tight line-clamp-1">
                Jobs
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/jobs.webp"
                alt="Jobs"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </Link>

          {/* 3. Home Services */}
          <div
            onClick={() => router.push('/services')}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-amber-700 transition-colors text-center leading-tight line-clamp-1">
                Services
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/servies.webp"
                alt="Services"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

          {/* 4. Hotel Booking */}
          <div
            onClick={() => router.push('/hotels')}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-yellow-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-yellow-800 transition-colors text-center leading-tight line-clamp-1">
                Hotels
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/hotels.webp"
                alt="Hotels"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

          {/* 5. Hospitals */}
          <div
            onClick={() => router.push('/search?category=Hospitals')}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-rose-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-rose-700 transition-colors text-center leading-tight line-clamp-1">
                Hospitals
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/hosptial.webp"
                alt="Hospitals"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

          {/* 6. Travels */}
          <div
            onClick={() => router.push('/hire-vehicle')}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-sky-700 transition-colors text-center leading-tight line-clamp-1">
                Travels
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/travels.webp"
                alt="Travels"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

          {/* 7. Resorts */}
          <div
            onClick={() => router.push('/resorts')}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-teal-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-teal-700 transition-colors text-center leading-tight line-clamp-1">
                Resorts
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/resort.webp"
                alt="Resorts"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

          {/* 8. Blood Donors */}
          <div
            onClick={() => router.push('/blood-donation')}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-red-400 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 p-2 sm:p-2.5 flex flex-col items-center justify-between text-center cursor-pointer group"
          >
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center justify-center w-full px-0.5">
              <h3 className="text-[10px] min-[350px]:text-[11px] sm:text-xs md:text-[13px] font-bold text-slate-800 group-hover:text-[#e50914] transition-colors text-center leading-tight">
                Blood Donors
              </h3>
            </div>
            <div className="w-full h-16 sm:h-20 lg:h-22 flex items-center justify-center mt-0.5">
              <img
                src="/imagess/home icons/blood donor.webp"
                alt="Blood Donors"
                width={88}
                height={88}
                decoding="async"
                className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

          </div>
        </div>
      </div>

      {/* 3. Grid of Category Blocks (Explore Categories - Popular style compact cards) */}
      <div className="w-full bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/70 to-[#fafbfb] border-b border-slate-200/70 py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-[#008080] shrink-0"></span>
              <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Explore Categories
              </h2>
            </div>
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="text-xs sm:text-sm font-bold text-[#008080] hover:text-teal-900 flex items-center gap-1 transition-all duration-200 cursor-pointer group active:scale-95 select-none"
            >
              <span className="group-hover:underline underline-offset-4 decoration-teal-400">
                {isCategoriesExpanded ? 'Show Less' : `View All (${categories.length})`}
              </span>
              <ChevronDown 
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008080] group-hover:text-teal-900 transition-transform duration-300 ${
                  isCategoriesExpanded ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {displayedCategories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => router.push(`/search?category=${encodeURIComponent(cat.name)}`)}
                className="group bg-white rounded-[20px_20px_32px_8px] border border-slate-200/90 p-2 sm:p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center relative"
              >
                {/* Clean Image Box */}
                <div className="w-full aspect-square rounded-[14px] sm:rounded-[16px] bg-slate-100 overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/imagess/used items.png';
                    }}
                  />
                </div>

                {/* Title label */}
                <div className="min-h-[2.3rem] sm:min-h-[2.5rem] flex items-center justify-center w-full px-0.5 mt-1.5 sm:mt-2 mb-0.5">
                  <p className="text-[10px] min-[360px]:text-[11px] sm:text-[12px] font-bold text-slate-700 text-center leading-[1.25] line-clamp-2 group-hover:text-teal-700 transition-colors">
                    {cat.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Verified Services & Financial Rails */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-7 sm:mt-10">
        <div className="space-y-7 sm:space-y-10">
          {/* Loans in Boisar Section - 2x2 Grid with Swipe */}
          <div className="py-2 sm:py-4">
            {/* Left-Aligned Section Header with Amber Underline */}
            <div className="text-left mb-3.5 sm:mb-4 px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight inline-block">
                Loans in <span className="border-b-4 border-amber-500 pb-0.5">Boisar</span>
              </h3>
              <p className="text-[11px] min-[400px]:text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 tracking-wide">
                Lowest Interest Rates • Instant Disbursal
              </p>
            </div>

            {/* Carousel Container with Left & Right Arrow Buttons */}
            <div className="relative group px-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollLoansLeft}
                aria-label="Scroll Left"
                className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Right Arrow Button (Amber circular button) */}
              <button
                type="button"
                onClick={scrollLoansRight}
                aria-label="Scroll Right"
                className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500 hover:bg-amber-600 shadow-md flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* 2x2 Grid per slide with Swipe Track */}
              <div
                ref={loansRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 snap-x snap-mandatory"
              >
                {[
                  // Slide 1 (4 items in 2x2 grid)
                  [
                    {
                      id: 'home-loan',
                      title: 'Home Loan',
                      subtitle: 'From 8.4% ROI • Zero Prepay',
                      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'personal-loan',
                      title: 'Personal Loan',
                      subtitle: 'In 24h • Instant Disbursal',
                      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'business-loan',
                      title: 'Business Loan',
                      subtitle: '₹50L Limit • Collateral Free',
                      image: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'gold-loan',
                      title: 'Gold Loan',
                      subtitle: 'Instant Cash • Low Interest',
                      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80'
                    }
                  ],
                  // Slide 2 (4 items in 2x2 grid)
                  [
                    {
                      id: 'vehicle-loan',
                      title: 'Vehicle Loan',
                      subtitle: '100% On-road • Fast Approval',
                      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'education-loan',
                      title: 'Education Loan',
                      subtitle: 'Global & India • Low Margin',
                      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'property-loan',
                      title: 'Loan Against Property',
                      subtitle: 'Up to ₹5 Cr • Low Interest',
                      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'commercial-loan',
                      title: 'Commercial Loan',
                      subtitle: 'Tarapur MIDC & Boisar Hub',
                      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
                    }
                  ]
                ].map((slide, slideIdx) => (
                  <div
                    key={slideIdx}
                    className="w-full min-w-full shrink-0 snap-start grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4"
                  >
                    {slide.map((loan) => (
                      <div
                        key={loan.id}
                        onClick={() => router.push(`/search?query=${encodeURIComponent(loan.title)}`)}
                        className="group relative aspect-[1.15/1] sm:aspect-[1.3/1] md:aspect-[1.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-200/90 bg-slate-900"
                      >
                        {/* Full-bleed photo */}
                        <img decoding="async" src={loan.image}
                          alt={loan.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Dark gradient overlay matching reference */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                        {/* Bottom Content Bar matching user's image */}
                        <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-10 pointer-events-none text-left">
                          <h4 className="text-white font-black text-xs sm:text-sm lg:text-base leading-tight drop-shadow-md">
                            {loan.title}
                          </h4>
                          {loan.subtitle && (
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold mt-0.5 truncate hidden min-[360px]:block">
                              {loan.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insurance Plans Section - 2x2 Grid with Swipe */}
          <div className="py-2 sm:py-4">
            {/* Left-Aligned Section Header with Emerald Underline */}
            <div className="text-left mb-3.5 sm:mb-4 px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight inline-block">
                Insurance <span className="border-b-4 border-emerald-500 pb-0.5">Plans</span>
              </h3>
              <p className="text-[11px] min-[400px]:text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 tracking-wide">
                100% Cashless Claims • Complete Family Cover
              </p>
            </div>

            {/* Carousel Container with Left & Right Arrow Buttons */}
            <div className="relative group px-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollInsuranceLeft}
                aria-label="Scroll Left"
                className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Right Arrow Button (Emerald circular button) */}
              <button
                type="button"
                onClick={scrollInsuranceRight}
                aria-label="Scroll Right"
                className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* 2x2 Grid per slide with Swipe Track */}
              <div
                ref={insuranceRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 snap-x snap-mandatory"
              >
                {[
                  // Slide 1 (4 items in 2x2 grid)
                  [
                    {
                      id: 'health-insurance',
                      title: 'Health Insurance',
                      subtitle: 'Cashless • 10,000+ Hospitals',
                      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'term-life',
                      title: 'Term Life Cover',
                      subtitle: '₹1 Cr Cover • From ₹490/mo',
                      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'vehicle-insurance',
                      title: 'Vehicle Cover',
                      subtitle: 'In 2 Mins • Zero Dep Included',
                      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'shop-insurance',
                      title: 'Shop & Godown',
                      subtitle: 'Tarapur MIDC • Fire & Theft',
                      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
                    }
                  ],
                  // Slide 2 (4 items in 2x2 grid)
                  [
                    {
                      id: 'home-insurance',
                      title: 'Home & Flat',
                      subtitle: 'From ₹3/Day • Structure & Assets',
                      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'travel-insurance',
                      title: 'Travel Policy',
                      subtitle: 'Worldwide • Flight & Medical',
                      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'fire-insurance',
                      title: 'Fire & Burglary',
                      subtitle: 'Factory, Warehouse & Stock',
                      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'senior-health',
                      title: 'Senior Citizen Care',
                      subtitle: 'Pre-existing Illness Covered',
                      image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=600&q=80'
                    }
                  ]
                ].map((slide, slideIdx) => (
                  <div
                    key={slideIdx}
                    className="w-full min-w-full shrink-0 snap-start grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4"
                  >
                    {slide.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => router.push(`/search?query=${encodeURIComponent(plan.title)}`)}
                        className="group relative aspect-[1.15/1] sm:aspect-[1.3/1] md:aspect-[1.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-200/90 bg-slate-900"
                      >
                        {/* Full-bleed photo */}
                        <img decoding="async" src={plan.image}
                          alt={plan.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Dark gradient overlay matching reference */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                        {/* Bottom Content Bar matching user's image */}
                        <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-10 pointer-events-none text-left">
                          <h4 className="text-white font-black text-xs sm:text-sm lg:text-base leading-tight drop-shadow-md">
                            {plan.title}
                          </h4>
                          {plan.subtitle && (
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold mt-0.5 truncate hidden min-[360px]:block">
                              {plan.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Digital Marketing Services Section - 2x2 Grid with Swipe */}
          <div className="py-2 sm:py-4">
            {/* Left-Aligned Section Header with Red Underline */}
            <div className="text-left mb-3.5 sm:mb-4 px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight inline-block">
                Digital Marketing <span className="border-b-4 border-red-500 pb-0.5">Services</span>
              </h3>
              <p className="text-[11px] min-[400px]:text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 tracking-wide">
                Leading Digital Marketing Agency in India
              </p>
            </div>

            {/* Carousel Container with Left & Right Arrow Buttons */}
            <div className="relative group px-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollDigitalLeft}
                aria-label="Scroll Left"
                className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Right Arrow Button (Red circular button from reference screenshot) */}
              <button
                type="button"
                onClick={scrollDigitalRight}
                aria-label="Scroll Right"
                className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 hover:bg-red-700 shadow-md flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* 2x2 Grid per slide with Swipe Track */}
              <div
                ref={digitalMarketingRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 snap-x snap-mandatory"
              >
                {[
                  // Slide 1 (4 items in 2x2 grid - Front Slide)
                  [
                    {
                      id: 'influencer-marketing',
                      title: 'Creator Collaborations',
                      subtitle: 'Boisar & Palghar Influencers',
                      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                      targetUrl: '/creators'
                    },
                    {
                      id: 'web-dev',
                      title: 'Web Development',
                      subtitle: 'Modern Websites & Apps',
                      image: '/marketing/web-dev.jpg'
                    },
                    {
                      id: 'ugc-video',
                      title: 'UGC Video Ads',
                      subtitle: 'High Converting Content',
                      image: '/marketing/ugc-video.jpg'
                    },
                    {
                      id: 'graphic-design',
                      title: 'Graphic Designing',
                      subtitle: 'Logos, Banners & Branding',
                      image: '/marketing/graphic-design.jpg'
                    }
                  ],
                  // Slide 2 (4 items in 2x2 grid)
                  [
                    {
                      id: 'social-media',
                      title: 'Social Media Growth',
                      subtitle: 'Instagram & Facebook Ads',
                      image: '/marketing/social-media.jpg'
                    },
                    {
                      id: 'local-pr',
                      title: 'Google My Business',
                      subtitle: 'Local SEO & Reviews',
                      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'performance-ads',
                      title: 'Performance Marketing',
                      subtitle: 'Meta & WhatsApp Funnels',
                      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'seo',
                      title: 'SEO & Google Ranking',
                      subtitle: '#1 Rank & Leads',
                      image: '/marketing/seo.jpg'
                    }
                  ]
                ].map((slide, slideIdx) => (
                  <div
                    key={slideIdx}
                    className="w-full min-w-full shrink-0 snap-start grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4"
                  >
                    {slide.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          if (service.targetUrl) {
                            router.push(service.targetUrl);
                          } else if (service.id === 'influencer-marketing') {
                            router.push('/creators');
                          } else {
                            router.push(`/search?query=${encodeURIComponent(service.title)}`);
                          }
                        }}
                        className="group relative aspect-[1.15/1] sm:aspect-[1.3/1] md:aspect-[1.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-200/90 bg-slate-900"
                      >
                        {/* Full-bleed photo */}
                        <img decoding="async" src={service.image}
                          alt={service.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Dark gradient overlay matching reference */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                        {/* Bottom Content Bar matching user's image */}
                        <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-10 pointer-events-none text-left">
                          <h4 className="text-white font-black text-xs sm:text-sm lg:text-base leading-tight drop-shadow-md">
                            {service.title}
                          </h4>
                          {service.subtitle && (
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold mt-0.5 truncate hidden min-[360px]:block">
                              {service.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stores & Shopping Section - 2x2 Grid with Swipe */}
          <div className="py-2 sm:py-4">
            {/* Left-Aligned Section Header with Indigo Underline */}
            <div className="text-left mb-3.5 sm:mb-4 px-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight inline-block">
                Stores &amp; <span className="border-b-4 border-indigo-500 pb-0.5">Shopping</span>
              </h3>
              <p className="text-[11px] min-[400px]:text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 tracking-wide">
                Explore Boisar&apos;s Best Stores &amp; Markets
              </p>
            </div>

            {/* Carousel Container with Left & Right Arrow Buttons */}
            <div className="relative group px-1">
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={scrollStoreLeft}
                aria-label="Scroll Left"
                className="absolute -left-2 sm:-left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* Right Arrow Button (Indigo circular button) */}
              <button
                type="button"
                onClick={scrollStoreRight}
                aria-label="Scroll Right"
                className="absolute -right-2 sm:-right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>

              {/* 2x2 Grid per slide with Swipe Track */}
              <div
                ref={storeRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 snap-x snap-mandatory"
              >
                {[
                  // Slide 1 (Front: Daily Groceries, Jewellery & Gold, Home Appliances, Electronics)
                  [
                    {
                      id: 'grocery',
                      title: 'Daily Groceries',
                      subtitle: 'Express Delivery | Fresh Daily',
                      searchQuery: 'Grocery',
                      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'jewellery',
                      title: 'Jewellery & Gold',
                      subtitle: 'Hallmarked & Bridal Sets',
                      searchQuery: 'Jewellery',
                      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'appliances',
                      title: 'Home Appliances',
                      subtitle: 'ACs, TVs & Kitchen Setup',
                      searchQuery: 'Appliances',
                      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'electronics',
                      title: 'Electronics & Mobiles',
                      subtitle: '0% EMI | Brand Warranty',
                      searchQuery: 'Electronics',
                      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
                    }
                  ],
                  // Slide 2 (Fashion, Furniture, Books & Supplies, Fitness & Sports)
                  [
                    {
                      id: 'fashion',
                      title: 'Fashion & Boutiques',
                      subtitle: 'Ethnic & Western Latest Trends',
                      searchQuery: 'Clothing',
                      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'furniture',
                      title: 'Furniture & Living',
                      subtitle: 'Factory Prices | Home Decor',
                      searchQuery: 'Furniture',
                      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'books',
                      title: 'Books & Supplies',
                      subtitle: 'School & College | Office Needs',
                      searchQuery: 'Stationery',
                      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80'
                    },
                    {
                      id: 'sports',
                      title: 'Fitness & Sports',
                      subtitle: 'Original Gear | Supplements',
                      searchQuery: 'Gym',
                      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
                    }
                  ]
                ].map((slide, slideIdx) => (
                  <div
                    key={slideIdx}
                    className="w-full min-w-full shrink-0 snap-start grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4"
                  >
                    {slide.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          const query = item.searchQuery || item.title;
                          router.push(`/search?query=${encodeURIComponent(query)}`);
                        }}
                        className="group relative aspect-[1.15/1] sm:aspect-[1.3/1] md:aspect-[1.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-slate-200/90 bg-slate-900"
                      >
                        {/* Full-bleed photo */}
                        <img decoding="async" src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Dark gradient overlay matching reference */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                        {/* Bottom Content Bar matching user's image */}
                        <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-10 pointer-events-none text-left">
                          <h4 className="text-white font-black text-xs sm:text-sm lg:text-base leading-tight drop-shadow-md">
                            {item.title}
                          </h4>
                          {item.subtitle && (
                            <p className="text-white/80 text-[10px] sm:text-xs font-semibold mt-0.5 truncate hidden min-[360px]:block">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Assistance Footer (Short & Compact) */}
          <div className="max-w-xl mx-auto py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-2.5 text-left shadow-2xs">
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] sm:text-xs md:text-[13px] font-black text-slate-900 leading-tight">Need Help or List Business?</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Chat with Boisar Team</p>
            </div>
            <a
              href="https://wa.me/917769947217?text=Hi%20Majh%20Boisar,%20I%20need%20help%20with%20Loans/Insurance/Digital%20Marketing/Store"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#0d6e5a] hover:bg-[#0a5848] text-white text-[10.5px] sm:text-xs font-black transition-all shadow-xs shrink-0 inline-flex items-center gap-1 active:scale-95"
            >
              <span>WhatsApp</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>


      {/* Daily Online & Travel Services (Train Ticket, Flight Ticket, Aadhaar Card, PAN Card) - placed above Boisar Places */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="bg-[#f8fafc] rounded-3xl border border-slate-200/90 p-3 sm:p-5 shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            
            {/* 1. Train Ticket */}
            <div
              onClick={() => setSelectedUtilityService('train')}
              className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-2.5 sm:gap-4 cursor-pointer group select-none"
            >
              <div className="relative shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 56 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="50" height="32" rx="6" fill="#fff" stroke="#1e293b" strokeWidth="2.5"/>
                  <path d="M3 22H9" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M47 22H53" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M15 17H27" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 27H35" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="41" cy="14" r="8" fill="#ef4444"/>
                  <path d="M37.5 14L40 16.5L45 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs sm:text-base lg:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                  Train Ticket
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate hidden min-[380px]:block">
                  IRCTC &amp; PNR Status
                </p>
              </div>
            </div>

            {/* 2. Flight Ticket */}
            <div
              onClick={() => setSelectedUtilityService('flight')}
              className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-2.5 sm:gap-4 cursor-pointer group select-none"
            >
              <div className="relative shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 56 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 24L26 8L34 14L24 24L38 27L42 32L32 32L26 38L22 36L24 28L10 24Z" fill="#fff" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M8 36H48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
                  <circle cx="41" cy="14" r="8" fill="#ef4444"/>
                  <circle cx="41" cy="14" r="3" fill="white"/>
                </svg>
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs sm:text-base lg:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                  Flight Ticket
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate hidden min-[380px]:block">
                  Domestic &amp; Global Booking
                </p>
              </div>
            </div>

            {/* 3. Aadhaar Card */}
            <div
              onClick={() => setSelectedUtilityService('aadhaar')}
              className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-2.5 sm:gap-4 cursor-pointer group select-none"
            >
              <div className="relative shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6C13.1 6 6 13.1 6 22C6 30.9 13.1 38 22 38C30.9 38 38 30.9 38 22" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M14 22C14 17.6 17.6 14 22 14C26.4 14 30 17.6 30 22" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 22C18 19.8 19.8 18 22 18C24.2 18 26 19.8 26 22" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 22V32" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="34" cy="10" r="5" fill="#ef4444"/>
                  <path d="M32 10H36" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs sm:text-base lg:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                  Aadhaar Card
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate hidden min-[380px]:block">
                  UIDAI Services &amp; Update
                </p>
              </div>
            </div>

            {/* 4. PAN Card */}
            <div
              onClick={() => setSelectedUtilityService('pan')}
              className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-2.5 sm:gap-4 cursor-pointer group select-none"
            >
              <div className="relative shrink-0 w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="10" width="32" height="24" rx="4" fill="#fff" stroke="#1e293b" strokeWidth="2.5"/>
                  <circle cx="14" cy="20" r="3.5" stroke="#1e293b" strokeWidth="2"/>
                  <path d="M10 28C10 26 12 25 14 25C16 25 18 26 18 28" stroke="#1e293b" strokeWidth="2"/>
                  <path d="M22 17H32" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 23H30" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="34" cy="10" r="5" fill="#ef4444"/>
                  <path d="M34 8V12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="min-w-0 text-left">
                <h4 className="text-xs sm:text-base lg:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight">
                  PAN Card
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 truncate hidden min-[380px]:block">
                  Apply &amp; Link Aadhaar
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 8. Iconic Places You Need to See (Boisar & Palghar Travel Destinations placed at the bottom of the page) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5 sm:mt-6 mb-2 sm:mb-3">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#064e3b] tracking-tight">
              Iconic places you need to see
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-0.5">
              Must-visit beaches, sea forts &amp; scenic spots in &amp; around Boisar
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={scrollIconicLeft}
              aria-label="Previous Destinations"
              className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={scrollIconicRight}
              aria-label="Next Destinations"
              className="w-8 h-8 rounded-full bg-[#064e3b] text-white shadow-xs hover:bg-[#043d2e] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Destination Cards Track */}
        <div
          ref={iconicScrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 snap-x snap-mandatory"
        >
          {BOISAR_ICONIC_PLACES.map((place) => (
            <div
              key={place.id}
              onClick={() => setSelectedIconicPlace(place)}
              className="w-[170px] min-[400px]:w-[195px] sm:w-[220px] md:w-[240px] aspect-[3.2/4.2] sm:aspect-[3.2/4.4] rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer shrink-0 snap-start border border-slate-100"
            >
              <img decoding="async" src={place.image}
                alt={place.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/places/chinchani-beach.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 z-10">
                <span className="bg-white/90 backdrop-blur-xs text-[#064e3b] text-[9.5px] sm:text-[10.5px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {place.category}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                <h3 className="text-white font-extrabold text-base sm:text-lg lg:text-xl leading-tight drop-shadow-sm group-hover:text-emerald-300 transition-colors">
                  {place.name}
                </h3>
                <p className="text-white/80 text-[11px] sm:text-xs font-medium mt-0.5 truncate">
                  {place.distance}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ==================== SPONSOR AD SLOT BUILDER MODAL ==================== */}
      <AdModal isOpen={adModalOpen} onClose={() => setAdModalOpen(false)} />

      {/* Interactive Special Booking Panel (Slide-over panel / Drawer) */}
      {activeSpecialCategory && (
        <div className={`fixed inset-0 z-[600] overflow-hidden ${
          activeSpecialCategory === 'properties' 
            ? 'p-0 flex flex-col justify-start items-stretch' 
            : 'p-2 sm:p-4 flex items-center justify-center'
        }`}>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setActiveSpecialCategory(null);
              setSelectedProfile(null);
              setPropertyMode(null);
            }}
          />
          
          {/* Panel Container (Full Page Overlay for Portals) */}
          <div className={`relative bg-slate-50 flex flex-col z-10 transition-all duration-300 overflow-hidden w-full ${
            activeSpecialCategory === 'properties'
              ? 'h-full h-[100dvh] max-h-[100dvh] rounded-none'
              : 'h-full max-h-[92vh] sm:max-h-[85vh] max-w-5xl rounded-3xl shadow-2xl border border-slate-200'
          }`}>

            {/* Full Real Estate Portal Navbar Header — Fully responsive on iPhone & Android */}
            {selectedProfile?.listingType === 'property' ? null : activeSpecialCategory === 'properties' ? (
              <div className="px-2.5 min-[390px]:px-4 sm:px-6 min-h-[58px] sm:h-18 border-b border-slate-200 flex items-center justify-between gap-1.5 sm:gap-4 bg-white text-slate-800 shadow-sm z-30 shrink-0 sticky top-0 pt-[env(safe-area-inset-top,0px)]">
                {/* Logo & Portal Badge — Beautifully sized so it never pushes other buttons out */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
                  <img 
                    src="/majh-boisar-full-logo.png" 
                    alt="Majh Boisar" 
                    className="h-8 min-[360px]:h-9 min-[390px]:h-10 sm:h-13 md:h-15 max-w-[130px] min-[360px]:max-w-[155px] min-[390px]:max-w-[200px] sm:max-w-none w-auto object-contain cursor-pointer transition-transform active:scale-95 shrink-0"
                    onClick={() => {
                      setActiveSpecialCategory(null);
                      setSelectedProfile(null);
                      setPropertyMode(null);
                    }}
                  />
                  <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#da0c23]/10 border border-[#da0c23]/25 text-[#da0c23] text-[10px] font-black uppercase shrink-0">
                    Real Estate
                  </span>
                </div>

                {/* Right Action Items: Enquiries, Free Calls & Close — Guaranteed visible on all phones */}
                <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5 shrink-0">
                  <button
                    onClick={() => setViewEnquiriesModalOpen(true)}
                    className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 min-[360px]:px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-colors relative shadow-xs shrink-0 cursor-pointer"
                    title="View property inquiries"
                  >
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" />
                    <span className="hidden min-[430px]:inline">Enquiries</span>
                    {(() => {
                      try {
                        if (typeof window === 'undefined') return null;
                        const raw = localStorage.getItem('majh_boisar_property_enquiries');
                        const list = raw ? JSON.parse(raw) : [];
                        if (!Array.isArray(list)) return null;
                        const userPhoneDigits = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '';
                        const myUserPropsRaw = localStorage.getItem('majh_boisar_user_properties');
                        const myUserProps = myUserPropsRaw ? JSON.parse(myUserPropsRaw) : [];
                        const myPropIds = new Set(Array.isArray(myUserProps) ? myUserProps.map((p: any) => p.id) : []);

                        const count = list.filter((enq: any) => {
                          if (!enq) return false;
                          if (myPropIds.has(enq.propertyId)) return true;
                          if (userPhoneDigits && enq.ownerPhone) {
                            const enqOwnerDigits = String(enq.ownerPhone).replace(/\D/g, '');
                            if (enqOwnerDigits && (enqOwnerDigits.endsWith(userPhoneDigits) || userPhoneDigits.endsWith(enqOwnerDigits))) return true;
                          }
                          return false;
                        }).length;

                        return count > 0 ? (
                          <span className="bg-rose-500 text-white text-[9px] sm:text-[9.5px] font-black px-1.5 py-0.2 rounded-full">
                            {count}
                          </span>
                        ) : null;
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </button>

                  {/* Free Calls Quota Badge / Buyer Pass Button */}
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        setLoginModalOpen(true);
                      } else {
                        setBuyerPassModalOpen(true);
                      }
                    }}
                    className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-black px-2 min-[360px]:px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
                      !isLoggedIn 
                        ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                        : userUnlockedPropsState.length >= 2 && buyerCallCredits <= 0
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Your Free Owner Contact Quota"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    <span>
                      {!isLoggedIn 
                        ? '2 Free Calls'
                        : userUnlockedPropsState.length < 2 
                          ? `${2 - userUnlockedPropsState.length} Free`
                          : buyerCallCredits > 0 
                            ? `${buyerCallCredits} Calls` 
                            : 'Pass'}
                    </span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveSpecialCategory(null);
                      setSelectedProfile(null);
                      setPropertyMode(null);
                    }}
                    className="p-1 sm:p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0 cursor-pointer ml-0.5"
                    title="Exit Real Estate Portal"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white text-slate-800 shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                  {!selectedProfile && (
                    <button
                      onClick={() => {
                        setActiveSpecialCategory(null);
                        setSelectedProfile(null);
                        setPropertyMode(null);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold flex items-center gap-1 text-xs transition-colors cursor-pointer"
                      title="Go Back"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-800" />
                      <span className="text-xs font-bold text-slate-800">Back</span>
                    </button>
                  )}

                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5 truncate">
                    <span className="text-sm">✨</span> 
                    {activeSpecialCategory === 'influencers' && "Boisar Influencers & Creators"}
                    {activeSpecialCategory === 'helpers' && "Domestic Helpers & Maids"}
                    {activeSpecialCategory === 'caterers' && "Event Chefs & Caterers"}
                  </h2>
                </div>

                <button 
                  onClick={() => {
                    setActiveSpecialCategory(null);
                    setSelectedProfile(null);
                    setPropertyMode(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div ref={portalContentRef} className={`flex-1 overflow-y-auto ${activeSpecialCategory === 'properties' || selectedProfile?.listingType === 'property' ? 'p-0' : 'p-4 sm:p-6 space-y-6'}`}>
              {selectedProfile?.listingType === 'property' ? (
                /* PROPERTY DETAIL VIEW (Exact NoBroker Style) */
                <div className="animate-in fade-in duration-200 bg-slate-50 min-h-full pb-28 relative text-left">
                  {(() => {
                    const photos = selectedProfile.gallery?.length ? selectedProfile.gallery : [selectedProfile.avatar || '/imagess/nobroker_3d_house.jpg'];
                    const activePhoto = photos[activePhotoIndex % photos.length] || photos[0];
                    const isShortlisted = shortlistedPropIds.includes(selectedProfile.id);
                    const propTitle = selectedProfile.category || selectedProfile.name || `${selectedProfile.bedrooms || 1} BHK Flat for ${selectedProfile.forAction || 'Sale'}`;
                    const propLocation = selectedProfile.address || selectedProfile.location || selectedProfile.addressLocality || 'Boisar, Maharashtra';
                    const similarProps = (profilesState.properties || [])
                      .filter((p: any) => {
                        if (p.listingType !== 'property') return false;
                        if (p.id === selectedProfile.id) return false;
                        const isSoldOrRented = Boolean(
                          p.isSold || 
                          p.status?.toLowerCase().includes('sold') || 
                          p.status?.toLowerCase().includes('rented')
                        );
                        return !isSoldOrRented;
                      })
                      .slice(0, 8);
                    const isPropertySold = Boolean(
                      selectedProfile.isSold || 
                      selectedProfile.status?.toLowerCase().includes('sold') || 
                      selectedProfile.status?.toLowerCase().includes('rented')
                    );
                    const postedByRole = (selectedProfile.postedBy || selectedProfile.iAm || 'Owner').trim();

                    return (
                      <div className="flex flex-col">
                        {/* 1. Sticky Top Red App Header (Image 2 & 3) */}
                        <div className="sticky top-0 z-40 bg-[#e50914] text-white px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between shadow-md">
                          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                            <button 
                              type="button"
                              onClick={() => setSelectedProfile(null)}
                              className="p-1.5 -ml-1 text-white hover:bg-white/15 rounded-full transition-colors cursor-pointer shrink-0 active:scale-95"
                              title="Back to property listings"
                            >
                              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                            </button>
                            <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-md">
                              {propTitle}
                            </h2>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={handleShareProperty}
                              className="p-2 text-white hover:bg-white/15 rounded-full transition-colors cursor-pointer active:scale-95"
                              title="Share Property"
                            >
                              <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleShortlistProperty(selectedProfile.id)}
                              className="p-2 text-white hover:bg-white/15 rounded-full transition-colors cursor-pointer active:scale-95"
                              title="Save to Wishlist"
                            >
                              <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-all ${isShortlisted ? 'fill-white text-white scale-110' : 'text-white'}`} />
                            </button>
                            <button
                              type="button"
                              onClick={closePortal}
                              className="p-2 text-white hover:bg-white/15 rounded-full transition-colors cursor-pointer ml-0.5 active:scale-95"
                              title="Close"
                            >
                              <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            </button>
                          </div>
                        </div>

                        {/* Sold Out Banner if closed */}
                        {isPropertySold && (
                          <div className="w-full bg-rose-600 text-white px-4 py-2.5 flex items-center justify-between text-xs font-black">
                            <span className="flex items-center gap-1.5">
                              <Lock className="w-4 h-4" />
                              <span>THIS PROPERTY HAS BEEN {(selectedProfile.forAction || '').toLowerCase() === 'rent' ? 'RENTED OUT' : 'SOLD OUT'}</span>
                            </span>
                            <span className="bg-black/20 text-[10px] uppercase px-2 py-0.5 rounded-sm">Archived</span>
                          </div>
                        )}

                        {/* 2. Main Edge-to-Edge Hero Image Carousel (Image 2) */}
                        <div className="relative w-full h-[260px] min-[390px]:h-[300px] sm:h-[420px] bg-slate-950 overflow-hidden select-none">
                          <img
                            src={activePhoto}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                          />
                          <img
                            src={activePhoto}
                            alt={propTitle}
                            onClick={() => setFullImagePreview(activePhoto)}
                            className="w-full h-full object-contain relative z-[1] cursor-pointer"
                          />

                          {/* Watermark / Logo Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2] opacity-35">
                            <span className="text-white font-black tracking-widest text-lg sm:text-2xl drop-shadow-md select-none">
                              MAJH BOISAR
                            </span>
                          </div>

                          {/* Photos counter badge */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 z-10 pointer-events-none">
                            <Camera className="w-3.5 h-3.5 text-white" />
                            <span>{activePhotoIndex + 1}/{photos.length} Photos</span>
                          </div>

                          {/* Full Photo Lightbox Trigger Button */}
                          <button
                            type="button"
                            onClick={() => setFullImagePreview(activePhoto)}
                            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10 cursor-pointer shadow-md transition-all active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Full Photo</span>
                          </button>

                          {/* Left & Right Chevrons */}
                          {photos.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                                }}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs z-10 cursor-pointer transition-all active:scale-90"
                                title="Previous"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs z-10 cursor-pointer transition-all active:scale-90"
                                title="Next"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Content Container (Image 2 & 3) */}
                        <div className="max-w-4xl mx-auto w-full space-y-2.5">
                          {/* 3. Title & Price Card (Image 2) */}
                          <div className="bg-white border-b border-slate-200 p-4 sm:p-5 shadow-2xs">
                            <div className="flex items-start justify-between gap-4">
                              {/* Left Column */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <h1 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                                  {propTitle}
                                </h1>
                                <p className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">
                                  <span className="text-slate-400 font-mono text-sm leading-none">↳</span>
                                  <span className="truncate">{propLocation}</span>
                                </p>

                                {/* 3 Key Specs Icons Row */}
                                <div className="flex items-center gap-6 pt-2 text-[11px] sm:text-xs text-slate-600 font-semibold">
                                  <div className="flex flex-col items-center gap-0.5 text-center">
                                    <Armchair className="w-4 h-4 text-slate-500" />
                                    <span className="text-[10px] text-slate-500 leading-tight">{selectedProfile.furnishing || 'Not furnished'}</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 text-center">
                                    <Maximize2 className="w-4 h-4 text-slate-500" />
                                    <span className="text-[10px] text-slate-500 leading-tight">{selectedProfile.carpetArea || selectedProfile.superArea || '650 sqft'}</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 text-center">
                                    <Users className="w-4 h-4 text-slate-500" />
                                    <span className="text-[10px] text-slate-500 leading-tight">
                                      {selectedProfile.preferredTenants || (selectedProfile.forAction === 'Rent' ? 'Family/Bachelors' : 'Family')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Price */}
                              <div className="text-right shrink-0 border-l border-slate-200 pl-4 py-1">
                                <div className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                                  {formatPriceInLacs(selectedProfile.price)}
                                </div>
                                <div className="text-[10px] sm:text-[10.5px] text-slate-500 font-medium mt-0.5">
                                  {selectedProfile.isNegotiable !== false ? 'Price Negotiable' : 'Price Non-Negotiable'}
                                </div>
                                <div className="text-[9.5px] text-emerald-600 font-bold mt-1">
                                  ✓ Verified Listing
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 4. Area & Loan Box (Image 2) */}
                          <div className="bg-white border-y border-slate-200 py-3 px-4 sm:px-6 shadow-2xs">
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                              <div className="text-center">
                                <div className="text-sm sm:text-base font-black text-slate-900">
                                  {selectedProfile.carpetArea || selectedProfile.superArea || '650 SqFt'}
                                </div>
                                <div className="text-[10.5px] text-slate-400 font-semibold mt-0.5">
                                  Built Up Area
                                </div>
                              </div>
                              <div className="text-center flex flex-col items-center justify-center">
                                <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-slate-800">
                                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                                  <span>{selectedProfile.isLoanApproved ? 'Pre-Approved Loan' : 'Loan Available'}</span>
                                </div>
                                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                                  Verified Bank Partners
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 5. Estimated EMI & Apply Loan Box (Image 2) */}
                          <div className="bg-white border-y border-slate-200 p-3.5 sm:p-5 shadow-2xs">
                            <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                                  ₹ {calculateEstimatedEmi(selectedProfile.price).toLocaleString('en-IN')}/Month
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                  Estimated EMI
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="hidden sm:block text-right">
                                  <span className="text-xs font-black text-slate-800 block">Need Home Loan?</span>
                                  <span className="text-[10px] text-slate-400 block">Lowest Rates in Boisar</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setHomeLoanModalOpen(true)}
                                  className="bg-[#e50914] hover:bg-[#c90812] active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
                                >
                                  Apply Loan
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Overview Section (Image 3) */}
                          <div className="bg-white border-y border-slate-200 p-4 sm:p-6 space-y-3.5 shadow-2xs">
                            <div className="border-b-2 border-[#e50914] inline-block pb-1">
                              <h3 className="text-sm sm:text-base font-black text-slate-900">Overview</h3>
                            </div>

                            {/* 2-Column Overview Grid */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                              {/* Row 1 */}
                              <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Bed className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900">
                                      {selectedProfile.bedrooms || '1'} Bedroom
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">No. of Bedroom</div>
                                  </div>
                                </div>
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Calendar className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                      {selectedProfile.createdAt ? new Date(selectedProfile.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">Posted On</div>
                                  </div>
                                </div>
                              </div>

                              {/* Row 2 */}
                              <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Bath className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900">
                                      {selectedProfile.bathrooms || '1'} Bathroom
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">No. of Bathroom</div>
                                  </div>
                                </div>
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Key className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900">
                                      {selectedProfile.status || selectedProfile.possession || 'Immediately'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">Possession</div>
                                  </div>
                                </div>
                              </div>

                              {/* Row 3 */}
                              <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Home className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900">
                                      {selectedProfile.balconies ? `${selectedProfile.balconies} Balcony` : 'NA'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">Balcony</div>
                                  </div>
                                </div>
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Building className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                      {selectedProfile.projectName || selectedProfile.category || 'Apartment'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">Apartment</div>
                                  </div>
                                </div>
                              </div>

                              {/* Row 4 */}
                              <div className="grid grid-cols-2 divide-x divide-slate-200">
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Car className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900">
                                      {selectedProfile.parking || 'Bike & Car'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">Parking</div>
                                  </div>
                                </div>
                                <div className="p-3 sm:p-3.5 flex items-start gap-2.5">
                                  <Zap className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs sm:text-sm font-black text-slate-900">
                                      {selectedProfile.powerBackup || 'Full'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">Power Backup</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Detailed Specifications Table */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
                              <div className="grid grid-cols-2 p-3 items-center">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                  <Building className="w-4 h-4 text-slate-400" />
                                  <span>Builtup Area</span>
                                </div>
                                <div className="font-bold text-slate-900">
                                  {selectedProfile.superArea || selectedProfile.carpetArea || '650 Sq.Ft'}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 p-3 items-center">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                  <Compass className="w-4 h-4 text-slate-400" />
                                  <span>Facing</span>
                                </div>
                                <div className="font-bold text-slate-900">
                                  {selectedProfile.facing || 'East'}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 p-3 items-center">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                  <Layers className="w-4 h-4 text-slate-400" />
                                  <span>Floor</span>
                                </div>
                                <div className="font-bold text-slate-900">
                                  {selectedProfile.floor ? `${selectedProfile.floor}/${selectedProfile.totalFloors || 4}` : '2/4'}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 p-3 items-center">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                                  <span>Gated Security</span>
                                </div>
                                <div className="font-bold text-slate-900">
                                  {selectedProfile.gatedSecurity || 'Yes'}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 p-3 items-center">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                  <FileText className="w-4 h-4 text-slate-400" />
                                  <span>Ownership</span>
                                </div>
                                <div className="font-bold text-slate-900">
                                  {selectedProfile.ownership || 'Freehold'}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 p-3 items-center">
                                <div className="flex items-center gap-2 text-slate-500 font-semibold">
                                  <CheckCircle className="w-4 h-4 text-slate-400" />
                                  <span>Transaction</span>
                                </div>
                                <div className="font-bold text-slate-900">
                                  {selectedProfile.transactionType || 'Resale'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Video Walkthrough (if available) */}
                          {Boolean(selectedProfile.video || (selectedProfile.videos && selectedProfile.videos.length > 0)) && (
                            <div className="bg-white border-y border-slate-200 p-4 sm:p-6 space-y-3 shadow-2xs">
                              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <span>🎥</span>
                                <span>Property Video Walkthrough</span>
                              </h3>
                              <div className="w-full rounded-xl overflow-hidden bg-black aspect-video shadow-xs border border-slate-200">
                                <video 
                                  src={selectedProfile.video || (selectedProfile.videos && selectedProfile.videos[0])} 
                                  controls 
                                  playsInline
                                  preload="metadata"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          )}

                          {/* Bio / Description */}
                          {selectedProfile.bio && (
                            <div className="bg-white border-y border-slate-200 p-4 sm:p-6 space-y-2 shadow-2xs">
                              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-slate-500" />
                                <span>More Details</span>
                              </h3>
                              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                {selectedProfile.bio}
                              </p>
                            </div>
                          )}

                          {/* 7. Neighbourhood Section (Image 4) */}
                          <div className="bg-white border-y border-slate-200 p-4 sm:p-6 space-y-3.5 shadow-2xs">
                            <div className="border-b-2 border-[#e50914] inline-block pb-1">
                              <h3 className="text-sm sm:text-base font-black text-slate-900">Neighbourhood</h3>
                            </div>

                            {/* Direction search box */}
                            <div className="relative">
                              <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2.5 bg-white shadow-2xs">
                                <MapPin className="w-4 h-4 text-[#e50914] shrink-0 mr-2" />
                                <input 
                                  type="text" 
                                  placeholder="Type in place to get direction" 
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = (e.target as HTMLInputElement).value;
                                      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(val)}&destination=${encodeURIComponent(`${selectedProfile.projectName || ''} ${selectedProfile.address || selectedProfile.location || 'Boisar'}`)}`, '_blank');
                                    }
                                  }}
                                  className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    window.open(selectedProfile.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${selectedProfile.projectName || ''} ${selectedProfile.address || selectedProfile.location || 'Boisar'}`)}`, '_blank');
                                  }}
                                  className="text-[11px] font-black text-[#e50914] hover:underline shrink-0 ml-2 cursor-pointer"
                                >
                                  Directions ↗
                                </button>
                              </div>
                            </div>

                            {/* Interactive OpenStreetMap Embed (Reliable & Never Blocked) */}
                            <div className="w-full h-60 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs relative bg-slate-100">
                              <iframe
                                title="Property Location in Boisar"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=72.7200%2C19.7800%2C72.7800%2C19.8200&layer=mapnik&marker=19.8035%2C72.7570"
                              />

                              {/* Floating Pin / Location Badge */}
                              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                                <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-1.5 text-left max-w-[65%]">
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#e50914] animate-pulse shrink-0" />
                                  <span className="text-[11px] font-extrabold text-slate-900 truncate">
                                    {selectedProfile.projectName || selectedProfile.category || 'Property Location'}
                                  </span>
                                </div>

                                <a
                                  href={selectedProfile.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${selectedProfile.projectName || ''} ${selectedProfile.address || selectedProfile.location || 'Boisar, Maharashtra'}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="pointer-events-auto bg-[#e50914] hover:bg-[#cf0812] active:scale-95 text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1 shrink-0"
                                >
                                  <span>Google Maps ↗</span>
                                </a>
                              </div>
                            </div>

                            {/* Filter chips below map */}
                            <div className="flex items-center justify-around pt-1 text-xs font-bold border-b border-slate-100 pb-2">
                              <button
                                type="button"
                                onClick={() => setNeighbourhoodTab('transit')}
                                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                  neighbourhoodTab === 'transit'
                                    ? 'bg-rose-50 text-[#e50914] font-black'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                🚆 Transit
                              </button>
                              <button
                                type="button"
                                onClick={() => setNeighbourhoodTab('essentials')}
                                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                  neighbourhoodTab === 'essentials'
                                    ? 'bg-rose-50 text-[#e50914] font-black'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                🛒 Essentials
                              </button>
                              <button
                                type="button"
                                onClick={() => setNeighbourhoodTab('utility')}
                                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                                  neighbourhoodTab === 'utility'
                                    ? 'bg-rose-50 text-[#e50914] font-black'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                ⚡ Utility
                              </button>
                            </div>

                            {/* Nearby List based on active tab */}
                            <div className="space-y-1.5 pt-0.5 text-left">
                              {neighbourhoodTab === 'transit' && (
                                <>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🚆 Boisar Railway Station (West)</span>
                                    <span className="font-bold text-slate-500 text-[11px]">1.2 km • 5 mins</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🚌 Boisar ST Bus Depot</span>
                                    <span className="font-bold text-slate-500 text-[11px]">1.0 km • 4 mins</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🛺 Chitralaya Auto Stand</span>
                                    <span className="font-bold text-slate-500 text-[11px]">200 m • 1 min</span>
                                  </div>
                                </>
                              )}
                              {neighbourhoodTab === 'essentials' && (
                                <>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🛒 DMart Boisar</span>
                                    <span className="font-bold text-slate-500 text-[11px]">2.1 km • 7 mins</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🛍️ Chitralaya Market & Daily Groceries</span>
                                    <span className="font-bold text-slate-500 text-[11px]">300 m • 2 mins</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🏥 Sanjeevani & Anand Hospital</span>
                                    <span className="font-bold text-slate-500 text-[11px]">1.4 km • 5 mins</span>
                                  </div>
                                </>
                              )}
                              {neighbourhoodTab === 'utility' && (
                                <>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">🏧 SBI & HDFC ATM (Chitralaya)</span>
                                    <span className="font-bold text-slate-500 text-[11px]">350 m • 2 mins</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">⛽ BPCL Petrol Pump (MIDC Road)</span>
                                    <span className="font-bold text-slate-500 text-[11px]">1.5 km • 5 mins</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                                    <span className="font-semibold text-slate-800">👮 Boisar Police Station</span>
                                    <span className="font-bold text-slate-500 text-[11px]">1.9 km • 6 mins</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* 8. Similar Properties Carousel (Image 5) */}
                          {similarProps.length > 0 && (
                            <div className="bg-white border-y border-slate-200 p-4 sm:p-6 space-y-3.5 shadow-2xs">
                              <div className="border-b-2 border-[#e50914] inline-block pb-1">
                                <h3 className="text-sm sm:text-base font-black text-slate-900">Similar Properties</h3>
                              </div>

                              <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 select-none">
                                {similarProps.map((simProp: any) => {
                                  const simPhotos = simProp.gallery?.length ? simProp.gallery : [simProp.avatar || '/imagess/nobroker_3d_house.jpg'];
                                  return (
                                    <div
                                      key={simProp.id}
                                      onClick={() => {
                                        setSelectedProfile(simProp);
                                        setActivePhotoIndex(0);
                                        portalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="w-56 sm:w-64 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:border-slate-300"
                                    >
                                      <div className="relative w-full h-32 bg-slate-950 overflow-hidden">
                                        <img
                                          src={simPhotos[0]}
                                          alt={simProp.category}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 px-2.5 flex items-center justify-between text-white text-[10px] font-bold">
                                          <span className="flex items-center gap-1">
                                            <Armchair className="w-3 h-3 text-slate-300" />
                                            <span>{simProp.furnishing || 'Unfurnished'}</span>
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Maximize2 className="w-3 h-3 text-slate-300" />
                                            <span>{simProp.carpetArea || '650 sqft'}</span>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-left">
                                        <div>
                                          <h4 className="text-xs font-black text-slate-900 truncate">
                                            {simProp.category || simProp.name}
                                          </h4>
                                          <div className="text-sm font-black text-slate-900 mt-1">
                                            {formatPriceInLacs(simProp.price)}
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProfile(simProp);
                                            setActivePhotoIndex(0);
                                            portalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="w-full bg-[#e50914] hover:bg-[#c90812] active:scale-95 text-white text-xs font-black py-2 rounded-xl shadow-xs transition-all cursor-pointer text-center"
                                        >
                                          Contact {simProp.postedBy || 'Owner'}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 9. Sticky Bottom Action Bar (Image 2 & 3) */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 sm:px-6 sm:py-3 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] z-50">
                          <div className="max-w-xl mx-auto flex items-center gap-2.5">
                            {/* Contact Button */}
                            <button
                              type="button"
                              onClick={() => handlePropertyContactCall(selectedProfile, false)}
                              className="flex-1 bg-white hover:bg-slate-50 text-[#e50914] border-2 border-[#e50914] font-black text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <Phone className="w-4 h-4 text-[#e50914]" />
                              <span>{postedByRole.toLowerCase().includes('agent') ? 'Call Agent' : postedByRole.toLowerCase().includes('builder') ? 'Call Builder' : 'Contact'}</span>
                            </button>

                            {/* WhatsApp Button */}
                            <button
                              type="button"
                              onClick={() => handlePropertyContactCall(selectedProfile, true)}
                              className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2.5 sm:p-3 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>

                            {/* Schedule Visit Button (Solid Red #e50914) */}
                            <button
                              type="button"
                              onClick={() => {
                                setEnquirySenderName(userName || '');
                                setEnquirySenderPhone('');
                                setEnquiryMessage(`Hi ${selectedProfile.contactName || 'Owner'}, I would like to schedule a visit for ${propTitle} in Boisar. Please let me know your available time.`);
                                setEnquiryModalProperty(selectedProfile);
                              }}
                              className="flex-1 bg-[#e50914] hover:bg-[#c90812] active:scale-95 text-white font-black text-xs sm:text-sm py-2.5 sm:py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Calendar className="w-4 h-4 text-white" />
                              <span>Schedule Visit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : activeSpecialCategory === 'properties' && propertyMode === null ? (
                <div className="w-full bg-white min-h-full flex flex-col pb-20 sm:pb-24">
                  {/* NoBroker Style Buy/Rent/Commercial Hero Section */}
                  <div className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-2.5 sm:py-3 text-center shadow-2xs">
                    <div className="max-w-2xl mx-auto space-y-2.5">
                      
                      {/* 1. Three Tabs (Buy / Rent / Commercial) with active red underline */}
                      <div className="flex items-center justify-center gap-10 sm:gap-16 border-b border-slate-200/80 pt-1">
                        {[
                          { id: 'buy', label: 'Buy' },
                          { id: 'rent', label: 'Rent' },
                          { id: 'commercial', label: 'Commercial' }
                        ].map((tab) => {
                          const isActive = activePropertyTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => {
                                setActivePropertyTab(tab.id as any);
                                if (tab.id === 'commercial') {
                                  setPropertyTypeFilter('Commercial');
                                } else {
                                  setPropertyTypeFilter('All Types');
                                }
                              }}
                              className={`text-base sm:text-lg font-black tracking-tight transition-all cursor-pointer pb-2 sm:pb-2.5 relative px-1.5 sm:px-2 ${
                                isActive
                                  ? 'text-[#e50914]'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {tab.label}
                              {isActive && (
                                <span className="absolute bottom-0 inset-x-0 h-[3px] bg-[#e50914] rounded-full shadow-xs" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* 2. Compact Dark Promo Card: "Looking for Tenants / Buyers ?" */}
                      <div className="bg-[#36241c] rounded-xl p-2.5 sm:p-3 text-white relative overflow-hidden shadow-xs border border-amber-950/40 text-left">
                        {/* Content Left */}
                        <div className="max-w-[64%] sm:max-w-[68%] space-y-1 z-10 relative">
                          <h3 className="text-xs sm:text-[13px] font-black text-white tracking-tight leading-tight">
                            Looking for Tenants / Buyers ?
                          </h3>
                          <div className="space-y-0.5 text-[9.5px] sm:text-[10px] text-amber-100/90 font-semibold">
                            <div className="flex items-center gap-1.5">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Faster &amp; Verified Tenants/Buyers</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isLoggedIn) {
                                showToast("Please login first to post your property.", "info", 4000);
                                setLoginModalOpen(true);
                                return;
                              }
                              setPostPropertyModalOpen(true);
                            }}
                            className="mt-0.5 bg-[#e50914] hover:bg-[#c90812] active:scale-95 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-md shadow-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Post FREE Property Ad</span>
                          </button>
                        </div>

                        {/* 3D House & Key Illustration Right */}
                        <div className="absolute right-0 bottom-0 top-0 w-[36%] sm:w-[32%] flex items-center justify-end pointer-events-none overflow-hidden">
                          <img
                            src="/imagess/nobroker_3d_house.jpg"
                            alt="Looking for Tenants / Buyers"
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#36241c] to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* Clean Locality Filter Chips */}
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5 select-none text-xs sm:text-[13px] justify-start sm:justify-center scroll-smooth">
                        <button
                          type="button"
                          onClick={() => setPropertyAreaFilter('All Areas')}
                          className={`px-3.5 sm:px-4 py-1.5 rounded-full font-black whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                            propertyAreaFilter === 'All Areas'
                              ? 'bg-[#e50914] text-white border-[#e50914] shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          All Areas
                        </button>
                        {BOISAR_PROPERTY_AREAS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => setPropertyAreaFilter(area === propertyAreaFilter ? 'All Areas' : area)}
                            className={`px-3.5 sm:px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border active:scale-95 ${
                              propertyAreaFilter === area
                                ? 'bg-[#e50914] text-white border-[#e50914] shadow-sm'
                                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Listings matching selected Tab & Search */}
                  <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-3 text-left flex-1 bg-slate-50/50">
                    {(() => {
                      const allProps = (profilesState.properties || []).filter((p: any) => p.listingType === 'property');
                      const filteredListings = allProps.filter((p: any) => {
                        // 1. Tab filter (Buy vs Rent vs Commercial)
                        const isRentListing = p.forAction === 'Rent' || p.category?.toLowerCase().includes('rent') || p.transactionType === 'Lease';
                        const isCommercialListing = (p.category || '').toLowerCase().includes('shop') || (p.category || '').toLowerCase().includes('office') || (p.category || '').toLowerCase().includes('commercial');
                        
                        if (activePropertyTab === 'buy') {
                          if (isRentListing) return false;
                        } else if (activePropertyTab === 'rent') {
                          if (!isRentListing) return false;
                        } else if (activePropertyTab === 'commercial') {
                          if (!isCommercialListing) return false;
                        }

                        // 2. Keyword/Locality Search input
                        if (propertySearchQuery.trim()) {
                          const q = propertySearchQuery.toLowerCase().trim();
                          const text = `${p.location || ''} ${p.addressLocality || ''} ${p.projectName || ''} ${p.title || ''} ${p.name || ''} ${p.category || ''} ${p.address || ''}`.toLowerCase();
                          if (!text.includes(q)) return false;
                        }

                        // 3. Area filter chip
                        if (propertyAreaFilter !== 'All Areas') {
                          const text = `${p.location || ''} ${p.addressLocality || ''} ${p.projectName || ''} ${p.title || ''} ${p.name || ''} ${p.category || ''}`.toLowerCase();
                          if (!text.includes(propertyAreaFilter.toLowerCase())) return false;
                        }

                        // 4. Type & BHK
                        if (propertyTypeFilter !== 'All Types') {
                          const cat = (p.category || '').toLowerCase();
                          if (propertyTypeFilter === 'Flat/Apartment' && !cat.includes('flat') && !cat.includes('apartment') && !cat.includes('bhk')) return false;
                          if (propertyTypeFilter === 'Commercial' && !cat.includes('shop') && !cat.includes('office') && !cat.includes('commercial')) return false;
                          if (propertyTypeFilter === 'Plot/Land' && !cat.includes('plot') && !cat.includes('land')) return false;
                          if (propertyTypeFilter === 'Villa/House' && !cat.includes('villa') && !cat.includes('house') && !cat.includes('bungalow')) return false;
                        }
                        if (bhkFilter !== 'All BHK') {
                          const cat = `${p.category || ''} ${p.name || ''} ${p.title || ''}`.toLowerCase();
                          if (!cat.includes(bhkFilter.toLowerCase())) return false;
                        }
                        return true;
                      }).sort((a: any, b: any) => {
                        const isSoldA = Boolean(a.isSold || a.status?.toLowerCase().includes('sold') || a.status?.toLowerCase().includes('rented'));
                        const isSoldB = Boolean(b.isSold || b.status?.toLowerCase().includes('sold') || b.status?.toLowerCase().includes('rented'));
                        if (isSoldA !== isSoldB) return isSoldA ? 1 : -1;

                        const isFeatA = Boolean(a.isFeatured || a.featured);
                        const isFeatB = Boolean(b.isFeatured || b.featured);
                        if (isFeatA !== isFeatB) return isFeatA ? -1 : 1;

                        if (propertySortBy === 'price_low') return (Number(a.price) || 0) - (Number(b.price) || 0);
                        if (propertySortBy === 'price_high') return (Number(b.price) || 0) - (Number(a.price) || 0);
                        if (propertySortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
                        return 0;
                      });

                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                              {activePropertyTab === 'buy' ? 'Properties for Sale' : activePropertyTab === 'rent' ? 'Properties for Rent' : 'Commercial Properties'} {propertyAreaFilter !== 'All Areas' ? `in ${propertyAreaFilter}` : ''} ({filteredListings.length})
                            </h3>
                            <button
                              type="button"
                              onClick={() => setPropertyMode(activePropertyTab === 'rent' ? 'rent' : 'buy')}
                              className="text-[11px] font-black text-[#e50914] hover:underline cursor-pointer"
                            >
                              Explore All →
                            </button>
                          </div>

                          {filteredListings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                              {filteredListings.slice(0, 8).map((property: any) => {
                                const isSoldOut = Boolean(property.isSold || property.status?.toLowerCase().includes('sold') || property.status?.toLowerCase().includes('rented'));
                                const isRentProp = property.forAction === 'Rent' || property.category?.toLowerCase().includes('rent') || property.transactionType === 'Lease';
                                const isFeaturedProp = Boolean(property.isFeatured || property.featured) && !isSoldOut;
                                const isShortlisted = shortlistedPropIds.includes(property.id);

                                const propGallery: string[] = (property.gallery && property.gallery.length > 0)
                                  ? property.gallery
                                  : property.avatar
                                    ? [property.avatar]
                                    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'];

                                return (
                                <div
                                  key={property.id}
                                  onClick={() => {
                                    if (isSoldOut) {
                                      showToast(isRentProp ? '🔒 This property is rented out and closed.' : '🔒 This property is sold out and closed.', 'info');
                                      return;
                                    }
                                    setSelectedProfile(property);
                                  }}
                                  className={`rounded-2xl border transition-all flex flex-col group text-left relative overflow-hidden bg-white shadow-2xs hover:shadow-lg ${
                                    isSoldOut
                                      ? 'border-slate-300 opacity-75 grayscale-[25%] cursor-not-allowed select-none'
                                      : isFeaturedProp
                                        ? 'cursor-pointer border-amber-300 ring-1 ring-amber-400/40 hover:border-amber-400'
                                        : 'cursor-pointer border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {/* Top Area: Solid dark panel when Sold Out, or photos when Available */}
                                  {isSoldOut ? (
                                    <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none relative shrink-0">
                                      <div className={`px-5 py-3 rounded-2xl border-2 shadow-2xl text-center transform -rotate-3 ${
                                        isRentProp 
                                          ? 'bg-amber-500 border-amber-300 text-slate-950' 
                                          : 'bg-rose-600 border-rose-300 text-white'
                                      }`}>
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                          <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                          <span className="text-sm sm:text-base font-black uppercase tracking-wider">
                                            {isRentProp ? 'RENTED OUT' : 'SOLD OUT'}
                                          </span>
                                        </div>
                                        <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase opacity-95 tracking-wide block">
                                          Not Available • Property Closed
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full relative bg-slate-50 pt-2.5 px-2.5 overflow-hidden shrink-0">
                                      {propGallery.length <= 1 ? (
                                        <div className="w-full h-56 sm:h-64 rounded-2xl bg-slate-950 overflow-hidden relative shadow-2xs flex items-center justify-center">
                                          <img
                                            src={propGallery[0]}
                                            alt=""
                                            aria-hidden="true"
                                            className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-40 pointer-events-none"
                                          />
                                          <img
                                            src={propGallery[0]}
                                            alt={property.name || property.category}
                                            className="relative max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                          />
                                        </div>
                                      ) : (
                                        <div 
                                          className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory py-0.5 select-none"
                                        >
                                          {propGallery.map((imgUrl: string, idx: number) => (
                                            <div 
                                              key={idx} 
                                              className="w-[60%] sm:w-[50%] shrink-0 h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-950 snap-start relative shadow-2xs border border-slate-200/50 flex items-center justify-center"
                                            >
                                              <img
                                                src={imgUrl}
                                                alt=""
                                                aria-hidden="true"
                                                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-40 pointer-events-none"
                                              />
                                              <img decoding="async" src={imgUrl}
                                                alt={`${property.name || property.category} photo ${idx + 1}`}
                                                className="relative max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                                loading="lazy"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Top-Left: Gallery Count & Type Badge */}
                                      <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10 pointer-events-none">
                                        <div className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <Camera className="w-3 h-3 text-slate-200" />
                                          <span>{propGallery.length}+</span>
                                        </div>
                                        <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                          {isRentProp ? 'RENT' : 'SALE'}
                                        </span>
                                      </div>

                                      {/* Top-Right: Floating Circular Share Button */}
                                      <div className="absolute top-4 right-4 z-20">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (navigator.share) {
                                              navigator.share({
                                                title: property.title || property.category || 'Property in Boisar',
                                                url: window.location.href,
                                              }).catch(() => {});
                                            } else {
                                              navigator.clipboard.writeText(window.location.href);
                                              showToast('Property link copied to clipboard! 📋', 'success');
                                            }
                                          }}
                                          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer backdrop-blur-xs"
                                          title="Share Property"
                                        >
                                          <Share2 className="w-3.5 h-3.5 text-slate-600" />
                                        </button>
                                      </div>

                                      {/* Video Pill */}
                                      {Boolean(property.video || (property.videos && property.videos.length > 0)) && (
                                        <div className="absolute bottom-4 right-4 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-10">
                                          <span>🎥 Video Tour</span>
                                        </div>
                                      )}

                                      {/* Featured Badge */}
                                      {isFeaturedProp && (
                                        <div className="absolute bottom-4 left-4 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 shadow-xs flex items-center gap-1 border border-amber-300">
                                          <span>⭐ FEATURED</span>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Card Body (Image 2 NoBroker Content Layout) */}
                                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 min-w-0">
                                    <div>
                                      {/* Row 1: Title (Left) & Price (Right) */}
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
                                            {property.category || property.title || property.name || 'Property for Sale'}{property.projectName ? ` in ${property.projectName}` : ''}
                                          </h4>
                                          <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                                            {property.projectName || (isRentProp ? 'Rental Property in Boisar' : 'Verified Owner Listing in Boisar')}
                                          </p>
                                        </div>

                                        <div className="text-right shrink-0">
                                          <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
                                            {formatPriceInLacs(property.price || property.budget)}
                                          </span>
                                          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block">
                                            {property.pricePerSqft || (isRentProp ? '/month' : 'Negotiable')}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Row 2: Location with green return arrow ↳ (Single clean location row) */}
                                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-2 line-clamp-1">
                                        <span className="text-emerald-600 font-bold text-sm leading-none shrink-0">↳</span>
                                        <span className="truncate">{property.addressLocality || property.address || property.location || 'Boisar, Palghar'}</span>
                                      </p>

                                      {/* Row 3: Landmark ONLY if distinct from address */}
                                      {Boolean(property.landmark && property.landmark !== property.addressLocality && property.landmark !== property.location) && (
                                        <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-[10.5px] sm:text-[11px] text-slate-600 mt-2.5">
                                          <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                          <span className="truncate font-medium">Near {property.landmark}</span>
                                        </div>
                                      )}

                                      {/* Row 4: 3-Column Specs Divider (Image 2 style) */}
                                      <div className="grid grid-cols-3 border-y border-slate-100 py-2.5 my-3 divide-x divide-slate-100 text-center">
                                        <div className="flex flex-col items-center justify-center px-1">
                                          <Armchair className="w-4 h-4 text-slate-400 mb-0.5" />
                                          <span className="text-[11px] font-semibold text-slate-700 truncate max-w-full">
                                            {property.furnishing || 'Unfurnished'}
                                          </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center px-1">
                                          <Maximize2 className="w-4 h-4 text-slate-400 mb-0.5" />
                                          <span className="text-[11px] font-semibold text-slate-700 truncate max-w-full">
                                            {property.carpetArea || '650 sqft'}
                                          </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center px-1">
                                          <Compass className="w-4 h-4 text-slate-400 mb-0.5" />
                                          <span className="text-[11px] font-semibold text-slate-700 truncate max-w-full">
                                            {property.facing || property.status || 'Ready'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Row 5: Action Row (Details on left, Vibrant Red Contact Owner on right) */}
                                    <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/60 transition-colors">
                                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Details</span>
                                      </div>

                                      {isSoldOut ? (
                                        <span className={`text-xs font-black px-3 py-1.5 rounded-xl border flex items-center gap-1 ${
                                          isRentProp 
                                            ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                            : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                          <Lock className="w-3 h-3" />
                                          <span>{isRentProp ? 'Rented Out' : 'Sold Out'}</span>
                                        </span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProfile(property);
                                          }}
                                          className="bg-[#E13B4B] hover:bg-[#cf2f3e] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <span>Contact {property.postedBy || 'Owner'}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 text-center space-y-4 shadow-xs my-3 max-w-lg mx-auto">
                              {/* Icon Badge */}
                              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-[#e50914] flex items-center justify-center mx-auto shadow-2xs">
                                <Building className="w-7 h-7 text-[#e50914]" />
                              </div>

                              {/* Title & Description */}
                              <div className="space-y-1">
                                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                                  {propertyAreaFilter !== 'All Areas' ? `No Properties Found in ${propertyAreaFilter}` : 'No Properties Found'}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                                  {propertyAreaFilter !== 'All Areas'
                                    ? `Be the first owner to list a property in ${propertyAreaFilter} , or explore available homes across Boisar.`
                                    : 'Be the first owner to list a property and connect directly with genuine buyers.'}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                                {propertyAreaFilter !== 'All Areas' && (
                                  <button
                                    type="button"
                                    onClick={() => setPropertyAreaFilter('All Areas')}
                                    className="w-full sm:w-auto border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95"
                                  >
                                    Explore All Areas
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!isLoggedIn) {
                                      showToast("Please login first to post your property.", "info", 4000);
                                      setLoginModalOpen(true);
                                      return;
                                    }
                                    setPostPropertyModalOpen(true);
                                  }}
                                  className="w-full sm:w-auto bg-[#e50914] hover:bg-[#cf0812] active:scale-95 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Post Free Property</span>
                                </button>
                              </div>

                              {/* Trust Highlights */}
                              
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              ) : activeSpecialCategory === 'properties' ? (
                <div className="w-full bg-slate-50 min-h-full flex flex-col pb-20 sm:pb-24">
                  {/* Top Bar with Buy/Rent Switcher & Compact Filters - Natural Scroll (Scrolls away, only seen at top) */}
                  <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 sm:py-2.5 shadow-2xs">
                    <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
                      {/* Left: Back button & Mode Switcher */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPropertyMode(null)}
                          className="p-1 sm:p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold flex items-center gap-1 text-xs transition-colors cursor-pointer"
                          title="Back to Real Estate Home"
                        >
                          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
                          <span className="hidden sm:inline text-xs font-bold text-slate-800">Home</span>
                        </button>

                        <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-lg sm:rounded-xl">
                          <button
                            type="button"
                            onClick={() => setPropertyMode('buy')}
                            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                              propertyMode === 'buy'
                                ? 'bg-[#da0c23] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Buy
                          </button>
                          <button
                            type="button"
                            onClick={() => setPropertyMode('rent')}
                            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer ${
                              propertyMode === 'rent'
                                ? 'bg-[#da0c23] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Rent
                          </button>
                        </div>
                      </div>

                      {/* Right: Post Property Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isLoggedIn) {
                            showToast("Please login first to post your property.", "info", 4000);
                            setLoginModalOpen(true);
                            return;
                          }
                          setPostPropertyModalOpen(true);
                        }}
                        className="bg-[#da0c23] hover:bg-[#b8081c] active:scale-95 text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl transition-all shadow-xs flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-white" />
                        <span className="hidden sm:inline">Post Property</span>
                        <span className="sm:hidden">Post</span>
                      </button>
                    </div>

                    {/* Filter Dropdowns Bar - Compact 2-col on mobile, 4-col on desktop */}
                    <div className="max-w-5xl mx-auto pt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                      {/* Type Filter */}
                      <div className="relative min-w-0">
                        <select
                          value={propertyTypeFilter}
                          onChange={(e) => setPropertyTypeFilter(e.target.value)}
                          className={`w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer outline-none shadow-2xs border text-left truncate ${
                            propertyTypeFilter !== 'All Types'
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-extrabold ring-1 ring-teal-500/20'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-250 hover:border-slate-350'
                          }`}
                        >
                          <option value="All Types">🏠 All Types</option>
                          <option value="Flat/Apartment">Flat / Apartment</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Plot/Land">Plot / Land</option>
                          <option value="Villa/House">Villa / House</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* BHK Filter */}
                      <div className="relative min-w-0">
                        <select
                          value={bhkFilter}
                          onChange={(e) => setBhkFilter(e.target.value)}
                          className={`w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer outline-none shadow-2xs border text-left truncate ${
                            bhkFilter !== 'All BHK'
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-extrabold ring-1 ring-teal-500/20'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-250 hover:border-slate-350'
                          }`}
                        >
                          <option value="All BHK">🛏️ All BHK</option>
                          <option value="1 BHK">1 BHK</option>
                          <option value="2 BHK">2 BHK</option>
                          <option value="3 BHK">3 BHK</option>
                          <option value="4+ BHK">4+ BHK</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Area Filter Dropdown */}
                      <div className="relative min-w-0">
                        <select
                          value={propertyAreaFilter}
                          onChange={(e) => setPropertyAreaFilter(e.target.value)}
                          className={`w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer outline-none shadow-2xs border text-left truncate ${
                            propertyAreaFilter !== 'All Areas'
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-extrabold ring-1 ring-teal-500/20'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-250 hover:border-slate-350'
                          }`}
                        >
                          <option value="All Areas">📍 All Areas</option>
                          {BOISAR_PROPERTY_AREAS.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Sort Dropdown */}
                      <div className="relative min-w-0">
                        <select
                          value={propertySortBy}
                          onChange={(e) => setPropertySortBy(e.target.value as any)}
                          className={`w-full appearance-none pl-2.5 pr-6 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer outline-none shadow-2xs border text-left truncate ${
                            propertySortBy !== 'relevance'
                              ? 'bg-teal-50 border-teal-500 text-teal-900 font-extrabold ring-1 ring-teal-500/20'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-250 hover:border-slate-350'
                          }`}
                        >
                          <option value="relevance">⚡ Relevance</option>
                          <option value="price_low">💰 Price: Low</option>
                          <option value="price_high">💎 Price: High</option>
                          <option value="newest">🕒 Newest</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Quick Area Chips Row - Sleek Rounded Pills */}
                    <div className="max-w-5xl mx-auto pt-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 select-none">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                        <MapPin className="w-3.5 h-3.5 text-[#e50914]" />
                        Area:
                      </span>
                      <button
                        type="button"
                        onClick={() => setPropertyAreaFilter('All Areas')}
                        className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                          propertyAreaFilter === 'All Areas'
                            ? 'bg-[#e50914] text-white border-[#e50914] shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                        }`}
                      >
                        All
                      </button>
                      {BOISAR_PROPERTY_AREAS.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setPropertyAreaFilter(area === propertyAreaFilter ? 'All Areas' : area)}
                          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border active:scale-95 ${
                            propertyAreaFilter === area
                              ? 'bg-[#e50914] text-white border-[#e50914] shadow-xs'
                              : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listings Grid - Responsive 2-column grid on desktop */}
                  <div className="max-w-5xl mx-auto w-full p-2.5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 text-left flex-1">
                    {((profilesState.properties || []).filter((p: any) => p.listingType === 'property'))
                      .filter((p: any) => {
                        if (propertyMode === 'buy') {
                          const isRentOnly = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                          if (isRentOnly) return false;
                        } else if (propertyMode === 'rent') {
                          const isRent = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                          if (!isRent) return false;
                        }
                        if (bhkFilter !== 'All BHK') {
                          const num = bhkFilter.split(' ')[0];
                          const pText = `${p.category || ''} ${p.name || ''} ${p.title || ''}`.toLowerCase();
                          const pBed = Number(p.bedrooms || 0);
                          if (num === '4+') {
                            if (!pText.includes('4 bhk') && !pText.includes('5 bhk') && pBed < 4) return false;
                          } else if (num && !pText.includes(`${num} bhk`) && !pText.includes(`${num}bhk`) && pBed !== Number(num)) {
                            return false;
                          }
                        }
                        if (propertyTypeFilter !== 'All Types') {
                          if (propertyTypeFilter.includes('Flat') && !p.category?.toLowerCase().includes('flat') && !p.category?.toLowerCase().includes('apartment') && !p.category?.toLowerCase().includes('bhk')) return false;
                          if (propertyTypeFilter.includes('Commercial') && !p.category?.toLowerCase().includes('commercial') && !p.category?.toLowerCase().includes('shop') && !p.category?.toLowerCase().includes('office')) return false;
                          if (propertyTypeFilter.includes('Plot') && !p.category?.toLowerCase().includes('plot') && !p.category?.toLowerCase().includes('land')) return false;
                          if (propertyTypeFilter.includes('Villa') && !p.category?.toLowerCase().includes('villa') && !p.category?.toLowerCase().includes('house') && !p.category?.toLowerCase().includes('bungalow')) return false;
                        }
                        if (propertyAreaFilter !== 'All Areas') {
                          const pLoc = `${p.location || ''} ${p.addressLocality || ''} ${p.projectName || ''} ${p.title || ''} ${p.name || ''} ${p.category || ''}`.toLowerCase();
                          if (!pLoc.includes(propertyAreaFilter.toLowerCase())) return false;
                        }
                        return true;
                      })
                      .sort((a: any, b: any) => {
                        const isSoldA = Boolean(a.isSold || a.status?.toLowerCase().includes('sold') || a.status?.toLowerCase().includes('rented'));
                        const isSoldB = Boolean(b.isSold || b.status?.toLowerCase().includes('sold') || b.status?.toLowerCase().includes('rented'));
                        if (isSoldA !== isSoldB) return isSoldA ? 1 : -1;

                        const isFeatA = Boolean(a.isFeatured || a.featured);
                        const isFeatB = Boolean(b.isFeatured || b.featured);
                        if (isFeatA !== isFeatB) return isFeatA ? -1 : 1;

                        const priceA = parseFloat(String(a.price || a.budget || 0).replace(/[^\d.]/g, '')) || 0;
                        const priceB = parseFloat(String(b.price || b.budget || 0).replace(/[^\d.]/g, '')) || 0;
                        if (propertySortBy === 'price_low') return priceA - priceB;
                        if (propertySortBy === 'price_high') return priceB - priceA;
                        if (propertySortBy === 'newest') {
                          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                          return dateB - dateA;
                        }
                        return 0;
                      })
                      .map((profile: any) => {
                        const isSoldOut = Boolean(profile.isSold || profile.status?.toLowerCase().includes('sold') || profile.status?.toLowerCase().includes('rented'));
                        const isRentProp = profile.forAction === 'Rent' || profile.category?.toLowerCase().includes('rent') || profile.transactionType === 'Lease';
                        const isFeaturedProp = Boolean(profile.isFeatured || profile.featured) && !isSoldOut;
                        const isShortlisted = shortlistedPropIds.includes(profile.id);

                        const propGallery: string[] = (profile.gallery && profile.gallery.length > 0)
                          ? profile.gallery
                          : profile.avatar
                            ? [profile.avatar]
                            : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'];

                        return (
                        <div 
                          key={profile.id}
                          className={`rounded-2xl border transition-all flex flex-col group text-left relative overflow-hidden bg-white shadow-2xs hover:shadow-lg ${
                            isSoldOut
                              ? 'border-slate-300 opacity-75 grayscale-[25%] cursor-not-allowed select-none'
                              : isFeaturedProp
                                ? 'cursor-pointer border-amber-300 ring-1 ring-amber-400/40 hover:border-amber-400'
                                : 'cursor-pointer border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => {
                            if (isSoldOut) {
                              showToast(isRentProp ? '🔒 This property is rented out and closed.' : '🔒 This property is sold out and closed.', 'info');
                              return;
                            }
                            setSelectedProfile(profile);
                          }}
                        >
                          {/* Top Area: Solid dark panel when Sold Out, or photos when Available */}
                          {isSoldOut ? (
                            <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none relative shrink-0">
                              <div className={`px-5 py-3 rounded-2xl border-2 shadow-2xl text-center transform -rotate-3 ${
                                isRentProp 
                                  ? 'bg-amber-500 border-amber-300 text-slate-950' 
                                  : 'bg-rose-600 border-rose-300 text-white'
                              }`}>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                  <span className="text-sm sm:text-base font-black uppercase tracking-wider">
                                    {isRentProp ? 'RENTED OUT' : 'SOLD OUT'}
                                  </span>
                                </div>
                                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase opacity-95 tracking-wide block">
                                  Not Available • Property Closed
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full relative bg-slate-50 pt-2.5 px-2.5 overflow-hidden shrink-0">
                              {propGallery.length <= 1 ? (
                                <div className="w-full h-56 sm:h-64 rounded-2xl bg-slate-950 overflow-hidden relative shadow-2xs flex items-center justify-center">
                                  <img
                                    src={propGallery[0]}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-40 pointer-events-none"
                                  />
                                  <img
                                    src={propGallery[0]}
                                    alt={profile.name || profile.category}
                                    className="relative max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="flex items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory py-0.5 select-none"
                                >
                                  {propGallery.map((imgUrl: string, idx: number) => (
                                    <div 
                                      key={idx} 
                                      className="w-[60%] sm:w-[50%] shrink-0 h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-950 snap-start relative shadow-2xs border border-slate-200/50 flex items-center justify-center"
                                    >
                                      <img
                                        src={imgUrl}
                                        alt=""
                                        aria-hidden="true"
                                        className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-40 pointer-events-none"
                                      />
                                      <img decoding="async" src={imgUrl}
                                        alt={`${profile.name || profile.category} photo ${idx + 1}`}
                                        className="relative max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                        loading="lazy"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Top-Left: Gallery Count & Type Badge & VIP Badge */}
                              <div className="absolute top-4 left-4 flex items-center gap-1.5 z-10 flex-wrap pointer-events-none">
                                <div className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Camera className="w-3 h-3 text-slate-200" />
                                  <span>{propGallery.length}+</span>
                                </div>
                                <span className="bg-slate-950/80 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                                  {isRentProp ? 'RENT' : 'SALE'}
                                </span>
                                {(() => {
                                  const vipBadge = getPropertyVipBadge(profile);
                                  if (!vipBadge) return null;
                                  return (
                                    <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 border ${
                                      vipBadge === 'VIP Developer'
                                        ? 'bg-purple-900/90 text-amber-300 border-amber-400/80'
                                        : vipBadge === 'VIP Broker'
                                          ? 'bg-blue-900/90 text-cyan-300 border-cyan-400/80'
                                          : 'bg-emerald-900/90 text-emerald-300 border-emerald-400/80'
                                    }`}>
                                      👑 {vipBadge}
                                    </span>
                                  );
                                })()}
                              </div>

                              {/* Top-Right: Floating Circular Share Button */}
                              <div className="absolute top-4 right-4 z-20">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (navigator.share) {
                                      navigator.share({
                                        title: profile.title || profile.category || 'Property in Boisar',
                                        url: window.location.href,
                                      }).catch(() => {});
                                    } else {
                                      navigator.clipboard.writeText(window.location.href);
                                      showToast('Property link copied to clipboard! 📋', 'success');
                                    }
                                  }}
                                  className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer backdrop-blur-xs"
                                  title="Share Property"
                                >
                                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                                </button>
                              </div>

                              {/* Video Pill */}
                              {Boolean(profile.video || (profile.videos && profile.videos.length > 0)) && (
                                <div className="absolute bottom-4 right-4 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm z-10">
                                  <span>🎥 Video Tour</span>
                                </div>
                              )}

                              {/* Featured Badge */}
                              {isFeaturedProp && !getPropertyVipBadge(profile) && (
                                <div className="absolute bottom-4 left-4 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 shadow-xs flex items-center gap-1 border border-amber-300">
                                  <span>⭐ FEATURED</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Card Body (Image 2 NoBroker Content Layout) */}
                          <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              {/* Row 1: Title (Left) & Price (Right) */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors">
                                    {profile.category || profile.title || profile.name || 'Property'}{profile.projectName ? ` in ${profile.projectName}` : ''}
                                  </h4>
                                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                                    {profile.projectName || (isRentProp ? 'Rental Property in Boisar' : 'Verified Owner Listing in Boisar')}
                                  </p>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
                                    {formatPriceInLacs(profile.price || profile.budget)}
                                  </span>
                                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block">
                                    {profile.pricePerSqft || (isRentProp ? '/month' : 'Negotiable')}
                                  </span>
                                </div>
                              </div>

                              {/* Row 2: Location with green return arrow ↳ & Map Link */}
                              <div className="flex items-center justify-between gap-1.5 mt-2">
                                <p className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5 line-clamp-1 min-w-0 flex-1">
                                  <span className="text-emerald-600 font-bold text-sm leading-none shrink-0">↳</span>
                                  <span className="truncate">{profile.addressLocality || profile.address || profile.location || 'Boisar, Palghar'}</span>
                                </p>
                                {(profile.mapUrl || hasDirectOwnerCall(profile)) && (
                                  <a
                                    href={profile.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${profile.projectName || profile.category || 'Property'}, ${profile.addressLocality || profile.location || 'Boisar'}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-0.5 text-[9.5px] font-extrabold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded shrink-0 transition-colors"
                                  >
                                    <MapPin className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                                    <span>Map ↗</span>
                                  </a>
                                )}
                              </div>

                              {/* Row 3: Landmark ONLY if distinct from address */}
                              {Boolean(profile.landmark && profile.landmark !== profile.addressLocality && profile.landmark !== profile.location) && (
                                <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-[10.5px] sm:text-[11px] text-slate-600 mt-2.5">
                                  <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                  <span className="truncate font-medium">Near {profile.landmark}</span>
                                </div>
                              )}

                              {/* Row 4: 3-Column Specs Divider (Image 2 style) */}
                              <div className="grid grid-cols-3 border-y border-slate-100 py-2.5 my-3 divide-x divide-slate-100 text-center">
                                <div className="flex flex-col items-center justify-center px-1">
                                  <Armchair className="w-4 h-4 text-slate-400 mb-0.5" />
                                  <span className="text-[11px] font-semibold text-slate-700 truncate max-w-full">
                                    {profile.furnishing || 'Unfurnished'}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center px-1">
                                  <Maximize2 className="w-4 h-4 text-slate-400 mb-0.5" />
                                  <span className="text-[11px] font-semibold text-slate-700 truncate max-w-full">
                                    {profile.carpetArea || '650 sqft'}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center justify-center px-1">
                                  <Compass className="w-4 h-4 text-slate-400 mb-0.5" />
                                  <span className="text-[11px] font-semibold text-slate-700 truncate max-w-full">
                                    {profile.facing || profile.status || 'Ready'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Row 5: Action Row (Enquiry/Details on left, Red Contact Owner on right) */}
                            <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEnquirySenderName(userName || '');
                                  setEnquirySenderPhone('');
                                  setEnquiryMessage(`Hi ${profile.contactName || 'Owner'}, I am interested in your property (${profile.category || 'listing'}). Please share details.`);
                                  setEnquiryModalProperty(profile);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/60 transition-colors cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Enquiry</span>
                              </button>

                              {isSoldOut ? (
                                <span className={`text-xs font-black px-3 py-1.5 rounded-xl border flex items-center gap-1 ${
                                  isRentProp 
                                    ? 'bg-amber-50 text-amber-800 border-amber-300' 
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                  <Lock className="w-3 h-3" />
                                  <span>{isRentProp ? 'Rented Out' : 'Sold Out'}</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePropertyContactCall(profile, false);
                                  }}
                                  className="bg-[#E13B4B] hover:bg-[#cf2f3e] text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Contact {profile.postedBy || 'Owner'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    {(profilesState.properties || [])
                      .filter((p: any) => p.listingType === 'property')
                      .filter((p: any) => {
                        if (propertyMode === 'buy') {
                          const isRentOnly = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                          if (isRentOnly) return false;
                        } else if (propertyMode === 'rent') {
                          const isRent = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                          if (!isRent) return false;
                        }
                        if (bhkFilter !== 'All BHK') {
                          const num = bhkFilter.split(' ')[0];
                          if (num && !p.category?.includes(`${num} BHK`) && p.bedrooms !== parseInt(num)) return false;
                        }
                        if (propertyTypeFilter !== 'All Types') {
                          if (propertyTypeFilter.includes('Flat') && !p.category?.toLowerCase().includes('flat') && !p.category?.toLowerCase().includes('bhk')) return false;
                          if (propertyTypeFilter.includes('Villa') && !p.category?.toLowerCase().includes('villa') && !p.category?.toLowerCase().includes('house')) return false;
                          if (propertyTypeFilter.includes('Plot') && !p.category?.toLowerCase().includes('plot') && !p.category?.toLowerCase().includes('land')) return false;
                        }
                        if (propertyAreaFilter !== 'All Areas') {
                          const pLoc = `${p.location || ''} ${p.addressLocality || ''} ${p.projectName || ''} ${p.title || ''} ${p.name || ''} ${p.category || ''}`.toLowerCase();
                          if (!pLoc.includes(propertyAreaFilter.toLowerCase())) return false;
                        }
                        return true;
                      }).length === 0 && (
                      <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-slate-200/90 shadow-xs my-4 space-y-4 max-w-lg mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-[#e50914] flex items-center justify-center mx-auto shadow-2xs">
                          <Building className="w-7 h-7 text-[#e50914]" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                            {propertyAreaFilter !== 'All Areas' ? `No Properties Found in ${propertyAreaFilter}` : 'No Property Listings Yet'}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                            {propertyAreaFilter !== 'All Areas' 
                              ? `Be the first owner to list a property in ${propertyAreaFilter} , or explore available homes across Boisar.` 
                              : 'Post your property for sale or rent to reach genuine buyers across Boisar & Palghar.'}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                          {propertyAreaFilter !== 'All Areas' && (
                            <button
                              type="button"
                              onClick={() => setPropertyAreaFilter('All Areas')}
                              className="w-full sm:w-auto border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95"
                            >
                              Explore All Areas
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (!isLoggedIn) {
                                showToast("Please login first to post your property.", "info", 4000);
                                setLoginModalOpen(true);
                              } else {
                                setPostPropertyModalOpen(true);
                              }
                            }}
                            className="w-full sm:w-auto bg-[#e50914] hover:bg-[#cf0812] active:scale-95 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Post Free Property</span>
                          </button>
                        </div>

                        
                      </div>
                    )}
                  </div>
                </div>
              ) : !selectedProfile ? (
                /* 1. LIST OF PROFILES — Upwork Grid style */
                <div className="space-y-3 max-w-5xl mx-auto">
                  {/* Clean Jobs-Style Compact White Header */}
                  <div className="flex items-center justify-between gap-2.5 text-left pb-1">
                    <div className="min-w-0">
                      <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight truncate">
                        {activeSpecialCategory === 'helpers' && "Domestic Helpers in Boisar"}
                        {activeSpecialCategory === 'influencers' && "Content Creators & Influencers"}
                        {activeSpecialCategory === 'caterers' && "Local Chefs & Event Caterers"}
                      </h1>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium truncate">
                        {activeSpecialCategory === 'helpers' && "Verified maids, drivers, cooks, babysitters & cleaners."}
                        {activeSpecialCategory === 'influencers' && "Local influencers for cafe, store & brand promotions."}
                        {activeSpecialCategory === 'caterers' && "Authentic catering for weddings, parties & events."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          setLoginModalOpen(true);
                          setActiveSpecialCategory(null);
                        } else {
                          const cat = activeSpecialCategory;
                          setProfileModalCategory(cat);
                          if (cat === 'influencers') setNewProfileCategory('Content Creator');
                          if (cat === 'helpers') setNewProfileCategory('House Maid');
                          if (cat === 'caterers') setNewProfileCategory('Grand Caterer');
                          setActiveSpecialCategory(null);
                          setAddProfileModalOpen(true);
                        }
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[10.5px] sm:text-xs font-black px-3 py-1.5 rounded-lg cursor-pointer shadow-2xs transition-all shrink-0 active:scale-95 flex items-center gap-1 whitespace-nowrap"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Profile</span>
                    </button>
                  </div>

                  {/* Circular Story-Style Category Circles (Premium Vector Icons) */}
                  {activeSpecialCategory === 'helpers' && (
                    <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto py-2 px-1 no-scrollbar text-center">
                      {[
                        { id: 'All', label: 'All Helpers', icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
                        { id: 'Maid', label: 'House Maid', icon: Sparkles, color: 'text-amber-700 bg-amber-50 border-amber-300' },
                        { id: 'Driver', label: 'Car Driver', icon: Car, color: 'text-blue-700 bg-blue-50 border-blue-300' },
                        { id: 'Cook', label: 'Cook / Chef', icon: Utensils, color: 'text-rose-700 bg-rose-50 border-rose-300' },
                        { id: 'Nanny', label: 'Babysitter', icon: Heart, color: 'text-pink-700 bg-pink-50 border-pink-300' },
                        { id: 'Cleaning', label: 'Deep Clean', icon: ShieldCheck, color: 'text-teal-700 bg-teal-50 border-teal-300' },
                        { id: 'Electrician', label: 'Electrician', icon: Zap, color: 'text-amber-700 bg-amber-50 border-amber-300' },
                      ].map((item) => {
                        const isSelected = helperFilterRole === item.id;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setHelperFilterRole(item.id)}
                            className="flex flex-col items-center gap-1 group cursor-pointer shrink-0 transition-transform active:scale-95"
                          >
                            {/* Perfect Circle Frame */}
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full aspect-square flex items-center justify-center transition-all duration-200 border-2 ${
                                isSelected
                                  ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105 ring-2 ring-slate-900 ring-offset-2'
                                  : `${item.color} hover:scale-105 shadow-2xs`
                              }`}
                            >
                              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-white' : ''}`} />
                            </div>

                            {/* Label Below */}
                            <span
                              className={`text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                                isSelected ? 'text-slate-950 font-black' : 'text-slate-600 group-hover:text-slate-900'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {activeSpecialCategory === 'caterers' && (
                    <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto py-2 px-1 no-scrollbar text-center">
                      {[
                        { id: 'All', label: 'All Caterers', icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
                        { id: 'Wedding', label: 'Wedding & Party', icon: Utensils, color: 'text-rose-700 bg-rose-50 border-rose-300' },
                        { id: 'Corporate', label: 'Corporate MIDC', icon: Building, color: 'text-blue-700 bg-blue-50 border-blue-300' },
                        { id: 'Chaat', label: 'Live Chaat', icon: Sparkles, color: 'text-amber-700 bg-amber-50 border-amber-300' },
                      ].map((item) => {
                        const isSelected = helperFilterRole === item.id;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setHelperFilterRole(item.id)}
                            className="flex flex-col items-center gap-1 group cursor-pointer shrink-0 transition-transform active:scale-95"
                          >
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full aspect-square flex items-center justify-center transition-all duration-200 border-2 ${
                                isSelected
                                  ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105 ring-2 ring-slate-900 ring-offset-2'
                                  : `${item.color} hover:scale-105 shadow-2xs`
                              }`}
                            >
                              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-white' : ''}`} />
                            </div>
                            <span
                              className={`text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                                isSelected ? 'text-slate-950 font-black' : 'text-slate-600 group-hover:text-slate-900'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {activeSpecialCategory === 'influencers' && (
                    <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto py-2 px-1 no-scrollbar text-center">
                      {[
                        { id: 'All', label: 'All Creators', icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
                        { id: 'Food', label: 'Food & Cafes', icon: Utensils, color: 'text-amber-700 bg-amber-50 border-amber-300' },
                        { id: 'Store', label: 'Stores & Shops', icon: Store, color: 'text-blue-700 bg-blue-50 border-blue-300' },
                        { id: 'Reels', label: 'Video & Reels', icon: Camera, color: 'text-rose-700 bg-rose-50 border-rose-300' },
                      ].map((item) => {
                        const isSelected = helperFilterRole === item.id;
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setHelperFilterRole(item.id)}
                            className="flex flex-col items-center gap-1 group cursor-pointer shrink-0 transition-transform active:scale-95"
                          >
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full aspect-square flex items-center justify-center transition-all duration-200 border-2 ${
                                isSelected
                                  ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105 ring-2 ring-slate-900 ring-offset-2'
                                  : `${item.color} hover:scale-105 shadow-2xs`
                              }`}
                            >
                              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-white' : ''}`} />
                            </div>
                            <span
                              className={`text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                                isSelected ? 'text-slate-950 font-black' : 'text-slate-600 group-hover:text-slate-900'
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 pt-0.5 text-left">
                    <p className="text-[10px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                      Available Local Profiles
                    </p>
                    {helperFilterRole !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setHelperFilterRole('All')}
                        className="text-[10px] font-bold text-teal-700 hover:underline cursor-pointer"
                      >
                        Reset Filter ✕
                      </button>
                    )}
                  </div>
                  
                  {/* Grid Layout (2-cols on mobile, 3-cols on tablet, 4-cols on desktop) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 pb-8 items-stretch text-left">
                    {(() => {
                      const userList = profilesState[activeSpecialCategory] || [];
                      const defaultList = (specialProfiles as any)[activeSpecialCategory] || [];
                      const userIds = new Set(userList.map((p: any) => p.id));
                      const combined = [...userList, ...defaultList.filter((p: any) => !userIds.has(p.id))];

                      const filtered = combined.filter((profile: any) => {
                        if (helperFilterRole === 'All') return true;
                        const target = `${profile.category || ''} ${profile.name || ''} ${(profile.services || []).join(' ')} ${profile.bio || ''}`.toLowerCase();
                        if (helperFilterRole === 'Maid') return target.includes('maid') || target.includes('bai') || target.includes('house');
                        if (helperFilterRole === 'Driver') return target.includes('driver') || target.includes('car');
                        if (helperFilterRole === 'Cook') return target.includes('cook') || target.includes('chef') || target.includes('maharaj');
                        if (helperFilterRole === 'Nanny') return target.includes('nanny') || target.includes('baby') || target.includes('child');
                        if (helperFilterRole === 'Cleaning') return target.includes('clean') || target.includes('sweeping') || target.includes('mopping');
                        if (helperFilterRole === 'Electrician') return target.includes('electric') || target.includes('plumb') || target.includes('technician');
                        if (helperFilterRole === 'Wedding') return target.includes('wedding') || target.includes('party');
                        if (helperFilterRole === 'Corporate') return target.includes('corporate') || target.includes('midc') || target.includes('lunch');
                        if (helperFilterRole === 'Chaat') return target.includes('chaat') || target.includes('counter') || target.includes('snacks');
                        if (helperFilterRole === 'Food') return target.includes('food') || target.includes('cafe') || target.includes('restaurant');
                        if (helperFilterRole === 'Store') return target.includes('store') || target.includes('shop') || target.includes('outlet');
                        if (helperFilterRole === 'Reels') return target.includes('reel') || target.includes('vlog') || target.includes('video');
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center my-2 shadow-2xs space-y-2.5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                              ✨
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-slate-800">No Profiles Available in this Category</h4>
                              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                Try exploring another category or check back shortly for updated verified profiles.
                              </p>
                            </div>
                            {helperFilterRole !== 'All' && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => setHelperFilterRole('All')}
                                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl cursor-pointer transition-all"
                                >
                                  View All Categories
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      }

                      return filtered.map((profile: any) => {
                        // Domestic Helper / Specialist Profile Card (All details directly on outer card)
                        return (
                          <div
                            key={profile.id}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all duration-300 relative flex flex-col justify-between"
                          >
                            {/* Cover Image - 100% Clean & Natural without dark shadow glow */}
                            <div className="w-full h-44 sm:h-56 md:h-60 bg-slate-100 relative overflow-hidden shrink-0">
                              <img
                                src={profile.avatar || '/majh-boisar-mb-logo.png'}
                                alt={profile.name}
                                className="w-full h-full object-cover object-center transition-transform duration-500"
                              />
                              
                              {/* Badges on image (top right) */}
                              <div className="absolute top-2 right-2 flex items-center gap-1">
                                {!profile.verified ? (
                                  <span className="bg-rose-500 text-white text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase shadow-xs flex items-center gap-0.5">
                                    ⏳ Pending
                                  </span>
                                ) : (profile.subscription && profile.subscription !== 'Free') ? (
                                  <span className="bg-amber-400 text-amber-950 text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase shadow-xs flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-amber-950" /> Trusted
                                  </span>
                                ) : (
                                  <span className="bg-emerald-500 text-white text-[8.5px] font-black px-2 py-0.5 rounded-md uppercase shadow-xs flex items-center gap-0.5">
                                    <CheckCircle className="w-2.5 h-2.5" /> Verified
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between text-left space-y-2">
                              
                              <div className="space-y-1.5">
                                {/* Name & Location */}
                                <div>
                                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight line-clamp-1">
                                    {profile.name}
                                  </h4>
                                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5 truncate">
                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{profile.location || 'Boisar, MH'}</span>
                                  </p>
                                </div>

                                {/* Rate & Rating Row */}
                                <div className="flex items-center justify-between py-1 border-y border-slate-100 gap-1">
                                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] sm:text-xs font-black text-slate-800">{profile.rating || 5.0}</span>
                                  </div>
                                  <span className="text-emerald-700 font-black text-[10.5px] sm:text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 truncate text-right">
                                    {profile.price || 'Contact'}
                                  </span>
                                </div>

                                {/* Category + Services pills */}
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  <span className="bg-slate-100 text-slate-700 text-[8.5px] sm:text-[9px] font-black px-1.5 py-0.5 rounded border border-slate-200/60">
                                    {profile.category}
                                  </span>
                                  {(profile.services || []).slice(0, 1).map((srv: string, i: number) => (
                                    <span key={i} className="bg-teal-50 text-teal-800 text-[8.5px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-teal-100 truncate max-w-[100px] sm:max-w-[130px]">
                                      ✓ {srv}
                                    </span>
                                  ))}
                                </div>

                                {/* Bio */}
                                <p className="text-[9.5px] sm:text-[10.5px] text-slate-600 font-medium line-clamp-2 leading-relaxed pt-0.5">
                                  {profile.bio || `Available for local work in Boisar.`}
                                </p>
                              </div>

                              {/* Direct Action Buttons on Card (Call + WhatsApp) */}
                              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-100">
                                <a
                                  href={`tel:${profile.phone || '7769947217'}`}
                                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] sm:text-[11px] py-2 px-1 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>Call</span>
                                </a>

                                <a
                                  href={`https://wa.me/91${profile.phone || '7769947217'}?text=Hello%20${encodeURIComponent(profile.name)},%20I%20saw%20your%20profile%20on%20Majh%20Boisar%20and%20want%20to%20hire%20you!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[10px] sm:text-[11px] py-2 px-1 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <MessageSquare className="w-3 h-3 fill-white" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>

                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                /* 2. CLEAN HELPER / SPECIALIST DETAIL VIEW */
                <div className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-4 space-y-3.5 text-left pb-24">
                  
                  {/* Top Bar with Back Button */}
                  <div className="flex items-center justify-between pb-1">
                    <button 
                      onClick={() => setSelectedProfile(null)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="text-sm leading-none">←</span>
                      <span>Back to All Profiles</span>
                    </button>

                    <span className="text-xs font-bold text-slate-400">
                      Profile ID: #{selectedProfile.id}
                    </span>
                  </div>

                  {/* Main Profile Card (Clean White Box) */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                    
                    {/* Avatar, Name, Role & Price */}
                    <div className="flex items-start gap-3.5">
                      <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-2xs">
                        {selectedProfile.avatar ? (
                          <img loading="lazy" decoding="async" src={selectedProfile.avatar} alt={selectedProfile.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-600 font-black text-2xl uppercase">
                            {selectedProfile.name ? selectedProfile.name.charAt(0) : 'H'}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                            {selectedProfile.name}
                          </h3>
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{selectedProfile.category || 'Domestic Helper'}</span>
                        </p>

                        <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{selectedProfile.location || 'Boisar, Maharashtra'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Key Stats Row */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-150 text-center">
                      <div className="border-r border-slate-200/80 pr-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Charges</span>
                        <span className="text-sm sm:text-base font-black text-emerald-800 block">
                          {(() => {
                            const p = String(selectedProfile.price || '').trim();
                            if (!p) return 'Contact for Rates';
                            if (p.startsWith('₹')) return p;
                            const num = parseInt(p.replace(/\D/g, ''), 10);
                            return isNaN(num) ? p : `₹${num.toLocaleString('en-IN')}/mo`;
                          })()}
                        </span>
                      </div>

                      <div className="pl-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Client Rating</span>
                        <div className="flex items-center justify-center gap-1 text-xs font-black text-slate-800 mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{selectedProfile.rating || 5.0}</span>
                          <span className="text-[10px] text-slate-400 font-medium">({selectedProfile.reviewsCount || 8} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Services & Skills Offered */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                        Skills &amp; Work Offered:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                          {selectedProfile.category}
                        </span>
                        {(selectedProfile.services || []).map((srv: string, i: number) => {
                          const cleanSrv = srv.replace(/\s*\([^)]*\)/, '');
                          return (
                            <span key={i} className="bg-emerald-50 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200/70">
                              ✓ {cleanSrv}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* About / Notes */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                        About:
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        {(() => {
                          const rawBio = (selectedProfile.bio || '').trim();
                          if (!rawBio || rawBio.length < 5 || ['df', 'fd', 'test', 'fsdf'].includes(rawBio.toLowerCase())) {
                            return `Experienced and reliable ${selectedProfile.category || 'Domestic Helper'} available for daily household work in Boisar. Verified profile with direct WhatsApp contact.`;
                          }
                          return rawBio;
                        })()}
                      </p>
                    </div>

                    {/* Direct Call & WhatsApp Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <a
                        href={`tel:${selectedProfile.phone || '7769947217'}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Directly</span>
                      </a>

                      <a
                        href={`https://wa.me/91${selectedProfile.phone || '7769947217'}?text=Hello%20${encodeURIComponent(selectedProfile.name)},%20I%20saw%20your%20profile%20on%20Majh%20Boisar%20and%20want%20to%20hire%20you.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-3 px-3 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  </div>

                  {/* Simple Safety Disclaimer */}
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-center text-[10px] text-slate-500 font-medium">
                    ℹ️ <strong>Safety Reminder:</strong> Please verify original Aadhar ID &amp; background details independently before hiring.
                  </div>

                </div>
              )}
            </div>

            {/* Real Estate App-Style Bottom Navigation Bar (Home, Buy, Post [Center Elevated], Home Loan, Account) */}
            {activeSpecialCategory === 'properties' && !selectedProfile && (
              <nav 
                aria-label="Real Estate Quick Navigation"
                className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] z-40 select-none pb-[env(safe-area-inset-bottom,0px)]"
              >
                <div className="max-w-md sm:max-w-lg mx-auto px-2 sm:px-6 h-13 flex items-center justify-between relative">
                  
                  {/* 1. Home */}
                  <button
                    type="button"
                    onClick={() => {
                      setPropertyMode(null);
                      setSelectedProfile(null);
                      portalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative flex-1 flex flex-col items-center justify-center py-0.5 transition-all cursor-pointer group ${
                      propertyMode === null && !selectedProfile
                        ? 'text-[#da0c23]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {propertyMode === null && !selectedProfile && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#da0c23] rounded-full" />
                    )}
                    <Home className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                      propertyMode === null && !selectedProfile ? 'stroke-[2.5]' : 'stroke-2'
                    }`} />
                    <span className={`text-[10px] mt-0.5 tracking-tight ${
                      propertyMode === null && !selectedProfile ? 'font-black' : 'font-semibold'
                    }`}>
                      Home
                    </span>
                  </button>

                  {/* 2. Buy */}
                  <button
                    type="button"
                    onClick={() => {
                      setPropertyMode('buy');
                      setSelectedProfile(null);
                      portalContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative flex-1 flex flex-col items-center justify-center py-0.5 transition-all cursor-pointer group ${
                      propertyMode === 'buy' && !selectedProfile
                        ? 'text-[#da0c23]'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {propertyMode === 'buy' && !selectedProfile && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#da0c23] rounded-full" />
                    )}
                    <Building className={`w-4.5 h-4.5 transition-transform group-hover:scale-110 ${
                      propertyMode === 'buy' && !selectedProfile ? 'stroke-[2.5]' : 'stroke-2'
                    }`} />
                    <span className={`text-[10px] mt-0.5 tracking-tight ${
                      propertyMode === 'buy' && !selectedProfile ? 'font-black' : 'font-semibold'
                    }`}>
                      Buy
                    </span>
                  </button>

                  {/* 3. Post (Center Elevated Circular Button - Compact Size) */}
                  <div className="relative flex-1 flex flex-col items-center justify-center -mt-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          showToast("Please login first to post your property.", "info", 4000);
                          setLoginModalOpen(true);
                          return;
                        }
                        setPostPropertyModalOpen(true);
                      }}
                      className="w-10 h-10 rounded-full bg-[#da0c23] hover:bg-[#b8081c] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(218,12,35,0.32)] ring-2 ring-white active:scale-90 transition-all cursor-pointer group"
                      title="Post Property Free"
                    >
                      <Plus className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-300" />
                    </button>
                    <span className="text-[9.5px] font-black text-slate-700 tracking-tight mt-0.5">
                      Post
                    </span>
                  </div>

                  {/* 4. Home Loan — Navigates to Home Loan category businesses */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSpecialCategory(null);
                      router.push('/search?query=Home%20Loan');
                    }}
                    className="relative flex-1 flex flex-col items-center justify-center py-0.5 transition-all cursor-pointer group text-slate-500 hover:text-slate-800"
                  >
                    <Landmark className="w-4.5 h-4.5 transition-transform group-hover:scale-110 stroke-2" />
                    <span className="text-[10px] mt-0.5 tracking-tight font-semibold">
                      Home Loan
                    </span>
                  </button>

                  {/* 5. Account */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setLoginModalOpen(true);
                      } else {
                        window.dispatchEvent(new CustomEvent('open_user_menu'));
                      }
                    }}
                    className="relative flex-1 flex flex-col items-center justify-center py-0.5 text-slate-500 hover:text-slate-800 transition-all cursor-pointer group"
                  >
                    <User className="w-4.5 h-4.5 transition-transform group-hover:scale-110 stroke-2" />
                    <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
                      Account
                    </span>
                  </button>

                </div>
              </nav>
            )}
          </div>
        </div>
      )}

      {/* ==================== ADD SPECIALIST PROFILE MODAL ==================== */}
      {addProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setAddProfileModalOpen(false)}
          />
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 z-10 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                  List Your Profile — {profileModalCategory === 'influencers' ? '🎬 Creator Network' : 
                                       profileModalCategory === 'properties' ? '🏠 Broker Network' : 
                                       profileModalCategory === 'helpers' ? '🧹 Helper Network' : 
                                       profileModalCategory === 'caterers' ? '🍽️ Chef Network' : 'Specialist Network'}
                </h3>
              </div>
              <button
                onClick={() => setAddProfileModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {profileFormError && (
              <div className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-650 flex items-center gap-2 shrink-0 mb-4 animate-shake">
                <X className="w-4 h-4 text-red-500 shrink-0 cursor-pointer" onClick={() => setProfileFormError('')} />
                <span>{profileFormError}</span>
              </div>
            )}

            {/* Scrollable Form Body with Systematic 2-Column Grid */}
            <form onSubmit={handleAddProfileSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-700 text-left">
              
              {/* ── 🎬 INFLUENCERS & CREATORS ── */}
              {profileModalCategory === 'influencers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[9px] text-slate-400 font-normal normal-case">(from account)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        readOnly
                        value={newProfileName}
                        className="w-full bg-slate-100 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold cursor-not-allowed select-none pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔒</span>
                    </div>
                  </div>

                  {/* Mobile / WhatsApp Number */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newProfilePhone}
                      onChange={(e) => setNewProfilePhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit WhatsApp number"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Creator / Niche Type */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Creator / Niche Type *</label>
                    <select
                      required
                      value={newProfileCategory}
                      onChange={(e) => setNewProfileCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    >
                      <option value="">Select Niche</option>
                      <option>Food &amp; Travel Creator</option>
                      <option>Fashion &amp; Lifestyle</option>
                      <option>Tech &amp; Gadgets</option>
                      <option>Comedy &amp; Entertainment</option>
                      <option>Local News &amp; Events</option>
                      <option>Real Estate Showcase</option>
                      <option>Health &amp; Fitness</option>
                      <option>Business &amp; Finance</option>
                      <option>Wedding &amp; Events</option>
                      <option>Education &amp; Motivation</option>
                    </select>
                  </div>

                  {/* Primary Platform */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Primary Platform *</label>
                    <select
                      required
                      value={newProfileServices}
                      onChange={(e) => setNewProfileServices(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    >
                      <option value="">Select Platform</option>
                      <option>Instagram Reels</option>
                      <option>YouTube Shorts</option>
                      <option>YouTube Long Video</option>
                      <option>Facebook Reels</option>
                      <option>Instagram + YouTube</option>
                      <option>All Platforms</option>
                    </select>
                  </div>

                  {/* Instagram Profile Handle/Link */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>📸 Instagram Username / Link</span>
                    </label>
                    <input
                      type="text"
                      value={newProfileInstagram}
                      onChange={(e) => setNewProfileInstagram(e.target.value)}
                      placeholder="e.g. @boisar_creator or link"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* YouTube Channel Link */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>▶️ YouTube Channel Link</span>
                    </label>
                    <input
                      type="text"
                      value={newProfileYoutube}
                      onChange={(e) => setNewProfileYoutube(e.target.value)}
                      placeholder="e.g. https://youtube.com/@vlogs"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Followers Count */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Followers Count *</label>
                    <select
                      required
                      value={newProfileExperience}
                      onChange={(e) => setNewProfileExperience(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    >
                      <option value="1K-5K">1,000 – 5,000 Followers</option>
                      <option value="5K-10K">5,000 – 10,000 Followers</option>
                      <option value="10K-50K">10K – 50K Followers</option>
                      <option value="50K-1L">50K – 1 Lakh Followers</option>
                      <option value="1L+">1 Lakh+ Followers</option>
                    </select>
                  </div>

                  {/* Starting Rate */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Overall Starting Rate *</label>
                    <input
                      type="text"
                      required
                      value={newProfilePrice}
                      onChange={(e) => setNewProfilePrice(e.target.value)}
                      placeholder="e.g. ₹1,500 / Reel"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Dynamic Services & Packages Offered (Full Width) */}
                  <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                        🎬 Collaboration Packages &amp; Custom Rates (Add 1–5 Packages)
                      </label>
                      <span className="text-[9px] text-teal-700 font-extrabold">Custom Rate per Reel/Service</span>
                    </div>
                    
                    <div className="space-y-2">
                      {dynamicServices.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={idx === 0 ? "Package Name (e.g. 1 Instagram Reel + 2 Stories)" : `Package #${idx + 1} Name`}
                            value={item.name}
                            onChange={(e) => {
                              const next = [...dynamicServices];
                              next[idx].name = e.target.value;
                              setDynamicServices(next);
                            }}
                            className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder={idx === 0 ? "Rate (e.g. ₹2,500)" : "Rate (e.g. ₹1,500)"}
                            value={item.price}
                            onChange={(e) => {
                              const next = [...dynamicServices];
                              next[idx].price = e.target.value;
                              setDynamicServices(next);
                            }}
                            className="w-32 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          {dynamicServices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setDynamicServices(dynamicServices.filter((_, i) => i !== idx))}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 font-black text-xs hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                              title="Remove Package"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {dynamicServices.length < 5 && (
                      <button
                        type="button"
                        onClick={() => setDynamicServices([...dynamicServices, { name: '', price: '' }])}
                        className="text-xs font-extrabold text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1 cursor-pointer mt-1"
                      >
                        <span>+ Add Next Package &amp; Rate</span>
                      </button>
                    )}
                  </div>

                  {/* About You / Content Style (Full Width) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">About You / Content Style *</label>
                    <textarea
                      required
                      rows={3}
                      value={newProfileBio}
                      onChange={(e) => setNewProfileBio(e.target.value)}
                      placeholder="Describe your content style, audience location, past brand collaborations, and what makes you unique..."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>
              )}

              {/* ── 🏠 REAL ESTATE / BROKERS ── */}
              {profileModalCategory === 'properties' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 flex items-center gap-4 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setNewProfileListingType('agent')}
                      className={`flex-1 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
                        newProfileListingType === 'agent' ? 'bg-white shadow-sm text-teal-700 border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Real Estate Agent
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProfileListingType('property')}
                      className={`flex-1 py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
                        newProfileListingType === 'property' ? 'bg-white shadow-sm text-emerald-700 border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      List a Property
                    </button>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[9px] text-slate-400 font-normal normal-case">(from account)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        readOnly
                        value={newProfileName}
                        className="w-full bg-slate-100 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold cursor-not-allowed select-none pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔒</span>
                    </div>
                  </div>

                  {/* Mobile / WhatsApp Number */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newProfilePhone}
                      onChange={(e) => setNewProfilePhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit WhatsApp number"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {newProfileListingType === 'agent' ? (
                    <>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Broker / Agent Type *</label>
                        <select
                          required
                          value={newProfileCategory}
                          onChange={(e) => setNewProfileCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        >
                          <option value="">Select Type</option>
                          <option>Residential Broker</option>
                          <option>Commercial Broker</option>
                          <option>Plot / Land Dealer</option>
                          <option>Rental Specialist</option>
                          <option>Builder / Developer</option>
                          <option>General Real Estate Agent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Areas / Localities Covered *</label>
                        <input
                          type="text"
                          required
                          value={newProfileServices}
                          onChange={(e) => setNewProfileServices(e.target.value)}
                          placeholder="e.g. Boisar West, Tarapur MIDC, Palghar"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Years of Experience *</label>
                        <select
                          required
                          value={newProfileExperience}
                          onChange={(e) => setNewProfileExperience(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        >
                          <option value="1+ Year">1+ Year</option>
                          <option value="2+ Years">2+ Years</option>
                          <option value="3+ Years">3+ Years</option>
                          <option value="5+ Years">5+ Years</option>
                          <option value="10+ Years">10+ Years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Commission / Fees *</label>
                        <input
                          type="text"
                          required
                          value={newProfilePrice}
                          onChange={(e) => setNewProfilePrice(e.target.value)}
                          placeholder="e.g. 1% of Property Value"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">About You / Profile Summary *</label>
                        <textarea
                          required
                          rows={3}
                          value={newProfileBio}
                          onChange={(e) => setNewProfileBio(e.target.value)}
                          placeholder="Describe your expertise, area knowledge, past deals, and why clients should choose you..."
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Property Type *</label>
                        <select
                          required
                          value={newProfileCategory}
                          onChange={(e) => setNewProfileCategory(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        >
                          <option value="">Select Type</option>
                          <option>1 BHK Flat</option>
                          <option>2 BHK Flat</option>
                          <option>3+ BHK Flat</option>
                          <option>Independent House / Villa</option>
                          <option>Commercial Shop</option>
                          <option>Industrial Plot / Land</option>
                          <option>PG / Room for Rent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Key Amenities / Location *</label>
                        <input
                          type="text"
                          required
                          value={newProfileServices}
                          onChange={(e) => setNewProfileServices(e.target.value)}
                          placeholder="e.g. Boisar West, Lift, Parking, Security"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Furnishing Status *</label>
                        <select
                          required
                          value={newProfileExperience}
                          onChange={(e) => setNewProfileExperience(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        >
                          <option value="Unfurnished">Unfurnished</option>
                          <option value="Semi-Furnished">Semi-Furnished</option>
                          <option value="Fully-Furnished">Fully-Furnished</option>
                          <option value="Ready to Move">Ready to Move</option>
                          <option value="Under Construction">Under Construction</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Price / Rent *</label>
                        <input
                          type="text"
                          required
                          value={newProfilePrice}
                          onChange={(e) => setNewProfilePrice(e.target.value)}
                          placeholder="e.g. ₹40,00,000 or ₹8,000/mo"
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Property Description *</label>
                        <textarea
                          required
                          rows={3}
                          value={newProfileBio}
                          onChange={(e) => setNewProfileBio(e.target.value)}
                          placeholder="Describe the property size (sqft), facing, floor number, proximity to station, and other details..."
                          className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── 🧹 HOME HELPERS / MAIDS ── */}
              {profileModalCategory === 'helpers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[9px] text-slate-400 font-normal normal-case">(from account)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        readOnly
                        value={newProfileName}
                        className="w-full bg-slate-100 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold cursor-not-allowed select-none pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔒</span>
                    </div>
                  </div>

                  {/* Mobile / WhatsApp Number */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newProfilePhone}
                      onChange={(e) => setNewProfilePhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit WhatsApp number"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Multi-Select Work Types (Full Width) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1.5 flex justify-between items-center">
                      <span>Work Type / Roles (Select Multiple) *</span>
                      <span className="text-[9px] text-teal-700 font-extrabold normal-case">Multi-Select Supported</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      {[
                        'House Maid',
                        'Cook (Veg/Non-Veg)',
                        'Baby Sitter / Nanny',
                        'Patient / Elder Care',
                        'Cleaner / Sweeper',
                        'Office Boy / Peon',
                        'Security Guard',
                        'Driver',
                        'Multipurpose Helper'
                      ].map((wt) => {
                        const isSelected = selectedWorkTypes.includes(wt) || newProfileCategory === wt;
                        return (
                          <button
                            key={wt}
                            type="button"
                            onClick={() => {
                              let next: string[];
                              if (isSelected) {
                                next = selectedWorkTypes.filter(t => t !== wt);
                              } else {
                                next = [...selectedWorkTypes, wt];
                              }
                              setSelectedWorkTypes(next);
                              setNewProfileCategory(next.join(' • ') || wt);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                                : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{wt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Services Offered & Custom Individual Rates (Full Width) */}
                  <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                        🛠️ Services Offered &amp; Custom Rates (Add 1–5 Services) *
                      </label>
                      <span className="text-[9px] text-teal-700 font-extrabold">Custom Rate per Service</span>
                    </div>
                    
                    <div className="space-y-2">
                      {dynamicServices.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            required={idx === 0}
                            placeholder={idx === 0 ? "Service Name (e.g. Daily Meal Cooking)" : `Service #${idx + 1} Name`}
                            value={item.name}
                            onChange={(e) => {
                              const next = [...dynamicServices];
                              next[idx].name = e.target.value;
                              setDynamicServices(next);
                            }}
                            className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder={idx === 0 ? "Rate (e.g. ₹4,000 / mo)" : "Rate (e.g. ₹2,000)"}
                            value={item.price}
                            onChange={(e) => {
                              const next = [...dynamicServices];
                              next[idx].price = e.target.value;
                              setDynamicServices(next);
                            }}
                            className="w-32 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          {dynamicServices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setDynamicServices(dynamicServices.filter((_, i) => i !== idx))}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 font-black text-xs hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                              title="Remove Service"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {dynamicServices.length < 5 && (
                      <button
                        type="button"
                        onClick={() => setDynamicServices([...dynamicServices, { name: '', price: '' }])}
                        className="text-xs font-extrabold text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1 cursor-pointer mt-1"
                      >
                        <span>+ Add Next Service &amp; Rate</span>
                      </button>
                    )}
                  </div>

                  {/* Available Days */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Available Days *</label>
                    <select
                      required
                      value={newProfileExperience}
                      onChange={(e) => setNewProfileExperience(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    >
                      <option value="Mon–Sat">Mon – Sat (6 days)</option>
                      <option value="Mon–Sun">Mon – Sun (All days)</option>
                      <option value="Weekdays">Weekdays only</option>
                      <option value="Weekends">Weekends only</option>
                      <option value="Part-time">Part-time (3–4 hrs/day)</option>
                      <option value="Full-time">Full-time (8+ hrs/day)</option>
                      <option value="Live-in">Live-in (stays at home)</option>
                    </select>
                  </div>

                  {/* Overall Salary / Rate */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Overall Starting Rate / Salary *</label>
                    <input
                      type="text"
                      required
                      value={newProfilePrice}
                      onChange={(e) => setNewProfilePrice(e.target.value)}
                      placeholder="e.g. ₹4,000 / Month"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* About Yourself (Full Width) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">About Yourself *</label>
                    <textarea
                      required
                      rows={3}
                      value={newProfileBio}
                      onChange={(e) => setNewProfileBio(e.target.value)}
                      placeholder="Tell employers about your reliability, past experience, area you can travel to, and references..."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>
              )}

              {/* ── 🍽️ CATERERS / CHEFS ── */}
              {profileModalCategory === 'caterers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[9px] text-slate-400 font-normal normal-case">(from account)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        readOnly
                        value={newProfileName}
                        className="w-full bg-slate-100 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold cursor-not-allowed select-none pr-9"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔒</span>
                    </div>
                  </div>

                  {/* Mobile / WhatsApp Number */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newProfilePhone}
                      onChange={(e) => setNewProfilePhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit WhatsApp number"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Specialization *</label>
                    <select
                      required
                      value={newProfileCategory}
                      onChange={(e) => setNewProfileCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    >
                      <option value="">Select Type</option>
                      <option>Wedding Caterer</option>
                      <option>Birthday Party Chef</option>
                      <option>Corporate Event Chef</option>
                      <option>Home Cook (Tiffin Service)</option>
                      <option>Pooja / Religious Event Cook</option>
                      <option>Multi-Cuisine Chef</option>
                      <option>Snacks &amp; Starters Expert</option>
                    </select>
                  </div>

                  {/* Cuisine / Services Offered */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Cuisine / Services Offered *</label>
                    <input
                      type="text"
                      required
                      value={newProfileServices}
                      onChange={(e) => setNewProfileServices(e.target.value)}
                      placeholder="e.g. Maharashtrian Thali, North Indian, Chinese"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Order Size */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Min. Guests / Order Size *</label>
                    <select
                      required
                      value={newProfileExperience}
                      onChange={(e) => setNewProfileExperience(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    >
                      <option value="10+ Guests">10+ Guests (Small Event)</option>
                      <option value="50+ Guests">50+ Guests (Mid Event)</option>
                      <option value="100+ Guests">100+ Guests (Large Event)</option>
                      <option value="500+ Guests">500+ Guests (Wedding Scale)</option>
                      <option value="Tiffin Service">Daily Tiffin (1–10 People)</option>
                    </select>
                  </div>

                  {/* Starting Rate */}
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">Overall Starting Rate / Pricing *</label>
                    <input
                      type="text"
                      required
                      value={newProfilePrice}
                      onChange={(e) => setNewProfilePrice(e.target.value)}
                      placeholder="e.g. ₹250/plate or ₹15,000/event"
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>

                  {/* Dynamic Services & Catering Menu Packages (Full Width) */}
                  <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                        🍽️ Menu Items, Dishes &amp; Custom Rates (Add 1–5 Packages)
                      </label>
                      <span className="text-[9px] text-teal-700 font-extrabold">Custom Rate per Plate/Dish</span>
                    </div>
                    
                    <div className="space-y-2">
                      {dynamicServices.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={idx === 0 ? "Dish/Package Name (e.g. Maharashtrian Veg Thali)" : `Package #${idx + 1} Name`}
                            value={item.name}
                            onChange={(e) => {
                              const next = [...dynamicServices];
                              next[idx].name = e.target.value;
                              setDynamicServices(next);
                            }}
                            className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          <input
                            type="text"
                            placeholder={idx === 0 ? "Rate (e.g. ₹250/plate)" : "Rate (e.g. ₹350/plate)"}
                            value={item.price}
                            onChange={(e) => {
                              const next = [...dynamicServices];
                              next[idx].price = e.target.value;
                              setDynamicServices(next);
                            }}
                            className="w-32 bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500"
                          />
                          {dynamicServices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setDynamicServices(dynamicServices.filter((_, i) => i !== idx))}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-600 font-black text-xs hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                              title="Remove Package"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {dynamicServices.length < 5 && (
                      <button
                        type="button"
                        onClick={() => setDynamicServices([...dynamicServices, { name: '', price: '' }])}
                        className="text-xs font-extrabold text-teal-700 bg-white border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-1 cursor-pointer mt-1"
                      >
                        <span>+ Add Next Package &amp; Rate</span>
                      </button>
                    )}
                  </div>

                  {/* About Service (Full Width) */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase tracking-wider mb-1.5">About Your Catering Service *</label>
                    <textarea
                      required
                      rows={3}
                      value={newProfileBio}
                      onChange={(e) => setNewProfileBio(e.target.value)}
                      placeholder="Describe your signature dishes, events you've handled, and what makes your food special..."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>
              )}




              {/* Profile Photo (Avatar) Custom Picker */}
              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1.5 flex justify-between items-center">
                  <span>Profile Photo (Avatar)</span>
                  <span className="text-[9px] text-slate-400 font-bold normal-case">(Optional - Letter badge used if empty)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-photo-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewProfileAvatar(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
                
                <label
                  htmlFor="avatar-photo-upload"
                  className="flex border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-3 flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-teal-50/40 transition-all text-center group"
                >
                  <span className="text-xs font-black text-slate-700 group-hover:text-teal-700 flex items-center gap-1.5">
                    📸 Click to Choose Profile Photo
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Select photo from Gallery or Camera</span>
                </label>

                {newProfileAvatar && (
                  <div className="mt-3 flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-2.5">
                    <div className="h-12 w-12 rounded-lg overflow-hidden border border-teal-300 shrink-0">
                      <img src={newProfileAvatar || undefined} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-teal-900 truncate">Photo Uploaded Successfully ✓</p>
                      <p className="text-[9px] text-teal-700 font-medium">Will be displayed on your listing profile.</p>
                    </div>
                    <button type="button" onClick={() => setNewProfileAvatar('')} className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer shrink-0">Remove</button>
                  </div>
                )}
              </div>

              {/* Work Portfolio Gallery (Only for Non-Helpers like Caterers, Influencers, Brokers) */}
              {profileModalCategory !== 'helpers' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">📷 Portfolio Showcase Images <span className="text-[9px] text-slate-400 font-normal font-sans lowercase">(optional)</span></label>
                    <span className="bg-teal-50 border border-teal-200 text-teal-705 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {newProfilePhotos.length} Added
                    </span>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    id="portfolio-gallery-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        if (base64 && !newProfilePhotos.includes(base64)) {
                          setNewProfilePhotos([...newProfilePhotos, base64]);
                        }
                      };
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="portfolio-gallery-upload"
                    className="flex border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-3 flex-col items-center justify-center cursor-pointer bg-white transition-colors text-center"
                  >
                    <span className="text-[10px] font-black text-slate-600 uppercase">📁 Choose Work Image File</span>
                  </label>

                  {newProfilePhotos.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {newProfilePhotos.map((url, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white aspect-square">
                          <img loading="lazy" decoding="async" src={url || undefined} alt={`Portfolio ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewProfilePhotos(newProfilePhotos.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-600/70 text-white font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic text-center">No work images added yet. Upload files to show your quality work.</p>
                  )}
                </div>
              )}

              {/* Work Portfolio Videos (Only for Influencers, Caterers, Brokers - Hidden for Maids) */}
              {profileModalCategory !== 'helpers' && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">🎥 Portfolio Videos (Links)</label>
                    <span className="bg-teal-50 border border-teal-200 text-teal-705 text-[9px] font-black px-2 py-0.5 rounded-full">
                      {newProfileVideos.length} Added
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                      value={newProfileVideoInput}
                      onChange={(e) => setNewProfileVideoInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-250 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newProfileVideoInput && !newProfileVideos.includes(newProfileVideoInput)) {
                          setNewProfileVideos([...newProfileVideos, newProfileVideoInput]);
                          setNewProfileVideoInput('');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-extrabold text-[10px] uppercase cursor-pointer hover:bg-slate-700"
                    >
                      Add
                    </button>
                  </div>

                  {newProfileVideos.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {newProfileVideos.map((url, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-2.5">
                          <span className="text-xs text-slate-600 truncate flex-1">{url}</span>
                          <button
                            type="button"
                            onClick={() => setNewProfileVideos(newProfileVideos.filter((_, i) => i !== idx))}
                            className="text-red-500 font-bold text-xs ml-2 hover:text-red-700 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic text-center">Add YouTube/Instagram video links to showcase your work.</p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5 shrink-0 mt-4">
                <button
                  type="button"
                  onClick={() => setAddProfileModalOpen(false)}
                  className="px-4.5 py-2.5 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Submit & List Me
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== SPECIALIST CHECKOUT MODAL ==================== */}
      {specialistCheckoutOpen && specialistCheckoutPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div 
            className="fixed inset-0" 
            onClick={() => setSpecialistCheckoutOpen(false)}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-205 p-6 z-10 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Activate {specialistCheckoutPlan} Specialist Network Plan
                </h3>
              </div>
              <button
                onClick={() => setSpecialistCheckoutOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-105 text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 mb-4 text-left">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Billing Details</span>
              <div className="flex justify-between items-center mt-2.5">
                <span className="text-xs text-slate-600 font-bold">Plan Price ({specialistCheckoutPlan})</span>
                <span className="text-xs text-slate-800 font-black">
                  {specialistCheckoutPlan === 'Pro' ? '₹49.00' : '₹99.00'}
                </span>
              </div>

              {specialistCouponApplied && (
                <div className="flex justify-between items-center mt-2 text-emerald-705 font-bold text-xs">
                  <span>Coupon Discount (MAJHBOISAR99)</span>
                  <span>-{specialistCheckoutPlan === 'Pro' ? '₹49.00' : '₹99.00'}</span>
                </div>
              )}

              <div className="border-t border-slate-200/80 pt-2.5 mt-3 flex justify-between items-center">
                <strong className="text-xs font-black text-slate-800 uppercase">Total Amount</strong>
                <strong className="text-sm font-black text-teal-650">
                  {(specialistCouponApplied || currentRole === 'Admin') ? '₹0.00' : (specialistCheckoutPlan === 'Pro' ? '₹49.00' : '₹99.00')}
                </strong>
              </div>
            </div>

            {/* Admin Bypass Notice (No Coupon Needed) */}
            {currentRole === 'Admin' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 text-left flex items-center gap-2">
                <span className="text-base">⚡</span>
                <div>
                  <p className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider">Admin Direct Free Activation</p>
                  <p className="text-[10px] text-emerald-700 font-medium">As Admin, this specialist listing activates directly with ₹0 charge.</p>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            {!specialistCouponApplied && (
              <div className="space-y-3 mb-4 text-left">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] text-slate-500 font-black uppercase tracking-wider">Payment Method</label>
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">⚡ Instant UPI / QR</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3.5">
                  <div className="flex flex-col items-center">
                    <div className="w-36 h-36 bg-white border border-slate-200 rounded-2xl p-2 flex items-center justify-center shadow-sm overflow-hidden">
                      <img loading="lazy" decoding="async" 
                        src="/payment/QrCode.jpeg"
                        alt="UPI QR Code" 
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <p className="text-[9px] text-slate-600 font-bold mt-2">Scan QR code using GooglePay, PhonePe, or Paytm</p>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block text-[9px] text-slate-500 font-black uppercase tracking-wider">UPI Transaction Ref (UTR) Number *</label>
                    <input 
                      type="text"
                      placeholder="Enter 12-digit UTR number"
                      maxLength={12}
                      value={specialistUpiRef}
                      onChange={(e) => setSpecialistUpiRef(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-teal-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Checkout CTAs */}
            <div className="space-y-2 pt-2 border-t border-slate-100 flex flex-col shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!specialistCouponApplied && specialistPaymentMode === 'upi' && !specialistUpiRef.trim()) {
                    alert('Please enter your 12-digit UPI UTR Transaction number to verify payment.');
                    return;
                  }
                  // Success activation
                  updateSpecialistSubscription(specialistCheckoutPlan);
                  setSpecialistCheckoutOpen(false);
                  alert(`🎉 Congratulations! Your Specialist profile has been successfully upgraded to ${specialistCheckoutPlan} Plan. Your Trusted Badge is now active!`);
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Complete Payment &amp; Activate Plan
              </button>
              <button
                type="button"
                onClick={() => setSpecialistCheckoutOpen(false)}
                className="w-full border border-slate-250 hover:bg-slate-50 text-slate-600 font-extrabold text-xs py-2.5 rounded-2xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* View Property Enquiries Modal (Compact & Easy to Understand) */}
      {viewEnquiriesModalOpen && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[85vh] flex flex-col text-left">
            <button 
              onClick={() => setViewEnquiriesModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3 shrink-0">
              <div className="w-8 h-8 rounded-2xl bg-teal-50 text-teal-650 flex items-center justify-center shrink-0 border border-teal-200">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">Property Leads & Enquiries</h3>
                <p className="text-[10px] text-slate-400 font-bold">Buyer messages for your listed properties</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(() => {
                const list = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_property_enquiries') || '[]' : '[]');
                const userPhoneDigits = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '';
                const myUserProps = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_user_properties') || '[]' : '[]');
                const myPropIds = new Set(myUserProps.map((p: any) => p.id));

                const filteredList = list.filter((enq: any) => {
                  if (myPropIds.has(enq.propertyId)) return true;
                  if (userPhoneDigits && enq.ownerPhone) {
                    const enqOwnerDigits = enq.ownerPhone.replace(/\D/g, '');
                    if (enqOwnerDigits && (enqOwnerDigits.endsWith(userPhoneDigits) || userPhoneDigits.endsWith(enqOwnerDigits))) return true;
                  }
                  return false;
                });

                if (filteredList.length === 0) {
                  return (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                        <Mail className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">No Property Enquiries Yet</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">When buyers send inquiries for your listed properties, they will appear here.</p>
                    </div>
                  );
                }

                return filteredList.map((enq: any) => (
                  <div key={enq.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs shadow-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                      <span className="bg-teal-100 text-teal-800 text-[9px] font-black px-2 py-0.5 rounded truncate max-w-[200px]">
                        {enq.propertyName}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold shrink-0">{enq.createdAt}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold">Buyer: <strong className="text-slate-800">{enq.senderName}</strong></span>
                        <span className="text-teal-700 font-extrabold truncate max-w-[140px]">+91 {enq.senderPhone}</span>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-xl p-2 mt-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Message:</span>
                        <p className="text-xs text-slate-700 font-medium leading-snug break-words">"{enq.message}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button 
                        onClick={() => alert(`Calling ${enq.senderName} at +91 ${enq.senderPhone}...`)}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Buyer
                      </button>
                      <button 
                        onClick={() => {
                          const msg = encodeURIComponent(`Hi ${enq.senderName}, regarding your inquiry for ${enq.propertyName}...`);
                          window.open(`https://wa.me/91${enq.senderPhone}?text=${msg}`, '_blank');
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-1.5 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Send Property Enquiry Modal */}
      {enquiryModalProperty && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
            {/* Top Red Accent Strip */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#e50914] via-[#ff3b30] to-[#e50914]" />

            <button 
              type="button"
              onClick={() => setEnquiryModalProperty(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Red Accent */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-[#e50914] flex items-center justify-center shrink-0 shadow-2xs">
                <Send className="w-5 h-5 text-[#e50914]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black text-slate-900 leading-tight">Send Direct Enquiry</h3>
                <p className="text-[11px] text-slate-500 font-medium">Contact {enquiryModalProperty.postedBy || 'Owner'} directly </p>
              </div>
            </div>

            {/* Property Summary Card Preview with Thumbnail */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 mb-4.5">
              <img 
                src={enquiryModalProperty.avatar || (enquiryModalProperty.gallery && enquiryModalProperty.gallery[0]) || '/imagess/nobroker_3d_house.jpg'} 
                alt={enquiryModalProperty.category || 'Property'} 
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs bg-slate-900" 
              />
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="bg-rose-50 text-[#e50914] border border-rose-200 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    {enquiryModalProperty.forAction || 'For Sale'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    {enquiryModalProperty.location || 'Boisar'}
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 truncate">
                  {enquiryModalProperty.category || enquiryModalProperty.title || enquiryModalProperty.name}
                </p>
                <div className="flex items-baseline justify-between gap-1 mt-0.5">
                  <span className="text-sm font-black text-slate-900">
                    {formatPriceInLacs(enquiryModalProperty.price || enquiryModalProperty.budget)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    By {enquiryModalProperty.contactName || enquiryModalProperty.name || 'Owner'}
                  </span>
                </div>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!enquirySenderPhone.trim()) return showToast('Please enter your phone number', 'error');

                const newEnquiry = {
                  id: Date.now(),
                  propertyId: enquiryModalProperty.id,
                  propertyName: enquiryModalProperty.category,
                  propertyPrice: enquiryModalProperty.price,
                  ownerName: enquiryModalProperty.contactName || enquiryModalProperty.name,
                  ownerPhone: enquiryModalProperty.contactPhone || enquiryModalProperty.phone,
                  postedBy: enquiryModalProperty.postedBy || 'Owner',
                  senderName: enquirySenderName || userName || 'Interested Buyer',
                  senderPhone: enquirySenderPhone,
                  message: enquiryMessage,
                  createdAt: new Date().toLocaleString()
                };

                const existing = JSON.parse(localStorage.getItem('majh_boisar_property_enquiries') || '[]');
                const updated = [newEnquiry, ...existing];
                localStorage.setItem('majh_boisar_property_enquiries', JSON.stringify(updated));

                showToast(`🎉 Enquiry Sent! The ${enquiryModalProperty.postedBy || 'owner'} will contact you shortly.`, 'success');
                setEnquiryModalProperty(null);
              }}
              className="space-y-3.5 text-left"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Your Name</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={enquirySenderName}
                  onChange={(e) => setEnquirySenderName(e.target.value)}
                  className="w-full border border-slate-200 focus:border-[#e50914] focus:ring-2 focus:ring-rose-500/15 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Your Phone / WhatsApp Number</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-slate-500 select-none">🇮🇳 +91</span>
                  <input 
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={enquirySenderPhone}
                    onChange={(e) => setEnquirySenderPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-slate-200 focus:border-[#e50914] focus:ring-2 focus:ring-rose-500/15 rounded-xl pl-16 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Message</label>
                <textarea 
                  rows={3}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full border border-slate-200 focus:border-[#e50914] focus:ring-2 focus:ring-rose-500/15 rounded-xl p-3 text-xs font-medium text-slate-800 outline-none resize-none transition-all"
                />
              </div>

              <div className="pt-2 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEnquiryModalProperty(null)}
                  className="flex-1 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#e50914] hover:bg-[#cf0812] active:scale-95 text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Enquiry</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-1 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Your contact details are shared directly with the owner only</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real Estate "Post Property" detailed modal */}
      <PostPropertyModal 
        isOpen={postPropertyModalOpen} 
        onClose={() => setPostPropertyModalOpen(false)} 
        onAddProperty={(newProp) => {
          localStorage.setItem('majh_boisar_user_has_posted_property', 'true');
          const existing = JSON.parse(localStorage.getItem('majh_boisar_user_properties') || '[]');
          localStorage.setItem('majh_boisar_user_properties', JSON.stringify([newProp, ...existing.filter((e: any) => e.id !== newProp.id)]));
        }}
      />

      {/* Boisar Home Loan Assistance Modal */}
      <HomeLoanModal
        isOpen={homeLoanModalOpen}
        onClose={() => setHomeLoanModalOpen(false)}
      />

      {/* Report Invalid Listing Modal */}
      <ReportModal 
        isOpen={reportModalOpen} 
        onClose={() => setReportModalOpen(false)} 
        listingId={reportTarget?.id || ''} 
        listingType={reportTarget?.type || 'business'} 
        listingName={reportTarget?.name || ''} 
      />

      {/* Buyer Call Pass Selection Modal (Plans) */}
      {buyerPassModalOpen && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 text-left space-y-4">
            <button 
              onClick={() => setBuyerPassModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                <Phone className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  Free Contact Limit Reached (2/2 Used)
                </h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  You have used your 2 free owner contacts. Upgrade to unlock direct phone numbers &amp; WhatsApp.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-bold flex items-center gap-2">
              <span className="text-base shrink-0">💡</span>
              <span className="text-[11px]">Submitting <strong>Send Enquiry</strong> is always <strong>100% FREE</strong> for all buyers!</span>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Select Buyer Contact Pass Plan *
              </label>
              
              {/* Option 1: 1 Call - ₹19 */}
              <div 
                onClick={() => setBuyerPassOption('1_call')}
                className={`p-3 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                  buyerPassOption === '1_call' ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="bg-slate-100 text-slate-700 text-[8.5px] font-black px-2 py-0.5 rounded uppercase block w-max">Single Pass</span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">1 Direct Owner Contact</p>
                  <p className="text-[10px] text-slate-500 font-medium">Instant phone &amp; WhatsApp access for 1 property</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-teal-800">₹19</span>
                </div>
              </div>

              {/* Option 2: 5 Calls - ₹49 */}
              <div 
                onClick={() => setBuyerPassOption('5_calls')}
                className={`p-3 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${
                  buyerPassOption === '5_calls' ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded-bl uppercase">Most Popular</div>
                <div>
                  <span className="bg-teal-100 text-teal-800 text-[8.5px] font-black px-2 py-0.5 rounded uppercase block w-max">Best Value</span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">5 Direct Owner Contacts Pass</p>
                  <p className="text-[10px] text-slate-500 font-medium">Unlock contact details for 5 properties anytime</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-teal-800">₹49</span>
                  <span className="text-[9px] text-slate-400 font-bold block line-through">₹95</span>
                </div>
              </div>

              {/* Option 3: Unlimited Pass - ₹99 */}
              <div 
                onClick={() => setBuyerPassOption('unlimited')}
                className={`p-3 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${
                  buyerPassOption === 'unlimited' ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-black text-[8px] px-2 py-0.5 rounded-bl uppercase">VIP Pass</div>
                <div>
                  <span className="bg-emerald-100 text-emerald-800 text-[8.5px] font-black px-2 py-0.5 rounded uppercase block w-max">Unlimited</span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">Unlimited Owner Contacts (30 Days)</p>
                  <p className="text-[10px] text-slate-500 font-medium">Direct phone &amp; WhatsApp access to all properties</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-teal-800">₹99</span>
                  <span className="text-[9px] text-slate-400 font-bold block line-through">₹199</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setBuyerPassModalOpen(false);
                  setBuyerCheckoutModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider active:scale-98"
              >
                <CreditCard className="w-4 h-4 text-white" />
                <span>Pay via UPI &amp; Unlock Contact ({buyerPassOption === '1_call' ? '₹19' : buyerPassOption === '5_calls' ? '₹49' : '₹99'})</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBuyerPassModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-250 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <a
                  href="https://wa.me/917769947217?text=Hello%20Admin,%20I%20want%20to%20buy%20a%20property%20buyer%20pass%20on%20Majh%20Boisar!"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setBuyerPassModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 transition-all flex items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <span>💬 Help on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer SECURE CHECKOUT Modal */}
      {buyerCheckoutModalOpen && (
        <div className="fixed inset-0 z-[230] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-left">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-5 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white tracking-wide uppercase">Secure Checkout</h3>
                    <p className="text-[10px] text-teal-200 font-medium">Fast &amp; Direct UPI Payment</p>
                  </div>
                </div>
                <button
                  onClick={() => setBuyerCheckoutModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              
              {/* Product Info Card */}
              <div className="bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/40 border border-teal-200/60 rounded-2xl p-4 flex justify-between items-center shadow-xs text-left">
                <div>
                  <span className="text-[9px] font-black uppercase text-teal-700 bg-teal-100/80 border border-teal-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {buyerPassOption === '1_call' ? '⚡ 1 Call Pass' : buyerPassOption === '5_calls' ? '🚀 5 Calls Pass' : '👑 Unlimited VIP Pass'}
                  </span>
                  <p className="text-xs font-black text-slate-800">
                    {buyerPassOption === '1_call' ? '1 Direct Owner Contact Unlock' : buyerPassOption === '5_calls' ? '5 Direct Owner Contacts Pass' : 'Unlimited Owner Contacts Pass'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">✓ Direct Phone &amp; WhatsApp Access</p>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="text-2xl font-black text-teal-700">
                    {buyerPassOption === '1_call' ? '₹19' : buyerPassOption === '5_calls' ? '₹89' : '₹199'}
                  </span>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase">One-Time Fee</span>
                </div>
              </div>

              {/* Exclusive UPI Payment Box */}
              <div className="bg-white border-2 border-teal-500/30 rounded-2xl p-4 space-y-4 shadow-sm relative overflow-hidden text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Pay via UPI / QR Code</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[8px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">GPay</span>
                    <span className="text-[8px] font-black bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">PhonePe</span>
                    <span className="text-[8px] font-black bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">Paytm</span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="w-40 h-40 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/payment/QrCode.jpeg"
                      alt="Majh Boisar Official UPI QR Code" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">Scan QR code using GPay, PhonePe, or Paytm</p>
                  

                  <a
                    href={`upi://pay?pa=9307294733@okaxis&pn=MajhBoisar&am=${buyerPassOption === '1_call' ? 19 : buyerPassOption === '5_calls' ? 89 : 199}&cu=INR`}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-[11px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
                  >
                    <span>⚡ Open UPI App (GPay / PhonePe)</span>
                  </a>
                </div>

                {/* UTR Input */}
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <label className="block text-[10px] text-slate-700 font-black uppercase tracking-wider">
                    Enter 12-Digit UPI UTR / Ref Number *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={buyerUpiRef}
                    onChange={e => setBuyerUpiRef(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 408912345678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white font-mono tracking-widest text-slate-900 font-bold transition-all"
                  />
                  <p className="text-[9px] text-slate-400 font-medium">Check transaction details in your UPI app for 12-digit UTR No.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBuyerCheckoutModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-black text-xs cursor-pointer text-center transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!buyerUpiRef.trim() || buyerUpiRef.length < 6) {
                      alert('Please enter a valid 12-digit UPI UTR Ref number from your payment app.');
                      return;
                    }
                    setBuyerCheckoutModalOpen(false);
                    const addedCredits = buyerPassOption === '1_call' ? 1 : 5;
                    const newTotal = buyerCallCredits + addedCredits;
                    setBuyerCallCredits(newTotal);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('majh_boisar_buyer_credits', newTotal.toString());
                    }
                    alert(`🎉 Payment Verified!\n\n${addedCredits} Call Credit(s) added! Total Credits: ${newTotal}.`);
                    
                    if (targetCallProperty) {
                      handlePropertyContactCall(targetCallProperty, targetCallProperty.isWhatsapp);
                    }
                  }}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer text-center uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <span>Pay &amp; Unlock Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {fullImagePreview && (
        <div 
          className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setFullImagePreview(null)}
        >
          <button 
            onClick={() => setFullImagePreview(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
            title="Close Full Photo"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
            <img 
              src={fullImagePreview || undefined} 
              alt="Property Full Preview" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200" 
            />
          </div>
          <p className="text-white/60 text-xs font-medium mt-3">Click anywhere to close full photo view</p>
        </div>
      )}

      {/* Portrait card modals — rendered last so they're always on top */}
      <LocalMarketplaceModal isOpen={portraitMarketplaceOpen} onClose={() => setPortraitMarketplaceOpen(false)} />
      <LocalOffersModal isOpen={portraitOffersOpen} onClose={() => setPortraitOffersOpen(false)} />
      <TempoHelplineModal isOpen={portraitTempoOpen} onClose={() => setPortraitTempoOpen(false)} />
      <SportsTurfModal isOpen={portraitTurfOpen} onClose={() => setPortraitTurfOpen(false)} defaultTab={portraitTurfTab} />
      <HomeTechniciansModal isOpen={portraitTechOpen} onClose={() => setPortraitTechOpen(false)} />
      <TravelsModal isOpen={portraitTravelsOpen} onClose={() => setPortraitTravelsOpen(false)} />
      <BusTimetableModal isOpen={portraitBusOpen} onClose={() => setPortraitBusOpen(false)} />
      <BookExchangeModal isOpen={portraitBookOpen} onClose={() => setPortraitBookOpen(false)} />
      <CommunityEventsModal isOpen={portraitEventsOpen} onClose={() => setPortraitEventsOpen(false)} />
      <HotelBookingModal isOpen={portraitHotelOpen} onClose={() => setPortraitHotelOpen(false)} />
      <ResortVillaModal isOpen={portraitResortOpen} onClose={() => setPortraitResortOpen(false)} />

      {/* Iconic Places Detail Modal */}
      {selectedIconicPlace && (
        <div
          className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedIconicPlace(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-48 sm:h-56 w-full">
              <img
                src={selectedIconicPlace.image}
                alt={selectedIconicPlace.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/places/chinchani-beach.jpg';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
              <button
                type="button"
                onClick={() => setSelectedIconicPlace(null)}
                aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="inline-block bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1">
                  {selectedIconicPlace.category}
                </span>
                <h3 className="text-white text-xl sm:text-2xl font-black drop-shadow-md">
                  {selectedIconicPlace.name}
                </h3>
                <p className="text-white/80 text-xs font-medium">
                  {selectedIconicPlace.travelTime}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedIconicPlace.description}
              </p>

              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                  Key Highlights
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIconicPlace.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold bg-emerald-50 text-[#064e3b] border border-emerald-200/80 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIconicPlace(null);
                    router.push('/hire-vehicle');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>🚐 Book Travels</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIconicPlace(null);
                    router.push('/resorts');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>🏖️ Nearby Resorts</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    'https://www.google.com/maps/search/?api=1&query=' +
                      encodeURIComponent(selectedIconicPlace.mapQuery),
                    '_blank'
                  );
                }}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>📍 View on Google Maps (Directions)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Utility Service Direct Actions Modal */}
      {selectedUtilityService && (
        <div
          className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedUtilityService(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedUtilityService(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedUtilityService === 'train' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    Indian Railways • IRCTC
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Check PNR &amp; Train Tickets</h3>
                  <p className="text-xs text-slate-500 font-medium">1-Tap direct access to official IRCTC portals</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>🔍 Check Live PNR Status</span>
                    <span>→</span>
                  </a>
                  <a
                    href="https://www.irctc.co.in/nget/train-search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>🎫 Book Tickets on IRCTC</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUtilityService(null);
                      router.push('/search?query=Travel%20Agencies');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📞 Find Boisar Ticket &amp; Tatkal Agents</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {selectedUtilityService === 'flight' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    Air Travel • Flights
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Flight Tickets &amp; Booking</h3>
                  <p className="text-xs text-slate-500 font-medium">Domestic &amp; International flight assistance</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://www.makemytrip.com/flights/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>✈️ Compare &amp; Search Flight Fares</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUtilityService(null);
                      router.push('/search?query=Travel%20Agencies');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📞 Contact Boisar Flight Booking Agent</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {selectedUtilityService === 'aadhaar' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    UIDAI Government Portal
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Aadhaar Card Services</h3>
                  <p className="text-xs text-slate-500 font-medium">Download, update or find Boisar Aadhaar centers</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://myaadhaar.uidai.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>🆔 Download E-Aadhaar (myAadhaar)</span>
                    <span>→</span>
                  </a>
                  <a
                    href="https://myaadhaar.uidai.gov.in/genricPVC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>💳 Order Aadhaar PVC Card</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUtilityService(null);
                      router.push('/search?query=Aadhar%20Center');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📍 Find Aadhaar Seva Kendra in Boisar</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {selectedUtilityService === 'pan' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    NSDL / UTI Services
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">PAN Card Services</h3>
                  <p className="text-xs text-slate-500 font-medium">Apply new PAN, correction &amp; local Setu Kendra</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>📋 Apply New PAN Card Online</span>
                    <span>→</span>
                  </a>
                  <a
                    href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>🔗 Link PAN with Aadhaar</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUtilityService(null);
                      router.push('/search?query=CSC%20Center');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📍 Find CSC / Setu Kendra in Boisar</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {selectedUtilityService === 'schedule' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    Western Railway
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Boisar Train Schedule</h3>
                  <p className="text-xs text-slate-500 font-medium">Live train timings &amp; Dahanu local schedule</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://enquiry.indianrail.gov.in/mntes/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>🚉 Live Train Running Status (NTES)</span>
                    <span>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUtilityService(null);
                      router.push('/search?query=Train');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📋 View Boisar Local Train Timetable</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {selectedUtilityService === 'coach' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    Platform &amp; Coach
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Coach Position</h3>
                  <p className="text-xs text-slate-500 font-medium">Find your coach position on platform</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://enquiry.indianrail.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>📍 Find Live Coach Position</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}

            {selectedUtilityService === 'link_aadhaar' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    Income Tax Department
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">Link Aadhaar with PAN</h3>
                  <p className="text-xs text-slate-500 font-medium">Verify or link your Aadhaar card online</p>
                </div>
                <div className="space-y-2">
                  <a
                    href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs"
                  >
                    <span>🔗 Link Aadhaar Online (Official)</span>
                    <span>→</span>
                  </a>
                  <a
                    href="https://myaadhaar.uidai.gov.in/verify-email-mobile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>📱 Verify Mobile Number in Aadhaar</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

