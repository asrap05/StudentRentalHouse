package com.rentalhouse.controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * LoginServlet — handles admin/staff authentication.
 * POST /api/login   → validate credentials, create session
 * GET  /api/login   → logout (invalidate session)
 */
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        boolean authenticated = false;
        String role = "";

        if ("admin".equals(username) && "admin123".equals(password)) {
            authenticated = true;
            role = "admin";
        } else if ("staff".equals(username) && "staff123".equals(password)) {
            authenticated = true;
            role = "staff";
        }

        if (authenticated) {
            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            session.setAttribute("role", role);
            response.sendRedirect("index.jsp#dashboard");
        } else {
            request.setAttribute("error", "Invalid username or password.");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        response.sendRedirect("index.jsp");
    }
}
