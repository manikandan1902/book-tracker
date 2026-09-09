import React from 'react';
import { Star, Edit2, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { STATUS_CONFIG } from '../data/initialBooks';

export default function BookTable({
  books,
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateStatus
}) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-[#FAF8F5] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Fav</th>
              <th className="py-3 px-4 w-16">Cover</th>
              <th className="py-3 px-4">Book & Author</th>
              <th className="py-3 px-4">Genre / Format</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map((book) => {
              const statusInfo = STATUS_CONFIG[book.status] || STATUS_CONFIG['want-to-read'];
              const percent = book.pages > 0 ? Math.min(100, Math.round((book.currentPage / book.pages) * 100)) : 0;

              return (
                <tr 
                  key={book.id} 
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Favorite */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleFavorite(book.id)}
                      className="text-slate-300 hover:text-amber-500 transition-colors"
                      title={book.favorite ? "Remove favorite" : "Add to favorites"}
                    >
                      <Star className={`w-4 h-4 mx-auto ${book.favorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </td>

                  {/* Cover */}
                  <td className="py-3 px-4">
                    <div 
                      onClick={() => onOpenDetails(book)}
                      className="w-10 h-14 bg-slate-100 rounded-md overflow-hidden shadow-xs cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/60"
                    >
                      {book.coverUrl ? (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-slate-800 text-amber-100 flex items-center justify-center text-[9px] font-bold ${book.coverUrl ? 'hidden' : 'flex'}`}>
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </td>

                  {/* Title & Author */}
                  <td className="py-3 px-4 max-w-xs">
                    <div 
                      onClick={() => onOpenDetails(book)}
                      className="font-serif font-bold text-slate-900 hover:text-amber-800 cursor-pointer line-clamp-1"
                      title={book.title}
                    >
                      {book.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {book.author}
                    </div>
                  </td>

                  {/* Genre / Format */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="text-xs font-medium text-slate-700">{book.genre}</div>
                    <div className="text-[11px] text-slate-400">{book.format}</div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <select
                      value={book.status}
                      onChange={(e) => onUpdateStatus(book.id, e.target.value)}
                      aria-label={`Status for ${book.title}`}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${statusInfo.color}`}
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="dropped">Dropped</option>
                    </select>
                  </td>

                  {/* Progress */}
                  <td className="py-3 px-4 whitespace-nowrap min-w-[140px]">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                      <span>{book.currentPage} / {book.pages} p.</span>
                      <span className="font-medium text-slate-800">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= book.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onOpenDetails(book)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
