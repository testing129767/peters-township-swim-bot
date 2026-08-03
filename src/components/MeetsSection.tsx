import React, { useState } from 'react';
import { Calendar, MapPin, Clock, FileText, ExternalLink, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UPCOMING_MEETS, TEAM_INFO } from '../data/teamData';

interface MeetsSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenSplash: () => void;
}

export const MeetsSection: React.FC<MeetsSectionProps> = ({
  onNavigateTab,
  onOpenSplash,
}) => {
  const [filter, setFilter] = useState<'all' | 'home' | 'away'>('all');

  const filteredMeets = UPCOMING_MEETS.filter((m) => {
    if (filter === 'home') return m.isHome;
    if (filter === 'away') return !m.isHome;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white shadow-xl border border-neutral-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-400 border border-white/20">
            <Calendar className="w-3.5 h-3.5" />
            <span>2026-2027 Competitive Season Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Meet Schedule & Spectator Guides
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            All home meets are hosted at the Peters Township High School Natatorium. Please arrive 15 minutes before listed swimmer warm-up times. Heat sheets are uploaded 24 hours prior to meet start.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Volunteer Alert */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Meets' },
            { id: 'home', label: '🏠 Home Meets' },
            { id: 'away', label: '🚌 Away Meets' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateTab('volunteers')}
          className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Claim Parent Volunteer Jobs</span>
          <ArrowRight className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>

      {/* Meets Grid */}
      <div className="grid gap-6">
        {filteredMeets.map((meet) => (
          <div
            key={meet.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow grid lg:grid-cols-12 gap-6 items-center"
          >
            {/* Left Column: Date & Badge */}
            <div className="lg:col-span-3 space-y-2 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    meet.isHome
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-black text-white border border-neutral-800'
                  }`}
                >
                  {meet.isHome ? '🏠 Home Meet' : '🚌 Away Meet'}
                </span>
              </div>

              <div className="text-xl font-black text-slate-900 leading-tight">
                {meet.date}
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Start: <strong className="text-slate-800">{meet.time}</strong></span>
              </div>
            </div>

            {/* Middle Column: Details & Theme */}
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {meet.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>Location:</strong> {meet.location} ({meet.address})</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Warm-Up:</strong> <span className="text-amber-700 font-bold">{meet.warmupTime}</span></span>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                  <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
                  <span><strong>Theme:</strong> {meet.theme}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 italic bg-neutral-100 p-2 rounded-lg border border-neutral-200">
                <strong>Spectators:</strong> {meet.spectatorPolicy}
              </p>
            </div>

            {/* Right Column: Heat Sheet & Jobs Actions */}
            <div className="lg:col-span-3 flex flex-col gap-2 justify-center lg:items-end">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(meet.address)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <button
                onClick={() => onNavigateTab('volunteers')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Volunteer ({meet.jobsOpen} Jobs Open)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenSplash}
                className="w-full sm:w-auto text-[11px] font-bold text-red-600 hover:text-red-800 underline text-center cursor-pointer"
              >
                Ask Splash about arrival rules
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Spectator Rules Note */}
      <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          General Swim Meet Protocols for Parents & Swimmers
        </h3>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
          <li><strong>Check-in:</strong> Swimmers must report to their assigned group coach at least 15 minutes prior to warm-ups.</li>
          <li><strong>Caps & Goggles:</strong> Swimmers must wear official PTST silicone caps and non-fogging race goggles on the starting blocks.</li>
          <li><strong>Spectator Balcony:</strong> Seating at PTHS Natatorium is available in the elevated balcony. Deck access is strictly restricted to coaches, certified officials, timers, and clerks.</li>
          <li><strong>Live Results:</strong> Download the Meet Mobile app and search "Peters Township" to view real-time lane assignments and split times!</li>
        </ul>
      </div>
    </div>
  );
};
