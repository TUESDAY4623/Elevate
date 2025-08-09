# Books REST API

A simple and powerful REST API for managing books built with Node.js and Express. This API provides full CRUD operations for books with in-memory storage.

## 🚀 Features

### Core Functionality
- ✅ **GET /books** - Retrieve all books with optional filtering
- ✅ **GET /books/:id** - Get a specific book by ID
- ✅ **POST /books** - Add a new book
- ✅ **PUT /books/:id** - Update an existing book
- ✅ **DELETE /books/:id** - Delete a book by ID
- ✅ **DELETE /books** - Delete all books

### Advanced Features
- 🔍 **Filtering & Search** - Filter books by author, genre, and limit results
- ✅ **Input Validation** - Comprehensive validation for all inputs
- 🛡️ **Error Handling** - Proper HTTP status codes and error messages
- 📊 **Response Formatting** - Consistent JSON response structure
- 🌐 **CORS Support** - Cross-origin resource sharing enabled
- ⚡ **Performance** - Fast in-memory operations

## 📋 Prerequisites

- **Node.js** (version 14.0.0 or higher)
- **npm** (comes with Node.js)
- **Postman** or any REST client for testing

## 🛠️ Installation & Setup

### Step 1: Clone or Navigate to Project
```bash
cd Systeron/task3
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### Step 4: Verify Installation
Open your browser and visit: `http://localhost:3000`

You should see the API documentation in JSON format.

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. GET /books - Get All Books
**URL:** `GET http://localhost:3000/books`

**Query Parameters (Optional):**
- `author` - Filter by author name
- `genre` - Filter by genre
- `limit` - Limit number of results

**Example Requests:**
```bash
# Get all books
GET http://localhost:3000/books

# Filter by author
GET http://localhost:3000/books?author=fitzgerald

# Filter by genre and limit results
GET http://localhost:3000/books?genre=fiction&limit=2
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "year": 1925,
      "genre": "Fiction"
    }
  ]
}
```

### 2. GET /books/:id - Get Specific Book
**URL:** `GET http://localhost:3000/books/:id`

**Example:**
```bash
GET http://localhost:3000/books/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925,
    "genre": "Fiction"
  }
}
```

### 3. POST /books - Add New Book
**URL:** `POST http://localhost:3000/books`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Book Title",
  "author": "Author Name",
  "year": 2024,
  "genre": "Fiction"
}
```

**Required Fields:**
- `title` (string)
- `author` (string)

**Optional Fields:**
- `year` (number)
- `genre` (string)

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": "generated-id",
    "title": "New Book Title",
    "author": "Author Name",
    "year": 2024,
    "genre": "Fiction",
    "createdAt": "2025-01-20T10:30:00.000Z"
  }
}
```

### 4. PUT /books/:id - Update Book
**URL:** `PUT http://localhost:3000/books/:id`

**Headers:**
```
Content-Type: application/json
```

**Request Body (at least one field required):**
```json
{
  "title": "Updated Book Title",
  "author": "Updated Author Name",
  "year": 2025,
  "genre": "Updated Genre"
}
```

**Example:**
```bash
PUT http://localhost:3000/books/1
```

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "id": "1",
    "title": "Updated Book Title",
    "author": "Updated Author Name",
    "year": 2025,
    "genre": "Updated Genre",
    "updatedAt": "2025-01-20T10:30:00.000Z"
  }
}
```

### 5. DELETE /books/:id - Delete Book
**URL:** `DELETE http://localhost:3000/books/:id`

**Example:**
```bash
DELETE http://localhost:3000/books/1
```

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": {
    "id": "1",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925,
    "genre": "Fiction"
  }
}
```

### 6. DELETE /books - Delete All Books
**URL:** `DELETE http://localhost:3000/books`

**Response:**
```json
{
  "success": true,
  "message": "All books deleted successfully",
  "deletedCount": 3
}
```

## 🧪 Testing with Postman

### Step 1: Import Collection
1. Open Postman
2. Create a new collection called "Books API"
3. Add the following requests

### Step 2: Test Requests

#### 1. Get All Books
- **Method:** GET
- **URL:** `http://localhost:3000/books`

#### 2. Add New Book
- **Method:** POST
- **URL:** `http://localhost:3000/books`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937,
  "genre": "Fantasy"
}
```

#### 3. Get Specific Book
- **Method:** GET
- **URL:** `http://localhost:3000/books/1`

#### 4. Update Book
- **Method:** PUT
- **URL:** `http://localhost:3000/books/1`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "Updated Book Title",
  "year": 2025
}
```

#### 5. Delete Book
- **Method:** DELETE
- **URL:** `http://localhost:3000/books/1`

## 🧪 Testing with cURL

### Get All Books
```bash
curl -X GET http://localhost:3000/books
```

### Add New Book
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "year": 1937,
    "genre": "Fantasy"
  }'
```

### Get Specific Book
```bash
curl -X GET http://localhost:3000/books/1
```

### Update Book
```bash
curl -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Book Title",
    "year": 2025
  }'
```

### Delete Book
```bash
curl -X DELETE http://localhost:3000/books/1
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🔧 Error Handling

### HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **404** - Not Found
- **500** - Internal Server Error

### Common Error Scenarios
1. **Missing required fields** - Returns 400
2. **Book not found** - Returns 404
3. **Invalid JSON** - Returns 400
4. **Server error** - Returns 500

## 🛠️ Development

### Project Structure
```
task3/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Environment Variables
- `PORT` - Server port (default: 3000)

## 🔍 Advanced Features

### Filtering
```bash
# Filter by author
GET /books?author=fitzgerald

# Filter by genre
GET /books?genre=fiction

# Combine filters
GET /books?author=fitzgerald&genre=fiction&limit=5
```

### Data Validation
- Title and author are required
- Year must be a number
- Genre is optional
- All strings are trimmed

### Performance
- In-memory storage for fast operations
- Efficient array operations
- Minimal memory footprint

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup
```bash
# Set custom port
PORT=8080 npm start
```

## 📚 Learning Outcomes

### REST API Concepts
- **HTTP Methods** - GET, POST, PUT, DELETE
- **Status Codes** - Proper HTTP response codes
- **JSON Handling** - Request/response JSON parsing
- **URL Parameters** - Path and query parameters

### Node.js & Express
- **Express Framework** - Routing and middleware
- **Middleware** - CORS, JSON parsing, error handling
- **Async Operations** - Non-blocking I/O
- **Error Handling** - Try-catch and middleware

### API Design
- **RESTful Design** - Resource-based URLs
- **Consistent Responses** - Standardized JSON format
- **Input Validation** - Data validation and sanitization
- **Error Handling** - Proper error responses

## 🎯 Future Enhancements

### Possible Improvements
- **Database Integration** - MongoDB, PostgreSQL
- **Authentication** - JWT tokens, user management
- **Pagination** - Limit and offset for large datasets
- **Search** - Full-text search capabilities
- **File Upload** - Book covers and documents
- **Rate Limiting** - API usage limits
- **Caching** - Redis for performance
- **Logging** - Request/response logging
- **Testing** - Unit and integration tests
- **Documentation** - Swagger/OpenAPI specs

## 📄 License

This project is open source and available under the MIT License.

---

**Created by:** Utkarsh Singh  
**Date:** 2025  
**Version:** 1.0.0  
**Technology Stack:** Node.js, Express.js 