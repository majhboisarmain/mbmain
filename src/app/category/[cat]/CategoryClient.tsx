'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MapPin, Phone, MessageSquare, Star, ShieldCheck, 
  ArrowLeft, Search, Filter, ChevronRight, Sparkles, 
  Clock, Navigation, CheckCircle2, ChevronDown, Plus, ExternalLink
} from 'lucide-react';

export interface SerializedBusiness {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  image: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premium: boolean;
  subscription: string;
  workingHours: string;
  location: string;
  hasHomeDelivery?: boolean;
  products?: { id: number; name: string; price: number }[];
}

interface CategoryClientProps {
  categoryName: string;
  categorySlug: string;
  initialBusinesses: SerializedBusiness[];
  relatedCategories: { name: string; slug: string; icon: string }[];
  faqs: { question: string; answer: string }[];
}

const BOISAR_AREAS = [
  'All Areas',
  'Boisar West',
  'Ostwal Empire',
  'Station Road',
  'Tarapur MIDC',
  'Navapur Road',
  'Khodaram Baug',
  'CIDCO Colony',
  'Betegaon',
  'Chitralaya'
];

export default function CategoryClient({
  categoryName,
  categorySlug,
  initialBusinesses,
  relatedCategories,
  faqs
}: CategoryClientProps) {
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'verified'>('recommended');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Quick WhatsApp Enquiry Modal
  const [enquireBiz, setEnquireBiz] = useState<SerializedBusiness | null>(null);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userQuery, setUserQuery] = useState('');

  // Filtered and sorted businesses
  const filteredBusinesses = useMemo(() => {
    return initialBusinesses.filter(biz => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        biz.name.toLowerCase().includes(q) ||
        biz.address.toLowerCase().includes(q) ||
        biz.location.toLowerCase().includes(q) ||
        biz.description.toLowerCase().includes(q);

      const matchesArea = selectedArea === 'All Areas' || 
        biz.location.toLowerCase().includes(selectedArea.toLowerCase()) ||
        biz.address.toLowerCase().includes(selectedArea.toLowerCase());

      return matchesSearch && matchesArea;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'verified') return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      // recommended: premium/subscribed first, then rating
      const aScore = (a.subscription !== 'Free' ? 10 : 0) + (a.verified ? 5 : 0) + a.rating;
      const bScore = (b.subscription !== 'Free' ? 10 : 0) + (b.verified ? 5 : 0) + b.rating;
      return bScore - aScore;
    });
  }, [initialBusinesses, searchQuery, selectedArea, sortBy]);

  const handleEnquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquireBiz) return;
    const phone = enquireBiz.whatsapp || enquireBiz.phone;
    const text = `Hello ${enquireBiz.name},\nI found your business on Majh Boisar under ${categoryName}!\n\n👤 Name: ${userName || 'Local Customer'}\n📱 Mobile: ${userPhone || 'Direct Inquiry'}\n💬 Query: ${userQuery || `I am looking for ${categoryName} services/products in Boisar.`}\n\nPlease share details, timings & rates.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    setEnquireBiz(null);
    setUserQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* ── TOP NAV / BREADCRUMB ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link 
              href="/"
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {/* Breadcrumbs for Google & Users */}
            <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-500 truncate">
              <span className="text-slate-300">/</span>
              <Link href="/services" className="hover:text-purple-900 transition-colors truncate">Boisar Directory</Link>
              <span className="text-slate-300">/</span>
              <span className="text-purple-950 font-black truncate">{categoryName} in Boisar</span>
            </nav>
          </div>

          <Link
            href="/business/new"
            className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white font-black text-[11px] sm:text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>+ List Business</span>
          </Link>
        </div>
      </div>

      {/* ── SEO HERO HEADER ── */}
      <div className="bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-900 text-white pt-6 pb-8 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-lg uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Verified Local Guide 2026
            </span>
            <span className="bg-white/10 text-slate-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-lg">
              📍 Boisar, Tarapur MIDC, Palghar
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Top 10 Best {categoryName} in Boisar, Palghar
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl leading-relaxed">
              Explore the most trusted and highly-rated <strong className="text-white">{categoryName}</strong> in Boisar. Contact directly via Phone or WhatsApp for instant bookings, pricing, and service details.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-2.5 max-w-4xl">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search ${categoryName} by name, landmark, area in Boisar...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-900 font-bold text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="sm:col-span-4 flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="recommended" className="text-slate-900">✨ Recommended First</option>
                <option value="rating" className="text-slate-900">⭐ Highest Rated</option>
                <option value="verified" className="text-slate-900">🛡️ Verified First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── AREA FILTER STRIP (BOISAR LOCAL AREAS) ── */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-purple-900" /> Area:
          </span>
          {BOISAR_AREAS.map((area) => {
            const isSelected = selectedArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-900 text-white border-purple-950 shadow-xs font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT: BUSINESS LISTINGS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Business Listings Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              Showing {filteredBusinesses.length} {categoryName} in {selectedArea}
            </h2>
            <span className="text-[11px] font-bold text-slate-500">
              Updated for 2026
            </span>
          </div>

          {filteredBusinesses.length > 0 ? (
            <div className="space-y-3.5">
              {filteredBusinesses.map((biz, idx) => {
                const isPaid = biz.subscription && biz.subscription !== 'Free';
                const showDelivery = Boolean(isPaid && biz.hasHomeDelivery !== false);

                return (
                  <div 
                    key={biz.id}
                    className="bg-white border border-slate-200/90 hover:border-purple-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 text-left group flex flex-col sm:flex-row gap-4"
                  >
                    {/* Image & Rank Badge */}
                    <div className="relative w-full sm:w-40 sm:h-36 h-44 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      <img 
                        src={biz.image || 'https://images.unsplash.com/photo-1581093804475-577d72e38aa0?w=600'} 
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        #{idx + 1}
                      </div>

                      {showDelivery && (
                        <div className="absolute bottom-2 left-2 bg-emerald-600/95 backdrop-blur-xs text-white text-[9.5px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          🛵 Home Delivery
                        </div>
                      )}
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/business/${biz.id}`} className="hover:text-purple-900 transition-colors">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                              {biz.name}
                            </h3>
                          </Link>

                          {biz.verified && (
                            <span className="inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>

                        {/* Rating & Category */}
                        <div className="flex items-center gap-2 text-xs">
                          {biz.rating > 0 ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-black text-[11px] px-2 py-0.5 rounded-lg shadow-2xs">
                              <Star className="w-3 h-3 fill-white text-white" />
                              <span>{biz.rating.toFixed(1)}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">New Listing</span>
                          )}
                          <span className="text-slate-400">•</span>
                          <span className="font-bold text-slate-600 text-[11px] truncate">{biz.category}</span>
                        </div>

                        {/* Address & Hours */}
                        <p className="text-xs text-slate-600 font-medium flex items-start gap-1 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{biz.address || biz.location || 'Boisar, Palghar'}</span>
                        </p>

                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{biz.workingHours || '9:00 AM - 9:00 PM'}</span>
                        </p>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        {biz.phone && (
                          <a
                            href={`tel:${biz.phone}`}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-purple-900 hover:bg-purple-950 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs active:scale-95"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEnquireBiz(biz);
                            setUserQuery(`Hi, I would like to inquire about ${biz.name} (${categoryName}) in Boisar.`);
                          }}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <Link
                          href={`/business/${biz.id}`}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-slate-700 hover:text-purple-900 font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-900 flex items-center justify-center mx-auto text-2xl">
                📍
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">
                  No {categoryName} listed in {selectedArea} yet
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Be the first business owner to list your {categoryName} business in Boisar and capture local leads from Google!
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/business/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-950 hover:to-indigo-950 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>List Your Business for Free</span>
                </Link>
              </div>
            </div>
          )}

          {/* ── GOOGLE RICH FAQ SECTION ── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 text-left shadow-2xs mt-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-lg">❓</span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Frequently Asked Questions about {categoryName} in Boisar
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified answers for residents and visitors in Boisar, Palghar
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div key={fIdx} className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                      className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-purple-900' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-3.5 sm:p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Sidebar & Related Categories */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Claim / Add Business Promo Box */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-600 text-white rounded-3xl p-5 shadow-md text-left space-y-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl">
              📢
            </div>
            <div>
              <h4 className="text-sm font-black text-white leading-tight">
                Are you a {categoryName} Business Owner in Boisar?
              </h4>
              <p className="text-xs text-amber-100 font-medium mt-1 leading-snug">
                Get discovered by 10,000+ local customers searching on Google. Free verified listing on Majh Boisar.
              </p>
            </div>
            <Link
              href="/business/new"
              className="w-full bg-slate-950 hover:bg-slate-900 text-amber-300 font-black text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Your Business</span>
            </Link>
          </div>

          {/* Related Categories for Internal SEO Linking */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left space-y-3 shadow-2xs">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔗</span> Popular Categories in Boisar
            </h4>
            <div className="space-y-1.5">
              {relatedCategories.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/category/${encodeURIComponent(rc.name)}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-100 hover:border-purple-200 transition-all text-xs font-bold group"
                >
                  <span className="flex items-center gap-2">
                    <span>{rc.icon}</span>
                    <span>{rc.name} in Boisar</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-900 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Help & Directory Support */}
          <div className="bg-slate-100 rounded-3xl p-4 text-left space-y-2 border border-slate-200/80">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
              Majh Boisar Verified Directory
            </span>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              We verify local businesses in Boisar to ensure genuine reviews, phone numbers, and addresses. Need help or want to report incorrect info?
            </p>
            <a 
              href="https://wa.me/918149998666?text=Hi%20Majh%20Boisar%20Support,%20I%20have%20a%20query%20about%20a%20business%20listing."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-purple-900 hover:underline inline-flex items-center gap-1"
            >
              <span>Contact Support on WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>

      {/* ── QUICK WHATSAPP ENQUIRY MODAL ── */}
      {enquireBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150 text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                  Quick WhatsApp Lead
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Enquire with {enquireBiz.name}
                </h3>
              </div>
              <button 
                onClick={() => setEnquireBiz(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnquireSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Your Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Your Message / Query</label>
                <textarea
                  rows={3}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Enquiry</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
