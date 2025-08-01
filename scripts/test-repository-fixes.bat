@echo off
setlocal enabledelayedexpansion

echo.
echo 🧪 Smart Cooking AI - Repository Test Validation
echo ==================================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0
set TOTAL_TESTS=0

echo 🔍 Step 1: Validating Entity Field Names
echo ----------------------------------------

REM Test 1: Check User entity has regionPreference field
echo|set /p="User.regionPreference field exists ... "
findstr /c:"regionPreference" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\entity\User.java" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

REM Test 2: Check User entity has createdRecipes field
echo|set /p="User.createdRecipes field exists ... "
findstr /c:"createdRecipes" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\entity\User.java" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

REM Test 3: Check Recipe entity has author field
echo|set /p="Recipe.author field exists ... "
findstr /c:"private User author" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\entity\Recipe.java" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

echo.
echo 🔍 Step 2: Validating Repository Queries
echo ----------------------------------------

REM Test 4: Check findTopRecipeCreators uses correct field
echo|set /p="findTopRecipeCreators query fixed ... "
findstr /c:"u.createdRecipes" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\repository\UserRepository.java" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

REM Test 5: Check findActiveUsersByRegion uses correct field
echo|set /p="findActiveUsersByRegion query fixed ... "
findstr /c:"u.regionPreference" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\repository\UserRepository.java" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

REM Test 6: Check MySQL dialect updated
echo|set /p="MySQL dialect updated ... "
findstr /c:"MySQLDialect" "c:\SmartCookingAI_2\backend\src\main\resources\application.properties" >nul 2>&1
if %errorlevel% equ 0 (
    findstr /c:"MySQL8Dialect" "c:\SmartCookingAI_2\backend\src\main\resources\application.properties" >nul 2>&1
    if !errorlevel! neq 0 (
        echo ✅ PASS
        set /a TESTS_PASSED+=1
    ) else (
        echo ❌ FAIL - Still using deprecated dialect
        set /a TESTS_FAILED+=1
    )
) else (
    echo ❌ FAIL - No MySQLDialect found
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

REM Test 7: Check repository configuration exists
echo|set /p="Repository configuration created ... "
if exist "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\config\RepositoryConfiguration.java" (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

echo.
echo 🔍 Step 3: Checking for Common Issues
echo ------------------------------------

REM Test 8: No old field references
echo|set /p="No 'u.recipes' references ... "
findstr /r "u\.recipes" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\repository\UserRepository.java" >nul 2>&1
if %errorlevel% neq 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL - Found old references
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

REM Test 9: No old region references  
echo|set /p="No 'u.region' references ... "
findstr /c:"u.region =" "c:\SmartCookingAI_2\backend\src\main\java\com\smartcooking\ai\repository\UserRepository.java" >nul 2>&1
if %errorlevel% neq 0 (
    echo ✅ PASS
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FAIL - Found old references
    set /a TESTS_FAILED+=1
)
set /a TOTAL_TESTS+=1

echo.
echo 📊 Test Results Summary
echo ======================
echo Total Tests: %TOTAL_TESTS%
echo Passed: %TESTS_PASSED%
echo Failed: %TESTS_FAILED%

if %TESTS_FAILED% equ 0 (
    echo.
    echo 🎉 All tests passed! Backend should start successfully.
    echo.
    echo 🚀 Next steps:
    echo    1. cd c:\SmartCookingAI_2\backend
    echo    2. .\mvnw spring-boot:run
    echo    3. Check: http://localhost:8080/actuator/health
    echo.
) else (
    echo.
    echo ❌ Some tests failed. Please fix the issues above.
    echo.
)

echo 📋 Quick Reference:
echo    Health Check: curl http://localhost:8080/actuator/health
echo    API Base URL: http://localhost:8080/api
echo    Frontend URL: http://localhost:3000
echo.

pause
