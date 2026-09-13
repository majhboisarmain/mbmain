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
  stationDistance?: string;
  midcDistance?: string;
  coupleBadgeText?: string;
  safetyBadgeText?: string;
  checkinBadgeText?: string;
  houseRulesTag?: string;
  dayStayTimingWindow?: string;
  nightStayCheckIn?: string;
  nightStayCheckOut?: string;
  roomAmenities?: string[];
  rooms: HotelRoom[];
  reviews: HotelReview[];
  viewsCount: number;
  clicksCount: number;
  bookingsCount: number;
  isComingSoon?: boolean;
}

// All demo hotel data removed — new real hotels will be added via Admin Panel
export const BOISAR_HOTELS: HotelItem[] = [];

const DEMO_HOTEL_KEYWORDS = ['shivanand', 'freesia', 'sarovar', 'blugent', 'boisar-residency', 'boisar residency', 'sai residency', 'galaxy'];

function isLegacyDemo(item: any): boolean {
  if (!item) return false;
  if (typeof item === 'string') {
    const s = item.toLowerCase();
    return DEMO_HOTEL_KEYWORDS.some(kw => s.includes(kw));
  }
  const id = String(item.id || '').toLowerCase();
  const slug = String(item.slug || '').toLowerCase();
  const name = String(item.name || '').toLowerCase();
  return DEMO_HOTEL_KEYWORDS.some(kw => id.includes(kw) || slug.includes(kw) || name.includes(kw));
}

export function purgeDemoHotelsFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const listKeys = [
      'majh_boisar_custom_hotels_v2',
      'majh_boisar_admin_hotels',
      'majh_boisar_user_hotels',
      'majh_boisar_pinned_hotels'
    ];
    for (const key of listKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const cleaned = arr.filter((x: any) => !isLegacyDemo(x));
          if (cleaned.length !== arr.length) {
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
        }
      } catch { }
    }

    // Clean any demo hotel room/pricing keys
    const allKeys = Object.keys(localStorage);
    for (const k of allKeys) {
      if (k.startsWith('majh_boisar_hotel_') && DEMO_HOTEL_KEYWORDS.some(kw => k.toLowerCase().includes(kw))) {
        localStorage.removeItem(k);
      }
    }
  } catch { }
}

export function getAllHotels(): HotelItem[] {
  if (typeof window === 'undefined') return BOISAR_HOTELS;
  purgeDemoHotelsFromStorage();
  let list: HotelItem[] = [...BOISAR_HOTELS];
  try {
    const saved = localStorage.getItem('majh_boisar_custom_hotels_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const approved = parsed
          .filter((h: any) => h && h.status !== 'Pending' && !isLegacyDemo(h));
        const approvedSlugs = new Set(approved.map((h: any) => (h.slug || '').toLowerCase().trim()).filter(Boolean));
        const approvedIds = new Set(approved.map((h: any) => (h.id || '').toLowerCase().trim()).filter(Boolean));
        const approvedNames = new Set(approved.map((h: any) => (h.name || '').toLowerCase().trim()).filter(Boolean));

        const uniqueStatic = BOISAR_HOTELS.filter(h =>
          !approvedSlugs.has((h.slug || '').toLowerCase().trim()) &&
          !approvedIds.has((h.id || '').toLowerCase().trim()) &&
          !approvedNames.has((h.name || '').toLowerCase().trim())
        );
        list = [...approved, ...uniqueStatic];
      }
    }
  } catch (e) {
    console.error(e);
  }

  // Sync hourly availability status from local storage
  try {
    const globalHourlyEnabled = localStorage.getItem('majh_boisar_hotel_hourly_enabled');
    list = list.map(h => {
      const specificHourly = localStorage.getItem(`majh_boisar_hotel_hourly_${h.slug}`) ||
        localStorage.getItem(`majh_boisar_hotel_hourly_${h.id}`);
      const isHourlyOff = specificHourly === 'false' ||
        (h.offersHourly === false) ||
        (specificHourly === null && globalHourlyEnabled === 'false');

      if (isHourlyOff) {
        return {
          ...h,
          offersHourly: false,
          is3hAvailable: false,
          is6hAvailable: false,
          is12hAvailable: false,
          isDayAvailable: true,
          isNightAvailable: true
        };
      }
      return h;
    });
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
  purgeDemoHotelsFromStorage();
  try {
    const saved = localStorage.getItem('majh_boisar_custom_hotels_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.filter((h: any) => h && !isLegacyDemo(h));
        const parsedKeys = new Set(cleaned.map((h: any) => (h.slug || h.id || h.name || '').toLowerCase().trim()));
        const uniqueStatic = BOISAR_HOTELS.filter(h =>
          !parsedKeys.has((h.slug || '').toLowerCase().trim()) &&
          !parsedKeys.has((h.id || '').toLowerCase().trim()) &&
          !parsedKeys.has((h.name || '').toLowerCase().trim())
        );
        return [...cleaned, ...uniqueStatic];
      }
    }
  } catch (e) {
    console.error(e);
  }
  return BOISAR_HOTELS;
}

