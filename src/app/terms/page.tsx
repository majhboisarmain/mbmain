'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldAlert, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 text-slate-850 font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 text-left">
        
        {/* Back Link */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-100 pb-6 space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">Last Updated &amp; Effective Date: August 19, 2026</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
          <p>
            Please read these Terms of Service ("Terms") carefully before using the <strong>Majh Boisar</strong> platform, mobile application, and hyper-local city directory services. By accessing or using our services, you agree to be bound by these Terms.
          </p>

          {/* Directory Non-Liability Disclaimer */}
          <div className="p-4 sm:p-5 bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl space-y-2 text-xs text-amber-950 font-semibold leading-relaxed">
            <div className="flex items-center gap-2 font-black text-amber-950 uppercase text-xs">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>Platform Disclaimer &amp; Non-Liability Notice</span>
            </div>
            <p>
              Majh Boisar operates strictly as an <strong>intermediary search and information discovery platform</strong> connecting local consumers with independent third-party merchants, service providers, property owners, and employers in Boisar, Palghar, and Tarapur MIDC:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[11.5px] sm:text-xs text-amber-950 font-bold">
              <li><strong>Domestic Helpers / Service Professionals:</strong> Majh Boisar is not an employer or staffing agency. Employers must independently verify government identity (Aadhar Card, Police Verification) before hiring domestic helpers, drivers, or contractors.</li>
              <li><strong>Real Estate &amp; Properties:</strong> Majh Boisar holds zero financial or legal liability for property title ownership, 7/12 land records, builder agreements, or token advance transactions. Buyers/tenants must verify original legal documents independently.</li>
              <li><strong>Voluntary Blood Donors:</strong> The blood donor network is a voluntary humanitarian goodwill registry. Donors and recipients must verify medical compatibility under certified doctor supervision at accredited blood banks.</li>
            </ul>
          </div>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>1. Listing Eligibility &amp; Community Guidelines</span>
            </h2>
            <p>
              To list a business, service, job vacancy, or property on Majh Boisar, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-bold text-[11.5px] sm:text-xs">
              <li>Your listing represents a genuine business, service, or opportunity active in Boisar, Palghar, or Tarapur MIDC.</li>
              <li>You provide accurate, up-to-date business contact numbers, operational hours, and physical address.</li>
              <li>You will not post illegal, counterfeit, fraudulent, adult, defamatory, or misleading content. Violating listings will be removed immediately without refund.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>2. Subscriptions, Advertising &amp; Payments</span>
            </h2>
            <p>
              Merchants may purchase promotional packages (e.g. Starter, Pro, Auto Rickshaw Poster Ads, Hotel Partner Pass):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-bold text-[11.5px] sm:text-xs">
              <li>Subscription prices and durations are transparently displayed in the Merchant Dashboard and Ad Pricing sections.</li>
              <li>Subscriptions and advertising slots become active immediately upon verification.</li>
              <li>Refund requests are evaluated case-by-case within 48 hours of purchase if advertising services could not be delivered due to technical failure.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>3. User Accounts &amp; Mobile OTP Security</span>
            </h2>
            <p>
              Users access their accounts through Mobile OTP verification. You are responsible for all activities that occur under your registered mobile number. If you suspect unauthorized access, contact us immediately.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>4. Intellectual Property</span>
            </h2>
            <p>
              The Majh Boisar name, logos, website design, trademarks, software code, and interface elements are the proprietary intellectual property of Majh Boisar. Merchant trade names and logos belong to their respective registered owners.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>5. Governing Law &amp; Jurisdiction</span>
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Palghar District, Maharashtra, India</strong>.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>6. Contact Us</span>
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1 font-bold text-[11.5px] sm:text-xs text-slate-700">
              <p className="text-slate-900 font-black">🏢 Majh Boisar Support &amp; Legal Desk</p>
              <p>📍 <strong>Address:</strong> Boisar, Palghar, Maharashtra, India - 401501</p>
              <p>✉️ <strong>Email:</strong> majhboisar@gmail.com</p>
              <p>🌐 <strong>Website:</strong> https://majhboisar.in</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-6 text-center">
          <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">
            Majh Boisar &copy; {new Date().getFullYear()} — All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
