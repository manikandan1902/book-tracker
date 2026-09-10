import React from 'react';
import { Star, BookOpen, MoreVertical, Edit2, Trash2, Plus, Minus, CheckCircle, ExternalLink, ArrowUpRight, ArrowDownLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { STATUS_CONFIG } from '../data/initialBooks';

export default function BookCard({
  book,
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onQuickPageUpdate,
  onReturnBook
}) {
  const percent = book.pages > 0 ? Math.min(100, Math.round((book.currentPage / book.pages) * 100)) : 0;
  const statusInfo = STATUS_CONFIG[book.status] || STATUS_CONFIG['want-to-read'];
  const isOverdue = Boolean(
    book.loanStatus !== 'none' && 
    book.dueDate && 
    new Date(book.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Banner / Book Cover Preview */}
      <div 
        onClick={() => onOpenDetails(book)}
        className="relative h-56 bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback Cover */}
        <div 
          className={`w-full h-full p-5 flex flex-col justify-between items-center text-center bg-gradient-to-br from-amber-800 to-slate-900 text-white book-spine-effect ${book.coverUrl ? 'hidden' : 'flex'}`}
        >
          <div className="text-[10px] uppercase tracking-widest text-amber-200/80 font-medium">
            {book.genre || 'Book'}
          </div>
          <div>
            <BookOpen className="w-8 h-8 mx-auto text-amber-300/80 mb-2" />
            <div className="font-serif font-bold text-base line-clamp-2 px-2 text-amber-50">
              {book.title}
            </div>
            <div className="text-xs text-slate-300 mt-1 line-clamp-1">
              {book.author}
            </div>
          </div>
          <div className="text-[10px] text-slate-400">
            {book.format} • {book.pages} pages
          </div>
        </div>

        {/* Loan Pill Badge */}
        {book.loanStatus !== 'none' && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs flex items-center gap-1 z-10 ${
            book.loanStatus === 'lent'
              ? isOverdue ? 'bg-rose-600 text-white' : 'bg-amber-700 text-white'
              : isOverdue ? 'bg-rose-600 text-white' : 'bg-indigo-700 text-white'
          }`}>
            {book.loanStatus === 'lent' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
            <span>{book.loanStatus === 'lent' ? 'Lent' : 'Borrowed'}</span>
            {isOverdue && <span className="font-extrabold ml-0.5">• Overdue</span>}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-400 hover:text-amber-500 shadow-sm backdrop-blur-xs transition-colors"
          title={book.favorite ? "Remove from favorites" : "Mark as favorite"}
        >
          <Star
            className={`w-4 h-4 ${book.favorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`}
          />
        </button>

        {/* Format Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-slate-100 text-[10px] font-medium uppercase tracking-wider">
          {book.format}
        </div>
      </div>

      {/* Book Information Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status Badge & Genre */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="text-[11px] font-medium text-slate-400 truncate">
              {book.genre}
            </span>
          </div>

          {/* Book Title */}
          <h3 
            onClick={() => onOpenDetails(book)}
            className="font-serif font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            by <span className="text-slate-700 font-medium">{book.author}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= book.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
            {book.rating > 0 && (
              <span className="text-xs font-semibold text-slate-600 ml-1">
                {book.rating}.0
              </span>
            )}
          </div>

          {/* Lending & Borrowing Box */}
          {book.loanStatus !== 'none' && (
            <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center justify-between border ${
              book.loanStatus === 'lent'
                ? isOverdue ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-amber-50/80 border-amber-200 text-amber-950'
                : isOverdue ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
            }`}>
              <div className="min-w-0 flex-1 mr-2">
                <div className="flex items-center gap-1.5 font-semibold truncate">
                  {book.loanStatus === 'lent' ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  ) : (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                  )}
                  <span className="truncate">
                    {book.loanStatus === 'lent' ? `Lent to ${book.friendName}` : `Borrowed from ${book.friendName}`}
                  </span>
                </div>
                {book.dueDate && (
                  <div className="text-[10px] text-slate-500 pl-5">
                    Due: <span className={isOverdue ? "text-rose-600 font-bold" : "text-slate-700"}>{book.dueDate}</span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReturnBook(book.id);
                }}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1 transition-colors"
                title="Mark book as returned"
              >
                <RotateCcw className="w-3 h-3 text-amber-800" />
                <span>Return</span>
              </button>
            </div>
          )}
        </div>

        {/* Progress & Quick Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {/* Progress Bar for Currently Reading */}
          {book.status === 'reading' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span>Progress</span>
                <span className="font-semibold text-slate-700">
                  {book.currentPage} / {book.pages} p. ({percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              {/* Quick +10 / -10 page buttons */}
              <div className="flex items-center justify-between mt-2 pt-1">
                <span className="text-[10px] text-slate-400">Quick page update:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onQuickPageUpdate(book.id, -10)}
                    disabled={book.currentPage <= 0}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 text-xs transition-colors"
                    title="-10 pages"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onQuickPageUpdate(book.id, 10)}
                    disabled={book.currentPage >= book.pages}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 text-xs transition-colors"
                    title="+10 pages"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If completed */}
          {book.status === 'completed' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-2">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Finished ({book.pages} pages)</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <button
              onClick={() => onOpenDetails(book)}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Details</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(book)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Edit book"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(book.id, book.title)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete book"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
