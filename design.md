# Design System & Motion Specification

## 1. Overview & Aesthetics (Nixtio Editorial UI)
The design language of **CEV EVENTS** is governed by the **Nixtio-Inspired Editorial Digital Agency UI** (.agents/skills/ui-ux-design-system/SKILL.md). It combines **Swiss editorial minimalism**, **oversized display typography** (`Quera` display font with 0.85–1.05 tight line-height), **numbered section architecture** (`001`, `002`, `003`), **restrained monochrome visual canvas** (`#08090d`, `#0f121d`, `#161a29`), official logo asset ([public/cev_logo.svg](./public/cev_logo.svg)), and a global **Loading Screen** (`app/components/LoadingScreen.tsx`).

---

## 2. Color System & Palette (Nixtio Dual Theme)

### Flux Admin Dashboard Design Tokens
* **Workspace Light Canvas:** `#edf0f4` (Light Grey Soft Slate)
* **Sidebar Dark Charcoal:** `#18191c` (Deep Charcoal Black)
* **Sidebar Border:** `#24262b` (Dark Slate Border)
* **White Card Surface:** `#ffffff` (`rounded-[28px] p-6 shadow-sm border border-neutral-200/60`)
* **Dark Feature Card Surface:** `#18191c` (`rounded-[28px] p-6 sm:p-8 shadow-xl text-white`)
* **Active Sidebar Link:** Floating White Pill (`bg-white text-[#141518] font-extrabold rounded-full px-5 py-3 shadow-lg`) with dark indicator dot (`w-2 h-2 rounded-full bg-[#141518]`).
* **Header Profile & Search Bar:** Pill-shaped white input & user card (`bg-white rounded-full px-4 py-2 text-xs font-bold shadow-sm`).

### Community Signature Color Palette (Preset Swatches)
* **IEEE Indigo:** `#6366f1` (Default)
* **College Ocean Blue:** `#0ea5e9` (Institutional Events, Exams & Schedules)
* **IEEE Blue:** `#3b82f6`
* **IEDC Emerald:** `#10b981`
* **TinkerHub Pink:** `#ec4899`
* **FOSS Amber:** `#f59e0b`
* **MuLearn Purple:** `#8b5cf6`
* **Red Accent:** `#ef4444`
* **Teal Accent:** `#14b8a6`
* **Cyan Accent:** `#06b6d4`
* **Orange Accent:** `#f97316`

### W3C Relative Luminance Contrast Standard
* **Perceived Relative Luminance Formula:** `luminance = (0.299 * R + 0.587 * G + 0.114 * B) / 255`
* **Dark Community Colors (`luminance < 0.6`):** Community name text automatically renders in crisp bright white (`#f8fafc`) for 100% legibility against dark backgrounds.
* **Light Community Colors (`luminance >= 0.6`):** Community name text renders using the vibrant community hex color.

---

## 3. Typography Hierarchy & Custom Fonts

### Font Optimization (`next/font/local`)
* **Display / Hero Headlines (`font-display`):** `Quera` (`./fonts/quera.otf`, `--font-quera`)
* **Section Headings & Titles (`font-heading`):** `Gued` (`./fonts/gued.otf`, `--font-gued`)
* **Body Copy & UI Labels (`font-sans`):** `Rondured` (`./fonts/roundered.ttf`, `--font-roundered`)
* **System Fallbacks:** `system-ui, -apple-system, sans-serif` (Inter is strictly forbidden).

---

## 4. Component Rules & Layout Specifications

