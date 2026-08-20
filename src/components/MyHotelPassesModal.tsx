'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Phone, MessageSquare, X, CheckCircle2, Calendar, Clock, Ticket, LogIn } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface HotelBookingPass {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelPhone?: string;
  hotelAddress?: string;
  guestName: string;
  guestPhone: string;
  roomCategory?: string;
  stayType?: string;
  timeSlot?: string;
  date?: string;
  totalAmount: number;
  status?: string;
  createdAt?: string;
}

interface MyHotelPassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyHotelPassesModal({ isOpen, onClose }: MyHotelPassesModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen } = useApp();
  const [passes, setPasses] = useState<HotelBookingPass[]>([]);

  const loadPasses = () => {
    if (!isLoggedIn || !loggedInUser?.phone) {
      setPasses([]);
      return;
    }
    try {
      const stored: HotelBookingPass[] = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      const hiddenIds: string[] = JSON.parse(localStorage.getItem('majh_boisar_user_hidden_passes') || '[]');
      const userPhoneClean = (loggedInUser.phone || '').replace(/\D/g, '');
      
      // Strictly show passes that belong to THIS logged-in user's phone
      const myPasses = stored.filter(p => {
        const guestPhoneClean = (p.guestPhone || '').replace(/\D/g, '');
        return guestPhoneClean === userPhoneClean && !hiddenIds.includes(p.id);
      });
      setPasses(myPasses);
    } catch (e) {
      setPasses([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPasses();
    }
  }, [isOpen, isLoggedIn, loggedInUser]);

  const handleCancelPass = (passId: string) => {
    if (!confirm('Are you sure you want to cancel this room booking pass? Hotel front desk will be notified.')) return;
    try {
      const stored: HotelBookingPass[] = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      const updated = stored.map(p => p.id === passId ? { ...p, status: 'Cancelled by Guest' } : p);
      // Update in main storage so owner sees "Cancelled by Guest" with phone number preserved
      localStorage.setItem('majh_boisar_hotel_bookings', JSON.stringify(updated));
      setPasses(prev => prev.map(p => p.id === passId ? { ...p, status: 'Cancelled by Guest' } : p));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  // Hides pass from user's personal list WITHOUT deleting it from owner's desk register
  const handleHidePass = (passId: string) => {
    try {
      const hiddenIds: string[] = JSON.parse(localStorage.getItem('majh_boisar_user_hidden_passes') || '[]');
      if (!hiddenIds.includes(passId)) {
        hiddenIds.push(passId);
        localStorage.setItem('majh_boisar_user_hidden_passes', JSON.stringify(hiddenIds));
      }
      // Remove from customer view only
      setPasses(prev => prev.filter(p => p.id !== passId));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-left">
      <div className="bg-white rounded-3xl border border-purple-200/90 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div 
          style={{ background: 'linear-gradient(135deg, #180630 0%, #2b0c50 50%, #120424 100%)' }}
          className="text-white p-4 sm:p-5 flex items-center justify-between border-b border-purple-800/80 shrink-0"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center text-xl shrink-0">
              🎫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                  GUEST PORTAL
                </span>
                <span className="text-[10px] text-purple-200">{passes.length} Saved Passes</span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white mt-0.5">My Hotel Room Booking Passes</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {!isLoggedIn ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-900 border border-purple-200 flex items-center justify-center text-2xl mx-auto shadow-2xs">
                🔒
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-800">Sign In to View Your Hotel Passes</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please sign in with your registered mobile number to securely access your personal room passes.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setLoginModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-purple-900 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer hover:bg-purple-800 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Mobile OTP</span>
              </button>
            </div>
          ) : passes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-black text-slate-800">No Booking Passes Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't generated any hotel room passes yet. Browse verified hotels in Boisar and book instantly with pay-at-desk.
              </p>
              <Link
                href="/hotels"
                onClick={onClose}
                className="inline-block bg-purple-900 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer hover:bg-purple-800 transition-all"
              >
                Browse Hotels in Boisar →
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {passes.map((pass) => {
                const isCancelled = (pass.status || '').includes('Cancelled');
                const isCheckedIn = (pass.status || '').includes('Checked-In');

                return (
                  <div
                    key={pass.id}
                    className="border-2 border-purple-200/80 rounded-2xl p-4 shadow-sm hover:border-purple-400 transition-all bg-white space-y-3"
                  >
                    {/* Top Row: Ref ID + Status */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">PASS REF NUMBER</span>
                        <strong className="text-sm font-mono font-black text-purple-950">{pass.id}</strong>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isCheckedIn
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {pass.status || 'Confirmed Pass'}
                      </span>
                    </div>

                    {/* Pass Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <p className="text-slate-500 font-bold">
                          🏨 <span className="text-slate-900 font-black">{pass.hotelName}</span>
                        </p>
                        <p className="text-slate-500 font-medium">
                          👤 Guest: <strong className="text-slate-800 font-bold">{pass.guestName} ({pass.guestPhone})</strong>
                        </p>
                        <p className="text-slate-500 font-medium">
                          ❄️ Room: <strong className="text-purple-950 font-bold">{pass.roomCategory || 'AC Room'}</strong>
                        </p>
                      </div>

                      <div className="space-y-1 sm:text-right">
                        <p className="text-slate-500 font-medium">
                          ⏰ Slot: <strong className="text-amber-800 font-black">{pass.timeSlot || pass.stayType}</strong>
                        </p>
                        <p className="text-slate-500 font-medium">
                          📅 Date: <strong className="text-slate-800 font-bold">{pass.date}</strong>
                        </p>
                        <p className="text-slate-500 font-medium">
                          💰 Payable at Reception: <strong className="text-base text-purple-950 font-black">₹{pass.totalAmount}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Notice */}
                    <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-2 flex items-center justify-between text-[10.5px] text-purple-950 font-medium">
                      <span>🚪 Show this pass &amp; Govt ID at reception to collect room key</span>
                      <span className="font-black text-emerald-700">✓ Pay on Arrival</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `*Majh Boisar Hotel Room Pass*\n\n🏨 Hotel: ${pass.hotelName}\n📋 Ref: ${pass.id}\n👤 Guest: ${pass.guestName}\n📱 Phone: ${pass.guestPhone}\n⏰ Slot: ${pass.timeSlot || pass.stayType}\n📅 Date: ${pass.date}\n💰 Tariff: ₹${pass.totalAmount} (Pay at desk)`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Share / WhatsApp</span>
                        </a>

                        {pass.hotelPhone && (
                          <a
                            href={`tel:${pass.hotelPhone}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 border border-slate-200 cursor-pointer"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Reception</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => handleCancelPass(pass.id)}
                            className="text-rose-600 font-bold hover:underline cursor-pointer"
                          >
                            Cancel Pass
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleHidePass(pass.id)}
                          className="text-slate-400 font-medium hover:text-slate-700 hover:underline cursor-pointer text-[11px]"
                          title="Hide from your screen (Hotel desk retains booking for check-in)"
                        >
                          Hide Pass
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0">
          <span>Need help with your stay? Call hotel reception directly</span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
