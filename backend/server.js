// // backend/server.js
// require('dotenv').config(); // Load environment variables first
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Your existing auth routes

// // For OpenRouter API interaction
// const { v4: uuidv4 } = require('uuid'); // For generating unique session IDs

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors()); // Enable CORS for all origins
// app.use(express.json()); // Body parser for JSON requests

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);


// // --- LLM Interview Bot Logic ---
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// if (!OPENROUTER_API_KEY) {
//   console.error("OPENROUTER_API_KEY not found in .env file or environment variables.");
//   process.exit(1); // Exit if critical API key is missing
// }

// // In-memory storage for conversation history per session
// // In a production app, you'd use a database or a proper session management system
// const conversationHistory = {}; // { sessionId: [{ role: 'user', content: '...' }] }

// /**
//  * Calls the OpenRouter API to get a response from the LLM.
//  * @param {Array<Object>} messages - Array of message objects for the conversation history.
//  * @param {string} model - The LLM model to use (e.g., 'mistralai/mistral-7b-instruct:free').
//  * @returns {Promise<string>} - The content of the LLM's response.
//  */
// async function getLLMResponseFromOpenRouter(messages, model = "mistralai/mistral-7b-instruct:free") {
//   try {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: model,
//         messages: messages,
//         stream: false, // We want a single response, not streaming
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("OpenRouter API error:", response.status, errorData);
//       throw new Error(`OpenRouter API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
//     }

//     const data = await response.json();
//     return data.choices[0].message.content;

//   } catch (error) {
//     console.error("Error communicating with OpenRouter API:", error);
//     throw error; // Re-throw to be caught by the route handler
//   }
// }

// // Interview API Route
// app.post('/api/interview', async (req, res) => {
//   const { message, sessionId, context } = req.body; // context = { role, level }

//   if (!message) {
//     return res.status(400).json({ error: "No message provided" });
//   }
//   if (!sessionId) {
//       return res.status(400).json({ error: "Session ID is required" });
//   }

//   // Initialize history for new sessions
//   if (!conversationHistory[sessionId]) {
//     conversationHistory[sessionId] = [];
//     if (context && context.role && context.level) {
//       const systemPrompt = (
//         `You are an interview bot for a ${context.level} ${context.role} role. ` +
//         "Ask one question at a time. Provide brief, constructive feedback on the previous answer, " +
//         "and then ask the next interview question. Format your response clearly: 'Feedback: [your feedback] Next Question: [your question]'."
//       );
//       conversationHistory[sessionId].push({ role: "system", content: systemPrompt });

//       // If this is the very first request (indicated by message == "start_interview")
//       // we generate the first question based on the context.
//       if (message === "start_interview") {
//         const initialQuestionPrompt = (
//           `Generate the first interview question for a ` +
//           `${context.level} ${context.role} role. Focus on a common and foundational topic.`
//         );
//         conversationHistory[sessionId].push({ role: "user", content: initialQuestionPrompt });

//         try {
//           const llmResponseContent = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//           conversationHistory[sessionId].push({ role: "assistant", content: llmResponseContent });
//           return res.json({ response: llmResponseContent });
//         } catch (error) {
//           console.error("Failed to get initial LLM response:", error);
//           return res.status(500).json({ error: "Failed to get initial LLM response" });
//         }
//       }
//     }
//   }

//   // Add user message to history, unless it was the special "start_interview" message
//   if (message !== "start_interview") {
//     conversationHistory[sessionId].push({ role: "user", content: message });
//   }

//   // Get LLM response for ongoing conversation
//   try {
//     const llmResponseContent = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//     conversationHistory[sessionId].push({ role: "assistant", content: llmResponseContent });
//     return res.json({ response: llmResponseContent });
//   } catch (error) {
//     console.error("Failed to get LLM response:", error);
//     return res.status(500).json({ error: "Failed to get response from LLM" });
//   }
// });

// // --- NEW LLM Chatbot Logic ---
// app.post('/api/chatbot', async (req, res) => {
//   const { message, sessionId } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "No message provided" });
//   }
//   if (!sessionId) {
//       return res.status(400).json({ error: "Session ID is required" });
//   }

