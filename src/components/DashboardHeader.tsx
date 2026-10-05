'use client';

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Database,
  Calendar,
  Award
} from 'lucide-react';

interface DashboardHeaderProps {
  studentName?: string;
  department?: string;
  semester?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  studentName = 'Rohan Khadke',
  department = 'Department of Computer Science & Engineering',
  semester = 'Semester 6 • 2026 Academic Session'
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner with Profile Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-semibold">
              <Database className="h-3 w-3 text-emerald-400" />
              Supabase Connected
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Academic Cloud ID: #CS-2023-884
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Student Academic Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, <strong className="text-slate-200 font-medium">{studentName}</strong> • {department} ({semester})
          </p>
        </div>

        {/* Date / Session Pill */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-slate-800 text-xs font-mono text-slate-300">
            <Calendar className="h-3.5 w-3.5 text-indigo-400" />
            <span>Oct 2026 • Midterm Revision Week</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar (Stitch High-Density Architecture) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Enrolled Courses</span>
            <BookOpen className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">6</span>
            <span className="text-[11px] text-emerald-400 font-medium">100% Active</span>
          </div>
          <span className="text-[10px] text-slate-500">CS301, AI402, CS303, MATH201...</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Class Notes</span>
            <GraduationCap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">48</span>
            <span className="text-[11px] text-emerald-400 font-medium">+6 this week</span>
          </div>
          <span className="text-[10px] text-slate-500">Peer & faculty verified</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">AI Summaries</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">24</span>
            <span className="text-[11px] text-purple-400 font-medium">Instant flashcards</span>
          </div>
          <span className="text-[10px] text-slate-500">Saved 4.5 hrs study time</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800/90 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase tracking-wider">Academic Standing</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">9.2</span>
            <span className="text-[11px] text-amber-400 font-medium">CGPA (Top 5%)</span>
          </div>
          <span className="text-[10px] text-slate-500">Dean’s Honor List Candidate</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
