// DOM elements
const moodForm = document.getElementById('moodForm');
const moodSelect = document.getElementById('moodSelect');
const moodNote = document.getElementById('moodNote');
const automationRule = document.getElementById('automationRule');
const suggestionsDiv = document.getElementById('suggestions');
const suggestionContent = document.getElementById('suggestionContent');

// Navigation elements
const showFormButton = document.getElementById('showForm');
const showHistoryButton = document.getElementById('showHistory');
const showTeamFeedButton = document.getElementById('showTeamFeed');
const showTrendsButton = document.getElementById('showTrends');
const showInsightsButton = document.getElementById('showInsights');
const showAchievementsButton = document.getElementById('showAchievements');
const showSettingsButton = document.getElementById('showSettings');
const moodEntryView = document.getElementById('moodEntryView');
const historyView = document.getElementById('historyView');
const teamFeedView = document.getElementById('teamFeedView');
const trendsView = document.getElementById('trendsView');
const insightsView = document.getElementById('insightsView');
const achievementsView = document.getElementById('achievementsView');
const settingsView = document.getElementById('settingsView');
const historyContent = document.getElementById('historyContent');
const teamFeedContent = document.getElementById('teamFeedContent');
const moodChart = document.getElementById('moodChart');
const trendsLoading = document.getElementById('trendsLoading');

// Sidebar elements
const mainAppLayout = document.getElementById('mainAppLayout');
const sidebar = document.getElementById('sidebar');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Insights elements
const insightsLoading = document.getElementById('insightsLoading');
const weeklyChart = document.getElementById('weeklyChart');
const teamMoodTrendCard = document.getElementById('teamMoodTrendCard');
const teamMoodTrendChart = document.getElementById('teamMoodTrendChart');
const teamMoodTrendLoading = document.getElementById('teamMoodTrendLoading');
const teamMoodTrendInsight = document.getElementById('teamMoodTrendInsight');

// Achievements elements
const confettiContainer = document.getElementById('confettiContainer');

// Settings elements
const defaultMoodSelect = document.getElementById('defaultMoodSelect');
const calendarAutomationCheckbox = document.getElementById('calendarAutomation');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const resetOnboardingBtn = document.getElementById('resetOnboardingBtn');
const settingsMessage = document.getElementById('settingsMessage');

// Reset button elements
const resetLocalBtn = document.getElementById('resetLocalBtn');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const resetAllBtn = document.getElementById('resetAllBtn');

// Daily reminder elements
const dailyReminderModal = document.getElementById('dailyReminderModal');
const logNowBtn = document.getElementById('logNowBtn');
const dismissReminderBtn = document.getElementById('dismissReminderBtn');

// Home screen elements
const homeView = document.getElementById('homeView');
const mainTitle = document.getElementById('mainTitle');
const tabNavigation = document.getElementById('tabNavigation');
const getStartedBtn = document.getElementById('getStartedBtn');
const welcomeMessage = document.getElementById('welcomeMessage');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');

// Weekly Wellness Summary elements
const wellnessLoading = document.getElementById('wellnessLoading');
const wellnessData = document.getElementById('wellnessData');
const noWeeklyData = document.getElementById('noWeeklyData');
const moodFrequencyGrid = document.getElementById('moodFrequencyGrid');
const weeklyWellnessChart = document.getElementById('weeklyWellnessChart');
const wellnessReportContent = document.getElementById('wellnessReportContent');

// Onboarding elements
const onboardingOverlay = document.getElementById('onboardingOverlay');
const skipOnboardingBtn = document.getElementById('skipOnboarding');
const onboardingNextBtn = document.getElementById('onboardingNext');
const onboardingSlides = document.querySelectorAll('.onboarding-slide');
const onboardingDots = document.querySelectorAll('.onboarding-dot');

// Onboarding state
let currentSlide = 1;
const totalSlides = 3;

// Electron IPC (import once at the top to avoid side effects)
const { ipcRenderer } = require('electron');

// Team sharing elements
const shareWithTeamCheckbox = document.getElementById('shareWithTeam');



// Inspirational quotes array
const inspirationalQuotes = [
    {
        text: "The mind is everything. What you think you become.",
        author: "Buddha"
    },
    {
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "It is never too late to be what you might have been.",
        author: "George Eliot"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Your limitation—it's only your imagination.",
        author: "Unknown"
    },
    {
        text: "Push yourself, because no one else is going to do it for you.",
        author: "Unknown"
    },
    {
        text: "Great things never come from comfort zones.",
        author: "Unknown"
    },
    {
        text: "Dream it. Wish it. Do it.",
        author: "Unknown"
    },
    {
        text: "Success doesn't just find you. You have to go out and get it.",
        author: "Unknown"
    },
    {
        text: "The harder you work for something, the greater you'll feel when you achieve it.",
        author: "Unknown"
    },
    {
        text: "Don't stop when you're tired. Stop when you're done.",
        author: "Unknown"
    },
    {
        text: "Wake up with determination. Go to bed with satisfaction.",
        author: "Unknown"
    },
    {
        text: "Do something today that your future self will thank you for.",
        author: "Sean Patrick Flanery"
    },
    {
        text: "Little things make big days.",
        author: "Unknown"
    },
    {
        text: "It's going to be hard, but hard does not mean impossible.",
        author: "Unknown"
    },
    {
        text: "Don't wait for opportunity. Create it.",
        author: "Unknown"
    }
];



// Home screen initialization
function initializeHomeScreen() {
    // Set random quote
    const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `— ${randomQuote.author}`;
    
    // Set welcome message with system name
    setWelcomeMessage();
    
    // Add get started button functionality
    getStartedBtn.addEventListener('click', function() {
        showMainApp();
        });
}

// Daily Reminder System
let reminderTimeout;

// Initialize daily reminder system
function initializeDailyReminder() {
    // Add event listeners for reminder buttons
    logNowBtn.addEventListener('click', handleLogNow);
    dismissReminderBtn.addEventListener('click', handleDismissReminder);
    
    // Check if we should show reminder after app loads
    setTimeout(() => {
        checkAndShowDailyReminder();
    }, Math.random() * 5000 + 15000); // Random delay between 15-20 seconds
}

// Check if daily reminder should be shown
async function checkAndShowDailyReminder() {
    try {
        // Check if daily reminders are enabled in settings
        const settings = await ipcRenderer.invoke('get-user-settings');
        if (!settings.dailyReminder) {
            return; // Reminders are disabled
        }
        
        // Check if user has already logged a mood today
        const hasLoggedToday = await hasLoggedMoodToday();
        if (hasLoggedToday) {
            return; // User already logged mood today
        }
        
        // Check if we've already shown reminder today
        const hasShownReminderToday = checkReminderShownToday();
        if (hasShownReminderToday) {
            return; // Already shown reminder today
        }
        
        // Show the reminder
        showDailyReminder();
        
    } catch (error) {
        console.log('Error checking daily reminder:', error);
    }
}

// Check if user has logged a mood today
async function hasLoggedMoodToday() {
    try {
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        if (!moodHistory || moodHistory.length === 0) {
            return false;
        }
        
        const today = new Date().toDateString();
        const todayEntries = moodHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate.toDateString() === today;
        });
        
        return todayEntries.length > 0;
    } catch (error) {
        console.log('Error checking mood history:', error);
        return false;
    }
}

// Check if reminder was already shown today
function checkReminderShownToday() {
    const lastReminderShown = localStorage.getItem('lastReminderShown');
    if (!lastReminderShown) {
        return false;
    }
    
    const lastShownDate = new Date(lastReminderShown);
    const today = new Date();
    
    return lastShownDate.toDateString() === today.toDateString();
}

// Show the daily reminder modal
function showDailyReminder() {
    // Show modal with fade-in animation
    dailyReminderModal.style.display = 'flex';
    
    // Trigger animation
    setTimeout(() => {
        dailyReminderModal.classList.add('show');
    }, 10);
    
    // Record that we've shown the reminder today
    localStorage.setItem('lastReminderShown', new Date().toISOString());
    
    console.log('Daily reminder shown');
}

// Hide the daily reminder modal
function hideDailyReminder() {
    dailyReminderModal.classList.remove('show');
    
    setTimeout(() => {
        dailyReminderModal.style.display = 'none';
    }, 400); // Wait for fade-out animation
}

// Handle "Log Now" button click
function handleLogNow() {
    // Hide the reminder
    hideDailyReminder();
    
    // Navigate to Mood Entry tab
    // First ensure we're in the main app view (not home screen)
    if (homeView.style.display !== 'none') {
        showMainApp();
        
        // Wait for main app to show, then activate mood entry tab
        setTimeout(() => {
            activateMoodEntryTab();
        }, 400);
    } else {
        // Already in main app, just activate mood entry tab
        activateMoodEntryTab();
    }
}

// Handle "Dismiss" button click
function handleDismissReminder() {
    // Simply hide the reminder
    hideDailyReminder();
}

// Activate the mood entry tab
function activateMoodEntryTab() {
    // Hide all views
    document.querySelectorAll('[id$="View"]').forEach(view => {
        view.style.display = 'none';
        view.style.opacity = '0';
    });
    
    // Show mood entry view and update navigation
    moodEntryView.style.display = 'block';
    moodEntryView.style.opacity = '1';
    updateNavButtonStates('showForm');
    
    // Focus on the mood select dropdown
    setTimeout(() => {
        moodSelect.focus();
    }, 100);
}

// Close reminder when clicking outside modal
dailyReminderModal.addEventListener('click', function(e) {
    if (e.target === dailyReminderModal) {
        handleDismissReminder();
    }
});

// Close reminder with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dailyReminderModal.classList.contains('show')) {
        handleDismissReminder();
    }
});

// Set welcome message with user's system name
function setWelcomeMessage() {
    try {
        const os = require('os');
        const username = os.userInfo().username;
        const displayName = username.charAt(0).toUpperCase() + username.slice(1);
        welcomeMessage.textContent = `Welcome, ${displayName}! 👋`;
    } catch (error) {
        // Fallback if we can't get system name
        welcomeMessage.textContent = 'Welcome! 👋';
    }
}

// Show main app after clicking Get Started
function showMainApp() {
    // Hide home view with animation
    homeView.style.opacity = '0';
    homeView.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        homeView.style.display = 'none';
        
        // Show main app layout with sidebar
        mainAppLayout.style.display = 'flex';
        
        // Initialize main app with smooth transitions
        setTimeout(() => {
            mainAppLayout.style.opacity = '1';
            // Ensure mood entry view is visible by default
            moodEntryView.style.opacity = '1';
        }, 100);
        
        // Initialize hamburger menu functionality
        initializeHamburgerMenu();
        
    }, 300);
}

// Onboarding functions
function checkOnboardingStatus() {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (!hasCompletedOnboarding || hasCompletedOnboarding !== 'true') {
        // Show onboarding for first-time users
        showOnboarding();
    } else {
        // Skip onboarding, show home screen
        initializeHomeScreen();
    }
}

