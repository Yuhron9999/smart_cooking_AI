# Hướng dẫn lấy giá trị Environment Variables từ application.properties

## 🚀 Cách thông minh nhất: Sử dụng file .env

### Bước 1: Copy file .env.example thành .env

```bash
copy .env.example .env
```

### Bước 2: Sử dụng script PowerShell để tự động mapping

Tạo file `extract-env-vars.ps1`:

```powershell
# Script tự động trích xuất biến môi trường từ application.properties
$propertiesFile = "backend/src/main/resources/application.properties"
$envFile = ".env"

# Đọc file properties
$content = Get-Content $propertiesFile -Raw

# Tìm tất cả biến môi trường ${VAR_NAME:default_value}
$pattern = '\$\{([A-Z_][A-Z0-9_]*?)(?::([^}]*))?\}'
$matches = [regex]::Matches($content, $pattern)

Write-Host "📋 Các biến môi trường cần thiết:" -ForegroundColor Green
Write-Host "=" * 50

foreach ($match in $matches) {
    $varName = $match.Groups[1].Value
    $defaultValue = $match.Groups[2].Value

    if ($defaultValue) {
        Write-Host "$varName=$defaultValue" -ForegroundColor Yellow
    } else {
        Write-Host "$varName=" -ForegroundColor Red
    }
}

Write-Host "`n✨ Copy các dòng trên vào file .env của bạn!"
```

### Bước 3: Chạy script

```powershell
powershell -ExecutionPolicy Bypass -File extract-env-vars.ps1
```

## 📊 Danh sách đầy đủ các biến cần thiết

Dựa trên file `application.properties`, đây là các biến cần điền:

```env
# Database
DB_PORT=3306
DB_NAME=smart_cooking_ai
DB_USERNAME=root
DB_PASSWORD=

# Debug
APP_DEBUG=false

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=86400000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# File Upload
MAX_FILE_SIZE_MB=10

# MinIO
MINIO_HOST=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=smart-cooking-files

# Elasticsearch
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# AI Service
AI_SERVICE_URL=http://localhost:8001
OPENAI_API_KEY=sk-your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000

# Analytics
ENABLE_ANALYTICS=true
ANALYTICS_SYNC_INTERVAL=3600

# Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=100

# Cache
CACHE_TTL_SECONDS=3600

# Google Cloud
BIGQUERY_PROJECT_ID=your_project_id
GOOGLE_SERVICE_ACCOUNT_KEY=path_to_service_account_key.json

# Voice
VOICE_STORAGE_DURATION_DAYS=30

# File Storage
ALLOWED_IMAGE_TYPES=jpg,jpeg,png,webp
ALLOWED_AUDIO_TYPES=mp3,wav,m4a
```

## 🔧 Cách sử dụng trong Spring Boot

1. **Tạo file .env** trong thư mục gốc dự án
2. **Điền giá trị thực tế** vào các biến
3. **Chạy ứng dụng** - Spring Boot sẽ tự động đọc từ system environment

## ⚡ Script một lệnh để setup nhanh

Tạo file `setup-env.ps1`:

```powershell
# Setup môi trường development nhanh
Write-Host "🚀 Setting up Smart Cooking AI environment..." -ForegroundColor Green

# Copy .env.example nếu .env chưa tồn tại
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file already exists" -ForegroundColor Yellow
}

# Set các biến môi trường cơ bản cho development
$env:DB_PORT="3306"
$env:DB_NAME="smart_cooking_ai"
$env:APP_DEBUG="true"
$env:JWT_SECRET="smart-cooking-secret-key-2025"
$env:REDIS_HOST="localhost"
$env:AI_SERVICE_URL="http://localhost:8001"

Write-Host "✅ Basic environment variables set for development" -ForegroundColor Green
Write-Host "📝 Please edit .env file to add your API keys!" -ForegroundColor Yellow
```

## 🎯 Tips tiết kiệm thời gian

1. **Sử dụng IDE extensions**:

   - VS Code: "Environment Variables" extension
   - IntelliJ: "EnvFile" plugin

2. **Profile-based configuration**:

   ```properties
   # application-dev.properties (for development)
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_cooking_ai

   # application-prod.properties (for production)
   spring.datasource.url=jdbc:mysql://prod-server:3306/smart_cooking_ai
   ```

3. **Docker Compose**: Tất cả biến môi trường đã được cấu hình sẵn trong `docker-compose.yml`

4. **Validation**: Thêm `@NotNull` vào các biến quan trọng để Spring Boot báo lỗi sớm:
   ```java
   @Value("${OPENAI_API_KEY}")
   @NotNull
   private String openaiApiKey;
   ```
