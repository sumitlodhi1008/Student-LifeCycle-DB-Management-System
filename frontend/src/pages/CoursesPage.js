import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GraduationCap, BookOpen, Clock, Users } from 'lucide-react';
import api from '../utils/api';

const CoursesPage = ({ user, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      const params = filter !== 'all' ? { programType: filter } : {};
      const response = await api.get('/api/courses', { params });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-brand-blue" />
              <span className="font-serif text-2xl font-bold text-brand-blue">SLMS</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Button variant="ghost" onClick={() => window.location.href = getDashboardRoute(user.role)}>
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={onLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login"><Button variant="ghost">Login</Button></Link>
                  <Link to="/register"><Button className="bg-brand-blue hover:bg-brand-blue/90">Register</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-5xl font-bold text-brand-blue mb-4">
              Our Programs
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our comprehensive range of academic programs designed to shape future leaders
            </p>
          </motion.div>

          {/* Filter */}
          <div className="flex justify-center space-x-4 mb-12">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-brand-blue' : ''}
              data-testid="filter-all"
            >
              All Programs
            </Button>
            <Button
              variant={filter === 'UG' ? 'default' : 'outline'}
              onClick={() => setFilter('UG')}
              className={filter === 'UG' ? 'bg-brand-blue' : ''}
              data-testid="filter-ug"
            >
              Undergraduate
            </Button>
            <Button
              variant={filter === 'PG' ? 'default' : 'outline'}
              onClick={() => setFilter('PG')}
              className={filter === 'PG' ? 'bg-brand-blue' : ''}
              data-testid="filter-pg"
            >
              Postgraduate
            </Button>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow" data-testid={`course-${course.code}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-brand-gold/10 text-brand-gold">
                        {course.programType}
                      </Badge>
                      <Badge variant="outline">
                        {course.availableSeats} seats
                      </Badge>
                    </div>
                    <CardTitle className="font-serif text-xl text-brand-blue">
                      {course.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-slate-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Code: {course.code}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Duration: {course.duration} years
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="h-4 w-4 mr-2" />
                        Total Seats: {course.totalSeats}
                      </div>
                      {course.description && (
                        <p className="text-slate-600 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                    
                    <Link to={user ? "/apply" : "/register"}>
                      <Button 
                        className="w-full mt-6 bg-brand-blue hover:bg-brand-blue/90"
                        disabled={course.availableSeats === 0}
                        data-testid={`apply-course-${course.code}`}
                      >
                        {course.availableSeats === 0 ? 'Seats Full' : 'Apply Now'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No courses found for the selected filter.</p>
          </div>
        )}
      </section>
    </div>
  );
};

function getDashboardRoute(role) {
  switch (role) {
    case 'applicant': return '/applicant';
    case 'student': return '/student';
    case 'faculty': return '/faculty';
    case 'admin': return '/admin';
    default: return '/';
  }
}

export default CoursesPage;