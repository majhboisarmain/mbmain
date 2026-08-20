'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

const DEFAULT_BOISAR_JOBS: Job[] = [
  {
    id: 101,
    title: 'Senior Accounts Executive (Tally Prime / GST)',
    type: 'Full Time',
    description: 'Handling GST filing, day-to-day accounts, billing, and vendor payments for MIDC factory.',
    salary: '₹25,000 - ₹35,000 / mo',
    location: 'Tarapur MIDC, Boisar',
    status: 'Open',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    businessId: 1,
    business: {
      name: 'Shree Chem Industries Ltd.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
      location: 'Tarapur MIDC Gate 2',
      phone: '9822114455',
      whatsapp: '919822114455',
      verified: true
    },
    _count: { applications: 12 }
  },
  {
    id: 102,
    title: 'Chemical Plant Production Supervisor',
    type: 'Full Time',
    description: 'Supervising chemical batch operations, shift scheduling, and plant safety standards.',
    salary: '₹28,000 - ₹40,000 / mo',
    location: 'Tarapur MIDC Zone 1',
    status: 'Open',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    businessId: 2,
    business: {
      name: 'Tarapur Polymer & Chemicals',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
      location: 'MIDC Road, Salwad',
      phone: '9822445566',
      whatsapp: '919822445566',
      verified: true
    },
    _count: { applications: 8 }
  },
  {
    id: 103,
    title: 'Front Desk Receptionist & Guest Executive',
    type: 'Full Time',
    description: 'Handling hotel guest check-ins, room reservations, billing system, and customer support.',
    salary: '₹18,000 - ₹24,000 / mo',
    location: 'Ostwal Empire, Boisar (West)',
    status: 'Open',
    createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    businessId: 3,
    business: {
      name: 'Freesia by Express Inn',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
      location: 'Ostwal Empire Main Road',
      phone: '8149998666',
      whatsapp: '918149998666',
      verified: true
    },
    _count: { applications: 15 }
  },
  {
    id: 104,
    title: 'Retail Store Sales & Cashier Executive',
    type: 'Full Time',
    description: 'Customer assistance, billing counter management, and garment stock inventory handling.',
    salary: '₹15,000 - ₹20,000 / mo',
    location: 'Navapur Road, Boisar',
    status: 'Open',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    businessId: 4,
    business: {
      name: 'Style Club Lifestyle Retail',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
      location: 'Near Boisar Bus Depot',
      phone: '9028551030',
      whatsapp: '919028551030',
      verified: true
    },
    _count: { applications: 19 }
  },
  {
    id: 105,
    title: 'Staff Nurse (ICU & General Ward)',
    type: 'Full Time',
    description: 'Patient care, vitals monitoring, medicine administration, and doctor assistance.',
    salary: '₹22,000 - ₹32,000 / mo',
    location: 'Chitralaya Road, Boisar',
    status: 'Open',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    businessId: 5,
    business: {
      name: 'City General Hospital & ICU',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200',
      location: 'Opp. Harmony Plaza, Boisar',
      phone: '7264951994',
      whatsapp: '917264951994',
      verified: true
    },
    _count: { applications: 6 }
  },
  {
    id: 106,
    title: 'CNC & VMC Machine Operator',
    type: 'Full Time',
    description: 'Operating CNC milling & turning machines for precision engineering parts. ITI preferred.',
    salary: '₹20,000 - ₹27,000 / mo',
    location: 'Tarapur MIDC Gate No. 1',
    status: 'Open',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    businessId: 6,
    business: {
      name: 'Apex Precision Engineering',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=200',
      location: 'Tarapur MIDC, Boisar',
      phone: '9822338899',
      whatsapp: '919822338899',
      verified: true
    },
    _count: { applications: 11 }
  },
  {
    id: 107,
    title: 'Primary English & Science Teacher',
    type: 'Full Time',
    description: 'Teaching primary students (Class 1-5), preparing test sheets, and classroom coordination.',
    salary: '₹18,000 - ₹26,000 / mo',
    location: 'Khaira, Boisar (East)',
    status: 'Open',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    businessId: 7,
    business: {
      name: 'Bright Future Academy',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200',
      location: 'Khaira Road, Boisar',
      phone: '7385153162',
      whatsapp: '917385153162',
      verified: true
    },
    _count: { applications: 9 }
  },
  {
    id: 108,
    title: 'Delivery Associate (Bike Rider)',
    type: 'Part Time',
    description: 'Hyperlocal package & order delivery across Boisar and Tarapur. Smartphone and bike required.',
    salary: '₹16,000 - ₹22,000 / mo',
    location: 'Station Road, Boisar',
    status: 'Open',
    createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
    businessId: 8,
    business: {
      name: 'Express Local Logistics',
      image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=200',
      location: 'Near Boisar Railway Station',
      phone: '9822014455',
      whatsapp: '919822014455',
      verified: true
    },
    _count: { applications: 22 }
  }
];

export default function JobsBoard() {
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_BOISAR_JOBS);
  const [loading, setLoading] = useState(false);
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

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?type=${typeFilter}&query=${query}&status=Open`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setJobs(data);
      } else {
        // Filter local fallback
        let filtered = DEFAULT_BOISAR_JOBS;
        if (typeFilter && typeFilter !== 'All') {
          filtered = filtered.filter(j => j.type.toLowerCase() === typeFilter.toLowerCase());
        }
        if (query.trim()) {
          const q = query.toLowerCase();
          filtered = filtered.filter(j => 
            j.title.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q) ||
            j.business.name.toLowerCase().includes(q)
          );
        }
        setJobs(filtered);
      }
    } catch {
      setJobs(DEFAULT_BOISAR_JOBS);
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
    const msg = encodeURIComponent(
      `Hello Majh Boisar! 👋\nI want to post a new job vacancy:\n\nCompany: ${postCompany}\nJob Title: ${postTitle}\nLocation: ${postLocation}\nType: ${postType}\nSalary: ${postSalary}\nContact: ${postPhone}\nDetails: ${postDesc}`
    );
    window.open(`https://wa.me/917769947217?text=${msg}`, '_blank');
    setShowPostModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-20 text-left text-slate-900">

      {/* Clean Professional Header (Clean White & Slate theme) */}
      <div className="bg-white border-b border-slate-200 py-5 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-4xl mx-auto space-y-3.5">
          
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Jobs in Boisar &amp; Tarapur MIDC
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Explore verified vacancies in factories, offices, shops, hotels &amp; hospitals.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Job</span>
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-slate-50 border border-slate-200 focus-within:border-slate-400 focus-within:bg-white p-1 rounded-xl shadow-2xs flex items-center gap-2 transition-all">
            <div className="flex-1 flex items-center pl-2.5 gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title, skill (e.g. Accounts, Supervisor, Receptionist)..."
                className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            {['All', 'Full Time', 'Part Time'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
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

      {/* Main Jobs Listing Section */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 mt-4 space-y-3">
        
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
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 sm:p-10 text-center my-2 space-y-3 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto text-2xl shadow-inner">
                💼
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">No Job Openings Listed Yet</h4>
                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                  Are you a factory in Tarapur MIDC, hotel, school, clinic, or local shop in Boisar looking for staff? Be the first to post a vacancy!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(true)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>➕ Post a Job Vacancy (100% Free)</span>
              </button>
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
            onClick={() => setShowPostModal(true)}
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
