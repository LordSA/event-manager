# Changelogs & Version History

All notable changes and structural milestones for **Whats @CEV / Event Manager** are documented in this file.

## [0.55.0] - 2026-08-03

### 🧱 Standalone Admin Sidebar Component & Calendar Size Optimization
- **Standalone Admin Sidebar ([app/components/AdminSidebar.tsx](./app/components/AdminSidebar.tsx)):** Extracted admin sidebar navigation into a dedicated component with viewport sticky positioning (`sticky top-0 h-screen`), isolating its width and height from any page content length or scroll behavior.
- **Admin Layout Refactoring ([app/admin/layout.tsx](./app/admin/layout.tsx)):** Refactored layout shell to invoke `<AdminSidebar />` with `min-w-0` content container.
- **Compact Calendar Sizing ([app/components/GoogleCalendarView.tsx](./app/components/GoogleCalendarView.tsx)):** Reduced calendar container min-heights (`min-h-[500px]`), cell heights (`min-h-[90px]`), and hour slot heights (`min-h-[52px]`) for a sleeker, well-proportioned view.

---

## [0.54.0] - 2026-08-03

### 📅 Admin Google Calendar Event Slot View Upgrade
- **Admin Slot Booking Page ([app/admin/events/page.tsx](./app/admin/events/page.tsx)):** Transformed admin event slot management page into a Google Calendar slot view.
- **Interactive Google Calendar Component ([app/components/GoogleCalendarView.tsx](./app/components/GoogleCalendarView.tsx)):** Upgraded `GoogleCalendarView` with Admin Slot Booking capabilities:
  - Supports **Month**, **Week**, **Day**, and **Grid/List** view modes.
  - Interactive Date Cell Selection: Clicking empty date/time cells in Month, Week, or Day views pre-selects start/end dates and times in the slot booking modal.
  - Visual Status Badging: Amber `Closed (Draft Slot)` badges and Emerald `Live (Published)` badges.
  - Quick Slot Action Popovers: 1-click status toggles, inline slot editing, slot deletion (with RBAC enforcement), and public page links.
- **Documentation & Zero Comments Enforcement:** Updated all project documentation and maintained 100% clean production code with zero temporary comments.

---

## [0.53.0] - 2026-08-01

### 🎨 Main Event Directory Theme & Card Redirection Upgrade
- **Main Event Directory ([app/events/page.tsx](./app/events/page.tsx)):** Upgraded page layout to match the active dark brutalist theme (`#08090d`, `#0f121d`, `#161a29`, `#1e2436`, `#6366f1`).
- **Master Calendar Design & Redirection ([app/components/MasterCalendar.tsx](./app/components/MasterCalendar.tsx)):** Replaced generic neutral cards with full brutalist card components (`brutalist-card`, `hover:border-[#6366f1]`), added full-card link redirection to `/events/${evt.slug || evt.id}`, and enabled clickable community name subpage links (`/community/${evt.community_slug || evt.community_id}`).

---

## [0.52.0] - 2026-08-01

### ↩️ History Stack Navigation Proxy & Left-Aligned Back Button Fix
- **Unrestricted `router.back()` History Proxy ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx), [app/community/[id]/page.tsx](./app/community/[id]/page.tsx)):** Removed strict `document.referrer` checks so client-side SPA transitions seamlessly execute `router.back()` to return users directly to their exact originating page (Home, Community Showcase, Events Directory, or Calendar).
- **Left-Aligned Back Button ([app/community/[id]/page.tsx](./app/community/[id]/page.tsx)):** Moved the `"Back"` button to the top left of the layout container (`max-w-6xl mx-auto`), matching the exact position, styling, and brutalist card design system of event detail pages.

---

## [0.51.0] - 2026-08-01

### ⬅️ Simplified "Back" Navigation Button & Referrer Redirection
- **Standardized "Back" Label ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx), [app/community/[id]/page.tsx](./app/community/[id]/page.tsx)):** Simplified the navigation button text on all event and community slug pages to purely `"Back"`.
- **Referrer Redirection (`router.back()`):** Configured click handlers on both detail pages to execute `router.back()` if internal history exists, returning users directly to whatever page they originated from.

---

## [0.50.0] - 2026-08-01

### 🖼️ Community Page Subpage Link Fix & Logo Header Integration
- **Community Directory Page ([app/community/page.tsx](./app/community/page.tsx)):** Updated community cards to redirect directly to their community showcase subpages (`/community/${comm.slug || comm.id}`) instead of redirecting to the filtered event directory.
- **Showcase Header Logo ([app/community/[id]/page.tsx](./app/community/[id]/page.tsx)):** Rendered official community logo images (`community.logo_url`) in the community subpage header with fallback to gradient initial badges.

---

## [0.49.0] - 2026-08-01

### 🔗 Full Home Page Card Redirection & Community Subpage Badges
- **Full Event Card Navigation ([app/page.tsx](./app/page.tsx)):** Wrapped the entire featured event cards on the home page in full `<Link>` components, matching the interaction pattern of community showcase pages.
- **Clickable Community Badges:** Clicking the community name on any event card on the home page now redirects straight to `/community/${community_slug || community_id}`.

---

## [0.48.0] - 2026-08-01

### 🔗 Community Card Redirection & Smart Back Button Navigation
- **Home Page Community Redirection ([app/page.tsx](./app/page.tsx)):** Wrapped home page community cards with `<Link href={`/community/${c.slug || c.id}`}>` to enable direct navigation to community subpages.
- **Smart Referrer Back Button ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Implemented referrer-aware back button navigation. Dynamically updates label (`Back to Home`, `Back to Community`, `Back to All Events`) and executes `router.back()` to return users directly to the originating page.
- **Isolated Community Slug Lookup ([app/community/[id]/page.tsx](./app/community/[id]/page.tsx)):** Separated UUID vs non-UUID slug queries to prevent Postgres type casting crashes when querying community subpages by slug.

---

## [0.47.0] - 2026-07-31

### 💬 AI Assistant Markdown Bold Renderer
- **Bold Element Renderer ([app/components/EventAiDrawer.tsx](./app/components/EventAiDrawer.tsx)):** Added `renderFormattedMessage` helper to parse markdown bold syntax (`**text**`) and convert it into styled `<strong>` elements instead of rendering literal asterisks in chat bubbles.

---

## [0.46.0] - 2026-07-31

### 🛠️ Description Parser Algorithm Upgrade
- **Robust Text Splitting ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Fixed regex parsing bug where description text without trailing period punctuation or with markdown formatting failed to return. Implemented lookbehind splitting (`/(?<=[.!?])\s+|\n+/`), markdown tag cleaning (`**`, `#`), and guaranteed 3-sentence sentence/paragraph extraction for all input text types.

---

## [0.45.0] - 2026-07-31

### 📝 3-Line Description Overview & Assistant Bar Refactor
- **Description Refactor ([app/events/[id]/page.tsx](./app/events/[id]/page.tsx)):** Refactored the event description overview to display exactly 3 concise sentences with `line-clamp-3`, directly followed by the interactive "Need full guidelines, timeline, or FAQs? Ask Assistant" drawer prompt bar.

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
