'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  User,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  QrCode,
  LogOut,
  Sparkles,
  ExternalLink,
  Banknote,
  Activity,
  UserCheck,
  ChevronRight,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import UPIQRCode from '@/components/UPIQRCode';
import { formatDate } from '@/lib/dateUtils';
import { initialBusinessSettings } from '@/lib/data';

export default function StaffPortalPage() {
  const {
    staff,
    bookings,
    currentStaffSession,
    isHydrated,
    loginStaffWithGoogle,
    registerStaffMember,
    logoutStaff,
    updateStaffDutyStatus,
    assignStaffToBooking,
    recordPayment,
  } = useVairaStore();

  // Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState('Certified Clinical Nurse (GNM / B.Sc)');
  const [regExperience, setRegExperience] = useState(4);
  const [regAreas, setRegAreas] = useState<string[]>(['Kanchipuram', 'Vembedu']);
  const [regShift, setRegShift] = useState<'Day (12h)' | 'Night (12h)' | '24h Stay-in' | 'Flexible'>('Flexible');

  // QR Modal State for In-Person Doorstep Collection
  const [activeCollectingBooking, setActiveCollectingBooking] = useState<any | null>(null);

  if (!isHydrated) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-3 text-sm text-slate-500">Loading Vaira Staff Portal...</p>
      </div>
    );
  }

  // Pre-configured staff accounts for 1-click Google Sign-in demo
  const quickStaffAccounts = [
    {
      name: 'Sister Revathi M.',
      email: 'revathi.nurse@gmail.com',
      role: 'Staff Nurse (GNM)',
      avatar: 'https://images.unsplash.com/photo-1594824813572-c07a01d6706e?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Sister Gomathi S.',
      email: 'gomathi.care@gmail.com',
      role: 'Senior Bedside Attender',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Mr. Anbarasan P.',
      email: 'anbarasan.care@gmail.com',
      role: 'Patient Recovery Attender',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const handleGoogleQuickLogin = (acc: typeof quickStaffAccounts[0]) => {
    loginStaffWithGoogle(acc.email, acc.name, acc.avatar);
  };

  const handleCustomGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    const displayName = googleName.trim() || googleEmail.split('@')[0];
    loginStaffWithGoogle(googleEmail.trim(), displayName);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
      alert('Please fill out all required fields');
      return;
    }

    registerStaffMember({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: regRole,
      experienceYears: Number(regExperience),
      verifiedSkills: ['Clinical Care', 'Vitals Charting', 'Elder Assistance'],
      assignedAreas: regAreas,
      shiftAvailability: regShift,
      languages: ['Tamil', 'English'],
    });
  };

  // If NOT logged in: Show Google Sign-in & Registration Screen
  if (!currentStaffSession) {
    return (
      <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Top Brand Identity */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Caregiver Duty Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Vaira Staff Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Assigned caregivers, nurses, and bedside attenders sign in with Google to access duty rosters and collect doorstep payments.
            </p>
          </div>

          {/* Toggle Login vs Register */}
          <div className="bg-white p-1 rounded-2xl border border-slate-200 flex text-xs font-bold shadow-sm">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Staff Registration
            </button>
          </div>

          {/* LOGIN VIEW */}
          {authMode === 'login' ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  1-Click Google Staff Login
                </span>

                <div className="space-y-2">
                  {quickStaffAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => handleGoogleQuickLogin(acc)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <strong className="block text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                            {acc.name}
                          </strong>
                          <span className="block text-[11px] text-slate-500">{acc.role}</span>
                        </div>
                      </div>

                      {/* Google G Icon */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-[11px] font-bold text-slate-700">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                        <span>Sign In</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400 font-semibold">Or enter your Google account</span>
                </div>
              </div>

              {/* Custom Google Email Form */}
              <form onSubmit={handleCustomGoogleLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Staff Name
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="e.g. Sister Priya / Brother Karthik"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>
          ) : (
            /* REGISTRATION VIEW */
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Caregiver Registration</h3>
                <p className="text-xs text-slate-500">
                  Register with your credentials to receive patient assignments in Kanchipuram &amp; Vembedu.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sister Meena S."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Google Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="meena@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 94441..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Care Designation</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-medium text-slate-800"
                >
                  <option value="Certified Clinical Nurse (GNM / B.Sc)">
                    Certified Clinical Nurse (GNM / B.Sc)
                  </option>
                  <option value="Senior Citizen Care Attender">Senior Citizen Care Attender</option>
                  <option value="Post-Operative Patient Attender">Post-Operative Patient Attender</option>
                  <option value="Home Physiotherapy Assistant">Home Physiotherapy Assistant</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={regExperience}
                    onChange={(e) => setRegExperience(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shift Availability</label>
                  <select
                    value={regShift}
                    onChange={(e) => setRegShift(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-medium text-slate-800"
                  >
                    <option value="Flexible">Flexible (Day &amp; Night)</option>
                    <option value="Day (12h)">Day (12h Shift)</option>
                    <option value="Night (12h)">Night (12h Shift)</option>
                    <option value="24h Stay-in">24h Stay-in</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-700/20 active:scale-95"
              >
                <span>Register with Google &amp; Start Duty</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-400">
            Need assistance joining Vaira Home Care? Call Coordinator desk:{' '}
            <a href={`tel:${initialBusinessSettings.phone1}`} className="text-emerald-700 font-bold underline">
              {initialBusinessSettings.phone1}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN STAFF DASHBOARD VIEW
  const activeStaff = staff.find((s) => s.id === currentStaffSession.staffId) || {
    id: currentStaffSession.staffId,
    name: currentStaffSession.name,
    role: currentStaffSession.role,
    phone: '+91 94441 55201',
    status: 'AVAILABLE' as const,
    shiftAvailability: 'Flexible' as const,
    assignedAreas: ['Kanchipuram', 'Vembedu'],
  };

  // Find bookings assigned to this staff member
  const myAssignedBookings = bookings.filter(
    (b) =>
      b.assignedStaffId === activeStaff.id ||
      (b.assignedStaffName && b.assignedStaffName.includes(activeStaff.name))
  );

  // Other available bookings in area
  const availableQueue = bookings.filter(
    (b) =>
      !b.assignedStaffId &&
      (b.status === 'REQUEST_RECEIVED' || b.status === 'UNDER_REVIEW' || b.status === 'CONFIRMED')
  );

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 sm:pb-28">
      {/* Top Staff Duty Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 border-2 border-emerald-400/40 flex items-center justify-center text-xl font-black text-white shrink-0">
              {currentStaffSession.avatarUrl ? (
                <img
                  src={currentStaffSession.avatarUrl}
                  alt={activeStaff.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                activeStaff.name.slice(0, 2).toUpperCase()
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{activeStaff.name}</h1>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified Staff</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{activeStaff.role}</p>
              <span className="text-[11px] text-emerald-400 font-mono block">
                ID: {activeStaff.id} • {currentStaffSession.email}
              </span>
            </div>
          </div>

          {/* Duty Status Switch & Logout */}
          <div className="flex items-center gap-3">
            {/* Duty Status Pill */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 text-xs">
              <button
                onClick={() => updateStaffDutyStatus(activeStaff.id, 'ON_DUTY')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeStaff.status === 'ON_DUTY'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>On Duty</span>
              </button>

              <button
                onClick={() => updateStaffDutyStatus(activeStaff.id, 'AVAILABLE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeStaff.status === 'AVAILABLE'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Available</span>
              </button>

              <button
                onClick={() => updateStaffDutyStatus(activeStaff.id, 'ON_LEAVE')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeStaff.status === 'ON_LEAVE'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Off Duty</span>
              </button>
            </div>

            <button
              onClick={logoutStaff}
              className="p-2.5 bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 rounded-xl border border-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Staff Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Fast Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Cases
            </span>
            <span className="text-2xl font-black text-slate-900">{myAssignedBookings.length}</span>
            <span className="text-[11px] text-slate-500 block">Assigned to you</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Duty Shift
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-700">
              {activeStaff.shiftAvailability || 'Flexible (12h/24h)'}
            </span>
            <span className="text-[11px] text-slate-500 block">Current roster slot</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Local Network
            </span>
            <span className="text-sm sm:text-base font-black text-slate-800">
              {activeStaff.assignedAreas?.join(', ') || 'Kanchipuram'}
            </span>
            <span className="text-[11px] text-slate-500 block">Covered radius</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Handheld QR
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5" />
              <span>Instant UPI</span>
            </span>
            <span className="text-[11px] text-slate-500 block">Doorstep collection ready</span>
          </div>
        </div>

        {/* SECTION 1: MY CURRENT ASSIGNED PATIENTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>My Assigned Patient Visits</span>
              </h2>
              <p className="text-xs text-slate-500">
                Patients under your direct clinical care and scheduled bedside shifts.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {myAssignedBookings.length} Active
            </span>
          </div>

          {myAssignedBookings.length > 0 ? (
            <div className="space-y-4">
              {myAssignedBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                          {b.id}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg">{b.customer.fullName}</h3>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {b.careRequirement.careType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Service: <strong className="text-slate-800">{b.serviceName}</strong> • Starts:{' '}
                        <strong>
                          {b.schedule.preferredDate} ({b.schedule.preferredStartTime})
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Patient Address & Care Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                        Patient Residence Address
                      </span>
                      <p className="font-semibold text-slate-800">
                        {b.location.houseBuilding}, {b.location.streetLocality}
                      </p>
                      <p className="text-slate-600">
                        {b.location.area}, {b.location.city} - {b.location.pincode}
                      </p>
                      {b.location.landmark && (
                        <p className="text-emerald-700 font-medium">📍 Landmark: {b.location.landmark}</p>
                      )}

                      {/* Google Maps Shortcut */}
                      <div className="pt-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${b.location.houseBuilding} ${b.location.streetLocality} ${b.location.area} ${b.location.city}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                        Clinical Care Requirement
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {b.careRequirement.generalRequirement}
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600">
                          Recipient: {b.careRequirement.recipient}
                        </span>
                        <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600">
                          Urgency: {b.careRequirement.urgency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar: Call, WhatsApp, and Doorstep Payment Collection */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${b.customer.phoneNumber}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call Family ({b.customer.phoneNumber})</span>
                      </a>

                      <a
                        href={`https://wa.me/${(b.customer.whatsappNumber || b.customer.phoneNumber).replace(
                          /[^0-9]/g,
                          ''
                        )}?text=${encodeURIComponent(
                          `Hello ${b.customer.fullName}, this is ${activeStaff.name} from Vaira Home Care regarding your scheduled care request (${b.id}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs transition-colors border border-emerald-200"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* DOORSTEP PAYMENT COLLECTION BUTTON */}
                    <div className="flex items-center gap-2">
                      {b.payment?.status === 'FULLY_PAID' ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Paid: ₹{b.payment.amount.toLocaleString()}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveCollectingBooking(b)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-700/20 transition-all active:scale-95"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Show UPI QR / Collect Cash</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No cases assigned yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You currently have no patient assigned. Check the open care queue below or let the coordination desk assign upcoming hospital discharges.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: OPEN PATIENT QUEUE (STAFF CAN ACCEPT SHIFTS) */}
        {availableQueue.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-600" />
                  <span>Open Care Queue in Your Service Area</span>
                </h2>
                <p className="text-xs text-slate-500">
                  New home care requests in Kanchipuram and Vembedu waiting for caregiver allocation.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                {availableQueue.length} Waiting
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableQueue.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-700">{req.id}</span>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        📍 {req.location.area}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{req.serviceName}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {req.careRequirement.generalRequirement}
                    </p>

                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                      <div>
                        Preferred Date: <strong>{req.schedule.preferredDate}</strong>
                      </div>
                      <div>
                        Timing: <strong>{req.schedule.preferredStartTime}</strong> ({req.schedule.recurringType})
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      {req.priceEstimate.isFinalPriceDetermined
                        ? `₹${req.priceEstimate.estimatedTotal.toLocaleString()}`
                        : 'Rate Assessed'}
                    </span>

                    <button
                      onClick={() => {
                        assignStaffToBooking(req.id, activeStaff.id, activeStaff.name);
                        alert(`You have accepted care assignment for ${req.id}!`);
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      Accept This Shift
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODAL: HANDHELD UPI QR CODE FOR DOORSTEP PAYMENT COLLECTION */}
      {activeCollectingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 my-8">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  Collect Payment: {activeCollectingBooking.id}
                </span>
              </div>
              <button
                onClick={() => setActiveCollectingBooking(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <UPIQRCode
                requestId={activeCollectingBooking.id}
                totalAmount={activeCollectingBooking.priceEstimate?.estimatedTotal || 2200}
                customerName={activeCollectingBooking.customer?.fullName}
                onPaymentSuccess={(details) => {
                  recordPayment(
                    activeCollectingBooking.id,
                    {
                      status: details.status,
                      amount: details.amount,
                      transactionRef: details.transactionRef,
                      paymentMethod: details.paymentMethod,
                      collectedByStaffName: activeStaff.name,
                    },
                    `Staff ${activeStaff.name} (Doorstep QR)`
                  );
                  setTimeout(() => {
                    setActiveCollectingBooking(null);
                  }, 1200);
                }}
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setActiveCollectingBooking(null)}
                className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Close Collection Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
