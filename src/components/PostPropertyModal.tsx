import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Camera, Coins, FileText, Check, Upload, Trash2, Star, MessageSquare, Video, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProperty: any) => void;
}

export default function PostPropertyModal({ isOpen, onClose, onAddProperty }: PostPropertyModalProps) {
  const { loggedInUser, isLoggedIn, userName, showToast } = useApp();

  const [step, setStep] = useState(1);

  // Step 1: Basic Details
  const [iAm, setIAm] = useState('Owner');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);

  // Auto-fill logged in user info when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      if (loggedInUser?.name) {
        setContactName(loggedInUser.name);
      } else if (isLoggedIn && userName && !userName.includes('Guest')) {
        const cleanName = userName.replace(/\s*\((User|Owner|BusinessOwner|Admin)\)/g, '').trim();
        setContactName(cleanName);
      } else {
        setContactName('');
      }

      if (loggedInUser?.phone) {
        setContactPhone(loggedInUser.phone);
        setWhatsappPhone(loggedInUser.phone);
      } else {
        setContactPhone('');
        setWhatsappPhone('');
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loggedInUser, isLoggedIn, userName]);

  const [forAction, setForAction] = useState('Sale');
  const [propertyType, setPropertyType] = useState('Flat/ Apartment');
  const [cityName, setCityName] = useState('Boisar');
  const [projectName, setProjectName] = useState('');
  const [addressLocality, setAddressLocality] = useState('');
  const [bedrooms, setBedrooms] = useState('2');
  const [balconies, setBalconies] = useState('1');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [bathrooms, setBathrooms] = useState('2');

  // Technical Specs Inputs (Empty by default)
  const [carpetAreaInput, setCarpetAreaInput] = useState('');
  const [superAreaInput, setSuperAreaInput] = useState('');
  const [floorNo, setFloorNo] = useState('');
  const [totalFloorsCount, setTotalFloorsCount] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('Ready to Move');
  const [transactionTypeState, setTransactionTypeState] = useState('Resale');
  const [facingState, setFacingState] = useState('East');
  const [ownershipState, setOwnershipState] = useState('Freehold');
  const [developerInput, setDeveloperInput] = useState('');

  // Step 2: Photos & Video (User uploads only, max 1 video optional)
  const defaultPropertyFallbackPhoto = "/majh-boisar-mb-logo.png";
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file (e.g. MP4, WebM).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setSelectedVideo(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 3: Pricing & Deposit (Empty by default)
  const [priceInput, setPriceInput] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [description, setDescription] = useState('');

  const pillClass = (active: boolean) => 
    `px-2 sm:px-2.5 py-0.5 sm:py-1 border rounded-full text-[10px] sm:text-[11px] font-bold cursor-pointer transition-colors ${
      active 
      ? 'bg-teal-50 border-teal-500 text-teal-700' 
      : 'bg-white border-slate-200 text-slate-650 hover:border-teal-300'
    }`;

  const numPillClass = (active: boolean) => 
    `w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border rounded-full text-[10px] sm:text-[11px] font-bold cursor-pointer transition-colors ${
      active 
      ? 'bg-teal-50 border-teal-500 text-teal-700' 
      : 'bg-white border-slate-200 text-slate-650 hover:border-teal-300'
    }`;

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Upload local images from device with compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newPhotos: string[] = [];
      
      try {
        const { compressImage } = await import('@/lib/imageCompressor');
        for (const file of files) {
          const compressed = await compressImage(file, 1200, 1200, 0.8);
          newPhotos.push(compressed);
        }
        setSelectedPhotos((prev) => [...newPhotos, ...prev]);
      } catch (err) {
        let count = 0;
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (evt.target?.result) {
              newPhotos.push(evt.target.result as string);
            }
            count++;
            if (count === files.length) {
              setSelectedPhotos((prev) => [...newPhotos, ...prev]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }
  };

  const makeCoverPhoto = (index: number) => {
    if (index === 0) return;
    setSelectedPhotos((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async () => {
    const formattedPrice = priceInput ? (priceInput.startsWith('₹') ? priceInput : `₹${priceInput}`) : '₹35,00,000';
    const finalWhatsapp = sameAsPhone ? contactPhone : (whatsappPhone || contactPhone);
    const isPlot = propertyType === 'Plot/ Land';
    const projectOrLocality = projectName.trim() || addressLocality.trim() || 'Boisar';

    const titleCategory = isPlot 
      ? `Plot/ Land For ${forAction === 'Sale' ? 'Sale' : 'Rent'} in ${projectOrLocality}, ${cityName}`
      : `${bedrooms !== '0' ? bedrooms + ' BHK ' : ''}${propertyType} For ${forAction === 'Sale' ? 'Sale' : 'Rent'} in ${projectOrLocality}, ${cityName}`;

    const rawPriceNum = parseInt((priceInput || '3500000').replace(/\D/g, '')) || 3500000;
    const rawSqftNum = parseInt((carpetAreaInput || '650').replace(/\D/g, '')) || 650;
    const computedPricePerSqft = rawPriceNum > 0 && rawSqftNum > 0 
      ? `₹${Math.round(rawPriceNum / rawSqftNum).toLocaleString('en-IN')}/sqft` 
      : (isPlot ? '₹1,800/sqft' : '₹4,200/sqft');

    const carpetFormatted = carpetAreaInput ? (carpetAreaInput.includes('sqft') ? carpetAreaInput : `${carpetAreaInput} sqft`) : '650 sqft';
    const superFormatted = superAreaInput ? (superAreaInput.includes('sqft') ? superAreaInput : `${superAreaInput} sqft`) : '850 sqft';

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iAm,
          contactName: contactName || 'Owner',
          contactPhone: contactPhone || '',
          whatsappPhone: finalWhatsapp,
          forAction,
          propertyType,
          cityName,
          projectName: projectName || null,
          addressLocality: addressLocality || projectOrLocality,
          bedrooms: isPlot ? '0' : bedrooms,
          balconies,
          furnishing: isPlot ? 'N/A' : furnishing,
          bathrooms: isPlot ? '0' : bathrooms,
          carpetArea: isPlot ? '1,200 sqft' : carpetFormatted,
          superArea: isPlot ? '1,500 sqft' : superFormatted,
          price: formattedPrice,
          description: description || `A beautiful ${isPlot ? 'plot' : 'property'} listed for ${forAction.toLowerCase()} in ${projectOrLocality}, ${cityName}.`,
          photos: selectedPhotos,
          video: selectedVideo || null,
        }),
      });

      if (res.ok) {
        const newProperty = await res.json();
        const propertyWithMedia = {
          ...newProperty,
          video: selectedVideo || newProperty.video,
          videos: selectedVideo ? [selectedVideo] : newProperty.videos || [],
          gallery: selectedPhotos.length > 0 ? selectedPhotos : newProperty.gallery,
        };
        onAddProperty(propertyWithMedia);
        showToast('🎉 Property Submitted! Under verification (will be live within 24 hours).', 'success', 6000);
        setStep(4);
      } else {
        alert('Failed to post property listing. Please try again.');
      }
    } catch (err) {
      console.error('Error posting property:', err);
      alert('Network error while posting property.');
    }
  };

  const handleClose = () => {
    setStep(1);
    setProjectName('');
    setAddressLocality('');
    setCarpetAreaInput('');
    setSuperAreaInput('');
    setFloorNo('');
    setTotalFloorsCount('');
    setDeveloperInput('');
    setPriceInput('');
    setSecurityDeposit('');
    setMaintenance('');
    setSelectedPhotos([]);
    setSelectedVideo(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="w-[96%] sm:w-full max-w-[620px] h-[58dvh] max-h-[58dvh] sm:h-[65vh] sm:max-h-[65vh] bg-slate-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#0b5c47] text-white px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between shrink-0 rounded-t-2xl shadow-sm z-10">
          <div>
            <h2 className="text-xs sm:text-sm font-black">Sell or Rent your Property</h2>
            <p className="text-[9px] sm:text-[11px] font-bold text-teal-100/90">You are posting this property for FREE!</p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left Sidebar (Progress Steps) */}
          <div className="hidden md:flex w-[140px] bg-white border-r border-slate-200 flex-col py-2.5 px-3 shrink-0 overflow-y-auto z-10">
            <div className="mb-2">
              <h3 className="text-[11px] font-black text-slate-800">Post Progress</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">Complete all fields to list</p>
            </div>
            
            <div className="space-y-2.5 text-[11px] font-bold">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-700 font-extrabold' : 'text-slate-400'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${step > 1 ? 'bg-teal-600 border-teal-600 text-white' : step === 1 ? 'border-teal-600 text-teal-650' : 'border-slate-300'}`}>
                  {step > 1 ? <Check className="w-2.5 h-2.5" /> : '1'}
                </div>
                <span>Basic Details</span>
              </div>

              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-700 font-extrabold' : 'text-slate-400'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${step > 2 ? 'bg-teal-600 border-teal-600 text-white' : step === 2 ? 'border-teal-600 text-teal-650' : 'border-slate-300'}`}>
                  {step > 2 ? <Check className="w-2.5 h-2.5" /> : '2'}
                </div>
                <span>Upload Photos</span>
              </div>

              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-teal-700 font-extrabold' : 'text-slate-400'}`}>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border ${step === 3 ? 'border-teal-600 text-teal-650' : 'border-slate-300'}`}>
                  3
                </div>
                <span>Pricing & Deposit</span>
              </div>
            </div>
          </div>

          {/* Right Content Form */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3.5 space-y-2 sm:space-y-3 pb-3">
            
            {/* STEP 1: BASIC DETAILS */}
            {step === 1 && (
              <div className="space-y-2 sm:space-y-3 animate-in fade-in duration-150">
                {/* Personal Details */}
                <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="text-[11px] sm:text-xs font-black text-slate-800 mb-1 pb-0.5 border-b border-slate-100">Personal & Contact Details</h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">I am</label>
                    <div className="flex gap-2">
                      {['Owner', 'Agent', 'Builder'].map(opt => (
                        <div key={opt} onClick={() => setIAm(opt)} className={pillClass(iAm === opt)}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Person Name</label>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={contactName} 
                        onChange={(e) => setContactName(e.target.value)} 
                        className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number (Calling)</label>
                      <input 
                        type="text" 
                        placeholder="10-digit Phone Number" 
                        value={contactPhone} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setContactPhone(val);
                          if (sameAsPhone) {
                            setWhatsappPhone(val);
                          }
                        }} 
                        className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" 
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number Details */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-teal-600" /> WhatsApp Number
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-teal-700">
                        <input 
                          type="checkbox" 
                          checked={sameAsPhone} 
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSameAsPhone(checked);
                            if (checked) {
                              setWhatsappPhone(contactPhone);
                            }
                          }} 
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                        />
                        <span>Same as Calling Number</span>
                      </label>
                    </div>
                    {!sameAsPhone && (
                      <input 
                        type="text" 
                        placeholder="Enter separate WhatsApp Number" 
                        value={whatsappPhone} 
                        onChange={(e) => setWhatsappPhone(e.target.value)} 
                        className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" 
                      />
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 mb-3 pb-1.5 border-b border-slate-100">Property Details</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">For</label>
                    <div className="flex flex-wrap gap-2">
                      {['Sale', 'Rent/ Lease', 'PG/Hostel'].map(opt => (
                        <div key={opt} onClick={() => setForAction(opt)} className={pillClass(forAction === opt)}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Property Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['Flat/ Apartment', 'Independent House/ Villa', 'Plot/ Land'].map(opt => (
                        <div key={opt} onClick={() => setPropertyType(opt)} className={pillClass(propertyType === opt)}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Property Location */}
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 mb-3 pb-1.5 border-b border-slate-100">Property Location</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">City / Town</label>
                      <input type="text" placeholder="Enter City (e.g. Boisar)" value={cityName} onChange={(e) => setCityName(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Name of Project/Society</label>
                      <input type="text" placeholder="Name Of Project/Society" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Address / Locality / Landmark</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Flat 302, B-Wing, Ostwal Empire, Near Boisar Station, Tarapur Road" 
                      value={addressLocality} 
                      onChange={(e) => setAddressLocality(e.target.value)} 
                      className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" 
                    />
                  </div>
                </div>

                {/* Property Features (Hidden for Plot / Land) */}
                {propertyType !== 'Plot/ Land' ? (
                  <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-800 mb-3 pb-1.5 border-b border-slate-100">Property Features</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bedrooms</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['0', '1', '2', '3', '4', '5+'].map(opt => (
                            <div key={opt} onClick={() => setBedrooms(opt)} className={numPillClass(bedrooms === opt)}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Balconies</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['0', '1', '2', '3', '3+'].map(opt => (
                            <div key={opt} onClick={() => setBalconies(opt)} className={numPillClass(balconies === opt)}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Furnished Status</label>
                        <div className="flex flex-wrap gap-2">
                          {['Furnished', 'Unfurnished', 'Semi-Furnished'].map(opt => (
                            <div key={opt} onClick={() => setFurnishing(opt)} className={pillClass(furnishing === opt)}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bathrooms</label>
                        <div className="flex flex-wrap gap-1.5">
                          {['0', '1', '2', '3', '4', '5+'].map(opt => (
                            <div key={opt} onClick={() => setBathrooms(opt)} className={numPillClass(bathrooms === opt)}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-teal-50/50 border border-teal-200/70 p-4 rounded-xl text-xs space-y-1">
                    <p className="font-extrabold text-teal-900">🏞️ Plot / Land Selected</p>
                    <p className="text-[11px] text-teal-700 font-medium">Bedrooms, Bathrooms, and Furnishing details are automatically hidden for plots.</p>
                  </div>
                )}

                {/* Technical Property Specifications Box */}
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 mb-3 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span>Technical Property Specifications</span>
                    <span className="text-[10px] text-teal-600 font-bold uppercase">Area & Building Info</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Carpet Area (sqft)</label>
                      <input type="text" placeholder="e.g. 650 sqft" value={carpetAreaInput} onChange={(e) => setCarpetAreaInput(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Super Built-Up Area (sqft)</label>
                      <input type="text" placeholder="e.g. 850 sqft" value={superAreaInput} onChange={(e) => setSuperAreaInput(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                    </div>
                  </div>

                  {propertyType !== 'Plot/ Land' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Floor No.</label>
                        <input type="text" placeholder="e.g. 2" value={floorNo} onChange={(e) => setFloorNo(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Floors in Building</label>
                        <input type="text" placeholder="e.g. 4" value={totalFloorsCount} onChange={(e) => setTotalFloorsCount(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Property Status</label>
                    <div className="flex flex-wrap gap-2">
                      {['Ready to Move', 'Under Construction', 'Ready to Construct'].map(opt => (
                        <div key={opt} onClick={() => setPropertyStatus(opt)} className={pillClass(propertyStatus === opt)}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['Resale', 'New Property', 'Lease'].map(opt => (
                        <div key={opt} onClick={() => setTransactionTypeState(opt)} className={pillClass(transactionTypeState === opt)}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Facing Direction</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['East', 'West', 'North', 'South', 'North-East'].map(opt => (
                          <div key={opt} onClick={() => setFacingState(opt)} className={pillClass(facingState === opt)}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ownership Type</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Freehold', 'Leasehold', 'Co-operative Society'].map(opt => (
                          <div key={opt} onClick={() => setOwnershipState(opt)} className={pillClass(ownershipState === opt)}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Developer / Builder Name (Optional)</label>
                    <input type="text" placeholder="e.g. Ostwal Builders / Independent / Owner" value={developerInput} onChange={(e) => setDeveloperInput(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none transition-colors font-bold text-slate-800" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PHOTOS UPLOAD */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-teal-600" /> Property Photos
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Upload photos directly from your phone/computer. The 1st photo will be your <strong>Cover Photo</strong>.
                      </p>
                    </div>

                    {/* Upload File Button */}
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        id="property-file-input" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                      <label 
                        htmlFor="property-file-input" 
                        className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Photos</span>
                      </label>
                    </div>
                  </div>

                  {/* Selected / Uploaded Photos Grid */}
                  {selectedPhotos.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Uploaded / Selected Photos ({selectedPhotos.length})
                        </span>
                        <span className="text-[10px] text-teal-700 font-bold">
                          ★ First photo is set as Cover Photo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedPhotos.map((url, index) => {
                          const isCover = index === 0;
                          return (
                            <div 
                              key={index} 
                              className={`aspect-[4/3] rounded-xl overflow-hidden border-2 relative group transition-all shadow-sm ${
                                isCover ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
                              }`}
                            >
                              <img src={url} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                              
                              {/* Cover Badge */}
                              {isCover ? (
                                <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow flex items-center gap-1 z-10">
                                  <Star className="w-3 h-3 fill-slate-950" /> Cover Photo
                                </div>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => makeCoverPhoto(index)}
                                  className="absolute top-2 left-2 bg-slate-900/80 hover:bg-teal-600 text-white font-bold text-[9px] px-2 py-1 rounded-md opacity-90 group-hover:opacity-100 transition-all shadow z-10"
                                >
                                  Set as Cover
                                </button>
                              )}

                              {/* Remove Photo */}
                              <button 
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-full shadow transition-all z-10"
                                title="Remove Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-250 rounded-xl p-6 text-center space-y-2">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto text-teal-600" />
                      <p className="text-xs text-slate-600 font-bold">No photos selected yet.</p>
                      <p className="text-[10px] text-slate-400">Click the 'Upload Photos' button to choose photos from your device.</p>
                    </div>
                  )}

                  {/* Property Walkthrough Video Box (Optional - Max 1 Video) */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-teal-600" />
                          <span>Property Walkthrough Video</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Upload a short video tour of your property (Optional — Max 1 Video).</p>
                      </div>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-extrabold uppercase">Optional (Max 1)</span>
                    </div>

                    {selectedVideo ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm p-1 space-y-2">
                        <video src={selectedVideo} controls className="w-full max-h-48 rounded-lg object-contain" />
                        <div className="flex justify-between items-center px-2.5 py-1 bg-slate-800 text-white rounded-lg text-xs">
                          <span className="text-[10px] font-bold text-emerald-400">✓ Video Tour Uploaded</span>
                          <button
                            type="button"
                            onClick={() => setSelectedVideo(null)}
                            className="text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                          >
                            Remove Video
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/40 hover:bg-teal-50/80 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all">
                        <Video className="w-5 h-5 text-teal-600 shrink-0" />
                        <div className="text-left">
                          <span className="text-xs font-extrabold text-teal-900 block">Click to Upload Video Tour</span>
                          <span className="text-[10px] text-teal-700 font-medium">MP4, WebM or MOV format (Max 1 video)</span>
                        </div>
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                      </label>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: PRICING & DETAILS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 mb-2 pb-1.5 border-b border-slate-100 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-teal-600" /> Pricing & Deposit
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expected Price (₹)</label>
                      <input type="text" placeholder="e.g. 35,00,000" value={priceInput} onChange={(e) => setPriceInput(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Security Deposit (₹)</label>
                      <input type="text" placeholder="e.g. 50,000" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none font-bold text-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Maintenance /Month (₹)</label>
                      <input type="text" placeholder="e.g. 1,500" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} className="w-full border-b border-slate-250 py-1 text-xs focus:border-teal-500 outline-none font-bold text-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-xs font-black text-slate-800 mb-1 pb-1.5 border-b border-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" /> Property Description
                  </h3>
                  <textarea 
                    rows={4} 
                    placeholder="Describe your property (amenities, proximity to Boisar station, nearby markets, schools, family features, etc.)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-250 rounded-lg p-2.5 text-xs focus:border-teal-500 focus:outline-none font-medium text-slate-700 leading-normal"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS LISTING */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-md animate-bounce border-2 border-amber-200">
                  <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-850">Property Submitted for Verification!</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 max-w-sm mx-auto">
                    <p className="text-[11px] font-bold text-amber-900 leading-relaxed">
                      ⏳ <strong>Review within 24 Hours:</strong> To ensure genuine owner listings and protect against fraudulent brokers, our team is verifying your submission. It will be published live within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50/20 border border-teal-100/60 rounded-xl p-4 text-left max-w-md w-full mt-2">
                  <span className="text-[9px] font-black text-teal-700 uppercase tracking-widest block mb-2">Listing Summary</span>
                  <p className="text-xs font-black text-slate-800 leading-snug">{bedrooms && bedrooms !== '0' ? `${bedrooms} BHK ` : ''}{propertyType} for {forAction === 'Sale' ? 'Sale' : 'Rent'}</p>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5">{projectName || addressLocality || 'Boisar'}, Boisar</p>
                  <div className="flex justify-between items-center border-t border-slate-200/50 pt-2 mt-2">
                    <span className="text-[10px] text-slate-400 font-bold">Price</span>
                    <strong className="text-sm font-black text-teal-700">₹{priceInput}</strong>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions - Sticky at bottom */}
        <div className="bg-white border-t border-slate-200 px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex justify-between items-center shadow-lg shrink-0 rounded-b-2xl sm:rounded-b-3xl z-30 sticky bottom-0">
          {step === 4 ? (
            <div className="flex items-center justify-between w-full gap-3">
              <button 
                onClick={() => {
                  handleClose();
                  window.location.href = '/dashboard?mode=property';
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 touch-manipulation"
              >
                <span>🏢 Go to Property Dashboard</span>
              </button>
              <button 
                onClick={handleClose} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-colors cursor-pointer touch-manipulation"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={step === 1 ? handleClose : handlePrevStep} 
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer touch-manipulation"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={step === 3 ? handleFormSubmit : handleNextStep} 
                className="bg-[#0d9488] hover:bg-[#0f766e] active:scale-95 text-white font-black text-xs sm:text-sm px-4.5 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-all shadow-md cursor-pointer touch-manipulation flex items-center gap-1.5"
              >
                <span>{step === 1 ? 'Continue to Photos' : step === 2 ? 'Continue to Pricing' : 'List Property'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
