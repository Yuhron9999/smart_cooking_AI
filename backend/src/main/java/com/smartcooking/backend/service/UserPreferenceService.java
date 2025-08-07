package com.smartcooking.backend.service;

import com.smartcooking.backend.dto.UserPreferenceDTO;
import com.smartcooking.backend.entity.UserPreference;
import com.smartcooking.backend.repository.UserPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service để quản lý tùy chọn của người dùng
 */
@Service
@RequiredArgsConstructor
public class UserPreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;

    /**
     * Lấy tùy chọn của người dùng theo ID
     */
    public Optional<UserPreferenceDTO> getUserPreference(Long userId) {
        return userPreferenceRepository.findByUserId(userId)
                .map(UserPreferenceDTO::fromEntity);
    }

    /**
     * Tạo hoặc cập nhật tùy chọn của người dùng
     */
    @Transactional
    public UserPreferenceDTO saveUserPreference(UserPreferenceDTO preferenceDTO) {
        Optional<UserPreference> existingPreference = userPreferenceRepository.findByUserId(preferenceDTO.getUserId());

        UserPreference preference;
        if (existingPreference.isPresent()) {
            preference = existingPreference.get();
            // Cập nhật các trường từ DTO
            preference.setLanguagePreference(preferenceDTO.getLanguagePreference());
            preference.setCuisinePreferences(preferenceDTO.getCuisinePreferences());
            preference.setDietaryPreferences(preferenceDTO.getDietaryPreferences());
            preference.setLikedIngredients(preferenceDTO.getLikedIngredients());
            preference.setDislikedIngredients(preferenceDTO.getDislikedIngredients());
            preference.setSpicePreference(UserPreference.SpiceLevel.valueOf(preferenceDTO.getSpicePreference()));
            preference.setAiAssistantEnabled(preferenceDTO.getAiAssistantEnabled());
            preference.setPreferredAiModel(preferenceDTO.getPreferredAiModel());
            preference.setDarkMode(preferenceDTO.getDarkMode());
            preference.setPersonalizationLevel(preferenceDTO.getPersonalizationLevel());
            preference.setEnableRecommendations(preferenceDTO.getEnableRecommendations());
            preference.setDynamicPreferences(preferenceDTO.getDynamicPreferences());
        } else {
            preference = preferenceDTO.toEntity();
        }

        UserPreference savedPreference = userPreferenceRepository.save(preference);
        return UserPreferenceDTO.fromEntity(savedPreference);
    }

    /**
     * Cập nhật một trường trong tùy chọn người dùng
     */
    @Transactional
    public UserPreferenceDTO updatePreferenceField(Long userId, String field, Object value) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn cho người dùng ID: " + userId));

        // Dựa vào tên trường để cập nhật giá trị tương ứng
        switch (field) {
            case "languagePreference":
                preference.setLanguagePreference((String) value);
                break;
            case "darkMode":
                preference.setDarkMode((Boolean) value);
                break;
            case "spicePreference":
                preference.setSpicePreference(UserPreference.SpiceLevel.valueOf((String) value));
                break;
            case "personalizationLevel":
                preference.setPersonalizationLevel((Integer) value);
                break;
            case "enableRecommendations":
                preference.setEnableRecommendations((Boolean) value);
                break;
            case "preferredAiModel":
                preference.setPreferredAiModel((String) value);
                break;
            default:
                throw new IllegalArgumentException("Trường không hợp lệ: " + field);
        }

        UserPreference savedPreference = userPreferenceRepository.save(preference);
        return UserPreferenceDTO.fromEntity(savedPreference);
    }

    /**
     * Thêm một sở thích ẩm thực cho người dùng
     */
    @Transactional
    public UserPreferenceDTO addCuisinePreference(Long userId, String cuisine) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn cho người dùng ID: " + userId));

        preference.getCuisinePreferences().add(cuisine);
        UserPreference savedPreference = userPreferenceRepository.save(preference);

        return UserPreferenceDTO.fromEntity(savedPreference);
    }

    /**
     * Xóa một sở thích ẩm thực của người dùng
     */
    @Transactional
    public UserPreferenceDTO removeCuisinePreference(Long userId, String cuisine) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn cho người dùng ID: " + userId));

        preference.getCuisinePreferences().remove(cuisine);
        UserPreference savedPreference = userPreferenceRepository.save(preference);

        return UserPreferenceDTO.fromEntity(savedPreference);
    }

    /**
     * Thêm một nguyên liệu yêu thích cho người dùng
     */
    @Transactional
    public UserPreferenceDTO addLikedIngredient(Long userId, String ingredient) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn cho người dùng ID: " + userId));

        preference.getLikedIngredients().add(ingredient);
        // Nếu nguyên liệu này trước đó không thích, xóa khỏi danh sách không thích
        preference.getDislikedIngredients().remove(ingredient);

        UserPreference savedPreference = userPreferenceRepository.save(preference);

        return UserPreferenceDTO.fromEntity(savedPreference);
    }

    /**
     * Thêm một nguyên liệu không thích cho người dùng
     */
    @Transactional
    public UserPreferenceDTO addDislikedIngredient(Long userId, String ingredient) {
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tùy chọn cho người dùng ID: " + userId));

        preference.getDislikedIngredients().add(ingredient);
        // Nếu nguyên liệu này trước đó thích, xóa khỏi danh sách thích
        preference.getLikedIngredients().remove(ingredient);

        UserPreference savedPreference = userPreferenceRepository.save(preference);

        return UserPreferenceDTO.fromEntity(savedPreference);
    }

    /**
     * Kiểm tra xem người dùng có thích một nguyên liệu hay không
     */
    public boolean isIngredientLiked(Long userId, String ingredient) {
        return userPreferenceRepository.isIngredientLiked(userId, ingredient);
    }

    /**
     * Kiểm tra xem người dùng có không thích một nguyên liệu hay không
     */
    public boolean isIngredientDisliked(Long userId, String ingredient) {
        return userPreferenceRepository.isIngredientDisliked(userId, ingredient);
    }

    /**
     * Lấy danh sách người dùng có cùng sở thích ẩm thực
     */
    public List<UserPreferenceDTO> getUsersWithSimilarCuisinePreference(String cuisine) {
        return userPreferenceRepository.findByCuisinePreference(cuisine).stream()
                .map(UserPreferenceDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Xóa tùy chọn của người dùng
     */
    @Transactional
    public void deleteUserPreference(Long userId) {
        userPreferenceRepository.findByUserId(userId).ifPresent(userPreferenceRepository::delete);
    }
}
