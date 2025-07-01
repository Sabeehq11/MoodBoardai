import { getSpotifyAccessToken } from './spotifyAuth.js';

console.log('🎵 Testing Spotify Authentication...');
console.log('==========================================');

async function testSpotifyAuth() {
  try {
    console.log('📱 Starting Spotify OAuth flow...');
    
    const accessToken = await getSpotifyAccessToken();
    
    console.log('✅ SUCCESS! Spotify authentication completed!');
    console.log('🔑 Access Token:', accessToken.substring(0, 20) + '...');
    console.log('🎉 You can now use Spotify API features!');
    
  } catch (error) {
    console.log('❌ FAILED! Spotify authentication error:');
    console.log('🚨 Error:', error.message);
    console.log('');
    console.log('💡 Please check:');
    console.log('   - Your .env file has SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI');
    console.log('   - Your Spotify app is configured with the correct redirect URI');
    console.log('   - You have an active internet connection');
  }
}

// Run the test
testSpotifyAuth(); 