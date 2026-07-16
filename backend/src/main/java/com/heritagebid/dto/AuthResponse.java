package com.heritagebid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String fullName;
    private String token;
    private String message;
    private String role;
}