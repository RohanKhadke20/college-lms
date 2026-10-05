'use client';

import React from 'react';
import { Sparkles, ArrowRight, Zap, Bot, BookOpenCheck, BrainCircuit } from 'lucide-react';

interface AiSummaryShortcutCardProps {
  onOpenSummary: () => void;
}

export const AiSummaryShortcutCard: React.FC<AiSummaryShortcutCardProps> = ({
  onOpenSummary
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#0F172A] via-[#131B2E] to-[#1E1B4B]/40 p-5 sm:p-6 shadow-[0_4px_30px_rgba(79,70,229,0.15)] group transition-all duration-300 hover:border-indigo-400/50">
      {/* Decorative background glow & mesh */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left side content */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
              <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
              <span>AI Copilot Engine</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              Campus AI v2.4 • Gemini & GPT-4o
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Instant AI Note-Summary Shortcut
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400 hidden sm:inline" />
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a rapid 2-minute revision before class or exam? Condense 50+ pages of handwritten or professor lecture notes into bullet takeaways, exam traps, and recall flashcards automatically.
          </p>

          {/* Quick pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 font-medium">
              <BrainCircuit className="h-3 w-3 text-indigo-400" />
              Exam Predictions
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 font-medium">
              <BookOpenCheck className="h-3 w-3 text-emerald-400" />
              Formula Sheets
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 font-medium">
              <Bot className="h-3 w-3 text-purple-400" />
              One-Click Synthesis
            </span>
          </div>
        </div>

        {/* Right side shortcut action button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
          <button
            onClick={onOpenSummary}
            id="ai-summary-shortcut-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-[0_0_25px_rgba(99,102,241,0.4)] border border-indigo-300/30 transition-all transform hover:scale-[1.03] active:scale-[0.98] group/btn cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-indigo-200 group-hover/btn:rotate-12 transition-transform" />
            <span>Summarize Notes with AI</span>
            <ArrowRight className="h-4 w-4 text-indigo-200 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Free for all enrolled students
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiSummaryShortcutCard;
