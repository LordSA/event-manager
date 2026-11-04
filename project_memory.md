# Technical Program Memory: Multi-Community Event Management Platform

## 1. Executive Summary & Repository Overview
This repository contains **CEV EVENTS**, a high-performance multi-community event management, publishing, slot booking, and discovery platform tailored for campus organizations and technical communities at **College of Engineering Vadakara (CE Vadakara)** (IEEE SB CEV, IEDC CEV, TinkerHub CEV, FOSS Club CEV, MuLearn CEV).

The platform centralizes scheduling, slot reservation, public discovery, direct binary image asset WebP uploads (via `@vercel/blob` & `./app/api/upload/route.ts`), connected multi-day Google Calendar slot booking, custom community brand color signatures with W3C luminance text contrast, strict Dev (Superuser) RBAC protections, and real-time contextual event support via an intelligent **Event Assistant** powered by a multi-provider fallback architecture (`gemini-3.6-flash` with Grok & OpenRouter fallbacks).

---

## 2. Core Architecture & Technology Stack

### Framework & Runtime
* **Framework:** Next.js 16 (App Router) with `remotePatterns` configured in `./next.config.ts` for Vercel Blob Storage.
* **Runtime:** Node.js with React 19 & TypeScript 5.
* **Proxy Middleware:** `./proxy.ts` (Next.js 16 proxy convention) updating Supabase cookies and enforcing role permissions for `/admin` paths.
* **Styling:** Tailwind CSS v4 with Dark Design System combining Restrained Glassmorphism & Light Brutalism.
* **Typography:** `next/font/local` font optimization (`Quera`, `Gued`, `Rondured`) — zero Cumulative Layout Shift (CLS) & preloaded fonts.
* **Smooth Scrolling:** Lenis Smooth Scroll (`./app/components/SmoothScroll.tsx`) with `data-lenis-prevent` on overlay containers. Automatically bypassed on mobile devices (`window.innerWidth < 768`) to ensure 100% smooth, native touch scrolling.
* **Clean Code Policy:** Zero explanatory inline comments in source code files (`.ts`, `.tsx`, `.js`, `.css`) for maximum production readability.
* **Streamlined Role Architecture:** User roles are strictly consolidated to **`Developer` (`dev`)**, **`Admin` (`admin`)**, and **`Manager` (`manager`)**. The legacy `editor` role has been completely decommissioned across database types, RBAC matrices, UI dropdowns, and route protections.
* **Manager Role Safeguards & Users Page Isolation:** Community Managers are strictly restricted from accessing `/admin/users` or managing accounts. The navigation item is hidden in `AdminSidebar.tsx`, route middleware redirects any direct visits to `/admin`, and backend API `/api/admin/users` returns `403 Forbidden` for non-admin callers. Managers can neither add, modify, nor delete other managers.
* **Unified Community Workspace & Events Management:** `./app/admin/my-community/page.tsx` merges community entity branding and full community event management into a single cohesive destination. By default, community branding is displayed in read-only presentation cards to prevent accidental edits, with an "Edit Community Details" button opening a dedicated modal. Community events are managed underneath on the same page with search, filters (Status & Format), view mode toggles (Grid & List), and Create/Edit/Delete modals. The former `/admin/my-community/events` automatically redirects to `/admin/my-community`.
* **Public Event Slug Registration Button Fix & Pill Design:** In `./app/events/[id]/page.tsx`, `getValidRegistrationUrl()` sanitizes registration links (prefixing `https://` if missing) for external form navigation. If no registration link is provided for an event, the "Register Now" button is explicitly disabled (`disabled` attribute, `cursor-not-allowed`, muted opacity). All action buttons use global pill geometry (`rounded-full`) with solid `.brutalist-btn-primary` pill styling in `globals.css`.
* **Main Page Schedules Ordering & Fallback:** In `./app/page.tsx`, `getOrderedSchedules()` filters live events only (`status === 'live'`) and excludes college schedules/exams, prioritizing current month upcoming community events ordered by date nearest to today (`dateA.localeCompare(dateB)`). If no live upcoming events exist in the current month, it automatically falls back to live events from upcoming future months.
* **Events Page 3-Section Architecture:** In `./app/components/MasterCalendar.tsx`, events are partitioned into 3 distinct chronological sections: (1) **Current Month Events** (`event_date >= today` and in current month), (2) **Upcoming (Next Months)** (live events in future months ordered nearest date first), and (3) **Past Events** (events past their date ordered descending with most recent first).
* **Complete Search Engine SEO Suite:** Configured dynamic `app/robots.ts` crawling rules and `app/sitemap.ts` XML generator (auto-indexing public routes, live events `/events/[slug]`, and community pages `/community/[slug]`). Configured OpenGraph, Twitter Cards, `googleBot` crawling metadata, and `schema.org` JSON-LD structured data schemas (`EducationalOrganization`, `WebSite`, `Event`) in `./app/layout.tsx` and `./app/events/[id]/page.tsx` for Google Rich Snippets & Search Console indexing. Includes `./lib/siteUrl.ts` (`getValidSiteUrl()`) to guarantee `https://` scheme prefix on environment site URLs, preventing `TypeError [ERR_INVALID_URL]: Invalid URL` crashes during Next.js builds on Vercel.
* **Custom 404 & Offline Fallback Pages:** `./app/not-found.tsx` delivers a Nixtio editorial 404 experience (`404 / Error Page`) with oversized display typography and pill CTAs (`Return Home`, `Browse Events`, `View Calendar`). `./app/offline/page.tsx` (`005 / Offline Mode`) handles network connection losses with animated status badges, retry actions (`window.location.reload()`), and navigation fallbacks. Both pages automatically suppress standard `<Navbar>` and `<Footer>` layout components via `ConditionalNavbar`, `ConditionalFooter`, and `.hide-nav-footer` body classing for an uncluttered standalone presentation.
* **Fast AI Engine & Event Assistant Drawer UI:** `./app/api/chat/route.ts` using upgraded `gemini-3.6-flash` with 4-second `AbortController` timeouts and OpenRouter referer `https://whatsatcev.shibili.xyz`. `./app/components/EventAiDrawer.tsx` uses React `createPortal(..., document.body)` with ultra-high z-index (`z-[999999]`), making it completely fixed above all page elements, navbars, and scrolling containers.
* **Floating Top Toast Notifications:** In `./app/admin/profile/page.tsx`, profile save and image upload notifications float cleanly at top (`fixed top-6 left-1/2 -translate-x-1/2 z-[100]`) with slide-down entrance animations and 4-second auto-dismissal, avoiding document layout shifts.
* **Mobile Header Smooth Scroll Optimization:** In `./app/components/Navbar.tsx` and `./app/page.tsx`, header size and layout scroll transitions are bypassed on mobile viewports (`window.innerWidth < 768`) to prevent layout recalculations and ensure fluid, stutter-free touch scrolling.
* **User Roles Avatar WebP Upload & Progress:** In `./app/admin/users/page.tsx`, user role creation and editing includes direct image file upload buttons using `uploadImageFile()` from `@/lib/upload.ts` with percentage progress tracking (0–100%) alongside URL fallbacks.
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

