export interface HotelRoom {
  id: string;
  name: string;
  type: string;
  bedType: string;
  maxGuests: number;
  size: string;
  hourly3h: number;
  hourly6h: number;
  hourly12h: number;
  nightRate: number;
  image: string;
  amenities: string[];
}

export interface HotelReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  stayType: string;
}

export interface HotelItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: 'Luxury' | 'Executive' | 'Boutique' | 'Budget' | 'Residency';
  badge: string;
  offerBadge: string;
  suitabilityTag: string;
  location: string;
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  hourlyRate3h: number;
  hourlyRate6h: number;
  hourlyRate12h: number;
  nightRate: number;
  is3hAvailable: boolean;
  is6hAvailable: boolean;
  is12hAvailable: boolean;
  isNightAvailable: boolean;
  isCoupleFriendly: boolean;
  acceptsLocalId: boolean;
  nearStation: boolean;
  nearMidc: boolean;
  gallery: string[];
  amenities: { name: string; icon: string }[];
  description: string;
  rules: string[];
  rooms: HotelRoom[];
  reviews: HotelReview[];
  viewsCount: number;
  clicksCount: number;
  bookingsCount: number;
}

export const BOISAR_HOTELS: HotelItem[] = [
  {
    id: 'freesia-by-express-inn',
    slug: 'freesia-by-express-inn',
    name: 'Freesia by Express Inn',
    tagline: 'Luxury 3-Star Comfort Stay in Boisar',
    category: 'Luxury',
    badge: 'LUXURY',
    offerBadge: 'Get Free Welcome Beverage with Majh Boisar',
    suitabilityTag: '💼 Suitable for business professionals & couples',
    location: 'Ostwal Empire, Boisar (West)',
    address: 'Survey No. 42, Ostwal Empire Main Avenue, Near Reliance Trends, Boisar West, Palghar - 401501',
    landmark: 'Opposite Reliance Trends & Ostwal Circle',
    phone: '8149998666',
    whatsapp: '918149998666',
    rating: 4.7,
    reviewsCount: 148,
    hourlyRate3h: 699,
    hourlyRate6h: 1099,
    hourlyRate12h: 1599,
    nightRate: 2199,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: true,
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Parking', icon: '🅿️' },
      { name: 'AC Deluxe', icon: '❄️' },
      { name: 'Work Desk', icon: '🪑' },
      { name: 'Mineral Water', icon: '🍾' },
      { name: 'Geyser & Hot Water', icon: '🚿' },
      { name: 'Free Fast Wi-Fi', icon: '📶' },
      { name: 'Multi-Cuisine Dining', icon: '🍽️' },
      { name: '24/7 Room Service', icon: '🛎️' },
      { name: 'Elevator', icon: '🛗' },
      { name: 'Power Backup', icon: '⚡' },
      { name: 'CCTV Security', icon: '📹' },
      { name: 'Swimming Pool', icon: '🏊' }
    ],
    description: 'Freesia by Express Inn is the landmark premium hospitality destination in Boisar. Situated conveniently at Ostwal Empire, it offers well-appointed air-conditioned suites, multi-cuisine dining, swift check-ins, and complete privacy for business corporate guests, transit travellers, and couples.',
    rules: [
      '18+ Govt ID required',
      'Couples & Local IDs welcome',
      '24/7 flexible hourly check-in',
      'Free Wi-Fi & fresh linens'
    ],
    rooms: [
      {
        id: 'r1',
        name: 'Deluxe King Room',
        type: 'Deluxe AC',
        bedType: '1 King Bed',
        maxGuests: 2,
        size: '280 sq.ft',
        hourly3h: 699,
        hourly6h: 1099,
        hourly12h: 1599,
        nightRate: 2199,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        amenities: ['King Bed', 'AC', 'Free WiFi', 'Smart TV', 'Hot Shower', 'Tea Maker']
      },
      {
        id: 'r2',
        name: 'Executive Suite',
        type: 'Suite Room',
        bedType: '1 King Bed + Lounge Sofa',
        maxGuests: 3,
        size: '420 sq.ft',
        hourly3h: 999,
        hourly6h: 1499,
        hourly12h: 2199,
        nightRate: 3199,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        amenities: ['Lounge Area', 'Balcony View', 'Bathtub', 'Mini Bar', 'Workstation', '24/7 Butler']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Vikram Mehta',
        userCity: 'Mumbai',
        rating: 5,
        date: '3 days ago',
        title: 'Superb 3-hour day stay',
        comment: 'Needed a quick 3-hour quiet place between MIDC client meetings. Super fast check-in, spotless room and great coffee!',
        stayType: '3 Hrs Hourly Stay'
      },
      {
        id: 'rev-2',
        userName: 'Sneha & Raj',
        userCity: 'Boisar',
        rating: 5,
        date: '1 week ago',
        title: '100% couple friendly & safe',
        comment: 'Very polite front desk staff. Accepted local Aadhaar without asking awkward questions. Highly recommended in Boisar.',
        stayType: '6 Hrs Day Stay'
      }
    ],
    viewsCount: 642,
    clicksCount: 189,
    bookingsCount: 47
  },
  {
    id: 'hotel-sarovar-residency',
    slug: 'hotel-sarovar-residency',
    name: 'Hotel Sarovar Residency',
    tagline: 'Top Rated Business & Transit Hotel near MIDC',
    category: 'Executive',
    badge: 'EXECUTIVE',
    offerBadge: '15% Off on 6h & 12h Slots',
    suitabilityTag: '🏭 Perfect for Tarapur MIDC visitors & corporate stays',
    location: 'MIDC Road, Salwad, Boisar',
    address: 'Opposite Tarapur MIDC Gate No. 2, Salwad Highway, Boisar, Palghar - 401506',
    landmark: 'Beside Salwad Petrol Pump & MIDC Gate',
    phone: '9657187919',
    whatsapp: '919657187919',
    rating: 4.5,
    reviewsCount: 112,
    hourlyRate3h: 549,
    hourlyRate6h: 899,
    hourlyRate12h: 1299,
    nightRate: 1699,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: true,
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Free Parking', icon: '🅿️' },
      { name: 'Executive AC', icon: '❄️' },
      { name: 'Corporate Billing', icon: '💼' },
      { name: 'Complimentary Water', icon: '🍾' },
      { name: 'Hot Water 24/7', icon: '🚿' },
      { name: 'Fast Wi-Fi', icon: '📶' },
      { name: 'In-House Kitchen', icon: '🍛' },
      { name: 'Conference Room', icon: '👥' }
    ],
    description: 'Hotel Sarovar Residency is the prime executive stay choice right on Salwad MIDC Road. Equipped with spacious rooms, high speed fiber broadband, customized corporate GST invoices, and short hourly refreshment packages.',
    rules: [
      'Government Photo ID mandatory for all guests upon check-in.',
      'Flexible check-in and check-out according to booked hourly duration.',
      'Corporate invoicing available with valid GST details.',
      'Zero cancellation charges if notified 1 hour in advance.'
    ],
    rooms: [
      {
        id: 'sr1',
        name: 'Executive AC Room',
        type: 'Executive AC',
        bedType: 'Queen Size Bed',
        maxGuests: 2,
        size: '250 sq.ft',
        hourly3h: 549,
        hourly6h: 899,
        hourly12h: 1299,
        nightRate: 1699,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        amenities: ['AC', 'Queen Bed', 'Free WiFi', 'Desk', 'Hot Shower']
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Anil Deshmukh',
        userCity: 'Pune',
        rating: 5,
        date: '5 days ago',
        title: 'Best hotel near Tarapur MIDC',
        comment: 'Very close to MIDC factories. Stayed for 6 hours before evening train. Very clean bed and hot shower.',
        stayType: '6 Hrs Hourly Stay'
      }
    ],
    viewsCount: 490,
    clicksCount: 142,
    bookingsCount: 38
  },
  {
    id: 'blugent-residency',
    slug: 'blugent-residency',
    name: 'Blugent Residency',
    tagline: 'Modern Boutique Hotel with Smart TV & Premium Comfort',
    category: 'Boutique',
    badge: 'BOUTIQUE',
    offerBadge: 'Free High-Speed Wi-Fi & OTT',
    suitabilityTag: '💑 Couple Friendly · Modern Aesthetic Interiors',
    location: 'Navapur Road, Boisar (West)',
    address: 'Plot 18, Navapur Road, Near Boisar Bus Depot & Market, Boisar West - 401501',
    landmark: '2 Mins from Boisar Bus Depot',
    phone: '9122522591',
    whatsapp: '919122522591',
    rating: 4.6,
    reviewsCount: 96,
    hourlyRate3h: 599,
    hourlyRate6h: 949,
    hourlyRate12h: 1399,
    nightRate: 1799,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: true,
    nearMidc: false,
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Parking Space', icon: '🅿️' },
      { name: 'Split AC', icon: '❄️' },
      { name: 'Smart TV & OTT', icon: '📺' },
      { name: 'Free Bottled Water', icon: '🍾' },
      { name: '24h Hot Water', icon: '🚿' },
      { name: 'Fast WiFi', icon: '📶' },
      { name: 'Couple Friendly', icon: '💑' }
    ],
    description: 'Blugent Residency brings contemporary boutique living to Boisar West. Featuring plush wooden flooring, smart LED TVs with Netflix/YouTube access, sanitized memory-foam mattresses, and discreet hourly check-in.',
    rules: [
      'Valid Government Photo ID required for all guests.',
      'Check-in starts immediately after arrival confirmation.',
      '100% private, sanitized rooms with fresh linen for every guest.'
    ],
    rooms: [
      {
        id: 'br1',
        name: 'Premium Deluxe King',
        type: 'Deluxe AC',
        bedType: 'King Size Bed',
        maxGuests: 2,
        size: '260 sq.ft',
        hourly3h: 599,
        hourly6h: 949,
        hourly12h: 1399,
        nightRate: 1799,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
        amenities: ['AC', 'Smart TV', 'Free WiFi', 'King Bed', 'Rain Shower']
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Pooja K.',
        userCity: 'Palghar',
        rating: 5,
        date: '2 weeks ago',
        title: 'Modern and super cozy',
        comment: 'Loved the room aesthetic and smart TV. Very smooth booking via Majh Boisar portal.',
        stayType: '3 Hrs Hourly Stay'
      }
    ],
    viewsCount: 520,
    clicksCount: 164,
    bookingsCount: 42
  },
  {
    id: 'hotel-boisar-residency',
    slug: 'hotel-boisar-residency',
    name: 'Hotel Boisar Residency',
    tagline: 'Right Opposite Boisar Railway Station (West Exit)',
    category: 'Residency',
    badge: 'NEAR STATION',
    offerBadge: 'Walk to Platform in 2 Mins',
    suitabilityTag: '🚉 Commuters & Transit Travellers Choice',
    location: 'Station Road, Boisar (West)',
    address: 'Opposite Railway Station Platform No. 1, Station Road, Boisar West - 401501',
    landmark: 'Opposite Boisar Railway Station West Ticket Counter',
    phone: '9822014455',
    whatsapp: '919822014455',
    rating: 4.2,
    reviewsCount: 88,
    hourlyRate3h: 449,
    hourlyRate6h: 749,
    hourlyRate12h: 1099,
    nightRate: 1399,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: true,
    nearMidc: false,
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Station Opposite', icon: '🚉' },
      { name: 'AC & Non-AC', icon: '❄️' },
      { name: 'Luggage Storage', icon: '🧳' },
      { name: 'Water Purifier', icon: '🍾' },
      { name: 'Hot Shower', icon: '🚿' },
      { name: 'Free WiFi', icon: '📶' },
      { name: '24h Desk', icon: '🛎️' }
    ],
    description: 'Directly opposite the Boisar Railway Station entrance. Unbeatable convenience for early morning trains, late night arrivals, and hourly day transit stays.',
    rules: [
      'Valid Government Photo ID required.',
      'Luggage cloakroom facility available for transit guests.'
    ],
    rooms: [
      {
        id: 'hbr1',
        name: 'Standard Station AC Room',
        type: 'Standard AC',
        bedType: 'Double Bed',
        maxGuests: 2,
        size: '220 sq.ft',
        hourly3h: 449,
        hourly6h: 749,
        hourly12h: 1099,
        nightRate: 1399,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        amenities: ['Double Bed', 'AC', 'Hot Water', 'WiFi']
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Deepak Sharma',
        userCity: 'Surat',
        rating: 4,
        date: '1 week ago',
        title: 'Super location for train catchers',
        comment: 'Literally 2 mins from train platform. Took 3-hour room to rest before Saurashtra express.',
        stayType: '3 Hrs Hourly Stay'
      }
    ],
    viewsCount: 410,
    clicksCount: 130,
    bookingsCount: 35
  },
  {
    id: 'hotel-sai-residency',
    slug: 'hotel-sai-residency',
    name: 'Hotel Sai Residency',
    tagline: 'Budget Friendly Clean Rooms & Day Stays',
    category: 'Budget',
    badge: 'BUDGET FRIENDLY',
    offerBadge: 'Lowest Rates in Boisar from ₹349',
    suitabilityTag: '💰 Pocket Friendly · Clean & Sanitized Stays',
    location: 'Katkar Pada, Boisar (East)',
    address: 'Katkar Pada Naka, Near Highway Crossing, Boisar East, Palghar - 401501',
    landmark: 'Near Katkar Pada Hanuman Temple',
    phone: '9822334455',
    whatsapp: '919822334455',
    rating: 4.1,
    reviewsCount: 74,
    hourlyRate3h: 349,
    hourlyRate6h: 599,
    hourlyRate12h: 899,
    nightRate: 1099,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: false,
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Parking', icon: '🅿️' },
      { name: 'Clean AC', icon: '❄️' },
      { name: 'Drinking Water', icon: '🍾' },
      { name: 'Hot Water', icon: '🚿' },
      { name: 'WiFi', icon: '📶' },
      { name: '24h Desk', icon: '🛎️' }
    ],
    description: 'Affordable, straightforward, and reliable hotel accommodation in Boisar East. Ideal for budget conscious travellers, students, and quick hourly transit stays.',
    rules: [
      'Valid Government ID required.',
      'Affordable hourly rates with zero booking fee.'
    ],
    rooms: [
      {
        id: 'sai1',
        name: 'Standard Budget Room',
        type: 'Standard Room',
        bedType: 'Double Bed',
        maxGuests: 2,
        size: '200 sq.ft',
        hourly3h: 349,
        hourly6h: 599,
        hourly12h: 899,
        nightRate: 1099,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop&q=80',
        amenities: ['Double Bed', 'Fan / AC Option', 'Clean Linen', 'Attached Bath']
      }
    ],
    reviews: [
      {
        id: 'rev-6',
        userName: 'Mahesh Patil',
        userCity: 'Boisar',
        rating: 4,
        date: '2 weeks ago',
        title: 'Very budget friendly',
        comment: 'Cheapest 3-hour stay in Boisar and very clean.',
        stayType: '3 Hrs Hourly Stay'
      }
    ],
    viewsCount: 380,
    clicksCount: 110,
    bookingsCount: 29
  },
  {
    id: 'hotel-galaxy-suites',
    slug: 'hotel-galaxy-suites',
    name: 'Hotel Galaxy & Suites',
    tagline: 'Premium Business Hospitality at Tarapur MIDC Gate',
    category: 'Executive',
    badge: 'MIDC GATEWAY',
    offerBadge: 'Complimentary Breakfast on Night Stays',
    suitabilityTag: '💼 Corporate Suites · High Speed Fiber Wi-Fi',
    location: 'Tarapur MIDC Main Gate, Boisar',
    address: 'Tarapur MIDC Main Gate No. 1, Near Bank of Baroda, Tarapur-Boisar Road - 401506',
    landmark: 'Opposite Tarapur Fire Station & Bank of Baroda',
    phone: '9876543210',
    whatsapp: '919876543210',
    rating: 4.6,
    reviewsCount: 104,
    hourlyRate3h: 649,
    hourlyRate6h: 999,
    hourlyRate12h: 1499,
    nightRate: 1999,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: true,
    gallery: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Covered Parking', icon: '🅿️' },
      { name: 'Central AC', icon: '❄️' },
      { name: 'Laptop Workstation', icon: '💻' },
      { name: 'Bottled Mineral Water', icon: '🍾' },
      { name: 'Hot Shower', icon: '🚿' },
      { name: 'Ultra-Fast Fiber WiFi', icon: '📶' },
      { name: 'Room Service', icon: '🛎️' },
      { name: 'Power Backup', icon: '⚡' }
    ],
    description: 'Hotel Galaxy & Suites is designed for business travellers and engineers visiting Tarapur industrial belt. Features ergonomic desk setups, express hourly refresh check-ins, and high-speed connectivity.',
    rules: [
      'Valid Government Photo ID required.',
      'GST invoices provided for corporate accounting.'
    ],
    rooms: [
      {
        id: 'hg1',
        name: 'Galaxy Executive Suite',
        type: 'Executive Suite',
        bedType: 'King Bed',
        maxGuests: 2,
        size: '310 sq.ft',
        hourly3h: 649,
        hourly6h: 999,
        hourly12h: 1499,
        nightRate: 1999,
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80',
        amenities: ['King Bed', 'AC', 'Workstation', 'Fiber WiFi', 'Smart TV']
      }
    ],
    reviews: [
      {
        id: 'rev-7',
        userName: 'Suresh Raina',
        userCity: 'Thane',
        rating: 5,
        date: '3 weeks ago',
        title: 'Top class business hotel',
        comment: 'Very polite management and fast check-in. Excellent for short stays during plant audits.',
        stayType: '6 Hrs Hourly Stay'
      }
    ],
    viewsCount: 510,
    clicksCount: 155,
    bookingsCount: 41
  }
];

