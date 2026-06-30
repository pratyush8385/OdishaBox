package com.odishabox.backend.controller;

import com.odishabox.backend.dto.ReviewRequest;
import com.odishabox.backend.model.Category;
import com.odishabox.backend.model.Product;
import com.odishabox.backend.model.Review;
import com.odishabox.backend.model.User;
import com.odishabox.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        List<Product> products = productService.searchProducts(search, categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<Product>> getRecommendations(@PathVariable Long id) {
        List<Product> recommendations = productService.getRecommendations(id);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellers());
    }

    @GetMapping("/newarrivals")
    public ResponseEntity<List<Product>> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }

    @GetMapping("/festivalspecials")
    public ResponseEntity<List<Product>> getFestivalSpecials() {
        return ResponseEntity.ok(productService.getFestivalSpecials());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @GetMapping("/categories/{slug}")
    public ResponseEntity<Category> getCategoryBySlug(@PathVariable String slug) {
        return productService.getCategoryBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductReviews(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(
            @PathVariable Long id,
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        Product product = productService.getProductById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        Review review = new Review(
                product,
                user,
                request.rating(),
                request.comment(),
                LocalDateTime.now()
        );

        Review savedReview = productService.addReview(review);
        return ResponseEntity.ok(savedReview);
    }
}
