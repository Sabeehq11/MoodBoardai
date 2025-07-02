# 🧠 BrainLift – MoodBoard AI

## 1. Setup & Environment Notes
- Using Firebase for backend, storing auth tokens and user mood entries
- Electron + React for desktop UI
- Spotify Web API used for music recommendations

## 2. Debugging & Fixes
- ✅ Fixed Spotify 404 by switching from `getRecommendations()` to search-based workaround
- ⛔ Avoid using Axios with ESM unless properly configured (broke everything temporarily)
- ✅ Resolved ESM/CommonJS issue by switching file to `.cjs` and reverting imports to `require()`

## 3. AI Workflow Enhancements
- Added GPT-powered grammar suggestions
- Simulated LangGraph integration (will revisit later)
- Spotify recs now personalize based on top playlists

## 4. Remaining To-Do
- [ ] Let new users auth with their own Spotify
- [ ] Improve mood-to-music mapping logic (happy, sad, etc.)
- [ ] Refactor dropdown UI for mood input (make it match app aesthetic) 