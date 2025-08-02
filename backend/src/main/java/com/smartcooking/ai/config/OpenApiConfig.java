package com.smartcooking.ai.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger Configuration for Smart Cooking AI Backend
 * Cấu hình API documentation và test interface
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Cooking AI Backend API")
                        .description("🍳 **Smart Cooking AI Backend** - Hệ thống nấu ăn thông minh tích hợp AI\n\n" +
                                "## 🎯 **Tính năng chính:**\n" +
                                "- 🔐 **Authentication**: Google OAuth2 + JWT\n" +
                                "- 👨‍🍳 **Role-based Access**: USER, CHEF, ADMIN\n" +
                                "- 📄 **Quản lý công thức**: CRUD operations\n" +
                                "- 🤖 **AI Integration**: Recipe generation, chat assistant\n" +
                                "- 🗂️ **Categories & Learning**: Phân loại và lộ trình học\n" +
                                "- 📊 **Analytics**: Theo dõi và báo cáo\n\n" +
                                "## 🛡️ **Phân quyền:**\n" +
                                "- **USER**: Xem công thức, sử dụng AI, meal planning\n" +
                                "- **CHEF**: Tạo/sửa công thức, quản lý lộ trình học\n" +
                                "- **ADMIN**: Toàn quyền quản lý hệ thống\n\n" +
                                "## 🔑 **Authentication:**\n" +
                                "1. Đăng nhập qua `/auth/google-login` hoặc `/auth/login`\n" +
                                "2. Copy `accessToken` từ response\n" +
                                "3. Click **Authorize** và paste token với prefix `Bearer `\n" +
                                "4. Test protected endpoints!\n\n" +
                                "---\n" +
                                "*Powered by Spring Boot 3.1.2 + MySQL + Redis*")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Smart Cooking AI Team")
                                .email("contact@smartcooking.ai")
                                .url("https://smartcooking.ai"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080" + contextPath)
                                .description("Development Server"),
                        new Server()
                                .url("https://api.smartcooking.ai" + contextPath)
                                .description("Production Server")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .in(SecurityScheme.In.HEADER)
                                .name("Authorization")
                                .description("JWT Authorization header using the Bearer scheme. " +
                                        "Example: \"Authorization: Bearer {token}\"")));
    }
}
