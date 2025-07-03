import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { 
  saveMoodEntryToFirestore, 
  getMoodHistoryFromFirestore,
  saveAutomationRuleToFirestore,
  getAutomationRulesFromFirestore,
  deleteAutomationRuleFromFirestore,
  saveUserTeamToFirestore,
  getUserTeamFromFirestore,
  getTeamMoodDataFromFirestore,
  isFirebaseConnected 
} from './firebaseClient.js';
import { runMoodAnalysisFlow } from './langgraphFlow.js';
import { getRecommendationsFromUserPlaylists } from './spotifyRecommender.cjs';
import { processCalendarAutomation } from './calendarAutomation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Optional: add icon later
    show: false // Hide until ready to prevent visual flash
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development (optional)
  // mainWindow.webContents.openDevTools(); // Disabled to prevent interference
}

// Register IPC handlers before app is ready
// Handle mood entry logging with both Firebase and local file storage
ipcMain.handle('log-mood-entry', async (event, moodEntryObject) => {
  let localResult = { success: false };
  let firebaseResult = { success: false };
  let calendarResult = { success: false };

  // Generate a simple userId based on system username for team functionality
  const userId = os.userInfo().username || 'anonymous';
  
  // Add userId to mood entry for team tracking
  const moodEntryWithUserId = {
    ...moodEntryObject,
    userId: userId
  };

  // Always save to local file (fallback)
  try {
    const moodHistoryFile = path.join(__dirname, 'mood-history.json');
    
    // Read existing mood history
    let moodHistory = [];
    if (fs.existsSync(moodHistoryFile)) {
      const data = fs.readFileSync(moodHistoryFile, 'utf8');
      moodHistory = JSON.parse(data);
    }
    
    // Add new entry
    moodHistory.push(moodEntryWithUserId);
    
    // Write back to file
    fs.writeFileSync(moodHistoryFile, JSON.stringify(moodHistory, null, 2));
    
    localResult = { success: true, id: moodEntryWithUserId.timestamp };
    console.log('✅ Local: Mood entry logged successfully:', moodEntryWithUserId.mood, '-', moodEntryWithUserId.timestamp);
  } catch (error) {
    console.error('❌ Local: Error logging mood entry:', error);
    localResult = { success: false, error: error.message };
  }

  // Try to save to Firebase (if connected)
  try {
    firebaseResult = await saveMoodEntryToFirestore(moodEntryWithUserId);
  } catch (error) {
    console.error('❌ Firebase: Error logging mood entry:', error);
    firebaseResult = { success: false, error: error.message };
  }

  // Process calendar automation (if enabled)
  try {
    // Get user settings to check if calendar automation is enabled
    const settingsFile = path.join(__dirname, 'user-settings.json');
    let userSettings = {};
    
    if (fs.existsSync(settingsFile)) {
      const settingsData = fs.readFileSync(settingsFile, 'utf8');
      userSettings = JSON.parse(settingsData);
    }
    
    // Process calendar automation
    calendarResult = await processCalendarAutomation(moodEntryWithUserId, userSettings);
    
  } catch (error) {
    console.error('❌ Calendar: Error processing calendar automation:', error);
    calendarResult = { success: false, error: error.message };
  }

  // Return combined result
  return {
    success: localResult.success || firebaseResult.success,
    local: localResult,
    firebase: firebaseResult,
    calendar: calendarResult,
    id: localResult.id || firebaseResult.id
  };
});

// Handle mood history retrieval from Firebase with local fallback
ipcMain.handle('get-mood-history', async () => {
  console.log('get-mood-history handler called - trying Firebase first, then local fallback');
  
  // Try Firebase first (if connected)
  if (isFirebaseConnected) {
    try {
      const firebaseResult = await getMoodHistoryFromFirestore();
      if (firebaseResult.success && firebaseResult.data.length > 0) {
        console.log('✅ Firebase: Successfully loaded mood history:', firebaseResult.data.length, 'entries');
        return firebaseResult.data;
      }
    } catch (error) {
      console.error('❌ Firebase: Error reading mood history:', error);
    }
  }

  // Fallback to local file
  try {
    const moodHistoryFile = path.join(__dirname, 'mood-history.json');
    
    if (!fs.existsSync(moodHistoryFile)) {
      console.log('📝 Local: No mood history file found, returning empty array');
      return [];
    }
    
    const data = fs.readFileSync(moodHistoryFile, 'utf8');
    const moodHistory = JSON.parse(data);
    
    console.log('✅ Local: Successfully loaded mood history from local file:', moodHistory.length, 'entries');
    return moodHistory;
  } catch (error) {
    console.error('❌ Local: Error reading mood history from local file:', error);
    return [];
  }
});


