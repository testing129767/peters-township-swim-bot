import React from 'react';
import { Trophy, Mail, Award, Medal, Users, Sparkles } from 'lucide-react';
import { TEAM_RECORDS, COACHES, TEAM_INFO } from '../data/teamData';

interface TeamSpiritSectionProps {
  onOpenSplash: () => void;
}

export const TeamSpiritSection: React.FC<TeamSpiritSectionProps> = ({ onOpenSplash }) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white shadow-xl border border-neutral-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-400 border border-white/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Peters Township Aquatic Excellence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Team Records & Coaching Staff
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Celebrating 35+ years of swimming tradition, sportsmanship, and state championship qualifiers in Peters Township.
          </p>
        </div>
      </div>

      {/* Coaching Staff Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          <span>Meet Our USA Swimming Certified Coaches</span>
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {COACHES.map((coach, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-black text-white font-bold text-2xl flex items-center justify-center shadow-md">
                  {coach.name.charAt(0)}
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{coach.name}</h4>
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wider block">
                    {coach.role}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {coach.bio}
                </p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div><strong>Experience:</strong> {coach.experience}</div>
                  <div><strong>Favorite Event:</strong> {coach.favoriteStroke}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <a
                  href={`mailto:${coach.email}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Contact {coach.name.split(' ')[0]}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Records Board */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              <span>Peters Township All-Time Team Records</span>
            </h3>
            <p className="text-xs text-slate-500">Short Course Yard (SCY) School & Club Benchmarks</p>
          </div>

          <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Updated 2025-2026 Season
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
                <th className="p-3">Event</th>
                <th className="p-3">Age Group</th>
                <th className="p-3">Swimmer</th>
                <th className="p-3">Record Time</th>
                <th className="p-3">Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {TEAM_RECORDS.map((rec, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{rec.event}</td>
                  <td className="p-3">{rec.ageGroup}</td>
                  <td className="p-3 font-semibold text-blue-900">{rec.swimmer}</td>
                  <td className="p-3 font-mono font-bold text-red-600">{rec.time}</td>
                  <td className="p-3 text-slate-500">{rec.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
