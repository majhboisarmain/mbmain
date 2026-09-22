// Client-side Razorpay helper utility

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    // Check if script element already exists
    const existingScript = document.getElementById('razorpay-checkout-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface RazorpayCheckoutOptions {
  amountInPaise?: number;
  amountInRupees?: number;
  currency?: string;
  name?: string;
  description?: string;
  receipt?: string;
  notes?: Record<string, string>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  themeColor?: string;
  onSuccess?: (verifyResult: { success: boolean; order_id: string; payment_id: string }) => void;
  onFailure?: (error: any) => void;
  onDismiss?: () => void;
}

export const initiateRazorpayCheckout = async (options: RazorpayCheckoutOptions) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Could not load Razorpay SDK. Please check your internet connection.');
    }

    const amountInPaise = options.amountInPaise
      ? options.amountInPaise
      : options.amountInRupees
      ? Math.round(options.amountInRupees * 100)
      : 100;

    if (amountInPaise < 100) {
      throw new Error('Minimum payment amount is ₹1.00 (100 paise).');
    }

    // 1. Create Order via Backend
    const createRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        notes: options.notes,
      }),
    });

    const createData = await createRes.json();

    if (!createRes.ok || !createData.order_id) {
      throw new Error(createData.error || 'Failed to initialize payment order');
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_Tf38GQchKmVTT2';

    // 2. Open Razorpay Standard Checkout Modal
    const rzpOptions = {
      key: razorpayKey,
      amount: createData.amount,
      currency: createData.currency,
      name: options.name || 'Majh Boisar',
      description: options.description || 'Secure Online Payment',
      order_id: createData.order_id,
      image: '/logo-icon.png',
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          // 3. Verify Signature via Backend
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            options.onSuccess?.(verifyData);
          } else {
            options.onFailure?.(new Error(verifyData.error || 'Payment signature verification failed.'));
          }
        } catch (verifyErr: any) {
          options.onFailure?.(verifyErr);
        }
      },
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      theme: {
        color: options.themeColor || '#0d9488', // Teal
      },
      modal: {
        ondismiss: () => {
          if (options.onDismiss) {
            options.onDismiss();
          }
        },
      },
    };

    const rzpInstance = new window.Razorpay(rzpOptions);

    rzpInstance.on('payment.failed', (resp: any) => {
      console.error('Razorpay payment failed:', resp.error);
      options.onFailure?.(resp.error);
    });

    rzpInstance.open();
    return rzpInstance;
  } catch (err) {
    console.error('Checkout error:', err);
    options.onFailure?.(err);
    throw err;
  }
};
