import "dotenv/config";
import {
    AngularNodeAppEngine,
    createNodeRequestHandler,
    isMainModule,
    writeResponseToNodeResponse,
} from "@angular/ssr/node";
import {GoogleGenAI, HarmCategory, HarmBlockThreshold} from "@google/genai";
import express from "express";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, "../browser");

const app = express();
const angularApp = new AngularNodeAppEngine();

app.post("/api/gemini/chat", express.json(), async (req, res) => {
    try {
        const apiKey = process.env["GEMINI_API_KEY"];
        if (!apiKey) {
            res.status(500).send("Missing GEMINI_API_KEY");
            return;
        }

        const {messages} = req.body as {
            messages: {role: "user" | "model"; text: string}[];
        };

        const ai = new GoogleGenAI({apiKey});

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        // System Instruction for Fitness Coach Persona
        const systemInstruction = `You are an elite fitness coach and nutritionist.
Your name is "Elevate Coach".
Your goal is to help users achieve their fitness goals through scientific, practical, and motivating advice.
Your tone is encouraging, strict when necessary, and always focused on safety and form.
If a user asks about non-fitness topics, politely steer them back to health and wellness.`;

        // Safety Settings
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

        // Context Management: Keep only the last 20 messages to manage tokens
        const recentMessages = messages.slice(-20);

        const stream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction,
                safetySettings,
            },
            contents: recentMessages.map((m) => ({
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
    } catch (error) {
        console.error("Gemini error:", error);
        res.status(500).end("Gemini error");
    }
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
    express.static(browserDistFolder, {
        maxAge: "1y",
        index: false,
        redirect: false,
    })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use("/**", (req, res, next) => {
    angularApp
        .handle(req)
        .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
    const port = process.env["PORT"] || 4000;
    app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);