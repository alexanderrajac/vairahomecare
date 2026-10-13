import React from 'react';
import { BookingStatus } from '@/lib/types';
import { Check, Clock, AlertCircle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: BookingStatus;
}

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const steps: { key: BookingStatus; label: string; desc: string }[] = [
    { key: 'REQUEST_RECEIVED', label: 'Request Received', desc: 'Logged into coordination queue' },
    { key: 'UNDER_REVIEW', label: 'Under Review', desc: 'Coordinator reviewing requirements' },
    { key: 'CONTACTED', label: 'Contacted', desc: 'Family spoke with care manager' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Staff allocated & schedule locked' },
    { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Caregiver active at residence' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Care successfully fulfilled' },
  ];

  if (currentStatus === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3 text-rose-800">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div>
          <div className="font-bold text-sm">Request Cancelled</div>
          <div className="text-xs text-rose-700 mt-0.5">
            This service request has been cancelled in accordance with our cancellation policy.
          </div>
        </div>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute left-6 top-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
          style={{ width: `${Math.max(0, (currentIdx / (steps.length - 1)) * 90)}%` }}
        />

        {steps.map((step, idx) => {
          const isPassed = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 w-24">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-md'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-[11px] font-bold text-center leading-tight ${
                  isCurrent ? 'text-emerald-800' : isPassed ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="sm:hidden space-y-3">
        {steps.map((step, idx) => {
          const isPassed = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <div>
                <p
                  className={`text-xs font-bold ${
                    isCurrent ? 'text-emerald-800' : isPassed ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.label} {isCurrent && '(Current Status)'}
                </p>
                <p className="text-[11px] text-slate-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