export function normalizeHotelAmenity(name: string): string {
  if (!name) return '';
  const clean = name.trim();
  const lower = clean.toLowerCase();

  if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) return 'Wi-Fi';
  if (
    lower === 'ac' ||
    lower.includes('ac ') ||
    lower.includes(' ac') ||
    lower.includes('air condition') ||
    lower.includes('ac room') ||
    lower.includes('ac deluxe') ||
    lower.includes('deluxe ac') ||
    lower.includes('ac executive') ||
    lower.includes('luxury ac')
  ) return 'AC';
  if (lower.includes('park')) return 'Parking';
  if (lower.includes('tv') || lower.includes('television')) return 'TV';
  if (lower.includes('water') || lower.includes('shower') || lower.includes('geyser')) return 'Hot Water';
  if (lower.includes('linen') || lower.includes('bed') || lower.includes('towel')) return 'Clean Linens';
  if (lower.includes('power') || lower.includes('backup') || lower.includes('generator') || lower.includes('inverter')) return 'Power Backup';
  if (lower.includes('lift') || lower.includes('elevator')) return 'Elevator / Lift';
  if (lower.includes('room service')) return 'Room Service';
  if (lower.includes('cctv') || lower.includes('surveillance') || lower.includes('security camera')) return 'CCTV Security';
  if (lower.includes('housekeep') || lower.includes('sanitiz')) return 'Sanitized Daily Housekeeping';
  if (lower.includes('bath') || lower.includes('washroom')) return 'Private Bathroom';
  if (lower.includes('toilet') || lower.includes('dental') || lower.includes('soap')) return 'Complimentary Toiletries';
  if (lower.includes('tea') || lower.includes('coffee') || lower.includes('kettle')) return 'Tea / Coffee Maker';
  if (lower.includes('pool') || lower.includes('swim')) return 'Swimming Pool';
  if (lower.includes('restaur') || lower.includes('dining') || lower.includes('food') || lower.includes('kitchen')) return 'In-house Restaurant';

  return clean;
}

export function deduplicateRules(rawRules: string[]): string[] {
  if (!Array.isArray(rawRules)) return [];
  const result: string[] = [];
  let hasIdRule = false;
  let hasCoupleRule = false;
  let hasCheckoutRule = false;
  let hasVisitorRule = false;
  let hasSmokingRule = false;
  let hasPaymentRule = false;

  for (const raw of rawRules) {
    if (!raw) continue;
    const clean = raw.trim().replace(/^âœ“\s*/, '').replace(/^[â€¢\-\*]\s*/, '').trim();
    if (!clean) continue;
    const lower = clean.toLowerCase();

    // 1. Identification / Age requirement
    if (lower.includes('govt') || lower.includes('aadhaar') || lower.includes('photo id') || lower.includes('valid id') || lower.includes('identification') || lower.includes('18+') || lower.includes('21+')) {
      if (lower.includes('couple')) {
        if (hasCoupleRule) continue;
        hasCoupleRule = true;
        result.push(clean);
        continue;
      }
      if (hasIdRule) continue;
      hasIdRule = true;
      result.push(clean);
      continue;
    }

    // 2. Couple Rule
    if (lower.includes('couple')) {
      if (hasCoupleRule) continue;
      hasCoupleRule = true;
      result.push(clean);
      continue;
    }

    // 3. Checkout / Timing Rule
    if (lower.includes('check-out') || lower.includes('checkout') || lower.includes('sanitization')) {
      if (hasCheckoutRule) continue;
      hasCheckoutRule = true;
      result.push(clean);
      continue;
    }

    // 4. Visitor Rule
    if (lower.includes('visitor') || lower.includes('lobby')) {
      if (hasVisitorRule) continue;
      hasVisitorRule = true;
      result.push(clean);
      continue;
    }

    // 5. Smoking Rule
    if (lower.includes('smoking') || lower.includes('smoke')) {
      if (hasSmokingRule) continue;
      hasSmokingRule = true;
      result.push(clean);
      continue;
    }

    // 6. Payment Rule
    if (lower.includes('payment') || lower.includes('upi') || lower.includes('gpay') || lower.includes('cash')) {
      if (hasPaymentRule) continue;
      hasPaymentRule = true;
      result.push(clean);
      continue;
    }

    if (!result.some(r => r.toLowerCase() === lower)) {
      result.push(clean);
    }
  }

  return result;
}

