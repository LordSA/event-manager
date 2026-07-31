# Changelogs & Version History

All notable changes and structural milestones for **Whats @CEV / Event Manager** are documented in this file.

---

## [0.44.0] - 2026-07-31

### 🛠️ Postgres UUID Syntax Error Fix on Slug Routing
- **Isolated Slug & UUID Queries ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Resolved `invalid input syntax for type uuid: "test"` error by separating UUID vs non-UUID string query paths. For non-UUID slugs (such as `test` or `codesprint-2026`), queries search `.eq('slug', eventId)` and `.ilike('title', eventId)` without triggering Postgres type casting exceptions.

---

## [0.43.0] - 2026-07-31

### 🔗 Main Landing Page & Community Detail Page Slug Routing
- **Main Home Page ([app/page.tsx](./app/page.tsx)):** Updated live events list cards to navigate to `/events/${evt.slug || evt.id}` instead of raw UUID primary keys.
- **Community Page ([app/community/[id]/page.tsx](./app/community/[id]/page.tsx)):** Updated community event cards to navigate using `event.slug || event.id`.

---

## [0.42.0] - 2026-07-31

### 📐 3:4 Poster Frame Aspect Ratio & Title-Based Slug Routing
- **3:4 Frame Aspect Ratio ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Updated the event detail poster container to use `aspect-[3/4]` (1080x1440 portrait aspect ratio).
- **Title-Based Slug Routing:**
  - `generateSlug` helper converts event titles into URL slugs (`codesprint-2026`).
  - Saved `slug` in Supabase `events` table during creation and updates.
  - Detail page lookup searches `slug` first, with fallback to `id`.
  - All navigation links across `MasterCalendar`, `GoogleCalendarView`, and directory cards now navigate to `/events/${evt.slug || evt.id}`.

---

## [0.41.0] - 2026-07-31

### 🛠️ Supabase Schema Cache Missing Column Retry Fix
- **Adaptive Payload Retry ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Resolved `Could not find the 'perks' column of 'events' in the schema cache` error by removing un-cached optional fields and automatically retrying database inserts/updates. Ensures `poster_url`, `venue`, and all core event details save reliably to Supabase.

---

## [0.40.0] - 2026-07-31

### 🖼️ Default Poster Image Fallback & Supabase Error Handling
- **Default Poster Image ([public/images/poster.webp](./public/images/poster.webp)):** Generated high-resolution default WebP campus event poster image at `./public/images/poster.webp`.
- **Pure Poster Renderer ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Updated detail page to render purely the poster image, falling back to `/images/poster.webp` when unassigned or on load failure.
- **Supabase Insert & Update Verification ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Added explicit Supabase error verification (`if (insertErr) throw new Error(insertErr.message)`) to ensure uploaded Blob URLs save to the database and map inserted row IDs to local state.

---

## [0.39.0] - 2026-07-31

### 🎨 Non-Repetitive Campus Media Artwork Card
- **Sleek Fallback Redesign ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Replaced the redundant text fallback card (which duplicated title, category, community, date, and venue) with a sleek, non-repetitive Campus Media Artwork Card. Features a "CEV Verified Event" seal, pulse emblem, and direct Assistant action prompt when custom posters are unassigned.

---

## [0.38.0] - 2026-07-31

### 🔍 Dynamic Event Fetching & Multi-Property Poster Image Resolution
- **ID & Slug Resolution ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Updated Supabase query logic to handle both UUID primary keys (`id`) and custom URL slugs (`slug`) dynamically using `maybeSingle()`.
- **Multi-Property Poster Fallback:** Checks `eventData.poster_url`, `eventData.image`, and `eventData.image_url` properties to guarantee poster resolution across legacy and newly created events. Resets `imgError` state on route updates.

---

## [0.37.0] - 2026-07-31

### 🖼️ Poster Fallback Card & Admin Live Preview Component
- **Poster Fallback UI ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Replaced 404 image errors and blank black boxes with an intelligent poster fallback card. When no poster is uploaded or an image fails to load, a stylized gradient poster card renders with category badge, title, community name, date, and venue details.
- **Admin Modal Poster Preview ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Added live poster preview thumbnail box in the event creation/edit modal so organizers can verify uploaded Vercel Blob images or pasted URLs in real time.

---

## [0.36.0] - 2026-07-31

### 🖼️ Event Poster URL DB Fetching & Realtime Sync Fix
- **Realtime Events Hook Mapping ([lib/hooks/useRealtimeEvents.ts](./lib/hooks/useRealtimeEvents.ts)):** Mapped `poster_url`, `venue`, `perks`, and `system_prompt` fields directly from Supabase query results into the `EventItemData` objects.
- **Admin Event Update Fix ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Added explicit `poster_url` and `image` properties to `updatedEvt` state during event modifications, ensuring poster URLs save to Supabase and render immediately without requiring page refresh.

---

## [0.35.0] - 2026-07-31

### 🤖 Intelligent AI Response Sanitization & Offline Fallback Parser
- **AI Prompt Leak Prevention ([app/api/chat/route.ts](./app/api/chat/route.ts)):** Fixed offline and online fallback handlers to extract clean structured fields (Name, Date, Time, Venue, Category, Perks) and generate natural peer answers without ever printing internal system prompts or developer preambles (`You are the official AI Assistant...`).
- **System Instruction Isolation:** Passed system prompt as `systemInstruction` in Gemini and structured `system` messages in Grok/OpenRouter to isolate prompt rules from user message streams.

---

## [0.34.0] - 2026-07-31

