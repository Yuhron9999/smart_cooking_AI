@echo off
cls
echo 🔐 METHOD 4: MANUAL AUTHENTICATION FIX
echo =======================================
echo.

echo 🎯 This method fixes Git authentication completely
echo.

echo 🔧 Step 1: Reset all Git credentials
git config --global --unset-all credential.helper
git config --unset-all credential.helper

echo.
echo 🔧 Step 2: Clear Windows credential cache
cmdkey /list | findstr git
cmdkey /delete:git:https://github.com 2>nul
cmdkey /delete:github.com 2>nul

echo.
echo 🔧 Step 3: Set new credential helper
git config --global credential.helper manager-core

echo.
echo 🔧 Step 4: Verify user configuration
echo Current Git user:
git config --global user.name
git config --global user.email

echo.
set /p confirm="Is this correct? (y/n): "
if /i "%confirm%"=="n" (
    set /p username="Enter your GitHub username: "
    set /p email="Enter your email: "
    git config --global user.name "%username%"
    git config --global user.email "%email%"
    echo ✅ User configuration updated
)

echo.
echo 🔧 Step 5: Test authentication
echo Testing connection to GitHub...
git ls-remote origin

if %errorlevel% == 0 (
    echo ✅ Authentication working!
    echo.
    echo 🚀 Step 6: Push with authentication
    
    echo Choose push strategy:
    echo [1] Normal push
    echo [2] Force push (overwrite)
    echo [3] Push to new branch
    
    choice /c 123 /m "Select option"
    
    if errorlevel 3 (
        set /p branchname="Enter new branch name: "
        git checkout -b %branchname%
        git push -u origin %branchname%
    ) else if errorlevel 2 (
        git push --force origin main
    ) else (
        git push origin main
    )
    
    if %errorlevel% == 0 (
        echo ✅ SUCCESS: Code pushed to GitHub!
        echo 🔗 Visit: https://github.com/Yuhron9999/smart_cooking_AI
    ) else (
        echo ❌ Push still failed
    )
) else (
    echo ❌ Authentication still not working
    echo 💡 You may need to:
    echo 1. Create Personal Access Token at: https://github.com/settings/tokens
    echo 2. Use token as password when prompted
    echo 3. Enable 2FA if required
)

echo.
pause
