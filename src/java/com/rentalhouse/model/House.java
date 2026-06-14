package com.rentalhouse.model;

import java.io.Serializable;

/**
 * House model — represents a student rental house record.
 */
public class House implements Serializable {
    private static final long serialVersionUID = 1L;

    private String houseId;
    private String location;
    private double monthlyPrice;
    private int rooms;
    private String status;     // Available | Occupied | Maintenance

    public House() {}

    public House(String houseId, String location, double monthlyPrice, int rooms, String status) {
        this.houseId = houseId;
        this.location = location;
        this.monthlyPrice = monthlyPrice;
        this.rooms = rooms;
        this.status = status;
    }

    // ─── Getters & Setters ───

    public String getHouseId()                    { return houseId; }
    public void setHouseId(String houseId)        { this.houseId = houseId; }

    public String getLocation()                   { return location; }
    public void setLocation(String location)      { this.location = location; }

    public double getMonthlyPrice()               { return monthlyPrice; }
    public void setMonthlyPrice(double price)     { this.monthlyPrice = price; }

    public int getRooms()                         { return rooms; }
    public void setRooms(int rooms)               { this.rooms = rooms; }

    public String getStatus()                     { return status; }
    public void setStatus(String status)          { this.status = status; }
}
