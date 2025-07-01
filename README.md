# MoodBoard AI

A beautiful, modern Electron-based mood tracking application with AI-powered suggestions and music recommendations.

## ✨ Features

### 🏠 Welcome Home Screen
- **Personalized Welcome**: Greets users with their system username
- **Daily Inspiration**: Randomly selected inspirational quotes with smooth fade-in animations
- **Beautiful Design**: Same gradient background styling as the main app
- **Smooth Transitions**: Elegant animations when entering the main application

### 🎭 Mood Tracking
- Select from various mood states (Happy, Neutral, Tired, Frustrated, Sad)
- Add optional notes to describe what's affecting your mood
- Get AI-powered suggestions based on your current emotional state
- Receive curated music recommendations for each mood

### 📖 Mood History
- View all your previous mood entries with timestamps
- See AI suggestions and music recommendations from past entries
- Beautiful card-based layout with hover effects

### 📊 Mood Trends
- Visualize your mood patterns over time with interactive charts
- Track emotional wellness trends
- Identify patterns in your mood changes

### ⚙️ Settings
- Set default mood preferences
- Choose preferred music platform (Spotify/Apple Music)
- Configure daily mood reminder notifications
- Persistent settings storage

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Firebase Firestore (Required for Data Storage)**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Firestore Database (Authentication not required)
   - Get your Firebase configuration from Project Settings > General > Your apps
   - Create a `.env` file in the project root with your Firebase credentials (see example below)

3. **Run the Application**
   ```bash
   npm start
   ```

4. **First Launch**
   - The app opens with a welcoming home screen
   - Click "Get Started" to enter the main application
   - Your mood entries are automatically saved to Firestore
   - The tab navigation appears after leaving the home screen

## 🎨 Design Features

- **Modern Gradient Background**: Animated gradient that shifts colors smoothly
- **Glass Morphism UI**: Translucent cards with backdrop blur effects
- **Smooth Animations**: Fade-in effects, hover states, and transition animations
- **Responsive Design**: Optimized for different screen sizes
- **Accessibility**: Focus states and proper contrast ratios

## 🎵 Music Integration

- Spotify playlist recommendations based on mood
- Direct links to curated playlists for each emotional state
- Configurable music platform preferences

## 💾 Data Storage with Firestore

### ☁️ Firestore Database
- **Cloud Storage**: All mood entries and settings stored in Firestore
- **No Authentication Required**: Simplified setup for local desktop use
- **Automatic Syncing**: Data is saved to Firestore on each mood entry
- **Fixed User ID**: Uses a local desktop user identifier for data organization

### 🏠 Local Desktop App Design
- **Single User**: Designed for personal use on your desktop
- **Persistent Storage**: Your data is safely stored in Google's Firestore
- **Offline Tolerance**: App continues to work, syncs when connection returns
- **Simple Setup**: Just configure Firebase project, no user accounts needed

## 🏗️ Technology Stack

- **Electron**: Cross-platform desktop application framework
- **HTML/CSS/JavaScript**: Modern web technologies
- **Chart.js**: Interactive mood trend visualizations
- **Node.js**: Backend functionality for file operations

## 📱 Navigation Flow

1. **Home Screen** → Welcome message, daily quote, "Get Started" button
2. **Main App** → Tab navigation with four main sections:
   - 🎭 **Mood Entry**: Track your current mood
   - 📖 **Mood History**: Review past entries
   - 📊 **Mood Trends**: Analyze patterns
   - ⚙️ **Settings**: Customize preferences

## 🔧 Development

The app consists of:
- `main.js`: Electron main process
- `renderer.js`: Frontend logic and home screen functionality  
- `index.html`: UI structure and styling
- `server.js`: Additional server functionality (if needed)

## 🌟 New in Latest Version

- **🔥 Firebase Firestore Integration**: Cloud storage without authentication complexity
- **☁️ Automatic Cloud Sync**: All mood entries saved to Firestore automatically
- **🏠 Enhanced Home Screen**: Beautiful welcome with personalized greetings
- **📝 Daily Quotes**: 20+ inspirational quotes that rotate randomly
- **✨ Smooth Animations**: Enhanced UI transitions and fade effects
- **👤 Personalization**: Uses system username for welcome messages
- **🎯 Improved UX**: Better navigation flow and visual hierarchy
- **🔧 Simplified Setup**: No user accounts needed, just configure Firebase

## 🔥 Firebase Setup Guide

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup steps
3. Choose your project name and settings

### Step 2: Set up Firestore Database
1. Go to **Firestore Database** in your Firebase project
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select your preferred location

### Step 3: Configure Environment Variables
1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps" section
3. Click **Add app** > **Web app**
4. Register your app and copy the configuration object
5. Create a `.env` file in your project root
6. Add your Firebase credentials to the `.env` file (see Required Environment Variables section above)

### Step 4: Security Rules (Optional)
For production, you may want to update your Firestore security rules. Since this is a personal desktop app, you can use simple rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for local desktop app
    match /users/local-desktop-user/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Note**: For development, you can start with test mode rules that allow all access, then tighten them for production use.

### Required Environment Variables
Create a `.env` file in the root directory with your Firebase credentials:

```bash
# Firebase Configuration (Required)
FIREBASE_API_KEY=your_actual_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012

# Optional Development Settings
NODE_ENV=development
USE_FIRESTORE_EMULATOR=false
```

**Security Note**: Never commit your `.env` file to version control. Add `.env` to your `.gitignore` file.

## 🔒 Privacy & Security

- **Personal Desktop App**: Designed for single-user personal use
- **Google Firestore**: Your data is stored securely in Google's cloud infrastructure
- **Fixed User ID**: Uses consistent `local-desktop-user` identifier
- **No Data Mining**: We don't analyze or sell your mood data
- **Open Source**: Full transparency in data handling
- **Simple & Secure**: No complex authentication, just your private mood data