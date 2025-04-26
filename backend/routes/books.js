import express from 'express';
const router = express.Router();
import { Book, Review, User } from '../DB/schema.js'; // Import models
import { auth } from '../auth/middleware.js'; // Import auth middleware

// Get all books (with pagination)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Default page 1 and limit 10
  const books = await Book.find()
    .skip((page - 1) * limit)
    .limit(limit);
  res.json(books);
});

// Get book details by ID
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Add a new book (admin only)
router.post('/', auth, async (req, res) => {
  const { title, author, description, genre } = req.body;
  if (!title || !author || !description || !genre)
    return res.status(400).json({ message: 'All fields are required' });

  const book = await Book.create(req.body);
  res.status(201).json(book);
});

export default router;