//   // Initialize history for new sessions or new chatbot context
//   if (!conversationHistory[sessionId]) {
//     conversationHistory[sessionId] = [];
//     // Add a system message specific to this chatbot's role
//     const chatbotSystemPrompt = (
//         "You are a friendly Company Insights Assistant. " +
//         "Your goal is to provide helpful information about hiring trends, FAQs, interview patterns, " +
//         "and general career advice related to companies. Keep responses concise and informative. " +
//         "Do not answer questions outside of company insights or general career advice."
//     );
//     conversationHistory[sessionId].push({ role: "system", content: chatbotSystemPrompt });
//   }

//   // Add user message to history
//   conversationHistory[sessionId].push({ role: "user", content: message });

//   // Get LLM response
//   try {
//     // You might want to use a different model here if your chatbot has a specific domain,
//     // or just use the default general-purpose model.
//     const llmResponseContent = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//     conversationHistory[sessionId].push({ role: "assistant", content: llmResponseContent });
//     return res.json({ response: llmResponseContent });
//   } catch (error) {
//     console.error("Failed to get LLM response for chatbot:", error);
//     return res.status(500).json({ error: "Failed to get response from LLM" });
//   }
// });

// // Simple root route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });


// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // backend/server.js
// require('dotenv').config(); // Load environment variables first
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Your existing auth routes
// const questionPaperRoutes = require('./routes/questionPaper'); // New question paper routes
// const { v4: uuidv4 } = require('uuid'); // For generating unique session IDs
// const path = require('path'); // For path operations, especially with multer

// // Ensure the 'uploads' directory exists
// const fs = require('fs');
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }


// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors()); // Enable CORS for all origins
// app.use(express.json()); // Body parser for JSON requests
// // Serve static files from the 'uploads' directory (optional, but good for testing)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/question-papers', questionPaperRoutes); // Mount general question paper routes
// app.use('/api/admin/question-papers', questionPaperRoutes); // Mount admin-specific routes (note: paths are relative to this mount point)


// // --- LLM Interview Bot Logic ---
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// if (!OPENROUTER_API_KEY) {
//   console.error("OPENROUTER_API_KEY not found in .env file or environment variables.");
//   process.exit(1); // Exit if critical API key is missing
// }

// // In-memory storage for conversation history per session
// const conversationHistory = {}; // { sessionId: [{ role: 'user', content: '...' }] }

// /**
//  * Calls the OpenRouter API to get a response from the LLM.
//  * @param {Array<Object>} messages - Array of message objects for the conversation history.
//  * @param {string} model - The LLM model to use (e.g., 'mistralai/mistral-7b-instruct:free').
//  * @returns {Promise<string>} - The content of the LLM's response.
//  */
// async function getLLMResponseFromOpenRouter(messages, model = "mistralai/mistral-7b-instruct:free") {
//   try {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: model,
//         messages: messages,
//         stream: false, // We want a single response, not streaming
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("OpenRouter API error:", response.status, errorData);
//       throw new Error(`OpenRouter API responded with status ${response.status}: ${JSON.stringify(errorData)}`);
//     }

//     const data = await response.json();
//     return data.choices[0].message.content;

//   } catch (error) {
//     console.error("Error communicating with OpenRouter API:", error);
//     throw error; // Re-throw to be caught by the route handler
//   }
// }

// // Interview API Route
// app.post('/api/interview', async (req, res) => {
//   const { message, sessionId, context } = req.body; // context = { role, level }

//   if (!message) {
//     return res.status(400).json({ error: "No message provided" });
//   }
//   if (!sessionId) {
//       return res.status(400).json({ error: "Session ID is required" });
//   }

//   // Initialize history for new sessions
//   if (!conversationHistory[sessionId]) {
//     conversationHistory[sessionId] = [];
//     if (context && context.role && context.level) {
//       const systemPrompt = (
//         `You are an interview bot for a ${context.level} ${context.role} role. ` +
//         "Ask one question at a time. Provide brief, constructive feedback on the previous answer, " +
//         "and then ask the next interview question. Format your response clearly: 'Feedback: [your feedback] Next Question: [your question]'."
//       );
//       conversationHistory[sessionId].push({ role: "system", content: systemPrompt });

