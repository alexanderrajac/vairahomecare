'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ServiceItem } from '@/lib/types';
import { Clock, MapPin, ArrowRight, ShieldCheck, ShoppingCart, Star, Zap } from 'lucide-react';
import DirectBookingModal from '@/components/DirectBookingModal';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [showDirectBooking, setShowDirectBooking] = useState(false);

  const categoryColors: Record<string, { bg: string; text: string; border: string; gradFrom: string; gradTo: string }> = {
    nursing:     { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradFrom: 'from-blue-500', gradTo: 'to-indigo-600' },
    elderly:     { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradFrom: 'from-amber-400', gradTo: 'to-orange-500' },
    attender:    { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradFrom: 'from-purple-500', gradTo: 'to-violet-600' },
    specialized: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', gradFrom: 'from-rose-500', gradTo: 'to-pink-600' },
  };

  const categoryLabel: Record<string, string> = {
    nursing:     '💉 Clinical Nursing',
    elderly:     '👴 Senior Care',
    attender:    '🤲 Attender',
    specialized: '⚕️ Specialized',
  };

  const colors = categoryColors[service.category] ?? { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', gradFrom: 'from-slate-500', gradTo: 'to-slate-600' };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 card-lift flex flex-col overflow-hidden relative transition-all duration-300">

      {/* Image */}
      <div className="relative h-[200px] w-full overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

        {/* Category badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl border backdrop-blur-sm bg-white/95 ${colors.text} ${colors.border}`}>
          <ShieldCheck className="w-3 h-3" />
          <span>{categoryLabel[service.category] ?? service.category}</span>
        </div>

        {/* Price Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
          {service.price12h && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-md border shadow-md" style={{ background: 'rgba(15,23,42,0.9)', color: '#6ee7b7', borderColor: 'rgba(52,211,153,0.3)' }}>
              12h: <span className="text-white">₹{service.price12h.toLocaleString()}</span>
            </span>
          )}
          {service.price24h && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl backdrop-blur-md border shadow-md" style={{ background: 'rgba(15,23,42,0.9)', color: '#5eead4', borderColor: 'rgba(20,184,166,0.3)' }}>
              24h: <span className="text-white">₹{service.price24h.toLocaleString()}</span>
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-0.5 bg-amber-400/90 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-xl">
            <Star className="w-2.5 h-2.5 fill-current" /> 5.0
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-green-700 transition-colors duration-200 leading-snug">
          {service.name}
        </h3>
        <p className="mt-2 text-[13px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {service.shortDescription}
        </p>

        {/* Pricing Strip - E-commerce style */}
        <div className="mt-3.5 p-3 rounded-2xl border flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #f8fafc, #f0fdf4)', borderColor: '#dcfce7' }}>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">12-Hour Shift</span>
            <span className="font-black text-slate-900 text-lg">₹{(service.price12h || service.basePrice).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-green-600 block tracking-wider">24-Hour Stay-in</span>
            <span className="font-black text-green-700 text-lg">₹{(service.price24h || service.basePrice).toLocaleString()}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
              <Clock className="w-3 h-3 text-green-600" />
            </div>
            <span className="truncate">{service.availabilityHours}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
              <MapPin className="w-3 h-3 text-green-600" />
            </div>
            <span className="truncate">
              {service.serviceAreas.slice(0, 3).join(', ')}
              {service.serviceAreas.length > 3 ? ` +${service.serviceAreas.length - 3}` : ''}
            </span>
          </div>
        </div>

        {/* CTAs - E-commerce style */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="flex items-center justify-center text-[12px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 px-3 rounded-xl transition-colors duration-200"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => setShowDirectBooking(true)}
            className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-white py-2.5 px-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-green-600/35 active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #16a34a, #0d9488)', boxShadow: '0 4px 12px rgba(22,163,74,0.25)' }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>

      {/* 1-Click Direct eCommerce Checkout Modal */}
      <DirectBookingModal
        service={service}
        isOpen={showDirectBooking}
        onClose={() => setShowDirectBooking(false)}
      />
    </div>
  );
}
