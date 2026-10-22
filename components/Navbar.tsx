'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  Heart,
  CalendarCheck,
  ChevronRight,
  User,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data';
import { useVairaStore } from '@/lib/store';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'My Bookings', href: '/my-bookings' },
  { name: 'Staff Portal', href: '/staff' },
  { name: 'Admin CRM', href: '/admin' },
];

function GoogleIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { currentUser, logoutUser } = useVairaStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/96 backdrop-blur-xl shadow-sm shadow-slate-900/6 border-b border-slate-200'
            : 'bg-white/90 backdrop-blur-lg border-b border-slate-200/60'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Top Strip */}
        <div className="bg-[#0f172a] text-slate-300 text-[11px] font-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-slate-400">
                <span className="text-white font-semibold">Emergency?</span>{' '}
                Dial{' '}
                <a href="tel:108" className="text-red-400 font-bold hover:text-red-300 transition-colors">108</a>
                {' '}· Go to nearest hospital
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-slate-400">
              <span>Tambaram · Vandalur · Perungalathur · Urapakkam · Kanchipuram · Vembedu</span>
              <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Verified Staff
              </span>
            </div>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[62px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md shadow-emerald-900/10 border border-slate-200/80 group-hover:scale-105 transition-all duration-300 p-0.5 flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Vaira Nursing Home Care Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-black tracking-tight text-slate-900 leading-none">VAIRA</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Home Care
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                  Nursing &amp; Elderly Care Agency
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                      active
                        ? 'text-green-700 bg-green-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-green-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
              >
                <Phone className="w-3.5 h-3.5 text-green-600" />
                <span>{initialBusinessSettings.phone1}</span>
              </a>

              {/* User Authentication state (Google Only) */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                  <Link
                    href="/my-bookings"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[12px] font-bold hover:bg-emerald-100 transition-all"
                  >
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{currentUser.name.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={() => logoutUser()}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 text-[12px] font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}

              <Link
                href="/book"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-green-600/25 hover:shadow-green-600/40 hover:scale-[1.02] transition-all duration-200"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Request Service</span>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              {currentUser ? (
                <Link
                  href="/my-bookings"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{currentUser.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
              <Link
                href="/book"
                className="bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold px-3 py-1.5 rounded-xl shadow-md shadow-green-600/25 transition-all"
              >
                Book
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" />
          <div
            className="relative mt-[105px] mx-4 bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/70 overflow-hidden animate-slide-up max-h-[calc(100vh-120px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Session Bar in Mobile Menu */}
            {currentUser ? (
              <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[170px]">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white border border-rose-200 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border-b border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 text-xs font-bold rounded-xl active:scale-95 transition-all shadow-xs"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </Link>
              </div>
            )}

            {/* Quick contact */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-white border-b border-slate-100">
              <a
                href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 active:scale-95 transition-transform"
              >
                <Phone className="w-3.5 h-3.5 text-green-600" />
                Call Desk
              </a>
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I need assistance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-800 active:scale-95 transition-transform"
              >
                <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                WhatsApp
              </a>
            </div>

            {/* Nav Links */}
            <div className="p-2 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                      active
                        ? 'bg-green-50 text-green-800 border border-green-100'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-green-500' : 'text-slate-400'}`} />
                  </Link>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60">
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Service Coverage: </span>
                Kanchipuram, Vembedu, Walajabad, Oragadam & Sriperumbudur
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
