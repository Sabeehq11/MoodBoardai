/**
 * Calendar Automation Module
 * Automatically creates calendar events based on mood entries
 */

// Mood-to-calendar event mapping
const MOOD_CALENDAR_MAPPING = {
  // High energy moods → Deep Work sessions
  'Happy': { 
    eventType: 'Deep Work', 
    duration: 60, // 1 hour
    description: 'Focused work session - high energy mood detected',
    color: '#4CAF50' // Green
  },
  'Excited': { 
    eventType: 'Deep Work', 
    duration: 60,
    description: 'Focused work session - high energy mood detected',
    color: '#FF9800' // Orange
  },
  'Motivated': { 
    eventType: 'Deep Work', 
    duration: 60,
    description: 'Focused work session - high energy mood detected',
    color: '#2196F3' // Blue
  },
  'Energetic': { 
    eventType: 'Deep Work', 
    duration: 60,
    description: 'Focused work session - high energy mood detected',
    color: '#4CAF50' // Green
  },
  
  // Low energy moods → Rest breaks  
  'Tired': { 
    eventType: 'Rest', 
    duration: 15, // 15 minutes
    description: 'Rest break - low energy mood detected',
    color: '#9C27B0' // Purple
  },
  'Stressed': { 
    eventType: 'Rest', 
    duration: 15,
    description: 'Rest break - low energy mood detected',
    color: '#F44336' // Red
  },
  'Overwhelmed': { 
    eventType: 'Rest', 
    duration: 15,
    description: 'Rest break - low energy mood detected',
    color: '#FF5722' // Deep Orange
  },
  'Exhausted': { 
    eventType: 'Rest', 
    duration: 15,
    description: 'Rest break - low energy mood detected',
    color: '#795548' // Brown
  },
  'Frustrated': { 
    eventType: 'Rest', 
    duration: 15,
    description: 'Rest break - low energy mood detected',
    color: '#FF5722' // Deep Orange
  },
  'Sad': { 
    eventType: 'Rest', 
    duration: 15,
    description: 'Rest break - low energy mood detected',
    color: '#607D8B' // Blue Grey
  },
  
  // Neutral moods → Optional gentle activity
  'Neutral': { 
    eventType: 'Mindful Break', 
    duration: 10, // 10 minutes
    description: 'Mindful moment - neutral mood detected',
    color: '#FFC107' // Amber
  }
};

/**
 * Extract mood name from emoji format (e.g., "😊 Happy" -> "Happy")
 * @param {string} moodText - The mood text with emoji
 * @returns {string} The mood name
 */
function extractMoodName(moodText) {
  return moodText.replace(/^\S+\s+/, '').trim();
}

/**
 * Get calendar event configuration for a mood
 * @param {string} moodText - The mood text (e.g., "😊 Happy")
 * @returns {object|null} Calendar event configuration or null if no mapping
 */
function getMoodCalendarConfig(moodText) {
  const moodName = extractMoodName(moodText);
  return MOOD_CALENDAR_MAPPING[moodName] || null;
}

/**
 * Mock Google Calendar API - Create Calendar Event
 * In a real implementation, this would use the Google Calendar API
 * @param {object} eventData - Event data
 * @returns {Promise<object>} Mock response
 */
async function createGoogleCalendarEvent(eventData) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Mock success response (90% success rate)
  const success = Math.random() < 0.9;
  
  if (success) {
    const mockEventId = `mock_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Format the time display for the simulation message
    const startTime = new Date(eventData.startTime);
    const endTime = new Date(eventData.endTime);
    
    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };
    
    const startTimeStr = formatTime(startTime);
    const endTimeStr = formatTime(endTime);
    
    // Extract mood name from the title (assumes title format includes mood info)
    const moodMatch = eventData.description.match(/Mood: ([^\\n]+)/);
    const moodName = moodMatch ? moodMatch[1] : 'Unknown';
    
    console.log(`📆 Created calendar block from ${startTimeStr}–${endTimeStr} for mood: "${moodName}"`);
    
    return {
      success: true,
      eventId: mockEventId,
      htmlLink: `https://calendar.google.com/calendar/event?eid=${mockEventId}`,
      ...eventData
    };
  } else {
    console.error('📅 Mock Calendar: Failed to create event', eventData);
    return {
      success: false,
      error: 'Mock API failure - please try again',
      eventData
    };
  }
}

/**
 * Create calendar event based on mood entry
 * @param {object} moodEntry - Mood entry object
 * @param {object} userSettings - User settings (to check if calendar automation is enabled)
 * @returns {Promise<object>} Calendar creation result
 */
async function processCalendarAutomation(moodEntry, userSettings) {
  try {
    // Check if calendar automation is enabled
    if (!userSettings?.calendarAutomation) {
      console.log('📅 Calendar automation is disabled - skipping');
      return { success: false, reason: 'disabled' };
    }
    
    // Get calendar configuration for this mood
    const calendarConfig = getMoodCalendarConfig(moodEntry.mood);
    
    if (!calendarConfig) {
      console.log('📅 No calendar automation configured for mood:', moodEntry.mood);
      return { success: false, reason: 'no_mapping' };
    }
    
    // Create calendar event data
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + calendarConfig.duration * 60 * 1000);
    
    const eventData = {
      title: `${calendarConfig.eventType} - MoodBoard AI`,
      description: `${calendarConfig.description}\n\nMood: ${moodEntry.mood}\nNote: ${moodEntry.note || 'No note'}\nCreated automatically by MoodBoard AI`,
      startTime: currentTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: calendarConfig.duration,
      color: calendarConfig.color,
      location: '',
      reminders: calendarConfig.eventType === 'Deep Work' ? [{ method: 'popup', minutes: 5 }] : []
    };
    
    // Create the calendar event (mock implementation)
    const result = await createGoogleCalendarEvent(eventData);
    
    if (result.success) {
      console.log('✅ Calendar automation successful:', result.eventId);
      return {
        success: true,
        eventId: result.eventId,
        eventType: calendarConfig.eventType,
        duration: calendarConfig.duration,
        htmlLink: result.htmlLink,
        mood: moodEntry.mood
      };
    } else {
      console.error('❌ Calendar automation failed:', result.error);
      return {
        success: false,
        error: result.error,
        eventData
      };
    }
    
  } catch (error) {
    console.error('❌ Calendar automation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get available mood-to-calendar mappings for settings display
 * @returns {object} Available mappings
 */
function getAvailableMoodMappings() {
  return Object.entries(MOOD_CALENDAR_MAPPING).map(([mood, config]) => ({
    mood,
    eventType: config.eventType,
    duration: config.duration,
    description: config.description
  }));
}

// Export functions
export {
  processCalendarAutomation,
  getMoodCalendarConfig,
  getAvailableMoodMappings,
  extractMoodName
}; 