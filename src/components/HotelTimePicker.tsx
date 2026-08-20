'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { HOURS_LIST_12, calculateStayWindow } from '@/lib/hotelsData';

interface HotelTimePickerProps {
  checkInTime: string; // e.g. "12:00 PM"
  onChange: (newTime: string) => void;
  durationSlot?: '3h' | '6h' | '12h';
  label?: string;
}

export default function HotelTimePicker({
  checkInTime = '12:00 PM',
  onChange,
  durationSlot = '3h',
  label = 'What Time ?'
}: HotelTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract AM / PM and hour from current value
  const isPM = (checkInTime || '12:00 PM').toUpperCase().includes('PM');
  const [activeAmPm, setActiveAmPm] = useState<'AM' | 'PM'>(isPM ? 'PM' : 'AM');

  useEffect(() => {
    const pm = (checkInTime || '12:00 PM').toUpperCase().includes('PM');
    setActiveAmPm(pm ? 'PM' : 'AM');
  }, [checkInTime]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const stayInfo = calculateStayWindow(checkInTime, durationSlot);

  const handleSelectHour = (hourStr: string) => {
    const formatted = `${hourStr} ${activeAmPm}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleToggleAmPm = (mode: 'AM' | 'PM') => {
    setActiveAmPm(mode);
    const hourPart = checkInTime.split(' ')[0] || '12:00';
    onChange(`${hourPart} ${mode}`);
  };

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-purple-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 transition-all flex items-center justify-between shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600/30"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-purple-900 shrink-0" />
          <span className="text-xs font-black text-slate-900">{checkInTime}</span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-900' : ''}`} />
      </button>

      {/* Stay Duration Preview Tag */}
      <div className="mt-1 flex items-center justify-between text-[10px] text-purple-950 bg-purple-50/80 border border-purple-200/60 rounded-lg px-2 py-0.5 font-bold">
        <span>⚡ Check-out: <strong className="text-purple-900">{stayInfo.endFormatted}</strong></span>
        <span className="text-slate-500 font-semibold">{stayInfo.isNextDay ? '(Next Day)' : `(${durationSlot})`}</span>
      </div>

      {/* Simple Clean Attached Dropdown Popover (Exact Reference UI) */}
      {isOpen && (
        <div 
          style={{ width: '270px', zIndex: 999 }}
          className="absolute top-full right-0 mt-1 bg-white rounded-2xl border border-purple-200 shadow-2xl p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-100 text-slate-800"
        >
          {/* AM / PM Segment Switcher */}
          <div className="flex justify-center">
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-1 border border-slate-200 w-full max-w-[140px]">
              <button
                type="button"
                onClick={() => handleToggleAmPm('AM')}
                className={`flex-1 py-1 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                  activeAmPm === 'AM'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handleToggleAmPm('PM')}
                className={`flex-1 py-1 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                  activeAmPm === 'PM'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* 4x3 Grid of 12 Hours */}
          <div className="grid grid-cols-4 gap-1.5">
            {HOURS_LIST_12.map((hourStr) => {
              const fullTimeStr = `${hourStr} ${activeAmPm}`;
              const isSelected = checkInTime.trim().toUpperCase() === fullTimeStr.toUpperCase();

              return (
                <button
                  type="button"
                  key={hourStr}
                  onClick={() => handleSelectHour(hourStr)}
                  className={`py-1.5 px-0.5 rounded-xl text-[11px] font-black text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-900 text-white font-black border-purple-950 shadow-xs'
                      : 'bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-900 border-slate-200'
                  }`}
                >
                  {hourStr}
                </button>
              );
            })}
          </div>

          {/* Bottom Footer: Duration & Done */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-bold">
              Duration: <strong className="text-purple-900">{durationSlot === '3h' ? '3 Hours' : durationSlot === '6h' ? '6 Hours' : '12 Hours'}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-purple-900 font-black hover:underline cursor-pointer"
            >
              Done ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
