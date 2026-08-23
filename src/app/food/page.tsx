'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, MapPin, Phone, MessageSquare, Star, ArrowLeft,
  CheckCircle2, Sparkles, Filter, X, Utensils, Coffee,
  Share2, ChevronRight, QrCode, Plus, Minus, Flame, Clock,
  ShieldCheck, Heart, Award, Check, Send, ShoppingBag, Bell, Receipt,
  Edit3, Trash2, Camera
} from 'lucide-react';
import { BOISAR_FOOD_DIRECTORY, FoodItem } from '@/lib/foodDiningData';
import { useApp } from '@/context/AppContext';
import BusinessQRStandeeModal from '@/components/BusinessQRStandeeModal';

interface CartItem {
  name: string;
  priceNum: number;
  priceStr: string;
  isVeg: boolean;
  count: number;
  restoId: string;
  restoName: string;
  restoPhone: string;
}

function FoodPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, loggedInUser, setLoginModalOpen, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [selectedRestoForMenu, setSelectedRestoForMenu] = useState<FoodItem | null>(null);

  // Dine-In Table Recognition
  const [tableNumber, setTableNumber] = useState<string>('');
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tempTableInput, setTempTableInput] = useState('');

  // Food Ordering Cart & Mode State (Dine-In vs Home Delivery)
  const [orderType, setOrderType] = useState<'dinein' | 'delivery'>('dinein');
  const [cart, setCart] = useState<{ [dishKey: string]: CartItem }>({});
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // QR Standee Modal State
  const [isStandeeModalOpen, setIsStandeeModalOpen] = useState(false);
  const [standeeTargetResto, setStandeeTargetResto] = useState<FoodItem | null>(null);

  // Comprehensive List Your Restaurant Modal State
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newRestoName, setNewRestoName] = useState('');
  const [newRestoOwner, setNewRestoOwner] = useState('');
  const [newRestoCategory, setNewRestoCategory] = useState('Cafe');
  const [newRestoArea, setNewRestoArea] = useState('Boisar West');
  const [newRestoAddress, setNewRestoAddress] = useState('');
  const [newRestoPhone, setNewRestoPhone] = useState('');
  const [newRestoWhatsApp, setNewRestoWhatsApp] = useState('');
  const [newRestoFoodType, setNewRestoFoodType] = useState<'veg' | 'nonveg' | 'jain'>('veg');
  const [newRestoServiceMode, setNewRestoServiceMode] = useState<'both' | 'dinein_only' | 'delivery_only'>('both');
  const [newRestoPriceForTwo, setNewRestoPriceForTwo] = useState('₹350 for two');
  const [newRestoTimings, setNewRestoTimings] = useState('11:00 AM – 11:00 PM');
  const [newRestoSpeciality, setNewRestoSpeciality] = useState('');
  const [newRestoCoverImage, setNewRestoCoverImage] = useState('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80');
  const [newRestoDishList, setNewRestoDishList] = useState<{ name: string; price: string; isVeg: boolean; image?: string; desc?: string }[]>([
    { name: 'Special Sev Bhaji / Paneer Gravy', price: '₹180', isVeg: true, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80', desc: 'House speciality dish' },
    { name: 'Cold Coffee / Refreshing Beverage', price: '₹90', isVeg: true, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80', desc: 'Chilled special drink' }
  ]);
  const [isAddingListingDish, setIsAddingListingDish] = useState(false);
  const [listingDishName, setListingDishName] = useState('');
  const [listingDishPrice, setListingDishPrice] = useState('');
  const [listingDishIsVeg, setListingDishIsVeg] = useState(true);
  const [listingDishImage, setListingDishImage] = useState('');
  const [newRestoFeatures, setNewRestoFeatures] = useState<string[]>([
    'AC Dining', 'Takeaway', 'Card / UPI Accepted', 'Free Wi-Fi'
  ]);
  const [newRestoTableCount, setNewRestoTableCount] = useState('10 Tables');
  const [newRestoLaunchOffer, setNewRestoLaunchOffer] = useState('Flat 10% Off on Table Orders');

  // Custom Dish Quick Add State for Customers in Menu Modal
  const [isAddingCustomDish, setIsAddingCustomDish] = useState(false);
  const [customDishName, setCustomDishName] = useState('');
  const [customDishPrice, setCustomDishPrice] = useState('');
  const [customDishIsVeg, setCustomDishIsVeg] = useState(true);

  // User's Own Personal Active & Past Orders
  const [myFoodOrders, setMyFoodOrders] = useState<any[]>([]);
  const [isMyOrdersModalOpen, setIsMyOrdersModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('majh_boisar_my_food_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMyFoodOrders(parsed);
      }
    } catch (e) {}

    const handleNewOrder = (event?: any) => {
      if (event?.detail) {
        setMyFoodOrders(prev => [event.detail, ...prev.slice(0, 14)]);
      }
    };
    window.addEventListener('majh_boisar_new_food_order', handleNewOrder);
    return () => window.removeEventListener('majh_boisar_new_food_order', handleNewOrder);
  }, []);

  // Helper to get appetizing dish image thumbnail
  const getDishImage = (dish: { name: string; image?: string; isVeg?: boolean }) => {
    if (dish.image) return dish.image;
    const nameLower = dish.name.toLowerCase();
    if (nameLower.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('pasta')) return 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('coffee') || nameLower.includes('brew') || nameLower.includes('shake') || nameLower.includes('beverage')) return 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('sizzler')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('biryani') || nameLower.includes('rice') || nameLower.includes('jeera')) return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('chicken') || nameLower.includes('wings') || nameLower.includes('kebab') || nameLower.includes('handi') || nameLower.includes('kolhapuri')) return 'https://images.unsplash.com/photo-1527477378408-1bc0657e3f89?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('fish') || nameLower.includes('surmai') || nameLower.includes('prawn') || nameLower.includes('seafood') || nameLower.includes('pomfret')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('dosa') || nameLower.includes('idli') || nameLower.includes('south') || nameLower.includes('vada') || nameLower.includes('uttapam')) return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('thali') || nameLower.includes('bhaji') || nameLower.includes('dal') || nameLower.includes('paneer') || nameLower.includes('sev') || nameLower.includes('sabzi')) return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('cake') || nameLower.includes('pastry') || nameLower.includes('sweet') || nameLower.includes('dessert') || nameLower.includes('ice cream') || nameLower.includes('waffle')) return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80';
    if (nameLower.includes('chai') || nameLower.includes('tea')) return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80';
    if (dish.isVeg) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=80';
  };

  // Auto-sync orderType when a restaurant is selected based on its supported serviceModes
  useEffect(() => {
    if (selectedRestoForMenu) {
      const offered = selectedRestoForMenu.serviceModes || ['dinein', 'delivery'];
      const hasDineIn = offered.includes('dinein');
      const hasDelivery = offered.includes('delivery');
      if (hasDineIn && !hasDelivery) {
        setOrderType('dinein');
      } else if (!hasDineIn && hasDelivery) {
        setOrderType('delivery');
      }
    }
  }, [selectedRestoForMenu]);

  // Sync category & table from URL params
  useEffect(() => {
    if (!searchParams) return;
    
    // Sync table number
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const cleanTable = tableParam.replace(/^table\s*/i, '').trim();
      setTableNumber(cleanTable);
      setTempTableInput(cleanTable);
    }

    const catParam = searchParams.get('category') || searchParams.get('query') || '';
    if (catParam) {
      const lower = catParam.toLowerCase();
      if (lower.includes('cafe') || lower.includes('coffee')) setSelectedCategory('Cafe');
      else if (lower.includes('thali') || lower.includes('veg') || lower.includes('dosa') || lower.includes('lunch')) setSelectedCategory('Pure Veg & Thali');
      else if (lower.includes('fast') || lower.includes('burger') || lower.includes('pizza')) setSelectedCategory('Fast Food');
      else if (lower.includes('lounge') || lower.includes('party') || lower.includes('bar')) setSelectedCategory('Party & Lounge');
      else if (lower.includes('seafood') || lower.includes('fish') || lower.includes('agri')) setSelectedCategory('Seafood');
      else if (lower.includes('sweet') || lower.includes('bakery') || lower.includes('cake')) setSelectedCategory('Desserts & Bakery');
      else if (lower.includes('dhaba') || lower.includes('night') || lower.includes('late')) setSelectedCategory('Late Night & Dhaba');
    }

    const idParam = searchParams.get('id');
    if (idParam) {
      const target = BOISAR_FOOD_DIRECTORY.find(f => f.id === idParam);
      if (target) setSelectedRestoForMenu(target);
    }
  }, [searchParams]);

  // Extract numeric price from "₹280"
  const parsePrice = (priceStr: string) => {
    const num = parseInt(priceStr.replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  // Cart calculations
  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.count, 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + (item.priceNum * item.count), 0);
  }, [cart]);

  const addToCart = (resto: FoodItem, dish: { name: string; price: string; isVeg: boolean }) => {
    const key = `${resto.id}__${dish.name}`;
    setCart(prev => {
      const current = prev[key];
      const count = current ? current.count + 1 : 1;
      return {
        ...prev,
        [key]: {
          name: dish.name,
          priceNum: parsePrice(dish.price),
          priceStr: dish.price,
          isVeg: dish.isVeg,
          count,
          restoId: resto.id,
          restoName: resto.name,
          restoPhone: resto.whatsapp || resto.phone
        }
      };
    });
    showToast(`Added ${dish.name} to Table Order!`, 'success', 2000);
  };

  const removeFromCart = (restoId: string, dishName: string) => {
    const key = `${restoId}__${dishName}`;
    setCart(prev => {
      const current = prev[key];
      if (!current) return prev;
      if (current.count <= 1) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return {
        ...prev,
        [key]: { ...current, count: current.count - 1 }
      };
    });
  };

  // Filter food items
  const filteredItems = useMemo(() => {
    return BOISAR_FOOD_DIRECTORY.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      
      // Area filter
      if (selectedArea !== 'All' && item.area !== selectedArea) return false;

      // Veg only toggle
      if (vegOnlyFilter && !item.isPureVeg) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSpeciality = item.speciality.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesDishes = item.popularDishes.some(d => d.name.toLowerCase().includes(q));
        if (!matchesName && !matchesSpeciality && !matchesLocation && !matchesDishes) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedArea, vegOnlyFilter, searchQuery]);

  const handleWhatsAppTableOrder = () => {
    const cartItems = Object.values(cart);
    if (cartItems.length === 0) return;

    if (orderType === 'delivery') {
      if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
        alert('Please fill in your Name, Phone Number, and Delivery Address.');
        return;
      }
    }

    const firstItem = cartItems[0];
    const targetPhone = firstItem.restoPhone || '9307294733';
    const restoName = firstItem.restoName || 'Restaurant';

    let msg = '';
    if (orderType === 'delivery') {
      msg += `🛵 *NEW HOME DELIVERY FOOD ORDER*\n`;
      msg += `🍽️ *Restaurant:* ${restoName}\n`;
      msg += `⏰ *Time:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n`;
      msg += `👤 *Customer Name:* ${customerName.trim()}\n`;
      msg += `📞 *Customer Phone:* +91 ${customerPhone.trim()}\n`;
      msg += `📍 *Delivery Address:* ${deliveryAddress.trim()}\n\n`;
      msg += `📋 *ORDERED ITEMS TO DELIVER:*\n`;
      cartItems.forEach((it, idx) => {
        msg += `${idx + 1}. ${it.name} x ${it.count} = ₹${it.priceNum * it.count}\n`;
      });
      msg += `\n💰 *Total Amount:* ₹${totalCartPrice}\n`;
      if (orderNotes.trim()) {
        msg += `📝 *Delivery / Chef Note:* ${orderNotes.trim()}\n`;
      }
      msg += `\n⚡ *Order placed via Majh Boisar Food Delivery!*`;
    } else {
      msg += `🛎️ *NEW DINE-IN TABLE ORDER*\n`;
      msg += `🍽️ *Restaurant:* ${restoName}\n`;
      msg += `🪑 *Table Number:* ${tableNumber ? `Table #${tableNumber}` : 'Dine-In Table'}\n`;
      msg += `⏰ *Time:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n`;
      msg += `📋 *ORDERED ITEMS:*\n`;
      cartItems.forEach((it, idx) => {
        msg += `${idx + 1}. ${it.name} x ${it.count} = ₹${it.priceNum * it.count}\n`;
      });
      msg += `\n💰 *Total Amount:* ₹${totalCartPrice}\n`;
      if (customerName.trim()) {
        msg += `👤 *Customer Name:* ${customerName.trim()}\n`;
      }
      if (orderNotes.trim()) {
        msg += `📝 *Kitchen Instructions:* ${orderNotes.trim()}\n`;
      }
      msg += `\n⚡ *Order sent via Majh Boisar Table QR System!*`;
    }

    // Persist Order to Live Kitchen KDS & Dashboard in localStorage
    try {
      const orderTicket = {
        id: `ORD-${Date.now().toString().slice(-4)}`,
        restoId: firstItem.restoId,
        restoName: restoName,
        orderType: orderType, // 'dinein' | 'delivery'
        tableNumber: orderType === 'dinein' ? (tableNumber ? tableNumber : '1') : 'Home Delivery',
        customerName: customerName.trim() || (orderType === 'delivery' ? 'Home Delivery Customer' : 'Dine-In Guest'),
        customerPhone: customerPhone.trim() || undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: 'new',
        items: cartItems.map(it => ({
          name: it.name,
          count: it.count,
          price: it.priceNum,
          isVeg: it.isVeg,
          done: false
        })),
        totalAmount: totalCartPrice,
        notes: orderNotes.trim() || undefined
      };

      const storageKey = `majh_boisar_kitchen_orders_${firstItem.restoId}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([orderTicket, ...existing]));

      // Also broadcast to general kitchen orders
      const allOrders = JSON.parse(localStorage.getItem('majh_boisar_kitchen_orders_all') || '[]');
      localStorage.setItem('majh_boisar_kitchen_orders_all', JSON.stringify([orderTicket, ...allOrders.slice(0, 50)]));

      // Save to user's personal active orders
      const myOrders = JSON.parse(localStorage.getItem('majh_boisar_my_food_orders') || '[]');
      const updatedMy = [orderTicket, ...myOrders.slice(0, 14)];
      localStorage.setItem('majh_boisar_my_food_orders', JSON.stringify(updatedMy));
      setMyFoodOrders(updatedMy);

      window.dispatchEvent(new CustomEvent('majh_boisar_new_food_order', { detail: orderTicket }));
      window.dispatchEvent(new Event('storage'));
      showToast('🚀 Order placed! Restaurant Kitchen dashboard has received your live ticket.', 'success', 5000);
    } catch (e) {
      console.error('Error saving order to KDS:', e);
    }

    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }

    window.open(`https://wa.me/91${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    setIsOrderSummaryOpen(false);
  };

  const handleCallWaiter = (resto: FoodItem) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    const text = `🔔 *WAITER CALL ALERT*\n\nHi ${resto.name},\nWe are seated at *${tableNumber ? `Table #${tableNumber}` : 'Table'}* and require waiter assistance / water bottle. Please attend.\n\nThank you!`;
    window.open(`https://wa.me/91${resto.whatsapp || resto.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRequestBill = (resto: FoodItem) => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    const text = `🧾 *BILL REQUEST*\n\nHi ${resto.name},\nPlease bring the final bill & UPI payment QR for *${tableNumber ? `Table #${tableNumber}` : 'our Table'}*.\n\nThank you!`;
    window.open(`https://wa.me/91${resto.whatsapp || resto.phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newRestoPhone.replace(/\D/g, '');
    if (!newRestoName.trim()) {
      alert('Please enter your Restaurant / Outlet Name.');
      return;
    }
    if (cleanPhone.length < 10) {
      alert('⚠️ Mobile Number is mandatory! Please enter a valid 10-digit calling/WhatsApp phone number to list your business.');
      return;
    }

    // Use custom dishes configured by owner
    const parsedDishes: { name: string; price: string; isVeg: boolean; desc?: string }[] = 
      newRestoDishList.length > 0 
        ? newRestoDishList 
        : [
            { name: `${newRestoName.trim()} Special Dish`, price: '₹220', isVeg: newRestoFoodType === 'veg', desc: 'Chef recommended house special' },
            { name: 'Cold Beverage / Refreshment', price: '₹90', isVeg: true, desc: 'Chilled special drink' }
          ];
    
    // Create preview object for instant standee generation
    const tempResto: FoodItem = {
      id: `food-sub-${Date.now()}`,
      name: newRestoName.trim(),
      category: newRestoCategory as any,
      categoryLabel: newRestoCategory,
      location: newRestoAddress.trim() ? `${newRestoAddress.trim()}, ${newRestoArea}` : `${newRestoArea} · Boisar`,
      area: newRestoArea as any,
      rating: 5.0,
      reviewsCount: 1,
      priceForTwo: newRestoPriceForTwo || '₹350 for two',
      priceLevel: '₹₹',
      discount: newRestoLaunchOffer.trim() || 'Special Foodie Deal',
      speciality: newRestoSpeciality.trim() || 'Multi-Cuisine & Fast Food',
      image: newRestoCoverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      gallery: [],
      phone: newRestoPhone.trim(),
      whatsapp: newRestoWhatsApp.trim() || newRestoPhone.trim(),
      timings: newRestoTimings.trim() || '11:00 AM – 11:00 PM',
      isPureVeg: newRestoFoodType === 'veg',
      features: newRestoFeatures.length > 0 ? newRestoFeatures : ['AC Dining', 'Takeaway', 'Card / UPI Accepted'],
      serviceModes: newRestoServiceMode === 'both' ? ['dinein', 'delivery'] : newRestoServiceMode === 'dinein_only' ? ['dinein'] : ['delivery'],
      popularDishes: parsedDishes
    };

    setIsListModalOpen(false);
    setStandeeTargetResto(tempResto);
    setIsStandeeModalOpen(true);
    showToast(`🎉 Listing Submitted! Here is your Official Table-Top QR Standee Pack!`, 'success', 6000);

    // Reset form
    setNewRestoName('');
    setNewRestoOwner('');
    setNewRestoPhone('');
    setNewRestoWhatsApp('');
    setNewRestoAddress('');
    setNewRestoSpeciality('');
    setNewRestoDishList([
      { name: 'Special Sev Bhaji / Paneer Gravy', price: '₹180', isVeg: true, desc: 'House speciality dish' },
      { name: 'Cold Coffee / Refreshing Beverage', price: '₹90', isVeg: true, desc: 'Chilled special drink' }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-800 font-sans pb-32 text-left">
      
      {/* ── TOP LIVE DINE-IN TABLE ALERT BANNER (If scanned at table) ── */}
      {tableNumber && (
        <div className="bg-slate-950 text-white px-4 py-2.5 shadow-md sticky top-0 z-40 border-b border-amber-500/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-slate-300">Dine-In Active:</span>
              <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[11px]">
                🪑 Table #{tableNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isEditingTable ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Table #"
                    value={tempTableInput}
                    onChange={(e) => setTempTableInput(e.target.value)}
                    className="w-20 bg-slate-800 text-white font-black text-xs px-2 py-1 rounded border border-slate-600 outline-none"
                  />
                  <button
                    onClick={() => {
                      setTableNumber(tempTableInput.trim());
                      setIsEditingTable(false);
                    }}
                    className="bg-amber-400 text-slate-950 px-2 py-1 rounded font-black text-[10px]"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingTable(true)}
                  className="text-amber-300 hover:text-amber-200 text-[11px] font-bold flex items-center gap-1 underline cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Change Table
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CLEAN, INTUITIVE & MINIMAL FOOD HERO HEADER ── */}
      <div className="bg-[#fffdfa] border-b border-orange-100/90 pt-3 pb-3.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-2.5">
          
          {/* Top Bar: Back, Title, & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <Link 
                href="/"
                className="inline-flex items-center gap-1 text-xs font-black text-slate-700 hover:text-orange-600 bg-white px-2 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
                title="Back to Home"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </Link>

              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-base sm:text-lg shrink-0">🍕</span>
                <h1 className="text-xs sm:text-base font-black text-slate-900 leading-tight truncate">
                  Dining &amp; Food Delivery in Boisar
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* My Orders Button */}
              {myFoodOrders.length > 0 && (
                <button
                  onClick={() => setIsMyOrdersModalOpen(true)}
                  className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10.5px] sm:text-xs px-2 sm:px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Orders ({myFoodOrders.length})</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginModalOpen(true);
                    return;
                  }
                  setIsListModalOpen(true);
                }}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-95 text-white font-black text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-amber-200" />
                <span>List Joint <span className="hidden sm:inline">(Free)</span></span>
              </button>
            </div>
          </div>

          {/* Unified Compact Search Bar with Integrated Veg Toggle */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-400/20 shadow-2xs p-1 sm:p-1.5 pl-2.5 sm:pl-3 flex items-center gap-1.5 sm:gap-2 transition-all">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, pizza, thali, biryani, cafe..."
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none min-w-0"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-700 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Compact Integrated Veg Toggle Pill */}
            <button
              type="button"
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 border transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${
                vegOnlyFilter
                  ? 'bg-emerald-600 border-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-xs border flex items-center justify-center shrink-0 ${vegOnlyFilter ? 'border-white bg-white' : 'border-emerald-600 bg-white'}`}>
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-600" />
              </span>
              <span>Pure Veg</span>
            </button>
          </div>

          {/* Combined Clean Filter Row: Area & Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide scroll-smooth">
            {/* Area Dropdown / Filter Pill */}
            <div className="relative shrink-0">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="appearance-none bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200/90 font-black text-[11px] sm:text-xs pl-5 sm:pl-6 pr-5 sm:pr-6 py-1.5 rounded-lg sm:rounded-xl cursor-pointer outline-none shadow-2xs transition-all"
              >
                <option value="All">📍 All Areas</option>
                <option value="Boisar West">📍 Boisar West</option>
                <option value="Ostwal Empire">📍 Ostwal Empire</option>
                <option value="Station Road">📍 Station Road</option>
                <option value="Tarapur MIDC">📍 Tarapur MIDC</option>
                <option value="Navapur Road">📍 Navapur Road</option>
                <option value="Kelwa Road">📍 Kelwa Road</option>
              </select>
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600 absolute left-1.5 sm:left-2 top-2 pointer-events-none" />
              <ChevronRight className="w-3 h-3 text-orange-600 rotate-90 absolute right-1.5 sm:right-2 top-2.5 pointer-events-none" />
            </div>

            <div className="h-4 w-px bg-slate-200 shrink-0 mx-0.5" />

            {/* Category Pills */}
            {[
              { id: 'All', label: 'All', icon: '🌟' },
              { id: 'Cafe', label: 'Cafes', icon: '☕' },
              { id: 'Family Dining', label: 'Dining', icon: '🍽️' },
              { id: 'Fast Food', label: 'Fast Food', icon: '🍔' },
              { id: 'Pure Veg & Thali', label: 'Pure Veg', icon: '🍲' },
              { id: 'Party & Lounge', label: 'Lounges', icon: '🎉' },
              { id: 'Seafood', label: 'Seafood', icon: '🦀' },
              { id: 'Desserts & Bakery', label: 'Bakery', icon: '🍰' },
              { id: 'Late Night & Dhaba', label: 'Dhabas', icon: '🌙' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 flex items-center gap-1 transition-all cursor-pointer font-bold text-[11px] sm:text-xs border shadow-2xs group active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 font-black'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}

            <span className="text-[10.5px] sm:text-[11px] font-black text-slate-400 shrink-0 ml-auto pl-1 sm:pl-2">
              {filteredItems.length} spots
            </span>
          </div>

        </div>
      </div>

      {/* ── MAIN FOOD OUTLETS GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((resto) => (
              <div
                key={resto.id}
                className="bg-white rounded-3xl border border-orange-200/80 hover:border-orange-400 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Offer Badge & Veg Pill */}
                  <div 
                    onClick={() => setSelectedRestoForMenu(resto)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 cursor-pointer"
                  >
                    <img 
                      src={resto.image} 
                      alt={resto.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Offer Ribbon */}
                    {resto.discount && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 uppercase tracking-wider">
                          <span>%</span>
                          <span>{resto.discount}</span>
                        </span>
                      </div>
                    )}

                    {/* Veg / Non-Veg Indicator Top Right */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-md flex items-center gap-1 ${
                        resto.isPureVeg 
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500' 
                          : 'bg-red-950/80 text-rose-300 border-rose-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${resto.isPureVeg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{resto.isPureVeg ? 'Pure Veg' : 'Veg & Non-Veg'}</span>
                      </span>
                    </div>

                    {/* Category Label Pill */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/20">
                        {resto.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    
                    {/* Name & Rating */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <h3 
                          onClick={() => setSelectedRestoForMenu(resto)}
                          className="text-base font-black text-slate-950 group-hover:text-orange-700 leading-tight cursor-pointer truncate"
                        >
                          {resto.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                          <span>{resto.location}</span>
                        </p>
                      </div>

                      <div className="bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded-xl shrink-0 flex items-center gap-1 shadow-2xs">
                        <span>★</span>
                        <span>{resto.rating}</span>
                        <span className="text-[9.5px] text-emerald-200">({resto.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Speciality Highlight */}
                    <div className="bg-orange-50/80 border border-orange-200/70 rounded-2xl p-2.5">
                      <span className="text-[10px] text-orange-900/60 font-black uppercase tracking-wider block">
                        Must Try Speciality:
                      </span>
                      <p className="text-xs font-black text-orange-950 truncate mt-0.5">
                        🍽️ {resto.speciality}
                      </p>
                    {/* Service Modes Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {(!resto.serviceModes || resto.serviceModes.includes('dinein')) && (
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[9.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>🪑</span> Dine-In
                        </span>
                      )}
                      {(!resto.serviceModes || resto.serviceModes.includes('delivery')) && (
                        <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[9.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>🛵</span> Home Delivery
                        </span>
                      )}
                    </div>
                    </div>

                    {/* Price & Timings Row */}
                    <div className="flex items-center justify-between text-xs text-slate-600 font-bold pt-1 border-t border-slate-100">
                      <span className="text-slate-900 font-black">
                        💰 {resto.priceForTwo}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>{resto.timings.split('–')[0]}</span>
                      </span>
                    </div>

                  </div>
                </div>

                {/* Bottom Action Buttons (Clean 50-50 Split for Customers) */}
                <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2">
                  
                  {/* View Menu Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedRestoForMenu(resto)}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-300 font-black text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <Utensils className="w-3.5 h-3.5 text-orange-600" />
                    <span>View Menu &amp; Order</span>
                  </button>

                  {/* 1-Tap WhatsApp Table/Order Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setLoginModalOpen(true);
                        return;
                      }
                      const text = `Hello ${resto.name}!\nI am looking at your menu on Majh Boisar (माझं बोईसर).\n\n🍽️ Place: ${resto.name}\n📍 Location: ${resto.location}\n\nPlease share table availability & today's specials.`;
                      window.open(`https://wa.me/91${resto.whatsapp || resto.phone}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </button>

                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              🍽️
            </div>
            <h3 className="text-lg font-black text-slate-900">No Food Outlets Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any food joints matching your current search &amp; filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedArea('All');
                setVegOnlyFilter(false);
                setSearchQuery('');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

      </div>

      {/* ── FLOATING STICKY DINE-IN CART BAR (Appears when items are added) ── */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-950 text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-amber-400/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  {tableNumber ? `Table #${tableNumber} Order` : 'Dine-In Order'}
                </span>
                <span className="text-sm font-black text-white">
                  {totalCartCount} {totalCartCount === 1 ? 'Item' : 'Items'} • ₹{totalCartPrice}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOrderSummaryOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>View Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── DETAILED DISH MENU & DINE-IN / DELIVERY ORDERING MODAL ── */}
      {selectedRestoForMenu && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2.5 sm:p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[88vh] sm:max-h-[85vh] flex flex-col">
            
            {/* Header with Photo Banner */}
            <div className="relative h-36 sm:h-44 w-full bg-slate-900 shrink-0">
              <img 
                src={selectedRestoForMenu.image} 
                alt={selectedRestoForMenu.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setSelectedRestoForMenu(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Dynamic Service Mode Switcher / Badge */}
              {(() => {
                const modes = selectedRestoForMenu.serviceModes || ['dinein', 'delivery'];
                const hasDineIn = modes.includes('dinein');
                const hasDelivery = modes.includes('delivery');

                if (hasDineIn && hasDelivery) {
                  return (
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md p-1 rounded-2xl flex items-center gap-1 border border-white/20 shadow-xl z-10">
                      <button
                        type="button"
                        onClick={() => setOrderType('dinein')}
                        className={`text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                          orderType === 'dinein'
                            ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>🪑</span>
                        <span>{tableNumber ? `Table #${tableNumber}` : 'Dine-In'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                          orderType === 'delivery'
                            ? 'bg-emerald-500 text-white shadow-md scale-102 font-black'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>🛵</span>
                        <span>Home Delivery</span>
                      </button>
                    </div>
                  );
                }

                if (hasDineIn && !hasDelivery) {
                  return (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-amber-500/40 flex items-center gap-1.5 uppercase tracking-wider">
                        <span>🪑</span>
                        <span>{tableNumber ? `Dine-In Table #${tableNumber}` : 'Dine-In Seating Only'}</span>
                      </span>
                    </div>
                  );
                }

                return (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-emerald-500 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-emerald-600/40 flex items-center gap-1.5 uppercase tracking-wider">
                      <span>🛵</span>
                      <span>Home Delivery Only</span>
                    </span>
                  </div>
                );
              })()}

              <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white space-y-0.5">
                <span className="bg-orange-600 text-white text-[8.5px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                  {selectedRestoForMenu.categoryLabel}
                </span>
                <h2 className="text-lg sm:text-2xl font-black leading-tight truncate">
                  {selectedRestoForMenu.name}
                </h2>
                <p className="text-[11px] sm:text-xs text-white/80 font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-400" />
                  <span>{selectedRestoForMenu.location}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-black">★ {selectedRestoForMenu.rating}</span>
                </p>
              </div>
            </div>

            {/* Quick Service Helper Pills (Call Waiter / Bill for Dine-in OR Delivery Banner) */}
            {orderType === 'dinein' ? (
              <div className="bg-amber-50/90 border-b border-amber-200 px-3.5 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0 animate-in fade-in duration-150">
                <span className="text-[10px] sm:text-[10.5px] font-black text-amber-950 shrink-0">
                  🛎️ Table Service:
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCallWaiter(selectedRestoForMenu)}
                    className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-[10.5px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Bell className="w-3 h-3 text-amber-600" />
                    <span>Call Waiter / Water</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRequestBill(selectedRestoForMenu)}
                    className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-[10.5px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Receipt className="w-3 h-3 text-amber-600" />
                    <span>Request Bill / UPI</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50/90 border-b border-emerald-200 px-3.5 py-1.5 flex items-center justify-between gap-2 text-xs font-bold text-emerald-950 shrink-0 animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🛵</span>
                  <span className="text-[10.5px] sm:text-[11px] font-black">Home Delivery Mode Active</span>
                </div>
                <span className="text-[9.5px] sm:text-[10.5px] text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 font-extrabold">
                  ⚡ Fast Delivery in Boisar
                </span>
              </div>
            )}

            {/* Modal Body: Popular Dishes Menu & Details (Fully Scrollable) */}
            <div className="p-3.5 sm:p-5 overflow-y-auto space-y-3.5 flex-1 min-h-0">
              
              {/* Popular Dishes List with Add To Table Order Buttons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🍽️</span> {orderType === 'dinein' ? 'Digital Menu & Table Ordering' : 'Delivery Menu & Ordering'}
                  </h4>
                  <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-bold">1-Tap Add to WhatsApp Order</span>
                </div>

                <div className="space-y-3">
                  {selectedRestoForMenu.popularDishes.map((dish, idx) => {
                    const cartKey = `${selectedRestoForMenu.id}__${dish.name}`;
                    const inCart = cart[cartKey];
                    const dishImg = getDishImage(dish);

                    return (
                      <div 
                        key={idx}
                        className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-orange-300 transition-all flex items-start justify-between gap-3 shadow-2xs group"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 ${dish.isVeg ? 'border-emerald-600 bg-white' : 'border-rose-600 bg-white'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            </span>
                            <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                              {dish.name}
                            </h5>
                          </div>
                          {dish.desc && (
                            <p className="text-[10.5px] sm:text-[11.5px] text-slate-500 font-medium leading-tight line-clamp-2">
                              {dish.desc}
                            </p>
                          )}
                          <span className="text-xs sm:text-sm font-black text-slate-950 block pt-0.5">
                            {dish.price}
                          </span>
                        </div>

                        {/* Dish Food Thumbnail & Add/Counter Action */}
                        <div className="relative shrink-0 flex flex-col items-center pb-2">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100 relative">
                            <img
                              src={dishImg}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>

                          {/* Add / Counter Button */}
                          <div className="absolute -bottom-1 z-10">
                            {inCart ? (
                              <div className="flex items-center bg-slate-950 text-white rounded-xl p-0.5 shadow-md border border-white/20">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(selectedRestoForMenu.id, dish.name)}
                                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-black cursor-pointer transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 sm:w-7 text-center font-black text-xs text-amber-300">
                                  {inCart.count}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addToCart(selectedRestoForMenu, dish)}
                                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-black cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addToCart(selectedRestoForMenu, dish)}
                                className="bg-white hover:bg-orange-50 text-orange-700 font-black text-xs px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-orange-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-md hover:shadow-lg"
                              >
                                <Plus className="w-3 h-3 text-orange-600 stroke-[3]" />
                                <span>ADD</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ➕ ADD CUSTOM DISH / OFF-MENU ITEM */}
                <div className="pt-2">
                  {!isAddingCustomDish ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomDish(true)}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 hover:border-orange-400 p-3 rounded-2xl text-xs font-black text-slate-700 hover:text-orange-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-orange-600" />
                      <span>+ Add Custom Dish or Special Request to Order</span>
                    </button>
                  ) : (
                    <div className="bg-orange-50/90 border border-orange-200 p-3.5 rounded-2xl space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-orange-950 flex items-center gap-1.5">
                          <span>✨</span> Add Custom Item / Special Dish
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCustomDish(false);
                            setCustomDishName('');
                            setCustomDishPrice('');
                          }}
                          className="text-[10px] text-slate-500 hover:text-slate-800 font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Dish name (e.g. Extra Butter Pav, Sweet Lassi)"
                          value={customDishName}
                          onChange={(e) => setCustomDishName(e.target.value)}
                          className="sm:col-span-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                        />
                        <input
                          type="number"
                          placeholder="Price ₹ (e.g. 50)"
                          value={customDishPrice}
                          onChange={(e) => setCustomDishPrice(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCustomDishIsVeg(true)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border cursor-pointer ${
                              customDishIsVeg ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            🟢 Pure Veg
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomDishIsVeg(false)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black border cursor-pointer ${
                              !customDishIsVeg ? 'bg-rose-100 text-rose-900 border-rose-400' : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            🔴 Non-Veg
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!customDishName.trim()) {
                              alert('Please enter dish name.');
                              return;
                            }
                            const priceNum = parseInt(customDishPrice, 10) || 100;
                            const customDish = {
                              name: customDishName.trim(),
                              price: `₹${priceNum}`,
                              isVeg: customDishIsVeg,
                              desc: 'Custom item added by diner'
                            };
                            addToCart(selectedRestoForMenu, customDish);
                            setCustomDishName('');
                            setCustomDishPrice('');
                            setIsAddingCustomDish(false);
                            showToast(`Added "${customDish.name}" to your order!`, 'success');
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black px-4 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          Add to Order 🛒
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Bottom Action Bar (Fixed, Always Visible & Never Cut Off) */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0 shadow-lg z-20">
              {totalCartCount > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsOrderSummaryOpen(true)}
                  className={`w-full text-white font-black text-xs sm:text-sm py-3 rounded-2xl text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                    orderType === 'delivery'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>
                    {orderType === 'delivery' ? '🛵 Proceed to Home Delivery' : '🪑 View Table Order'} ({totalCartCount} items • ₹{totalCartPrice})
                  </span>
                </button>
              ) : (
                <>
                  <a
                    href={isLoggedIn ? `tel:${selectedRestoForMenu.phone}` : '#'}
                    onClick={(e) => {
                      if (!isLoggedIn) {
                        e.preventDefault();
                        setLoginModalOpen(true);
                      }
                    }}
                    className="flex-1 bg-slate-900 hover:bg-black text-white font-black text-xs py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setLoginModalOpen(true);
                        return;
                      }
                      const text = `Hello ${selectedRestoForMenu.name}!\nI am viewing your digital menu on Majh Boisar (माझं बोईसर).\n\n🍽️ Place: ${selectedRestoForMenu.name}\n📍 Location: ${selectedRestoForMenu.location}\n\nPlease share menu & current offers.`;
                      window.open(`https://wa.me/91${selectedRestoForMenu.whatsapp || selectedRestoForMenu.phone}?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-center transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp Inquiry</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── ORDER SUMMARY & WHATSAPP DISPATCH MODAL (DINE-IN VS HOME DELIVERY) ── */}
      {isOrderSummaryOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{orderType === 'delivery' ? '🛵' : '🛎️'}</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    {orderType === 'delivery' ? 'Home Delivery Order' : 'Dine-In Table Order'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-bold">
                    {orderType === 'delivery' ? 'Doorstep Delivery in Boisar' : tableNumber ? `Seated at Table #${tableNumber}` : 'Direct Kitchen Order'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOrderSummaryOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Mode Selector Inside Checkout (Shown only if restaurant offers both) */}
            {(() => {
              const cartList = Object.values(cart);
              const targetResto = selectedRestoForMenu || (cartList.length > 0 ? BOISAR_FOOD_DIRECTORY.find(f => f.id === cartList[0].restoId) : null);
              const modes = targetResto?.serviceModes || ['dinein', 'delivery'];
              if (modes.includes('dinein') && modes.includes('delivery')) {
                return (
                  <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setOrderType('dinein')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'dinein'
                          ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🪑</span>
                      <span>Dine-In (Table)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-emerald-600 text-white shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🛵</span>
                      <span>Home Delivery</span>
                    </button>
                  </div>
                );
              }
              return null;
            })()}

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              
              {/* DINE-IN: Table Number Field */}
              {orderType === 'dinein' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-1 animate-in fade-in duration-150">
                  <label className="text-[10px] font-black text-amber-950 uppercase tracking-wider block">
                    🪑 Your Table Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Table # (e.g. 3, 5, Garden 2)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* HOME DELIVERY: Customer Name, Phone & Complete Address Fields */}
              {orderType === 'delivery' && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2.5 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9.5px] font-black text-emerald-950 uppercase tracking-wider block mb-1">
                        👤 Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="text-[9.5px] font-black text-emerald-950 uppercase tracking-wider block mb-1">
                        📞 Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-black text-emerald-950 uppercase tracking-wider block mb-1">
                      📍 Complete Delivery Address &amp; Landmark *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Flat 302, B-Wing, Ostwal Empire, Near Reliance Trends, Boisar West"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Ordered Dishes ({totalCartCount})
                </span>
                <div className="space-y-2">
                  {Object.values(cart).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'} shrink-0`} />
                        <span className="font-bold text-slate-900 truncate">{item.name}</span>
                        <span className="text-[10.5px] text-slate-500 font-bold">x {item.count}</span>
                      </div>
                      <span className="font-black text-slate-900 shrink-0">
                        ₹{item.priceNum * item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  📝 {orderType === 'delivery' ? 'Cooking / Delivery Instructions' : 'Cooking Note / Instructions (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={orderType === 'delivery' ? "e.g. Less spicy, Call when you arrive, extra ketchup" : "e.g. Less spicy, Extra cheese, Serve drinks first"}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                />
              </div>

              {/* Customer Name for Dine In */}
              {orderType === 'dinein' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    👤 Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Total Calculation */}
              <div className="bg-slate-900 text-white p-3 rounded-2xl flex items-center justify-between text-xs font-black">
                <span>Total Bill Amount:</span>
                <span className="text-base text-amber-300">₹{totalCartPrice}</span>
              </div>

            </div>

            {/* Bottom Dispatch Action */}
            <div className="pt-2 border-t border-slate-100 space-y-2 shrink-0">
              <button
                type="button"
                onClick={handleWhatsAppTableOrder}
                className={`w-full text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  orderType === 'delivery' ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-[#25D366] hover:bg-[#20bd5a]'
                }`}
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>
                  {orderType === 'delivery' 
                    ? 'Place Home Delivery Order on WhatsApp 🛵' 
                    : 'Send Order to Kitchen on WhatsApp 🚀'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCart({})}
                className="w-full text-center text-[10.5px] font-bold text-slate-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
              >
                Clear Entire Order
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── LIST YOUR RESTAURANT / CAFE MODAL (FULL COMPREHENSIVE FORM) ── */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 text-left overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl shrink-0">
                  🍽️
                </div>
                <div>
                  <h3 className="text-base font-black leading-tight text-white">
                    List Your Food Joint (Free)
                  </h3>
                  <p className="text-[11px] text-amber-100 font-medium">
                    Get listed on Majh Boisar &amp; receive your Official Table-Top QR Standee pack
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsListModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleListSubmit} className="flex-1 min-h-0 flex flex-col">
              
              {/* Scrollable Form Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left flex-1 min-h-0">
                
                {/* SECTION 1: RESTAURANT & CONTACT DETAILS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-orange-100 pb-1.5">
                    <span className="text-base">📍</span>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      1. Outlet &amp; Contact Details
                    </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Outlet / Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRestoName}
                      onChange={(e) => setNewRestoName(e.target.value)}
                      placeholder="e.g. Madhur Veg Treat / Citrus Cafe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Owner / Manager Name
                    </label>
                    <input
                      type="text"
                      value={newRestoOwner}
                      onChange={(e) => setNewRestoOwner(e.target.value)}
                      placeholder="e.g. Rajesh Patil"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Calling Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newRestoPhone}
                      onChange={(e) => setNewRestoPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      WhatsApp Number (For Table Orders) *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newRestoWhatsApp}
                      onChange={(e) => setNewRestoWhatsApp(e.target.value.replace(/\D/g, ''))}
                      placeholder="WhatsApp order number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Food Category *
                    </label>
                    <select
                      value={newRestoCategory}
                      onChange={(e) => setNewRestoCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 cursor-pointer"
                    >
                      <option>Cafe</option>
                      <option>Family Dining</option>
                      <option>Fast Food</option>
                      <option>Pure Veg & Thali</option>
                      <option>Party & Lounge</option>
                      <option>Seafood</option>
                      <option>Desserts & Bakery</option>
                      <option>Late Night & Dhaba</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Area / Locality in Boisar *
                    </label>
                    <select
                      value={newRestoArea}
                      onChange={(e) => setNewRestoArea(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500 cursor-pointer"
                    >
                      <option>Boisar West</option>
                      <option>Ostwal Empire</option>
                      <option>Station Road</option>
                      <option>Tarapur MIDC</option>
                      <option>Navapur Road</option>
                      <option>Pasthal</option>
                      <option>Kelwa Road</option>
                      <option>Betegaon</option>
                      <option>Katkar</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                    Full Shop Address &amp; Nearby Landmark
                  </label>
                  <input
                    type="text"
                    value={newRestoAddress}
                    onChange={(e) => setNewRestoAddress(e.target.value)}
                    placeholder="e.g. Shop 4, Ostwal Empire Main Avenue, Opp Axis Bank ATM, Boisar West"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                {/* Outlet Cover / Banner Photo Upload */}
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10.5px] font-black text-slate-700 uppercase tracking-wider">
                      📸 Outlet Cover Photo / Banner
                    </label>
                    <span className="text-[9.5px] text-orange-600 font-bold">Upload photo or choose a preset</span>
                  </div>

                  {/* Banner Preview */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-28 sm:h-32 group shadow-2xs">
                    <img 
                      src={newRestoCoverImage} 
                      alt="Outlet Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent flex items-end justify-between p-2.5">
                      <span className="text-[10px] font-black text-white bg-slate-900/80 px-2 py-0.5 rounded-lg border border-white/20 truncate max-w-[180px]">
                        {newRestoName.trim() || 'Your Food Joint'}
                      </span>
                      <label className="bg-white/95 hover:bg-white text-slate-900 text-[10.5px] font-black px-2.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95">
                        <Camera className="w-3.5 h-3.5 text-orange-600" />
                        <span>Upload Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setNewRestoCoverImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Quick Cover Photo Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                    <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Presets:</span>
                    {[
                      { label: '☕ Cafe & Hangout', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80' },
                      { label: '🍽️ Fine Dining', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80' },
                      { label: '🍕 Pizzeria / Fast Food', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
                      { label: '🍲 Pure Veg / Dhaba', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80' },
                      { label: '🦀 Agri-Koli Seafood', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80' },
                      { label: '🍰 Bakery & Cakes', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setNewRestoCoverImage(preset.url)}
                        className={`text-[9.5px] font-extrabold px-2.5 py-1 rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          newRestoCoverImage === preset.url
                            ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: DINING TYPE, MENU & TIMINGS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-orange-100 pb-1.5">
                  <span className="text-base">🍲</span>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    2. Food Type, Services &amp; Timings
                  </h4>
                </div>

                {/* Service Modes Selection (Dine-In, Delivery, Both) */}
                <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-slate-900">
                      🍽️ Service Modes You Offer (Aap kya services dete hain?) *
                    </label>
                    <span className="text-[10px] text-orange-700 font-extrabold">Choose 1</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRestoServiceMode('both')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        newRestoServiceMode === 'both'
                          ? 'bg-orange-500 text-white border-orange-600 shadow-sm font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="text-base">⚡</span>
                      <span className="text-[11px] leading-tight font-black">Dine-In + Delivery</span>
                      <span className={`text-[9px] uppercase font-black ${newRestoServiceMode === 'both' ? 'text-amber-200' : 'text-orange-600'}`}>Both (Donon)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewRestoServiceMode('dinein_only')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        newRestoServiceMode === 'dinein_only'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="text-base">🪑</span>
                      <span className="text-[11px] leading-tight font-black">Dine-In Only</span>
                      <span className="text-[9px] text-slate-500 font-bold">Sirf Table Seating</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewRestoServiceMode('delivery_only')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        newRestoServiceMode === 'delivery_only'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <span className="text-base">🛵</span>
                      <span className="text-[11px] leading-tight font-black">Delivery Only</span>
                      <span className={`text-[9px] font-bold ${newRestoServiceMode === 'delivery_only' ? 'text-emerald-100' : 'text-slate-500'}`}>Cloud Kitchen</span>
                    </button>
                  </div>
                </div>

                {/* Veg / Non Veg / Jain Switcher */}
                <div>
                  <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                    Dietary Preference *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'veg', label: '100% Pure Veg', icon: '🟢' },
                      { id: 'nonveg', label: 'Veg & Non-Veg', icon: '🔴' },
                      { id: 'jain', label: 'Jain Food Available', icon: '🟡' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewRestoFoodType(type.id as any)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 text-xs font-black ${
                          newRestoFoodType === type.id
                            ? 'bg-orange-100 text-orange-950 border-orange-400 ring-2 ring-orange-400/20'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span className="text-[10px] leading-tight">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider">
                        Avg Price For Two
                      </label>
                      <span className="text-[9.5px] text-orange-600 font-bold">Type any amount or choose</span>
                    </div>
                    <input
                      type="text"
                      value={newRestoPriceForTwo}
                      onChange={(e) => setNewRestoPriceForTwo(e.target.value)}
                      placeholder="e.g. ₹350 for two"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                    <div className="flex items-center gap-1 mt-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                      {['₹150 for two', '₹250 for two', '₹350 for two', '₹500 for two', '₹800 for two', '₹1200+ for two'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setNewRestoPriceForTwo(chip)}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            newRestoPriceForTwo === chip
                              ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          {chip.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Daily Timings
                    </label>
                    <input
                      type="text"
                      value={newRestoTimings}
                      onChange={(e) => setNewRestoTimings(e.target.value)}
                      placeholder="e.g. 11:00 AM – 11:00 PM"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                    Signature Speciality *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRestoSpeciality}
                    onChange={(e) => setNewRestoSpeciality(e.target.value)}
                    placeholder="e.g. Peri-Peri Sizzler, Cold Brew, Surmai Thali, Cheese Burst Pizza"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                {/* Dynamic Digital Menu Dishes Builder */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10.5px] font-black text-slate-700 uppercase tracking-wider">
                      🍽️ Dishes for Your Digital Menu ({newRestoDishList.length} Added) *
                    </label>
                    <span className="text-[9.5px] text-orange-600 font-bold">Appears on your Table Standee QR</span>
                  </div>

                  {/* List of Added Dishes */}
                  <div className="space-y-1.5">
                    {newRestoDishList.map((dish, dIdx) => {
                      const thumb = dish.image || getDishImage(dish);
                      return (
                        <div
                          key={dIdx}
                          className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2.5 shadow-2xs text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Dish Thumbnail */}
                            <img
                              src={thumb}
                              alt={dish.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100 shadow-2xs"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 ${dish.isVeg ? 'border-emerald-600 bg-emerald-50 text-emerald-600' : 'border-rose-600 bg-rose-50 text-rose-600'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                                </span>
                                <span className="font-black text-slate-900 truncate">{dish.name}</span>
                              </div>
                              <span className="text-[10px] font-bold text-orange-600 block">{dish.price}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setNewRestoDishList(newRestoDishList.filter((_, i) => i !== dIdx));
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Dish Toggle & Inline Form */}
                  {!isAddingListingDish ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingListingDish(true)}
                      className="w-full bg-orange-50 hover:bg-orange-100/80 border border-dashed border-orange-300 p-2.5 rounded-xl text-xs font-black text-orange-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-orange-600" />
                      <span>+ Add Dish Item to Menu</span>
                    </button>
                  ) : (
                    <div className="bg-orange-50/90 border border-orange-200 p-3 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-orange-950 flex items-center gap-1">
                          <span>✨</span> Enter Dish Details &amp; Photo
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingListingDish(false);
                            setListingDishName('');
                            setListingDishPrice('');
                            setListingDishImage('');
                          }}
                          className="text-[10px] text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Dish name (e.g. Sev Bhaji, Paneer Tikka)"
                          value={listingDishName}
                          onChange={(e) => setListingDishName(e.target.value)}
                          className="sm:col-span-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                        />
                        <input
                          type="number"
                          placeholder="Price ₹ (e.g. 180)"
                          value={listingDishPrice}
                          onChange={(e) => setListingDishPrice(e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Dish Photo Upload & Presets */}
                      <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">
                            📷 Dish Photo (Upload or Select Preset)
                          </label>
                          {listingDishImage && (
                            <button
                              type="button"
                              onClick={() => setListingDishImage('')}
                              className="text-[9.5px] font-bold text-red-500 hover:underline cursor-pointer"
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {listingDishImage ? (
                            <img
                              src={listingDishImage}
                              alt="Dish preview"
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-xl shrink-0">
                              🍽️
                            </div>
                          )}

                          <label className="flex-1 bg-slate-50 hover:bg-slate-100 border border-dashed border-orange-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-all">
                            <Camera className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span className="text-[10.5px] truncate">
                              {listingDishImage ? 'Change Photo' : 'Upload Dish Photo / Camera'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      setListingDishImage(reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Quick Dish Preset Thumbnails */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                          <span className="text-[9px] font-extrabold text-slate-400 shrink-0">Presets:</span>
                          {[
                            { name: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Pasta', img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Sizzler', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Coffee', img: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Dosa', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Thali', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Fish Fry', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&auto=format&fit=crop&q=80' },
                            { name: 'Dessert', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80' },
                          ].map((pre) => (
                            <button
                              key={pre.name}
                              type="button"
                              onClick={() => setListingDishImage(pre.img)}
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                                listingDishImage === pre.img
                                  ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300'
                              }`}
                            >
                              {pre.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setListingDishIsVeg(true)}
                            className={`px-2 py-0.5 rounded-lg text-[9.5px] font-black border cursor-pointer ${
                              listingDishIsVeg ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            🟢 Veg
                          </button>
                          <button
                            type="button"
                            onClick={() => setListingDishIsVeg(false)}
                            className={`px-2 py-0.5 rounded-lg text-[9.5px] font-black border cursor-pointer ${
                              !listingDishIsVeg ? 'bg-rose-100 text-rose-900 border-rose-400' : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            🔴 Non-Veg
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!listingDishName.trim()) {
                              alert('Please enter dish name.');
                              return;
                            }
                            const priceNum = parseInt(listingDishPrice, 10) || 150;
                            const newDish = {
                              name: listingDishName.trim(),
                              price: `₹${priceNum}`,
                              isVeg: listingDishIsVeg,
                              image: listingDishImage || getDishImage({ name: listingDishName, isVeg: listingDishIsVeg }),
                              desc: 'Freshly prepared signature dish'
                            };
                            setNewRestoDishList([...newRestoDishList, newDish]);
                            setListingDishName('');
                            setListingDishPrice('');
                            setListingDishImage('');
                            setIsAddingListingDish(false);
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          Save Dish ✓
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: FACILITIES & TABLE QR SETUP */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-orange-100 pb-1.5">
                  <span className="text-base">🪑</span>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    3. Facilities &amp; Table QR Standee Setup
                  </h4>
                </div>

                {/* Features Multi-Select */}
                <div>
                  <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                    Available Facilities
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'AC Dining', 'Free Wi-Fi', 'Home Delivery', 'Takeaway', 
                      'Free Parking', 'Card / UPI Accepted', 'Outdoor Seating', 'Party Hall'
                    ].map((feat) => {
                      const isChecked = newRestoFeatures.includes(feat);
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setNewRestoFeatures(newRestoFeatures.filter(f => f !== feat));
                            } else {
                              setNewRestoFeatures([...newRestoFeatures, feat]);
                            }
                          }}
                          className={`text-[10.5px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-orange-600 text-white border-orange-600 shadow-2xs font-black'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isChecked ? '✓ ' : '+ '}{feat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider">
                        Total Dining Tables
                      </label>
                      <span className="text-[9.5px] text-orange-600 font-bold">Type or select</span>
                    </div>
                    <input
                      type="text"
                      value={newRestoTableCount}
                      onChange={(e) => setNewRestoTableCount(e.target.value)}
                      placeholder="e.g. 10 Tables"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                    <div className="flex items-center gap-1 mt-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                      {['4 Tables', '8 Tables', '10 Tables', '15 Tables', '20 Tables', '30+ Tables'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setNewRestoTableCount(chip)}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                            newRestoTableCount === chip
                              ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-black text-slate-600 uppercase tracking-wider mb-1">
                      Special Launch Offer for Diners
                    </label>
                    <input
                      type="text"
                      value={newRestoLaunchOffer}
                      onChange={(e) => setNewRestoLaunchOffer(e.target.value)}
                      placeholder="e.g. Flat 10% Off on Table Orders"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

              </div>
              </div>

              {/* Submit & Cancel Actions (Sticky Bottom Bar - Always Visible) */}
              <div className="shrink-0 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2 shadow-md z-20">
                <button
                  type="button"
                  onClick={() => setIsListModalOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Submit Listing &amp; Get Table QR Standee 🚀</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ── PERSONAL ACTIVE / RECENT FOOD ORDERS MODAL ── */}
      {isMyOrdersModalOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-base">
                  🛍️
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    My Food Orders
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Live orders sent to restaurant kitchens
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsMyOrdersModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body: Order Tickets List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-0 bg-slate-50/50">
              {myFoodOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <span className="text-3xl block">🍽️</span>
                  <p className="text-xs font-bold text-slate-600">No active orders yet.</p>
                  <p className="text-[10px] text-slate-400">Scan any restaurant table QR or select delivery to place an order!</p>
                </div>
              ) : (
                myFoodOrders.map((ord, oIdx) => (
                  <div key={ord.id || oIdx} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">{ord.restoName}</span>
                          <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                            {ord.orderType === 'dinein' ? `🪑 Table #${ord.tableNumber}` : '🛵 Delivery'}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-slate-400 font-bold">
                          Order ID: {ord.id} • {ord.time}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-950 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 shrink-0">
                        ₹{ord.totalAmount}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1 bg-slate-50/80 rounded-xl p-2 text-xs">
                      {ord.items?.map((it: any, iIdx: number) => (
                        <div key={iIdx} className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700">
                            {it.name} <strong className="text-slate-950 font-black">× {it.count}</strong>
                          </span>
                          <span className="text-slate-500 font-medium">₹{it.price * it.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live Status Progression */}
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live Status: Order Sent to Kitchen (Cooking 👨‍🍳)</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setMyFoodOrders([]);
                  localStorage.removeItem('majh_boisar_my_food_orders');
                  setIsMyOrdersModalOpen(false);
                }}
                className="text-[10.5px] font-bold text-slate-400 hover:text-red-500 cursor-pointer"
              >
                Clear History
              </button>
              <button
                type="button"
                onClick={() => setIsMyOrdersModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── SUBTLE FLOATING PERSONAL ORDER TRACKER (Bottom Right Capsule) ── */}
      {myFoodOrders.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 animate-in slide-in-from-bottom-3 duration-300">
          <button
            onClick={() => setIsMyOrdersModalOpen(true)}
            className="bg-slate-950 text-white hover:bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-2 px-3.5 flex items-center gap-2.5 cursor-pointer group active:scale-95 backdrop-blur-md"
          >
            <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center text-sm shadow-xs">
              {myFoodOrders[0].orderType === 'dinein' ? '🪑' : '🛵'}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9.5px] font-black uppercase tracking-wider text-emerald-400">
                  {myFoodOrders[0].orderType === 'dinein' ? `Table #${myFoodOrders[0].tableNumber}` : 'Delivery'}
                </span>
              </div>
              <p className="text-[11px] font-black text-white leading-tight truncate max-w-[130px]">
                {myFoodOrders[0].restoName}
              </p>
            </div>
            <span className="bg-white/10 text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-md ml-1 group-hover:bg-orange-500 transition-colors">
              View &gt;
            </span>
          </button>
        </div>
      )}

      {/* ── OFFICIAL QR STANDEE MODAL INTEGRATION ── */}
      {standeeTargetResto && (
        <BusinessQRStandeeModal
          isOpen={isStandeeModalOpen}
          onClose={() => {
            setIsStandeeModalOpen(false);
            setStandeeTargetResto(null);
          }}
          business={{
            id: standeeTargetResto.id,
            name: standeeTargetResto.name,
            category: standeeTargetResto.categoryLabel,
            location: standeeTargetResto.location,
            phone: standeeTargetResto.phone,
            whatsapp: standeeTargetResto.whatsapp,
            rating: standeeTargetResto.rating,
            reviewsCount: standeeTargetResto.reviewsCount,
            customUrl: typeof window !== 'undefined' ? `${window.location.origin}/food?id=${standeeTargetResto.id}` : `https://majhboisar.in/food?id=${standeeTargetResto.id}`,
            customOffer: `🍽️ ${standeeTargetResto.speciality} • ${standeeTargetResto.discount || 'Special Foodie Deal'}`
          }}
        />
      )}

    </div>
  );
}

export default function FoodDirectoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fffaf5] flex items-center justify-center text-xs text-orange-600 font-bold">Loading Foodie Hub...</div>}>
      <FoodPageContent />
    </Suspense>
  );
}
