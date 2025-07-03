import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
const dotenvResult = dotenv.config();

let db = null;
let isFirebaseConnected = false;

// Initialize Firebase
function initializeFirebase() {
  try {
    // Debug dotenv loading
    if (dotenvResult.error) {
      console.log('⚠️ Firebase: .env file not found or error loading:', dotenvResult.error.message);
      console.log('📍 Firebase: Make sure .env file exists in project root');
    } else {
      console.log('✅ Firebase: .env file loaded successfully');
    }

    // Check if required environment variables exist
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID'
    ];

    // Debug each environment variable
    console.log('🔍 Firebase: Checking environment variables:');
    requiredEnvVars.forEach(varName => {
      const value = process.env[varName];
      console.log(`  ${varName}: ${value ? '✅ SET' : '❌ MISSING'}`);
    });

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️ Firebase: Missing environment variables:', missingVars.join(', '));
      console.log('📝 Firebase: Will fallback to local storage only');
      console.log('💡 Firebase: Create .env file in project root with your Firebase credentials');
      return false;
    }

    // Parse the private key (handle escaped newlines)
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    // Get Firestore instance
    db = getFirestore(app);
    isFirebaseConnected = true;
    
    console.log('✅ Firebase: Successfully connected to Firestore');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase: Failed to initialize:', error.message);
    console.log('📝 Firebase: Will fallback to local storage only');
    isFirebaseConnected = false;
    return false;
  }
}

// Test Firebase connection
async function testFirebaseConnection() {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping test');
    
    // Check if .env file exists and provide specific guidance
    if (dotenvResult.error) {
      console.log('❌ Firebase Test: .env file not found');
      console.log('💡 Firebase Test: Create .env file with your Firebase credentials');
      return false;
    }
    
    // Check which environment variables are missing
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log('❌ Firebase Test: Missing variables:', missingVars.join(', '));
    }
    
    return false;
  }

  try {
    // Try to write a test document
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test successful'
    };

    const docRef = await db.collection('test_connection').add(testData);
    console.log('✅ Firebase Test: Document written with ID:', docRef.id);

    // Clean up test document
    await docRef.delete();
    console.log('🧹 Firebase Test: Test document cleaned up');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase Test: Connection test failed:', error.message);
    return false;
  }
}

// Save mood entry to Firestore
async function saveMoodEntryToFirestore(moodEntry) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping Firestore save');
    return { success: false, reason: 'not_connected' };
  }

  try {
    const docRef = await db.collection('mood_entries').add({
      ...moodEntry,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Firebase: Mood entry saved to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to save mood entry:', error.message);
    return { success: false, error: error.message };
  }
}

// Get mood history from Firestore
async function getMoodHistoryFromFirestore() {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping Firestore retrieval');
    return { success: false, reason: 'not_connected', data: [] };
  }

  try {
    const snapshot = await db.collection('mood_entries')
      .orderBy('timestamp', 'desc')
      .get();
    
    const moodHistory = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      moodHistory.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to ISO string if needed
        timestamp: data.timestamp || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    console.log('✅ Firebase: Retrieved', moodHistory.length, 'mood entries from Firestore');
    return { success: true, data: moodHistory };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to retrieve mood history:', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

// Save automation rule to Firestore
async function saveAutomationRuleToFirestore(automationRule) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping automation rule save');
    return { success: false, reason: 'not_connected' };
  }

  try {
    const docRef = await db.collection('automationRules').add({
      ...automationRule,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Firebase: Automation rule saved to Firestore with ID:', docRef.id);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to save automation rule:', error.message);
    return { success: false, error: error.message };
  }
}

// Get automation rules from Firestore
async function getAutomationRulesFromFirestore() {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping automation rules retrieval');
    return { success: false, reason: 'not_connected', data: [] };
  }

  try {
    const snapshot = await db.collection('automationRules')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const automationRules = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      automationRules.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to ISO string if needed
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    console.log('✅ Firebase: Retrieved', automationRules.length, 'automation rules from Firestore');
    return { success: true, data: automationRules };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to retrieve automation rules:', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

// Delete automation rule from Firestore
async function deleteAutomationRuleFromFirestore(ruleId) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping automation rule deletion');
    return { success: false, reason: 'not_connected' };
  }

  try {
    await db.collection('automationRules').doc(ruleId).update({
      isActive: false,
      updatedAt: new Date()
    });
    
    console.log('✅ Firebase: Automation rule deactivated with ID:', ruleId);
    return { success: true, id: ruleId };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to deactivate automation rule:', error.message);
    return { success: false, error: error.message };
  }
}

// Save user team name to Firestore
async function saveUserTeamToFirestore(userId, teamName) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping team save');
    return { success: false, reason: 'not_connected' };
  }

  try {
    await db.collection('users').doc(userId).set({
      teamName: teamName,
      updatedAt: new Date()
    }, { merge: true });
    
    console.log('✅ Firebase: User team saved for user:', userId, 'team:', teamName);
    return { success: true, userId, teamName };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to save user team:', error.message);
    return { success: false, error: error.message };
  }
}

