'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Building2, 
  Phone, 
  MessageSquare, 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Ticket, 
  LogIn, 
  Receipt,
  User,
  BedDouble,
  ShieldCheck
} from 'lucide-react';
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
  paymentMode?: string;
  paymentStatus?: string;
  createdAt?: string;
}

interface MyHotelPassesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyHotelPassesModal({ isOpen, onClose }: MyHotelPassesModalProps) {
  const { isLoggedIn, loggedInUser, setLoginModalOpen } = useApp();
  const [passes, setPasses] = useState<HotelBookingPass[]>([]);

  const loadPasses = async () => {
    if (!isLoggedIn || !loggedInUser?.phone) {
      setPasses([]);
      return;
    }
    const userPhoneClean = (loggedInUser.phone || '').replace(/\D/g, '');
    let localPasses: HotelBookingPass[] = [];
    try {
      const stored: HotelBookingPass[] = JSON.parse(localStorage.getItem('majh_boisar_hotel_bookings') || '[]');
      const hiddenIds: string[] = JSON.parse(localStorage.getItem('majh_boisar_user_hidden_passes') || '[]');
      localPasses = stored.filter(p => {
        const guestPhoneClean = (p.guestPhone || '').replace(/\D/g, '');
        return (guestPhoneClean.slice(-10) === userPhoneClean.slice(-10)) && !hiddenIds.includes(p.id);
      });
      setPasses(localPasses);
    } catch (e) {
      console.error('[Passes Local Storage Error]:', e);
    }

    // Parallel sync with central database
    try {
      const res = await fetch(`/api/hotel-bookings?phone=${userPhoneClean}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.bookings)) {
        const hiddenIds: string[] = JSON.parse(localStorage.getItem('majh_boisar_user_hidden_passes') || '[]');
        const dbPasses: HotelBookingPass[] = data.bookings
          .filter((b: any) => !hiddenIds.includes(b.id))
          .map((b: any) => ({
            id: b.id,
            hotelId: String(b.hotelId || b.hotelSlug || ''),
            hotelName: b.hotelName,
            hotelPhone: b.hotelPhone || '',
            hotelAddress: b.hotelAddress || '',
            guestName: b.guestName,
            guestPhone: b.guestPhone,
            roomCategory: b.roomCategory,
            stayType: b.stayType,
            timeSlot: b.timeSlot,
            date: b.checkInDate,
            totalAmount: Number(b.totalAmount) || 0,
            status: b.status,
            paymentMode: b.paymentMode || 'Pay at Hotel',
            paymentStatus: b.paymentStatus || 'Pending',
            createdAt: b.createdAt
          }));

        const seen = new Set(dbPasses.map(p => p.id));
        const merged = [...dbPasses, ...localPasses.filter(p => !seen.has(p.id))];
        setPasses(merged);
      }
    } catch (e) {
      console.error('[Passes DB Fetch Error]:', e);
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
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header (Website Matching Hotel Theme) */}
        <div className="bg-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Ticket className="w-5 h-5 text-blue-600 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">My Bookings &amp; Passes</h3>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">{passes.length} Saved</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Hotel room reservation passes in Boisar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {!isLoggedIn ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900">Sign In to View Your Hotel Passes</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                Please sign in with your registered mobile number to securely access your personal room passes.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setLoginModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Mobile OTP</span>
              </button>
            </div>
          ) : passes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900">No Booking Passes Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                You haven&apos;t generated any hotel room passes yet. Browse verified hotels in Boisar and reserve instantly with pay-at-desk.
              </p>
              <Link
                href="/hotels"
                onClick={onClose}
                className="inline-block bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all"
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
                    className="border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all bg-white space-y-3"
                  >
                    {/* Top Row: Ref ID + Status */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">PASS REF NUMBER</span>
                        <strong className="text-sm font-mono font-black text-slate-900">{pass.id}</strong>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isCheckedIn
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {pass.status || 'Confirmed Pass'}
                      </span>
                    </div>

                    {/* Pass Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-slate-900 font-extrabold">
                          <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{pass.hotelName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Guest: <strong className="text-slate-800 font-bold">{pass.guestName} ({pass.guestPhone})</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <BedDouble className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Room: <strong className="text-blue-700 font-bold">{pass.roomCategory || 'AC Room'}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:text-right">
                        <div className="flex items-center sm:justify-end gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Slot: <strong className="text-slate-900 font-extrabold">{pass.timeSlot || pass.stayType}</strong></span>
                        </div>
                        <div className="flex items-center sm:justify-end gap-1.5 text-slate-600 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Date: <strong className="text-slate-800 font-bold">{pass.date}</strong></span>
                        </div>
                        <div className="pt-0.5">
                          {pass.paymentMode === 'Online' ? (
                            <span className="text-xs text-slate-500 font-medium">
                              Payment: <strong className="text-sm text-blue-700 font-black">₹{pass.totalAmount} (Paid Online)</strong>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-medium">
                              Payable at Desk: <strong className="text-sm text-slate-900 font-black">₹{pass.totalAmount}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notice */}
                    <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-700 font-medium">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Show this pass &amp; Govt ID at reception to collect room key</span>
                      </span>
                      <span className="font-extrabold text-blue-700">
                        {pass.paymentMode === 'Online' ? '✓ Paid Online' : '✓ Pay at Hotel Desk'}
                      </span>
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
                          className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Share WhatsApp</span>
                        </a>

                        {pass.hotelPhone && (
                          <a
                            href={`tel:${pass.hotelPhone}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1.5 px-3 rounded-xl transition-all flex items-center gap-1 border border-slate-200 cursor-pointer"
                          >
                            <Phone className="w-3 h-3 text-slate-600" />
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
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600 shrink-0">
          <span className="text-[11px] text-slate-500">Need help with your stay? Call hotel reception directly</span>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
