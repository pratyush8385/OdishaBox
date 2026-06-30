package com.odishabox.backend.controller;

import com.odishabox.backend.model.Address;
import com.odishabox.backend.model.User;
import com.odishabox.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getAddresses(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userService.getUserAddresses(user));
    }

    @PostMapping("/addresses")
    public ResponseEntity<?> addAddress(@AuthenticationPrincipal User user, @RequestBody Address address) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Address saved = userService.addAddress(user, address);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<?> deleteAddress(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        userService.deleteAddress(user, id);
        return ResponseEntity.ok().build();
    }
}
