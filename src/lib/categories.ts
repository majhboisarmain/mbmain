/**
 * Centralized Category Configuration & Slug Normalization for Majh Boisar
 * Synchronized with Home "Explore Categories" (all 59 categories)
 */

export const EXPLORE_CATEGORIES = [
  "Protein & Supplements",
  "Gyms & Fitness Centers",
  "Pathology & Diagnostic Labs",
  "Salon & Beauty Parlour",
  "Clothing & Fashion",
  "Photographers & Videographers",
  "Dance & Music Classes",
  "Travel Agencies & Tours",
  "Medical Stores & Pharmacy",
  "CA & Tax Consultants",
  "Doctors & Specialists",
  "Baby & Mother Care",
  "Eye Care & Opticians",
  "Restaurants & Dining",
  "Cafes & Bakeries",
  "Street Food & Snacks",
  "Dentists & Dental Clinics",
  "Grocery & Supermarkets",
  "Dairy & Milk Products",
  "Meat & Poultry",
  "Fruits & Vegetables",
  "Real Estate & Properties",
  "Hotels & Lodging",
  "Resorts & Villas",
  "PG & Hostels",
  "Home Services & Repairs",
  "Electricians & Wiring",
  "Plumbers & Sanitation",
  "Carpenters & Furniture",
  "Painters & Waterproofing",
  "AC Service & Cooling",
  "Pest Control Services",
  "Beauty Parlours & Salons",
  "Spa & Wellness",
  "Yoga & Martial Arts",
  "Schools & Colleges",
  "Coaching & Tuitions",
  "Jewellery & Ornaments",
  "Footwear & Shoes",
  "Electronics & Home Appliances",
  "Mobile Shops & Repair",
  "Computer & Laptop Services",
  "Hardware & Building Material",
  "Interior Designers & Decor",
  "Steel & Aluminium Fabrication",
  "Automobile Garages & Repair",
  "Car & Bike Rentals",
  "Packers & Movers",
  "Event Organisers & Decor",
  "Catering & Tiffin Services",
  "Digital Marketing & IT",
  "Hospitals & Emergency",
  "Lawyers & Legal Advisors",
  "Pet Shops & Vet Clinics",
  "Water Purifier & RO Service",
  "Loan Consultants & Finance",
  "Insurance & Financial Services",
  "Digital Printing & Arts"
];

