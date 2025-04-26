import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
React
export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-center">Loading books...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📚 All Books</h1>

      {books.length === 0 ? (
        <p className="text-gray-500">No books available. Please add some via Postman or database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map(book => (
            <Link to={`/books/${book._id}`} key={book._id} className="p-4 border rounded shadow hover:bg-gray-50">
              <h2 className="font-bold text-lg">{book.title}</h2>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-sm">{book.genre}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
