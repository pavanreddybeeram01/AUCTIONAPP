package com.heritagebid.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String phone;

    private String profileImage;
}
