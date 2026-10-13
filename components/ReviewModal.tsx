'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import { BookingRequest } from '@/lib/types';

interface ReviewModalProps {
  booking: BookingRequest;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string, careFeedback?: string) => void;
}

export default function ReviewModal({ booking, isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [careFeedback, setCareFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError('Please write a short review sharing your experience.');
      return;
    }
    onSubmit(rating, reviewText.trim(), careFeedback.trim() || undefined);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-slate-900">Thank You For Your Feedback!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your honest review helps our caregivers and future families in need of care.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Service Feedback</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">How Was Your Experience?</h3>
              <p className="text-xs text-slate-500">
                Service: <strong>{booking.serviceName}</strong> (ID: {booking.id})
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex flex-col items-center py-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-600 mt-1">
                {rating === 5 && 'Excellent Care'}
                {rating === 4 && 'Very Good'}
                {rating === 3 && 'Average'}
                {rating === 2 && 'Needs Improvement'}
                {rating === 1 && 'Unsatisfactory'}
              </span>
            </div>

            {/* Review text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Public Review Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  setError('');
                }}
                placeholder="Share how our caregiver assisted your family and patient..."
                className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              />
              {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
            </div>

            {/* Private Care feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Private Feedback for Coordination Desk <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={careFeedback}
                onChange={(e) => setCareFeedback(e.target.value)}
                placeholder="Any suggestions for future care shifts or timings?"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
