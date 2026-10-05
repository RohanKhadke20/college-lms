'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Copy, 
  Zap, 
  AlertCircle
} from 'lucide-react';
import { NoteItem } from '@/types/lms';
import { MOCK_NOTES } from '@/data/mockNotes';

interface AiSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNote?: NoteItem | null;
}

export const AiSummaryModal: React.FC<AiSummaryModalProps> = ({
  isOpen,
  onClose,
  selectedNote
}) => {
  const [internalNoteId, setInternalNoteId] = useState<string>(MOCK_NOTES[0].id);
  const [customText, setCustomText] = useState('');
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use selectedNote ID if provided, otherwise internal selection
  const activeNoteId = selectedNote?.id || internalNoteId;
  const currentNote = MOCK_NOTES.find((n) => n.id === activeNoteId) || MOCK_NOTES[0];

  const handleCopy = () => {
    const summaryText = `[AI Lecture Summary: ${currentNote.title}]\n\nOverview:\n${currentNote.aiSummary.overview}\n\nKey Points:\n${currentNote.aiSummary.keyPoints.map((p) => `- ${p}`).join('\n')}\n\nExam Tips:\n${currentNote.aiSummary.examTips.map((t) => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateCustomGenerate = () => {
    if (!customText.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#0F172A] border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.25)] flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090D16]/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                AI Note-Summary Assistant
                <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Instant Synthesis
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate high-yield key concepts, exam tips, and flashcards in seconds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center px-6 pt-3 pb-2 border-b border-slate-800 bg-[#0F172A] gap-4">
          <button
            onClick={() => setMode('preset')}
            className={`text-xs font-semibold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'preset'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Select From Class Notes</span>
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`text-xs font-semibold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'custom'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Summarize Raw Lecture Text</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {mode === 'preset' ? (
            <>
              {/* Note Selector Dropdown */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select Note to Summarize
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MOCK_NOTES.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => setInternalNoteId(note.id)}
                      className={`text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                        activeNoteId === note.id
                          ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-indigo-400 font-semibold">
                          {note.subjectCode}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {note.pageCount} pages
                        </span>
                      </div>
                      <p className="font-medium line-clamp-1 text-slate-200">{note.title}</p>
                      <span className="text-[11px] text-slate-400 mt-1">{note.professor}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Display AI Summary Cards */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                {/* Note Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                      {currentNote.subject} • {currentNote.semester}
                    </span>
                    <h3 className="text-sm font-semibold text-white mt-0.5">
                      {currentNote.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy Summary</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Executive Overview */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/20">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Executive Concept Breakdown</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {currentNote.aiSummary.overview}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Core Exam Takeaways ({currentNote.aiSummary.keyPoints.length})</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentNote.aiSummary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Tips / Trap Warnings */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>Professor Exam Watchlist & High-Probability Questions</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {currentNote.aiSummary.examTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Formula / Cheat Reference */}
                {currentNote.aiSummary.formulaSheet && (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                      Mathematical & Recurrence Formulations
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs">
                      {currentNote.aiSummary.formulaSheet.map((formula, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-950 text-indigo-300 border border-slate-800/80">
                          {formula}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Custom Raw Text Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Paste Raw Lecture Notes / Syllabus Snippet
                </label>
                <textarea
                  rows={6}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste lecture transcript, class notes, or textbook chapter summary here..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  {customText.length} characters entered
                </span>
                <button
                  onClick={handleSimulateCustomGenerate}
                  disabled={!customText.trim() || isGenerating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate 2-Min Summary'}</span>
                </button>
              </div>

              {isGenerating && (
                <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
                  <div className="inline-block animate-spin text-indigo-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Analyzing key formulas, theorems, and synthesizing high-yield study cards...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-[#090D16]/60 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>AI Knowledge Engine: Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiSummaryModal;
