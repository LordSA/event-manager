# Technical Program Memory: Multi-Community Event Management Platform

## 1. Executive Summary & Repository Overview
This repository contains **Whats @CEV / Event Manager**, a high-performance multi-community event management, publishing, slot booking, and discovery platform tailored for campus organizations and technical communities at **College of Engineering Vadakara (CE Vadakara)** (IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

The platform centralizes scheduling, slot reservation, public discovery, direct binary image asset WebP uploads (via `@vercel/blob` & `./app/api/upload/route.ts` API route), and real-time contextual event support via an intelligent **Event Assistant** powered by a multi-provider fallback architecture (`gemini-1.5-flash` with Grok & OpenRouter fallbacks) with a friendly peer-to-peer campus buddy persona.

---

## 2. Core Architecture & Technology Stack

### Framework & Runtime
* **Framework:** Next.js 16 (App Router) with `remotePatterns` configured in `./next.config.ts` for Vercel Blob Storage.
* **Runtime:** Node.js with React 19 & TypeScript 5.
* **Proxy Middleware:** `./proxy.ts` (Next.js 16 proxy convention) updating Supabase cookies and enforcing role permissions for `/admin` paths.
* **Styling:** Tailwind CSS v4 with Dark Design System combining Restrained Glassmorphism & Light Brutalism.
* **Typography:** `next/font/local` font optimization (`Quera`, `Gued`, `Rondured`) — zero Cumulative Layout Shift (CLS) & preloaded fonts.
* **Smooth Scrolling:** Lenis Smooth Scroll (`./app/components/SmoothScroll.tsx`) with `data-lenis-prevent` on overlay containers.

### Backend, Database & Vercel Blob Storage
* **Database Engine:** Supabase PostgreSQL with RLS (`events.poster_url`, `events.venue`, `communities.logo_url`, `profiles.avatar_url`).
* **Storage Provider:** Vercel Blob Storage (`@vercel/blob`).
* **Realtime Events Hook & Master Calendar:** `./lib/hooks/useRealtimeEvents.ts` maps `poster_url`, `venue`, `perks`, `slug`, `community_id`, and `community_slug` into `EventItemData`. `./app/events/page.tsx` and `./app/components/MasterCalendar.tsx` match the active dark brutalist design system (`#08090d`, `#0f121d`, `#161a29`, `#1e2436`, `#6366f1`) with full-card links and clickable community subpage badges. `./app/page.tsx` features full event card redirection. `./app/community/[id]/page.tsx` and `./app/events/[id]/page.tsx` feature left-aligned `"Back"` buttons that execute `router.back()`.
* **Public Summarizers & Description Parser:** `./lib/summary.ts` (generates 2-line cards for directory & calendar popovers). `refactorDescription3Lines` in `./app/events/[id]/page.tsx` uses a lookbehind regex splitter (`/(?<=[.!?])\s+|\n+/`) to extract 3 clean sentences regardless of missing periods or markdown formatting.
* **Fast AI Engine & Drawer Chat UI:** `./app/api/chat/route.ts` using `gemini-1.5-flash` with `maxOutputTokens: 250` and 4-second `AbortController` timeouts. `./app/components/EventAiDrawer.tsx` features `renderFormattedMessage` to parse markdown bold syntax (`**text**`) into styled `<strong>` badge tags inside chat bubbles. Includes an intelligent offline fallback parser (`generateOfflineResponse`).
* **Authentication:** Supabase Auth with Dual Login Modes: 6-Digit Email OTP verification & Password Authentication (`./app/login/page.tsx`).
* **Admin User API:** `./app/api/admin/users/route.ts` (Creates/modifies users in both Supabase Auth `auth.users` AND public `profiles` table using `SUPABASE_SERVICE_ROLE_KEY`).

---

## 3. Database Schema & Supabase Table Definitions

### `events` Table
```sql
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL DEFAULT 'Workshop',
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  event_date DATE NOT NULL,
  time_slot TEXT DEFAULT '10:00 AM - 04:00 PM',
  venue TEXT DEFAULT 'Campus Setup / CEV',
  status TEXT DEFAULT 'closed', -- 'closed' (draft slot) | 'live' (published)
  description TEXT,
  perks TEXT,
  poster_url TEXT,
  system_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `communities` Table
```sql
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  initials TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `profiles` Table
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'editor', -- 'dev' | 'admin' | 'manager' | 'editor'
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| User Role | Access User Roles (`/admin/users`) | Access Communities (`/admin/communities`) | Community Entity Editing | Create / Edit Events | Delete Events | Toggle Event Status (`closed`/`live`) | Access AI Chat |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dev / Admin** | ✅ (All Users) | ✅ | ✅ (Full Name, Slug, Logo, Desc) | ✅ (All + Venue Input) | ✅ (All) | ✅ (All) | ✅ |
| **Manager (Lead)** | ✅ (Own Community Leads) | ❌ | ❌ | ✅ (Own Community + Venue) | ✅ (Own Community) | ✅ (Own Community) | ✅ |
| **Editor** | ❌ | ❌ | ❌ | ✅ (Own Community + Venue) | ❌ | ✅ (Own Community) | ✅ |
| **Public User** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Complete Directory Layout & Relative File References

```
event-manager/
├── .agents/
│   └── AGENTS.md                  # Developer agent workspace rules & guidelines
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── users/
│   │   │       └── route.ts       # Supabase Auth + Profiles admin management API endpoint
│   │   ├── chat/
│   │   │   └── route.ts           # Ultra-fast gemini-1.5-flash AI chat endpoint
│   │   └── upload/
│   │       └── route.ts           # Vercel Blob API upload route (@vercel/blob put)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase Auth code exchange handler
│   ├── admin/
│   │   ├── layout.tsx             # Protected Admin layout with role-based navigation sidebar & sign-out
│   │   ├── page.tsx               # Admin Dashboard overview metrics
│   │   ├── communities/
│   │   │   └── page.tsx           # Community Entity Management with Edit & Create modals & WebP upload
│   │   ├── events/
│   │   │   └── page.tsx           # Admin booking engine page integrated with Google Calendar Slot View & max-w-3xl modal
│   │   ├── profile/
│   │   │   └── page.tsx           # User profile & avatar WebP upload page
│   │   └── users/
│   │       └── page.tsx           # Community Leads & Team Management Console
│   ├── calendar/
│   │   └── page.tsx               # Google Calendar view route (Month, Week, Day time-grid views)
│   ├── components/
│   │   ├── ConNav.tsx             # Global conditional Navbar wrapper hiding main navbar on /admin
│   │   ├── EventAiDrawer.tsx      # z-[200] Event Assistant drawer with body scroll lock
│   │   ├── GoogleCalendarView.tsx # Interactive Google Calendar component supporting public & admin slot booking modes
│   │   ├── MasterCalendar.tsx     # Master event list timeline with 2-line summary cards
│   │   ├── Navbar.tsx             # Floating navbar with vector badge & single Calendar CTA button
│   │   └── SmoothScroll.tsx       # Lenis smooth scroll provider setup
│   ├── events/
│   │   ├── page.tsx               # Public events directory
│   │   └── [id]/
│   │       └── page.tsx           # Dynamic event detail page with 4-5 line description overview
│   ├── login/
│   │   └── page.tsx               # Password Auth & 6-Digit Email OTP Login with suppressHydrationWarning
│   ├── page.tsx                   # Public landing page with clean production-ready code (zero comments)
│   └── layout.tsx                 # Root layout with next/font/local (Quera, Gued, Rondured)
├── next.config.ts                 # Next.js configuration with remotePatterns for Vercel Blob Storage
├── proxy.ts                       # Next.js 16 Proxy file for session refresh & admin security
├── fonts/                         # Custom font binaries (.otf, .ttf)
├── lib/
│   ├── auth/
│   │   └── rbac.ts                # Dynamic RBAC matrix permission rules
│   ├── hooks/
│   │   ├── useCommunities.ts      # Real-time Supabase hook for communities
│   │   ├── useProfiles.ts         # Real-time Supabase hook for user profiles
│   │   └── useRealtimeEvents.ts   # Real-time Supabase hook for events
│   ├── summary.ts                 # Clean 2-line public summary generator (zero comments)
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client creator
│   │   ├── middleware.ts          # Edge cookie session updater & protected route proxy
│   │   ├── server.ts              # Server Supabase client creator
│   │   └── storage.ts             # Storage adapter delegating to lib/upload.ts
│   └── upload.ts                  # Clean client-side WebP image converter & Vercel Blob API uploader
├── public/
│   └── fonts/                     # Public font binaries for fallback web loading
├── changelogs.md                  # Versioning history & release notes
├── design.md                      # Design system & motion specification
├── project_memory.md              # Technical program memory (this file)
└── README.md                      # Technical setup & developer guide
```
