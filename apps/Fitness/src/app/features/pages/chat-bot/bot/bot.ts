import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {
    ChatMessage,
    ChatSession,
    GeminiIntegration,
} from "../../../../core/services/gemini-int/gemini-integration";
import {MainButton} from "./../../../../shared/components/ui/main-button/main-button";
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: "app-bot",
    standalone: true,
    imports: [MainButton, TranslatePipe, FormsModule, NgOptimizedImage],
    templateUrl: "./bot.html",
    styleUrl: "./bot.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bot implements AfterViewChecked {
    @ViewChild("chatContainer") private chatContainer?: ElementRef<HTMLElement>;
    @ViewChild("chatInput") private chatInput?: ElementRef<HTMLInputElement>;

    private readonly gemini = inject(GeminiIntegration);
    private readonly destroyRef = inject(DestroyRef);

    chatMessage = "";
    readonly isActiveChat = signal<boolean>(false);
    readonly messages = signal<ChatMessage[]>([]);
    readonly isStreaming = signal<boolean>(false);
    readonly chatHistory = this.gemini.allChatSessions;
    readonly isSidebarOpen = signal<boolean>(false);
    private shouldScroll = false;
    private typingTimer: ReturnType<typeof setInterval> | null = null;
    private fullResponseText = "";
    private displayedResponseText = "";
    readonly editingSessionId = signal<number | null>(null);
    readonly editingTitle = signal<string>("");
    private currentSubscription?: Subscription;

    ngAfterViewChecked(): void {
        if (this.shouldScroll) {
            this.scrollToBottom();
            this.shouldScroll = false;
        }
    }

    openChat(): void {
        this.isActiveChat.update((v) => !v);
        if (this.isActiveChat()) {
            this.focusInput();
        }
    }

    sendMessage(): void {
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

        this.currentSubscription = this.gemini
            .sendMessage$(message)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (fullBuffer: string) => {
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
                    this.clearTypingTimer();
                },
            });
    }

    stopResponse(): void {
        if (this.currentSubscription) {
            this.currentSubscription.unsubscribe();
            this.currentSubscription = undefined;
        }
        this.clearTypingTimer();
        this.isStreaming.set(false);
    }

    toggleSidebar(): void {
        this.isSidebarOpen.update((value) => !value);
    }

    onInputFocus(): void {
        if (this.isSidebarOpen()) {
            this.isSidebarOpen.set(false);
        }
    }

    loadSession(id: number): void {
        if (this.gemini.loadSession(id)) {
            this.messages.set([...this.gemini.currentHistory()]);
            this.shouldScroll = true;
        }
    }

    deleteSession(id: number): void {
        this.gemini.deleteSession(id);
    }

    resetChat(): void {
        this.gemini.resetConversation();
        this.messages.set([]);
    }

    onSessionClick(session: ChatSession): void {
        if (this.editingSessionId() === session.id) return;
        this.loadSession(session.id);
        this.toggleSidebar();
        this.focusInput();
    }

    private focusInput(): void {
        setTimeout(() => {
            this.chatInput?.nativeElement.focus();
        }, 100);
    }

    startEditingTitle(event: Event, session: ChatSession): void {
        event.stopPropagation();
        this.editingSessionId.set(session.id);
        this.editingTitle.set(session.title || "");
    }

    saveTitle(event: Event): void {
        event.stopPropagation();
        const id = this.editingSessionId();
        const title = this.editingTitle().trim();
        if (id !== null && title) {
            this.gemini.updateSessionTitle(id, title);
        }
        this.cancelEditing();
    }

    cancelEditing(event?: Event): void {
        if (event) event.stopPropagation();
        this.editingSessionId.set(null);
        this.editingTitle.set("");
    }

    private startTypewriter(modelIndex: number): void {
        this.displayedResponseText = "";
        this.typingTimer = setInterval(() => {
            if (this.displayedResponseText.length < this.fullResponseText.length) {
                // Word-by-word typing logic
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
                this.clearTypingTimer();
            }
        }, 30);
    }

    private clearTypingTimer(): void {
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
            this.typingTimer = null;
        }
    }

    private scrollToBottom(): void {
        if (this.chatContainer) {
            const element = this.chatContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
        }
    }
}