//       // If this is the very first request (indicated by message == "start_interview")
//       // we generate the first question based on the context.
//       if (message === "start_interview") {
//         const initialQuestionPrompt = (
//           `Generate the first interview question for a ` +
//           `${context.level} ${context.role} role. Focus on a common and foundational topic.`
//         );
//         conversationHistory[sessionId].push({ role: "user", content: initialQuestionPrompt });

//         try {
//           const llmResponseContent = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//           conversationHistory[sessionId].push({ role: "assistant", content: llmResponseContent });
//           return res.json({ response: llmResponseContent });
//         } catch (error) {
//           console.error("Failed to get initial LLM response:", error);
//           return res.status(500).json({ error: "Failed to get initial LLM response" });
//         }
//       }
//     }
//   }

//   // Add user message to history, unless it was the special "start_interview" message
//   if (message !== "start_interview") {
//     conversationHistory[sessionId].push({ role: "user", content: message });
//   }

//   // Get LLM response for ongoing conversation
//   try {
//     const llmResponseContent = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//     conversationHistory[sessionId].push({ role: "assistant", content: llmResponseContent });
//     return res.json({ response: llmResponseContent });
//   } catch (error) {
//     console.error("Failed to get LLM response:", error);
//     return res.status(500).json({ error: "Failed to get response from LLM" });
//   }
// });

// // --- NEW LLM Chatbot Logic ---
// app.post('/api/chatbot', async (req, res) => {
//   const { message, sessionId } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "No message provided" });
//   }
//   if (!sessionId) {
//       return res.status(400).json({ error: "Session ID is required" });
//   }

//   // Initialize history for new sessions or new chatbot context
//   if (!conversationHistory[sessionId]) {
//     conversationHistory[sessionId] = [];
//     // Add a system message specific to this chatbot's role
//     const chatbotSystemPrompt = (
//         "You are a friendly Company Insights Assistant. " +
//         "Your goal is to provide helpful information about hiring trends, FAQs, interview patterns, " +
//         "and general career advice related to companies. Keep responses concise and informative. " +
//         "Do not answer questions outside of company insights or general career advice."
//     );
//     conversationHistory[sessionId].push({ role: "system", content: chatbotSystemPrompt });
//   }

//   // Add user message to history
//   conversationHistory[sessionId].push({ role: "user", content: message });

//   // Get LLM response
//   try {
//     // You might want to use a different model here if your chatbot has a specific domain,
//     // or just use the default general-purpose model.
//     const llmResponseContent = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//     conversationHistory[sessionId].push({ role: "assistant", content: llmResponseContent });
//     return res.json({ response: llmResponseContent });
//   } catch (error) {
//     console.error("Failed to get LLM response for chatbot:", error);
//     return res.status(500).json({ error: "Failed to get response from LLM" });
//   }
// });

// // Simple root route
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });


// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// backend/server.js
// require('dotenv').config(); // MUST BE AT THE VERY TOP

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); 
// const questionPaperRoutes = require('./routes/questionPaper'); 
// const { v4: uuidv4 } = require('uuid');
// const path = require('path');
// const fs = require('fs'); // For uploads folder

// // Ensure 'uploads' folder exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log(`Ensure uploads directory exists at: ${uploadDir}`);
// }

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/question-papers', questionPaperRoutes);
// app.use('/api/admin/question-papers', questionPaperRoutes);


// // ===== LLM INTERVIEW BOT LOGIC =====
// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// if (!OPENROUTER_API_KEY) {
//     console.error("OPENROUTER_API_KEY not found in .env file.");
//     process.exit(1);
// }

// const conversationHistory = {};

// async function getLLMResponseFromOpenRouter(messages, model = "mistralai/mistral-7b-instruct:free") {
//     try {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           model: model,
//           messages: messages,
//           stream: false,
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("OpenRouter error:", response.status, errorData);
//         throw new Error(`OpenRouter returned ${response.status}`);
//       }

