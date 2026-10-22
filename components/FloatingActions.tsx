'use client';

import React, { useState } from 'react';
import { MessageSquare, Ambulance, Phone, X, ChevronUp } from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data';

export default function FloatingActions() {
  const [open, setOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${initialBusinessSettings.whatsapp}?text=${encodeURIComponent(
    'Hello Vaira Home Care, I would like to inquire about home nursing and caregiver services.'
  )}`;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 z-50 flex flex-col items-end gap-3">
      {/* Expanded Action Menu */}
      {open && (
        <div className="flex flex-col items-end gap-2 animate-slide-up">
          {/* Ambulance 24/7 */}
          <a
            href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
            className="flex items-center gap-2.5 shadow-xl rounded-2xl overflow-hidden group hover:scale-[1.04] transition-all duration-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #dc2626, #be123c)' }}
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Ambulance className="w-5 h-5 text-white" />
            </div>
            <div className="pr-4">
              <div className="text-[9px] font-bold text-red-200 uppercase tracking-wider">FREE 24/7 Ambulance</div>
              <div className="text-[13px] font-black text-white">{initialBusinessSettings.phone1}</div>
            </div>
          </a>

          {/* Alternate Phone */}
          <a
            href={`tel:${initialBusinessSettings.phone2.replace(/\s+/g, '')}`}
            className="flex items-center gap-2.5 shadow-xl rounded-2xl overflow-hidden hover:scale-[1.04] transition-all duration-200 active:scale-95 border border-white/20"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div className="pr-4">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Alternate Line</div>
              <div className="text-[13px] font-black text-white">{initialBusinessSettings.phone2}</div>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 shadow-xl rounded-2xl overflow-hidden hover:scale-[1.04] transition-all duration-200 active:scale-95"
            style={{ background: '#25D366' }}
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="pr-4">
              <div className="text-[9px] font-bold text-green-100 uppercase tracking-wider">WhatsApp Chat</div>
              <div className="text-[13px] font-black text-white">Chat with Us</div>
            </div>
          </a>
        </div>
      )}

      {/* Floating WhatsApp Button (always visible) */}
      <div className="flex items-center gap-2">
        {/* Ambulance button always visible */}
        <a
          href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
          className="hidden md:flex w-12 h-12 rounded-2xl items-center justify-center shadow-xl hover:scale-110 transition-all duration-200 active:scale-95 relative"
          style={{ background: 'linear-gradient(135deg, #dc2626, #be123c)', boxShadow: '0 8px 24px rgba(220,38,38,0.5)' }}
          title="FREE 24/7 Ambulance"
        >
          <Ambulance className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-red-600 animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white border-2 border-red-600" />
        </a>

        {/* Toggle button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95 relative"
          style={{
            background: open ? '#ef4444' : '#25D366',
            boxShadow: open ? '0 8px 32px rgba(239,68,68,0.5)' : '0 8px 32px rgba(37,211,102,0.5)',
          }}
          aria-label={open ? 'Close contact menu' : 'Open WhatsApp / Ambulance contact'}
        >
          {open ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                <span className="text-[7px] text-white font-black">!</span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* 24/7 label under the button */}
      {!open && (
        <div className="text-center">
          <span className="text-[9px] font-black text-white uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: '#25D366', boxShadow: '0 2px 8px rgba(37,211,102,0.4)' }}>
            24/7 Chat
          </span>
        </div>
      )}
    </div>
  );
}
