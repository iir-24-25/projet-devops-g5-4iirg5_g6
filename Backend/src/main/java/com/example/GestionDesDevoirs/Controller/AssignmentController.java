package com.example.GestionDesDevoirs.Controller;

import com.example.GestionDesDevoirs.DTO.AssignmentDTO;
import com.example.GestionDesDevoirs.DTO.CourseWithAssignmentsResponse;
import com.example.GestionDesDevoirs.DTO.CreateAssignmentRequest;
import com.example.GestionDesDevoirs.DTO.GradeFeedbackDTO;
import com.example.GestionDesDevoirs.Entity.Assignment;
import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.Submission;
import com.example.GestionDesDevoirs.Entity.User;
import com.example.GestionDesDevoirs.JwtService;
import com.example.GestionDesDevoirs.Repository.UserRepository;
import com.example.GestionDesDevoirs.Service.AssignmentService;
import com.example.GestionDesDevoirs.Service.SubmissionService;
import com.example.GestionDesDevoirs.Service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private JwtService jwtService;  // For JWT token extraction
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubmissionService submissionService;



    // Save grade and feedback for a submission
    @PutMapping("/{courseId}/assignments/{aid}/submission/{submissionId}/grade")
    public ResponseEntity<?> saveGradeAndFeedback(
            @PathVariable Long courseId,
            @PathVariable Long aid,
            @PathVariable Long submissionId,
            @RequestBody GradeFeedbackDTO gradeFeedbackDTO
    ) {
        boolean isUpdated = assignmentService.saveGradeAndFeedback(submissionId, gradeFeedbackDTO);
        if (isUpdated) {
            return ResponseEntity.ok("Grade and feedback saved successfully.");
        } else {
            return ResponseEntity.status(500).body("Error saving grade and feedback.");
        }
    }

    @Autowired
    private UserService userService;

    // Endpoint to submit an assignment
    @PostMapping("/course/{courseId}/assignment/{assignmentId}/submit")
    public ResponseEntity<String> submitAssignment(
            @PathVariable("courseId") Long courseId,
            @PathVariable("assignmentId") Long assignmentId,
            @RequestParam("content") String content,
            @RequestHeader("Authorization") String authHeader) {

        // Extract JWT token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Authentication token missing or invalid.");
        }

        String token = authHeader.substring(7);  // Extract token from header
        String email = jwtService.extractEmail(token);  // Extract email from token

        // Find the current student by email
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Fetch the assignment using assignmentId
        Assignment assignment = assignmentService.getAssignmentById(assignmentId);
        if (assignment == null) {
            return ResponseEntity.status(404).body("Assignment not found");
        }


        if (!assignment.getCourse().getId().equals(courseId)) {
            return ResponseEntity.status(400).body("Assignment does not belong to the specified course");
        }

        // Check if the assignment due date has passed
        LocalDateTime dueDate = assignment.getDueDate();
        if (LocalDateTime.now().isAfter(dueDate)) {
            return ResponseEntity.status(400).body("The due date for this assignment has passed");
        }

        // Create a submission object
        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContent(content); // Set the content of the submission
        submission.setSubmittedAt((java.sql.Date) new Date()); // Set the submission time

        // Save the submission to the database
        submissionService.saveSubmission(submission);

        return ResponseEntity.ok("Assignment submitted successfully!");
    }

    @PostMapping("/{courseId}/assignments")
    public ResponseEntity<?> createAssignment(
            @PathVariable Long courseId,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam LocalDateTime dueDate,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            // Create a CreateAssignmentRequest object from the form data
            CreateAssignmentRequest request = new CreateAssignmentRequest();
            request.setTitle(title);
            request.setDescription(description);
            request.setDueDate(dueDate);

            // Call the service layer with the courseId, request, and files
            return ResponseEntity.ok(assignmentService.createAssignment(courseId, request, files));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading files");
        }
    }


    @GetMapping("/assignments/{id}")
    public ResponseEntity<AssignmentDTO> getAssignmentById(@PathVariable Long id) {
        try {
            Assignment assignment = assignmentService.getAssignmentById(id);
            // Convert to DTO and return
            AssignmentDTO assignmentDTO = convertAssignmentToDTO(assignment); // Assume this method exists to map Assignment to DTO
            return ResponseEntity.ok(assignmentDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if the assignment is not found
        }
    }

    private AssignmentDTO convertAssignmentToDTO(Assignment assignment) {
        AssignmentDTO assignmentDTO = new AssignmentDTO();
        assignmentDTO.setId(assignment.getId());
        assignmentDTO.setTitle(assignment.getTitle());
        assignmentDTO.setDescription(assignment.getDescription());
        assignmentDTO.setDueDate(assignment.getDueDate());
        assignmentDTO.setCreatedAt(assignment.getCreatedAt());

        // Convert course details
        CourseWithAssignmentsResponse courseDTO = new CourseWithAssignmentsResponse();
        courseDTO.setId(assignment.getCourse().getId());
        courseDTO.setTitle(assignment.getCourse().getTitle());
        courseDTO.setCode(assignment.getCourse().getCode());
        courseDTO.setSubject(assignment.getCourse().getSubject());
        courseDTO.setDescription(assignment.getCourse().getDescription());
        courseDTO.setLevel(assignment.getCourse().getLevel());

        assignmentDTO.setCourse(courseDTO);

        return assignmentDTO;
    }






}
