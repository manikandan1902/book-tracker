import React, { useState } from 'react';
import { X, Star, Calendar, BookOpen, Edit2, Trash2, CheckCircle2, Bookmark, ArrowRight, Share2, Plus, Minus } from 'lucide-react';
import { STATUS_CONFIG } from '../data/initialBooks';

export default function BookDetailsModal({
  book,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateProgress,
  onUpdateStatus
}) {
  if (!isOpen || !book) return null;

  const [currentPagesRead, setCurrentPagesRead] = useState(book.currentPage || 0);
  const statusInfo = STATUS_CONFIG[book.status] || STATUS_CONFIG['want-to-read'];
  const percent = book.pages > 0 ? Math.min(100, Math.round((currentPagesRead / book.pages) * 100)) : 0;

  const handleApplyProgress = (newPages) => {
    const clamped = Math.max(0, Math.min(book.pages, newPages));
    setCurrentPagesRead(clamped);
    onUpdateProgress(book.id, clamped);
  };

  const handleMarkAsCompleted = () => {
    handleApplyProgress(book.pages);
    onUpdateStatus(book.id, 'completed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {book.format} • {book.genre}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(book.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-200/50 transition-colors"
              title={book.favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${book.favorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={() => { onClose(); onEdit(book); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
              title="Edit book"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { onClose(); onDelete(book.id, book.title); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top Info Hero */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Book Cover */}
            <div className="w-36 h-52 shrink-0 bg-slate-100 rounded-xl overflow-hidden shadow-book border border-slate-200 flex items-center justify-center relative">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div className={`w-full h-full bg-gradient-to-br from-amber-800 to-slate-900 text-white p-3 flex flex-col justify-between items-center text-center book-spine-effect ${book.coverUrl ? 'hidden' : 'flex'}`}>
                <div className="text-[9px] uppercase tracking-wider text-amber-200">{book.genre}</div>
                <div className="font-serif font-bold text-xs">{book.title}</div>
                <div className="text-[10px] text-slate-300">{book.author}</div>
              </div>
            </div>

            {/* Title, Author & Meta */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-serif font-bold text-2xl text-slate-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                by <span className="text-slate-900 font-semibold">{book.author}</span>
              </p>

              {/* Star Rating Display */}
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= book.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-slate-600 ml-1.5">
                  {book.rating > 0 ? `${book.rating}.0 / 5.0` : 'Unrated'}
                </span>
              </div>

              {/* Dates & Details */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-slate-600 bg-[#FAF8F5] p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Length</span>
                  <span className="font-medium text-slate-800">{book.pages} pages</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Format</span>
                  <span className="font-medium text-slate-800">{book.format}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Started</span>
                  <span className="font-medium text-slate-800">{book.startDate || 'Not recorded'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Finished</span>
                  <span className="font-medium text-slate-800">{book.finishDate || (book.status === 'completed' ? 'Finished' : 'In progress')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Reading Progress Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Reading Progress
                </span>
              </div>
              <span className="text-sm font-bold text-amber-900">
                {currentPagesRead} of {book.pages} pages ({percent}%)
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max={book.pages}
              value={currentPagesRead}
              onChange={(e) => handleApplyProgress(parseInt(e.target.value, 10))}
              className="w-full accent-amber-800 cursor-pointer"
            />

            {/* Quick buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500">Quick adjust:</span>
                <button
                  onClick={() => handleApplyProgress(currentPagesRead - 10)}
                  disabled={currentPagesRead <= 0}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                >
                  -10 p.
                </button>
                <button
                  onClick={() => handleApplyProgress(currentPagesRead + 10)}
                  disabled={currentPagesRead >= book.pages}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                >
                  +10 p.
                </button>
                <button
                  onClick={() => handleApplyProgress(currentPagesRead + 25)}
                  disabled={currentPagesRead >= book.pages}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                >
                  +25 p.
                </button>
              </div>

              {book.status !== 'completed' && (
                <button
                  onClick={handleMarkAsCompleted}
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Finished</span>
                </button>
              )}
            </div>
          </div>

          {/* Notes & Key Takeaways */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Personal Notes & Quotes
            </h4>
            {book.notes ? (
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap font-serif leading-relaxed italic">
                "{book.notes}"
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No notes or thoughts recorded yet. Click Edit to add some!</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-[#FAF8F5] border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