function showOnboarding() {
    onboardingOverlay.style.display = 'flex';
    
    // Initialize onboarding
    currentSlide = 1;
    updateOnboardingSlide();
    
    // Add event listeners
    onboardingNextBtn.addEventListener('click', handleOnboardingNext);
    skipOnboardingBtn.addEventListener('click', completeOnboarding);
    
    // Add dot navigation
    onboardingDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index + 1);
        });
    });
}

function handleOnboardingNext() {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    } else {
        // Last slide - complete onboarding
        completeOnboarding();
    }
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    
    // Get current and target slides
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    const targetSlideElement = document.getElementById(`slide${slideNumber}`);
    
    // Animate out current slide
    currentSlideElement.classList.add('exit-left');
    
    setTimeout(() => {
        // Hide current slide
        currentSlideElement.classList.remove('active', 'exit-left');
        
        // Show target slide with animation
        targetSlideElement.classList.add('enter-right');
        
        setTimeout(() => {
            targetSlideElement.classList.remove('enter-right');
            targetSlideElement.classList.add('active');
            
            // Update current slide
            currentSlide = slideNumber;
            updateOnboardingControls();
            
        }, 50);
    }, 300);
}

function updateOnboardingSlide() {
    // Hide all slides
    onboardingSlides.forEach((slide, index) => {
        slide.classList.remove('active');
    });
    
    // Show current slide
    const activeSlide = document.getElementById(`slide${currentSlide}`);
    activeSlide.classList.add('active');
    
    updateOnboardingControls();
}

function updateOnboardingControls() {
    // Update dots
    onboardingDots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === currentSlide);
    });
    
    // Update button text
    if (currentSlide === totalSlides) {
        onboardingNextBtn.innerHTML = '<span>🚀 Get Started</span>';
    } else {
        onboardingNextBtn.innerHTML = '<span>Next</span>';
    }
}

function completeOnboarding() {
    // Save completion status to localStorage
    localStorage.setItem('hasCompletedOnboarding', 'true');
    
    // Hide onboarding with animation
    onboardingOverlay.style.opacity = '0';
    
    setTimeout(() => {
        onboardingOverlay.style.display = 'none';
        onboardingOverlay.style.opacity = '1'; // Reset for next time
        
        // Initialize home screen
        initializeHomeScreen();
    }, 500);
}

// Reset onboarding (for testing or if user wants to see it again)
function resetOnboarding() {
    localStorage.removeItem('hasCompletedOnboarding');
    location.reload(); // Reload to show onboarding again
}

// Initialize hamburger menu functionality
function initializeHamburgerMenu() {
    hamburgerMenu.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Close sidebar when clicking navigation items on mobile
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

// Toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
    hamburgerMenu.classList.toggle('active');
}

// Close sidebar
function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
    hamburgerMenu.classList.remove('active');
}

// Update navigation button states
function updateNavButtonStates(activeButtonId) {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    const activeButton = document.getElementById(activeButtonId);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Initialize app - simplified for Firestore only
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing app functionality
    checkOnboardingStatus();
    initializeDailyReminder();
    
    // Initialize hamburger menu
    initializeHamburgerMenu();
    
    // Apply default mood settings
    applyDefaultMoodOnLoad();
    
    // Check and auto-generate weekly report on app launch
    setTimeout(() => {
        checkAndGenerateWeeklyReportOnLaunch();
    }, 1000);
    
    console.log('App initialization completed');
});

// Handle form submission
moodForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent page refresh
    
    // Get form values
    const selectedMood = moodSelect.value;
    const noteText = moodNote.value.trim();
    const automationRuleText = automationRule.value.trim();
    const shareWithTeam = shareWithTeamCheckbox.checked;
    
    // Validate mood selection
    if (!selectedMood) {
        alert('Please select a mood first!');
        return;
    }
    
    // Handle automation rule if provided
    if (automationRuleText) {
        const validation = validateAutomationRule(automationRuleText);
        if (!validation.success) {
            alert(`Automation Rule Error: ${validation.error}`);
            return;
        }
        
        // Save the automation rule
        try {
            const saveResult = await ipcRenderer.invoke('save-automation-rule', validation.rule);
            if (saveResult.success) {
                console.log('✅ Automation rule saved successfully:', validation.rule.originalText);
                
                // Clear the automation rule input after successful save
                automationRule.value = '';
                
                // Show success feedback
                automationRule.style.borderColor = '#4CAF50';
                setTimeout(() => {
                    automationRule.style.borderColor = '';
                }, 2000);
            } else {
                console.error('❌ Failed to save automation rule:', saveResult.error);
            }
        } catch (error) {
            console.error('❌ Error saving automation rule:', error);
        }
    }
    
    // Combine mood and note into a single string
    let moodEntry = selectedMood;
    if (noteText) {
        moodEntry += ` - ${noteText}`;
    }
    
    // Log to console as requested
    console.log('Mood Entry:', moodEntry);
    
    // Show AI suggestions (async call) and check for automation rules
    displayAISuggestions(moodEntry, selectedMood, noteText, shareWithTeam);
    
    // Optional: Clear the form after submission
    // moodForm.reset();
});

async function displayAISuggestions(moodEntry, selectedMood, noteText, shareWithTeam) {
    // Show the suggestions div with loading state
    suggestionsDiv.style.display = 'block';
    suggestionsDiv.classList.add('show');
    
    // Show loading message
    suggestionContent.innerHTML = `
        <p><strong>Your mood:</strong> ${moodEntry}</p>
        <p><strong>AI Suggestion:</strong> 🤔 Thinking... (waiting for response)</p>
    `;
    
    // Scroll to suggestions
    suggestionsDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Get AI suggestion with music (local logic)
    let response = await getAISuggestion(moodEntry);
    
    // Display the final suggestion with music link
    suggestionContent.innerHTML = `
        <p><strong>Your mood:</strong> ${moodEntry}</p>
        <p><strong>AI Suggestion:</strong> ${response.suggestion}</p>
        <p><strong>🎶 Music:</strong> <a href="${response.music}" target="_blank">Click here to listen</a></p>
    `;
    
    // Log mood entry after AI suggestion is displayed
    const moodEntryObject = {
        mood: selectedMood,
        note: noteText,
        suggestion: response.suggestion,
        music: response.music,
        timestamp: new Date().toLocaleString(),
        shared: shareWithTeam
    };
    

    
    // Save to Firestore
    try {
        const result = await ipcRenderer.invoke('log-mood-entry', moodEntryObject);
        
        if (result.success) {
            console.log('Mood entry saved successfully to Firestore');
            
            // Show calendar automation feedback if enabled
            if (result.calendar?.success) {
                console.log('📅 Calendar automation successful:', result.calendar.eventType);
                
                // Add calendar automation feedback to the display
                suggestionContent.innerHTML += `
                    <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; color: #86efac; border: 1px solid rgba(34, 197, 94, 0.2);">
                        <strong>📅 Calendar Event Created:</strong><br/>
                        ${result.calendar.eventType} (${result.calendar.duration} minutes) has been scheduled for your current mood: ${result.calendar.mood}
                        <br/>
                        <small style="color: #4ade80;">✨ Automatic calendar blocking is helping you optimize your day!</small>
                    </div>
                `;
            } else if (result.calendar?.reason === 'disabled') {
                console.log('📅 Calendar automation is disabled');
            } else if (result.calendar?.reason === 'no_mapping') {
                console.log('📅 No calendar mapping for mood:', selectedMood);
            } else if (result.calendar?.error) {
                console.log('📅 Calendar automation error:', result.calendar.error);
            }
            
            // Check and execute automation rules
            console.log('🤖 Checking automation rules for mood:', selectedMood);
            try {
                await checkAndExecuteAutomationRules(moodEntryObject);
            } catch (automationError) {
                console.error('❌ Automation rules error:', automationError);
            }
            
            // Call LangGraph flow for additional analysis
            console.log('🚀 Calling LangGraph flow for additional insights...');
            try {
                const langGraphResult = await ipcRenderer.invoke('analyze-mood-with-langgraph', moodEntryObject);
                
                if (langGraphResult.success) {
                    console.log('✅ LangGraph Analysis Success:', {
                        insight: langGraphResult.insight,
                        analysis: langGraphResult.analysis
                    });
                    
                    // Add LangGraph insight to the suggestions display
                    suggestionContent.innerHTML += `
                        <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; color: #86efac;">
                            <strong>🤖 AI Coach Insight:</strong><br/>
                            ${langGraphResult.insight}
                        </div>
                    `;
                } else {
                    console.log('⚠️ LangGraph Analysis (Fallback):', langGraphResult.insight);
                    
                    // Show fallback insight
                    suggestionContent.innerHTML += `
                        <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; color: #86efac;">
                            <strong>💡 Motivational Insight:</strong><br/>
                            ${langGraphResult.insight}
                        </div>
                    `;
                }
            } catch (langGraphError) {
                console.error('❌ LangGraph flow error:', langGraphError);
                // Show generic motivational message on error
                suggestionContent.innerHTML += `
                    <div style="margin-top: 16px; padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; color: #86efac;">
                        <strong>💡 Motivational Insight:</strong><br/>
                        ✨ Every emotion you feel is valid and temporary. Take a deep breath, and remember that you're stronger than you know.
                    </div>
                `;
            }

            // Get Spotify music recommendations
            console.log('🎵 Getting Spotify music recommendations...');
            try {
                const spotifyResult = await ipcRenderer.invoke('get-spotify-recommendations', selectedMood);
                
                if (spotifyResult.success && spotifyResult.recommendations.length > 0) {
                    console.log('✅ Spotify recommendations retrieved:', spotifyResult.recommendations.length, 'tracks');
                    
                    // Create recommendations HTML with modern styling
                    let recommendationsHTML = `
                        <div class="spotify-recommendations">
                            <div class="spotify-header">
                                <svg class="spotify-logo" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#1ed760" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                                <h4>Personalized Music Recommendations</h4>
                            </div>
                            <div class="tracks-grid">
                    `;
                    
                    spotifyResult.recommendations.forEach((track, index) => {
                        recommendationsHTML += `
                            <div class="track-card" data-track-index="${index}" style="--index: ${index};">
                                <div class="track-info">
                                    <div class="track-name">${track.name}</div>
                                    <div class="artist-name">${track.artist}</div>
                                    <div class="album-name">${track.album}</div>
                                </div>
                                ${track.spotifyUrl ? `
                                    <a href="${track.spotifyUrl}" target="_blank" class="spotify-link">
                                        <svg class="spotify-icon" viewBox="0 0 24 24" width="16" height="16">
                                            <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                                        </svg>
                                        Listen on Spotify
                                    </a>
                                ` : ''}
                            </div>
                        `;
                    });
                    
                    recommendationsHTML += `
                            </div>
                        </div>
                    `;
                    
                    // Add to suggestions display
                    suggestionContent.innerHTML += recommendationsHTML;
                } else {
                    console.log('⚠️ No Spotify recommendations available');
                    
                    // Show fallback message
                    suggestionContent.innerHTML += `
                        <div class="spotify-recommendations fallback">
                            <div class="spotify-header">
                                <svg class="spotify-logo" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="#1ed760" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                                <h4>Music Recommendations</h4>
                            </div>
                            <p class="fallback-message">Unable to get personalized recommendations right now. Make sure you're authenticated with Spotify and have some playlists created.</p>
                        </div>
                    `;
                }
            } catch (spotifyError) {
                console.error('❌ Spotify recommendations error:', spotifyError);
                // Show fallback music suggestion
                suggestionContent.innerHTML += `
                    <div class="spotify-recommendations fallback">
                        <div class="spotify-header">
                            <svg class="spotify-logo" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="#1ed760" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                            <h4>Music Recommendations</h4>
                        </div>
                        <p class="fallback-message">Try listening to music that matches your current mood. Check out some chill playlists on your favorite music platform.</p>
                    </div>
                `;
            }
        } else {
            console.error('Failed to save mood entry:', result.error);
            // Show user-friendly error message
            suggestionContent.innerHTML += `
                <div style="margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; color: #fca5a5;">
                    ⚠️ Failed to save mood entry to Firestore. Please check your internet connection.
                </div>
            `;
        }
        
        // Refresh Weekly Wellness Summary regardless of save success/failure
        await generateWeeklyReport();
        
    } catch (error) {
        console.error('Error saving mood entry:', error);
        suggestionContent.innerHTML += `
            <div style="margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; color: #fca5a5;">
                ⚠️ Unable to connect to Firestore. Please check your configuration.
            </div>
        `;
        
        // Try to refresh Weekly Wellness Summary even on error
        try {
            await generateWeeklyReport();
        } catch (wellnessError) {
            console.error('Error refreshing weekly wellness summary:', wellnessError);
        }
    }
}

