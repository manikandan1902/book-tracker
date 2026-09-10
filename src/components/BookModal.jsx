import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, BookOpen, Star, Loader2, Image, Check, Users, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { GENRE_OPTIONS, FORMAT_OPTIONS } from '../data/initialBooks';
import { searchBooksOnline } from '../services/bookSearchService';

export default function BookModal({
  isOpen,
  onClose,
  onSave,
  editingBook = null
}) {
  const isEditing = Boolean(editingBook);

  const [activeTab, setActiveTab] = useState(isEditing ? 'manual' : 'search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    format: 'Paperback',
    status: 'want-to-read',
    pages: 300,
    currentPage: 0,
    rating: 0,
    coverUrl: '',
    notes: '',
    favorite: false,
    startDate: '',
    finishDate: '',
    loanStatus: 'none', // 'none' | 'lent' | 'borrowed'
    friendName: '',
    loanDate: '',
    dueDate: '',
    loanNotes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author || '',
        genre: editingBook.genre || 'Fiction',
        format: editingBook.format || 'Paperback',
        status: editingBook.status || 'want-to-read',
        pages: editingBook.pages ?? 300,
        currentPage: editingBook.currentPage ?? 0,
        rating: editingBook.rating ?? 0,
        coverUrl: editingBook.coverUrl || '',
        notes: editingBook.notes || '',
        favorite: Boolean(editingBook.favorite),
        startDate: editingBook.startDate || '',
        finishDate: editingBook.finishDate || '',
        loanStatus: editingBook.loanStatus || 'none',
        friendName: editingBook.friendName || '',
        loanDate: editingBook.loanDate || '',
        dueDate: editingBook.dueDate || '',
        loanNotes: editingBook.loanNotes || ''
      });
      setActiveTab('manual');
    } else {
      setFormData({
        title: '',
        author: '',
        genre: 'Fiction',
        format: 'Paperback',
        status: 'want-to-read',
        pages: 300,
        currentPage: 0,
        rating: 0,
        coverUrl: '',
        notes: '',
        favorite: false,
        startDate: '',
        finishDate: '',
        loanStatus: 'none',
        friendName: '',
        loanDate: '',
        dueDate: '',
        loanNotes: ''
      });
      setActiveTab('search');
    }
    setErrors({});
    setSearchResults([]);
    setSearchQuery('');
    setSearchError('');
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleOnlineSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchError('');
    try {
      const results = await searchBooksOnline(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError('No matching books found. You can add it manually below!');
      }
    } catch (err) {
      setSearchError('Failed to search online. Please check internet or use manual entry.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    setFormData((prev) => ({
      ...prev,
      title: result.title || prev.title,
      author: result.author || prev.author,
      genre: result.genre || prev.genre,
      pages: result.pages || prev.pages || 300,
      coverUrl: result.coverUrl || prev.coverUrl,
      notes: result.description ? result.description.slice(0, 300) + '...' : prev.notes
    }));
    setActiveTab('manual');
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Book title is required';
    if (!formData.author.trim()) errs.author = 'Author name is required';
    if (formData.pages < 1) errs.pages = 'Pages must be at least 1';
    if (formData.currentPage < 0) errs.currentPage = 'Current page cannot be negative';
    if (formData.currentPage > formData.pages) {
      errs.currentPage = 'Current page cannot exceed total pages';
    }
    if (formData.loanStatus !== 'none' && !formData.friendName.trim()) {
      errs.friendName = "Friend's name is required when book is lent or borrowed";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Auto-update status if finished
    let currentStatus = formData.status;
    let finishDate = formData.finishDate;
    if (formData.currentPage >= formData.pages && formData.pages > 0) {
      currentStatus = 'completed';
      if (!finishDate) {
        finishDate = new Date().toISOString().split('T')[0];
      }
    }

    onSave({
      ...formData,
      status: currentStatus,
      finishDate,
      id: editingBook ? editingBook.id : `book-${Date.now()}`,
      createdAt: editingBook ? editingBook.createdAt : new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900">
                {isEditing ? 'Edit Book Details' : 'Add New Book to Library'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? 'Update reading progress or metadata' : 'Search online or fill in details manually'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Only when adding new) */}
        {!isEditing && (
          <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50/50">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'search'
                  ? 'border-amber-800 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Smart Search (Auto-fill)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`pb-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'manual'
                  ? 'border-amber-800 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Manual Entry</span>
            </button>
          </div>
        )}

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Smart Search View */}
          {activeTab === 'search' && !isEditing && (
            <div className="space-y-4">
              <form onSubmit={handleOnlineSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN (e.g. Sapiens, Project Hail Mary)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search</span>
                </button>
              </form>

              {searchError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                  <span>{searchError}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual')}
                    className="underline font-semibold ml-2 hover:text-amber-950"
                  >
                    Enter Manually
                  </button>
                </div>
              )}

              {/* Search Results List */}
              <div className="space-y-2.5 mt-2">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-500/60 hover:bg-amber-50/30 cursor-pointer flex gap-3.5 transition-all group"
                  >
                    <div className="w-12 h-16 bg-slate-100 rounded overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                      {item.coverUrl ? (
                        <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-sm text-slate-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        by {item.author}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                          {item.genre}
                        </span>
                        {item.pages > 0 && <span>{item.pages} pages</span>}
                        <span className="text-amber-700 font-medium ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Use This Book →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {searchResults.length === 0 && !isSearching && !searchError && (
                  <div className="text-center py-8 text-slate-400">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">Search for any published book to auto-populate covers and details</p>
                    <p className="text-xs text-slate-400 mt-1">Or click "Manual Entry" above to add your own custom details</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manual Entry / Full Form */}
          {(activeTab === 'manual' || isEditing) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Book Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Sapiens: A Brief History of Humankind"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                  {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Author <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Yuval Noah Harari"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                  {errors.author && <p className="text-rose-500 text-xs mt-1">{errors.author}</p>}
                </div>
              </div>

              {/* Genre, Format & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Genre / Category
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    {GENRE_OPTIONS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    {FORMAT_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Reading Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
              </div>

              {/* Pages & Current Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/70">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                  {errors.pages && <p className="text-rose-500 text-xs mt-1">{errors.pages}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Pages Read So Far
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.pages}
                    value={formData.currentPage}
                    onChange={(e) => setFormData({ ...formData, currentPage: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                  {errors.currentPage && <p className="text-rose-500 text-xs mt-1">{errors.currentPage}</p>}
                </div>
              </div>

              {/* Rating & Favorite */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star === formData.rating ? 0 : star })}
                        className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    {formData.rating > 0 && (
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {formData.rating} / 5 Stars
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.favorite}
                      onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-800 focus:ring-amber-500 border-slate-300"
                    />
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      <Star className={`w-3.5 h-3.5 ${formData.favorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      Mark as Favorite
                    </span>
                  </label>
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Image URL (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                  {formData.coverUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Reading Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Finished Date
                  </label>
                  <input
                    type="date"
                    value={formData.finishDate}
                    onChange={(e) => setFormData({ ...formData, finishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Lending & Borrowing Tracker Section */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-slate-200/90 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span>Lending & Borrowing Tracker</span>
                </div>
                
                {/* Loan Status Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, loanStatus: 'none', friendName: '', loanDate: '', dueDate: '', loanNotes: '' })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      formData.loanStatus === 'none'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>In Library</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      loanStatus: 'lent', 
                      loanDate: formData.loanDate || new Date().toISOString().split('T')[0] 
                    })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      formData.loanStatus === 'lent'
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Lent to Friend</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      loanStatus: 'borrowed', 
                      loanDate: formData.loanDate || new Date().toISOString().split('T')[0] 
                    })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      formData.loanStatus === 'borrowed'
                        ? 'bg-indigo-800 text-white border-indigo-800 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Borrowed</span>
                  </button>
                </div>

                {formData.loanStatus !== 'none' && (
                  <div className="pt-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          {formData.loanStatus === 'lent' ? 'Friend Lent To' : 'Friend Borrowed From'} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.friendName}
                          onChange={(e) => setFormData({ ...formData, friendName: e.target.value })}
                          placeholder="e.g. Sarah Jenkins, Rahul"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                        />
                        {errors.friendName && <p className="text-rose-500 text-xs mt-1">{errors.friendName}</p>}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Date {formData.loanStatus === 'lent' ? 'Lent' : 'Borrowed'}
                        </label>
                        <input
                          type="date"
                          value={formData.loanDate}
                          onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Expected Return Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Loan Note (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.loanNotes}
                          onChange={(e) => setFormData({ ...formData, loanNotes: e.target.value })}
                          placeholder="e.g. Lent for book club, return after exams"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Notes & Key Takeaways */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Personal Notes / Review / Favorite Quotes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Key thoughts, memorable quotes, or reading review..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-amber-900/15 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Add to Shelf'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
