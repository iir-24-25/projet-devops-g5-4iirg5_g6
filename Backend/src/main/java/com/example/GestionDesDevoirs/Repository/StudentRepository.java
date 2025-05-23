package com.example.GestionDesDevoirs.Repository;

import com.example.GestionDesDevoirs.Entity.Enrollment;
import com.example.GestionDesDevoirs.Entity.Student;
import com.example.GestionDesDevoirs.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findById(User user);
}
