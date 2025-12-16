// backend/server.js
require('dotenv').config(); // MUST BE AT THE VERY TOP

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const questionPaperRoutes = require('./routes/questionPaperNew'); 
const interviewRoutes = require('./routes/interviewRoutes'); 
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs'); // For uploads folder
const adminRoutes = require('./routes/adminRoutes')

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Ensure uploads directory exists at: ${uploadDir}`);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/question-papers', questionPaperRoutes);
app.use('/api/admin/question-papers', questionPaperRoutes);
app.use('/api/experiences', interviewRoutes);
app.use('/api/admin', adminRoutes); // <--- ADD THIS


// ===== LLM INTERVIEW BOT LOGIC =====
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY not found in .env file.");
    process.exit(1);
}

const conversationHistory = {};

async function getLLMResponseFromOpenRouter(messages, model = process.env.DEFAULT_MODEL) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenRouter error:", response.status, errorData);
        throw new Error(`OpenRouter returned ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error("Failed LLM call:", error);
      throw error;
    }
}

// INTERVIEW API
app.post('/api/interview', async (req, res) => {
  const { message, sessionId, context } = req.body;

  if (!message) return res.status(400).json({ error: "No message provided" });
  if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

  if (!conversationHistory[sessionId]) {
    conversationHistory[sessionId] = [];

    if (context && context.role && context.level) {
      const systemPrompt = (
        `You are an interview bot for a ${context.level} ${context.role} role. ` +
        "Your interview must flow as follows: 1. Start with 'Introduce Yourself'. " +
        "2. Follow with questions about the candidate's 'Projects' and 'Technical Skills'. " +
        "3. Conclude with 'Behavioral/HR Questions'. " +
        "Ask one question at a time. Provide brief, constructive feedback on the previous answer before asking the next question. " +
        "Use the format: 'Feedback: ... Next Question: ...'"
      );
      conversationHistory[sessionId].push({ role: "system", content: systemPrompt });

      if (message === "start_interview") {
        const initialPrompt = `Let's start the interview. Please introduce yourself.`;
        conversationHistory[sessionId].push({ role: "user", content: initialPrompt });

        try {
          const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
          conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });
          return res.json({ response: llmResponse });
        } catch (error) {
          return res.status(500).json({ error: "Failed to get initial response" });
        }
      }
    }
  }

  if (message !== "start_interview") {
    conversationHistory[sessionId].push({ role: "user", content: message });
  }

  try {
    const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
    conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });
    return res.json({ response: llmResponse });
  } catch {
    return res.status(500).json({ error: "Failed to get response from LLM" });
  }
});


// --- NEW CHATBOT API ---
app.post('/api/chatbot', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) return res.status(400).json({ error: "No message provided" });
  if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

  if (!conversationHistory[sessionId]) {
    conversationHistory[sessionId] = [];
    const botPrompt =
      "You are a Company Insights Assistant. Provide helpful hiring trends, interview FAQs, job guidance. Keep responses short.Dont answer questions outside company insights or career advice.";
    conversationHistory[sessionId].push({ role: "system", content: botPrompt });
  }

  conversationHistory[sessionId].push({ role: "user", content: message });

  try {
    const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
    conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });
    return res.json({ response: llmResponse });
  } catch {
    return res.status(500).json({ error: "Failed to get response from LLM" });
  }
});


// ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Backend Server is Connected and Sucessfully running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));