package com.rentalhouse.controller;

import com.rentalhouse.model.Complaint;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ComplaintServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final List<Complaint> complaintStore = new ArrayList<>();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || "/".equals(pathInfo)) {
            request.setAttribute("complaints", complaintStore);
        } else {
            String id = pathInfo.substring(1);
            request.setAttribute("complaint", complaintStore.stream()
                    .filter(c -> c.getComplaintId().equals(id)).findFirst().orElse(null));
        }
        request.setAttribute("activePage", "complaint");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String methodOverride = request.getParameter("_method");
        String pathInfo = request.getPathInfo();

        if ("DELETE".equalsIgnoreCase(methodOverride)) {
            doDelete(request, response);
            return;
        }

        if ("PUT".equalsIgnoreCase(methodOverride) && pathInfo != null && pathInfo.length() > 1) {
            String newStatus = request.getParameter("status");
            complaintStore.stream().filter(c -> c.getComplaintId().equals(pathInfo.substring(1)))
                    .findFirst().ifPresent(c -> c.setStatus(newStatus));
        } else {
            complaintStore.add(new Complaint(
                    String.format("C-%03d", complaintStore.size() + 1),
                    request.getParameter("description"),
                    request.getParameter("tenantId"),
                    request.getParameter("dateSubmitted") != null
                            ? LocalDate.parse(request.getParameter("dateSubmitted")) : LocalDate.now(),
                    request.getParameter("status") != null ? request.getParameter("status") : "Pending"));
        }
        response.sendRedirect("index.jsp#complaint");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1)
            complaintStore.removeIf(c -> c.getComplaintId().equals(pathInfo.substring(1)));
        response.sendRedirect("index.jsp#complaint");
    }
}
