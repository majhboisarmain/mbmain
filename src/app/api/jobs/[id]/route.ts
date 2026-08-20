import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true,
            phone: true,
            whatsapp: true,
            verified: true,
            email: true,
            address: true
          }
        },
        applications: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!job) {
      const DEFAULT_BOISAR_JOBS = [
        {
          id: 101,
          title: 'Senior Accounts Executive (Tally Prime / GST)',
          type: 'Full Time',
          description: 'Handling day-to-day accounts, GST filing, TDS reconciliation, and vendor payments for MIDC manufacturing plant. 2+ years experience required.',
          salary: '₹25,000 - ₹35,000 / month',
          location: 'Tarapur MIDC, Boisar',
          status: 'Open',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          businessId: 1,
          business: {
            id: 1,
            name: 'Shree Chem Industries Ltd.',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
            location: 'Tarapur MIDC Gate 2',
            phone: '9822114455',
            whatsapp: '919822114455',
            verified: true,
            email: 'hr@shreechem.com',
            address: 'Plot No. N-45, Tarapur MIDC, Boisar, Palghar 401506'
          },
          applications: []
        },
        {
          id: 102,
          title: 'Chemical Plant Production Supervisor',
          type: 'Full Time',
          description: 'Supervising batch operations, plant safety standards, shift scheduling, and raw material monitoring in chemical unit.',
          salary: '₹28,000 - ₹40,000 / month',
          location: 'Tarapur MIDC Zone 1',
          status: 'Open',
          createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
          businessId: 2,
          business: {
            id: 2,
            name: 'Tarapur Polymer & Chemicals',
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
            location: 'MIDC Road, Salwad',
            phone: '9822445566',
            whatsapp: '919822445566',
            verified: true,
            email: 'jobs@tarapurpolymer.com',
            address: 'Plot E-12, MIDC Salwad, Boisar 401506'
          },
          applications: []
        },
        {
          id: 103,
          title: 'Front Desk Receptionist & Guest Executive',
          type: 'Full Time',
          description: 'Handling guest check-ins, phone reservations, billing software, and customer queries. Good spoken Hindi and basic English required.',
          salary: '₹18,000 - ₹24,000 / month',
          location: 'Ostwal Empire, Boisar (West)',
          status: 'Open',
          createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
          businessId: 3,
          business: {
            id: 3,
            name: 'Freesia by Express Inn',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
            location: 'Ostwal Empire Main Road',
            phone: '8149998666',
            whatsapp: '918149998666',
            verified: true,
            email: 'stay@freesiaexpress.com',
            address: 'Opp. Ostwal Empire Mall, Boisar West'
          },
          applications: []
        },
        {
          id: 104,
          title: 'Retail Store Sales & Cashier Executive',
          type: 'Full Time',
          description: 'Customer assistance, billing counter management, stock display and inventory counts at garment & lifestyle store.',
          salary: '₹15,000 - ₹20,000 / month',
          location: 'Navapur Road, Boisar',
          status: 'Open',
          createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
          businessId: 4,
          business: {
            id: 4,
            name: 'Style Club Lifestyle Retail',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
            location: 'Near Boisar Bus Depot',
            phone: '9028551030',
            whatsapp: '919028551030',
            verified: true,
            email: 'careers@styleclubboisar.com',
            address: 'Navapur Naka, Boisar'
          },
          applications: []
        },
        {
          id: 105,
          title: 'Staff Nurse (ICU & General Ward)',
          type: 'Full Time',
          description: 'Patient care, vital monitoring, medication administration, and doctor assistance. GNM or B.Sc Nursing qualification required.',
          salary: '₹22,000 - ₹32,000 / month',
          location: 'Chitralaya Road, Boisar',
          status: 'Open',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          businessId: 5,
          business: {
            id: 5,
            name: 'City General Hospital & ICU',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200',
            location: 'Opp. Harmony Plaza, Boisar',
            phone: '7264951994',
            whatsapp: '917264951994',
            verified: true,
            email: 'admin@citygeneralboisar.com',
            address: 'Chitralaya Road, Boisar'
          },
          applications: []
        },
        {
          id: 106,
          title: 'CNC & VMC Machine Operator',
          type: 'Full Time',
          description: 'Operating CNC turning & milling machines, drawing reading, measuring tool usage (Vernier/Micrometer). ITI Machinist preferred.',
          salary: '₹20,000 - ₹27,000 / month',
          location: 'Tarapur MIDC Gate No. 1',
          status: 'Open',
          createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          businessId: 6,
          business: {
            id: 6,
            name: 'Apex Precision Engineering',
            image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200',
            location: 'Tarapur MIDC, Boisar',
            phone: '9822338899',
            whatsapp: '919822338899',
            verified: true,
            email: 'hr@apexprecision.in',
            address: 'Plot W-18, MIDC Tarapur'
          },
          applications: []
        },
        {
          id: 107,
          title: 'Primary English & Science Teacher',
          type: 'Full Time',
          description: 'Teaching primary grade students (1st to 5th), preparing lesson plans, and classroom engagement. D.Ed / B.Ed qualification preferred.',
          salary: '₹18,000 - ₹26,000 / month',
          location: 'Khaira, Boisar (East)',
          status: 'Open',
          createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          businessId: 7,
          business: {
            id: 7,
            name: 'Bright Future Academy',
            image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200',
            location: 'Khaira Road, Boisar',
            phone: '7385153162',
            whatsapp: '917385153162',
            verified: true,
            email: 'admin@brightfutureboisar.org',
            address: 'Khaira Road, Boisar East'
          },
          applications: []
        },
        {
          id: 108,
          title: 'Field Delivery Associate (Bike Rider)',
          type: 'Part Time',
          description: 'Local package and grocery delivery across Boisar, Kolwade and Tarapur. Must have valid driving license and smartphone.',
          salary: '₹16,000 - ₹22,000 / month + Fuel',
          location: 'Station Road, Boisar',
          status: 'Open',
          createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
          businessId: 8,
          business: {
            id: 8,
            name: 'Express Local Logistics',
            image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=200',
            location: 'Near Boisar Railway Station',
            phone: '9822014455',
            whatsapp: '919822014455',
            verified: true,
            email: 'jobs@expresslogistics.in',
            address: 'Station Road, Boisar West'
          },
          applications: []
        }
      ];

      const found = DEFAULT_BOISAR_JOBS.find(j => j.id === jobId);
      if (found) {
        return NextResponse.json(found);
      }

      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    await prisma.job.delete({
      where: { id: jobId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);
    const body = await request.json();

    const job = await prisma.job.update({
      where: { id: jobId },
      data: body
    });

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
