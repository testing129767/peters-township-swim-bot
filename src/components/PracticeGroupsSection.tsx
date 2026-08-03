import React, { useState } from 'react';
import { Users, Clock, CheckCircle2, ShieldAlert, Sparkles, ShoppingBag, HelpCircle, ArrowRight } from 'lucide-react';
import { SWIM_GROUPS, TEAM_INFO } from '../data/teamData';

interface PracticeGroupsSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenSplash: () => void;
}

export const PracticeGroupsSection: React.FC<PracticeGroupsSectionProps> = ({
  onNavigateTab,
  onOpenSplash,
}) => {
  // Quiz State
  const [swimmerAge, setSwimmerAge] = useState<number>(8);
  const [experience, setExperience] = useState<string>('basic');
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const handleQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (swimmerAge <= 8 && experience === 'basic') {
      setQuizResult('mini-indians');
    } else if (swimmerAge <= 10 && (experience === 'basic' || experience === 'intermediate')) {
      setQuizResult('bronze-group');
    } else if (swimmerAge <= 12 && (experience === 'intermediate' || experience === 'advanced')) {
      setQuizResult('silver-group');
    } else {
      setQuizResult('gold-senior');
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white shadow-xl border border-neutral-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-400 border border-white/20">
            <Users className="w-3.5 h-3.5" />
            <span>Structured Swimmer Progression</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Practice Groups & Schedules
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Our swim program is designed to build technical mastery, stroke efficiency, aerobic endurance, and team spirit across 4 tailored age and skill levels. All practices take place at the Peters Township High School Natatorium.
          </p>
        </div>
      </div>

      {/* Swimmer Placement Finder Tool */}
      <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 border border-red-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-2">
          <Sparkles className="w-4 h-4 text-red-600" />
          <span>SWIMMER GROUP FINDER QUIZ</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Not sure which group fits your swimmer?
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Select your swimmer's age and experience level to view our recommended placement!
        </p>

        <form onSubmit={handleQuiz} className="grid md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Swimmer Age
            </label>
            <input
              type="number"
              min={5}
              max={18}
              value={swimmerAge}
              onChange={(e) => setSwimmerAge(parseInt(e.target.value) || 8)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Stroke Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
            >
              <option value="basic">Can swim 25yd Free/Back unassisted</option>
              <option value="intermediate">Knows Free, Back, and basic Breaststroke</option>
              <option value="advanced">Proficient in all 4 strokes + flip turns</option>
              <option value="elite">USA Swimming / Senior Competitive swimmer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            Find Recommended Group
          </button>
        </form>

        {quizResult && (
          <div className="mt-4 p-4 rounded-xl bg-white border border-red-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Recommended Group Placement:</span>
              <h4 className="text-base font-extrabold text-slate-900">
                {SWIM_GROUPS.find((g) => g.id === quizResult)?.name}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {SWIM_GROUPS.find((g) => g.id === quizResult)?.prerequisites}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('registration')}
              className="px-3.5 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Groups Detail Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {SWIM_GROUPS.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Group Header */}
            <div className={`p-5 bg-gradient-to-r ${group.color} text-white space-y-1`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  {group.ageRange}
                </span>
                <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded">
                  {group.level} Level
                </span>
              </div>
              <h3 className="text-xl font-black">{group.name}</h3>
              <p className="text-xs text-white/90 leading-relaxed">{group.description}</p>
            </div>

            {/* Schedule & Gear Body */}
            <div className="p-5 space-y-4 text-xs text-slate-700 flex-1">
              <div>
                <span className="font-bold text-slate-900 uppercase text-[10px] text-slate-400 block mb-1">
                  Weekly Practice Schedule
                </span>
                <ul className="space-y-1">
                  {group.schedule.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2 font-medium text-neutral-800">
                      <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold uppercase text-[10px] text-neutral-400 block mb-1">
                  Required Gear & Equipment
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.requiredGear.map((item, gIdx) => (
                    <span
                      key={gIdx}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 font-medium text-[11px] border border-neutral-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-600">
                <strong className="text-neutral-900">Prerequisites:</strong> {group.prerequisites}
              </div>
            </div>

            {/* Fees & CTA Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 text-[10px] uppercase font-bold block">Season Registration Fee</span>
                <span className="text-base font-extrabold text-neutral-900">${group.seasonFee}</span>
                <span className="text-neutral-500 text-[11px]"> / season (${group.monthlyFee}/mo)</span>
              </div>

              <button
                onClick={() => onNavigateTab('gear')}
                className="px-3.5 py-2 rounded-xl bg-black text-white font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-red-500" />
                <span>Gear Guide</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pool Rules & Safety Protocols */}
      <div className="p-6 rounded-2xl bg-black text-white border border-neutral-800 space-y-3">
        <h3 className="font-bold text-sm text-red-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          Peters Township High School Pool Rules & Arrival Etiquette
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-300">
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Swimmers must be on the pool deck changed and ready 5 minutes prior to practice start.</li>
            <li>No street shoes allowed on the competition pool deck. Parents must view from the upper balcony.</li>
            <li>Swimmers must bring a full water bottle to every practice session.</li>
          </ul>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Attendance is tracked daily by group lead coaches.</li>
            <li>If missing practice due to illness or academic obligation, please notify coach via email.</li>
            <li>Always follow lifeguard instructions at all times.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
