'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Eye, Lock, FileText, CheckCircle, Trash2, Mail, Phone, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">Last Updated &amp; Effective Date: August 19, 2026</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
          <p>
            Welcome to <strong>Majh Boisar</strong> ("we," "our," or "us"), the hyper-local business discovery, jobs, properties, and community directory for Boisar, Tarapur MIDC, and Palghar district. We are committed to protecting your privacy and ensuring your personal data is handled in a safe, responsible, and transparent manner in compliance with the <strong>Digital Personal Data Protection (DPDP) Act</strong> and <strong>Google Play Developer Policies</strong>.
          </p>

          {/* Section 1: Information We Collect */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>1. Information We Collect</span>
            </h2>
            <p>
              When you use our website or mobile application (PWA/Android app), we collect the following categories of data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-bold text-[11.5px] sm:text-xs">
              <li><strong>User Account Information:</strong> Name, mobile phone number, WhatsApp number, and role when you log in via Mobile OTP.</li>
              <li><strong>Business Listings &amp; KYC:</strong> Business name, shop categories, address, landmarks, operational hours, photos, tariff/catalog details, and contact numbers.</li>
              <li><strong>Voluntary Blood Donors:</strong> Name, blood group, general locality in Boisar, and mobile number submitted voluntarily for emergency community lifesaver network.</li>
              <li><strong>Job Postings &amp; Applications:</strong> Employer company name, job vacancy description, salary range, applicant resume details, and phone numbers.</li>
              <li><strong>Device &amp; Usage Information:</strong> Coarse geolocation (city/area in Boisar), IP address, browser type, device model, operating system, and crash logs for performance optimization.</li>
            </ul>
          </div>

          {/* Section 2: How We Use Information */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>2. How We Use Your Information</span>
            </h2>
            <p>
              We use the collected information solely for legitimate operational and community purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-bold text-[11.5px] sm:text-xs">
              <li>To display your business, property, or service to local searchers in Boisar &amp; Palghar.</li>
              <li>To enable direct 1-click calls and WhatsApp chats between customers and local merchants.</li>
              <li>To send secure 4-digit One-Time Passwords (OTPs) for account login and verification via certified SMS gateway.</li>
              <li>To provide merchants with dashboard analytics, customer inquiries, and subscription management.</li>
              <li>To prevent spam, fraudulent listings, unauthorized advertising, and malicious platform misuse.</li>
            </ul>
          </div>

          {/* Section 3: Third-Party Service Providers */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>3. Third-Party Service Providers &amp; SDK Disclosures</span>
            </h2>
            <p>
              We do <strong>NOT</strong> sell, rent, or trade your personal data. We only share necessary data with trusted service providers who adhere to strict security and privacy standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 font-bold text-[11.5px] sm:text-xs">
              <li><strong>SMS Gateway (Spring Edge):</strong> Used exclusively to deliver transactional OTPs and verification SMS alerts to your phone.</li>
              <li><strong>Cloud Storage (Cloudinary / Image Services):</strong> Used for secure hosting and delivery of merchant storefront images, menus, and gallery photos.</li>
              <li><strong>Mapping Services (OpenStreetMap / Google Maps):</strong> Used to render location directions and pinpoints for local businesses.</li>
              <li><strong>Hosting &amp; Analytics (Vercel):</strong> Encrypted cloud server infrastructure with SSL/TLS protection.</li>
            </ul>
          </div>

          {/* Section 4: Data Security */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>4. Data Security &amp; Protection</span>
            </h2>
            <p>
              All communication between your device and our servers is strictly encrypted using <strong>HTTPS / SSL 256-bit encryption</strong>. We implement passwordless OTP verification to eliminate credential theft, and access to merchant dashboards is strictly isolated by authenticated phone number ownership.
            </p>
          </div>

          {/* Section 5: MANDATORY GOOGLE PLAY ACCOUNT & DATA DELETION */}
          <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-2.5 text-xs text-rose-950 font-semibold leading-relaxed">
            <div className="flex items-center gap-2 font-black text-rose-950 uppercase text-xs">
              <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
              <span>5. Account Deletion &amp; Data Erasure (User Rights)</span>
            </div>
            <p>
              In full compliance with <strong>Google Play User Data Policies</strong>, you have the absolute right to request the complete deletion of your user account, business listings, phone number, and all associated data at any time.
            </p>
            <div className="space-y-1.5 text-[11.5px] text-rose-900 font-bold">
              <p><strong>How to request deletion:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>In-App / Self-Service:</strong> If listed as a Blood Donor, click "Unlist Me" on the Blood Donation page. For businesses or jobs, use the Delete option inside your Dashboard.</li>
                <li><strong>Email Request:</strong> Send an email mentioning your registered mobile number to <strong className="text-rose-700 underline">majhboisar@gmail.com</strong> with the subject <em>"Delete My Account"</em>.</li>
              </ul>
              <p className="pt-1 text-[11px] text-rose-800 font-medium">
                Upon receiving your request, all personal data, listing assets, and login records will be permanently deleted from our database within <strong>48 to 72 hours</strong>.
              </p>
            </div>
          </div>

          {/* Section 6: Children's Privacy */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>6. Children's Privacy</span>
            </h2>
            <p>
              Our services are directed toward adult consumers and business owners. We do not knowingly collect personal information from children under 13 years of age. If you believe a child has provided us with personal information, please contact us immediately for prompt deletion.
            </p>
          </div>

          {/* Section 7: Grievance Officer & Contact Us */}
          <div className="space-y-3">
            <h2 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="h-3.5 w-1.5 bg-teal-600 rounded-full"></span>
              <span>7. Grievance Officer &amp; Official Contact</span>
            </h2>
            <p>
              In accordance with the Information Technology Act 2000 and DPDP Act, the name and contact details of our Grievance Officer are provided below:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 font-bold text-[11.5px] sm:text-xs text-slate-700">
              <p className="text-slate-900 font-black">🏢 Majh Boisar Media &amp; City Directory</p>
              <p>👤 <strong>Grievance Officer:</strong> Data Privacy Desk</p>
              <p>📍 <strong>Registered Address:</strong> Boisar, Palghar District, Maharashtra, India - 401501</p>
              <p>✉️ <strong>Official Email:</strong> majhboisar@gmail.com</p>
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
