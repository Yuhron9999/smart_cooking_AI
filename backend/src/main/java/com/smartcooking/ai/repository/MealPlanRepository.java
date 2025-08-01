package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.MealPlan;
import com.smartcooking.ai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Meal Plan Repository
 */
@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

        /**
         * Tìm meal plans của user
         */
        List<MealPlan> findByUserOrderByDateDesc(User user);

        /**
         * Tìm meal plan theo user và date
         */
        Optional<MealPlan> findByUserAndDate(User user, LocalDate date);

        /**
         * Tìm meal plans trong khoảng thời gian
         */
        List<MealPlan> findByUserAndDateBetweenOrderByDate(User user, LocalDate startDate, LocalDate endDate);

        /**
         * Tìm meal plans theo week (7 ngày)
         */
        @Query("""
                        SELECT mp FROM MealPlan mp
                        WHERE mp.user = :user
                        AND mp.date >= :startOfWeek
                        AND mp.date <= :endOfWeek
                        ORDER BY mp.date
                        """)
        List<MealPlan> findWeeklyMealPlans(@Param("user") User user,
                        @Param("startOfWeek") LocalDate startOfWeek,
                        @Param("endOfWeek") LocalDate endOfWeek);

        /**
         * Tìm meal plans của tháng hiện tại
         */
        @Query("""
                        SELECT mp FROM MealPlan mp
                        WHERE mp.user = :user
                        AND YEAR(mp.date) = :year
                        AND MONTH(mp.date) = :month
                        ORDER BY mp.date
                        """)
        List<MealPlan> findMonthlyMealPlans(@Param("user") User user,
                        @Param("year") int year,
                        @Param("month") int month);

        /**
         * Đếm meal plans của user
         */
        long countByUser(User user);

        /**
         * Tìm meal plans chứa recipe cụ thể
         */
        @Query("""
                        SELECT mp FROM MealPlan mp
                        WHERE mp.breakfast.id = :recipeId
                        OR mp.lunch.id = :recipeId
                        OR mp.dinner.id = :recipeId
                        OR EXISTS (SELECT s FROM mp.snacks s WHERE s.id = :recipeId)
                        """)
        List<MealPlan> findMealPlansWithRecipe(@Param("recipeId") Long recipeId);

        /**
         * Thống kê calories trung bình per day của user
         */
        @Query("""
                        SELECT AVG(
                            COALESCE(mp.breakfast.calories, 0) +
                            COALESCE(mp.lunch.calories, 0) +
                            COALESCE(mp.dinner.calories, 0)
                        )
                        FROM MealPlan mp
                        WHERE mp.user = :user
                        """)
        Double getAverageCaloriesPerDay(@Param("user") User user);

        /**
         * Tìm meal plans upcoming (từ hôm nay trở đi)
         */
        @Query("""
                        SELECT mp FROM MealPlan mp
                        WHERE mp.user = :user
                        AND mp.date >= CURRENT_DATE
                        ORDER BY mp.date
                        """)
        List<MealPlan> findUpcomingMealPlans(@Param("user") User user);

        /**
         * Tìm meal plans past (trước hôm nay)
         */
        @Query("""
                        SELECT mp FROM MealPlan mp
                        WHERE mp.user = :user
                        AND mp.date < CURRENT_DATE
                        ORDER BY mp.date DESC
                        """)
        List<MealPlan> findPastMealPlans(@Param("user") User user);
}
