import { processCalendarAutomation, getMoodCalendarConfig } from './calendarAutomation.js';

// Test the mood mapping
console.log('🧪 Testing Calendar Automation Module');
console.log('=====================================');

console.log('\n📝 Testing mood mappings:');
console.log('Happy mood:', getMoodCalendarConfig('😊 Happy'));
console.log('Tired mood:', getMoodCalendarConfig('😫 Tired'));
console.log('Neutral mood:', getMoodCalendarConfig('😐 Neutral'));
console.log('Frustrated mood:', getMoodCalendarConfig('😠 Frustrated'));
console.log('Non-existent mood:', getMoodCalendarConfig('😴 Sleepy'));

// Test calendar automation (mock)
console.log('\n🧪 Testing calendar automation:');

const testMoodEntry = {
  mood: '😊 Happy',
  note: 'feeling great today!',
  timestamp: new Date().toISOString()
};

const testSettings = { calendarAutomation: true };

processCalendarAutomation(testMoodEntry, testSettings).then(result => {
  console.log('✅ Calendar automation result:', result);
  
  // Test with disabled setting
  console.log('\n🧪 Testing with disabled calendar automation:');
  const disabledSettings = { calendarAutomation: false };
  
  return processCalendarAutomation(testMoodEntry, disabledSettings);
}).then(result => {
  console.log('🔇 Disabled calendar automation result:', result);
  
  // Test with low energy mood
  console.log('\n🧪 Testing with low energy mood:');
  const tiredMoodEntry = {
    mood: '😫 Tired',
    note: 'exhausted after work',
    timestamp: new Date().toISOString()
  };
  
  return processCalendarAutomation(tiredMoodEntry, testSettings);
}).then(result => {
  console.log('😴 Low energy mood result:', result);
  
  console.log('\n✅ All tests completed!');
}).catch(error => {
  console.error('❌ Test error:', error);
}); 