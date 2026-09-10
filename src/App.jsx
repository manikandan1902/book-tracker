import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsDashboard from './components/StatsDashboard';
import FilterBar from './components/FilterBar';
import BookCard from './components/BookCard';
import BookTable from './components/BookTable';
import BookModal from './components/BookModal';
import BookDetailsModal from './components/BookDetailsModal';
import ImportExportModal from './components/ImportExportModal';
import { storageService } from './services/storageService';
import { BookOpen, Plus, Sparkles, Trash2 } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState(() => storageService.getBooks());
  const [prefs, setPrefs] = useState(() => storageService.getPrefs());

  const [viewMode, setViewMode] = useState(prefs.viewMode || 'grid');
  const [annualGoal, setAnnualGoal] = useState(prefs.annualGoal || 20);
  const [sortBy, setSortBy] = useState(prefs.sortBy || 'recent');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedLoanStatus, setSelectedLoanStatus] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { id, title }

  // Persist books
  useEffect(() => {
    storageService.saveBooks(books);
  }, [books]);

  // Persist preferences
  useEffect(() => {
    storageService.savePrefs({ viewMode, sortBy, annualGoal });
  }, [viewMode, sortBy, annualGoal]);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    const counts = {
      all: books.length,
      reading: 0,
      'want-to-read': 0,
      completed: 0,
      'on-hold': 0,
      dropped: 0
    };
    books.forEach(b => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      }
    });
    return counts;
  }, [books]);

  // Filter & Sort books
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Search query filter (searches title, author, genre, notes, and friend's name!)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.genre && b.genre.toLowerCase().includes(q)) ||
        (b.notes && b.notes.toLowerCase().includes(q)) ||
        (b.friendName && b.friendName.toLowerCase().includes(q)) ||
        (b.loanNotes && b.loanNotes.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(b => b.status === selectedStatus);
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      result = result.filter(b => b.genre === selectedGenre);
    }

    // Format filter
    if (selectedFormat !== 'all') {
      result = result.filter(b => b.format === selectedFormat);
    }

    // Loan status filter
    if (selectedLoanStatus !== 'all') {
      if (selectedLoanStatus === 'in-library') {
        result = result.filter(b => !b.loanStatus || b.loanStatus === 'none');
      } else {
        result = result.filter(b => b.loanStatus === selectedLoanStatus);
      }
    }

    // Favorites filter
    if (favoritesOnly) {
      result = result.filter(b => b.favorite);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'author-asc':
          return (a.author || '').localeCompare(b.author || '');
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'progress-desc': {
          const progA = a.pages > 0 ? (a.currentPage / a.pages) : 0;
          const progB = b.pages > 0 ? (b.currentPage / b.pages) : 0;
          return progB - progA;
        }
        case 'pages-desc':
          return (b.pages || 0) - (a.pages || 0);
        case 'recent':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return result;
  }, [books, searchQuery, selectedStatus, selectedGenre, selectedFormat, favoritesOnly, sortBy]);

  // CRUD Handlers
  const handleSaveBook = (bookData) => {
    if (editingBook) {
      setBooks(prev => prev.map(b => b.id === bookData.id ? bookData : b));
      if (selectedBookForDetails && selectedBookForDetails.id === bookData.id) {
        setSelectedBookForDetails(bookData);
      }
    } else {
      setBooks(prev => [bookData, ...prev]);
    }
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmation) return;
    setBooks(prev => prev.filter(b => b.id !== deleteConfirmation.id));
    if (selectedBookForDetails && selectedBookForDetails.id === deleteConfirmation.id) {
      setSelectedBookForDetails(null);
    }
    setDeleteConfirmation(null);
  };

  const handleToggleFavorite = (id) => {
    setBooks(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, favorite: !b.favorite };
      }
      return b;
    }));
    if (selectedBookForDetails && selectedBookForDetails.id === id) {
      setSelectedBookForDetails(prev => ({ ...prev, favorite: !prev.favorite }));
    }
  };

  const handleQuickPageUpdate = (id, delta) => {
    setBooks(prev => prev.map(b => {
      if (b.id === id) {
        const newCurrent = Math.max(0, Math.min(b.pages, (b.currentPage || 0) + delta));
        const updated = { ...b, currentPage: newCurrent };
        if (newCurrent >= b.pages && b.pages > 0) {
          updated.status = 'completed';
          if (!updated.finishDate) {
            updated.finishDate = new Date().toISOString().split('T')[0];
          }
        }
        return updated;
      }
      return b;
    }));
  };

  const handleUpdateStatus = (id, newStatus) => {
    setBooks(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, status: newStatus };
        if (newStatus === 'completed') {
          updated.currentPage = b.pages;
          if (!updated.finishDate) {
            updated.finishDate = new Date().toISOString().split('T')[0];
          }
        }
        return updated;
      }
      return b;
    }));
  };

  const handleUpdateProgress = (id, pagesRead) => {
    setBooks(prev => prev.map(b => {
      if (b.id === id) {
        const updated = { ...b, currentPage: pagesRead };
        if (pagesRead >= b.pages && b.pages > 0) {
          updated.status = 'completed';
          if (!updated.finishDate) {
            updated.finishDate = new Date().toISOString().split('T')[0];
          }
        }
        return updated;
      }
      return b;
    }));
  };

  const handleReturnBook = (id) => {
    setBooks(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          loanStatus: 'none',
          friendName: '',
          loanDate: '',
          dueDate: '',
          loanNotes: ''
        };
      }
      return b;
    }));
    if (selectedBookForDetails && selectedBookForDetails.id === id) {
      setSelectedBookForDetails(prev => ({
        ...prev,
        loanStatus: 'none',
        friendName: '',
        loanDate: '',
        dueDate: '',
        loanNotes: ''
      }));
    }
  };

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSelectedGenre('all');
    setSelectedFormat('all');
    setSelectedLoanStatus('all');
    setFavoritesOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddModal={() => { setEditingBook(null); setIsBookModalOpen(true); }}
        onOpenImportExportModal={() => setIsImportExportOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalBooks={books.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Statistics & Reading Goal Dashboard */}
        <StatsDashboard
          books={books}
          annualGoal={annualGoal}
          onUpdateGoal={setAnnualGoal}
        />

        {/* Filters, Search & View Controls */}
        <FilterBar
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedLoanStatus={selectedLoanStatus}
          setSelectedLoanStatus={setSelectedLoanStatus}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          sortBy={sortBy}
          setSortBy={setSortBy}
          statusCounts={statusCounts}
          onResetFilters={handleResetFilters}
        />

        {/* Book List / Cards Display */}
        {filteredAndSortedBooks.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onOpenDetails={setSelectedBookForDetails}
                  onEdit={handleOpenEdit}
                  onDelete={(id, title) => setDeleteConfirmation({ id, title })}
                  onToggleFavorite={handleToggleFavorite}
                  onQuickPageUpdate={handleQuickPageUpdate}
                  onReturnBook={handleReturnBook}
                />
              ))}
            </div>
          ) : (
            <BookTable
              books={filteredAndSortedBooks}
              onOpenDetails={setSelectedBookForDetails}
              onEdit={handleOpenEdit}
              onDelete={(id, title) => setDeleteConfirmation({ id, title })}
              onToggleFavorite={handleToggleFavorite}
              onUpdateStatus={handleUpdateStatus}
              onReturnBook={handleReturnBook}
            />
          )
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-800 mb-1">
              {books.length === 0 ? "Your BookShelf is empty" : "No matching books found"}
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              {books.length === 0
                ? "Start building your personal library by adding your first book or importing a backup!"
                : "Try adjusting your search query or reset your filters to see more books."}
            </p>
            {books.length === 0 ? (
              <button
                onClick={() => { setEditingBook(null); setIsBookModalOpen(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-900/15 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Book</span>
              </button>
            ) : (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>BookShelf • Personal Library & Reading Progress Tracker</p>
      </footer>

      {/* Add / Edit Book Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBookForDetails}
        isOpen={Boolean(selectedBookForDetails)}
        onClose={() => setSelectedBookForDetails(null)}
        onEdit={handleOpenEdit}
        onDelete={(id, title) => setDeleteConfirmation({ id, title })}
        onToggleFavorite={handleToggleFavorite}
        onUpdateProgress={handleUpdateProgress}
        onUpdateStatus={handleUpdateStatus}
        onReturnBook={handleReturnBook}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        books={books}
        onUpdateLibrary={(newBooks) => setBooks(newBooks)}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900 mb-1">
              Remove Book?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to remove <span className="font-semibold text-slate-800">"{deleteConfirmation.title}"</span> from your shelf? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
