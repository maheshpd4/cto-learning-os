# 🚀 CTO Learning OS

**Your personal AI-powered CTO transformation platform.**  
Goal: Become an AI + Data + Cloud Principal Architect / CTO by **November 4, 2026**.

---

## What This App Does

| Module | What it gives you |
|---|---|
| **Dashboard** | Daily plan, skill scores, streak, AI recommendation |
| **Roadmap** | 6-phase, 24-week plan with tasks and deliverables |
| **Daily Check-in** | End-of-day review → AI generates summary + tomorrow's plan |
| **AI Coach** | Gemini-powered coaching, mock interviews, code review |
| **Practice Engine** | AI-generated exercises at 3 levels for any concept |
| **Materials Hub** | Track courses, videos, repos, notes by skill area |
| **Projects** | Portfolio tracker with sprint backlog + AI resume bullets |

---

## Quick Start (5 minutes)

### Prerequisites
- Node.js 20+ ([download](https://nodejs.org))
- Docker Desktop ([download](https://docker.com/products/docker-desktop))
- Free Gemini API key ([get one](https://aistudio.google.com/app/apikey))

### Step 1 — Clone and configure

```bash
cd "CTO Learning OS"

# Copy environment file
cp .env.example .env.local

# Edit .env.local and add your Gemini API key:
# GEMINI_API_KEY="your-key-here"
```

### Step 2 — Start the database

```bash
# Start PostgreSQL (runs in background)
docker compose up db -d

# Verify it's running
docker compose ps
```

### Step 3 — Install and setup

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev --name init

# Seed with your full 6-phase roadmap
npx prisma db seed
```

### Step 4 — Launch

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Daily Workflow

```
Morning:
  → Open Dashboard → review today's tasks → start learning

During the day:
  → Mark tasks complete as you finish them
  → Add resources to Materials Hub
  → Ask AI Coach questions

Evening:
  → Click "Daily Check-in" → answer 6 questions
  → AI generates: summary, corrections, tomorrow's plan, interview questions

Weekly:
  → Review Roadmap → check phase progress → update project tasks
```

---

## AI Features Walkthrough

### AI Coach (ask anything)
Navigate to **AI Coach** and type any question:
- "Explain Kafka exactly-once semantics at CTO level"
- "Give me a system design interview for a video streaming platform"
- "Review my understanding of RAG: [your explanation]"

### Daily Check-in AI Analysis
After submitting your check-in, the AI will give you:
- Honest progress summary
- Corrections to any misconceptions
- Tomorrow's specific task plan
- 3 interview questions from today's topics
- A practice challenge

### Practice Engine
Navigate to **Practice** → type any concept → get:
- Beginner task
- Intermediate coding challenge
- Architect-level design challenge
- Sample solution with code
- Real-world company usage
- Interview Q&A

### Resume Bullets
In **Projects** → expand any project → click "Generate AI Resume Bullet" to get a STAR-format resume bullet ready for job applications.

---

## Database Management

```bash
# Visual database explorer (runs at http://localhost:5555)
npx prisma studio

# Reset everything and re-seed
npm run db:reset

# Create a new migration after schema changes
npx prisma migrate dev --name your_change_name
```

---

## Folder Structure

```
app/
  (dashboard)/        → all pages
    dashboard/        → main dashboard
    roadmap/          → 6-phase roadmap
    checkin/          → daily check-in flow
    coach/            → AI coaching chat
    practice/         → coding practice engine
    materials/        → resource hub
    projects/         → portfolio tracker
  api/               → all backend API routes
components/
  shared/            → Sidebar, ThemeToggle, ThemeProvider
lib/
  prisma.ts          → database client
  gemini.ts          → AI provider abstraction
  prompts.ts         → all AI prompt templates
  utils.ts           → helpers, color maps
prisma/
  schema.prisma      → full database schema
  seed.ts            → roadmap + project seed data
```

---

## Changing the AI Provider

All AI calls go through `lib/gemini.ts`. To switch to another provider:

1. Install the provider SDK (e.g., `npm install openai`)
2. Update `lib/gemini.ts` to use the new provider
3. No other files need to change

The functions to implement are:
- `generateText(prompt, systemInstruction)` → `string`
- `generateJSON<T>(prompt, systemInstruction)` → `T`
- `coachReply(message, history, systemInstruction)` → `string`

---

## Production Deployment

```bash
# Build and run with Docker (full stack)
cp .env.example .env.local   # fill in values
docker compose --profile production up --build -d

# App runs at http://localhost:3000
```

---

## Roadmap Phases

| Phase | Dates | Title |
|---|---|---|
| 1 | May 15 – Jun 7 | Foundation Acceleration |
| 2 | Jun 8 – Jul 5 | AI + Data Platform Mastery |
| 3 | Jul 6 – Aug 2 | Enterprise Integration |
| 4 | Aug 3 – Aug 30 | Platform Engineering + DevSecOps |
| 5 | Aug 31 – Sep 27 | CTO Business Leadership |
| 6 | Sep 28 – Nov 4 | Market Readiness |

---

*Built with Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Prisma · PostgreSQL · Google Gemini*
