import React from 'react';
import { Star, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import { GENRE_OPTIONS, FORMAT_OPTIONS, STATUS_CONFIG } from '../data/initialBooks';

export default function FilterBar({
  selectedStatus,
  setSelectedStatus,
  selectedGenre,
  setSelectedGenre,
  selectedFormat,
  setSelectedFormat,
  favoritesOnly,
  setFavoritesOnly,
  sortBy,
  setSortBy,
  statusCounts,
  onResetFilters
}) {
  const hasActiveFilters = 
    selectedStatus !== 'all' || 
    selectedGenre !== 'all' || 
    selectedFormat !== 'all' || 
    favoritesOnly;

  return (
    <div className="space-y-3 mb-6">
      {/* Top Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-sm">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const count = statusCounts[key] ?? 0;
          const isActive = selectedStatus === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{config.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-sans ${
                  isActive
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row: Genre, Format, Favorites, Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs uppercase tracking-wider mr-1 hidden sm:flex">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Genre Dropdown */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            aria-label="Filter by genre"
            className="px-2.5 py-1.5 bg-[#FAF8F5] border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
          >
            <option value="all">All Genres</option>
            {GENRE_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Format Dropdown */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            aria-label="Filter by format"
            className="px-2.5 py-1.5 bg-[#FAF8F5] border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
          >
            <option value="all">All Formats</option>
            {FORMAT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Favorite Toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              favoritesOnly
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-xs'
                : 'bg-[#FAF8F5] border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
            <span>Favorites</span>
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort books"
            className="px-2.5 py-1.5 bg-[#FAF8F5] border border-slate-200 rounded-xl text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="title-asc">Title (A - Z)</option>
            <option value="title-desc">Title (Z - A)</option>
            <option value="author-asc">Author (A - Z)</option>
            <option value="rating-desc">Rating (Highest)</option>
            <option value="progress-desc">Reading Progress (%)</option>
            <option value="pages-desc">Page Count (Most)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
