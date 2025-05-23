package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.DTO.AssignmentDTO;
import com.example.GestionDesDevoirs.DTO.AssignmentResponse;
import com.example.GestionDesDevoirs.DTO.CreateAssignmentRequest;
import com.example.GestionDesDevoirs.DTO.GradeFeedbackDTO;
import com.example.GestionDesDevoirs.Entity.Assignment;
import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.Submission;
import com.example.GestionDesDevoirs.Repository.AssignmentRepository;
import com.example.GestionDesDevoirs.Repository.CourseRepository;
import com.example.GestionDesDevoirs.Repository.SubmissionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.expression.spel.ast.Assign;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public Assignment createAssignment(Long courseId, CreateAssignmentRequest request, List<MultipartFile> files) throws IOException {
        // Fetch the course by ID
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Create a new assignment
        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());
        assignment.setCourse(course);

        // Save the files and get their paths
        String filePaths = saveFiles(files);
        assignment.setFilePaths(filePaths);  // Store the file paths in the assignment

        // Save the assignment to the database
        return assignmentRepository.save(assignment);
    }


    private Course findCourseById(Long courseId) {
        // Logic to find course by ID
        return courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
    }




    private String saveFiles(List<MultipartFile> files) throws IOException {
        StringBuilder filePaths = new StringBuilder();
        for (MultipartFile file : files) {
            String path = "uploads/" + file.getOriginalFilename(); // Save files in the 'uploads/' folder
            Files.copy(file.getInputStream(), Paths.get(path)); // Save file to disk

            if (filePaths.length() > 0) {
                filePaths.append(",");
            }
            filePaths.append(path); // Append the file path
        }
        return filePaths.toString();
    }



    // Save grade and feedback for a submission
    public boolean saveGradeAndFeedback(Long submissionId, GradeFeedbackDTO gradeFeedbackDTO) {
        // Find submission by id
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        // Update grade and feedback
        submission.setGrade(gradeFeedbackDTO.getGrade());
        submission.setFeedback(gradeFeedbackDTO.getFeedback());

        // Save the updated submission
        submissionRepository.save(submission);

        return true;
    }
    public List<AssignmentResponse> getAssignmentsForStudent(Long studentId) {
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);

        return submissions.stream().map(submission -> {
            Assignment assignment = assignmentRepository.findById(submission.getAssignment().getId()).orElse(null);
            return new AssignmentResponse(
                    assignment.getId(),
                    assignment.getTitle(),
                    submission.getGrade(),
                    submission.getFeedback(),
                    assignment.getDueDate().toString()
            );
        }).collect(Collectors.toList());
    }

    // Get upcoming assignments for the student
    public List<AssignmentResponse> getUpcomingAssignments(Long studentId) {
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        return submissions.stream()
                .filter(submission -> submission.getGrade() == null) // Filter for ungraded submissions
                .map(submission -> {
                    Assignment assignment = assignmentRepository.findById(submission.getAssignment().getId()).orElse(null);
                    return new AssignmentResponse(
                            assignment.getId(),
                            assignment.getTitle(),
                            null,
                            null,
                            assignment.getDueDate().toString()
                    );
                })
                .collect(Collectors.toList());
    }

    // Get assignment by ID
    public Assignment getAssignmentById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found with id: " + assignmentId));
    }



    // Save the submission
    public void saveSubmission(Submission submission) {
        submissionRepository.save(submission);
    }
}

