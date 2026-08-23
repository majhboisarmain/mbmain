export interface FoodItem {
  id: string;
  name: string;
  category: 'Cafe' | 'Family Dining' | 'Fast Food' | 'Pure Veg & Thali' | 'Party & Lounge' | 'Desserts & Bakery' | 'Late Night & Dhaba' | 'Seafood';
  categoryLabel: string;
  location: string;
  area: 'Boisar West' | 'Ostwal Empire' | 'Station Road' | 'Tarapur MIDC' | 'Navapur Road' | 'Pasthal' | 'Kelwa Road';
  rating: number;
  reviewsCount: number;
  priceForTwo: string;
  priceLevel: '₹' | '₹₹' | '₹₹₹';
  discount?: string;
  speciality: string;
  image: string;
  gallery: string[];
  phone: string;
  whatsapp: string;
  timings: string;
  isPureVeg: boolean;
  isFeatured?: boolean;
  features: string[];
  serviceModes?: ('dinein' | 'delivery')[];
  popularDishes: { name: string; price: string; isVeg: boolean; desc?: string }[];
}

export const BOISAR_FOOD_DIRECTORY: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Citrus Cafe & Resto',
    category: 'Cafe',
    categoryLabel: 'Cafe & Multi-Cuisine',
    location: 'Boisar West · Near Station',
    area: 'Boisar West',
    rating: 4.8,
    reviewsCount: 342,
    priceForTwo: '₹450 for two',
    priceLevel: '₹₹',
    discount: '15% Off + 25% Off',
    speciality: 'Cold Brew, Pasta & Sizzlers',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9307294733',
    whatsapp: '9307294733',
    timings: '11:00 AM – 11:00 PM',
    isPureVeg: false,
    isFeatured: true,
    features: ['AC Seating', 'Free Wi-Fi', 'Cozy Ambiance', 'Takeaway', 'Card Accepted'],
    popularDishes: [
      { name: 'Peri-Peri Paneer Sizzler', price: '₹280', isVeg: true, desc: 'Hot iron plate sizzler with buttered rice & fries' },
      { name: 'Hazelnut Cold Coffee', price: '₹140', isVeg: true, desc: 'Rich espresso blended with chilled cream' },
      { name: 'Alfredo White Sauce Pasta', price: '₹220', isVeg: true, desc: 'Creamy cheese sauce with herb seasonings' },
      { name: 'Smoky BBQ Chicken Wings', price: '₹260', isVeg: false, desc: 'Crispy glazed wings with dipping sauce' }
    ]
  },
  {
    id: 'food-2',
    name: 'The Daily Dose Cafe',
    category: 'Cafe',
    categoryLabel: 'Coffee, Pizza & Burgers',
    location: 'Ostwal Empire Main Avenue',
    area: 'Ostwal Empire',
    rating: 4.7,
    reviewsCount: 289,
    priceForTwo: '₹350 for two',
    priceLevel: '₹',
    discount: 'Flat 20% Off',
    speciality: 'Handcrafted Burgers & Thick Shakes',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9022388123',
    whatsapp: '9022388123',
    timings: '12:00 PM – 11:30 PM',
    isPureVeg: false,
    isFeatured: true,
    features: ['Youth Hangout', 'Fast Wi-Fi', 'Board Games', 'Takeaway', 'Doorstep Delivery'],
    popularDishes: [
      { name: 'Monster Cheese Volcano Burger', price: '₹180', isVeg: true, desc: 'Double patty loaded with melted mozzarella' },
      { name: 'Oreo Nutella Freakshake', price: '₹160', isVeg: true, desc: 'Thick shake topped with waffle & chocolate drizzle' },
      { name: 'Peri Peri Loaded Fries', price: '₹120', isVeg: true, desc: 'Crispy golden fries with cheesy jalapeño dip' }
    ]
  },
  {
    id: 'food-3',
    name: 'Sai Sagar Veg Treat',
    category: 'Pure Veg & Thali',
    categoryLabel: 'Pure Veg & South Indian',
    location: 'Station Road, Boisar West',
    area: 'Station Road',
    rating: 4.6,
    reviewsCount: 512,
    priceForTwo: '₹300 for two',
    priceLevel: '₹',
    discount: 'Special Thali & Dosa Deal',
    speciality: 'Crispy Butter Masala Dosa & Unlimited Thali',
    image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9823456789',
    whatsapp: '9823456789',
    timings: '07:00 AM – 10:30 PM',
    isPureVeg: true,
    isFeatured: true,
    features: ['100% Pure Veg', 'Family Dining', 'Quick Service', 'Breakfast Special', 'AC Hall'],
    popularDishes: [
      { name: 'Mysore Masala Dosa', price: '₹110', isVeg: true, desc: 'Crisp crepe spread with red chutney & spiced potato' },
      { name: 'Special Gujarati Unlimited Thali', price: '₹180', isVeg: true, desc: '3 Veggies, Dal, Kadhi, Roti, Farsan & Sweet' },
      { name: 'Filter Coffee', price: '₹40', isVeg: true, desc: 'Authentic South Indian brass dabarah coffee' }
    ]
  },
  {
    id: 'food-4',
    name: 'Cafe Hashtag & Lounge',
    category: 'Party & Lounge',
    categoryLabel: 'Rooftop Cafe & Mocktails',
    location: 'Tarapur MIDC Main Road',
    area: 'Tarapur MIDC',
    rating: 4.9,
    reviewsCount: 420,
    priceForTwo: '₹600 for two',
    priceLevel: '₹₹',
    discount: '10% Off + 25% Off Bill',
    speciality: 'Wood-Fired Pizza, Sizzlers & DJ Nights',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '7769947217',
    whatsapp: '7769947217',
    timings: '03:00 PM – 12:00 AM',
    isPureVeg: false,
    isFeatured: true,
    features: ['Rooftop Seating', 'Live DJ & Music', 'Mocktail Bar', 'Birthday Celebrations', 'AC Lounge'],
    popularDishes: [
      { name: 'Exotic Farmhouse Wood-Fired Pizza', price: '₹320', isVeg: true, desc: 'Thin crust with bell peppers, olives & mozzarella' },
      { name: 'Blue Lagoon Fizzy Mocktail', price: '₹150', isVeg: true, desc: 'Refreshing curaçao with mint and sparkling soda' },
      { name: 'Chicken Tikka Sizzler', price: '₹340', isVeg: false, desc: 'Charcoal grilled tikka on sizzling rice bed' }
    ]
  },
  {
    id: 'food-5',
    name: 'Konkan Kinara Seafood & Agri Dhabha',
    category: 'Seafood',
    categoryLabel: 'Agri-Koli Seafood & Non-Veg',
    location: 'Navapur Beach Road, Boisar',
    area: 'Navapur Road',
    rating: 4.8,
    reviewsCount: 620,
    priceForTwo: '₹650 for two',
    priceLevel: '₹₹',
    discount: 'Fresh Catch Daily Deals',
    speciality: 'Surmai Tawa Fry, Prawns Koliwada & Crab Masala',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9307294733',
    whatsapp: '9307294733',
    timings: '11:30 AM – 11:30 PM',
    isPureVeg: false,
    isFeatured: true,
    features: ['Fresh Beach Fish', 'Authentic Agri Masala', 'Family Cabins', 'Open Air Garden', 'Ample Parking'],
    popularDishes: [
      { name: 'King Surmai Fry (Tawa)', price: '₹380', isVeg: false, desc: 'Marinated in fiery red kokum masala, rava crusted' },
      { name: 'Prawns Koliwada Platter', price: '₹320', isVeg: false, desc: 'Crispy fried local tiger prawns with mint chutney' },
      { name: 'Desi Koli Chicken Handi (Full)', price: '₹480', isVeg: false, desc: 'Cooked in clay pot with roasted coconut gravy' },
      { name: 'Bhakri (Rice / Jowar)', price: '₹25', isVeg: true, desc: 'Hot traditional village-style bhakri' }
    ]
  },
  {
    id: 'food-6',
    name: 'Hotel Rajdhani Family Restaurant',
    category: 'Family Dining',
    categoryLabel: 'North Indian & Mughlai',
    location: 'Near Boisar Railway Station (East)',
    area: 'Station Road',
    rating: 4.5,
    reviewsCount: 380,
    priceForTwo: '₹500 for two',
    priceLevel: '₹₹',
    discount: '10% Off Family Dining',
    speciality: 'Butter Chicken, Paneer Tikka & Dum Biryani',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9123456780',
    whatsapp: '9123456780',
    timings: '11:00 AM – 11:00 PM',
    isPureVeg: false,
    features: ['AC Family Hall', 'North Indian Gravies', 'Fast Service', 'Party Orders'],
    popularDishes: [
      { name: 'Murgh Dum Handi Biryani', price: '₹260', isVeg: false, desc: 'Slow cooked aromatic basmati rice with tender spiced chicken' },
      { name: 'Paneer Butter Masala', price: '₹210', isVeg: true, desc: 'Rich cashew and butter tomato gravy' },
      { name: 'Garlic Butter Naan', price: '₹55', isVeg: true, desc: 'Tandoor baked with fresh garlic glaze' }
    ]
  },
  {
    id: 'food-7',
    name: 'Burger Craft & Shawarma Hub',
    category: 'Fast Food',
    categoryLabel: 'Shawarma, Rolls & Fast Food',
    location: 'Ostwal Empire Food Street',
    area: 'Ostwal Empire',
    rating: 4.7,
    reviewsCount: 410,
    priceForTwo: '₹250 for two',
    priceLevel: '₹',
    discount: 'Buy 2 Shawarmas Get 1 Drink Free',
    speciality: 'Special Open Shawarma & Crispy Burgers',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9820123456',
    whatsapp: '9820123456',
    timings: '04:00 PM – 11:30 PM',
    isPureVeg: false,
    features: ['Quick Bites', 'Evening Snacks', 'Takeaway', 'Budget Friendly'],
    popularDishes: [
      { name: 'Special Mayo Chicken Shawarma', price: '₹90', isVeg: false, desc: 'Grilled chicken in soft rumali roti with garlic dip' },
      { name: 'Paneer Makhani Kathi Roll', price: '₹80', isVeg: true, desc: 'Spiced paneer cubes rolled with crunchy onions' },
      { name: 'Crispy Veg Double Patty Burger', price: '₹99', isVeg: true, desc: 'Served with signature burger sauce' }
    ]
  },
  {
    id: 'food-8',
    name: 'Sweet Tooth Bakery & Falooda House',
    category: 'Desserts & Bakery',
    categoryLabel: 'Pastries, Waffles & Falooda',
    location: 'Boisar West Market',
    area: 'Boisar West',
    rating: 4.8,
    reviewsCount: 290,
    priceForTwo: '₹200 for two',
    priceLevel: '₹',
    discount: 'Flat 15% Off Cakes',
    speciality: 'Royal Kesar Pista Falooda & Belgian Waffles',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9307294733',
    whatsapp: '9307294733',
    timings: '10:00 AM – 11:00 PM',
    isPureVeg: true,
    features: ['100% Eggless Cakes', 'Ice Cream Sundaes', 'Birthday Pastries', 'Custom Cake Pre-orders'],
    popularDishes: [
      { name: 'Royal Special Dry Fruit Falooda', price: '₹130', isVeg: true, desc: 'Thick rabdi, rose syrup, basil seeds, kulfi & dry fruits' },
      { name: 'Nutella Overload Belgian Waffle', price: '₹140', isVeg: true, desc: 'Crispy hot waffle smothered with pure Nutella' },
      { name: 'Dutch Chocolate Truffle Pastry', price: '₹75', isVeg: true, desc: 'Dark chocolate ganache layer cake' }
    ]
  },
  {
    id: 'food-9',
    name: 'Highway Treat Dhaba & Family Garden',
    category: 'Late Night & Dhaba',
    categoryLabel: 'Highway Dhaba & Family Garden',
    location: 'Palghar-Boisar Highway Road',
    area: 'Kelwa Road',
    rating: 4.6,
    reviewsCount: 480,
    priceForTwo: '₹450 for two',
    priceLevel: '₹₹',
    discount: 'Late Night Open till 1:00 AM',
    speciality: 'Sev Bhaji, Dal Tadka, Kadai Paneer & Butter Roti',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'
    ],
    phone: '9823456789',
    whatsapp: '9823456789',
    timings: '12:00 PM – 01:00 AM (Late Night)',
    isPureVeg: false,
    features: ['Open Garden Seating', 'Late Night Food', 'Khatla/Charpai Seating', 'Live Tandoor', 'Family Cabins'],
    popularDishes: [
      { name: 'Special Khandeshi Sev Bhaji', price: '₹160', isVeg: true, desc: 'Fiery red rassa gravy with crunchy sev' },
      { name: 'Dhaba Style Dal Fry Jeera Rice', price: '₹190', isVeg: true, desc: 'Desi ghee tempered yellow dal' },
      { name: 'Chicken Kolhapuri Tawa', price: '₹260', isVeg: false, desc: 'Extra spicy traditional Maharashtrian curry' }
    ]
  }
];
