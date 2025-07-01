const { getRecommendationsFromUserPlaylists } = require('./spotifyRecommender.cjs');

// Async IIFE to test personalized Spotify recommendations
(async () => {
  console.log('🎧 Fetching your personalized Spotify recommendations...');
  console.log('=====================================================');
  
  try {
    // Test with a mood - you can change this to test different moods
    const testMood = '😊 Happy';
    console.log(`🎭 Testing mood: ${testMood}`);
    
    // Call the recommendation function with mood
    const recommendations = await getRecommendationsFromUserPlaylists(testMood);
    
    console.log('');
    console.log('🎉 SUCCESS! Here are your personalized recommendations:');
    console.log('=====================================================');
    
    // Display each recommendation in a readable format
    recommendations.forEach((track, index) => {
      console.log(`${index + 1}. ✅ ${track.name}`);
      console.log(`   🎤 Artist: ${track.artist}`);
      console.log(`   💿 Album: ${track.album}`);
      console.log(`   🔗 Spotify: ${track.spotifyUrl}`);
      console.log(`   ⭐ Popularity: ${track.popularity}/100`);
      console.log(`   ⏱️ Duration: ${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`);
      console.log('');
    });
    
    console.log(`🎵 Total recommendations: ${recommendations.length}`);
    console.log('✨ Enjoy your personalized music discovery!');
    
  } catch (error) {
    console.log('');
    console.log('❌ FAILED! Unable to fetch personalized recommendations');
    console.log('🚨 Error reason:', error.message);
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Make sure you\'ve run `node spotifyTest.js` first to authenticate');
    console.log('   2. Ensure your Spotify account has playlists with tracks');
    console.log('   3. Check that your .env file has valid Spotify credentials');
    console.log('   4. Verify you have an active internet connection');
    console.log('');
    console.log('🔄 Try running `node spotifyTest.js` first, then run this test again.');
  }
})(); 