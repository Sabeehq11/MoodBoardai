import SpotifyWebApi from 'spotify-web-api-node';
import express from 'express';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Token file path
const TOKEN_FILE_PATH = path.join(process.cwd(), 'spotify_tokens.json');

// Initialize Spotify API with credentials from environment variables
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

/**
 * Saves Spotify tokens to local file
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @param {number} expiresIn - Token expiration time in seconds
 */
function saveTokensToFile(accessToken, refreshToken, expiresIn) {
  try {
    const tokenData = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
      saved_at: Date.now()
    };
    
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2));
    console.log('💾 Spotify tokens saved to file');
  } catch (error) {
    console.error('Failed to save tokens to file:', error.message);
  }
}

/**
 * Loads Spotify tokens from local file
 * @returns {Object|null} Token data or null if file doesn't exist
 */
function loadTokensFromFile() {
  try {
    if (!fs.existsSync(TOKEN_FILE_PATH)) {
      return null;
    }
    
    const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));
    console.log('📂 Spotify tokens loaded from file');
    return tokenData;
  } catch (error) {
    console.error('Failed to load tokens from file:', error.message);
    return null;
  }
}

/**
 * Initializes Spotify API with saved tokens if available
 * @returns {boolean} True if tokens were loaded and applied, false otherwise
 */
export function initializeSpotifyTokens() {
  const tokenData = loadTokensFromFile();
  
  if (!tokenData) {
    console.log('🔑 No saved Spotify tokens found');
    return false;
  }
  
  // Check if token is expired (with 5 minute buffer)
  const tokenAge = (Date.now() - tokenData.saved_at) / 1000;
  const expiresIn = tokenData.expires_in || 3600;
  
  if (tokenAge >= (expiresIn - 300)) {
    console.log('⏰ Saved tokens are expired');
    return false;
  }
  
  // Apply tokens to API instance
  spotifyApi.setAccessToken(tokenData.access_token);
  spotifyApi.setRefreshToken(tokenData.refresh_token);
  
  console.log('✅ Spotify tokens applied from saved file');
  console.log(`🕐 Token expires in ${Math.round((expiresIn - tokenAge) / 60)} minutes`);
  
  return true;
}

/**
 * Generates the Spotify authorization URL with required scopes
 * @returns {string} Authorization URL
 */
function getAuthorizationUrl() {
  const scopes = [
    'user-read-private',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-top-read'
  ];
  
  const state = Math.random().toString(36).substring(7);
  
  return spotifyApi.createAuthorizeURL(scopes, state);
}

/**
 * Opens the given URL in the default browser
 * @param {string} url - URL to open
 */
function openUrlInBrowser(url) {
  const command = process.platform === 'win32' ? 'start' : 
                  process.platform === 'darwin' ? 'open' : 'xdg-open';
  
  exec(`${command} "${url}"`, (error) => {
    if (error) {
      console.error('Error opening browser:', error);
      console.log('Please manually open this URL in your browser:');
      console.log(url);
    }
  });
}

/**
 * Sets up a temporary Express server to handle the OAuth callback
 * @returns {Promise<string>} Promise that resolves with the authorization code
 */
function setupCallbackServer() {
  return new Promise((resolve, reject) => {
    const app = express();
    let server;

    // Parse the callback URL to get the port
    const callbackUrl = new URL(process.env.SPOTIFY_REDIRECT_URI);
    const port = callbackUrl.port || 3000;

    app.get('/callback', (req, res) => {
      const { code, error } = req.query;

      if (error) {
        res.send(`
          <html>
            <body>
              <h1>Authentication Error</h1>
              <p>Error: ${error}</p>
              <p>You can close this window.</p>
            </body>
          </html>
        `);
        server.close();
        reject(new Error(`Spotify authentication error: ${error}`));
        return;
      }

      if (code) {
        res.send(`
          <html>
            <body>
              <h1>Authentication Successful!</h1>
              <p>You have successfully authenticated with Spotify.</p>
              <p>You can close this window and return to the application.</p>
              <script>
                setTimeout(() => {
                  window.close();
                }, 3000);
              </script>
            </body>
          </html>
        `);
        server.close();
        resolve(code);
      } else {
        res.send(`
          <html>
            <body>
              <h1>Authentication Error</h1>
              <p>No authorization code received.</p>
              <p>You can close this window.</p>
            </body>
          </html>
        `);
        server.close();
        reject(new Error('No authorization code received'));
      }
    });

    server = app.listen(port, (err) => {
      if (err) {
        reject(new Error(`Failed to start callback server: ${err.message}`));
      } else {
        console.log(`Callback server listening on port ${port}`);
      }
    });

    // Set a timeout to prevent hanging
    setTimeout(() => {
      if (server) {
        server.close();
        reject(new Error('Authentication timeout - no response received within 5 minutes'));
      }
    }, 300000); // 5 minutes timeout
  });
}

/**
 * Main function to authenticate with Spotify and get access token
 * @returns {Promise<string>} Promise that resolves with the access token
 */
export async function getSpotifyAccessToken() {
  try {
    // Validate environment variables
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REDIRECT_URI) {
      throw new Error('Missing required environment variables: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, or SPOTIFY_REDIRECT_URI');
    }

    console.log('Starting Spotify authentication...');
    
    // Generate authorization URL
    const authUrl = getAuthorizationUrl();
    console.log('Opening Spotify authorization URL in browser...');
    
    // Open browser and set up callback server
    openUrlInBrowser(authUrl);
    
    // Wait for callback with authorization code
    console.log('Waiting for user authorization...');
    const authorizationCode = await setupCallbackServer();
    
    console.log('Authorization code received, exchanging for access token...');
    
    // Exchange authorization code for access token
    const data = await spotifyApi.authorizationCodeGrant(authorizationCode);
    
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];
    
    // Set the access token on the API instance
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    
    // Save tokens to file for persistence
    saveTokensToFile(accessToken, refreshToken, expiresIn);
    
    console.log('Spotify authentication successful!');
    console.log(`Access token expires in ${expiresIn} seconds`);
    
    return accessToken;
    
  } catch (error) {
    console.error('Spotify authentication failed:', error.message);
    throw error;
  }
}

/**
 * Get the configured Spotify API instance
 * @returns {SpotifyWebApi} Configured Spotify API instance
 */
export function getSpotifyApiInstance() {
  return spotifyApi;
}

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<string>} Promise that resolves with the new access token
 */
export async function refreshSpotifyToken() {
  try {
    console.log('Refreshing Spotify access token...');
    const data = await spotifyApi.refreshAccessToken();
    
    const newAccessToken = data.body['access_token'];
    const newRefreshToken = data.body['refresh_token'] || spotifyApi.getRefreshToken();
    const expiresIn = data.body['expires_in'] || 3600;
    
    spotifyApi.setAccessToken(newAccessToken);
    if (data.body['refresh_token']) {
      spotifyApi.setRefreshToken(newRefreshToken);
    }
    
    // Save updated tokens to file
    saveTokensToFile(newAccessToken, newRefreshToken, expiresIn);
    
    console.log('Access token refreshed successfully');
    return newAccessToken;
    
  } catch (error) {
    console.error('Failed to refresh access token:', error.message);
    throw error;
  }
}

// Initialize tokens on module load
initializeSpotifyTokens(); 