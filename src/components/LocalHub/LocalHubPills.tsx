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

  // Cards sorted to highlight fresh utilities not shown in the top section
  const localCards = [
    {
      id: 'blood',
      title: 'Blood Donors',
      image: '/imagess/blood donor.png',
      onClick: () => router.push('/blood-donation')
    },
    {
      id: 'emergency',
      title: 'Emergency Call',
      image: '/imagess/emergency call.png',
      onClick: () => setEmergencyOpen(true)
    },
    {
      id: 'bus',
      title: 'Bus Timetable',
      image: '/imagess/bus time tble.png',
      onClick: () => setBusOpen(true)
    },
    {
      id: 'books',
      title: 'Books Exchange',
      image: '/imagess/book exchnges.png',
      onClick: () => setBookOpen(true)
    },
    {
      id: 'events',
      title: 'Events & Weddings',
      image: '/imagess/events.png',
      onClick: () => setEventsOpen(true)
    },
    {
      id: 'tempo',
      title: 'Packers & Movers Tempo',
      image: '/imagess/tempo servies.png',
      onClick: () => router.push('/hire-vehicle?category=tempo')
    },
    {
      id: 'turf',
      title: 'Sports Turf & Game Zone',
      image: '/imagess/turf game.png',
      onClick: () => setTurfOpen(true)
    },
    {
      id: 'offers',
      title: 'Shop Offers',
      image: '/imagess/shop offer.png',
      onClick: () => setOffersOpen(true)
    },
    {
      id: 'marketplace',
      title: 'Used Items',
      image: '/imagess/used items.png',
      onClick: () => setMarketplaceOpen(true)
    },
    {
      id: 'jobs',
      title: 'Jobs in Boisar & MIDC',
      image: '/imagess/carrers jobs.png',
      onClick: () => router.push('/jobs')
    },
    {
      id: 'hotels',
      title: 'Hotel & Hourly Stay',
      image: '/imagess/hotel booking.png',
      onClick: () => router.push('/hotels')
    },
    {
      id: 'resorts',
      title: 'Resorts & Pool Villas',
      image: '/imagess/resort booking.png',
      onClick: () => router.push('/resorts')
    },
    {
      id: 'travels',
      title: 'Hire Vehicle & Travels',
      image: '/imagess/travels.png',
      onClick: () => router.push('/hire-vehicle')
    },
    {
      id: 'home-services',
      title: 'Home Services',
      image: '/imagess/home servvies pill.png',
      onClick: () => router.push('/services')
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
        <div 
          style={{ background: 'linear-gradient(135deg, #f0fdf9 0%, #e6f7f6 40%, #edf6ff 100%)' }}
          className="border border-teal-200/90 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-teal-200/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-teal-600"></span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Trending Searches Near You
              </h3>
              <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 animate-pulse shadow-xs">
                NEW
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleManualScroll('left')}
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white active:scale-95 text-slate-700 hover:text-teal-900 flex items-center justify-center cursor-pointer transition-all border border-teal-200/80 shadow-2xs"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white active:scale-95 text-slate-700 hover:text-teal-900 flex items-center justify-center cursor-pointer transition-all border border-teal-200/80 shadow-2xs"
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

