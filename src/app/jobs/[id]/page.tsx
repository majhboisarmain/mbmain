'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, MapPin, Clock, Briefcase, Phone, MessageSquare, 
  ArrowLeft, FileText, CheckCircle, UploadCloud, AlertCircle
} from 'lucide-react';

import { useApp } from '@/context/AppContext';

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
    id: number;
    name: string;
    image: string;
    location: string;
    phone: string;
    whatsapp: string;
    verified: boolean;
    address: string;
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useApp();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);

  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'link'>('file');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please select a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setResumeUrl(event.target.result as string);
        setResumeFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (showApplyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showApplyModal]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Job not found');
        const data = await res.json();
        setJob(data);

        // Check if poster or admin
        const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const userPhone = typeof window !== 'undefined' ? (localStorage.getItem('userPhone') || localStorage.getItem('userWhatsapp')) : null;
        if (adminToken || (userPhone && data.business?.phone && (userPhone.includes(data.business.phone) || data.business.phone.includes(userPhone)))) {
          setIsOwnerOrAdmin(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Name and Phone number are required.", "warning");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantName: name, applicantPhone: phone, applicantEmail: email, resumeUrl, coverLetter })
      });
      if (!res.ok) throw new Error('Failed to submit application');
      
      setSuccess(true);
      showToast('Job application submitted successfully! 💼', 'success');
      setTimeout(() => {
        setSuccess(false);
        setShowApplyModal(false);
      }, 3000);
    } catch (e: any) {
      showToast(e.message || "Failed to submit application", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold text-sm">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-black text-slate-800 mb-2">Job Not Found</h2>
        <p className="text-slate-500 font-medium text-sm mb-6 text-center max-w-sm">
          The job listing you're looking for might have been removed or closed by the employer.
        </p>
        <Link href="/jobs" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-24">
      
      {/* Navbar Minimal */}
      <div className="pt-6 pb-2">
        <div className="max-w-2xl mx-auto px-4 flex items-center">
          <Link href="/jobs" className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold text-sm transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm mb-6">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start justify-between mb-8">
            <div className="flex gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {job.business.image ? (
                  <img src={job.business.image} alt={job.business.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1.5">
                  {job.title}
                </h1>
                <Link href={`/business/${job.business.id}`} className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1.5 mb-2.5">
                  <Building2 className="w-4 h-4" />
                  {job.business.name}
                  {job.business.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                </Link>
                
                <div className="flex flex-wrap gap-2.5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    job.type === 'Full Time' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                    job.type === 'Part Time' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {job.type}
                  </span>
                  {job.status === 'Open' ? (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Actively Hiring
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                      Closed
                    </span>
                  )}

                  {isOwnerOrAdmin && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                      🔑 You manage this post
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Desktop / Owner Edit Controls */}
            <div className="hidden sm:flex flex-col gap-2 min-w-[160px]">
              {isOwnerOrAdmin ? (
                <Link
                  href="/adminmb"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  ✏️ Edit / Manage Listing
                </Link>
              ) : (
                <button 
                  onClick={() => setShowApplyModal(true)}
                  disabled={job.status !== 'Open'}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-black py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Apply Now
                </button>
              )}
            </div>
          </div>

          <hr className="border-slate-100 my-6" />

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <MapPin className="w-5 h-5 text-rose-500 mb-2" />
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-xs font-black text-slate-800">{job.location}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <Briefcase className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Job Type</p>
              <p className="text-xs font-black text-slate-800">{job.type}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <span className="text-lg font-black text-teal-600 mb-1 block">₹</span>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Salary</p>
              <p className="text-xs font-black text-slate-800">{job.salary || 'Not Disclosed'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <Clock className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">Posted</p>
              <p className="text-xs font-black text-slate-800">{timeAgo(job.createdAt)}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" /> Job Description
            </h3>
            <div className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {job.description}
            </div>
          </div>

          {/* Contact Direct */}
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" /> Apply Directly to Employer
            </h3>
            <div className="flex flex-col sm:flex-row gap-2.5">
              {job.business.whatsapp && (
                <a 
                  href={`https://wa.me/${job.business.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Hi, I saw your job opening for "${job.title}" on Majh Boisar and I am interested to apply!`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebf58] text-white px-5 py-3 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.48 2.016 14.005 1.002 11.995 1.002 6.559 1.002 2.135 5.372 2.131 10.801c-.001 1.76.46 3.479 1.336 5.003L2.5 21.53l5.837-1.526-.69.41z"/></svg> 
                  Apply via WhatsApp
                </a>
              )}
              {job.business.phone && (
                <a 
                  href={`tel:${job.business.phone}`} 
                  className="flex-1 flex items-center justify-center gap-2 bg-[#09843c] hover:bg-[#07682f] text-white px-5 py-3 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Phone className="w-4 h-4" /> Call Employer ({job.business.phone})
                </a>
              )}
              <button 
                onClick={() => setShowApplyModal(true)}
                className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4" /> Submit Application Form
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden z-40 shadow-[0_-10px_25px_rgba(0,0,0,0.1)] flex gap-2">
        {job.business.whatsapp ? (
          <a 
            href={`https://wa.me/${job.business.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Hi, I saw your job opening for "${job.title}" on Majh Boisar and I am interested to apply!`)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 bg-[#25D366] text-white font-black py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.48 2.016 14.005 1.002 11.995 1.002 6.559 1.002 2.135 5.372 2.131 10.801c-.001 1.76.46 3.479 1.336 5.003L2.5 21.53l5.837-1.526-.69.41z"/></svg>
            WhatsApp
          </a>
        ) : null}
        <button 
          onClick={() => setShowApplyModal(true)}
          disabled={job.status !== 'Open'}
          className="flex-1 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-black py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs active:scale-95"
        >
          <FileText className="w-4 h-4" /> {job.status === 'Open' ? 'Apply Now' : 'Closed'}
        </button>
      </div>

      {/* Apply Modal Form */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Application Sent!</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">Your details have been shared with {job.business.name}. They will contact you shortly.</p>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 px-8 rounded-xl w-full transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Apply for Job</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{job.title}</p>
                  </div>
                  <button onClick={() => setShowApplyModal(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <form onSubmit={handleApply} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Full Name *</label>
                      <input 
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Mobile Number *</label>
                      <input 
                        type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Email (Optional)</label>
                      <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Resume / CV (Optional)</label>
                        <div className="flex items-center gap-1 text-[9px] font-bold">
                          <button
                            type="button"
                            onClick={() => setUploadMode('file')}
                            className={`px-1.5 py-0.5 rounded transition-all ${uploadMode === 'file' ? 'bg-teal-100 text-teal-700 font-black' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            Upload
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => setUploadMode('link')}
                            className={`px-1.5 py-0.5 rounded transition-all ${uploadMode === 'link' ? 'bg-teal-100 text-teal-700 font-black' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            Link
                          </button>
                        </div>
                      </div>

                      {uploadMode === 'file' ? (
                        <div>
                          {resumeFileName ? (
                            <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5 text-xs font-bold text-teal-800">
                              <div className="flex items-center gap-1.5 truncate pr-1">
                                <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                <span className="truncate text-[11px]">{resumeFileName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setResumeUrl('');
                                  setResumeFileName('');
                                }}
                                className="text-slate-400 hover:text-rose-500 font-black p-0.5 transition-colors"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <label className="border border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 rounded-xl px-3 py-2 flex items-center justify-center gap-2 cursor-pointer transition-all group">
                              <UploadCloud className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                              <span className="text-xs font-bold text-slate-600 group-hover:text-teal-700">
                                Upload File (PDF/DOC)
                              </span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                onChange={handleFileSelect}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <div className="relative">
                          <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={resumeUrl.startsWith('data:') ? '' : resumeUrl} 
                            onChange={(e) => {
                              setResumeUrl(e.target.value);
                              setResumeFileName('');
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            placeholder="Google Drive link"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Short Cover Letter (Optional)</label>
                    <textarea 
                      rows={2} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      placeholder="Why are you a good fit for this role?"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-black py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>Submit Application</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
