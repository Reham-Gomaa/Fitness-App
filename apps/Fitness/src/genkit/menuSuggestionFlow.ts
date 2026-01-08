import "dotenv/config";
import {GoogleGenAI} from "@google/genai";

const apiKey = process.env["GEMINI_API_KEY"];
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in .env");
}

const ai = new GoogleGenAI({apiKey});

interface ChatHistory {
    role: string;
    content: string;
}

export async function chatWithGemini(
    userMessage: string,
    conversationHistory?: ChatHistory[],
    retryCount: number = 0
): Promise<{response: string}> {
    try {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            config: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096,
            },
        });

        if (conversationHistory && conversationHistory.length > 0) {
            for (const msg of conversationHistory) {
                if (msg.role === "user") {
                    await chat.sendMessage({message: msg.content});
                }
            }
        }

        const response = await chat.sendMessage({message: userMessage});
        const text = response.text || "No response generated";

        return {response: text};
    } catch (error: any) {
        if (error?.status === 429 && retryCount < 3) {
            const waitTime = Math.pow(2, retryCount) * 1000;
            console.log(
                `Rate limited. Retrying in ${waitTime / 1000}s (attempt ${retryCount + 1}/3)`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            return chatWithGemini(userMessage, conversationHistory, retryCount + 1);
        }

        if (error?.status === 429) {
            throw new Error("Rate limit exceeded. Please wait a minute and try again.");
        }

        console.error("Error in chatWithGemini:", error);
        throw new Error(error?.message || "Failed to generate response");
    }
}

export async function streamChatWithGemini(
    userMessage: string,
    conversationHistory: ChatHistory[] | undefined,
    onChunk: (chunk: string) => void
): Promise<void> {
    try {
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            config: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096,
            },
        });

        if (conversationHistory && conversationHistory.length > 0) {
            for (const msg of conversationHistory) {
                if (msg.role === "user") {
                    await chat.sendMessage({message: msg.content});
                }
            }
        }

        const stream = await chat.sendMessageStream({message: userMessage});

        for await (const chunk of stream) {
            const chunkText = chunk.text || "";
            onChunk(chunkText);
        }
    } catch (error: any) {
        console.error("Error in streamChatWithGemini:", error);
        throw new Error(error?.message || "Failed to stream response");
    }
}
