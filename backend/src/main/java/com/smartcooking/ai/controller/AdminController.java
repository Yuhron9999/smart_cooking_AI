package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin Controller - Chỉ ADMIN mới có quyền truy cập
 * 
 * Endpoints:
 * - GET /admin/users - Xem tất cả users
 * - PUT /admin/users/{id}/role - Thay đổi role của user
 * - DELETE /admin/users/{id} - Xóa user
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    /**
     * Lấy danh sách tất cả users - Chỉ ADMIN
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Thay đổi role của user - Chỉ ADMIN
     */
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> changeUserRole(
            @PathVariable Long id,
            @RequestParam User.Role role) {
        User updatedUser = userService.changeUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Xóa user - Chỉ ADMIN
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Thống kê hệ thống - Chỉ ADMIN
     */
    @GetMapping("/stats")
    public ResponseEntity<Object> getSystemStats() {
        // TODO: Implement system statistics
        return ResponseEntity.ok("System statistics - Admin only");
    }
}