// Get user team name from Firestore
async function getUserTeamFromFirestore(userId) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping team retrieval');
    return { success: false, reason: 'not_connected', teamName: null };
  }

  try {
    const doc = await db.collection('users').doc(userId).get();
    
    if (doc.exists) {
      const data = doc.data();
      console.log('✅ Firebase: User team retrieved for user:', userId, 'team:', data.teamName);
      return { success: true, teamName: data.teamName || null };
    } else {
      console.log('📝 Firebase: No team found for user:', userId);
      return { success: true, teamName: null };
    }
    
  } catch (error) {
    console.error('❌ Firebase: Failed to retrieve user team:', error.message);
    return { success: false, error: error.message, teamName: null };
  }
}

// Get team mood data from Firestore for the past 7 days
async function getTeamMoodDataFromFirestore(teamName) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping team mood data retrieval');
    return { success: false, reason: 'not_connected', data: [] };
  }

  try {
    // Get all users in the team
    const usersSnapshot = await db.collection('users')
      .where('teamName', '==', teamName)
      .get();
    
    if (usersSnapshot.empty) {
      console.log('📝 Firebase: No users found in team:', teamName);
      return { success: true, data: [] };
    }

    const userIds = [];
    usersSnapshot.forEach(doc => {
      userIds.push(doc.id);
    });

    // Get mood entries from the past 7 days for all team members
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moodEntries = [];
    
    // Query mood entries for each user (Firestore doesn't support OR queries on different fields)
    for (const userId of userIds) {
      const moodSnapshot = await db.collection('mood_entries')
        .where('userId', '==', userId)
        .where('createdAt', '>=', sevenDaysAgo)
        .orderBy('createdAt', 'desc')
        .get();
      
      moodSnapshot.forEach(doc => {
        const data = doc.data();
        moodEntries.push({
          id: doc.id,
          ...data,
          userId: userId,
          timestamp: data.timestamp || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
    }
    
    console.log('✅ Firebase: Retrieved', moodEntries.length, 'team mood entries for team:', teamName);
    return { success: true, data: moodEntries };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to retrieve team mood data:', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

// Get shared mood entries for team feed
async function getSharedMoodEntriesFromFirestore() {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping shared mood entries retrieval');
    return { success: false, reason: 'not_connected', data: [] };
  }

  try {
    const snapshot = await db.collection('mood_entries')
      .where('shared', '==', true)
      .orderBy('timestamp', 'desc')
      .limit(50) // Limit to last 50 shared entries
      .get();
    
    const sharedEntries = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      sharedEntries.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to ISO string if needed
        timestamp: data.timestamp || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    console.log('✅ Firebase: Retrieved', sharedEntries.length, 'shared mood entries from Firestore');
    return { success: true, data: sharedEntries };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to retrieve shared mood entries:', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

// Save mood entry to teamFeed collection when shared
async function saveMoodEntryToTeamFeed(moodEntry) {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping teamFeed save');
    return { success: false, reason: 'not_connected' };
  }

  try {
    // Create team feed entry with essential data only
    const teamFeedEntry = {
      mood: moodEntry.mood,
      note: moodEntry.note || '',
      timestamp: moodEntry.timestamp,
      userId: moodEntry.userId,
      displayName: moodEntry.displayName || moodEntry.userId || 'Anonymous',
      createdAt: new Date()
    };

    const docRef = await db.collection('teamFeed').add(teamFeedEntry);
    
    console.log('✅ Firebase: Mood entry saved to teamFeed with ID:', docRef.id);
    return { success: true, id: docRef.id };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to save mood entry to teamFeed:', error.message);
    return { success: false, error: error.message };
  }
}

// Get team feed entries from teamFeed collection
async function getTeamFeedEntriesFromFirestore() {
  if (!isFirebaseConnected || !db) {
    console.log('⚠️ Firebase: Not connected, skipping teamFeed retrieval');
    return { success: false, reason: 'not_connected', data: [] };
  }

  try {
    // Try with orderBy first
    let snapshot;
    try {
      snapshot = await db.collection('teamFeed')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
    } catch (indexError) {
      console.log('⚠️ Firebase: OrderBy query failed (likely needs index), trying fallback query:', indexError.message);
      
      // Fallback: query without orderBy (will sort in client)
      snapshot = await db.collection('teamFeed')
        .limit(50)
        .get();
    }
    
    const teamFeedEntries = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      teamFeedEntries.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamp to ISO string if needed
        timestamp: data.timestamp || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      });
    });
    
    // Sort on client side if we used fallback query
    teamFeedEntries.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.timestamp);
      const bTime = new Date(b.createdAt || b.timestamp);
      return bTime - aTime; // Newest first
    });
    
    console.log('✅ Firebase: Retrieved', teamFeedEntries.length, 'team feed entries from Firestore');
    return { success: true, data: teamFeedEntries };
    
  } catch (error) {
    console.error('❌ Firebase: Failed to retrieve team feed entries:', error.message);
    return { success: false, error: error.message, data: [] };
  }
}

// Initialize Firebase when module loads
initializeFirebase();

export {
  initializeFirebase,
  testFirebaseConnection,
  saveMoodEntryToFirestore,
  getMoodHistoryFromFirestore,
  saveAutomationRuleToFirestore,
  getAutomationRulesFromFirestore,
  deleteAutomationRuleFromFirestore,
  saveUserTeamToFirestore,
  getUserTeamFromFirestore,
  getTeamMoodDataFromFirestore,
  getSharedMoodEntriesFromFirestore,
  saveMoodEntryToTeamFeed,
  getTeamFeedEntriesFromFirestore,
  isFirebaseConnected
}; 