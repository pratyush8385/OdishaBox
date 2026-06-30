package com.odishabox.backend.dto;

import java.util.List;

public record AdminDashboardDto(
    double totalRevenue,
    long totalOrders,
    long totalCustomers,
    long lowStockAlerts,
    List<Double> monthlyRevenue,
    List<String> months
) {}
