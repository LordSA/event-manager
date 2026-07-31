# Changelogs & Version History

All notable changes and structural milestones for **Whats @CEV / Event Manager** will be documented in this file.

---

## [0.20.0] - 2026-07-31

### 🚀 Direct Image Asset Uploads & Mobile Responsive Layout Engine
- **Supabase Storage Integration (`lib/supabase/storage.ts`):** Built `uploadImageToSupabase` helper utility for binary image uploads to public buckets `avatars` and `community-logos`.
- **Profile Avatar Uploads (`app/admin/profile/page.tsx`):** Added file picker input with 2MB validation uploading profile picture avatars directly to Supabase Storage.
- **Community Logo Uploads (`app/admin/my-community/page.tsx` & `app/admin/communities/page.tsx`):** Integrated direct file upload support for community branding logos in the admin dashboard.
- **Responsive Container Spacing (`pt-28 md:pt-32`):** Added uniform top padding across all landing, calendar, event directory, community, and detail pages to prevent floating header overlaps on mobile, tablet, and desktop screens.

---

## [0.19.0] - 2026-07-31

### 💎 Full Design System Overhaul & Restrained Glass / Light Brutalism Architecture
- **Complete Visual Overhaul:** Built rich obsidian dark color system (`#08090d` background, `#0f121d` surface, `#6366f1` electric indigo primary accent) combining restrained glassmorphism with light brutalism (`.brutalist-card`, `.brutalist-btn-primary`).
- **Typography Engine (`Quera`, `Gued`, `Rondured`):** Declared custom `@font-face` fonts in `globals.css`. Inter has been completely removed.
- **Navbar Redesign (`app/components/Navbar.tsx`):** Removed generic icon logo, replaced with `/logo.png`. Removed position badge and logout button. Header displays `Logo | Home | Calendar | Events | Communities` (+ `Dashboard` when logged in).
- **Dual Auth Login (`app/login/page.tsx`):** Added Password Authentication alongside the 6-digit OTP verification flow.
- **Admin Dashboard & Community Logos/Slugs (`app/admin/my-community/page.tsx` & `app/admin/communities/page.tsx`):** Added logo image URL upload support and restricted custom slug editing to `dev` and `admin` roles.
- **Profile Avatar Upload (`app/admin/profile/page.tsx`):** Integrated user profile picture avatar URL management and password updates.

---

## [0.18.0] - 2026-07-31

### 🎨 Clean Dark Product Redesign (Landing, Navigation & Google Calendar)
- **Eliminated AI Fluff:** Permanently removed Three.js starfields/particles (`HeroCanvas.tsx`), excessive glassmorphism backdrop blurs, neon gradient glows, and tight font tracking.
- **Landing Page Header (`app/page.tsx`):** Built clean product header with exactly two primary action buttons: `Explore Events` and `Explore Calendar`.
- **Navigation Bar (`app/components/Navbar.tsx`):** Redesigned desktop and mobile header navigation displaying `Logo | Home | Calendar | Events | Communities` and dynamically including `Dashboard` when an admin/manager user is logged in.
- **Google Calendar Route & View (`app/calendar/page.tsx` & `app/components/GoogleCalendarView.tsx`):** Built full Google Calendar interface supporting Month, Week, and Day views with hourly time-block grid cards positioned by actual duration, community filters, and click-to-open popover modals.

---

## [0.17.0] - 2026-07-27

### 🕒 12-Hour Time Format Converter
- **12-Hour AM/PM Time Conversion (`app/admin/events/page.tsx`):** Added `formatTo12HourTime` helper function converting 24-hour time input strings (`10:00`, `16:30`) into standard 12-hour AM/PM time slot strings (e.g. `10:00 AM - 04:30 PM`).

---

## [0.16.0] - 2026-07-27

### ⏱️ Start to End Time Slot Visibility Across All Cards
- **Time Slot Badges (`app/admin/events/page.tsx` & `app/components/MasterCalendar.tsx`):** Rendered cyan Clock icon + time slot badges (`10:00 AM - 04:00 PM`) on all event cards across the Event Booking Console, Master Schedule timeline, and community filters.
- **Hook Data Mapping (`lib/hooks/useRealtimeEvents.ts`):** Mapped `time_slot` property from Supabase database rows into React state.

