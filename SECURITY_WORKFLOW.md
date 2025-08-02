# 🔒 Smart Cooking AI - Security Workflow

## 📋 Quy trình làm việc với API Keys

### ✅ **ĐÚNG - Làm như thế này:**

1. **Lưu API keys trong `.env.local`:**
   ```bash
   # frontend-clean/.env.local
   GOOGLE_CLIENT_ID=your_real_client_id
   GOOGLE_CLIENT_SECRET=your_real_client_secret
   ```

2. **File `.env.local` đã được gitignore - an toàn 100%**

3. **Khi push code:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin branch-name
   ```

### ❌ **SAI - Không bao giờ làm:**

- ❌ Đặt API keys trong documentation files
- ❌ Commit file `.env` có chứa real secrets
- ❌ Hard-code API keys trong source code
- ❌ Share API keys qua chat/email

## 🛡️ **Tại sao an toàn:**

1. **`.env.local` được gitignore:** File này KHÔNG BAO GIỜ được commit
2. **Local only:** Chỉ tồn tại trên máy tính của bạn
3. **Automatic detection:** GitHub sẽ reject nếu có secrets leak
4. **Environment separation:** Dev/staging/prod có keys riêng

## 🚀 **Setup một lần duy nhất:**

1. Copy `.env.local.example` thành `.env.local`
2. Điền real API keys vào `.env.local`
3. Commit/push bình thường - keys sẽ KHÔNG được push

## 🔄 **Khi làm việc nhóm:**

- Share file `.env.local.example` (có placeholder values)
- Mỗi người tự tạo `.env.local` riêng với keys của họ
- KHÔNG BAO GIỜ share real API keys qua Git

## 🆘 **Nếu vô tình leak secrets:**

1. Đổi API keys ngay lập tức trên Google Console
2. Xóa khỏi Git history: `git filter-branch`
3. Force push: `git push --force-with-lease`
4. Thông báo team update keys mới
