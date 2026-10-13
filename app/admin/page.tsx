'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Settings,
  UserCheck,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  Bell,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';

export default function AdminDashboardPage() {
  const { bookings, services, staff, notifications, isHydrated } = useVairaStore();

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading Admin Operations Center...
      </div>
    );
  }

  const totalRequests = bookings.length;
  const pendingReview = bookings.filter((b) => b.status === 'REQUEST_RECEIVED' || b.status === 'UNDER_REVIEW').length;
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const inProgress = bookings.filter((b) => b.status === 'IN_PROGRESS').length;
  const completed = bookings.filter((b) => b.status === 'COMPLETED').length;

  const totalEstimatedRevenue = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);

  const availableStaff = staff.filter((s) => s.status === 'AVAILABLE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Coordinator Portal
            </span>
            <span className="text-xs font-bold text-emerald-700">Vaira Home Care Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Care Operations & CRM Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of patient care requests, staff matching, and coordination pipelines.
          </p>
        </div>

        {/* Quick Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/requests"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Manage All Requests</span>
          </Link>

          <Link
            href="/admin/services"
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Service Catalog Config</span>
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Lead & Funnel Analytics</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
          <div className="text-2xl font-black text-slate-900">{totalRequests}</div>
          <span className="text-[11px] text-slate-500">All-time bookings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Need Review</span>
          <div className="text-2xl font-black text-amber-900">{pendingReview}</div>
          <span className="text-[11px] text-amber-700">Immediate attention</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm space-y-1">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Confirmed</span>
          <div className="text-2xl font-black text-emerald-900">{confirmed}</div>
          <span className="text-[11px] text-emerald-700">Staff allocated</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm space-y-1">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Active Care</span>
          <div className="text-2xl font-black text-blue-900">{inProgress}</div>
          <span className="text-[11px] text-blue-700">At residence</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
          <div className="text-2xl font-black text-slate-800">{completed}</div>
          <span className="text-[11px] text-slate-500">Fulfillments</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Staff</span>
          <div className="text-2xl font-black text-emerald-700">{availableStaff} / {staff.length}</div>
          <span className="text-[11px] text-slate-500">Ready for shifts</span>
        </div>
      </div>

      {/* Main Grid: Recent Requests & Live Operations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Service Requests CRM Preview */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Recent Coordination Queue</h2>
              <p className="text-xs text-slate-500">Action items awaiting review or confirmation</p>
            </div>
            <Link
              href="/admin/requests"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View Full CRM Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{b.id}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400">Via {b.leadSource}</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{b.customer.fullName} • {b.serviceName}</p>
                  <p className="text-slate-500">
                    {b.location.area} • Start: {b.schedule.preferredDate} ({b.schedule.preferredStartTime})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={`tel:${b.customer.phoneNumber}`}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </a>
                  <a
                    href={`https://wa.me/${b.customer.whatsappNumber || b.customer.phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hello ${b.customer.fullName}, contacting from Vaira Home Care regarding request ${b.id}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl"
                    title="WhatsApp Customer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                  </a>
                  <Link
                    href={`/admin/requests?highlight=${b.id}`}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Notification & Communication Stream (Section 13) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>System Notifications</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Live Audit
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {n.channel}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Staff Roster Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 text-white shadow-md space-y-3 text-xs">
            <h3 className="font-bold text-base flex items-center gap-2 text-white">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Caregiver Roster Snapshot</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              <strong>{availableStaff}</strong> of <strong>{staff.length}</strong> staff currently ready for duty in Kanchipuram and Vembedu.
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-emerald-300">
              <span>Doctor prescription adherence: 100%</span>
              <span className="font-bold">Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
