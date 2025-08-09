// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// Task counter element
let taskCounter = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    createTaskCounter();
    loadTasksFromStorage();
    updateTaskCounter();
});

// Create task counter element
function createTaskCounter() {
    taskCounter = document.createElement('div');
    taskCounter.className = 'task-counter';
    taskCounter.innerHTML = '<span>0</span> tasks remaining';
    document.querySelector('.container').appendChild(taskCounter);
}

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key press
taskInput.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Main function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Validate input
    if (!taskText) {
        showNotification('Please enter a task!', 'error');
        return;
    }
    
    if (taskText.length > 100) {
        showNotification('Task is too long! Keep it under 100 characters.', 'error');
        return;
    }
    
    // Create task element
    const taskItem = createTaskElement(taskText);
    
    // Add to list with animation
    taskList.appendChild(taskItem);
    
    // Clear input and focus
    taskInput.value = '';
    taskInput.focus();
    
    // Save to localStorage
    saveTasksToStorage();
    
    // Update counter
    updateTaskCounter();
    
    // Show success notification
    showNotification('Task added successfully!', 'success');
    
    // Add success animation
    taskItem.classList.add('success');
    setTimeout(() => {
        taskItem.classList.remove('success');
    }, 600);
}

// Create a task element
function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.className = 'task-item';
    
    // Create task text span
    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = taskText;
    
    // Add click event to toggle completion
    taskSpan.addEventListener('click', function() {
        toggleTaskCompletion(taskSpan);
    });
    
    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.setAttribute('aria-label', 'Remove task');
    
    // Add click event to remove task
    removeBtn.addEventListener('click', function() {
        removeTask(li);
    });
    
    // Append elements
    li.appendChild(taskSpan);
    li.appendChild(removeBtn);
    
    return li;
}

// Toggle task completion
function toggleTaskCompletion(taskSpan) {
    taskSpan.classList.toggle('completed');
    
    // Update localStorage
    saveTasksToStorage();
    
    // Update counter
    updateTaskCounter();
    
    // Show notification
    const isCompleted = taskSpan.classList.contains('completed');
    const message = isCompleted ? 'Task completed!' : 'Task marked as incomplete';
    showNotification(message, 'info');
}

// Remove a task
function removeTask(taskItem) {
    // Add removal animation
    taskItem.style.transform = 'translateX(100px)';
    taskItem.style.opacity = '0';
    
    setTimeout(() => {
        taskList.removeChild(taskItem);
        
        // Update localStorage
        saveTasksToStorage();
        
        // Update counter
        updateTaskCounter();
        
        // Show notification
        showNotification('Task removed!', 'info');
        
        // Check if list is empty
        if (taskList.children.length === 0) {
            showEmptyState();
        }
    }, 300);
}

// Update task counter
function updateTaskCounter() {
    const totalTasks = taskList.children.length;
    const completedTasks = document.querySelectorAll('.task-text.completed').length;
    const remainingTasks = totalTasks - completedTasks;
    
    if (taskCounter) {
        taskCounter.innerHTML = `<span>${remainingTasks}</span> of <span>${totalTasks}</span> tasks remaining`;
    }
}

// Show empty state message
function showEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
        <p>No tasks yet!</p>
        <p>Add your first task above.</p>
    `;
    taskList.appendChild(emptyState);
}

// Save tasks to localStorage
function saveTasksToStorage() {
    const tasks = [];
    const taskElements = document.querySelectorAll('.task-text');
    
    taskElements.forEach(taskElement => {
        tasks.push({
            text: taskElement.textContent,
            completed: taskElement.classList.contains('completed')
        });
    });
    
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        
        if (tasks.length > 0) {
            tasks.forEach(task => {
                const taskItem = createTaskElement(task.text);
                
                // Restore completion status
                if (task.completed) {
                    taskItem.querySelector('.task-text').classList.add('completed');
                }
                
                taskList.appendChild(taskItem);
            });
        } else {
            showEmptyState();
        }
    } else {
        showEmptyState();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#48bb78',
        error: '#e53e3e',
        info: '#3182ce'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to add task
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        addTask();
    }
    
    // Escape to clear input
    if (event.key === 'Escape') {
        taskInput.value = '';
        taskInput.blur();
    }
});

// Add input validation
taskInput.addEventListener('input', function() {
    const maxLength = 100;
    const currentLength = this.value.length;
    
    if (currentLength > maxLength) {
        this.value = this.value.substring(0, maxLength);
        showNotification('Task is too long!', 'error');
    }
});

// Add focus management
taskInput.addEventListener('focus', function() {
    this.parentElement.style.transform = 'scale(1.02)';
});

taskInput.addEventListener('blur', function() {
    this.parentElement.style.transform = 'scale(1)';
});

// Add double-click to edit (bonus feature)
let editingTask = null;

taskList.addEventListener('dblclick', function(event) {
    if (event.target.classList.contains('task-text') && !editingTask) {
        editTask(event.target);
    }
});

function editTask(taskSpan) {
    const originalText = taskSpan.textContent;
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.className = 'edit-input';
    input.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 2px solid #667eea;
        border-radius: 6px;
        font-size: 1rem;
        outline: none;
        background: white;
    `;
    
    // Replace span with input
    taskSpan.style.display = 'none';
    taskSpan.parentNode.insertBefore(input, taskSpan);
    input.focus();
    input.select();
    
    editingTask = { input, taskSpan };
    
    // Handle save
    function saveEdit() {
        const newText = input.value.trim();
        if (newText && newText !== originalText) {
            taskSpan.textContent = newText;
            saveTasksToStorage();
            showNotification('Task updated!', 'success');
        }
        
        // Restore original element
        input.remove();
        taskSpan.style.display = '';
        editingTask = null;
    }
    
    // Handle cancel
    function cancelEdit() {
        input.remove();
        taskSpan.style.display = '';
        editingTask = null;
    }
    
    // Event listeners
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveEdit();
        } else if (event.key === 'Escape') {
            cancelEdit();
        }
    });
}

// Add clear all completed tasks feature
function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.task-text.completed');
    
    if (completedTasks.length === 0) {
        showNotification('No completed tasks to clear!', 'info');
        return;
    }
    
    completedTasks.forEach(taskSpan => {
        const taskItem = taskSpan.parentNode;
        taskItem.style.transform = 'translateX(100px)';
        taskItem.style.opacity = '0';
        
        setTimeout(() => {
            if (taskItem.parentNode) {
                taskItem.remove();
            }
        }, 300);
    });
    
    setTimeout(() => {
        saveTasksToStorage();
        updateTaskCounter();
        showNotification(`${completedTasks.length} completed tasks cleared!`, 'success');
    }, 300);
}

// Add keyboard shortcut for clearing completed tasks
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Shift + C to clear completed
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        clearCompletedTasks();
    }
});

// Export functions for potential future use
window.todoApp = {
    addTask,
    toggleTaskCompletion,
    removeTask,
    clearCompletedTasks,
    updateTaskCounter
};
