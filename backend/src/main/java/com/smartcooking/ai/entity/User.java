package com.smartcooking.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * User entity cho hệ thống Smart Cooking AI
 * 
 * Bao gồm:
 * - Thông tin cơ bản (username, email, password)
 * - Google OAuth2 integration
 * - Preferences và dietary restrictions
 * - Role-based access control
 * - Multi-language support
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider")
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "language_preference", length = 10)
    @Builder.Default
    private String languagePreference = "vi";

    // Location info for regional features
    private Double latitude;
    private Double longitude;

    @Column(name = "region_preference", length = 50)
    private String regionPreference;

    @Column(length = 100)
    private String city;

    @Column(length = 50)
    @Builder.Default
    private String country = "Vietnam";

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // Dietary preferences
    @ElementCollection(targetClass = DietaryRestriction.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_dietary_restrictions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "restriction")
    @Builder.Default
    private Set<DietaryRestriction> dietaryRestrictions = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_cuisine_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "cuisine")
    @Builder.Default
    private Set<String> cuisinePreferences = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "spice_level")
    @Builder.Default
    private SpiceLevel spiceLevel = SpiceLevel.MEDIUM;

    // Relationships
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_favorite_recipes", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "recipe_id"))
    @Builder.Default
    private Set<Recipe> favoriteRecipes = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<MealPlan> mealPlans = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<ShoppingList> shoppingLists = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Recipe> createdRecipes = new HashSet<>();

    // Audit fields
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enums
    public enum Role {
        USER, ADMIN, CHEF
    }

    public enum AuthProvider {
        LOCAL, GOOGLE
    }

    public enum DietaryRestriction {
        VEGETARIAN, VEGAN, GLUTEN_FREE, DAIRY_FREE, NUT_FREE,
        HALAL, KOSHER, KETO, PALEO
    }

    public enum SpiceLevel {
        MILD, MEDIUM, HOT, EXTRA_HOT
    }

    // Helper methods
    public void addFavoriteRecipe(Recipe recipe) {
        this.favoriteRecipes.add(recipe);
        recipe.getFavoriteByUsers().add(this);
    }

    public void removeFavoriteRecipe(Recipe recipe) {
        this.favoriteRecipes.remove(recipe);
        recipe.getFavoriteByUsers().remove(this);
    }
}