### Nixtio Floating Navigation Bar (3 Transition Modes)
* **Mode 1 (Initial Top State over Dark Hero, `scrollY < 40`):** Transparent container (`bg-transparent border-transparent shadow-none`), standalone white logo (`/cev_logo.svg`), spaced-out text links (`text-white/85 hover:text-white`), and solid white CTA button (`bg-white text-black font-extrabold hover:bg-neutral-200`).
* **Mode 2 (Scrolled Over Dark Hero, `scrollY >= 40`):** Compact floating white glass pill (`bg-white/70 backdrop-blur-2xl border border-white/70 shadow-[0_8px_35px_rgba(0,0,0,0.10)] rounded-full px-2 py-1.5`), black active tab indicator (`bg-black text-white rounded-full`), white CTA button.
* **Mode 3 (Scrolled Over Light Page Content):** Standalone black logo (`/cev_logo_b.svg`), floating white glass pill center navigation, black CTA button (`bg-black text-white font-extrabold hover:bg-neutral-800`).
* **Mobile Scroll Optimization (`window.innerWidth < 768`):** Header size and layout scroll transitions are bypassed on mobile viewports (`transition-none md:transition-all`) to freeze element dimensions and maintain 60fps smooth touch scrolling.

### Full-Screen Hero Card Scroll Shrink Animation ([app/page.tsx](./app/page.tsx))
* **Hero Container Shrink (`scrollY > 40`):** On desktop viewports (`>= 768px`), hero width shrinks from `w-[99%]` to `w-[95%]`, height shrinks from `min-h-[99vh]` to `min-h-[75vh]`, and corner radius scales from `rounded-[1.3rem]` to `rounded-[1rem]`. Bypassed on mobile devices for smooth touch scrolling.
* **Timing & Cubic-Bezier Easing:** `transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]` for fluid high-end motion.
* **Title Dynamic Scaling:** Oversized display headline (`CEV EVENTS`) scales dynamically from `text-[15rem]` to `text-[10rem]` on scroll.

### Swiss Editorial Cards & Rounded Corners
* **Community Cards (`rounded-[24px]`):** White elevated card (`bg-white rounded-[24px] h-[165px]`) with logo scale on hover (`scale-105`) and `hover:scale-[1.015] hover:shadow-lg`.
* **Schedule Cards (`rounded-[24px]`):** Poster image card (`min-h-[680px] bg-white rounded-[24px]`) with dark image overlay, category/community badges, and 300ms rotating arrow button (`group-hover:rotate-[-45deg]`).
* **Community Detail Hero (`rounded-[28px]`):** White hero section (`min-h-[560px] bg-white rounded-[28px]`) with centered logo container (`w-32 h-32 rounded-[28px]`) and radial blur element.

### Global Page Entrance Motion ([app/template.tsx](./app/template.tsx))
* **Framer Motion Transition:** `initial={{ opacity: 0, y: 24, filter: 'blur(5px)' }}`, `animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}`, `transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}`.

### Brutalist Action Buttons
* Primary CTA: `.brutalist-btn-primary` (`bg-[#6366f1] text-white border border-[#4f46e5] shadow-[3px_3px_0px_0px_#312e81]`)
* Secondary CTA: `.brutalist-btn-secondary` (`bg-[#161a29] text-white border border-[#1e2436]`)

### Connected Multi-Day Calendar Banner Layout
* Day cell containers use `px-0` padding to eliminate horizontal gaps across grid columns.
* **Start Day:** `ml-1 mr-0 rounded-l-md rounded-r-none border-r-0`
* **Middle Days:** `mx-0 rounded-none border-x-0`
* **End Day:** `mr-1 ml-0 rounded-r-md rounded-l-none border-l-0`

### Gemini Mobile AI Drawer & React Portal Specification ([app/components/EventAiDrawer.tsx](./app/components/EventAiDrawer.tsx))
* **React Portal Mounting (`document.body`):** Renders via `createPortal(..., document.body)` with `z-[999999]`. Detaches from parent DOM hierarchy and CSS transform contexts, remaining 100% fixed above all page elements, navbars, and scrolling containers.
* **Gemini Mobile UI & Animations:** On mobile viewports (`< sm`), opens as a bottom sheet (`h-[92dvh] rounded-t-3xl border-t border-white/10`) with top grab indicator bar. On desktop viewports (`>= sm`), slides in as a right drawer (`w-[480px] h-full border-l border-white/10`).
* **Gemini Input Bar & Branding:** Features Gemini Sparkles branding, floating rounded input pill bar (`rounded-2xl border border-white/15 bg-[#141724] shadow-xl`), and full Markdown formatting parser.

