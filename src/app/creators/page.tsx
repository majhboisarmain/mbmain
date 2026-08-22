'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Sparkles, Search, MapPin, Phone, MessageSquare, Plus, X, 
  CheckCircle, Camera, Users, Star, 
  ExternalLink, Video, Utensils, ShoppingBag, Eye, TrendingUp
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  category: 'Food & Cafes' | 'Stores & Shops' | 'Video & Reels' | 'Fashion & Lifestyle' | 'Fitness & Sports' | 'Event Anchor';
  followers: string;
  platform: 'Instagram' | 'YouTube' | 'Both';
  rate: string;
  location: string;
  phone: string;
  allowCalls?: boolean; // Show direct call button or WhatsApp only
  instagramUrl: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  image: string;
  bio: string;
  tags: string[];
}

const BOISAR_REGIONS = [
  'Boisar East',
  'Boisar West',
  'Betegaon',
  'Tembhode',
  'Tarapur',
  'Tarapur MIDC',
  'Saravali',
  'Salwad',
  'Pasthal',
  'Kumbhavali',
  'Pam',
  'Khaira',
  'Katkar',
  'Nandgaon',
  'Murbe',
  'Kolwade'
];

const CREATOR_CATEGORIES = [
  { id: 'all', name: 'All Creators', icon: '🌟', bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-900' },
  { id: 'food', name: 'Food & Cafes', icon: '🍔', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  { id: 'stores', name: 'Stores & Shops', icon: '🛍️', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { id: 'reels', name: 'Video & Reels', icon: '🎥', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { id: 'fashion', name: 'Fashion & Style', icon: '💄', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  { id: 'fitness', name: 'Fitness & Gym', icon: '🏋️', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'anchor', name: 'Event Anchor', icon: '🎙️', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
];

const INITIAL_CREATORS: CreatorProfile[] = [];

function CreatorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams?.get('category') || '';
  const { showToast, isLoggedIn, setLoginModalOpen, loggedInUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All Creators');
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formCategory, setFormCategory] = useState<'Food & Cafes' | 'Stores & Shops' | 'Video & Reels' | 'Fashion & Lifestyle' | 'Fitness & Sports' | 'Event Anchor'>('Food & Cafes');
  const [formFollowers, setFormFollowers] = useState('10K+');
  const [formRate, setFormRate] = useState('Starting ₹999 / Reel');
  const [formLocation, setFormLocation] = useState('Boisar West');
  const [formPhone, setFormPhone] = useState('');
  const [formAllowCalls, setFormAllowCalls] = useState(true);
  const [formImage, setFormImage] = useState('');
  const [formBio, setFormBio] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Scroll to top on mount and load registered creators
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      try {
        const saved = localStorage.getItem('majh_boisar_creators_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCreators(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Autofill form if logged in
  useEffect(() => {
    if (showAddModal && loggedInUser) {
      if (!formName) setFormName(loggedInUser.name || '');
      if (!formPhone) setFormPhone(loggedInUser.phone || '');
    }
  }, [showAddModal, loggedInUser]);

  const handleOpenAddModal = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      showToast('Please login with your mobile number to register as a Creator.', 'info', 4000);
      return;
    }
    setShowAddModal(true);
  };

  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAddModal]);

  useEffect(() => {
    if (catParam) {
      const matched = CREATOR_CATEGORIES.find(c => c.name.toLowerCase().includes(catParam.toLowerCase()));
      if (matched) {
        setSelectedCategory(matched.name);
      }
    }
  }, [catParam]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast('Please enter your Name and WhatsApp Contact Number!', 'error');
      return;
    }

    const defaultImages: Record<string, string> = {
      'Food & Cafes': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'Stores & Shops': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
      'Video & Reels': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'Fashion & Lifestyle': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'Fitness & Sports': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      'Event Anchor': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    };

    const cleanHandle = formHandle.trim().replace(/^@+/, '');
    const finalHandle = cleanHandle ? `@${cleanHandle}` : `@${formName.toLowerCase().replace(/\s+/g, '_')}`;
    const instaLink = `https://instagram.com/${cleanHandle || formName.toLowerCase().replace(/\s+/g, '_')}`;

    const newCreator: CreatorProfile = {
      id: `cr-custom-${Date.now()}`,
      name: formName.trim(),
      handle: finalHandle,
      category: formCategory,
      followers: formFollowers.trim() || '5K+',
      platform: 'Instagram',
      rate: formRate.trim() || 'Starting ₹999 / Reel',
      location: formLocation.trim() || 'Boisar West',
      phone: formPhone.trim(),
      allowCalls: formAllowCalls,
      instagramUrl: instaLink,
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      image: formImage || defaultImages[formCategory] || defaultImages['Food & Cafes'],
      bio: formBio.trim() || `Local content creator & influencer in Boisar specializing in ${formCategory}.`,
      tags: ['Verified Creator', 'Direct Collab', 'Fast Delivery']
    };

    const updated = [newCreator, ...creators];
    setCreators(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_creators_list', JSON.stringify(updated));
    }

    setSuccessMsg('🎉 Creator Profile Registered Successfully!');
    showToast('🎉 Creator Profile Registered Successfully on Majh Boisar!', 'success');

    setTimeout(() => {
      setSuccessMsg('');
      setShowAddModal(false);
      setFormName('');
      setFormHandle('');
      setFormPhone('');
      setFormImage('');
      setFormBio('');
    }, 1500);
  };

  const filteredCreators = useMemo(() => {
    return creators.filter(c => {
      return selectedCategory === 'All Creators' || c.category === selectedCategory;
    });
  }, [creators, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 text-left">
      
      {/* 1. Breadcrumbs Header */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-3 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2 text-xs truncate min-w-0">
            <Link href="/" className="text-slate-500 hover:text-teal-900 font-bold transition-colors shrink-0">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-black truncate">Content Creators &amp; Influencers in Boisar</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 space-y-4">
        
        {/* 2. Top Interactive Category Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 shadow-2xs space-y-1.5 text-left">
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Select Creator Niche
            </span>
            <span className="text-[10px] text-slate-400 font-bold sm:hidden">👉 Swipe</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-7 sm:gap-2.5 sm:overflow-visible sm:pb-0">
            {CREATOR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`min-w-[90px] sm:min-w-0 shrink-0 snap-start rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-1.5 border transition-all cursor-pointer group active:scale-95 ${
                    isSelected 
                      ? 'bg-rose-50 border-rose-600 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-rose-400 hover:shadow-2xs'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl ${cat.bg} border ${cat.border} flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform`}>
                    <span>{cat.icon}</span>
                  </div>
                  <span className={`text-[10.5px] sm:text-[11px] font-black leading-tight line-clamp-1 ${
                    isSelected ? 'text-rose-950 font-black' : 'text-slate-800 group-hover:text-rose-700'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Creator Cards Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3 text-left">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              {selectedCategory === 'All Creators' ? 'Available Creators & Influencers in Boisar' : `Available ${selectedCategory} Creators in Boisar`}
            </h2>
            <p className="text-[10px] sm:text-[10.5px] text-slate-500 font-medium">
              {filteredCreators.length} verified creators for cafe, store, resort &amp; event promotions
            </p>
          </div>

          {filteredCreators.length > 0 ? (
            /* Cards Grid: 2 Columns on Mobile, 4 Columns on Desktop */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5">
              {filteredCreators.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between group text-left"
                >
                  <div>
                    {/* Photo Container with Ambient Backdrop (100% Full Photo Visible) */}
                    <div className="relative w-full h-32 sm:h-40 md:h-44 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
                      {/* Ambient backdrop */}
                      <img
                        src={c.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-40 scale-110"
                      />
                      <img
                        src={c.image}
                        alt={c.name}
                        className="relative max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 z-1"
                      />
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-2">
                        <span className="bg-slate-900/90 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-xs border border-white/10">
                          {c.category}
                        </span>
                      </div>
                      <div className="absolute top-1.5 right-1.5 z-2">
                        <span className="bg-rose-600 text-white text-[9.5px] sm:text-[10.5px] font-black px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5 sm:gap-1">
                          <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>{c.followers}</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body (Clean & Proportional Layout) */}
                    <div className="p-2 sm:p-3 space-y-1.5">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-[11.5px] sm:text-xs font-black text-slate-900 truncate leading-tight">
                            {c.name}
                          </h3>
                          <span className="bg-emerald-50 text-emerald-700 text-[8px] font-black px-1 py-0.2 rounded border border-emerald-200 shrink-0">
                            ✓
                          </span>
                        </div>
                        
                        {/* Direct Clickable Instagram Handle */}
                        <a
                          href={c.instagramUrl || `https://instagram.com/${c.handle.replace(/[@\s]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-rose-700 hover:text-rose-900 hover:underline mt-0.5 group/insta cursor-pointer max-w-full"
                          title="Open Instagram Profile"
                        >
                          <svg className="w-3 h-3 text-rose-600 group-hover/insta:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                          <span className="truncate">{c.handle}</span>
                          <ExternalLink className="w-2 h-2 opacity-70 shrink-0" />
                        </a>
                      </div>

                      <p className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium line-clamp-2 leading-tight">
                        {c.bio}
                      </p>

                      {/* Clean Rate & Area Section */}
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 space-y-0.5 text-[9px] sm:text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Rate:</span>
                          <span className="font-black text-rose-700">{c.rate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Area:</span>
                          <span className="font-bold text-slate-800 truncate max-w-[85px] sm:max-w-none">{c.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer: Call & WA or WhatsApp Only */}
                  <div className="p-2 sm:p-3 pt-0">
                    {c.allowCalls === false ? (
                      <a
                        href={`https://wa.me/91${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${c.name}, I found your creator profile on Majh Boisar. I want to collaborate for a brand / cafe promotion.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[10.5px] sm:text-xs py-1.5 rounded-lg text-center shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp for Collab</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${c.phone}`}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black text-[10.5px] sm:text-xs py-1.5 rounded-lg text-center shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/91${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${c.name}, I found your creator profile on Majh Boisar. I want to collaborate for a brand / cafe promotion.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[10.5px] sm:text-xs py-1.5 rounded-lg text-center shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-3 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">No Creators Listed in this Category Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Are you a local content creator or influencer in Boisar? Join now to receive direct paid brand deals and cafe invites!
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Join as Creator / Influencer</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Bottom Registration Banner (Slim & Compact) */}
        <div 
          style={{ background: 'linear-gradient(135deg, #2b0c1e 0%, #1a0815 50%, #0d040c 100%)', color: '#ffffff' }}
          className="rounded-2xl p-3.5 sm:p-4 mt-6 border border-rose-500/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
        >
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
              Are you a Content Creator or Influencer in Boisar?
            </h3>
            <p className="text-[10.5px] text-rose-200">
              List your profile on Majh Boisar and get direct paid brand deals &amp; cafe invites.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Profile</span>
          </button>
        </div>

      </div>

      {/* ── CREATOR REGISTRATION MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-3.5 sm:p-5 shadow-2xl relative border border-slate-200 max-h-[88vh] flex flex-col text-left overflow-hidden">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-rose-600">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">Register as Creator in Boisar</h3>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Get direct paid collaborations from local cafes, shops &amp; businesses</p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2 text-xs font-black animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-2 overflow-y-auto pr-1">
                {/* Photo Upload */}
                <div className="bg-rose-50/50 p-2 rounded-xl border border-rose-100 flex items-center gap-2.5">
                  {formImage ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-rose-300 shrink-0">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="absolute top-0 right-0 bg-black/80 text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <label className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] px-2.5 py-1 rounded-lg cursor-pointer border border-rose-200 transition-colors shadow-2xs">
                      <Camera className="w-3 h-3" />
                      <span>{formImage ? 'Change Photo' : 'Upload Profile Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const { compressImage } = await import('@/lib/imageCompressor');
                            const compressed = await compressImage(file, 800, 800, 0.85);
                            setFormImage(compressed);
                          } catch (err) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setFormImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name & Handle in 2 cols */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Creator Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="e.g. Karan Foodie"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Instagram Handle *</label>
                    <input
                      type="text"
                      required
                      value={formHandle}
                      onChange={e => setFormHandle(e.target.value)}
                      placeholder="e.g. @boisar_vlogs"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>
                </div>

                {/* Category & Followers in 2 cols */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Niche / Category *</label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600 cursor-pointer truncate"
                    >
                      <option value="Food & Cafes">🍔 Food &amp; Cafes</option>
                      <option value="Stores & Shops">🛍️ Stores &amp; Shops</option>
                      <option value="Video & Reels">🎥 Video &amp; Reels</option>
                      <option value="Fashion & Lifestyle">💄 Fashion &amp; Lifestyle</option>
                      <option value="Fitness & Sports">🏋️ Fitness &amp; Sports</option>
                      <option value="Event Anchor">🎙️ Event Anchor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Follower Count</label>
                    <input
                      type="text"
                      value={formFollowers}
                      onChange={e => setFormFollowers(e.target.value)}
                      placeholder="e.g. 25K Followers"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>
                </div>

                {/* Rate & Area in 2 cols */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Starting Rate</label>
                    <input
                      type="text"
                      value={formRate}
                      onChange={e => setFormRate(e.target.value)}
                      placeholder="e.g. ₹999/Reel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Boisar Region *</label>
                    <select
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600 cursor-pointer"
                    >
                      {BOISAR_REGIONS.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WhatsApp Number & Call Preference */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={e => setFormPhone(e.target.value)}
                      placeholder="e.g. 7769947217"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600"
                    />
                  </div>

                  {/* Allow Direct Calls Choice */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-800 block">Show Direct Call Button?</span>
                      <span className="text-[8.5px] text-slate-500 block">Or allow WhatsApp only for privacy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFormAllowCalls(true)}
                        className={`px-2 py-1 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                          formAllowCalls ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        Call &amp; WA
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormAllowCalls(false)}
                        className={`px-2 py-1 rounded-lg text-[9.5px] font-bold border transition-all cursor-pointer ${
                          !formAllowCalls ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        WhatsApp Only
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9.5px] text-slate-600 font-extrabold uppercase mb-0.5">Short Bio (1-2 Lines)</label>
                  <input
                    type="text"
                    value={formBio}
                    onChange={e => setFormBio(e.target.value)}
                    placeholder="e.g. Food reviewer and daily lifestyle reel creator in Boisar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-black text-xs py-2.5 rounded-xl shadow-md transition-all cursor-pointer mt-1"
                >
                  Submit &amp; List Profile
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function CreatorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CreatorsPageContent />
    </Suspense>
  );
}
