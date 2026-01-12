import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { API_ENDPOINTS } from '../../../../core/constants/api-constants';

export interface ChatRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  constructor(private http: HttpClient) {} 

  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      
      return await this.http.post<ChatResponse>(
        API_ENDPOINTS.chat, 
        request
      ).toPromise() as ChatResponse;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  async sendChatMessageStreaming(
    request: ChatRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      
      const response = await fetch(API_ENDPOINTS.chatStream, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                onChunk(parsed.content);
              } else if (parsed.error) {
                onError(parsed.error);
                return;
              }
            } catch (e) {}
          }
        }
      }
      
      onComplete();
    } catch (error) {
      console.error('Error streaming chat message:', error);
      onError('Failed to stream message. Please try again.');
    }
  }
}