package com.heritagebid.service;

import com.heritagebid.dto.AuthResponse;
import com.heritagebid.dto.LoginRequest;
import com.heritagebid.dto.PasswordChangeRequest;
import com.heritagebid.dto.ProfileUpdateRequest;
import com.heritagebid.dto.RegisterRequest;
import com.heritagebid.entity.User;
import com.heritagebid.enums.Role;
import com.heritagebid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .profileImage(null)
                .verified(false)
                .build();

        userRepository.save(user);

        return new AuthResponse(
                null,
                null,
                null,
                "User Registered Successfully",
                null
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid Email or Password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid Email or Password");
        }

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                "temporary-token",
                "Login Successful",
                user.getRole().name()
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User updateProfile(Long id, ProfileUpdateRequest request) {
        User user = getUserById(id);
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }
        return userRepository.save(user);
    }

    public User changePassword(Long id, PasswordChangeRequest request) {
        User user = getUserById(id);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(Role.valueOf(role.toUpperCase()));
        return userRepository.save(user);
    }
}