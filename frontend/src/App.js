import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ApplicantDashboard from './pages/ApplicantDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationForm from './pages/ApplicationForm';
import CoursesPage from './pages/CoursesPage';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={getDashboardRoute(user.role)} />} />
        <Route path="/register" element={!user ? <RegisterPage setUser={setUser} /> : <Navigate to={getDashboardRoute(user.role)} />} />
        <Route path="/courses" element={<CoursesPage user={user} onLogout={handleLogout} />} />
        
        {/* Protected Routes */}
        <Route 
          path="/applicant/*" 
          element={user && user.role === 'applicant' ? 
            <ApplicantDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />} 
        />
        <Route 
          path="/student/*" 
          element={user && user.role === 'student' ? 
            <StudentDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />} 
        />
        <Route 
          path="/faculty/*" 
          element={user && user.role === 'faculty' ? 
            <FacultyDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/*" 
          element={user && user.role === 'admin' ? 
            <AdminDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />} 
        />
        
        <Route path="/apply" element={user ? <ApplicationForm user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function getDashboardRoute(role) {
  switch (role) {
    case 'applicant': return '/applicant';
    case 'student': return '/student';
    case 'faculty': return '/faculty';
    case 'admin': return '/admin';
    default: return '/';
  }
}

export default App;