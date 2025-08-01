# 🤖 Smart Cooking AI Service

## 📋 Mô tả

AI Service với tích hợp Google Service Account cho Smart Cooking AI platform.

## 🚀 Cấu trúc File (Đã dọn dẹp)

```
ai-service/
├── app_enhanced.py          # Main FastAPI application với Google integration
├── google_service_manager.py # Google Service Account manager
├── start_service.py         # Script khởi động service
├── requirements.txt         # Dependencies (đã gộp enhanced)
├── .env                    # Environment configuration
├── .env.example           # Environment template
├── Dockerfile             # Docker container config
├── quick_test.py          # Quick validation test
├── test_google_service.py # Google Service Account test
├── test_endpoints.py      # API endpoints test
└── run_service_test.py    # Complete test suite
```

## ⚙️ Cài đặt

### 1. Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

### 2. Cấu hình Environment

Sao chép và chỉnh sửa file `.env`:

```bash
# Copy từ template
cp .env.example .env

# Chỉnh sửa các API keys trong .env
```

### 3. Google Service Account (Optional cho Production)

```bash
# Đặt file service account JSON vào:
# ./smart_cooking2.json
#
# Hoặc cập nhật đường dẫn trong .env:
# GOOGLE_SERVICE_ACCOUNT_FILE=./path/to/your/service-account.json
```

## 🔥 Khởi động Service

### Cách 1: Script khởi động

```bash
python start_service.py
```

### Cách 2: Uvicorn trực tiếp

```bash
uvicorn app_enhanced:app --host 0.0.0.0 --port 8001 --reload
```

### Cách 3: Docker

```bash
docker build -t smart-cooking-ai-service .
docker run -p 8001:8001 smart-cooking-ai-service
```

## 🧪 Testing

### Quick Test

```bash
python quick_test.py
```

### Google Service Test

```bash
python test_google_service.py
```

### Complete Test Suite

```bash
python run_service_test.py
```

### API Endpoints Test

```bash
python test_endpoints.py
```

## 📖 API Documentation

Sau khi khởi động service, truy cập:

- **API Docs**: http://localhost:8001/docs
- **Health Check**: http://localhost:8001/health
- **OpenAPI Schema**: http://localhost:8001/openapi.json

## 🎯 Endpoints Chính

### Health & Status

- `GET /health` - Service health check
- `GET /` - Welcome message

### AI Features

- `POST /api/ai/generate-recipe` - Tạo công thức từ nguyên liệu
- `POST /api/ai/chat` - Chat với AI assistant
- `POST /api/ai/analyze-image` - Phân tích ảnh món ăn

### Google Services

- `POST /api/google/regional-suggestions` - Gợi ý món ăn theo vùng
- `POST /api/google/find-stores` - Tìm cửa hàng nguyên liệu

## 🔧 Environment Variables

```bash
# API Keys
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Google Service Account
GOOGLE_PROJECT_ID=tactical-orbit-431412-v1
GOOGLE_CLIENT_EMAIL=smart-cooking2@tactical-orbit-431412-v1.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_FILE=./smart_cooking2.json

# Service Config
HOST=0.0.0.0
PORT=8001
DEBUG=True
LOG_LEVEL=INFO

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:8080
```

## 🛡️ Mock Services

Service có mock services tích hợp sẵn khi:

- Google Service Account file không tồn tại
- API keys không hợp lệ
- Quota API bị vượt quá

Mock services cung cấp data mẫu để development không bị gián đoạn.

## 🎉 Features

✅ **Google Service Account** integration  
✅ **Gemini AI** recipe generation  
✅ **Google Places API** store finder  
✅ **Regional suggestions** theo vị trí  
✅ **Mock services** cho development  
✅ **Comprehensive error handling**  
✅ **CORS** configured for multiple frontends  
✅ **Health monitoring** với detailed status  
✅ **Testing suite** hoàn chỉnh

## 🚨 Troubleshooting

### Service không khởi động được

```bash
# Kiểm tra dependencies
pip install -r requirements.txt

# Kiểm tra port 8001 có bị chiếm không
netstat -an | findstr 8001
```

### Google API lỗi

```bash
# Chạy test Google Service
python test_google_service.py

# Kiểm tra file service account
ls -la smart_cooking2.json
```

### Mock services không hoạt động

```bash
# Chạy quick test
python quick_test.py

# Kiểm tra logs trong terminal khi khởi động
```

## 📞 Support

- **Health Check**: http://localhost:8001/health
- **Logs**: Xem trong terminal khi chạy service
- **Tests**: Chạy `python quick_test.py` để kiểm tra cơ bản
