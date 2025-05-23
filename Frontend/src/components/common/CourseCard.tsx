import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Code } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  role: 'ROLE_TEACHER' | 'ROLE_STUDENT';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, role }) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    if (role === 'ROLE_TEACHER') {
      navigate(`/teacher/course/${course.id}`);
    } else {
      navigate(`/student/course/${course.id}`);
    }
  };

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
          <div className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
            {course.level}
          </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Code size={16} className="mr-1" />
          <span>{course.code}</span>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <BookOpen size={16} className="mr-1" />
          <span>{course.subject}</span>
        </div>

        {role === 'ROLE_TEACHER' && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Users size={16} className="mr-1" />
            <span>{course.students.length} Students</span>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <Button 
          variant="primary" 
          fullWidth 
          onClick={handleViewCourse}
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;