// Check and execute automation rules for the current mood
async function checkAndExecuteAutomationRules(moodEntry) {
    try {
        // Get all active automation rules
        const automationRules = await ipcRenderer.invoke('get-automation-rules');
        
        if (!automationRules || automationRules.length === 0) {
            console.log('🤖 No automation rules found');
            return;
        }
        
        console.log(`🤖 Found ${automationRules.length} automation rules to check`);
        
        let executedRules = [];
        
        // Check each rule against the current mood
        for (const rule of automationRules) {
            if (moodMatches(moodEntry.mood, rule.mood)) {
                console.log(`🎯 Automation rule matched: "${rule.originalText}"`);
                
                try {
                    const result = await executeAutomationAction(rule, moodEntry);
                    if (result.success) {
                        executedRules.push({
                            rule: rule,
                            result: result
                        });
                        console.log(`✅ Automation action executed: ${result.message}`);
                    } else {
                        console.error(`❌ Automation action failed: ${result.error}`);
                    }
                } catch (execError) {
                    console.error(`❌ Error executing automation rule "${rule.originalText}":`, execError);
                }
            }
        }
        
        // Show feedback for executed rules
        if (executedRules.length > 0) {
            let automationFeedback = `
                <div style="margin-top: 16px; padding: 12px; background: rgba(106, 90, 205, 0.1); border-radius: 8px; color: #b794f6; border: 1px solid rgba(106, 90, 205, 0.2);">
                    <strong>🤖 Automation Rules Executed:</strong><br/>
            `;
            
            executedRules.forEach(({rule, result}) => {
                automationFeedback += `
                    <div style="margin-top: 8px; padding: 8px; background: rgba(106, 90, 205, 0.05); border-radius: 6px;">
                        <strong>Rule:</strong> "${rule.originalText}"<br/>
                        <strong>Action:</strong> ${result.message}
                    </div>
                `;
            });
            
            automationFeedback += `
                    <br/>
                    <small style="color: #9f7aea;">✨ Your automated responses are working!</small>
                </div>
            `;
            
            // Add to suggestions display
            suggestionContent.innerHTML += automationFeedback;
        } else {
            console.log('🤖 No automation rules matched the current mood');
        }
        
    } catch (error) {
        console.error('❌ Error checking automation rules:', error);
    }
}

async function getAISuggestion(moodText) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate suggestion and music based on mood emoji
    if (moodText.includes("😊")) {
        return {
            suggestion: "🎵 Share your good mood with someone! Keep that positive energy flowing.",
            music: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC" // Happy Hits playlist
        };
    } else if (moodText.includes("😐")) {
        return {
            suggestion: "🧘 Try a 5-minute meditation or short walk to reset your energy.",
            music: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ" // Chill playlist
        };
    } else if (moodText.includes("😫")) {
        return {
            suggestion: "☕ Take a break with a warm drink and short walk outside for fresh air.",
            music: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ" // Chill playlist
        };
    } else if (moodText.includes("😠")) {
        return {
            suggestion: "✍️ Try journaling your thoughts or do some deep breathing exercises to release tension.",
            music: "https://open.spotify.com/playlist/37i9dQZF1DWXc5bfxkQiHw" // Calm playlist
        };
    } else if (moodText.includes("😔")) {
        return {
            suggestion: "💬 Reach out to someone you trust, or do something comforting like listening to music.",
            music: "https://open.spotify.com/playlist/37i9dQZF1DWX83CujKHHOn" // Comfort music
        };
    } else {
        return {
            suggestion: "🧘 Take a moment to breathe deeply and be kind to yourself.",
            music: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ" // Default chill playlist
        };
    }
}

// Add some visual feedback when typing in the textarea
moodNote.addEventListener('input', function() {
    const charCount = this.value.length;
    if (charCount > 0) {
        this.style.borderColor = '#3498db';
    } else {
        this.style.borderColor = '#e1e8ed';
    }
});

// Add visual feedback for mood selection
moodSelect.addEventListener('change', function() {
    if (this.value) {
        this.style.borderColor = '#3498db';
    } else {
        this.style.borderColor = '#e1e8ed';
    }
});

// Sidebar navigation functionality
showFormButton.addEventListener('click', function() {
    // Switch to mood entry view
    moodEntryView.style.display = 'block';
    moodEntryView.style.opacity = '1';
    historyView.style.display = 'none';
    teamFeedView.style.display = 'none';
    trendsView.style.display = 'none';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Update button states
    updateNavButtonStates('showForm');
    
    // Load Weekly Wellness Summary
    generateWeeklyReport();
});

showHistoryButton.addEventListener('click', async function() {
    // Switch to history view
    moodEntryView.style.display = 'none';
    moodEntryView.style.opacity = '0';
    historyView.style.display = 'block';
    historyView.style.opacity = '1';
    teamFeedView.style.display = 'none';
    trendsView.style.display = 'none';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Hide suggestions when leaving mood entry page
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.classList.remove('show');
    
    // Update button states
    updateNavButtonStates('showHistory');
    
    // Load mood history
    await loadMoodHistory();
});

showTeamFeedButton.addEventListener('click', async function() {
    // Switch to team feed view
    moodEntryView.style.display = 'none';
    moodEntryView.style.opacity = '0';
    historyView.style.display = 'none';
    teamFeedView.style.display = 'block';
    trendsView.style.display = 'none';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Hide suggestions when leaving mood entry page
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.classList.remove('show');
    
    // Update button states
    updateNavButtonStates('showTeamFeed');
    
    // Load team feed
    await loadTeamFeed();
});

showTrendsButton.addEventListener('click', async function() {
    // Switch to trends view
    moodEntryView.style.display = 'none';
    moodEntryView.style.opacity = '0';
    historyView.style.display = 'none';
    teamFeedView.style.display = 'none';
    trendsView.style.display = 'block';
    trendsView.style.opacity = '1';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Hide suggestions when leaving mood entry page
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.classList.remove('show');
    
    // Update button states
    updateNavButtonStates('showTrends');
    
    // Load mood trends
    await loadMoodTrends();
});

showInsightsButton.addEventListener('click', async function() {
    // Switch to insights view
    moodEntryView.style.display = 'none';
    moodEntryView.style.opacity = '0';
    historyView.style.display = 'none';
    teamFeedView.style.display = 'none';
    trendsView.style.display = 'none';
    insightsView.style.display = 'block';
    insightsView.style.opacity = '1';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Hide suggestions when leaving mood entry page
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.classList.remove('show');
    
    // Update button states
    updateNavButtonStates('showInsights');
    
    // Load insights
    await loadInsights();
});

showAchievementsButton.addEventListener('click', async function() {
    // Switch to achievements view
    moodEntryView.style.display = 'none';
    moodEntryView.style.opacity = '0';
    historyView.style.display = 'none';
    teamFeedView.style.display = 'none';
    trendsView.style.display = 'none';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'block';
    achievementsView.style.opacity = '1';
    settingsView.style.display = 'none';
    
    // Hide suggestions when leaving mood entry page
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.classList.remove('show');
    
    // Update button states
    updateNavButtonStates('showAchievements');
    
    // Load achievements
    await loadAchievements();
});

showSettingsButton.addEventListener('click', async function() {
    // Switch to settings view
    moodEntryView.style.display = 'none';
    moodEntryView.style.opacity = '0';
    historyView.style.display = 'none';
    teamFeedView.style.display = 'none';
    trendsView.style.display = 'none';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'block';
    settingsView.style.opacity = '1';
    
    // Hide suggestions when leaving mood entry page
    suggestionsDiv.style.display = 'none';
    suggestionsDiv.classList.remove('show');
    
    // Update button states
    updateNavButtonStates('showSettings');
    
    // Load current settings
    await loadSettings();
});

// Load and display mood history
async function loadMoodHistory() {
    try {
        // Show loading message
        historyContent.innerHTML = '<p style="text-align: center; color: #666;">Loading mood history...</p>';
        
        // Request mood history from main process
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        
        // Display the history
        if (moodHistory && moodHistory.length > 0) {
            displayMoodHistory(moodHistory);
        } else {
            historyContent.innerHTML = '<div class="no-history">No mood entries found yet.<br>Start tracking your moods to see them here!</div>';
        }
        
    } catch (error) {
        console.error('Error loading mood history:', error);
        historyContent.innerHTML = '<div class="no-history">Error loading mood history.<br>Please try again later.</div>';
    }
}

// Display mood history entries
function displayMoodHistory(moodHistory) {
    // Sort entries by timestamp (newest first)
    const sortedHistory = moodHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let historyHTML = '';
    
    sortedHistory.forEach(entry => {
        historyHTML += `
            <div class="history-entry">
                <div class="history-mood">${entry.mood}${entry.note ? ` - ${entry.note}` : ''}</div>
                ${entry.note ? `<div class="history-note">"${entry.note}"</div>` : ''}
                <div class="history-suggestion"><strong>💡 AI Suggestion:</strong> ${entry.suggestion}</div>
                <div class="history-music"><strong>🎶 Music:</strong> <a href="${entry.music}" target="_blank">Click here to listen</a></div>
                <div class="history-timestamp">${entry.timestamp}</div>
            </div>
        `;
    });
    
    historyContent.innerHTML = historyHTML;
}

// Global chart instance to manage chart updates
let moodChartInstance = null;

