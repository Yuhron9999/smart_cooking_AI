package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    // Tìm preferences theo user ID
    Optional<UserPreference> findByUserId(Long userId);

    // Tìm users có cùng sở thích ẩm thực
    @Query("SELECT up FROM UserPreference up JOIN up.cuisinePreferences cp WHERE cp = :cuisine")
    List<UserPreference> findByCuisinePreference(@Param("cuisine") String cuisine);

    // Tìm users thích một nguyên liệu cụ thể
    @Query("SELECT up FROM UserPreference up JOIN up.likedIngredients li WHERE li = :ingredient")
    List<UserPreference> findByLikedIngredient(@Param("ingredient") String ingredient);

    // Tìm users không thích một nguyên liệu cụ thể
    @Query("SELECT up FROM UserPreference up JOIN up.dislikedIngredients di WHERE di = :ingredient")
    List<UserPreference> findByDislikedIngredient(@Param("ingredient") String ingredient);

    // Tìm users theo mức độ cay
    List<UserPreference> findBySpicePreference(UserPreference.SpiceLevel spiceLevel);

    // Tìm users theo tùy chọn ngôn ngữ
    List<UserPreference> findByLanguagePreference(String languagePreference);

    // Tìm users theo mức độ cá nhân hóa cao
    List<UserPreference> findByPersonalizationLevelGreaterThan(Integer level);

    // Kiểm tra xem user có thích một nguyên liệu hay không
    @Query("SELECT CASE WHEN COUNT(up) > 0 THEN true ELSE false END FROM UserPreference up JOIN up.likedIngredients li WHERE up.userId = :userId AND li = :ingredient")
    boolean isIngredientLiked(@Param("userId") Long userId, @Param("ingredient") String ingredient);

    // Kiểm tra xem user có không thích một nguyên liệu hay không
    @Query("SELECT CASE WHEN COUNT(up) > 0 THEN true ELSE false END FROM UserPreference up JOIN up.dislikedIngredients di WHERE up.userId = :userId AND di = :ingredient")
    boolean isIngredientDisliked(@Param("userId") Long userId, @Param("ingredient") String ingredient);
}
