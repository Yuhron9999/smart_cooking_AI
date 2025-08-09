# 🔐 Smart Cooking AI - OAuth2 Setup Guide

## Hướng dẫn Cấu hình Google OAuth2 Chi tiết

### 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Đăng nhập với Google account
3. Nhấp **"New Project"** hoặc chọn project có sẵn
4. Nhập tên project: `Smart Cooking AI OAuth`
5. Nhấp **"Create"**

### 2. Kích hoạt Google+ API & OAuth2

1. Trong Google Cloud Console, vào **"APIs & Services" > "Library"**
2. Tìm và kích hoạt các API sau:
   - **Google+ API** (để lấy thông tin profile)
   - **People API** (lấy thông tin người dùng chi tiết)
   - **Gmail API** (nếu cần email verification)

### 3. Tạo OAuth2 Credentials

#### Bước 3.1: OAuth Consent Screen
1. Vào **"APIs & Services" > "OAuth consent screen"**
2. Chọn **"External"** (cho testing) hoặc **"Internal"** (nếu G Suite)
3. Điền thông tin:
   ```
   App name: Smart Cooking AI
   User support email: your-email@gmail.com
   Developer contact: your-email@gmail.com
   ```
4. **Authorized domains**: `localhost` (cho development)
5. **Scopes**: Thêm các scope cần thiết:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`

#### Bước 3.2: Tạo OAuth2 Client ID
1. Vào **"APIs & Services" > "Credentials"**
2. Nhấp **"+ CREATE CREDENTIALS" > "OAuth client ID"**
3. Chọn Application type: **"Web application"**
4. Nhập thông tin:
   ```
   Name: Smart Cooking AI Web Client
   Authorized JavaScript origins: 
     - http://localhost:3005
     - http://127.0.0.1:3005
   
   Authorized redirect URIs:
     - http://localhost:3005/api/auth/callback/google
     - http://127.0.0.1:3005/api/auth/callback/google
   ```
5. Nhấp **"Create"**
6. **LƯU LẠI** Client ID và Client Secret

### 4. Cập nhật Environment Variables

Mở file `.env.local` và thay thế:

```bash
# Google OAuth2 Configuration - THAY ĐỔI GIÁ TRỊ THẬT
GOOGLE_CLIENT_ID=your_actual_google_client_id_from_step_3
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_from_step_3
```

**Ví dụ thực tế:**
```bash
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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3456
```

### 5. Restart Next.js Server

Sau khi cập nhật `.env.local`:

```powershell
# Dừng server hiện tại (Ctrl+C)
# Khởi động lại
npm run dev
```

### 6. Test OAuth2 Flow

1. Mở trình duyệt: `http://localhost:3005`
2. Nhấp nút **"Đăng nhập"**
3. Chọn Google account
4. Cho phép quyền truy cập
5. Kiểm tra được redirect về homepage với trạng thái đăng nhập

### 7. Production Setup (Tùy chọn)

Khi deploy production, cập nhật:

#### Google Cloud Console:
```
Authorized JavaScript origins:
- https://your-domain.com

Authorized redirect URIs:
- https://your-domain.com/api/auth/callback/google
```

#### Environment Variables:
```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secure-production-secret-min-32-chars
```

### 8. Troubleshooting

#### Lỗi thường gặp:

**🚫 "redirect_uri_mismatch"**
- Kiểm tra URL redirect trong Google Console khớp với `NEXTAUTH_URL`
- Đảm bảo có `/api/auth/callback/google` trong redirect URIs

**🚫 "Client ID not found"**
- Double-check Client ID trong `.env.local`
- Restart Next.js server sau khi thay đổi env

**🚫 "Scope not authorized"**
- Thêm đầy đủ scopes trong OAuth consent screen
- Refresh browser và thử lại

**🚫 NextAuth session undefined**
- Kiểm tra SessionProvider wrapping trong `_app.tsx`
- Verify NEXTAUTH_SECRET được set

### 9. Advanced Configuration

#### Customize JWT & Session:
```typescript
// pages/api/auth/[...nextauth].ts
callbacks: {
  async jwt({ token, account, user }) {
    // Lưu thêm thông tin vào token
    if (account) {
      token.accessToken = account.access_token;
      token.role = user.role || 'USER';
    }
    return token;
  },
  async session({ session, token }) {
    // Truyền thông tin từ token sang session
    session.accessToken = token.accessToken;
    session.user.role = token.role;
    return session;
  }
}
```

### 10. Security Best Practices

1. **Environment Variables**: 
   - Không commit `.env.local` vào Git
   - Sử dụng secrets khác nhau cho dev/prod

2. **CSRF Protection**: 
   - NextAuth.js tự động bảo vệ CSRF
   - Luôn verify session server-side

3. **Token Management**:
   - JWT expires sau 30 ngày (mặc định)
   - Implement refresh token nếu cần

4. **HTTPS in Production**:
   - Luôn dùng HTTPS cho production
   - Set secure cookies

---

## 🎉 Kết quả Mong đợi

Sau khi hoàn thành, bạn sẽ có:

✅ **Professional OAuth2 Button** với states đầy đủ
✅ **Google Authentication Flow** hoàn chỉnh  
✅ **Beautiful UI/UX** tích hợp seamlessly
✅ **Business Logic** với session management
✅ **User Profile** hiển thị sau khi đăng nhập
✅ **Secure Authentication** tuân thủ best practices

**Giao diện sẽ thay đổi từ:**
```
[Đăng nhập] [Bắt đầu]
```

**Thành:**
```
[🔄 Đang đăng nhập...] hoặc [👤 John Doe ▼]
```

---

**📞 Cần hỗ trợ?** Liên hệ team development nếu gặp vấn đề!
