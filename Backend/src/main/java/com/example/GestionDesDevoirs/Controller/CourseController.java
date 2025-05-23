package com.example.GestionDesDevoirs.Controller;

import com.example.GestionDesDevoirs.DTO.CourseWithAssignmentsResponse;
import com.example.GestionDesDevoirs.DTO.CreateCourseRequest;
import com.example.GestionDesDevoirs.Entity.Assignment;
import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.User;
import com.example.GestionDesDevoirs.Service.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5175") // Adjust for frontend port
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CreateCourseRequest request, HttpServletRequest httpRequest) {
        Course course = courseService.createCourse(request, httpRequest);
        return new ResponseEntity<>(course, HttpStatus.CREATED);
    }

    @GetMapping("/with-assignments/{id}")
    public ResponseEntity<CourseWithAssignmentsResponse> getCourseWithAssignments(@PathVariable Long id) {

        System.out.println("Course with id: " + id);
        Course course = courseService.getCourseWithAssignments(id);

        if (course != null) {
            CourseWithAssignmentsResponse response = new CourseWithAssignmentsResponse();
            response.setId(course.getId());
            response.setTitle(course.getTitle());
            response.setCode(course.getCode());
            response.setSubject(course.getSubject());
            response.setDescription(course.getDescription());
            response.setLevel(course.getLevel());
            response.setAssignments(course.getAssignments()); // Attach assignments

            return ResponseEntity.ok(response); // Return the populated response
        } else {
            return ResponseEntity.notFound().build(); // Return 404 if course not found
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseWithAssignmentsResponse> getCourseById(@PathVariable Long id) {



        Course course = courseService.getCourseWithStudentsAndAssignments(id);

        // Convert Course entity to DTO
        CourseWithAssignmentsResponse courseDTO = new CourseWithAssignmentsResponse();
        courseDTO.setId(course.getId());
        courseDTO.setTitle(course.getTitle());
        courseDTO.setCode(course.getCode());
        courseDTO.setSubject(course.getSubject());
        courseDTO.setDescription(course.getDescription());
        courseDTO.setLevel(course.getLevel());


        List<Assignment> assignments = course.getAssignments();  // Get full assignment objects

        courseDTO.setAssignments(assignments);  // Add full assignment objects to DTO

        return ResponseEntity.ok(courseDTO);  // Return the populated courseDTO
    }



}

