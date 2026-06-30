package com.odishabox.backend.controller;

import com.odishabox.backend.dto.AdminDashboardDto;
import com.odishabox.backend.model.Coupon;
import com.odishabox.backend.model.Order;
import com.odishabox.backend.model.Product;
import com.odishabox.backend.service.AnalyticsService;
import com.odishabox.backend.service.CouponService;
import com.odishabox.backend.service.OrderService;
import com.odishabox.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final OrderService orderService;
    private final ProductService productService;
    private final CouponService couponService;

    public AdminController(AnalyticsService analyticsService, OrderService orderService,
                           ProductService productService, CouponService couponService) {
        this.analyticsService = analyticsService;
        this.orderService = orderService;
        this.productService = productService;
        this.couponService = couponService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product saved = productService.saveProduct(product);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = productService.getProductById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setDiscountPercentage(productDetails.getDiscountPercentage());
        product.setWeight(productDetails.getWeight());
        product.setStockQuantity(productDetails.getStockQuantity());
        if (productDetails.getImagePath() != null) {
            product.setImagePath(productDetails.getImagePath());
        }
        product.setIngredients(productDetails.getIngredients());
        product.setNutrition(productDetails.getNutrition());
        product.setShelfLife(productDetails.getShelfLife());
        product.setBestSeller(productDetails.isBestSeller());
        product.setNewArrival(productDetails.isNewArrival());
        product.setFestivalSpecial(productDetails.isFestivalSpecial());

        Product updated = productService.saveProduct(product);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        Coupon saved = couponService.saveCoupon(coupon);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok().build();
    }
}
