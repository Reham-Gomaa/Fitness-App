import { Component, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../shared/gemini-menu/services/gemini.service/gemini.service';
import { ConversationStorageService, Conversation, Message } from '../../shared/gemini-menu/services/conversation-storage.service/conversation-storage.service';


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
  messages: Message[] = [];
  loading = false;
  error = '';
  
  currentConversationId: string | null = null;
  conversations: Conversation[] = [];
  showConversationList = false;

  private animationQueue: string[] = [];
  private isAnimating = false;
  
  private lastRequestTime = 0;
  private cooldownMs = 4000;
  cooldownRemaining = 0;
  private cooldownInterval: any;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private geminiService: GeminiService,
    private conversationStorage: ConversationStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadConversations();
      this.startNewConversation();
    }
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  loadConversations(): void {
    this.conversations = this.conversationStorage.getAllConversations();
  }

  startNewConversation(): void {
    if (!this.isBrowser) return;

    this.currentConversationId = this.conversationStorage.generateConversationId();
    this.messages = [{
      role: 'assistant',
      content: 'Hello! How Can I Assist You Today?',
      timestamp: new Date()
    }];
    this.showConversationList = false;
  }

  loadConversation(conversationId: string): void {
    const conversation = this.conversationStorage.getConversation(conversationId);
    
    if (conversation) {
      this.currentConversationId = conversationId;
      this.messages = conversation.messages;
      this.showConversationList = false;
    }
  }

  saveCurrentConversation(): void {
    if (!this.isBrowser || !this.currentConversationId) return;

    const conversation: Conversation = {
      id: this.currentConversationId,
      title: this.conversationStorage.generateTitle(this.messages),
      messages: this.messages,
      createdAt: this.messages[0]?.timestamp || new Date(),
      updatedAt: new Date()
    };

    this.conversationStorage.saveConversation(conversation);

    const existingIndex = this.conversations.findIndex(
      c => c.id === this.currentConversationId
    );
    
    if (existingIndex >= 0) {
      this.conversations[existingIndex] = conversation;
    } else {
      this.conversations.unshift(conversation);
    }
  }

  deleteConversation(conversationId: string, event: Event): void {
    event.stopPropagation();
    
    try {
      this.conversationStorage.deleteConversation(conversationId);
      this.conversations = this.conversations.filter(c => c.id !== conversationId);
      
      if (this.currentConversationId === conversationId) {
        this.startNewConversation();
      }
    } catch (error) {
      this.error = 'Failed to delete conversation';
    }
  }

  toggleConversationList(): void {
    this.showConversationList = !this.showConversationList;
  }

  private startCooldownTimer(): void {
    if (!this.isBrowser) return;

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

  private processAnimationQueue(messageIndex: number): void {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const fullText = this.animationQueue.join('');
    this.animationQueue = [];
    
    let currentIndex = 0;
    const charsPerFrame = 2;
    
    const animate = () => {
      if (currentIndex < fullText.length) {
        const end = Math.min(currentIndex + charsPerFrame, fullText.length);
        this.messages[messageIndex].content += fullText.substring(currentIndex, end);
        currentIndex = end;
        
        if (this.isBrowser) {
          this.scrollToBottom();
        }
        
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
      }
    };
    
    requestAnimationFrame(animate);
  }

  async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.loading) {
      return;
    }

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

    this.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    const assistantMessageIndex = this.messages.length;
    this.messages.push({
      role: 'assistant',
      content: '',
      timestamp: new Date()
    });

    this.animationQueue = [];
    this.isAnimating = false;
    this.loading = true;
    this.error = '';

    try {
      const history = this.messages
        .slice(0, -1)
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))
        .slice(0, -1);

      await this.geminiService.sendChatMessageStreaming(
        { message: userMessage, history },
        (chunk) => {
          this.animationQueue.push(chunk);
          
          if (!this.isAnimating) {
            this.processAnimationQueue(assistantMessageIndex);
          }
        },
        () => {
          const waitForAnimation = setInterval(() => {
            if (this.animationQueue.length === 0 && !this.isAnimating) {
              clearInterval(waitForAnimation);
              this.loading = false;
              this.saveCurrentConversation();
            }
          }, 100);
        },
        (error) => {
          this.loading = false;
          
          if (error.includes('429') || error.toLowerCase().includes('rate limit')) {
            this.error = 'Rate limit exceeded! You may have hit your daily quota. Try again later or wait until midnight.';
          } else {
            this.error = error;
          }
          
          this.messages.splice(assistantMessageIndex, 1);
          this.animationQueue = [];
          this.isAnimating = false;
        }
      );
    } catch (err) {
      console.error('Error:', err);
      this.error = err instanceof Error ? err.message : 'Failed to get response';
      this.loading = false;
      this.messages.splice(assistantMessageIndex, 1);
      this.animationQueue = [];
      this.isAnimating = false;
    }
  }

  private scrollToBottom(): void {
    if (!this.isBrowser) return;

    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}