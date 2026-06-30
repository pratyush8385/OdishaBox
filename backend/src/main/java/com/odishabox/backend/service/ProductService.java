package com.odishabox.backend.service;

import com.odishabox.backend.model.Category;
import com.odishabox.backend.model.Product;
import com.odishabox.backend.model.Review;
import com.odishabox.backend.repository.CategoryRepository;
import com.odishabox.backend.repository.ProductRepository;
import com.odishabox.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProducts(String search, Long categoryId) {
        return productRepository.searchProducts(search, categoryId);
    }

    public List<Product> getBestSellers() {
        return productRepository.findByIsBestSellerTrue();
    }

    public List<Product> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrue();
    }

    public List<Product> getFestivalSpecials() {
        return productRepository.findByIsFestivalSpecialTrue();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    @Transactional
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    public Review addReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        
        List<Review> reviews = reviewRepository.findByProductId(review.getProduct().getId());
        double avgRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        
        Product product = review.getProduct();
        product.setRating(Math.round(avgRating * 10.0) / 10.0);
        productRepository.save(product);
        
        return savedReview;
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    public List<Product> getRecommendations(Long productId) {
        return productRepository.findById(productId).map(product -> {
            List<Product> recommendations = productRepository.findByCategoryId(product.getCategory().getId());
            return recommendations.stream()
                    .filter(p -> !p.getId().equals(productId))
                    .limit(4)
                    .collect(Collectors.toList());
        }).orElse(Collections.emptyList());
    }
}
