package com.smartcooking.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long userId;
    private String displayName;
    private String email;
    private String avatarUrl;
    private LocalDateTime memberSince;
    private LocalDateTime lastActive;
}
