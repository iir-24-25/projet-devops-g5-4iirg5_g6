package com.example.GestionDesDevoirs.Repository;

import com.example.GestionDesDevoirs.Entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentId(Long studentId);

    @Override
    Optional<Submission> findById(Long aLong);

    Optional<Submission> findByStudentIdAndAssignmentId(Long assignmentId, Long studentId);

}