---

## [0.15.0] - 2026-07-27

### 🛠️ Full Edit Access for Super Admins on Reserved Slots
- **Super Admin Slot Editing (`app/admin/events/page.tsx`):** Added edit modal pre-filling (`openEditModal(evt)`) and update logic. Super Admins (`dev`, `admin`) can view and edit full details, title, category, dates, times, community, publishing status, and full description for any reserved draft slot across all communities.

---

## [0.14.0] - 2026-07-27

### 🔒 Cross-Community Visibility Scoping & Edit Protection
- **Cross-Community Closed Slots (`app/admin/events/page.tsx`):** For draft (`closed`) slots belonging to other communities, managers and editors can ONLY see the Date and Time slot reservation badge (`Slot Booked`). All event details, titles, descriptions, and action buttons are completely hidden to prevent leaking unannounced event plans.
- **Cross-Community Live Events (`app/admin/events/page.tsx`):** For published (`live`) events belonging to other communities, managers and editors can see basic event information (Title, Category, Date/Time, Community Name), but Edit and Delete action controls are strictly disabled/removed.

---

## [0.13.0] - 2026-07-27

### 📅 Enhanced Event Creation Form & Auto Community Binding
- **Start/End Dates & Times (`app/admin/events/page.tsx`):** Added explicit Start Date, End Date, Start Time, and End Time inputs. Formats start/end times into clean time slots (`10:00 AM - 04:00 PM`).
- **Dynamic Category with Custom 'Other' Option:** Added category dropdown (`Workshop`, `Hackathon`, `Seminar`, `Tech Fest`, `Webinar`, `Competition`, `Other`). Selecting `Other` renders a custom category input box.
- **Role-Based Community Auto-Binding:** Managers and Editors no longer see the community selection dropdown; their community is automatically retrieved and bound from their profile (`community_id`). Organizing community dropdown selection is reserved exclusively for Super Admins (`dev`, `admin`).
- **Full Detailed Description Field:** Re-labeled "System Prompt Context for AI Assistant" to **"Full Detailed Description of Event"**.

---

## [0.12.0] - 2026-07-27

### 🎨 Clean Admin Overview Metrics
- **Removed Event Assistant Card (`app/admin/page.tsx`):** Streamlined Admin Overview layout grid to 3 cards (Live Events, Draft Slots, Community Info), removing the redundant Event Assistant metric card.

---

## [0.11.0] - 2026-07-27

### 👤 Community-Scoped Overview, Personal Profile & My Community Edit Mode
- **Community-Scoped Admin Overview (`app/admin/page.tsx`):** Filtered metrics and event lists for `manager` and `editor` users to their assigned community entity.
- **Personal Profile Editing (`/admin/profile` & `/api/profile`):** Built personal profile page allowing all authenticated users (`dev`, `admin`, `manager`, `editor`) to edit their own Full Name, Profile Picture (Avatar URL), and Auth Password.
- **My Community Editing & Editor Visibility (`/admin/my-community` & `/api/admin/my-community`):**
  - **Managers (`manager`):** Full editing capabilities for their assigned community's Name, Description, Initials, Accent Color, and Logo.
  - **Editors (`editor`):** Read-only visibility mode to view their assigned community's profile details and events.

---

## [0.10.0] - 2026-07-27

### 🔐 Granular RBAC Permissions & Community-Scoped Admin Views
- **Community Management Access (`/admin/communities` & `middleware.ts`):** Restricted community page creation/editing to `dev` and `admin` roles ONLY. Automatically hides menu items and blocks access for `manager` and `editor` roles.
- **User Roles Scoping (`/admin/users`):**
  - **Super Admin (`dev`, `admin`):** Full access to all profiles and community assignments.
  - **Manager (`manager`):** Access scoped ONLY to adding and editing leads/editors within their assigned `community_id`. Locked community selector in creation modal.
  - **Editor (`editor`):** Completely blocked from accessing User Roles (`/admin/users`).
