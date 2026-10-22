'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Heart,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useVairaStore } from '@/lib/store';
import { initialBusinessSettings } from '@/lib/data';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/my-bookings';

  const { loginWithGoogle, currentUser, authLoading } = useVairaStore();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomEmail, setShowCustomEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, show quick redirection notice
  if (currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Signed In with Google</h2>
          <p className="text-xs text-slate-500">
            You are signed in as <strong className="text-slate-800">{currentUser.email}</strong>.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push(redirectUrl)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              <span>Continue to Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const emailToUse = showCustomEmail && customEmail.trim() ? customEmail.trim() : undefined;
    const nameToUse = showCustomEmail && customName.trim() ? customName.trim() : undefined;

    const result = await loginWithGoogle(emailToUse, nameToUse);
    setIsSubmitting(false);

    if (result.success) {
      router.push(redirectUrl);
    } else {
      setErrorMsg(result.error || 'Google sign-in could not be completed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-slate-50/60">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-green-600/30 group-hover:scale-105 transition-all">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">VAIRA</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fast &amp; Secure Google Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In with Google
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Access your verified bedside nursing &amp; elder care requests with your Google Account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Google Login Button */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleGoogleSignIn()}
              disabled={isSubmitting || authLoading}
              className="w-full relative flex items-center justify-center gap-3 py-3.5 px-5 bg-white hover:bg-slate-50 active:scale-[0.98] border-2 border-slate-200 hover:border-slate-300 text-slate-800 text-sm font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting || authLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Google Identity highlights */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant passwordless sign-in with your Google profile</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>End-to-end encrypted session &amp; 100% data privacy</span>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>No password creation or verification email required</span>
              </div>
            </div>
          </div>

          {/* Optional specific Google email for development / local testing */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCustomEmail(!showCustomEmail)}
              className="text-[11px] font-semibold text-slate-400 hover:text-emerald-700 transition-colors"
            >
              {showCustomEmail ? '− Hide specific Google account' : '+ Choose specific Google email'}
            </button>

            {showCustomEmail && (
              <form onSubmit={handleGoogleSignIn} className="mt-3 space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Google Email
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Sign in as this Google User
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Assistance hotline */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>Need help with your booking?</p>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <a
              href={`tel:${initialBusinessSettings.phone1.replace(/\s+/g, '')}`}
              className="font-bold text-emerald-700 hover:underline"
            >
              {initialBusinessSettings.phone1}
            </a>
            <span className="text-slate-300">·</span>
            <span>24/7 Care Coordination</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
