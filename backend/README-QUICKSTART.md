# 🚀 Smart Cooking AI Backend - Quick Start

## ✅ Lỗi đã được sửa!

Tất cả lỗi syntax trong `TestController.java` đã được khắc phục:

- ✅ Sửa lỗi missing closing braces
- ✅ Sửa lỗi syntax error trong try-catch block
- ✅ Cải thiện code structure và formatting
- ✅ Thêm proper Swagger annotations

## 🏃‍♂️ Khởi động Server

### Cách 1: Sử dụng Script (Khuyến nghị)

```bash
# Windows - Double click hoặc chạy trong Command Prompt
start-server.bat
```

### Cách 2: Maven Command Line

```bash
cd C:\SmartCookingAI_2\backend
mvn spring-boot:run
```

### Cách 3: IDE

- Mở project trong IntelliJ IDEA hoặc Eclipse
- Run `SmartCookingAiApplication.java`

## 🧪 Test API

### Sau khi server khởi động thành công:

```bash
# Test script tự động
test-api.bat

# Hoặc test thủ công
curl http://localhost:8080/api/test/ping
curl http://localhost:8080/api/test/health
curl http://localhost:8080/api/test/database
```

## 🌐 Truy cập Web Interface

| Service           | URL                                       | Mô tả                            |
| ----------------- | ----------------------------------------- | -------------------------------- |
| **Swagger UI**    | http://localhost:8080/api/swagger-ui.html | 📖 Interactive API Documentation |
| **API Docs**      | http://localhost:8080/api/v3/api-docs     | 📋 OpenAPI JSON Schema           |
| **Health Check**  | http://localhost:8080/api/test/health     | 🏥 Server Health Status          |
| **Database Test** | http://localhost:8080/api/test/database   | 🗄️ MySQL Connection Test         |

## 🎯 Available Endpoints

### 🧪 Test Endpoints (Public)

- `GET /api/test/ping` - Simple ping test
- `GET /api/test/health` - Health check với database status
- `GET /api/test/database` - MySQL connection details
- `GET /api/test/public` - Public endpoint test
- `GET /api/test/stats` - Database statistics
- `GET /api/test/system` - System information

### 🔐 Authentication Endpoints

- `POST /api/auth/google-login` - Google OAuth2 login
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user (requires JWT)

### 🔒 Protected Test Endpoints (Require JWT)

- `GET /api/test/protected/user` - USER role test
- `GET /api/test/protected/chef` - CHEF role test
- `GET /api/test/protected/admin` - ADMIN role test
- `POST /api/test/validate-token` - JWT validation

## 🔑 Testing Authentication

### 1. Register a new user:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'
```

### 2. Copy the `accessToken` from response

### 3. Test protected endpoint:

```bash
curl -X GET http://localhost:8080/api/test/protected/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 🛡️ Role-Based Access Control

| Role      | Permissions                                    |
| --------- | ---------------------------------------------- |
| **USER**  | View recipes, use AI features, personal data   |
| **CHEF**  | Create/edit recipes, manage learning paths     |
| **ADMIN** | Full system access, user management, analytics |

## 📊 Swagger UI Features

1. **🔍 Explore APIs**: Browse all available endpoints
2. **🧪 Test Live**: Execute requests directly from UI
3. **🔐 Authenticate**: Built-in JWT authorization
4. **📖 Documentation**: Detailed descriptions and examples
5. **📝 Schema**: Request/response models

## ⚠️ Troubleshooting

### Server won't start:

1. Check if port 8080 is available: `netstat -ano | findstr :8080`
2. Kill existing processes: `taskkill /f /pid <PID>`
3. Check MySQL is running
4. Verify Java 17+ is installed: `java -version`

### Database connection issues:

1. Start MySQL service
2. Create database: `CREATE DATABASE smart_cooking1;`
3. Check credentials in `application.properties`

### Swagger UI not loading:

1. Wait for server to fully start (look for "Started SmartCookingAiApplication")
2. Try: http://localhost:8080/api/swagger-ui/index.html
3. Check logs for any errors

## 📝 Log Locations

- Console output shows startup status
- Application logs in `target/logs/` (if configured)
- Database connection status in health check endpoint

---

## 🎉 Success Indicators

✅ Server started successfully when you see:

```
Started SmartCookingAiApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http) with context path '/api'
```

✅ Database connected when health check shows:

```json
{
  "database": "CONNECTED",
  "databaseUrl": "jdbc:mysql://localhost:3306/smart_cooking1"
}
```

✅ APIs working when ping returns:

```json
{
  "message": "pong",
  "status": "success"
}
```

**Happy coding! 🚀**