// Normalized Slug to Official Title Mapping
export const CATEGORY_SLUG_MAP: Record<string, string> = {
  // Protein & Gym
  'protein-shop': 'Protein & Supplements',
  'protein-supplements': 'Protein & Supplements',
  'protein': 'Protein & Supplements',
  'gyms': 'Gyms & Fitness Centers',
  'fitness': 'Gyms & Fitness Centers',
  'gyms-fitness-centers': 'Gyms & Fitness Centers',
  'gym': 'Gyms & Fitness Centers',

  // Medical & Labs
  'pathology': 'Pathology & Diagnostic Labs',
  'pathology-diagnostic-labs': 'Pathology & Diagnostic Labs',
  'doctors': 'Doctors & Specialists',
  'doctors-specialists': 'Doctors & Specialists',
  'dentists': 'Dentists & Dental Clinics',
  'dentists-dental-clinics': 'Dentists & Dental Clinics',
  'hospitals': 'Hospitals & Emergency',
  'hospitals-emergency': 'Hospitals & Emergency',
  'medical-stores': 'Medical Stores & Pharmacy',
  'medical-stores-pharmacy': 'Medical Stores & Pharmacy',
  'pharmacy': 'Medical Stores & Pharmacy',
  'baby-mother-care': 'Baby & Mother Care',
  'eye-care-opticians': 'Eye Care & Opticians',
  'opticians': 'Eye Care & Opticians',

  // Salons & Fashion
  'salons': 'Salon & Beauty Parlour',
  'salon': 'Salon & Beauty Parlour',
  'salon-beauty-parlour': 'Salon & Beauty Parlour',
  'beauty-parlours-salons': 'Beauty Parlours & Salons',
  'spa-wellness': 'Spa & Wellness',
  'spa': 'Spa & Wellness',
  'clothing-fashion': 'Clothing & Fashion',
  'clothing': 'Clothing & Fashion',
  'fashion': 'Clothing & Fashion',
  'jewellery-ornaments': 'Jewellery & Ornaments',
  'jewellery': 'Jewellery & Ornaments',
  'footwear-shoes': 'Footwear & Shoes',
  'footwear': 'Footwear & Shoes',

  // Food & Dining
  'restaurants': 'Restaurants & Dining',
  'restaurants-dining': 'Restaurants & Dining',
  'food': 'Restaurants & Dining',
  'cafes-bakeries': 'Cafes & Bakeries',
  'cafes': 'Cafes & Bakeries',
  'street-food-snacks': 'Street Food & Snacks',
  'street-food': 'Street Food & Snacks',
  'grocery-supermarkets': 'Grocery & Supermarkets',
  'grocery': 'Grocery & Supermarkets',
  'dairy-milk-products': 'Dairy & Milk Products',
  'dairy': 'Dairy & Milk Products',
  'meat-poultry': 'Meat & Poultry',
  'fruits-vegetables': 'Fruits & Vegetables',

  // Real Estate & Stays
  'real-estate-properties': 'Real Estate & Properties',
  'real-estate': 'Real Estate & Properties',
  'properties': 'Real Estate & Properties',
  'hotels-lodging': 'Hotels & Lodging',
  'hotels': 'Hotels & Lodging',
  'resorts-villas': 'Resorts & Villas',
  'resorts': 'Resorts & Villas',
  'pg-hostels': 'PG & Hostels',
  'pg': 'PG & Hostels',

  // Home Services & Repairs
  'home-services-repairs': 'Home Services & Repairs',
  'home-services': 'Home Services & Repairs',
  'electricians-wiring': 'Electricians & Wiring',
  'electricians': 'Electricians & Wiring',
  'plumbers-sanitation': 'Plumbers & Sanitation',
  'plumbers': 'Plumbers & Sanitation',
  'carpenters-furniture': 'Carpenters & Furniture',
  'carpenters': 'Carpenters & Furniture',
  'painters-waterproofing': 'Painters & Waterproofing',
  'painters': 'Painters & Waterproofing',
  'ac-service-cooling': 'AC Service & Cooling',
  'ac-service': 'AC Service & Cooling',
  'pest-control-services': 'Pest Control Services',
  'pest-control': 'Pest Control Services',
  'water-purifier': 'Water Purifier & RO Service',
  'water-purifier-ro-service': 'Water Purifier & RO Service',

  // Education & Fitness
  'schools-colleges': 'Schools & Colleges',
  'schools': 'Schools & Colleges',
  'coaching-tuitions': 'Coaching & Tuitions',
  'coaching': 'Coaching & Tuitions',
  'yoga-martial-arts': 'Yoga & Martial Arts',
  'yoga': 'Yoga & Martial Arts',
  'dance-music-classes': 'Dance & Music Classes',
  'dance-classes': 'Dance & Music Classes',

  // Electronics & Hardware
  'electronics-home-appliances': 'Electronics & Home Appliances',
  'electronics': 'Electronics & Home Appliances',
  'mobile-shops-repair': 'Mobile Shops & Repair',
  'mobile-shops': 'Mobile Shops & Repair',
  'computer-laptop-services': 'Computer & Laptop Services',
  'hardware-building-material': 'Hardware & Building Material',
  'hardware': 'Hardware & Building Material',
  'interior-designers-decor': 'Interior Designers & Decor',
  'steel-aluminium-fabrication': 'Steel & Aluminium Fabrication',
  'fabrication': 'Steel & Aluminium Fabrication',

  // Auto & Travel
  'automobile-garages-repair': 'Automobile Garages & Repair',
  'garages': 'Automobile Garages & Repair',
  'car-bike-rentals': 'Car & Bike Rentals',
  'travel-agencies-tours': 'Travel Agencies & Tours',
  'travel-agencies': 'Travel Agencies & Tours',
  'packers-movers': 'Packers & Movers',

  // Professional Services
  'ca-tax-consultants': 'CA & Tax Consultants',
  'ca': 'CA & Tax Consultants',
  'photographers-videographers': 'Photographers & Videographers',
  'photography': 'Photographers & Videographers',
  'event-organisers-decor': 'Event Organisers & Decor',
  'catering-tiffin-services': 'Catering & Tiffin Services',
  'digital-marketing-it': 'Digital Marketing & IT',
  'digital-marketing': 'Digital Marketing & IT',
  'seo': 'Digital Marketing & IT',
  'seo-google-ranking': 'Digital Marketing & IT',
  'performance-marketing': 'Digital Marketing & IT',
  'performance-ads': 'Digital Marketing & IT',
  'website-development': 'Digital Marketing & IT',
  'social-media-marketing': 'Digital Marketing & IT',
  'loan-consultants': 'Loan Consultants & Finance',
  'loan-consultants-finance': 'Loan Consultants & Finance',
  'loans': 'Loan Consultants & Finance',
  'loan': 'Loan Consultants & Finance',
  'business-loan': 'Loan Consultants & Finance',
  'home-loan': 'Loan Consultants & Finance',
  'personal-loan': 'Loan Consultants & Finance',
  'gold-loan': 'Loan Consultants & Finance',
  'vehicle-loan': 'Loan Consultants & Finance',
  'education-loan': 'Loan Consultants & Finance',
  'property-loan': 'Loan Consultants & Finance',
  'commercial-loan': 'Loan Consultants & Finance',
  'loan-against-property': 'Loan Consultants & Finance',
  'insurance': 'Insurance & Financial Services',
  'insurance-financial-services': 'Insurance & Financial Services',
  'health-insurance': 'Insurance & Financial Services',
  'term-life': 'Insurance & Financial Services',
  'term-life-cover': 'Insurance & Financial Services',
  'vehicle-insurance': 'Insurance & Financial Services',
  'vehicle-cover': 'Insurance & Financial Services',
  'shop-insurance': 'Insurance & Financial Services',
  'home-insurance': 'Insurance & Financial Services',
  'travel-insurance': 'Insurance & Financial Services',
  'fire-insurance': 'Insurance & Financial Services',
  'senior-health': 'Insurance & Financial Services',
  'digital-printing': 'Digital Printing & Arts',
  'printing': 'Digital Printing & Arts',
  'lawyers-legal-advisors': 'Lawyers & Legal Advisors',
  'lawyers': 'Lawyers & Legal Advisors',
  'pet-shops-vet-clinics': 'Pet Shops & Vet Clinics',
  'pet-shops': 'Pet Shops & Vet Clinics',
};

