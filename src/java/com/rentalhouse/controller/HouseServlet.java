package com.rentalhouse.controller;

import com.rentalhouse.model.House;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HouseServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final List<House> houseStore = new ArrayList<>();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if (pathInfo == null || "/".equals(pathInfo)) {
            request.setAttribute("houses", houseStore);
        } else {
            String id = pathInfo.substring(1);
            House found = houseStore.stream()
                    .filter(h -> h.getHouseId().equals(id))
                    .findFirst().orElse(null);
            request.setAttribute("house", found);
        }
        request.setAttribute("activePage", "house");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        String methodOverride = request.getParameter("_method");

        if ("DELETE".equalsIgnoreCase(methodOverride)) {
            doDelete(request, response);
            return;
        }
        if ("PUT".equalsIgnoreCase(methodOverride) && pathInfo != null && pathInfo.length() > 1) {
            updateHouse(pathInfo.substring(1), request);
        } else {
            createHouse(request);
        }
        response.sendRedirect("index.jsp#house");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            houseStore.removeIf(h -> h.getHouseId().equals(pathInfo.substring(1)));
        }
        response.sendRedirect("index.jsp#house");
    }

    private void createHouse(HttpServletRequest request) {
        String location = request.getParameter("location");
        double price = Double.parseDouble(request.getParameter("price"));
        int rooms = Integer.parseInt(request.getParameter("rooms"));
        String status = request.getParameter("status");
        String houseId = String.format("H-%03d", houseStore.size() + 1);
        houseStore.add(new House(houseId, location, price, rooms, status));
    }

    private void updateHouse(String id, HttpServletRequest request) {
        houseStore.stream().filter(h -> h.getHouseId().equals(id)).findFirst().ifPresent(h -> {
            String loc = request.getParameter("location");
            String pr = request.getParameter("price");
            String rm = request.getParameter("rooms");
            String st = request.getParameter("status");
            if (loc != null) h.setLocation(loc);
            if (pr != null) h.setMonthlyPrice(Double.parseDouble(pr));
            if (rm != null) h.setRooms(Integer.parseInt(rm));
            if (st != null) h.setStatus(st);
        });
    }
}
