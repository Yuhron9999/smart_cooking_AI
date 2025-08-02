# 🔐 Google OAuth2 Setup hoàn chỉnh cho Smart Cooking AI

## 📋 Bước 1: Tạo Google Cloud Project

1. **Truy cập Google Cloud Console**: https://console.cloud.google.com/
2. **Tạo project mới**:
   - Tên project: `smart-cooking-ai`
   - Project ID: `smart-cooking-ai-[random-id]`
3. **Chọn project vừa tạo**

## 📋 Bước 2: Bật Google+ API và OAuth2

1. **Đi tới APIs & Services** → **Library**
2. **Tìm và bật các API**:
   - `Google+ API` (deprecated nhưng cần cho NextAuth)
   - `Google Identity`
   - `People API`
3. **Đi tới** **APIs & Services** → **Credentials**

## 📋 Bước 3: Tạo OAuth 2.0 Client ID

1. **Click "CREATE CREDENTIALS"** → **OAuth client ID**
2. **Chọn Application type**: **Web application**
3. **Cấu hình OAuth client**:

   ```
   Name: Smart Cooking AI - Web Client

   Authorized JavaScript origins:
   - http://localhost:3000
   - http://localhost:3001
   - https://your-domain.com (production)

   Authorized redirect URIs:
   - http://localhost:3000/api/auth/callback/google
   - http://localhost:3001/api/auth/callback/google
   - https://your-domain.com/api/auth/callback/google (production)
   ```

4. **Lấy credentials**:
   - `Client ID`: sao chép giá trị này
   - `Client Secret`: sao chép giá trị này

## 📋 Bước 4: Cấu hình OAuth Consent Screen

1. **Đi tới** **APIs & Services** → **OAuth consent screen**
2. **Chọn User Type**: **External** (cho development)
3. **Điền thông tin**:

   ```
   App name: Smart Cooking AI
   User support email: your-email@gmail.com
   Developer contact information: your-email@gmail.com

   App domain (optional):
   - Application home page: http://localhost:3000
   - Application privacy policy: http://localhost:3000/privacy
   - Application terms of service: http://localhost:3000/terms
   ```

4. **Scopes**: Thêm các scope cần thiết

   ```
   ../auth/userinfo.email
   ../auth/userinfo.profile
   openid
   ```

5. **Test users**: Thêm email addresses được phép test OAuth

## 📋 Bước 5: Cập nhật Environment Variables

Tạo file `.env.local` với credentials vừa lấy:

```bash
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super-secret-key-minimum-32-characters-long-random-string

# Google OAuth2 Credentials (THAY ĐỔI GIÁ TRỊ NÀY)
GOOGLE_CLIENT_ID=1234567890-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8001

# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/smart_cooking1

NODE_ENV=development
```

## 📋 Bước 6: Kiểm tra cấu hình NextAuth

Đảm bảo file `[...nextauth].ts` đã cấu hình đúng:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.role = "USER";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

## 🚨 Lưu ý quan trọng

1. **KHÔNG commit** `.env.local` lên Git
2. **Thay đổi** `NEXTAUTH_SECRET` thành chuỗi random 32+ ký tự
3. **Thay thế** `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` bằng giá trị thực từ Google Cloud Console
4. **Đảm bảo** redirect URIs trong Google Console khớp với domain đang sử dụng

## 🔍 Troubleshooting

### Error: "The OAuth client was not found"

- Kiểm tra `GOOGLE_CLIENT_ID` đã đúng chưa
- Đảm bảo client ID có đuôi `.apps.googleusercontent.com`

### Error: "redirect_uri_mismatch"

- Kiểm tra redirect URIs trong Google Console
- Đảm bảo có `http://localhost:3000/api/auth/callback/google`

### Error: "invalid_client"

- Kiểm tra `GOOGLE_CLIENT_SECRET` đã đúng chưa
- Đảm bảo không có ký tự thừa hoặc thiếu

## ✅ Test OAuth Flow

1. Khởi động ứng dụng: `npm run dev`
2. Truy cập: http://localhost:3000
3. Click "Login"
4. Chọn Google sign-in
5. Kiểm tra được redirect về trang chủ với user info
