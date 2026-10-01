'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  Search, Briefcase, Luggage, Bookmark, MapPin, Building2, Phone, MessageSquare, 
  PlusCircle, CheckCircle2, ArrowRight, Sparkles
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

function JobLogo({ image, name }: { image?: string | null; name?: string }) {
  const [error, setError] = useState(false);

  const hasValidImage = Boolean(
    image &&
    image.trim() !== '' &&
    !image.includes('unsplash.com/photo-1497366216548') &&
    !error
  );

  if (hasValidImage) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 shadow-xs bg-slate-100 border border-slate-200/80">
        <img
          src={image!}
          alt={name || 'Company'}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-[#df4d32] to-[#c22e1b] text-white shadow-xs">
      <Luggage className="w-6 h-6 stroke-[2] text-white" />
    </div>
  );
}

export default function JobsBoard() {
  const { isLoggedIn, setLoginModalOpen, showToast, loggedInUser } = useApp();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mb_saved_jobs');
      if (stored) {
        setSavedJobIds(JSON.parse(stored));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleSaveJob = (id: number) => {
    setSavedJobIds((prev) => {
      let next: number[];
      if (prev.includes(id)) {
        next = prev.filter((item) => item !== id);
        showToast('Removed from saved jobs', 'info', 2000);
      } else {
        next = [...prev, id];
        showToast('Saved to your bookmarked jobs! 📌', 'success', 2500);
      }
      try {
        localStorage.setItem('mb_saved_jobs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    let interval = seconds / 86400;
    if (interval >= 1) {
      const days = Math.floor(interval);
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    interval = seconds / 3600;
    if (interval >= 1) {
      const hours = Math.floor(interval);
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    interval = seconds / 60;
    if (interval >= 1) {
      const mins = Math.floor(interval);
      return mins === 1 ? '1 min ago' : `${mins} mins ago`;
    }
    return 'Just now';
  };

  const getExperienceTag = (desc: string) => {
    if (!desc) return null;
    const match = desc.match(/(\d+(?:\s*[-–to]\s*\d+)?|\d+\+)\s*(?:yrs|years|yr)(?:\s*(?:of)?\s*exp(?:erience)?)?/i);
    if (match) {
      const text = match[0].trim();
      return text.toLowerCase().includes('exp') ? text : `${text} of exp`;
    }
    if (/\bfresher\b/i.test(desc)) return 'Fresher';
    return null;
  };

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
      const apiType = typeFilter === 'Saved' ? 'All' : typeFilter;
      const res = await fetch(`/api/jobs?type=${encodeURIComponent(apiType)}&query=${encodeURIComponent(query)}&status=Open`);
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

  const displayedJobs = jobs.filter((job) => {
    if (typeFilter === 'Saved') {
      return savedJobIds.includes(job.id);
    }
    return true;
  });

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

  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [postJobSuccess, setPostJobSuccess] = useState(false);

  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postCompany || !postPhone) {
      showToast('Please fill all required fields (Company, Job Title, Mobile Number).', 'warning');
      return;
    }

    setIsSubmittingJob(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: postCompany.trim(),
          title: postTitle.trim(),
          salary: postSalary.trim() || 'Negotiable',
          location: postLocation.trim() || 'Boisar',
          jobType: postType,
          phone: postPhone.trim(),
          description: postDesc.trim() || `${postTitle} required at ${postCompany}.`,
          status: 'Pending'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit job posting.');
      }

      setPostJobSuccess(true);
      showToast('Job submitted for admin approval!', 'success', 5000);
    } catch (err: any) {
      showToast(err?.message || 'Error submitting job. Please try again.', 'error');
    } finally {
      setIsSubmittingJob(false);
    }
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

      {/* Clean Professional Header */}
      <div className="bg-white border-b border-slate-200 py-3 sm:py-3.5 px-3 sm:px-6 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-2.5">
          
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Jobs in Boisar &amp; Tarapur MIDC
            </h1>
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
            <div className="flex items-center gap-1 shrink-0 text-xs overflow-x-auto pb-0.5 sm:pb-0">
              {['All', 'Full Time', 'Part Time', 'Saved'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                    typeFilter === type
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'Saved' && <Bookmark className="w-3 h-3" />}
                  <span>{type}</span>
                  {type === 'Saved' && savedJobIds.length > 0 && (
                    <span className="text-[10px] opacity-80">({savedJobIds.length})</span>
                  )}
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
          <span>{displayedJobs.length} {displayedJobs.length === 1 ? 'Job Vacancy' : 'Job Vacancies'}</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Local Employers</span>
          </span>
        </div>

        {/* Jobs List (Modern Reference Card Design) */}
        <div className="space-y-3">
          {displayedJobs.map((job) => {
            const expTag = getExperienceTag(job.description);
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all text-left space-y-3.5"
              >
                {/* Top Row: Brand Icon + Title/Company/Location + Bookmark */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Brand / Company Logo Icon (falls back to icon if no image) */}
                    <JobLogo image={job.business?.image} name={job.business?.name} />

                    {/* Title, Company, Location */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-[15px] sm:text-lg font-bold text-[#0284c7] hover:text-[#0369a1] transition-colors leading-snug line-clamp-1 block tracking-tight"
                      >
                        {job.title}
                      </Link>
                      <p className="text-sm sm:text-base font-semibold text-slate-800 line-clamp-1 mt-0.5">
                        {job.business?.name || 'Verified Company'}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5 line-clamp-1">
                        {job.location || 'Boisar, Maharashtra'}
                      </p>
                    </div>
                  </div>

                  {/* Top-Right Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSaveJob(job.id);
                    }}
                    className="p-1 text-slate-700 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                    title={isSaved ? "Remove bookmark" : "Save job"}
                  >
                    <Bookmark
                      className={`w-5 h-5 transition-transform active:scale-90 ${
                        isSaved
                          ? 'fill-slate-900 text-slate-900'
                          : 'text-slate-800 hover:text-slate-950 stroke-[1.8]'
                      }`}
                    />
                  </button>
                </div>

                {/* Bottom Row: Tags + Relative Time */}
                <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {expTag ? (
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-lg">
                        {expTag}
                      </span>
                    ) : job.salary ? (
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-lg">
                        {job.salary}
                      </span>
                    ) : null}

                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-lg">
                      {job.type || 'Full-time'}
                    </span>

                    {expTag && job.salary && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {job.salary}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-auto">
                    {timeAgo(job.createdAt)}
                  </span>
                </div>

                {/* Action Row: View Details & Apply on WhatsApp */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex-1 text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2 rounded-xl border border-slate-200/80 transition-all"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleApplyWhatsApp(job)}
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span>Apply on WhatsApp</span>
                  </button>
                </div>

              </div>
            );
          })}

          {displayedJobs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-2.5 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto text-xl">
                💼
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">
                  {typeFilter === 'Saved' ? 'No Saved Jobs' : 'No Job Openings Available Right Now'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {typeFilter === 'Saved'
                    ? "You haven't bookmarked any jobs yet. Click the bookmark icon on any job card to save it."
                    : 'New job vacancies for Tarapur MIDC & Boisar are updated regularly. Check back shortly!'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Employer Hiring Box (Simple & Compact) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mt-4 shadow-2xs">
          <div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900">Are you hiring staff in Boisar or Tarapur MIDC?</h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Post your job vacancy for free and get direct candidate enquiries.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenPostModal}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
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

            {postJobSuccess ? (
              <div className="py-6 px-2 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900">Job Sent for Admin Approval! ⏳</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Aapka job vacancy successfully submit ho gaya hai. Admin review aur approval ke baad ye portal par sabhi job seekers ko dikhega.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Company:</span>
                    <span className="font-bold text-slate-800">{postCompany}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Role:</span>
                    <span className="font-bold text-slate-800">{postTitle}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Location:</span>
                    <span className="font-bold text-slate-800">{postLocation}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Status:</span>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      Pending Approval
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPostModal(false);
                    setPostJobSuccess(false);
                    setPostTitle('');
                    setPostSalary('');
                    setPostDesc('');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Close &amp; View Job Board
                </button>
              </div>
            ) : (
              <form onSubmit={handlePostJobSubmit} className="space-y-2">
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
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Contact / WhatsApp Mobile *</label>
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
                  disabled={isSubmittingJob}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmittingJob ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting for Approval...</span>
                    </>
                  ) : (
                    <span>Submit Job for Admin Approval →</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
