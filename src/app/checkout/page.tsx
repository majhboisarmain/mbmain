'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function RazorpayCheckoutPage() {
  const [amount, setAmount] = useState<number>(149);
  const [customAmount, setCustomAmount] = useState<string>('149');
  const [customerName, setCustomerName] = useState<string>('Rahul Patil');
  const [customerEmail, setCustomerEmail] = useState<string>('rahul.patil@example.com');
  const [customerPhone, setCustomerPhone] = useState<string>('9820123456');
  const [paymentSuccess, setPaymentSuccess] = useState<{
    order_id: string;
    payment_id: string;
  } | null>(null);

  const presetAmounts = [
    { label: 'Min Test (₹1)', value: 1 },
    { label: 'Basic (₹99)', value: 99 },
    { label: 'Starter (₹149)', value: 149 },
    { label: 'Pro (₹349)', value: 349 },
    { label: 'Property Pass (₹1,499)', value: 1499 },
  ];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount(String(val));
    setPaymentSuccess(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 1) {
      setAmount(parsed);
    }
    setPaymentSuccess(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 font-sans text-slate-800">
      <div className="max-w-xl mx-auto">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Majh Boisar</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Razorpay Test Mode Active
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-left">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white border-b border-teal-500/20">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight">Razorpay Standard Checkout</h1>
                <p className="text-xs text-teal-200 font-medium">Official Payment Gateway Integration for Majh Boisar</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <span>Public Key ID:</span>
              <code className="font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-teal-300 border border-slate-700">
                {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Tcfw4EMwQIwWTQ'}
              </code>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {paymentSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-900">Payment Verified Successfully!</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    HMAC-SHA256 signature verified by Majh Boisar server.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-emerald-200 p-3 text-left font-mono text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between flex-wrap">
                    <span className="text-slate-400">Order ID:</span>
                    <strong className="text-slate-900">{paymentSuccess.order_id}</strong>
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <span className="text-slate-400">Payment ID:</span>
                    <strong className="text-slate-900">{paymentSuccess.payment_id}</strong>
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <span className="text-slate-400">Amount Paid:</span>
                    <strong className="text-emerald-700">₹{amount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentSuccess(null)}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Make Another Test Payment</span>
                </button>
              </div>
            ) : (
              <>
                {/* Amount Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Amount (INR)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {presetAmounts.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => handleSelectPreset(p.value)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                          amount === p.value
                            ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={customAmount}
                        onChange={handleCustomChange}
                        placeholder="Custom amount"
                        className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Minimum amount: 100 paise (₹1.00)
                    </span>
                  </div>
                </div>

                {/* Customer Prefill Details */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Customer Details (Prefilled in Checkout)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{amount.toLocaleString('en-IN')}.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Platform Fee</span>
                    <span className="text-emerald-600 font-bold">Free</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-teal-700">₹{amount.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>

                {/* Razorpay Standard Checkout Button */}
                <RazorpayCheckoutButton
                  amountInRupees={amount}
                  name="Majh Boisar"
                  description={`Payment for ₹${amount} via Razorpay`}
                  prefill={{
                    name: customerName,
                    email: customerEmail,
                    contact: customerPhone,
                  }}
                  buttonText={`Pay ₹${amount.toLocaleString('en-IN')} with Razorpay`}
                  onSuccess={(res) => {
                    setPaymentSuccess({
                      order_id: res.order_id,
                      payment_id: res.payment_id,
                    });
                  }}
                  onError={(err) => {
                    console.error('Payment failed error:', err);
                  }}
                />

                {/* Razorpay Security Trust Badge */}
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Secured by Razorpay Standard 256-Bit SSL Encryption</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Integration Architecture Card */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 text-xs text-slate-600 space-y-2 text-left">
          <h4 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
            ⚡ Flow Overview
          </h4>
          <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
            <li>
              <strong>Create Order:</strong> Frontend calls <code className="text-teal-700 font-mono bg-slate-100 px-1 py-0.5 rounded">POST /api/create-order</code> to generate Razorpay <code className="font-mono">order_id</code>.
            </li>
            <li>
              <strong>Standard Web Checkout Modal:</strong> Opens Razorpay's official checkout UI supporting UPI, Cards, Netbanking, & Wallets.
            </li>
            <li>
              <strong>Cryptographic Verification:</strong> After payment, <code className="text-teal-700 font-mono bg-slate-100 px-1 py-0.5 rounded">POST /api/verify-payment</code> computes HMAC-SHA256 with <code className="font-mono">RAZORPAY_KEY_SECRET</code>.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
