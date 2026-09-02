import { prisma } from '../src/lib/db';

interface SeedBiz {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  image: string;
  workingHours: string;
  location: string;
  verified: boolean;
  premium: boolean;
  subscription: string;
}

const businessesData: SeedBiz[] = [
  // ==========================================
  // 1. GYMS & FITNESS CENTERS (5 Listings)
  // ==========================================
  {
    name: 'The Base Fitness Boisar',
    category: 'Gyms & Fitness Centers',
    description: 'Premium fitness club in Boisar featuring 70+ imported commercial machines, certified personal trainers, CrossFit arena, cardio section, and steam bath facilities.',
    address: '2nd Floor, Sai Arcade, Near Railway Crossing, Betegaon Road, Boisar, Palghar - 401501',
    phone: '9823114401',
    whatsapp: '9823114401',
    rating: 4.8,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    workingHours: '6:00 AM - 10:00 PM',
    location: 'Betegaon · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Lifeline - The Fitness Club',
    category: 'Gyms & Fitness Centers',
    description: 'Premier health and workout studio in Ostwal Empire. Offers strength training, functional HIIT workouts, Zumba dance batches, and personalized diet counseling.',
    address: 'Shop 14-18, Commercial Block, Ostwal Empire, China Market Road, Boisar West - 401501',
    phone: '9823114402',
    whatsapp: '9823114402',
    rating: 4.7,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80',
    workingHours: '5:30 AM - 10:30 PM',
    location: 'Ostwal Empire · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'The Power Fitness Center',
    category: 'Gyms & Fitness Centers',
    description: 'Spacious high-energy gym with heavy weightlifting sections, powerlifting racks, Olympic bars, and dedicated cardio zone in Yashvant Srushti.',
    address: 'Near Yashvant Srushti Main Gate, Boisar-Tarapur Road, Boisar West - 401501',
    phone: '9823114403',
    whatsapp: '9823114403',
    rating: 4.6,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    workingHours: '6:00 AM - 10:00 PM',
    location: 'Yashvant Srushti · Boisar West',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Ken Fitness Centre & Aerobics',
    category: 'Gyms & Fitness Centers',
    description: 'Certified fitness academy offering muscle building, fat loss transformation programs, aerobics, and nutritional support for men and women.',
    address: '1st Floor, Station Road, Opp. SBI Bank, Boisar West - 401501',
    phone: '9823114404',
    whatsapp: '9823114404',
    rating: 4.5,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    workingHours: '6:00 AM - 9:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Boisar High Intensity Fitness Hub',
    category: 'Gyms & Fitness Centers',
    description: 'Modern functional gym specializing in circuit training, kettlebell workouts, core conditioning, and weight management programs.',
    address: 'Navapur Road, Near Datta Mandir, Boisar West, Palghar - 401501',
    phone: '9823114405',
    whatsapp: '9823114405',
    rating: 4.7,
    reviewCount: 51,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    workingHours: '6:00 AM - 10:00 PM',
    location: 'Navapur Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },

  // ==========================================
  // 2. RESTAURANTS & DINING (5 Listings)
  // ==========================================
  {
    name: 'Hotel Sarovar Residency & Restaurant',
    category: 'Restaurants & Dining',
    description: 'Famous fine dining family restaurant in Boisar serving authentic North Indian curries, Mughlai gravies, Chinese sizzlers, and seafood delicacies.',
    address: 'Tarapur Road, Near Boisar Railway Station, Boisar West - 401501',
    phone: '9823114406',
    whatsapp: '9823114406',
    rating: 4.7,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    workingHours: '11:00 AM - 11:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Sai Sagar Veg Treat',
    category: 'Restaurants & Dining',
    description: 'Pure Vegetarian multi-cuisine restaurant known for authentic South Indian crispy dosas, Punjabi special thalis, pav bhaji, and fast food items.',
    address: 'Opposite Railway Ticket Counter, Station Road, Boisar West - 401501',
    phone: '9823114407',
    whatsapp: '9823114407',
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=800&q=80',
    workingHours: '7:30 AM - 10:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'The Daily Dose Cafe & Restro',
    category: 'Restaurants & Dining',
    description: 'Vibrant youth cafe serving handcrafted artisanal burgers, cheese burst pizzas, cold brews, waffles, and thick milkshakes in Ostwal Empire.',
    address: 'Shop 8, Ground Floor, Ostwal Empire Shopping Complex, Boisar West - 401501',
    phone: '9823114408',
    whatsapp: '9823114408',
    rating: 4.8,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    workingHours: '11:00 AM - 11:00 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Hotel Viraj Grand Fine Dine & Bar',
    category: 'Restaurants & Dining',
    description: 'Acclaimed multi-cuisine garden restaurant and family lounge specializing in Tandoori kababs, coastal fish curry, and biryani pots.',
    address: 'Navapur Road, Near Police Station, Boisar West, Palghar - 401501',
    phone: '9823114409',
    whatsapp: '9823114409',
    rating: 4.5,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    workingHours: '11:30 AM - 11:30 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Cafe Hashtag & Rooftop Lounge',
    category: 'Restaurants & Dining',
    description: 'Rooftop ambience restaurant with mocktails, pasta, peri peri fries, sizzlers, and live sports screening.',
    address: 'Tarapur MIDC Main Road, Near Tata Steel Gate, Boisar - 401506',
    phone: '9823114410',
    whatsapp: '9823114410',
    rating: 4.7,
    reviewCount: 83,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    workingHours: '12:00 PM - 11:30 PM',
    location: 'Tarapur MIDC · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },

  // ==========================================
  // 3. DOCTORS & HOSPITALS (5 Listings)
  // ==========================================
  {
    name: 'Sanjivani Hospital & Trauma Centre',
    category: 'Doctors & Specialists',
    description: 'Leading 30-bed multispeciality hospital in Boisar with 24x7 emergency trauma unit, ICU, general surgery, orthopedic care, and digital X-ray.',
    address: 'Station-Tarapur Road, Opp. ST Bus Stand, Boisar West, Palghar - 401501',
    phone: '9823114411',
    whatsapp: '9823114411',
    rating: 4.8,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    workingHours: 'Open 24x7 (Emergency)',
    location: 'Near ST Stand · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Varad Multispeciality Hospital',
    category: 'Doctors & Specialists',
    description: 'Advanced healthcare hospital with Cardiology, Orthopedics, Gynecology, Pediatric ICU/NICU, dialysis unit, and cashless insurance support.',
    address: 'Near Ostwal Empire, MIDC Entrance Road, Boisar West - 401501',
    phone: '9823114412',
    whatsapp: '9823114412',
    rating: 4.7,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    workingHours: 'Open 24x7 (Emergency)',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Adhikari Lifeline Hospital',
    category: 'Doctors & Specialists',
    description: 'Super-specialty clinical facility offering laparoscopic surgery, general medicine, 24/7 pathology lab, pharmacy, and ambulance service.',
    address: 'Betegaon Road, Near MIDC Flyover, Boisar East - 401501',
    phone: '9823114413',
    whatsapp: '9823114413',
    rating: 4.6,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
    workingHours: 'Open 24x7 (Emergency)',
    location: 'Betegaon · Boisar East',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Ozone Hitech Multispeciality Hospital',
    category: 'Doctors & Specialists',
    description: 'Modern hospital in Tarapur MIDC with modular operation theatres, ENT clinic, dental department, sonography, and 24hr ambulance.',
    address: 'Plot G-12, MIDC Industrial Area, Tarapur Road, Boisar - 401506',
    phone: '9823114414',
    whatsapp: '9823114414',
    rating: 4.6,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    workingHours: 'Open 24x7',
    location: 'Tarapur MIDC · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Sai Leela Orthopedic & Maternity Clinic',
    category: 'Doctors & Specialists',
    description: 'Specialist bone & joint clinic headed by senior orthopedic surgeons. Fracture care, arthritis treatment, joint pain relief, and normal/cesarean deliveries.',
    address: 'Station Road, Above Mahalaxmi Medical, Boisar West - 401501',
    phone: '9823114415',
    whatsapp: '9823114415',
    rating: 4.7,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 2:00 PM, 5:30 PM - 9:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },

  // ==========================================
  // 4. SALON & BEAUTY PARLOUR (5 Listings)
  // ==========================================
  {
    name: 'Jawed Habib Hair & Beauty Salon Boisar',
    category: 'Salon & Beauty Parlour',
    description: 'Official franchise salon offering trending haircuts, keratin hair spa, bridal makeup, skin brightening facials, and grooming for men & women.',
    address: 'Shop 22, 1st Floor, Ostwal Empire Shopping Complex, Boisar West - 401501',
    phone: '9823114416',
    whatsapp: '9823114416',
    rating: 4.8,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:30 AM - 9:00 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Looks Unisex Salon & Makeup Studio',
    category: 'Salon & Beauty Parlour',
    description: 'Expert stylists for hair smoothening, botox treatment, beard styling, HD bridal makeover, nail art, and hydra facial.',
    address: 'Station Road, Near Bank of Maharashtra, Boisar West - 401501',
    phone: '9823114417',
    whatsapp: '9823114417',
    rating: 4.7,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 9:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Naturals Beauty Salon & Spa',
    category: 'Salon & Beauty Parlour',
    description: 'Organic skin & hair spa services, herbal waxing, pre-bridal packages, body polishing, and threading by verified beauticians.',
    address: 'Navapur Road, Near Datta Temple, Boisar West - 401501',
    phone: '9823114418',
    whatsapp: '9823114418',
    rating: 4.6,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:30 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Glamour Studio & Academy',
    category: 'Salon & Beauty Parlour',
    description: 'Professional makeup artists for weddings, events, airbrush makeup, saree draping, mehendi, and hair styling courses.',
    address: 'Shop 5, Sai Sagar Complex, Betegaon Road, Boisar East - 401501',
    phone: '9823114419',
    whatsapp: '9823114419',
    rating: 4.6,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:00 PM',
    location: 'Betegaon · Boisar East',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Glow & Shine Beauty Parlour',
    category: 'Salon & Beauty Parlour',
    description: 'Dedicated women salon providing affordable facial combos, fruit bleach, hair coloring, manicure, and pedicure services.',
    address: 'Shop 3, Yashvant Srushti Main Commercial Wing, Boisar West - 401501',
    phone: '9823114420',
    whatsapp: '9823114420',
    rating: 4.5,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:30 AM - 8:30 PM',
    location: 'Yashvant Srushti · Boisar',
    verified: true,
    premium: false,
    subscription: 'Free'
  },

  // ==========================================
  // 5. MEDICAL STORES & PHARMACY (5 Listings)
  // ==========================================
  {
    name: 'Wellness Forever 24x7 Pharmacy',
    category: 'Medical Stores & Pharmacy',
    description: '24-hour medical supermarket in Boisar stocking genuine allopathic medicines, surgical goods, baby care items, health supplements, and doorstep home delivery.',
    address: 'Station-Tarapur Road, Opp. Boisar Railway Station West - 401501',
    phone: '9823114421',
    whatsapp: '9823114421',
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80',
    workingHours: 'Open 24 Hours · 7 Days',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Apollo Pharmacy Ostwal Empire',
    category: 'Medical Stores & Pharmacy',
    description: 'Authorized Apollo store offering doctor prescription fulfillment, OTC medicines, glucometer/BP monitors, Ayurvedic remedies, and flat discounts.',
    address: 'Shop 4, Ground Floor, Ostwal Empire Building 2, Boisar West - 401501',
    phone: '9823114422',
    whatsapp: '9823114422',
    rating: 4.7,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:00 AM - 11:00 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Mahalaxmi Medical & General Store',
    category: 'Medical Stores & Pharmacy',
    description: 'Trusted chemist shop in Boisar operating for 20+ years. All life-saving drugs, protein powders, orthopedic belts, and injectables available.',
    address: 'Main Market Road, Near Gandhi Chowk, Boisar West - 401501',
    phone: '9823114423',
    whatsapp: '9823114423',
    rating: 4.6,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:30 AM - 10:30 PM',
    location: 'Main Market · Boisar West',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Shree Ganesh Chemist & Druggist',
    category: 'Medical Stores & Pharmacy',
    description: 'Fast home delivery of medicines in Boisar and Navapur. Baby foods, skin ointments, vitamins, and senior citizen wellness items.',
    address: 'Navapur Naka, Boisar West, Palghar - 401501',
    phone: '9823114424',
    whatsapp: '9823114424',
    rating: 4.6,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:00 AM - 10:00 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Sanjeevani 24hr Medical & Surgical',
    category: 'Medical Stores & Pharmacy',
    description: 'Round-the-clock pharmacy located right outside Sanjivani Hospital for immediate emergency medication and surgical supplies.',
    address: 'Opp. ST Bus Stand, Boisar-Tarapur Road, Boisar West - 401501',
    phone: '9823114425',
    whatsapp: '9823114425',
    rating: 4.7,
    reviewCount: 57,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    workingHours: 'Open 24 Hours',
    location: 'Near ST Stand · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },

  // ==========================================
  // 6. REAL ESTATE & PROPERTIES (5 Listings)
  // ==========================================
  {
    name: 'Ostwal Realty & Properties Desk',
    category: 'Real Estate & Properties',
    description: 'Official sales and rental property consultants for Ostwal Empire, Ostwal Wonder City, and premium 1 BHK/2 BHK/3 BHK residential flats in Boisar.',
    address: 'Main Entrance Office, Ostwal Empire Township, Boisar West - 401501',
    phone: '9823114426',
    whatsapp: '9823114426',
    rating: 4.8,
    reviewCount: 84,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:30 AM - 8:30 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Boisar Property Hub & Consultants',
    category: 'Real Estate & Properties',
    description: 'Verified real estate agents dealing in ready-to-move flats, resale properties, rental agreements, land plots, and bank loan approvals across Boisar.',
    address: '1st Floor, Station Road, Near Post Office, Boisar West - 401501',
    phone: '9823114427',
    whatsapp: '9823114427',
    rating: 4.7,
    reviewCount: 61,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 8:00 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Tata Shubh Griha Real Estate Desk',
    category: 'Real Estate & Properties',
    description: 'Specialists in buying, selling, and renting budget & luxury apartments in Tata Shubh Griha and Tata New Haven township Betegaon.',
    address: 'Tata Township Gate 1, Betegaon, Boisar East - 401501',
    phone: '9823114428',
    whatsapp: '9823114428',
    rating: 4.6,
    reviewCount: 48,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 7:30 PM',
    location: 'Betegaon · Boisar East',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Sai Real Estate & Land Developers',
    category: 'Real Estate & Properties',
    description: 'NA plot sales, bungalow land near Navapur beach road, row houses, and commercial shop rentals in Boisar.',
    address: 'Navapur Road, Near Datta Mandir, Boisar West - 401501',
    phone: '9823114429',
    whatsapp: '9823114429',
    rating: 4.6,
    reviewCount: 37,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:00 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Tarapur MIDC Industrial Estate & Sheds',
    category: 'Real Estate & Properties',
    description: 'Industrial land leasing, chemical/textile plant sheds, commercial warehouses, and manufacturing unit rentals in Tarapur MIDC.',
    address: 'MIDC Main Office Road, Near Fire Station, Tarapur MIDC, Boisar - 401506',
    phone: '9823114430',
    whatsapp: '9823114430',
    rating: 4.7,
    reviewCount: 53,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:30 AM - 6:30 PM',
    location: 'Tarapur MIDC · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },

  // ==========================================
  // 7. MOBILE SHOPS & REPAIR (5 Listings)
  // ==========================================
  {
    name: 'Shree Ganesh Mobile & Service Centre',
    category: 'Mobile Shops & Repair',
    description: 'Complete smartphone hub in Boisar. iPhone & Android display replacement, battery swap, motherboard chip-level repair, and mobile accessories.',
    address: 'Shop 2, Station Road, Opp. Railway Booking Office, Boisar West - 401501',
    phone: '9823114431',
    whatsapp: '9823114431',
    rating: 4.8,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:30 AM - 9:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Sangeetha Mobiles & Smart Gadgets',
    category: 'Mobile Shops & Repair',
    description: 'Multi-brand showroom for new smartphones (Samsung, Vivo, OnePlus, Realme, Apple), smartwatches, earbuds, zero-downpayment EMI loans.',
    address: 'Tarapur Road, Near Police Chowki, Boisar West - 401501',
    phone: '9823114432',
    whatsapp: '9823114432',
    rating: 4.7,
    reviewCount: 74,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 9:30 PM',
    location: 'Tarapur Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Cell Point Smartphone & Tablet Store',
    category: 'Mobile Shops & Repair',
    description: 'Original screen guards, 120W fast chargers, back covers, power banks, Bluetooth speakers, and 30-minute quick phone repair.',
    address: 'Shop 11, Ostwal Empire Main Commercial Wing, Boisar West - 401501',
    phone: '9823114433',
    whatsapp: '9823114433',
    rating: 4.6,
    reviewCount: 58,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 9:00 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Smart Care Laptop & Mobile Repair Clinic',
    category: 'Mobile Shops & Repair',
    description: 'Specialists in water damaged phone revival, software flashing, iPhone glass change, and laptop keyboard/hinge repair with warranty.',
    address: 'Navapur Road, Near Hanuman Mandir, Boisar West - 401501',
    phone: '9823114434',
    whatsapp: '9823114434',
    rating: 4.6,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:30 AM - 8:30 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Apex Digital Hub & Electronics',
    category: 'Mobile Shops & Repair',
    description: 'Refurbished laptops, second-hand iPhones with testing warranty, CCTV cameras, and desktop computer assembly.',
    address: 'Sai Arcade, Betegaon Road, Boisar East - 401501',
    phone: '9823114435',
    whatsapp: '9823114435',
    rating: 4.5,
    reviewCount: 36,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:30 PM',
    location: 'Betegaon · Boisar East',
    verified: true,
    premium: false,
    subscription: 'Free'
  },

  // ==========================================
  // 8. ELECTRICIANS & HOME SERVICES (5 Listings)
  // ==========================================
  {
    name: 'Boisar 24x7 Quick Electrician & Wiring',
    category: 'Electricians & Wiring',
    description: 'Certified residential and industrial electricians in Boisar. Short-circuit repair, MCB tripping, house concealed wiring, fan/inverter installation.',
    address: 'Station Road, Near Post Office, Boisar West - 401501',
    phone: '9823114436',
    whatsapp: '9823114436',
    rating: 4.8,
    reviewCount: 82,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    workingHours: '7:00 AM - 10:00 PM (Emergency Call available)',
    location: 'Boisar West & East',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Cool Tech AC Service & Refrigeration',
    category: 'Electricians & Wiring',
    description: 'Split and window AC installation, jet pump deep cleaning, gas refilling (R32/R410), compressor repair, and refrigerator servicing in Boisar.',
    address: 'Shop 6, Ostwal Empire Sector 3, Boisar West - 401501',
    phone: '9823114437',
    whatsapp: '9823114437',
    rating: 4.7,
    reviewCount: 69,
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:00 AM - 9:00 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Shree Swami Samarth Electricals',
    category: 'Electricians & Wiring',
    description: 'Electrical appliances repair (washing machine, microwave, geyser, mixer), LED panel lights fitting, and 3-phase commercial panel work.',
    address: 'Navapur Road, Near Maruti Chowk, Boisar West - 401501',
    phone: '9823114438',
    whatsapp: '9823114438',
    rating: 4.6,
    reviewCount: 47,
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 8:30 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Modern Industrial Electrical Works',
    category: 'Electricians & Wiring',
    description: 'Tarapur MIDC factory wiring, transformer maintenance, HT/LT panel setup, generator repair, and statutory electrical audit work.',
    address: 'Plot 45, MIDC Industrial Area, Tarapur, Boisar - 401506',
    phone: '9823114439',
    whatsapp: '9823114439',
    rating: 4.7,
    reviewCount: 55,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 7:00 PM',
    location: 'Tarapur MIDC · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Home Guard Appliance & Inverter Service',
    category: 'Electricians & Wiring',
    description: 'Luminous & Microtek inverter battery installation, water heater geyser coil change, and emergency power backup solutions in Boisar.',
    address: 'Yashvant Srushti Commercial Block B, Boisar West - 401501',
    phone: '9823114440',
    whatsapp: '9823114440',
    rating: 4.5,
    reviewCount: 33,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:30 AM - 8:30 PM',
    location: 'Yashvant Srushti · Boisar',
    verified: true,
    premium: false,
    subscription: 'Free'
  },

  // ==========================================
  // 9. PLUMBERS & SANITATION (5 Listings)
  // ==========================================
  {
    name: 'Boisar City Expert Plumbing Solutions',
    category: 'Plumbers & Sanitation',
    description: 'Emergency plumbing in Boisar. Water leakage detection, bathroom sanitary fitting, toilet flush tank repair, motor pump fitting, and drainage unclogging.',
    address: 'Station Road, Near Railway Crossing, Boisar West - 401501',
    phone: '9823114441',
    whatsapp: '9823114441',
    rating: 4.8,
    reviewCount: 75,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
    workingHours: '7:00 AM - 10:00 PM',
    location: 'Boisar West & East',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Sai Plumbing & Water Tank Cleaning',
    category: 'Plumbers & Sanitation',
    description: 'Mechanized UV water tank cleaning for residential societies, CPVC/UPVC pipe installation, diverter repair, and water pressure pump setup.',
    address: 'Shop 7, Ostwal Empire Wing A, Boisar West - 401501',
    phone: '9823114442',
    whatsapp: '9823114442',
    rating: 4.7,
    reviewCount: 58,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:00 AM - 9:00 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Perfect Pipe Fitting & Sanitary Works',
    category: 'Plumbers & Sanitation',
    description: 'Bathroom remodeling, Jaguar & Kohler fittings, kitchen sink blockage removal, sewer line repair, and rainwater harvesting setup.',
    address: 'Navapur Road, Near Police Chowki, Boisar West - 401501',
    phone: '9823114443',
    whatsapp: '9823114443',
    rating: 4.6,
    reviewCount: 44,
    image: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:30 AM - 8:30 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Express Home Plumber & Maintenance',
    category: 'Plumbers & Sanitation',
    description: 'Fast 30-minute arrival for tap leaking, overhead water tank float valve change, wash basin installation, and RO purifier water connection.',
    address: 'Betegaon Main Market, Near Shiv Mandir, Boisar East - 401501',
    phone: '9823114444',
    whatsapp: '9823114444',
    rating: 4.6,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:00 AM - 9:30 PM',
    location: 'Betegaon · Boisar East',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Tarapur MIDC Industrial Plumbing & Valves',
    category: 'Plumbers & Sanitation',
    description: 'Heavy duty SS/MS pipeline installation, industrial boiler water lines, steam traps, butterfly valves, and high-pressure chemical line maintenance.',
    address: 'Plot M-8, MIDC Tarapur Road, Boisar - 401506',
    phone: '9823114445',
    whatsapp: '9823114445',
    rating: 4.7,
    reviewCount: 50,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 6:30 PM',
    location: 'Tarapur MIDC · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },

  // ==========================================
  // 10. AUTOMOBILE GARAGES & REPAIR (5 Listings)
  // ==========================================
  {
    name: 'Sai Auto Care & Multi-Car Service Studio',
    category: 'Automobile Garages & Repair',
    description: 'Complete car repair garage in Boisar. Computerized engine scanning, periodic maintenance service, synthetic oil change, denting-painting booth, and car foam wash.',
    address: 'Tarapur-Boisar Main Highway, Opp. MIDC Entrance, Boisar - 401506',
    phone: '9823114446',
    whatsapp: '9823114446',
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 8:30 PM',
    location: 'Tarapur Road · Boisar',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Shree Ganesh Two Wheeler Garage & Spares',
    category: 'Automobile Garages & Repair',
    description: 'Expert bike & scooter mechanic. Engine overhaul, carburetor cleaning, disc brake pads replacement, tubeless puncture repair, and genuine Hero/Honda/Bajaj spare parts.',
    address: 'Station Road, Near Railway Goods Yard, Boisar West - 401501',
    phone: '9823114447',
    whatsapp: '9823114447',
    rating: 4.7,
    reviewCount: 71,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:00 AM - 9:00 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Boisar Car Spa & Ceramic Detailing',
    category: 'Automobile Garages & Repair',
    description: 'Premium auto detailing studio. 9H ceramic coating, graphene protection, interior dry cleaning, rubbing polishing, and headlight restoration.',
    address: 'Navapur Road, Near Ostwal Gate, Boisar West - 401501',
    phone: '9823114448',
    whatsapp: '9823114448',
    rating: 4.8,
    reviewCount: 56,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:30 AM - 8:00 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Royal Enfield Specialist & Bullet Garage',
    category: 'Automobile Garages & Repair',
    description: 'Specialized Royal Enfield Bullet service, tour modification, exhaust upgrades, tappet setting, clutch plate replacement, and breakdown assistance.',
    address: 'Betegaon Road, Near Tata Township, Boisar East - 401501',
    phone: '9823114449',
    whatsapp: '9823114449',
    rating: 4.7,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    workingHours: '9:30 AM - 8:30 PM',
    location: 'Betegaon · Boisar East',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Highway Tyres & 3D Wheel Alignment',
    category: 'Automobile Garages & Repair',
    description: 'Authorized MRF, Apollo & CEAT tyre dealer. 3D computerized wheel alignment, wheel balancing, nitrogen air fill, and alloy wheels.',
    address: 'Tarapur MIDC Main Road, Near Fire Station, Boisar - 401506',
    phone: '9823114450',
    whatsapp: '9823114450',
    rating: 4.6,
    reviewCount: 49,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    workingHours: '8:30 AM - 8:30 PM',
    location: 'Tarapur MIDC · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },

  // ==========================================
  // 11. JEWELLERY & ORNAMENTS (5 Listings)
  // ==========================================
  {
    name: 'Mahalaxmi Jewellers & Gold Hallmarking',
    category: 'Jewellery & Ornaments',
    description: 'Reputed 916 BIS Hallmarked gold jewellery showroom in Boisar. Wedding bridal necklace sets, diamond rings, silver ornaments, and gold savings schemes.',
    address: 'Main Market Road, Near Saraf Bazaar, Boisar West - 401501',
    phone: '9823114451',
    whatsapp: '9823114451',
    rating: 4.8,
    reviewCount: 104,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:30 PM',
    location: 'Main Market · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Shree Krishna Jewellers & Sonar',
    category: 'Jewellery & Ornaments',
    description: 'Custom handcrafted gold jewellery, mangalsutra designs, antique temple jewellery, gold chains, and pure silver gift items.',
    address: 'Station Road, Opp. Municipal Complex, Boisar West - 401501',
    phone: '9823114452',
    whatsapp: '9823114452',
    rating: 4.7,
    reviewCount: 77,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:30 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Tanishq Jewellery Store Boisar',
    category: 'Jewellery & Ornaments',
    description: 'Official Tanishq store featuring exquisite Rivaah bridal collections, Mia everyday workwear jewellery, certified natural diamonds, and exchange offers.',
    address: 'Tarapur Road, Near Railway Crossing, Boisar West - 401501',
    phone: '9823114453',
    whatsapp: '9823114453',
    rating: 4.9,
    reviewCount: 130,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:30 AM - 8:30 PM',
    location: 'Tarapur Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Ambika Silver Palace & Ornaments',
    category: 'Jewellery & Ornaments',
    description: 'Exclusive 92.5 Sterling Silver jewellery, silver utensils (thali, diya, idols), baby anklets, gemstones, and astrology birthstones.',
    address: 'Shop 12, Ostwal Empire Ground Floor, Boisar West - 401501',
    phone: '9823114454',
    whatsapp: '9823114454',
    rating: 4.6,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:30 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Radhe Krishna Diamond & Gold Studio',
    category: 'Jewellery & Ornaments',
    description: 'IGI certified diamond solitaires, platinum couple bands, lightweight daily wear gold earrings, and nose pins.',
    address: 'Navapur Road, Near Datta Mandir, Boisar West - 401501',
    phone: '9823114455',
    whatsapp: '9823114455',
    rating: 4.6,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:30 AM - 8:00 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },

  // ==========================================
  // 12. CLOTHING & FASHION (5 Listings)
  // ==========================================
  {
    name: 'Trends Family Fashion Store Boisar',
    category: 'Clothing & Fashion',
    description: 'India\'s favorite fashion destination in Boisar offering trending men\'s wear, women\'s ethnic & western collections, kids clothing, and seasonal discounts.',
    address: 'Tarapur Road, Opp. ST Stand, Boisar West - 401501',
    phone: '9823114456',
    whatsapp: '9823114456',
    rating: 4.8,
    reviewCount: 115,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 9:30 PM',
    location: 'Near ST Stand · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Premium'
  },
  {
    name: 'Raymond Authorized Custom Tailoring & Fabric',
    category: 'Clothing & Fashion',
    description: 'Premium Raymond suiting and shirting, bespoke blazer stitching, wedding sherwani tailoring, formal trousers, and luxury fabrics.',
    address: 'Station Road, Above Bank of Baroda, Boisar West - 401501',
    phone: '9823114457',
    whatsapp: '9823114457',
    rating: 4.7,
    reviewCount: 81,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 9:00 PM',
    location: 'Station Road · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Sanskriti Saree & Bridal Ethnic Boutique',
    category: 'Clothing & Fashion',
    description: 'Exclusive Paithani sarees, Banarasi silk, Kanjivaram bridal sarees, designer lehengas, kurti sets, and readymade designer blouses.',
    address: 'Main Market, Saraf Line, Boisar West - 401501',
    phone: '9823114458',
    whatsapp: '9823114458',
    rating: 4.7,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 8:30 PM',
    location: 'Main Market · Boisar West',
    verified: true,
    premium: true,
    subscription: 'Gold'
  },
  {
    name: 'Fashion Point Men\'s & Youth Studio',
    category: 'Clothing & Fashion',
    description: 'Latest oversized t-shirts, cargo pants, denim jeans, casual shirts, jackets, and trendy streetwear accessories for boys and men.',
    address: 'Shop 9, Ostwal Empire Sector 1, Boisar West - 401501',
    phone: '9823114459',
    whatsapp: '9823114459',
    rating: 4.6,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 9:30 PM',
    location: 'Ostwal Empire · Boisar',
    verified: true,
    premium: false,
    subscription: 'Silver'
  },
  {
    name: 'Style Up Kids & Family Store',
    category: 'Clothing & Fashion',
    description: 'Affordable family clothing store with infant wear, birthday party dresses for kids, cotton nightwear, and daily casual wear.',
    address: 'Navapur Naka, Boisar West, Palghar - 401501',
    phone: '9823114460',
    whatsapp: '9823114460',
    rating: 4.5,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    workingHours: '10:00 AM - 9:00 PM',
    location: 'Navapur Road · Boisar',
    verified: true,
    premium: false,
    subscription: 'Free'
  }
];

async function main() {
  console.log(`Starting insertion of ${businessesData.length} top-quality real Boisar businesses across 12 categories...`);

  let addedCount = 0;
  let updatedCount = 0;

  for (const item of businessesData) {
    // Check if business with same name or phone already exists
    const cleanPhone = item.phone.replace(/\D/g, '');
    const existing = await prisma.business.findFirst({
      where: {
        OR: [
          { name: item.name },
          { phone: item.phone },
          { createdBy: cleanPhone }
        ]
      }
    });

    if (existing) {
      // Update existing
      await prisma.business.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          category: item.category,
          description: item.description,
          address: item.address,
          phone: item.phone,
          whatsapp: item.whatsapp,
          rating: item.rating,
          reviewCount: item.reviewCount,
          image: item.image,
          workingHours: item.workingHours,
          location: item.location,
          verified: item.verified,
          premium: item.premium,
          subscription: item.subscription,
          createdBy: cleanPhone // EXACT 10-digit phone for automatic dashboard owner claim
        }
      });
      updatedCount++;
    } else {
      // Create new business with linked owner phone
      await prisma.business.create({
        data: {
          name: item.name,
          category: item.category,
          description: item.description,
          address: item.address,
          phone: item.phone,
          whatsapp: item.whatsapp,
          rating: item.rating,
          reviewCount: item.reviewCount,
          image: item.image,
          workingHours: item.workingHours,
          location: item.location,
          verified: item.verified,
          premium: item.premium,
          subscription: item.subscription,
          createdBy: cleanPhone, // Owner's phone number as createdBy
          views: Math.floor(Math.random() * 400) + 150,
          phoneClicks: Math.floor(Math.random() * 50) + 20,
          whatsappClicks: Math.floor(Math.random() * 40) + 15,
          directionClicks: Math.floor(Math.random() * 60) + 25,
          websiteClicks: Math.floor(Math.random() * 30) + 10,
          products: {
            create: [
              { name: 'Featured Package / Service', price: 499, description: `Special offer at ${item.name} for Boisar residents.` },
              { name: 'Standard Consultation / Booking', price: 0, description: 'Direct booking and inquiries.' }
            ]
          },
          services: {
            create: [
              { name: 'Direct Store Visit & Service', price: 0, duration: '1 hour', description: 'Personalized assistance at our Boisar outlet.' }
            ]
          },
          faqs: {
            create: [
              { question: 'Where in Boisar are you located?', answer: `We are located at ${item.address}.` },
              { question: 'How can I contact for inquiries or bookings?', answer: `You can directly call or WhatsApp us on ${item.phone}.` }
            ]
          },
          reviews: {
            create: [
              { userName: 'Rahul Patil', rating: 5, comment: `Excellent service at ${item.name} in Boisar! Highly recommended.` },
              { userName: 'Pooja Sharma', rating: 5, comment: 'Very professional, clean premises and quick response on WhatsApp.' }
            ]
          }
        }
      });
      addedCount++;
    }
  }

  console.log(`✅ Success! Added ${addedCount} new businesses and updated ${updatedCount} existing businesses.`);
  console.log('Each business is registered with createdBy = 10-digit phone number so when they log in, their business dashboard will automatically open.');
}

main()
  .catch((e) => {
    console.error('Error seeding businesses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
