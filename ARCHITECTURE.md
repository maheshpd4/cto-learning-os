# CTO Learning OS — Architecture & Product Requirements Document

**Version:** 1.0  
**Author:** Mahesh (with AI Co-founder)  
**Goal:** Become market-ready for AI Solution Architect / Principal Architect / CTO-level roles by **November 4, 2026**  
**Start Date:** May 15, 2026  
**Time Available:** ~24 weeks (172 days)

---

## 1. Product Overview

CTO Learning OS is a personal transformation platform — not a generic learning management system. It is purpose-built for one user (you) to plan, execute, track, and continuously improve a structured learning journey toward AI + Data + Cloud + Enterprise Integration leadership.

The system combines four intelligence layers:

| Layer | Role |
|---|---|
| **Structured Roadmap** | Week-by-week plan across 6 phases |
| **Daily Execution Engine** | Tasks, check-ins, streak tracking |
| **AI Coach** | Gemini-powered coaching, code review, interview prep |
| **Insight Engine** | Skill scoring, confidence trends, gap detection |

---

## 2. Recommended Tech Stack

### Why this stack?

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Full-stack in one repo; API routes + RSC; no separate backend |
| Language | TypeScript | Type safety across schema, API, UI |
| Styling | Tailwind CSS + shadcn/ui | Rapid, beautiful, accessible UI components |
| Charts | Recharts | React-native, composable, no jQuery |
| ORM | Prisma | Type-safe DB access; easy migrations; great DX |
| Database (dev) | PostgreSQL via Docker | Production parity from day 1; no SQLite surprises |
| AI | Google Gemini 1.5 Flash | Free tier; 1M token context; fast |
| AI abstraction | Custom `lib/gemini.ts` | Swap provider without touching pages |
| Auth | None (v1) | Single-user app; no login friction |
| Deployment | Docker Compose | One command to start everything locally |
| CI/CD | GitHub Actions (v4) | Automated lint + type-check on push |

---

## 3. Folder Structure

```
cto-learning-os/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (sidebar + theme)
│   ├── globals.css               # Global styles + CSS variables
│   ├── page.tsx                  # Redirect to /dashboard
│   ├── (dashboard)/              # Route group (all protected pages)
│   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   ├── dashboard/page.tsx    # Main dashboard
│   │   ├── roadmap/page.tsx      # 6-phase roadmap timeline
│   │   ├── checkin/page.tsx      # Daily check-in flow
│   │   ├── coach/page.tsx        # AI Coach chat interface
│   │   ├── practice/page.tsx     # Coding practice engine
│   │   ├── materials/page.tsx    # Material hub
│   │   └── projects/page.tsx     # Portfolio tracker
│   └── api/                      # Backend API routes
│       ├── dashboard/route.ts    # Dashboard summary data
│       ├── tasks/route.ts        # CRUD daily tasks
│       ├── checkin/route.ts      # Submit check-in + trigger AI
│       ├── checkin/[id]/route.ts # Get specific check-in
│       ├── coach/route.ts        # AI Coach streaming chat
│       ├── skills/route.ts       # Skill scores CRUD
│       ├── materials/route.ts    # Materials CRUD
│       ├── projects/route.ts     # Projects CRUD
│       ├── practice/route.ts     # Generate practice exercises
│       └── roadmap/route.ts      # Roadmap phases + weeks
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── shared/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── ThemeToggle.tsx       # Dark/light switcher
│   │   └── PageHeader.tsx        # Reusable page header
│   ├── dashboard/
│   │   ├── SkillScoreCard.tsx    # Individual skill area card
│   │   ├── ProgressRing.tsx      # SVG progress ring
│   │   ├── StreakCard.tsx        # Daily streak display
│   │   ├── DailyPlanCard.tsx     # Today's tasks
│   │   ├── AIRecommendation.tsx  # Today's AI suggestion
│   │   └── WeeklyBarChart.tsx    # Weekly completion chart
│   ├── roadmap/
│   │   ├── PhaseCard.tsx         # Phase summary card
│   │   ├── WeekRow.tsx           # Week detail row
│   │   └── RoadmapTimeline.tsx   # Visual timeline
│   ├── checkin/
│   │   ├── CheckInForm.tsx       # Multi-step check-in form
│   │   └── CheckInSummary.tsx    # AI-generated summary display
│   ├── coach/
│   │   ├── ChatPanel.tsx         # Chat UI with streaming
│   │   └── MessageBubble.tsx     # Individual message
│   ├── materials/
│   │   ├── MaterialCard.tsx      # Material item card
│   │   └── AddMaterialModal.tsx  # Add new material form
│   └── projects/
│       ├── ProjectCard.tsx       # Project overview card
│       └── ProjectBacklog.tsx    # Sprint backlog view
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── gemini.ts                 # Gemini API abstraction
│   └── prompts.ts                # All AI prompt templates
├── hooks/
│   ├── useDashboard.ts           # Dashboard data hook
│   ├── useCheckin.ts             # Check-in state management
│   └── useCoach.ts               # Coach chat state
├── types/
│   └── index.ts                  # Shared TypeScript types
├── prisma/
│   ├── schema.prisma             # Full database schema
│   └── seed.ts                   # Roadmap + initial data seed
├── .env.example                  # Environment variable template
├── docker-compose.yml            # App + PostgreSQL + pgAdmin
├── Dockerfile                    # Production container
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind + custom CTO theme
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Setup + usage guide
```

