package com.example.GestionDesDevoirs.Repository;

import com.example.GestionDesDevoirs.Entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherId(Long teacherId);

    boolean existsByCode(String code);

    Course findByCode(String code);
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.assignments WHERE c.id = :courseId")
    Course findCourseWithAssignments(@Param("courseId") Long courseId);
}
