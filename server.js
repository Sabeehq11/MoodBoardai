const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for Electron app
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// POST route to handle mood requests
app.post('/api/mood', (req, res) => {
    const { mood } = req.body;
    
    console.log('Received mood request:', mood);
    
    // Generate a simple response based on the mood
    let suggestion;
    
    if (mood.includes('😊')) {
        suggestion = "🎵 Keep that positive energy flowing! Maybe share your good vibes with someone special.";
    } else if (mood.includes('😐')) {
        suggestion = "🧘 Try a 5-minute meditation or short walk to reset your energy.";
    } else if (mood.includes('😫')) {
        suggestion = "☕ Take a break with a warm drink and consider a short walk outside for fresh air.";
    } else if (mood.includes('😠')) {
        suggestion = "✍️ Try journaling your thoughts or do some deep breathing exercises to release tension.";
    } else if (mood.includes('😔')) {
        suggestion = "💬 Reach out to someone you trust, or do something comforting like listening to your favorite music.";
    } else {
        suggestion = "🧘 Take a moment to breathe deeply and be kind to yourself.";
    }
    
    // Send JSON response
    res.json({
        suggestion: suggestion
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'LangGraph simulation server is running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 