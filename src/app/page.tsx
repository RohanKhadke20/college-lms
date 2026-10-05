'use client';

import React, { useState, useMemo } from 'react';
import { 
  Navbar, 
  DashboardHeader, 
  AiSummaryShortcutCard, 
  SearchFilterBar, 
  RecentNotesFeed, 
  AiSummaryModal, 
  NoteDetailModal,
  MyPurchasesView,
  AiAssistantView 
} from '@/components';
import { MOCK_NOTES } from '@/data/mockNotes';
import { NoteItem } from '@/types/lms';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [sortBy, setSortBy] = useState('recent');
  const [freeOnly, setFreeOnly] = useState(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeAiNote, setActiveAiNote] = useState<NoteItem | null>(null);
  const [activeDetailNote, setActiveDetailNote] = useState<NoteItem | null>(null);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let result = [...MOCK_NOTES];

    // Subject Filter
    if (selectedSubject !== 'All Subjects') {
      result = result.filter((n) => n.subject === selectedSubject);
    }

    // Free Only Filter
    if (freeOnly) {
      result = result.filter((n) => n.price === 0 || n.isPurchased);
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          n.subjectCode.toLowerCase().includes(q) ||
          n.professor.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.previewSnippet.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'pages') {
      result.sort((a, b) => b.pageCount - a.pageCount);
    }

    return result;
  }, [searchQuery, selectedSubject, sortBy, freeOnly]);

  const handleOpenAiSummary = (note?: NoteItem) => {
    if (note) {
      setActiveAiNote(note);
    } else {
      setActiveAiNote(MOCK_NOTES[0]);
    }
    setIsAiModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All Subjects');
    setFreeOnly(false);
    setSortBy('recent');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Responsive Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAiSummary={() => handleOpenAiSummary()}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Student Dashboard Header & Overview */}
            <DashboardHeader
              studentName="Rohan Khadke"
              department="Department of Computer Science & Engineering"
              semester="Semester 6 • 2026 Academic Session"
            />

            {/* AI Note-Summary Shortcut Card */}
            <AiSummaryShortcutCard
              onOpenSummary={() => handleOpenAiSummary()}
            />

            {/* Quick Search & Subject Filter Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090D16] border border-slate-800 shadow-md">
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                sortBy={sortBy}
                onSortChange={setSortBy}
                freeOnly={freeOnly}
                onToggleFreeOnly={() => setFreeOnly(!freeOnly)}
                totalResults={filteredNotes.length}
              />
            </div>

            {/* Recent Notes Feed */}
            <RecentNotesFeed
              notes={filteredNotes}
              onOpenAiSummary={handleOpenAiSummary}
              onSelectNote={setActiveDetailNote}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* TAB 2: CLASS NOTES */}
        {activeTab === 'Class Notes' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Class Notes & Lecture Repository
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Browse, search, and download peer-verified notes from course faculty.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] border border-slate-800">
              <SearchFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                sortBy={sortBy}
                onSortChange={setSortBy}
                freeOnly={freeOnly}
                onToggleFreeOnly={() => setFreeOnly(!freeOnly)}
                totalResults={filteredNotes.length}
              />
            </div>

            <RecentNotesFeed
              notes={filteredNotes}
              onOpenAiSummary={handleOpenAiSummary}
              onSelectNote={setActiveDetailNote}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* TAB 3: AI STUDY ASSISTANT */}
        {activeTab === 'AI Study Assistant' && (
          <AiAssistantView />
        )}

        {/* TAB 4: MY PURCHASES */}
        {activeTab === 'My Purchases' && (
          <MyPurchasesView
            onOpenAiSummary={handleOpenAiSummary}
            onExploreNotes={() => setActiveTab('Class Notes')}
          />
        )}
      </main>

      {/* AI Summary Modal */}
      <AiSummaryModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        selectedNote={activeAiNote}
      />

      {/* Note Detail / Reader Modal */}
      <NoteDetailModal
        note={activeDetailNote}
        onClose={() => setActiveDetailNote(null)}
        onOpenAiSummary={handleOpenAiSummary}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#090D16] py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>CampusLMS Platform • Higher Education Academic OS</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Supabase Ready</span>
            <span>•</span>
            <span>Next.js 16 App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
