import { Component, PLATFORM_ID, Inject, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../shared/gemini-menu/services/gemini.service/gemini.service';
import { ConversationStorageService } from '../../shared/gemini-menu/services/conversation-storage.service/conversation-storage.service';

@Component({
  selector: 'app-gemini-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./gemini-menu.html",
  styleUrl: "./gemini-menu.scss",
})
export class GeminiMenuComponent implements OnInit, OnDestroy {
  private isBrowser: boolean;
  
  userInput = '';
  loading = false;
  error = '';
  
  private geminiService = inject(GeminiService);
  conversationStorage = inject(ConversationStorageService);
  
  messages = this.conversationStorage.currentHistory;
  conversations = this.conversationStorage.allChatSessions;
  currentSessionId = this.conversationStorage.currentSessionId;
  
  showConversationList = false;
  
  private lastRequestTime = 0;
  private cooldownMs = 4000;
  cooldownRemaining = 0;
  private cooldownInterval: any;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      if (this.messages().length === 0) {
        this.startNewConversation();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  startNewConversation(): void {
    this.conversationStorage.startNewConversation();
    this.showConversationList = false;
  }

  loadConversation(conversationId: string): void {
    this.conversationStorage.loadConversation(conversationId);
    this.showConversationList = false;
  }

  deleteConversation(conversationId: string, event: Event): void {
    event.stopPropagation();
    this.conversationStorage.deleteConversation(conversationId);
  }

  toggleConversationList(): void {
    this.showConversationList = !this.showConversationList;
  }

  private startCooldownTimer(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      const remaining = this.cooldownMs - elapsed;

      if (remaining <= 0) {
        this.cooldownRemaining = 0;
        clearInterval(this.cooldownInterval);
      } else {
        this.cooldownRemaining = Math.ceil(remaining / 1000);
      }
    }, 100);
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.loading) return;

    if (this.isBrowser) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.cooldownMs) {
        const remainingTime = Math.ceil((this.cooldownMs - timeSinceLastRequest) / 1000);
        this.error = `Please wait ${remainingTime} seconds before sending another message`;
        
        setTimeout(() => {
          if (this.error.includes('wait')) {
            this.error = '';
          }
        }, this.cooldownMs - timeSinceLastRequest);
        
        return;
      }

      this.lastRequestTime = now;
      this.startCooldownTimer();
    }

    const userMessage = this.userInput.trim();
    this.userInput = '';

    this.conversationStorage.addUserMessage(userMessage);

    this.loading = true;
    this.error = '';

    try {
      const history = this.messages()
        .slice(0, -1)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      await this.geminiService.sendChatMessageStreaming(
        { message: userMessage, history },
        (chunk) => {
          this.conversationStorage.addAssistantChunk(chunk);
          this.scrollToBottom();
        },
        () => {
          this.loading = false;
          this.conversationStorage.saveCurrentConversation();
        },
        (error) => {
          this.loading = false;
          
          if (error.includes('429') || error.toLowerCase().includes('rate limit')) {
            this.error = 'Rate limit exceeded! Try again later.';
          } else {
            this.error = error;
          }
          
          this.conversationStorage.removeLastMessage();
        }
      );
    } catch (err) {
      console.error('Error:', err);
      this.error = err instanceof Error ? err.message : 'Failed to get response';
      this.loading = false;
      this.conversationStorage.removeLastMessage();
    }
  }

  private scrollToBottom(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}