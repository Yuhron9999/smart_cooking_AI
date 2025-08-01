package com.smartcooking.ai.service;

import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * User Service - Quản lý người dùng, authentication, profiles
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Tạo user mới
     */
    public User createUser(User user) {
        log.info("Creating new user with email: {}", user.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }

        // Hash password if provided
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Set defaults
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }
        if (user.getLanguagePreference() == null) {
            user.setLanguagePreference("vi");
        }
        if (user.getIsActive() == null) {
            user.setIsActive(true);
        }

        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());
        return savedUser;
    }

    /**
     * Tìm hoặc tạo user từ Google OAuth2
     */
    public User findOrCreateOAuth2User(String email, String fullName, String providerId) {
        log.info("Finding or creating OAuth2 user: {}", email);

        // Try to find existing user by email
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update provider info if not set
            if (user.getProvider() == null || user.getProviderId() == null) {
                user.setProvider(User.AuthProvider.GOOGLE);
                user.setProviderId(providerId);
                user = userRepository.save(user);
            }
            log.info("Found existing user: {}", user.getId());
            return user;
        }

        // Create new OAuth2 user
        User newUser = User.builder()
                .email(email)
                .fullName(fullName)
                .provider(User.AuthProvider.GOOGLE)
                .providerId(providerId)
                .role(User.Role.USER)
                .languagePreference("vi")
                .isActive(true)
                .build();

        User savedUser = userRepository.save(newUser);
        log.info("Created new OAuth2 user: {}", savedUser.getId());
        return savedUser;
    }

    /**
     * Tìm user theo email
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Tìm user theo ID
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Update user profile
     */
    public User updateProfile(Long userId, User updates) {
        log.info("Updating profile for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Update allowed fields
        if (updates.getFullName() != null) {
            user.setFullName(updates.getFullName());
        }
        if (updates.getLanguagePreference() != null) {
            user.setLanguagePreference(updates.getLanguagePreference());
        }
        if (updates.getLatitude() != null && updates.getLongitude() != null) {
            user.setLatitude(updates.getLatitude());
            user.setLongitude(updates.getLongitude());
            user.setRegionPreference(updates.getRegionPreference());
            user.setCity(updates.getCity());
            user.setCountry(updates.getCountry());
        }
        if (updates.getDietaryRestrictions() != null) {
            user.setDietaryRestrictions(updates.getDietaryRestrictions());
        }
        if (updates.getCuisinePreferences() != null) {
            user.setCuisinePreferences(updates.getCuisinePreferences());
        }
        if (updates.getSpiceLevel() != null) {
            user.setSpiceLevel(updates.getSpiceLevel());
        }

        User savedUser = userRepository.save(user);
        log.info("Profile updated for user: {}", userId);
        return savedUser;
    }

    /**
     * Update user location
     */
    public User updateLocation(Long userId, Double latitude, Double longitude,
            String region, String city, String country) {
        log.info("Updating location for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setLatitude(latitude);
        user.setLongitude(longitude);
        user.setRegionPreference(region);
        user.setCity(city);
        user.setCountry(country);

        User savedUser = userRepository.save(user);
        log.info("Location updated for user: {}", userId);
        return savedUser;
    }

    /**
     * Update user language preference
     */
    public User updateLanguagePreference(Long userId, String language) {
        log.info("Updating language preference for user: {} to {}", userId, language);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setLanguagePreference(language);
        User savedUser = userRepository.save(user);

        log.info("Language preference updated for user: {}", userId);
        return savedUser;
    }

    /**
     * Deactivate user account
     */
    public void deactivateUser(Long userId) {
        log.info("Deactivating user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setIsActive(false);
        userRepository.save(user);

        log.info("User deactivated: {}", userId);
    }

    /**
     * Get users by role
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    /**
     * Get active users
     */
    @Transactional(readOnly = true)
    public List<User> getActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    /**
     * Get users by region
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRegion(String region) {
        return userRepository.findActiveUsersByRegion(region);
    }

    /**
     * Get users near location
     */
    @Transactional(readOnly = true)
    public List<User> getUsersNearLocation(Double latitude, Double longitude) {
        return userRepository.findUsersNearLocation(latitude, longitude);
    }

    /**
     * Get users by dietary restriction
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByDietaryRestriction(User.DietaryRestriction restriction) {
        return userRepository.findByDietaryRestriction(restriction);
    }

    /**
     * Get user statistics
     */
    @Transactional(readOnly = true)
    public UserStatistics getUserStatistics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByIsActiveTrue().size();
        long adminUsers = userRepository.countByRole(User.Role.ADMIN);
        long chefUsers = userRepository.countByRole(User.Role.CHEF);
        long regularUsers = userRepository.countByRole(User.Role.USER);

        return UserStatistics.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .adminUsers(adminUsers)
                .chefUsers(chefUsers)
                .regularUsers(regularUsers)
                .build();
    }

    /**
     * Get new users in date range
     */
    @Transactional(readOnly = true)
    public List<User> getNewUsersInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.findUsersRegisteredBetween(startDate, endDate);
    }

    /**
     * Change user password
     */
    public void changePassword(Long userId, String newPassword) {
        log.info("Changing password for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Password changed for user: {}", userId);
    }

    /**
     * UserStatistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class UserStatistics {
        private long totalUsers;
        private long activeUsers;
        private long adminUsers;
        private long chefUsers;
        private long regularUsers;
    }
}
