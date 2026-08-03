import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, ShieldCheck, Clock, AlertCircle, PlusCircle, UserCheck, Sparkles } from 'lucide-react';
import { VolunteerShift } from '../types';
import { INITIAL_VOLUNTEER_SHIFTS, TEAM_INFO } from '../data/teamData';

interface VolunteerSectionProps {
  onOpenSplash: () => void;
}

export const VolunteerSection: React.FC<VolunteerSectionProps> = ({ onOpenSplash }) => {
  const [shifts, setShifts] = useState<VolunteerShift[]>(INITIAL_VOLUNTEER_SHIFTS);
  const [selectedShift, setSelectedShift] = useState<VolunteerShift | null>(null);
  const [parentName, setParentName] = useState('');
  const [swimmerName, setSwimmerName] = useState('');
  const [userFamilyName, setUserFamilyName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch live shifts from server
  const fetchShifts = async () => {
    try {
      const res = await fetch('/api/volunteers');
      const data = await res.json();
      if (data.shifts) {
        setShifts(data.shifts);
      }
    } catch (err) {
      console.error('Failed to load volunteer shifts:', err);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  // Calculate family claimed count based on entered family name
  const familyClaimedShifts = shifts.filter((s) =>
    userFamilyName.trim()
      ? s.claimedBy.some((name) =>
          name.toLowerCase().includes(userFamilyName.trim().toLowerCase())
        )
      : false
  );

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShift || !parentName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/volunteers/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shiftId: selectedShift.id,
          parentName: `${parentName.trim()} (${swimmerName.trim() || 'PTST Parent'})`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(`Success! ${parentName} claimed ${selectedShift.role} for ${selectedShift.meetTitle}.`);
        setSelectedShift(null);
        setParentName('');
        setSwimmerName('');
        fetchShifts();
      } else {
        setFeedback(data.error || 'Failed to claim shift.');
      }
    } catch (err) {
      setFeedback('Error connecting to volunteer service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white shadow-xl border border-neutral-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-400 border border-white/20">
            <Users className="w-3.5 h-3.5" />
            <span>Parent Volunteering Program</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            3 Volunteer Shifts Requirement
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Every successful swim meet relies on parent volunteers! Each PTST family is required to fulfill <strong>3 volunteer shifts per season</strong> (or select the $250 volunteer buyout during registration).
          </p>
        </div>
      </div>

      {/* Family Progress Tracker Card */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Track Your Family's Shift Requirement</h3>
            <p className="text-xs text-neutral-500">Enter your family name below to verify your completed shifts towards your 3 required target.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={userFamilyName}
              onChange={(e) => setUserFamilyName(e.target.value)}
              placeholder="e.g. Miller, Thompson..."
              className="bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {userFamilyName.trim() && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg">
                {familyClaimedShifts.length}
              </div>
              <div>
                <span className="text-xs font-bold text-red-950 block">
                  Family Shifts Claimed: {familyClaimedShifts.length} / 3 Required
                </span>
                <span className="text-[11px] text-red-700">
                  {familyClaimedShifts.length >= 3
                    ? '✅ Family requirement fulfilled! Thank you for supporting PTST!'
                    : `Need ${3 - familyClaimedShifts.length} more shift(s) to reach season goal.`}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (familyClaimedShifts.length / 3) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="font-bold text-emerald-900">Dismiss</button>
        </div>
      )}

      {/* Available Volunteer Shifts Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          <span>Open Volunteer Opportunities for Upcoming Meets</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {shifts.map((shift) => {
            const isFull = shift.filledSpots >= shift.totalSpots;
            return (
              <div
                key={shift.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                      {shift.meetTitle}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isFull
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isFull ? 'FULL' : `${shift.totalSpots - shift.filledSpots} Spots Available`}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{shift.role}</h4>
                  <p className="text-xs text-slate-500 font-medium">{shift.date} • {shift.timeSlot}</p>

                  <div className="pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                    <span className="font-semibold text-slate-700 block mb-1">Claimed By:</span>
                    {shift.claimedBy.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {shift.claimedBy.map((c, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No parents registered yet — be the first!</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600">
                    +{shift.credits} Shift Credit
                  </span>

                  <button
                    disabled={isFull}
                    onClick={() => setSelectedShift(shift)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    {isFull ? 'Shift Filled' : 'Claim Shift'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claim Shift Modal */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Claim Volunteer Shift</h3>
              <button
                onClick={() => setSelectedShift(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <div><strong>Meet:</strong> {selectedShift.meetTitle}</div>
              <div><strong>Role:</strong> {selectedShift.role}</div>
              <div><strong>Time:</strong> {selectedShift.timeSlot}</div>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Sarah Miller"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Swimmer Name (Optional)
                </label>
                <input
                  type="text"
                  value={swimmerName}
                  onChange={(e) => setSwimmerName(e.target.value)}
                  placeholder="e.g. Alex Miller"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedShift(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Confirm Shift'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Descriptions Guide */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
        <h3 className="font-bold text-sm text-cyan-300">Guide to Parent Volunteer Roles</h3>
        <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="space-y-1">
            <strong className="text-white block">⏱️ Lane Timer</strong>
            <p>Operate digital stopwatches in assigned lanes and write split times on swimmer cards. Best role for close-up action!</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">☕ Concession Stand</strong>
            <p>Help serve coffee, hot breakfast, bagels, and snacks in the PTHS lobby to coaches, swimmers, and families.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-white block">🏁 Stroke & Turn Official</strong>
            <p>Certified USA Swimming official observing stroke legality, turns, and finishes. Training clinic provided by USA Swimming.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
