'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingStepper from '@/components/BookingStepper';
import { ShieldCheck, Phone, AlertTriangle } from 'lucide-react';
import { initialBusinessSettings } from '@/lib/data';

function BookingContent() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get('service') || undefined;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Vaira Care Coordination Desk</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Home Care Service Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Complete the 7 quick steps below to submit your service request. Our coordination team will review availability and contact you promptly.
        </p>
      </div>

      {/* Booking Stepper Wizard */}
      <BookingStepper initialServiceSlug={serviceSlug} />

      {/* Emergency Assistance Callout */}
      <div className="text-center pt-6 text-xs text-slate-500">
        Need immediate assistance or have questions before requesting? Call our desk directly at{' '}
        <a
          href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
          className="font-bold text-emerald-700 hover:underline"
        >
          {initialBusinessSettings.phone1}
        </a>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-500 text-sm">
          Loading booking coordination system...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
