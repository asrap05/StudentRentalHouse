package com.rentalhouse.model;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * Complaint model — represents a tenant complaint record.
 */
public class Complaint implements Serializable {
    private static final long serialVersionUID = 1L;

    private String complaintId;
    private String description;
    private String tenantId;        // FK → tenant.tenant_id
    private LocalDate dateSubmitted;
    private String status;          // Pending | In Progress | Resolved

    public Complaint() {}

    public Complaint(String complaintId, String description, String tenantId,
                     LocalDate dateSubmitted, String status) {
        this.complaintId = complaintId;
        this.description = description;
        this.tenantId = tenantId;
        this.dateSubmitted = dateSubmitted;
        this.status = status;
    }

    // ─── Getters & Setters ───

    public String getComplaintId()                 { return complaintId; }
    public void setComplaintId(String id)          { this.complaintId = id; }

    public String getDescription()                 { return description; }
    public void setDescription(String desc)        { this.description = desc; }

    public String getTenantId()                    { return tenantId; }
    public void setTenantId(String tenantId)       { this.tenantId = tenantId; }

    public LocalDate getDateSubmitted()            { return dateSubmitted; }
    public void setDateSubmitted(LocalDate date)   { this.dateSubmitted = date; }

    public String getStatus()                      { return status; }
    public void setStatus(String status)           { this.status = status; }
}
