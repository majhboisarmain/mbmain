'use client';

import React, { useEffect } from 'react';
import { BOISAR_OFFERS } from '@/lib/localData';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Tag, X, MapPin, Phone, MessageSquare, Clock, Sparkles } from 'lucide-react';

interface LocalOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocalOffersModal({ isOpen, onClose }: LocalOffersModalProps) {
  const { isLoggedIn, setLoginModalOpen, hasRegisteredBusiness } = useApp();
  const router = useRouter();

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

  const handleRegister = () => {
    onClose();
    if (!isLoggedIn) { setLoginModalOpen(true); return; }
    if (hasRegisteredBusiness) {
      router.push('/dashboard?tab=settings');
    } else {
      router.push('/dashboard');
    }
  };

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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Tag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Local Deals &amp; Offers
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Discount vouchers &amp; deals from Boisar shops
              </p>
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0 ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>List Offer</span>
          </button>
        </div>

        {/* Offers Grid */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {BOISAR_OFFERS.map(offer => (
              <div
                key={offer.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                {/* Banner Image (Taller ratio so offer posters do not cut off) */}
                <div className="w-full h-44 sm:h-48 bg-slate-950 relative overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={offer.bannerImg}
                    alt={offer.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> {offer.badgeText}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {offer.discount}
                    </span>
                  </div>
                </div>

                {/* Offer Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1 line-clamp-2">
                      {offer.title}
                    </h4>
                    <p className="text-[10px] font-bold text-amber-700 mb-2">{offer.shopName}</p>

                    <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {offer.address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" /> Valid: {offer.validTill}
                      </span>
                      {(offer as any).couponCode && (
                        <div className="inline-block bg-slate-100 border border-dashed border-slate-300 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded mt-1">
                          Code: {(offer as any).couponCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                    <a
                      href={`tel:${offer.phone}`}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Shop</span>
                    </a>

                    <a
                      href={`https://wa.me/91${offer.phone}?text=Hello%20${encodeURIComponent(offer.shopName)},%20I%20saw%20your%20offer%20"${encodeURIComponent(offer.title)}"%20on%20Majh%20Boisar!`}
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
            ))}

            {BOISAR_OFFERS.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-black text-slate-700">No Active Shop Offers Right Now</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Local shops and stores will post new discount deals & festival offers here soon.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
