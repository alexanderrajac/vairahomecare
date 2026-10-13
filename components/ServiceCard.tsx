import React from 'react';
import Link from 'next/link';
import { ServiceItem } from '@/lib/types';
import { Clock, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const formatPricing = (model: string, price: number) => {
    if (price === 0) return 'Custom Quote';
    if (model === 'per_shift_24h') return `₹${price.toLocaleString()} / 24h`;
    if (model === 'per_shift_12h') return `₹${price.toLocaleString()} / 12h`;
    if (model === 'hourly') return `₹${price.toLocaleString()} / visit`;
    if (model === 'daily') return `₹${price.toLocaleString()} / day`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-2xl hover:border-emerald-200/80 card-lift flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="capitalize">{service.category}</span>
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg">
            <Sparkles className="w-3 h-3" />
            From {formatPricing(service.pricingModel, service.basePrice)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 leading-snug">
            {service.name}
          </h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>

          {/* Specs */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="truncate">{service.availabilityHours}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="truncate">
                {service.serviceAreas.slice(0, 2).join(', ')}
                {service.serviceAreas.length > 2 && ` +${service.serviceAreas.length - 2} more`}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="flex items-center justify-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 px-3 rounded-xl transition-colors duration-200"
          >
            View Details
          </Link>
          <Link
            href={`/book?service=${service.slug}`}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-2.5 px-3 rounded-xl shadow-sm shadow-emerald-600/25 transition-all duration-200 hover:shadow-emerald-600/40 active:scale-95"
          >
            <span>Request</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
