import express from 'express';
const router = express.Router();
import { Book, Review, User } from '../DB/schema.js'; // Import models
import { auth } from '../auth/middleware.js'; // Import auth middleware

// Get reviews for a book
router.get('/', async (req, res) => {
  const { bookId } = req.query;
  if (!bookId) return res.status(400).json({ message: 'bookId is required' });

  const reviews = await Review.find({ bookId }).populate('userId', 'username');
  res.json(reviews);
});

// Submit a new review
router.post('/', auth, async (req, res) => {
  const { bookId, rating, comment } = req.body;
  if (!bookId || !rating)
    return res.status(400).json({ message: 'bookId and rating are required' });

  // Ensure req.user._id is available from the auth middleware
  const review = await Review.create({
    bookId,
    userId: req.user.id,
    rating,
    comment
  });
  res.status(201).json(review);
});

export default router;
