import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize ChatOpenAI (you'll need to set OPENAI_API_KEY in your .env file)
const openai = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
  modelName: "gpt-4o-mini", // Using the more cost-effective model
});

// Define the state interface for our workflow using Annotation
const GraphState = Annotation.Root({
  moodEntry: Annotation(),
  analysis: Annotation(),
  insight: Annotation(),
  error: Annotation(),
});

// Node 1: Analyze the mood entry
async function analyzeMood(state) {
  console.log("🧠 LangGraph: Analyzing mood...");
  
  try {
    const { moodEntry } = state;
    
    const systemPrompt = `You are an empathetic mood analyst and life coach. 
    Analyze the user's mood entry and provide insight into their emotional state.
    Keep your analysis concise but meaningful, focusing on:
    - The underlying emotions
    - Potential causes or triggers
    - Overall emotional tone
    
    Respond in 1-2 sentences maximum.`;
    
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Analyze this mood entry: "${moodEntry.mood}${moodEntry.note ? ' - ' + moodEntry.note : ''}"`)
    ];
    
    const response = await openai.invoke(messages);
    
    return {
      ...state,
      analysis: response.content
    };
  } catch (error) {
    console.error("❌ LangGraph: Error in analyzeMood:", error);
    return {
      ...state,
      error: `Analysis failed: ${error.message}`
    };
  }
}

// Node 2: Generate motivational insight
async function generateInsight(state) {
  console.log("💡 LangGraph: Generating motivational insight...");
  
  try {
    const { moodEntry, analysis } = state;
    
    if (state.error) {
      // Skip if there was an error in previous step
      return state;
    }
    
    const systemPrompt = `You are a supportive life coach who provides personalized, actionable motivational insights.
    Based on the mood analysis, create a short, encouraging message that:
    - Acknowledges their current emotional state
    - Offers a positive perspective or reframe
    - Provides a specific, actionable suggestion
    - Is warm, empathetic, and genuine
    
    Keep it to 2-3 sentences maximum. Make it personal and specific to their situation.`;
    
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Mood: "${moodEntry.mood}${moodEntry.note ? ' - ' + moodEntry.note : ''}"
      Analysis: "${analysis}"
      
      Please provide a motivational insight:`)
    ];
    
    const response = await openai.invoke(messages);
    
    return {
      ...state,
      insight: response.content
    };
  } catch (error) {
    console.error("❌ LangGraph: Error in generateInsight:", error);
    return {
      ...state,
      error: `Insight generation failed: ${error.message}`
    };
  }
}

// Create the workflow graph
const workflow = new StateGraph(GraphState)
  .addNode("analyzeMood", analyzeMood)
  .addNode("generateInsight", generateInsight)
  .addEdge("analyzeMood", "generateInsight")
  .addEdge("generateInsight", END)
  .setEntryPoint("analyzeMood");

// Compile the graph
const app = workflow.compile();

// Main function to run the LangGraph workflow
export async function runMoodAnalysisFlow(moodEntry) {
  console.log("🚀 LangGraph: Starting mood analysis flow...");
  
  try {
    // Validate input
    if (!moodEntry || !moodEntry.mood) {
      throw new Error("Invalid mood entry: mood is required");
    }
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("⚠️ LangGraph: OPENAI_API_KEY not found, returning fallback insight");
      return {
        success: false,
        insight: "✨ Remember: Every mood is temporary, and you have the strength to navigate through any emotional weather. Take a moment to breathe and be kind to yourself.",
        analysis: "OpenAI API key not configured",
        error: "OPENAI_API_KEY not found in environment variables"
      };
    }
    
    // Run the workflow
    const result = await app.invoke({
      moodEntry,
      analysis: null,
      insight: null,
      error: null
    });
    
    console.log("✅ LangGraph: Workflow completed successfully");
    
    return {
      success: !result.error,
      insight: result.insight || "Unable to generate insight at this time.",
      analysis: result.analysis || "Unable to complete analysis.",
      error: result.error || null
    };
    
  } catch (error) {
    console.error("❌ LangGraph: Workflow failed:", error);
    
    // Return a fallback insight
    return {
      success: false,
      insight: "✨ Every emotion you feel is valid and temporary. Take a deep breath, and remember that you're stronger than you know.",
      analysis: "Workflow error occurred",
      error: error.message
    };
  }
}

// Test function for development (can be removed in production)
export async function testMoodAnalysisFlow() {
  const testMoodEntry = {
    mood: "😔 Sad",
    note: "Feeling overwhelmed with work and personal life",
    timestamp: new Date().toLocaleString()
  };
  
  console.log("🧪 Testing LangGraph flow with sample mood entry...");
  const result = await runMoodAnalysisFlow(testMoodEntry);
  console.log("Test result:", result);
  return result;
} 