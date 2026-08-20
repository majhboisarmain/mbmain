'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, CheckCircle2, Lock, AlertCircle, Building } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function JobsOnboarding() {
  const router = useRouter();
  const { isLoggedIn, currentRole, loggedInUser, setLoginModalOpen } = useApp();
  
  const [business, setBusiness] = useState<any>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);

  // Fetch business details to check verification
  useEffect(() => {
    if (isLoggedIn && loggedInUser?.phone && currentRole === 'BusinessOwner') {
      fetch(`/api/businesses?showAll=true`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const cleanUserPhone = loggedInUser.phone.replace(/\D/g, '').slice(-10);
            const match = data.find(b => {
              const cleanBPhone = b.phone ? b.phone.replace(/\D/g, '').slice(-10) : '';
              const cleanBWhatsapp = b.whatsapp ? b.whatsapp.replace(/\D/g, '').slice(-10) : '';
              return cleanBPhone === cleanUserPhone || cleanBWhatsapp === cleanUserPhone;
            });
            setBusiness(match || null);
          }
        })
        .finally(() => setLoadingBusiness(false));
    } else {
      setLoadingBusiness(false);
    }
  }, [isLoggedIn, loggedInUser, currentRole]);

  // Giver State
  const [giverBusiness, setGiverBusiness] = useState('');
  const [giverTitle, setGiverTitle] = useState('');
  const [giverJobType, setGiverJobType] = useState('Full Time');
  const [giverSalary, setGiverSalary] = useState('');
  const [giverPhoto, setGiverPhoto] = useState('');
  const [giverDesc, setGiverDesc] = useState('');
  const [giverAddress, setGiverAddress] = useState('');
  const [giverContact, setGiverContact] = useState('');
  const [isSubmittingGiver, setIsSubmittingGiver] = useState(false);
  const [giverSuccess, setGiverSuccess] = useState(false);

  // Auto-fill when business loads
  useEffect(() => {
    if (business) {
      setGiverBusiness(business.name || '');
      setGiverAddress(business.address || '');
      setGiverContact(business.phone || '');
    }
  }, [business]);

  const handleGiverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingGiver(true);
    // Mock API Call
    setTimeout(() => {
      setIsSubmittingGiver(false);
      setGiverSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }, 1000);
  };

  // 1. Loading State
  if (loadingBusiness) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Not Logged In
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Login Required</h1>
        <p className="text-slate-500 mb-8 max-w-sm text-center">You need to be logged in and own a registered business to post a job on Majh Boisar.</p>
        <button onClick={() => setLoginModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer">
          Login Now
        </button>
      </div>
    );
  }

  // 3. Not a Business Owner
  if (currentRole !== 'BusinessOwner' || (!loadingBusiness && !business)) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <Building className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Register Business First</h1>
        <p className="text-slate-500 mb-8 max-w-sm text-center">Only registered businesses can post jobs. Add your business to our directory to get started.</p>
        <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-600 text-white font-black py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer">
          Register My Business
        </Link>
      </div>
    );
  }

  // 4. Business is Not Verified Yet
  if (business && !business.verified) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Pending Approval</h1>
        <p className="text-slate-500 mb-8 max-w-sm text-center">Your business details are currently under review. You can post jobs as soon as your business is verified and approved.</p>
        <Link href="/dashboard" className="bg-rose-500 hover:bg-rose-600 text-white font-black py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // 5. Authorized (Logged In + Business Owner + Verified)
  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="max-w-md mx-auto w-full relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Post a New Job</h1>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <form onSubmit={handleGiverSubmit} className="p-5 sm:p-6 space-y-3">
            {giverSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-black text-slate-800">Job Posted!</h3>
                <p className="text-sm text-slate-500">Redirecting you to the business dashboard...</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Business Name</label>
                  <input type="text" required disabled value={giverBusiness} onChange={e => setGiverBusiness(e.target.value)} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 font-medium cursor-not-allowed" placeholder="e.g. Tarapur Textiles" />
                  <p className="text-[9px] text-emerald-600 font-bold mt-1">✓ Verified Business</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Job Title</label>
                  <input type="text" required value={giverTitle} onChange={e => setGiverTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium" placeholder="e.g. Receptionist" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Job Type</label>
                    <select value={giverJobType} onChange={e => setGiverJobType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium">
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Salary / Month</label>
                    <input type="text" value={giverSalary} onChange={e => setGiverSalary(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium" placeholder="e.g. ₹15,000" />
                  </div>
                </div>
                {!business?.image && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Cover Photo (Office/Business)</label>
                    <input type="text" value={giverPhoto} onChange={e => setGiverPhoto(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium" placeholder="Image URL (https://...)" />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Job Details & Requirements</label>
                  <textarea required rows={3} value={giverDesc} onChange={e => setGiverDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium resize-none" placeholder="Describe the role and requirements" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Address / Area</label>
                    <input type="text" required value={giverAddress} onChange={e => setGiverAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium" placeholder="e.g. Boisar West" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Contact No.</label>
                    <input type="tel" required value={giverContact} onChange={e => setGiverContact(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white font-medium" placeholder="10-digit num" />
                  </div>
                </div>
                <button type="submit" disabled={isSubmittingGiver} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-lg shadow-md transition-all mt-4 disabled:opacity-50 cursor-pointer text-sm">
                  {isSubmittingGiver ? 'Posting...' : 'Post Job Now'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
