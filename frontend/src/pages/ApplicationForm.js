import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import api from '../utils/api';

const ApplicationForm = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    programType: '',
    courseId: '',
    previousQualification: '',
    previousMarks: '',
    percentage: '',
    hostelRequired: false,
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    guardianName: '',
    guardianPhone: '',
    guardianRelation: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [formData.programType]);

  const fetchCourses = async () => {
    try {
      const params = formData.programType ? { programType: formData.programType } : {};
      const response = await api.get('/api/courses', { params });
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/applications', formData);
      toast.success('Application submitted successfully!');
      navigate('/applicant');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-brand-blue" />
              <span className="font-serif text-2xl font-bold text-brand-blue">UniPortal</span>
            </Link>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 lg:p-12">
        <h1 className="font-serif text-4xl font-bold text-brand-blue mb-8">Application Form</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Program Type</Label>
                  <Select onValueChange={(value) => setFormData({...formData, programType: value})} required>
                    <SelectTrigger data-testid="program-type-select">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                      <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select onValueChange={(value) => setFormData({...formData, courseId: value})} required disabled={!formData.programType}>
                    <SelectTrigger data-testid="course-select">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course._id} value={course._id}>
                          {course.name} ({course.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Previous Qualification</Label>
                  <Input
                    placeholder="e.g., 12th Grade, Bachelor's"
                    value={formData.previousQualification}
                    onChange={(e) => setFormData({...formData, previousQualification: e.target.value})}
                    required
                    data-testid="previous-qualification-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="85.5"
                    value={formData.percentage}
                    onChange={(e) => setFormData({...formData, percentage: e.target.value, previousMarks: e.target.value})}
                    required
                    data-testid="percentage-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    required
                    data-testid="dob-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select onValueChange={(value) => setFormData({...formData, gender: value})} required>
                    <SelectTrigger data-testid="gender-select">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Guardian Name</Label>
                  <Input
                    value={formData.guardianName}
                    onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                    required
                    data-testid="guardian-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Guardian Phone</Label>
                  <Input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                    required
                    data-testid="guardian-phone-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Street Address"
                  value={formData.address.street}
                  onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                  required
                  className="mb-2"
                  data-testid="street-input"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                    required
                    data-testid="city-input"
                  />
                  <Input
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})}
                    required
                    data-testid="state-input"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hostel"
                  checked={formData.hostelRequired}
                  onChange={(e) => setFormData({...formData, hostelRequired: e.target.checked})}
                  data-testid="hostel-checkbox"
                />
                <Label htmlFor="hostel">I require hostel accommodation</Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue/90"
                disabled={loading}
                data-testid="submit-application-button"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;