export function getHotelBySlugOrId(idOrSlug: string): HotelItem | undefined {
  const all = getAllHotels();
  const cleanKey = (idOrSlug || '').toLowerCase().trim();
  const found = all.find(h =>
    (h.id && h.id.toLowerCase().trim() === cleanKey) ||
    (h.slug && h.slug.toLowerCase().trim() === cleanKey) ||
    (h.name && h.name.toLowerCase().trim() === cleanKey) ||
    (h.name && h.name.toLowerCase().replace(/\s+/g, '-') === cleanKey)
  );
  if (!found) return undefined;

  if (typeof window !== 'undefined') {
    try {
      let customObj: any = { ...found };

      // Load saved custom rooms
      const customRooms = localStorage.getItem(`majh_boisar_hotel_rooms_${found.id}`) ||
        localStorage.getItem(`majh_boisar_hotel_rooms_${found.slug}`);
      if (customRooms) {
        const parsedRooms = JSON.parse(customRooms);
        if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
          const lowest3h = Math.min(...parsedRooms.map(r => Number(r.hourly3h) || 699));
          const lowest6h = Math.min(...parsedRooms.map(r => Number(r.hourly6h) || 1099));
          const lowest12h = Math.min(...parsedRooms.map(r => Number(r.hourly12h) || 1599));
          const lowestNight = Math.min(...parsedRooms.map(r => Number(r.nightRate) || 1899));
          customObj = {
            ...customObj,
            rooms: parsedRooms,
            hourlyRate3h: isFinite(lowest3h) ? lowest3h : found.hourlyRate3h,
            hourlyRate6h: isFinite(lowest6h) ? lowest6h : found.hourlyRate6h,
            hourlyRate12h: isFinite(lowest12h) ? lowest12h : found.hourlyRate12h,
            nightRate: isFinite(lowestNight) ? lowestNight : found.nightRate,
          };
        }
      }

      // Load saved custom rules & tag
      const customRules = localStorage.getItem(`majh_boisar_hotel_rules_${found.id}`) ||
        localStorage.getItem(`majh_boisar_hotel_rules_${found.slug}`);
      if (customRules) {
        const parsedRules = JSON.parse(customRules);
        if (Array.isArray(parsedRules) && parsedRules.length > 0) {
          customObj.rules = deduplicateRules(parsedRules);
        }
      } else if (customObj.rules && customObj.rules.length > 0) {
        customObj.rules = deduplicateRules(customObj.rules);
      }

      const customRulesTag = localStorage.getItem(`majh_boisar_hotel_rules_tag_${found.id}`) ||
        localStorage.getItem(`majh_boisar_hotel_rules_tag_${found.slug}`);
      if (customRulesTag) {
        customObj.houseRulesTag = customRulesTag;
      }

      return customObj;
    } catch (e) { }
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
  const fullWindowStr = `${startFormatted} - ${endFormatted} (${durationHours} Hours${isNextDay ? ' Â· Next Day' : ''})`;

  return {
    startFormatted,
    endFormatted,
    fullWindowStr,
    isNextDay
  };
}

