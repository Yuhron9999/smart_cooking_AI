package com.smartcooking.ai.service;

import com.smartcooking.ai.dto.*;
import com.smartcooking.ai.entity.*;
import com.smartcooking.ai.repository.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserDataService {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final UserAiInteractionRepository aiInteractionRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final UserCuisinePreferenceRepository cuisinePreferenceRepository;
    private final UserDietaryRestrictionRepository dietaryRestrictionRepository;
    private final UserFavoriteRecipeRepository favoriteRecipeRepository;
    private final LearningProgressRepository learningProgressRepository;

    // ============================================================================
    // USER PROFILE MANAGEMENT
    // ============================================================================

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        log.info("Getting user profile for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileResponse.builder()
                .userId(user.getId())
                .displayName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .memberSince(user.getCreatedAt())
                .lastActive(user.getLastLogin())
                .build();
    }

    @Transactional(readOnly = true)
    public UserDataResponse getUserData(Long userId) {
        log.info("Getting complete user data for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserDataResponse.builder()
                .userId(userId)
                .profileData(getUserProfile(userId))
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    // Placeholder methods - implement as needed
    public UserDataResponse updateUserProfile(Long userId, UpdateUserProfileRequest request) {
        // Implementation here
        return getUserData(userId);
    }

    public UserDataResponse updateUserPreferences(Long userId, UpdateUserPreferencesRequest request) {
        // Implementation here
        return getUserData(userId);
    }
}
