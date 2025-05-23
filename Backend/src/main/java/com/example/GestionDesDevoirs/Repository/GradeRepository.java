package com.example.GestionDesDevoirs.Repository;

import com.example.GestionDesDevoirs.Entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    // Find all grades by student ID
    List<Grade> findByStudentId(Long studentId);

    // Optionally, you could have more methods to find grades for a specific assignment or course
    List<Grade> findByAssignmentId(Long assignmentId);
}
