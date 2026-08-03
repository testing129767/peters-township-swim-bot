import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { TEAM_INFO, SWIM_GROUPS, UPCOMING_MEETS, INITIAL_VOLUNTEER_SHIFTS, COACHES } from './src/data/teamData.js';

// process.cwd() ALWAYS points to the top-level repository folder (/opt/render/project/src)
const currentDir = process.cwd();

const app = express();
app.use(express.json());

// Render sets process.env.PORT dynamically for web services
const PORT = process.env.PORT || 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory state for volunteer shifts
let volunteerShifts = [...INITIAL_VOLUNTEER_SHIFTS];

// Live Google Doc & Website URLs
const GOOGLE_DOC_EXPORT_URL = 'https://docs.google.com/document/d/1SWyuCXw3KzrtjbRbLMBsD8aLaZYdyUjVWCeNYLec8BA/export?format=txt';
const OFFICIAL_WEBSITE_URL = 'https://sites.google.com/view/peters-township-swim-dive';

let cachedDocText = '';
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

let cachedWebsiteText = '';
let lastWebsiteFetchTime = 0;
const WEBSITE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/'/g, "'")
    .replace(/ /g, ' ')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/–/g, '-')
    .replace(/—/g, '-');
}

const STATIC_WEBSITE_CONTENT = `
Peters Township Swim & Dive | Official Site
URL: https://sites.google.com/view/peters-township-swim-dive
Theme: Performance Excellence - Official Home of Middle School & High School Aquatics.

FACILITY & HOME POOL:
- Bud Baer Natatorium
- Address: Peters Township High School, 121 Rolling Hills Drive, McMurray, PA 15317
`;

async function getLiveDocInfo(): Promise<string> {
  const now = Date.now();
  if (cachedDocText && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedDocText;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(GOOGLE_DOC_EXPORT_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      const text = await response.text();
      if (text && text.trim().length > 10) {
        cachedDocText = text.trim();
        lastFetchTime = now;
      }
    }
  } catch (err: any) {
    console.warn('Doc fetch notice:', err?.message || err);
  }
  return cachedDocText;
}

async function getLiveWebsiteInfo(): Promise<string> {
  const now = Date.now();
  if (cachedWebsiteText && now - lastWebsiteFetchTime < WEBSITE_CACHE_TTL_MS) {
    return cachedWebsiteText;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(OFFICIAL_WEBSITE_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (response.ok) {
      const html = await response.text();
      const match = html.match(/data-code="([^"]+)"/);
      let rawText = '';
      if (match) {
        const decoded = decodeHtmlEntities(match[1]);
        rawText = decoded.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      } else {
        rawText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      }
      if (rawText && rawText.trim().length > 100) {
        cachedWebsiteText = rawText.trim();
        lastWebsiteFetchTime = now;
      }
    }
  } catch (err: any) {
    console.warn('Website fetch notice:', err?.message || err);
  }
  return cachedWebsiteText || STATIC_WEBSITE_CONTENT;
}

function buildSystemPrompt(docText: string, websiteText: string): string {
  const officialWebsite = "Official Team Website: https://sites.google.com/view/peters-township-swim-dive";
  return `
You are "Splash," the friendly, helpful, and versatile assistant for the Peters Township Swim and Dive Team.

NAME & NAMING CONVENTIONS:
- Always refer to the team as the "Peters Township Swim and Dive Team".
- NEVER use the acronym "PTST".
- NEVER use the word "club".

REAL-TIME OFFICIAL TEAM RESOURCES & INFORMATION:
- ${officialWebsite}

=== RESOURCE 1: LIVE CONTENT FROM OFFICIAL TEAM WEBSITE ===
${websiteText || STATIC_WEBSITE_CONTENT}

=== RESOURCE 2: LIVE CONTENT FROM GOOGLE DOC GUIDE ===
${docText}

TONE & PERSONALITY:
- Warm, encouraging, helpful, and community-minded.
- Always identify yourself as Splash, your friendly team assistant.
`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Peters Township Swim and Dive Team - Splash' });
});

// Volunteer Shifts API
app.get('/api/volunteers', (req, res) => {
  res.json({ shifts: volunteerShifts });
});

// Helper for grounded fallback answers
function getGroundedFallbackAnswer(query: string): string {
  return `Splish Splash! Welcome to the Peters Township Swim and Dive Team assistant!
• Official Team Website: https://sites.google.com/view/peters-township-swim-dive
• Pool Address: 121 Rolling Hills Drive, McMurray, PA 15317
• Head Coach: Alex Hardwick (alexpetersswim@gmail.com)`;
}

// Splash AI Chat Endpoint
app.post('/api/splash/chat', async (req, res) => {
  try {
    const { message, history, docContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is missing from process.env');
      return res.json({
        reply: getGroundedFallbackAnswer(message),
        suggestedFollowups: ['When are tryouts?', 'What are the practice schedules?'],
      });
    }

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const liveDocText = docContext || await getLiveDocInfo();
    const liveWebsiteText = await getLiveWebsiteInfo();
    const systemPrompt = buildSystemPrompt(liveDocText, liveWebsiteText);

    // Tested, production-ready Gemini models for Google AI Studio
    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro'];
    let replyText = '';

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting Gemini model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        if (response && response.text) {
          replyText = response.text;
          console.log(`Successfully generated response using model: ${modelName}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Gemini model '${modelName}' failed, trying next fallback...`, err?.message || err);
      }
    }

    if (!replyText) {
      console.warn('All models failed or returned empty responses. Serving fallback.');
      replyText = getGroundedFallbackAnswer(message);
    }

    return res.json({
      reply: replyText,
      suggestedFollowups: ['Tell me about practice groups', 'When is the next swim meet?'],
    });
  } catch (error: any) {
    console.error('Error generating Splash AI response:', error);
    return res.json({
      reply: getGroundedFallbackAnswer(req.body?.message || ''),
      suggestedFollowups: ['When are tryouts?', 'What are the practice schedules?'],
    });
  }
});

// Vite Middleware for Dev, Static Serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Correct absolute path using process.cwd()
    const distPath = path.resolve(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏊‍♂️ Server listening on port ${PORT}`);
  });
}

startServer();
