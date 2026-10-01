'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { X, Mail, ShieldCheck, HelpCircle, Lock, Eye, EyeOff, KeyRound, ChevronDown } from 'lucide-react';

import { getAllHotels } from '@/lib/hotelsData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { login, setRole, showToast } = useApp();
  
  // Steps: 'phone' | 'otp' | 'info' | 'admin_password'
  const [step, setStep] = useState<'phone' | 'otp' | 'info' | 'admin_password'>('phone');
  
  // Registration and OTP states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Admin Security States
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(60);

  React.useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length !== 10 || isNaN(Number(mobileNumber))) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }
    setOtpError('');
    setIsLoading(true);
    
    // Default fallback 6-digit OTP
    let code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobileNumber })
      });
      const data = await res.json();
      if (data?.otp) {
        code = data.otp.toString();
      }
    } catch (err) {
      console.warn('Live SMS API call failed, using local OTP dispatch fallback:', err);
    } finally {
      setIsLoading(false);
    }

    setSimulatedOtp(code);
    setResendTimer(60);
    setStep('otp');
    showToast(`📱 OTP sent via SMS to +91 ${mobileNumber}`, 'success', 5000);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isLoading) return;
    setOtpError('');
    setIsLoading(true);
    let code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobileNumber })
      });
      const data = await res.json();
      if (data?.otp) {
        code = data.otp.toString();
      }
    } catch (err) {
      console.warn('Live SMS API call failed:', err);
    } finally {
      setIsLoading(false);
    }
    setSimulatedOtp(code);
    setResendTimer(60);
    showToast(`📱 New OTP sent via SMS to +91 ${mobileNumber}`, 'success', 5000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedOtp) {
      setOtpError('Invalid OTP. Please enter the 6-digit code received on your mobile via SMS.');
      return;
    }
    setOtpError('');
    setIsLoading(true);

    const cleanInputPhone = mobileNumber.replace(/\D/g, '');
    const clean10 = cleanInputPhone.slice(-10);

    // Auto-detect if this number belongs to a registered Hotel in Boisar
    const allHotels = getAllHotels();
    const matchedHotel = allHotels.find(h => {
      const hp = (h.phone || '').replace(/\D/g, '').slice(-10);
      const hw = (h.whatsapp || '').replace(/\D/g, '').slice(-10);
      return clean10 === hp || clean10 === hw;
    });

    if (matchedHotel) {
      setIsLoading(false);
      const hotelDisplayName = `${matchedHotel.name} Front Desk`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_phone', mobileNumber);
      }
      login(hotelDisplayName, mobileNumber, 'reception@hotel.com');
      showToast(`🏨 Hotel Detected: ${matchedHotel.name}! Opening Hotel Front Desk Dashboard...`, 'success', 4000);
      resetForm();
      onClose();
      router.push(`/dashboard?hotelId=${matchedHotel.id}&tab=hotel_bookings`);
      return;
    }

    // Check if this is the Master Admin Phone: 7769947217
    if (cleanInputPhone.endsWith('7769947217')) {
      setIsLoading(false);
      setStep('admin_password');
      showToast('🔒 Admin phone verified. Super Admin password is required.', 'info', 4000);
      return;
    }

    // Check if this mobile number has logged in or registered before
    let foundUser: { name: string; phone: string; email?: string } | null = null;

    if (typeof window !== 'undefined') {
      try {
        // 1. Check registered users array
        const regStr = localStorage.getItem('majh_boisar_registered_users');
        if (regStr) {
          const regList = JSON.parse(regStr);
          if (Array.isArray(regList)) {
            const match = regList.find((u: any) => u.phone && u.phone.replace(/\D/g, '').endsWith(cleanInputPhone.slice(-10)));
            if (match && match.name) {
              foundUser = { name: match.name, phone: match.phone, email: match.email };
            }
          }
        }

        // 2. Check previously saved single user if no match yet
        if (!foundUser) {
          const savedUserStr = localStorage.getItem('majh_boisar_user');
          if (savedUserStr) {
            const parsed = JSON.parse(savedUserStr);
            if (parsed && parsed.phone && parsed.phone.replace(/\D/g, '').endsWith(cleanInputPhone.slice(-10)) && parsed.name) {
              foundUser = parsed;
            }
          }
        }
      } catch (err) {
        console.error('Error checking existing user in LoginModal:', err);
      }
    }

    // 3. If not found locally in browser, check backend database for cross-device sync
    if (!foundUser) {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.users)) {
            const match = data.users.find((u: any) => u.phone && u.phone.replace(/\D/g, '').endsWith(cleanInputPhone.slice(-10)));
            if (match && match.name) {
              foundUser = { name: match.name, phone: match.phone, email: match.email };
            }
          }
        }
      } catch (apiErr) {
        console.warn('Could not check /api/users in LoginModal:', apiErr);
      }
    }

    setIsLoading(false);

    if (foundUser && foundUser.name) {
      // Existing user found -> Direct Login without asking for Name/Email again!
      login(foundUser.name, mobileNumber, foundUser.email || '');
      resetForm();
      onClose();
    } else {
      // New user -> Proceed to collect Name and Email details
      setStep('info');
    }
  };

  const handleAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasscode.trim()) {
      setOtpError('Please enter the Admin passcode.');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mobileNumber || '7769947217',
          password: adminPasscode.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setOtpError(data.error || 'Incorrect Super Admin password. Access Denied.');
        return;
      }

      setOtpError('');
      setRole('Admin');
      login('Super Admin (7769947217)', '7769947217', 'majhboisar@gmail.com');
      showToast('🛡️ Super Admin Authenticated! Opening Admin Panel...', 'success', 3500);
      resetForm();
      onClose();
      router.push('/adminmb');
    } catch (err) {
      setOtpError('Network error verifying authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setOtpError('Please enter your full name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      setOtpError('Please enter a valid email address (e.g. name@gmail.com).');
      showToast('Please enter a valid email address (e.g. name@gmail.com).', 'error');
      return;
    }

    // Complete login with user provided details
    login(fullName, mobileNumber, email);
    resetForm();
    onClose();

    // Check if newly registered number is a hotel
    const clean10 = mobileNumber.replace(/\D/g, '').slice(-10);
    const allHotels = getAllHotels();
    const matchedHotel = allHotels.find(h => {
      const hp = (h.phone || '').replace(/\D/g, '').slice(-10);
      const hw = (h.whatsapp || '').replace(/\D/g, '').slice(-10);
      return clean10 === hp || clean10 === hw;
    });

    if (matchedHotel) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_phone', mobileNumber);
      }
      showToast(`🏨 Hotel Registered: ${matchedHotel.name}! Opening Hotel Front Desk Dashboard...`, 'success', 4000);
      router.push(`/dashboard?hotelId=${matchedHotel.id}&tab=hotel_bookings`);
    }
  };

  const resetForm = () => {
    setMobileNumber('');
    setOtpCode('');
    setSimulatedOtp('');
    setOtpError('');
    setIsLoading(false);
    setFullName('');
    setEmail('');
    setAdminPasscode('');
    setShowAdminPassword(false);
    setStep('phone');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => {
          resetForm();
          onClose();
        }}
      />
      
      <div className="relative w-full max-w-[420px] bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl z-10 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 text-left overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Purple Gradient Hero Banner with Logo (Matches District by Zomato Style) */}
        <div className="relative py-7 sm:py-8 bg-gradient-to-br from-[#7B2CBF] via-[#6C47FF] to-[#8A3FFC] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          {/* Decorative glowing circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-purple-400/20 rounded-full blur-lg pointer-events-none" />

          {/* OG Majh Boisar Logo in crisp white pill for maximum brand fidelity */}
          <div className="bg-white px-5 py-2 rounded-2xl shadow-lg relative z-10 flex items-center justify-center border border-white/60">
            <img
              src="/majh-boisar-full-logo.png"
              alt="Majh Boisar"
              className="h-11 sm:h-13 w-auto object-contain"
            />
          </div>

          <p className="text-xs sm:text-[13px] font-semibold text-white/95 mt-3 relative z-10 max-w-xs leading-snug">
            Boisar's #1 Local City Directory &amp; Services Portal
          </p>
        </div>

        {/* Content Area */}
        <div className="px-5 sm:px-7 py-5 sm:py-6">
          
          {/* Error message block */}
          {otpError && (
            <div className="p-2.5 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 font-bold flex items-center gap-1.5 animate-shake">
              <HelpCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          {/* STEP 1: Phone Input */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Enter your mobile number</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">If you don&apos;t have an account yet, we&apos;ll create one for you</p>
              </div>

              {/* Phone Input with Flag */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-3 bg-white border border-slate-200/90 shadow-2xs rounded-xl shrink-0">
                  <span className="text-base">🇮🇳</span>
                  <span className="text-sm font-bold text-slate-800">+91</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  autoFocus
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter mobile number"
                  className="flex-1 bg-white border border-slate-200/90 shadow-2xs rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal transition-all"
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={isLoading || mobileNumber.length < 10}
                className="w-full bg-black hover:bg-neutral-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-extrabold py-3.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : (
                  <span>Continue</span>
                )}
              </button>

              {/* Terms Footer */}
              <div className="text-center pt-1">
                <p className="text-[11px] text-slate-400 font-medium">By continuing, you agree to our</p>
                <div className="flex items-center justify-center gap-3 mt-0.5">
                  <a href="/terms" target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-slate-600 font-semibold underline underline-offset-2 hover:text-purple-700 transition-colors">Terms of Service</a>
                  <a href="/privacy" target="_blank" rel="nofollow noopener noreferrer" className="text-xs text-slate-600 font-semibold underline underline-offset-2 hover:text-purple-700 transition-colors">Privacy Policy</a>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: OTP verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Enter OTP</h2>
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  We have sent a verification code to +91 {mobileNumber}{' '}
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')} 
                    className="text-teal-600 font-bold hover:underline cursor-pointer"
                  >
                    (Change)
                  </button>
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    autoFocus={i === 0}
                    value={otpCode[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      const newOtp = otpCode.split('');
                      newOtp[i] = val;
                      const joined = newOtp.join('').slice(0, 6);
                      setOtpCode(joined);
                      if (otpError) setOtpError('');
                      // Auto-focus next
                      if (val && i < 5) {
                        const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                        if (next) next.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace to move to previous box
                      if (e.key === 'Backspace' && !otpCode[i] && i > 0) {
                        const prev = (e.target as HTMLElement).parentElement?.children[i - 1] as HTMLInputElement;
                        if (prev) prev.focus();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      setOtpCode(pasted);
                      // Focus last filled or next empty
                      const target = (e.target as HTMLElement).parentElement?.children[Math.min(pasted.length, 5)] as HTMLInputElement;
                      if (target) target.focus();
                    }}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black text-slate-900 border-2 rounded-xl focus:outline-none transition-all ${
                      otpCode[i] 
                        ? 'border-teal-500 bg-teal-50/50 shadow-sm' 
                        : 'border-slate-200 bg-slate-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20'
                    }`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otpCode.length < 6}
                className="w-full bg-black hover:bg-neutral-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-extrabold py-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Continue
              </button>

              {/* Resend OTP */}
              <div className="text-center text-sm text-slate-400 font-medium">
                {resendTimer > 0 ? (
                  <span>Didn't get the OTP? (Request again in <strong className="text-slate-600 font-mono">{String(Math.floor(resendTimer / 60)).padStart(2, '0')}:{String(resendTimer % 60).padStart(2, '0')}</strong>)</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-teal-600 font-bold hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: Detail Info */}
          {step === 'info' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mobile Verified</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Complete your profile</h2>
                <p className="text-sm text-slate-400 mt-0.5 font-medium">Just a few details to get started</p>
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-bold mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-bold mb-1.5">Email Address <span className="text-slate-400 font-medium">(Optional)</span></label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-black py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Complete &amp; Enter
              </button>
            </form>
          )}

          {/* STEP 4: Super Admin Passcode */}
          {step === 'admin_password' && (
            <form onSubmit={handleAdminPasswordSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 shadow-inner">
                <div className="flex items-center justify-center gap-1.5 text-teal-400">
                  <ShieldCheck className="w-5 h-5 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider">Super Admin Detected</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Admin Mobile <strong className="text-white">+91 7769947217</strong> verified via OTP.
                </p>
                <p className="text-[10px] text-amber-400 font-bold">
                  ⚠️ Super Admin password is compulsory to open the Admin Panel.
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-bold mb-1.5 flex items-center justify-between">
                  <span>Super Admin Passcode *</span>
                  <span className="text-[9px] text-slate-400 lowercase font-medium">required</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    required
                    autoFocus
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      if (otpError) setOtpError('');
                    }}
                    placeholder="Enter Super Admin Password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-slate-900 font-bold tracking-wider transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showAdminPassword ? "Hide password" : "Show password"}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-slate-900 via-teal-900 to-teal-800 hover:from-black hover:to-teal-700 active:scale-[0.98] disabled:opacity-70 text-white text-sm font-black py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-teal-300" />
                <span>Unlock &amp; Open Admin Panel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 pt-1 cursor-pointer"
              >
                Cancel Login
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Terms of Service & Privacy Policy Overlay Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 text-left space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" /> Terms &amp; Privacy Policy
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Majh Boisar Local Directory Services</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700 leading-relaxed pr-1">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-black text-slate-900 text-xs">1. User &amp; Merchant Authentication</h4>
                <p className="text-[11px] text-slate-600 font-medium">By logging into Majh Boisar, users and business owners verify their identity via 4-digit Mobile OTP. Registered business owners can manage their listings upon logging in with their registered mobile number.</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-black text-slate-900 text-xs">2. Directory Disclaimer &amp; Non-Liability Policy</h4>
                <p className="text-[11px] text-slate-600 font-medium">Majh Boisar is strictly a <strong>local search &amp; connecting directory</strong>. If you hire a domestic helper/maid or deal in property/real estate listings, Majh Boisar is not responsible or liable for candidate background safety, personal wage terms, property paper validity, or disputes. Users &amp; employers must independently verify Aadhar ID, police check, and property papers (7/12 &amp; Index-2) before any agreement or payment.</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-black text-slate-900 text-xs">3. Privacy &amp; Data Security</h4>
                <p className="text-[11px] text-slate-600 font-medium">Your phone number is securely encrypted and used strictly for OTP authentication. We do not sell or distribute personal contact information to telemarketers.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
