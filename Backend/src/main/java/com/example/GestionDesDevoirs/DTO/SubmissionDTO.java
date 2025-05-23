package com.example.GestionDesDevoirs.DTO;

import com.example.GestionDesDevoirs.Entity.Submission;
import com.example.GestionDesDevoirs.Entity.User;

public class SubmissionDTO {
    private Long id;
    private String studentName;
    private String content;
    private Double grade;
    private String feedback;
    private String submittedAt;

    public SubmissionDTO(Submission submission, User student) {
        this.id = submission.getId();
        this.studentName = student != null ? student.getFullName() : "Unknown Student";
        this.content = submission.getContent();
        this.grade = submission.getGrade();
        this.feedback = submission.getFeedback();
        this.submittedAt = submission.getSubmittedAt().toString();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }
}

