'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  CalendarCheck,
  DollarSign,
  PieChart,
  BarChart3,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { LeadSource } from '@/lib/types';

export default function AdminAnalyticsPage() {
  const { bookings, services, isHydrated } = useVairaStore();

  if (!isHydrated) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        Loading analytics engine...
      </div>
    );
  }

  const totalBookings = bookings.length;
  const confirmedOrActive = bookings.filter(
    (b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS' || b.status === 'COMPLETED'
  ).length;
  const cancelledCount = bookings.filter((b) => b.status === 'CANCELLED').length;
  const cancellationRate = totalBookings > 0 ? ((cancelledCount / totalBookings) * 100).toFixed(1) : '0';

  const totalEstimatedRevenue = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);

  // Group by Lead Source (Section 17)
  const sources: LeadSource[] = [
    'Google',
    'Justdial',
    'WhatsApp',
    'Direct',
    'Referral',
    'Facebook',
    'Instagram',
    'Website',
  ];

  const sourceData = sources.map((source) => {
    const matching = bookings.filter((b) => b.leadSource === source);
    const count = matching.length;
    const revenue = matching
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);

    return {
      source,
      count,
      percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
      revenue,
    };
  });

  // Group by Service Demand
  const serviceDemand = services.map((service) => {
    const matching = bookings.filter((b) => b.serviceId === service.id || b.serviceName === service.name);
    const revenue = matching
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.priceEstimate.estimatedTotal || 0), 0);

    return {
      name: service.name,
      count: matching.length,
      revenue,
    };
  }).sort((a, b) => b.count - a.count);

  // Group by Area
  const areaCounts: { [key: string]: { count: number; revenue: number } } = {};
  bookings.forEach((b) => {
    const area = b.location.area || 'Other';
    if (!areaCounts[area]) areaCounts[area] = { count: 0, revenue: 0 };
    areaCounts[area].count += 1;
    if (b.status !== 'CANCELLED') {
      areaCounts[area].revenue += b.priceEstimate.estimatedTotal || 0;
    }
  });

  const areaData = Object.entries(areaCounts).sort((a, b) => b[1].count - a[1].count);

  // Funnel Data (Section 18)
  const funnelSteps = [
    { label: 'VISITOR', count: 480, dropPct: '100%' },
    { label: 'SERVICE VIEW', count: 320, dropPct: '66.7%' },
    { label: 'REQUEST RECEIVED', count: totalBookings, dropPct: `${Math.round((totalBookings / 320) * 100)}%` },
    {
      label: 'CONTACTED',
      count: bookings.filter((b) => b.status !== 'REQUEST_RECEIVED').length,
      dropPct: `${totalBookings > 0 ? Math.round((bookings.filter((b) => b.status !== 'REQUEST_RECEIVED').length / totalBookings) * 100) : 0}%`,
    },
    { label: 'CONFIRMED', count: confirmedOrActive, dropPct: `${totalBookings > 0 ? Math.round((confirmedOrActive / totalBookings) * 100) : 0}%` },
    { label: 'COMPLETED', count: bookings.filter((b) => b.status === 'COMPLETED').length, dropPct: 'Realized' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Operations
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-bold text-emerald-700">Analytics & Funnel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Care Demand & Conversion Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Measure service popularity, geographic concentration, lead attribution, and care completion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/requests"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Open CRM Queue</span>
          </Link>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings Value</span>
          <div className="text-2xl font-black text-slate-900">₹{totalEstimatedRevenue.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Coordinated care volume</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</span>
          <div className="text-2xl font-black text-emerald-700">
            {totalBookings > 0 ? `${Math.round((confirmedOrActive / totalBookings) * 100)}%` : '0%'}
          </div>
          <span className="text-[11px] text-slate-500">Enquiry to confirmed care</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancellation Rate</span>
          <div className="text-2xl font-black text-rose-700">{cancellationRate}%</div>
          <span className="text-[11px] text-slate-500">{cancelledCount} cancelled requests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Hub</span>
          <div className="text-2xl font-black text-slate-900">{areaData[0]?.[0] || 'Kanchipuram'}</div>
          <span className="text-[11px] text-slate-500">Highest patient density</span>
        </div>
      </div>

      {/* CONVERSION FUNNEL (Section 18) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
            Journey Progression
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            Patient Service Booking Funnel
          </h2>
          <p className="text-xs text-slate-500">
            Visualizing visitor progression from service discovery to verified fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {funnelSteps.map((step, idx) => (
            <div
              key={step.label}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative"
            >
              <span className="text-[10px] font-bold text-slate-400 block">Step 0{idx + 1}</span>
              <div className="text-lg sm:text-xl font-black text-slate-900">{step.count}</div>
              <div className="font-bold text-slate-700 text-xs truncate">{step.label}</div>
              <div className="pt-2 border-t border-slate-200 text-[10px] text-emerald-700 font-semibold">
                Conv: {step.dropPct}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEAD SOURCE ATTRIBUTION & AREA DEMAND (Section 17 & 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lead Source Tracking (Section 17) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Lead Source Attribution</h3>
              <p className="text-xs text-slate-500">Where our patient inquiries originate</p>
            </div>
            <PieChart className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs">
            {sourceData.map((s) => (
              <div key={s.source} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{s.source}</span>
                  <span>
                    {s.count} requests ({s.percentage}%) • ₹{s.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Concentration */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Bookings per Service Area</h3>
              <p className="text-xs text-slate-500">Local volume concentration across Tamil Nadu</p>
            </div>
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="space-y-3 text-xs">
            {areaData.map(([area, stats]) => {
              const pct = totalBookings > 0 ? Math.round((stats.count / totalBookings) * 100) : 0;
              return (
                <div key={area} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{area}</span>
                    <span>
                      {stats.count} bookings ({pct}%) • ₹{stats.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SERVICE DEMAND RANKINGS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="font-bold text-slate-900 text-base">Service Demand & Revenue Breakdown</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Service Name</th>
                <th className="px-4 py-3">Booking Inquiries</th>
                <th className="px-4 py-3">Estimated Pipeline Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceDemand.map((srv) => (
                <tr key={srv.name} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold text-slate-900">{srv.name}</td>
                  <td className="px-4 py-3">{srv.count} requests</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">
                    ₹{srv.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
