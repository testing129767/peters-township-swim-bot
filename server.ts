import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { TEAM_INFO, SWIM_GROUPS, UPCOMING_MEETS, INITIAL_VOLUNTEER_SHIFTS, COACHES } from './src/data/teamData.js';

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

const app = express();
app.use(express.json());

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

// In-memory state for volunteer shifts (allows users to claim shifts live)
let volunteerShifts = [...INITIAL_VOLUNTEER_SHIFTS];

// Live Google Doc URL for Peters Township Swim and Dive Team info
const GOOGLE_DOC_EXPORT_URL = 'https://docs.google.com/document/d/1SWyuCXw3KzrtjbRbLMBsD8aLaZYdyUjVWCeNYLec8BA/export?format=txt';
const OFFICIAL_WEBSITE_URL = 'https://sites.google.com/view/peters-township-swim-dive';

let cachedDocText = '';
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache for real-time doc updates

let cachedWebsiteText = '';
let lastWebsiteFetchTime = 0;
const WEBSITE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache for live website scraping

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-');
}

const STATIC_WEBSITE_CONTENT = `
Peters Township Swim & Dive | Official Site
URL: https://sites.google.com/view/peters-township-swim-dive
Theme: Performance Excellence - Official Home of Middle School & High School Aquatics.

MENU TABS:
1. Home
2. News & Announcements
3. Meet Schedule
4. Records
5. Sponsors & Partners
6. About Us

FACILITY & HOME POOL:
- Bud Baer Natatorium
- Address: Peters Township High School, 121 Rolling Hills Drive, McMurray, PA 15317
- Features: State-of-the-art training and competition facility, equipped with high-visibility digital scoreboard technology, modern diving boards, and full spectator seating.

COACHING LEADERSHIP:
- Head Swim & Dive Coach: Alex Hardwick (alexpetersswim@gmail.com)
- Focus: Fostering athletic excellence, competitive drive, stroke mechanics, and athletic integrity across both Middle School and High School aquatic programs.

NEWS & ANNOUNCEMENTS:
- Annual Booster Fundraiser: Cash Bash. This benefits the Middle School and High School aquatic programs. Features cash drawings, side boards, 50/50 raffles, gift baskets, and great food. Socialize with team parents, alumni, and supporters.
- Booster Club: Supports team gear, travel, events, and senior recognition. Encourage parents to become sponsors or volunteers on the Sponsors tab.
- 2026 Competitive Season: Begins September 2026.

MIDDLE SCHOOL SEASON MEET SCHEDULE (2026):
- Sept 15: Meet 1 vs Mt. Lebanon - Away (at Mt. Lebanon HS, 155 Cochran Rd, Pittsburgh, PA 15228)
- Sept 17: Meet 2 vs Baldwin - Away (at Baldwin HS, 4653 Clairton Blvd, Pittsburgh, PA 15236)
- Sept 22: Meet 3 vs Upper St. Clair - HOME (at Bud Baer Natatorium, 121 Rolling Hills Dr)
- Sept 24: Meet 4 vs Belle Vernon - HOME (at Bud Baer Natatorium, 121 Rolling Hills Dr)
- Sept 29: Meet 5 vs Canon-Mac - Away (at Canon-Mac HS, 25 East College Street, Canonsburg, PA 15317)
- Oct 1: Meet 6 vs Bethel Park & Keystone Oaks - HOME (at Bud Baer Natatorium, 121 Rolling Hills Dr)
- Oct 6: Meet 7 vs Elizabeth Forward - Away (at Elizabeth Forward HS, 1000 Weigles Hill Road, Elizabeth, PA 15037)
- Oct 8: Section Champs - HOME (FINALS at Bud Baer Natatorium)
- Oct 9: All-Star Showcase - Away (at Upper St. Clair HS, 1825 McLaughlin Run Rd, Pittsburgh, PA 15241)

OFFICIAL RECORDS SYSTEM:
- The website displays real-time records loaded dynamically from the following official Google Sheets:
  * High School Records (Girls/Boys): https://docs.google.com/spreadsheets/d/e/2PACX-1vTROuK8c_9tWF7xOlOe3y7sTZUpKej-D-5akRiYbfqxtwDG3QIe7nOCq2oFQkGfaRCzbSWF75uHcN6s/pub?gid=0&single=true&output=csv
  * Middle School Records (Girls/Boys): https://docs.google.com/spreadsheets/d/e/2PACX-1vQToFRnRFjmY5aE34MzQ-Svuqum4ZdHYP8213-Cx02j5V4U8whIV2deSwl8beoSp97GmKjwWwiRDmp7/pub?gid=1164073004&single=true&output=csv
  * Pool Records (Girls/Boys): https://docs.google.com/spreadsheets/d/e/2PACX-1vRoY3Q2P6ax9V1ukg63e59RAIcLwWISzIwirJTi2yU7wj1EhxSGhbbkmsXnB6DQN3yxsE8W7CumGUOh/pub?output=csv
- Record categories include: High School Girls, High School Boys, Middle School Girls, Middle School Boys, Pool Records Girls, and Pool Records Boys.
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
        console.log('Successfully refreshed live team information from Google Doc');
      }
    }
  } catch (err: any) {
    console.warn('Live Google Doc fetch notice:', err?.message || err);
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
        console.log('Successfully refreshed live team information from Official Website');
      }
    }
  } catch (err: any) {
    console.warn('Live website fetch notice:', err?.message || err);
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
${docText || `
- Home Pool Location: Peters Township Middle School and High School Pool, 121 Rolling Hills Drive, McMurray, PA 15317
- Head Coach: Alex Hardwick (alexpetersswim@gmail.com)
- Middle School Meet Schedule (2026):
  9/15: Mt Lebanon (Away)
  9/17: Baldwin (Away)
  9/22: Upper St. Clair (Home)
  9/24: Belle Vernon (Home)
  9/29: Canon-Mac (Away)
  10/1: Bethel Park & Keystone Oaks (Home)
  10/6: Elizabeth Forward (Away)
  10/8: Section Champs Finals (Home)
  10/9: All-Star Showcase (USC)
