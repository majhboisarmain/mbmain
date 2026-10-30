/**
 * Centralized Category Configuration & Canonical Normalization for Majh Boisar
 * Clean, Single-Category Names without '&' (Zero duplicate sub-categories)
 */

export const EXPLORE_CATEGORIES = [
  "Protein",
  "Loans",
  "Gyms",
  "Eye Opticians",
  "Water Purifier",
  "Schools",
  "Digital Printing",
  "Dance Classes",
  "Music Classes",
  "Salons",
  "Clothing",
  "Photographers",
  "Travel Agencies",
  "Medical Stores",
  "CA Consultants",
  "Doctors",
  "Hospitals",
  "Dentists",
  "Pathology Labs",
  "Restaurants",
  "Cafes",
  "Bakeries",
  "Street Food",
  "Grocery",
  "Real Estate",
  "Hotels",
  "Resorts",
  "Hostels",
  "Electricians",
  "Plumbers",
  "Carpenters",
  "Painters",
  "AC Service",
  "Pest Control",
  "Yoga Classes",
  "Coaching Classes",
  "Jewellery",
  "Footwear",
  "Electronics",
  "Mobile Shops",
  "Computer Repair",
  "Hardware",
  "Interior Designers",
  "Fabrication",
  "Auto Garages",
  "Car Rentals",
  "Packers Movers",
  "Event Organisers",
  "Catering",
  "Digital Marketing",
  "Insurance",
  "Lawyers",
  "Pet Clinics",
  "Baby Care",
  "Spa Wellness",
  "Dairy Products",
  "Meat Poultry",
  "Fruits Vegetables"
];

