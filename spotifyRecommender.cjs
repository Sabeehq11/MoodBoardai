const { getSpotifyApiInstance } = require('./spotifyAuth.js');

// Mood-based keyword mapping for better music recommendations
const moodKeywords = {
  'Happy': ['upbeat', 'celebrate', 'dance', 'party', 'energetic', 'joyful', 'fun'],
  'Sad': ['hopeful', 'comfort', 'healing', 'uplifting', 'gentle', 'soothing', 'positive'],
  'Angry': ['calm', 'relief', 'peaceful', 'chill', 'relaxing', 'meditation', 'zen'],
  'Frustrated': ['calm', 'peaceful', 'relief', 'breathe', 'relax', 'focus', 'zen'],
  'Excited': ['energetic', 'pump', 'motivation', 'power', 'dynamic', 'intense', 'drive'],
  'Anxious': ['calm', 'peaceful', 'soothing', 'comfort', 'gentle', 'relaxing', 'breathe'],
  'Tired': ['energizing', 'wake up', 'motivation', 'boost', 'revitalize', 'refresh', 'morning'],
  'Lonely': ['connection', 'warm', 'together', 'love', 'friendship', 'community', 'belonging'],
  'Motivated': ['workout', 'power', 'success', 'achievement', 'hustle', 'grind', 'champion'],
  'Neutral': ['discover', 'explore', 'variety', 'mix', 'eclectic', 'diverse', 'fresh'],
  'Grateful': ['thankful', 'blessed', 'appreciation', 'love', 'positive', 'joy', 'peaceful'],
  'Stressed': ['relax', 'calm', 'peaceful', 'unwind', 'meditation', 'spa', 'tranquil']
};

/**
 * Gets mood-appropriate keywords for search enhancement
 * @param {string} moodText - The mood text (e.g., "😊 Happy", "😔 Sad")
 * @returns {Array<string>} Array of keywords to enhance search
 */
function getMoodKeywords(moodText) {
  // Extract mood name from emoji format (e.g., "😊 Happy" -> "Happy")
  const moodName = moodText.replace(/^\S+\s+/, '').trim();
  
  // Return keywords for this mood, or default variety keywords
  return moodKeywords[moodName] || moodKeywords['Neutral'];
}

/**
 * Gets recommendations based on the user's existing playlists with mood filtering
 * Uses search functionality as a workaround since getRecommendations is not working
 * @param {string} userMood - The user's current mood (e.g., "😊 Happy")
 * @returns {Promise<Array>} Array of recommended tracks with name and artist
 */
