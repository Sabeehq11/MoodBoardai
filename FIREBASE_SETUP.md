# Firebase Setup Guide

## Prerequisites
- Firebase project named "moodboardai" with Firestore enabled
- Firebase Admin SDK service account key

## Configuration Steps

### 1. Create .env file
Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=moodboardai
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_client_email_here
FIREBASE_CLIENT_ID=your_client_id_here
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url_here
```

### 2. Get Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `moodboardai` project
3. Click on Project Settings (gear icon)
4. Go to "Service Accounts" tab
5. Click "Generate new private key"
6. Download the JSON file
7. Copy the values from the JSON file to your `.env` file

### 3. JSON to .env Mapping
Map the values from your downloaded JSON file to the .env variables:

```
JSON field                  → .env variable
project_id                  → FIREBASE_PROJECT_ID
private_key_id              → FIREBASE_PRIVATE_KEY_ID
private_key                 → FIREBASE_PRIVATE_KEY
client_email                → FIREBASE_CLIENT_EMAIL
client_id                   → FIREBASE_CLIENT_ID
auth_uri                    → FIREBASE_AUTH_URI
token_uri                   → FIREBASE_TOKEN_URI
client_x509_cert_url        → FIREBASE_CLIENT_X509_CERT_URL
```

### 4. Test Connection
1. Start your Electron app: `npm start`
2. Go to Settings tab
3. Click "🧪 Test Firebase Connection" button
4. Check console for success/error messages

## Features
- **Dual Storage**: Data is saved to both Firestore and local files
- **Fallback Support**: App works even if Firebase is not connected
- **Test Function**: Built-in connection testing in Settings
- **Clear Logging**: Console messages show Firebase operations

## Firestore Collections
- `mood_entries`: Stores all mood entries with timestamps
- `test_connection`: Temporary collection for connection testing (auto-cleaned)

## Troubleshooting
- Check console output for detailed error messages
- Ensure all .env variables are correctly set
- Verify Firebase project has Firestore enabled
- Make sure service account has proper permissions 