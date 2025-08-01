#!/bin/bash

# 🔧 QUICK OAUTH SETUP SCRIPT
# After creating OAuth 2.0 Client ID in Google Cloud Console,
# run this script to update your Flutter app

echo "🔗 Google Cloud Console OAuth Setup"
echo "=================================="
echo ""

echo "📋 Step 1: Go to Google Cloud Console"
echo "https://console.cloud.google.com/"
echo ""

echo "📋 Step 2: Create New Project (if not exists)"
echo "Project Name: SmartCookingAI"
echo ""

echo "📋 Step 3: Enable APIs"
echo "- Google+ API"
echo "- People API"
echo ""

echo "📋 Step 4: Create OAuth 2.0 Client ID"
echo "APIs & Services > Credentials > CREATE CREDENTIALS > OAuth client ID"
echo ""
echo "Application type: Web application"
echo "Name: SmartCookingAI Web Client"
echo ""

echo "📋 Step 5: Add Authorized Origins"
echo "Authorized JavaScript origins:"
echo "- http://localhost:62515"
echo "- http://localhost:54072"
echo "- https://yourdomain.com (for production)"
echo ""

echo "📋 Step 6: Copy Client ID"
echo "After creating, copy the Client ID (looks like: xxxxx-yyyyy.apps.googleusercontent.com)"
echo ""

echo "📋 Step 7: Update Flutter App"
echo "Replace placeholder in web/index.html:"
echo "FROM: 1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"  
echo "TO:   YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com"
echo ""

echo "🚀 Step 8: Restart Flutter App"
echo "flutter run -d chrome"
echo ""

echo "✅ Then Google Sign-In will work perfectly!"
echo ""

read -p "Press Enter when you have your Client ID ready..."

echo ""
echo "Enter your Google OAuth Client ID:"
read -p "Client ID: " CLIENT_ID

if [ ! -z "$CLIENT_ID" ]; then
    echo ""
    echo "🔧 Updating web/index.html..."
    
    # Update the Client ID in web/index.html
    sed -i "s/1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com/$CLIENT_ID/g" web/index.html
    
    echo "✅ Updated successfully!"
    echo "🚀 Now restart your Flutter app: flutter run -d chrome"
else
    echo "❌ No Client ID provided. Please run this script again."
fi
