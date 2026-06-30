package com.odishabox.backend.dto;

public record CartItemDto(
    Long productId,
    int quantity
) {}
