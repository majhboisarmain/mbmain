'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Luggage, Phone, MessageSquare, ArrowLeft, AlertCircle
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
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 shadow-xs bg-slate-100 border border-slate-200/80">
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
    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-[#df4d32] to-[#c22e1b] text-white shadow-xs">
      <Luggage className="w-6 h-6 stroke-[2] text-white" />
    </div>
  );
}

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);

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
        const cleanUserPhone = (userPhone || '').replace(/\D/g, '').slice(-10);
        const cleanCreatedBy = (data.business?.createdBy || '').toString().replace(/\D/g, '').slice(-10);
        const cleanBizPhone = (data.business?.phone || '').toString().replace(/\D/g, '').slice(-10);

        if (adminToken) {
          setIsOwnerOrAdmin(true);
        } else if (cleanUserPhone && cleanUserPhone.length === 10) {
          if (cleanCreatedBy && cleanCreatedBy.length === 10 && cleanUserPhone === cleanCreatedBy) {
            setIsOwnerOrAdmin(true);
          } else if (cleanBizPhone && cleanUserPhone === cleanBizPhone) {
            setIsOwnerOrAdmin(true);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-slate-500 font-bold text-xs">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-base font-black text-slate-800 mb-1">Job Not Found</h2>
        <p className="text-slate-500 font-medium text-xs mb-4 max-w-xs">
          The job listing you are looking for might have been closed or removed.
        </p>
        <Link href="/jobs" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-bold text-xs">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const rawPhone = job.business?.whatsapp || job.business?.phone || '';
  const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '91');
  const whatsappTarget = cleanPhone ? (cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`) : null;
  const directCallPhone = job.business?.phone ? job.business.phone.replace(/\D/g, '') : null;

  const whatsappMsg = encodeURIComponent(
    `Hello ${job.business?.name || 'HR Team'}! 👋\nI am applying for "${job.title}" on Majh Boisar.\nPlease let me know interview timings.`
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-24 text-left text-slate-900">
      
      {/* Simple Top Navigation */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          {isOwnerOrAdmin && (
            <Link
              href="/adminmb"
              className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-all"
            >
              ✏️ Manage Post
            </Link>
          )}
        </div>
      </div>

      {/* Compact Main Card */}
      <div className="max-w-xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
          
          {/* Top Row: Brand Icon + Title/Company/Location */}
          <div className="flex items-start gap-3.5">
            <JobLogo image={job.business?.image} name={job.business?.name} />

            <div className="min-w-0 flex-1">
              <h1 className="text-[16px] sm:text-lg font-bold text-[#0284c7] leading-snug line-clamp-2 tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1 mt-0.5">
                {job.business?.name || 'Verified Company'}
              </p>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                {job.location || 'Boisar, Maharashtra'}
              </p>
            </div>
          </div>

          {/* Badges & Meta Row */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-2 border-t border-slate-100">
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
              {job.type || 'Full Time'}
            </span>

            {job.salary && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-lg">
                💰 {job.salary}
              </span>
            )}

            <span className="text-xs text-slate-400 font-medium ml-auto whitespace-nowrap">
              {timeAgo(job.createdAt)}
            </span>
          </div>

          {/* Clean Description */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Job Description
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-100">
              {job.description}
            </div>
          </div>

          {/* Direct Apply Buttons */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            {whatsappTarget && (
              <a
                href={`https://wa.me/${whatsappTarget}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <MessageSquare className="w-4 h-4 fill-white shrink-0" />
                <span>Apply on WhatsApp</span>
              </a>
            )}

            {directCallPhone && (
              <a
                href={`tel:${directCallPhone}`}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Call Employer</span>
              </a>
            )}
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Direct Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 sm:hidden z-40 shadow-lg flex gap-2">
        {whatsappTarget && (
          <a
            href={`https://wa.me/${whatsappTarget}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </a>
        )}
        {directCallPhone && (
          <a
            href={`tel:${directCallPhone}`}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
          >
            <Phone className="w-4 h-4" />
            <span>Call Employer</span>
          </a>
        )}
      </div>

    </div>
  );
}
