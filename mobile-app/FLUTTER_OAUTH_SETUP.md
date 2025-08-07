# Hướng dẫn cấu hình OAuth2 cho ứng dụng Flutter

## Các bước đã thực hiện

1. **Đã tạo file `.env-local`** trong thư mục `mobile-app` để lưu thông tin OAuth2 cho Android.
   - File này chứa các thông tin nhạy cảm như Client ID và không được commit lên GitHub.
   - Đã thêm `.env-local` vào file `.gitignore` để đảm bảo không bị push lên GitHub.

2. **Đã thêm package `flutter_dotenv`** để đọc các biến môi trường từ file `.env-local`.
   - Đã thêm file `.env-local` vào mục `assets` trong `pubspec.yaml`.

3. **Đã cập nhật file `oauth_config.dart`** để đọc các giá trị từ file `.env-local`.

## Các bước tiếp theo cần thực hiện

1. **Khởi tạo dotenv trong app**:
   - Mở file `main.dart` và thêm đoạn code sau vào đầu hàm `main()`:
   
   ```dart
   Future<void> main() async {
     // Đảm bảo Flutter được khởi tạo
     WidgetsFlutterBinding.ensureInitialized();
     
     // Tải biến môi trường từ file .env-local
     await dotenv.load(fileName: '.env-local');
     
     // Các đoạn code khác...
     
     runApp(MyApp());
   }
   ```

2. **Sử dụng AuthService để đăng nhập**:
   - Import service:
   ```dart
   import 'package:smart_cooking_ai/services/auth_service.dart';
   ```
   
   - Khởi tạo service:
   ```dart
   final authService = AuthService();
   ```
   
   - Gọi phương thức đăng nhập:
   ```dart
   // Khi người dùng nhấn nút đăng nhập Google
   ElevatedButton(
     onPressed: () async {
       final success = await authService.signInWithGoogle();
       if (success) {
         // Chuyển hướng đến màn hình chính
         Navigator.of(context).pushReplacementNamed('/home');
       } else {
         // Hiển thị thông báo lỗi
         ScaffoldMessenger.of(context).showSnackBar(
           SnackBar(content: Text('Đăng nhập thất bại. Vui lòng thử lại.')),
         );
       }
     },
     child: Text('Đăng nhập với Google'),
   )
   ```

3. **Đảm bảo đã cập nhật SHA-1 fingerprint** trong Google Cloud Console.
   - SHA-1 fingerprint của keystore debug là:
   ```
   0C:9E:D4:F9:E8:73:7D:BA:37:3D:90:6D:24:BB:22:EF:D9:95:7B:B0
   ```

4. **Đảm bảo URI trong AndroidManifest.xml** khớp với URI đã cấu hình trong Google Cloud Console.
   ```xml
   <data android:scheme="com.smartcooking.app" 
         android:host="oauth2redirect" />
   ```

5. **Kiểm tra khi triển khai production**:
   - Tạo thêm SHA-1 fingerprint cho keystore release
   - Thêm fingerprint này vào cấu hình trong Google Cloud Console

## Xử lý lỗi phổ biến

- **Error 400: redirect_uri_mismatch**: 
  - Đảm bảo URI trong code và Google Cloud Console khớp nhau chính xác, bao gồm cả chữ hoa/thường và dấu `/`.
  
- **Lỗi không tìm thấy file .env-local**: 
  - Đảm bảo file này được thêm vào assets trong pubspec.yaml
  - Kiểm tra đường dẫn đến file trong dotenv.load()