### NeoLeaf-Inspired Preloader UI & Liquid Fill Reveal ([app/components/LoadingScreen.tsx](./app/components/LoadingScreen.tsx))
* **Visual Atmosphere:** Centered dark matte card (`bg-[#121316] border border-neutral-800/80 rounded-[28px] sm:rounded-[36px] max-w-5xl shadow-[0_30px_90px_rgba(0,0,0,0.85)]`) surrounded by ambient violet/indigo lighting.
* **Dual-Layer Liquid Fill:** Centered display title `CEV EVENTS` rendered with dual layers: base dark text (`#26282e`) and foreground white text clipped dynamically via `clipPath: inset(${100 - progress}% 0 0 0)` as progress climbs from 0% to 100%.
* **Progress Tracking:** Lowercase monospace counter (`loading... {progress}%`) positioned beneath the right edge of the title text.
* **Exit Zoom Reveal:** Upon reaching 100%, pauses briefly (240ms) before dramatically scaling up the card and typography (`scale-[2.1] opacity-0 blur-sm duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`), seamlessly revealing the matching `CEV EVENTS` landing hero.

---

## 5. Modal Window Sizing, Production Code & Clean Standards

### Clean Production Code Rules ([.agents/AGENTS.md](./.agents/AGENTS.md))
* **Zero Temporary Comments Across All Pages:** All source code files ([app/page.tsx](./app/page.tsx), [app/admin/events/page.tsx](./app/admin/events/page.tsx), [app/events/[id]/page.tsx](./app/events/[id]/page.tsx), [app/components/EventAiDrawer.tsx](./app/components/EventAiDrawer.tsx), [app/components/GoogleCalendarView.tsx](./app/components/GoogleCalendarView.tsx), [app/components/MasterCalendar.tsx](./app/components/MasterCalendar.tsx), [lib/summary.ts](./lib/summary.ts), [lib/upload.ts](./lib/upload.ts)) maintain clean, production-ready code with zero inline temporary notes or comment indicators.
* **HTML5 Time Parser (`parseTimeTo24Hr`):** Converts 12-hour database strings into 24-hour `HH:mm` format for time inputs.
* **Spacious 2-Column Layout (`max-w-3xl`):** Extended modal container width to `768px` (`max-w-3xl`) with `data-lenis-prevent` for mouse wheel scrolling inside Lenis smooth scroll overlays.
* **Z-Index Layering:** Mobile Floating Navbar (`z-40`), Main Navbar (`z-[100]`), Modal Windows (`z-50` with backdrop `z-50` and modal container `max-h-[85vh] overflow-y-auto`), AI Assistant Drawer (`z-[200]`).
* **Admin & Public Google Calendar Slot View:** Fully interactive month/week/day/grid slot view with amber draft indicators (`#f59e0b`), emerald live badges (`#10b981`), direct cell date selection, popovers with quick status toggles, connected multi-day banners, community signature colors, W3C contrast readability, and RBAC matrix enforcement. Month view incorporates deterministic **Greedy Lane Packing** (`gridRow: lane`), resolution-scaled event switches (`h-4 sm:h-5 md:h-5.5`, `text-[8.5px] sm:text-[10px] md:text-[11px]`, `px-1 sm:px-1.5 md:px-2`, `leading-none`), sticky day-of-week headers (`sticky top-0 z-20`), dynamic week row expansion (`min-h-[95px] sm:min-h-[110px] md:min-h-[120px]` with computed `minHeight: Math.max(95, 30 + laneCount * 22)` and `shrink-0 overflow-hidden` boundary isolation), day number clearance (`pt-7 sm:pt-8` clearing `w-5 h-5 sm:w-6 sm:h-6` day bubbles), and slim vertical scrolling (`overflow-y-auto`) to guarantee zero event overlap or clipping across mobile, tablet, and PC screens.

