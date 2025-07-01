import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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
// Handle mood entry logging with local file storage
ipcMain.handle('log-mood-entry', async (event, moodEntryObject) => {
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
    
    console.log('Mood entry logged successfully:', moodEntryObject.mood, '-', moodEntryObject.timestamp);
    return { success: true, id: moodEntryObject.timestamp };
  } catch (error) {
    console.error('Error logging mood entry:', error);
    return { success: false, error: error.message };
  }
});

// Handle mood history retrieval from local file
ipcMain.handle('get-mood-history', async () => {
  console.log('get-mood-history handler called - retrieving from local file');
  
  try {
    const moodHistoryFile = path.join(__dirname, 'mood-history.json');
    
    if (!fs.existsSync(moodHistoryFile)) {
      console.log('No mood history file found, returning empty array');
      return [];
    }
    
    const data = fs.readFileSync(moodHistoryFile, 'utf8');
    const moodHistory = JSON.parse(data);
    
    console.log('Successfully loaded mood history from local file:', moodHistory.length, 'entries');
    return moodHistory;
  } catch (error) {
    console.error('Error reading mood history from local file:', error);
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