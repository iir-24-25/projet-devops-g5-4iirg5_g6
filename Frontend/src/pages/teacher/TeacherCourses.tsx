import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CourseCard from '../../components/common/CourseCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axios from 'axios';
import { Course, Assignment } from '../../types';

interface TeacherDashboardData {
  courses: Course[];
  assignments: Assignment[];
  totalStudents: number;
  totalAssignments: number;
  pendingGrading: number;
  averageGrade: number;
}

const defaultDashboardData: TeacherDashboardData = {
  courses: [],
  assignments: [],
  totalStudents: 0,
  totalAssignments: 0,
  pendingGrading: 0,
  averageGrade: 0,
};

const TeacherDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData>(defaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get<TeacherDashboardData>('http://localhost:8080/api/teacher/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Dashboard data:', response.data);
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Failed to load dashboard:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateCourse = () => {
    navigate('/teacher/create-course');
  };

  const filteredCourses = dashboardData.courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="ROLE_TEACHER">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Courses</h1>
          <Button onClick={handleCreateCourse} className="flex items-center">
            <Plus size={18} className="mr-1" />
            Create Course
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>

            {/* Courses List */}
            <div>
              <div className="mb-6 relative w-2/3 ml-[18%]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>

              {filteredCourses.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">
                    {searchQuery
                      ? 'No courses match your search.'
                      : "You haven't created any courses yet."}
                  </p>
                  {!searchQuery && (
                    <Button variant="primary" className="mt-4" onClick={handleCreateCourse}>
                      Create Your First Course
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} role="ROLE_TEACHER" />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
