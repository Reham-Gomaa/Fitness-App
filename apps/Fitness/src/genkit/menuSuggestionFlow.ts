import 'dotenv/config';

const apiKey = process.env['GEMINI_API_KEY'];
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in .env');
}

interface ChatHistory {
  role: string;
  content: string;
}

async function getAvailableModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`);
    }
    
    const data = await response.json();
    return data.models?.filter((m: any) => 
      m.supportedGenerationMethods?.includes('generateContent')
    ) || [];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

export async function chatWithGemini(
  userMessage: string, 
  conversationHistory?: ChatHistory[],
  retryCount: number = 0
): Promise<{ response: string }> {
  try {
    const availableModels = await getAvailableModels();
    
    if (availableModels.length === 0) {
      throw new Error('No models available');
    }
    
    const modelName = availableModels[0].name;
    const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;
    
    const contents = [];
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    });

    if (response.status === 429 && retryCount < 3) {
      const waitTime = Math.pow(2, retryCount) * 1000;
      console.log(`Rate limited. Retrying in ${waitTime/1000}s (attempt ${retryCount + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return chatWithGemini(userMessage, conversationHistory, retryCount + 1);
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a minute and try again.');
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    
    return { response: text };
  } catch (error) {
    console.error('Error in chatWithGemini:', error);
    throw error;
  }
}

export async function simulateStreamChatWithGemini(
  userMessage: string,
  conversationHistory: ChatHistory[] | undefined,
  onChunk: (chunk: string) => void
): Promise<void> {
  const result = await chatWithGemini(userMessage, conversationHistory);
  onChunk(result.response);
}