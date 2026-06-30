package com.odishabox.backend.dto;

public record ReviewRequest(
    Long productId,
    double rating,
    String comment
) {}