//       const data = await response.json();
//       return data.choices[0].message.content;

//     } catch (error) {
//       console.error("Failed LLM call:", error);
//       throw error;
//     }
// }

// // INTERVIEW API
// app.post('/api/interview', async (req, res) => {
//   const { message, sessionId, context } = req.body;

//   if (!message) return res.status(400).json({ error: "No message provided" });
//   if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

//   if (!conversationHistory[sessionId]) {
//     conversationHistory[sessionId] = [];

//     if (context && context.role && context.level) {
//       const systemPrompt = (
//         `You are an interview bot for a ${context.level} ${context.role} role. ` +
//         "Ask one question at a time. Provide brief feedback and then ask the next question. " +
//         "Use format: 'Feedback: ... Next Question: ...'"
//       );
//       conversationHistory[sessionId].push({ role: "system", content: systemPrompt });

//       if (message === "start_interview") {
//         const initialPrompt = `Generate the first interview question for a ${context.level} ${context.role}.`;
//         conversationHistory[sessionId].push({ role: "user", content: initialPrompt });

//         try {
//           const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//           conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });
//           return res.json({ response: llmResponse });
//         } catch (error) {
//           return res.status(500).json({ error: "Failed to get initial response" });
//         }
//       }
//     }
//   }

//   if (message !== "start_interview") {
//     conversationHistory[sessionId].push({ role: "user", content: message });
//   }

//   try {
//     const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//     conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });
//     return res.json({ response: llmResponse });
//   } catch {
//     return res.status(500).json({ error: "Failed to get response from LLM" });
//   }
// });


// // --- NEW CHATBOT API ---
// app.post('/api/chatbot', async (req, res) => {
//   const { message, sessionId } = req.body;

//   if (!message) return res.status(400).json({ error: "No message provided" });
//   if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

//   if (!conversationHistory[sessionId]) {
//     conversationHistory[sessionId] = [];
//     const botPrompt =
//       "You are a Company Insights Assistant. Provide helpful hiring trends, interview FAQs, job guidance. Keep responses short.Dont answer questions outside company insights or career advice.";
//     conversationHistory[sessionId].push({ role: "system", content: botPrompt });
//   }

//   conversationHistory[sessionId].push({ role: "user", content: message });

//   try {
//     const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
//     conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });
//     return res.json({ response: llmResponse });
//   } catch {
//     return res.status(500).json({ error: "Failed to get response from LLM" });
//   }
// });

// // Add this AFTER your chatbot routes in server.js

// app.post('/api/feedback', async (req, res) => {
//   const { sessionId, context } = req.body;
//   const sessionHistory = conversationHistory[sessionId];

//   if (!sessionHistory) {
//     return res.status(400).json({ error: 'No interview session found for feedback generation.' });
//   }

//   try {
//     const feedbackPrompt = [
//       {
//         role: "system",
//         content: `You are an interview evaluator. Based on the conversation below, provide structured feedback including strengths, weaknesses, and improvement suggestions.`
//       },
//       ...sessionHistory
//     ];

//     const feedback = await getLLMResponseFromOpenRouter(feedbackPrompt);
//     res.json({ feedback });
//   } catch (error) {
//     console.error("Feedback generation failed:", error);
//     res.status(500).json({ error: "Failed to generate feedback." });
//   }
// });



// // ROOT ROUTE
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// backend/server.js
require('dotenv').config(); // MUST BE AT THE VERY TOP

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const questionPaperRoutes = require('./routes/questionPaper'); 
const interviewRoutes = require('./routes/interviewRoutes'); 
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs'); // For uploads folder

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


// ===== LLM INTERVIEW BOT LOGIC =====
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY not found in .env file.");
    process.exit(1);
}

const conversationHistory = {};

async function getLLMResponseFromOpenRouter(messages, model = "mistralai/mistral-7b-instruct:free") {
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

// Removed the /api/feedback endpoint as per request.

// ROOT ROUTE
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));