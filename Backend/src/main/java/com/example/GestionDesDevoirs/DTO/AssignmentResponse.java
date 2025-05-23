package com.example.GestionDesDevoirs.DTO;

public class AssignmentResponse {
    private Long id;
    private String title;
    private Double grade;
    private String feedback;
    private String dueDate;

    public AssignmentResponse(Long id, String title, Double grade, String feedback, String dueDate) {
        this.id = id;
        this.title = title;
        this.grade = grade;
        this.feedback = feedback;
        this.dueDate = dueDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}