/**
 * Generates a clean URL slug for a category name (e.g. "Protein & Supplements" -> "protein-supplements")
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
 */
export function formatCategoryTitle(raw: string): string {
  if (!raw) return 'Local Directory';
  const clean = decodeURIComponent(raw).toLowerCase().trim();

  // 1. Direct slug match
  if (CATEGORY_SLUG_MAP[clean]) {
    return CATEGORY_SLUG_MAP[clean];
  }

  // 2. Slugified match
  const slugified = clean.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (CATEGORY_SLUG_MAP[slugified]) {
    return CATEGORY_SLUG_MAP[slugified];
  }

  // 2b. Match without "-and-" if slug had "-and-"
  const withoutAnd = slugified.replace(/-and-/g, '-');
  if (CATEGORY_SLUG_MAP[withoutAnd]) {
    return CATEGORY_SLUG_MAP[withoutAnd];
  }

  // 3. Exact match against official categories
  const official = EXPLORE_CATEGORIES.find(
    cat => {
      const catClean = cat.toLowerCase();
      const catSlug = getCategorySlug(cat);
      return catClean === clean || catSlug === slugified || catSlug === withoutAnd;
    }
  );
  if (official) return official;

  // 4. Fallback: Title case
  return raw
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Common search synonyms to ensure all variants (e.g. Protein, Protein Shop, Protein & Supplements) match together.
 */
export const CATEGORY_SEARCH_SYNONYMS: Record<string, string[]> = {
  'protein-supplements': ['protein', 'supplement', 'supplements', 'protein shop'],
  'protein-shop': ['protein', 'supplement', 'supplements', 'protein shop'],
  'protein': ['protein', 'supplement', 'supplements', 'protein shop'],
  'gyms-fitness-centers': ['gym', 'gyms', 'fitness', 'workout'],
  'gyms': ['gym', 'gyms', 'fitness', 'workout'],
  'fitness': ['gym', 'gyms', 'fitness', 'workout'],
  'doctors-specialists': ['doctor', 'doctors', 'clinic', 'clinics', 'specialist', 'physician'],
  'doctors': ['doctor', 'doctors', 'clinic', 'clinics'],
  'hospitals-emergency': ['hospital', 'hospitals', 'emergency'],
  'hospitals': ['hospital', 'hospitals'],
  'dentists-dental-clinics': ['dentist', 'dentists', 'dental'],
  'pathology-diagnostic-labs': ['pathology', 'diagnostic', 'lab', 'labs', 'blood test'],
  'medical-stores-pharmacy': ['medical', 'pharmacy', 'chemist', 'medicine', 'drug store'],
  'eye-care-opticians': ['optician', 'opticians', 'eye', 'spectacles', 'glasses', 'optical'],
  'opticians': ['optician', 'opticians', 'eye', 'spectacles', 'optical'],
  'salon-beauty-parlour': ['salon', 'salons', 'parlour', 'parlor', 'beauty', 'haircut'],
  'beauty-parlours-salons': ['salon', 'salons', 'parlour', 'parlor', 'beauty'],
  'restaurants-dining': ['restaurant', 'restaurants', 'dining', 'food', 'dhaba'],
  'cafes-bakeries': ['cafe', 'cafes', 'bakery', 'bakeries', 'coffee'],
  'street-food-snacks': ['snacks', 'farsan', 'fast food', 'chaat', 'sweets'],
  'grocery-supermarkets': ['grocery', 'supermarket', 'kirana', 'mart'],
  'real-estate-properties': ['real estate', 'property', 'properties', 'builder', 'realty', 'flat'],
  'hotels-lodging': ['hotel', 'hotels', 'lodging', 'lodge'],
  'resorts-villas': ['resort', 'resorts', 'villa', 'villas'],
  'pg-hostels': ['pg', 'hostel', 'hostels'],
  'water-purifier-ro-service': ['water purifier', 'purifier', 'ro service', 'ro'],
  'water-purifier': ['water purifier', 'purifier', 'ro service', 'ro'],
  'loan-consultants-finance': ['loan', 'loans', 'finance', 'consultant', 'home loan', 'personal loan', 'business loan'],
  'loan-consultants': ['loan', 'loans', 'finance', 'consultant', 'business loan'],
  'loans': ['loan', 'loans', 'finance', 'consultant', 'business loan'],
  'loan': ['loan', 'loans', 'finance', 'consultant', 'business loan'],
  'business-loan': ['loan', 'loans', 'finance', 'consultant', 'business loan'],
  'home-loan': ['loan', 'loans', 'finance', 'consultant', 'home loan'],
  'personal-loan': ['loan', 'loans', 'finance', 'consultant', 'personal loan'],
  'gold-loan': ['loan', 'loans', 'finance', 'consultant', 'gold loan'],
  'vehicle-loan': ['loan', 'loans', 'finance', 'consultant', 'vehicle loan'],
  'education-loan': ['loan', 'loans', 'finance', 'consultant', 'education loan'],
  'property-loan': ['loan', 'loans', 'finance', 'consultant', 'property loan'],
  'commercial-loan': ['loan', 'loans', 'finance', 'consultant', 'commercial loan'],
  'loan-against-property': ['loan', 'loans', 'finance', 'consultant'],
  'insurance-financial-services': ['insurance', 'policy', 'health insurance', 'life insurance', 'vehicle insurance', 'term life', 'lic'],
  'insurance': ['insurance', 'policy', 'health insurance', 'life insurance', 'vehicle insurance', 'term life', 'lic'],
  'health-insurance': ['insurance', 'policy', 'health insurance', 'mediclaim', 'hospital'],
  'term-life': ['insurance', 'policy', 'life insurance', 'term life'],
  'vehicle-insurance': ['insurance', 'policy', 'vehicle insurance', 'motor insurance'],
  'digital-marketing-it': ['digital marketing', 'marketing', 'seo', 'website', 'web development', 'social media', 'google ads', 'software', 'it'],
  'digital-marketing': ['digital marketing', 'marketing', 'seo', 'website', 'web development', 'social media', 'google ads', 'software', 'it'],
  'seo': ['digital marketing', 'marketing', 'seo', 'website'],
  'performance-marketing': ['digital marketing', 'marketing', 'seo', 'google ads'],
  'schools-colleges': ['school', 'schools', 'college', 'colleges', 'vidyalaya'],
  'schools': ['school', 'schools'],
  'coaching-tuitions': ['coaching', 'tuition', 'classes'],
  'mobile-shops-repair': ['mobile', 'mobile repair', 'cell phone', 'smartphone'],
  'mobile-shops': ['mobile', 'mobile repair'],
  'digital-printing-arts': ['printing', 'digital printing', 'xerox', 'banner'],
  'digital-printing': ['printing', 'digital printing'],
  'ca-tax-consultants': ['ca', 'tax', 'gst', 'chartered accountant', 'audit'],
  'electricians-wiring': ['electrician', 'electricians', 'electrical', 'wiring'],
  'plumbers-sanitation': ['plumber', 'plumbers', 'sanitary'],
  'ac-service-cooling': ['ac service', 'ac repair', 'air conditioner'],
  'car-bike-rentals': ['car rental', 'bike rental', 'cab', 'taxi'],
  'packers-movers': ['packers', 'movers', 'transport']
};

/**
 * Returns broad search keywords for a category to capture all variants in the database.
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

  // Automatic term extraction from words
  const words = slug
    .split('-')
    .filter(w => !['and', 'or', 'in', 'the', 'of', 'services', 'service', 'centers', 'center', 'shops', 'shop'].includes(w))
    .filter(w => w.length > 2);

  return Array.from(new Set([
    slug.replace(/-/g, ' '),
    ...words
  ]));
}

/**
 * Builds Prisma where filter conditions for a category page
 */
export function buildCategoryPrismaFilter(categorySlugOrTitle: string, selectedArea?: string) {
  const title = formatCategoryTitle(categorySlugOrTitle);
  const terms = getCategorySearchTerms(categorySlugOrTitle);

  const orConditions: any[] = [
    { category: { contains: title, mode: 'insensitive' } },
  ];

  terms.forEach(term => {
    if (!term) return;
    orConditions.push({ category: { contains: term, mode: 'insensitive' } });
    orConditions.push({ name: { contains: term, mode: 'insensitive' } });
    orConditions.push({ description: { contains: term, mode: 'insensitive' } });
    orConditions.push({ subcategory: { contains: term, mode: 'insensitive' } });
  });

  const whereClause: any = {
    verified: true,
    OR: orConditions
  };

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
