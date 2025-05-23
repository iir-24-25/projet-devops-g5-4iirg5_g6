package com.example.GestionDesDevoirs.DTO;

import com.example.GestionDesDevoirs.Entity.Course;

import java.util.List;

public class StudentDashboardDTO {
    private int totalCourses;
    private int totalAssignments;
    private int completedAssignments;
    private double averageGrade;
    private List<Course> courses; // List of courses the student is enrolled in

    public StudentDashboardDTO(int totalCourses, int totalAssignments, int completedAssignments, double averageGrade, List<Course> courses) {
        this.totalCourses = totalCourses;
        this.totalAssignments = totalAssignments;
        this.completedAssignments = completedAssignments;
        this.averageGrade = averageGrade;
        this.courses = courses;
    }

    // Getters and Setters

    public int getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(int totalCourses) {
        this.totalCourses = totalCourses;
    }

    public int getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(int totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public int getCompletedAssignments() {
        return completedAssignments;
    }

    public void setCompletedAssignments(int completedAssignments) {
        this.completedAssignments = completedAssignments;
    }

    public double getAverageGrade() {
        return averageGrade;
    }

    public void setAverageGrade(double averageGrade) {
        this.averageGrade = averageGrade;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }
}
