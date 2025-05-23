package com.example.GestionDesDevoirs.DTO;

import java.time.LocalDateTime;

public class JoinCourseRequest {

    private String courseCode;
    private Long studentId;
    private LocalDateTime dateOfEnroll;

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public LocalDateTime getDateOfEnroll() {
        return dateOfEnroll;
    }

    public void setDateOfEnroll(LocalDateTime dateOfEnroll) {
        this.dateOfEnroll = dateOfEnroll;
    }
}
