# 🔐 Google OAuth2 Setup Guide

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project existing
3. Tên project: `Smart Cooking AI`

## Bước 2: Enable Google APIs

1. Vào **APIs & Services** > **Library**
2. Enable các APIs sau:
   - **Google+ API** (deprecated, use People API)
   - **People API**
   - **Google Sign-In API**

## Bước 3: Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
3. Chọn **Application type**: **Web application**
4. **Name**: `Smart Cooking AI Web Client`

## Bước 4: Cấu hình Authorized Origins

**Authorized JavaScript origins:**

```
http://localhost:54072
http://localhost:62515
http://127.0.0.1:54072
http://127.0.0.1:62515
```

**Authorized redirect URIs:**

```
http://localhost:54072/auth/callback
http://localhost:62515/auth/callback
http://127.0.0.1:54072/auth/callback
http://127.0.0.1:62515/auth/callback
```

## Bước 5: Copy Client ID

1. Sau khi tạo, copy **Client ID** (dạng: `xxx.apps.googleusercontent.com`)
2. Thay thế trong `web/index.html`

## Bước 6: Test Credentials

Kiểm tra URL để verify:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&response_type=code&scope=email%20profile&redirect_uri=http://localhost:54072/auth/callback
```

## ⚠️ Security Notes

- **Không commit** real Client ID vào git
- Sử dụng **environment variables** cho production
- **Client Secret** không cần cho web applications