// Handle user settings saving with local file storage
ipcMain.handle('save-user-settings', async (event, settings) => {
  try {
    const settingsFile = path.join(__dirname, 'user-settings.json');
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    
    console.log('User settings saved successfully:', settings);
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
});

// Handle user settings retrieval from local file
ipcMain.handle('get-user-settings', async () => {
  console.log('get-user-settings handler called - retrieving from local file');
  
  try {
    const settingsFile = path.join(__dirname, 'user-settings.json');
    
    if (!fs.existsSync(settingsFile)) {
      console.log('No settings file found, returning null');
      return null;
    }
    
    const data = fs.readFileSync(settingsFile, 'utf8');
    const settings = JSON.parse(data);
    
    console.log('Successfully loaded user settings from local file:', settings);
    return settings;
  } catch (error) {
    console.error('Error reading user settings from local file:', error);
    return null;
  }
});

// Handle local data reset
ipcMain.handle('reset-local-data', async () => {
  console.log('reset-local-data handler called - deleting local file');
  
  try {
    const moodHistoryFile = path.join(__dirname, 'mood-history.json');
    
    if (fs.existsSync(moodHistoryFile)) {
      fs.unlinkSync(moodHistoryFile);
      console.log('✅ Mood history file deleted successfully');
    }
    
    return { success: true, message: 'Local data reset completed' };
  } catch (error) {
    console.error('❌ Error resetting local data:', error);
    return { success: false, error: error.message };
  }
});

// Handle settings reset
ipcMain.handle('reset-settings', async () => {
  console.log('reset-settings handler called - deleting local settings file');
  
  try {
    const settingsFile = path.join(__dirname, 'user-settings.json');
    
    if (fs.existsSync(settingsFile)) {
      fs.unlinkSync(settingsFile);
      console.log('✅ User settings file deleted successfully');
    }
    
    return { success: true, message: 'Settings reset completed' };
  } catch (error) {
    console.error('❌ Error resetting settings:', error);
    return { success: false, error: error.message };
  }
});

// Handle onboarding reset
ipcMain.handle('reset-onboarding', async () => {
  console.log('reset-onboarding handler called');
  
  try {
    // For onboarding reset, we could delete a flag file or just return success
    // The actual onboarding reset logic is handled in the renderer
    return { success: true, message: 'Onboarding reset completed' };
    
  } catch (error) {
    console.error('❌ Error resetting onboarding:', error);
    return { success: false, error: error.message };
  }
});

// Handle LangGraph mood analysis
ipcMain.handle('analyze-mood-with-langgraph', async (event, moodEntry) => {
  console.log('analyze-mood-with-langgraph handler called');
  
  try {
    const result = await runMoodAnalysisFlow(moodEntry);
    console.log('✅ LangGraph analysis completed:', result.success ? 'success' : 'failed');
    
    return result;
  } catch (error) {
    console.error('❌ Error running LangGraph analysis:', error);
    return {
      success: false,
      insight: "✨ Every emotion you feel is valid and temporary. Take a deep breath, and remember that you're stronger than you know.",
      analysis: "LangGraph analysis failed",
      error: error.message
    };
  }
});

// Handle Spotify music recommendations
ipcMain.handle('get-spotify-recommendations', async (event, moodText) => {
  console.log('get-spotify-recommendations handler called for mood:', moodText);
  
  try {
    const recommendations = await getRecommendationsFromUserPlaylists(moodText);
    console.log('✅ Spotify recommendations retrieved:', recommendations.length, 'tracks');
    
    return {
      success: true,
      recommendations: recommendations.slice(0, 5) // Limit to 5 tracks for UI
    };
  } catch (error) {
    console.error('❌ Error getting Spotify recommendations:', error);
    return {
      success: false,
      recommendations: [],
      error: error.message
    };
  }
});

// Handle automation rule saving to Firebase with local fallback
ipcMain.handle('save-automation-rule', async (event, automationRule) => {
  console.log('save-automation-rule handler called');
  
  let localResult = { success: false };
  let firebaseResult = { success: false };
  
  // Always save to local file (fallback)
  try {
    const rulesFile = path.join(__dirname, 'automation-rules.json');
    
    // Read existing rules
    let automationRules = [];
    if (fs.existsSync(rulesFile)) {
      const data = fs.readFileSync(rulesFile, 'utf8');
      automationRules = JSON.parse(data);
    }
    
    // Add new rule
    automationRules.push(automationRule);
    
    // Write back to file
    fs.writeFileSync(rulesFile, JSON.stringify(automationRules, null, 2));
    
    localResult = { success: true, id: automationRule.id };
    console.log('✅ Local: Automation rule saved successfully:', automationRule.originalText);
  } catch (error) {
    console.error('❌ Local: Error saving automation rule:', error);
    localResult = { success: false, error: error.message };
  }
  
  // Try to save to Firebase (if connected)
  try {
    firebaseResult = await saveAutomationRuleToFirestore(automationRule);
  } catch (error) {
    console.error('❌ Firebase: Error saving automation rule:', error);
    firebaseResult = { success: false, error: error.message };
  }
  
  return {
    success: localResult.success || firebaseResult.success,
    local: localResult,
    firebase: firebaseResult,
    id: localResult.id || firebaseResult.id
  };
});

// Handle automation rules retrieval from Firebase with local fallback
ipcMain.handle('get-automation-rules', async () => {
  console.log('get-automation-rules handler called - trying Firebase first, then local fallback');
  
  // Try Firebase first (if connected)
  if (isFirebaseConnected) {
    try {
      const firebaseResult = await getAutomationRulesFromFirestore();
      if (firebaseResult.success && firebaseResult.data.length > 0) {
        console.log('✅ Firebase: Successfully loaded automation rules:', firebaseResult.data.length, 'rules');
        return firebaseResult.data;
      }
    } catch (error) {
      console.error('❌ Firebase: Error reading automation rules:', error);
    }
  }
  
  // Fallback to local file
  try {
    const rulesFile = path.join(__dirname, 'automation-rules.json');
    
    if (!fs.existsSync(rulesFile)) {
      console.log('📝 Local: No automation rules file found, returning empty array');
      return [];
    }
    
    const data = fs.readFileSync(rulesFile, 'utf8');
    const automationRules = JSON.parse(data);
    
    // Filter active rules
    const activeRules = automationRules.filter(rule => rule.isActive !== false);
    
    console.log('✅ Local: Successfully loaded automation rules from local file:', activeRules.length, 'active rules');
    return activeRules;
  } catch (error) {
    console.error('❌ Local: Error reading automation rules from local file:', error);
    return [];
  }
});

// Handle automation rule deletion
ipcMain.handle('delete-automation-rule', async (event, ruleId) => {
  console.log('delete-automation-rule handler called for rule:', ruleId);
  
  let localResult = { success: false };
  let firebaseResult = { success: false };
  
  // Update local file
  try {
    const rulesFile = path.join(__dirname, 'automation-rules.json');
    
    if (fs.existsSync(rulesFile)) {
      const data = fs.readFileSync(rulesFile, 'utf8');
      let automationRules = JSON.parse(data);
      
      // Mark rule as inactive instead of deleting
      automationRules = automationRules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive: false } : rule
      );
      
      // Write back to file
      fs.writeFileSync(rulesFile, JSON.stringify(automationRules, null, 2));
      
      localResult = { success: true, id: ruleId };
      console.log('✅ Local: Automation rule deactivated successfully:', ruleId);
    }
  } catch (error) {
    console.error('❌ Local: Error deactivating automation rule:', error);
    localResult = { success: false, error: error.message };
  }
  
  // Try to update Firebase (if connected)
  try {
    firebaseResult = await deleteAutomationRuleFromFirestore(ruleId);
  } catch (error) {
    console.error('❌ Firebase: Error deactivating automation rule:', error);
    firebaseResult = { success: false, error: error.message };
  }
  
  return {
    success: localResult.success || firebaseResult.success,
    local: localResult,
    firebase: firebaseResult,
    id: ruleId
  };
});

