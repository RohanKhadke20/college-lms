'use client';

import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Clock, 
  Star, 
  BookMarked,
  UserCheck
} from 'lucide-react';
import { NoteItem } from '@/types/lms';

interface NoteCardProps {
  note: NoteItem;
  onOpenAiSummary: (note: NoteItem) => void;
  onSelectNote?: (note: NoteItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onOpenAiSummary,
  onSelectNote
}) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-[#0F172A] border border-slate-800/90 hover:border-indigo-500/40 p-5 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5">
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {note.subjectCode}
            </span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-[130px] sm:max-w-[170px]">
              {note.subject}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <Star className="h-3 w-3 fill-amber-400" />
            <span>{note.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({note.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h4 
          onClick={() => onSelectNote?.(note)}
          className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {note.title}
        </h4>

        {/* Professor & Semester Info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
          <UserCheck className="h-3.5 w-3.5 text-indigo-400/80" />
          <span className="truncate">{note.professor}</span>
          <span>•</span>
          <span className="shrink-0">{note.semester}</span>
        </div>

        {/* Preview Snippet */}
        <p className="text-xs text-slate-300/80 mt-3 line-clamp-2 leading-relaxed">
          {note.previewSnippet}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-slate-500">+{note.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* Card Footer: Details & Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              {note.pageCount} pages
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              {note.readTime}
            </span>
          </div>

          <span className="font-mono text-slate-400">
            {note.downloads.toLocaleString()} reads
          </span>
        </div>

        {/* Buttons: AI Summary Shortcut + Read Notes */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* AI Summary Shortcut Button */}
          <button
            onClick={() => onOpenAiSummary(note)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 hover:text-indigo-100 text-xs font-semibold border border-indigo-500/30 hover:border-indigo-400/50 transition-all cursor-pointer shadow-sm"
            title="Instant AI Summary & Key Takeaways"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI Summary</span>
          </button>

          {/* Access / Read Notes Button */}
          <button
            onClick={() => onSelectNote?.(note)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
          >
            {note.price === 0 || note.isPurchased ? (
              <>
                <BookMarked className="h-3.5 w-3.5 text-emerald-400" />
                <span>Read Notes</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 text-indigo-400" />
                <span>Unlock (₹{note.price})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
