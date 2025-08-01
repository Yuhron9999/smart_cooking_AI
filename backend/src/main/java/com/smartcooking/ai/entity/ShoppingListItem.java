package com.smartcooking.ai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Shopping List Item entity
 */
@Entity
@Table(name = "shopping_list_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id", nullable = false)
    @JsonIgnore
    private ShoppingList shoppingList;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit;

    @Builder.Default
    @Column(name = "is_purchased", nullable = false)
    private Boolean isPurchased = false;

    @Column(name = "estimated_price")
    private BigDecimal estimatedPrice;

    @Column(length = 500)
    private String notes;
}
