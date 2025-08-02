# 🚨 KHẨN CẤP: Hướng dẫn lấy Google OAuth2 Credentials THỰC

## 📋 Bước 1: Truy cập Google Cloud Console

1. Mở trình duyệt và đi tới: https://console.cloud.google.com/
2. Đăng nhập bằng tài khoản Google của bạn
3. Tạo project mới hoặc chọn project có sẵn

## 📋 Bước 2: Bật APIs cần thiết

1. Đi tới **APIs & Services** → **Library**
2. Tìm và BẬT các API sau:
   - **Google+ API** (Deprecated nhưng NextAuth vẫn cần)
   - **People API**
   - **Google Identity**

## 📋 Bước 3: Tạo OAuth 2.0 Client ID

1. Đi tới **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Nếu chưa có OAuth consent screen, tạo trước:
   - User Type: **External**
   - App name: **Smart Cooking AI**
   - User support email: **your-email@gmail.com**
   - Developer contact: **your-email@gmail.com**

4. Sau khi có consent screen, tạo OAuth client ID:
   - Application type: **Web application**
   - Name: **Smart Cooking AI Web Client**

   **Authorized JavaScript origins:**

   ```
   http://localhost:3000
   http://localhost:3001
   ```

   **Authorized redirect URIs:**

   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```

5. **QUAN TRỌNG**: Sau khi tạo, sao chép:
   - **Client ID**: Có dạng `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **Client secret**: Có dạng `GOCSPX-abcdefghijklmnopqrstuvwxyz`

## 📋 Bước 4: Thêm Test Users (cho development)

1. Đi tới **OAuth consent screen** → **Test users**
2. Click **+ ADD USERS**
3. Thêm email của bạn để test OAuth

## ⚠️ CRITICAL: Thay thế credentials trong .env.local

Không sử dụng giá trị placeholder nữa!

```bash
# THAY ĐỔI NGAY - Giá trị THỰC từ Google Cloud Console
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz123456

# Các giá trị khác giữ nguyên
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=smart-cooking-ai-secret-key-2024-super-secure-random-string-minimum-32-chars
DATABASE_URL=mysql://root:password@localhost:3306/smart_cooking1
AI_SERVICE_URL=http://localhost:8001
NODE_ENV=development
```

## 📋 Test Steps:

1. Restart Next.js server sau khi cập nhật .env.local
2. Đi tới http://localhost:3000/auth/login
3. Click "Continue with Google"
4. Chọn tài khoản Google đã thêm vào test users
5. Cho phép các permissions
6. Kiểm tra có redirect về trang chủ thành công không

## 🚨 Troubleshooting:

- **Error 401: invalid_client** = Client ID hoặc Secret sai
- **Error 400: redirect_uri_mismatch** = Redirect URI không khớp
- **Error 403: access_denied** = Chưa add test user hoặc app chưa được approve
