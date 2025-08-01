@echo off
cls
echo 🚨 EMERGENCY: Cleaning sensitive data from Git history...
echo ==============================================
echo.

echo ⚠️  WARNING: This will permanently remove sensitive files from Git history
echo ⚠️  All collaborators must re-clone the repository after this operation
echo.

pause

REM Use BFG Repo-Cleaner if available, otherwise use git filter-branch
where bfg >nul 2>&1
if %errorlevel% == 0 (
    echo 🔄 Using BFG Repo-Cleaner (faster method)...
    bfg --delete-folders .github/secrets
    bfg --delete-files "client_secret_*.json"
    bfg --delete-files "smart_cooking2.json"
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
) else (
    echo 🔄 Using git filter-branch (slower method)...
    
    REM Remove specific sensitive files
    git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .github/secrets/client_secret_638702620723-ou1fc8t9laggt8cc5nf4infb0r4m19i2.apps.googleusercontent.com.json" --prune-empty --tag-name-filter cat -- --all
    
    git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .github/secrets/smart_cooking2.json" --prune-empty --tag-name-filter cat -- --all
    
    REM Remove entire secrets directory
    git filter-branch --force --index-filter "git rm -r --cached --ignore-unmatch .github/secrets" --prune-empty --tag-name-filter cat -- --all
    
    REM Clean up
    rmdir /s /q .git\refs\original\ 2>nul
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
)

echo.
echo ✅ Git history cleaned!
echo.
echo 🚀 Next steps:
echo 1. This script will now force push to overwrite GitHub history
echo 2. You MUST create new Google credentials immediately
echo 3. Update all applications with new credentials
echo.

echo ⚠️  Pushing cleaned history to GitHub...
git push --force-with-lease origin clean-main:main

if %errorlevel% == 0 (
    echo ✅ Successfully cleaned GitHub history!
) else (
    echo ❌ Failed to push. Try manually: git push --force origin clean-main:main
)

echo.
echo 🔒 IMPORTANT: Create new credentials at:
echo https://console.cloud.google.com/apis/credentials?project=tactical-orbit-431412-v1
echo.
pause
