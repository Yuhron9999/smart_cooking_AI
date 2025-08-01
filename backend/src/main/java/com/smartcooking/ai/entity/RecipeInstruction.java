package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Recipe Instruction entity với multilingual support
 */
@Entity
@Table(name = "recipe_instructions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeInstruction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    @JsonIgnore
    private Recipe recipe;

    @Column(name = "step_number", nullable = false)
    private Integer stepNumber;

    @Column(name = "description_vi", nullable = false, columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    private String duration; // e.g., "5 phút", "5 minutes"

    private String temperature; // e.g., "180°C"

    @Column(name = "image_url")
    private String imageUrl;

    @ElementCollection
    @CollectionTable(name = "instruction_tips", joinColumns = @JoinColumn(name = "instruction_id"))
    @Column(name = "tip")
    @Builder.Default
    private List<String> tips = new ArrayList<>();

    // Get description based on language
    public String getDescription(String language) {
        if ("en".equals(language) && descriptionEn != null) {
            return descriptionEn;
        }
        return descriptionVi;
    }
}