- **Dynamic Navigation Layout (`app/admin/layout.tsx`):** Navigation links dynamically adapt based on active user profile role fetched from Supabase.

---

## [0.9.0] - 2026-07-27

### ⚡ User Management Form Resiliency & Optimistic UI Update
- **Resilient Form Submission (`app/admin/users/page.tsx`):** Fixed user creation/modification modal submission flow so it never gets stuck in the saving state. The modal closes automatically (`setModalOpen(false)`), resets all form inputs, and updates the profile list state instantly.
- **API Fallback Handling (`/api/admin/users/route.ts`):** Made user creation API ultra-resilient with graceful fallbacks if Supabase Auth credentials or RLS policies are restricted in local dev setups.

---

## [0.8.0] - 2026-07-27

### 👤 Comprehensive Admin & Auth User Account Management
- **Admin User Management API (`/api/admin/users/route.ts`):** Implemented complete user creation (`POST`), update (`PUT`), and deletion (`DELETE`) pipeline interacting directly with Supabase Auth (`auth.users`) via Service Role Admin API and updating `profiles` table records simultaneously.
- **Rich Admin Profile Fields (`types/database.types.ts` & `app/admin/users/page.tsx`):** Added `position` (Designation/Role) and `avatar_url` (Profile picture) fields to `Profile` schema.
- **Full User Modification Modal:** Devs and Admins can create and edit all user details — Name, Position, Email, Password (sets/resets Auth password), Avatar Picture, Role (`dev`, `admin`, `manager`, `editor`), and Associated Community.

---

## [0.7.0] - 2026-07-27

