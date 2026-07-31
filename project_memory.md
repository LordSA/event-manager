# Program Memory: Multi-Community Event Management Platform

## 1. Executive Summary & Overview
This repository contains **Whats @CEV / Event Manager**, a high-performance multi-community event management, publishing, and discovery platform tailored for campus organizations and technical communities (IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

The platform centralizes scheduling, slot reservation, public discovery, direct binary image asset WebP uploads (via `@vercel/blob` & `/api/upload` API route), and real-time contextual event support via an intelligent **Event Assistant** powered by a multi-provider fallback architecture with a friendly peer-to-peer campus buddy persona.

---

## 2. Core Architecture & Tech Stack

### Framework & Runtime
* **Framework:** Next.js 16 (App Router)
* **Runtime:** Node.js with React 19 & TypeScript 5
* **Styling:** Tailwind CSS v4 with Dark Design System combining Restrained Glassmorphism & Light Brutalism
* **Typography:** `next/font/local` font optimization (`Quera`, `Gued`, `Rondured`) — zero CLS & preloaded fonts.

### Backend, Database & Vercel Blob Storage
* **Database:** Supabase PostgreSQL with RLS (`events.poster_url`, `communities.logo_url`, `profiles.avatar_url`)
* **Storage Provider:** Vercel Blob Storage (`@vercel/blob`)
* **Upload Engine:** Next.js API Route `/api/upload/route.ts` & Client-Side WebP Converter `lib/upload.ts`
* **Authentication:** Supabase Auth with Dual Login Modes: 6-Digit Email OTP verification & Password Authentication.
* **Admin User API:** `/api/admin/users/route.ts` (Creates/modifies users in both Supabase Auth `auth.users` AND `profiles` table)
* **Realtime Sync:** Supabase Postgres Realtime (`postgres_changes` subscriptions on `events`, `communities`, `profiles`)
* **RBAC Scoping:** Granular route and page-level permission scoping in Next.js `middleware.ts` and UI layout.

---

## 3. Role-Based Access Control (RBAC) Matrix

| User Role | Access User Roles (`/admin/users`) | Access Communities (`/admin/communities`) | Community Page Editing | Create / Edit Events | Delete Events | Toggle Event Status (`closed`/`live`) | Access AI Chat |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dev / Admin** | ✅ (All Users) | ✅ | ✅ (All + Slug Edit) | ✅ (All) | ✅ (All) | ✅ (All) | ✅ |
| **Manager (Lead)** | ✅ (Own Community Leads) | ❌ | ❌ | ✅ (Own Community) | ✅ (Own Community) | ✅ (Own Community) | ✅ |
| **Editor** | ❌ | ❌ | ❌ | ✅ (Own Community) | ❌ | ✅ (Own Community) | ✅ |
| **Public User** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 4. Directory & Codebase Layout

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
│   │   │   └── route.ts           # Multi-provider fallback AI chat endpoint with friendly peer persona
│   │   └── upload/
│   │       └── route.ts           # Vercel Blob API upload route (@vercel/blob put)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # Supabase Auth code exchange handler
│   ├── admin/
│   │   ├── layout.tsx             # Protected Admin layout with role-based navigation sidebar
│   │   ├── page.tsx               # Admin Dashboard overview metrics
│   │   ├── communities/
│   │   │   └── page.tsx           # Community Entity Management with logo WebP upload & slug editing
│   │   ├── events/
│   │   │   └── page.tsx           # Slot Booking & Event Publishing Engine with poster WebP upload
│   │   └── users/
│   │       └── page.tsx           # Community Leads & Team Management Console
│   ├── calendar/
│   │   └── page.tsx               # Google Calendar view route (Month, Week, Day time-grid views)
│   ├── components/
│   │   ├── ConNav.tsx             # Global conditional Navbar wrapper
│   │   ├── EventAiDrawer.tsx      # Event Assistant slide-over drawer
│   │   ├── GoogleCalendarView.tsx # Google Calendar component (Month/Week/Day time-grid views)
│   │   ├── MasterCalendar.tsx     # Master event list timeline
│   │   ├── Navbar.tsx             # Floating glass pill navbar with logo.png & GSAP entrance animations
│   │   └── SmoothScroll.tsx       # Lenis smooth scroll provider setup
│   ├── events/
│   │   ├── page.tsx               # Public events directory
│   │   └── [id]/
│   │       └── page.tsx           # Dynamic event detail page with SEO JSON-LD schema
│   ├── login/
│   │   └── page.tsx               # Password Auth & 6-Digit Email OTP Authentication page
│   ├── page.tsx                   # Public landing page with Quera/Gued font typography and brutalist tokens
│   └── layout.tsx                 # Root layout with next/font/local (Quera, Gued, Rondured)
├── fonts/                         # Custom font binaries (.otf, .ttf)
├── lib/
│   ├── auth/
│   │   └── rbac.ts                # Dynamic RBAC matrix permission rules
│   ├── hooks/
│   │   ├── useCommunities.ts      # Real-time Supabase hook for communities
│   │   ├── useProfiles.ts         # Real-time Supabase hook for user profiles
│   │   └── useRealtimeEvents.ts   # Real-time Supabase hook for events
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client creator
│   │   ├── middleware.ts          # Edge cookie session updater & protected route proxy
│   │   ├── server.ts              # Server Supabase client creator
│   │   └── storage.ts             # Storage adapter delegating to lib/upload.ts
│   └── upload.ts                  # Client-side WebP image converter & Vercel Blob API uploader
├── public/
│   └── fonts/                     # Public font binaries for fallback web loading
├── proxy.ts                       # Next.js 16 Edge proxy middleware entry point
├── changelogs.md                  # Versioning history & release notes
├── design.md                      # Design system & motion specification
├── project_memory.md              # Technical program memory (this file)
└── README.md                      # Technical setup & developer guide
```
