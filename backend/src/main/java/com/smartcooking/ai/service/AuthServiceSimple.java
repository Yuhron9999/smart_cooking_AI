package com.smartcooking.ai.service;

import com.smartcooking.ai.dto.AuthRequest;
import com.smartcooking.ai.dto.AuthResponse;
import com.smartcooking.ai.dto.GoogleAuthRequest;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Authentication Service - Simple version for testing
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceSimple {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    /**
     * Authenticate với Google OAuth2
     */
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        try {
            log.info("Processing Google authentication for email: {}", request.getEmail());

            // Tìm user existing hoặc tạo mới
            User user = findOrCreateGoogleUser(request);

            // Generate JWT tokens
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            log.info("Google authentication successful for user: {}", user.getEmail());

            return new AuthResponse(
                    true,
                    "Google authentication successful",
                    accessToken,
                    refreshToken,
                    user,
                    jwtService.getAccessTokenExpiration());

        } catch (Exception e) {
            log.error("Google authentication failed: {}", e.getMessage());
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    /**
     * Authenticate với email/password
     */
    public AuthResponse authenticateWithPassword(AuthRequest request) {
        try {
            log.info("Processing password authentication for email: {}", request.getEmail());

            // Tìm user theo email
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            // Check if user is active
            if (!user.getIsActive()) {
                throw new RuntimeException("User account is disabled");
            }

            // Generate JWT tokens
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            log.info("Password authentication successful for user: {}", user.getEmail());

            return new AuthResponse(
                    true,
                    "Authentication successful",
                    accessToken,
                    refreshToken,
                    user,
                    jwtService.getAccessTokenExpiration());

        } catch (Exception e) {
            log.error("Password authentication failed: {}", e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    /**
     * Register user mới
     */
    public AuthResponse registerUser(AuthRequest request) {
        try {
            log.info("Processing user registration for email: {}", request.getEmail());

            // Check if user already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already registered");
            }

            // Create new user
            User user = new User();
            user.setEmail(request.getEmail());
            user.setFullName(request.getName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(User.Role.USER);
            user.setProvider(User.AuthProvider.LOCAL);
            user.setLanguagePreference("vi");
            user.setIsActive(true);

            user = userRepository.save(user);

            // Generate JWT tokens
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            log.info("User registration successful for: {}", user.getEmail());

            return new AuthResponse(
                    true,
                    "Registration successful",
                    accessToken,
                    refreshToken,
                    user,
                    jwtService.getAccessTokenExpiration());

        } catch (Exception e) {
            log.error("User registration failed: {}", e.getMessage());
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Refresh JWT token
     */
    public AuthResponse refreshToken(String refreshToken) {
        try {
            log.info("Processing token refresh");

            // Validate refresh token
            if (!jwtService.validateToken(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }

            // Get user from token
            String email = jwtService.getEmailFromToken(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate new tokens
            String newAccessToken = jwtService.generateAccessToken(user);
            String newRefreshToken = jwtService.generateRefreshToken(user);

            log.info("Token refresh successful for user: {}", user.getEmail());

            return new AuthResponse(
                    true,
                    "Token refreshed successfully",
                    newAccessToken,
                    newRefreshToken,
                    user,
                    jwtService.getAccessTokenExpiration());

        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            throw new RuntimeException("Token refresh failed: " + e.getMessage());
        }
    }

    /**
     * Get current user from JWT token
     */
    public User getCurrentUserFromToken(String token) {
        try {
            if (!jwtService.validateToken(token)) {
                throw new RuntimeException("Invalid token");
            }

            String email = jwtService.getEmailFromToken(token);
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        } catch (Exception e) {
            log.error("Get current user failed: {}", e.getMessage());
            throw new RuntimeException("Failed to get current user: " + e.getMessage());
        }
    }

    /**
     * Verify JWT token
     */
    public boolean verifyToken(String token) {
        try {
            return jwtService.validateToken(token);
        } catch (Exception e) {
            log.error("Token verification failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Logout user (invalidate token)
     */
    public void logout(String token) {
        try {
            // Add token to blacklist or handle logout logic
            jwtService.invalidateToken(token);
            log.info("User logged out successfully");
        } catch (Exception e) {
            log.error("Logout failed: {}", e.getMessage());
        }
    }

    /**
     * Find existing Google user hoặc tạo mới
     */
    private User findOrCreateGoogleUser(GoogleAuthRequest request) {
        // Tìm user theo email
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Update user info if needed
            boolean updated = false;
            if (user.getFullName() == null || !user.getFullName().equals(request.getName())) {
                user.setFullName(request.getName());
                updated = true;
            }
            if (user.getAvatarUrl() == null || !user.getAvatarUrl().equals(request.getAvatarUrl())) {
                user.setAvatarUrl(request.getAvatarUrl());
                updated = true;
            }
            if (user.getProvider() != User.AuthProvider.GOOGLE) {
                user.setProvider(User.AuthProvider.GOOGLE);
                user.setProviderId(request.getProviderId());
                updated = true;
            }

            if (updated) {
                user = userRepository.save(user);
            }

            return user;
        } else {
            // Tạo user mới
            User newUser = new User();
            newUser.setEmail(request.getEmail());
            newUser.setFullName(request.getName());
            newUser.setAvatarUrl(request.getAvatarUrl());
            newUser.setRole(User.Role.USER);
            newUser.setProvider(User.AuthProvider.GOOGLE);
            newUser.setProviderId(request.getProviderId());
            newUser.setLanguagePreference("vi");
            newUser.setIsActive(true);

            return userRepository.save(newUser);
        }
    }
}
