'use client';

import React from 'react';
import { NoteCard } from './NoteCard';
import { NoteItem } from '@/types/lms';
import { BookOpen, FilterX } from 'lucide-react';

interface RecentNotesFeedProps {
  notes: NoteItem[];
  onOpenAiSummary: (note: NoteItem) => void;
  onSelectNote?: (note: NoteItem) => void;
  onResetFilters: () => void;
}

export const RecentNotesFeed: React.FC<RecentNotesFeedProps> = ({
  notes,
  onOpenAiSummary,
  onSelectNote,
  onResetFilters
}) => {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              Recent Class Notes Feed
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                Semester 2026
              </span>
            </h3>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Updated 15 mins ago
        </span>
      </div>

      {/* Grid of Note Cards */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onOpenAiSummary={onOpenAiSummary}
              onSelectNote={onSelectNote}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-10 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400">
            <FilterX className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">No lecture notes found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No notes match your current search query or subject filters. Try searching for a different keyword or resetting your filters.
            </p>
          </div>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default RecentNotesFeed;
