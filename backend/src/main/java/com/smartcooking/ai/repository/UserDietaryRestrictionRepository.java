package com.smartcooking.ai.repository;

import com.smartcooking.ai.entity.UserDietaryRestriction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDietaryRestrictionRepository extends JpaRepository<UserDietaryRestriction, Long> {

    List<UserDietaryRestriction> findByUserId(Long userId);

    boolean existsByUserIdAndRestriction(Long userId, String restriction);

    void deleteByUserIdAndRestriction(Long userId, String restriction);

    void deleteByUserId(Long userId);

    @Query("SELECT udr.restriction FROM UserDietaryRestriction udr WHERE udr.userId = :userId")
    List<String> findRestrictionNamesByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(udr) FROM UserDietaryRestriction udr WHERE udr.userId = :userId")
    int countByUserId(@Param("userId") Long userId);

    List<UserDietaryRestriction> findByUserIdAndSeverity(Long userId, String severity);
}
