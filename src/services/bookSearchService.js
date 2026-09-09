/**
 * Service to look up book details from Open Library and Google Books API
 */
export const searchBooksOnline = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    // 1. Try Google Books API first (rich covers, page counts, authors)
    const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6`);
    if (googleRes.ok) {
      const data = await googleRes.json();
      if (data.items && data.items.length > 0) {
        return data.items.map(item => {
          const info = item.volumeInfo || {};
          let coverUrl = '';
          if (info.imageLinks) {
            coverUrl = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || '';
            // Ensure https
            if (coverUrl.startsWith('http://')) {
              coverUrl = coverUrl.replace('http://', 'https://');
            }
          }

          // Best guess genre
          const category = (info.categories && info.categories[0]) || '';
          
          return {
            id: item.id,
            title: info.title || '',
            author: (info.authors && info.authors.join(', ')) || 'Unknown Author',
            pages: info.pageCount || 0,
            genre: mapCategoryToGenre(category),
            description: info.description || '',
            coverUrl: coverUrl,
            publishedDate: info.publishedDate || '',
            publisher: info.publisher || '',
            source: 'Google Books'
          };
        });
      }
    }
  } catch (err) {
    console.warn('Google Books fetch failed, attempting Open Library fallback...', err);
  }

  // Fallback: Open Library
  try {
    const olRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
    if (olRes.ok) {
      const olData = await olRes.json();
      if (olData.docs && olData.docs.length > 0) {
        return olData.docs.map(doc => {
          let coverUrl = '';
          if (doc.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
          }
          return {
            id: doc.key,
            title: doc.title,
            author: (doc.author_name && doc.author_name.join(', ')) || 'Unknown Author',
            pages: doc.number_of_pages_median || 0,
            genre: mapCategoryToGenre(doc.subject ? doc.subject[0] : ''),
            description: '',
            coverUrl: coverUrl,
            source: 'Open Library'
          };
        });
      }
    }
  } catch (olErr) {
    console.warn('Open Library search failed too:', olErr);
  }

  return [];
};

function mapCategoryToGenre(rawCategory) {
  if (!rawCategory) return 'Other';
  const cat = rawCategory.toLowerCase();
  if (cat.includes('science fiction') || cat.includes('sci-fi')) return 'Science Fiction';
  if (cat.includes('fantasy')) return 'Fantasy';
  if (cat.includes('fiction') && !cat.includes('non-fiction')) return 'Fiction';
  if (cat.includes('mystery') || cat.includes('thriller') || cat.includes('detective')) return 'Mystery & Thriller';
  if (cat.includes('romance')) return 'Romance';
  if (cat.includes('biography') || cat.includes('memoir') || cat.includes('autobiography')) return 'Biography & Memoir';
  if (cat.includes('history')) return 'History';
  if (cat.includes('psychology')) return 'Psychology';
  if (cat.includes('philosophy')) return 'Philosophy';
  if (cat.includes('self-help') || cat.includes('personal growth')) return 'Self-Help';
  if (cat.includes('technology') || cat.includes('computers') || cat.includes('software')) return 'Technology';
  if (cat.includes('business') || cat.includes('economics')) return 'Business & Economics';
  return 'Other';
}
