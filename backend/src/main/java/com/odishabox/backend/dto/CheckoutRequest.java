package com.odishabox.backend.dto;

import java.util.List;

public record CheckoutRequest(
    List<CartItemDto> items,
    Long addressId,
    String deliverySlot,
    String paymentMethod,
    String couponCode
) {}
