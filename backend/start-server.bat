@echo off
echo ========================================
echo   Smart Cooking AI Backend Server
echo ========================================
echo.
echo Checking if server is already running...
netstat -ano | findstr :8080
if %ERRORLEVEL% == 0 (
    echo Server already running on port 8080
    echo Killing existing processes...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1
    echo Waiting 3 seconds...
    timeout /t 3 /nobreak >nul
)

echo.
echo Starting Spring Boot server...
echo Please wait while server initializes...
echo.
echo Server will be available at:
echo - Main API: http://localhost:8080/api
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo - Test API: http://localhost:8080/api/test/ping
echo.

cd /d C:\SmartCookingAI_2\backend
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xms512m -Xmx1024m"

echo.
echo Server stopped. Press any key to exit...
pause >nul
