// AssignmentList.tsx
import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Assignment } from '../../types';
import { useNavigate } from 'react-router-dom';

interface AssignmentListProps {
  assignments: Assignment[];
  courseId: string;
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, courseId }) => {
  const navigate = useNavigate();

  const handleGradeAssignment = (assignmentId: string) => {
    navigate(`/teacher/course/${courseId}/assignment/${assignmentId}`);
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">No assignments created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
  <Card key={assignment.id} className="transition-all duration-200 hover:shadow-md">
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <FileText size={16} className="mr-1" />
              <span>{assignment.submissions.length} submission{assignment.submissions.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => handleGradeAssignment(assignment.id)} className="whitespace-nowrap">
          Grade Submissions
        </Button>
      </div>
    </CardContent>
  </Card>
))}
    </div>
  );
};

export default AssignmentList;
