const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// --- API Functions ---

// Fetch tasks from the backend and render them
async function fetchTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Network response was not ok');
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
    }
}

// Render tasks to the DOM
function renderTasks(tasks) {
    taskList.innerHTML = ''; // Clear current list
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task._id;

        const span = document.createElement('span');
        span.textContent = task.description;
        span.addEventListener('click', () => toggleComplete(task._id, task.completed));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task._id));

        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Add a new task
async function addTask(event) {
    event.preventDefault();
    const description = taskInput.value.trim();
    if (!description) return;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description }),
        });
        if (!response.ok) throw new Error('Failed to add task');
        taskInput.value = '';
        fetchTasks(); // Refresh the list
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Toggle task completion status
async function toggleComplete(id, currentStatus) {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus }),
        });
        fetchTasks(); // Refresh the list
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete a task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks(); // Refresh the list
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// --- Event Listeners ---
taskForm.addEventListener('submit', addTask);
document.addEventListener('DOMContentLoaded', fetchTasks); // Load tasks on page load