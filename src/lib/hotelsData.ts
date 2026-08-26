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

export const BOISAR_HOTELS: HotelItem[] = [];

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

