package com.odishabox.backend.controller;

import com.odishabox.backend.config.JwtTokenProvider;
import com.odishabox.backend.dto.AuthResponse;
import com.odishabox.backend.dto.LoginRequest;
import com.odishabox.backend.dto.RegisterRequest;
import com.odishabox.backend.model.User;
import com.odishabox.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserService userService, JwtTokenProvider tokenProvider, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            String token = tokenProvider.generateToken(user.getEmail());
            AuthResponse response = new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name(),
                    user.getPhoneNumber()
            );
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.email())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid email or password!");
        }

        String token = tokenProvider.generateToken(user.getEmail());
        AuthResponse response = new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                user.getPhoneNumber()
        );
        return ResponseEntity.ok(response);
    }
}
