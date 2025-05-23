package com.example.GestionDesDevoirs.Controller;

import com.example.GestionDesDevoirs.DTO.EnrollmentRequest;
import com.example.GestionDesDevoirs.DTO.JoinCourseRequest;
import com.example.GestionDesDevoirs.DTO.StudentDashboardDTO;
import com.example.GestionDesDevoirs.Entity.*;
import com.example.GestionDesDevoirs.JwtService;
import com.example.GestionDesDevoirs.Repository.CourseRepository;
import com.example.GestionDesDevoirs.Repository.EnrollmentRepository;
import com.example.GestionDesDevoirs.Repository.UserRepository;
import com.example.GestionDesDevoirs.Service.EnrollmentService;
import com.example.GestionDesDevoirs.Service.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        // Find teacher by email
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Proceed to fetch dashboard data for the student
        StudentDashboardDTO dashboardDTO = studentService.getDashboardData(student.getId());
        return ResponseEntity.ok(dashboardDTO);
    }


    // Join a course
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;


    @PostMapping("/join-course")
    public ResponseEntity<String> joinCourse(@RequestBody EnrollmentRequest request) {
        try {
            // Call the service to enroll the student
            String responseMessage = enrollmentService.enrollStudentInCourse(request.getStudentId(), request.getCourseCode());
            return ResponseEntity.ok(responseMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCoursesForStudent(@RequestParam Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);

        if (enrollments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // No content found for the student
        }


        List<Course> courses = enrollments.stream()
                .map(Enrollment::getCourse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(courses);
    }



}
