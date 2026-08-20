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

export const resortsData: ResortVilla[] = [];
