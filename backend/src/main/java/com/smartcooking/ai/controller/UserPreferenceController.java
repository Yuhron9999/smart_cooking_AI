package com.smartcooking.ai.controller;

import com.smartcooking.ai.dto.UserPreferenceDTO;
import com.smartcooking.ai.service.UserPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller để quản lý tùy chọn của người dùng
 */
@RestController
@RequestMapping("/api/user-preferences")
@RequiredArgsConstructor
public class UserPreferenceController {

    private final UserPreferenceService userPreferenceService;

    /**
     * Lấy tùy chọn của người dùng
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserPreferenceDTO> getUserPreference(@PathVariable Long userId) {
        return userPreferenceService.getUserPreference(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lưu hoặc cập nhật tùy chọn của người dùng
     */
    @PostMapping
    public ResponseEntity<UserPreferenceDTO> saveUserPreference(@RequestBody UserPreferenceDTO preferenceDTO) {
        UserPreferenceDTO savedPreference = userPreferenceService.saveUserPreference(preferenceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPreference);
    }

    /**
     * Cập nhật một trường cụ thể trong tùy chọn người dùng
     */
    @PatchMapping("/{userId}")
    public ResponseEntity<UserPreferenceDTO> updateUserPreferenceField(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> fields) {

        if (fields.isEmpty() || fields.size() > 1) {
            return ResponseEntity.badRequest().build();
        }

        Map.Entry<String, Object> entry = fields.entrySet().iterator().next();
        String field = entry.getKey();
        Object value = entry.getValue();

        try {
            UserPreferenceDTO updatedPreference = userPreferenceService.updatePreferenceField(userId, field, value);
            return ResponseEntity.ok(updatedPreference);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Thêm một sở thích ẩm thực
     */
    @PostMapping("/{userId}/cuisines")
    public ResponseEntity<UserPreferenceDTO> addCuisinePreference(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        String cuisine = body.get("cuisine");
        if (cuisine == null || cuisine.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        UserPreferenceDTO updatedPreference = userPreferenceService.addCuisinePreference(userId, cuisine);
        return ResponseEntity.ok(updatedPreference);
    }

    /**
     * Xóa một sở thích ẩm thực
     */
    @DeleteMapping("/{userId}/cuisines/{cuisine}")
    public ResponseEntity<UserPreferenceDTO> removeCuisinePreference(
            @PathVariable Long userId,
            @PathVariable String cuisine) {

        UserPreferenceDTO updatedPreference = userPreferenceService.removeCuisinePreference(userId, cuisine);
        return ResponseEntity.ok(updatedPreference);
    }

    /**
     * Thêm một nguyên liệu yêu thích
     */
    @PostMapping("/{userId}/liked-ingredients")
    public ResponseEntity<UserPreferenceDTO> addLikedIngredient(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        String ingredient = body.get("ingredient");
        if (ingredient == null || ingredient.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        UserPreferenceDTO updatedPreference = userPreferenceService.addLikedIngredient(userId, ingredient);
        return ResponseEntity.ok(updatedPreference);
    }

    /**
     * Thêm một nguyên liệu không thích
     */
    @PostMapping("/{userId}/disliked-ingredients")
    public ResponseEntity<UserPreferenceDTO> addDislikedIngredient(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        String ingredient = body.get("ingredient");
        if (ingredient == null || ingredient.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        UserPreferenceDTO updatedPreference = userPreferenceService.addDislikedIngredient(userId, ingredient);
        return ResponseEntity.ok(updatedPreference);
    }

    /**
     * Kiểm tra xem người dùng có thích một nguyên liệu hay không
     */
    @GetMapping("/{userId}/liked-ingredients/{ingredient}")
    public ResponseEntity<Map<String, Boolean>> isIngredientLiked(
            @PathVariable Long userId,
            @PathVariable String ingredient) {

        boolean isLiked = userPreferenceService.isIngredientLiked(userId, ingredient);
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }

    /**
     * Lấy danh sách người dùng có cùng sở thích ẩm thực
     */
    @GetMapping("/similar-cuisine/{cuisine}")
    public ResponseEntity<List<UserPreferenceDTO>> getUsersWithSimilarCuisinePreference(
            @PathVariable String cuisine) {

        List<UserPreferenceDTO> users = userPreferenceService.getUsersWithSimilarCuisinePreference(cuisine);
        return ResponseEntity.ok(users);
    }

    /**
     * Xóa tùy chọn của người dùng
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserPreference(@PathVariable Long userId) {
        userPreferenceService.deleteUserPreference(userId);
        return ResponseEntity.noContent().build();
    }
}
