'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Search,
  Filter,
  Phone,
  MessageSquare,
  UserCheck,
  CheckCircle,
  Clock,
  MapPin,
  FileText,
  AlertTriangle,
  RefreshCw,
  XCircle,
  Plus,
  StickyNote,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { BookingRequest, BookingStatus, LeadSource } from '@/lib/types';
import { formatDate } from '@/lib/dateUtils';
import StaffAssignmentModal from '@/components/StaffAssignmentModal';

export default function AdminRequestsCRMPage() {
  const {
    bookings,
    staff,
    isHydrated,
    updateBookingStatus,
    assignStaffToBooking,
    addAdminNote,
  } = useVairaStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [areaFilter, setAreaFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  // Selected Booking for Detail Modal / Staff Modal / Note Modal
  const [selectedBookingForStaff, setSelectedBookingForStaff] = useState<BookingRequest | null>(null);
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<BookingRequest | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading requests CRM...
      </div>
    );
  }

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    // Search
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      b.customer.fullName.toLowerCase().includes(q) ||
      b.customer.phoneNumber.includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.location.area.toLowerCase().includes(q);

    // Status
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    // Area
    const matchesArea = areaFilter === 'ALL' || b.location.area === areaFilter;

    // Source
    const matchesSource = sourceFilter === 'ALL' || b.leadSource === sourceFilter;

    return matchesSearch && matchesStatus && matchesArea && matchesSource;
  });

  const uniqueAreas = Array.from(new Set(bookings.map((b) => b.location.area)));
  const uniqueSources = Array.from(new Set(bookings.map((b) => b.leadSource)));

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForNotes || !newNoteText.trim()) return;
    addAdminNote(selectedBookingForNotes.id, newNoteText.trim(), 'Coordinator Desk');
    setNewNoteText('');
    setSelectedBookingForNotes(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Operations
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-bold text-emerald-700">CRM Requests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Service Booking CRM & Staff Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming requests, contact families, assign verified nurses, and record audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            Total In Queue: <strong>{bookings.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Name, Phone, Service..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUEST_RECEIVED">Request Received</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">Service In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Area Filter */}
          <div className="sm:col-span-3">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
            >
              <option value="ALL">All Service Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Lead Source Filter (Section 17) */}
          <div className="sm:col-span-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium"
            >
              <option value="ALL">All Sources</option>
              {uniqueSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filter Action */}
        {(searchTerm || statusFilter !== 'ALL' || areaFilter !== 'ALL' || sourceFilter !== 'ALL') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setAreaFilter('ALL');
                setSourceFilter('ALL');
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* CRM Requests Table (Section 11) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3">Request ID</th>
                <th className="px-4 py-3">Customer & Contact</th>
                <th className="px-4 py-3">Service & Care Need</th>
                <th className="px-4 py-3">Area & Schedule</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Staff</th>
                <th className="px-4 py-3">Est. Value</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Request ID */}
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {b.id}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {formatDate(b.createdAt)}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{b.customer.fullName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{b.customer.phoneNumber}</div>
                      {b.customer.whatsappNumber && (
                        <div className="text-[10px] text-emerald-700 font-medium">
                          WA: {b.customer.whatsappNumber}
                        </div>
                      )}
                    </td>

                    {/* Service & Need */}
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-bold text-slate-900">{b.serviceName}</div>
                      <div className="text-[11px] text-slate-500 truncate" title={b.careRequirement.generalRequirement}>
                        For {b.careRequirement.recipient}: {b.careRequirement.generalRequirement}
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                        Urgency: {b.careRequirement.urgency}
                      </span>
                    </td>

                    {/* Area & Schedule */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{b.location.area}</div>
                      <div className="text-[11px] text-slate-500">
                        {b.schedule.preferredDate} ({b.schedule.preferredStartTime})
                      </div>
                      <div className="text-[10px] text-slate-400">Dur: {b.schedule.preferredDuration}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border focus:ring-1 ${
                          b.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : b.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : b.status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="REQUEST_RECEIVED">Request Received</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    {/* Assigned Staff with quick match button */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {b.assignedStaffName ? (
                        <div>
                          <span className="font-bold text-slate-900 block">{b.assignedStaffName}</span>
                          <button
                            onClick={() => setSelectedBookingForStaff(b)}
                            className="text-[10px] text-emerald-700 font-bold hover:underline mt-0.5 block"
                          >
                            Reassign Staff
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedBookingForStaff(b)}
                          className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg shadow-sm"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Assign Staff</span>
                        </button>
                      )}
                    </td>

                    {/* Est. Value */}
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                      {b.priceEstimate.isFinalPriceDetermined
                        ? `₹${b.priceEstimate.estimatedTotal.toLocaleString()}`
                        : 'Custom'}
                    </td>

                    {/* Lead Source */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {b.leadSource}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      {/* Call Customer */}
                      <a
                        href={`tel:${b.customer.phoneNumber}`}
                        className="inline-block p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      {/* WhatsApp Customer */}
                      <a
                        href={`https://wa.me/${b.customer.whatsappNumber || b.customer.phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hello ${b.customer.fullName}, coordinator here from Vaira Home Care regarding request ${b.id}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="WhatsApp Customer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      {/* Notes button */}
                      <button
                        onClick={() => setSelectedBookingForNotes(b)}
                        className="inline-block p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Add Admin Note"
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No requests found matching your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STAFF ASSIGNMENT MODAL (Section 12) */}
      {selectedBookingForStaff && (
        <StaffAssignmentModal
          booking={selectedBookingForStaff}
          staffList={staff}
          isOpen={!!selectedBookingForStaff}
          onClose={() => setSelectedBookingForStaff(null)}
          onAssign={(staffId) => {
            assignStaffToBooking(selectedBookingForStaff.id, staffId);
            setSelectedBookingForStaff(null);
          }}
        />
      )}

      {/* ADMIN NOTES & AUDIT TRAIL MODAL (Section 11) */}
      {selectedBookingForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Notes & Audit Trail for {selectedBookingForNotes.id}
              </h3>
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Audit Log Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Audit History</span>
                <div className="space-y-2">
                  {selectedBookingForNotes.auditTrail.map((log, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{log.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">By: {log.performedBy}</div>
                      {log.details && <div className="text-slate-600 mt-1">{log.details}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="pt-2">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Internal Coordinator Notes</span>
                {selectedBookingForNotes.adminNotes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBookingForNotes.adminNotes.map((note) => (
                      <div key={note.id} className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                        <p className="text-amber-950 font-medium">{note.note}</p>
                        <div className="flex justify-between text-[10px] text-amber-800 mt-1">
                          <span>By: {note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                )}
              </div>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="pt-3 border-t border-slate-200 space-y-2">
              <textarea
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add coordinator notes, doctor verification status, family preferences..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForNotes(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
