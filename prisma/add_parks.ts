import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding Parks to database...');

  const parks = [
    {
      name: 'JSW Miyawaki Park',
      category: 'Parks',
      description: 'A beautiful public park for morning walks and evening relaxation.',
      address: 'QQP5+HJF, Khaira, Boisar, Maharashtra 401501',
      phone: 'Not Available',
      whatsapp: '',
      workingHours: '6:00 AM to 10:00 AM & 5:00 PM to 9:30 PM (Daily)',
      verified: true,
      premium: false,
      subscription: 'Free',
      rating: 4.5,
      reviewCount: 15,
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
      location: 'Khaira, Boisar',
    },
    {
      name: "Children's Park",
      category: 'Parks',
      description: 'A safe and fun play area for kids with swings and slides.',
      address: 'BARC Staff Colony, Pasthal, Boisar, Maharashtra 401504',
      phone: 'Not Available',
      whatsapp: '',
      workingHours: '6:00 AM to 11:00 PM (Daily)',
      verified: true,
      premium: false,
      subscription: 'Free',
      rating: 4.2,
      reviewCount: 30,
      image: 'https://images.unsplash.com/photo-1596423735880-5c6fa95eb13a?auto=format&fit=crop&w=800&q=80',
      location: 'Pasthal, Boisar',
    },
    {
      name: 'Azad Nagar Ground',
      category: 'Parks',
      description: 'Public playground for sports, events and open-air activities.',
      address: 'RP2W+HWH, Awadh Nagar, Saravali, Boisar, Maharashtra 401506',
      phone: 'Not Available',
      whatsapp: '',
      workingHours: 'Open 24 Hours',
      verified: true,
      premium: false,
      subscription: 'Free',
      rating: 4.0,
      reviewCount: 45,
      image: 'https://images.unsplash.com/photo-1526468494884-60196ce2d37c?auto=format&fit=crop&w=800&q=80',
      location: 'Saravali, Boisar',
    },
    {
      name: 'Circus Ground Boisar',
      category: 'Parks',
      description: 'Large public open ground used for circuses, fairs, and sports.',
      address: 'Boisar Tarapur Road, Sainath Nagar, Boisar, Maharashtra 401506',
      phone: 'Not Available',
      whatsapp: '',
      workingHours: 'Open 24 Hours',
      verified: true,
      premium: false,
      subscription: 'Free',
      rating: 3.8,
      reviewCount: 120,
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
      location: 'Sainath Nagar, Boisar',
    },
    {
      name: 'Navrang Ground',
      category: 'Parks',
      description: 'Public ground for community gatherings and local sports.',
      address: 'RQ24+J72, Boisar, Maharashtra 401506',
      phone: 'Not Available',
      whatsapp: '',
      workingHours: 'Timing Not Listed',
      verified: true,
      premium: false,
      subscription: 'Free',
      rating: 4.1,
      reviewCount: 22,
      image: 'https://images.unsplash.com/photo-1498111364532-6804a08ea969?auto=format&fit=crop&w=800&q=80',
      location: 'Boisar',
    }
  ];

  for (const park of parks) {
    await prisma.business.create({
      data: park
    });
    console.log(`Added ${park.name}`);
  }

  console.log('Parks added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
