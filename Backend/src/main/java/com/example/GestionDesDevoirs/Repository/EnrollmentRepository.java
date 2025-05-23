package com.example.GestionDesDevoirs.Repository;

import com.example.GestionDesDevoirs.Entity.Assignment;
import com.example.GestionDesDevoirs.Entity.Course;
import com.example.GestionDesDevoirs.Entity.Enrollment;
import com.example.GestionDesDevoirs.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByStudentAndCourse(User student, Course course);
    List<Enrollment> findByStudentId(Long studentId);
}
