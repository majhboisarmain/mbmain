'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Search, Briefcase, MapPin, Building2, Phone, MessageSquare, 
  PlusCircle, CheckCircle2, ArrowRight
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  type: string;
  description: string;
  salary: string | null;
  location: string;
  status: string;
  createdAt: string;
  businessId: number;
  business: {
    name: string;
    image: string;
    location: string;
    phone: string;
    whatsapp: string;
    verified: boolean;
  };
  _count?: { applications: number };
}

export default function JobsBoard() {
  const { isLoggedIn, setLoginModalOpen, showToast, loggedInUser } = useApp();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);

  // Post Job form state
  const [postTitle, setPostTitle] = useState('');
  const [postCompany, setPostCompany] = useState('');
  const [postPhone, setPostPhone] = useState('');
  const [postSalary, setPostSalary] = useState('');
  const [postLocation, setPostLocation] = useState('Boisar');
  const [postType, setPostType] = useState('Full Time');
  const [postDesc, setPostDesc] = useState('');

  // Pre-fill phone if logged in
  useEffect(() => {
    if (showPostModal && loggedInUser) {
      if (!postCompany) setPostCompany(loggedInUser.name || '');
      if (!postPhone) setPostPhone(loggedInUser.phone || '');
    }
  }, [showPostModal, loggedInUser]);

  const handleOpenPostModal = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      showToast('Please login with your mobile number to post a job vacancy.', 'info', 4000);
      return;
    }
    setShowPostModal(true);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs?type=${encodeURIComponent(typeFilter)}&query=${encodeURIComponent(query)}&status=Open`);
      if (!res.ok) {
        setJobs([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [typeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyWhatsApp = (job: Job) => {
    const phone = job.business?.whatsapp || job.business?.phone || '917769947217';
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0/, '91');
    const msg = encodeURIComponent(
      `Hello ${job.business?.name || 'HR Team'}! 👋\nI am applying for "${job.title}" on Majh Boisar.\nPlease let me know interview timings.`
    );
    window.open(`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${msg}`, '_blank');
  };

  const handlePostJobWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postCompany || !postPhone) {
      alert('Please fill all required fields (Company, Job Title, Mobile Number).');
      return;
    }
    const adminPhone = '919022388123';
    const msg = encodeURIComponent(
      `*New Job Vacancy Submission on Majh Boisar* 💼\n\n` +
      `🏢 *Company / Shop:* ${postCompany}\n` +
      `📌 *Job Title:* ${postTitle}\n` +
      `💰 *Salary:* ${postSalary || 'Negotiable'}\n` +
      `📍 *Location:* ${postLocation}\n` +
      `⏳ *Type:* ${postType}\n` +
      `📞 *HR Contact:* ${postPhone}\n` +
      `📝 *Details:* ${postDesc || 'Immediate joining in Boisar.'}\n\n` +
      `Please verify and list this vacancy on the Majh Boisar portal.`
    );
    window.open(`https://wa.me/${adminPhone}?text=${msg}`, '_blank');
    setShowPostModal(false);
  };

  useEffect(() => {
    if (showPostModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPostModal]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20 text-left text-slate-900">

      {/* Clean Professional Header (Clean White & Slate theme) */}
      <div className="bg-white border-b border-slate-200 py-2.5 sm:py-3 px-3 sm:px-6 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-2">
          
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Jobs in Boisar &amp; Tarapur MIDC
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Verified factory, office, hospital &amp; shop vacancies
              </p>
            </div>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
              ✓ Direct HR Contact
            </span>
          </div>

          {/* Search Box & Filters in compact single row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-slate-400 focus-within:bg-white p-0.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all">
              <div className="flex-1 flex items-center pl-2.5 gap-2 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search job title, skill (e.g. Accounts, Supervisor, ITI)..."
                  className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 shrink-0 text-xs">
              {['All', 'Full Time', 'Part Time'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    typeFilter === type
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Jobs Listing Section */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 mt-2.5 sm:mt-3 space-y-2.5">
        
        {/* Count Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span>{jobs.length} Job Vacancies in Boisar</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Local Employers</span>
          </span>
        </div>

        {/* Jobs List (Medium Text, Clean Cards) */}
        <div className="space-y-2.5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left"
            >
              {/* Job Info */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm sm:text-base font-black text-slate-900 hover:text-purple-900 transition-colors block leading-tight"
                  >
                    {job.title}
                  </Link>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {job.type}
                  </span>
                </div>

                {/* Company & Location */}
                <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold flex-wrap">
                  <span className="text-slate-800 font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{job.business?.name || 'Local Company'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{job.location || 'Boisar'}</span>
                  </span>
                </div>

                {/* Short Medium Description */}
                <p className="text-xs text-slate-600 font-medium line-clamp-1">
                  {job.description}
                </p>

                {/* Salary Chip */}
                <div className="pt-0.5">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {job.salary || 'Best in Industry'}
                  </span>
                </div>
              </div>

              {/* Action Buttons on the Right */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Link
                  href={`/jobs/${job.id}`}
                  className="flex-1 sm:flex-none text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => handleApplyWhatsApp(job)}
                  className="flex-1 sm:flex-none bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
                  <span>Apply on WhatsApp</span>
                </button>
              </div>

            </div>
          ))}

          {jobs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-2.5 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto text-xl">
                💼
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">No Job Openings Available Right Now</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  New job vacancies for Tarapur MIDC &amp; Boisar are updated regularly. Check back shortly!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Employer Hiring Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mt-4">
          <div>
            <h4 className="text-xs font-black text-slate-900">Are you hiring staff in Boisar or Tarapur MIDC?</h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Post your job vacancy for free and get direct candidate enquiries.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenPostModal}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
          >
            Post a Vacancy
          </button>
        </div>

      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-3 text-left animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Post a Job in Boisar</h3>
                <p className="text-[10.5px] text-slate-500">Reach local job seekers in Boisar &amp; MIDC.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostJobWhatsApp} className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Company / Shop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Pharma / Royal Hotel"
                  value={postCompany}
                  onChange={(e) => setPostCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Accounts Executive"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Salary *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹20,000 - ₹25,000"
                    value={postSalary}
                    onChange={(e) => setPostSalary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Location in Boisar *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tarapur MIDC / Ostwal"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Job Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={postPhone}
                  onChange={(e) => setPostPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Short Job Details</label>
                <textarea
                  rows={2}
                  placeholder="Skills, timings, etc."
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Publish Job via WhatsApp →
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