// Mood mapping function - converts emoji to numeric value
function getMoodValue(moodText) {
    if (moodText.includes("😊")) return 5; // Happy
    if (moodText.includes("😐")) return 3; // Neutral
    if (moodText.includes("😫")) return 2; // Tired
    if (moodText.includes("😔")) return 2; // Sad
    if (moodText.includes("😠")) return 1; // Frustrated
    return 3; // Default to neutral if emoji not found
}

// Team mood score mapping function - converts mood labels to scores for team analysis
function getTeamMoodScore(moodText) {
    // Extract mood name from full mood text (e.g., "😊 Happy" -> "Happy")
    const moodName = moodText.replace(/^\S+\s+/, '').trim();
    
    // Team mood score mapping as per requirements
    if (moodName === 'Happy') return 5;     // 😊 Happy: 5
    if (moodName === 'Neutral') return 3;   // 🙂 Neutral: 3
    if (moodName === 'Sad') return 2;       // 😔 Sad: 2
    if (moodName === 'Tired') return 2;     // 😫 Tired: 2
    if (moodName === 'Frustrated') return 1; // 😡 Frustrated: 1
    
    // Handle emoji-only patterns
    if (moodText.includes("😊")) return 5; // Happy
    if (moodText.includes("😐") || moodText.includes("🙂")) return 3; // Neutral
    if (moodText.includes("😔")) return 2; // Sad
    if (moodText.includes("😫")) return 2; // Tired
    if (moodText.includes("😠") || moodText.includes("😡")) return 1; // Frustrated
    
    return 3; // Default to neutral if mood not recognized
}

// Get mood emoji from text
function getMoodEmoji(moodText) {
    if (moodText.includes("😊")) return "😊";
    if (moodText.includes("😐")) return "😐";
    if (moodText.includes("😫")) return "😫";
    if (moodText.includes("😔")) return "😔";
    if (moodText.includes("😠")) return "😠";
    return "😐"; // Default
}

// Load and display mood trends
async function loadMoodTrends() {
    try {
        // Show loading state
        trendsLoading.style.display = 'block';
        
        // Request mood history from main process
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        
        // Hide loading state
        trendsLoading.style.display = 'none';
        
        if (moodHistory && moodHistory.length > 0) {
            displayMoodChart(moodHistory);
        } else {
            // Show no data message
            const chartContainer = document.getElementById('chartContainer');
            chartContainer.innerHTML = '<div class="no-trends">No mood data available yet.<br>Start tracking your moods to see trends!</div>';
        }
        
    } catch (error) {
        console.error('Error loading mood trends:', error);
        trendsLoading.style.display = 'none';
        const chartContainer = document.getElementById('chartContainer');
        chartContainer.innerHTML = '<div class="no-trends">Error loading mood trends.<br>Please try again later.</div>';
    }
}

// Display mood chart
function displayMoodChart(moodHistory) {
    // Sort entries by timestamp (oldest first for chart)
    const sortedHistory = moodHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Prepare data for chart
    const labels = [];
    const moodValues = [];
    const moodColors = [];
    const moodEmojis = [];
    
    sortedHistory.forEach(entry => {
        // Format date for display
        const date = new Date(entry.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        labels.push(formattedDate);
        moodValues.push(getMoodValue(entry.mood));
        moodEmojis.push(getMoodEmoji(entry.mood));
        
        // Assign colors based on mood
        const moodValue = getMoodValue(entry.mood);
        if (moodValue === 5) moodColors.push('#28a745'); // Happy - Green
        else if (moodValue === 3) moodColors.push('#ffc107'); // Neutral - Yellow
        else if (moodValue === 2) moodColors.push('#fd7e14'); // Tired/Sad - Orange
        else moodColors.push('#dc3545'); // Frustrated - Red
    });
    
    // Destroy existing chart if it exists
    if (moodChartInstance) {
        moodChartInstance.destroy();
    }
    
    // Get chart context
    const ctx = moodChart.getContext('2d');
    
    // Create new chart
    moodChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Level',
                data: moodValues,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: moodColors,
                pointBorderColor: moodColors,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Your Mood Journey',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const emoji = moodEmojis[context.dataIndex];
                            const value = context.parsed.y;
                            let moodName = '';
                            if (value === 5) moodName = 'Happy';
                            else if (value === 3) moodName = 'Neutral';
                            else if (value === 2) moodName = 'Tired/Sad';
                            else moodName = 'Frustrated';
                            
                            return `${emoji} ${moodName} (${value}/5)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const moodLabels = {
                                1: '😠 Frustrated',
                                2: '😫😔 Tired/Sad', 
                                3: '😐 Neutral',
                                4: '',
                                5: '😊 Happy'
                            };
                            return moodLabels[value] || '';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Mood Level'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    },
                    ticks: {
                        maxTicksLimit: 8
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Achievement system
const BADGE_DEFINITIONS = [
    {
        id: 'consistency_champ',
        icon: '🏆',
        title: 'Consistency Champ',
        description: 'Logged moods 7 days in a row',
        checkUnlocked: (data) => data.currentStreak >= 7
    },
    {
        id: 'emotional_explorer',
        icon: '🎭',
        title: 'Emotional Explorer',
        description: 'Used all 5 different moods',
        checkUnlocked: (data) => data.uniqueMoods >= 5
    },
    {
        id: 'night_owl',
        icon: '🦉',
        title: 'Night Owl',
        description: 'Most active logging at night',
        checkUnlocked: (data) => data.peakTime === 'Night'
    },
    {
        id: 'note_taker',
        icon: '📝',
        title: 'Note Taker',
        description: 'Wrote notes 10 times',
        checkUnlocked: (data) => data.totalNotes >= 10
    },
    {
        id: 'mood_master',
        icon: '🎨',
        title: 'Mood Master',
        description: 'Logged 50 total moods',
        checkUnlocked: (data) => data.totalLogs >= 50
    },
    {
        id: 'early_bird',
        icon: '🐦',
        title: 'Early Bird',
        description: 'Most active logging in morning',
        checkUnlocked: (data) => data.peakTime === 'Morning'
    },
    {
        id: 'weekly_warrior',
        icon: '⚡',
        title: 'Weekly Warrior',
        description: 'Logged moods every day this week',
        checkUnlocked: (data) => data.thisWeekDays >= 7
    },
    {
        id: 'happy_soul',
        icon: '😊',
        title: 'Happy Soul',
        description: 'Logged "Happy" 20 times',
        checkUnlocked: (data) => data.happyCount >= 20
    }
];

const GOAL_DEFINITIONS = [
    {
        id: 'weekly_logs',
        title: '🎯 Log 3 moods this week',
        target: 3,
        getCurrentProgress: (data) => data.thisWeekLogs,
        reward: '🎖️ Consistent Tracker badge'
    },
    {
        id: 'total_milestone',
        title: '📊 Reach 10 total logs',
        target: 10,
        getCurrentProgress: (data) => data.totalLogs,
        reward: '🏅 Milestone Achiever badge'
    },
    {
        id: 'streak_goal',
        title: '🔥 Build a 3-day streak',
        target: 3,
        getCurrentProgress: (data) => data.currentStreak,
        reward: '⚡ Streak Starter badge'
    },
    {
        id: 'note_goal',
        title: '✍️ Write 5 notes',
        target: 5,
        getCurrentProgress: (data) => data.totalNotes,
        reward: '📚 Thoughtful Writer badge'
    }
];

// Load and display achievements
async function loadAchievements() {
    try {
        // Request mood history from main process
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        
        if (moodHistory && moodHistory.length > 0) {
            const achievementData = calculateAchievementData(moodHistory);
            displayAchievements(achievementData);
        } else {
            // Show starter message
            displayStarterAchievements();
        }
        
    } catch (error) {
        console.error('Error loading achievements:', error);
        displayStarterAchievements();
    }
}

// Calculate all achievement-related data
function calculateAchievementData(moodHistory) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Basic stats
    const totalLogs = moodHistory.length;
    const totalNotes = moodHistory.filter(entry => entry.note && entry.note.trim()).length;
    const uniqueMoods = [...new Set(moodHistory.map(entry => entry.mood.split(' ')[1]))].length;
    
    // This week's data
    const thisWeekEntries = moodHistory.filter(entry => new Date(entry.timestamp) >= oneWeekAgo);
    const thisWeekLogs = thisWeekEntries.length;
    const thisWeekDays = [...new Set(thisWeekEntries.map(entry => 
        new Date(entry.timestamp).toDateString()
    ))].length;
    
    // Current streak
    const currentStreak = calculateCurrentStreak(moodHistory).days;
    
    // Peak time analysis
    const timePeriods = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
    moodHistory.forEach(entry => {
        const hour = new Date(entry.timestamp).getHours();
        if (hour >= 6 && hour < 12) timePeriods.Morning++;
        else if (hour >= 12 && hour < 18) timePeriods.Afternoon++;
        else if (hour >= 18 && hour < 22) timePeriods.Evening++;
        else timePeriods.Night++;
    });
    const peakTime = Object.keys(timePeriods).reduce((a, b) => 
        timePeriods[a] > timePeriods[b] ? a : b
    );
    
    // Mood-specific counts
    const happyCount = moodHistory.filter(entry => entry.mood.includes('😊')).length;
    
    // Active days
    const activeDays = [...new Set(moodHistory.map(entry => 
        new Date(entry.timestamp).toDateString()
    ))].length;
    
    return {
        totalLogs,
        totalNotes,
        uniqueMoods,
        thisWeekLogs,
        thisWeekDays,
        currentStreak,
        peakTime,
        happyCount,
        activeDays
    };
}

// Display achievements
function displayAchievements(data) {
    // Update streak display
    updateStreakDisplay(data.currentStreak);
    
    // Update badges
    updateBadges(data);
    
    // Update goals
    updateGoals(data);
    
    // Update stats
    updateStats(data);
}

// Update streak display
function updateStreakDisplay(streak) {
    const streakFlame = document.getElementById('streakFlame');
    const achievementStreak = document.getElementById('achievementStreak');
    const streakDescription = document.getElementById('streakDescription');
    
    achievementStreak.textContent = streak;
    
    if (streak === 0) {
        streakFlame.style.filter = 'grayscale(1) opacity(0.5)';
        streakDescription.textContent = 'Start your journey today!';
    } else if (streak === 1) {
        streakFlame.style.filter = 'none';
        streakDescription.textContent = 'Great start! Keep it up!';
    } else if (streak < 7) {
        streakFlame.style.filter = 'none';
        streakDescription.textContent = `Amazing! ${streak} days strong!`;
    } else {
        streakFlame.style.filter = 'none';
        streakDescription.textContent = `Incredible streak! You're on fire! 🔥`;
        // Add extra animation for long streaks
        streakFlame.style.animation = 'flame-dance 1s ease-in-out infinite alternate';
    }
}

