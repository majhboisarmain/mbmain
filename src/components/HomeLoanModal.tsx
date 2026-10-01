'use client';

import React, { useState, useMemo } from 'react';
import { X, Check, Phone, MessageSquare, Landmark, Calculator, ArrowRight } from 'lucide-react';

interface HomeLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
}

export default function HomeLoanModal({ isOpen, onClose, defaultAmount = 2500000 }: HomeLoanModalProps) {
  const [loanAmount, setLoanAmount] = useState<number>(defaultAmount);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // EMI calculation @ 8.5%
  const monthlyEmi = useMemo(() => {
    const rate = 8.5 / (12 * 100);
    const months = tenureYears * 12;
    const emi = (loanAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(emi);
  }, [loanAmount, tenureYears]);

  if (!isOpen) return null;

  const formatLakh = (amt: number) => `₹${(amt / 100000).toFixed(0)}L`;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Majh Boisar, I need Home Loan assistance for a property in Boisar.\n\n• Amount: ${formatLakh(loanAmount)}\n• Tenure: ${tenureYears} Years\n• Est. EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/mo\n• Mobile: ${phone || 'Please call me'}`
    );
    window.open(`https://wa.me/917769947217?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+917769947217';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      const existing = JSON.parse(localStorage.getItem('majh_boisar_loan_leads') || '[]');
      existing.unshift({
        id: Date.now(),
        phone,
        amount: loanAmount,
        tenure: tenureYears,
        emi: monthlyEmi,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('majh_boisar_loan_leads', JSON.stringify(existing.slice(0, 30)));
    } catch (e) {
      // ignore
    }
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150 text-left">
        
        {/* Simple Clean Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#da0c23]/10 border border-[#da0c23]/25 text-[#da0c23] flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">
                Boisar Home Loan
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Helpline: <a href="tel:+917769947217" className="text-[#da0c23] font-black hover:underline">+91 77699 47217</a>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="text-sm font-black text-slate-900">Request Received!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Our Boisar loan partner will contact you shortly on <strong>{phone}</strong>.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Clean EMI Summary Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 text-center space-y-1">
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                  Estimated Monthly EMI (@ 8.5%)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#da0c23] tracking-tight">
                  ₹{monthlyEmi.toLocaleString('en-IN')}
                  <span className="text-xs font-semibold text-slate-500"> / month</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 block">
                  For {formatLakh(loanAmount)} Loan • {tenureYears} Years Tenure
                </span>
              </div>

              {/* Loan Amount Selector (Clean Pills) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Loan Amount</span>
                  <span className="text-[#da0c23] font-black">{formatLakh(loanAmount)}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1500000, 2500000, 3500000, 5000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setLoanAmount(amt)}
                      className={`py-1.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                        loanAmount === amt
                          ? 'bg-[#da0c23] text-white border-[#da0c23] shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {formatLakh(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Selector (Clean Pills) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Tenure</span>
                  <span className="text-slate-900 font-black">{tenureYears} Yrs</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[15, 20, 25].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTenureYears(yr)}
                      className={`py-1.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${
                        tenureYears === yr
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {yr} Years
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Simple Trust Points */}
              <div className="flex items-center justify-between text-[10px] sm:text-[10.5px] font-bold text-slate-600 bg-[#da0c23]/5 border border-[#da0c23]/15 px-3 py-2 rounded-xl">
                <span>✓ Starting @ 8.40%</span>
                <span>•</span>
                <span>✓ SBI, HDFC &amp; ICICI</span>
                <span>•</span>
                <span>✓ Zero Fees</span>
              </div>

              {/* Simple Lead Input Form */}
              <form onSubmit={handleSubmit} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#da0c23] transition-all text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Request Call</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Direct Call to Majh Boisar Helpline */}
                <div className="pt-1 text-center">
                  <a
                    href="tel:+917769947217"
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all cursor-pointer w-full"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#da0c23]" />
                    <span>Direct Call: <strong className="text-[#da0c23] font-black">+91 77699 47217</strong></span>
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
