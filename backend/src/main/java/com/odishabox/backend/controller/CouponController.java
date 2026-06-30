package com.odishabox.backend.controller;

import com.odishabox.backend.model.Coupon;
import com.odishabox.backend.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            Number amountNum = (Number) request.get("amount");
            if (code == null || amountNum == null) {
                return ResponseEntity.badRequest().body("Code and amount are required");
            }
            double amount = amountNum.doubleValue();
            Coupon coupon = couponService.validateAndGetCoupon(code, amount);
            return ResponseEntity.ok(coupon);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
