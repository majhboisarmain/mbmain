import type { Metadata } from 'next';
import React from 'react';
import { BOISAR_HOTELS } from '@/lib/hotelsData';

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const hotel = BOISAR_HOTELS.find(h => h.id === id || h.slug === id);

  if (!hotel) {
    return {
      title: 'Hotel Booking in Boisar — Hourly & Night Stay',
      description: 'Book verified couple-friendly hotels in Boisar with flexible hourly and overnight stays.',
    };
  }

  const startingPrice = hotel.rooms && hotel.rooms.length > 0
    ? Math.min(...hotel.rooms.map(r => r.hourly3h || r.nightRate))
    : 349;

  return {
    title: `${hotel.name} Boisar — Rooms from ₹${startingPrice}`,
    description: `Book ${hotel.name} in Boisar from ₹${startingPrice}. Verified AC rooms, couple friendly, hourly 3h/6h slots & night stays near ${hotel.landmark || 'Boisar'}. Pay at Hotel Desk.`,
    keywords: [
      hotel.name.toLowerCase(),
      `${hotel.name.toLowerCase()} boisar`,
      `${hotel.name.toLowerCase()} room price`,
      `${hotel.name.toLowerCase()} contact number`,
      'hotels in boisar',
      'couple friendly hotels in boisar'
    ],
    openGraph: {
      title: `${hotel.name} Boisar — Rooms from ₹${startingPrice} | Majh Boisar`,
      description: `Book ${hotel.name} in Boisar. Verified AC rooms, couple friendly, hourly & night stays near ${hotel.landmark || 'Boisar'}.`,
      url: `https://majhboisar.in/hotels/${hotel.slug || hotel.id}`,
      images: hotel.gallery && hotel.gallery[0] ? [{ url: hotel.gallery[0] }] : undefined,
    },
  };
}

export default function HotelDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
