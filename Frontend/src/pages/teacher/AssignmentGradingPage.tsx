import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import axios from 'axios';
import { Submission, Assignment } from '../../types';

const AssignmentGradingPage: React.FC = () => {
  const { courseId, aid } = useParams<{ courseId: string, aid: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [grades, setGrades] = useState<{ [key: string]: { grade: number, feedback: string } }>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch assignment and submissions data from the backend
  useEffect(() => {
  setLoading(true);
  axios.get(`/api/courses/${courseId}/assignments/${aid}`)
    .then(response => {
      const data = response.data;
      setAssignment(data);

      // Ensure 'submissions' is defined and is an array
      if (data.submissions && Array.isArray(data.submissions)) {
        const initialGrades: { [key: string]: { grade: number, feedback: string } } = {};

        data.submissions.forEach((submission: Submission) => {
          initialGrades[submission.id] = {
            grade: submission.grade || 0,
            feedback: submission.feedback || ''
          };
        });

        setGrades(initialGrades);
      } else {
        console.error("No submissions found or submissions is not an array.");
        setAssignment(null); // or set a fallback state
      }
    })
    .catch(error => {
      console.error('Error fetching assignment:', error);
    })
    .finally(() => setLoading(false));
}, [courseId, aid]);



  const handleGradeChange = (submissionId: string, value: number) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        grade: value
      }
    }));
  };

  const handleFeedbackChange = (submissionId: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        feedback: value
      }
    }));
  };

  const handleSaveGrades = async () => {
    setLoading(true);

    // Create an array of grade and feedback data to send to the server
    const gradeFeedbacks = Object.entries(grades).map(([submissionId, { grade, feedback }]) => ({
      submissionId,
      grade,
      feedback
    }));

    // Make a PUT request to save grades and feedback
    try {
      const savePromises = gradeFeedbacks.map(({ submissionId, grade, feedback }) => 
        axios.put(`/api/courses/${courseId}/assignments/${aid}/submission/${submissionId}/grade`, { grade, feedback })
      );

      await Promise.all(savePromises);
      navigate(`/teacher/course/${courseId}`);
    } catch (error) {
      console.error('Error saving grades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until data is fetched
  if (loading) {
    return (
      <DashboardLayout role="ROLE_TEACHER">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout role="ROLE_TEACHER">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-gray-800">No Assignment found</h2>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(`/teacher/course/${courseId}`)}
          >
            Back to Course
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate(`/teacher/course/${courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back to Course</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Grade: {assignment.title}
            </h1>
            <p className="text-gray-600">
              {assignment.courseId} ({assignment.title})
            </p>
          </div>
          
          <Button
            onClick={handleSaveGrades}
            disabled={loading}
            className="flex items-center"
          >
            <Save size={18} className="mr-1" />
            {loading ? 'Saving...' : 'Save All Grades'}
          </Button>
        </div>
        
        {assignment.submissions.length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-gray-50">
            <p className="text-gray-500">No submissions have been received for this assignment yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignment?.submissions && assignment.submissions.length > 0 ? (
              <div className="space-y-6">
                {assignment.submissions.map((submission) => {
                  const student = submission.student;

                  return (
                    <Card key={submission.student.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50">
                        <div className="flex items-center">
                          <div className="mr-4 flex-shrink-0">
                            {/* Removed Avatar */}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            <p className="text-sm text-gray-500">
                              Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Submission</h3>
                          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">
                            {submission.content}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Grade (0-100)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={grades[submission.student.id]?.grade || 0}
                              onChange={(e) => handleGradeChange(submission.student.id, parseInt(e.target.value))}
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Feedback
                            </label>
                            <textarea
                              value={grades[submission.student.id]?.feedback || ''}
                              onChange={(e) => handleFeedbackChange(submission.student.id, e.target.value)}
                              rows={3}
                              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                              placeholder="Provide feedback to the student..."
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-md bg-gray-50">
                <p className="text-gray-500">No submissions have been received for this assignment yet.</p>
              </div>
            )}

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignmentGradingPage;