// Update badges display
function updateBadges(data) {
    const badgesGrid = document.getElementById('badgesGrid');
    let badgesHTML = '';
    let newlyUnlocked = [];
    
    BADGE_DEFINITIONS.forEach(badge => {
        const isUnlocked = badge.checkUnlocked(data);
        const wasUnlocked = localStorage.getItem(`badge_${badge.id}_unlocked`) === 'true';
        
        if (isUnlocked && !wasUnlocked) {
            newlyUnlocked.push(badge);
            localStorage.setItem(`badge_${badge.id}_unlocked`, 'true');
        }
        
        badgesHTML += `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-title">${badge.title}</div>
                <div class="badge-description">${badge.description}</div>
            </div>
        `;
    });
    
    badgesGrid.innerHTML = badgesHTML;
    
    // Celebrate newly unlocked badges
    if (newlyUnlocked.length > 0) {
        setTimeout(() => {
            newlyUnlocked.forEach((badge, index) => {
                setTimeout(() => {
                    celebrateAchievement(`${badge.icon} ${badge.title} Unlocked!`);
                }, index * 1000);
            });
        }, 500);
    }
}

// Update goals display
function updateGoals(data) {
    const goalsContainer = document.getElementById('goalsContainer');
    let goalsHTML = '';
    
    GOAL_DEFINITIONS.forEach(goal => {
        const progress = goal.getCurrentProgress(data);
        const percentage = Math.min((progress / goal.target) * 100, 100);
        const isComplete = progress >= goal.target;
        
        goalsHTML += `
            <div class="goal-card ${isComplete ? 'completed' : ''}">
                <div class="goal-header">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-progress-text">${progress}/${goal.target}</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="goal-reward">🎁 ${goal.reward}</div>
            </div>
        `;
    });
    
    goalsContainer.innerHTML = goalsHTML;
}

// Update stats display
function updateStats(data) {
    document.getElementById('totalLogs').textContent = data.totalLogs;
    document.getElementById('totalNotes').textContent = data.totalNotes;
    document.getElementById('uniqueMoods').textContent = data.uniqueMoods;
    document.getElementById('activeDays').textContent = data.activeDays;
}

// Display starter achievements for new users
function displayStarterAchievements() {
    // Show empty state with encouragement
    updateStreakDisplay(0);
    
    // Show all badges as locked
    const badgesGrid = document.getElementById('badgesGrid');
    let badgesHTML = '';
    
    BADGE_DEFINITIONS.forEach(badge => {
        badgesHTML += `
            <div class="badge-card locked">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-title">${badge.title}</div>
                <div class="badge-description">${badge.description}</div>
            </div>
        `;
    });
    
    badgesGrid.innerHTML = badgesHTML;
    
    // Show starter goals
    const goalsContainer = document.getElementById('goalsContainer');
    let goalsHTML = '';
    
    GOAL_DEFINITIONS.forEach(goal => {
        goalsHTML += `
            <div class="goal-card">
                <div class="goal-header">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-progress-text">0/${goal.target}</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="goal-reward">🎁 ${goal.reward}</div>
            </div>
        `;
    });
    
    goalsContainer.innerHTML = goalsHTML;
    
    // Zero out stats
    document.getElementById('totalLogs').textContent = '0';
    document.getElementById('totalNotes').textContent = '0';
    document.getElementById('uniqueMoods').textContent = '0';
    document.getElementById('activeDays').textContent = '0';
}

// Celebrate achievement with confetti and text
function celebrateAchievement(message) {
    // Show celebration text
    const celebrationText = document.createElement('div');
    celebrationText.className = 'celebration-text';
    celebrationText.textContent = message;
    document.body.appendChild(celebrationText);
    
    // Remove celebration text after animation
    setTimeout(() => {
        document.body.removeChild(celebrationText);
    }, 2000);
    
    // Create confetti
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#ffd700', '#4ecdc4', '#ff8e8e', '#87ceeb'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confettiContainer.contains(confetti)) {
                    confettiContainer.removeChild(confetti);
                }
            }, 5000);
        }, i * 50);
    }
}

// Settings functionality
saveSettingsBtn.addEventListener('click', async function() {
    await saveSettings();
});

resetOnboardingBtn.addEventListener('click', function() {
    if (confirm('This will show the onboarding walkthrough again when you restart the app. Continue?')) {
        resetOnboarding();
    }
});

// Reset button event listeners (local data only)
resetLocalBtn.addEventListener('click', async function() {
    await confirmAndResetLocalData('local');
});

resetSettingsBtn.addEventListener('click', async function() {
    await confirmAndResetLocalData('settings');
});

resetAllBtn.addEventListener('click', async function() {
    await confirmAndResetLocalData('all');
});

// Simplified reset functions for local data only
async function resetLocalData(resetLocal = false, resetSettings = false) {
    console.log('🗑️  Starting local data reset...');
    
    let results = {
        local: { success: false, error: null },
        settings: { success: false, error: null }
    };

    // Reset local data files
    if (resetLocal) {
        try {
            console.log('📁 Resetting local data files...');
            const result = await ipcRenderer.invoke('reset-local-data');
            results.local = result;
            
            if (result.success) {
                console.log('✅ Local data reset successful');
            } else {
                console.log('⚠️  Local data reset failed:', result.error);
            }
        } catch (error) {
            console.error('❌ Local data reset error:', error.message);
            results.local = { success: false, error: error.message };
        }
    }

    // Reset settings
    if (resetSettings) {
        try {
            console.log('⚙️ Resetting user settings...');
            const result = await ipcRenderer.invoke('reset-settings');
            results.settings = result;
            
            if (result.success) {
                console.log('✅ Settings reset successful');
                // Reload settings UI
                await loadSettings();
            } else {
                console.log('⚠️  Settings reset failed:', result.error);
            }
        } catch (error) {
            console.error('❌ Settings reset error:', error.message);
            results.settings = { success: false, error: error.message };
        }
    }

    console.log('🎉 Local data reset completed:', results);
    return results;
}

// Confirm and execute local data reset
async function confirmAndResetLocalData(resetType = 'all') {
    let title, message, resetLocal, resetSettings;
    
    switch (resetType) {
        case 'local':
            title = '📁 Reset Local Data';
            message = 'This will permanently delete your local mood history and achievement data.\n\nThis action cannot be undone. Are you sure?';
            resetLocal = true;
            resetSettings = false;
            break;
            
        case 'settings':
            title = '⚙️ Reset Settings';
            message = 'This will reset all your app settings to default values.\n\nYour mood data will not be affected. Continue?';
            resetLocal = false;
            resetSettings = true;
            break;
            
        case 'all':
        default:
            title = '💥 Reset All Local Data';
            message = 'This will permanently delete:\n• All local mood history\n• All app settings\n• All achievements and streaks\n\nThis action cannot be undone. Are you absolutely sure?';
            resetLocal = true;
            resetSettings = true;
            break;
    }

    // Show confirmation dialog
    const confirmed = confirm(`${title}\n\n${message}`);
    
    if (!confirmed) {
        console.log('❌ Data reset cancelled by user');
        return { success: false, cancelled: true };
    }

    // Show loading message
    showSettingsMessage('Resetting data...', 'info');
    
    try {
        // Execute reset
        const results = await resetLocalData(resetLocal, resetSettings);
        
        // Generate result message
        let errors = [];
        
        if (resetLocal && !results.local.success) {
            errors.push(`Local data: ${results.local.error}`);
        }
        
        if (resetSettings && !results.settings.success) {
            errors.push(`Settings: ${results.settings.error}`);
        }
        
        // Show results
        if (errors.length === 0) {
            showSettingsMessage(`✅ Reset completed successfully!`, 'success');
            
            // Refresh all views
            if (resetLocal) {
                // Clear history view
                historyContent.innerHTML = '<div class="no-history">No mood history found. Start tracking your mood!</div>';
                
                // Reset achievements if we have access to them
                if (window.location.hash === '#achievements' || achievementsView.style.display !== 'none') {
                    displayStarterAchievements();
                }
                
                // Clear suggestions
                suggestionsDiv.style.display = 'none';
            }
            
        } else {
            showSettingsMessage(`⚠️ Reset partially completed. Errors: ${errors.join(', ')}`, 'error');
        }
        
        return { success: true, results, errors };
        
    } catch (error) {
        console.error('❌ Reset execution error:', error.message);
        showSettingsMessage(`❌ Reset failed: ${error.message}`, 'error');
        return { success: false, error: error.message };
    }
}

