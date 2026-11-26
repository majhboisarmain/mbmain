'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Building, Phone, Mail, MapPin, Check, X, ArrowRight, ArrowLeft,
  Sparkles, ShieldAlert, UploadCloud, Clock, HelpCircle, Tag, Plus,
  Trash2, Camera, CheckCircle2, Info, ChevronRight, ShieldCheck,
  ShoppingBag, ExternalLink, Award, FileText, UtensilsCrossed,
  User, CheckCircle, FileCheck, Search, ChevronDown, Lock
} from 'lucide-react';
import { compressImage } from '@/lib/imageCompressor';
import { CATEGORY_CATALOG } from '@/lib/categoryMapping';
import { EXPLORE_CATEGORIES } from '@/lib/categories';

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const BOISAR_LOCALITIES = [
  'Boisar West',
  'Boisar East',
  'Tarapur MIDC',
  'Ostwal Empire',
  'Navapur Road',
  'Betegaon',
  'Palghar Road',
  'Katkar Pada',
  'Khamblale',
  'Other Boisar Area'
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM'
];

const formatDaysRangeLabel = (selectedDays: string[]): string => {
  const ordered = WEEK_DAYS.filter((d) => selectedDays.includes(d));
  if (ordered.length === 0) return '';
  if (ordered.length === 7) return 'All 7 Days';
  if (ordered.length === 6 && !ordered.includes('Sun')) return 'Mon - Sat';
  if (ordered.length === 5 && !ordered.includes('Sat') && !ordered.includes('Sun')) return 'Mon - Fri';
  return ordered.join(', ');
};

interface BusinessRegistrationWizardProps {
  onSuccess?: (business: any) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function BusinessRegistrationWizard({
  onSuccess,
  onCancel,
  isModal = false
}: BusinessRegistrationWizardProps) {
  const { loggedInUser, login, showToast, checkBusinessStatus, setHasRegisteredBusiness } = useApp();

  // Wizard Step: 1 of 4, 2 of 4, 3 of 4, 4 of 4
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: Business Name & Address Details
  const [bizName, setBizName] = useState('');
  const [shopPlotNo, setShopPlotNo] = useState('');
  const [bldgName, setBldgName] = useState('');
  const [streetName, setStreetName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [locality, setLocality] = useState('Boisar West');
  const [pincode, setPincode] = useState('401501');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  // STEP 2: Contact Details
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Flags to prevent autofill / state resets from overwriting user deletions
  const [userEditedPhone, setUserEditedPhone] = useState(false);
  const [userEditedWhatsapp, setUserEditedWhatsapp] = useState(false);
  const [userEditedEmail, setUserEditedEmail] = useState(false);
  const [userEditedContactPerson, setUserEditedContactPerson] = useState(false);

  // STEP 3: Category, Timings & Photos
  const [category, setCategory] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const [newlyCreatedCategory, setNewlyCreatedCategory] = useState<string | null>(null);
  const categoryBoxRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const [openDays, setOpenDays] = useState<string[]>([...WEEK_DAYS]);
  const [openTime, setOpenTime] = useState('9:00 AM');
  const [closeTime, setCloseTime] = useState('9:00 PM');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryLimitNotice, setGalleryLimitNotice] = useState('');

  // STEP 4: Products/Services & Plan
  const [products, setProducts] = useState<{ name: string; price: string }[]>([]);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'Free' | 'Starter' | 'Pro'>('Free');

  // Submission & Error State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const registeredPhone = loggedInUser?.phone ? loggedInUser.phone.replace(/\D/g, '').slice(-10) : '';
  const isCallingNumberLocked = registeredPhone.length === 10;

  // Prefill contact details from logged-in user and keep Calling number locked to registered phone
  const hasPrefilledRef = useRef(false);
  useEffect(() => {
    if (registeredPhone.length === 10) {
      setPhone(registeredPhone);
      if (!userEditedWhatsapp && !whatsapp) {
        setWhatsapp(registeredPhone);
      }
    }
    if (loggedInUser && !hasPrefilledRef.current) {
      hasPrefilledRef.current = true;
      if (loggedInUser.name && !userEditedContactPerson) {
        setContactPerson(loggedInUser.name);
      }
      if (registeredPhone && !userEditedWhatsapp) {
        setWhatsapp(registeredPhone);
      }
      if (loggedInUser.email && !userEditedEmail) {
        setEmail(loggedInUser.email);
      }
    }
  }, [loggedInUser, registeredPhone, userEditedContactPerson, userEditedWhatsapp, userEditedEmail, whatsapp]);

  // Validation
  const validateStep1 = () => {
    if (!bizName.trim()) {
      setErrorMessage('Please enter your Business or Shop name.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    if (!contactPerson.trim()) {
      setErrorMessage('Please enter the Owner or Manager name.');
      return false;
    }
    const cleanPhone = (isCallingNumberLocked ? registeredPhone : phone).replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Calling Phone Number.');
      return false;
    }
    const cleanWa = whatsapp.replace(/\D/g, '');
    if (whatsapp.trim() && cleanWa.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp Number (or leave blank).');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Load custom / live categories & handle outside clicks on category selector
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('majh_boisar_custom_categories') || '[]');
        if (Array.isArray(saved) && saved.length > 0) {
          setExtraCategories(saved.filter((c): c is string => typeof c === 'string' && c.trim().length > 0));
        }
      } catch {}
    }

