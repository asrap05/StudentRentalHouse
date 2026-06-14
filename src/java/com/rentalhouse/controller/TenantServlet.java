package com.rentalhouse.controller;

import com.rentalhouse.model.Tenant;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TenantServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final List<Tenant> tenantStore = new ArrayList<>();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || "/".equals(pathInfo)) {
            request.setAttribute("tenants", tenantStore);
        } else {
            String id = pathInfo.substring(1);
            request.setAttribute("tenant", tenantStore.stream()
                    .filter(t -> t.getTenantId().equals(id)).findFirst().orElse(null));
        }
        request.setAttribute("activePage", "tenant");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        if ("DELETE".equalsIgnoreCase(request.getParameter("_method"))) {
            doDelete(request, response);
            return;
        }

        LocalDate moveIn = request.getParameter("moveInDate") != null
                ? LocalDate.parse(request.getParameter("moveInDate")) : LocalDate.now();
        String tenantId = String.format("T-%03d", tenantStore.size() + 1);

        tenantStore.add(new Tenant(tenantId,
                request.getParameter("fullName"),
                request.getParameter("phone"),
                request.getParameter("matricNo"),
                request.getParameter("email"),
                request.getParameter("gender"),
                request.getParameter("assignedHouseId"),
                moveIn));
        response.sendRedirect("index.jsp#tenant");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1)
            tenantStore.removeIf(t -> t.getTenantId().equals(pathInfo.substring(1)));
        response.sendRedirect("index.jsp#tenant");
    }
}
