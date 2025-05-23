package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.Entity.Submission;
import com.example.GestionDesDevoirs.Repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    @Autowired
    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    // Save the submission in the database
    public Submission saveSubmission(Submission submission) {
        return submissionRepository.save(submission);
    }

    // Fetch submission by student and assignment
    public Optional<Submission> getSubmissionByStudentAndAssignment(Long studentId, Long assignmentId) {
        return submissionRepository.findByStudentIdAndAssignmentId(studentId, assignmentId);
    }
}
