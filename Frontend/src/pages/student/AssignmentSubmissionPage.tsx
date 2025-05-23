import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Upload, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Assignment, Submission, Course, User } from '../../types';

const AssignmentSubmissionPage: React.FC = () => {
  const { courseId, aid } = useParams<{ courseId: string; aid: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [files, setFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');

  // Separate fetch functions
  // Fetch Assignment Data
const fetchAssignmentData = async () => {
  try {
    const token = localStorage.getItem('token');

    console.log("Fetching assignment data with token:", token); // Debugging token
    console.log("Assignment Id:",aid);
    const response = await axios.get<Assignment>(`http://localhost:8080/api/courses/assignments/${aid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("Assignment data:", response.data); // Log response data
    if (response.data) {
      setAssignment(response.data);
    } else {
      setError('Assignment not found');
    }
  } catch (err) {
    console.error('Error fetching assignment data:', err); // Log error
    setError('Failed to load assignment data.');
  }
};

// Fetch Course Data
const fetchCourseData = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log("Fetching course data with token:", token); // Debugging token
    const response = await axios.get<Course>(`http://localhost:8080/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Course data:", response.data); // Log response data
    if (response.data) {
      setCourse(response.data);
    } else {
      setError('Course not found');
    }
  } catch (err) {
    console.error('Error fetching course data:', err); // Log error
    setError('Failed to load course data.');
  }
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing.');
      return;
    }
    // Fetch data sequentially
    fetchAssignmentData();
    fetchCourseData();
  }, [courseId, aid]);

  useEffect(() => {
    if (assignment && currentUser) {
      const studentSubmission = assignment.submissions.find(
        (submission) => submission.student.id === currentUser.id
      );
      if (studentSubmission) {
        setSubmitted(true);
        setSubmissionText(studentSubmission.content);
      }
    }
  }, [assignment, currentUser]);

  const dueDate = assignment?.dueDate ? new Date(assignment.dueDate) : new Date();
  const today = new Date();
  const isPastDue = today > dueDate;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files).slice(0, 4);
      setFiles(fileArray);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files).slice(0, 4);
      setFiles(fileArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Authentication token missing.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', submissionText);

      // Append files if any
      files.forEach((file) => formData.append('files', file));

      // Make API call to submit the assignment
      const response = await axios.post(
        `http://localhost:8080/api/student/course/${courseId}/assignment/${aid}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Ensure we handle files
          },
        }
      );
      
      if (response.status === 200) {
        setSubmitted(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError('Failed to submit the assignment.');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <DashboardLayout role="ROLE_STUDENT">
        <div className="text-center p-8 text-red-500">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(`/student/course/${courseId}`)}>
            Back to Course
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ROLE_STUDENT">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(`/student/course/${courseId}`)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft size={18} className="mr-1" />
              <span>Back to Course</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{assignment?.title}</h1>
            <p className="text-gray-600">
              {course?.title} ({course?.code})
            </p>
          </div>

          <div className="flex items-center text-sm font-medium">
            <Calendar size={16} className="mr-1" />
            <span>
              Due: {dueDate.toLocaleDateString()}
              {isPastDue && <span className="ml-2 text-red-600">(Past Due)</span>}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{assignment?.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{submitted ? 'Your Submission' : 'Submit Your Assignment'}</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border rounded-md whitespace-pre-wrap">{submissionText}</div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-center">
                  <CheckCircle size={16} className="text-blue-600 mr-2" />
                  <p className="text-blue-700">Submission received. Your work will be reviewed by your instructor.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Files</label>
                    <div
                      className="border border-dashed border-gray-300 rounded-md p-6 text-center"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="p-2 bg-gray-100 rounded-md">
                          <svg className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">You can drag and drop files here to add them.</p>
                        <div className="flex space-x-2 mt-2">
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Choose Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <ul className="divide-y divide-gray-200">
                        {files.map((file, index) => (
                          <li key={index} className="py-2 flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{file.name}</span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700"
                            >
                              &times;
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer</label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      rows={8}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type your answer here..."
                      required
                      disabled={loading || isPastDue}
                    />
                  </div>

                  {isPastDue ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                      This assignment is past due and submissions are no longer accepted.
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading || submissionText.trim() === ''}
                      className="flex items-center"
                    >
                      <Upload size={18} className="mr-1" />
                      {loading ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssignmentSubmissionPage;
