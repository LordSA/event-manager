# Design System & Motion Specification

## 1. Overview & Aesthetics
The design language of **Whats @CEV / Event Manager** is crafted as a high-contrast dark design system combining **restrained glassmorphism** with **light brutalism** (sharp 2px borders, offset block shadows, clear visual hierarchy). All legacy monochrome slate themes and AI-feeling fonts (Inter) have been completely removed.

---

## 2. Color System & Palette

### Base Dark Palette
* **Background Primary:** `#08090d` (Deep Navy Charcoal)
* **Surface Background:** `#0f121d` (Elevated Panel Dark)
* **Elevated Container:** `#161a29` (Card Surface)
* **Border Colors:** `#1e2436` (Subtle 1px/2px Border) / `#2a334c` (Strong Border)
* **Primary Accent:** `#6366f1` (Electric Indigo) with `#4f46e5` border & `#312e81` shadow
* **Secondary Accent:** `#10b981` (Vibrant Emerald)
* **Text Primary:** `#f8fafc` (High-contrast Slate White)
* **Text Muted:** `#94a3b8` (Slate Neutral Muted)

---

## 3. Typography Hierarchy & Custom Fonts

### Font Optimization (`next/font/local`)
* **Display / Hero Headlines (`font-display`):** `Quera` (`src/fonts/quera.otf`, `--font-quera`)
* **Section Headings & Titles (`font-heading`):** `Gued` (`src/fonts/gued.otf`, `--font-gued`)
* **Body Copy & UI Labels (`font-sans`):** `Rondured` (`src/fonts/roundered.ttf`, `--font-roundered`)
* **System Fallbacks:** `system-ui, -apple-system, sans-serif` (Inter is strictly forbidden).

---

## 4. Light Brutalism & Glassmorphism Tokens

* **Brutalist Cards (`.brutalist-card`):**
  - Background `#0f121d`, 2px `#1e2436` border, offset shadow `shadow-[4px_4px_0px_0px_rgba(30,36,54,0.9)]`. Hover: border `#6366f1` and shadow `#6366f1`.
* **Brutalist Primary Buttons (`.brutalist-btn-primary`):**
  - Background `#6366f1`, border 2px `#4f46e5`, offset shadow `shadow-[3px_3px_0px_0px_#312e81]`.
* **Restrained Glass Panels (`.glass-panel`):**
  - Translucent background `rgba(15, 18, 29, 0.85)` with `backdrop-filter: blur(16px)`.

---

## 5. Navigation & Asset Upload Architecture

### Header Navigation (`app/components/Navbar.tsx`)
* **Floating Glass Pill Design:** Dynamic scroll detection (`window.scrollY > 20`) transitioning from `py-6 px-4` to `py-3 px-10` with a floating rounded pill backdrop (`rounded-[2rem] bg-[#0f121d]/85 backdrop-blur-xl border border-[#1e2436]`).
* **GSAP Entrance Animations:** GSAP context animations for `.nav-logo` and `.nav-item` stagger entrance on component mount.
* **Responsive Layout Padding:** All main page containers feature safe top padding (`pt-28 md:pt-32`) to prevent floating header overlaps across mobile, tablet, and desktop viewports.

### Image Asset Storage Engine (`@vercel/blob` + `/api/upload` API Route)
* **Vercel Blob Storage Integration:** Images (posters, community logos, user avatars) uploaded via `/api/upload` route using `@vercel/blob`.
* **Browser WebP Auto-Compression (`lib/upload.ts`):** Converts PNG, JPEG, GIF, AVIF, HEIC input images to WebP format in the browser (`image/webp` 0.82 quality) prior to uploading.
* **Database Table Link Persistence:** Public CDN links returned by Vercel Blob (`https://...public.blob.vercel-storage.com/...`) are stored directly in Supabase PostgreSQL table columns (`events.poster_url`, `communities.logo_url`, `profiles.avatar_url`).
