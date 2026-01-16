import {
    Component,
    signal,
    inject,
    DestroyRef,
    ViewChild,
    ElementRef,
    AfterViewChecked,
    OnInit,
} from "@angular/core";
import {TranslatePipe} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {MainButton} from "./../../../../shared/components/ui/main-button/main-button";
import {
    GeminiIntegration,
    ChatMessage,
    ChatSession,
} from "../../../../core/services/gemini-int/gemini-integration";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Translation} from "../../../../core/services/translation/translation";

@Component({
    selector: "app-bot",
    imports: [MainButton, TranslatePipe, FormsModule],
    templateUrl: "./bot.html",
    styleUrl: "./bot.scss",
})
export class Bot implements AfterViewChecked, OnInit {
    @ViewChild("chatContainer") private chatContainer?: ElementRef;

    private gemini = inject(GeminiIntegration);
    private destroyRef = inject(DestroyRef);
    private translation = inject(Translation);

    chatMessage = "";
    isActiveChat = signal<boolean>(false);
    messages = signal<ChatMessage[]>([]);
    isStreaming = signal<boolean>(false);
    chatHistory = signal<ChatSession[]>([]);
    isSidebarOpen = signal<boolean>(false);
    private shouldScroll = false;
    private typingTimer: any;
    private fullResponseText = "";
    private displayedResponseText = "";
    editingSessionId = signal<number | null>(null);
    editingTitle = signal<string>("");

    ngOnInit() {
        this.chatHistory.set(this.gemini.allChatSessions());
    }

    ngAfterViewChecked() {
        if (this.shouldScroll) {
            this.scrollToBottom();
            this.shouldScroll = false;
        }
    }

    openChat() {
        this.isActiveChat.update((v) => !v);
    }

    sendMessage() {
        const message = this.chatMessage.trim();
        if (!message || this.isStreaming()) return;

        // Add user message immediately
        this.messages.update((m) => [...m, {role: "user", text: message}]);
        this.chatMessage = "";
        this.shouldScroll = true;

        // Prepare for model response
        let modelIndex = -1;
        this.messages.update((m) => {
            modelIndex = m.length;
            return [...m, {role: "model", text: ""}];
        });

        this.fullResponseText = "";
        this.displayedResponseText = "";

        this.isStreaming.set(true);

        this.gemini
            .sendMessage$(message)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (fullBuffer) => {
                    this.fullResponseText = fullBuffer;
                    if (!this.typingTimer) {
                        this.startTypewriter(modelIndex);
                    }
                },
                complete: () => {
                    this.isStreaming.set(false);
                },
                error: () => {
                    this.isStreaming.set(false);
                    if (this.typingTimer) {
                        clearInterval(this.typingTimer);
                        this.typingTimer = null;
                    }
                },
            });
    }

    private startTypewriter(modelIndex: number) {
        this.displayedResponseText = "";
        this.typingTimer = setInterval(() => {
            if (this.displayedResponseText.length < this.fullResponseText.length) {
                // Word-by-word: find next space
                const remaining = this.fullResponseText.substring(
                    this.displayedResponseText.length
                );
                const nextSpaceIndex = remaining.indexOf(" ", 1);

                let textToAdd = "";
                if (nextSpaceIndex > -1) {
                    textToAdd = remaining.substring(0, nextSpaceIndex + 1);
                } else {
                    textToAdd = remaining;
                }

                this.displayedResponseText += textToAdd;
                this.messages.update((m) => {
                    const updated = [...m];
                    if (updated[modelIndex]) {
                        updated[modelIndex] = {
                            ...updated[modelIndex],
                            text: this.displayedResponseText,
                        };
                    }
                    return updated;
                });
                this.shouldScroll = true;
            } else if (!this.isStreaming()) {
                // Finished streaming and typing has caught up
                clearInterval(this.typingTimer);
                this.typingTimer = null;
            }
        }, 30); // Adjust speed here (higher = slower)
    }

    toggleSidebar() {
        this.isSidebarOpen.update((value) => !value);
    }

    loadSession(id: number) {
        if (this.gemini.loadSession(id)) {
            this.messages.set([...this.gemini.currentHistory()]);
            this.shouldScroll = true;
        }
    }

    deleteSession(id: number) {
        this.gemini.deleteSession(id);
        this.chatHistory.set(this.gemini.allChatSessions());
    }

    resetChat() {
        this.gemini.resetConversation();
        this.messages.set([]);
    }

    onSessionClick(session: ChatSession) {
        if (this.editingSessionId() === session.id) return;
        this.loadSession(session.id);
        this.toggleSidebar();
    }

    startEditingTitle(event: Event, session: ChatSession) {
        event.stopPropagation();
        this.editingSessionId.set(session.id);
        this.editingTitle.set(session.title || "");
    }

    saveTitle(event: Event) {
        event.stopPropagation();
        const id = this.editingSessionId();
        const title = this.editingTitle().trim();
        if (id !== null && title) {
            this.gemini.updateSessionTitle(id, title);
            this.chatHistory.set(this.gemini.allChatSessions());
        }
        this.cancelEditing();
    }

    cancelEditing(event?: Event) {
        if (event) event.stopPropagation();
        this.editingSessionId.set(null);
        this.editingTitle.set("");
    }

    private scrollToBottom(): void {
        if (this.chatContainer) {
            const element = this.chatContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
        }
    }
}
