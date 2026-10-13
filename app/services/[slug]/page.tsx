'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Phone,
  MessageSquare,
  HelpCircle,
  Star,
  ArrowRight,
  CreditCard,
  FileCheck2,
  UserCheck,
  Sparkles,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { initialBusinessSettings } from '@/lib/data';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { publishedServices, reviews } = useVairaStore();

  const service = publishedServices.find((s) => s.slug === slug);

  // Quick duration calculator state
  const [calcDuration, setCalcDuration] = useState<number>(7);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
          ?
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800">Service Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The requested home care service may have been updated or is currently not active in our catalog.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-all"
        >
          <span>Explore All Active Services</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Filter reviews matching this service or general
  const serviceReviews = reviews
    .filter(
      (r) => r.serviceName.toLowerCase().includes(service.name.toLowerCase()) || r.rating === 5
    )
    .slice(0, 2);

  const formatPricing = (model: string, price: number) => {
    if (price === 0) return 'Custom Quote based on assessment';
    if (model === 'per_shift_24h') return `₹${price.toLocaleString()} per 24-Hour Shift`;
    if (model === 'per_shift_12h') return `₹${price.toLocaleString()} per 12-Hour Shift`;
    if (model === 'hourly') return `₹${price.toLocaleString()} per Scheduled Home Visit`;
    if (model === 'daily') return `₹${price.toLocaleString()} per Day`;
    return `Starting at ₹${price.toLocaleString()}`;
  };

  const calculatedEstimate = service.basePrice > 0 ? service.basePrice * calcDuration : null;

  return (
    <div className="space-y-12 pb-24 md:pb-16 bg-slate-50/50">
      {/* Top Breadcrumb & Hero */}
      <section className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-8 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-emerald-300/80 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50 shrink-0" />
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50 shrink-0" />
            <span className="text-white font-bold">{service.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Clinical Protocol</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>{service.availabilityHours}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {service.name}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {service.shortDescription}
              </p>

              {/* Fast Specifications Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <span className="text-slate-400 block font-semibold text-[11px]">Availability</span>
                  <strong className="text-white mt-0.5 block text-xs sm:text-sm">{service.availabilityHours}</strong>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <span className="text-slate-400 block font-semibold text-[11px]">Min Duration</span>
                  <strong className="text-white mt-0.5 block text-xs sm:text-sm">{service.minimumDuration}</strong>
                </div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-semibold text-[11px]">Base Rate</span>
                  <strong className="text-emerald-400 mt-0.5 block text-xs sm:text-sm font-black">
                    {service.basePrice > 0 ? `₹${service.basePrice.toLocaleString()}` : 'Assessed'}
                  </strong>
                </div>
              </div>

              {/* Primary Call to Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link
                  href={`/book?service=${service.slug}`}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>REQUEST THIS SERVICE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-4 py-3.5 rounded-2xl transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Desk</span>
                </a>

                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent(
                    `Hello Vaira Home Care, I would like to inquire about ${service.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 font-bold text-xs sm:text-sm px-4 py-3.5 rounded-2xl transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Service Banner Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-[280px] sm:h-[360px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-white">Active Dispatch Available</span>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-medium">Kanchipuram &amp; Vembedu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Quick Rate Estimator Box */}
        {service.basePrice > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Quick Estimate Calculator</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Select your expected care duration:
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block font-medium">Estimated Investment</span>
                <span className="text-2xl font-black text-emerald-700">
                  ₹{calculatedEstimate?.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block">for {calcDuration} days</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { days: 3, label: '3 Days', desc: 'Short-term recovery' },
                { days: 7, label: '7 Days', desc: 'Post-op standard' },
                { days: 14, label: '14 Days', desc: 'Rehab routine' },
                { days: 30, label: '30 Days', desc: 'Monthly elder care' },
              ].map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setCalcDuration(opt.days)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    calcDuration === opt.days
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="block font-black text-sm text-slate-900">{opt.label}</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{opt.desc}</span>
                  <span className="block text-xs font-bold text-emerald-700 mt-1">
                    ₹{(service.basePrice * opt.days).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Charges are indicative. Final fees depend on shift timing (12h vs 24h), specific clinical supplies, and locality distance.
            </p>
          </div>
        )}

        {/* WHO THIS SERVICE IS FOR & WHAT CUSTOMER SHOULD PROVIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* WHO THIS SERVICE IS FOR */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Who This Service Is For</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear scenarios without requiring complex diagnostic jargon:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {service.whoThisIsFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-2 shrink-0 ring-4 ring-emerald-100" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WHAT CUSTOMER SHOULD PROVIDE */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-teal-600" />
              <span>What Customer Should Provide</span>
            </h2>
            <p className="text-xs text-slate-500">
              Information required strictly for caregiver dispatch &amp; safety:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {service.requiredInformation.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0 ring-4 ring-teal-100" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              🛡️ Note: Medical histories are shared strictly with assigned certified nursing staff for safety.
            </div>
          </div>
        </div>

        {/* INCLUSIONS & EXCLUSIONS SIDE BY SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* WHAT THE SERVICE MAY INCLUDE */}
          <div className="bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>What The Service Includes</span>
            </h2>
            <p className="text-xs text-emerald-800">
              Care routines performed strictly following attending doctor instructions:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-800">
              {service.whatIncluded.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WHAT IS NOT INCLUDED */}
          <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-black text-rose-950 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>What Is NOT Included</span>
            </h2>
            <p className="text-xs text-rose-800">
              Safety limitations strictly observed by Vaira Home Care staff:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-800">
              {service.whatNotIncluded.map((exc, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SERVICE AVAILABILITY & PRICING TRANSPARENCY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Service Availability */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Availability &amp; Local Coverage</span>
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Shift Timings:</span>
                <span className="font-bold text-slate-800">{service.availabilityHours}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Operating Days:</span>
                <span className="font-bold text-slate-800">{service.availableDays}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Minimum Period:</span>
                <span className="font-bold text-slate-800">{service.minimumDuration}</span>
              </div>
              <div className="py-2">
                <span className="text-slate-500 font-medium block mb-2">Covered Localities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {service.serviceAreas.map((a) => (
                    <span
                      key={a}
                      className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-xl font-bold border border-emerald-100"
                    >
                      📍 {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Model & Legal Notice */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Transparent Rate Structure
                </span>
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {formatPricing(service.pricingModel, service.basePrice)}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {service.additionalChargesNotice}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl text-[11px] text-emerald-200 space-y-1 border border-white/10">
              <strong className="block text-white">Notice of Final Confirmation:</strong>
              <p>
                "Final service availability and charges are confirmed transparently by our coordination desk before dispatch."
              </p>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        {service.faqs.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRUST SECTION & RECENT REVIEWS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">Local Heritage</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">Trust &amp; Staff Verification Guidelines</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Kanchipuram &amp; Vembedu Direct Network
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 font-bold block text-sm">9+ Years Service</strong>
              <p>Serving thousands of local families with dignified bedside support.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 font-bold block text-sm">Background Vetted</strong>
              <p>Physical ID check, police record screening, and healthcare credential audit.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <strong className="text-slate-900 font-bold block text-sm">Zero Upfront Advance Scam</strong>
              <p>Clear, direct invoicing after coordination. No undisclosed fee surprises.</p>
            </div>
          </div>

          {/* Testimonials */}
          {serviceReviews.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                Recent Family Feedback
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic">"{rev.reviewText}"</p>
                    <span className="text-[11px] font-bold text-slate-800 block">- {rev.customerName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM PRIMARY CTA BAR */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">Ready to request {service.name}?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              Submit your preferred schedule and location. Our care coordination desk reviews and responds quickly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href={`/book?service=${service.slug}`}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              REQUEST THIS SERVICE
            </Link>
            <a
              href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
              className="bg-black/30 hover:bg-black/40 border border-white/20 text-white font-bold text-xs sm:text-sm px-4 py-3.5 rounded-2xl transition-all"
            >
              CALL NOW
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
