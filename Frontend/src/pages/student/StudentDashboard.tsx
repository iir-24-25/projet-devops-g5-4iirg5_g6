import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Award, ClipboardList, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CourseCard from '../../components/common/CourseCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Course, Assignment, Submission } from '../../types';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to fetch student data from the backend
const fetchStudentData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/student/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Dashboard data:', response.data);

        // Ensure courses is an array before trying to map
        const courses = Array.isArray(response.data.courses) ? response.data.courses : [];
        setCourses(courses);
        setAssignments(response.data.assignments || []);
        setSubmissions(response.data.submissions || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load student dashboard.');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchStudentData();  // Trigger API call when component mounts
  }, []);

  // Calculate the total assignments across all courses
  const totalAssignments = courses.reduce((acc, course) => acc + (course.assignments?.length || 0), 0);
  const completedAssignments = submissions.filter(sub => sub.grade !== undefined).length;
  const averageGrade = submissions.length > 0
    ? Math.round(
        submissions.reduce((acc, sub) => acc + (sub.grade || 0), 0) / 
        submissions.filter(sub => sub.grade !== undefined).length
      )
    : 0;

  // Filter courses based on search query
  const filteredCourses = Array.isArray(courses) ? courses.filter(course => {
    return (
      (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.code && course.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.subject && course.subject.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }) : [];

  const handleJoinCourse = async () => {
    if (!courseCode) {
      setError('Please enter a course code.');
      return;
    }

    if (!currentUser) {
      setError('User not authenticated.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Check if the student is already enrolled in the course
      const isAlreadyEnrolled = courses.some(course => course.code === courseCode);
      if (isAlreadyEnrolled) {
        setError('You are already enrolled in this course.');
        return;
      }

      // Send request to backend to join the course
      const response = await axios.post(
        'http://localhost:8080/api/student/join-course',
        {
          studentId: currentUser.id,
          courseCode: courseCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Course joined successfully');
        fetchStudentData(); // Re-fetch data after joining the course
      } else {
        alert('Failed to join the course. Please try again later.');
      }

      setCourseCode(''); 
    } catch (error) {
      console.error('Error joining course:', error);
      setError('Failed to join the course. Please try again later.');
    }
  };

  // Get upcoming assignments
  const upcomingAssignments = submissions
    .filter(sub => sub.grade == null) // Only include ungraded submissions
    .map(sub => {
      const assignment = assignments.find(a => a.id === sub.assignmentId);
      return assignment ? { ...sub, assignment } : null;
    })
    .filter(item => item !== null)
    .sort((a, b) => new Date(a.assignment.dueDate).getTime() - new Date(b.assignment.dueDate).getTime())
    .slice(0, 3);

  return (
    <DashboardLayout role="ROLE_STUDENT">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100">Enrolled Courses</p>
                      <h3 className="text-3xl font-bold mt-1">{courses.length}</h3>
                    </div>
                    <BookOpen size={24} className="text-indigo-100" />
                  </div>
                  <div className="mt-4 text-sm text-indigo-100">
                    Across {Array.from(new Set(courses.map(c => c.subject))).length} subjects
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-100">Assignments</p>
                      <h3 className="text-3xl font-bold mt-1">{completedAssignments}/{totalAssignments}</h3>
                    </div>
                    <ClipboardList size={24} className="text-violet-100" />
                  </div>
                  <div className="mt-4 text-sm text-violet-100">
                    {totalAssignments - completedAssignments} pending
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Average Grade</p>
                      <h3 className="text-3xl font-bold mt-1">{averageGrade}%</h3>
                    </div>
                    <TrendingUp size={24} className="text-blue-100" />
                  </div>
                  <div className="mt-4 text-sm text-blue-100">
                    Overall performance
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100">Best Grade</p>
                      <h3 className="text-3xl font-bold mt-1">
                        {Math.max(...submissions.map(s => s.grade || 0))}%
                      </h3>
                    </div>
                    <Award size={24} className="text-emerald-100" />
                  </div>
                  <div className="mt-4 text-sm text-emerald-100">
                    Highest achievement
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Courses</h2>

                  <div className="mb-6">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="text"
                        placeholder="Search your courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        fullWidth
                      />
                    </div>
                  </div>

                  {filteredCourses.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                      <p className="text-gray-500">
                        {searchQuery ? 'No courses match your search.' : 'You haven\'t joined any courses yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredCourses.map(course => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          role="ROLE_STUDENT"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Join Course Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen size={18} className="mr-2" />
                      Join a Course
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleJoinCourse();
                      }}
                      className="space-y-4"
                    >
                      <Input
                        label="Course Code"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        placeholder="e.g., MATH101-AB23"
                        required
                        fullWidth
                      />
                      <Button type="submit" fullWidth>
                        Join Course
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ClipboardList size={18} className="mr-2" />
                      Upcoming Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingAssignments.length === 0 ? (
                      <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                    ) : (
                      <div className="space-y-4">
                        {upcomingAssignments.map(({ assignment }) => (
                          <div key={assignment.id} className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">{assignment.title}</p>
                              <p className="text-xs text-gray-500">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/student/course/${assignment.courseId}/assignment/${assignment.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
