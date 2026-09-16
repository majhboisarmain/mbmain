'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Phone, MessageSquare, MapPin, Clock, Star,
  CheckCircle, ArrowLeft, Send, Sparkles, AlertCircle, ShoppingBag,
  ChevronRight, ChevronLeft, User, Heart, Share2, Info, X, Bookmark, Copy, Edit3, Mail, Building2,
  Truck, Plus, Minus, Trash2, ArrowRight, Search, ShieldCheck, Tag, ExternalLink,
  Image as ImageIcon, Check, Store, PackagePlus, Wrench, Navigation, CheckCircle2, Camera,
  Lock, Globe
} from 'lucide-react';
import { specialProfiles } from '@/lib/mockProfiles';

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
  const [activeTab, setActiveTab] = useState<'marketplace' | 'gallery' | 'reviews' | 'faqs'>('marketplace');

  // Filter within marketplace (all, products, services)
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'products' | 'services'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Bookmark and Share state
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gallery Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Lead Modal state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Owner Management Modal States
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [addingService, setAddingService] = useState(false);

  // New Product Form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('');

  // New Service Form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Cart & WhatsApp Home Delivery State
  const [cart, setCart] = useState<{ [id: number]: { id: number; name: string; price: number; count: number; image?: string | null } }>({});
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderCustName, setOrderCustName] = useState(loggedInUser?.name || '');
  const [orderCustPhone, setOrderCustPhone] = useState(loggedInUser?.phone || '');
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState('');
  const [orderDeliveryLandmark, setOrderDeliveryLandmark] = useState('');
  const [orderDeliveryNotes, setOrderDeliveryNotes] = useState('');

  const isOwnerOrAdmin = useMemo(() => {
    if (!isLoggedIn) return false;
    if (currentRole === 'Admin') return true;
    const cleanUserPhone = (loggedInUser?.phone || '').replace(/\D/g, '');
    const cleanBizPhone = (business?.phone || '').replace(/\D/g, '');
    const cleanCreatedBy = ((business as any)?.createdBy || '').replace(/\D/g, '');
    return Boolean(cleanUserPhone && (cleanUserPhone === cleanBizPhone || cleanUserPhone === cleanCreatedBy));
  }, [isLoggedIn, currentRole, loggedInUser, business]);

  const rawImageParts = business?.image ? business.image.split('||gallery_sep||').filter(Boolean) : [];
  const galleryImages = business && Array.isArray((business as any).gallery)
    ? (business as any).gallery.filter(Boolean)
    : [];

  const allImages = business
    ? Array.from(new Set([...rawImageParts, ...galleryImages].filter(Boolean)))
    : [];

  const coverPhoto = useMemo(() => {
    if (!business) return null;
    if (allImages.length > 1) {
      return allImages[1];
    }
    return null;
  }, [business, allImages]);

  const hasDelivery = Boolean(business?.subscription && business.subscription !== 'Free' && (business as any).hasHomeDelivery !== false);

  const cartItems = Object.values(cart);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.count, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);

  // Keyboard navigation for lightbox
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

  // Prevent background body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = Boolean(
      checkoutModalOpen || enquiryModalOpen || addProductModalOpen || addServiceModalOpen || lightboxIndex !== null
    );
    if (isModalOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevTouch = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouch;
      };
    }
  }, [checkoutModalOpen, enquiryModalOpen, addProductModalOpen, addServiceModalOpen, lightboxIndex]);

  // Safe WhatsApp URL helper ensuring correct international format (+91 for India)
  const getWhatsAppUrl = (phone: string | undefined | null, text: string) => {
    let clean = (phone || '').replace(/\D/g, '');
    if (clean.length === 10) {
      clean = `91${clean}`;
    } else if (clean.startsWith('0') && clean.length === 11) {
      clean = `91${clean.slice(1)}`;
    }
    return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  };

  const addToCart = (prod: Product) => {
    if (!hasDelivery) {
      showToast('Online cart ordering is only available for subscription-enabled stores.', 'error');
      return;
    }
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
    showToast(`Added "${prod.name}" to cart! 🛒`, 'success');
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
      .map((item, idx) => `${idx + 1}. *${item.name}* × ${item.count} 👉 ₹${(item.price * item.count).toLocaleString('en-IN')}`)
      .join('\n');

    const fullAddress = `${orderDeliveryAddress.trim()}${orderDeliveryLandmark.trim() ? ` (Landmark: ${orderDeliveryLandmark.trim()})` : ''}`;

    const message = `🛍️ *NEW HOME DELIVERY ORDER*
━━━━━━━━━━━━━━━━━━━━
🏬 *Store:* ${business?.name}
👤 *Customer:* ${orderCustName.trim()}
📱 *Phone:* ${orderCustPhone.trim()}
📍 *Address:* ${fullAddress}
${orderDeliveryNotes.trim() ? `📝 *Notes:* ${orderDeliveryNotes.trim()}\n` : ''}━━━━━━━━━━━━━━━━━━━━
🛒 *ITEMS ORDERED (${totalCartCount}):*
${itemsList}
━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL BILL:* ₹${totalCartPrice.toLocaleString('en-IN')}
🚚 *Delivery:* Direct Home Delivery (Boisar)
━━━━━━━━━━━━━━━━━━━━
_Order submitted via Majh Boisar Marketplace_
_Please confirm order acceptance & delivery time._`;

    const targetPhone = business?.whatsapp || business?.phone || '';
    window.open(getWhatsAppUrl(targetPhone, message), '_blank');
    setCheckoutModalOpen(false);
    setCart({});
    showToast('Order dispatched to store WhatsApp! 🚀', 'success');
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
      console.error('Error fetching business:', e);
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
        showToast('Removed from saved stores', 'info');
      } else {
        updated = [...bookmarks, businessId];
        setIsFavorite(true);
        showToast('Saved to your favorites! ❤️', 'success');
      }
      localStorage.setItem('majh_boisar_favs', JSON.stringify(updated));
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: `${business?.name} | Majh Boisar Marketplace`,
        text: `Check out ${business?.name}'s products & services on Majh Boisar!`,
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
        showToast('Storefront link copied to clipboard! 📋', 'success');
        setTimeout(() => setCopiedLink(false), 2500);
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
    showToast('Enquiry sent! The store owner will contact you shortly 📞', 'success');
    setTimeout(() => {
      setLeadSuccess(false);
      setEnquiryModalOpen(false);
      setLeadName('');
      setLeadPhone('');
    }, 2500);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please fill in your name and review message.', 'warning');
      return;
    }

    setReviewSubmitting(true);
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

      setReviewComment('');
      setReviewName('');
      await fetchBusiness();
      showToast("Thank you! Review posted successfully ⭐", 'success');
    } catch (err: any) {
      console.error(err);
      showToast("Failed to submit review. Please try again.", 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Product Image Handler
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo size must be under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProductImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice.trim()) {
      showToast('Product Name and Price are required!', 'warning');
      return;
    }

    setAddingProduct(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          name: newProductName.trim(),
          price: parseFloat(newProductPrice),
          description: newProductDesc.trim() || null,
          image: newProductImage || null
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add product');
      }

      showToast(`Product "${newProductName}" added to store! 📦`, 'success');
      setNewProductName('');
      setNewProductPrice('');
      setNewProductDesc('');
      setNewProductImage('');
      setAddProductModalOpen(false);
      await fetchBusiness();
    } catch (err: any) {
      showToast(err.message || 'Error adding product', 'error');
    } finally {
      setAddingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: number, prodName: string) => {
    if (!confirm(`Are you sure you want to delete "${prodName}"?`)) return;
    try {
      const res = await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Removed "${prodName}" from store`, 'info');
        await fetchBusiness();
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Add Service Submit
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      showToast('Service Name is required!', 'warning');
      return;
    }

    setAddingService(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          name: newServiceName.trim(),
          price: newServicePrice.trim() ? parseFloat(newServicePrice) : null,
          duration: newServiceDuration.trim() || null,
          description: newServiceDesc.trim() || null
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to add service');
      }

      showToast(`Service "${newServiceName}" added to store! 🛠️`, 'success');
      setNewServiceName('');
      setNewServicePrice('');
      setNewServiceDuration('');
      setNewServiceDesc('');
      setAddServiceModalOpen(false);
      await fetchBusiness();
    } catch (err: any) {
      showToast(err.message || 'Error adding service', 'error');
    } finally {
      setAddingService(false);
    }
  };

  // Delete Service
  const handleDeleteService = async (serviceId: number, srvName: string) => {
    if (!confirm(`Are you sure you want to delete "${srvName}"?`)) return;
    try {
      const res = await fetch(`/api/services?id=${serviceId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Removed "${srvName}" from services`, 'info');
        await fetchBusiness();
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Store Owner: Quick Cover Photo Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Cover photo must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (!base64) return;

      try {
        showToast('Saving new cover photo... ⏳', 'info');
        const rawParts = business.image ? business.image.split('||gallery_sep||').filter(Boolean) : [];
        const logo = rawParts[0] || business.image || '';
        const restGallery = rawParts.slice(2);

        const res = await fetch(`/api/businesses/${business.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: logo,
            coverImage: base64,
            gallery: [base64, ...restGallery]
          })
        });

        if (res.ok) {
          showToast('Cover photo updated successfully! 🖼️', 'success');
          await fetchBusiness();
        } else {
          showToast('Failed to update cover photo', 'error');
        }
      } catch (err: any) {
        showToast('Error uploading cover photo', 'error');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Store Owner: Quick Logo / Profile Photo Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !business) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Logo must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (!base64) return;

      try {
        showToast('Saving new store logo... ⏳', 'info');
        const rawParts = business.image ? business.image.split('||gallery_sep||').filter(Boolean) : [];
        const cover = rawParts[1] || '';
        const restGallery = rawParts.slice(2);

        const res = await fetch(`/api/businesses/${business.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            coverImage: cover || undefined,
            gallery: cover ? [cover, ...restGallery] : restGallery
          })
        });

        if (res.ok) {
          showToast('Store logo updated successfully! ✨', 'success');
          await fetchBusiness();
        } else {
          showToast('Failed to update store logo', 'error');
        }
      } catch (err: any) {
        showToast('Error uploading store logo', 'error');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Filtered Products & Services
  const filteredProducts = useMemo(() => {
    if (!business?.products) return [];
    return business.products.filter(p => {
      if (!catalogSearch) return true;
      const q = catalogSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    });
  }, [business?.products, catalogSearch]);

  const filteredServices = useMemo(() => {
    if (!business?.services) return [];
    return business.services.filter(s => {
      if (!catalogSearch) return true;
      const q = catalogSearch.toLowerCase();
      return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
    });
  }, [business?.services, catalogSearch]);

  // 12-Hour Time Formatter & Real-Time Open Status
  const timing = useMemo(() => {
    const raw = business?.workingHours;
    if (!raw || !raw.trim()) {
      return { text: '9:00 AM - 9:00 PM', isOpenNow: true };
    }

    // Match patterns like "09.00 - 21.00" or "09:00 - 21:00"
    const match24 = raw.match(/(\d{1,2})[\.:](\d{2})\s*-\s*(\d{1,2})[\.:](\d{2})/);
    if (match24) {
      const startH = parseInt(match24[1], 10);
      const startM = match24[2];
      const endH = parseInt(match24[3], 10);
      const endM = match24[4];

      const startAmpm = startH >= 12 ? 'PM' : 'AM';
      const start12 = startH % 12 || 12;
      const endAmpm = endH >= 12 ? 'PM' : 'AM';
      const end12 = endH % 12 || 12;

      const formattedStart = startM === '00' ? `${start12}:00 ${startAmpm}` : `${start12}:${startM} ${startAmpm}`;
      const formattedEnd = endM === '00' ? `${end12}:00 ${endAmpm}` : `${end12}:${endM} ${endAmpm}`;

      // Calculate Open/Closed in IST (UTC+5:30)
      const now = new Date();
      const istOffset = 5.5 * 60 * 60 * 1000;
      const istTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
      const curTotalMin = istTime.getHours() * 60 + istTime.getMinutes();
      const startTotalMin = startH * 60 + parseInt(startM, 10);
      const endTotalMin = endH * 60 + parseInt(endM, 10);
      const isOpen = curTotalMin >= startTotalMin && curTotalMin <= endTotalMin;

      return {
        text: `${formattedStart} - ${formattedEnd}`,
        isOpenNow: isOpen
      };
    }

    // Fallback: strip "Mon: ...", ensure clean 12h representation
    const cleanFirst = raw.split(',')[0].replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun):\s*/i, '').trim();
    return { text: cleanFirst || '9:00 AM - 9:00 PM', isOpenNow: true };
  }, [business?.workingHours]);

  // Clean, non-repetitive formatted address
  const cleanAddress = useMemo(() => {
    if (!business) return '';
    const rawAddr = (business.address || '').trim();
    const rawLoc = (business.location || '').trim();
    const parts: string[] = [];
    if (rawAddr) parts.push(rawAddr);
    if (rawLoc && !rawAddr.toLowerCase().includes(rawLoc.toLowerCase())) {
      parts.push(rawLoc);
    }
    if (!rawAddr.toLowerCase().includes('boisar') && (!rawLoc || !rawLoc.toLowerCase().includes('boisar'))) {
      parts.push('Boisar');
    }
    return parts.filter(Boolean).join(', ');
  }, [business?.address, business?.location]);

  if (loading) {
    return (
      <div className="bg-slate-50/60 min-h-screen pb-20 text-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm animate-pulse space-y-4">
            <div className="h-28 bg-slate-200 rounded-2xl"></div>
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-slate-200 rounded"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white border border-slate-200 rounded-3xl text-center shadow-xl">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="font-black text-lg text-slate-900 mb-2">Business Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The business listing you are searching for does not exist or has been removed.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-md">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  const isFoodCategory = Boolean((business.category || '').toLowerCase().match(/(food|restaurant|cafe|bakery|sweet|snack|thali|dining|dhaba|pizza|burger|hotel|farsan)/i));

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-24 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">

      {/* Main Container - Space Contained with compact top padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">

        {/* OWNER / ADMIN QUICK CONTROL STRIP (Appears only for Owner/Admin) */}
        {isOwnerOrAdmin && (
          <div className="mb-3 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 rounded-2xl p-3 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border border-emerald-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Store className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-emerald-300">Store Owner Mode</span>
                  <span className="bg-emerald-500/30 text-emerald-200 text-[9px] font-extrabold px-2 py-0.2 rounded-full">Manager</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAddProductModalOpen(true)}
                className="bg-white hover:bg-emerald-50 text-emerald-950 active:scale-95 font-black text-xs px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <PackagePlus className="w-3.5 h-3.5 text-emerald-700" />
                <span>+ Add Product</span>
              </button>
              <button
                type="button"
                onClick={() => setAddServiceModalOpen(true)}
                className="bg-emerald-500/25 hover:bg-emerald-500/40 text-white border border-emerald-300/40 active:scale-95 font-black text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-emerald-300" />
                <span>+ Add Service</span>
              </button>
            </div>
          </div>
        )}

        {/* 1. HERO STOREFRONT CARD (Minimal & Clean) */}
        <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden text-left mb-4">
          
          {/* Cover Photo Banner (Displays shop photo with dark gradient overlay, or default Boisar header banner) */}
          <div
            onClick={() => coverPhoto && setLightboxIndex(allImages.indexOf(coverPhoto) >= 0 ? allImages.indexOf(coverPhoto) : 0)}
            className={`h-32 sm:h-44 w-full relative overflow-hidden bg-slate-900 ${coverPhoto ? 'cursor-pointer group' : ''}`}
            title={coverPhoto ? "Click to view full photo" : undefined}
          >
            {coverPhoto ? (
              <>
                <img
                  src={coverPhoto}
                  alt={`${business.name} cover`}
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark gradient overlay as desired for sleek contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-slate-900/40" />
              </>
            ) : (
              <div className="h-full w-full relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950" />
              </div>
            )}

            {/* FLOATING ACTION OVERLAYS */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto"
            >
              <button
                onClick={() => router.back()}
                className="h-8 px-3 rounded-xl bg-black/50 hover:bg-black/70 active:scale-95 text-white backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer transition-all border border-white/20"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleToggleFavorite}
                  className="h-8 w-8 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs border border-white/20 text-white"
                  title={isFavorite ? "Remove from Favorites" : "Save Store"}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="h-8 w-8 rounded-xl bg-black/50 hover:bg-black/70 active:scale-95 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xs border border-white/20"
                  title="Share Storefront"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Owner Quick Change Cover Button */}
            {isOwnerOrAdmin && (
              <label
                htmlFor="storefront-cover-upload"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-2.5 right-3 z-20 bg-slate-950/85 hover:bg-black text-white text-[10.5px] font-black px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/20 shadow-md cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                title="Change or add cover photo"
              >
                <Camera className="w-3 h-3 text-teal-300" />
                <span>{coverPhoto ? 'Change Cover' : '+ Add Cover'}</span>
                <input
                  type="file"
                  id="storefront-cover-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
              </label>
            )}
          </div>

          {/* Store Info Container */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-5 relative">
            <div className="relative z-10">
              {/* Avatar & Badges Row */}
              <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-2.5">
              {/* Store Avatar */}
              <div
                onClick={() => allImages.length > 0 && setLightboxIndex(0)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0 cursor-pointer relative group flex items-center justify-center z-20"
                title="Click to zoom photo"
              >
                {business.image ? (
                  <>
                    <img
                      src={business.image}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Search className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-teal-600">
                    <Store className="w-7 h-7 mb-0.5 opacity-70" />
                    <span className="text-[9px] font-extrabold uppercase">Store</span>
                  </div>
                )}

                {/* Owner Change Logo Overlay */}
                {isOwnerOrAdmin && (
                  <label
                    htmlFor="storefront-avatar-upload"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer z-20"
                    title="Change Logo / Profile Photo"
                  >
                    <Camera className="w-4 h-4 mb-0.5 text-teal-300" />
                    <span className="text-[8px] font-black uppercase tracking-wider">Logo</span>
                    <input
                      type="file"
                      id="storefront-avatar-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                )}
              </div>

              {/* Badges on the right */}
              <div className="flex flex-wrap items-center justify-end gap-1.5 pb-1">
                <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70">
                  {business.category}
                </span>
                {business.subscription === 'Pro' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                    <span>Gold Partner</span>
                  </span>
                ) : (business.verified || business.subscription === 'Starter') ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/80">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Verified</span>
                  </span>
                ) : null}
                {hasDelivery && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/80">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivery</span>
                  </span>
                )}
              </div>
            </div>

            {/* Shop Name - 100% Clear & Prominent */}
            <div className="pt-1 pb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {business.name}
              </h1>
            </div>

            {/* Ratings, Location & 12-Hour Timing in 1 Clean Line */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pb-3">
              <span className="inline-flex items-center gap-1 text-slate-800 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0" />
                <span>{business.rating ? business.rating.toFixed(1) : '5.0'}</span>
                <span className="text-slate-400 font-normal">({business.reviewCount || 0} reviews)</span>
              </span>

              <span className="text-slate-300">•</span>

              <span className="flex items-center gap-1 text-slate-600 font-medium text-xs">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{business.location}, Boisar</span>
              </span>

              <span className="text-slate-300">•</span>

              {/* 12-Hour Timing */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <span className={`w-2 h-2 rounded-full ${timing.isOpenNow ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className={timing.isOpenNow ? 'text-emerald-700 font-bold' : 'text-slate-500 font-bold'}>
                  {timing.isOpenNow ? 'Open Now' : 'Closed'}
                </span>
                <span className="text-slate-400 font-normal">({timing.text})</span>
              </span>
            </div>

            {/* Action Buttons Row: Clean, Balanced Minimal 3-Button Grid */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3 pt-3 border-t border-slate-100">
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
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Call</span>
              </a>

              <a
                href={isLoggedIn ? `https://wa.me/${business.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Hi ${business.name}, I found your storefront on Majh Boisar and would like to ask a few questions.`)}` : '#'}
                target={isLoggedIn ? "_blank" : undefined}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setLoginModalOpen(true);
                  } else {
                    trackClick('whatsappClicks');
                  }
                }}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white shrink-0" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginModalOpen(true);
                    return;
                  }
                  setEnquiryModalOpen(true);
                }}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>Enquire</span>
              </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2. STOREFRONT MAIN NAVIGATION TABS */}
        {(() => {
          const hasProducts = (business.products?.length || 0) > 0;
          const hasServices = (business.services?.length || 0) > 0;

          let catalogTabLabel = 'Store Catalog';
          let catalogTabCount = (business.products?.length || 0) + (business.services?.length || 0);

          if (hasProducts && !hasServices) {
            catalogTabLabel = 'Products';
            catalogTabCount = business.products.length;
          } else if (!hasProducts && hasServices) {
            catalogTabLabel = 'Services';
            catalogTabCount = business.services.length;
          } else if (hasProducts && hasServices) {
            catalogTabLabel = 'Products & Services';
          }

          const tabsList = [
            { id: 'marketplace' as const, label: catalogTabLabel, count: catalogTabCount },
            { id: 'gallery' as const, label: 'Photos', count: allImages.length },
            { id: 'reviews' as const, label: 'Reviews', count: business.reviews?.length || 0 },
            { id: 'faqs' as const, label: 'FAQs', count: business.faqs?.length || 0 }
          ];

          return (
            <div className="mb-5 flex gap-1 overflow-x-auto whitespace-nowrap p-1 rounded-xl bg-slate-100/90 border border-slate-200/70 w-full scrollbar-hide">
              {tabsList.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      activeTab === tab.id ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/60 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          );
        })()}

        {/* 3. MAIN CONTENT GRID (8 Cols Content, 4 Cols Directory Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: PRIMARY MARKETPLACE / TABS CONTENT */}
          <div className="lg:col-span-8 space-y-6">

            {/* TAB: STOREFRONT MARKETPLACE (PRODUCTS & SERVICES) */}
            {activeTab === 'marketplace' && (() => {
              const hasProducts = (business.products?.length || 0) > 0;
              const hasServices = (business.services?.length || 0) > 0;

              // CASE A: NEITHER PRODUCTS NOR SERVICES ADDED YET
              if (!hasProducts && !hasServices) {
                return (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 text-center space-y-3 shadow-xs text-left">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="text-center max-w-sm mx-auto space-y-1">
                      <h3 className="font-bold text-sm text-slate-900">
                        {isOwnerOrAdmin ? "Store Catalog is Empty" : `Welcome to ${business.name}`}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {isOwnerOrAdmin
                          ? "Add your products or services so customers in Boisar can browse and order."
                          : `${business.name} has not listed catalog items online yet. Feel free to contact them directly.`}
                      </p>
                    </div>

                    {isOwnerOrAdmin ? (
                      <div className="pt-1 flex flex-wrap justify-center items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAddProductModalOpen(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                          <span>Add Product</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddServiceModalOpen(true)}
                          className="bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Add Service</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1 flex flex-wrap justify-center items-center gap-2">
                        <a
                          href={isLoggedIn ? `tel:${business.phone}` : '#'}
                          onClick={(e) => {
                            if (!isLoggedIn) {
                              e.preventDefault();
                              setLoginModalOpen(true);
                            }
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-teal-400" />
                          <span>Call Store</span>
                        </a>
                        <a
                          href={isLoggedIn ? `https://wa.me/${business.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Hi ${business.name}, I want to enquire about your products and services.`)}` : '#'}
                          target={isLoggedIn ? "_blank" : undefined}
                          onClick={(e) => {
                            if (!isLoggedIn) {
                              e.preventDefault();
                              setLoginModalOpen(true);
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              }

              // RENDER PRODUCTS HELPER
              const renderProductsList = () => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <h3 className="font-black text-sm text-slate-900">
                        Products ({business.products.length})
                      </h3>
                    </div>

                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => setAddProductModalOpen(true)}
                        className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>
                    )}
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                      {filteredProducts.map((prod) => {
                        const inCart = cart[prod.id];
                        const priceNum = parseFloat(prod.price as any) || 0;

                        return (
                          <div
                            key={prod.id}
                            className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden text-left"
                          >
                            <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-slate-50 border border-slate-100 mb-1.5 sm:mb-2 flex items-center justify-center">
                              {prod.image ? (
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-slate-300">
                                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 mb-1 opacity-70" />
                                  <span className="text-[8px] sm:text-[9px] font-bold">No Image</span>
                                </div>
                              )}

                              {isFoodCategory && (
                                <span className="absolute top-1.5 left-1.5 w-3 h-3 rounded bg-white/95 border border-emerald-600 flex items-center justify-center shadow-xs">
                                  <span className="w-1 h-1 rounded-full bg-emerald-600" />
                                </span>
                              )}

                              {hasDelivery && (
                                <span className="absolute top-1 right-1 bg-white/95 backdrop-blur-xs text-emerald-800 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-200 shadow-2xs flex items-center gap-0.5">
                                  <Truck className="w-2.5 h-2.5 text-emerald-600" />
                                  <span className="hidden sm:inline">Delivery</span>
                                </span>
                              )}

                              {isOwnerOrAdmin && (
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="absolute bottom-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-110"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                              )}
                            </div>

                            <div className="space-y-0.5 flex-1 min-w-0">
                              <h4 className="font-bold text-[11px] sm:text-xs text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                                {prod.name}
                              </h4>
                              {prod.description && (
                                <p className="text-[9px] sm:text-[10px] text-slate-500 line-clamp-1 leading-normal">
                                  {prod.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-1.5 sm:pt-2 mt-1 sm:mt-1.5 border-t border-slate-100 flex items-center justify-between gap-1">
                              <div>
                                <span className="text-[7.5px] sm:text-[8.5px] font-bold text-slate-400 block uppercase leading-none">Price</span>
                                <span className="text-[11px] sm:text-sm font-black text-slate-900 tracking-tight">
                                  ₹{priceNum.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {hasDelivery && (
                                <div className="flex items-center gap-1">
                                  {inCart ? (
                                    <div className="flex items-center gap-0.5 sm:gap-1 bg-emerald-600 text-white rounded-lg px-1 py-0.5 shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={() => updateCartCount(prod.id, -1)}
                                        className="font-black text-[11px] sm:text-xs hover:opacity-80 px-0.5 cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="text-[9.5px] sm:text-[11px] font-black px-0.5 min-w-2.5 text-center">
                                        {inCart.count}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => updateCartCount(prod.id, 1)}
                                        className="font-black text-[11px] sm:text-xs hover:opacity-80 px-0.5 cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => addToCart(prod)}
                                      className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[9.5px] sm:text-[11px] font-bold px-2 py-1 rounded-lg transition-all shadow-2xs flex items-center gap-0.5 cursor-pointer shrink-0"
                                    >
                                      <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                      <span>Add</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-500">No products match your search.</p>
                    </div>
                  )}
                </div>
              );

              // RENDER SERVICES HELPER
              const renderServicesList = () => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <h3 className="font-black text-sm text-slate-900">
                        Services ({business.services.length})
                      </h3>
                    </div>

                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => setAddServiceModalOpen(true)}
                        className="bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Service</span>
                      </button>
                    )}
                  </div>

                  {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredServices.map((srv) => {
                        const priceNum = typeof srv.price === 'number' ? srv.price : parseFloat(srv.price as any) || 0;
                        return (
                          <div
                            key={srv.id}
                            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between text-left group"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-black text-sm text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                                  {srv.name}
                                </h4>
                                {isOwnerOrAdmin && (
                                  <button
                                    onClick={() => handleDeleteService(srv.id, srv.name)}
                                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                                    title="Delete service"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>

                              {srv.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                  {srv.description}
                                </p>
                              )}

                              {srv.duration && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                                  ⏱️ {srv.duration}
                                </span>
                              )}
                            </div>

                            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <div>
                                {priceNum > 0 ? (
                                  <>
                                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Starting at</span>
                                    <span className="text-base font-black text-slate-900 tracking-tight">
                                      ₹{priceNum.toLocaleString('en-IN')}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                    Price on Request
                                  </span>
                                )}
                              </div>

                              <a
                                href={isLoggedIn ? getWhatsAppUrl(business.whatsapp || business.phone, `🛠️ *SERVICE INQUIRY / BOOKING*
━━━━━━━━━━━━━━━━━━━━
🏬 *Provider:* ${business.name}
🔧 *Service:* ${srv.name}
${priceNum > 0 ? `💰 *Starting Price:* ₹${priceNum.toLocaleString('en-IN')}\n` : '💰 *Price:* On Request / Quotation\n'}${srv.duration ? `⏱️ *Duration:* ${srv.duration}\n` : ''}${srv.description ? `📝 *Details:* ${srv.description}\n` : ''}━━━━━━━━━━━━━━━━━━━━
Hi ${business.name}, I want to book/enquire about this service listed on Majh Boisar. Please share your availability & quotation.`) : '#'}
                                target={isLoggedIn ? "_blank" : undefined}
                                onClick={(e) => {
                                  if (!isLoggedIn) {
                                    e.preventDefault();
                                    setLoginModalOpen(true);
                                  } else {
                                    trackClick('whatsappClicks');
                                  }
                                }}
                                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Book / Enquire</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-500">No services match your search.</p>
                    </div>
                  )}
                </div>
              );

              return (
                <div className="space-y-6">
                  {/* Search Bar (Short, Compact & Sleek) */}
                  {(hasProducts || hasServices) && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-1">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          placeholder={hasProducts && hasServices ? "Search items..." : hasProducts ? "Search products..." : "Search services..."}
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          className="w-full pl-8.5 pr-7 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 shadow-2xs transition-all"
                        />
                        {catalogSearch && (
                          <button
                            type="button"
                            onClick={() => setCatalogSearch('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Filter pills ONLY if both products AND services exist */}
                      {hasProducts && hasServices && (
                        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setCatalogFilter('all')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              catalogFilter === 'all'
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            All ({business.products.length + business.services.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setCatalogFilter('products')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              catalogFilter === 'products'
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            Products ({business.products.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setCatalogFilter('services')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              catalogFilter === 'services'
                                ? 'bg-white text-slate-900 shadow-2xs'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            Services ({business.services.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Products */}
                  {hasProducts && (catalogFilter === 'all' || catalogFilter === 'products') && (
                    renderProductsList()
                  )}

                  {/* Render Services */}
                  {hasServices && (catalogFilter === 'all' || catalogFilter === 'services') && (
                    renderServicesList()
                  )}
                </div>
              );
            })()}

            {/* TAB: PHOTOS GALLERY */}
            {activeTab === 'gallery' && (
              <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-3xl shadow-sm text-left space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Photos Gallery ({allImages.length})</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Real photos of {business.name}, shop interior &amp; products</p>
                  </div>
                </div>

                {allImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {allImages.map((url, index) => (
                      <div
                        key={index}
                        onClick={() => setLightboxIndex(index)}
                        className="aspect-square rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs relative group bg-slate-100 flex items-center justify-center transition-all hover:shadow-md hover:border-teal-500"
                      >
                        <img
                          src={url}
                          alt={`${business.name} photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[11px] font-black text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                            🔍 Zoom
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <ImageIcon className="w-10 h-10 mx-auto opacity-50" />
                    <p className="text-xs font-bold">No additional photos uploaded yet.</p>
                  </div>
                )}
              </div>
            )}


            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 text-left">
                {/* Review Form */}
                <div id="review-form-anchor" className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-teal-650" />
                        <span>Rate &amp; Review this Store</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">Share your genuine experience to help other Boisar residents</p>
                    </div>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                          placeholder="e.g. Rahul Patil"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Rating Score</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(parseInt(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500 cursor-pointer"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Outstanding</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                          <option value="3">⭐⭐⭐ 3 Stars - Good</option>
                          <option value="2">⭐⭐ 2 Stars - Average</option>
                          <option value="1">⭐ 1 Star - Poor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your Review</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
                        placeholder="Write details of your experience, service quality, pricing, etc..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="bg-teal-700 hover:bg-teal-800 active:scale-98 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-sm cursor-pointer transition-all uppercase tracking-wider disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Posting Review...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-900">
                    Customer Reviews ({business.reviews?.length || 0})
                  </h3>

                  {business.reviews?.length > 0 ? (
                    <div className="space-y-4 divide-y divide-slate-100">
                      {business.reviews.map((rev) => (
                        <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 bg-teal-50 border border-teal-200 rounded-full flex items-center justify-center text-teal-700 font-black text-xs">
                                {rev.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-900 leading-tight">{rev.userName}</h4>
                                <span className="text-[10px] text-slate-400 font-bold">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed pl-10.5">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 space-y-1">
                      <p className="text-xs font-bold">No customer reviews yet.</p>
                      <p className="text-[11px]">Be the first one to leave a review for {business.name}!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: FAQS */}
            {activeTab === 'faqs' && (
              <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-3xl shadow-sm text-left space-y-4">
                <h3 className="text-sm font-black text-slate-900">Frequently Asked Questions</h3>
                {business.faqs?.length > 0 ? (
                  <div className="space-y-3 divide-y divide-slate-100">
                    {business.faqs.map((faq) => (
                      <div key={faq.id} className="pt-3 first:pt-0 space-y-1">
                        <h4 className="font-black text-xs text-slate-900 flex items-start gap-1.5">
                          <span className="text-teal-650">Q:</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-xs text-slate-600 font-medium pl-4.5 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400">
                    <p className="text-xs font-bold">No FAQs configured yet. Contact the store directly for questions.</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: CONTACT DIRECTORY & LOCATION SIDEBAR */}
          <div className="lg:col-span-4 space-y-5 text-left">

            {/* Contact & Store Details Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Store Details
                  </h3>
                </div>
                {business.subscription === 'Pro' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-600 fill-amber-400" />
                    <span>Gold Partner</span>
                  </span>
                ) : (business.verified || business.subscription === 'Starter') ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/70">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>Verified</span>
                  </span>
                ) : null}
              </div>

              {/* About description */}
              {business.description && (
                <div className="pb-3 border-b border-slate-100/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">About Store</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {business.description.replace(/\[Created by Admin\]\s*/gi, '').trim()}
                  </p>
                </div>
              )}

              {/* Phone */}
              <div className="pb-3 border-b border-slate-100/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                    <Phone className="w-3.5 h-3.5 text-teal-700" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                    {isLoggedIn ? (
                      <a href={`tel:${business.phone}`} className="font-bold text-slate-900 hover:text-teal-700 transition-colors truncate block">
                        {business.phone}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLoginModalOpen(true)}
                        className="font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer text-xs"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Login to View Number</span>
                      </button>
                    )}
                  </div>
                </div>
                {isLoggedIn && (
                  <a
                    href={`tel:${business.phone}`}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs cursor-pointer"
                  >
                    Call
                  </a>
                )}
              </div>

              {/* Postal Address */}
              <div className="pb-3 border-b border-slate-100/80 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Store Location</span>
                    <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{cleanAddress}</p>
                  </div>
                </div>

                {/* Map Directions & Copy Pill Buttons */}
                <div className="flex items-center gap-2 pl-10.5">
                  <button
                    type="button"
                    onClick={() => {
                      trackClick('directionClicks');
                      if (business.googleMaps) {
                        window.open(business.googleMaps, '_blank');
                      } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ', ' + business.location + ', Boisar')}`, '_blank');
                      }
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Navigation className="w-3 h-3 text-teal-700" />
                    <span>Get Directions</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(cleanAddress);
                      showToast('Address copied to clipboard! 📋', 'success');
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pb-3 border-b border-slate-100/80 last:border-b-0 last:pb-0 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Working Hours</span>
                    <span className="font-bold text-slate-800">{timing.text}</span>
                  </div>
                </div>
                <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-full border ${timing.isOpenNow ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {timing.isOpenNow ? '● Open Now' : 'Closed'}
                </span>
              </div>

              {/* Website */}
              {business.website && (
                <div className="pt-1 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700 shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Website</span>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackClick('websiteClicks')}
                        className="font-bold text-indigo-600 hover:underline truncate block"
                      >
                        {business.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              )}
            </div>

            {/* Quick Requirement Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">Quick Inquiry</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Looking for bulk pricing, special orders, or quotation from <strong className="text-white font-bold">{business.name}</strong>?
              </p>

              <button
                type="button"
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginModalOpen(true);
                    return;
                  }
                  setEnquiryModalOpen(true);
                }}
                className="w-full bg-teal-600 hover:bg-teal-500 active:scale-98 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Send Requirement</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* 4. LIGHTBOX IMAGE VIEWER MODAL */}
      {lightboxIndex !== null && allImages[lightboxIndex] && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 h-screen w-screen bg-slate-950/95 backdrop-blur-md z-[9999] cursor-zoom-out select-none flex items-center justify-center"
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer z-50"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev !== null ? (prev + 1) % allImages.length : 0);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer z-50"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[80vh] p-4 flex flex-col items-center justify-center cursor-default"
          >
            <img
              src={allImages[lightboxIndex]}
              alt="Store Gallery"
              className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
            />
            <div className="mt-3 bg-black/70 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* 5. ENQUIRY MODAL */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <span className="text-3xl">✉️</span>
              <h3 className="font-black text-slate-900 text-base mt-2">
                Send Requirement
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Contact {business.name} ({business.category})
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  required
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={leadSuccess}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 uppercase mt-2"
              >
                {leadSuccess ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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

      {/* 6. OWNER MODAL: ADD PRODUCT */}
      {addProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddProductModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Add Product to Store</h3>
                <p className="text-xs text-slate-500">List an item for retail or delivery in Boisar</p>
              </div>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5">
              <div>
                <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whey Protein 1kg, Paneer 500g, Men's T-Shirt"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  placeholder="e.g. 499"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Description / Specification
                </label>
                <textarea
                  rows={2}
                  placeholder="Flavour, size, warranty, or brand details..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Product Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                {newProductImage && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={newProductImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProduct}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {addingProduct ? 'Adding...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. OWNER MODAL: ADD SERVICE */}
      {addServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddServiceModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Add Service Offering</h3>
                <p className="text-xs text-slate-500">Provide pricing and booking details for your service</p>
              </div>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5">
              <div>
                <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC Servicing, Hair Spa, Personal Training"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                    Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="e.g. 500"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                    Duration (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 Mins, 1 Hour"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-black text-slate-600 uppercase tracking-wider block mb-1">
                  Service Details
                </label>
                <textarea
                  rows={2}
                  placeholder="What is included, warranty, materials used, etc..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingService}
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {addingService ? 'Adding...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. STICKY BOTTOM FLOATING CART BAR (Only when store has subscription delivery enabled) */}
      {hasDelivery && totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-3 py-2 sm:p-4 text-left animate-in slide-in-from-bottom duration-200 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs shrink-0">
                🛒 {totalCartCount}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                  Total: ₹{totalCartPrice.toLocaleString('en-IN')}
                </p>
                <p className="text-[9.5px] sm:text-xs text-emerald-700 font-bold flex items-center gap-1 leading-none mt-0.5 truncate">
                  <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Home Delivery</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span>View Order ({totalCartCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 9. WHATSAPP HOME DELIVERY CHECKOUT MODAL (Short & Compact) */}
      {hasDelivery && checkoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl relative max-h-[88vh] overflow-y-auto text-left">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-3 pr-6">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 text-sm leading-tight truncate">
                  Order from {business.name}
                </h3>
                <p className="text-[10px] text-emerald-700 font-bold leading-none mt-0.5">
                  Direct Home Delivery in Boisar
                </p>
              </div>
            </div>

            {/* Order Items Review (Compact) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 mb-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1 text-[10.5px]">
                <span>Order Items ({totalCartCount})</span>
                <span className="text-emerald-700 font-black">Bill: ₹{totalCartPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="max-h-24 overflow-y-auto divide-y divide-slate-200/60 text-[11px] pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-1 flex items-center justify-between">
                    <span className="truncate pr-2 text-slate-800 font-medium">
                      {item.name} <span className="text-slate-400">×{item.count}</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold text-slate-900">₹{(item.price * item.count).toLocaleString('en-IN')}</span>
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartCount(item.id, -1)}
                          className="w-4 h-4 rounded bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center font-bold text-[9px] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-[10px] font-black px-0.5">{item.count}</span>
                        <button
                          type="button"
                          onClick={() => updateCartCount(item.id, 1)}
                          className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details Form (Compact Grid) */}
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Patil"
                    value={orderCustName}
                    onChange={(e) => setOrderCustName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={orderCustPhone}
                    onChange={(e) => setOrderCustPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                  Boisar Delivery Address *
                </label>
                <input
                  type="text"
                  placeholder="Flat/House, Building, Area (e.g. Navapur Road)"
                  value={orderDeliveryAddress}
                  onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9.5px] font-medium text-slate-400 mb-0.5">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near Station"
                    value={orderDeliveryLandmark}
                    onChange={(e) => setOrderDeliveryLandmark(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-medium text-slate-400 mb-0.5">
                    Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Deliver by 6 PM"
                    value={orderDeliveryNotes}
                    onChange={(e) => setOrderDeliveryNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.48 2.016 14.005 1.002 11.995 1.002 6.559 1.002 2.135 5.372 2.131 10.801c-.001 1.76.46 3.479 1.336 5.003L2.5 21.53l5.837-1.526-.69.41z" />
                </svg>
                <span>Confirm on WhatsApp (₹{totalCartPrice.toLocaleString('en-IN')})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
