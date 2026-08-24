'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, MapPin, CheckCircle, Star, Sparkles, X,
  ChevronRight, ChevronLeft, Phone, Send, Info,
  Filter, Heart, Award, ShieldCheck, Mail, ShoppingBag, Truck
} from 'lucide-react';
import AdModal from '@/components/AdModal';
import SportsTurfModal from '@/components/LocalHub/SportsTurfModal';
import { useApp } from '@/context/AppContext';

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  premium: boolean;
  subscription: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  location: string;
  views?: number;
  distanceKm?: number | null;
  services: { id: number; name: string }[];
  products?: { id: number; name: string; price: number; image?: string }[];
}

export default function SearchClient() {
  const { isLoggedIn, setLoginModalOpen } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL params
  const urlQuery = searchParams.get('query') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlLocation = searchParams.get('location') || 'All';

  // Search input states
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedLocation, setSelectedLocation] = useState(urlLocation);

  // User GPS Location State (for 1km Near Me)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const detectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGettingLocation(false);
      },
      (err) => {
        console.warn("Location permission denied or error:", err.message);
        setLocationError("Location permission denied. Showing popular businesses.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Sports Turf / Game Zone modal state
  const [turfModalOpen, setTurfModalOpen] = useState(false);
  const [turfTab, setTurfTab] = useState<'turf' | 'game'>('game');

  useEffect(() => {
    const q = (urlQuery || '').toLowerCase();
    const cat = (urlCategory || '').toLowerCase();

    const isGameQuery = q.includes('game') || q.includes('ps5') || q.includes('vr') || q.includes('arcade') || q.includes('snooker') || cat.includes('game');
    const isTurfQuery = q.includes('turf') || q.includes('cricket') || q.includes('football') || cat.includes('turf');

    if (isGameQuery) {
      setTurfTab('game');
      setTurfModalOpen(true);
    } else if (isTurfQuery) {
      setTurfTab('turf');
      setTurfModalOpen(true);
    }
  }, [urlQuery, urlCategory]);

  // Listings and loading states
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterRating, setFilterRating] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'none'>('none');

  // Lead Modal states
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryBusiness, setEnquiryBusiness] = useState<Business | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Lead Form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadType, setLeadType] = useState('Residential');

  // Sponsored Ads State
  const [topBannerAd, setTopBannerAd] = useState<any>(null);
  const [sidebarAds, setSidebarAds] = useState<any[]>([]);

  // Ad Modal State
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adModalPackage, setAdModalPackage] = useState<string | null>(null);

  // Fetch function
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      let url = `/api/businesses?`;
      if (urlCategory && urlCategory !== 'All') url += `category=${encodeURIComponent(urlCategory)}&`;
      if (selectedLocation && selectedLocation !== 'All') url += `location=${encodeURIComponent(selectedLocation)}&`;
      if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
      if (filterVerified) url += `verified=true&`;
      if (filterRating) url += `rating=4.5&`;
      if (userCoords) {
        url += `userLat=${userCoords.lat}&userLng=${userCoords.lng}&`;
      }

      const res = await fetch(url);
      const data = await res.json();

      // Apply client-side sorting if needed (Featured / Premium always top)
      let resultData = [...data];
      resultData.sort((a, b) => {
        if (a.premium && !b.premium) return -1;
        if (!a.premium && b.premium) return 1;
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === 'popularity') {
          return ((b.views || 0) + (b.reviewCount || 0)) - ((a.views || 0) + (a.reviewCount || 0));
        }
        return 0;
      });

      setBusinesses(resultData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when params change
  useEffect(() => {
    fetchBusinesses();
  }, [searchParams, filterVerified, filterRating, sortBy, userCoords]);

  // Fetch Ads (API + Local Storage fallback)
  useEffect(() => {
    const fetchAds = async () => {
      try {
        let activeAds: any[] = [];
        
        try {
          const res = await fetch('/api/ad-orders', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              activeAds = data.filter((ad: any) => ad.status === 'Approved' || !ad.status || ad.status === 'Active');
            }
          }
        } catch (err) {
          console.log("Ad API fetch error, checking localStorage", err);
        }

        // Also check localStorage custom ads
        const localAds = JSON.parse(localStorage.getItem('majh_boisar_ads') || '[]');
        const customAds = JSON.parse(localStorage.getItem('majh_boisar_custom_ads') || '[]');
        const allAds = [...activeAds, ...localAds, ...customAds];

        // Top Banner (1 Slot)
        const topAd = allAds.find((ad: any) => 
          ad.placement === 'Category Top Banner' || 
          ad.placement === 'Results Leaderboard' || 
          ad.placement === 'Top Header Strip' ||
          ad.placement === 'Category Page Ad' ||
          ad.placement === 'Carousel Slide' ||
          ad.placement === '7-Day Bundle (All Spots)' ||
          ad.placement === '30-Day VIP Bundle (All Spots)' ||
          ad.placement === 'All Placements (Run Everywhere)' ||
          ad.placement === 'Run Everywhere (Auto-Fits All)' ||
          ad.image
        );

        if (topAd) {
          setTopBannerAd({
            id: topAd._id || topAd.id,
            businessName: topAd.businessName || topAd.title || 'Sponsored Business',
            title: topAd.title || topAd.businessName,
            description: topAd.description || topAd.subtitle || 'Reach 50,000+ local customers every month!',
            image: topAd.image || topAd.imageUrl || topAd.bannerImage,
            targetUrl: topAd.targetUrl || topAd.url || '#'
          });
        }

        // Sidebar Ads
        if (allAds.length > 0) {
          const sideAds = allAds.map((ad: any) => ({
            id: ad._id || ad.id,
            businessName: ad.businessName || ad.title,
            title: ad.title || ad.businessName,
            description: ad.description || ad.subtitle,
            image: ad.image || ad.imageUrl,
            targetUrl: ad.targetUrl || '#'
          }));
          setSidebarAds(sideAds);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchAds();
  }, []);

  // Handle Top Search Submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let url = `/search?`;
    if (urlCategory) url += `category=${encodeURIComponent(urlCategory)}&`;
    if (selectedLocation && selectedLocation !== 'All') url += `location=${encodeURIComponent(selectedLocation)}&`;
    if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
    router.push(url);
  };

  // Handle Enquiry submit (Local trigger)
  const handleEnquirySubmit = (e: React.FormEvent, isSidebar = false) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      alert("Please fill your Name and Mobile Number!");
      return;
    }
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setEnquiryModalOpen(false);
      setLeadName('');
      setLeadPhone('');
      alert("Enquiry sent successfully! Local sellers will contact you shortly.");
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-16 text-slate-800 font-sans bg-[#f8fafc]">


      {/* 2. Top Leaderboard Advertisement Banner */}
      <div className="mx-auto px-3 sm:px-6 lg:px-8 mt-2 sm:mt-3 max-w-5xl">
        <div className="w-full rounded-xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 border border-teal-500/30 overflow-hidden shadow-sm relative group">
          {topBannerAd?.image ? (
            /* 100% Cover/Fit Image Banner (No Crop / Cut Off on Laptop & Mobile) */
            <a 
              href={topBannerAd.targetUrl || (topBannerAd.businessId ? `/business/${topBannerAd.businessId}` : 'https://wa.me/917769947217?text=Hello%20Majh%20Boisar!%20I%20want%20to%20advertise%20my%20business.')} 
              target={topBannerAd.targetUrl ? "_blank" : "_self"} 
              rel={topBannerAd.targetUrl ? "noopener noreferrer" : ""} 
              className="block w-full h-20 sm:h-28 md:h-32 max-h-[140px] relative overflow-hidden bg-slate-950 group flex items-center justify-center"
            >
              <img 
                src={topBannerAd.image} 
                className="w-full h-full object-contain group-hover:scale-[1.01] transition-transform duration-500" 
                alt={topBannerAd.title || topBannerAd.businessName || "Sponsored Ad"} 
              />
              <div className="absolute top-1.5 right-2 bg-black/60 backdrop-blur-sm text-white text-[7.5px] font-black uppercase tracking-wider px-1 py-0.5 rounded shadow-sm z-30">
                AD
              </div>
            </a>
          ) : null}
        </div>
      </div>

      {/* 3. Main Search Body - Compact & Clean */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-3">

        {/* Search Metadata & Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Palghar &gt; Boisar &gt; {urlCategory || 'Local Services'}
            </p>
            <h1 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>{urlCategory || 'Local Services'} in Boisar, Palghar</span>
              {!loading && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {businesses.length} {businesses.length === 1 ? 'Listing' : 'Listings'}
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Filters Row - Compact scrollable row */}
        <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-200/60 pb-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth">
          {/* GPS Near Me (1 km) button */}
          <button
            onClick={detectLocation}
            disabled={gettingLocation}
            className={`px-2.5 py-1 rounded-md border text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              userCoords
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <MapPin className={`w-3 h-3 ${userCoords ? 'text-white' : 'text-emerald-700'} ${gettingLocation ? 'animate-bounce' : ''}`} />
            <span>{gettingLocation ? 'Locating...' : userCoords ? 'Near Me (1 km) ON' : 'Near Me (1 km)'}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="none">Sort by</option>
              <option value="rating">Top Rated</option>
              <option value="popularity">Most Views</option>
            </select>
          </div>

          <button
            onClick={() => setFilterRating(!filterRating)}
            className={`px-2 py-1 rounded-md border text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${filterRating
                ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span>4.5+ Rated</span>
          </button>

          <button
            onClick={() => setFilterVerified(!filterVerified)}
            className={`px-2 py-1 rounded-md border text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${filterVerified
                ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>MB Verified</span>
          </button>

          <button
            onClick={() => alert("Special offers and discounts are active on verified listings.")}
            className="px-2 py-1 rounded-md border bg-white border-slate-200 text-slate-600 hover:border-slate-300 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>% Deals</span>
          </button>

          {/* If userCoords or filter active, show Clear button */}
          {(userCoords || filterRating || filterVerified || sortBy !== 'none') && (
            <button
              onClick={() => {
                setUserCoords(null);
                setFilterRating(false);
                setFilterVerified(false);
                setSortBy('none');
              }}
              className="text-[10px] text-rose-600 hover:underline font-bold ml-1 cursor-pointer shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Location Status Banner (Only when GPS active or error) */}
        {userCoords ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold flex items-center justify-between mb-2.5 shadow-2xs">
            <span className="flex items-center gap-1 truncate">
              📍 Showing listings sorted by distance from your location (1 km)
            </span>
            <button onClick={() => setUserCoords(null)} className="text-[10px] text-emerald-700 hover:underline font-bold cursor-pointer shrink-0 ml-2">
              Clear
            </button>
          </div>
        ) : locationError ? (
          <div className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md text-[10.5px] font-medium flex items-center justify-between mb-2.5">
            <span>⚠️ {locationError}</span>
            <button onClick={detectLocation} className="text-[10px] text-teal-700 underline font-bold cursor-pointer shrink-0 ml-2">
              Try Again
            </button>
          </div>
        ) : null}

        {/* Main Grid Layout (8 cols for listings, 4 cols for sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: Businesses Listings (8 cols) */}
          <div className="lg:col-span-8 space-y-4">

            {loading ? (
              // Loading Skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 flex flex-row gap-3 sm:gap-4 animate-pulse">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 bg-slate-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      <div className="h-3 sm:h-4 w-3/4 bg-slate-100 rounded" />
                      <div className="h-3 w-1/4 bg-slate-100 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                      <div className="h-8 w-1/3 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : businesses.length > 0 ? (
              // Active Listings
              businesses.map((business) => {
                const rawImage = business.image || '/majh-boisar-mb-logo.png';
                const imageParts = rawImage.split('||gallery_sep||').filter(Boolean);
                const coverImage = imageParts[0] || '/majh-boisar-mb-logo.png';
                const galleryPhotos = Array.isArray(business.gallery) && business.gallery.length > 0
                  ? business.gallery.filter(Boolean)
                  : imageParts.slice(1);
                const allPhotos = Array.from(new Set([coverImage, ...galleryPhotos])).filter(Boolean);

                const displayAddress = business.address.toLowerCase().includes((business.location || '').toLowerCase())
                  ? business.address
                  : `${business.address}${business.location ? `, ${business.location}` : ''}`;

                const hasHomeDelivery = business.subscription === 'Pro' || (business.products && business.products.length > 0);

                return (
                  <div
                    key={business.id}
                    onClick={() => router.push(`/business/${business.id}`)}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-teal-500/40 transition-all duration-200 relative group cursor-pointer flex flex-col text-left"
                  >
                    {/* Top Section: Main Cover Photo Banner */}
                    <div className="relative w-full h-44 sm:h-52 bg-slate-900 overflow-hidden flex items-center justify-center">
                      <img
                        src={coverImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-35 scale-110 pointer-events-none"
                      />
                      <img
                        src={coverImage}
                        alt={business.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/majh-boisar-mb-logo.png'; }}
                        className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 z-15 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-1.5 pointer-events-none">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {hasHomeDelivery && (
                            <span className="bg-emerald-600/95 text-white text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1 backdrop-blur-xs">
                              <Truck className="w-3 h-3 text-white" />
                              <span>Home Delivery</span>
                            </span>
                          )}
                          {business.verified && (
                            <span className="bg-teal-700/90 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <div className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            <span>{business.rating}</span>
                            <Star className="w-2.5 h-2.5 fill-white text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Overlay Info (Visits & Distance) */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 z-20 flex items-center justify-between text-white text-[10px] font-extrabold pointer-events-none">
                        {business.views != null && business.views > 0 ? (
                          <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] text-amber-300 border border-white/10">
                            👁️ {business.views.toLocaleString()} visits
                          </span>
                        ) : <span />}

                        {business.distanceKm != null && (
                          <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] text-emerald-300 border border-white/10">
                            📍 {business.distanceKm} km away
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Gallery Photos Preview Strip (if more than 1 photo available) */}
                    {allPhotos.length > 1 && (
                      <div className="px-3 pt-2.5 pb-1 flex gap-2 overflow-x-auto scrollbar-hide bg-slate-50/70 border-b border-slate-100">
                        {allPhotos.slice(0, 5).map((imgUrl, pIdx) => (
                          <div
                            key={pIdx}
                            className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-200/90 shrink-0 bg-white shadow-2xs relative group/thumb"
                          >
                            <img
                              src={imgUrl}
                              alt={`Thumbnail ${pIdx + 1}`}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform"
                            />
                            {pIdx === 4 && allPhotos.length > 5 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[9px] font-black">
                                +{allPhotos.length - 5}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Middle Section: Business Information Details */}
                    <div className="p-3.5 space-y-2 flex-1">
                      {/* Business Name Header */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug hover:text-teal-700 transition-colors line-clamp-2">
                          <Link href={`/business/${business.id}`} onClick={(e) => e.stopPropagation()}>
                            {business.name}
                          </Link>
                        </h3>
                        <span className="text-[10px] font-extrabold text-slate-400 shrink-0 mt-0.5">
                          {business.reviewCount} {business.reviewCount === 1 ? 'Rating' : 'Ratings'}
                        </span>
                      </div>

                      {/* Location Address Block */}
                      <p className="text-[11px] sm:text-xs text-slate-600 font-medium flex items-start gap-1.5 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span>{displayAddress}</span>
                      </p>

                      {/* Category & Services Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="bg-teal-50 border border-teal-200/80 text-teal-800 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md">
                          {business.category}
                        </span>
                        {business.services?.slice(0, 2).map((srv) => (
                          <span key={srv.id} className="bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md">
                            {srv.name}
                          </span>
                        ))}
                        {hasHomeDelivery && (
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span>⚡ Delivery in Boisar</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Section: Action Buttons Full-Width Strip */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2.5 pt-0 border-t border-slate-100 w-full mt-auto">
                      {/* Phone button */}
                      <a
                        href={isLoggedIn ? `tel:${business.phone}` : '#'}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLoggedIn) {
                            e.preventDefault();
                            setLoginModalOpen(true);
                          }
                        }}
                        className="bg-[#09843c] hover:bg-[#07682f] text-white font-black text-[10px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-white shrink-0" />
                        <span className="truncate">{isLoggedIn ? business.phone : 'Call'}</span>
                      </a>

                      {/* WhatsApp button */}
                      <a
                        href={isLoggedIn ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I found your business on Majh Boisar. I would like to inquire about your services/delivery.`)}` : '#'}
                        target={isLoggedIn ? "_blank" : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLoggedIn) {
                            e.preventDefault();
                            setLoginModalOpen(true);
                          }
                        }}
                        className="bg-white border border-[#09843c] text-[#09843c] font-black text-[10px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all hover:bg-emerald-50 cursor-pointer shadow-2xs"
                      >
                        <svg className="w-3 h-3 fill-[#09843c] shrink-0" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.48 2.016 14.005 1.002 11.995 1.002 6.559 1.002 2.135 5.372 2.131 10.801c-.001 1.76.46 3.479 1.336 5.003L2.5 21.53l5.837-1.526-.69.41z" />
                        </svg>
                        <span className="truncate">WhatsApp</span>
                      </a>

                      {/* Order / Enquiry button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasHomeDelivery) {
                            router.push(`/business/${business.id}?tab=catalog`);
                            return;
                          }
                          if (!isLoggedIn) {
                            setLoginModalOpen(true);
                            return;
                          }
                          setEnquiryBusiness(business);
                          setEnquiryModalOpen(true);
                        }}
                        className={`${hasHomeDelivery ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0076db] hover:bg-[#0062b8]'} text-white font-black text-[10px] sm:text-xs px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] cursor-pointer`}
                      >
                        {hasHomeDelivery ? (
                          <>
                            <ShoppingBag className="w-3 h-3 text-white shrink-0" />
                            <span className="truncate">Order Online</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-white shrink-0" />
                            <span className="truncate">Enquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty search state
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-2xs space-y-3">
                <div className="h-12 w-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 text-xl">
                  🏪
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">
                    No {urlCategory && urlCategory !== 'All' ? urlCategory : 'Businesses'} Found in Boisar
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                    Try broadening your search keywords or clear the category filter to explore all local directories.
                  </p>
                </div>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterVerified(false);
                      setFilterRating(false);
                      setSearchQuery('');
                      setSelectedLocation('All');
                      router.push('/search');
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs"
                  >
                    View All Categories
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Lead Form & Airtel Banner Ads (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Google / Majh Boisar Banner Advertisement Stack */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">

              {/* Ad Card 1 */}
              {sidebarAds[0]?.image ? (
                /* Clean 100% Direct Image Banner (No colored gradient, No opacity overlay, No text over image) */
                <a 
                  href={sidebarAds[0].targetUrl || (sidebarAds[0].businessId ? `/business/${sidebarAds[0].businessId}` : 'https://wa.me/918208712398')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full aspect-[300/250] rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group block cursor-pointer bg-slate-950"
                >
                  <img src={sidebarAds[0].image} alt={sidebarAds[0].title || "Advertisement"} className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500" />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none z-20 backdrop-blur-sm shadow-sm">AD</div>
                </a>
              ) : sidebarAds[0] ? (
                /* Booked Business Listing Ad (Shows View Business, NOT Advertise Now) */
                <div className="w-full aspect-[300/250] bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-2xl border border-indigo-900 p-3 sm:p-5 shadow-sm text-white relative overflow-hidden group flex flex-col justify-between text-left">
                  <div className="absolute top-2.5 right-2.5 bg-black/35 text-white/70 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none z-20">AD</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2.5">
                      <span className="bg-white text-indigo-700 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{sidebarAds[0].businessName ? sidebarAds[0].businessName.substring(0, 10) : 'Sponsored'}</span>
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Sponsored</span>
                    </div>
                    <h4 className="text-[13px] sm:text-lg font-black leading-tight mb-0.5 sm:mb-1">{sidebarAds[0].title || sidebarAds[0].businessName}</h4>
                    <p className="text-[9px] sm:text-[10px] text-indigo-100 font-semibold line-clamp-2 leading-tight">{sidebarAds[0].description || 'Promoted verified local business in Boisar.'}</p>
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full mt-auto">
                    <a
                      href={sidebarAds[0].targetUrl || `/business/${sidebarAds[0].businessId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white hover:bg-slate-100 text-indigo-800 font-black text-[9px] sm:text-[10px] py-1.5 sm:py-2 rounded-lg shadow-sm hover:scale-102 transition-all cursor-pointer text-center mt-2 sm:mt-3 uppercase tracking-wider block"
                    >
                      View Business ➔
                    </a>
                  </div>
                </div>
              ) : (
                /* Unbooked Empty Ad Slot */
                <div className="w-full aspect-[300/250] bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-2xl border border-indigo-900 p-3 sm:p-5 shadow-sm text-white relative overflow-hidden group flex flex-col justify-between text-left">
                  <div className="absolute top-2.5 right-2.5 bg-black/35 text-white/70 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none z-20">AD</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2.5">
                      <span className="bg-white text-indigo-700 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Majh Boisar</span>
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Sponsored</span>
                    </div>
                    <h4 className="text-[13px] sm:text-lg font-black leading-tight mb-0.5 sm:mb-1">Get 5x More Local Customers!</h4>
                    <p className="text-[9px] sm:text-[10px] text-indigo-100 font-semibold line-clamp-2 leading-tight">Advertise your business in this premium slot and reach 50,000+ buyers.</p>
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full mt-auto">
                    <button
                      onClick={() => {
                        setAdModalPackage('Category Page Ad');
                        setAdModalOpen(true);
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-indigo-800 font-black text-[9px] sm:text-[10px] py-1.5 sm:py-2 rounded-lg shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer text-center mt-2 sm:mt-3 uppercase tracking-wider block"
                    >
                      Advertise Now ➔
                    </button>
                  </div>
                </div>
              )}

              {/* Ad Card 2 */}
              {sidebarAds[1]?.image ? (
                /* Clean 100% Direct Image Banner */
                <a 
                  href={sidebarAds[1].targetUrl || (sidebarAds[1].businessId ? `/business/${sidebarAds[1].businessId}` : 'https://wa.me/917769947217')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full aspect-[300/250] rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group block cursor-pointer bg-slate-950"
                >
                  <img src={sidebarAds[1].image} alt={sidebarAds[1].title || "Advertisement"} className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500" />
                  <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none z-20 backdrop-blur-sm shadow-sm">AD</div>
                </a>
              ) : sidebarAds[1] ? (
                /* Booked Business Listing Ad */
                <div className="w-full aspect-[300/250] bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 rounded-2xl border border-teal-900 p-3 sm:p-5 shadow-sm text-white relative overflow-hidden group flex flex-col justify-between text-left">
                  <div className="absolute top-2.5 right-2.5 bg-black/35 text-white/70 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none z-20">AD</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2.5">
                      <span className="bg-white text-teal-700 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase">{sidebarAds[1].businessName ? sidebarAds[1].businessName.substring(0, 10) : 'Verified'}</span>
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Verified</span>
                    </div>
                    <h4 className="text-[13px] sm:text-lg font-black leading-tight mb-0.5 sm:mb-1">{sidebarAds[1].title || sidebarAds[1].businessName}</h4>
                    <p className="text-[9px] sm:text-[10px] text-teal-100 font-semibold line-clamp-2 leading-tight">{sidebarAds[1].description || 'Promoted business in Boisar.'}</p>
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full mt-auto">
                    <a
                      href={sidebarAds[1].targetUrl || `/business/${sidebarAds[1].businessId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white hover:bg-slate-100 text-teal-800 font-black text-[9px] sm:text-[10px] py-1.5 sm:py-2 rounded-lg shadow-sm hover:scale-102 transition-all cursor-pointer text-center mt-2 sm:mt-3 uppercase tracking-wider block"
                    >
                      View Business ➔
                    </a>
                  </div>
                </div>
              ) : (
                /* Unbooked Empty Ad Slot */
                <div className="w-full aspect-[300/250] bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 rounded-2xl border border-teal-900 p-3 sm:p-5 shadow-sm text-white relative overflow-hidden group flex flex-col justify-between text-left">
                  <div className="absolute top-2.5 right-2.5 bg-black/35 text-white/70 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider select-none z-20">AD</div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2.5">
                      <span className="bg-white text-teal-700 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Majh Boisar</span>
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Verified</span>
                    </div>
                    <h4 className="text-[13px] sm:text-lg font-black leading-tight mb-0.5 sm:mb-1">Grow Your Business Locally</h4>
                    <p className="text-[9px] sm:text-[10px] text-teal-100 font-semibold line-clamp-2 leading-tight">List your shop, service or clinic for free in Boisar’s #1 local directory.</p>
                  </div>
                  <div className="relative z-10 flex flex-col justify-end h-full mt-auto">
                    <button
                      onClick={() => {
                        setAdModalPackage('Homepage Banner Spotlight');
                        setAdModalOpen(true);
                      }}
                      className="w-full bg-white hover:bg-slate-100 text-teal-800 font-black text-[9px] sm:text-[10px] py-1.5 sm:py-2 rounded-lg shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer text-center mt-2 sm:mt-3 uppercase tracking-wider block"
                    >
                      Get Featured ➔
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* 4. Overlay Lead Enquiry Modal Form */}
      {enquiryModalOpen && enquiryBusiness && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full hover:bg-slate-100 text-slate-450 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5 mt-1">
              <span className="text-2xl">✉️</span>
              <h3 className="font-extrabold text-slate-800 text-sm mt-2 leading-tight">
                Send Enquiry to {enquiryBusiness.name}
              </h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase mt-1 tracking-wider">
                Category: {enquiryBusiness.category}
              </p>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Full Name"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 font-bold placeholder-slate-400"
              />
              <input
                type="tel"
                placeholder="Your Mobile Number"
                required
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 font-bold placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={enquirySuccess}
                className="w-full btn-teal text-white font-black text-xs py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 uppercase"
              >
                {enquirySuccess ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Ad Packages Modal */}
      <AdModal
        isOpen={adModalOpen}
        onClose={() => setAdModalOpen(false)}
        highlightedPackageName={adModalPackage}
      />

      {/* Sports Turf & Game Zone Modal */}
      <SportsTurfModal
        isOpen={turfModalOpen}
        onClose={() => setTurfModalOpen(false)}
        defaultTab={turfTab}
      />

    </div>
  );
}
