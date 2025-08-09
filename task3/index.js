const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// In-memory books array (simulating database)
let books = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    genre: "Fiction"
  },
  {
    id: "2", 
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genre: "Fiction"
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "Dystopian"
  }
];

// Helper function to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to find book by ID
function findBookById(id) {
  return books.find(book => book.id === id);
}

// Helper function to validate book data
function validateBookData(bookData) {
  const { title, author } = bookData;
  const errors = [];
  
  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!author || author.trim().length === 0) {
    errors.push('Author is required');
  }
  
  return errors;
}

// Routes

// GET /books - Get all books
app.get('/books', (req, res) => {
  try {
    // Optional query parameters for filtering
    const { author, genre, limit } = req.query;
    let filteredBooks = [...books];
    
    // Filter by author if provided
    if (author) {
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    // Filter by genre if provided
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre && book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    // Limit results if provided
    if (limit && !isNaN(limit)) {
      filteredBooks = filteredBooks.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      count: filteredBooks.length,
      data: filteredBooks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /books/:id - Get a specific book by ID
app.get('/books/:id', (req, res) => {
  try {
    const { id } = req.params;
    const book = findBookById(id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
        message: `No book found with ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// POST /books - Add a new book
app.post('/books', (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    
    // Validate required fields
    const validationErrors = validateBookData({ title, author });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        messages: validationErrors
      });
    }
    
    // Create new book object
    const newBook = {
      id: generateId(),
      title: title.trim(),
      author: author.trim(),
      year: year || null,
      genre: genre || null,
      createdAt: new Date().toISOString()
    };
    
    // Add to books array
    books.push(newBook);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// PUT /books/:id - Update a book by ID
app.put('/books/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;
    
    // Find the book
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
        message: `No book found with ID: ${id}`
      });
    }
    
    // Validate at least one field to update
    if (!title && !author && !year && !genre) {
      return res.status(400).json({
        success: false,
        error: 'No data provided',
        message: 'Please provide at least one field to update (title, author, year, or genre)'
      });
    }
    
    // Update the book
    const updatedBook = { ...books[bookIndex] };
    
    if (title) updatedBook.title = title.trim();
    if (author) updatedBook.author = author.trim();
    if (year !== undefined) updatedBook.year = year;
    if (genre !== undefined) updatedBook.genre = genre;
    
    updatedBook.updatedAt = new Date().toISOString();
    
    books[bookIndex] = updatedBook;
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// DELETE /books/:id - Delete a book by ID
app.delete('/books/:id', (req, res) => {
  try {
    const { id } = req.params;
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
        message: `No book found with ID: ${id}`
      });
    }
    
    // Remove the book
    const deletedBook = books.splice(bookIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// DELETE /books - Delete all books (optional endpoint)
app.delete('/books', (req, res) => {
  try {
    const deletedCount = books.length;
    books = [];
    
    res.json({
      success: true,
      message: `All books deleted successfully`,
      deletedCount: deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Books REST API',
    version: '1.0.0',
    endpoints: {
      'GET /books': 'Get all books',
      'GET /books/:id': 'Get a specific book',
      'POST /books': 'Add a new book',
      'PUT /books/:id': 'Update a book',
      'DELETE /books/:id': 'Delete a book',
      'DELETE /books': 'Delete all books'
    },
    usage: {
      'Add a book': 'POST /books with JSON body: {"title": "Book Title", "author": "Author Name"}',
      'Update a book': 'PUT /books/:id with JSON body: {"title": "New Title"}',
      'Filter books': 'GET /books?author=authorName&genre=fiction&limit=5'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Books REST API server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`📊 Total books in memory: ${books.length}`);
  console.log(`⏰ Server started at: ${new Date().toLocaleString()}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

module.exports = app; 