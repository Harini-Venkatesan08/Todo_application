import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TodoList from './pages/TodoList';
import TodoDetail from './pages/TodoDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1>Todo Planner</h1>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/todo" element={<TodoDetail />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Todo App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
