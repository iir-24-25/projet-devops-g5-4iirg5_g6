package com.example.GestionDesDevoirs.DTO;

import com.example.GestionDesDevoirs.Entity.Course;

import java.util.List;

public class TeacherDashboardDTO {
    private int totalCourses;
    private int totalStudents;
    private int totalAssignments;
    private int pendingGrading;
    private double averageGrade;
    private List<Course> courses;
    public TeacherDashboardDTO(int totalCourses, int totalStudents, int totalAssignments, int pendingGrading, double averageGrade, List<Course> courses) {
        this.totalCourses = totalCourses;
        this.totalStudents = totalStudents;
        this.totalAssignments = totalAssignments;
        this.pendingGrading = pendingGrading;
        this.averageGrade = averageGrade;
        this.courses = courses;
    }

    public int getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(int totalCourses) {
        this.totalCourses = totalCourses;
    }

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public int getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(int totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public int getPendingGrading() {
        return pendingGrading;
    }

    public void setPendingGrading(int pendingGrading) {
        this.pendingGrading = pendingGrading;
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
    // Constructors, Getters, Setters
}

