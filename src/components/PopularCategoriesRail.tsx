'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface PopularCategoryItem {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  bgColor: string;
  route: string;
  badge?: string;
}

const POPULAR_CATEGORIES: PopularCategoryItem[] = [
  {
    id: 'protein',
    name: 'Protein & Supplements',
    subtitle: 'Whey, BCAA & Shakers',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-amber-100/70',
    route: '/search?q=Protein+Supplements',
    badge: 'Popular'
  },
  {
    id: 'gyms',
    name: 'Gyms & Fitness',
    subtitle: 'Workouts & Crossfit',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-indigo-100/70',
    route: '/search?category=Gyms',
    badge: 'Trending'
  },
  {
    id: 'pathology',
    name: 'Pathology & Blood Tests',
    subtitle: 'Labs & Health Checkups',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-sky-100/70',
    route: '/search?category=Diagnostic%20Labs',
    badge: 'Diagnostic'
  },
  {
    id: 'medical_stores',
    name: 'Medical & Pharmacy',
    subtitle: 'Medicines & First Aid',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-rose-100/70',
    route: '/search?category=Medical%20Stores'
  },
  {
    id: 'doctors',
    name: 'Doctors & Clinics',
    subtitle: 'Specialists & Physicians',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-teal-100/70',
    route: '/search?category=Doctors'
  },
  {
    id: 'hospitals',
    name: 'Hospitals & Emergency',
    subtitle: '24x7 Multi-Speciality',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-red-100/70',
    route: '/search?category=Hospitals'
  },
  {
    id: 'baby_care',
    name: 'Baby & Mother Care',
    subtitle: 'Diapers, Lotions & Wipes',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-purple-100/70',
    route: '/search?q=Baby+Care'
  },
  {
    id: 'opticians',
    name: 'Eye Care & Opticians',
    subtitle: 'Glasses & Testing',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=360&q=80',
    bgColor: 'bg-cyan-100/70',
    route: '/search?category=Opticians'
  }
];

export default function PopularCategoriesRail() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-7 sm:mt-9">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 mb-3.5 sm:mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight">
              Popular categories
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              <Sparkles className="w-3 h-3" /> Trending in Boisar
            </span>
          </div>
          <div className="h-1 w-12 sm:w-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-1"></div>
        </div>

        {/* Scroll Arrows for Desktop / Tablet */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Categories Rail */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 pt-1 px-0.5 no-scrollbar scroll-smooth snap-x select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {POPULAR_CATEGORIES.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(item.route)}
            className="group shrink-0 w-[110px] sm:w-[130px] md:w-[140px] bg-white rounded-2xl border border-slate-200/80 p-2 sm:p-2.5 shadow-sm hover:shadow-lg hover:border-orange-300/80 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center snap-start relative"
          >
            {item.badge && (
              <span className="absolute top-1.5 right-1.5 text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded-full bg-orange-500 text-white shadow-xs z-10">
                {item.badge}
              </span>
            )}

            {/* Inner Pastel Box with Product Image */}
            <div className={`w-full aspect-square rounded-xl ${item.bgColor} overflow-hidden p-2 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105`}>
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover rounded-lg shadow-2xs group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/imagess/shop offer.png';
                }}
              />
            </div>

            {/* Title Label below */}
            <p className="text-[11px] sm:text-xs font-bold text-slate-800 text-center leading-tight mt-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