### 💬 Chat Auto-Scroll Fix & Complete Static Data Cleanup
- **Chat Drawer Auto-Scrolling (`EventAiDrawer.tsx`):** Implemented smooth auto-scrolling to bottom (`scrollIntoView({ behavior: 'smooth' })`) on new message sent/received. Added `data-lenis-prevent` to the chat container so user scrolling inside the chat drawer never causes background Lenis page scrolling.
- **Static Data Removal (`app/lib/data.ts`):** Emptied static mock data arrays. All pages ([app/community/page.tsx](file:///c:/Users/shibi/Desktop/Work/event-m/event-manager/app/community/page.tsx), [app/community/[id]/page.tsx](file:///c:/Users/shibi/Desktop/Work/event-m/event-manager/app/community/[id]/page.tsx), [app/event/page.tsx](file:///c:/Users/shibi/Desktop/Work/event-m/event-manager/app/event/page.tsx), [app/admin/page.tsx](file:///c:/Users/shibi/Desktop/Work/event-m/event-manager/app/admin/page.tsx)) now query dynamic Supabase database tables directly.

---

## [0.6.0] - 2026-07-27

### 🤝 Friendly Peer Persona & Direct 6-Digit OTP Auth
- **Campus Buddy Persona (`/api/chat` & `EventAiDrawer.tsx`):** Configured assistant prompt persona to act like a warm, friendly, all-knowing campus friend. Replies in natural, casual, super-helpful language without corporate or robotic phrasing.
- **Direct 6-Digit OTP Email Auth (`app/login/page.tsx`):** Updated login flow to explicitly send and verify 6-digit OTP verification codes (`verifyOtp` with `type: 'email'`). Added clear 6-digit input styling and verification steps.

---

## [0.5.0] - 2026-07-27

### 🎨 UI Polish, Public Navigation Cleanup & Robust Fetch Fallbacks
- **Public Admin Link Removal:** Removed all visible admin dashboard and login buttons from public headers, hero sections, and mobile bottom navigation bars. Public users enjoy a clean event discovery experience.
- **Robust Database Fetch Fallbacks:** Updated `useRealtimeEvents.ts`, `useCommunities.ts`, and `useProfiles.ts` hooks with resilient fallback defaults so the application never gets stuck in loading states or fails silently.
- **Human-Centric Design & Icon Cleanup:** Removed cheesy AI icons (`Bot`, `Sparkles`) and buzzwords; replaced with clean `MessageSquare`, `Calendar`, and `Layers` icons and professional Event Assistant terminology.
- **Auth Page Resiliency (`/login`):** Enhanced login page to handle local dev Supabase auth states cleanly with clear input feedback.

---

## [0.4.0] - 2026-07-27

### 📱 Mobile App UI & Bottom Navigation Bar
- **App UI Bottom Navigation (`Navbar.tsx`):** Added native app-style bottom navigation bar (`fixed bottom-0 left-0 right-0 z-50 md:hidden`) with glassmorphism surface (`bg-[#05070E]/95 backdrop-blur-2xl`), active path indicators, and touch feedback.
- **Responsive Layout Padding:** Added bottom safe area padding (`pb-20 md:pb-0`) across all main page containers and admin layouts to prevent mobile bottom navigation overlaps.

---

## [0.3.0] - 2026-07-27

### ⚡ Realtime Data Sync, Next.js Middleware & Auth Upgrade
- **Supabase Realtime Sync Engine:** Created `useRealtimeEvents` custom hook subscribing to Postgres `postgres_changes` on `events` table; instantly updates public discovery views and admin master calendar across all connected clients without page reloads.
- **Next.js SSR Middleware Proxy (`proxy.ts` & `lib/supabase/middleware.ts`):** Enforces cookie session updates and protects `/admin/*` routes. Redirects unauthenticated users to `/login?redirectTo=...` and restricts `/admin/users` to `dev` and `admin` roles only.
- **2-Step Passwordless OTP Auth:** Enhanced `/login` to support both direct magic links and 6-digit OTP code verification inside the UI. Added `onAuthStateChange` listener to `Navbar.tsx` displaying user role badges and logout controls.

---

## [0.2.0] - 2026-07-27

### 🚀 Full Platform Implementation & Production Build
- **Supabase Integration & RBAC Helpers:** Added `@supabase/supabase-js`, `@supabase/ssr`, TypeScript schemas (`types/database.types.ts`), client & server instantiators (`lib/supabase/client.ts`, `lib/supabase/server.ts`), and permission matrix checks (`lib/auth/rbac.ts`).
- **Multi-Provider AI Fallback Route:** Built `/api/chat` supporting automated failover routing: `Google Gemini 2.5 Flash` $\rightarrow$ `Grok API (xAI)` $\rightarrow$ `OpenRouter API (Meta Llama 3.1)`.
- **Slot Booking & Publishing Engine:** Implemented Admin Event Booking Console (`/admin/events`) supporting `closed` (draft slot reservation) vs `live` (public publication) states with RBAC deletion rules.
- **Admin Dashboard Console:** Created Super Admin User Accounts & Role Management (`/admin/users`), Community Management (`/admin/communities`), and Email OTP Login (`/login`).
- **WebGL / Three.js Visual Engine:** Developed GPU particle starfield hero canvas (`app/components/HeroCanvas.tsx`) with mouse drift physics.
- **Framer Motion Drawer:** Created dynamic event assistant slide-over drawer (`app/components/EventAiDrawer.tsx`).
- **Master Calendar & Public Discovery:** Created 3-way view switcher (`MasterCalendar.tsx`) offering Date Order List, Master Calendar Grid, and Community Filtering.
- **SEO Optimization:** Embedded structured JSON-LD Event metadata schemas across dynamic event detail pages (`/events/[id]`).

---

## [0.1.0] - 2026-07-27

### 🚀 Architecture & Specification Blueprint
- **Multi-Community RBAC Specification:** Defined 4-tier matrix (`dev`, `admin`, `manager`, `editor`, `public`) across all community and event operations.
- **Database & RLS Schema Blueprint:** Designed Supabase SQL tables (`profiles`, `communities`, `events`, `ai_configs`) with automated RLS policies.
- **Developer Documentation & Agent Rules:** Formatted workspace specifications into `project_memory.md`, `design.md`, `changelogs.md`, `.agents/AGENTS.md`, and rewritten `README.md`.
