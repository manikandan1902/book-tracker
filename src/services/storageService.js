import { INITIAL_BOOKS } from '../data/initialBooks';

const STORAGE_KEY = 'bookshelf_library_data_v1';
const PREFS_KEY = 'bookshelf_user_prefs_v1';

export const storageService = {
  getBooks: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
        return INITIAL_BOOKS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading books from localStorage:', e);
      return INITIAL_BOOKS;
    }
  },

  saveBooks: (books) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Error saving books to localStorage:', e);
    }
  },

  getPrefs: () => {
    try {
      const data = localStorage.getItem(PREFS_KEY);
      return data ? JSON.parse(data) : { viewMode: 'grid', sortBy: 'recent', annualGoal: 20 };
    } catch {
      return { viewMode: 'grid', sortBy: 'recent', annualGoal: 20 };
    }
  },

  savePrefs: (prefs) => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving user preferences:', e);
    }
  },

  exportToJSON: (books) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const date = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("download", `my-bookshelf-backup-${date}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportToCSV: (books) => {
    const headers = ['Title', 'Author', 'Genre', 'Status', 'Format', 'Rating', 'Pages', 'CurrentPage', 'StartDate', 'FinishDate', 'Notes'];
    const rows = books.map(b => [
      `"${(b.title || '').replace(/"/g, '""')}"`,
      `"${(b.author || '').replace(/"/g, '""')}"`,
      `"${(b.genre || '').replace(/"/g, '""')}"`,
      `"${(b.status || '').replace(/"/g, '""')}"`,
      `"${(b.format || '').replace(/"/g, '""')}"`,
      b.rating || 0,
      b.pages || 0,
      b.currentPage || 0,
      `"${b.startDate || ''}"`,
      `"${b.finishDate || ''}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `my-bookshelf-${date}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  importFromJSON: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (!Array.isArray(parsed)) {
            throw new Error('Imported JSON file must contain an array of books.');
          }
          // Normalize and ensure ids exist
          const validated = parsed.map((book, idx) => ({
            id: book.id || `imported-${Date.now()}-${idx}`,
            title: book.title || 'Untitled Book',
            author: book.author || 'Unknown Author',
            genre: book.genre || 'Other',
            status: ['reading', 'want-to-read', 'completed', 'on-hold', 'dropped'].includes(book.status) ? book.status : 'want-to-read',
            format: book.format || 'Paperback',
            pages: Number(book.pages) || 0,
            currentPage: Number(book.currentPage) || 0,
            rating: Number(book.rating) || 0,
            coverUrl: book.coverUrl || '',
            notes: book.notes || '',
            favorite: Boolean(book.favorite),
            startDate: book.startDate || '',
            finishDate: book.finishDate || '',
            createdAt: book.createdAt || new Date().toISOString()
          }));
          resolve(validated);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    });
  }
};
