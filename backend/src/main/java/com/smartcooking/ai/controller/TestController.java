package com.smartcooking.ai.controller;

import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.repository.UserRepository;
import com.smartcooking.ai.repository.RecipeRepository;
import com.smartcooking.ai.repository.CategoryRepository;
import com.smartcooking.ai.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Test Controller - API Testing và Health Check endpoints
 * Dành cho việc test kết nối database, authentication và role-based access
 */
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "🧪 Test API", description = "API Testing, Health Check và Database connectivity")
@CrossOrigin(origins = { "http://localhost:54072", "http://localhost:3000", "http://localhost:3001" })
public class TestController {

    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private AuthService authService;

    /**
     * 🏓 Ping Test
     */
    @GetMapping("/ping")
    @Operation(summary = "🏓 Ping Test", description = "Simple ping test để kiểm tra server response")
    @ApiResponse(responseCode = "200", description = "Server phản hồi thành công")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * 🏥 Health Check - Kiểm tra trạng thái server
     */
    @GetMapping("/health")
    @Operation(summary = "🏥 Health Check", description = "Kiểm tra trạng thái sức khỏe của server và các services chính")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Server đang hoạt động tốt"),
            @ApiResponse(responseCode = "500", description = "Server gặp vấn đề")
    })
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "Smart Cooking AI Backend");
        health.put("version", "1.0.0");

        try {
            // Test database connection
            try (Connection connection = dataSource.getConnection()) {
                health.put("database", "CONNECTED");
                health.put("databaseUrl", connection.getMetaData().getURL());
            }
        } catch (Exception e) {
            health.put("database", "DISCONNECTED");
            health.put("databaseError", e.getMessage());
        }

        // Test repositories
        try {
            long userCount = userRepository.count();
            health.put("userRepository", "OK");
            health.put("totalUsers", userCount);
        } catch (Exception e) {
            health.put("userRepository", "ERROR");
            health.put("repositoryError", e.getMessage());
        }

        return ResponseEntity.ok(health);
    }

    /**
     * 🔐 Auth Test
     */
    @GetMapping("/auth-test")
    @Operation(summary = "🔐 Authentication Test", description = "Kiểm tra các authentication endpoints")
    @ApiResponse(responseCode = "200", description = "Auth endpoints sẵn sàng")
    public ResponseEntity<Map<String, String>> authTest() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Authentication endpoints are ready");
        response.put("endpoints", "/api/auth/google-login, /api/auth/login, /api/auth/register, /api/auth/me");
        return ResponseEntity.ok(response);
    }

    /**
     * 📢 Echo Test
     */
    @PostMapping("/echo")
    @Operation(summary = "📢 Echo Test", description = "Echo lại data được gửi lên - test POST request")
    @ApiResponse(responseCode = "200", description = "Echo thành công")
    public ResponseEntity<Map<String, Object>> echo(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("echo", request);
        response.put("received_at", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * 🗄️ Database Connection Test
     */
    @GetMapping("/database")
    @Operation(summary = "🗄️ Database Connection Test", description = "Kiểm tra kết nối MySQL database và hiển thị thông tin chi tiết")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Kết nối database thành công", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\n"
                    +
                    "  \"status\": \"CONNECTED\",\n" +
                    "  \"databaseName\": \"smart_cooking1\",\n" +
                    "  \"url\": \"jdbc:mysql://localhost:3306/smart_cooking1\",\n" +
                    "  \"driver\": \"MySQL Connector/J\",\n" +
                    "  \"autoCommit\": true,\n" +
                    "  \"catalog\": \"smart_cooking1\"\n" +
                    "}"))),
            @ApiResponse(responseCode = "500", description = "Lỗi kết nối database")
    })
    public ResponseEntity<Map<String, Object>> testDatabase() {
        Map<String, Object> result = new HashMap<>();

        try (Connection connection = dataSource.getConnection()) {
            result.put("status", "CONNECTED");
            result.put("databaseName", connection.getCatalog());
            result.put("url", connection.getMetaData().getURL());
            result.put("driver", connection.getMetaData().getDriverName());
            result.put("autoCommit", connection.getAutoCommit());
            result.put("catalog", connection.getCatalog());
            result.put("timestamp", LocalDateTime.now());

            log.info("Database connection test successful: {}", connection.getMetaData().getURL());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
            result.put("timestamp", LocalDateTime.now());

            log.error("Database connection test failed: {}", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 👥 User Repository Test
     */
    @GetMapping("/users")
    @Operation(summary = "👥 User Repository Test", description = "Test UserRepository và hiển thị danh sách users (giới hạn 10)")
    @ApiResponse(responseCode = "200", description = "Lấy danh sách users thành công")
    public ResponseEntity<Map<String, Object>> testUsers() {
        Map<String, Object> result = new HashMap<>();

        try {
            long totalUsers = userRepository.count();
            List<User> users = userRepository.findAll().stream().limit(10).toList();

            result.put("status", "SUCCESS");
            result.put("totalUsers", totalUsers);
            result.put("displayedUsers", users.size());
            result.put("users", users);
            result.put("timestamp", LocalDateTime.now());

            log.info("User repository test successful. Total users: {}", totalUsers);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
            result.put("timestamp", LocalDateTime.now());

            log.error("User repository test failed: {}", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 🔓 Public Endpoint Test
     */
    @GetMapping("/public")
    @Operation(summary = "🔓 Public Endpoint Test", description = "Test public endpoint - không cần authentication")
    @ApiResponse(responseCode = "200", description = "Public endpoint hoạt động tốt")
    public ResponseEntity<Map<String, String>> testPublic() {
        Map<String, String> result = new HashMap<>();
        result.put("message", "✅ Public endpoint working!");
        result.put("description", "This endpoint is accessible without authentication");
        result.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(result);
    }

    /**
     * 🔐 Protected Endpoint Test - USER role
     */
    @GetMapping("/protected/user")
    @PreAuthorize("hasAnyRole('USER', 'CHEF', 'ADMIN')")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "🔐 Protected Endpoint - USER", description = "Test protected endpoint cần USER role trở lên. **Cần JWT token!**")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Access granted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid token"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient role")
    })
    public ResponseEntity<Map<String, String>> testProtectedUser() {
        Map<String, String> result = new HashMap<>();
        result.put("message", "✅ USER protected endpoint working!");
        result.put("requiredRole", "USER, CHEF, or ADMIN");
        result.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(result);
    }

    /**
     * 👨‍🍳 Protected Endpoint Test - CHEF role
     */
    @GetMapping("/protected/chef")
    @PreAuthorize("hasAnyRole('CHEF', 'ADMIN')")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "👨‍🍳 Protected Endpoint - CHEF", description = "Test protected endpoint cần CHEF role trở lên. **Cần JWT token!**")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Access granted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid token"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Need CHEF or ADMIN role")
    })
    public ResponseEntity<Map<String, String>> testProtectedChef() {
        Map<String, String> result = new HashMap<>();
        result.put("message", "✅ CHEF protected endpoint working!");
        result.put("requiredRole", "CHEF or ADMIN");
        result.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(result);
    }

    /**
     * 👑 Protected Endpoint Test - ADMIN role
     */
    @GetMapping("/protected/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearer-jwt")
    @Operation(summary = "👑 Protected Endpoint - ADMIN", description = "Test protected endpoint cần ADMIN role. **Cần JWT token!**")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Access granted"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Missing or invalid token"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Need ADMIN role")
    })
    public ResponseEntity<Map<String, String>> testProtectedAdmin() {
        Map<String, String> result = new HashMap<>();
        result.put("message", "✅ ADMIN protected endpoint working!");
        result.put("requiredRole", "ADMIN only");
        result.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(result);
    }

    /**
     * 🔑 JWT Token Validation Test
     */
    @PostMapping("/validate-token")
    @Operation(summary = "🔑 JWT Token Validation", description = "Test và validate JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token hợp lệ"),
            @ApiResponse(responseCode = "400", description = "Token không hợp lệ")
    })
    public ResponseEntity<Map<String, Object>> validateToken(
            @Parameter(description = "JWT token cần validate", required = true) @RequestBody Map<String, String> request) {

        Map<String, Object> result = new HashMap<>();
        String token = request.get("token");

        try {
            boolean isValid = authService.verifyToken(token);
            result.put("valid", isValid);

            if (isValid) {
                User user = authService.getCurrentUserFromToken(token);
                result.put("user", Map.of(
                        "email", user.getEmail(),
                        "name", user.getFullName(),
                        "role", user.getRole(),
                        "provider", user.getProvider()));
                result.put("message", "Token is valid");
            } else {
                result.put("message", "Token is invalid or expired");
            }

            result.put("timestamp", LocalDateTime.now());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", e.getMessage());
            result.put("timestamp", LocalDateTime.now());
            return ResponseEntity.badRequest().body(result);
        }
    }

    /**
     * 📊 System Info
     */
    @GetMapping("/system")
    @Operation(summary = "📊 System Information", description = "Hiển thị thông tin hệ thống và environment")
    @ApiResponse(responseCode = "200", description = "Thông tin hệ thống")
    public ResponseEntity<Map<String, Object>> systemInfo() {
        Map<String, Object> info = new HashMap<>();

        // Java info
        info.put("javaVersion", System.getProperty("java.version"));
        info.put("javaVendor", System.getProperty("java.vendor"));

        // Spring Boot info
        info.put("springBootVersion", "3.1.2");
        info.put("profileActive", System.getProperty("spring.profiles.active", "default"));

        // System resources
        Runtime runtime = Runtime.getRuntime();
        info.put("totalMemory", runtime.totalMemory());
        info.put("freeMemory", runtime.freeMemory());
        info.put("maxMemory", runtime.maxMemory());
        info.put("processors", runtime.availableProcessors());

        // OS info
        info.put("osName", System.getProperty("os.name"));
        info.put("osVersion", System.getProperty("os.version"));

        info.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(info);
    }

    /**
     * 📊 Database Statistics
     */
    @GetMapping("/stats")
    @Operation(summary = "📊 Database Statistics", description = "Hiển thị thống kê database (số users, recipes, categories)")
    @ApiResponse(responseCode = "200", description = "Thống kê database thành công")
    public ResponseEntity<Map<String, Object>> getDatabaseStats() {
        Map<String, Object> result = new HashMap<>();

        try {
            long userCount = userRepository.count();
            long recipeCount = recipeRepository.count();
            long categoryCount = categoryRepository.count();

            result.put("status", "success");
            result.put("database", "smart_cooking1");
            result.put("userCount", userCount);
            result.put("recipeCount", recipeCount);
            result.put("categoryCount", categoryCount);
            result.put("message", "MySQL connection and Spring Boot role-based security working!");
            result.put("timestamp", LocalDateTime.now());

            log.info("Database stats retrieved successfully - Users: {}, Recipes: {}, Categories: {}",
                    userCount, recipeCount, categoryCount);

        } catch (Exception e) {
            result.put("status", "error");
            result.put("error", e.getMessage());
            result.put("timestamp", LocalDateTime.now());

            log.error("Failed to get database stats: {}", e.getMessage());
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Handle CORS preflight requests
     */
    @RequestMapping(value = "/**", method = RequestMethod.OPTIONS)
    @Operation(hidden = true)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok().build();
    }
}
