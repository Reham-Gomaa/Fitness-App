// // import {Component, inject, signal} from "@angular/core";
// // import {GeminiIntegration} from "../../../core/services/gemini-int/gemini-integration";

// // @Component({
// //     selector: "app-chat-bot",
// //     imports: [],
// //     templateUrl: "./chat-bot.html",
// //     styleUrl: "./chat-bot.scss",
// // })
// // export class ChatBot {
// //     private _geminiIntegration = inject(GeminiIntegration);
// //     response = signal<string>("");

// //     submit(text: string) {
// //         const response = this._geminiIntegration.generateText(text);
// //         response.then((result) => {
// //             this.response.set(result);
// //         });
// //     }
// // }

import {Component, computed, inject, signal} from "@angular/core";
import {
    ChatMessage,
    ChatSession,
    GeminiIntegration,
} from "../../../core/services/gemini-int/gemini-integration";
import {DatePipe, SlicePipe} from "@angular/common";

type ViewState = "new" | "history" | "chat";
@Component({
    selector: "app-chat-bot",
    imports: [SlicePipe, DatePipe],
    templateUrl: "./chat-bot.html",
    styleUrl: "./chat-bot.scss",
})
export class ChatBot {
    private gemini = inject(GeminiIntegration);

    messages = signal<ChatMessage[]>([]);
    chatHistory = signal<ChatSession[]>([]);
    isStreaming = signal(false);

    async send(prompt: string) {
        if (!prompt.trim()) return;

        // Push user message
        this.messages.update((m) => [...m, {role: "user", text: prompt}]);

        // Prepare placeholder for model message
        let modelIndex = -1;
        this.messages.update((m) => {
            modelIndex = m.length;
            return [...m, {role: "model", text: ""}];
        });

        this.isStreaming.set(true);

        try {
            for await (const chunk of this.gemini.sendMessage(prompt)) {
                this.messages.update((m) => {
                    const updated = [...m];
                    updated[modelIndex] = {
                        ...updated[modelIndex],
                        text: updated[modelIndex].text + chunk,
                    };
                    return updated;
                });
            }
        } finally {
            this.isStreaming.set(false);
        }
    }

    getHistory() {
        // Get the history from the service
        this.chatHistory.set(this.gemini.allChatSessions());
    }

    loadSession(id: number) {
        if (this.gemini.loadSession(id)) {
            // Clear current messages and reload from service
            this.messages.set([...this.gemini.currentHistory()]);
        }
    }

    deleteSession(id: number) {
        this.gemini.deleteSession(id);
        this.getHistory(); // Refresh the history display
    }

    // Optional: Format history for display
    formattedHistory = computed(() => {
        return this.chatHistory().map((session) => ({
            id: session.id,
            title: session.title || "Untitled Chat",
            date: new Date(session.createdAt).toLocaleString(),
            messageCount: session.messages.length,
            preview:
                session.messages.length > 0
                    ? session.messages[0].text.substring(0, 100) + "..."
                    : "No messages",
        }));
    });

    reset() {
        this.gemini.resetConversation();
        this.messages.set([]);
    }
}
