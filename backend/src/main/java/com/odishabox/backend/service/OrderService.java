package com.odishabox.backend.service;

import com.odishabox.backend.dto.CartItemDto;
import com.odishabox.backend.dto.CheckoutRequest;
import com.odishabox.backend.model.*;
import com.odishabox.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final CouponService couponService;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        AddressRepository addressRepository, CouponService couponService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.couponService = couponService;
    }

    @Transactional
    public Order createOrder(User user, CheckoutRequest request) {
        Address address = addressRepository.findById(request.addressId())
                .orElseThrow(() -> new RuntimeException("Address not found"));
        
        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized address access");
        }

        String fullAddressString = String.format("%s, %s, %s - %s. Phone: %s",
                address.getStreetAddress(), address.getCity(), address.getState(),
                address.getZipCode(), address.getPhoneNumber());

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setDeliveryAddress(fullAddressString);
        order.setDeliverySlot(request.deliverySlot());
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus("PENDING");

        double subtotal = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItemDto itemDto : request.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.productId()));

            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            double priceAfterDiscount = product.getPrice() * (1 - product.getDiscountPercentage() / 100.0);
            subtotal += priceAfterDiscount * itemDto.quantity();

            OrderItem orderItem = new OrderItem(order, product, itemDto.quantity(), priceAfterDiscount);
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setSubtotal(subtotal);

        double tax = subtotal * 0.05;
        order.setTax(tax);

        double discount = 0;
        if (request.couponCode() != null && !request.couponCode().trim().isEmpty()) {
            try {
                Coupon coupon = couponService.validateAndGetCoupon(request.couponCode(), subtotal);
                discount = subtotal * (coupon.getDiscountPercentage() / 100.0);
                if (discount > coupon.getMaxDiscount()) {
                    discount = coupon.getMaxDiscount();
                }
                order.setDiscount(discount);
            } catch (Exception e) {
                order.setDiscount(0);
            }
        }

        double deliveryCharges = (subtotal - discount >= 499) ? 0.0 : 49.0;
        if ("COD".equalsIgnoreCase(request.paymentMethod())) {
            deliveryCharges += 15.0;
        }
        order.setDeliveryCharges(deliveryCharges);

        double total = subtotal + tax + deliveryCharges - discount;
        order.setTotal(total);

        if ("COD".equalsIgnoreCase(request.paymentMethod())) {
            order.setStatus("CONFIRMED");
            order.setPaymentStatus("PENDING");
            
            for (OrderItem item : orderItems) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                productRepository.save(product);
            }
        } else {
            order.setRazorpayOrderId("order_" + UUID.randomUUID().toString().substring(0, 14));
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order verifyPayment(Long orderId, String razorpayPaymentId, String razorpaySignature) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"PENDING".equalsIgnoreCase(order.getStatus())) {
            return order;
        }

        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setRazorpaySignature(razorpaySignature);
        order.setPaymentStatus("COMPLETED");
        order.setStatus("CONFIRMED");

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);
        }

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        if ("DELIVERED".equalsIgnoreCase(status)) {
            order.setPaymentStatus("COMPLETED");
        }
        return orderRepository.save(order);
    }
}
