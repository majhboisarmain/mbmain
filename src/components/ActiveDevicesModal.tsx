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
    if (!confirm('Log out all other devices?')) return;

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
        showToast('🔒 All other devices logged out.', 'success');
        fetchSessions();
      } else {
        showToast(data.error || 'Failed to logout devices.', 'error');
      }
    } catch {
      showToast('Network error while logging out.', 'error');
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
    if (!ts) return 'Active now';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Simple & Clean */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">Logged-in Devices</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">+91 {phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchSessions}
              disabled={loading}
              title="Refresh"
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body - Clean & Short */}
        <div className="p-5 space-y-3.5">
          {loading && sessions.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400">Checking devices...</p>
            </div>
          ) : (
            <>
              {/* CURRENT DEVICE */}
              <div className="p-3.5 rounded-2xl bg-teal-50/40 border border-teal-200/60 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    {currentSession?.deviceType === 'Desktop' ? (
                      <Laptop className="w-4.5 h-4.5" />
                    ) : currentSession?.deviceType === 'Tablet' ? (
                      <Tablet className="w-4.5 h-4.5" />
                    ) : (
                      <Smartphone className="w-4.5 h-4.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">
                      {currentSession?.deviceBrand || 'This Phone / Browser'}
                    </p>
                    <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                      {currentSession?.browser || 'Web Browser'} • Active now
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  🟢 This Device
                </span>
              </div>

              {/* OTHER DEVICES */}
              {otherSessions.length === 0 ? (
                <div className="py-3 px-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center flex items-center justify-center gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">No other devices active. Safe &amp; Secure!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                    Other Logged-in Devices ({otherSessions.length})
                  </p>
                  {otherSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2.5 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          {session.deviceType === 'Desktop' ? (
                            <Laptop className="w-4 h-4" />
                          ) : (
                            <Smartphone className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {session.deviceBrand} ({session.browser})
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {formatTimestamp(session.createdAt)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleLogoutSingleDevice(session.id, session.deviceBrand)}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        Log Out
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={handleLogoutAllOthers}
                    className="w-full mt-2 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out From All Other Devices</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Short & Compact */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
