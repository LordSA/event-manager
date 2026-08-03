# Technical Program Memory: Multi-Community Event Management Platform

## 1. Executive Summary & Repository Overview
This repository contains **Whats @CEV / Event Manager**, a high-performance multi-community event management, publishing, slot booking, and discovery platform tailored for campus organizations and technical communities at **College of Engineering Vadakara (CE Vadakara)** (IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

The platform centralizes scheduling, slot reservation, public discovery, direct binary image asset WebP uploads (via `@vercel/blob` & `./app/api/upload/route.ts`), connected multi-day Google Calendar slot booking, custom community brand color signatures with W3C luminance text contrast, strict Dev (Superuser) RBAC protections, and real-time contextual event support via an intelligent **Event Assistant** powered by a multi-provider fallback architecture (`gemini-1.5-flash` with Grok & OpenRouter fallbacks).

---

## 2. Core Architecture & Technology Stack

### Framework & Runtime
* **Framework:** Next.js 16 (App Router) with `remotePatterns` configured in `./next.config.ts` for Vercel Blob Storage.
* **Runtime:** Node.js with React 19 & TypeScript 5.
* **Proxy Middleware:** `./proxy.ts` (Next.js 16 proxy convention) updating Supabase cookies and enforcing role permissions for `/admin` paths.
* **Styling:** Tailwind CSS v4 with Dark Design System combining Restrained Glassmorphism & Light Brutalism.
* **Typography:** `next/font/local` font optimization (`Quera`, `Gued`, `Rondured`) — zero Cumulative Layout Shift (CLS) & preloaded fonts.
* **Smooth Scrolling:** Lenis Smooth Scroll (`./app/components/SmoothScroll.tsx`) with `data-lenis-prevent` on overlay containers.
* **Clean Code Policy:** Zero explanatory inline comments in source code files (`.ts`, `.tsx`, `.js`, `.css`) for maximum production readability.

### Backend, Database & Vercel Blob Storage
* **Database Engine:** Supabase PostgreSQL with RLS (`events`, `communities.color`, `communities.logo_url`, `profiles.avatar_url`).
* **Storage Provider:** Vercel Blob Storage (`@vercel/blob`).
* **Realtime Events Hook & Master Calendar:** `./lib/hooks/useRealtimeEvents.ts` queries `events` joined with `community:communities(id, name, slug, color)` and maps `community_color` onto `EventItemData`.
* **Google Calendar Booking Engine:** `./app/components/GoogleCalendarView.tsx` supports Month, Week, Day, and Grid view modes. Features:
  - **Connected Multi-Day Banners:** `getEventDatePosition(evt, dateObj)` detects multi-day range boundaries and renders connected horizontal banner bars across calendar columns with 0px column gaps (`px-0` day cell containers, `ml-1 mr-0` start day, `mx-0` middle days, `mr-1 ml-0` end day).
  - **Dynamic Community Colors:** Dynamically applies community signature colors for event card backgrounds (~20-25% opacity fill), borders (~65-75% opacity), and title bullet dots.
  - **W3C Relative Luminance Contrast:** `isDarkColor(hex)` and `getReadableTextColor(hex)` calculate perceived relative luminance `(0.299*R + 0.587*G + 0.114*B) / 255`. If a community color is dark (< 0.6), community name text automatically renders in crisp bright white (`#f8fafc`) for 100% legibility.
* **Standalone Sticky Admin Sidebar:** `./app/components/AdminSidebar.tsx` isolates navigation logic with sticky viewport positioning (`sticky top-0 h-screen`), preventing main page length or scroll height from affecting sidebar layout.
* **Dev / Superuser RBAC Protection:**
  - `./app/admin/users/page.tsx`: Filters out `dev` profiles from non-dev views and hides `Dev (Super Admin)` role selection options.
  - `./app/api/admin/users/route.ts`: Server-side authorization validation returning `403 Forbidden` if a non-dev user attempts to create, modify, or delete a `dev` user.
* **Public Summarizers & Description Parser:** `./lib/summary.ts` generates clean 2-line summary cards. Description parser in `./app/events/[id]/page.tsx` uses lookbehind regex (`/(?<=[.!?])\s+|\n+/`) to extract 3 clean sentences.
* **Fast AI Engine & Drawer Chat UI:** `./app/api/chat/route.ts` using `gemini-1.5-flash` with 4-second `AbortController` timeouts. `./app/components/EventAiDrawer.tsx` features `renderFormattedMessage` parsing markdown bold syntax (`**text**`) into styled `<strong>` tags. Includes offline fallback parser (`generateOfflineResponse`).
* **Authentication:** Supabase Auth with Dual Login Modes: 6-Digit Email OTP verification & Password Authentication (`./app/login/page.tsx`).

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
  color TEXT DEFAULT '#6366f1', -- Community signature color hex code
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

| User Role | Access User Roles (`/admin/users`) | Access Communities (`/admin/communities`) | Modify Dev (`dev`) Users | Community Entity Editing | Create / Edit Events | Delete Events | Toggle Event Status (`closed`/`live`) | Access AI Chat |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dev (Super Admin)** | ✅ (All Users) | ✅ | ✅ | ✅ (Full Name, Slug, Logo, Desc, Color) | ✅ (All + Venue Input) | ✅ (All) | ✅ (All) | ✅ |
| **Admin** | ✅ (Non-Dev Users) | ✅ | ❌ (Strictly Forbidden) | ✅ (Full Name, Slug, Logo, Desc, Color) | ✅ (All + Venue Input) | ✅ (All) | ✅ (All) | ✅ |
| **Manager (Lead)** | ✅ (Own Community Leads) | ❌ | ❌ (Strictly Forbidden) | ✅ (Own Community via `/admin/my-community`) | ✅ (Own Community + Venue) | ✅ (Own Community) | ✅ (Own Community) | ✅ |
| **Editor** | ❌ | ❌ | ❌ (Strictly Forbidden) | ❌ | ✅ (Own Community + Venue) | ❌ | ✅ (Own Community) | ✅ |
| **Public User** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Complete Directory Layout & Relative File References

```
event-manager/
├── .agents/
│   └── AGENTS.md                  # Developer agent workspace rules & guidelines
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── my-community/
│   │   │   │   └── route.ts       # Manager level community update API endpoint
│   │   │   └── users/
│   │   │       └── route.ts       # Supabase Auth + Profiles admin management API endpoint with Dev role guards
│   │   ├── chat/
│   │   │   └── route.ts           # Ultra-fast gemini-1.5-flash AI chat endpoint
│   │   ├── profile/
│   │   │   └── route.ts           # Self profile update API route
│   │   └── upload/
│   │       └── route.ts           # Vercel Blob API upload route (@vercel/blob put)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase Auth code exchange handler
│   ├── admin/
│   │   ├── layout.tsx             # Protected Admin layout with standalone sticky sidebar & sign-out
│   │   ├── page.tsx               # Admin Dashboard overview metrics
│   │   ├── communities/
│   │   │   └── page.tsx           # Community Management with color pickers, modals & WebP upload
│   │   ├── events/
│   │   │   └── page.tsx           # Admin booking engine integrated with Google Calendar Slot View
│   │   ├── my-community/
│   │   │   └── page.tsx           # Assigned community lead manager portal
│   │   ├── profile/
│   │   │   └── page.tsx           # User profile & avatar WebP upload page
│   │   └── users/
│   │       └── page.tsx           # Community Leads & Team Management Console with Dev protection
│   ├── calendar/
│   │   └── page.tsx               # Google Calendar view route (Month, Week, Day grids)
│   ├── components/
│   │   ├── AdminSidebar.tsx       # Standalone admin sidebar component with sticky viewport layout isolation
│   │   ├── ConNav.tsx             # Global conditional Navbar wrapper hiding main navbar on /admin
│   │   ├── EventAiDrawer.tsx      # z-[200] Event Assistant drawer with body scroll lock
│   │   ├── GoogleCalendarView.tsx # Interactive Google Calendar with multi-day connected banners & W3C luminance text contrast
│   │   ├── MasterCalendar.tsx     # Master event list timeline with 2-line summary cards & community colors
│   │   ├── Navbar.tsx             # Floating navbar with vector badge & single Calendar CTA button
│   │   └── SmoothScroll.tsx       # Lenis smooth scroll provider setup
│   ├── events/
│   │   ├── page.tsx               # Public events directory
│   │   └── [id]/
│   │       └── page.tsx           # Dynamic event detail page with 3-line sentence description overview
│   ├── login/
│   │   └── page.tsx               # Password Auth & 6-Digit Email OTP Login
│   ├── page.tsx                   # Public landing page with clean production-ready code
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
│   │   └── useRealtimeEvents.ts   # Real-time Supabase hook for events joined with communities color
│   ├── summary.ts                 # Clean 2-line public summary generator
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client creator
│   │   ├── middleware.ts          # Edge cookie session updater & protected route proxy
│   │   └── server.ts              # Server Supabase client creator
│   └── upload.ts                  # Client-side WebP image converter & Vercel Blob API uploader
├── public/
│   └── fonts/                     # Public font binaries for fallback web loading
├── changelogs.md                  # Versioning history & release notes
├── design.md                      # Design system tokens, color specifications & motion standards
├── project_memory.md              # Technical program memory (this file)
└── README.md                      # Technical setup & developer guide
```
