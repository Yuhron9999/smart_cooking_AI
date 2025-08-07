package com.smartcooking.backend.service;

import com.smartcooking.backend.dto.UserAiInteractionDTO;
import com.smartcooking.backend.entity.UserAiInteraction;
import com.smartcooking.backend.repository.UserAiInteractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service để quản lý tương tác của người dùng với AI
 */
@Service
@RequiredArgsConstructor
public class UserAiInteractionService {

    private final UserAiInteractionRepository userAiInteractionRepository;

    /**
     * Lấy tất cả tương tác của một người dùng
     */
    public List<UserAiInteractionDTO> getAllUserInteractions(Long userId) {
        return userAiInteractionRepository.findByUserId(userId).stream()
                .map(UserAiInteractionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tương tác của một người dùng với phân trang
     */
    public Page<UserAiInteractionDTO> getUserInteractions(Long userId, Pageable pageable) {
        return userAiInteractionRepository.findByUserId(userId, pageable)
                .map(UserAiInteractionDTO::fromEntity);
    }

    /**
     * Lấy tương tác theo ID
     */
    public Optional<UserAiInteractionDTO> getInteractionById(Long id) {
        return userAiInteractionRepository.findById(id)
                .map(UserAiInteractionDTO::fromEntity);
    }

    /**
     * Lấy tương tác theo loại AI
     */
    public List<UserAiInteractionDTO> getInteractionsByAiType(Long userId, String aiType) {
        UserAiInteraction.AIType type = UserAiInteraction.AIType.valueOf(aiType);
        return userAiInteractionRepository.findByUserIdAndAiType(userId, type).stream()
                .map(UserAiInteractionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tương tác trong khoảng thời gian
     */
    public List<UserAiInteractionDTO> getInteractionsInTimeRange(Long userId, LocalDateTime start, LocalDateTime end) {
        return userAiInteractionRepository.findByUserIdAndCreatedAtBetween(userId, start, end).stream()
                .map(UserAiInteractionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tổng thời gian thực thi
     */
    public Long getTotalExecutionTime(Long userId) {
        return userAiInteractionRepository.sumExecutionTimeByUserId(userId);
    }

    /**
     * Lấy tổng token sử dụng
     */
    public Long getTotalTokensUsed(Long userId) {
        return userAiInteractionRepository.sumTokensUsedByUserId(userId);
    }

    /**
     * Tìm kiếm tương tác theo nội dung
     */
    public List<UserAiInteractionDTO> searchInteractions(Long userId, String query) {
        return userAiInteractionRepository.searchByContent(userId, query).stream()
                .map(UserAiInteractionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Xóa tương tác
     */
    public void deleteInteraction(Long id) {
        userAiInteractionRepository.deleteById(id);
    }

    /**
     * Xóa tất cả tương tác của một người dùng
     */
    public void deleteAllUserInteractions(Long userId) {
        List<UserAiInteraction> interactions = userAiInteractionRepository.findByUserId(userId);
        userAiInteractionRepository.deleteAll(interactions);
    }
}