    fetch('/api/businesses?summary=true')
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (Array.isArray(list)) {
          const dbCats = list
            .map((b: any) => (typeof b?.category === 'string' ? b.category.trim() : ''))
            .filter(Boolean);
          if (dbCats.length > 0) {
            setExtraCategories((prev) => Array.from(new Set([...prev, ...dbCats])));
          }
        }
      })
      .catch(() => {});

    const handleClickOutside = (e: MouseEvent) => {
      if (categoryBoxRef.current && !categoryBoxRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCategoryItems = useMemo(() => {
    const map = new Map<string, { name: string; parent?: string }>();
    for (const item of CATEGORY_CATALOG) {
      const clean = item.category.trim();
      const key = clean.toLowerCase();
      if (clean && !map.has(key)) {
        map.set(key, { name: clean, parent: item.parent });
      }
    }
    for (const name of [...EXPLORE_CATEGORIES, ...extraCategories]) {
      const clean = name.trim();
      const key = clean.toLowerCase();
      if (clean && !map.has(key)) {
        map.set(key, { name: clean, parent: extraCategories.includes(clean) ? 'Custom / Community' : 'Directory' });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [extraCategories]);

  const trimmedCatSearch = categorySearch.trim();
  const filteredCategoryItems = useMemo(() => {
    if (!trimmedCatSearch) return allCategoryItems;
    const q = trimmedCatSearch.toLowerCase();
    return allCategoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.parent && item.parent.toLowerCase().includes(q))
    );
  }, [allCategoryItems, trimmedCatSearch]);

  const hasExactCategoryMatch = useMemo(() => {
    if (!trimmedCatSearch) return true;
    const q = trimmedCatSearch.toLowerCase();
    return allCategoryItems.some((item) => item.name.toLowerCase() === q);
  }, [allCategoryItems, trimmedCatSearch]);

  const handleSelectCategory = (catName: string) => {
    setCategory(catName);
    setCategorySearch('');
    setCategoryDropdownOpen(false);
    setNewlyCreatedCategory(null);
    setErrorMessage('');
  };

  const handleCreateNewCategory = (rawName: string) => {
    const formatted = toTitleCase(rawName.trim());
    if (!formatted) return;
    setExtraCategories((prev) => {
      const next = Array.from(new Set([formatted, ...prev]));
      if (typeof window !== 'undefined') {
        try {
          const saved = JSON.parse(localStorage.getItem('majh_boisar_custom_categories') || '[]');
          const updated = Array.from(new Set([formatted, ...(Array.isArray(saved) ? saved : [])]));
          localStorage.setItem('majh_boisar_custom_categories', JSON.stringify(updated));
        } catch {}
      }
      return next;
    });
    setCategory(formatted);
    setNewlyCreatedCategory(formatted);
    setCategorySearch('');
    setCategoryDropdownOpen(false);
    setErrorMessage('');
  };

  const validateStep3 = () => {
    if (!category.trim()) {
      setErrorMessage('Please select a category or create a new one.');
      setCategoryDropdownOpen(true);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 3 && validateStep3()) {
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (onCancel) {
      onCancel();
    }
  };

  const maxGalleryPhotos = selectedPlan === 'Free' ? 5 : 20;

  // Storefront Image Upload Handler (1 single photo only)
  const handleStorefrontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFront(true);
    setErrorMessage('');

    try {
      const compressed = await compressImage(file, 1200, 1200, 0.8);
      setCoverPhoto(compressed);
    } catch (err) {
      console.error('Storefront photo upload error:', err);
      setErrorMessage('Could not process storefront photo. Please choose a JPG/PNG under 5MB.');
    } finally {
      setIsUploadingFront(false);
      e.target.value = '';
    }
  };

  // Gallery Photos Upload Handler (strictly capped at 5 for Free tier)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = Math.max(0, maxGalleryPhotos - galleryPhotos.length);
    if (remainingSlots <= 0) {
      const msg = `Free plan allows maximum ${maxGalleryPhotos} gallery photos. Remove one to upload another.`;
      setGalleryLimitNotice(msg);
      showToast(msg, 'info', 4000);
      e.target.value = '';
      return;
    }

    setIsUploadingGallery(true);
    setErrorMessage('');
    setGalleryLimitNotice('');

    try {
      const selectedArray = Array.from(files);
      const filesToProcess = selectedArray.slice(0, remainingSlots);

      if (selectedArray.length > remainingSlots) {
        const notice = `Free plan limit is ${maxGalleryPhotos} gallery photos — only the first ${remainingSlots} photo${remainingSlots > 1 ? 's were' : ' was'} uploaded.`;
        setGalleryLimitNotice(notice);
        showToast(notice, 'info', 4500);
      }

      const uploadedBatch: string[] = [];
      for (let i = 0; i < filesToProcess.length; i++) {
        const compressed = await compressImage(filesToProcess[i], 1200, 1200, 0.8);
        uploadedBatch.push(compressed);
      }

      if (uploadedBatch.length > 0) {
        setGalleryPhotos((prev) => [...prev, ...uploadedBatch].slice(0, maxGalleryPhotos));
      }
    } catch (err) {
      console.error('Gallery photo upload error:', err);
      setErrorMessage('Could not process gallery photos. Please choose JPG/PNG under 5MB.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Add Product to catalog
  const handleAddProduct = () => {
    if (!prodName.trim()) return;
    setProducts((prev) => [...prev, { name: prodName.trim(), price: prodPrice.trim() }]);
    setProdName('');
    setProdPrice('');
  };

  // Final Submission Handler
  const handleSubmitBusiness = async () => {
    setSubmitting(true);
    setErrorMessage('');

    try {
      const addressParts = [
        shopPlotNo.trim(),
        bldgName.trim(),
        streetName.trim(),
        landmark.trim() ? `Near ${landmark.trim()}` : '',
        locality,
        `Boisar - ${pincode || '401501'}`
      ].filter(Boolean);
      const fullAddress = addressParts.join(', ');

      const chosenCategory = toTitleCase(category.trim());
      const closedDays = WEEK_DAYS.filter((d) => !openDays.includes(d));
      const daysLabel = formatDaysRangeLabel(openDays);
      const finalWorkingHours =
        openDays.length === 0
          ? 'Temporarily Closed'
          : `${daysLabel}: ${openTime} - ${closeTime}${closedDays.length > 0 ? ` | ${closedDays.join(', ')} Closed` : ''}`;
      const finalCover = coverPhoto || '';
      const finalGallery = galleryPhotos.slice(0, maxGalleryPhotos);
      const finalCallingPhone = (isCallingNumberLocked ? registeredPhone : phone).replace(/\D/g, '').slice(-10);
      const finalWhatsapp = whatsapp.replace(/\D/g, '').slice(-10) || finalCallingPhone;

      const payload = {
        name: toTitleCase(bizName.trim()),
        category: chosenCategory,
        description: description.trim() || `${toTitleCase(bizName.trim())} - Trusted local business in ${locality}, Boisar.`,
        address: fullAddress,
        location: locality,
        phone: finalCallingPhone,
        whatsapp: finalWhatsapp,
        email: email.trim() || undefined,
        workingHours: finalWorkingHours,
        image: finalCover,
        gallery: finalGallery,
        rating: 5.0,
        reviewsCount: 1,
        featured: selectedPlan !== 'Free',
        subscription: selectedPlan,
        catalog: products.length > 0 ? products : undefined,
        ownerPhone: finalCallingPhone,
        contactPerson: contactPerson.trim()
      };

      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to register business. Please verify your details.');
      }

      const created = await res.json();

      // Ensure user session & business status is immediately synced
      const cleanPhone = finalCallingPhone;
      login(contactPerson.trim() || bizName.trim(), cleanPhone, email.trim() || undefined);
      setHasRegisteredBusiness(true);
      await checkBusinessStatus(cleanPhone);

      // Save local ownership ID for instant recognition
      if (typeof window !== 'undefined' && created?.id) {
        try {
          const key = `majh_boisar_my_biz_ids_${cleanPhone}`;
          const currentIds = JSON.parse(localStorage.getItem(key) || '[]');
          if (!currentIds.includes(created.id)) {
            localStorage.setItem(key, JSON.stringify([...currentIds, created.id]));
          }
        } catch (_) {}
      }

      showToast(`🎉 Congratulations! "${bizName.trim()}" is now registered!`, 'success', 5000);

      if (onSuccess) {
        onSuccess(created);
      } else if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Registration failed. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Progress Calculations for Mobile Header
  const progressPercent = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const stepMeta = [
    {
      number: 1,
      title: 'Business information',
      subtitle: 'Name, location and address',
      icon: Building
    },
    {
      number: 2,
      title: 'Owner & contact details',
      subtitle: 'Calling and WhatsApp numbers',
      icon: User
    },
    {
      number: 3,
      title: 'Category & operational details',
      subtitle: 'Timings, photos and specialties',
      icon: Camera
    },
    {
      number: 4,
      title: 'Catalog & launch contract',
      subtitle: 'Free directory listing & publish',
      icon: FileCheck
    }
  ];

  return (
    <div className={`w-full ${isModal ? 'max-w-5xl' : 'max-w-6xl xl:max-w-7xl'} mx-auto px-3 sm:px-6 py-4 sm:py-8`}>
      
      {/* ======================================================== */}
      {/* MOBILE-ONLY TOP HEADER BAR                              */}
      {/* ======================================================== */}
      <div className="flex lg:hidden items-center justify-between pb-3 sm:pb-4 border-b border-slate-200/80 mb-5 sm:mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-800 hover:text-blue-700 transition-colors font-bold text-sm sm:text-base cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:text-blue-600" />
          </div>
          <span className="capitalize">{stepMeta[step - 1].title}</span>
        </button>

        {/* Circular Step Pill (e.g. "1 of 4") */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-2xs">
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="10"
                cy="10"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="10"
                cy="10"
                r={radius}
                className="stroke-emerald-500 transition-all duration-300"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs font-black text-slate-800 tracking-wide">
            {step} of 4
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP TWO-COLUMN LAYOUT (Zomato Partner Style)         */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 xl:gap-9 items-start">
        
        {/* LEFT SIDEBAR: Stepper Timeline (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-4 sticky top-6 space-y-4">
          
          {/* Main Stepper Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-5">
              Complete your registration
            </h3>

            <div className="relative space-y-7">
              {/* Vertical timeline connecting line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-200 -z-0" />

              {stepMeta.map((s, index) => {
                const isCurrent = step === s.number;
                const isPast = step > s.number;
                const IconComp = s.icon;

                return (
                  <div key={s.number} className="relative z-10 flex items-start gap-3.5 group">
                    {/* Circle icon / step badge */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isCurrent
                          ? 'border-2 border-blue-500 bg-blue-50 text-blue-600 shadow-sm ring-4 ring-blue-50'
                          : isPast
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <IconComp className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4
                          className={`text-sm font-extrabold leading-snug truncate ${
                            isCurrent
                              ? 'text-slate-900 font-black'
                              : isPast
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {s.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight line-clamp-1">
                        {s.subtitle}
                      </p>

                      {/* Active "Continue ▸" pill button like in Zomato */}
                      {isCurrent && (
                        <div className="mt-2.5">
                          <span className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black px-3 py-1 rounded-lg shadow-2xs transition-all">
                            <span>{s.number === 4 ? 'Ready to Launch' : 'Continue'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Helper Box 1: Required Guidelines / Documents */}
          <div
            onClick={() => setShowDocsModal(true)}
            className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-4 shadow-2xs flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                Guidelines for registration
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          {/* Quick Helper Box 2: Referral Platform */}
          <div
            onClick={() => setShowReferralInput(!showReferralInput)}
            className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-2xl p-4 shadow-2xs flex items-center justify-between cursor-pointer transition-all"
          >
            <span className="text-xs font-bold text-slate-700">
              Did someone refer you to this platform?
            </span>
            <span className="text-xs font-black text-blue-600">
              {referralCode ? 'Applied' : 'Yes'}
            </span>
          </div>

          {showReferralInput && (
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-3.5 flex items-center gap-2 animate-in fade-in duration-150">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Enter agent code / mobile"
                className="flex-1 h-10 px-3 rounded-xl border border-blue-200 bg-white text-xs font-bold text-slate-800 outline-none"
              />
              <span className="text-xs text-blue-700 font-bold shrink-0">Saved</span>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* RIGHT CONTENT COLUMN: Step Forms (Matching Zomato UI)    */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">

          {/* Big Header Title on Desktop (like "Restaurant information") */}
          <div className="hidden lg:block">
            <h1 className="text-2xl xl:text-3xl font-black text-slate-900 tracking-tight">
              {stepMeta[step - 1].title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === 1 && 'Enter your business name and complete address details for Boisar directory.'}
              {step === 2 && 'Majh Boisar will use these details for customer inquiries, verified calls, and WhatsApp leads.'}
              {step === 3 && 'Help local customers discover your products, operating timings, and photos.'}
              {step === 4 && 'Add your top services, review your free package, and publish your business live.'}
            </p>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-700 font-bold flex items-center gap-3 animate-shake shadow-xs">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: BUSINESS INFORMATION & ADDRESS DETAILS           */}
          {/* ======================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Card 1: Business Name */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      Business name
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Customers will see this name on Majh Boisar directory
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGuidelines(!showGuidelines)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Guidelines</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder="Restaurant / Business / Shop name*"
                    className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                  />

                  {/* Guidelines Box */}
                  {showGuidelines && (
                    <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-900 space-y-1.5 animate-in fade-in duration-150">
                      <div className="font-bold flex items-center gap-1.5 text-blue-950">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Business Name Guidelines:</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                        <li>Use the official name displayed on your shop signboard or GST certificate.</li>
                        <li>Do not include promotional offers, phone numbers, or discounts in the name.</li>
                        <li>Example: &quot;Nevada Family Restaurant&quot; instead of &quot;Nevada 50% Off Offer&quot;.</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Address Details */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Address details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Accurate address helps customers reach your location easily
                  </p>
                </div>

                <div className="space-y-3.5">
                  <input
                    type="text"
                    value={shopPlotNo}
                    onChange={(e) => setShopPlotNo(e.target.value)}
                    placeholder="Shop number, Floor / Plot No"
                    className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                  />

                  <input
                    type="text"
                    value={bldgName}
                    onChange={(e) => setBldgName(e.target.value)}
                    placeholder="Tower / Building name / Complex"
                    className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                  />

                  <input
                    type="text"
                    value={streetName}
                    onChange={(e) => setStreetName(e.target.value)}
                    placeholder="Street / Road / Galli name"
                    className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                  />

                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Landmark (e.g. Opposite Old Market)"
                    className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Boisar Locality / Area
                      </label>
                      <select
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full h-13 sm:h-14 px-3.5 rounded-2xl border border-slate-300 focus:border-blue-600 text-sm sm:text-base font-semibold text-slate-900 bg-white outline-none cursor-pointer"
                      >
                        {BOISAR_LOCALITIES.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">
                        Pincode
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="401501"
                        className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 text-sm sm:text-base font-semibold text-slate-900 bg-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Callout Info Banner */}
                  <div className="p-4 bg-teal-50/70 border border-teal-200/90 rounded-2xl text-xs sm:text-sm text-teal-950 flex items-start gap-3 mt-2">
                    <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Please ensure that this address is accurate and matches your signboard so customers in Boisar can easily locate your store or office.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: CONTACT DETAILS & OWNER INFORMATION             */}
          {/* ======================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Owner details
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Majh Boisar will use these details for customer inquiries, call leads, and WhatsApp chats
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Full name*
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      value={contactPerson}
                      onChange={(e) => {
                        setUserEditedContactPerson(true);
                        setContactPerson(e.target.value);
                      }}
                      placeholder="e.g. Ramesh Patel*"
                      className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Email address
                      </label>
                      <span className="text-[11px] text-slate-400 font-bold">(Optional)</span>
                    </div>
                    <input
                      type="email"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      value={email}
                      onChange={(e) => {
                        setUserEditedEmail(true);
                        setEmail(e.target.value);
                      }}
                      placeholder="e.g. business@gmail.com"
                      className="w-full h-13 sm:h-14 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                    />
                  </div>
                </div>

                {/* Calling Phone Number (Locked to Registered Login Number when signed in) */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      Phone number (Calling)*
                    </label>
                    {isCallingNumberLocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        Registered Number (Fixed)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Registered mobile number is used for calling
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
                      <span className="text-base">🇮🇳</span>
                      <span className="text-sm font-bold text-slate-700">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      readOnly={isCallingNumberLocked}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      inputMode="numeric"
                      value={isCallingNumberLocked ? registeredPhone : phone}
                      onChange={(e) => {
                        if (isCallingNumberLocked) return;
                        setUserEditedPhone(true);
                        setPhone(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="10-digit calling phone number*"
                      className={`w-full h-13 sm:h-14 pl-22 pr-24 rounded-2xl border text-sm sm:text-base font-bold font-mono transition-all shadow-2xs outline-none tracking-wider ${
                        isCallingNumberLocked
                          ? 'border-slate-200 bg-slate-100/80 text-slate-700 cursor-not-allowed'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-slate-900 placeholder-slate-400 bg-white'
                      }`}
                    />
                    {isCallingNumberLocked && (
                      <span className="absolute right-3.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* WhatsApp Number (Editable / Can be different from Calling number) */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      WhatsApp number
                    </label>
                    {(isCallingNumberLocked ? registeredPhone : phone) &&
                      whatsapp !== (isCallingNumberLocked ? registeredPhone : phone) && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserEditedWhatsapp(true);
                          setWhatsapp(isCallingNumberLocked ? registeredPhone : phone);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-extrabold cursor-pointer"
                      >
                        ⚡ Same as Calling
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
                      <span className="text-base">🇮🇳</span>
                      <span className="text-sm font-bold text-slate-700">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      inputMode="numeric"
                      value={whatsapp}
                      onChange={(e) => {
                        setUserEditedWhatsapp(true);
                        setWhatsapp(e.target.value.replace(/\D/g, ''));
                      }}
                      placeholder="10-digit WhatsApp number"
                      className="w-full h-13 sm:h-14 pl-22 pr-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-bold font-mono text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none tracking-wider"
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-600 flex items-start gap-3 mt-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Your contact information is verified and safe. Customers will reach your business directly without third-party commission.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: CATEGORY, TIMINGS & PHOTOS                      */}
          {/* ======================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Card 1: Category */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Business category*
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Search and select your category, or create a new one if it isn&apos;t listed
                  </p>
                </div>

                {/* Searchable & Creatable Category Combobox */}
                <div ref={categoryBoxRef} className="relative space-y-2.5">
                  {category && !categoryDropdownOpen ? (
                    <div
                      onClick={() => {
                        setCategoryDropdownOpen(true);
                        setTimeout(() => categoryInputRef.current?.focus(), 20);
                      }}
                      className="w-full min-h-[54px] px-4 py-3 rounded-2xl border-2 border-blue-500 bg-blue-50/40 flex items-center justify-between gap-3 cursor-pointer hover:bg-blue-50/70 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                            {category}
                          </div>
                          {newlyCreatedCategory === category && (
                            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                              New category created
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-extrabold text-blue-600 bg-white border border-blue-200 px-2.5 py-1 rounded-xl">
                          Change
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategory('');
                            setNewlyCreatedCategory(null);
                            setCategoryDropdownOpen(true);
                            setTimeout(() => categoryInputRef.current?.focus(), 20);
                          }}
                          className="w-7 h-7 rounded-full hover:bg-slate-200/70 text-slate-500 flex items-center justify-center cursor-pointer"
                          title="Clear selection"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-center">
                      <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                      <input
                        ref={categoryInputRef}
                        type="text"
                        autoComplete="off"
                        value={categorySearch}
                        onFocus={() => setCategoryDropdownOpen(true)}
                        onClick={() => setCategoryDropdownOpen(true)}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setCategoryDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && trimmedCatSearch.length >= 2) {
                            e.preventDefault();
                            if (hasExactCategoryMatch && filteredCategoryItems.length > 0) {
                              const exact = filteredCategoryItems.find(
                                (item) => item.name.toLowerCase() === trimmedCatSearch.toLowerCase()
                              );
                              if (exact) handleSelectCategory(exact.name);
                            } else {
                              handleCreateNewCategory(trimmedCatSearch);
                            }
                          }
                        }}
                        placeholder="Search or select category (e.g. Boutique, Cake Shop, Plumber)..."
                        className="w-full h-13 sm:h-14 pl-11 pr-11 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white transition-all shadow-2xs outline-none"
                      />
                      {categorySearch ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCategorySearch('');
                            categoryInputRef.current?.focus();
                          }}
                          className="absolute right-3.5 w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                          className="absolute right-3.5 w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Dropdown Panel */}
                  {categoryDropdownOpen && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-150 z-30">
                      {/* Create New Category Option when typed text doesn't exist */}
                      {trimmedCatSearch.length >= 2 && !hasExactCategoryMatch && (
                        <button
                          type="button"
                          onClick={() => handleCreateNewCategory(trimmedCatSearch)}
                          className="w-full px-4 py-3.5 bg-blue-50/90 hover:bg-blue-100/80 border-b border-blue-200/80 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                              <Plus className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-extrabold text-blue-950 truncate">
                                Create &quot;{toTitleCase(trimmedCatSearch)}&quot;
                              </div>
                              <div className="text-[11px] font-semibold text-blue-700">
                                Not in list? Add as new business category
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-black text-blue-700 bg-white border border-blue-200 px-2.5 py-1 rounded-lg shrink-0">
                            + New
                          </span>
                        </button>
                      )}

                      {/* Scrollable Category List */}
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {filteredCategoryItems.length > 0 ? (
                          filteredCategoryItems.map((item) => {
                            const isSelected = category.toLowerCase() === item.name.toLowerCase();
                            return (
                              <button
                                key={item.name}
                                type="button"
                                onClick={() => handleSelectCategory(item.name)}
                                className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-50 text-blue-800'
                                    : 'hover:bg-slate-50 text-slate-800'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="text-sm font-bold truncate">{item.name}</div>
                                  {item.parent && (
                                    <div className="text-[11px] text-slate-400 font-medium truncate">
                                      {item.parent}
                                    </div>
                                  )}
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-4 py-6 text-center text-xs sm:text-sm text-slate-500">
                            {trimmedCatSearch.length < 2
                              ? 'Type at least 2 letters to search or create a new category.'
                              : 'No matching category found — click Create above to add it!'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Operating Timings */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3.5">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Operating timings
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Pick your open days and shop hours in one place
                  </p>
                </div>

                {/* Open Days Selector */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Open Days
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOpenDays([...WEEK_DAYS])}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          openDays.length === 7
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Every Day
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          openDays.length === 6 && !openDays.includes('Sun')
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Mon - Sat
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          openDays.length === 5 && !openDays.includes('Sat') && !openDays.includes('Sun')
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Mon - Fri
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {WEEK_DAYS.map((day) => {
                      const isOpen = openDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setOpenDays((prev) =>
                              prev.includes(day)
                                ? prev.filter((d) => d !== day)
                                : [...prev, day]
                            );
                          }}
                          className={`py-2.5 sm:py-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isOpen
                              ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-2xs ring-1 ring-blue-500/20'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-extrabold">{day}</span>
                          <span className={`text-[9px] font-bold mt-0.5 ${isOpen ? 'text-blue-600' : 'text-slate-400'}`}>
                            {isOpen ? 'Open' : 'Off'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Open & Close Time Dropdowns */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
                        Opens at
                      </label>
                      <select
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className="w-full h-12 sm:h-13 px-3.5 rounded-2xl border border-slate-300 focus:border-blue-600 text-sm sm:text-base font-bold text-slate-900 bg-white outline-none cursor-pointer"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={`open-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-600 mb-1.5">
                        Closes at
                      </label>
                      <select
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className="w-full h-12 sm:h-13 px-3.5 rounded-2xl border border-slate-300 focus:border-blue-600 text-sm sm:text-base font-bold text-slate-900 bg-white outline-none cursor-pointer"
                      >
                        {TIME_SLOTS.map((t) => (
                          <option key={`close-${t}`} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 1-Tap Quick Time Slots */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">Quick set:</span>
                    {[
                      { open: '9:00 AM', close: '9:00 PM', label: '9 AM – 9 PM' },
                      { open: '10:00 AM', close: '8:00 PM', label: '10 AM – 8 PM' },
                      { open: '8:00 AM', close: '10:00 PM', label: '8 AM – 10 PM' },
                      { open: '10:00 AM', close: '10:00 PM', label: '10 AM – 10 PM' }
                    ].map((slot) => {
                      const isActive = openTime === slot.open && closeTime === slot.close;
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          onClick={() => {
                            setOpenTime(slot.open);
                            setCloseTime(slot.close);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Summary Preview */}
                <div className="pt-1">
                  <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-teal-950 leading-snug">
                      {openDays.length === 0
                        ? 'Temporarily Closed'
                        : `${formatDaysRangeLabel(openDays)}: ${openTime} - ${closeTime}${
                            WEEK_DAYS.some((d) => !openDays.includes(d))
                              ? ` • ${WEEK_DAYS.filter((d) => !openDays.includes(d)).join(', ')} Off`
                              : ''
                          }`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Storefront Photo & Gallery Upload (Separate) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-6">
                
                {/* Section 1: Storefront / Front Photo (1 Photo Only) */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900">
                        Storefront photo
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Your main shop signboard or front cover image shown on listing cards
                      </p>
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      1 Photo Only
                    </span>
                  </div>

                  {!coverPhoto ? (
                    <label className="block border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/20 hover:bg-blue-50/50 rounded-3xl p-6 text-center cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStorefrontUpload}
                        className="hidden"
                        disabled={isUploadingFront}
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-sm sm:text-base font-extrabold text-blue-900">
                          {isUploadingFront ? 'Uploading storefront photo...' : 'Tap to upload Storefront photo (1 image)'}
                        </span>
                        <span className="text-xs text-slate-400">
                          JPG or PNG under 5MB • Only 1 main cover photo
                        </span>
                      </div>
                    </label>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border-2 border-blue-600 bg-slate-100 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverPhoto} alt="Storefront Cover" className="w-full h-48 sm:h-56 object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-center justify-between gap-2">
                        <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                          Storefront Photo (Front)
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="bg-white/95 hover:bg-white text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-lg cursor-pointer shadow-xs transition-colors">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleStorefrontUpload}
                              className="hidden"
                              disabled={isUploadingFront}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setCoverPhoto('')}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-2.5 py-1.5 rounded-lg cursor-pointer shadow-xs transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Section 2: Gallery Photos (Separate, Max 5 for Free Tier) */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900">
                        Gallery photos
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Add interior, products, or service photos for customers to browse
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                        galleryPhotos.length >= maxGalleryPhotos
                          ? 'text-amber-800 bg-amber-50 border-amber-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      {galleryPhotos.length} / {maxGalleryPhotos} Photos (Free Tier)
                    </span>
                  </div>

                  {galleryLimitNotice && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{galleryLimitNotice}</span>
                    </div>
                  )}

                  {galleryPhotos.length < maxGalleryPhotos && (
                    <label className="block border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 rounded-3xl p-5 text-center cursor-pointer transition-all">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                        disabled={isUploadingGallery}
                      />
                      <div className="flex flex-col items-center justify-center space-y-1.5">
                        <div className="w-10 h-10 rounded-2xl bg-slate-200/70 text-slate-700 flex items-center justify-center">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-extrabold text-slate-800">
                          {isUploadingGallery
                            ? 'Uploading gallery photos...'
                            : `Tap to add gallery photos (${maxGalleryPhotos - galleryPhotos.length} left)`}
                        </span>
                        <span className="text-xs text-slate-400">
                          Free plan supports up to {maxGalleryPhotos} gallery photos (extra selections auto-capped at {maxGalleryPhotos})
                        </span>
                      </div>
                    </label>
                  )}

                  {/* Gallery Grid Previews */}
                  {galleryPhotos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
                      {galleryPhotos.map((img, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden aspect-square border border-slate-200 shadow-2xs group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-slate-900/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryPhotos((prev) => prev.filter((_, i) => i !== idx));
                              setGalleryLimitNotice('');
                            }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card 4: Description */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-3">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Business description
                </h2>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about your services, popular products, and experience..."
                  className="w-full p-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm font-semibold text-slate-900 bg-white outline-none resize-none"
                />
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: CATALOG & CHOOSE LISTING PLAN                   */}
          {/* ======================================================== */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Card 1: Top Products / Services */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Featured products or services (Optional)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Customers can see top items and prices directly on your listing
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && prodName.trim()) {
                        e.preventDefault();
                        handleAddProduct();
                      }
                    }}
                    placeholder="Item name (e.g. Special Thali / Haircut)"
                    className="w-full sm:flex-1 h-13 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white outline-none transition-all shrink-0"
                  />
                  <input
                    type="text"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && prodName.trim()) {
                        e.preventDefault();
                        handleAddProduct();
                      }
                    }}
                    placeholder="Price (₹)"
                    className="w-full sm:w-32 h-13 px-4 rounded-2xl border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 bg-white outline-none transition-all shrink-0"
                  />
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm cursor-pointer shrink-0 transition-colors"
                  >
                    + Add Item
                  </button>
                </div>

                {products.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {products.map((item, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                      >
                        <span>{item.name} {item.price ? `(₹${item.price})` : ''}</span>
                        <button
                          type="button"
                          onClick={() => setProducts((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 2: Listing Package */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Listing contract &amp; plan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Start 100% free with lifetime Boisar directory listing and verified badges
                  </p>
                </div>

                {/* Free Plan Card */}
                <div
                  onClick={() => setSelectedPlan('Free')}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                    selectedPlan === 'Free'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-emerald-600 bg-emerald-600 text-white text-xs shrink-0">
                        ✓
                      </span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-900">
                        Free Lifetime Listing
                      </span>
                    </div>
                    <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                      Recommended
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-700 pl-7">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Verified Boisar Directory Badge</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Direct Call &amp; WhatsApp Clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Business QR Code Standee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Full Owner Dashboard Access</span>
                    </div>
                  </div>
                </div>

                {/* Launch Notice */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-950 flex items-start gap-3 mt-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    By submitting, your business profile will be instantly created on Majh Boisar directory, search index, and category recommendations!
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* BOTTOM ACTION NAVIGATION BAR                             */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 sm:p-5 shadow-sm flex items-center gap-2.5 sm:gap-3 mb-14 lg:mb-0">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="h-13 sm:h-14 px-5 sm:px-6 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm sm:text-base transition-colors cursor-pointer shrink-0"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 h-13 sm:h-14 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitBusiness}
                disabled={submitting}
                className="flex-1 h-13 sm:h-14 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 whitespace-nowrap"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Submit &amp; Launch</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Guidelines / Document Requirements Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Registration Guidelines</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowDocsModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No mandatory documents:</strong> You can start with 100% Free Lifetime Listing without uploading paperwork.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Accurate Address:</strong> Ensure your Shop/Office number, Building, and Boisar area are correct.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Working Phone:</strong> Enter your active 10-digit mobile number to receive customer call leads and WhatsApp chats.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDocsModal(false)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              Got it, Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
