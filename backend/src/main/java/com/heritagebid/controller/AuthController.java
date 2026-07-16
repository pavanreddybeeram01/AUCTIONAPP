package com.heritagebid.controller;

import com.heritagebid.dto.LoginRequest;
import com.heritagebid.dto.PasswordChangeRequest;
import com.heritagebid.dto.ProfileUpdateRequest;
import com.heritagebid.dto.RegisterRequest;
import com.heritagebid.entity.User;
import com.heritagebid.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return authService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return authService.getUserById(id);
    }

    @PutMapping("/users/{id}/profile")
    public User updateProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        return authService.updateProfile(id, request);
    }

    @PutMapping("/users/{id}/password")
    public User changePassword(@PathVariable Long id, @RequestBody PasswordChangeRequest request) {
        return authService.changePassword(id, request);
    }

    @PutMapping("/users/{id}/role")
    public User updateUserRole(@PathVariable Long id, @RequestParam String role) {
        return authService.updateUserRole(id, role);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }
}