# 📚 BookShelf - Personal Library & Reading Tracker

A modern, fast, and responsive web application to organize, track, and maintain your collection of books.

🌐 **Live Web Application**: [https://manikandan1902.github.io/book-tracker/](https://manikandan1902.github.io/book-tracker/)

![BookShelf Overview](https://images.unsplash.com/photo-1507842229452-9b55265691db?auto=format&fit=crop&q=80&w=800)

## ✨ Features

- **Book Cataloging**:
  - Add books with Title, Author, Genre, Format (Paperback, Hardcover, E-book, Audiobook), Status, Rating, Total Pages, and Personal Notes.
  - **Smart Online Auto-Fill**: Search any published book via the integrated Open Library / Google Books API to autofill title, author, description, page count, and cover image with one click.
  - **Manual Entry**: Full support for custom or unlisted books.
- **Organization & Shelves**:
  - Organize by reading status: *Want to Read*, *Currently Reading*, *Completed*, *On Hold*, and *Dropped*.
  - Filter by status tabs, genre, format, or favorites.
  - Search instantly across book titles, authors, genres, and notes.
  - Multi-attribute sorting: Recently added, Title (A-Z), Author (A-Z), Rating, Reading progress %, and Page count.
- **Reading Progress & Goal Tracking**:
  - Live visual progress bars and percentage calculators.
  - Quick `+10` / `-10` page increment buttons directly on book cards.
  - Reading progress slider in book details view.
  - Set and edit an Annual Reading Goal with completion percentage.
  - Overview metrics: Total books, books reading now, completed, total pages read, and average rating.
- **Dual View Options**:
  - **Card View**: Visual gallery showcasing book covers, progress bars, and ratings.
  - **Table View**: Compact, high-density spreadsheet-like view for quickly editing statuses.
- **Offline-First & Data Portability**:
  - All data is saved automatically to your browser's `localStorage` (no server or database setup required).
  - **Export to JSON**: Complete backup file you can store or move to another machine.
  - **Export to CSV**: Formatted for Excel or Google Sheets.
  - **Import JSON**: Restore your entire library anytime.
  - Pre-loaded with curated sample books to explore right away.

---

## 🚀 How to Run the App

### 1. Start the Development Server
Open PowerShell or Command Prompt in the `book-tracker` directory and run:

```bash
npm run dev
```

The app will start at `http://localhost:3000` and automatically open in your default browser.

### 2. Build for Production
To generate an optimized static build:

```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework**: React 18
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS with custom book spine textures & typography
- **Icons**: Lucide React
- **Persistence**: LocalStorage with JSON/CSV export & import helpers
