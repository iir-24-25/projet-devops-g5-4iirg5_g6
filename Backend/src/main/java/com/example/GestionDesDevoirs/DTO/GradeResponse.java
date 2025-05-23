package com.example.GestionDesDevoirs.DTO;

public class GradeResponse {

    private Long assignmentId;
    private String assignmentTitle;
    private Double grade;
    private String feedback;
    private String dueDate;

    public GradeResponse(Long assignmentId, String assignmentTitle, Double grade, String feedback, String dueDate) {
        this.assignmentId = assignmentId;
        this.assignmentTitle = assignmentTitle;
        this.grade = grade;
        this.feedback = feedback;
        this.dueDate = dueDate;
    }

    public GradeResponse(String title, double grade, String feedback) {
        this.assignmentTitle = title;
        this.grade = grade;
        this.feedback = feedback;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getAssignmentTitle() {
        return assignmentTitle;
    }

    public void setAssignmentTitle(String assignmentTitle) {
        this.assignmentTitle = assignmentTitle;
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
