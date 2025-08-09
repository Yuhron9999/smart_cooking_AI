package com.smartcooking.ai.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_dietary_restrictions", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id",
        "restriction" }), indexes = {
                @Index(name = "idx_user_dietary_user_id", columnList = "user_id"),
                @Index(name = "idx_user_dietary_restriction", columnList = "restriction")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserDietaryRestriction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "restriction", nullable = false, length = 50)
    private String restriction; // VEGAN, VEGETARIAN, GLUTEN_FREE, etc.

    @Column(name = "severity", length = 20)
    private String severity = "STRICT"; // STRICT, MODERATE, FLEXIBLE

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
