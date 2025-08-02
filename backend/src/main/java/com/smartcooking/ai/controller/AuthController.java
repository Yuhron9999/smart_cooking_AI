package com.smartcooking.ai.controller;

import com.smartcooking.ai.dto.AuthRequest;
import com.smartcooking.ai.dto.AuthResponse;
import com.smartcooking.ai.dto.GoogleAuthRequest;
import com.smartcooking.ai.entity.User;
import com.smartcooking.ai.service.AuthServiceSimple;
import com.smartcooking.ai.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Authentication Controller với Swagger Documentation
 * Xử lý Google OAuth2, JWT authentication và user registration
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "🔐 Authentication", description = "Google OAuth2, JWT Authentication và User Registration")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class AuthController {

    private final AuthServiceSimple authService;
    private final UserService userService;

    /**
     * 🔑 Google OAuth2 Login
     */
    @PostMapping("/google-login")
    @Operation(summary = "🔑 Google OAuth2 Login", description = "Đăng nhập bằng Google OAuth2. Tự động tạo user mới nếu chưa tồn tại.", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Google OAuth2 user information", required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = GoogleAuthRequest.class), examples = @ExampleObject(name = "Google Login Example", value = "{\n"
            +
            "  \"email\": \"user@gmail.com\",\n" +
            "  \"name\": \"Nguyễn Văn A\",\n" +
            "  \"avatarUrl\": \"https://lh3.googleusercontent.com/...\",\n" +
            "  \"providerId\": \"110123456789012345678\"\n" +
            "}"))))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\n"
                    +
                    "  \"success\": true,\n" +
                    "  \"message\": \"Google authentication successful\",\n" +
                    "  \"accessToken\": \"eyJhbGciOiJIUzI1NiJ9...\",\n" +
                    "  \"refreshToken\": \"eyJhbGciOiJIUzI1NiJ9...\",\n" +
                    "  \"expiresIn\": 3600000\n" +
                    "}"))),
            @ApiResponse(responseCode = "400", description = "Thông tin Google OAuth2 không hợp lệ"),
            @ApiResponse(responseCode = "500", description = "Lỗi server trong quá trình xác thực")
    })
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            log.info("Google OAuth2 login attempt for email: {}", request.getEmail());

            AuthResponse response = authService.authenticateWithGoogle(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Google login error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(
                            false,
                            "Google authentication failed: " + e.getMessage(),
                            null, null, null, 0));
        }
    }

    /**
     * Local Login với email/password
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            log.info("Local login attempt for email: {}", request.getEmail());

            AuthResponse response = authService.authenticateWithPassword(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Local login error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(
                            false,
                            "Authentication failed: " + e.getMessage(),
                            null, null, null, 0));
        }
    }

    /**
     * Register user mới
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        try {
            log.info("User registration attempt for email: {}", request.getEmail());

            AuthResponse response = authService.registerUser(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Registration error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(
                            false,
                            "Registration failed: " + e.getMessage(),
                            null, null, null, 0));
        }
    }

    /**
     * Lấy thông tin user hiện tại từ JWT token
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).build();
            }

            User user = authService.getCurrentUserFromToken(token);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            log.error("Get current user error: {}", e.getMessage());
            return ResponseEntity.status(401).build();
        }
    }

    /**
     * Refresh JWT token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null) {
                return ResponseEntity.badRequest()
                        .body(new AuthResponse(
                                false,
                                "Refresh token is required",
                                null, null, null, 0));
            }

            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Token refresh error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(
                            false,
                            "Token refresh failed: " + e.getMessage(),
                            null, null, null, 0));
        }
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token != null) {
                authService.logout(token);
            }

            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));

        } catch (Exception e) {
            log.error("Logout error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("message", "Logged out"));
        }
    }

    /**
     * Verify JWT token
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("valid", false, "message", "Token is required"));
            }

            boolean isValid = authService.verifyToken(token);
            if (isValid) {
                User user = authService.getCurrentUserFromToken(token);
                return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "user", user,
                        "message", "Token is valid"));
            } else {
                return ResponseEntity.ok(Map.of(
                        "valid", false,
                        "message", "Token is invalid or expired"));
            }

        } catch (Exception e) {
            log.error("Token verification error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "message", "Token verification failed"));
        }
    }

    /**
     * Extract JWT token from Authorization header
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