---

## 6. Unified Community Workspace & View-First Architecture ([app/admin/my-community/page.tsx](./app/admin/my-community/page.tsx))

### View-First Community Entity Presentation
* **Read-Only Default State:** Community details are presented as immutable display cards by default to prevent unintentional edits during day-to-day operations.
* **Dual Side-by-Side Card Architecture:** 
  - **Left Box (Card 1):** Standalone signature dark box (`bg-[#141518] text-white rounded-[28px] relative overflow-hidden shadow-sm p-6 sm:p-8 flex items-center justify-center`) featuring concentric circular watermark lines (`border border-white/10`) with the community logo centered vertically and horizontally.
  - **Right Box (Card 2):** Standalone white card (`bg-white border border-neutral-200/80 rounded-[28px] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4`) displaying the Community Name title on top alongside "Public View" and "Edit Community Details" action pills, with the description and badges (`INITIALS`, `SLUG`, `BRAND ACCENT`) placed cleanly underneath.

### Dedicated Edit Modals & 3-Part Architecture
* **Modal Overlay & Body Scroll Lock:** React Portal mounted to `document.body` with `z-[99999]`, backdrop blur (`bg-black/60 backdrop-blur-sm`), `data-lenis-prevent`, and automatic background body scroll lock (`document.body.style.overflow = 'hidden'`).
* **3-Part Non-Bleeding Scroll Architecture:**
  - **Fixed Header (`shrink-0`):** Pinned at the top of the modal card (`border-b border-neutral-100 px-6 py-4 bg-white`), ensuring inputs never scroll above or leak past the title and close button.
  - **Scrollable Body (`flex-1 overflow-y-auto`):** Features custom minimal 6px thin scrollbars (`[scrollbar-width:thin] [scrollbar-color:#d4d4d8_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full`).
  - **Fixed Docked Footer (`shrink-0`):** Pinned at the bottom of the modal card (`border-t border-neutral-100 px-6 py-4 bg-white`), ensuring action buttons ("Cancel" and "Save Changes" / "Create Event") remain permanently accessible without full scrolling.
* **Form Controls:** Clean input fields for Community Name, Initials, Brand Accent Color (HTML5 color picker + hex input), Description textarea, and direct WebP logo file upload via `uploadImageFile()` alongside direct image URL fallbacks.
* **Slug Protection:** URL slug is rendered read-only for `manager` roles, editable only by `dev` and `admin`.

### Floating Toaster Notification Overlay
* **Positioning:** Fixed at the top-right corner on desktop (`sm:top-6 sm:right-6 sm:left-auto sm:max-w-md`) and top center on mobile (`top-4 inset-x-4`) with ultra-high z-index (`z-[100000]`).
* **Visual Styling:** Restrained dark theme pill (`bg-[#141518]/95 backdrop-blur-md text-white border border-neutral-700/80 rounded-2xl px-5 py-3.5 shadow-2xl`), green emerald check icon for success, rose alert icon for errors, and manual close button.
* **Auto-Dismissal:** Automatically fades and unmounts after 4 seconds without causing in-page layout shifts.

### Integrated Community Events Suite (`002 / COMMUNITY EVENTS`)
* **Embedded Workspace:** Embedded directly below community branding on the same page, eliminating the need for a separate `/admin/my-community/events` route.
* **Metric Counter Badges:** Pill counters for Total Events, Live (Published), and Draft (Closed).
* **Filter & Search Bar:** Real-time search query input with status filter pills (`All`, `Live`, `Draft`), format filter pills (`All`, `Offline`, `Online`), and layout view switcher (`Grid` vs `List`).
* **Interactive Event Management:** Real-time status toggling (`live` ↔ `closed`), event editing modal, public event slug link, and permanent deletion confirmation modal.

