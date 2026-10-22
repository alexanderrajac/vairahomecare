'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  Clock,
  MapPin,
  CalendarCheck,
  Star,
  BadgeCheck,
  Sparkles,
  Award,
  Users,
  Zap,
  Activity,
  TrendingUp,
  ShoppingCart,
  Package,
  Ambulance,
  Wind,
  Bed,
  Droplets,
  Thermometer,
  Stethoscope,
  Radio,
  PhoneCall,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import ServiceCard from '@/components/ServiceCard';
import { initialBusinessSettings } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';

const TRUST_STATS = [
  { value: '9+', label: 'Years of Trust', icon: Award, color: 'from-amber-400 to-orange-500' },
  { value: '48+', label: 'Vetted Caregivers', icon: Users, color: 'from-blue-400 to-indigo-500' },
  { value: '24/7', label: 'Free Ambulance', icon: Ambulance, color: 'from-red-500 to-rose-600' },
  { value: '100%', label: 'Background-Checked', icon: ShieldCheck, color: 'from-green-500 to-teal-600' },
];

const PROCESS_STEPS = [
  { step: '01', icon: ShoppingCart, title: 'Pick Service', desc: 'Browse and select your care package in seconds.', color: 'bg-violet-500' },
  { step: '02', icon: MapPin, title: 'Set Location', desc: 'Enter your area — Tambaram, Vandalur, Urapakkam & more.', color: 'bg-blue-500' },
  { step: '03', icon: CalendarCheck, title: 'Choose Schedule', desc: 'Pick your date, shift (12h or 24h), and duration.', color: 'bg-green-500' },
  { step: '04', icon: Phone, title: 'We Call You', desc: 'Coordinator verifies and confirms within 30 minutes.', color: 'bg-amber-500' },
  { step: '05', icon: BadgeCheck, title: 'Staff Arrives', desc: 'Verified nurse or caregiver at your doorstep on time.', color: 'bg-teal-500' },
  { step: '06', icon: Star, title: 'Rate & Review', desc: 'Share feedback after service completion.', color: 'bg-rose-500' },
];

const CATEGORIES = [
  { key: 'all', label: '🏥 All Services' },
  { key: 'nursing', label: '💉 Nursing' },
  { key: 'elderly', label: '👴 Senior Care' },
  { key: 'attender', label: '🤲 Attenders' },
  { key: 'specialized', label: '⚕️ Specialized' },
];

