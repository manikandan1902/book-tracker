import React, { useState } from 'react';
import { BookOpen, CheckCircle, Bookmark, Flame, Star, ChevronDown, ChevronUp, Target, Users, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';

export default function StatsDashboard({ books, annualGoal = 20, onUpdateGoal }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(annualGoal);

  const total = books.length;
  const reading = books.filter(b => b.status === 'reading').length;
  const wantToRead = books.filter(b => b.status === 'want-to-read').length;
  const completed = books.filter(b => b.status === 'completed').length;
  const lentCount = books.filter(b => b.loanStatus === 'lent').length;
  const borrowedCount = books.filter(b => b.loanStatus === 'borrowed').length;
  const overdueCount = books.filter(b => 
    b.loanStatus !== 'none' && 
    b.dueDate && 
    new Date(b.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
  ).length;

  const totalPagesRead = books.reduce((acc, b) => {
    if (b.status === 'completed') {
      return acc + (b.pages || 0);
    }
    return acc + (b.currentPage || 0);
  }, 0);

  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0 
    ? (ratedBooks.reduce((acc, b) => acc + b.rating, 0) / ratedBooks.length).toFixed(1)
    : '0.0';

  const goalProgress = annualGoal > 0 ? Math.min(100, Math.round((completed / annualGoal) * 100)) : 0;

  const handleSaveGoal = () => {
    const num = parseInt(tempGoal, 10);
    if (!isNaN(num) && num > 0) {
      onUpdateGoal(num);
    }
    setIsEditingGoal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-600" />
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Reading Overview & Statistics
          </h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>Hide <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Show <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 pt-1">
          {/* Total Books */}
          <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Total Books</span>
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">{total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">in your library</div>
          </div>

          {/* Currently Reading */}
          <div className="bg-amber-50/50 rounded-xl p-3.5 border border-amber-200/60">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-medium mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Reading Now</span>
            </div>
            <div className="text-2xl font-bold font-serif text-amber-900">{reading}</div>
            <div className="text-[11px] text-amber-700/70 mt-0.5">in progress</div>
          </div>

          {/* Want to Read */}
          <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-200/60">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-medium mb-1">
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>Want to Read</span>
            </div>
            <div className="text-2xl font-bold font-serif text-blue-900">{wantToRead}</div>
            <div className="text-[11px] text-blue-700/70 mt-0.5">on your wishlist</div>
          </div>

          {/* Completed */}
          <div className="bg-emerald-50/50 rounded-xl p-3.5 border border-emerald-200/60">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Finished</span>
            </div>
            <div className="text-2xl font-bold font-serif text-emerald-900">{completed}</div>
            <div className="text-[11px] text-emerald-700/70 mt-0.5">books completed</div>
          </div>

          {/* Pages Read */}
          <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Pages Read</span>
            </div>
            <div className="text-2xl font-bold font-serif text-slate-900">
              {totalPagesRead.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">avg rating {avgRating} ★</div>
          </div>

          {/* Annual Reading Goal */}
          <div className="bg-gradient-to-br from-amber-700/10 to-amber-900/5 rounded-xl p-3.5 border border-amber-300/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-amber-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-800" />
                  <span>Goal: {annualGoal} books</span>
                </span>
                {!isEditingGoal ? (
                  <button 
                    onClick={() => { setTempGoal(annualGoal); setIsEditingGoal(true); }}
                    className="text-[10px] text-amber-800 underline hover:text-amber-950"
                  >
                    edit
                  </button>
                ) : null}
              </div>

              {isEditingGoal ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="w-16 px-1.5 py-0.5 text-xs border border-amber-300 rounded bg-white text-slate-800"
                  />
                  <button
                    onClick={handleSaveGoal}
                    className="px-2 py-0.5 text-xs bg-amber-800 text-white rounded font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="text-2xl font-bold font-serif text-amber-950">
                  {completed} <span className="text-sm font-sans font-normal text-amber-800/80">/ {annualGoal}</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <div className="w-full bg-amber-200/70 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-700 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-amber-800 text-right mt-0.5 font-medium">
                {goalProgress}% achieved
              </div>
            </div>
          </div>

          {/* Lending & Borrowing Card */}
          <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>Loans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-serif text-slate-900 flex items-center gap-0.5" title="Lent Out">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
                  {lentCount}
                </span>
                <span className="text-slate-300 font-light">|</span>
                <span className="text-xl font-bold font-serif text-slate-900 flex items-center gap-0.5" title="Borrowed">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-indigo-700" />
                  {borrowedCount}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 mt-2">
              {overdueCount > 0 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {overdueCount} overdue!
                </span>
              ) : (
                <span className="text-slate-400">
                  {lentCount} lent • {borrowedCount} borrowed
                </span>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
