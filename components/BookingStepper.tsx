'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
import {
  Heart,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  QrCode,
  Copy,
  Zap,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { ServiceItem, LeadSource, BookingRequest } from '@/lib/types';
import { initialBusinessSettings } from '@/lib/data';

interface BookingStepperProps {
  initialServiceSlug?: string;
}

export default function BookingStepper({ initialServiceSlug }: BookingStepperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publishedServices, createBookingRequest, isHydrated } = useVairaStore();

  // Mode: Express eCommerce direct vs detailed
  const [checkoutMode, setCheckoutMode] = useState<'express' | 'clinical'>('express');

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [shiftType, setShiftType] = useState<'12h' | '24h'>('12h');

  // Customer Information
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseBuilding, setHouseBuilding] = useState('');
  const [area, setArea] = useState('Kanchipuram');
  const [pincode, setPincode] = useState('631501');

  // Schedule
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDateType, setStartDateType] = useState<'today' | 'tomorrow' | 'custom'>('tomorrow');
  const [customDate, setCustomDate] = useState(tomorrowStr);
  const [preferredDuration, setPreferredDuration] = useState('1 Day');

  // Clinical Details (optional)
  const [recipient, setRecipient] = useState<'Self' | 'Parent' | 'Spouse' | 'Child' | 'Other'>('Parent');
  const [careRequirement, setCareRequirement] = useState('');

  // Payment Options
  const [payOption, setPayOption] = useState<'advance' | 'full' | 'arrival'>('advance');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const officialUPIId = 'vairahomecare@icici';
  const merchantName = initialBusinessSettings.name || 'Vaira Home Care Service';

  // Sync initial service
  useEffect(() => {
    if (publishedServices.length > 0 && !selectedServiceId) {
      if (initialServiceSlug) {
        const found = publishedServices.find((s) => s.slug === initialServiceSlug);
        if (found) {
          setSelectedServiceId(found.id);
          return;
        }
      }
      setSelectedServiceId(publishedServices[0].id);
    }
  }, [publishedServices, initialServiceSlug, selectedServiceId]);

  const selectedService =
    publishedServices.find((s) => s.id === selectedServiceId) || publishedServices[0];

  // Pricing
  const unitPrice = selectedService
    ? shiftType === '24h'
      ? selectedService.price24h || selectedService.basePrice * 1.8
      : selectedService.price12h || selectedService.basePrice
    : 1200;

  const totalAmount = unitPrice;
  const advanceAmount = Math.min(500, totalAmount);
  const payableNow =
    payOption === 'advance' ? advanceAmount : payOption === 'full' ? totalAmount : 0;

  const targetDate =
    startDateType === 'today'
      ? todayStr
      : startDateType === 'tomorrow'
      ? tomorrowStr
      : customDate;

  // Generate UPI URI
  const bookingTempRef = `VHC-${Date.now().toString().slice(-4)}`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(officialUPIId)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${payableNow}&tn=${encodeURIComponent(
    `Vaira Booking ${selectedService?.name?.slice(0, 15) || 'Care'} ${bookingTempRef}`
  )}&cu=INR`;

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

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Patient or caller full name is required';
    }
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.phoneNumber = 'Enter a valid 10-digit mobile number';
    }
    if (!houseBuilding.trim()) {
      errors.houseBuilding = 'Please enter house / street address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = () => {
    if (!validate()) {
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const bookingData = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: phoneNumber.trim(),
      },
      location: {
        houseBuilding: houseBuilding.trim(),
        streetLocality: area,
        area: area,
        city: 'Kanchipuram / Chennai',
        pincode: pincode.trim() || '631501',
        isServiceLocation: true,
      },
      careRequirement: {
        recipient: recipient,
        generalRequirement:
          careRequirement.trim() ||
          `${selectedService.name} - ${shiftType.toUpperCase()} shift duty. Patient care requested.`,
        careType: selectedService.name,
        urgency: (startDateType === 'today' ? 'Today' : 'Normal') as any,
      },
      schedule: {
        preferredDate: targetDate,
        preferredStartTime: shiftType === '24h' ? '24 Hours Stay-in' : '08:00 AM',
        preferredDuration: preferredDuration,
        shiftType: shiftType,
        recurringType: 'daily' as any,
      },
      preferences: {
        genderPreference: 'No Preference' as any,
        languagePreference: 'Tamil / English',
        caregiverPreferenceNote: 'Direct eCommerce Checkout Booking',
      },
      priceEstimate: {
        basePrice: unitPrice,
        durationMultiplier: 1,
        additionalCharges: 0,
        discount: 0,
        estimatedTotal: totalAmount,
        isFinalPriceDetermined: true,
        priceNotice: 'Official verified rate',
      },
      termsAgreed: true,
      acknowledgementAgreed: true,
      leadSource: 'Website' as any,
    };

    const newBooking = createBookingRequest(bookingData);

    if (newBooking) {
      newBooking.payment = {
        status:
          payOption === 'full'
            ? 'FULLY_PAID'
            : payOption === 'advance'
            ? 'ADVANCE_PAID'
            : 'PAY_ON_ARRIVAL',
        amount: totalAmount,
        advanceAmount: payOption === 'advance' ? advanceAmount : payOption === 'full' ? totalAmount : 0,
        upiId: payOption !== 'arrival' ? officialUPIId : undefined,
        transactionRef:
          transactionRef.trim() ||
          (payOption !== 'arrival' ? `UPI-${Date.now().toString().slice(-6)}` : undefined),
        paidAt: payOption !== 'arrival' ? new Date().toISOString() : undefined,
        paymentMethod: payOption === 'arrival' ? 'CASH' : 'UPI_QR',
      };
      setConfirmedBooking(newBooking);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }, 600);
  };

  if (!isHydrated || !selectedService) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent" />
        <p className="mt-2 text-xs">Loading fast booking portal...</p>
      </div>
    );
  }

  // SUCCESS RECEIPT SCREEN
  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Booking Placed Successfully
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Home Care Order Confirmed</h2>
          <p className="text-xs text-slate-500 mt-1">
            Order Reference ID:{' '}
            <strong className="text-slate-900 font-mono text-sm">{confirmedBooking.id}</strong>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5">
          <div className="flex justify-between pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Service Name:</span>
            <span className="font-bold text-slate-900">{confirmedBooking.serviceName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Patient Contact:</span>
            <span className="font-bold text-slate-900">
              {confirmedBooking.customer.fullName} ({confirmedBooking.customer.phoneNumber})
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Duty Shift &amp; Date:</span>
            <span className="font-bold text-slate-900">
              {confirmedBooking.schedule.preferredDate} • {confirmedBooking.schedule.shiftType?.toUpperCase()} Shift
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium">Care Address:</span>
            <span className="font-bold text-slate-900 truncate max-w-[240px]">
              {confirmedBooking.location.houseBuilding}, {confirmedBooking.location.area}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-sm">
            <span className="font-bold text-slate-700">Total Shift Tariff:</span>
            <span className="font-black text-slate-900">
              ₹{confirmedBooking.priceEstimate.estimatedTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-xs text-emerald-700 font-bold bg-emerald-50/80 p-2 rounded-xl">
            <span>Payment Mode:</span>
            <span>
              {confirmedBooking.payment?.status === 'ADVANCE_PAID'
                ? 'Advance ₹500 Verified via UPI'
                : confirmedBooking.payment?.status === 'FULLY_PAID'
                ? 'Fully Paid via UPI QR'
                : 'Pay on Doorstep Arrival'}
            </span>
          </div>
        </div>

        {/* WhatsApp & Call Desk Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/918754519060?text=${encodeURIComponent(
              `Hello Vaira Care Desk, I just placed a booking on the website!\nOrder ID: ${confirmedBooking.id}\nService: ${confirmedBooking.serviceName}\nPatient: ${confirmedBooking.customer.fullName}\nPhone: ${confirmedBooking.customer.phoneNumber}\nDuty Date: ${confirmedBooking.schedule.preferredDate} (${confirmedBooking.schedule.shiftType?.toUpperCase()})\nAddress: ${confirmedBooking.location.houseBuilding}, ${confirmedBooking.location.area}\nPayment: ${confirmedBooking.payment?.status}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Order Receipt on WhatsApp</span>
          </a>

          <a
            href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3.5 rounded-2xl shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Coordination Desk</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md shrink-0">
            <img src="/logo.jpg" alt="Vaira Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                Direct eCommerce Checkout
              </span>
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <Zap className="w-2.5 h-2.5 fill-current" /> Instant QR Pay
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Vaira Bedside Nursing &amp; Elder Care Agency
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Staff • Doorstep Care</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* SECTION 1: Service Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              <span>Select Home Care Service</span>
            </h3>
            <span className="text-xs text-slate-500">
              {publishedServices.length} verified care options
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {publishedServices.map((srv) => {
              const isSelected = srv.id === selectedService.id;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 relative cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{srv.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{srv.category}</p>
                    <div className="text-xs font-black text-emerald-700 mt-0.5">
                      From ₹{(srv.price12h || srv.basePrice).toLocaleString()}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Shift Tariff & Start Date */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              2
            </span>
            <span>Choose Shift Tariff &amp; Duty Schedule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 12h Shift */}
            <button
              type="button"
              onClick={() => setShiftType('12h')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                shiftType === '12h'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">12-Hour Shift Duty</span>
                {shiftType === '12h' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Day Shift or Night Shift Care</p>
              <div className="mt-2 text-lg font-black text-emerald-700">
                ₹{(selectedService.price12h || selectedService.basePrice).toLocaleString()}
              </div>
            </button>

            {/* 24h Shift */}
            <button
              type="button"
              onClick={() => setShiftType('24h')}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                shiftType === '24h'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">24-Hour Stay-In Duty</span>
                {shiftType === '24h' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Round-the-clock Resident Nurse</p>
              <div className="mt-2 text-lg font-black text-emerald-700">
                ₹{(selectedService.price24h || selectedService.basePrice * 1.8).toLocaleString()}
              </div>
            </button>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Caregiver Starting When?
            </label>
            <div className="grid grid-cols-3 gap-2 max-w-md">
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
                🗓️ Choose Date
              </button>
            </div>

            {startDateType === 'custom' && (
              <div className="mt-2 max-w-xs">
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
        </div>

        {/* SECTION 3: Patient & Address Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
              3
            </span>
            <span>Patient Contact &amp; Care Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Patient / Caller Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Anandha Kumar"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                }}
                className={`w-full text-xs p-3 rounded-xl border ${
                  formErrors.fullName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {formErrors.fullName && (
                <p className="text-[10px] text-red-600 mt-1">{formErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp / Mobile Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (formErrors.phoneNumber) setFormErrors({ ...formErrors, phoneNumber: '' });
                }}
                className={`w-full text-xs p-3 rounded-xl border ${
                  formErrors.phoneNumber ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {formErrors.phoneNumber && (
                <p className="text-[10px] text-red-600 mt-1">{formErrors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                House / Street / Flat Address *
              </label>
              <input
                type="text"
                placeholder="e.g. No. 24, Vallal Pachaiyappan St, Near Temple"
                value={houseBuilding}
                onChange={(e) => {
                  setHouseBuilding(e.target.value);
                  if (formErrors.houseBuilding) setFormErrors({ ...formErrors, houseBuilding: '' });
                }}
                className={`w-full text-xs p-3 rounded-xl border ${
                  formErrors.houseBuilding ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {formErrors.houseBuilding && (
                <p className="text-[10px] text-red-600 mt-1">{formErrors.houseBuilding}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Area</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
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

        {/* SECTION 4: Direct Instant UPI QR Payment */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                4
              </span>
              <span>Instant QR Payment &amp; Confirmation</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Zero Transaction Fees
            </span>
          </div>

          {/* Payment Mode Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPayOption('advance')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                payOption === 'advance'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">UPI Advance ₹500</span>
                <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                  Most Popular
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Guarantees duty nurse slot</p>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                Balance ₹{(totalAmount - advanceAmount).toLocaleString()} on arrival
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPayOption('full')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                payOption === 'full'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Full Shift UPI</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Pay ₹{totalAmount.toLocaleString()} in full
              </p>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">100% cashless service</p>
            </button>

            <button
              type="button"
              onClick={() => setPayOption('arrival')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                payOption === 'arrival'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Pay on Arrival</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Cash or Doorstep QR</p>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">Pay when nurse arrives</p>
            </button>
          </div>

          {/* UPI QR Display Container */}
          {payOption !== 'arrival' && (
            <div className="bg-slate-50 rounded-3xl p-5 border border-emerald-200/80 space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                {/* QR Code */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md flex flex-col items-center shrink-0">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Vaira UPI QR"
                      className="w-48 h-48 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" /> Scan with Any UPI App
                  </span>
                </div>

                {/* Amount & Direct Apps */}
                <div className="space-y-3.5 flex-1 w-full text-center md:text-left">
                  <div className="bg-emerald-950 text-white p-4 rounded-2xl shadow-sm border border-emerald-900">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      Payable Shift Amount
                    </span>
                    <span className="text-3xl font-black text-white">
                      ₹{payableNow.toLocaleString()}
                    </span>
                    <p className="text-xs text-emerald-200/80 mt-1">
                      {payOption === 'advance'
                        ? `Balance ₹${(totalAmount - advanceAmount).toLocaleString()} payable when staff arrives`
                        : 'Full shift payment'}
                    </p>
                  </div>

                  {/* UPI ID Copy */}
                  <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="font-mono font-bold text-slate-800">{officialUPIId}</span>
                    <button
                      type="button"
                      onClick={handleCopyUPI}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedUPI ? 'Copied!' : 'Copy UPI'}</span>
                    </button>
                  </div>

                  {/* App Links */}
                  <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                    <a
                      href={upiUri}
                      className="text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all"
                    >
                      📱 Open Google Pay / PhonePe / Paytm
                    </a>
                  </div>

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
              </div>
            </div>
          )}

          {payOption === 'arrival' && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold">Pay ₹{totalAmount.toLocaleString()} at Doorstep</p>
              <p className="text-[11px] text-amber-800/80 leading-relaxed">
                Our assigned nurse will show their official Vaira ID card with personal verification QR when they arrive. You can pay via cash or scan their ID badge QR code.
              </p>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Duty Total
            </span>
            <span className="text-2xl font-black text-slate-900">
              ₹{totalAmount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-2">
              ({shiftType.toUpperCase()} Shift on {targetDate})
            </span>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmOrder}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Confirming Booking...</span>
            ) : (
              <>
                <span>
                  {payOption === 'arrival'
                    ? 'CONFIRM DIRECT BOOKING'
                    : 'I HAVE PAID / CONFIRM DIRECT BOOKING'}
                </span>
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
