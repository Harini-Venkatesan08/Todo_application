const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'todos.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read todos from JSON file
function readTodos() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading todos file:', error);
    return [];
  }
}

// Helper function to write todos to JSON file
function writeTodos(todos) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing todos file:', error);
    return false;
  }
}

// Validation middleware for creating/updating a todo
function validateTodo(req, res, next) {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and cannot be empty.' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string.' });
  }

  if (status !== undefined && !['Pending', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either "Pending" or "Completed".' });
  }

  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be one of "Low", "Medium", or "High".' });
  }

  if (dueDate !== undefined && dueDate !== '' && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ error: 'Due date must be a valid date string (YYYY-MM-DD).' });
  }

  next();
}

// 1. GET /todos - Get all todos
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// 2. GET /todos/:id - Get a single todo by ID
app.get('/todos/:id', (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with ID ${id} not found.` });
  }

  res.json(todo);
});

// 3. POST /todos - Create a new todo
app.post('/todos', validateTodo, (req, res) => {
  const todos = readTodos();
  const { title, description, status, priority, dueDate } = req.body;

  const nextId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;

  const newTodo = {
    id: nextId,
    title: title.trim(),
    description: (description || '').trim(),
    status: status || 'Pending',
    priority: priority || 'Medium',
    dueDate: dueDate || null,
    createdDate: new Date().toISOString()
  };

  todos.push(newTodo);
  if (writeTodos(todos)) {
    res.status(201).json(newTodo);
  } else {
    res.status(500).json({ error: 'Failed to write todo data.' });
  }
});

// 4. PUT /todos/:id - Update an existing todo by ID
app.put('/todos/:id', validateTodo, (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: `Todo with ID ${id} not found.` });
  }

  const { title, description, status, priority, dueDate } = req.body;

  const updatedTodo = {
    ...todos[todoIndex],
    title: title.trim(),
    description: (description || '').trim(),
    status: status || todos[todoIndex].status,
    priority: priority || todos[todoIndex].priority,
    dueDate: dueDate || null
  };

  todos[todoIndex] = updatedTodo;

  if (writeTodos(todos)) {
    res.json(updatedTodo);
  } else {
    res.status(500).json({ error: 'Failed to update todo data.' });
  }
});

// 5. DELETE /todos/:id - Delete a todo by ID
app.delete('/todos/:id', (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: `Todo with ID ${id} not found.` });
  }

  const deletedTodo = todos.splice(todoIndex, 1)[0];

  if (writeTodos(todos)) {
    res.json({ message: 'Todo deleted successfully.', deletedTodo });
  } else {
    res.status(500).json({ error: 'Failed to delete todo data.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
