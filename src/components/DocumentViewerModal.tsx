'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Copy, 
  CheckCircle2, 
  Maximize2,
  FileCode,
  AlertCircle,
  Lock,
  Sparkles
} from 'lucide-react';
import { ClassNote } from '@/types/note';
import { BuyNoteButton } from './BuyNoteButton';
import { AIAssistantModal } from './AIAssistantModal';

interface DocumentViewerModalProps {
  note: ClassNote | null;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked?: boolean;
  onUnlock?: (noteId: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  note,
  isOpen,
  onClose,
  isUnlocked = false,
  onUnlock,
}) => {
  const [copied, setCopied] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  if (!isOpen || !note) return null;

  const isPdf = note.file_name.toLowerCase().endsWith('.pdf') || note.file_type.includes('pdf');

  const handleCopyLink = () => {
    if (note.file_url) {
      navigator.clipboard.writeText(note.file_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!note.file_url) return;
    const link = document.createElement('a');
    link.href = note.file_url;
    link.download = note.file_name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedSize = (note.file_size / (1024 * 1024)).toFixed(2) + ' MB';

  // Preview URL: Direct URL for PDF, Google Docs viewer for DOCX
  const previewUrl = isPdf
    ? note.file_url
    : `https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl h-[92vh] rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#090D16]/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {isPdf ? <FileText className="h-5 w-5" /> : <FileCode className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {note.subject_code || 'NOTES'}
                </span>
                <span className="text-xs text-slate-400 truncate">{note.subject}</span>
                {note.is_premium ? (
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Premium ₹{note.price}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Free Document
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-white truncate mt-0.5">
                {note.title}
              </h2>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Copy direct file URL"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={note.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Open full page"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors cursor-pointer"
              title="Launch Gemini 2.0 Flash AI Study Assistant"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="flex-1 bg-[#090D16] p-2 sm:p-4 overflow-hidden flex flex-col">
          {note.is_premium && note.price > 0 && !isUnlocked ? (
            <div className="flex-1 w-full h-full rounded-xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-5">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Lock className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md">
                <span className="inline-block text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Premium Study Note • Locked
                </span>
                <h3 className="text-xl font-bold text-white">{note.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {note.description ||
                    'This complete lecture series includes derivations, textbook proofs, solved gate questions, and summary cheat-sheets.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 w-full max-w-sm space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Instructor:</span>
                  <span className="text-slate-200 font-medium">{note.professor}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Subject:</span>
                  <span className="text-slate-200 font-medium">{note.subject}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Access Tier:</span>
                  <span className="text-amber-400 font-mono font-bold">One-Time Fee (₹{note.price})</span>
                </div>
              </div>

              <div className="pt-2">
                <BuyNoteButton
                  noteId={note.id}
                  noteTitle={note.title}
                  price={note.price}
                  isPremium={true}
                  size="lg"
                  onSuccess={(unlockedId) => {
                    onUnlock?.(unlockedId);
                  }}
                />
              </div>
            </div>
          ) : note.file_url ? (
            <div className="flex-1 w-full h-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
              <iframe
                src={previewUrl}
                title={note.title}
                className="w-full h-full border-0"
                onError={() => setIframeError(true)}
              />

              {iframeError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-6 text-center space-y-4">
                  <AlertCircle className="h-10 w-10 text-amber-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">Browser Inline Preview Unavailable</p>
                    <p className="text-xs text-slate-400 max-w-md">
                      This document ({note.file_name}) cannot be previewed in an inline iframe. You can view it in a separate tab or download it directly.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={note.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Open in Browser</span>
                    </a>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Floating AI Assistant Trigger Button */}
              <button
                onClick={() => setIsAiAssistantOpen(true)}
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xl shadow-indigo-600/40 border border-indigo-400/30 transition-all transform hover:scale-105 cursor-pointer"
                title="Launch Gemini 2.0 Flash AI Study Assistant"
              >
                <Sparkles className="h-4 w-4 text-indigo-200" />
                <span>AI Study Assistant</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <FileText className="h-12 w-12 text-slate-600" />
              <p className="text-sm text-slate-300 font-medium">No storage URL associated with this note</p>
            </div>
          )}
        </div>

        {/* Footer Meta bar */}
        <div className="px-5 py-2.5 border-t border-slate-800 bg-[#090D16]/80 flex flex-wrap items-center justify-between text-xs text-slate-400 shrink-0 gap-2">
          <div className="flex items-center gap-4">
            <span>File: <strong className="text-slate-200 font-mono">{note.file_name}</strong></span>
            <span>Size: <strong className="text-slate-200 font-mono">{formattedSize}</strong></span>
            {note.professor && <span>Instructor: <strong className="text-slate-200">{note.professor}</strong></span>}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Supabase Storage • Public Verified Asset
          </div>
        </div>
      </div>

      {/* Floating AI Study Assistant Panel */}
      <AIAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        note={note}
      />
    </div>
  );
};

export default DocumentViewerModal;