// Load settings from file and populate form
async function loadSettings() {
    try {
        const settings = await ipcRenderer.invoke('get-user-settings');
        
        if (settings) {
            // Set default mood
            if (settings.defaultMood) {
                defaultMoodSelect.value = settings.defaultMood;
            }
            
            // Set music platform
            if (settings.musicPlatform) {
                const radioButton = document.querySelector(`input[name="musicPlatform"][value="${settings.musicPlatform}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            }
            
            // Set daily reminder
            if (settings.dailyReminder !== undefined) {
                document.getElementById('dailyReminder').checked = settings.dailyReminder;
            }
            
            // Set calendar automation
            if (settings.calendarAutomation !== undefined) {
                calendarAutomationCheckbox.checked = settings.calendarAutomation;
            }
        }
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings to file
async function saveSettings() {
    try {
        // Get form values
        const defaultMood = defaultMoodSelect.value;
        const musicPlatform = document.querySelector('input[name="musicPlatform"]:checked')?.value || 'spotify';
        const dailyReminder = document.getElementById('dailyReminder').checked;
        const calendarAutomation = calendarAutomationCheckbox.checked;
        
        // Create settings object
        const settings = {
            defaultMood: defaultMood,
            musicPlatform: musicPlatform,
            dailyReminder: dailyReminder,
            calendarAutomation: calendarAutomation,
            lastUpdated: new Date().toISOString()
        };
        
        // Save settings via IPC
        const success = await ipcRenderer.invoke('save-user-settings', settings);
        
        if (success) {
            // Show success message
            showSettingsMessage('Settings saved successfully!', 'success');
            
            // Apply default mood to main form if set
            if (defaultMood) {
                moodSelect.value = defaultMood;
                moodSelect.style.borderColor = '#3498db';
            }
        } else {
            showSettingsMessage('Error saving settings. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error saving settings:', error);
        showSettingsMessage('Error saving settings. Please try again.', 'error');
    }
}

// Show settings message (success or error)
function showSettingsMessage(message, type) {
    settingsMessage.textContent = message;
    settingsMessage.className = `settings-message ${type}`;
    settingsMessage.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        settingsMessage.style.display = 'none';
    }, 3000);
}

// Apply default mood on app load
async function applyDefaultMoodOnLoad() {
    try {
        const settings = await ipcRenderer.invoke('get-user-settings');
        
        if (settings && settings.defaultMood) {
            moodSelect.value = settings.defaultMood;
            moodSelect.style.borderColor = '#3498db';
        }
        
    } catch (error) {
        console.error('Error applying default mood:', error);
    }
}

// Apply default mood when settings view is loaded
async function initializeSettingsView() {
    await loadSettings();
    await applyDefaultMoodOnLoad();
}

// Global chart instances
let weeklyChartInstance = null;
let teamMoodTrendChartInstance = null;

// Load and display insights
async function loadInsights() {
    try {
        // Show loading state
        insightsLoading.style.display = 'block';
        
        // Request mood history from main process
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        
        // Hide loading state
        insightsLoading.style.display = 'none';
        
        if (moodHistory && moodHistory.length > 0) {
            displayInsights(moodHistory);
        } else {
            // Show no data message
            document.getElementById('insightsContent').innerHTML = '<div class="no-history">No mood data available yet.<br>Start tracking your moods to see insights!</div>';
        }
        
    } catch (error) {
        console.error('Error loading insights:', error);
        insightsLoading.style.display = 'none';
        document.getElementById('insightsContent').innerHTML = '<div class="no-history">Error loading insights.<br>Please try again later.</div>';
    }
}

// Display insights
function displayInsights(moodHistory) {
    // Calculate insights
    const mostFrequent = getMostFrequentMood(moodHistory);
    const peakTime = getPeakMoodTime(moodHistory);
    const currentStreak = calculateCurrentStreak(moodHistory);
    const weeklyProgress = calculateWeeklyProgress(moodHistory);
    
    // Update most frequent mood
    document.getElementById('mostFrequentMood').textContent = mostFrequent.emoji;
    document.getElementById('mostFrequentMoodDesc').textContent = `You've logged "${mostFrequent.name}" ${mostFrequent.count} times (${mostFrequent.percentage}% of entries)`;
    
    // Update peak time
    document.getElementById('peakMoodTime').textContent = peakTime.period;
    document.getElementById('peakMoodTimeDesc').textContent = `${peakTime.count} entries logged during ${peakTime.period.toLowerCase()} hours`;
    
    // Update streak
    document.getElementById('currentStreak').innerHTML = currentStreak.days > 0 ? 
        `${currentStreak.days} <span class="streak-fire">🔥</span>` : 
        `${currentStreak.days}`;
    document.getElementById('streakDesc').textContent = currentStreak.days === 1 ? 
        'Keep it up! One day at a time.' : 
        currentStreak.days > 1 ? 
            `Amazing! ${currentStreak.days} days strong.` : 
            'Start your streak today!';
    
    // Update weekly progress
    document.getElementById('weeklyProgress').textContent = weeklyProgress.change;
    document.getElementById('weeklyProgress').className = `insight-value ${weeklyProgress.trend}`;
    document.getElementById('progressDesc').textContent = weeklyProgress.description;
    
    // Create weekly mood breakdown chart
    createWeeklyChart(moodHistory);
    
    // Load team insights
    loadTeamInsights();
    
    // Load team mood trend
    loadTeamMoodTrend();
}

// Get most frequent mood
function getMostFrequentMood(moodHistory) {
    const moodCounts = {};
    
    moodHistory.forEach(entry => {
        const moodKey = entry.mood.split(' ')[1] || 'Unknown'; // Get mood name
        moodCounts[moodKey] = (moodCounts[moodKey] || 0) + 1;
    });
    
    let mostFrequent = { name: 'Unknown', count: 0, emoji: '😐' };
    for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > mostFrequent.count) {
            mostFrequent = { 
                name: mood, 
                count: count,
                emoji: getMoodEmoji(`😊 ${mood}`) // Use existing function
            };
        }
    }
    
    const percentage = Math.round((mostFrequent.count / moodHistory.length) * 100);
    return { ...mostFrequent, percentage };
}

// Get peak mood time
function getPeakMoodTime(moodHistory) {
    const timePeriods = {
        'Morning': 0,    // 6 AM - 12 PM
        'Afternoon': 0,  // 12 PM - 6 PM
        'Evening': 0,    // 6 PM - 10 PM
        'Night': 0       // 10 PM - 6 AM
    };
    
    moodHistory.forEach(entry => {
        const date = new Date(entry.timestamp);
        const hour = date.getHours();
        
        if (hour >= 6 && hour < 12) {
            timePeriods.Morning++;
        } else if (hour >= 12 && hour < 18) {
            timePeriods.Afternoon++;
        } else if (hour >= 18 && hour < 22) {
            timePeriods.Evening++;
        } else {
            timePeriods.Night++;
        }
    });
    
    let peakPeriod = 'Morning';
    let maxCount = 0;
    
    for (const [period, count] of Object.entries(timePeriods)) {
        if (count > maxCount) {
            maxCount = count;
            peakPeriod = period;
        }
    }
    
    return { period: peakPeriod, count: maxCount };
}

// Calculate current streak
function calculateCurrentStreak(moodHistory) {
    if (moodHistory.length === 0) return { days: 0 };
    
    // Sort by date (newest first)
    const sortedHistory = moodHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Get unique dates
    const uniqueDates = [...new Set(sortedHistory.map(entry => {
        const date = new Date(entry.timestamp);
        return date.toDateString();
    }))];
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    // Check if there's an entry today or yesterday
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1;
        
        // Count consecutive days
        for (let i = 1; i < uniqueDates.length; i++) {
            const currentDate = new Date(uniqueDates[i]);
            const previousDate = new Date(uniqueDates[i - 1]);
            const diffTime = previousDate - currentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                streak++;
            } else {
                break;
            }
        }
    }
    
    return { days: streak };
}

// Calculate weekly progress
function calculateWeeklyProgress(moodHistory) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Get this week's entries
    const thisWeek = moodHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= oneWeekAgo;
    });
    
    // Get last week's entries
    const lastWeek = moodHistory.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate >= twoWeeksAgo && entryDate < oneWeekAgo;
    });
    
    if (lastWeek.length === 0) {
        return {
            change: `${thisWeek.length}`,
            description: 'First week of mood tracking!',
            trend: 'insight-positive'
        };
    }
    
    const thisWeekAvg = thisWeek.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / thisWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / lastWeek.length;
    
    const difference = thisWeekAvg - lastWeekAvg;
    const percentChange = Math.round((difference / lastWeekAvg) * 100);
    
    if (Math.abs(percentChange) < 5) {
        return {
            change: '→',
            description: 'Steady mood patterns this week',
            trend: 'insight-neutral'
        };
    } else if (percentChange > 0) {
        return {
            change: `+${percentChange}%`,
            description: 'Your mood improved this week! 🎉',
            trend: 'insight-positive'
        };
    } else {
        return {
            change: `${percentChange}%`,
            description: 'Focus on self-care this week 💜',
            trend: 'insight-negative'
        };
    }
}

// Create weekly mood breakdown chart
function createWeeklyChart(moodHistory) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = moodHistory.filter(entry => new Date(entry.timestamp) >= oneWeekAgo);
    
    // Count moods this week
    const moodCounts = {};
    thisWeek.forEach(entry => {
        const moodName = entry.mood.split(' ')[1] || 'Unknown';
        moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
    });
    
    const labels = Object.keys(moodCounts);
    const data = Object.values(moodCounts);
    const colors = labels.map(mood => {
        if (mood === 'Happy') return '#22c55e';
        if (mood === 'Neutral') return '#fbbf24';
        if (mood === 'Tired' || mood === 'Sad') return '#f97316';
        if (mood === 'Frustrated') return '#ef4444';
        return '#64748b';
    });
    
    // Destroy existing chart if it exists
    if (weeklyChartInstance) {
        weeklyChartInstance.destroy();
    }
    
    // Create new chart
    const ctx = weeklyChart.getContext('2d');
    weeklyChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(color => color + '80'),
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            family: 'Poppins'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = Math.round((context.parsed / thisWeek.length) * 100);
                            return `${context.label}: ${context.parsed} entries (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Load and display team mood trend
async function loadTeamMoodTrend() {
    try {
        // Get user team name first
        const userTeamResult = await ipcRenderer.invoke('get-user-team');
        
        if (!userTeamResult.success || !userTeamResult.teamName) {
            // Hide team mood trend card if no team
            teamMoodTrendCard.style.display = 'none';
            return;
        }
        
        // Show the card and loading state
        teamMoodTrendCard.style.display = 'block';
        teamMoodTrendLoading.style.display = 'block';
        
        // Get team mood data for the past 7 days from teamFeed
        const teamFeedData = await ipcRenderer.invoke('get-team-feed');
        
        // Filter for the past 7 days only
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentTeamMoods = teamFeedData.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= sevenDaysAgo;
        });
        
        // Hide loading state
        teamMoodTrendLoading.style.display = 'none';
        
        if (recentTeamMoods.length === 0) {
            // Show no data message
            teamMoodTrendInsight.innerHTML = `
                <div style="text-align: center; color: #94a3b8; font-style: italic;">
                    No team mood data available for the past 7 days.<br>
                    Encourage your team to start sharing their moods!
                </div>
            `;
            return;
        }
        
        // Create team mood trend chart
        createTeamMoodTrendChart(recentTeamMoods);
        
        // Generate dynamic insight
        generateTeamMoodInsight(recentTeamMoods);
        
    } catch (error) {
        console.error('Error loading team mood trend:', error);
        teamMoodTrendLoading.style.display = 'none';
        teamMoodTrendInsight.innerHTML = `
            <div style="text-align: center; color: #ef4444; font-style: italic;">
                Error loading team mood trends. Please try again later.
            </div>
        `;
    }
}

// Create team mood trend chart
function createTeamMoodTrendChart(teamMoodData) {
    const ctx = teamMoodTrendChart.getContext('2d');
    
    // Destroy existing chart if it exists
    if (teamMoodTrendChartInstance) {
        teamMoodTrendChartInstance.destroy();
    }
    
    // Group moods by day for the past 7 days
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const moodsByDay = {};
    
    // Initialize all days
    days.forEach(day => {
        moodsByDay[day] = [];
    });
    
    // Group moods by day
    teamMoodData.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayName = days[date.getDay()];
        const moodScore = getTeamMoodScore(entry.mood);
        moodsByDay[dayName].push(moodScore);
    });
    
    // Calculate average mood score for each day
    const chartData = days.map(day => {
        const dayMoods = moodsByDay[day];
        if (dayMoods.length === 0) return null; // No data for this day
        return dayMoods.reduce((sum, score) => sum + score, 0) / dayMoods.length;
    });
    
    // Create chart
    teamMoodTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Average Team Mood',
                data: chartData,
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#4ecdc4',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                spanGaps: false // Don't connect points when there's no data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            if (value === null) return 'No data';
                            
                            let moodText = 'Neutral';
                            if (value >= 4.5) moodText = 'Very Happy';
                            else if (value >= 3.5) moodText = 'Happy';
                            else if (value >= 2.5) moodText = 'Neutral';
                            else if (value >= 1.5) moodText = 'Sad/Tired';
                            else moodText = 'Frustrated';
                            
                            return `${context.label}: ${moodText} (${value.toFixed(1)}/5)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const moodLabels = ['😡', '😔', '😐', '😊', '😄'];
                            return moodLabels[value - 1] || '';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Generate dynamic team mood insight
