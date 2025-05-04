import mongoose from 'mongoose';

// User Schema with email unique constraint
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    default: 'user',
    enum: ['user']
  }
});

export const User = mongoose.model('User', userSchema);

// Book Schema with validation
const bookSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true,
    trim: true
  },
  author: { 
    type: String,
    required: true,
    trim: true
  },
  description: { 
    type: String,
    required: true
  },
  genre: { 
    type: String,
    required: true,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Book = mongoose.model('Book', bookSchema);

// Review Schema with validation
const reviewSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book',
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  rating: { 
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: { 
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Review = mongoose.model('Review', reviewSchema);
