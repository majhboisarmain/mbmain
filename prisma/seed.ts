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
  console.log('Seeding Majh Boisar database...');

  // Clean existing data
  await prisma.fAQ.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.business.deleteMany({});

  // 1. Hotel Boisar Residency (Restaurant/Hotel - Premium)
  const b1 = await prisma.business.create({
    data: {
      name: 'Hotel Boisar Residency',
      category: 'Restaurants',
      description: 'A premium fine dining restaurant and luxury lodging located in the heart of Boisar. Serving delicious multi-cuisine Indian, Chinese, and Tandoori dishes, along with spacious rooms for events and stays.',
      address: 'Plot No. 12, Tarapur Road, Near railway station, Boisar West, 401501',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      website: 'https://boisarresidency.com',
      email: 'info@boisarresidency.com',
      verified: true,
      premium: true,
      subscription: 'Premium',
      rating: 4.6,
      reviewCount: 4,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      workingHours: '11:00 AM - 11:30 PM',
      location: 'Boisar West',
      views: 1250,
      phoneClicks: 140,
      whatsappClicks: 95,
      directionClicks: 210,
      websiteClicks: 80,
      products: {
        create: [
          { name: 'Veg Maharaja Thali', price: 280, description: 'A royal feast with 3 mains, dal makhani, raita, naan, rice, and dessert.' },
          { name: 'Paneer Tikka Masala', price: 240, description: 'Grilled paneer cubes cooked in rich tomato and onion gravy.' },
          { name: 'Chicken Dum Biryani', price: 320, description: 'Fragrant basmati rice cooked with succulent chicken and spices.' }
        ]
      },
      services: {
        create: [
          { name: 'Table Reservation', price: 0, duration: '2 hours', description: 'Book a table in advance for family dinner or business meets.' },
          { name: 'Banquet Hall Booking', price: 15000, duration: '6 hours', description: 'Air-conditioned banquet hall with catering for up to 200 guests.' }
        ]
      },
      faqs: {
        create: [
          { question: 'Is parking available?', answer: 'Yes, we provide free valet parking for our guests.' },
          { question: 'Do you offer home delivery?', answer: 'Yes, we deliver within Boisar (minimum order ₹300).' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Amit Mishra', rating: 5, comment: 'Best dining place in Boisar! Clean environment, friendly staff, and the Paneer Tikka is a must-try.' },
          { userName: 'Rahul Patil', rating: 4, comment: 'Good food and lodging facilities. Service is a bit slow on weekends, but overall worth it.' },
          { userName: 'Sneha More', rating: 5, comment: 'Hosted my daughter\'s birthday party in the banquet hall. Excellent service, superb food!' },
          { userName: 'John Fernandes', rating: 4, comment: 'Decent ambiance and tasty Chinese food. Recommended.' }
        ]
      }
    }
  });

  // 2. Ashirwad Multispeciality Clinic (Clinic/Doctor - Gold)
  const b2 = await prisma.business.create({
    data: {
      name: 'Ashirwad Multispeciality Clinic',
      category: 'Doctors',
      description: 'Comprehensive family healthcare clinic providing consultation in general medicine, pediatrics, gynecology, and physiotherapy. Managed by experienced doctors with state-of-the-art diagnostic facilities.',
      address: 'Shop 105, Ostwal Empire, Bypass Road, Boisar East, 401501',
      phone: '+91 99988 87766',
      whatsapp: '+91 99988 87766',
      website: 'https://ashirwadclinicboisar.com',
      email: 'contact@ashirwadclinicboisar.com',
      verified: true,
      premium: true,
      subscription: 'Gold',
      rating: 4.8,
      reviewCount: 3,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      workingHours: '9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM',
      location: 'Boisar East',
      views: 980,
      phoneClicks: 210,
      whatsappClicks: 70,
      directionClicks: 145,
      websiteClicks: 40,
      services: {
        create: [
          { name: 'General Consultation', price: 300, duration: '15 mins', description: 'Routine health checkup, diagnosis, and prescription.' },
          { name: 'Pediatric Checkup', price: 400, duration: '20 mins', description: 'Specialized healthcare and immunization consult for children.' },
          { name: 'Blood Sugar & BP Test', price: 80, duration: '5 mins', description: 'Quick screening for diabetes and hypertension.' }
        ]
      },
      faqs: {
        create: [
          { question: 'Is prior appointment mandatory?', answer: 'We accept walk-ins, but prior booking is recommended to avoid waiting.' },
          { question: 'Do you have ECG facility?', answer: 'Yes, we have emergency ECG and primary diagnostic services on-site.' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Dr. Vivek Sharma', rating: 5, comment: 'Dr. Patil is highly knowledgeable and takes time to explain the diagnosis. Highly recommended clinic!' },
          { userName: 'Prachi Naik', rating: 5, comment: 'Clean clinic, helpful receptionist, and prompt treatment.' },
          { userName: 'Ganesh Gupta', rating: 4, comment: 'Standard waiting time is 15-20 mins. Treatment was very effective.' }
        ]
      }
    }
  });

  // 3. Sai Plumbers & Sanitary Works (Plumber - Free)
  const b3 = await prisma.business.create({
    data: {
      name: 'Sai Plumbers & Sanitary Works',
      category: 'Plumbers',
      description: 'Professional plumbing services for residential and commercial spaces. Expert in leak detection, pipeline repairs, bathroom fittings installation, and water tank cleaning. Reliable and budget-friendly.',
      address: 'Gala 5, Ambedkar Nagar, Near Navapur Naka, Boisar West, 401501',
      phone: '+91 91234 56789',
      whatsapp: '+91 91234 56789',
      verified: true,
      premium: false,
      subscription: 'Free',
      rating: 4.3,
      reviewCount: 3,
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
      workingHours: '8:00 AM - 8:00 PM',
      location: 'Boisar West',
      views: 450,
      phoneClicks: 88,
      whatsappClicks: 64,
      directionClicks: 32,
      services: {
        create: [
          { name: 'Pipeline Leakage Repair', price: 250, duration: '45 mins', description: 'Locating and sealing leaks in water supply or drain pipelines.' },
          { name: 'Bathroom Sanitary Fitting', price: 500, duration: '1 hour', description: 'Installation of taps, showers, washbasins, and flush tanks.' },
          { name: 'Water Tank Cleaning (500L-1000L)', price: 800, duration: '2 hours', description: 'Deep scrubbing, washing, and sanitizing of overhead/underground water tanks.' }
        ]
      },
      faqs: {
        create: [
          { question: 'Do you provide emergency services?', answer: 'Yes, we provide emergency plumbing services till 10:00 PM.' },
          { question: 'Do you charge for visiting?', answer: 'A nominal visiting charge of ₹100 is applicable if no service is opted.' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Vikram Singh', rating: 4, comment: 'Called them for water pump installation. He arrived within an hour and completed the job at a reasonable price.' },
          { userName: 'Maya Jadhav', rating: 5, comment: 'Very polite and professional service. Fixed the bathroom leakage quickly.' },
          { userName: 'Aniket Varma', rating: 4, comment: 'Prompt response. Good experience.' }
        ]
      }
    }
  });

  // 4. Modern Unisex Salon & Academy (Salon - Silver)
  const b4 = await prisma.business.create({
    data: {
      name: 'Modern Unisex Salon & Academy',
      category: 'Salons',
      description: 'Your destination for luxury hair care, beauty treatments, bridal makeup, and skin rejuvenation. Learn professional cosmetology from certified experts at our academy.',
      address: 'Shop A/4, Navkar Heights, Chikuwadi, Boisar West, 401501',
      phone: '+91 93322 11000',
      whatsapp: '+91 93322 11000',
      website: 'https://modernsalonboisar.business.site',
      verified: true,
      premium: false,
      subscription: 'Silver',
      rating: 4.5,
      reviewCount: 2,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      workingHours: '10:00 AM - 9:00 PM',
      location: 'Boisar West',
      views: 750,
      phoneClicks: 65,
      whatsappClicks: 110,
      directionClicks: 90,
      products: {
        create: [
          { name: 'Professional Hair Wax', price: 450, description: 'Strong hold hair styling wax infused with natural argan oil.' },
          { name: 'Organic Face Wash', price: 299, description: 'Teatree & Neem clarifying face cleanser for glowing skin.' }
        ]
      },
      services: {
        create: [
          { name: 'Trendy Haircut & Styling', price: 200, duration: '30 mins', description: 'Personalized haircut, wash, and style consultation.' },
          { name: 'Hydra Facial Treatment', price: 1800, duration: '1 hour', description: 'Deep cleansing, exfoliation, and hydration treatment.' },
          { name: 'Bridal Makeover Package', price: 8000, duration: '3 hours', description: 'HD bridal makeup, hair styling, draping, and jewelry setting.' }
        ]
      },
      faqs: {
        create: [
          { question: 'Is prior booking required for bridal packages?', answer: 'Yes, booking bridal services at least 15 days in advance is highly recommended.' },
          { question: 'Do you accept card payments?', answer: 'Yes, we accept UPI, debit/credit cards, and cash.' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Pooja Rane', rating: 5, comment: 'Excellent staff! Got my hair colored and the results are amazing. Best salon in Chikuwadi Boisar.' },
          { userName: 'Hiren Shah', rating: 4, comment: 'Good hair stylist. Rates are slightly on the higher side but quality of service is top notch.' }
        ]
      }
    }
  });

  // 5. Sharda Coaching Classes (Coaching Classes - Gold)
  const b5 = await prisma.business.create({
    data: {
      name: 'Sharda Coaching Classes',
      category: 'Coaching Classes',
      description: 'Sharda Classes is the leading educational institute in Boisar, providing coaching for 8th to 12th State Board, CBSE, ICSE, and competitive exams like JEE, NEET, and MHT-CET.',
      address: '2nd Floor, Sharda Complex, Opp. Railway Station, Boisar West, 401501',
      phone: '+91 88888 77777',
      whatsapp: '+91 88888 77777',
      verified: false,
      premium: false,
      subscription: 'Gold',
      rating: 4.7,
      reviewCount: 3,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      workingHours: '8:00 AM - 8:30 PM',
      location: 'Boisar West',
      views: 890,
      phoneClicks: 112,
      whatsappClicks: 124,
      directionClicks: 65,
      services: {
        create: [
          { name: '10th Board Coaching (Full Year)', price: 25000, duration: '1 year', description: 'Complete study prep for Maths, Science, English, and Social Studies with test series.' },
          { name: 'JEE Main & Advanced Crack Course', price: 45000, duration: '1 year', description: 'Intensive coaching by expert faculties from Kota, includes module sheets and weekly mocks.' }
        ]
      },
      faqs: {
        create: [
          { question: 'Do you offer demo classes?', answer: 'Yes, we provide 3 days of free trial/demo classes for new students.' },
          { question: 'Do you offer hybrid classes?', answer: 'Yes, students can attend classes online if they miss physical lectures.' }
        ]
      },
      reviews: {
        create: [
          { userName: 'Kunal Gharat', rating: 5, comment: 'Best teachers in Boisar. They focus on concept clarity and conduct regular tests which helped me score 94% in my boards.' },
          { userName: 'Pratik Patil', rating: 4, comment: 'Excellent study material. Teachers are helpful. The location is very convenient.' },
          { userName: 'Seema Thakur', rating: 5, comment: 'Personal attention is given to students. Weekly progress is shared with parents.' }
        ]
      }
    }
  });

  // Seed Leads to show inside dashboards
  await prisma.lead.createMany({
    data: [
      {
        businessId: b1.id,
        customerName: 'Karan Malhotra',
        customerPhone: '+91 98900 12345',
        customerEmail: 'karan@gmail.com',
        query: 'Want to book the banquet hall for a ring ceremony on 25th August for 150 guests. Need catering quote.',
        status: 'Pending',
        notes: 'Waiting for catering menu selection from customer.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        businessId: b1.id,
        customerName: 'Rohan Deshmukh',
        customerPhone: '+91 97600 54321',
        customerEmail: 'rohan.d@yahoo.com',
        query: 'Need booking for 3 executive rooms for corporate guests starting tomorrow for 2 nights.',
        status: 'Won',
        notes: 'Room booked. Advance payment received.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        businessId: b1.id,
        customerName: 'Sunita Nair',
        customerPhone: '+91 95400 98765',
        customerEmail: 'sunita@hotmail.com',
        query: 'Quote for kitty party lunch menu for 25 ladies on coming Saturday.',
        status: 'Lost',
        notes: 'Customer opted for another restaurant due to pricing difference.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        businessId: b2.id,
        customerName: 'Priya Joshi',
        customerPhone: '+91 93200 45678',
        customerEmail: 'priya.j@gmail.com',
        query: 'Want to book pediatric consultation appointment for 2-year-old child on Wednesday evening.',
        status: 'Won',
        notes: 'Appointment scheduled for Wednesday 6:30 PM.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        businessId: b3.id,
        customerName: 'Rajesh Solanki',
        customerPhone: '+91 90044 11223',
        customerEmail: 'rajesh@gmail.com',
        query: 'Water tank leakage at my flat in Ostwal Empire. Need plumber urgently.',
        status: 'Pending',
        notes: 'Assigned plumber Suresh. On the way.',
        createdAt: new Date() // today
      }
    ]
  });

  // Seed Jobs
  const job1 = await prisma.job.create({
    data: {
      businessId: b1.id,
      title: 'Restaurant Manager',
      type: 'Full Time',
      description: 'Looking for an experienced Restaurant Manager to oversee operations, staff, and customer experience. Must have 3+ years experience in hospitality.',
      salary: '₹25,000 - ₹35,000 / month',
      location: 'Boisar West',
      status: 'Open',
    }
  });

  const job2 = await prisma.job.create({
    data: {
      businessId: b2.id,
      title: 'Receptionist / Front Desk',
      type: 'Part Time',
      description: 'Seeking a polite and organized receptionist for evening shifts at our clinic. Basic computer skills required.',
      salary: '₹8,000 - ₹12,000 / month',
      location: 'Boisar East',
      status: 'Open',
    }
  });

  // Seed Job Applications
  await prisma.jobApplication.createMany({
    data: [
      {
        jobId: job1.id,
        applicantName: 'Suresh Raina',
        applicantPhone: '9876543211',
        applicantEmail: 'suresh.r@example.com',
        resumeUrl: 'https://docs.google.com/document/d/example',
        status: 'Pending',
      },
      {
        jobId: job2.id,
        applicantName: 'Priya Desai',
        applicantPhone: '9123456789',
        applicantEmail: 'priya.desai@example.com',
        resumeUrl: 'https://docs.google.com/document/d/example2',
        status: 'Reviewed',
      }
    ]
  });

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
