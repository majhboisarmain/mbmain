'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, Building2, CheckCircle2, Phone, 
  Send, AlertCircle, ArrowLeft, Store 
} from 'lucide-react';

function ClaimBusinessContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id') || '';
  const urlName = searchParams.get('name') || '';

  const [businessName, setBusinessName] = useState(urlName.trim());
  const [businessId, setBusinessId] = useState(urlId.trim());
  const [claimantName, setClaimantName] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlName && !businessName) {
      setBusinessName(urlName.trim());
    }
    if (urlId && !businessId) {
      setBusinessId(urlId.trim());
    }
  }, [urlName, urlId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName.trim() || !claimantName.trim() || !claimantPhone.trim()) {
      setError('Please fill in your Business Name, Full Name, and Contact Mobile Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: businessId ? parseInt(businessId) : 0,
          businessName: businessName.trim(),
          claimantName: claimantName.trim(),
          claimantPhone: claimantPhone.trim(),
          claimantEmail: claimantEmail.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit claim request');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Majh Boisar</span>
        </Link>

        {/* Header */}
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>Official Business Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Claim Your Business on Majh Boisar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Are you the legitimate owner or manager of this business listed on Majh Boisar? Claim ownership to update phone numbers, address, photos, catalogue, and manage customer enquiries.
          </p>
        </div>

        {/* Pre-filled Notice Banner if claiming specific business */}
        {businessName && (
          <div className="bg-white border border-teal-200/90 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Claiming Profile</p>
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">{businessName}</h3>
              {businessId && <p className="text-[10px] font-bold text-teal-700">Listing ID #{businessId}</p>}
            </div>
          </div>
        )}

        {/* Success State */}
        {success ? (
          <div className="bg-white border border-emerald-300 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Claim Request Submitted!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you! Our local Boisar verification agent will call you at <strong className="text-teal-800 font-bold">{claimantPhone}</strong> to verify business ownership credentials (visiting card, GST, or shop photo) and grant you full admin controls.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-2xs"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Claim Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs text-left"
          >
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Muscle Factory Hub / Anand Hospital"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Rajesh Patil"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={claimantPhone}
                  onChange={(e) => setClaimantPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                  maxLength={10}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={claimantEmail}
                onChange={(e) => setClaimantEmail(e.target.value)}
                placeholder="owner@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Proof or Ownership Note (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your ownership (e.g., store manager, founder, phone bill or shop registration detail)..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Claim Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Claim Request for Verification</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-2.5">
                We protect authentic business owners. Claims are vetted personally by our Boisar desk.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ClaimBusinessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ClaimBusinessContent />
    </Suspense>
  );
}
