import { Injectable, PLATFORM_ID, Inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_KEYS } from '../../../../core/constants/api-constants';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ConversationStorageService {
  private isBrowser: boolean;
  
  private history = signal<Message[]>([]);
  private chatSessions = signal<Conversation[]>([]);
  private activeSessionId = signal<string | null>(null);
  
  readonly currentHistory = this.history.asReadonly();
  readonly allChatSessions = this.chatSessions.asReadonly();
  readonly currentSessionId = this.activeSessionId.asReadonly();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(STORAGE_KEYS.conversationPrefix)
      );

      const sessions = keys
        .map(key => {
          const data = localStorage.getItem(key);
          if (!data) return null;
          
          const conversation = JSON.parse(data);
          return {
            ...conversation,
            id: key,
            createdAt: new Date(conversation.createdAt),
            updatedAt: new Date(conversation.updatedAt),
            messages: conversation.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }))
          };
        })
        .filter((c): c is Conversation => c !== null)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      this.chatSessions.set(sessions);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }

  private saveToStorage(): void {
    try {
      this.chatSessions().forEach(conversation => {
        localStorage.setItem(conversation.id, JSON.stringify(conversation));
      });
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  }

  startNewConversation(): string {
    const sessionId = `${STORAGE_KEYS.conversationPrefix}${Date.now()}`;
    this.activeSessionId.set(sessionId);
    this.history.set([{
      role: 'assistant',
      content: 'Hello! How Can I Assist You Today?',
      timestamp: new Date()
    }]);
    return sessionId;
  }

  addUserMessage(content: string): void {
    this.history.update(messages => [
      ...messages,
      {
        role: 'user',
        content,
        timestamp: new Date()
      }
    ]);
  }

  addAssistantChunk(chunk: string): void {
    this.history.update(messages => {
      const updated = [...messages];
      const lastMessage = updated[updated.length - 1];
      
      if (lastMessage && lastMessage.role === 'assistant') {
        updated[updated.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + chunk
        };
      } else {
        updated.push({
          role: 'assistant',
          content: chunk,
          timestamp: new Date()
        });
      }
      
      return updated;
    });
  }

  saveCurrentConversation(): void {
    const currentMessages = this.history();
    if (currentMessages.length === 0) return;

    const now = new Date();
    const activeId = this.activeSessionId() || `${STORAGE_KEYS.conversationPrefix}${Date.now()}`;

    const conversation: Conversation = {
      id: activeId,
      title: this.generateTitle(currentMessages),
      messages: [...currentMessages],
      createdAt: currentMessages[0]?.timestamp || now,
      updatedAt: now
    };

    this.chatSessions.update(sessions => {
      const existingIndex = sessions.findIndex(s => s.id === activeId);
      if (existingIndex >= 0) {
        const updated = [...sessions];
        updated[existingIndex] = conversation;
        return updated;
      } else {
        return [conversation, ...sessions];
      }
    });

    this.activeSessionId.set(activeId);
    this.saveToStorage();
  }

  private generateTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Conversation';

    const maxLength = 50;
    const content = firstUserMessage.content;
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  }

  loadConversation(conversationId: string): void {
    const session = this.chatSessions().find(s => s.id === conversationId);
    if (session) {
      this.history.set([...session.messages]);
      this.activeSessionId.set(conversationId);
    }
  }

  deleteConversation(conversationId: string): void {
    localStorage.removeItem(conversationId);
    this.chatSessions.update(sessions => 
      sessions.filter(s => s.id !== conversationId)
    );
    
    if (this.activeSessionId() === conversationId) {
      this.activeSessionId.set(null);
      this.history.set([]);
    }
  }

  clearCurrentConversation(): void {
    this.history.set([]);
    this.activeSessionId.set(null);
  }

  removeLastMessage(): void {
    this.history.update(messages => messages.slice(0, -1));
  }
}