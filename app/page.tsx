'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  Clock,
  MapPin,
  CalendarCheck,
  Star,
  CheckCircle2,
  BadgeCheck,
  Sparkles,
  Award,
  Users,
  TrendingUp,
  Heart,
  Zap,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import ServiceCard from '@/components/ServiceCard';
import { initialBusinessSettings } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';
import { ServiceCategory } from '@/lib/types';

const TRUST_STATS = [
  { value: '9+', label: 'Years Local Trust', icon: Award },
  { value: '48+', label: 'Vetted Caregivers', icon: Users },
  { value: '24/7', label: 'Care Coordination', icon: Zap },
  { value: '100%', label: 'Background-Checked', icon: ShieldCheck },
];

const PROCESS_STEPS = [
  { step: '01', icon: Heart, title: 'Discover', desc: 'Browse verified nursing and elder care options tailored for you.' },
  { step: '02', icon: ShieldCheck, title: 'Understand', desc: 'Review exact inclusions, exclusions, and transparent pricing.' },
  { step: '03', icon: MapPin, title: 'Request', desc: 'Provide patient context, residence area, and preferred shifts.' },
  { step: '04', icon: CheckCircle2, title: 'Review', desc: 'Our desk verifies doctor notes and roster availability.' },
  { step: '05', icon: BadgeCheck, title: 'Confirm', desc: 'Staff is officially allocated and your family is notified.' },
  { step: '06', icon: Star, title: 'Feedback', desc: 'Share a verified review after your care is fulfilled.' },
];

