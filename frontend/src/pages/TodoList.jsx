import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Completed, Pending
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  
  // Validation / Message states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch todos on load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setErrorMsg('Could not fetch todos from server. Please make sure the backend is running.');
    }
  };

  // Open form to add a new todo
  const handleOpenAddForm = () => {
    setEditingTodoId(null);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setStatus('Pending');
    setErrorMsg('');
    setSuccessMsg('');
    setIsFormOpen(true);
  };

  // Open form to edit an existing todo
  const handleOpenEditForm = (todo) => {
    setEditingTodoId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    setStatus(todo.status);
    setErrorMsg('');
    setSuccessMsg('');
    setIsFormOpen(true);
  };

  // Handle Close Form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setErrorMsg('');
  };

  // Submit Handler (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }

    const payload = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      status
    };

    try {
      if (editingTodoId) {
        // Edit flow
        const response = await axios.put(`${API_BASE_URL}/todos/${editingTodoId}`, payload);
        setTodos(todos.map(t => t.id === editingTodoId ? response.data : t));
        setSuccessMsg('Todo updated successfully!');
      } else {
        // Add flow
        const response = await axios.post(`${API_BASE_URL}/todos`, payload);
        setTodos([...todos, response.data]);
        setSuccessMsg('Todo added successfully!');
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error saving todo:', err);
      setErrorMsg(err.response?.data?.error || 'Failed to save todo.');
    }
  };

  // Toggle Complete / Incomplete Status
  const handleToggleComplete = async (todo) => {
    const updatedStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${todo.id}`, {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate,
        status: updatedStatus
      });
      setTodos(todos.map(t => t.id === todo.id ? response.data : t));
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update status.');
    }
  };

  // Delete Todo
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
      setSuccessMsg('Todo deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error deleting todo:', err);
      alert('Failed to delete todo.');
    }
  };

  // Filter and Search processing
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' ||
      todo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="todo-list-page">
      <div className="page-header-actions">
        <h2>My Tasks</h2>
        <button className="btn btn-primary" onClick={handleOpenAddForm}>
          + Add New Todo
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      {/* Search and Filters */}
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {['All', 'Completed', 'Pending'].map((f) => (
            <button
              key={f}
              className={`btn btn-filter ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Todo items */}
      <div className="todo-items-list">
        {filteredTodos.length === 0 ? (
          <p className="no-todos">No todos found matching the criteria.</p>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`todo-card ${todo.status.toLowerCase()}`}>
              <div className="todo-card-checkbox">
                <input
                  type="checkbox"
                  checked={todo.status === 'Completed'}
                  onChange={() => handleToggleComplete(todo)}
                />
              </div>
              <div className="todo-card-content">
                <div className="todo-card-title-row">
                  <h3 className={todo.status === 'Completed' ? 'line-through' : ''}>
                    {todo.title}
                  </h3>
                  <span className={`badge badge-priority-${todo.priority.toLowerCase()}`}>
                    {todo.priority}
                  </span>
                </div>
                {todo.description && (
                  <p className="todo-card-desc">{todo.description}</p>
                )}
                <div className="todo-card-footer">
                  {todo.dueDate && (
                    <span className="due-date">
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="created-date">
                    Created: {new Date(todo.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="todo-card-actions">
                <Link to={`/todo?id=${todo.id}`} className="btn btn-text">
                  Details
                </Link>
                <button className="btn btn-secondary" onClick={() => handleOpenEditForm(todo)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(todo.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingTodoId ? 'Edit Todo' : 'Add Todo'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description (optional)"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTodoId ? 'Save Changes' : 'Create Todo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
