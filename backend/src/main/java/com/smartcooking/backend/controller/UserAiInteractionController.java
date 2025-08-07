package com.smartcooking.backend.controller;

import com.smartcooking.backend.dto.UserAiInteractionDTO;
import com.smartcooking.backend.service.UserAiInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller để quản lý tương tác của người dùng với AI
 */
@RestController
@RequestMapping("/api/ai-interactions")
@RequiredArgsConstructor
public class UserAiInteractionController {

    private final UserAiInteractionService userAiInteractionService;

    /**
     * Lấy tất cả tương tác của một người dùng
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserAiInteractionDTO>> getAllUserInteractions(@PathVariable Long userId) {
        List<UserAiInteractionDTO> interactions = userAiInteractionService.getAllUserInteractions(userId);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy tương tác của một người dùng với phân trang
     */
    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<Page<UserAiInteractionDTO>> getUserInteractionsPaged(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<UserAiInteractionDTO> interactions = userAiInteractionService.getUserInteractions(userId, pageable);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy tương tác theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserAiInteractionDTO> getInteractionById(@PathVariable Long id) {
        return userAiInteractionService.getInteractionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lấy tương tác theo loại AI
     */
    @GetMapping("/user/{userId}/type/{aiType}")
    public ResponseEntity<List<UserAiInteractionDTO>> getInteractionsByAiType(
            @PathVariable Long userId,
            @PathVariable String aiType) {

        List<UserAiInteractionDTO> interactions = userAiInteractionService.getInteractionsByAiType(userId, aiType);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy tương tác trong khoảng thời gian
     */
    @GetMapping("/user/{userId}/time-range")
    public ResponseEntity<List<UserAiInteractionDTO>> getInteractionsInTimeRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<UserAiInteractionDTO> interactions = userAiInteractionService.getInteractionsInTimeRange(userId, start,
                end);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Lấy thống kê tương tác
     */
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserInteractionStats(@PathVariable Long userId) {
        Long totalExecutionTime = userAiInteractionService.getTotalExecutionTime(userId);
        Long totalTokensUsed = userAiInteractionService.getTotalTokensUsed(userId);

        Map<String, Object> stats = Map.of(
                "totalExecutionTimeMs", totalExecutionTime != null ? totalExecutionTime : 0,
                "totalTokensUsed", totalTokensUsed != null ? totalTokensUsed : 0);

        return ResponseEntity.ok(stats);
    }

    /**
     * Tìm kiếm tương tác theo nội dung
     */
    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<UserAiInteractionDTO>> searchInteractions(
            @PathVariable Long userId,
            @RequestParam String query) {

        List<UserAiInteractionDTO> interactions = userAiInteractionService.searchInteractions(userId, query);
        return ResponseEntity.ok(interactions);
    }

    /**
     * Xóa tương tác
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInteraction(@PathVariable Long id) {
        userAiInteractionService.deleteInteraction(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa tất cả tương tác của một người dùng
     */
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllUserInteractions(@PathVariable Long userId) {
        userAiInteractionService.deleteAllUserInteractions(userId);
        return ResponseEntity.noContent().build();
    }
}
