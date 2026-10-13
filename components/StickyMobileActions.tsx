'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, CalendarPlus } from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data';

interface StickyMobileActionsProps {
  serviceSlug?: string;
}

export default function StickyMobileActions({ serviceSlug }: StickyMobileActionsProps) {
  const requestUrl = serviceSlug ? `/book?service=${serviceSlug}` : '/book';
  const whatsappUrl = `https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent(
    serviceSlug
      ? `Hello Vaira Home Care, I would like to request information about ${serviceSlug.replace(/-/g, ' ')}.`
      : 'Hello Vaira Home Care, I would like to inquire about home nursing and caregiver services.'
  )}`;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      {/* Frosted glass bar */}
      <div className="mx-3 mb-2 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/15 px-3 py-2.5">
        <div className="grid grid-cols-3 gap-2 items-center">

          {/* Call */}
          <a
            href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-[10px] transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="tracking-wide">CALL</span>
          </a>

          {/* Request — Primary / Center CTA */}
          <Link
            href={requestUrl}
            className="flex flex-col items-center justify-center gap-1 py-3 px-1 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-[10px] shadow-xl shadow-emerald-600/40 transition-all active:scale-95 -mt-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <span className="tracking-wide">BOOK</span>
          </Link>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl font-bold text-[10px] border border-emerald-200/60 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="tracking-wide">CHAT</span>
          </a>
        </div>
      </div>
    </div>
  );
}
