package com.example.GestionDesDevoirs.Entity;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("TEACHER")
public class Teacher extends User {
    private String teacherField;

    public String getTeacherField() {
        return teacherField;
    }

    public void setTeacherField(String teacherField) {
        this.teacherField = teacherField;
    }
}
