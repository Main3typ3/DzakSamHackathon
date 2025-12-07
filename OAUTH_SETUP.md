# OAuth 2.0 Setup Guide

This guide explains how to set up Google OAuth 2.0 authentication for ChainQuest Academy.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "ChainQuest Academy" (or your preferred name)
5. Click "Create"

### 2. Enable Google+ API

1. In your project, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

Alternatively, you can enable "Google Identity Services API" which is the newer version.

### 3. Create OAuth 2.0 Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type (unless you have a Google Workspace)
   - Fill in required fields:
     - App name: "ChainQuest Academy"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip the Scopes step (click "Save and Continue")
   - Add test users if in testing mode
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "ChainQuest Academy Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - Add your production domain when deploying
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for local development)
     - Add your production callback URL when deploying
   - Click "Create"

5. Copy the Client ID and Client Secret that appear

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id-here
   GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
   GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
   
   # Generate a secure JWT secret
   JWT_SECRET=your-secure-random-string-here
   ```

3. Generate a secure JWT secret:
   ```bash
   # On Linux/Mac:
   openssl rand -hex 32
   
   # Or use Python:
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

### 5. Test the OAuth Flow

1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

4. You should see the onboarding flow

5. Click through the onboarding and click "Sign in with Google"

6. You'll be redirected to Google's login page

7. After successful authentication, you'll be redirected back to the app

## Troubleshooting

### "redirect_uri_mismatch" Error

- Make sure the redirect URI in `.env` exactly matches one of the authorized redirect URIs in Google Cloud Console
- Check for trailing slashes - they must match exactly
- Ensure you're accessing the app at the same URL configured (http://localhost:5173)

### "invalid_client" Error

- Double-check your Client ID and Client Secret are correct
- Ensure there are no extra spaces in your `.env` file

### "access_denied" Error

- You may have clicked "Cancel" on the Google consent screen
- Try again and click "Allow"

### Token Validation Fails

- Make sure your JWT_SECRET is set and consistent
- Clear your browser's localStorage and try again
- Check that the backend server is running

## Production Deployment

When deploying to production:

1. Update Google OAuth credentials:
   - Add your production domain to "Authorized JavaScript origins"
   - Add your production callback URL to "Authorized redirect URIs"
   - Example: `https://yourapp.com/auth/callback`

2. Update `.env` with production values:
   ```env
   GOOGLE_REDIRECT_URI=https://yourapp.com/auth/callback
   JWT_SECRET=use-a-different-more-secure-secret-for-production
   ```

3. If using Google Workspace, you can change the OAuth consent screen to "Internal" for better user experience

4. Consider implementing additional security measures:
   - Rate limiting
   - CSRF protection
   - Content Security Policy headers
   - HTTPS only (redirect HTTP to HTTPS)

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use different JWT secrets** for development and production
3. **Rotate secrets periodically** - Update OAuth client secrets every 90 days
4. **Enable 2FA** on your Google Cloud account
5. **Monitor OAuth usage** in Google Cloud Console
6. **Implement token refresh** for long-lived sessions (future enhancement)
7. **Use HTTPS in production** - OAuth requires secure connections

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [FastAPI Security Documentation](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
