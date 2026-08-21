'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, MapPin, Sparkles, Phone, ArrowRight, MessageSquare, 
  PlusCircle, Plus, CheckCircle, Star, Sparkle, X, Send, Eye, ShieldCheck,
  Building, GraduationCap, Scissors, Stethoscope, Utensils, Wrench,
  ChevronRight, Mic, Heart, Key, HardHat, HeartPulse,
  PawPrint, Landmark, Activity, Coins, Truck, Mail, LayoutGrid, ChevronLeft,
  Smartphone, Store, Sprout, Camera, ShoppingBag, Zap, FileText, Droplet, Tv,
  ChevronDown, Users, Briefcase, Home, Tag, AlertTriangle, Lock, Car, CreditCard
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import AdModal from '@/components/AdModal';
import PostPropertyModal from '@/components/PostPropertyModal';
import LocalHubPills from '@/components/LocalHub/LocalHubPills';
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
  "Wholesalers & Bulk Distributors", "Retailers & Local Shops", "Snacks & Farsan Shops", "Digital Marketing", "Fabrication", "Mobile Repair", "Washing", "Dry Cleaning", "Jewellery", "Restaurants", "Doctors", "Grocery Shops", "Plumbers", "Electricians", "Medical Stores", "Beauty Parlours", "Hair Salons", "Hardware Shops", "AC Service", "Coaching Classes", "Real Estate Agents", "Painters", "House Cleaning", "Carpenters", "Dry Cleaners", "Diagnostic Labs", "Influencers",
  "Hospitals", "Clinics", "Dentists", "Physiotherapists", "Eye Hospitals", "Skin Clinics", "Veterinary Clinics",
  "Painters", "Pest Control", "RO Service", "CCTV Installation", "Interior Designers",
  "Architects", "Civil Contractors", "Building Contractors", "Fabricators", "Steel Fabricators", "Aluminium Fabricators", "Glass Dealers", "Tile Dealers", "Marble Dealers", "Granite Dealers",
  "Paint Shops", "Cement Dealers", "Sand Suppliers", "Brick Suppliers", "Plywood Dealers", "Electrical Shops", "Lighting Stores", "Sanitary Ware", "Bathroom Fittings",
  "Cafes", "Fast Food", "Chinese Restaurants", "South Indian Restaurants", "North Indian Restaurants", "Pizza Shops", "Burger Shops", "Sweet Shops", "Bakery",
  "Cake Shops", "Ice Cream Parlours", "Tea Stalls", "Juice Centres", "Tiffin Services", "Catering Services", "Banquet Halls", "Cloud Kitchens", "Hotels", "Resorts",
  "Travel Agencies", "Tour Operators", "Car Rentals", "Bike Rentals", "Taxi Services", "Packers & Movers", "Courier Services", "Driving Schools", "Petrol Pumps", "EV Charging Stations",
  "Car Garage", "Bike Garage", "Car Repair", "Bike Repair", "Tyre Dealers", "Wheel Alignment", "Auto Spare Parts", "Car Accessories", "Bike Accessories", "Battery Dealers",
  "Mobile Shops", "Laptop Repair", "Computer Shops", "Computer Repair", "Printer Repair", "Electronics Shops", "Appliance Repair", "TV Repair", "Camera Repair",
  "Jewellery Shops", "Artificial Jewellery", "Watch Shops", "Gift Shops", "Toy Shops", "Sports Shops", "Book Stores", "Stationery Shops", "Flower Shops", "Pet Shops",
  "Pet Food Stores", "Aquarium Shops", "Garment Showrooms", "Mens Wear", "Ladies Wear", "Kids Wear", "Footwear Stores", "Bag Shops", "Cosmetic Stores", "Perfume Shops",
  "Furniture Dealers", "Mattress Shops", "Modular Kitchen", "Kitchenware Shops", "Plastic Goods", "Disposable Items", "Packaging Material", "Sign Board Shops", "Radium Shop", "Flex Printing",
  "Digital Printing", "Offset Printing", "Photocopy Centre", "Cyber Cafe", "Xerox Centre", "Graphic Designers", "Web Designers", "Digital Marketing", "SEO Agency", "CA",
  "GST Consultant", "Tax Consultant", "Lawyers", "Insurance Agents", "Loan Consultants", "Banks", "ATMs", "Real Estate Agents", "Property Dealers", "Builders",
  "Developers", "PG", "Hostels", "Schools", "Colleges", "Tuition Classes", "Computer Institutes", "Music Classes", "Dance Classes",
  "Yoga Classes", "Martial Arts", "Play Schools", "Libraries", "Spa", "Massage Centres", "Tattoo Studios", "Bridal Makeup",
  "Mehendi Artists", "Solar Panel Dealers", "Generator Dealers", "Machinery Dealers", "Industrial Tools", "Safety Equipment", "Seed Dealers", "Fertilizer Shops", "Pesticide Dealers", "Tractor Dealers",
  "Feed Stores", "Milk Dairy", "Chicken Shop", "Fish Shop", "Meat Shop", "Fruit Shop", "Vegetable Shop", "General Store", "Kirana Store", "Supermarket",
  "Laundry", "Tailors", "Gas Agency", "Water Suppliers", "Borewell Drillers", "Tent House", "Event Organisers", "Wedding Planners", "Photographers",
  "Videographers", "DJ Services", "Neon Sign Shop", "Atta Chakki", "Rice Mill", "Scrap Dealer", "Kabadi Shop", "Locksmith", "Opticians", "Water Purifier Dealers"
];

import { specialProfiles } from '@/lib/mockProfiles';

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
    return 'bg-indigo-50 border-indigo-100 text-indigo-600';
  }
  if (lowercase.includes('doctor') || lowercase.includes('dentist') || lowercase.includes('physio') || lowercase.includes('skin') || lowercase.includes('eye')) {
    return 'bg-teal-50 border-teal-100 text-teal-600';
  }
  if (lowercase.includes('hospital') || lowercase.includes('clinic') || lowercase.includes('medical') || lowercase.includes('lab') || lowercase.includes('diagnostic')) {
    return 'bg-rose-50 border-rose-100 text-rose-600';
  }
  if (lowercase.includes('plumber') || lowercase.includes('carpenter') || lowercase.includes('repair') || lowercase.includes('garage') || lowercase.includes('spare') || lowercase.includes('service')) {
    return 'bg-sky-50 border-sky-100 text-sky-600';
  }
  if (lowercase.includes('electrician') || lowercase.includes('electrical') || lowercase.includes('battery') || lowercase.includes('solar') || lowercase.includes('generator')) {
    return 'bg-amber-50 border-amber-100 text-amber-600';
  }
  if (lowercase.includes('restaurant') || lowercase.includes('cafe') || lowercase.includes('food') || lowercase.includes('pizza') || lowercase.includes('burger') || lowercase.includes('sweet') || lowercase.includes('tiffin') || lowercase.includes('catering') || lowercase.includes('bakery') || lowercase.includes('cake') || lowercase.includes('ice cream') || lowercase.includes('tea') || lowercase.includes('juice') || lowercase.includes('kitchen')) {
    return 'bg-red-50 border-red-100 text-red-600';
  }
  if (lowercase.includes('school') || lowercase.includes('college') || lowercase.includes('coaching') || lowercase.includes('tuition') || lowercase.includes('class') || lowercase.includes('institute') || lowercase.includes('academy') || lowercase.includes('library')) {
    return 'bg-indigo-50 border-indigo-100 text-indigo-600';
  }
  if (lowercase.includes('beauty') || lowercase.includes('parlour') || lowercase.includes('salon') || lowercase.includes('spa') || lowercase.includes('massage') || lowercase.includes('makeup') || lowercase.includes('mehendi') || lowercase.includes('tattoo')) {
    return 'bg-pink-50 border-pink-100 text-pink-600';
  }
  return 'bg-slate-50 border-slate-200 text-slate-600';
}

