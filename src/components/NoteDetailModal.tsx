'use client';

import React from 'react';
import { 
  X, 
  Download, 
  Sparkles, 
  Star
} from 'lucide-react';
import { NoteItem } from '@/types/lms';
import { BuyNoteButton } from './BuyNoteButton';

interface NoteDetailModalProps {
  note: NoteItem | null;
  onClose: () => void;
  onOpenAiSummary: (note: NoteItem) => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  note,
  onClose,
  onOpenAiSummary
}) => {
  const [unlockedLocally, setUnlockedLocally] = React.useState(false);
  if (!note) return null;

  const isPurchased = note.isPurchased || unlockedLocally;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800 bg-[#090D16]/70">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {note.subjectCode}
              </span>
              <span className="text-xs text-slate-400">{note.subject}</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{note.semester}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {note.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metadata badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">Instructor</span>
              <p className="text-xs font-semibold text-white mt-0.5 truncate">{note.professor}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">Pages / Length</span>
              <p className="text-xs font-semibold text-white mt-0.5">{note.pageCount} Pages ({note.readTime})</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">Student Rating</span>
              <p className="text-xs font-semibold text-amber-400 mt-0.5 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400" />
                {note.rating.toFixed(1)} ({note.reviewsCount})
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">Downloads</span>
              <p className="text-xs font-semibold text-white mt-0.5">{note.downloads.toLocaleString()}</p>
            </div>
          </div>

          {/* Abstract / Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Lecture Note Overview
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              {note.previewSnippet}
            </p>
          </div>

          {/* AI Quick Preview Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>AI Concept Digest</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAiSummary(note);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-200 underline font-medium"
              >
                View full AI summary →
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {note.aiSummary.overview}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((t) => (
              <span key={t} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-[#090D16]/70">
          <button
            onClick={() => {
              onClose();
              onOpenAiSummary(note);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Launch AI Note Assistant</span>
          </button>

          <div className="flex items-center gap-2">
            {note.price > 0 && !isPurchased ? (
              <BuyNoteButton
                noteId={note.id}
                noteTitle={note.title}
                price={note.price}
                onSuccess={() => {
                  setUnlockedLocally(true);
                }}
              />
            ) : (
              <button
                onClick={() => alert(`Note "${note.title}" PDF downloaded successfully!`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailModal;
