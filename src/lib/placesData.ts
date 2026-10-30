export interface IconicPlace {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  tag: string;
  distance: string;
  travelTime: string;
  location: string;
  image: string;
  description: string;
  longDescription: string;
  bestTimeToVisit: string;
  timings: string;
  entryFee: string;
  highlights: string[];
  howToReach: string;
  mapQuery: string;
  seoTitle: string;
  seoDescription: string;
}

export const BOISAR_ICONIC_PLACES: IconicPlace[] = [
  {
    id: 'chinchani-beach',
    slug: 'chinchani-beach',
    name: 'Chinchani Beach, Boisar',
    shortName: 'Chinchani Beach',
    category: 'Beach & Sunset',
    tag: 'Coast of Boisar',
    distance: '15 mins from Boisar',
    travelTime: '12 km • ~20 mins',
    location: 'Chinchani Coast, Boisar Taluka, Palghar 401503',
    image: '/places/chinchani-beach.jpg',
    description: 'Serene black-sand coastline famous for mesmerizing Arabian Sea sunsets, local street food & family beach outings.',
    longDescription: 'Chinchani Beach is the premier coastal getaway for Boisar residents and weekend travellers. With its vast, flat expanse of firm grey-black sand, gentle waves, and palm-fringed shoreline, Chinchani is ideal for long evening walks, beach sports, and family leisure.\n\nThe beach comes alive every evening with local vendors selling fresh tender coconut water, roasted bhutta (corn), chaat, and Mumbai-style street snacks. It also features thrilling ATV bike rides, camel rides, and horse carts, making it a complete seaside experience just a short drive from Boisar town.',
    bestTimeToVisit: 'October to May (Evenings from 4:30 PM onwards for sunset)',
    timings: 'Open 24 Hours (Best visited between 6:00 AM – 7:30 PM)',
    entryFee: 'Free Entry',
    highlights: ['Breathtaking Arabian Sea Sunsets', 'Beach Snacks & Coconut Water', 'Horse Cart & ATV Rides', 'Safe Firm Sand for Jogging'],
    howToReach: 'Regular ST buses and share autos ply between Boisar Railway Station (West) and Chinchani Beach. Travel time is around 18-20 minutes.',
    mapQuery: 'Chinchani Beach Boisar Maharashtra',
    seoTitle: 'Chinchani Beach Boisar — Travel Guide, Sunset Timings & Photos | Majh Boisar',
    seoDescription: 'Plan your trip to Chinchani Beach, Boisar. Check distances, sunset timings, water sports, food stalls, and how to reach from Boisar station on Majh Boisar.'
  },
  {
    id: 'kelve-beach',
    slug: 'kelve-beach',
    name: 'Kelve Beach & Suru Pine Forest, Palghar',
    shortName: 'Kelve Beach',
    category: 'Sea Coast & Fort',
    tag: 'Top Coastal Spot',
    distance: '25 mins from Boisar',
    travelTime: '22 km • ~35 mins',
    location: 'Kelve Beach Road, Palghar, Maharashtra 401401',
    image: '/places/kelve-beach.jpg',
    description: 'One of the longest beaches in Palghar district with fragrant Suru pine tree forests and an ancient Portuguese water fort.',
    longDescription: 'Kelve Beach is renowned for its vast 8 km long shoreline fringed by dense Casuarina (Suru) pine groves. The cool shade of the pine woods provides the ideal setting for relaxed family picnics, hammocks, and beachfront lunches.\n\nAt the northern end lies the historic Kelve Fort and the unique Pankot (water fort) accessible during low tide. The beach offers exciting activities including parasailing, banana rides, quad biking, and beachside resort stays.',
    bestTimeToVisit: 'October to May for beach outings; Monsoon for dramatic cloudy seascapes',
    timings: 'Open 24 Hours',
    entryFee: 'Free Entry',
    highlights: ['Historic Kelve Sea Fort & Pankot', 'Dense Casuarina (Suru) Pine Grove', 'Water Sports & Beachfront Resorts', 'Shitla Devi Temple'],
    howToReach: 'Direct local trains from Boisar to Kelve Road Station (just 15 mins by train), or drive 22 km along the coastal highway.',
    mapQuery: 'Kelve Beach Palghar Maharashtra',
    seoTitle: 'Kelve Beach & Pine Forest — Resorts, Water Sports & Guide | Majh Boisar',
    seoDescription: 'Explore Kelve Beach near Boisar & Palghar. Discover Suru pine trees, water sports, beachside resorts, sea fort timings, and travel guide on Majh Boisar.'
  },
  {
    id: 'shirgaon-fort',
    slug: 'shirgaon-fort',
    name: 'Shirgaon Fort & Coastal Bastion, Boisar',
    shortName: 'Shirgaon Fort',
    category: 'Historic Sea Fort',
    tag: 'Heritage Landmark',
    distance: '18 mins from Boisar',
    travelTime: '14 km • ~25 mins',
    location: 'Shirgaon Village, Coastal Road, Palghar 401404',
    image: '/places/shirgaon-fort.jpg',
    description: 'Well-preserved 16th-century Maratha stone fortress perched beside palm-fringed coast with commanding panoramic ocean views.',
    longDescription: 'Shirgaon Fort stands as a proud testament to Maharashtra’s rich maritime military history. Originally built by Portuguese forces and later captured and renovated by the great Maratha warrior Peshwa Chimaji Appa in the 18th century, the fort features formidable basalt stone walls, watchtowers, and arched entryways.\n\nSurrounded by green coconut trees and the Arabian Sea shore, visitors can climb the stone bastions to witness breathtaking coastal views. Right opposite the fort lies the peaceful Shirgaon Beach, making it a two-in-one historical and seaside excursion.',
    bestTimeToVisit: 'October to February (Pleasant winter weather)',
    timings: '8:00 AM – 6:30 PM daily',
    entryFee: 'Free Entry',
    highlights: ['Chhatrapati Shivaji Maharaj Era Legacy', 'Peshwa Chimaji Appa Battle Site', 'Ocean View Bastions', 'Adjacent Quiet Beach'],
    howToReach: '14 km from Boisar Station via Satpati-Shirgaon coastal route. Direct auto-rickshaws and state transport buses available.',
    mapQuery: 'Shirgaon Fort Palghar Maharashtra',
    seoTitle: 'Shirgaon Fort Boisar & Palghar — History, Timings & Guide | Majh Boisar',
    seoDescription: 'Explore Shirgaon Fort near Boisar. Discover its 18th-century Maratha history, scenic ocean bastions, visiting timings, and directions on Majh Boisar.'
  },
  {
    id: 'tarapur-fort',
    slug: 'tarapur-fort',
    name: 'Tarapur Fort & Historic Harbour, Boisar',
    shortName: 'Tarapur Fort & Light',
    category: 'Lighthouse & History',
    tag: 'Coastal Heritage',
    distance: '12 mins from Boisar',
    travelTime: '10 km • ~15 mins',
    location: 'Tarapur Harbour, Boisar, Maharashtra 401502',
    image: '/places/tarapur-fort.jpg',
    description: 'Ancient coastal fortress near Tarapur harbour and the historic maritime beacon guiding seafarers along the North Konkan coast.',
    longDescription: 'Tarapur Fort is one of the oldest coastal fortifications in Palghar district, dating back to medieval times and witnessing centuries of naval power shifts between the Sultanates, Portuguese, Marathas, and British. Nestled beside the ancient port of Tarapur, it was once a pivotal maritime checkpoint.\n\nToday, the ancient ramparts, stone arches, and nearby lighthouse offer a captivating journey into coastal history. Visitors can also explore the lively fishing harbour where boats dock with fresh catch every morning and evening.',
    bestTimeToVisit: 'Winter and pre-summer months (October to April)',
    timings: 'Sunrise to Sunset',
    entryFee: 'Free Entry',
    highlights: ['Centuries-old Stone Ramparts', 'Active Tarapur Fishing Port', 'Maritime Lighthouse Views', 'Authentic Coastal Culture'],
    howToReach: 'Directly connected via the Boisar-Tarapur main road (10 km). Plentiful frequency of 6-seater share autos and buses from Boisar Station.',
    mapQuery: 'Tarapur Fort Boisar Maharashtra',
    seoTitle: 'Tarapur Fort & Harbour Boisar — History, Photos & Guide | Majh Boisar',
    seoDescription: 'Visit historic Tarapur Fort near Boisar. Learn about its heritage ramparts, port lighthouse, visiting guide, and map directions on Majh Boisar.'
  },
  {
    id: 'dahanu-beach',
    slug: 'dahanu-beach',
    name: 'Dahanu Coast & Chikoo Orchards, Dahanu',
    shortName: 'Dahanu Coast & Chikoo',
    category: 'Chikoo & Beach',
    tag: 'Coastal Heritage',
    distance: '30 mins from Boisar',
    travelTime: '28 km • ~40 mins',
    location: 'Dahanu Sea Face, Dahanu, Maharashtra 401601',
    image: '/places/dahanu-beach.jpg',
    description: 'Sprawling clean beach lined with world-famous lush Chikoo (sapodilla) orchards, Parsi heritage villas, and tranquil shores.',
    longDescription: 'Dahanu is famous worldwide for its GI-tagged sweet Chikoo (sapodilla) plantations and tranquil, peaceful coastline. Situated just 28 km north of Boisar, the coastal drive between Boisar, Chinchani, and Dahanu is one of the most picturesque coastal routes in Maharashtra.\n\nThe town boasts heritage colonial and Parsi bungalows, artisan bakeries, and clean flat beaches perfect for watching sunset or enjoying fresh seafood and authentic Parsi cuisine.',
    bestTimeToVisit: 'October to March (Chikoo Festival season during winter)',
    timings: 'Open 24 Hours',
    entryFee: 'Free Entry',
    highlights: ['World Famous Chikoo Orchards', 'Parsi Heritage Cuisine & Villas', 'Bordi Coastal Drive', 'Tranquil Flat Shoreline'],
    howToReach: 'Direct local/express trains from Boisar Station to Dahanu Road Station (15-20 mins train ride), or drive 28 km via coastal highway.',
    mapQuery: 'Dahanu Beach Maharashtra',
    seoTitle: 'Dahanu Beach & Chikoo Orchards — Travel Guide & Places to Visit | Majh Boisar',
    seoDescription: 'Discover Dahanu Beach near Boisar. Explore sweet Chikoo orchards, heritage Parsi villas, coastal drives, and travel guide on Majh Boisar.'
  },
  {
    id: 'asava-fort',
    slug: 'asava-fort',
    name: 'Asava Fort Trek, Manor-Boisar',
    shortName: 'Asava Fort Trek',
    category: 'Nature & Trekking',
    tag: 'Mountain Hike',
    distance: '25 mins from Boisar',
    travelTime: '20 km • ~30 mins',
    location: 'Asava Fort, Manor-Palghar, Maharashtra 401403',
    image: '/places/asava-fort.jpg',
    description: 'Scenic hill fort trek offering breathtaking 360-degree vistas of the green Sahyadri ranges and Surya River valley.',
    longDescription: 'Asava Fort is an ancient hill citadel located near Manor, just a 30-minute scenic drive from Boisar town. Rising gently above the surrounding farming valleys, it is considered one of the best beginner-friendly treks in the region.\n\nThe summit retains remnants of medieval stone bastions, rock-hewn water cisterns, and a tranquil Shiva temple shrine. During the rains, clouds drift directly through the trek path, offering a refreshing natural escape.',
    bestTimeToVisit: 'July to February',
    timings: '6:00 AM – 6:00 PM',
    entryFee: 'Free Entry',
    highlights: ['Beginner Friendly Trekking', 'Ancient Rock Water Tanks', 'Surya River Valley Panorama', 'Green Monsoon Landscapes'],
    howToReach: 'Take Boisar-Manor link road to the base village of Asava. Approx 20 km drive by car or bike.',
    mapQuery: 'Asava Fort Palghar Maharashtra',
    seoTitle: 'Asava Fort Trek Boisar & Manor — Trail Map, Difficulty & Photos | Majh Boisar',
    seoDescription: 'Plan your hike to Asava Fort near Boisar. Beginner-friendly trail map, monsoon trekking tips, history, and directions on Majh Boisar.'
  },
  {
    id: 'vandri-lake',
    slug: 'vandri-lake',
    name: 'Vandri Lake & Nature Camping, Palghar',
    shortName: 'Vandri Lake Camping',
    category: 'Lake & Camping',
    tag: 'Camping & Stargazing',
    distance: '35 mins from Boisar',
    travelTime: '30 km • ~45 mins',
    location: 'Vandri Dam Reservoir, NH48, Palghar 401404',
    image: '/places/vandri-lake.jpg',
    description: 'Serene freshwater reservoir nested amidst green hills, popular for weekend camping, stargazing, and nature picnics.',
    longDescription: 'Vandri Lake is a sprawling, peaceful dam reservoir situated off the Mumbai-Ahmedabad National Highway near Boisar-Palghar. Tucked between rolling green hills and tribal hamlets, it is completely cut off from city clamour.\n\nIt is one of North Konkan’s prime spots for weekend DIY tent camping, bonfires, stargazing, and photography. The glassy reflection of the hills in the quiet water makes it a must-visit retreat for road trippers and nature enthusiasts.',
    bestTimeToVisit: 'October to February for cool night camping and bonfires',
    timings: 'Open 24 Hours (Daytime & guided camping recommended)',
    entryFee: 'Free Entry (Camping fees vary by organizer)',
    highlights: ['Lakeside Tent Camping & Bonfire', 'Misty Sunrise & Reflections', 'Zero Light Pollution Stargazing', 'Peaceful Picnic Haven'],
    howToReach: 'Located just off the NH48 highway, accessible via Boisar-Manor-Highway link road in 40-45 minutes by car or bike.',
    mapQuery: 'Vandri Lake Palghar Maharashtra',
    seoTitle: 'Vandri Lake Camping & Boating Guide near Boisar | Majh Boisar',
    seoDescription: 'Experience lakeside camping, stargazing, and nature picnics at Vandri Lake near Boisar. Complete travel guide, route, and tips on Majh Boisar.'
  },
  {
    id: 'mahalaxmi-temple',
    slug: 'mahalaxmi-temple',
    name: 'Shree Mahalaxmi Temple, Charoti-Dahanu',
    shortName: 'Mahalaxmi Temple Dahanu',
    category: 'Pilgrimage Shrine',
    tag: 'Spiritual Shrine',
    distance: '40 mins from Boisar',
    travelTime: '35 km • ~50 mins',
    location: 'Charoti Naka, NH48 Highway, Dahanu, Maharashtra 401602',
    image: '/places/mahalaxmi-temple.jpg',
    description: 'Sacred ancient shrine of Goddess Mahalaxmi situated along the highway, visited by thousands of pilgrims and devotees every week.',
    longDescription: 'The Shree Mahalaxmi Temple at Charoti is one of the most revered spiritual landmarks in the entire Palghar district. Perched gracefully on a scenic hillock along the highway, the temple is believed to have been established centuries ago and is the Kuldevi of thousands of families across Maharashtra and Gujarat.\n\nThe annual Mahalaxmi Yatra (fair) held during Chaitra Navratri draws lakhs of devotees. The temple complex features beautiful tiered shikhar architecture, prasad counters, and traditional bazaar selling authentic local offerings.',
    bestTimeToVisit: 'Throughout the year; Chaitra Navratri (March-April) and Diwali for special celebrations',
    timings: '5:30 AM – 9:00 PM daily',
    entryFee: 'Free Darshan (Special VIP queue options available during festivals)',
    highlights: ['Ancient Sacred Devi Shrine', 'Hilltop Temple Setting', 'Vibrant Temple Bazaar & Prasad', 'Spiritual Energy & Aarti'],
    howToReach: 'Directly on the Mumbai-Ahmedabad NH48 highway at Charoti junction. Approx 35 km from Boisar via Kasa-Charoti road.',
    mapQuery: 'Mahalaxmi Temple Charoti Dahanu Maharashtra',
    seoTitle: 'Mahalaxmi Temple Charoti Dahanu — Darshan Timings & Yatra | Majh Boisar',
    seoDescription: 'Complete guide for Shree Mahalaxmi Temple at Charoti near Boisar. Darshan timings, history, annual Yatra details, and map route on Majh Boisar.'
  }
];

export function getIconicPlaceBySlug(slug: string): IconicPlace | undefined {
  return BOISAR_ICONIC_PLACES.find(p => p.slug === slug || p.id === slug);
}
