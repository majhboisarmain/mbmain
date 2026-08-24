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
}

export const BOISAR_HOTELS: HotelItem[] = [
  {
    id: 'hotel-freesia',
    slug: 'freesia-by-express-inn',
    name: 'Freesia by Express Inn',
    tagline: 'Luxury Comfort Stay & Flexible Hourly Day-Rest in Boisar',
    category: 'Luxury',
    badge: '♦ 3-STAR LUXURY',
    offerBadge: 'Special 15% OFF for Local Guests',
    suitabilityTag: '💼 Business, Couple & Hourly Rest Friendly',
    location: 'Ostwal Empire, Boisar (W)',
    address: 'Ostwal Empire Main Road, Near Reliance Trends, Boisar (West), Palghar',
    landmark: 'Ostwal Empire',
    phone: '8149998666',
    whatsapp: '918149998666',
    rating: 4.5,
    reviewsCount: 128,
    hourlyRate3h: 599,
    hourlyRate6h: 999,
    hourlyRate12h: 1499,
    dayRate: 1599,
    nightRate: 1899,
    offersHourly: true,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isDayAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: true,
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'AC Deluxe', icon: '❄️' },
      { name: 'Free Fast Wi-Fi', icon: '📶' },
      { name: 'Hot Shower & Geyser', icon: '🚿' },
      { name: 'Free Parking', icon: '🅿️' },
      { name: 'TV Screen', icon: '📺' },
      { name: '24/7 Power Backup', icon: '⚡' },
      { name: 'Room Service', icon: '🛎️' }
    ],
    description: 'Premier 3-star hospitality hotel in Boisar offering clean air-conditioned rooms, swift contactless check-ins, complete privacy, in-house restaurant dining, and flexible 3h / 6h / 12h / overnight stay options.',
    rules: [
      'Original Valid Photo ID (Aadhaar/Driving License/Passport) required at check-in.',
      'Couples 18+ Welcome with complete privacy (Local IDs accepted).',
      'Pay on arrival at Reception Desk (No advance payment needed).',
      'Flexible 24/7 check-in slots available.'
    ],
    rooms: [
      {
        id: 'r_freesia_deluxe',
        name: 'Executive AC Room',
        type: 'Executive AC',
        bedType: '1 King Bed',
        maxGuests: 2,
        size: '260 sq.ft',
        hourly3h: 599,
        hourly6h: 999,
        hourly12h: 1499,
        nightRate: 1899,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
        amenities: ['AC', 'King Bed', 'Free Wi-Fi', 'Hot Shower', 'Clean Linen']
      }
    ],
    reviews: [],
    viewsCount: 245,
    clicksCount: 52,
    bookingsCount: 19
  },
  {
    id: 'hotel-sarovar',
    slug: 'hotel-sarovar-residency-suites',
    name: 'Hotel Sarovar Residency & Suites',
    tagline: 'Premium Day & Night Family & Business Stay in Boisar',
    category: 'Executive',
    badge: '♦ DAY & NIGHT ONLY',
    offerBadge: 'Free Breakfast on Overnight Stay',
    suitabilityTag: '🏢 Corporate MIDC & Family Comfort Stay',
    location: 'MIDC Road, Salwad, Boisar',
    address: 'Opposite Tarapur MIDC Gate No. 2, Salwad, Boisar (West), Palghar',
    landmark: 'Tarapur MIDC Gate No. 2',
    phone: '9657187919',
    whatsapp: '919657187919',
    rating: 4.4,
    reviewsCount: 86,
    hourlyRate3h: 0,
    hourlyRate6h: 0,
    hourlyRate12h: 0,
    dayRate: 1299,
    nightRate: 1699,
    offersHourly: false,
    is3hAvailable: false,
    is6hAvailable: false,
    is12hAvailable: false,
    isDayAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: false,
    nearMidc: true,
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'AC Deluxe', icon: '❄️' },
      { name: 'Free Fast Wi-Fi', icon: '📶' },
      { name: 'Hot Shower & Geyser', icon: '🚿' },
      { name: 'Free Parking', icon: '🅿️' },
      { name: 'TV Screen', icon: '📺' },
      { name: '24/7 Power Backup', icon: '⚡' }
    ],
    description: 'Executive corporate hotel located close to Tarapur MIDC Salwad. We provide comfortable full-day stays (Day Rest) and peaceful overnight stays with spacious AC rooms and banquet facilities. Hourly bookings are not offered at this property.',
    rules: [
      'Valid Government Photo ID required for all guests.',
      'Check-in: 12:00 PM | Check-out: 11:00 AM (Day stays available 9:00 AM to 6:00 PM).',
      'Pay on arrival at Reception Desk.',
      'No hourly slots available at this property.'
    ],
    rooms: [
      {
        id: 'r_sarovar_ac',
        name: 'Deluxe AC Room',
        type: 'Deluxe AC',
        bedType: '1 Queen Bed',
        maxGuests: 2,
        size: '220 sq.ft',
        hourly3h: 0,
        hourly6h: 0,
        hourly12h: 0,
        nightRate: 1699,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        amenities: ['AC', 'Queen Bed', 'Free Wi-Fi', 'Geyser', 'Desk']
      }
    ],
    reviews: [],
    viewsCount: 180,
    clicksCount: 38,
    bookingsCount: 12
  },
  {
    id: 'hotel-royal-comfort',
    slug: 'hotel-royal-comfort-station-road',
    name: 'Hotel Royal Comfort',
    tagline: 'Budget & Hourly Comfort Rooms near Boisar Station',
    category: 'Budget',
    badge: '♦ 2 MINS STATION',
    offerBadge: 'Budget Friendly',
    suitabilityTag: '🚆 Station Travelers & Quick Rest',
    location: 'Station Road, Boisar (E)',
    address: 'Station Road, Near Railway Flyover, Boisar (East), Palghar',
    landmark: 'Boisar Railway Station',
    phone: '9823456789',
    whatsapp: '919823456789',
    rating: 4.2,
    reviewsCount: 64,
    hourlyRate3h: 449,
    hourlyRate6h: 749,
    hourlyRate12h: 1099,
    dayRate: 1199,
    nightRate: 1399,
    offersHourly: true,
    is3hAvailable: true,
    is6hAvailable: true,
    is12hAvailable: true,
    isDayAvailable: true,
    isNightAvailable: true,
    isCoupleFriendly: true,
    acceptsLocalId: true,
    nearStation: true,
    nearMidc: false,
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { name: 'AC / Fan', icon: '❄️' },
      { name: 'Free Wi-Fi', icon: '📶' },
      { name: 'Hot Shower', icon: '🚿' },
      { name: 'TV', icon: '📺' }
    ],
    description: 'Budget-friendly accommodation just 2 minutes walking distance from Boisar Railway Station. Ideal for daily commuters, business travelers, and quick hourly layovers.',
    rules: [
      'Original Valid Photo ID required at check-in.',
      'Couples 18+ Welcome.',
      'Instant Walk-in & Pay at desk available.'
    ],
    rooms: [
      {
        id: 'r_royal_standard',
        name: 'Standard AC Room',
        type: 'Standard AC',
        bedType: '1 Double Bed',
        maxGuests: 2,
        size: '180 sq.ft',
        hourly3h: 449,
        hourly6h: 749,
        hourly12h: 1099,
        nightRate: 1399,
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
        amenities: ['AC', 'Double Bed', 'Wi-Fi', 'TV']
      }
    ],
    reviews: [],
    viewsCount: 154,
    clicksCount: 31,
    bookingsCount: 8
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

