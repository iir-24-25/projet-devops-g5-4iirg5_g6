import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import AssignmentCard from '../../components/student/AssignmentCard';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const StudentCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [course, setCourse] = useState<any | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token missing. Please log in.');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the response contains course data, assignments, and teacher info
        setCourse(response.data);
        setAssignments(response.data.assignments || []);
        setTeacher(response.data.teacher || null);
      } catch (err) {
        console.error('Failed to fetch course data:', err);
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
    navigate('/student/dashboard');
  };

  if (loading) {
    return (
      <DashboardLayout role="ROLE_STUDENT">
        <div className="text-center py-8 text-gray-500">Loading course data...</div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout role="ROLE_STUDENT">
        <div className="text-center p-8 text-red-500">
          {error || 'Course not found.'}
          <Button variant="outline" className="mt-4" onClick={handleCancel}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Filter assignments into due and past assignments
  const dueAssignments = assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    return dueDate >= today;
  });

  const pastAssignments = assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    return dueDate < today;
  });

  return (
    <DashboardLayout role="ROLE_STUDENT">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back to Courses</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">{course.code} • {course.subject}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Assignments</h2>
              {dueAssignments.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No current assignments for this course.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {dueAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      courseId={course.id}
                      studentId={currentUser.id}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Assignments</h2>
              {pastAssignments.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No past assignments for this course.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pastAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      courseId={course.id}
                      studentId={currentUser.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen size={18} className="mr-2" />
                  Course Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-sm">{course.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Level</h3>
                    <p className="mt-1 text-sm">{course.level}</p>
                  </div>

                  {teacher && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Instructor</h3>
                      <div className="mt-2 flex items-center">
                        {teacher.avatar ? (
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2">
                            {teacher.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-sm">{teacher.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dueAssignments.length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                ) : (
                  <ul className="space-y-3">
                    {dueAssignments
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .slice(0, 3)
                      .map((assignment) => (
                        <li key={assignment.id} className="flex justify-between">
                          <span className="text-sm">{assignment.title}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCoursePage;
