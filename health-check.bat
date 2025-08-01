@echo off
echo.
echo =====================================================
echo       Smart Cooking AI - Service Health Check
echo =====================================================
echo.

echo [1/4] Checking MySQL Service...
echo.
mysql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL is installed
    mysql -u admin -ppassword123 -e "SELECT 1;" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MySQL connection successful
    ) else (
        echo ❌ MySQL connection failed - Check credentials
        echo   Fix: Update DB_USERNAME and DB_PASSWORD in application.properties
    )
) else (
    echo ❌ MySQL not found
    echo   Fix: Install MySQL or start MySQL Docker container
    echo   Command: docker-compose up -d mysql
)

echo.
echo [2/4] Checking Redis Service...
echo.
redis-cli ping >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis is running
) else (
    echo ❌ Redis not available
    echo   Fix: Start Redis or Redis Docker container
    echo   Command: docker-compose up -d redis
)

echo.
echo [3/4] Checking Spring Boot Backend...
echo.
curl -s http://localhost:8080/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on port 8080
) else (
    echo ⏳ Backend not running - Starting now...
    echo   📋 Recent fixes applied:
    echo     - Fixed 'u.recipes' → 'u.createdRecipes' 
    echo     - Fixed 'u.region' → 'u.regionPreference'
    echo     - Updated MySQL dialect
    echo     - Configured repository scanning
    echo.
    cd /d "c:\SmartCookingAI_2\backend"
    echo   🚀 Starting backend with fixes...
    start "Smart Cooking Backend" cmd /k ".\mvnw spring-boot:run"
    echo   ✅ Backend startup initiated
    echo   ⏱️  Wait 30-60 seconds for startup completion
    echo   🔗 Then check: http://localhost:8080/actuator/health
)

echo.
echo [4/4] Checking Frontend Next.js...
echo.
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on port 3000
) else (
    echo ⏳ Frontend not running
    echo   To start frontend manually:
    echo   cd c:\SmartCookingAI_2\frontend-nextjs
    echo   npm run dev
)

echo.
echo =====================================================
echo              Service Status Summary
echo =====================================================
echo.
echo 🌐 Frontend:  http://localhost:3000
echo 🔧 Backend:   http://localhost:8080
echo 📊 Database:  MySQL on localhost:3306
echo 🔴 Cache:     Redis on localhost:6379
echo.
echo =====================================================
echo            Quick Commands Reference
echo =====================================================
echo.
echo Start all services:
echo   docker-compose up -d mysql redis
echo   cd backend ^&^& .\mvnw spring-boot:run
echo   cd frontend-nextjs ^&^& npm run dev
echo.
echo Health checks:
echo   curl http://localhost:8080/actuator/health
echo   curl http://localhost:3000
echo.
echo Logs:
echo   Backend: Check terminal output
echo   Frontend: Check browser console (F12)
echo.
pause
