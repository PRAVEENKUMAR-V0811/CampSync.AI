// backend/Interviewbot/server.js
import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000' }));

// DeepSeek / OpenRouter Configuration
const LLM_API_URL = 'https://openrouter.ai/api/v1/chat/completions'; 
const LLM_MODEL = 'deepseek/deepseek-chat-v3-0324:free'; // Free DeepSeek model

// Function to call DeepSeek LLM
async function callLLM(messages) {
    try {
        const response = await axios.post(
            LLM_API_URL,
            {
                model: LLM_MODEL,
                messages: messages,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling LLM API:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get response from LLM.');
    }
}

// --- Interview Endpoint ---
app.post('/api/interview', async (req, res) => {
    const { messages, interviewType, preferredRole, skillFocus, experienceLevel, action } = req.body;

    try {
        let llmResponseContent;
        if (action === 'start') {
            const systemPrompt = `You are an AI Mock Interviewer. Conduct a realistic interview based on the user’s selected domain (${interviewType}), role (${preferredRole}), primary skill (${skillFocus}), and experience level (${experienceLevel}).
            Your first question should be a general opening question relevant to the selected criteria.
            Ensure your questions are specific to the chosen skill (${skillFocus}).
            Keep your responses concise and professional.
            DO NOT ask about strengths/weaknesses or "tell me about yourself" if the interview type is not HR.`;

            const initialMessages = [{ role: 'system', content: systemPrompt }];
            llmResponseContent = await callLLM(initialMessages);

        } else if (action === 'question' || action === 'hint') {
            const systemPrompt = `You are an AI Mock Interviewer. Conduct a realistic interview based on the user’s selected domain (${interviewType}), role (${preferredRole}), primary skill (${skillFocus}), and experience level (${experienceLevel}).
            Ask one question at a time.
            Use the candidate’s previous answers to create contextual follow-up questions.
            Ensure your questions are specific to the chosen skill (${skillFocus}).
            Keep your responses concise and professional, like a real interviewer.
            ${action === 'hint' ? 'The candidate has asked for a hint for the last question. Provide a small, concise hint or clarification without giving away the full answer. Do NOT ask another question.' : ''}
            DO NOT ask about strengths/weaknesses or "tell me about yourself" if the interview type is not HR.`;

            const fullLlmMessages = [{ role: 'system', content: systemPrompt }, ...messages.slice(1)];
            llmResponseContent = await callLLM(fullLlmMessages);
        } else {
            return res.status(400).json({ error: 'Invalid action specified.' });
        }

        res.json({ response: llmResponseContent });
    } catch (error) {
        console.error('Error in /api/interview:', error);
        res.status(500).json({ error: error.message || 'Failed to process interview request.' });
    }
});

// --- Feedback Endpoint ---
app.post('/api/feedback', async (req, res) => {
    const { messages, interviewType, preferredRole, skillFocus, experienceLevel } = req.body;

    const feedbackSystemPrompt = `You are an expert HR professional and an AI Interview feedback generator. Based on the following interview conversation for a candidate applying for a ${preferredRole} role with ${experienceLevel} experience focusing on ${skillFocus} (interview type: ${interviewType}), provide a concise performance summary.
    Output ONLY a JSON object with the following keys: "strengths", "weaknesses", "suggestions", "confidence" (integer 1-5).
    Ensure the feedback is specific to the conversation content, skills discussed, and experience level.
    Confidence rating: 5 is excellent, 1 is very weak.`;

    try {
        const llmOutput = await callLLM(messages);
        const jsonMatch = llmOutput.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('LLM did not return valid JSON for feedback.');
        }
        const feedbackData = JSON.parse(jsonMatch[0]);

        if (!feedbackData.strengths || !feedbackData.weaknesses || !feedbackData.suggestions || !feedbackData.confidence) {
             throw new Error('LLM feedback JSON is missing required fields.');
        }

        res.json(feedbackData);
    } catch (error) {
        console.error('Error generating feedback from LLM:', error);
        res.status(500).json({ error: error.message || 'Failed to generate feedback from LLM.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
});