export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ROLE_TEACHER' | 'ROLE_STUDENT';
  tokens: string[]; // Tokens array; expand if needed
};
export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  teacherId: string;
  studentIds: string[]; // Store student IDs
  assignmentIds: string[]; // Store assignment IDs
}
export interface Assignment {
  id: string;
  courseId: string; // Referencing the course ID
  title: string;
  description: string;
  dueDate: string;
  submissions: {
    student: User; // Full student object
    grade?: number;
    feedback?: string;
    submittedAt: string;
    content: string;
  }[]; // Full student data in submissions
}
export interface Submission {
  id: string;
  assignmentId: string; // Reference to the related assignment
  studentId: string; // Reference to the student
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string; // Teacher who graded the submission
}
