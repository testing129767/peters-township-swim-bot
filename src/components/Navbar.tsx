import React, { useState } from 'react';
import { Waves, Calendar, Users, FileText, ShoppingBag, Trophy, PhoneCall, AlertCircle, Sparkles } from 'lucide-react';
import { TEAM_INFO } from '../data/teamData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSplash: () => void;
  poolStatus: string;
  setPoolStatus: (status: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSplash,
  poolStatus,
  setPoolStatus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Waves },
    { id: 'meets', label: 'Meets & Events', icon: Calendar },
    { id: 'groups', label: 'Practice & Groups', icon: Users },
    { id: 'registration', label: 'Registration & Tryouts', icon: FileText },
    { id: 'volunteers', label: 'Volunteers (3 Shifts)', icon: Users },
    { id: 'gear', label: 'Suit & Gear', icon: ShoppingBag },
    { id: 'records', label: 'Records & Coaches', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black text-white shadow-md border-b border-neutral-800">
      {/* Top Pool Status & Announcement Bar */}
      <div className="bg-neutral-950 text-neutral-200 text-xs py-1.5 px-4 sm:px-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5" />
              LIVE POOL STATUS
            </span>
            <span className="text-neutral-300 font-medium hidden sm:inline">
              {poolStatus}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300 text-[11px]">
            <span className="hidden md:inline">📍 121 Rolling Hills Drive, McMurray, PA 15317</span>
            <button
              onClick={onOpenSplash}
              className="flex items-center gap-1.5 text-red-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Ask Splash Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-white p-2 rounded-full shadow-md group-hover:scale-105 transition-transform">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-black text-white text-xl">
                P
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none uppercase text-white group-hover:text-red-500 transition-colors">
                Peters Township
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mt-0.5">
                Swim and Dive Team • Indians
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTA & Floating Splash Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('volunteers')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-black" />
              <span>Volunteer Portal</span>
            </button>

            <button
              onClick={onOpenSplash}
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-red-500"
            >
              <Sparkles className="w-4 h-4 text-white animate-bounce" />
              <span className="hidden sm:inline">Ask Splash</span>
              <span className="sm:hidden">Splash</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-neutral-800 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-900 border-t border-neutral-800 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  isActive ? 'bg-red-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
