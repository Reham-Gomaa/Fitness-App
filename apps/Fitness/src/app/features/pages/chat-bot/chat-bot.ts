import {Component, computed, DestroyRef, inject, signal} from "@angular/core";
import {DatePipe, SlicePipe} from "@angular/common";
// rxjs
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
// Shared_Services
import {
    ChatMessage,
    ChatSession,
    GeminiIntegration,
} from "../../../core/services/gemini-int/gemini-integration";

@Component({
    selector: "app-chat-bot",
    imports: [SlicePipe, DatePipe],
    templateUrl: "./chat-bot.html",
    styleUrl: "./chat-bot.scss",
})
export class ChatBot {
    private gemini = inject(GeminiIntegration);
    private destroyRef = inject(DestroyRef);

    messages = signal<ChatMessage[]>([]);
    chatHistory = signal<ChatSession[]>([]);
    isStreaming = signal<boolean>(false);

    send(prompt: string) {
        if (!prompt.trim()) return;

        this.messages.update((m) => [...m, {role: "user", text: prompt}]);

        let modelIndex = -1;
        this.messages.update((m) => {
            modelIndex = m.length;
            return [...m, {role: "model", text: ""}];
        });

        this.isStreaming.set(true);

        this.gemini
            .sendMessage$(prompt)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (chunk) => {
                    this.messages.update((m) => {
                        const updated = [...m];
                        updated[modelIndex] = {
                            ...updated[modelIndex],
                            text: chunk,
                        };
                        return updated;
                    });
                },
                complete: () => {
                    this.isStreaming.set(false);
                },
                error: () => {
                    this.isStreaming.set(false);
                },
            });
    }

    getHistory() {
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
