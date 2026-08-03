import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, ShieldCheck, CheckCircle2, UserPlus, HelpCircle, ArrowRight } from 'lucide-react';
import { TEAM_INFO, SWIM_GROUPS } from '../data/teamData';

interface RegistrationSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenSplash: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onNavigateTab,
  onOpenSplash,
}) => {
  const [swimmerName, setSwimmerName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('mini-indians');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white shadow-xl border border-neutral-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-400 border border-white/20">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Peters Township Swim Team</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Registration & Tryouts Guide
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Welcoming all swimmers ages 5–18 to our Fall/Winter 2026-2027 competitive season! Follow the 4 simple onboarding steps below to secure your swimmer's spot.
          </p>
        </div>
      </div>

      {/* 4 Step Roadmap */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            step: '01',
            title: 'New Swimmer Tryouts',
            desc: 'August 22 & 24 at 5:30 PM (PTHS Pool). Evaluation of 25yd Free/Back unassisted.',
            icon: Calendar,
            color: 'border-red-500 bg-red-50/50 text-red-700',
          },
          {
            step: '02',
            title: 'USA Swimming Card',
            desc: 'Complete mandatory USA Swimming annual athlete membership ($85 fee).',
            icon: ShieldCheck,
            color: 'border-neutral-300 bg-neutral-100 text-neutral-900',
          },
          {
            step: '03',
            title: 'PTST Team Registration',
            desc: 'Submit swimmer details, emergency contact form, and season dues.',
            icon: FileText,
            color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700',
          },
          {
            step: '04',
            title: 'Suit Fit & Volunteer Opt-In',
            desc: 'Suit Fit Night on Sept 3 at 6:00 PM. Claim 3 volunteer shifts per family.',
            icon: CheckCircle2,
            color: 'border-amber-500 bg-amber-50/50 text-amber-700',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border-2 ${item.color} shadow-2xs space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black opacity-30">{item.step}</span>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Season Fee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Fall/Winter Season Tuition & Fee Schedule</h3>
            <p className="text-xs text-slate-300">September 8, 2026 – March 15, 2027</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-600 text-white">
            $50 Sibling Discount
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {SWIM_GROUPS.map((g) => (
            <div key={g.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{g.name} ({g.ageRange})</h4>
                <p className="text-slate-500 text-[11px]">{g.schedule.join(' • ')}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block uppercase font-semibold">Monthly Rate</span>
                  <span className="font-bold text-slate-800">${g.monthlyFee}/mo</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block uppercase font-semibold">Full Season</span>
                  <span className="font-extrabold text-red-600 text-sm">${g.seasonFee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <span>* Tuition covers coaching staff, pool rental, Colorado timing systems, and team cap.</span>
          <button
            onClick={onOpenSplash}
            className="text-red-600 font-bold hover:underline cursor-pointer"
          >
            Ask Splash about payment plans
          </button>
        </div>
      </div>

      {/* Direct Tryouts Interest Form */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Tryout Sign-Up Interest Form</span>
          </div>

          <h3 className="text-2xl font-black">Register Swimmer for Aug 22/24 Tryouts</h3>
          <p className="text-xs text-slate-300">
            Fill out your contact details below to receive a tryout evaluation packet and reminders directly from Head Coach Sarah.
          </p>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs space-y-1">
              <div className="font-bold text-sm text-emerald-300">🎉 Tryout Interest Recorded!</div>
              <p>Thank you! We sent confirmation details to {parentEmail}. See you at PTHS Natatorium on August 22 at 5:30 PM!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Swimmer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={swimmerName}
                    onChange={(e) => setSwimmerName(e.target.value)}
                    placeholder="e.g. Leo Thompson"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Parent Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="e.g. parent@example.com"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Target Group Interest
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="mini-indians">Mini Indians / Novice (Ages 5-8)</option>
                  <option value="bronze-group">Bronze Group (Ages 8-10)</option>
                  <option value="silver-group">Silver Group (Ages 10-12)</option>
                  <option value="gold-senior">Gold / Senior Competitive (Ages 13-18)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                Submit Tryout Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
