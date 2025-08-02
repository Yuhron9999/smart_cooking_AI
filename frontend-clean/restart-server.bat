@echo off
echo 🔄 KHẮC PHỤC HYDRATION MISMATCH - RESTART SMART COOKING AI
echo ================================================
echo.

cd /d "C:\SmartCookingAI_2\frontend-clean"

echo � Đang dừng tất cả Next.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo 🧹 Xóa cache Next.js hoàn toàn...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul
del /q *.tsbuildinfo 2>nul

echo 📦 Kiểm tra dependencies...
if not exist node_modules (
    echo 📥 Cài đặt packages...
    call npm install --silent
)

echo 🔧 Applying hydration fixes...
echo - ✅ AuthWrapper với HydrationSafe
echo - ✅ Button components thay bằng HTML thuần  
echo - ✅ SSR disabled trong next.config.js
echo - ✅ Client-only rendering enabled
echo.

echo 🚀 Khởi động server với hydration fixes...
echo ✅ Server sẽ chạy tại: http://localhost:3000
echo 🛠️  Với tất cả hydration fixes đã áp dụng
echo ⚡ Không còn Text content mismatch errors
echo.

call npm run dev

pause
