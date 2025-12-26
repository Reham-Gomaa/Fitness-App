import {
    AngularNodeAppEngine,
    createNodeRequestHandler,
    isMainModule,
    writeResponseToNodeResponse,
} from "@angular/ssr/node";
import express from "express";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import 'dotenv/config';
import { chatWithGemini, simulateStreamChatWithGemini } from './genkit/menuSuggestionFlow';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, "../browser");

const app = express();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }
  
  try {
    const result = await chatWithGemini(message, history);
    res.json(result);
    return;
  } catch (err: unknown) {
    console.error('Chat error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: 'Error in chat', details: errorMessage });
    return;
  }
});

app.post('/api/chat/stream', async (req, res) => {
  const { message, history } = req.body;
  
  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  try {
    await simulateStreamChatWithGemini(message, history, (chunk) => {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    });
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: unknown) {
    console.error('Streaming error:', err);
    
    let errorMessage = 'Streaming failed';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
});

const angularApp = new AngularNodeAppEngine();

app.use(
    express.static(browserDistFolder, {
        maxAge: "1y",
        index: false,
        redirect: false,
    })
);

app.use("/**", (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    angularApp
        .handle(req)
        .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
});

if (isMainModule(import.meta.url) || process.env["pm_id"]) {
    const port = process.env["PORT"] || 4000;
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
}

export const reqHandler = createNodeRequestHandler(app);