'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, MapPin, Phone, Droplet, Clock, X, HeartPulse, 
  ShieldCheck, Trash2, Building2, Heart, Sparkles, AlertCircle, CheckCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  location: string;
  phone: string;
  lastDonated: string;
  verified: boolean;
}

const bloodGroups = ["All", "O+", "B+", "A+", "AB+", "O-", "B-", "A-", "AB-"];

const EMERGENCY_BLOOD_BANKS = [
  {
    name: "Red Cross District Blood Bank",
    location: "Civil Hospital Campus, Palghar",
    phone: "02525252244",
    displayPhone: "02525-252244",
    timing: "24x7 Open"
  },
  {
    name: "Anand Hospital Blood Storage Unit",
    location: "Opp. Harmony Plaza, Boisar (West)",
    phone: "9822114455",
    displayPhone: "98221 14455",
    timing: "24x7 Emergency"
  },
  {
    name: "Tarapur MIDC Medical Trauma Center",
    location: "MIDC Gate No. 1, Tarapur",
    phone: "108",
    displayPhone: "108 (Toll Free)",
    timing: "24x7 Emergency"
  },
  {
    name: "Sanjeevani Blood Component Centre",
    location: "Station Road, Palghar (West)",
    phone: "02525254411",
    displayPhone: "02525-254411",
    timing: "24x7 Open"
  }
];

