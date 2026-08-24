'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Phone, MessageSquare, MapPin, Clock, Star,
  CheckCircle, ArrowLeft, Send, Sparkles, AlertCircle, ShoppingBag,
  ChevronRight, ChevronLeft, User, Heart, Share2, Info, X, Bookmark, Copy, Edit3, Mail, Building2, QrCode,
  Truck, Plus, Minus, Trash2, ArrowRight
} from 'lucide-react';
import { specialProfiles } from '@/lib/mockProfiles';
import BusinessQRStandeeModal from '@/components/BusinessQRStandeeModal';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
}

interface Service {
  id: number;
  name: string;
  price: number | null;
  duration: string | null;
  description: string | null;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  website: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  googleMaps?: string | null;
  verified: boolean;
  premium: boolean;
  subscription: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  workingHours: string;
  location: string;
  views: number;
  phoneClicks: number;
  whatsappClicks: number;
  directionClicks: number;
  websiteClicks: number;
  reviews: Review[];
  products: Product[];
  services: Service[];
  faqs: FAQ[];
}

export default function BusinessDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { currentRole, isLoggedIn, loggedInUser, setLoginModalOpen, showToast } = useApp();

  const idStr = params.id as string;
  const businessId = parseInt(idStr);

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'reviews' | 'faqs'>('overview');

  // Bookmark and Share state
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStandeeModalOpen, setIsStandeeModalOpen] = useState(false);

  const isOwnerOrAdmin = Boolean(
    isLoggedIn && (
      currentRole === 'Admin' ||
      (loggedInUser?.phone && business?.phone && loggedInUser.phone.replace(/\D/g, '') === business.phone.replace(/\D/g, '')) ||
      (loggedInUser?.phone && (business as any)?.createdBy && loggedInUser.phone.replace(/\D/g, '') === (business as any).createdBy.replace(/\D/g, ''))
    )
  );

  // Gallery Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFolder, setActiveFolder] = useState<'all' | 'latest' | 'owner' | 'user'>('all');

  const galleryImages = business && Array.isArray((business as any).gallery)
    ? (business as any).gallery.filter(Boolean)
    : [];

  const allImages = business
    ? Array.from(new Set([business.image, ...galleryImages].filter(Boolean)))
    : [];

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => prev !== null ? (prev + 1) % allImages.length : 0);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allImages.length]);

  // Lead Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Cart & WhatsApp Home Delivery State
  const [cart, setCart] = useState<{ [id: number]: { id: number; name: string; price: number; count: number; image?: string | null } }>({});
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderCustName, setOrderCustName] = useState(loggedInUser?.name || '');
  const [orderCustPhone, setOrderCustPhone] = useState(loggedInUser?.phone || '');
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState('');
  const [orderDeliveryLandmark, setOrderDeliveryLandmark] = useState('');
  const [orderDeliveryNotes, setOrderDeliveryNotes] = useState('');

  const cartItems = Object.values(cart);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.count, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);

  const addToCart = (prod: Product) => {
    const priceNum = parseFloat(prod.price as any) || 0;
    setCart(prev => {
      const existing = prev[prod.id];
      const newCount = existing ? existing.count + 1 : 1;
      return {
        ...prev,
        [prod.id]: {
          id: prod.id,
          name: prod.name,
          price: priceNum,
          count: newCount,
          image: prod.image
        }
      };
    });
    showToast(`Added "${prod.name}" to cart!`, 'success');
  };

  const updateCartCount = (prodId: number, delta: number) => {
    setCart(prev => {
      const existing = prev[prodId];
      if (!existing) return prev;
      const newCount = existing.count + delta;
      if (newCount <= 0) {
        const next = { ...prev };
        delete next[prodId];
        return next;
      }
      return {
        ...prev,
        [prodId]: { ...existing, count: newCount }
      };
    });
  };

  const handleWhatsAppCheckout = () => {
    if (!orderCustName.trim() || !orderCustPhone.trim()) {
      showToast('Please enter your Name and Mobile Number.', 'error');
      return;
    }
    if (!orderDeliveryAddress.trim()) {
      showToast('Please enter your Delivery Address in Boisar.', 'error');
      return;
    }

    const itemsList = cartItems
      .map((item, idx) => `${idx + 1}. *${item.name}* x ${item.count} = ₹${(item.price * item.count).toLocaleString('en-IN')}`)
      .join('\n');

    const fullAddress = `${orderDeliveryAddress}${orderDeliveryLandmark ? `, Landmark: ${orderDeliveryLandmark}` : ''}`;

    const message = `🛍️ *NEW HOME DELIVERY ORDER - Majh Boisar*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${orderCustName}
📱 *Phone Number:* ${orderCustPhone}
📍 *Delivery Address:* ${fullAddress}
${orderDeliveryNotes ? `📝 *Special Notes:* ${orderDeliveryNotes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
🛒 *ORDER ITEMS (${totalCartCount}):*
${itemsList}
━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL AMOUNT:* ₹${totalCartPrice.toLocaleString('en-IN')}
🚚 *Delivery Mode:* Home Delivery in Boisar
━━━━━━━━━━━━━━━━━━━━
_Order submitted via MajhBoisar.in_`;

    const targetPhone = (business?.whatsapp || business?.phone || '').replace(/\+/g, '').replace(/\s/g, '');
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setCheckoutModalOpen(false);
    setCart({});
    showToast('Order sent to store WhatsApp!', 'success');
  };

  const fetchBusiness = async () => {
    try {
      let trackParam = '';
      if (typeof window !== 'undefined') {
        const sessionKey = `mb_viewed_${businessId}`;
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, '1');
          trackParam = '?trackView=true';
        }
      }
      const res = await fetch(`/api/businesses/${businessId}${trackParam}`);
      if (res.ok) {
        const data = await res.json();
        setBusiness(data);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // Client-side Fallback check for localStorage or mock profiles
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('majh_boisar_special_profiles');
        const profilesMap = saved ? JSON.parse(saved) : specialProfiles;
        let found: any = null;
        for (const cat in profilesMap) {
          const match = (profilesMap[cat] || []).find((p: any) => p.id === businessId);
          if (match) { found = match; break; }
        }
        if (found) {
          setBusiness({
            id: found.id,
            name: found.name,
            category: found.category,
            description: found.bio || found.description || 'Verified Business in Boisar',
            address: found.address || "Boisar, MH",
            phone: found.phone || "9820098200",
            whatsapp: found.phone || "9820098200",
            verified: found.verified ?? true,
            premium: true,
            subscription: found.subscription || 'Premium',
            rating: found.rating || 4.8,
            reviewCount: found.reviewsCount || 12,
            image: found.avatar || found.image || "",
            gallery: found.gallery || [],
            location: found.location || "Boisar, MH",
            workingHours: "9:00 AM - 8:00 PM",
            views: found.views || 142,
            phoneClicks: 0, whatsappClicks: 0, directionClicks: 0, websiteClicks: 0,
            website: null, email: null, instagram: null, facebook: null, youtube: null,
            services: (found.services || []).map((s: any, idx: number) => typeof s === 'string' ? { id: idx, name: s } : s),
            products: [],
            faqs: [],
            reviews: (found.reviews || []).map((r: any, idx: number) => ({
              id: idx, userName: r.user || r.userName || 'Customer', rating: r.rating || 5, comment: r.comment || 'Good', createdAt: new Date().toISOString()
            }))
          });
          setLoading(false);
          return;
        }
      } catch (err) { }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    if (!isNaN(businessId)) {
      fetchBusiness();
      if (typeof window !== 'undefined') {
        const bookmarks = JSON.parse(localStorage.getItem('majh_boisar_favs') || '[]');
        setIsFavorite(bookmarks.includes(businessId));
      }
    } else {
      setLoading(false);
    }
  }, [businessId]);

  const handleToggleFavorite = () => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('majh_boisar_favs') || '[]');
      let updated;
      if (bookmarks.includes(businessId)) {
        updated = bookmarks.filter((id: number) => id !== businessId);
        setIsFavorite(false);
      } else {
        updated = [...bookmarks, businessId];
        setIsFavorite(true);
      }
      localStorage.setItem('majh_boisar_favs', JSON.stringify(updated));
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: business?.name || 'Majh Boisar',
        text: `Check out ${business?.name || 'this business'} on Majh Boisar!`,
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (e) {
          return;
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        showToast('Business page link copied to clipboard! 📋', 'success');
        setTimeout(() => setCopiedLink(false), 2000);
      } catch (err) { }
    }
  };

  const trackClick = async (type: 'phoneClicks' | 'whatsappClicks' | 'directionClicks' | 'websiteClicks') => {
    if (!business) return;
    try {
      const currentVal = (business as any)[type] || 0;
      await fetch(`/api/businesses/${businessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type]: currentVal + 1 })
      });
      setBusiness(prev => prev ? { ...prev, [type]: prev[type] + 1 } : null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      showToast("Please enter Name and Mobile Number!", 'warning');
      return;
    }
    setLeadSuccess(true);
    showToast('Enquiry sent! The business owner will contact you shortly 📞', 'success');
    setTimeout(() => {
      setLeadSuccess(false);
      setEnquiryModalOpen(false);
      setLeadName('');
      setLeadPhone('');
    }, 3000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please fill in your name and comment.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (!res.ok) throw new Error('Failed to submit review');

      setReviewSuccess(true);
      setReviewComment('');
      setReviewName('');
      fetchBusiness();
      showToast("Thank you! Review posted successfully ⭐", 'success');
    } catch (err: any) {
      console.error(err);
      showToast("Failed to submit review. Please try again.", 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pb-16 text-slate-800 font-sans animate-pulse">
        {/* Skeleton Top Profile Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
          <div className="border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md bg-white">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="flex flex-row items-start gap-3 sm:gap-6 w-full">
                {/* Image Skeleton */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-2xl bg-slate-200"></div>
                {/* Text Skeleton */}
                <div className="space-y-3 pt-2 w-full max-w-md">
                  <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
                  <div className="h-8 w-3/4 bg-slate-200 rounded-md"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-12 bg-slate-200 rounded"></div>
                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-slate-100 my-4" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
                <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
                <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Layout Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Main column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-64"></div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-48"></div>
            </div>
            {/* Right Side column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-80"></div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="font-extrabold text-sm text-slate-800 mb-2">Business Profile Not Found</h2>
        <p className="text-xs text-slate-555 mb-6">The business listing you are searching for does not exist or has been removed.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }



  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16 text-slate-800 font-sans">

      {/* 2. Top Profile Main Banner Card (Premium Modern Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-5">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-bold text-xs mb-3 transition-colors w-max cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div 
          className="relative border border-slate-200 rounded-3xl p-3.5 sm:p-5 shadow-sm bg-white overflow-hidden text-left bg-no-repeat bg-cover bg-right-bottom sm:bg-center"
          style={{
            backgroundImage: "url('/business-header-bg.png')",
            backgroundPosition: 'right bottom',
            backgroundSize: 'cover'
          }}
        >
          {/* Subtle light gradient wash to ensure 100% crisp text readability */}
          <div className="absolute inset-0 bg-white/75 sm:bg-white/55 pointer-events-none" />

          <div className="flex flex-col gap-3 relative z-10">

            {/* Top row: Avatar Image + Title Details Side by Side */}
            <div className="flex items-start gap-3 sm:gap-4.5 w-full">
              {business.image ? (
                <div
                  onClick={() => setLightboxIndex(0)}
                  className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50 cursor-pointer hover:opacity-95 transition-opacity relative flex items-center justify-center"
                  title="Click to view full cover photo"
                >
                  <img
                    src={business.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-sm opacity-20 scale-110 pointer-events-none"
                  />
                  <img loading="lazy" decoding="async" src={business.image} alt={business.name} className="relative z-10 w-full h-full object-contain p-1" />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-teal-50 flex flex-col items-center justify-center">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-teal-300 mb-0.5" />
                  <span className="text-[9px] font-bold text-teal-500">No Image</span>
                </div>
              )}

              <div className="space-y-1 sm:space-y-1.5 text-left min-w-0 flex-1">

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-1">
                  <span className="bg-teal-50 border border-teal-200 text-teal-800 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    {business.category}
                  </span>
                  {business.verified && (
                    <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                  {Boolean(business.subscription && business.subscription !== 'Free' && (business as any).hasHomeDelivery !== false) && (
                    <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                      <Truck className="w-2.5 h-2.5 text-white" />
                      <span>🛵 Home Delivery</span>
                    </span>
                  )}
                </div>

                {/* Business Name */}
                <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight leading-tight line-clamp-2">
                  {business.name}
                </h1>

                {/* Ratings and Location */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-600 font-semibold pt-0.5">
                  <div className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-black px-1.5 py-0.5 rounded-md shadow-2xs">
                    <span>{business.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                  </div>
                  <span className="text-slate-500 font-bold">
                    {business.reviewCount} {business.reviewCount === 1 ? 'Rating' : 'Ratings'}
                  </span>
                  <span className="text-slate-300">•</span>
                  {business.googleMaps ? (
                    <a
                      href={business.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('directionClicks')}
                      className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-0.5 hover:underline cursor-pointer truncate max-w-[150px] sm:max-w-none"
                    >
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{business.location}, Boisar</span>
                    </a>
                  ) : (
                    <span className="text-slate-600 font-bold flex items-center gap-0.5 truncate max-w-[150px] sm:max-w-none">
                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{business.location}, Boisar</span>
                    </span>
                  )}
                </div>

              </div>
            </div>

            {/* Action Buttons Row - Clean 3-Button Grid on Mobile, Proportional on Desktop */}
            <div className="flex flex-col gap-2.5 pt-2.5 border-t border-slate-100">

              {/* Row 1: The 3 Core CTAs */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3 w-full">
                <a
                  href={isLoggedIn ? `tel:${business.phone}` : '#'}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      setLoginModalOpen(true);
                    } else {
                      trackClick('phoneClicks');
                    }
                  }}
                  className="px-2 sm:px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Phone className="w-3 h-3 text-white shrink-0" />
                  <span>Call</span>
                </a>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setLoginModalOpen(true);
                      return;
                    }
                    setEnquiryModalOpen(true);
                  }}
                  className="px-2 sm:px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Mail className="w-3 h-3 text-white shrink-0" />
                  <span>Enquire</span>
                </button>

                <a
                  href={isLoggedIn ? `https://wa.me/${business.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}` : '#'}
                  target={isLoggedIn ? "_blank" : undefined}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      setLoginModalOpen(true);
                    } else {
                      trackClick('whatsappClicks');
                    }
                  }}
                  className="px-2 sm:px-6 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-800 font-black text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-3 h-3 fill-emerald-700 shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.48 2.016 14.005 1.002 11.995 1.002 6.559 1.002 2.135 5.372 2.131 10.801c-.001 1.76.46 3.479 1.336 5.003L2.5 21.53l5.837-1.526-.69.41z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Row 2: Share Button & Rate Stars Combined in 1 Clean Bar */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="px-3 py-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1.5 text-xs font-bold shrink-0"
                    title="Share Profile"
                  >
                    {copiedLink ? (
                      <span className="text-[10px] font-black text-emerald-700 uppercase">Copied!</span>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px] font-bold">Share</span>
                      </>
                    )}
                  </button>

                  {business.instagram && (
                    <a href={business.instagram} target="_blank" className="p-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all shadow-2xs active:scale-95 flex items-center justify-center cursor-pointer group shrink-0" title="Instagram">
                      <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  )}
                </div>

                {/* Click to rate star buttons */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl text-xs">
                  <span className="font-extrabold text-slate-500 text-[11px]">Rate:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setReviewRating(s);
                          setActiveTab('reviews');
                          const el = document.getElementById('review-form-anchor');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                        title={`Rate ${s} star${s > 1 ? 's' : ''}`}
                      >
                        <Star className={`w-3.5 h-3.5 ${s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 3. Main Detail Tabs and columns grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">

        {/* Navigation Tab Menu - Compact & Clean on Mobile */}
        <div className="mb-4 flex gap-1 sm:gap-1.5 overflow-x-auto whitespace-nowrap bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs w-full scrollbar-hide scroll-smooth">
          {([
            { id: 'overview', label: 'Overview' },
            { id: 'catalog', label: 'Products & Services' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'faqs', label: 'FAQs' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id
                  ? 'bg-teal-700 text-white shadow-xs font-black'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Column Grid (Left Content Area 8 cols, Right Contact Sidebar 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column Content Area */}
          <div className="lg:col-span-8 space-y-6">

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Shop Photos Gallery Grid - Only shown if real photos exist */}
                {allImages.length > 0 && (
                  <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm text-left">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3.5">
                      Photos Gallery ({allImages.length})
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
                      {allImages.map((url, index) => (
                        <div
                          key={index}
                          onClick={() => setLightboxIndex(index)}
                          className="aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs relative group bg-slate-900/5 flex items-center justify-center transition-all duration-300 hover:shadow-md hover:border-teal-400"
                        >
                          {/* Ambient blur backdrop for seamless aesthetic fill */}
                          <img
                            src={url}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
                          />
                          <img
                            loading="lazy"
                            decoding="async"
                            src={url}
                            alt={`Gallery image ${index + 1}`}
                            className="relative z-10 w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
                            <span className="text-[11px] font-black text-white bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-md">
                              🔍 View
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Section */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-teal-650">
                    <Info className="w-4 h-4" />
                    <span>About Business</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {(business.description || '').replace(/\[Created by Admin\]\s*/gi, '').trim() || `${business.name} is a top local provider for ${business.category} services in Boisar. Contact them for bookings, quotes, or services.`}
                  </p>
                </div>

                {/* Services summary overview list */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Popular Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {business.services.length > 0 ? (
                      business.services.map((srv) => (
                        <span key={srv.id} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                          ✓ {srv.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Category specific services available upon request.</span>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: PRODUCTS & SERVICES */}
            {activeTab === 'catalog' && (() => {
              const hasProducts = business.products && business.products.length > 0;
              const hasServices = business.services && business.services.length > 0;
              const showServicesFirst = (hasServices && !hasProducts) || (hasServices && hasProducts && business.services.length > business.products.length);

              // 1. Featured Products Component
              const renderProducts = () => (
                <div key="products-sec" className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <span>📦</span>
                      <span>Products ({business.products.length})</span>
                    </h4>
                    <span className="text-[10.5px] text-slate-500 font-medium">Available stock</span>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    {business.products.map((prod) => {
                      const inCart = cart[prod.id];
                      const isFoodCat = Boolean((business.category || '').toLowerCase().match(/(food|restaurant|cafe|bakery|sweet|snack|thali|dining|dhaba|pizza|burger|hotel|farsan)/i));
                      const hasDeliveryPlan = Boolean(business.subscription && business.subscription !== 'Free' && (business as any).hasHomeDelivery !== false);

                      return (
                        <div
                          key={prod.id}
                          className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors group text-left"
                        >
                          {/* Left Column: Product Info */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {/* Veg / Non-Veg food indicator shown ONLY for Food categories */}
                              {isFoodCat && (
                                <span className="w-3.5 h-3.5 rounded-xs border border-emerald-600 bg-white flex items-center justify-center shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                </span>
                              )}
                              <h5 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                                {prod.name}
                              </h5>
                            </div>

                            {prod.description && (
                              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 pt-0.5">
                                {prod.description}
                              </p>
                            )}

                            <div className="pt-1 flex items-center gap-2">
                              <span className="text-sm sm:text-base font-black text-slate-950">
                                {prod.price ? `₹${parseFloat(prod.price as any).toLocaleString('en-IN')}` : 'Best Price'}
                              </span>
                            </div>
                          </div>

                          {/* Right Column: Photo & Action Button */}
                          <div className="relative shrink-0 flex flex-col items-center pb-3">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-50 relative flex items-center justify-center">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <span className="text-2xl">📦</span>
                              )}
                            </div>

                            {/* Action Button: Add to Cart (If Subscribed Plan) or Inquire/Call */}
                            <div className="absolute -bottom-1.5 z-10">
                              {hasDeliveryPlan ? (
                                inCart ? (
                                  <div className="flex items-center bg-slate-950 text-white rounded-xl p-0.5 shadow-md border border-white/20">
                                    <button
                                      type="button"
                                      onClick={() => updateCartCount(prod.id, -1)}
                                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-black cursor-pointer transition-colors"
                                      title="Decrease quantity"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-7 text-center font-black text-xs text-emerald-300">
                                      {inCart.count}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateCartCount(prod.id, 1)}
                                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-black cursor-pointer transition-colors"
                                      title="Increase quantity"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => addToCart(prod)}
                                    className="bg-white hover:bg-emerald-50 text-emerald-700 font-black text-xs px-4 py-1.5 rounded-xl border border-emerald-400 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-md hover:shadow-lg"
                                  >
                                    <Plus className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                    <span>ADD</span>
                                  </button>
                                )
                              ) : (
                                <a
                                  href={isLoggedIn ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I am interested in purchasing "${prod.name}" (₹${prod.price || 'quote'}). Is it in stock?`)}` : '#'}
                                  target={isLoggedIn ? "_blank" : undefined}
                                  onClick={(e) => {
                                    if (!isLoggedIn) {
                                      e.preventDefault();
                                      setLoginModalOpen(true);
                                    } else {
                                      trackClick('whatsappClicks');
                                    }
                                  }}
                                  className="bg-white hover:bg-slate-50 text-slate-700 font-black text-[11px] px-3 py-1.5 rounded-xl border border-slate-300 transition-all flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                  <span>💬 Enquire</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

              // 2. Offered Services Component
              const renderServices = () => (
                <div key="services-sec" className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <h4 className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <span>🛠️</span>
                      <span>Services ({business.services.length})</span>
                    </h4>
                    <span className="text-[10.5px] text-slate-500 font-medium">Verified local rates</span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {business.services.map((srv) => (
                      <div
                        key={srv.id}
                        className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-teal-500/40 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-md transition-all group"
                      >
                        <div className="flex gap-3 items-start flex-1 min-w-0">
                          {/* Service Icon / Thumbnail */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-teal-100 bg-teal-50 flex items-center justify-center shrink-0 shadow-2xs text-lg">
                            {(srv as any).image ? (
                              <img src={(srv as any).image} alt={srv.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>🛠️</span>
                            )}
                          </div>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h5 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                                {srv.name}
                              </h5>
                              {srv.duration && (
                                <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                  <span>⏱️</span>
                                  <span>{srv.duration}</span>
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                              {srv.description || `Specialized ${business.category} service executed with verified quality.`}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                          <span className="font-black text-xs sm:text-sm text-teal-700">
                            {srv.price ? `₹${parseFloat(srv.price as any).toLocaleString('en-IN')}` : 'Contact for Quote'}
                          </span>

                          <a
                            href={isLoggedIn ? `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Hi ${business.name}, I want to book/enquire about the "${srv.name}" service listed on Majh Boisar.`)}` : '#'}
                            target={isLoggedIn ? "_blank" : undefined}
                            onClick={(e) => {
                              if (!isLoggedIn) {
                                e.preventDefault();
                                setLoginModalOpen(true);
                              } else {
                                trackClick('whatsappClicks');
                              }
                            }}
                            className="bg-teal-700 hover:bg-teal-800 active:scale-98 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Book / Enquire</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );

              // 3. Fallback when both are empty
              if (!hasProducts && !hasServices) {
                return (
                  <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm text-center space-y-2">
                    <div className="text-3xl">🛍️</div>
                    <h4 className="font-black text-sm text-slate-800">Products &amp; Services Catalog</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                      Standard {business.category} services and products are available directly. Please call or WhatsApp {business.name} for pricing and inquiries.
                    </p>
                    <div className="pt-2 flex justify-center gap-2">
                      <a
                        href={isLoggedIn ? `tel:${business.phone}` : '#'}
                        onClick={(e) => {
                          if (!isLoggedIn) {
                            e.preventDefault();
                            setLoginModalOpen(true);
                          }
                        }}
                        className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Business</span>
                      </a>
                    </div>
                  </div>
                );
              }

              // Return with dynamic priority
              return (
                <div className="space-y-6 text-left animate-in fade-in duration-200">
                  {showServicesFirst ? (
                    <>
                      {hasServices && renderServices()}
                      {hasProducts && renderProducts()}
                    </>
                  ) : (
                    <>
                      {hasProducts && renderProducts()}
                      {hasServices && renderServices()}
                    </>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTENT: USER REVIEWS & FORM */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">

                {/* Review Form block */}
                <div id="review-form-anchor" className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-teal-600" />
                    <span>Share Your Review</span>
                  </h3>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500/50 font-bold"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Rating Score</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500/50 font-bold cursor-pointer"
                        >
                          <option value="5">5 Star - Excellent</option>
                          <option value="4">4 Star - Very Good</option>
                          <option value="3">3 Star - Good</option>
                          <option value="2">2 Star - Average</option>
                          <option value="1">1 Star - Poor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Review Comments</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-teal-500/50 font-bold placeholder-slate-400"
                        placeholder="Write details of your experience with this listing..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md active:scale-98 cursor-pointer transition-all uppercase tracking-wider"
                    >
                      Post Review
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm text-left">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">User Ratings ({business.reviews.length})</h3>
                  {business.reviews.length > 0 ? (
                    <div className="space-y-4 divide-y divide-slate-100">
                      {business.reviews.map((rev) => (
                        <div key={rev.id} className="pt-4 first:pt-0 text-xs">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 bg-teal-50 border border-teal-150 rounded-full flex items-center justify-center text-teal-600 font-black text-[10px]">
                                {rev.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-805 leading-none">{rev.userName}</h4>
                                <span className="text-[9px] text-slate-400 font-bold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed pl-9">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-medium text-center py-6">No user reviews submitted yet.</p>
                  )}
                </div>

              </div>
            )}

            {/* TAB CONTENT: FAQS */}
            {activeTab === 'faqs' && (
              <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm text-left space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
                {business.faqs.length > 0 ? (
                  <div className="space-y-4">
                    {business.faqs.map((faq) => (
                      <div key={faq.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <h4 className="font-extrabold text-xs text-slate-800 mb-1 flex items-start gap-1">
                          <span className="text-teal-600">Q:</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-xs text-slate-500 font-medium pl-4 leading-normal">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-bold text-center py-6">No FAQs configured for this business yet.</p>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Contact Details Sidebar (Screenshot Style) */}
          <div className="lg:col-span-4 space-y-5">

            {/* Contact details card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2.5">
                Contact Directory
              </h3>

              <div className="space-y-4">

                {/* 1. Phone number */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <a
                    href={isLoggedIn ? `tel:${business.phone}` : '#'}
                    onClick={(e) => {
                      if (!isLoggedIn) {
                        e.preventDefault();
                        setLoginModalOpen(true);
                      }
                    }}
                    className="text-sm font-black text-teal-650 hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-teal-605 shrink-0" />
                    <span>{isLoggedIn ? business.phone : 'Login to View Number'}</span>
                  </a>
                </div>

                {/* 2. Full address details */}
                <div className="space-y-1 pt-3.5 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Postal Address</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1 flex items-start gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{business.address}, {business.location}, Boisar, Palghar, Maharashtra</span>
                  </p>

                  {/* Copy actions */}
                  <div className="flex items-center gap-3 pt-2.5 pl-6 text-xs text-teal-650 font-bold">
                    <button
                      onClick={() => {
                        trackClick('directionClicks');
                        if (business.googleMaps) {
                          window.open(business.googleMaps, '_blank');
                        } else {
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ', ' + business.location + ', Boisar')}`, '_blank');
                        }
                      }}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Get Directions
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${business.address}, ${business.location}, Boisar`);
                        alert("Address copied to clipboard!");
                      }}
                      className="hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Copy Address
                    </button>
                  </div>
                </div>

                {/* 3. Hours info */}
                <div className="space-y-1 pt-3.5 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Hours of Operation</span>
                  <p className="text-xs text-slate-750 font-bold mt-1 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{business.workingHours}</span>
                  </p>
                </div>

                {/* 4. Link website if configured */}
                {business.website && (
                  <div className="space-y-1 pt-3.5 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Official Web Link</span>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackClick('websiteClicks')}
                      className="text-xs font-black text-teal-605 hover:underline break-all block mt-1"
                    >
                      {business.website}
                    </a>
                  </div>
                )}

              </div>
            </div>

            {/* Quick request quote card */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-5 shadow-md text-white text-left">
              <h3 className="text-xs font-black uppercase tracking-wider mb-1.5">Get Price Quotes</h3>
              <p className="text-[10px] text-slate-350 leading-tight mb-4">Send your requirements directly to {business.name} for quotation details.</p>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginModalOpen(true);
                    return;
                  }
                  setEnquiryModalOpen(true);
                }}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-black text-xs py-2.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1 uppercase tracking-wider"
              >
                <span>Send Requirement</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 4. Lightbox Image Viewer */}
      {/* 4. Lightbox Modal */}
      {lightboxIndex !== null && allImages[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 h-screen h-[100dvh] w-screen bg-slate-950/95 backdrop-blur-md z-[9999] cursor-zoom-out select-none"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors z-50 shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left Arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0);
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors z-50 hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Right Arrow */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev !== null ? (prev + 1) % allImages.length : 0);
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors z-50 hover:scale-105 active:scale-95 shadow-lg"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Image Container - Absolutely Centered 50%/50% */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl flex flex-col items-center justify-center cursor-default z-40"
          >
            <img
              src={allImages[lightboxIndex]}
              alt="Lightbox Zoom"
              className="max-w-full max-h-[65dvh] sm:max-h-[75vh] object-contain rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            />
            {/* Image counter indicator */}
            <div className="mt-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-white/15 shadow-md">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* 5. Enquiry Lead Modal */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-fade-in text-left">
            <button
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 rounded-full hover:bg-slate-100 text-slate-450 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5 mt-1">
              <span className="text-2xl">✉️</span>
              <h3 className="font-extrabold text-slate-800 text-sm mt-2 leading-tight">
                Get Quotes from {business.name}
              </h3>
              <p className="text-[10px] text-slate-450 font-bold uppercase mt-1 tracking-wider">
                Category: {business.category}
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 font-bold placeholder-slate-400"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                required
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-teal-500/50 font-bold placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={leadSuccess}
                className="w-full btn-teal text-white font-black text-xs py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 uppercase"
              >
                {leadSuccess ? (
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

      {/* 6. Sticky Bottom Floating Cart Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-200 shadow-2xl p-3 sm:p-4 animate-fade-in text-left">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                🛒 {totalCartCount}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  Total: ₹{totalCartPrice.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] sm:text-xs text-emerald-700 font-bold flex items-center gap-1 truncate">
                  <Truck className="w-3 h-3 shrink-0" />
                  <span>Direct WhatsApp Home Delivery</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-black px-4 sm:px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
            >
              <span>View Order &amp; Address</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. WhatsApp Home Delivery Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto text-left">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Home Delivery in Boisar</span>
              </div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">
                Order from {business.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Enter your delivery address to place your order directly on WhatsApp.
              </p>
            </div>

            {/* Order Items Review */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 mb-4 space-y-2.5">
              <p className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider">
                Order Summary ({totalCartCount} {totalCartCount === 1 ? 'item' : 'items'})
              </p>
              <div className="divide-y divide-slate-200/60 max-h-40 overflow-y-auto space-y-2 pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        ₹{item.price.toLocaleString('en-IN')} x {item.count}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-emerald-800">
                        ₹{(item.price * item.count).toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCartCount(item.id, -1)}
                          className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-black px-1">{item.count}</span>
                        <button
                          onClick={() => updateCartCount(item.id, 1)}
                          className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-black text-xs sm:text-sm text-slate-900">
                <span>Total Bill:</span>
                <span className="text-emerald-700">₹{totalCartPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={orderCustName}
                  onChange={(e) => setOrderCustName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={orderCustPhone}
                  onChange={(e) => setOrderCustPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-wider mb-1">
                  Delivery Address (Boisar) *
                </label>
                <textarea
                  rows={2}
                  placeholder="Flat/House No, Building Name, Area in Boisar"
                  value={orderDeliveryAddress}
                  onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9.5px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near Railway Station"
                    value={orderDeliveryLandmark}
                    onChange={(e) => setOrderDeliveryLandmark(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Deliver by 6 PM"
                    value={orderDeliveryNotes}
                    onChange={(e) => setOrderDeliveryNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm py-3 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.48 2.016 14.005 1.002 11.995 1.002 6.559 1.002 2.135 5.372 2.131 10.801c-.001 1.76.46 3.479 1.336 5.003L2.5 21.53l5.837-1.526-.69.41z" />
                </svg>
                <span>Confirm &amp; Order on WhatsApp (₹{totalCartPrice.toLocaleString('en-IN')})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
