# Changelogs & Version History

All notable changes and structural milestones for **Whats @CEV / Event Manager** will be documented in this file.

---

## [0.4.0] - 2026-07-27

### 📱 Mobile App UI & Bottom Navigation Bar
- **App UI Bottom Navigation (`Navbar.tsx`):** Added native app-style bottom navigation bar (`fixed bottom-0 left-0 right-0 z-50 md:hidden`) with glassmorphism surface (`bg-slate-950/95 backdrop-blur-2xl`), active path indicators, and touch feedback.
- **Mobile Tabs:** Provides 5 instant tabs: Home (`/`), Events (`/events`), Slot Booking (`/admin/events`), Communities (`/admin/communities`), and Account/Dashboard (`/admin` / `/login`).
- **Responsive Layout Padding:** Added bottom safe area padding (`pb-20 md:pb-0`) across all main page containers and admin layouts to prevent mobile bottom navigation overlaps.

---

## [0.3.0] - 2026-07-27

### ⚡ Realtime Data Sync, Next.js Middleware & Auth Upgrade
- **Supabase Realtime Sync Engine:** Created `useRealtimeEvents` custom hook subscribing to Postgres `postgres_changes` on `events` table; instantly updates public discovery views and admin master calendar across all connected clients without page reloads.
- **Next.js SSR Middleware Proxy (`middleware.ts` & `lib/supabase/middleware.ts`):** Enforces cookie session updates and protects `/admin/*` routes. Redirects unauthenticated users to `/login?redirectTo=...` and restricts `/admin/users` to `dev` and `admin` roles only.
- **2-Step Passwordless OTP Auth:** Enhanced `/login` to support both direct magic links and 6-digit OTP code verification inside the UI. Added `onAuthStateChange` listener to `Navbar.tsx` displaying user role badges and logout controls.
- **User Experience Banners & Toasts:** Added real-time status banners and RBAC violation feedback messages across slot booking and deletion flows.

---

## [0.2.0] - 2026-07-27

### 🚀 Full Platform Implementation & Production Build
- **Supabase Integration & RBAC Helpers:** Added `@supabase/supabase-js`, `@supabase/ssr`, TypeScript schemas (`types/database.types.ts`), client & server instantiators (`lib/supabase/client.ts`, `lib/supabase/server.ts`), and permission matrix checks (`lib/auth/rbac.ts`).
- **Multi-Provider AI Fallback Route:** Built `/api/chat` supporting automated failover routing: `Google Gemini 2.5 Flash` $\rightarrow$ `Grok API (xAI)` $\rightarrow$ `OpenRouter API (Meta Llama 3.1)`.
- **Slot Booking & Publishing Engine:** Implemented Admin Event Booking Console (`/admin/events`) supporting `closed` (draft slot reservation) vs `live` (public publication) states with RBAC deletion rules.
- **Admin Dashboard Console:** Created Super Admin User Accounts & Role Management (`/admin/users`), Community Management (`/admin/communities`), and Email OTP Login (`/login`).
- **WebGL / Three.js Visual Engine:** Developed GPU particle starfield hero canvas (`app/components/HeroCanvas.tsx`) with mouse drift physics.
- **Framer Motion AI Drawer:** Created dynamic event assistant slide-over drawer (`app/components/EventAiDrawer.tsx`).
- **Master Calendar & Public Discovery:** Created 3-way view switcher (`MasterCalendar.tsx`) offering Date Order List, Master Calendar Grid, and Community Filtering.
- **SEO Optimization:** Embedded structured JSON-LD Event metadata schemas across dynamic event detail pages (`/events/[id]`).

---

## [0.1.0] - 2026-07-27

### 🚀 Architecture & Specification Blueprint
- **Multi-Community RBAC Specification:** Defined 4-tier matrix (`dev`, `admin`, `manager`, `editor`, `public`) across all community and event operations.
- **Database & RLS Schema Blueprint:** Designed Supabase SQL tables (`profiles`, `communities`, `events`, `ai_configs`) with automated RLS policies.
- **Multi-Provider AI Fallback Pipeline:** Specified sequential failover flow: `Google Gemini 3 Flash` -> `Grok (xAI)` -> `OpenRouter API`.
- **Slot Booking & Publishing Engine:** Created draft (`closed`) vs published (`live`) state mechanics for master calendar conflict resolution.
- **Motion & Graphics Stack:** Integrated Lenis smooth scrolling, WebGL/Three.js particle canvas specifications, Framer Motion drawer physics, and GSAP ScrollTrigger timeline reveals.
- **Developer Documentation & Agent Rules:** Formatted workspace specifications into `project_memory.md`, `design.md`, `changelogs.md`, `.agents/AGENTS.md`, and rewritten `README.md`.
