import React from 'react';
import { Waves, Calendar, Users, Award, ShieldCheck, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { TEAM_INFO, UPCOMING_MEETS } from '../data/teamData';

interface HeroSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenSplash: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigateTab,
  onOpenSplash,
}) => {
  const nextMeet = UPCOMING_MEETS[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Container */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white overflow-hidden shadow-2xl border border-neutral-800">
        {/* Background Decorative Ripples */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-neutral-800/40 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:px-12 grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/30 backdrop-blur-md border border-red-500/40 text-xs font-black uppercase tracking-wider text-white">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>Fall/Winter 2026-2027 Registration Open</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none uppercase">
              Peters Township <br />
              <span className="text-red-500 drop-shadow-sm">
                Swim Team
              </span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
              Fostering excellence, athletic progression, sportsmanship, and lifelong friendships at the Peters Township High School Natatorium. From Novice Mini Indians to Elite Senior Competitors!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('groups')}
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Find Your Practice Group</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={onOpenSplash}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-black text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Ask Splash</span>
              </button>
            </div>

            {/* Highlights Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                <span>USA Swim Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>8-Lane PTHS Pool</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Award className="w-4 h-4 text-red-400 shrink-0" />
                <span>WPIAL & PIAA Qualifiers</span>
              </div>
            </div>
          </div>

          {/* Right Card: Next Swim Meet Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white text-neutral-900 border border-neutral-200 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  NEXT UPCOMING MEET
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  {nextMeet.isHome ? '🏠 HOME MEET' : '🚌 AWAY MEET'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight">{nextMeet.title}</h3>
                <p className="text-xs text-neutral-600 font-semibold mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  {nextMeet.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-3.5 rounded-2xl border border-neutral-200 text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] block uppercase font-bold tracking-widest">Meet Date & Time</span>
                  <span className="font-bold text-neutral-900">{nextMeet.date} • {nextMeet.time}</span>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] block uppercase font-bold tracking-widest">Swimmer Warm-Up</span>
                  <span className="font-extrabold text-red-600">{nextMeet.warmupTime}</span>
                </div>
              </div>

              <div className="text-xs text-neutral-900 bg-neutral-50 p-3 rounded-2xl border border-neutral-200 font-semibold">
                <span className="font-extrabold text-red-600 uppercase tracking-wider block text-[10px]">Spirit Theme:</span> {nextMeet.theme}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onNavigateTab('meets')}
                  className="text-xs font-bold text-black hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <span>Full Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigateTab('volunteers')}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                >
                  Volunteers ({nextMeet.jobsOpen} Open)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Swimmers', value: '120+', detail: 'Ages 5 to 18' },
          { label: 'Practice Groups', value: '4 Levels', detail: 'Novice to Senior' },
          { label: 'Volunteer Requirement', value: '3 Shifts', detail: 'Per Family / Season' },
          { label: 'Club Heritage', value: '35+ Yrs', detail: 'Peters Township Tradition' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs font-bold text-neutral-900 mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-[11px] font-semibold text-neutral-500 mt-0.5">
              {stat.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div
          onClick={() => onNavigateTab('groups')}
          className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Users className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
            Practice Groups & Schedules
          </h3>
          <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
            Explore Mini Indians, Bronze, Silver, and Gold group schedules, required gear, and practice times at PTHS Natatorium.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-red-600 mt-4">
            <span>Find Swimmer Group</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('volunteers')}
          className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md font-black">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
            Parent Volunteer Sign-Ups
          </h3>
          <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
            Easily select your 3 mandatory family volunteer shifts: lane timing, concessions, officials, and hospitality setup.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-red-600 mt-4">
            <span>Claim Volunteer Shifts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('registration')}
          className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-red-500 transition-all cursor-pointer group shadow-xs hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-neutral-900 group-hover:text-red-600 transition-colors">
            Tryout & Registration Guide
          </h3>
          <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
            New to PTST? Check tryout dates (Aug 22 & 24), team fees, USA Swimming card registration, and suit fit night.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-red-600 mt-4">
            <span>New Swimmer Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
