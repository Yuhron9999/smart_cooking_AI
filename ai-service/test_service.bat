@echo off
echo 🧪 Smart Cooking AI Service - Test Script  
echo =============================================

echo 📁 Changing to AI service directory...
cd /d "c:\SmartCookingAI_2\ai-service"

echo 🔍 Checking if service is running...
python -c "import requests; r = requests.get('http://localhost:8001/health', timeout=5); print('✅ Service is running') if r.status_code == 200 else print('❌ Service not running')" 2>nul
if errorlevel 1 (
    echo ❌ Service is not running. Please start it first with:
    echo    start_service.bat
    echo.
    pause
    exit /b 1
)

echo 🧪 Running comprehensive tests...
echo.
python test_clean.py

echo.
echo 🏁 Test completed!
pause