// Handle saving user team name
ipcMain.handle('save-user-team', async (event, teamName) => {
  console.log('save-user-team handler called for team:', teamName);
  
  const userId = os.userInfo().username || 'anonymous';
  
  let localResult = { success: false };
  let firebaseResult = { success: false };
  
  // Save to local file (fallback)
  try {
    const userSettingsFile = path.join(__dirname, 'user-settings.json');
    
    let userSettings = {};
    if (fs.existsSync(userSettingsFile)) {
      const data = fs.readFileSync(userSettingsFile, 'utf8');
      userSettings = JSON.parse(data);
    }
    
    // Add team name to user settings
    userSettings.teamName = teamName;
    userSettings.userId = userId;
    
    // Write back to file
    fs.writeFileSync(userSettingsFile, JSON.stringify(userSettings, null, 2));
    
    localResult = { success: true, userId, teamName };
    console.log('✅ Local: User team saved successfully:', teamName);
  } catch (error) {
    console.error('❌ Local: Error saving user team:', error);
    localResult = { success: false, error: error.message };
  }
  
  // Try to save to Firebase (if connected)
  try {
    firebaseResult = await saveUserTeamToFirestore(userId, teamName);
  } catch (error) {
    console.error('❌ Firebase: Error saving user team:', error);
    firebaseResult = { success: false, error: error.message };
  }
  
  return {
    success: localResult.success || firebaseResult.success,
    local: localResult,
    firebase: firebaseResult,
    userId,
    teamName
  };
});

