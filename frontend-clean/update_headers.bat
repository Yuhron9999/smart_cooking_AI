@echo off
echo Updating all header imports to use main Header component...

REM Update all Header_fixed imports
powershell -Command "(Get-Content 'pages\voice.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\voice.tsx'"
powershell -Command "(Get-Content 'pages\favorites.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\favorites.tsx'"
powershell -Command "(Get-Content 'pages\index.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\index.tsx'"
powershell -Command "(Get-Content 'pages\dashboard.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\dashboard.tsx'"
powershell -Command "(Get-Content 'pages\voice-assistant.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\voice-assistant.tsx'"
powershell -Command "(Get-Content 'pages\food-recognition.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\food-recognition.tsx'"
powershell -Command "(Get-Content 'pages\learning-path.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\learning-path.tsx'"
powershell -Command "(Get-Content 'pages\settings.tsx') -replace '@/components/layout/Header_fixed', '@/components/layout/Header' | Set-Content 'pages\settings.tsx'"
powershell -Command "(Get-Content 'pages\recipes-fixed.tsx') -replace '../src/components/layout/Header_fixed', '../src/components/layout/Header' | Set-Content 'pages\recipes-fixed.tsx'"

REM Update Header2 imports  
powershell -Command "(Get-Content 'src\pages\recipes\index.tsx') -replace '@/components/layout/Header2', '@/components/layout/Header' | Set-Content 'src\pages\recipes\index.tsx'"
powershell -Command "(Get-Content 'src\components\layout\SimpleLayout.tsx') -replace './Header2', './Header' | Set-Content 'src\components\layout\SimpleLayout.tsx'"

echo All header imports updated successfully!
pause
