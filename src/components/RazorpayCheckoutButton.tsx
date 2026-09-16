'use client';

import React, { useState } from 'react';
import { initiateRazorpayCheckout, RazorpayCheckoutOptions } from '@/lib/razorpay';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface RazorpayCheckoutButtonProps {
  amountInRupees: number;
  name?: string;
  description?: string;
  receipt?: string;
  notes?: Record<string, string>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  buttonText?: string;
  className?: string;
  onSuccess?: (verifyResult: { success: boolean; order_id: string; payment_id: string }) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export default function RazorpayCheckoutButton({
  amountInRupees,
  name = 'Majh Boisar',
  description = 'Online Payment',
  receipt,
  notes,
  prefill,
  buttonText,
  className = '',
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      await initiateRazorpayCheckout({
        amountInRupees,
        name,
        description,
        receipt,
        notes,
        prefill,
        onSuccess: (res) => {
          setLoading(false);
          onSuccess?.(res);
        },
        onFailure: (err) => {
          setLoading(false);
          const msg = err?.description || err?.message || 'Payment processing failed';
          setErrorMessage(msg);
          onError?.(err);
        },
        onDismiss: () => {
          setLoading(false);
          onCancel?.();
        },
      });
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'Failed to initiate payment';
      setErrorMessage(msg);
      onError?.(err);
    }
  };

  const defaultClasses =
    'w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handlePayment}
        disabled={disabled || loading}
        className={className || defaultClasses}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Connecting to Razorpay...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 shrink-0 text-teal-200" />
            <span>
              {buttonText || `Pay ₹${amountInRupees.toLocaleString('en-IN')} via Razorpay`}
            </span>
          </>
        )}
      </button>

      {errorMessage && (
        <p className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2 mt-2 text-center">
          ⚠️ {errorMessage}
        </p>
      )}
    </div>
  );
}
