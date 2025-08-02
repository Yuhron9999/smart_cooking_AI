package com.smartcooking.ai.dto;

import com.smartcooking.ai.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication Response DTO - Response cho tất cả auth operations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private boolean success;
    private String message;
    private String accessToken;
    private String refreshToken;
    private User user;
    private int expiresIn; // Seconds

    // Static methods for common responses
    public static AuthResponse success(String message, String accessToken, String refreshToken, User user,
            int expiresIn) {
        return AuthResponse.builder()
                .success(true)
                .message(message)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(user)
                .expiresIn(expiresIn)
                .build();
    }

    public static AuthResponse error(String message) {
        return AuthResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
