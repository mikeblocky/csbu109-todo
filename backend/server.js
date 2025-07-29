const express = require('express');
const path = require('path');
const connectDB = require('./db');
const Task = require('./models/taskModel');

// --- INITIALIZATION ---
const app = express();
connectDB();

// --- MIDDLEWARE ---
app.use(express.json()); // To parse JSON bodies
// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API ROUTES ---

// @desc    Get all tasks
// @route   GET /api/tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await Task.create({ description: req.body.description });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update a task (e.g., mark as complete)
// @route   PUT /api/tasks/:id
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));