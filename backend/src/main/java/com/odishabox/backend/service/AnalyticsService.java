package com.odishabox.backend.service;

import com.odishabox.backend.dto.AdminDashboardDto;
import com.odishabox.backend.model.Order;
import com.odishabox.backend.model.Product;
import com.odishabox.backend.repository.OrderRepository;
import com.odishabox.backend.repository.ProductRepository;
import com.odishabox.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public AnalyticsService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public AdminDashboardDto getDashboardSummary() {
        List<Order> orders = orderRepository.findAll();
        
        double totalRevenue = orders.stream()
                .filter(o -> "CONFIRMED".equalsIgnoreCase(o.getStatus()) || "DELIVERED".equalsIgnoreCase(o.getStatus()) || "SHIPPED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(Order::getTotal)
                .sum();
        
        long totalOrders = orders.size();
        long totalCustomers = userRepository.count() - 1;
        if (totalCustomers < 0) totalCustomers = 0;
        
        List<Product> products = productRepository.findAll();
        long lowStockAlerts = products.stream()
                .filter(p -> p.getStockQuantity() <= 10)
                .count();

        List<Double> monthlyRevenue = Arrays.asList(
                totalRevenue * 0.15,
                totalRevenue * 0.20,
                totalRevenue * 0.25,
                totalRevenue * 0.40
        );
        List<String> months = Arrays.asList("March", "April", "May", "June");

        return new AdminDashboardDto(
                Math.round(totalRevenue * 100.0) / 100.0,
                totalOrders,
                totalCustomers,
                lowStockAlerts,
                monthlyRevenue,
                months
        );
    }
}
