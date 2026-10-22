import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { initialBusinessSettings, initialServices } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-[#0a0f1a] text-slate-300 pt-14 pb-28 md:pb-12 relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Emergency Warning */}
        <div className="bg-red-950/50 border border-red-800/50 rounded-2xl p-5 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4.5 h-4.5 text-red-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-[13px]">Medical Emergency Protocol Notice</h4>
              <p className="text-[12px] text-red-200/70 mt-1 leading-relaxed max-w-xl">
                Vaira Home Care provides supportive bedside nursing and elder care under physician advice. We are not an emergency room. In life-threatening emergencies, immediately dial{' '}
                <strong className="text-white">108</strong>{' '}or proceed to the nearest hospital.
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors active:scale-95"
          >
            Emergency 108
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/6">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Vaira Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[16px] font-black text-white tracking-tight block">VAIRA HOME CARE</span>
                <span className="text-[11px] text-emerald-400 font-semibold tracking-wide">Nursing &amp; Care Agency</span>
              </div>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Trusted, verified, and compassionate home nursing, elderly care, and post-operative recovery across Chennai, Vandalur, Kanchipuram, and Vembedu.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span>100% Background-Vetted Staff</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-green-400 shrink-0" />
                <span>24/7 Caregiver Coordination</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-5">Featured Services</h3>
            <ul className="space-y-2.5">
              {initialServices.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[13px] text-slate-400 hover:text-green-400 transition-colors underline-grow"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 font-semibold text-[12px] mt-1 group"
                >
                  View All Services
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-white font-bold text-[11px] uppercase tracking-widest mb-5">Service Areas</h3>
            <ul className="space-y-2.5">
              {initialBusinessSettings.serviceAreas.map((area) => (
                <li key={area}>
                  <Link
                    href={`/areas/${area.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[13px] text-slate-400 hover:text-green-400 transition-colors"
                  >
                    Home Care in {area}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-green-500/8 border border-green-500/15 rounded-xl text-[12px] text-slate-400">
              <p className="font-semibold text-slate-200 mb-0.5">Doorstep Service</p>
              <p>Staff dispatched directly to residences across Kanchipuram district.</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-[11px] uppercase tracking-widest">Contact Desk</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-[12px] text-slate-400 leading-relaxed mt-1">{initialBusinessSettings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-green-400" />
                </div>
                <a
                  href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                  className="text-[13px] text-slate-300 hover:text-green-400 font-medium transition-colors"
                >
                  {initialBusinessSettings.phone1}
                </a>
              </div>
              {initialBusinessSettings.phone2 && initialBusinessSettings.phone2 !== initialBusinessSettings.phone1 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <a
                    href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`}
                    className="text-[13px] text-slate-300 hover:text-green-400 font-medium transition-colors"
                  >
                    {initialBusinessSettings.phone2}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-900/40 border border-green-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-green-400" />
                </div>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care Team, I would like to book a service.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-green-400 hover:text-green-300 font-semibold transition-colors"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 space-y-4">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-4xl">
            <strong className="text-slate-400">Disclaimer:</strong> Vaira Home Care provides non-invasive home nursing, elderly companionship, and patient attender care coordinated in compliance with prescriptions from registered medical practitioners. We do not independently diagnose conditions, alter pharmacotherapy, or guarantee specific clinical outcomes. A service request is not a confirmed booking until reviewed by our coordination team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/6 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Vaira Home Care Service. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/services" className="hover:text-slate-300 transition-colors">Service Catalog</Link>
              <Link href="/my-bookings" className="hover:text-slate-300 transition-colors">Track Request</Link>
              <Link href="/staff" className="text-green-400 hover:text-green-300 font-semibold transition-colors">Staff Portal</Link>
              <Link href="/admin" className="hover:text-slate-300 transition-colors">Admin CRM</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