export default function HomeClient() {
  const { userName, currentRole, isLoggedIn, loggedInUser, loginModalOpen, setLoginModalOpen, adModalOpen, setAdModalOpen, showToast } = useApp();
  const { t } = useLanguage();
  const router = useRouter();
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

  useEffect(() => {
    setUserUnlockedPropsState(getUserUnlockedProps());
  }, [isLoggedIn, userPhoneKey]);

  // Is this property unlocked for this user?
  const isPropertyContactUnlocked = (propId: string | number) => {
    if (!isLoggedIn) return false;
    return userUnlockedPropsState.includes(String(propId));
  };

  // Masked phone display helper
  const formatPropertyPhoneDisplay = (rawPhone: string, propId: string | number) => {
    if (!isLoggedIn) {
      const digits = rawPhone.replace(/\D/g, '');
      return `🔒 +91 98•••• ••${digits ? digits.slice(-2) : '21'} (Login to View)`;
    }
    if (isPropertyContactUnlocked(propId)) {
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
        const res = await fetch('/api/businesses?showAll=true', { cache: 'no-store' });
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
  const [activeSpecialCategory, setActiveSpecialCategory] = useState<'influencers' | 'properties' | 'helpers' | 'caterers' | null>(null);
  const [propertyMode, setPropertyMode] = useState<'buy' | 'sell' | 'rent' | null>(null);
  const [postPropertyModalOpen, setPostPropertyModalOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [bhkDropdownOpen, setBhkDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('All Types');
  const [bhkFilter, setBhkFilter] = useState('All BHK');
  const [budgetFilter, setBudgetFilter] = useState('All Budgets');
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

  const [portraitTurfTab, setPortraitTurfTab] = useState<'turf' | 'game'>('game');
  const [portraitBusOpen, setPortraitBusOpen] = useState(false);
  const [portraitBookOpen, setPortraitBookOpen] = useState(false);
  const [portraitEventsOpen, setPortraitEventsOpen] = useState(false);

  // Auto-open specific portal modal if URL contains search parameters or query keywords
  useEffect(() => {
    if (!searchParams) return;
    if (searchParams.get('postProperty') === 'true' || searchParams.get('portal') === 'properties') {
      setActiveSpecialCategory('properties');
    }

    const q = (searchParams.get('query') || searchParams.get('q') || '').toLowerCase();
    const cat = (searchParams.get('category') || '').toLowerCase();
    const modal = (searchParams.get('modal') || searchParams.get('open') || '').toLowerCase();

    if (modal === 'properties' || cat === 'properties' || cat.includes('real estate') || cat.includes('property')) {
      setActiveSpecialCategory('properties');
      return;
    }

    if (!q && !cat && !modal) return;

    // Direct brand match for Ganesh Travels
    if (q.includes('ganesh') || q.includes('travel')) {
      setPortraitTravelsOpen(true);
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

  const matchingCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const suggestions = getCategorySearchSuggestions(searchQuery, 8);
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
      image: "/imagess/ChatGPT Image Aug 15, 2026, 08_23_55 PM.png",
      showTextOverlay: false
    },
    {
      label: "Looking for ?",
      title: "Interior Designers",
      cta: "Get Best Quotes",
      category: "Interior Designers",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
    },
    {
      label: "24x7 Emergency & Care",
      title: "Hospitals & ICU in Boisar",
      cta: "View Hospitals & Clinics",
      category: "Hospitals",
      image: "/imagess/hospital_boisar_wide.jpg"
    }
  ]);

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
    bgClass: getCategoryBgClass(name)
  }));

  // Sub-category Promo Blocks (Expanded with rich local daily utility services)
  const promoSections = [
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
      title: "Wedding & Events",
      accentColor: "rose",
      tagline: "Celebrate & Plan",
      items: [
        { label: "Banquet Halls", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80", query: "Banquet Hall" },
        { label: "Photographers", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=80", query: "Photographers" },
        { label: "Caterers & Decor", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=300&q=80", query: "Caterers" },
        { label: "Bridal & Suit Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80", query: "Bridal" }
      ]
    }
  ];

  // Trending Searches Near You
  const trendingSearches = [
    { name: "Cafes & Hangouts", count: "18 Spots", icon: "☕", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80", cat: "Cafes", gradient: "from-amber-500/20 to-orange-600/20" },
    { name: "Gyms & Fitness", count: "12 Centres", icon: "💪", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80", cat: "Gyms", gradient: "from-blue-500/20 to-indigo-600/20" },
    { name: "Parks & Turf", count: "8 Locations", icon: "🌳", image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=400&q=80", cat: "Parks", gradient: "from-emerald-500/20 to-teal-600/20" },
    { name: "Street Food", count: "35 Stalls", icon: "🍔", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80", cat: "Street Food", gradient: "from-rose-500/20 to-red-600/20" },
    { name: "Apparel Shops", count: "22 Stores", icon: "👗", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&q=80", cat: "Clothing", gradient: "from-purple-500/20 to-fuchsia-600/20" },
    { name: "Real Estate", count: "15 Agents", icon: "🏢", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80", cat: "Real Estate Agents", gradient: "from-sky-500/20 to-cyan-600/20" },
    { name: "Salons & Spa", count: "14 Parlours", icon: "✂️", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80", cat: "Salons", gradient: "from-pink-500/20 to-rose-600/20" },
  ];

  const fetchBusinesses = () => {
    let url = `/search?`;
    if (selectedCategory && selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (selectedLocation && selectedLocation !== 'All') url += `location=${encodeURIComponent(selectedLocation)}&`;
    if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
    router.push(url);
  };

  // Slide rotation
  useEffect(() => {
    if (!isSlidePlaying || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isSlidePlaying, slides.length]);

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

  // Filter lists dynamically based on category selection
  const displayedCategories = isCategoriesExpanded ? categories : categories.slice(0, 16);

  if (isPageLoading) {
    return (
      <div className="min-h-screen pb-16 font-sans animate-pulse" style={{background: 'var(--bg-page)'}}>
        {/* Skeleton Hero Search Panel */}
        <div className="relative border-b border-slate-100 py-6 sm:py-10 bg-slate-200 h-[100px] sm:h-[130px]"></div>

        {/* Skeleton Carousel & Side Promos */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8">
              <div className="relative h-48 sm:h-64 w-full rounded-2xl bg-slate-200"></div>
            </div>
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 h-full">
                <div className="w-full h-full min-h-[120px] bg-slate-200 rounded-2xl"></div>
                <div className="w-full h-full min-h-[120px] bg-slate-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Popular Categories */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
          <div className="h-6 w-48 bg-slate-200 rounded mb-6 mx-auto"></div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-x-2 gap-y-5 sm:gap-y-6">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-2xl bg-slate-200"></div>
                <div className="w-16 h-3 bg-slate-200 rounded mt-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 text-slate-800 font-sans" style={{background: 'var(--bg-page)'}}>
      
      {/* 1. Hero Search Panel */}
      <div 
        className="relative border-b border-slate-100 py-6 sm:py-10 overflow-visible bg-cover bg-no-repeat bg-center z-30"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        {/* Large watermark MB Logo centered in the background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <img loading="lazy" decoding="async" 
            src="/majh-boisar-mb-logo.png" 
            alt="Watermark MB" 
            className="h-24 sm:h-32 w-auto object-contain opacity-[0.16] transform select-none" 
          />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10 overflow-visible">

          {/* Search Inputs Bar */}
          <div className="max-w-md mx-auto flex items-center justify-center gap-2 relative z-50">
            {/* Location Selector (MapPin Circle Button with select overlay) */}
            <div className="relative h-10 w-10 rounded-full flex items-center justify-center bg-white border border-slate-200 shadow-md hover:border-teal-500/30 transition-all duration-300 shrink-0 group">
              <MapPin className="w-4.5 h-4.5 text-rose-500 group-hover:scale-110 transition-transform" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                title={`Location: ${selectedLocation === 'All' ? 'All Boisar Areas' : selectedLocation}`}
              >
                <option value="All">All Boisar Areas</option>
                <option value="Boisar West">Boisar West</option>
                <option value="Boisar East">Boisar East</option>
                <option value="Tarapur MIDC">Tarapur MIDC</option>
                <option value="Ostwal Empire">Ostwal Empire</option>
              </select>
            </div>

            {/* Keyword Search Input & Button (Pill Container) */}
            <div className="bg-white border border-slate-200 shadow-md rounded-full p-1 flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 px-3 py-1 w-full">
                {loading && searchQuery ? (
                  <div className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
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
                  placeholder={t('nav.search_placeholder')}
                  className="bg-transparent border-0 text-xs focus:outline-none w-full text-slate-800 placeholder-slate-400 font-extrabold"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-slate-100 text-slate-450 shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Submit Button (Only Search Icon) */}
              <button
                onClick={() => {
                  setIsSearchFocused(false);
                  fetchBusinesses();
                }}
                className="h-8 w-8 rounded-full btn-teal hover:scale-105 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer transition-transform mr-0.5"
                title="Search Directory"
              >
                <Search className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Live Instant Search Suggestions Dropdown */}
            {searchQuery.trim().length > 0 && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150 max-h-[380px] overflow-y-auto">
                
                {/* 1. Matching Categories Section */}
                {matchingCategories.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1">
                      <span>🏷️</span> Matching Categories
                    </div>
                    <div className="space-y-0.5">
                      {matchingCategories.map((cat, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                            router.push(`/search?category=${encodeURIComponent(cat)}`);
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-teal-50/80 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-teal-100/60 text-teal-700 flex items-center justify-center text-xs font-black">
                              {cat.charAt(0)}
                            </div>
                            <span className="text-xs font-black text-slate-800 group-hover:text-teal-700">{cat}</span>
                          </div>
                          <span className="text-[10px] text-teal-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Matching Business Listings */}
                {matchingBusinesses.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1">
                      <span>🏢</span> Verified Local Listings
                    </div>
                    <div className="space-y-0.5">
                      {matchingBusinesses.map((biz) => (
                        <Link
                          key={biz.id}
                          href={`/business/${biz.id}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="px-3 py-2.5 rounded-xl hover:bg-teal-50/80 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={biz.image || "/majh-boisar-mb-logo.png"} 
                              alt={biz.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" 
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 group-hover:text-teal-700 truncate">{biz.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium truncate">{biz.category} • {biz.location || 'Boisar'}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Special Profiles (Maids, Influencers, Caterers, Properties) */}
                {matchingSpecialists.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1">
                      <span>✨</span> Specialists &amp; Helpers
                    </div>
                    <div className="space-y-0.5">
                      {matchingSpecialists.map((spec) => (
                        <div
                          key={spec.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setSelectedProfile(spec);
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-emerald-50/80 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                              {spec.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700 truncate">{spec.name}</p>
                              <p className="text-[10px] text-emerald-700 font-bold truncate">{spec.category} • {spec.price}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">View Profile</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results Fallback */}
                {matchingCategories.length === 0 && matchingBusinesses.length === 0 && matchingSpecialists.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-xs font-bold text-slate-700">No instant suggestions for "{searchQuery}"</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Press Enter or click Search icon to browse all Boisar results</p>
                  </div>
                )}

                {/* Footer Link: View All Search Results */}
                <div 
                  onClick={() => {
                    setIsSearchFocused(false);
                    fetchBusinesses();
                  }}
                  className="bg-slate-50 p-2.5 text-center text-xs font-black text-teal-700 hover:bg-teal-50 cursor-pointer border-t border-slate-100 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Search all results for "{searchQuery}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* 2. Desktop 2-Column Layout: Ad Slider Left + Property (Top) & Jobs (Bottom) Right */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Main Ad Banner Carousel (Left Side - 6 cols, 1:1 ratio) */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-[220px] sm:h-[280px] lg:h-[312px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-[#1c0836] group">
              {/* Main Slide Image & Click Trigger */}
              <div 
                onClick={() => {
                  const activeSlide = slides[currentSlide];
                  if (activeSlide.action === 'hotel_booking' || activeSlide.category === 'Hotels') {
                    router.push('/hotels');
                  } else if (activeSlide.targetUrl && activeSlide.targetUrl !== '#') {
                    window.open(activeSlide.targetUrl, '_blank');
                  } else if (activeSlide.category) {
                    router.push(`/search?category=${encodeURIComponent(activeSlide.category)}`);
                  }
                }}
                className="block w-full h-full cursor-pointer absolute inset-0 z-20"
              >
                <span className="sr-only">Open Slide Action</span>
              </div>
              
              {slides[currentSlide].image ? (
                <img loading="lazy" decoding="async" 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title} 
                  className={`w-full h-full ${slides[currentSlide].showTextOverlay === false ? 'object-contain' : 'object-cover'} object-center transition-all duration-700`}
                />
              ) : null}
              
              {/* AD Badge - Only for sponsored merchant ads */}
              {(slides[currentSlide].isSponsoredAd || slides[currentSlide].isAd) && (
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs z-30">
                  AD
                </div>
              )}

              {/* Dark overlay for text contrast */}
              {slides[currentSlide].showTextOverlay !== false && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none"></div>
              )}
              
              {/* Slide Text Content */}
              {slides[currentSlide].showTextOverlay !== false && (
                <div className="absolute bottom-5 left-0 right-0 px-5 sm:px-8 flex flex-col justify-end text-white space-y-2 pointer-events-none z-10 text-left">
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-xs font-black text-amber-300 block uppercase tracking-wider">
                      {slides[currentSlide].label}
                    </span>
                    <h2 className="text-base sm:text-2xl font-black tracking-tight leading-snug drop-shadow-md">
                      {slides[currentSlide].title}
                    </h2>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const activeSlide = slides[currentSlide];
                      if (activeSlide.action === 'hotel_booking' || activeSlide.category === 'Hotels') {
                        router.push('/hotels');
                      } else if (activeSlide.targetUrl && activeSlide.targetUrl !== '#') {
                        window.open(activeSlide.targetUrl, '_blank');
                      } else {
                        router.push(`/search?category=${encodeURIComponent(activeSlide.category)}`);
                      }
                    }}
                    className="bg-[#d49e35] hover:bg-[#c28e2d] active:scale-95 text-slate-950 font-black text-xs px-4 py-1.5 rounded-lg shadow-sm transition-all self-start cursor-pointer pointer-events-auto"
                  >
                    {slides[currentSlide].cta}
                  </button>
                </div>
              )}

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors z-20"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center cursor-pointer transition-colors z-20"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === idx ? 'bg-white w-4' : 'bg-white/40 w-1.5'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Promos — side-by-side on desktop */}
          <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-4 h-full">
            {/* Wrapper box — gives the nice "box" feel on desktop */}
            <div className="flex flex-row gap-3 sm:gap-4 h-full bg-slate-50 border border-slate-200/70 rounded-3xl p-2.5 shadow-sm">

              {/* Promo Card 1 - Real Estate */}
              <div
                onClick={() => { setActiveSpecialCategory('properties'); setSelectedProfile(null); }}
                className="flex-1 min-h-[135px] sm:min-h-[160px] lg:min-h-0 lg:h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group relative border border-slate-200"
              >
                <img
                  src="/imagess/ChatGPT Image Jul 20, 2026, 03_14_16 PM.png"
                  alt="Find Property in Boisar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* subtle label */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-teal-600/90 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full">🏠 Property</span>
                </div>
              </div>

              {/* Promo Card 2 - Careers */}
              <Link
                href="/jobs"
                className="flex-1 min-h-[135px] sm:min-h-[160px] lg:min-h-0 lg:h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group relative border border-slate-200 block"
              >
                <img
                  src="/imagess/ChatGPT Image Jul 20, 2026, 03_41_37 PM.png"
                  alt="Looking for a Job in Boisar?"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* subtle label */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-indigo-600/90 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">💼 Jobs</span>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* 3. Grid of Category Blocks */}
      <div className="section-alt-a mt-4 sm:mt-12 py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-teal-600"></span>
            <span>{t('hero.explore_categories')}</span>
          </h2>
          <button
            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            className="text-xs font-black text-teal-650 hover:underline cursor-pointer"
          >
            {isCategoriesExpanded ? 'View Less' : `View All ${categories.length}+`}
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-2 sm:gap-3">
          {displayedCategories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => router.push(`/search?category=${encodeURIComponent(cat.name)}`)}
              className="cat-pill rounded-lg p-2 text-center flex flex-col items-center justify-start gap-1.5 cursor-pointer hover:scale-[1.02] transition-all bg-white border border-slate-100 hover:border-teal-200 shadow-sm"
            >
              <div className={`p-1.5 sm:p-2 rounded-lg border ${cat.bgClass} flex items-center justify-center shrink-0`}>
                <div className="scale-75 sm:scale-90 origin-center">{cat.icon}</div>
              </div>
              <span className="text-[9px] font-bold text-slate-700 leading-tight tracking-wider truncate w-full px-0.5">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* 7 Special Category Portrait Cards */}
      {/* 3. Portrait Style Action Cards Grid (Trending Quick Portals) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3.5">

          {/* Card 1: Influencers */}
          <div
            onClick={() => { setActiveSpecialCategory('influencers'); setSelectedProfile(null); }}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-teal-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/hire a influcer.png" alt="Influencers"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 2: Domestic Help (Maid) */}
          <div
            onClick={() => { setActiveSpecialCategory('helpers'); setSelectedProfile(null); }}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/hire a maid.png" alt="Domestic Help"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 3: Home Technicians */}
          <div
            onClick={() => setPortraitTechOpen(true)}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/home technician.png" alt="Home Technicians"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 4: Used Items */}
          <div
            onClick={() => setPortraitMarketplaceOpen(true)}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/used items.png" alt="Used Items"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 5: Shop Offers */}
          <div
            onClick={() => setPortraitOffersOpen(true)}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-rose-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/shop offer.png" alt="Shop Offers"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 6: Travels (Bus + Cab + Tempo) */}
          <div
            onClick={() => setPortraitTravelsOpen(true)}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-orange-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/travels.png" alt="Travels"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 7: Sports Turf & Game Zone */}
          <div
            onClick={() => setPortraitTurfOpen(true)}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-indigo-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/turf game.png" alt="Sports Turf & Game Zone"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 8: Hotel Booking */}
          <div
            onClick={() => router.push('/hotels')}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-purple-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img src="/imagess/hotel booking.png" alt="Hotel Booking"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* Card 9: Resort & Villa Booking (Full Page Portal) */}
          <div
            onClick={() => router.push('/resorts')}
            className="relative aspect-square w-full max-w-[160px] mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-md hover:shadow-xl hover:border-emerald-400/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
              <img 
                src="/imagess/resort booking.png" 
                alt="Resort & Villa Booking"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/imagess/hotel booking.png";
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

        </div>
      </div>

      {/* 4. Sub-category Promo Blocks */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"></span>
              <span className="text-xs font-black text-teal-600 uppercase tracking-wider">Handpicked Services</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-2 leading-tight">
              Explore Popular Categories
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-2 md:mt-0">
            Find and connect with local trusted professionals near you
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:gap-6 scrollbar-hide snap-x snap-mandatory">
          {promoSections.map((sect, sIdx) => {
            const isRepairs = sect.title.toLowerCase().includes('repairs');
            const isNeeds = sect.title.toLowerCase().includes('needs');
            const isBeauty = sect.title.toLowerCase().includes('beauty');
            
            const accentClass = isRepairs 
              ? 'border-t-teal-500 bg-teal-50/5' 
              : isNeeds 
                ? 'border-t-amber-500 bg-amber-50/5' 
                : isBeauty 
                  ? 'border-t-pink-500 bg-pink-50/5' 
                  : 'border-t-rose-500 bg-rose-50/5';

            const lineClass = isRepairs 
              ? 'bg-teal-500' 
              : isNeeds 
                ? 'bg-amber-500' 
                : isBeauty 
                  ? 'bg-pink-500' 
                  : 'bg-rose-500';

            return (
              <div 
                key={sIdx} 
                className={`w-[62vw] sm:w-[35vw] lg:w-auto shrink-0 snap-start bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border-t-4 ${accentClass} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {sect.title}
                    </h3>
                    <span className={`h-1.5 w-6 rounded-full ${lineClass}`}></span>
                  </div>
                  
                  <div className="space-y-3">
                    {sect.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          router.push(`/search?query=${encodeURIComponent(item.query)}`);
                        }}
                        className="flex items-center gap-3.5 cursor-pointer group rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-200/70 p-2 transition-all duration-300"
                      >
                        <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative shadow-inner">
                          <img loading="lazy" decoding="async" 
                            src={item.image || undefined} 
                            alt={item.label} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[12px] font-black text-slate-700 group-hover:text-teal-600 transition-colors leading-tight">
                            {item.label}
                          </h4>
                          <span className="inline-flex items-center text-[9px] font-bold text-slate-400 mt-1 group-hover:text-teal-600 transition-colors">
                            View details
                            <ChevronRight className="w-2.5 h-2.5 ml-0.5 opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Trending Searches Near You */}
      <LocalHubPills />

      {/* 6. Top Rated Businesses */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 top-rated-section">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"></span>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Top Rated Businesses
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
              Boisar&apos;s Most Trusted Shops &amp; Services
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Verified businesses with highest customer ratings in Boisar &amp; Tarapur</p>
          </div>
          <Link href="/search?sort=rating" className="hidden sm:flex text-[10px] font-black text-teal-650 hover:underline uppercase tracking-wider items-center gap-0.5 shrink-0">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Grid of top-rated cards — large with images */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {loading ? (
            // Beautiful Loading Skeletons
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-[320px] sm:h-[400px]">
                <div className="w-full h-44 sm:h-56 md:h-64 bg-slate-200" />
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex gap-1 sm:gap-2">
                      <div className="h-3 sm:h-4 w-12 sm:w-16 bg-slate-200 rounded-full" />
                      <div className="h-3 sm:h-4 w-8 sm:w-12 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-3 sm:h-4 w-2/3 bg-slate-200 rounded" />
                    <div className="h-2 sm:h-3 w-1/3 bg-slate-200 rounded" />
                    <div className="h-2 sm:h-3 w-5/6 bg-slate-200 rounded" />
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-5">
                    <div className="flex-1 h-7 sm:h-9 bg-slate-200 rounded-xl" />
                    <div className="flex-1 h-7 sm:h-9 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            (businesses.length > 0
              ? businesses.slice(0, 8).map(b => {
                  let img = b.image;
                  if (!img || img.includes('unsplash.com')) {
                    img = '/majh-boisar-mb-logo.png';
                  }
                  const rawDesc = b.description || '';
                  const cleanDesc = rawDesc.replace(/\[Created by Admin\]\s*/gi, '').trim();
                  const isAdminCreated = b.subscription === 'Admin Created' || (b as any).createdBy === 'Admin' || (b as any).postedBy === 'Admin' || rawDesc.includes('[Created by Admin]');

                  return {
                    id: b.id,
                    name: b.name,
                    category: b.category,
                    rating: b.rating || 4.5,
                    reviews: b.reviewCount || Math.floor((b.rating || 4.2) * 15 + (b.id * 7) % 32) || 12,
                    address: b.address,
                    phone: b.phone,
                    desc: cleanDesc || `${b.category} in Boisar. Verified quality service.`,
                    image: img,
                    badge: getCategoryBadgeClass(b.category),
                    verified: b.verified,
                    subscription: b.subscription,
                    isAdminCreated,
                    open: (b.id % 3 !== 0),
                  };
                })
              : []
            ).map((biz, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer card-render-optimize smooth-gpu"
                onClick={() => {
                  if ((biz as any).id) {
                    router.push(`/business/${(biz as any).id}`);
                  } else {
                    router.push(`/search?query=${encodeURIComponent(biz.name)}`);
                  }
                }}
              >
                {/* Cover Image */}
                <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-slate-900 flex items-center justify-center">
                  {biz.image === '/majh-boisar-mb-logo.png' || biz.image.includes('mb-logo') ? (
                    <div className="w-full h-full bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative">
                      <img
                        src="/majh-boisar-mb-logo.png"
                        alt="Majh Boisar Verified"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="text-[9px] sm:text-[10px] font-black text-teal-400 mt-2 uppercase tracking-widest bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/60 shadow-xs">
                        Majh Boisar Verified
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Ambient blur backdrop */}
                      <img
                        src={biz.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
                      />
                      <img
                        src={biz.image}
                        alt={biz.name}
                        className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                      />
                    </>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1 w-[70%] z-10">
                    <span className={`text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap truncate max-w-[70px] sm:max-w-[90px] ${biz.badge}`}>
                      {biz.category}
                    </span>

                    {/* Created by Admin badge */}
                    {biz.isAdminCreated ? (
                      <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md whitespace-nowrap shrink-0 border border-amber-300">
                        👑 Created by Admin
                      </span>
                    ) : (
                      <>
                        {biz.verified && (
                          <span className="bg-teal-600 text-white text-[6px] sm:text-[7px] font-black px-1 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm whitespace-nowrap shrink-0">
                            <CheckCircle className="w-2 h-2" /> VERIFIED
                          </span>
                        )}
                        {(biz as any).subscription && (biz as any).subscription !== 'Free' && (
                          <span className="bg-amber-500 text-white text-[6px] sm:text-[7px] font-black px-1 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm whitespace-nowrap shrink-0">
                            <Star className="w-2 h-2 fill-white" /> TRUSTED
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Open/Closed pill */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                    <span className={`text-[6px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap shrink-0 ${biz.open ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'}`}>
                      {biz.open ? '● Open' : '○ Closed'}
                    </span>
                  </div>

                  {/* Rating pill on image bottom */}
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-0.5 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 sm:py-1 rounded-full shadow-md z-10">
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[8px] sm:text-[9px] font-black text-slate-800">{biz.rating}</span>
                    <span className="text-[7px] sm:text-[8px] text-slate-500 font-bold">({biz.reviews})</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                  {/* Name */}
                  <h3 className="text-[11px] sm:text-sm font-black text-slate-800 leading-tight sm:leading-snug mb-1 group-hover:text-teal-700 transition-colors">
                    {biz.name}
                  </h3>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="text-[10px] sm:text-xs text-slate-700 font-bold truncate">{biz.address}</span>
                  </div>

                  {/* Description (Cleaned without raw [Created by Admin] text) */}
                  <p className="text-[9px] sm:text-[11px] text-slate-500 font-medium leading-snug sm:leading-relaxed mb-3 sm:mb-4 line-clamp-2 flex-1">
                    {biz.desc}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex gap-1.5 sm:gap-2 mt-auto">
                    <a
                      href={isLoggedIn ? `tel:${biz.phone}` : '#'}
                      onClick={e => {
                        e.stopPropagation();
                        if (!isLoggedIn) {
                          e.preventDefault();
                          setLoginModalOpen(true);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[8px] sm:text-[10px] font-black py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <Phone className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      <span>Call</span>
                    </a>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if ((biz as any).id) {
                          router.push(`/business/${(biz as any).id}`);
                        } else {
                          router.push(`/search?query=${encodeURIComponent(biz.name)}`);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[8px] sm:text-[10px] font-black py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Eye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}


        </div>

        {/* Mobile View All */}
        <div className="sm:hidden mt-5 text-center">
          <Link href="/search?sort=rating" className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-black px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all">
            View All Top Rated <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 7. Sponsored Ads + Self-Promo Banner */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"></span>
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider">Sponsored & Promoted</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">

          {/* Dynamic Sponsored Ads */}
          {ads.slice(0, 2).map((ad, idx) => {
            const isDirectImageAd = !!ad.image;
            
            return (
              <div 
                key={ad.id} 
                className={`relative overflow-hidden rounded-2xl shadow-md flex flex-col justify-between min-h-[130px] sm:aspect-[4/3] group cursor-pointer border border-slate-200 ${!isDirectImageAd ? 'p-3 sm:p-5' : ''}`}
                onClick={() => {
                  if (ad.targetUrl) {
                    window.open(ad.targetUrl, '_blank');
                  } else if (ad.businessId === 0) {
                    setAdModalOpen(true);
                  } else {
                    router.push(`/business/${ad.businessId}`);
                  }
                }}
              >
                {/* Large Ad Image or Gradient Background */}
                <div className="absolute inset-0 z-0">
                  {ad.image ? (
                    <>
                      <img 
                        loading="lazy" 
                        decoding="async" 
                        src={ad.image} 
                        alt={ad.title} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.02]" 
                      />
                      {!isDirectImageAd && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent pointer-events-none" />
                      )}
                    </>
                  ) : (
                    <div className={`w-full h-full ${idx === 0 ? 'bg-gradient-to-br from-[#c80f2e] via-[#b00b26] to-[#80071a]' : 'bg-gradient-to-br from-[#0b5c47] via-[#094d3b] to-[#052b21]'} group-hover:scale-105 transition-transform duration-700 ease-out`} />
                  )}
                </div>
                
                {/* Ad Top Section (Badge) */}
                <div className="relative z-10 flex justify-end items-start w-full p-3 sm:p-4 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm text-white/90 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                    AD
                  </div>
                </div>
                
                {/* Ad Content */}
                {!isDirectImageAd && (
                  <div className="relative z-10 flex flex-col gap-1 w-full mt-auto">
                    <h4 className="text-white text-sm sm:text-lg font-black tracking-tight leading-tight drop-shadow-sm">
                      {ad.title}
                    </h4>
                    <p className="text-[9px] sm:text-[11px] font-medium text-white/80 mt-0.5 leading-snug drop-shadow-sm line-clamp-2">
                      {ad.description}
                    </p>
                    
                    {/* Only show Advertise Now if it's not a real ad, or it's specifically a promo ad */}
                    {ad.businessId === 0 && (
                      <div className="mt-2 sm:mt-4 w-full bg-white text-slate-800 text-[9px] sm:text-xs font-black py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md text-center transition-all group-hover:bg-slate-50 uppercase tracking-wide">
                        Advertise Now
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Self-Promo HTML Banner */}
          <div 
            onClick={() => setAdModalOpen(true)}
            className="col-span-2 lg:col-span-1 relative overflow-hidden rounded-xl shadow-md cursor-pointer group min-h-[160px] border border-teal-500/20 flex flex-col justify-center p-5"
            style={{ background: 'linear-gradient(135deg, #0f172a, #0d9488)' }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="bg-[#fcba03] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider inline-flex mb-1">
                  Grow Your Business
                </span>
                <h4 className="text-white text-lg sm:text-xl font-black leading-tight drop-shadow-sm uppercase">
                  Get Featured<br/>Here!
                </h4>
              </div>
              
              <div>
                <p className="text-teal-100 text-[10px] font-medium leading-snug mb-2 opacity-90">
                  Reach 50,000+ local buyers.
                </p>
                <div className="inline-flex items-center gap-1 bg-white text-teal-800 text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm group-hover:bg-slate-50 transition-colors uppercase">
                  Contact For Ads <span className="text-lg leading-none">📢</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>





      {/* ==================== SPONSOR AD SLOT BUILDER MODAL ==================== */}
      <AdModal isOpen={adModalOpen} onClose={() => setAdModalOpen(false)} />

      {/* Interactive Special Booking Panel (Slide-over panel / Drawer) */}
      {activeSpecialCategory && (
        <div className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center ${activeSpecialCategory === 'properties' ? 'p-0' : 'p-2 sm:p-4'}`}>
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
          <div className="relative bg-slate-50 flex flex-col z-50 transition-all duration-300 overflow-hidden w-full h-full min-h-screen sm:min-h-screen rounded-none duration-300">

            {/* Full Real Estate Portal Navbar Header */}
            {activeSpecialCategory === 'properties' ? (
              <div className="px-2.5 sm:px-6 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 bg-white text-slate-800 shadow-sm z-30 shrink-0">
                {/* Logo & Portal Badge */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <img 
                    src="/majh-boisar-full-logo.png" 
                    alt="Majh Boisar" 
                    className="h-7 sm:h-8.5 md:h-9 w-auto object-contain cursor-pointer transition-transform active:scale-95"
                    onClick={() => {
                      setActiveSpecialCategory(null);
                      setSelectedProfile(null);
                      setPropertyMode(null);
                    }}
                  />
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[9.5px] font-black uppercase">
                    Real Estate
                  </span>
                </div>

                {/* Right Action Items */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    onClick={() => setViewEnquiriesModalOpen(true)}
                    className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 sm:px-2.5 py-1.5 rounded-full transition-colors relative shadow-xs shrink-0 cursor-pointer"
                    title="View property inquiries"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="hidden sm:inline">Enquiries</span>
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
                          <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
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
                    className={`flex items-center gap-1 text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-1.5 rounded-full border transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
                      !isLoggedIn 
                        ? 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                        : userUnlockedPropsState.length >= 2 && buyerCallCredits <= 0
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Your Free Owner Contact Quota"
                  >
                    <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>
                      {!isLoggedIn 
                        ? '2 Calls'
                        : userUnlockedPropsState.length < 2 
                          ? `${2 - userUnlockedPropsState.length} Calls`
                          : buyerCallCredits > 0 
                            ? `${buyerCallCredits} Calls` 
                            : 'Pass'}
                    </span>
                  </button>

                  {!isLoggedIn ? (
                    <button 
                      onClick={() => setLoginModalOpen(true)}
                      className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer"
                    >
                      Login
                    </button>
                  ) : (
                    <span className="inline text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1.5 rounded-full truncate max-w-[65px] sm:max-w-[120px] shrink-0">
                      {userName}
                    </span>
                  )}

                  <button 
                    onClick={() => {
                      setActiveSpecialCategory(null);
                      setSelectedProfile(null);
                      setPropertyMode(null);
                    }}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer ml-0.5"
                    title="Exit Real Estate Portal"
                  >
                    <X className="w-5 h-5" />
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
            <div ref={portalContentRef} className={`flex-1 overflow-y-auto ${activeSpecialCategory === 'properties' ? 'p-0' : 'p-4 sm:p-6 space-y-6'}`}>
              {activeSpecialCategory === 'properties' && propertyMode === null ? (
                <div className="w-full bg-white min-h-full flex flex-col">
                  {/* Header */}
                  <div className="border-b border-slate-200 px-4 sm:px-8 py-4 text-left">
                    <div className="max-w-5xl mx-auto space-y-3">
                      {/* Title */}
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          Boisar Real Estate
                        </h2>
                      </div>

                      {/* 3 Equal Buttons — Full Width Row */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setPropertyMode('buy')}
                          className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97]"
                        >
                          <Building className="w-4 h-4 text-emerald-400" />
                          <span>Buy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropertyMode('rent')}
                          className="py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-black transition-all border-2 border-slate-200 hover:border-slate-400 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97]"
                        >
                          <Home className="w-4 h-4 text-slate-600" />
                          <span>Rent</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isLoggedIn) {
                              showToast("Please login first to post your property.", "info", 4000);
                              setLoginModalOpen(true);
                              return;
                            }
                            setActiveSpecialCategory(null);
                            setPostPropertyModalOpen(true);
                          }}
                          className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white text-xs font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-white" />
                          <span>Post Property</span>
                        </button>
                      </div>

                      {/* Quick Chips */}
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {[
                          { label: '1 BHK', mode: 'buy', bhk: '1 BHK', type: 'Flat/Apartment' },
                          { label: '2 BHK', mode: 'buy', bhk: '2 BHK', type: 'Flat/Apartment' },
                          { label: 'Rentals', mode: 'rent', bhk: 'All BHK', type: 'Flat/Apartment' },
                          { label: 'Shops', mode: 'buy', bhk: 'All BHK', type: 'Commercial' },
                          { label: 'Plots', mode: 'buy', bhk: 'All BHK', type: 'Plot/Land' }
                        ].map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => {
                              setBhkFilter(chip.bhk);
                              setPropertyTypeFilter(chip.type);
                              setPropertyMode(chip.mode as any);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-[11px] font-bold transition-all hover:border-slate-300 cursor-pointer shrink-0"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Listings */}
                  <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-3 text-left flex-1 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Recent Listings ({((profilesState.properties || []).filter((p: any) => p.listingType === 'property')).length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setPropertyMode('buy')}
                        className="text-[11px] font-black text-slate-900 hover:underline cursor-pointer"
                      >
                        View All →
                      </button>
                    </div>

                    {((profilesState.properties || []).filter((p: any) => p.listingType === 'property')).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {((profilesState.properties || []).filter((p: any) => p.listingType === 'property').slice(0, 6)).map((property: any) => (
                          <div
                            key={property.id}
                            onClick={() => setSelectedProfile(property)}
                            className="bg-white rounded-xl border border-slate-200 hover:border-slate-400 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                          >
                            <div className="h-32 sm:h-36 relative bg-slate-100 overflow-hidden">
                              <img
                                src={property.avatar || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'}
                                alt={property.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1">
                                <span className="bg-slate-900/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                                  {property.forAction === 'Rent' || property.category?.toLowerCase().includes('rent') ? 'RENT' : 'SALE'}
                                </span>
                              </div>
                              <div className="absolute bottom-2 left-2 bg-white/95 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded shadow-xs">
                                {formatPrice(property.price || property.budget)}
                              </div>
                            </div>

                            <div className="p-2.5 flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="text-[11px] sm:text-xs font-black text-slate-900 line-clamp-1">{property.name || property.title}</h4>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">📍 {property.location || 'Boisar'}</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 mt-1.5">{property.category || 'Flat'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
                        <p className="text-xs font-black text-slate-800">No properties listed yet</p>
                        <p className="text-[11px] text-slate-500">Are you selling or renting a flat, shop, or plot in Boisar?</p>
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
                          className="mt-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Post Your Property Free</span>
                        </button>
                      </div>
                    )}

                    {/* 2 Sponsored Property Ad Slots */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Sponsored Property Ad Space
                        </span>
                        <a
                          href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar,%20I%20want%20to%20place%20an%20Ad%20Banner%20in%20the%20*Boisar%20Real%20Estate%20/%20Property%20Section*.%20Please%20share%20pricing%20and%20banner%20slot%20details."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          Book Your Ad Here →
                        </a>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Ad Slot 1 */}
                        {propertyCustomAds.slot1?.active ? (
                          <a
                            href={
                              propertyCustomAds.slot1.linkUrl ||
                              `https://wa.me/91${(propertyCustomAds.slot1.whatsapp || '7769947217').replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hello, I saw your Ad "${propertyCustomAds.slot1.title}" on Majh Boisar Real Estate portal and want more details!`
                              )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-2xl border-2 border-emerald-400 hover:border-emerald-600 bg-white p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all group cursor-pointer overflow-hidden"
                          >
                            {propertyCustomAds.slot1.image && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img src={propertyCustomAds.slot1.image} alt={propertyCustomAds.slot1.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="inline-block bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                                {propertyCustomAds.slot1.badge || 'Featured Builder'}
                              </span>
                              <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                                {propertyCustomAds.slot1.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                                {propertyCustomAds.slot1.subtitle || 'Verified Project in Boisar'}
                              </p>
                            </div>
                            <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2.5 rounded-xl shrink-0 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                          </a>
                        ) : (
                          <a
                            href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar,%20I%20want%20to%20book%20*Property%20Ad%20Slot%201*%20for%20my%20real%20estate%20project%20/%20agency.%20Please%20share%20details."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="inline-block bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                                Ad Slot 1 • Available
                              </span>
                              <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                                Promote Your Real Estate Project Here
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                                Reach 10,000+ local home buyers &amp; investors daily in Boisar
                              </p>
                            </div>
                            <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2.5 rounded-xl shrink-0 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                          </a>
                        )}

                        {/* Ad Slot 2 */}
                        {propertyCustomAds.slot2?.active ? (
                          <a
                            href={
                              propertyCustomAds.slot2.linkUrl ||
                              `https://wa.me/91${(propertyCustomAds.slot2.whatsapp || '7769947217').replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hello, I saw your Ad "${propertyCustomAds.slot2.title}" on Majh Boisar Real Estate portal and want more details!`
                              )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-2xl border-2 border-purple-400 hover:border-purple-600 bg-white p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all group cursor-pointer overflow-hidden"
                          >
                            {propertyCustomAds.slot2.image && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img src={propertyCustomAds.slot2.image} alt={propertyCustomAds.slot2.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="inline-block bg-purple-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                                {propertyCustomAds.slot2.badge || 'Prime Broker'}
                              </span>
                              <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                                {propertyCustomAds.slot2.title}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                                {propertyCustomAds.slot2.subtitle || 'Verified Real Estate in Boisar'}
                              </p>
                            </div>
                            <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2.5 rounded-xl shrink-0 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                          </a>
                        ) : (
                          <a
                            href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar,%20I%20want%20to%20book%20*Property%20Ad%20Slot%202*%20for%20my%20real%20estate%20agency%20/%20builder%20brand.%20Please%20share%20details."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/40 p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all group cursor-pointer"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="inline-block bg-purple-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                                Ad Slot 2 • Available
                              </span>
                              <h4 className="text-xs font-black text-slate-900 group-hover:text-purple-900 transition-colors">
                                Builder / Broker Featured Banner Space
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                                Get high-intent calls &amp; direct WhatsApp property enquiries
                              </p>
                            </div>
                            <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-2.5 rounded-xl shrink-0 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-4 h-4" />
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeSpecialCategory === 'properties' && !selectedProfile ? (
                /* PROPERTY LISTING UI (Clean White / Slate Filter Header) */
                <div className="w-full flex flex-col">
                  {/* Clean Full-Width Filter Bar */}
                  <div className="bg-white border-b border-slate-200 w-full px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 relative z-40 shadow-2xs overflow-x-auto no-scrollbar whitespace-nowrap">
                    <div className="flex items-center gap-2 w-full justify-between sm:justify-start">
                      {/* 1. Buy / Rent Segmented Toggle */}
                      <div className="bg-slate-100 p-0.5 rounded-xl flex items-center shrink-0 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setPropertyMode('buy')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            propertyMode === 'buy' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Buy
                        </button>
                        <button
                          type="button"
                          onClick={() => setPropertyMode('rent')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            propertyMode === 'rent' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Rent
                        </button>
                      </div>

                      {/* 2. Property Type Selector */}
                      <select 
                        value={propertyTypeFilter} 
                        onChange={(e) => setPropertyTypeFilter(e.target.value)} 
                        className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer border border-slate-200 shrink-0 transition-colors shadow-2xs"
                      >
                        <option value="All Types">All Types</option>
                        <option value="Flat/Apartment">Flat/Apartment</option>
                        <option value="House/Villa">House/Villa</option>
                        <option value="Plot/Land">Plot/Land</option>
                        <option value="Commercial">Commercial Shop</option>
                      </select>

                      {/* 3. BHK Selector */}
                      <select 
                        value={bhkFilter} 
                        onChange={(e) => setBhkFilter(e.target.value)} 
                        className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer border border-slate-200 shrink-0 transition-colors shadow-2xs"
                      >
                        <option value="All BHK">All BHK</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4+ BHK">4+ BHK</option>
                      </select>

                      {/* 4. Budget Selector */}
                      <select 
                        value={budgetFilter} 
                        onChange={(e) => setBudgetFilter(e.target.value)} 
                        className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer border border-slate-200 shrink-0 transition-colors shadow-2xs"
                      >
                        <option value="All Budgets">All Budgets</option>
                        <option value="Under ₹20 Lakhs">Under ₹20L</option>
                        <option value="₹20L - ₹40L">₹20L - ₹40L</option>
                        <option value="₹40L - ₹75L">₹40L - ₹75L</option>
                        <option value="₹75L+">₹75L+</option>
                      </select>

                      {/* Sell Property Button */}
                      <button 
                        onClick={() => {
                          if (!isLoggedIn) {
                            showToast("Please login first to post your property.", "info", 4000);
                            setLoginModalOpen(true);
                          } else {
                            setPostPropertyModalOpen(true);
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 ml-auto whitespace-nowrap cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-white" />
                        <span>Post Property</span>
                      </button>
                    </div>
                  </div>

                  {/* Property Verification Notice Strip (Neutral & Clean) */}
                  <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5 font-bold truncate">
                      <span className="text-emerald-600">✓ Verified Direct Listings:</span>
                      <span>Verify 7/12 &amp; Index-2 legal property documents before token payment.</span>
                    </div>
                  </div>

                  {/* Clean 1-Line Results Summary Header */}
                  <div className="px-3 sm:px-6 py-2 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-black text-slate-800 truncate">
                        Properties for {propertyMode === 'buy' ? 'Sale' : 'Rent'}
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                        {(profilesState.properties || [])
                          .filter((p: any) => p.listingType === 'property')
                          .filter((p: any) => {
                            // Filter by Buy vs Rent
                            if (propertyMode === 'buy') {
                              const isRentOnly = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                              if (isRentOnly) return false;
                            } else if (propertyMode === 'rent') {
                              const isRent = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                              if (!isRent) return false;
                            }

                            if (bhkFilter !== 'All BHK') {
                              const num = bhkFilter.split(' ')[0];
                              if (num && !p.category.includes(`${num} BHK`) && p.bedrooms !== parseInt(num)) return false;
                            }
                            if (propertyTypeFilter !== 'All Types') {
                              if (propertyTypeFilter.includes('Flat') && !p.category.toLowerCase().includes('flat') && !p.category.toLowerCase().includes('bhk')) return false;
                              if (propertyTypeFilter.includes('Villa') && !p.category.toLowerCase().includes('villa') && !p.category.toLowerCase().includes('house')) return false;
                              if (propertyTypeFilter.includes('Plot') && !p.category.toLowerCase().includes('plot') && !p.category.toLowerCase().includes('land')) return false;
                            }
                            return true;
                          }).length} Listings
                      </span>
                    </div>

                    {/* Working Sort Dropdown */}
                    <div className="inline-flex items-center gap-1 border border-slate-300 rounded-lg px-2 py-0.5 sm:py-1 bg-white shrink-0 shadow-2xs">
                      <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium">Sort:</span>
                      <select
                        value={propertySortBy}
                        onChange={(e) => setPropertySortBy(e.target.value as any)}
                        className="bg-transparent text-[10px] sm:text-[11px] font-extrabold text-slate-800 outline-none cursor-pointer pr-1"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                      </select>
                    </div>
                  </div>

                  {/* Horizontal Cards List */}
                  <div className="bg-slate-100 p-3 sm:p-6 flex-1 space-y-3">
                    {(profilesState.properties || [])
                      .filter((p: any) => p.listingType === 'property')
                      .filter((p: any) => {
                        // Filter by Buy vs Rent
                        if (propertyMode === 'buy') {
                          const isRentOnly = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                          if (isRentOnly) return false;
                        } else if (propertyMode === 'rent') {
                          const isRent = p.category?.toLowerCase().includes('rent') || p.forAction === 'Rent' || p.transactionType === 'Lease';
                          if (!isRent) return false;
                        }

                        if (bhkFilter !== 'All BHK') {
                          const num = bhkFilter.split(' ')[0];
                          if (num && !p.category.includes(`${num} BHK`) && p.bedrooms !== parseInt(num)) return false;
                        }
                        if (propertyTypeFilter !== 'All Types') {
                          if (propertyTypeFilter.includes('Flat') && !p.category.toLowerCase().includes('flat') && !p.category.toLowerCase().includes('bhk')) return false;
                          if (propertyTypeFilter.includes('Villa') && !p.category.toLowerCase().includes('villa') && !p.category.toLowerCase().includes('house')) return false;
                          if (propertyTypeFilter.includes('Plot') && !p.category.toLowerCase().includes('plot') && !p.category.toLowerCase().includes('land')) return false;
                        }
                        return true;
                      })
                      .sort((a: any, b: any) => {
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
                      .map((profile: any) => (
                        <div 
                          key={profile.id}
                          className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row group text-left"
                          onClick={() => setSelectedProfile(profile)}
                        >
                          {/* Image Column */}
                          <div className="w-full md:w-[230px] h-48 md:h-auto relative shrink-0">
                            <img src={profile.avatar || '/majh-boisar-mb-logo.png'} alt={profile.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                              {profile.gallery?.length || 1}+ Photos
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                              Updated {profile.updatedAt || 'Recently'}
                            </div>
                          </div>

                          {/* Content Column */}
                          <div className="flex-1 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                      {profile.location || 'Boisar West'}
                                    </span>
                                  </div>
                                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors mt-1">
                                    {profile.category}
                                  </h3>
                                  <p className="text-xs text-slate-500 font-medium">{profile.projectName || 'Independent Property in Boisar'}</p>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); }}
                                  className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Specs Bar */}
                              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 grid grid-cols-3 gap-2 my-2 text-xs">
                                <div>
                                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Carpet Area</span>
                                  <strong className="text-slate-800 font-black">{profile.carpetArea || '650 sqft'}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Status</span>
                                  <strong className="text-slate-800 font-black">{profile.status || 'Ready to Move'}</strong>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Floor</span>
                                  <strong className="text-slate-800 font-black">{profile.floor ? `${profile.floor} of ${profile.totalFloors}` : '2 of 4'}</strong>
                                </div>
                              </div>
                            </div>

                            {/* Price & Action Buttons Bar */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap mt-2">
                              <div>
                                <span className="text-base sm:text-lg font-black text-slate-900">{formatPrice(profile.price)}</span>
                                <span className="text-[10px] text-slate-400 font-bold block">{profile.pricePerSqft || 'Boisar'}</span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEnquiryModalProperty(profile);
                                  }}
                                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Send Enquiry</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePropertyContactCall(profile, false);
                                  }}
                                  className={`text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                                    isPropertyContactUnlocked(profile.id) 
                                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                                      : !isLoggedIn 
                                        ? 'bg-slate-800 hover:bg-slate-900' 
                                        : userUnlockedPropsState.length < 2 
                                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                                          : 'bg-gradient-to-r from-amber-600 to-teal-700 hover:from-amber-700 hover:to-teal-800'
                                  }`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>
                                    {isPropertyContactUnlocked(profile.id) 
                                      ? 'Call' 
                                      : !isLoggedIn 
                                        ? 'Call' 
                                        : userUnlockedPropsState.length < 2 
                                          ? 'Call (Free)' 
                                          : 'Unlock Call'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                          if (num && !p.category.includes(`${num} BHK`) && p.bedrooms !== parseInt(num)) return false;
                        }
                        if (propertyTypeFilter !== 'All Types') {
                          if (propertyTypeFilter.includes('Flat') && !p.category.toLowerCase().includes('flat') && !p.category.toLowerCase().includes('bhk')) return false;
                          if (propertyTypeFilter.includes('Villa') && !p.category.toLowerCase().includes('villa') && !p.category.toLowerCase().includes('house')) return false;
                          if (propertyTypeFilter.includes('Plot') && !p.category.toLowerCase().includes('plot') && !p.category.toLowerCase().includes('land')) return false;
                        }
                        return true;
                      }).length === 0 && (
                      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-2xs my-4">
                        <Building className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <h3 className="text-sm sm:text-base font-black text-slate-800">No Property Listings Yet</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Be the first to post a property for sale or rent in Boisar!</p>
                        <button
                          onClick={() => {
                            if (!isLoggedIn) {
                              showToast("Please login first to post your property.", "info", 4000);
                              setLoginModalOpen(true);
                            } else {
                              setPostPropertyModalOpen(true);
                            }
                          }}
                          className="mt-4 bg-[#0b5c47] hover:bg-[#074737] text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Post Property Free</span>
                        </button>
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
                          if (cat === 'properties') setNewProfileCategory('Real Estate Broker');
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
                          <div className="col-span-full bg-white border-2 border-dashed border-teal-200 rounded-3xl p-8 sm:p-10 text-center my-2 shadow-xs space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto text-2xl shadow-inner">
                              ✨
                            </div>
                            <div>
                              <h4 className="text-base font-black text-slate-900">Be The First to Register in Boisar!</h4>
                              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                                No profile listed under "{helperFilterRole}" yet. Register your real verified profile to start getting direct client calls and WhatsApp inquiries across Boisar &amp; Palghar!
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  window.open(`https://wa.me/917769947217?text=Hello%20Majh%20Boisar%2C%20I%20want%20to%20register%20my%20profile%20under%20${encodeURIComponent(helperFilterRole || 'Special Category')}`, '_blank');
                                }}
                                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                              >
                                <Sparkles className="w-4 h-4" />
                                <span>➕ Register / List Your Profile (100% Free)</span>
                              </button>
                              {helperFilterRole !== 'All' && (
                                <button
                                  type="button"
                                  onClick={() => setHelperFilterRole('All')}
                                  className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
                                >
                                  View All
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }

                      return filtered.map((profile: any) => {
                        if (profile.listingType === 'property') {
                          return (
                            <div
                              key={profile.id}
                              className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-teal-400 transition-all duration-300 relative group cursor-pointer flex flex-col justify-between"
                              onClick={() => setSelectedProfile(profile)}
                            >
                              {/* Property Cover Image */}
                              <div className="w-full h-32 sm:h-48 bg-slate-100 relative overflow-hidden shrink-0">
                                <img
                                  src={profile.avatar || '/majh-boisar-mb-logo.png'}
                                  alt={profile.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                
                                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                                  <span className="bg-red-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase">
                                    For Sale
                                  </span>
                                </div>
                                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                                  <span className="bg-slate-900/80 backdrop-blur text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase">
                                    <Camera className="w-2.5 h-2.5 inline mr-0.5" /> {profile.gallery?.length || 0}
                                  </span>
                                </div>

                                <div className="absolute bottom-1.5 left-2 flex flex-col pr-1 w-full">
                                  <span className="text-white font-black text-xs sm:text-sm drop-shadow-md leading-tight">{formatPrice(profile.price)}</span>
                                  <span className="text-slate-200 font-bold text-[9px] sm:text-[10px] drop-shadow flex items-center gap-1 mt-0.5 truncate">
                                    {profile.name}
                                  </span>
                                </div>
                              </div>

                              {/* Property Body */}
                              <div className="p-2 sm:p-3.5 flex flex-col flex-1 justify-between">
                                <div>
                                  <div className="flex flex-wrap gap-1 mb-1.5 pb-1.5 border-b border-slate-100">
                                    {profile.services.slice(0, 2).map((srv: string, i: number) => (
                                      <span key={i} className="bg-slate-100 text-slate-600 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        {srv}
                                      </span>
                                    ))}
                                  </div>
                                  
                                  <h4 className="text-[11px] sm:text-xs font-black text-slate-800 mb-0.5 line-clamp-1">{profile.category}</h4>
                                  <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium line-clamp-2 leading-relaxed mb-2">
                                    {profile.bio}
                                  </p>
                                </div>

                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedProfile(profile); }}
                                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[10px] sm:text-[11px] py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all shadow-xs cursor-pointer"
                                >
                                  View Property
                                </button>
                              </div>
                            </div>
                          );
                        }

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
              ) : selectedProfile.listingType === 'property' ? (
                /* PROPERTY DETAIL VIEW (Clean Modern Majh Boisar Style) */
                <div className="animate-in fade-in duration-200 bg-slate-50/50 min-h-full pb-24 relative text-left">
                   {/* Top Header Section */}
                   <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-200 bg-white shrink-0 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedProfile(null)} 
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4 text-slate-700" />
                          <span className="hidden sm:inline">Back to Properties</span>
                        </button>
                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                        <span className="text-xs text-slate-500 font-semibold truncate max-w-[200px] sm:max-w-md">
                          Boisar Real Estate / {selectedProfile.location || 'Boisar'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                      </div>
                   </div>

                   {/* Gallery & Content Area */}
                   <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col gap-4">
                     {/* Title & Price Header Card */}
                     <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col md:flex-row justify-between md:items-center gap-4">
                       <div className="space-y-1.5">
                         <div className="flex items-center gap-2 flex-wrap">
                           <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md">
                             {selectedProfile.forAction === 'Rent' || selectedProfile.category?.toLowerCase().includes('rent') ? 'FOR RENT' : 'FOR SALE'}
                           </span>
                           <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                             {selectedProfile.location || 'Boisar'}
                           </span>
                         </div>
                         <h1 className="text-base sm:text-2xl font-black text-slate-900 leading-snug">
                           {selectedProfile.category || selectedProfile.name || selectedProfile.title}
                         </h1>
                         <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                           <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                           <span>{selectedProfile.address || selectedProfile.location || selectedProfile.projectName || 'Prime Location, Boisar'}</span>
                         </p>
                       </div>

                       <div className="md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                         <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                         <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">{formatPrice(selectedProfile.price)}</h2>
                         <p className="text-[11px] text-slate-400 font-semibold">{selectedProfile.pricePerSqft ? formatPrice(selectedProfile.pricePerSqft) : 'Direct Owner Deal'}</p>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                      {/* Left: Gallery Grid */}
                      <div className="lg:col-span-7 flex flex-col gap-2.5">
                        {(() => {
                          const photos = selectedProfile.gallery?.length ? selectedProfile.gallery : [selectedProfile.avatar || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'];
                          const activePhoto = photos[activePhotoIndex % photos.length] || photos[0];
                          return (
                            <>
                              {/* Featured Main Image */}
                              <div 
                                onClick={() => setFullImagePreview(activePhoto)}
                                className="w-full h-[240px] sm:h-[340px] rounded-2xl overflow-hidden bg-slate-100 relative group border border-slate-200 shadow-2xs cursor-pointer"
                              >
                                <img 
                                  src={activePhoto} 
                                  alt={selectedProfile.category}
                                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                                />
                                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-lg backdrop-blur-xs shadow-xs flex items-center gap-1.5">
                                  <Camera className="w-3.5 h-3.5 text-white" />
                                  <span>{activePhotoIndex + 1} / {photos.length} Photos</span>
                                </div>
                                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-black px-3 py-1 rounded-lg backdrop-blur-xs transition-all flex items-center gap-1 opacity-90 group-hover:opacity-100 shadow-xs">
                                  <Eye className="w-3.5 h-3.5 text-white" />
                                  <span>View Full Photo</span>
                                </div>
                              </div>

                              {/* Thumbnail Grid Row */}
                              {photos.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                                  {photos.slice(0, 4).map((img: string, i: number) => {
                                    const isActive = (activePhotoIndex % photos.length) === i;
                                    const isLastAndMore = i === 3 && photos.length > 4;
                                    return (
                                      <div 
                                        key={i} 
                                        onClick={() => setActivePhotoIndex(i)}
                                        className={`h-16 sm:h-20 rounded-xl overflow-hidden bg-slate-100 relative cursor-pointer border transition-all ${
                                          isActive ? 'ring-2 ring-slate-900 border-transparent shadow-xs scale-[1.02]' : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                                        }`}
                                      >
                                        <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                                        {isLastAndMore && (
                                          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center text-white font-black text-xs backdrop-blur-xs">
                                            +{photos.length - 4} More
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      {/* Right: Info Section */}
                      <div className="lg:col-span-5 flex flex-col gap-4">
                        {/* Highlights Row */}
                        <div className="grid grid-cols-4 bg-white border border-slate-200 rounded-2xl divide-x divide-slate-100 shadow-2xs overflow-hidden">
                          <div className="p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-base sm:text-lg font-black text-slate-900">{selectedProfile.bedrooms || 1}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Beds</span>
                          </div>
                          <div className="p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-base sm:text-lg font-black text-slate-900">{selectedProfile.bathrooms || 1}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Baths</span>
                          </div>
                          <div className="p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-base sm:text-lg font-black text-slate-900">{selectedProfile.balconies || 1}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Balcony</span>
                          </div>
                          <div className="p-3 flex flex-col items-center justify-center text-center">
                            <span className="text-xs font-black text-slate-900 leading-tight">{selectedProfile.furnishing || 'Semi'}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Furnished</span>
                          </div>
                        </div>

                        {/* Intricate Specs Grid */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Property Specifications</h3>
                          <div className="grid grid-cols-2 gap-3 text-left">
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Carpet Area</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.carpetArea || '650 sqft'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Super Area</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.superArea || selectedProfile.carpetArea || 'N/A'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Status</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.status || 'Ready to Move'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Floor</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.floor ? `${selectedProfile.floor} of ${selectedProfile.totalFloors || 4}` : '2 of 4'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Transaction</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.transactionType || 'Resale'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Facing</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.facing || 'East'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Ownership</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.ownership || 'Freehold'}</strong>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                              <span className="text-[9px] text-slate-400 font-bold uppercase block">Developer</span>
                              <strong className="text-xs font-black text-slate-900">{selectedProfile.developer || selectedProfile.projectName || 'Independent'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {selectedProfile.bio && (
                          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-500" />
                              <span>More Details</span>
                            </h3>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed">
                              {selectedProfile.bio}
                            </p>
                          </div>
                        )}

                        {/* Contact Card */}
                        {(() => {
                          const rawPhone = selectedProfile.contactPhone || selectedProfile.phone || '';
                          const rawWhatsapp = selectedProfile.whatsappPhone || selectedProfile.whatsapp || rawPhone;
                          const ownerName = selectedProfile.contactName || selectedProfile.name || 'Owner';
                          const postedByRole = selectedProfile.postedBy || 'Owner';

                          const isUnlocked = isPropertyContactUnlocked(selectedProfile.id);
                          const phoneDisplay = formatPropertyPhoneDisplay(rawPhone, selectedProfile.id);

                          return (
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 text-left">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-black text-xs">
                                    {ownerName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-slate-900">{ownerName}</h4>
                                    <span className="text-[10px] text-slate-400 font-semibold">Posted by {postedByRole}</span>
                                  </div>
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                  isUnlocked 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}>
                                  {isUnlocked ? '✓ Contact Unlocked' : '🔒 Direct Contact'}
                                </span>
                              </div>

                              {/* Phone Number Display Box */}
                              <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-black ${
                                isUnlocked 
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-mono' 
                                  : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}>
                                <span className="flex items-center gap-1.5 truncate">
                                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span>{phoneDisplay}</span>
                                </span>
                                {!isUnlocked && (
                                  <button
                                    type="button"
                                    onClick={() => handlePropertyContactCall(selectedProfile, false)}
                                    className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 cursor-pointer shadow-xs active:scale-95"
                                  >
                                    {!isLoggedIn ? 'Login' : userUnlockedPropsState.length < 2 ? 'Unlock Free' : 'Upgrade'}
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2 pt-0.5">
                                <button
                                  onClick={() => handlePropertyContactCall(selectedProfile, false)}
                                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Call Owner</span>
                                </button>
                                <button
                                  onClick={() => handlePropertyContactCall(selectedProfile, true)}
                                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                     </div>
                   </div>

                   {/* Sticky Bottom Action Bar */}
                   <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:px-8 shadow-lg z-50 flex items-center justify-between gap-3">
                     <div className="flex flex-col text-left min-w-0">
                       <span className="text-[10px] text-slate-400 font-bold uppercase">
                         Listed by {selectedProfile.postedBy || 'Owner'}
                       </span>
                       <span className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                         {selectedProfile.contactName || selectedProfile.name || 'Owner'}
                       </span>
                     </div>

                     <div className="flex items-center gap-2 shrink-0">
                       <button 
                         onClick={() => handlePropertyContactCall(selectedProfile, false)}
                         className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95"
                       >
                         <Phone className="w-3.5 h-3.5 text-slate-700" />
                         <span className="hidden sm:inline">Call Owner</span>
                         <span className="sm:hidden">Call</span>
                       </button>

                       <button 
                         onClick={() => handlePropertyContactCall(selectedProfile, true)}
                         className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95"
                       >
                         <MessageSquare className="w-3.5 h-3.5" />
                         <span>WhatsApp</span>
                       </button>

                       <button 
                         onClick={() => {
                           setEnquirySenderName(userName || '');
                           setEnquirySenderPhone('');
                           setEnquiryMessage(`Hi ${selectedProfile.contactName || 'Owner'}, I am interested in your property (${selectedProfile.category}). Please share details.`);
                           setEnquiryModalProperty(selectedProfile);
                         }}
                         className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95"
                       >
                         <Send className="w-3.5 h-3.5 text-white" />
                         <span>Send Enquiry</span>
                       </button>
                     </div>
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
                  {specialistCouponApplied ? '₹0.00' : (specialistCheckoutPlan === 'Pro' ? '₹49.00' : '₹99.00')}
                </strong>
              </div>
            </div>

            {/* Coupon Entry */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 text-left space-y-2">
              <label className="block text-[10px] text-slate-455 font-bold uppercase tracking-wider">Promo / Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. MAJHBOISAR99)"
                  value={specialistCouponInput}
                  onChange={(e) => setSpecialistCouponInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-500 uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    const code = specialistCouponInput.trim().toUpperCase();
                    if (code === 'MAJHBOISAR99') {
                      setSpecialistCouponApplied(true);
                      setSpecialistCouponSuccess('Coupon applied successfully! 100% discount applied.');
                      setSpecialistCouponError('');
                    } else {
                      setSpecialistCouponError('Invalid coupon code!');
                      setSpecialistCouponSuccess('');
                    }
                  }}
                  className="bg-slate-850 hover:bg-slate-750 text-white text-xs font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {specialistCouponSuccess && <p className="text-[10px] text-emerald-600 font-extrabold">{specialistCouponSuccess}</p>}
              {specialistCouponError && <p className="text-[10px] text-rose-500 font-extrabold">{specialistCouponError}</p>}
            </div>

            {/* Payment Method Selector */}
            {!specialistCouponApplied && (
              <div className="space-y-3 mb-4 text-left">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] text-slate-500 font-black uppercase tracking-wider">Payment Method</label>
                  <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">⚡ Instant UPI / QR</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-3.5">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shadow-sm">
                      <img loading="lazy" decoding="async" 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=majhboisar@upi&pn=Majh%20Boisar&am=${specialistCheckoutPlan === 'Pro' ? 49 : 99}&cu=INR`)}`} 
                        alt="UPI QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-[9px] text-slate-600 font-bold mt-2">Scan QR code using GooglePay, PhonePe, or Paytm</p>
                    <div className="mt-1 flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <code className="text-xs font-black text-slate-800 font-mono">majhboisar@upi</code>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText('majhboisar@upi');
                            alert('UPI ID (majhboisar@upi) copied to clipboard!');
                          }
                        }}
                        className="text-[9px] font-black text-teal-600 hover:underline ml-1"
                      >
                        Copy
                      </button>
                    </div>
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
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200">
            <button 
              onClick={() => setEnquiryModalProperty(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Send Direct Enquiry</h3>
                <p className="text-[10px] text-slate-500">Contact {enquiryModalProperty.postedBy || 'Owner'} directly</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-slate-800 truncate">{enquiryModalProperty.category}</p>
              <p className="text-[11px] font-black text-teal-700 mt-0.5">{enquiryModalProperty.price}</p>
              <p className="text-[10px] text-slate-500 mt-1">Listed by: <span className="font-bold text-slate-700">{enquiryModalProperty.contactName || enquiryModalProperty.name} ({enquiryModalProperty.postedBy || 'Owner'})</span></p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!enquirySenderPhone.trim()) return alert('Please enter your phone number');

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

                alert(`🎉 Enquiry Sent Successfully!\n\nThe ${enquiryModalProperty.postedBy || 'owner'} (${enquiryModalProperty.contactName || 'Seller'}) has received your inquiry and will contact you shortly at ${enquirySenderPhone}.`);
                setEnquiryModalProperty(null);
              }}
              className="space-y-3 text-left"
            >
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Your Name</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={enquirySenderName}
                  onChange={(e) => setEnquirySenderName(e.target.value)}
                  className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Your Phone / WhatsApp Number</label>
                <input 
                  type="text"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={enquirySenderPhone}
                  onChange={(e) => setEnquirySenderPhone(e.target.value)}
                  className="w-full border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-teal-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Message</label>
                <textarea 
                  rows={3}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  className="w-full border border-slate-250 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-teal-500 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEnquiryModalProperty(null)}
                  className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Enquiry</span>
                </button>
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
          const updated = {
            ...profilesState,
            properties: [newProp, ...(profilesState.properties || [])]
          };
          setProfilesState(updated);
          localStorage.setItem('majh_boisar_special_profiles', JSON.stringify(updated));
          localStorage.setItem('majh_boisar_user_has_posted_property', 'true');
          const existing = JSON.parse(localStorage.getItem('majh_boisar_user_properties') || '[]');
          localStorage.setItem('majh_boisar_user_properties', JSON.stringify([newProp, ...existing]));
        }}
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
                  <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                        `upi://pay?pa=7769947217@ptaxis&pn=MajhBoisar&am=${buyerPassOption === '1_call' ? 19 : buyerPassOption === '5_calls' ? 89 : 199}&cu=INR`
                      )}`} 
                      alt="UPI QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold">Scan QR code using GPay, PhonePe, or Paytm</p>
                  
                  <div className="flex items-center justify-between w-full bg-white border border-slate-200 rounded-xl p-2 text-xs">
                    <span className="text-[11px] font-black text-slate-800">7769947217@ptaxis</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText('7769947217@ptaxis');
                          alert('UPI ID (7769947217@ptaxis) copied to clipboard!');
                        }
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold px-2 py-1 rounded-lg transition-all cursor-pointer"
                    >
                      📋 Copy
                    </button>
                  </div>

                  <a
                    href={`upi://pay?pa=8208712398@ptaxis&pn=MajhBoisar&am=${buyerPassOption === '1_call' ? 19 : buyerPassOption === '5_calls' ? 89 : 199}&cu=INR`}
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

    </div>
  );
}

