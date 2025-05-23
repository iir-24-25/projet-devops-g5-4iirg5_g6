package com.example.GestionDesDevoirs.Entity;


import jakarta.persistence.*;

@Entity
@DiscriminatorValue("STUDENT")
public class Student extends User {
    private String studentField;

    public String getStudentField() {
        return studentField;
    }

    public void setStudentField(String studentField) {
        this.studentField = studentField;
    }
}

