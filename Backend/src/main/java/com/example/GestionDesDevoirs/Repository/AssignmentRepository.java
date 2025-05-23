package com.example.GestionDesDevoirs.Repository;


import com.example.GestionDesDevoirs.Entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findById(Long id);
    @Query("SELECT a FROM Assignment a WHERE a.id = :id")
    Optional<Assignment> findAssignmentById(@Param("id") Long id);
    List<Assignment> findByCourseTeacherId(Long teacherId);
    @Query("SELECT a FROM Assignment a JOIN Submission s ON a.id = s.assignment.id WHERE s.student.id = :studentId")
    List<Assignment> findAssignmentsByStudentId(@Param("studentId") Long studentId);
}
