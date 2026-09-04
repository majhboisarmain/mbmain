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
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // Form states
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState<'Packers & Movers' | 'Chota Hathi (Tata Ace)' | '3-Wheel Auto Tempo' | 'Pickup 8ft' | 'Eeco Luggage'>('Packers & Movers');
  const [phone, setPhone] = useState('');
  const [standLocation, setStandLocation] = useState('Boisar West & Ostwal');
  const [rateEstimate, setRateEstimate] = useState('Starting ₹1,499 (1BHK Shifting) / Call for Quote');
  const [availability, setAvailability] = useState('24/7 Available');
  const [image, setImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with database
  const fetchDbTempos = async () => {
    try {
      const res = await fetch('/api/vehicles?category=Tempo & Shifting');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted: TempoDriver[] = data.map((d: any) => ({
            id: d.id.toString(),
            driverName: d.name,
            vehicleType: d.vehicleModel || 'Tempo & Shifting',
            phone: d.phone,
            standLocation: d.location,
            rateEstimate: d.ratePerKm,
            availability: d.timing,
            image: d.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
          }));
          setDriverList([...formatted, ...TEMPO_DRIVERS]);
          return;
        }
      }
    } catch (e) {
      console.warn('Error fetching tempo listings:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbTempos();
    }
  }, [isOpen]);

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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!driverName.trim() || !phone.trim()) {
      alert("Please enter Business / Driver Name and Contact Phone!");
      return;
    }

    const defaultImg = vehicleType.includes('Packers') ? 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&auto=format&fit=crop&q=80'
      : vehicleType.includes('Tata Ace') ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
      : vehicleType.includes('Pickup') ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
      : vehicleType.includes('Auto') ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80';

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: driverName.trim(),
          category: 'Tempo & Shifting',
          vehicleModel: vehicleType,
          capacity: 'Standard Shifting Load',
          ratePerKm: rateEstimate,
          location: standLocation,
          phone: phone.trim(),
          timing: availability,
          image: image.trim() || defaultImg,
          features: ['Direct Owner Contact', '0% Commission', 'Verified Boisar Listing']
        })
      });

      if (res.ok) {
        const saved = await res.json();
        const newDriver: TempoDriver = {
          id: saved.id.toString(),
          driverName: saved.name,
          vehicleType: saved.vehicleModel,
          phone: saved.phone,
          standLocation: saved.location,
          rateEstimate: saved.ratePerKm,
          availability: saved.timing,
          image: saved.image || defaultImg
        };
        if (saved.verified) {
          setDriverList(prev => [newDriver, ...prev.filter(d => String(d.id) !== String(newDriver.id))]);
          setSuccessMsg('🎉 Packers & Movers / Tempo registered successfully!');
        } else {
          setSuccessMsg('⏳ Tempo registered! Admin will verify and activate your listing shortly.');
        }
        setTimeout(() => {
          setSuccessMsg('');
          setShowAddForm(false);
          setDriverName('');
          setPhone('');
          setImage('');
        }, 1800);
      }
    } catch (e) {
      console.warn('Error registering tempo to database:', e);
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredDrivers = driverList.filter((d) => {
    if (selectedFilter === 'All') return true;
    return d.vehicleType.toLowerCase().includes(selectedFilter.toLowerCase());
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Packers &amp; Movers, Chota Hathi &amp; Tempo Helpline
              </h3>
              <p className="text-[10.5px] sm:text-xs text-slate-500 font-medium truncate">
                Verified house shifting, Tata Ace, 8ft Pickup &amp; goods tempo in Boisar
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-auto whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'View List' : '+ Register Service'}</span>
          </button>
        </div>

        {/* Filter Tabs */}
        {!showAddForm && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none shrink-0">
            {[
              { id: 'All', label: `All (${driverList.length})` },
              { id: 'Packers & Movers', label: '📦 Packers & Movers' },
              { id: 'Tata Ace', label: '🚚 Chota Hathi (Tata Ace)' },
              { id: 'Pickup 8ft', label: '🛻 8ft Pickup Bolero' },
              { id: 'Auto', label: '🛺 3-Wheel Goods Auto' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                  selectedFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

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
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Service / Vehicle Type *</label>
                      <select
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value as any)}
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Packers & Movers">📦 Packers & Movers (House / Office Shifting)</option>
                        <option value="Chota Hathi (Tata Ace)">🚚 Chota Hathi (Tata Ace)</option>
                        <option value="Pickup 8ft">🛻 Pickup 8ft (Bolero / Maxi)</option>
                        <option value="3-Wheel Auto Tempo">🛺 3-Wheel Goods Auto Tempo</option>
                        <option value="Eeco Luggage">🚐 Eeco Luggage</option>
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
                    disabled={isSubmitting}
                    className={`w-full font-black text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 ${
                      isSubmitting
                        ? 'bg-amber-300 text-slate-700 cursor-not-allowed opacity-80'
                        : 'bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 cursor-pointer'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin shrink-0" />
                        <span>Registering Driver, Please Wait...</span>
                      </>
                    ) : (
                      <span>Submit & Register Tempo Driver</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Drivers Grid (1 Column on Mobile, 2 on Tablet, 3 on Desktop) */
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredDrivers.map(tp => (
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
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug truncate">
                          {tp.driverName}
                        </h4>
                        <span className="bg-emerald-50 text-emerald-700 text-[8.5px] font-black px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          ✓ Verified
                        </span>
                      </div>

                      <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-2">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> Stand: {tp.standLocation}
                        </span>
                        <span className="block text-slate-900 font-black text-[11px] text-amber-700">
                          💰 {tp.rateEstimate}
                        </span>
                      </div>

                      {tp.services && tp.services.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {tp.services.map((srv, sIdx) => (
                            <span key={sIdx} className="bg-slate-100 text-slate-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              {srv}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
                      <a
                        href={`tel:${tp.phone}`}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs py-2 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Now</span>
                      </a>

                      <a
                        href={`https://wa.me/91${tp.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${tp.driverName}, I need ${tp.vehicleType} shifting/transport service in Boisar. Please share available timings & rate quote!`)}`}
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

              {filteredDrivers.length === 0 && (
                <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-6 text-center my-3 shadow-2xs space-y-1.5">
                  <Truck className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                  <h4 className="text-sm font-black text-slate-800">No Transport Drivers Available in this Category</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Select another vehicle category to view available drivers across Boisar.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
