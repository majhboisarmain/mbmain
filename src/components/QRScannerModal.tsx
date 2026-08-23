'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, QrCode, Search, Camera, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScannerModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualCode, setManualCode] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  if (!isOpen) return null;

  const startCamera = () => {
    setCameraError('');
    setIsCameraActive(true);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          setCameraError('Camera permission not allowed. Please use your Phone Camera / Google Lens.');
          setIsCameraActive(false);
        });
    } else {
      setCameraError('Camera is not supported on this device.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const query = manualCode.trim();
    if (query.includes('majhboisar.in') || query.startsWith('/') || query.startsWith('http')) {
      try {
        const url = new URL(query, window.location.origin);
        router.push(url.pathname + url.search);
      } catch (e) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 text-left">
      <div className="bg-white rounded-3xl max-w-sm w-full border border-slate-100 shadow-2xl overflow-hidden text-slate-800 flex flex-col relative p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900">Scan QR Code</h3>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Camera (if active) */}
        {isCameraActive ? (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            <div className="absolute inset-0 m-auto w-44 h-44 border-2 border-dashed border-teal-400 rounded-2xl pointer-events-none" />
            <button
              onClick={stopCamera}
              className="absolute bottom-3 bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-md hover:bg-white"
            >
              Close Camera
            </button>
          </div>
        ) : (
          /* Simple QR Illustration & Instruction */
          <div className="text-center py-3 px-2 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
              <QrCode className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">
                Scan Any Shop Standee or Menu
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                Open your <strong>Phone Camera</strong>, <strong>Google Lens</strong>, or <strong>Paytm</strong> to scan directly.
              </p>
            </div>

            {/* Quick in-browser camera button */}
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-white hover:bg-teal-50 border border-teal-200 px-3.5 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Use Web Camera</span>
            </button>

            {cameraError && (
              <p className="text-[10px] text-amber-700 bg-amber-50 rounded-lg p-1.5 border border-amber-200">
                {cameraError}
              </p>
            )}
          </div>
        )}

        {/* Quick Search Form */}
        <form onSubmit={handleManualSearch} className="space-y-2 pt-1">
          <label className="text-[11px] font-bold text-slate-500 block">
            Or search shop name directly:
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-teal-500 focus-within:bg-white rounded-xl px-3 py-2 flex items-center gap-2 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter shop or business name..."
                className="w-full text-xs font-bold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
            >
              Search
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
