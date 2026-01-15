import type {VercelRequest, VercelResponse} from "@vercel/node";
import {GoogleGenAI, HarmCategory, HarmBlockThreshold} from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).send("Missing GEMINI_API_KEY");
    }

    try {
        const {messages} = req.body as {
            messages: {role: "user" | "model"; text: string}[];
        };

        const ai = new GoogleGenAI({apiKey});

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        const systemInstruction = `
You are an elite fitness coach and nutritionist.
Your name is "Elevate Coach".
Focus on safety, form, and sustainable progress.
        `;

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
        ];

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction,
                safetySettings,
            },
            contents: messages.slice(-20).map((m) => ({
                role: m.role,
                parts: [{text: m.text}],
            })),
        });

        for await (const chunk of stream) {
            if (chunk.text) {
                res.write(chunk.text);
            }
        }

        res.end();
    } catch (err) {
        console.error("Gemini error:", err);
        res.status(500).end("Gemini error");
    }
}
