'use client';

import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string | number;
  listingType?: string;
  listingName?: string;
}

export default function ReportModal({ isOpen, onClose, listingId, listingType = 'business', listingName }: ReportModalProps) {
  const [reason, setReason] = useState('Wrong / Disconnected Mobile Number');
  const [customDetail, setCustomDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fullReason = reason === 'Other' ? `Other: ${customDetail}` : reason;
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listingId.toString(),
          listingType,
          reason: fullReason,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 z-10 overflow-hidden text-left animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-rose-600 p-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-200" />
            <h3 className="text-base font-black">Report Invalid Listing</h3>
          </div>
          <p className="text-rose-100 text-[11px] font-medium mt-0.5 truncate">
            Report {listingName ? `"${listingName}"` : 'this listing'} to Majh Boisar Moderation Team
          </p>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-black text-slate-800">Report Submitted!</h4>
            <p className="text-xs text-slate-500 font-medium">Thank you for keeping Boisar community safe. Our team will review this listing shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Select Reason for Report <span className="text-rose-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
              >
                <option value="Wrong / Disconnected Mobile Number">Wrong / Disconnected Mobile Number</option>
                <option value="Fake Listing / Scammer">Fake Listing / Scammer</option>
                <option value="Incorrect Price / Charges">Incorrect Price / Charges</option>
                <option value="Business Permanently Closed">Business Permanently Closed</option>
                <option value="Inappropriate / Spam Content">Inappropriate / Spam Content</option>
                <option value="Other">Other Reason</option>
              </select>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">
                  Describe Issue Details
                </label>
                <textarea
                  value={customDetail}
                  onChange={(e) => setCustomDetail(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                  placeholder="Please specify why this listing is invalid..."
                  required
                />
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
