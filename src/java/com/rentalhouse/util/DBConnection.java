package com.rentalhouse.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBConnection — manages MySQL database connections.
 * TODO: Replace placeholder values with actual credentials.
 */
public class DBConnection {

    // ─── Configure these for your environment ───
    private static final String DB_URL      = "jdbc:mysql://localhost:3306/student_rental_house";
    private static final String DB_USER     = "root";
    private static final String DB_PASSWORD = "admin";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC Driver not found. Add mysql-connector-java to WEB-INF/lib/", e);
        }
    }

    /**
     * Returns a new database connection.
     * Caller must close the connection after use.
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }
}
