import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { GraduationCap, Home, BookOpen, Users, Building, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import api from '../utils/api';

const AdminDashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="ml-64 p-8">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/merit" element={<MeritGeneration />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-brand-blue mb-8" data-testid="admin-dashboard">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Applications" value={stats.applications.total} icon={<TrendingUp />} />
        <StatsCard title="Pending Applications" value={stats.applications.pending} icon={<TrendingUp />} />
        <StatsCard title="Total Students" value={stats.students.total} icon={<Users />} />
        <StatsCard title="Total Courses" value={stats.courses.total} icon={<BookOpen />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Seats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Seats:</span>
                <span className="font-bold">{stats.courses.totalSeats}</span>
              </div>
              <div className="flex justify-between">
                <span>Filled Seats:</span>
                <span className="font-bold text-green-600">{stats.courses.filledSeats}</span>
              </div>
              <div className="flex justify-between">
                <span>Available Seats:</span>
                <span className="font-bold text-blue-600">{stats.courses.availableSeats}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hostel Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Rooms:</span>
                <span className="font-bold">{stats.hostels.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span>Occupied:</span>
                <span className="font-bold text-green-600">{stats.hostels.occupancy}</span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-bold text-blue-600">{stats.hostels.available}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    departmentId: '',
    programType: '',
    duration: '',
    totalSeats: '',
    eligibilityPercentage: '',
    feesPerSemester: '',
    description: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/courses/departments/all');
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/courses', formData);
      toast.success('Course created successfully');
      setShowForm(false);
      fetchCourses();
      setFormData({
        name: '',
        code: '',
        departmentId: '',
        programType: '',
        duration: '',
        totalSeats: '',
        eligibilityPercentage: '',
        feesPerSemester: '',
        description: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create course');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-4xl font-bold text-brand-blue">Course Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-brand-blue" data-testid="add-course-button">
          {showForm ? 'Cancel' : 'Add Course'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Course Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required data-testid="course-name-input" />
                </div>
                <div>
                  <Label>Course Code</Label>
                  <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} required data-testid="course-code-input" />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select onValueChange={(value) => setFormData({...formData, departmentId: value})} required>
                    <SelectTrigger data-testid="department-select">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Program Type</Label>
                  <Select onValueChange={(value) => setFormData({...formData, programType: value})} required>
                    <SelectTrigger data-testid="program-type-select">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UG">UG</SelectItem>
                      <SelectItem value="PG">PG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration (years)</Label>
                  <Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required data-testid="duration-input" />
                </div>
                <div>
                  <Label>Total Seats</Label>
                  <Input type="number" value={formData.totalSeats} onChange={(e) => setFormData({...formData, totalSeats: e.target.value})} required data-testid="seats-input" />
                </div>
                <div>
                  <Label>Eligibility %</Label>
                  <Input type="number" value={formData.eligibilityPercentage} onChange={(e) => setFormData({...formData, eligibilityPercentage: e.target.value})} required data-testid="eligibility-input" />
                </div>
                <div>
                  <Label>Fees per Semester</Label>
                  <Input type="number" value={formData.feesPerSemester} onChange={(e) => setFormData({...formData, feesPerSemester: e.target.value})} data-testid="fees-input" />
                </div>
              </div>
              <Button type="submit" className="bg-brand-blue" data-testid="submit-course-button">Create Course</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {courses.map(course => (
          <Card key={course._id} data-testid={`course-item-${course.code}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-brand-blue">{course.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">Code: {course.code} | {course.programType} | {course.duration} years</p>
                  <p className="text-sm text-slate-600">Seats: {course.availableSeats}/{course.totalSeats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MeritGeneration = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const handleGenerateMerit = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/merit/generate', { courseId: selectedCourse });
      toast.success(`Merit list generated! ${response.data.selected} students selected`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate merit list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-4xl font-bold text-brand-blue mb-8">Merit List Generation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Merit List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Course</Label>
            <Select onValueChange={setSelectedCourse}>
              <SelectTrigger data-testid="merit-course-select">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.name} ({course.code}) - {course.availableSeats} seats
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleGenerateMerit} 
            disabled={loading} 
            className="bg-brand-gold hover:bg-brand-gold/90"
            data-testid="generate-merit-button"
          >
            {loading ? 'Generating...' : 'Generate Merit List'}
          </Button>
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
        <div className="text-3xl font-bold text-brand-blue">{value}</div>
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
      <p className="text-sm text-slate-400 uppercase">{user.role}</p>
    </div>
    <nav className="space-y-2">
      <Link to="/admin" className="block px-4 py-2 rounded-md hover:bg-slate-800" data-testid="nav-dashboard">
        <Home className="inline h-4 w-4 mr-2" />Dashboard
      </Link>
      <Link to="/admin/courses" className="block px-4 py-2 rounded-md hover:bg-slate-800" data-testid="nav-courses">
        <BookOpen className="inline h-4 w-4 mr-2" />Courses
      </Link>
      <Link to="/admin/merit" className="block px-4 py-2 rounded-md hover:bg-slate-800" data-testid="nav-merit">
        <TrendingUp className="inline h-4 w-4 mr-2" />Merit Generation
      </Link>
    </nav>
    <div className="absolute bottom-6 left-6 right-6">
      <Button variant="outline" className="w-full" onClick={onLogout} data-testid="sidebar-logout">Logout</Button>
    </div>
  </div>
);

export default AdminDashboard;
