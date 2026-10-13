'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
  Phone,
  ShieldCheck,
  ArrowRight,
  User,
  Copy,
  Info,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import StatusTimeline from '@/components/StatusTimeline';
import UPIQRCode from '@/components/UPIQRCode';
import { initialBusinessSettings } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';

export default function ConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;

  const { bookings, isHydrated, recordPayment } = useVairaStore();

  const booking = bookings.find((b) => b.id === id);

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (booking?.id) {
      navigator.clipboard.writeText(booking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading confirmation details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Request Not Found</h2>
        <p className="text-sm text-slate-500">
          We could not locate reference ID "{id}". Please check your number or contact our desk.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  // Pre-filled WhatsApp message strictly matching Section 7 requirements
  const whatsappMessage = `Hello Vaira Home Care,

I have submitted a service request.

Request ID: ${booking.id}
Service: ${booking.serviceName}
Preferred Date: ${booking.schedule.preferredDate}
Preferred Time: ${booking.schedule.preferredStartTime}
Area: ${booking.location.area}

Please contact me regarding confirmation.`;

  const whatsappUrl = `https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Success Badge Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            Acknowledgement Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Service Request Received
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
            Thank you, <strong>{booking.customer.fullName}</strong>. Your home care service request has been logged into our coordination queue.
          </p>
        </div>

        {/* Generated Request ID (VC-2026-XXXXXX) */}
        <div className="inline-flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-xs font-bold text-slate-500">Request ID:</span>
          <span className="font-mono text-base font-black text-emerald-800 tracking-wider">
            {booking.id}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
            title="Copy Request ID"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
        </div>

        {/* Live Status Pipeline (Section 6) */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Coordination Progress Status
          </span>
          <StatusTimeline currentStatus={booking.status} />
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">What happens next?</strong>
            <span>
              A service request does <strong>NOT</strong> mean the booking is clinically finalized. Our coordination team is currently reviewing caregiver rosters and will contact you via phone ({booking.customer.phoneNumber}) within 2 business hours to verify physician orders and finalize caregiver allocation.
            </span>
          </div>
        </div>
      </div>

      {/* WHATSAPP & CALL DIRECT ACTIONS (Sections 7 & 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WhatsApp Confirmation Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/25 transition-all hover:scale-[1.02]"
        >
          <MessageSquare className="w-5 h-5" />
          <span>CONTINUE ON WHATSAPP</span>
        </a>

        {/* Call Option */}
        <a
          href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
          className="flex items-center justify-center gap-2 p-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-2xl font-bold text-sm shadow-sm transition-all"
        >
          <Phone className="w-5 h-5 text-emerald-600" />
          <span>CALL VAIRA HOME CARE</span>
        </a>
      </div>

      {/* Service Request Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
        <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Submitted Request Details</span>
          <span className="text-xs font-semibold text-slate-500">
            {formatDate(booking.createdAt)}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Requested Service</span>
            <p className="font-bold text-slate-800">{booking.serviceName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Preferred Start</span>
            <p className="font-bold text-slate-800">
              {booking.schedule.preferredDate} at {booking.schedule.preferredStartTime}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Service Area</span>
            <p className="font-bold text-slate-800">{booking.location.area}, {booking.location.city}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Estimated Price</span>
            <p className="font-bold text-emerald-700">
              {booking.priceEstimate.isFinalPriceDetermined
                ? `₹${booking.priceEstimate.estimatedTotal.toLocaleString()}`
                : 'To be confirmed by coordination desk'}
            </p>
          </div>
        </div>

        {booking.payment && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs mt-2">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">Payment Status</span>
              <span className="font-bold text-slate-800">
                {booking.payment.status === 'FULLY_PAID'
                  ? `Fully Paid: ₹${booking.payment.amount.toLocaleString()}`
                  : booking.payment.status === 'ADVANCE_PAID'
                  ? `Advance Paid: ₹${booking.payment.amount.toLocaleString()}`
                  : 'Pay to Staff on Arrival'}
              </span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[11px] rounded-full">
              {booking.payment.status.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {booking.assignedStaffName && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 mt-2">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Assigned Staff</span>
            <p className="font-bold text-slate-800 mt-0.5">{booking.assignedStaffName}</p>
          </div>
        )}
      </div>

      {/* Dynamic UPI Payment / Advance QR Section */}
      <div className="space-y-2">
        <UPIQRCode
          requestId={booking.id}
          totalAmount={booking.priceEstimate.estimatedTotal || 0}
          customerName={booking.customer.fullName}
          onPaymentSuccess={(details) => {
            recordPayment(
              booking.id,
              {
                status: details.status,
                amount: details.amount,
                transactionRef: details.transactionRef,
                paymentMethod: details.paymentMethod,
              },
              'Customer via Confirmation QR'
            );
          }}
        />
      </div>

      {/* Navigation shortcuts */}
      <div className="flex items-center justify-between pt-4 text-xs">
        <Link href="/" className="font-bold text-slate-600 hover:text-slate-900">
          &larr; Back to Home
        </Link>
        <Link
          href="/my-bookings"
          className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <span>View in Customer Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
