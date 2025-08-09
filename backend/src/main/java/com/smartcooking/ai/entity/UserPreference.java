package com.smartcooking.ai.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity để lưu trữ tùy chọn và cấu hình cá nhân hóa của người dùng
 */
@Entity
@Table(name = "user_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Tùy chọn ngôn ngữ
    @Column(name = "language_preference", length = 10)
    @Builder.Default
    private String languagePreference = "vi";

    // Tùy chọn ẩm thực
    @ElementCollection
    @CollectionTable(name = "user_cuisine_preferences", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "cuisine")
    @Builder.Default
    private Set<String> cuisinePreferences = new HashSet<>();

    // Tùy chọn chế độ ăn
    @ElementCollection
    @CollectionTable(name = "user_dietary_preferences", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "diet_type")
    @Builder.Default
    private Set<String> dietaryPreferences = new HashSet<>();

    // Thích/không thích nguyên liệu
    @ElementCollection
    @CollectionTable(name = "user_ingredient_preferences", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "ingredient")
    @Builder.Default
    private Set<String> likedIngredients = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_ingredient_dislikes", joinColumns = @JoinColumn(name = "preference_id"))
    @Column(name = "ingredient")
    @Builder.Default
    private Set<String> dislikedIngredients = new HashSet<>();

    // Mức độ cay
    @Enumerated(EnumType.STRING)
    @Column(name = "spice_preference")
    @Builder.Default
    private SpiceLevel spicePreference = SpiceLevel.MEDIUM;

    // Tùy chọn AI
    @Column(name = "ai_assistant_enabled")
    @Builder.Default
    private Boolean aiAssistantEnabled = true;

    @Column(name = "preferred_ai_model", length = 50)
    @Builder.Default
    private String preferredAiModel = "gpt-4";

    // Tùy chọn hiển thị
    @Column(name = "dark_mode")
    @Builder.Default
    private Boolean darkMode = false;

    // Cài đặt gợi ý và cá nhân hóa
    @Column(name = "personalization_level")
    @Builder.Default
    private Integer personalizationLevel = 5; // 1-10

    @Column(name = "enable_recommendations")
    @Builder.Default
    private Boolean enableRecommendations = true;

    // Dữ liệu động được lưu dưới dạng JSON
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dynamic_preferences", columnDefinition = "json")
    private JsonNode dynamicPreferences;

    // Trường theo dõi
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum SpiceLevel {
        MILD, MEDIUM, HOT, EXTRA_HOT
    }
}
