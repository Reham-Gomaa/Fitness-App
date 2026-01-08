import {isPlatformBrowser} from "@angular/common";
import {inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import {StorageKeys} from "../../constants/storage.config";

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

@Injectable({
    providedIn: "root",
})
export class GeminiIntegration {
    private readonly _PLATFORM_ID = inject(PLATFORM_ID);
    private activeSessionId = signal<number | null>(null);
    readonly currentSessionId = this.activeSessionId.asReadonly();

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
            const stored = localStorage.getItem(StorageKeys.STORAGE_KEY);
            if (stored) {
                const sessions = JSON.parse(stored) as ChatSession[];
                this.chatHistory.set(sessions);
            }
        } catch (error) {
            console.error("Failed to load chat history from localStorage:", error);
            // Clear corrupted data
            if (isPlatformBrowser(this._PLATFORM_ID)) {
                localStorage.removeItem(StorageKeys.STORAGE_KEY);
            }
        }
    }

    private saveToStorage(): void {
        if (!isPlatformBrowser(this._PLATFORM_ID)) return;

        try {
            localStorage.setItem(StorageKeys.STORAGE_KEY, JSON.stringify(this.chatHistory()));
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
        const currentMessages = this.history();
        if (currentMessages.length === 0) return this.chatHistory().length;

        const now = Date.now();
        const activeId = this.activeSessionId();

        if (activeId) {
            // 🔁 Update existing session
            this.chatHistory.update((sessions) =>
                sessions.map((session) =>
                    session.id === activeId
                        ? {
                              ...session,
                              messages: [...currentMessages],
                              updatedAt: now,
                          }
                        : session
                )
            );
        } else {
            // 🆕 Create new session
            const newSession: ChatSession = {
                id: now,
                messages: [...currentMessages],
                createdAt: now,
                updatedAt: now,
                title: this.generateSessionTitle(currentMessages),
            };

            this.chatHistory.update((sessions) => [newSession, ...sessions]);
            this.activeSessionId.set(newSession.id);
        }

        this.saveToStorage();

        // Reset current conversation
        this.history.set([]);
        this.activeSessionId.set(null);

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
            this.activeSessionId.set(id);
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
            localStorage.removeItem(StorageKeys.STORAGE_KEY);
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
