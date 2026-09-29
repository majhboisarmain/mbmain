'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useApp, Role } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import LoginModal from './LoginModal';
const MyHotelPassesModal = dynamic(() => import('./MyHotelPassesModal'), { ssr: false });
import {
  Search, MapPin, User, Shield, Briefcase, ChevronDown, Check,
  Menu, X, LogOut, Building, Layers, HelpCircle, MessageSquare, ChevronRight, Smartphone, Download, Ticket, Plus,
  Sparkles, Heart, Utensils, Car, Stethoscope, Building2, ArrowLeft, Receipt, FileText, ShieldCheck, Settings,
  Home, Wrench, Droplet, Compass, Hotel, PhoneCall
} from 'lucide-react';

import { CATEGORY_CATALOG, getCategorySearchSuggestions } from '@/lib/categoryMapping';

export default function Navbar() {
  const { currentRole, setRole, userName, isLoggedIn, loggedInUser, updateUserProfile, logout, loginModalOpen, setLoginModalOpen, setAdModalOpen, showToast, hasRegisteredBusiness } = useApp();
  const { t } = useLanguage();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isHotelPassesModalOpen, setIsHotelPassesModalOpen] = useState(false);
  const [userHotelPassCount, setUserHotelPassCount] = useState(0);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const refreshUserHotelPasses = () => {
    if (typeof window === 'undefined') return;
    if (!isLoggedIn || !loggedInUser?.phone) {
      setUserHotelPassCount(0);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      const hiddenIds = JSON.parse(localStorage.getItem('majh_boisar_user_hidden_passes') || '[]');
      const userPhoneClean = (loggedInUser?.phone || '').replace(/\D/g, '');
      const myPasses = stored.filter((p: any) => {
        const guestPhoneClean = (p.guestPhone || '').replace(/\D/g, '');
        return guestPhoneClean === userPhoneClean && !hiddenIds.includes(p.id);
      });
      setUserHotelPassCount(myPasses.length);
    } catch (e) {
      setUserHotelPassCount(0);
    }
  };

  useEffect(() => {
    refreshUserHotelPasses();
    const handleUpdate = () => refreshUserHotelPasses();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('majh_boisar_hotel_bookings_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('majh_boisar_hotel_bookings_updated', handleUpdate);
    };
  }, [isLoggedIn, loggedInUser?.phone]);

  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [navLocation, setNavLocation] = useState('All');
  const [isNavSearchFocused, setIsNavSearchFocused] = useState(false);
  const [navMatchingBusinesses, setNavMatchingBusinesses] = useState<any[]>([]);

  const matchingNavCategories = React.useMemo(() => {
    if (!navSearchQuery.trim()) return [];
    const suggestions = getCategorySearchSuggestions(navSearchQuery, 5);
    return suggestions.map((s) => s.title);
  }, [navSearchQuery]);

  useEffect(() => {
    if (!navSearchQuery.trim()) {
      setNavMatchingBusinesses([]);
      return;
    }
    const timer = setTimeout(() => {
      const q = navSearchQuery.trim().toLowerCase();
      const rawTokens = q.split(/\s+/).filter(t => t.length > 0);
      const filteredTokens = rawTokens.filter(t => !['in', 'near', 'me', 'boisar', 'tarapur', 'palghar', 'best', 'top', 'service', 'services'].includes(t));
      const searchTokens = filteredTokens.length > 0 ? filteredTokens : rawTokens;

      fetch(`/api/businesses?query=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const filtered = data.filter((b: any) => {
              const nameLower = (b.name || '').toLowerCase();
              const catLower = (b.category || '').toLowerCase();
              const descLower = (b.description || '').toLowerCase();
              const addrLower = (b.address || '').toLowerCase();

              return searchTokens.some(st =>
                nameLower.includes(st) ||
                catLower.includes(st) ||
                descLower.includes(st) ||
                addrLower.includes(st)
              );
            });
            setNavMatchingBusinesses(filtered.slice(0, 3));
          }
        })
        .catch(console.error);
    }, 200);
    return () => clearTimeout(timer);
  }, [navSearchQuery]);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  const handleRequestAccountDeletion = () => {
    const reqUser = loggedInUser?.name || userName || 'Registered User';
    const reqPhone = loggedInUser?.phone || 'Not Provided';
    const reqEmail = loggedInUser?.email || '';

    const newReq = {
      id: Date.now(),
      userName: reqUser,
      userPhone: reqPhone,
      userEmail: reqEmail,
      reason: 'Account deletion requested via User Menu / Settings',
      requestedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending'
    };

    try {
      const existingStr = localStorage.getItem('majh_boisar_deletion_requests');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newReq, ...existing];
      localStorage.setItem('majh_boisar_deletion_requests', JSON.stringify(updated));
      window.dispatchEvent(new Event('majh_boisar_deletion_requests_updated'));
    } catch (e) {
      console.error("Failed to save deletion request", e);
    }

    alert(`🗑️ Account Deletion Request (#DEL-${newReq.id.toString().slice(-4)}) has been submitted to Admin.\nUser: ${reqUser} (${reqPhone})\nAdmin will process and remove your account within 24 hours.`);
  };

  useEffect(() => {
    if (searchParams) {
      setNavSearchQuery(searchParams.get('query') || '');
      setNavLocation(searchParams.get('location') || 'All');
    }
  }, [searchParams]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleTouchMove = (e: TouchEvent) => {
        const drawer = document.getElementById('profile-nav-drawer') || document.getElementById('mobile-nav-drawer');
        if (drawer && !drawer.contains(e.target as Node)) {
          if (e.cancelable) e.preventDefault();
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
      if (pathname === '/') {
        setIsScrolledPastHero(window.scrollY > 220);
      } else {
        setIsScrolledPastHero(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const showHeaderSearch = pathname.startsWith('/search') || pathname.startsWith('/business') || pathname.startsWith('/category') || (pathname === '/' && isScrolledPastHero);

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = `/search?`;
    if (searchParams && searchParams.get('category')) {
      url += `category=${encodeURIComponent(searchParams.get('category') || '')}&`;
    }
    if (navLocation && navLocation !== 'All') {
      url += `location=${encodeURIComponent(navLocation)}&`;
    }
    if (navSearchQuery) {
      url += `query=${encodeURIComponent(navSearchQuery)}&`;
    }
    router.push(url);
  };

  const roles: { val: Role; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      val: 'Guest',
      label: 'Guest User',
      desc: 'Browse businesses, read reviews',
      icon: <Search className="w-4 h-4 text-slate-405" />
    },
    {
      val: 'User',
      label: 'Registered User',
      desc: 'Write reviews, request quotes, favorites',
      icon: <Check className="w-4 h-4 text-slate-405" />
    },
    {
      val: 'BusinessOwner',
      label: 'Business Owner',
      desc: 'Manage listing, view leads, catalog',
      icon: <Building className="w-4 h-4 text-slate-405" />
    },
    {
      val: 'Admin',
      label: 'Platform Admin',
      desc: 'Verify businesses, moderate ratings',
      icon: <Layers className="w-4 h-4 text-slate-405" />
    }
  ];

  return (
    <>
      <header className={`sticky top-0 z-[150] bg-white transition-all duration-200 overflow-visible pt-[env(safe-area-inset-top,0px)] ${
        isScrolled
          ? 'shadow-[0_4px_25px_rgba(0,0,0,0.12)] border-b border-slate-300'
          : 'border-b border-slate-200/90'
      }`}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center justify-between gap-1.5 sm:gap-4 overflow-visible">

          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <Link href="/" className="flex items-center group py-0.5">
              <img
                src="/majh-boisar-full-logo.png"
                alt="Majh Boisar"
                loading="eager"
                decoding="async"
                className="h-10 sm:h-12 md:h-13 max-w-[200px] min-[390px]:max-w-[230px] sm:max-w-none w-auto object-contain transition-transform duration-200 hover:scale-[1.03]"
              />
            </Link>
          </div>

          {/* Middle Search Bar (Desktop / Tablet - Mobile search is placed inside drawer for spacious view) */}
          <div className="hidden sm:flex flex-1 max-w-lg min-w-0 transition-all duration-300 relative z-50">
            {showHeaderSearch && (
              <form onSubmit={handleNavSearchSubmit} className="flex items-center gap-1.5 w-full min-w-0">
                {/* Location Select (Map pin circle button - Hidden on Mobile) */}
                <div className="hidden sm:flex relative h-8 w-8 rounded-full items-center justify-center bg-slate-50 border border-slate-200 hover:border-teal-500/30 transition-all shrink-0 group">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                  <select
                    value={navLocation}
                    onChange={(e) => {
                      setNavLocation(e.target.value);
                      let url = `/search?`;
                      if (searchParams && searchParams.get('category')) url += `category=${encodeURIComponent(searchParams.get('category') || '')}&`;
                      url += `location=${encodeURIComponent(e.target.value)}&`;
                      if (navSearchQuery) url += `query=${encodeURIComponent(navSearchQuery)}&`;
                      router.push(url);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full"
                  >
                    <option value="All">All Boisar</option>
                    <option value="Boisar West">Boisar West</option>
                    <option value="Boisar East">Boisar East</option>
                    <option value="Tarapur MIDC">Tarapur MIDC</option>
                    <option value="Ostwal Empire">Ostwal Empire</option>
                  </select>
                </div>

                {/* Keyword Input wrapper */}
                <div className="bg-slate-50 border border-slate-200 rounded-full p-0.5 flex items-center gap-1.5 flex-1 shadow-sm focus-within:border-teal-500/50 transition-all h-9 min-w-0">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 w-full min-w-0">
                    <Search className="w-3 h-3 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={navSearchQuery}
                      onChange={(e) => {
                        setNavSearchQuery(e.target.value);
                        setIsNavSearchFocused(true);
                      }}
                      onFocus={() => setIsNavSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsNavSearchFocused(false), 250)}
                      placeholder={t('nav.search_placeholder')}
                      className="bg-transparent border-0 text-[10px] focus:outline-none w-full text-slate-800 placeholder-slate-400 font-extrabold"
                    />
                    {navSearchQuery && (
                      <button type="button" onClick={() => setNavSearchQuery('')} className="p-1 rounded-full hover:bg-slate-200 text-slate-450 shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="h-7 w-7 rounded-full btn-teal text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:scale-102 active:scale-98 transition-all mr-0.5"
                    title="Search Directory"
                  >
                    <Search className="w-3 h-3 text-white" />
                  </button>
                </div>
              </form>
            )}

            {/* Live Instant Search Suggestions Dropdown for Navbar */}
            {showHeaderSearch && navSearchQuery.trim().length > 0 && isNavSearchFocused && (
              <div className="absolute top-full -left-8 right-0 sm:left-0 sm:right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[100] overflow-hidden text-left animate-in fade-in duration-150 max-h-[65vh] sm:max-h-[380px] overflow-y-auto min-w-[280px] sm:min-w-0">

                {/* Direct Portal Shortcut for Travels / Vehicles */}
                {(() => {
                  const qLower = navSearchQuery.toLowerCase().trim();
                  const isVehicleQuery = ['tempo', 'car', 'cab', 'taxi', 'bus', 'auto', 'rickshaw', 'riksha', 'travels', 'travel', 'driver', 'vehicle', 'shifting', 'chota hathi', 'bike'].some(k => qLower.includes(k) || (qLower.length >= 3 && k.startsWith(qLower)));
                  if (isVehicleQuery) {
                    return (
                      <div 
                        onClick={() => {
                          setNavSearchQuery('');
                          setIsNavSearchFocused(false);
                          router.push('/hire-vehicle');
                        }}
                        className="p-2 sm:p-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200/60 cursor-pointer flex items-center justify-between hover:from-orange-100 hover:to-amber-100 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            🚗
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 leading-tight group-hover:text-orange-950">Boisar Travels &amp; Vehicle Hire</p>
                            <p className="text-[10px] text-orange-800 font-bold leading-tight">Cars, Autos, Tempos &amp; Buses (Direct Driver Contact)</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-orange-600 text-white font-black px-2 py-0.5 rounded-md shadow-2xs shrink-0">Open Hub →</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* 1. Matching Categories Section (Max 5) */}
                {matchingNavCategories.length > 0 && (
                  <div className="p-1 sm:p-2 border-b border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1 flex items-center gap-1">
                      <span>🏷️</span> Categories ({matchingNavCategories.length})
                    </div>
                    <div className="space-y-0.5">
                      {matchingNavCategories.map((cat, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setNavSearchQuery('');
                            setIsNavSearchFocused(false);
                            router.push(`/search?category=${encodeURIComponent(cat)}`);
                          }}
                          className="px-2.5 py-1 sm:py-1.5 rounded-xl hover:bg-teal-50/80 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-teal-100/60 text-teal-700 flex items-center justify-center text-[10px] font-black shrink-0">
                              {cat.charAt(0)}
                            </div>
                            <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-teal-700 truncate">{cat}</span>
                          </div>
                          <span className="text-[9px] text-teal-600 font-extrabold shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">Explore →</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Verified Business Listings Section (Max 3) */}
                {navMatchingBusinesses.length > 0 && (
                  <div className="p-1 sm:p-2 border-b border-slate-100">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1 flex items-center gap-1">
                      <span>🏢</span> Verified Businesses ({navMatchingBusinesses.length})
                    </div>
                    <div className="space-y-0.5">
                      {navMatchingBusinesses.map((biz) => (
                        <Link
                          key={biz.id}
                          href={`/business/${biz.id}`}
                          onClick={() => setIsNavSearchFocused(false)}
                          className="px-2.5 py-1 sm:py-1.5 rounded-xl hover:bg-teal-50/80 cursor-pointer flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={biz.image || "/majh-boisar-mb-logo.png"}
                              alt={biz.name}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] sm:text-xs font-black text-slate-900 group-hover:text-teal-700 truncate">{biz.name}</p>
                              <p className="text-[9px] text-slate-500 font-medium truncate">{biz.category} • {biz.location || 'Boisar'}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Suggestions Fallback */}
                {matchingNavCategories.length === 0 && navMatchingBusinesses.length === 0 && (
                  <div className="p-3 text-center">
                    <p className="text-xs font-bold text-slate-700">No instant results for "{navSearchQuery}"</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Press Enter to search all results in Boisar</p>
                  </div>
                )}

                <div
                  onClick={(e) => {
                    setIsNavSearchFocused(false);
                    handleNavSearchSubmit(e as any);
                  }}
                  className="bg-slate-50 p-2 sm:p-2.5 text-center text-[11px] sm:text-xs font-black text-teal-700 hover:bg-teal-50 cursor-pointer border-t border-slate-100 transition-colors"
                >
                  Search all results for "{navSearchQuery}" →
                </div>
              </div>
            )}
          </div>

          {/* Right-Side Navigation Items */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-3 text-[11px] font-black text-slate-555 mr-2">
            </nav>


            {/* Advertise */}
            <Link
              href="/advertise"
              className="text-xs text-slate-555 hover:text-teal-600 transition-colors font-semibold cursor-pointer"
            >
              {t('nav.advertise')}
            </Link>

            {/* Register Your Business CTA — only for users without a registered business */}
            {mounted && !hasRegisteredBusiness && currentRole !== 'BusinessOwner' && currentRole !== 'Admin' && (loggedInUser as any)?.role !== 'BusinessOwner' && (loggedInUser as any)?.role !== 'Admin' && (
              <Link
                href="/dashboard?register=true"
                className="btn-teal text-xs font-black px-3 py-1.5 rounded-lg hover:shadow-md transition-shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isLoggedIn ? 'Register Your Business' : t('nav.free_listing')}</span>
              </Link>
            )}

            {/* Help Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setHelpDropdownOpen(!helpDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="flex flex-col items-center justify-center text-slate-555 hover:text-teal-650 transition-colors group cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 text-slate-405 group-hover:text-teal-655 transition-colors" />
                <span className="text-[10px] font-bold mt-1 text-slate-555 group-hover:text-teal-655 transition-colors leading-none">{t('nav.help')}</span>
              </button>

              {helpDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setHelpDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl z-[100] animate-fade-in text-left">
                    <div className="space-y-1">
                      <a
                        href="https://instagram.com/majhboisar"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setHelpDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-pink-600 hover:text-pink-700 transition-colors text-left text-xs font-bold p-1 hover:bg-pink-50 rounded-lg cursor-pointer"
                      >
                        <span className="text-base">📸</span>
                        <span>Follow @majhboisar on Instagram</span>
                      </a>

                      <button
                        onClick={() => {
                          setHelpDropdownOpen(false);
                          alert("Raise a Complaint: Please email majhboisar@gmail.com with the listing or dispute details.");
                        }}
                        className="flex items-center gap-2.5 w-full text-slate-655 hover:text-slate-800 transition-colors text-left text-xs font-bold p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <span className="text-slate-400 font-bold text-base">📝</span>
                        <span>Raise a Complaint</span>
                      </button>

                      {isLoggedIn && (
                        <button
                          onClick={() => {
                            setHelpDropdownOpen(false);
                            handleRequestAccountDeletion();
                          }}
                          className="flex items-center gap-2.5 w-full text-rose-600 hover:text-rose-800 transition-colors text-left text-xs font-bold p-1 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <span className="text-rose-400 font-bold text-base">🗑️</span>
                          <span>Request Account Deletion</span>
                        </button>
                      )}

                      <Link
                        href="/advertise?track=true"
                        onClick={() => setHelpDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-slate-655 hover:text-teal-650 transition-colors text-left text-xs font-bold p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <span className="text-slate-405 font-bold text-base">📊</span>
                        <span>Track Ad Campaign</span>
                      </Link>

                      <div className="border-t border-slate-100 my-2 pt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-bold p-1">
                          <span className="text-slate-400 text-sm">✉️</span>
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 leading-none">Official Support &amp; Help</span>
                            <a href="mailto:majhboisar@gmail.com" className="text-[11px] text-slate-800 font-black mt-0.5 hover:text-teal-600">majhboisar@gmail.com</a>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setHelpDropdownOpen(false);
                            window.open("https://wa.me/917769947217", "_blank");
                          }}
                          className="flex items-center gap-2.5 w-full text-slate-655 hover:text-slate-800 transition-colors text-left text-xs font-bold p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                          <span className="text-slate-400 text-base">💬</span>
                          <span>Chat on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>



            {/* Sign In / Account Button */}
            <div className="relative">
              {mounted && isLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(true);
                    setProfileDropdownOpen(false);
                    setHelpDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E0D7FE] text-[#6C47FF] flex items-center justify-center font-black text-xs shrink-0 border border-[#CDBEFE]">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-purple-700 transition-colors max-w-[100px] truncate">
                    {userName.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setProfileDropdownOpen(false);
                    setHelpDropdownOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-[#E0D7FE] text-[#6C47FF] hover:bg-[#D5C6FE] border border-[#CDBEFE] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
                  title="Sign In"
                >
                  <User className="w-5 h-5 text-[#6C47FF] stroke-[2]" />
                </button>
              )}

              {/* Profile/Sign-In Dropdown */}
              {profileDropdownOpen && !isLoggedIn && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-[100] animate-fade-in text-left">
                    {!isLoggedIn ? (
                      // Guest View Dropdown (matching IndiaMART-style)
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setLoginModalOpen(true);
                          }}
                          className="w-full btn-teal text-center font-black text-xs py-2.5 rounded-xl shadow-md cursor-pointer hover:brightness-105 active:scale-98 transition-transform"
                        >
                          Sign In
                        </button>
                        <p className="text-[10px] text-center text-slate-500 font-bold">
                          New to Majh Boisar?{" "}
                          <span
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              setLoginModalOpen(true);
                            }}
                            className="text-teal-600 cursor-pointer hover:underline"
                          >
                            Join Now
                          </span>
                        </p>

                        <hr className="border-slate-100 my-1" />

                        <div className="space-y-1">
                          <Link
                            href="/download-app"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors font-extrabold border border-teal-200/80"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-teal-600">📱</span>
                              <span>Install Mobile App</span>
                            </div>
                            <span className="bg-teal-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">NEW</span>
                          </Link>

                          <Link
                            href="/"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs text-slate-655 hover:bg-slate-50 hover:text-slate-800 transition-colors font-bold"
                          >
                            <span className="text-slate-400">🏠</span>
                            <span>Home</span>
                          </Link>

                          <Link
                            href="/dashboard?register=true"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs text-slate-655 hover:bg-slate-50 hover:text-slate-800 transition-colors font-bold"
                          >
                            <span className="text-slate-400">🏢</span>
                            <span>Add / Register Your Business</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      // Logged-in View Dropdown (Clean, Cohesive Zomato District Style)
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-[#E0D7FE] text-[#6C47FF] flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate leading-tight">{userName || 'User'}</p>
                            <p className="text-[10.5px] font-semibold text-slate-500 truncate mt-0.5">{loggedInUser?.phone || '+91 9307294733'}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {/* View All Bookings */}
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              setIsHotelPassesModalOpen(true);
                            }}
                            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 transition-colors font-bold group cursor-pointer text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <Receipt className="w-4 h-4 text-slate-600 stroke-[1.8]" />
                              <span>View All Bookings</span>
                            </div>
                            {userHotelPassCount > 0 && (
                              <span className="text-[9px] bg-teal-600 text-white font-black px-1.5 py-0.5 rounded-full">
                                {userHotelPassCount}
                              </span>
                            )}
                          </button>

                          {/* Business Dashboard or Register */}
                          {isLoggedIn && !hasRegisteredBusiness && currentRole !== 'Admin' && (loggedInUser as any)?.role !== 'Admin' && currentRole !== 'BusinessOwner' && (loggedInUser as any)?.role !== 'BusinessOwner' ? (
                            <Link
                              href="/dashboard?register=true"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 transition-colors font-bold group"
                            >
                              <div className="flex items-center gap-2.5">
                                <Building2 className="w-4 h-4 text-slate-600 stroke-[1.8]" />
                                <span>Register Your Business</span>
                              </div>
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded">FREE</span>
                            </Link>
                          ) : (
                            <Link
                              href="/dashboard"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 transition-colors font-bold group"
                            >
                              <Building2 className="w-4 h-4 text-slate-600 stroke-[1.8]" />
                              <span>My Business Dashboard</span>
                            </Link>
                          )}

                          {/* Admin Panel */}
                          {(currentRole === 'Admin' || (loggedInUser as any)?.role === 'Admin') && (
                            <Link
                              href="/adminmb"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 transition-colors font-bold group"
                            >
                              <Shield className="w-4 h-4 text-rose-600 stroke-[1.8]" />
                              <span>Admin Control Panel</span>
                            </Link>
                          )}

                          {/* Install Mobile App */}
                          <Link
                            href="/download-app"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 transition-colors font-bold group"
                          >
                            <div className="flex items-center gap-2.5">
                              <Smartphone className="w-4 h-4 text-slate-600 stroke-[1.8]" />
                              <span>Install Mobile App</span>
                            </div>
                          </Link>

                          {/* Settings */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditName(loggedInUser?.name || userName || '');
                              setEditEmail(loggedInUser?.email || '');
                              setSettingsSuccess('');
                              setSettingsModalOpen(true);
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-800 hover:bg-slate-50 transition-colors font-bold cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-slate-600 stroke-[1.8]" />
                            <span>Account Settings</span>
                          </button>
                        </div>

                        <hr className="border-slate-100 my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-700 hover:text-rose-600 hover:bg-rose-50/70 transition-colors font-bold text-left cursor-pointer group"
                        >
                          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-600 stroke-[1.8] transition-colors" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Profile / Menu Button (Colored Circular Avatar matching user screenshot) */}
          <div className="flex md:hidden items-center shrink-0 relative z-30 ml-auto">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label={isLoggedIn ? "Account Profile Menu" : "Open Navigation Menu"}
              className="w-10 h-10 rounded-full bg-[#E0D7FE] text-[#6C47FF] hover:bg-[#D5C6FE] active:scale-95 border border-[#CDBEFE] flex items-center justify-center shadow-2xs transition-all cursor-pointer touch-manipulation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#6C47FF] stroke-[2.2]" />
              ) : isLoggedIn ? (
                <span className="font-black text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </span>
              ) : (
                <Menu className="w-5 h-5 stroke-[2.2] text-[#6C47FF]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Desktop Slide-over Navigation & Profile Drawer (Mounted directly on document.body to prevent any iOS Safari sticky/backdrop-filter clipping) */}
      {mounted && mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          {/* Backdrop with blur - clicking closes drawer */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Right Panel */}
          <div
            id="profile-nav-drawer"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-full bg-[#F4F5F7] shadow-2xl overflow-y-auto overscroll-contain touch-pan-y z-[100000] flex flex-col justify-between animate-in slide-in-from-right duration-250"
          >
            <div className="w-full space-y-3 p-4 sm:p-5 pt-[max(14px,env(safe-area-inset-top))] pb-[max(32px,calc(2rem+env(safe-area-inset-bottom)))]">
              {/* Header Title with Back Arrow & Close Button */}
              <div className="flex items-center justify-between pb-2 pt-0.5 border-b border-slate-200/80 mb-1">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Back"
                    className="p-1.5 -ml-1 rounded-full hover:bg-slate-200/80 active:bg-slate-300 transition-colors cursor-pointer text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                  </button>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {isLoggedIn ? 'Profile & Menu' : 'Menu'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-full hover:bg-slate-200/80 active:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>

              {/* 1. User Header or Guest Sign-In Card */}
              {isLoggedIn ? (
                <div className="flex items-center justify-between py-2 px-1">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-13 h-13 rounded-full bg-[#E0D7FE] text-[#6C47FF] flex items-center justify-center font-black text-xl shrink-0 shadow-2xs">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug truncate">{userName || 'User'}</h3>
                      <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">{loggedInUser?.phone || '+91 9307294733'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(loggedInUser?.name || userName || '');
                      setEditEmail(loggedInUser?.email || '');
                      setSettingsSuccess('');
                      setSettingsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-[#E0D7FE] text-[#6C47FF] flex items-center justify-center shrink-0 font-black text-lg">
                      <User className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 leading-tight">Welcome to Majh Boisar</p>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">Sign in to manage bookings &amp; listings</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginModalOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-black text-white text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* 2. View All Bookings Box */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsHotelPassesModalOpen(true);
                }}
                className="w-full bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5">
                  <Receipt className="w-5 h-5 text-slate-700 stroke-[1.8]" />
                  <span className="text-sm font-bold text-slate-900">View all bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  {userHotelPassCount > 0 && (
                    <span className="text-[10px] font-black bg-teal-600 text-white px-2 py-0.5 rounded-full">
                      {userHotelPassCount} active
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* 3. Register Your Business Card (if not registered) */}
              {!hasRegisteredBusiness && (
                <Link
                  href="/dashboard?register=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl p-4 border border-emerald-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                          Register Your Business
                        </span>
                        <span className="text-[9px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
                          Free
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                        List your shop or company in Boisar
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </Link>
              )}

              {/* 4. Explore Boisar (Core City Hubs) */}
              <div>
                <h3 className="text-xs font-black text-slate-900 mb-2 px-1">Explore Boisar</h3>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <Link
                    href="/properties"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4.5 h-4.5 text-teal-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Properties (Flats, Rent &amp; Sale)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/hotels"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Hotel className="w-4.5 h-4.5 text-purple-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Hotels &amp; Hourly Day-Stay</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/hire-vehicle"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="w-4.5 h-4.5 text-amber-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Travels, Cabs &amp; Tempo Hire</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4.5 h-4.5 text-blue-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Home Services &amp; Technicians</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4.5 h-4.5 text-indigo-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Find Jobs in Tarapur MIDC</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/resorts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4.5 h-4.5 text-emerald-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Resorts &amp; Pool Villas (Kelwa)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/blood-donation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Droplet className="w-4.5 h-4.5 text-rose-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Emergency Blood Donors</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* 5. For Business & Shop Owners */}
              <div>
                <h3 className="text-xs font-black text-slate-900 mb-2 px-1">For Business &amp; Shop Owners</h3>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <Link
                    href={hasRegisteredBusiness ? "/dashboard" : "/dashboard?register=true"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {hasRegisteredBusiness ? 'My Business Dashboard' : 'Register Your Business'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">FREE</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Post a Job Vacancy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">Hiring</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/advertise"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Advertise With Us</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {isLoggedIn && (currentRole === 'Admin' || (loggedInUser as any)?.role === 'Admin') && (
                    <>
                      <div className="h-px bg-slate-100 mx-4" />
                      <Link
                        href="/adminmb"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-4.5 h-4.5 text-rose-600 stroke-[1.8]" />
                          <span className="text-xs sm:text-sm font-bold text-rose-700">Admin Control Panel</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* 6. Support */}
              <div>
                <h3 className="text-xs font-black text-slate-900 mb-2 px-1">Support</h3>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <a
                    href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar%20Support,"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Chat with us on WhatsApp</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <div className="h-px bg-slate-100 mx-4" />

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setHelpModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Help &amp; FAQs</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* 7. More */}
              <div>
                <h3 className="text-xs font-black text-slate-900 mb-2 px-1">More</h3>
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                  <Link
                    href="/download-app"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4.5 h-4.5 text-teal-600 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Install Mobile App (PWA)</span>
                    </div>
                    <span className="text-[9px] bg-teal-100 text-teal-800 font-extrabold px-2 py-0.5 rounded-full">iOS / Android</span>
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/terms"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Terms &amp; Conditions</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="h-px bg-slate-100 mx-4" />

                  <Link
                    href="/privacy"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4.5 h-4.5 text-slate-700 stroke-[1.8]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* 8. Logout Button (if logged in) */}
              {isLoggedIn && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:bg-rose-50/50 hover:border-rose-200 transition-all flex items-center gap-3 cursor-pointer text-left group"
                  >
                    <LogOut className="w-4.5 h-4.5 text-slate-700 group-hover:text-rose-600 stroke-[1.8] transition-colors" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Logout</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Floating Sandbox Persona Switcher (Development Only - Hidden for Live Testing) */}
      {/* 
      <div className="fixed bottom-6 left-6 xl:left-[calc(50vw-616px)] z-45">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all text-[10px] font-extrabold shadow-lg hover:shadow-xl cursor-pointer"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Persona: <strong className="text-teal-600 uppercase">{currentRole}</strong></span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {dropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute left-0 bottom-12 mt-2 w-64 origin-bottom-left rounded-xl border border-slate-200 bg-white p-2 shadow-2xl z-20">
              <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Demo Role Switcher</p>
              </div>
              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.val}
                    onClick={() => {
                      setRole(r.val);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-slate-50 transition-colors ${
                      currentRole === r.val ? 'bg-teal-50 text-teal-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    {r.icon}
                    <span className="flex-1 truncate">{r.label}</span>
                    {currentRole === r.val && <Check className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      */}

      {/* Account Settings Modal (Profile Name & Email Edit) */}
      {/* User Settings Modal (Clean Zomato District Cohesive Style) */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 text-left">
          <div className="fixed inset-0" onClick={() => setSettingsModalOpen(false)} />

          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-6 z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSettingsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-[#E0D7FE] text-[#6C47FF] flex items-center justify-center font-black text-lg shrink-0 shadow-2xs">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">Account Settings</h3>
                <p className="text-xs text-slate-500 font-medium">Update your profile details</p>
              </div>
            </div>

            {/* My Booked Hotel Passes Button */}
            {userHotelPassCount > 0 && (
              <div className="mb-4 p-3.5 rounded-2xl bg-[#F8F9FB] border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-5 h-5 text-slate-700 stroke-[1.8]" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">My Hotel Passes ({userHotelPassCount})</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Active hourly &amp; night stay passes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setIsHotelPassesModalOpen(true);
                  }}
                  className="bg-slate-900 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  View →
                </button>
              </div>
            )}

            {settingsSuccess && (
              <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 font-bold">
                {settingsSuccess}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editName.trim()) return;
                updateUserProfile(editName.trim(), editEmail.trim());
                setSettingsSuccess(`🎉 Profile updated to "${editName.trim()}"!`);
                setTimeout(() => {
                  setSettingsModalOpen(false);
                }, 1200);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
                <div className="w-full bg-slate-100/90 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>{loggedInUser?.phone ? `+91 ${loggedInUser.phone}` : '+91 Verified Mobile'}</span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    ✓ Verified
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-extrabold py-3 rounded-xl shadow-xs transition-all cursor-pointer mt-1"
              >
                Save Changes
              </button>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Account Deletion</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Request profile removal</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to request account deletion? Admin will process and remove your profile within 24 hours.")) {
                      handleRequestAccountDeletion();
                      setSettingsModalOpen(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Request Deletion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help & FAQs Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setHelpModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-150 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">Help &amp; Support</h3>
                  <p className="text-xs text-slate-500 font-medium">Majh Boisar Assistance Center</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Options */}
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Direct Assistance</p>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="https://wa.me/917769947217?text=Hi%20Majh%20Boisar%20Support,%20I%20need%20help%20with..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 transition-all text-center group cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="text-xs font-bold text-emerald-900">WhatsApp 24/7</span>
                  <span className="text-[10px] text-emerald-700 font-medium">+91 7769947217</span>
                </a>

                <a
                  href="mailto:help@majhboisar.com?subject=Majh%20Boisar%20Help%20Request"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/60 transition-all text-center group cursor-pointer"
                >
                  <Building2 className="w-5 h-5 text-indigo-600 mb-1" />
                  <span className="text-xs font-bold text-indigo-900">Email Support</span>
                  <span className="text-[10px] text-indigo-700 font-medium">help@majhboisar.com</span>
                </a>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Frequently Asked Questions</p>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <p className="font-extrabold text-slate-900">How do I list my shop or business for free?</p>
                  <p className="text-slate-600 font-medium mt-1 leading-relaxed">
                    Click &ldquo;List Your Business Free&rdquo; in the menu or go to /register-business. Fill in your details and your storefront is live instantly!
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <p className="font-extrabold text-slate-900">How do hotel day passes and bookings work?</p>
                  <p className="text-slate-600 font-medium mt-1 leading-relaxed">
                    Choose any verified hotel, pick your slot/pass, and get instant digital booking passes viewable under &ldquo;View all bookings&rdquo;.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <p className="font-extrabold text-slate-900">Are businesses verified on Majh Boisar?</p>
                  <p className="text-slate-600 font-medium mt-1 leading-relaxed">
                    Yes! All listings with verified badges are reviewed for physical presence in Boisar, Tarapur, and Palghar district.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal Container */}
      <LoginModal
        isOpen={loginModalOpen}
        // @ts-ignore
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Guest's All Hotel Booking Passes Modal */}
      <MyHotelPassesModal
        isOpen={isHotelPassesModalOpen}
        onClose={() => setIsHotelPassesModalOpen(false)}
      />
    </>
  );
}
