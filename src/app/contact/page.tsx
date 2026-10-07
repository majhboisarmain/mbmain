import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Phone, MessageSquare, Mail, MapPin, 
  Clock, ShieldAlert, ArrowRight, HelpCircle 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Majh Boisar | Directory Support & Business Helpline',
  description: 'Get in touch with the Majh Boisar directory team. Report incorrect business details, request profile corrections, or speak with our local business support desk.',
  alternates: {
    canonical: 'https://majhboisar.in/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
            <Phone className="w-3.5 h-3.5" />
            Support & Help Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Majh Boisar
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Need help listing your store, claiming your business page, or reporting outdated information? Reach out to our local team.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Phone */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Call Support</h3>
            <p className="text-xs text-slate-400">Monday to Saturday, 9am - 8pm</p>
            <a
              href="tel:917769947217"
              className="inline-block text-sm font-extrabold text-teal-400 hover:text-teal-300 pt-1"
            >
              +91 77699 47217
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">WhatsApp Desk</h3>
            <p className="text-xs text-slate-400">Fast assistance for shop owners</p>
            <a
              href="https://wa.me/917769947217?text=Hello%20Majh%20Boisar%20Support!%20I%20have%20an%20enquiry%20regarding%20business%20directory."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-extrabold text-emerald-400 hover:text-emerald-300 pt-1"
            >
              Chat on WhatsApp &rarr;
            </a>
          </div>

          {/* Location */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Location</h3>
            <p className="text-xs text-slate-400">Boisar West, Palghar District</p>
            <span className="text-xs font-semibold text-slate-300 pt-1 block">
              Maharashtra 401501, India
            </span>
          </div>
        </div>

        {/* Report / Grievance Card */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Report Incorrect or Duplicate Business Information
              </h2>
              <p className="text-xs text-slate-400">
                Help us keep Majh Boisar directory 100% accurate and spam-free
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If you found a business that has closed down, changed its phone number, moved to a different address, or is improperly claiming someone else’s trademark, please message us on WhatsApp with the business URL. We review and update listings within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
