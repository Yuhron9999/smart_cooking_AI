package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.ShoppingList;
import com.smartcooking.ai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Shopping List Repository
 */
@Repository
public interface ShoppingListRepository extends JpaRepository<ShoppingList, Long> {

    /**
     * Tìm shopping lists của user
     */
    List<ShoppingList> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Đếm shopping lists của user
     */
    long countByUser(User user);

    /**
     * Tìm shopping list theo name
     */
    @Query("""
            SELECT sl FROM ShoppingList sl
            WHERE sl.user = :user
            AND LOWER(sl.name) LIKE LOWER(CONCAT('%', :name, '%'))
            """)
    List<ShoppingList> findByUserAndNameContaining(@Param("user") User user,
            @Param("name") String name);

    /**
     * Thống kê total items trong shopping lists của user
     */
    @Query("""
            SELECT COUNT(sli)
            FROM ShoppingList sl
            JOIN sl.items sli
            WHERE sl.user = :user
            """)
    long countTotalItemsByUser(@Param("user") User user);

    /**
     * Thống kê purchased items của user
     */
    @Query("""
            SELECT COUNT(sli)
            FROM ShoppingList sl
            JOIN sl.items sli
            WHERE sl.user = :user
            AND sli.isPurchased = true
            """)
    long countPurchasedItemsByUser(@Param("user") User user);
}
