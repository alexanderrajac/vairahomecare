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
  Phone,
  MessageSquare,
  ArrowRight,
  Bell,
  Activity,
  DollarSign,
  XCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Circle,
  Globe,
  Copy,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';

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

export default function AdminDashboardPage() {
  const { bookings, services, staff, notifications, isHydrated } = useVairaStore();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading Operations Center...</span>
      </div>
    );
  }

  const totalRequests  = bookings.length;
  const pendingReview  = bookings.filter((b) => b.status === 'REQUEST_RECEIVED' || b.status === 'UNDER_REVIEW').length;
  const confirmed      = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const inProgress     = bookings.filter((b) => b.status === 'IN_PROGRESS').length;
  const completed      = bookings.filter((b) => b.status === 'COMPLETED').length;
  const cancelled      = bookings.filter((b) => b.status === 'CANCELLED').length;
  const availableStaff = staff.filter((s) => s.status === 'AVAILABLE').length;

  const totalEstimatedRevenue = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);

  const recentBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6);

  const kpiCards = [
    {
      label: 'Total Leads',
      value: totalRequests,
      sub: 'All-time bookings',
      color: 'kpi-card',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Need Action',
      value: pendingReview,
      sub: 'Awaiting review',
      color: 'kpi-card kpi-warning',
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Confirmed',
      value: confirmed,
      sub: 'Staff allocated',
      color: 'kpi-card kpi-success',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Active Care',
      value: inProgress,
      sub: 'At patient homes',
      color: 'kpi-card kpi-info',
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Completed',
      value: completed,
      sub: 'Fulfilled services',
      color: 'kpi-card kpi-purple',
      icon: <Sparkles className="w-5 h-5 text-violet-500" />,
      bg: 'bg-violet-50',
    },
    {
      label: 'Pipeline Value',
      value: `₹${(totalEstimatedRevenue / 1000).toFixed(1)}K`,
      sub: 'Estimated revenue',
      color: 'kpi-card',
      icon: <DollarSign className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
            Coordinator Portal
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Care Operations Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time tracking of patient care requests and staff coordination.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/admin/requests" className="btn-primary">
            <CalendarCheck className="w-4 h-4" />
            Manage Requests
          </Link>
          <Link href="/admin/analytics" className="btn-secondary">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card, i) => (
          <div key={i} className={`${card.color} animate-slide-up delay-${(i + 1) * 100}`}>
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <div className="stat-number text-2xl text-slate-900 mb-0.5">{card.value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Requests CRM */}
        <div className="lg:col-span-8 section-card animate-slide-up delay-200">
          <div className="section-card-header">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recent Coordination Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest service requests requiring action</p>
            </div>
            <Link href="/admin/requests" className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {b.id}
                    </span>
                    <StatusBadge status={b.status} />
                    <span className="text-[10px] text-slate-400 font-medium">via {b.leadSource}</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm truncate">{b.customer.fullName}
                    <span className="font-normal text-slate-500"> · {b.serviceName}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {b.location.area} · {b.schedule.preferredDate} @ {b.schedule.preferredStartTime}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <a
                    href={`tel:${b.customer.phoneNumber}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${b.customer.whatsappNumber || b.customer.phoneNumber.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hello ${b.customer.fullName}, contacting from Vaira Home Care regarding request ${b.id}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href={`/admin/requests?highlight=${b.id}`}
                    className="btn-navy text-[11px] px-3 py-1.5"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}

            {recentBookings.length === 0 && (
              <div className="px-5 py-12 text-center text-slate-400 text-sm">
                No booking requests yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-4 space-y-5">
          {/* Staff Roster */}
          <div className="section-card animate-slide-up delay-300">
            <div className="section-card-header">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Caregiver Roster
              </h3>
              <span className={`badge ${availableStaff > 0 ? 'badge-confirmed' : 'badge-cancelled'}`}>
                {availableStaff} Ready
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">Available Now</span>
                <span className="font-extrabold text-slate-900">{availableStaff} / {staff.length}</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: staff.length > 0 ? `${(availableStaff / staff.length) * 100}%` : '0%' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-lg font-extrabold text-slate-900">{staff.length}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">Total Staff</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <div className="text-lg font-extrabold text-emerald-700">{availableStaff}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wide mt-0.5">On Duty</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Serving Kanchipuram, Vembedu &amp; surrounding districts. All staff physician-prescription compliant.
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="section-card animate-slide-up delay-400">
            <div className="section-card-header">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                System Notifications
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="dot-live"><span /><span /></span>
                <span className="text-[10px] font-bold text-emerald-600">Live</span>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto no-scrollbar">
              {notifications.slice(0, 6).map((n) => (
                <div key={n.id} className="notif-item space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{n.title}</span>
                    <span className="badge badge-confirmed text-[9px]">{n.channel}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
              )}
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 text-white border border-white/5 animate-slide-up delay-500">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold">Today's Snapshot</span>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Pending Action', val: pendingReview, color: 'text-amber-400' },
                { label: 'In Active Care', val: inProgress, color: 'text-blue-400' },
                { label: 'Completed Today', val: completed, color: 'text-emerald-400' },
                { label: 'Cancelled', val: cancelled, color: 'text-rose-400' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-extrabold ${item.color}`}>{item.val}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Est. Pipeline Revenue</span>
                <span className="font-extrabold text-emerald-400">₹{totalEstimatedRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Google Search Console Verification Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">Google Search Console</h4>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                HTML Tag Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Domain verification tags are embedded in the &lt;head&gt; of all pages for Google Search Console indexing.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 break-all select-all">
              &lt;meta name="google-site-verification" content="xVAgJqu9tNuX6LGGai1GMeIyhbvvL--7Cz-ydHHkaww" /&gt;
            </div>
            <div className="flex items-center justify-between pt-1">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Open Search Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] text-slate-400">DNS &amp; HTML verified</span>
            </div>
          </div>

          {/* Staff Roster Quick Control Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">Care Staff Status</h4>
              </div>
              <Link
                href="/admin/staff"
                className="text-[11px] font-bold text-blue-700 hover:underline"
              >
                Manage Staff →
              </Link>
            </div>
            <div className="space-y-2">
              {staff.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <div className="truncate max-w-[140px]">
                    <span className="font-bold text-slate-800 block truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{m.role}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'AVAILABLE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : m.status === 'ON_DUTY'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
