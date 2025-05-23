import { User, Course, Assignment } from '../types';
import mouad from './mouad.jpg';
import zaki from './zaki.jpg';

// Mock Users
export const users: User[] = [
  {
    id: 'teacher1',
    name: 'Mouad Zaouia',
    email: 'Mouad.Zaouia@example.com',
    role: 'ROLE_TEACHER',
    avatar: mouad,
  },
  {
    id: 'student1',
    name: 'Abdo Zaki',
    email: 'Abdo.Zaki@example.com',
    role: 'ROLE_STUDENT',
    avatar: zaki,
  },
  {
    id: 'student2',
    name: 'reda hnikich',
    email: 'reda@example.com',
    role: 'ROLE_STUDENT',
    avatar: '',
  },
  {
    id: 'student2',
    name: 'ismail boudriga',
    email: 'ismail@example.com',
    role: 'ROLE_STUDENT',
    avatar: '',
  },
];

// Mock Courses
export const courses: Course[] = [
  {
    id: 'course1',
    code: 'MATH101-AX23',
    title: 'Introduction to Python',
    description: 'Fundamental concepts of python including basics, data science, and integrals.',
    subject: 'Programmation',
    level: 'Undergraduate',
    teacherId: 'teacher1',
    students: ['student1', 'student2'],
    assignments: ['assignment1', 'assignment2']
  },
  {
    id: 'course2',
    code: 'NET401-DX89',
    title: 'Network Security & Ethical Hacking',
    description: 'Principles of cybersecurity including firewall configuration, penetration testing, and ethical hacking practices.',
    subject: 'Cybersecurity',
    level: 'Engineering',
    teacherId: 'teacher1',
    students: ['student1', 'student2'],
    assignments: ['assignment5', 'assignment6']
  },  
  {
    id: 'course3',
    code: 'COMP301-CX67',
    title: 'Data Structures & Algorithms',
    description: 'Fundamental data structures and algorithms used in computer science.',
    subject: 'Computer Science',
    level: 'Undergraduate',
    teacherId: 'teacher1',
    students: ['student2'],
    assignments: ['assignment4']
  },
];

// Mock Assignments
export const assignments: Assignment[] = [
  {
    id: 'assignment1',
    courseId: 'course1',
    title: 'Python Basics Quiz',
    description: 'Write Python scripts to practice variables, loops, and conditionals.',
    dueDate: '2025-06-10',
    submissions: [
      {
        id: 'submission1',
        assignmentId: 'assignment1',
        studentId: 'student1',
        content: 'My Python basics quiz solutions.',
        submittedAt: '2025-06-08',
        grade: 16,
        feedback: 'Nice use of for-loops and clean structure.'
      }
    ]
  },
  {
    id: 'assignment2',
    courseId: 'course1',
    title: 'Mini Data Science Project',
    description: 'Create a Python script that analyzes a CSV dataset and visualizes results.',
    dueDate: '2025-06-20',
    submissions: [
      {
        id: 'submission2',
        assignmentId: 'assignment2',
        studentId: 'student2',
        content: 'My data analysis on COVID-19 dataset.',
        submittedAt: '2025-06-18',
        grade: 15,
        feedback: 'Good use of pandas and matplotlib.'
      }
    ]
  },
  {
    id: 'assignment4',
    courseId: 'course3',
    title: 'Binary Search Trees',
    description: 'Implement a binary search tree with insertion, deletion, and traversal methods.',
    dueDate: '2025-06-25',
    submissions: [
      {
        id: 'submission4',
        assignmentId: 'assignment4',
        studentId: 'student2',
        content: 'Here is my implementation of the binary search tree.',
        submittedAt: '2025-06-22'
      }
    ]
  },
  {
    id: 'assignment5',
    courseId: 'course2',
    title: 'Simulated Penetration Test',
    description: 'Perform a basic penetration test using Kali Linux tools on a vulnerable VM.',
    dueDate: '2025-07-01',
    submissions: [
      {
        id: 'submission5',
        assignmentId: 'assignment5',
        studentId: 'student1',
        content: 'Penetration test report including Nmap and Metasploit findings.',
        submittedAt: '2025-06-28',
        grade: 12,
        feedback: 'Good enumeration and clear reporting. Work on privilege escalation techniques.'
      }
    ]
  },
  {
    id: 'assignment6',
    courseId: 'course2',
    title: 'Firewall Rules and Packet Filtering',
    description: 'Configure iptables to block/allow traffic and analyze packet flow using Wireshark.',
    dueDate: '2025-07-10',
    submissions: []
  }
];


// Helper functions to work with the mock data
export const getCoursesByTeacherId = (teacherId: string): Course[] => {
  return courses.filter(course => course.teacherId === teacherId);
};

export const getCoursesByStudentId = (studentId: string): Course[] => {
  return courses.filter(course => course.students.includes(studentId));
};

export const getAssignmentsByCourseId = (courseId: string): Assignment[] => {
  return assignments.filter(assignment => assignment.courseId === courseId);
};

export const getSubmissionsByStudentId = (studentId: string): { assignment: Assignment, submission: any }[] => {
  const result = [];
  
  for (const assignment of assignments) {
    for (const submission of assignment.submissions) {
      if (submission.studentId === studentId) {
        result.push({ assignment, submission });
      }
    }
  }
  
  return result;
};

export const getStudentsInCourse = (courseId: string): User[] => {
  const course = courses.find(c => c.id === courseId);
  if (!course) return [];
  
  return users.filter(user => 
    user.role === 'ROLE_TEACHER' && course.students.includes(user.id)
  );
};

export const getTeacherForCourse = (courseId: string): User | undefined => {
  const course = courses.find(c => c.id === courseId);
  if (!course) return undefined;
  
  return users.find(user => user.id === course.teacherId);
};

export const generateCourseCode = (): string => {
  const subjects = ['MATH', 'PHYS', 'COMP', 'CHEM', 'BIO', 'ENG', 'HIST'];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  const code = Math.floor(Math.random() * 90) + 10;
  
  return `${subject}${number}-${letter1}${letter2}${code}`;
};