export default function BloodDonationPage() {
  const { isLoggedIn, loggedInUser, currentRole, setLoginModalOpen } = useApp();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [localMyDonorId, setLocalMyDonorId] = useState<string | null>(null);
  
  // Modals
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [bloodBanksModalOpen, setBloodBanksModalOpen] = useState(false);
  
  // Register Form
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("O+");
  const [newLocation, setNewLocation] = useState("Boisar (West)");
  const [newPhone, setNewPhone] = useState("");
  const [submittingRegister, setSubmittingRegister] = useState(false);

  const userPhoneDigits = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setLocalMyDonorId(localStorage.getItem('majh_boisar_my_donor_id'));

      const handleVisibility = () => {
        if (document.visibilityState === 'visible') {
          fetchDonors();
        }
      };
      fetchDonors();
      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('focus', fetchDonors);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibility);
        window.removeEventListener('focus', fetchDonors);
      };
    }
    fetchDonors();
  }, []);

  const myDonorProfile = useMemo(() => {
    return donors.find(d => {
      if (localMyDonorId && String(d.id) === String(localMyDonorId)) return true;
      if (userPhoneDigits) {
        const dPhone = (d.phone || '').replace(/\D/g, '');
        if (dPhone && (dPhone.endsWith(userPhoneDigits.slice(-10)) || userPhoneDigits.endsWith(dPhone.slice(-10)))) {
          return true;
        }
      }
      return false;
    });
  }, [donors, userPhoneDigits, localMyDonorId]);

  const [isDonorPendingDeletion, setIsDonorPendingDeletion] = useState(false);
  const [submittingRemoval, setSubmittingRemoval] = useState(false);

  const fetchDonors = async () => {
    setLoadingDonors(true);
    try {
      const uDigits = userPhoneDigits ? userPhoneDigits.slice(-10) : '';
      const uParam = uDigits ? `&userPhone=${uDigits}` : '';
      const res = await fetch(`/api/blood-donors?_t=${Date.now()}${uParam}`, {
        cache: 'no-store',
        headers: { 
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setDonors(data);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoadingDonors(false);
    }
  };

  useEffect(() => {
    if (myDonorProfile) {
      const checkPending = async () => {
        try {
          const phone = myDonorProfile.phone || userPhoneDigits;
          const res = await fetch(`/api/deletion-requests?phone=${phone}&itemId=${myDonorProfile.id}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.some((d: any) => d.status === 'Pending' && d.type === 'blood_donor')) {
              setIsDonorPendingDeletion(true);
            }
          }
        } catch (e) {}
      };
      checkPending();
    }
  }, [myDonorProfile, userPhoneDigits]);
  
  const handleOpenRegisterModal = () => {
    if (!isLoggedIn) {
      alert("Please login / register first to list yourself as a Blood Donor.");
      setLoginModalOpen(true);
      return;
    }
    if (myDonorProfile) {
      alert(`You are already registered as a ${myDonorProfile.bloodGroup} Blood Donor!`);
      return;
    }
    setNewName(loggedInUser?.name || '');
    setNewPhone(loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '') : '');
    setRegisterModalOpen(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    if (!isLoggedIn) {
      alert("Please login / register to list yourself as a Blood Donor.");
      setLoginModalOpen(true);
      return;
    }
    
    setSubmittingRegister(true);
    try {
      const res = await fetch('/api/blood-donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          bloodGroup: newGroup,
          location: newLocation,
          phone: newPhone.replace(/\D/g, ''),
          lastDonated: "Ready to donate",
        }),
      });

      if (res.ok) {
        const newDonor = await res.json();
        if (typeof window !== 'undefined' && newDonor?.id) {
          localStorage.setItem('majh_boisar_my_donor_id', String(newDonor.id));
          localStorage.setItem('majh_boisar_my_donor_phone', String(newDonor.phone || ''));
          setLocalMyDonorId(String(newDonor.id));
        }
        if (newDonor.verified) {
          setDonors(prev => [newDonor, ...prev.filter(d => d.id !== newDonor.id)]);
          alert("🎉 Thank you! Your voluntary donor profile is live in the Boisar Blood Donors list.");
        } else {
          alert("⏳ Thank you for volunteering! Your registration has been submitted. Admin will verify and activate your donor listing shortly.");
        }
        setRegisterModalOpen(false);
        setNewName("");
        setNewPhone("");
        fetchDonors();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to register donor. Please try again.");
      }
    } catch (err) {
      console.error('Error registering donor:', err);
      alert("Network error. Please try again.");
    } finally {
      setSubmittingRegister(false);
    }
  };

  const handleRemoveDonor = async (donorId: number, donorName: string) => {
    if (!confirm(`Are you sure you want to request removal of your profile "${donorName}" from the Blood Donors list?\n\nThis will send a deletion request to the Super Admin for verification and permanent removal.`)) return;

    setSubmittingRemoval(true);
    try {
      const res = await fetch('/api/deletion-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blood_donor',
          itemId: donorId,
          itemName: `${donorName} (${myDonorProfile?.bloodGroup || 'Donor'})`,
          userName: donorName,
          userPhone: myDonorProfile?.phone || userPhoneDigits,
          reason: 'Donor requested voluntary profile removal'
        })
      });

      if (res.ok) {
        setIsDonorPendingDeletion(true);
        alert("✅ Your deletion request has been submitted for Super Admin review. Once approved, your profile will be permanently removed.");
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.alreadyPending) {
          setIsDonorPendingDeletion(true);
          alert("⚠️ Deletion request is already pending Super Admin approval.");
        } else {
          alert("Failed to submit deletion request. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setSubmittingRemoval(false);
    }
  };

  const filteredDonors = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const cleanTargetGroup = selectedGroup.trim().toUpperCase().replace(/\s+/g, '');

    return donors.filter(d => {
      const rawGroup = (d.bloodGroup || (d as any).bloodgroup || '').toString().trim().toUpperCase().replace(/\s+/g, '');
      const matchGroup = selectedGroup === "All" || rawGroup === cleanTargetGroup || rawGroup.startsWith(cleanTargetGroup);
      const matchSearch = !query || 
        (d.name || '').toLowerCase().includes(query) || 
        (d.location || '').toLowerCase().includes(query) ||
        rawGroup.toLowerCase().includes(query);
      return matchGroup && matchSearch;
    });
  }, [donors, selectedGroup, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 text-slate-900">
      
      {/* ── 1. Compact Sleek Header ── */}
      <div 
        className="text-white py-3.5 px-3 sm:px-4 text-center shadow-md relative overflow-hidden"
        style={{
          backgroundColor: '#991b1b',
          backgroundImage: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #881337 100%)'
        }}
      >
        <div className="max-w-xl mx-auto space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/30 border border-white/20 text-white text-[9px] font-black uppercase tracking-wider">
            <HeartPulse className="w-3 h-3 text-rose-300" />
            <span>Majh Boisar Lifesavers</span>
          </div>

          <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight">
            Find Blood Donors in Boisar
          </h1>

          <p className="text-[10.5px] sm:text-[11px] text-red-100 font-medium">
            Directly contact voluntary blood donors or register to help in emergencies.
          </p>

          <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
            {myDonorProfile ? (
              <div className="bg-white text-slate-900 text-[11px] px-3 py-1 rounded-lg font-black flex items-center gap-2 shadow-xs">
                <span>👤 Listed: <strong className="text-red-700">{myDonorProfile.name} ({myDonorProfile.bloodGroup})</strong></span>
                {isDonorPendingDeletion ? (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Deletion Pending Approval
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={submittingRemoval}
                    onClick={() => handleRemoveDonor(myDonorProfile.id, myDonorProfile.name)}
                    className="bg-red-600 hover:bg-red-700 text-white text-[9px] px-2 py-0.5 rounded font-black cursor-pointer"
                  >
                    {submittingRemoval ? 'Submitting...' : 'Unlist'}
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={handleOpenRegisterModal}
                className="bg-white hover:bg-slate-100 active:scale-95 text-red-700 font-black text-[11px] px-3 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Droplet className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                <span>Register as Blood Donor</span>
              </button>
            )}

            <button 
              onClick={() => setBloodBanksModalOpen(true)}
              className="bg-black/30 hover:bg-black/50 border border-white/30 text-white font-black text-[11px] px-3 py-1.5 rounded-lg shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>24x7 Blood Banks</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Simple Search & Filter ── */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 mt-4 space-y-3">
        
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200 space-y-2.5">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, area (e.g. Ostwal, MIDC, Station Road)..."
              className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl py-2 pl-9 pr-8 text-xs font-bold border border-slate-200 focus:outline-none focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Blood group selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">Group:</span>
            {bloodGroups.map(bg => {
              const isSelected = selectedGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`shrink-0 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-red-600 text-white border-red-600 shadow-xs' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-red-300 hover:text-red-600'
                  }`}
                >
                  {bg}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-black text-slate-700">
            {filteredDonors.length} Donors Available
          </span>
          {selectedGroup !== "All" && (
            <span className="bg-red-50 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
              Filtered: {selectedGroup}
            </span>
          )}
        </div>

        {/* ── PINNED USER'S OWN BLOOD DONOR PROFILE ── */}
        {myDonorProfile && (
          <div className="space-y-2 pb-3 border-b border-slate-200">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Your Voluntary Donor Profile (Aapki Listed Profile)</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Visible to you at the top
              </span>
            </div>

            <div className="bg-linear-to-b from-rose-50/70 to-white rounded-2xl p-4 border-2 border-rose-400 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                  {myDonorProfile.bloodGroup}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                      {myDonorProfile.name}
                    </h3>
                    {isDonorPendingDeletion ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> Deletion Pending Admin Approval
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" /> Active Voluntary Donor
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{myDonorProfile.location}</span>
                    <span>•</span>
                    <span>+91 {myDonorProfile.phone}</span>
                  </p>
                  {isDonorPendingDeletion && (
                    <p className="text-[10.5px] text-rose-700 font-medium mt-1 leading-tight">
                      ⏳ Your profile removal request is under admin review. Once approved, it will be permanently unlisted.
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0">
                {isDonorPendingDeletion ? (
                  <div className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Removal Pending</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={submittingRemoval}
                    onClick={() => handleRemoveDonor(myDonorProfile.id, myDonorProfile.name)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95 text-xs font-black px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{submittingRemoval ? 'Submitting...' : 'Request Removal / Unlist'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 3. Donors Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDonors.filter(d => !myDonorProfile || d.id !== myDonorProfile.id).map(donor => {
            const isMyDonor = Boolean(
              myDonorProfile?.id === donor.id ||
              (localMyDonorId && String(donor.id) === String(localMyDonorId)) ||
              (userPhoneDigits && (
                (donor.phone || '').replace(/\D/g, '').endsWith(userPhoneDigits.slice(-10)) || 
                userPhoneDigits.endsWith((donor.phone || '').replace(/\D/g, '').slice(-10))
              ))
            );
            const isAdmin = currentRole === 'Admin';

            return (
              <div 
                key={donor.id} 
                className={`bg-white rounded-2xl p-3.5 shadow-xs border transition-all flex flex-col justify-between text-left ${
                  isMyDonor 
                    ? 'border-emerald-400 bg-emerald-50/20 ring-1 ring-emerald-400' 
                    : 'border-slate-200 hover:border-red-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Blood Group Icon */}
                      <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                        {donor.bloodGroup}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {donor.name}
                          </h3>
                          {donor.verified && <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />}
                          {isMyDonor && (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" /> {donor.location}
                        </p>
                      </div>
                    </div>

                    {(isMyDonor || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDonor(donor.id, donor.name)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title={isMyDonor ? "Unlist my donor profile" : "Admin: Remove donor"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                  <a 
                    href={`tel:+91${donor.phone}`}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs py-1.5 px-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" /> <span>Call</span>
                  </a>
                  <a 
                    href={`https://wa.me/91${donor.phone}?text=Hello%20${encodeURIComponent(donor.name)}%2C%20we%20have%20an%20urgent%20requirement%20for%20${encodeURIComponent(donor.bloodGroup)}%20blood%20in%20Boisar.%20Are%20you%20available%20to%20donate%3F`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white font-black text-xs py-1.5 px-2 rounded-xl text-center shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
          
          {filteredDonors.length === 0 && (
            <div className="col-span-full bg-white rounded-3xl p-8 sm:p-10 text-center border border-slate-200 shadow-2xs space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto text-xl">
                🩸
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-0.5">
                  Select another blood group filter or contact official 24x7 blood banks listed below in an emergency.
                </p>
              </div>
              {(selectedGroup !== 'All' || searchQuery) && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedGroup("All"); setSearchQuery(""); }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* ── 4. 24x7 Blood Banks Modal ── */}
      {bloodBanksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="fixed inset-0" onClick={() => setBloodBanksModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl z-10 overflow-hidden text-left">
            <div className="bg-red-600 p-3.5 text-white flex justify-between items-center">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> 24x7 Blood Banks in Boisar &amp; Palghar
              </h3>
              <button onClick={() => setBloodBanksModalOpen(false)} className="text-white hover:text-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-3.5 space-y-2.5 max-h-[70vh] overflow-y-auto">
              {EMERGENCY_BLOOD_BANKS.map((b, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-3 flex justify-between items-center gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{b.name}</h4>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {b.location}
                    </p>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                      {b.timing}
                    </span>
                  </div>
                  <a
                    href={`tel:${b.phone}`}
                    className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Registration Modal ── */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 text-left">
          <div className="fixed inset-0" onClick={() => setRegisterModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl z-10 overflow-hidden">
            <div className="bg-red-600 p-3.5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black">Register as Blood Donor</h3>
                <p className="text-[10px] text-red-100">Help people in Boisar during emergencies</p>
              </div>
              <button onClick={() => setRegisterModalOpen(false)} className="text-white hover:text-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase mb-1">Your Full Name *</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase mb-1">Blood Group *</label>
                  <select 
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {bloodGroups.filter(bg => bg !== 'All').map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase mb-1">Area in Boisar *</label>
                  <select 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    <option value="Boisar (West)">Boisar (West)</option>
                    <option value="Ostwal Empire">Ostwal Empire</option>
                    <option value="Tarapur MIDC">Tarapur MIDC</option>
                    <option value="Navapur Road">Navapur Road</option>
                    <option value="Boisar (East)">Boisar (East)</option>
                    <option value="Chitralaya">Chitralaya</option>
                    <option value="Palghar">Palghar</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase mb-1">Mobile Number *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+91</span>
                  <input 
                    type="tel" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500"
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={submittingRegister}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingRegister ? "Listing..." : "Submit & List as Donor"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
