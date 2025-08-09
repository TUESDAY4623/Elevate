// Test file for Books REST API
// This file demonstrates how to use the API with examples

const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
async function makeRequest(method, url, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`\n${method} ${url}`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test functions
async function testGetAllBooks() {
  console.log('\n📚 Testing GET /books');
  await makeRequest('GET', `${BASE_URL}/books`);
}

async function testGetBooksWithFilter() {
  console.log('\n🔍 Testing GET /books with filters');
  await makeRequest('GET', `${BASE_URL}/books?author=fitzgerald`);
  await makeRequest('GET', `${BASE_URL}/books?genre=fiction&limit=2`);
}

async function testGetSpecificBook() {
  console.log('\n📖 Testing GET /books/:id');
  await makeRequest('GET', `${BASE_URL}/books/1`);
  await makeRequest('GET', `${BASE_URL}/books/999`); // Should return 404
}

async function testAddBook() {
  console.log('\n➕ Testing POST /books');
  const newBook = {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    genre: "Fantasy"
  };
  await makeRequest('POST', `${BASE_URL}/books`, newBook);
}

async function testAddBookWithValidation() {
  console.log('\n❌ Testing POST /books with validation errors');
  const invalidBook = {
    title: "", // Empty title should fail
    author: "Test Author"
  };
  await makeRequest('POST', `${BASE_URL}/books`, invalidBook);
}

async function testUpdateBook() {
  console.log('\n✏️ Testing PUT /books/:id');
  const updateData = {
    title: "Updated Book Title",
    year: 2025
  };
  await makeRequest('PUT', `${BASE_URL}/books/1`, updateData);
}

async function testUpdateNonExistentBook() {
  console.log('\n❌ Testing PUT /books/:id with non-existent book');
  const updateData = {
    title: "This book doesn't exist"
  };
  await makeRequest('PUT', `${BASE_URL}/books/999`, updateData);
}

async function testDeleteBook() {
  console.log('\n🗑️ Testing DELETE /books/:id');
  await makeRequest('DELETE', `${BASE_URL}/books/2`);
}

async function testDeleteNonExistentBook() {
  console.log('\n❌ Testing DELETE /books/:id with non-existent book');
  await makeRequest('DELETE', `${BASE_URL}/books/999`);
}

async function testDeleteAllBooks() {
  console.log('\n🗑️ Testing DELETE /books (delete all)');
  await makeRequest('DELETE', `${BASE_URL}/books`);
}

async function testAPIInfo() {
  console.log('\nℹ️ Testing GET / (API info)');
  await makeRequest('GET', `${BASE_URL}/`);
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Books API Tests...\n');
  
  // Test API info
  await testAPIInfo();
  
  // Test getting books
  await testGetAllBooks();
  await testGetBooksWithFilter();
  await testGetSpecificBook();
  
  // Test adding books
  await testAddBook();
  await testAddBookWithValidation();
  
  // Test updating books
  await testUpdateBook();
  await testUpdateNonExistentBook();
  
  // Test deleting books
  await testDeleteBook();
  await testDeleteNonExistentBook();
  
  // Test deleting all books
  await testDeleteAllBooks();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runAllTests();
} else {
  // Browser environment
  console.log('🌐 Running in browser environment');
  console.log('📝 To run tests, execute this file with Node.js:');
  console.log('   node test-api.js');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    makeRequest,
    testGetAllBooks,
    testAddBook,
    testUpdateBook,
    testDeleteBook,
    runAllTests
  };
} 