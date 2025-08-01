# 🤖 Smart Cooking AI Service - Hướng Dẫn Tích Hợp Google API

## 📋 Tổng Quan

Smart Cooking AI Service đã được nâng cấp với tích hợp đầy đủ Google API để cung cấp các tính năng AI tiên tiến:

### ✨ Tính Năng Đã Tích Hợp

1. **🧠 AI Recipe Generation** - Tạo công thức nấu ăn thông minh
2. **📍 Regional Food Suggestions** - Gợi ý món ăn theo khu vực
3. **🏪 Store Finder** - Tìm cửa hàng gần nhất bán nguyên liệu
4. **💬 AI Chat Assistant** - Trợ lý nấu ăn thông minh
5. **📸 Food Image Analysis** - Phân tích hình ảnh món ăn

## 🔧 Cài Đặt & Cấu Hình

### 1. Dependencies Đã Cài Đặt

```bash
# Core AI Services
google-generativeai==0.8.5    # Gemini AI
openai==1.97.1                # OpenAI GPT
google-api-python-client      # Google APIs
google-auth                   # Google Authentication

# FastAPI Framework
fastapi==0.116.1              # Web framework
uvicorn==0.35.0               # ASGI server
httpx==0.28.1                 # HTTP client
pydantic==2.11.7              # Data validation
```

### 2. Environment Variables (.env)

```env
# Google API Keys (Required)
GOOGLE_API_KEY=your_google_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Service Configuration
PORT=8002
DEBUG=true
LOG_LEVEL=INFO

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:8080
```

## 🚀 Khởi Động Service

### Option 1: Direct Python

```bash
cd c:\SmartCookingAI_2\ai-service
py app_enhanced.py
```

### Option 2: Uvicorn

```bash
cd c:\SmartCookingAI_2\ai-service
py -m uvicorn app_enhanced:app --host 0.0.0.0 --port 8002 --reload
```

### Option 3: Batch Script

```bash
# Chạy file start_ai_service.bat
c:\SmartCookingAI_2\start_ai_service.bat
```

## 📡 API Endpoints

### 🏥 Health Check

```http
GET http://localhost:8002/health
```

### 🧠 Recipe Generation

```http
POST http://localhost:8002/api/ai/generate-recipe
Content-Type: application/json

{
  "ingredients": ["thịt bò", "khoai tây", "cà rốt"],
  "dietary_restrictions": ["không có"],
  "cooking_time": 45,
  "difficulty": "medium",
  "cuisine_type": "vietnamese",
  "language": "vi"
}
```

### 📍 Regional Suggestions

```http
POST http://localhost:8002/api/google/regional-suggestions
Content-Type: application/json

{
  "latitude": 10.7769,
  "longitude": 106.6856,
  "language": "vi"
}
```

### 🏪 Store Finder

```http
POST http://localhost:8002/api/google/find-stores
Content-Type: application/json

{
  "latitude": 10.7769,
  "longitude": 106.6856,
  "ingredients": ["thịt bò", "khoai tây"],
  "radius": 5000
}
```

### 💬 AI Chat

```http
POST http://localhost:8002/api/ai/chat
Content-Type: application/json

{
  "message": "Tôi muốn nấu phở bò, cần chuẩn bị gì?",
  "language": "vi",
  "context": []
}
```

### 📸 Image Analysis

```http
POST http://localhost:8002/api/ai/analyze-image
Content-Type: multipart/form-data

file: [image_file]
```

## 🔌 Flutter Integration

### Enhanced API Service

File: `c:\SmartCookingAI_2\frontend\src\services\enhanced_api_service.dart`

```dart
class EnhancedApiService {
  static const String baseUrl = 'http://localhost:8002';

  // AI Recipe Generation
  static Future<Map<String, dynamic>> generateRecipeWithAI({
    required List<String> ingredients,
    List<String> dietaryRestrictions = const [],
    int cookingTime = 30,
    String difficulty = 'medium',
    String cuisineType = 'any',
    String language = 'vi',
  });

  // Regional Suggestions
  static Future<Map<String, dynamic>> getRegionalSuggestions({
    required double latitude,
    required double longitude,
    String language = 'vi',
  });

  // Store Finder
  static Future<Map<String, dynamic>> findNearbyStores({
    required double latitude,
    required double longitude,
    required List<String> ingredients,
    int radius = 5000,
  });

  // AI Chat
  static Future<Map<String, dynamic>> chatWithAI({
    required String message,
    String language = 'vi',
    List<Map<String, dynamic>> context = const [],
  });
}
```

## 🎯 Features Status

### ✅ Hoàn Thành

- [x] FastAPI service architecture
- [x] Google API integration setup
- [x] Gemini AI & OpenAI integration
- [x] Enhanced Flutter API service
- [x] Modern UI with AI test card
- [x] Comprehensive error handling
- [x] Mock data fallbacks
- [x] CORS configuration
- [x] Environment configuration

### 🚧 Đang Phát Triển

- [ ] Real Google Places API calls
- [ ] Gemini Vision for image analysis
- [ ] Voice recognition integration
- [ ] User authentication
- [ ] Recipe saving & favorites
- [ ] Shopping list generation
- [ ] Nutritional analysis

### 🔮 Tương Lai

- [ ] Machine learning recipe recommendations
- [ ] Smart shopping list optimization
- [ ] Social cooking features
- [ ] Multi-language support expansion
- [ ] Advanced dietary restriction handling

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**

   ```bash
   # Check port usage
   netstat -ano | findstr :8002

   # Change port in app_enhanced.py
   port = int(os.environ.get("PORT", 8003))
   ```

2. **Missing Dependencies**

   ```bash
   # Install missing packages
   py -m pip install fastapi uvicorn python-dotenv httpx pydantic google-generativeai openai
   ```

3. **API Key Issues**

   ```bash
   # Check .env file exists and has correct keys
   # Verify API keys are valid
   # Check CORS origins include your frontend URL
   ```

4. **Flutter HTTP Errors**
   ```dart
   // Add http package to pubspec.yaml
   dependencies:
     http: ^1.1.0
   ```

## 📚 Documentation Links

- [Google Generative AI](https://ai.google.dev/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Flutter HTTP](https://pub.dev/packages/http)

## 🎉 Success Metrics

### Performance Targets

- API response time: < 2 seconds
- Service uptime: > 99%
- Error rate: < 1%
- User satisfaction: > 95%

### Feature Adoption

- AI recipe generation usage: Track daily requests
- Regional suggestions: Monitor location-based queries
- Store finder: Measure search success rate
- Chat assistant: Analyze conversation quality
 
---

**🚀 Smart Cooking AI Service v2.0** - Powered by Google AI & Modern Architecture
