# Cấu hình Google Cloud Console - Khắc phục lỗi redirect_uri_mismatch

## 🚨 LỖI ĐANG GẶP PHẢI

```
Error 400: redirect_uri_mismatch
The redirect URI in the request, http://localhost:3000/api/auth/callback/google, does not match the ones authorized for the OAuth client.
```

## 🛠️ HƯỚNG DẪN KHẮC PHỤC

### Bước 1: Truy cập Google Cloud Console

1. Mở trình duyệt và truy cập: https://console.cloud.google.com/
2. Đăng nhập bằng tài khoản Google của bạn
3. Chọn project **tactical-orbit-431412-v1** (hoặc project bạn đã tạo)

### Bước 2: Truy cập APIs & Services

1. Trong menu bên trái, click **APIs & Services**
2. Click **Credentials**
3. Tìm OAuth 2.0 Client ID có tên tương tự như "Web client 1" hoặc client bạn đã tạo

### Bước 3: Chỉnh sửa OAuth 2.0 Client

1. Click vào tên OAuth client để mở cấu hình
2. Cuộn xuống phần **Authorized redirect URIs**
3. Thêm các URI sau đây (nếu chưa có):

```
http://localhost:3000/api/auth/callback/google
https://localhost:3000/api/auth/callback/google
http://127.0.0.1:3000/api/auth/callback/google
https://127.0.0.1:3000/api/auth/callback/google
```

### Bước 4: Xác nhận và Lưu

1. Click **Save** ở cuối trang
2. Đợi vài phút để thay đổi có hiệu lực

## 📋 CHECKLIST XÁC NHẬN

- [ ] Project **tactical-orbit-431412-v1** đã được chọn
- [ ] OAuth 2.0 Client ID đã được tạo
- [ ] Redirect URIs đã được thêm chính xác
- [ ] Đã lưu thay đổi thành công

## 🔑 THÔNG TIN CLIENT 

```env
# Add these to your .env.local file (NOT in Git):
GOOGLE_CLIENT_ID=your_actual_google_client_id_from_console
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_from_console
```

> ⚠️ **BẢO MẬT QUAN TRỌNG:** 
> - KHÔNG BAO GIỜ commit API keys vào Git
> - Chỉ lưu trong `.env.local` (đã được gitignore)
> - Tạo các giá trị này từ Google Cloud Console
> - Mỗi môi trường (dev/prod) cần keys riêng biệt

## 🧪 KIỂM TRA HOẠT ĐỘNG

Sau khi cấu hình xong, thử nghiệm:

1. Khởi động ứng dụng:

```bash
cd frontend-clean
npm run dev
```

2. Mở trình duyệt: http://localhost:3000
3. Click nút "Login" hoặc "Register"
4. Sẽ chuyển hướng đến Google OAuth mà không báo lỗi redirect_uri_mismatch

## 🚨 NẾU VẪN LỖI

Nếu vẫn gặp lỗi, hãy kiểm tra:

1. **URL chính xác**: Đảm bảo redirect URI trong Google Console chính xác là:
   `http://localhost:3000/api/auth/callback/google`

2. **Port đúng**: Xác nhận ứng dụng Next.js chạy trên port 3000

3. **Cache trình duyệt**: Xóa cache và cookies của trình duyệt

4. **Đợi propagation**: Thay đổi Google OAuth có thể mất vài phút để có hiệu lực

## 💡 THÔNG TIN BỔ SUNG

- Google OAuth2 yêu cầu redirect URI phải khớp **chính xác**
- Không được có dấu `/` cuối URL
- HTTP và HTTPS là hai URI khác nhau
- localhost và 127.0.0.1 là hai domain khác nhau

---

**✅ Sau khi hoàn thành các bước trên, lỗi redirect_uri_mismatch sẽ được khắc phục hoàn toàn!**
