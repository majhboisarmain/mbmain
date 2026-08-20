export interface EmergencyContact {
  id: string;
  title: string;
  category: 'police' | 'fire' | 'hospital' | 'electricity' | 'water' | 'disaster';
  phone: string;
  description: string;
  location: string;
  icon: string;
}

export interface BusSchedule {
  id: string;
  destination: string;
  departures: string;
  category: 'Long Distance' | 'Local & Rural' | 'Express / AC';
  busType: string;
}

export interface LocalOffer {
  id: string;
  shopName: string;
  category: string;
  title: string;
  discount: string;
  validTill: string;
  phone: string;
  address: string;
  bannerImg: string;
  badgeText: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Job Fair' | 'Blood Donation' | 'Festival' | 'Sports' | 'Notice';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  phone: string;
  description: string;
}

export interface UsedItem {
  id: string;
  title: string;
  category: 'Vehicles' | 'Mobiles' | 'Electronics' | 'Furniture';
  price: number;
  condition: string;
  location: string;
  sellerName: string;
  phone: string;
  image: string;
  postedDate: string;
}

export interface BookItem {
  id: string;
  title: string;
  category: '10th/12th School' | 'ITI / Polytechnic' | 'Engineering / Degree';
  subject: string;
  priceType: 'Free / Gift' | 'Discount Price';
  price: number;
  donorName: string;
  phone: string;
  location: string;
  condition: string;
  image: string;
}

export interface TempoDriver {
  id: string;
  driverName: string;
  vehicleType: 'Chota Hathi (Tata Ace)' | '3-Wheel Auto Tempo' | 'Pickup 8ft' | 'Eeco Luggage';
  phone: string;
  standLocation: string;
  rateEstimate: string;
  availability: string;
  image: string;
}

export interface HomeTechnician {
  id: string;
  name: string;
  skill: 'AC Service & Repair' | 'Electrician' | 'Plumber' | 'RO Water Filter' | 'Washing Machine';
  experience: string;
  phone: string;
  location: string;
  visitingFee: string;
  rating: number;
  image: string;
}

export interface SportsTurf {
  id: string;
  name: string;
  sport: 'Box Cricket' | 'Football' | 'Badminton Court';
  hourlyRate: string;
  phone: string;
  location: string;
  features: string;
  timing: string;
  image: string;
}

export interface GameZone {
  id: string;
  name: string;
  category: 'PS5 Lounge' | 'VR Gaming' | 'Snooker & Pool' | 'Arcade Zone';
  hourlyRate: string;
  phone: string;
  location: string;
  features: string;
  timing: string;
  image: string;
}

export interface TurfBookingRecord {
  id: string;
  refCode: string;
  venueName: string;
  category: string;
  station?: string;
  userName: string;
  userPhone: string;
  bookingDate: string;
  timeSlot: string;
  duration: string;
  estRate: string;
  status: 'Confirmed' | 'Attended / Visited' | 'Cancelled';
  createdAt: string;
}

export const INITIAL_TURF_BOOKINGS: TurfBookingRecord[] = [];

// 1. BOISAR EMERGENCY HELPLINES DIRECTORY
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'em-1',
    title: 'Boisar Police Station',
    category: 'police',
    phone: '02525250100',
    description: 'Local police emergency control room & crime reporting',
    location: 'Boisar East, Near Station',
    icon: '👮‍♂️'
  },
  {
    id: 'em-2',
    title: 'Tarapur MIDC Fire Station',
    category: 'fire',
    phone: '02525270101',
    description: '24/7 Fire rescue & industrial emergency response',
    location: 'Tarapur MIDC, Boisar',
    icon: '🚒'
  },
  {
    id: 'em-3',
    title: 'Tarapur Industrial Disaster Cell',
    category: 'disaster',
    phone: '02525270333',
    description: 'Chemical & hazardous spill emergency response team',
    location: 'MIDC Office, Boisar',
    icon: '⚠️'
  },
  {
    id: 'em-4',
    title: 'TCC Hospital Ambulance (24/7)',
    category: 'hospital',
    phone: '02525272000',
    description: '24-hour emergency trauma & ambulance service',
    location: 'Pasthal Road, Boisar',
    icon: '🚑'
  },
  {
    id: 'em-5',
    title: 'MSEDCL Electricity Helpline (Boisar)',
    category: 'electricity',
    phone: '18002333435',
    description: 'Power cut complaints & transformer emergency',
    location: 'MSEDCL Office, Boisar West',
    icon: '⚡'
  },
  {
    id: 'em-6',
    title: 'Boisar Grampanchayat Water Board',
    category: 'water',
    phone: '02525250444',
    description: 'Water supply pipeline leaks & tanker support',
    location: 'Grampanchayat Office, Boisar',
    icon: '💧'
  }
];