function generateTeamMoodInsight(teamMoodData) {
    // Group moods by day and calculate averages
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyAverages = {};
    
    days.forEach(day => {
        const dayMoods = teamMoodData.filter(entry => {
            const date = new Date(entry.timestamp);
            return days[date.getDay()] === day;
        });
        
        if (dayMoods.length > 0) {
            const avgScore = dayMoods.reduce((sum, entry) => sum + getTeamMoodScore(entry.mood), 0) / dayMoods.length;
            dailyAverages[day] = avgScore;
        }
    });
    
    // Find highest and lowest mood days
    const daysWithData = Object.entries(dailyAverages);
    
    if (daysWithData.length === 0) {
        teamMoodTrendInsight.innerHTML = `
            <div style="text-align: center; color: #94a3b8; font-style: italic;">
                Not enough team mood data to generate insights.
            </div>
        `;
        return;
    }
    
    const highestDay = daysWithData.reduce((max, [day, score]) => 
        score > max.score ? {day, score} : max, {day: '', score: 0}
    );
    
    const lowestDay = daysWithData.reduce((min, [day, score]) => 
        score < min.score ? {day, score} : min, {day: '', score: 5}
    );
    
    // Calculate overall team mood trend
    const overallAvg = daysWithData.reduce((sum, [_, score]) => sum + score, 0) / daysWithData.length;
    
    // Generate insight text
    let insightText = '';
    
    if (highestDay.day && lowestDay.day && highestDay.day !== lowestDay.day) {
        insightText = `Your team's mood was the <span class="team-mood-insight-highlight">most positive on ${highestDay.day}</span> `;
        insightText += `and <span class="team-mood-insight-highlight">dipped on ${lowestDay.day}</span>. `;
        
        if (overallAvg >= 3.5) {
            insightText += `Overall, your team had a great week! Keep up the positive energy and consider celebrating your collective success.`;
        } else if (overallAvg >= 2.5) {
            insightText += `Consider checking in with your teammates and planning some team-building activities to boost morale.`;
        } else {
            insightText += `It looks like your team had a challenging week. Consider having a team meeting to discuss workload and support each other.`;
        }
    } else if (daysWithData.length === 1) {
        const [singleDay, score] = daysWithData[0];
        if (score >= 3.5) {
            insightText = `Your team shared positive moods on ${singleDay}! Encourage more regular mood sharing to build team awareness.`;
        } else {
            insightText = `Your team shared their mood on ${singleDay}. Regular check-ins can help build team support and collaboration.`;
        }
    } else {
        if (overallAvg >= 3.5) {
            insightText = `Your team maintained <span class="team-mood-insight-highlight">positive moods</span> throughout the week! Great teamwork and collaboration.`;
        } else if (overallAvg >= 2.5) {
            insightText = `Your team had a <span class="team-mood-insight-highlight">balanced week</span>. Consider team activities to boost collective energy.`;
        } else {
            insightText = `Your team faced some challenges this week. <span class="team-mood-insight-highlight">Consider scheduling a team check-in</span> to provide support.`;
        }
    }
    
    teamMoodTrendInsight.innerHTML = `
        <div style="text-align: center;">
            ${insightText}
        </div>
    `;
}

// Weekly Wellness Summary functionality
async function loadWeeklyWellnessSummary() {
    try {
        // Show loading state
        wellnessLoading.style.display = 'block';
        wellnessData.style.display = 'none';
        noWeeklyData.style.display = 'none';
        
        // Get mood history
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        
        // Filter for past 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyMoods = moodHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= sevenDaysAgo;
        });
        
        // Hide loading state
        wellnessLoading.style.display = 'none';
        
        if (weeklyMoods.length === 0) {
            // Show no data message
            noWeeklyData.style.display = 'block';
            return;
        }
        
        // Show data section
        wellnessData.style.display = 'block';
        
        // Analyze and display data
        displayMoodFrequency(weeklyMoods);
        displayWeeklyTrendChart(weeklyMoods);
        displayWellnessReport(weeklyMoods);
        
        console.log('Weekly Wellness Summary loaded successfully');
        
    } catch (error) {
        console.error('Error loading Weekly Wellness Summary:', error);
        wellnessLoading.style.display = 'none';
        noWeeklyData.style.display = 'block';
    }
}

// Weekly Wellness Report - core functionality (renamed from loadWeeklyWellnessSummary)
async function generateWeeklyReport() {
    try {
        // Show loading state
        wellnessLoading.style.display = 'block';
        wellnessData.style.display = 'none';
        noWeeklyData.style.display = 'none';
        
        // Get mood history
        const moodHistory = await ipcRenderer.invoke('get-mood-history');
        
        // Filter for past 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyMoods = moodHistory.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= sevenDaysAgo;
        });
        
        // Hide loading state
        wellnessLoading.style.display = 'none';
        
        if (weeklyMoods.length === 0) {
            // Show no data message
            noWeeklyData.style.display = 'block';
            return;
        }
        
        // Show data section
        wellnessData.style.display = 'block';
        
        // Analyze and display data
        displayMoodFrequency(weeklyMoods);
        displayWeeklyTrendChart(weeklyMoods);
        displayWellnessReport(weeklyMoods);
        
        // Save the timestamp of this report generation
        saveLastWeeklyReportTimestamp();
        
        console.log('Weekly Wellness Report generated successfully');
        
    } catch (error) {
        console.error('Error generating Weekly Wellness Report:', error);
        wellnessLoading.style.display = 'none';
        noWeeklyData.style.display = 'block';
    }
}

// Check if 7 days have passed since last weekly report
function shouldGenerateWeeklyReport() {
    const lastReportTimestamp = localStorage.getItem('lastWeeklyReportTimestamp');
    
    if (!lastReportTimestamp) {
        console.log('📊 No previous weekly report found - should generate first report');
        return true;
    }
    
    const lastReportDate = new Date(lastReportTimestamp);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const shouldGenerate = lastReportDate < sevenDaysAgo;
    
    if (shouldGenerate) {
        console.log('📊 7 days have passed since last weekly report - should generate new report');
    } else {
        console.log('📊 Weekly report was generated recently - no need to generate new report');
    }
    
    return shouldGenerate;
}

// Save the timestamp of the last weekly report generation
function saveLastWeeklyReportTimestamp() {
    const currentTimestamp = new Date().toISOString();
    localStorage.setItem('lastWeeklyReportTimestamp', currentTimestamp);
    console.log('📊 Weekly report timestamp saved:', currentTimestamp);
}

// Auto-generate weekly report on app launch (if needed)
async function checkAndGenerateWeeklyReportOnLaunch() {
    console.log('📊 Checking if weekly report should be auto-generated on app launch...');
    
    if (shouldGenerateWeeklyReport()) {
        console.log('📊 Auto-generating weekly report on app launch...');
        await generateWeeklyReport();
    }
}

// Manual weekly report generation (triggered by button)
async function manualGenerateWeeklyReport() {
    console.log('📊 Manual weekly report generation requested');
    await generateWeeklyReport();
}

// Display mood frequency analysis
function displayMoodFrequency(weeklyMoods) {
    // Count mood frequencies
    const moodCounts = {};
    weeklyMoods.forEach(entry => {
        const moodName = entry.mood;
        moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
    });
    
    // Sort by frequency
    const sortedMoods = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Show top 5 moods
    
    // Clear existing content
    moodFrequencyGrid.innerHTML = '';
    
    // Find max count for percentage calculation
    const maxCount = Math.max(...Object.values(moodCounts));
    
    // Create mood frequency items
    sortedMoods.forEach(([moodName, count]) => {
        const percentage = Math.round((count / weeklyMoods.length) * 100);
        const barWidth = (count / maxCount) * 100;
        
        const moodItem = document.createElement('div');
        moodItem.className = 'mood-frequency-item';
        
        const emoji = getMoodEmoji(moodName);
        const simpleName = moodName.split(' ')[1] || moodName;
        
        moodItem.innerHTML = `
            <div class="mood-emoji">${emoji}</div>
            <div class="mood-info">
                <div class="mood-name">${simpleName}</div>
                <div class="mood-count">${count} ${count === 1 ? 'time' : 'times'}</div>
            </div>
            <div class="mood-bar-container">
                <div class="mood-bar-fill" style="width: ${barWidth}%"></div>
            </div>
            <div class="mood-percentage">${percentage}%</div>
        `;
        
        moodFrequencyGrid.appendChild(moodItem);
    });
}

// Display weekly mood trend chart
function displayWeeklyTrendChart(weeklyMoods) {
    const ctx = weeklyWellnessChart.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.weeklyWellnessChartInstance) {
        window.weeklyWellnessChartInstance.destroy();
    }
    
    // Group moods by day
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const moodsByDay = {};
    
    // Initialize all days
    days.forEach(day => {
        moodsByDay[day] = [];
    });
    
    // Group moods by day
    weeklyMoods.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayName = days[date.getDay()];
        moodsByDay[dayName].push(getMoodValue(entry.mood));
    });
    
    // Calculate average mood value for each day
    const chartData = days.map(day => {
        const dayMoods = moodsByDay[day];
        if (dayMoods.length === 0) return null;
        return dayMoods.reduce((sum, mood) => sum + mood, 0) / dayMoods.length;
    });
    
    // Create chart
    window.weeklyWellnessChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Average Mood',
                data: chartData,
                borderColor: '#ff6b9d',
                backgroundColor: 'rgba(255, 107, 157, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ff6b9d',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            if (value === null) return 'No data';
                            
                            let moodText = 'Neutral';
                            if (value >= 4) moodText = 'Very Positive';
                            else if (value >= 3) moodText = 'Positive';
                            else if (value >= 2) moodText = 'Neutral';
                            else if (value >= 1) moodText = 'Negative';
                            else moodText = 'Very Negative';
                            
                            return `${context.label}: ${moodText}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            const moodLabels = ['😢', '😔', '😐', '😊', '😄'];
                            return moodLabels[value - 1] || '';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Display wellness report
function displayWellnessReport(weeklyMoods) {
    // Analyze dominant mood
    const moodCounts = {};
    weeklyMoods.forEach(entry => {
        const moodName = entry.mood.split(' ')[1] || entry.mood;
        moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
    });
    
    const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0];
    
    const [moodName, count] = dominantMood;
    const percentage = Math.round((count / weeklyMoods.length) * 100);
    
    // Calculate average mood value
    const avgMoodValue = weeklyMoods.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / weeklyMoods.length;
    
    // Generate wellness report
    let reportText = '';
    let reportEmoji = '';
    
    if (moodName === 'Happy' || avgMoodValue >= 3.5) {
        reportEmoji = '🌟';
        reportText = `You've had a <span class="wellness-report-highlight">mostly positive week</span>! With ${percentage}% of your mood entries being ${moodName.toLowerCase()}, you're doing great. Keep up the good energy and consider sharing your positivity with others around you.`;
    } else if (moodName === 'Sad' || moodName === 'Frustrated' || avgMoodValue <= 2.5) {
        reportEmoji = '💙';
        reportText = `This week seems to have been <span class="wellness-report-highlight">challenging</span> with ${percentage}% of your moods being ${moodName.toLowerCase()}. Remember that tough times don't last, but resilient people do. Try to take breaks, practice self-care, and focus on rest this weekend.`;
    } else if (moodName === 'Tired' || moodName === 'Neutral') {
        reportEmoji = '⚡';
        reportText = `Your week has been <span class="wellness-report-highlight">fairly balanced</span> with ${percentage}% of your entries being ${moodName.toLowerCase()}. This might be a good time to focus on activities that energize you and bring more joy into your routine.`;
    } else {
        reportEmoji = '🎭';
        reportText = `You've experienced a <span class="wellness-report-highlight">variety of moods</span> this week, which is completely normal! Your emotional awareness through mood tracking is already a great step toward better mental wellness.`;
    }
    
    // Additional insights
    const uniqueDays = new Set(weeklyMoods.map(entry => new Date(entry.timestamp).toDateString())).size;
    const avgEntriesPerDay = weeklyMoods.length / uniqueDays;
    
    let consistencyText = '';
    if (avgEntriesPerDay >= 2) {
        consistencyText = ' You\'ve been <span class="wellness-report-highlight">very consistent</span> with your mood tracking this week!';
    } else if (uniqueDays >= 5) {
        consistencyText = ' Great job staying <span class="wellness-report-highlight">consistent</span> with your mood tracking!';
    } else if (uniqueDays >= 3) {
        consistencyText = ' Try to log your mood more regularly to get better insights.';
    }
    
    // Display report
    wellnessReportContent.innerHTML = `
        <div class="wellness-report-text">
            <span class="wellness-report-emoji">${reportEmoji}</span>
            ${reportText}${consistencyText}
        </div>
    `;
}

