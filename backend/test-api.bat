@echo off
echo ========================================
echo   Smart Cooking AI - API Test Script
echo ========================================
echo.

echo Testing API endpoints...
echo.

echo 1. Testing Ping endpoint...
curl -s http://localhost:8080/api/test/ping
echo.
echo.

echo 2. Testing Health Check...
curl -s http://localhost:8080/api/test/health
echo.
echo.

echo 3. Testing Database Connection...
curl -s http://localhost:8080/api/test/database
echo.
echo.

echo 4. Testing Public Endpoint...
curl -s http://localhost:8080/api/test/public
echo.
echo.

echo 5. Testing Database Stats...
curl -s http://localhost:8080/api/test/stats
echo.
echo.

echo ========================================
echo   Open these URLs in your browser:
echo ========================================
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo - API Docs: http://localhost:8080/api/v3/api-docs
echo - Test Health: http://localhost:8080/api/test/health
echo ========================================
echo.

pause
