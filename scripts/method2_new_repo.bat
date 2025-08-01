@echo off
cls
echo 🆕 METHOD 2: CREATE NEW REPOSITORY
echo ==================================
echo.

echo 🎯 This method creates a fresh repository
echo 📝 Steps:
echo 1. Create new repo on GitHub
echo 2. Push our clean code there
echo 3. Update remote URL
echo.

echo 💡 Option A: Create new repo with different name
echo Example: smart_cooking_ai_v2, smart-cooking-system, etc.
echo.

echo 💡 Option B: Delete and recreate same repo
echo ⚠️  WARNING: This will lose all GitHub history/issues/PRs
echo.

set /p choice="Choose A (new name) or B (same name): "

if /i "%choice%"=="A" (
    goto :newname
) else if /i "%choice%"=="B" (
    goto :samename
) else (
    echo Invalid choice
    pause
    exit /b 1
)

:newname
echo.
set /p reponame="Enter new repository name: "
echo.
echo 📝 Manual steps:
echo 1. Go to: https://github.com/new
echo 2. Repository name: %reponame%
echo 3. Set as Public
echo 4. Don't initialize with README
echo 5. Click 'Create repository'
echo.
pause

echo 🔄 Adding new remote...
git remote set-url origin https://github.com/Yuhron9999/%reponame%.git

echo 🚀 Pushing to new repository...
git push -u origin clean-main:main

if %errorlevel% == 0 (
    echo ✅ SUCCESS: New repository created!
    echo 🔗 Visit: https://github.com/Yuhron9999/%reponame%
) else (
    echo ❌ Failed. Check if repository was created correctly.
)
goto :end

:samename
echo.
echo ⚠️  DELETE AND RECREATE WARNING:
echo This will permanently delete your current GitHub repository!
echo All stars, forks, issues, PRs will be lost!
echo.
set /p confirm="Type 'DELETE' to confirm: "

if /i "%confirm%"=="DELETE" (
    echo.
    echo 📝 Manual steps:
    echo 1. Go to: https://github.com/Yuhron9999/smart_cooking_AI/settings
    echo 2. Scroll to bottom
    echo 3. Click 'Delete this repository'
    echo 4. Type 'Yuhron9999/smart_cooking_AI' to confirm
    echo 5. Go to: https://github.com/new
    echo 6. Create new repo: smart_cooking_AI
    echo 7. Don't initialize with anything
    echo.
    pause
    
    echo 🚀 Pushing to recreated repository...
    git push -u origin clean-main:main
    
    if %errorlevel% == 0 (
        echo ✅ SUCCESS: Repository recreated!
        echo 🔗 Visit: https://github.com/Yuhron9999/smart_cooking_AI
    ) else (
        echo ❌ Failed. Repository might not be created yet.
    )
) else (
    echo Cancelled.
)

:end
echo.
pause
