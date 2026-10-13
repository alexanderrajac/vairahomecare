import React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import { initialBusinessSettings, initialServices } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-28 md:pb-14 relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Emergency Warning */}
        <div className="bg-rose-950/60 border border-rose-800/60 rounded-2xl p-5 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Medical Emergency Protocol Notice</h4>
              <p className="text-xs text-rose-200/80 mt-1 leading-relaxed max-w-xl">
                Vaira Home Care provides supportive bedside nursing, elder care, and attender coordination under treating physician advice. We are not an emergency room. In life-threatening emergencies, immediately dial{' '}
                <strong className="text-white underline">108</strong>{' '}
                or proceed to the nearest emergency facility.
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="shrink-0 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors active:scale-95 shadow-lg shadow-rose-900/50"
          >
            Emergency 108
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">VAIRA HOME CARE</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trusted, verified, and compassionate home nursing, elderly care, and post-operative recovery across Kanchipuram and Vembedu.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Background-Vetted Staff</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>24/7 Caregiver Coordination</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Featured Services</h3>
            <ul className="space-y-2.5">
              {initialServices.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors underline-grow group flex items-center gap-1"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs mt-1 group"
                >
                  View All Services
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Service Areas</h3>
            <ul className="space-y-2.5">
              {initialBusinessSettings.serviceAreas.map((area) => (
                <li key={area}>
                  <Link
                    href={`/areas/${area.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    Home Care in {area}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 p-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl text-xs text-slate-400">
              <p className="font-semibold text-slate-200 mb-0.5">Doorstep Service</p>
              <p>Staff dispatched directly to residences across Kanchipuram district.</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Contact Desk</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-xs text-slate-400 leading-relaxed mt-1">
                  {initialBusinessSettings.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <a
                  href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
                  className="text-sm text-slate-300 hover:text-emerald-400 font-medium transition-colors"
                >
                  {initialBusinessSettings.phone1}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <a
                  href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`}
                  className="text-sm text-slate-300 hover:text-emerald-400 font-medium transition-colors"
                >
                  {initialBusinessSettings.phone2}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/60 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <a
                  href={`https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent('Hello Vaira Home Care Team, I would like to book a service.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> Vaira Home Care provides non-invasive home nursing, elderly companionship, and patient attender care coordinated in compliance with prescriptions from registered medical practitioners. We do not independently diagnose conditions, alter pharmacotherapy, or guarantee specific clinical outcomes. A service request is not a confirmed booking until reviewed by our coordination team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Vaira Home Care Service. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/services" className="hover:text-slate-300 transition-colors">Service Catalog</Link>
              <Link href="/my-bookings" className="hover:text-slate-300 transition-colors">Track Request</Link>
              <Link href="/staff" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">Staff Duty Portal</Link>
              <Link href="/admin" className="hover:text-slate-300 transition-colors">Coordinator CRM</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
