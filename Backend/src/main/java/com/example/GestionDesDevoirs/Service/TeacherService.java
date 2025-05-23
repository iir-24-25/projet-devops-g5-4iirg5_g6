package com.example.GestionDesDevoirs.Service;

import com.example.GestionDesDevoirs.DTO.TeacherDashboardDTO;
import com.example.GestionDesDevoirs.Entity.Assignment;
import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.Submission;
import com.example.GestionDesDevoirs.Repository.AssignmentRepository;
import com.example.GestionDesDevoirs.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private CourseRepository courseRepo;

    @Autowired
    private AssignmentRepository assignmentRepo;

    public TeacherDashboardDTO getDashboardData(Long teacherId) {
        List<Course> teacherCourses = courseRepo.findByTeacherId(teacherId);
        int totalStudents = teacherCourses.stream()
                .mapToInt(c -> c.getStudents().size())
                .sum();

        List<Assignment> assignments = assignmentRepo.findByCourseTeacherId(teacherId);

        int pendingGrading = assignments.stream()
                .flatMap(a -> a.getSubmissions().stream())
                .filter(s -> s.getGrade() == null)
                .toList()
                .size();

        long gradedCount = assignments.stream()
                .flatMap(a -> a.getSubmissions().stream())
                .filter(s -> s.getGrade() != null)
                .count();

        double avgGrade = assignments.stream()
                .flatMap(a -> a.getSubmissions().stream())
                .filter(s -> s.getGrade() != null)
                .mapToDouble(Submission::getGrade)
                .average()
                .orElse(0);

        return new TeacherDashboardDTO(
                teacherCourses.size(),
                totalStudents,
                assignments.size(),
                pendingGrading,
                avgGrade,
                teacherCourses
        );
    }
}

