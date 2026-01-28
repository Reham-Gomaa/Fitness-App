import {isPlatformBrowser} from "@angular/common";
import {HttpClient, HttpDownloadProgressEvent, HttpEventType} from "@angular/common/http";
import {inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
// rxjs
import {catchError, filter, finalize, map, of} from "rxjs";
// constants
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
    private readonly http = inject(HttpClient);
    private activeSessionId = signal<number | null>(null);
    readonly currentSessionId = this.activeSessionId.asReadonly();

    private currentModelBuffer = "";
    // Current conversation history
    private history = signal<ChatMessage[]>([]);
    // Error state
    error = signal<string | null>(null);

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

    saveToStorage(): void {
        if (!isPlatformBrowser(this._PLATFORM_ID)) return;

        try {
            localStorage.setItem(StorageKeys.STORAGE_KEY, JSON.stringify(this.chatHistory()));
        } catch (error) {
            console.error("Failed to save chat history to localStorage:", error);
        }
    }

    persistActiveSession() {
        const messages = this.history();
        if (!messages.length) return;

        const now = Date.now();
        const activeId = this.activeSessionId();

        if (activeId) {
            this.chatHistory.update((sessions: ChatSession[]) =>
                sessions.map((session: ChatSession) =>
                    session.id === activeId ? {...session, messages, updatedAt: now} : session
                )
            );
        } else {
            const newSession: ChatSession = {
                id: Date.now() + Math.random(),
                messages,
                createdAt: now,
                updatedAt: now,
                title: this.generateSessionTitle(messages),
            };

            this.chatHistory.update((s: ChatSession[]) => [newSession, ...s]);
            this.activeSessionId.set(newSession.id);
        }

        this.saveToStorage();
    }

    sendMessage$(prompt: string) {
        // Reset error
        this.error.set(null);

        // 1️⃣ push user message immediately
        this.history.update((h) => [...h, {role: "user", text: prompt}]);

        this.currentModelBuffer = "";
        let lastLength = 0;

        return this.http
            .post(
                "/api/gemini/chat",
                {messages: this.history()},
                {
                    observe: "events",
                    responseType: "text",
                    reportProgress: true,
                }
            )
            .pipe(
                filter((event) => event.type === HttpEventType.DownloadProgress),
                map((event) => {
                    const progressEvent = event as HttpDownloadProgressEvent;
                    const text = progressEvent.partialText ?? "";
                    const chunk = text.substring(lastLength);
                    lastLength = text.length;

                    if (chunk) {
                        this.currentModelBuffer += chunk;
                    }

                    return this.currentModelBuffer;
                }),
                catchError((err) => {
                    this.error.set("Failed to send message. Please try again.");
                    console.error("Gemini API Error:", err);
                    return of(""); // Return empty string to keep stream alive or handle gracefully
                }),
                finalize(() => {
                    // 2️⃣ commit model message ONCE
                    if (this.currentModelBuffer.trim()) {
                        this.history.update((h) => [
                            ...h,
                            {role: "model", text: this.currentModelBuffer},
                        ]);
                    }

                    this.persistActiveSession();
                    this.currentModelBuffer = "";
                })
            );
    }

    resetConversation(): number {
        const currentMessages = this.history();
        if (currentMessages.length === 0) return this.chatHistory().length;

        const now = Date.now();
        const activeId = this.activeSessionId();

        if (activeId) {
            // 🔁 Update existing session
            this.chatHistory.update((sessions: ChatSession[]) =>
                sessions.map((session: ChatSession) =>
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
                id: Date.now() + Math.random(),
                messages: [...currentMessages],
                createdAt: now,
                updatedAt: now,
                title: this.generateSessionTitle(currentMessages),
            };

            this.chatHistory.update((sessions: ChatSession[]) => [newSession, ...sessions]);
            this.activeSessionId.set(newSession.id);
        }

        this.saveToStorage();

        // Reset current conversation
        this.history.set([]);
        this.activeSessionId.set(null);

        return this.chatHistory().length;
    }

    generateSessionTitle(messages: ChatMessage[]): string {
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
        this.chatHistory.update((sessions: ChatSession[]) =>
            sessions.filter((session: ChatSession) => session.id !== id)
        );
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
        this.chatHistory.update((sessions: ChatSession[]) =>
            sessions.map((session: ChatSession) =>
                session.id === id ? {...session, title, updatedAt: Date.now()} : session
            )
        );
        this.saveToStorage();
    }
}
