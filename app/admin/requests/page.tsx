'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Phone,
  MessageSquare,
  UserCheck,
  RefreshCw,
  StickyNote,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { BookingRequest, BookingStatus } from '@/lib/types';
import { formatDate } from '@/lib/dateUtils';
import StaffAssignmentModal from '@/components/StaffAssignmentModal';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    REQUEST_RECEIVED: 'badge badge-pending',
    UNDER_REVIEW:     'badge badge-review',
    CONTACTED:        'badge badge-contacted',
    CONFIRMED:        'badge badge-confirmed',
    IN_PROGRESS:      'badge badge-active',
    COMPLETED:        'badge badge-completed',
    CANCELLED:        'badge badge-cancelled',
  };
  return (
    <span className={map[status] || 'badge badge-pending'}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminRequestsCRMPage() {
  const {
    bookings,
    staff,
    isHydrated,
    updateBookingStatus,
    assignStaffToBooking,
    addAdminNote,
  } = useVairaStore();

  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState<string>('ALL');
  const [areaFilter, setAreaFilter]       = useState<string>('ALL');
  const [sourceFilter, setSourceFilter]   = useState<string>('ALL');

  const [selectedBookingForStaff, setSelectedBookingForStaff]   = useState<BookingRequest | null>(null);
  const [selectedBookingForNotes, setSelectedBookingForNotes]   = useState<BookingRequest | null>(null);
  const [newNoteText, setNewNoteText]                           = useState('');

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading CRM...</span>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      b.id.toLowerCase().includes(q) ||
      b.customer.fullName.toLowerCase().includes(q) ||
      b.customer.phoneNumber.includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.location.area.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesArea   = areaFilter   === 'ALL' || b.location.area === areaFilter;
    const matchesSource = sourceFilter === 'ALL' || b.leadSource === sourceFilter;
    return matchesSearch && matchesStatus && matchesArea && matchesSource;
  });

  const uniqueAreas   = Array.from(new Set(bookings.map((b) => b.location.area)));
  const uniqueSources = Array.from(new Set(bookings.map((b) => b.leadSource)));
  const hasFilters    = searchTerm || statusFilter !== 'ALL' || areaFilter !== 'ALL' || sourceFilter !== 'ALL';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForNotes || !newNoteText.trim()) return;
    addAdminNote(selectedBookingForNotes.id, newNoteText.trim(), 'Coordinator Desk');
    setNewNoteText('');
    setSelectedBookingForNotes(null);
  };

  const statusSelectClass = (status: string) => {
    const map: Record<string, string> = {
      REQUEST_RECEIVED: 'bg-amber-50 text-amber-800 border-amber-200',
      UNDER_REVIEW:     'bg-orange-50 text-orange-800 border-orange-200',
      CONTACTED:        'bg-violet-50 text-violet-800 border-violet-200',
      CONFIRMED:        'bg-emerald-50 text-emerald-800 border-emerald-200',
      IN_PROGRESS:      'bg-blue-50 text-blue-800 border-blue-200',
      COMPLETED:        'bg-slate-100 text-slate-700 border-slate-200',
      CANCELLED:        'bg-rose-50 text-rose-800 border-rose-200',
    };
    return map[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">CRM Queue</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Service Booking CRM &amp; Dispatch</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage requests, contact families, assign nurses, and record audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl">
            {bookings.length} Total · <span className="text-emerald-400">{filteredBookings.length} shown</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, name, phone, service..."
              className="form-input pl-9 text-sm"
            />
          </div>

          {/* Status */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUEST_RECEIVED">Request Received</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Area */}
          <div className="sm:col-span-3">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="form-input text-sm"
            >
              <option value="ALL">All Service Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="sm:col-span-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="form-input text-sm"
            >
              <option value="ALL">All Sources</option>
              {uniqueSources.map((src) => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="flex justify-end mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setAreaFilter('ALL'); setSourceFilter('ALL'); }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="section-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Customer</th>
                <th>Service &amp; Need</th>
                <th>Area &amp; Schedule</th>
                <th>Status</th>
                <th>Assigned Staff</th>
                <th>Est. Value</th>
                <th>Source</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    {/* ID */}
                    <td>
                      <span className="font-mono font-bold text-slate-800 text-xs block">{b.id}</span>
                      <span className="text-[10px] text-slate-400">{formatDate(b.createdAt)}</span>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="font-bold text-slate-900 text-xs">{b.customer.fullName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{b.customer.phoneNumber}</div>
                      {b.customer.whatsappNumber && (
                        <div className="text-[10px] text-emerald-600 font-medium">WA: {b.customer.whatsappNumber}</div>
                      )}
                    </td>

                    {/* Service */}
                    <td className="max-w-[180px]">
                      <div className="font-bold text-slate-900 text-xs">{b.serviceName}</div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {b.careRequirement.recipient}: {b.careRequirement.generalRequirement}
                      </div>
                      <span className={`badge mt-1 ${
                        b.careRequirement.urgency === 'Urgent'
                          ? 'badge-cancelled'
                          : b.careRequirement.urgency === 'Today'
                          ? 'badge-review'
                          : 'badge-completed'
                      }`}>
                        {b.careRequirement.urgency}
                      </span>
                    </td>

                    {/* Area & Schedule */}
                    <td className="whitespace-nowrap">
                      <div className="font-semibold text-slate-800 text-xs">{b.location.area}</div>
                      <div className="text-[11px] text-slate-500">{b.schedule.preferredDate}</div>
                      <div className="text-[10px] text-slate-400">{b.schedule.preferredStartTime} · {b.schedule.preferredDuration}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="whitespace-nowrap">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${statusSelectClass(b.status)}`}
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

                    {/* Staff */}
                    <td className="whitespace-nowrap">
                      {b.assignedStaffName ? (
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{b.assignedStaffName}</span>
                          <button
                            onClick={() => setSelectedBookingForStaff(b)}
                            className="text-[10px] text-emerald-700 font-bold hover:underline mt-0.5"
                          >
                            Reassign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedBookingForStaff(b)}
                          className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                          <UserCheck className="w-3 h-3" />
                          Assign Staff
                        </button>
                      )}
                    </td>

                    {/* Value */}
                    <td className="whitespace-nowrap">
                      <span className="font-bold text-emerald-700 text-xs">
                        {b.priceEstimate.isFinalPriceDetermined
                          ? `₹${b.priceEstimate.estimatedTotal.toLocaleString('en-IN')}`
                          : 'Custom'}
                      </span>
                    </td>

                    {/* Source */}
                    <td>
                      <span className="badge badge-completed">{b.leadSource}</span>
                    </td>

                    {/* Actions */}
                    <td className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`tel:${b.customer.phoneNumber}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${b.customer.whatsappNumber || b.customer.phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hello ${b.customer.fullName}, coordinator here from Vaira Home Care regarding request ${b.id}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedBookingForNotes(b)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Notes & Audit Trail"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="text-slate-400 space-y-2">
                      <Filter className="w-8 h-8 mx-auto opacity-40" />
                      <p className="text-sm font-medium">No requests match the current filters.</p>
                      {hasFilters && (
                        <button
                          onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); setAreaFilter('ALL'); setSourceFilter('ALL'); }}
                          className="text-xs text-emerald-700 font-bold hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Assignment Modal */}
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

      {/* Notes & Audit Modal */}
      {selectedBookingForNotes && (
        <div className="modal-backdrop">
          <div className="modal-panel w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Notes &amp; Audit Trail</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedBookingForNotes.id}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Audit History */}
              <div>
                <p className="form-label mb-3">Audit History</p>
                <div className="space-y-2">
                  {selectedBookingForNotes.auditTrail.map((log, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-slate-800">{log.action}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">By: {log.performedBy}</div>
                      {log.details && <div className="text-xs text-slate-600 mt-1">{log.details}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordinator Notes */}
              <div>
                <p className="form-label mb-3">Coordinator Notes</p>
                {selectedBookingForNotes.adminNotes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBookingForNotes.adminNotes.map((note) => (
                      <div key={note.id} className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                        <p className="text-xs text-amber-900 font-medium">{note.note}</p>
                        <div className="flex justify-between text-[10px] text-amber-700 mt-1.5">
                          <span>By: {note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                )}
              </div>
            </div>

            {/* Add Note */}
            <form onSubmit={handleAddNote} className="p-5 border-t border-slate-100 space-y-3">
              <textarea
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add coordinator notes, verification status, family preferences..."
                className="form-input resize-none text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForNotes(null)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Close
                </button>
                <button type="submit" className="btn-primary text-xs px-4 py-2">
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
