'use client';

import React, { useState } from 'react';
import { StaffMember, BookingRequest } from '@/lib/types';
import { UserCheck, Star, ShieldCheck, MapPin, Clock, X, Check } from 'lucide-react';

interface StaffAssignmentModalProps {
  booking: BookingRequest;
  staffList: StaffMember[];
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffId: string) => void;
}

export default function StaffAssignmentModal({
  booking,
  staffList,
  isOpen,
  onClose,
  onAssign,
}: StaffAssignmentModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string>(booking.assignedStaffId || '');

  if (!isOpen) return null;

  // Smart suggestion scoring based on:
  // 1. Area match (+3)
  // 2. Status AVAILABLE (+4)
  // 3. Skill match with service (+3)
  // 4. Low current workload (+2)
  const scoredStaff = staffList.map((member) => {
    let score = 0;
    const isAreaMatch = member.assignedAreas.some((a) =>
      booking.location.area.toLowerCase().includes(a.toLowerCase())
    );
    if (isAreaMatch) score += 3;

    if (member.status === 'AVAILABLE') score += 4;
    else if (member.status === 'ON_DUTY') score += 1;

    const isSkillMatch = member.verifiedSkills.some((skill) =>
      booking.serviceName.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(booking.serviceName.toLowerCase().slice(0, 8))
    );
    if (isSkillMatch) score += 3;

    if (member.currentAssignedCount === 0) score += 2;

    return {
      member,
      score,
      isAreaMatch,
      isSkillMatch,
    };
  });

  // Sort by suggestion score descending
  scoredStaff.sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span>Assign Staff to Request {booking.id}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Service: <strong>{booking.serviceName}</strong> • Area: <strong>{booking.location.area}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion notice */}
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-900">
          <strong>Decision Support:</strong> Candidates are prioritized by geographic coverage ({booking.location.area}), verified clinical competencies, and availability. Final assignment is authorized manually by the coordinator.
        </div>

        {/* Staff List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {scoredStaff.map(({ member, score, isAreaMatch, isSkillMatch }) => {
            const isSelected = selectedStaffId === member.id;
            const isBestMatch = score >= 9;

            return (
              <div
                key={member.id}
                onClick={() => setSelectedStaffId(member.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                      {member.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{member.name}</span>
                        {isBestMatch && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Best Match
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            member.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{member.role}</p>

                      <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {member.assignedAreas.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {member.shiftAvailability}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {member.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.verifiedSkills.map((skill) => (
                          <span
                            key={skill}
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              booking.serviceName.toLowerCase().includes(skill.toLowerCase())
                                ? 'bg-emerald-200 text-emerald-900 font-bold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedStaffId) {
                onAssign(selectedStaffId);
                onClose();
              }
            }}
            disabled={!selectedStaffId}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Staff Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