---

## 4. Database Schema (Conceptual)

### Core Entities and Relationships

```
Phase (1) ──── has many ──── Week (many)
Week  (1) ──── has many ──── DailyTask (many)
DailyTask ────────────────── belongs to Week

CheckIn (1 per day) ─────── captures daily progress
SkillScore (timeseries) ──── tracks skill growth over time
CoachMessage ────────────── conversation history with AI
Material ────────────────── learning resources
Project ──── has many ────── ProjectTask
PracticeExercise ────────── concept-based coding tasks
```

### Skill Areas (enum)
- `AI_SYSTEMS` — ML, LLMs, RAG, vector search, agents
- `DATA_PLATFORMS` — BigQuery, Spark, Kafka, Flink, dbt
- `CLOUD_ARCHITECTURE` — GCP, AWS multi-cloud, IaC, networking
- `ENTERPRISE_INTEGRATION` — APIs, event-driven, ESB, microservices
- `PLATFORM_ENGINEERING` — Kubernetes, Helm, Terraform, GitOps
- `SECURITY` — Zero-trust, IAM, SAST/DAST, compliance
- `PRODUCT_FINANCE_LEADERSHIP` — Product sense, P&L, team leadership

---

## 5. Six-Phase Roadmap (May 15 – Nov 4, 2026)

| Phase | Title | Dates | Duration | Focus |
|---|---|---|---|---|
| 1 | Foundation Acceleration | May 15 – Jun 7 | 3.5 weeks | Gaps audit, core concepts, system design patterns |
| 2 | AI + Data Platform | Jun 8 – Jul 5 | 4 weeks | LLMs, RAG, vector DBs, streaming pipelines |
| 3 | Enterprise Integration | Jul 6 – Aug 2 | 4 weeks | Kafka, APIs, event mesh, microservice patterns |
| 4 | Platform Engineering + DevSecOps | Aug 3 – Aug 30 | 4 weeks | K8s, Terraform, GitOps, security posture |
| 5 | CTO Business Leadership | Aug 31 – Sep 27 | 4 weeks | Product strategy, architecture reviews, team design |
| 6 | Market Readiness | Sep 28 – Nov 4 | 5 weeks | Portfolio polish, mock interviews, networking |

### Phase Deliverables

| Phase | Project Deliverable |
|---|---|
| 1 | Personal knowledge gap audit + architecture principles doc |
| 2 | Enterprise AI RAG Platform (MVP) |
| 3 | Travel Booking Event Platform |
| 4 | Secure SaaS Multi-tenant Platform |
| 5 | AI Observability & Cost Control Platform |
| 6 | Complete portfolio + resume bullets + interview ready |

---

## 6. API Design

### REST Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard` | Full dashboard summary (tasks, scores, streak) |
| GET | `/api/tasks` | Today's tasks |
| PUT | `/api/tasks/:id` | Update task status |
| POST | `/api/checkin` | Submit daily check-in |
| GET | `/api/checkin` | List past check-ins |
| GET | `/api/checkin/:id` | Get single check-in with AI summary |
| POST | `/api/coach` | Send message to AI Coach (streaming) |
| GET | `/api/skills` | Get skill scores (latest + history) |
| POST | `/api/skills` | Update skill score |
| GET | `/api/materials` | List materials (filterable) |
| POST | `/api/materials` | Add new material |
| PUT | `/api/materials/:id` | Update material |
| DELETE | `/api/materials/:id` | Delete material |
| GET | `/api/projects` | List all projects |
| PUT | `/api/projects/:id` | Update project |
| POST | `/api/projects/:id/tasks` | Add project task |
| POST | `/api/practice` | Generate practice exercise for concept |
| GET | `/api/roadmap` | Full roadmap with phases and weeks |

