# Program Memory: Multi-Community Event Management Platform

## 1. Executive Summary & Overview
This repository contains **Whats @CEV / Event Manager**, a high-performance multi-community event management, publishing, and discovery platform tailored for campus organizations and technical communities (e.g., IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

The platform addresses the challenge of scattered event information by centralizing scheduling, slot reservation, public discovery, and real-time contextual event support via an intelligent **Event AI Assistant** powered by a multi-provider fallback architecture.

---

## 2. Core Architecture & Tech Stack

### Framework & Runtime
* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Runtime:** Node.js with React 19 & TypeScript 5
* **Styling:** Tailwind CSS v4 with Glassmorphism, Custom HSL Gradients, and Dark-mode aesthetics

### Backend, Database & Authentication
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security - RLS)
* **Authentication:** Supabase Auth (Passwordless Email OTP & Session Management)
* **RBAC:** Dynamic role validation in database RLS policies and Next.js middleware / server components

### Animation, Visual Effects & Motion Engine
* **Smooth Scrolling:** `Lenis` (buttery smooth scrolling integration)
* **3D Graphics & Shaders:** `Three.js` & `WebGL` for interactive background particle fields and 3D event card depth
* **Motion & Micro-interactions:** `Framer Motion` (modal drawers, UI entry transitions) and `GSAP` + `ScrollTrigger` (timeline pinning, visual scroll reveals)

### Multi-Provider Fallback AI Architecture
The platform features an automated sequential fallback engine for event queries:
1. **Primary Provider:** Google Gemini API (`@google/generative-ai`)
2. **Secondary Provider (Fallback 1):** Grok API (xAI)
3. **Tertiary Provider (Fallback 2):** OpenRouter API (Accessing Llama 3 / Mistral)

If a provider fails due to rate limits or outage, the request automatically fails over to the next provider seamlessly.

---

## 3. Directory & Codebase Layout

