package com.smartcooking.ai.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_cuisine_preferences", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id",
        "cuisine" }), indexes = {
                @Index(name = "idx_user_cuisine_user_id", columnList = "user_id"),
                @Index(name = "idx_user_cuisine_cuisine", columnList = "cuisine")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserCuisinePreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "cuisine", nullable = false, length = 100)
    private String cuisine;

    @Column(name = "preference_score")
    private Double preferenceScore = 1.0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void validate() {
        if (preferenceScore != null && (preferenceScore < 0.0 || preferenceScore > 10.0)) {
            throw new IllegalArgumentException("Preference score must be between 0.0 and 10.0");
        }
    }
}