// Normalized Slug to Official Title Mapping (Canonical single names - no duplicates)
export const CATEGORY_SLUG_MAP: Record<string, string> = {
  // Protein (Single canonical category)
  'protein': 'Protein',
  'protein-shop': 'Protein',
  'protein-shops': 'Protein',
  'protein-supplements': 'Protein',
  'nutrition': 'Protein',
  'nutrition-supplements': 'Protein',
  'whey-protein': 'Protein',

  // Loans (Single canonical category - all finance and loan services unified)
  'loans': 'Loans',
  'loan': 'Loans',
  'loans-finance': 'Loans',
  'loan-finance': 'Loans',
  'loans-and-finance': 'Loans',
  'loan-and-finance': 'Loans',
  'loan-consultants': 'Loans',
  'loan-consultants-finance': 'Loans',
  'business-loan-consultants': 'Loans',
  'finance': 'Loans',
  'finance-companies': 'Loans',
  'financial-services': 'Loans',
  'financial-advisor': 'Loans',
  'financial-advisors': 'Loans',
  'financial-consultants': 'Loans',
  'gold-loan': 'Loans',
  'gold-loans': 'Loans',
  'home-loan': 'Loans',
  'home-loans': 'Loans',
  'personal-loan': 'Loans',
  'personal-loans': 'Loans',
  'business-loan': 'Loans',
  'business-loans': 'Loans',
  'vehicle-loan': 'Loans',
  'vehicle-loans': 'Loans',
  'education-loan': 'Loans',
  'education-loans': 'Loans',
  'microfinance': 'Loans',

  // Footwear (Single canonical category - all shoe and footwear stores unified)
  'footwear': 'Footwear',
  'footwear-stores': 'Footwear',
  'footwear-store': 'Footwear',
  'footwear-shops': 'Footwear',
  'footwear-shop': 'Footwear',
  'wholesale-footwear': 'Footwear',
  'shoes': 'Footwear',
  'shoe': 'Footwear',
  'shoe-stores': 'Footwear',
  'shoe-store': 'Footwear',
  'shoe-shops': 'Footwear',
  'shoe-shop': 'Footwear',
  'shoe-repair': 'Footwear',
  'chappal': 'Footwear',
  'sandals': 'Footwear',

  // Furniture (Single canonical category - all furniture stores unified)
  'furniture': 'Furniture',
  'furnitures': 'Furniture',
  'furniture-stores': 'Furniture',
  'furniture-store': 'Furniture',
  'furniture-shops': 'Furniture',
  'furniture-shop': 'Furniture',
  'furniture-dealers': 'Furniture',
  'furniture-dealer': 'Furniture',
  'furniture-living': 'Furniture',
  'furniture-and-living': 'Furniture',
  'office-furniture': 'Furniture',
  'office-furniture-stores': 'Furniture',
  'wholesale-furniture': 'Furniture',

  // Water Purifier & RO Service (Single canonical category)
  'water-purifier': 'Water Purifier',
  'water-purifiers': 'Water Purifier',
  'water-purifier-dealers': 'Water Purifier',
  'water-purifier-dealer': 'Water Purifier',
  'water-purifier-service': 'Water Purifier',
  'water-purifier-ro-service': 'Water Purifier',
  'ro-service': 'Water Purifier',
  'ro-services': 'Water Purifier',
  'ro-filter': 'Water Purifier',
  'ro-filter-service': 'Water Purifier',
  'ro-water-purifier': 'Water Purifier',
  'ro': 'Water Purifier',
  'aquaguard': 'Water Purifier',

  // Gyms & Fitness (Single canonical category)
  'gyms': 'Gyms',
  'gym': 'Gyms',
  'gyms-fitness-centers': 'Gyms',
  'gyms-and-fitness-centers': 'Gyms',
  'fitness-centers': 'Gyms',
  'fitness-center': 'Gyms',
  'fitness': 'Gyms',
  'workout': 'Gyms',

  // Salons & Beauty (Single canonical category)
  'salons': 'Salons',
  'salon': 'Salons',
  'hair-salons': 'Salons',
  'hair-salon': 'Salons',
  'salon-beauty-parlour': 'Salons',
  'beauty-parlours': 'Salons',
  'beauty-parlour': 'Salons',
  'beauty-parlor': 'Salons',
  'beauty-salons': 'Salons',
  'beauty-salon': 'Salons',
  'beauty-parlours-salons': 'Salons',

  // Clothing & Fashion (Single canonical category)
  'clothing': 'Clothing',
  'clothing-stores': 'Clothing',
  'clothing-store': 'Clothing',
  'clothing-fashion': 'Clothing',
  'garments': 'Clothing',
  'garment-stores': 'Clothing',
  'garment-store': 'Clothing',
  'garment-shops': 'Clothing',
  'ethnic-wear-stores': 'Clothing',
  'bridal-wear-designers': 'Clothing',
  'wholesale-garments': 'Clothing',
  'fashion': 'Clothing',
  'fashion-stores': 'Clothing',
  'fashion-boutiques': 'Clothing',

  // Photographers & Videographers (Single canonical category)
  'photographers': 'Photographers',
  'photography': 'Photographers',
  'photographers-videographers': 'Photographers',
  'videographers': 'Photographers',

  // Medical Stores & Pharmacies (Single canonical category)
  'medical-stores': 'Medical Stores',
  'medical-store': 'Medical Stores',
  'medical-stores-pharmacy': 'Medical Stores',
  'pharmacy': 'Medical Stores',
  'pharmacies': 'Medical Stores',
  'online-pharmacy': 'Medical Stores',
  'chemists': 'Medical Stores',
  'chemist': 'Medical Stores',
  'chemist-shops': 'Medical Stores',

  // CA & Tax Consultants (Single canonical category)
  'ca': 'CA Consultants',
  'ca-consultants': 'CA Consultants',
  'ca-tax-consultants': 'CA Consultants',
  'tax-consultants': 'CA Consultants',
  'chartered-accountants': 'CA Consultants',

  // Doctors & Clinics
  'doctors': 'Doctors',
  'doctor': 'Doctors',
  'clinics': 'Doctors',
  'clinic': 'Doctors',
  'doctors-specialists': 'Doctors',
  'skin-clinics': 'Doctors',
  'ayurvedic-doctors': 'Doctors',
  'homeopathic-doctors': 'Doctors',

  // Hospitals
  'hospitals': 'Hospitals',
  'hospital': 'Hospitals',
  'hospitals-emergency': 'Hospitals',
  'emergency-hospitals': 'Hospitals',
  'eye-hospitals': 'Hospitals',
  'cancer-hospitals': 'Hospitals',

  // Dentists
  'dentists': 'Dentists',
  'dentist': 'Dentists',
  'dentists-dental-clinics': 'Dentists',
  'dental-clinics': 'Dentists',
  'dental-labs': 'Dentists',

  // Pathology Labs
  'pathology': 'Pathology Labs',
  'pathology-labs': 'Pathology Labs',
  'pathology-diagnostic-labs': 'Pathology Labs',
  'diagnostic-labs': 'Pathology Labs',
  'diagnostic-centers': 'Pathology Labs',

  // Eye Opticians
  'eye-opticians': 'Eye Opticians',
  'opticians': 'Eye Opticians',
  'optician': 'Eye Opticians',
  'optical-stores': 'Eye Opticians',
  'optical-store': 'Eye Opticians',
  'optical-shops': 'Eye Opticians',
  'eye-care-opticians': 'Eye Opticians',
  'eye-care': 'Eye Opticians',

  // Schools & Education
  'schools': 'Schools',
  'school': 'Schools',
  'schools-colleges': 'Schools',
  'colleges': 'Schools',
  'college': 'Schools',
  'play-schools': 'Schools',
  'driving-schools': 'Schools',

  // Jobs
  'jobs': 'Jobs',
  'jobs-placement': 'Jobs',
  'jobs-and-placement': 'Jobs',
  'placement': 'Jobs',
  'placements': 'Jobs',
  'recruitment': 'Jobs',
  'job-consultancy': 'Jobs',
  'job-consultants': 'Jobs',

  // Digital Printing
  'digital-printing': 'Digital Printing',
  'digital-printing-arts': 'Digital Printing',
  'radium-art': 'Digital Printing',
  'flex-printing': 'Digital Printing',
  'banner-printing': 'Digital Printing',
  'printing-press': 'Digital Printing',

  // Dance & Music
  'dance-classes': 'Dance Classes',
  'dance': 'Dance Classes',
  'dance-class': 'Dance Classes',
  'dance-academy': 'Dance Classes',
  'dance-troupes': 'Dance Classes',
  'dance-music-classes': 'Dance Classes',
  'music-classes': 'Music Classes',
  'music': 'Music Classes',
  'music-class': 'Music Classes',
  'music-academy': 'Music Classes',
  'musical-instrument-stores': 'Music Classes',

  // Food & Dining
  'restaurants': 'Restaurants',
  'restaurant': 'Restaurants',
  'restaurants-dining': 'Restaurants',
  'food': 'Restaurants',
  'cafes': 'Cafes',
  'cafe': 'Cafes',
  'bakeries': 'Bakeries',
  'bakery': 'Bakeries',
  'cake-shops': 'Bakeries',
  'cake-shop': 'Bakeries',
  'street-food': 'Street Food',
  'street-food-snacks': 'Street Food',

  // Grocery
  'grocery': 'Grocery',
  'grocery-stores': 'Grocery',
  'grocery-supermarkets': 'Grocery',
  'supermarkets': 'Grocery',
  'supermarket': 'Grocery',
  'kirana-stores': 'Grocery',
  'kirana': 'Grocery',

  // Real Estate & Stays
  'real-estate': 'Real Estate',
  'real-estate-properties': 'Real Estate',
  'real-estate-agents': 'Real Estate',
  'properties': 'Real Estate',
  'property-dealers': 'Real Estate',
  'hotels': 'Hotels',
  'hotel': 'Hotels',
  'hotels-lodging': 'Hotels',
  'resorts': 'Resorts',
  'resort': 'Resorts',
  'resorts-villas': 'Resorts',
  'hostels': 'Hostels',
  'hostel': 'Hostels',
  'hostels-pg': 'Hostels',
  'pg-hostels': 'Hostels',
  'pg': 'Hostels',

  // Home Services
  'electricians': 'Electricians',
  'electrician': 'Electricians',
  'electricians-wiring': 'Electricians',
  'plumbers': 'Plumbers',
  'plumber': 'Plumbers',
  'plumbers-sanitation': 'Plumbers',
  'carpenters': 'Carpenters',
  'carpenter': 'Carpenters',
  'carpenters-furniture': 'Carpenters',
  'painters': 'Painters',
  'painter': 'Painters',
  'painters-waterproofing': 'Painters',
  'ac-service': 'AC Service',
  'ac-repair': 'AC Service',
  'ac-service-cooling': 'AC Service',
  'pest-control': 'Pest Control',
  'pest-control-services': 'Pest Control',

  // Others
  'yoga': 'Yoga Classes',
  'yoga-classes': 'Yoga Classes',
  'coaching': 'Coaching Classes',
  'coaching-classes': 'Coaching Classes',
  'tuition-classes': 'Coaching Classes',
  'jewellery': 'Jewellery',
  'jewelry': 'Jewellery',
  'jewellery-shops': 'Jewellery',
  'electronics': 'Electronics',
  'mobile-shops': 'Mobile Shops',
  'mobile-stores': 'Mobile Shops',
  'mobile-repair': 'Mobile Shops',
  'computer-repair': 'Computer Repair',
  'laptop-repair': 'Computer Repair',
  'hardware': 'Hardware',
  'interior-designers': 'Interior Designers',
  'fabrication': 'Fabrication',
  'automobile-garages': 'Auto Garages',
  'auto-garages': 'Auto Garages',
  'garages': 'Auto Garages',
  'garage': 'Auto Garages',
  'car-rentals': 'Car Rentals',
  'car-rental': 'Car Rentals',
  'packers-movers': 'Packers Movers',
  'event-organisers': 'Event Organisers',
  'catering': 'Catering',
  'digital-marketing': 'Digital Marketing',
  'insurance': 'Insurance',
  'lawyers': 'Lawyers',
  'pet-clinics': 'Pet Clinics',
  'baby-care': 'Baby Care',
  'spa': 'Spa Wellness',
  'spa-wellness': 'Spa Wellness',
  'dairy': 'Dairy Products',
  'dairy-products': 'Dairy Products',
  'meat-poultry': 'Meat Poultry',
  'fruits-vegetables': 'Fruits Vegetables',
  'accounting-software-dealers': 'Accounting Software Dealers',
  'accounting-software': 'Accounting Software Dealers',
  'software-dealers': 'Accounting Software Dealers'
};

