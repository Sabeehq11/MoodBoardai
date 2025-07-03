/**
 * Test file for Natural Language Mood Automation
 * Run this to test the automation parsing and execution logic
 */

// Import the automation module (for Node.js testing)
const fs = require('fs');
const path = require('path');

// Read the automation module content
const automationCode = fs.readFileSync(path.join(__dirname, 'moodAutomation.js'), 'utf8');

// Create a mock environment and execute the code
const moduleCode = automationCode.replace('if (typeof module !== \'undefined\' && module.exports)', 'if (true)');
eval(moduleCode);

// Access the exported functions
const { parseAutomationRule, moodMatches, validateAutomationRule } = module.exports;

console.log('🧪 Testing Natural Language Mood Automation');
console.log('============================================');

// Test cases for rule parsing - enhanced with more natural variations
const testRules = [
    // Original patterns
    "If I feel stressed, block 30 mins for deep breathing tomorrow",
    "If I'm sad, send me motivational quotes at 10am",
    "If I'm tired, remind me to sleep early tonight", 
    "When I feel frustrated, block 1 hour for journaling",
    "When I'm happy, play upbeat music",
    
    // Enhanced natural language variations
    "If I get stressed, remind me to take a break",
    "When I become overwhelmed, suggest some relaxing music",
    "If I start feeling anxious, block 15 minutes for meditation",
    "Whenever I'm really sad, send me some motivational quotes",
    "If I feel like I'm exhausted, give me 30 mins for rest",
    "When I get frustrated, tell me to do some deep breathing",
    "If I'm feeling down, play some upbeat music",
    "Whenever I feel burnt out, schedule me a 1 hour break",
    "If I'm super happy, remind me to share the good vibes",
    "When I feel overwhelmed, notify me about taking a walk",
    
    // Casual and flexible phrasings
    "if stressed then block 20 mins for meditation",
    "when tired remind me sleep early",
    "whenever sad suggest motivational content",
    "if happy play energetic music",
    "when frustrated create a 30 min break",
    
    // Should fail
    "Invalid rule that should fail",
    "Just some random text without structure",
    "",
    
    // Edge cases
    "If I'm not happy, send me encouraging messages",
    "When I feel really very stressed, block time for relaxation"
];

console.log('\n📝 Testing Rule Parsing:');
console.log('------------------------');

testRules.forEach((ruleText, index) => {
    console.log(`\nTest ${index + 1}: "${ruleText}"`);
    
    const validation = validateAutomationRule(ruleText);
    if (validation.success) {
        const parsed = validation.rule;
        console.log('✅ Parsed successfully:');
        console.log(`   Mood: ${parsed.mood}`);
        console.log(`   Action: ${parsed.action}`);
        console.log(`   Type: ${parsed.actionType}`);
        console.log(`   Time: ${parsed.time}`);
        if (parsed.duration) console.log(`   Duration: ${parsed.duration} minutes`);
    } else {
        console.log('❌ Parsing failed:', validation.error);
    }
});

console.log('\n🎯 Testing Mood Matching:');
console.log('-------------------------');

const testMoods = [
    // Basic matches
    { current: '😊 Happy', rule: 'happy' },
    { current: '😔 Sad', rule: 'sad' },
    { current: '😫 Tired', rule: 'tired' },
    { current: '😠 Frustrated', rule: 'frustrated' },
    
    // Should not match
    { current: '😊 Happy', rule: 'stressed' },
    
    // Synonym matches - should work
    { current: '😔 Sad', rule: 'down' },
    { current: '😫 Tired', rule: 'exhausted' },
    { current: '😠 Frustrated', rule: 'angry' },
    { current: '😊 Happy', rule: 'excited' },
    
    // Extended synonyms
    { current: '😫 Tired', rule: 'burnt out' },
    { current: '😔 Sad', rule: 'devastated' },
    { current: '😠 Frustrated', rule: 'livid' },
    { current: '😊 Happy', rule: 'thrilled' },
    
    // Mood family matches
    { current: '😊 Happy', rule: 'positive' },
    { current: '😔 Sad', rule: 'miserable' },
    { current: '😫 Tired', rule: 'depleted' },
    { current: '😠 Frustrated', rule: 'aggravated' },
];

testMoods.forEach(({ current, rule }, index) => {
    const matches = moodMatches(current, rule);
    console.log(`Test ${index + 1}: "${current}" vs "${rule}" -> ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
});

console.log('\n📊 Test Summary:');
console.log('----------------');

const successfulParses = testRules.filter(rule => {
    const validation = validateAutomationRule(rule);
    return validation.success;
});

console.log(`✅ Successfully parsed: ${successfulParses.length}/${testRules.length} rules`);
console.log(`✅ Mood matching tests completed`);

console.log('\n🚀 Example Automation Flow:');
console.log('----------------------------');

// Simulate a mood entry triggering automation
const sampleMoodEntry = {
    mood: '😫 Tired',
    note: 'exhausted after work',
    timestamp: new Date().toISOString()
};

const sampleRule = parseAutomationRule("If I feel tired, block 30 mins for rest tomorrow");
if (sampleRule) {
    console.log(`📝 Rule: "${sampleRule.originalText}"`);
    console.log(`🎭 Mood Entry: ${sampleMoodEntry.mood}`);
    console.log(`🎯 Match: ${moodMatches(sampleMoodEntry.mood, sampleRule.mood) ? 'YES' : 'NO'}`);
    
    if (moodMatches(sampleMoodEntry.mood, sampleRule.mood)) {
        console.log('🤖 Would execute action:', sampleRule.action);
    }
}

console.log('\n✅ All tests completed!');
console.log('\n💡 Enhanced Usage Examples:');
console.log('\n🎯 Trigger Variations:');
console.log('   • "If I feel..." / "If I\'m..." / "If I get..."');
console.log('   • "When I feel..." / "When I\'m..." / "When I become..."');
console.log('   • "Whenever I..." / "If I start feeling..."');

console.log('\n🎭 Mood Expressions:');
console.log('   • Basic: "happy", "sad", "tired", "stressed", "frustrated"');
console.log('   • Synonyms: "exhausted", "overwhelmed", "livid", "thrilled"');
console.log('   • Phrases: "burnt out", "worn out", "feeling down"');
console.log('   • Intensifiers: "really sad", "super happy", "very tired"');

console.log('\n🎬 Action Types:');
console.log('   • Calendar: "block 30 mins for...", "schedule me a break"');
console.log('   • Reminders: "remind me to...", "tell me to...", "alert me about..."');
console.log('   • Messages: "send me...", "suggest...", "notify me about..."');
console.log('   • Music: "play...", "put on some...", "start playing..."');

console.log('\n📝 Complete Examples:');
console.log('   • "If I get stressed, remind me to take a break"');
console.log('   • "When I\'m feeling overwhelmed, block 30 mins for meditation"');
console.log('   • "Whenever I\'m really sad, send me motivational quotes"');
console.log('   • "If I become frustrated, suggest some calming music"');
console.log('   • "When I feel burnt out, schedule me a 1 hour rest"'); 