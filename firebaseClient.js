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

// Initialize Firebase when module loads
initializeFirebase();

export {
  initializeFirebase,
  testFirebaseConnection,
  saveMoodEntryToFirestore,
  getMoodHistoryFromFirestore,
  isFirebaseConnected
}; 