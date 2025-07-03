/**
 * Natural Language Mood Automation System
 * Parses user rules and executes actions based on mood entries
 */

/**
 * Parse a natural language automation rule
 * @param {string} ruleText - The rule text from user input
 * @returns {object|null} Parsed rule object or null if parsing fails
 */
function parseAutomationRule(ruleText) {
    if (!ruleText || typeof ruleText !== 'string') {
        return null;
    }
    
    // Clean and normalize the rule text
    const cleanText = ruleText.trim().toLowerCase()
        .replace(/[\.!]+$/, '') // Remove trailing punctuation
        .replace(/\s+/g, ' '); // Normalize whitespace
    
    // Enhanced patterns for more flexible rule parsing
    const patterns = [
        // Pattern 1: Various "if" constructions with flexible mood expressions
        {
            regex: /^(?:if|when|whenever)\s+i\s+(?:feel|am|'m|get|become|start\s+feeling)\s+([^,]+?)(?:,|\s+then)?\s*(.+)$/,
            moodIndex: 1,
            actionIndex: 2
        },
        // Pattern 2: Direct mood statements
        {
            regex: /^(?:if|when|whenever)\s+i'm\s+([^,]+?)(?:,|\s+then)?\s*(.+)$/,
            moodIndex: 1,
            actionIndex: 2
        },
        // Pattern 3: "I feel like" constructions
        {
            regex: /^(?:if|when|whenever)\s+i\s+feel\s+like\s+([^,]+?)(?:,|\s+then)?\s*(.+)$/,
            moodIndex: 1,
            actionIndex: 2
        },
        // Pattern 4: "I get" constructions
        {
            regex: /^(?:if|when|whenever)\s+i\s+get\s+([^,]+?)(?:,|\s+then)?\s*(.+)$/,
            moodIndex: 1,
            actionIndex: 2
        },
        // Pattern 5: More casual patterns without strict punctuation
        {
            regex: /^(?:if|when|whenever)\s+(?:i\s+)?(?:feel|am|'m|get|become)\s+([^\s]+(?:\s+[^\s]+)*?)\s+(?:then\s+)?(.+)$/,
            moodIndex: 1,
            actionIndex: 2
        },
        // Pattern 6: Simple "when [mood] [action]" format
        {
            regex: /^(?:when|if)\s+([^,\s]+(?:\s+[^,\s]+)*?)\s+(.+)$/,
            moodIndex: 1,
            actionIndex: 2
        }
    ];
    
    let match = null;
    let matchedPattern = null;
    
    for (const pattern of patterns) {
        match = cleanText.match(pattern.regex);
        if (match) {
            matchedPattern = pattern;
            break;
        }
    }
    
    if (!match || !matchedPattern) {
        return null;
    }
    
    const moodTrigger = match[matchedPattern.moodIndex];
    const actionPart = match[matchedPattern.actionIndex];
    
    // Parse mood trigger
    const mood = parseMoodTrigger(moodTrigger.trim());
    if (!mood) {
        return null;
    }
    
    // Parse action and time
    const actionInfo = parseActionAndTime(actionPart.trim());
    if (!actionInfo) {
        return null;
    }
    
    return {
        id: generateRuleId(),
        originalText: ruleText,
        mood: mood,
        action: actionInfo.action,
        time: actionInfo.time,
        actionType: actionInfo.actionType,
        duration: actionInfo.duration,
        activity: actionInfo.activity,
        content: actionInfo.content,
        music: actionInfo.music,
        createdAt: new Date().toISOString(),
        isActive: true
    };
}

/**
 * Parse mood trigger from text
 * @param {string} moodText - The mood part of the rule
 * @returns {string|null} Standardized mood or null if not recognized
 */
function parseMoodTrigger(moodText) {
    // Clean and normalize the mood text
    const cleanMood = moodText.trim().toLowerCase()
        .replace(/^(a\s+|really\s+|very\s+|super\s+|extremely\s+|quite\s+|pretty\s+|somewhat\s+|bit\s+|little\s+)/, '') // Remove intensifiers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[\.!,]$/, ''); // Remove trailing punctuation
    
    // Enhanced mood synonyms mapping with more variations
    const moodMappings = {
        // Happy variants
        'happy': 'happy',
        'good': 'happy',
        'great': 'happy',
        'joyful': 'happy',
        'cheerful': 'happy',
        'excited': 'happy',
        'positive': 'happy',
        'upbeat': 'happy',
        'elated': 'happy',
        'wonderful': 'happy',
        'fantastic': 'happy',
        'amazing': 'happy',
        'content': 'happy',
        'pleased': 'happy',
        'delighted': 'happy',
        'thrilled': 'happy',
        
        // Sad variants
        'sad': 'sad',
        'down': 'sad',
        'depressed': 'sad',
        'low': 'sad',
        'unhappy': 'sad',
        'blue': 'sad',
        'miserable': 'sad',
        'dejected': 'sad',
        'melancholy': 'sad',
        'gloomy': 'sad',
        'mournful': 'sad',
        'sorrowful': 'sad',
        'disappointed': 'sad',
        'heartbroken': 'sad',
        'devastated': 'sad',
        
        // Stressed variants
        'stressed': 'stressed',
        'anxious': 'stressed',
        'worried': 'stressed',
        'overwhelmed': 'stressed',
        'tense': 'stressed',
        'nervous': 'stressed',
        'panicked': 'stressed',
        'frantic': 'stressed',
        'pressured': 'stressed',
        'burdened': 'stressed',
        'strained': 'stressed',
        'agitated': 'stressed',
        'restless': 'stressed',
        'uneasy': 'stressed',
        'concerned': 'stressed',
        
        // Tired variants
        'tired': 'tired',
        'exhausted': 'tired',
        'drained': 'tired',
        'weary': 'tired',
        'fatigued': 'tired',
        'sleepy': 'tired',
        'worn out': 'tired',
        'burnt out': 'tired',
        'burned out': 'tired',
        'depleted': 'tired',
        'spent': 'tired',
        'drowsy': 'tired',
        'lethargic': 'tired',
        'sluggish': 'tired',
        
        // Frustrated variants
        'frustrated': 'frustrated',
        'angry': 'frustrated',
        'annoyed': 'frustrated',
        'irritated': 'frustrated',
        'mad': 'frustrated',
        'furious': 'frustrated',
        'livid': 'frustrated',
        'irate': 'frustrated',
        'enraged': 'frustrated',
        'upset': 'frustrated',
        'bothered': 'frustrated',
        'aggravated': 'frustrated',
        'exasperated': 'frustrated',
        'incensed': 'frustrated',
        
        // Neutral variants
        'neutral': 'neutral',
        'okay': 'neutral',
        'fine': 'neutral',
        'meh': 'neutral',
        'average': 'neutral',
        'normal': 'neutral',
        'alright': 'neutral',
        'so-so': 'neutral',
        'moderate': 'neutral',
        'stable': 'neutral',
        'balanced': 'neutral',
        'calm': 'neutral',
        'peaceful': 'neutral'
    };
    
    // First try direct mapping
    if (moodMappings[cleanMood]) {
        return moodMappings[cleanMood];
    }
    
    // Try partial matching for compound phrases
    for (const [phrase, mood] of Object.entries(moodMappings)) {
        if (cleanMood.includes(phrase) || phrase.includes(cleanMood)) {
            return mood;
        }
    }
    
    // Handle "feeling [adjective]" patterns
    const feelingMatch = cleanMood.match(/^feeling\s+(.+)$/);
    if (feelingMatch && moodMappings[feelingMatch[1]]) {
        return moodMappings[feelingMatch[1]];
    }
    
    // Handle "like [mood]" patterns  
    const likeMatch = cleanMood.match(/^like\s+(.+)$/);
    if (likeMatch && moodMappings[likeMatch[1]]) {
        return moodMappings[likeMatch[1]];
    }
    
    // Handle negative expressions
    const negativeMatch = cleanMood.match(/^(not|n't)\s+(.+)$/);
    if (negativeMatch) {
        const positiveMood = moodMappings[negativeMatch[2]];
        if (positiveMood === 'happy') return 'sad';
        if (positiveMood === 'sad') return 'happy';
        if (positiveMood === 'stressed') return 'neutral';
    }
    
    return null;
}

/**
 * Parse action and time from text
 * @param {string} actionText - The action part of the rule
 * @returns {object|null} Action information or null if not recognized
 */
function parseActionAndTime(actionText) {
    // Normalize the action text
    const normalizedText = actionText.trim().toLowerCase()
        .replace(/[\.!]+$/, '') // Remove trailing punctuation
        .replace(/\s+/g, ' '); // Normalize whitespace
    
    // Enhanced action patterns with more flexibility
    const actionPatterns = [
        // Calendar blocking - more flexible patterns
        {
            pattern: /(?:block|schedule|reserve|book)\s+(?:me\s+)?(?:for\s+)?(\d+)\s*(mins?|minutes?|hours?)\s+(?:for|to\s+do|to)\s+(.+?)(?:\s+(tomorrow|today|tonight|this\s+evening|later|in\s+the\s+morning|at\s+\d{1,2}(?::\d{2})?(?:am|pm)?))?\s*$/,
            type: 'calendar_block',
            parser: (match) => {
                const [, duration, unit, activity, time] = match;
                const durationMinutes = unit.startsWith('hour') ? parseInt(duration) * 60 : parseInt(duration);
                return {
                    action: `Block ${duration} ${unit} for ${activity}`,
                    actionType: 'calendar_block',
                    duration: durationMinutes,
                    activity: activity.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Alternative calendar blocking patterns
        {
            pattern: /(?:give\s+me|make|create)\s+(?:a\s+)?(\d+)\s*(mins?|minutes?|hours?)\s+(?:break|time|slot)\s+(?:for|to)\s+(.+?)(?:\s+(tomorrow|today|tonight|later))?\s*$/,
            type: 'calendar_block',
            parser: (match) => {
                const [, duration, unit, activity, time] = match;
                const durationMinutes = unit.startsWith('hour') ? parseInt(duration) * 60 : parseInt(duration);
                return {
                    action: `Block ${duration} ${unit} for ${activity}`,
                    actionType: 'calendar_block',
                    duration: durationMinutes,
                    activity: activity.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Reminders - enhanced patterns
        {
            pattern: /(?:remind|tell|alert)\s+me\s+(?:to\s+)?(.+?)(?:\s+(tomorrow|today|tonight|later|this\s+evening|in\s+the\s+morning|at\s+\d{1,2}(?::\d{2})?(?:am|pm)?))?\s*$/,
            type: 'reminder',
            parser: (match) => {
                const [, activity, time] = match;
                return {
                    action: `Remind me to ${activity}`,
                    actionType: 'reminder',
                    activity: activity.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Alternative reminder patterns
        {
            pattern: /(?:set|create)\s+(?:a\s+)?reminder\s+(?:to\s+)?(.+?)(?:\s+(tomorrow|today|tonight|later))?\s*$/,
            type: 'reminder',
            parser: (match) => {
                const [, activity, time] = match;
                return {
                    action: `Remind me to ${activity}`,
                    actionType: 'reminder',
                    activity: activity.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Send/suggest messages - enhanced patterns
        {
            pattern: /(?:send|give|show)\s+me\s+(?:some\s+)?(.+?)(?:\s+(tomorrow|today|tonight|later|this\s+evening|in\s+the\s+morning|at\s+\d{1,2}(?::\d{2})?(?:am|pm)?))?\s*$/,
            type: 'send_message',
            parser: (match) => {
                const [, content, time] = match;
                return {
                    action: `Send me ${content}`,
                    actionType: 'send_message',
                    content: content.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Suggest patterns
        {
            pattern: /(?:suggest|recommend|find)\s+(?:me\s+)?(?:some\s+)?(.+?)(?:\s+(tomorrow|today|tonight|later))?\s*$/,
            type: 'send_message',
            parser: (match) => {
                const [, content, time] = match;
                return {
                    action: `Suggest ${content}`,
                    actionType: 'send_message',
                    content: content.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Music/media patterns - enhanced
        {
            pattern: /(?:play|put\s+on|start)\s+(?:some\s+)?(.+?)(?:\s+music)?(?:\s+(tomorrow|today|tonight|later|now))?\s*$/,
            type: 'play_music',
            parser: (match) => {
                const [, music, time] = match;
                return {
                    action: `Play ${music}`,
                    actionType: 'play_music',
                    music: music.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Notification patterns
        {
            pattern: /(?:notify|ping|message)\s+me\s+(?:about|with|to)\s+(.+?)(?:\s+(tomorrow|today|tonight|later))?\s*$/,
            type: 'send_message',
            parser: (match) => {
                const [, content, time] = match;
                return {
                    action: `Notify me about ${content}`,
                    actionType: 'send_message',
                    content: content.trim(),
                    time: time || 'now'
                };
            }
        },
        
        // Generic action patterns as fallback
        {
            pattern: /(.+?)(?:\s+(tomorrow|today|tonight|later|now))?\s*$/,
            type: 'generic',
            parser: (match) => {
                const [, action, time] = match;
                // Try to determine action type from keywords
                const actionLower = action.toLowerCase();
                let actionType = 'generic';
                
                if (actionLower.includes('block') || actionLower.includes('schedule') || actionLower.includes('calendar')) {
                    actionType = 'calendar_block';
                } else if (actionLower.includes('remind') || actionLower.includes('alert')) {
                    actionType = 'reminder';
                } else if (actionLower.includes('send') || actionLower.includes('message') || actionLower.includes('quote')) {
                    actionType = 'send_message';
                } else if (actionLower.includes('play') || actionLower.includes('music')) {
                    actionType = 'play_music';
                }
                
                return {
                    action: action.trim(),
                    actionType: actionType,
                    activity: action.trim(),
                    content: action.trim(),
                    music: action.trim(),
                    time: time || 'now'
                };
            }
        }
    ];
    
    for (const {pattern, type, parser} of actionPatterns) {
        const match = normalizedText.match(pattern);
        if (match) {
            const result = parser(match);
            if (result) {
                return result;
            }
        }
    }
    
    return null;
}

/**
 * Generate a unique rule ID
 * @returns {string} Unique rule ID
 */
function generateRuleId() {
    return 'rule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Check if a mood matches an automation rule
 * @param {string} currentMood - Current mood (e.g., "😊 Happy")
 * @param {string} ruleMood - Rule mood trigger
 * @returns {boolean} True if mood matches
 */
function moodMatches(currentMood, ruleMood) {
    // Extract mood name from emoji format
    const moodName = currentMood.replace(/^\S+\s+/, '').trim().toLowerCase();
    
    // Direct match
    if (moodName === ruleMood) {
        return true;
    }
    
    // Check for mood family matches
    const moodFamilies = {
        'happy': ['happy', 'good', 'great', 'joyful', 'cheerful', 'excited'],
        'sad': ['sad', 'down', 'depressed', 'low', 'unhappy', 'blue'],
        'stressed': ['stressed', 'anxious', 'worried', 'overwhelmed', 'tense'],
        'tired': ['tired', 'exhausted', 'drained', 'weary', 'fatigued'],
        'frustrated': ['frustrated', 'angry', 'annoyed', 'irritated', 'mad'],
        'neutral': ['neutral', 'okay', 'fine', 'meh', 'average']
    };
    
    for (const [family, moods] of Object.entries(moodFamilies)) {
        if (moods.includes(moodName) && moods.includes(ruleMood)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Execute an automation action
 * @param {object} rule - The automation rule to execute
 * @param {object} moodEntry - The current mood entry
 * @returns {Promise<object>} Execution result
 */
async function executeAutomationAction(rule, moodEntry) {
    console.log(`🤖 Executing automation: ${rule.action}`);
    
    try {
        switch (rule.actionType) {
            case 'calendar_block':
                return await executeCalendarBlock(rule, moodEntry);
            case 'reminder':
                return await executeReminder(rule, moodEntry);
            case 'send_message':
                return await executeSendMessage(rule, moodEntry);
            case 'play_music':
                return await executePlayMusic(rule, moodEntry);
            default:
                return {
                    success: false,
                    error: `Unknown action type: ${rule.actionType}`
                };
        }
    } catch (error) {
        console.error('❌ Automation execution error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Execute calendar blocking action
 * @param {object} rule - The automation rule
 * @param {object} moodEntry - The current mood entry
 * @returns {Promise<object>} Execution result
 */
async function executeCalendarBlock(rule, moodEntry) {
    // Use existing calendar automation system
    const calendarConfig = {
        eventType: rule.activity || 'Automated Task',
        duration: rule.duration || 30,
        description: `Automated calendar block: ${rule.action}\nTriggered by mood: ${moodEntry.mood}\nRule: ${rule.originalText}`,
        color: '#4CAF50'
    };
    
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + calendarConfig.duration * 60 * 1000);
    
    const eventData = {
        title: `${calendarConfig.eventType} - MoodBoard AI Automation`,
        description: calendarConfig.description,
        startTime: currentTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: calendarConfig.duration,
        color: calendarConfig.color
    };
    
    // Mock implementation - in real app, this would use actual calendar API
    console.log(`📅 Created calendar block: ${rule.activity} (${rule.duration} minutes)`);
    
    return {
        success: true,
        action: 'calendar_block',
        message: `Calendar block created: ${rule.activity} for ${rule.duration} minutes`,
        eventData
    };
}

/**
 * Execute reminder action
 * @param {object} rule - The automation rule
 * @param {object} moodEntry - The current mood entry
 * @returns {Promise<object>} Execution result
 */
async function executeReminder(rule, moodEntry) {
    // Mock implementation - in real app, this would set up actual reminders
    console.log(`⏰ Reminder set: ${rule.activity} (${rule.time})`);
    
    return {
        success: true,
        action: 'reminder',
        message: `Reminder set: ${rule.activity} ${rule.time}`,
        reminderData: {
            activity: rule.activity,
            time: rule.time,
            mood: moodEntry.mood
        }
    };
}

/**
 * Execute send message action
 * @param {object} rule - The automation rule
 * @param {object} moodEntry - The current mood entry
 * @returns {Promise<object>} Execution result
 */
async function executeSendMessage(rule, moodEntry) {
    // Mock implementation - in real app, this would send actual messages/quotes
    console.log(`💌 Message scheduled: ${rule.content} (${rule.time})`);
    
    return {
        success: true,
        action: 'send_message',
        message: `Message scheduled: ${rule.content} ${rule.time}`,
        messageData: {
            content: rule.content,
            time: rule.time,
            mood: moodEntry.mood
        }
    };
}

/**
 * Execute play music action
 * @param {object} rule - The automation rule
 * @param {object} moodEntry - The current mood entry
 * @returns {Promise<object>} Execution result
 */
async function executePlayMusic(rule, moodEntry) {
    // Mock implementation - in real app, this would integrate with music services
    console.log(`🎵 Music scheduled: ${rule.music} (${rule.time})`);
    
    return {
        success: true,
        action: 'play_music',
        message: `Music scheduled: ${rule.music} ${rule.time}`,
        musicData: {
            music: rule.music,
            time: rule.time,
            mood: moodEntry.mood
        }
    };
}

/**
 * Validate automation rule text
 * @param {string} ruleText - The rule text to validate
 * @returns {object} Validation result with success boolean and error message
 */
function validateAutomationRule(ruleText) {
    if (!ruleText || typeof ruleText !== 'string') {
        return {
            success: false,
            error: 'Please enter a rule'
        };
    }
    
    const cleanText = ruleText.trim();
    if (cleanText.length === 0) {
        return {
            success: false,
            error: 'Please enter a rule'
        };
    }
    
    if (cleanText.length > 300) {
        return {
            success: false,
            error: 'Rule is too long (max 300 characters)'
        };
    }
    
    // Try to parse the rule
    const parsedRule = parseAutomationRule(cleanText);
    if (!parsedRule) {
        return {
            success: false,
            error: 'Could not understand the rule. Try examples like:\n• "If I feel stressed, remind me to take a break"\n• "When I\'m sad, send me motivational quotes"\n• "If I get tired, block 30 mins for rest"\n• "Whenever I\'m frustrated, suggest some music"'
        };
    }
    
    return {
        success: true,
        rule: parsedRule
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        parseAutomationRule,
        moodMatches,
        executeAutomationAction,
        validateAutomationRule
    };
} 