'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  HeartHandshake,
  CalendarCheck,
} from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'Staff Duty', href: '/staff' },
    { name: 'Admin CRM', href: '/admin' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/92 backdrop-blur-xl shadow-lg shadow-slate-900/6 border-b border-slate-200/60'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200/40'
        }`}
      >
        {/* Emergency Bar */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border-b border-amber-200/50 px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="hidden sm:inline font-semibold">Emergency Protocol:</span>
              <span>
                For life-threatening emergencies, dial{' '}
                <a href="tel:108" className="font-black underline text-red-600 hover:text-red-700">108</a>{' '}
                or go to your nearest hospital.
              </span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-slate-500">
              <span className="font-medium">Kanchipuram • Vembedu • Walajabad • Sriperumbudur</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                Verified Caregivers
              </span>
            </div>
          </div>
        </div>

        {/* Main Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:shadow-emerald-600/50 group-hover:scale-105 transition-all duration-300">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900">VAIRA</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Home Care
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-0.5 leading-none">
                  Compassionate Bedside Healthcare
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{initialBusinessSettings.phone1}</span>
              </a>

              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I would like to inquire about home nursing and caregiver services.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl transition-all duration-200"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <Link
                href="/book"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.03] transition-all duration-200 animate-pulse-glow"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Request Service</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/book"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-emerald-600/25"
              >
                Book Now
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in" />

          <div
            className="relative mt-[108px] mx-3 bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/60 overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Contact */}
            <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50/80 border-b border-slate-100">
              <a
                href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-800 shadow-sm active:scale-95 transition-transform"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Call Now
              </a>
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I need assistance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 rounded-xl text-sm font-bold text-white shadow-sm active:scale-95 transition-transform"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            {/* Nav Links */}
            <div className="p-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Desk: </span>
                Gandhi Road, Vembedu & Kanchipuram, Tamil Nadu
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
