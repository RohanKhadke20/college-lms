'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  Send, 
  Loader2, 
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ClassNote } from '@/types/note';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: ClassNote | null;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  const [activeTask, setActiveTask] = useState<'summarize' | 'generate_quiz' | 'explain' | 'custom'>('summarize');
  const [query, setQuery] = useState('');
  const [responseContent, setResponseContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen || !note) return null;

  const handleGenerate = async (
    taskType: 'summarize' | 'generate_quiz' | 'explain' | 'custom',
    customQuery?: string
  ) => {
    setActiveTask(taskType);
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskType,
          noteTitle: note.title,
          subject: note.subject,
          noteContent: note.description || `${note.title} in ${note.subject}`,
          question: customQuery || query,
        }),
      });

      const data = await res.json();
      if (data.content) {
        setResponseContent(data.content);
      } else {
        setResponseContent('No response received from AI assistant. Please try again.');
      }
    } catch (err) {
      console.error('AI assistant error:', err);
      setResponseContent('Failed to communicate with AI study service. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseContent) return;
    navigator.clipboard.writeText(responseContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    handleGenerate('custom', query.trim());
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full rounded-2xl bg-[#0F172A] border border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-w-4xl h-[92vh]' : 'max-w-xl h-[88vh]'
        }`}
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#090D16]/90 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">AI Study Assistant</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  gemini-2.0-flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Context: {note.title} ({note.subject})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={isExpanded ? 'Collapse panel' : 'Expand panel'}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Preset Buttons */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 shrink-0 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Lightbulb className="h-3 w-3 text-amber-400" />
            <span>Instant Academic Tasks:</span>
          </span>

          <div className="flex flex-wrap gap-2">
            {/* Action 1: Summarize in 5 bullet points */}
            <button
              onClick={() => handleGenerate('summarize')}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTask === 'summarize' && responseContent
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
              <span>Summarize in 5 bullet points</span>
            </button>

            {/* Action 2: Generate 3 Practice Questions */}
            <button
              onClick={() => handleGenerate('generate_quiz')}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTask === 'generate_quiz' && responseContent
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
              <span>Generate 3 Practice Questions</span>
            </button>

            {/* Action 3: Explain Concepts */}
            <button
              onClick={() => handleGenerate('explain')}
              disabled={loading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTask === 'explain' && responseContent
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Explain Core Concepts</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm text-slate-200">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-center">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center animate-spin">
                <Loader2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-white">
                Gemini 2.0 Flash is synthesizing note material...
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Extracting syllabus concepts, structuring formulas, and generating academic markdown.
              </p>
            </div>
          ) : responseContent ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-mono text-[11px] text-slate-400">
                  Rendered in Clean GitHub Markdown
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                    title="Copy response to clipboard"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleGenerate(activeTask, query)}
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
                    title="Regenerate"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Rendered Text */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 whitespace-pre-wrap leading-relaxed space-y-3 font-sans selection:bg-indigo-600/30">
                {responseContent}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-16 text-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">How can I assist your study session?</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Click one of the task shortcuts above to generate a 5-point summary, 3 practice questions, or type any specific question below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Free-form Question Input Footer */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 sm:p-4 border-t border-slate-800 bg-[#090D16]/90 shrink-0"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about this note (e.g. proof derivation, exam tips)..."
              disabled={loading}
              className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-1.5 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
              title="Submit question"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantModal;
