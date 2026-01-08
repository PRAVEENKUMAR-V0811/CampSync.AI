// backend/utils/llmService.js
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

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

module.exports = { getLLMResponseFromOpenRouter };