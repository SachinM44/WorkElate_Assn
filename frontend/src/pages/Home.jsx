import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const location = useLocation();
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookRatings, setBookRatings] = useState({});

  // This useEffect will respond to location changes including state changes
  useEffect(() => {
    setPage(1);
    setBooks([]);
    fetchBooks();
    // Added location.state dependency to ensure refresh when coming from AddBook
  }, [location.key, location.state?.refresh]);

  useEffect(() => {
    if (page > 1) {
      fetchBooks();
    }
  }, [page]);

  const fetchBooks = async () => {
    try {
      setLoadingMore(true);
      
      const res = await axios.get(`/books?page=${page}&limit=9`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    
      const { books = [], total = 0, totalPages = 0 } = res.data;
      
      setBooks(prev => page === 1 ? books : [...prev, ...books]);
      setTotalPages(totalPages);
      
      if (books.length > 0) {
        const uniqueGenres = [...new Set(books.map(book => book.genre))];
        setGenres(prev => [...new Set([...prev, ...uniqueGenres])]);
        
        // Fetch ratings for new books
        fetchBookRatings(books.map(book => book._id));
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  // Fetch average ratings for books
  const fetchBookRatings = async (bookIds) => {
    try {
      // Fetch ratings for each book if they're not already fetched
      const missingRatingIds = bookIds.filter(id => !bookRatings[id]);
      
      if (missingRatingIds.length > 0) {
        const promises = missingRatingIds.map(bookId => 
          axios.get(`/reviews?bookId=${bookId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        const results = await Promise.all(promises);
        
        const newRatings = {};
        results.forEach((result, index) => {
          const bookId = missingRatingIds[index];
          const reviews = result.data;
          if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            newRatings[bookId] = Math.round(avgRating * 10) / 10; // Round to 1 decimal
          } else {
            newRatings[bookId] = 0;
          }
        });
        
        setBookRatings(prev => ({ ...prev, ...newRatings }));
      }
    } catch (err) {
      // Silently handle errors with ratings
    }
  };

  const filteredBooks = books?.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  }) || [];

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Generate star rating HTML
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return (
      <div className="flex items-center">
        {stars}
        {rating > 0 && <span className="ml-1 text-sm text-gray-600">({rating})</span>}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📚 Featured Books</h1>
      </div>

      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-48 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
          <button 
            onClick={fetchBooks}
            className="ml-4 text-sm underline hover:text-red-600"
          >
            Try Again
          </button>
        </div>
      )}

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">
            {searchTerm || selectedGenre ? 'No books match your search criteria.' : 'No books available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <Link 
              to={`/books/${book._id}`} 
              key={book._id} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <div className="flex justify-between items-center mb-3">
                  <div className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    {book.genre}
                  </div>
                  <div>
                    {renderStars(bookRatings[book._id])}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {page < totalPages && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={loadingMore}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : 'Load More Books'}
          </button>
        </div>
      )}
    </div>
  );
}
