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
  dayRate?: number;
  nightRate: number;
  offersHourly?: boolean;
  is3hAvailable: boolean;
  is6hAvailable: boolean;
  is12hAvailable: boolean;
  isDayAvailable?: boolean;
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
  isComingSoon?: boolean;
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
    phone: '9307294733',
    whatsapp: '919307294733',
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
    isComingSoon: true,
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
        comment: 'Needed a quick 3-hour quiet place between MIDC client meetings. Spotless room and great coffee!',
        stayType: '3 Hrs Hourly Stay'
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
    phone: '9307294733',
    whatsapp: '919307294733',
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
    isComingSoon: true,
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
      { name: 'Hot Water 24/7', icon: '🚿' },
      { name: 'Fast Wi-Fi', icon: '📶' }
    ],
    description: 'Strategically located directly opposite Tarapur MIDC Gate, Hotel Sarovar Residency is the primary choice for executives, engineers, and day commuters.',
    rules: [
      'Original Govt Photo ID required',
      '24/7 check-in welcome',
      'Late check-outs on request'
    ],
    rooms: [
      {
        id: 'r3',
        name: 'Executive AC Room',
        type: 'Executive AC',
        bedType: '1 Queen Bed',
        maxGuests: 2,
        size: '240 sq.ft',
        hourly3h: 549,
        hourly6h: 899,
        hourly12h: 1299,
        nightRate: 1699,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        amenities: ['Queen Bed', 'AC', 'Work Table', 'Free WiFi', 'Geyser']
      }
    ],
    reviews: [],
    viewsCount: 420,
    clicksCount: 132,
    bookingsCount: 31
  },
  {
    id: 'blugent-residency',
    slug: 'blugent-residency',
    name: 'Blugent Residency',
    tagline: 'Boutique Comfort & Couple Friendly Stay in Boisar',
    category: 'Boutique',
    badge: 'BOUTIQUE',
    offerBadge: '100% Couple Friendly with Local ID',
    suitabilityTag: '💑 Recommended for privacy, quiet surroundings & clean interiors',
    location: 'Navapur Road, Boisar (West)',
    address: 'Near D-Mart Circle, Navapur Road, Boisar West, Palghar - 401501',
    landmark: '500m from D-Mart Boisar',
    phone: '9307294733',
    whatsapp: '919307294733',
    rating: 4.6,
    reviewsCount: 89,
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
    nearStation: false,
    nearMidc: false,
    isComingSoon: true,
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Parking Space', icon: '🅿️' },
      { name: 'Split AC', icon: '❄️' },
      { name: 'Smart TV & OTT', icon: '📺' },
      { name: 'Fast WiFi', icon: '📶' },
      { name: 'Couple Friendly', icon: '💑' }
    ],
    description: 'Blugent Residency brings stylish boutique aesthetics with modern pastel interiors, plush mattress beds, high speed fiber Wi-Fi, and complete discretion.',
    rules: [
      'Aadhaar / Driving license compulsory',
      'Strictly 18+ couples allowed with privacy',
      'No smoking inside rooms'
    ],
    rooms: [
      {
        id: 'r4',
        name: 'Premium Deluxe King',
        type: 'Premium AC',
        bedType: '1 King Bed',
        maxGuests: 2,
        size: '260 sq.ft',
        hourly3h: 599,
        hourly6h: 949,
        hourly12h: 1399,
        nightRate: 1799,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
        amenities: ['King Bed', 'AC', 'Smart TV', 'Hot Shower', 'WiFi']
      }
    ],
    reviews: [],
    viewsCount: 380,
    clicksCount: 95,
    bookingsCount: 22
  },
  {
    id: 'hotel-boisar-residency',
    slug: 'hotel-boisar-residency',
    name: 'Hotel Boisar Residency',
    tagline: 'Budget AC Stay Just 2 Mins from Boisar Railway Station',
    category: 'Budget',
    badge: 'BUDGET',
    offerBadge: 'Lowest Price Guaranteed · Walkable from Station',
    suitabilityTag: '🚆 Ideal for train transit passengers & budget day travelers',
    location: 'Station Road, Boisar (West)',
    address: 'Station Road, Opposite Boisar Railway Station Platform 1 Exit, Boisar West - 401501',
    landmark: 'Opposite Railway Platform 1 Exit Gate',
    phone: '9307294733',
    whatsapp: '919307294733',
    rating: 4.3,
    reviewsCount: 164,
    hourlyRate3h: 449,
    hourlyRate6h: 699,
    hourlyRate12h: 999,
    nightRate: 1399,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: true,
    nearMidc: false,
    isComingSoon: true,
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'Station Opposite', icon: '🚉' },
      { name: 'AC & Non-AC', icon: '❄️' },
      { name: 'Luggage Storage', icon: '🧳' },
      { name: 'Hot Shower', icon: '🚿' },
      { name: 'Free WiFi', icon: '📶' }
    ],
    description: 'Located directly across the exit gate of Boisar Railway Station, Hotel Boisar Residency provides affordable, hygienic AC rooms for quick stopovers.',
    rules: [
      'Valid govt photo ID mandatory',
      'Instant check-in available 24 hours',
      'Early morning check-ins welcome'
    ],
    rooms: [
      {
        id: 'r5',
        name: 'Standard Station AC Room',
        type: 'Standard AC',
        bedType: '1 Double Bed',
        maxGuests: 2,
        size: '200 sq.ft',
        hourly3h: 449,
        hourly6h: 699,
        hourly12h: 999,
        nightRate: 1399,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
        amenities: ['Double Bed', 'AC', 'TV', 'Attached Bath']
      }
    ],
    reviews: [],
    viewsCount: 512,
    clicksCount: 147,
    bookingsCount: 39
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

