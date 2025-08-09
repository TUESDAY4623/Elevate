// Books Management System - Frontend JavaScript
class BooksManager {
    constructor() {
        this.apiUrl = 'http://localhost:3000';
        this.books = [];
        this.currentFilters = {};
        
        this.initializeEventListeners();
        this.loadBooks();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Add book form
        document.getElementById('addBookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook();
        });

        // Filter buttons
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Action buttons
        document.getElementById('refreshBooks').addEventListener('click', () => {
            this.loadBooks();
        });

        document.getElementById('deleteAllBooks').addEventListener('click', () => {
            this.deleteAllBooks();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('editBookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBook();
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });
    }

    // API Helper Methods
    async makeRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Load all books
    async loadBooks() {
        try {
            this.showLoading(true);
            
            const queryParams = new URLSearchParams(this.currentFilters).toString();
            const endpoint = queryParams ? `/books?${queryParams}` : '/books';
            
            const response = await this.makeRequest(endpoint);
            this.books = response.data || [];
            
            this.renderBooks();
            this.updateStatistics();
            this.showNotification('Books loaded successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Add new book
    async addBook() {
        try {
            const formData = new FormData(document.getElementById('addBookForm'));
            const bookData = {
                title: formData.get('title').trim(),
                author: formData.get('author').trim(),
                year: formData.get('year') ? parseInt(formData.get('year')) : null,
                genre: formData.get('genre').trim() || null
            };

            // Validation
            if (!bookData.title || !bookData.author) {
                throw new Error('Title and author are required');
            }

            await this.makeRequest('/books', {
                method: 'POST',
                body: JSON.stringify(bookData)
            });

            document.getElementById('addBookForm').reset();
            await this.loadBooks();
            this.showNotification('Book added successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Update book
    async updateBook() {
        try {
            const bookId = document.getElementById('editBookId').value;
            const formData = new FormData(document.getElementById('editBookForm'));
            
            const updateData = {};
            const title = formData.get('title').trim();
            const author = formData.get('author').trim();
            const year = formData.get('year');
            const genre = formData.get('genre').trim();

            if (title) updateData.title = title;
            if (author) updateData.author = author;
            if (year) updateData.year = parseInt(year);
            if (genre) updateData.genre = genre;

            await this.makeRequest(`/books/${bookId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });

            this.closeModal();
            await this.loadBooks();
            this.showNotification('Book updated successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Delete book
    async deleteBook(bookId) {
        try {
            if (!confirm('Are you sure you want to delete this book?')) {
                return;
            }

            await this.makeRequest(`/books/${bookId}`, {
                method: 'DELETE'
            });

            await this.loadBooks();
            this.showNotification('Book deleted successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Delete all books
    async deleteAllBooks() {
        try {
            if (!confirm('Are you sure you want to delete ALL books? This action cannot be undone.')) {
                return;
            }

            await this.makeRequest('/books', {
                method: 'DELETE'
            });

            await this.loadBooks();
            this.showNotification('All books deleted successfully', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Apply filters
    applyFilters() {
        this.currentFilters = {};
        
        const authorFilter = document.getElementById('authorFilter').value.trim();
        const genreFilter = document.getElementById('genreFilter').value.trim();
        const limitFilter = document.getElementById('limitFilter').value;

        if (authorFilter) this.currentFilters.author = authorFilter;
        if (genreFilter) this.currentFilters.genre = genreFilter;
        if (limitFilter) this.currentFilters.limit = limitFilter;

        this.loadBooks();
    }

    // Clear filters
    clearFilters() {
        document.getElementById('authorFilter').value = '';
        document.getElementById('genreFilter').value = '';
        document.getElementById('limitFilter').value = '';
        this.currentFilters = {};
        this.loadBooks();
    }

    // Open edit modal
    openEditModal(book) {
        document.getElementById('editBookId').value = book.id;
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editYear').value = book.year || '';
        document.getElementById('editGenre').value = book.genre || '';
        
        document.getElementById('editModal').classList.add('show');
    }

    // Close modal
    closeModal() {
        document.getElementById('editModal').classList.remove('show');
        document.getElementById('editBookForm').reset();
    }

    // Render books list
    renderBooks() {
        const booksList = document.getElementById('booksList');
        const noBooksMessage = document.getElementById('noBooksMessage');

        if (this.books.length === 0) {
            booksList.innerHTML = '';
            noBooksMessage.style.display = 'block';
            return;
        }

        noBooksMessage.style.display = 'none';
        booksList.innerHTML = this.books.map(book => this.createBookCard(book)).join('');
    }

    // Create book card HTML
    createBookCard(book) {
        return `
            <div class="book-card" data-id="${book.id}">
                <div class="book-header">
                    <div>
                        <div class="book-title">${this.escapeHtml(book.title)}</div>
                        <div class="book-author">by ${this.escapeHtml(book.author)}</div>
                    </div>
                    <div class="book-actions">
                        <button class="action-btn edit-btn" onclick="booksManager.openEditModal(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="booksManager.deleteBook('${book.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="book-details">
                    <div class="book-detail">
                        <div class="detail-label">Year</div>
                        <div class="detail-value">${book.year || 'N/A'}</div>
                    </div>
                    <div class="book-detail">
                        <div class="detail-label">Genre</div>
                        <div class="detail-value">${book.genre || 'N/A'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update statistics
    updateStatistics() {
        const totalBooks = this.books.length;
        const uniqueAuthors = new Set(this.books.map(book => book.author)).size;
        const uniqueGenres = new Set(this.books.filter(book => book.genre).map(book => book.genre)).size;

        document.getElementById('totalBooks').textContent = totalBooks;
        document.getElementById('uniqueAuthors').textContent = uniqueAuthors;
        document.getElementById('uniqueGenres').textContent = uniqueGenres;
    }

    // Show/hide loading spinner
    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const booksList = document.getElementById('booksList');
        const noBooksMessage = document.getElementById('noBooksMessage');

        if (show) {
            spinner.style.display = 'block';
            booksList.style.display = 'none';
            noBooksMessage.style.display = 'none';
        } else {
            spinner.style.display = 'none';
            booksList.style.display = 'grid';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.notification-message');
        const iconElement = notification.querySelector('.notification-icon');

        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        iconElement.className = `notification-icon ${icons[type] || icons.info}`;
        messageElement.textContent = message;

        // Set notification type
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Utility method to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the books manager when DOM is loaded
let booksManager;

document.addEventListener('DOMContentLoaded', () => {
    booksManager = new BooksManager();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (booksManager) {
        booksManager.showNotification('An unexpected error occurred', 'error');
    }
});

// Handle network errors
window.addEventListener('offline', () => {
    if (booksManager) {
        booksManager.showNotification('You are offline. Please check your connection.', 'error');
    }
});

window.addEventListener('online', () => {
    if (booksManager) {
        booksManager.showNotification('You are back online!', 'success');
        booksManager.loadBooks();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Escape key to close modal
    if (event.key === 'Escape') {
        const modal = document.getElementById('editModal');
        if (modal.classList.contains('show')) {
            booksManager.closeModal();
        }
    }

    // Ctrl/Cmd + Enter to submit add book form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const addForm = document.getElementById('addBookForm');
        if (document.activeElement.closest('#addBookForm')) {
            addForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Auto-save form data to localStorage
document.getElementById('addBookForm').addEventListener('input', (event) => {
    const formData = new FormData(event.target.form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    localStorage.setItem('bookFormData', JSON.stringify(data));
});

// Restore form data from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('bookFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = data[key];
            }
        });
    }
});

// Clear form data when form is submitted
document.getElementById('addBookForm').addEventListener('submit', () => {
    localStorage.removeItem('bookFormData');
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add confirmation for destructive actions
document.addEventListener('click', (event) => {
    if (event.target.matches('.delete-btn')) {
        event.preventDefault();
        // Confirmation is handled in the deleteBook method
    }
});

// Add tooltips for better UX
document.addEventListener('mouseover', (event) => {
    if (event.target.matches('[data-tooltip]')) {
        const tooltip = event.target.getAttribute('data-tooltip');
        // You can implement a tooltip system here
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BooksManager;
} 