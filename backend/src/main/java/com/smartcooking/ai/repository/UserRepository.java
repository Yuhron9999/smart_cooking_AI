package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

/**
 * User Repository với các query methods tùy chỉnh
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

        /**
         * Tìm user theo email
         */
        Optional<User> findByEmail(String email);

        /**
         * Tìm user theo provider và provider ID (cho OAuth2)
         */
        Optional<User> findByProviderAndProviderId(User.AuthProvider provider, String providerId);

        /**
         * Kiểm tra email đã tồn tại chưa
         */
        boolean existsByEmail(String email);

        /**
         * Tìm users theo role
         */
        List<User> findByRole(User.Role role);

        /**
         * Tìm users active
         */
        List<User> findByIsActiveTrue();

        /**
         * Tìm users theo vùng miền
         */
        @Query("SELECT u FROM User u WHERE u.regionPreference = :region AND u.isActive = true")
        List<User> findActiveUsersByRegion(@Param("region") String region);

        /**
         * Tìm users gần vị trí địa lý (trong phạm vi 50km)
         */
        @Query(value = """
                        SELECT * FROM users u
                        WHERE u.is_active = true
                        AND u.latitude IS NOT NULL
                        AND u.longitude IS NOT NULL
                        AND (6371 * acos(cos(radians(:latitude))
                        * cos(radians(u.latitude))
                        * cos(radians(u.longitude) - radians(:longitude))
                        + sin(radians(:latitude))
                        * sin(radians(u.latitude)))) < 50
                        """, nativeQuery = true)
        List<User> findUsersNearLocation(@Param("latitude") Double latitude,
                        @Param("longitude") Double longitude);

        /**
         * Tìm users theo ngôn ngữ ưa thích
         */
        List<User> findByLanguagePreference(String languagePreference);

        /**
         * Đếm users theo role
         */
        long countByRole(User.Role role);

        /**
         * Tìm users có hạn chế ăn uống cụ thể
         */
        @Query("SELECT u FROM User u WHERE :restriction MEMBER OF u.dietaryRestrictions")
        List<User> findByDietaryRestriction(@Param("restriction") User.DietaryRestriction restriction);

        /**
         * Tìm top users theo số lượng recipes đã tạo
         */
        @Query("""
                        SELECT u FROM User u
                        LEFT JOIN u.createdRecipes r
                        WHERE u.isActive = true
                        GROUP BY u.id
                        ORDER BY COUNT(r.id) DESC
                        """)
        Page<User> findTopRecipeCreators(Pageable pageable);

        /**
         * Tìm users đã đăng ký trong khoảng thời gian
         */
        @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate")
        List<User> findUsersRegisteredBetween(@Param("startDate") java.time.LocalDateTime startDate,
                        @Param("endDate") java.time.LocalDateTime endDate);
}