// 2. OFFICIAL BOISAR ST BUS DEPOT TIMETABLE (44 DESTINATIONS)
export const BOISAR_BUS_SCHEDULE: BusSchedule[] = [
  {
    id: 'bus-1',
    destination: 'Ahmednagar',
    departures: '8:00 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-2',
    destination: 'Aurangabad / Chh. Sambhajinagar',
    departures: '7:30 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-3',
    destination: 'Bhusawal',
    departures: '6:00 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-4',
    destination: 'Dahanu',
    departures: '7:30, 9:15 AM, 12:15, 1:45, 6:15 PM',
    category: 'Local & Rural',
    busType: 'Ordinary / Semi-Luxury'
  },
  {
    id: 'bus-5',
    destination: 'Gondwale',
    departures: '7:30 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-6',
    destination: 'Kalyan via Wada',
    departures: '8:30, 9:30 AM, 1:00, 4:00, 6:00 PM',
    category: 'Long Distance',
    busType: 'Express'
  },
  {
    id: 'bus-7',
    destination: 'Kolhapur Shivshahi',
    departures: '6:30 AM, 7:30 PM',
    category: 'Express / AC',
    busType: 'Shivshahi AC'
  },
  {
    id: 'bus-8',
    destination: 'Nandurbar',
    departures: '6:20 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-9',
    destination: 'Paithan',
    departures: '6:45 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-10',
    destination: 'Palghar',
    departures: '6:30, 7:10, 7:55, 8:20, 8:30, 9:10, 9:30, 10:00, 10:15, 10:30, 10:45, 11:00, 11:40 AM, 12:10, 12:30, 1:15, 1:30, 1:50, 2:15, 2:50, 3:10, 4:40, 6:00, 6:40, 7:20, 7:40 PM',
    category: 'Local & Rural',
    busType: 'Ordinary / Shuttle'
  },
  {
    id: 'bus-11',
    destination: 'Patoda',
    departures: '7:15 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-12',
    destination: 'Sangli / Narsobachi Wadi Sleeper',
    departures: '5:30 PM',
    category: 'Express / AC',
    busType: 'Sleeper / Seater'
  },
  {
    id: 'bus-13',
    destination: 'Shirdi',
    departures: '7:00 AM, 12:00 PM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-14',
    destination: 'Shirpur',
    departures: '9:45 AM',
    category: 'Long Distance',
    busType: 'MSRTC Express'
  },
  {
    id: 'bus-15',
    destination: 'Pune Swargate Shivshahi',
    departures: '1:00 PM',
    category: 'Express / AC',
    busType: 'Shivshahi AC'
  },
  {
    id: 'bus-16',
    destination: 'Tarapur',
    departures: '1:15 PM',
    category: 'Local & Rural',
    busType: 'Ordinary'
  },
  {
    id: 'bus-17',
    destination: 'Thane via Highway',
    departures: '11:00 AM',
    category: 'Long Distance',
    busType: 'Express'
  },
  {
    id: 'bus-18',
    destination: 'Thane via Wada',
    departures: '11:00 AM',
    category: 'Long Distance',
    busType: 'Express'
  },
  {
    id: 'bus-19',
    destination: 'Tuljapur Sleeper Seater',
    departures: '4:30 PM',
    category: 'Express / AC',
    busType: 'Sleeper / Seater'
  },
  {
    id: 'bus-20',
    destination: 'Wada',
    departures: '11:00 AM',
    category: 'Local & Rural',
    busType: 'Ordinary'
  },
  {
    id: 'bus-21',
    destination: '3/4 Ghivali',
    departures: '8:00 AM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-22',
    destination: 'Aina',
    departures: '9:00, 10:00 AM, 12:50, 3:00 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-23',
    destination: 'Burhanpur',
    departures: '6:30, 7:20, 8:05, 9:35, 9:45, 10:15, 10:40 AM, 12:00, 12:50, 2:00, 2:45, 3:30, 4:45, 5:45, 6:30, 7:30, 8:30 PM',
    category: 'Long Distance',
    busType: 'Express'
  },
  {
    id: 'bus-24',
    destination: 'Chichare',
    departures: '6:40 AM, 4:30 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-25',
    destination: 'Dahisar Pokran',
    departures: '7:00, 7:55 AM, 6:30 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-26',
    destination: 'Dandi',
    departures: '4:55, 5:30, 6:35, 7:10, 7:45, 8:30, 9:20, 9:45, 10:00, 10:30, 11:10 AM, 12:30, 1:00, 2:00, 2:30, 3:00, 3:30, 4:00, 4:30, 5:10, 5:35, 6:15, 7:00, 7:35, 8:15 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-27',
    destination: 'Gargaon',
    departures: '6:00 AM, 2:00 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-28',
    destination: 'Ghivali',
    departures: '7:20, 8:45, 10:30 AM, 1:10, 2:30, 3:30, 4:15, 4:45, 6:15, 8:15 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-29',
    destination: 'Kumbh via Murba',
    departures: '5:05, 6:00, 6:40, 6:55, 7:10, 7:30, 8:10, 8:20, 9:10 AM, 3:30, 4:45, 5:00, 5:30, 6:30, 6:40, 7:20 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-30',
    destination: 'Kumbhvali Naka',
    departures: '12:00, 3:00, 4:45, 6:40 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-31',
    destination: 'Lupin',
    departures: '5:45 AM',
    category: 'Local & Rural',
    busType: 'MIDC Worker Bus'
  },
  {
    id: 'bus-32',
    destination: 'Makadchola',
    departures: '6:00, 7:50, 9:30 AM, 12:50, 3:30, 6:30 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-33',
    destination: 'Mehenaka / Nandgaon',
    departures: '5:30, 6:40, 7:50 AM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-34',
    destination: 'Mundvali',
    departures: '6:05, 11:00 AM, 12:00, 5:35 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-35',
    destination: 'Nanivali',
    departures: '11:15 AM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-36',
    destination: 'Nava Nandgaon',
    departures: '6:10 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-37',
    destination: 'Navapur Khadi',
    departures: '6:20, 6:45, 7:35, 7:50, 8:00, 8:50 AM, 4:45, 5:00, 5:30, 6:00, 6:30 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-38',
    destination: 'Navapur via Murba',
    departures: '9:30, 10:00, 10:30, 11:55 AM, 12:15, 1:15, 1:45, 2:20, 2:45, 3:15, 4:05, 7:15, 8:10 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-39',
    destination: 'Osar',
    departures: '6:35, 9:45 AM, 12:40, 7:45 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-40',
    destination: 'Pachmarg',
    departures: '9:25, 10:00 AM, 4:55, 5:35 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-41',
    destination: 'Rankol',
    departures: '7:00 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-42',
    destination: 'Vadhvan',
    departures: '6:30, 7:05, 8:50, 10:15, 11:15, 11:45 AM, 12:50, 2:30, 3:10, 3:50, 4:30, 5:35, 6:00, 6:30, 7:00, 7:30, 8:10 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-43',
    destination: 'Van Naka',
    departures: '6:05, 10:00, 11:25, 11:40 AM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-44',
    destination: 'Varor',
    departures: '6:25, 7:20, 8:10, 8:40, 10:45 AM, 2:00, 3:00, 4:15, 5:00, 5:20, 5:45 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  },
  {
    id: 'bus-45',
    destination: 'Vasgaon',
    departures: '9:30, 11:30 AM, 5:20, 7:10 PM',
    category: 'Local & Rural',
    busType: 'Local Bus'
  }
];

// 3. DAILY BOISAR LOCAL OFFERS & DEALS
export const BOISAR_OFFERS: LocalOffer[] = [];

// 4. BOISAR COMMUNITY EVENTS & NOTICES
export const BOISAR_EVENTS: CommunityEvent[] = [];

// 5. USED ITEMS MARKETPLACE (BUY & SELL LOCALLY)
export const BOISAR_MARKETPLACE: UsedItem[] = [];

// 6. STUDENT TEXTBOOK & EXAM NOTE EXCHANGE (FEATURE 9)
export const BOOK_EXCHANGE_ITEMS: BookItem[] = [];

// 7. CHOTA HATHI & LUGGAGE TEMPO HELPLINE (FEATURE 10)
export const TEMPO_DRIVERS: TempoDriver[] = [];

// 8. HOME REPAIR TECHNICIANS (FEATURE 11)
export const HOME_TECHNICIANS: HomeTechnician[] = [];

// 9. SPORTS TURFS & GROUND BOOKING (FEATURE 13)
export const SPORTS_TURFS: SportsTurf[] = [];

// 10. BOISAR GAME ZONES & GAMING LOUNGES (FEATURE 14)
export const GAME_ZONES: GameZone[] = [];

// 11. DAILY UTILITIES & MARKET RATES
export const DAILY_UTILITIES = {
  petrolRate: '₹104.25 / L',
  dieselRate: '₹92.40 / L',
  cngRate: '₹86.00 / Kg',
  weeklyHaat: [
    { day: 'Wednesday', location: 'Pasthal Village Market' },
    { day: 'Friday', location: 'Katkar Pada / Station Road' },
    { day: 'Sunday', location: 'Pam & Chinchani Weekly Bazaar' }
  ],
  powerStatus: 'Normal Grid Operation (Zero Scheduled Power Cut Today)'
};

// 12. PRIVATE BUS OPERATORS — Boisar & Tarapur Routes
export interface PrivateBusOperator {
  id: string;
  name: string;
  route: string;
  departure: string;
  phone: string;
  boardingPoint: string;
  busType: string;
  fare: string;
}

export const PRIVATE_BUS_OPERATORS: PrivateBusOperator[] = [
  {
    id: 'pb-1',
    name: 'Shree Travels Boisar',
    route: 'Boisar → Mumbai (Borivali / Dadar)',
    departure: '6:30 AM, 7:30 AM, 9:00 AM, 6:00 PM',
    phone: '9822001234',
    boardingPoint: 'Boisar ST Stand Gate',
    busType: 'Semi-Sleeper AC',
    fare: '₹180 – ₹250'
  },
  {
    id: 'pb-2',
    name: 'Palghar Express Travels',
    route: 'Boisar → Palghar → Virar',
    departure: '7:00 AM, 8:00 AM, 5:30 PM, 7:00 PM',
    phone: '9833112200',
    boardingPoint: 'Katkar Pada, Boisar',
    busType: 'Non-AC Seater',
    fare: '₹60 – ₹110'
  },
  {
    id: 'pb-3',
    name: 'MIDC Worker Shuttle — Tarapur',
    route: 'Boisar Station → Tarapur MIDC (All Gates)',
    departure: '7:00 AM, 8:00 AM, 4:30 PM, 5:30 PM',
    phone: '9867001122',
    boardingPoint: 'Boisar Station East Exit',
    busType: 'Mini Bus (32 Seat)',
    fare: '₹20 – ₹40'
  },
  {
    id: 'pb-4',
    name: 'Dahanu Road Fast Bus',
    route: 'Boisar → Dahanu → Gholvad',
    departure: '8:00 AM, 11:00 AM, 3:00 PM, 6:30 PM',
    phone: '9876500123',
    boardingPoint: 'Boisar ST Stand',
    busType: 'Non-AC Seater',
    fare: '₹50 – ₹80'
  },
  {
    id: 'pb-5',
    name: 'Nashik Direct Travels',
    route: 'Boisar → Igatpuri → Nashik',
    departure: '5:30 AM, 9:00 PM (Night)',
    phone: '9844001155',
    boardingPoint: 'Boisar West, Highway Point',
    busType: 'Sleeper AC',
    fare: '₹350 – ₹500'
  },
  {
    id: 'pb-6',
    name: 'Surat Luxury Bus',
    route: 'Boisar → Vapi → Surat',
    departure: '9:30 PM, 10:30 PM (Overnight)',
    phone: '9821100099',
    boardingPoint: 'Boisar ST Stand Gate',
    busType: 'Sleeper AC / Volvo',
    fare: '₹450 – ₹700'
  }
];

