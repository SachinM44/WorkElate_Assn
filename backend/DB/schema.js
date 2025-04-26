import mongoose from 'mongoose';

// User Schema with email unique constraint
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },  // Ensure email is unique
  password: String,
  role: { type: String, default: 'user' }
});
export const User = mongoose.model('User', userSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  genre: String
});
export const Book = mongoose.model('Book', bookSchema);

// Review Schema with references to Book and User
const reviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String
});
export const Review = mongoose.model('Review', reviewSchema);
