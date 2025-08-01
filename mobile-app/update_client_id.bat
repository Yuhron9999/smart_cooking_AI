@echo off
echo ============================================
echo    🔑 Google OAuth Client ID Setup
echo ============================================
echo.

echo 📋 After creating OAuth 2.0 Client ID in Google Cloud Console:
echo.

set /p CLIENT_ID="Enter your Google Client ID: "

if "%CLIENT_ID%"=="" (
    echo ❌ No Client ID provided. Exiting...
    pause
    exit /b 1
)

echo.
echo 🔧 Updating web/index.html with your Client ID...

powershell -Command "(Get-Content web/index.html) -replace '1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com', '%CLIENT_ID%' | Set-Content web/index.html"

echo ✅ Successfully updated!
echo.
echo 🚀 Now restart your Flutter app:
echo    flutter run -d chrome
echo.
echo ✅ Google Sign-In should now work perfectly!
echo.
pause
