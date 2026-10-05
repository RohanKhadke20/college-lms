'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, Filter } from 'lucide-react';
import { SUBJECT_CATEGORIES } from '@/data/mockNotes';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  freeOnly: boolean;
  onToggleFreeOnly: () => void;
  totalResults: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  sortBy,
  onSortChange,
  freeOnly,
  onToggleFreeOnly,
  totalResults
}) => {
  return (
    <div className="space-y-4">
      {/* Top Search Input & Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input with icons */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search class notes, professors, course codes (e.g. CS301, Bellman-Ford, Transformers)..."
            className="w-full pl-10 pr-20 py-2.5 rounded-lg bg-[#0F172A] border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-10 pr-2 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Sort & Filter Options */}
        <div className="flex items-center gap-2">
          {/* Free Only Toggle Button */}
          <button
            onClick={onToggleFreeOnly}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
              freeOnly
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-[#0F172A] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${freeOnly ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            <span>Free Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-800 text-xs font-medium text-slate-300">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="recent" className="bg-slate-900 text-slate-200">Most Recent</option>
                <option value="rating" className="bg-slate-900 text-slate-200">Highest Rated</option>
                <option value="downloads" className="bg-slate-900 text-slate-200">Most Downloaded</option>
                <option value="pages" className="bg-slate-900 text-slate-200">Pages: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Filter Pills Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono pr-2 border-r border-slate-800 shrink-0">
          <Filter className="h-3 w-3 text-slate-500" />
          <span>Subjects:</span>
        </div>

        {SUBJECT_CATEGORIES.map((cat) => {
          const isSelected = selectedSubject === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSubjectChange(cat.name)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.35)] border border-indigo-400/40 scale-[1.02]'
                  : 'bg-[#0F172A] text-slate-400 border border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active filter summary & total results count */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span>Showing <strong className="text-slate-200 font-semibold">{totalResults}</strong> verified note sets</span>
          {selectedSubject !== 'All Subjects' && (
            <span className="inline-flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Filtered: {selectedSubject}
              <button 
                onClick={() => onSubjectChange('All Subjects')}
                className="hover:text-white ml-0.5 cursor-pointer"
                title="Remove filter"
              >
                ×
              </button>
            </span>
          )}
          {freeOnly && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Free notes only
              <button 
                onClick={onToggleFreeOnly}
                className="hover:text-white ml-0.5 cursor-pointer"
                title="Remove filter"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {searchQuery && (
          <span className="text-[11px] text-slate-400">
            Matching &ldquo;<span className="text-indigo-300">{searchQuery}</span>&rdquo;
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchFilterBar;
