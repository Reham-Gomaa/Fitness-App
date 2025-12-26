import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
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

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAllConversations(): Conversation[] {
    if (!this.isBrowser) return [];

    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(STORAGE_KEYS.conversationPrefix)
      );

      return keys
        .map(key => this.getConversation(key))
        .filter((c): c is Conversation => c !== null)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  getConversation(conversationId: string): Conversation | null {
    if (!this.isBrowser) return null;

    try {
      const data = localStorage.getItem(conversationId);
      if (!data) return null;

      const conversation = JSON.parse(data);
      
      return {
        ...conversation,
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt),
        messages: conversation.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      };
    } catch (error) {
      console.error('Error loading conversation:', error);
      return null;
    }
  }

  saveConversation(conversation: Conversation): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(conversation.id, JSON.stringify(conversation));
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw new Error('Failed to save conversation');
    }
  }

  deleteConversation(conversationId: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(conversationId);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation');
    }
  }

  generateConversationId(): string {
    return `${STORAGE_KEYS.conversationPrefix}${Date.now()}`;
  }

  generateTitle(messages: Message[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Conversation';

    const maxLength = 50;
    const content = firstUserMessage.content;
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  }
}