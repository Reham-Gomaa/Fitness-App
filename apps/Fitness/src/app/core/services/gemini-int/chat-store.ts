// import {Injectable, signal, computed, inject} from "@angular/core";
// import {GeminiIntegration} from "./gemini-integration";
// import {ChatSession, ChatMessage} from "./gemini-integration";

// @Injectable({providedIn: "root"})
// export class ChatStore {
//     private gemini = inject(GeminiIntegration);

//     private STORAGE_KEY = "chat_sessions_v1";

//     private sessionsSig = signal<ChatSession[]>(this.load());
//     private activeIdSig = signal<string | null>(null);

//     sessions = computed(() => this.sessionsSig());
//     activeSession = computed(
//         () => this.sessionsSig().find((s) => s.id === this.activeIdSig()) ?? null
//     );

//     /* ---------- Session lifecycle ---------- */

//     startNewSession() {
//         const session: ChatSession = {
//             id: crypto.randomUUID(),
//             title: "New Chat",
//             messages: [],
//             createdAt: Date.now(),
//             updatedAt: Date.now(),
//         };

//         this.sessionsSig.update((s) => [session, ...s]);
//         this.activeIdSig.set(session.id);
//         this.persist();
//     }

//     openSession(id: string) {
//         this.activeIdSig.set(id);
//         this.gemini.loadHistory(this.activeSession()?.messages ?? []);
//     }

//     /* ---------- Messaging ---------- */

//     async sendMessage(text: string) {
//         const session = this.activeSession();
//         if (!session) return;

//         const userMsg: ChatMessage = {role: "user", text};

//         this.patchSession({
//             ...session,
//             messages: [...session.messages, userMsg],
//             updatedAt: Date.now(),
//             title: session.messages.length === 0 ? text.slice(0, 30) : session.title,
//         });

//         // placeholder model message
//         //this.appendToActive({role: "model", text: ""});
//         const modelMsg: ChatMessage = {role: "model", text: ""};
//         this.patchSession({
//             ...this.activeSession()!,
//             messages: [...this.activeSession()!.messages, modelMsg],
//             updatedAt: Date.now(),
//         });

//         const modelIndex = this.activeSession()!.messages.length - 1;

//         for await (const chunk of this.gemini.sendMessage(text)) {
//             this.updateMessage(modelIndex, chunk);
//         }

//         this.persist();
//     }

//     /* ---------- Helpers ---------- */

//     private appendToActive(msg: ChatMessage) {
//         this.patchSession({
//             ...this.activeSession()!,
//             messages: [...this.activeSession()!.messages, msg],
//             updatedAt: Date.now(),
//         });
//     }

//     private updateMessage(index: number, chunk: string) {
//         const session = this.activeSession()!;
//         const messages = [...session.messages];

//         messages[index] = {
//             ...messages[index],
//             text: messages[index].text + chunk,
//         };

//         this.patchSession({...session, messages});
//     }

//     private patchSession(updated: ChatSession) {
//         this.sessionsSig.update((s) => s.map((sess) => (sess.id === updated.id ? updated : sess)));
//     }

//     /* ---------- Persistence ---------- */

//     private persist() {
//         localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sessionsSig()));
//     }

//     private load(): ChatSession[] {
//         return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? "[]");
//     }
// }
