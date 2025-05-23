package com.example.GestionDesDevoirs.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollment")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "date_of_enroll")
    private LocalDateTime dateOfEnroll;

    public Enrollment(User student, Course course) {
        this.student = student;
        this.course = course;
    }

    public Enrollment() {
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public User getStudent() {
        return student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public LocalDateTime getDateOfEnroll() {
        return dateOfEnroll;
    }

    public void setDateOfEnroll(LocalDateTime dateOfEnroll) {
        this.dateOfEnroll = dateOfEnroll;
    }
}
