'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Settings,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Activity,
} from 'lucide-react';

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'CRM Requests',
    href: '/admin/requests',
    icon: CalendarCheck,
  },
  {
    label: 'Service Config',
    href: '/admin/services',
    icon: Settings,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Admin Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white tracking-wide">VAIRA</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Admin Portal</span>
          </div>
          <span className="text-slate-700 text-xs">|</span>
          <div className="flex items-center gap-1.5">
            <span className="dot-live"><span /><span /></span>
            <span className="text-[11px] text-emerald-400 font-semibold">Operations Center Live</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Activity className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-88px)] bg-slate-900 flex-shrink-0 sticky top-0 self-start">
          <div className="p-3 pt-5 space-y-1">
            <p className="sidebar-section-label">Navigation</p>
            {adminNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </Link>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
            <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/30">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide mb-1">Service Desk</p>
              <p className="text-[11px] text-slate-300 font-medium">+91 87545 19060</p>
              <p className="text-[10px] text-slate-500 mt-0.5">24h Coordination Active</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 bg-slate-50 p-6 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
}
