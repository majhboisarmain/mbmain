'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import ToastContainer, { ToastItem, ToastType } from '@/components/ToastContainer';

export type Role = 'Guest' | 'User' | 'BusinessOwner' | 'Admin';

interface LoggedInUser {
  name: string;
  phone: string;
  email?: string;
}

interface AppContextType {
  currentRole: Role;
  setRole: (role: Role) => void;
  selectedBusinessId: number;
  setSelectedBusinessId: (id: number) => void;
  userName: string;
  userEmail: string;
  isLoggedIn: boolean;
  loggedInUser: LoggedInUser | null;
  login: (name: string, phone: string, email?: string) => void;
  logout: () => void;
  updateUserProfile: (name: string, email?: string) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  adModalOpen: boolean;
  setAdModalOpen: (open: boolean) => void;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  // Business registration status — single source of truth across the entire app
  hasRegisteredBusiness: boolean;
  setHasRegisteredBusiness: (val: boolean) => void;
  checkBusinessStatus: (phone: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setRoleState] = useState<Role>('Guest');
  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(1);
  
  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);

  // Business registration status — persisted in localStorage as a hint, validated via API
  const [hasRegisteredBusiness, setHasRegisteredBusinessState] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (message: string, type: ToastType = 'success', duration = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, duration);
  };

  const setRole = (role: Role) => {
    setRoleState(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_role', role);
    }
  };

  const setHasRegisteredBusiness = (val: boolean) => {
    setHasRegisteredBusinessState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_has_business', val ? 'true' : 'false');
    }
  };

  /**
   * Check if the logged-in user (identified by phone number) has any business
   * registered in the database. This is the SINGLE SOURCE OF TRUTH for business status.
   */
  const checkBusinessStatus = async (phone: string) => {
    if (!phone) return;
    try {
      const phoneDigits = phone.replace(/\D/g, '');
      if (!phoneDigits) return;

      const res = await fetch('/api/businesses?showAll=true');
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      let savedIds: number[] = [];
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(`majh_boisar_my_biz_ids_${phoneDigits}`) || localStorage.getItem('majh_boisar_my_biz_ids');
          if (raw) savedIds = JSON.parse(raw);
        } catch(e){}
      }

      const last7 = phoneDigits.slice(-7);
      const myBiz = data.filter((b: any) => {
        if (savedIds.includes(b.id)) return true;
        const bizPhone = (b.phone || '').replace(/\D/g, '');
        const bizWa = (b.whatsapp || '').replace(/\D/g, '');
        const bizCreatedBy = (b.createdBy || '').replace(/\D/g, '');
        return (
          // Match by business contact phone (last 7 digits)
          (last7 && (bizPhone.includes(last7) || bizWa.includes(last7))) ||
          // Match by exact createdBy phone number stored at registration time
          (bizCreatedBy && phoneDigits.includes(bizCreatedBy.slice(-7))) ||
          // Match by exact createdBy = user phone stored at registration
          b.createdBy === phone ||
          b.createdBy === phoneDigits
        );
      });

      const hasBusiness = myBiz.length > 0;
      setHasRegisteredBusinessState(hasBusiness);
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_has_business', hasBusiness ? 'true' : 'false');
      }

      // Do not overwrite Admin role if currently authenticated as Admin
      const currentSavedRole = typeof window !== 'undefined' ? localStorage.getItem('majh_boisar_role') : null;
      if (currentSavedRole === 'Admin' || currentRole === 'Admin') {
        return;
      }

      // Automatically upgrade role to BusinessOwner if they have a business
      if (hasBusiness) {
        setRoleState('BusinessOwner');
        if (typeof window !== 'undefined') {
          localStorage.setItem('majh_boisar_role', 'BusinessOwner');
        }
      } else {
        setRoleState('User');
        if (typeof window !== 'undefined') {
          localStorage.setItem('majh_boisar_role', 'User');
        }
      }
    } catch (e) {
      console.error('checkBusinessStatus error:', e);
    }
  };

  const login = (name: string, phone: string, email?: string) => {
    const user = { name, phone, email };
    setIsLoggedIn(true);
    setLoggedInUser(user);
    setRoleState('User');

    showToast(`Welcome ${name}! Logged in successfully 🎉`, 'success');

    if (typeof window !== 'undefined') {
      localStorage.setItem('majh_boisar_user', JSON.stringify(user));
      localStorage.removeItem('majh_boisar_role');
      localStorage.removeItem('majh_boisar_has_business');

      // Append to registered users list for Admin Panel tracking & Central DB
      try {
        const cleanPhone = phone.replace(/\D/g, '');
        const existingUsersStr = localStorage.getItem('majh_boisar_registered_users');
        const existingUsers: any[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        const existingIndex = existingUsers.findIndex((u: any) => u.phone?.replace(/\D/g, '').endsWith(cleanPhone.slice(-10)));

        if (existingIndex >= 0) {
          existingUsers[existingIndex] = {
            ...existingUsers[existingIndex],
            name: name || existingUsers[existingIndex].name || 'Registered Citizen',
            email: email || existingUsers[existingIndex].email || `${cleanPhone}@majhboisar.in`,
            lastLogin: new Date().toISOString()
          };
          localStorage.setItem('majh_boisar_registered_users', JSON.stringify(existingUsers));
        } else if (cleanPhone.length > 0) {
          const newUserRecord = {
            id: Date.now(),
            name: name || 'Registered Citizen',
            phone: cleanPhone,
            email: email || `${cleanPhone}@majhboisar.in`,
            role: 'Registered User',
            joinedDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString(),
            status: 'Active'
          };
          localStorage.setItem('majh_boisar_registered_users', JSON.stringify([newUserRecord, ...existingUsers]));
        }

        // Post to central backend database
        if (cleanPhone.length > 0) {
          fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name || 'Registered Citizen',
              phone: cleanPhone,
              email: email || `${cleanPhone}@majhboisar.in`,
              role: 'Registered User'
            })
          }).catch((err) => console.warn('Could not post user to /api/users:', err));
        }

        window.dispatchEvent(new CustomEvent('majh_boisar_user_registered'));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error("Error updating registered users list", e);
      }
    }

    // Validate business status
    checkBusinessStatus(phone);
  };

  const updateUserProfile = (name: string, email?: string) => {
    if (loggedInUser) {
      const updated = { ...loggedInUser, name, email };
      setLoggedInUser(updated);
      showToast('Profile updated successfully! ✨', 'success');
      if (typeof window !== 'undefined') {
        localStorage.setItem('majh_boisar_user', JSON.stringify(updated));
      }
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setRole('Guest');
    setHasRegisteredBusinessState(false);
    showToast('Logged out successfully 👋', 'info');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('majh_boisar_user');
      localStorage.removeItem('majh_boisar_role');
      localStorage.removeItem('majh_boisar_has_business');
      localStorage.removeItem('majh_boisar_my_biz_ids');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear legacy admin role if stored in public localStorage
      const savedRole = localStorage.getItem('majh_boisar_role') as Role;
      if (savedRole === 'Admin') {
        localStorage.removeItem('majh_boisar_role');
        setRoleState('User');
      } else if (savedRole && ['Guest', 'User', 'BusinessOwner'].includes(savedRole)) {
        setRoleState(savedRole);
      }
      
      const savedUser = localStorage.getItem('majh_boisar_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          // If legacy user was stored as 'Super Admin', purge and reset to regular guest
          if (parsed.name === 'Super Admin' || parsed.phone === '9999999999') {
            localStorage.removeItem('majh_boisar_user');
            localStorage.removeItem('majh_boisar_role');
            setLoggedInUser(null);
            setIsLoggedIn(false);
          } else {
            setLoggedInUser(parsed);
            setIsLoggedIn(true);

            const hasBizHint = localStorage.getItem('majh_boisar_has_business') === 'true';
            setHasRegisteredBusinessState(hasBizHint);
            
            if (parsed.phone) {
              checkBusinessStatus(parsed.phone);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const roleDetails = {
    Guest: { name: 'Guest Visitor', email: '' },
    User: { name: loggedInUser?.name || 'User', email: loggedInUser?.email || '' },
    BusinessOwner: { name: loggedInUser?.name || 'Business Owner', email: loggedInUser?.email || '' },
    Admin: { name: loggedInUser?.name || 'Admin', email: loggedInUser?.email || 'admin@majhboisar.in' },
  };

  const { name: userName, email: userEmail } = roleDetails[currentRole];

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        selectedBusinessId,
        setSelectedBusinessId,
        userName,
        userEmail,
        isLoggedIn,
        loggedInUser,
        login,
        logout,
        updateUserProfile,
        loginModalOpen,
        setLoginModalOpen,
        adModalOpen,
        setAdModalOpen,
        showToast,
        hasRegisteredBusiness,
        setHasRegisteredBusiness,
        checkBusinessStatus,
      }}
    >
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
