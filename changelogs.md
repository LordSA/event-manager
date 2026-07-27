# Changelogs & Version History

All notable changes and structural milestones for **Whats @CEV / Event Manager** will be documented in this file.

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
