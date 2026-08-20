const { PrismaClient } = require('./src/generated/prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

const businesses = [
  { name: 'Anand Hospital', category: 'Hospital', rating: 4.7, phone: '02525260800', address: 'Chitralaya Road, Rooprajat Nagar, Boisar' },
  { name: 'Varad Multispeciality Hospital', category: 'Hospital', rating: 4.5, phone: '7788996613', address: 'Navapur Naka, Boisar' },
  { name: 'City General Hospital', category: 'Hospital', rating: 4.9, phone: '7264951994', address: 'Opp. Harmony Plaza, Boisar Tarapur Road' },
  { name: 'Sanjivani Hospital', category: 'Hospital', rating: 0, phone: '7798321657', address: 'Mahaveer Chambers, Navapur Road, Boisar', website: 'https://sanjivaniboisar.com', email: 'sanjivaniboisar@gmail.com' },
  { name: 'Metro Phoenix Hospital', category: 'Hospital', rating: 0, phone: '9067721212', address: 'Opp. Mahendra Park, Navapur Naka, Boisar', website: 'https://www.metrophoenixhospitals.com' },
  { name: 'BirthCare Clinic', category: 'Doctors', rating: 4.7, phone: '9172948419', address: 'Khodaram Baugh, Boisar' },
  { name: 'AASTHA Clinic', category: 'Doctors', rating: 5.0, phone: '9850520597', address: 'Samarth Chowk, Awadh Nagar, Boisar' },
  { name: 'Madhavbaug Clinic', category: 'Doctors', rating: 4.9, phone: '9049039545', address: 'Krisha Arcade, Khaira, Boisar' },
  { name: 'Metro Phoenix Hospital Doctors', category: 'Doctors', rating: 0, phone: '9067721212', address: 'Metro Phoenix Hospital, Boisar', website: 'https://www.metrophoenixhospitals.com' },
  { name: 'Lokseva Hospital Doctors', category: 'Doctors', rating: 4.9, phone: '7020244793', address: 'Boisar', website: 'https://loksevahospital.com', whatsapp: '7020244793' },
  { name: 'Purohit Thal', category: 'Restaurants', rating: 4.4, phone: '8169627778', address: 'Khodaram Baug, Boisar' },
  { name: 'Stone Oven Boisar', category: 'Restaurants', rating: 4.6, phone: '', address: 'Avyu Plaza, Chillar Road, Boisar' },
  { name: 'Deluxe Family Restaurant', category: 'Restaurants', rating: 4.2, phone: '7410002825', address: 'Navapur Road, Boisar' },
  { name: 'Hotel Sai Krupa', category: 'Restaurants', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Hotel Sabari Restaurant', category: 'Restaurants', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Freesia by Express Inn', category: 'Hotels', rating: 3.9, phone: '8149998666', address: 'Ostwal Empire, Boisar' },
  { name: 'Hotel Sarovar Residency', category: 'Hotels', rating: 3.9, phone: '9657187919', address: 'MIDC Road, Salwad' },
  { name: 'Blugent Residency', category: 'Hotels', rating: 4.3, phone: '9122522591', address: 'Navapur Road, Boisar' },
  { name: 'Hotel Sai Residency', category: 'Hotels', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Hotel Galaxy', category: 'Hotels', rating: 0, phone: '', address: 'Boisar' },
  { name: 'STYLO Unisex Salon', category: 'Salons', rating: 4.8, phone: '9028551030', address: 'CIDCO Colony, Boisar' },
  { name: "Rahul's Salon", category: 'Salons', rating: 4.4, phone: '9049785343', address: 'Khodaram Baug, Boisar' },
  { name: 'The Purple Vanity Salon and Academy', category: 'Salons', rating: 4.8, phone: '8806348263', address: 'Khodaram Baug, Boisar' },
  { name: 'Naturals Salon', category: 'Salons', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Jawed Habib Salon', category: 'Salons', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Lifeline The Fitness Club', category: 'Gyms', rating: 4.9, phone: '', address: 'Ostwal Empire, Boisar' },
  { name: 'Gemini Fitness Club', category: 'Gyms', rating: 4.4, phone: '7507750141', address: 'Sainath Nagar, Boisar' },
  { name: 'Power Gym', category: 'Gyms', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Iron Fitness', category: 'Gyms', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Muscle Factory Gym', category: 'Gyms', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Rahul International School', category: 'Schools', rating: 0, phone: '7385153162', address: 'Khaira, Boisar' },
  { name: 'New National High School', category: 'Schools', rating: 0, phone: '7756818268', address: 'Ganesh Nagar, Boisar' },
  { name: 'Tarapur Vidya Mandir', category: 'Schools', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Don Bosco School', category: 'Schools', rating: 0, phone: '', address: 'Boisar' },
  { name: 'Ostwal English Academy', category: 'Schools', rating: 0, phone: '', address: 'Boisar' },
];

const images = {
  Hospital: 'https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?w=600&q=80',
  Doctors: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80',
  Restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  Hotels: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  Salons: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
  Gyms: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
  Schools: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
};

async function main() {
  console.log('Deleting all existing businesses and related data...');
  try { await prisma.lead.deleteMany({}); } catch(e) { console.log('no leads'); }
  try { await prisma.review.deleteMany({}); } catch(e) { console.log('no reviews'); }
  try { await prisma.service.deleteMany({}); } catch(e) { console.log('no services'); }
  try { await prisma.product.deleteMany({}); } catch(e) { console.log('no products'); }
  try { await prisma.fAQ.deleteMany({}); } catch(e) { console.log('no faqs'); }
  try { await prisma.job.deleteMany({}); } catch(e) { console.log('no jobs'); }
  await prisma.business.deleteMany({});
  console.log('All cleared! Adding 35 new businesses...\n');

  for (const biz of businesses) {
    await prisma.business.create({
      data: {
        name: biz.name,
        category: biz.category,
        description: biz.name + ' - Local ' + biz.category + ' in Boisar area.',
        address: biz.address,
        phone: biz.phone || '',
        whatsapp: biz.whatsapp || biz.phone || '',
        website: biz.website || '',
        email: biz.email || '',
        rating: biz.rating || 0,
        reviewCount: 0,
        verified: true,
        premium: false,
        subscription: 'Free',
        image: images[biz.category] || 'https://images.unsplash.com/photo-1581093804475-577d72e38aa0?w=600&q=80',
        location: 'Boisar',
        workingHours: '9:00 AM - 9:00 PM',
      }
    });
    console.log('Added: ' + biz.name + ' [' + biz.category + ']');
  }
  console.log('\nDone! All 35 businesses added successfully.');
}

main()
  .catch(function(e) { console.error(e); process.exit(1); })
  .finally(async function() { await prisma.$disconnect(); });
