'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function GlobalErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If the error is a ChunkLoadError (happens during live redeployments when chunk hashes change)
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch')
    ) {
      // Auto-reload once to fetch fresh assets
      const hasReloaded = sessionStorage.getItem('vaira_chunk_reloaded');
      if (!hasReloaded) {
        sessionStorage.setItem('vaira_chunk_reloaded', 'true');
        window.location.reload();
      }
    }
    console.error('Captured client error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-slate-200 space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">Application Notice</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            The page encountered a brief client loading update. Please refresh to load the latest version.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem('vaira_chunk_reloaded');
              window.location.reload();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            onClick={() => sessionStorage.removeItem('vaira_chunk_reloaded')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
