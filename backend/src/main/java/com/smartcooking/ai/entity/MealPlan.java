package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Meal Plan entity
 */
@Entity
@Table(name = "meal_plans")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breakfast_recipe_id")
    private Recipe breakfast;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lunch_recipe_id")
    private Recipe lunch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dinner_recipe_id")
    private Recipe dinner;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "meal_plan_snacks", joinColumns = @JoinColumn(name = "meal_plan_id"), inverseJoinColumns = @JoinColumn(name = "recipe_id"))
    @Builder.Default
    private List<Recipe> snacks = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
