import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Assignment } from '../../types';

interface AssignmentCardProps {
  assignment: Assignment;
  courseId: string;
  studentId: string;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, courseId, studentId }) => {
  const navigate = useNavigate();
  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  const isPastDue = today > dueDate;
  
  // Check if student has submitted
  const studentSubmission = assignment.submissions.find(
    submission => submission.studentId === studentId
  );
  
  const handleViewAssignment = () => {
    navigate(`/student/course/${courseId}/assignment/${assignment.id}`);
  };
  
  // Calculate status
  let statusIcon;
  let statusText;
  let statusColor;
  
  if (studentSubmission && studentSubmission.grade) {
    statusIcon = <CheckCircle size={16} className="mr-1" />;
    statusText = "Graded";
    statusColor = "text-green-600 bg-green-50";
  } else if (studentSubmission) {
    statusIcon = <CheckCircle size={16} className="mr-1" />;
    statusText = "Submitted";
    statusColor = "text-blue-600 bg-blue-50";
  } else if (isPastDue) {
    statusIcon = <AlertCircle size={16} className="mr-1" />;
    statusText = "Past Due";
    statusColor = "text-red-600 bg-red-50";
  } else {
    statusIcon = <Clock size={16} className="mr-1" />;
    statusText = "Due Soon";
    statusColor = "text-yellow-600 bg-yellow-50";
  }

  return (
    <Card className="h-full transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusColor}`}>
            {statusIcon}
            {statusText}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {assignment.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-1" />
          <span>Due: {dueDate.toLocaleDateString()}</span>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-3">
        <Button 
          variant={studentSubmission ? "outline" : "primary"} 
          fullWidth 
          onClick={handleViewAssignment}
        >
          {studentSubmission ? "View Submission" : "Submit Assignment"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssignmentCard;