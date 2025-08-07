# Hướng Dẫn Tích Hợp Frontend, MySQL, SpringBoot và Flutter

Tài liệu này mô tả cách thiết lập và tích hợp giữa các thành phần khác nhau của hệ thống SmartCookingAI.

## Cấu Trúc Hệ Thống

Hệ thống bao gồm các thành phần chính sau:

1. **Frontend Next.js**: UI và trải nghiệm người dùng web
2. **SpringBoot Backend**: API và business logic
3. **MySQL Database**: Lưu trữ dữ liệu
4. **Flutter Mobile App**: Ứng dụng di động

## Cài Đặt Môi Trường

### 1. Cài đặt Frontend (Next.js)

```bash
cd frontend-clean
npm install
npm run dev
```

Frontend sẽ chạy trên cổng 3000: http://localhost:3000

### 2. Cài đặt Backend (SpringBoot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy trên cổng 8080: http://localhost:8080

### 3. Cài đặt MySQL

- Cài đặt MySQL từ trang chủ: https://dev.mysql.com/downloads/mysql/
- Tạo database mới: `smartcooking`
- Sử dụng script để khởi tạo schema:

```bash
cd backend/scripts
mysql -u root -p smartcooking < init_schema.sql
```

### 4. Cài đặt Flutter Mobile

```bash
cd mobile-app
flutter pub get
flutter run
```

## Cấu Hình Tích Hợp

### 1. Cấu hình API Endpoints

File `frontend-clean/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
SPRING_BOOT_URL=http://localhost:8080
FLUTTER_API_URL=http://localhost:8082
```

### 2. Cấu hình Spring Boot

File `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/smartcooking?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# CORS Configuration
spring.webmvc.cors.allowed-origins=http://localhost:3000
spring.webmvc.cors.allowed-methods=GET,POST,PUT,DELETE
spring.webmvc.cors.allowed-headers=*

# JWT Config
jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

### 3. Cấu hình Flutter

File `mobile-app/lib/config/api_config.dart`:

```dart
class ApiConfig {
  static const String baseUrl = "http://localhost:8080/api";
  static const int timeout = 30000;
  static const String apiKey = "your_api_key";
}
```

### 4. Cấu hình OAuth2 cho Mobile

Để cấu hình OAuth2 cho ứng dụng mobile, bạn cần thực hiện các bước sau:

#### 4.1. Cấu hình Google OAuth2

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn hoặc tạo project
3. Vào **APIs & Services > Credentials**
4. Nhấp vào **Create Credentials > OAuth client ID**
5. Chọn **Android** cho ứng dụng Android hoặc **iOS** cho ứng dụng iOS
6. Đối với Android:
   - Nhập tên gói của ứng dụng (ví dụ: `com.smartcooking.app`)
   - Tạo và nhập SHA-1 certificate fingerprint
   - Nhấp vào **Create**
7. Đối với iOS:
   - Nhập Bundle ID của ứng dụng (ví dụ: `com.smartcooking.app`)
   - Nhấp vào **Create**

8. **QUAN TRỌNG**: Thêm URI redirect đúng định dạng:
   - Đối với Android: `com.smartcooking.app:/oauth2redirect`
   - Đối với iOS: `com.smartcooking.app://oauth2redirect`

#### 4.2. Cập nhật tệp cấu hình trong Flutter

File `mobile-app/lib/config/oauth_config.dart`:

```dart
class OAuthConfig {
  // Google OAuth
  static const String googleClientId = "YOUR_GOOGLE_CLIENT_ID";
  static const String googleClientSecret = "YOUR_GOOGLE_CLIENT_SECRET";
  static const String googleRedirectUri = "com.smartcooking.app:/oauth2redirect";
  
  // Danh sách scopes OAuth
  static const List<String> googleScopes = [
    'email',
    'profile',
    'openid'
  ];
}
```

## API Integration

### 1. Frontend đến SpringBoot

Tất cả API calls từ frontend đến SpringBoot được xử lý thông qua `apiService.ts`. Service này tự động xử lý:

- Authentication token
- Refresh token
- Error handling
- API response format

Ví dụ:

```typescript
import { recipeService } from '@/services';

// Lấy danh sách công thức nấu ăn
const fetchRecipes = async () => {
  try {
    const result = await recipeService.getRecipes();
    if (result.success) {
      setRecipes(result.data);
    } else {
      console.error(result.message);
    }
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
  }
};
```

### 2. SpringBoot đến MySQL

SpringBoot sử dụng Spring Data JPA để kết nối với MySQL. Các entity và repository được định nghĩa trong:

- `backend/src/main/java/com/smartcooking/model` (entities)
- `backend/src/main/java/com/smartcooking/repository` (repositories)

### 3. Flutter đến SpringBoot

Flutter app kết nối đến cùng backend SpringBoot thông qua RESTful API:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:smartcooking/config/api_config.dart';

Future<List<Recipe>> fetchRecipes() async {
  final response = await http.get(
    Uri.parse('${ApiConfig.baseUrl}/recipes'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
  );

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    return (data['data'] as List)
        .map((json) => Recipe.fromJson(json))
        .toList();
  } else {
    throw Exception('Failed to load recipes');
  }
}
```

## Authentication Flow

1. **Đăng nhập thông thường**:
   - Frontend/Mobile gọi API `/auth/login` với credentials
   - SpringBoot xác thực và trả về JWT token
   - Frontend/Mobile lưu token vào localStorage/SharedPreferences

2. **Đăng nhập OAuth2 (Web)**:
   - Frontend chuyển hướng người dùng đến URL ủy quyền của nhà cung cấp (Google, Facebook)
   - Sau khi xác thực, nhà cung cấp chuyển hướng người dùng về URL callback đã đăng ký
   - Frontend gửi code nhận được đến Backend để đổi lấy token thông qua `/auth/oauth2/callback`
   - SpringBoot xác thực với nhà cung cấp và trả về JWT token

3. **Đăng nhập OAuth2 (Mobile)**:
   - Mobile sử dụng thư viện Flutter [flutter_appauth](https://pub.dev/packages/flutter_appauth)
   - Cài đặt thư viện: `flutter pub add flutter_appauth flutter_secure_storage`
   - Cấu hình redirect URI trong `AndroidManifest.xml` và `Info.plist`
   - Sử dụng code sau để đăng nhập:

```dart
Future<void> signInWithGoogle() async {
  final appAuth = FlutterAppAuth();
  
  try {
    final result = await appAuth.authorize(
      AuthorizationRequest(
        OAuthConfig.googleClientId,
        OAuthConfig.googleRedirectUri,
        discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
        scopes: OAuthConfig.googleScopes,
      ),
    );
    
    if (result != null) {
      final tokenResult = await appAuth.token(
        TokenRequest(
          OAuthConfig.googleClientId,
          OAuthConfig.googleRedirectUri,
          authorizationCode: result.authorizationCode,
          discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
          scopes: OAuthConfig.googleScopes,
        ),
      );
      
      // Gửi token ID đến backend để xác thực và lấy JWT token
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/auth/google'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'token': tokenResult?.idToken}),
      );
      
      if (response.statusCode == 200) {
        final authResult = jsonDecode(response.body);
        // Lưu JWT token nhận được từ server
        await secureStorage.write(key: 'access_token', value: authResult['accessToken']);
        await secureStorage.write(key: 'refresh_token', value: authResult['refreshToken']);
      }
    }
  } catch (e) {
    print('OAuth Error: $e');
    // Xử lý lỗi
  }
}
```

4. **Xác thực Request**:
   - Frontend/Mobile gửi token trong header `Authorization: Bearer {token}`
   - SpringBoot xác thực token và xử lý request

5. **Refresh Token**:
   - Khi token hết hạn, Frontend/Mobile gửi refresh token đến `/auth/refresh`
   - SpringBoot trả về token mới
   - Frontend/Mobile cập nhật token mới

## Đồng Bộ Dữ Liệu

### 1. Frontend và SpringBoot

Sử dụng polling hoặc WebSocket để đồng bộ dữ liệu theo thời gian thực:

```typescript
// Kết nối WebSocket
const connectWebSocket = () => {
  const socket = new WebSocket('ws://localhost:8080/ws');
  
  socket.onopen = () => {
    console.log('WebSocket Connected');
    socket.send(JSON.stringify({ type: 'AUTH', token: localStorage.getItem('auth_token') }));
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Xử lý dữ liệu theo thời gian thực
  };
};
```

### 2. Mobile và SpringBoot

Sử dụng API đồng bộ để cập nhật dữ liệu từ mobile lên server:

```dart
Future<void> syncData() async {
  final localData = await LocalDatabase.getUnsyncedData();
  
  final response = await http.post(
    Uri.parse('${ApiConfig.baseUrl}/mobile/sync'),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    },
    body: jsonEncode({
      'deviceId': deviceId,
      'lastSyncTimestamp': lastSync,
      'data': localData,
    }),
  );
  
  if (response.statusCode == 200) {
    final serverData = jsonDecode(response.body)['data'];
    await LocalDatabase.mergeServerData(serverData);
    await LocalDatabase.updateSyncTimestamp();
  }
}
```

## Troubleshooting

### Lỗi Kết Nối MySQL

Kiểm tra:
- MySQL server đã chạy chưa
- Thông tin kết nối (username, password, database name) đã đúng chưa
- Port 3306 đã được mở chưa

### Lỗi API SpringBoot

Kiểm tra:
- SpringBoot server đã chạy chưa
- API endpoint có đúng không
- JWT token có hợp lệ không
- CORS đã được cấu hình đúng chưa

### Lỗi Frontend

Kiểm tra:
- API URL đã đúng chưa
- Network request trong Developer Console
- Token Authentication đã đúng chưa

### Lỗi Flutter Mobile

Kiểm tra:
- API URL có thể truy cập từ thiết bị/emulator không
- Network permissions đã được cấu hình trong AndroidManifest.xml/Info.plist
- HTTP có được kích hoạt không (Flutter mặc định chỉ cho phép HTTPS)
