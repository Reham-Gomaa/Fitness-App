import {isPlatformBrowser} from "@angular/common";
import {inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import {GoogleGenerativeAI} from "@google/generative-ai";

export type ChatRole = "user" | "model";

export interface ChatMessage {
    role: ChatRole;
    text: string;
}

export interface ChatSession {
    id: number;
    title?: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY = "gemini_chat_history";

@Injectable({
    providedIn: "root",
})
export class GeminiIntegration {
    private readonly _PLATFORM_ID = inject(PLATFORM_ID);

    // Current conversation history
    private history = signal<ChatMessage[]>([]);

    // All chat sessions
    chatHistory = signal<ChatSession[]>([]);

    // Expose as read-only signals
    readonly currentHistory = this.history.asReadonly();
    readonly allChatSessions = this.chatHistory.asReadonly();

    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage(): void {
        if (!isPlatformBrowser(this._PLATFORM_ID)) return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const sessions = JSON.parse(stored) as ChatSession[];
                this.chatHistory.set(sessions);
                console.log("old history from storage", this.chatHistory());
            }
        } catch (error) {
            console.error("Failed to load chat history from localStorage:", error);
            // Clear corrupted data
            if (isPlatformBrowser(this._PLATFORM_ID)) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }

    private saveToStorage(): void {
        if (!isPlatformBrowser(this._PLATFORM_ID)) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.chatHistory()));
        } catch (error) {
            console.error("Failed to save chat history to localStorage:", error);
        }
    }

    async *sendMessage(prompt: string): AsyncGenerator<string> {
        this.history.update((h) => [...h, {role: "user", text: prompt}]);

        const response = await fetch("/api/gemini/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                messages: this.history(),
            }),
        });

        if (!response.body) {
            throw new Error("No response stream");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullResponse += chunk;
            yield chunk;
        }

        this.history.update((h) => [...h, {role: "model", text: fullResponse}]);
    }

    resetConversation(): number {
        console.log("chat history", this.chatHistory());
        console.log("history", this.history());

        const currentMessages = this.history();

        // Only save if there are messages
        if (currentMessages.length > 0) {
            const newSession: ChatSession = {
                id: Date.now(), // Use timestamp for unique ID
                messages: [...currentMessages],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                title: this.generateSessionTitle(currentMessages),
            };

            // Update chat history
            this.chatHistory.update((sessions) => [newSession, ...sessions]);

            // Save to storage
            this.saveToStorage();
        }

        // Clear current history
        this.history.set([]);

        return this.chatHistory().length;
    }

    private generateSessionTitle(messages: ChatMessage[]): string {
        // Generate a title from the first user message or use a default
        const firstUserMessage = messages.find((msg) => msg.role === "user");
        if (firstUserMessage) {
            const text = firstUserMessage.text.trim();
            return text.length > 50 ? text.substring(0, 47) + "..." : text;
        }
        return `Chat ${new Date().toLocaleDateString()}`;
    }

    getSessionById(id: number): ChatSession | undefined {
        return this.chatHistory().find((session) => session.id === id);
    }

    loadSession(id: number): boolean {
        const session = this.getSessionById(id);
        if (session) {
            this.history.set([...session.messages]);
            return true;
        }
        return false;
    }

    deleteSession(id: number): void {
        this.chatHistory.update((sessions) => sessions.filter((session) => session.id !== id));
        this.saveToStorage();
    }

    clearAllSessions(): void {
        this.chatHistory.set([]);
        this.history.set([]);

        if (isPlatformBrowser(this._PLATFORM_ID)) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    updateSessionTitle(id: number, title: string): void {
        this.chatHistory.update((sessions) =>
            sessions.map((session) =>
                session.id === id ? {...session, title, updatedAt: Date.now()} : session
            )
        );
        this.saveToStorage();
    }
}

// import { isPlatformBrowser } from "@angular/common";
// import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from "@angular/core";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { ApiKey } from "../../../../../api-key";

// export type ChatRole = "user" | "model";

// export interface ChatMessage {
//     role: ChatRole;
//     text: string;
// }

// export interface ChatSession {
//     id: number;
//     title?: string;
//     messages: ChatMessage[];
//     createdAt?: number;
//     updatedAt?: number;
// }

// @Injectable({
//     providedIn: "root",
// })
// export class GeminiIntegration {
//     private _PLATFORM_ID = inject(PLATFORM_ID);
//     private genAI = new GoogleGenerativeAI(ApiKey.googleApiKey);
//     private model = this.genAI.getGenerativeModel({
//         model: "gemini-2.5-flash",
//     });

//     private history: WritableSignal<ChatMessage[]> = signal([]);
//     private chatHistory: WritableSignal<ChatSession[]> = signal([]);

//     constructor() {
//         if (!isPlatformBrowser(this._PLATFORM_ID)) return;
//         if (localStorage.getItem("History")) {
//             this.chatHistory().push(JSON.parse(localStorage.getItem("History")!));
//         }
//         console.log(this.chatHistory());
//     }

//     async *sendMessage(prompt: string): AsyncGenerator<string> {
//         // Add user message to history
//         this.history().push({role: "user", text: prompt});

//         const result = await this.model.generateContentStream({
//             contents: this.history().map((msg) => ({
//                 role: msg.role,
//                 parts: [{text: msg.text}],
//             })),
//         });

//         let fullResponse = "";

//         for await (const chunk of result.stream) {
//             const text = chunk.text();
//             if (text) {
//                 fullResponse += text;
//                 yield text;
//             }
//         }

//         // Save model response into history
//         this.history().push({role: "model", text: fullResponse});
//     }

//     resetConversation() {
//         console.log(this.chatHistory());
//         console.log(this.history());

//         this.chatHistory().push({
//             id: this.chatHistory.length + 1,
//             messages: this.history(),
//         });
//         localStorage.setItem("History", JSON.stringify(this.chatHistory));
//         this.history.set([]);
//     }
// }
