@echo off
echo ========================================
echo SMART COOKING AI - CLEAR AUTH CACHE
echo ========================================

echo.
echo 1. Stopping Next.js development server...
taskkill /f /im node.exe 2>nul

echo.
echo 2. Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo    ✓ Cleared .next folder
) else (
    echo    ✓ .next folder already clean
)

echo.
echo 3. Clearing node_modules cache...
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo    ✓ Cleared node_modules cache
) else (
    echo    ✓ Node modules cache already clean
)

echo.
echo 4. Clearing npm cache...
npm cache clean --force
echo    ✓ Cleared npm cache

echo.
echo 5. Reinstalling dependencies...
npm install
echo    ✓ Dependencies reinstalled

echo.
echo ========================================
echo CACHE CLEARED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure Google Cloud Console redirect URIs are correct
echo 2. Run: npm run dev
echo 3. Test: http://localhost:3000/debug/auth
echo 4. Try login: http://localhost:3000/auth/login
echo.
pause
