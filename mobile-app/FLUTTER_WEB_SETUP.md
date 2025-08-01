# 🔧 Flutter Web Configuration Guide

## 🔧 **Lỗi đã sửa trong phiên bản này:**

### ✅ **Asset Loading Fixed**

- **Vấn đề**: `assets/assets/icons/google_icon.png` 404 error (double assets path)
- **Giải pháp**:
  - Thay thế Image.asset bằng Icon widget
  - Sửa pubspec.yaml asset configuration
  - Tạo fallback icon với Container + Icon

### ✅ **CORS Preflight Error Fixed**

- **Vấn đề**: "Redirect is not allowed for a preflight request"
- **Giải pháp**:
  - Cập nhật WebConfig.java mapping từ `/api/**` thành `/**`
  - Thêm `exposedHeaders("*")`
  - Tạo TestController với @OptionsMapping

### ✅ **EasyLocalization Configuration Enhanced**

- **Vấn đề**: Translation keys không load được
- **Giải pháp**:
  - Thêm `startLocale`, `saveLocale`, `useFallbackTranslations`
  - Configuration tốt hơn cho debug mode
  - Proper fallback handling

### ✅ **Asset Path Duplication Fixed**

- **Vấn đề**: pubspec.yaml có duplicate asset paths
- **Giải pháp**: Clean up asset configuration

### 1. ✅ Google Sign-In Client ID

**Vấn đề**: `ClientID not set` error trong Google Sign-In
**Giải pháp**:

- Đã thêm meta tag trong `web/index.html`
- Cần thay thế `YOUR_GOOGLE_CLIENT_ID_HERE` bằng Client ID thực

### 2. ✅ Easy Localization Keys Missing

**Vấn đề**: Tất cả localization keys không tìm thấy
**Giải pháp**:

- Đã cập nhật `main.dart` với EasyLocalization wrapper
- Đã cấu hình supported locales và fallback locale
- Translation files đã tồn tại đầy đủ

### 3. ✅ CORS Policy Error

**Vấn đề**: Request bị block bởi CORS policy  
**Giải pháp**:

- Đã tạo `WebConfig.java` trong Spring Boot backend
- Cho phép Flutter Web port 54072 và các ports phổ biến
- Cấu hình allowCredentials và proper headers

### 4. ✅ Missing Assets

**Vấn đề**: Google icon 404 error
**Giải pháp**:

- Đã tạo thư mục `assets/icons/`
- Đã cập nhật `pubspec.yaml` để include assets
- Cần tải Google icon từ: https://developers.google.com/identity/images/g-logo.png

## 🚀 Cách chạy sau khi cấu hình:

### Bước 1: Lấy Google Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project existing
3. Enable Google Sign-In API
4. Tạo OAuth 2.0 credentials
5. Thêm authorized origins: `http://localhost:54072`
6. Copy Client ID

### Bước 2: Cập nhật cấu hình

```bash
# Trong web/index.html, thay thế:
<meta name="google-signin-client_id" content="YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com">

# Tạo file .env từ .env.example:
cp .env.example .env
# Và cập nhật với Client ID thực
```

### Bước 3: Tải Google Icon

```bash
# Tải icon từ Google và lưu vào:
mobile-app/assets/icons/google_icon.png
```

### Bước 4: Chạy services theo thứ tự:

#### Terminal 1 - Spring Boot Backend:

```bash
cd c:\SmartCookingAI_2\backend
./mvnw spring-boot:run
# Chạy trên http://localhost:8080
```

#### Terminal 2 - Python AI Service:

```bash
cd c:\SmartCookingAI_2\ai-service
python -m uvicorn app_perfect:app --host 0.0.0.0 --port 8001 --reload
# Chạy trên http://localhost:8001
```

#### Terminal 3 - Flutter Web:

```bash
cd c:\SmartCookingAI_2\mobile-app
flutter clean
flutter pub get
flutter run -d chrome --web-port 54072
# Chạy trên http://localhost:54072
```

## 🎯 Kết quả mong đợi:

- ✅ Google Sign-In hoạt động
- ✅ Localization hiển thị tiếng Việt
- ✅ API calls thành công (không bị CORS)
- ✅ UI hiển thị đầy đủ icons và assets

## 🐛 Debug tips:

- Mở Developer Tools để xem console errors
- Kiểm tra Network tab cho API requests
- Verify Google Client ID trong Sources tab
- Check localization files trong pubspec.yaml

## 📱 Next Steps:

1. Test authentication flow
2. Verify API integration với backend
3. Test voice features
4. Configure production deployment
