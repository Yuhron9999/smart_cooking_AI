@echo off
echo ========================================
echo   SMART COOKING AI - REPOSITORY FIX #3
echo   CategoryRepository Field Validation
echo ========================================
echo.

echo [1/4] Checking current directory...
cd /d "C:\SmartCookingAI_2\backend"
echo Current directory: %CD%
echo.

echo [2/4] Compiling backend...
echo Running: mvnw clean compile
call .\mvnw clean compile
if %errorlevel% neq 0 (
    echo ❌ COMPILATION FAILED!
    echo Check REPOSITORY_FIX_3.md for troubleshooting
    pause
    exit /b 1
)
echo ✅ Compilation successful!
echo.

echo [3/4] Repository fixes applied:
echo   ✅ Removed findByParentCategory method
echo   ✅ Removed findByParentCategoryIsNullAndIsActiveTrue method  
echo   ✅ Fixed method naming to match entity fields
echo   ✅ Added proper ordering methods
echo.

echo [4/4] Testing Spring Boot startup...
echo Running: mvnw spring-boot:run
echo Press Ctrl+C to stop when startup is successful
echo.
call .\mvnw spring-boot:run

echo.
echo ========================================
echo Repository Fix #3 Testing Complete!
echo Check logs above for any remaining errors
echo ========================================
pause
