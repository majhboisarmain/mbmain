'use client';

import React, { useState, useEffect } from 'react';
import { BOISAR_EVENTS } from '@/lib/localData';
import { useApp } from '@/context/AppContext';
import { Calendar, X, MapPin, Phone, MessageSquare, Clock, UserCheck, ImageIcon, Plus, Trash2, FileText } from 'lucide-react';

interface CommunityEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityEventsModal({ isOpen, onClose }: CommunityEventsModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen, currentRole } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ 
    name: '', 
    event: '', 
    date: '', 
    time: '',
    venue: '', 
    description: '',
    category: 'Festival', 
    imageName: '', 
    imageBase64: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  // User-posted local events (Persisted in localStorage)
  const [userEvents, setUserEvents] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_user_events');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const userPhone = loggedInUser?.phone?.replace(/\D/g, '') || '';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, imageBase64: ev.target?.result as string, imageName: file.name }));
    reader.readAsDataURL(file);
  };

  // Direct Live Submission handler (No WhatsApp detour, instant live post)
  const handleSubmit = () => {
    if (!form.name || !form.event) return alert('Please enter your name and event title');

    const newEvent = {
      id: 'ev-' + Date.now(),
      title: form.event,
      category: form.category,
      date: form.date ? new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming',
      time: form.time || '10:00 AM onwards',
      venue: form.venue || 'Boisar MIDC',
      organizer: form.name,
      phone: userPhone || '9820123456',
      description: form.description || `${form.event} organized by ${form.name}. Venue: ${form.venue || 'Boisar MIDC'}. Contact for entry & registration details.`,
      image: form.imageBase64 || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString()
    };

    const updatedUserEvents = [newEvent, ...userEvents];
    setUserEvents(updatedUserEvents);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user_events', JSON.stringify(updatedUserEvents));
    }

    setSubmitted(true);
    setTimeout(() => { 
      setSubmitted(false); 
      setShowAddForm(false); 
      setForm({ name: '', event: '', date: '', time: '', venue: '', description: '', category: 'Festival', imageName: '', imageBase64: '' }); 
    }, 1800);
  };

  // Handle deleting OWN listed event
  const handleDeleteEvent = (eventId: string | number) => {
    if (!confirm('Are you sure you want to delete your event notice?')) return;
    const updated = userEvents.filter(e => e.id !== eventId);
    setUserEvents(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user_events', JSON.stringify(updated));
    }
  };

  // Combine user events first, then static mock events
  const allEvents = [...userEvents, ...BOISAR_EVENTS];

  const filteredEvents = allEvents.filter(ev => {
    return categoryFilter === 'All' || ev.category === categoryFilter;
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Calendar className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                MIDC Events &amp; Notices
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Job drives, blood donation camps &amp; notices in Boisar
              </p>
            </div>
          </div>

          {!showAddForm && (
            <button 
              onClick={() => { if (!isLoggedIn) { setLoginModalOpen(true); return; } setShowAddForm(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs px-3 py-1.5 sm:py-2 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0 flex items-center gap-1 ml-auto whitespace-nowrap"
            >
              {isLoggedIn ? <Plus className="w-3.5 h-3.5" /> : null}
              <span>{isLoggedIn ? 'Submit Event' : '🔒 Login to Submit'}</span>
            </button>
          )}
        </div>

        {/* ── SUBMIT EVENT FORM (When opened) ── */}
        {showAddForm && (
          <div className="mb-4 shrink-0">
            {submitted ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center animate-in fade-in">
                <p className="text-indigo-700 font-black text-sm">🎉 Event Listed Live! Your event notice is now active on Boisar MIDC Events.</p>
              </div>
            ) : (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 space-y-2">
                <p className="text-xs font-black text-indigo-800 mb-2">📅 Submit Your Event — Fill Details</p>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Organizer Name*" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all" />
                  <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> +91 {userPhone || 'Login required'}
                  </div>
                  <input placeholder="Event Name / Title*" value={form.event} onChange={e => setForm({...form, event: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 col-span-2 transition-all" />
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all" />
                  <input placeholder="Event Timing (e.g. 10:00 AM - 5:00 PM)*" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all" />
                  <input placeholder="Venue / Location*" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all" />
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition-all">
                    {['Festival','Job Fair','Blood Donation','Sports','Notice'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <textarea 
                    placeholder="Event Description / Details (e.g. Free entry for all residents, bring photo ID for job fair...)*" 
                    value={form.description} 
                    onChange={e => setForm({...form, description: e.target.value})} 
                    rows={2} 
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 col-span-2 transition-all resize-none" 
                  />
                  {/* Image Upload */}
                  <label className="col-span-2 flex items-center gap-2 bg-white border border-dashed border-indigo-300 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-indigo-50 transition-all">
                    <ImageIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-600 flex-1 truncate">{form.imageName || 'Add Event Photo / Banner (optional)'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {form.imageBase64 && (
                    <div className="col-span-2 relative rounded-xl overflow-hidden border border-indigo-300 bg-slate-900">
                      <img src={form.imageBase64} alt="preview" className="h-36 w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setShowAddForm(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-2 rounded-xl transition-all cursor-pointer">Cancel</button>
                  <button onClick={handleSubmit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer shadow-xs">🚀 Post Event Live</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 shrink-0">
          {['All', 'Festival', 'Job Fair', 'Blood Donation', 'Sports', 'Notice'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredEvents.map(ev => {
              const evPhoneDigits = (ev.phone || '').toString().replace(/\D/g, '');
              const isMyEvent = currentRole === 'Admin' || (userPhone && evPhoneDigits && (evPhoneDigits.endsWith(userPhone) || userPhone.endsWith(evPhoneDigits))) || (typeof ev.id === 'string' && ev.id.startsWith('ev-') && userPhone && evPhoneDigits === userPhone);

              return (
                <div
                  key={ev.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group"
                >
                  {/* Event Poster Photo */}
                  {ev.image && (
                    <div className="w-full h-44 sm:h-48 bg-slate-950 relative overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-indigo-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          {ev.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className="bg-slate-950/80 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                          📅 {ev.date}
                        </span>
                        {isMyEvent && (
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-all cursor-pointer"
                            title="Delete My Event Notice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {!ev.image && (
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="bg-indigo-50 text-indigo-800 border border-indigo-200/80 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {ev.category}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-full">
                              📅 {ev.date}
                            </span>
                            {isMyEvent && (
                              <button
                                onClick={() => handleDeleteEvent(ev.id)}
                                className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full shadow-md transition-all cursor-pointer"
                                title="Delete My Event Notice"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1.5">
                        {ev.title}
                      </h4>

                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed mb-3 line-clamp-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {ev.description}
                      </p>

                      <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                        <span className="flex items-center gap-1 text-indigo-700 font-extrabold">
                          <Clock className="w-3 h-3 text-indigo-600 shrink-0" /> Time: {ev.time}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> Venue: {ev.venue}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" /> By: {ev.organizer}
                        </span>
                      </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                      <a
                        href={`tel:${ev.phone}`}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/91${ev.phone}?text=Hello,%20I%20want%20details%20about:%20${encodeURIComponent(ev.title)}`}
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

            {filteredEvents.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                <h4 className="text-sm font-black text-slate-700">No Events or Notices Posted Yet</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Be the first to post a job fair, tournament, or community notice in Boisar!</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  + Post Event Notice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
