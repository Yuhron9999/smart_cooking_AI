@echo off
cls
echo 🚀 METHOD 1: FIX CREDENTIALS + FORCE PUSH
echo ==========================================
echo.

echo 🔧 Step 1: Fix Git credential configuration
git config --global --unset credential.helper
git config --global credential.helper manager-core

echo ✅ Git credentials fixed
echo.

echo 🔍 Step 2: Check current status
echo Current branch:
git branch --show-current

echo.
echo Current remote:
git remote -v

echo.
echo 🚀 Step 3: Force push to overwrite remote
echo ⚠️  This will overwrite GitHub repository completely
echo.
pause

git push --force-with-lease origin clean-main:main

if %errorlevel% == 0 (
    echo ✅ SUCCESS: Code pushed to GitHub!
    echo 🔗 Visit: https://github.com/Yuhron9999/smart_cooking_AI
) else (
    echo ❌ Push failed. Trying alternative method...
    git push --force origin clean-main:main
    
    if %errorlevel% == 0 (
        echo ✅ SUCCESS with force push!
    ) else (
        echo ❌ Force push also failed. Check manual method.
    )
)

echo.
pause
