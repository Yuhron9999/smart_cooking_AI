@echo off
echo ========================================
echo   SMART COOKING AI - FRONTEND CONSOLIDATION
echo ========================================
echo.

echo Step 1: Creating unified frontend directory...
if not exist "frontend" mkdir "frontend"

echo Step 2: Moving files from frontend-clean (most stable)...
if exist "frontend-clean" (
    xcopy "frontend-clean\*" "frontend\" /E /H /Y /Q
    echo ✓ Copied frontend-clean content
)

echo Step 3: Moving additional components from other frontends...
if exist "frontend-nextjs\components" (
    if not exist "frontend\components\backup" mkdir "frontend\components\backup"
    xcopy "frontend-nextjs\components\*" "frontend\components\backup\" /E /H /Y /Q 2>nul
    echo ✓ Backed up frontend-nextjs components
)

if exist "frontend-web\src" (
    if not exist "frontend\src\backup" mkdir "frontend\src\backup"
    xcopy "frontend-web\src\*" "frontend\src\backup\" /E /H /Y /Q 2>nul
    echo ✓ Backed up frontend-web src
)

echo Step 4: Creating consolidation summary...
echo FRONTEND CONSOLIDATION COMPLETED > "frontend\CONSOLIDATION_SUMMARY.md"
echo ================================= >> "frontend\CONSOLIDATION_SUMMARY.md"
echo. >> "frontend\CONSOLIDATION_SUMMARY.md"
echo Primary Source: frontend-clean (working version) >> "frontend\CONSOLIDATION_SUMMARY.md"
echo Backup Sources: >> "frontend\CONSOLIDATION_SUMMARY.md"
echo - frontend-nextjs components backed up >> "frontend\CONSOLIDATION_SUMMARY.md"
echo - frontend-web src backed up >> "frontend\CONSOLIDATION_SUMMARY.md"
echo. >> "frontend\CONSOLIDATION_SUMMARY.md"
echo Date: %date% %time% >> "frontend\CONSOLIDATION_SUMMARY.md"

echo.
echo ✅ Frontend consolidation completed!
echo ✅ Main frontend directory: /frontend
echo ✅ Backup files preserved in /frontend/components/backup and /frontend/src/backup
echo.
echo Old directories can be safely deleted after verification.
echo.
pause
