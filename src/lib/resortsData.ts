export interface ResortVilla {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  type: 'Beach Resort' | 'Private Pool Villa' | 'Luxury Farmhouse' | 'Weekend Cottage';
  location: string;
  area: 'Kelwa Beach' | 'Dahanu' | 'Boisar' | 'Manor / Palghar' | 'Bordi';
  distanceFromBoisar: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  badge?: string;
  pricePerNight: number;
  dayPicnicPrice?: number;
  capacity: string;
  bedrooms: number;
  bathrooms: number;
  phone: string;
  whatsapp: string;
  address: string;
  gallery: string[];
  amenities: {
    icon: string;
    label: string;
  }[];
  highlights: string[];
  houseRules: string[];
  mealOptions: string;
  checkInTime: string;
  checkOutTime: string;
  description: string;
}

export const resortsData: ResortVilla[] = [
  {
    id: 'res-1',
    slug: 'sea-breeze-beach-resort-kelwa',
    name: 'Sea Breeze Beach Resort & Waterpark',
    tagline: 'Family beach resort with swimming pool, water slides and rain dance',
    type: 'Beach Resort',
    location: 'Near Sitladevi Temple, Kelwa Beach',
    area: 'Kelwa Beach',
    distanceFromBoisar: '22 mins from Boisar',
    rating: 4.8,
    reviewsCount: 186,
    verified: true,
    isFeatured: true,
    isComingSoon: true,
    badge: '👑 TOP RATED',
    pricePerNight: 2800,
    dayPicnicPrice: 750,
    capacity: 'Couples, Families & Groups (2 - 50 Guests)',
    bedrooms: 14,
    bathrooms: 16,
    phone: '9307294733',
    whatsapp: '919307294733',
    address: 'Kelwa Beach Main Road, Near Sitladevi Temple, Palghar - 401401',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { icon: '🏊', label: 'Big Swimming Pool & Slides' },
      { icon: '🏖️', label: 'Direct Walk to Beach' },
      { icon: '🎵', label: 'Rain Dance & Music' },
      { icon: '🍽️', label: 'Unlimited Buffet Food' },
      { icon: '📶', label: 'Free Wi-Fi' },
      { icon: '❄️', label: 'Clean AC Rooms' },
      { icon: '🚗', label: 'Free Car Parking' },
      { icon: '🌳', label: 'Green Coconut Garden' }
    ],
    highlights: [
      'Just 2 minutes walk to Kelwa Beach',
      'Day picnic includes tasty breakfast, lunch and evening tea',
      'Fun water slides and play area for children',
      'Great for family trips, birthdays and office group parties'
    ],
    houseRules: [
      'Valid photo ID required for all adult guests',
      'Drink responsibly only inside your private room',
      'Lawn music allowed until 10:00 PM',
      'Pets allowed upon prior request'
    ],
    mealOptions: 'Tasty local fish, chicken, mutton, and pure veg buffet meals.',
    checkInTime: '11:00 AM',
    checkOutTime: '10:00 AM',
    description: 'A fun beach resort near Kelwa Beach surrounded by coconut trees. Enjoy big swimming pool slides, beach walks, hot tasty food, and clean AC rooms.'
  },
  {
    id: 'res-2',
    slug: 'the-palm-private-pool-villa-boisar',
    name: 'The Palm 4BHK Luxury Pool Villa',
    tagline: 'Private 4BHK pool villa with green lawn, BBQ and movie projector',
    type: 'Private Pool Villa',
    location: 'Near MIDC Green Belt, Boisar West',
    area: 'Boisar',
    distanceFromBoisar: '8 mins from Boisar Station',
    rating: 4.9,
    reviewsCount: 94,
    verified: true,
    isFeatured: true,
    isComingSoon: true,
    badge: '👑 TOP RECOMMENDED',
    pricePerNight: 9500,
    dayPicnicPrice: 4500,
    capacity: 'Private 4BHK Villa (Up to 16 Guests)',
    bedrooms: 4,
    bathrooms: 5,
    phone: '9307294733',
    whatsapp: '919307294733',
    address: 'Survey 88, Navapur Road, Boisar West - 401501',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { icon: '🏊', label: 'Private Swimming Pool' },
      { icon: '🍖', label: 'BBQ Grill & Sitting Area' },
      { icon: '📽️', label: 'Movie Projector & Sound' },
      { icon: '🍳', label: 'Kitchen with Local Cook' },
      { icon: '❄️', label: '4 AC Master Bedrooms' },
      { icon: '📶', label: 'Fast Wi-Fi' },
      { icon: '⚡', label: '24/7 Power Backup' },
      { icon: '🛡️', label: 'Full-Time Caretaker' }
    ],
    highlights: [
      '100% private villa — no sharing with strangers',
      'Clean swimming pool open for your group 24/7',
      'Big green lawn for cricket, games and night bonfire',
      'Local cook available to make fresh home-style food'
    ],
    houseRules: [
      'Original photo ID required at check-in',
      'Music allowed inside the villa with closed doors',
      'No smoking inside bedrooms (allowed in garden)',
      'Refundable security deposit ₹3,000 at checkout'
    ],
    mealOptions: 'Full kitchen with gas, fridge and microwave. Local cook available for ₹1,500/day.',
    checkInTime: '01:00 PM',
    checkOutTime: '11:00 AM',
    description: 'A private 4BHK luxury villa in Boisar. Features 4 big AC bedrooms, private swimming pool, movie projector room, green garden, and caretaker.'
  },
  {
    id: 'res-3',
    slug: 'whispering-pines-farmhouse-manor',
    name: 'Whispering Pines Riverfront Villa & Pool',
    tagline: 'Peaceful riverside villa with mango farm and private swimming pool',
    type: 'Private Pool Villa',
    location: 'Vaitarna River Valley, Manor-Palghar',
    area: 'Manor / Palghar',
    distanceFromBoisar: '30 mins from Boisar',
    rating: 4.7,
    reviewsCount: 68,
    verified: true,
    isComingSoon: true,
    badge: '🌿 NATURE RETREAT',
    pricePerNight: 8000,
    dayPicnicPrice: 3500,
    capacity: 'Up to 15 Guests (3 AC Bedrooms)',
    bedrooms: 3,
    bathrooms: 3,
    phone: '9307294733',
    whatsapp: '919307294733',
    address: 'Vaitarna River Road, Near Manor Toll Plaza, Palghar - 401404',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { icon: '🏊', label: 'Private Swimming Pool' },
      { icon: '🌊', label: 'Riverfront View' },
      { icon: '🥭', label: 'Organic Mango Orchard' },
      { icon: '🔥', label: 'Bonfire Area' },
      { icon: '🍳', label: 'Kitchen & Cook' },
      { icon: '❄️', label: 'AC Rooms' }
    ],
    highlights: [
      'Scenic natural river view right from the front patio',
      'Private pool overlooking green hills and forest',
      'Fresh organic country chicken & fish cooked on chulha'
    ],
    houseRules: [
      'Govt ID mandatory for all guests',
      'Loud speakers off outside by 10 PM'
    ],
    mealOptions: 'Authentic Maharashtrian village food on order.',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    description: 'An idyllic nature retreat situated on the banks of Vaitarna River near Manor with private swimming pool and lush organic orchards.'
  }
];