```
event-manager/
├── .agents/
│   └── AGENTS.md                  # Developer agent workspace rules & guidelines
├── app/
│   ├── (main)/                    # Core app layout group
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # Multi-provider fallback AI chat endpoint
│   ├── community/
│   │   ├── page.tsx               # Community listing overview
│   │   └── [id]/
│   │       └── page.tsx           # Individual community public page & events
│   ├── components/
│   │   ├── ConNav.tsx             # Contextual Sub-navigation bar
│   │   ├── Navbar.tsx             # Main header with brand & auth entry
│   │   └── SmoothScroll.tsx       # Lenis smooth scroll provider setup
│   ├── event/
│   │   └── page.tsx               # Public event listing with filter controls
│   ├── events/
│   │   └── [id]/
│   │       └── page.tsx           # Dynamic event detail page with AI modal
│   ├── lib/
│   │   └── data.ts                # Mock dataset & default fallback data definitions
│   ├── favicon.ico
│   ├── globals.css                # Custom CSS variables, glassmorphic utilities
│   ├── layout.tsx                 # Root layout with font definitions & Lenis
│   └── page.tsx                   # Interactive hero landing page
├── public/                        # Static assets, posters, images
├── changelogs.md                  # Project versioning and change history
├── design.md                      # Design system, color tokens, motion rules
├── project_memory.md              # Complete technical program memory (this file)
├── README.md                      # Technical installation & developer guide
├── package.json                   # Project dependencies and script scripts
├── tsconfig.json                  # TypeScript compiler settings
└── next.config.ts                 # Next.js configuration settings
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| User Role | Manage Users & Roles | Create / Delete Communities | Edit Own Community | Create / Edit Events | Delete Events | Toggle Status (`closed`/`live`) | Access AI Chat |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dev / Admin** | ✅ | ✅ | ✅ (All) | ✅ (All) | ✅ (All) | ✅ (All) | ✅ |
| **Manager (Lead)** | ❌ | ❌ | ✅ (Own) | ✅ (Own) | ✅ (Own) | ✅ (Own) | ✅ |
| **Editor** | ❌ | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (Own) | ✅ |
| **Public User** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Database Schema & Supabase Blueprint

### `profiles` Table
Stores user role assignments and community affiliations. Linked directly to `auth.users`.
* `id` (`UUID`, PK, references `auth.users.id` ON DELETE CASCADE)
* `email` (`TEXT`, NOT NULL)
* `full_name` (`TEXT`)
* `role` (`ENUM`: `'dev'`, `'admin'`, `'manager'`, `'editor'`, DEFAULT `'editor'`)
* `community_id` (`UUID`, FK -> `communities.id`, NULLABLE for Super Admins)
* `created_at` (`TIMESTAMPTZ`, DEFAULT `now()`)
* `updated_at` (`TIMESTAMPTZ`, DEFAULT `now()`)

### `communities` Table
Stores metadata for each participating campus community.
* `id` (`UUID`, PK, DEFAULT `gen_random_uuid()`)
* `name` (`TEXT`, NOT NULL)
* `slug` (`TEXT`, UNIQUE, NOT NULL)
* `logo_url` (`TEXT`)
* `description` (`TEXT`)
* `color` (`TEXT`, e.g., `'from-blue-600 to-cyan-400'`)
* `initials` (`TEXT`, e.g., `'IE'`)
* `created_at` (`TIMESTAMPTZ`, DEFAULT `now()`)
* `updated_at` (`TIMESTAMPTZ`, DEFAULT `now()`)

### `events` Table
Holds all event details, slot reservations, and AI knowledge context.
* `id` (`UUID`, PK, DEFAULT `gen_random_uuid()`)
* `community_id` (`UUID`, FK -> `communities.id` ON DELETE CASCADE, NOT NULL)
* `slug` (`TEXT`, UNIQUE, NOT NULL)
* `title` (`TEXT`, NOT NULL)
* `category` (`TEXT`, e.g., `'hackathon'`, `'workshop'`, `'competition'`)
* `poster_url` (`TEXT`)
* `event_date` (`DATE`, NOT NULL)
* `time_slot` (`TEXT`, NOT NULL, e.g., `'10:00 AM - 4:00 PM'`)
* `venue` (`TEXT`)
* `redirect_url` (`TEXT`, Registration external link)
* `status` (`ENUM`: `'closed'`, `'live'`, DEFAULT `'closed'`)
* `system_prompt` (`TEXT`, Prompt context fed to the AI assistant for this specific event)
* `description` (`TEXT`)
* `created_at` (`TIMESTAMPTZ`, DEFAULT `now()`)
* `updated_at` (`TIMESTAMPTZ`, DEFAULT `now()`)

### `ai_configs` Table
Server-side configuration table for managing AI provider priority routing and API keys fallback.
* `id` (`UUID`, PK, DEFAULT `gen_random_uuid()`)
* `provider_name` (`TEXT`, UNIQUE, e.g., `'gemini'`, `'grok'`, `'openrouter'`)
* `priority_order` (`INT`, NOT NULL)
* `is_active` (`BOOLEAN`, DEFAULT true)
* `api_key_env_var` (`TEXT`, NOT NULL)
* `model_name` (`TEXT`, NOT NULL)

---

## 6. Key Workflows & Engines

### A. Slot Booking & Publishing Engine
1. **Slot Reservation (`closed` state):**
   * Managers and Editors select a target date and time slot for their event.
   * The system saves the record in `closed` status.
   * Internal calendar view renders `closed` events for **all authenticated community managers**, allowing cross-community conflict checks and avoiding date overlaps.
   * **Public front-end hides `closed` events completely.**
2. **Event Publication (`live` state):**
   * Once event logistics are confirmed, a Manager or Editor toggles status to `live`.
   * Row-Level Security policies permit public SELECT queries for `live` events.
   * Event surfaces immediately across public search, calendar view, and community pages.

### B. Multi-Provider AI Fallback Pipeline
When a user asks a question on an event page (`/events/[slug]`):
1. Client sends request to `/api/chat` with `eventId` and user query message.
2. Server retrieves event details and `system_prompt`.
3. Server executes API request chain:
   * **Step 1:** Call **Google Gemini 3 Flash** API using `system_prompt` + user query.
   * **Step 2:** If Gemini returns an error or times out, trigger fallback to **Grok API** (xAI).
   * **Step 3:** If Grok returns an error, trigger fallback to **OpenRouter API**.
4. Formatted Markdown response is streamed or returned to the client UI drawer.

---

## 7. SEO & Performance Guidelines
* **SEO Metadata:** Every page exports dynamic metadata via Next.js `generateMetadata` including OpenGraph cards, Twitter cards, canonical tags, and structured JSON-LD schemas.
* **Scroll Performance:** Lenis smooth scrolling initialized on top of Next.js root layout.
* **Graphic Optimization:** Three.js and WebGL canvas elements rendered with requestAnimationFrame throttling and automatic canvas resize observers.
