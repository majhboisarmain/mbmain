import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, ShieldCheck, MapPin, Users, HeartHandshake, 
  Search, Phone, CheckCircle2, ArrowRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Majh Boisar | Local Business & Community Directory',
  description: 'Learn about Majh Boisar — the official digital marketplace & local business directory connecting residents and business owners across Boisar, Palghar, and Tarapur MIDC.',
  alternates: {
    canonical: 'https://www.majhboisar.in/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="text-center space-y-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            About Our Platform
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Connecting Boisar Locally & Digitally
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Majh Boisar is the dedicated hyper-local search directory and community portal for Boisar, Tarapur MIDC, and Palghar district.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-teal-600" />
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Every neighbourhood hardware shop, doctor, restaurant, tuition teacher, and salon in Boisar deserves to be discoverable when customers search on Google or their phone. Majh Boisar provides authentic, verified business details so local residents can contact, visit, and order with confidence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <span className="text-2xl font-black text-teal-600">100%</span>
              <p className="text-xs text-slate-800 font-bold mt-1">Verified Local Businesses</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Authentic phone numbers & addresses</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <span className="text-2xl font-black text-teal-600">0%</span>
              <p className="text-xs text-slate-800 font-bold mt-1">Middlemen Commission</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct phone & WhatsApp calls to owners</p>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <span className="text-2xl font-black text-teal-600">24x7</span>
              <p className="text-xs text-slate-800 font-bold mt-1">Local Search Availability</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant search by name, service or PIN</p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Trust & Authenticity</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We strictly forbid fake reviews, dummy ratings, and fabricated coordinates. Every profile represents an actual business on the streets of Boisar.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hyper-Local Relevance</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From Boisar West, Ostwal Empire, Navapur Naka, to Tarapur MIDC, our listings are organized by exact locality so you find help right next door.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 border border-teal-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Own a Business in Boisar?</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
            Get your business listed on Google and Majh Boisar directory today for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard?register=true"
              className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              List Business for Free
            </Link>
            <Link
              href="/claim-business"
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Claim Existing Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