export default function HomePage() {
  const { publishedServices, reviews } = useVairaStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? publishedServices
      : publishedServices.filter((s) => s.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All Services' },
    { key: 'nursing', label: 'Nursing' },
    { key: 'elderly', label: 'Senior Care' },
    { key: 'attender', label: 'Attenders' },
    { key: 'specialized', label: 'Specialized' },
  ];

  return (
    <div className="space-y-0 pb-24 md:pb-16">

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative hero-gradient overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div className="lg:col-span-7 space-y-6 animate-slide-up">

              {/* Trust pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/60 shadow-sm text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Home Healthcare · Kanchipuram & Vembedu</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
                Dignified,{' '}
                <span className="relative">
                  <span className="gradient-text">Professional</span>
                </span>
                <br className="hidden sm:block" />
                {' '}Home Nursing
                <br />
                <span className="text-slate-600 font-medium text-2xl sm:text-3xl lg:text-4xl mt-2 block">
                  & Elder Care
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Rest easy knowing your loved ones are cared for by background-verified nurses and compassionate caregivers at home — coordinated under physician guidance.
              </p>

              {/* Coverage chip */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Coverage:</span>
                </div>
                {initialBusinessSettings.serviceAreas.map((area, idx) => (
                  <span key={area} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                    {area}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/book"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-600/35 hover:shadow-emerald-600/50 hover:scale-[1.03] transition-all duration-200"
                >
                  <CalendarCheck className="w-5 h-5" />
                  Request Service Online
                </Link>

                <a
                  href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call: {initialBusinessSettings.phone1}</span>
                </a>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I would like to inquire about home nursing and caregiver services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-900 font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  WhatsApp
                </a>
              </div>

              {/* Stats row */}
              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-4 gap-4">
                {TRUST_STATS.map((stat) => (
                  <div key={stat.value} className="text-center sm:text-left">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero Card */}
            <div className="lg:col-span-5 animate-slide-left delay-200">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Main card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/80 bg-white animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
                    alt="Vaira Home Care nurse providing compassionate bedside care"
                    className="w-full h-[320px] sm:h-[380px] object-cover"
                  />
                  <div className="p-4 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 px-3 py-1.5 rounded-lg">
                        Doctor-Prescribed Care
                      </span>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Kanchipuram & Vembedu
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      "Gentle, respectful assistance that maintains dignity for your elderly parents and recovery patients."
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -left-5 sm:-bottom-6 sm:-left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-pulse-glow">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">Verified Credentials</div>
                    <div className="text-slate-500">GNM, B.Sc & Care Assistants</div>
                  </div>
                </div>

                {/* Top-right floating rating */}
                <div className="absolute -top-4 -right-4 bg-white px-3 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE SOCIAL PROOF ───────────────────────────── */}
      <div className="overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 py-3">
        <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
          {[
            '✦ Verified Staff Only', '✦ Doctor-Prescribed Care', '✦ 24/7 Support Desk',
            '✦ No Hidden Fees', '✦ Background Checked', '✦ Kanchipuram & Vembedu',
            '✦ Verified Staff Only', '✦ Doctor-Prescribed Care', '✦ 24/7 Support Desk',
            '✦ No Hidden Fees', '✦ Background Checked', '✦ Kanchipuram & Vembedu',
          ].map((text, i) => (
            <span key={i} className="text-white/90 text-xs font-bold tracking-widest uppercase shrink-0">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 tracking-widest uppercase bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Healthcare Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Our Home Healthcare Offerings
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Select a service to review clinical scope, inclusions, transparent pricing, and submit a request.
          </p>

          {/* Category Filter */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
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
            className="inline-flex items-center gap-2 font-bold text-sm text-emerald-700 hover:text-white bg-emerald-50 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 border border-emerald-200 hover:border-transparent px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-emerald-600/25 group"
          >
            <span>Explore All Services & Pricing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="relative bg-slate-900 text-white py-16 sm:py-24 overflow-hidden">
        {/* BG decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 tracking-widest uppercase">
              <TrendingUp className="w-3.5 h-3.5" />
              The Transparent Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How Vaira Service Booking Works
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Clear distinction between service request and clinical confirmation — never any uncertainty.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROCESS_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="relative group bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/8 hover:border-emerald-500/30 p-5 rounded-2xl transition-all duration-300 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 tracking-wider">{s.step}</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{s.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                  {/* Step connector dot */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gradient-to-r from-emerald-500/40 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-4 sm:p-5 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl max-w-2xl mx-auto text-center">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white">Important: </strong>
              Submitting a request notifies our desk immediately. A booking is formally confirmed after staff capacity and physician orders are verified.
            </p>
          </div>
        </div>
      </section>

      {/* ── TRUST + REVIEWS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left — Trust pillars */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 tracking-widest uppercase bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Trust & Transparency
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 leading-tight">
                Verified Care You Can Rely On
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mt-3">
                We understand the vulnerability of bringing a caregiver into your home. Vaira operates under strict administrative and clinical safety guidelines.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: '100% In-Person Vetted Staff',
                  desc: 'Government ID, nursing credentials, and local address verification for every caregiver.',
                },
                {
                  title: 'Doctor Prescription Adherence',
                  desc: 'Nurses follow attending physician charts with documented vitals — no independent diagnoses.',
                },
                {
                  title: 'No Hidden Fees or Surcharges',
                  desc: 'Transparent shift pricing with upfront confirmation before caregiver arrival.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg group"
            >
              <span>Request a Coordinator Callback</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right — Reviews */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-black text-slate-900 text-lg">Verified Customer Feedback</h3>
              <span className="text-xs text-slate-400 font-medium">Authentic Family Testimonials</span>
            </div>

            <div className="space-y-4">
              {reviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                      {rev.serviceName}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed line-clamp-3">
                    "{rev.reviewText}"
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
                    <span className="font-bold text-slate-800">{rev.customerName}</span>
                    <span>{formatDate(rev.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
          {/* Decorative */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Need Assistance Choosing Care?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Speak Directly with Our Care Coordinator
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Our experienced desk staff will guide you through caregiver shifts, requirements, and home preparation in Kanchipuram and Vembedu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Call {initialBusinessSettings.phone1}
              </a>
              <a
                href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care, I would like to speak with a care coordinator.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
