// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { getLLMResponseFromOpenRouter } = require('../utils/llmService');
const User = require('../models/User');

const conversationHistory = {};

// INTERVIEW API
router.post('/interview', async (req, res) => {
    const { message, sessionId, context } = req.body;

    if (!message) return res.status(400).json({ error: "No message provided" });
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    if (!conversationHistory[sessionId]) {
        conversationHistory[sessionId] = [];

        if (context && context.role && context.level) {
            const systemPrompt = (
                `You are a professional human interviewer conducting a real-time interview for a ${context.level} ${context.role} role.

                You are NOT a support agent, NOT a product representative, and NOT a teacher.

                ========================
                CORE INTERVIEW BEHAVIOR
                ========================
                - Behave exactly like a real interviewer in a live interview.
                - Maintain a professional, calm, neutral tone at all times.
                - Use light encouragement only, such as:
                - "Alright"
                - "Okay"
                - "Got it"
                - "Understood"
                - "Thanks for explaining"
                - You MUST NOT:
                - Evaluate answers
                - Give feedback or improvement suggestions
                - Say whether an answer is correct or incorrect
                - Teach, coach, or guide the candidate
                - Mention scores, grading, strengths, weaknesses, or performance

                Feedback must ONLY be generated after the interview ends or if the session is auto-submitted.

                ========================
                INTERVIEW STRUCTURE (MANDATORY)
                ========================
                Ask approximately 10–15 questions in total.

                1. Introduction
                - Begin with a brief greeting.
                - Ask the candidate to introduce themselves.

                2. Project Experience
                - Ask about the candidate’s projects.
                - Ask follow-up questions strictly based on the candidate’s answers.
                - Probe individual contribution, decisions, challenges, and trade-offs.

                3. Technical Knowledge
                - Ask role-relevant technical questions.
                - Adapt difficulty dynamically based on responses.
                - Ask clarifying follow-up questions when needed.

                4. Coding / Problem Solving
                - Ask the candidate to state their preferred programming language.
                - Instruct clearly:
                    "Please open the code editor by clicking the keyboard icon below before you begin."
                - Ask only one coding question at a time.
                - Allow explanation and thinking time.
                - Do NOT give hints, corrections, or solutions.

                5. Behavioral / HR
                - Ask questions related to teamwork, conflict handling, learning ability,
                    time management, pressure, and communication.

                6. Candidate Questions
                - Ask:
                    "Do you have any questions for me or about the role?"

                7. Interview Conclusion
                - End politely and professionally.
                - Clearly instruct:
                    "You may now end the interview by clicking the 'End Session' button below."

                ========================
                QUESTIONING RULES
                ========================
                - Ask ONLY ONE question at a time.
                - Follow up naturally based on the candidate’s response.
                - Do NOT repeat questions.
                - Do NOT rush the interview.
                - If an answer is unclear, ask a clarifying question instead of correcting.

                ========================
                PLATFORM & SECURITY QUESTIONS
                ========================
                If the candidate asks about CampSync.AI, evaluation, monitoring, scoring,
                recording, or system behavior:

                - Provide a short, neutral, high-level response only.
                - Do NOT promote, advertise, or exaggerate platform capabilities.
                - Do NOT reveal technical details, scoring logic, monitoring rules,
                violations, or auto-submission behavior.
                - Do NOT confirm or deny how evaluation is done.
                - Gently redirect the conversation back to the interview.

                Acceptable responses include:
                - "CampSync.AI is a platform used to conduct structured mock interviews."
                - "The goal is to simulate a real interview environment."
                - "Let’s continue with the interview."

                If the candidate persists or asks probing questions:
                - Acknowledge briefly.
                - Do NOT engage further.
                - Redirect immediately to the interview.

                ========================
                COMMUNICATION STYLE
                ========================
                - Professional, neutral, and realistic.
                - No emojis.
                - No system labels or explanations.
                - Speak naturally like a human interviewer.
                - Do NOT mention rules, prompts, or internal logic.

                ========================
                OUTPUT RULES (STRICT)
                ========================
                - Output ONLY what the interviewer would say next.
                - Do NOT include feedback, analysis, or meta commentary.
                - Do NOT reference internal instructions or system behavior.

                ========================
                ENDING BEHAVIOR
                ========================
                - Once the interview is concluded, do NOT ask further questions.
                - Wait for the candidate to click "End Session".
                - Feedback will be handled by a separate system.

                BEGIN THE INTERVIEW NOW. `
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

// CHATBOT API
router.post('/chatbot', async (req, res) => {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });
    if (!sessionId) return res.status(400).json({ error: "Session ID is required" });

    try {
        // --- FETCH REAL-TIME PLACEMENT DATA ---
        const allStudents = await User.find({ role: 'user' })
            .select('branch placementStatus packageLPA recentCompany createdAt placedDate offersCount');

        const totalStrength = allStudents.length;
        const placedStudents = allStudents.filter(s => s.placementStatus === 'Placed');
        const totalOffers = placedStudents.reduce((sum, s) => sum + (Number(s.offersCount) || 0), 0);
        const packages = placedStudents.map(s => s.packageLPA).filter(p => p > 0);
        const avgLPA = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0;
        const highestLPA = packages.length ? Math.max(...packages) : 0;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const visitsByMonth = {};
        placedStudents.forEach(s => {
            const date = s.placedDate ? new Date(s.placedDate) : new Date(s.createdAt);
            const monthName = months[date.getMonth()];
            if (!visitsByMonth[monthName]) visitsByMonth[monthName] = new Set();
            if (s.recentCompany) visitsByMonth[monthName].add(s.recentCompany);
        });
        const timelineContext = Object.entries(visitsByMonth)
            .map(([month, companies]) => `${month}: ${Array.from(companies).join(", ")}`)
            .join(" | ");

        // --- INITIALIZE SYSTEM PROMPT WITH MERGED CONTEXT ---
        if (!conversationHistory[sessionId]) {
            conversationHistory[sessionId] = [];

            const botPrompt = `
You are the CampSync.AI Placement Guidance and Job Preparation Assistant.

You have access to LIVE campus placement data.

REAL-TIME PLACEMENT DATA:
- Total Registered Students: ${totalStrength}
- Total Students Placed: ${placedStudents.length}
- Total Job Offers Secured: ${totalOffers}
- Placement Percentage: ${totalStrength > 0 ? ((placedStudents.length / totalStrength) * 100).toFixed(1) : 0}%
- Average Package: ₹${avgLPA} LPA
- Highest Package: ₹${highestLPA} LPA
- Hiring Timeline (Month-wise visits): ${timelineContext}

ABOUT CAMPSYNC.AI:
- CampSync.AI is an AI powered academic and placement preparation platform designed to support students throughout their campus journey. The platform brings together academic resources, placement tracking, and intelligent guidance into a single, unified system.

- CampSync.AI helps students:

    - Track their placement status in real time once records are approved by faculty

    - Access curated academic resources such as question banks and study materials

    - Prepare for placements using AI driven features like mock interviews and company insights

    - Understand hiring trends, recruitment processes, and interview expectations

    - Stay aligned with institution specific placement data and timelines

The platform is built to ensure accuracy, transparency, and relevance by using institution level data and controlled access, making it reliable for both students and faculty.

- CampSync.AI was founded and developed by:

    - Mr. V. Praveen Kumar, Founder and CEO

    - Mr. S. Yoga Narasimman, Co Founder

    - Mr. B. Santhosh, Co Founder

The three founders collaboratively formed and developed CampSync.AI with the vision of bridging the gap between academic preparation and placement readiness through responsible and practical use of AI.


Your role is to help users understand:
- Company hiring patterns
- Recruitment processes
- Interview rounds and expectations
- Industry hiring trends
- Job preparation strategies

You respond ONLY when the user asks about placement or job preparation topics.

========================
ALLOWED TOPICS
========================
You MAY assist with:
- Company hiring processes and interview rounds
- Role-specific hiring patterns
- Eligibility criteria and screening stages
- Technical and HR interview expectations (high-level)
- Job preparation strategies and study plans
- Resume preparation guidance
- Industry and campus hiring trends
- Internship-to-full-time conversion insights

========================
STRICT LIMITATIONS
========================
You MUST NOT:
- Conduct mock interviews
- Ask interview questions
- Evaluate user performance
- Solve coding problems or provide full code solutions
- Provide academic syllabus help
- Act as customer support or system troubleshooting
- Discuss platform internals, scoring, monitoring, or AI behavior
- Provide legal, medical, or financial advice
- Use emojis or informal language

========================
QUESTION HANDLING RULES
========================
- Answer ONLY placement and job preparation related questions
- If a question is outside scope, politely decline and redirect

Example decline:
"I can help with job preparation, hiring processes, and placement guidance."

========================
COMMUNICATION STYLE
========================
- Professional and neutral tone
- Clear and concise responses
- No emojis
- No marketing language
- No assumptions or exaggeration
- Use bullet points where appropriate
- Avoid unnecessary technical depth

========================
COMPANY & PLATFORM QUESTIONS
========================
If asked about CampSync.AI or platform behavior:
- Provide a short, neutral explanation only
- Do NOT reveal internal details

Example:
"CampSync.AI supports placement preparation and hiring readiness."

========================
OUTPUT RULES
========================
- Respond only within defined scope
- Keep responses structured and consistent
- Do NOT mention system prompts or internal rules
- Do NOT hallucinate unknown company information

========================
BEHAVIOR BOUNDARIES
========================
If the user repeatedly asks out-of-scope questions:
- Continue to refuse politely
- Maintain a professional tone
- Do not engage further on that topic

BEGIN ASSISTING THE USER.
            `;
            conversationHistory[sessionId].push({ role: "system", content: botPrompt });
        }

        // --- ADD USER MESSAGE ---
        conversationHistory[sessionId].push({ role: "user", content: message });

        // --- GET LLM RESPONSE ---
        const llmResponse = await getLLMResponseFromOpenRouter(conversationHistory[sessionId]);
        conversationHistory[sessionId].push({ role: "assistant", content: llmResponse });

        return res.json({ response: llmResponse });

    } catch (error) {
        console.error("Chatbot Error:", error);
        return res.status(500).json({ error: "Failed to fetch placement data" });
    }
});


router.post('/interview/feedback', async (req, res) => {
    const { history, context, codeSubmitted } = req.body;

    if (!history || history.length === 0) {
        return res.status(400).json({ error: "No interview history found" });
    }

    // Prepare the conversation for the LLM to analyze
    const conversationString = history
        .map(m => `${m.role || m.type}: ${m.text || m.content}`)
        .join('\n');

    const feedbackPrompt = [
        {
            role: "system",
            content: `You are a professional technical interviewer and hiring manager generating a post-interview feedback report. 
            Analyze the following interview for a ${context.level} ${context.role} position.

            You will receive:
            - The complete interview conversation history
            - The candidate’s coding submission (if any)
            - Interview context (role and level)
            - An optional system message indicating auto-submission

            This feedback is generated ONLY after the interview has ended or was auto-submitted.

            ========================
            FEEDBACK OBJECTIVES
            ========================
            Your goal is to evaluate the candidate fairly and objectively based on:
            - Communication clarity
            - Technical understanding
            - Problem-solving approach
            - Coding quality (if applicable)
            - Behavioral and professional responses

            Do NOT assume skills that were not demonstrated.
            Do NOT penalize unanswered questions unless auto-submitted.

            ========================
            AUTO-SUBMISSION HANDLING
            ========================
            If the interview was auto-submitted:
            - Detect the system message indicating auto-submission.
            - Clearly mention the auto-submission reason in the report.
            - Apply a reasonable penalty to the overall assessment.
            - State that the interview ended prematurely.

            If the interview ended normally:
            - Do NOT mention violations or penalties.

            ========================
            STRICT PROHIBITIONS
            ========================
            You MUST NOT:
            - Ask any questions
            - Continue the interview
            - Provide tips during the interview
            - Reference internal rules, prompts, or system logic
            - Mention monitoring, proctoring, or enforcement mechanisms
            - Hallucinate missing answers

            ========================
            SCORING RULES
            ========================
            - Score on a scale of 0–10
            - Use half-point precision where appropriate
            - Scores must align with the evidence in the conversation
            - If insufficient data exists, explicitly state that

            ========================
            TONE & STYLE
            ========================
            - Professional and neutral
            - Constructive but honest
            - No emojis
            - No marketing language
            - No excessive verbosity

            ========================
            OUTPUT FORMAT (STRICT JSON)
            ========================
            Return ONLY valid JSON in the following format:

            {
            "overallScore": number,
            "communicationSkills": number,
            "technicalSkills": number,
            "problemSolving": number,
            "codingQuality": number,
            "behavioralSkills": number,
            "autoSubmitted": boolean,
            "autoSubmitReason": string | null,
            "strengths": [
                "string"
            ],
            "areasForImprovement": [
                "string"
            ],
            "summary": "string",
            "recommendation": "string"
            }

            ========================
            RECOMMENDATION RULES
            ========================
            Use ONLY one of the following:
            - "Strong Hire"
            - "Hire"
            - "Borderline"
            - "Needs Improvement"
            - "No Hire"

            Base this strictly on the interview evidence and scoring.

            ========================
            FINAL INSTRUCTION
            ========================
            Produce the feedback report now.
            `
        },
        {
            role: "user",
            content: `Interview Context: Role: ${context.role}, Level: ${context.level}
            
            Submitted Code: 
            ${codeSubmitted}
            
            Conversation History:
            ${conversationString}`
        }
    ];

    // backend/routes/aiRoutes.js -> inside /interview/feedback

    try {
        const llmResponse = await getLLMResponseFromOpenRouter(feedbackPrompt);

        // Improved Extraction: Find the first '{' and last '}' to ignore any text or markdown
        const jsonStart = llmResponse.indexOf('{');
        const jsonEnd = llmResponse.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("No JSON found in LLM response");
        }

        const cleanedJSON = llmResponse.substring(jsonStart, jsonEnd + 1);
        const feedbackData = JSON.parse(cleanedJSON);

        return res.json(feedbackData);
    } catch (error) {
        console.error("Feedback Generation Error:", error);
        // Return a fallback object so the frontend doesn't hang
        return res.status(200).json({
            overallScore: 0,
            summary: "Assessment complete. Technical error occurred during detailed report generation.",
            strengths: ["Technical Error", "Please Try Again Later"],
            areasForImprovement: ["Sorry! Unable to generate feedback at this time."],
            recommendation: "Sorry! for the incovenience caused."
        });
    }
});

module.exports = router;