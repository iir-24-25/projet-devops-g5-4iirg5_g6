import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronRight, ExternalLink } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { getSubmissionsByStudentId, courses, assignments } from '../../data/mockData';

const StudentGradesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  if (!currentUser) {
    return (
      <DashboardLayout role="student">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-800">Please log in to view your grades</h2>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get all graded submissions for this student
  const submissionData = getSubmissionsByStudentId(currentUser.id);
  
  // Filter to only include graded submissions
  const gradedSubmissions = submissionData.filter(
    data => data.submission.grade !== undefined
  );
  
  // Get course details for each submission
  const submissionsWithCourse = gradedSubmissions.map(data => {
    const course = courses.find(c => c.id === data.assignment.courseId);
    return { ...data, course };
  });
  
  // Calculate overall average if there are grades
  const calculateAverage = () => {
    if (gradedSubmissions.length === 0) return 0;
    
    const sum = gradedSubmissions.reduce(
      (total, data) => total + (data.submission.grade || 0), 
      0
    );
    
    return Math.round(sum / gradedSubmissions.length);
  };
  
  const average = calculateAverage();
  
  // Group submissions by course
  const groupedByCourse: Record<string, typeof submissionsWithCourse> = {};
  
  submissionsWithCourse.forEach(data => {
    if (data.course) {
      if (!groupedByCourse[data.course.id]) {
        groupedByCourse[data.course.id] = [];
      }
      groupedByCourse[data.course.id].push(data);
    }
  });

  return (
    <DashboardLayout role="ROLE_STUDENT">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
              <Award size={48} className="mb-4" />
              <h2 className="text-4xl font-bold">{average}</h2>
              <p className="text-indigo-100">Average Grade</p>
            </CardContent>
          </Card>
          
          <div className="md:col-span-3">
            {Object.keys(groupedByCourse).length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No graded assignments yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedByCourse).map(([courseId, courseData]) => {
                  const course = courses.find(c => c.id === courseId);
                  if (!course) return null;
                  
                  // Calculate course average
                  const courseSum = courseData.reduce(
                    (total, data) => total + (data.submission.grade || 0), 
                    0
                  );
                  const courseAverage = Math.round(courseSum / courseData.length);
                  
                  return (
                    <Card key={courseId}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle>{course.title}</CardTitle>
                          <p className="text-sm text-gray-500">{course.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Average: {courseAverage}</p>
                          <button 
                            onClick={() => navigate(`/student/course/${courseId}`)}
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                          >
                            View Course <ChevronRight size={14} />
                          </button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="divide-y divide-gray-200">
                          {courseData.map(data => (
                            <div key={data.submission.id} className="py-3 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{data.assignment.title}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(data.submission.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="text-lg font-semibold">{data.submission.grade}/20</p>
                                </div>
                                
                                <button
                                  onClick={() => navigate(`/student/course/${courseId}/assignment/${data.assignment.id}`)}
                                  className="text-gray-500 hover:text-indigo-600"
                                  title="View Submission"
                                >
                                  <ExternalLink size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentGradesPage;