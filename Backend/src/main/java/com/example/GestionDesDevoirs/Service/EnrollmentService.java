package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.Enrollment;
import com.example.GestionDesDevoirs.Entity.User;
import com.example.GestionDesDevoirs.Repository.CourseRepository;
import com.example.GestionDesDevoirs.Repository.EnrollmentRepository;
import com.example.GestionDesDevoirs.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }



    public String enrollStudentInCourse(Long studentId, String courseCode) {
        // Find student by studentId
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        // Find course by courseCode
        Course course = courseRepository.findByCode(courseCode);
        if (course == null) {
            throw new RuntimeException("Course not found");
        }

        // Check if the student is already enrolled in this course
        boolean isAlreadyEnrolled = enrollmentRepository.existsByStudentAndCourse(student, course);
        if (isAlreadyEnrolled) {
            return "You are already enrolled in this course.";
        }

        // Create new enrollment
        Enrollment enrollment = new Enrollment(student, course);
        enrollment.setDateOfEnroll(LocalDateTime.now());

        // Save the enrollment
        enrollmentRepository.save(enrollment);

        return "Successfully enrolled in the course!";
    }

    public void save(Enrollment enrollment) {
        enrollmentRepository.save(enrollment);
    }
}

