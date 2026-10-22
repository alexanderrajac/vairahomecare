'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  Calendar,
  Phone,
  User,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { ServiceItem, BookingRequest } from '@/lib/types';
import { useVairaStore } from '@/lib/store';
import { initialBusinessSettings } from '@/lib/data';

interface DirectBookingModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  defaultShift?: '12h' | '24h';
}

export default function DirectBookingModal({
  service,
  isOpen,
  onClose,
  defaultShift = '12h',
}: DirectBookingModalProps) {
  const { createBookingRequest } = useVairaStore();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [shiftType, setShiftType] = useState<'12h' | '24h'>(defaultShift);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Kanchipuram');
  const [pincode, setPincode] = useState('631501');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDateType, setStartDateType] = useState<'today' | 'tomorrow' | 'custom'>('tomorrow');
  const [customDate, setCustomDate] = useState(tomorrowStr);

  // Payment Selection
  const [payMode, setPayMode] = useState<'advance' | 'full' | 'arrival'>('advance');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [createdBooking, setCreatedBooking] = useState<BookingRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const officialUPIId = 'vairahomecare@icici';
  const merchantName = initialBusinessSettings.name || 'Vaira Home Care Service';

  useEffect(() => {
    if (service) {
      setShiftType(defaultShift);
      setStep('details');
      setErrors({});
      setTransactionRef('');
    }
  }, [service, defaultShift]);

  if (!isOpen || !service) return null;

  // Calculate pricing
  const unitPrice =
    shiftType === '24h'
      ? service.price24h || service.basePrice * 1.8
      : service.price12h || service.basePrice;

  const totalAmount = unitPrice;
  const advanceAmount = Math.min(500, totalAmount);
  const payableNow =
    payMode === 'advance' ? advanceAmount : payMode === 'full' ? totalAmount : 0;

  const targetDate =
    startDateType === 'today'
      ? todayStr
      : startDateType === 'tomorrow'
      ? tomorrowStr
      : customDate;

  // Generate UPI QR URI
  const bookingRefTemp = `VHC-${Date.now().toString().slice(-4)}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(officialUPIId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${payableNow}&tn=${encodeURIComponent(
    `Vaira Booking ${service.name.slice(0, 15)} ${bookingRefTemp}`
  )}&cu=INR`;

  // Generate QR image when payable amount > 0
  useEffect(() => {
    if (payableNow > 0) {
      QRCode.toDataURL(upiUri, {
        width: 240,
        margin: 1,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((e) => console.error(e));
    }
  }, [upiUri, payableNow]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(officialUPIId);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const validateDetails = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter patient / caller name';
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      newErrors.phoneNumber = 'Enter a valid 10-digit mobile number';
    }
    if (!address.trim() || address.trim().length < 4) {
      newErrors.address = 'Please enter house / street address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateDetails()) return;
    setStep('payment');
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    const newBooking = createBookingRequest({
      serviceId: service.id,
      serviceName: service.name,
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: phoneNumber.trim(),
      },
      location: {
        houseBuilding: address.trim(),
        streetLocality: area,
        area: area,
        city: 'Kanchipuram / Chennai',
        pincode: pincode.trim() || '631501',
        isServiceLocation: true,
      },
      careRequirement: {
        recipient: 'Self',
        generalRequirement: `${service.name} (${shiftType.toUpperCase()} shift duty requested)`,
        careType: service.name,
        urgency: startDateType === 'today' ? 'Today' : 'Normal',
      },
      schedule: {
        preferredDate: targetDate,
        preferredStartTime: shiftType === '24h' ? '24 Hours Stay-in' : '08:00 AM',
        preferredDuration: '1 Day (Renewable)',
        shiftType: shiftType,
        recurringType: 'daily',
      },
      preferences: {
        genderPreference: 'No Preference',
        languagePreference: 'Tamil / English',
        caregiverPreferenceNote: 'Direct eCommerce Quick Checkout',
      },
      priceEstimate: {
        basePrice: unitPrice,
        durationMultiplier: 1,
        additionalCharges: 0,
        discount: 0,
        estimatedTotal: totalAmount,
        isFinalPriceDetermined: true,
        priceNotice: 'Standard verified duty rate',
      },
      termsAgreed: true,
      acknowledgementAgreed: true,
      leadSource: 'Website',
    });

    // Update with payment details
    if (newBooking) {
      newBooking.payment = {
        status:
          payMode === 'full'
            ? 'FULLY_PAID'
            : payMode === 'advance'
            ? 'ADVANCE_PAID'
            : 'PAY_ON_ARRIVAL',
        amount: totalAmount,
        advanceAmount: payMode === 'advance' ? advanceAmount : payMode === 'full' ? totalAmount : 0,
        upiId: payMode !== 'arrival' ? officialUPIId : undefined,
        transactionRef: transactionRef.trim() || (payMode !== 'arrival' ? `UPI-${Date.now().toString().slice(-6)}` : undefined),
        paidAt: payMode !== 'arrival' ? new Date().toISOString() : undefined,
        paymentMethod: payMode === 'arrival' ? 'CASH' : 'UPI_QR',
      };
      setCreatedBooking(newBooking);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 px-5 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md">
              <img src="/logo.jpg" alt="Vaira Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                  1-Click Direct Checkout
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  <Zap className="w-2.5 h-2.5 fill-current" /> Fast
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Vaira Home Care Agency</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Service Details & Patient Info */}
          {step === 'details' && (
            <div className="space-y-5 animate-fade-in">
              {/* Product / Service Cart Item */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase">
                      {service.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> 24x7 Available
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">{service.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{service.shortDescription}</p>
                </div>
              </div>

              {/* Shift Selection Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Care Shift Tariff:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShiftType('12h')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      shiftType === '12h'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">12-Hour Shift</span>
                      {shiftType === '12h' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Day or Night Duty</p>
                    <div className="mt-2 text-base font-black text-emerald-700">
                      ₹{(service.price12h || service.basePrice).toLocaleString()}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShiftType('24h')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      shiftType === '24h'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">24-Hour Stay-In</span>
                      {shiftType === '24h' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Round-the-clock Nurse</p>
                    <div className="mt-2 text-base font-black text-emerald-700">
                      ₹{(service.price24h || service.basePrice * 1.8).toLocaleString()}
                    </div>
                  </button>
                </div>
              </div>

              {/* Start Date Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  When do you need the care staff to start?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStartDateType('today')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      startDateType === 'today'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ⚡ Today (Urgent)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartDateType('tomorrow')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      startDateType === 'tomorrow'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📅 Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartDateType('custom')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      startDateType === 'custom'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🗓️ Select Date
                  </button>
                </div>

                {startDateType === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="date"
                      min={todayStr}
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                )}
              </div>

              {/* Patient / Customer Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Patient &amp; Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Patient / Caller Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-red-600 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                      }}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.phoneNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-[10px] text-red-600 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      House / Flat / Street Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. No. 14, Gandhi Road, Near Bus Stand"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors({ ...errors, address: '' });
                      }}
                      className={`w-full text-xs p-2.5 rounded-xl border ${
                        errors.address ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                      } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                    />
                    {errors.address && (
                      <p className="text-[10px] text-red-600 mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Area / Town
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    >
                      <option value="Kanchipuram">Kanchipuram Town</option>
                      <option value="Vembedu">Vembedu</option>
                      <option value="Vandalur">Vandalur (Chennai)</option>
                      <option value="Tambaram">Tambaram / Chromepet</option>
                      <option value="Guduvanchery">Guduvanchery / Chengalpattu</option>
                      <option value="Other">Other nearby area</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price Bar & Next Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Total Shift Tariff
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Pay Advance ₹500 or On Arrival
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Instant QR Payment & Confirmation */}
          {step === 'payment' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
                >
                  ← Edit details
                </button>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Step 2 of 2: Payment &amp; Confirmation
                </span>
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Choose Payment Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPayMode('advance')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payMode === 'advance'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">UPI Advance</span>
                      <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pay ₹{advanceAmount} via QR</p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-1">Guarantees nurse slot</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('full')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payMode === 'full'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Full UPI Pay</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pay ₹{totalAmount.toLocaleString()} via QR</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">100% cashless duty</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMode('arrival')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      payMode === 'arrival'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Pay on Arrival</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cash / UPI to Nurse</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Pay at doorstep</p>
                  </button>
                </div>
              </div>

              {/* QR Code Card (When UPI selected) */}
              {payMode !== 'arrival' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-emerald-200/70 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5 justify-center">
                    {/* QR Code Container */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center shrink-0">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Vaira Home Care UPI QR"
                          className="w-44 h-44 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                          Generating QR...
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-500 mt-1.5 flex items-center gap-1">
                        <QrCode className="w-3 h-3 text-emerald-600" /> Scan with Any UPI App
                      </span>
                    </div>

                    {/* App Links & Instructions */}
                    <div className="space-y-3 flex-1 text-center sm:text-left">
                      <div className="bg-emerald-900 text-white p-3 rounded-xl shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                          Payable Right Now
                        </span>
                        <span className="text-2xl font-black">₹{payableNow.toLocaleString()}</span>
                        <p className="text-[11px] text-emerald-200 mt-0.5">
                          {payMode === 'advance'
                            ? `Balance ₹${(totalAmount - advanceAmount).toLocaleString()} payable on duty arrival`
                            : 'Full shift amount'}
                        </p>
                      </div>

                      {/* Official UPI ID Copy */}
                      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
                        <span className="font-mono font-bold text-slate-800">{officialUPIId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUPI}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedUPI ? 'Copied!' : 'Copy UPI'}</span>
                        </button>
                      </div>

                      {/* Mobile App Deep Links */}
                      <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
                        <a
                          href={upiUri}
                          className="text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                          Open GPay / PhonePe
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Optional UTR / Reference */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Transaction UTR / Reference No. (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 429182947192 or UPI Ref"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Pay on arrival notice */}
              {payMode === 'arrival' && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Pay ₹{totalAmount.toLocaleString()} at Doorstep</p>
                    <p className="text-[11px] text-amber-800/80 leading-relaxed">
                      You can pay cash or scan the duty nurse’s ID card QR code when the caregiver arrives at your home on {targetDate}.
                    </p>
                  </div>
                </div>
              )}

              {/* Order Placement Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{fullName}</strong> • {phoneNumber}
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmOrder}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
                >
                  {isSubmitting ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <span>{payMode === 'arrival' ? 'Confirm Booking' : 'I Have Paid / Confirm Order'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Success Screen */}
          {step === 'success' && createdBooking && (
            <div className="text-center py-6 px-2 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Booking Confirmed!
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Care Request Dispatched</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Booking ID: <strong className="text-slate-900 font-mono">{createdBooking.id}</strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">{createdBooking.serviceName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{createdBooking.customer.fullName} ({createdBooking.customer.phoneNumber})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Duty Date &amp; Shift:</span>
                  <span className="font-bold text-slate-900">{createdBooking.schedule.preferredDate} ({createdBooking.schedule.shiftType?.toUpperCase()})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">{createdBooking.location.houseBuilding}, {createdBooking.location.area}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="font-bold text-emerald-700">
                    {createdBooking.payment?.status === 'ADVANCE_PAID'
                      ? 'Advance ₹500 Received'
                      : createdBooking.payment?.status === 'FULLY_PAID'
                      ? 'Fully Paid via UPI'
                      : 'Pay on Doorstep Arrival'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/918754519060?text=${encodeURIComponent(
                    `Hello Vaira Care Desk, I just placed a booking on the website!\nOrder ID: ${createdBooking.id}\nService: ${createdBooking.serviceName}\nPatient: ${createdBooking.customer.fullName}\nPhone: ${createdBooking.customer.phoneNumber}\nDuty Date: ${createdBooking.schedule.preferredDate} (${createdBooking.schedule.shiftType?.toUpperCase()})\nAddress: ${createdBooking.location.houseBuilding}, ${createdBooking.location.area}\nPayment: ${createdBooking.payment?.status}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Order to WhatsApp Desk</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
