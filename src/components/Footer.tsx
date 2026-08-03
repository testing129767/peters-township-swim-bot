import React from 'react';
import { Waves, Mail, Phone, MapPin, Calendar, Sparkles } from 'lucide-react';
import { TEAM_INFO } from '../data/teamData';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenSplash: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenSplash }) => {
  return (
    <footer className="bg-black text-neutral-300 pt-12 pb-8 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full shadow-md">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center font-black text-white text-sm">
                  P
                </div>
              </div>
              <div>
                <h4 className="font-black text-base text-white uppercase tracking-tight">
                  Peters Township
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
                  Swim and Dive Team • Indians
                </p>
              </div>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed font-medium">
              Home of the PT Indians! Fostering athletic excellence, team sportsmanship, and swimming skill progression in Peters Township, PA.
            </p>
            <button
              onClick={onOpenSplash}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Ask Splash Assistant</span>
            </button>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <span className="font-bold text-red-500 uppercase text-[10px] tracking-widest block">
              Quick Navigation
            </span>
            <ul className="space-y-1.5 text-neutral-400 font-semibold text-xs">
              <li><button onClick={() => onNavigateTab('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
              <li><button onClick={() => onNavigateTab('meets')} className="hover:text-white transition-colors cursor-pointer">Meets & Events</button></li>
              <li><button onClick={() => onNavigateTab('groups')} className="hover:text-white transition-colors cursor-pointer">Practice Schedules</button></li>
              <li><button onClick={() => onNavigateTab('registration')} className="hover:text-white transition-colors cursor-pointer">Registration & Tryouts</button></li>
              <li><button onClick={() => onNavigateTab('volunteers')} className="hover:text-white transition-colors cursor-pointer">Volunteer Sign-Ups</button></li>
              <li><button onClick={() => onNavigateTab('gear')} className="hover:text-white transition-colors cursor-pointer">Suit & Equipment Guide</button></li>
            </ul>
          </div>

          {/* Col 3: Pool Location & Weather */}
          <div className="space-y-2">
            <span className="font-bold text-red-500 uppercase text-[10px] tracking-widest block">
              Natatorium & Weather
            </span>
            <p className="flex items-start gap-2 text-neutral-300 font-medium">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{TEAM_INFO.homePool.name}<br />{TEAM_INFO.homePool.address}</span>
            </p>
            <p className="text-neutral-400 text-[11px] pt-1">
              <strong className="text-white">Weather Protocol:</strong> Practices follow Peters Township School District cancellations. Alerts sent by 3:00 PM.
            </p>
          </div>

          {/* Col 4: Key Contacts */}
          <div className="space-y-2">
            <span className="font-bold text-red-500 uppercase text-[10px] tracking-widest block">
              Team Contacts
            </span>
            <div className="space-y-1.5 text-neutral-300">
              <div>
                <strong className="text-white block">Alex Hardwick (Head Coach):</strong>
                <a href={`mailto:${TEAM_INFO.contacts.headCoach}`} className="text-red-400 hover:underline font-semibold">{TEAM_INFO.contacts.headCoach}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between text-neutral-400 text-[11px] gap-2 font-medium">
          <span>© {new Date().getFullYear()} Peters Township Swim and Dive Team. All rights reserved.</span>
          <span className="text-red-500 font-bold uppercase tracking-wider">Peters Township Middle School and High School Pool • Go PT Indians! 🔴⚪🔴</span>
        </div>
      </div>
    </footer>
  );
};