const TRUST_PILLARS = [
  {
    title: '100% In-Person Vetted Staff',
    desc: 'Government ID, nursing credentials, and local address verification for every caregiver.',
    icon: ShieldCheck,
    color: 'text-green-600 bg-green-50 border-green-100',
  },
  {
    title: 'Doctor Prescription Adherence',
    desc: 'Nurses follow attending physician charts with documented vitals — no independent diagnoses.',
    icon: Activity,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    title: 'No Hidden Fees or Surcharges',
    desc: 'Transparent shift pricing with upfront confirmation before caregiver arrival.',
    icon: BadgeCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
];

const COVERAGE_AREAS = [
  'Tambaram', 'Vandalur', 'Perungalathur', 'Urapakkam',
  'Kanchipuram', 'Vembedu', 'Oragadam', 'Sriperumbudur', 'Chengalpattu', 'Walajabad',
];

const HOSPITAL_EQUIPMENT = [
  { name: 'Oxygen Concentrator', price: 18000, rental: 1200, icon: Wind, color: 'from-cyan-400 to-blue-500', badge: 'Top Seller' },
  { name: 'Hospital Bed (Motorized)', price: 35000, rental: 1800, icon: Bed, color: 'from-violet-400 to-purple-500', badge: 'Premium' },
  { name: 'Wheelchair (Foldable)', price: 8500, rental: 500, icon: Users, color: 'from-green-400 to-emerald-500', badge: 'Available' },
  { name: 'Suction Machine', price: 12000, rental: 800, icon: Droplets, color: 'from-rose-400 to-pink-500', badge: 'Sale' },
  { name: 'Nebulizer Machine', price: 4500, rental: 350, icon: Thermometer, color: 'from-amber-400 to-orange-500', badge: 'Budget Pick' },
  { name: 'Pulse Oximeter', price: 1800, rental: 150, icon: Activity, color: 'from-teal-400 to-cyan-500', badge: 'Essential' },
  { name: 'Blood Pressure Monitor', price: 2200, rental: 200, icon: Stethoscope, color: 'from-indigo-400 to-blue-500', badge: 'Digital' },
  { name: 'Air Mattress (Anti-Bedsore)', price: 9500, rental: 650, icon: Radio, color: 'from-lime-400 to-green-500', badge: 'Care Essential' },
];

export default function HomePage() {
  const { publishedServices, reviews } = useVairaStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? publishedServices
      : publishedServices.filter((s) => s.category === selectedCategory);

  return (
    <div className="pb-24 md:pb-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* AMBULANCE EMERGENCY STRIP */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white py-2.5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Ambulance className="w-5 h-5 text-white animate-pulse shrink-0" />
            <span className="text-sm font-bold uppercase tracking-wide truncate">
              🚑 FREE 24/7 Ambulance Service — Call Immediately!
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 bg-white text-red-600 font-black text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              {initialBusinessSettings.phone1}
            </a>
            <a
              href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`}
              className="hidden sm:flex items-center gap-1.5 bg-red-500/30 text-white border border-white/30 font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {initialBusinessSettings.phone2}
            </a>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f4c5c 100%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-7 animate-slide-up">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-wider" style={{ background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)', color: '#86efac' }}>
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span>Verified Home Healthcare · Tambaram · Vandalur · Urapakkam · Kanchipuram</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>

              <h1 className="text-[30px] sm:text-[46px] lg:text-[58px] font-black text-white leading-[1.12]">
                Compassionate,{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #4ade80, #22d3ee, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Professional</span>
                <br />
                Home Nursing
                <br />
                <span className="text-slate-300 font-semibold text-[20px] sm:text-[28px] lg:text-[34px] leading-tight mt-1 block">
                  & Elder Care at Your Doorstep
                </span>
              </h1>

              <p className="text-[14px] sm:text-[16px] text-slate-300 leading-relaxed max-w-xl">
                Rest easy knowing your loved ones are cared for by background-verified nurses and compassionate caregivers — coordinated under physician guidance.
              </p>

              {/* Coverage Tags */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-2.5 py-1 rounded-lg border" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
                  <MapPin className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  <span>Coverage:</span>
                </div>
                {COVERAGE_AREAS.slice(0, 6).map((area) => (
                  <span key={area} className="text-[11px] font-medium text-white px-2 py-1 rounded-lg border" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' }}>
                    {area}
                  </span>
                ))}
                <span className="text-[11px] text-slate-400">+4 more</span>
              </div>

              {/* Phone Numbers */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Main Line</div>
                    <a href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`} className="text-white font-black text-[15px] hover:text-green-300 transition-colors">{initialBusinessSettings.phone1}</a>
                  </div>
                </div>
                <div className="hidden sm:block w-px bg-white/15" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Alternate</div>
                    <a href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`} className="text-white font-black text-[15px] hover:text-teal-300 transition-colors">{initialBusinessSettings.phone2}</a>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2 text-white font-bold text-[13px] sm:text-[14px] px-6 py-3.5 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 8px 32px rgba(22,163,74,0.4)' }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Book Service — Easy Checkout</span>
                </Link>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I would like to inquire about home nursing and caregiver services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-bold text-[13px] sm:text-[14px] px-6 py-3.5 rounded-xl hover:scale-[1.02] transition-all duration-200 text-white"
                  style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.35)' }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Us Now</span>
                </a>
              </div>

              {/* Trust Stats */}
              <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {TRUST_STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.value} className="p-3 rounded-xl border hover:scale-[1.02] transition-all" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-[20px] sm:text-[26px] font-black text-white leading-none">{stat.value}</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-tight mt-1">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right visual */}
            <div className="lg:col-span-5 animate-slide-left delay-200">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
                    alt="Vaira Home Care nurse providing compassionate bedside care"
                    className="w-full h-[260px] sm:h-[360px] object-cover"
                  />
                  <div className="p-4 border-t border-white/10" style={{ background: 'rgba(15,23,42,0.9)' }}>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-semibold text-green-300 text-[11px] border px-3 py-1.5 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)' }}>
                        🏥 Doctor-Prescribed Care
                      </span>
                      <span className="text-slate-400 font-medium flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        Tambaram · Vandalur · Kanchipuram
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-3 left-3 sm:-bottom-5 sm:-left-5 p-2.5 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-[12px] font-bold text-white leading-tight">Verified Credentials</div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400">GNM, B.Sc & Care Assistants</div>
                  </div>
                </div>

                <div className="absolute -top-3 right-3 sm:-top-4 sm:-right-4 bg-red-600 px-3 py-2 rounded-2xl shadow-lg border border-red-400/30 flex items-center gap-1.5">
                  <Ambulance className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] sm:text-[11px] font-black text-white">FREE 24/7 Ambulance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden py-3.5" style={{ background: 'linear-gradient(90deg, #16a34a, #0d9488, #16a34a)' }}>
        <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
          {[
            '🚑 FREE 24/7 Ambulance', '✦ Verified Staff Only', '📍 Tambaram', '📍 Vandalur',
            '📍 Perungalathur', '📍 Urapakkam', '✦ Doctor-Prescribed Care', '✦ No Hidden Fees',
            '🏥 Hospital Equipment Sale & Rental',
            '🚑 FREE 24/7 Ambulance', '✦ Verified Staff Only', '📍 Tambaram', '📍 Vandalur',
            '📍 Perungalathur', '📍 Urapakkam', '✦ Doctor-Prescribed Care', '✦ No Hidden Fees',
            '🏥 Hospital Equipment Sale & Rental',
          ].map((text, i) => (
            <span key={i} className="text-white text-[12px] font-semibold tracking-widest uppercase shrink-0">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* AMBULANCE 24/7 BIG BANNER */}
      <section className="py-12 sm:py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #dc2626, #be123c, #dc2626)' }}>
        <div className="absolute -top-12 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' }}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Emergency Response — Always Ready
              </div>
              <h2 className="text-[28px] sm:text-[40px] font-black leading-tight">
                🚑 FREE 24/7 Ambulance<br />
                <span className="text-red-200">Always At Your Service</span>
              </h2>
              <p className="text-red-100 text-[15px] leading-relaxed">
                Vaira Home Care provides round-the-clock free ambulance support across Tambaram, Vandalur, Perungalathur, Urapakkam, Kanchipuram, and surrounding areas. One call is all it takes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 bg-white text-red-700 font-black px-5 py-4 rounded-2xl hover:bg-red-50 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Ambulance className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-[10px] text-red-500 font-medium uppercase tracking-wider">Call Ambulance</div>
                    <div className="text-[15px] font-black">{initialBusinessSettings.phone1}</div>
                  </div>
                </a>
                <a
                  href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 font-black px-5 py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 text-white border-2"
                  style={{ background: 'rgba(239,68,68,0.3)', borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-red-200 font-medium uppercase tracking-wider">Alternate Line</div>
                    <div className="text-[15px] font-black">{initialBusinessSettings.phone2}</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Response Time', value: '< 15 mins', icon: Clock, color: 'from-amber-400 to-orange-500' },
                { title: 'Available', value: '24/7/365', icon: Zap, color: 'from-yellow-400 to-amber-500' },
                { title: 'Service Zones', value: '10+ Areas', icon: MapPin, color: 'from-green-400 to-teal-500' },
                { title: 'Trained Staff', value: 'Paramedics', icon: Activity, color: 'from-blue-400 to-indigo-500' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-4 rounded-2xl border transition-all hover:scale-[1.02]" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-[18px] font-black text-white">{item.value}</div>
                    <div className="text-[11px] text-red-200 font-medium mt-0.5">{item.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="section-label">
              <Sparkles className="w-3.5 h-3.5" />
              Our Healthcare Services
            </span>
            <h2 className="text-[30px] sm:text-[38px] font-black text-slate-900">
              🏥 Book Like Shopping — Simple & Fast!
            </h2>
            <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed">
              Select your care package, add details, and checkout in minutes. We call you to confirm.
            </p>
            <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                    selectedCategory === cat.key
                      ? 'text-white shadow-md scale-105'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-green-200 hover:text-green-700 hover:bg-green-50'
                  }`}
                  style={selectedCategory === cat.key ? { background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 4px 16px rgba(22,163,74,0.25)' } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, i) => (
              <div key={service.id} className={`animate-slide-up delay-${Math.min(i * 100, 500)}`}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-[13px] text-white px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group"
              style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)' }}
            >
              <span>Explore All Services & Pricing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative text-white py-16 sm:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 tracking-widest uppercase">
              <ShoppingCart className="w-3.5 h-3.5" />
              Simple as E-Commerce
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-black text-white">
              How to Book — 6 Easy Steps
            </h2>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Book home care as easily as ordering online. No confusion, no waiting.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROCESS_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative group p-5 rounded-2xl transition-all duration-300 flex flex-col gap-3 hover:scale-[1.03]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-400 tracking-wider">{s.step}</span>
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[13px] text-white">{s.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-px bg-gradient-to-r from-indigo-500/40 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 text-white font-bold text-[14px] px-8 py-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 8px 24px rgba(79,70,229,0.35)' }}
            >
              <ShoppingCart className="w-4 h-4" />
              Book Service Now!
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOSPITAL EQUIPMENT SHOP */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-[11px] font-bold uppercase tracking-wider">
              <Package className="w-3.5 h-3.5 text-violet-600" />
              Medical Equipment Store
            </span>
            <h2 className="text-[30px] sm:text-[38px] font-black text-slate-900">
              🏥 Hospital Equipment — <span className="gradient-text">Buy or Rent</span>
            </h2>
            <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed">
              Home delivery across Tambaram, Vandalur, Perungalathur, Urapakkam & nearby areas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {HOSPITAL_EQUIPMENT.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  <div className={`relative h-24 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute top-2 right-2 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase" style={{ background: 'rgba(255,255,255,0.25)' }}>
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-2.5">
                    <h3 className="font-bold text-[13px] text-slate-900 leading-snug group-hover:text-violet-700 transition-colors">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Buy Price</div>
                        <div className="font-black text-slate-900 text-sm">₹{item.price.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-violet-600 font-bold uppercase tracking-wider">Rent/Month</div>
                        <div className="font-black text-violet-700 text-sm">₹{item.rental.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <a
                        href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('I want to order: ' + item.name + '. Please share details.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 text-[11px] font-bold text-white py-2 px-2 rounded-xl transition-all active:scale-95 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Order
                      </a>
                      <a
                        href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                        className="flex items-center justify-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100 py-2 px-2 rounded-xl transition-all active:scale-95"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-6 rounded-2xl text-white text-center space-y-3 shadow-xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <p className="font-black text-lg">Need a specific equipment not listed here?</p>
            <p className="text-violet-200 text-sm">Call us or WhatsApp — we will source it! Home delivery available.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`} className="flex items-center gap-2 bg-white text-violet-700 font-black px-6 py-3 rounded-xl hover:bg-violet-50 transition-all hover:scale-[1.02]">
                <Phone className="w-4 h-4" />
                {initialBusinessSettings.phone1}
              </a>
              <a href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-[1.02] border" style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' }}>
                <Phone className="w-4 h-4" />
                {initialBusinessSettings.phone2}
              </a>
              <a href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello, I need hospital equipment.')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-[1.02]" style={{ background: '#25D366' }}>
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST + REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="section-label">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trust & Transparency
              </span>
              <h2 className="text-[28px] sm:text-[34px] font-black text-slate-900 mt-4 leading-tight">
                Verified Care You Can Rely On
              </h2>
              <p className="text-[13px] text-slate-500 leading-relaxed mt-3">
                We understand the vulnerability of bringing a caregiver into your home. Vaira operates under strict administrative and clinical safety guidelines.
              </p>
            </div>

            <div className="space-y-3">
              {TRUST_PILLARS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-200">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">{item.title}</p>
                      <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg group"
            >
              <span>Request a Coordinator Callback</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 text-[17px]">Verified Customer Feedback</h3>
              <span className="text-[11px] text-slate-400 font-medium">Authentic Family Testimonials</span>
            </div>

            <div className="space-y-4">
              {reviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all duration-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                      {rev.serviceName}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-600 italic leading-relaxed line-clamp-3">
                    "{rev.reviewText}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                    <span className="font-bold text-slate-700">{rev.customerName}</span>
                    <span>{formatDate(rev.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT REFERENCE POSTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12 text-white shadow-2xl" style={{ background: 'linear-gradient(135deg, #0f172a, #064e3b, #0f4c5c)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          <div className="relative">
            <div className="text-center mb-8">
              <span className="text-[11px] font-bold uppercase tracking-widest text-green-400 block mb-2">
                📞 Reference Poster — Save Our Numbers
              </span>
              <h2 className="text-[22px] sm:text-[32px] font-black leading-tight">
                Vaira Home Care — Always Reachable
              </h2>
              <p className="text-[13px] text-slate-400 leading-relaxed mt-2">
                Save both numbers. Available 24/7 for ambulance, nursing, and home care needs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <a href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`} className="flex items-center gap-3 bg-green-600 hover:bg-green-500 p-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-green-200 font-medium uppercase tracking-wider">Main Line</div>
                  <div className="text-[15px] font-black text-white">{initialBusinessSettings.phone1}</div>
                </div>
              </a>
              <a href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`} className="flex items-center gap-3 bg-teal-600 hover:bg-teal-500 p-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-teal-200 font-medium uppercase tracking-wider">Alternate</div>
                  <div className="text-[15px] font-black text-white">{initialBusinessSettings.phone2}</div>
                </div>
              </a>
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I would like to inquire.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group"
                style={{ background: '#25D366' }}
              >
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-green-200 font-medium uppercase tracking-wider">WhatsApp</div>
                  <div className="text-[15px] font-black text-white">Chat Now</div>
                </div>
              </a>
              <a href="tel:108" className="flex items-center gap-3 bg-red-600 hover:bg-red-500 p-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg group">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Ambulance className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-red-200 font-medium uppercase tracking-wider">Emergency</div>
                  <div className="text-[24px] font-black text-white">108</div>
                </div>
              </a>
            </div>

            <div className="text-center">
              <p className="text-[12px] text-slate-400">
                📍 Coverage: Tambaram · Vandalur · Perungalathur · Urapakkam · Kanchipuram · Vembedu · Oragadam · Sriperumbudur · Walajabad · Chengalpattu
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