async function getRecommendationsFromUserPlaylists(userMood = 'Neutral') {
  const spotifyApi = getSpotifyApiInstance();
  
  try {
    console.log('🎵 Getting personalized music recommendations...');
    console.log(`🎭 Filtering for mood: ${userMood}`);
    
    const moodKeywords = getMoodKeywords(userMood);
    console.log(`🔑 Using mood keywords: ${moodKeywords.slice(0, 3).join(', ')}...`);
    
    console.log('📋 Fetching user playlists...');
    const playlistsData = await spotifyApi.getUserPlaylists({ limit: 10 });
    const playlists = playlistsData.body.items;
    
    if (!playlists || playlists.length === 0) {
      throw new Error('No playlists found for this user');
    }
    
    console.log(`✅ Found ${playlists.length} playlists`);
    
    const sortedPlaylists = playlists
      .filter(playlist => {
        if (!playlist.tracks || typeof playlist.tracks.total !== 'number') {
          console.log(`⚠️ Skipping playlist "${playlist.name}" — total is undefined.`);
          return false;
        }
        return playlist.tracks.total > 0;
      })
      .sort((a, b) => {
        const aFollowers = (a.followers && typeof a.followers.total === 'number') ? a.followers.total : 0;
        const bFollowers = (b.followers && typeof b.followers.total === 'number') ? b.followers.total : 0;
        return bFollowers - aFollowers;
      })
      .slice(0, 3);
    
    console.log(`🔥 Selected ${sortedPlaylists.length} top playlists for analysis`);
    
    let artists = [];
    let genres = [];
    
    for (const playlist of sortedPlaylists) {
      try {
        console.log(`🎶 Analyzing tracks from "${playlist.name}"...`);
        const tracksData = await spotifyApi.getPlaylistTracks(playlist.id, { limit: 10 });
        
        if (!Array.isArray(tracksData?.body?.items)) {
          console.log(`⚠️ Skipping "${playlist.name}" due to missing track data.`);
          continue;
        }
        
        const tracks = tracksData.body.items
          .filter(item => item.track && item.track.artists)
          .map(item => item.track);
        
        // Extract artist names
        tracks.forEach(track => {
          track.artists.forEach(artist => {
            if (artist.name && !artists.includes(artist.name)) {
              artists.push(artist.name);
            }
          });
        });
        
      } catch (error) {
        console.log(`⚠️ Failed to fetch tracks from "${playlist.name}": ${error.message}`);
        continue;
      }
    }
    
    if (artists.length === 0) {
      throw new Error('No artists found in user playlists');
    }
    
    console.log(`🎯 Found ${artists.length} unique artists from playlists`);
    
    // Get recommendations by searching for tracks by these artists + mood keywords
    console.log('🔍 Finding similar tracks using search...');
    
    const recommendations = [];
    const shuffledArtists = artists.sort(() => 0.5 - Math.random()).slice(0, 4); // Reduced to make room for mood searches
    
    // First, search by artists (existing logic)
    for (const artistName of shuffledArtists) {
      try {
        console.log(`🔍 Searching for tracks by ${artistName}...`);
        const searchResults = await spotifyApi.searchTracks(`artist:"${artistName}"`, { limit: 4 });
        
        if (searchResults.body.tracks && searchResults.body.tracks.items) {
          const allTracks = searchResults.body.tracks.items;
          console.log(`   📍 Found ${allTracks.length} tracks for ${artistName}`);
          
          const tracks = allTracks.slice(0, 1); // Reduced to 1 per artist to make room for mood searches
          console.log(`   ✅ Added ${tracks.length} tracks to recommendations`);
          
          recommendations.push(...tracks);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (searchError) {
        console.log(`⚠️ Search failed for ${artistName}: ${searchError.message}`);
        continue;
      }
    }

    // Second, search using mood keywords for better recommendations
    console.log('🎭 Searching for mood-appropriate tracks...');
    const selectedMoodKeywords = moodKeywords.slice(0, 3); // Use first 3 keywords
    
    for (const keyword of selectedMoodKeywords) {
      try {
        console.log(`🔍 Searching for "${keyword}" tracks...`);
        const searchResults = await spotifyApi.searchTracks(`${keyword}`, { limit: 6 });
        
        if (searchResults.body.tracks && searchResults.body.tracks.items) {
          const allTracks = searchResults.body.tracks.items;
          console.log(`   📍 Found ${allTracks.length} "${keyword}" tracks`);
          
          // Filter tracks to avoid duplicates and get variety
          const newTracks = allTracks
            .filter(track => !recommendations.find(existing => existing.id === track.id))
            .slice(0, 2); // Take 2 tracks per keyword
            
          console.log(`   ✅ Added ${newTracks.length} new "${keyword}" tracks`);
          recommendations.push(...newTracks);
        }
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
        
      } catch (searchError) {
        console.log(`⚠️ Search failed for "${keyword}": ${searchError.message}`);
        continue;
      }
    }
    
    if (recommendations.length === 0) {
      throw new Error('No recommendations found using search method');
    }
    
    // Remove duplicates and format results
    const uniqueRecommendations = recommendations
      .filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      )
      .slice(0, 20);
    
    const formattedRecommendations = uniqueRecommendations.map(track => ({
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
      popularity: track.popularity,
      duration: Math.round(track.duration_ms / 1000)
    }));
    
    console.log('✅ SUCCESS! Generated personalized recommendations using search!');
    console.log(`🎉 Found ${formattedRecommendations.length} recommended tracks for mood: ${userMood}`);
    
    return formattedRecommendations;
    
  } catch (error) {
    console.log('❌ FAILED! Error getting recommendations:');
    console.error("🚨 Error:", error.message);
    console.log('');
    console.log('💡 Possible solutions:');
    console.log('   - Make sure you are authenticated with Spotify (run spotifyTest.js first)');
    console.log('   - Ensure your Spotify account has some playlists with tracks');
    console.log('   - Check your internet connection');
    
    throw error;
  }
}

/**
 * Gets recommendations based on specific seed parameters
 * @param {Object} options - Recommendation options
 * @param {Array<string>} options.genres - Array of genre seeds
 * @param {Array<string>} options.artists - Array of artist IDs
 * @param {Array<string>} options.tracks - Array of track IDs
 * @param {number} options.limit - Number of recommendations (default: 20)
 * @returns {Promise<Array>} Array of recommended tracks
 */
async function getRecommendationsBySeeds(options = {}) {
  const spotifyApi = getSpotifyApiInstance();
  
  try {
    const {
      genres = [],
      artists = [],
      tracks = [],
      limit = 20
    } = options;
    
    if (genres.length === 0 && artists.length === 0 && tracks.length === 0) {
      throw new Error('At least one seed (genre, artist, or track) is required');
    }
    
    console.log('🎵 Getting custom recommendations...');
    console.log(`🎯 Seeds - Genres: ${genres.length}, Artists: ${artists.length}, Tracks: ${tracks.length}`);
    
    const recommendationsData = await spotifyApi.getRecommendations({
      seed_genres: genres.slice(0, 5),
      seed_artists: artists.slice(0, 5),
      seed_tracks: tracks.slice(0, 5),
      limit: Math.min(limit, 100)
      // Removed market parameter to avoid regional restrictions
    });
    
    const recommendations = recommendationsData.body.tracks;
    
    const formattedRecommendations = recommendations.map(track => ({
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
      popularity: track.popularity,
      duration: Math.round(track.duration_ms / 1000)
    }));
    
    console.log(`✅ Generated ${formattedRecommendations.length} custom recommendations!`);
    
    return formattedRecommendations;
    
  } catch (error) {
    console.log('❌ FAILED! Error getting custom recommendations:');
    console.log('🚨 Error:', error.message);
    throw error;
  }
}

/**
 * Gets available genres for seeding recommendations
 * @returns {Promise<Array<string>>} Array of available genres
 */
async function getAvailableGenres() {
  const spotifyApi = getSpotifyApiInstance();
  
  try {
    console.log('🎼 Fetching available genres...');
    const genresData = await spotifyApi.getAvailableGenreSeeds();
    const genres = genresData.body.genres;
    
    console.log(`✅ Found ${genres.length} available genres`);
    return genres;
    
  } catch (error) {
    console.log('❌ FAILED! Error getting genres:');
    console.log('🚨 Error:', error.message);
    throw error;
  }
}

// Export all functions
module.exports = {
  getRecommendationsFromUserPlaylists,
  getRecommendationsBySeeds,
  getAvailableGenres,
  getMoodKeywords
};

// Test the recommendations function
if (require.main === module) {
  console.log('🚀 Testing recommendations...');
  getRecommendationsFromUserPlaylists()
    .then(recommendations => {
      console.log('✅ SUCCESS! Generated recommendations:');
      recommendations.forEach((track, index) => {
        console.log(`${index + 1}. ${track.name} by ${track.artist}`);
      });
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
    });
}