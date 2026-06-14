package com.rentalhouse.model;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Tenant model — represents a student tenant record.
 */
public class Tenant implements Serializable {
    private static final long serialVersionUID = 1L;

    private String tenantId;
    private String fullName;
    private String phone;
    private String matricNo;
    private String email;
    private String gender;
    private String assignedHouseId;   // FK → house.house_id
    private LocalDate moveInDate;

    public Tenant() {}

    public Tenant(String tenantId, String fullName, String phone, String matricNo,
                  String email, String gender, String assignedHouseId, LocalDate moveInDate) {
        this.tenantId = tenantId;
        this.fullName = fullName;
        this.phone = phone;
        this.matricNo = matricNo;
        this.email = email;
        this.gender = gender;
        this.assignedHouseId = assignedHouseId;
        this.moveInDate = moveInDate;
    }

    // ─── Getters & Setters ───

    public String getTenantId()                    { return tenantId; }
    public void setTenantId(String tenantId)       { this.tenantId = tenantId; }

    public String getFullName()                    { return fullName; }
    public void setFullName(String fullName)       { this.fullName = fullName; }

    public String getPhone()                       { return phone; }
    public void setPhone(String phone)             { this.phone = phone; }

    public String getMatricNo()                    { return matricNo; }
    public void setMatricNo(String matricNo)       { this.matricNo = matricNo; }

    public String getEmail()                       { return email; }
    public void setEmail(String email)             { this.email = email; }

    public String getGender()                      { return gender; }
    public void setGender(String gender)           { this.gender = gender; }

    public String getAssignedHouseId()             { return assignedHouseId; }
    public void setAssignedHouseId(String id)      { this.assignedHouseId = id; }

    public LocalDate getMoveInDate()               { return moveInDate; }
    public void setMoveInDate(LocalDate date)      { this.moveInDate = date; }
}