export function getAllHotels(): HotelItem[] {
  if (typeof window === 'undefined') return BOISAR_HOTELS;
  let list: HotelItem[] = [...BOISAR_HOTELS];
  try {
    const saved = localStorage.getItem('majh_boisar_custom_hotels_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const approved = parsed.filter((h: any) => h.status !== 'Pending');
        list = [...approved, ...BOISAR_HOTELS];
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Boost Admin Pinned Hotels to rank #1 at the top
  try {
    const pinned = JSON.parse(localStorage.getItem('majh_boisar_pinned_hotels') || '[]');
    if (Array.isArray(pinned) && pinned.length > 0) {
      list = list.map(h => ({
        ...h,
        isPinnedTop: pinned.includes(h.id) || pinned.includes(h.slug)
      } as any));

      list.sort((a, b) => {
        const aPinned = (a as any).isPinnedTop ? 1 : 0;
        const bPinned = (b as any).isPinnedTop ? 1 : 0;
        return bPinned - aPinned;
      });
    }
  } catch (e) {
    console.error(e);
  }

  return list;
}

export function getAllHotelsIncludingPending(): HotelItem[] {
  if (typeof window === 'undefined') return BOISAR_HOTELS;
  try {
    const saved = localStorage.getItem('majh_boisar_custom_hotels_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...parsed, ...BOISAR_HOTELS];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return BOISAR_HOTELS;
}

export function getHotelBySlugOrId(idOrSlug: string): HotelItem | undefined {
  const all = getAllHotels();
  const found = all.find(h => h.id === idOrSlug || h.slug === idOrSlug);
  if (!found) return undefined;

  if (typeof window !== 'undefined') {
    try {
      const customRooms = localStorage.getItem(`majh_boisar_hotel_rooms_${found.id}`) ||
                          localStorage.getItem(`majh_boisar_hotel_rooms_${found.slug}`) ||
                          (found.slug.includes('freesia') ? localStorage.getItem('majh_boisar_hotel_rooms_freesia-by-express-inn') : null);
      if (customRooms) {
        const parsedRooms = JSON.parse(customRooms);
        if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
          const lowest3h = Math.min(...parsedRooms.map(r => Number(r.hourly3h) || 699));
          const lowest6h = Math.min(...parsedRooms.map(r => Number(r.hourly6h) || 1099));
          const lowest12h = Math.min(...parsedRooms.map(r => Number(r.hourly12h) || 1599));
          const lowestNight = Math.min(...parsedRooms.map(r => Number(r.nightRate) || 1899));
          return {
            ...found,
            rooms: parsedRooms,
            hourlyRate3h: isFinite(lowest3h) ? lowest3h : found.hourlyRate3h,
            hourlyRate6h: isFinite(lowest6h) ? lowest6h : found.hourlyRate6h,
            hourlyRate12h: isFinite(lowest12h) ? lowest12h : found.hourlyRate12h,
            nightRate: isFinite(lowestNight) ? lowestNight : found.nightRate,
          };
        }
      }
    } catch (e) {}
  }
  return found;
}

export function recordHotelClick(hotelId: string, actionType: 'view' | 'click' | 'whatsapp' | 'call' | 'book') {
  if (typeof window === 'undefined') return;
  try {
    const clicksKey = 'majh_boisar_hotel_analytics';
    const existing = JSON.parse(localStorage.getItem(clicksKey) || '{}');
    if (!existing[hotelId]) {
      existing[hotelId] = { views: 0, clicks: 0, whatsapp: 0, call: 0, book: 0, lastActivity: new Date().toISOString() };
    }
    if (actionType === 'view') existing[hotelId].views = (existing[hotelId].views || 0) + 1;
    if (actionType === 'click') existing[hotelId].clicks = (existing[hotelId].clicks || 0) + 1;
    if (actionType === 'whatsapp') existing[hotelId].whatsapp = (existing[hotelId].whatsapp || 0) + 1;
    if (actionType === 'call') existing[hotelId].call = (existing[hotelId].call || 0) + 1;
    if (actionType === 'book') existing[hotelId].book = (existing[hotelId].book || 0) + 1;
    existing[hotelId].lastActivity = new Date().toISOString();
    localStorage.setItem(clicksKey, JSON.stringify(existing));
  } catch (e) {
    console.error(e);
  }
}

export const HOURS_LIST_12 = [
  '12:00', '01:00', '02:00', '03:00',
  '04:00', '05:00', '06:00', '07:00',
  '08:00', '09:00', '10:00', '11:00'
];

export function calculateStayWindow(checkInTimeStr: string, durationSlot: '3h' | '6h' | '12h'): {
  startFormatted: string;
  endFormatted: string;
  fullWindowStr: string;
  isNextDay: boolean;
} {
  const durationHours = durationSlot === '3h' ? 3 : durationSlot === '6h' ? 6 : 12;
  
  const raw = (checkInTimeStr || '12:00 PM').trim();
  const match = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  
  let hour = 12;
  let minute = '00';
  let ampm = 'PM';
  
  if (match) {
    hour = parseInt(match[1], 10);
    minute = match[2];
    ampm = match[3].toUpperCase();
  }
  
  let hour24 = hour % 12;
  if (ampm === 'PM') hour24 += 12;
  
  const endTotalHours = hour24 + durationHours;
  const endHour24 = endTotalHours % 24;
  const isNextDay = endTotalHours >= 24;
  
  const endAmPm = endHour24 >= 12 ? 'PM' : 'AM';
  const endHour12 = endHour24 % 12 === 0 ? 12 : endHour24 % 12;
  
  const startFormatted = `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
  const endFormatted = `${endHour12.toString().padStart(2, '0')}:${minute} ${endAmPm}`;
  const fullWindowStr = `${startFormatted} - ${endFormatted} (${durationHours} Hours${isNextDay ? ' · Next Day' : ''})`;
  
  return {
    startFormatted,
    endFormatted,
    fullWindowStr,
    isNextDay
  };
}