// Initialize Weekly Wellness Summary when the mood entry view is shown
const originalShowFormHandler = showFormButton.onclick;
showFormButton.addEventListener('click', function() {
    // Call original handler
    if (originalShowFormHandler) originalShowFormHandler();
    
    // Switch to mood entry view
    moodEntryView.style.display = 'block';
    moodEntryView.style.opacity = '1';
    historyView.style.display = 'none';
    trendsView.style.display = 'none';
    insightsView.style.display = 'none';
    achievementsView.style.display = 'none';
    settingsView.style.display = 'none';
    
    // Update button states
    updateNavButtonStates('showForm');
    
    // Load Weekly Wellness Summary
    generateWeeklyReport();
});

// Load team insights
async function loadTeamInsights() {
    try {
        // Get user's current team
        const userTeamResult = await ipcRenderer.invoke('get-user-team');
        const teamInsightsContent = document.getElementById('teamInsightsContent');
        
        if (!userTeamResult.success || !userTeamResult.teamName) {
            // Show team join interface
            displayTeamJoinInterface(teamInsightsContent);
            return;
        }
        
        // User has a team, get team mood data
        const teamMoodResult = await ipcRenderer.invoke('get-team-mood-data', userTeamResult.teamName);
        
        if (teamMoodResult.success && teamMoodResult.data.length > 0) {
            // Display team insights
            displayTeamInsights(teamInsightsContent, userTeamResult.teamName, teamMoodResult.data);
        } else {
            // Show team with no data
            displayTeamNoData(teamInsightsContent, userTeamResult.teamName);
        }
        
    } catch (error) {
        console.error('Error loading team insights:', error);
        document.getElementById('teamInsightsContent').innerHTML = '<p style="color: #ef4444;">Error loading team insights. Please try again.</p>';
    }
}

// Display team join interface
function displayTeamJoinInterface(container) {
    container.innerHTML = `
        <div class="team-join-container">
            <p>👥 Join or create a team to see collaborative mood insights!</p>
            <p>Teams help you understand collective mood patterns and support each other's wellbeing.</p>
            <div class="team-join-form">
                <input type="text" id="teamNameInput" class="team-join-input" placeholder="Enter team name" maxlength="50">
                <button id="joinTeamBtn" class="team-join-btn">Join Team</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const teamNameInput = document.getElementById('teamNameInput');
    const joinTeamBtn = document.getElementById('joinTeamBtn');
    
    joinTeamBtn.addEventListener('click', handleJoinTeam);
    teamNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleJoinTeam();
        }
    });
}

// Handle joining a team
async function handleJoinTeam() {
    const teamNameInput = document.getElementById('teamNameInput');
    const teamName = teamNameInput.value.trim();
    
    if (!teamName) {
        alert('Please enter a team name');
        return;
    }
    
    try {
        const result = await ipcRenderer.invoke('save-user-team', teamName);
        
        if (result.success) {
            console.log('✅ Successfully joined team:', teamName);
            // Reload team insights
            loadTeamInsights();
        } else {
            alert('Failed to join team. Please try again.');
        }
    } catch (error) {
        console.error('Error joining team:', error);
        alert('Error joining team. Please try again.');
    }
}

// Display team insights
function displayTeamInsights(container, teamName, teamData) {
    const stats = calculateTeamStats(teamData);
    
    container.innerHTML = `
        <div class="team-current-team">
            🏆 Team: ${teamName}
            <button class="team-leave-btn" onclick="handleLeaveTeam()">Leave Team</button>
        </div>
        
        <div class="team-insights-grid">
            <div class="team-stat-card">
                <div class="team-stat-icon">👥</div>
                <div class="team-stat-value">${stats.totalMembers}</div>
                <div class="team-stat-label">Active Members</div>
            </div>
            
            <div class="team-stat-card">
                <div class="team-stat-icon">📊</div>
                <div class="team-stat-value">${stats.totalEntries}</div>
                <div class="team-stat-label">Total Entries</div>
            </div>
            
            <div class="team-stat-card">
                <div class="team-stat-icon">📈</div>
                <div class="team-stat-value">${stats.avgEntriesPerUser}</div>
                <div class="team-stat-label">Avg per Member</div>
            </div>
            
            <div class="team-stat-card">
                <div class="team-stat-icon">${stats.mostCommonMood.emoji}</div>
                <div class="team-stat-value">${stats.mostCommonMood.name}</div>
                <div class="team-stat-label">Most Common Mood</div>
            </div>
        </div>
        
        <div class="team-mood-breakdown">
            ${stats.moodBreakdown.map(mood => `
                <div class="team-mood-item">
                    <div class="team-mood-emoji">${mood.emoji}</div>
                    <div class="team-mood-name">${mood.name}</div>
                    <div class="team-mood-count">${mood.count}</div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 20px; padding: 16px; background: rgba(78, 205, 196, 0.1); border-radius: 12px; border: 1px solid rgba(78, 205, 196, 0.2);">
            <p style="color: #4ecdc4; font-size: 14px; margin: 0; text-align: center;">
                🔒 Privacy: Individual usernames and specific mood details are not shared - only aggregated team statistics.
            </p>
        </div>
    `;
}

// Display team with no data
function displayTeamNoData(container, teamName) {
    container.innerHTML = `
        <div class="team-current-team">
            🏆 Team: ${teamName}
            <button class="team-leave-btn" onclick="handleLeaveTeam()">Leave Team</button>
        </div>
        
        <div class="team-join-container">
            <p>👥 You're part of team "${teamName}"!</p>
            <p>No team mood data available yet. Start tracking moods and encourage your team members to join!</p>
            <div style="margin-top: 20px; padding: 16px; background: rgba(78, 205, 196, 0.1); border-radius: 12px; border: 1px solid rgba(78, 205, 196, 0.2);">
                <p style="color: #4ecdc4; font-size: 14px; margin: 0; text-align: center;">
                    💡 Share your team name "${teamName}" with your colleagues to get started!
                </p>
            </div>
        </div>
    `;
}

// Calculate team statistics
function calculateTeamStats(teamData) {
    const uniqueMembers = new Set(teamData.map(entry => entry.userId)).size;
    const totalEntries = teamData.length;
    const avgEntriesPerUser = Math.round(totalEntries / uniqueMembers);
    
    // Calculate mood frequencies
    const moodCounts = {};
    teamData.forEach(entry => {
        const moodName = entry.mood.split(' ')[1] || 'Unknown';
        moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
    });
    
    // Find most common mood
    let mostCommonMood = { name: 'Unknown', count: 0, emoji: '😐' };
    for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > mostCommonMood.count) {
            mostCommonMood = { 
                name: mood, 
                count: count,
                emoji: getMoodEmoji(`😊 ${mood}`)
            };
        }
    }
    
    // Create mood breakdown (top 6 moods)
    const moodBreakdown = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([mood, count]) => ({
            name: mood,
            count: count,
            emoji: getMoodEmoji(`😊 ${mood}`)
        }));
    
    return {
        totalMembers: uniqueMembers,
        totalEntries: totalEntries,
        avgEntriesPerUser: avgEntriesPerUser,
        mostCommonMood: mostCommonMood,
        moodBreakdown: moodBreakdown
    };
}

// Handle leaving a team
async function handleLeaveTeam() {
    if (!confirm('Are you sure you want to leave your team? You can always join again later.')) {
        return;
    }
    
    try {
        const result = await ipcRenderer.invoke('save-user-team', null);
        
        if (result.success) {
            console.log('✅ Successfully left team');
            // Reload team insights
            loadTeamInsights();
        } else {
            alert('Failed to leave team. Please try again.');
        }
    } catch (error) {
        console.error('Error leaving team:', error);
        alert('Error leaving team. Please try again.');
    }
}

// Make handleLeaveTeam globally accessible
window.handleLeaveTeam = handleLeaveTeam;

// Load team feed entries
async function loadTeamFeed() {
    try {
        teamFeedContent.innerHTML = '<div class="team-feed-loading">Loading team feed...</div>';
        
        const teamFeedEntries = await ipcRenderer.invoke('get-team-feed');
        
        if (teamFeedEntries.length === 0) {
            teamFeedContent.innerHTML = `
                <div class="team-feed-empty">
                    <div class="empty-icon">👥</div>
                    <p>No shared mood entries yet.</p>
                    <p>Check "Share this mood with my team" when logging your mood to start sharing!</p>
                </div>
            `;
            return;
        }
        
        displayTeamFeed(teamFeedEntries);
        
    } catch (error) {
        console.error('❌ Error loading team feed:', error);
        teamFeedContent.innerHTML = '<div class="team-feed-empty">Error loading team feed. Please try again.</div>';
    }
}

// Display team feed entries
function displayTeamFeed(teamFeedEntries) {
    // Sort entries by timestamp (newest first)
    const sortedEntries = teamFeedEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let feedHTML = '';
    
    sortedEntries.forEach((entry, index) => {
        // Get user display name (fallback to userId if no displayName)
        const userName = entry.displayName || entry.userId || 'Anonymous';
        
        feedHTML += `
            <div class="team-feed-entry">
                <div class="team-feed-header">
                    <div class="team-feed-user">👤 ${userName}</div>
                    <div class="team-feed-timestamp">${entry.timestamp}</div>
                </div>
                <div class="team-feed-mood">${entry.mood}</div>
                ${entry.note ? `<div class="team-feed-note">"${entry.note}"</div>` : ''}
            </div>
        `;
    });
    
    teamFeedContent.innerHTML = feedHTML;
}

 