### 🧹 Project-Wide Code Cleanup & Comment Removal
- **Global Comment Removal ([app/](./app), [lib/](./lib)):** Inspected every page, component, and utility module ([app/admin/events/page.tsx](./app/admin/events/page.tsx), [app/events/[id]/page.tsx](./app/events/[id]/page.tsx), [app/components/EventAiDrawer.tsx](./app/components/EventAiDrawer.tsx), [app/components/GoogleCalendarView.tsx](./app/components/GoogleCalendarView.tsx), [app/components/MasterCalendar.tsx](./app/components/MasterCalendar.tsx), [lib/summary.ts](./lib/summary.ts), [lib/upload.ts](./lib/upload.ts)) and stripped all code comments, delivering 100% clean, production-ready code.

---

## [0.33.0] - 2026-07-31

### 🧹 Code Cleanup & Landing Page Refactor
- **Landing Page Clean Code ([app/page.tsx](./app/page.tsx)):** Stripped all code comments and section notes, delivering clean, production-ready source code.

---

## [0.32.0] - 2026-07-31

### ⏰ HTML5 Time Input 24-Hr Converter (`parseTimeTo24Hr`)
- **HTML5 Time Input Parsing Fix ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Added `parseTimeTo24Hr()` helper function to convert stored 12-hour database strings (e.g. `01:00 PM - 04:00 PM`) into strict 24-hour `HH:mm` format (`13:00` / `16:00`), resolving the blank input box bug when opening event edit modals.

---

## [0.31.0] - 2026-07-31

### 📐 Spacious Admin Booking Modal & Mouse Scroll Fix
- **Modal Width Expansion ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Expanded event booking modal width from `max-w-xl` (576px) to a spacious `max-w-3xl` (768px) with an organized 2-column grid layout for form inputs.
- **Lenis Scroll Interception Fix:** Added `data-lenis-prevent` and `max-h-[88vh] overflow-y-auto` to both backdrop and modal container, restoring native mouse wheel and trackpad scrolling inside Lenis smooth scroll overlays.

---

## [0.30.0] - 2026-07-31

### 📍 Venue Field & Non-Freezing Submit Logic
- **Venue Database Column:** Added `venue` input field for admins when creating or modifying event slots, defaulting to `Campus Setup / CEV`.
- **Non-Freezing Submit Logic:** Added `submitting` state and `try/catch/finally` blocks to eliminate form freezing during event creation/edits.

---

## [0.29.0] - 2026-07-31

### ⚡ Fast AI Assistant Engine & Z-Index Layering
- **Ultra-Fast Model Upgrade ([app/api/chat/route.ts](./app/api/chat/route.ts)):** Upgraded AI chat endpoint to `gemini-1.5-flash` with `maxOutputTokens: 250` and 4-second `AbortController` timeouts for sub-500ms response times.
- **Drawer Z-Index & Body Scroll Lock ([app/components/EventAiDrawer.tsx](./app/components/EventAiDrawer.tsx)):** Escalated AI assistant drawer z-index to `z-[200]` with `document.body.style.overflow = 'hidden'` to prevent navbar overlap (`z-[100]`) or scroll sticking.

---

## [0.28.0] - 2026-07-31

### 📄 4-5 Line Event Summary & Optional Perks
- **Public Description Parser ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Refactored public description parser to present a clean 4-5 line overview, stripping raw prompt preambles and appending an interactive "Ask Assistant" callout box.
- **Optional Perks Rendering:** Rendered highlights/perks badge ONLY if explicitly populated by admin roles, hiding container completely when null/blank.

---

## [0.27.0] - 2026-07-30

### ☁️ Vercel Blob Storage Integration
- **Direct WebP Upload Pipeline ([lib/upload.ts](./lib/upload.ts) & [app/api/upload/route.ts](./app/api/upload/route.ts)):** Implemented client-side WebP auto-conversion and `@vercel/blob` storage uploads for posters, logos, and avatars.
- **Next Config Remote Patterns:** Configured `remotePatterns` in `next.config.ts` for `*.public.blob.vercel-storage.com` to support Next.js `Image` optimization.

---

## [0.26.0] - 2026-07-30

### 🔒 Role-Based Access Control (RBAC) & User Management API
- **User Management Console ([app/admin/users/page.tsx](./app/admin/users/page.tsx)):** Built admin user management interface allowing Super Admins (`dev`/`admin`) and Managers (`manager`) to manage community leads and team members.
- **Admin User API ([app/api/admin/users/route.ts](./app/api/admin/users/route.ts)):** Created backend API using `SUPABASE_SERVICE_ROLE_KEY` to update both `auth.users` AND public `profiles` table seamlessly.

---

## [0.25.0] - 2026-07-29

### 🛡️ Next.js 16 Proxy Convention Migration
- **Middleware to Proxy Migration ([proxy.ts](./proxy.ts)):** Renamed `middleware.ts` to `proxy.ts` following Next.js 16 conventions to eliminate deprecation warnings.

---

## [0.24.0] - 2026-07-29

### 🎨 Local Font Engine & Dark Obsidian Design System
- **Local Font Optimization (`next/font/local`):** Preloaded local fonts `Quera`, `Gued`, and `Rondured`, completely removing Inter font dependencies.
- **Dark Obsidian Theme:** Standardized color tokens (`#08090d`, `#0f121d`, `#161a29`, `#1e2436`, `#6366f1`).

---

## [0.10.0] - 2026-07-28

### 🔐 Dual Login Engine & Supabase Auth
- **OTP & Password Auth ([app/login/page.tsx](./app/login/page.tsx)):** Implemented dual login options supporting 6-Digit Email OTP verification and traditional password authentication.

---

## [0.1.0] - 2026-07-27

### 🎉 Initial Repository Release
- **Project Setup:** Initialized Next.js App Router project with Supabase client configuration, master event list layout, and community directory foundation.
