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

### 🤖 LangGraph AI Integration
- **Advanced Mood Analysis**: Powered by OpenAI GPT-4 through LangGraph workflows
- **Personalized Insights**: AI analyzes your mood and provides tailored motivational guidance
- **Two-Stage Processing**: 
  1. Emotional analysis to understand underlying feelings
  2. Personalized insight generation with actionable suggestions
- **Fallback Support**: Works with encouraging default messages when API key is not configured
- **Privacy-First**: Your mood data is only sent to OpenAI when you have an API key configured

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

2. **Set Up AI Features (Optional)**
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```
   - Get your API key from: https://platform.openai.com/api-keys
   - **Note**: AI features work with fallback insights if no API key is provided

3. **Run the Application**
   ```bash
   npm start
   ```

4. **First Launch**
   - The app opens with a welcoming home screen
   - Click "Get Started" to enter the main application
   - Your mood entries are automatically saved locally
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

## 💾 Data Storage

### 🏠 Local Storage
- All mood entries and settings stored locally on your device
- JSON file-based storage for simplicity and reliability
- No external dependencies required

## 🏗️ Technology Stack

- **Electron**: Cross-platform desktop application framework
- **HTML/CSS/JavaScript**: Modern web technologies
- **Chart.js**: Interactive mood trend visualizations
- **Node.js**: Backend functionality for file operations
- **LangGraph**: AI workflow orchestration for mood analysis
- **OpenAI GPT-4**: Advanced natural language processing for personalized insights
- **LangChain**: AI application framework for building the mood analysis pipeline

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

## 🌟 Features

- **🏠 Beautiful Home Screen**: Welcome with personalized greetings
- **📝 Daily Quotes**: 20+ inspirational quotes that rotate randomly
- **✨ Smooth Animations**: Enhanced UI transitions and fade effects
- **👤 Personalization**: Uses system username for welcome messages
- **🎯 Improved UX**: Better navigation flow and visual hierarchy
- **💾 Local Storage**: All data stored safely on your device

## 🔒 Privacy & Security

- **Personal Desktop App**: Designed for single-user personal use
- **Local Data Storage**: Your data stays on your device
- **No Data Mining**: We don't analyze or sell your mood data
- **Open Source**: Full transparency in data handling
- **Simple & Secure**: No external connections required for basic functionality