import React from 'react';
import { ShoppingBag, Calendar, CheckCircle2, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { TEAM_INFO } from '../data/teamData';

interface GearShopSectionProps {
  onOpenSplash: () => void;
}

export const GearShopSection: React.FC<GearShopSectionProps> = ({ onOpenSplash }) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-950 via-black to-red-950 text-white shadow-xl border border-neutral-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-red-400 border border-white/20">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Official Equipment & Team Suit Store</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Team Suit & Equipment Guide
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            Ensure your swimmer has the proper high-durability suit, silicone cap, and practice gear for training sessions and competitive meets.
          </p>
        </div>
      </div>

      {/* Suit Fit Night Alert */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-white/20 uppercase tracking-wider">
            MANDATORY SUIT FIT EVENT
          </span>
          <h3 className="text-xl font-black">Official Suit Fit Night</h3>
          <p className="text-xs text-red-100">
            Thursday, September 3, 2026 at 6:00 PM in the Peters Township High School Main Lobby with Swim360 vendor. Try on suits before ordering!
          </p>
        </div>

        <button
          onClick={onOpenSplash}
          className="px-4 py-2.5 rounded-xl bg-white text-red-700 font-bold text-xs shadow-md hover:bg-slate-100 transition-all cursor-pointer"
        >
          Ask Splash About Suit Sizing
        </button>
      </div>

      {/* Team Suits Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="h-44 rounded-xl bg-slate-900 text-white p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white w-fit">
              OFFICIAL FEMALE COMPETITION SUIT
            </span>
            <div>
              <h4 className="text-lg font-bold">Speedo Endurance+ Female Splice</h4>
              <p className="text-xs text-slate-300">Navy/Red Splice Flyback ($78.00)</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Chlorine-Resistant Endurance+ Fabric</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Includes embroidered PTST Red/White Chest Crest</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="h-44 rounded-xl bg-slate-900 text-white p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white w-fit">
              OFFICIAL MALE COMPETITION JAMMER
            </span>
            <div>
              <h4 className="text-lg font-bold">Speedo Endurance+ Male Jammer</h4>
              <p className="text-xs text-slate-300">Navy/Red Side Splice ($52.00)</p>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Four-way stretch for maximum hip freedom</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PT Logo printed on right thigh</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Spirit Wear Catalog Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">PTST Spirit Wear & Apparel</h3>
        <p className="text-xs text-slate-500">Show your team pride in the stands and deck!</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { item: 'PTST Red Heavyweight Hoodie', price: '$45.00' },
            { item: 'Indians Swimming T-Shirt', price: '$22.00' },
            { item: 'Custom Silicone PT Cap (2-Pack)', price: '$18.00' },
            { item: 'PTST Mesh Gear Backpack', price: '$35.00' },
          ].map((sp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-center">
              <span className="text-xs font-bold text-slate-800 block">{sp.item}</span>
              <span className="text-xs font-extrabold text-red-600 block">{sp.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
