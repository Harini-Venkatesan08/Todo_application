import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

function TodoDetail() {
  const [searchParams] = useSearchParams();
  const todoId = searchParams.get('id');
  
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (todoId) {
      fetchTodoDetail(todoId);
    } else {
      setErrorMsg('No Todo ID was specified in the URL query parameter.');
      setLoading(false);
    }
  }, [todoId]);

  const fetchTodoDetail = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/todos/${id}`);
      setTodo(response.data);
      setErrorMsg('');
    } catch (err) {
      console.error('Error fetching todo details:', err);
      if (err.response && err.response.status === 404) {
        setErrorMsg(`Todo task with ID "${id}" could not be found.`);
      } else {
        setErrorMsg('Failed to load todo details from the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="todo-detail-page container">
        <p className="loading">Loading todo details...</p>
        <Link to="/" className="btn btn-secondary">&larr; Back to Todo List</Link>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="todo-detail-page container">
        <div className="alert alert-error">{errorMsg}</div>
        <Link to="/" className="btn btn-secondary">&larr; Back to Todo List</Link>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="todo-detail-page container">
        <p>No details found.</p>
        <Link to="/" className="btn btn-secondary">&larr; Back to Todo List</Link>
      </div>
    );
  }

  return (
    <div className="todo-detail-page container">
      <div className="detail-card">
        <div className="detail-header">
          <h2>{todo.title}</h2>
          <span className={`badge badge-priority-${todo.priority.toLowerCase()}`}>
            Priority: {todo.priority}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h4>Description</h4>
            <p className="description-text">
              {todo.description || <span className="italic">No description provided.</span>}
            </p>
          </div>

          <div className="detail-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className={`badge badge-status-${todo.status.toLowerCase()}`}>
                {todo.status}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Due Date:</span>
              <span className="meta-value">
                {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'None'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Created Date:</span>
              <span className="meta-value">
                {new Date(todo.createdDate).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="detail-footer">
          <Link to="/" className="btn btn-secondary">
            &larr; Back to Todo List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TodoDetail;
