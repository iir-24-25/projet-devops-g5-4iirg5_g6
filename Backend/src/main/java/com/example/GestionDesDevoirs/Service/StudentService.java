package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.DTO.JoinCourseRequest;
import com.example.GestionDesDevoirs.DTO.StudentDashboardDTO;
import com.example.GestionDesDevoirs.Entity.*;
import com.example.GestionDesDevoirs.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public StudentDashboardDTO getDashboardData(Long studentId) {
        // Fetch courses the student is enrolled in
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<Course> courses = enrollments.stream()
                .map(Enrollment::getCourse)
                .toList();

        // Calculate total courses
        int totalCourses = courses.size();

        // Fetch submissions for the student
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);

        // Calculate the total assignments
        int totalAssignments = submissions.size();

        // Calculate completed assignments
        int completedAssignments = (int) submissions.stream()
                .filter(submission -> submission.getGrade() != null)
                .count();

        // Calculate average grade
        double averageGrade = submissions.isEmpty() ? 0 : submissions.stream()
                .filter(submission -> submission.getGrade() != null)
                .mapToDouble(Submission::getGrade)
                .average()
                .orElse(0);

        return new StudentDashboardDTO(totalCourses, totalAssignments, completedAssignments, averageGrade, courses);
    }

}
