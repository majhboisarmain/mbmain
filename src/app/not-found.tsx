import Link from 'next/link';
import { Compass, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Badge & Icon */}
        <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-3xl flex items-center justify-center mx-auto text-teal-600 shadow-inner">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div>
          <span className="text-[10px] font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-wider border border-teal-100">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-slate-850 mt-3 tracking-tight">Page Not Found</h1>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            Aap jo page dhoondh rahe hain woh nahi mila ya remove ho gaya hai. Aap Majh Boisar Home par jaa sakte hain.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Boisar</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
