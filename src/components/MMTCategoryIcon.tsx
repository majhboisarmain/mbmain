'use client';

import React from 'react';

interface MMTCategoryIconProps {
  name: string;
  className?: string;
}

export default function MMTCategoryIcon({ name, className = 'w-10 h-10 sm:w-12 sm:h-12' }: MMTCategoryIconProps) {
  const lower = (name || '').toLowerCase().trim();

  // 1. LOANS & FINANCE (MakeMyTrip Style: Green banknote + gold coins with ₹)
  if (lower.includes('loan') || lower.includes('finance') || lower.includes('credit')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtLoanNote" x1="4" y1="12" x2="40" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="mmtLoanCoin" x1="22" y1="18" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
          <filter id="mmtLoanShadow" x="0" y="8" width="48" height="36" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#047857" floodOpacity="0.25" />
          </filter>
        </defs>
        {/* Background Banknote */}
        <g filter="url(#mmtLoanShadow)">
          <rect x="5" y="12" width="34" height="22" rx="4" fill="url(#mmtLoanNote)" />
          <rect x="7" y="14" width="30" height="18" rx="3" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6" />
          <circle cx="22" cy="23" r="5" fill="#065f46" opacity="0.4" />
          <circle cx="9" cy="16" r="1.5" fill="#a7f3d0" opacity="0.7" />
          <circle cx="35" cy="30" r="1.5" fill="#a7f3d0" opacity="0.7" />
        </g>
        {/* Foreground 3D Golden Coin with Rupee */}
        <circle cx="33" cy="28" r="11" fill="url(#mmtLoanCoin)" stroke="#fef3c7" strokeWidth="1.5" />
        <circle cx="33" cy="28" r="9" stroke="#b45309" strokeWidth="0.8" strokeDasharray="1.5 1.5" fill="none" opacity="0.7" />
        <text x="33" y="33" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="sans-serif">₹</text>
      </svg>
    );
  }

  // 2. PROTEIN (MakeMyTrip Style: Nutrition Shaker Bottle + Whey Tub with scoop)
  if (lower.includes('protein') || lower.includes('supplement') || lower.includes('nutrition')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtProteinTub" x1="6" y1="14" x2="28" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="mmtProteinGold" x1="8" y1="20" x2="26" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="mmtShaker" x1="28" y1="12" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {/* Black Whey Tub */}
        <rect x="7" y="16" width="22" height="24" rx="4" fill="url(#mmtProteinTub)" stroke="#334155" strokeWidth="1" />
        <rect x="9" y="12" width="18" height="5" rx="2" fill="#d97706" />
        {/* Golden Label on Tub */}
        <rect x="9" y="24" width="18" height="10" rx="2" fill="url(#mmtProteinGold)" />
        <text x="18" y="31.5" textAnchor="middle" fontSize="6" fontWeight="900" fill="#ffffff" letterSpacing="0.5">WHEY</text>
        {/* Protein Shaker Bottle */}
        <path d="M29 18 L32 38 C32 39.5 33 41 35 41 L37 41 C39 41 40 39.5 40 38 L43 18 Z" fill="url(#mmtShaker)" />
        {/* Shaker Cap */}
        <path d="M27 15 L45 15 C45 15 44 18 42 18 L30 18 C28 18 27 15 27 15 Z" fill="#1e293b" />
        <rect x="34" y="10" width="5" height="5" rx="2" fill="#f59e0b" />
        {/* Lightning Accent */}
        <path d="M35 22 L37 28 L35 28 L37 34 L33 27 L35 27 Z" fill="#ffffff" opacity="0.9" />
      </svg>
    );
  }

  // 3. WATER PURIFIER / RO SERVICE (MakeMyTrip Style: RO Water Dispenser + Pure Cyan Droplet)
  if (lower.includes('purifier') || lower.includes('ro filter') || lower.includes('water filter') || lower.includes('aquaguard') || lower.includes('ro service') || lower.includes('ro repair')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtWaterBody" x1="6" y1="8" x2="30" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="mmtWaterDrop" x1="26" y1="18" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        {/* Purifier Unit Body */}
        <rect x="8" y="10" width="22" height="30" rx="4" fill="url(#mmtWaterBody)" stroke="#94a3b8" strokeWidth="1.2" />
        <rect x="11" y="14" width="16" height="12" rx="2" fill="#0284c7" opacity="0.15" />
        <rect x="14" y="17" width="10" height="6" rx="1" fill="#0284c7" opacity="0.3" />
        {/* Chrome Tap */}
        <path d="M22 28 L27 28 L27 32" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        {/* LED Indicators */}
        <circle cx="12" cy="34" r="1.5" fill="#10b981" />
        <circle cx="16" cy="34" r="1.5" fill="#0284c7" />
        {/* Large Crystal Droplet */}
        <path d="M34 16 C34 16 42 27 42 32 C42 36.5 38.5 40 34 40 C29.5 40 26 36.5 26 32 C26 27 34 16 34 16 Z" fill="url(#mmtWaterDrop)" />
        <ellipse cx="32" cy="30" rx="2.5" ry="4" transform="rotate(-30 32 30)" fill="#ffffff" opacity="0.6" />
      </svg>
    );
  }

  // 4. GYMS & FITNESS (MakeMyTrip Style: Chrome Barbell + Crimson Red Weight Plates)
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtGymPlate" x1="4" y1="14" x2="16" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="mmtGymBar" x1="8" y1="21" x2="40" y2="27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e2e8f0" />
            <stop offset="0.5" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
        {/* Steel Bar */}
        <rect x="6" y="22" width="36" height="4" rx="2" fill="url(#mmtGymBar)" />
        {/* Center Grip */}
        <rect x="19" y="21" width="10" height="6" rx="1" fill="#334155" />
        <line x1="22" y1="21" x2="22" y2="27" stroke="#94a3b8" strokeWidth="0.8" />
        <line x1="25" y1="21" x2="25" y2="27" stroke="#94a3b8" strokeWidth="0.8" />
        {/* Left Heavy Plates */}
        <rect x="13" y="15" width="4" height="18" rx="2" fill="url(#mmtGymPlate)" stroke="#881337" strokeWidth="0.8" />
        <rect x="8" y="17" width="4" height="14" rx="2" fill="#1e293b" />
        {/* Right Heavy Plates */}
        <rect x="31" y="15" width="4" height="18" rx="2" fill="url(#mmtGymPlate)" stroke="#881337" strokeWidth="0.8" />
        <rect x="36" y="17" width="4" height="14" rx="2" fill="#1e293b" />
      </svg>
    );
  }

  // 5. EYE OPTICIANS (MakeMyTrip Style: Stylish Designer Spectacles with Reflective Lenses)
  if (lower.includes('optic') || lower.includes('eye') || lower.includes('spectacle') || lower.includes('chashma') || lower.includes('lens')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtLensGrad" x1="12" y1="18" x2="36" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {/* Left Lens with Gradient */}
        <rect x="6" y="18" width="15" height="14" rx="5" fill="url(#mmtLensGrad)" stroke="#0369a1" strokeWidth="2.5" />
        <path d="M8 22 L14 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Right Lens with Gradient */}
        <rect x="27" y="18" width="15" height="14" rx="5" fill="url(#mmtLensGrad)" stroke="#0369a1" strokeWidth="2.5" />
        <path d="M29 22 L35 20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Bridge */}
        <path d="M21 23 C23 20 25 20 27 23" stroke="#0369a1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Frame Arms */}
        <path d="M6 21 L2 19" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 21 L46 19" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. SCHOOLS & EDUCATION (MakeMyTrip Style: Indigo Mortarboard Cap + Stack of Books)
  if (lower.includes('school') || lower.includes('vidyalaya') || lower.includes('college') || lower.includes('institute') || lower.includes('academy')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCapGrad" x1="8" y1="12" x2="40" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        {/* Books stack at bottom */}
        <path d="M12 36 L36 36 L36 40 L12 40 Z" fill="#d97706" />
        <path d="M10 32 L38 32 L38 36 L10 36 Z" fill="#0284c7" />
        {/* Cap Diamond Top */}
        <path d="M24 12 L43 20 L24 28 L5 20 Z" fill="url(#mmtCapGrad)" stroke="#312e81" strokeWidth="1" />
        {/* Skull Cap base */}
        <path d="M14 24 L14 30 C14 34 34 34 34 30 L34 24" fill="#3730a3" />
        {/* Golden Tassel */}
        <circle cx="24" cy="20" r="2" fill="#fbbf24" />
        <path d="M24 20 L38 24 L39 32" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="39" cy="33" r="2" fill="#d97706" />
      </svg>
    );
  }

  // 7. DIGITAL PRINTING (MakeMyTrip Style: Color Digital Plotter with CMYK Print Roll)
  if (lower.includes('print') || lower.includes('radium') || lower.includes('banner') || lower.includes('flex') || lower.includes('xerox')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtPrintGrad" x1="8" y1="16" x2="40" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        {/* Printer Mainframe */}
        <rect x="7" y="16" width="34" height="16" rx="4" fill="url(#mmtPrintGrad)" stroke="#5b21b6" strokeWidth="1" />
        <rect x="13" y="10" width="22" height="8" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
        {/* Paper Slot */}
        <rect x="11" y="27" width="26" height="3" rx="1.5" fill="#1e1b4b" />
        {/* CMYK Banner Rolling Out */}
        <rect x="13" y="29" width="22" height="12" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
        {/* CMYK Color Bars */}
        <rect x="16" y="32" width="4" height="6" rx="1" fill="#06b6d4" />
        <rect x="21" y="32" width="4" height="6" rx="1" fill="#ec4899" />
        <rect x="26" y="32" width="4" height="6" rx="1" fill="#eab308" />
        {/* Power LED */}
        <circle cx="36" cy="21" r="1.5" fill="#22c55e" />
      </svg>
    );
  }

  // 8. JOBS & RECRUITMENT (MakeMyTrip Style: Royal Blue Leather Executive Briefcase)
  if (lower.includes('job') || lower.includes('placement') || lower.includes('recruitment') || lower.includes('career')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtBriefcase" x1="6" y1="16" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        {/* Leather Bag Body */}
        <rect x="6" y="18" width="36" height="24" rx="4" fill="url(#mmtBriefcase)" stroke="#1e40af" strokeWidth="1.2" />
        {/* Handle */}
        <path d="M18 18 L18 12 C18 10 30 10 30 12 L30 18" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Center Leather Clasp */}
        <path d="M6 24 L42 24" stroke="#1e40af" strokeWidth="1.2" />
        <rect x="21" y="21" width="6" height="7" rx="1.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        {/* Chrome Corner Protectors */}
        <rect x="8" y="38" width="5" height="3" rx="1" fill="#93c5fd" />
        <rect x="35" y="38" width="5" height="3" rx="1" fill="#93c5fd" />
      </svg>
    );
  }

  // 9. DANCE CLASSES (MakeMyTrip Style: Vibrant Magenta Dancer + Golden Stars)
  if (lower.includes('dance')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtDanceGrad" x1="12" y1="8" x2="36" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="1" stopColor="#be185d" />
          </linearGradient>
        </defs>
        {/* Dynamic Dancer Silhouette */}
        <circle cx="25" cy="11" r="4.5" fill="url(#mmtDanceGrad)" />
        <path d="M25 16 C22 20 18 24 11 23 C14 26 19 26 23 23 L24 30 L16 39 L20 41 L27 34 L34 40 L37 38 L30 28 C34 26 39 24 40 18 C36 21 31 22 28 20 Z" fill="url(#mmtDanceGrad)" />
        {/* Sparkling Stars */}
        <path d="M10 12 L11 15 L14 16 L11 17 L10 20 L9 17 L6 16 L9 15 Z" fill="#fbbf24" />
        <path d="M38 10 L39 12 L41 13 L39 14 L38 16 L37 14 L35 13 L37 12 Z" fill="#fbbf24" />
      </svg>
    );
  }

  // 10. FOOTWEAR (MakeMyTrip Style: Vibrant Athletic Sneaker with Stripes)
  if (lower.includes('footwear') || lower.includes('shoe') || lower.includes('sandal') || lower.includes('chappal')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtShoeGrad" x1="6" y1="18" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f97316" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        {/* Shoe Sole (White Rubber Base) */}
        <path d="M5 33 C5 33 12 36 24 36 C36 36 43 33 43 33 C43 37 39 39 24 39 C9 39 5 37 5 33 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
        {/* Shoe Main Upper */}
        <path d="M7 32 C6 28 9 24 14 24 L22 24 L29 17 C32 17 35 18 36 22 L40 28 C42 30 43 32 43 33 L5 33 Z" fill="url(#mmtShoeGrad)" />
        {/* White Sport Stripes */}
        <path d="M19 32 L26 23" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M23 32 L30 23" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Shoe Collar & Laces */}
        <ellipse cx="26" cy="18" rx="4" ry="2" fill="#1e293b" />
        <circle cx="28" cy="22" r="1" fill="#ffffff" />
        <circle cx="31" cy="24" r="1" fill="#ffffff" />
      </svg>
    );
  }

  // 11. ACCOUNTING SOFTWARE DEALERS (MakeMyTrip Style: Indigo Calculator + Invoice Sheet)
  if (lower.includes('software') || lower.includes('accounting') || lower.includes('tally') || lower.includes('billing') || lower.includes('erp')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCalcGrad" x1="6" y1="10" x2="36" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f46e5" />
            <stop offset="1" stopColor="#3730a3" />
          </linearGradient>
        </defs>
        {/* Calculator Body */}
        <rect x="8" y="10" width="24" height="32" rx="4" fill="url(#mmtCalcGrad)" stroke="#312e81" strokeWidth="1" />
        {/* Digital Screen */}
        <rect x="12" y="14" width="16" height="7" rx="1.5" fill="#a5f3fc" />
        <text x="25" y="19.5" textAnchor="end" fontSize="5.5" fontWeight="900" fill="#0e7490" fontFamily="monospace">12,480</text>
        {/* Keypad */}
        <circle cx="14" cy="25" r="1.8" fill="#e0e7ff" />
        <circle cx="20" cy="25" r="1.8" fill="#e0e7ff" />
        <circle cx="26" cy="25" r="1.8" fill="#e0e7ff" />
        <circle cx="14" cy="30" r="1.8" fill="#e0e7ff" />
        <circle cx="20" cy="30" r="1.8" fill="#e0e7ff" />
        <circle cx="26" cy="30" r="1.8" fill="#e0e7ff" />
        <circle cx="14" cy="35" r="1.8" fill="#e0e7ff" />
        <circle cx="20" cy="35" r="1.8" fill="#e0e7ff" />
        <circle cx="26" cy="35" r="1.8" fill="#22c55e" />
        {/* Floating GST / Tax Document */}
        <rect x="25" y="20" width="16" height="20" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <line x1="28" y1="24" x2="37" y2="24" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28" y1="28" x2="35" y2="28" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="28" y1="32" x2="38" y2="32" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="35" cy="36" r="2" fill="#10b981" />
      </svg>
    );
  }

  // 12. MUSIC CLASSES (MakeMyTrip Style: Acoustic Guitar + Purple Musical Notes)
  if (lower.includes('music') || lower.includes('singing') || lower.includes('guitar')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtGuitarBody" x1="8" y1="18" x2="32" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
        {/* Guitar Body */}
        <path d="M12 28 C9 34 14 42 22 41 C28 40 29 35 25 32 C28 29 28 25 24 23 C18 21 14 23 12 28 Z" fill="url(#mmtGuitarBody)" stroke="#78350f" strokeWidth="1" />
        <circle cx="20" cy="31" r="3" fill="#451a03" />
        {/* Guitar Neck */}
        <rect x="22" y="11" width="3" height="15" transform="rotate(-35 22 11)" fill="#d97706" />
        <rect x="30" y="7" width="5" height="4" transform="rotate(-35 30 7)" fill="#78350f" />
        {/* Floating Musical Notes */}
        <path d="M36 18 L36 12 L44 10 L44 16 M36 14 L44 12" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="34" cy="19" r="2.5" fill="#8b5cf6" />
        <circle cx="42" cy="17" r="2.5" fill="#8b5cf6" />
      </svg>
    );
  }

  // 13. SALONS & BEAUTY (MakeMyTrip Style: Rose Gold Scissors + Salon Comb)
  if (lower.includes('salon') || lower.includes('parlour') || lower.includes('beauty') || lower.includes('haircut')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtSalonGrad" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
        </defs>
        {/* Comb in background */}
        <rect x="8" y="12" width="6" height="26" rx="2" fill="#334155" />
        <line x1="14" y1="16" x2="20" y2="16" stroke="#334155" strokeWidth="1.5" />
        <line x1="14" y1="20" x2="20" y2="20" stroke="#334155" strokeWidth="1.5" />
        <line x1="14" y1="24" x2="20" y2="24" stroke="#334155" strokeWidth="1.5" />
        <line x1="14" y1="28" x2="20" y2="28" stroke="#334155" strokeWidth="1.5" />
        <line x1="14" y1="32" x2="20" y2="32" stroke="#334155" strokeWidth="1.5" />
        {/* Salon Scissor Blades */}
        <path d="M18 10 L34 32" stroke="url(#mmtSalonGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M34 10 L18 32" stroke="url(#mmtSalonGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="26" cy="21" r="2" fill="#fbbf24" />
        {/* Scissor Finger Loops */}
        <circle cx="16" cy="35" r="4.5" stroke="url(#mmtSalonGrad)" strokeWidth="2.5" fill="none" />
        <circle cx="36" cy="35" r="4.5" stroke="url(#mmtSalonGrad)" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  // 14. CLOTHING & FASHION (MakeMyTrip Style: Indigo Fashion Jacket on Hanger)
  if (lower.includes('cloth') || lower.includes('garment') || lower.includes('wear') || lower.includes('fashion') || lower.includes('boutique')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtClothGrad" x1="10" y1="18" x2="38" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        {/* Coat Hanger */}
        <path d="M24 10 C26 10 27 12 25 14 L24 16 L12 21 L36 21 Z" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Jacket / Blazer */}
        <path d="M12 21 L7 32 L13 33 L14 42 L34 42 L35 33 L41 32 L36 21 L29 23 L24 28 L19 23 Z" fill="url(#mmtClothGrad)" stroke="#312e81" strokeWidth="1" />
        {/* Lapels & Tie */}
        <path d="M19 23 L24 33 L29 23" stroke="#f1f5f9" strokeWidth="1.5" fill="none" />
        <path d="M23 27 L25 27 L24.5 32 Z" fill="#ef4444" />
      </svg>
    );
  }

  // 15. PHOTOGRAPHERS (MakeMyTrip Style: DSLR Camera with Coated Glass Lens)
  if (lower.includes('photo') || lower.includes('camera') || lower.includes('studio') || lower.includes('video')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCameraLens" x1="18" y1="20" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        {/* Camera Body */}
        <rect x="7" y="16" width="34" height="23" rx="4" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M17 16 L20 12 L28 12 L31 16 Z" fill="#1e293b" />
        {/* Flash & Red Sensor */}
        <rect x="11" y="19" width="4" height="3" rx="1" fill="#fbbf24" />
        <circle cx="36" cy="20" r="1.5" fill="#ef4444" />
        {/* Lens Barrel */}
        <circle cx="24" cy="27.5" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <circle cx="24" cy="27.5" r="6.5" fill="url(#mmtCameraLens)" />
        <circle cx="22" cy="25.5" r="2" fill="#ffffff" opacity="0.6" />
      </svg>
    );
  }

  // 16. TRAVELS & VEHICLE RENTALS (MakeMyTrip Style: Luxury Passenger Bus / Airplane)
  if (lower.includes('travel') || lower.includes('tour') || lower.includes('cab') || lower.includes('bus') || lower.includes('taxi')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtBusGrad" x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        {/* Luxury Volvo Bus (MakeMyTrip signature icon) */}
        <rect x="8" y="12" width="32" height="24" rx="4" fill="url(#mmtBusGrad)" stroke="#0369a1" strokeWidth="1.2" />
        <rect x="11" y="16" width="26" height="8" rx="2" fill="#e0f2fe" />
        <line x1="17" y1="16" x2="17" y2="24" stroke="#0284c7" strokeWidth="1" />
        <line x1="24" y1="16" x2="24" y2="24" stroke="#0284c7" strokeWidth="1" />
        <line x1="31" y1="16" x2="31" y2="24" stroke="#0284c7" strokeWidth="1" />
        {/* Headlights & Grille */}
        <circle cx="12" cy="29" r="2" fill="#fef08a" />
        <circle cx="36" cy="29" r="2" fill="#fef08a" />
        <line x1="18" y1="29" x2="30" y2="29" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Wheels */}
        <circle cx="14" cy="37" r="4" fill="#1e293b" />
        <circle cx="14" cy="37" r="1.5" fill="#94a3b8" />
        <circle cx="34" cy="37" r="4" fill="#1e293b" />
        <circle cx="34" cy="37" r="1.5" fill="#94a3b8" />
      </svg>
    );
  }

  // 17. MEDICAL STORES & PHARMACY (MakeMyTrip Style: Red Cross First Aid + Two-tone Capsule)
  if (lower.includes('medical') || lower.includes('pharmacy') || lower.includes('chemist') || lower.includes('medicine')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtMedGrad" x1="6" y1="12" x2="30" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        {/* Medicine Box */}
        <rect x="7" y="12" width="24" height="26" rx="4" fill="url(#mmtMedGrad)" stroke="#cbd5e1" strokeWidth="1.2" />
        {/* Green Pharmacy Cross */}
        <rect x="16" y="18" width="6" height="14" rx="1.5" fill="#10b981" />
        <rect x="12" y="22" width="14" height="6" rx="1.5" fill="#10b981" />
        {/* Angled Two-Tone Capsule */}
        <g transform="rotate(-40 34 26)">
          <rect x="28" y="18" width="12" height="16" rx="6" fill="#ef4444" />
          <rect x="28" y="26" width="12" height="8" rx="0" fill="#f8fafc" />
          <path d="M28 26 L40 26" stroke="#94a3b8" strokeWidth="0.8" />
        </g>
      </svg>
    );
  }

  // 18. DOCTORS & SPECIALISTS (MakeMyTrip Style: Teal Stethoscope + Health Heart)
  if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('physician')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Stethoscope */}
        <path d="M14 10 L14 20 C14 26 22 28 24 28 C26 28 34 26 34 20 L34 10" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="14" cy="10" r="2" fill="#0f766e" />
        <circle cx="34" cy="10" r="2" fill="#0f766e" />
        <path d="M24 28 L24 35 C24 38 28 40 31 38 L32 37" stroke="#0d9488" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Chest Piece */}
        <circle cx="35" cy="35" r="4.5" fill="#e0f2fe" stroke="#0d9488" strokeWidth="2" />
        {/* Heart icon */}
        <path d="M24 16 C22 13 18 13 17 16 C16 19 24 24 24 24 C24 24 32 19 31 16 C30 13 26 13 24 16 Z" fill="#f43f5e" />
      </svg>
    );
  }

  // 19. HOSPITALS (MakeMyTrip Style: Medical Center Building with Red Cross)
  if (lower.includes('hospital') || lower.includes('emergency') || lower.includes('nursing home')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtHospGrad" x1="10" y1="10" x2="38" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        {/* Building Frame */}
        <rect x="9" y="10" width="30" height="30" rx="4" fill="url(#mmtHospGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Emergency Red Cross on top */}
        <rect x="21" y="14" width="6" height="10" rx="1" fill="#ef4444" />
        <rect x="19" y="16" width="10" height="6" rx="1" fill="#ef4444" />
        {/* Hospital Windows */}
        <rect x="13" y="27" width="5" height="5" rx="1" fill="#0284c7" />
        <rect x="21" y="27" width="6" height="13" rx="1" fill="#334155" />
        <rect x="30" y="27" width="5" height="5" rx="1" fill="#0284c7" />
      </svg>
    );
  }

  // 20. DENTISTS (MakeMyTrip Style: Brilliant Sparkle Dental Tooth)
  if (lower.includes('dentist') || lower.includes('dental') || lower.includes('teeth')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtToothGrad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f0fdfa" />
            <stop offset="1" stopColor="#ccfbf1" />
          </linearGradient>
        </defs>
        {/* Anatomical Molar Tooth */}
        <path d="M14 12 C10 16 8 22 10 26 C12 30 14 39 18 39 C21 39 22 33 24 30 C26 33 27 39 30 39 C34 39 36 30 38 26 C40 22 38 16 34 12 C30 8 26 10 24 10 C22 10 18 8 14 12 Z" fill="url(#mmtToothGrad)" stroke="#0d9488" strokeWidth="2" strokeLinejoin="round" />
        {/* Sparkle */}
        <path d="M33 14 L34 17 L37 18 L34 19 L33 22 L32 19 L29 18 L32 17 Z" fill="#06b6d4" />
      </svg>
    );
  }

  // 21. RESTAURANTS & FOOD (MakeMyTrip Style: Gourmet Silver Cloche + Fork & Spoon)
  if (lower.includes('restaurant') || lower.includes('dining') || lower.includes('food') || lower.includes('thali')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtFoodPlatter" x1="8" y1="14" x2="40" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ea580c" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        {/* Cloche Cover Dome */}
        <path d="M11 28 C11 18 17 14 24 14 C31 14 37 18 37 28 Z" fill="url(#mmtFoodPlatter)" stroke="#9a3412" strokeWidth="1.2" />
        <circle cx="24" cy="12" r="2.5" fill="#fbbf24" />
        {/* Serving Tray Platter */}
        <rect x="7" y="28" width="34" height="4" rx="2" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        {/* Steam Waves */}
        <path d="M19 8 C18 6 20 5 19 3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 7 C23 5 25 4 24 2" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M29 8 C28 6 30 5 29 3" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 22. CAFES & COFFEE (MakeMyTrip Style: Steaming Ceramic Cup with Latte Art)
  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('tea')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCoffeeCup" x1="10" y1="18" x2="34" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b45309" />
            <stop offset="1" stopColor="#78350f" />
          </linearGradient>
        </defs>
        {/* Coffee Cup */}
        <path d="M10 18 L32 18 C32 28 28 34 21 34 C14 34 10 28 10 18 Z" fill="url(#mmtCoffeeCup)" stroke="#451a03" strokeWidth="1.2" />
        {/* Cup Handle */}
        <path d="M30 20 C36 20 37 28 30 28" stroke="#b45309" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Saucer */}
        <ellipse cx="21" cy="36" rx="14" ry="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        {/* Aromatic Steam */}
        <path d="M16 13 C15 10 17 9 16 6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21 12 C20 9 22 8 21 5" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 13 C25 10 27 9 26 6" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 23. BAKERIES & CAKES (MakeMyTrip Style: Frosted Birthday Cake with Cherry)
  if (lower.includes('bakery') || lower.includes('baker') || lower.includes('cake') || lower.includes('pastry')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cake Base Layer */}
        <rect x="8" y="24" width="32" height="14" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        <path d="M8 28 Q12 32 16 28 Q20 32 24 28 Q28 32 32 28 Q36 32 40 28 L40 24 L8 24 Z" fill="#fef08a" />
        {/* Cake Top Tier */}
        <rect x="13" y="16" width="22" height="9" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        <path d="M13 19 Q16.5 22 20 19 Q23.5 22 27 19 Q30.5 22 35 19 L35 16 L13 16 Z" fill="#ffffff" />
        {/* Candle & Flame */}
        <rect x="23" y="11" width="2" height="5" fill="#38bdf8" />
        <circle cx="24" cy="9" r="2" fill="#ef4444" />
        <circle cx="24" cy="9" r="1" fill="#fef08a" />
      </svg>
    );
  }

  // 24. GROCERY & SUPERMARKET (MakeMyTrip Style: Green Supermarket Cart)
  if (lower.includes('grocery') || lower.includes('kirana') || lower.includes('supermarket') || lower.includes('mart')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCartGrad" x1="8" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* Trolley Basket */}
        <path d="M7 11 L12 11 L16 28 L36 28 L39 16 L14 16" stroke="url(#mmtCartGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Grid lines inside cart */}
        <line x1="18" y1="19" x2="35" y2="19" stroke="#10b981" strokeWidth="1.2" opacity="0.6" />
        <line x1="20" y1="23" x2="34" y2="23" stroke="#10b981" strokeWidth="1.2" opacity="0.6" />
        {/* Wheels */}
        <circle cx="18" cy="34" r="3" fill="#1e293b" />
        <circle cx="33" cy="34" r="3" fill="#1e293b" />
        {/* Apple inside */}
        <circle cx="26" cy="14" r="4" fill="#ef4444" />
        <path d="M26 10 C27 9 29 9 28 8" stroke="#15803d" strokeWidth="1" />
      </svg>
    );
  }

  // 25. REAL ESTATE & PROPERTIES (MakeMyTrip Style: Homestays & Villas icon)
  if (lower.includes('real estate') || lower.includes('property') || lower.includes('flat') || lower.includes('plot') || lower.includes('builder')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtVillaRoof" x1="8" y1="12" x2="40" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284c7" />
            <stop offset="1" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        {/* Modern Villa Pitched Roof (MakeMyTrip Homestays style) */}
        <path d="M6 22 L24 8 L42 22 L38 22 L24 11 L10 22 Z" fill="url(#mmtVillaRoof)" />
        {/* House Walls */}
        <rect x="10" y="22" width="28" height="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
        {/* Front Door */}
        <rect x="20" y="27" width="8" height="13" rx="1.5" fill="#b45309" />
        <circle cx="26" cy="34" r="1" fill="#fbbf24" />
        {/* Window */}
        <rect x="13" y="25" width="5" height="5" rx="1" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
        <rect x="30" y="25" width="5" height="5" rx="1" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      </svg>
    );
  }

  // 26. HOTELS (MakeMyTrip Style: 5-Star Hotel with Canopy Entrance)
  if (lower.includes('hotel') || lower.includes('lodge')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtHotelGrad" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Hotel Building */}
        <rect x="10" y="10" width="28" height="30" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Golden Hotel Sign */}
        <rect x="15" y="6" width="18" height="5" rx="1.5" fill="url(#mmtHotelGrad)" />
        <text x="24" y="10" textAnchor="middle" fontSize="4" fontWeight="900" fill="#ffffff">HOTEL</text>
        {/* Windows */}
        <rect x="14" y="14" width="4" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        <rect x="22" y="14" width="4" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        <rect x="30" y="14" width="4" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        <rect x="14" y="21" width="4" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        <rect x="22" y="21" width="4" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        <rect x="30" y="21" width="4" height="4" rx="1" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        {/* Canopy Entrance */}
        <path d="M18 32 L30 32 L32 35 L16 35 Z" fill="#ef4444" />
        <rect x="20" y="35" width="8" height="5" fill="#334155" />
      </svg>
    );
  }

  // 27. RESORTS (MakeMyTrip Style: Tropical Palm Beach Resort with Sun)
  if (lower.includes('resort') || lower.includes('villa')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtResortSun" x1="28" y1="6" x2="42" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {/* Tropical Sun */}
        <circle cx="34" cy="14" r="7" fill="url(#mmtResortSun)" />
        {/* Palm Tree */}
        <path d="M12 38 C14 26 20 18 25 14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M25 14 C20 12 14 14 12 16 M25 14 C23 10 20 8 16 8 M25 14 C27 9 30 9 33 11 M25 14 C28 12 32 15 32 18" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
        {/* Resort Cabana Hut */}
        <path d="M22 28 L38 28 L30 20 Z" fill="#d97706" />
        <rect x="24" y="28" width="12" height="10" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="28" y="31" width="4" height="7" fill="#1e293b" />
      </svg>
    );
  }

  // 28. ELECTRICIANS (MakeMyTrip Style: High Voltage Spark + Power Plug)
  if (lower.includes('electrician') || lower.includes('wiring') || lower.includes('electrical')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtZapGrad" x1="16" y1="6" x2="34" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Lightning Bolt */}
        <path d="M26 6 L12 24 L22 24 L18 42 L36 20 L24 20 Z" fill="url(#mmtZapGrad)" stroke="#b45309" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Spark highlights */}
        <circle cx="36" cy="12" r="2" fill="#fef08a" />
        <circle cx="10" cy="34" r="1.5" fill="#fef08a" />
      </svg>
    );
  }

  // 29. PLUMBERS (MakeMyTrip Style: Chrome Pipe + Red Pipe Wrench)
  if (lower.includes('plumber') || lower.includes('pipe') || lower.includes('sanitary')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Water Pipe */}
        <path d="M8 20 L24 20 L24 38" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="20" y="32" width="8" height="4" rx="1" fill="#0369a1" />
        {/* Red Plumber Wrench */}
        <g transform="rotate(35 24 24)">
          <rect x="18" y="10" width="6" height="26" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <path d="M16 10 L26 10 L26 16 L16 16 Z" fill="#475569" />
          <path d="M14 6 L22 6 L22 10 L14 10 Z" fill="#64748b" />
        </g>
        {/* Water Droplet */}
        <path d="M24 40 C24 40 27 43 27 45 C27 46.5 25.5 48 24 48 C22.5 48 21 46.5 21 45 C21 43 24 40 24 40 Z" fill="#38bdf8" />
      </svg>
    );
  }

  // 30. CARPENTERS (MakeMyTrip Style: Claw Hammer on Wood Planks)
  if (lower.includes('carpenter') || lower.includes('furniture') || lower.includes('wood')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wood Log Base */}
        <rect x="8" y="32" width="32" height="8" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
        <ellipse cx="40" cy="36" rx="2" ry="4" fill="#d97706" />
        {/* Hammer Handle */}
        <g transform="rotate(-40 24 24)">
          <rect x="22" y="14" width="4" height="24" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          {/* Steel Hammer Head */}
          <path d="M16 10 L32 10 C32 10 30 14 28 14 L20 14 C18 14 16 10 16 10 Z" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          <rect x="15" y="10" width="3" height="5" fill="#334155" />
        </g>
      </svg>
    );
  }

  // 31. PAINTERS (MakeMyTrip Style: Paint Roller with Dripping Teal Paint)
  if (lower.includes('paint') || lower.includes('whitewash')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Paint Roller Cylinder */}
        <rect x="12" y="10" width="22" height="9" rx="3" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.2" />
        {/* Metal Frame */}
        <path d="M34 14 L38 14 L38 24 L24 24 L24 38" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Wooden Handle */}
        <rect x="22" y="32" width="4" height="12" rx="2" fill="#d97706" />
        {/* Paint drips */}
        <circle cx="16" cy="22" r="2" fill="#8b5cf6" />
        <circle cx="20" cy="25" r="1.5" fill="#8b5cf6" />
      </svg>
    );
  }

  // 32. AC SERVICE (MakeMyTrip Style: Split AC Unit with Frosty Breeze)
  if (lower.includes('ac service') || lower.includes('air condition') || lower.includes('cooling')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Indoor AC Unit */}
        <rect x="6" y="12" width="36" height="16" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <rect x="8" y="24" width="32" height="3" fill="#0284c7" opacity="0.3" />
        <circle cx="37" cy="18" r="1.5" fill="#10b981" />
        {/* Cool Breeze Curves */}
        <path d="M12 32 C15 36 21 34 24 37" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M22 32 C25 36 31 34 34 37" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Snowflake */}
        <path d="M23 40 L23 44 M21 42 L25 42" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 33. PEST CONTROL (MakeMyTrip Style: Spray Shield & Disinfection)
  if (lower.includes('pest') || lower.includes('termite')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Safety Shield */}
        <path d="M24 8 L38 14 C38 26 31 35 24 40 C17 35 10 26 10 14 Z" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
        {/* Bug / Target Icon inside */}
        <circle cx="24" cy="24" r="6" fill="#065f46" />
        <path d="M24 18 L24 30 M18 24 L30 24 M20 20 L28 28 M20 28 L28 20" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 34. YOGA CLASSES (MakeMyTrip Style: Meditation Pose in Lotus Flower)
  if (lower.includes('yoga') || lower.includes('meditation')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtYogaGrad" x1="12" y1="10" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* Yogi Silhouette */}
        <circle cx="24" cy="12" r="3.5" fill="url(#mmtYogaGrad)" />
        <path d="M24 17 C21 21 16 26 16 31 C20 31 22 28 24 25 C26 28 28 31 32 31 C32 26 27 21 24 17 Z" fill="url(#mmtYogaGrad)" />
        {/* Blooming Lotus Petals */}
        <path d="M10 36 C16 33 22 35 24 39 C26 35 32 33 38 36 C34 40 26 42 24 42 C22 42 14 40 10 36 Z" fill="#f43f5e" opacity="0.85" />
      </svg>
    );
  }

  // 35. JEWELLERY (MakeMyTrip Style: Faceted Diamond Solitaire Gold Ring)
  if (lower.includes('jewel') || lower.includes('gold') || lower.includes('silver') || lower.includes('diamond')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtGoldRing" x1="14" y1="18" x2="34" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Golden Ring Band */}
        <circle cx="24" cy="28" r="11" stroke="url(#mmtGoldRing)" strokeWidth="3" fill="none" />
        {/* Sparkling Diamond Gem */}
        <path d="M19 15 L24 8 L29 15 L24 19 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
        <path d="M21 15 L27 15" stroke="#ffffff" strokeWidth="1" />
        {/* Sparkles */}
        <circle cx="15" cy="11" r="1.5" fill="#fbbf24" />
        <circle cx="33" cy="11" r="1.5" fill="#fbbf24" />
      </svg>
    );
  }

  // 36. MOBILE SHOPS (MakeMyTrip Style: Curved Smartphone with Colorful OLED Display)
  if (lower.includes('mobile') || lower.includes('smartphone') || lower.includes('phone')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtScreenGrad" x1="14" y1="12" x2="34" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* Phone Chassis */}
        <rect x="13" y="8" width="22" height="34" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        {/* Colorful Screen */}
        <rect x="15" y="11" width="18" height="28" rx="2" fill="url(#mmtScreenGrad)" />
        {/* Notch / Speaker */}
        <rect x="21" y="9" width="6" height="1.5" rx="0.75" fill="#475569" />
        {/* App Icons */}
        <circle cx="20" cy="18" r="2" fill="#facc15" />
        <circle cx="28" cy="18" r="2" fill="#ec4899" />
        <circle cx="20" cy="25" r="2" fill="#10b981" />
        <circle cx="28" cy="25" r="2" fill="#38bdf8" />
      </svg>
    );
  }

  // 37. COMPUTER REPAIR (MakeMyTrip Style: Laptop with Screen & Microchip)
  if (lower.includes('computer') || lower.includes('laptop')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Laptop Display */}
        <rect x="10" y="12" width="28" height="18" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
        <rect x="12" y="14" width="24" height="14" rx="1" fill="#0284c7" />
        {/* Code / Screen graphic */}
        <path d="M16 19 L19 21 L16 23 M23 23 L27 23" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        {/* Laptop Keyboard Base */}
        <path d="M6 30 L42 30 L40 35 L8 35 Z" fill="#64748b" stroke="#334155" strokeWidth="1" />
        <rect x="20" y="31" width="8" height="2" rx="0.5" fill="#94a3b8" />
      </svg>
    );
  }

  // 38. AUTO GARAGES (MakeMyTrip Style: Red Car with Mechanic Wrench)
  if (lower.includes('garage') || lower.includes('mechanic') || lower.includes('car repair')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sports Car Front */}
        <path d="M12 24 L16 16 L32 16 L36 24 L40 28 L8 28 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
        <rect x="8" y="27" width="32" height="8" rx="2" fill="#1e293b" />
        <rect x="18" y="18" width="12" height="6" rx="1" fill="#38bdf8" />
        <circle cx="12" cy="31" r="2" fill="#fef08a" />
        <circle cx="36" cy="31" r="2" fill="#fef08a" />
        {/* Crossed Service Wrench */}
        <g transform="rotate(25 24 24)">
          <path d="M22 6 L26 6 L26 14 L22 14 Z" fill="#94a3b8" />
          <path d="M20 6 C20 4 28 4 28 6 L26 9 L22 9 Z" fill="#64748b" />
        </g>
      </svg>
    );
  }

  // 39. INSURANCE (MakeMyTrip Style: Emerald Security Shield with Checkmark)
  if (lower.includes('insurance') || lower.includes('lic') || lower.includes('policy')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtShieldGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
        </defs>
        {/* Insurance Shield */}
        <path d="M24 8 L38 13 C38 27 28 37 24 40 C20 37 10 27 10 13 Z" fill="url(#mmtShieldGrad)" stroke="#065f46" strokeWidth="1.5" />
        {/* White Checkmark */}
        <path d="M17 23 L22 28 L31 18" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  // 40. CA CONSULTANTS & TAX (MakeMyTrip Style: Tax Ledger & Stamp)
  if (lower.includes('ca ') || lower.includes('chartered') || lower.includes('tax') || lower.includes('gst') || lower.includes('audit')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="28" height="34" rx="3" fill="#f8fafc" stroke="#0ea5e9" strokeWidth="1.5" />
        <rect x="14" y="14" width="20" height="4" rx="1" fill="#0ea5e9" />
        <line x1="14" y1="22" x2="34" y2="22" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="14" y1="27" x2="34" y2="27" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="14" y1="32" x2="26" y2="32" stroke="#94a3b8" strokeWidth="1.5" />
        {/* Official Verified Seal */}
        <circle cx="31" cy="32" r="4.5" fill="#ef4444" />
        <text x="31" y="34" textAnchor="middle" fontSize="5" fontWeight="900" fill="#ffffff">CA</text>
      </svg>
    );
  }

  // 41. LAWYERS & ADVOCATES (MakeMyTrip Style: Brass Scales of Justice)
  if (lower.includes('lawyer') || lower.includes('advocate') || lower.includes('legal') || lower.includes('court')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Scales Balance Pillar */}
        <rect x="23" y="10" width="2" height="26" fill="#475569" />
        <rect x="16" y="36" width="16" height="4" rx="1.5" fill="#334155" />
        <line x1="10" y1="14" x2="38" y2="14" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left Pan */}
        <path d="M10 14 L7 24 L17 24 Z" stroke="#d97706" strokeWidth="1" fill="#fef3c7" />
        {/* Right Pan */}
        <path d="M38 14 L35 24 L45 24 Z" stroke="#d97706" strokeWidth="1" fill="#fef3c7" />
      </svg>
    );
  }

  // 42. PATHOLOGY LABS (MakeMyTrip Style: Laboratory Blood Test Tubes)
  if (lower.includes('pathology') || lower.includes('diagnostic') || lower.includes('blood test') || lower.includes('lab')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Test Tube 1 (Red Blood) */}
        <rect x="14" y="12" width="6" height="22" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M14 24 L20 24 L20 31 C20 32.5 18.5 34 17 34 C15.5 34 14 32.5 14 31 Z" fill="#ef4444" />
        <rect x="13" y="10" width="8" height="3" rx="1" fill="#38bdf8" />
        {/* Test Tube 2 (Cyan Chemical) */}
        <rect x="26" y="12" width="6" height="22" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M26 20 L32 20 L32 31 C32 32.5 30.5 34 29 34 C27.5 34 26 32.5 26 31 Z" fill="#06b6d4" />
        <rect x="25" y="10" width="8" height="3" rx="1" fill="#f59e0b" />
        {/* Lab Stand */}
        <rect x="10" y="34" width="26" height="4" rx="2" fill="#334155" />
      </svg>
    );
  }

  // 43. COACHING CLASSES & TUITIONS
  if (lower.includes('coaching') || lower.includes('tuition') || lower.includes('tutor') || lower.includes('study class') || lower.includes('coaching classes')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCoachBoard" x1="8" y1="10" x2="40" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="mmtCoachCap" x1="22" y1="8" x2="42" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        {/* Blackboard */}
        <rect x="7" y="12" width="34" height="25" rx="3" fill="url(#mmtCoachBoard)" stroke="#b45309" strokeWidth="2" />
        {/* Board content */}
        <text x="12" y="24" fontSize="8" fontWeight="900" fill="#facc15" fontFamily="sans-serif">A+</text>
        <path d="M12 28 L23 28 M12 32 L19 32" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        {/* Graduation Mortarboard Badge */}
        <path d="M33 12 L43 17 L33 22 L23 17 Z" fill="url(#mmtCoachCap)" stroke="#312e81" strokeWidth="0.8" />
        <path d="M28 20 L28 25 C28 27.5 38 27.5 38 25 L38 20" fill="#3730a3" />
        <circle cx="33" cy="17" r="1.5" fill="#facc15" />
        <path d="M33 17 L40 21 L40 26" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Chalk ledge */}
        <rect x="14" y="38" width="8" height="2" rx="1" fill="#f8fafc" />
        <rect x="25" y="38" width="6" height="2" rx="1" fill="#38bdf8" />
      </svg>
    );
  }

  // 44. ELECTRONICS & HOME APPLIANCES
  if (lower.includes('electronic') || lower.includes('appliance') || lower.includes('gadget') || lower.includes('tv') || lower.includes('refrigerator')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtElecScreen" x1="8" y1="10" x2="38" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284c7" />
            <stop offset="1" stopColor="#0369a1" />
          </linearGradient>
        </defs>
        {/* Slim Smart TV */}
        <rect x="6" y="10" width="36" height="24" rx="2.5" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        <rect x="8" y="12" width="32" height="20" rx="1.5" fill="url(#mmtElecScreen)" />
        {/* TV Display Graphic - Vibrant wave */}
        <path d="M12 24 C16 16 20 28 24 20 C28 14 32 26 36 18" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="16" r="2.5" fill="#facc15" />
        {/* TV Stand Base */}
        <path d="M22 34 L26 34 L28 38 L20 38 Z" fill="#475569" />
        {/* Stereo Speaker with Sound Ring */}
        <circle cx="38" cy="34" r="5" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.2" />
        <circle cx="38" cy="34" r="2" fill="#0ea5e9" />
      </svg>
    );
  }

  // 45. HARDWARE & TOOLS
  if (lower.includes('hardware') || lower.includes('tool') || lower.includes('fastener') || lower.includes('fitting') || lower.includes('sanitaryware')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtHammerHead" x1="16" y1="8" x2="36" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#94a3b8" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
        </defs>
        {/* Claw Hammer */}
        <path d="M22 14 L34 8 L37 13 L31 18 Z" fill="url(#mmtHammerHead)" stroke="#334155" strokeWidth="1" />
        <path d="M26 14 L36 10 C38 9 40 11 39 14 L35 16 Z" fill="#64748b" />
        <rect x="18" y="16" width="5" height="22" rx="2" transform="rotate(-35 18 16)" fill="#ea580c" stroke="#9a3412" strokeWidth="0.8" />
        {/* Adjustable Wrench */}
        <g transform="rotate(35 24 24)">
          <rect x="22" y="10" width="4" height="24" rx="2" fill="#64748b" />
          <path d="M18 10 C18 6 23 5 25 7 L23 11 L25 14 C23 16 18 15 18 10 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />
          <rect x="22" y="26" width="4" height="8" rx="1.5" fill="#0284c7" />
        </g>
        {/* Golden Screw Bolt */}
        <circle cx="12" cy="36" r="3" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
        <line x1="10.5" y1="36" x2="13.5" y2="36" stroke="#78350f" strokeWidth="1" />
      </svg>
    );
  }

  // 46. INTERIOR DESIGNERS & DECOR
  if (lower.includes('interior') || lower.includes('designer') || lower.includes('decor') || lower.includes('furnishing') || lower.includes('wallpaper')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtSofaGrad" x1="10" y1="20" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#4338ca" />
          </linearGradient>
          <linearGradient id="mmtLampGlow" x1="28" y1="8" x2="42" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Floor Lamp */}
        <path d="M33 10 L41 10 L43 17 L31 17 Z" fill="url(#mmtLampGlow)" />
        <line x1="37" y1="17" x2="37" y2="38" stroke="#475569" strokeWidth="1.5" />
        <ellipse cx="37" cy="38" rx="4" ry="1.5" fill="#334155" />
        {/* Designer Modern Sofa */}
        <rect x="8" y="24" width="26" height="12" rx="3" fill="url(#mmtSofaGrad)" stroke="#312e81" strokeWidth="1" />
        <rect x="6" y="26" width="4" height="9" rx="2" fill="#4f46e5" />
        <rect x="30" y="26" width="4" height="9" rx="2" fill="#4f46e5" />
        <rect x="10" y="22" width="22" height="6" rx="2" fill="#4338ca" />
        {/* Sofa Pillows */}
        <circle cx="14" cy="27" r="3" fill="#f43f5e" />
        <circle cx="26" cy="27" r="3" fill="#38bdf8" />
        {/* Wooden Legs */}
        <line x1="10" y1="36" x2="8" y2="40" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="36" x2="32" y2="40" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 47. FABRICATION & WELDING
  if (lower.includes('fabrication') || lower.includes('welding') || lower.includes('grill') || lower.includes('iron work') || lower.includes('steel fabrication')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtWeldMask" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#334155" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        {/* Welder Helmet */}
        <path d="M14 10 C14 8 34 8 34 10 L36 28 C36 34 30 38 24 38 C18 38 12 34 12 28 Z" fill="url(#mmtWeldMask)" stroke="#1e293b" strokeWidth="1.5" />
        {/* Dark Auto-Darkening Visor Screen */}
        <rect x="18" y="17" width="12" height="7" rx="1.5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
        {/* Welding Torch Tip */}
        <line x1="34" y1="32" x2="42" y2="40" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="30" x2="36" y2="34" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
        {/* Intense Golden Electric Sparks */}
        <circle cx="28" cy="28" r="2.5" fill="#fef08a" />
        <path d="M28 24 L29 27 L32 28 L29 29 L28 32 L27 29 L24 28 L27 27 Z" fill="#facc15" />
        <circle cx="23" cy="24" r="1.2" fill="#fbbf24" />
        <circle cx="33" cy="24" r="1.2" fill="#fbbf24" />
        <circle cx="26" cy="34" r="1" fill="#f97316" />
      </svg>
    );
  }

  // 48. CAR RENTALS & CAB HIRE
  if (lower.includes('car rental') || lower.includes('rent a car') || lower.includes('car hire') || lower.includes('rental') || lower.includes('self drive')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCarRentalGrad" x1="6" y1="18" x2="34" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" />
            <stop offset="1" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="mmtKeyGold" x1="28" y1="8" x2="44" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Rental Sedan Body */}
        <path d="M6 25 L11 18 L25 18 L29 25 L34 27 L34 33 L5 33 L5 27 Z" fill="url(#mmtCarRentalGrad)" stroke="#991b1b" strokeWidth="1" />
        {/* Car Windows */}
        <path d="M12 20 L24 20 L23 25 L9 25 Z" fill="#e0f2fe" opacity="0.9" />
        {/* Wheels */}
        <circle cx="11" cy="33" r="3.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="28" cy="33" r="3.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
        {/* Headlight */}
        <path d="M33 28 L35 28 L34 30 Z" fill="#fef08a" />
        {/* Golden Car Key with Keyring */}
        <circle cx="36" cy="14" r="5" stroke="url(#mmtKeyGold)" strokeWidth="2.5" fill="none" />
        <path d="M36 19 L36 30 L39 30 M36 24 L39 24" stroke="url(#mmtKeyGold)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 49. PACKERS & MOVERS
  if (lower.includes('packer') || lower.includes('mover') || lower.includes('relocation') || lower.includes('shifting')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtTruckBody" x1="6" y1="14" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="mmtBoxGrad" x1="28" y1="12" x2="42" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d97706" />
            <stop offset="1" stopColor="#b45309" />
          </linearGradient>
        </defs>
        {/* Cargo Box Van Body */}
        <rect x="5" y="14" width="22" height="19" rx="3" fill="url(#mmtTruckBody)" stroke="#065f46" strokeWidth="1.2" />
        {/* Driver Cabin */}
        <path d="M27 19 L34 19 L38 25 L38 33 L27 33 Z" fill="#059669" stroke="#065f46" strokeWidth="1.2" />
        <path d="M28 21 L33 21 L36 25 L28 25 Z" fill="#e0f2fe" />
        {/* Wheels */}
        <circle cx="11" cy="35" r="3.5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="33" cy="35" r="3.5" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
        {/* Cardboard Moving Box */}
        <rect x="27" y="9" width="13" height="10" rx="1.5" fill="url(#mmtBoxGrad)" stroke="#78350f" strokeWidth="0.8" />
        <path d="M33.5 9 L33.5 19 M27 13 L40 13" stroke="#fde68a" strokeWidth="1" strokeDasharray="1.5 1" />
      </svg>
    );
  }

  // 50. EVENT ORGANISERS & PARTY
  if (lower.includes('event') || lower.includes('organiser') || lower.includes('organizer') || lower.includes('party') || lower.includes('celebration') || lower.includes('wedding planner')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtBalloonPink" x1="10" y1="8" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f43f5e" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="mmtBalloonBlue" x1="22" y1="8" x2="36" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        {/* Left Balloon */}
        <ellipse cx="17" cy="18" rx="8" ry="10" fill="url(#mmtBalloonPink)" />
        <ellipse cx="14" cy="15" rx="2" ry="3" fill="#ffffff" opacity="0.6" />
        <path d="M17 28 L15 38" stroke="#f43f5e" strokeWidth="1.2" fill="none" />
        {/* Right Balloon */}
        <ellipse cx="30" cy="16" rx="8" ry="10" fill="url(#mmtBalloonBlue)" />
        <ellipse cx="27" cy="13" rx="2" ry="3" fill="#ffffff" opacity="0.6" />
        <path d="M30 26 L32 38" stroke="#0284c7" strokeWidth="1.2" fill="none" />
        {/* Golden Celebration Ticket */}
        <rect x="14" y="28" width="22" height="11" rx="2" fill="#facc15" stroke="#d97706" strokeWidth="1" />
        <circle cx="14" cy="33.5" r="2" fill="#ffffff" />
        <circle cx="36" cy="33.5" r="2" fill="#ffffff" />
        <text x="25" y="36" textAnchor="middle" fontSize="6" fontWeight="900" fill="#78350f">VIP</text>
      </svg>
    );
  }

  // 51. CATERING & FOOD SERVICES
  if (lower.includes('catering') || lower.includes('caterer') || lower.includes('halwai') || lower.includes('buffet')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtCloche" x1="10" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="0.5" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="mmtPlatterGold" x1="4" y1="32" x2="44" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        {/* Cloche Dome Handle */}
        <circle cx="24" cy="14" r="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        {/* Silver Food Cloche Dome */}
        <path d="M10 32 C10 20 16 16 24 16 C32 16 38 20 38 32 Z" fill="url(#mmtCloche)" stroke="#64748b" strokeWidth="1.2" />
        <ellipse cx="20" cy="22" rx="3" ry="5" transform="rotate(-30 20 22)" fill="#ffffff" opacity="0.6" />
        {/* Golden Base Serving Platter Tray */}
        <rect x="5" y="32" width="38" height="5" rx="2.5" fill="url(#mmtPlatterGold)" stroke="#b45309" strokeWidth="1" />
        {/* Steaming Aroma */}
        <path d="M18 10 C18 7 21 8 21 5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M27 10 C27 7 30 8 30 5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 52. DIGITAL MARKETING & SEO
  if (lower.includes('digital marketing') || lower.includes('marketing') || lower.includes('seo') || lower.includes('advertising') || lower.includes('social media')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtRocketGrad" x1="14" y1="8" x2="34" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#6d28d9" />
          </linearGradient>
          <linearGradient id="mmtFireGrad" x1="20" y1="32" x2="28" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#facc15" />
            <stop offset="0.5" stopColor="#f97316" />
            <stop offset="1" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Ascending Rocket Body */}
        <path d="M24 6 C28 10 32 18 30 28 L18 28 C16 18 20 10 24 6 Z" fill="url(#mmtRocketGrad)" stroke="#4c1d95" strokeWidth="1" />
        {/* Rocket Glass Porthole Window */}
        <circle cx="24" cy="18" r="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <circle cx="23" cy="17" r="1.5" fill="#ffffff" opacity="0.8" />
        {/* Left & Right Booster Wings */}
        <path d="M18 24 L12 30 L18 30 Z" fill="#ef4444" />
        <path d="M30 24 L36 30 L30 30 Z" fill="#ef4444" />
        {/* Rocket Thrust Flame */}
        <path d="M20 28 Q24 42 24 42 Q24 42 28 28 Z" fill="url(#mmtFireGrad)" />
        {/* Growth Analytics Arrow */}
        <path d="M34 16 L40 10 M40 10 L35 10 M40 10 L40 15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 53. BABY CARE & DAYCARE
  if (lower.includes('baby') || lower.includes('creche') || lower.includes('daycare') || lower.includes('infant') || lower.includes('kindergarten')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtBabyPram" x1="8" y1="12" x2="36" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ec4899" />
            <stop offset="1" stopColor="#db2777" />
          </linearGradient>
        </defs>
        {/* Baby Stroller Carriage */}
        <path d="M12 26 C12 18 20 14 28 14 L28 26 Z" fill="url(#mmtBabyPram)" />
        <path d="M28 26 L10 26 C10 32 18 34 26 34 L28 34 Z" fill="#f472b6" />
        {/* Pram Handle */}
        <path d="M12 22 L8 16 C7 14 5 15 5 17" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Pram Wheels */}
        <circle cx="14" cy="37" r="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
        <circle cx="28" cy="37" r="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
        <circle cx="14" cy="37" r="1.5" fill="#f43f5e" />
        <circle cx="28" cy="37" r="1.5" fill="#f43f5e" />
        {/* Floating Milk Bottle */}
        <rect x="33" y="14" width="7" height="13" rx="2" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
        <rect x="34.5" y="11" width="4" height="3" rx="1" fill="#f59e0b" />
        <circle cx="36.5" cy="10" r="1.5" fill="#f97316" />
      </svg>
    );
  }

  // 54. SPA & WELLNESS
  if (lower.includes('spa') || lower.includes('wellness') || lower.includes('massage') || lower.includes('ayurveda') || lower.includes('aromatherapy')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtStoneGrad" x1="12" y1="20" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#475569" />
            <stop offset="1" stopColor="#1e293b" />
          </linearGradient>
        </defs>
        {/* Zen Hot Balancing Stones */}
        <ellipse cx="24" cy="38" rx="14" ry="4.5" fill="url(#mmtStoneGrad)" stroke="#0f172a" strokeWidth="1" />
        <ellipse cx="24" cy="30" rx="10" ry="3.8" fill="url(#mmtStoneGrad)" stroke="#0f172a" strokeWidth="1" />
        <ellipse cx="24" cy="23" rx="6.5" ry="3" fill="url(#mmtStoneGrad)" stroke="#0f172a" strokeWidth="1" />
        {/* Water Lily Lotus Flower on top */}
        <path d="M24 10 C21 15 16 18 16 21 C20 21 22 18 24 16 C26 18 28 21 32 21 C32 18 27 15 24 10 Z" fill="#f43f5e" />
        <path d="M24 12 C24 12 20 16 22 19 C23 18 24 16 24 12 Z" fill="#fbcfe8" />
        {/* Relaxing Aroma Swirls */}
        <circle cx="34" cy="14" r="1.5" fill="#38bdf8" />
        <circle cx="38" cy="18" r="1.2" fill="#38bdf8" />
      </svg>
    );
  }

  // 55. DAIRY PRODUCTS
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('paneer') || lower.includes('curd') || lower.includes('dahi') || lower.includes('ghee')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtMilkGlass" x1="8" y1="12" x2="26" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="mmtCheese" x1="22" y1="22" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Pure Fresh Milk Bottle */}
        <path d="M12 18 L12 37 C12 39 14 40 16 40 L22 40 C24 40 26 39 26 37 L26 18 L24 15 L24 12 L14 12 L14 15 Z" fill="url(#mmtMilkGlass)" stroke="#0284c7" strokeWidth="1.2" />
        <rect x="13" y="10" width="12" height="3" rx="1.5" fill="#0284c7" />
        {/* Milk Level */}
        <rect x="14" y="24" width="10" height="13" rx="1" fill="#38bdf8" opacity="0.3" />
        {/* Rich Cheese Wedge */}
        <path d="M24 38 L42 38 L42 27 L24 33 Z" fill="url(#mmtCheese)" stroke="#b45309" strokeWidth="1" />
        <path d="M24 33 L32 23 L42 27 Z" fill="#fde68a" stroke="#b45309" strokeWidth="1" />
        {/* Cheese holes */}
        <circle cx="34" cy="34" r="2" fill="#d97706" />
        <circle cx="38" cy="31" r="1.5" fill="#d97706" />
        <circle cx="30" cy="30" r="1" fill="#d97706" />
      </svg>
    );
  }

  // 56. MEAT, CHICKEN & POULTRY
  if (lower.includes('meat') || lower.includes('poultry') || lower.includes('chicken') || lower.includes('mutton') || lower.includes('butcher') || lower.includes('fish')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtDrumstick" x1="10" y1="14" x2="34" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ea580c" />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="mmtCleaver" x1="24" y1="10" x2="42" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
        </defs>
        {/* Roasted Chicken Drumstick */}
        <path d="M12 28 C9 22 14 16 22 16 C28 16 32 20 30 26 C28 30 22 34 16 32 Z" fill="url(#mmtDrumstick)" stroke="#9a3412" strokeWidth="1" />
        {/* Drumstick Bone */}
        <path d="M12 28 L7 33 C6 34 6 36 7 37 C8 38 10 38 11 37 L14 31" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="6" cy="35" r="1.5" fill="#e2e8f0" />
        {/* Butcher Cleaver Knife */}
        <path d="M26 12 L38 12 L40 24 L28 24 Z" fill="url(#mmtCleaver)" stroke="#334155" strokeWidth="1" />
        <circle cx="36" cy="15" r="1.5" fill="#0f172a" />
        <rect x="22" y="16" width="6" height="3" rx="1.5" fill="#b45309" />
      </svg>
    );
  }

  // 57. FRUITS & VEGETABLES
  if (lower.includes('fruit') || lower.includes('vegetable') || lower.includes('sabzi') || lower.includes('bhaji') || lower.includes('mandi')) {
    return (
      <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mmtApple" x1="12" y1="16" x2="28" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4444" />
            <stop offset="1" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="mmtCarrot" x1="24" y1="12" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f97316" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {/* Shiny Red Apple */}
        <circle cx="18" cy="28" r="9" fill="url(#mmtApple)" stroke="#b91c1c" strokeWidth="0.8" />
        <path d="M18 19 C18 16 20 14 22 13" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="22" cy="14" rx="2" ry="1.2" transform="rotate(-30 22 14)" fill="#22c55e" />
        {/* Fresh Orange Carrot */}
        <path d="M27 22 L38 37 C39 39 37 40 35 38 L25 27 Z" fill="url(#mmtCarrot)" stroke="#c2410c" strokeWidth="0.8" />
        {/* Carrot Green Foliage Top */}
        <path d="M24 23 L20 16 M26 21 L24 14 M27 24 L28 15" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Healthy Green Leaf */}
        <path d="M11 32 C6 30 7 24 12 25 C14 29 11 32 11 32 Z" fill="#22c55e" />
      </svg>
    );
  }

  // DEFAULT FALLBACK (MakeMyTrip Style: Royal Teal Badge with Star)
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mmtDefaultGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d9488" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="32" height="32" rx="8" fill="url(#mmtDefaultGrad)" stroke="#115e59" strokeWidth="1.5" />
      <path d="M24 14 L26.5 21 L34 21 L28 25.5 L30.5 33 L24 28.5 L17.5 33 L20 25.5 L14 21 L21.5 21 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
    </svg>
  );
}
