'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  Copy,
  QrCode,
  ShieldCheck,
  CreditCard,
  Smartphone,
  ExternalLink,
  Banknote,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data';

interface UPIQRCodeProps {
  requestId: string;
  totalAmount: number;
  customerName?: string;
  onPaymentSuccess?: (details: {
    status: 'ADVANCE_PAID' | 'FULLY_PAID' | 'PAY_ON_ARRIVAL';
    amount: number;
    transactionRef?: string;
    paymentMethod: 'UPI_QR' | 'CASH';
  }) => void;
  showCashOption?: boolean;
}

export default function UPIQRCode({
  requestId,
  totalAmount,
  customerName,
  onPaymentSuccess,
  showCashOption = true,
}: UPIQRCodeProps) {
  // Allow choosing either Advance (₹500 / ₹1,000) or Full Amount
  const advanceAmount = Math.min(500, totalAmount > 0 ? totalAmount : 500);
  const [payOption, setPayOption] = useState<'advance' | 'full' | 'cash'>(
    totalAmount > 0 ? 'advance' : 'cash'
  );
  const [customAmount, setCustomAmount] = useState<number>(advanceAmount);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const officialUPIId = '8754519060@waicic';
  const merchantName = initialBusinessSettings.name || 'Vaira Home Care Service';

  const activeAmount =
    payOption === 'advance'
      ? advanceAmount
      : payOption === 'full'
      ? totalAmount
      : 0;

  // Generate UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(officialUPIId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${activeAmount}&tn=${encodeURIComponent(`Vaira Booking ${requestId}`)}&cu=INR`;

  useEffect(() => {
    if (activeAmount > 0) {
      QRCode.toDataURL(upiUri, {
        width: 280,
        margin: 2,
        color: {
          dark: '#064e3b', // emerald-900
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation failed:', err));
    }
  }, [upiUri, activeAmount]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(officialUPIId);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleConfirmUPIPayment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPaymentDone(true);
      setIsSubmitting(false);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          status: payOption === 'full' ? 'FULLY_PAID' : 'ADVANCE_PAID',
          amount: activeAmount,
          transactionRef: transactionRef.trim() || `UPI-TXN-${Date.now().toString().slice(-6)}`,
          paymentMethod: 'UPI_QR',
        });
      }
    }, 600);
  };

  const handleSelectCashOnArrival = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setPaymentDone(true);
      setIsSubmitting(false);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          status: 'PAY_ON_ARRIVAL',
          amount: totalAmount,
          transactionRef: 'PAY_TO_STAFF_ON_ARRIVAL',
          paymentMethod: 'CASH',
        });
      }
    }, 400);
  };

  if (paymentDone) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-200/60 px-3 py-1 rounded-full">
            Payment Recorded
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {payOption === 'cash' ? 'Cash Collection Noted' : 'UPI Payment Logged!'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            {payOption === 'cash'
              ? 'Our coordinator has noted that payment will be handed directly to the assigned staff member upon their initial home assessment.'
              : `Thank you! An advance of ₹${activeAmount.toLocaleString()} has been linked to Request ID ${requestId}. A receipt will be issued by the care coordinator.`}
          </p>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-700 max-w-sm mx-auto">
          Reference ID: <strong className="font-mono text-emerald-900">{requestId}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30">
            <QrCode className="w-3.5 h-3.5" />
            <span>Instant UPI Doorstep QR</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">
            Secure Payment &amp; Advance Collection
          </h3>
          <p className="text-xs text-emerald-100/80">
            GPay • PhonePe • Paytm • BHIM • Direct Mobile Banking
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center shrink-0">
          <span className="text-[11px] text-emerald-200 block font-medium">Request Reference</span>
          <span className="font-mono font-black text-sm text-white tracking-wider">{requestId}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Payment Type Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {totalAmount > 0 && (
            <>
              <button
                type="button"
                onClick={() => setPayOption('advance')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  payOption === 'advance'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Booking Advance</span>
                  <span className="text-xs font-black text-emerald-700">₹{advanceAmount}</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Locks your nurse / caregiver slot immediately
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPayOption('full')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  payOption === 'full'
                    ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Total Shift Fee</span>
                  <span className="text-xs font-black text-emerald-700">₹{totalAmount.toLocaleString()}</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Full service duration settlement
                </span>
              </button>
            </>
          )}

          {showCashOption && (
            <button
              type="button"
              onClick={() => setPayOption('cash')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                payOption === 'cash'
                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Pay on Arrival</span>
                <Banknote className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Hand cash or scan with staff during home visit
              </span>
            </button>
          )}
        </div>

        {/* Dynamic UPI QR Display */}
        {payOption !== 'cash' ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-50/80 p-6 rounded-3xl border border-slate-200">
              {/* QR Code Container */}
              <div className="bg-white p-4 rounded-3xl shadow-md border-2 border-emerald-100 flex flex-col items-center shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Scan UPI QR Code to pay"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                    Generating QR...
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Merchant: Vaira Home Care</span>
                </div>
              </div>

              {/* Instructions & Actions */}
              <div className="space-y-4 max-w-xs text-center md:text-left">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                    Amount to Pay
                  </span>
                  <div className="text-3xl font-black text-emerald-700 mt-0.5">
                    ₹{activeAmount.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Zero transaction fee or surcharge
                  </span>
                </div>

                {/* 1-Tap Mobile UPI App Open */}
                <div className="pt-1">
                  <a
                    href={upiUri}
                    className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay with GPay / PhonePe / Paytm</span>
                  </a>
                  <span className="text-[10px] text-slate-400 block text-center mt-1">
                    (Opens installed payment app on your mobile)
                  </span>
                </div>

                {/* Manual UPI ID Copy */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">UPI ID:</span>
                    <span className="font-mono font-bold text-slate-800">{officialUPIId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUPI}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedUPI ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction Ref & Confirmation */}
            <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Confirm Your Payment</span>
              </div>
              <p className="text-xs text-slate-600">
                After completing the UPI payment in your banking app, enter the 12-digit UTR or Reference number (optional), then tap Confirm:
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Enter UPI Ref / UTR No. (e.g. 4289...)"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
                />
                <button
                  type="button"
                  onClick={handleConfirmUPIPayment}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'I Have Paid via UPI'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Cash On Arrival Confirmation Box */
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Banknote className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Pay Upon Nurse / Caregiver Arrival
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No advance needed right now. When the assigned staff member arrives for the initial home assessment, you can pay via Cash or scan their handheld UPI QR code.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectCashOnArrival}
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              Confirm: Pay Upon Staff Arrival
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
