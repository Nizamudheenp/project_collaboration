import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner';
import MembersPage from './pages/MembersPage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { loadTheme } from '../theme';

function App() {
  useEffect(() => {
    loadTheme();
  }, []);
  return (
    <Router>
      <Navbar />
      <Toaster richColors position='top-right' />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/members"
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
  )
}

export default App