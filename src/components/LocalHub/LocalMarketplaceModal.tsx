'use client';

import React, { useState, useEffect } from 'react';
import { BOISAR_MARKETPLACE } from '@/lib/localData';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, X, MapPin, Phone, MessageSquare, Tag, Plus, Search, ImageIcon, Trash2 } from 'lucide-react';

interface LocalMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocalMarketplaceModal({ isOpen, onClose }: LocalMarketplaceModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen, currentRole } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    item: '', 
    category: 'Vehicles', 
    customCategory: '', 
    price: '', 
    condition: 'Good', 
    imageName: '', 
    imageBase64: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  // DB-persisted marketplace items
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await fetch('/api/marketplace');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setItemsList(data);
      }
    } catch (e) {
      console.error('Error fetching marketplace items:', e);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchItems();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const userPhone = loggedInUser?.phone?.replace(/\D/g, '') || '';

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { compressImage } = await import('@/lib/imageCompressor');
      const compressedBase64 = await compressImage(file, 1000, 1000, 0.85);
      setForm(f => ({ ...f, imageBase64: compressedBase64, imageName: file.name }));
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(f => ({ ...f, imageBase64: ev.target?.result as string, imageName: file.name }));
      reader.readAsDataURL(file);
    }
  };

  // Direct Live Submission handler to DB
  const handleSubmit = async () => {
    if (!form.name || !form.item) return alert('Please enter your name and item name');
    if (form.category === 'Other' && !form.customCategory.trim()) return alert('Please specify the category name');
    
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.item,
          category: form.category,
          customCategory: form.customCategory,
          price: form.price,
          condition: form.condition,
          location: 'Boisar',
          sellerName: form.name,
          phone: userPhone || '9820123456',
          imageBase64: form.imageBase64,
        }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItemsList(prev => [newItem, ...prev]);
        setSubmitted(true);
        setTimeout(() => { 
          setSubmitted(false); 
          setShowAddForm(false); 
          setForm({ name: '', item: '', category: 'Vehicles', customCategory: '', price: '', condition: 'Good', imageName: '', imageBase64: '' }); 
        }, 1800);
      } else {
        alert('Failed to post item listing. Please try again.');
      }
    } catch (err) {
      console.error('Error posting marketplace item:', err);
      alert('Network error while posting item.');
    }
  };

  // Handle deleting listed item from DB
  const handleDeleteItem = async (itemId: string | number) => {
    if (!confirm('Are you sure you want to delete your item listing?')) return;
    try {
      const res = await fetch(`/api/marketplace?id=${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        setItemsList(prev => prev.filter(i => i.id !== itemId));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // DB-persisted items
  const allItems = itemsList;

  const filteredItems = allItems.filter(item => {
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter || (categoryFilter === 'Other' && !['Vehicles', 'Electronics', 'Furniture', 'Mobiles'].includes(item.category));
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2.5 mb-3 shrink-0 pr-8 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Used Items Marketplace
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Buy &amp; sell pre-owned bikes, electronics &amp; furniture
              </p>
            </div>
          </div>

          {!showAddForm && (
            <button 
              onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } setShowAddForm(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs px-3 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1 ml-auto whitespace-nowrap"
            >
              {isLoggedIn ? <Plus className="w-3.5 h-3.5" /> : null}
              <span>{isLoggedIn ? 'Post Item' : '🔒 Login to List'}</span>
            </button>
          )}
        </div>

        {/* ── ADD YOUR ITEM FORM (When opened) ── */}
        {showAddForm && (
          <div className="mb-4 shrink-0">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center animate-in fade-in">
                <p className="text-emerald-700 font-black text-sm">🎉 Item Listed Live! Your used item is now visible on Boisar Marketplace.</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                <p className="text-xs font-black text-emerald-800 mb-2">📦 List Your Used Item — Fill Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Your Name*" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-400 transition-all" />
                  <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> +91 {userPhone || 'Login required'}
                  </div>
                  <input placeholder="Item Name*" value={form.item} onChange={e => setForm({...form, item: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-400 col-span-2 transition-all" />
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-400 transition-all">
                    {['Vehicles','Electronics','Furniture','Mobiles','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-400 transition-all" />
                  {form.category === 'Other' && (
                    <input
                      placeholder="Category Name* (e.g. Books, Sports, Clothing)"
                      value={form.customCategory}
                      onChange={e => setForm({...form, customCategory: e.target.value})}
                      className="bg-white border border-emerald-400 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500 text-slate-900 col-span-2 transition-all placeholder:text-slate-400 shadow-2xs"
                    />
                  )}
                  <select value={form.condition} onChange={e => setForm({...form, condition: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-400 col-span-2 sm:col-span-1 transition-all">
                    {['Like New','Good','Fair','Needs Repair'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  {/* Image Upload */}
                  <label className="col-span-2 flex items-center gap-2 bg-white border border-dashed border-emerald-300 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-emerald-50 transition-all">
                    <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-600 flex-1 truncate">{form.imageName || 'Add Photo of Item (optional)'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {form.imageBase64 && (
                    <div className="col-span-2 relative rounded-xl overflow-hidden border border-emerald-300 bg-slate-900">
                      <img src={form.imageBase64} alt="preview" className="h-36 w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2 rounded-xl transition-all cursor-pointer">Cancel</button>
                  <button onClick={handleSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer shadow-xs">🚀 Post Item Live</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Activa, TV, Sofa, Mobiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Vehicles', 'Electronics', 'Furniture', 'Mobiles', 'Other'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                  categoryFilter === cat
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace Grid (Taller image ratio, no image cropping, delete own listings) */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredItems.map(item => {
              const itemSellerDigits = (item.sellerPhone || item.phone || '').toString().replace(/\D/g, '');
              const isMyItem = currentRole === 'Admin' || (userPhone && itemSellerDigits && (itemSellerDigits.endsWith(userPhone) || userPhone.endsWith(itemSellerDigits))) || (typeof item.id === 'string' && item.id.startsWith('mkt-') && userPhone && itemSellerDigits === userPhone);

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  {/* Product Image Container (Taller ratio so image does not cut off) */}
                  <div className="w-full h-44 sm:h-48 bg-slate-900 relative overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className="bg-slate-950/80 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {isMyItem && (
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-all cursor-pointer"
                          title="Delete My Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1 line-clamp-2">
                        {item.title}
                      </h4>

                      <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                        <span className="block text-slate-700 font-extrabold">Condition: {item.condition}</span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {item.location} • Seller: {item.sellerName}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                      <a
                        href={`tel:${item.phone || item.sellerPhone}`}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Seller</span>
                      </a>

                      <a
                        href={`https://wa.me/91${item.phone || item.sellerPhone}?text=Hello%20${encodeURIComponent(item.sellerName)},%20I%20am%20interested%20in%20buying:%20${encodeURIComponent(item.title)}%20from%20Majh%20Boisar!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-black text-slate-700">No Used Items Listed Yet</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Post second-hand household items, bikes, furniture &amp; books for local Boisar buyers.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  + Post Used Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
