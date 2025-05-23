import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CourseCard from '../../components/common/CourseCard';
import { Card, CardContent } from '../../components/ui/Card';
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
  const [error, setError] = useState('');

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



  return (
    <DashboardLayout role="ROLE_TEACHER">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100">Total Courses</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.courses.length}</h3>
                    </div>
                    <BookOpen size={24} className="text-indigo-100" />
                  </div>
                  <div className="mt-4 text-sm text-indigo-100">
                    Across {new Set(dashboardData.courses.map(c => c.subject)).size} subjects
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-100">Total Students</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.totalStudents}</h3>
                    </div>
                    <Users size={24} className="text-violet-100" />
                  </div>
                  <div className="mt-4 text-sm text-violet-100">Enrolled in your courses</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Assignments</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.totalAssignments}</h3>
                    </div>
                    <ClipboardList size={24} className="text-blue-100" />
                  </div>
                  <div className="mt-4 text-sm text-blue-100">
                    {dashboardData.pendingGrading} pending grading
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100">Average Grade</p>
                      <h3 className="text-3xl font-bold mt-1">{dashboardData.averageGrade.toFixed(1)}%</h3>
                    </div>
                    <TrendingUp size={24} className="text-emerald-100" />
                  </div>
                  <div className="mt-4 text-sm text-emerald-100">Across all courses</div>
                </CardContent>
              </Card>
            </div>

            {/* Courses List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                    {dashboardData.courses.map(course => (
                    <CourseCard key={course.id} course={course} role="ROLE_TEACHER" />
                  ))}
                </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
