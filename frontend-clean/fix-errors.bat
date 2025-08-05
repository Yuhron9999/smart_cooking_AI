@echo off
echo 🔧 Smart Cooking AI - Emergency Fix Script

echo 📝 Checking for common errors...

echo ✅ Syntax Errors:
findstr /n "export default" pages\*.tsx
echo.

echo ✅ Hydration Issues:
findstr /n "toLocaleString" pages\*.tsx
echo.

echo 🧹 Cleaning cache...
if exist .next (
    echo Removing .next...
    rmdir /s /q .next
)

if exist out (
    echo Removing out...
    rmdir /s /q out
)

echo 🔄 Restarting with clean cache...
start "Next.js Dev" cmd /k "npm run dev"

echo ✅ Done! Check console for any remaining errors.
pause
