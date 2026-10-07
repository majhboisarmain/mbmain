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
    canonical: 'https://majhboisar.in/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            About Our Platform
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connecting Boisar Locally & Digitally
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Majh Boisar is the dedicated hyper-local search directory and community portal for Boisar, Tarapur MIDC, and Palghar district.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-teal-400" />
            Our Mission
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Every neighbourhood hardware shop, doctor, restaurant, tuition teacher, and salon in Boisar deserves to be discoverable when customers search on Google or their phone. Majh Boisar provides authentic, verified business details so local residents can contact, visit, and order with confidence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
            <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-2xl font-extrabold text-teal-400">100%</span>
              <p className="text-xs text-slate-300 font-semibold mt-1">Verified Local Businesses</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Authentic phone numbers & addresses</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-2xl font-extrabold text-teal-400">0%</span>
              <p className="text-xs text-slate-300 font-semibold mt-1">Middlemen Commission</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Direct phone & WhatsApp calls to owners</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-2xl">
              <span className="text-2xl font-extrabold text-teal-400">24x7</span>
              <p className="text-xs text-slate-300 font-semibold mt-1">Local Search Availability</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant search by name, service or PIN</p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Trust & Authenticity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We strictly forbid fake reviews, dummy ratings, and fabricated coordinates. Every profile represents an actual business on the streets of Boisar.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Hyper-Local Relevance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              From Boisar West, Ostwal Empire, Navapur Naka, to Tarapur MIDC, our listings are organized by exact locality so you find help right next door.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-teal-900/60 to-slate-800 border border-teal-500/30 rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Own a Business in Boisar?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Get your business listed on Google and Majh Boisar directory today for free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/register-business"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
            >
              List Business for Free
            </Link>
            <Link
              href="/claim-business"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
            >
              Claim Existing Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
