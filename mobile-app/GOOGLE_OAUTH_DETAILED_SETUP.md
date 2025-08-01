# 🔧 OAuth Setup Instructions

## Step-by-step Google OAuth 2.0 Setup for Smart Cooking AI

### 1. Google Cloud Console Setup

1. **Go to**: https://console.cloud.google.com/
2. **Create New Project**:
   - Name: `SmartCookingAI`
   - Click CREATE

3. **Enable APIs**:
   - APIs & Services > Library
   - Search and Enable:
     - Google+ API
     - People API
     - Identity and Access Management (IAM) API

4. **OAuth Consent Screen**:
   - APIs & Services > OAuth consent screen
   - User Type: External
   - App name: Smart Cooking AI
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
   - Save and Continue through all steps

5. **Create OAuth 2.0 Client ID**:
   - APIs & Services > Credentials
   - - CREATE CREDENTIALS > OAuth client ID
   - Application type: Web application
   - Name: SmartCookingAI Web Client

   **Authorized JavaScript origins:**

   ```
   http://localhost:54072
   http://localhost:62515
   http://localhost:3000
   ```

   **Authorized redirect URIs:**

   ```
   http://localhost:54072/auth
   http://localhost:62515/auth
   http://localhost:3000/auth
   ```

6. **Copy the Client ID** (looks like: xxxxx-yyyyy.apps.googleusercontent.com)

### 2. Update Flutter App

After getting your Client ID, run this command:

```bash
# Replace YOUR_CLIENT_ID with the actual Client ID from Google Cloud Console
sed -i 's/1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com/YOUR_CLIENT_ID_HERE/g' web/index.html
```

Or manually edit `web/index.html` and replace:

```html
<!-- FROM: -->
content="1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com"

<!-- TO: -->
content="YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com"
```

### 3. Restart Flutter App

```bash
flutter run -d chrome
```

### 4. Test Google Sign-In

1. Click "Đăng nhập với Google"
2. Should now work without "invalid_client" error
3. Sign in with your Google account
4. Should redirect to app successfully

## Troubleshooting

If you still get errors:

1. Double-check Client ID is correctly copied
2. Ensure authorized origins include your localhost port
3. Make sure OAuth consent screen is configured
4. Try clearing browser cache and restart

## Security Notes

- Client ID is safe to expose in frontend code
- Never expose Client Secret in frontend
- For production, add your actual domain to authorized origins
- Consider using environment variables for different environments
