'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  HeartHandshake,
  Activity,
  UserCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import ServiceCard from '@/components/ServiceCard';
import { initialBusinessSettings } from '@/lib/data';

const categoryPills = [
  { id: 'all', label: 'All Services', icon: Sparkles },
  { id: 'nursing', label: 'Clinical Nursing', icon: Activity },
  { id: 'elderly', label: 'Senior Citizen Care', icon: HeartHandshake },
  { id: 'attender', label: 'Patient Attender', icon: UserCheck },
  { id: 'specialized', label: 'Specialized Recovery', icon: ShieldCheck },
];

export default function ServicesPage() {
  const { publishedServices } = useVairaStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredServices = useMemo(() => {
    return publishedServices.filter((service) => {
      if (!service.isPublished) return false;

      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.shortDescription.toLowerCase().includes(q) ||
        service.whoThisIsFor.some((w) => w.toLowerCase().includes(q)) ||
        service.whatIncluded.some((inc) => inc.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || service.category === selectedCategory;

      const matchesArea =
        selectedArea === 'all' ||
        service.serviceAreas.some((a) =>
          a.toLowerCase().includes(selectedArea.toLowerCase())
        );

      return matchesSearch && matchesCategory && matchesArea;
    });
  }, [publishedServices, searchTerm, selectedCategory, selectedArea]);

  const hasActiveFilters =
    Boolean(searchTerm) || selectedCategory !== 'all' || selectedArea !== 'all';

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedArea('all');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 sm:pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-950 text-white pt-10 pb-16 sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Verified Bedside Care Catalog</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            Professional Home Nursing &amp; Elder Care Solutions
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Prescribed bedside nursing, post-operative wound care, and compassionate senior companions across Kanchipuram, Vembedu, and adjoining localities.
          </p>

          {/* Quick Metrics Bar on Mobile */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Background-Audited</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Clock className="w-3.5 h-3.5 text-teal-300" />
              <span>12h / 24h Flexible Shifts</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Kanchipuram &amp; Vembedu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Search & Filter Controls Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
          {/* Top Row: Search input & Area selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-emerald-700 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by need (e.g. stroke, wound dressing, catheter, elder attender)..."
                className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-slate-800 placeholder-slate-400 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Area Dropdown */}
            <div className="md:col-span-4 relative">
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 text-xs sm:text-sm border border-slate-200 rounded-2xl bg-slate-50/70 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold text-slate-700 appearance-none"
                >
                  <option value="all">📍 All Service Localities</option>
                  {initialBusinessSettings.serviceAreas.map((area) => (
                    <option key={area} value={area}>
                      📍 {area}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Category Chips Bar (Mobile scrollable) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categoryPills.map((pill) => {
                const Icon = pill.icon;
                const isSelected = selectedCategory === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategory(pill.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`} />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active summary & reset */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Showing <strong className="text-emerald-700 font-bold">{filteredServices.length}</strong> available care plans
              </span>
              {selectedArea !== 'all' && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-emerald-200">
                  <MapPin className="w-3 h-3" />
                  {selectedArea}
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1"
              >
                <span>Reset Filters</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                No services matched your current selection
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try clearing search terms or selecting a different locality. Our care coordination team can also arrange customized home care schedules.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
              >
                <span>Custom Care Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Trust & Immediate Consultation Strip */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Coordination Desk</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              Unsure which care level your loved one requires?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Talk directly with our local coordinator in Kanchipuram for transparent guidance on caregiver qualifications, shifts, and immediate deployment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Call {initialBusinessSettings.phone1}</span>
            </a>
            <a
              href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent(
                'Hello Vaira Home Care desk, I need guidance selecting a service.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
