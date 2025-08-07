# Cấu hình OAuth2 cho Ứng dụng Di động

Tài liệu này hướng dẫn chi tiết việc cấu hình OAuth2 cho ứng dụng di động Flutter để đăng nhập với Google.

## Cấu hình Google Cloud Console

1. **Truy cập Google Cloud Console**:
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - Chọn dự án của bạn hoặc tạo dự án mới

2. **Cấu hình OAuth Consent Screen**:
   - Vào API & Services > OAuth consent screen
   - Điền các thông tin cần thiết (tên ứng dụng, email liên hệ, logo...)
   - Thêm các scopes cần thiết (openid, email, profile)
   - Lưu và tiếp tục

3. **Tạo OAuth Client ID cho Android**:
   - Vào API & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Chọn "Android"
   - Nhập package name của ứng dụng Android (ví dụ: `com.smartcooking.app`)
   - Tạo và lưu SHA-1 certificate fingerprint:
     ```
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
   - Điền SHA-1 fingerprint vào form
   - Click "Create"

4. **Tạo OAuth Client ID cho iOS**:
   - Click "Create Credentials" > "OAuth client ID"
   - Chọn "iOS"
   - Nhập Bundle ID của ứng dụng iOS (ví dụ: `com.smartcooking.app`)
   - Click "Create"

5. **Tạo OAuth Client ID cho Web (dùng cho Flutter)**:
   - Click "Create Credentials" > "OAuth client ID"
   - Chọn "Web application"
   - Đặt tên cho client
   - Thêm các Authorized redirect URIs:
     - Cho Android: `com.smartcooking.app:/oauth2redirect`
     - Cho iOS: `com.smartcooking.app:/oauth2redirect`
     - Cho localhost (testing): `http://localhost:8080`
   - Click "Create" và ghi lại Client ID và Client Secret

## Cấu hình Android

1. **Cập nhật AndroidManifest.xml**:
   ```xml
   <manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.smartcooking.app">
     <!-- Các permissions khác... -->
     
     <application android:label="Smart Cooking" android:icon="@mipmap/ic_launcher">
       <!-- Activity chính và các configuration khác... -->
       
       <activity android:name="com.smartcooking.app.MainActivity" 
                android:exported="true">
         <!-- Intent filter cho deep link -->
         <intent-filter>
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <!-- URI scheme cho OAuth2 redirect -->
           <data android:scheme="com.smartcooking.app" 
                 android:host="oauth2redirect" />
         </intent-filter>
       </activity>
     </application>
   </manifest>
   ```

## Cấu hình iOS

1. **Cập nhật Info.plist**:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
     <!-- Các cấu hình khác... -->
     <key>CFBundleURLTypes</key>
     <array>
       <dict>
         <key>CFBundleTypeRole</key>
         <string>Editor</string>
         <key>CFBundleURLSchemes</key>
         <array>
           <string>com.smartcooking.app</string>
         </array>
       </dict>
     </array>
     <!-- Các cấu hình khác... -->
   </dict>
   </plist>
   ```

## Tạo OAuth Config trong Flutter

Tạo file `lib/config/oauth_config.dart`:

```dart
class OAuthConfig {
  // Client ID từ Google Cloud Console
  static const String googleClientId = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
  
  // Redirect URI phải khớp chính xác với cấu hình trong Google Cloud Console
  static const String googleRedirectUri = 'com.smartcooking.app:/oauth2redirect';
  
  // Các scopes cần thiết
  static const List<String> googleScopes = [
    'openid',
    'email',
    'profile',
  ];
}
```

## Kiểm tra và xử lý lỗi phổ biến

1. **Lỗi "Error 400: redirect_uri_mismatch"**:
   - Đảm bảo redirect URI trong app (`googleRedirectUri`) khớp chính xác với URI đã đăng ký trong Google Cloud Console
   - Kiểm tra cả chữ hoa/thường và dấu `/` cuối cùng
   - URI nên có format: `com.yourapp.id:/oauth2redirect`

2. **Lỗi "Invalid package name"**:
   - Đảm bảo package name trong AndroidManifest.xml khớp với package name đã đăng ký trong Google Cloud Console

3. **Lỗi "App not verified"**:
   - Nếu đang trong giai đoạn phát triển, bạn có thể click vào "Advanced" và "Go to {App Name} (unsafe)" để tiếp tục
   - Để triển khai production, cần hoàn thành quá trình xác minh ứng dụng với Google

## Tham khảo
- [Flutter AppAuth Package](https://pub.dev/packages/flutter_appauth)
- [Google Identity Platform](https://developers.google.com/identity)
- [Flutter Secure Storage](https://pub.dev/packages/flutter_secure_storage)
