@echo off
cls
echo 🌐 METHOD 5: GITHUB CLI ALTERNATIVE
echo ===================================
echo.

echo 🎯 This method uses GitHub CLI for easier authentication
echo.

echo 🔍 Step 1: Check if GitHub CLI is installed
where gh >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ GitHub CLI found
    goto :ghcli
) else (
    echo ❌ GitHub CLI not found
    echo.
    echo 📥 Installing GitHub CLI...
    echo 💡 Options:
    echo [1] Download from: https://cli.github.com/
    echo [2] Install via winget: winget install GitHub.cli
    echo [3] Install via chocolatey: choco install gh
    echo [4] Skip and use web upload method
    echo.
    
    choice /c 1234 /m "Select option"
    
    if errorlevel 4 goto :webupload
    if errorlevel 3 (
        choco install gh -y
        if %errorlevel% neq 0 echo ❌ Chocolatey not found or failed
    )
    if errorlevel 2 (
        winget install GitHub.cli
        if %errorlevel__ neq 0 echo ❌ Winget failed
    )
    if errorlevel 1 (
        start https://cli.github.com/
        echo 📥 Please download and install GitHub CLI, then run this script again
        pause
        exit /b 0
    )
)

:ghcli
echo.
echo 🔐 Step 2: Authenticate with GitHub CLI
gh auth status
if %errorlevel__ neq 0 (
    echo 🔑 Logging in to GitHub...
    gh auth login
)

echo.
echo 🔍 Step 3: Check repository status
gh repo view Yuhron9999/smart_cooking_AI

if %errorlevel__ neq 0 (
    echo ❌ Repository not found or inaccessible
    echo 🆕 Creating new repository...
    
    set /p private="Make repository private? (y/n): "
    if /i "%private%"=="y" (
        gh repo create smart_cooking_AI --private --source=. --remote=origin --push
    ) else (
        gh repo create smart_cooking_AI --public --source=. --remote=origin --push
    )
) else (
    echo ✅ Repository found
    echo.
    echo 🚀 Step 4: Push using GitHub CLI
    
    echo Choose method:
    echo [1] Force push (overwrite GitHub)
    echo [2] Create pull request
    echo [3] Push to new branch
    
    choice /c 123 /m "Select option"
    
    if errorlevel 3 (
        set /p branchname="Enter branch name: "
        git checkout -b %branchname%
        git push -u origin %branchname%
        gh pr create --title "Update: Complete Smart Cooking AI System" --body "Complete system update with all features"
    ) else if errorlevel 2 (
        git checkout -b update-complete-system
        git push -u origin update-complete-system
        gh pr create --title "Complete Smart Cooking AI System Update" --body "Full system with all components and security fixes"
    ) else (
        git push --force origin main
    )
)

goto :end

:webupload
echo.
echo 🌐 WEB UPLOAD METHOD
echo ===================
echo.
echo 📦 Step 1: Create ZIP file
powershell -Command "Compress-Archive -Path '.' -DestinationPath 'smart_cooking_ai_upload.zip' -Force"

if exist "smart_cooking_ai_upload.zip" (
    echo ✅ ZIP file created: smart_cooking_ai_upload.zip
    echo.
    echo 📝 Manual steps:
    echo 1. Go to: https://github.com/Yuhron9999/smart_cooking_AI
    echo 2. Click "uploading an existing file"
    echo 3. Drag and drop: smart_cooking_ai_upload.zip
    echo 4. Commit message: "Complete Smart Cooking AI system upload"
    echo 5. Click "Commit changes"
    echo.
    echo 🔗 Or create new repo at: https://github.com/new
    echo Then upload the ZIP file there
    echo.
    start https://github.com/Yuhron9999/smart_cooking_AI
) else (
    echo ❌ Failed to create ZIP file
)

:end
echo.
echo ✅ Method 5 completed!
pause
