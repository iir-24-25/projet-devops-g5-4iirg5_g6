package com.example.GestionDesDevoirs.Service;


import com.example.GestionDesDevoirs.DTO.CreateCourseRequest;
import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.User;
import com.example.GestionDesDevoirs.JwtService;
import com.example.GestionDesDevoirs.Repository.CourseRepository;
import com.example.GestionDesDevoirs.Repository.StudentRepository;
import com.example.GestionDesDevoirs.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Course createCourse(CreateCourseRequest request, HttpServletRequest httpRequest) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Course code already exists");
        }

        // Extract token from Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);

        // Extract teacher's email from token
        String email = jwtService.extractEmail(token);

        // Load teacher (User) from DB
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Build course
        Course course = new Course();
        course.setCode(request.getCode());
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setSubject(request.getSubject());
        course.setLevel(request.getLevel());
        course.setTeacher(teacher); // ✅ SET TEACHER

        return courseRepository.save(course);
    }

    public Course getCourseWithStudentsAndAssignments(Long courseId) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        // Ensure the course is found
        Course course = courseOpt.orElseThrow(() ->
                new RuntimeException("Course not found with ID: " + courseId));

        // Trigger lazy loading for students and assignments
        course.getStudents().size();     // triggers lazy loading for students
        course.getAssignments().size();  // triggers lazy loading for assignments

        return course;
    }


    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course getCourseWithAssignments(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
    }




}
