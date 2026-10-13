'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Search,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Calendar,
  UserCheck,
  Star,
  RefreshCw,
  XCircle,
  ShieldCheck,
  ChevronRight,
  QrCode,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { BookingRequest, BookingStatus } from '@/lib/types';
import StatusTimeline from '@/components/StatusTimeline';
import ReviewModal from '@/components/ReviewModal';
import UPIQRCode from '@/components/UPIQRCode';
import { initialBusinessSettings } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';

export default function MyBookingsPage() {
  const {
    bookings,
    isHydrated,
    requestReschedule,
    requestCancellation,
    submitCustomerReview,
    recordPayment,
  } = useVairaStore();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchIdOrPhone, setSearchIdOrPhone] = useState('');
  const [payBooking, setPayBooking] = useState<BookingRequest | null>(null);

  // Reschedule Modal State
  const [rescheduleBooking, setRescheduleBooking] = useState<BookingRequest | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Cancel Modal State
  const [cancelBooking, setCancelBooking] = useState<BookingRequest | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<BookingRequest | null>(null);

  // Tab Filtering
  const filteredBookings = bookings.filter((b) => {
    // Search filter
    if (searchIdOrPhone.trim()) {
      const q = searchIdOrPhone.trim().toLowerCase();
      const matchId = b.id.toLowerCase().includes(q);
      const matchPhone = b.customer.phoneNumber.includes(q);
      const matchName = b.customer.fullName.toLowerCase().includes(q);
      if (!matchId && !matchPhone && !matchName) return false;
    }

    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming')
      return b.status === 'CONFIRMED' || b.status === 'UNDER_REVIEW' || b.status === 'REQUEST_RECEIVED';
    if (activeTab === 'active') return b.status === 'IN_PROGRESS';
    if (activeTab === 'completed') return b.status === 'COMPLETED';
    if (activeTab === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleBooking || !newDate || !rescheduleReason.trim()) return;
    requestReschedule(rescheduleBooking.id, newDate, newTime, rescheduleReason);
    setRescheduleBooking(null);
    setRescheduleReason('');
    alert('Reschedule request submitted! Our coordination team will review staff availability.');
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelBooking || !cancelReason.trim()) return;
    requestCancellation(cancelBooking.id, cancelReason);
    setCancelBooking(null);
    setCancelReason('');
    alert('Your cancellation request has been recorded.');
  };

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading customer booking dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full">
            Customer Self-Service Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            My Service Requests & Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track status, view assigned caregivers, and manage schedules.
          </p>
        </div>

        <Link
          href="/book"
          className="self-start md:self-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>New Service Request</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'active', label: 'Active Care' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchIdOrPhone}
              onChange={(e) => setSearchIdOrPhone(e.target.value)}
              placeholder="Search ID or Phone..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const isCompleted = b.status === 'COMPLETED';
            const isCancelled = b.status === 'CANCELLED';
            const canRescheduleOrCancel = !isCompleted && !isCancelled;

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {b.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{b.serviceName}</h3>
                    <span className="text-xs text-slate-400">
                      Requested on {formatDate(b.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full self-start sm:self-auto ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'COMPLETED'
                        ? 'bg-slate-100 text-slate-800'
                        : b.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Progress Status Timeline */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <StatusTimeline currentStatus={b.status} />
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Patient / Customer</span>
                    <p className="font-bold text-slate-800 mt-1">{b.customer.fullName}</p>
                    <p className="text-slate-500">{b.customer.phoneNumber}</p>
                    <p className="text-slate-500">For: {b.careRequirement.recipient}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Schedule</span>
                    <p className="font-bold text-slate-800 mt-1">{b.schedule.preferredDate}</p>
                    <p className="text-slate-500">Time: {b.schedule.preferredStartTime}</p>
                    <p className="text-slate-500">Duration: {b.schedule.preferredDuration}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Service Location</span>
                    <p className="font-bold text-slate-800 mt-1">{b.location.area}</p>
                    <p className="text-slate-500">{b.location.houseBuilding}</p>
                    <p className="text-slate-500">{b.location.city} - {b.location.pincode}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Assigned Staff</span>
                    {b.assignedStaffName ? (
                      <div className="mt-1">
                        <p className="font-bold text-emerald-800 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{b.assignedStaffName}</span>
                        </p>
                        <span className="text-[11px] text-slate-500">Verified & Approved</span>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic mt-1">Pending Coordinator Assignment</p>
                    )}
                  </div>
                </div>

                {/* Reschedule or Cancel Notice if pending */}
                {b.rescheduleRequest && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <strong>Reschedule Requested:</strong> New preferred date {b.rescheduleRequest.requestedDate} at{' '}
                    {b.rescheduleRequest.requestedTime} (Reason: {b.rescheduleRequest.reason}). Status:{' '}
                    <span className="font-bold">{b.rescheduleRequest.status}</span>
                  </div>
                )}

                {/* Customer Review if completed */}
                {b.review && (
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(b.review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="font-bold text-slate-800 ml-1">Your Review</span>
                    </div>
                    <p className="text-slate-700 italic">"{b.review.reviewText}"</p>
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contact Desk</span>
                    </a>
                    <a
                      href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent(`Hello Vaira Home Care, inquiring about request ${b.id}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* UPI QR Pay Button */}
                    <button
                      onClick={() => setPayBooking(b)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-sm transition-all ${
                        b.payment?.status === 'FULLY_PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>
                        {b.payment?.status === 'FULLY_PAID'
                          ? `Paid (₹${b.payment.amount})`
                          : b.payment?.status === 'ADVANCE_PAID'
                          ? 'Pay Balance via UPI'
                          : 'Pay Advance via UPI'}
                      </span>
                    </button>

                    {/* Review Button for completed requests */}
                    {isCompleted && !b.review && (
                      <button
                        onClick={() => setReviewBooking(b)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {/* Reschedule button */}
                    {canRescheduleOrCancel && (
                      <button
                        onClick={() => {
                          setRescheduleBooking(b);
                          setNewDate(b.schedule.preferredDate);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Request Reschedule</span>
                      </button>
                    )}

                    {/* Cancel button */}
                    {canRescheduleOrCancel && (
                      <button
                        onClick={() => setCancelBooking(b)}
                        className="flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Service Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no service requests in this tab. Submit a new service request to coordinate verified home care.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
            >
              Book a Service
            </Link>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL (Section 10) */}
      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>Request Reschedule ({rescheduleBooking.id})</span>
              </h3>
              <button
                onClick={() => setRescheduleBooking(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 block">Rescheduling Policy:</strong>
              <p>
                Schedule changes are subject to caregiver roster availability and requires manual confirmation by our desk. Please provide at least 24 hours notice.
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Preferred Date *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Preferred Timing
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                >
                  <option value="08:00 AM">Morning Shift (08:00 AM)</option>
                  <option value="09:00 AM">General Day (09:00 AM)</option>
                  <option value="08:00 PM">Night Shift (08:00 PM)</option>
                  <option value="24h Continuous">24-Hour Stay-in</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Rescheduling *
                </label>
                <textarea
                  rows={2}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Doctor postponed discharge by two days..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleBooking(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Submit Reschedule Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL (Section 10) */}
      {cancelBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Cancel Request ({cancelBooking.id})</span>
              </h3>
              <button
                onClick={() => setCancelBooking(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <strong className="block font-bold">Cancellation Policy:</strong>
              <p>
                Advance notice of at least 24 hours is appreciated to allow timely staff reallocation without retention fee.
              </p>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Family member available to care, patient readmitted, etc."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelBooking(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPI QR PAYMENT MODAL */}
      {payBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl my-8">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">UPI Payment for {payBooking.id}</span>
              <button
                onClick={() => setPayBooking(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <UPIQRCode
                requestId={payBooking.id}
                totalAmount={payBooking.priceEstimate?.estimatedTotal || 0}
                customerName={payBooking.customer?.fullName}
                onPaymentSuccess={(details) => {
                  recordPayment(
                    payBooking.id,
                    {
                      status: details.status,
                      amount: details.amount,
                      transactionRef: details.transactionRef,
                      paymentMethod: details.paymentMethod,
                    },
                    'Customer (My Bookings UPI QR)'
                  );
                  setTimeout(() => {
                    setPayBooking(null);
                  }, 1500);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