// Handle getting user team name
ipcMain.handle('get-user-team', async () => {
  console.log('get-user-team handler called');
  
  const userId = os.userInfo().username || 'anonymous';
  
  // Try Firebase first (if connected)
  if (isFirebaseConnected) {
    try {
      const firebaseResult = await getUserTeamFromFirestore(userId);
      if (firebaseResult.success && firebaseResult.teamName) {
        console.log('✅ Firebase: User team retrieved:', firebaseResult.teamName);
        return { success: true, teamName: firebaseResult.teamName, userId };
      }
    } catch (error) {
      console.error('❌ Firebase: Error retrieving user team:', error);
    }
  }
  
  // Fallback to local file
  try {
    const userSettingsFile = path.join(__dirname, 'user-settings.json');
    
    if (!fs.existsSync(userSettingsFile)) {
      console.log('📝 Local: No user settings file found');
      return { success: true, teamName: null, userId };
    }
    
    const data = fs.readFileSync(userSettingsFile, 'utf8');
    const userSettings = JSON.parse(data);
    
    console.log('✅ Local: User team retrieved from local file:', userSettings.teamName);
    return { success: true, teamName: userSettings.teamName || null, userId };
  } catch (error) {
    console.error('❌ Local: Error reading user team from local file:', error);
    return { success: false, error: error.message, teamName: null, userId };
  }
});

// Handle getting team mood data
ipcMain.handle('get-team-mood-data', async (event, teamName) => {
  console.log('get-team-mood-data handler called for team:', teamName);
  
  if (!teamName) {
    return { success: false, error: 'No team name provided', data: [] };
  }
  
  // Try Firebase first (if connected)
  if (isFirebaseConnected) {
    try {
      const firebaseResult = await getTeamMoodDataFromFirestore(teamName);
      if (firebaseResult.success) {
        console.log('✅ Firebase: Team mood data retrieved:', firebaseResult.data.length, 'entries');
        return { success: true, data: firebaseResult.data };
      }
    } catch (error) {
      console.error('❌ Firebase: Error retrieving team mood data:', error);
    }
  }
  
  // Fallback: return empty data (team collaboration requires Firebase)
  console.log('⚠️ Team mood data requires Firebase connection');
  return { success: false, error: 'Team collaboration requires Firebase connection', data: [] };
});

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 