- Interest Forms: Grades 7–8 (https://forms.gle/RfBiDsoc6bQv9KNJ6) and Grades 9–12 (https://forms.gle/wg7QSi5B6b94koBW9)
`}

TONE & PERSONALITY:
- Warm, encouraging, helpful, and community-minded.
- Professional yet approachable.
- Always identify yourself as Splash, your friendly team assistant.

STRICT SECURITY & LINK RULES:
1. NEVER output, share, or mention any Google Doc URLs, links, or internal document links.
2. NEVER mention "bot feed doc", "Google doc", or "internal document".
3. ACCURACY FIRST: Provide exact details from the official team information above.
4. MISSING INFORMATION PROTOCOL: If you do NOT have the specific information requested in the official team information, politely inform the user that you don't have that specific detail available yet, and recommend reaching out to Head Coach Alex Hardwick at alexpetersswim@gmail.com.
5. CLEAR FORMATTING: Use bullet points, bold key details (dates, times, locations), and clean short paragraphs to make answers clear and pleasant to read.
6. Keep responses upbeat, friendly, concise, and helpful!
`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Peters Township Swim and Dive Team - Splash' });
});

// Endpoint to fetch text from public Google Doc URL
app.get('/api/doc-content', async (req, res) => {
  try {
    const text = await getLiveDocInfo();
    res.json({ text });
  } catch (err: any) {
    console.error('Error in /api/doc-content:', err?.message || err);
    res.status(500).json({ error: err?.message || 'Failed to fetch live team info' });
  }
});

// Volunteer Shifts API
app.get('/api/volunteers', (req, res) => {
  res.json({ shifts: volunteerShifts });
});

app.post('/api/volunteers/claim', (req, res) => {
  const { shiftId, parentName } = req.body;
  if (!shiftId || !parentName) {
    return res.status(400).json({ error: 'Shift ID and Parent Name are required.' });
  }

  const shift = volunteerShifts.find(s => s.id === shiftId);
  if (!shift) {
    return res.status(404).json({ error: 'Shift not found.' });
  }

  if (shift.filledSpots >= shift.totalSpots) {
    return res.status(400).json({ error: 'This shift is already full.' });
  }

  shift.filledSpots += 1;
  shift.claimedBy.push(parentName.trim());

  res.json({ success: true, shift, message: `Successfully registered ${parentName} for ${shift.role}!` });
});

