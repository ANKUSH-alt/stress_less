# 🧠 StressLess – AI-Powered Intelligent Stress Companion

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.7-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.1-orange?logo=meta)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

**A world-class, production-ready, human-centered web application built to manage stress using AI-driven insights and behavioral intervention.**

🔗 **Live Demo**: [https://stressless-blush.vercel.app](https://stressless-blush.vercel.app)

</div>

---

## 🚀 Vision

StressLess is not just an app — it's a **living AI companion** that understands user behavior, explains stress clearly, and provides real-time personalized support across all age groups. Built with **Design Thinking Lab (DTL)** principles, it combines emotional intelligence with modern web technology.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Shadcn UI, Glassmorphism Design |
| **AI Engine** | Groq SDK + LLaMA 3.1 8B Instant |
| **Animations** | Framer Motion |
| **Markdown** | React Markdown (rich AI response rendering) |
| **Audio** | Web Audio API (procedural ambient sounds) |
| **Storage** | LocalStorage (client-side preferences & journal) |
| **Icons** | Lucide React |
| **Deployment** | Vercel (auto-deploy from GitHub) |

---

## ✨ Features & Functionality

### 1. 🏠 Landing Page (`/`)
- **Animated hero** with gradient text and entrance animations
- **Feature cards** highlighting AI Detection, Human-Centered Design, and Privacy
- **Call-to-action buttons** — "Get Started" and "Talk to AI"
- Fully responsive across mobile, tablet, and desktop

### 2. 📊 Smart Dashboard (`/dashboard`)
- **Stress Score Ring** — Animated SVG circular progress indicator (0–100) with color-coded status:
  - 🟢 **Calm** (< 30) — Green
  - 🟡 **Moderate** (30–69) — Amber
  - 🔴 **High** (70–89) — Red
  - 🚨 **Crisis** (90+) — Critical alert
- **Mood Tracker** — One-tap emoji-based mood logging (Sad, Neutral, Happy, Great, Stressed) persisted to localStorage
- **AI Companion Suggestions** — Dynamic insight cards for Sleep Quality, Focus Peak, and Adaptive recommendations
- **Quick Intervention Link** — Direct shortcut to 1-min micro-actions
- **Personalized Greeting** — Time-of-day aware greeting using the user's saved name

### 3. 💬 AI Chat Companion (`/chat`)
- **Real-time AI Conversation** powered by Groq's LLaMA 3.1 model
- **Age-Adaptive Tone** — Switches personality based on selected age group:
  - **Teen**: Casual, engaging, relatable
  - **Adult**: Professional yet warm
  - **Senior**: Clear, gentle, respectful
- **Crisis Detection** — Automatically detects distress keywords (self-harm, suicide, etc.) and responds with emergency resources (988 Suicide & Crisis Lifeline)
- **Markdown Rendering** — AI responses are beautifully formatted with bold text, bullet points, and structured layouts
- **Typing Indicator** — Animated bounce dots while AI generates a response
- **Fallback System** — Graceful fallback responses if the AI API is unavailable
- **Chat Avatars** — Visual distinction between user and assistant messages

### 4. 🧘 Relaxation Hub (`/relaxation`)
- **Guided Breathing Circle** — Animated breathing exercise with inhale/hold/exhale phases and visual pulsating guide
- **Focus Timer** — Customizable countdown timer for mindfulness sessions
- **Ambient Sound Engine** — 4 procedurally-generated ambient soundscapes using the Web Audio API (no audio files needed):
  - 🌧️ **Rain** — Layered rain bed + drizzle + random raindrop impacts
  - 🌲 **Forest** — Wind breeze + rustling leaves + bird chirps (oscillator-based)
  - 🌊 **Waves** — Ocean surf + foam with periodic swell modulation
  - 📻 **White Noise** — Filtered noise for concentration
- **Meditation Cards** — Quick-start sessions (Ocean Breath 5min, Deep Sleep Prep 10min, Morning Clarity 3min) that auto-scroll to the breathing circle

### 5. 📔 AI Reflection Journal (`/journal`)
- **Free-form Text Editor** — Large textarea with no-distraction writing experience
- **AI-Powered Insights** — Submit journal entries for emotional analysis via Groq LLaMA:
  - Identifies emotional themes
  - Provides constructive, empathetic reflections
  - Formatted with rich Markdown
- **Save & History** — Entries saved to localStorage with date labels, previews, and recall functionality (up to 12 entries)
- **Daily Prompts** — Pre-written journaling prompts to inspire reflection:
  - "What's one thing you're proud of today?"
  - "What did you learn from a challenge?"
  - "Who cheered you up today?"
- **Clear History** — One-click wipe of all saved entries

### 6. ⚡ 1-Minute Micro-Actions (Dashboard Section)
- **Eye Palming** (30s) — Cover eyes with warm palms to relieve digital strain
- **Wrist Reset** (1 min) — Gentle rotations to release typing tension
- **Cold Splash** (30s) — Cold water face splash to reset the nervous system
- **Full-Screen Focus Overlay** — Immersive modal with pulsating animation during the action + completion celebration

### 7. ⚙️ Settings (`/settings`)
- **Display Name** — Personalize the dashboard greeting
- **Age Group Selector** — Teen / Adult / Senior (affects AI chat personality)
- **Wellness Goal** — Custom daily goal text
- **Daily Reminder Toggle** — Enable/disable nudge reminders
- All preferences persisted to localStorage and used across the app

---

## 🏗️ Project Architecture

```
stress_less/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing / Hero page
│   │   ├── layout.tsx                  # Root layout (Navigation + Background)
│   │   ├── globals.css                 # Global styles & CSS variables
│   │   ├── dashboard/page.tsx          # Smart Dashboard
│   │   ├── chat/page.tsx               # AI Chat Companion
│   │   ├── journal/page.tsx            # AI Reflection Journal
│   │   ├── relaxation/page.tsx         # Relaxation Hub
│   │   ├── settings/
│   │   │   ├── page.tsx                # Settings wrapper
│   │   │   └── SettingsClient.tsx      # Settings form (client component)
│   │   └── api/
│   │       ├── chat/route.ts           # POST /api/chat — AI chat endpoint
│   │       └── journal/reflect/route.ts # POST /api/journal/reflect — Journal AI
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── StressScore.tsx         # Animated SVG stress ring
│   │   │   └── MoodTracker.tsx         # Emoji mood selector
│   │   ├── relaxation/
│   │   │   ├── BreathingCircle.tsx     # Guided breathing animation
│   │   │   └── FocusTimer.tsx          # Countdown focus timer
│   │   ├── layout/
│   │   │   └── Navigation.tsx          # Sidebar (desktop) + Bottom nav (mobile)
│   │   ├── shared/
│   │   │   ├── BackgroundGlows.tsx     # Ambient background effects
│   │   │   └── MicroActionSystem.tsx   # 1-min intervention cards + modal
│   │   └── ui/
│   │       ├── button.tsx              # Shadcn button variants
│   │       ├── input.tsx               # Shadcn input
│   │       └── textarea.tsx            # Shadcn textarea
│   ├── lib/
│   │   ├── prefs.ts                    # User preferences (localStorage)
│   │   └── utils.ts                    # Utility functions (cn, etc.)
│   ├── services/
│   │   └── stressDetection.ts          # Stress score algorithm + crisis detection
│   └── models/
│       └── User.ts                     # Mongoose User model (MongoDB)
├── .env                                # Environment variables (local only)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

---

## 🔌 API Routes

### `POST /api/chat`

AI-powered conversational wellness assistant.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "I'm feeling stressed about work" }
  ],
  "ageGroup": "Adult"
}
```

**Response:**
```json
{
  "content": "**I hear you.** Work stress is incredibly common...\n\n* Try a 4-7-8 breathing technique\n* Break your tasks into smaller wins"
}
```

**Features:**
- Crisis keyword detection with emergency resource response
- Age-group adaptive tone (Teen/Adult/Senior)
- Conversation history support
- Graceful fallback if AI is unavailable

---

### `POST /api/journal/reflect`

AI-powered journal entry reflection and emotional analysis.

**Request Body:**
```json
{
  "content": "Today was overwhelming. I couldn't finish my tasks and felt behind all day."
}
```

**Response:**
```json
{
  "reflection": "**It sounds like you're carrying a heavy load today.** The feeling of being behind can be draining...\n\n* Try identifying your top 3 priorities for tomorrow\n* Consider a brief evening wind-down routine"
}
```

---

## 🧪 Stress Detection Algorithm

The stress score is calculated from four behavioral inputs:

| Input | Effect |
|-------|--------|
| **Sleep Hours** | < 6h → +20 stress, > 8h → -10 |
| **Screen Time** | > 8h → +15, < 4h → -5 |
| **Mood Score** | Stressed (5) → +25, Sad (1) → +15 |
| **Activity Minutes** | > 30 min → -15, 0 min → +5 |

**Base Score:** 50 → Clamped to 0–100

| Score Range | Status | Action |
|-------------|--------|--------|
| 0 – 29 | 🟢 Calm | Keep maintaining this balance! |
| 30 – 69 | 🟡 Moderate | A quick walk might help you reset. |
| 70 – 89 | 🔴 High | Deep-focus meditation recommended. |
| 90 – 100 | 🚨 Crisis | Consider taking the day off. |

---

## 📦 Setup & Installation

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- A **Groq API Key** ([get one free at console.groq.com](https://console.groq.com))

### 1. Clone the Repository
```bash
git clone https://github.com/ANKUSH-alt/stress_less.git
cd stress_less
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

### 6. Lint the Codebase
```bash
npm run lint
```

---

## 🚀 Deployment (Vercel)

This project is deployed on **Vercel** with automatic deployments from the `main` branch.

### Manual Deployment via CLI
```bash
npx vercel --prod --yes
```

### Environment Variables on Vercel
Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable | Value | Scope |
|----------|-------|-------|
| `GROQ_API_KEY` | `your_api_key` | Production |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Production |

---

## 🔐 Ethics & Safety

- **Crisis Detection**: The chat API scans for high-distress keywords (self-harm, suicide intent) and immediately responds with emergency safety resources
- **Not Medical Advice**: Clear disclaimers throughout the app that AI responses are not substitutes for professional help
- **Privacy First**: All user preferences and journal entries are stored locally in the browser (localStorage) — no data is sent to external servers beyond AI API calls
- **No Data Retention**: AI conversations are not stored server-side

---

## 📱 Responsive Design

StressLess is fully responsive across all device sizes:

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navigation | Bottom tab bar | Bottom tab bar | Sidebar |
| Dashboard | Single column | Single column | 2-column grid |
| Chat | Full-width bubbles | Full-width bubbles | Centered container |
| Journal | Stacked layout | Stacked layout | 3-column grid |
| Relaxation | Stacked cards | Stacked cards | 3-column grid |

---

## 🗂️ Dependencies

### Production
| Package | Purpose |
|---------|---------|
| `next` | Full-stack React framework |
| `react` / `react-dom` | UI library |
| `groq-sdk` | Groq API client for LLaMA AI |
| `react-markdown` | Render AI Markdown responses |
| `framer-motion` | Smooth animations & transitions |
| `lucide-react` | Modern icon library |
| `tailwind-merge` | Merge Tailwind class conflicts |
| `class-variance-authority` | UI component variant system |
| `mongoose` | MongoDB ODM |
| `shadcn` | UI component primitives |

### Dev
| Package | Purpose |
|---------|---------|
| `tailwindcss` | Utility-first CSS |
| `typescript` | Static type checking |
| `eslint` | Code quality |

---

## 📄 License

**Ankush Gupta** — Full Stack Developer & AI Developer  
Built for the **Design Thinking Lab (DTL)**

---

<div align="center">

Made with ❤️ by **Ankush Gupta**

</div>