/**
 * Generates a clean URL slug for a category name
 */
export function getCategorySlug(categoryName: string): string {
  if (!categoryName) return 'all';
  return categoryName
    .toLowerCase()
    .trim()
    .replace(/&/g, '')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Returns the official display title for any category slug or name.
 * Strictly guarantees that related industry sub-categories are unified into a single canonical category.
 */
export function formatCategoryTitle(raw: string): string {
  if (!raw) return 'Local Businesses';
  const clean = raw.trim();
  const slug = getCategorySlug(clean);
  if (CATEGORY_SLUG_MAP[slug]) {
    return CATEGORY_SLUG_MAP[slug];
  }

  const withoutAnd = slug.replace(/-and-/g, '-');
  if (CATEGORY_SLUG_MAP[withoutAnd]) {
    return CATEGORY_SLUG_MAP[withoutAnd];
  }

  // Smart pattern normalization: guarantee single canonical categories
  if ((slug.includes('loan') || slug.includes('finance')) && !slug.includes('software')) {
    return 'Loans';
  }
  if (slug.includes('footwear') || slug.includes('shoe') || slug.includes('chappal')) {
    return 'Footwear';
  }
  if (slug.includes('furniture')) {
    return 'Furniture';
  }
  if (slug.includes('purifier') || slug.includes('ro-service') || slug.includes('ro-filter') || slug === 'ro') {
    return 'Water Purifier';
  }
  if (slug.includes('gym') || slug.includes('fitness')) {
    return 'Gyms';
  }
  if (slug.includes('salon') || slug.includes('beauty-parlour') || slug.includes('beauty-parlor')) {
    return 'Salons';
  }
  if (slug.includes('garment') || (slug.includes('clothing') || slug.includes('apparel'))) {
    return 'Clothing';
  }
  if (slug.includes('optical') || slug.includes('optician')) {
    return 'Eye Opticians';
  }
  if (slug.includes('pharmacy') || slug.includes('medical-store') || slug.includes('chemist')) {
    return 'Medical Stores';
  }
  if (slug.includes('dance')) {
    return 'Dance Classes';
  }
  if (slug.includes('music')) {
    return 'Music Classes';
  }
  if (slug.includes('placement') || (slug.includes('job') && !slug.includes('card'))) {
    return 'Jobs';
  }
  if (slug.includes('protein')) {
    return 'Protein';
  }
  if (slug.includes('printing') || slug.includes('radium')) {
    return 'Digital Printing';
  }
  if (slug.includes('school') || slug.includes('college')) {
    return 'Schools';
  }
  if (slug.includes('dentist') || slug.includes('dental')) {
    return 'Dentists';
  }
  if (slug.includes('hospital')) {
    return 'Hospitals';
  }
  if (slug.includes('pathology') || slug.includes('diagnostic')) {
    return 'Pathology Labs';
  }
  if (slug.includes('bakery') || slug.includes('cake')) {
    return 'Bakeries';
  }
  if (slug.includes('grocery') || slug.includes('supermarket') || slug.includes('kirana')) {
    return 'Grocery';
  }
  if (slug.includes('real-estate') || slug.includes('property') || slug.includes('builder')) {
    return 'Real Estate';
  }
  if (slug.includes('hostel') || slug.includes('pg')) {
    return 'Hostels';
  }
  if (slug.includes('electrician')) {
    return 'Electricians';
  }
  if (slug.includes('plumber')) {
    return 'Plumbers';
  }
  if (slug.includes('carpenter')) {
    return 'Carpenters';
  }
  if (slug.includes('painter')) {
    return 'Painters';
  }
  if (slug.includes('pest-control')) {
    return 'Pest Control';
  }
  if (slug.includes('jewel')) {
    return 'Jewellery';
  }
  if (slug.includes('coaching') || slug.includes('tuition')) {
    return 'Coaching Classes';
  }
  if (slug.includes('yoga')) {
    return 'Yoga Classes';
  }
  if (slug.includes('accounting') || slug.includes('software-dealer')) {
    return 'Accounting Software Dealers';
  }

  return clean
    .replace(/&/g, '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * High-precision category synonyms for targeted search without bleed across categories.
 */
export const CATEGORY_SEARCH_SYNONYMS: Record<string, string[]> = {
  // Protein (combines Protein, Protein Shop, Protein Supplements)
  'protein': ['protein', 'protein shop', 'protein supplements', 'nutrition', 'whey protein', 'supplements'],
  'protein-shop': ['protein', 'protein shop', 'protein supplements', 'nutrition'],
  'protein-supplements': ['protein', 'protein shop', 'protein supplements', 'nutrition'],

  // Loans (combines Loans, Loan Consultants, Finance, Loans & Finance)
  'loans': ['loan', 'loans', 'loan consultant', 'loan consultants', 'finance', 'financial', 'loans finance', 'loans & finance', 'financial advisor', 'financial services', 'finance companies', 'gold loan', 'home loan', 'personal loan', 'business loan', 'vehicle loan', 'swami samarth', 'grand capital', 'kirti enterprises'],
  'loan': ['loan', 'loans', 'loan consultant', 'finance', 'financial'],
  'loans-finance': ['loan', 'loans', 'loan consultant', 'finance', 'financial', 'loans finance', 'loans & finance'],
  'loan-consultants': ['loan', 'loans', 'loan consultant', 'finance'],
  'finance': ['loan', 'loans', 'loan consultant', 'finance', 'financial'],

  // Gyms & Fitness (combines Gyms, Fitness Centers)
  'gyms': ['gym', 'gyms', 'fitness', 'fitness center', 'fitness centers', 'workout', 'weight training', 'crossfit', 'muscle factory'],
  'fitness-centers': ['gym', 'gyms', 'fitness', 'fitness center', 'fitness centers'],

  // Salons & Beauty (combines Salons, Beauty Parlours)
  'salons': ['salon', 'salons', 'beauty parlour', 'hair salon', 'haircut', 'beauty parlours', 'beauty parlour & salon'],
  'beauty-parlours': ['beauty parlour', 'salon', 'haircut'],

  // Clothing
  'clothing': ['clothing', 'fashion', 'garment', 'garments', 'garment stores', 'apparel', 'boutique', 'menswear', 'womenswear', 'ethnic wear', 'bridal wear'],
  'fashion': ['clothing', 'fashion', 'boutique'],

  // Medical Stores & Pharmacies
  'medical-stores': ['medical store', 'medical stores', 'pharmacy', 'pharmacies', 'chemist', 'medicine', 'online pharmacy'],
  'pharmacy': ['medical store', 'pharmacy', 'chemist'],

  // Eye Opticians
  'eye-opticians': ['eye opticians', 'optician', 'opticians', 'optical', 'optical store', 'spectacles', 'care eyes'],

  // Water Purifier (combines Water Purifier, RO Service, Filter)
  'water-purifier': ['water purifier', 'water purifiers', 'ro service', 'ro services', 'ro filter', 'ro filter service', 'lavany aqua', 'filter service', 'sales in boisar', 'aquaguard', 'kent ro'],
  'ro-service': ['water purifier', 'ro service', 'ro services', 'ro filter', 'lavany aqua'],

  // Footwear (combines Footwear, Footwear Stores, Shoes)
  'footwear': ['footwear', 'footwear store', 'footwear stores', 'footwear shop', 'footwear shops', 'shoes', 'shoe store', 'shoe stores', 'sandals', 'slippers', 'chitralaya footwear'],
  'footwear-stores': ['footwear', 'footwear store', 'footwear stores', 'shoes', 'chitralaya footwear'],

  // Furniture (combines Furniture, Furniture Stores, Wooden Furniture)
  'furniture': ['furniture', 'furniture store', 'furniture stores', 'furniture shop', 'sofa', 'wooden furniture', 'bed', 'wardrobe', 'dining table'],
  'furniture-stores': ['furniture', 'furniture store', 'furniture stores', 'sofa', 'wooden furniture', 'bed', 'wardrobe', 'dining table'],

  // Schools
  'schools': ['school', 'schools', 'vidyalaya', 'english medium school', 'ctes', 'colleges', 'college'],

  // Digital Printing
  'digital-printing': ['digital printing', 'radium art', 'banner printing', 'flex printing', 'boisar radium art'],

  // Jobs
  'jobs': ['jobs', 'placement', 'recruitment', 'job consultancy', 'jobs & placement', 'musclefactoryhub', 'placement services'],

  // Dance & Music
  'dance-classes': ['dance', 'dance class', 'dance classes', 'dance academy', 'dance studio'],
  'dance': ['dance', 'dance class', 'dance classes', 'dance academy'],
  'music-classes': ['music', 'music class', 'music classes', 'music academy', 'singing class', 'guitar class'],

  // Healthcare
  'doctors': ['doctor', 'clinic', 'physician', 'specialist doctor'],
  'hospitals': ['hospital', 'nursing home', 'emergency hospital'],
  'dentists': ['dentist', 'dental clinic'],
  'pathology-labs': ['pathology', 'blood test', 'diagnostic lab'],

  // Food
  'restaurants': ['restaurant', 'dining', 'family restaurant', 'pure veg', 'non veg'],
  'cafes': ['cafe', 'coffee', 'pasta'],
  'bakeries': ['bakery', 'cake shop'],
  'street-food': ['street food', 'chaat', 'fast food'],
  'grocery': ['grocery', 'kirana', 'general store', 'supermarket'],

  // Stays & Services
  'real-estate': ['real estate', 'flats', 'properties', 'builder', 'broker'],
  'hotels': ['hotel', 'room booking', 'lodge'],
  'resorts': ['resort', 'villa'],
  'hostels': ['hostel', 'pg', 'paying guest'],
  'electricians': ['electrician', 'wiring', 'electrical repair'],
  'plumbers': ['plumber', 'drainage', 'pipe fitting'],
  'carpenters': ['carpenter', 'furniture repair', 'woodwork'],
  'painters': ['painter', 'waterproofing', 'wall painting'],
  'ac-service': ['ac service', 'ac repair'],
  'pest-control': ['pest control', 'termite control'],
  'yoga-classes': ['yoga', 'yoga class', 'meditation'],
  'coaching-classes': ['coaching', 'tuition', 'coaching classes'],
  'jewellery': ['jewellery', 'jewelry', 'gold'],
  'electronics': ['electronics', 'home appliances'],
  'mobile-shops': ['mobile shop', 'smartphones', 'mobile repair'],
  'computer-repair': ['computer repair', 'laptop repair'],
  'hardware': ['hardware', 'building material'],
  'interior-designers': ['interior designer', 'home decor'],
  'fabrication': ['fabrication', 'aluminium fabrication'],
  'automobile-garages': ['garage', 'car repair', 'bike repair'],
  'car-rentals': ['car rental', 'bike rental', 'taxi service'],
  'packers-movers': ['packers movers', 'shifting service'],
  'event-organisers': ['event organiser', 'event decorator'],
  'catering': ['catering', 'tiffin service'],
  'digital-marketing': ['digital marketing', 'web development', 'seo'],
  'insurance': ['insurance', 'lic', 'life insurance'],
  'lawyers': ['lawyer', 'advocate', 'legal advisor'],
  'pet-clinics': ['pet clinic', 'veterinary'],
  'baby-care': ['baby care', 'pediatric'],
  'spa-wellness': ['spa', 'massage', 'wellness center'],
  'accounting-software-dealers': ['accounting software', 'software dealers', 'tally', 'billing software', 'gst software', 'accounting', 'vyapaari', 'vyapaaridesk']
};

/**
 * Returns broad search keywords for a category to capture variants in the database.
 */
export function getCategorySearchTerms(rawSlugOrTitle: string): string[] {
  const slug = getCategorySlug(rawSlugOrTitle);
  const withoutAnd = slug.replace(/-and-/g, '-');
  
  const custom = CATEGORY_SEARCH_SYNONYMS[slug] || CATEGORY_SEARCH_SYNONYMS[withoutAnd];
  if (custom && custom.length > 0) {
    return Array.from(new Set([
      slug.replace(/-/g, ' '),
      withoutAnd.replace(/-/g, ' '),
      ...custom
    ]));
  }

  const words = slug
    .split('-')
    .filter(w => !['and', 'or', 'in', 'the', 'of', 'services', 'service', 'centers', 'center', 'shops', 'shop', 'care', 'classes', 'agencies', 'tours', 'consultants'].includes(w))
    .filter(w => w.length > 2);

  return Array.from(new Set([
    slug.replace(/-/g, ' '),
    ...words
  ]));
}

/**
 * Builds Prisma where filter conditions for a category page.
 * Strictly checks category & subcategory, plus distinctive name conditions.
 * Enforces category isolation so unrelated categories never cross.
 */
export function buildCategoryPrismaFilter(categorySlugOrTitle: string, selectedArea?: string) {
  const title = formatCategoryTitle(categorySlugOrTitle);
  const terms = getCategorySearchTerms(categorySlugOrTitle);

  // Exact or containment conditions strictly on category and subcategory
  const categoryConditions: any[] = [
    { category: { equals: title, mode: 'insensitive' } },
    { category: { contains: title, mode: 'insensitive' } },
    { subcategory: { contains: title, mode: 'insensitive' } },
  ];

  terms.forEach(term => {
    if (!term || term.length < 3) return;
    categoryConditions.push({ category: { contains: term, mode: 'insensitive' } });
    categoryConditions.push({ subcategory: { contains: term, mode: 'insensitive' } });
  });

  const genericExclusions = [
    'centers', 'services', 'stores', 'shops', 'market', 'classes', 'agencies', 
    'consultants', 'repairs', 'repair', 'care', 'tours', 'point', 'hub', 'dealers', 'class', 'agency', 'store', 'shop'
  ];
  const distinctTerms = terms.filter(t => t.length >= 4 && !genericExclusions.includes(t.toLowerCase()));
  const nameConditions = distinctTerms.map(t => ({
    name: { contains: t, mode: 'insensitive' }
  }));

  const orConditions: any[] = [
    ...categoryConditions,
    ...nameConditions
  ];

  const whereClause: any = {
    verified: true,
    OR: orConditions
  };

  // CATEGORY ISOLATION RULES
  const lowerSlug = getCategorySlug(categorySlugOrTitle);
  if (lowerSlug.includes('dance') || lowerSlug.includes('music')) {
    whereClause.NOT = [
      { category: { in: ['Loans', 'Loan Consultants', 'Finance', 'Insurance', 'Real Estate', 'Properties', 'Hardware', 'Protein', 'Protein Shop', 'Water Purifier', 'RO Service'] } }
    ];
  } else if (lowerSlug.includes('loan') || lowerSlug.includes('finance')) {
    whereClause.NOT = [
      { category: { in: ['Dance Classes', 'Music Classes', 'Gyms', 'Salons', 'Restaurants', 'Protein', 'Protein Shop', 'Water Purifier', 'RO Service', 'Digital Printing', 'Schools', 'Footwear', 'Eye Opticians'] } }
    ];
  } else if (lowerSlug.includes('protein')) {
    whereClause.NOT = [
      { category: { in: ['Loans', 'Loan Consultants', 'Dance Classes', 'Music Classes', 'Water Purifier', 'RO Service'] } }
    ];
  } else if (lowerSlug.includes('water') || lowerSlug.includes('purifier') || lowerSlug.includes('ro')) {
    whereClause.NOT = [
      { category: { in: ['Loans', 'Loan Consultants', 'Finance', 'Dance Classes', 'Music Classes', 'Gyms', 'Salons', 'Restaurants', 'Protein', 'Protein Shop'] } }
    ];
  } else if (lowerSlug.includes('furniture')) {
    whereClause.NOT = [
      { category: { in: ['Footwear', 'Footwear Stores', 'Shoes', 'Shoe Stores', 'Loans', 'Loan Consultants', 'Finance', 'Dance Classes', 'Music Classes', 'Gyms', 'Salons', 'Restaurants', 'Protein', 'Protein Shop', 'Water Purifier', 'Schools'] } }
    ];
  } else if (lowerSlug.includes('footwear') || lowerSlug.includes('shoe')) {
    whereClause.NOT = [
      { category: { in: ['Furniture', 'Furniture Stores', 'Carpenters', 'Loans', 'Finance', 'Dance Classes', 'Music Classes', 'Gyms', 'Salons', 'Restaurants'] } }
    ];
  }

  if (selectedArea && selectedArea !== 'All') {
    whereClause.AND = [
      {
        OR: [
          { location: { contains: selectedArea, mode: 'insensitive' } },
          { address: { contains: selectedArea, mode: 'insensitive' } }
        ]
      }
    ];
  }

  return whereClause;
}
