import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, Home, FileText, Calendar, DollarSign, Building, File } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const StudentDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<StudentHome user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

const StudentHome = ({ user }) => {
  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-brand-blue mb-8" data-testid="student-dashboard">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Current Semester" value="1" icon={<Calendar />} />
        <StatsCard title="Attendance" value="--%" icon={<FileText />} />
        <StatsCard title="Fees Status" value="View Details" icon={<DollarSign />} />
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Welcome, {user.fullName}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">Your enrollment details and academic information will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const StatsCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-brand-blue">{value}</div>
        <div className="text-brand-blue">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

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
      <Link to="/student" className="block px-4 py-2 rounded-md hover:bg-slate-800" data-testid="nav-dashboard">
        <Home className="inline h-4 w-4 mr-2" />Dashboard
      </Link>
    </nav>
    <div className="absolute bottom-6 left-6 right-6">
      <Button variant="outline" className="w-full" onClick={onLogout} data-testid="sidebar-logout">Logout</Button>
    </div>
  </div>
);

export default StudentDashboard;