---

## 7. AI Integration Architecture

### LLM Abstraction Layer (`lib/gemini.ts`)

The AI layer is designed to be **provider-agnostic**. In v1, it uses Google Gemini 1.5 Flash. To switch to Claude or OpenAI, only `lib/gemini.ts` needs to change — not a single page or API route.

```
┌─────────────────────────────────────┐
│        Application Layer            │
│  (pages, API routes, components)    │
└──────────────┬──────────────────────┘
               │ calls
┌──────────────▼──────────────────────┐
│      AI Abstraction (lib/ai.ts)     │
│  generateText(prompt, context)      │
│  generateStream(prompt, context)    │
│  reviewCode(code, concept)          │
└──────────────┬──────────────────────┘
               │ implements
┌──────────────▼──────────────────────┐
│    Provider: Gemini 1.5 Flash       │
│    (swap: Claude / OpenAI / local)  │
└─────────────────────────────────────┘
```

### Prompt Templates (lib/prompts.ts)

| Template | Trigger | Output |
|---|---|---|
| `dailyReviewPrompt` | Check-in submission | Summary, corrections, next-day plan, interview Qs |
| `coachChatPrompt` | Coach message | CTO-level explanation, scenarios, challenges |
| `codeReviewPrompt` | Code paste in check-in | Review, improvements, optimised version |
| `practiceGenPrompt` | Practice page concept | 3-level tasks + expected output |
| `resumeBulletPrompt` | Project completion | STAR-format resume bullet |
| `weeklyReplanPrompt` | Low completion trigger | Adjusted week plan based on actual progress |

---

## 8. UI/UX Design System

### Theme: "CTO Dark"

```
Background:  #0a0f1e  (deep space navy)
Card:        #111827  (slate-900)
Border:      #1f2937  (slate-800)
Accent:      #06b6d4  (cyan-500) — primary CTA
Success:     #10b981  (emerald-500)
Warning:     #f59e0b  (amber-500)
Danger:      #ef4444  (red-500)
Text:        #f9fafb  (slate-50)
Muted:       #6b7280  (slate-500)
```

### Component Hierarchy

```
RootLayout
  └── ThemeProvider
        └── DashboardLayout
              ├── Sidebar (fixed left, collapsible)
              └── MainContent
                    ├── PageHeader
                    └── PageContent (grid/flex layout)
```

---

## 9. MVP Phases

### MVP 1 — Core Learning Engine (this session)
- [x] Dashboard with all 7 skill scores, streak, daily plan
- [x] Full 6-phase roadmap with weekly breakdown
- [x] Daily check-in flow with AI-generated summary
- [x] AI Coach chat (Gemini 1.5 Flash)
- [x] Prisma + PostgreSQL schema + seed data
- [x] Docker Compose setup

### MVP 2 — Enrichment (next sprint)
- [ ] Coding practice engine with exercise generation
- [ ] Material hub with full CRUD and filtering
- [ ] Project portfolio tracker with sprint backlog

### MVP 3 — Integration
- [ ] Google Calendar sync via OAuth
- [ ] GitHub API: show recent commits per project
- [ ] Advanced analytics: confidence trend, velocity chart

### MVP 4 — Production
- [ ] Docker + GitHub Actions CI/CD
- [ ] GCP Cloud Run deployment option
- [ ] Export: PDF report of week's progress

---

## 10. Environment Variables

```bash
# Database
DATABASE_URL="postgresql://cto:cto_password@localhost:5432/cto_learning_os"

# AI Provider (Gemini)
GEMINI_API_KEY="your-gemini-api-key-here"
GEMINI_MODEL="gemini-1.5-flash"

# Optional future providers
# OPENAI_API_KEY=""
# ANTHROPIC_API_KEY=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 11. Development Commands

```bash
# Start everything (first time)
docker compose up -d          # Start PostgreSQL
npm install                   # Install dependencies
npx prisma migrate dev        # Run migrations
npx prisma db seed            # Seed roadmap data
npm run dev                   # Start Next.js on :3000

# Daily use
npm run dev                   # Start dev server
npx prisma studio             # Visual DB explorer on :5555

# Deployment
docker compose up --build -d  # Build and start full stack
```

---

*This document is the single source of truth for the CTO Learning OS architecture. Update it as the system evolves.*
