'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  CalendarCheck,
  DollarSign,
  PieChart,
  MapPin,
  Percent,
  RefreshCw,
  BarChart3,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { LeadSource } from '@/lib/types';

const SOURCE_COLORS: Record<string, string> = {
  Google:     'from-blue-500 to-blue-600',
  Justdial:   'from-orange-500 to-orange-600',
  WhatsApp:   'from-emerald-500 to-green-600',
  Direct:     'from-violet-500 to-purple-600',
  Referral:   'from-pink-500 to-rose-600',
  Facebook:   'from-indigo-500 to-blue-700',
  Instagram:  'from-fuchsia-500 to-pink-600',
  Website:    'from-teal-500 to-cyan-600',
};

const AREA_COLORS = [
  'from-emerald-500 to-teal-500',
  'from-blue-500 to-indigo-500',
  'from-violet-500 to-purple-500',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
];

export default function AdminAnalyticsPage() {
  const { bookings, services, isHydrated } = useVairaStore();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm font-medium">Loading analytics engine...</span>
      </div>
    );
  }

  const totalBookings     = bookings.length;
  const confirmedOrActive = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED'
  ).length;
  const cancelledCount   = bookings.filter((b) => b.status === 'CANCELLED').length;
  const completedCount   = bookings.filter((b) => b.status === 'COMPLETED').length;
  const cancellationRate = totalBookings > 0 ? ((cancelledCount / totalBookings) * 100).toFixed(1) : '0';
  const conversionRate   = totalBookings > 0 ? Math.round((confirmedOrActive / totalBookings) * 100) : 0;

  const totalEstimatedRevenue = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);

  const sources: LeadSource[] = ['Google','Justdial','WhatsApp','Direct','Referral','Facebook','Instagram','Website'];
  const sourceData = sources.map((source) => {
    const matching = bookings.filter((b) => b.leadSource === source);
    const count    = matching.length;
    const revenue  = matching
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);
    return {
      source,
      count,
      percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
      revenue,
    };
  }).filter((s) => s.count > 0).sort((a, b) => b.count - a.count);

  const serviceDemand = services.map((service) => {
    const matching = bookings.filter((b) => b.serviceId === service.id || b.serviceName === service.name);
    const revenue  = matching
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);
    return { name: service.name, count: matching.length, revenue };
  }).sort((a, b) => b.count - a.count);

  const maxService = Math.max(...serviceDemand.map((s) => s.count), 1);

  const areaCounts: { [key: string]: { count: number; revenue: number } } = {};
  bookings.forEach((b) => {
    const area = b.location.area || 'Other';
    if (!areaCounts[area]) areaCounts[area] = { count: 0, revenue: 0 };
    areaCounts[area].count += 1;
    if (b.status !== 'CANCELLED') areaCounts[area].revenue += b.priceEstimate.estimatedTotal || 0;
  });
  const areaData = Object.entries(areaCounts).sort((a, b) => b[1].count - a[1].count);

  const funnelSteps = [
    { label: 'Visitor', count: 480, icon: '👁️' },
    { label: 'Service View', count: 320, icon: '📋' },
    { label: 'Request Submitted', count: totalBookings, icon: '📝' },
    { label: 'Contacted', count: bookings.filter((b) => b.status !== 'REQUEST_RECEIVED').length, icon: '📞' },
    { label: 'Confirmed', count: confirmedOrActive, icon: '✅' },
    { label: 'Completed', count: completedCount, icon: '⭐' },
  ];
  const maxFunnel = Math.max(...funnelSteps.map((s) => s.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Analytics</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Care Demand &amp; Conversion Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Service popularity, geographic spread, lead attribution, and care completion metrics.
          </p>
        </div>
        <Link href="/admin/requests" className="btn-navy flex-shrink-0">
          <CalendarCheck className="w-4 h-4" />
          Open CRM Queue
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Pipeline Revenue',
            value: `₹${(totalEstimatedRevenue / 1000).toFixed(1)}K`,
            sub: 'Total coordinated value',
            icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
            bg: 'bg-emerald-50',
            color: 'kpi-card kpi-success',
          },
          {
            label: 'Conversion Rate',
            value: `${conversionRate}%`,
            sub: 'Enquiry to confirmed care',
            icon: <Target className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50',
            color: 'kpi-card kpi-info',
          },
          {
            label: 'Cancellation Rate',
            value: `${cancellationRate}%`,
            sub: `${cancelledCount} cancelled requests`,
            icon: <Percent className="w-5 h-5 text-rose-500" />,
            bg: 'bg-rose-50',
            color: 'kpi-card',
          },
          {
            label: 'Primary Hub',
            value: areaData[0]?.[0] || 'Kanchipuram',
            sub: 'Highest patient density',
            icon: <MapPin className="w-5 h-5 text-violet-500" />,
            bg: 'bg-violet-50',
            color: 'kpi-card kpi-purple',
          },
        ].map((card, i) => (
          <div key={i} className={`${card.color} animate-slide-up delay-${(i + 1) * 100}`}>
            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <div className="stat-number text-xl text-slate-900 mb-0.5">{card.value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <div className="section-card animate-slide-up delay-200">
        <div className="section-card-header">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Patient Journey Funnel</h2>
            <p className="text-xs text-slate-500 mt-0.5">From visitor to fulfilled care — progression analysis</p>
          </div>
          <span className="badge badge-confirmed">
            <BarChart3 className="w-3 h-3" />
            Funnel
          </span>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {funnelSteps.map((step, idx) => {
              const pct = Math.round((step.count / maxFunnel) * 100);
              const dropPct = idx > 0 ? Math.round((step.count / funnelSteps[idx - 1].count) * 100) : 100;
              return (
                <div key={step.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center space-y-2">
                  <span className="text-2xl">{step.icon}</span>
                  <div className="text-lg font-extrabold text-slate-900">{step.count.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wide leading-tight">{step.label}</div>
                  <div className="progress-bar-track mt-2">
                    <div
                      className="progress-bar-fill bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700">
                    {idx === 0 ? '100%' : `${isFinite(dropPct) ? dropPct : 0}% of prev`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lead Source + Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Source */}
        <div className="section-card animate-slide-up delay-300">
          <div className="section-card-header">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Lead Source Attribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Where patient inquiries originate</p>
            </div>
            <PieChart className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="p-5 space-y-3">
            {sourceData.length > 0 ? sourceData.map((s) => (
              <div key={s.source} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${SOURCE_COLORS[s.source] || 'from-slate-400 to-slate-500'}`} />
                    <span className="text-xs font-bold text-slate-700">{s.source}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-xs text-slate-500">{s.count} req</span>
                    <span className="text-[11px] font-bold text-emerald-700 w-12 text-right">
                      ₹{(s.revenue / 1000).toFixed(1)}K
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{s.percentage}%</span>
                  </div>
                </div>
                <div className="progress-bar-track">
                  <div
                    className={`progress-bar-fill bg-gradient-to-r ${SOURCE_COLORS[s.source] || 'from-slate-400 to-slate-500'}`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-6">No booking data yet.</p>
            )}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="section-card animate-slide-up delay-400">
          <div className="section-card-header">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Bookings per Service Area</h3>
              <p className="text-xs text-slate-500 mt-0.5">Geographic volume across Tamil Nadu</p>
            </div>
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="p-5 space-y-3">
            {areaData.length > 0 ? areaData.map(([area, stats], i) => {
              const pct = totalBookings > 0 ? Math.round((stats.count / totalBookings) * 100) : 0;
              return (
                <div key={area} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${AREA_COLORS[i % AREA_COLORS.length]}`} />
                      <span className="text-xs font-bold text-slate-700">{area}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xs text-slate-500">{stats.count} bookings</span>
                      <span className="text-[11px] font-bold text-emerald-700 w-12 text-right">
                        ₹{(stats.revenue / 1000).toFixed(1)}K
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className={`progress-bar-fill bg-gradient-to-r ${AREA_COLORS[i % AREA_COLORS.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-slate-400 text-center py-6">No area data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Service Demand Table */}
      <div className="section-card animate-slide-up delay-500">
        <div className="section-card-header">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Service Demand &amp; Revenue Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Which services drive the most bookings and revenue</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Service Name</th>
                <th>Booking Inquiries</th>
                <th>Demand Bar</th>
                <th>Pipeline Revenue</th>
              </tr>
            </thead>
            <tbody>
              {serviceDemand.map((srv, i) => (
                <tr key={srv.name}>
                  <td>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-500'}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-900 text-xs">{srv.name}</span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-700 text-xs">{srv.count}</span>
                    <span className="text-slate-400 text-[11px]"> requests</span>
                  </td>
                  <td className="min-w-[120px]">
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${Math.round((srv.count / maxService) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className="font-extrabold text-emerald-700 text-xs">
                      ₹{srv.revenue.toLocaleString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
              {serviceDemand.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 text-sm">No data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
