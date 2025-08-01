# 🚀 SETUP ENVIRONMENT - Smart Cooking AI

## 📋 Cài đặt Python & Dependencies

### 1. **Cài đặt Python**

```bash
# Tải Python từ: https://www.python.org/downloads/
# Hoặc qua Microsoft Store
# Đảm bảo check "Add Python to PATH"
```

### 2. **Verify Python Installation**

```bash
python --version
pip --version
```

### 3. **Cài đặt AI Service Dependencies**

```bash
cd c:\SmartCookingAI_2\ai-service
pip install fastapi uvicorn python-dotenv openai
```

### 4. **Khởi động AI Service**

```bash
cd c:\SmartCookingAI_2\ai-service
python app.py
```

### 5. **Test API Mock Service**

```bash
# Test health check
curl http://localhost:8001/health

# Test mock regional suggestions
curl -X POST http://localhost:8001/api/maps/regional-suggestions \
  -H "Content-Type: application/json" \
  -d '{"latitude": 21.0285, "longitude": 105.8542}'

# Test mock nearby search
curl -X POST http://localhost:8001/api/maps/nearby-search \
  -H "Content-Type: application/json" \
  -d '{"latitude": 21.0285, "longitude": 105.8542, "radius": 2000, "place_type": "supermarket"}'

# Test mock geocoding
curl -X POST http://localhost:8001/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "Hà Nội, Vietnam"}'
```

## 🔧 Backend Spring Boot Setup

### 1. **Khởi động Backend**

```bash
cd c:\SmartCookingAI_2\backend
# Nếu có Maven wrapper:
./mvnw spring-boot:run

# Hoặc nếu có Maven global:
mvn spring-boot:run
```

### 2. **Test Backend Health**

```bash
curl http://localhost:8080/api/health
```

## 📱 Frontend Setup

### 1. **Cài đặt Node.js dependencies**

```bash
cd c:\SmartCookingAI_2\frontend-web
npm install
```

### 2. **Khởi động Frontend**

```bash
cd c:\SmartCookingAI_2\frontend-web
npm run dev
```

### 3. **Test Frontend**

- Mở browser: http://localhost:3000

## 🧪 Full System Test

### Khi tất cả service đang chạy:

1. **AI Service**: http://localhost:8001
2. **Backend**: http://localhost:8080
3. **Frontend**: http://localhost:3000

### Test workflow:

1. Mở frontend
2. Thử tính năng AI chat (sẽ dùng mock service)
3. Thử tìm kiếm cửa hàng gần đây (mock data)
4. Thử gợi ý món ăn theo vùng miền

## 🔑 API Keys Status

- ✅ **Mock Services**: Hoạt động mà không cần API keys
- ⚠️ **OpenAI**: Cần credit trong tài khoản
- ❌ **Google Maps**: Cần tạo API key mới (xem GOOGLE_API_SETUP_GUIDE.md)

## 📝 Ghi chú Quan trọng

1. **Mock Services**: Tất cả Google Maps features sẽ dùng mock data
2. **Development Mode**: App có thể chạy hoàn toàn với mock data
3. **Production**: Cần API keys thật cho deployment
4. **Testing**: Mock data đủ để develop và test UI/UX

## 🛠️ Troubleshooting

### Python không tìm thấy:

```bash
# Windows 10/11: Cài từ Microsoft Store
# Hoặc download từ python.org
# Nhớ check "Add to PATH"
```

### Port conflicts:

```bash
# AI Service: 8001
# Backend: 8080
# Frontend: 3000
# Đảm bảo không có service nào khác dùng các port này
```

### Mock data không load:

```bash
# Check file mock_google_service.py exists
# Check import trong app.py
# Check logs trong console
```
