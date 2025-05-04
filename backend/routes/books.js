import express from 'express';
const router = express.Router();
import { Book, Review, User } from '../DB/schema.js';
import { auth } from '../auth/middleware.js';

// Get all books (with pagination)
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching books for user:', req.user.id);
    const { page = 1, limit = 9 } = req.query;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Book.countDocuments()
    ]);

    console.log(`Found ${books.length} books`);
    res.json({
      books,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Get book details by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

// Add a new book
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, description, genre } = req.body;
    if (!title || !author || !description || !genre) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const book = await Book.create({
      ...req.body,
      createdAt: new Date()
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
});

export default router;
