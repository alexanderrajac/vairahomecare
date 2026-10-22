'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Phone,
  MessageSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle,
  Briefcase,
  Award,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { StaffMember } from '@/lib/types';

export default function AdminStaffPage() {
  const {
    staff,
    bookings,
    updateStaffDutyStatus,
    saveStaff,
    assignStaffToBooking,
    isHydrated,
  } = useVairaStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New staff form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Certified Clinical Nurse (GNM / B.Sc)');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newExp, setNewExp] = useState(3);
  const [newShift, setNewShift] = useState<'Day (12h)' | 'Night (12h)' | '24h Stay-in' | 'Flexible'>('Flexible');
  const [newAreas, setNewAreas] = useState('Kanchipuram, Vembedu, Vandalur');
  const [newSkills, setNewSkills] = useState('Tracheostomy, IV Cannulation, Bedridden Care, Vitals Monitoring');

  if (!isHydrated) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent" />
        <p className="mt-2 text-xs">Loading Staff Control Center...</p>
      </div>
    );
  }

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newMember: StaffMember = {
      id: `stf-${Date.now().toString().slice(-4)}`,
      name: newName.trim(),
      role: newRole,
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      experienceYears: Number(newExp),
      verifiedSkills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
      assignedAreas: newAreas.split(',').map((a) => a.trim()).filter(Boolean),
      shiftAvailability: newShift,
      status: 'AVAILABLE',
      rating: 5.0,
      languages: ['Tamil', 'English'],
      currentAssignedCount: 0,
      registeredAt: new Date().toISOString(),
    };

    saveStaff([...staff, newMember]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  const pendingBookings = bookings.filter((b) => !b.assignedStaffId && b.status !== 'CANCELLED');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl border border-white/5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Staff Management &amp; Role Control</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Control verified nurse duty status, assign bedside patient cases, and manage staff portal permissions across Chennai, Vandalur, Kanchipuram &amp; Vembedu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Care Staff</span>
          </button>
          <Link
            href="/staff"
            target="_blank"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Staff Portal</span>
          </Link>
        </div>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-200/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-sm mb-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Admin Role (Full Control)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full authority over services, pricing tariffs, customer CRM requests, financial analytics, and staff dispatch permissions.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> All modules unlocked
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-blue-800 font-bold text-sm mb-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Staff / Nurse Role (Duty View)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Restricted to assigned patients only. Can view patient address, call family, update shift status, and collect door-to-door UPI payments. Cannot edit service tariffs.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Field app operational
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm mb-2">
            <Briefcase className="w-4 h-4 text-slate-600" />
            <span>Active Roster Capacity</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-black text-slate-900">{staff.length}</span>
            <span className="text-xs text-slate-500 font-medium">Verified field personnel</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="text-emerald-700 font-bold">
              {staff.filter((s) => s.status === 'AVAILABLE').length} Available
            </span>
            <span>•</span>
            <span className="text-blue-700 font-bold">
              {staff.filter((s) => s.status === 'ON_DUTY').length} On Duty
            </span>
            <span>•</span>
            <span className="text-amber-700 font-bold">
              {staff.filter((s) => s.status === 'ON_LEAVE').length} On Leave
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nurse by name, role, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Status:</span>
          {['ALL', 'AVAILABLE', 'ON_DUTY', 'ON_LEAVE'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member) => {
          const isAvailable = member.status === 'AVAILABLE';
          const isOnDuty = member.status === 'ON_DUTY';
          const isOnLeave = member.status === 'ON_LEAVE';

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header: Name, Role & Status Toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{member.name}</span>
                        <span className="text-[10px] font-semibold text-slate-400">({member.id})</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                    </div>
                  </div>

                  {/* Status Dropdown/Selector */}
                  <select
                    value={member.status}
                    onChange={(e) => updateStaffDutyStatus(member.id, e.target.value as any)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer transition-colors ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isOnDuty
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="AVAILABLE">🟢 Available</option>
                    <option value="ON_DUTY">🔵 On Duty</option>
                    <option value="ON_LEAVE">🟡 On Leave</option>
                  </select>
                </div>

                {/* Details list */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{member.experienceYears} Years Experience • Rating {member.rating || 5.0} ★</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Shift: <strong className="text-slate-800">{member.shiftAvailability}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.assignedAreas.join(', ')}</span>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {member.verifiedSkills.slice(0, 3).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                  {member.verifiedSkills.length > 3 && (
                    <span className="text-[10px] text-slate-400">+{member.verifiedSkills.length - 3}</span>
                  )}
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500">
                  Assigned cases: <strong className="text-slate-800">{member.currentAssignedCount}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${member.phone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Call Staff"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/91${member.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(member.name)},%20Vaira%20Admin%20Duty%20Update:`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                    title="WhatsApp Staff"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Add Care Staff Member</h3>
                  <p className="text-[11px] text-slate-500">Register new field nurse or bedside attendant</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sister Deepa S."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Years Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={newExp}
                    onChange={(e) => setNewExp(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Certified Clinical Nurse (GNM / B.Sc)">Certified Clinical Nurse (GNM / B.Sc)</option>
                  <option value="Senior Bedside Patient Attender">Senior Bedside Patient Attender</option>
                  <option value="Geriatric Elder Care Specialist">Geriatric Elder Care Specialist</option>
                  <option value="Physiotherapist & Rehab Expert">Physiotherapist & Rehab Expert</option>
                  <option value="Maternal & Newborn Care Nurse">Maternal & Newborn Care Nurse</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shift Availability</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="Flexible">Flexible (Any)</option>
                    <option value="Day (12h)">Day (12h)</option>
                    <option value="Night (12h)">Night (12h)</option>
                    <option value="24h Stay-in">24h Stay-in</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Areas</label>
                  <input
                    type="text"
                    value={newAreas}
                    onChange={(e) => setNewAreas(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Verified Clinical Skills (comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Save &amp; Activate Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
