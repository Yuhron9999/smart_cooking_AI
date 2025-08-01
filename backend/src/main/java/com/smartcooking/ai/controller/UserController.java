package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * User Controller - REST API cho quản lý người dùng
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class UserController {

    private final UserService userService;

    /**
     * Tạo user mới
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy thông tin user theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lấy thông tin user theo email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cập nhật profile user
     */
    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User updates) {
        try {
            User updatedUser = userService.updateProfile(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Error updating user profile: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật location user
     */
    @PutMapping("/{id}/location")
    public ResponseEntity<User> updateLocation(@PathVariable Long id, @RequestBody Map<String, Object> locationData) {
        try {
            Double latitude = (Double) locationData.get("latitude");
            Double longitude = (Double) locationData.get("longitude");
            String region = (String) locationData.get("region");
            String city = (String) locationData.get("city");
            String country = (String) locationData.get("country");

            User updatedUser = userService.updateLocation(id, latitude, longitude, region, city, country);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Error updating user location: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật ngôn ngữ ưa thích
     */
    @PutMapping("/{id}/language")
    public ResponseEntity<User> updateLanguagePreference(@PathVariable Long id,
            @RequestBody Map<String, String> languageData) {
        try {
            String language = languageData.get("language");
            User updatedUser = userService.updateLanguagePreference(id, language);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            log.error("Error updating user language: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Vô hiệu hóa tài khoản user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deactivating user: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy users theo role
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        try {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error getting users by role: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy active users
     */
    @GetMapping("/active")
    public ResponseEntity<List<User>> getActiveUsers() {
        List<User> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy users theo vùng miền
     */
    @GetMapping("/region/{region}")
    public ResponseEntity<List<User>> getUsersByRegion(@PathVariable String region) {
        List<User> users = userService.getUsersByRegion(region);
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy users gần vị trí
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<User>> getUsersNearLocation(@RequestParam Double latitude,
            @RequestParam Double longitude) {
        List<User> users = userService.getUsersNearLocation(latitude, longitude);
        return ResponseEntity.ok(users);
    }

    /**
     * Lấy users theo dietary restriction
     */
    @GetMapping("/dietary/{restriction}")
    public ResponseEntity<List<User>> getUsersByDietaryRestriction(@PathVariable String restriction) {
        try {
            User.DietaryRestriction dietaryRestriction = User.DietaryRestriction.valueOf(restriction.toUpperCase());
            List<User> users = userService.getUsersByDietaryRestriction(dietaryRestriction);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error getting users by dietary restriction: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy thống kê users
     */
    @GetMapping("/statistics")
    public ResponseEntity<UserService.UserStatistics> getUserStatistics() {
        UserService.UserStatistics stats = userService.getUserStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Đổi mật khẩu
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        try {
            String newPassword = passwordData.get("newPassword");
            userService.changePassword(id, newPassword);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error changing password: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
