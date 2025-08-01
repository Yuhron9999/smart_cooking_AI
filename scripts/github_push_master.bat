@echo off
cls
echo 🚀 SMART COOKING AI - GITHUB PUSH MASTER SCRIPT
echo ===============================================
echo.
echo 🎯 Choose the best method to push your code to GitHub:
echo.

echo 📊 PROBLEM ANALYSIS:
echo ├── ❌ Git credential error: 'credential-manager-core'
echo ├── ❌ Non-fast-forward: Branch behind remote
echo └── ❌ Authentication issues
echo.

echo 🛠️  AVAILABLE SOLUTIONS:
echo.
echo [1] 🔧 Fix Credentials + Force Push (Recommended)
echo     ├── Fixes Git credential configuration
echo     ├── Force overwrites GitHub repository
echo     └── ⚡ Fast and usually works
echo.
echo [2] 🆕 Create New Repository
echo     ├── Creates fresh GitHub repository
echo     ├── No history conflicts
echo     └── 🔄 Clean start option
echo.
echo [3] 🔄 Pull + Merge + Push
echo     ├── Tries to merge with existing repo
echo     ├── Preserves GitHub history
echo     └── 🤝 Collaborative approach
echo.
echo [4] 🔐 Manual Authentication Fix
echo     ├── Complete credential reset
echo     ├── Windows credential cache cleanup
echo     └── 🛡️  Most thorough fix
echo.
echo [5] 🌐 GitHub CLI Alternative
echo     ├── Uses official GitHub CLI
echo     ├── Modern authentication
echo     └── 📦 Includes web upload fallback
echo.
echo [6] 🔍 Diagnose Problem First
echo     ├── Analyzes current issues
echo     ├── Recommends best method
echo     └── 🧪 Testing approach
echo.
echo [7] ❌ Exit
echo.

choice /c 1234567 /m "Select your preferred method"

if errorlevel 7 goto :exit
if errorlevel 6 goto :diagnose
if errorlevel 5 call method5_github_cli.bat
if errorlevel 4 call method4_auth_fix.bat
if errorlevel 3 call method3_pull_merge.bat
if errorlevel 2 call method2_new_repo.bat
if errorlevel 1 call method1_force_push.bat

echo.
echo 🔄 Would you like to try another method?
choice /m "Try another method"
if errorlevel 2 goto :exit
goto :start

:diagnose
echo.
echo 🔍 DIAGNOSING GITHUB PUSH ISSUES
echo ================================
echo.

echo 📍 Repository Information:
echo ├── Local repo: %CD%
echo ├── Remote URL: 
git remote get-url origin
echo ├── Current branch: 
git branch --show-current
echo └── Behind by:
git rev-list --count HEAD..origin/main 2>nul || echo "Cannot determine"

echo.
echo 🔐 Authentication Status:
git config --get credential.helper
echo Current user: 
git config --get user.name
echo Current email: 
git config --get user.email

echo.
echo 🔍 Checking sensitive files:
git ls-files | findstr /i "secret\|credential\|key\|.env" || echo "✅ No sensitive files found"

echo.
echo 📊 RECOMMENDATION:
echo.
git status --porcelain >nul 2>&1
if %errorlevel__ == 0 (
    echo ✅ Working directory clean
    echo 💡 Try Method 1: Fix Credentials + Force Push
) else (
    echo ⚠️  Uncommitted changes detected  
    echo 💡 Try Method 4: Manual Authentication Fix
)

echo.
pause
goto :start

:start
cls
goto :choice

:exit
echo.
echo 👋 Thanks for using Smart Cooking AI GitHub Push Tool!
echo 🔗 Repository: https://github.com/Yuhron9999/smart_cooking_AI
echo.
pause
