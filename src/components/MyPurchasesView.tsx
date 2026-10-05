'use client';

import React from 'react';
import { ShoppingBag, Download, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
import { MOCK_NOTES } from '@/data/mockNotes';
import { NoteItem } from '@/types/lms';

interface MyPurchasesViewProps {
  onOpenAiSummary: (note: NoteItem) => void;
  onExploreNotes: () => void;
}

export const MyPurchasesView: React.FC<MyPurchasesViewProps> = ({
  onOpenAiSummary,
  onExploreNotes
}) => {
  const purchasedNotes = MOCK_NOTES.filter((n) => n.isPurchased);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-400" />
            My Unlocked & Purchased Course Notes
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access all your verified study packs, verified faculty lectures, and Razorpay transaction receipts.
          </p>
        </div>

        <button
          onClick={onExploreNotes}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Browse All Class Notes</span>
        </button>
      </div>

      {/* Grid of purchased notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {purchasedNotes.map((note) => (
          <div
            key={note.id}
            className="flex flex-col justify-between rounded-xl bg-[#0F172A] border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Unlocked
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {note.subjectCode}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white line-clamp-2">
                {note.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {note.professor} • {note.semester}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{note.pageCount} Pages</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {note.price === 0 ? 'Complimentary' : `Paid ₹${note.price}`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenAiSummary(note)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>AI Summary</span>
                </button>

                <button
                  onClick={() => alert(`Downloading note: ${note.title}`)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPurchasesView;
