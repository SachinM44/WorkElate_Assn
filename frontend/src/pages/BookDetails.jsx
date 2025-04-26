import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
export default function BookDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    axios.get(`/books/${id}`).then(res => setBook(res.data));
    axios.get(`/reviews?bookId=${id}`).then(res => setReviews(res.data));
  }, [id]);

  const submitReview = async () => {
    await axios.post('/reviews', { bookId: id, rating, comment }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = await axios.get(`/reviews?bookId=${id}`);
    setReviews(updated.data);
    setRating(0);
    setComment('');
  };

  return (
    <div className="p-6">
      {book && (
        <>
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="text-gray-600">{book.author}</p>
          <p>{book.description}</p>
        </>
      )}
      <hr className="my-6" />
      <h2 className="text-xl font-semibold mb-2">Reviews</h2>
      <ul className="space-y-2 mb-4">
        {reviews.map(r => (
          <li key={r._id} className="border p-3 rounded">
            <strong>{r.userId.username}</strong>: {r.comment} ({r.rating}/5)
          </li>
        ))}
      </ul>
      {token && (
        <div className="space-y-2">
          <h3 className="font-semibold">Add a Review</h3>
          <input
            type="number"
            value={rating}
            onChange={e => setRating(e.target.value)}
            className="border p-2 w-full"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
          />
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="border p-2 w-full"
            placeholder="Comment"
          />
          <button onClick={submitReview} className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}
