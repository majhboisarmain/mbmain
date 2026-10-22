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
  "Jobs",
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
  'protein-supplements': 'Protein',

  // Loans (Single canonical category)
  'loans': 'Loans',
  'loan': 'Loans',
  'loan-consultants': 'Loans',
  'loan-consultants-finance': 'Loans',
  'finance': 'Loans',

  // Gyms & Fitness (Single canonical category)
  'gyms': 'Gyms',
  'gym': 'Gyms',
  'gyms-fitness-centers': 'Gyms',
  'fitness-centers': 'Gyms',
  'fitness': 'Gyms',

  // Salons & Beauty (Single canonical category)
  'salons': 'Salons',
  'salon': 'Salons',
  'salon-beauty-parlour': 'Salons',
  'beauty-parlours': 'Salons',
  'beauty-parlour': 'Salons',
  'beauty-parlours-salons': 'Salons',

  // Clothing & Fashion (Single canonical category)
  'clothing': 'Clothing',
  'clothing-stores': 'Clothing',
  'clothing-fashion': 'Clothing',
  'fashion': 'Clothing',
  'fashion-boutiques': 'Clothing',

  // Photographers & Videographers (Single canonical category)
  'photographers': 'Photographers',
  'photography': 'Photographers',
  'photographers-videographers': 'Photographers',
  'videographers': 'Photographers',

  // Medical Stores & Pharmacies (Single canonical category)
  'medical-stores': 'Medical Stores',
  'medical-stores-pharmacy': 'Medical Stores',
  'pharmacy': 'Medical Stores',
  'pharmacies': 'Medical Stores',

  // CA & Tax Consultants (Single canonical category)
  'ca': 'CA Consultants',
  'ca-consultants': 'CA Consultants',
  'ca-tax-consultants': 'CA Consultants',
  'tax-consultants': 'CA Consultants',

  // Doctors & Clinics
  'doctors': 'Doctors',
  'doctors-specialists': 'Doctors',

  // Hospitals
  'hospitals': 'Hospitals',
  'hospitals-emergency': 'Hospitals',

  // Dentists
  'dentists': 'Dentists',
  'dentists-dental-clinics': 'Dentists',

  // Pathology Labs
  'pathology': 'Pathology Labs',
  'pathology-labs': 'Pathology Labs',
  'pathology-diagnostic-labs': 'Pathology Labs',

  // Eye Opticians
  'eye-opticians': 'Eye Opticians',
  'opticians': 'Eye Opticians',
  'eye-care-opticians': 'Eye Opticians',

  // Water Purifier
  'water-purifier': 'Water Purifier',
  'water-purifier-ro-service': 'Water Purifier',

  // Schools & Education
  'schools': 'Schools',
  'schools-colleges': 'Schools',
  'colleges': 'Schools',

  // Jobs
  'jobs': 'Jobs',
  'jobs-placement': 'Jobs',

  // Digital Printing
  'digital-printing': 'Digital Printing',
  'digital-printing-arts': 'Digital Printing',

  // Dance & Music
  'dance-classes': 'Dance Classes',
  'dance': 'Dance Classes',
  'dance-class': 'Dance Classes',
  'dance-music-classes': 'Dance Classes',
  'music-classes': 'Music Classes',
  'music': 'Music Classes',

  // Food & Dining
  'restaurants': 'Restaurants',
  'restaurants-dining': 'Restaurants',
  'food': 'Restaurants',
  'cafes': 'Cafes',
  'bakeries': 'Bakeries',
  'street-food': 'Street Food',
  'street-food-snacks': 'Street Food',

  // Grocery
  'grocery': 'Grocery',
  'grocery-stores': 'Grocery',
  'grocery-supermarkets': 'Grocery',
  'supermarkets': 'Grocery',

  // Real Estate & Stays
  'real-estate': 'Real Estate',
  'real-estate-properties': 'Real Estate',
  'properties': 'Real Estate',
  'hotels': 'Hotels',
  'hotels-lodging': 'Hotels',
  'resorts': 'Resorts',
  'resorts-villas': 'Resorts',
  'hostels': 'Hostels',
  'hostels-pg': 'Hostels',
  'pg-hostels': 'Hostels',
  'pg': 'Hostels',

  // Home Services
  'electricians': 'Electricians',
  'electricians-wiring': 'Electricians',
  'plumbers': 'Plumbers',
  'plumbers-sanitation': 'Plumbers',
  'carpenters': 'Carpenters',
  'carpenters-furniture': 'Carpenters',
  'painters': 'Painters',
  'painters-waterproofing': 'Painters',
  'ac-service': 'AC Service',
  'ac-service-cooling': 'AC Service',
  'pest-control': 'Pest Control',
  'pest-control-services': 'Pest Control',

  // Others
  'yoga': 'Yoga Classes',
  'yoga-classes': 'Yoga Classes',
  'coaching': 'Coaching Classes',
  'coaching-classes': 'Coaching Classes',
  'jewellery': 'Jewellery',
  'footwear': 'Footwear',
  'electronics': 'Electronics',
  'mobile-shops': 'Mobile Shops',
  'computer-repair': 'Computer Repair',
  'hardware': 'Hardware',
  'interior-designers': 'Interior Designers',
  'fabrication': 'Fabrication',
  'automobile-garages': 'Auto Garages',
  'garages': 'Auto Garages',
  'car-rentals': 'Car Rentals',
  'packers-movers': 'Packers Movers',
  'event-organisers': 'Event Organisers',
  'catering': 'Catering',
  'digital-marketing': 'Digital Marketing',
  'insurance': 'Insurance',
  'lawyers': 'Lawyers',
  'pet-clinics': 'Pet Clinics',
  'baby-care': 'Baby Care',
  'spa': 'Spa Wellness',
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

  // Loans (combines Loans, Loan Consultants, Finance)
  'loans': ['loan', 'loans', 'loan consultant', 'loan consultants', 'finance', 'financial advisor', 'home loan', 'personal loan', 'business loan'],
  'loan': ['loan', 'loans', 'loan consultant', 'finance'],
  'loan-consultants': ['loan', 'loans', 'loan consultant', 'finance'],

  // Gyms & Fitness (combines Gyms, Fitness Centers)
  'gyms': ['gym', 'gyms', 'fitness', 'fitness center', 'fitness centers', 'workout', 'weight training', 'crossfit'],
  'fitness-centers': ['gym', 'gyms', 'fitness', 'fitness center', 'fitness centers'],

  // Salons & Beauty (combines Salons, Beauty Parlours)
  'salons': ['salon', 'salons', 'beauty parlour', 'hair salon', 'haircut'],
  'beauty-parlours': ['beauty parlour', 'salon', 'haircut'],

  // Clothing
  'clothing': ['clothing', 'fashion', 'garment', 'apparel', 'boutique', 'menswear', 'womenswear'],
  'fashion': ['clothing', 'fashion', 'boutique'],

  // Medical Stores & Pharmacies
  'medical-stores': ['medical store', 'medical stores', 'pharmacy', 'pharmacies', 'chemist', 'medicine'],
  'pharmacy': ['medical store', 'pharmacy', 'chemist'],

  // Eye Opticians
  'eye-opticians': ['eye opticians', 'optician', 'opticians', 'optical', 'spectacles', 'care eyes'],

  // Water Purifier
  'water-purifier': ['water purifier', 'ro filter', 'ro service', 'filter service', 'sales in boisar'],

  // Schools
  'schools': ['school', 'schools', 'vidyalaya', 'english medium school', 'ctes'],

  // Digital Printing
  'digital-printing': ['digital printing', 'radium art', 'banner printing', 'flex printing', 'boisar radium art'],

  // Jobs
  'jobs': ['jobs', 'placement', 'recruitment', 'job consultancy', 'jobs & placement', 'musclefactoryhub'],

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
  'footwear': ['footwear', 'shoes'],
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
      { category: { in: ['Loans', 'Loan Consultants', 'Finance', 'Insurance', 'Real Estate', 'Properties', 'Hardware', 'Protein', 'Protein Shop'] } }
    ];
  } else if (lowerSlug.includes('loan') || lowerSlug.includes('finance')) {
    whereClause.NOT = [
      { category: { in: ['Dance Classes', 'Music Classes', 'Gyms', 'Salons', 'Restaurants', 'Protein', 'Protein Shop'] } }
    ];
  } else if (lowerSlug.includes('protein')) {
    whereClause.NOT = [
      { category: { in: ['Loans', 'Loan Consultants', 'Dance Classes', 'Music Classes'] } }
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
