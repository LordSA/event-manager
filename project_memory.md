# Program Memory: Multi-Community Event Management Platform

## 1. Executive Summary & Overview
This repository contains **Whats @CEV / Event Manager**, a high-performance multi-community event management, publishing, and discovery platform tailored for campus organizations and technical communities (IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

The platform centralizes scheduling, slot reservation, public discovery, and real-time contextual event support via an intelligent **Event Assistant** powered by a multi-provider fallback architecture with a friendly peer-to-peer campus buddy persona.

---

## 2. Core Architecture & Tech Stack

### Framework & Runtime
* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **Runtime:** Node.js with React 19 & TypeScript 5
* **Styling:** Tailwind CSS v4 with Glassmorphism, Custom HSL Gradients, and Dark-mode aesthetics

### Backend, Database & Authentication
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security - RLS)
* **Authentication:** Supabase Auth (6-Digit Email OTP verification & Next.js Edge Proxy Session Management)
* **Auth Callback:** `/auth/callback/route.ts` (Handles code exchange for session creation)
* **Realtime Sync:** Supabase Postgres Realtime (`postgres_changes` subscriptions on `events`, `communities`, `profiles`)
* **RBAC:** Dynamic role validation in database RLS policies and Next.js `proxy.ts` edge middleware

### Animation, Visual Effects & Motion Engine
* **Smooth Scrolling:** `Lenis` (buttery smooth scrolling integration)
* **3D Graphics & Shaders:** `Three.js` & `WebGL` for GPU particle starfield hero canvas (`HeroCanvas.tsx`)
* **Motion & Drawer Physics:** `Framer Motion` (Event Assistant slide-over drawer `EventAiDrawer.tsx`)

### Multi-Provider Fallback AI Architecture & Friendly Persona
The platform features an automated sequential fallback engine for event queries with a warm, conversational peer tone:
1. **Primary Provider:** Google Gemini API (`gemini-2.5-flash`)
2. **Secondary Provider (Fallback 1):** Grok API (xAI)
3. **Tertiary Provider (Fallback 2):** OpenRouter API (`meta-llama/llama-3.1-70b-instruct`)

---

## 3. Directory & Codebase Layout

```
event-manager/
├── .agents/
│   └── AGENTS.md                  # Developer agent workspace rules & guidelines
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts           # Multi-provider fallback AI chat endpoint with friendly peer persona
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase Auth code exchange handler
│   ├── admin/
│   │   ├── layout.tsx             # Protected Admin layout with desktop sidebar & mobile sub-pills
│   │   ├── page.tsx               # Admin Dashboard overview metrics
│   │   ├── communities/
│   │   │   └── page.tsx           # Community CRUD & profile bio editor
│   │   ├── events/
│   │   │   └── page.tsx           # Slot Booking & Event Publishing Engine
│   │   └── users/
│   │       └── page.tsx           # Super Admin User Accounts & Role Management console
│   ├── components/
│   │   ├── ConNav.tsx             # Global conditional Navbar wrapper
│   │   ├── EventAiDrawer.tsx      # Framer Motion Event Assistant slide-over drawer
│   │   ├── HeroCanvas.tsx         # Three.js / WebGL particle canvas
│   │   ├── MasterCalendar.tsx     # 3-way view switcher (Calendar, List, Community Filter)
│   │   ├── Navbar.tsx             # Single global header & Mobile App UI bottom nav bar
│   │   └── SmoothScroll.tsx       # Lenis smooth scroll provider setup
│   ├── events/
│   │   ├── page.tsx               # Public events discovery page
│   │   └── [id]/
│   │       └── page.tsx           # Dynamic event detail page with SEO JSON-LD schema
│   ├── login/
│   │   └── page.tsx               # 6-Digit Email OTP Authentication page
│   ├── page.tsx                   # Public hero landing page
│   ├── globals.css
│   └── layout.tsx                 # Root layout with Lenis & ConditionalNavbar
├── lib/
│   ├── auth/
│   │   └── rbac.ts                # Dynamic RBAC matrix permission rules
│   ├── hooks/
│   │   ├── useCommunities.ts      # Real-time Supabase hook for communities with fallbacks
│   │   ├── useProfiles.ts         # Real-time Supabase hook for user profiles
│   │   └── useRealtimeEvents.ts   # Real-time Supabase hook for events with fallbacks
│   └── supabase/
│       ├── client.ts              # Browser Supabase client creator
│       ├── middleware.ts          # Edge cookie session updater & protected route proxy
│       └── server.ts              # Server Supabase client creator
├── public/                        # Static assets, posters, images
├── proxy.ts                       # Next.js 16 Edge proxy middleware entry point
├── changelogs.md                  # Versioning history & release notes
├── design.md                      # Design system, color tokens, motion rules
├── project_memory.md              # Technical program memory (this file)
└── README.md                      # Technical setup & developer guide
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
* `community_id` (`UUID`, FK -> `communities.id` ON DELETE CASCADE, NULLABLE)
* `slug` (`TEXT`, UNIQUE, NOT NULL)
* `title` (`TEXT`, NOT NULL)
* `category` (`TEXT`, DEFAULT `'workshop'`)
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

---

## 6. Security, Authentication & Proxy Scoping
* **Next.js 16 Edge Proxy (`proxy.ts`):** Automatically refreshes auth session cookies on every incoming request.
* **Protected Routes:** Intercepts unauthenticated requests to `/admin/*` and redirects to `/login?redirectTo=...`.
* **Super Admin Role Enforcement:** `/admin/users` is restricted to `dev` and `admin` roles only.
* **Direct 6-Digit OTP Login:** Managers enter their email on `/login`, receive a 6-digit OTP code, and verify directly in the UI. Supabase template is configured to output `{{ .Token }}`.
