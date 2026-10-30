'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, Store, Search, MessageSquare } from 'lucide-react';

const SUPPORT_PHONE = '917769947217';

export default function WhatsAppHelpFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleOptionClick = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${SUPPORT_PHONE}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const options = [
    {
      id: 'biz_reg',
      icon: Store,
      title: 'Business Registration',
      message: 'Hello Majh Boisar Team! 🏪 Mujhe apna business Majh Boisar par register/list karne me help chahiye.'
    },
    {
      id: 'search',
      icon: Search,
      title: 'Help in Searching',
      message: 'Hello Majh Boisar Team! 🔍 Mujhe Boisar me ek shop / service / doctor dhoondhne me help chahiye.'
    },
    {
      id: 'other',
      icon: MessageSquare,
      title: 'General Support',
      message: 'Hello Majh Boisar Team! 💬 Mujhe Majh Boisar portal ke baare me support / help chahiye.'
    }
  ];

  return (
    <aside aria-label="WhatsApp Support Help Desk" ref={containerRef} className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-50">
      {/* Clean & Compact Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-13 left-0 w-[240px] sm:w-[260px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 text-slate-800">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
              <span className="text-[11px] font-black tracking-wide text-slate-800">WhatsApp Help</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimal 3 Clickable Rows */}
          <div className="space-y-0.5">
            {options.map((opt) => {
              const IconComp = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionClick(opt.message)}
                  className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between group active:scale-98"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-[#25D366] flex items-center justify-center shrink-0 transition-colors">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-slate-950 truncate">
                      {opt.title}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Small Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open WhatsApp Help Desk"
        className={`w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white relative ${
          isOpen ? 'bg-slate-800 hover:bg-slate-900' : 'bg-[#25D366] hover:bg-[#20ba59]'
        }`}
        title="Need Help? Chat on WhatsApp"
      >
        {isOpen ? (
          <X className="w-4 h-4 text-white" />
        ) : (
          <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </aside>
  );
}