// Helper to generate grounded fallback answers when AI models are unavailable or rate-limited
function getGroundedFallbackAnswer(query: string): string {
  const q = (query || '').toLowerCase();

  if (q.includes('schedule') || q.includes('meet') || q.includes('calendar') || q.includes('when')) {
    return `Splish Splash! 🏊‍♂️ **Peters Township Swim and Dive Team - Middle School Meet Schedule**:

• **9/15/2026**: Peters vs. Mt Lebanon (Away - 155 Cochran Rd, Pittsburgh, PA 15228)
• **9/17/2026**: Peters vs. Baldwin (Away - 4653 Clairton Blvd, Pittsburgh, PA 15236)
• **9/22/2026**: Peters vs. Upper St. Clair (**Home** - 121 Rolling Hills Dr)
• **9/24/2026**: Peters vs. Belle Vernon (**Home** - 121 Rolling Hills Dr)
• **9/29/2026**: Peters vs. Canon-Mac (Away - 25 East College St, Canonsburg, PA 15317)
• **10/1/2026**: Peters vs. Bethel Park & Keystone Oaks (**Home** - 121 Rolling Hills Dr)
• **10/6/2026**: Peters vs. Elizabeth Forward (Away - 1000 Weigles Hill Rd, Elizabeth, PA 15037)
• **10/8/2026**: Section Champs - Finals (**Home** - 121 Rolling Hills Dr)
• **10/9/2026**: All-Star Showcase (Upper St. Clair)`;
  }

  if (q.includes('location') || q.includes('pool') || q.includes('address') || q.includes('direction') || q.includes('where')) {
    return `Splish Splash! 🏊‍♂️ **Peters Township Middle School and High School Pool**:

• **Address**: 121 Rolling Hills Drive, McMurray, PA 15317
• **Home Meets**: Hosted on site at 121 Rolling Hills Drive.

**Away Meet Directions**:
• **Mt. Lebanon**: 155 Cochran Rd, Pittsburgh, PA 15228
• **Baldwin**: 4653 Clairton Blvd, Pittsburgh, PA 15236
• **Canon Mac**: 25 East College Street, Canonsburg, PA 15317
• **Elizabeth Forward**: 1000 Weigles Hill Road, Elizabeth, PA 15037`;
  }

  if (q.includes('coach') || q.includes('contact') || q.includes('alex') || q.includes('email')) {
    return `Splish Splash! 🏊‍♂️ **Peters Township Swim and Dive Team Contact Info**:

• **Head Coach**: Alex Hardwick
• **Email**: alexpetersswim@gmail.com

Feel free to email Head Coach Alex Hardwick with any questions!`;
  }

  if (q.includes('interest') || q.includes('sign') || q.includes('join') || q.includes('form') || q.includes('register')) {
    return `Splish Splash! 🏊‍♂️ **2026–2027 Season Planning & Interest Forms**:

Planning is underway for the upcoming season! Please complete the interest form below:
• **Grades 7–8 Interest Form**: https://forms.gle/RfBiDsoc6bQv9KNJ6
• **Grades 9–12 Interest Form**: https://forms.gle/wg7QSi5B6b94koBW9

*Note: Completing the interest form does not commit your student to participating.*`;
  }

  if (q.includes('website') || q.includes('site') || q.includes('link') || q.includes('url')) {
    return `Splish Splash! 🏊‍♂️ **Official Peters Township Swim and Dive Team Website**:

• **Website Link**: https://sites.google.com/view/peters-township-swim-dive

Visit our official website for full team resources, registrations, gear, and updates!`;
  }

  return `Splish Splash! Welcome to the Peters Township Swim and Dive Team assistant!
• **Official Team Website**: https://sites.google.com/view/peters-township-swim-dive
• **Pool Address**: 121 Rolling Hills Drive, McMurray, PA 15317
• **Head Coach**: Alex Hardwick (alexpetersswim@gmail.com)
• **2026-2027 Interest Forms**: Available for Grades 7–8 and Grades 9–12.

I can help you with the schedule, contact information, directions, website links, and interest forms. How can I help?`;
}

// Splash AI Chat Endpoint
app.post('/api/splash/chat', async (req, res) => {
  try {
    const { message, history, docContext } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback response if API key is not present
      return res.json({
        reply: getGroundedFallbackAnswer(message),
        suggestedFollowups: [
          'When are tryouts?',
          'What are the practice schedules?',
          'How do volunteer shifts work?',
          'What swim gear is required?'
        ],
      });
    }

    // Format chat history for Gemini contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Use client-provided docContext if available, otherwise fetch or fallback to cached
    const liveDocText = docContext || await getLiveDocInfo();
    const liveWebsiteText = await getLiveWebsiteInfo();
    const systemPrompt = buildSystemPrompt(liveDocText, liveWebsiteText);

    // Try models in order of preference to handle transient high demand / 503 errors smoothly
const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];
    let replyText = '';

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Gemini model '${modelName}' call failed (e.g., 503 high demand), trying next fallback...`, err?.message || err);
      }
    }

    if (!replyText) {
      replyText = getGroundedFallbackAnswer(message);
    }

    return res.json({
      reply: replyText,
      suggestedFollowups: [
        'Tell me about practice groups',
        'When is the next swim meet?',
        'How do I sign up for volunteer shifts?',
        'Where do we get the team suit?'
      ],
    });
  } catch (error: any) {
    console.error('Error generating Splash AI response:', error);
    const fallbackReply = getGroundedFallbackAnswer(req.body?.message || '');
    return res.json({
      reply: fallbackReply,
      suggestedFollowups: [
        'When are tryouts?',
        'What are the practice schedules?',
        'How do volunteer shifts work?',
        'What swim gear is required?'
      ],
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
    const distPath = path.resolve(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏊‍♂️ Peters Township Swim and Dive Team server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
