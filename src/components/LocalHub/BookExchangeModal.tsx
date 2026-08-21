'use client';

import React, { useState, useEffect } from 'react';
import { BOOK_EXCHANGE_ITEMS } from '@/lib/localData';
import { useApp } from '@/context/AppContext';
import { BookOpen, X, MapPin, Phone, MessageSquare, Plus, Search, Filter, ImageIcon, Trash2 } from 'lucide-react';

interface BookExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookExchangeModal({ isOpen, onClose }: BookExchangeModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen, currentRole } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<'All' | '10th/12th School' | 'ITI / Polytechnic' | 'Engineering / Degree'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', subject: '', category: '10th/12th School', priceType: 'Free / Gift', imageName: '', imageBase64: '' });
  const [submitted, setSubmitted] = useState(false);

  // DB-persisted books
  const [booksList, setBooksList] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await fetch('/api/books');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBooksList(data);
      }
    } catch (e) {
      console.error('Error fetching books:', e);
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchBooks();
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
    if (!form.name || !form.title) return alert('Please enter your name and book title');

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          subject: form.subject || 'General',
          category: form.category,
          priceType: form.priceType,
          price: form.priceType === 'Free / Gift' ? 0 : 50,
          phone: userPhone || '9820123456',
          imageBase64: form.imageBase64,
          location: 'Boisar',
        }),
      });

      if (res.ok) {
        const newBook = await res.json();
        setBooksList(prev => [newBook, ...prev]);
        setSubmitted(true);
        setTimeout(() => { 
          setSubmitted(false); 
          setShowAddForm(false); 
          setForm({ name: '', title: '', subject: '', category: '10th/12th School', priceType: 'Free / Gift', imageName: '', imageBase64: '' }); 
        }, 1800);
      } else {
        alert('Failed to post book listing. Please try again.');
      }
    } catch (err) {
      console.error('Error posting book:', err);
      alert('Network error while posting book.');
    }
  };

  // Handle deleting listed book from DB
  const handleDeleteBook = async (bookId: string | number) => {
    if (!confirm('Are you sure you want to delete your book listing?')) return;
    try {
      const res = await fetch(`/api/books?id=${bookId}`, { method: 'DELETE' });
      if (res.ok) {
        setBooksList(prev => prev.filter(b => b.id !== bookId));
      }
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const allBooks = booksList;

  const filteredBooks = allBooks.filter(book => {
    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    const matchesSearch = (book.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (book.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (book.donorName || '').toLowerCase().includes(searchQuery.toLowerCase());
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Student Book Exchange
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Donate, swap, or buy school guides, ITI &amp; exam notes
              </p>
            </div>
          </div>

          {!showAddForm && (
            <button 
              onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } setShowAddForm(true); }}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs px-3 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1 ml-auto whitespace-nowrap"
            >
              {isLoggedIn ? <Plus className="w-3.5 h-3.5" /> : null}
              <span>{isLoggedIn ? 'Donate Book' : '🔒 Login to Donate'}</span>
            </button>
          )}
        </div>

        {/* ── ADD YOUR BOOK FORM (When opened) ── */}
        {showAddForm && (
          <div className="mb-4 shrink-0">
            {submitted ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center animate-in fade-in">
                <p className="text-blue-700 font-black text-sm">🎉 Book Listed Live! Your book is now active on Boisar Book Exchange.</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-2">
                <p className="text-xs font-black text-blue-800 mb-2">📚 Donate or List Your Book — Fill Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Your Name*" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 transition-all" />
                  <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> +91 {userPhone || 'Login required'}
                  </div>
                  <input placeholder="Book Title*" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 col-span-2 transition-all" />
                  <input placeholder="Subject (e.g. Maths, Science)" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 transition-all" />
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 transition-all">
                    {['10th/12th School','ITI / Polytechnic','Engineering / Degree'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select value={form.priceType} onChange={e => setForm({...form, priceType: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-blue-400 col-span-2 transition-all">
                    {['Free / Gift','Discount Price'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  {/* Image Upload */}
                  <label className="col-span-2 flex items-center gap-2 bg-white border border-dashed border-blue-300 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-blue-50 transition-all">
                    <ImageIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-600 flex-1 truncate">{form.imageName || 'Add Photo of Book (optional)'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {form.imageBase64 && (
                    <div className="col-span-2 relative rounded-xl overflow-hidden border border-blue-300 bg-slate-900">
                      <img src={form.imageBase64} alt="preview" className="h-36 w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2 rounded-xl transition-all cursor-pointer">Cancel</button>
                  <button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer shadow-xs">🚀 Post Book Live</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-4 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books, ITI notes, subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', '10th/12th School', 'ITI / Polytechnic', 'Engineering / Degree'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                  categoryFilter === cat
                    ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredBooks.map(book => {
              const bookDonorDigits = (book.donorPhone || book.phone || '').toString().replace(/\D/g, '');
              const isMyBook = currentRole === 'Admin' || (userPhone && bookDonorDigits && (bookDonorDigits.endsWith(userPhone) || userPhone.endsWith(bookDonorDigits))) || (typeof book.id === 'string' && book.id.startsWith('bk-') && userPhone && bookDonorDigits === userPhone);

              return (
                <div
                  key={book.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  {/* Book Cover Image */}
                  <div className="w-full h-44 sm:h-48 bg-slate-900 relative overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                        {book.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs ${
                        book.priceType === 'Free / Gift' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-amber-400 text-amber-950'
                      }`}>
                        {book.priceType === 'Free / Gift' ? 'FREE GIFT' : `₹${book.price}`}
                      </span>
                      {isMyBook && (
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-all cursor-pointer"
                          title="Delete My Book Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-2 line-clamp-2">
                        {book.title}
                      </h4>

                      <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                        <span className="block text-slate-700 font-extrabold">Condition: {book.condition}</span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {book.location} • Donor: {book.donorName}
                        </span>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                      <a
                        href={`tel:${book.phone || book.donorPhone}`}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/91${book.phone || book.donorPhone}?text=Hello%20${encodeURIComponent(book.donorName)},%20I%20want%20to%20collect/buy%20your%20book:%20${encodeURIComponent(book.title)}%20from%20Majh%20Boisar!`}
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

            {filteredBooks.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-black text-slate-700">No Books Offered Yet</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Donate or sell old school textbooks and exam notes to students in Boisar!</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  + Offer Books
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
