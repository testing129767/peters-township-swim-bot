import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { TEAM_INFO, SWIM_GROUPS, UPCOMING_MEETS, INITIAL_VOLUNTEER_SHIFTS, COACHES } from './src/data/teamData.js';

const currentDir = process.cwd();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================================================================
// GOOGLE CLOUD (AGENT PLATFORM) INITIALIZATION
// ============================================================================
let ai: GoogleGenAI;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error('❌ CRITICAL ERROR: GOOGLE_APPLICATION_CREDENTIALS_JSON is missing in Render!');
  process.exit(1);
}

try {
  // 1. Parse the JSON credentials
  const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  const projectId = creds.project_id || 'pt-swim-bot-vertex';
  
  // 2. The Ephemeral File Hack (Satisfies Google Cloud's physical file requirement)
  const keyPath = path.join(process.cwd(), 'google-credentials.json');
  fs.writeFileSync(keyPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

  // 3. The Belt-and-Suspenders Environment Variables 
  // Forces the SDK to see the project and location natively
  process.env.GOOGLE_CLOUD_PROJECT = projectId;
  process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';

  // 4. Initialize the SDK with root-level and nested properties
  // This satisfies all versions of the @google/genai SDK
  ai = new GoogleGenAI({
    project: projectId,
    location: 'us-central1',
    vertexai: {
      project: projectId,
      location: 'us-central1'
    }
  });
  console.log(`✅ Successfully connected to Google Cloud for project: ${projectId}`);
} catch (err) {
  console.error('❌ Failed to initialize Google Cloud Auth.', err);
  process.exit(1);
}

// In-memory state for volunteer shifts
let volunteerShifts = [...INITIAL_VOLUNTEER_SHIFTS];

// Live Google Doc & Website URLs
const GOOGLE_DOC_EXPORT_URL = 'https://docs.google.com/document/d/1SWyuCXw3KzrtjbRbLMBsD8aLaZYdyUjVWCeNYLec8BA/export?format=txt';
const OFFICIAL_WEBSITE_URL = 'https://sites.google.com/view/peters-township-swim-dive';

let cachedDocText = '';
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000;

let cachedWebsiteText = '';
let lastWebsiteFetchTime = 0;
const WEBSITE_CACHE_TTL_MS = 5 * 60 * 1000;

function decodeHtmlEntities(str: string): string {
  return str.replace(/&/g, '&').replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
}

const STATIC_WEBSITE_CONTENT = `
Peters Township Swim & Dive | Official Site
URL: https://sites.google.com/view/peters-township-swim-dive
FACILITY & HOME POOL: Bud Baer Natatorium, 121 Rolling Hills Drive, McMurray, PA 15317
`;

async function getLiveDocInfo(): Promise<string> {
  const now = Date.now();
  if (cachedDocText && now - lastFetchTime < CACHE_TTL_MS) return cachedDocText;
  try {
    const response = await fetch(GOOGLE_DOC_EXPORT_URL);
    if (response.ok) {
      cachedDocText = (await response.text()).trim();
      lastFetchTime = now;
    }
  } catch (err) { console.warn('Doc fetch issue'); }
  return cachedDocText;
}

async function getLiveWebsiteInfo(): Promise<string> {
  const now = Date.now();
  if (cachedWebsiteText && now - lastWebsiteFetchTime < WEBSITE_CACHE_TTL_MS) return cachedWebsiteText;
  try {
    const response = await fetch(OFFICIAL_WEBSITE_URL);
    if (response.ok) {
      const html = await response.text();
      cachedWebsiteText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      lastWebsiteFetchTime = now;
    }
  } catch (err) { console.warn('Website fetch issue'); }
  return cachedWebsiteText || STATIC_WEBSITE_CONTENT;
}

function buildSystemPrompt(docText: string, websiteText: string): string {
  return `
You are "Splash," the friendly, helpful assistant for the Peters Township Swim and Dive Team.
Always refer to the team as the "Peters Township Swim and Dive Team". NEVER use "PTST" or "club".

=== LIVE WEBSITE DATA ===
${websiteText || STATIC_WEBSITE_CONTENT}

=== LIVE DOC GUIDE ===
${docText}
`;
}

// Splash AI Chat Endpoint
app.post('/api/splash/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const contents = Array.isArray(history) 
      ? history.map((i: any) => ({ role: i.sender === 'user' ? 'user' : 'model', parts: [{ text: i.text }] }))
      : [];
    contents.push({ role: 'user', parts: [{ text: message }] });

    const docText = await getLiveDocInfo();
    const webText = await getLiveWebsiteInfo();
    
    console.log('Attempting Google Cloud call with model: gemini-1.5-flash-002');
    
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash-002',
      contents: contents,
      config: {
        systemInstruction: buildSystemPrompt(docText, webText),
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response?.text || "Splish Splash! Something went wrong on my end.",
      suggestedFollowups: ['When is the next meet?', 'Tell me about practice'],
    });

  } catch (error: any) {
    console.error('❌ Cloud model call failed:', error?.message || error);
    return res.json({
      reply: "Splish Splash! I'm having trouble connecting to the pool right now. Please check the website!",
      suggestedFollowups: ['Try again'],
    });
  }
});

// Volunteer API Endpoint
app.get('/api/volunteers', (req, res) => {
  res.json({ shifts: volunteerShifts });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.resolve(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`🏊‍♂️ Server listening on port ${PORT}`));
}

startServer();
