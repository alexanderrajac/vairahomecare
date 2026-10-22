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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 10px)' }}
    >
      <div className="mx-3 mb-2 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/20 px-3 py-2.5">
        <div className="grid grid-cols-3 gap-2 items-center">

          {/* Call */}
          <a
            href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
            className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-[10px] transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <span className="tracking-wide uppercase">Call</span>
          </a>

          {/* Book — Primary */}
          <Link
            href={requestUrl}
            className="flex flex-col items-center justify-center gap-1.5 py-3 px-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-[10px] shadow-xl shadow-green-600/35 transition-all active:scale-95 -mt-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <span className="tracking-wide uppercase">Book</span>
          </Link>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl font-semibold text-[10px] border border-green-200 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-xl bg-white border border-green-200 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 text-green-600" />
            </div>
            <span className="tracking-wide uppercase">Chat</span>
          </a>
        </div>
      </div>
    </div>
  );
}
