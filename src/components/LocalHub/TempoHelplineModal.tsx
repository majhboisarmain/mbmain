'use client';

import React, { useState, useEffect } from 'react';
import { TEMPO_DRIVERS, TempoDriver } from '@/lib/localData';
import { Truck, X, MapPin, Phone, MessageSquare, Plus, CheckCircle, Camera } from 'lucide-react';

interface TempoHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TempoHelplineModal({ isOpen, onClose }: TempoHelplineModalProps) {
  const [driverList, setDriverList] = useState<TempoDriver[]>(TEMPO_DRIVERS);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState<'Chota Hathi (Tata Ace)' | '3-Wheel Auto Tempo' | 'Pickup 8ft' | 'Eeco Luggage'>('Chota Hathi (Tata Ace)');
  const [phone, setPhone] = useState('');
  const [standLocation, setStandLocation] = useState('Boisar Station Stand');
  const [rateEstimate, setRateEstimate] = useState('Starting ₹350 / Call for Per KM rate');
  const [availability, setAvailability] = useState('24/7 Available');
  const [image, setImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync with local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_tempo_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDriverList([...parsed, ...TEMPO_DRIVERS]);
          }
        } catch (e) { }
      }
    }
  }, []);

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !phone.trim()) {
      alert("Please enter Driver / Business Name and Contact Phone!");
      return;
    }

    const defaultImg = vehicleType.includes('Tata Ace') ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
      : vehicleType.includes('Pickup') ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
        : vehicleType.includes('Auto') ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80';

    const newDriver: TempoDriver = {
      id: `tmp-custom-${Date.now()}`,
      driverName,
      vehicleType,
      phone,
      standLocation,
      rateEstimate,
      availability,
      image: image.trim() || defaultImg
    };

    const updated = [newDriver, ...driverList];
    setDriverList(updated);

    if (typeof window !== 'undefined') {
      const existingSaved = localStorage.getItem('majh_boisar_tempo_list');
      let customOnly: TempoDriver[] = [];
      if (existingSaved) {
        try { customOnly = JSON.parse(existingSaved); } catch (e) { }
      }
      localStorage.setItem('majh_boisar_tempo_list', JSON.stringify([newDriver, ...customOnly]));
    }

    setSuccessMsg('Tempo driver registered successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
      setDriverName('');
      setPhone('');
      setImage('');
    }, 1500);
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
              <Truck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Chota Hathi &amp; Tempo Helpline
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Direct call with Tata Ace, 8ft Pickup &amp; goods auto drivers
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-auto whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'View List' : 'Register Tempo'}</span>
          </button>
        </div>

        {/* Inline Add Tempo Driver Form */}
        {showAddForm ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 sm:p-6 max-w-xl mx-auto space-y-4 text-left">
              <div className="flex items-center gap-2 text-amber-900 border-b border-amber-200 pb-2">
                <Truck className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-black uppercase tracking-wider">Register Tempo / Driver in Boisar</h4>
              </div>

              {successMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2 text-xs font-black">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Driver / Service Name *</label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={e => setDriverName(e.target.value)}
                      placeholder="e.g. Suresh Luggage Tempo (Tata Ace)"
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Vehicle Type *</label>
                      <select
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value as any)}
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Chota Hathi (Tata Ace)">Chota Hathi (Tata Ace)</option>
                        <option value="Pickup 8ft">Pickup 8ft (Bolero / Maxi)</option>
                        <option value="3-Wheel Auto Tempo">3-Wheel Auto Tempo</option>
                        <option value="Eeco Luggage">Eeco Luggage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Contact Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 7769947217"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Stand Location *</label>
                      <input
                        type="text"
                        required
                        value={standLocation}
                        onChange={e => setStandLocation(e.target.value)}
                        placeholder="e.g. Boisar Station Stand, Pasthal Naka"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Estimated Rate / Per KM info *</label>
                      <input
                        type="text"
                        required
                        value={rateEstimate}
                        onChange={e => setRateEstimate(e.target.value)}
                        placeholder="e.g. Starting ₹350 / Call for Per KM rate"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Availability</label>
                      <input
                        type="text"
                        value={availability}
                        onChange={e => setAvailability(e.target.value)}
                        placeholder="e.g. 24/7 Available or 6 AM - 10 PM"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">
                        Upload Vehicle Photo (Optional)
                      </label>
                      {image ? (
                        <div className="relative w-full h-20 rounded-xl overflow-hidden border border-amber-400 group">
                          <img src={image} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImage('')}
                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md cursor-pointer shadow-sm"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-1.5 w-full bg-white border border-dashed border-slate-300 hover:border-amber-500 rounded-xl py-2.5 px-3 text-[11px] font-extrabold text-amber-900 cursor-pointer transition-colors">
                          <Camera className="w-4 h-4 text-amber-600" />
                          <span>Choose Vehicle Photo from Gallery / Camera</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const { compressImage } = await import('@/lib/imageCompressor');
                                const compressedBase64 = await compressImage(file, 1000, 1000, 0.85);
                                setImage(compressedBase64);
                              } catch (err) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setImage(ev.target?.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                  >
                    Submit & Register Tempo Driver
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Drivers Grid (1 Column on Mobile, 2 on Tablet, 3 on Desktop) */
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {driverList.map(tp => (
                <div
                  key={tp.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
                >
                  {/* Vehicle Cover Image */}
                  <div className="w-full h-32 sm:h-36 bg-slate-100 relative overflow-hidden shrink-0">
                    <img
                      src={tp.image}
                      alt={tp.driverName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                        {tp.vehicleType}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="bg-slate-950/80 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        {tp.availability}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1.5 truncate">
                        {tp.driverName}
                      </h4>

                      <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> Stand: {tp.standLocation}
                        </span>
                        <span className="block text-slate-900 font-black">Est. Rate: {tp.rateEstimate}</span>
                      </div>
                    </div>

                    {/* Contact Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
                      <a
                        href={`tel:${tp.phone}`}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs py-2 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Driver</span>
                      </a>

                      <a
                        href={`https://wa.me/91${tp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${tp.driverName}, I need tempo luggage service in Boisar. Please share per KM rates!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {driverList.length === 0 && (
                <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                  <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-black text-slate-700">No Tempo Drivers Listed Yet</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Local Tata Ace / Chota Hathi tempo drivers can register their contact number soon.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
