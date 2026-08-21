'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EmergencyModal from './EmergencyModal';
import BusTimetableModal from './BusTimetableModal';
import LocalOffersModal from './LocalOffersModal';
import CommunityEventsModal from './CommunityEventsModal';
import LocalMarketplaceModal from './LocalMarketplaceModal';
import BookExchangeModal from './BookExchangeModal';
import TempoHelplineModal from './TempoHelplineModal';
import HomeTechniciansModal from './HomeTechniciansModal';
import SportsTurfModal from './SportsTurfModal';
import HotelBookingModal from './HotelBookingModal';
import ResortVillaModal from './ResortVillaModal';

export default function LocalHubPills() {
  const router = useRouter();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [busOpen, setBusOpen] = useState(false);
  const [offersOpen, setOffersOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [tempoOpen, setTempoOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [turfOpen, setTurfOpen] = useState(false);
  const [hotelOpen, setHotelOpen] = useState(false);
  const [resortOpen, setResortOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Cards sorted in a logical, user-friendly order with Home Services prominently placed
  const localCards = [
    {
      id: 'technicians',
      title: 'Home Services',
      image: '/imagess/home technician.png',
      onClick: () => router.push('/services')
    },
    {
      id: 'resorts',
      title: 'Resorts & Pool Villas',
      image: '/imagess/resort booking.png',
      onClick: () => router.push('/resorts')
    },
    {
      id: 'hotels',
      title: 'Hotel & Hourly Stay',
      image: '/imagess/hotel booking.png',
      onClick: () => router.push('/hotels')
    },
    {
      id: 'emergency',
      title: 'Emergency Call',
      image: '/imagess/emergency call.png',
      onClick: () => setEmergencyOpen(true)
    },
    {
      id: 'blood',
      title: 'Blood Donors',
      image: '/imagess/blood donor.png',
      onClick: () => router.push('/blood-donation')
    },
    {
      id: 'bus',
      title: 'Bus Timetable',
      image: '/imagess/bus time tble.png',
      onClick: () => setBusOpen(true)
    },
    {
      id: 'turf',
      title: 'Sports Turf & Game Zone',
      image: '/imagess/turf game.png',
      onClick: () => setTurfOpen(true)
    },
    {
      id: 'events',
      title: 'Events & Jobs',
      image: '/imagess/events.png',
      onClick: () => setEventsOpen(true)
    },
    {
      id: 'marketplace',
      title: 'Used Items',
      image: '/imagess/used items.png',
      onClick: () => setMarketplaceOpen(true)
    },
    {
      id: 'tempo',
      title: 'Chota Hathi Tempo',
      image: '/imagess/tempo servies.png',
      onClick: () => setTempoOpen(true)
    },
    {
      id: 'offers',
      title: 'Shop Offers',
      image: '/imagess/shop offer.png',
      onClick: () => setOffersOpen(true)
    },
    {
      id: 'books',
      title: 'Books Exchange',
      image: '/imagess/book exchnges.png',
      onClick: () => setBookOpen(true)
    }
  ];

  // Auto-slide loop when idle (pauses on hover / touch)
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 180, behavior: 'smooth' });
        }
      }
    }, 2800);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -240 : 240, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div id="trending-search-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                Trending Searches Near You
              </h3>
              <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 animate-pulse">
                NEW
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleManualScroll('left')}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center cursor-pointer transition-all border border-slate-200"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center cursor-pointer transition-all border border-slate-200"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider — slightly larger image zoom on hover (scale-110 → scale-115) */}
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth w-full"
          >
            {localCards.map(card => (
              <button
                key={card.id}
                onClick={card.onClick}
                className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 snap-start bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.04] active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Feature Modals — rendered via portal to escape stacking context */}
      {typeof window !== 'undefined' && ReactDOM.createPortal(
        <>
          <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
          <BusTimetableModal isOpen={busOpen} onClose={() => setBusOpen(false)} />
          <LocalOffersModal isOpen={offersOpen} onClose={() => setOffersOpen(false)} />
          <CommunityEventsModal isOpen={eventsOpen} onClose={() => setEventsOpen(false)} />
          <LocalMarketplaceModal isOpen={marketplaceOpen} onClose={() => setMarketplaceOpen(false)} />
          <BookExchangeModal isOpen={bookOpen} onClose={() => setBookOpen(false)} />
          <TempoHelplineModal isOpen={tempoOpen} onClose={() => setTempoOpen(false)} />
          <HomeTechniciansModal isOpen={techOpen} onClose={() => setTechOpen(false)} />
          <SportsTurfModal isOpen={turfOpen} onClose={() => setTurfOpen(false)} />
          <HotelBookingModal isOpen={hotelOpen} onClose={() => setHotelOpen(false)} />
          <ResortVillaModal isOpen={resortOpen} onClose={() => setResortOpen(false)} />
        </>,
        document.body
      )}
    </>
  );
}

