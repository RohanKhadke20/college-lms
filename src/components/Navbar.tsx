'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Bell, 
  Menu, 
  X, 
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenAiSummary?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab = 'Dashboard', 
  onTabChange,
  onOpenAiSummary
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, badge: null },
    { name: 'Class Notes', href: '/notes', icon: BookOpen, badge: '24 New' },
    { name: 'AI Study Assistant', href: '/#ai-assistant', icon: Sparkles, badge: 'GPT-4o', highlight: true },
    { name: 'My Purchases', href: '/#purchases', icon: ShoppingBag, badge: '3' },
  ];

  const handleLinkClick = (link: typeof navLinks[0], e: React.MouseEvent) => {
    if (onTabChange) {
      e.preventDefault();
      onTabChange(link.name);
      setMobileMenuOpen(false);
    } else {
      e.preventDefault();
      setMobileMenuOpen(false);
      router.push(link.href);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090D16]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="group flex items-center gap-3 transition-transform hover:scale-[1.01]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600/30 group-hover:border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
                Campus<span className="text-indigo-400 font-bold">LMS</span>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono tracking-tight">College Academic OS</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={`group relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/80 text-white shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-colors ${
                    isActive 
                      ? 'text-indigo-400' 
                      : link.highlight 
                      ? 'text-amber-400 group-hover:text-amber-300' 
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      link.highlight
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: AI Shortcut, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* AI Quick Shortcut Button */}
          <button
            onClick={onOpenAiSummary}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600/90 to-purple-600/90 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.25)] border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Summarize notes or syllabus using AI"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-200 animate-pulse" />
            <span>AI Summarizer</span>
            <kbd className="hidden lg:inline-block px-1 py-0.2 bg-black/30 rounded text-[9px] font-mono text-indigo-200">
              ⌘J
            </kbd>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-[#090D16]" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Academic Updates</span>
                  <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">Mark read</span>
                </div>
                <div className="mt-2 space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800/70 transition-colors">
                    <p className="font-medium text-slate-200">Prof. Thorne uploaded DSA Unit 4 Notes</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">15 minutes ago • CS301</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800/70 transition-colors">
                    <p className="font-medium text-slate-200">AI Summary generated for Multivariable Calculus</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">2 hours ago • MATH201</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1.5px]">
                <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
                  RK
                </div>
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#090D16]" />
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-white flex items-center gap-1">
                Rohan K.
                <ShieldCheck className="h-3 w-3 text-indigo-400" />
              </span>
              <span className="text-[10px] font-mono text-slate-400">B.Tech CSE • Sem 6</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F172A] px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={(e) => handleLinkClick(link, e)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAiSummary) onOpenAiSummary();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-md cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-200" />
              <span>Launch AI Note Summarizer</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
