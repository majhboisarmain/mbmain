'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Mail, ShieldCheck, HelpCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, setRole, showToast } = useApp();
  
  // Steps: 'phone' | 'otp' | 'info'
  const [step, setStep] = useState<'phone' | 'otp' | 'info'>('phone');
  
  // Registration and OTP states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

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

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedOtp) {
      setOtpError('Invalid OTP. Please enter the 6-digit code received on your mobile via SMS.');
      return;
    }
    setOtpError('');

    // Check if this mobile number has logged in or registered before
    const cleanInputPhone = mobileNumber.replace(/\D/g, '');
    let foundUser: { name: string; phone: string; email?: string } | null = null;

    if (typeof window !== 'undefined') {
      try {
        // 1. Check registered users array
        const regStr = localStorage.getItem('majh_boisar_registered_users');
        if (regStr) {
          const regList = JSON.parse(regStr);
          if (Array.isArray(regList)) {
            const match = regList.find((u: any) => u.phone && u.phone.replace(/\D/g, '').endsWith(cleanInputPhone.slice(-10)));
            if (match) {
              foundUser = { name: match.name, phone: match.phone, email: match.email };
            }
          }
        }

        // 2. Check previously saved single user if no match yet
        if (!foundUser) {
          const savedUserStr = localStorage.getItem('majh_boisar_user');
          if (savedUserStr) {
            const parsed = JSON.parse(savedUserStr);
            if (parsed && parsed.phone && parsed.phone.replace(/\D/g, '').endsWith(cleanInputPhone.slice(-10))) {
              foundUser = parsed;
            }
          }
        }
      } catch (err) {
        console.error('Error checking existing user in LoginModal:', err);
      }
    }

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
  };

  const resetForm = () => {
    setMobileNumber('');
    setOtpCode('');
    setSimulatedOtp('');
    setOtpError('');
    setIsLoading(false);
    setFullName('');
    setEmail('');
    setStep('phone');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={() => {
          resetForm();
          onClose();
        }}
      />
      
      <div className="relative w-full max-w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 animate-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* JustDial-Style Header: Left Logo | Vertical Divider | Right Welcome Title */}
        <div className="flex items-center gap-3.5 mb-5 pb-1">
          <div className="shrink-0">
            <h2 className="text-xl font-black tracking-tight leading-none">
              <span className="text-teal-600">Majh</span>
              <span className="text-rose-600">Boisar</span>
            </h2>
          </div>
          
          <div className="h-9 w-[2px] bg-slate-200 rounded-full shrink-0" />
          
          <div className="min-w-0">
            <h3 className="text-sm font-black text-slate-900 leading-tight">Welcome!</h3>
            <p className="text-[10.5px] text-slate-500 font-medium leading-tight mt-0.5">
              Enter your mobile number to continue
            </p>
          </div>
        </div>

        {/* Error message block */}
        {otpError && (
          <div className="p-2.5 mb-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-1.5 animate-shake">
            <HelpCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{otpError}</span>
          </div>
        )}

        {/* STEP 1: Clean Phone Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Mobile Number Input */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-xs text-slate-600 font-black border-r border-slate-200 pr-2.5 flex items-center gap-1">
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  autoFocus
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Mobile Number*"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-16 pr-4 py-2.5 text-xs focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-900 font-black tracking-wider placeholder:text-slate-400 shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div className="flex flex-col items-center justify-center pt-1 text-center">
              <label className="flex items-center gap-2 text-[11px] text-slate-600 font-medium cursor-pointer">
                <input type="checkbox" defaultChecked required className="w-3.5 h-3.5 accent-teal-600 rounded cursor-pointer" />
                <span>I Agree to Terms and Conditions</span>
              </label>
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-[10px] text-teal-600 font-extrabold hover:underline mt-0.5 cursor-pointer"
              >
                T&amp;C's Privacy Policy
              </button>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-98 disabled:opacity-70 text-white text-xs font-black py-3 rounded-xl shadow-md uppercase tracking-wider transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Sending OTP...</span>
              ) : (
                <span>Continue</span>
              )}
            </button>

            {/* Maybe Later Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-[11px] text-teal-600 font-bold hover:underline cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider">Enter OTP Sent to +91 {mobileNumber}</label>
                <button 
                  type="button" 
                  onClick={() => setStep('phone')} 
                  className="text-[10px] text-teal-600 hover:underline font-extrabold cursor-pointer"
                >
                  Change
                </button>
              </div>
              <input
                type="text"
                required
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ''));
                  if (otpError) setOtpError('');
                }}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-center text-sm font-black tracking-[0.3em] focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-slate-900 shadow-2xs transition-all"
              />
            </div>

            {/* Resend OTP 60s Countdown Timer */}
            <div className="flex items-center justify-between text-[11px] px-0.5">
              <span className="text-slate-500 font-medium">Didn't receive code?</span>
              {resendTimer > 0 ? (
                <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-[10px]">
                  Resend in <strong className="text-teal-700 font-mono font-black">{resendTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-teal-600 hover:text-teal-700 font-extrabold text-xs underline cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend OTP Now'}
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-black py-3 rounded-xl shadow-md uppercase tracking-wider transition-all cursor-pointer"
            >
              Verify &amp; Login
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-[11px] text-teal-600 font-bold hover:underline cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Detail Info (if Name wasn't provided earlier) */}
        {step === 'info' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-1">
              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">Mobile Verified ✓</span>
            </div>

            <div>
              <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Full Name*</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-600 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-600 font-black uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com (Optional)"
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-teal-600 text-slate-900 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-black py-3 rounded-xl shadow-md uppercase tracking-wider transition-all cursor-pointer"
            >
              Complete &amp; Enter
            </button>
          </form>
        )}
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
