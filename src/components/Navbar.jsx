import React from 'react';
import { BookOpen, Plus, LayoutGrid, List, DownloadCloud, Search, X } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onOpenImportExportModal,
  viewMode,
  setViewMode,
  totalBooks
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 text-white flex items-center justify-center shadow-md shadow-amber-900/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                BookShelf
                <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hidden sm:inline-block">
                  {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Personal Library & Reading Tracker</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, author, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-white/80 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & View Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-sm transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-sm transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Backup / Export */}
            <button
              onClick={onOpenImportExportModal}
              className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors border border-transparent hover:border-slate-200 flex items-center gap-1.5"
              title="Backup & Data Management"
            >
              <DownloadCloud className="w-4 h-4" />
              <span className="hidden md:inline">Data</span>
            </button>

            {/* Add Book Button */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-amber-900/15 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Book</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
