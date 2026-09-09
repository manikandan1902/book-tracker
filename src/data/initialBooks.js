export const INITIAL_BOOKS = [
  {
    id: 'book-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    status: 'reading', // 'want-to-read' | 'reading' | 'completed' | 'on-hold' | 'dropped'
    format: 'Paperback', // 'Hardcover' | 'Paperback' | 'E-book' | 'Audiobook'
    pages: 320,
    currentPage: 185,
    rating: 5,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    notes: 'Incredible insights on compounding 1% improvements every day. Focus on identity rather than goals.',
    favorite: true,
    startDate: '2026-08-15',
    finishDate: '',
    createdAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'book-2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    status: 'completed',
    format: 'Hardcover',
    pages: 496,
    currentPage: 496,
    rating: 5,
    coverUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=400',
    notes: 'One of the best sci-fi novels ever! Rocky is the absolute best companion character.',
    favorite: true,
    startDate: '2026-07-01',
    finishDate: '2026-07-12',
    createdAt: '2026-07-01T14:30:00.000Z'
  },
  {
    id: 'book-3',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'Technology',
    status: 'reading',
    format: 'E-book',
    pages: 616,
    currentPage: 240,
    rating: 5,
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
    notes: 'The bible of distributed systems. Chapter 7 on transactions and isolation levels is brilliant.',
    favorite: false,
    startDate: '2026-08-20',
    finishDate: '',
    createdAt: '2026-08-20T09:15:00.000Z'
  },
  {
    id: 'book-4',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Literary Fiction',
    status: 'want-to-read',
    format: 'Paperback',
    pages: 303,
    currentPage: 0,
    rating: 0,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    notes: 'Recommended by a friend who loved Never Let Me Go.',
    favorite: false,
    startDate: '',
    finishDate: '',
    createdAt: '2026-09-01T18:00:00.000Z'
  },
  {
    id: 'book-5',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Psychology',
    status: 'completed',
    format: 'Paperback',
    pages: 499,
    currentPage: 499,
    rating: 4,
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    notes: 'System 1 vs System 2 thinking, heuristics, cognitive biases. Dense but deeply thought-provoking.',
    favorite: false,
    startDate: '2026-05-10',
    finishDate: '2026-06-05',
    createdAt: '2026-05-10T11:20:00.000Z'
  },
  {
    id: 'book-6',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    status: 'want-to-read',
    format: 'Hardcover',
    pages: 688,
    currentPage: 0,
    rating: 0,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
    notes: 'Need to read the classic before rewatching the film adaptation.',
    favorite: true,
    startDate: '',
    finishDate: '',
    createdAt: '2026-09-05T12:00:00.000Z'
  }
];

export const GENRE_OPTIONS = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery & Thriller',
  'Romance',
  'Biography & Memoir',
  'History',
  'Self-Help',
  'Psychology',
  'Philosophy',
  'Technology',
  'Business & Economics',
  'Literary Fiction',
  'Poetry',
  'Other'
];

export const STATUS_CONFIG = {
  'all': { label: 'All Books', color: 'bg-slate-100 text-slate-700' },
  'reading': { label: 'Currently Reading', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  'want-to-read': { label: 'Want to Read', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'completed': { label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  'on-hold': { label: 'On Hold', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'dropped': { label: 'Dropped', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};

export const FORMAT_OPTIONS = [
  'Paperback',
  'Hardcover',
  'E-book',
  'Audiobook'
];
