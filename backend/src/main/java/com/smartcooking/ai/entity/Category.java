package com.smartcooking.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Category entity với multilingual support
 */
@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_vi", nullable = false)
    private String nameVi;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "description_vi")
    private String descriptionVi;

    @Column(name = "description_en")
    private String descriptionEn;

    @Column(name = "icon_url")
    private String iconUrl;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Builder.Default
    private Boolean active = true;

    // Get name based on language
    public String getName(String language) {
        if ("en".equals(language) && nameEn != null) {
            return nameEn;
        }
        return nameVi;
    }

    // Get description based on language
    public String getDescription(String language) {
        if ("en".equals(language) && descriptionEn != null) {
            return descriptionEn;
        }
        return descriptionVi;
    }
}
