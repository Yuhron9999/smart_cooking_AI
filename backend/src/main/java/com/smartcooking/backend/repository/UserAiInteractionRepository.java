package com.smartcooking.backend.repository;

import com.smartcooking.backend.entity.UserAiInteraction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserAiInteractionRepository extends JpaRepository<UserAiInteraction, Long> {

    // Tìm tất cả tương tác của một người dùng
    List<UserAiInteraction> findByUserId(Long userId);

    // Tìm tương tác của một người dùng với phân trang
    Page<UserAiInteraction> findByUserId(Long userId, Pageable pageable);

    // Tìm tương tác theo loại AI
    List<UserAiInteraction> findByUserIdAndAiType(Long userId, UserAiInteraction.AIType aiType);

    // Tìm tương tác thành công
    List<UserAiInteraction> findByUserIdAndSuccess(Long userId, Boolean success);

    // Tìm tương tác trong khoảng thời gian
    List<UserAiInteraction> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    // Tính tổng thời gian thực thi
    @Query("SELECT SUM(uai.executionTimeMs) FROM UserAiInteraction uai WHERE uai.userId = :userId")
    Long sumExecutionTimeByUserId(@Param("userId") Long userId);

    // Tính tổng token sử dụng
    @Query("SELECT SUM(uai.tokensUsed) FROM UserAiInteraction uai WHERE uai.userId = :userId")
    Long sumTokensUsedByUserId(@Param("userId") Long userId);

    // Tìm các input/output tương tự
    @Query("SELECT uai FROM UserAiInteraction uai WHERE uai.userId = :userId AND uai.input LIKE %:query% OR uai.output LIKE %:query%")
    List<UserAiInteraction> searchByContent(@Param("userId") Long userId, @Param("query") String query);
}
