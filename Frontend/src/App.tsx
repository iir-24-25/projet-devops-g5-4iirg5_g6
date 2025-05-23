import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import ProtectedRoute from './components/layout/ProtectedRoute';

// Common Pages
import LoginPage from './pages/common/LoginPage';
import ProfilePage from './pages/common/ProfilePage';
import RegisterPage from './pages/common/RegisterPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from './pages/teacher/TeacherCourses';
import CreateCoursePage from './pages/teacher/CreateCoursePage';
import CourseDetailPage from './pages/teacher/CourseDetailPage';
import AssignmentGradingPage from './pages/teacher/AssignmentGradingPage';
import CreateAssignmentPage from './pages/teacher/CreateAssignmentPage';
import TeacherSettings from './pages/teacher/TeacherSettings';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCoursePage from './pages/student/StudentCoursePage';
import AssignmentSubmissionPage from './pages/student/AssignmentSubmissionPage';
import StudentGradesPage from './pages/student/StudentGradesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Common Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Teacher Routes */}
          <Route 
            path="/teacher/dashboard" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/courses" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <TeacherCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/create-course" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <CreateCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/course/:id" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <CourseDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/course/:courseId/assignment/:aid" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <AssignmentGradingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/course/:courseId/create-assignment" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <CreateAssignmentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/settings" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <TeacherSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teacher/profile" 
            element={
              <ProtectedRoute roles={['ROLE_TEACHER']}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute roles={['ROLE_STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/course/:id" 
            element={
              <ProtectedRoute roles={['ROLE_STUDENT']}>
                <StudentCoursePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/course/:courseId/assignment/:aid" 
            element={
              <ProtectedRoute roles={['ROLE_STUDENT']}>
                <AssignmentSubmissionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/grades" 
            element={
              <ProtectedRoute roles={['ROLE_STUDENT']}>
                <StudentGradesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute roles={['ROLE_STUDENT']}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Redirect to login for any undefined paths */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
