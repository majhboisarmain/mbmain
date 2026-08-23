'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useApp, Role } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import LoginModal from './LoginModal';
import MyHotelPassesModal from './MyHotelPassesModal';
import QRScannerModal from './QRScannerModal';
import {
  Search, MapPin, User, Shield, Briefcase, ChevronDown, Check,
  Menu, X, LogOut, Building, Layers, HelpCircle, MessageSquare, ChevronRight, Smartphone, Download, Ticket, Plus, QrCode
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
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

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
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setIsScrolledPastHero(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsScrolledPastHero(true);
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
      <header className="sticky top-0 z-[150] bg-white border-b border-slate-200 overflow-visible">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">

          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center group">
              <img
                src="/majh-boisar-full-logo.png"
                alt="Majh Boisar"
                loading="lazy"
                decoding="async"
                className="h-8 sm:h-9 md:h-10.5 w-auto object-contain transition-transform duration-200 hover:scale-[1.03]"
              />
            </Link>
          </div>

          {/* Middle Search Bar */}
          <div className="flex-1 max-w-lg min-w-0 transition-all duration-300 relative z-50">
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
                    <button
                      type="button"
                      onClick={() => setIsQRScannerOpen(true)}
                      className="p-1 rounded-full hover:bg-teal-50 text-slate-400 hover:text-teal-700 transition-colors cursor-pointer shrink-0"
                      title="Scan Majh Boisar Shop QR Standee"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
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

            {/* Register Your Business / Dashboard CTA — context-aware */}
            {mounted && (
              isLoggedIn && hasRegisteredBusiness ? (
                // User has a business → show Dashboard button
                <Link
                  href="/dashboard"
                  className="btn-teal text-xs font-black px-3 py-1.5 rounded-lg hover:shadow-md transition-shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              ) : isLoggedIn ? (
                // Logged in but NO business → show Register Your Business
                <Link
                  href="/dashboard"
                  className="btn-teal text-xs font-black px-3 py-1.5 rounded-lg hover:shadow-md transition-shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Your Business</span>
                </Link>
              ) : (
                // Guest → show Free Listing button to trigger login
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="btn-teal text-xs font-black px-3 py-1.5 rounded-lg hover:shadow-md transition-shadow flex items-center gap-1.5 cursor-pointer"
                >
                  {t('nav.free_listing')}
                </button>
              )
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



            {/* Sign In / Account Dropdown */}
            <div className="relative">
              {mounted && isLoggedIn ? (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setHelpDropdownOpen(false);
                  }}
                  className="flex flex-col items-center justify-center text-slate-555 hover:text-teal-650 transition-colors group cursor-pointer"
                >
                  <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 border border-teal-200">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 flex items-center gap-0.5 text-slate-555 group-hover:text-teal-655 transition-colors leading-none max-w-[85px] sm:max-w-[120px] truncate">
                    Hi, {userName.split(' ')[0]} <ChevronDown className="w-2.5 h-2.5 text-slate-405 shrink-0" />
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setHelpDropdownOpen(false);
                  }}
                  className="flex flex-col items-center justify-center text-slate-555 hover:text-teal-650 transition-colors group cursor-pointer"
                >
                  <User className="w-5 h-5 text-slate-405 group-hover:text-teal-655 transition-colors" />
                  <span className="text-[10px] font-bold mt-1 flex items-center gap-0.5 text-slate-555 group-hover:text-teal-655 transition-colors leading-none">
                    Sign In <ChevronDown className="w-2.5 h-2.5 text-slate-405" />
                  </span>
                </button>
              )}

              {/* Profile/Sign-In Dropdown */}
              {profileDropdownOpen && (
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
                            href="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs text-slate-655 hover:bg-slate-50 hover:text-slate-800 transition-colors font-bold"
                          >
                            <span className="text-slate-400">🏢</span>
                            <span>Add / Register Your Business</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      // Logged-in View Dropdown
                      <div className="space-y-3.5">
                        <div className="pb-2.5 border-b border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-black text-slate-800 leading-none">{userName}</p>
                            <p className="text-[9px] font-bold text-teal-650 mt-1 uppercase tracking-wider">Role: {currentRole || 'Owner'}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {/* Download App Link */}
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

                          {/* USER ROLE MENU ITEMS (not yet a BusinessOwner) */}
                          {isLoggedIn && !hasRegisteredBusiness && currentRole !== 'Admin' && (
                            <>
                              {/* Register Your Business — primary CTA for User role */}
                              <Link
                                href="/dashboard"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors font-extrabold border border-teal-200"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-teal-600">🏪</span>
                                  <span>Register Your Business</span>
                                </div>
                                <span className="bg-teal-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">FREE</span>
                              </Link>
                            </>
                          )}

                          {/* BUSINESS OWNER MENU ITEM */}
                          {(hasRegisteredBusiness || currentRole === 'BusinessOwner') && (
                            <Link
                              href="/dashboard?mode=shop"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors font-extrabold"
                            >
                              <span className="text-teal-600">💼</span>
                              <span>My Business Dashboard</span>
                            </Link>
                          )}

                          {/* Settings - Available for ALL logged in users */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditName(loggedInUser?.name || userName || '');
                              setEditEmail(loggedInUser?.email || '');
                              setSettingsSuccess('');
                              setSettingsModalOpen(true);
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs text-slate-655 hover:bg-slate-50 hover:text-slate-800 transition-colors font-bold cursor-pointer"
                          >
                            <span className="text-slate-400">⚙️</span>
                            <span>Account Settings</span>
                          </button>
                        </div>

                        <hr className="border-slate-100 my-1" />

                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-bold text-left cursor-pointer"
                        >
                          <span className="text-rose-500">🚪</span>
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Mobile Help Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setHelpDropdownOpen(!helpDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center gap-1 text-[10px] font-black text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-1 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3 h-3 text-teal-600 shrink-0" />
                <span>Help</span>
              </button>

              {helpDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[190] bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={() => setHelpDropdownOpen(false)} />
                  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[340px] rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xl z-[200] animate-in fade-in zoom-in-95 duration-150 text-left">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                          <HelpCircle className="w-4 h-4 text-teal-600" /> Help &amp; Support
                        </h4>
                        <button onClick={() => setHelpDropdownOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setHelpDropdownOpen(false);
                          showToast("Raise a Complaint: Please email majhboisar@gmail.com with details.", "info", 5000);
                        }}
                        className="flex items-center gap-2.5 w-full text-slate-700 hover:text-slate-900 text-xs font-bold p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <span className="text-base">📝</span>
                        <span>Raise a Complaint</span>
                      </button>

                      {isLoggedIn && (
                        <button
                          onClick={() => {
                            setHelpDropdownOpen(false);
                            handleRequestAccountDeletion();
                          }}
                          className="flex items-center gap-2.5 w-full text-rose-600 hover:text-rose-800 text-xs font-bold p-2 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                        >
                          <span className="text-base">🗑️</span>
                          <span>Request Account Deletion</span>
                        </button>
                      )}

                      <Link
                        href="/advertise?track=true"
                        onClick={() => setHelpDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-slate-700 hover:text-teal-600 text-xs font-bold p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <span className="text-base">📊</span>
                        <span>Track Ad Campaign</span>
                      </Link>

                      <div className="border-t border-slate-100 pt-2.5 space-y-2">
                        <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-150 rounded-xl">
                          <span className="text-base">✉️</span>
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Official Email</span>
                            <a href="mailto:majhboisar@gmail.com" className="text-xs text-slate-900 font-black hover:text-teal-600">majhboisar@gmail.com</a>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setHelpDropdownOpen(false);
                            window.open("https://wa.me/917769947217", "_blank");
                          }}
                          className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <span>💬 Chat on WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Quick Access: Dashboard (if has business) OR Register Your Business (if logged in, no business) */}
            {mounted && isLoggedIn && hasRegisteredBusiness && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1 bg-slate-900 hover:bg-teal-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Building className="w-3 h-3 text-teal-400 shrink-0" />
                <span>Dashboard</span>
              </Link>
            )}
            {mounted && isLoggedIn && !hasRegisteredBusiness && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>Register</span>
              </Link>
            )}

            {mounted && !isLoggedIn && (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="bg-[#e62238] hover:bg-[#cc1b30] active:scale-95 text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-white" />
                <span>{t('nav.login')}</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-1.5 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-100 cursor-pointer shrink-0 transition-colors z-20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer (Clean, Compact & Sleek) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[52px] sm:top-[56px] bottom-0 bg-white z-[9999] overflow-y-auto p-3 space-y-2 shadow-2xl text-left border-t border-slate-200 animate-in slide-in-from-top-2 duration-150">
            <div className="max-w-md mx-auto space-y-2">
            
            {/* User Profile Header if Logged In */}
            {isLoggedIn && (
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-xl p-2 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-black text-slate-900 truncate">Hi, {userName || 'User'}</p>
                    <p className="text-[9.5px] text-teal-700 font-extrabold truncate">{loggedInUser?.phone || 'Verified User'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(loggedInUser?.name || userName || '');
                      setEditEmail(loggedInUser?.email || '');
                      setSettingsSuccess('');
                      setSettingsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="text-[9.5px] font-black text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[9.5px] font-black text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* 1. Main Navigation Links */}
            <div className="space-y-0.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block px-1.5 py-0.5">
                Explore Boisar
              </span>

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-teal-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏠</span>
                  <span>Home</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>

              <Link
                href="/hotels"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-purple-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏨</span>
                  <span>Hourly Hotels</span>
                </div>
                <span className="text-[8.5px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">3h · 6h</span>
              </Link>

              <Link
                href="/resorts"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-teal-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏊</span>
                  <span>Resorts &amp; Villas</span>
                </div>
                <span className="text-[8.5px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">Day &amp; Night</span>
              </Link>

              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-emerald-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">💼</span>
                  <span>Jobs in Boisar</span>
                </div>
                <span className="text-[8.5px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Hiring</span>
              </Link>

              <Link
                href="/creators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-rose-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🌟</span>
                  <span>Creators &amp; Influencers</span>
                </div>
                <span className="text-[8.5px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">New</span>
              </Link>

              <Link
                href="/hire-vehicle"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-blue-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚗</span>
                  <span>Vehicle Rentals</span>
                </div>
                <span className="text-[8.5px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">Cab/Auto</span>
              </Link>
            </div>

            {/* 2. Business & Partner Section */}
            <div className="space-y-0.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block px-1.5 py-0.5">
                For Business &amp; Owners
              </span>

              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-teal-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏪</span>
                  <span>{hasRegisteredBusiness ? 'Business Dashboard' : 'List Your Business'}</span>
                </div>
                <span className="text-[8.5px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">Free</span>
              </Link>

              <Link
                href="/advertise"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-teal-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📢</span>
                  <span>Advertise With Us</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>

              {isLoggedIn && currentRole === 'Admin' && (
                <Link
                  href="/adminmb"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-800 hover:bg-white hover:text-teal-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🛡️</span>
                    <span>Admin Control Panel</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
              )}
            </div>

            {/* 4. Support & Direct WhatsApp */}
            <div>
              <a
                href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar%20Support,"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-black transition-all shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp Support</span>
              </a>
            </div>

            {/* 5. Account & Auth Footer */}
            <div className="pt-1.5 border-t border-slate-200">
              {isLoggedIn ? (
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(loggedInUser?.name || userName || '');
                      setEditEmail(loggedInUser?.email || '');
                      setSettingsSuccess('');
                      setSettingsModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all cursor-pointer"
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black border border-rose-200 transition-all cursor-pointer"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLoginModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11.5px] font-black transition-all cursor-pointer text-center shadow-xs"
                >
                  Sign In / Register Account
                </button>
              )}
            </div>

            </div>
          </div>
        )}


      </header>

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
      {settingsModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 text-left">
          <div className="fixed inset-0" onClick={() => setSettingsModalOpen(false)} />

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSettingsModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-teal-50 rounded-xl text-teal-700">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Account Settings</h3>
                <p className="text-[11px] text-slate-500 font-bold">Update your full name &amp; profile info</p>
              </div>
            </div>

            {/* My Booked Hotel Passes Button */}
            {userHotelPassCount > 0 && (
              <div className="mb-3.5 p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🎫</span>
                  <div>
                    <h4 className="text-xs font-black text-purple-950">My Hotel Passes ({userHotelPassCount})</h4>
                    <p className="text-[10px] text-purple-700 font-medium">View active hourly &amp; night stay passes</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setIsHotelPassesModalOpen(true);
                  }}
                  className="bg-purple-900 hover:bg-purple-950 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  View →
                </button>
              </div>
            )}

            {settingsSuccess && (
              <div className="p-2.5 mb-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold">
                {settingsSuccess}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editName.trim()) return;
                updateUserProfile(editName.trim(), editEmail.trim());
                setSettingsSuccess(`🎉 Profile name updated to "${editName.trim()}"!`);
                setTimeout(() => {
                  setSettingsModalOpen(false);
                }, 1200);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Mobile Number (Verified)</label>
                <input
                  type="text"
                  disabled
                  value={loggedInUser?.phone ? `+91 ${loggedInUser.phone}` : '+91 Verified Mobile'}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-black py-2.5 rounded-xl shadow-sm uppercase tracking-wider transition-all cursor-pointer mt-2"
              >
                Save Changes
              </button>

              <div className="pt-3 border-t border-slate-200 mt-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-rose-700">Account Deletion</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Request permanent profile &amp; data removal</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to request account deletion? Admin will process and remove your profile within 24 hours.")) {
                        handleRequestAccountDeletion();
                        setSettingsModalOpen(false);
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-black rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Request Deletion
                  </button>
                </div>
              </div>
            </form>
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

      {/* In-App Shop & Standee QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </>
  );
}
