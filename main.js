import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  saveMoodEntryToFirestore, 
  getMoodHistoryFromFirestore,
  isFirebaseConnected 
} from './firebaseClient.js';
import { runMoodAnalysisFlow } from './langgraphFlow.js';

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
    moodHistory.push(moodEntryObject);
    
    // Write back to file
    fs.writeFileSync(moodHistoryFile, JSON.stringify(moodHistory, null, 2));
    
    localResult = { success: true, id: moodEntryObject.timestamp };
    console.log('✅ Local: Mood entry logged successfully:', moodEntryObject.mood, '-', moodEntryObject.timestamp);
  } catch (error) {
    console.error('❌ Local: Error logging mood entry:', error);
    localResult = { success: false, error: error.message };
  }

  // Try to save to Firebase (if connected)
  try {
    firebaseResult = await saveMoodEntryToFirestore(moodEntryObject);
  } catch (error) {
    console.error('❌ Firebase: Error logging mood entry:', error);
    firebaseResult = { success: false, error: error.message };
  }

  // Return combined result
  return {
    success: localResult.success || firebaseResult.success,
    local: localResult,
    firebase: firebaseResult,
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