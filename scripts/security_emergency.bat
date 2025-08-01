@echo off
cls
echo 🚨 SMART COOKING AI - SECURITY EMERGENCY RESPONSE
echo =================================================
echo.
echo ⚠️  DETECTED: Google credentials in Git history!
echo 🔥 IMMEDIATE ACTION REQUIRED
echo.

echo 📋 SECURITY CHECKLIST:
echo.
echo □ 1. Revoke old credentials at Google Cloud Console
echo □ 2. Clean Git history completely  
echo □ 3. Create new credentials
echo □ 4. Setup secure credential management
echo □ 5. Update all applications
echo.

echo 🎯 Choose action:
echo [1] 🚨 Emergency: Clean Git history NOW
echo [2] 🔐 Setup secure credentials manager
echo [3] 🔗 Open Google Cloud Console
echo [4] 📚 Show security guide
echo [5] ❌ Exit
echo.

choice /C 12345 /M "Select option"

if errorlevel 5 goto :exit
if errorlevel 4 goto :guide
if errorlevel 3 goto :console
if errorlevel 2 goto :secure
if errorlevel 1 goto :emergency

:emergency
echo.
echo 🚨 EMERGENCY: Cleaning Git history...
echo ⚠️  This will permanently remove sensitive data from Git
echo.
call emergency_git_cleanup.bat
goto :done

:secure
echo.
echo 🔐 Setting up secure credentials manager...
python secure_credentials_manager.py
goto :done

:console
echo.
echo 🔗 Opening Google Cloud Console...
start https://console.cloud.google.com/apis/credentials?project=tactical-orbit-431412-v1
echo.
echo 📝 Actions to take in Console:
echo 1. Delete/disable old OAuth client
echo 2. Delete/disable old Service Account  
echo 3. Create new OAuth client
echo 4. Create new Service Account
echo 5. Download new credentials
echo.
pause
goto :done

:guide
echo.
echo 📚 SECURITY GUIDE:
echo ==================
echo.
echo 🔥 IMMEDIATE ACTIONS:
echo 1. Revoke compromised credentials immediately
echo 2. Clean Git history to remove sensitive data
echo 3. Create new credentials with different names
echo 4. Setup secure credential storage outside Git
echo 5. Update all applications using old credentials
echo.
echo 🛡️  PREVENTION:
echo 1. Never commit credential files to Git
echo 2. Use environment variables for API keys
echo 3. Store credentials outside project directory
echo 4. Use .gitignore to prevent accidental commits
echo 5. Regular security audits of repositories
echo.
echo 🔗 Resources:
echo - Google Security: https://cloud.google.com/security-best-practices
echo - Git Security: https://docs.github.com/en/code-security
echo.
pause
goto :done

:done
echo.
echo ✅ Security action completed!
echo 🔒 Remember: Security is an ongoing process
echo.

:exit
pause
