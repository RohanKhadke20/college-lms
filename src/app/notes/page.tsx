'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { DocumentViewerModal } from '@/components/DocumentViewerModal';
import { AIAssistantModal } from '@/components/AIAssistantModal';
import { ClassNote, PremiumFilter } from '@/types/note';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  FileText, 
  FileCode, 
  Download, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  UserCheck, 
  CheckCircle2, 
  SlidersHorizontal,
  X,
  Lock
} from 'lucide-react';
import { BuyNoteButton } from '@/components/BuyNoteButton';

export default function NotesPage() {
  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unlockedNoteIds, setUnlockedNoteIds] = useState<string[]>([]);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [premiumFilter, setPremiumFilter] = useState<PremiumFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'title'>('newest');

  // Modals
  const [previewNote, setPreviewNote] = useState<ClassNote | null>(null);
  const [aiAssistantNote, setAiAssistantNote] = useState<ClassNote | null>(null);

  // Sync unlocked notes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('campus_unlocked_notes');
      if (stored) {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => {
          setUnlockedNoteIds(parsed);
        });
      }
    } catch {
      // LocalStorage fallback
    }

    const handleUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<{ noteId: string }>;
      if (customEvent.detail?.noteId) {
        setUnlockedNoteIds((prev) => Array.from(new Set([...prev, customEvent.detail.noteId])));
      }
    };
    window.addEventListener('campus-note-unlocked', handleUnlock);
    return () => window.removeEventListener('campus-note-unlocked', handleUnlock);
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      if (data.notes) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error('Failed to load notes from Supabase:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitialNotes() {
      try {
        const res = await fetch('/api/notes');
        const data = await res.json();
        if (!ignore && data.notes) {
          setNotes(data.notes);
        }
      } catch (err) {
        console.error('Failed to load notes from Supabase:', err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadInitialNotes();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    fetchNotes();
  };

  // Derive unique subjects from the notes list
  const availableSubjects = useMemo(() => {
    const defaultSubs = [
      'All Subjects',
      'Data Structures & Algorithms',
      'Artificial Intelligence',
      'Engineering Mathematics',
      'Operating Systems',
      'Digital Electronics',
      'Cloud Computing'
    ];
    const fromNotes = notes.map((n) => n.subject).filter(Boolean);
    const combined = Array.from(new Set([...defaultSubs, ...fromNotes]));
    return combined;
  }, [notes]);

  // Filter & Sort
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Subject filter
    if (selectedSubject !== 'All Subjects') {
      result = result.filter(
        (n) => n.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
    }

    // Premium status filter
    if (premiumFilter === 'free') {
      result = result.filter((n) => !n.is_premium || n.price === 0);
    } else if (premiumFilter === 'premium') {
      result = result.filter((n) => n.is_premium && n.price > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          (n.subject_code && n.subject_code.toLowerCase().includes(q)) ||
          (n.professor && n.professor.toLowerCase().includes(q)) ||
          n.file_name.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [notes, selectedSubject, premiumFilter, searchQuery, sortBy]);

  const handleDownload = (note: ClassNote) => {
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

  const handleOpenAiSummary = (note: ClassNote) => {
    setAiAssistantNote(note);
  };

  const handleResetFilters = () => {
    setSelectedSubject('All Subjects');
    setPremiumFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans">
      <Navbar activeTab="Class Notes" />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                Supabase Live Synced
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Storage: notes-files
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Class Notes & Lecture Repository
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse, filter by subject or premium tier, preview documents inline, and download notes directly from Supabase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Refresh notes from database"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/notes/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Upload Class Note</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4 shadow-sm">
          {/* Search Row & Premium Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title, topic, professor, or filename..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Premium Status Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              <button
                onClick={() => setPremiumFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  premiumFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Notes
              </button>
              <button
                onClick={() => setPremiumFilter('free')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  premiumFilter === 'free'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Free Only
              </button>
              <button
                onClick={() => setPremiumFilter('premium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  premiumFilter === 'premium'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Premium Only
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc' | 'title')}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest" className="bg-slate-900 text-slate-200">Newest Uploads</option>
                <option value="price-asc" className="bg-slate-900 text-slate-200">Price: Low to High</option>
                <option value="price-desc" className="bg-slate-900 text-slate-200">Price: High to Low</option>
                <option value="title" className="bg-slate-900 text-slate-200">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono pr-2 border-r border-slate-800 shrink-0">
              <Filter className="h-3 w-3 text-slate-500" />
              <span>Subjects:</span>
            </div>

            {availableSubjects.map((sub) => {
              const isSelected = selectedSubject.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.35)] border border-indigo-400/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>

          {/* Active summary */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-white font-semibold">{filteredNotes.length}</strong> notes from Supabase</span>
              {selectedSubject !== 'All Subjects' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {selectedSubject}
                  <button onClick={() => setSelectedSubject('All Subjects')} className="hover:text-white ml-0.5">×</button>
                </span>
              )}
              {premiumFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {premiumFilter === 'free' ? 'Free Only' : 'Premium Only'}
                  <button onClick={() => setPremiumFilter('all')} className="hover:text-white ml-0.5">×</button>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-block animate-spin text-indigo-400">
              <RefreshCw className="h-8 w-8" />
            </div>
            <p className="text-xs text-slate-400">Loading verified notes from Supabase...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const isPdf = note.file_name.toLowerCase().endsWith('.pdf') || note.file_type.includes('pdf');
              const formattedSize = (note.file_size / (1024 * 1024)).toFixed(2) + ' MB';
              const isPaid = note.is_premium && note.price > 0;
              const isUnlocked = !isPaid || unlockedNoteIds.includes(note.id);

              return (
                <div
                  key={note.id}
                  className="group relative flex flex-col justify-between rounded-xl bg-[#0F172A] border border-slate-800 hover:border-indigo-500/40 p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* Top Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {note.subject_code || 'CS300'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium truncate max-w-[130px]">
                          {note.subject}
                        </span>
                      </div>

                      {/* Pricing Tag */}
                      {isPaid ? (
                        isUnlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Lock className="h-3 w-3" />
                            ₹{note.price}
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Free
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setPreviewNote(note)}
                      className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {note.title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                      <UserCheck className="h-3.5 w-3.5 text-indigo-400/80" />
                      <span className="truncate">{note.professor}</span>
                      <span>•</span>
                      <span className="shrink-0">{note.semester}</span>
                    </div>

                    {/* Description */}
                    {note.description && (
                      <p className="text-xs text-slate-300/80 mt-2.5 line-clamp-2 leading-relaxed">
                        {note.description}
                      </p>
                    )}

                    {/* File format info */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1">
                        {isPdf ? (
                          <FileText className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <FileCode className="h-3.5 w-3.5 text-blue-400" />
                        )}
                        <span>{note.file_name}</span>
                      </div>
                      <span>•</span>
                      <span>{formattedSize}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    {isUnlocked ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {/* Preview Button */}
                        <button
                          onClick={() => setPreviewNote(note)}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                          title="Preview document in viewer"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>Preview</span>
                        </button>

                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(note)}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
                          title="Download file"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Get File</span>
                        </button>

                        {/* AI Summary Button */}
                        <button
                          onClick={() => handleOpenAiSummary(note)}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors cursor-pointer"
                          title="Generate AI summary of note"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          <span>AI Digest</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5 items-center">
                        <div className="col-span-2">
                          <BuyNoteButton
                            noteId={note.id}
                            noteTitle={note.title}
                            price={note.price}
                            isPremium={true}
                            fullWidth={true}
                            size="sm"
                            onSuccess={(id) => {
                              setUnlockedNoteIds((prev) => Array.from(new Set([...prev, id])));
                            }}
                          />
                        </div>
                        <button
                          onClick={() => handleOpenAiSummary(note)}
                          className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors cursor-pointer"
                          title="Generate AI summary of note"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          <span>AI Digest</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-[#0F172A] border border-slate-800 text-center space-y-4">
            <BookOpen className="h-10 w-10 text-slate-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">No class notes match your filter criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try switching subject or premium status filters, or upload a new study set.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Reset Filters
              </button>
              <Link
                href="/notes/upload"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Upload Note
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        note={previewNote}
        isOpen={Boolean(previewNote)}
        onClose={() => setPreviewNote(null)}
        isUnlocked={
          previewNote
            ? !previewNote.is_premium ||
              previewNote.price === 0 ||
              unlockedNoteIds.includes(previewNote.id)
            : false
        }
        onUnlock={(unlockedId) => {
          setUnlockedNoteIds((prev) => Array.from(new Set([...prev, unlockedId])));
        }}
      />

      {/* Gemini 2.0 Flash AI Study Assistant Modal */}
      <AIAssistantModal
        isOpen={Boolean(aiAssistantNote)}
        onClose={() => setAiAssistantNote(null)}
        note={aiAssistantNote}
      />
    </div>
  );
}
