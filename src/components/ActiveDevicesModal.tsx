'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Tablet,
  ShieldCheck,
  LogOut,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DeviceSessionItem {
  id: string;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  deviceBrand: string;
  browser: string;
  ip?: string;
  createdAt: number;
  lastActive: number;
  isCurrent: boolean;
}

interface ActiveDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActiveDevicesModal({ isOpen, onClose }: ActiveDevicesModalProps) {
  const { loggedInUser, showToast, logout } = useApp();
  const [sessions, setSessions] = useState<DeviceSessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const phone = loggedInUser?.phone || '';

  const fetchSessions = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_session_id') || '' : '';
      const res = await fetch(`/api/auth/sessions?phone=${encodeURIComponent(phone)}&sessionId=${encodeURIComponent(currentSessionId)}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.sessions) {
        setSessions(data.sessions);

        // If current session was revoked from elsewhere, trigger clean logout!
        if (data.currentSessionValid === false && currentSessionId) {
          showToast('⚠️ Your session was logged out from another device.', 'error', 5000);
          logout();
          onClose();
        }
      }
    } catch (e) {
      console.error('Error fetching sessions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen, phone]);

  if (!isOpen) return null;

  const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_session_id') || '' : '';

  const handleLogoutAllOthers = async () => {
    if (!confirm('Are you sure you want to log out all other devices? They will need to verify with OTP again.')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logout_all_others',
          phone,
          sessionId: currentSessionId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast('🔒 All other devices have been logged out successfully.', 'success', 4000);
        fetchSessions();
      } else {
        showToast(data.error || 'Failed to logout other devices.', 'error');
      }
    } catch {
      showToast('Network error while logging out other devices.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoutSingleDevice = async (targetId: string, deviceName: string) => {
    if (!confirm(`Log out from "${deviceName}"?`)) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logout_device',
          phone,
          targetSessionId: targetId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast(`Logged out from ${deviceName}.`, 'info');
        setSessions(prev => prev.filter(s => s.id !== targetId));
      } else {
        showToast(data.error || 'Failed to logout device.', 'error');
      }
    } catch {
      showToast('Error removing device session.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatTimestamp = (ts: number) => {
    if (!ts) return 'Active recently';
    const date = new Date(ts);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const otherSessions = sessions.filter(s => !s.isCurrent && s.id !== currentSessionId);
  const currentSession = sessions.find(s => s.isCurrent || s.id === currentSessionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">Logged-in Devices</h3>
              <p className="text-[11px] font-medium text-slate-500">
                Kaha-Kaha aapka account active hai
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchSessions}
              disabled={loading}
              title="Refresh device list"
              className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active User Info Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div>
              <p className="text-xs font-black text-slate-900">{loggedInUser?.name || 'My Account'}</p>
              <p className="text-[11px] font-mono font-bold text-teal-700 mt-0.5">+91 {phone}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/70 border border-emerald-300/60 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Verified Mobile
            </span>
          </div>

          {loading && sessions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <div className="w-7 h-7 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400">Loading active sessions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* CURRENT DEVICE CARD */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  This Device (Currently Using)
                </p>
                <div className="p-4 rounded-2xl bg-teal-50/50 border-2 border-teal-500/30 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      {currentSession?.deviceType === 'Desktop' ? (
                        <Laptop className="w-5 h-5" />
                      ) : currentSession?.deviceType === 'Tablet' ? (
                        <Tablet className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900 truncate">
                          {currentSession?.deviceBrand || 'Current Phone / Browser'}
                        </span>
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          🟢 Active Now
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {currentSession?.browser || 'Web Browser'} • Logged in: {formatTimestamp(currentSession?.createdAt || Date.now())}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* OTHER DEVICES */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Other Logged-in Devices ({otherSessions.length})
                  </p>
                </div>

                {otherSessions.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Aapka account bilkul safe hai!</p>
                    <p className="text-[11px] text-slate-400">
                      Kisi dusre phone ya computer me login nahi hai.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {otherSessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            {session.deviceType === 'Desktop' ? (
                              <Laptop className="w-4 h-4" />
                            ) : session.deviceType === 'Tablet' ? (
                              <Tablet className="w-4 h-4" />
                            ) : (
                              <Smartphone className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {session.deviceBrand} ({session.browser})
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Login: {formatTimestamp(session.createdAt)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleLogoutSingleDevice(session.id, session.deviceBrand)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          Log Out
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Alert Note */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              <strong>Security Rule:</strong> Agar aapko koi anjaan device dikhe, toh turant niche diye gaye button se sabhi dusre phones se logout kar dein.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {otherSessions.length > 0 ? (
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleLogoutAllOthers}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out From All Other Devices</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Single active session secured</span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
