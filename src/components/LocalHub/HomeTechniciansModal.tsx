'use client';

import React, { useState, useEffect } from 'react';
import { HOME_TECHNICIANS, HomeTechnician } from '@/lib/localData';
import { Wrench, X, MapPin, Phone, MessageSquare, Plus, CheckCircle, Star, Camera } from 'lucide-react';

interface HomeTechniciansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomeTechniciansModal({ isOpen, onClose }: HomeTechniciansModalProps) {
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [techList, setTechList] = useState<HomeTechnician[]>(HOME_TECHNICIANS);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<'AC Service & Repair' | 'Electrician' | 'Plumber' | 'RO Water Filter' | 'Washing Machine'>('AC Service & Repair');
  const [experience, setExperience] = useState('5+ Yrs Experience');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Boisar West');
  const [visitingFee, setVisitingFee] = useState('₹199 Inspection / Call for Rate');
  const [image, setImage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync with local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('majh_boisar_tech_list');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTechList([...parsed, ...HOME_TECHNICIANS]);
          }
        } catch (e) {}
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
    if (!name.trim() || !phone.trim()) {
      alert("Please enter Technician Name and Contact Phone!");
      return;
    }

    const defaultImg = skill === 'AC Service & Repair' ? 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
      : skill === 'Electrician' ? 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80'
      : skill === 'Plumber' ? 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80';

    const newTech: HomeTechnician = {
      id: `tech-custom-${Date.now()}`,
      name,
      skill,
      experience,
      phone,
      location,
      visitingFee,
      rating: 5.0,
      image: image.trim() || defaultImg
    };

    const updated = [newTech, ...techList];
    setTechList(updated);

    if (typeof window !== 'undefined') {
      const existingSaved = localStorage.getItem('majh_boisar_tech_list');
      let customOnly: HomeTechnician[] = [];
      if (existingSaved) {
        try { customOnly = JSON.parse(existingSaved); } catch (e) {}
      }
      localStorage.setItem('majh_boisar_tech_list', JSON.stringify([newTech, ...customOnly]));
    }

    setSuccessMsg('Technician registered successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
      setName('');
      setPhone('');
      setImage('');
    }, 1500);
  };

  const filteredTechs = techList.filter(tech => {
    return skillFilter === 'All' || tech.skill === skillFilter;
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
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0 pr-8 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Wrench className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                Boisar Home Repair Technicians
              </h3>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Verified local AC, electricians, plumbers &amp; RO technicians
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-cyan-700 hover:bg-cyan-800 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'View List' : 'List Service'}</span>
          </button>
        </div>

        {/* Inline Add Technician Form */}
        {showAddForm ? (
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 max-w-xl mx-auto space-y-4 text-left">
              <div className="flex items-center gap-2 text-cyan-800 border-b border-slate-200 pb-2">
                <Wrench className="w-5 h-5" />
                <h4 className="text-sm font-black uppercase tracking-wider">Register as Home Technician in Boisar</h4>
              </div>

              {successMsg ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-2 text-xs font-black">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleAddSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Technician / Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma (AC Repair & Gas Refill)"
                      className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Skill Category *</label>
                      <select
                        value={skill}
                        onChange={e => setSkill(e.target.value as any)}
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                      >
                        <option value="AC Service & Repair">AC Service & Repair</option>
                        <option value="Electrician">Electrician</option>
                        <option value="Plumber">Plumber</option>
                        <option value="RO Water Filter">RO Water Filter</option>
                        <option value="Washing Machine">Washing Machine</option>
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
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Service Area / Location *</label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. Boisar West, Ostwal Empire, Pasthal"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Inspection / Visiting Charges *</label>
                      <input
                        type="text"
                        required
                        value={visitingFee}
                        onChange={e => setVisitingFee(e.target.value)}
                        placeholder="e.g. ₹199 Inspection / Call for Rate Card"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">Work Experience</label>
                      <input
                        type="text"
                        value={experience}
                        onChange={e => setExperience(e.target.value)}
                        placeholder="e.g. 8+ Yrs Experience"
                        className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-600 font-extrabold uppercase mb-1">
                        Upload Work Photo (Optional)
                      </label>
                      {image ? (
                        <div className="relative w-full h-20 rounded-xl overflow-hidden border border-cyan-300 group">
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
                        <label className="flex items-center justify-center gap-1.5 w-full bg-white border border-dashed border-slate-300 hover:border-cyan-500 rounded-xl py-2.5 px-3 text-[11px] font-extrabold text-cyan-800 cursor-pointer transition-colors">
                          <Camera className="w-4 h-4 text-cyan-700" />
                          <span>Choose Photo from Gallery / Camera</span>
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
                    className="w-full bg-cyan-700 hover:bg-cyan-800 active:scale-[0.98] text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer mt-2"
                  >
                    Submit & Register Technician
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Skill Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 shrink-0">
              {['All', 'AC Service & Repair', 'Electrician', 'Plumber', 'RO Water Filter', 'Washing Machine'].map(skill => (
                <button
                  key={skill}
                  onClick={() => setSkillFilter(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                    skillFilter === skill
                      ? 'bg-cyan-700 text-white border-cyan-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Technicians Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredTechs.map(tech => (
                  <div
                    key={tech.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between group"
                  >
                    {/* Work Photo */}
                    <div className="w-full h-44 sm:h-48 bg-slate-950 relative overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={tech.image}
                        alt={tech.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-cyan-700 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                          {tech.skill}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          ★ {tech.rating}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug mb-1 truncate">
                          {tech.name}
                        </h4>

                        <div className="space-y-1 text-[10px] text-slate-500 font-bold mb-3">
                          <span className="block text-slate-700 font-extrabold">{tech.experience} • {tech.visitingFee}</span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {tech.location}
                          </span>
                        </div>
                      </div>

                      {/* Contact Buttons */}
                      <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                        <a
                          href={`tel:${tech.phone}`}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <a
                          href={`https://wa.me/91${tech.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${tech.name}, I need ${tech.skill} service in Boisar. Please share availability & rates!`)}`}
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

                {filteredTechs.length === 0 && (
                  <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center my-4">
                    <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="text-sm font-black text-slate-700">No Technicians Registered in this Category Yet</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Local AC technicians, plumbers, and electricians can click "+ Register Technician" to list their profile.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
