import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import AssignmentList from '../../components/teacher/AssignmentList';
import { Course, User, Assignment } from '../../types';
import axios from 'axios';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');

  useEffect(() => {
  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in.');
        return;
      }

      console.log('Fetching course data for course ID:', id);  // Check for logs

      const response = await axios.get<Course>(`http://localhost:8080/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Course data fetched:', response.data);  // Check the full data

      if (response.data) {
        setCourse(response.data);
        setAssignments(response.data.assignments || []);  // Set assignments
        setStudents(response.data.students || []);
      }
    } catch (err) {
      console.error('Failed to fetch course:', err);
      setError('Failed to load course. Make sure the course exists.');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchCourseData();
  }
}, [id]);
  const handleCancel = () => {
      navigate('/teacher/courses');
    };


  const handleCreateAssignment = () => {
    if (course) navigate(`/teacher/course/${course.id}/create-assignment`);
  };

  if (loading) {
    return (
      <DashboardLayout role="ROLE_TEACHER">
        <div className="text-center py-8 text-gray-500">Loading course data...</div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout role="ROLE_TEACHER">
        <div className="text-center p-8 text-red-500">
          {error || 'Course not found.'}
          <Button variant="outline" className="mt-4" onClick={handleCancel}>
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Course Code</h3>
                    <p className="mt-1 text-lg font-mono">{course.code}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                    <p className="mt-1 text-lg">{course.subject}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Level</h3>
                    <p className="mt-1 text-lg">{course.level}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Students</h3>
                    <p className="mt-1 text-lg">{students.length}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-base">{course.description}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Assignments</h2>
              <Button onClick={handleCreateAssignment} className="flex items-center">
                <PlusCircle size={18} className="mr-1" />
                Create Assignment
              </Button>
            </div>

            <AssignmentList assignments={assignments} courseId={course.id} />

            {assignments.length > 3 && (
              <div className="text-center">
                <Button variant="outline" onClick={() => setActiveTab('assignments')}>
                  View All Assignments
                </Button>
              </div>
            )}
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Enrolled Students</h2>
            {students.length === 0 ? (
              <div className="text-center p-6 border rounded-md bg-gray-50">
                <p className="text-gray-500">No students have enrolled in this course yet.</p>
                <p className="text-gray-500 mt-2">
                  Share the course code <span className="font-mono font-medium">{course.code}</span> with your students.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <li key={student.id} className="p-4 flex items-center hover:bg-gray-50">
                      <div className="mr-4 flex-shrink-0">
                        {/* Removed avatar */}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Assignments</h2>
              <Button onClick={handleCreateAssignment} className="flex items-center">
                <PlusCircle size={18} className="mr-1" />
                Create Assignment
              </Button>
            </div>
            <AssignmentList assignments={assignments} courseId={course.id} />
          </div>
        );

      default:
        return null;    
    }
  };

  return (
    <DashboardLayout role="ROLE_TEACHER">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button onClick={handleCancel} className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft size={18} className="mr-1" />
              <span>Back to Courses</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          </div>
        </div>

        <div className="bg-white border-b border-gray-200 sm:rounded-lg overflow-hidden">
          <nav className="flex" aria-label="Tabs">
            {['overview', 'assignments', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;
