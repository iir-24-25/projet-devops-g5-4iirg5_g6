package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.DTO.GradeResponse;
import com.example.GestionDesDevoirs.Entity.Assignment;
import com.example.GestionDesDevoirs.Entity.Submission;
import com.example.GestionDesDevoirs.Repository.AssignmentRepository;
import com.example.GestionDesDevoirs.Repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    // Method to fetch grades for a student
    public List<GradeResponse> getGradesForStudent(Long studentId) {
        // Fetch the submissions of the student
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);

        // Map the submissions to GradeResponse
        return submissions.stream().map(submission -> {
            // Fetch the corresponding assignment details
            Assignment assignment = assignmentRepository.findById(submission.getAssignment().getId())
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));

            // Create a GradeResponse from the submission and assignment data
            return new GradeResponse(
                    assignment.getId(),
                    assignment.getTitle(),
                    submission.getGrade(),
                    submission.getFeedback(),
                    assignment.getDueDate().toString()
            );
        }).collect(Collectors.toList());
    }
}
