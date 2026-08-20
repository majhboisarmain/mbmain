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
    badge: '👑 TOP RATED',
    pricePerNight: 2800,
    dayPicnicPrice: 750,
    capacity: 'Couples, Families & Groups (2 - 50 Guests)',
    bedrooms: 14,
    bathrooms: 16,
    phone: '7769947217',
    whatsapp: '917769947217',
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
    badge: '👑 TOP RECOMMENDED',
    pricePerNight: 9500,
    dayPicnicPrice: 4500,
    capacity: 'Private 4BHK Villa (Up to 16 Guests)',
    bedrooms: 4,
    bathrooms: 5,
    phone: '7769947217',
    whatsapp: '917769947217',
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
    reviewsCount: 72,
    verified: true,
    pricePerNight: 5500,
    dayPicnicPrice: 600,
    capacity: '3BHK Villa (Up to 20 Guests)',
    bedrooms: 3,
    bathrooms: 4,
    phone: '7769947217',
    whatsapp: '917769947217',
    address: 'Manor-Palghar Road, Near Vaitarna River Bridge, Palghar - 401404',
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { icon: '🌊', label: 'River View & Boating' },
      { icon: '🏊', label: 'Clean Swimming Pool' },
      { icon: '🥭', label: '5-Acre Mango Farm' },
      { icon: '🔥', label: 'Night Campfire' },
      { icon: '🍲', label: 'Fresh Food on Chulha' },
      { icon: '❄️', label: 'Clean AC Bedrooms' },
      { icon: '🐕', label: '100% Pet Friendly' },
      { icon: '🚗', label: 'Free Car Parking' }
    ],
    highlights: [
      'Right next to the river with fresh air and green trees',
      'Tasty home-style chicken and pure veg thali cooked on chulha',
      'Fun indoor games: Carrom, Chess, Table Tennis and Badminton',
      'Peaceful place to relax with family and friends'
    ],
    houseRules: [
      'Valid photo ID required for all guests',
      'Please keep the farm clean and do not harm plants or birds',
      'No plastic littering',
      'Pets are welcome and must be looked after in the open lawn'
    ],
    mealOptions: 'Hot and fresh breakfast, lunch and dinner cooked on chulha for ₹800 per person/day.',
    checkInTime: '12:00 PM',
    checkOutTime: '10:30 AM',
    description: 'A quiet 5-acre riverside farm villa in Manor. Enjoy fresh air, swimming pool fun, night bonfire, and delicious home-cooked village food.'
  },
  {
    id: 'res-4',
    slug: 'dahanu-coastal-villa-resort',
    name: 'Blue Lagoon Beach Villa & Resort',
    tagline: 'Sea-view wooden cottages with private infinity pool in Dahanu',
    type: 'Beach Resort',
    location: 'Coastal Highway, Dahanu Beach',
    area: 'Dahanu',
    distanceFromBoisar: '25 mins from Boisar',
    rating: 4.9,
    reviewsCount: 128,
    verified: true,
    pricePerNight: 3500,
    dayPicnicPrice: 850,
    capacity: 'Couples & Family Suites (2 - 30 Guests)',
    bedrooms: 10,
    bathrooms: 12,
    phone: '7769947217',
    whatsapp: '917769947217',
    address: 'Beach Frontage, Gholvad - Dahanu Coastal Highway, Dahanu - 401601',
    gallery: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80'
    ],
    amenities: [
      { icon: '🏊', label: 'Infinity Swimming Pool' },
      { icon: '🌅', label: 'Sea View Balcony' },
      { icon: '🍹', label: 'Open-Air Garden Cafe' },
      { icon: '🍽️', label: 'Fresh Coastal Seafood' },
      { icon: '❄️', label: 'Fully AC Rooms' },
      { icon: '📶', label: 'Fast Wi-Fi' },
      { icon: '🚴', label: 'Bicycles for Beach Rides' },
      { icon: '🅿️', label: 'Free Car Parking' }
    ],
    highlights: [
      'Direct view of the sea and sunset from your balcony',
      'Famous Dahanu chikoo ice cream and fresh fish fry',
      'Romantic dinner setup on the garden lawn upon request',
      'Great for couples, weekend trips, and family holidays'
    ],
    houseRules: [
      'Valid photo ID required for all guests',
      'Proper swimming clothes required for pool entry',
      'Check-in after 12:30 PM',
      'Couples and families welcome'
    ],
    mealOptions: 'Fresh seafood curries, fried fish, veg food, and North Indian dishes.',
    checkInTime: '12:30 PM',
    checkOutTime: '11:00 AM',
    description: 'A beach resort on Dahanu shore with sea-view wooden rooms, a big infinity swimming pool, and fresh coastal food.'
  }
];