-- Seed System College Entity for College Events, Exams & Academic Schedules
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.communities WHERE slug = 'college' OR name = 'College') THEN
    UPDATE public.communities
    SET name = 'College',
        slug = 'college',
        description = 'Official College Academic Events, Exams, and Schedules',
        initials = 'CLG',
        color = '#0ea5e9'
    WHERE slug = 'college' OR name = 'College';
  ELSE
    INSERT INTO public.communities (name, slug, description, initials, color)
    VALUES ('College', 'college', 'Official College Academic Events, Exams, and Schedules', 'CLG', '#0ea5e9');
  END IF;
END $$;
```

### `profiles` Table
```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'manager', -- 'dev' | 'admin' | 'manager'
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Role-Based Access Control (RBAC) Matrix

| User Role | Access User Roles (`/admin/users`) | Access Communities (`/admin/communities`) | Book College Slots & Categories | Modify Dev (`dev`) Users | Community Entity Editing | Create / Edit Events | Delete Events | Toggle Event Status (`closed`/`live`) | Access AI Chat |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Developer (`dev`)** | ✅ (All Users: Dev, Admin, Manager) | ✅ (All Communities) | ✅ (College, Exams, Schedules) | ✅ | ✅ (Full Name, Slug, Logo, Desc, Color) | ✅ (All + Custom Venue) | ✅ (All) | ✅ (All) | ✅ |
| **Admin (`admin`)** | ✅ (Admin & Manager users; Dev hidden) | ✅ (All Communities) | ✅ (College, Exams, Schedules) | ❌ (Forbidden) | ✅ (Full Name, Slug, Logo, Desc, Color) | ✅ (All + Custom Venue) | ✅ (All) | ✅ (All) | ✅ |
| **Manager (`manager`)** | ❌ (Forbidden & Redirected) | ❌ (Forbidden) | ❌ (Strictly Forbidden) | ❌ (Forbidden) | ✅ (Own Community via Edit Button/Modal) | ✅ (Own Community) | ✅ (Own Community) | ✅ (Own Community) | ✅ |
| **Public User** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

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
│   │   │   │   └── route.ts       # Community details update API endpoint
│   │   │   └── users/
│   │   │       └── route.ts       # Supabase Auth + Profiles admin management API endpoint with Dev role guards
│   │   ├── chat/
│   │   │   └── route.ts           # Ultra-fast gemini-3.6-flash AI chat endpoint
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
│   │   │   ├── page.tsx           # Unified Community Workspace (read-only view with Edit Modal + Event Management)
│   │   │   └── events/
│   │   │       └── page.tsx       # Automatic redirect route to /admin/my-community
│   │   ├── profile/
│   │   │   └── page.tsx           # User profile & avatar WebP upload page
│   │   └── users/
│   │       └── page.tsx           # User Roles & Access Management Console (Dev & Admin only)
│   ├── calendar/
│   │   └── page.tsx               # Google Calendar view route (Month, Week, Day grids)
│   ├── components/
│   │   ├── AdminSidebar.tsx       # Standalone admin sidebar component with sticky viewport layout isolation
│   │   ├── ConFooter.tsx          # Global conditional Footer wrapper hiding footer on /admin & /login
│   │   ├── ConNav.tsx             # Global conditional Navbar wrapper hiding main navbar on /admin
│   │   ├── EventAiDrawer.tsx      # z-[200] Event Assistant drawer with body scroll lock
│   │   ├── Footer.tsx             # Developer credits footer with GitHub, LinkedIn, Website, Email & sponsor links
│   │   ├── GoogleCalendarView.tsx # Interactive Google Calendar with multi-day connected banners & W3C luminance text contrast
│   │   ├── MasterCalendar.tsx     # Master event list timeline with 2-line summary cards & community colors
│   │   ├── Navbar.tsx             # Floating navbar with vector badge & single Calendar CTA button
│   │   └── SmoothScroll.tsx       # Lenis smooth scroll provider setup
│   ├── events/
│   │   ├── page.tsx               # Public events directory
│   │   └── [id]/
│   │       └── page.tsx           # Dynamic event detail page with sentence description overview
│   ├── login/
│   │   └── page.tsx               # Password Auth & 6-Digit Email OTP Login
│   ├── page.tsx                   # Public landing page with clean production-ready code
│   └── layout.tsx                 # Root layout with next/font/local (Quera, Gued, Rondured)
├── next.config.ts                 # Next.js configuration with remotePatterns for Vercel Blob Storage
├── proxy.ts                       # Next.js 16 Proxy file for session refresh & admin security
├── fonts/                         # Custom font binaries (.otf, .ttf)
├── lib/
│   ├── auth/
│   │   └── rbac.ts                # Dynamic RBAC matrix permission rules (Developer, Admin, Manager)
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
├── CHANGELOGS.md                  # Versioning history & release notes
├── CONTRIBUTORS.md                # Creator attribution, live GitHub contributor tracking & rules
├── DESIGN.md                      # Design system tokens, color specifications & motion standards
├── LICENSE                        # Official MIT License for Shibili Aman TK
├── PROJECT_MEMORY.md              # Technical program memory (this file)
├── README.md                      # Technical setup & developer guide
└── SECURITY.md                    # Security policy & vulnerability reporting guide
```
