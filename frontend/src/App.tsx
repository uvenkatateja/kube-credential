import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Issue from './pages/Issue';
import Verify from './pages/Verify';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Kube Credential
            </Link>
            <div className="nav-menu">
              <Link to="/issue" className="nav-link">
                Issue Credential
              </Link>
              <Link to="/verify" className="nav-link">
                Verify Credential
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/issue" replace />} />
            <Route path="/issue" element={<Issue />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Kube Credential System - Zupple Labs Assignment</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App
