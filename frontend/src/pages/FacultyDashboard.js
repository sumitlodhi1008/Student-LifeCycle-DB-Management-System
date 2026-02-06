import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, Home, Users, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const FacultyDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<FacultyHome user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

const FacultyHome = ({ user }) => {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-brand-blue mb-8" data-testid="faculty-dashboard">Faculty Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.fullName}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Your assigned subjects and student information will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Sidebar = ({ user, onLogout }) => (
  <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">
    <div className="flex items-center space-x-2 mb-8">
      <GraduationCap className="h-8 w-8" />
      <span className="font-serif text-2xl font-bold">UniPortal</span>
    </div>
    <div className="mb-8">
      <p className="text-sm text-slate-400">Welcome,</p>
      <p className="font-semibold">{user.fullName}</p>
      <p className="text-sm text-slate-400">{user.role}</p>
    </div>
    <nav className="space-y-2">
      <Link to="/faculty" className="block px-4 py-2 rounded-md hover:bg-slate-800" data-testid="nav-dashboard">
        <Home className="inline h-4 w-4 mr-2" />Dashboard
      </Link>
    </nav>
    <div className="absolute bottom-6 left-6 right-6">
      <Button variant="outline" className="w-full" onClick={onLogout} data-testid="sidebar-logout">Logout</Button>
    </div>
  </div>
);

export default FacultyDashboard;
